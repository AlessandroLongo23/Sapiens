/**
 * Operazioni con le frazioni algebriche. Spec: specs/exercises/frazioni-algebriche-operazioni.md
 *
 * Seven levels in the order of lesson 48 (docs/lezioni/riscritte/48-frazioni-algebriche-operazioni.md),
 * each adding one difficulty: the same denominator (with the minus in front of a fraction); two
 * first-degree denominators prime to each other; denominators to factor, with a common or an
 * opposite factor and a final simplification; a product with cross simplification; a quotient,
 * with the C.E. of the divisor's numerator (asked on its own in part of the exercises); a
 * difference in brackets divided by a fraction; power, quotient and final sum with opposite factors.
 *
 * Built backwards: the factors are chosen first (small integer roots), the numerators are solved
 * so that the result simplifies when the case asks for it, and only then the text is expanded.
 * The result is written as in the lesson: sign in front of the fraction, numerator and denominator
 * as products of irreducible factors over Z (x first, then the linear factors by decreasing root),
 * nothing left to simplify. Everything is in the single letter x.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from "../types";
import { Rational, ONE, ZERO, gcd, lcm, q } from "../rational";
import {
  type Poly,
  polyAdd,
  polyDegree,
  polyIsZero,
  polyMul,
  polyScale,
  polySub,
  polyToLatex,
} from "../latex";
import { type Opt, buildChoice, forbidden } from "../monomi";

export const ID = "frazioni-algebriche-operazioni";

const MAX_COEF = 60;

// ---------------------------------------------------------------------------
// Polynomials in x (coefficients by degree)

type P = Poly;

const cst = (n: number | Rational): P => [typeof n === "number" ? q(n) : n];
const X: P = [ZERO, ONE];
/** x - a */
const lin = (a: number): P => [q(-a), ONE];
/** p x + c */
const linP = (p: number, c: number): P => [q(c), q(p)];
const mulAll = (...ps: P[]): P =>
  ps.reduce((acc, p) => polyMul(acc, p), cst(1));
const pw = (p: P, n: number): P =>
  mulAll(...Array.from({ length: n }, () => p));
const neg = (p: P): P => polyScale(p, q(-1));

function trim(p: P): P {
  const d = polyDegree(p);
  return d < 0 ? [] : p.slice(0, d + 1);
}

function evalAt(p: P, r: Rational): Rational {
  let out = ZERO;
  for (let i = p.length - 1; i >= 0; i--) out = out.mul(r).add(p[i]);
  return out;
}

const vanishes = (p: P, r: number): boolean => evalAt(p, q(r)).isZero();

/** Exact quotient p / f, or null when the division leaves a remainder. */
function pdiv(p: P, f: P): P | null {
  let r = trim(p);
  const df = polyDegree(f);
  const dp = polyDegree(r);
  if (dp < df) return polyIsZero(r) ? [] : null;
  const out: Rational[] = Array.from({ length: dp - df + 1 }, () => ZERO);
  for (let d = polyDegree(r); d >= df; d = polyDegree(r)) {
    const c = r[d].div(f[df]);
    out[d - df] = c;
    const sh: P = [
      ...Array.from({ length: d - df }, () => ZERO),
      ...f.map((x) => x.mul(c)),
    ];
    r = trim(polySub(r, sh));
    if (polyIsZero(r)) break;
  }
  return polyIsZero(r) ? trim(out) : null;
}

const keyP = (p: P): string =>
  trim(p)
    .map((c) => c.toString())
    .join(",");
const isX = (p: P): boolean => keyP(p) === "0,1";
const maxCoef = (p: P): number => Math.max(0, ...p.map((c) => Math.abs(c.num)));

/** Nonzero terms, highest degree first: [coefficient, degree]. */
function terms(p: P): [Rational, number][] {
  const out: [Rational, number][] = [];
  for (let d = p.length - 1; d >= 0; d--)
    if (!p[d].isZero()) out.push([p[d], d]);
  return out;
}

function termTex(c: Rational, d: number): string {
  const a = c.abs();
  const lit = d === 0 ? "" : d === 1 ? "x" : `x^${d}`;
  return d === 0 ? a.toLatex() : (a.isOne() ? "" : a.toLatex()) + lit;
}

/** A sum of terms written as it comes, without collecting: "3x + 1 - x - 5". */
function seqTex(ts: [Rational, number][]): string {
  if (ts.length === 0) return "0";
  return ts
    .map(
      ([c, d], i) =>
        (i === 0 ? (c.sign() < 0 ? "-" : "") : c.sign() < 0 ? " - " : " + ") +
        termTex(c, d),
    )
    .join("");
}

const pt = (p: P): string => polyToLatex(trim(p));

/** Increasing powers, as the lesson writes an opposite factor: "3 - x", "1 - x^2". */
function asc(p: P): string {
  const ts = terms(p).reverse();
  return seqTex(ts);
}

const fr = (n: string, d: string): string => `\\frac{${n}}{${d}}`;

// ---------------------------------------------------------------------------
// Factorisation over Z (roots are rational: every factor here is linear, x, or has no rational root)

interface Fac {
  f: P;
  e: number;
}

function divisors(n: number): number[] {
  const out: number[] = [];
  for (let d = 1; d <= Math.abs(n); d++) if (n % d === 0) out.push(d);
  return out;
}

/** p = c * product of primitive factors with positive leading coefficient, irreducible over Z. */
function factorPoly(p: P): { c: Rational; fs: Fac[] } {
  const t = trim(p);
  const deg = polyDegree(t);
  if (deg < 0) throw new Error("factorPoly: zero polynomial");
  let L = 1;
  for (const c of t) L = lcm(L, c.den);
  const ints = t.map((c) => c.mul(q(L)).num);
  let g = 0;
  for (const n of ints) g = gcd(g, n);
  const sign = ints[deg] < 0 ? -1 : 1;
  const c = q(sign * g, L);
  let prim: P = ints.map((n) => q((sign * n) / g));
  const fs: Fac[] = [];
  const add = (f: P) => {
    const k = keyP(f);
    const old = fs.find((x) => keyP(x.f) === k);
    if (old) old.e++;
    else fs.push({ f: trim(f), e: 1 });
  };
  while (polyDegree(prim) > 0 && prim[0].isZero()) {
    add(X);
    prim = prim.slice(1);
  }
  for (;;) {
    const d = polyDegree(prim);
    if (d <= 0) break;
    if (d === 1) {
      add(prim);
      break;
    }
    let found: P | null = null;
    const a0 = prim[0].num;
    const an = prim[d].num;
    outer: for (const n of divisors(a0))
      for (const dd of divisors(an))
        for (const s of [1, -1]) {
          const r = q(s * n, dd);
          if (evalAt(prim, r).isZero()) {
            found = [q(-r.num), q(r.den)];
            break outer;
          }
        }
    if (!found) {
      if (d >= 4)
        throw new Error("factorPoly: degree 4 without rational roots");
      add(prim);
      break;
    }
    add(found);
    prim = pdiv(prim, found)!;
  }
  return { c, fs };
}

/** Rational roots of p, each once, in the order of the factors. */
function roots(p: P): Rational[] {
  return factorPoly(p)
    .fs.filter((f) => polyDegree(f.f) === 1)
    .map((f) => f.f[0].neg().div(f.f[1]));
}

