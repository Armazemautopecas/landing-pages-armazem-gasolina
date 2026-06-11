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

---

## Infra Bunny/Vercel — estado pós-incidente de 10/06/2026

### Arquitetura atual (VÁLIDA — não mexer sem ler isto)
www.armazemautopecas.com.br → Bunny CDN, pullzone 5788032 (admin: Sidnei). 4 origens:
1. **Default:** Azion/Tray (loja e-commerce)
2. **`/injecao-diesel/*` + `/_next/*`** → landing-pages-armazem-diesel.vercel.app (Host Header Override do diesel). O path `/_next/*` PERTENCE AO PROJETO DIESEL.
3. **`/pecas-lifan-*`** → landing-pages-armazem-gasolina.vercel.app (Host Header Override do gasolina)
4. **`/pecas-mercedes-benz*` + `/pecas-para/lifan-x60*`** → mercedes.pages.net.br (GreatPages — LPs antigas nossas, anteriores ao projeto Vercel)

### Decisão estrutural deste projeto (NUNCA reverter sem plano)
O `next.config.mjs` usa `assetPrefix` condicional (`VERCEL_ENV === 'production'`) apontando para
https://landing-pages-armazem-gasolina.vercel.app — os chunks JS/CSS deste projeto NÃO passam
pela Bunny. Motivo: dois projetos Next.js não podem dividir `/_next/*` no mesmo domínio, e o
diesel é o dono desse path. Commits relevantes: e0dca8e (versão incondicional), 98af5f9 (condicional).
LPs novas deste projeto devem usar slug no padrão `/pecas-lifan-*` — caem automaticamente na
rule existente da Bunny, sem precisar de configuração nova.

### Incidente 10–11/06 — causas confirmadas
1. Chunks do gasolina retornavam 404 via Bunny: `/_next/*` roteava pro projeto diesel (colisão de path). Fix: assetPrefix.
2. Loja servindo home MOBILE pra desktop + busca devolvendo resultado de outro termo: a Bunny cacheava
   páginas dinâmicas da Tray por 4h ignorando query string e user-agent. Fix: cache da loja neutralizado
   (entradas nascem expiradas — `cdn-cache: EXPIRED` revalida sempre na origem).
3. LPs caíram pro Azion (404) às 15:04 de 10/06: a rule `/pecas-lifan-*` foi desabilitada durante ajustes no painel. Fix: rule recriada.
4. Fósseis: respostas erradas cacheadas com `cache-control: max-age=14400` sobreviveram a purges
   totais e só morreram por purge por URL individual ou expiração do TTL.
5. **11/06 entre madrugada e ~14h UTC**: CNAME do `www` foi alterado pra apontar **direto pra Tray/Azion**
   (sem passar pela Bunny). Bypassou a pullzone 5788032 completamente. Impacto: 8 LPs Vercel
   (5 gasolina + 3 diesel) caíram pra 404 simultaneamente (Azion não tem essas rotas, fallback 404).
   Home da loja continuou OK (sempre foi servida pela Tray). Detectado por curl mostrando `server: nginx`
   + `x-azion-request-id` + ausência de `cdn-pullzone: 5788032` na home. Restaurado por Sidnei
   (CNAME voltou pra IP da Bunny `193.162.131.16` por volta das 14:26 UTC). Cache da pullzone foi
   preservado durante a janela (`age` mostrava 18h após volta, evidência de que a zona seguiu existindo).
   Origem real da troca **não documentada** — Sidnei deveria descrever o que/quando/por quê.

### Regras operacionais (consolidar no post-mortem)
- **Purge total da pullzone 5788032 NÃO é confiável** — deixou entradas vivas 2x no mesmo dia.
  Fallback: purge por URL exata (painel "Purge URL" ou API `https://api.bunny.net/purge?url=...`).
- **Print de painel não é prova de funcionamento. Curl é prova.** Toda mudança na Bunny (de qualquer
  pessoa, inclusive eu) só é considerada aplicada após validação com curl — em 10/06 várias mudanças
  reportadas como feitas não estavam ativas.
- Decodificação de headers: `cdn-cache` (HIT/MISS/EXPIRED) + `cdn-cachedat` = cache da Bunny;
  `x-azion-*` ou `PHPSESSID` = resposta veio da Tray; `x-vercel-*` = veio do Vercel;
  `cdn-pullzone: 5788032` confirma a zona. Query string nova (`?bust=N`) fura o cache da Bunny.
- Horários: Claude Code, Vercel e headers da Bunny reportam em UTC; horário local = UTC-3.

### Pendências abertas
- [ ] Bateria overnight 11/06 às 8h:
      `for p in 320 530 620 x80 foison; do curl -sI "https://www.armazemautopecas.com.br/pecas-lifan-$p/" | grep -m1 HTTP; done`
      + home ×5 com UA desktop (grep MOBILE deve dar 0) + busca de 2 termos distintos
      (conteúdos diferentes) + `/injecao-diesel/amarok/` retornando 200.
- [ ] Post-mortem: inventário de origens do domínio, processo de mudança em produção
      (10/06 foi via WhatsApp sem registro), redação da regra operacional definitiva.
- [ ] Documentar o que exatamente foi alterado no cache da loja em 10/06 (tela/print) — ainda não informado.
- [ ] Ciclo 2 (logado, não iniciar): reativar cache de edge ESCOPADO só nos paths Vercel
      (hoje tudo revalida a cada request — funciona, mas desperdiça performance de edge).
- [ ] Logado: migrar LP Lifan X60 do GreatPages pra este projeto. Slug obrigatório
      `/pecas-lifan-x60` (aproveita a rule existente) + 301 do `/pecas-para/lifan-x60` antigo.
