import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { ContentNode } from '@/lib/utils/tree';
import { countByType } from '@/lib/utils/tree';
import { toneFor } from '@/lib/utils/icons';
import { nodePath } from '@/lib/seo/slug';
import { cn } from '@/lib/utils/cn';
import { Latex } from '@/components/ui/Latex';
import { INK } from '@/components/landing/hero-ink';
import { PenStroke } from './PageHeader';
import { SheetCycle } from './SheetCycle';

/*
 * A level of the library as a sheet of squared paper, in the language of the home
 * page sketch: taped down at a slight angle, the subjects' dividers standing on
 * its top edge, and on it the pen writes a piece of working for each subject
 * that the red pen marks, one subject after another (Pythagoras, a cell, a
 * quadratic, F = ma, an integral, PV = nRT...), the subject's divider standing up. The handwriting
 * is Hershey Script, generated with the sketch's by scripts/landing/hero-ink.mjs.
 *
 * The sheet stays light in the dark theme, like the sketch, so its colours are fixed.
 */

const S = 22; // one square, in pixels: the working is drawn at its natural size so it sits on the squares
const W = 14 * S;
const H = 7 * S;
const PEN = 560; // handwriting speed, pixels per second
const LIFT = 0.03; // pause between two strokes, seconds

const INK_COLOR = 'oklch(0.3 0.05 262)';
const RED = 'oklch(0.56 0.22 22)';
const FAINT = 'oklch(0.55 0.02 262)';

type Vars = CSSProperties & Record<`--${string}`, string>;
const at = (d: number, t?: number): Vars => ({ '--d': `${d.toFixed(2)}s`, ...(t != null && { '--t': `${t.toFixed(2)}s` }) });

/** How long the pen takes to write formula `id`. */
const inkTime = (id: string) => INK[id].s.reduce((sum, [, len]) => sum + len / PEN + LIFT, 0);

/** Formula `id` written by the pen from time `t`, baseline-left at (x, y). */
function Ink({ id, x, y, t, color = INK_COLOR }: { id: string; x: number; y: number; t: number; color?: string }) {
	// Each stroke starts when the one before it ends.
	const starts = INK[id].s.reduce<number[]>((acc, _, i) => [...acc, i === 0 ? t : acc[i - 1] + INK[id].s[i - 1][1] / PEN + LIFT], []);
	return (
		<g transform={`translate(${x} ${y})`} stroke={color} strokeWidth={1.5}>
			{INK[id].s.map(([path, len], i) => (
				<path key={i} d={path} pathLength={1} className="sk-draw sk-linear" style={at(starts[i], len / PEN)} />
			))}
		</g>
	);
}

/** A stroke drawn from time `d` over `t` seconds. */
function Stroke({ d, t, dur = 0.4, color = INK_COLOR, width = 1.5 }: { d: string; t: number; dur?: number; color?: string; width?: number }) {
	return <path d={d} stroke={color} strokeWidth={width} pathLength={1} className="sk-draw" style={at(t, dur)} />;
}

/** A red-pen loop around (x, y): a little more than one turn, never quite closed. */
function loop(x: number, y: number, rx: number, ry = rx) {
	let d = '';
	for (let i = 0; i <= 28; i++) {
		const a = -2.2 + (i / 28) * 2 * Math.PI * 1.12;
		const k = 1 + 0.07 * Math.sin(i * 0.9);
		d += `${i ? 'L' : 'M'}${(x + rx * k * Math.cos(a)).toFixed(1)} ${(y + ry * k * Math.sin(a)).toFixed(1)}`;
	}
	return d;
}

/** y = f(x) from a to b, in the plot's units, as a path. */
function curve(f: (x: number) => number, a: number, b: number, ox: number, oy: number, sx: number, sy: number, n = 40) {
	let d = '';
	for (let i = 0; i <= n; i++) {
		const x = a + ((b - a) * i) / n;
		d += `${i ? 'L' : 'M'}${(ox + x * sx).toFixed(1)} ${(oy - f(x) * sy).toFixed(1)}`;
	}
	return d;
}

