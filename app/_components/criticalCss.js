// Critical CSS — regras inlineadas no <head> do page.jsx das LPs.
//
// Por que: o Lighthouse mobile mostrou render-delay = 73% do LCP (2.4s).
// O browser precisa esperar baixar+parsear o chunk CSS antes de pintar o hero.
// Inlinear o crítico (~3kb gzip) na resposta HTML elimina esse round-trip.
//
// Escopo: cobre TUDO que aparece nos primeiros 720px (above-the-fold mobile):
// - reset/box-sizing
// - variáveis :root
// - .container, .sec-pad, .sec-navy
// - .hero, .hero-bg, .hero-overlay, .hero-grid, .hero-tag, .hero-sub, .hero-h1
// - .hero-cta-mobile + animações que rolam logo
// - font-display swap pras 3 famílias (já tava no styles.css mas inline garante)
//
// Mantemos o styles.css completo carregando depois — só removemos o blocking
// da primeira pintura.

const CRITICAL_CSS = `
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0;padding:0}
body{background:#F5F5F5;color:#0a1620;font-family:"Work Sans",system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased}
:root{--navy:#041F30;--off:#F5F5F5;--red:#FF021E;--muted:#556470;--f-head:"Big Shoulders Display","Big Shoulders",Impact,sans-serif;--f-body:"Work Sans",system-ui,sans-serif}
img,picture,svg{display:block;max-width:100%;height:auto}
a{color:inherit;text-decoration:none}
ul{list-style:none;padding:0;margin:0}
.container{width:100%;max-width:1200px;margin:0 auto;padding:0 20px}
.sec-navy{background:var(--navy);color:var(--off)}
.sec-pad{padding:72px 0}
.hero{position:relative;overflow:hidden;isolation:isolate;min-height:640px;background:var(--navy)}
.hero-bg{position:absolute;inset:0;z-index:0;width:100%;height:100%;object-fit:cover;object-position:center center;animation:heroZoom 8s ease-out forwards}
.hero-overlay{position:absolute;inset:0;z-index:1;background:linear-gradient(95deg,rgba(4,31,48,0.97) 0%,rgba(4,31,48,0.85) 30%,rgba(4,31,48,0.4) 60%,rgba(4,31,48,0.05) 100%),linear-gradient(180deg,rgba(4,31,48,0) 70%,rgba(4,31,48,0.85) 100%)}
.hero-swipe{position:absolute;top:0;left:0;height:3px;width:100%;background:linear-gradient(90deg,var(--red) 0%,var(--red) 30%,transparent 70%);transform-origin:left;animation:swipe 1.2s cubic-bezier(0.2,0.8,0.2,1) .2s both;z-index:4}
.hero .container{position:relative;z-index:3}
.hero-grid{display:grid;gap:36px;align-items:start;color:var(--off)}
.eyebrow{font-family:var(--f-body);font-size:12px;letter-spacing:0.18em;text-transform:uppercase;font-weight:600;color:var(--off)}
.hero-tag{color:rgba(245,245,245,0.85);margin-bottom:18px;display:inline-flex;align-items:center;gap:10px}
.hero-tag::before{content:"";width:32px;height:2px;background:var(--red);transform-origin:left center}
.h1{font-family:var(--f-head);font-weight:800;line-height:0.95;letter-spacing:-0.01em;margin:0;color:var(--off);font-size:clamp(40px,7vw,84px);text-transform:uppercase}
.hero-h1{color:var(--off);text-shadow:0 2px 30px rgba(0,0,0,0.35)}
.hero-h1 .line-2{display:block;color:rgba(245,245,245,0.88);font-weight:600;font-size:0.58em;letter-spacing:0.02em;margin-top:8px}
.hero-h1 .red-dot{display:inline-block;width:12px;height:12px;background:var(--red);border-radius:50%;margin-left:8px;vertical-align:0.1em}
.hero-sub{font-size:16px;line-height:1.55;color:rgba(245,245,245,0.85);margin:18px 0 0;max-width:48ch}
.hero-cta-mobile{display:none}
.hero-trusts-desktop{display:none;list-style:none;padding:0;margin:28px 0 0;flex-wrap:wrap;gap:18px 24px;font-size:13px;color:rgba(245,245,245,0.88);letter-spacing:0.01em}
.hero-trusts-desktop li{display:inline-flex;align-items:center;gap:8px}
@media (min-width:960px){.hero-trusts-desktop{display:flex}}
@media (max-width:720px){
.hero{min-height:clamp(560px,88svh,720px);padding:56px 0 36px}
.hero-overlay{background:linear-gradient(180deg,rgba(4,31,48,0.55) 0%,rgba(4,31,48,0.30) 25%,rgba(4,31,48,0.45) 55%,rgba(4,31,48,0.92) 100%)}
.hero-bg{object-position:50% 65%}
.hero-grid{gap:18px}
.hero-h1{font-size:clamp(30px,8.5vw,44px);line-height:1.0}
.hero-h1 .line-2{font-size:0.46em}
.hero-tag{font-size:10px;letter-spacing:0.14em;margin-bottom:12px}
.hero-tag::before{width:22px}
.hero-sub{font-size:14px;margin-top:12px;max-width:none}
.hero-cta-mobile{display:inline-flex;align-items:center;justify-content:center;gap:10px;margin-top:22px;min-height:56px;padding:18px 32px;background:var(--red);color:var(--off);font-family:var(--f-head);font-weight:700;font-size:15px;letter-spacing:0.04em;text-transform:uppercase;text-decoration:none;border-radius:999px;box-shadow:0 10px 28px rgba(255,2,30,0.45),0 2px 6px rgba(0,0,0,0.2)}
}
@keyframes heroZoom{from{transform:scale(1.05)}to{transform:scale(1)}}
@keyframes swipe{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media (prefers-reduced-motion:reduce){.hero-bg{animation:none}.hero-swipe{animation:none}}
`.replace(/\n/g, '').replace(/\s+/g, ' ').trim();

export default CRITICAL_CSS;
