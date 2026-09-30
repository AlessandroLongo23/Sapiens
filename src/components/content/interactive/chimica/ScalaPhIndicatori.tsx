'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, frame, v, num, texNum, THICK, THIN } from '../kit';

/**
 * Lesson 47 (Soluzioni acide e basiche: una prima idea del pH): the pH scale from 0 to 14 coloured by an indicator,
 * and a test tube with the solution. The student picks the indicator (universal, litmus, phenolphthalein, red
 * cabbage) and the pH, with a slider or by choosing a common substance; a mark on the scale shows the pH, and the
 * tube takes the indicator's colour. Under the drawing: the pH, acid, neutral or basic, and how many times more (or
 * fewer) H⁺ ions than pure water, 10^(7 - pH), rounded.
 *
 * The colours are drawn in a second SVG laid over the drawing and left out of the dark theme's inversion, as
 * PrismaDispersione does: an indicator has the same colours on both backgrounds. Lines and words stay in the
 * inverted drawing. The colours are indicative (lesson 47 and its notes): the universal indicator's bands are those
 * of the lesson's text (red 0-2, orange 3-4, yellow 5-6, green 7, blue 8-10, violet 11-14), blended between anchors;
 * litmus red below 4,5, violet, blue above 8,3; phenolphthalein colourless up to 8,2, pink, fuchsia from 10; red
 * cabbage red, pink, violet, blue, green, yellow, from common charts (to be checked with Andrea).
 */

type Ind = 'universale' | 'tornasole' | 'fenolftaleina' | 'cavolo';
const IND_LABEL: Record<Ind, string> = { universale: 'universale', tornasole: 'tornasole', fenolftaleina: 'fenolftaleina', cavolo: 'cavolo rosso' };

/** Colour stops: [pH, css colour, name]; `null` is colourless. */
type Stop = [number, string | null, string];
const STOPS: Record<Ind, Stop[]> = {
	universale: [
		[0, '#d7191c', 'rosso'],
		[2, '#e0301e', 'rosso'],
		[3.5, '#f08c1a', 'arancione'],
		[5.5, '#e8cf1e', 'giallo'],
		[7, '#2fa84f', 'verde'],
		[9, '#2471c8', 'blu'],
		[10.5, '#3b4fc0', 'blu'],
		[12, '#6a3bb5', 'viola'],
		[14, '#5b2a9e', 'viola'],
	],
	tornasole: [
		[0, '#d42a3c', 'rosso'],
		[4.5, '#d42a3c', 'rosso'],
		[6.4, '#8a3f9e', 'viola'],
		[8.3, '#2c55c4', 'blu'],
		[14, '#2c55c4', 'blu'],
	],
	fenolftaleina: [
		[0, null, 'incolore'],
		[8.2, null, 'incolore'],
		[9, '#f7b6d7', 'rosa pallido'],
		[10, '#e0218a', 'rosa acceso'],
		[14, '#e0218a', 'rosa acceso'],
	],
	cavolo: [
		[0, '#d1203a', 'rosso'],
		[2.5, '#d1203a', 'rosso'],
		[4.5, '#c2408a', 'rosa'],
		[6.5, '#7c3fa6', 'viola'],
		[8, '#3657c2', 'blu'],
		[10, '#1f9a8c', 'verde-azzurro'],
		[12, '#3faa3a', 'verde'],
		[14, '#e0c21a', 'giallo'],
	],
};

const hex = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
const mix = (a: string, b: string, k: number) => `#${hex(a).map((x, i) => Math.round(x + (hex(b)[i] - x) * k).toString(16).padStart(2, '0')).join('')}`;

/** The indicator's colour at a pH (null for colourless) and its name. Between two coloured stops, a blend. */
function colourAt(ind: Ind, ph: number): { css: string | null; name: string; alpha: number } {
	const s = STOPS[ind];
	let i = 0;
	while (i < s.length - 2 && ph > s[i + 1][0]) i++;
	const [p0, c0, n0] = s[i];
	const [p1, c1, n1] = s[i + 1];
	const k = p1 > p0 ? Math.min(1, Math.max(0, (ph - p0) / (p1 - p0))) : 0;
	const name = k < 0.5 ? n0 : n1;
	if (!c0 && !c1) return { css: null, name, alpha: 0 };
	if (!c0) return { css: c1, name: k < 0.15 ? n0 : name, alpha: k };
	if (!c1) return { css: c0, name, alpha: 1 - k };
	return { css: mix(c0, c1, k), name, alpha: 1 };
}

