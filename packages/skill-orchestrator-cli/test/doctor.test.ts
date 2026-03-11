import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { doctorRepo } from '../src/doctor.js';

const tempDirs: string[] = [];

afterEach(async () => {
  const { rm } = await import('node:fs/promises');
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

function getRepoRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
}

describe('doctorRepo', () => {
  it('accepts the current repository catalog', async () => {
    const result = await doctorRepo(getRepoRoot());

    expect(result.ok).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it('detects missing skill directories from the manifest', async () => {
    const repoRoot = await mkdtemp(path.join(os.tmpdir(), 'skill-orchestrator-doctor-'));
    tempDirs.push(repoRoot);

    await writeFile(
      path.join(repoRoot, 'catalog.manifest.json'),
      JSON.stringify(
        {
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
                  description: 'Demo router',
                  workspace: 'demo',
                  defaultInstall: true
                }
              ]
            }
          ]
        },
        null,
        2
      ),
      'utf8'
    );

    await mkdir(path.join(repoRoot, 'demo', '.codex-utils'), { recursive: true });
    await mkdir(path.join(repoRoot, 'demo', 'skills'), { recursive: true });
    await writeFile(path.join(repoRoot, 'demo', 'AGENTS.md'), '- demo-router: Demo router. (file: skills/demo-router/SKILL.md)\n', 'utf8');
    await writeFile(path.join(repoRoot, 'demo', '.gitignore'), '.codex-utils/**\n', 'utf8');
    await writeFile(path.join(repoRoot, 'demo', '.codex-utils', 'README.md'), 'helpers\n', 'utf8');

    const result = await doctorRepo(repoRoot);

    expect(result.ok).toBe(false);
    expect(result.issues.some((entry) => entry.code === 'skill.missing-dir')).toBe(true);
  });
});
