import { getFabricanteLabel } from '@/lib/content';
import { waLink } from './lib/wa';

// Hero — versão gasolina (Lifan e linha asiática).
// Diferenças do diesel: SEM <Selector> (puxa placa removida no bootstrap),
// SEM selo "CONSULTA POR PLACA". CTA mobile vai direto pro WhatsApp via
// cfg.wa.hero_link em vez de scroll pra SearchSection inexistente.
export default function Hero({ cfg, heroLayout, heroImage }) {
  const slug = cfg.slug;
  const fileName = heroImage === 'dust' ? cfg.hero.foto_dust : cfg.hero.foto_static;
  const base = fileName.replace(/^assets\//, '').replace(/\.webp$/, '');
  // Path do asset = canonical_path da LP (ex: /pecas-lifan-320/assets/...)
  const desktopSrc = `${cfg.seo.canonical_path}assets/${base}.webp`;
  const mobileSrc = `${cfg.seo.canonical_path}assets/${base}-600.webp`;

  const fabricante = getFabricanteLabel(cfg);
  const garantiaLabel = fabricante ? `GARANTIA ${fabricante.toUpperCase()}` : 'PEÇAS ORIGINAIS';
  const ctaHref = waLink(cfg.wa.hero_link, slug);

  return (
    <section className={`hero sec-navy sec-pad ${heroImage === 'dust' ? 'is-dust' : ''}`}>
      <picture>
        <source media="(max-width: 768px)" srcSet={mobileSrc} type="image/webp" />
        <img
          className="hero-bg"
          src={desktopSrc}
          alt=""
          width="1200"
          height="670"
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className="hero-overlay" />
      <div className="hero-swipe" />
      <div className="container">
        <div className={`hero-grid ${heroLayout === 'stack' ? 'is-stack' : ''}`}>
          <div>
            <div className="eyebrow hero-tag">{cfg.hero.eyebrow}</div>
            <h1 className="h1 hero-h1">
              {cfg.hero.h1_linha1}<br />{cfg.hero.h1_linha2}<span className="red-dot" />
              <span className="line-2">{cfg.hero.h1_sub}</span>
            </h1>
            <p className="hero-sub">{cfg.hero.sub}</p>
            <a className="hero-cta-mobile" href={ctaHref} target="_blank" rel="noreferrer">
              <span>{cfg.hero.cta_mobile_label}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="13 6 19 12 13 18" />
              </svg>
            </a>
            <ul className="hero-trusts-desktop" aria-label="Garantias">
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF021E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {garantiaLabel}
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF021E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {cfg.seo?.product?.free_shipping ? 'FRETE GRÁTIS' : 'DEVOLUÇÃO FÁCIL'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
