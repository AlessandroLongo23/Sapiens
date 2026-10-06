'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ELEMENTI, configParts, type BlockId, type ChemElement } from '@/lib/tools/tavola-periodica';
import { electronsBySublevel, isException } from '@/lib/orbitali/configurazione';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, TINT, INK, THIN, FONT } from '../kit';

/**
 * Lesson 57 (Gruppi, periodi e blocchi): from the number of electrons to the box of the table. The student sets the
 * atomic number (a slider, one electron more or fewer, or a touch on a box) and the element's box lights up in a
 * table coloured by block, with its group and period marked on the edges. Under the drawing the configuration is
 * read three times: the highest level gives the period, the sublevel being filled gives the block, the electrons of
 * the outer sublevels give the group.
 *
 * The table is drawn as the lesson's TikZ figure draws it: lanthanum and actinium in group 3, the fourteen elements
 * of each f row under the table. The data (configurations, exceptions included) are those of the periodic table tool.
 */

const C = 0.47; // a box, in cm
const F_ROW = [8.9, 9.9];
const f = frame(-0.62, 18 * C + 0.12, -(10.4 * C) - 0.1, 0.5);

const BLOCK_TINT: Record<BlockId, string> = { s: TINT.blue, p: TINT.orange, d: TINT.green, f: TINT.red };

/** Column (1 to 18) and row (1 to 7, or the two rows under the table) of an element. */
function place(el: ChemElement): { col: number; row: number } {
	if (el.group !== null) return { col: el.group, row: el.period };
	if (el.series === 1) return { col: 3, row: el.period };
	return { col: (el.series ?? 2) + 2, row: F_ROW[el.period - 6] };
}

const CELLS = ELEMENTI.map((el) => ({ el, ...place(el) }));

const configTex = (el: ChemElement) =>
	configParts(el.config)
		.map((p) => (p.electrons ? `${p.text}^{${p.electrons}}` : p.text.replace(/\[(\w+)\]/, '[\\text{$1}]')))
		.join('\\,');

/** The group of a main-table element, with the sum that gives it; null for the f rows. */
function explain(el: ChemElement): { period: string; block: string; group: string } {
	const n = el.period;
	const sub = el.block === 's' ? `${n}s` : el.block === 'p' ? `${n}p` : el.block === 'd' ? `${n - 1}d` : `${n - 2}f`;
	const e = electronsBySublevel(el);
	const s = e.get(`${n}s`) ?? 0;
	const p = e.get(`${n}p`) ?? 0;
	const d = e.get(`${n - 1}d`) ?? 0;
	const il = (x: string) => (x.startsWith('1') ? `l'${x}` : `il ${x}`);
	const nel = (x: string) => (x.startsWith('1') ? `Nell'${x}` : `Nel ${x}`);
	const period = `Il livello più alto occupato è ${il(String(n))}: periodo ${n}.`;
	const block = `Il sottolivello che si riempie è ${il(sub)}: blocco ${el.block}.`;
	let group: string;
	if (el.symbol === 'He') group = "L'elio ha il primo livello pieno e sta con i gas nobili, nel gruppo 18, anche se il suo sottolivello è un s.";
	else if (el.group === null) group = el.block === 'd' ? `Qui comincia la riga dei ${n === 6 ? 'lantanidi' : 'attinidi'}: il posto è nel gruppo 3.` : `I ${n === 6 ? 'lantanidi' : 'attinidi'} sono disegnati sotto la tavola e non hanno un numero di gruppo.`;
	else if (el.block === 's') group = `${nel(`${n}s`)} ${s === 1 ? "c'è 1 elettrone" : `ci sono ${s} elettroni`}: gruppo ${el.group}.`;
	else if (el.block === 'p') group = `Nel ${n}p ${p === 1 ? "c'è 1 elettrone" : `ci sono ${p} elettroni`}: gruppo 12 + ${p} = ${el.group}.`;
	else group = `Tra ${n}s e ${n - 1}d gli elettroni sono ${s} + ${d}: gruppo ${el.group}.`;
	return { period, block, group };
}

