/*
 * The acid-base titration, played from start to finish in a headless browser, through the game's own inputs: the
 * crosshair (the student looks at a thing), the mouse buttons, Q and E, the wheel. It checks what the prompt offers
 * at each step, that the burette fills and is primed, the pipette's 25.0 mL, the flask's colour on screen as the base
 * goes in, the readings and the sums written in the notebook (B), the three titres and the concentration, and
 * saves the frames.
 *
 *   npm run dev, then: node scripts/lab/titolazione.mjs <out dir> [banco|aula] [L|R] [seed]
 *   LAB_URL sets the server (default http://localhost:3000). The hand given holds the tools; the other one swirls
 *   the flask. W, H and Q set the window and the graphics (1100, 700, leggera); COVER=1 also saves the scene alone
 *   at the end point, for the menu's photo.
 *
 * The test draws the game's frames itself, so a run takes the same time whatever the machine is doing.
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
if (!OUT) throw new Error('usage: node scripts/lab/titolazione.mjs <out dir> [banco|aula] [L|R] [seed]');
fs.mkdirSync(OUT, { recursive: true });
const OTHER = SIDE === 'R' ? 'L' : 'R';

// frames not tied to the display: with them a headless Chrome on the GPU stops drawing when the screen sleeps
const browser = await chromium.launch({ headless: true, args: ['--use-angle=metal', '--enable-gpu', '--disable-gpu-vsync', '--disable-frame-rate-limit', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', '--disable-features=CalculateNativeWinOcclusion'] });
const page = await browser.newPage({ viewport: { width: Number(process.env.W ?? 1100), height: Number(process.env.H ?? 700) }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => {
	if (m.type() !== 'error' || /Failed to load resource|favicon/.test(m.text())) return;
	errors.push(m.text());
	if (process.env.TRACE) console.log('PAGE ERROR', m.text(), JSON.stringify(m.location()));
});
await page.goto(`${BASE}/laboratorio/chimica/titolazione?stanza=${ROOM}&qualita=${process.env.Q ?? 'leggera'}&seme=${SEED}`, { timeout: 240000 });
await page.click('button:has-text("Rifiuta")', { timeout: 4000 }).catch(() => {});
await page.waitForSelector('text=Clicca per entrare', { timeout: 180000 });
await page.click('button:has-text("Rifiuta")', { timeout: 2000 }).catch(() => {});
await page.screenshot({ path: `${OUT}/${ROOM}-00-titolo.png` });
await page.click('text=Clicca per entrare');
await page.waitForFunction(() => window.__lab?.scene, null, { timeout: 60000 });

await page.evaluate(() => {
	const { scene: s, work: w } = window.__lab;
	const V = s.gauzeCenter.constructor;
	// the test has no mouse to capture: the game is on whatever the browser says
	s.player.sync = () => {};
	s.player.locked = true;
	s.onLock(true);
	const H = (window.__H = { V });
	// who closes the notebook, for a check that fails
	const nb = window.__lab.notebook;
	const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(nb), 'open');
	H.closes = [];
	Object.defineProperty(nb, 'open', {
		get: () => desc.get.call(nb),
		set: (v) => {
			if (!v) H.closes.push(new Error().stack.split('\n').slice(2, 7).map((l) => l.trim().slice(0, 90)).join(' < '));
			desc.set.call(nb, v);
		}
	});
	H.pos = (n) => (typeof n === 'string' ? s.nodes.get(n).getWorldPosition(new V()) : new V(...n));
	/** The student's place: in front of the burette, `dx` to the right, at the bench's edge. */
	H.place = (dx = 0) => {
		const b = H.pos('Burette');
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
		return { target: x.target, actions: x.actions.map((a) => `${a.input}:${a.text}${a.blocked ? ' (no)' : ''}`), message: x.message?.text ?? null, step: x.step, objective: x.objective, readouts: x.readouts.map((r) => `${r.label}: ${r.value}`), busy: x.busy, done: x.done, lens: x.lens };
	};
	H.key = (side) => s.onUse(side);
	H.press = (side) => s.press(side === 'L' ? 0 : 2);
	H.wheel = (d) => s.onWheel(d);
	H.held = (side) => s.hands.held(side)?.name ?? null;
	// while a flask is swirled: how far its mouth's middle gets from the burette's tip, metres
	let rec = null;
	const prev = s.onUpdate;
	s.onUpdate = (dt) => {
		prev(dt);
		if (!rec) return;
		const f = s.nodes.get(rec.name);
		f.updateWorldMatrix(true, false);
		const m = new V(0, 0.145, 0).applyMatrix4(f.matrixWorld);
		const t = H.pos('Burette');
		rec.far = Math.max(rec.far, Math.hypot(m.x - t.x, m.z - t.z));
		rec.trace.push(Math.round(Math.hypot(m.x - t.x, m.z - t.z) * 1000));
		rec.low = Math.min(rec.low, t.y - m.y);
	};
	H.rec = (name) => (rec = { name, far: 0, low: 9, trace: [] });
	H.recEnd = () => {
		const r = rec ? [rec.far, rec.low, rec.trace] : [9, 9, []];
		rec = null;
		return r;
	};
	// The test draws the frames itself, sixty to a second of the game's clock. Left to the browser's own frames the
	// game stands still whenever the screen sleeps or the window is covered.
	const frame = s.frame.bind(s);
	s.frame = () => {};
	s.clock.getDelta = () => 1 / 60;
	const turn = () =>
		new Promise((done) => {
			const c = new MessageChannel();
			c.port1.onmessage = () => done();
			c.port2.postMessage(0);
		});
	const fl = (id) => w.state.flasks[id];
	const over = (id) => ((fl(id).base + fl(id).fresh - fl(id).acid) / 0.1) * 1000;
	const CONDS = {
		idle: () => !w.free.busy,
		step: (n) => w.getSnapshot().step === n,
		level: (v) => w.state.burette.level >= v,
		beyond: ([id, v]) => over(id) >= v,
		cloud: ([id, v]) => fl(id).fresh >= v,
		mixed: (id) => fl(id).fresh < 2e-7,
		pipette: (v) => s.liquids.get('Pipette').contents.vol >= v
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
	/** A world point on screen, CSS pixels. */
	H.at = (p) => {
		const v = new V(...p).project(s.camera);
		return [(v.x * 0.5 + 0.5) * innerWidth, (-v.y * 0.5 + 0.5) * innerHeight];
	};
	H.state = () => {
		const b = s.nodes.get('Burette');
		const funnel = H.pos('Funnel');
		const tip = H.pos('Burette');
		return JSON.parse(
			JSON.stringify({
				...w.state,
				over: { 1: over(1), 2: over(2), 3: over(3) },
				opening: w.opening,
				swirl: w.swirl,
				drawing: w.drawing,
				dropAt: w.dropAt,
				runs: w.runs,
				pipette: s.liquids.get('Pipette').contents.vol,
				naoh: s.liquids.get('NaOHBeaker').contents.vol,
				sampleLeft: s.liquids.get('SampleBeaker').contents.vol,
				funnelOn: Math.hypot(funnel.x - tip.x, funnel.z - tip.z) < 0.012 && funnel.y > tip.y + 0.25,
				tip: tip.toArray(),
				zero: Number(b.userData.zero),
				full: Number(b.userData.full),
				column: s.liquids.get('Burette').contents.vol > 0 ? s.liquids.get('Burette').level() : null,
				cockTurn: s.nodes.get('BuretteCock').rotation.z,
				reaching: { L: s.hands.reaching('L'), R: s.hands.reaching('R') }
			})
		);
	};
	H.rest = (name) => s.rest.get(name).position.toArray();
	/** The middle of a mesh, in the world. */
	H.middle = (name) => {
		const m = s.nodes.get(name);
		m.geometry.computeBoundingBox();
		m.updateWorldMatrix(true, false);
		return m.geometry.boundingBox.getCenter(new V()).applyMatrix4(m.matrixWorld).toArray();
	};
	H.notes = () => w.report;
});

