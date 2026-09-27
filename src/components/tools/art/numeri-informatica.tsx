import type { ReactNode } from 'react';
import { Accent, Art, Dashed, Dot, Fill, Ink, Label } from './primitives';

/** A thin grid line, paler than the ink (already in numeri.tsx as `Thin`, in informatica.tsx as `Rule`). */
const Thin = ({ d }: { d: string }) => <path d={d} className="stroke-fg-muted" strokeWidth={1} vectorEffect="non-scaling-stroke" />;

/* ---------------------------------------------------------------- numeri.tsx */

/** The numbers 1…12 on a line, x of k. */
const tickX = (k: number) => 12 + ((k - 1) * 96) / 11;
/** An arc over the line joining the two divisors of a pair, `h` high. */
const pairArc = (a: number, b: number, h: number) => `M${tickX(a).toFixed(2)},60 Q${((tickX(a) + tickX(b)) / 2).toFixed(2)},${60 - 2 * h} ${tickX(b).toFixed(2)},60`;

/** The montante year by year at 18% (exaggerated so the curve shows): the tops of five bars. */
const YEARS = [0, 1, 2, 3, 4].map((k) => ({ x: 16 + 18 * k, h: 30 * 1.18 ** k }));
const GROWTH = Array.from({ length: 37 }, (_, i) => {
	const t = i / 9; // years, 0 to 4
	return `${i ? 'L' : 'M'}${(22 + 18 * t).toFixed(2)},${(70 - 30 * 1.18 ** t).toFixed(2)}`;
}).join(' ');

export const DIVISORI_INTERESSE_ART: Record<string, ReactNode> = {
	'divisori-di-un-numero': (
		<Art>
			{/* The numbers from 1 to n on a line; the divisors, joined in pairs whose product is n. */}
			<Ink d="M8,60 H112" className="stroke-fg-muted" />
			<Thin d={Array.from({ length: 12 }, (_, i) => `M${tickX(i + 1).toFixed(2)},57 V63`).join(' ')} />
			<Ink d={`${pairArc(1, 12, 40)} ${pairArc(2, 6, 20)} ${pairArc(3, 4, 8)}`} />
			{[1, 2, 3, 4, 6, 12].map((k) => (
				<Dot key={k} x={tickX(k)} y={60} accent />
			))}
			<Label x={108} y={71}>
				n
			</Label>
		</Art>
	),
	'frazione-decimale-percentuale': (
		<Art>
			{/* One bar read on two scales, quarters above and tenths below: the same point on both. */}
			<Fill d="M14,32 H83 V46 H14 Z" className="stroke-none" />
			<Ink d="M14,32 H106 V46 H14 Z" />
			<Thin d="M37,26 V32 M60,26 V32 M83,26 V32 M14,26 V32 M106,26 V32" />
			<Thin d={Array.from({ length: 11 }, (_, k) => `M${(14 + 9.2 * k).toFixed(1)},46 V${k % 5 === 0 ? 54 : 51}`).join(' ')} />
			<Accent d="M83,18 V60" />
			<Label x={112} y={62} plain size={10}>
				%
			</Label>
		</Art>
	),
	'calcolo-interesse': (
		<Art>
			{/* The capital each year, and the interest piled on it, growing on itself. */}
			<Ink d="M8,70 H112" className="stroke-fg-muted" />
			{YEARS.map(({ x, h }) => (
				<g key={x}>
					<Fill d={`M${x},70 V40 H${x + 12} V70`} />
					{h > 30.5 && <Fill d={`M${x},40 V${(70 - h).toFixed(2)} H${x + 12} V40`} className="fill-accent/25" />}
				</g>
			))}
			<Accent d={GROWTH} />
		</Art>
	)
};

/* ---------------------------------------------------------------- informatica.tsx */

/** The bits of 1011 + 110 = 10001 in column: x of each column, from the left. */
const COL = [44, 56, 68, 80, 92];

export const RETI_ART: Record<string, ReactNode> = {
	'convertitore-byte': (
		<Art>
			{/* A terabyte and a tebibyte side by side: 1000⁴ against 1024⁴ bytes, the difference in the accent. */}
			<Label x={14} y={19} plain anchor="start" size={10}>
				TB
			</Label>
			<Fill d="M14,26 H94 V36 H14 Z" />
			<Thin d="M34,26 V36 M54,26 V36 M74,26 V36" />
			<Label x={14} y={48} plain anchor="start" size={10}>
				TiB
			</Label>
			<Fill d="M14,54 H94 V64 H14 Z" />
			<Thin d="M36,54 V64 M58,54 V64 M80,54 V64" />
			<Accent d="M94,54 H102 V64 H94 Z" className="fill-accent/25" />
			<Dashed d="M94,22 V68" />
		</Art>
	),
	'calcolatrice-binaria': (
		<Art>
			{/* A sum in column, the carries small over the columns they go into. */}
			{[44, 56, 68].map((x) => (
				<Label key={x} x={x} y={10} plain size={8}>
					1
				</Label>
			))}
			{['1', '0', '1', '1'].map((b, i) => (
				<Label key={`a${i}`} x={COL[i + 1]} y={23} plain size={11}>
					{b}
				</Label>
			))}
			<Label x={30} y={37} plain size={11}>
				+
			</Label>
			{['1', '1', '0'].map((b, i) => (
				<Label key={`b${i}`} x={COL[i + 2]} y={37} plain size={11}>
					{b}
				</Label>
			))}
			<Ink d="M24,46 H100" />
			{['1', '0', '0', '0', '1'].map((b, i) => (
				<Label key={`c${i}`} x={COL[i]} y={58} plain accent size={11}>
					{b}
				</Label>
			))}
		</Art>
	),
	'calcolo-subnet-mask': (
		<Art>
			{/* The four octets of an address: the mask cuts the network bits from the host bits. */}
			<Fill d="M8,28 H30 V46 H8 Z M34,28 H56 V46 H34 Z M60,28 H82 V46 H60 Z M86,28 H91.5 V46 H86 Z" className="stroke-none" />
			<Ink d="M8,28 H30 V46 H8 Z M34,28 H56 V46 H34 Z M60,28 H82 V46 H60 Z M86,28 H108 V46 H86 Z" />
			<Dot x={32} y={45} />
			<Dot x={58} y={45} />
			<Dot x={84} y={45} />
			<Accent d="M91.5,20 V54" />
			<Label x={48} y={62} plain size={10}>
				rete
			</Label>
			<Label x={100} y={62} plain size={10}>
				host
			</Label>
		</Art>
	)
};
