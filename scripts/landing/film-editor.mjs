// Records the short film of the code editor for its tile on the landing page: a small Python program writes itself
// in the real editor, "Esegui" is pressed, and what it prints appears in the console. It is saved as .webm (VP9),
// .mp4 (H.264) and a .webp of the last frame, to show when the film is not playing, in public/landing/film.
//
//   node scripts/landing/film-editor.mjs
//
// Needs the dev server on localhost:3001 (or SAPIENS_URL), ffmpeg and cwebp. FRAMES_DIR keeps the screenshots in a
// folder of your choice, to look at them; without it they go in a temporary folder that is removed at the end.
// Record again when the look of the editor changes. The film is a run of screenshots of the editor, with a drawn
// pointer: the same on every machine, but for the milliseconds the console says the program took.
//
// What is staged, and is not how the page looks to a visitor: the window is narrow, so the console is under the code
// and the text is large; the code is 15 px (one of the editor's own settings) and has no minimap; the room for the
// code is cut to three lines and the console to what the program prints; the menu of the examples and "I miei
// programmi" are hidden, so the bar is one line; the card has square corners; the cursor does not blink.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const BASE = process.env.SAPIENS_URL ?? 'http://localhost:3001';
const OUT = new URL('../../public/landing/film/', import.meta.url).pathname;
const FPS = 24;
const FILM = { width: 800, height: 600 };
/** The window: under 1024 px the console is under the code, and the narrower it is the larger the text of the film. */
const WINDOW = { width: 520, height: 1000 };
/** The heights given to the code and to the console, in CSS pixels: with the bar they make a picture of 4 by 3. */
const CODE_HEIGHT = 94;
const CONSOLE_HEIGHT = 224;

const PROGRAM = '# I quadrati dei primi numeri\nfor n in range(1, 8):\n    print(n, "al quadrato fa", n * n)';
const PRINTED = [1, 2, 3, 4, 5, 6, 7].map((n) => `${n} al quadrato fa ${n * n}`).join('\n');
/**
 * The keys that write PROGRAM: the editor indents the line after the colon by itself, so its spaces are not typed.
 * A bracket or a quote brings its closing one, and typing the closing one goes over it: those are typed as they are.
 */
const KEYS = [...PROGRAM.replace(/\n +/g, '\n')];

/** The pointer drawn on the page, which a screenshot would not show, and the ring of a click. */
const POINTER = `
	const tip = document.createElement('div');
	tip.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 3l14 8-6.5 1.5L10 19z" fill="#111" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>';
	tip.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;margin:-3px 0 0 -5px';
	const ring = document.createElement('div');
	ring.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483646;pointer-events:none;border:2px solid #111;border-radius:50%;display:none';
	document.body.append(ring, tip);
	document.addEventListener('mousemove', (e) => { tip.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'; }, true);
	window.recRing = (x, y, r) => { ring.style.display = r ? 'block' : 'none'; ring.style.width = ring.style.height = 2 * r + 'px'; ring.style.transform = 'translate(' + (x - r) + 'px,' + (y - r) + 'px)'; };
`;

