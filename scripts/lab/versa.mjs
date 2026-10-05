/*
 * What a pour leaves behind: each container poured into each other, with either hand, the other one held or standing
 * on the bench. For each it prints what is left in the source, what arrived, and how the pour ended: the tilt reached,
 * the tilt the container really had (the wrist's limits), the level against the lip at the end.
 *
 *   npm run dev, then: node scripts/lab/versa.mjs [banco|aula]      LAB_URL sets the server.
 */
import { chromium } from 'playwright';

const ROOM = process.argv[2] ?? 'banco';
const BASE = process.env.LAB_URL ?? 'http://localhost:3000';
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

await page.evaluate(() => {
	const { scene: s, work: w } = window.__lab;
	const f = w.free;
	const V = s.gauzeCenter.constructor;
	s.player.locked = true;
	s.onLock(true);
	const H = (window.__H = {});
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
		}
		for (const [, l] of s.liquids) if (!l.fixed) Object.assign(l.contents, { vol: 0, acid: 0, cu: 0, solid: 0 });
		w.goggles = true;
	};
	H.stand = (name, back = 0.62) => {
		const t = s.nodes.get(name).getWorldPosition(new V());
		const yaw = s.player.home.yaw;
		s.player.position.x = t.x + Math.sin(yaw) * back;
		s.player.position.z = t.z + Math.cos(yaw) * back;
		s.player.lookAt(t);
		s.player.settleHands();
	};
	H.grab = (side, name) => f.run(() => f.grab(side, s.nodes.get(name)));
	H.busy = () => f.busy;
	let rec = null;
	const prev = s.onUpdate;
	s.onUpdate = (dt) => {
		prev(dt);
		if (!rec) return;
		const n = s.nodes.get(rec.from);
		const l = s.liquids.get(rec.from);
		n.updateMatrixWorld(true);
		// the container's real tilt, and the lowest point of its rim against the liquid's level
		const e = n.matrixWorld.elements;
		const tilt = (Math.acos(Math.max(-1, Math.min(1, e[5] / Math.hypot(e[4], e[5], e[6])))) * 180) / Math.PI;
		rec.samples.push({ t: (rec.t += dt), tilt, vol: l.contents.vol, level: l.level(), miss: s.avatar.miss(rec.side), trace: f.pourTrace.length ? f.pourTrace[f.pourTrace.length - 1] : null });
	};
	H.pour = (side, from, to) => {
		rec = { side, from, t: 0, samples: [] };
		return f.run(() => f.pour(side, s.nodes.get(to)));
	};
	H.stop = () => {
		const r = rec;
		rec = null;
		return r.samples;
	};
	H.state = (a, b) => ({ a: s.liquids.get(a).contents.vol, b: s.liquids.get(b).contents.vol, capA: s.liquids.get(a).capacity, capB: s.liquids.get(b).capacity });
	H.fill = (name, vol) => (s.liquids.get(name).contents.vol = vol);
});

const idle = async (max = 60000) => {
	await page.waitForTimeout(150);
	await page.waitForFunction(() => !window.__H.busy(), null, { timeout: max });
	await page.waitForTimeout(150);
};
const r = (v, d = 2) => Math.round(v * 10 ** d) / 10 ** d;

const NAMES = ['Beaker', 'AcidBeaker', 'ConicalFlask'];
const ONLY = process.argv[3] ? process.argv[3].split(',') : null;
const FILL = { Beaker: 60, AcidBeaker: 30, ConicalFlask: 60 };
for (const from of NAMES)
	for (const to of [...NAMES, 'EvapDish'])
		for (const side of ['R', 'L'])
			for (const held of [true, false]) {
				if (from === to) continue;
				if (held && to === 'EvapDish') continue;
				if (ONLY && !ONLY.includes(`${from}>${to}`)) continue;
				await page.evaluate(
					({ from, to, side, vol }) => {
						const H = window.__H;
						H.reset();
						H.fill(from, vol);
						H.stand(to, 0.55);
						H.grab(side, from);
						return null;
					},
					{ from, to, side, vol: FILL[from] }
				);
				await idle();
				if (held) {
					await page.evaluate(({ to, side }) => window.__H.grab(side === 'R' ? 'L' : 'R', to), { to, side });
					await idle();
				}
				await page.evaluate(({ from, to, side }) => void window.__H.pour(side, from, to), { from, to, side });
				await idle(90000);
				const out = await page.evaluate(({ from, to }) => ({ samples: window.__H.stop(), ...window.__H.state(from, to) }), { from, to });
				const S = out.samples;
				const maxTilt = Math.max(...S.map((x) => x.tilt));
				const asked = Math.max(...S.map((x) => (x.trace ? x.trace[3] : 0))) * (180 / Math.PI);
				if (process.env.TRACE) {
					const T = S.filter((x) => x.trace);
					const step = Math.max(1, Math.floor(T.length / Number(process.env.TRACE)));
					for (let i = 0; i < T.length; i += step) console.log('   ', r(T[i].t, 1), 'vol', r(T[i].vol), 'tilt', r(T[i].tilt, 0), 'miss/lipUp/mouthR/ask/aim/head mm/stuck', T[i].trace.join(' '));
					const e = T[T.length - 1];
					console.log('    end', r(e.t, 1), 'vol', r(e.vol), 'tilt', r(e.tilt, 0), e.trace.join(' '));
				}
				console.log(
					`${from} -> ${to} ${side} ${held ? 'in mano ' : 'sul banco'}: resta ${r(out.a)} mL, arrivato ${r(out.b)} (cap ${r(out.capB, 0)}), tilt chiesto ${r(asked, 0)}° reale ${r(maxTilt, 0)}°, miss mano ${r(Math.max(...S.map((x) => x.miss)), 3)}, durata ${r(S.length ? S[S.length - 1].t : 0, 1)} s`
				);
			}
await browser.close();
