/*
 * The flame tests, played from start to finish in a headless browser, through the game's own inputs: the crosshair
 * (the student looks at a thing), the mouse buttons, Q and E, the wheel. It checks what the prompt offers at each
 * step, where the loop's end really goes (in the acid, on the salt, in the flame), the colour the flame takes for
 * each salt, what the cobalt glass does, the answers on the cards and the notebook at the end, and saves the frames.
 *
 *   npm run dev, then: node scripts/lab/fiamma.mjs <out dir> [banco|aula] [L|R] [seed]
 *   LAB_URL sets the server (default http://localhost:3000). The hand given holds the loop. W, H and Q set the
 *   window and the graphics (1100, 700, leggera); COVER=1 also saves the scene alone with the copper flame.
 *
 * The test draws the game's frames itself, so a run takes the same half minute whatever the machine is doing.
 */

// `use` here is the student using a thing in the game, not React's hook: this script has no React in it.
/* eslint-disable react-hooks/rules-of-hooks */
import { chromium } from 'playwright';
import fs from 'fs';

const OUT = process.argv[2];
const ROOM = process.argv[3] ?? 'banco';
const SIDE = process.argv[4] ?? 'R';
const SEED = process.argv[5] ?? '7';
const BASE = process.env.LAB_URL ?? 'http://localhost:3000';
if (!OUT) throw new Error('usage: node scripts/lab/fiamma.mjs <out dir> [banco|aula] [L|R] [seed]');
fs.mkdirSync(OUT, { recursive: true });
const OTHER = SIDE === 'R' ? 'L' : 'R';

