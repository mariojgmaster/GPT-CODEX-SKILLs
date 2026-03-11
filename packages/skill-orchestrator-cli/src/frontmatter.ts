import { readFile } from 'node:fs/promises';
import YAML from 'yaml';

export interface SkillFrontmatter {
  name: string;
  description: string;
}

export function parseSkillFrontmatter(content: string): SkillFrontmatter {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    throw new Error('Missing YAML frontmatter');
  }

  const parsed = YAML.parse(match[1]);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid frontmatter object');
  }

  if (typeof parsed.name !== 'string' || parsed.name.trim() === '') {
    throw new Error('Frontmatter "name" is required');
  }

  if (typeof parsed.description !== 'string' || parsed.description.trim() === '') {
    throw new Error('Frontmatter "description" is required');
  }

  return {
    name: parsed.name.trim(),
    description: parsed.description.trim()
  };
}

export async function readSkillFrontmatter(skillMdPath: string): Promise<SkillFrontmatter> {
  const content = await readFile(skillMdPath, 'utf8');
  return parseSkillFrontmatter(content);
}

