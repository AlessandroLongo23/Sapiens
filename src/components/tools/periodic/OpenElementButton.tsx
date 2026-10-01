'use client';

import type { ReactNode } from 'react';
import { OPEN_ELEMENT_EVENT } from './PeriodicTable';

/** A name in the list under the table that opens the element's card in the table above. */
export function OpenElementButton({ symbol, children }: { symbol: string; children: ReactNode }) {
	return (
		<button
			type="button"
			onClick={() => window.dispatchEvent(new CustomEvent(OPEN_ELEMENT_EVENT, { detail: symbol }))}
			className="rounded text-left font-medium text-fg-strong underline decoration-edge-strong underline-offset-4 hover:text-accent-fg hover:decoration-current focus-ring"
		>
			{children}
		</button>
	);
}
