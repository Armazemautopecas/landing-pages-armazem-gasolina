import Image from 'next/image';
import { getHeroBadges, CTA_PRINCIPAL } from '@/lib/content';
import { waLink } from './lib/wa';
import { WhatsAppIcon } from './atoms';

// Hero — versão gasolina (Lifan e linha asiática).
// Diferenças do diesel: SEM <Selector> (puxa placa removida no bootstrap),
// SEM selo "CONSULTA POR PLACA". CTA mobile vai direto pro WhatsApp via
// cfg.wa.hero_link em vez de scroll pra SearchSection inexistente.
//
// 17/06/2026: migrado <img> → <next/image>. Ganha:
// - srcset multi-resolução automático (webp 2000w + webp 600w mobile vira
//   um set responsivo)
// - priority + fetchPriority="high" inseridos no <head> automaticamente
// - lazy-decode pelo browser (decoding async já era)
//
// Mantemos as fotos hero geradas em 3 tamanhos (webp 2000w / webp 600w /
// png 1200w OG) no diretório /<canonical>/assets/ porque a foto OG do social
// continua usando o png. O Image só renderiza as duas WebP.
export default function Hero({ cfg, heroLayout, heroImage }) {
  const slug = cfg.slug;
  const fileName = heroImage === 'dust' ? cfg.hero.foto_dust : cfg.hero.foto_static;
  const base = fileName.replace(/^assets\//, '').replace(/\.webp$/, '');
  const desktopSrc = `${cfg.seo.canonical_path}assets/${base}.webp`;
  const mobileSrc = `${cfg.seo.canonical_path}assets/${base}-600.webp`;

  const ctaHref = waLink(cfg.wa.hero_link, slug);
  // 3 argumentos com check vermelho abaixo do botão (padrão fixo do topo,
  // decisão Diego 15/09/2026). Vêm de hero.badges quando a LP define.
  const badges = getHeroBadges(cfg);

  return (
    <section className={`hero sec-navy sec-pad ${heroImage === 'dust' ? 'is-dust' : ''}`}>
      {/* 2026-09-15 (item #8): `priority` foi removido do <Image> abaixo. Ele
          emitia um preload próprio da foto de 2000w, que o <source> mobile nem
          usa — o celular baixava ~105 KB à toa. O preload agora é escrito à mão
          no page.jsx, com `media` casando com o <source> daqui. `loading="eager"`
          mantém a foto fora do lazy-load, já que ela é o elemento LCP. */}
      <picture>
        <source media="(max-width: 768px)" srcSet={mobileSrc} type="image/webp" />
        <Image
          className="hero-bg"
          src={desktopSrc}
          /* 2026-09-15 (item #19): alt vazio tratava a foto do veículo como
             decorativa. Ela é o elemento LCP e a única foto de produto da
             página — com alt vazio a LP abria mão do Google Imagens pra uma
             busca de alta intenção ("peça lifan x60"). O texto já existia em
             seo.og_image_alt ("SsangYong Kyron em destaque"); hero.foto_alt
             permite sobrescrever por LP quando fizer sentido. */
          alt={cfg.hero?.foto_alt || cfg.seo?.og_image_alt || ''}
          width={1200}
          height={670}
          loading="eager"
          fetchPriority="high"
          unoptimized
          sizes="100vw"
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
            {/* Padrão fixo do topo (decisão Diego 15/09/2026): pílula vermelha
                com o ícone do WhatsApp e o texto único CTA_PRINCIPAL, igual às
                LPs de diesel e da Casa do Injetor. Sem botão secundário — a LP
                de gasolina não tem busca por placa/ano. Mesmo bloco no celular
                e no desktop. */}
            <div className="hero-ctas">
              <a className="hero-cta-wa" href={ctaHref} target="_blank" rel="noreferrer">
                <WhatsAppIcon size={18} />
                <span>{CTA_PRINCIPAL}</span>
              </a>
            </div>
            <ul className="hero-trusts" aria-label="Garantias">
              {badges.map((b) => (
                <li key={b}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF021E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
