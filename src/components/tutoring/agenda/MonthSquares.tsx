/**
 * Hours a month, counted on the squares of the page: a column per month, a square filled in red pen per hour
 * (a half hour fills half a square). The figure under each column is the number to read; the squares compare.
 */
export function MonthSquares({ months, unit, label }: { months: { name: string; hours: number }[]; unit: (hours: number) => string; label: string }) {
	const tallest = Math.max(4, ...months.map((m) => Math.ceil(m.hours)));
	// A square is an hour up to twelve rows; beyond, each square stands for more, and the caption says so.
	const per = Math.ceil(tallest / 12);
	const rows = Math.ceil(tallest / per);
	return (
		<figure>
			<ol className="flex items-end gap-4 sm:gap-6" aria-label={label}>
				{months.map((m) => {
					const filled = m.hours / per;
					return (
						<li key={m.name} className="flex flex-col items-center gap-2" title={`${m.name}: ${unit(m.hours)}`}>
							<span className="flex flex-col-reverse gap-[3px]" aria-hidden="true">
								{Array.from({ length: rows }, (_, i) => {
									const part = Math.max(0, Math.min(1, filled - i));
									return (
										<span key={i} className="relative size-[18px] overflow-hidden rounded-[3px] border border-edge-strong bg-surface">
											{part > 0 && <span className="absolute inset-x-0 bottom-0 bg-accent" style={{ height: `${part * 100}%` }} />}
										</span>
									);
								})}
							</span>
							<span className="font-display text-sm font-semibold text-fg-strong tabular-nums">{unit(m.hours)}</span>
							<span className="label-mono text-fg-subtle">{m.name}</span>
						</li>
					);
				})}
			</ol>
			<figcaption className="label-mono mt-3 text-fg-subtle">{per === 1 ? "Un quadretto, un'ora di lezione" : `Un quadretto, ${per} ore di lezione`}</figcaption>
		</figure>
	);
}
