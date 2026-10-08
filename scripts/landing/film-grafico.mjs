// Records the film of the function plotter for its tile on the landing page: a point goes once round the unit
// circle, its height feeds the graph of the sine, which flows to the right, and its abscissa the graph of the cosine,
// which flows upward. One turn, and the curves are a period long and more: the last frame joins the first. It writes
// grafico.webm (VP9), grafico.mp4 (H.264) and grafico.webp (the frame shown before it plays) in public/landing/film.
//
//   node scripts/landing/film-grafico.mjs             the whole film
//   node scripts/landing/film-grafico.mjs 0 48 96     only these frames, as .png, to look at them: nothing is encoded
//
// Needs the dev server on localhost:3000 (or SAPIENS_URL), ffmpeg and cwebp. The frames go in a folder of the system's
// temporary ones, or in FILM_TMP, where they are kept. Record again when the look of the plane changes. The film is a
// run of screenshots of the plane, one for each value of the parameter a, set on its slider: the same on every machine.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createJiti } from 'jiti';
import { chromium } from 'playwright';

// the film starts from a graph given to the page as a link: the same code "Condividi" writes after the #
const { encodeState, stateOf, DEFAULT_SETTINGS, DEFAULT_SLIDER, PALETTE } = await createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } }).import('../../src/lib/grafico/documento.ts');

const BASE = process.env.SAPIENS_URL ?? 'http://localhost:3000';
const OUT = new URL('../../public/landing/film/', import.meta.url).pathname;
const FPS = 24;
/** One turn in eight seconds. The last frame is one step before the turn closes: the first one follows it. */
const FRAMES = 192;
const FILM = { width: 800, height: 600 };
/** The frame shown before the film plays: the point at 56°, off both axes. */
const POSTER = 30;
/** Where the newest value of each curve is drawn: the abscissa for the sine, the ordinate for the cosine. Just off the circle. */
const EDGE = '\\frac{7}{5}';
/** How far back each curve shows the values: the sine to the right, the cosine upward. */
const LENGTH = { sin: 5, cos: 3 };
/** The part of the plane that is filmed, in units: with the film's shape it holds the circle and the two curves. */
const WINDOW = { x0: -1.5, x1: 6.6, y0: -1.5 };
/** The step of the slider of a: a tenth of a pixel of the film. */
const STEP = 0.001;

const [BLUE, RED, , , , , , BLACK] = PALETTE;
const SIN = RED;
const COS = BLUE;
/** A segment from (x0; y0) to (x1; y1), as a curve of t from 0 to 1: its ends can follow a. */
const segment = (x0, y0, x1, y1) => `\\left(\\left(1-t\\right)\\left(${x0}\\right)+t\\left(${x1}\\right);\\left(1-t\\right)\\left(${y0}\\right)+t\\left(${y1}\\right)\\right)`;
const sin = '\\sin\\left(a\\right)';
const cos = '\\cos\\left(a\\right)';
const row = (latex, color, more = {}) => ({ latex, color, width: 'normal', dash: 'solid', label: false, hidden: false, ...more });
const piece = { t0: 0, t1: 1 };

const ROWS = [
	row('x^2+y^2=1', BLACK),
	// the radius, then the two projections of the point: its height is the sine, its abscissa the cosine
	row(segment('0', '0', cos, sin), BLACK, piece),
	row(segment(cos, '0', cos, sin), SIN, { ...piece, width: 'thick' }),
	row(segment('0', '0', cos, '0'), COS, { ...piece, width: 'thick' }),
	// the height of the point, carried to where the sine starts, and its abscissa, carried to where the cosine does
	row(segment(cos, sin, EDGE, sin), SIN, { ...piece, width: 'thin', dash: 'dashed' }),
	row(segment(cos, sin, cos, EDGE), COS, { ...piece, width: 'thin', dash: 'dashed' }),
	// t is how long ago the point was there: the value of now is at the edge, the older ones further away
	row(`\\left(${EDGE}+t;\\sin\\left(a-t\\right)\\right)`, SIN, { t0: 0, t1: LENGTH.sin, width: 'thick' }),
	row(`\\left(\\cos\\left(a-t\\right);${EDGE}+t\\right)`, COS, { t0: 0, t1: LENGTH.cos, width: 'thick' }),
	row(`\\left(${cos};${sin}\\right)`, BLACK),
	row(`\\left(${EDGE};${sin}\\right)`, SIN),
	row(`\\left(${cos};${EDGE}\\right)`, COS)
].map((r, id) => ({ id, ...r }));

