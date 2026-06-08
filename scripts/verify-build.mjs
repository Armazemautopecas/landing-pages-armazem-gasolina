#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const APP_DIR = new URL('../app/', import.meta.url).pathname;
const SERVER_DIR = new URL('../.next/server/app/', import.meta.url).pathname;
const LP_PREFIX = 'pecas-lifan-';

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

async function findLandingPages() {
  const entries = await readdir(APP_DIR, { withFileTypes: true });
  const pages = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (!e.name.startsWith(LP_PREFIX)) continue;
    try {
      const files = await readdir(join(APP_DIR, e.name));
      if (files.some((f) => f.startsWith('page.'))) pages.push(e.name);
    } catch {}
  }
  return pages;
}

async function readBuiltHtml(slug) {
  const candidates = [
    join(SERVER_DIR, `${slug}.html`),
    join(SERVER_DIR, slug, 'index.html'),
  ];
  for (const path of candidates) {
    try { return { html: await readFile(path, 'utf8'), path }; }
    catch {}
  }
  return null;
}

function checkHtml(slug, html) {
  const failures = [];
  if (html.length < MIN_SIZE) failures.push(`tamanho ${html.length}B < mínimo ${MIN_SIZE}B (shell vazio?)`);
  for (const { name, re } of REQUIRED_PATTERNS) if (!re.test(html)) failures.push(`não encontrou: ${name}`);
  for (const { name, re } of FORBIDDEN_PATTERNS) if (re.test(html)) failures.push(`padrão proibido: ${name}`);
  return failures;
}

async function main() {
  let slugs;
  try { slugs = await findLandingPages(); }
  catch { console.log('verify-build: app/ ausente — skip'); return; }

  if (slugs.length === 0) {
    console.log('verify-build: nenhuma LP em app/pecas-lifan-* — skip');
    return;
  }

  let allOk = true;
  for (const slug of slugs) {
    const built = await readBuiltHtml(slug);
    if (!built) {
      console.error(`✗ ${slug}: HTML pré-renderizado não encontrado em .next/server/app/`);
      allOk = false;
      continue;
    }
    const failures = checkHtml(slug, built.html);
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
