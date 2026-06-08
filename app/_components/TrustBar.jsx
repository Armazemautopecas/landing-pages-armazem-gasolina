import { TrustIcon } from './atoms';

// TrustBar — lê cells de cfg.trust_bar.items (4 cells obrigatórios).
// Cada cell: { icon: 'shield'|'box'|'gear'|'factory', ttl, sub, num }.
// Fallback: Set A (sobriedade asiática) — usado se config não definir.
const FALLBACK_CELLS = [
  { icon: 'shield', ttl: 'Peças Certificadas', sub: 'Procedência garantida', num: '100%' },
  { icon: 'box', ttl: 'Despacho Rápido', sub: 'Saída em 24h úteis', num: '24h' },
  { icon: 'gear', ttl: 'Anos com Asiáticos', sub: 'Lifan, Effa, JAC, Chery', num: '10+' },
  { icon: 'factory', ttl: 'Entrega Garantida', sub: 'Em todo Brasil — saída de Chapecó/SC', num: '🇧🇷' },
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
