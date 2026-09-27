'use client';

import { useMemo } from 'react';
import { quartili, type BoxData } from '@/lib/tools/quartili';
import { cn } from '@/lib/utils/cn';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

/** Eleven data, an odd number: the median stays out of both halves, and the box is lopsided. */
const DEFAULTS = { n: '6 47 49 15 43 41 7 39 43 40 36' };

const EXAMPLES = ['2 4 5 7 8 9 12 15', '12 15 11 18 20 14 13', '5,5; 6; 7,5; 8; 6,5; 9', '1 2 2 3 3 3 4 20'];

const fmt = (n: number) => Math.round(n * 10) / 10;

/** A round step (1, 2 or 5 times a power of ten) that gives about `target` intervals over `span`. */
export function niceStep(span: number, target: number): number {
	const raw = span / target;
	const p = 10 ** Math.floor(Math.log10(raw));
	const k = raw / p;
	return (k <= 1 ? 1 : k <= 2 ? 2 : k <= 5 ? 5 : 10) * p;
}

/** A number on an axis, Italian style: "0,5", "−2". */
export function tick(v: number): string {
	const s = String(Number(v.toPrecision(6))).replace('.', ',');
	return s.startsWith('-') ? `−${s.slice(1)}` : s;
}

/** The ticks of an axis from lo to hi, about `target` of them. */
export function ticks(lo: number, hi: number, target: number): number[] {
	const step = niceStep(hi - lo, target);
	const out: number[] = [];
	for (let k = Math.ceil(lo / step - 1e-9); k * step <= hi + 1e-9; k++) out.push(k * step);
	return out;
}

const W = 340;
const H = 132;
const L = 18;
const R = W - 18;
const AXIS = 104;
const TOP = 40;
const BOTTOM = 80;
const MID = (TOP + BOTTOM) / 2;

/**
 * The box plot of the five numbers, drawn like the figures of the lessons: an axis with round numbers, the box from
 * Q1 to Q3 in the pale accent, the median in the accent colour, the whiskers out to the minimum and the maximum.
 */
export function BoxPlot({ box }: { box: BoxData }) {
	const span = box.max - box.min || Math.abs(box.max) || 1;
	const lo = box.min - span * 0.06;
	const hi = box.max + span * 0.06;
	const x = (v: number) => fmt(L + ((v - lo) / (hi - lo)) * (R - L));
	const marks = ticks(lo, hi, 6);
	const title = `Box plot: minimo ${tick(box.min)}, primo quartile ${tick(box.q1)}, mediana ${tick(box.med)}, terzo quartile ${tick(box.q3)}, massimo ${tick(box.max)}`;
	const narrow = x(box.q3) - x(box.q1) < 26;
	// The names over the box, the median's below it when it is too close to a quartile to fit.
	const tight = narrow || Math.min(x(box.med) - x(box.q1), x(box.q3) - x(box.med)) < 22;
	const name = (text: string, at: number, y: number, accent = false, anchor: 'start' | 'middle' | 'end' = 'middle') => (
		<text x={at} y={y} textAnchor={anchor} fontSize={14} paintOrder="stroke" strokeWidth={4} strokeLinejoin="round" className={cn('stroke-surface italic', accent ? 'fill-accent font-medium' : 'fill-fg-muted')}>
			{text}
		</text>
	);
	return (
		<svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title} className="h-auto w-full max-w-md self-center text-fg">
			<title>{title}</title>
			<g className="stroke-edge" strokeWidth={1}>
				{marks.map((m) => (
					<line key={m} x1={x(m)} y1={TOP - 12} x2={x(m)} y2={AXIS} />
				))}
			</g>
			<line x1={L} y1={AXIS} x2={R} y2={AXIS} className="stroke-fg-muted" strokeWidth={1.3} />
			{marks.map((m) => (
				<text key={m} x={x(m)} y={AXIS + 17} textAnchor="middle" fontSize={11} className="fill-fg-subtle">
					{tick(m)}
				</text>
			))}
			<g className="stroke-current" strokeWidth={1.5}>
				<line x1={x(box.min)} y1={MID} x2={x(box.q1)} y2={MID} />
				<line x1={x(box.q3)} y1={MID} x2={x(box.max)} y2={MID} />
				<line x1={x(box.min)} y1={MID - 9} x2={x(box.min)} y2={MID + 9} />
				<line x1={x(box.max)} y1={MID - 9} x2={x(box.max)} y2={MID + 9} />
			</g>
			<rect x={x(box.q1)} y={TOP} width={Math.max(x(box.q3) - x(box.q1), 0.5)} height={BOTTOM - TOP} className="fill-accent/10 stroke-current" strokeWidth={1.5} />
			<line x1={x(box.med)} y1={TOP} x2={x(box.med)} y2={BOTTOM} className="stroke-accent" strokeWidth={2.5} />
			{name('Q₁', x(box.q1), TOP - 16, false, narrow ? 'end' : 'middle')}
			{name('Q₃', x(box.q3), TOP - 16, false, narrow ? 'start' : 'middle')}
			{tight ? name('Me', x(box.med), BOTTOM + 16, true) : name('Me', x(box.med), TOP - 16, true)}
		</svg>
	);
}

export function QuartiliTool() {
	const [state, set] = useToolState(DEFAULTS);
	const { outcome, box } = useMemo(() => quartili(state.n), [state.n]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToolField label="Dati" hint="Da 4 a 100 numeri, separati da uno spazio o da un punto e virgola. Per i decimali usa la virgola: 7,5.">
						<input className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={state.n} onChange={(e) => set({ n: e.target.value })} />
					</ToolField>
					{box && <BoxPlot box={box} />}
					<Examples items={EXAMPLES.map((n) => ({ label: n, apply: () => set({ n }) }))} />
				</>
			}
		/>
	);
}
