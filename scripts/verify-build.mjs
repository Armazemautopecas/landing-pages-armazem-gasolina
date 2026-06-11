#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const APP_DIR = new URL('../app/', import.meta.url).pathname;
const DATA_LP_DIR = new URL('../data/lp/', import.meta.url).pathname;
const SERVER_DIR = new URL('../.next/server/app/', import.meta.url).pathname;
const STATIC_LP_PREFIX = 'pecas-lifan-';

const MIN_SIZE = 25_000;

const REQUIRED_PATTERNS = [
  { name: 'title preenchido', re: /<title>.{20,}<\/title>/ },
  { name: 'meta description', re: /<meta\s+name="description"\s+content="[^"]{40,}"/ },
  { name: 'h1 com conteúdo', re: /<h1[^>]*>[\s\S]{5,}?<\/h1>/ },
  { name: 'OG title', re: /<meta\s+property="og:title"/ },
  { name: 'JSON-LD presente', re: /<script\s+type="application\/ld\+json"/ },
];

const FORBIDDEN_PATTERNS = [
  { name: 'div root vazio', re: /<div id="root"><\/div>/ },
  { name: '<main></main> shell', re: /<main>\s*<\/main>/ },
];

async function findStaticPages() {
  // Padrão antigo: app/pecas-lifan-*/page.jsx → HTML em .next/server/app/<slug>.html
  let entries;
  try { entries = await readdir(APP_DIR, { withFileTypes: true }); }
  catch { return []; }
  const pages = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (!e.name.startsWith(STATIC_LP_PREFIX)) continue;
    try {
      const files = await readdir(join(APP_DIR, e.name));
      if (files.some((f) => f.startsWith('page.'))) {
        pages.push({ slug: e.name, candidates: [
          join(SERVER_DIR, `${e.name}.html`),
          join(SERVER_DIR, e.name, 'index.html'),
        ]});
      }
    } catch {}
  }
  return pages;
}

async function findDynamicPages() {
  // Padrão novo: data/lp/<slug>.json → HTML em .next/server/app/lp/<slug>.html
  let entries;
  try { entries = await readdir(DATA_LP_DIR); }
  catch { return []; }
  const pages = [];
  for (const f of entries) {
    if (!f.endsWith('.json')) continue;
    const slug = f.replace(/\.json$/, '');
    pages.push({ slug: `lp/${slug}`, candidates: [
      join(SERVER_DIR, 'lp', `${slug}.html`),
      join(SERVER_DIR, 'lp', slug, 'index.html'),
    ]});
  }
  return pages;
}

async function readBuiltHtml(candidates) {
  for (const path of candidates) {
    try { return { html: await readFile(path, 'utf8'), path }; }
    catch {}
  }
  return null;
}

function checkHtml(html) {
  const failures = [];
  if (html.length < MIN_SIZE) failures.push(`tamanho ${html.length}B < mínimo ${MIN_SIZE}B (shell vazio?)`);
  for (const { name, re } of REQUIRED_PATTERNS) if (!re.test(html)) failures.push(`não encontrou: ${name}`);
  for (const { name, re } of FORBIDDEN_PATTERNS) if (re.test(html)) failures.push(`padrão proibido: ${name}`);
  return failures;
}

async function main() {
  const pages = [...(await findStaticPages()), ...(await findDynamicPages())];
  if (pages.length === 0) {
    console.log('verify-build: nenhuma LP encontrada — skip');
    return;
  }

  let allOk = true;
  for (const { slug, candidates } of pages) {
    const built = await readBuiltHtml(candidates);
    if (!built) {
      console.error(`✗ ${slug}: HTML pré-renderizado não encontrado em .next/server/app/`);
      allOk = false;
      continue;
    }
    const failures = checkHtml(built.html);
    if (failures.length === 0) {
      console.log(`✓ ${slug} (${built.html.length}B) — ${built.path.replace(SERVER_DIR, '')}`);
    } else {
      console.error(`✗ ${slug} — ${built.path.replace(SERVER_DIR, '')}`);
      for (const f of failures) console.error(`    · ${f}`);
      allOk = false;
    }
  }

  if (!allOk) { console.error('\nverify-build: FALHOU'); process.exit(1); }
  console.log('\nverify-build: OK');
}

main().catch((e) => { console.error('verify-build:', e); process.exit(1); });
