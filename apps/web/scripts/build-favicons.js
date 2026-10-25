const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

// Clean paths from vantaged-v-orange.svg
let rawSvg = fs.readFileSync('public/brand/vantaged-v-orange.svg', 'utf8');
const cleanSvg = rawSvg
  .replace(/ns0:/g, '')
  .replace(/xmlns:ns0="http:\/\/www\.w3\.org\/2000\/svg"/g, 'xmlns="http://www.w3.org/2000/svg"');

const p1Match = cleanSvg.match(/<path d="([^"]+)" fill="currentColor" transform="translate\(7\.590484619140625,-0.153900146484375\)" \/>/);
const p2Match = cleanSvg.match(/<path d="([^"]+)" fill="currentColor" transform="translate\(244\.01686096191406,-0.14044189453125\)" \/>/);
const p3Match = cleanSvg.match(/<path d="([^"]+)" fill="currentColor" transform="translate\(175\.1875,89\.4375\)" \/>/);

const p1 = p1Match[0].replace('fill="currentColor"', 'fill="#EF5F18"');
const p2 = p2Match[0].replace('fill="currentColor"', 'fill="#EF5F18"');
const p3 = p3Match[0].replace('fill="currentColor"', 'fill="#EF5F18"');

// 368x368 canvas, V logo occupies 99% of width (edge-to-edge, huge in browser tab)
// Center of logo: (182.10, 132.65). Canvas center: (184, 184)
// Offset: X = 1.90, Y = 51.35
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="368" height="368" viewBox="0 0 368 368">
  <g transform="translate(1.90 51.35)">
    ${p1}
    ${p2}
    ${p3}
  </g>
</svg>`;

function createIco(pngBuffers, sizes) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(pngBuffers.length, 4); // count

  let offset = 6 + (16 * pngBuffers.length);
  const entries = [];

  for (let i = 0; i < pngBuffers.length; i++) {
    const size = sizes[i];
    const buf = pngBuffers[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(buf.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    offset += buf.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function generateAll() {
  const svgBuf = Buffer.from(svgContent);

  // 1. Write public/favicon.svg
  fs.writeFileSync('public/favicon.svg', svgContent, 'utf8');
  console.log('Updated public/favicon.svg');

  // 2. Generate PNGs
  const p16 = await sharp(svgBuf).resize(16, 16).png().toBuffer();
  fs.writeFileSync('public/favicon-16x16.png', p16);

  const p32 = await sharp(svgBuf).resize(32, 32).png().toBuffer();
  fs.writeFileSync('public/favicon-32x32.png', p32);

  const p48 = await sharp(svgBuf).resize(48, 48).png().toBuffer();
  fs.writeFileSync('public/favicon-48x48.png', p48);

  const p180 = await sharp(svgBuf).resize(180, 180).png().toBuffer();
  fs.writeFileSync('public/apple-touch-icon.png', p180);

  const p192 = await sharp(svgBuf).resize(192, 192).png().toBuffer();
  fs.writeFileSync('public/icon-192.png', p192);

  const p512 = await sharp(svgBuf).resize(512, 512).png().toBuffer();
  fs.writeFileSync('public/icon-512.png', p512);

  console.log('Generated PNG favicons: 16, 32, 48, 180, 192, 512');

  // 3. Generate multi-resolution ICO file
  const icoBuf = createIco([p16, p32, p48], [16, 32, 48]);
  fs.writeFileSync('public/favicon.ico', icoBuf);
  fs.writeFileSync('app/favicon.ico', icoBuf);
  console.log('Updated public/favicon.ico and app/favicon.ico, size:', icoBuf.length);
}

generateAll().catch(console.error);
