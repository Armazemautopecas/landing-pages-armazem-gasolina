export const WA_NUMBER = '5549999484754';
export const WA_NUMBER_DISPLAY = '(49) 99948-4754';

// Bridge do tracker — garante UTM rastreada e atribuicao por LP.
// Quando `slug` for passado, o link vai por /wa/<slug> e o bridge faz
// pre-register, depois redireciona pro wa.me preservando o texto.
const TRACKER_BRIDGE = 'https://t.armazemautopecas.com.br/wa';

export function waLink(msg, slug) {
  if (slug) {
    return `${TRACKER_BRIDGE}/${encodeURIComponent(slug)}?text=${encodeURIComponent(msg)}`;
  }
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function fmt(template, vars) {
  return String(template).replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : ''));
}