// ---------------------------------------------------------------------------
// Rational functions: c * product of factors with integer exponents (negative = denominator)

interface RF {
  c: Rational;
  fs: Fac[];
}

const rootOf = (f: P): number => {
  const r = f[0].neg().div(f[1]);
  return r.num / r.den;
};

function facOrder(a: Fac, b: Fac): number {
  if (isX(a.f) !== isX(b.f)) return isX(a.f) ? -1 : 1;
  const da = polyDegree(a.f);
  const db = polyDegree(b.f);
  if (da !== db) return da - db;
  if (da === 1) return rootOf(b.f) - rootOf(a.f);
  return keyP(a.f) < keyP(b.f) ? -1 : 1;
}

function rfNorm(c: Rational, facs: Fac[]): RF {
  if (c.isZero()) return { c: ZERO, fs: [] };
  const fs: Fac[] = [];
  for (const f of facs) {
    const old = fs.find((x) => keyP(x.f) === keyP(f.f));
    if (old) old.e += f.e;
    else fs.push({ f: f.f, e: f.e });
  }
  return { c, fs: fs.filter((f) => f.e !== 0).sort(facOrder) };
}

function rfFrom(n: P, d: P): RF {
  if (polyIsZero(n)) return { c: ZERO, fs: [] };
  const N = factorPoly(n);
  const D = factorPoly(d);
  return rfNorm(N.c.div(D.c), [
    ...N.fs,
    ...D.fs.map((f) => ({ f: f.f, e: -f.e })),
  ]);
}

const rfOf = (p: P): RF => rfFrom(p, cst(1));
const rfMul = (a: RF, b: RF): RF => rfNorm(a.c.mul(b.c), [...a.fs, ...b.fs]);
const rfInv = (a: RF): RF =>
  rfNorm(
    ONE.div(a.c),
    a.fs.map((f) => ({ f: f.f, e: -f.e })),
  );
const rfNeg = (a: RF): RF => rfNorm(a.c.neg(), a.fs);
const rfPow = (a: RF, n: number): RF =>
  rfNorm(
    a.c.isZero() ? ZERO : ratPow(a.c, n),
    a.fs.map((f) => ({ f: f.f, e: f.e * n })),
  );
const rfScale = (a: RF, k: Rational): RF => rfNorm(a.c.mul(k), a.fs);

function ratPow(r: Rational, n: number): Rational {
  let out = ONE;
  for (let i = 0; i < n; i++) out = out.mul(r);
  return out;
}

const rfNum = (a: RF): P =>
  mulAll(cst(a.c.num), ...a.fs.filter((f) => f.e > 0).map((f) => pw(f.f, f.e)));
const rfDen = (a: RF): P =>
  mulAll(
    cst(a.c.den),
    ...a.fs.filter((f) => f.e < 0).map((f) => pw(f.f, -f.e)),
  );

function rfAdd(a: RF, b: RF): RF {
  return rfFrom(
    polyAdd(polyMul(rfNum(a), rfDen(b)), polyMul(rfNum(b), rfDen(a))),
    polyMul(rfDen(a), rfDen(b)),
  );
}
const fracRF = (n: P, d: P): RF => rfFrom(n, d);

/** A product in the lesson's form: "2x(x - 2)", "(x - 3)(x + 3)", "x + 1", "4x^2", "3". */
function prodTex(k: number, fs: Fac[]): string {
  if (fs.length === 0) return `${k}`;
  const alone = k === 1 && fs.length === 1;
  const body = fs
    .map((f) => {
      if (isX(f.f)) return f.e > 1 ? `x^${f.e}` : "x";
      if (alone && f.e === 1) return pt(f.f);
      return `(${pt(f.f)})${f.e > 1 ? `^${f.e}` : ""}`;
    })
    .join("");
  return (k === 1 ? "" : `${k}`) + body;
}

const hasTopSum = (s: string): boolean => !s.includes("(") && / [+-] /.test(s);

function rfLatex(a: RF): string {
  if (a.c.isZero()) return "0";
  const sign = a.c.sign() < 0 ? "-" : "";
  const num = prodTex(
    Math.abs(a.c.num),
    a.fs.filter((f) => f.e > 0),
  );
  const denFs = a.fs.filter((f) => f.e < 0).map((f) => ({ f: f.f, e: -f.e }));
  const den = prodTex(a.c.den, denFs);
  if (den === "1") return sign && hasTopSum(num) ? `-(${num})` : sign + num;
  return `${sign}${fr(num, den)}`;
}

function polySym(p: P): string {
  const ts = terms(p);
  if (ts.length === 0) return "0";
  return ts.map(([c, d]) => `(${c.toString()})*x**${d}`).join(" + ");
}

function rfSympy(a: RF): string {
  if (a.c.isZero()) return "0";
  return [
    `(${a.c.toString()})`,
    ...a.fs.map((f) => `(${polySym(f.f)})**(${f.e})`),
  ].join("*");
}

/** The factored form of a polynomial, for the steps: "(x - 3)(x + 3)", "-(x - 1)(x + 1)", "2(x - 3)". */
const ft = (p: P): string => rfLatex(rfOf(p));

const rfOpt = (a: RF): Opt => ({
  latex: rfLatex(a),
  value: rfSympy(a),
  key: rfLatex(a),
});

// ---------------------------------------------------------------------------
// Conditions of existence

function ceValues(ps: P[]): Rational[] {
  const out: Rational[] = [];
  for (const p of ps)
    for (const r of roots(p)) if (!out.some((o) => o.equals(r))) out.push(r);
  return out;
}

const ceTex = (vs: Rational[]): string =>
  vs.map((v) => `x \\neq ${v.toLatex()}`).join(",\\ ");
const ceSorted = (vs: Rational[]): Rational[] =>
  [...vs].sort((a, b) => a.compare(b));

// ---------------------------------------------------------------------------
// Pieces of the steps

/** N times the quotient Q of the MCM, as written in the numerator: "2(x - 3)", "(x + 1)(x - 2)", "3x". */
function mulTex(N: P, Q: P): string {
  const nConst = polyDegree(N) <= 0;
  const qConst = polyDegree(Q) <= 0;
  if (qConst) {
    const k = Q[0];
    if (k.isOne()) return pt(N);
    return nConst ? `${pt(N)} \\cdot ${pt(Q)}` : `${pt(Q)}(${pt(N)})`;
  }
  if (isX(Q))
    return nConst ? (N[0].isOne() ? "x" : `${pt(N)}x`) : `x(${pt(N)})`;
  if (nConst) return N[0].isOne() ? `(${pt(Q)})` : `${pt(N)}(${pt(Q)})`;
  if (isX(N)) return `x(${pt(Q)})`;
  return `(${pt(N)})(${pt(Q)})`;
}

/** "t1 - t2" with the second product after its operator. */
const joinOp = (a: string, op: "+" | "-", b: string): string =>
  `${a} ${op} ${b}`;

/** Expanded products in sequence, with the sign of the operator distributed: the lesson's second line. */
const expandedSeq = (a: P, op: "+" | "-", b: P): string =>
  seqTex([...terms(a), ...terms(op === "-" ? neg(b) : b)]);

/** The minus distributed only on the first term: the mistake of the lesson's first warning. */
function firstSignOnly(b: P): P {
  const ts = terms(b);
  const out: P = Array.from({ length: b.length }, () => ZERO);
  ts.forEach(([c, d], i) => (out[d] = i === 0 ? c.neg() : c));
  return out;
}

