'use client';

import { useId, useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Select } from '@/components/ui/Field';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { frame, Drawing, Figure, Caption, Controls, Readout, Tex, TINT, THIN, FONT, v } from './kit';

/**
 * Lesson 95, "Eventi compatibili": the 36 outcomes of two dice in the lessons' table (rows the first die, columns the
 * second, the sum in each cell). The student picks two events; A's cells turn blue, B's red, and the cells of both are
 * half and half, as in the lesson's figure. Switched to "quante volte è contata", every coloured cell shows how many
 * times |A| + |B| counts it: the 2s are A ∩ B, and the formula for p(A ∪ B) fills in with the counts.
 */

const C = 0.7; // cell side
const f = frame(-1.3, 6 * C + 0.1, -6 * C - 0.1, 1.35);
const GRID = '#666666'; // black!60
const RED = '#ffcccc'; // red!20

type Kind = 'doppio' | 'somma' | 'sommaMin' | 'almenoUn' | 'nessun' | 'primo' | 'secondo' | 'sommaPari';
type Event = { kind: Kind; k: number };
const KINDS: { kind: Kind; label: string; range?: [number, number] }[] = [
	{ kind: 'doppio', label: 'esce un doppio' },
	{ kind: 'somma', label: 'la somma è k', range: [2, 12] },
	{ kind: 'sommaMin', label: 'la somma è almeno k', range: [2, 12] },
	{ kind: 'almenoUn', label: 'esce almeno un k', range: [1, 6] },
	{ kind: 'nessun', label: 'non esce nessun k', range: [1, 6] },
	{ kind: 'primo', label: 'il primo dado dà k', range: [1, 6] },
	{ kind: 'secondo', label: 'il secondo dado dà k', range: [1, 6] },
	{ kind: 'sommaPari', label: 'la somma è pari' }
];
const info = (kind: Kind) => KINDS.find((x) => x.kind === kind)!;

function holds(e: Event, a: number, b: number) {
	switch (e.kind) {
		case 'doppio': return a === b;
		case 'somma': return a + b === e.k;
		case 'sommaMin': return a + b >= e.k;
		case 'almenoUn': return a === e.k || b === e.k;
		case 'nessun': return a !== e.k && b !== e.k;
		case 'primo': return a === e.k;
		case 'secondo': return b === e.k;
		case 'sommaPari': return (a + b) % 2 === 0;
	}
}
const describe = (e: Event) => info(e.kind).label.replace(' k', ` ${e.k}`);
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const frac = (p: number, q = 36) => `\\dfrac{${p}}{${q}}`;
function reduced(p: number) {
	if (p === 0) return '0';
	if (p === 36) return '1';
	const g = gcd(p, 36);
	return g > 1 ? `${frac(p)} = ${frac(p / g, 36 / g)}` : frac(p);
}

const DICE = [1, 2, 3, 4, 5, 6];
const OUTCOMES = DICE.flatMap((a) => DICE.map((b) => [a, b] as const));

function EventControl({ name, color, value, onChange }: { name: 'A' | 'B'; color: string; value: Event; onChange: (e: Event) => void }) {
	const id = useId();
	const range = info(value.kind).range;
	return (
		<div className="flex flex-col gap-2">
			<label htmlFor={id} className="text-sm font-medium text-fg-muted">
				Evento <Tex>{name}</Tex> ({color})
			</label>
			<Select
				id={id}
				value={value.kind}
				onChange={(e) => {
					const kind = e.target.value as Kind;
					const r = info(kind).range;
					onChange({ kind, k: r ? Math.min(r[1], Math.max(r[0], value.k)) : value.k });
				}}
			>
				{KINDS.map((x) => (
					<option key={x.kind} value={x.kind}>
						{x.label}
					</option>
				))}
			</Select>
			{range && <Slider label="k" value={value.k} min={range[0]} max={range[1]} step={1} onChange={(k) => onChange({ ...value, k: Math.round(k) })} />}
		</div>
	);
}

