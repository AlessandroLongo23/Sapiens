// Records the short films of the geometry tools of the plotter, shown in the card of each tool and, later, in the
// article of the page: one clip per tool, as .webm (VP9), .mp4 (H.264) and a .jpg to show before it plays, in
// public/grafico/geometria. The names of the files say what the film shows, for the search engines.
//
//   node scripts/grafico/record-tools.mjs            every tool
//   node scripts/grafico/record-tools.mjs segmento angolo   only the clips whose name contains one of the words
//
// Needs the dev server on localhost:3000 (or SAPIENS_URL) and ffmpeg. Record again when the look of the plane
// changes. The film is a run of screenshots of the plane, with a drawn pointer: the same on every machine.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createJiti } from 'jiti';
import { chromium } from 'playwright';

// a film starts from a graph given to the page as a link: the same code "Condividi" writes after the #
const { encodeState, stateOf } = await createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } }).import('../../src/lib/grafico/documento.ts');

const BASE = process.env.SAPIENS_URL ?? 'http://localhost:3000';
const OUT = new URL('../../public/grafico/geometria/', import.meta.url).pathname;
const FPS = 20;
/** The part of the plane that is filmed, in CSS pixels, and the size of the film. */
const VIEW = { width: 480, height: 300 };
const FILM = { width: 640, height: 400 };

const LINE = 'y=\\frac{x}{2}-1';
const TRIANGLE = [
	[-3, -1.5],
	[3, -1.5],
	[0, 2]
];
/** Two segments from one point: the sides of an angle. */
const ANGLE_SIDES = [
	['tool', 'Segmento'],
	['click', -3, -1.5],
	['click', 3, -1.5],
	['click', -3, -1.5],
	['click', 1, 2]
];
/** A cloud of points, for the line that passes nearest to all of them. */
const CLOUD = [
	[-3, -1.5],
	[-1.5, -0.25],
	[0, -0.5],
	[1.5, 1],
	[3, 1]
];
/** A polygon drawn before the film starts: something to transform. */
const shape = (...points) => [['tool', 'Poligono'], ...points.map(([x, y]) => ['click', x, y]), ['click', ...points[0]]];
/**
 * A scene: the formulas on the plane, what is done before the film starts (`before`), the tool, and what is filmed.
  * Steps: ['click', x, y], ['drag', x, y] (from where the pointer is), ['tool', name], ['wait', frames], ['type', text]
 * for a number the tool asks for, ['choose', name] for one of the choices it offers.
 */
