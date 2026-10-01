import { FILLING_ORDER, SUBLEVEL_TABLE } from '@/lib/orbitali/configurazione';

/**
 * The rule of the diagonal as the books draw it: the sublevels in a grid, one level per row and one letter per
 * column, crossed by arrows that go up and to the left. Reading the arrows from the lowest gives the order in which
 * the sublevels fill. The sublevels an element occupies are in the strong ink.
 */

const CW = 38;
const CH = 26;
const PAD = 22;
const at = (n: number, l: number) => ({ x: PAD + l * CW, y: PAD + (7 - n) * CH });

/** The diagonals: the sublevels with the same n + l, from the lowest level (the first to fill) to the highest. */
const DIAGONALS = Array.from({ length: 8 }, (_, i) => FILLING_ORDER.filter((s) => s.n + s.l === i + 1)).filter((d) => d.length > 0);

export function FillingOrder({ occupied }: { occupied: Set<string> | null }) {
	const width = 2 * PAD + 3 * CW;
	const height = 2 * PAD + 6 * CH;
	return (
		<figure className="m-0 flex shrink-0 flex-col items-center gap-2">
			<svg
				viewBox={`0 0 ${width} ${height}`}
				width={width}
				height={height}
				role="img"
				aria-label={`Regola della diagonale. I sottolivelli si riempiono in quest’ordine: ${FILLING_ORDER.map((s) => s.name).join(', ')}.`}
				className="max-w-full text-fg-muted"
			>
				<defs>
					<marker id="filling-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
						<path d="M1 1 9 5 1 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
					</marker>
				</defs>
				{DIAGONALS.map((diagonal, i) => {
					// From below and right of the first sublevel to above and left of the last.
					const from = at(diagonal[0].n, diagonal[0].l);
					const to = at(diagonal[diagonal.length - 1].n, diagonal[diagonal.length - 1].l);
					return <line key={i} x1={from.x + CW * 0.42} y1={from.y + CH * 0.42} x2={to.x - CW * 0.5} y2={to.y - CH * 0.5} stroke="currentColor" strokeWidth={1.2} opacity={0.55} markerEnd="url(#filling-arrow)" />;
				})}
				{Object.entries(SUBLEVEL_TABLE).flatMap(([n, ls]) =>
					ls.map((l) => {
						const name = `${n}${'spdf'[l]}`;
						const p = at(Number(n), l);
						const on = occupied?.has(name) ?? false;
						return (
							// The halo keeps the name readable where an arrow passes behind it.
							<text key={name} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" className={on ? 'fill-fg-strong font-semibold' : occupied ? 'fill-fg-subtle' : 'fill-fg'} style={{ font: `${on ? 600 : 400} 13px var(--font-mono)`, paintOrder: 'stroke', stroke: 'var(--surface)', strokeWidth: 4 }}>
								{name}
							</text>
						);
					})
				)}
			</svg>
			<figcaption className="max-w-[16rem] text-center text-xs leading-snug text-fg-muted">Si legge seguendo le frecce, dalla più bassa: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s e così via.</figcaption>
		</figure>
	);
}