function scomponiStep(ps: P[]): string | null {
  // an opposite (negative first coefficient) is shown as the text writes it: 16 - x^2
  const shown = (p: P) => (p[polyDegree(p)].sign() < 0 ? asc(p) : pt(p));
  const parts = ps
    .filter((p) => ft(p) !== pt(p))
    .map((p) => `${shown(p)} = ${ft(p)}`);
  return parts.length ? `\\text{Scomponi: } ${parts.join(" \\qquad ")}` : null;
}

const ceStep = (vs: Rational[]): string => `\\text{C.E.: } ${ceTex(vs)}`;
const resultStep = (R: RF, vs: Rational[]): string =>
  `\\text{Risultato: } ${rfLatex(R)} \\text{ con C.E. } ${ceTex(vs)}`;

/** Last step of a sum: simplify, collect a number, or say there is nothing to simplify. */
function closeSum(T: P, M: P, R: RF): string[] {
  const MT = ft(M);
  const plain = fr(pt(T), MT);
  if (rfLatex(R) === plain)
    return [
      "\\text{Il numeratore non ha fattori in comune con il denominatore}",
    ];
  const Tf = ft(T);
  const simplified = polyDegree(rfDen(R)) < polyDegree(M);
  if (simplified)
    return [
      `\\text{Scomponi il numeratore e semplifica: } ${fr(Tf, MT)} = ${rfLatex(R)}`,
    ];
  const what =
    Math.abs(factorPoly(T).c.num) === 1
      ? "Il segno meno va davanti alla frazione"
      : "Raccogli nel numeratore";
  return [
    `\\text{${what}: } ${plain} = ${rfLatex(R)}`,
    "\\text{Il numeratore non ha fattori in comune con il denominatore}",
  ];
}

// ---------------------------------------------------------------------------
// Parameters and construction

type Op = "+" | "-";

interface Params {
  case: string;
  op?: Op;
  a?: number;
  b?: number;
  c?: number;
  d?: number;
  /** numerators as [p, c] = p x + c */
  n1?: [number, number];
  n2?: [number, number];
  k?: number;
  m?: number;
  j?: number;
  i?: number;
  h?: "x" | "lin" | "num";
  tpl?: string;
  d3?: "aa" | "bb" | "ab";
  dv?: "uu" | "uv";
  s?: number;
  ask?: "risultato" | "condizioni";
}

interface Built {
  problem: string;
  value: RF;
  ce: Rational[];
  steps: string[];
  cands: (RF | null)[];
  /** C.E. question: wrong sets of excluded values, in order of preference. */
  ceCands?: Rational[][];
  /** Every polynomial written in the text, for the size limits. */
  shown: P[];
  /** The case as the text shows it (recomputed, compared with params.case). */
  kind: string;
}

const nz = (rng: Rng, a: number, b: number, not: number[] = []): number => {
  for (;;) {
    const v = rng.int(a, b);
    if (v !== 0 && !not.includes(v)) return v;
  }
};
const sgnOp = (op: Op): 1 | -1 => (op === "+" ? 1 : -1);
const flip = (op: Op): Op => (op === "+" ? "-" : "+");
const opOf = (s: number): Op => (s > 0 ? "+" : "-");

