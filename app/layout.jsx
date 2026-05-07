import './globals.css';

export const metadata = {
  metadataBase: new URL('https://www.armazemautopecas.com.br'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
