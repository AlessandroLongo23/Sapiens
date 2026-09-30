'use client';

import { useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, num, texNum, THICK, THIN, DASH } from '../kit';
import { LIQUID, Liquid, Surface, Vessel } from '../fisica/liquidi';
import { Words } from '../fisica/calore';
import { PARTICLE, mulberry32 } from './particelle-materia';

/**
 * Chemistry lesson 17 (Le soluzioni e la concentrazione percentuale): a beaker of water (50 to 200 g) at a temperature
 * from 0 to 60 °C, and a solute (sodium chloride or potassium nitrate) added a spoonful at a time or with a slider.
 * What dissolves is at most the solubility S (g in 100 g of water, interpolated from the table below) times the water
 * over 100; the rest lies on the bottom as a heap of crystals, the corpo di fondo. The dissolved solute is drawn as
 * dots, as many per square centimetre of liquid as the percentage by mass asks, so the solution looks denser as it
 * gets more concentrated. On the right, a meter of the percentage by mass with the saturated one dashed.
 *
 * Solubilities in g per 100 g of water at 0, 10, ..., 60 °C, as the lesson's graph (textbook tables, to be checked on
 * a handbook: NaCl 35,7-37,1; KNO3 13,3-110).
 */

type Sol = 'nacl' | 'kno3';
const SOLUTES: Record<Sol, { label: string; nome: string; S: number[] }> = {
	nacl: { label: 'Cloruro di sodio', nome: 'cloruro di sodio', S: [35.7, 35.8, 35.9, 36.1, 36.4, 36.7, 37.1] },
	kno3: { label: 'Nitrato di potassio', nome: 'nitrato di potassio', S: [13.3, 20.9, 31.6, 45.8, 63.9, 85.5, 110] },
};
const solubility = (sol: Sol, t: number) => {
	const S = SOLUTES[sol].S;
	const i = Math.min(5, Math.floor(t / 10));
	return S[i] + ((S[i + 1] - S[i]) * (t - 10 * i)) / 10;
};

const BW = 3.2, BH = 3.0, HMAX = 2.6; // beaker; liquid height with 200 g of water
const MX0 = 4.0, MX1 = 4.35, PMAX = 60; // the meter of the percentage, 0 to 60 %
const yOfP = (p: number) => (p / PMAX) * BH;
const f = frame(-0.3, 5.75, -0.35, BH + 0.65);
const PXCM = f.W / (f.x1 - f.x0);
const DOT_R = 0.045;
const PER_CM2 = 1.6; // dots per cm² for each percent

/** Candidate positions of the dots, in the unit square: the first n are used, so more solute only adds dots. */
const SPOTS = (() => {
	const rnd = mulberry32(17);
	return Array.from({ length: 700 }, () => ({ x: rnd(), y: rnd() }));
})();
const CRYSTAL = 0.13; // side of a crystal of the heap, cm
const GRAMS_PER_CRYSTAL = 1;