/** Waits in the game's time, which the test itself moves on. */
const wait = (ms) => page.evaluate((sec) => window.__H.after(sec), ms / 1000);
const until = (name, arg, max = 60) => page.evaluate(([name, arg, max]) => window.__H.until(name, arg, max), [name, arg, max]);
const ev = (fn, arg) => page.evaluate(fn, arg);
const idle = async (max = 60) => {
	await wait(150);
	if (!(await until('idle', null, max))) console.log('STUCK', JSON.stringify(await page.evaluate(() => window.__H.snap())));
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
const photo = async (name) => {
	// a window that is not in front may not be repainted
	await page.bringToFront().catch(() => {});
	await wait(34);
	return page.screenshot({ path: `${OUT}/${ROOM}-${String(shot++).padStart(2, '0')}-${name}.png` });
};
const look = async (target, up = 0) => {
	await ev(([t, u]) => window.__H.look(t, u), [target, up]);
	await wait(260);
};
const keyName = (side) => (side === 'L' ? 'Q' : 'E');
/** Looks at a thing and presses the key of a hand, if the prompt offers `text` on it. */
const use = async (target, side, text, up = 0) => {
	await look(target, up);
	const s = await snap();
	const has = s.actions.some((a) => a.startsWith(`${keyName(side)}:`) && a.includes(text) && !a.endsWith('(no)'));
	check(`prompt on ${Array.isArray(target) ? 'point' : target}: ${keyName(side)} ${text}`, has, has ? '' : JSON.stringify(s.actions));
	await ev((side) => window.__H.key(side), side);
	return has;
};
/** Looks at a thing and checks that a key is offered but refused, with a reason that says `why`. */
const refused = async (target, side, why, up = 0) => {
	await look(target, up);
	await ev((side) => window.__H.key(side), side);
	await wait(120);
	const s = await snap();
	check(`refused on ${target}: ${why}`, (s.message ?? '').includes(why), `${JSON.stringify(s.actions)} · ${s.message}`);
};
const grab = async (name, side, up = 0) => {
	await look(name, up);
	await ev((side) => window.__H.press(side), side);
	await idle();
	const held = await ev((side) => window.__H.held(side), side);
	check(`take ${Array.isArray(name) ? 'the thing there' : name} with ${side}`, Array.isArray(name) ? held !== null : held === name, `holds ${held}`);
};
const putDown = async (point, side) => {
	await look(point);
	await ev((side) => window.__H.press(side), side);
	await idle();
	check(`put down from ${side}`, (await ev((side) => window.__H.held(side), side)) === null, JSON.stringify((await snap()).actions));
};
/** Back where it stood at the start (`dx`, `dz`: so far from there, for a long thing whose origin is one end). */
const putBack = async (name, side, dx = 0, dz = 0) => {
	const r = await ev((n) => window.__H.rest(n), name);
	await putDown([r[0] + dx, BENCH, r[2] + dz], side);
};
const wheel = async (delta, times = 1) => {
	for (let i = 0; i < times; i++) {
		await ev((d) => window.__H.wheel(d), delta);
		await wait(30);
	}
};
/**
 * The mean colour of the scene in a small square round a world point, sRGB 0..255: read from a frame the test draws
 * then and there, not from the window, which a headless Chrome stops repainting when the display sleeps.
 */
const colourAt = (p, half = 7) =>
	ev(
		async ([p, half]) => {
			const [x, y] = window.__H.at(p);
			const img = new Image();
			img.src = window.__H.canvas();
			await img.decode();
			const k = img.width / innerWidth;
			const c = document.createElement('canvas');
			c.width = c.height = Math.round(half * 2 * k);
			const g = c.getContext('2d');
			g.drawImage(img, -Math.round((x - half) * k), -Math.round((y - half) * k));
			const d = g.getImageData(0, 0, c.width, c.height).data;
			const sum = [0, 0, 0];
			for (let i = 0; i < d.length; i += 4) for (let k = 0; k < 3; k++) sum[k] += d[i + k];
			return sum.map((v) => Math.round(v / (d.length / 4)));
		},
		[p, half]
	);
/** How pink a colour is: red and blue over green. */
const pinkness = ([r, g, b]) => (r + b) / 2 - g;
const fmt = (v) => v.toFixed(2).replace('.', ',');

// ------------------------------------------------------------------------------------------------
const BENCH = (await ev(() => window.__H.rest('NaOHBeaker')))[1];
const TIP = (await state()).tip;
// the stopcock is aimed at by its handle, which is what a student sees
const COCK = await ev(() => window.__H.middle('BuretteCockHandle'));
await ev(() => window.__H.place());
await look('Burette', 0.05);
await wait(400);
await photo('banco');
await look('Burette', 0.3);
await photo('buretta');
let st = await state();
check('the unknown is between 0.052 and 0.0742 mol/L', st.cAcid >= 0.052 && st.cAcid <= 0.0742, `${st.cAcid}`);
check('the burette starts empty, the funnel in its mouth, the waste beaker under it', st.burette.level > 26 && st.funnelOn && st.column === null, JSON.stringify(st.burette));

// 1. goggles: they are further left than the hands reach from the burette
await ev(() => window.__H.place(-0.45));
await use('Goggles', OTHER, 'Indossa');
await idle();
await ev(() => window.__H.place());
check('goggles on, step 2', (await snap()).step === 1);

/** Sodium hydroxide into the burette, the funnel off, and the meniscus down onto the scale. */
const fillBurette = async (first) => {
	await ev(() => window.__H.place(-0.12));
	await grab('NaOHBeaker', SIDE, 0.03);
	await use('Burette', SIDE, 'Versa nella buretta', 0.3);
	await wait(2500);
	if (first) await photo('versa-nella-buretta');
	await idle(60);
	st = await state();
	check('burette filled above the zero', st.burette.level < 0 && st.burette.level >= -4.5, `level ${st.burette.level.toFixed(2)} mL, ${st.naoh.toFixed(0)} mL left in the beaker`);
	await putBack('NaOHBeaker', SIDE);
	await ev(() => window.__H.place());
	if (first) {
		// reading with the funnel on, or above the zero, is refused
		await look('Burette', 0.25);
		await ev(() => window.__H.key('L'));
		await wait(150);
		check('no reading above the zero', ((await snap()).message ?? '').includes('sopra lo zero') && !(await book()).open, (await snap()).message ?? '');
	}
	await grab('Funnel', SIDE, 0.03);
	await putDown([TIP[0] + 0.01, BENCH, TIP[2] + 0.16], SIDE);
	check('funnel off the burette', !(await state()).funnelOn);
	// the stopcock: open on the waste beaker until the meniscus is on the scale
	await look(COCK);
	const s0 = await snap();
	check('stopcock: wheel and one drop', s0.actions.some((a) => a.startsWith('W:')) && s0.actions.some((a) => a.includes('Una goccia')), JSON.stringify(s0.actions));
	await wheel(-120, 6);
	await wait(600);
	st = await state();
	check('stopcock open: the key turns, a free hand goes to it', st.opening > 0.6 && Math.abs(st.cockTurn) > 1 && (st.reaching.L || st.reaching.R), `opening ${st.opening.toFixed(2)}, turn ${st.cockTurn.toFixed(2)}, reaching ${JSON.stringify(st.reaching)}`);
	if (first) await photo('rubinetto-aperto');
	await until('level', 0.25, 20);
	await wheel(120, 10);
	await wait(900);
	st = await state();
	check('meniscus on the scale, stopcock shut, air out of the tip', st.opening === 0 && st.burette.level >= 0 && st.burette.level <= 5 && st.burette.air === 0, `level ${st.burette.level.toFixed(2)}, air ${st.burette.air}`);
	const want = st.tip[1] + st.zero - (st.burette.level / 25) * (st.zero - st.full);
	check('the column drawn is where the scale says', st.column !== null && Math.abs(st.column - want) < 0.0015, `${((st.column - want) * 1000).toFixed(2)} mm off`);
	check('hand back from the stopcock', !(await state()).reaching.L || !(await state()).reaching.R);
};

/** 25.0 mL of the sample into a flask, and two drops of indicator. */
const sample = async (n, first) => {
	await ev(() => window.__H.place(0.3));
	await grab('Pipette', SIDE);
	await ev(() => window.__H.place(-0.1));
	if (first) await refused('NaOHBeaker', SIDE, 'va nella buretta', 0.03);
	if (first) await refused(`Flask${n}`, SIDE, 'La pipetta è vuota', 0.05);
	await use('SampleBeaker', SIDE, 'Immergi nel campione', 0.03);
	await idle();
	check(`flask ${n}: pipette in the sample`, (await state()).drawing === SIDE);
	// up to a little under the mark, then by small steps
	for (let i = 0; i < 60 && (await state()).pipette < 24.2; i++) {
		await wheel(-120);
		await wait(320);
	}
	for (let i = 0; i < 80; i++) {
		const v = (await state()).pipette;
		if (Math.abs(v - 25) <= 0.06) break;
		await wheel(v < 25 ? -Math.min(30, Math.max(3, (25 - v) * 70)) : 6);
		await wait(260);
	}
	await wait(400);
	const lens = (await snap()).lens;
	check(`flask ${n}: meniscus on the mark`, lens && lens.ok, JSON.stringify(lens));
	if (first) await photo('pipetta-lente');
	await ev((side) => window.__H.key(side), SIDE);
	await idle();
	check(`flask ${n}: pipette holds 25.0 mL`, Math.abs((await state()).pipette - 25) <= 0.12 && (await state()).drawing === null, `${(await state()).pipette.toFixed(2)} mL`);
	await ev(() => window.__H.place(0.22));
	await use(`Flask${n}`, SIDE, `Svuota nella beuta ${n}`, 0.05);
	await wait(1500);
	if (first) await photo('pipetta-nella-beuta');
	await idle();
	st = await state();
	check(`flask ${n}: holds the sample`, Math.abs(st.flasks[n].vol - 25) <= 0.12 && Math.abs(st.flasks[n].acid - (st.flasks[n].vol * st.cAcid) / 1000) < 1e-9, `${st.flasks[n].vol.toFixed(2)} mL`);
	if (first) await refused(`Flask${n}`, SIDE, 'ha già il suo campione', 0.05);
	// a long thing is put down as the student stands: square to the bench, in front of where its middle goes
	await ev(() => window.__H.place(0.48));
	await putBack('Pipette', SIDE, 0.28, 0);
	await ev(() => window.__H.place(0.22));
	await grab('Indicator', SIDE, 0.02);
	for (let i = 0; i < 2; i++) {
		await use(`Flask${n}`, SIDE, 'Aggiungi una goccia', 0.05);
		if (first && i === 0) {
			await wait(900);
			await photo('contagocce');
		}
		await idle();
	}
	check(`flask ${n}: two drops of indicator`, (await state()).flasks[n].drops === 2, (await snap()).message ?? '');
	check(`flask ${n}: the drop falls into the mouth`, (await state()).dropAt < 0.012, `${((await state()).dropAt * 1000).toFixed(1)} mm from its middle`);
	await putBack('Indicator', SIDE);
};

/** What the notebook holds, and whether it is up. */
const book = () => ev(() => ({ open: window.__lab.notebook.open, readOnly: window.__lab.notebook.readOnly, values: { ...window.__lab.notebook.values }, marks: { ...window.__lab.notebook.marks }, hint: window.__lab.notebook.hint }));
/** Writes in a blank of the notebook as a student does: types, then Enter. */
const write = async (id, text) => {
	await page.fill(`[data-field="${id}"]`, text);
	await page.press(`[data-field="${id}"]`, 'Enter');
	await wait(120);
};
const closeBook = async () => {
	await page.keyboard.press('Escape');
	await wait(200);
};

/** Reads the burette as a student: looks at it, and writes the value in the notebook's table. */
const read = async (label, id, wrongFirst = false) => {
	st = await state();
	const y = st.zero - (st.burette.level / 25) * (st.zero - st.full);
	await look([st.tip[0], st.tip[1] + y, st.tip[2]]);
	const s0 = await snap();
	check(`${label}: the burette can be read`, s0.actions.some((a) => a.includes('Leggi il livello')), JSON.stringify(s0.actions));
	const before = await ev(() => {
		const { free, scene, notebook, work } = window.__lab;
		const shows = (window.__H.shows ??= []);
		if (!notebook.__wrapped) {
			const show = notebook.show.bind(notebook);
			notebook.show = (...a) => {
				shows.push(`show ${a.join(',')} open=${notebook.open}`);
				show(...a);
				shows.push(`shown open=${notebook.open}`);
			};
			notebook.__wrapped = true;
		}
		const info = { busy: free.busy, locked: scene.player.locked, open: notebook.open, offered: free.offered.map((u) => `${u.input}:${u.text}`), cannot: work.cannotRead(), held: [window.__H.held('L'), window.__H.held('R')] };
		window.__H.key('L');
		return { ...info, after: notebook.open, shows: shows.slice(-2) };
	});
	await wait(400);
	let b = await book();
	const focused = await ev(() => document.activeElement?.dataset?.field ?? null);
	check(`${label}: the notebook opens at the readings, the cursor in its blank, the lens on the scale`, b.open && !b.readOnly && focused === id && (await page.locator('#burette-lens').count()) === 1, `open ${b.open}, focus ${focused} · ${(await snap()).message} · ${JSON.stringify(before)} · closes ${await ev(() => window.__H.closes.length)}`);
	if (!b.open) return null;
	const target = Math.round(st.burette.level / 0.05) * 0.05;
	if (wrongFirst) {
		await write(id, fmt(target + 0.3));
		b = await book();
		check(`${label}: a wrong reading is not taken`, b.marks[id] === 'wrong' && b.hint.length > 0 && (await state()).runs.every((r) => r.vi === null), b.hint);
	}
	await write(id, fmt(target));
	b = await book();
	check(`${label}: the value written is taken, in ink`, b.marks[id] === 'ok' && (await page.isDisabled(`[data-field="${id}"]`)), `${b.values[id]} for ${st.burette.level.toFixed(3)} · ${b.hint}`);
	await photo(`lettura-${label}`);
	await closeBook();
	check(`${label}: the notebook closes, the game goes on`, !(await book()).open && !(await snap()).busy);
	return target;
};

/** A flask under the burette, the first reading, the base in while a hand swirls, the last reading. */
const titrate = async (k, n, rough) => {
	await ev(() => window.__H.place());
	// the waste beaker out of the way, the flask in its place
	await grab('WasteBeaker', OTHER, 0.02);
	await putDown([TIP[0] - 0.17, BENCH, TIP[2] + 0.16], OTHER);
	if (k === 0) {
		await look(COCK);
		await wheel(-120, 2);
		await wait(200);
		check('nothing under the burette: the stopcock stays shut', (await state()).opening === 0 && ((await snap()).message ?? '').includes('Sotto la buretta'), (await snap()).message ?? '');
		await wait(1300);
	}
	await ev(() => window.__H.place(0.22));
	await grab(`Flask${n}`, SIDE, 0.06);
	await ev(() => window.__H.place());
	await use('Burette', SIDE, 'Metti sotto la buretta', 0.2);
	await idle();
	const at = await ev((n) => window.__H.pos(`Flask${n}`).toArray(), n);
	check(`run ${k + 1}: flask under the tip`, Math.hypot(at[0] - TIP[0], at[2] - TIP[2]) < 0.002 && TIP[1] - at[1] - 0.145 > 0.005, `${(Math.hypot(at[0] - TIP[0], at[2] - TIP[2]) * 1000).toFixed(1)} mm off, tip ${((TIP[1] - at[1] - 0.145) * 1000).toFixed(0)} mm over the mouth`);
	if (k === 0) {
		await look(COCK);
		await wheel(-120, 2);
		await wait(200);
		check('no first reading: the stopcock stays shut', (await state()).opening === 0 && ((await snap()).message ?? '').includes('volume iniziale'), (await snap()).message ?? '');
		await wait(1300);
	}
	const vi = await read(`iniziale-${k + 1}`, `vi${k + 1}`, k === 0);
	check(`run ${k + 1}: first reading in the notebook`, (await state()).runs[k].vi !== null && Math.abs((await state()).runs[k].vi - vi) < 1e-6);
	// a hand on the neck, swirling
	await use(`Flask${n}`, OTHER, 'Agita la beuta', 0.06);
	await ev((n) => window.__H.rec(`Flask${n}`), n);
	await idle();
	check(`run ${k + 1}: a hand swirls the flask`, (await state()).swirl === OTHER && (await ev((s) => window.__H.held(s), OTHER)) === `Flask${n}`);
	const s1 = await snap();
	check(`run ${k + 1}: while swirling, stop, one drop and the wheel`, s1.actions.some((a) => a.includes('Ferma la beuta')) && s1.actions.some((a) => a.includes('Una goccia')) && s1.actions.some((a) => a.startsWith('W:')), JSON.stringify(s1.actions));
	await look(`Flask${n}`, 0.03);
	// the liquid, on the side away from the hand that swirls
	const body = async () => {
		const p = await ev((n) => window.__H.pos(`Flask${n}`).toArray(), n);
		return [p[0] + (SIDE === 'R' ? 0.02 : -0.02), p[1] + 0.006, p[2] + 0.01];
	};
	const clear = await colourAt(await body());
	// the stopcock wide open, to a little before the end
	await wheel(-120, 8);
	await wait(1500);
	if (k === 0) await photo('filo-di-base');
	st = await state();
	check(`run ${k + 1}: the base runs, the level falls`, st.opening > 0.8 && st.flasks[n].titrant > 0.5 && st.runs[k].flask === n, `opening ${st.opening.toFixed(2)}, ${st.flasks[n].titrant.toFixed(2)} mL in`);
	await until('beyond', [n, rough ? -0.5 : -1.1], 40);
	if (rough) {
		// the trial: straight through the end point
		await until('beyond', [n, 0.35], 10);
		await ev((side) => window.__H.key(side), SIDE);
	} else {
		await ev((side) => window.__H.key(side), SIDE);
		await wait(300);
		check(`run ${k + 1}: shut with the key before the end point`, (await state()).opening === 0 && (await state()).over[n] < 0, `${(await state()).over[n].toFixed(2)} mL`);
		// near the end the pink stays longer
		await ev((side) => window.__H.key(side), SIDE);
		await wait(250);
		const cloudy = await colourAt(await body());
		if (k === 1) await photo('nuvola-rosa');
		check(`run ${k + 1}: a drop gives a pink cloud that goes`, (await state()).flasks[n].fresh > 0 || pinkness(cloudy) > pinkness(clear) + 3, `rgb ${cloudy} against ${clear}`);
		// a drop at a time, each one swirled in
		for (let i = 0; i < 60; i++) {
			await until('mixed', n, 12);
			if ((await state()).over[n] > 0) break;
			await ev((side) => window.__H.key(side), SIDE);
			await wait(200);
		}
	}
	await until('mixed', n, 15);
	await wait(600);
	st = await state();
	const pink = await colourAt(await body());
	await photo(`viraggio-${k + 1}`);
	if (process.env.COVER && k === 1) fs.writeFileSync(`${OUT}/cover.png`, Buffer.from((await ev(() => window.__H.canvas())).split(',')[1], 'base64'));
	check(`run ${k + 1}: ${rough ? 'past the end point, fuchsia' : 'end point within a drop, pale pink'}`, rough ? st.over[n] > 0.3 : st.over[n] > 0 && st.over[n] <= 0.0501, `${st.over[n].toFixed(3)} mL past`);
	check(`run ${k + 1}: the flask is pink on screen`, pinkness(pink) > pinkness(clear) + (rough ? 25 : 6), `rgb ${pink} (pinkness ${pinkness(pink).toFixed(0)}) against ${clear} (${pinkness(clear).toFixed(0)})`);
	check(`run ${k + 1}: the readout names the colour`, (await snap()).readouts.some((r) => r.includes(rough ? 'fucsia' : 'rosa pallido')), JSON.stringify((await snap()).readouts));
	const [far, low, trace] = await ev(() => window.__H.recEnd());
	if (process.env.TRACE) console.log('SWIRL mm', trace.slice(0, 90).join(' '), '…', trace.slice(-30).join(' '));
	// the neck is 16 mm wide inside: once the hand has it (the first half second, as the wrist settles), the tip is in it
	const steady = Math.max(...trace.slice(trace.findIndex((v) => v > 0) + 40)) / 1000;
	check(`run ${k + 1}: the tip stays over the mouth while swirling`, steady < 0.0135 && low > 0.002, `mouth up to ${(steady * 1000).toFixed(1)} mm from the tip (${(far * 1000).toFixed(1)} mm as the hand takes it), ${(low * 1000).toFixed(1)} mm under it`);
	await ev((side) => window.__H.key(side), OTHER);
	await idle();
	const back = await ev((n) => window.__H.pos(`Flask${n}`).toArray(), n);
	check(`run ${k + 1}: flask set down under the tip`, (await state()).swirl === null && Math.hypot(back[0] - TIP[0], back[2] - TIP[2]) < 0.002 && (await ev((s) => window.__H.held(s), OTHER)) === null);
	const vf = await read(`finale-${k + 1}`, `vf${k + 1}`);
	st = await state();
	check(`run ${k + 1}: titre in the notebook`, st.runs[k].vf !== null && Math.abs(st.runs[k].vf - st.runs[k].vi - st.flasks[n].titrant) <= 0.1001, `${fmt(st.runs[k].vf - st.runs[k].vi)} mL read, ${st.flasks[n].titrant.toFixed(3)} mL delivered`);
	// the flask back to its place, the waste beaker under the burette again (after the last one the bench is done)
	if (k === 2) return vf - vi;
	await grab(`Flask${n}`, SIDE, 0.06);
	await ev(() => window.__H.place(0.22));
	await putBack(`Flask${n}`, SIDE);
	await ev(() => window.__H.place());
	await grab('WasteBeaker', OTHER, 0.02);
	await use('Burette', OTHER, 'Metti sotto la buretta', 0.2);
	await idle();
	return vf - vi;
};

// 2. the burette
await fillBurette(true);
await until('step', 2, 4);
check('burette ready, step 3', (await snap()).step === 2, JSON.stringify(await snap()));
await look('Burette', 0.3);
await photo('buretta-pronta');

// 3. the sample
await sample(1, true);
await until('step', 3, 4);
check('sample ready, step 4', (await snap()).step === 3, JSON.stringify(await snap()));

// 4. the trial
const titres = [await titrate(0, 1, true)];
await until('step', 4, 4);
check('trial done, step 5', (await snap()).step === 4, JSON.stringify(await snap()));
// a titrated flask is not used again
await look('Flask1', 0.05);

// 5 and 6. the accurate ones: the funnel back in, the burette full again, a fresh flask
for (const [k, n] of [[1, 2], [2, 3]]) {
	await ev(() => window.__H.place());
	await grab(await ev(() => window.__H.middle('FunnelGlass')), SIDE);
	await look('Burette', 0.33);
	const s0 = await snap();
	check(`run ${k + 1}: the funnel goes back in the burette`, s0.actions.some((a) => a.includes("Metti l'imbuto") && !a.endsWith('(no)')), JSON.stringify(s0.actions));
	await ev((side) => window.__H.press(side), SIDE);
	await idle();
	check(`run ${k + 1}: funnel in the mouth`, (await state()).funnelOn);
	await fillBurette(false);
	await sample(n, false);
	titres.push(await titrate(k, n, false));
	await until('step', 4 + k, 4);
	check(`run ${k + 1} done, step ${5 + k}`, (await snap()).step === 4 + k, JSON.stringify(await snap()));
}

// 7. the sums, in the notebook: B, with both hands free
st = await state();
await grab('Indicator', SIDE, 0.02).catch(() => {});
await ev(() => window.__lab.free.toggleBook());
await wait(300);
check('with something in a hand the notebook is read only', (await book()).open && (await book()).readOnly && ((await snap()).message ?? '').includes('solo leggere'), (await snap()).message ?? '');
await photo('quaderno-sola-lettura');
await closeBook();
await putBack('Indicator', SIDE);
await ev(() => window.__lab.free.toggleBook());
await wait(300);
check('B with free hands: the notebook, to write in', (await book()).open && !(await book()).readOnly);
await page.click('button.rounded-t-lg:has-text("Strumenti")');
await wait(200);
await photo('quaderno-strumenti');
await page.click('button.rounded-t-lg:has-text("Procedimento")');
await wait(200);
await photo('quaderno-passi');
await page.click('button.rounded-t-lg:has-text("Letture")');
await wait(200);
const used = st.runs.map((r) => r.vf - r.vi);
await write('v1', fmt(used[0] + 1));
check('a wrong difference is marked', (await book()).marks.v1 === 'wrong', (await book()).hint);
for (let n = 0; n < 3; n++) await write(`v${n + 1}`, fmt(used[n]));
await write('media', fmt((used[1] + used[2]) / 2));
const mean = Number(((used[1] + used[2]) / 2).toFixed(2));
const c = Number(((0.1 * mean) / 25).toFixed(4));
await write('conc', c.toFixed(4).replace('.', ','));
await photo('quaderno-letture-e-calcoli');
let b = await book();
check('the sums are taken', ['v1', 'v2', 'v3', 'media', 'conc'].every((id) => b.marks[id] === 'ok'), JSON.stringify(b.marks) + ' ' + b.hint);
await page.click('button.rounded-t-lg:has-text("Appunti")');
await wait(200);
await page.fill('[data-field="appunti1"]', 'Il rosa pallido resta: viraggio.\nSeconda e terza concordano.');
await photo('quaderno-appunti');
check('free notes are kept', (await book()).values.appunti1.includes('viraggio'));
await wait(600);
const end = await snap();
check('experiment done', end.done, JSON.stringify(end));
await wait(600);
await page.click('button.rounded-t-lg:has-text("Procedimento")').catch(() => {});
await wait(300);
await photo('risultati');
st = await state();
const report = await ev(() => window.__H.notes());
check('accurate titres agree', Math.abs(titres[1] - titres[2]) <= 0.2001, titres.map(fmt).join(' · '));
check('concentration within 1% of the unknown', Math.abs(c - st.cAcid) / st.cAcid < 0.01, `${c.toFixed(4)} against ${st.cAcid}`);
check('the notebook has the table and the notes', report && report.rows.length === 6 && report.rows[4][1].includes(c.toFixed(4).replace('.', ',')) && report.notes.some((x) => x.text.includes('concordano')) && report.notes.some((x) => !x.good && x.text.includes('sbagliata')) && report.notes.some((x) => !x.good && x.text.includes('calcolo')), JSON.stringify(report));

check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
const bad = checks.filter((c) => !c.ok);
fs.writeFileSync(`${OUT}/controlli-${ROOM}-${SIDE}.json`, JSON.stringify({ room: ROOM, side: SIDE, seed: SEED, cAcid: st.cAcid, titres, checks }, null, 1));
console.log(`\n${checks.length - bad.length} su ${checks.length} controlli a posto (${ROOM}, strumenti nella mano ${SIDE})`);
await browser.close();
process.exit(bad.length ? 1 : 0);
