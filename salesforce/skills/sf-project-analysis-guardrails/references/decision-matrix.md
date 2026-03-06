# Decision Matrix

Use esta matriz para decidir a trilha de execucao.

## Trilha Apex
Use quando houver regra transacional, trigger, async, integracao, validacao de negocio ou logica server-side.
Resultado esperado: plano de mudanca focado em classes, triggers e testes.

## Trilha LWC
Use quando a demanda for de UI em Lightning e o repo ja usar LWC.
Resultado esperado: plano focado em componente, controller Apex associado e cobertura de teste.

## Trilha Aura
Use somente quando o componente alvo ja for Aura ou houver restricao tecnica explicita.
Resultado esperado: plano de manutencao minima sem migracao automatica.

## Trilha Integracao
Use quando houver callout, autenticacao, consumo externo ou padrao ServiceAgent.
Resultado esperado: plano com isolamento de credenciais, tratamento de erro e testes.

## Trilha Refactor
Use quando o objetivo principal for reduzir risco tecnico sem alterar comportamento funcional.
Resultado esperado: plano de refatoracao moderada com validacao de regressao.

## Trilha Testes/Cobertura
Use quando o objetivo principal for estabilizar testes e elevar cobertura.
Resultado esperado: plano de testes focado em lacunas de cobertura e asserts relevantes.

## Regras de decisao
1. Escolher a menor trilha que resolve o problema.
2. Evitar mistura de trilhas sem necessidade real.
3. Se precisar combinar trilhas, definir ordem explicita (ex.: Apex -> LWC -> Testes).
