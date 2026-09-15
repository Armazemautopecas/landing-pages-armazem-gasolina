import Script from 'next/script';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://www.armazemautopecas.com.br'),
  // 2026-09-15: favicon servido de /lp/_assets/ (path roteado pela Bunny).
  // A rota raiz /icon.svg (antigo app/icon.svg) foi removida: a Bunny não
  // roteia a raiz do domínio, então respondia 404 em produção.
  icons: {
    icon: [{ url: '/lp/_assets/icon.svg', type: 'image/svg+xml' }],
    shortcut: [{ url: '/lp/_assets/icon.svg', type: 'image/svg+xml' }],
  },
};

// 2026-09-15 (item #16): mesma condição do next.config.mjs — o assetPrefix só
// aponta pro domínio da Vercel em VERCEL_ENV=production. Só nesse caso o CSS e
// os chunks vêm de um domínio diferente do HTML, e aí o browser paga DNS + TLS
// antes de conseguir pintar. O preconnect adianta esse custo (80-300 ms de LCP).
const ASSET_ORIGIN =
  process.env.VERCEL_ENV === 'production'
    ? 'https://landing-pages-armazem-gasolina.vercel.app'
    : null;

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        {ASSET_ORIGIN ? (
          <>
            <link rel="preconnect" href={ASSET_ORIGIN} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={ASSET_ORIGIN} />
          </>
        ) : null}
      </head>
      <body>
        {children}
        {/* Pixel Armazém (Campaign Tracker) — Opção A do Vinicius (2026-05-08).
            17/06/2026: trocado afterInteractive → lazyOnload pra zerar contribuição
            no TBT (estava bloqueando ~400ms no mobile). lazyOnload = roda só depois
            do `load` event, fora do caminho crítico do LCP. Tracking continua OK,
            só atrasa ~1-2s a entrega do hit, aceitável. */}
        <Script
          src="https://t.armazemautopecas.com.br/pixel.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
