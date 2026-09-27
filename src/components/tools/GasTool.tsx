'use client';

import { useMemo } from 'react';
import { LAWS, gas, lawOf, quantityOf } from '@/lib/tools/gas';
import { ModeSwitch, useToolState } from './ToolSheet';
import { FormulaTool, type FormulaExample } from './GrandezzeTool';

/**
 * The gas laws: pV = nRT and the transformations between two states. One state for every law, so switching law keeps
 * the values the student wrote; the unknown goes back to the law's default when it is not in the new law.
 */

const DEFAULTS = {
	modo: 'pvnrt',
	trova: 'V',
	p: '1',
	up: 'atm',
	V: '',
	uV: 'L',
	n: '2',
	un: 'mol',
	T: '25',
	uT: 'C',
	p1: '1',
	up1: 'atm',
	V1: '2',
	uV1: 'L',
	T1: '20',
	uT1: 'C',
	p2: '2',
	up2: 'atm',
	V2: '',
	uV2: 'L',
	T2: '80',
	uT2: 'C'
};

/** The quantity each law opens on. */
const FIND: Record<string, string> = { pvnrt: 'V', boyle: 'V2', charles: 'V2', gaylussac: 'p2', generale: 'V2' };

const EXAMPLES: FormulaExample[] = [
	{ label: '1 mol a 0 °C e 1 atm', values: { modo: 'pvnrt', trova: 'V', n: '1', un: 'mol', T: '0', uT: 'C', p: '1', up: 'atm', uV: 'L' } },
	{ label: 'Pressione in kPa', values: { modo: 'pvnrt', trova: 'p', n: '0,5', un: 'mol', V: '10', uV: 'L', T: '300', uT: 'K', up: 'kPa' } },
	{ label: 'Boyle: 3 L da 1 a 2,5 atm', values: { modo: 'boyle', trova: 'V2', p1: '1', up1: 'atm', V1: '3', uV1: 'L', p2: '2,5', up2: 'atm', uV2: 'L' } },
	{ label: 'Bombola scaldata a 80 °C', values: { modo: 'gaylussac', trova: 'p2', p1: '200', up1: 'kPa', T1: '20', uT1: 'C', T2: '80', uT2: 'C', up2: 'kPa' } }
];

export function GasTool() {
	const [state, set] = useToolState(DEFAULTS);
	const law = lawOf(state.modo);
	const trova = law.vars.some((x) => x.key === state.trova) ? state.trova : FIND[law.id];
	const outcome = useMemo(() => gas({ ...state, modo: law.id, trova }), [state, law.id, trova]);
	return (
		<FormulaTool
			quantities={law.vars.map((x) => quantityOf(x))}
			state={{ ...state, trova }}
			set={set}
			outcome={outcome}
			examples={EXAMPLES}
			hint="La temperatura puoi scriverla in °C o in K: nei calcoli va sempre in kelvin. Per i decimali usa la virgola: 22,4."
			before={<ModeSwitch label="Quale legge" options={LAWS.map((x) => ({ value: x.id, label: x.label }))} value={law.id} onChange={(modo) => set({ modo, trova: FIND[modo] })} />}
		/>
	);
}
