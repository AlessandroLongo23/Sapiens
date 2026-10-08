// Records the film of the atomic orbitals tool for its tile on the landing page: the cloud of a 3d orbital with
// m = 1, seen from a camera that stands still while the points flow around the axis, as the tool moves them. Writes
// orbitali.webm (VP9), orbitali.mp4 (H.264) and orbitali.webp (the first frame, to show before the film plays) in
// public/landing/film.
//
//   node scripts/landing/film-orbitali.mjs
//   SAPIENS_URL=http://localhost:3001 node scripts/landing/film-orbitali.mjs      the dev server on another port
//   SAPIENS_FRAMES=/some/folder node scripts/landing/film-orbitali.mjs            keeps the screenshots there
//
// Needs the dev server on localhost:3000 (or SAPIENS_URL), ffmpeg and cwebp. Record again when the look of the
// viewer changes. The film is a run of screenshots of the figure only. The clock of the page is Playwright's, moved
// by hand one film frame at a time, so the result is the same on every machine. The points near the axis turn
// faster than the ones far from it, so the cloud never comes back to where it started: the film is a third of a
// second longer than it plays, and that third is faded over the start to close the loop.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, renameSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const BASE = process.env.SAPIENS_URL ?? 'http://localhost:3000';
const OUT = new URL('../../public/landing/film/', import.meta.url).pathname;
const FILM = { width: 800, height: 600 };
const FPS = 24;
const SECONDS = 8;
const FRAMES = FPS * SECONDS;
/** The frames after the last that are faded over the first ones: a third of a second, because halfway through a longer fade the cloud is two clouds and looks out of focus. */
const FADE = FPS / 3;
/** 3d with m = 1: a ring of each sign, one over the other, both flowing the same way. */
const ORBITAL = 'n=3&l=2&m=1&tipo=complesso';

const keep = process.env.SAPIENS_FRAMES;
const dir = keep ?? mkdtempSync(join(tmpdir(), 'sapiens-orbitali-'));
mkdirSync(dir, { recursive: true });
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 2, colorScheme: 'light' })).newPage();
const T0 = new Date('2026-01-01T12:00:00Z');
await page.clock.install({ time: T0 });
await page.goto(`${BASE}/strumenti/orbitali-atomici?${ORBITAL}`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Rifiuta' }).click().catch(() => {});

// the figure: the box three.js draws in, with the name of the orbital, its numbers and the scale bar over it
const figure = page.locator('[role="img"][aria-label*="come nuvola di punti"]');
await figure.locator('canvas').waitFor();
await figure.scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);
// the button that stops the motion is of no use in a film
await page.getByRole('button', { name: 'Ferma il moto' }).evaluate((button) => (button.style.visibility = 'hidden'));
const box = await figure.boundingBox();
const clip = { x: box.x, y: box.y, width: box.width, height: box.height };
const name = (k) => join(dir, `${String(k).padStart(4, '0')}.png`);

// from here the clock moves only when it is told to
await page.clock.pauseAt(new Date(T0.getTime() + 3_600_000));
for (let k = 0; k < FRAMES + FADE; k++) {
	if (k) await page.clock.runFor(1000 / FPS);
	await page.screenshot({ clip, path: name(k) });
}
await browser.close();

// a canvas that is not blank, and a cloud that moved
const pixels = (file) => execFileSync('ffmpeg', ['-loglevel', 'error', '-i', file, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 1 << 28 });
const [first, later] = [pixels(name(0)), pixels(name(FPS))];
let differing = 0;
let inked = 0;
for (let i = 0; i < first.length; i += 3) {
	if (Math.abs(first[i] - later[i]) + Math.abs(first[i + 1] - later[i + 1]) + Math.abs(first[i + 2] - later[i + 2]) > 48) differing++;
	// a point of the cloud is blue or orange: far from the grey of the paper
	if (Math.abs(first[i] - first[i + 2]) > 60) inked++;
}
differing /= first.length / 3;
inked /= first.length / 3;
if (inked < 0.02) throw new Error(`the cloud is not in the picture (${(inked * 100).toFixed(2)}% of it is coloured): WebGL may be off in this browser`);
if (differing < 0.01) throw new Error(`the points do not flow: only ${(differing * 100).toFixed(2)}% of the picture changes in a second`);

// the loop: frame k of the first second is the one a whole film later, fading into itself
for (let k = 0; k < FADE; k++) {
	const mixed = join(dir, 'mixed.png');
	execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', name(FRAMES + k), '-i', name(k), '-filter_complex', `[0][1]blend=all_mode=normal:all_opacity=${(1 - k / FADE).toFixed(4)}`, mixed]);
	renameSync(mixed, name(k));
}

const input = ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(dir, '%04d.png'), '-frames:v', String(FRAMES)];
const scale = ['-vf', `scale=${FILM.width}:${FILM.height}:flags=lanczos`, '-an'];
const out = (ext) => join(OUT, `orbitali.${ext}`);
// The cloud is thousands of small balls that all move, the hardest thing to ask of a codec: at 560 kb/s (600 kB
// a file) the balls melt into a stain and the squares of the paper go. 1500 kb/s, about 1.5 MB a file, is the lowest
// rate at which they stay balls. Two passes, to land on that size.
const RATE = '1500k';
const passlog = join(dir, 'pass');
for (const pass of ['1', '2']) {
	execFileSync('ffmpeg', [...input, ...scale, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'veryslow', '-b:v', RATE, '-pass', pass, '-passlogfile', `${passlog}-264`, '-movflags', '+faststart', ...(pass === '1' ? ['-f', 'mp4', '/dev/null'] : [out('mp4')])]);
	execFileSync('ffmpeg', [...input, ...scale, '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuv420p', '-b:v', RATE, '-row-mt', '1', '-pass', pass, '-passlogfile', `${passlog}-vp9`, ...(pass === '1' ? ['-f', 'webm', '/dev/null'] : [out('webm')])]);
}
execFileSync('cwebp', ['-quiet', '-q', '82', '-resize', String(FILM.width), String(FILM.height), name(0), '-o', out('webp')]);
if (!keep) rmSync(dir, { recursive: true, force: true });

const kb = (ext) => `${Math.round(statSync(out(ext)).size / 1024)} kB`;
console.log(`orbitali: ${SECONDS} s, ${FRAMES} frames, ${(differing * 100).toFixed(1)}% of the picture changes in a second, webm ${kb('webm')}, mp4 ${kb('mp4')}, webp ${kb('webp')}`);
