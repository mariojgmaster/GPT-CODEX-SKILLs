import { access, cp, mkdir, mkdtemp, readdir, rename, rm } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import AdmZip from 'adm-zip';

import { resolveSelection } from './catalog.js';
import { readSkillFrontmatter } from './frontmatter.js';
import { confirm } from './prompt.js';
import { loadRegistry, saveRegistry } from './registry.js';
import { resolveCodexPaths } from './codex-home.js';
import type { InstallAction, InstallSummary, RemoteCatalog, SkillManifest } from './types.js';

interface InstallOptions {
  dryRun?: boolean;
  yes?: boolean;
}

async function exists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function buildActions(
  skills: SkillManifest[],
  skillsDir: string,
  managedInstalls: Set<string>
): InstallAction[] {
  return skills.map((skill) => {
    const targetPath = path.join(skillsDir, skill.name);
    const managed = managedInstalls.has(skill.name);

    return {
      skill,
      targetPath,
      managed,
      type: 'install'
    };
  });
}

async function inspectActionConflicts(actions: InstallAction[]): Promise<InstallAction[]> {
  const next: InstallAction[] = [];

  for (const action of actions) {
    if (await exists(action.targetPath)) {
      next.push({
        ...action,
        type: action.managed ? 'replace-managed' : 'conflict'
      });
      continue;
    }

    next.push(action);
  }

  return next;
}

async function extractArchive(buffer: Buffer): Promise<string> {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'skill-orchestrator-archive-'));
  const zip = new AdmZip(buffer);
  zip.extractAllTo(tempRoot, true);
  const entries = await readdir(tempRoot, { withFileTypes: true });
  const rootDir = entries.find((entry) => entry.isDirectory());

  if (!rootDir) {
    throw new Error('Archive did not contain a root directory');
  }

  return path.join(tempRoot, rootDir.name);
}

async function atomicReplace(sourceDir: string, targetDir: string): Promise<void> {
  const backupDir = `${targetDir}.backup-${Date.now()}`;
  const targetExists = await exists(targetDir);

  if (targetExists) {
    await rename(targetDir, backupDir);
  }

  try {
    await rename(sourceDir, targetDir);
    if (targetExists) {
      await rm(backupDir, { recursive: true, force: true });
    }
  } catch (error) {
    if (targetExists && (await exists(backupDir))) {
      await rename(backupDir, targetDir);
    }
    throw error;
  }
}

async function validateExtractedSkill(sourceDir: string, expectedName: string): Promise<void> {
  const skillMdPath = path.join(sourceDir, 'SKILL.md');
  const frontmatter = await readSkillFrontmatter(skillMdPath);

  if (frontmatter.name !== expectedName) {
    throw new Error(`Extracted skill "${frontmatter.name}" does not match expected name "${expectedName}"`);
  }
}

async function resolveConflicts(actions: InstallAction[], options: InstallOptions): Promise<InstallAction[]> {
  const resolved: InstallAction[] = [];

  for (const action of actions) {
    if (action.type !== 'conflict') {
      resolved.push(action);
      continue;
    }

    if (options.yes) {
      throw new Error(`Unmanaged conflict for ${action.skill.name}. Remove the existing skill or run interactively.`);
    }

    const accepted = await confirm(
      `Skill "${action.skill.name}" already exists in Codex home and is not managed by this CLI. Replace it?`
    );

    if (!accepted) {
      continue;
    }

    resolved.push({
      ...action,
      type: 'install'
    });
  }

  return resolved;
}

export async function installFromRemote(
  remoteCatalog: RemoteCatalog,
  target: string,
  options: InstallOptions = {}
): Promise<InstallSummary> {
  const codexPaths = resolveCodexPaths();
  const registry = await loadRegistry(codexPaths.registryPath, remoteCatalog.repoFullName);
  const selection = resolveSelection(remoteCatalog.manifest, target);
  const managedInstalls = new Set(Object.keys(registry.installedSkills));

  const initialActions = buildActions(selection.skills, codexPaths.skillsDir, managedInstalls);
  const plannedActions = await inspectActionConflicts(initialActions);
  const finalActions = await resolveConflicts(plannedActions, options);

  if (options.dryRun) {
    return {
      workspace: selection.workspace.name,
      routerSkill: selection.workspace.routerSkill,
      sha: remoteCatalog.sha,
      repo: remoteCatalog.repoFullName,
      installed: finalActions.map((action) => ({
        name: action.skill.name,
        path: action.targetPath,
        action: action.type
      }))
    };
  }

  await mkdir(codexPaths.skillsDir, { recursive: true });
  await mkdir(codexPaths.stagingRoot, { recursive: true });

  const archiveBuffer = await remoteCatalog.downloadArchive();
  const extractedRoot = await extractArchive(archiveBuffer);
  const sessionStageRoot = await mkdtemp(path.join(codexPaths.stagingRoot, 'session-'));

  try {
    for (const action of finalActions) {
      const sourceDir = path.join(extractedRoot, action.skill.path);
      const stagedDir = path.join(sessionStageRoot, action.skill.name);

      await validateExtractedSkill(sourceDir, action.skill.name);
      await cp(sourceDir, stagedDir, { recursive: true });

      if (action.type === 'install' && (await exists(action.targetPath))) {
        await rm(action.targetPath, { recursive: true, force: true });
      }

      await atomicReplace(stagedDir, action.targetPath);

      registry.installedSkills[action.skill.name] = {
        name: action.skill.name,
        workspace: action.skill.workspace,
        sourceRepo: remoteCatalog.repoFullName,
        sourcePath: action.skill.path,
        sha: remoteCatalog.sha,
        installedAt: new Date().toISOString(),
        localPath: action.targetPath
      };
    }

    await saveRegistry(codexPaths.registryPath, registry);

    return {
      workspace: selection.workspace.name,
      routerSkill: selection.workspace.routerSkill,
      sha: remoteCatalog.sha,
      repo: remoteCatalog.repoFullName,
      installed: finalActions.map((action) => ({
        name: action.skill.name,
        path: action.targetPath,
        action: action.type
      }))
    };
  } finally {
    await rm(sessionStageRoot, { recursive: true, force: true });
    await rm(path.dirname(extractedRoot), { recursive: true, force: true });
  }
}
