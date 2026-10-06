'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, frame, v, num, texNum, THIN, THICK, DASH, TINT } from '../kit';
import { QTY } from '../fisica';
import { AssiPV, BarreSegno, Cilindro, PuntoStato, Verso, areaSotto, lineaPV, puntoPV, tintaTemperatura, tratto, type PianoPV, type Stato } from './pianoPV';

/**
 * Lesson 111 (Le trasformazioni isocora, isobara e isoterma), before the summary table: a monatomic perfect gas with
 * n R = 2,0 J/K (about 0,24 mol) starts from A (3,0 L, 200 kPa, 300 K) and follows one of the three transformations.
 * At constant volume the slider is the final temperature (150 to 600 K); at constant pressure and at constant
 * temperature it is the final volume (1,5 to 6,0 L). The cylinder lies above the pressure-volume plane on the same
 * horizontal scale; the line from A to the final state is drawn with the area under it, and three bars give Q, W
 * and ΔU: W = 0 and Q = ΔU = 3/2 n R ΔT on the isochore, W = p ΔV and Q = ΔU + W on the isobar, ΔU = 0 and
 * Q = W = n R T ln(V_B / V_A) on the isotherm. Scale: 0,85 cm per litre, 0,009 cm per kilopascal, 0,001 cm per joule.
 */

const PIANO: PianoPV = { sx: 0.85, sy: 0.009, vMax: 6.5, pMax: 450, vPasso: 1, pPasso: 100, vUnita: 'L', pUnita: 'kPa' };
const A: Stato = { V: 3, p: 200 };
const TA = 300;
const NR = (A.p * A.V) / TA; // 2 J/K
type Tipo = 'isocora' | 'isobara' | 'isoterma';
const Y = 5.45;
const R = 0.42;
const f = frame(-1.05, 9.35, -0.95, 6.1);
const ISO_300 = tratto('isoterma', { V: 600 / 450, p: 450 }, { V: 6.5, p: 0 });

export default function TrasformazioniGasBilancio({ alt }: { alt?: string }) {
	const [tipo, setTipo] = useState<Tipo>('isobara');
	const [Tf, setTf] = useState(450);
	const [Vf, setVf] = useState(5);

	const B: Stato = tipo === 'isocora' ? { V: A.V, p: (A.p * Tf) / TA } : tipo === 'isobara' ? { V: Vf, p: A.p } : { V: Vf, p: (A.p * A.V) / Vf };
	const TB = (B.p * B.V) / NR;
	const dU = tipo === 'isoterma' ? 0 : 1.5 * NR * (TB - TA);
	const W = tipo === 'isocora' ? 0 : tipo === 'isobara' ? A.p * (B.V - A.V) : A.p * A.V * Math.log(B.V / A.V);
	const Q = dU + W;
	const linea = tratto(tipo === 'isoterma' ? 'isoterma' : 'retta', A, B);
	const fermo = Math.abs(B.V - A.V) < 1e-9 && Math.abs(B.p - A.p) < 1e-9;
	const j = (x: number) => num(Math.abs(x), 0);

	const caption = fermo
		? 'Il gas è nello stato A. Sposta il cursore per farlo arrivare in un altro stato.'
		: tipo === 'isocora'
			? `Il pistone è bloccato e il gas non compie lavoro: tutto il calore ${Q > 0 ? 'assorbito' : 'ceduto'} (${j(Q)} J) ${Q > 0 ? 'aumenta' : 'diminuisce'} l’energia interna, e la temperatura passa da 300 K a ${num(TB, 0)} K.`
			: tipo === 'isobara'
				? Q > 0
					? `A pressione costante il gas assorbe ${j(Q)} J di calore: ${j(W)} J escono come lavoro e ${j(dU)} J restano nel gas, che arriva a ${num(TB, 0)} K.`
					: `A pressione costante il gas cede ${j(Q)} J di calore: ${j(W)} J li riceve come lavoro di compressione, e la sua energia interna cala di ${j(dU)} J. Arriva a ${num(TB, 0)} K.`
				: Q > 0
					? `La temperatura resta 300 K e l’energia interna non cambia: tutto il calore assorbito (${j(Q)} J) esce come lavoro.`
					: `La temperatura resta 300 K e l’energia interna non cambia: tutto il lavoro subito dal gas (${j(W)} J) esce come calore ceduto.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Cilindro f={f} x0={0} x={B.V * PIANO.sx} y={Y} r={R} lunghezza={PIANO.vMax * PIANO.sx} fill={tintaTemperatura((TB - 150) / 450)} fermo={tipo === 'isocora'} />
				<Label f={f} at={v(PIANO.vMax * PIANO.sx + 0.75, Y)} dir={v(1, 0)} upright size={13}>
					{`${num(TB, 0)} K`}
				</Label>
				<path d={f.path([v(B.V * PIANO.sx, Y - R), puntoPV(PIANO, B)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.45} />

				{Math.abs(B.V - A.V) > 1e-9 && <path d={areaSotto(f, PIANO, linea)} fill={W > 0 ? TINT.orange : TINT.blue20} stroke="none" />}
				<AssiPV f={f} a={PIANO} />
				<path d={lineaPV(f, PIANO, ISO_300.filter((s) => s.V <= 6.5 && s.p > 0))} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.4} />
				<Label f={f} at={v(6.2 * PIANO.sx, (600 / 6.2) * PIANO.sy + 0.12)} dir={v(0, 1)} upright size={11}>
					300 K
				</Label>
				{!fermo && <path d={lineaPV(f, PIANO, linea)} stroke={QTY.vettore} strokeWidth={THICK * 1.3} fill="none" strokeLinejoin="round" />}
				{!fermo && <Verso f={f} a={PIANO} stati={linea} color={QTY.vettore} />}
				<PuntoStato f={f} at={puntoPV(PIANO, A)} nome="A" dir={v(-0.7, -0.7)} />
				{!fermo && <PuntoStato f={f} at={puntoPV(PIANO, B)} nome="B" dir={v(0.7, 0.7)} />}

				<BarreSegno
					f={f}
					at={v(7.3, 2.0)}
					scale={0.001}
					max={1500}
					bars={[
						{ nome: 'Q', value: Q, fill: TINT.orange },
						{ nome: 'W', value: W, fill: TINT.blue },
						{ nome: 'U', delta: true, value: dU, fill: TINT.green }
					]}
				/>
			</Drawing>

			<Readout>
				<Tex>{`Q = ${texNum(Q, 0)}\\,\\text{J}`}</Tex>
				<Tex>{`W = ${texNum(W, 0)}\\,\\text{J}`}</Tex>
				<Tex>{`\\Delta U = ${texNum(dU, 0)}\\,\\text{J}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<ToggleGroup
					label="Trasformazione"
					value={tipo}
					onChange={setTipo}
					options={[
						{ value: 'isocora', label: 'Isocora' },
						{ value: 'isobara', label: 'Isobara' },
						{ value: 'isoterma', label: 'Isoterma' }
					]}
				/>
				{tipo === 'isocora' ? (
					<Slider label="Temp. finale (K)" value={Tf} min={150} max={600} step={10} onChange={setTf} />
				) : (
					<Slider label="Volume finale (L)" value={Vf} min={1.5} max={6} step={0.1} onChange={setVf} />
				)}
			</Controls>
		</Figure>
	);
}
