import Script from 'next/script';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://www.armazemautopecas.com.br'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
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