// frames not tied to the display: with them a headless Chrome on the GPU stops drawing when the screen sleeps
const browser = await chromium.launch({ headless: true, args: ['--use-angle=metal', '--enable-gpu', '--disable-gpu-vsync', '--disable-frame-rate-limit', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'] });
const page = await browser.newPage({ viewport: { width: Number(process.env.W ?? 1100), height: Number(process.env.H ?? 700) }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && !/Failed to load resource|favicon/.test(m.text()) && errors.push(m.text()));
await page.goto(`${BASE}/laboratorio/chimica/saggi-alla-fiamma?stanza=${ROOM}&qualita=${process.env.Q ?? 'leggera'}&seme=${SEED}`, { timeout: 240000 });
await page.click('button:has-text("Rifiuta")', { timeout: 4000 }).catch(() => {});
await page.waitForSelector('text=Clicca per entrare', { timeout: 180000 });
await page.click('button:has-text("Rifiuta")', { timeout: 2000 }).catch(() => {});
await page.screenshot({ path: `${OUT}/${ROOM}-00-titolo.png` });
await page.click('text=Clicca per entrare');
await page.waitForFunction(() => window.__lab?.scene, null, { timeout: 60000 });

await page.evaluate(() => {
	const { scene: s, work: w } = window.__lab;
	const V = s.gauzeCenter.constructor;
	s.player.sync = () => {};
	s.player.locked = true;
	s.onLock(true);
	const H = (window.__H = { V });
	H.pos = (n) => (typeof n === 'string' ? s.nodes.get(n).getWorldPosition(new V()) : new V(...n));
	/** The student's place: in front of the burner, a step to the right, at the bench's edge. */
	H.place = (dx = 0.06) => {
		const b = H.pos('Bunsen');
		const yaw = s.player.home.yaw;
		s.player.position.x = b.x + Math.cos(yaw) * dx + Math.sin(yaw) * 0.55;
		s.player.position.z = b.z - Math.sin(yaw) * dx + Math.cos(yaw) * 0.55;
		s.player.settleHands();
	};
	H.look = (target, up = 0) => {
		const t = H.pos(target);
		t.y += up;
		s.player.lookAt(t);
	};
	H.snap = () => {
		const x = w.getSnapshot();
		return { target: x.target, actions: x.actions.map((a) => `${a.input}:${a.text}${a.blocked ? ' (no)' : ''}`), message: x.message?.text ?? null, step: x.step, objective: x.objective, readouts: x.readouts.map((r) => `${r.label}: ${r.value}`), busy: x.busy, done: x.done };
	};
	H.busy = () => w.free.busy;
	H.key = (side) => s.onUse(side);
	H.press = (side) => s.press(side === 'L' ? 0 : 2);
	H.wheel = (d) => s.onWheel(d);
	H.held = (side) => s.hands.held(side)?.name ?? null;
	// the loop's closest approach to a thing while an action runs: [off its axis, above its origin], metres
	let rec = null;
	const prev = s.onUpdate;
	s.onUpdate = (dt) => {
		prev(dt);
		if (!rec) return;
		const t = s.nodes.get('WireLoop').getWorldPosition(new V());
		const b = s.nodes.get(rec.name).getWorldPosition(new V());
		const d = [Math.hypot(t.x - b.x, t.z - b.z), t.y - b.y];
		if (!rec.best || d[1] < rec.best[1]) rec.best = d;
	};
	H.rec = (name) => (rec = { name, best: null });
	// The test draws the frames itself, sixty to a second of the game's clock. Left to the browser's own frames the
	// game stands still whenever the screen sleeps or the window is covered (a headless Chrome with a GPU follows the
	// display), and a run takes minutes or never ends.
	const frame = s.frame.bind(s);
	s.frame = () => {};
	s.clock.getDelta = () => 1 / 60;
	const turn = () =>
		new Promise((done) => {
			const c = new MessageChannel();
			c.port1.onmessage = () => done();
			c.port2.postMessage(0);
		});
	const CONDS = {
		idle: () => !w.free.busy,
		step: (n) => w.getSnapshot().step === n,
		burnt: () => Object.values(w.state.loop.load).every((v) => v < 0.001)
	};
	/** `sec` seconds of the game. */
	H.after = async (sec) => {
		for (let i = 0, n = Math.max(1, Math.round(sec * 60)); i < n; i++) {
			frame();
			await turn();
		}
	};
	/** The scene alone, without the page's texts over it: a frame drawn and read back at once. */
	H.canvas = () => {
		frame();
		return s.renderer.domElement.toDataURL('image/png');
	};
	/** Runs the game until a condition holds, `max` seconds of it at most: whether it did. */
	H.until = async (name, arg, max = 60) => {
		for (let i = 0; i < max * 60; i++) {
			if (CONDS[name](arg)) return true;
			frame();
			await turn();
		}
		return false;
	};
	H.recEnd = () => {
		const r = rec?.best ?? [9, 9];
		rec = null;
		return r;
	};
	H.tip = () => s.nodes.get('WireLoop').getWorldPosition(new V()).toArray();
	/** The colour on screen at a world point: the average of a small square round it, sRGB 0..255. */
	H.at = (p) => {
		const v = new V(...p).project(s.camera);
		return [(v.x * 0.5 + 0.5) * innerWidth, (-v.y * 0.5 + 0.5) * innerHeight];
	};
	H.state = () => JSON.parse(JSON.stringify({ taintK: w.state.samples.K.taint, loop: w.state.loop, unknown: w.state.unknown, seen: [...w.seen], through: [...w.throughGlass], answers: w.answers, inFlame: w.inFlame, lit: w.lit, air: w.air, glass: w.cobaltUp, flameAt: w.flameAt.toArray() }));
});

/** Waits in the game's time, which the test itself moves on. */
const wait = (ms) => page.evaluate((sec) => window.__H.after(sec), ms / 1000);
const until = (name, arg, max = 60) => page.evaluate(([name, arg, max]) => window.__H.until(name, arg, max), [name, arg, max]);
const ev = (fn, arg) => page.evaluate(fn, arg);
const idle = async () => {
	await wait(150);
	if (!(await until('idle', null, 40))) console.log('STUCK', JSON.stringify(await page.evaluate(() => window.__H.snap())));
	await wait(200);
};
const snap = () => ev(() => window.__H.snap());
const state = () => ev(() => window.__H.state());
const checks = [];
const check = (name, ok, detail = '') => {
	checks.push({ name, ok: !!ok, detail });
	console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ' · ' + detail : ''}`);
};
let shot = 1;
const photo = async (name) => page.screenshot({ path: `${OUT}/${ROOM}-${String(shot++).padStart(2, '0')}-${name}.png` });
const look = async (target, up = 0) => {
	await ev(([t, u]) => window.__H.look(t, u), [target, up]);
	await wait(260);
};
/** Looks at a thing and presses the key of a hand, if the prompt offers `text` on it. */
const use = async (target, side, text, up = 0) => {
	await look(target, up);
	const s = await snap();
	const key = side === 'L' ? 'Q' : 'E';
	const has = s.actions.some((a) => a.startsWith(`${key}:`) && a.includes(text) && !a.endsWith('(no)'));
	check(`prompt on ${Array.isArray(target) ? 'point' : target}: ${key} ${text}`, has, has ? '' : JSON.stringify(s.actions));
	await ev((side) => window.__H.key(side), side);
	return has;
};
const grab = async (name, side, up = 0) => {
	await look(name, up);
	await ev((side) => window.__H.press(side), side);
	await idle();
	const held = await ev((side) => window.__H.held(side), side);
	check(`take ${name} with ${side}`, held === name, `holds ${held}`);
};
const putDown = async (point, side) => {
	await look(point);
	await ev((side) => window.__H.press(side), side);
	await idle();
	check(`put down from ${side}`, (await ev((side) => window.__H.held(side), side)) === null, JSON.stringify((await snap()).actions));
};
const wheel = async (delta, times = 1) => {
	for (let i = 0; i < times; i++) {
		await ev((d) => window.__H.wheel(d), delta);
		await wait(30);
	}
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
/** The mean colour of the screen round the loop's end, where the coloured flame is. */
const flameColour = async () => {
	const tip = await ev(() => window.__H.tip());
	const [x, y] = await ev((p) => window.__H.at([p[0], p[1] + 0.03, p[2]]), tip);
	const buf = await page.screenshot({ clip: { x: Math.max(0, x - 14), y: Math.max(0, y - 22), width: 28, height: 44 } });
	return ev(async (b64) => {
		const img = new Image();
		img.src = 'data:image/png;base64,' + b64;
		await img.decode();
		const c = document.createElement('canvas');
		c.width = img.width;
		c.height = img.height;
		const g = c.getContext('2d');
		g.drawImage(img, 0, 0);
		const d = g.getImageData(0, 0, c.width, c.height).data;
		// the brightest third of the pixels: the flame, not what is behind it
		const px = [];
		for (let i = 0; i < d.length; i += 4) px.push([d[i], d[i + 1], d[i + 2]]);
		px.sort((a, b) => b[0] + b[1] + b[2] - (a[0] + a[1] + a[2]));
		const top = px.slice(0, Math.ceil(px.length / 3));
		return [0, 1, 2].map((k) => Math.round(top.reduce((s, p) => s + p[k], 0) / top.length));
	}, buf.toString('base64'));
};
const hue = ([r, g, b]) => {
	const mx = Math.max(r, g, b);
	const mn = Math.min(r, g, b);
	if (mx - mn < 1) return 0;
	const h = mx === r ? ((g - b) / (mx - mn)) % 6 : mx === g ? (b - r) / (mx - mn) + 2 : (r - g) / (mx - mn) + 4;
	return Math.round((h * 60 + 360) % 360);
};

// ------------------------------------------------------------------------------------------------
await ev(() => window.__H.place());
await look('Bunsen', 0.05);
await photo('banco');

// 1. goggles: they are further left than the hands reach from the burner
await ev(() => window.__H.place(-0.45));
await use('Goggles', OTHER, 'Indossa');
await idle();
await ev(() => window.__H.place());
check('goggles on', (await snap()).step === 1);

// 2. the burner: collar closed, lighter, gas, spark, collar open
await look('Bunsen', 0.03);
await wheel(120, 6);
await grab('Lighter', SIDE);
// the tap is to the right of the burner: the hand that does not hold the lighter reaches it from a step that way
await ev((side) => window.__H.place(side === 'L' ? 0.4 : 0.1), OTHER);
await use('GasTap', OTHER, 'Apri il gas', 0.12);
await idle();
await ev(() => window.__H.place());
await use('Bunsen', SIDE, 'Accendi', 0.03);
await idle();
check('burner lit', (await state()).lit);
await photo('fiamma-gialla');
await look('Bunsen', 0.03);
await wheel(-120, 8);
await until('step', 2, 6);
check('flame blue, step 3', (await snap()).step === 2, JSON.stringify(await snap()));
await photo('fiamma-azzurra');
const rest = await ev(() => window.__lab.scene.rest.get('Lighter').position.toArray());
await putDown([rest[0] + 0.107, rest[1], rest[2] - 0.02], SIDE);

// 3. the loop: first in the flame as it is (sodium from the fingers), then acid and flame until it is clean
await grab('WireLoop', SIDE);
await use('Bunsen', SIDE, 'Porta nella fiamma', 0.03);
await idle();
let st = await state();
const tipErr = dist(await ev(() => window.__H.tip()), st.flameAt);
check('loop tip in the flame', tipErr < 0.012, `${(tipErr * 1000).toFixed(1)} mm from the place asked`);
await look('Bunsen', 0.16);
await wait(500);
const trace = await flameColour();
await photo('ansa-sporca');
check('dirty loop burns yellow', hue(trace) > 25 && hue(trace) < 65, `rgb ${trace} hue ${hue(trace)}`);
await wait(2500);
check('trace message', true, (await snap()).message ?? '');
const s1 = await snap();
check('in the flame the key takes it out', s1.actions.some((a) => a.includes('Togli dalla fiamma')), JSON.stringify(s1.actions));
await ev((side) => window.__H.key(side), SIDE);
await idle();

/** Acid, a sample, the flame: returns the colour seen. `glass`: look through the cobalt glass too. */
const test = async (sample, { glass = false, keep = false } = {}) => {
	await ev(() => window.__H.rec('AcidBeaker'));
	await use('AcidBeaker', SIDE, "Immergi nell'acido", 0.03);
	await idle();
	const inAcid = await ev(() => window.__H.recEnd());
	check(`${sample}: loop in the acid`, inAcid[0] < 0.012 && inAcid[1] < 0.03, `off axis ${(inAcid[0] * 1000).toFixed(1)} mm, ${(inAcid[1] * 1000).toFixed(1)} mm up`);
	await ev((n) => window.__H.rec(n), `Sample${sample}`);
	await use(`Sample${sample}`, SIDE, 'Tocca il sale', 0.005);
	await idle();
	const onSalt = await ev(() => window.__H.recEnd());
	check(`${sample}: loop on the salt`, onSalt[0] < 0.012 && onSalt[1] < 0.02 && onSalt[1] > -0.002, `off axis ${(onSalt[0] * 1000).toFixed(1)} mm, ${(onSalt[1] * 1000).toFixed(1)} mm up`);
	await use('Bunsen', SIDE, 'Porta nella fiamma', 0.03);
	await idle();
	await look('Bunsen', 0.16);
	await wait(1100);
	const c = await flameColour();
	await photo(`fiamma-${sample}`);
	// COVER=1: the scene alone with the copper flame, for the menu's photo
	if (process.env.COVER && sample === 'Cu') fs.writeFileSync(`${OUT}/cover.png`, Buffer.from((await ev(() => window.__H.canvas())).split(',')[1], 'base64'));
	let through = null;
	if (glass) {
		const s0 = await snap();
		check(`${sample}: the other key raises the glass`, s0.actions.some((a) => a.includes('Guarda attraverso il vetro')), JSON.stringify(s0.actions));
		await ev((side) => window.__H.key(side), OTHER);
		// the frames of the hand that brings the glass to the eyes, once
		for (let i = 0; i < 7; i++) {
			await wait(200);
			if (sample === 'Mix') await photo(`vetro-sale-${i}`);
		}
		through = await flameColour();
		await photo(`vetro-${sample}`);
		await ev((side) => window.__H.key(side), OTHER);
		await wait(400);
	}
	if (!keep) {
		// until it has burnt off
		await until('burnt', null, 30);
		await wait(300);
	}
	await ev((side) => window.__H.key(side), SIDE);
	await idle();
	return { c, through };
};

// first the cleaning: acid, then the flame until nothing colours it
await use('AcidBeaker', SIDE, "Immergi nell'acido", 0.03);
await idle();
await use('Bunsen', SIDE, 'Porta nella fiamma', 0.03);
await idle();
await until('step', 3, 12);
check('loop clean, step 4', (await snap()).step === 3, JSON.stringify(await snap()));
await ev((side) => window.__H.key(side), SIDE);
await idle();

// the notebook, read at the bench (it is raised in front of the eyes)
const notebook = async (name) => {
	await ev(() => (window.__lab.notebook.open = true));
	await wait(900);
	await photo(name);
	await ev(() => (window.__lab.notebook.open = false));
	await wait(600);
};
await look('SampleK', 0.005);
await photo('vassoio');
await notebook('quaderno-sette-sali');

// 4. the seven salts
const want = { Li: [330, 360], Na: [30, 55], K: [240, 300], Ca: [10, 32], Sr: [0, 12], Ba: [65, 110], Cu: [140, 185] };
const seenColours = {};
for (const id of Object.keys(want)) {
	const { c } = await test(id);
	seenColours[id] = c;
	const h = hue(c);
	const [lo, hi] = want[id];
	const inRange = lo <= hi ? h >= lo && h <= hi : h >= lo || h <= hi;
	check(`${id}: flame colour`, inRange || (id === 'Sr' && h >= 355), `rgb ${c} hue ${h}, wanted ${lo}-${hi}`);
	check(`${id}: written in the notebook`, (await state()).seen.includes(id));
	if (id === 'Ca') await notebook('quaderno-a-meta');
}
// hues on a circle that starts at 180°, so the reds on either side of 0° compare
const turned = (c) => (hue(c) + 180) % 360;
check('the three reds can be told apart', turned(seenColours.Sr) - turned(seenColours.Li) > 10 && turned(seenColours.Ca) - turned(seenColours.Sr) > 10, `Li ${hue(seenColours.Li)} Sr ${hue(seenColours.Sr)} Ca ${hue(seenColours.Ca)}`);
check('seven salts, step 5', (await snap()).step === 4, JSON.stringify(await snap()));

// 5. the mixture, by eye and through the cobalt glass
await grab('CobaltGlass', OTHER, 0.002);
const mix = await test('Mix', { glass: true });
check('Mix: yellow by eye', hue(mix.c) > 25 && hue(mix.c) < 60, `rgb ${mix.c} hue ${hue(mix.c)}`);
check('Mix: no yellow through the glass', mix.through && (hue(mix.through) > 260 || hue(mix.through) < 15), `rgb ${mix.through} hue ${mix.through ? hue(mix.through) : ''}`);
check('mixture seen through the glass, step 6', (await snap()).step === 5, JSON.stringify(await snap()));

// 6. the unknown samples
st = await state();
const NAMES = ['Li', 'Na', 'K', 'Ca', 'Sr', 'Ba', 'Cu', 'NaK'];
const answer = async (id, value) => {
	await look(`Answer${id}`, 0.02);
	const s0 = await snap();
	check(`card ${id}: the wheel chooses`, s0.actions.some((a) => a.includes('Scegli il metallo')), JSON.stringify(s0));
	for (let i = 0; i < 12; i++) {
		const a = (await state()).answers[id];
		if (a.pick === NAMES.indexOf(value)) break;
		await wheel(60);
	}
	await wait(200);
	await ev(() => window.__H.key('L'));
	await wait(400);
};
// a card cannot be confirmed before its sample has been in the flame
await look('AnswerX', 0.02);
await wheel(60);
await wait(200);
const early = await snap();
check('card X: not before the test', early.actions.some((a) => a.includes('Prima saggia il campione') && a.endsWith('(no)')), JSON.stringify(early.actions));
const x = await test('X');
await notebook('quaderno-incogniti');
await look('AnswerX', 0.02);
await wheel(60, 3);
await wait(300);
await photo('cartellino-scelta');
// a wrong answer first: the card is struck through and the notes keep it
const wrong = NAMES.find((n) => n !== st.unknown.X && n !== 'NaK' && n !== 'Na');
await answer('X', wrong);
check('X: wrong answer refused', !(await state()).answers.X.done && (await state()).answers.X.tries === 1, (await snap()).message ?? '');
await photo('cartellino-sbagliato');
// no second guess without a second look: the sample goes back in the flame first
await answer('X', st.unknown.X);
const again = await snap();
check('X: no second answer before a second test', !(await state()).answers.X.done && again.actions.some((a) => a.includes('Prima rifai il saggio')), JSON.stringify(again.actions));
await test('X');
await answer('X', st.unknown.X);
check(`X: ${st.unknown.X} accepted`, (await state()).answers.X.done, `flame hue ${hue(x.c)}`);
const y = await test('Y', { glass: true });
await answer('Y', st.unknown.Y);
check(`Y: ${st.unknown.Y} accepted`, (await state()).answers.Y.done, `through the glass rgb ${y.through}`);
await look('AnswerX', 0.02);
await photo('cartellini');
check('both recognised, step 7', (await snap()).step === 6, JSON.stringify(await snap()));

// a loop that is not clean spoils a sample; a fresh one can be asked for
await use('AcidBeaker', SIDE, "Immergi nell'acido", 0.03);
await idle();
await use('SampleNa', SIDE, 'Tocca il sale', 0.005);
await idle();
await use('SampleK', SIDE, 'Tocca il sale', 0.005);
await idle();
const spoiled = await snap();
check('dirty loop: the sample is contaminated, and the student is told', Object.keys((await state()).taintK).length > 0 && /non era pulita/.test(spoiled.message ?? ''), spoiled.message ?? '');
await look('SampleK', 0.005);
const offer = await snap();
check('a fresh sample is offered', offer.actions.some((a) => a.includes('Chiedi un campione nuovo')), JSON.stringify(offer.actions));
await ev((side) => window.__H.key(side), OTHER);
await idle();
check('fresh sample: clean again', Object.keys((await state()).taintK).length === 0, (await snap()).message ?? '');

// 7. tidy up
await look('GasTap', 0.12);
const tapSnap = await snap();
check('tap needs a free hand', tapSnap.actions.some((a) => a.includes('Serve una mano libera')), JSON.stringify(tapSnap.actions));
const p0 = await ev(() => window.__lab.scene.rest.get('CobaltGlass').position.toArray());
await putDown(p0, OTHER);
await ev((side) => window.__H.place(side === 'L' ? 0.4 : 0.1), OTHER);
await use('GasTap', OTHER, 'Chiudi il gas', 0.12);
await idle();
await ev(() => window.__H.place());
const p1 = await ev(() => window.__lab.scene.rest.get('WireLoop').position.toArray());
await putDown([p1[0] + 0.1, p1[1], p1[2] - 0.02], SIDE);
await wait(1500);
const end = await snap();
check('experiment done', end.done, JSON.stringify(end));
await wait(1200);
await photo('risultati');

// the notebook is up with the results: its table of colours takes what was seen, and marks what is wrong
await page.click('button.rounded-t-lg:has-text("Colori")');
await wait(200);
await page.selectOption('[data-field="col_Li"]', 'giallo intenso');
await wait(150);
const wrongMark = await ev(() => window.__lab.notebook.marks.col_Li);
await page.selectOption('[data-field="col_Li"]', 'rosso carminio');
await page.selectOption('[data-field="col_Cu"]', 'verde azzurro');
await wait(150);
await photo('quaderno-colori');
const marks = await ev(() => ({ ...window.__lab.notebook.marks }));
check('notebook: a wrong colour is marked, the right ones are taken', wrongMark === 'wrong' && marks.col_Li === 'ok' && marks.col_Cu === 'ok', JSON.stringify(marks) + ' · ' + (await ev(() => JSON.stringify({ hint: window.__lab.notebook.hint, values: window.__lab.notebook.values, ro: window.__lab.notebook.readOnly, seen: [...window.__lab.work.seen] }))));
await page.click('button.rounded-t-lg:has-text("Strumenti")');
await wait(200);
await photo('quaderno-strumenti');

check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
const bad = checks.filter((c) => !c.ok);
fs.writeFileSync(`${OUT}/controlli-${ROOM}-${SIDE}.json`, JSON.stringify({ room: ROOM, side: SIDE, seed: SEED, unknown: st.unknown, colours: seenColours, checks }, null, 1));
console.log(`\n${checks.length - bad.length} su ${checks.length} controlli a posto (${ROOM}, ansa nella mano ${SIDE})`);
await browser.close();
process.exit(bad.length ? 1 : 0);
