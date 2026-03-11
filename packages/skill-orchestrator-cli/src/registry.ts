import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { InstallRegistrySchema, type InstallRegistry } from './types.js';

export function createEmptyRegistry(sourceRepo: string): InstallRegistry {
  return {
    schemaVersion: 1,
    sourceRepo,
    installedSkills: {}
  };
}

export async function loadRegistry(
  registryPath: string,
  sourceRepo: string
): Promise<InstallRegistry> {
  try {
    const raw = await readFile(registryPath, 'utf8');
    return InstallRegistrySchema.parse(JSON.parse(raw));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return createEmptyRegistry(sourceRepo);
    }
    throw error;
  }
}

export async function saveRegistry(registryPath: string, registry: InstallRegistry): Promise<void> {
  await mkdir(path.dirname(registryPath), { recursive: true });
  await writeFile(registryPath, JSON.stringify(registry, null, 2) + '\n', 'utf8');
}

