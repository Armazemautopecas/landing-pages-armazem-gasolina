import { waLink, WA_NUMBER_DISPLAY } from './lib/wa';
import { WhatsAppIcon } from './atoms';
import { CTA_PRINCIPAL } from '@/lib/content';

export default function FinalCTA({ cfg }) {
  return (
    <section className="sec-navy">
      <div className="container final-cta">
        <h2 className="h2">{cfg.final_cta.h2_l1} <span className="red">{cfg.final_cta.h2_l2_red_l1}<br />{cfg.final_cta.h2_l2_red_l2}</span>?</h2>
        {/* 2026-09-15 (item #14): a âncora só é renderizada quando sub_anchor tem
            texto. Antes saía sempre, vazia e apontando pra "#buscar" — âncora que
            não existe nas LPs de gasolina (resíduo do template diesel, que tinha
            busca por placa). Link sem texto reprovava acessibilidade nas 15 LPs.
            Quando preenchido, o destino é o WhatsApp, o único destino que estas
            LPs têm. sub_post idem: só entra se tiver texto. */}
        <p>
          {cfg.final_cta.sub_pre}
          {cfg.final_cta.sub_anchor ? (
            <>
              {' '}
              <a href={waLink(cfg.wa.final_cta, cfg.slug)} target="_blank" rel="noreferrer" className="cta-anchor">
                {cfg.final_cta.sub_anchor}
              </a>
            </>
          ) : null}
          {cfg.final_cta.sub_post ? ` ${cfg.final_cta.sub_post}` : ''}
        </p>
        <a className="btn btn-red btn-lg" href={waLink(cfg.wa.final_cta, cfg.slug)} target="_blank" rel="noreferrer">
          <WhatsAppIcon /> {CTA_PRINCIPAL}
        </a>
        <div className="microtext">
          {cfg.final_cta.microtext_pre} {WA_NUMBER_DISPLAY} {cfg.final_cta.microtext_post}
        </div>
      </div>
    </section>
  );
}
