import fs from 'node:fs';
import path from 'node:path';
import '../../_components/styles.css';
import LandingClient from '../../_components/LandingClient';
import TrustBar from '../../_components/TrustBar';
import WhySection from '../../_components/WhySection';
import Testimonials from '../../_components/Testimonials';
import FAQ from '../../_components/FAQ';
import FinalCTA from '../../_components/FinalCTA';
import Footer from '../../_components/Footer';
import { WhatsAppIcon } from '../../_components/atoms';
import { waLink } from '../../_components/lib/wa';
import { buildJsonLd } from '../../_components/lib/jsonld';
import CRITICAL_CSS from '../../_components/criticalCss';

// Rota dinâmica universal pras LPs novas (post 11/06/2026).
// Cada modelo tem 1 arquivo data/lp/<slug>.json. O page.jsx é único.
// Convenção do slug: marca-modelo em kebab-case (ssangyong-actyon, byd-f0, etc).

const DATA_DIR = path.join(process.cwd(), 'data/lp');
const SITE_URL = 'https://www.armazemautopecas.com.br';

export const dynamic = 'force-static';
export const dynamicParams = false;

function listModels() {
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs.readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
}

function getCfg(modelo) {
  const filePath = path.join(DATA_DIR, `${modelo}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function generateStaticParams() {
  return listModels().map((modelo) => ({ modelo }));
}

export async function generateMetadata({ params }) {
  const { modelo } = await params;
  const cfg = getCfg(modelo);
  const PAGE_URL = `${SITE_URL}${cfg.seo.canonical_path}`;
  const OG_IMAGE = `${SITE_URL}${cfg.seo.canonical_path}${cfg.seo.og_image}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: cfg.seo.title,
    description: cfg.seo.description,
    alternates: { canonical: cfg.seo.canonical_path },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      siteName: 'Armazém Auto Peças',
      title: cfg.seo.title,
      description: cfg.seo.description,
      url: PAGE_URL,
      images: [{ url: OG_IMAGE, alt: cfg.seo.og_image_alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: cfg.seo.title,
      description: cfg.seo.twitter_description,
      images: [OG_IMAGE],
    },
  };
}

export default async function Page({ params }) {
  const { modelo } = await params;
  const cfg = getCfg(modelo);
  const PAGE_URL = `${SITE_URL}${cfg.seo.canonical_path}`;
  const jsonLd = buildJsonLd(cfg, PAGE_URL, { oemCount: 0 });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <link
        rel="preload"
        as="image"
        href={`${cfg.seo.canonical_path}${cfg.hero.foto_static}`}
        type="image/webp"
        fetchPriority="high"
      />

      <LandingClient cfg={cfg}>
        <TrustBar cfg={cfg} style="numbers" />
      </LandingClient>

      <WhySection cfg={cfg} style="stacked" />
      <Testimonials cfg={cfg} />
      <FAQ cfg={cfg} />
      <FinalCTA cfg={cfg} />
      <Footer />

      <a
        className="wa-fab"
        href={waLink(cfg.wa.fab_default, cfg.slug)}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
      >
        <WhatsAppIcon size={24} />
      </a>
    </>
  );
}
