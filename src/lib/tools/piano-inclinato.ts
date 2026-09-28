import { fail, type Outcome, type ResultRow } from "./types";
import {
  exact,
  fmt,
  grouped,
  parseNumber,
  q,
  readDatum,
  rel,
  sqrtVal,
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
 * A body on an inclined plane, with or without friction: the weight P = m g split into the component along the plane,
 * P∥ = P sin α, and the one against it, P⊥ = P cos α, which the normal force balances (N = P⊥). The body stays still
 * when the static friction can hold P∥ (P∥ ≤ μs N); otherwise it slides with the dynamic friction μd N against it,
 * and a = (P∥ − μd N) / m.
 *
 * The angle is given in degrees or by the height and the length of the plane (sin α = h / l). Sines are exact for
 * 30°, 60° and 90°, and for h / l; the others are rounded, and the results say "≈". g is 9,8 m/s² by default, as in
 * the other physics tools (Amaldi), and the student can change it.
 */

const N_ = unit("", "N", "\\text{N}");
const MS2 = unit("", "m/s²", "\\text{m/s}^2");
const KG = unit("kg", "kg", "\\text{kg}");

export const MASS_QT: Quantity = {
  key: "m",
  sym: "m",
  name: "massa",
  the: "la massa",
  units: [KG, unit("g", "g", "\\text{g}", q(1, 1000))],
  sign: "pos",
  example: "2",
};
const LENGTHS = [
  unit("m", "m", "\\text{m}"),
  unit("cm", "cm", "\\text{cm}", q(1, 100)),
];
export const H_QT: Quantity = {
  key: "h",
  sym: "h",
  name: "altezza del piano",
  the: "l'altezza del piano",
  units: LENGTHS,
  sign: "pos",
  example: "3",
};
export const L_QT: Quantity = {
  key: "l",
  sym: "l",
  name: "lunghezza del piano",
  the: "la lunghezza del piano",
  units: LENGTHS,
  sign: "pos",
  example: "5",
};

const mul = (...vs: Val[]): Val => ({
  q: vs.reduce((acc, v) => acc.mul(v.q), q(1)),
  approx: vs.some((v) => v.approx),
});
const div = (a: Val, b: Val): Val => ({
  q: a.q.div(b.q),
  approx: a.approx || b.approx,
});
const sub = (a: Val, b: Val): Val => ({
  q: a.q.sub(b.q),
  approx: a.approx || b.approx,
});
const float = (x: number): Val => ({ q: Q.fromNumber(x), approx: true });
/** A value in a formula, "≈" when rounded. */
const eqv = (v: Val) => rel(v);
const approx = (v: Val) => (fmt(v).exact ? "" : "\\approx ");
const deg = (x: Val) => `${fmt(x).tex}^\\circ`;

interface Angle {
  /** The angle in degrees, for the drawing and the rows. */
  deg: Val;
  sin: Val;
  cos: Val;
}

/** Sine and cosine of an angle in degrees: exact where the books know them as fractions (30°, 60°), else rounded. */
export function angleOf(degrees: Q): Angle {
  const d = degrees.toNumber();
  const half = exact(q(1, 2));
  const r32 = sqrtVal(exact(q(3, 4)));
  const r22 = sqrtVal(exact(q(1, 2)));
  if (degrees.cmp(q(30)) === 0)
    return { deg: exact(degrees), sin: half, cos: r32 };
  if (degrees.cmp(q(60)) === 0)
    return { deg: exact(degrees), sin: r32, cos: half };
  // The same number for both, so that tg 45° = 1 exactly and μ = 1 is the limit case.
  if (degrees.cmp(q(45)) === 0)
    return { deg: exact(degrees), sin: r22, cos: r22 };
  const rad = (d * Math.PI) / 180;
  return {
    deg: exact(degrees),
    sin: float(Math.sin(rad)),
    cos: float(Math.cos(rad)),
  };
}

export interface PianoResult {
  outcome: Outcome;
  /** For the drawing: the angle in degrees and the forces in newton. */
  sketch?: {
    alpha: number;
    P: number;
    par: number;
    perp: number;
    friction: number;
    R: number;
    slides: boolean;
  };
}

/** Reads a friction coefficient: empty is null (no friction), else a number ≥ 0. */
function readMu(s: string | undefined, what: string): Q | null | string {
  if (!(s ?? "").trim()) return null;
  const x = parseNumber(s!);
  if (!x)
    return `Scrivi il coefficiente di attrito ${what} come numero, per esempio 0,3, oppure lascialo vuoto.`;
  if (x.sign() < 0)
    return `Il coefficiente di attrito ${what} non può essere negativo.`;
  if (x.cmp(q(10)) > 0)
    return `Il coefficiente di attrito ${what} è troppo grande: di solito sta tra 0 e 1.`;
  return x;
}

export function pianoInclinato(state: Record<string, string>): PianoResult {
  try {
    return compute(state);
  } catch {
    return {
      outcome: fail(
        "Con questi numeri il calcolo non si può fare: controlla i dati.",
      ),
    };
  }
}

function compute(state: Record<string, string>): PianoResult {
  const steps: Tagged[] = [];
  const md = readDatum(MASS_QT, state.m, state.um);
  if (typeof md === "string") return { outcome: fail(md) };
  const g = parseNumber(state.g ?? "");
  if (!g || g.sign() <= 0)
    return {
      outcome: fail("Scrivi l'accelerazione di gravità, per esempio 9,8."),
    };
  const gv = exact(g);
  const ms = readMu(state.ms, "statico");
  if (typeof ms === "string") return { outcome: fail(ms) };
  let mdyn = readMu(state.md, "dinamico");
  if (typeof mdyn === "string") return { outcome: fail(mdyn) };
  const muS = ms ?? mdyn;
  if (mdyn === null) mdyn = muS;
  if (muS && mdyn && mdyn.cmp(muS) > 0)
    return {
      outcome: fail(
        "Il coefficiente dinamico non può essere maggiore di quello statico: l'attrito di un corpo fermo è il più forte.",
      ),
    };
  const friction = !!muS && !muS.isZero();

  // The angle.
  let angle: Angle;
  const data: Datum[] = [md];
  if (state.modo === "lati") {
    const hd = readDatum(H_QT, state.h, state.uh);
    if (typeof hd === "string") return { outcome: fail(hd) };
    const ld = readDatum(L_QT, state.l, state.ul);
    if (typeof ld === "string") return { outcome: fail(ld) };
    if (hd.base.q.cmp(ld.base.q) >= 0)
      return {
        outcome: fail(
          "L'altezza deve essere minore della lunghezza del piano, che è l'ipotenusa: per esempio 3 m e 5 m.",
        ),
      };
    data.push(hd, ld);
    const sin = div(hd.base, ld.base);
    const cos = sqrtVal({ q: q(1).sub(sin.q.mul(sin.q)), approx: false });
    angle = {
      deg: float((Math.asin(sin.q.toNumber()) * 180) / Math.PI),
      sin,
      cos,
    };
    const conv = unitsStep(data);
    if (conv) steps.push({ ...conv, part: "I dati" });
    steps.push({
      say: "Trova seno e coseno dell'angolo dai lati del piano.",
      math: [
        `\\sin\\alpha = \\dfrac{h}{l} = \\dfrac{${vu(hd.base, LENGTHS[0])}}{${vu(ld.base, LENGTHS[0])}} ${eqv(sin)} \\hl{${fmt(sin).tex}}`,
        `\\cos\\alpha = \\sqrt{1 - \\sin^2\\alpha} ${eqv(cos)} \\hl{${fmt(cos).tex}}`,
      ],
      then: `L'angolo è $\\alpha \\approx ${deg(angle.deg)}$.`,
      part: steps.length ? undefined : "I dati",
    });
  } else {
    const a = parseNumber(state.a ?? "");
    if (!a)
      return {
        outcome: fail("Scrivi l'angolo del piano in gradi, per esempio 30."),
      };
    if (a.sign() <= 0 || a.cmp(q(90)) >= 0)
      return {
        outcome: fail(
          "L'angolo del piano deve stare tra 0° e 90°, per esempio 30.",
        ),
      };
    angle = angleOf(a);
    const conv = unitsStep(data);
    if (conv) steps.push({ ...conv, part: "I dati" });
  }

  const m = md.base;
  const P = mul(m, gv);
  const par = mul(P, angle.sin);
  const perp = mul(P, angle.cos);
  const Nf = perp;
  const aTex = state.modo === "lati" ? "\\alpha" : deg(angle.deg);

  steps.push({
    say: "Calcola la forza peso.",
    math: [
      "P = m g",
      `P = ${vu(m, KG)} \\cdot ${vu(gv, MS2)}`,
      `${eqv(P)} \\hl{${vu(P, N_)}}`,
    ],
    part: "Le componenti del peso",
  });
  steps.push({
    say: "Trova la componente del peso parallela al piano.",
    math: [
      "P_\\parallel = P \\sin\\alpha",
      `P_\\parallel = ${vu(P, N_)} \\cdot ${state.modo === "lati" ? fmt(angle.sin).tex : `\\sin ${aTex}`}`,
      ...(state.modo === "lati"
        ? []
        : [`${eqv(angle.sin)} ${vu(P, N_)} \\cdot ${fmt(angle.sin).tex}`]),
      `${eqv(par)} \\hl{${vu(par, N_)}}`,
    ],
    then: "Tira il corpo verso il basso, lungo il piano.",
  });
  steps.push({
    say: "Trova la componente del peso perpendicolare al piano.",
    math: [
      "P_\\perp = P \\cos\\alpha",
      `P_\\perp = ${vu(P, N_)} \\cdot ${state.modo === "lati" ? fmt(angle.cos).tex : `\\cos ${aTex}`}`,
      ...(state.modo === "lati"
        ? []
        : [`${eqv(angle.cos)} ${vu(P, N_)} \\cdot ${fmt(angle.cos).tex}`]),
      `${eqv(perp)} \\hl{${vu(perp, N_)}}`,
    ],
    then: "Il piano la equilibra con la forza normale: $N = P_\\perp$.",
  });

  let slides: boolean;
  let F: Val = exact(q(0));
  let fLabel = "Forza di attrito";
  if (friction) {
    const fsMax = mul(exact(muS!), Nf);
    steps.push({
      say: "Calcola l'attrito statico massimo.",
      math: [
        "F_{s,\\max} = \\mu_s N",
        `F_{s,\\max} = ${fmt(muS!).tex} \\cdot ${vu(Nf, N_)}`,
        `${eqv(fsMax)} \\hl{${vu(fsMax, N_)}}`,
      ],
      then:
        ms === null
          ? "Hai scritto solo il coefficiente dinamico: lo strumento lo usa anche come statico."
          : undefined,
      part: "L'attrito",
    });
    const c = par.q.cmp(fsMax.q);
    slides = c > 0;
    const sign = c > 0 ? ">" : c < 0 ? "<" : "=";
    steps.push({
      say: "Confronta la componente parallela con l'attrito statico massimo.",
      math: [
        `P_\\parallel ${eqv(par)} ${vu(par, N_)}`,
        `F_{s,\\max} ${eqv(fsMax)} ${vu(fsMax, N_)}`,
        `P_\\parallel \\hl{${sign}} F_{s,\\max}`,
      ],
      then: slides
        ? "L'attrito statico non basta a tenerlo fermo: il corpo scivola."
        : c === 0
          ? "Il corpo è al limite: resta fermo, ma basta una spinta minima per farlo scivolare. L'attrito statico vale quanto $P_\\parallel$."
          : "L'attrito statico basta: il corpo resta fermo, e l'attrito vale quanto $P_\\parallel$.",
    });
    if (slides) {
      F = mul(exact(mdyn!), Nf);
      fLabel = "Forza di attrito dinamico";
      steps.push({
        say: "Calcola l'attrito dinamico, che agisce mentre il corpo scivola.",
        math: [
          "F_d = \\mu_d N",
          `F_d = ${fmt(mdyn!).tex} \\cdot ${vu(Nf, N_)}`,
          `${eqv(F)} \\hl{${vu(F, N_)}}`,
        ],
        then: (state.md ?? "").trim()
          ? undefined
          : "Hai scritto solo il coefficiente statico: lo strumento lo usa anche come dinamico.",
        part: "Il moto",
      });
    } else {
      F = par;
      fLabel = "Forza di attrito statico";
    }
  } else slides = true;

  const R = slides ? sub(par, F) : exact(q(0));
  const acc = slides ? div(R, m) : exact(q(0));
  if (slides) {
    if (friction)
      steps.push({
        say: "Calcola la forza risultante lungo il piano.",
        math: [
          "R = P_\\parallel - F_d",
          `R ${eqv(par)} ${vu(par, N_)} - ${vu(F, N_)}`,
          `${eqv(R)} \\hl{${vu(R, N_)}}`,
        ],
      });
    steps.push({
      say: "Calcola l'accelerazione con il secondo principio della dinamica.",
      math: [
        friction ? "a = \\dfrac{R}{m}" : "a = \\dfrac{P_\\parallel}{m}",
        `a ${eqv(R)} \\dfrac{${vu(R, N_)}}{${vu(m, KG)}}`,
        `${eqv(acc)} \\hl{${vu(acc, MS2)}}`,
      ],
      then: friction
        ? "Il corpo scende lungo il piano con questa accelerazione."
        : "Senza attrito la massa si semplifica: $a = g \\sin\\alpha$, e non dipende da $m$.",
      part: friction ? undefined : "Il moto",
    });
  }

  const rows: ResultRow[] = [
    {
      label: "Il corpo",
      value: slides ? "scivola lungo il piano" : "resta fermo",
    },
    { label: "Accelerazione", value: `$${approx(acc)}${vu(acc, MS2)}$` },
    {
      label: "Forza risultante lungo il piano",
      value: `$${approx(R)}${vu(R, N_)}$`,
    },
    {
      label: "Componente parallela del peso",
      value: `$${approx(par)}${vu(par, N_)}$`,
    },
    {
      label: "Componente perpendicolare del peso",
      value: `$${approx(perp)}${vu(perp, N_)}$`,
    },
    { label: "Forza normale", value: `$${approx(Nf)}${vu(Nf, N_)}$` },
    ...(friction
      ? [{ label: fLabel, value: `$${approx(F)}${vu(F, N_)}$` }]
      : []),
  ];
  if (state.modo === "lati")
    rows.push({
      label: "Angolo del piano",
      value: `$\\approx ${deg(angle.deg)}$`,
    });

  return {
    outcome: {
      ok: true,
      rows,
      copy: slides
        ? `a = ${fmt(acc).text} m/s²`
        : "Il corpo resta fermo: a = 0 m/s²",
      steps: grouped(steps),
    },
    sketch: {
      alpha: angle.deg.q.toNumber(),
      P: P.q.toNumber(),
      par: par.q.toNumber(),
      perp: perp.q.toNumber(),
      friction: F.q.toNumber(),
      R: R.q.toNumber(),
      slides,
    },
  };
}

export const pianoInclinatoOutcome = (state: Record<string, string>): Outcome =>
  pianoInclinato(state).outcome;
