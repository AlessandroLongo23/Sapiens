"use client";

import { useMemo } from "react";
import {
  CORPI_CELESTI,
  FORCE_NAMES,
  FORCE_UNITS,
  newtonKg,
  pesoCorpo,
} from "@/lib/tools/newton-kg";
import { ToggleGroup } from "@/components/ui/ToggleGroup";
import { Examples, ToolSheet, toolInputClass, useToolState } from "./ToolSheet";
import { UnitConverter } from "./UnitConverter";
import { unitSelectClass } from "./GrandezzeTool";

/**
 * Newton and kilogram-force, both ways, and in a second mode the weight of a mass on the Earth, the Moon or Mars.
 */

const DEFAULTS = {
  modo: "converti",
  n: "100",
  da: "N",
  a: "kgp",
  m: "60",
  um: "kg",
  corpo: "luna",
};

const EXAMPLES: { label: string; values: Partial<typeof DEFAULTS> }[] = [
  {
    label: "1 kgp → N",
    values: { modo: "converti", n: "1", da: "kgp", a: "N" },
  },
  {
    label: "500 N → kgp",
    values: { modo: "converti", n: "500", da: "N", a: "kgp" },
  },
  {
    label: "2 kN → kgp",
    values: { modo: "converti", n: "2", da: "kN", a: "kgp" },
  },
  {
    label: "70 kg su Marte",
    values: { modo: "peso", m: "70", um: "kg", corpo: "marte" },
  },
];

export function NewtonKgTool() {
  const [state, set] = useToolState(DEFAULTS);
  const peso = state.modo === "peso";
  const outcome = useMemo(
    () =>
      peso
        ? pesoCorpo(state.m, state.um, state.corpo)
        : newtonKg(state.n, state.da, state.a),
    [peso, state.m, state.um, state.corpo, state.n, state.da, state.a],
  );
  const unitText = FORCE_UNITS.find((u) => u.id === state.a)?.label ?? "";
  const result =
    outcome.ok && !peso ? outcome.copy.slice(0, -(unitText.length + 1)) : null;
  return (
    <ToolSheet
      outcome={outcome}
      inputs={
        <>
          <ToggleGroup
            label="Che cosa vuoi fare"
            options={[
              { value: "converti", label: "Newton e kgp" },
              { value: "peso", label: "Peso di una massa" },
            ]}
            value={peso ? "peso" : "converti"}
            onChange={(modo) => set({ modo })}
          />
          {peso ? (
            <>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="massa" className="label-mono text-fg-subtle">
                  Massa (m)
                </label>
                <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-2">
                  <input
                    id="massa"
                    className={toolInputClass}
                    inputMode="decimal"
                    autoComplete="off"
                    spellCheck={false}
                    value={state.m}
                    onChange={(e) => set({ m: e.target.value })}
                  />
                  <select
                    aria-label="Unità della massa"
                    className={unitSelectClass}
                    value={state.um === "g" ? "g" : "kg"}
                    onChange={(e) => set({ um: e.target.value })}
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="label-mono text-fg-subtle">Dove</span>
                <ToggleGroup
                  label="Dove"
                  options={CORPI_CELESTI.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                  value={
                    CORPI_CELESTI.some((c) => c.id === state.corpo)
                      ? state.corpo
                      : "terra"
                  }
                  onChange={(corpo) => set({ corpo })}
                />
              </div>
              <p className="text-xs text-fg-subtle">
                g vale 9,8 m/s² sulla Terra, come nei problemi, 1,62 m/s² sulla
                Luna e 3,71 m/s² su Marte.
              </p>
            </>
          ) : (
            <>
              <UnitConverter
                value={state.n}
                onValue={(n) => set({ n })}
                from={state.da}
                to={state.a}
                units={FORCE_UNITS.map((u) => ({
                  value: u.id,
                  label: `${u.label} (${FORCE_NAMES[u.id]})`,
                }))}
                onUnits={(da, a) => set({ da, a })}
                result={result}
                valueLabel="Forza"
              />
              <p className="text-xs text-fg-subtle">
                1 kgp = 9,80665 N esatti: il chilogrammo-peso usa la gravità
                normale, non il 9,8 dei problemi.
              </p>
            </>
          )}
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
