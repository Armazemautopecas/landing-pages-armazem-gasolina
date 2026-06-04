import { waLink, WA_NUMBER_DISPLAY } from './lib/wa';
import { WhatsAppIcon } from './atoms';

export default function FinalCTA({ cfg }) {
  return (
    <section className="sec-navy">
      <div className="container final-cta">
        <h2 className="h2">{cfg.final_cta.h2_l1} <span className="red">{cfg.final_cta.h2_l2_red_l1}<br />{cfg.final_cta.h2_l2_red_l2}</span>?</h2>
        <p>{cfg.final_cta.sub_pre} <a href="#buscar" className="cta-anchor">{cfg.final_cta.sub_anchor}</a> {cfg.final_cta.sub_post}</p>
        <a className="btn btn-red btn-lg" href={waLink(cfg.wa.final_cta, cfg.slug)} target="_blank" rel="noreferrer">
          <WhatsAppIcon /> {cfg.final_cta.btn}
        </a>
        <div className="microtext">
          {cfg.final_cta.microtext_pre} {WA_NUMBER_DISPLAY} {cfg.final_cta.microtext_post}
        </div>
      </div>
    </section>
  );
}
