// Conteúdo compartilhado entre LPs gasolina (testimonials + FAQs).
//
// Repositório original (diesel) tinha templates parametrizados por marca de OEM
// e número de FIPE/Denatran. Aqui os templates são mais genéricos pra suportar
// LP veículo-cêntrica de captação ampla.
//
// Override por LP: cfg.content.testimonials (array, REPLACE) e cfg.content.faqs
// (object com merge por id).

const TESTIMONIALS_DEFAULT = [
  {
    q: 'Peça cara, mas aqui o preço estava bem melhor. Fiz o pix na sexta, a peça chegou na segunda. Original, já foi instalada, ficou perfeito. Ganharam um bom cliente.',
    name: 'Ton R.',
    role: 'Automaticar · Londrina/PR',
  },
  {
    q: 'Empresa séria e com compromisso com o cliente. Chegaram todos novos e lacrados. Excelente atendimento.',
    name: 'Marcos Henrique P.',
    role: 'Oficina parceira, ES',
  },
  {
    q: 'Recebi as peças conforme pedido, originais. Entrega e rastreio muito bom e fácil. Obrigado Vanderson pelo atendimento.',
    name: 'Ramon R.',
    role: 'Local Guide do Google · 53 avaliações',
  },
  {
    q: 'Fui muito bem atendido, a peça veio corretamente, com qualidade. Com certeza voltarei a comprar.',
    name: 'Marcelo M.',
    role: 'Cliente, Erechim/RS',
  },
  {
    q: 'Encontrei exatamente a peça que precisava com um ótimo preço. Recomendo o Armazém para quem busca qualidade, agilidade e confiança.',
    name: 'Sara C.',
    role: 'Cliente recorrente',
  },
  {
    q: 'Atendimento ímpar, gentileza e presteza absoluta. Com certeza comprarei novamente.',
    name: 'Joaquim F.',
    role: 'Cliente Armazém',
  },
];

// FAQs default — genéricas pra captação ampla. Cada LP pode sobrescrever
// individualmente via cfg.content.faqs[id] (merge por id).
//
// Slot V = modelo do veículo (Lifan X60, JAC J3, etc.) vem de cfg.veiculo.modelo.
function faqsTemplate(V) {
  return [
    {
      id: 'que-pecas',
      q: `Quais peças vocês têm pro ${V}?`,
      a: `Trabalhamos com a linha asiática completa: filtros, freio, suspensão, embreagem, peças de motor (correia, vela, bobina), elétrica (alternador, partida, bateria) e mecânica geral. Se você não encontrou a categoria na página, manda no WhatsApp o que precisa que a gente verifica disponibilidade na hora.`,
    },
    {
      id: 'compatibilidade',
      q: `Como sei que a peça serve no meu ${V}?`,
      a: `Pedimos ano de fabricação e versão (motor, câmbio quando aplicável) ou o número do chassi. Com isso a gente confirma compatibilidade antes de despachar. Manda uma foto do antigo se ajudar — sempre conferimos.`,
    },
    {
      id: 'qualidade',
      q: 'Qual a procedência das peças?',
      a: 'Trabalhamos com peças originais (de fábrica), genuínas e primeira linha homologada. Pra cada item indicamos as opções disponíveis e preços, você escolhe conforme sua necessidade. Não trabalhamos com paralelo de procedência duvidosa.',
    },
    {
      id: 'preco',
      q: `Quanto custa a manutenção do ${V}?`,
      a: `O preço varia muito por categoria (filtros são acessíveis, kit de embreagem ou correia dentada são maiores). A boa notícia é que a linha asiática tem manutenção mais barata que importados premium. Manda no WhatsApp o que precisa que a gente cota na hora.`,
    },
    {
      id: 'prazo',
      q: 'Prazo de entrega e formas de pagamento?',
      a: 'Despacho no mesmo dia útil da confirmação do pagamento. Entrega rastreada pra todo Brasil de Chapecó/SC. Aceitamos PIX, boleto e cartão em até 10x. Compra acompanha nota fiscal.',
    },
    {
      id: 'troca',
      q: 'E se a peça não servir?',
      a: 'A gente resolve: troca sem custo ou reembolso integral. Por isso pedimos os dados de compatibilidade antes — pra evitar essa situação. Mas se acontecer, é simples.',
    },
    {
      id: 'atendimento',
      q: 'Vocês têm vendedor que entende de carro chinês?',
      a: `Sim. Nossa equipe atende linha asiática há mais de uma década (Lifan, Effa, JAC, Chery, BYD). Conhecemos os modelos, as particularidades de aplicação e onde achar peças que outras lojas dizem "não tem". Você fala com gente que entende.`,
    },
    {
      id: 'frota',
      q: 'Atendem oficina e frotista?',
      a: 'Sim, temos condição especial pra oficina parceira e frota. Chame no WhatsApp informando o volume e a gente alinha preço e prazo.',
    },
  ];
}

export function getContent(cfg) {
  const modelo = cfg?.veiculo?.modelo || 'veículo';
  const V = modelo;

  const baseFaqs = faqsTemplate(V);
  const overrides = cfg?.content?.faqs || {};
  const FAQS = baseFaqs.map((faq) => {
    const ov = overrides[faq.id];
    if (!ov) return faq;
    return { ...faq, ...ov };
  });

  const TESTIMONIALS = cfg?.content?.testimonials || TESTIMONIALS_DEFAULT;

  return { TESTIMONIALS, FAQS };
}
