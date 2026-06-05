// Categorias — bloco novo da LP gasolina (não existe no diesel).
// Lista categorias de peça relevantes pro modelo (filtros, freio, suspensão, etc.)
// Cada card tem foto OU emoji fallback + título + CTA WhatsApp com mensagem específica.

import { waLink } from './lib/wa';
import { WhatsAppIcon } from './atoms';

export default function Categorias({ cfg }) {
  const cats = cfg.categorias?.items || [];
  if (!cats.length) return null;

  const slug = cfg.slug;

  return (
    <section className="sec-off sec-pad" id="categorias">
      <div className="container">
        <div className="testi-head" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ color: 'var(--muted)', marginBottom: 10 }}>
            {cfg.categorias?.eyebrow || 'Tudo num lugar só'}
          </div>
          <h2 className="h2">{cfg.categorias?.titulo}</h2>
          {cfg.categorias?.subtitulo && (
            <p className="hero-sub" style={{ color: 'var(--muted)', marginTop: 12 }}>
              {cfg.categorias.subtitulo}
            </p>
          )}
        </div>

        <div className="categorias-grid">
          {cats.map((cat, i) => {
            const fotoSrc = cat.imagem ? `/gasolina/${slug}/assets/${cat.imagem}` : null;
            const ctaHref = waLink(cat.whatsapp_mensagem, slug);
            return (
              <a
                key={i}
                href={ctaHref}
                target="_blank"
                rel="noreferrer"
                className="categoria-card"
              >
                <div className="categoria-media">
                  {fotoSrc ? (
                    <img src={fotoSrc} alt={cat.nome} loading="lazy" />
                  ) : (
                    <div className="categoria-emoji">{cat.emoji || '🛠️'}</div>
                  )}
                </div>
                <div className="categoria-body">
                  <h3 className="categoria-ttl">{cat.nome}</h3>
                  {cat.descricao && <p className="categoria-desc">{cat.descricao}</p>}
                  <span className="categoria-cta">
                    <WhatsAppIcon size={16} />
                    {cat.cta_label || 'Quero cotar'}
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {cfg.categorias?.cta_final && (
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <a
              className="btn btn-red btn-lg"
              href={waLink(cfg.wa.categorias_geral || cfg.wa.fab_default, slug)}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon /> {cfg.categorias.cta_final}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
