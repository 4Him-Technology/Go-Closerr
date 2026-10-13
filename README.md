# Gocloserr

**O espaço que você precisa, onde você precisa.**

Protótipo navegável do marketplace de locação de centros cirúrgicos. A Gocloserr faz a ponte entre cirurgiões, que têm consultório mas dependem de um centro cirúrgico locado para operar, e hospitais e clínicas com salas ociosas. O cirurgião encontra o espaço, vê fotos, equipamentos e datas livres e reserva sem precisar ligar para ninguém.

> Protótipo com dados fictícios. Nenhum pagamento é feito e nenhuma mensagem é enviada. Não há autenticação nem backend nesta fase.

## O que dá para ver

| Tela | O que mostra |
| --- | --- |
| Início | Cartão de busca (cidade, data, turno) sobre a foto, no modelo da página inicial do Airbnb; vantagens; especialidades; datas livres; atalhos; como funciona; chamada para credenciamento; cidades; perguntas frequentes |
| Espaços disponíveis | Catálogo em grade com filtros por cidade, data, turno e especialidade, e sugestão de datas quando nada é encontrado |
| Espaço | Mosaico de fotos, galeria com tour 360°, estrutura, equipamentos, calendário com dias e turnos livres e o cartão de reserva com o valor |
| Reserva | "Confirme e pague" em 4 etapas: dados do locatário (CPF ou CNPJ, CRM, e-mail, celular), revisão, pagamento (cartão ou Pix) e verificação do contato por código de 6 dígitos |
| Seja credenciado | Proposta para hospitais e clínicas e formulário de cadastro do espaço |
| Sobre nós | Missão e para quem é a plataforma |

Para demonstrar sem digitar: na reserva há "Preencher com dados de exemplo" e "Usar cartão de teste", e na verificação a própria tela mostra o código.

## Como rodar

Precisa de Node 20 ou mais novo.

```bash
npm install
npm run dev
```

Abre em `http://localhost:5174`.

| Comando | Para quê |
| --- | --- |
| `npm test` | Testes das validações (CPF, CNPJ, cartão, máscaras e regras dos formulários) |
| `npm run build` | Build normal em `dist/` |
| `npm run build:artifact` | HTML único em `dist-artifact/` para publicar como artifact do claude.ai (as fotos vão em `dist-artifact/fotos`) |

## Stack

- Vite, React 19, TypeScript, Tailwind CSS 4 e shadcn/ui
- Motion para animações, seguindo a skill design-motion-principles e sempre respeitando `prefers-reduced-motion`
- Componentes de terceiros, adaptados à marca:
  - [21st.dev](https://21st.dev): "Real Estate Search Hero" (`src/components/ui/hero-09.tsx`), com o layout dividido no modelo do Airbnb
  - [cult-ui](https://github.com/nolly-studio/cult-ui): TextAnimate, HeroDithering, HaloInput, HaloSegmented, DirectionAwareTabs, RollingNumber e SecurityCheckpoint
  - [shadergradient](https://github.com/ruucm/shadergradient): fundo animado da página Sobre
- Vitest

## Estrutura

```
src/
  pages/            início, catálogo, espaço, reserva, credenciado, sobre
  components/site/  busca, especialidades, card do espaço, galeria e tour, calendário, formulário, marca
  components/ui/    componentes do cult-ui, do 21st e do shadcn
  data/espacos.ts   10 centros cirúrgicos fictícios e a agenda gerada a partir da data de hoje
  lib/              estado e rotas, presets de motion, validações (com testes)
public/fotos/       fotos reais de banco de imagens (créditos em docs/creditos-fotos.md)
```

As rotas usam hash (`#espacos`, `#espaco-vila-aurora`, `#reserva`) para funcionar também dentro do artifact publicado.

## Limitações do protótipo

- Hospitais, endereços, preços e agendas são fictícios.
- As fotos são de banco de imagens e se repetem entre os espaços; o tour 360° é simulado sobre a foto principal.
- Regras de cancelamento (72 horas) e horários dos turnos são textos de exemplo e precisam ser validados.
- Código de verificação, pagamento e envio de e-mail e SMS são simulados.

## Próximos passos

- Logo final em arquivo (`public/logo.png`) no lugar do símbolo recortado e do texto composto.
- Fotos e vídeos 360° reais de cada centro credenciado.
- Login, painel do credenciado (agenda, preços, especialidades), backend, pagamento e envio real do código.
