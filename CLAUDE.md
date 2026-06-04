# REGRA Nº 0 (PRECEDE TODAS) — Protocolo "Buscar Antes de Perguntar"

> **Antes de dizer "não sei / não tenho contexto / não achei", OU de pedir um dado ou ação a um humano, é OBRIGATÓRIO esgotar NESTA ORDEM:**

1. **Memória / docs** — `CLAUDE.md`, `README`, `memory/` do projeto (se houver) e o índice global `~/.claude/projects/-Users-viniciusdalpra/memory/MEMORY.md`.
2. **Vault Obsidian (segundo cérebro)** — `mcp__obsidian__search_notes` (full-text/tag) e `read_note`. É o passo que mais se esquece; **não pular**.
3. **Sistemas vivos** — M8 (SQL Server BI `bi.m8sistemas.com.br` + extratos OFX na tabela `extratos_bancarios` + API Integra), VPS (`ssh -i ~/.ssh/id_deploy_campaign root@195.200.5.96`), Google (Sheets/Drive/Gmail), Slack, Salesforce, Mercado Livre, n8n.

**Só escalar pra humano quando o dado NÃO existe em nenhum sistema acessível, OU a ação é irreversível e cara** (transferir dinheiro, e-mail externo, deletar produção). Mesmo aí, dizer onde já procurei. **Agir direto no que é reversível** (backup/git/recomputável). Nunca inventar pra evitar buscar.

---

# Landing Pages — Armazém Diesel

LPs de peças automotivas (injeção diesel) da Armazém Auto Peças, Chapecó/SC. **Next.js + React**, deploy no **Vercel** (não é PM2/VPS). Inclui Vercel Function de consulta de veículo usando Upstash Redis.

> ⚠️ O `README.md` está **parcialmente desatualizado** — fala em "HTML estático + React via CDN, sem build step". A realidade atual é **Next.js (App Router) com build step**. Em caso de dúvida, confiar no `package.json`, não no README.

## Stack (do `package.json`)

- **Next.js ^16** + **React ^19** (App Router em `app/`)
- **`@upstash/redis`** — cache/estado da Vercel Function de consulta de veículo
- **Vercel** (`vercel.json` → `{"framework":"nextjs"}`)
- Testes: **Vitest**; validação de config: `scripts/validate-configs.mjs` (ajv); verificação pós-build: `scripts/verify-build.mjs`

## Estrutura

- `app/` — App Router: `layout.jsx`, `page.jsx`, `injecao-diesel/`, `_components/`, `globals.css`
- `lib/`, `data/` — libs e dados das LPs
- `scripts/` — `validate-configs.mjs`, `verify-build.mjs`
- `tests/` — Vitest
- `public/` — assets estáticos

## Comandos

```bash
npm run dev      # next dev
npm run build    # vitest run && validate-configs && next build && verify-build
npm run test     # vitest run
npm start        # next start
```

> O `build` roda testes + validação de config ANTES do `next build` — se falhar, é config/teste, não o Next.

## Deploy

Push na `main` → **Vercel deploya automático**. Toda branch aberta vira uma URL de preview própria.

## Convenções (LPs)

- Nome da pasta/slug = veículo curto (`amarok`, `hr`, `bongo`, `hilux`). O Bunny serve em `armazemautopecas.com.br/injecao-diesel/<slug>/` via Edge Rule de prefixo.
- CTA único de WhatsApp → `wa.me/554998829474`.
- **Nova LP:** usar a skill `armazem-lp-generator` do Claude Code (coleta os campos e gera os arquivos).
