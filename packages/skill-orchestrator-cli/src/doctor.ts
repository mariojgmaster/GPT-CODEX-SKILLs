import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { constants as fsConstants } from 'node:fs';

import { loadLocalManifest } from './catalog.js';
import { readSkillFrontmatter } from './frontmatter.js';
import { loadRegistry } from './registry.js';
import { resolveCodexPaths } from './codex-home.js';
import type { CatalogManifest, DoctorIssue, DoctorResult, WorkspaceManifest } from './types.js';

const REQUIRED_WORKSPACE_FILES = ['AGENTS.md', '.gitignore', '.codex-utils/README.md', 'skills'];

async function exists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function issue(code: string, message: string, pathValue?: string, severity: DoctorIssue['severity'] = 'error'): DoctorIssue {
  return {
    code,
    message,
    path: pathValue,
    severity
  };
}

function parseAgentsEntries(content: string): Map<string, string> {
  const entries = new Map<string, string>();
  const regex = /^- ([a-z0-9-]+): .*?\(file: (skills\/[^)]+)\)$/gm;

  for (const match of content.matchAll(regex)) {
    entries.set(match[1], match[2]);
  }

  return entries;
}

async function validateWorkspace(
  repoRoot: string,
  manifest: CatalogManifest,
  workspace: WorkspaceManifest,
  issues: DoctorIssue[]
): Promise<void> {
  const workspaceRoot = path.join(repoRoot, workspace.path);

  for (const relative of REQUIRED_WORKSPACE_FILES) {
    const target = path.join(workspaceRoot, relative);
    if (!(await exists(target))) {
      issues.push(issue('workspace.missing-required', `Missing workspace required path: ${relative}`, target));
    }
  }

  const agentsPath = path.join(workspaceRoot, 'AGENTS.md');
  if (!(await exists(agentsPath))) {
    return;
  }

  const agentsContent = await readFile(agentsPath, 'utf8');
  const agentsEntries = parseAgentsEntries(agentsContent);
  const manifestEntries = new Map(
    workspace.skills.map((skill) => [skill.name, path.relative(workspaceRoot, path.join(repoRoot, skill.path)).replace(/\\/g, '/') + '/SKILL.md'])
  );

  for (const skill of workspace.skills) {
    const skillDir = path.join(repoRoot, skill.path);
    const skillMdPath = path.join(skillDir, 'SKILL.md');

    if (!(await exists(skillDir))) {
      issues.push(issue('skill.missing-dir', `Skill directory not found for ${skill.name}`, skillDir));
      continue;
    }

    if (!(await exists(skillMdPath))) {
      issues.push(issue('skill.missing-skill-md', `SKILL.md not found for ${skill.name}`, skillMdPath));
      continue;
    }

    try {
      const frontmatter = await readSkillFrontmatter(skillMdPath);
      if (frontmatter.name !== skill.name) {
        issues.push(
          issue(
            'skill.name-mismatch',
            `Manifest name "${skill.name}" does not match frontmatter name "${frontmatter.name}"`,
            skillMdPath
          )
        );
      }
    } catch (error) {
      issues.push(issue('skill.invalid-frontmatter', (error as Error).message, skillMdPath));
    }

    const expectedAgentsPath = `skills/${path.basename(skill.path)}/SKILL.md`;
    const actualAgentsPath = agentsEntries.get(skill.name);

    if (!actualAgentsPath) {
      issues.push(issue('agents.missing-entry', `AGENTS.md missing entry for ${skill.name}`, agentsPath));
    } else if (actualAgentsPath !== expectedAgentsPath) {
      issues.push(
        issue(
          'agents.path-mismatch',
          `AGENTS.md path mismatch for ${skill.name}: expected ${expectedAgentsPath}, got ${actualAgentsPath}`,
          agentsPath
        )
      );
    }
  }

  for (const [name] of agentsEntries) {
    if (!manifestEntries.has(name)) {
      issues.push(issue('agents.extra-entry', `AGENTS.md references unknown skill ${name}`, agentsPath));
    }
  }

  if (!workspace.skills.some((skill) => skill.name === workspace.routerSkill)) {
    issues.push(issue('workspace.missing-router', `Router skill "${workspace.routerSkill}" not found in workspace manifest`, workspaceRoot));
  }
}

export async function doctorRepo(repoRoot: string): Promise<DoctorResult> {
  const manifest = await loadLocalManifest(repoRoot);
  const issues: DoctorIssue[] = [];
  const seenSkillNames = new Set<string>();

  for (const workspace of manifest.workspaces) {
    await validateWorkspace(repoRoot, manifest, workspace, issues);

    for (const skill of workspace.skills) {
      if (seenSkillNames.has(skill.name)) {
        issues.push(issue('manifest.duplicate-skill', `Duplicate skill name found in catalog: ${skill.name}`, skill.path));
      }
      seenSkillNames.add(skill.name);
    }
  }

  return {
    ok: !issues.some((entry) => entry.severity === 'error'),
    issues
  };
}

export async function doctorInstalled(): Promise<DoctorResult> {
  const codexPaths = resolveCodexPaths();
  const issues: DoctorIssue[] = [];
  const registry = await loadRegistry(codexPaths.registryPath, 'mariojgmaster/GPT-CODEX-SKILLs');

  for (const skill of Object.values(registry.installedSkills)) {
    if (!(await exists(skill.localPath))) {
      issues.push(issue('installed.missing-dir', `Registered installed skill not found on disk: ${skill.name}`, skill.localPath));
      continue;
    }

    const skillMdPath = path.join(skill.localPath, 'SKILL.md');
    if (!(await exists(skillMdPath))) {
      issues.push(issue('installed.missing-skill-md', `Installed skill is missing SKILL.md: ${skill.name}`, skillMdPath));
    }
  }

  if (await exists(codexPaths.skillsDir)) {
    const entries = await readdir(codexPaths.skillsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const localPath = path.join(codexPaths.skillsDir, entry.name);
      const skillMdPath = path.join(localPath, 'SKILL.md');
      if (!(await exists(skillMdPath))) {
        continue;
      }

      if (!registry.installedSkills[entry.name]) {
        issues.push(
          issue(
            'installed.untracked-skill',
            `Skill exists on disk but is not managed by the local registry: ${entry.name}`,
            localPath,
            'warning'
          )
        );
      }
    }
  }

  return {
    ok: !issues.some((entry) => entry.severity === 'error'),
    issues
  };
}
