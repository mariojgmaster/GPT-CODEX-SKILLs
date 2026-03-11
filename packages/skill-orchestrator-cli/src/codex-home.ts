import os from 'node:os';
import path from 'node:path';

import type { CodexPaths } from './types.js';

export function resolveCodexPaths(): CodexPaths {
  const codexHome = process.env.CODEX_HOME
    ? path.resolve(process.env.CODEX_HOME)
    : path.join(os.homedir(), '.codex');

  const orchestratorDir = path.join(codexHome, 'skill-orchestrator');

  return {
    codexHome,
    skillsDir: path.join(codexHome, 'skills'),
    orchestratorDir,
    registryPath: path.join(orchestratorDir, 'registry.json'),
    stagingRoot: path.join(orchestratorDir, 'staging')
  };
}

