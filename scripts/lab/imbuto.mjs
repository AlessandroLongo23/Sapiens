/*
 * The funnel on the containers: taken off the flask and put back, put on each other container, refused where it
 * would not hold, and draining into whatever it rests in.
 *
 *   npm run dev, then: node scripts/lab/imbuto.mjs <out dir> [banco|aula]      LAB_URL sets the server.
 */
import { chromium } from 'playwright';
import fs from 'fs';

const OUT = process.argv[2];
const ROOM = process.argv[3] ?? 'banco';
const BASE = process.env.LAB_URL ?? 'http://localhost:3000';
if (!OUT) throw new Error('usage: node scripts/lab/imbuto.mjs <out dir> [banco|aula]');
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-angle=metal', '--enable-gpu'] });
const page = await browser.newPage({ viewport: { width: 1100, height: 680 }, deviceScaleFactor: 1 });
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
	s.player.locked = true;
	s.onLock(true);
	w.goggles = true;
	s.nodes.get('Goggles').visible = false;
});
const wait = (ms) => page.waitForTimeout(ms);
const idle = async () => {
	await wait(150);
	await page.waitForFunction(() => !window.__lab.free.busy, null, { timeout: 30000 });
	await wait(250);
};
/** Stands in front of a thing and looks at a point of it, `dy` above its origin. */
const look = (name, dy) =>
	page.evaluate(
		({ name, dy }) => {
			const { scene: s } = window.__lab;
			const p = s.nodes.get(name).getWorldPosition(new s.gauzeCenter.constructor());
			const yaw = s.player.home.yaw;
			s.player.position.x = p.x + Math.sin(yaw) * 0.55;
			s.player.position.z = p.z + Math.cos(yaw) * 0.55;
			p.y += dy;
			s.player.lookAt(p);
			s.player.settleHands();
		},
		{ name, dy }
	);
/** Looks at a thing, trying heights on its axis until the crosshair is on it. */
const aim = async (name) => {
	for (const dy of [0.02, 0.008, 0.03, 0.045, 0.06, 0.08, 0.1, 0.003]) {
		await look(name, dy);
		await wait(120);
		if ((await page.evaluate(() => window.__lab.scene.under()?.name ?? null)) === name) return true;
	}
	return false;
};
const click = (button) => page.evaluate((button) => window.__lab.scene.onPress(button, window.__lab.scene.under()), button);
const state = () =>
	page.evaluate(() => {
		const { scene: s, free: f } = window.__lab;
		const fn = s.nodes.get('Funnel');
		const p = fn.getWorldPosition(new s.gauzeCenter.constructor());
		const host = f.hostOf(fn);
		const up = new s.gauzeCenter.constructor(0, 1, 0).applyQuaternion(fn.getWorldQuaternion(new s.camera.quaternion.constructor())).y;
		const hp = host?.getWorldPosition(new s.gauzeCenter.constructor());
		return {
			held: [s.hands.held('L')?.name ?? null, s.hands.held('R')?.name ?? null],
			host: host?.name ?? null,
			above: hp ? p.y - hp.y - s.liquids.get(host.name).profile.top : null,
			off: hp ? Math.hypot(p.x - hp.x, p.z - hp.z) : null,
			up,
			under: s.under()?.name ?? null,
			actions: f.getSnapshot().actions.map((a) => `${a.input}:${a.verb}:${a.text}${a.blocked ? ':blocked' : ''}`),
			message: f.getSnapshot().message?.text ?? null,
			funnel: s.liquids.get('Funnel').contents.vol
		};
	});
const results = [];
const check = (name, ok, detail = '') => {
	results.push(ok);
	console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? '  ' + detail : ''}`);
};
const r3 = (v) => (v == null ? v : Math.round(v * 1000) / 1000);

let st = await state();
check('at the start the funnel rests in the flask', st.host === 'ConicalFlask', `origin ${r3(st.above)} m from the mouth`);
await look('Funnel', 0.02);
await wait(300);
await click(2);
await idle();
check('the right hand takes it off', (await state()).held[1] === 'Funnel');

for (const host of ['Beaker', 'ConicalFlask']) {
	await aim(host);
	await wait(350);
	st = await state();
	check(`over the ${host} the prompt offers to put the funnel on it`, st.actions.some((a) => a.startsWith("R:place:Metti l'imbuto") && !a.endsWith('blocked')), st.actions.join(' | '));
	await page.screenshot({ path: `${OUT}/imbuto-${ROOM}-${host}-anteprima.png` });
	await click(2);
	await idle();
	st = await state();
	// the cone meets the rim, or the stem's end the bottom: the origin (the cone's apex) is near the mouth, upright and on the axis
	check(`it rests in the ${host}, upright on its axis`, st.host === host && st.held[1] === null && st.off < 0.002 && st.up > 0.999 && st.above < 0.012 && st.above > -0.065, `apex ${r3(st.above)} m from the mouth`);
	await page.screenshot({ path: `${OUT}/imbuto-${ROOM}-${host}.png` });
	if (host === 'Beaker') {
		// what is poured into it passes into the beaker under it
		const before = await page.evaluate(() => window.__lab.scene.liquids.get('Beaker').contents.vol);
		await page.evaluate(() => (window.__lab.scene.liquids.get('Funnel').contents.vol = 10));
		await wait(7000);
		const after = await page.evaluate(() => window.__lab.scene.liquids.get('Beaker').contents.vol);
		check('it drains into the beaker under it', after - before > 9.5 && (await state()).funnel < 0.01, `${r3(after - before)} mL`);
		// the beaker is not taken from under it
		await aim('Beaker');
		await wait(300);
		await click(0);
		await idle();
		st = await state();
		check('the container is not taken from under the funnel', st.held[0] === null, st.message ?? '');
	}
	await look('Funnel', 0.02);
	await wait(300);
	await click(2);
	await idle();
	check(`and is taken off the ${host} again`, (await state()).held[1] === 'Funnel');
}
// too low a container: the small beaker is shorter than the stem
await aim('AcidBeaker');
await wait(350);
st = await state();
check('the small beaker is lower than the stem: refused, and said why', st.actions.some((a) => a.includes('Bocca troppo bassa') && a.endsWith('blocked')), `under ${st.under}: ` + st.actions.join(' | '));
// too wide a mouth: the dish
await aim('EvapDish');
await wait(350);
st = await state();
check('the dish is too wide: refused, and said why', st.actions.some((a) => a.includes('Bocca troppo larga') && a.endsWith('blocked')), `under ${st.under}: ` + st.actions.join(' | '));
await page.screenshot({ path: `${OUT}/imbuto-${ROOM}-capsula.png` });
await click(2);
await idle();
st = await state();
check('a click there keeps it in the hand', st.held[1] === 'Funnel', st.message ?? '');
console.log(`${results.filter(Boolean).length}/${results.length}`);
await browser.close();
