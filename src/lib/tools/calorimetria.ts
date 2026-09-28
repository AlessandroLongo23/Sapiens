import { fail, type Outcome } from "./types";
import {
  fmt,
  parseNumber,
  q,
  rel,
  safely,
  unit,
  unitsStep,
  vu,
  Q,
  type Datum,
  type Quantity,
  type Tagged,
  grouped,
} from "./grandezze";
import { ABSOLUTE_ZERO } from "./temperatura";

/**
 * The temperature two to five bodies reach when they exchange heat only among themselves, without changes of state:
 * the heat given by the warmer bodies equals the heat taken by the colder ones, Σ m c (T_e − T_i) = 0, so
 * T_e = Σ m c T_i / Σ m c. Exact arithmetic on rationals; temperatures in °C (a difference of 1 °C is 1 K).
 *
 * Liquid water only exists between 0 °C and 100 °C and ice only up to 0 °C: when the equilibrium would take them
 * across, part of the water would freeze, boil or melt, the latent heat enters the balance, and the tool says so
 * without computing.
 */

/**
 * Specific heats in J/(kg·K), rounded as in the tables of the school books (Amaldi, Zanichelli; CRC Handbook of
 * Chemistry and Physics), near room temperature. Ice at about −10 °C.
 */
export const SOSTANZE: { id: string; name: string; c: string }[] = [
  { id: "acqua", name: "Acqua", c: "4186" },
  { id: "ghiaccio", name: "Ghiaccio", c: "2090" },
  { id: "alluminio", name: "Alluminio", c: "880" },
  { id: "ferro", name: "Ferro", c: "450" },
  { id: "rame", name: "Rame", c: "385" },
  { id: "ottone", name: "Ottone", c: "380" },
  { id: "argento", name: "Argento", c: "235" },
  { id: "piombo", name: "Piombo", c: "129" },
  { id: "oro", name: "Oro", c: "129" },
  { id: "vetro", name: "Vetro", c: "840" },
  { id: "mercurio", name: "Mercurio", c: "140" },
  { id: "alcol", name: "Alcol etilico", c: "2440" },
  { id: "olio", name: "Olio di oliva", c: "1970" },
  { id: "altro", name: "Altro", c: "" },
];

export const MAX_CORPI = 5;

export const MASS_UNITS = [
  unit("kg", "kg", "\\text{kg}"),
  unit("g", "g", "\\text{g}", q(1, 1000)),
];
const C_TEX = "\\tfrac{\\text{J}}{\\text{kg} \\cdot \\text{K}}";
const JK = unit("", "J/K", "\\text{J/K}");
const J = unit("", "J", "\\text{J}");
const CELSIUS = unit("", "°C", "{}^\\circ\\text{C}");

/** "°C" after a temperature, in a formula. */
const tc = (x: Q) => vu(x, CELSIUS);

export interface Corpo {
  sost: string;
  name: string;
  m: Datum;
  c: Q;
  t: Q;
}

const listAt = (s: string | undefined, i: number) =>
  (s ?? "").split(";")[i] ?? "";

