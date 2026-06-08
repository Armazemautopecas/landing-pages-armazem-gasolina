import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SITE_URL = 'https://www.armazemautopecas.com.br';

// Descobre LPs olhando subdirs de app/ que começam com "pecas-" e contêm config.json.
function findLandingSlugs() {
  const baseDir = join(process.cwd(), 'app');
  const entries = readdirSync(baseDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .filter((e) => e.name.startsWith('pecas-'))
    .filter((e) => existsSync(join(baseDir, e.name, 'config.json')))
    .map((e) => e.name)
    .sort();
}

export default function sitemap() {
  const now = new Date();
  return findLandingSlugs().map((slug) => ({
    url: `${SITE_URL}/${slug}/`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));
}
