import { redirect } from 'next/navigation';

// Domínio público é www.armazemautopecas.com.br; o landing-pages-armazem-gasolina.vercel.app
// só serve as LPs sob /pecas-lifan-*. Acesso à raiz envia o usuário direto pro site institucional.
export default function RootPage() {
  redirect('https://www.armazemautopecas.com.br/');
}