/** Reads the bodies from the lists in the state (m, um, s, c, t, separated by semicolons). */
export function readCorpi(state: Record<string, string>): Corpo[] | string {
  const n = (state.m ?? "").split(";").length;
  if (n < 2) return "Servono almeno due corpi.";
  if (n > MAX_CORPI) return `Al massimo ${MAX_CORPI} corpi.`;
  const out: Corpo[] = [];
  for (let i = 0; i < n; i++) {
    const k = i + 1;
    const sost =
      SOSTANZE.find((x) => x.id === listAt(state.s, i)) ??
      SOSTANZE[SOSTANZE.length - 1];
    const mq: Quantity = {
      key: `m${k}`,
      sym: `m_${k}`,
      name: `massa del corpo ${k}`,
      the: `la massa del corpo ${k}`,
      units: MASS_UNITS,
      sign: "pos",
      example: "200",
    };
    const raw = parseNumber(listAt(state.m, i));
    if (!raw) return `Scrivi la massa del corpo ${k}, per esempio 200.`;
    if (raw.sign() <= 0)
      return `La massa del corpo ${k} deve essere maggiore di zero.`;
    const u =
      MASS_UNITS.find((x) => x.id === listAt(state.um, i)) ?? MASS_UNITS[0];
    const m: Datum = {
      qt: mq,
      raw,
      unit: u,
      base: { q: raw.mul(u.factor), approx: false },
    };
    let c: Q | null;
    if (sost.id === "altro") {
      c = parseNumber(listAt(state.c, i));
      if (!c)
        return `Scrivi il calore specifico del corpo ${k} in J/(kg·K), per esempio 900.`;
      if (c.sign() <= 0)
        return `Il calore specifico del corpo ${k} deve essere maggiore di zero.`;
    } else c = parseNumber(sost.c)!;
    const t = parseNumber(listAt(state.t, i));
    if (!t)
      return `Scrivi la temperatura iniziale del corpo ${k} in °C, per esempio 20.`;
    if (t.cmp(Q.from(ABSOLUTE_ZERO.C)) < 0)
      return `La temperatura del corpo ${k} è sotto lo zero assoluto, −273,15 °C: controllala.`;
    if (sost.id === "acqua" && (t.sign() < 0 || t.cmp(q(100)) > 0))
      return `L'acqua liquida sta tra 0 °C e 100 °C: per il corpo ${k} scegli il ghiaccio, oppure cambia la temperatura.`;
    if (sost.id === "ghiaccio" && t.sign() > 0)
      return `Il ghiaccio sta a 0 °C o sotto: per il corpo ${k} scegli l'acqua, oppure cambia la temperatura.`;
    out.push({
      sost: sost.id,
      name: sost.id === "altro" ? `corpo ${k}` : sost.name.toLowerCase(),
      m,
      c,
      t,
    });
  }
  return out;
}

/** The body in a table: "1 (acqua)". */
const who = (b: Corpo, i: number) =>
  b.sost === "altro" ? `${i + 1}` : `${i + 1} (${b.name})`;

/** A sum of terms in a formula, negative ones with a minus: "837{,}2 + 45 - 12". */
function sumTex(xs: Q[], f: (x: Q) => string): string {
  return xs
    .map((x, i) =>
      i === 0 ? f(x) : x.sign() < 0 ? `- ${f(x.neg())}` : `+ ${f(x)}`,
    )
    .join(" ");
}

/** The formula of the equilibrium temperature for n bodies: written out up to three, with Σ beyond. */
function formulaTex(n: number): string {
  if (n > 3) return "\\hl{T_e} = \\dfrac{\\sum m c\\, T}{\\sum m c}";
  const ks = Array.from({ length: n }, (_, i) => i + 1);
  return `\\hl{T_e} = \\dfrac{${ks.map((k) => `m_${k} c_${k} T_${k}`).join(" + ")}}{${ks.map((k) => `m_${k} c_${k}`).join(" + ")}}`;
}

