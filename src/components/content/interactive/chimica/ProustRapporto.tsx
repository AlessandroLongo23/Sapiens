'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, useTween, THICK, THIN, FONT, type V } from '../kit';

/**
 * Lesson 24 (La legge di Proust): two bars as long as the masses of two elements, chosen with two sliders, for four
 * pairs with the combining ratios of the lesson (copper and sulfur 3,96; iron and sulfur 1,74; magnesium and oxygen
 * 1,52; oxygen and hydrogen 7,92, the heavier element first). "Fai reagire" detaches from each bar the part that
 * reacts, m_A = min(A, r·B) and m_B = m_A / r, and slides the two parts together into the bar of the compound; what is
 * left of the reactant in excess stays where it was, marked "avanza". The readout gives the ratio, the mass of the
 * second element that all of the first would need, the masses that react, the compound and the excess.
 */

type Pair = 'cu-s' | 'fe-s' | 'mg-o' | 'o-h';
interface Element { nome: string; simbolo: string; fill: string; max: number; step: number; start: number }
const PAIRS: Record<Pair, { label: string; ratio: number; a: Element; b: Element; composto: string }> = {
	'cu-s': { label: 'Cu e S', ratio: 3.96, composto: 'solfuro di rame', a: { nome: 'rame', simbolo: 'Cu', fill: '#f5c9a8', max: 12, step: 0.1, start: 8 }, b: { nome: 'zolfo', simbolo: 'S', fill: '#fff2a0', max: 5, step: 0.1, start: 3 } },
	'fe-s': { label: 'Fe e S', ratio: 1.74, composto: 'solfuro di ferro', a: { nome: 'ferro', simbolo: 'Fe', fill: '#d6d6d6', max: 10, step: 0.1, start: 7 }, b: { nome: 'zolfo', simbolo: 'S', fill: '#fff2a0', max: 8, step: 0.1, start: 3 } },
	'mg-o': { label: 'Mg e O', ratio: 1.52, composto: 'ossido di magnesio', a: { nome: 'magnesio', simbolo: 'Mg', fill: '#e8e8e8', max: 10, step: 0.1, start: 5 }, b: { nome: 'ossigeno', simbolo: 'O', fill: '#cfe0ff', max: 8, step: 0.1, start: 5 } },
	'o-h': { label: 'O e H', ratio: 7.92, composto: 'acqua', a: { nome: 'ossigeno', simbolo: 'O', fill: '#cfe0ff', max: 20, step: 0.1, start: 12 }, b: { nome: 'idrogeno', simbolo: 'H', fill: '#d9f2d9', max: 4, step: 0.05, start: 2 } },
};
const ORDER: Pair[] = ['cu-s', 'fe-s', 'mg-o', 'o-h'];

const X0 = 0; // where every bar starts
const WIDTH = 5.6; // the longest bar the figure can hold, in cm
const BH = 0.42; // bar height
const YA = 3.55, YB = 2.4, YP = 0.6; // the bars' lower edges: first element, second, compound
const f = frame(-0.15, 7.25, 0.2, 4.45);

/** "del rame", "dello zolfo", "dell'ossigeno". */
const del = (x: string) => (/^[aeiou]/.test(x) ? `dell'${x}` : x.startsWith('z') ? `dello ${x}` : `del ${x}`);
const g = (x: number, d = 2) => x.toFixed(d).replace('.', ',');
const tg = (x: number, d = 2) => `${x.toFixed(d).replace('.', '{,}')}\\,\\text{g}`;

function Words({ at, children, anchor = 'start', size = 13, weight }: { at: V; children: React.ReactNode; anchor?: 'start' | 'middle' | 'end'; size?: number; weight?: number }) {
	const p = f.px(at);
	return (
		<text x={p.x} y={p.y} dy="0.35em" textAnchor={anchor} fontSize={size} fontFamily={FONT} fontWeight={weight} fill="#000" pointerEvents="none">
			{children}
		</text>
	);
}

/** A bar from x0, `w` long, with its lower edge at y, and the element's symbol inside when it fits. */
function Bar({ x0, y, w, fill, dashed = false, symbol }: { x0: number; y: number; w: number; fill: string; dashed?: boolean; symbol?: string }) {
	if (w < 0.005) return null;
	return (
		<g>
			<path d={f.path([v(x0, y), v(x0 + w, y), v(x0 + w, y + BH), v(x0, y + BH)], true)} fill={fill} stroke="#000" strokeWidth={dashed ? THIN : THICK} strokeDasharray={dashed ? '3 3' : undefined} strokeLinejoin="round" />
			{symbol && w > 0.45 && (
				<Words at={v(x0 + w / 2, y + BH / 2)} anchor="middle" size={12}>
					{symbol}
				</Words>
			)}
		</g>
	);
}

