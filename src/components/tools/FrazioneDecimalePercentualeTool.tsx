'use client';

import { useMemo } from 'react';
import { frazioneDecimalePercentuale, type Form } from '@/lib/tools/frazione-decimale-percentuale';
import { Examples, ModeSwitch, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { da: 'frazione', n: '7/12' };

const MODES: { value: Form; label: string }[] = [
	{ value: 'frazione', label: 'Da frazione' },
	{ value: 'decimale', label: 'Da decimale' },
	{ value: 'percentuale', label: 'Da percentuale' }
];

const FIELDS: Record<Form, { label: string; hint: string; start: string; examples: string[] }> = {
	frazione: { label: 'Frazione', hint: 'Numeratore e denominatore con la barra: 3/8.', start: '3/8', examples: ['3/8', '1/3', '7/12', '9/6'] },
	decimale: { label: 'Numero decimale', hint: 'Con la virgola; il periodo tra parentesi: 0,1(6) vuol dire 0,1666…', start: '0,375', examples: ['0,375', '0,(6)', '0,1(6)', '1,25'] },
	percentuale: { label: 'Percentuale (%)', hint: 'Il numero senza il simbolo %, o con: 12,5 oppure 12,5 %.', start: '12,5', examples: ['12,5', '40', '150', '33,(3)'] }
};

const isForm = (m: string): m is Form => MODES.some((x) => x.value === m);

export function FrazioneDecimalePercentualeTool() {
	const [state, set] = useToolState(DEFAULTS);
	const form = isForm(state.da) ? state.da : 'frazione';
	const outcome = useMemo(() => frazioneDecimalePercentuale(state.n, form), [state.n, form]);
	const field = FIELDS[form];
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ModeSwitch label="Da quale forma parti" options={MODES} value={form} onChange={(da) => set({ da, n: FIELDS[da].start })} />
					<ToolField label={field.label} hint={field.hint}>
						<input className={toolInputClass} autoComplete="off" autoCapitalize="off" spellCheck={false} value={state.n} onChange={(e) => set({ n: e.target.value })} />
					</ToolField>
					<Examples items={field.examples.map((n) => ({ label: form === 'percentuale' ? `${n} %` : n, apply: () => set({ n }) }))} />
				</>
			}
		/>
	);
}
