# Gocloserr - regras do projeto

Valem para qualquer pessoa ou agente, de qualquer modelo. Visão do produto e telas no [README](README.md).

## Fluxo de trabalho

- Toda tarefa (correção, melhoria ou função nova) tem uma issue no GitHub antes de começar.
- Nada vai direto para a `main` depois do commit inicial. Cada tarefa tem uma branch (`feat/...`, `fix/...`, `chore/...`) e um PR que menciona a issue (`Closes #N`).
- Commits em Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`).
- TDD: o teste vem antes da implementação. `npm test` precisa passar.
- Todo deploy tem plano de rollback escrito no PR.
- Pendente: Commitlint com Husky, CI (tipos, testes, auditoria de dependências) e review automático de PR bloqueando merge em falha crítica.

## Convenções

- Código, nomes, textos e commits em português do Brasil. Nunca usar travessão (U+2014): use hífen.
- Marca: "Gocloserr" (dois "r"). Lema: "O espaço que você precisa, onde você precisa." Tema único claro, fundo branco; tokens em `src/index.css`. Verde-limão só como preenchimento, texto em verde escuro (`marca-tinta`) para manter contraste.
- Referência visual: páginas do Airbnb e do Mercado Livre, adaptadas para centros cirúrgicos.
- Hero, animação e componente animado vêm das ferramentas escolhidas pelo cliente (21st.dev, cult-ui, shadergradient) e das skills de design (design-motion-principles). Não compor hero "à mão". Ao adaptar um componente de terceiros, registrar a origem no topo do arquivo.
- Motion: entradas com opacidade, deslocamento curto e blur, mola sem quique (`src/lib/motion.ts`); saídas mais discretas que as entradas; só `transform`, `opacity` e `filter`; sempre respeitar `prefers-reduced-motion` (`MotionConfig reducedMotion="user"`).
- Acessibilidade: label em todo campo, alt em toda imagem com conteúdo, navegação por teclado, foco visível, cor nunca sozinha para indicar estado.
- Fotos: só de bancos com licença livre para uso comercial, registradas em `docs/creditos-fotos.md`.
- Nenhum segredo no repositório nem no front-end.

## Arquitetura

- `src/lib/app.tsx`: estado global (filtros, favoritos, seleção de datas, reserva, cliente) e rotas por hash.
- `src/lib/validacao.ts`: CPF, CNPJ, Luhn, validade, máscaras e regras dos formulários, com testes em `validacao.test.ts`.
- `src/data/espacos.ts`: dados fictícios; a agenda é gerada com semente a partir da data de hoje.
- `scripts-artifact.mjs`: prepara o HTML único para publicar como artifact do claude.ai.
