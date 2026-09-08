'use client';

import { useState, type FormEvent } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Label } from '@/components/ui/Field';
import { ChatMessage } from '@/components/content/lesson/ChatMessage';

/** Asks the writer/critic pipeline for a lesson draft and shows the markdown it returns. */
export function DraftDesk() {
	const [topic, setTopic] = useState('');
	const [state, setState] = useState<{ loading?: boolean; error?: string; status?: string; draft?: string }>({});

	const submit = async (e: FormEvent) => {
		e.preventDefault();
		if (!topic.trim() || state.loading) return;
		setState({ loading: true });
		try {
			const response = await fetch('/api/generate-draft', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lessonTopic: topic.trim() }) });
			const data = await response.json();
			if (!response.ok || !data.success) throw new Error(data.error || 'Errore durante la generazione del draft');
			setState({ status: data.status, draft: data.lesson_markdown });
			setTopic('');
		} catch (err) {
			setState({ error: err instanceof Error ? err.message : 'Errore sconosciuto' });
		}
	};

	return (
		<div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
			<header>
				<h1 className="text-3xl font-bold text-fg">Admin Desk</h1>
				<p className="text-fg-muted">Genera e gestisci i contenuti dei topic della wiki</p>
			</header>
			<Card className="space-y-6 p-6 sm:p-8">
				<h2 className="text-2xl font-semibold text-fg">Genera nuovo draft</h2>
				<form onSubmit={submit} className="space-y-6">
					<div>
						<Label htmlFor="topic">Titolo del topic</Label>
						<Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Es: Equazioni di Secondo Grado" required disabled={state.loading} />
					</div>
					<Button type="submit" size="lg" className="w-full" loading={state.loading} disabled={!topic.trim()}>
						{state.loading ? 'Generazione in corso...' : 'Genera draft'}
					</Button>
				</form>
				{state.error && <Alert tone="error">{state.error}</Alert>}
				{state.status && <Alert tone="success">Draft generato con successo! Status: {state.status}</Alert>}
			</Card>
			{state.draft && (
				<Card className="space-y-4 p-6 sm:p-8">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-semibold text-fg">Anteprima del contenuto generato</h2>
						<Button variant="ghost" size="sm" onClick={() => setState({})}>Chiudi</Button>
					</div>
					<div className="max-h-[600px] overflow-auto rounded-xl border border-edge bg-surface-2 p-6">
						<ChatMessage content={state.draft} className="text-fg" />
					</div>
				</Card>
			)}
		</div>
	);
}
