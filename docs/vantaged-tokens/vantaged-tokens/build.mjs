// Vantaged design tokens: builds src/tokens.json (W3C Design Tokens format) into
//   dist/tokens.css   CSS variables (light on :root, dark on [data-theme="dark"] and prefers-color-scheme) + text classes
//   dist/tokens.ts    typed values for JS/TS, and `native` for React Native
//   dist/tokens.json  flat, resolved values
//   dist/contrast.json  contrast audit (the build fails if a promised pair drops below target)
// No dependencies: `node build.mjs`
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const src = JSON.parse(readFileSync(new URL('./src/tokens.json', import.meta.url)));
const PREFIX = 'vt';
const MODE_ROOTS = ['semantic', 'dark'];

const tokens = [];
(function walk(node, path, type) {
  if (node && typeof node === 'object' && '$value' in node) { tokens.push({ path, type: node.$type || type, value: node.$value, description: node.$description }); return; }
  for (const [k, v] of Object.entries(node)) if (!k.startsWith('$')) walk(v, [...path, k], node.$type || type);
})(src, [], undefined);
const byPath = new Map(tokens.map(t => [t.path.join('.'), t]));

const ALIAS = /^\{([^}]+)\}$/;
function resolve(v, seen = []) {
  if (typeof v === 'string') { const m = v.match(ALIAS); if (!m) return v; if (seen.includes(m[1])) throw new Error(`Alias loop at {${m[1]}}`); const t = byPath.get(m[1]); if (!t) throw new Error(`Unknown alias {${m[1]}}`); return resolve(t.value, [...seen, m[1]]); }
  if (Array.isArray(v)) return v.map(x => resolve(x, seen));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, resolve(x, seen)]));
  return v;
}

