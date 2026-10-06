'use client';

import { useState } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { ELEMENTI, type ChemElement } from '@/lib/tools/tavola-periodica';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, frame, v, num, K, TINT, THICK, THIN, DASH } from '../kit';

/**
 * Chemistry, third year, group D (lessons 59 and 60): a periodic property along a period or down a group, as a bar
 * chart. The student picks the property, whether to walk along a period or down a group, and which one; a tap on an
 * element reads its value, the effective nuclear charge of the lesson's simple model (Z minus the inner electrons)
 * and the outer level. The caption says which way the property goes and names the steps that go against it.
 *
 * Radius, first ionisation energy and electronegativity come from the site's periodic table (elementi.json), as the
 * lessons do. The electron affinities are not in that file: they are the values of lesson 60 (energy released, kJ/mol;
 * `null` where the anion is not stable), to be checked against a handbook (the lesson's notes say so).
 *
 * Only the rows where the data tell a clean story are offered: group 13 (gallium smaller than aluminium) and group 14
 * (germanium more electronegative than silicon) are left out, and the electron affinity is shown for periods 2 and 3
 * and for groups 1, 16 and 17.
 */

export type Prop = 'raggio' | 'ionizzazione' | 'affinita' | 'elettronegativita';

/** Electron affinity, kJ/mol released; null = the anion is not stable (the atom does not release energy). */
export const AFFINITA: Record<string, number | null> = {
	H: 73, Li: 60, Be: null, B: 27, C: 122, N: null, O: 141, F: 328, Ne: null,
	Na: 53, Mg: null, Al: 42, Si: 134, P: 72, S: 200, Cl: 349, Ar: null,
	K: 48, Rb: 47, Cs: 46, Se: 195, Te: 190, Br: 325, I: 295,
};

const MAIN = [1, 2, 13, 14, 15, 16, 17, 18];

interface PropInfo {
	label: string; // on the toggle
	name: string; // in the caption: "il raggio atomico"
	unit: string;
	max: number; // top of the scale
	digits: number;
	periods: number[];
	groups: number[];
	noble: boolean; // group 18 in a period
	value: (e: ChemElement) => number | null;
	/** +1 when the property grows along a period, -1 when it falls; the same down a group. */
	alongPeriod: 1 | -1;
	downGroup: 1 | -1;
}

const INFO: Record<Prop, PropInfo> = {
	raggio: { label: 'raggio', name: 'il raggio atomico', unit: 'pm', max: 250, digits: 0, periods: [2, 3, 4], groups: [1, 2, 15, 16, 17], noble: false, value: (e) => e.radius, alongPeriod: -1, downGroup: 1 },
	ionizzazione: { label: 'ionizzazione', name: "l'energia di prima ionizzazione", unit: 'kJ/mol', max: 2200, digits: 1, periods: [2, 3, 4], groups: [1, 2, 15, 16, 17, 18], noble: true, value: (e) => e.ionization, alongPeriod: 1, downGroup: -1 },
	affinita: { label: 'affinità', name: "l'affinità elettronica", unit: 'kJ/mol', max: 380, digits: 0, periods: [2, 3], groups: [1, 16, 17], noble: true, value: (e) => AFFINITA[e.symbol] ?? null, alongPeriod: 1, downGroup: -1 },
	elettronegativita: { label: 'elettronegatività', name: "l'elettronegatività", unit: '', max: 4.2, digits: 2, periods: [2, 3, 4], groups: [1, 2, 15, 16, 17], noble: false, value: (e) => e.electronegativity, alongPeriod: 1, downGroup: -1 },
};

/** Inner electrons of a main-group element: all but those of the outer level. */
function valence(e: ChemElement) {
	if (e.symbol === 'He') return 2;
	const g = e.group ?? 0;
	return g <= 2 ? g : g - 10;
}

