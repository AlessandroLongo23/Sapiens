import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { betaMetrics, totals, type Cohort } from '@/lib/server/metrics';

export const metadata: Metadata = pageMetadata({ title: 'Metriche | Admin | Sapiens', path: '/admin/metriche' });

const WEEK = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/** "3 su 10 (30%)", or a dash while nobody can be counted yet. */
function rate(part: number, whole: number) {
	if (whole === 0) return <span className="text-fg-faint">—</span>;
	return (
		<>
			<span className="font-medium text-fg tabular-nums">{Math.round((part / whole) * 100)}%</span>{' '}
			<span className="text-fg-subtle tabular-nums">
				{part}/{whole}
			</span>
		</>
	);
}

const COLUMNS: { label: string; cell: (c: Omit<Cohort, 'week'>) => React.ReactNode }[] = [
	{ label: 'Iscritti', cell: (c) => <span className="font-medium text-fg tabular-nums">{c.signups}</span> },
	{ label: 'Attivati', cell: (c) => rate(c.activated, c.signups) },
	{ label: 'Pagano dopo la prova', cell: (c) => rate(c.paid, c.trial_ended) },
	{ label: 'Tornano la 4ª settimana', cell: (c) => rate(c.w4_returned, c.w4_eligible) }
];

/** The beta's metrics (vault/Piano/Metriche.md): weekly cohorts of sign-ups, counts only, never a student. */
export default async function MetrichePage() {
	const cohorts = await betaMetrics();
	const all = totals(cohorts);
	return (
		<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
			<h1 className="mb-2 text-3xl font-bold text-fg">Metriche della beta</h1>
			<p className="mb-8 max-w-3xl text-fg-muted">Per settimana di iscrizione, in ora di Roma. Esclusi gli account admin e quelli di prova (@example.com). Solo conteggi: nessun dato del singolo studente.</p>

			<dl className="mb-10 grid gap-4 sm:grid-cols-4">
				{COLUMNS.map(({ label, cell }) => (
					<div key={label} className="rounded-xl border border-edge bg-surface p-4">
						<dt className="label-mono mb-2 text-fg-subtle">{label}</dt>
						<dd className="text-lg">{cell(all)}</dd>
					</div>
				))}
			</dl>

			<div className="overflow-x-auto rounded-xl border border-edge bg-surface">
				<table className="w-full min-w-[640px] text-sm">
					<thead>
						<tr className="border-b border-edge text-left">
							<th scope="col" className="px-4 py-3 font-semibold text-fg">
								Settimana
							</th>
							{COLUMNS.map(({ label }) => (
								<th key={label} scope="col" className="px-4 py-3 font-semibold text-fg">
									{label}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{cohorts.length === 0 ? (
							<tr>
								<td colSpan={COLUMNS.length + 1} className="px-4 py-6 text-center text-fg-muted">
									Nessuna iscrizione da contare.
								</td>
							</tr>
						) : (
							cohorts.map((c) => (
								<tr key={c.week} className="border-b border-edge-soft last:border-0">
									<th scope="row" className="px-4 py-3 text-left font-normal text-fg-muted">
										dal {WEEK.format(new Date(`${c.week}T12:00:00Z`))}
									</th>
									{COLUMNS.map(({ label, cell }) => (
										<td key={label} className="px-4 py-3">
											{cell(c)}
										</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			<section className="mt-8 max-w-3xl text-sm text-fg-muted">
				<h2 className="mb-2 font-semibold text-fg">Come si contano</h2>
				<ul className="list-disc space-y-1 pl-5">
					<li>Attivati: hanno finito almeno una prova entro 7 giorni dall&apos;iscrizione.</li>
					<li>Pagano dopo la prova: hanno pagato almeno una volta, abbonamento o Studio fino a giugno, su chi ha finito la settimana gratuita. La data del primo pagamento si registra dal 26 settembre 2026.</li>
					<li>Tornano la 4ª settimana: hanno risposto ad almeno una domanda tra il 21° e il 27° giorno dall&apos;iscrizione, su chi si è iscritto da almeno 28 giorni. L&apos;obiettivo della beta è il 30%.</li>
				</ul>
			</section>
		</div>
	);
}
