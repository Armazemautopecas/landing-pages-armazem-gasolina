#!/usr/bin/env node
import { readFile, readdir, access } from 'node:fs/promises';
import { join } from 'node:path';
import Ajv from 'ajv';

const ROOT = new URL('../', import.meta.url).pathname;
const APP_DIR = join(ROOT, 'app');
const PUBLIC_DIR = join(ROOT, 'public');
const SCHEMA_PATH = join(ROOT, 'data/config.schema.json');
const OEMS_PATH = join(ROOT, 'data/oems.json');
const LP_PREFIX = 'pecas-lifan-';

async function fileExists(absPath) {
  try { await access(absPath); return true; } catch { return false; }
}

function resolvePublicPath(cfg, p) {
  if (typeof p !== 'string' || !p) return null;
  if (p.startsWith('/')) return join(PUBLIC_DIR, p.slice(1));
  const base = (cfg.seo?.canonical_path || '').replace(/^\/+|\/+$/g, '');
  return join(PUBLIC_DIR, base, p);
}

async function checkPhotos(cfg) {
  const issues = [];
  const targets = [];
  if (cfg.hero?.foto_static) targets.push(['hero.foto_static', cfg.hero.foto_static]);
  if (cfg.hero?.foto_dust) targets.push(['hero.foto_dust', cfg.hero.foto_dust]);
  if (cfg.seo?.og_image) targets.push(['seo.og_image', cfg.seo.og_image]);
  for (const [field, p] of targets) {
    const abs = resolvePublicPath(cfg, p);
    if (!abs) { issues.push(`${field}: path inválido (${JSON.stringify(p)})`); continue; }
    if (!(await fileExists(abs))) issues.push(`${field}: arquivo não existe em public/ → ${p}`);
  }
  return issues;
}

async function main() {
  const schema = JSON.parse(await readFile(SCHEMA_PATH, 'utf8'));
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);

  let entries;
  try {
    entries = await readdir(APP_DIR, { withFileTypes: true });
  } catch {
    console.log(`validate-configs: ${APP_DIR} ausente — nada a validar`);
    return;
  }
  const lps = entries
    .filter((e) => e.isDirectory() && e.name.startsWith(LP_PREFIX))
    .map((e) => e.name);
  if (lps.length === 0) {
    console.log('validate-configs: nenhuma LP em app/pecas-lifan-* — skip');
    return;
  }

  let failures = 0;
  for (const slug of lps) {
    const cfgPath = join(APP_DIR, slug, 'config.json');
    let cfg;
    try { cfg = JSON.parse(await readFile(cfgPath, 'utf8')); }
    catch (e) { console.error(`✗ ${slug}: ${e.message}`); failures++; continue; }
    const errs = [];
    if (!validate(cfg)) for (const err of validate.errors) errs.push(`schema: ${err.instancePath || '/'} ${err.message}`);
    errs.push(...(await checkPhotos(cfg)));
    if (errs.length === 0) {
      console.log(`✓ ${slug}/config.json`);
    } else {
      console.error(`✗ ${slug}/config.json:`);
      for (const e of errs) console.error(`    ${e}`);
      failures++;
    }
  }

  if (failures > 0) {
    console.error(`\nvalidate-configs: ${failures} LP(s) inválida(s)`);
    process.exit(1);
  }
  console.log(`\nvalidate-configs: OK (${lps.length} LP${lps.length !== 1 ? 's' : ''})`);
}

main().catch((e) => {
  console.error('validate-configs: erro inesperado —', e.message);
  process.exit(2);
});