const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: WINDOW, deviceScaleFactor: 2, colorScheme: 'light', reducedMotion: 'reduce' });
// the student's settings of the editor (settings.ts): larger text, and no picture of the program along the edge
await context.addInitScript(() => localStorage.setItem('sapiens:editor', JSON.stringify({ size: 15, minimap: false })));
const page = await context.newPage();
await page.goto(`${BASE}/strumenti/editor-di-codice`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Rifiuta' }).click().catch(() => {});

const editor = page.locator('section[aria-label="Editor di Python"]');
const code = editor.locator('.cm-content');
const log = editor.getByRole('log');
const runButton = editor.getByRole('button', { name: 'Esegui' });
await code.waitFor();

await page.addStyleTag({ content: '.cm-cursorLayer { animation: none !important }' });
await editor.evaluate(
	(section, [codeHeight, consoleHeight]) => {
		const bar = section.firstElementChild;
		const inBar = (node) => [...bar.children].find((child) => child.contains(node));
		const saved = [...bar.querySelectorAll('button')].find((button) => button.textContent.includes('I miei programmi'));
		for (const node of [bar.querySelector('select[aria-label="Esempio"]'), saved]) inBar(node).style.display = 'none';
		// the box of the code is the parent of the editor's own; it stays when the editor is made again
		section.querySelector('.cm-editor').parentElement.parentElement.style.height = `${codeHeight}px`;
		section.querySelector('[role="log"]').style.height = `${consoleHeight}px`;
		// the picture is cut at the card's edge: round corners would show the page behind them
		section.style.borderRadius = '0';
	},
	[CODE_HEIGHT, CONSOLE_HEIGHT]
);

const selectAll = process.platform === 'darwin' ? 'Meta+A' : 'Control+A';
const empty = async () => {
	await code.click();
	await page.keyboard.press(selectAll);
	await page.keyboard.press('Backspace');
};
const finished = () => page.waitForFunction(() => document.querySelector('[role="log"]')?.textContent.includes('Programma finito'), null, { timeout: 120_000 });

// Python is downloaded at the first run: one run before the film, then the starting program is put back (which
// empties the console) and the editor is emptied
await empty();
await page.keyboard.insertText('print(1)');
await runButton.click();
await finished();
await editor.getByRole('button', { name: 'Ripristina' }).click();
await page.waitForFunction(() => document.querySelector('[role="log"]')?.textContent.includes('compare qui'));
await empty();

await page.evaluate(() => window.scrollTo(0, 0));
await page.evaluate(POINTER);
const box = await editor.boundingBox();
// the bar, the code and the console, without the border of the card
const clip = { x: Math.ceil(box.x) + 1, y: Math.ceil(box.y) + 1, width: Math.floor(box.width) - 3, height: 0 };
clip.height = Math.round((clip.width * FILM.height) / FILM.width);
const bottom = await log.boundingBox().then((b) => b.y + b.height);
if (Math.abs(bottom - (clip.y + clip.height)) > 6) console.warn(`the picture ends ${Math.round(clip.y + clip.height - bottom)} px after the console: change CODE_HEIGHT or CONSOLE_HEIGHT`);

const dir = process.env.FRAMES_DIR ?? mkdtempSync(join(tmpdir(), 'sapiens-film-editor-'));
mkdirSync(dir, { recursive: true });
let frames = 0;
const shot = async (count = 1) => {
	for (let k = 0; k < count; k++) await page.screenshot({ clip, path: join(dir, `${String(frames++).padStart(4, '0')}.png`) });
};
// the pointer waits under the picture and goes back there, so the film starts again without a jump
const OUTSIDE = { x: clip.x + clip.width * 0.8, y: clip.y + clip.height + 30 };
let here = OUTSIDE;
const glide = async (to, n) => {
	const from = here;
	for (let k = 1; k <= n; k++) {
		const t = ease(k / n);
		await page.mouse.move(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t);
		await shot();
	}
	here = to;
};
await page.mouse.move(here.x, here.y);

// the empty editor, then the program, a key every one or two frames and a breath at the end of a line
await shot(10);
for (const [i, key] of KEYS.entries()) {
	if (key === '\n') await page.keyboard.press('Enter');
	else await page.keyboard.type(key);
	await shot(key === '\n' ? 6 : 1 + (i % 2));
}
const written = await code.evaluate((node) => [...node.querySelectorAll('.cm-line')].map((line) => line.textContent).join('\n'));
if (written !== PROGRAM) throw new Error(`the editor holds something else:\n${written}`);
await shot(8);

// "Esegui": the pointer comes, presses, and what the program prints is there
const button = await runButton.boundingBox();
await glide({ x: button.x + button.width / 2, y: button.y + button.height / 2 + 2 }, 16);
await shot(3);
await page.mouse.down();
for (const r of [5, 9]) {
	await page.evaluate(([x, y, radius]) => window.recRing(x, y, radius), [here.x, here.y, r]);
	await shot();
}
await page.mouse.up();
await finished();
for (const r of [13, 0]) {
	await page.evaluate(([x, y, radius]) => window.recRing(x, y, radius), [here.x, here.y, r]);
	await shot();
}
const printed = await log.textContent();
if (!printed.startsWith(`${PRINTED}\n`)) throw new Error(`the program printed something else:\n${printed}`);
await shot(6);
// the pointer leaves, and the result stays to be read before the film starts again
await glide(OUTSIDE, 14);
await shot(36);
await context.close();
await browser.close();

mkdirSync(OUT, { recursive: true });
const last = join(dir, `${String(frames - 1).padStart(4, '0')}.png`);
const input = ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(dir, '%04d.png')];
const scale = ['-vf', `scale=${FILM.width}:${FILM.height}:flags=lanczos`, '-an'];
const out = (ext) => join(OUT, `editor.${ext}`);
execFileSync('ffmpeg', [...input, ...scale, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'veryslow', '-movflags', '+faststart', out('mp4')]);
execFileSync('ffmpeg', [...input, ...scale, '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuv420p', '-crf', '30', '-b:v', '0', '-row-mt', '1', out('webm')]);
execFileSync('cwebp', ['-quiet', '-q', '90', '-resize', String(FILM.width), String(FILM.height), last, '-o', out('webp')]);
if (!process.env.FRAMES_DIR) rmSync(dir, { recursive: true, force: true });
const kb = (ext) => `${Math.round(statSync(out(ext)).size / 1024)} kB`;
console.log(`editor: ${frames} frames, ${(frames / FPS).toFixed(1)} s, webm ${kb('webm')}, mp4 ${kb('mp4')}, webp ${kb('webp')}`);
