'use client';

import { useState, type ReactNode } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Handle, Label, Tex, frame, v, clamp, num, INK, THICK, THIN, DOTTED, FONT, FONT_MATH, type V } from './kit';

/**
 * The sign table of (x − 2)(x + 3), and of (x − 2)/(x + 3), with a cursor on x (lesson 54). Drawn like the TikZ table
 * of the lesson: the zeros −3 and 2 at 1,6 and 3,2 cm, a solid line where a factor is positive and a dashed one where
 * it is negative. The table is not to scale (only the order of the zeros counts), so the cursor moves along it piece
 * by piece: −7…−3 on the first stretch, −3…2 on the second, 2…7 on the third. At the cursor every row shows the value
 * of its factor and its sign, the last one the product (or the fraction, which does not exist where x + 3 = 0).
 */

const LO = -7, HI = 7;
const Z1 = -3, Z2 = 2;
const P1 = 1.6, P2 = 3.2, END = 4.8;
const GAP = 0.17;

const f = frame(-1.6, 7.0, -2.25, 1.0);
const GRAY = '#999'; // gray!60

/** x on the table, and back. */
const pos = (x: number) => (x <= Z1 ? ((x - LO) / (Z1 - LO)) * P1 : x <= Z2 ? P1 + ((x - Z1) / (Z2 - Z1)) * (P2 - P1) : P2 + ((x - Z2) / (HI - Z2)) * (END - P2));
const unpos = (p: number) => (p <= P1 ? LO + (p / P1) * (Z1 - LO) : p <= P2 ? Z1 + ((p - P1) / (P2 - P1)) * (Z2 - Z1) : Z2 + ((p - P2) / (END - P2)) * (HI - Z2));
const round1 = (x: number) => Math.round(x * 10) / 10;

const sign = (x: number) => (Math.abs(x) < 1e-9 ? 0 : x > 0 ? 1 : -1);
const SIGN = { '1': '+', '-1': '−', '0': '0' } as const;
/** −1,5 with the minus sign of the lesson. */
const show = (x: number, digits = 2) => num(x, digits).replace('-', '−');

type Factor = { label: string; zero: number; value: (x: number) => number };
const PLUS3: Factor = { label: 'x + 3', zero: Z1, value: (x) => x + 3 };
const MINUS2: Factor = { label: 'x − 2', zero: Z2, value: (x) => x - 2 };

const ROW = [-0.62, -1.24];
const LAST = -1.86;
const MID = [0.8, 2.4, 4.0];

function Line({ a, b, y, dashed }: { a: number; b: number; y: number; dashed: boolean }) {
	return <path d={f.path([v(a, y), v(b, y)])} stroke="#000" strokeWidth={THICK} strokeDasharray={dashed ? '4.5 4.5' : undefined} />;
}
function Text({ at, children, color = '#000', size = 13, math = false, anchor = 'middle' }: { at: V; children: ReactNode; color?: string; size?: number; math?: boolean; anchor?: 'start' | 'middle' | 'end' }) {
	const p = f.px(at);
	return (
		<text x={p.x} y={p.y} dy="0.35em" textAnchor={anchor} fontSize={size} fontFamily={math ? FONT_MATH : FONT} fontStyle={math ? 'italic' : 'normal'} fill={color} pointerEvents="none">
			{children}
		</text>
	);
}