function pick(rng: Rng, level: number): Params {
  switch (level) {
    case 1: {
      const simp = rng.next() < 0.6;
      const op: Op = rng.next() < 0.75 ? "-" : "+";
      const a = nz(rng, -6, 6);
      if (simp) {
        for (;;) {
          const k = nz(rng, -4, 4);
          const r = rng.int(1, 5);
          const s = nz(rng, -9, 9);
          // A op B = k(x - a)
          const p = op === "-" ? k + r : k - r;
          const c = op === "-" ? -k * a + s : -k * a - s;
          if (p >= 1 && Math.abs(c) <= 12)
            return { case: "si semplifica", op, a, n1: [p, c], n2: [r, s] };
        }
      }
      return {
        case: "non si semplifica",
        op,
        a,
        n1: [rng.int(1, 6), nz(rng, -9, 9)],
        n2: [rng.int(1, 6), nz(rng, -9, 9)],
      };
    }
    case 2: {
      const op: Op = rng.next() < 0.5 ? "+" : "-";
      const a = rng.int(-6, 6);
      const b = rng.int(-6, 6);
      if (rng.next() < 0.7)
        return {
          case: "numeratori numeri",
          op,
          a,
          b,
          n1: [0, rng.int(1, 6)],
          n2: [0, rng.int(1, 6)],
        };
      const lx = rng.next() < 0.5;
      const n: [number, number] = [1, rng.int(-5, 5)];
      const c: [number, number] = [0, rng.int(1, 6)];
      return {
        case: "un numeratore con la x",
        op,
        a,
        b,
        n1: lx ? n : c,
        n2: lx ? c : n,
      };
    }
    case 3: {
      const simp = rng.next() < 0.5;
      if (rng.next() < 0.5) {
        // D1 = (x - a)(x - b), D2 = (x - a) h, with h = x, x - c or a number m
        const a = nz(rng, -5, 5);
        const b = rng.next() < 0.4 ? -a : nz(rng, -5, 5, [a]);
        const u = rng.next();
        const h: "x" | "lin" | "num" = u < 0.4 ? "x" : u < 0.75 ? "lin" : "num";
        const c = h === "lin" ? nz(rng, -5, 5, [a, b]) : 0;
        const m = h === "num" ? rng.int(2, 3) : 1;
        const hv = h === "x" ? a : h === "lin" ? a - c : m;
        const gv = a - b;
        if (simp) {
          const G = gcd(gv, hv);
          const t = rng.int(1, 2);
          const s = -Math.sign(gv * hv);
          return {
            case: "fattore comune, si semplifica",
            tpl: "comune",
            a,
            b,
            c,
            m,
            h,
            op: opOf(s),
            n1: [0, (t * Math.abs(gv)) / G],
            n2: [0, (t * Math.abs(hv)) / G],
          };
        }
        return {
          case: "fattore comune, non si semplifica",
          tpl: "comune",
          a,
          b,
          c,
          m,
          h,
          op: rng.next() < 0.5 ? "+" : "-",
          n1: [0, rng.int(1, 6)],
          n2: [0, rng.int(1, 6)],
        };
      }
      // D1 = (x - a)(x - b), D2 = a - x, with a > 0 as the lesson writes it (3 - x)
      const a = rng.int(1, 5);
      const b = rng.next() < 0.5 ? -a : nz(rng, -5, 5, [a]);
      const op: Op = rng.next() < 0.5 ? "+" : "-";
      const c2 = rng.int(1, simp ? 3 : 5);
      const p = rng.next() < 0.75 ? 1 : 0;
      if (simp) {
        // effective second fraction -c2/(x - a): T = N1 - s c2 (x - b), zero at x = a
        const s = sgnOp(op);
        const n1a = s * c2 * (a - b);
        return {
          case: "fattori opposti, si semplifica",
          tpl: "opposti",
          a,
          b,
          op,
          n1: [1, n1a - a],
          n2: [0, c2],
        };
      }
      return {
        case: "fattori opposti, non si semplifica",
        tpl: "opposti",
        a,
        b,
        op,
        n1: [p, p ? rng.int(-9, 9) : rng.int(1, 9)],
        n2: [0, c2],
      };
    }
    case 4: {
      const u = rng.next();
      if (u < 0.35) {
        const a = nz(rng, -5, 5);
        const b = rng.next() < 0.4 ? -a : nz(rng, -5, 5, [a]);
        const sq = rng.next() < 0.5;
        const g = rng.int(2, 3);
        const j = rng.int(1, 2);
        return {
          case: "monomi",
          tpl: "monomi",
          a,
          b,
          c: sq ? b : nz(rng, -5, 5, [a, b]),
          k: g * rng.int(1, 2),
          m: g * rng.int(1, 4),
          j,
          i: rng.pick([1, 2, 3].filter((e) => e !== j)),
        };
      }
      if (u < 0.7) {
        const a = rng.int(1, 5);
        return {
          case: "fattori opposti",
          tpl: "opposti",
          a,
          s: rng.next() < 0.6 ? 1 : -1,
          b: nz(rng, -6, 6, [a, -a]),
          k: rng.int(1, 3),
          j: rng.int(0, 1),
        };
      }
      const a = nz(rng, -5, 5);
      const b = nz(rng, -5, 5, [a]);
      const c = nz(rng, -5, 5, [a, b]);
      const d = nz(rng, -5, 5, [a, b, c]);
      return { case: "trinomi", tpl: "trinomi", a, b, c, d, k: rng.int(1, 3) };
    }
    case 5: {
      const ask = rng.next() < 0.4 ? "condizioni" : "risultato";
      const u = rng.next();
      const a = nz(rng, -5, 5);
      const b = rng.next() < 0.35 ? -a : nz(rng, -5, 5, [a]);
      const c = nz(rng, -5, 5, [a, b]);
      if (u < 0.4)
        return {
          case: ask,
          ask,
          tpl: "divisore di primo grado",
          a,
          b,
          c,
          k: rng.int(1, 3),
          m: rng.int(1, 3),
          j: rng.int(1, 2),
        };
      if (u < 0.7)
        return {
          case: ask,
          ask,
          tpl: "divisore monomio",
          a,
          b,
          k: rng.int(1, 9),
          m: rng.int(1, 9),
          j: rng.int(1, 2),
        };
      return {
        case: ask,
        ask,
        tpl: "risultato intero",
        a,
        b,
        c,
        k: rng.int(2, 5),
      };
    }
    case 6: {
      const u = rng.next();
      const d3 = u < 0.4 ? "aa" : u < 0.8 ? "bb" : "ab";
      // the number m of the divisor's numerator divides the content of the bracket's numerator
      const withM = (pr: Params): Params => {
        const f = lin(pr.a!);
        const g = lin(pr.b!);
        const N1 = pr.case === "quadrati" ? g : np(pr.n1!);
        const N2 = pr.case === "quadrati" ? f : np(pr.n2!);
        const T =
          pr.op === "+"
            ? polyAdd(polyMul(N1, g), polyMul(N2, f))
            : polySub(polyMul(N1, g), polyMul(N2, f));
        const t = polyIsZero(T) ? 1 : Math.abs(factorPoly(T).c.num);
        return { ...pr, m: rng.pick(divisors(t).filter((x) => x <= 4)) };
      };
      if (rng.next() < 0.55) {
        const a = rng.int(-5, 5);
        const b = rng.int(-5, 5);
        const op: Op = rng.next() < 0.5 ? "+" : "-";
        const c1 = rng.int(1, 5);
        // same numbers with the minus: the bracket is a number, as in example 8
        const c2 = op === "-" && rng.next() < 0.4 ? c1 : rng.int(1, 5);
        return withM({
          case: "numeri",
          op,
          a,
          b,
          n1: [0, c1],
          n2: [0, c2],
          d3,
        });
      }
      const a = nz(rng, -5, 5);
      let b = -a;
      if (rng.next() < 0.5)
        do b = a + 2 * nz(rng, -3, 3);
        while (Math.abs(b) > 5);
      return withM({ case: "quadrati", op: "-", a, b, d3 });
    }
    case 7: {
      const beta = nz(rng, -4, 4);
      const alpha = rng.next() < 0.35 ? -beta : rng.int(-4, 4);
      const dv = rng.next() < 0.6 ? "uu" : "uv";
      if (rng.next() < 0.5) {
        const prod = (beta - alpha) * 2 * beta;
        return {
          case: "si semplifica",
          a: alpha,
          b: beta,
          dv,
          s: Math.sign(prod),
          k: Math.abs(prod),
        };
      }
      return {
        case: "non si semplifica",
        a: alpha,
        b: beta,
        dv,
        s: rng.next() < 0.5 ? 1 : -1,
        k: rng.int(1, 12),
      };
    }
    default:
      throw new Error(`${ID}: unknown level ${level}`);
  }
}

const np = (n: [number, number]): P =>
  n[0] === 0 ? cst(n[1]) : linP(n[0], n[1]);
const monoP = (k: number, j: number): P => mulAll(cst(k), pw(X, j));

function level1(pr: Params): Built {
  const op = pr.op!;
  const D = lin(pr.a!);
  const A = np(pr.n1!);
  const B = np(pr.n2!);
  const T = op === "-" ? polySub(A, B) : polyAdd(A, B);
  const R = fracRF(T, D);
  const Dt = pt(D);
  const ce = ceValues([D]);
  const steps = [ceStep(ce)];
  if (op === "-") {
    steps.push(
      `\\text{Il meno vale per tutto il secondo numeratore: } ${fr(`${pt(A)} - (${pt(B)})`, Dt)} = ${fr(expandedSeq(A, "-", B), Dt)} = ${fr(pt(T), Dt)}`,
    );
  } else
    steps.push(
      `\\text{Somma i numeratori: } ${fr(`${pt(A)} + ${pt(B)}`, Dt)} = ${fr(pt(T), Dt)}`,
    );
  steps.push(...closeSum(T, D, R), resultStep(R, ce));
  const cands: RF[] = [];
  if (op === "-") {
    cands.push(
      fracRF(polyAdd(A, firstSignOnly(B)), D),
      fracRF(polyAdd(A, B), D),
    );
  } else {
    cands.push(fracRF(polySub(A, B), D), fracRF(T, polyScale(D, q(2))));
  }
  cands.push(rfNeg(R), fracRF(T, polyMul(D, D)));
  return {
    problem: `${fr(pt(A), Dt)} ${op} ${fr(pt(B), Dt)}`,
    value: R,
    ce,
    steps,
    cands,
    shown: [A, B, D],
    kind: vanishes(T, pr.a!) ? "si semplifica" : "non si semplifica",
  };
}

/** Two fractions N1/D1 op N2/D2 over the common denominator M, with the quotients Q1 and Q2. */
function sumSteps(
  N1: P,
  Q1: P,
  op: Op,
  N2: P,
  Q2: P,
  M: P,
): { T: P; steps: string[] } {
  const T =
    op === "+"
      ? polyAdd(polyMul(N1, Q1), polyMul(N2, Q2))
      : polySub(polyMul(N1, Q1), polyMul(N2, Q2));
  const MT = ft(M);
  const first = fr(joinOp(mulTex(N1, Q1), op, mulTex(N2, Q2)), MT);
  const second = fr(expandedSeq(polyMul(N1, Q1), op, polyMul(N2, Q2)), MT);
  const third = fr(pt(T), MT);
  const chain = [first, second, third].filter(
    (s, i, xs) => i === 0 || s !== xs[i - 1],
  );
  return {
    T,
    steps: [
      `\\text{Denominatore comune: } ${MT}`,
      `\\text{Numeratore: } ${chain.join(" = ")}`,
    ],
  };
}

