import os from 'node:os';
import path from 'node:path';

import type { CodexPaths, InstallScope } from './types.js';

export function resolveCodexPaths(scope: InstallScope = 'global', baseDir: string = process.cwd()): CodexPaths {
  const installRoot = scope === 'local' ? path.resolve(baseDir) : undefined;
  const codexHome =
    scope === 'local'
      ? path.resolve(baseDir, '.codex')
      : process.env.CODEX_HOME
        ? path.resolve(process.env.CODEX_HOME)
        : path.join(os.homedir(), '.codex');

  const orchestratorDir = path.join(codexHome, 'skill-orchestrator');

  return {
    scope,
    codexHome,
    installRoot: installRoot ?? codexHome,
    skillsDir: scope === 'local' ? path.join(path.resolve(baseDir), 'skills') : path.join(codexHome, 'skills'),
    orchestratorDir,
    registryPath: path.join(orchestratorDir, 'registry.json'),
    stagingRoot: path.join(orchestratorDir, 'staging')
  };
}
