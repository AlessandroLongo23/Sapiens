/*
 * What the oxide does as more and more of it goes into the beaker: the state (grams, the liquid's level, the bed of
 * powder, what is left in the jar) and what is seen. The spatula's own action is checked by usi.mjs; here the
 * amounts are set as so many spatulas would, and the game's own checks are read.
 *
 *   npm run dev, then: node scripts/lab/ossido.mjs <out dir> [banco|aula]      LAB_URL sets the server.
 */
import { chromium } from 'playwright';
import fs from 'fs';

const OUT = process.argv[2];
const ROOM = process.argv[3] ?? 'banco';
const BASE = process.env.LAB_URL ?? 'http://localhost:3000';
if (!OUT) throw new Error('usage: node scripts/lab/ossido.mjs <out dir> [banco|aula]');
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-angle=metal', '--enable-gpu'] });
const page = await browser.newPage({ viewport: { width: 1100, height: 680 }, deviceScaleFactor: 2 });
page.on('pageerror', (e) => console.log('pageerror', e.message));
await page.goto(`${BASE}/laboratorio/chimica/solfato-di-rame?stanza=${ROOM}&qualita=leggera`, { timeout: 240000 });
await page.click('button:has-text("Rifiuta")', { timeout: 4000 }).catch(() => {});
await page.waitForSelector('text=Clicca per entrare', { timeout: 180000 });
await page.click('button:has-text("Rifiuta")', { timeout: 2000 }).catch(() => {});
await page.click('text=Clicca per entrare');
await page.waitForFunction(() => window.__lab?.scene, null, { timeout: 60000 });
await page.waitForTimeout(1500);
const wait = (ms) => page.waitForTimeout(ms);
const idle = async () => {
	await wait(150);
	await page.waitForFunction(() => !window.__lab.free.busy, null, { timeout: 40000 });
	await wait(250);
};
await page.evaluate(() => {
	const { scene: s, work: w } = window.__lab;
	s.player.locked = true;
	s.onLock(true);
	w.goggles = true;
	s.nodes.get('Goggles').visible = false;
	// 25 mL of water in the beaker, no acid: nothing reacts, so what is added stays
	Object.assign(s.liquids.get('Beaker').contents, { vol: 25, acid: 0, cu: 0, solid: 0 });
});
const stand = (name, dy, back = 0.5) =>
	page.evaluate(
		({ name, dy, back }) => {
			const { scene: s } = window.__lab;
			const p = s.nodes.get(name).getWorldPosition(new s.gauzeCenter.constructor());
			const yaw = s.player.home.yaw;
			s.player.position.x = p.x + Math.sin(yaw) * back;
			s.player.position.z = p.z + Math.cos(yaw) * back;
			p.y += dy;
			s.player.lookAt(p);
			s.player.settleHands();
		},
		{ name, dy, back }
	);
const read = () =>
	page.evaluate(() => {
		const { scene: s, work: w } = window.__lab;
		const b = s.liquids.get('Beaker');
		const pw = s.nodes.get('CuOJar').getObjectByName('CuOPowder');
		return { solid: b.contents.solid, level: b.localLevel(), bed: b.bedTop(), top: b.profile.top, bottom: b.profile.bottom, grains: s.grains.get('Beaker').mesh.count, jar: w.jar, jarY: pw ? pw.position.y : null, jarShown: pw ? pw.visible : null, portions: w.portions, message: w.free.getSnapshot().message?.text ?? null };
	});
