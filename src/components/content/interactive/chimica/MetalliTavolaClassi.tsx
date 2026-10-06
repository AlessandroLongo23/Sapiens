'use client';

import { useState } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { ELEMENTI, type ChemElement, type FamilyId } from '@/lib/tools/tavola-periodica';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, frame, v, texNum, K, TINT, THICK, THIN } from '../kit';

/**
 * Lesson 61 (Metalli, non metalli e semimetalli): the main groups of the periodic table for the first six periods,
 * with a band in the middle for the transition metals. The student taps an element and reads its class (metal,
 * semimetal, non-metal), its family, its state at 25 °C, its first ionisation energy and its electronegativity; a
 * mark moves on a scale of the ionisation energy, with the other elements of the same period as dots, so that
 * walking along a row or down a column shows the metallic character changing. A toggle colours the families (alkali
 * metals, alkaline earth metals, halogens, noble gases) in place of the three classes.
 *
 * Data from the site's periodic table (elementi.json). The classes follow its families: semimetals are B, Si, Ge, As,
 * Sb, Te and Po; halogens and noble gases count as non-metals. The colours are tints the dark theme inverts with the
 * rest of the drawing; the legend is drawn in the same SVG, and the class is always written under the figure too.
 */

type Classe = 'metallo' | 'semimetallo' | 'non metallo';
const classOf = (e: ChemElement): Classe => (e.family === 'semimetalli' ? 'semimetallo' : e.family === 'non-metalli' || e.family === 'alogeni' || e.family === 'gas-nobili' ? 'non metallo' : 'metallo');
const CLASS_TINT: Record<Classe, string> = { metallo: TINT.blue, semimetallo: TINT.orange, 'non metallo': TINT.green };
const FAMILY_TINT: Partial<Record<FamilyId, string>> = { alcalini: TINT.red, 'alcalino-terrosi': TINT.gray, alogeni: TINT.green, 'gas-nobili': TINT.blue20 };
const FAMILY_NAME: Partial<Record<FamilyId, string>> = { alcalini: 'metalli alcalini', 'alcalino-terrosi': 'metalli alcalino-terrosi', alogeni: 'alogeni', 'gas-nobili': 'gas nobili' };
const FAMILY_NOTE: Partial<Record<FamilyId, string>> = {
	alcalini: 'Ha un solo elettrone esterno, che perde con facilità: forma ioni 1+.',
	'alcalino-terrosi': 'Ha due elettroni esterni e li perde tutti e due: forma ioni 2+.',
	alogeni: 'Gli manca un elettrone per completare il livello esterno: con i metalli forma ioni 1−.',
	'gas-nobili': 'Ha il livello esterno completo: in condizioni ordinarie non reagisce.',
};
const STATE = { s: 'solido', l: 'liquido', g: 'gas' } as const;

const C = 0.92; // a cell
const BAND = 1.0; // the transition metals
const GROUPS = [1, 2, 13, 14, 15, 16, 17, 18];
const xOf = (g: number) => (g <= 2 ? (g - 1) * C : 2 * C + BAND + (g - 13) * C);
const yOf = (p: number) => -(p - 1) * C; // top of the row
const W = 8 * C + BAND;
const AXIS_Y = -6 * C - 1.25;
const LEGEND_Y = AXIS_Y - 1.5;
const f = frame(-0.5, W + 0.15, LEGEND_Y - 0.95, 0.5);
const E0 = 300, E1 = 2400;
const eX = (ei: number) => 0.15 + ((ei - E0) / (E1 - E0)) * (W - 0.3);

const MAIN = ELEMENTI.filter((e) => e.period <= 6 && e.group !== null && GROUPS.includes(e.group));

