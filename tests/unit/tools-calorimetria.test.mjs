// The equilibrium temperature of bodies that exchange heat: Σ m c (T_e − T) = 0, without changes of state. Run with
// `npm run test:unit`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createJiti } from "jiti";
import { assertReadable } from "./readable-outcome.mjs";

const jiti = createJiti(import.meta.url, {
  alias: { "@": new URL("../../src", import.meta.url).pathname },
});
const { temperaturaEquilibrio, SOSTANZE } = await jiti.import(
  "../../src/lib/tools/calorimetria.ts",
);

const num = (copy) =>
  Number(copy.replace(/ °C$/, "").replace(/ /g, "").replace(",", "."));
const ok = (state, name) => {
  const o = temperaturaEquilibrio(state);
  assert.ok(o.ok, `${name}: ${o.error}`);
  assertReadable(o, name);
  return o;
};
const bad = (state, re) => {
  const o = temperaturaEquilibrio(state);
  assert.equal(o.ok, false);
  assert.match(o.error, re);
  assertReadable(o);
};

test("the example the page opens with", () => {
  const o = ok(
    {
      m: "250;100;150",
      um: "g;g;g",
      s: "acqua;alluminio;ferro",
      c: ";;",
      t: "20;20;95",
    },
    "default",
  );
  // (0,25·4186·20 + 0,1·880·20 + 0,15·450·95) / (0,25·4186 + 0,1·880 + 0,15·450) = 29102,5 / 1202
  assert.equal(o.copy, "24,21 °C");
  assert.equal(o.rows[0].value, "$\\approx 24{,}21\\ {}^\\circ\\text{C}$");
  assert.ok(o.steps[0].group, "grouped");
  // Masses to kilograms, highlighted in the table.
  assert.ok(
    o.steps.some((s) =>
      s.table?.rows.some((r) => r[3] === "$0{,}25\\ \\text{kg}$"),
    ),
  );
  assert.ok(
    o.steps.some(
      (s) =>
        s.math?.[1] === "= \\dfrac{29\\,102{,}5}{1202}\\ {}^\\circ\\text{C}",
    ),
  );
  // Heat given = heat taken.
  const check = o.steps.at(-1).math;
  assert.equal(
    check[0].split(" ").slice(1).join(" "),
    check[1].split(" ").slice(1).join(" "),
  );
});

test("exact results", () => {
  assert.equal(
    ok({ m: "1;1", um: "kg;kg", s: "acqua;acqua", c: ";", t: "20;80" }).copy,
    "50 °C",
  );
  assert.equal(
    ok({ m: "2;1", um: "kg;kg", s: "acqua;acqua", c: ";", t: "15;60" }).copy,
    "30 °C",
  );
  const same = ok({
    m: "1;3",
    um: "kg;g",
    s: "ferro;rame",
    c: ";",
    t: "40;40",
  });
  assert.equal(same.copy, "40 °C");
  assert.match(same.steps.at(-1).then, /già alla stessa temperatura/);
  // Other substance, negative start.
  assert.equal(
    ok({ m: "1;1", um: "kg;kg", s: "altro;altro", c: "100;300", t: "-20;20" })
      .copy,
    "10 °C",
  );
  // Ice warming metal below zero, no change of state.
  assert.equal(
    ok({ m: "1;1", um: "kg;kg", s: "ghiaccio;altro", c: ";2090", t: "-30;-10" })
      .copy,
    "-20 °C",
  );
  // Five bodies: the formula with Σ.
  const five = ok({
    m: "1;1;1;1;1",
    um: "kg;kg;kg;kg;kg",
    s: "acqua;acqua;acqua;acqua;acqua",
    c: ";;;;",
    t: "10;20;30;40;50",
  });
  assert.equal(five.copy, "30 °C");
  assert.ok(five.steps[0].math[1].includes("\\sum"));
});

