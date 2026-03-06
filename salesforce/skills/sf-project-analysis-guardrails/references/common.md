# Regras Comuns

## Arquitetura e escopo
- Preservar os padroes existentes do repositorio.
- Escolher a menor mudanca que resolve o requisito.
- Evitar mudancas amplas sem ganho tecnico claro.

## Qualidade
- Manter codigo bulk-safe em Apex.
- Evitar SOQL e DML dentro de loops.
- Cobrir cenarios positivos e negativos quando houver teste.

## Seguranca
- Nunca hardcode de secrets.
- Nunca hardcode de IDs sensiveis.
- Respeitar CRUD/FLS/sharing quando a mudanca tocar acesso a dados.

## Entrega
- Nao automatizar deploy em producao.
- Nao automatizar deploy em sandbox sem confirmacao explicita.
- Declarar suposicoes e limites da validacao local.
