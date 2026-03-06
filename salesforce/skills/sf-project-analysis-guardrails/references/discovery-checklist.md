# Discovery Checklist

Use esta lista para mapear o projeto sem suposicoes.

## Arquivos para checagem inicial
- `sfdx-project.json`
- `force-app/main/default/`
- `manifest/package.xml`
- `package.json`
- `scripts/`
- pipelines/arquivos de CI do repositorio

## Pontos obrigatorios de mapeamento
1. Qual package directory controla a funcionalidade.
2. Se o fluxo principal e Apex, LWC, Flow ou metadata.
3. Quais metadados precisam mudar juntos:
   - classes/triggers/tests
   - objects/fields/layouts
   - permissionsets/profiles
   - labels/flexipages/tabs
4. Quais comandos de validacao o projeto ja usa.
5. Quais riscos de regressao existem (seguranca, bulk, automacao, dependencia cruzada).

## Criterio para seguir adiante
- So seguir para implementacao com escopo tecnico delimitado.
- Se houver conflito entre padroes, priorizar o padrao ja adotado no repositorio.

