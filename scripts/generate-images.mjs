#!/usr/bin/env node
/**
 * Regenerates the favicon set, PWA icons and the Open Graph image from the
 * brand assets in public/sapiens. Run with `node scripts/generate-images.mjs`
 * after changing the logo.
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const brand = '#ff3666';
const out = (name) => join(root, 'public', name);

// favicon.svg: the traced brain icon, recolored and lightly minified
const svg = readFileSync(join(root, 'public/sapiens/icon.svg'), 'utf8')
	.replace(/fill="#000000"/g, `fill="${brand}"`)
	.replace(/<\?xml[^>]*>\s*/, '')
	.replace(/<!DOCTYPE[^>]*>\s*/, '')
	.replace(/(\d+\.\d{2})\d+/g, '$1');
writeFileSync(out('favicon.svg'), svg);

const icon = join(root, 'public/sapiens/icon.png');
await sharp(icon).resize(32, 32).png({ compressionLevel: 9 }).toFile(out('favicon-32.png'));
await sharp(icon).resize(192, 192).png({ compressionLevel: 9 }).toFile(out('icon-192.png'));
await sharp(icon).resize(512, 512).png({ compressionLevel: 9 }).toFile(out('icon-512.png'));

// apple-touch-icon: opaque white background with padding (iOS ignores transparency)
const inner = await sharp(icon).resize(148, 148).png().toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#ffffff' } })
	.composite([{ input: inner, gravity: 'centre' }])
	.png({ compressionLevel: 9 })
	.toFile(out('apple-touch-icon.png'));

// og-image.jpg 1200x630: wordmark on white with the tagline
const logo = await sharp(join(root, 'public/sapiens/logo.png')).resize({ width: 720 }).png().toBuffer();
const logoMeta = await sharp(logo).metadata();
const tagline = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <style>text{font-family:'Inter','Helvetica Neue',Helvetica,Arial,sans-serif;}</style>
  <text x="600" y="430" text-anchor="middle" font-size="40" fill="#18181b" font-weight="600">Materiale didattico per medie, superiori e università</text>
  <text x="600" y="490" text-anchor="middle" font-size="28" fill="#52525b">Teoria, formulari ed esercizi svolti</text>
</svg>`);
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#ffffff' } })
	.composite([
		{ input: logo, left: Math.round((1200 - logoMeta.width) / 2), top: 130 },
		{ input: tagline, left: 0, top: 0 }
	])
	.jpeg({ quality: 82, mozjpeg: true })
	.toFile(out('og-image.jpg'));

for (const f of ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'og-image.jpg']) {
	console.log(f.padEnd(22), statSync(out(f)).size, 'bytes');
}
