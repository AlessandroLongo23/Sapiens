import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { referralOverview } from '@/lib/server/referrals';
import { CreatorCodeRow, NewCreatorCode } from '@/components/admin/CreatorCodes';

export const metadata: Metadata = pageMetadata({ title: 'Inviti | Admin | Sapiens', path: '/admin/inviti' });

const COLUMNS = ['Codice', 'Iscritti', 'Attivati', 'Paganti', ''];

/**
 * Creators' codes and what each brought, to choose whom to work with again (creators are paid per content, by hand:
 * vault/Decisioni/2026-09-28 I creator si pagano a contenuto, non a provvigione.md); the friends' codes only as
 * totals (vault/Prodotti/Studenti/Inviti e codici.md).
 */
export default async function InvitiPage() {
	const { creators, friends } = await referralOverview();
	return (
		<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
			<h1 className="mb-2 text-3xl font-bold text-fg">Inviti e codici</h1>
			<p className="mb-8 max-w-3xl text-fg-muted">
				Chi si iscrive con il codice di un creator ha la prova lunga; qui si vede quanti iscritti, attivati e paganti ha portato ogni codice. I creator si pagano a contenuto pubblicato, a mano, con un contratto: mai a iscrizione o a vendita.
			</p>

			<h2 className="mb-3 text-xl font-semibold text-fg">Creator</h2>
			<NewCreatorCode />
			<div className="mb-10 mt-4 overflow-x-auto rounded-xl border border-edge bg-surface">
				<table className="w-full min-w-[560px] text-sm">
					<thead>
						<tr className="border-b border-edge text-left">
							{COLUMNS.map((label) => (
								<th key={label} scope="col" className="px-4 py-3 font-semibold text-fg">
									{label}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{creators.length === 0 ? (
							<tr>
								<td colSpan={COLUMNS.length} className="px-4 py-6 text-center text-fg-muted">
									Nessun codice di creator.
								</td>
							</tr>
						) : (
							creators.map((c) => <CreatorCodeRow key={c.code} stats={c} />)
						)}
					</tbody>
				</table>
			</div>

			<h2 className="mb-3 text-xl font-semibold text-fg">Porta un amico</h2>
			<p className="mb-4 max-w-3xl text-fg-muted">Tutti i codici degli studenti insieme: nessun dato del singolo studente.</p>
			<dl className="grid gap-4 sm:grid-cols-3">
				{[
					['Studenti con un codice', friends.codes],
					['Amici iscritti', friends.signups],
					['Amici attivati', friends.activated],
					['Premi in giorni', friends.daysRewards],
					['Premi in credito', friends.creditRewards],
					['Crediti non ancora su Stripe', friends.pendingCredits]
				].map(([label, value]) => (
					<div key={label} className="rounded-xl border border-edge bg-surface p-4">
						<dt className="label-mono mb-2 text-fg-subtle">{label}</dt>
						<dd className="text-lg font-medium text-fg tabular-nums">{value}</dd>
					</div>
				))}
			</dl>
		</div>
	);
}
