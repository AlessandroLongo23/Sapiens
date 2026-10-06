'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, useTween, num, texNum, THIN, THICK, DASH, TINT } from '../kit';
import { Arrow, QTY } from '../fisica';
import { AssiPV, Cilindro, PuntoStato, Verso, areaSotto, finoA, lavoro, lineaPV, puntoPV, tintaTemperatura, type PianoPV, type Stato } from './pianoPV';

/**
 * Lesson 109 (Il lavoro in una trasformazione termodinamica), "Il lavoro dipende dal cammino": a gas in a cylinder
 * goes from A (2 L, 300 kPa) to B (6 L, 100 kPa), the states of examples 2 and 3, along one of three paths: the
 * isobar at 300 kPa and then the isochore (1200 J), the straight segment (800 J), the isochore and then the isobar at
 * 100 kPa (400 J). The cylinder lies above the pressure-volume plane on the same horizontal scale, so the piston's
 * face is at the gas's volume; the button runs the path, the state's dot traces it and the area under it fills in.
 * The gas is tinted by its temperature (p V), from blue to red, and a red arrow on the piston is the gas's push.
 * Scale: 0,9 cm per litre, 0,01 cm per kilopascal; 1 kPa · 1 L = 1 J.
 */

const PIANO: PianoPV = { sx: 0.9, sy: 0.01, vMax: 7, pMax: 400, vPasso: 1, pPasso: 100, vUnita: 'L', pUnita: 'kPa' };
const A: Stato = { V: 2, p: 300 };
const B: Stato = { V: 6, p: 100 };
const C: Stato = { V: 6, p: 300 };
const D: Stato = { V: 2, p: 100 };
const CAMMINI = {
	alto: { stati: [A, C, B], nome: 'isobara a 300 kPa, poi isocora' },
	diretto: { stati: [A, B], nome: 'segmento da A a B' },
	basso: { stati: [A, D, B], nome: 'isocora, poi isobara a 100 kPa' }
} as const;
type Cammino = keyof typeof CAMMINI;
const Y = 5.55; // the cylinder's axis
const R = 0.45;
const KF = 0.006; // cm of arrow per kilopascal
const f = frame(-1.05, 7.6, -0.95, 6.7);

export default function PistoneLavoroCammini({ alt }: { alt?: string }) {
	const [cammino, setCammino] = useState<Cammino>('diretto');
	const [t, go, running] = useTween(1, 2600);

	const tutto = CAMMINI[cammino].stati as readonly Stato[];
	const fatto = finoA([...tutto], t, PIANO);
	const ora = fatto[fatto.length - 1];
	const W = lavoro(fatto);
	const totale = lavoro([...tutto]);
	const x = ora.V * PIANO.sx;
	const caldo = (ora.p * ora.V - 200) / 1600;

	const scegli = (c: Cammino) => {
		setCammino(c);
		void go(1, 0);
	};
	const percorri = async () => {
		await go(0, 0);
		await go(1);
	};

	const caption =
		t <= 0.001
			? 'Il gas è in A. Premi Percorri: lo stato si sposta lungo il cammino scelto e l’area sotto la linea, il lavoro, si colora.'
			: t < 0.999
				? `Finora il gas ha compiuto ${num(W, 0)} J.`
				: `Lungo questo cammino (${CAMMINI[cammino].nome}) il gas compie ${num(totale, 0)} J, l’area colorata. Gli stati A e B sono gli stessi per i tre cammini, il lavoro no: 1200 J, 800 J, 400 J.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Cilindro f={f} x0={0} x={x} y={Y} r={R} lunghezza={PIANO.vMax * PIANO.sx} fill={tintaTemperatura(caldo)} />
				<Arrow f={f} from={v(x + 0.16, Y + R + 0.22)} to={v(x + 0.16 + ora.p * KF, Y + R + 0.22)} color={QTY.forza} />
				<Label f={f} at={v(x + 0.16 + (ora.p * KF) / 2, Y + R + 0.26)} dir={v(0, 1)} size={13} color={QTY.forza}>
					F
				</Label>
				<path d={f.path([v(x, Y - R), puntoPV(PIANO, ora)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.45} />

				{fatto.length > 1 && <path d={areaSotto(f, PIANO, fatto)} fill={TINT.orange} stroke="none" />}
				<AssiPV f={f} a={PIANO} />
				{(Object.keys(CAMMINI) as Cammino[]).filter((c) => c !== cammino).map((c) => (
					<path key={c} d={lineaPV(f, PIANO, [...CAMMINI[c].stati])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.35} />
				))}
				<path d={lineaPV(f, PIANO, [...tutto])} stroke="#000" strokeWidth={THIN} fill="none" opacity={0.5} />
				<path d={lineaPV(f, PIANO, fatto)} stroke={QTY.vettore} strokeWidth={THICK * 1.3} fill="none" strokeLinejoin="round" />
				{t >= 0.999 && <Verso f={f} a={PIANO} stati={[...tutto]} color={QTY.vettore} at={cammino === 'diretto' ? 0.5 : 0.3} />}
				<PuntoStato f={f} at={puntoPV(PIANO, A)} nome="A" dir={v(-0.7, 0.7)} />
				<PuntoStato f={f} at={puntoPV(PIANO, B)} nome="B" dir={v(0.7, 0.7)} />
				{t < 0.999 && <PuntoStato f={f} at={puntoPV(PIANO, ora)} color={QTY.risultante} />}
			</Drawing>

			<Readout>
				<Tex>{`V = ${texNum(ora.V, 1)}\\,\\text{L}`}</Tex>
				<Tex>{`p = ${texNum(ora.p, 0)}\\,\\text{kPa}`}</Tex>
				<Tex>{`W = ${texNum(W, 0)}\\,\\text{J}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<ToggleGroup
					label="Cammino da A a B"
					value={cammino}
					onChange={scegli}
					options={[
						{ value: 'alto', label: 'Dall’alto' },
						{ value: 'diretto', label: 'Diretto' },
						{ value: 'basso', label: 'Dal basso' }
					]}
				/>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={running} onClick={() => void percorri()}>
						<Play className="size-4" aria-hidden="true" />
						Percorri
					</Button>
					<Button variant="secondary" size="sm" disabled={running || t <= 0.001} onClick={() => void go(0, 0)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Torna in A
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
