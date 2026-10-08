'use client';

import { useState, type FormEvent } from 'react';
import { EMAIL_CODE } from '@/lib/onboarding/config';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';

/**
 * Confirms the account's email with a six-digit code: one button sends it, a field takes it. Shown where the
 * confirmation is needed (before paying, inviting, writing to a tutor) and in the account.
 */
export function VerifyEmail({ email, onVerified }: { email: string; onVerified?: () => void }) {
	const [sent, setSent] = useState(false);
	const [code, setCode] = useState('');
	const [state, setState] = useState<{ loading?: boolean; error?: string; done?: boolean }>({});

	const call = async (body: Record<string, unknown>) => {
		const response = await fetch('/api/auth/email-code', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
		const result = await response.json().catch(() => ({}));
		if (!response.ok) throw new Error(result.error || 'Qualcosa non ha funzionato. Riprova.');
	};

	const run = async (work: () => Promise<void>) => {
		if (state.loading) return;
		setState({ loading: true });
		try {
			await work();
		} catch (err) {
			setState({ error: err instanceof Error ? err.message : String(err) });
		}
	};

	const send = () =>
		run(async () => {
			await call({});
			setSent(true);
			setState({});
		});

	const check = (e: FormEvent) => {
		e.preventDefault();
		return run(async () => {
			await call({ code });
			setState({ done: true });
			onVerified?.();
		});
	};

	if (state.done) return <Alert tone="success">Email confermata.</Alert>;
	if (!sent) {
		return (
			<div className="flex flex-col gap-3">
				{state.error && <Alert tone="error">{state.error}</Alert>}
				<Button variant="secondary" onClick={send} loading={state.loading} className="self-start">
					Mandami il codice
				</Button>
			</div>
		);
	}
	return (
		<form onSubmit={check} className="flex flex-col gap-3">
			<p className="text-sm text-fg-muted">
				Abbiamo mandato un codice di {EMAIL_CODE.digits} cifre a {email}. Vale {EMAIL_CODE.minutes} minuti.
			</p>
			<div className="flex gap-3">
				<Input
					aria-label="Codice di conferma"
					inputMode="numeric"
					autoComplete="one-time-code"
					maxLength={EMAIL_CODE.digits}
					placeholder={'0'.repeat(EMAIL_CODE.digits)}
					value={code}
					onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
					className="max-w-40 text-center text-lg tracking-[0.3em]"
				/>
				<Button type="submit" loading={state.loading} disabled={code.length !== EMAIL_CODE.digits}>
					Conferma
				</Button>
			</div>
			{state.error && <Alert tone="error">{state.error}</Alert>}
			<button type="button" onClick={send} className="self-start rounded text-sm text-fg-subtle underline-offset-4 hover:text-fg hover:underline focus-ring">
				Mandane un altro
			</button>
		</form>
	);
}