function level2(pr: Params): Built {
  const op = pr.op!;
  const D1 = lin(pr.a!);
  const D2 = lin(pr.b!);
  const N1 = np(pr.n1!);
  const N2 = np(pr.n2!);
  const M = polyMul(D1, D2);
  const ce = ceValues([D1, D2]);
  const { T, steps } = sumSteps(N1, D2, op, N2, D1, M);
  const R = fracRF(T, M);
  const signOk =
    op === "-"
      ? fracRF(polyAdd(polyMul(N1, D2), firstSignOnly(polyMul(N2, D1))), M)
      : null;
  const swapped = fracRF(
    op === "+"
      ? polyAdd(polyMul(N1, D1), polyMul(N2, D2))
      : polySub(polyMul(N1, D1), polyMul(N2, D2)),
    M,
  );
  const summed = op === "+" ? fracRF(polyAdd(N1, N2), polyAdd(D1, D2)) : null;
  const onlyNum = fracRF(op === "+" ? polyAdd(N1, N2) : polySub(N1, N2), M);
  return {
    problem: `${fr(pt(N1), pt(D1))} ${op} ${fr(pt(N2), pt(D2))}`,
    value: R,
    ce,
    steps: [ceStep(ce), ...steps, ...closeSum(T, M, R), resultStep(R, ce)],
    cands: [summed, signOk, swapped, onlyNum, rfNeg(R)],
    shown: [N1, N2, D1, D2],
    kind:
      polyDegree(N1) === 0 && polyDegree(N2) === 0
        ? "numeratori numeri"
        : "un numeratore con la x",
  };
}

function level3(pr: Params): Built {
  const a = pr.a!;
  const b = pr.b!;
  const f = lin(a);
  const g = lin(b);
  const N1 = np(pr.n1!);
  const N2 = np(pr.n2!);
  const op = pr.op!;
  const D1 = polyMul(f, g);
  if (pr.tpl === "comune") {
    const h = pr.h === "x" ? X : pr.h === "lin" ? lin(pr.c!) : cst(pr.m!);
    const D2 = polyMul(f, h);
    const M = mulAll(f, g, h);
    const ce = ceValues([D1, D2]);
    const { T, steps } = sumSteps(N1, h, op, N2, g, M);
    const R = fracRF(T, M);
    const signOk =
      op === "-"
        ? fracRF(polyAdd(polyMul(N1, h), firstSignOnly(polyMul(N2, g))), M)
        : null;
    const swapped = fracRF(
      op === "+"
        ? polyAdd(polyMul(N1, g), polyMul(N2, h))
        : polySub(polyMul(N1, g), polyMul(N2, h)),
      M,
    );
    const onlyNum = fracRF(op === "+" ? polyAdd(N1, N2) : polySub(N1, N2), M);
    const simp = vanishes(T, a);
    return {
      problem: `${fr(pt(N1), pt(D1))} ${op} ${fr(pt(N2), pt(D2))}`,
      value: R,
      ce,
      steps: [
        scomponiStep([D1, D2])!,
        ceStep(ce),
        ...steps,
        ...closeSum(T, M, R),
        resultStep(R, ce),
      ],
      cands: [onlyNum, swapped, signOk, rfNeg(R)],
      shown: [N1, N2, D1, D2],
      kind: `fattore comune, ${simp ? "si semplifica" : "non si semplifica"}`,
    };
  }
  // opposite factors: N2/(a - x) = -N2/(x - a)
  const D2 = neg(f);
  const op2 = flip(op);
  const M = D1;
  const ce = ceValues([D1, D2]);
  const { T, steps } = sumSteps(N1, cst(1), op2, N2, g, M);
  const R = fracRF(T, M);
  const opp = [
    scomponiStep([D1])!,
    `\\text{Fattori opposti: } ${fr(pt(N2), asc(D2))} = -${fr(pt(N2), pt(f))}`,
    ceStep(ce),
    `\\text{Si riscrive: } ${fr(pt(N1), ft(D1))} ${op2} ${fr(pt(N2), pt(f))}`,
  ];
  const ignored = fracRF(
    op === "+" ? polyAdd(N1, polyMul(N2, g)) : polySub(N1, polyMul(N2, g)),
    M,
  );
  const signOk =
    op2 === "-" ? fracRF(polyAdd(N1, firstSignOnly(polyMul(N2, g))), M) : null;
  const onlyNum = fracRF(op2 === "+" ? polyAdd(N1, N2) : polySub(N1, N2), M);
  const simp = vanishes(T, a) || vanishes(T, b);
  return {
    problem: `${fr(pt(N1), pt(D1))} ${op} ${fr(pt(N2), asc(D2))}`,
    value: R,
    ce,
    steps: [...opp, ...steps, ...closeSum(T, M, R), resultStep(R, ce)],
    cands: [ignored, signOk, onlyNum, rfNeg(R)],
    shown: [N1, N2, D1, D2],
    kind: `fattori opposti, ${simp ? "si semplifica" : "non si semplifica"}`,
  };
}

/** A/B · C/D or A/B : C/D with texts; `dTex` lets a denominator be written in increasing powers. */
interface Two {
  A: P;
  B: P;
  C: P;
  D: P;
  bTex?: string;
  dTex?: string;
}

function level4(pr: Params): Built {
  let t: Two;
  const cands: (RF | null)[] = [];
  if (pr.tpl === "monomi") {
    const f1 = lin(pr.a!);
    const f2 = lin(pr.b!);
    const f3 = lin(pr.c!);
    t = {
      A: polyMul(f1, f2),
      B: monoP(pr.k!, pr.j!),
      C: monoP(pr.m!, pr.i!),
      D: polyMul(f2, f3),
    };
  } else if (pr.tpl === "opposti") {
    const a = pr.a!;
    const A = lin(pr.s! * a);
    const B = lin(pr.b!);
    const C = mulAll(cst(pr.k!), pw(X, pr.j!), B);
    const D = neg(polyMul(lin(a), lin(-a)));
    t = { A, B, C, D, dTex: asc(D) };
  } else {
    const f1 = lin(pr.a!);
    const f2 = lin(pr.b!);
    const f3 = lin(pr.c!);
    const f4 = lin(pr.d!);
    t = {
      A: polyMul(f1, f2),
      B: polyMul(X, f3),
      C: polyScale(f3, q(pr.k!)),
      D: polyMul(f1, f4),
    };
  }
  const { A, B, C, D } = t;
  const R = rfMul(fracRF(A, B), fracRF(C, D));
  const ce = ceValues([B, D]);
  const bT = t.bTex ?? pt(B);
  const dT = t.dTex ?? pt(D);
  const sc = scomponiStep(
    [A, B, C, D].filter((p) => polyDegree(p) >= 2 || maxCoef(p) > 1),
  );
  const steps = [
    ...(sc ? [sc] : []),
    ceStep(ce),
    `\\text{Semplifica in croce e moltiplica: } ${fr(ft(A), ft(B))} \\cdot ${fr(ft(C), ft(D))} = ${rfLatex(R)}`,
    resultStep(R, ce),
  ];
  if (pr.tpl === "monomi") {
    cands.push(rfScale(R, q(pr.k! * pr.k!, pr.m! * pr.m!))); // numbers simplified upside down
    if (pr.b === pr.c) cands.push(rfMul(R, rfOf(lin(pr.b!))));
    cands.push(rfMul(R, rfOf(X)), rfMul(R, rfInv(rfOf(X))));
  }
  cands.push(rfNeg(R));
  if (pr.tpl === "opposti")
    cands.push(
      rfMul(rfNeg(R), rfOf(X)),
      rfMul(rfNeg(R), fracRF(lin(-pr.s! * pr.a!), lin(pr.s! * pr.a!))),
    );
  if (pr.tpl === "trinomi")
    cands.push(
      fracRF(mulAll(cst(pr.k!), lin(pr.b!)), lin(pr.d!)),
      rfMul(R, fracRF(lin(pr.d!), lin(pr.b!))),
      rfMul(rfNeg(R), rfOf(X)),
    );
  return {
    problem: `${fr(pt(A), bT)} \\cdot ${fr(pt(C), dT)}`,
    value: R,
    ce,
    steps,
    cands,
    shown: [A, B, C, D],
    kind: pr.tpl === "opposti" ? "fattori opposti" : pr.tpl!,
  };
}

