// LandingClient simplificado pra repo gasolina (veículo-cêntrico).
// Original (diesel) orquestrava Hero + SearchSection com state de busca por placa.
// Aqui é só wrapper estático Hero + children (TrustBar/Categorias/etc do page.jsx).
// Mantido como componente porque page.jsx do diesel já importava — facilita migração.

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
