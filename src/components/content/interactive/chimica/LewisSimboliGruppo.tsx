'use client';

import { useState } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { ELEMENTI, type ChemElement } from '@/lib/tools/tavola-periodica';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, frame, v, TINT, INK, THIN, THICK, FONT, type V } from '../kit';

/**
 * Lesson 58 (Elettroni di valenza e simboli di Lewis): the Lewis symbol of a main-group element of the first four
 * periods, picked on a small table. Going down a group the dots stay and the letter changes; one box to the right
 * adds a dot. A switch turns the atom into its ion: the metals of groups 1, 2 and 13 lose their dots, the non-metals
 * of groups 15, 16 and 17 reach eight, and the brackets and the charge appear. Carbon, silicon, boron and the noble
 * gases, which form no simple ion, say so.
 */

const GROUPS = [1, 2, 13, 14, 15, 16, 17, 18];
const ROMAN = ['IA', 'IIA', 'IIIA', 'IVA', 'VA', 'VIA', 'VIIA', 'VIIIA'];
const MAIN = ELEMENTI.filter((e) => e.period <= 4 && e.group !== null && GROUPS.includes(e.group));
const NOBLE: Record<number, string> = { 0: '', 1: 'elio', 2: 'neon', 3: 'argon', 4: 'kripton' };

const C = 0.72;
const TABLE_X = 0;
const SYMBOL: V = v(8 * C + 2.05, -1.55);
const f = frame(-0.55, 8 * C + 4.0, -4 * C - 0.25, 0.55);

const di = (name: string) => (/^[aeiou]/.test(name) ? `dell'${name}` : `del ${name}`);
const valence = (e: ChemElement) => (e.symbol === 'He' ? 2 : e.group! <= 2 ? e.group! : e.group! - 10);

/** What the atom does to become an ion: the charge, or why there is none. */
function ion(e: ChemElement): { charge: number; why: string } {
	const g = e.group!;
	const n = valence(e);
	if (e.symbol === 'H') return { charge: 1, why: "L'idrogeno ha un solo elettrone: perdendolo diventa lo ione H⁺. Può anche acquistarne uno e diventare lo ione idruro H⁻, con la configurazione dell'elio." };
	if (g === 18) return { charge: 0, why: `Il livello di valenza è già pieno: i gas nobili non formano ioni.` };
	if (g === 14) return { charge: 0, why: `Dovrebbe perdere o acquistare quattro elettroni: di solito non forma ioni semplici, e mette gli elettroni in comune con altri atomi.` };
	if (e.symbol === 'B') return { charge: 0, why: 'Il boro è un semimetallo e di solito non forma ioni semplici: mette gli elettroni in comune con altri atomi.' };
	if (g <= 13) return { charge: n, why: `Perde ${n === 1 ? "l'unico elettrone" : `i ${n} elettroni`} di valenza e resta con la configurazione ${di(NOBLE[e.period - 1])}.` };
	return { charge: n - 8, why: `Acquista ${8 - n === 1 ? '1 elettrone' : `${8 - n} elettroni`} e arriva a otto, con la configurazione ${di(NOBLE[e.period])}.` };
}

/** The dots around a point: one per side first (top, right, bottom, left), then the pairs in the same order. */
function dots(n: number, at: V, wide: boolean): V[] {
	const hx = wide ? 0.82 : 0.62;
	const hy = 0.68;
	const d = 0.15;
	const sides: [V, V][] = [
		[v(0, hy), v(1, 0)],
		[v(hx, 0), v(0, 1)],
		[v(0, -hy), v(1, 0)],
		[v(-hx, 0), v(0, 1)]
	];
	const count = [0, 0, 0, 0];
	for (let k = 0; k < n; k++) count[k % 4]++;
	return sides.flatMap(([o, t], i) => (count[i] === 1 ? [v(at.x + o.x, at.y + o.y)] : count[i] === 2 ? [v(at.x + o.x - d * t.x, at.y + o.y - d * t.y), v(at.x + o.x + d * t.x, at.y + o.y + d * t.y)] : []));
}

const chargeText = (q: number) => `${Math.abs(q) === 1 ? '' : Math.abs(q)}${q > 0 ? '+' : '−'}`;
const chargeTex = (q: number) => `^{${Math.abs(q) === 1 ? '' : Math.abs(q)}${q > 0 ? '+' : '-'}}`;