function level5(pr: Params): Built {
  let t: Two;
  const a = pr.a!;
  const b = pr.b!;
  if (pr.tpl === "divisore di primo grado") {
    // A = f1 f2, B = x f3, C = k f1, D = m x^j
    t = {
      A: polyMul(lin(a), lin(b)),
      B: polyMul(X, lin(pr.c!)),
      C: polyScale(lin(a), q(pr.k!)),
      D: monoP(pr.m!, pr.j!),
    };
  } else if (pr.tpl === "divisore monomio") {
    // A = k x^j, B = f1, C = m x^(j+1), D = f1 f2
    t = {
      A: monoP(pr.k!, pr.j!),
      B: lin(a),
      C: monoP(pr.m!, pr.j! + 1),
      D: polyMul(lin(a), lin(b)),
    };
  } else {
    // A = f1 f2, B = k f3, C = f2, D = x f3
    t = {
      A: polyMul(lin(a), lin(b)),
      B: polyScale(lin(pr.c!), q(pr.k!)),
      C: lin(b),
      D: polyMul(X, lin(pr.c!)),
    };
  }
  const { A, B, C, D } = t;
  const R = rfMul(fracRF(A, B), fracRF(D, C));
  const ce = ceValues([B, D, C]);
  const sc = scomponiStep(
    [A, B, C, D].filter((p) => polyDegree(p) >= 2 || maxCoef(p) > 1),
  );
  const steps = [
    ...(sc ? [sc] : []),
    `\\text{C.E.: dai denominatori } ${ceTex(ceValues([B, D]))}\\text{; dal numeratore del divisore } ${ceTex(ceValues([C]))}`,
    `\\text{Moltiplica per il reciproco del divisore: } ${fr(ft(A), ft(B))} \\cdot ${fr(ft(D), ft(C))} = ${rfLatex(R)}`,
    resultStep(R, ce),
  ];
  const noRecip = rfMul(fracRF(A, B), fracRF(C, D));
  const recip = rfInv(R);
  const withoutDivisor = ceValues([B, D]);
  const resultOnly = ceValues([rfDen(R)]);
  const all = ceValues([B, D, C, A]);
  const flipped = ce.map((v) => v.neg());
  const dropOne = ce.slice(1);
  return {
    problem: `${fr(pt(A), pt(B))} : ${fr(pt(C), pt(D))}`,
    value: R,
    ce,
    steps,
    cands: [noRecip, recip, rfNeg(R), rfNeg(noRecip)],
    ceCands: [withoutDivisor, resultOnly, all, flipped, dropOne],
    shown: [A, B, C, D],
    kind: pr.ask!,
  };
}

function level6(pr: Params): Built {
  const a = pr.a!;
  const b = pr.b!;
  const f = lin(a);
  const g = lin(b);
  const op = pr.op!;
  const N1 = pr.case === "quadrati" ? g : np(pr.n1!);
  const N2 = pr.case === "quadrati" ? f : np(pr.n2!);
  const M = polyMul(f, g);
  const T =
    op === "+"
      ? polyAdd(polyMul(N1, g), polyMul(N2, f))
      : polySub(polyMul(N1, g), polyMul(N2, f));
  const Tf = factorPoly(T);
  const Pp = mulAll(...Tf.fs.map((x) => pw(x.f, x.e)));
  const N3 = polyScale(Pp, q(pr.m!));
  const D3 =
    pr.d3 === "aa" ? polyMul(f, f) : pr.d3 === "bb" ? polyMul(g, g) : M;
  const paren = fracRF(T, M);
  const div = fracRF(N3, D3);
  const R = rfMul(paren, rfInv(div));
  const ce = ceValues([f, g, D3, N3]);
  const MT = ft(M);
  const sq = pr.case === "quadrati";
  const first = sq
    ? fr(`(${pt(N1)})^2 - (${pt(N2)})^2`, MT)
    : fr(joinOp(mulTex(N1, g), op, mulTex(N2, f)), MT);
  const chain = [
    first,
    fr(expandedSeq(polyMul(N1, g), op, polyMul(N2, f)), MT),
    fr(pt(T), MT),
  ];
  const sc = scomponiStep([D3, N3]);
  const steps = [
    ...(sc ? [sc] : []),
    ceStep(ce),
    `\\text{Prima la parentesi: } ${chain.join(" = ")}`,
    `\\text{Poi la divisione: } ${fr(ft(T), MT)} \\cdot ${pt(N3) === "1" ? ft(D3) : fr(ft(D3), ft(N3))} = ${rfLatex(R)}`,
    resultStep(R, ce),
  ];
  const noRecip = rfMul(paren, div);
  const signErr =
    op === "-"
      ? rfMul(
          fracRF(polyAdd(polyMul(N1, g), firstSignOnly(polyMul(N2, f))), M),
          rfInv(div),
        )
      : null;
  const inner = `${fr(pt(N1), pt(f))} ${op} ${fr(pt(N2), pt(g))}`;
  return {
    problem: `\\left(${inner}\\right) : ${fr(pt(N3), pt(D3))}`,
    value: R,
    ce,
    steps,
    cands: [noRecip, signErr, rfInv(R), rfNeg(R)],
    shown: [N1, N2, f, g, N3, D3],
    kind: sq ? "quadrati" : "numeri",
  };
}

