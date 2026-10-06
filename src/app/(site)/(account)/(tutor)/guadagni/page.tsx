import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { tutorArea } from '@/lib/server/tutor-area';
import { tutorLedger, type LedgerSum } from '@/lib/server/tutor-agenda';
import { euro, longDay, romeParts } from '@/lib/tutoring/agenda';
import { levelName, subjectName } from '@/lib/tutoring/config';
import { NoProfile } from '@/components/tutoring/NoProfile';
import { PaidToggle } from '@/components/tutoring/agenda/Lessons';
import { AreaHeader, Empty, Figure, Figures, SectionTitle } from '@/components/tutoring/agenda/Paper';
import { binderLabelClass, binderRowClass, binderTabClass } from '@/components/ui/binder-tabs';

export const metadata: Metadata = pageMetadata({ title: 'Guadagni | Area tutor | Sapiens', path: '/guadagni' });

const MONTHS = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
const hours = (h: number) => `${h.toLocaleString('it-IT', { maximumFractionDigits: 1 })} h`;

/** A table of sums with a bar for what each row earned, measured on the largest of them. */
function Sums({ caption, head, rows }: { caption: string; head: string; rows: (LedgerSum & { key: string; label: React.ReactNode })[] }) {
	const top = Math.max(1, ...rows.map((r) => r.earned));
	return (
		<div className="scroll-x">
			<table className="w-full min-w-[34rem] text-sm">
				<caption className="sr-only">{caption}</caption>
				<thead>
					<tr className="label-mono border-b border-edge-strong text-left text-fg-subtle">
						<th scope="col" className="py-2 pr-3 font-medium">{head}</th>
						<th scope="col" className="px-3 py-2 text-right font-medium">Lezioni</th>
						<th scope="col" className="px-3 py-2 text-right font-medium">Ore</th>
						<th scope="col" className="w-[38%] px-3 py-2 font-medium">Guadagni</th>
						<th scope="col" className="py-2 pl-3 text-right font-medium">Da incassare</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((r) => (
						<tr key={r.key} className="border-b border-edge">
							<th scope="row" className="py-2.5 pr-3 text-left font-medium text-fg-strong">{r.label}</th>
							<td className="px-3 py-2.5 text-right tabular-nums text-fg-muted">{r.lessons}</td>
							<td className="px-3 py-2.5 text-right tabular-nums text-fg-muted">{r.lessons ? hours(r.hours) : ''}</td>
							<td className="px-3 py-2.5">
								<span className="flex items-center gap-2">
									<span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-3" aria-hidden="true">
										<span className="block h-full rounded-full bg-accent" style={{ width: `${(100 * r.earned) / top}%` }} />
									</span>
									<span className="w-20 shrink-0 text-right tabular-nums text-fg-strong">{r.lessons ? euro(r.earned) : ''}</span>
								</span>
							</td>
							<td className="py-2.5 pl-3 text-right tabular-nums text-fg-muted">{r.unpaid > 0 ? euro(r.unpaid) : ''}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

/**
 * The tutor's ledger: what the lessons held are worth, what is still to be paid, and the same by month, subject,
 * student and level. The tutor's own register: nothing is paid through Sapiens.
 */
export default async function EarningsPage({ searchParams }: { searchParams: Promise<{ anno?: string }> }) {
	const { tutor } = await tutorArea();
	if (!tutor) return <NoProfile title="Prima crea il tuo profilo" />;
	const ledger = await tutorLedger(tutor.id);
	const { total } = ledger;
	const years = [...new Set(ledger.months.map((m) => m.month.slice(0, 4)))];
	const { anno } = await searchParams;
	const year = anno && years.includes(anno) ? anno : years[years.length - 1];
	const months = ledger.months.filter((m) => m.month.startsWith(`${year}-`));
	const yearSum = months.reduce((sum, m) => ({ lessons: sum.lessons + m.lessons, hours: sum.hours + m.hours, earned: sum.earned + m.earned, unpaid: sum.unpaid + m.unpaid }), { lessons: 0, hours: 0, earned: 0, unpaid: 0 });
	// What is still to be paid, a group a student.
	const owing = new Map<string, typeof ledger.unpaid>();
	for (const l of ledger.unpaid) owing.set(l.linkId, [...(owing.get(l.linkId) ?? []), l]);

	return (
		<>
			<AreaHeader eyebrow="Il tuo registro" title="Guadagni" lead="Ore e compensi delle lezioni fatte, con la tariffa che hai scritto su ciascuna. È un registro solo tuo: i pagamenti non passano da Sapiens." />
			{total.lessons === 0 ? (
				<Empty>Qui trovi ore e compensi delle lezioni fatte, mese per mese, e quelle ancora da incassare.</Empty>
			) : (
				<div className="space-y-12">
					<Figures label="In tutto">
						<Figure value={euro(total.earned)} label="guadagnati in tutto" />
						<Figure value={euro(total.unpaid)} label="da incassare" />
						<Figure value={hours(total.hours)} label={`in ${total.lessons} lezioni`} />
						{total.hours > 0 && <Figure value={euro(total.earned / total.hours)} label="in media l'ora" />}
					</Figures>

					<section aria-labelledby="da-incassare">
						<SectionTitle id="da-incassare" title="Da incassare" count={ledger.unpaid.length} />
						{ledger.unpaid.length === 0 ? (
							<Empty>Tutte le lezioni fatte risultano pagate.</Empty>
						) : (
							<ul className="space-y-6">
								{[...owing.entries()].map(([linkId, list]) => (
									<li key={linkId} data-owing={list[0].with}>
										<p className="flex items-baseline justify-between gap-3 border-b border-edge pb-1.5">
											<Link href={`/studenti/${linkId}/lezioni`} className="font-medium text-fg-strong hover:text-accent-fg">{list[0].with}</Link>
											<span className="text-sm tabular-nums text-fg-muted">{euro(list.reduce((sum, l) => sum + ((l.hourlyRate ?? 0) * l.durationMin) / 60, 0))}</span>
										</p>
										<ul>
											{list.map((l) => {
												const { day, time } = romeParts(l.startsAt);
												return (
													<li key={l.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-edge py-2 text-sm">
														<span className="text-fg-muted first-letter:uppercase">{longDay(day)} {day.slice(0, 4)}, {time}{l.subject ? ` · ${subjectName(l.subject)}` : ''}</span>
														<PaidToggle lesson={l} />
													</li>
												);
											})}
										</ul>
									</li>
								))}
							</ul>
						)}
					</section>

					<section aria-labelledby="per-mese">
						<div className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-edge-strong">
							<h2 id="per-mese" className="pb-2.5 text-2xl font-semibold text-fg-strong">Mese per mese</h2>
							<nav aria-label="Anno" className={binderRowClass}>
								{years.map((y) => (
									<Link key={y} href={`/guadagni?anno=${y}`} scroll={false} aria-current={y === year ? 'page' : undefined} className={binderTabClass(y === year)}>
										<span className={binderLabelClass(y === year)}>{y}</span>
									</Link>
								))}
							</nav>
						</div>
						<p className="mb-3 text-sm text-fg-muted">Nel {year}: {yearSum.lessons} lezioni, {hours(yearSum.hours)}, {euro(yearSum.earned)}.</p>
						<Sums caption={`Lezioni, ore e guadagni del ${year}, mese per mese`} head="Mese" rows={months.map((m) => ({ ...m, key: m.month, label: MONTHS[Number(m.month.slice(5, 7)) - 1] }))} />
					</section>

					<section aria-labelledby="per-materia">
						<SectionTitle id="per-materia" title="Per materia" count={ledger.subjects.length} />
						<Sums caption="Lezioni, ore e guadagni per materia" head="Materia" rows={ledger.subjects.map((s) => ({ ...s, key: s.subject ?? '-', label: s.subject ? subjectName(s.subject) : 'Non indicata' }))} />
					</section>

					<section aria-labelledby="per-studente">
						<SectionTitle id="per-studente" title="Per studente" count={ledger.students.length} />
						<Sums caption="Lezioni, ore e guadagni per studente" head="Studente" rows={ledger.students.map((s) => ({ ...s, key: s.linkId, label: <Link href={`/studenti/${s.linkId}`} className="hover:text-accent-fg">{s.name}</Link> }))} />
					</section>

					<section aria-labelledby="per-livello">
						<SectionTitle id="per-livello" title="Per livello" />
						<Sums caption="Lezioni, ore e guadagni per livello" head="Livello" rows={ledger.levels.map((l) => ({ ...l, key: l.level ?? '-', label: l.level ? levelName(l.level) : 'Non indicato' }))} />
					</section>
				</div>
			)}
		</>
	);
}