export function temperaturaEquilibrio(state: Record<string, string>): Outcome {
  return safely(() => {
    const corpi = readCorpi(state);
    if (typeof corpi === "string") return fail(corpi);
    const C = corpi.map((b) => b.m.base.q.mul(b.c));
    const CT = corpi.map((b, i) => C[i].mul(b.t));
    const sumC = C.reduce((a, b) => a.add(b), q(0));
    const sumCT = CT.reduce((a, b) => a.add(b), q(0));
    const Te = sumCT.div(sumC);

    // Changes of state: the tool stops before computing the heats.
    const has = (id: string) => corpi.some((b) => b.sost === id);
    const TeText = `${rel(Te) === "=" ? "" : "circa "}${fmt(Te).text} °C`;
    if (has("acqua") && Te.sign() < 0)
      return fail(
        `La temperatura di equilibrio verrebbe sotto 0 °C (${TeText}): parte dell'acqua gelerebbe. Serve il calore latente di fusione, che questo strumento non calcola.`,
      );
    if (has("acqua") && Te.cmp(q(100)) > 0)
      return fail(
        `La temperatura di equilibrio verrebbe sopra 100 °C (${TeText}): parte dell'acqua bollirebbe. Serve il calore latente di vaporizzazione, che questo strumento non calcola.`,
      );
    if (has("ghiaccio") && Te.sign() > 0)
      return fail(
        `La temperatura di equilibrio verrebbe sopra 0 °C (${TeText}): il ghiaccio fonderebbe. Serve il calore latente di fusione, che questo strumento non calcola.`,
      );

    const steps: Tagged[] = [];
    steps.push({
      say: "Scrivi la condizione di equilibrio.",
      math: [
        "Q_\\text{ceduto} = Q_\\text{assorbito}",
        formulaTex(corpi.length),
      ],
      then: "I corpi caldi cedono calore, quelli freddi lo assorbono, finché arrivano alla stessa temperatura $T_e$.",
      part: "La formula",
    });
    const conv = unitsStep(
      corpi.map((b) => b.m),
      "Porta le masse in chilogrammi.",
    );
    if (conv) steps.push({ ...conv, part: "I dati" });
    steps.push({
      say: "Calcola la capacità termica $m c$ di ogni corpo.",
      table: {
        head: ["Corpo", "$m$", "$c$", "$m c$"],
        rows: corpi.map((b, i) => [
          who(b, i),
          `$${vu(b.m.base.q, MASS_UNITS[0])}$`,
          `$${fmt(b.c).tex}\\ ${C_TEX}$`,
          `$${vu(C[i], JK)}$`,
        ]),
      },
      part: "Il calcolo",
    });
    steps.push({
      say: "Moltiplica ogni capacità termica per la temperatura iniziale.",
      table: {
        head: ["Corpo", "$m c$", "$T$", "$m c\\, T$"],
        rows: corpi.map((b, i) => [
          who(b, i),
          `$${vu(C[i], JK)}$`,
          `$${tc(b.t)}$`,
          `$${vu(CT[i], J)}$`,
        ]),
      },
    });
    steps.push({
      say: "Dividi la somma dei prodotti per la somma delle capacità termiche.",
      math: [
        `T_e = \\dfrac{${sumTex(CT, (x) => fmt(x).tex)}}{${sumTex(C, (x) => fmt(x).tex)}}\\ {}^\\circ\\text{C}`,
        `= \\dfrac{${fmt(sumCT).tex}}{${fmt(sumC).tex}}\\ {}^\\circ\\text{C}`,
        `${rel(Te)} \\hl{${tc(Te)}}`,
      ],
      then: fmt(Te).exact
        ? undefined
        : "La divisione non è esatta: il risultato è arrotondato.",
    });

    // The heats, as a check.
    const heats = corpi.map((b, i) => C[i].mul(Te.sub(b.t)));
    const given = heats
      .filter((x) => x.sign() < 0)
      .reduce((a, b) => a.add(b.neg()), q(0));
    const taken = heats
      .filter((x) => x.sign() > 0)
      .reduce((a, b) => a.add(b), q(0));
    steps.push({
      say: "Calcola il calore scambiato da ogni corpo.",
      math: ["Q = m c\\, (T_e - T)"],
      table: {
        head: ["Corpo", "$T_e - T$", "$Q$", ""],
        rows: corpi.map((b, i) => {
          const dT = Te.sub(b.t);
          const s = heats[i].sign();
          return [
            who(b, i),
            `$${rel(dT) === "=" ? "" : "\\approx "}${vu(dT, unit("", "K", "\\text{K}"))}$`,
            `$${rel(heats[i]) === "=" ? "" : "\\approx "}${vu(heats[i], J)}$`,
            s < 0 ? "cede" : s > 0 ? "assorbe" : "nessuno scambio",
          ];
        }),
      },
      then: "Il segno meno vuol dire che il corpo cede calore. Una differenza di 1 °C è una differenza di 1 K.",
      part: "Il controllo",
    });
    steps.push({
      say: "Controlla che il calore ceduto sia uguale a quello assorbito.",
      math: [
        `Q_\\text{ceduto} ${rel(given)} ${vu(given, J)}`,
        `Q_\\text{assorbito} ${rel(taken)} ${vu(taken, J)}`,
      ],
      then: given.isZero()
        ? "I corpi erano già alla stessa temperatura: non scambiano calore."
        : undefined,
    });

    const approx = (x: Q) => (fmt(x).exact ? "" : "\\approx ");
    return {
      ok: true,
      rows: [
        {
          label: "Temperatura di equilibrio",
          value: `$${approx(Te)}${tc(Te)}$`,
        },
        {
          label: "Calore ceduto dai corpi più caldi",
          value: `$${approx(given)}${vu(given, J)}$`,
        },
      ],
      copy: `${fmt(Te).text} °C`,
      steps: grouped(steps),
    };
  });
}