function level7(pr: Params): Built {
  const alpha = pr.a!;
  const beta = pr.b!;
  const u = lin(alpha);
  const v = lin(beta);
  const w = lin(-beta);
  const c = alpha - beta;
  const s = pr.s!;
  const k = pr.k!;
  const inner =
    c > 0 ? `1 - ${fr(`${c}`, pt(v))}` : `1 + ${fr(`${-c}`, pt(v))}`;
  const P = pr.dv === "uu" ? polyMul(u, u) : polyMul(u, v);
  const Q = pr.dv === "uu" ? polyMul(u, v) : polyMul(v, v);
  const W = neg(polyMul(v, w));
  const base = fracRF(u, v);
  const pow2 = rfPow(base, 2);
  const div = fracRF(P, Q);
  const last = rfScale(fracRF(cst(k), W), q(s));
  const quot = rfMul(pow2, rfInv(div));
  const R = rfAdd(quot, last);
  const ce = ceValues([v, Q, P, W]);
  const lastTex = `${s > 0 ? "+" : "-"} ${fr(`${k}`, asc(W))}`;
  const problem = `\\begin{aligned}&\\left(${inner}\\right)^2 : ${fr(pt(P), pt(Q))}\\\\&\\quad ${lastTex}\\end{aligned}`;
  const M = polyMul(v, w);
  const num = polySub(polyMul(u, w), cst(s * k));
  const vw = ft(M);
  const sc = scomponiStep([P, Q, W]);
  const steps = [
    ...(sc ? [sc] : []),
    ceStep(ce),
    `\\text{Prima la parentesi, poi la potenza: } ${inner} = ${fr(pt(u), pt(v))} \\qquad \\left(${fr(pt(u), pt(v))}\\right)^2 = ${rfLatex(pow2)}`,
    `\\text{Poi la divisione, che viene prima della somma: } ${rfLatex(pow2)} \\cdot ${fr(ft(Q), ft(P))} = ${rfLatex(quot)}`,
    `\\text{Infine la somma, con } ${fr(`${k}`, asc(W))} = -${fr(`${k}`, vw)}\\text{: } ${rfLatex(quot)} ${s > 0 ? "-" : "+"} ${fr(`${k}`, vw)} = ${fr(joinOp(mulTex(u, w), s > 0 ? "-" : "+", `${k}`), vw)} = ${fr(pt(num), vw)}`,
    ...closeSum(num, M, R),
    resultStep(R, ce),
  ];
  const lastIgnored = rfScale(fracRF(cst(k), M), q(s));
  const powNum = attempt(() =>
    rfAdd(rfMul(fracRF(polyMul(u, u), v), rfInv(div)), last),
  );
  const noRecip = attempt(() => rfAdd(rfMul(pow2, div), last));
  const order = attempt(() => rfMul(pow2, rfInv(rfAdd(div, last))));
  // the first numerator not multiplied by its quotient of the common denominator
  const noW = attempt(() => fracRF(polySub(u, cst(s * k)), M));
  return {
    problem,
    value: R,
    ce,
    steps,
    cands: [rfAdd(quot, lastIgnored), noW, noRecip, powNum, order, rfNeg(R)],
    shown: [v, P, Q, W],
    kind: polyDegree(rfDen(R)) < 2 ? "si semplifica" : "non si semplifica",
  };
}

/** A distractor whose computation leaves the factorisation this generator handles: none. */
function attempt(f: () => RF): RF | null {
  try {
    return f();
  } catch {
    return null;
  }
}

function derive(level: number, pr: Params): Built {
  switch (level) {
    case 1:
      return level1(pr);
    case 2:
      return level2(pr);
    case 3:
      return level3(pr);
    case 4:
      return level4(pr);
    case 5:
      return level5(pr);
    case 6:
      return level6(pr);
    case 7:
      return level7(pr);
    default:
      throw new Error(`${ID}: unknown level ${level}`);
  }
}

// ---------------------------------------------------------------------------
// Sample, checks, choice

const PROMPT_CALC = "Calcola e semplifica il risultato.";
const PROMPT_CE = "Scrivi le condizioni di esistenza dell'espressione.";

function ceOpt(vs: Rational[]): Opt {
  const s = ceSorted(vs);
  return {
    latex: ceTex(s),
    value: s.map((v) => v.toString()).join(","),
    key: s.map((v) => v.toString()).join(","),
  };
}

function ceChoice(d: Built, rng: Rng): ChoiceAnswer {
  const correct = ceOpt(d.ce);
  const cands = (d.ceCands ?? []).filter((c) => c.length > 0).map(ceOpt);
  const fallback = (i: number): Opt | null => {
    const vs = [...d.ce];
    const j = i % vs.length;
    vs[j] = vs[j].add(q(Math.ceil(i / vs.length) * (i % 2 ? 1 : -1)));
    if (new Set(vs.map((v) => v.toString())).size !== vs.length) return null;
    return ceOpt(vs);
  };
  const ch = buildChoice(correct, cands, fallback, rng);
  // values of a C.E. option: the excluded values, one per entry
  return {
    ...ch,
    options: ch.options.map((o) => ({
      latex: o.latex,
      values: o.values[0].split(","),
    })),
  };
}

function valueChoice(d: Built, rng: Rng): ChoiceAnswer {
  const R = d.value;
  const cands = d.cands.map((c) => (c && !c.c.isZero() ? rfOpt(c) : null));
  const near = (i: number): Opt | null => {
    const dk = Math.ceil(i / 2) * (i % 2 ? 1 : -1);
    const c = R.c.add(q(dk));
    if (c.isZero()) return null;
    return rfOpt(rfNorm(c, R.fs));
  };
  return buildChoice(rfOpt(R), cands, near, rng);
}

function assemble(pr: Params, level: number, rng: Rng): Sample {
  const d = derive(level, pr);
  const askCE = pr.ask === "condizioni";
  const ceT = ceTex(d.ce);
  const choice = askCE ? ceChoice(d, rng) : undefined;
  return {
    generatorId: ID,
    level,
    seed: rng.seed,
    prompt: askCE ? PROMPT_CE : PROMPT_CALC,
    problem: d.problem,
    solution: askCE
      ? `\\text{C.E.: } ${ceT}`
      : `${rfLatex(d.value)} \\qquad \\text{C.E.: } ${ceT}`,
    steps: d.steps,
    answer: askCE
      ? choice!
      : {
          kind: "expression",
          value: rfSympy(d.value),
          latex: rfLatex(d.value),
          form: "factored",
        },
    params: { ...pr, ce: d.ce.map((v) => v.toString()) },
  };
}

const CASES: Record<number, string[]> = {
  1: ["si semplifica", "non si semplifica"],
  2: ["numeratori numeri", "un numeratore con la x"],
  3: [
    "fattore comune, si semplifica",
    "fattore comune, non si semplifica",
    "fattori opposti, si semplifica",
    "fattori opposti, non si semplifica",
  ],
  4: ["monomi", "fattori opposti", "trinomi"],
  5: ["risultato", "condizioni"],
  6: ["numeri", "quadrati"],
  7: ["si semplifica", "non si semplifica"],
};