const span = WINDOW.x1 - WINDOW.x0;
const STATE = {
	...stateOf([], {
		sliders: { a: { ...DEFAULT_SLIDER, value: 0, min: 0, max: 6.284, step: STEP } },
		// no numbers on the axes: along the two curves they would count the time gone by, not x and y
		settings: { ...DEFAULT_SETTINGS, numbers: false },
		camera: { cx: (WINDOW.x0 + WINDOW.x1) / 2, cy: WINDOW.y0 + (span * FILM.height) / FILM.width / 2, span, stretch: 1 }
	}),
	rows: ROWS
};

const only = process.argv.slice(2).map(Number);
const dir = process.env.FILM_TMP ?? mkdtempSync(join(tmpdir(), 'sapiens-film-'));
mkdirSync(dir, { recursive: true });
const frame = (k) => join(dir, `${String(k).padStart(4, '0')}.png`);

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1600, height: 1300 }, deviceScaleFactor: 2, colorScheme: 'light', reducedMotion: 'reduce' })).newPage();
await page.goto(`${BASE}/strumenti/grafico-di-funzione#g=${encodeState(STATE)}`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Rifiuta' }).click().catch(() => {});
await page.waitForTimeout(1500);

// The window of the link is as wide as the whole drawing: the film takes the middle of it, a pixel of the page for
// a pixel of the film and clear of the bars at the two sides, so the link asks for a window wider by as much as the
// drawing is wider than the film.
const plane = page.locator('svg.plane-drawing');
const whole = await plane.boundingBox();
const { width, height } = FILM;
if (whole.width < width + 100 || whole.height < height) throw new Error(`the plane is ${whole.width} by ${whole.height}: too small for the film`);
{
	await page.goto('about:blank');
	await page.goto(`${BASE}/strumenti/grafico-di-funzione#g=${encodeState({ ...STATE, camera: { ...STATE.camera, span: (span * whole.width) / width } })}`, { waitUntil: 'networkidle' });
	await page.waitForTimeout(1500);
}
const box = await plane.boundingBox();
const clip = { x: box.x + (box.width - width) / 2, y: box.y + (box.height - height) / 2, width, height };

// a is set on its slider, as a student would drag it: React hears the change of the field
const slider = page.locator('.plot-slider input[type="range"]');
if ((await slider.count()) !== 1) throw new Error('the slider of a is not on the page');
const setA = (a) =>
	slider.evaluate((input, value) => {
		Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, String(value));
		input.dispatchEvent(new Event('input', { bubbles: true }));
		return new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(done, 30))));
	}, a);

for (const k of only.length ? only : Array.from({ length: FRAMES }, (_, k) => k)) {
	await setA(Math.round((2 * Math.PI * k) / FRAMES / STEP) * STEP);
	// the pointer stays away from the plane, which would mark the point of a curve under it
	await page.screenshot({ clip, path: frame(k) });
}
await browser.close();

if (only.length) {
	console.log(`frames ${only.join(', ')} in ${dir}`);
	process.exit(0);
}

mkdirSync(OUT, { recursive: true });
const input = ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(dir, '%04d.png')];
const scale = ['-vf', `scale=${FILM.width}:${FILM.height}:flags=lanczos`, '-an'];
const out = (ext) => join(OUT, `grafico.${ext}`);
execFileSync('ffmpeg', [...input, ...scale, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-preset', 'veryslow', '-movflags', '+faststart', out('mp4')]);
execFileSync('ffmpeg', [...input, ...scale, '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuv420p', '-crf', '34', '-b:v', '0', '-row-mt', '1', out('webm')]);
execFileSync('cwebp', ['-quiet', '-q', '82', '-resize', String(FILM.width), String(FILM.height), frame(POSTER), '-o', out('webp')]);
if (!process.env.FILM_TMP) rmSync(dir, { recursive: true, force: true });
const kb = (ext) => `${Math.round(statSync(out(ext)).size / 1024)} kB`;
console.log(`grafico: ${(FRAMES / FPS).toFixed(1)} s, webm ${kb('webm')}, mp4 ${kb('mp4')}, webp ${kb('webp')}`);
