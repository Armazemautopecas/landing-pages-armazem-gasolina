'use client';

// LandingClient — versão gasolina. Removido SearchSection e todo state de busca
// por placa/ano. Mantém só Hero + children (TrustBar do page.jsx) pra preservar
// posicionamento visual idêntico ao diesel sem a interatividade do Selector.
//
// Componente é "use client" porque o tipo da árvore ainda é o orquestrador
// herdado do diesel; renderiza Hero (que também é client). Pode ser convertido
// pra server component em refactor futuro se Hero também virar server.

import Hero from './Hero';

const TWEAK_DEFAULTS = {
  heroLayout: 'split',
  heroImage: 'static',
};

export default function LandingClient({ cfg, children }) {
  return (
    <>
      <Hero
        cfg={cfg}
        heroLayout={TWEAK_DEFAULTS.heroLayout}
        heroImage={TWEAK_DEFAULTS.heroImage}
      />
      {children}
    </>
  );
}