const SUBSTANCES: { nome: string; ph: number }[] = [
	{ nome: 'succo gastrico', ph: 1.5 },
	{ nome: 'succo di limone', ph: 2.2 },
	{ nome: 'aceto', ph: 2.9 },
	{ nome: 'caffè', ph: 5.0 },
	{ nome: 'pioggia', ph: 5.6 },
	{ nome: 'latte', ph: 6.6 },
	{ nome: 'acqua pura', ph: 7.0 },
	{ nome: 'sangue', ph: 7.4 },
	{ nome: 'acqua di mare', ph: 8.1 },
	{ nome: 'acqua saponata', ph: 10 },
	{ nome: 'ammoniaca per la casa', ph: 11.5 },
	{ nome: 'candeggina', ph: 12.5 },
];

const U = 0.5; // cm per pH unit
const X0 = 0, BAR_Y = 0.6, BAR_H = 0.45;
const TUBE_X = 8.3, TUBE_W = 0.9, TUBE_B = 0.35, TUBE_T = 3.2, LIQ = 2.0;
const f = frame(-0.45, 9.6, -0.95, 3.55);
const xOf = (ph: number) => X0 + ph * U;

export default function ScalaPhIndicatori({ alt }: { alt?: string }) {
	const [ind, setInd] = useState<Ind>('universale');
	const [ph, setPh] = useState(2.2);
	const [sub, setSub] = useState<string>('succo di limone');
	const col = colourAt(ind, ph);

	// the coloured bar, in thin slices
	const slices = Array.from({ length: 140 }, (_, i) => {
		const p = (i + 0.5) / 10;
		const c = colourAt(ind, p);
		return { i, c };
	});
	const K = f.W / (f.x1 - f.x0);
	const barTop = f.px(v(xOf(0), BAR_Y + BAR_H));
	const tubeL = TUBE_X - TUBE_W / 2, tubeR = TUBE_X + TUBE_W / 2;
	const r = TUBE_W / 2;
	// tube outline: open at the top, round bottom
	const tubePath = `${f.path([v(tubeL, TUBE_T), v(tubeL, TUBE_B + r)])} A${(r * K).toFixed(2)},${(r * K).toFixed(2)} 0 0 0 ${f.px(v(tubeR, TUBE_B + r)).x.toFixed(2)},${f.px(v(tubeR, TUBE_B + r)).y.toFixed(2)} L${f.px(v(tubeR, TUBE_T)).x.toFixed(2)},${f.px(v(tubeR, TUBE_T)).y.toFixed(2)}`;
	const inset = 0.06;
	const liqPath = `${f.path([v(tubeL + inset, LIQ), v(tubeL + inset, TUBE_B + r)])} A${((r - inset) * K).toFixed(2)},${((r - inset) * K).toFixed(2)} 0 0 0 ${f.px(v(tubeR - inset, TUBE_B + r)).x.toFixed(2)},${f.px(v(tubeR - inset, TUBE_B + r)).y.toFixed(2)} L${f.px(v(tubeR - inset, LIQ)).x.toFixed(2)},${f.px(v(tubeR - inset, LIQ)).y.toFixed(2)} Z`;

	const kind = ph < 7 - 1e-9 ? 'acida' : ph > 7 + 1e-9 ? 'basica' : 'neutra';
	const ratio = 10 ** Math.abs(7 - ph);
	const ratioTxt = ratio >= 1e4 ? `${texNum(ratio / 10 ** Math.floor(Math.log10(ratio)), 1)} \\cdot 10^{${Math.floor(Math.log10(ratio))}}` : texNum(Number(ratio.toPrecision(2)), 0);
	const mark = f.px(v(xOf(ph), BAR_Y + BAR_H + 0.12));

	return (
		<Figure>
			<div className="relative max-w-full">
				<Drawing f={f} label={alt}>
					<rect x={barTop.x} y={barTop.y} width={14 * U * K} height={BAR_H * K} fill="none" stroke="#000" strokeWidth={THIN} />
					<path d={f.path([v(xOf(0), BAR_Y), v(xOf(14), BAR_Y)])} stroke="#000" strokeWidth={THICK} />
					{Array.from({ length: 15 }, (_, p) => (
						<g key={p}>
							<path d={f.path([v(xOf(p), BAR_Y), v(xOf(p), BAR_Y - 0.12)])} stroke="#000" strokeWidth={THIN} />
							{p % 2 === 0 && (
								<Label f={f} at={v(xOf(p), BAR_Y - 0.12)} dir={v(0, -1)} upright size={12}>
									{p}
								</Label>
							)}
						</g>
					))}
					<Label f={f} at={v(xOf(3.5), BAR_Y - 0.72)} dir={v(0, -1)} upright size={12}>
						← acido
					</Label>
					<Label f={f} at={v(xOf(7), BAR_Y - 0.72)} dir={v(0, -1)} upright size={12}>
						neutro
					</Label>
					<Label f={f} at={v(xOf(10.5), BAR_Y - 0.72)} dir={v(0, -1)} upright size={12}>
						basico →
					</Label>
					<path d={f.path([v(xOf(7), BAR_Y - 0.05), v(xOf(7), BAR_Y + BAR_H + 0.05)])} stroke="#000" strokeWidth={THIN} strokeDasharray="2 2" />
					{SUBSTANCES.map((s) => (
						<circle key={s.nome} cx={f.px(v(xOf(s.ph), BAR_Y)).x} cy={f.px(v(xOf(s.ph), BAR_Y)).y} r={1.8} fill="#000" />
					))}
					<path d={`M${mark.x},${mark.y} l-5,-9 l10,0 Z`} fill="#000" />
					<Label f={f} at={v(xOf(ph), BAR_Y + BAR_H + 0.55)} dir={v(0, 1)} upright size={13}>
						{`pH ${num(ph, 1)}`}
					</Label>
					<path d={tubePath} fill="none" stroke="#000" strokeWidth={THICK} />
					<path d={f.path([v(tubeL - 0.12, TUBE_T), v(tubeR + 0.12, TUBE_T)])} stroke="#000" strokeWidth={THICK} />
					{!col.css && <path d={f.path([v(tubeL + inset, LIQ), v(tubeR - inset, LIQ)])} stroke="#000" strokeWidth={THIN} />}
					<Label f={f} at={v(TUBE_X, TUBE_B - 0.05)} dir={v(0, -1)} upright size={12}>
						{col.name}
					</Label>
				</Drawing>
				<svg viewBox={`0 0 ${f.W.toFixed(1)} ${f.H.toFixed(1)}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
					{slices.map(({ i, c }) =>
						c.css ? <rect key={i} x={barTop.x + (i / 10) * U * K} y={barTop.y + 0.5} width={(U * K) / 10 + 0.4} height={BAR_H * K - 1} fill={c.css} fillOpacity={c.alpha} /> : null,
					)}
					{col.css && <path d={liqPath} fill={col.css} fillOpacity={0.35 + 0.65 * col.alpha} />}
				</svg>
			</div>
			<Readout>
				<Tex>{`\\text{pH} = ${texNum(ph, 1)}`}</Tex>
				<span>soluzione {kind}</span>
				{kind === 'neutra' ? (
					<span>tanti ioni H⁺ quanti l&apos;acqua pura</span>
				) : (
					<span>
						ioni H⁺: circa <Tex>{ratioTxt}</Tex> volte {kind === 'acida' ? 'di più' : 'di meno'} che nell&apos;acqua pura
					</span>
				)}
			</Readout>
			<Caption>
				{`${sub ? `${sub[0].toUpperCase()}${sub.slice(1)}, pH circa ${num(ph, 1)}: ` : `pH ${num(ph, 1)}: `}con ${ind === 'cavolo' ? 'il succo di cavolo rosso' : ind === 'universale' ? "l'indicatore universale" : ind === 'tornasole' ? 'il tornasole' : 'la fenolftaleina'} la soluzione è ${col.name}. ${ind === 'fenolftaleina' && ph < 8.2 ? 'La fenolftaleina resta incolore in tutte le soluzioni acide e neutre, e anche in quelle appena basiche. ' : ''}${ind === 'tornasole' && ph > 4.5 && ph < 8.3 ? 'Tra pH 4,5 e 8,3 il tornasole ha un colore intermedio, e non distingue bene. ' : ''}I colori sono indicativi.`}
			</Caption>
			<Controls>
				<div className="flex justify-center">
					<ToggleGroup label="Indicatore" options={(Object.keys(IND_LABEL) as Ind[]).map((k) => ({ value: k, label: IND_LABEL[k] }))} value={ind} onChange={setInd} />
				</div>
				<Slider
					label="pH"
					value={ph}
					min={0}
					max={14}
					step={0.1}
					onChange={(x) => {
						setPh(x);
						setSub(SUBSTANCES.find((s) => Math.abs(s.ph - x) < 1e-9)?.nome ?? '');
					}}
				/>
				<div className="flex flex-wrap justify-center gap-1.5">
					{SUBSTANCES.map((s) => (
						<button
							key={s.nome}
							type="button"
							onClick={() => {
								setPh(s.ph);
								setSub(s.nome);
							}}
							aria-pressed={sub === s.nome}
							className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${sub === s.nome ? 'border-accent bg-accent text-white' : 'border-edge text-fg-muted hover:border-fg-muted'}`}
						>
							{s.nome}
						</button>
					))}
				</div>
			</Controls>
		</Figure>
	);
}