export default function SoluzioneAggiungiSoluto({ alt }: { alt?: string }) {
	const [sol, setSol] = useState<Sol>('nacl');
	const [water, setWater] = useState(100);
	const [t, setT] = useState(20);
	const [added, setAdded] = useState(0);

	const S = solubility(sol, t);
	const max = (S * water) / 100;
	const dissolved = Math.min(added, max);
	const bottom = added - dissolved;
	const pct = (dissolved / (dissolved + water)) * 100;
	const pctSat = (max / (max + water)) * 100;
	const saturated = added >= max - 1e-9 && added > 0;

	const level = (water / 200) * HMAX;
	const n = Math.min(SPOTS.length, Math.round(pct * PER_CM2 * BW * level));
	const heap: { x: number; y: number }[] = [];
	{
		let left = Math.round(bottom / GRAMS_PER_CRYSTAL);
		for (let row = 0; left > 0 && row < 12; row++) {
			const cols = Math.max(1, 14 - 2 * row);
			const take = Math.min(cols, left);
			for (let i = 0; i < take; i++) heap.push({ x: BW / 2 + (i - (cols - 1) / 2) * CRYSTAL, y: row * CRYSTAL * 0.9 });
			left -= take;
		}
	}

	let caption: string;
	if (added === 0) caption = `Acqua pura, a ${num(t, 0)} °C: qui si sciolgono al massimo ${num(max, 1)} g di ${SOLUTES[sol].nome}. Aggiungi il soluto un cucchiaino alla volta.`;
	else if (!saturated) caption = `Tutto il soluto si è sciolto: la soluzione è insatura. Se ne possono sciogliere ancora ${num(max - dissolved, 1)} g.`;
	else if (bottom < 0.05) caption = 'La soluzione è satura: tutto il soluto è sciolto, ma un grammo in più resterebbe sul fondo.';
	else caption = `La soluzione è satura: ${num(bottom, 1)} g di soluto restano sul fondo come corpo di fondo, e la percentuale non cresce più. Aggiungendo acqua se ne scioglie di più; scaldandola, ${sol === 'kno3' ? 'molto di più' : 'appena un po\' di più'}.`;

	const mark = (p: number) => (
		<path d={f.path([v(MX0 - 0.08, yOfP(p)), v(MX1 + 0.08, yOfP(p))])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
	);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Liquid f={f} pts={[v(0, 0), v(BW, 0), v(BW, level), v(0, level)]} fill={LIQUID.acqua} />
				{SPOTS.slice(0, n).map((s, i) => {
					const q = f.px(v(DOT_R + s.x * (BW - 2 * DOT_R), DOT_R + s.y * (level - 2 * DOT_R)));
					return <circle key={i} cx={q.x} cy={q.y} r={DOT_R * PXCM} fill={PARTICLE.b} stroke="#000" strokeWidth={0.3} />;
				})}
				{heap.map((c, i) => {
					const q = f.px(v(c.x - CRYSTAL / 2, c.y + CRYSTAL));
					return <rect key={i} x={q.x} y={q.y} width={CRYSTAL * PXCM} height={CRYSTAL * PXCM} fill="#fff" stroke="#000" strokeWidth={0.5} />;
				})}
				<Surface f={f} from={v(0, level)} to={v(BW, level)} />
				<Vessel f={f} pts={[v(0, BH), v(0, 0), v(BW, 0), v(BW, BH)]} />

				{/* the meter of the percentage by mass */}
				<path d={f.path([v(MX0, 0), v(MX1, 0), v(MX1, yOfP(pct)), v(MX0, yOfP(pct))], true)} fill={PARTICLE.b} stroke="none" />
				<path d={f.path([v(MX0, 0), v(MX1, 0), v(MX1, BH), v(MX0, BH)], true)} fill="none" stroke="#000" strokeWidth={THICK} />
				{[0, 20, 40, 60].map((p) => (
					<g key={p}>
						<path d={f.path([v(MX1, yOfP(p)), v(MX1 + 0.1, yOfP(p))])} stroke="#000" strokeWidth={THIN} />
						<Words f={f} at={v(MX1 + 0.16, yOfP(p))} anchor="start" size={11}>
							{`${p} %`}
						</Words>
					</g>
				))}
				{mark(pctSat)}
				<Words f={f} at={v((MX0 + MX1) / 2, BH + 0.42)} size={11}>
					% (m/m)
				</Words>
			</Drawing>

			<Readout>
				<Tex>{`m_{\\text{sciolta}} = ${texNum(dissolved, 1)}\\,\\text{g}`}</Tex>
				<Tex>{`m_{\\text{soluzione}} = ${texNum(dissolved + water, 1)}\\,\\text{g}`}</Tex>
				<Tex>{`\\%\\,(m/m) = ${texNum(pct, 1)}\\%`}</Tex>
				<Tex>{`S = ${texNum(S, 1)}\\,\\text{g in } 100\\,\\text{g d'acqua}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup label="Soluto" options={(Object.keys(SOLUTES) as Sol[]).map((k) => ({ value: k, label: SOLUTES[k].label }))} value={sol} onChange={setSol} />
				</div>
				<Slider label="Acqua (g)" value={water} min={50} max={200} step={10} onChange={setWater} />
				<Slider label="Temperatura (°C)" value={t} min={0} max={60} step={1} onChange={setT} />
				<Slider label="Soluto aggiunto (g)" value={added} min={0} max={150} step={1} onChange={setAdded} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={added >= 150} onClick={() => setAdded((a) => Math.min(150, a + 5))}>
						<Plus className="size-4" aria-hidden="true" />
						Un cucchiaino (5 g)
					</Button>
					<Button variant="ghost" size="sm" disabled={added === 0} onClick={() => setAdded(0)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