test("brute force: T_e between the extremes, and the heats balance", () => {
  const ids = SOSTANZE.filter(
    (s) => s.id !== "altro" && s.id !== "ghiaccio" && s.id !== "acqua",
  ).map((s) => s.id);
  let seed = 7;
  const rnd = (n) => (
    (seed = (seed * 1103515245 + 12345) % 2147483648),
    seed % n
  );
  for (let k = 0; k < 300; k++) {
    const n = 2 + rnd(4);
    const bodies = Array.from({ length: n }, () => ({
      m: 1 + rnd(900),
      s: ids[rnd(ids.length)],
      t: rnd(300) - 50,
    }));
    const state = {
      m: bodies.map((b) => b.m).join(";"),
      um: bodies.map(() => "g").join(";"),
      s: bodies.map((b) => b.s).join(";"),
      c: bodies.map(() => "").join(";"),
      t: bodies.map((b) => b.t).join(";"),
    };
    const o = temperaturaEquilibrio(state);
    assert.ok(o.ok, o.error);
    const c = (id) => Number(SOSTANZE.find((s) => s.id === id).c);
    const te =
      bodies.reduce((a, b) => a + b.m * c(b.s) * b.t, 0) /
      bodies.reduce((a, b) => a + b.m * c(b.s), 0);
    assert.ok(Math.abs(num(o.copy) - te) < 0.006, `${num(o.copy)} vs ${te}`);
    assert.ok(
      te >= Math.min(...bodies.map((b) => b.t)) - 1e-9 &&
        te <= Math.max(...bodies.map((b) => b.t)) + 1e-9,
    );
  }
  assertReadable(
    temperaturaEquilibrio({
      m: "1;2;3",
      um: "kg;g;kg",
      s: "rame;oro;olio",
      c: ";;",
      t: "-5;300;7",
    }),
  );
});

test("changes of state are not computed", () => {
  bad(
    { m: "1;5", um: "kg;kg", s: "acqua;ghiaccio", c: ";", t: "10;-30" },
    /gelerebbe.*calore latente/,
  );
  bad(
    { m: "10;10", um: "g;kg", s: "acqua;ferro", c: ";", t: "20;800" },
    /bollirebbe.*vaporizzazione/,
  );
  bad(
    { m: "1;5", um: "kg;kg", s: "ghiaccio;acqua", c: ";", t: "-5;50" },
    /ghiaccio fonderebbe/,
  );
  // Water outside 0 … 100 °C, ice above 0 °C.
  bad(
    { m: "1;1", um: "kg;kg", s: "acqua;ferro", c: ";", t: "-5;20" },
    /acqua liquida/,
  );
  bad(
    { m: "1;1", um: "kg;kg", s: "acqua;ferro", c: ";", t: "120;20" },
    /acqua liquida/,
  );
  bad(
    { m: "1;1", um: "kg;kg", s: "ghiaccio;ferro", c: ";", t: "5;20" },
    /Il ghiaccio sta/,
  );
  // Exactly 0 °C with ice and water is allowed.
  assert.equal(
    ok({ m: "1;1", um: "kg;kg", s: "acqua;ghiaccio", c: ";", t: "0;0" }).copy,
    "0 °C",
  );
});

test("wrong inputs", () => {
  bad({ m: "1", um: "kg", s: "acqua", c: "", t: "20" }, /almeno due/);
  bad(
    { m: "1;1;1;1;1;1", um: "", s: "", c: "", t: "1;1;1;1;1;1" },
    /Al massimo 5/,
  );
  bad(
    { m: "1;", um: "kg;kg", s: "acqua;acqua", c: ";", t: "20;30" },
    /massa del corpo 2/,
  );
  bad(
    { m: "1;0", um: "kg;kg", s: "acqua;acqua", c: ";", t: "20;30" },
    /maggiore di zero/,
  );
  bad(
    { m: "1;1", um: "kg;kg", s: "acqua;altro", c: ";", t: "20;30" },
    /calore specifico del corpo 2/,
  );
  bad(
    { m: "1;1", um: "kg;kg", s: "acqua;altro", c: ";-3", t: "20;30" },
    /maggiore di zero/,
  );
  bad(
    { m: "1;1", um: "kg;kg", s: "acqua;ferro", c: ";", t: "20;" },
    /temperatura iniziale del corpo 2/,
  );
  bad(
    { m: "1;1", um: "kg;kg", s: "altro;ferro", c: "100;", t: "-300;20" },
    /zero assoluto/,
  );
});
