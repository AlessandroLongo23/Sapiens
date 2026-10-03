/*
 * The lab played with a controller, checked with a simulated one (the browser's getGamepads is replaced): entering
 * and pausing from its buttons, the sticks, the triggers and bumpers as the two hands, the d-pad as the wheel, and
 * the labels on screen for a PlayStation and an Xbox controller. How the sticks feel is for a person to judge.
 *
 *   npm run dev, then: node scripts/lab/pad.mjs <out dir> [banco|aula]      LAB_URL sets the server.
 */
import { chromium } from 'playwright';
import fs from 'fs';

const OUT = process.argv[2];
const ROOM = process.argv[3] ?? 'banco';
const BASE = process.env.LAB_URL ?? 'http://localhost:3000';
if (!OUT) throw new Error('usage: node scripts/lab/pad.mjs <out dir> [banco|aula]');
fs.mkdirSync(OUT, { recursive: true });

const DS4 = 'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)';
const XBOX = 'Xbox Wireless Controller (STANDARD GAMEPAD Vendor: 045e Product: 0b13)';
const B = { south: 0, east: 1, west: 2, north: 3, l1: 4, r1: 5, l2: 6, r2: 7, start: 9, up: 12, down: 13, left: 14, right: 15 };

const browser = await chromium.launch({ headless: true, args: ['--use-angle=metal', '--enable-gpu'] });
const page = await browser.newPage({ viewport: { width: 1100, height: 680 }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.log('pageerror', e.message));
await page.addInitScript(() => {
	const pad = { id: '', index: 0, connected: false, mapping: 'standard', axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })) };
	window.__pad = pad;
	navigator.getGamepads = () => (pad.connected ? [pad] : []);
});
await page.goto(`${BASE}/laboratorio/chimica/solfato-di-rame?stanza=${ROOM}&qualita=leggera`, { timeout: 240000 });
await page.click('button:has-text("Rifiuta")', { timeout: 4000 }).catch(() => {});
await page.waitForSelector('text=Clicca per entrare', { timeout: 180000 });
await page.click('button:has-text("Rifiuta")', { timeout: 2000 }).catch(() => {});
await page.waitForFunction(() => window.__lab?.scene, null, { timeout: 60000 });

const wait = (ms) => page.waitForTimeout(ms);
const connect = (id) => page.evaluate((id) => Object.assign(window.__pad, { id, connected: true }), id);
const set = (i, on) => page.evaluate(({ i, on }) => (window.__pad.buttons[i] = { pressed: on, value: on ? 1 : 0 }), { i, on });
const tap = async (i, ms = 120) => {
	await set(i, true);
	await wait(ms);
	await set(i, false);
	await wait(120);
};
const axes = (a) => page.evaluate((a) => (window.__pad.axes = a), a);
const idle = async () => {
	await wait(150);
	await page.waitForFunction(() => !window.__lab.free.busy, null, { timeout: 30000 });
	await wait(200);
};
const state = () =>
	page.evaluate(() => {
		const { scene: s, work: w, free: f } = window.__lab;
		return {
			locked: s.player.locked,
			captured: !!document.pointerLockElement,
			yaw: s.player.yaw,
			pitch: s.player.pitch,
			x: s.player.position.x,
			z: s.player.position.z,
			L: s.hands.held('L')?.name ?? null,
			R: s.hands.held('R')?.name ?? null,
			goggles: w.goggles,
			spin: { ...f.spin },
			actions: f.getSnapshot().actions.map((a) => `${a.input}:${a.verb}`),
			hint: f.getSnapshot().hint,
			air: w.air
		};
	});
const look = (name, dy = 0) =>
	page.evaluate(
		({ name, dy }) => {
			const { scene: s } = window.__lab;
			const p = s.nodes.get(name).getWorldPosition(new s.gauzeCenter.constructor());
			// in front of it, the way the student faces the bench
			const yaw = s.player.home.yaw;
			s.player.position.x = p.x + Math.sin(yaw) * 0.6;
			s.player.position.z = p.z + Math.cos(yaw) * 0.6;
			p.y += dy;
			s.player.lookAt(p);
			s.player.settleHands();
		},
		{ name, dy }
	);
