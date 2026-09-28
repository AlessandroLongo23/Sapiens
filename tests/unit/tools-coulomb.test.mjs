// Coulomb's law: F = k |q1 q2| / r², k = 8,99 · 10⁹ N·m²/C², solved for the force, the distance or a charge.
// Run with `npm run test:unit`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createJiti } from "jiti";
import { assertReadable } from "./readable-outcome.mjs";

const jiti = createJiti(import.meta.url, {
  alias: { "@": new URL("../../src", import.meta.url).pathname },
});
const { coulomb } = await jiti.import("../../src/lib/tools/coulomb.ts");

const ok = (state, name) => {
  const o = coulomb(state);
  assert.ok(o.ok, `${name}: ${o.error}`);
  assertReadable(o, name);
  return o;
};
const type = (o) => o.rows.find((r) => r.label === "Tipo di forza").value;
/** "5,394 N", "1,234 · 10^-5 N" → number. */
function num(copy) {
  const m = /^(-?\d{1,3}(?: \d{3})+|-?\d+)(?:,(\d+))?(?: · 10\^(-?\d+))?/.exec(
    copy,
  );
  return (
    Number(`${m[1].replace(/ /g, "")}.${m[2] ?? "0"}`) * 10 ** Number(m[3] ?? 0)
  );
}
const K = 8.99e9;
const U = {
  C: 1,
  uC: 1e-6,
  nC: 1e-9,
  m: 1,
  cm: 0.01,
  mm: 0.001,
  N: 1,
  mN: 0.001,
};

test("the example the page opens with: 2 μC and −3 μC at 10 cm", () => {
  const o = ok(
    {
      trova: "F",
      q1: "2",
      uq1: "uC",
      q2: "-3",
      uq2: "uC",
      r: "10",
      ur: "cm",
      uF: "N",
    },
    "default",
  );
  assert.equal(o.copy, "5,394 N");
  assert.equal(type(o), "attrattiva");
  // Charges to coulomb in scientific notation, the distance squared in brackets.
  assert.ok(
    o.steps.some((s) =>
      s.table?.rows.some((r) => r[3] === "$-3 \\cdot 10^{-6}\\ \\text{C}$"),
    ),
  );
  assert.ok(
    o.steps.some((s) => s.math?.[0]?.includes("{(0{,}1\\ \\text{m})^2}")),
  );
});

test("force, distance and charge", () => {
  const rep = ok({
    trova: "F",
    q1: "5",
    uq1: "nC",
    q2: "5",
    uq2: "nC",
    r: "3",
    ur: "mm",
    uF: "mN",
  });
  assert.equal(type(rep), "repulsiva");
  assert.equal(rep.copy, "24,97 mN");
  // Hydrogen atom: F ≈ 8,2 · 10⁻⁸ N, in scientific notation.
  const h = ok({
    trova: "F",
    q1: "1,602e-19",
    uq1: "C",
    q2: "-1,602e-19",
    uq2: "C",
    r: "5,29e-11",
    ur: "m",
    uF: "N",
  });
  assert.equal(h.copy, "8,245 · 10^-8 N");
  const r = ok({
    trova: "r",
    q1: "1",
    uq1: "uC",
    q2: "1",
    uq2: "uC",
    F: "0,899",
    uF: "N",
    ur: "cm",
  });
  assert.equal(r.copy, "10 cm");
  const q2 = ok({
    trova: "q2",
    q1: "2",
    uq1: "uC",
    F: "5,394",
    uF: "N",
    r: "10",
    ur: "cm",
    uq2: "uC",
    tipo: "attrattiva",
  });
  assert.equal(q2.copy, "-3 μC");
  const q2r = ok({
    trova: "q2",
    q1: "-2",
    uq1: "uC",
    F: "5,394",
    uF: "N",
    r: "10",
    ur: "cm",
    uq2: "uC",
    tipo: "repulsiva",
  });
  assert.equal(q2r.copy, "-3 μC");
  const q1 = ok({
    trova: "q1",
    q2: "-3",
    uq2: "uC",
    F: "5,394",
    uF: "N",
    r: "0,1",
    ur: "m",
    uq1: "nC",
    tipo: "repulsiva",
  });
  assert.equal(q1.copy, "-2000 nC");
});

test("brute force: the three ways agree", () => {
  for (const [a, ua] of [
    ["1", "uC"],
    ["-4,5", "nC"],
    ["0,002", "C"],
    ["7", "uC"],
  ]) {
    for (const [b, ub] of [
      ["3", "uC"],
      ["-12", "nC"],
      ["2e-8", "C"],
    ]) {
      for (const [d, ud] of [
        ["5", "cm"],
        ["1,5", "m"],
        ["8", "mm"],
      ]) {
        const qa = Number(a.replace(",", ".")) * U[ua];
        const qb = Number(b.replace(",", ".")) * U[ub];
        const rr = Number(d.replace(",", ".")) * U[ud];
        const F = (K * Math.abs(qa * qb)) / rr ** 2;
        const o = ok({
          trova: "F",
          q1: a,
          uq1: ua,
          q2: b,
          uq2: ub,
          r: d,
          ur: ud,
          uF: "N",
        });
        assert.ok(Math.abs(num(o.copy) - F) <= 1e-3 * F, `${o.copy} vs ${F}`);
        assert.equal(type(o), qa * qb < 0 ? "attrattiva" : "repulsiva");
        const Fs = F.toExponential(9).replace(".", ",");
        const back = ok({
          trova: "r",
          q1: a,
          uq1: ua,
          q2: b,
          uq2: ub,
          F: Fs,
          uF: "N",
          ur: "m",
        });
        assert.ok(
          Math.abs(num(back.copy) - rr) <= 1e-3 * rr,
          `${back.copy} vs ${rr}`,
        );
        const c = ok({
          trova: "q2",
          q1: a,
          uq1: ua,
          F: Fs,
          uF: "N",
          r: d,
          ur: ud,
          uq2: "C",
          tipo: qa * qb < 0 ? "attrattiva" : "repulsiva",
        });
        assert.ok(
          Math.abs(num(c.copy) - qb) <= 1e-3 * Math.abs(qb),
          `${c.copy} vs ${qb}`,
        );
      }
    }
  }
});

test("wrong inputs", () => {
  const bad = (state, re) => {
    const o = coulomb(state);
    assert.equal(o.ok, false);
    assert.match(o.error, re);
  };
  bad({ trova: "F", q1: "0", q2: "1", r: "1" }, /carica 1 non può essere zero/);
  bad({ trova: "F", q1: "1", q2: "", r: "1" }, /carica 2/);
  bad(
    { trova: "F", q1: "1", q2: "1", r: "-1" },
    /distanza deve essere maggiore di zero/,
  );
  bad({ trova: "r", q1: "1", q2: "1", F: "0" }, /forza non può essere zero/);
  bad({ trova: "q2", q1: "1", F: "abc", r: "1" }, /Scrivi la forza/);
});
