// Records the short silent film of the physics sandbox for its tile on the landing page: a pendulum swinging, with
// the arrows of weight, tension and velocity and the trace of its path, as public/landing/film/sandbox.webm (VP9),
// sandbox.mp4 (H.264) and sandbox.webp to show before it plays. The film is two whole swings, so it loops.
//
//   node scripts/landing/film-sandbox.mjs
//
// Needs the dev server on localhost:3000 (or SAPIENS_URL), ffmpeg and cwebp. Record again when the look of the
// sandbox changes. FILM_TMP names the folder of the frames, which is then kept; otherwise they go to a temporary
// folder that is removed.
//
// The pendulum is not among the examples of the editor: the scene is given to the page as a link, the same code
// "Condividi" writes after #s=. The clock of the page is Playwright's: the scene is started with the editor's own
// "Avvia", then the clock is moved by hand, so the film is the same on every machine. The page moves the scene once
// for each frame the browser draws, 16 ms of the clock at a time, and at the speed "×¼" that is 4 ms of the scene:
// ten of them, 40 ms, go into each frame of the film, which at 24 frames a second runs at 0.96 of real time. The
// first swing is not filmed (the trace is still being drawn); of what follows, the film goes from one instant in
// which the mass is still on the right to the second one after it. The length of the string is chosen so that two
// swings last a whole number of frames: the script prints how far from it they are.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createJiti } from 'jiti';
import { chromium } from 'playwright';

const { encode } = await createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } }).import('../../src/lib/sandbox/edit.ts');

const BASE = process.env.SAPIENS_URL ?? 'http://localhost:3000';
const OUT = new URL('../../public/landing/film/', import.meta.url).pathname;
const FPS = 24;
const FILM = { width: 800, height: 600 };
/** How many swings the film holds. */
const SWINGS = 2;

/** The pendulum, in metres and kilograms: where it hangs from, how long the string is, the angle it is let go from. */
const PIVOT = { x: 0.8, y: 3.2 };
// 1.9915 m: one swing from 35° lasts 2.900 s of the scene, 72.5 frames (with 2 m it is 2.906 s, a third of a frame too many in two swings)
const LENGTH = Number(process.env.FILM_LENGTH ?? 1.9915);
/** Seconds of the scene in a frame of the film: ten steps of the page at a quarter of the speed. */
const STEPS = 10;
const FRAME = (STEPS * 0.016) / 4;
const ANGLE = 35;
const rad = (ANGLE * Math.PI) / 180;
const SCENE = {
	g: 9.8,
	bodies: [{ id: 'm1', name: 'm', m: 3, r: 0.14, shape: 'ball', pos: { x: PIVOT.x + LENGTH * Math.sin(rad), y: PIVOT.y - LENGTH * Math.cos(rad) } }],
	surfaces: [{ id: 's1', kind: 'ceiling', a: { x: 3.2, y: PIVOT.y }, b: { x: -1.6, y: PIVOT.y }, muS: 0, muK: 0, endless: true }],
	pulleys: [],
	ropes: [{ id: 'filo1', from: { point: PIVOT }, to: { body: 'm1' } }]
};
/** The window of the editor, metres (VIEW in src/lib/sandbox/edit.ts), and the part of it that is filmed, 4:3. */
const VIEW = { x0: -2.8, x1: 4.4, y0: -0.4, y1: 3.6 };
const SHOT = { x0: PIVOT.x - 2, x1: PIVOT.x + 2, y0: 0.42, y1: 3.42 };

