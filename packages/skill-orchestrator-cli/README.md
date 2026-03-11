# skill-orchestrator-cli

CLI para listar, instalar e validar skills Codex publicadas no repositório `mariojgmaster/GPT-CODEX-SKILLs`.

## Comandos

```bash
skills list
skills install salesforce
skills install salesforce/sf-router-core-mandatory
skills doctor repo .
skills doctor installed
```

## Observações

- Instalação global em `$CODEX_HOME/skills` ou `~/.codex/skills`.
- Para catálogo privado no GitHub, exporte `GITHUB_TOKEN` ou `GH_TOKEN`.
- O CLI instala skills; ele não faz bootstrap de `AGENTS.md` em projetos locais.
