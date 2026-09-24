#!/usr/bin/env node
/**
 * Regenerates the launcher icons of the Capacitor apps from the brain icon in
 * public/sapiens, on the paper colour of the notebook look. Run with
 * `node scripts/generate-app-icons.mjs` after changing the logo, then rebuild
 * the apps.
 *
 * Android (API 26+) draws an adaptive icon: a 108dp foreground over a flat
 * background colour, cropped by the launcher to a circle, squircle or square
 * that keeps only the central 66dp. The brain stays inside that safe zone.
 * Older Android and the round slot get ready-made PNGs. iOS takes one opaque
 * 1024px image and rounds the corners itself.
 */
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const icon = join(root, 'public/sapiens/icon.png');
const paper = '#f8f5ef';
const res = join(root, 'android/app/src/main/res');

/** The brain at `scale` of a `size` square, centred on `background` (transparent if omitted). */
async function tile(size, scale, background, round = false) {
	const inner = await sharp(icon).resize(Math.round(size * scale), Math.round(size * scale)).png().toBuffer();
	const image = sharp({ create: { width: size, height: size, channels: 4, background: background ?? { r: 0, g: 0, b: 0, alpha: 0 } } }).composite([
		{ input: inner, gravity: 'centre' },
		...(round ? [{ input: Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`), blend: 'dest-in' }] : [])
	]);
	return image.png({ compressionLevel: 9 });
}

// Launcher size in px per density: 48dp legacy icon, 108dp adaptive foreground.
const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
for (const [name, k] of Object.entries(densities)) {
	const dir = join(res, `mipmap-${name}`);
	await (await tile(108 * k, 0.6)).toFile(join(dir, 'ic_launcher_foreground.png'));
	await (await tile(48 * k, 0.72, paper)).toFile(join(dir, 'ic_launcher.png'));
	await (await tile(48 * k, 0.66, paper, true)).toFile(join(dir, 'ic_launcher_round.png'));
}
writeFileSync(
	join(res, 'values/ic_launcher_background.xml'),
	`<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${paper.toUpperCase()}</color>\n</resources>\n`
);

// iOS: opaque, no alpha channel (App Store Connect rejects transparency).
await (await tile(1024, 0.72, paper)).flatten({ background: paper }).removeAlpha().toFile(join(root, 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png'));

console.log('Icone di Android e iOS rigenerate.');
