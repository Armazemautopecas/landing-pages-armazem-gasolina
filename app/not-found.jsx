// not-found.jsx mínimo — não importa styles.css pra não puxar o chunk
// CSS gigante em todas as outras LPs (Lighthouse mostrou 769ms wasted no
// 14u4161w~k404.css em mobile).
//
// Página em si é rara (404 do app) mas o Next bundle-shares CSS por rota,
// então um not-found que importa styles.css faz o CSS shared aparecer
// como chunk separado pré-carregado em todas as outras páginas.

export const metadata = {
  title: '404 — Armazém Auto Peças',
  description: 'Página não encontrada.',
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        fontFamily: 'system-ui, sans-serif',
        background: '#041F30',
        color: '#F5F5F5',
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: 72, fontWeight: 800, margin: '0 0 8px' }}>404</h1>
      <p style={{ fontSize: 18, margin: '0 0 24px', opacity: 0.85 }}>
        Página não encontrada.
      </p>
      <a
        href="https://www.armazemautopecas.com.br/"
        style={{
          display: 'inline-block',
          padding: '14px 28px',
          background: '#FF021E',
          color: '#fff',
          textDecoration: 'none',
          fontWeight: 700,
          borderRadius: 999,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          fontSize: 14,
        }}
      >
        Voltar pra loja
      </a>
    </main>
  );
}
