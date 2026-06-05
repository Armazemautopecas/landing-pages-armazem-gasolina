import { TrustIcon } from './atoms';

// TrustBar gasolina — lê 4 itens de cfg.trust_bar.items.
// Cada item: { icon: 'shield'|'box'|'gear'|'factory', ttl, sub, num }.
const FALLBACK_CELLS = [
  { icon: 'shield', ttl: 'Peças Certificadas', sub: 'Procedência garantida', num: '100%' },
  { icon: 'box', ttl: 'Despacho Rápido', sub: 'Saída em até 24h úteis', num: '24h' },
  { icon: 'gear', ttl: 'Atendimento Humano', sub: 'Direto no WhatsApp', num: '0' },
  { icon: 'factory', ttl: 'Pra todo Brasil', sub: 'Saída de Chapecó/SC', num: 'BR' },
];

export default function TrustBar({ cfg, style }) {
  const cells = cfg.trust_bar?.items || FALLBACK_CELLS;

  return (
    <section className={`trust ${style === 'minimal' ? 'is-minimal' : ''} ${style === 'numbers' ? 'is-numbers' : ''}`}>
      <div className="container">
        <div className="trust-row">
          {cells.map((c, i) => (
            <div className="trust-cell" key={i}>
              {style === 'numbers'
                ? <div className="num">{c.num}</div>
                : <TrustIcon kind={c.icon} />}
              <div className="ttl">{c.ttl}</div>
              <div className="sub">{c.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
