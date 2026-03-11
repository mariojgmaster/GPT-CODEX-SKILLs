import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { resolveCodexPaths } from '../src/codex-home.js';

const originalCodexHome = process.env.CODEX_HOME;

afterEach(() => {
  if (originalCodexHome === undefined) {
    delete process.env.CODEX_HOME;
  } else {
    process.env.CODEX_HOME = originalCodexHome;
  }
});

describe('resolveCodexPaths', () => {
  it('uses CODEX_HOME when provided', () => {
    process.env.CODEX_HOME = path.join('C:', 'tmp', 'codex-home');
    const paths = resolveCodexPaths();

    expect(paths.codexHome).toBe(path.resolve(process.env.CODEX_HOME));
    expect(paths.skillsDir).toBe(path.join(path.resolve(process.env.CODEX_HOME), 'skills'));
  });

  it('falls back to ~/.codex', () => {
    delete process.env.CODEX_HOME;
    const paths = resolveCodexPaths();

    expect(paths.codexHome).toBe(path.join(os.homedir(), '.codex'));
    expect(paths.registryPath).toBe(path.join(os.homedir(), '.codex', 'skill-orchestrator', 'registry.json'));
  });
});

