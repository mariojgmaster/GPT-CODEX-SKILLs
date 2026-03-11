#!/usr/bin/env node
import { Command } from 'commander';
import path from 'node:path';

import { loadRegistry } from './registry.js';
import { resolveCodexPaths } from './codex-home.js';
import { doctorInstalled, doctorRepo } from './doctor.js';
import { GitHubCatalogSource } from './github.js';
import { installFromRemote, removeFromRemote } from './install.js';

function printJson(payload: unknown): void {
  process.stdout.write(JSON.stringify(payload, null, 2) + '\n');
}

function formatIssues(result: Awaited<ReturnType<typeof doctorRepo>>): string {
  if (result.issues.length === 0) {
    return 'No issues found.';
  }

  return result.issues
    .map((entry) => `- [${entry.severity}] ${entry.code}: ${entry.message}${entry.path ? ` (${entry.path})` : ''}`)
    .join('\n');
}

async function run(): Promise<void> {
  const program = new Command();

  program
    .name('codex-skills')
    .description('List, install, and validate Codex skills from the GPT-CODEX-SKILLs catalog.')
    .showHelpAfterError();

  program
    .command('list')
    .description('List remote or locally installed skills.')
    .option('--workspace <name>', 'Filter by workspace')
    .option('--installed', 'Read only the local install registry')
    .option('--scope <scope>', 'Install scope for local registry lookup: global or local', 'global')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      if (options.installed) {
        const codexPaths = resolveCodexPaths(options.scope, process.cwd());
        const registry = await loadRegistry(codexPaths.registryPath, 'mariojgmaster/GPT-CODEX-SKILLs');
        const installed = Object.values(registry.installedSkills).filter((skill) =>
          options.workspace ? skill.workspace === options.workspace : true
        );

        if (options.json) {
          printJson({
            source: 'installed',
            skills: installed
          });
          return;
        }

        if (installed.length === 0) {
          process.stdout.write('No managed skills installed.\n');
          return;
        }

        for (const skill of installed) {
          process.stdout.write(`${skill.workspace}/${skill.name} @ ${skill.sha}\n`);
        }
        return;
      }

      const remote = await new GitHubCatalogSource().resolve();
      const workspaces = remote.manifest.workspaces.filter((workspace) =>
        options.workspace ? workspace.name === options.workspace : true
      );

      if (options.json) {
        printJson({
          source: remote.repoFullName,
          defaultBranch: remote.defaultBranch,
          sha: remote.sha,
          workspaces
        });
        return;
      }

      for (const workspace of workspaces) {
        process.stdout.write(`${workspace.name}: ${workspace.description}\n`);
        for (const skill of workspace.skills) {
          process.stdout.write(`  - ${skill.name}: ${skill.description}\n`);
        }
      }
    });

  program
    .command('install')
    .description('Install a workspace or a workspace/skill target into Codex home.')
    .argument('<target>', 'Workspace or workspace/skill')
    .option('--scope <scope>', 'Install scope: global or local', 'global')
    .option('--dry-run', 'Show the install plan without changing files')
    .option('--json', 'Output as JSON')
    .option('-y, --yes', 'Auto-approve managed replacements')
    .action(async (target, options) => {
      const remote = await new GitHubCatalogSource().resolve();
      const summary = await installFromRemote(remote, target, {
        dryRun: options.dryRun,
        yes: options.yes,
        scope: options.scope,
        baseDir: process.cwd()
      });

      if (options.json) {
        printJson(summary);
        return;
      }

      process.stdout.write(`Scope: ${summary.scope}\n`);
      process.stdout.write(`Workspace: ${summary.workspace}\n`);
      process.stdout.write(`Router skill: ${summary.routerSkill}\n`);
      process.stdout.write(`Source: ${summary.repo}@${summary.sha}\n`);
      for (const skill of summary.installed) {
        process.stdout.write(`- ${skill.name} -> ${skill.path} (${skill.action})\n`);
      }
      process.stdout.write(
        'Global installation does not enforce project-local mandatory routing. Use the router skill explicitly until a future bootstrap command exists.\n'
      );
    });

  program
    .command('remove')
    .alias('delete')
    .description('Remove a workspace or a workspace/skill target from the selected Codex scope.')
    .argument('<target>', 'Workspace or workspace/skill')
    .option('--scope <scope>', 'Removal scope: global or local', 'global')
    .option('--json', 'Output as JSON')
    .option('-y, --yes', 'Auto-approve unmanaged removals')
    .action(async (target, options) => {
      const remote = await new GitHubCatalogSource().resolve();
      const summary = await removeFromRemote(remote, target, {
        yes: options.yes,
        scope: options.scope,
        baseDir: process.cwd()
      });

      if (options.json) {
        printJson(summary);
        return;
      }

      process.stdout.write(`Scope: ${summary.scope}\n`);
      process.stdout.write(`Workspace: ${summary.workspace}\n`);
      process.stdout.write(`Router skill: ${summary.routerSkill}\n`);
      for (const skill of summary.removed) {
        process.stdout.write(`- ${skill.name} -> ${skill.path} (${skill.action})\n`);
      }
    });

  const doctor = program.command('doctor').description('Validate the catalog repository or local installed state.');

  doctor
    .command('repo')
    .description('Validate the local skills repository structure.')
    .argument('[repoPath]', 'Path to the local repository', '.')
    .option('--json', 'Output as JSON')
    .action(async (repoPath, options) => {
      const resolvedRepo = path.resolve(repoPath);
      const result = await doctorRepo(resolvedRepo);

      if (options.json) {
        printJson(result);
        return;
      }

      process.stdout.write(formatIssues(result) + '\n');
      if (!result.ok) {
        process.exitCode = 1;
      }
    });

  doctor
    .command('installed')
    .description('Validate installed skills tracked by the local registry.')
    .option('--scope <scope>', 'Validation scope: global or local', 'global')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      const result = await doctorInstalled(options.scope, process.cwd());

      if (options.json) {
        printJson(result);
        return;
      }

      process.stdout.write(formatIssues(result) + '\n');
      if (!result.ok) {
        process.exitCode = 1;
      }
    });

  await program.parseAsync(process.argv);
}

run().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
