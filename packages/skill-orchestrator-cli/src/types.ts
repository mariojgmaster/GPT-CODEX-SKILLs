import { z } from 'zod';

export const SkillManifestSchema = z.object({
  name: z.string().min(1),
  path: z.string().min(1),
  description: z.string().min(1),
  workspace: z.string().min(1),
  defaultInstall: z.boolean()
});

export const WorkspaceManifestSchema = z.object({
  name: z.string().min(1),
  path: z.string().min(1),
  description: z.string().min(1),
  routerSkill: z.string().min(1),
  skills: z.array(SkillManifestSchema).min(1)
});

export const CatalogManifestSchema = z.object({
  schemaVersion: z.literal(1),
  sourceRepo: z.string().min(1),
  defaultBranch: z.string().min(1),
  workspaces: z.array(WorkspaceManifestSchema).min(1)
});

export const RegistrySkillSchema = z.object({
  name: z.string().min(1),
  workspace: z.string().min(1),
  sourceRepo: z.string().min(1),
  sourcePath: z.string().min(1),
  sha: z.string().min(1),
  installedAt: z.string().datetime(),
  localPath: z.string().min(1)
});

export const InstallRegistrySchema = z.object({
  schemaVersion: z.literal(1),
  sourceRepo: z.string().min(1),
  installedSkills: z.record(RegistrySkillSchema)
});

export type SkillManifest = z.infer<typeof SkillManifestSchema>;
export type WorkspaceManifest = z.infer<typeof WorkspaceManifestSchema>;
export type CatalogManifest = z.infer<typeof CatalogManifestSchema>;
export type RegistrySkill = z.infer<typeof RegistrySkillSchema>;
export type InstallRegistry = z.infer<typeof InstallRegistrySchema>;

export type DoctorSeverity = 'error' | 'warning';

export interface DoctorIssue {
  code: string;
  severity: DoctorSeverity;
  message: string;
  path?: string;
}

export interface DoctorResult {
  ok: boolean;
  issues: DoctorIssue[];
}

export interface CodexPaths {
  codexHome: string;
  skillsDir: string;
  orchestratorDir: string;
  registryPath: string;
  stagingRoot: string;
}

export interface RemoteCatalog {
  repoFullName: string;
  owner: string;
  repo: string;
  defaultBranch: string;
  sha: string;
  manifest: CatalogManifest;
  downloadArchive(): Promise<Buffer>;
}

export interface InstallAction {
  type: 'install' | 'replace-managed' | 'conflict';
  skill: SkillManifest;
  targetPath: string;
  managed: boolean;
}

export interface InstallSummary {
  workspace: string;
  routerSkill: string;
  sha: string;
  repo: string;
  installed: Array<{
    name: string;
    path: string;
    action: InstallAction['type'];
  }>;
}