export default function TabellaSegniCursore({ alt }: { alt?: string }) {
	const [mode, setMode] = useState<'prodotto' | 'frazione'>('prodotto');
	const [x, setX] = useState(0.5);
	const fraction = mode === 'frazione';
	const rows = fraction ? [MINUS2, PLUS3] : [PLUS3, MINUS2];
	const cx = pos(x);
	const interval = x < Z1 ? 0 : x < Z2 ? 1 : 2;
	const at = (z: number) => Math.abs(x - z) < 1e-9;

	const a = x - 2, b = x + 3;
	const none = fraction && at(Z1);
	const result = fraction ? (none ? NaN : a / b) : a * b;
	const exact = Math.abs(Math.round(result * 100) / 100 - result) < 1e-9;
	const resultText = none ? 'non esiste' : `${exact ? '' : '≈ '}${show(result)}`;
	const resultSign = none ? null : sign(result);

	const move = (p: V) => {
		const d = p.x - cx;
		// The arrow keys move the handle by exactly its step: one tenth, or 1 with Shift.
		if (Math.abs(Math.abs(d) - 0.001) < 1e-9) return setX((x0) => clamp(round1(x0 + Math.sign(d) * 0.1), LO, HI));
		if (Math.abs(Math.abs(d) - 0.01) < 1e-9) return setX((x0) => clamp(round1(x0 + Math.sign(d)), LO, HI));
		if (d === 0) return;
		setX(clamp(round1(unpos(clamp(p.x, 0, END))), LO, HI));
	};

	const name = fraction ? 'la frazione' : 'il prodotto';
	const negatives = rows.filter((r) => sign(r.value(x)) < 0).length;
	let caption: ReactNode;
	if (none) caption = <>Per <Tex>x = -3</Tex> il denominatore <Tex>x + 3</Tex> vale zero: la frazione non esiste, e nella tabella c&apos;è un pallino vuoto.</>;
	else if (at(Z1) || at(Z2)) caption = <>Per <Tex>{`x = ${at(Z1) ? '-3' : '2'}`}</Tex> il fattore <Tex>{at(Z1) ? 'x + 3' : 'x - 2'}</Tex> vale zero, quindi {name} vale zero.</>;
	else
		caption = (
			<>
				Per <Tex>{`x = ${show(x, 1).replace('−', '-').replace(',', '{,}')}`}</Tex> {negatives === 0 ? 'nessun fattore è negativo' : negatives === 1 ? 'c\'è un fattore negativo' : 'tutti e due i fattori sono negativi'}, quindi {name} è {resultSign! > 0 ? 'positiv' : 'negativ'}{fraction ? 'a' : 'o'}. Il segno cambia solo quando il cursore passa per uno zero.
			</>
		);

	const hi = (i: number) => (i === interval && !at(Z1) && !at(Z2) ? INK.blue : '#000');

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* Header: the zeros in order, and x. */}
				<Text at={v(P1, 0)} size={15}>−3</Text>
				<Text at={v(P2, 0)} size={15}>2</Text>
				<Text at={v(5.05, 0)} size={15} math>x</Text>
				{[P1, P2].map((p) =>
					[[-0.2, -0.45], [-0.82, -1.07], [-1.44, -1.69]].map(([y0, y1], i) => (
						<path key={`${p}${i}`} d={f.path([v(p, y0), v(p, y1)])} stroke={GRAY} strokeWidth={THIN} strokeDasharray={DOTTED} />
					))
				)}

				{rows.map((r, k) => {
					const y = ROW[k];
					const zp = pos(r.zero);
					const signs = MID.map((m) => sign(r.value(unpos(m))));
					return (
						<g key={r.label}>
							<Text at={v(-0.12, y)} anchor="end" size={15}>
									<tspan fontFamily={FONT_MATH} fontStyle="italic">x</tspan>
									{r.label.slice(1)}
								</Text>
							<Line a={0} b={zp - GAP} y={y} dashed={r.value(r.zero - 1) < 0} />
							<Line a={zp + GAP} b={END} y={y} dashed={r.value(r.zero + 1) < 0} />
							{MID.map((m, i) => (
								<Text key={m} at={v(m, y + 0.2)} size={i === interval ? 15 : 13} color={hi(i)}>
									{SIGN[String(signs[i]) as '1']}
								</Text>
							))}
							<Text at={v(zp, y)} size={13} color={at(r.zero) ? INK.blue : '#000'}>0</Text>
							{/* The value of the factor at the cursor, and its sign. */}
							<Text at={v(5.5, y)} anchor="start" size={13} color={INK.blue}>{show(r.value(x), 1)}</Text>
							<Text at={v(6.75, y)} size={15} color={INK.blue}>{SIGN[String(sign(r.value(x))) as '1']}</Text>
						</g>
					);
				})}

				<path d={f.path([v(-0.1, -1.55), v(END, -1.55)])} stroke={GRAY} strokeWidth={THIN} />
				<Text at={v(-0.12, LAST)} anchor="end" size={13}>{fraction ? 'frazione' : 'prodotto'}</Text>
				{MID.map((m, i) => (
					<Text key={m} at={v(m, LAST)} size={i === interval ? 17 : 15} color={hi(i)}>
						{SIGN[String(sign(MINUS2.value(unpos(m)) * PLUS3.value(unpos(m)))) as '1']}
					</Text>
				))}
				{fraction ? (
					<circle cx={f.px(v(P1, LAST)).x} cy={f.px(v(P1, LAST)).y} r={3.7} fill="none" stroke={at(Z1) ? INK.blue : '#000'} strokeWidth={THICK} />
				) : (
					<Text at={v(P1, LAST)} size={13} color={at(Z1) ? INK.blue : '#000'}>0</Text>
				)}
				<Text at={v(P2, LAST)} size={13} color={at(Z2) ? INK.blue : '#000'}>0</Text>
				<Text at={v(5.5, LAST)} anchor="start" size={13} color={INK.blue}>{resultText}</Text>
				{resultSign !== null && <Text at={v(6.75, LAST)} size={15} color={INK.blue}>{SIGN[String(resultSign) as '1']}</Text>}

				{/* The cursor. */}
				{/* Broken around the header, so the zeros stay readable when the cursor is on them. */}
				<path d={`${f.path([v(cx, 0.32), v(cx, 0.22)])} ${f.path([v(cx, -0.22), v(cx, -2.1)])}`} stroke={INK.blue} strokeWidth={THIN} />
				<Label f={f} at={v(clamp(cx, 0.55, END - 0.55), 0.42)} dir={v(0, 1)} upright size={13} color={INK.blue}>
					<tspan fontFamily={FONT_MATH} fontStyle="italic">x</tspan>
					{` = ${show(x, 1)}`}
				</Label>
				<Handle f={f} at={v(cx, 0.32)} onMove={move} label="Cursore x" color={INK.blue} step={0.001} />
			</Drawing>

			<Caption>{caption}</Caption>

			<Controls>
				<ToggleGroup
					label="Che cosa studiare"
					value={mode}
					onChange={setMode}
					options={[
						{ value: 'prodotto', label: '(x − 2)(x + 3)' },
						{ value: 'frazione', label: '(x − 2) / (x + 3)' }
					]}
				/>
				<Slider label="Valore di x" value={x} min={LO} max={HI} step={0.1} onChange={(t) => setX(clamp(round1(t), LO, HI))} />
			</Controls>
		</Figure>
	);
}
