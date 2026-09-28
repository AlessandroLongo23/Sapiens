import { fail, type Outcome, type Step } from "./types";
import {
  exact,
  fmt,
  parseNumber,
  q,
  rel,
  safely,
  unit,
  vu,
  Q,
  type Unit,
  type Val,
} from "./grandezze";

/**
 * Newton and kilogram-force (chilogrammo-peso, kgp or kgf): 1 kgp is the weight of 1 kg where g is the standard
 * gravity, 9,80665 m/s², fixed by the 3rd CGPM in 1901. So 1 kgp = 9,80665 N exactly. It is not the 9,8 m/s² of the
 * school problems, and the tool says so. A second mode gives the weight of a mass on the Earth (9,8 m/s², as in the
 * other physics tools), the Moon (1,62 m/s²) and Mars (3,71 m/s²).
 */

export const G0 = q(980665, 100000);
const G0_TEX = "9{,}80665";

/** Force units, with their value in newton. */
export const FORCE_UNITS: Unit[] = [
  unit("N", "N", "\\text{N}"),
  unit("kN", "kN", "\\text{kN}", q(1000)),
  unit("kgp", "kgp", "\\text{kgp}", G0),
  unit("gp", "gp", "\\text{gp}", G0.div(q(1000))),
];
export const FORCE_NAMES: Record<string, string> = {
  N: "newton",
  kN: "chilonewton",
  kgp: "chilogrammo-peso",
  gp: "grammo-peso",
};

const N_ = FORCE_UNITS[0];
const approx = (v: Val | Q) => (fmt(v).exact ? "" : "\\approx ");

/** From a force in one unit to another, through the newton. */
export function newtonKg(n: string, from: string, to: string): Outcome {
  return safely(() => {
    const x = parseNumber(n ?? "");
    if (!x) return fail("Scrivi una forza, per esempio 100.");
    const a = FORCE_UNITS.find((u) => u.id === from);
    const b = FORCE_UNITS.find((u) => u.id === to);
    if (!a || !b) return fail("Scegli le due unità.");
    const newton = x.mul(a.factor);
    const y = newton.div(b.factor);
    const steps: Step[] = [];
    const usesKgp = a.id.endsWith("gp") || b.id.endsWith("gp");
    if (usesKgp)
      steps.push({
        say: "Parti dalla definizione del chilogrammo-peso.",
        math: [`1\\ \\text{kgp} = ${G0_TEX}\\ \\text{N}`],
        then: `È il peso di 1 kg dove $g = ${G0_TEX}\\ \\text{m/s}^2$, la gravità normale. Non è il $9{,}8$ dei problemi.`,
      });
    if (a === b) {
      steps.push({
        say: "Le due unità sono uguali: il valore non cambia.",
        math: [`${vu(x, a)} = \\hl{${vu(x, b)}}`],
      });
    } else if (a.id === "N" || b.id === "N") {
      const other = a.id === "N" ? b : a;
      const toN = b.id === "N";
      const k = other.factor;
      steps.push({
        say: toN
          ? `Moltiplica per il valore di 1 ${other.label} in newton.`
          : `Dividi per il valore di 1 ${other.label} in newton.`,
        math: [
          `${vu(x, a)} ${toN ? "\\cdot" : ":"} ${fmt(k).tex}`,
          `${rel(y)} \\hl{${vu(y, b)}}`,
        ],
      });
    } else {
      steps.push({
        say: "Porta prima la forza in newton.",
        math: [
          `${vu(x, a)} \\cdot ${fmt(a.factor).tex}`,
          `${rel(newton)} \\hl{${vu(newton, N_)}}`,
        ],
      });
      steps.push({
        say: `Poi dividi per il valore di 1 ${b.label} in newton.`,
        math: [
          `${vu(newton, N_)} : ${fmt(b.factor).tex}`,
          `${rel(y)} \\hl{${vu(y, b)}}`,
        ],
      });
    }
    if (usesKgp && (a.id === "N" || b.id === "N"))
      steps.push({
        say: "Leggi il risultato come massa, se serve.",
        then: "Sulla Terra un corpo che pesa 1 kgp ha una massa di circa 1 kg: per questo le bilance segnano i kg.",
      });
    return {
      ok: true,
      rows: [
        {
          label: `Forza in ${FORCE_NAMES[b.id]}`,
          value: `$${approx(y)}${vu(y, b)}$`,
        },
        ...(b.id !== "N" && a.id !== "N"
          ? [
              {
                label: "Forza in newton",
                value: `$${approx(newton)}${vu(newton, N_)}$`,
              },
            ]
          : []),
      ],
      copy: `${fmt(y).text} ${b.label}`,
      steps,
    };
  });
}

/** The bodies for the weight, with g in m/s². */
export const CORPI_CELESTI: { id: string; name: string; on: string; g: Q }[] = [
  { id: "terra", name: "Terra", on: "sulla Terra", g: q(98, 10) },
  { id: "luna", name: "Luna", on: "sulla Luna", g: q(162, 100) },
  { id: "marte", name: "Marte", on: "su Marte", g: q(371, 100) },
];

const MASS_UNITS = [
  unit("kg", "kg", "\\text{kg}"),
  unit("g", "g", "\\text{g}", q(1, 1000)),
];
const MS2 = unit("", "m/s²", "\\text{m/s}^2");

/** The weight P = m g of a mass on the Earth, the Moon or Mars. */
export function pesoCorpo(m: string, um: string, corpo: string): Outcome {
  return safely(() => {
    const x = parseNumber(m ?? "");
    if (!x) return fail("Scrivi una massa, per esempio 60.");
    if (x.sign() <= 0)
      return fail("La massa deve essere maggiore di zero, per esempio 60.");
    const u = MASS_UNITS.find((v) => v.id === um) ?? MASS_UNITS[0];
    const c = CORPI_CELESTI.find((v) => v.id === corpo) ?? CORPI_CELESTI[0];
    const kg = x.mul(u.factor);
    const P = kg.mul(c.g);
    const steps: Step[] = [];
    if (u.id !== "kg")
      steps.push({
        say: "Porta la massa in chilogrammi.",
        math: [`${vu(x, u)} : 1000`, `= \\hl{${vu(kg, MASS_UNITS[0])}}`],
      });
    steps.push({
      say: `Moltiplica la massa per $g$ ${c.on}.`,
      math: [
        "P = m g",
        `P = ${vu(kg, MASS_UNITS[0])} \\cdot ${vu(exact(c.g), MS2)}`,
        `${rel(P)} \\hl{${vu(P, N_)}}`,
      ],
    });
    steps.push({
      say: "Confronta con gli altri corpi celesti.",
      table: {
        head: ["Dove", "$g$", "Peso"],
        rows: CORPI_CELESTI.map((v) => [
          v.name,
          `$${vu(v.g, MS2)}$`,
          `$${vu(kg.mul(v.g), N_)}$`,
        ]),
      },
      then: "La massa resta la stessa: cambia solo il peso.",
    });
    return {
      ok: true,
      rows: [{ label: `Peso ${c.on}`, value: `$${approx(P)}${vu(P, N_)}$` }],
      copy: `${fmt(P).text} N`,
      steps,
    };
  });
}
