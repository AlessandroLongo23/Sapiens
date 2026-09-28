'use client';

import { ChevronRight, ChevronsRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ButtonRow, Caption, Controls, Drawing, FONT, Figure, INK, Readout, Tex, THICK, THIN, frame, useTween, v } from './kit';

/**
 * Lesson 19, "Il crivello di Eratostene": the table of the TikZ figure, 1 to 100, sieved one step at a time. A step
 * circles the first number not crossed out, which is prime, and crosses out its multiples one after the other from
 * its square, skipping those already crossed. After 7 the next candidate is 11, and 11 · 11 > 100: what is left is prime.
 *
 * The whole run is a list of events; t (a tween) is how many of them have happened, so a step, the run to the end and
 * reduced motion are all the same drawing at a different t.
 */

const N = 100;
const DX = 0.75;
const DY = 0.65;
const f = frame(-0.45, 9 * DX + 0.45, -9 * DY - 0.42, 0.42);

type Event = { kind: 'circle'; n: number } | { kind: 'cross'; n: number; by: number } | { kind: 'end'; next: number };

function sieve() {
	const events: Event[] = [];
	const starts: number[] = []; // where each step starts
	const crossed = new Set<number>();
	let p = 2;
	while (p * p <= N) {
		starts.push(events.length);
		events.push({ kind: 'circle', n: p });
		for (let m = p * p; m <= N; m += p)
			if (!crossed.has(m)) {
				crossed.add(m);
				events.push({ kind: 'cross', n: m, by: p });
			}
		do p++;
		while (crossed.has(p));
	}
	starts.push(events.length);
	events.push({ kind: 'end', next: p });
	starts.push(events.length);
	return { events, starts };
}
const { events, starts } = sieve();
const END = events.length;

const at = (n: number) => v(((n - 1) % 10) * DX, -Math.floor((n - 1) / 10) * DY);

export default function CrivelloEratostene({ alt }: { alt?: string }) {
	const [t, go, running] = useTween(0);
	const applied = Math.floor(t + 1e-6);

	const circled: number[] = [];
	const crossed = new Map<number, number>();
	let current = 0;
	let end: number | null = null;
	for (const e of events.slice(0, applied)) {
		if (e.kind === 'circle') {
			circled.push(e.n);
			current = e.n;
		} else if (e.kind === 'cross') crossed.set(e.n, e.by);
		else end = e.next;
	}
	if (end !== null) for (let n = 2; n <= N; n++) if (!crossed.has(n) && !circled.includes(n)) circled.push(n);

	const run = (target: number) => void go(target, Math.min(4500, 300 + 35 * (target - t)));
	const step = () => run(starts.find((s) => s > applied) ?? END);

	const below = current > 2 ? Array.from({ length: current - 2 }, (_, i) => current * (i + 2)) : [];

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{Array.from({ length: N }, (_, i) => {
					const n = i + 1;
					const p = f.px(at(n));
					const by = crossed.get(n);
					const fresh = by !== undefined && by === current && end === null;
					const a = f.px({ x: at(n).x - 0.25, y: at(n).y - 0.2 });
					const b = f.px({ x: at(n).x + 0.25, y: at(n).y + 0.2 });
					return (
						<g key={n}>
							<text x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontFamily={FONT} fontSize={13.5} fill={by !== undefined ? INK.gray : '#000'}>
								{n}
							</text>
							{circled.includes(n) && <circle cx={p.x} cy={p.y} r={0.3 * (f.W / (f.x1 - f.x0))} fill="none" stroke={n === current && end === null ? INK.blue : '#000'} strokeWidth={THICK} />}
							{by !== undefined && <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={fresh ? INK.blue : INK.gray} strokeWidth={fresh ? THICK : THIN} />}
						</g>
					);
				})}
			</Drawing>

			<Caption>
				{applied === 0 ? (
					<>Il <Tex>1</Tex> non è né primo né composto. Premi &laquo;Passo&raquo;: il primo numero non cancellato è il <Tex>2</Tex>.</>
				) : end !== null ? (
					<>
						Il primo numero non cancellato dopo il <Tex>7</Tex> è <Tex>{String(end)}</Tex>, e <Tex>{`${end} \\cdot ${end} = ${end * end} > 100`}</Tex>: i numeri rimasti sono tutti primi, e il crivello è finito.
					</>
				) : (
					<>
						<Tex>{String(current)}</Tex> è primo: si cerchia e se ne cancellano i multipli, in blu, a partire da <Tex>{`${current} \\cdot ${current} = ${current * current}`}</Tex>.
						{below.length > 0 && (
							<>
								{' '}
								I multipli più piccoli, <Tex>{below.join(',\\ ')}</Tex>, erano già cancellati.
							</>
						)}
					</>
				)}
			</Caption>
			<Readout>
				<span>
					{end !== null ? `${circled.length} numeri primi fino a 100` : circled.length ? 'primi trovati: ' : 'nessun primo ancora'}
					{end === null && circled.length > 0 && <Tex>{circled.join(',\\ ')}</Tex>}
				</span>
			</Readout>
			<Controls>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={running || applied >= END} onClick={step}>
						<ChevronRight className="size-4" aria-hidden="true" />
						Passo
					</Button>
					<Button variant="secondary" size="sm" disabled={running || applied >= END} onClick={() => run(END)}>
						<ChevronsRight className="size-4" aria-hidden="true" />
						Fino alla fine
					</Button>
					<Button variant="secondary" size="sm" disabled={running || applied === 0} onClick={() => void go(0, 0)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