const cssName = path => `--${PREFIX}-${path.filter((p, i) => !(i === 0 && MODE_ROOTS.includes(p))).join('-').replace(/\./g, '_')}`;
const rgba = h => { const x = h.replace('#', ''); if (x.length !== 8) return h; const [r, g, b, a] = [0, 2, 4, 6].map(i => parseInt(x.slice(i, i + 2), 16)); return `rgba(${r}, ${g}, ${b}, ${+(a / 255).toFixed(3)})`; };
const color = v => (typeof v === 'string' && /^#[0-9a-f]{8}$/i.test(v) ? rgba(v) : v);
const quoteFamily = f => (/\s/.test(f) ? `'${f}'` : f);
function format(type, v) {
  switch (type) {
    case 'color': return color(v);
    case 'fontFamily': return v.map(quoteFamily).join(', ');
    case 'shadow': return (Array.isArray(v) ? v : [v]).map(s => `${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${color(s.color)}`).join(', ');
    case 'cubicBezier': return `cubic-bezier(${v.join(', ')})`;
    default: return String(v);
  }
}
const cssValue = t => { const m = typeof t.value === 'string' && t.value.match(ALIAS); return m ? `var(${cssName(m[1].split('.'))})` : format(t.type, resolve(t.value)); };

/* ---------- CSS */
const out = ['/* Vantaged design tokens · generated from src/tokens.json — edit that file, then run `node build.mjs` */', '/* White 60% · Orange #EF5F18 30% · Scarlet Bikini #261A66 10% */', '', ':root {'];
let group = '';
const block = list => list.forEach(t => { const g = t.path.slice(0, MODE_ROOTS.includes(t.path[0]) ? 3 : 2).join('.'); if (g !== group) { out.push(`\n  /* ${g} */`); group = g; } out.push(`  ${cssName(t.path)}: ${cssValue(t)};`); });
block(tokens.filter(t => t.type !== 'typography' && t.path[0] !== 'dark' && t.path[0] !== 'breakpoint'));
out.push('}', '');
const dark = tokens.filter(t => t.path[0] === 'dark');
const darkVars = dark.map(t => `  ${cssName(t.path)}: ${cssValue(t)};`).join('\n');
out.push('/* Light (white) is the default. Dark mode is opt-in: set data-theme="dark" on <html> */', '[data-theme="dark"] {', '  color-scheme: dark;', darkVars, '}', '');
out.push('/* Breakpoints (mobile-first, min-width). CSS variables can’t be used inside media queries:');
tokens.filter(t => t.path[0] === 'breakpoint').forEach(t => out.push(`   ${t.path[1].padEnd(4)} @media (min-width: ${t.value})`));
out.push('*/', '', '/* Text styles */');
for (const t of tokens.filter(t => t.type === 'typography')) {
  const v = t.value, n = t.path.at(-1), r = x => { const m = typeof x === 'string' && x.match(ALIAS); return m ? `var(${cssName(m[1].split('.'))})` : x; };
  out.push(`.${PREFIX}-${n} { font-family: ${r(v.fontFamily)}; font-size: ${r(v.fontSize)}; font-weight: ${r(v.fontWeight)}; line-height: ${r(v.lineHeight)}; letter-spacing: ${r(v.letterSpacing)};${n === 'overline' ? ' text-transform: uppercase;' : ''} }`);
}
out.push('');
mkdirSync(new URL('./dist/', import.meta.url), { recursive: true });
writeFileSync(new URL('./dist/tokens.css', import.meta.url), out.join('\n'));

/* ---------- TS / JSON */
const nest = entries => { const o = {}; for (const [path, val] of entries) { let p = o; path.forEach((k, i) => { if (i === path.length - 1) p[k] = val; else p = p[k] ??= {}; }); } return o; };
const webVal = t => { const v = resolve(t.value); return t.type === 'typography' ? { ...v, fontFamily: format('fontFamily', v.fontFamily) } : ['color', 'shadow', 'cubicBezier', 'fontFamily'].includes(t.type) ? format(t.type, v) : v; };
const px = v => (typeof v === 'string' && /^-?[\d.]+px$/.test(v) ? parseFloat(v) : v);
function nativeVal(t) {
  const v = resolve(t.value);
  switch (t.type) {
    case 'dimension': return typeof v === 'string' && v.endsWith('em') ? v : px(v);
    case 'duration': return parseFloat(v);
    case 'color': return color(v);
    case 'fontFamily': return v[0];
    case 'fontWeight': return String(v);
    case 'typography': { const size = px(v.fontSize); return { fontFamily: v.fontFamily[0], fontSize: size, fontWeight: String(v.fontWeight), lineHeight: Math.round(size * v.lineHeight), letterSpacing: +(parseFloat(v.letterSpacing) * size).toFixed(2), ...(t.path.at(-1) === 'overline' ? { textTransform: 'uppercase' } : {}) }; }
    case 'shadow': { const s = Array.isArray(v) ? v[0] : v; return { shadowColor: s.color.slice(0, 7), shadowOpacity: +(parseInt(s.color.slice(7) || 'ff', 16) / 255).toFixed(3), shadowRadius: px(s.blur) / 2, shadowOffset: { width: px(s.offsetX), height: px(s.offsetY) }, elevation: Math.max(1, Math.round(px(s.blur) / 4)) }; }
    default: return v;
  }
}
const web = nest(tokens.map(t => [t.path, webVal(t)]));
const native = nest(tokens.filter(t => t.path[0] !== 'breakpoint').map(t => [t.path, nativeVal(t)]));
writeFileSync(new URL('./dist/tokens.ts', import.meta.url), `// Vantaged design tokens · generated from src/tokens.json — do not edit by hand
// White 60% · Orange #EF5F18 30% · Scarlet Bikini #261A66 10%
// \`tokens.semantic\` is light mode, \`tokens.dark\` is dark mode (same keys).

/** Web values (CSS strings). For styling prefer the CSS variables; use this in JS (charts, canvas, SVG, emails). */
export const tokens = ${JSON.stringify(web, null, 2)} as const;

/** React Native values: unitless numbers, absolute line heights, native shadow objects. */
export const native = ${JSON.stringify(native, null, 2)} as const;

export type Tokens = typeof tokens;
export type ColorRoles = typeof tokens.semantic.color;
export default tokens;
`);
writeFileSync(new URL('./dist/tokens.json', import.meta.url), JSON.stringify(Object.fromEntries(tokens.map(t => [t.path.join('.'), webVal(t)])), null, 2));

/* ---------- contrast audit, both modes */
const lum = h => { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(x => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const PAIRS = [
  ['text.default', 'background.default', 4.5], ['text.default', 'background.subtle', 4.5], ['text.muted', 'background.default', 4.5], ['text.muted', 'surface.raised', 4.5], ['text.subtle', 'background.default', 3],
  ['text.on-primary', 'primary.default', 4.5], ['text.on-primary', 'primary.hover', 4.5], ['text.on-secondary', 'secondary.default', 4.5], ['text.link', 'background.default', 4.5], ['text.inverse', 'background.inverse', 4.5],
  ['text.on-brand', 'background.brand', 3], ['primary.text', 'primary.subtle', 4.5], ['secondary.text', 'secondary.subtle', 4.5],
  ['success.default', 'success.subtle', 4.5], ['warning.default', 'warning.subtle', 4.5], ['error.default', 'error.subtle', 4.5], ['info.default', 'info.subtle', 4.5],
  ['success.on-solid', 'success.solid', 4.5], ['warning.on-solid', 'warning.solid', 4.5], ['error.on-solid', 'error.solid', 4.5], ['info.on-solid', 'info.solid', 4.5],
  ['border.focus', 'background.default', 3],
];
const report = [];
for (const mode of MODE_ROOTS) for (const [fg, bg, min] of PAIRS) { const a = resolve(`{${mode}.color.${fg}}`), b = resolve(`{${mode}.color.${bg}}`); const r = ratio(a, b); report.push({ mode: mode === 'semantic' ? 'light' : 'dark', fg, bg, fgValue: a, bgValue: b, ratio: +r.toFixed(2), min, pass: r >= min }); }
writeFileSync(new URL('./dist/contrast.json', import.meta.url), JSON.stringify(report, null, 2));
const fails = report.filter(r => !r.pass);
console.log(`${tokens.length} tokens · contrast ${report.length - fails.length}/${report.length} pass`);
if (fails.length) { console.table(fails.map(({ mode, fg, bg, ratio, min }) => ({ mode, fg, bg, ratio, min }))); process.exitCode = 1; }