export default function GruppiPeriodiCasella({ alt }: { alt?: string }) {
	const [z, setZ] = useState(11);
	const el = ELEMENTI[z - 1];
	const here = place(el);
	const text = explain(el);
	const firstOfPeriod = el.block === 's' && el.group === 1;
	const side = C * (f.W / (f.x1 - f.x0));
	const corner = (col: number, row: number) => f.px(v((col - 1) * C, -(row - 1) * C));

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{Array.from({ length: 18 }, (_, i) => (
					<Label key={i} f={f} at={v((i + 0.5) * C, 0.22)} upright size={here.col === i + 1 && here.row <= 7 ? 12 : 9} color={here.col === i + 1 && here.row <= 7 ? INK.red : '#000'}>
						{i + 1}
					</Label>
				))}
				{Array.from({ length: 7 }, (_, i) => (
					<Label key={i} f={f} at={v(-0.3, -(i + 0.5) * C)} upright size={el.period === i + 1 ? 12 : 9} color={el.period === i + 1 ? INK.red : '#000'}>
						{i + 1}
					</Label>
				))}
				{CELLS.map(({ el: e, col, row }) => {
					const p = corner(col, row);
					const selected = e.z === z;
					return (
						<g key={e.z}>
							<rect
								x={p.x}
								y={p.y}
								width={side}
								height={side}
								fill={BLOCK_TINT[e.block]}
								fillOpacity={selected ? 1 : 0.75}
								stroke="#000"
								strokeWidth={0.4}
								role="button"
								tabIndex={-1}
								aria-label={`${e.name}, numero atomico ${e.z}`}
								className="cursor-pointer outline-none"
								onClick={() => setZ(e.z)}
							/>
							<text x={p.x + side / 2} y={p.y + side / 2} dy="0.35em" textAnchor="middle" fontSize={7.5} fontFamily={FONT} fill="#000" pointerEvents="none">
								{e.symbol}
							</text>
						</g>
					);
				})}
				{(() => {
					const p = corner(here.col, here.row);
					return <rect x={p.x - 1} y={p.y - 1} width={side + 2} height={side + 2} fill="none" stroke={INK.red} strokeWidth={2.4} pointerEvents="none" />;
				})()}
				<path d={f.path([v(2.5 * C, -7 * C), v(2.5 * C, -(F_ROW[0] - 0.5) * C), v(3 * C, -(F_ROW[0] - 0.5) * C)])} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray="2 2" />
			</Drawing>

			<Readout>
				<span>
					{el.name} ({el.symbol}), <Tex>{`Z = ${z}`}</Tex>
				</span>
				<span>
					<Tex>{configTex(el)}</Tex>
				</span>
				<span>
					periodo {el.period}, {el.group !== null ? `gruppo ${el.group}` : el.series === 1 ? 'gruppo 3' : 'senza gruppo'}, blocco {el.block}
				</span>
			</Readout>
			<Caption>
				{text.period} {text.block} {text.group}
				{firstOfPeriod && z > 1 ? ' Con questo elettrone comincia un livello nuovo, e la casella va a capo.' : ''}
				{isException(el) && el.z <= 56 ? ' La configurazione è un’eccezione alla regola della diagonale; il posto nella tavola non cambia.' : ''}
			</Caption>

			<Controls>
				<Slider label="Numero atomico Z" value={z} min={1} max={118} step={1} onChange={setZ} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={z <= 1} onClick={() => setZ(z - 1)}>
						<Minus className="size-4" aria-hidden="true" />
						Un elettrone in meno
					</Button>
					<Button variant="secondary" size="sm" disabled={z >= 118} onClick={() => setZ(z + 1)}>
						<Plus className="size-4" aria-hidden="true" />
						Un elettrone in più
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
