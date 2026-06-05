#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const LANDING_BASE_DIR = new URL('../app/gasolina/', import.meta.url).pathname;
const SERVER_LANDING_DIR = new URL('../.next/server/app/gasolina/', import.meta.url).pathname;

const MIN_SIZE = 25_000;
const MIN_TITLE = 20;
const MIN_H1 = 5;

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
  const entries = await readdir(LANDING_BASE_DIR, { withFileTypes: true });
  const pages = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (e.name.startsWith('_') || e.name.startsWith('api')) continue;
    try {
      const files = await readdir(join(LANDING_BASE_DIR, e.name));
      if (files.some((f) => f.startsWith('page.'))) {
        pages.push(e.name);
      }
    } catch {}
  }
  return pages;
}

async function readBuiltHtml(slug) {
  const candidates = [
    join(SERVER_LANDING_DIR, `${slug}.html`),
    join(SERVER_LANDING_DIR, slug, 'index.html'),
  ];
  for (const path of candidates) {
    try {
      return { html: await readFile(path, 'utf8'), path };
    } catch {}
  }
  return null;
}

function checkHtml(slug, html) {
  const failures = [];

  if (html.length < MIN_SIZE) {
    failures.push(`tamanho ${html.length}B < mínimo ${MIN_SIZE}B (provável shell vazio)`);
  }

  for (const { name, re } of REQUIRED_PATTERNS) {
    if (!re.test(html)) failures.push(`não encontrou: ${name}`);
  }
  for (const { name, re } of FORBIDDEN_PATTERNS) {
    if (re.test(html)) failures.push(`encontrou padrão proibido: ${name}`);
  }

  return failures;
}

async function main() {
  let slugs;
  try {
    slugs = await findLandingPages();
  } catch {
    console.log('verify-build: app/gasolina/ vazio — nada a verificar (skip)');
    return;
  }
  if (slugs.length === 0) {
    console.log('verify-build: nenhuma LP em app/gasolina/ ainda — skip');
    return;
  }

  let allOk = true;
  for (const slug of slugs) {
    const built = await readBuiltHtml(slug);
    if (!built) {
      console.error(`✗ ${slug}: HTML pré-renderizado não encontrado em .next/server/app/gasolina/`);
      allOk = false;
      continue;
    }
    const failures = checkHtml(slug, built.html);
    if (failures.length === 0) {
      console.log(`✓ ${slug} (${built.html.length}B) — ${built.path.replace(SERVER_LANDING_DIR, '')}`);
    } else {
      console.error(`✗ ${slug} — ${built.path.replace(SERVER_LANDING_DIR, '')}`);
      for (const f of failures) console.error(`    · ${f}`);
      allOk = false;
    }
  }

  if (!allOk) {
    console.error('\nverify-build: FALHOU');
    process.exit(1);
  }
  console.log('\nverify-build: OK');
}

main().catch((e) => {
  console.error('verify-build: erro inesperado:', e);
  process.exit(1);
});