/** The working of each subject, keyed by `level/subject`, written from time `t0`. */
const WORKING: Record<string, (t0: number) => ReactNode> = {
	// Middle school, maths: the theorem of Pythagoras on the 3-4-5 triangle, drawn on the squares; the red pen rings the sum.
	'middle_school/math': (t0) => {
		const t1 = t0 + inkTime('lib.mid.eq') + 0.2;
		const t2 = t1 + inkTime('lib.mid.sum') + 0.15;
		const t3 = t2 + 0.7;
		return (
			<>
				<Ink id="lib.mid.eq" x={2} y={44} t={t0} />
				<Ink id="lib.mid.sum" x={4} y={88} t={t1} />
				<Stroke d="M198 55V121H286Z" t={t2} dur={0.7} width={1.7} />
				<Stroke d="M198 110H209V121" t={t3} dur={0.2} width={1.1} />
				<Ink id="lib.mid.a" x={180} y={95} t={t3 + 0.1} />
				<Ink id="lib.mid.b" x={236} y={144} t={t3 + 0.25} />
				<Ink id="lib.mid.c" x={248} y={82} t={t3 + 0.4} />
				<Stroke d={loop(143, 80, 22, 15)} t={t3 + 0.7} dur={0.5} color={RED} width={1.8} />
			</>
		);
	},
	// High school, maths: a quadratic, factored, its two roots ringed and marked on a small parabola.
	'high_school/math': (t0) => {
		const t1 = t0 + inkTime('lib.high.eq') + 0.2;
		const t2 = t1 + inkTime('lib.high.f') + 0.2;
		const t3 = t2 + inkTime('lib.high.x1') + 0.15;
		const t4 = t3 + inkTime('lib.high.x2') + 0.2;
		const [ox, oy, sx, sy] = [180, 132, 30, 40];
		return (
			<>
				<Ink id="lib.high.eq" x={2} y={33} t={t0} />
				<Ink id="lib.high.f" x={2} y={77} t={t1} />
				<Ink id="lib.high.x1" x={2} y={124} t={t2} />
				<Ink id="lib.high.x2" x={104} y={124} t={t3} />
				<Stroke d="M208 132H300" t={t4} dur={0.3} color={FAINT} width={1.1} />
				<Stroke d={curve((x) => (x - 2) * (x - 3), 1.4, 3.6, ox, oy, sx, sy)} t={t4 + 0.25} dur={0.6} width={1.7} />
				<Stroke d={loop(40, 116, 47, 18)} t={t4 + 0.9} dur={0.45} color={RED} width={1.8} />
				<Stroke d={loop(142, 116, 47, 18)} t={t4 + 1.3} dur={0.45} color={RED} width={1.8} />
				<circle cx={ox + 2 * sx} cy={oy} r={3.2} fill={RED} className="sk-pop" style={at(t4 + 1.75)} />
				<circle cx={ox + 3 * sx} cy={oy} r={3.2} fill={RED} className="sk-pop" style={at(t4 + 1.85)} />
			</>
		);
	},
	// Analisi I: a definite integral, and the area it measures hatched under the curve.
	'university/analisi-1': (t0) => {
		const t1 = t0 + inkTime('lib.uni.eq') + 0.2;
		const [ox, oy, sx, sy] = [196, 132, 90, 90];
		const hatch = Array.from({ length: 9 }, (_, i) => (i + 1) / 10);
		const t2 = t1 + 0.9 + hatch.length * 0.08;
		return (
			<>
				<Ink id="lib.uni.eq" x={2} y={62} t={t0} />
				<Stroke d={`M${ox - 8} ${oy}H${ox + 1.15 * sx}M${ox} ${oy + 8}V${oy - 1.3 * sy}`} t={t1} dur={0.4} color={FAINT} width={1.1} />
				<Stroke d={curve((x) => x * x, 0, 1.15, ox, oy, sx, sy)} t={t1 + 0.3} dur={0.5} width={1.7} />
				<Stroke d={`M${ox + sx} ${oy}V${oy - sy}`} t={t1 + 0.75} dur={0.25} color={FAINT} width={1} />
				{hatch.map((x, i) => (
					<Stroke key={x} d={`M${(ox + x * sx).toFixed(1)} ${oy}V${(oy - x * x * sy + 2).toFixed(1)}`} t={t1 + 0.9 + i * 0.08} dur={0.12} color={RED} width={1} />
				))}
				<Stroke d={loop(170, 55, 16, 24)} t={t2} dur={0.45} color={RED} width={1.8} />
				<Ink id="lib.uni.area" x={120} y={124} t={t2 + 0.4} color={RED} />
				<Stroke d="M162 118Q200 112 246 122M239 117L246 122L238 126" t={t2 + 0.4 + inkTime('lib.uni.area')} dur={0.4} color={RED} width={1.4} />
			</>
		);
	},
	// Middle school, technology: a block and its front view, the projection lines in red, the view dimensioned.
	'middle_school/technology': (t0) => {
		const t1 = t0 + inkTime('lib.mt.t') + 0.2;
		const t2 = t1 + 1.3;
		return (
			<>
				<Ink id="lib.mt.t" x={2} y={30} t={t0} />
				<Stroke d="M22 66H88V132H22ZM22 66L44 44H110L88 66M110 44V110L88 132" t={t1} dur={1} width={1.7} />
				<Stroke d="M176 66H242V132H176Z" t={t2} dur={0.6} width={1.7} />
				<Stroke d="M88 66H176M88 132H176" t={t2 + 0.6} dur={0.5} color={RED} width={1.1} />
				<Ink id="lib.mt.view" x={176} y={58} t={t2 + 1.1} />
				<Stroke d="M176 144H242M176 139V149M242 139V149" t={t2 + 1.1 + inkTime('lib.mt.view')} dur={0.4} color={FAINT} width={1.1} />
				<Ink id="lib.mt.dim" x={247} y={149} t={t2 + 1.5 + inkTime('lib.mt.view')} />
			</>
		);
	},
	// Middle school, science: a cell drawn by hand, its parts labelled with red arrows.
	'middle_school/science': (t0) => {
		const t1 = t0 + inkTime('lib.ms.t') + 0.2;
		const t2 = t1 + 1.2;
		const label = (id: string, y: number, t: number, to: string) => (
			<>
				<Ink id={id} x={206} y={y} t={t} />
				<Stroke d={to} t={t + inkTime(id)} dur={0.35} color={RED} width={1.3} />
			</>
		);
		return (
			<>
				<Ink id="lib.ms.t" x={2} y={30} t={t0} />
				<Stroke d={loop(110, 98, 72, 44)} t={t1} dur={0.8} width={1.7} />
				<Stroke d={loop(122, 94, 17, 15)} t={t1 + 0.8} dur={0.35} width={1.5} />
				<Stroke d="M60 84q8 -6 16 0t16 0M70 116q10 6 20 0M150 118q6 -8 14 -2" t={t1 + 1.1} dur={0.5} color={FAINT} width={1.1} />
				{label('lib.ms.n', 70, t2, 'M202 66Q170 70 140 88M146 83L140 88L147 91')}
				{label('lib.ms.m', 110, t2 + inkTime('lib.ms.n') + 0.5, 'M202 105L184 101M189 97L184 101L190 104')}
				{label('lib.ms.c', 146, t2 + inkTime('lib.ms.n') + inkTime('lib.ms.m') + 1, 'M202 140Q170 136 152 120M152 127L152 120L158 123')}
			</>
		);
	},
	// High school, physics: the second law with numbers, the force pushing a block, the result ringed.
	'high_school/physics': (t0) => {
		const t1 = t0 + inkTime('lib.hp.eq') + 0.2;
		const t2 = t1 + inkTime('lib.hp.n') + 0.2;
		const t3 = t2 + inkTime('lib.hp.r') + 0.2;
		return (
			<>
				<Ink id="lib.hp.eq" x={2} y={40} t={t0} />
				<Ink id="lib.hp.n" x={28} y={84} t={t1} />
				<Ink id="lib.hp.r" x={28} y={128} t={t2} />
				<Stroke d={loop(86, 120, 30, 16)} t={t3} dur={0.45} color={RED} width={1.8} />
				<Stroke d="M190 132H300" t={t3 + 0.3} dur={0.35} color={FAINT} width={1.1} />
				<Stroke d="M236 98H280V132H236Z" t={t3 + 0.5} dur={0.5} width={1.7} />
				<Stroke d="M190 115H232M225 110L232 115L225 120" t={t3 + 1} dur={0.4} color={RED} width={1.8} />
				<Ink id="lib.hp.F" x={202} y={104} t={t3 + 1.3} color={RED} />
			</>
		);
	},
	// High school, computer science: 13 in binary, bit by bit in their boxes, with the place values and the check.
	'high_school/computer-science': (t0) => {
		const t1 = t0 + inkTime('lib.hc.eq') + 0.2;
		const bits = [1, 1, 0, 1];
		const places = ['lib.hc.p8', 'lib.hc.p4', 'lib.hc.p2', 'lib.hc.p1'];
		const t2 = t1 + 0.6 + bits.length * 0.35;
		return (
			<>
				<Ink id="lib.hc.eq" x={2} y={40} t={t0} />
				<Stroke d="M2 66H178V110H2ZM46 66V110M90 66V110M134 66V110" t={t1} dur={0.6} width={1.5} />
				{bits.map((b, i) => (
					<g key={i}>
						<Ink id={places[i]} x={44 * i + 19} y={62} t={t1 + 0.6 + i * 0.35} color={FAINT} />
						<Ink id={b ? 'lib.d1' : 'lib.d0'} x={44 * i + 15} y={98} t={t1 + 0.7 + i * 0.35} />
					</g>
				))}
				<Ink id="lib.hc.s" x={2} y={142} t={t2} color={RED} />
				<Stroke d="M190 132l7 8l15 -20" t={t2 + inkTime('lib.hc.s') + 0.1} dur={0.3} color={RED} width={2} />
			</>
		);
	},
	// High school, chemistry: water from hydrogen and oxygen, balanced, and the molecule drawn.
	'high_school/chemistry': (t0) => {
		const t1 = t0 + inkTime('lib.hk.eq') + 0.3;
		return (
			<>
				<Ink id="lib.hk.eq" x={2} y={40} t={t0} />
				<Stroke d={loop(230, 102, 18)} t={t1} dur={0.4} width={1.7} />
				<Stroke d={loop(194, 128, 14)} t={t1 + 0.4} dur={0.3} width={1.7} />
				<Stroke d={loop(266, 128, 14)} t={t1 + 0.6} dur={0.3} width={1.7} />
				<Stroke d="M215 113L206 119M245 113L254 119" t={t1 + 0.9} dur={0.3} width={1.5} />
				<Ink id="lib.hk.O" x={224} y={110} t={t1 + 1.1} />
				<Ink id="lib.hk.H" x={187} y={134} t={t1 + 1.3} />
				<Ink id="lib.hk.H" x={259} y={134} t={t1 + 1.45} />
				<Ink id="lib.hk.w" x={80} y={112} t={t1 + 1.8} color={RED} />
				<Stroke d="M132 106Q170 96 206 102M199 97L206 102L199 107" t={t1 + 1.8 + inkTime('lib.hk.w')} dur={0.4} color={RED} width={1.4} />
			</>
		);
	},
	// Analisi II: e^x and its Taylor polynomial of degree two, which hugs it near zero.
	'university/analisi-2': (t0) => {
		const t1 = t0 + inkTime('lib.u2.eq') + 0.2;
		const [ox, oy, sx, sy] = [206, 142, 44, 24];
		return (
			<>
				<Ink id="lib.u2.eq" x={2} y={46} t={t0} />
				<Stroke d={`M112 ${oy}H300M${ox} 150V64`} t={t1} dur={0.4} color={FAINT} width={1.1} />
				<Stroke d={curve(Math.exp, -2, 1.05, ox, oy, sx, sy)} t={t1 + 0.3} dur={0.6} width={1.7} />
				<Stroke d={curve((x) => 1 + x + (x * x) / 2, -2, 1.05, ox, oy, sx, sy)} t={t1 + 1} dur={0.6} color={RED} width={1.5} />
				<circle cx={ox} cy={oy - sy} r={3.2} fill={RED} className="sk-pop" style={at(t1 + 1.6)} />
			</>
		);
	},
	// Fisica I: a ball let fall from a height, energy conserved, the speed at the bottom ringed.
	'university/fisica-1': (t0) => {
		const t1 = t0 + inkTime('lib.u3.eq') + 0.2;
		const t2 = t1 + inkTime('lib.u3.r') + 0.2;
		return (
			<>
				<Ink id="lib.u3.eq" x={2} y={40} t={t0} />
				<Ink id="lib.u3.r" x={2} y={88} t={t1} />
				<Stroke d={loop(55, 80, 60, 18)} t={t2} dur={0.45} color={RED} width={1.8} />
				<Stroke d="M214 132H300" t={t2 + 0.3} dur={0.3} color={FAINT} width={1.1} />
				<Stroke d={loop(254, 44, 7)} t={t2 + 0.5} dur={0.3} width={1.7} />
				<path d="M254 54V124" stroke={FAINT} strokeWidth={1.1} strokeDasharray="3 4" className="sk-fade" style={at(t2 + 0.8)} />
				<Ink id="lib.u3.h" x={262} y={94} t={t2 + 0.9} />
				<Stroke d="M240 100V126M235 119L240 126L245 119" t={t2 + 1.2} dur={0.35} color={RED} width={1.6} />
			</>
		);
	},
	// Fisica II: the ideal gas law, and an isotherm on the P-V plane.
	'university/fisica-2': (t0) => {
		const t1 = t0 + inkTime('lib.u4.eq') + 0.2;
		const [ox, oy, sx, sy] = [150, 140, 48, 24];
		return (
			<>
				<Ink id="lib.u4.eq" x={2} y={40} t={t0} />
				<Stroke d={`M${ox} ${oy}H300M${ox} ${oy}V56`} t={t1} dur={0.4} width={1.2} />
				<Ink id="lib.u4.P" x={132} y={68} t={t1 + 0.4} />
				<Ink id="lib.u4.V" x={288} y={152} t={t1 + 0.55} />
				<Stroke d={curve((v) => 1 / v, 0.35, 3, ox, oy, sx, sy)} t={t1 + 0.8} dur={0.6} width={1.7} />
				<Ink id="lib.u4.T" x={208} y={96} t={t1 + 1.5} color={RED} />
				<circle cx={ox + sx} cy={oy - sy} r={3.2} fill={RED} className="sk-pop" style={at(t1 + 1.5 + inkTime('lib.u4.T'))} />
			</>
		);
	},
	// Fondamenti di informatica: the truth table of AND beside its gate, the one true row ringed.
	'university/fondamenti-informatica': (t0) => {
		const rows = [
			[0, 0, 0],
			[0, 1, 0],
			[1, 0, 0],
			[1, 1, 1]
		];
		const t1 = t0 + inkTime('lib.u5.A') + inkTime('lib.u5.B') + inkTime('lib.u5.AB') + 0.3;
		const t2 = t1 + 0.4 + rows.length * 0.4;
		return (
			<>
				<Ink id="lib.u5.A" x={10} y={30} t={t0} />
				<Ink id="lib.u5.B" x={48} y={30} t={t0 + inkTime('lib.u5.A')} />
				<Ink id="lib.u5.AB" x={88} y={30} t={t0 + inkTime('lib.u5.A') + inkTime('lib.u5.B')} />
				<Stroke d="M2 38H144M78 14V146" t={t1} dur={0.4} color={FAINT} width={1.1} />
				{rows.map((row, r) =>
					row.map((v, c) => <Ink key={`${r}${c}`} id={v ? 'lib.d1' : 'lib.d0'} x={[10, 48, 106][c]} y={62 + r * 24} t={t1 + 0.4 + r * 0.4 + c * 0.1} />)
				)}
				<Stroke d={loop(113, 128, 13)} t={t2} dur={0.4} color={RED} width={1.8} />
				<Stroke d="M192 62H214A24 24 0 0 1 214 110H192Z" t={t2 + 0.3} dur={0.6} width={1.7} />
				<Stroke d="M168 74H192M168 98H192M238 86H270" t={t2 + 0.9} dur={0.4} width={1.5} />
				<Ink id="lib.u5.A" x={152} y={80} t={t2 + 1.2} />
				<Ink id="lib.u5.B" x={152} y={104} t={t2 + 1.35} />
				<Ink id="lib.u5.t" x={192} y={140} t={t2 + 1.5} color={RED} />
			</>
		);
	}
};

