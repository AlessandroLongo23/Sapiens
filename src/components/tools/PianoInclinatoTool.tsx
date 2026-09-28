"use client";

import { useMemo, type ReactNode } from "react";
import {
  H_QT,
  L_QT,
  MASS_QT,
  pianoInclinato,
  type PianoResult,
} from "@/lib/tools/piano-inclinato";
import { ToggleGroup } from "@/components/ui/ToggleGroup";
import { cn } from "@/lib/utils/cn";
import {
  Examples,
  ToolField,
  ToolSheet,
  toolInputClass,
  useToolState,
} from "./ToolSheet";
import { QuantityRow } from "./GrandezzeTool";

/**
 * A body on an inclined plane: the mass, the angle (in degrees or from height and length), the friction coefficients
 * (optional) and g. Under the inputs, the plane drawn to the angle with the forces on the body, their lengths in
 * proportion.
 */

const DEFAULTS = {
  m: "2",
  um: "kg",
  modo: "angolo",
  a: "30",
  h: "3",
  uh: "m",
  l: "5",
  ul: "m",
  ms: "0,4",
  md: "0,3",
  g: "9,8",
};

const EXAMPLES: { label: string; values: Partial<typeof DEFAULTS> }[] = [
  {
    label: "Senza attrito, 30°",
    values: { m: "5", um: "kg", modo: "angolo", a: "30", ms: "", md: "" },
  },
  {
    label: "Resta fermo",
    values: {
      m: "500",
      um: "g",
      modo: "angolo",
      a: "20",
      ms: "0,5",
      md: "0,4",
    },
  },
  {
    label: "Piano alto 3 m e lungo 5 m",
    values: {
      m: "10",
      um: "kg",
      modo: "lati",
      h: "3",
      uh: "m",
      l: "5",
      ul: "m",
      ms: "0,2",
      md: "0,2",
    },
  },
  {
    label: "Rampa ripida, 60°",
    values: { m: "1", um: "kg", modo: "angolo", a: "60", ms: "0,6", md: "0,5" },
  },
];

export function PianoInclinatoTool() {
  const [state, set] = useToolState(DEFAULTS);
  const result = useMemo(() => pianoInclinato(state), [state]);
  const lati = state.modo === "lati";
  return (
    <ToolSheet
      outcome={result.outcome}
      inputs={
        <>
          <QuantityRow
            qt={MASS_QT}
            unknown={false}
            value={state.m}
            unitId={state.um}
            onValue={(m) => set({ m })}
            onUnit={(um) => set({ um })}
          />
          <div className="flex flex-col gap-1.5">
            <span className="label-mono text-fg-subtle">L’inclinazione</span>
            <ToggleGroup
              label="Come dai l'inclinazione"
              options={[
                { value: "angolo", label: "Angolo" },
                { value: "lati", label: "Altezza e lunghezza" },
              ]}
              value={lati ? "lati" : "angolo"}
              onChange={(modo) => set({ modo })}
            />
          </div>
          {lati ? (
            <>
              <QuantityRow
                qt={H_QT}
                unknown={false}
                value={state.h}
                unitId={state.uh}
                onValue={(h) => set({ h })}
                onUnit={(uh) => set({ uh })}
              />
              <QuantityRow
                qt={L_QT}
                unknown={false}
                value={state.l}
                unitId={state.ul}
                onValue={(l) => set({ l })}
                onUnit={(ul) => set({ ul })}
              />
            </>
          ) : (
            <ToolField label="Angolo del piano (α), in gradi">
              <input
                className={toolInputClass}
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                value={state.a}
                onChange={(e) => set({ a: e.target.value })}
              />
            </ToolField>
          )}
          <div className="grid grid-cols-2 gap-2">
            <ToolField label="Attrito statico (μs)">
              <input
                className={toolInputClass}
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                value={state.ms}
                onChange={(e) => set({ ms: e.target.value })}
              />
            </ToolField>
            <ToolField label="Attrito dinamico (μd)">
              <input
                className={toolInputClass}
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                value={state.md}
                onChange={(e) => set({ md: e.target.value })}
              />
            </ToolField>
          </div>
          <p className="-mt-2 text-xs text-fg-subtle">
            Lascia vuoti i due coefficienti per un piano senza attrito. Se ne
            scrivi uno solo, vale per tutti e due.
          </p>
          <ToolField
            label="Accelerazione di gravità (g), in m/s²"
            hint="Sulla Terra 9,8 m/s², come nei libri; alcuni usano 9,81."
          >
            <input
              className={toolInputClass}
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              value={state.g}
              onChange={(e) => set({ g: e.target.value })}
            />
          </ToolField>
          {result.sketch && <PianoSketch sketch={result.sketch} />}
          <Examples
            items={EXAMPLES.map((x) => ({
              label: x.label,
              apply: () => set(x.values),
            }))}
          />
        </>
      }
    />
  );
}

type Sketch = NonNullable<PianoResult["sketch"]>;
type V = [number, number];

const W = 320;
const H = 210;
const f1 = (x: number) => Math.round(x * 10) / 10;

