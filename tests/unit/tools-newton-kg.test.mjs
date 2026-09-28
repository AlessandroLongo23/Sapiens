// Newton and kilogram-force (1 kgp = 9,80665 N exactly), and the weight of a mass on the Earth, the Moon and Mars.
// Run with `npm run test:unit`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createJiti } from "jiti";
import { assertReadable } from "./readable-outcome.mjs";

const jiti = createJiti(import.meta.url, {
  alias: { "@": new URL("../../src", import.meta.url).pathname },
});
const { newtonKg, pesoCorpo, FORCE_UNITS } = await jiti.import(
  "../../src/lib/tools/newton-kg.ts",
);

const ok = (o, name) => {
  assert.ok(o.ok, `${name}: ${o.error}`);
  assertReadable(o, name);
  return o;
};
const num = (copy) => {
  const m = /^(-?\d{1,3}(?: \d{3})+|-?\d+)(?:,(\d+))?(?: · 10\^(-?\d+))?/.exec(
    copy,
  );
  return (
    Number(`${m[1].replace(/ /g, "")}.${m[2] ?? "0"}`) * 10 ** Number(m[3] ?? 0)
  );
};

test("newton and kgp", () => {
  const o = ok(newtonKg("100", "N", "kgp"), "default");
  assert.equal(o.copy, "10,2 kgp");
  assert.equal(o.rows[0].value, "$\\approx 10{,}2\\ \\text{kgp}$");
  // The definition, and the warning that it is not 9,8.
  assert.equal(o.steps[0].math[0], "1\\ \\text{kgp} = 9{,}80665\\ \\text{N}");
  assert.match(o.steps[0].then, /9\{,\}8\$ dei problemi/);
  assert.equal(ok(newtonKg("1", "kgp", "N")).copy, "9,80665 N");
  assert.equal(ok(newtonKg("75", "kgp", "N")).copy, "735,49875 N");
  assert.equal(ok(newtonKg("9,80665", "N", "kgp")).copy, "1 kgp");
  assert.equal(ok(newtonKg("2", "kN", "kgp")).copy, "203,94 kgp");
  assert.equal(ok(newtonKg("2,5", "kN", "N")).copy, "2500 N");
  assert.equal(ok(newtonKg("1", "kgp", "gp")).copy, "1000 gp");
  assert.equal(ok(newtonKg("3", "N", "N")).copy, "3 N");
  // No kgp: no definition step.
  assert.equal(ok(newtonKg("4", "kN", "N")).steps.length, 1);
});

test("brute force: every pair of units", () => {
  const f = { N: 1, kN: 1000, kgp: 9.80665, gp: 0.00980665 };
  for (const x of ["1", "0,5", "123,4", "98066,5", "1e-3"]) {
    for (const a of FORCE_UNITS) {
      for (const b of FORCE_UNITS) {
        const o = ok(newtonKg(x, a.id, b.id), `${x} ${a.id} ${b.id}`);
        const want = (Number(x.replace(",", ".")) * f[a.id]) / f[b.id];
        assert.ok(
          Math.abs(num(o.copy) - want) <= 5e-3 * want,
          `${o.copy} vs ${want}`,
        );
      }
    }
  }
});

test("weight on the Earth, the Moon and Mars", () => {
  const moon = ok(pesoCorpo("60", "kg", "luna"), "moon");
  assert.equal(moon.copy, "97,2 N");
  assert.equal(moon.rows[0].label, "Peso sulla Luna");
  assert.deepEqual(
    moon.steps.at(-1).table.rows.map((r) => r[2]),
    ["$588\\ \\text{N}$", "$97{,}2\\ \\text{N}$", "$222{,}6\\ \\text{N}$"],
  );
  assert.equal(ok(pesoCorpo("500", "g", "terra")).copy, "4,9 N");
  assert.equal(ok(pesoCorpo("70", "kg", "marte")).copy, "259,7 N");
});

test("wrong inputs", () => {
  assert.match(newtonKg("", "N", "kgp").error, /Scrivi una forza/);
  assert.match(newtonKg("x", "N", "kgp").error, /Scrivi una forza/);
  assert.match(newtonKg("1", "N", "lb").error, /unità/);
  assert.match(pesoCorpo("", "kg", "terra").error, /massa/);
  assert.match(pesoCorpo("-2", "kg", "terra").error, /maggiore di zero/);
});
