// A body on an inclined plane: the components of the weight, the normal force, static and dynamic friction, and
// the acceleration. Run with `npm run test:unit`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createJiti } from "jiti";
import { assertReadable } from "./readable-outcome.mjs";

const jiti = createJiti(import.meta.url, {
  alias: { "@": new URL("../../src", import.meta.url).pathname },
});
const { pianoInclinato } = await jiti.import(
  "../../src/lib/tools/piano-inclinato.ts",
);

const BASE = {
  m: "2",
  um: "kg",
  modo: "angolo",
  a: "30",
  h: "",
  uh: "m",
  l: "",
  ul: "m",
  ms: "",
  md: "",
  g: "9,8",
};
const run = (patch, name) => {
  const r = pianoInclinato({ ...BASE, ...patch });
  assert.ok(r.outcome.ok, `${name}: ${r.outcome.error}`);
  assertReadable(r.outcome, name);
  return r;
};
const row = (o, label) => o.rows.find((r) => r.label === label)?.value;
const bad = (patch, re) => {
  const r = pianoInclinato({ ...BASE, ...patch });
  assert.equal(r.outcome.ok, false);
  assert.match(r.outcome.error, re);
};

test("the example the page opens with: 2 kg, 30°, μs 0,4, μd 0,3", () => {
  const { outcome: o, sketch } = run({ ms: "0,4", md: "0,3" }, "default");
  assert.equal(row(o, "Il corpo"), "scivola lungo il piano");
  // P = 19,6 N; P∥ = 9,8 N exactly (sin 30° = 1/2); P⊥ = 19,6 · √3/2.
  assert.equal(row(o, "Componente parallela del peso"), "$9{,}8\\ \\text{N}$");
  assert.equal(
    row(o, "Componente perpendicolare del peso"),
    "$\\approx 16{,}97\\ \\text{N}$",
  );
  assert.equal(
    row(o, "Forza di attrito dinamico"),
    "$\\approx 5{,}092\\ \\text{N}$",
  );
  assert.equal(row(o, "Accelerazione"), "$\\approx 2{,}354\\ \\text{m/s}^2$");
  assert.equal(o.copy, "a = 2,354 m/s²");
  assert.ok(o.steps[0].group);
  assert.ok(
    Math.abs(sketch.R - (9.8 - (0.3 * 19.6 * Math.sqrt(3)) / 2)) < 1e-9,
  );
});

test("without friction a = g sin α", () => {
  const { outcome: o } = run({ m: "5" }, "nofric");
  assert.equal(row(o, "Accelerazione"), "$4{,}9\\ \\text{m/s}^2$");
  assert.equal(row(o, "Forza di attrito"), undefined);
  assert.match(o.steps.at(-1).then, /g \\sin\\alpha/);
  // From height and length: 3 m and 5 m, sin = 0,6, cos = 0,8, all exact.
  const { outcome: l } = run({ modo: "lati", h: "3", l: "5", m: "4" }, "lati");
  assert.equal(row(l, "Accelerazione"), "$5{,}88\\ \\text{m/s}^2$");
  assert.equal(
    row(l, "Componente perpendicolare del peso"),
    "$31{,}36\\ \\text{N}$",
  );
  assert.equal(row(l, "Angolo del piano"), "$\\approx 36{,}87^\\circ$");
  // Different units for h and l.
  const { outcome: cm } = run(
    { modo: "lati", h: "30", uh: "cm", l: "5", ul: "m", m: "1" },
    "cm",
  );
  assert.equal(
    row(cm, "Componente parallela del peso"),
    "$0{,}588\\ \\text{N}$",
  );
});

test("static friction holds the body", () => {
  const { outcome: o, sketch } = run(
    { m: "500", um: "g", a: "20", ms: "0,5" },
    "still",
  );
  assert.equal(row(o, "Il corpo"), "resta fermo");
  assert.equal(row(o, "Accelerazione"), "$0\\ \\text{m/s}^2$");
  assert.equal(
    row(o, "Forza di attrito statico"),
    row(o, "Componente parallela del peso"),
  );
  assert.equal(sketch.slides, false);
  // The limit: tg 45° = 1 = μs.
  const lim = run({ a: "45", ms: "1", md: "0,8" }, "limit").outcome;
  assert.equal(row(lim, "Il corpo"), "resta fermo");
  assert.match(
    lim.steps.find((s) => /Confronta/.test(s.say)).then,
    /al limite/,
  );
  // Only μd given: used as static too.
  const only = run({ a: "20", md: "0,5" }, "only md").outcome;
  assert.equal(row(only, "Il corpo"), "resta fermo");
  assert.ok(
    only.steps.some((s) => /solo il coefficiente dinamico/.test(s.then ?? "")),
  );
});

test("brute force against floating point", () => {
  for (const a of [5, 10, 15, 22.5, 30, 37, 45, 53, 60, 75, 89]) {
    for (const mu of ["", "0,1", "0,3", "0,6", "1,2"]) {
      const { outcome: o, sketch } = run(
        { a: String(a).replace(".", ","), ms: mu, md: mu, m: "3" },
        `${a} ${mu}`,
      );
      const r = (a * Math.PI) / 180;
      const m = Number(mu.replace(",", ".") || 0);
      const P = 3 * 9.8;
      const slides = Math.sin(r) > m * Math.cos(r) + 1e-12;
      assert.equal(sketch.slides, slides, `${a} ${mu}`);
      const acc = slides ? 9.8 * (Math.sin(r) - m * Math.cos(r)) : 0;
      assert.ok(Math.abs(sketch.R / 3 - acc) < 1e-9, `${a} ${mu}`);
      assert.ok(Math.abs(sketch.par - P * Math.sin(r)) < 1e-9);
      const shown = Number(
        /([\d{},]+)\\ \\text\{m\/s\}/
          .exec(row(o, "Accelerazione"))[1]
          .replace("{,}", "."),
      );
      assert.ok(
        Math.abs(shown - acc) < 0.01 * Math.max(1, acc),
        `${shown} vs ${acc}`,
      );
    }
  }
});

test("wrong inputs", () => {
  bad({ m: "" }, /massa/);
  bad({ m: "-1" }, /maggiore di zero/);
  bad({ a: "" }, /angolo/);
  bad({ a: "0" }, /tra 0° e 90°/);
  bad({ a: "90" }, /tra 0° e 90°/);
  bad({ modo: "lati", h: "5", l: "5" }, /minore della lunghezza/);
  bad({ modo: "lati", h: "", l: "5" }, /altezza/);
  bad({ ms: "x" }, /statico/);
  bad({ ms: "-0,2" }, /negativo/);
  bad({ ms: "0,3", md: "0,5" }, /dinamico non può essere maggiore/);
  bad({ g: "0" }, /gravità/);
});
