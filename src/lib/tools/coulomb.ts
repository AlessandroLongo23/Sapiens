import { fail, type Outcome } from "./types";
import {
  exact,
  finish,
  fmt,
  grouped,
  parseNumber,
  q,
  rel,
  safely,
  sqrtVal,
  symbolsTable,
  unit,
  unitsStep,
  vu,
  Q,
  type Datum,
  type Quantity,
  type Tagged,
  type Val,
} from "./grandezze";

/**
 * Coulomb's law in vacuum: F = k |q₁ q₂| / r², with k = 8,99 · 10⁹ N·m²/C² as in the Italian books (Amaldi). The
 * student finds the force, the distance or the second charge. Charges keep their sign: the force is attractive
 * when the signs are opposite and repulsive when they are equal; to find the second charge the student says which.
 * Exact arithmetic on BigInt rationals; results in scientific notation outside 0,001 … 999 999.
 */

export const K_COULOMB = q(899).mul(Q.pow10(7));
const K_TEX =
  "8{,}99 \\cdot 10^{9}\\ \\tfrac{\\text{N} \\cdot \\text{m}^2}{\\text{C}^2}";

const CHARGE_UNITS = [
  unit("C", "C", "\\text{C}"),
  unit("uC", "μC", "\\mu\\text{C}", Q.pow10(-6)),
  unit("nC", "nC", "\\text{nC}", Q.pow10(-9)),
];
export const Q1_QT: Quantity = {
  key: "q1",
  sym: "q_1",
  name: "carica 1",
  the: "la carica 1",
  units: CHARGE_UNITS,
  sign: "any",
  example: "2",
};
export const Q2_QT: Quantity = {
  key: "q2",
  sym: "q_2",
  name: "carica 2",
  the: "la carica 2",
  units: CHARGE_UNITS,
  sign: "any",
  example: "-3",
};
export const R_QT: Quantity = {
  key: "r",
  sym: "r",
  name: "distanza",
  the: "la distanza",
  units: [
    unit("m", "m", "\\text{m}"),
    unit("cm", "cm", "\\text{cm}", q(1, 100)),
    unit("mm", "mm", "\\text{mm}", q(1, 1000)),
  ],
  sign: "pos",
  example: "10",
};
export const F_QT: Quantity = {
  key: "F",
  sym: "F",
  name: "forza",
  the: "la forza",
  units: [
    unit("N", "N", "\\text{N}"),
    unit("mN", "mN", "\\text{mN}", q(1, 1000)),
  ],
  sign: "pos",
  example: "5,4",
};
export const COULOMB_QTS = [F_QT, Q1_QT, Q2_QT, R_QT];

const C_ = CHARGE_UNITS[0];
const M_ = R_QT.units[0];
const N_ = F_QT.units[0];
const M2 = unit("", "m²", "\\text{m}^2");
const NM2 = unit("", "N·m²", "\\text{N} \\cdot \\text{m}^2");
const C2 = unit("", "C²", "\\text{C}^2");

/** A value in a product: in brackets when it has a power of ten or a sign. */
const op = (v: Val | Q, u: typeof C_) => {
  const s = vu(v, u);
  return /\\cdot 10|^-/.test(fmt(v).tex) ? `(${s})` : s;
};
const abs = (v: Val): Val => ({ q: v.q.abs(), approx: v.approx });

function read(qt: Quantity, state: Record<string, string>): Datum | string {
  const raw = parseNumber(state[qt.key] ?? "");
  if (!raw) return `Scrivi ${qt.the}, per esempio ${qt.example}.`;
  if (raw.isZero())
    return `${qt.the.charAt(0).toUpperCase() + qt.the.slice(1)} non può essere zero.`;
  if (qt.sign === "pos" && raw.sign() < 0)
    return `${qt.the.charAt(0).toUpperCase() + qt.the.slice(1)} deve essere maggiore di zero: scrivi per esempio ${qt.example}.`;
  const u = qt.units.find((x) => x.id === state[`u${qt.key}`]) ?? qt.units[0];
  return { qt, raw, unit: u, base: { q: raw.mul(u.factor), approx: false } };
}

const kind = (attractive: boolean) => (attractive ? "attrattiva" : "repulsiva");

