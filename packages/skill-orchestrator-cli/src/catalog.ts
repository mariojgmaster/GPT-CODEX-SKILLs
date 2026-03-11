import path from 'node:path';
import { readFile } from 'node:fs/promises';

import {
  CatalogManifestSchema,
  type CatalogManifest,
  type SkillManifest,
  type WorkspaceManifest
} from './types.js';

const CATALOG_MANIFEST = 'catalog.manifest.json';

export async function loadLocalManifest(repoRoot: string): Promise<CatalogManifest> {
  const manifestPath = path.join(repoRoot, CATALOG_MANIFEST);
  const raw = await readFile(manifestPath, 'utf8');
  return CatalogManifestSchema.parse(JSON.parse(raw));
}

export function getWorkspace(
  manifest: CatalogManifest,
  workspaceName: string
): WorkspaceManifest | undefined {
  return manifest.workspaces.find((workspace) => workspace.name === workspaceName);
}

export function getSkill(
  manifest: CatalogManifest,
  workspaceName: string,
  skillName: string
): SkillManifest | undefined {
  return getWorkspace(manifest, workspaceName)?.skills.find((skill) => skill.name === skillName);
}

export function resolveSelection(
  manifest: CatalogManifest,
  target: string
): { workspace: WorkspaceManifest; skills: SkillManifest[] } {
  const [workspaceName, skillName] = target.split('/');
  const workspace = getWorkspace(manifest, workspaceName);

  if (!workspace) {
    throw new Error(`Workspace "${workspaceName}" not found in catalog`);
  }

  if (!skillName) {
    return {
      workspace,
      skills: workspace.skills.filter((skill) => skill.defaultInstall)
    };
  }

  const skill = workspace.skills.find((entry) => entry.name === skillName);
  if (!skill) {
    throw new Error(`Skill "${skillName}" not found in workspace "${workspaceName}"`);
  }

  return {
    workspace,
    skills: [skill]
  };
}

export function listInstalledByWorkspace(
  manifest: CatalogManifest,
  installedNames: Set<string>
): Array<WorkspaceManifest & { installedCount: number }> {
  return manifest.workspaces.map((workspace) => ({
    ...workspace,
    installedCount: workspace.skills.filter((skill) => installedNames.has(skill.name)).length
  }));
}