export default function DueDadiUnione({ alt }: { alt?: string }) {
	const [A, setA] = useState<Event>({ kind: 'doppio', k: 6 });
	const [B, setB] = useState<Event>({ kind: 'somma', k: 8 });
	const [mode, setMode] = useState<'somma' | 'volte'>('somma');

	const inA = OUTCOMES.filter(([a, b]) => holds(A, a, b));
	const inB = OUTCOMES.filter(([a, b]) => holds(B, a, b));
	const both = OUTCOMES.filter(([a, b]) => holds(A, a, b) && holds(B, a, b));
	const union = OUTCOMES.filter(([a, b]) => holds(A, a, b) || holds(B, a, b)).length;
	const [nA, nB, nAB] = [inA.length, inB.length, both.length];

	const cell = (a: number, b: number) => {
		const x0 = (b - 1) * C, x1 = b * C, y0 = -(a - 1) * C, y1 = -a * C;
		const pa = holds(A, a, b), pb = holds(B, a, b);
		const center = f.px(v(x0 + C / 2, (y0 + y1) / 2));
		let fill = null;
		if (pa && pb)
			fill = (
				<>
					<path d={f.path([v(x0, y1), v(x1, y1), v(x0, y0)], true)} fill={TINT.blue20} />
					<path d={f.path([v(x1, y0), v(x0, y0), v(x1, y1)], true)} fill={RED} />
				</>
			);
		else if (pa || pb) fill = <path d={f.path([v(x0, y0), v(x1, y0), v(x1, y1), v(x0, y1)], true)} fill={pa ? TINT.blue20 : RED} />;
		const text = mode === 'somma' ? `${a + b}` : pa || pb ? `${Number(pa) + Number(pb)}` : '';
		return (
			<g key={`${a}${b}`}>
				{fill}
				<text x={center.x} y={center.y} dy="0.35em" textAnchor="middle" fontSize={mode === 'volte' && pa && pb ? 14 : 12} fontWeight={mode === 'volte' && pa && pb ? 700 : 400} fontFamily={FONT} fill="#000">
					{text}
				</text>
			</g>
		);
	};

	const pairs = both.map(([a, b]) => `(${a}, ${b})`);
	const list = pairs.length <= 3 ? pairs.join(', ') : `${pairs.slice(0, 3).join(', ')} e altre ${pairs.length - 3}`;
	let caption: string;
	if (nAB === 0) caption = `A e B sono incompatibili: nessuna casella è di tutti e due, quindi $p(A \\cap B) = 0$ e le probabilità si sommano.`;
	else if (mode === 'somma') caption = `${nAB === 1 ? `La casella divisa a metà, ${list}, sta` : `Le ${nAB} caselle divise a metà, ${list}, stanno`} in tutti e due gli eventi. Scegli «quante volte è contata» per vedere cosa succede sommando i casi.`;
	else caption = `Sommando i casi di A e quelli di B si contano ${nA} + ${nB} = ${nA + nB} caselle, ma ${nAB === 1 ? 'la casella con il 2 è contata' : 'le caselle con il 2 sono contate'} due volte: le caselle colorate sono ${union}, e per questo si toglie $p(A \\cap B)$.`;

	const formula =
		nAB === 0
			? `\\begin{aligned} p(A \\cup B) &= ${frac(nA)} + ${frac(nB)} \\\\ &= ${reduced(union)} \\end{aligned}`
			: `\\begin{aligned} p(A \\cup B) &= ${frac(nA)} + ${frac(nB)} - ${frac(nAB)} \\\\ &= ${reduced(union)} \\end{aligned}`;

	return (
		<Figure>
			<Drawing f={f} label={alt ?? 'Tabella dei 36 lanci di due dadi, con le caselle di due eventi colorate'}>
				{OUTCOMES.map(([a, b]) => cell(a, b))}
				{Array.from({ length: 7 }, (_, i) => (
					<g key={i} stroke={GRID} strokeWidth={THIN}>
						<path d={f.path([v(i * C, 0), v(i * C, -6 * C)])} />
						<path d={f.path([v(0, -i * C), v(6 * C, -i * C)])} />
					</g>
				))}
				{DICE.map((d) => {
					const top = f.px(v((d - 0.5) * C, C / 2)), left = f.px(v(-C / 2, -(d - 0.5) * C));
					return (
						<g key={d} fontSize={13} fontFamily={FONT} fill="#000" textAnchor="middle">
							<text x={top.x} y={top.y} dy="0.35em">{d}</text>
							<text x={left.x} y={left.y} dy="0.35em">{d}</text>
						</g>
					);
				})}
				{(() => {
					const top = f.px(v(3 * C, C * 1.45)), left = f.px(v(-C * 1.45, -3 * C));
					return (
						<g fontSize={13} fontFamily={FONT} fill="#000" textAnchor="middle">
							<text x={top.x} y={top.y} dy="0.35em">secondo dado</text>
							<text x={left.x} y={left.y} dy="0.35em" transform={`rotate(-90 ${left.x} ${left.y})`}>primo dado</text>
						</g>
					);
				})()}
			</Drawing>
			<ToggleGroup
				label="Nelle caselle"
				options={[{ value: 'somma', label: 'la somma' }, { value: 'volte', label: 'quante volte è contata' }]}
				value={mode}
				onChange={setMode}
			/>
			<Readout>
				<span>
					<Tex>A</Tex>: {describe(A)}, <Tex>{`${nA}`}</Tex> {nA === 1 ? 'caso' : 'casi'}
				</span>
				<span>
					<Tex>B</Tex>: {describe(B)}, <Tex>{`${nB}`}</Tex> {nB === 1 ? 'caso' : 'casi'}
				</span>
				<span>
					<Tex>{`A \\cap B`}</Tex>: <Tex>{`${nAB}`}</Tex> {nAB === 1 ? 'caso' : 'casi'}
				</span>
			</Readout>
			<div className="max-w-full overflow-x-auto text-fg">
				<Tex display>{formula}</Tex>
			</div>
			<Caption>{caption.split('$').map((part, i) => (i % 2 ? <Tex key={i}>{part}</Tex> : <span key={i}>{part}</span>))}</Caption>
			<Controls>
				<div className="flex flex-col gap-4">
					<EventControl name="A" color="caselle blu" value={A} onChange={setA} />
					<EventControl name="B" color="caselle rosse" value={B} onChange={setB} />
				</div>
			</Controls>
		</Figure>
	);
}