const page = await (await (await chromium.launch()).newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2, colorScheme: 'light' })).newPage();
const browser = page.context().browser();
const T0 = new Date('2026-01-01T10:00:00');
await page.clock.install({ time: T0 });
await page.goto(`${BASE}/strumenti/sandbox-di-fisica#s=${encode(SCENE)}`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Rifiuta' }).click({ timeout: 3000 }).catch(() => {});
const ball = page.locator('[data-sandbox-editor] circle[aria-label^="Sfera"]');
await ball.waitFor();
// the mass is chosen, so that it changes colour and leaves the trace of its path
await ball.click();
await page.waitForTimeout(800);
// nothing of the page may cover the scene
await page.addStyleTag({ content: 'nextjs-portal, [data-nextjs-toast] { display: none !important }' });

const svg = await ball.locator('xpath=ancestor::*[local-name()="svg"][1]').boundingBox();
const unit = svg.width / (VIEW.x1 - VIEW.x0);
const at = (x, y) => ({ x: svg.x + (x - VIEW.x0) * unit, y: svg.y + (VIEW.y1 - y) * unit });
const corner = at(SHOT.x0, SHOT.y1);
const clip = { x: Math.round(corner.x), y: Math.round(corner.y), width: Math.round((SHOT.x1 - SHOT.x0) * unit), height: Math.round((SHOT.y1 - SHOT.y0) * unit) };
/** Where the mass is, across the page: the film is cut where it comes back to the same side. */
const where = async () => {
	const b = await ball.boundingBox();
	return b.x + b.width / 2;
};
const drawn = at(SCENE.bodies[0].pos.x, 0).x;
if (Math.abs((await where()) - drawn) > 2) throw new Error(`the scene is not where it was expected: the mass is at ${await where()} px, not at ${drawn}`);

// from here the clock moves only when it is told to
await page.clock.pauseAt(new Date(T0.getTime() + 3_600_000));
// the speed button goes ×1, ×½, ×¼, ×⅛: two clicks for a quarter
for (let i = 0; i < 2; i++) await page.getByRole('button', { name: /Velocità del tempo/ }).click();
await page.getByRole('button', { name: 'Avvia', exact: true }).click();
const period = 2 * Math.PI * Math.sqrt(LENGTH / SCENE.g) * (1 + rad ** 2 / 16 + (11 * rad ** 4) / 3072);
// one step of the page at a time: it reads the scene it has drawn, so it has to draw it before the next
const tick = async () => {
	for (let n = 0; n < STEPS; n++) {
		await page.clock.runFor(16);
		// its timers are stopped: a message is what still passes
		await page.evaluate(async () => {
			for (let m = 0; m < 2; m++) await new Promise((done) => { const c = new MessageChannel(); c.port1.onmessage = done; c.port2.postMessage(0); });
		});
	}
};
const lead = Math.round((period / FRAME) * 0.9);
for (let k = 0; k < lead; k++) await tick();

const dir = process.env.FILM_TMP ?? mkdtempSync(join(tmpdir(), 'sapiens-film-'));
mkdirSync(dir, { recursive: true });
const name = (k) => join(dir, `${String(k).padStart(4, '0')}.png`);
const total = Math.round((period / FRAME) * (SWINGS + 1.3));
const xs = [];
for (let k = 0; k < total; k++) {
	await tick();
	xs.push(await where());
	await page.screenshot({ clip, path: name(k) });
}
await browser.close();

// the instants in which the mass is still on the right, to a fraction of a frame (the top of a parabola through three)
const tops = [];
for (let k = 1; k < xs.length - 1; k++)
	if (xs[k] > xs[k - 1] && xs[k] >= xs[k + 1] && xs[k] > drawn - 0.05 * LENGTH * unit) tops.push(k + (xs[k - 1] - xs[k + 1]) / (2 * (xs[k - 1] - 2 * xs[k] + xs[k + 1])));
if (tops.length < SWINGS + 1) throw new Error(`only ${tops.length} swings were seen`);
const start = Math.round(tops[0]);
const swing = (tops[tops.length - 1] - tops[0]) / (tops.length - 1);
const frames = Math.round(SWINGS * swing);
console.log(`one swing lasts ${swing.toFixed(3)} frames (${(swing * FRAME).toFixed(4)} s of the scene): the film is ${frames} frames, ${(SWINGS * swing - frames).toFixed(3)} frames away from ${SWINGS} whole swings`);
console.log(`the mass at the first frame, at the last, and at the one that would follow: ${xs[start].toFixed(2)}, ${xs[start + frames - 1].toFixed(2)}, ${xs[start + frames].toFixed(2)} px`);

mkdirSync(OUT, { recursive: true });
const input = ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-start_number', String(start), '-i', join(dir, '%04d.png'), '-frames:v', String(frames)];
const scale = ['-vf', `scale=${FILM.width}:${FILM.height}:flags=lanczos`, '-an'];
const out = (ext) => join(OUT, `sandbox.${ext}`);
execFileSync('ffmpeg', [...input, ...scale, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-preset', 'veryslow', '-movflags', '+faststart', out('mp4')]);
execFileSync('ffmpeg', [...input, ...scale, '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuv420p', '-crf', '36', '-b:v', '0', '-row-mt', '1', out('webm')]);
// the picture shown before the film plays: a tenth of a swing in, the mass well off the vertical and already moving
const poster = join(dir, 'poster.png');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', name(start + Math.round(swing / 10)), '-vf', `scale=${FILM.width}:${FILM.height}:flags=lanczos`, poster]);
execFileSync('cwebp', ['-quiet', '-q', '82', poster, '-o', out('webp')]);
if (!process.env.FILM_TMP) rmSync(dir, { recursive: true, force: true });
const kb = (ext) => `${Math.round(statSync(out(ext)).size / 1024)} kB`;
console.log(`sandbox: ${(frames / FPS).toFixed(2)} s, webm ${kb('webm')}, mp4 ${kb('mp4')}, webp ${kb('webp')}${process.env.FILM_TMP ? `; frames ${start} to ${start + frames - 1} of ${dir}` : ''}`);
