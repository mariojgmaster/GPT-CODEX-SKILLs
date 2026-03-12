import { access, cp, mkdir, mkdtemp, readdir, rename, rm } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import AdmZip from 'adm-zip';

import { getWorkspace, resolveSelection } from './catalog.js';
import { readSkillFrontmatter } from './frontmatter.js';
import { confirm } from './prompt.js';
import { loadRegistry, saveRegistry } from './registry.js';
import { resolveCodexPaths } from './codex-home.js';
import type {
  InstallAction,
  InstallRegistry,
  InstallScope,
  InstallSummary,
  RemoveSummary,
  RemoteCatalog,
  SkillManifest,
  WorkspaceManifest
} from './types.js';

interface InstallOptions {
  dryRun?: boolean;
  yes?: boolean;
  scope?: InstallScope;
  baseDir?: string;
}

interface LocalWorkspacePlan {
  workspaceRoot: string;
  topLevelEntries: string[];
  allRelativePaths: string[];
}

const LOCAL_PRESERVED_TOP_LEVEL = new Set(['.codex-utils', '.gitignore']);

async function exists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function ensureLocalWorkspaceTarget(target: string, operation: 'install' | 'remove'): void {
  if (target.includes('/')) {
    throw new Error(`Local scope only supports full workspace ${operation} operations.`);
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

async function walkRelativePaths(rootDir: string, prefix = ''): Promise<string[]> {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const results: string[] = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    results.push(relativePath);

    if (entry.isDirectory()) {
      results.push(...(await walkRelativePaths(path.join(rootDir, entry.name), relativePath)));
    }
  }

  return results;
}

async function describeWorkspaceRoot(
  extractedRoot: string,
  workspace: WorkspaceManifest
): Promise<LocalWorkspacePlan> {
  const workspaceRoot = path.join(extractedRoot, workspace.path);
  const entries = await readdir(workspaceRoot, { withFileTypes: true });
  const topLevelEntries = entries.map((entry) => entry.name).sort((a, b) => a.localeCompare(b));
  const allRelativePaths = await walkRelativePaths(workspaceRoot);

  return {
    workspaceRoot,
    topLevelEntries,
    allRelativePaths
  };
}

function isPreservedLocalEntry(entry: string): boolean {
  return LOCAL_PRESERVED_TOP_LEVEL.has(entry);
}

function filterRelevantTopLevelEntries(entries: string[]): string[] {
  return entries.filter((entry) => !isPreservedLocalEntry(entry));
}

function filterRelevantRelativePaths(paths: string[]): string[] {
  return paths.filter((relativePath) => {
    const topLevelEntry = relativePath.split('/')[0];
    return topLevelEntry ? !isPreservedLocalEntry(topLevelEntry) : false;
  });
}

function getInstalledWorkspaceName(registry: InstallRegistry): string | undefined {
  const installedWorkspaces = Array.from(new Set(Object.values(registry.installedSkills).map((entry) => entry.workspace)));

  if (installedWorkspaces.length > 1) {
    throw new Error('Local registry is inconsistent: more than one workspace is installed in this project.');
  }

  return installedWorkspaces[0];
}

function formatTree(paths: string[]): string {
  return paths
    .sort((left, right) => left.localeCompare(right))
    .map((relativePath) => {
      const depth = relativePath.split('/').length - 1;
      const indent = '  '.repeat(depth);
      const name = relativePath.split('/').at(-1) ?? relativePath;
      return `${indent}- ${name}`;
    })
    .join('\n');
}

async function validateWorkspaceSkills(extractedRoot: string, workspace: WorkspaceManifest): Promise<void> {
  for (const skill of workspace.skills) {
    await validateExtractedSkill(path.join(extractedRoot, skill.path), skill.name);
  }
}

async function installToLocalScope(
  remoteCatalog: RemoteCatalog,
  target: string,
  options: InstallOptions,
  extractedRoot: string
): Promise<InstallSummary> {
  ensureLocalWorkspaceTarget(target, 'install');

  const codexPaths = resolveCodexPaths('local', options.baseDir);
  const registry = await loadRegistry(codexPaths.registryPath, remoteCatalog.repoFullName);
  const selection = resolveSelection(remoteCatalog.manifest, target);
  const incomingPlan = await describeWorkspaceRoot(extractedRoot, selection.workspace);
  const existingWorkspaceName = getInstalledWorkspaceName(registry);
  const incomingRelevantEntries = filterRelevantTopLevelEntries(incomingPlan.topLevelEntries);

  await validateWorkspaceSkills(extractedRoot, selection.workspace);

  if (!existingWorkspaceName) {
    const unmanagedCollisions: string[] = [];

    for (const entry of incomingRelevantEntries) {
      const targetPath = path.join(codexPaths.installRoot, entry);
      if (await exists(targetPath)) {
        unmanagedCollisions.push(entry);
      }
    }

    if (unmanagedCollisions.length > 0) {
      if (options.dryRun) {
        return {
          scope: codexPaths.scope,
          workspace: selection.workspace.name,
          routerSkill: selection.workspace.routerSkill,
          sha: remoteCatalog.sha,
          repo: remoteCatalog.repoFullName,
          installed: selection.skills.map((skill) => ({
            name: skill.name,
            path: path.join(codexPaths.skillsDir, skill.name),
            action: 'replace-managed'
          }))
        };
      }

      if (options.yes) {
        throw new Error(
          `Local workspace replacement requires explicit interactive confirmation.\n` +
            `Conflicting project paths:\n${formatTree(unmanagedCollisions)}`
        );
      }

      const accepted = await confirm(
        `The following project paths will be replaced by workspace "${selection.workspace.name}":\n` +
          `${formatTree(unmanagedCollisions)}\n` +
          'Replace them?'
      );

      if (!accepted) {
        throw new Error('Local workspace installation cancelled.');
      }
    }
  } else if (existingWorkspaceName !== selection.workspace.name) {
    const existingWorkspace = getWorkspace(remoteCatalog.manifest, existingWorkspaceName);
    if (!existingWorkspace) {
      throw new Error(`Existing local workspace "${existingWorkspaceName}" is not present in the catalog.`);
    }

    const existingPlan = await describeWorkspaceRoot(extractedRoot, existingWorkspace);
    const removablePaths = filterRelevantRelativePaths(existingPlan.allRelativePaths);
    if (options.dryRun) {
      return {
        scope: codexPaths.scope,
        workspace: selection.workspace.name,
        routerSkill: selection.workspace.routerSkill,
        sha: remoteCatalog.sha,
        repo: remoteCatalog.repoFullName,
        installed: selection.skills.map((skill) => ({
          name: skill.name,
          path: path.join(codexPaths.skillsDir, skill.name),
          action: 'replace-managed'
        }))
      };
    }

    if (options.yes) {
      throw new Error(
        `Replacing a local workspace requires explicit interactive confirmation.\n` +
          `Paths scheduled for removal:\n${formatTree(removablePaths)}`
      );
    }

    const accepted = await confirm(
      `Another workspace is already installed locally: "${existingWorkspaceName}".\n` +
        `The following project paths will be removed before installing "${selection.workspace.name}":\n` +
        `${formatTree(removablePaths)}\n` +
        'Continue?'
    );

    if (!accepted) {
      throw new Error('Local workspace replacement cancelled.');
    }
  }

  if (options.dryRun) {
    return {
      scope: codexPaths.scope,
      workspace: selection.workspace.name,
      routerSkill: selection.workspace.routerSkill,
      sha: remoteCatalog.sha,
      repo: remoteCatalog.repoFullName,
      installed: selection.skills.map((skill) => ({
        name: skill.name,
        path: path.join(codexPaths.skillsDir, skill.name),
        action: existingWorkspaceName ? 'replace-managed' : 'install'
      }))
    };
  }

  await mkdir(codexPaths.stagingRoot, { recursive: true });
  const sessionStageRoot = await mkdtemp(path.join(codexPaths.stagingRoot, 'session-'));

  try {
    if (existingWorkspaceName && existingWorkspaceName !== selection.workspace.name) {
      const existingWorkspace = getWorkspace(remoteCatalog.manifest, existingWorkspaceName);
      if (!existingWorkspace) {
        throw new Error(`Existing local workspace "${existingWorkspaceName}" is not present in the catalog.`);
      }

      const existingPlan = await describeWorkspaceRoot(extractedRoot, existingWorkspace);
      const incomingEntrySet = new Set(incomingRelevantEntries);

      for (const entry of filterRelevantTopLevelEntries(existingPlan.topLevelEntries)) {
        if (!incomingEntrySet.has(entry)) {
          await rm(path.join(codexPaths.installRoot, entry), { recursive: true, force: true });
        }
      }

      for (const installed of Object.values(registry.installedSkills)) {
        delete registry.installedSkills[installed.name];
      }
    }

    for (const entry of incomingPlan.topLevelEntries) {
      if (isPreservedLocalEntry(entry) && (await exists(path.join(codexPaths.installRoot, entry)))) {
        continue;
      }

      const sourcePath = path.join(incomingPlan.workspaceRoot, entry);
      const stagedPath = path.join(sessionStageRoot, entry);
      const targetPath = path.join(codexPaths.installRoot, entry);

      await cp(sourcePath, stagedPath, { recursive: true });
      await atomicReplace(stagedPath, targetPath);
    }

    for (const skill of selection.skills) {
      registry.installedSkills[skill.name] = {
        name: skill.name,
        workspace: selection.workspace.name,
        sourceRepo: remoteCatalog.repoFullName,
        sourcePath: skill.path,
        sha: remoteCatalog.sha,
        installedAt: new Date().toISOString(),
        localPath: path.join(codexPaths.skillsDir, skill.name)
      };
    }

    await saveRegistry(codexPaths.registryPath, registry);

    return {
      scope: codexPaths.scope,
      workspace: selection.workspace.name,
      routerSkill: selection.workspace.routerSkill,
      sha: remoteCatalog.sha,
      repo: remoteCatalog.repoFullName,
      installed: selection.skills.map((skill) => ({
        name: skill.name,
        path: path.join(codexPaths.skillsDir, skill.name),
        action: existingWorkspaceName ? 'replace-managed' : 'install'
      }))
    };
  } finally {
    await rm(sessionStageRoot, { recursive: true, force: true });
  }
}

async function removeFromLocalScope(
  remoteCatalog: RemoteCatalog,
  target: string,
  options: InstallOptions,
  extractedRoot: string
): Promise<RemoveSummary> {
  ensureLocalWorkspaceTarget(target, 'remove');

  const codexPaths = resolveCodexPaths('local', options.baseDir);
  const registry = await loadRegistry(codexPaths.registryPath, remoteCatalog.repoFullName);
  const selection = resolveSelection(remoteCatalog.manifest, target);
  const installedWorkspaceName = getInstalledWorkspaceName(registry);

  if (!installedWorkspaceName || installedWorkspaceName !== selection.workspace.name) {
    return {
      scope: codexPaths.scope,
      workspace: selection.workspace.name,
      routerSkill: selection.workspace.routerSkill,
      removed: selection.skills.map((skill) => ({
        name: skill.name,
        path: path.join(codexPaths.skillsDir, skill.name),
        action: 'skip-missing'
      }))
    };
  }

  const workspacePlan = await describeWorkspaceRoot(extractedRoot, selection.workspace);

  for (const entry of filterRelevantTopLevelEntries(workspacePlan.topLevelEntries)) {
    await rm(path.join(codexPaths.installRoot, entry), { recursive: true, force: true });
  }

  const removed = selection.skills.map((skill) => {
    delete registry.installedSkills[skill.name];
    return {
      name: skill.name,
      path: path.join(codexPaths.skillsDir, skill.name),
      action: 'remove-managed' as const
    };
  });

  await saveRegistry(codexPaths.registryPath, registry);

  return {
    scope: codexPaths.scope,
    workspace: selection.workspace.name,
    routerSkill: selection.workspace.routerSkill,
    removed
  };
}

export async function installFromRemote(
  remoteCatalog: RemoteCatalog,
  target: string,
  options: InstallOptions = {}
): Promise<InstallSummary> {
  const scope = options.scope ?? 'global';

  if (scope === 'local') {
    const archiveBuffer = await remoteCatalog.downloadArchive();
    const extractedRoot = await extractArchive(archiveBuffer);

    try {
      return await installToLocalScope(remoteCatalog, target, options, extractedRoot);
    } finally {
      await rm(path.dirname(extractedRoot), { recursive: true, force: true });
    }
  }

  const codexPaths = resolveCodexPaths(scope, options.baseDir);
  const registry = await loadRegistry(codexPaths.registryPath, remoteCatalog.repoFullName);
  const selection = resolveSelection(remoteCatalog.manifest, target);
  const managedInstalls = new Set(Object.keys(registry.installedSkills));

  const initialActions = buildActions(selection.skills, codexPaths.skillsDir, managedInstalls);
  const plannedActions = await inspectActionConflicts(initialActions);
  const finalActions = await resolveConflicts(plannedActions, options);

  if (options.dryRun) {
    return {
      scope: codexPaths.scope,
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
      scope: codexPaths.scope,
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

export async function removeFromRemote(
  remoteCatalog: RemoteCatalog,
  target: string,
  options: InstallOptions = {}
): Promise<RemoveSummary> {
  const scope = options.scope ?? 'global';

  if (scope === 'local') {
    const archiveBuffer = await remoteCatalog.downloadArchive();
    const extractedRoot = await extractArchive(archiveBuffer);

    try {
      return await removeFromLocalScope(remoteCatalog, target, options, extractedRoot);
    } finally {
      await rm(path.dirname(extractedRoot), { recursive: true, force: true });
    }
  }

  const codexPaths = resolveCodexPaths(scope, options.baseDir);
  const registry = await loadRegistry(codexPaths.registryPath, remoteCatalog.repoFullName);
  const selection = resolveSelection(remoteCatalog.manifest, target);

  const removed: RemoveSummary['removed'] = [];

  for (const skill of selection.skills) {
    const targetPath = path.join(codexPaths.skillsDir, skill.name);
    const managed = registry.installedSkills[skill.name];
    const targetExists = await exists(targetPath);

    if (!targetExists) {
      delete registry.installedSkills[skill.name];
      removed.push({
        name: skill.name,
        path: targetPath,
        action: 'skip-missing'
      });
      continue;
    }

    if (!managed) {
      if (options.yes) {
        await rm(targetPath, { recursive: true, force: true });
        removed.push({
          name: skill.name,
          path: targetPath,
          action: 'remove-unmanaged'
        });
        continue;
      }

      const accepted = await confirm(
        `Skill "${skill.name}" exists in the selected scope but is not managed by this CLI. Remove it anyway?`
      );

      if (!accepted) {
        removed.push({
          name: skill.name,
          path: targetPath,
          action: 'skip-missing'
        });
        continue;
      }

      await rm(targetPath, { recursive: true, force: true });
      removed.push({
        name: skill.name,
        path: targetPath,
        action: 'remove-unmanaged'
      });
      continue;
    }

    await rm(targetPath, { recursive: true, force: true });
    delete registry.installedSkills[skill.name];
    removed.push({
      name: skill.name,
      path: targetPath,
      action: 'remove-managed'
    });
  }

  await saveRegistry(codexPaths.registryPath, registry);

  return {
    scope: codexPaths.scope,
    workspace: selection.workspace.name,
    routerSkill: selection.workspace.routerSkill,
    removed
  };
}
