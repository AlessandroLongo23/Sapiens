'use client';

import { useMemo } from 'react';
import { subnet } from '@/lib/tools/subnet';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { ip: '192.168.10.77', p: '/26' };

const EXAMPLES = [
	{ ip: '192.168.1.10', p: '/24' },
	{ ip: '10.1.2.3', p: '255.255.240.0' },
	{ ip: '172.16.5.200', p: '/30' },
	{ ip: '192.168.0.130', p: '/25' }
];

export function SubnetTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(() => subnet(state.ip, state.p), [state.ip, state.p]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToolField label="Indirizzo IP" hint="Quattro numeri da 0 a 255 separati da punti. Puoi scrivere anche 192.168.1.10/24.">
						<input className={toolInputClass} inputMode="decimal" autoComplete="off" autoCapitalize="off" spellCheck={false} value={state.ip} onChange={(e) => set({ ip: e.target.value })} />
					</ToolField>
					<ToolField label="Prefisso o subnet mask" hint="Il prefisso CIDR, come /26, oppure la mask, come 255.255.255.192.">
						<input className={toolInputClass} inputMode="decimal" autoComplete="off" autoCapitalize="off" spellCheck={false} value={state.p} onChange={(e) => set({ p: e.target.value })} />
					</ToolField>
					<Examples items={EXAMPLES.map((e) => ({ label: `${e.ip} ${e.p}`, apply: () => set(e) }))} />
				</>
			}
		/>
	);
}