export default function LewisSimboliGruppo({ alt }: { alt?: string }) {
	const [sym, setSym] = useState('N');
	const [kind, setKind] = useState<'atomo' | 'ione'>('atomo');
	const el = MAIN.find((e) => e.symbol === sym)!;
	const n = valence(el);
	const col = GROUPS.indexOf(el.group!);
	const made = ion(el);
	const asIon = kind === 'ione' && made.charge !== 0;
	const shown = asIon ? (made.charge > 0 ? 0 : 8) : n;
	const wide = el.symbol.length > 1;
	const side = C * (f.W / (f.x1 - f.x0));
	const outer = el.period === 1 ? `1s^{${n}}` : n <= 2 ? `${el.period}s^{${n}}` : `${el.period}s^{2}\\,${el.period}p^{${n - 2}}`;
	const bw = wide ? 1.12 : 0.92;

	let caption: string;
	if (kind === 'atomo') {
		const singles = n <= 4 ? n : 8 - n;
		const pairs = (n - singles) / 2;
		caption =
			el.symbol === 'He'
				? "L'elio ha 2 elettroni di valenza, una coppia: il primo livello è pieno così."
				: `${n === 1 ? '1 elettrone' : `${n} elettroni`} di valenza: ${pairs === 0 ? '' : `${pairs === 1 ? '1 coppia' : `${pairs} coppie`}${singles ? ' e ' : ''}`}${singles === 0 ? '' : singles === 1 ? '1 elettrone spaiato' : `${singles} elettroni spaiati`}. Tutti gli elementi del gruppo ${el.group} hanno lo stesso numero di puntini.`;
	} else caption = made.why;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{GROUPS.map((g, i) => (
					<Label key={g} f={f} at={v(TABLE_X + (i + 0.5) * C, 0.22)} upright size={col === i ? 13 : 10} color={col === i ? INK.red : '#000'}>
						{g}
					</Label>
				))}
				{[1, 2, 3, 4].map((p) => (
					<Label key={p} f={f} at={v(-0.3, -(p - 0.5) * C)} upright size={el.period === p ? 13 : 10} color={el.period === p ? INK.red : '#000'}>
						{p}
					</Label>
				))}
				{MAIN.map((e) => {
					const p = f.px(v(TABLE_X + GROUPS.indexOf(e.group!) * C, -(e.period - 1) * C));
					const selected = e.symbol === sym;
					return (
						<g key={e.symbol}>
							<rect
								x={p.x}
								y={p.y}
								width={side}
								height={side}
								fill={selected ? TINT.orange : 'transparent'}
								stroke="#000"
								strokeWidth={selected ? THICK : THIN}
								role="button"
								tabIndex={0}
								aria-label={`${e.name}, gruppo ${e.group}, periodo ${e.period}`}
								aria-pressed={selected}
								className="cursor-pointer outline-none focus-visible:stroke-[2.5]"
								onClick={() => setSym(e.symbol)}
								onKeyDown={(ev) => {
									if (ev.key !== 'Enter' && ev.key !== ' ') return;
									ev.preventDefault();
									setSym(e.symbol);
								}}
							/>
							<text x={p.x + side / 2} y={p.y + side / 2} dy="0.35em" textAnchor="middle" fontSize={13} fontFamily={FONT} fill="#000" pointerEvents="none">
								{e.symbol}
							</text>
						</g>
					);
				})}

				<text x={f.px(SYMBOL).x} y={f.px(SYMBOL).y} dy="0.35em" textAnchor="middle" fontSize={40} fontFamily={FONT} fill="#000">
					{el.symbol}
				</text>
				{dots(shown, SYMBOL, wide).map((p, k) => (
					<circle key={k} cx={f.px(p).x} cy={f.px(p).y} r={3.4} fill="#000" />
				))}
				{asIon && (
					<>
						<path d={f.path([v(SYMBOL.x - bw + 0.18, SYMBOL.y - 1.0), v(SYMBOL.x - bw, SYMBOL.y - 1.0), v(SYMBOL.x - bw, SYMBOL.y + 1.0), v(SYMBOL.x - bw + 0.18, SYMBOL.y + 1.0)])} fill="none" stroke="#000" strokeWidth={THICK} />
						<path d={f.path([v(SYMBOL.x + bw - 0.18, SYMBOL.y - 1.0), v(SYMBOL.x + bw, SYMBOL.y - 1.0), v(SYMBOL.x + bw, SYMBOL.y + 1.0), v(SYMBOL.x + bw - 0.18, SYMBOL.y + 1.0)])} fill="none" stroke="#000" strokeWidth={THICK} />
						<Label f={f} at={v(SYMBOL.x + bw + 0.12, SYMBOL.y + 0.95)} dir={v(1, 0)} upright size={18}>
							{chargeText(made.charge)}
						</Label>
					</>
				)}
			</Drawing>

			<Readout>
				<span>
					{el.name} ({el.symbol}), gruppo {el.group} ({ROMAN[col]})
				</span>
				<span>
					configurazione esterna <Tex>{outer}</Tex>
				</span>
				<span>elettroni di valenza: {n}</span>
				{kind === 'ione' && <span>{made.charge === 0 ? 'nessuno ione semplice' : <Tex>{`\\mathrm{${el.symbol}${chargeTex(made.charge)}}`}</Tex>}</span>}
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup
						label="Atomo o ione"
						options={[
							{ value: 'atomo', label: 'Atomo' },
							{ value: 'ione', label: 'Ione' }
						]}
						value={kind}
						onChange={setKind}
					/>
				</div>
			</Controls>
		</Figure>
	);
}