export function coulomb(state: Record<string, string>): Outcome {
  return safely(() => {
    const unknown = COULOMB_QTS.find((x) => x.key === state.trova) ?? F_QT;
    const data: Record<string, Datum> = {};
    for (const qt of COULOMB_QTS.filter((x) => x !== unknown)) {
      const d = read(qt, state);
      if (typeof d === "string") return fail(d);
      data[qt.key] = d;
    }
    const x = (k: string) => data[k].base;
    const k = exact(K_COULOMB);
    const steps: Tagged[] = [];
    const formula = "F = k\\, \\dfrac{|q_1 q_2|}{r^2}";
    steps.push({
      say: "Scrivi la legge di Coulomb.",
      math: [formula],
      table: symbolsTable(COULOMB_QTS),
      then: `Nel vuoto $k = ${K_TEX}$.`,
      part: "La formula",
    });

    let result: Val;
    let attractive: boolean;
    if (unknown === F_QT) {
      const prod = { q: x("q1").q.mul(x("q2").q).abs(), approx: false };
      const r2 = { q: x("r").q.mul(x("r").q), approx: false };
      const top = { q: k.q.mul(prod.q), approx: false };
      result = { q: top.q.div(r2.q), approx: false };
      attractive = x("q1").q.sign() !== x("q2").q.sign();
      const conv = unitsStep(Object.values(data));
      if (conv) steps.push({ ...conv, part: "I dati" });
      steps.push({
        say: "Sostituisci i valori, con le loro unità.",
        math: [
          `F = ${K_TEX} \\cdot \\dfrac{|${op(x("q1"), C_)} \\cdot ${op(x("q2"), C_)}|}{(${vu(x("r"), M_)})^2}`,
          `= ${K_TEX} \\cdot \\dfrac{${vu(prod, C2)}}{${vu(r2, M2)}}`,
          `${rel(result)} \\hl{${vu(result, N_)}}`,
        ],
        part: "Il calcolo",
      });
    } else if (unknown === R_QT) {
      attractive = x("q1").q.sign() !== x("q2").q.sign();
      steps.push({
        say: "Ricava la distanza dalla formula.",
        math: ["\\hl{r} = \\sqrt{\\dfrac{k\\, |q_1 q_2|}{F}}"],
        then: "Moltiplica per $r^2$, dividi per $F$, poi fai la radice quadrata.",
      });
      const conv = unitsStep(Object.values(data));
      if (conv) steps.push({ ...conv, part: "I dati" });
      const top = { q: k.q.mul(x("q1").q.mul(x("q2").q).abs()), approx: false };
      const r2 = { q: top.q.div(x("F").q), approx: false };
      result = sqrtVal(r2);
      steps.push({
        say: "Sostituisci i valori, con le loro unità.",
        math: [
          `r = \\sqrt{\\dfrac{${K_TEX} \\cdot |${op(x("q1"), C_)} \\cdot ${op(x("q2"), C_)}|}{${vu(x("F"), N_)}}}`,
          `= \\sqrt{\\dfrac{${vu(top, NM2)}}{${vu(x("F"), N_)}}}`,
          `${rel(r2)} \\sqrt{${vu(r2, M2)}}`,
          `${rel(result)} \\hl{${vu(result, M_)}}`,
        ],
        then: fmt(result).exact
          ? undefined
          : "La radice non è esatta: il risultato è arrotondato.",
        part: "Il calcolo",
      });
    } else {
      const known = unknown === Q1_QT ? Q2_QT : Q1_QT;
      const kq = x(known.key);
      attractive = state.tipo !== "repulsiva";
      steps.push({
        say: `Ricava ${unknown.the} dalla formula.`,
        math: [`|\\hl{${unknown.sym}}| = \\dfrac{F r^2}{k\\, |${known.sym}|}`],
        then: `Moltiplica per $r^2$, poi dividi per $k$ e per $|${known.sym}|$.`,
      });
      const conv = unitsStep(Object.values(data));
      if (conv) steps.push({ ...conv, part: "I dati" });
      const r2 = { q: x("r").q.mul(x("r").q), approx: false };
      const top = { q: x("F").q.mul(r2.q), approx: false };
      const bottom = { q: k.q.mul(kq.q.abs()), approx: false };
      const mag = { q: top.q.div(bottom.q), approx: false };
      steps.push({
        say: "Sostituisci i valori, con le loro unità.",
        math: [
          `|${unknown.sym}| = \\dfrac{${vu(x("F"), N_)} \\cdot (${vu(x("r"), M_)})^2}{${K_TEX} \\cdot ${op(abs(kq), C_)}}`,
          `= \\dfrac{${vu(top, NM2)}}{${vu(bottom, unit("", "", "\\tfrac{\\text{N} \\cdot \\text{m}^2}{\\text{C}}"))}}`,
          `${rel(mag)} \\hl{${vu(mag, C_)}}`,
        ],
        part: "Il calcolo",
      });
      const sameSign = !attractive;
      result = {
        q: sameSign === kq.q.sign() > 0 ? mag.q : mag.q.neg(),
        approx: false,
      };
      steps.push({
        say: "Scegli il segno della carica.",
        math: [`${unknown.sym} ${rel(result)} \\hl{${vu(result, C_)}}`],
        then: attractive
          ? `La forza è attrattiva: le cariche hanno segno opposto, e $${known.sym}$ è ${kq.q.sign() > 0 ? "positiva" : "negativa"}.`
          : `La forza è repulsiva: le cariche hanno lo stesso segno, e $${known.sym}$ è ${kq.q.sign() > 0 ? "positiva" : "negativa"}.`,
      });
    }

    if (unknown === F_QT || unknown === R_QT)
      steps.push({
        say: "Guarda i segni delle cariche.",
        then: attractive
          ? "Le cariche hanno segno opposto: la forza è attrattiva, le cariche si attraggono."
          : "Le cariche hanno lo stesso segno: la forza è repulsiva, le cariche si respingono.",
        part: "Il verso",
      });

    const end = finish(unknown, result, state[`u${unknown.key}`]);
    if (end.step) steps.push({ ...end.step, part: "Il risultato" });
    const rows = [
      ...end.rows,
      { label: "Tipo di forza", value: kind(attractive) },
    ];
    return { ok: true, rows, copy: end.copy, steps: grouped(steps) };
  });
}
