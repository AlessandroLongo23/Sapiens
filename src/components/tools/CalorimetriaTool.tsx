"use client";

import { useMemo } from "react";
import { Minus, Plus } from "lucide-react";
import {
  MASS_UNITS,
  MAX_CORPI,
  SOSTANZE,
  temperaturaEquilibrio,
} from "@/lib/tools/calorimetria";
import { Examples, ToolSheet, toolInputClass, useToolState } from "./ToolSheet";
import { unitSelectClass } from "./GrandezzeTool";

/**
 * The equilibrium temperature of two to five bodies: one card per body, with its substance (which gives the specific
 * heat, or "altro" to write it), its mass and its starting temperature. The lists are kept in the address, separated
 * by semicolons.
 */

const DEFAULTS = {
  m: "250;100;150",
  um: "g;g;g",
  s: "acqua;alluminio;ferro",
  c: ";;",
  t: "20;20;95",
};

const EXAMPLES: { label: string; values: typeof DEFAULTS }[] = [
  {
    label: "Acqua a 15 °C e a 60 °C",
    values: { m: "2;1", um: "kg;kg", s: "acqua;acqua", c: ";", t: "15;60" },
  },
  {
    label: "Ferro caldo in acqua",
    values: { m: "200;500", um: "g;g", s: "ferro;acqua", c: ";", t: "150;20" },
  },
  {
    label: "Rame nel calorimetro",
    values: {
      m: "100;300;80",
      um: "g;g;g",
      s: "rame;acqua;alluminio",
      c: ";;",
      t: "100;18;18",
    },
  },
  {
    label: "Un materiale sconosciuto",
    values: {
      m: "0,5;1",
      um: "kg;kg",
      s: "altro;acqua",
      c: "900;",
      t: "80;20",
    },
  },
];

const split = (s: string, n: number) => {
  const xs = s.split(";");
  return Array.from({ length: n }, (_, i) => xs[i] ?? "");
};

export function CalorimetriaTool() {
  const [state, set] = useToolState(DEFAULTS);
  const outcome = useMemo(() => temperaturaEquilibrio(state), [state]);
  const n = Math.min(MAX_CORPI, Math.max(2, state.m.split(";").length));
  const lists = {
    m: split(state.m, n),
    um: split(state.um, n),
    s: split(state.s, n),
    c: split(state.c, n),
    t: split(state.t, n),
  };
  type Key = keyof typeof lists;

  const write = (next: Record<Key, string[]>) =>
    set(
      Object.fromEntries(
        Object.entries(next).map(([k, v]) => [k, v.join(";")]),
      ) as Partial<typeof DEFAULTS>,
    );
  const change = (key: Key, i: number, value: string) =>
    write({
      ...lists,
      [key]: lists[key].map((v, j) => (j === i ? value.replace(/;/g, "") : v)),
    });
  const remove = (i: number) =>
    write(
      Object.fromEntries(
        Object.entries(lists).map(([k, v]) => [k, v.filter((_, j) => j !== i)]),
      ) as Record<Key, string[]>,
    );
  const add = () =>
    write({
      m: [...lists.m, ""],
      um: [...lists.um, "g"],
      s: [...lists.s, "acqua"],
      c: [...lists.c, ""],
      t: [...lists.t, ""],
    });

  return (
    <ToolSheet
      outcome={outcome}
      inputs={
        <>
          {lists.m.map((mass, i) => {
            const k = i + 1;
            const sost =
              SOSTANZE.find((x) => x.id === lists.s[i]) ??
              SOSTANZE[SOSTANZE.length - 1];
            return (
              <div
                key={i}
                role="group"
                aria-label={`Corpo ${k}`}
                className="flex flex-col gap-2 rounded-xl border border-edge bg-surface p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="label-mono text-fg-subtle">Corpo {k}</span>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    disabled={n <= 2}
                    aria-label={`Togli il corpo ${k}`}
                    title={`Togli il corpo ${k}`}
                    className="flex size-9 items-center justify-center rounded-lg border border-edge bg-surface text-fg-subtle transition-colors hover:text-fg focus-ring disabled:opacity-40"
                  >
                    <Minus className="size-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-2">
                  <select
                    aria-label={`Sostanza del corpo ${k}`}
                    className={unitSelectClass}
                    value={sost.id}
                    onChange={(e) => change("s", i, e.target.value)}
                  >
                    {SOSTANZE.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.c ? `${x.name} (${x.c})` : "Altro: scrivi c"}
                      </option>
                    ))}
                  </select>
                  {sost.id === "altro" ? (
                    <input
                      aria-label={`Calore specifico del corpo ${k}, in J/(kg·K)`}
                      placeholder="c in J/(kg·K)"
                      className={toolInputClass}
                      inputMode="decimal"
                      autoComplete="off"
                      spellCheck={false}
                      value={lists.c[i]}
                      onChange={(e) => change("c", i, e.target.value)}
                    />
                  ) : (
                    <output className="flex items-center px-1 text-sm text-fg-subtle">
                      c = {sost.c} J/(kg·K)
                    </output>
                  )}
                </div>
                <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,2fr)] items-end gap-2">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-fg-subtle">Massa</span>
                    <input
                      className={toolInputClass}
                      inputMode="decimal"
                      autoComplete="off"
                      spellCheck={false}
                      value={mass}
                      onChange={(e) => change("m", i, e.target.value)}
                    />
                  </label>
                  <select
                    aria-label={`Unità della massa del corpo ${k}`}
                    className={unitSelectClass}
                    value={lists.um[i] === "g" ? "g" : "kg"}
                    onChange={(e) => change("um", i, e.target.value)}
                  >
                    {MASS_UNITS.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-fg-subtle">
                      Temperatura (°C)
                    </span>
                    <input
                      className={toolInputClass}
                      inputMode="decimal"
                      autoComplete="off"
                      spellCheck={false}
                      value={lists.t[i]}
                      onChange={(e) => change("t", i, e.target.value)}
                    />
                  </label>
                </div>
              </div>
            );
          })}
          {n < MAX_CORPI && (
            <button
              type="button"
              onClick={add}
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-dashed border-edge-strong px-3 text-sm font-medium text-fg-muted transition-colors hover:text-fg focus-ring"
            >
              <Plus className="size-4" aria-hidden="true" />
              Aggiungi un corpo
            </button>
          )}
          <p className="text-xs text-fg-subtle">
            Calori specifici in J/(kg·K), valori dei libri a temperatura
            ambiente. Senza passaggi di stato: niente ghiaccio che fonde, niente
            acqua che bolle.
          </p>
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