export default function MetalliTavolaClassi({ alt }: { alt?: string }) {
	const [sym, setSym] = useState('Na');
	const [view, setView] = useState<'classi' | 'famiglie'>('classi');
	const transition = sym === 'TM';
	const el = MAIN.find((e) => e.symbol === sym) ?? MAIN[0];
	const cls = classOf(el);
	const fam = FAMILY_NAME[el.family];
	const tint = (e: ChemElement) => (view === 'classi' ? CLASS_TINT[classOf(e)] : (FAMILY_TINT[e.family] ?? 'none'));
	const pick = (s: string) => ({
		role: 'button' as const,
		tabIndex: 0,
		style: { cursor: 'pointer', outline: 'none' },
		onClick: () => setSym(s),
		onKeyDown: (ev: { key: string; preventDefault: () => void }) => {
			if (ev.key === 'Enter' || ev.key === ' ') {
				ev.preventDefault();
				setSym(s);
			}
		},
	});
	const legend: [string, string][] =
		view === 'classi'
			? [[TINT.blue, 'metalli'], [TINT.orange, 'semimetalli'], [TINT.green, 'non metalli']]
			: [[TINT.red, 'metalli alcalini'], [TINT.gray, 'metalli alcalino-terrosi'], [TINT.green, 'alogeni'], [TINT.blue20, 'gas nobili'], [TINT.orange, 'metalli di transizione']];
	const bandTop = f.px(v(2 * C, yOf(4)));
	const sameRow = transition ? [] : MAIN.filter((e) => e.period === el.period && e.ionization !== null);

	let caption: string;
	if (transition) caption = 'Metalli di transizione, gruppi da 3 a 12: duri, densi, con temperature di fusione alte; molti formano ioni con cariche diverse.';
	else if (el.symbol === 'H') caption = "L'idrogeno sta nel gruppo 1 perché ha un solo elettrone, ma è un non metallo: la sua energia di ionizzazione è più del doppio di quella del litio.";
	else if (cls === 'metallo') caption = `${el.name}: un metallo. Nelle reazioni perde elettroni e forma ioni positivi. ${FAMILY_NOTE[el.family] ?? ''}`;
	else if (cls === 'semimetallo') caption = `${el.name}: un semimetallo. Sta sul confine a scala e ha proprietà intermedie tra quelle dei metalli e dei non metalli.`;
	else caption = `${el.name}: un non metallo. ${FAMILY_NOTE[el.family] ?? 'Nelle reazioni acquista elettroni o li mette in comune.'}`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{GROUPS.map((g) => (
					<Label key={g} f={f} at={v(xOf(g) + C / 2, 0.08)} dir={v(0, 1)} upright size={11}>
						{g}
					</Label>
				))}
				{[1, 2, 3, 4, 5, 6].map((p) => (
					<Label key={p} f={f} at={v(-0.08, yOf(p) - C / 2)} dir={v(-1, 0)} upright size={11}>
						{p}
					</Label>
				))}
				<g {...pick('TM')} aria-label="Metalli di transizione" aria-pressed={transition}>
					<rect x={bandTop.x} y={bandTop.y} width={BAND * K} height={3 * C * K} fill={view === 'classi' ? TINT.blue : TINT.orange} stroke="#000" strokeWidth={transition ? THICK * 1.8 : THIN} />
					<text transform={`translate(${bandTop.x + (BAND * K) / 2}, ${bandTop.y + (3 * C * K) / 2}) rotate(-90)`} textAnchor="middle" dy="0.35em" fontSize={11} fontFamily="KaTeX_Main, serif" pointerEvents="none">
						metalli di transizione
					</text>
				</g>
				{MAIN.map((e) => {
					const p = f.px(v(xOf(e.group!), yOf(e.period)));
					const on = !transition && e.symbol === el.symbol;
					return (
						<g key={e.symbol} {...pick(e.symbol)} aria-label={`${e.name}, ${classOf(e)}`} aria-pressed={on}>
							<rect x={p.x} y={p.y} width={C * K} height={C * K} fill={tint(e)} stroke="#000" strokeWidth={THIN} />
							<text x={p.x + (C * K) / 2} y={p.y + (C * K) / 2} dy="0.35em" textAnchor="middle" fontSize={15} fontFamily="KaTeX_Main, serif" pointerEvents="none">
								{e.symbol}
							</text>
						</g>
					);
				})}
				{!transition && (
					<rect x={f.px(v(xOf(el.group!), yOf(el.period))).x} y={f.px(v(xOf(el.group!), yOf(el.period))).y} width={C * K} height={C * K} fill="none" stroke="#000" strokeWidth={THICK * 2} pointerEvents="none" />
				)}
				{/* the scale of the first ionisation energy */}
				<path d={f.path([v(0.15, AXIS_Y), v(W - 0.15, AXIS_Y)])} stroke="#000" strokeWidth={THICK} />
				{[500, 1000, 1500, 2000].map((t) => (
					<g key={t}>
						<path d={f.path([v(eX(t), AXIS_Y), v(eX(t), AXIS_Y - 0.1)])} stroke="#000" strokeWidth={THIN} />
						<Label f={f} at={v(eX(t), AXIS_Y - 0.1)} dir={v(0, -1)} upright size={11}>
							{t}
						</Label>
					</g>
				))}
				<Label f={f} at={v(W / 2, AXIS_Y - 0.5)} dir={v(0, -1)} upright size={11}>
					energia di prima ionizzazione (kJ/mol)
				</Label>
				{sameRow.map((e) => (
					<circle key={e.symbol} cx={f.px(v(eX(e.ionization!), AXIS_Y)).x} cy={f.px(v(eX(e.ionization!), AXIS_Y)).y} r={2.4} fill="#808080" />
				))}
				{!transition && el.ionization !== null && (
					<g pointerEvents="none">
						<path d={`M${f.px(v(eX(el.ionization), AXIS_Y + 0.06)).x},${f.px(v(eX(el.ionization), AXIS_Y + 0.06)).y} l-5,-9 l10,0 Z`} fill="#000" />
						<Label f={f} at={v(eX(el.ionization), AXIS_Y + 0.3)} dir={v(0, 1)} upright size={13}>
							{el.symbol}
						</Label>
					</g>
				)}
				{legend.map(([c, name], i) => {
					const x = view === 'classi' ? 0.3 + i * 2.85 : 0.1 + (i % 2) * 4.3;
					const y = view === 'classi' ? LEGEND_Y : LEGEND_Y + 0.42 - Math.floor(i / 2) * 0.48;
					const p = f.px(v(x, y));
					return (
						<g key={name}>
							<rect x={p.x} y={p.y} width={0.32 * K} height={0.32 * K} fill={c} stroke="#000" strokeWidth={THIN} />
							<Label f={f} at={v(x + 0.36, y - 0.16)} dir={v(1, 0)} upright size={11}>
								{name}
							</Label>
						</g>
					);
				})}
			</Drawing>
			{transition ? (
				<Readout>
					<span>Metalli di transizione</span>
					<span>blocco d, gruppi da 3 a 12</span>
				</Readout>
			) : (
				<Readout>
					<span>
						{el.name} ({el.symbol})
					</span>
					<span>{fam ? `${cls} (${fam})` : cls}</span>
					<span>{STATE[el.state]} a 25 °C</span>
					{el.ionization !== null && <Tex>{`E_i = ${texNum(el.ionization, 1)}\\,\\text{kJ/mol}`}</Tex>}
					{el.electronegativity !== null ? <Tex>{`\\chi = ${el.electronegativity.toFixed(2).replace('.', '{,}')}`}</Tex> : <span>nessun valore di elettronegatività</span>}
				</Readout>
			)}
			<Caption>{caption.trim()}</Caption>
			<Controls>
				<div className="flex justify-center">
					<ToggleGroup
						label="Colora"
						options={[
							{ value: 'classi', label: 'le tre classi' },
							{ value: 'famiglie', label: 'le famiglie' },
						]}
						value={view}
						onChange={setView}
					/>
				</div>
			</Controls>
		</Figure>
	);
}
