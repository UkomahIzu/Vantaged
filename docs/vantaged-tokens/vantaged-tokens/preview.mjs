// Builds dist/preview.html, a visual reference sheet for every token. Run after build.mjs.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const T = JSON.parse(readFileSync(new URL('./dist/tokens.json', import.meta.url)));
const css = readFileSync(new URL('./dist/tokens.css', import.meta.url), 'utf8');
const contrast = JSON.parse(readFileSync(new URL('./dist/contrast.json', import.meta.url)));
const src = JSON.parse(readFileSync(new URL('./src/tokens.json', import.meta.url)));
const FONT_DIR = process.env.FONT_DIR || '/home/claude/vweb/node_modules/@fontsource-variable/plus-jakarta-sans/files/';
const font = f => (existsSync(FONT_DIR + f) ? `url(data:font/woff2;base64,${readFileSync(FONT_DIR + f).toString('base64')}) format('woff2-variations')` : `local('Plus Jakarta Sans')`);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const desc = path => path.split('.').reduce((o, k) => o?.[k], src)?.$description || '';
const lum = h => { if (!/^#[0-9a-f]{6}/i.test(h)) return 1; const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(x => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const on = hex => (lum(hex) < 0.35 ? '#fff' : '#261A66');
const keys = pre => Object.keys(T).filter(k => k.startsWith(pre));
const varName = k => '--vt-' + k.replace(/^(semantic|dark)\./, '').replace(/\./g, '-');

const scale = name => `<div class="scale">${keys(`color.${name}.`).map(k => `<div class="chip" style="background:${T[k]};color:${on(T[k])}"><b>${k.split('.').pop()}</b><span>${T[k]}</span></div>`).join('')}</div>`;
const groups = [...new Set(keys('semantic.color.').map(k => k.split('.')[2]))];
const semantic = groups.map(g => `<h3>${g}</h3><div class="sem"><div class="shead"><span>Token</span><span>Light</span><span>Dark</span><span>Use</span></div>${keys(`semantic.color.${g}.`).map(k => { const d = k.replace('semantic.', 'dark.'); return `<div class="srow"><code>${varName(k)}</code><span class="v"><i style="background:${T[k]}"></i>${esc(T[k])}</span><span class="v"><i style="background:${T[d]}"></i>${esc(T[d])}</span><span class="d">${esc(desc(k))}</span></div>`; }).join('')}</div>`).join('');
const samples = { 'display-lg': 'See the build.', display: 'Approve the work.', 'display-sm': 'Pay with proof.', h1: 'Heading one', h2: 'Heading two', h3: 'Heading three', h4: 'Heading four', h5: 'Heading five', h6: 'Heading six', 'body-lg': 'Large body for introductions and short leads.', body: 'Body text for paragraphs, forms and most interface copy.', 'body-sm': 'Small body for dense tables, meta and supporting text.', label: 'Form label', button: 'Button text', caption: 'Caption · timestamps and badges', overline: 'Overline', code: 'const amount = 9_562_500;' };
const typo = keys('typography.').map(k => { const n = k.split('.')[1], v = T[k]; return `<div class="trow"><div class="tmeta"><code>.vt-${n}</code><span>${v.fontSize} / ${v.lineHeight} · ${v.fontWeight}${v.letterSpacing !== '0em' ? ' · ' + v.letterSpacing : ''}</span></div><div class="vt-${n} tsample">${samples[n] || n}</div></div>`; }).join('');
const spaces = keys('space.').sort((a, b) => parseFloat(T[a]) - parseFloat(T[b])).map(k => `<div class="sp"><code>space-${k.slice(6)}</code><span class="bar" style="width:${T[k]}"></span><span class="v">${T[k]}</span></div>`).join('');
const sizeRow = pre => keys(pre).map(k => `<div class="ctl"><span style="height:${T[k]};${pre.includes('icon') ? `width:${T[k]};border-radius:4px` : 'width:120px;border-radius:999px'}"></span><code>${k.split('.').pop()}</code><em>${T[k]}</em></div>`).join('');
const radii = keys('radius.').map(k => `<div class="rad"><span style="border-radius:${T[k]}"></span><code>${k.split('.').pop()}</code><em>${T[k]}</em></div>`).join('');
const shadows = keys('shadow.').map(k => `<div class="shd"><span style="box-shadow:${T[k]}${k.endsWith('focus') ? ';outline:1px solid var(--vt-color-border-focus)' : ''}"></span><code>${k.split('.').pop()}</code></div>`).join('');
const motion = keys('duration.').map(k => `<div class="mo"><code>${k.split('.').pop()}</code><span class="track"><i style="animation-duration:${parseFloat(T[k]) ? T[k] : '1ms'}"></i></span><em>${T[k]}</em></div>`).join('') + keys('easing.').map(k => `<div class="mo"><code>${k.split('.').pop()}</code><span class="track"><i style="animation-duration:900ms;animation-timing-function:${T[k]}"></i></span><em>${T[k]}</em></div>`).join('');
const simple = pre => `<div class="kv">${keys(pre).map(k => `<div><code>${k.slice(pre.length)}</code><span>${esc(T[k])}</span></div>`).join('')}</div>`;
const table = mode => `<table><thead><tr><th>Text</th><th>On</th><th></th><th>Ratio</th><th>Target</th></tr></thead><tbody>${contrast.filter(r => r.mode === mode).map(r => `<tr><td>${r.fg}</td><td>${r.bg}</td><td><span class="pair" style="background:${r.bgValue};color:${r.fgValue}">Aa</span></td><td><b>${r.ratio}:1</b></td><td>${r.min >= 4.5 ? 'AA text' : 'AA large / UI'} ${r.pass ? '✓' : '✗'}</td></tr>`).join('')}</tbody></table>`;
const demo = `<div class="demo">
  <div class="row"><button class="b b1">Primary</button><button class="b b2">Secondary</button><button class="b b3">Outline</button><button class="b b4">Ghost</button><button class="b b5">Destructive</button></div>
  <div class="row"><span class="pill s-success">Success</span><span class="pill s-warning">Warning</span><span class="pill s-error">Error</span><span class="pill s-info">Info</span><span class="pill s-brand">Brand</span></div>
  <div class="row"><label class="fld"><span class="vt-label">Email</span><input placeholder="you@example.com"></label><label class="fld"><span class="vt-label">Focused</span><input class="focus" value="Typing…"></label></div>
  <div class="card"><span class="vt-overline" style="color:var(--vt-color-text-brand)">Card</span><span class="vt-h4">Surfaces, borders and text</span><span class="vt-body-sm" style="color:var(--vt-color-text-muted)">Built only from semantic tokens, so it switches with the mode.</span></div>
</div>`;

const html = `<!doctype html><html lang="en-GB" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Vantaged Design Tokens</title>
<style>
@font-face{font-family:'Plus Jakarta Sans';font-weight:200 800;src:${font('plus-jakarta-sans-latin-ext-wght-normal.woff2')};unicode-range:U+0100-02BA,U+20A0-20C0}
@font-face{font-family:'Plus Jakarta Sans';font-weight:200 800;src:${font('plus-jakarta-sans-latin-wght-normal.woff2')};unicode-range:U+0000-00FF,U+2000-206F}
${css}
*{box-sizing:border-box}
body{margin:0;font-family:var(--vt-font-family-sans);font-feature-settings:'tnum' 1;background:var(--vt-color-background-default);color:var(--vt-color-text-default);-webkit-font-smoothing:antialiased;transition:background var(--vt-duration-normal),color var(--vt-duration-normal)}
header{background:var(--vt-color-indigo-900);color:#fff;padding:56px max(18px,calc((100vw - 1120px)/2)) 44px;position:relative;overflow:hidden}
header h1{margin:0 0 10px;font-size:clamp(34px,5vw,60px);font-weight:800;letter-spacing:-.04em;line-height:1}
header p{margin:0;max-width:64ch;line-height:1.6;color:var(--vt-color-indigo-200)}
header .steps{position:absolute;right:-10px;bottom:0;display:flex;align-items:flex-end;gap:6px;opacity:.9}
header .steps i{width:34px;background:var(--vt-color-orange-500);border-radius:6px 6px 0 0}
.toggle{position:absolute;top:20px;right:max(18px,calc((100vw - 1120px)/2));z-index:2;display:flex;padding:4px;border-radius:999px;background:rgba(255,255,255,.12)}
.toggle button{border:0;background:none;color:#fff;font:600 13px var(--vt-font-family-sans);padding:7px 14px;border-radius:999px;cursor:pointer}
.toggle button[aria-pressed="true"]{background:#fff;color:var(--vt-color-indigo-900)}
main{max-width:1120px;margin:0 auto;padding:16px 18px 96px}
section{padding:44px 0;border-bottom:1px solid var(--vt-color-border-default)}
h2{font-size:24px;letter-spacing:-.02em;margin:0 0 6px}h3{font-size:15px;margin:26px 0 8px;text-transform:capitalize}
section>p{margin:0 0 20px;color:var(--vt-color-text-muted);max-width:72ch;line-height:1.55}
code{font:12px var(--vt-font-family-mono);color:var(--vt-color-text-muted)}
.ratio{display:flex;border-radius:20px;overflow:hidden;min-height:170px;box-shadow:var(--vt-shadow-lg);border:1px solid var(--vt-color-border-default)}
.ratio span{padding:20px;display:flex;flex-direction:column;justify-content:flex-end;gap:4px;font-weight:700}.ratio em{font-style:normal;font-weight:400;font-size:13px;opacity:.85}
.scale{display:grid;grid-template-columns:repeat(auto-fit,minmax(78px,1fr));border-radius:14px;overflow:hidden;margin-bottom:6px}
.chip{padding:46px 10px 10px;display:flex;flex-direction:column;gap:2px}.chip b{font-size:13px}.chip span{font:10.5px var(--vt-font-family-mono);opacity:.85}
.sem{border:1px solid var(--vt-color-border-default);border-radius:14px;overflow:hidden}
.shead,.srow{display:grid;grid-template-columns:300px 150px 150px 1fr;gap:14px;align-items:center;padding:10px 16px;border-bottom:1px solid var(--vt-color-border-subtle);font-size:13px}
.shead{background:var(--vt-color-background-subtle);font-weight:600;color:var(--vt-color-text-muted);font-size:12px}.srow:last-child{border:0}
.srow .v{display:flex;align-items:center;gap:8px;font:12px var(--vt-font-family-mono);color:var(--vt-color-text-muted)}.srow i{width:22px;height:22px;border-radius:6px;flex:none;box-shadow:inset 0 0 0 1px rgba(127,120,148,.35)}.srow .d{color:var(--vt-color-text-muted)}
.trow{display:grid;grid-template-columns:230px 1fr;gap:24px;align-items:baseline;padding:16px 0;border-bottom:1px solid var(--vt-color-border-subtle)}.tmeta{display:flex;flex-direction:column;gap:3px}.tmeta span{font-size:12px;color:var(--vt-color-text-muted)}.tsample{min-width:0;overflow-wrap:anywhere}
.sp{display:grid;grid-template-columns:90px 1fr 60px;align-items:center;gap:12px;padding:3px 0}.bar{height:14px;background:var(--vt-color-orange-500);border-radius:3px;display:block;min-width:1px}.sp .v{font:12px var(--vt-font-family-mono);color:var(--vt-color-text-muted)}
.flex{display:flex;flex-wrap:wrap;gap:28px;align-items:flex-end}
.ctl,.rad,.shd{display:flex;flex-direction:column;align-items:center;gap:6px}.ctl span{background:var(--vt-color-primary-subtle);border:1.5px solid var(--vt-color-primary-default);display:block}.ctl em,.rad em{font-style:normal;font-size:12px;color:var(--vt-color-text-muted)}
.rad span{width:92px;height:70px;background:var(--vt-color-primary-subtle);border:1.5px solid var(--vt-color-primary-default)}
.shd span{width:160px;height:100px;border-radius:14px;background:var(--vt-color-surface-raised)}.shadows{padding:24px;background:var(--vt-color-background-subtle);border-radius:20px;gap:40px}
.mo{display:grid;grid-template-columns:110px 1fr 200px;gap:14px;align-items:center;padding:6px 0}.mo em{font-style:normal;font:12px var(--vt-font-family-mono);color:var(--vt-color-text-muted)}
.track{height:10px;border-radius:999px;background:var(--vt-color-background-muted);position:relative;overflow:hidden}.track i{position:absolute;left:0;top:0;bottom:0;width:30%;border-radius:999px;background:var(--vt-color-secondary-default);animation:slide infinite alternate}
@keyframes slide{to{left:70%}}
@media (prefers-reduced-motion:reduce){.track i{animation:none}}
.kv{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px}.kv div{display:flex;justify-content:space-between;gap:10px;padding:10px 14px;border:1px solid var(--vt-color-border-default);border-radius:10px;font-size:13px}
.demo{display:flex;flex-direction:column;gap:18px;padding:28px;border-radius:20px;background:var(--vt-color-background-subtle);border:1px solid var(--vt-color-border-default)}.row{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end}
.b{height:var(--vt-size-control-md);padding:0 var(--vt-space-5);border-radius:var(--vt-radius-full);font:var(--vt-font-weight-semibold) var(--vt-font-size-sm) var(--vt-font-family-sans);cursor:pointer;border:1px solid transparent;transition:background var(--vt-duration-fast) cubic-bezier(.2,0,0,1)}
.b1{background:var(--vt-color-primary-default);color:var(--vt-color-text-on-primary)}.b1:hover{background:var(--vt-color-primary-hover)}
.b2{background:var(--vt-color-secondary-default);color:var(--vt-color-text-on-secondary)}.b2:hover{background:var(--vt-color-secondary-hover)}
.b3{background:var(--vt-color-surface-default);color:var(--vt-color-text-default);border-color:var(--vt-color-border-strong)}
.b4{background:transparent;color:var(--vt-color-primary-text)}.b4:hover{background:var(--vt-color-primary-subtle)}
.b5{background:var(--vt-color-error-solid);color:var(--vt-color-error-on-solid)}
.pill{height:26px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;border:1px solid}
.s-success{background:var(--vt-color-success-subtle);color:var(--vt-color-success-default);border-color:var(--vt-color-success-border)}.s-warning{background:var(--vt-color-warning-subtle);color:var(--vt-color-warning-default);border-color:var(--vt-color-warning-border)}.s-error{background:var(--vt-color-error-subtle);color:var(--vt-color-error-default);border-color:var(--vt-color-error-border)}.s-info{background:var(--vt-color-info-subtle);color:var(--vt-color-info-default);border-color:var(--vt-color-info-border)}.s-brand{background:var(--vt-color-primary-subtle);color:var(--vt-color-primary-text);border-color:var(--vt-color-primary-border)}
.fld{display:flex;flex-direction:column;gap:6px;width:260px}.fld input{height:var(--vt-size-control-md);border-radius:var(--vt-radius-md);border:1px solid var(--vt-color-border-strong);background:var(--vt-color-surface-default);color:var(--vt-color-text-default);padding:0 var(--vt-space-3);font:var(--vt-font-size-md) var(--vt-font-family-sans)}.fld input::placeholder{color:var(--vt-color-text-subtle)}.fld input.focus,.fld input:focus{outline:none;border-color:var(--vt-color-border-focus);box-shadow:var(--vt-shadow-focus)}
.card{display:flex;flex-direction:column;gap:6px;max-width:420px;padding:var(--vt-space-5);border-radius:var(--vt-radius-lg);background:var(--vt-color-surface-raised);border:1px solid var(--vt-color-border-default);box-shadow:var(--vt-shadow-md)}
table{width:100%;border-collapse:collapse;font-size:13px}th{text-align:left;color:var(--vt-color-text-muted);font-weight:600;padding:8px;border-bottom:1px solid var(--vt-color-border-default)}td{padding:7px 8px;border-bottom:1px solid var(--vt-color-border-subtle)}
.pair{display:inline-grid;place-items:center;width:44px;height:28px;border-radius:6px;font-weight:700;box-shadow:inset 0 0 0 1px rgba(127,120,148,.3)}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:28px}
@media (max-width:860px){.shead{display:none}.srow{grid-template-columns:1fr 1fr}.srow code,.srow .d{grid-column:1/-1}.trow{grid-template-columns:1fr;gap:6px}.ratio{flex-direction:column}.ratio span{flex:auto!important;min-height:64px}.cols{grid-template-columns:1fr}.mo{grid-template-columns:90px 1fr}.mo em{grid-column:1/-1}header .steps{display:none}}
</style></head><body>
<header><div class="toggle" role="group" aria-label="Colour mode"><button data-m="light" aria-pressed="true">Light</button><button data-m="dark" aria-pressed="false">Dark</button></div>
<h1>Vantaged design tokens</h1><p>White 60% · Orange #EF5F18 30% · Scarlet Bikini #261A66 10%. Primitive values feed semantic roles in light and dark mode. Build products from the semantic roles so a change to the palette happens in one place.</p>
<div class="steps" aria-hidden="true">${[36, 60, 84, 108, 132].map(h => `<i style="height:${h}px"></i>`).join('')}</div></header>
<main>
<section><h2>Colour proportions</h2><p>The 60 · 30 · 10 rule, measured by area on screen.</p><div class="ratio"><span style="flex:6;background:#fff;color:#261A66">White · 60%<em>Backgrounds, surfaces, space</em></span><span style="flex:3;background:#EF5F18;color:#fff">Orange · 30%<em>Brand panels, primary actions, highlights</em></span><span style="flex:1;background:#261A66;color:#fff">Scarlet Bikini · 10%<em>Navigation, emphasis</em></span></div></section>
<section><h2>Primitive colours</h2><p>The raw palette. Each scale runs from 50 (lightest) to 950 (darkest). Use these only to define semantic roles.</p>
<h3>Orange</h3>${scale('orange')}<h3>Indigo · Scarlet Bikini</h3>${scale('indigo')}<h3>Neutral</h3>${scale('neutral')}<h3>Green</h3>${scale('green')}<h3>Amber</h3>${scale('amber')}<h3>Red</h3>${scale('red')}</section>
<section><h2>Semantic colours</h2><p>What each colour is for, in light and dark mode. These are the names to use when building. Use the toggle at the top to see the page switch modes.</p>${semantic}</section>
<section><h2>In use</h2><p>Common elements made only from tokens.</p>${demo}</section>
<section><h2>Typography</h2><p>Plus Jakarta Sans for everything: clear at small sizes, with tabular figures and the naira sign. A monospace for code.</p>${typo}</section>
<section><h2>Spacing</h2><p>A 4px grid.</p>${spaces}</section>
<section><h2>Sizes</h2><h3>Controls</h3><div class="flex">${sizeRow('size.control.')}</div><h3>Icons</h3><div class="flex">${sizeRow('size.icon.')}</div><h3>Other</h3>${simple('size.container.')}<div style="height:10px"></div>${simple('size.touch-target')}</section>
<section><h2>Radius</h2><div class="flex">${radii}</div></section>
<section><h2>Elevation</h2><p>Shadows are tinted with Scarlet Bikini rather than black, so they sit warmly on white.</p><div class="flex shadows">${shadows}</div></section>
<section><h2>Motion</h2>${motion}</section>
<section><h2>Borders, opacity, breakpoints and layers</h2><h3>Border width</h3>${simple('border-width.')}<h3>Opacity</h3>${simple('opacity.')}<h3>Breakpoints (min-width)</h3>${simple('breakpoint.')}<h3>Z-index</h3>${simple('z-index.')}</section>
<section><h2>Contrast</h2><p>Checked on every build. The build fails if any pair drops below its target.</p><div class="cols"><div><h3>Light</h3>${table('light')}</div><div><h3>Dark</h3>${table('dark')}</div></div></section>
</main>
<script>
document.querySelectorAll('[data-m]').forEach(b=>b.addEventListener('click',()=>{document.documentElement.dataset.theme=b.dataset.m;document.querySelectorAll('[data-m]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
</script></body></html>`;
writeFileSync(new URL('./dist/preview.html', import.meta.url), html);
console.log('dist/preview.html');
