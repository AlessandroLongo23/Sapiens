/*
 * The lab's benchmark: the scene with 1, 5, 13 and 25 students (the others are simulated: full-body avatars round the
 * bench, arms moving with the real IK, a beaker or a flask in hand), and the cost of each aspect switched off one at a
 * time. It stops the page's loop and drives the frames itself, with a gl.finish() after each, so a frame's time is its
 * CPU and GPU work together; each figure is the least of five rounds' medians, which keeps out most of the noise of a
 * busy machine. For a before and after, run both versions one after the other, more than once.
 *
 *   npm run dev, then: node scripts/lab/bench.mjs <out.json> [/laboratorio]
 *   QUICK=1 skips the aspects (only the students' scenarios).
 */
import { chromium } from 'playwright';
import fs from 'fs';
const OUT = process.argv[2]; const ROUTE = process.argv[3] ?? '/laboratorio';
const browser = await chromium.launch({ headless: true, args: ['--use-angle=metal', '--enable-gpu'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const errs = []; page.on('pageerror', (e) => errs.push(e.message));
const bytes = { total: 0, lab: {} };
page.on('response', async (r) => { if (r.url().includes('/lab/')) { try { const b = await r.body(); bytes.lab[r.url().split('/lab/')[1]] = b.length; bytes.total += b.length; } catch {} } });
if (process.env.QUICK) await page.addInitScript(() => (window.__QUICK = true));
const t0 = Date.now();
await page.goto('http://localhost:3000' + ROUTE, { timeout: 240000 });
await page.click('button:has-text("Rifiuta")', { timeout: 4000 }).catch(() => {});
await page.waitForSelector('text=Clicca per entrare', { timeout: 180000 });
const loadMs = Date.now() - t0;
await page.click('button:has-text("Rifiuta")', { timeout: 2000 }).catch(() => {});
await page.click('text=Clicca per entrare');
await page.waitForFunction(() => window.__lab?.scene, null, { timeout: 60000 });
const result = await page.evaluate(async () => {
  const s = window.__lab.scene; const r = s.renderer; const gl = r.getContext();
  s.player.locked = true; s.onLock(true);
  cancelAnimationFrame(s.raf); s.disposed = true; s.dynamicResolution = false; // the harness drives the frames, at a fixed resolution
  const p = s.player; p.position.set(0, 1.62, 0.9); p.yaw = 0; p.pitch = -0.32;
  const ext = gl.getExtension('EXT_disjoint_timer_query_webgl2');
  const V = s.camera.position.constructor; const Q = s.camera.quaternion.constructor;
  // ---- simulated students
  const Avatar = s.avatar.constructor; const bots = [];
  const spots = [];
  for (let i = 0; i < 24; i++) { const row = Math.floor(i / 6), col = i % 6; spots.push([-1.6 + col * 0.64 + (row % 2) * 0.2, 0.62 + row * 0.62, (row === 0 ? 0 : Math.PI) + (col - 2.5) * 0.08]); }
  const kit = ['Beaker', 'ConicalFlask', 'AcidBeaker'].map((n) => s.nodes.get(n)).filter(Boolean);
  async function addBots(n) {
    while (bots.length < n) {
      const i = bots.length; const a = await Avatar.load('/lab/avatar.glb');
      a.root.traverse((o) => { if (o.isMesh) { o.visible = true; o.castShadow = true; } });
      const [x, z, yaw] = spots[i]; a.root.position.set(x, 0, z + (i < 6 ? 0.25 : 0)); a.root.rotation.set(0, yaw, 0); a.root.updateMatrixWorld(true);
      s.scene.add(a.root);
      const src = kit[i % kit.length]; src.updateMatrixWorld(true); const inv = src.matrixWorld.clone().invert(); const held = new s.labRoot.constructor();
      src.traverse((o) => { if (!o.isMesh || !o.visible) return; const m = new o.constructor(o.geometry, o.material); inv.clone().multiply(o.matrixWorld).decompose(m.position, m.quaternion, m.scale); m.renderOrder = o.renderOrder; m.castShadow = o.castShadow; held.add(m); });
      s.scene.add(held);
      bots.push({ a, held, ph: i * 1.7 });
    }
  }
  const tick = (dt, t) => {
    for (const b of bots) {
      const R = b.a.root; const fwd = new V(0, 0, -1).applyQuaternion(R.quaternion); const right = new V(1, 0, 0).applyQuaternion(R.quaternion);
      for (const [side, sg] of [['R', 1], ['L', -1]]) {
        const pp = R.position.clone().add(new V(0, 1.05 + 0.05 * Math.sin(t * 1.3 + b.ph + sg), 0)).addScaledVector(fwd, 0.36 + 0.06 * Math.sin(t * 0.9 + b.ph)).addScaledVector(right, sg * (0.16 + 0.04 * Math.sin(t * 1.1 + b.ph)));
        const q = new Q().setFromAxisAngle(new V(0, 1, 0), R.rotation.y).multiply(new Q().setFromAxisAngle(new V(0, 0, 1), sg * -1.3));
        b.a.setTarget(side, { p: pp, q });
      }
      b.a.update(dt);
      const pf = b.a.palmFrame('R'); b.held.position.copy(pf.p).add(new V(0, -0.03, 0)); b.held.updateMatrixWorld(true);
    }
  };
  // ---- measuring
  const frame = s.frame.bind(s);
  let tSim = 0;
  const med = (a) => { const b = [...a].sort((x, y) => x - y); return b[Math.floor(b.length / 2)]; };
  const measure = async (n = 30) => {
    // long warm-up: a switch recompiles shaders, and the first frames after it would count the compile
    for (let i = 0; i < 45; i++) { tick(1 / 60, tSim += 1 / 60); frame(); } gl.finish();
    const info = r.info; info.autoReset = false;
    const rounds = [];
    for (let k = 0; k < 5; k++) {
      const cpu = [], wall = [], bots = [];
      info.reset();
      for (let i = 0; i < n; i++) {
        gl.finish();
        const a = performance.now(); tick(1 / 60, tSim += 1 / 60); const b = performance.now(); frame(); const c = performance.now(); gl.finish(); const d = performance.now();
        bots.push(b - a); cpu.push(c - a); wall.push(d - a);
      }
      rounds.push({ cpu: med(cpu), wall: med(wall), bots: med(bots), calls: info.render.calls / n, tris: info.render.triangles / n });
      await new Promise((res) => setTimeout(res, 30));
    }
    const best = (k) => +Math.min(...rounds.map((x) => x[k])).toFixed(2);
    const frameMs = best('wall'), cpuMs = best('cpu');
    return { frame: frameMs, cpu: cpuMs, gpu: +(frameMs - cpuMs).toFixed(2), bots: best('bots'), calls: Math.round(rounds[0].calls), tris: Math.round(rounds[0].tris) };
  };
  // GPU per pass, and the shadow map inside the render pass
  const perPass = async () => {
    const comp = s.composer; const out = {};
    const orig = comp.passes.map((ps) => ps.render.bind(ps));
    comp.passes.forEach((ps, i) => { ps.render = (...a) => { const q = gl.createQuery(); gl.beginQuery(ext.TIME_ELAPSED_EXT, q); orig[i](...a); gl.endQuery(ext.TIME_ELAPSED_EXT); (out[ps.constructor.name] ??= []).push(q); }; });
    for (let i = 0; i < 60; i++) { tick(1 / 60, tSim += 1 / 60); frame(); if (i % 10 === 9) gl.finish(); }
    gl.finish(); await new Promise((res) => setTimeout(res, 100));
    comp.passes.forEach((ps, i) => (ps.render = orig[i]));
    const res = {};
    for (const [k, qs] of Object.entries(out)) { const v = qs.map((q) => gl.getQueryParameter(q, gl.QUERY_RESULT) / 1e6).sort((a, b) => a - b); res[k] = +v[Math.floor(v.length / 2)].toFixed(2); }
    return res;
  };
  // ---- aspects, switched off one at a time
  const hideWhere = (pred) => { const hidden = []; s.scene.traverse((o) => { if (o.visible && pred(o)) { o.visible = false; hidden.push(o); } }); return () => hidden.forEach((o) => (o.visible = true)); };
  const botRoots = () => new Set(bots.flatMap((b) => [b.a.root, b.held]));
  const inBots = (o) => { const set = botRoots(); for (let q = o; q; q = q.parent) if (set.has(q)) return true; return false; };
  const aspects = {
    'ombre dal vivo': () => { const l = s.key; const c = l.castShadow; l.castShadow = false; r.shadowMap.needsUpdate = true; return () => (l.castShadow = c); },
    'post (outline, bloom, grading)': () => { const ps = s.composer.passes; const keep = ps.map((x) => x.enabled); ps.forEach((x, i) => { if (i > 0 && !x.constructor.name.includes('OutputPass')) x.enabled = false; }); return () => ps.forEach((x, i) => (x.enabled = keep[i])); },
    'risoluzione 2x (contro 1x)': () => { const pr = r.getPixelRatio(); r.setPixelRatio(1); s.composer.setPixelRatio(1); s.composer.setSize(1440, 900); return () => { r.setPixelRatio(pr); s.composer.setPixelRatio(pr); s.composer.setSize(1440, 900); }; },
    'vetro e liquidi (trasparenti)': () => hideWhere((o) => o.isMesh && o.material?.transparent && !inBots(o) && o.material.blending !== 2 && (o.userData.glass || o.material.clippingPlanes?.length)),
    'città fuori': () => hideWhere((o) => o.name === 'Town'),
    'stanza e arredi statici': () => hideWhere((o) => ['Room', 'Bench', 'Stool1', 'Stool2', 'PlantFloor', 'PlantBench', 'PlantShelf'].includes(o.name) || /^(Shelf|Periodic|Clock|Safety|Wash|TubeRack|Retort)/.test(o.name)),
    'raggi di sole e polvere': () => hideWhere((o) => (o.isPoints && !inBots(o)) || (o.isMesh && o.material?.blending === 2)),
    'avatar degli altri studenti': () => hideWhere((o) => bots.some((b) => b.a.root === o || b.held === o))
  };
  const out = { renderer: gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL), scenarios: {}, passes: {}, aspects: {} };
  const count = () => { let meshes = 0, transparent = 0, casters = 0, skinned = 0; s.scene.traverse((o) => { if (o.isMesh && o.visible) { meshes++; if (o.material?.transparent) transparent++; if (o.castShadow) casters++; if (o.isSkinnedMesh) skinned++; } }); return { meshes, transparent, casters, skinned, programs: r.info.programs.length, geometries: r.info.memory.geometries, textures: r.info.memory.textures }; };
  for (const n of [0, 4, 12, 24]) {
    await addBots(n);
    out.scenarios[n] = { ...(await measure()), ...count() };
    if (!window.__QUICK && (n === 0 || n === 12)) {
      out.passes[n] = await perPass();
      out.aspects[n] = {};
      for (const [k, off] of Object.entries(aspects)) { if (k.startsWith('avatar') && n === 0) continue; const back = off(); const m = await measure(); back(); out.aspects[n][k] = m; }
      out.aspects[n].base = await measure();
    }
  }
  return out;
});
result.loadMs = loadMs; result.bytes = bytes; result.errors = errs;
fs.writeFileSync(OUT, JSON.stringify(result, null, 1));
const sc = result.scenarios;
console.log('students | frame ms | cpu ms (of which bots) | gpu ms | draw calls | triangles | meshes | transparent | casters | programs');
for (const [n, m] of Object.entries(sc)) console.log(`${String(Number(n) + 1).padStart(8)} | ${m.frame} | ${m.cpu} (${m.bots}) | ${m.gpu} | ${m.calls} | ${m.tris} | ${m.meshes} | ${m.transparent} | ${m.casters} | ${m.programs}`);
for (const n of Object.keys(result.aspects)) {
  const base = result.aspects[n].base; console.log(`\n${Number(n) + 1} students, base frame ${base.frame} cpu ${base.cpu} gpu ${base.gpu} calls ${base.calls}; gpu timer per pass (rough)`, JSON.stringify(result.passes[n]));
  for (const [k, m] of Object.entries(result.aspects[n])) if (k !== 'base') console.log(`  ${k.padEnd(32)} saves frame ${(base.frame - m.frame).toFixed(2)} ms: cpu ${(base.cpu - m.cpu).toFixed(2)}, gpu ${(base.gpu - m.gpu).toFixed(2)}, ${base.calls - m.calls} calls, ${((base.tris - m.tris) / 1000).toFixed(0)}k tris`);
}
console.log('\nload to title ms', loadMs, 'bytes', (bytes.total / 1e6).toFixed(2), 'MB', JSON.stringify(bytes.lab), 'errors', errs.length);
await browser.close();
