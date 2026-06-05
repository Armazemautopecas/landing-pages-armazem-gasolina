// Hero da LP gasolina (veículo-cêntrico).
// Diferente do Hero diesel original: SEM Selector (puxa placas), SEM selos OEM/marca.
// Selos vêm de cfg.hero.trusts (3 strings). CTA é link WhatsApp direto.
import { waLink } from './lib/wa';
import { WhatsAppIcon } from './atoms';

export default function Hero({ cfg, heroLayout, heroImage }) {
  const slug = cfg.slug;
  const fileName = heroImage === 'dust' ? cfg.hero.foto_dust : cfg.hero.foto_static;
  const base = fileName.replace(/^assets\//, '').replace(/\.webp$/, '');
  const desktopSrc = `/gasolina/${slug}/assets/${base}.webp`;
  const mobileSrc = `/gasolina/${slug}/assets/${base}-600.webp`;

  const ctaHref = waLink(cfg.wa.hero_link, cfg.slug);
  const trusts = cfg.hero.trusts || [
    'ATENDIMENTO HUMANO',
    'ENTREGA RASTREADA',
    'FRETE PRA TODO BRASIL',
  ];

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
              <WhatsAppIcon size={18} />
            </a>
            <ul className="hero-trusts-desktop" aria-label="Garantias">
              {trusts.map((trust, i) => (
                <li key={i}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF021E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {trust}
                </li>
              ))}
            </ul>
            <a className="hero-cta-desktop" href={ctaHref} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={20} />
              <span>{cfg.hero.cta_desktop_label || 'FALAR NO WHATSAPP'}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