/** A level: who it is for, one line on what it holds. */
const LEVELS: Record<string, { who: string; blurb: string }> = {
	middle_school: { who: '11–14 anni', blurb: 'Dalle frazioni al teorema di Pitagora, dalla cellula al Sistema solare, dal disegno tecnico alle fonti di energia.' },
	high_school: { who: '14–19 anni', blurb: 'I cinque anni di matematica, fisica, informatica e chimica, dagli insiemi alle derivate.' },
	university: { who: 'Primi esami', blurb: 'Analisi, fisica e informatica dei primi anni di ingegneria e delle facoltà scientifiche.' }
};

/** Each sheet lies at its own angle, with its tape on its own corner; picked up (hovered), it straightens. */
const LIE = [
	{ tilt: '-rotate-[0.9deg]', tape: 'right-6 -top-3 rotate-[4deg]' },
	{ tilt: 'rotate-[0.7deg]', tape: '-right-5 bottom-5 -rotate-[34deg]' },
	{ tilt: '-rotate-[0.5deg]', tape: 'left-1/2 -top-3 -rotate-[3deg]' }
];

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * A level on the library page. The title links to the level (and so does the
 * whole sheet); each subject in the list links to its subject. `short` gives a
 * subject's name as it fits in the list.
 */
export function LevelSheet({ level, href, index, short }: { level: ContentNode; href: string; index: number; short: (subject: ContentNode) => string }) {
	const about = LEVELS[level.slug];
	const lie = LIE[index % LIE.length];
	const c = countByType(level.children);
	return (
		// `data-active` is the subject whose working is on the sheet; SheetCycle moves it, CSS in globals.css follows it.
		<article className="level-sheet group relative pt-6" data-active="0">
			<SheetCycle count={level.children.length} offset={index} />
			<div className={cn('relative h-full transition-transform duration-500 ease-out-soft group-hover:rotate-0 motion-reduce:transition-none', lie.tilt)}>
				{/* The dividers of the subjects, standing on the sheet's top edge in their colours. */}
				<div className="absolute bottom-full left-6 flex items-end gap-1" aria-hidden="true">
					{level.children.map((subject, i) => (
						<span key={subject.id} data-subject={toneFor(subject)} data-tabbar={i} className="block h-4 w-9 rounded-t-md bg-tint-cover transition-[height] duration-300 ease-out-soft" />
					))}
				</div>
				<div className="grid-paper relative flex h-full flex-col rounded-2xl border border-[oklch(0.86_0.012_85)] bg-paper-50 p-[22px] text-ink-800 shadow-paper transition-shadow duration-500 [--grid:color-mix(in_oklab,oklch(0.62_0.09_245)_18%,transparent)] group-hover:shadow-lift dark:brightness-[0.92]">
					<div className="flex h-[22px] items-center justify-between gap-4">
						<span className="label-mono text-ink-500">
							<span className="text-[oklch(0.56_0.22_22)]">{String(index + 1).padStart(2, '0')}</span>
							{about && <span> · {about.who}</span>}
						</span>
						<ArrowUpRight className="size-5 text-ink-400 transition-[transform,color] duration-300 ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink-900" aria-hidden="true" />
					</div>
					{/* One working per subject; only the active one shows, and showing it again writes it again. The first waits for the page, the sheets one after another. */}
					<svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="mt-[22px] max-w-full shrink-0 overflow-visible" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
						{level.children.map((subject, i) => (
							<g key={subject.id} data-w={i}>
								{WORKING[`${level.slug}/${subject.slug}`]?.(i === 0 ? 0.4 + index * 0.35 : 0.15)}
							</g>
						))}
					</svg>
					<h3 className="mt-6 font-display text-4xl font-semibold leading-none tracking-tight text-ink-900">
						{/* The title's link covers the sheet (its positioned box); the subjects sit above it and keep their own links. */}
						<Link href={href} className="inline-block rounded-md no-underline after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-ring">
							<span className="relative inline-block">
								<Latex content={level.title} />
								<PenStroke onHover className="absolute inset-x-0 -bottom-2 h-2" />
							</span>
						</Link>
					</h3>
					{about && <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-ink-600">{about.blurb}</p>}
					<ul className="relative z-10 mt-auto flex flex-wrap gap-x-4 gap-y-1.5 pt-6">
						{level.children.map((subject, i) => (
							<li key={subject.id}>
								<Link href={nodePath([level, subject])} data-tab={i} data-subject={toneFor(subject)} className="group/s inline-flex items-center gap-2 rounded-sm py-0.5 font-display text-lg font-medium text-ink-900 no-underline focus-ring">
									<span className="size-2.5 rounded-[3px] bg-tint-cover" aria-hidden="true" />
									<span className="decoration-tint-cover decoration-2 underline-offset-4 group-hover/s:underline">{short(subject)}</span>
								</Link>
							</li>
						))}
					</ul>
					<p className="label-mono mt-4 flex flex-wrap gap-x-3 gap-y-1 text-ink-500">
						<span>{plural(c.subject, 'materia', 'materie')}</span>
						<span>{plural(c.chapter, 'capitolo', 'capitoli')}</span>
						<span>{plural(c.topic, 'lezione', 'lezioni')}</span>
					</p>
				</div>
				{/* Paper tape on one corner, the same in both themes: it lies on the sheet. */}
				<span className={cn('pointer-events-none absolute z-20 h-6 w-20 bg-[oklch(0.9_0.035_80/0.75)] shadow-paper', lie.tape)} aria-hidden="true" />
			</div>
		</article>
	);
}
