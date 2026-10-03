/*
 * The lab's "use" animations, recorded and measured: each action a hand does with what it holds (the pipette in the
 * acid, the lighter at the burner, the thermometer in the beaker…), with the left and the right hand, in a room. For
 * each it saves the frames the student would see and writes what can be measured: how far the tool's tip is from
 * where it works, how far the hand is left from the pose asked of it (the wrist's limits), how much was poured.
 *
 *   npm run dev, then: node scripts/lab/usi.mjs <out dir> [banco|aula] [L|R|LR] [action,action…]
 *   LAB_URL sets the server (default http://localhost:3000). scripts/lab/usi_sheets.py makes a sheet per action.
 */
import { chromium } from 'playwright';
import fs from 'fs';

const OUT = process.argv[2];
const ROOM = process.argv[3] ?? 'banco';
const SIDES = (process.argv[4] ?? 'LR').split('');
const ONLY = process.argv[5] ? process.argv[5].split(',') : null;
const BASE = process.env.LAB_URL ?? 'http://localhost:3000';
if (!OUT) throw new Error('usage: node scripts/lab/usi.mjs <out dir> [banco|aula] [L|R|LR] [actions]');
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--use-angle=metal', '--enable-gpu'] });
const page = await browser.newPage({ viewport: { width: 960, height: 600 }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.log('pageerror', e.message));
await page.goto(`${BASE}/laboratorio/chimica/solfato-di-rame?stanza=${ROOM}&qualita=leggera`, { timeout: 240000 });
await page.click('button:has-text("Rifiuta")', { timeout: 4000 }).catch(() => {});
await page.waitForSelector('text=Clicca per entrare', { timeout: 180000 });
await page.click('button:has-text("Rifiuta")', { timeout: 2000 }).catch(() => {});
await page.click('text=Clicca per entrare');
await page.waitForFunction(() => window.__lab?.scene, null, { timeout: 60000 });
await page.waitForTimeout(1500);

// helpers in the page: the state is set directly, the actions are the game's own
await page.evaluate(() => {
	const { scene: s, work: w } = window.__lab;
	const f = w.free;
	const V = s.gauzeCenter.constructor;
	const Q = s.camera.quaternion.constructor;
	s.player.locked = true;
	s.onLock(true);
	const liquids0 = new Map([...s.liquids].map(([n, l]) => [n, { ...l.contents }]));
	const H = (window.__H = { V, Q });
	H.node = (n) => s.nodes.get(n);
	H.pos = (n) => (typeof n === 'string' ? s.nodes.get(n).getWorldPosition(new V()) : new V(...n));
	H.other = (side) => (side === 'L' ? 'R' : 'L');
	/** Everything back where it was, the hands empty, the goggles on. */
	H.reset = () => {
		for (const side of ['L', 'R']) {
			const n = s.hands.held(side);
			if (n) s.hands.drop(side, n.position, n.quaternion);
		}
		s.held.clear();
		for (const [name, pose] of s.rest) {
			const n = s.nodes.get(name);
			if (n.parent !== s.labRoot) s.labRoot.attach(n);
			n.position.copy(pose.position);
			n.quaternion.copy(pose.quaternion);
			n.updateMatrixWorld(true);
			delete n.userData.partOf;
		}
		const sheet = s.nodes.get('FilterPaperSheet');
		if (sheet?.morphTargetInfluences) sheet.morphTargetInfluences[0] = 0;
		for (const [n, c] of liquids0) Object.assign(s.liquids.get(n).contents, c);
		Object.assign(w, { goggles: true, loaded: false, gasOpen: false, lit: false, drawing: null, measured: false, poured: false, gas: 0.6, air: 0.5 });
		s.nodes.get('Goggles').visible = false;
		s.nodes.get('SpatulaPowder').visible = false;
		s.nodes.get('GasTapHandle').rotation.y = 0;
	};
	H.onGauze = (name) => {
		const n = s.nodes.get(name);
		n.position.set(s.gauzeCenter.x, s.gauzeTop, s.gauzeCenter.z);
		n.updateMatrixWorld(true);
	};
	/** A free place on the bench, right of the gauze as the student faces it and towards the student. */
	H.aside = (name, dx, dz) => {
		const yaw = s.player.home.yaw;
		const n = s.nodes.get(name);
		const rest = s.rest.get(name);
		n.position.set(s.gauzeCenter.x + Math.cos(yaw) * dx + Math.sin(yaw) * dz, rest.position.y, s.gauzeCenter.z - Math.sin(yaw) * dx + Math.cos(yaw) * dz);
		n.updateMatrixWorld(true);
	};
	H.fill = (name, vol, more = {}) => Object.assign(s.liquids.get(name).contents, { vol, ...more });
	/** In front of a thing, `back` metres from it the way the student faces the bench, looking at it. */
	H.stand = (target, back = 0.62, dx = 0) => {
		const t = H.pos(target);
		const yaw = s.player.home.yaw;
		s.player.position.x = t.x + Math.sin(yaw) * back + Math.cos(yaw) * dx;
		s.player.position.z = t.z + Math.cos(yaw) * back - Math.sin(yaw) * dx;
		s.player.lookAt(t);
		s.player.settleHands();
	};
	H.grab = (side, name) => f.run(() => f.grab(side, s.nodes.get(name)));
	H.busy = () => f.busy;
	// one sample a frame while an action is recorded
	let rec = null;
	const prev = s.onUpdate;
	s.onUpdate = (dt) => {
		prev(dt);
		if (!rec) return;
		const tool = s.nodes.get(rec.tool);
		tool.updateMatrixWorld(true);
		const p = tool.getWorldPosition(new V());
		const ax = new V(0, 1, 0).applyQuaternion(tool.getWorldQuaternion(new Q()));
		// where the tool's local -Z looks: the way a spatula's scoop opens
		const open = new V(0, 0, -1).applyQuaternion(tool.getWorldQuaternion(new Q()));
		const out = { t: (rec.t += dt), p: p.toArray(), ax: ax.toArray(), open: open.toArray(), miss: s.avatar.miss(rec.side), busy: f.busy, flame: s.lighterFlame.gas, loaded: w.loaded, powder: s.powder.mesh.count, lit: w.lit };
		// the tip's correction while a tool works (hands.ts, exact)
		const hs = s.hands.h[rec.side];
		out.fix = hs.fix ? hs.fix.length() : 0;
		out.exact = !!hs.exact;
		if (rec.into) {
			// the tip in the container's own frame, and its room to the wall there
			const c = s.nodes.get(rec.into);
			c.updateMatrixWorld(true);
			const l = p.clone().applyMatrix4(c.matrixWorld.clone().invert());
			const prof = s.liquids.get(rec.into)?.profile;
			out.local = l.toArray();
			out.top = prof?.top ?? null;
			out.clear = prof && l.y >= prof.bottom && l.y <= prof.top ? prof.radiusAt(l.y) - Math.hypot(l.x, l.z) : null;
			out.vol = s.liquids.get(rec.into)?.contents.vol ?? null;
		}
		rec.samples.push(out);
	};
	H.record = (side, tool, into) => (rec = { side, tool, into, t: 0, samples: [] });
	H.stop = () => {
		const r = rec;
		rec = null;
		return r.samples;
	};
});

const wait = (ms) => page.waitForTimeout(ms);
const idle = async (max = 40000) => {
	await wait(120);
	await page.waitForFunction(() => !window.__H.busy(), null, { timeout: max });
	await wait(150);
};
const r3 = (v) => Math.round(v * 1000) / 1000;
const hyp = (a, b = 0) => Math.hypot(a, b);

/**
 * The actions. `setup` puts the bench in the state the action starts from (in the page, with the side), `run` starts
 * it, `tool` is what the hand holds and `into` the container it works in; `measure` reads the samples.
 */
const ACTIONS = {
	dip: {
		tool: 'Pipette', into: 'AcidBeaker',
		setup: async (side) => { await page.evaluate((side) => { const H = window.__H; H.stand('AcidBeaker'); return H.grab(side, 'Pipette'); }, side); },
		run: (side) => page.evaluate((side) => { const { work: w } = window.__lab; void w.free.run(() => w.dip(side)); }, side),
		after: async () => { await wait(900); },
		measure: (s) => { const e = s.at(-1); return { tipOffAxis: r3(hyp(e.local[0], e.local[2])), tipHeight: r3(e.local[1]), want: 'on the axis, 0.004 up', ok: hyp(e.local[0], e.local[2]) < 0.008 && e.local[1] < 0.02 }; }
	},
	lift: {
		tool: 'Pipette', into: 'AcidBeaker', keep: true,
		setup: async () => { await page.evaluate(() => { const { scene: s } = window.__lab; const pip = s.liquids.get('Pipette'); pip.contents.add(s.liquids.get('AcidBeaker').contents.take(25 - pip.contents.vol)); }); await wait(200); },
		run: () => page.evaluate(() => { const { work: w } = window.__lab; void w.free.run(() => w.confirmDraw()); }),
		measure: () => ({ ok: true })
	},
	drain: {
		tool: 'Pipette', into: 'Beaker', keep: true,
		setup: async () => { await page.evaluate(() => window.__H.stand('Beaker')); await wait(500); },
		run: (side) => page.evaluate((side) => { const { work: w, scene: s } = window.__lab; void w.free.run(() => w.drain(side, s.nodes.get('Beaker'))); }, side),
		measure: (s) => { const d = s.filter((x, i) => i > 0 && x.vol > s[i - 1].vol + 1e-6); const off = Math.max(...d.map((x) => hyp(x.local[0], x.local[2]))); const clear = Math.min(...d.map((x) => x.clear ?? -1)); return { draining: d.length, tipOffAxisMax: r3(off), clearMin: r3(clear), want: 'tip inside, by the wall', ok: d.length > 0 && clear > 0 }; }
	},
	thermo: {
		tool: 'Thermometer', into: 'Beaker',
		setup: async (side) => { await page.evaluate((side) => { const H = window.__H; H.onGauze('Beaker'); H.fill('Beaker', 25); H.stand('Beaker'); return H.grab(side, 'Thermometer'); }, side); },
		run: (side) => page.evaluate((side) => { const { work: w, scene: s } = window.__lab; void w.free.run(() => w.thermometerInto(side, s.nodes.get('Beaker'))); }, side),
		measure: (s) => { const band = s.filter((x) => x.busy && x.clear !== null && hyp(x.local[0], x.local[2]) < 0.06); const through = band.length ? Math.min(...band.map((x) => x.clear)) : 0; const e = s.at(-1); return { clearMinOnTheWay: r3(through), endOffAxis: r3(hyp(e.local[0], e.local[2])), endHeight: r3(e.local[1]), want: 'never through the glass', ok: through > -0.002 }; }
	},
	thermoHeld: {
		tool: 'Thermometer', into: 'Beaker',
		setup: async (side) => { await page.evaluate(async (side) => { const H = window.__H; H.fill('Beaker', 25); H.stand('Beaker', 0.75); await H.grab(H.other(side), 'Beaker'); await H.grab(side, 'Thermometer'); }, side); },
		run: (side) => page.evaluate((side) => { const { work: w, scene: s } = window.__lab; void w.free.run(() => w.thermometerInto(side, s.nodes.get('Beaker'))); }, side),
		measure: (s) => { const band = s.filter((x) => x.busy && x.clear !== null && hyp(x.local[0], x.local[2]) < 0.06); const through = band.length ? Math.min(...band.map((x) => x.clear)) : 0; const e = s.at(-1); return { clearMinOnTheWay: r3(through), endOffAxis: r3(hyp(e.local[0], e.local[2])), want: 'never through the glass', ok: through > -0.002 }; }
	},
	strike: {
		tool: 'Lighter', into: null,
		setup: async (side) => { await page.evaluate((side) => { const H = window.__H; const { work: w } = window.__lab; w.gasOpen = true; w.air = 0; H.stand('Bunsen'); return H.grab(side, 'Lighter'); }, side); },
		run: (side) => page.evaluate((side) => { const { work: w } = window.__lab; void w.free.run(() => w.strike(side)); }, side),
		measure: (s, ctx) => { const on = s.filter((x) => x.flame > 0); const d = on.map((x) => Math.hypot(x.p[0] - ctx.anchor[0], x.p[1] - ctx.anchor[1], x.p[2] - ctx.anchor[2])); return { sparkFrames: on.length, nozzleToBurnerMax: r3(Math.max(...d)), nozzleBelowBurner: r3(Math.max(...on.map((x) => ctx.anchor[1] - x.p[1]))), lit: s.at(-1).lit, want: 'nozzle within 3 cm of the burner mouth', ok: on.length > 0 && Math.max(...d) < 0.03 && s.at(-1).lit }; }
	},
	scoop: {
		tool: 'Spatula', into: 'CuOJar',
		setup: async (side) => { await page.evaluate((side) => { const H = window.__H; H.stand('CuOJar'); return H.grab(side, 'Spatula'); }, side); },
		run: (side) => page.evaluate((side) => { const { work: w } = window.__lab; void w.free.run(() => w.scoop(side)); }, side),
		// the jar has no liquid of its own: its mouth is 0.023 wide inside and 0.079 high, the powder's top at 0.044
		measure: (s) => { const lo = s.reduce((a, x) => (x.local[1] < a.local[1] ? x : a)); const inside = s.filter((x) => x.local[1] < 0.079 && hyp(x.local[0], x.local[2]) < 0.06); const off = inside.length ? Math.max(...inside.map((x) => hyp(x.local[0], x.local[2]))) : null; return { lowestHeight: r3(lo.local[1]), offAxisInsideMax: off === null ? null : r3(off), loaded: s.at(-1).loaded, heldTipDrop: r3(s.at(-1).ax[1]), heldOpenUp: r3(s.at(-1).open[1]), want: 'the scoop goes down to the powder (0.044), inside the mouth (0.023); held full it is level, open upwards', ok: lo.local[1] < 0.05 && off !== null && off < 0.02 && s.at(-1).ax[1] < 0.03 && s.at(-1).open[1] > 0.95 }; }
	},
	dump: {
		tool: 'Spatula', into: 'Beaker', keep: true,
		setup: async () => { await page.evaluate(() => { const H = window.__H; H.onGauze('Beaker'); H.fill('Beaker', 25); H.stand('Beaker'); }); await wait(500); },
		run: (side) => page.evaluate((side) => { const { work: w, scene: s } = window.__lab; void w.free.run(() => w.dump(side, s.nodes.get('Beaker'))); }, side),
		measure: (s) => { const i = s.findIndex((x) => x.powder > 0); const x = s[Math.max(0, i)]; const deg = (v) => Math.round((Math.acos(Math.max(-1, Math.min(1, v))) * 180) / Math.PI); const turn = Math.max(...s.map((y) => deg(y.open[1]))); const wander = Math.max(...s.filter((y) => deg(y.open[1]) > 20).map((y) => hyp(y.local[0], y.local[2]))); return { powderAt: i, offAxis: r3(hyp(x.local[0], x.local[2])), above: r3(x.local[1] - x.top), turnMax: turn, turnAtPowder: deg(x.open[1]), scoopWander: r3(wander), want: 'over the mouth (radius 0.026), turned over past 100° about its own axis', ok: i >= 0 && hyp(x.local[0], x.local[2]) < 0.02 && x.local[1] > x.top - 0.005 && turn > 100 && wander < 0.02 }; }
	},
	scoopHeld: {
		tool: 'Spatula', into: 'CuOJar',
		setup: async (side) => { await page.evaluate((side) => { const H = window.__H; H.stand('CuOJar'); return H.grab(side, 'Spatula'); }, side); await idle(); await page.evaluate((side) => window.__H.grab(window.__H.other(side), 'CuOJar'), side); },
		run: (side) => page.evaluate((side) => { const { work: w } = window.__lab; void w.free.run(() => w.scoop(side)); }, side),
		measure: (s) => { const lo = s.reduce((a, x) => (x.local[1] < a.local[1] ? x : a)); const inside = s.filter((x) => x.local[1] < 0.079 && hyp(x.local[0], x.local[2]) < 0.035); const off = inside.length ? Math.max(...inside.map((x) => hyp(x.local[0], x.local[2]))) : null; return { lowestHeight: r3(lo.local[1]), offAxisInsideMax: off === null ? null : r3(off), loaded: s.at(-1).loaded, want: 'as scoop, the jar in the other hand (tipped: only what is within the wall counts as inside)', ok: lo.local[1] < 0.07 && lo.local[1] > 0 && off !== null && off < 0.02 && s.at(-1).loaded }; }
	},
	dumpHeld: {
		tool: 'Spatula', into: 'Beaker', keep: true,
		setup: async (side) => { await page.evaluate((side) => { const H = window.__H; const { scene: s } = window.__lab; const o = H.other(side); const n = s.hands.held(o); if (n) { const rest = s.rest.get(n.name); s.hands.drop(o, rest.position, rest.quaternion); s.held.delete(n); } H.fill('Beaker', 25); return H.grab(o, 'Beaker'); }, side); await idle(); },
		run: (side) => page.evaluate((side) => { const { work: w, scene: s } = window.__lab; void w.free.run(() => w.dump(side, s.nodes.get('Beaker'))); }, side),
		measure: (s) => { const i = s.findIndex((x) => x.powder > 0); const x = s[Math.max(0, i)]; const deg = (v) => Math.round((Math.acos(Math.max(-1, Math.min(1, v))) * 180) / Math.PI); const turn = Math.max(...s.map((y) => deg(y.open[1]))); return { powderAt: i, offAxis: r3(hyp(x.local[0], x.local[2])), above: r3(x.local[1] - x.top), turnMax: turn, want: 'as dump, the beaker in the other hand', ok: i >= 0 && hyp(x.local[0], x.local[2]) < 0.02 && x.local[1] > x.top - 0.005 && turn > 100 }; }
	},
	stir: {
		tool: 'GlassRod', into: 'Beaker',
		setup: async (side) => { await page.evaluate((side) => { const H = window.__H; H.onGauze('Beaker'); H.fill('Beaker', 25); H.stand('Beaker'); return H.grab(side, 'GlassRod'); }, side); },
		run: (side) => page.evaluate((side) => { const { work: w, scene: s } = window.__lab; void w.free.run(() => w.free.stir(side, s.nodes.get('Beaker'), 2)); }, side),
		measure: (s) => { const inside = s.filter((x) => x.clear !== null && hyp(x.local[0], x.local[2]) < 0.06); const clear = Math.min(...inside.map((x) => x.clear)); const low = Math.min(...inside.map((x) => x.local[1])); return { framesInside: inside.length, clearMin: r3(clear), lowest: r3(low), want: 'the tip circles inside the glass, near the bottom', ok: inside.length > 20 && clear > 0 && low < 0.012 }; }
	},
	stirHeld: {
		tool: 'GlassRod', into: 'Beaker',
		setup: async (side) => { await page.evaluate(async (side) => { const H = window.__H; H.fill('Beaker', 25); H.stand('Beaker', 0.75); await H.grab(H.other(side), 'Beaker'); await H.grab(side, 'GlassRod'); }, side); },
		run: (side) => page.evaluate((side) => { const { work: w, scene: s } = window.__lab; void w.free.run(() => w.free.stir(side, s.nodes.get('Beaker'), 2)); }, side),
		measure: (s) => { const inside = s.filter((x) => x.clear !== null && hyp(x.local[0], x.local[2]) < 0.06); const clear = inside.length ? Math.min(...inside.map((x) => x.clear)) : -1; const low = inside.length ? Math.min(...inside.map((x) => x.local[1])) : 1; return { framesInside: inside.length, clearMin: r3(clear), lowest: r3(low), want: 'the tip circles inside the glass, near the bottom', ok: inside.length > 20 && clear > 0 && low < 0.012 }; }
	},
	fold: {
		tool: 'FilterPaper', into: 'Funnel',
		setup: async (side) => { await page.evaluate((side) => { const H = window.__H; H.stand('Funnel'); return H.grab(side, 'FilterPaper'); }, side); },
		run: (side) => page.evaluate((side) => { const { work: w, scene: s } = window.__lab; void w.free.run(() => w.fold(side, s.nodes.get('Funnel'))); }, side),
		measure: (s, ctx) => ({ parent: ctx.end.paperParent, endOffAxis: r3(hyp(s.at(-1).local[0], s.at(-1).local[2])), want: 'the paper ends in the funnel', ok: ctx.end.paperParent === 'Funnel' })
	},
	pourFunnel: {
		tool: 'Beaker', into: 'Funnel', keep: true,
		setup: async (side) => { await page.evaluate((side) => { const H = window.__H; H.fill('Beaker', 25); H.stand('Funnel'); return H.grab(side, 'Beaker'); }, side); },
		run: (side) => page.evaluate((side) => { const { work: w, scene: s } = window.__lab; void w.free.run(() => w.pourInto(side, s.nodes.get('Funnel'))); }, side),
		measure: (s, ctx) => ({ left: r3(ctx.end.vols.Beaker), streamMissMax: r3(ctx.end.pourMiss), want: 'the beaker empties into the funnel', ok: ctx.end.vols.Beaker < 2 })
	},
	pourDish: {
		tool: 'ConicalFlask', into: 'EvapDish',
		setup: async (side) => { await page.evaluate((side) => { const H = window.__H; H.aside('Funnel', 0.55, 0.3); H.onGauze('EvapDish'); H.fill('ConicalFlask', 25); H.stand('EvapDish'); return H.grab(side, 'ConicalFlask'); }, side); },
		run: (side) => page.evaluate((side) => { const { work: w, scene: s } = window.__lab; void w.free.run(() => w.pourInto(side, s.nodes.get('EvapDish'))); }, side),
		measure: (s, ctx) => ({ left: r3(ctx.end.vols.ConicalFlask), inDish: r3(ctx.end.vols.EvapDish), streamMissMax: r3(ctx.end.pourMiss), want: 'the flask empties into the dish', ok: ctx.end.vols.ConicalFlask < 2 })
	},
	pourHeld: {
		tool: 'Beaker', into: 'AcidBeaker',
		setup: async (side) => { await page.evaluate(async (side) => { const H = window.__H; H.fill('Beaker', 20); H.fill('AcidBeaker', 5); H.stand('Beaker', 0.75); await H.grab(H.other(side), 'AcidBeaker'); await H.grab(side, 'Beaker'); }, side); },
		run: (side) => page.evaluate((side) => { const { work: w, scene: s } = window.__lab; void w.free.run(async () => void (await w.free.pour(side, s.nodes.get('AcidBeaker')))); }, side),
		measure: (s, ctx) => ({ left: r3(ctx.end.vols.Beaker), streamMissMax: r3(ctx.end.pourMiss), want: 'one hand pours into the other', ok: ctx.end.vols.Beaker < 19 })
	}
};

const results = [];
for (const side of SIDES) {
	for (const [name, a] of Object.entries(ACTIONS)) {
		if (ONLY && !ONLY.includes(name)) continue;
		if (!a.keep) await page.evaluate(() => window.__H.reset());
		await wait(300);
		await a.setup(side);
		await idle();
		await wait(350);
		const tag = `${ROOM}-${side}-${name}`;
		const ctx = { anchor: await page.evaluate(() => window.__lab.scene.worldOf('FlameAnchor').toArray()) };
		await page.evaluate(([side, tool, into]) => window.__H.record(side, tool, into), [side, a.tool, a.into]);
		await page.screenshot({ path: `${OUT}/${tag}-00.png` });
		await a.run(side);
		let n = 1;
		const t0 = Date.now();
		for (;;) {
			await wait(170);
			await page.screenshot({ path: `${OUT}/${tag}-${String(n++).padStart(2, '0')}.png` });
			if (!(await page.evaluate(() => window.__H.busy())) || Date.now() - t0 > 30000) break;
		}
		if (a.after) await a.after();
		await page.screenshot({ path: `${OUT}/${tag}-${String(n++).padStart(2, '0')}.png` });
		const samples = await page.evaluate(() => window.__H.stop());
		ctx.end = await page.evaluate(() => { const { scene: s, work: w } = window.__lab; return { paperParent: s.nodes.get('FilterPaper').parent.name, pourMiss: w.free.pourMiss, vols: Object.fromEntries([...s.liquids].map(([k, l]) => [k, l.contents.vol])), msg: w.free.getSnapshot().message?.text ?? null }; });
		let m;
		try { m = a.measure(samples, ctx); } catch (e) { m = { ok: false, error: String(e) }; }
		// how far the hand was left from the pose asked of it, once the action is under way
		const miss = samples.filter((x) => x.busy && x.t > 0.6).map((x) => x.miss);
		const row = { room: ROOM, side, action: name, frames: n, seconds: r3(samples.at(-1)?.t ?? 0), handMissMax: r3(Math.max(0, ...miss)), handMissMean: r3(miss.reduce((s, v) => s + v, 0) / Math.max(1, miss.length)), ...m, msg: ctx.end.msg };
		results.push(row);
		if (process.env.TRACE) for (let i = 0; i < samples.length; i += Number(process.env.TRACE)) { const x = samples[i]; console.log('  ', x.t.toFixed(2), 'local', (x.local ?? x.p).map((v) => v.toFixed(3)).join(' '), 'ax', x.ax.map((v) => v.toFixed(2)).join(' '), 'miss', x.miss.toFixed(3), 'fix', x.fix.toFixed(3), x.exact ? 'exact' : '', x.powder ? 'powder' : '', x.clear != null ? 'clear ' + x.clear.toFixed(3) : ''); }
		console.log(JSON.stringify(row));
	}
}
fs.writeFileSync(`${OUT}/misure-${ROOM}-${SIDES.join('')}${ONLY ? '-' + ONLY.join('+') : ''}.json`, JSON.stringify(results, null, 1));
await browser.close();