const results = [];
const check = (name, ok, detail = '') => {
	results.push(ok);
	console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? '  ' + detail : ''}`);
};
const text = () => page.evaluate(() => document.body.innerText);

// the title, then in with cross
await connect(DS4);
await set(B.l1, true);
await wait(200);
await set(B.l1, false);
await wait(200);
check('the title asks for cross once the controller is touched', (await text()).includes('per entrare') && !(await text()).includes('Clicca per entrare'));
await page.screenshot({ path: `${OUT}/pad-title.png` });
await tap(B.south);
await wait(600);
let st = await state();
check('cross enters without capturing the mouse', st.locked && !st.captured);
await page.screenshot({ path: `${OUT}/pad-tip.png` });

// the sticks
const a = await state();
await axes([0, 0, 0.8, 0]);
await wait(500);
await axes([0, 0, 0, -0.8]);
await wait(300);
await axes([0, 0, 0, 0]);
await wait(100);
let b = await state();
check('the right stick turns the view', a.yaw - b.yaw > 0.3 && b.pitch - a.pitch > 0.1, `yaw ${(a.yaw - b.yaw).toFixed(2)} pitch ${(b.pitch - a.pitch).toFixed(2)}`);
await axes([0.05, 0.06, 0.04, 0.05]);
await wait(400);
const c = await state();
check('a stick at rest does nothing', Math.abs(c.yaw - b.yaw) < 1e-4 && Math.hypot(c.x - b.x, c.z - b.z) < 0.004);
await axes([0, 1, 0, 0]);
await wait(600);
await axes([0, 0, 0, 0]);
await wait(400);
b = await state();
check('the left stick walks', Math.hypot(c.x - b.x, c.z - b.z) > 0.25, `${Math.hypot(c.x - b.x, c.z - b.z).toFixed(2)} m`);
await page.evaluate(() => window.__lab.scene.player.reset());
await wait(300);

// the bumpers use: the goggles on
await look('Goggles');
await wait(300);
st = await state();
check('on the goggles the prompt offers the use keys', st.actions.includes('Q:wear') && st.actions.includes('E:wear'), st.actions.join(' '));
await page.screenshot({ path: `${OUT}/pad-ps-goggles.png` });
await tap(B.l1);
await idle();
check('L1 wears the goggles', (await state()).goggles);

// the triggers take and put down
await look('Beaker', 0.04);
await wait(300);
await page.screenshot({ path: `${OUT}/pad-ps-grab.png` });
await tap(B.r2);
await idle();
check('R2 takes with the right hand', (await state()).R === 'Beaker');
await look('GlassRod');
await wait(300);
await tap(B.l2);
await idle();
st = await state();
check('L2 takes with the left hand', st.L === 'GlassRod');
check("the hint names the controller's buttons", /L1|R1|L2|R2|grilletto/.test(st.hint), st.hint);

// the d-pad and square turn what is about to be put down
await page.evaluate(() => {
	const { scene: s } = window.__lab;
	const rest = s.rest.get('Beaker').position;
	const p = s.labRoot.localToWorld(rest.clone());
	const yaw = s.player.home.yaw;
	s.player.position.x = p.x + Math.sin(yaw) * 0.6;
	s.player.position.z = p.z + Math.cos(yaw) * 0.6;
	s.player.lookAt(p);
	s.player.settleHands();
});
await wait(400);
st = await state();
check('aiming at the bench offers to put down and to turn', st.actions.some((x) => x.endsWith(':place')) && st.actions.includes('KeyR:turn'), st.actions.join(' '));
await page.screenshot({ path: `${OUT}/pad-ps-place.png` });
const s0 = await state();
await tap(B.right);
const s1 = await state();
await tap(B.west);
const s2 = await state();
await tap(B.left);
const s3 = await state();
const sum = (s) => s.spin.L + s.spin.R;
check('d-pad right and square turn by 45°, d-pad left turns back', Math.abs(sum(s1) - sum(s0) - Math.PI / 4) < 1e-3 && Math.abs(sum(s2) - sum(s1) - Math.PI / 4) < 1e-3 && Math.abs(sum(s3) - sum(s2) + Math.PI / 4) < 1e-3);
await set(B.up, true);
await wait(700);
await set(B.up, false);
await wait(100);
check('d-pad up, held, turns it as the wheel does', Math.abs(sum(await state()) - sum(s3)) > 0.1, `${(sum(await state()) - sum(s3)).toFixed(2)} rad`);
await tap(B.r2);
await idle();
check('R2 puts down', (await state()).R === null);

// the d-pad as the wheel on a control: the burner's air collar
await look('Bunsen', 0.03);
await wait(300);
const air0 = (await state()).air;
await tap(B.down, 60);
const air1 = (await state()).air;
await set(B.down, true);
await wait(900);
await set(B.down, false);
await wait(100);
const air2 = (await state()).air;
check('d-pad down closes the air: a tap nudges, held it runs', air0 - air1 > 0.005 && air0 - air1 < 0.05 && air1 - air2 > 0.1, `${air0.toFixed(2)} → ${air1.toFixed(2)} → ${air2.toFixed(2)}`);

// pause and resume
await tap(B.start);
await wait(300);
check('Options pauses', !(await state()).locked && (await text()).includes('Riprendi'));
await page.screenshot({ path: `${OUT}/pad-ps-pause.png` });
await tap(B.start);
await wait(300);
check('Options resumes', (await state()).locked);

// an Xbox controller's names, then the keyboard's again
await connect(XBOX);
await look('Beaker', 0.04);
await tap(B.north, 60);
await wait(300);
await page.screenshot({ path: `${OUT}/pad-xbox-grab.png` });
let t = await text();
check('an Xbox controller is labelled LT and RT', t.includes('LT') || t.includes('RT'), (await state()).actions.join(' '));
await page.keyboard.press('KeyW');
await wait(300);
t = await text();
check('a key brings the keyboard labels back', !t.includes('LT') && !t.includes('RT') && !/L1|R1|L2|R2|grilletto/.test((await state()).hint));
await page.screenshot({ path: `${OUT}/pad-keys.png` });
await page.keyboard.press('Escape');
await wait(300);
check('Esc pauses a game entered from the controller', !(await state()).locked);

console.log(`${results.filter(Boolean).length}/${results.length}`);
await browser.close();