const SCENES = [
	{ clip: 'muovi-un-punto', before: [['tool', 'Retta per due punti'], ['click', -2, -1], ['click', 2, 1]], tool: 'Muovi', steps: [['move', -2, -1], ['drag', -2.5, 1.5], ['drag', -1, -2], ['drag', -2, -1]] },
	{ clip: 'punto', formulas: ['y=\\frac{x}{2}'], tool: 'Punto', steps: [['click', -2, 1.5], ['click', 2, 1]] },
	{ clip: 'intersezione', formulas: ['y=\\frac{x}{2}', 'x^2+y^2=4'], tool: 'Intersezione', steps: [['click', -3.5, -1.75], ['click', 0, 2]] },
	{ clip: 'punto-medio', before: [['tool', 'Punto'], ['click', -3, -1], ['click', 3, 1.5]], tool: 'Punto medio', steps: [['click', -3, -1], ['click', 3, 1.5]] },
	{ clip: 'retta-per-due-punti', tool: 'Retta per due punti', steps: [['click', -2.5, -1], ['click', 2, 1.5]] },
	{ clip: 'segmento', tool: 'Segmento', steps: [['click', -2.5, -1], ['click', 2, 1.5]] },
	{ clip: 'retta-parallela', formulas: [LINE], tool: 'Parallela', steps: [['click', -2, -2], ['click', 0, 1.5]] },
	{ clip: 'retta-perpendicolare', formulas: [LINE], tool: 'Perpendicolare', steps: [['click', -2, -2], ['click', -1, 1.5]] },
	{ clip: 'asse-del-segmento', before: [['tool', 'Segmento'], ['click', -2.5, -1], ['click', 2.5, 0.5]], tool: 'Asse del segmento', steps: [['click', -2.5, -1], ['click', 2.5, 0.5]] },
	{ clip: 'circonferenza-centro-e-punto', tool: 'Circonferenza: centro e punto', steps: [['click', 0, 0], ['click', 2, 1]] },
	{ clip: 'circonferenza-per-tre-punti', tool: 'Circonferenza per tre punti', steps: [['click', -2, -1], ['click', 2, -1], ['click', 0.5, 2]] },
	{ clip: 'distanza-punto-retta', formulas: [LINE], tool: 'Distanza', steps: [['click', -1, 2], ['click', 2, 0]] },
	{ clip: 'punti-notevoli-del-triangolo', before: [['tool', 'Poligono'], ...TRIANGLE.map(([x, y]) => ['click', x, y]), ['click', ...TRIANGLE[0]]], tool: 'Punti notevoli del triangolo', steps: [['click', 0, -1.5], ['choose', 'Baricentro'], ['click', 0, -1.5], ['choose', 'Circocentro']] },
	{ clip: 'semiretta', tool: 'Semiretta', steps: [['click', -3, -1.5], ['click', 0, 0]] },
	{ clip: 'vettore', tool: 'Vettore', steps: [['click', -2.5, -1], ['click', 2, 1]] },
	{ clip: 'bisettrice', before: ANGLE_SIDES, tool: 'Bisettrice', steps: [['click', 3, -1.5], ['click', -3, -1.5], ['click', 1, 2]] },
	{ clip: 'retta-tangente', formulas: ['x^2+y^2=4'], tool: 'Tangenti', steps: [['click', 0, 2], ['click', 3.5, 1]] },
	{ clip: 'circonferenza-centro-e-raggio', tool: 'Circonferenza: centro e raggio', steps: [['click', 0, 0], ['type', '2']] },
	{ clip: 'compasso', before: [['tool', 'Segmento'], ['click', -3.5, -2], ['click', -1.5, -2]], tool: 'Compasso', steps: [['click', -2.5, -2], ['click', 1.5, 0.25]] },
	{ clip: 'poligono', tool: 'Poligono', steps: [['click', -3, -1.5], ['click', 2.5, -2], ['click', 3, 1], ['click', -1, 2], ['click', -3, -1.5]] },
	{ clip: 'angolo', before: ANGLE_SIDES, tool: 'Angolo', steps: [['click', 3, -1.5], ['click', -3, -1.5], ['click', 1, 2]] },
	{ clip: 'pendenza', formulas: [LINE], tool: 'Pendenza', steps: [['click', -2, -2]] },
	{ clip: 'retta-di-regressione', before: [['tool', 'Punto'], ...CLOUD.map(([x, y]) => ['click', x, y])], tool: 'Retta di regressione', steps: [...CLOUD.map(([x, y]) => ['click', x, y]), ['click', ...CLOUD[0]]] },
	{ clip: 'simmetria-assiale', formulas: ['y=2x+1'], before: shape([-3, 0.5], [-1.5, 0.5], [-2.5, 2]), tool: 'Simmetria', steps: [['click', -2.25, 0.5], ['click', -1, -1]] },
	{ clip: 'traslazione', before: shape([-3, 0.5], [-1.5, 0.5], [-2.5, 2]), tool: 'Traslazione', steps: [['click', -2.25, 0.5], ['click', -3.5, -0.5], ['click', 0, -2]] },
	{ clip: 'rotazione', before: shape([0.5, -2], [2, -2], [1.5, -1]), tool: 'Rotazione', steps: [['click', 1.25, -2], ['click', 0, 0], ['type', '90']] },
	{ clip: 'omotetia', before: shape([-2.5, -1.5], [-1, -1.5], [-2, -0.5]), tool: 'Omotetia', steps: [['click', -1.75, -1.5], ['click', -3.5, -2], ['type', '2']] }
];

/** The pointer drawn on the page, which a screenshot would not show, and the ring of a click. */
const POINTER = `
	const tip = document.createElement('div');
	tip.id = 'rec-pointer';
	tip.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 3l14 8-6.5 1.5L10 19z" fill="#111" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>';
	tip.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;margin:-3px 0 0 -5px';
	const ring = document.createElement('div');
	ring.id = 'rec-ring';
	ring.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483646;pointer-events:none;border:2px solid #e11d48;border-radius:50%;display:none';
	document.body.append(ring, tip);
	document.addEventListener('mousemove', (e) => { tip.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'; }, true);
	window.recRing = (x, y, r) => { ring.style.display = r ? 'block' : 'none'; ring.style.width = ring.style.height = 2 * r + 'px'; ring.style.transform = 'translate(' + (x - r) + 'px,' + (y - r) + 'px)'; };
`;

const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