export default function ProustRapporto({ alt }: { alt?: string }) {
	const [pair, setPair] = useState<Pair>('cu-s');
	const P = PAIRS[pair];
	const [ma, setMa] = useState(P.a.start);
	const [mb, setMb] = useState(P.b.start);
	const [t, go, running] = useTween(0, 1400);

	const r = P.ratio;
	const needB = ma / r; // the second element all of the first would need
	const usedA = Math.min(ma, r * mb);
	const usedB = usedA / r;
	const leftA = ma - usedA, leftB = mb - usedB;
	const excess = leftB > 1e-9 ? 'b' : leftA > 1e-9 ? 'a' : null;
	// cm per gram: the compound's bar at the largest masses fits the figure
	const k = WIDTH / Math.max(P.a.max + P.a.max / r, P.a.max, P.b.max);
	const done = t > 0.999;

	const reset = () => void go(0, 0);
	const choose = (p: Pair) => {
		setPair(p);
		setMa(PAIRS[p].a.start);
		setMb(PAIRS[p].b.start);
		reset();
	};

	// The reacting parts slide from their bars (from the left end) to the compound's bar.
	const partA = { x: X0, y: YA + (YP - YA) * t };
	const partB = { x: X0 + usedA * k * t, y: YB + (YP - YB) * t };

	let caption: string;
	if (!done) {
		if (Math.abs(needB - mb) < 1e-9) caption = 'Le masse sono esattamente nel rapporto di combinazione: reagiranno tutte e due per intero. Premi «Fai reagire».';
		else if (needB > mb) caption = `Per far reagire tutto il ${P.a.nome} servirebbero ${g(needB)} g di ${P.b.nome}, ma ce ne sono solo ${g(mb)} g: avanzerà una parte ${del(P.a.nome)}. Premi «Fai reagire».`;
		else caption = `Per far reagire tutto il ${P.a.nome} servono ${g(needB)} g di ${P.b.nome}, e ce ne sono ${g(mb)} g: avanzerà una parte ${del(P.b.nome)}. Premi «Fai reagire».`;
	} else {
		const left = excess === 'b' ? `avanzano ${g(leftB)} g di ${P.b.nome}` : excess === 'a' ? `avanzano ${g(leftA)} g di ${P.a.nome}` : 'non avanza niente';
		caption = `Hanno reagito ${g(usedA)} g di ${P.a.nome} e ${g(usedB)} g di ${P.b.nome}, sempre nel rapporto ${g(r)}: si sono formati ${g(usedA + usedB)} g di ${P.composto}, e ${left}.`;
	}

	const barA = done || t > 0 ? leftA : ma;
	const barB = done || t > 0 ? leftB : mb;
	const moving = t > 0;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Words at={v(X0, YA + BH + 0.3)}>{`${P.a.nome} (${P.a.simbolo})`}</Words>
				<Words at={v(X0, YB + BH + 0.3)}>{`${P.b.nome} (${P.b.simbolo})`}</Words>
				<Words at={v(X0, YP + BH + 0.3)}>{P.composto}</Words>

				{/* what stays of each bar: all of it before the reaction, the excess after (at the right end, where it was) */}
				{moving && <Bar x0={X0} y={YA} w={usedA * k} fill="none" dashed />}
				{moving && <Bar x0={X0} y={YB} w={usedB * k} fill="none" dashed />}
				<Bar x0={X0 + (moving ? usedA * k : 0)} y={YA} w={barA * k} fill={P.a.fill} symbol={P.a.simbolo} />
				<Bar x0={X0 + (moving ? usedB * k : 0)} y={YB} w={barB * k} fill={P.b.fill} symbol={P.b.simbolo} />
				{!moving && <Words at={v(X0 + ma * k + 0.12, YA + BH / 2)}>{`${g(ma)} g`}</Words>}
				{!moving && <Words at={v(X0 + mb * k + 0.12, YB + BH / 2)}>{`${g(mb)} g`}</Words>}
				{done && excess === 'a' && <Words at={v(X0 + ma * k + 0.12, YA + BH / 2)}>{`avanza ${g(leftA)} g`}</Words>}
				{done && excess === 'b' && <Words at={v(X0 + mb * k + 0.12, YB + BH / 2)}>{`avanza ${g(leftB)} g`}</Words>}

				{/* the parts that react, on their way or together in the compound */}
				{moving && <Bar x0={partA.x} y={partA.y} w={usedA * k} fill={P.a.fill} symbol={P.a.simbolo} />}
				{moving && <Bar x0={partB.x} y={partB.y} w={usedB * k} fill={P.b.fill} symbol={P.b.simbolo} />}
				{done && <path d={f.path([v(X0, YP), v(X0 + (usedA + usedB) * k, YP), v(X0 + (usedA + usedB) * k, YP + BH), v(X0, YP + BH)], true)} fill="none" stroke="#000" strokeWidth={2.2} />}
				{done && <Words at={v(X0 + (usedA + usedB) * k + 0.12, YP + BH / 2)}>{`${g(usedA + usedB)} g`}</Words>}
			</Drawing>

			<Readout>
				<Tex>{`\\dfrac{m_{\\mathrm{${P.a.simbolo}}}}{m_{\\mathrm{${P.b.simbolo}}}} = ${g(r).replace(',', '{,}')}`}</Tex>
				<Tex>{`\\text{${P.b.nome} per tutto il ${P.a.nome}} = ${tg(needB)}`}</Tex>
				{done && <Tex>{`\\text{${P.composto}} = ${tg(usedA)} + ${tg(usedB)} = ${tg(usedA + usedB)}`}</Tex>}
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup label="I due elementi" options={ORDER.map((p) => ({ value: p, label: PAIRS[p].label }))} value={pair} onChange={choose} />
				</div>
				<Slider
					label={`${P.a.nome[0].toUpperCase()}${P.a.nome.slice(1)} (g)`}
					value={ma}
					min={P.a.step}
					max={P.a.max}
					step={P.a.step}
					onChange={(x) => {
						setMa(x);
						reset();
					}}
				/>
				<Slider
					label={`${P.b.nome[0].toUpperCase()}${P.b.nome.slice(1)} (g)`}
					value={mb}
					min={P.b.step}
					max={P.b.max}
					step={P.b.step}
					onChange={(x) => {
						setMb(x);
						reset();
					}}
				/>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={running} onClick={() => (done ? reset() : void go(1))}>
						{done ? <RotateCcw className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{done ? 'Ricomincia' : 'Fai reagire'}
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