function row(prop: Prop, mode: 'periodo' | 'gruppo', which: number): ChemElement[] {
	const info = INFO[prop];
	if (mode === 'periodo') return ELEMENTI.filter((e) => e.period === which && e.group !== null && MAIN.includes(e.group) && (info.noble || e.group !== 18));
	const last = which <= 2 ? 6 : 5;
	return ELEMENTI.filter((e) => e.group === which && e.period >= 2 && e.period <= last && (prop !== 'affinita' || e.symbol in AFFINITA));
}

const ORD = ['', 'primo', 'secondo', 'terzo', 'quarto', 'quinto', 'sesto'];
const SLOT = 1.08;
const BASE = 0;
const TOP = 3.3;

export function AndamentoPeriodico({ props, alt }: { props: [Prop, Prop]; alt?: string }) {
	const [prop, setProp] = useState<Prop>(props[0]);
	const [mode, setMode] = useState<'periodo' | 'gruppo'>('periodo');
	const [period, setPeriod] = useState(3);
	const [group, setGroup] = useState(1);
	const [picked, setPicked] = useState<string | null>(null);

	const info = INFO[prop];
	const per = info.periods.includes(period) ? period : info.periods[info.periods.length - 1];
	const grp = info.groups.includes(group) ? group : info.groups[0];
	const els = row(prop, mode, mode === 'periodo' ? per : grp);
	const sel = els.find((e) => e.symbol === picked) ?? els[0];
	const circles = prop === 'raggio';
	const f = frame(-0.75, 8 * SLOT + 0.1, circles ? -2.05 : -0.75, TOP + 0.55);
	const xOf = (i: number) => (i + 0.5) * SLOT + (8 - els.length) * SLOT * 0.5;
	const hOf = (x: number) => (x / info.max) * TOP;

	// the steps that go against the general direction
	const dir = mode === 'periodo' ? info.alongPeriod : info.downGroup;
	const vals = els.map((e) => info.value(e));
	const against: string[] = [];
	for (let i = 1; i < els.length; i++) {
		const a = vals[i - 1], b = vals[i];
		if (a === null || b === null) continue;
		if ((b - a) * dir < 0 && Math.abs(b - a) > (prop === 'raggio' ? 1.5 : 0)) against.push(`${els[i].symbol} dopo ${els[i - 1].symbol}`);
	}
	const known = els.filter((_, i) => vals[i] !== null);
	const first = known[0], last = known[known.length - 1];
	const show = (x: number) => (prop === 'elettronegativita' ? x.toFixed(2).replace('.', ',') : num(x, info.digits));
	const fmt = (x: number) => `${show(x)}${info.unit ? ` ${info.unit}` : ''}`;
	const where = mode === 'periodo' ? `Lungo il ${ORD[per]} periodo` : `Scendendo lungo il gruppo ${grp}`;
	const unstable = els.filter((_, i) => vals[i] === null).map((e) => e.symbol);
	const caption =
		`${where} ${info.name} ${prop === 'affinita' ? (dir > 0 ? 'tende ad aumentare' : 'tende a diminuire') : dir > 0 ? 'aumenta' : 'diminuisce'}: da ${fmt(info.value(first)!)} (${first.symbol}) a ${fmt(info.value(last)!)} (${last.symbol}).` +
		(against.length ? ` ${against.length === 1 ? 'Va' : 'Vanno'} contro l'andamento: ${against.join(', ')}.` : '') +
		(unstable.length ? ` ${unstable.join(', ')}: l'atomo non libera energia acquistando un elettrone.` : '') +
		(prop === 'raggio' && mode === 'periodo' && per === 2 ? ' Ossigeno e fluoro hanno quasi lo stesso raggio.' : '');

	const selV = info.value(sel);
	const ticks = prop === 'raggio' ? [100, 200] : prop === 'ionizzazione' ? [500, 1000, 1500, 2000] : prop === 'affinita' ? [100, 200, 300] : [1, 2, 3, 4];

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{ticks.map((t) => (
					<g key={t}>
						<path d={f.path([v(0, BASE + hOf(t)), v(8 * SLOT, BASE + hOf(t))])} stroke="#bfbfbf" strokeWidth={THIN} />
						<Label f={f} at={v(0, BASE + hOf(t))} dir={v(-1, 0)} upright size={11}>
							{num(t, 0)}
						</Label>
					</g>
				))}
				<path d={f.path([v(0, BASE), v(8 * SLOT, BASE)])} stroke="#000" strokeWidth={THICK} />
				{info.unit && (
					<Label f={f} at={v(-0.6, TOP + 0.3)} dir={v(0.6, 0)} upright size={11}>
						{info.unit}
					</Label>
				)}
				{els.map((e, i) => {
					const x = xOf(i);
					const val = vals[i];
					const on = e.symbol === sel.symbol;
					const h = val === null ? 0.12 : hOf(val);
					const p0 = f.px(v(x - 0.3, BASE + h));
					const r = (e.radius ?? 0) * 0.0021;
					return (
						<g key={e.symbol}>
							<rect x={p0.x} y={p0.y} width={0.6 * K} height={h * K} fill={val === null ? 'none' : on ? TINT.orange : TINT.blue20} stroke="#000" strokeWidth={on ? THICK : THIN} strokeDasharray={val === null ? DASH : undefined} />
							<Label f={f} at={v(x, BASE + h + 0.02)} dir={v(0, 1)} upright size={11}>
								{val === null ? 'nessuna' : show(val)}
							</Label>
							<Label f={f} at={v(x, BASE - 0.08)} dir={v(0, -1)} upright size={14}>
								{e.symbol}
							</Label>
							{circles && <circle cx={f.px(v(x, -1.3)).x} cy={f.px(v(x, -1.3)).y} r={r * K} fill={on ? TINT.orange : TINT.blue} stroke="#000" strokeWidth={on ? THICK : THIN} />}
							<rect
								x={f.px(v(x - SLOT / 2, f.y1)).x}
								y={0}
								width={SLOT * K}
								height={f.H}
								fill="transparent"
								role="button"
								tabIndex={0}
								aria-label={`${e.name}${val === null ? '' : `, ${fmt(val)}`}`}
								aria-pressed={on}
								style={{ cursor: 'pointer', outline: 'none' }}
								onClick={() => setPicked(e.symbol)}
								onKeyDown={(ev) => {
									if (ev.key === 'Enter' || ev.key === ' ') {
										ev.preventDefault();
										setPicked(e.symbol);
									}
								}}
							/>
						</g>
					);
				})}
			</Drawing>
			<Readout>
				<span>
					{sel.name} ({sel.symbol}, <Tex>{`Z = ${sel.z}`}</Tex>)
				</span>
				<span>{selV === null ? "l'anione non è stabile" : info.unit ? fmt(selV) : <Tex>{`\\chi = ${selV.toFixed(2).replace('.', '{,}')}`}</Tex>}</span>
				<Tex>{`Z_{eff} = ${sel.z} - ${sel.z - valence(sel)} = +${valence(sel)}`}</Tex>
				<span>
					livello esterno <Tex>{`n = ${sel.period}`}</Tex>
				</span>
			</Readout>
			<Caption>{caption}</Caption>
			<Controls>
				<div className="flex flex-wrap justify-center gap-2">
					<ToggleGroup label="Grandezza" options={props.map((p) => ({ value: p, label: INFO[p].label }))} value={prop} onChange={setProp} />
					<ToggleGroup
						label="Lungo"
						options={[
							{ value: 'periodo', label: 'periodo' },
							{ value: 'gruppo', label: 'gruppo' },
						]}
						value={mode}
						onChange={setMode}
					/>
				</div>
				<div className="flex items-center justify-center gap-2">
					{mode === 'gruppo' && <span className="text-sm text-fg-muted">Gruppo</span>}
					{mode === 'periodo' ? (
						<ToggleGroup label="Periodo" options={info.periods.map((p) => ({ value: String(p), label: `periodo ${p}` }))} value={String(per)} onChange={(x) => setPeriod(Number(x))} />
					) : (
						<ToggleGroup label="Gruppo" options={info.groups.map((g) => ({ value: String(g), label: String(g) }))} value={String(grp)} onChange={(x) => setGroup(Number(x))} />
					)}
				</div>
			</Controls>
		</Figure>
	);
}
