# metch - regras do projeto

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
- Marca: "metch", sempre minúsculo, na logo e nos textos. Assinatura da logo: "Encontre, conecte, opere." Lema usado no site: "O espaço que você precisa, onde você precisa." (confirmar se continua com a identidade nova).
- Identidade: manual em `docs/marca/`. Paleta: primária `#00E676`, secundária `#0B1F44`, apoio `#64748B`, fundo `#F3F6FA`; tokens em `src/index.css`. Tema claro, fundo branco. O azul-marinho é a cor predominante (botões, destaques, faixas, cards principais; tokens `azul*`). O verde é só acento (sucesso, segurança, favorito, marcações; tokens `marca*`), nunca com texto branco por cima; texto verde usa `marca-tinta` (`#007A4D`).
- Logo sempre pelos arquivos originais (`src/components/site/marca.tsx`), nunca redesenhada.
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
