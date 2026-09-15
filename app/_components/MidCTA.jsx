import { waLink } from './lib/wa';
import { WhatsAppIcon } from './atoms';
import { CTA_PRINCIPAL } from '@/lib/content';

// MidCTA — 2026-09-15 (itens #10/#25 do backlog).
// A LP tinha 4.400px de rolagem com só 2 saídas pro WhatsApp: uma no topo e
// uma no rodapé (mais a bolinha flutuante, que é ícone sem texto). Quem se
// convencia no meio — nos depoimentos ou no FAQ — tinha que procurar o botão.
//
// Este bloco repete EXATAMENTE o botão principal da LP: mesmo texto
// (cfg.final_cta.btn), mesmo link pela bridge de rastreio
// (t.armazemautopecas.com.br/wa/<slug>) e mesma classe de botão. Nada de copy
// nova. Fundo `sec-off` porque entra entre seções claras (depoimentos e FAQ).
export default function MidCTA({ cfg }) {
  return (
    <section className="sec-off mid-cta">
      <div className="container">
        <a
          className="btn btn-red btn-lg"
          href={waLink(cfg.wa.final_cta, cfg.slug)}
          target="_blank"
          rel="noreferrer"
        >
          <WhatsAppIcon /> {CTA_PRINCIPAL}
        </a>
      </div>
    </section>
  );
}
