import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import AdmZip from 'adm-zip';
import { afterEach, describe, expect, it } from 'vitest';

import { installFromRemote, removeFromRemote } from '../src/install.js';
import type { CatalogManifest, RemoteCatalog } from '../src/types.js';

const tempDirs: string[] = [];
const originalCodexHome = process.env.CODEX_HOME;

afterEach(async () => {
  if (originalCodexHome === undefined) {
    delete process.env.CODEX_HOME;
  } else {
    process.env.CODEX_HOME = originalCodexHome;
  }

  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

function createRemoteCatalog(zipBuffer: Buffer): RemoteCatalog {
  const manifest: CatalogManifest = {
    schemaVersion: 1,
    sourceRepo: 'owner/repo',
    defaultBranch: 'main',
    workspaces: [
      {
        name: 'demo',
        path: 'demo',
        description: 'Demo workspace',
        routerSkill: 'demo-router',
        skills: [
          {
            name: 'demo-router',
            path: 'demo/skills/demo-router',
            description: 'Demo router skill',
            workspace: 'demo',
            defaultInstall: true
          }
        ]
      }
    ]
  };

  return {
    repoFullName: manifest.sourceRepo,
    owner: 'owner',
    repo: 'repo',
    defaultBranch: manifest.defaultBranch,
    sha: 'abc123',
    manifest,
    downloadArchive: async () => zipBuffer
  };
}

function createArchiveBuffer(): Buffer {
  const zip = new AdmZip();
  zip.addFile('owner-repo-abc123/demo/skills/demo-router/SKILL.md', Buffer.from('---\nname: demo-router\ndescription: Demo router skill.\n---\n\n# Demo\n'));
  zip.addFile('owner-repo-abc123/demo/skills/demo-router/agents/standard.md', Buffer.from('# agent\n'));
  return zip.toBuffer();
}

describe('installFromRemote', () => {
  it('supports dry-run without writing files', async () => {
    const codexHome = await mkdtemp(path.join(os.tmpdir(), 'skill-orchestrator-codex-'));
    tempDirs.push(codexHome);
    process.env.CODEX_HOME = codexHome;

    const summary = await installFromRemote(createRemoteCatalog(createArchiveBuffer()), 'demo', { dryRun: true });

    expect(summary.workspace).toBe('demo');
    expect(summary.installed).toHaveLength(1);
    expect(summary.installed[0]?.action).toBe('install');
  });

  it('installs a skill and registers it in the local registry', async () => {
    const codexHome = await mkdtemp(path.join(os.tmpdir(), 'skill-orchestrator-codex-'));
    tempDirs.push(codexHome);
    process.env.CODEX_HOME = codexHome;

    const summary = await installFromRemote(createRemoteCatalog(createArchiveBuffer()), 'demo');
    const skillPath = path.join(codexHome, 'skills', 'demo-router');
    const registryPath = path.join(codexHome, 'skill-orchestrator', 'registry.json');

    expect(summary.installed).toHaveLength(1);
    expect(await readFile(path.join(skillPath, 'SKILL.md'), 'utf8')).toContain('name: demo-router');

    const registry = JSON.parse(await readFile(registryPath, 'utf8')) as {
      installedSkills: Record<string, { sha: string }>;
    };

    expect(registry.installedSkills['demo-router']?.sha).toBe('abc123');
  });

  it('blocks unmanaged conflicts in non-interactive mode', async () => {
    const codexHome = await mkdtemp(path.join(os.tmpdir(), 'skill-orchestrator-codex-'));
    tempDirs.push(codexHome);
    process.env.CODEX_HOME = codexHome;

    await mkdir(path.join(codexHome, 'skills', 'demo-router'), { recursive: true });
    await writeFile(path.join(codexHome, 'skills', 'demo-router', 'SKILL.md'), '---\nname: demo-router\ndescription: existing\n---\n');

    await expect(
      installFromRemote(createRemoteCatalog(createArchiveBuffer()), 'demo', { yes: true })
    ).rejects.toThrow(/Unmanaged conflict/);
  });

  it('installs to local scope when requested', async () => {
    const repoRoot = await mkdtemp(path.join(os.tmpdir(), 'skill-orchestrator-repo-'));
    tempDirs.push(repoRoot);

    const summary = await installFromRemote(createRemoteCatalog(createArchiveBuffer()), 'demo', {
      scope: 'local',
      baseDir: repoRoot
    });

    expect(summary.scope).toBe('local');
    expect(await readFile(path.join(repoRoot, '.codex', 'skills', 'demo-router', 'SKILL.md'), 'utf8')).toContain(
      'name: demo-router'
    );
  });

  it('removes a managed skill from the selected scope', async () => {
    const codexHome = await mkdtemp(path.join(os.tmpdir(), 'skill-orchestrator-codex-'));
    tempDirs.push(codexHome);
    process.env.CODEX_HOME = codexHome;

    await installFromRemote(createRemoteCatalog(createArchiveBuffer()), 'demo');
    const summary = await removeFromRemote(createRemoteCatalog(createArchiveBuffer()), 'demo', { yes: true });

    expect(summary.removed[0]?.action).toBe('remove-managed');
    await expect(readFile(path.join(codexHome, 'skills', 'demo-router', 'SKILL.md'), 'utf8')).rejects.toThrow();
  });
});