const results = [];
const check = (name, ok, detail = '') => {
	results.push(ok);
	console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? '  ' + detail : ''}`);
};
const mm = (v) => (v * 1000).toFixed(1) + ' mm';

// one real spatula, from the jar into the beaker
await stand('CuOJar', 0.03);
await page.evaluate(() => window.__lab.free.run(() => window.__lab.free.grab('R', window.__lab.scene.nodes.get('Spatula'))));
await idle();
const a0 = await read();
await page.evaluate(() => void window.__lab.free.run(() => window.__lab.work.scoop('R')));
await idle();
const a1 = await read();
check('a spatula takes half a gram from the jar, and its powder goes down', Math.abs(a0.jar - a1.jar - 0.5) < 1e-6 && a1.jarY < a0.jarY, `${a0.jar} → ${a1.jar} g, surface ${mm(a0.jarY - a1.jarY)} lower`);
await stand('Beaker', 0.03);
await page.evaluate(() => void window.__lab.free.run(() => window.__lab.work.dump('R', window.__lab.scene.nodes.get('Beaker'))));
await idle();
const a2 = await read();
check('tipped into the beaker it is there, and the message counts it', Math.abs(a2.solid - 0.5) < 1e-6 && /0,5 g/.test(a2.message ?? ''), a2.message ?? '');

// more and more: the state as so many spatulas leave it
const rows = [];
for (const n of [1, 4, 20, 60, 120, 180]) {
	await page.evaluate((n) => {
		const { scene: s, work: w } = window.__lab;
		s.liquids.get('Beaker').contents.solid = n * 0.5;
		w.portions = n;
	}, n);
	await wait(400);
	const r = await read();
	// from close by, a little from above
	if (n === 1) await stand('Beaker', 0.03, 0.3);
	if (n === 1) await wait(500);
	// the bench has pushed the body back: look at the beaker again from where it now stands
	if (n === 1)
		await page.evaluate(() => {
			const { scene: s } = window.__lab;
			const p = s.nodes.get('Beaker').getWorldPosition(new s.gauzeCenter.constructor());
			p.y += 0.03;
			s.player.lookAt(p);
			s.player.settleHands();
		});
	if (n === 1) await wait(300);
	rows.push({ n, ...r });
	console.log(`   ${String(n).padStart(3)} spatulas, ${String(r.solid).padStart(4)} g: grains ${String(r.grains).padStart(3)}, bed ${mm(r.bed - r.bottom).padStart(8)}, liquid ${mm(r.level - r.bottom).padStart(8)} (rim ${mm(r.top - r.bottom)})`);
	await page.screenshot({ path: `${OUT}/ossido-${ROOM}-${String(n).padStart(3, '0')}.png`, clip: { x: 420, y: 210, width: 260, height: 260 } });
}
check('the bed of powder grows with every amount', rows.every((r, i) => i === 0 || r.bed > rows[i - 1].bed || (r.bed === rows[i - 1].bed && r.solid <= 1.6)) && rows.at(-1).bed - rows[0].bed > 0.02);
check('the liquid rises as the solid goes in', rows.every((r, i) => i === 0 || r.level > rows[i - 1].level));
// full to the rim: the spatula is refused
const full = await page.evaluate(() => {
	const { scene: s, work: w } = window.__lab;
	w.loaded = true;
	const out = [];
	for (const n of [100, 200, 420]) {
		s.liquids.get('Beaker').contents.solid = n * 0.5;
		const u = w.dumpUse('R', s.nodes.get('Beaker'));
		out.push([n, !!u.blocked, u.text]);
	}
	w.loaded = false;
	return out;
});
check('once it is up to the rim no more goes in', full.at(-1)[1] && !full[0][1], full.map((f) => `${f[0]}: ${f[2]}`).join(' · '));
// an empty jar
const empty = await page.evaluate(() => {
	const { scene: s, work: w } = window.__lab;
	w.jar = 0;
	w.jarLevel();
	const u = w.scoopUse('R');
	return { blocked: !!u.blocked, text: u.text, shown: s.nodes.get('CuOJar').getObjectByName('CuOPowder')?.visible };
});
check('an empty jar gives nothing, and shows it', empty.blocked && empty.shown === false, empty.text);
console.log(`${results.filter(Boolean).length}/${results.length}`);
await browser.close();
