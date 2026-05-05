# Landing Pages — Armazém Auto Peças (Diesel)

Monorepo de landing pages de peças automotivas da Armazém Auto Peças, Chapecó/SC.

Cada LP é uma pasta estática servida pelo Vercel em subpath próprio.

## Estrutura

```
landing-pages-armazem-diesel/
├── bico-amarok/            → /bico-amarok
├── s10-[peça]/             → /s10-[peça]
├── vercel.json             → config de static hosting
├── .gitignore
└── README.md
```

## Stack

- HTML estático + React 18.3.1 via CDN (UMD) + Babel standalone 7.29.0
- Sem build step — Vercel serve direto como static site
- Design tokens em `styles.css` (`:root`)
- Fontes: Big Shoulders Display, Work Sans, JetBrains Mono (Google Fonts)

## Adicionar nova LP

Usa a skill `armazem-lp-generator` do Claude Code. Ela coleta os campos, gera os 6 arquivos (index.html + 4 jsx + styles.css) e a pasta `assets/`, e você copia pra cá como subpasta nova.

## Deploy

Push na `main` → Vercel deploya automático.
Preview por branch: toda branch aberta vira URL própria.

## Convenções

- Nome da pasta: `[peça]-[veículo]` kebab-case (ex: `bico-amarok`, `turbina-hilux`) — bate com o path público servido pela Bunny em `armazemautopecas.com.br/injecao-diesel/<slug>/`
- Entry sempre `index.html` (pra Vercel servir no subpath sem config extra)
- Assets em `assets/` dentro da própria pasta da LP
- WhatsApp único CTA → `wa.me/554998829474`