async function film(browser, scene) {
	// tall enough for the whole plane: a field that asks for a number under it would scroll the page to be seen
	const page = await (await browser.newContext({ viewport: { width: 1200, height: 1200 }, deviceScaleFactor: 2, colorScheme: 'light', reducedMotion: 'reduce' })).newPage();
	await page.goto(`${BASE}/strumenti/grafico-di-funzione#g=${encodeState(stateOf(scene.formulas ?? [' ']))}`, { waitUntil: 'networkidle' });
	await page.getByRole('button', { name: 'Rifiuta' }).click().catch(() => {});
	await page.getByRole('button', { name: 'Chiudi l’elenco delle funzioni' }).click();
	await page.waitForTimeout(700);
	await page.evaluate(POINTER);

	const box = await page.locator('svg.plane-drawing').boundingBox();
	const unit = box.width / 20;
	const centre = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
	const at = (x, y) => ({ x: centre.x + x * unit, y: centre.y - y * unit });
	const clip = { x: Math.round(centre.x - VIEW.width / 2), y: Math.round(centre.y - VIEW.height / 2), ...VIEW };
	// a tool is a button of the bar, or a line of the list its group opens
	const tool = async (name) => {
		const bar = page.getByRole('toolbar', { name: 'Strumenti di geometria' });
		const alone = bar.locator(`button[aria-label="${name}"]`);
		if (await alone.count()) return alone.click();
		for (const group of await bar.locator('button[aria-haspopup]').all()) {
			if ((await group.getAttribute('aria-expanded')) !== 'true') await group.click();
			const line = page.getByRole('menuitemradio', { name, exact: true });
			if (await line.count()) return line.click();
		}
		throw new Error(`no tool called ${name}`);
	};

	const dir = mkdtempSync(join(tmpdir(), 'sapiens-clip-'));
	let frames = 0;
	let filming = false;
	// the pointer comes in from outside the picture and goes back there, so the film starts again without a jump
	const OUTSIDE = at(4.9, -3.1);
	let here = OUTSIDE;
	const shot = async (count = 1) => {
		if (!filming) return;
		for (let k = 0; k < count; k++) await page.screenshot({ clip, path: join(dir, `${String(frames++).padStart(4, '0')}.png`) });
	};
	const glide = async (to, n) => {
		const from = here;
		for (let k = 1; k <= (filming ? n : 1); k++) {
			const t = filming ? ease(k / n) : 1;
			await page.mouse.move(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t);
			await shot();
		}
		here = to;
	};
	const run = async (steps) => {
		for (const [kind, a, b] of steps) {
			if (kind === 'tool') await tool(a);
			else if (kind === 'wait') await shot(a);
			else if (kind === 'type') {
				await shot(6);
				await page.keyboard.type(a);
				await page.keyboard.press('Enter');
				await shot(10);
			} else if (kind === 'choose') {
				await shot(6);
				await page.getByRole('button', { name: a, exact: true }).click();
				await shot(10);
			}
			else if (kind === 'move') {
				await glide(at(a, b), 14);
				await shot(4);
			} else if (kind === 'click') {
				await glide(at(a, b), 16);
				await shot(3);
				await page.mouse.click(here.x, here.y);
				for (const r of [5, 9, 13, 0]) {
					await page.evaluate(([x, y, radius]) => window.recRing(x, y, radius), [here.x, here.y, r]);
					await shot();
				}
				await shot(7);
			} else if (kind === 'drag') {
				await page.mouse.down();
				await glide(at(a, b), 20);
				await page.mouse.up();
				await shot(6);
			}
		}
	};

	await run(scene.before ?? []);
	if (scene.tool === 'Muovi') {
		await page.keyboard.press('Escape');
		await page.keyboard.press('Escape');
	} else await tool(scene.tool);
	await page.mouse.move(here.x, here.y);
	await page.waitForTimeout(300);
	filming = true;
	await shot(8);
	await run(scene.steps);
	// the pointer leaves, and the result stays to be read before the film starts again
	await glide(OUTSIDE, 14);
	await shot(30);
	await page.context().close();

	const input = ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(dir, '%04d.png')];
	const scale = ['-vf', `scale=${FILM.width}:${FILM.height}:flags=lanczos`, '-an'];
	const out = (ext) => join(OUT, `${scene.clip}.${ext}`);
	execFileSync('ffmpeg', [...input, ...scale, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'veryslow', '-movflags', '+faststart', out('mp4')]);
	execFileSync('ffmpeg', [...input, ...scale, '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuv420p', '-crf', '38', '-b:v', '0', '-row-mt', '1', out('webm')]);
	execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(dir, `${String(frames - 1).padStart(4, '0')}.png`), '-vf', `scale=${FILM.width}:${FILM.height}:flags=lanczos`, '-q:v', '4', out('jpg')]);
	rmSync(dir, { recursive: true, force: true });
	const kb = (ext) => `${Math.round(statSync(out(ext)).size / 1024)} kB`;
	console.log(`${scene.clip}: ${(frames / FPS).toFixed(1)} s, webm ${kb('webm')}, mp4 ${kb('mp4')}, jpg ${kb('jpg')}`);
}

mkdirSync(OUT, { recursive: true });
const only = process.argv.slice(2);
const browser = await chromium.launch();
for (const scene of SCENES.filter((s) => !only.length || only.some((word) => s.clip.includes(word)))) await film(browser, scene);
await browser.close();
