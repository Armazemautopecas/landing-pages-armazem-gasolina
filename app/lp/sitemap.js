import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// 2026-09-15 (item #7): movido de app/sitemap.js pra app/lp/sitemap.js.
// Em /sitemap.xml (raiz) quem responde em produção é a loja Tray — a Bunny não
// roteia a raiz do domínio pra Vercel. Servido em /lp/sitemap.xml, que é path
// roteado, o Google finalmente enxerga as 15 LPs.
const SITE_URL = 'https://www.armazemautopecas.com.br';

// Descobre LPs pasta-por-LP (padrão antigo, prefixo "pecas-").
function findStaticLPSlugs() {
  const baseDir = join(process.cwd(), 'app');
  const entries = readdirSync(baseDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .filter((e) => e.name.startsWith('pecas-'))
    .filter((e) => existsSync(join(baseDir, e.name, 'config.json')))
    .map((e) => `/${e.name}/`);
}

// Descobre LPs dinâmicas (padrão novo, data/lp/<slug>.json → /lp/<slug>/).
function findDynamicLPSlugs() {
  const dataDir = join(process.cwd(), 'data/lp');
  if (!existsSync(dataDir)) return [];
  return readdirSync(dataDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => `/lp/${f.replace(/\.json$/, '')}/`);
}

export default function sitemap() {
  const now = new Date();
  const paths = [...findStaticLPSlugs(), ...findDynamicLPSlugs()].sort();
  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));
}
