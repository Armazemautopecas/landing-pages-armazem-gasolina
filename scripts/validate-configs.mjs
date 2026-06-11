#!/usr/bin/env node
import { readFile, readdir, access } from 'node:fs/promises';
import { join } from 'node:path';
import Ajv from 'ajv';

const ROOT = new URL('../', import.meta.url).pathname;
const APP_DIR = join(ROOT, 'app');
const PUBLIC_DIR = join(ROOT, 'public');
const SCHEMA_PATH = join(ROOT, 'data/config.schema.json');
const DATA_LP_DIR = join(ROOT, 'data/lp');
const STATIC_LP_PREFIX = 'pecas-lifan-'; // padrão antigo (pasta-por-LP)

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

async function validateConfig(label, cfg, validate) {
  const errs = [];
  if (!validate(cfg)) {
    for (const err of validate.errors) errs.push(`schema: ${err.instancePath || '/'} ${err.message}`);
  }
  errs.push(...(await checkPhotos(cfg)));
  if (errs.length === 0) {
    console.log(`✓ ${label}`);
    return true;
  }
  console.error(`✗ ${label}:`);
  for (const e of errs) console.error(`    ${e}`);
  return false;
}

async function collectStaticLPs(validate) {
  // Padrão antigo: app/pecas-lifan-*/config.json (1 pasta por LP)
  let failures = 0;
  let count = 0;
  let entries;
  try { entries = await readdir(APP_DIR, { withFileTypes: true }); }
  catch { return { failures: 0, count: 0 }; }
  const lps = entries
    .filter((e) => e.isDirectory() && e.name.startsWith(STATIC_LP_PREFIX))
    .map((e) => e.name);
  for (const slug of lps) {
    const cfgPath = join(APP_DIR, slug, 'config.json');
    let cfg;
    try { cfg = JSON.parse(await readFile(cfgPath, 'utf8')); }
    catch (e) { console.error(`✗ ${slug}: ${e.message}`); failures++; continue; }
    const ok = await validateConfig(`${slug}/config.json`, cfg, validate);
    count++;
    if (!ok) failures++;
  }
  return { failures, count };
}

async function collectDynamicLPs(validate) {
  // Padrão novo: data/lp/*.json (rota dinâmica /lp/[modelo])
  let failures = 0;
  let count = 0;
  let entries;
  try { entries = await readdir(DATA_LP_DIR); }
  catch { return { failures: 0, count: 0 }; }
  const files = entries.filter((f) => f.endsWith('.json'));
  for (const f of files) {
    const slug = f.replace(/\.json$/, '');
    const cfgPath = join(DATA_LP_DIR, f);
    let cfg;
    try { cfg = JSON.parse(await readFile(cfgPath, 'utf8')); }
    catch (e) { console.error(`✗ data/lp/${f}: ${e.message}`); failures++; continue; }
    const ok = await validateConfig(`data/lp/${f}`, cfg, validate);
    count++;
    if (!ok) failures++;
  }
  return { failures, count };
}

async function main() {
  const schema = JSON.parse(await readFile(SCHEMA_PATH, 'utf8'));
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);

  const stat = await collectStaticLPs(validate);
  const dyn = await collectDynamicLPs(validate);

  const totalCount = stat.count + dyn.count;
  const totalFailures = stat.failures + dyn.failures;

  if (totalCount === 0) {
    console.log('validate-configs: nenhuma LP encontrada (nem pasta-por-LP nem data/lp/) — skip');
    return;
  }

  if (totalFailures > 0) {
    console.error(`\nvalidate-configs: ${totalFailures} LP(s) inválida(s)`);
    process.exit(1);
  }
  console.log(`\nvalidate-configs: OK (${stat.count} pasta-por-LP + ${dyn.count} dinâmica${dyn.count !== 1 ? 's' : ''})`);
}

main().catch((e) => {
  console.error('validate-configs: erro inesperado —', e.message);
  process.exit(2);
});
