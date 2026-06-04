# REGRA Nº 0 (PRECEDE TODAS) — Protocolo "Buscar Antes de Perguntar"

> **Antes de dizer "não sei / não tenho contexto / não achei", OU de pedir um dado ou ação a um humano, é OBRIGATÓRIO esgotar NESTA ORDEM:**

1. **Memória / docs** — `CLAUDE.md`, `README`, `memory/` do projeto (se houver) e o índice global `~/.claude/projects/-Users-viniciusdalpra/memory/MEMORY.md`.
2. **Vault Obsidian (segundo cérebro)** — `mcp__obsidian__search_notes` (full-text/tag) e `read_note`. É o passo que mais se esquece; **não pular**.
3. **Sistemas vivos** — M8 (SQL Server BI `bi.m8sistemas.com.br` + extratos OFX na tabela `extratos_bancarios` + API Integra), VPS (`ssh -i ~/.ssh/id_deploy_campaign root@195.200.5.96`), Google (Sheets/Drive/Gmail), Slack, Salesforce, Mercado Livre, n8n.

**Só escalar pra humano quando o dado NÃO existe em nenhum sistema acessível, OU a ação é irreversível e cara** (transferir dinheiro, e-mail externo, deletar produção). Mesmo aí, dizer onde já procurei. **Agir direto no que é reversível** (backup/git/recomputável). Nunca inventar pra evitar buscar.

---