function check(sample: Sample): string[] {
  const v: string[] = [];
  const pr = sample.params as unknown as Params;
  let d: Built;
  try {
    d = derive(sample.level, pr);
  } catch (e) {
    return [`params non validi: ${(e as Error).message}`];
  }
  if (sample.problem !== d.problem) v.push("testo diverso dai parametri");
  v.push(...forbidden(d.problem));
  if (!CASES[sample.level]?.includes(pr.case))
    v.push(`caso ${pr.case} fuori dal livello ${sample.level}`);
  if (d.kind !== pr.case) v.push(`caso ${pr.case}, ma il testo è ${d.kind}`);
  for (const p of d.shown) {
    if (polyIsZero(p)) v.push("polinomio nullo nel testo");
    if (maxCoef(p) > MAX_COEF)
      v.push(`coefficiente oltre ${MAX_COEF}: ${pt(p)}`);
    if (p.some((c) => !c.isInteger())) v.push("coefficiente non intero");
  }
  // every fraction of the text is already simplified: numerator and denominator have no common factor
  const R = d.value;
  if (R.c.isZero()) v.push("risultato nullo");
  if (maxCoef(rfNum(R)) > 40 || maxCoef(rfDen(R)) > 60)
    v.push("risultato con numeri grandi");
  if (d.ce.some((x) => !x.isInteger())) v.push("C.E. con un valore non intero");
  const numDeg = polyDegree(rfNum(R));
  const denDeg = polyDegree(rfDen(R));
  if (numDeg > 2 || denDeg > 3) v.push("risultato troppo lungo");
  const lvl = sample.level;
  if (
    pr.op &&
    pr.n1 &&
    pr.n2 &&
    (lvl === 1 || lvl === 2 || lvl === 3 || lvl === 6)
  ) {
    const N1 = np(pr.n1);
    const N2 = np(pr.n2);
    if (polyDegree(N1) > 0 && N1[1].sign() < 0)
      v.push("numeratore con il primo termine negativo");
    if (polyDegree(N1) === 0 && N1[0].sign() <= 0)
      v.push("numeratore numerico non positivo");
    if (polyDegree(N2) === 0 && N2[0].sign() <= 0)
      v.push("numeratore numerico non positivo");
    if (polyDegree(N2) > 0 && N2[1].sign() < 0)
      v.push("numeratore con il primo termine negativo");
  }
  switch (lvl) {
    case 1: {
      const A = np(pr.n1!);
      const B = np(pr.n2!);
      if (polyDegree(A) !== 1 || polyDegree(B) !== 1)
        v.push("numeratori di primo grado");
      if (vanishes(A, pr.a!) || vanishes(B, pr.a!))
        v.push("una frazione del testo si semplifica da sola");
      if (keyP(A) === keyP(B)) v.push("numeratori uguali");
      if (maxCoef(A) > 12 || maxCoef(B) > 12)
        v.push("numeratori con numeri grandi");
      if (pr.case === "non si semplifica" && polyDegree(rfNum(R)) < 1)
        v.push("risultato numerico nel caso che non si semplifica");
      break;
    }
    case 2: {
      if (pr.a === pr.b) v.push("denominatori uguali");
      const N1 = np(pr.n1!);
      const N2 = np(pr.n2!);
      if (vanishes(N1, pr.a!) || vanishes(N2, pr.b!))
        v.push("una frazione del testo si semplifica da sola");
      break;
    }
    case 3: {
      const N1 = np(pr.n1!);
      const N2 = np(pr.n2!);
      if (maxCoef(N1) > 12 || maxCoef(N2) > 9)
        v.push("numeratori con numeri grandi");
      if (vanishes(N1, pr.a!) || vanishes(N1, pr.b!))
        v.push("la prima frazione del testo si semplifica da sola");
      if (pr.tpl === "comune" && pr.h === "x" && pr.b === 0)
        v.push("fattore x ripetuto");
      if (pr.a === pr.b) v.push("fattore ripetuto");
      break;
    }
    case 4: {
      if (denDeg < 1) v.push("risultato senza denominatore");
      if (pr.tpl === "monomi") {
        if (pr.j === pr.i) v.push("stesso esponente nei due monomi");
        if (gcd(pr.k!, pr.m!) === 1) v.push("nessun numero da semplificare");
        if (pr.a === pr.c) v.push("fattore ripetuto");
      }
      break;
    }
    case 5: {
      if (denDeg < 0) v.push("risultato vuoto");
      if (pr.tpl === "divisore monomio" && gcd(pr.k!, pr.m!) === 1)
        v.push("nessun numero da semplificare");
      if (d.ce.length < 3) v.push("meno di tre condizioni di esistenza");
      if (pr.ask === "condizioni") {
        const a = sample.answer;
        if (a.kind !== "choice")
          v.push("risposta delle C.E. non a scelta multipla");
      }
      break;
    }
    case 6: {
      if (pr.a === pr.b) v.push("denominatori uguali");
      if (pr.case === "quadrati" && (pr.a! + pr.b!) % 2 !== 0)
        v.push("radice del numeratore non intera");
      const f = lin(pr.a!);
      const g = lin(pr.b!);
      const N1 = pr.case === "quadrati" ? g : np(pr.n1!);
      const N2 = pr.case === "quadrati" ? f : np(pr.n2!);
      const T =
        pr.op === "+"
          ? polyAdd(polyMul(N1, g), polyMul(N2, f))
          : polySub(polyMul(N1, g), polyMul(N2, f));
      if (polyIsZero(T)) v.push("parentesi nulla");
      else if (factorPoly(T).c.num % pr.m! !== 0)
        v.push(
          "il numero del divisore non divide il numeratore della parentesi",
        );
      break;
    }
    case 7: {
      if (pr.a === pr.b) v.push("parentesi uguale a 0");
      if (pr.k! < 1 || pr.k! > 40)
        v.push("numeratore dell'ultima frazione fuori intervallo");
      break;
    }
  }
  if (pr.ask !== "condizioni") {
    const a = sample.answer;
    if (
      a.kind !== "expression" ||
      a.latex !== rfLatex(R) ||
      a.value !== rfSympy(R)
    )
      v.push("risposta diversa dal risultato");
    else v.push(...forbidden(a.latex));
  }
  return v;
}

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
  if (sample.answer.kind === "choice") return sample.answer;
  const d = derive(sample.level, sample.params as unknown as Params);
  return valueChoice(d, rng);
}

export const frazioniAlgebricheOperazioni: Generator = {
  id: ID,
  title: "Operazioni con le frazioni algebriche",
  levels: {
    1: {
      label: "Stesso denominatore",
      constraints: [
        "denominatore x - a, numeratori di primo grado",
        "tre volte su quattro una sottrazione",
        "sei volte su dieci il risultato si semplifica",
      ],
    },
    2: {
      label: "Denominatori di primo grado diversi",
      constraints: [
        "x - a e x - b primi tra loro, MCM uguale al prodotto",
        "sette volte su dieci numeratori numerici",
      ],
    },
    3: {
      label: "Denominatori da scomporre",
      constraints: [
        "un fattore comune o un fattore opposto (a - x)",
        "metà dei risultati si semplifica",
      ],
    },
    4: {
      label: "Prodotto",
      constraints: [
        "scomposizione e semplificazione in croce",
        "monomi, fattori opposti o trinomi",
      ],
    },
    5: {
      label: "Quoziente",
      constraints: [
        "C.E. anche dal numeratore del divisore",
        "quattro volte su dieci si chiedono le C.E.",
      ],
    },
    6: {
      label: "Parentesi divisa per una frazione",
      constraints: ["somma di due frazioni in parentesi, poi la divisione"],
    },
    7: {
      label: "Potenza, quoziente e somma",
      constraints: [
        "come l'esempio 10: fattori opposti nell'ultima frazione",
        "metà dei risultati si semplifica",
      ],
    },
  },
  generate(rng: Rng, level: number): Sample {
    for (let attempt = 0; attempt < 10_000; attempt++) {
      const pr = pick(rng, level);
      let sample: Sample;
      try {
        sample = assemble(pr, level, rng);
      } catch {
        continue;
      }
      if (check(sample).length === 0) return sample;
    }
    throw new Error(
      `${ID}: no valid sample for level ${level}, seed ${rng.seed}`,
    );
  },
  check,
  toChoice,
};

export default frazioniAlgebricheOperazioni;