/** An arrow from p along the vector v, with its tip. */
function Arrow({
  p,
  v,
  className,
  dashed,
}: {
  p: V;
  v: V;
  className?: string;
  dashed?: boolean;
}) {
  const len = Math.hypot(v[0], v[1]);
  if (len < 3) return null;
  const [ux, uy] = [v[0] / len, v[1] / len];
  const e: V = [p[0] + v[0], p[1] + v[1]];
  const k = 7;
  const tip = `M${f1(e[0] - k * ux + k * 0.5 * uy)},${f1(e[1] - k * uy - k * 0.5 * ux)} L${f1(e[0])},${f1(e[1])} L${f1(e[0] - k * ux - k * 0.5 * uy)},${f1(e[1] - k * uy + k * 0.5 * ux)}`;
  return (
    <g className={className}>
      <path
        d={`M${f1(p[0])},${f1(p[1])} L${f1(e[0])},${f1(e[1])}`}
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      <path d={tip} />
    </g>
  );
}

/** A label near the tip of an arrow, pushed a little further along it. */
function Tip({
  p,
  v,
  children,
  className,
}: {
  p: V;
  v: V;
  children: ReactNode;
  className?: string;
}) {
  const len = Math.hypot(v[0], v[1]);
  if (len < 3) return null;
  const x = p[0] + v[0] + (v[0] / len) * 12;
  const y = p[1] + v[1] + (v[1] / len) * 12;
  return (
    <text
      x={f1(x)}
      y={f1(y)}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={14}
      stroke="none"
      paintOrder="stroke"
      className={cn("italic", className ?? "fill-fg-muted")}
    >
      {children}
    </text>
  );
}

/** The plane drawn to its angle, the body on it, and the forces with lengths in proportion to the weight. */
function PianoSketch({ sketch }: { sketch: Sketch }) {
  const a = (sketch.alpha * Math.PI) / 180;
  const [c, s] = [Math.cos(a), Math.sin(a)];
  // The corner with the angle at the bottom right; the slope rises to the left.
  const C: V = [W - 24, H - 22];
  const L = Math.min((W - 48) / c, (H - 50) / s);
  const T: V = [C[0] - L * c, C[1] - L * s];
  const B: V = [T[0], C[1]];
  const d: V = [c, s]; // down the slope
  const n: V = [s, -c]; // out of the slope
  const side = 30;
  const foot: V = [T[0] + d[0] * L * 0.45, T[1] + d[1] * L * 0.45];
  const G: V = [foot[0] + n[0] * (side / 2), foot[1] + n[1] * (side / 2)];
  const scale = 64 / sketch.P;
  const mul = (u: V, k: number): V => [u[0] * k * scale, u[1] * k * scale];
  const Rp: V = [G[0] + n[0] * 26, G[1] + n[1] * 26];
  // Friction acts where the body touches the plane: drawn from its uphill corner.
  const Fp: V = [foot[0] - d[0] * (side / 2), foot[1] - d[1] * (side / 2)];
  const arc = 26;
  const title = `Il piano inclinato di ${Math.round(sketch.alpha * 10) / 10} gradi, con il peso, le sue componenti, la forza normale${sketch.friction > 0 ? ", l'attrito" : ""} e la forza risultante.`;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={title}
      className="h-auto w-full max-w-md self-center text-fg"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>{title}</title>
      <path
        d={`M${f1(T[0])},${f1(T[1])} L${f1(C[0])},${f1(C[1])} L${f1(B[0])},${f1(B[1])} Z`}
        className="fill-accent/10"
      />
      <path
        d={`M${f1(C[0] - arc)},${f1(C[1])} A${arc},${arc} 0 0 1 ${f1(C[0] - arc * c)},${f1(C[1] - arc * s)}`}
        className="stroke-fg-muted"
        strokeWidth={1}
      />
      <text
        x={f1(C[0] - arc - 14)}
        y={f1(C[1] - 7)}
        fontSize={14}
        stroke="none"
        textAnchor="middle"
        className="fill-fg-muted italic"
      >
        α
      </text>
      <rect
        x={f1(G[0] - side / 2)}
        y={f1(G[1] - side / 2)}
        width={side}
        height={side}
        rx={2}
        transform={`rotate(${f1(sketch.alpha)} ${f1(G[0])} ${f1(G[1])})`}
        className="fill-surface"
      />
      <Arrow p={G} v={mul([0, 1], sketch.P)} />
      <Tip p={G} v={mul([0, 1], sketch.P)} className="fill-fg">
        P
      </Tip>
      <Arrow p={G} v={mul(d, sketch.par)} dashed className="stroke-fg-muted" />
      <Tip p={G} v={mul(d, sketch.par)}>
        P∥
      </Tip>
      <Arrow
        p={G}
        v={mul([-n[0], -n[1]], sketch.perp)}
        dashed
        className="stroke-fg-muted"
      />
      <Tip p={G} v={mul([-n[0], -n[1]], sketch.perp)}>
        P⊥
      </Tip>
      <Arrow p={G} v={mul(n, sketch.perp)} />
      <Tip p={G} v={mul(n, sketch.perp)} className="fill-fg">
        N
      </Tip>
      {sketch.friction > 0 && (
        <>
          <Arrow p={Fp} v={mul([-d[0], -d[1]], sketch.friction)} />
          <Tip
            p={Fp}
            v={mul([-d[0], -d[1]], sketch.friction)}
            className="fill-fg"
          >
            F
            <tspan baselineShift="sub" fontSize={10}>
              a
            </tspan>
          </Tip>
        </>
      )}
      {sketch.slides && (
        <>
          <Arrow p={Rp} v={mul(d, sketch.R)} className="stroke-accent" />
          <Tip p={Rp} v={mul(d, sketch.R)} className="fill-accent">
            R
          </Tip>
        </>
      )}
    </svg>
  );
}
