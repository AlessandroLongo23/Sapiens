'use client';

import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

/** The parent's one button. Confirming is a request of its own, so opening the page changes nothing. */
export function ParentConfirm({ token, studentFirstName, done: alreadyDone }: { token: string; studentFirstName: string; done: boolean }) {
	const [state, setState] = useState<{ done?: boolean; loading?: boolean; error?: string }>({ done: alreadyDone });

	const confirm = async () => {
		setState({ loading: true });
		try {
			const response = await fetch('/api/genitore/conferma', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) });
			const result = await response.json().catch(() => ({}));
			if (!response.ok) throw new Error(result.error || 'Conferma non riuscita. Riprova.');
			setState({ done: true });
		} catch (err) {
			setState({ error: err instanceof Error ? err.message : String(err) });
		}
	};

	if (state.done) {
		return (
			<Alert tone="success" title="Consenso registrato" className="mt-8">
				L’account di {studentFirstName} è attivo: può entrare con la sua email e la sua password. Gli abbiamo scritto per dirglielo.
			</Alert>
		);
	}
	return (
		<div className="mt-8 flex flex-col gap-4">
			{state.error && <Alert tone="error">{state.error}</Alert>}
			<Button size="lg" onClick={confirm} loading={state.loading} className="sm:self-start">
				Sono un genitore e do il consenso
			</Button>
		</div>
	);
}
