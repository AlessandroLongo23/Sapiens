"use client";

import { useMemo } from "react";
import { COULOMB_QTS, coulomb } from "@/lib/tools/coulomb";
import { ToggleGroup } from "@/components/ui/ToggleGroup";
import { useToolState } from "./ToolSheet";
import { FormulaTool, type FormulaExample } from "./GrandezzeTool";

/**
 * Coulomb's law: the force between two charges, the distance, or one of the charges. The charges keep their sign;
 * to find a charge the student says whether the force attracts or repels.
 */

const DEFAULTS = {
  trova: "F",
  F: "",
  uF: "N",
  q1: "2",
  uq1: "uC",
  q2: "-3",
  uq2: "uC",
  r: "10",
  ur: "cm",
  tipo: "attrattiva",
};

const EXAMPLES: FormulaExample[] = [
  {
    label: "Due cariche da 5 nC a 3 mm",
    values: {
      trova: "F",
      q1: "5",
      uq1: "nC",
      q2: "5",
      uq2: "nC",
      r: "3",
      ur: "mm",
      uF: "mN",
    },
  },
  {
    label: "Distanza: 1 μC, 1 μC e 0,9 N",
    values: {
      trova: "r",
      q1: "1",
      uq1: "uC",
      q2: "1",
      uq2: "uC",
      F: "0,9",
      uF: "N",
      ur: "cm",
    },
  },
  {
    label: "Carica: forza attrattiva di 2 N",
    values: {
      trova: "q2",
      q1: "4",
      uq1: "uC",
      F: "2",
      uF: "N",
      r: "30",
      ur: "cm",
      uq2: "uC",
      tipo: "attrattiva",
    },
  },
  {
    label: "Protone ed elettrone",
    values: {
      trova: "F",
      q1: "1,602e-19",
      uq1: "C",
      q2: "-1,602e-19",
      uq2: "C",
      r: "5,29e-11",
      ur: "m",
      uF: "N",
    },
  },
];

export function CoulombTool() {
  const [state, set] = useToolState(DEFAULTS);
  const outcome = useMemo(() => coulomb(state), [state]);
  const findsCharge = state.trova === "q1" || state.trova === "q2";
  return (
    <FormulaTool
      quantities={COULOMB_QTS}
      state={state}
      set={set}
      outcome={outcome}
      examples={EXAMPLES}
      hint="Scrivi il segno delle cariche: -3 per una carica negativa. Per le potenze di dieci: 1,6e-19 oppure 1,6·10^-19."
      after={
        findsCharge && (
          <div className="flex flex-col gap-1.5">
            <span className="label-mono text-fg-subtle">La forza è</span>
            <ToggleGroup
              label="Tipo di forza"
              options={[
                { value: "attrattiva", label: "Attrattiva" },
                { value: "repulsiva", label: "Repulsiva" },
              ]}
              value={state.tipo === "repulsiva" ? "repulsiva" : "attrattiva"}
              onChange={(tipo) => set({ tipo })}
            />
          </div>
        )
      }
    />
  );
}
