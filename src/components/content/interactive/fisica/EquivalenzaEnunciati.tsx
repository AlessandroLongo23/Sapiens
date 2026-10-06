'use client';

import { useState } from 'react';
import { Layers, Split } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, DASH, THICK, FONT } from '../kit';
import { Sorgente, Macchina, Flusso, Grandezza, FLUSSO } from './flussiCalore';

/**
 * Lesson 115, the equivalence of the two statements of the second law. Two constructions, the lesson's examples 4
 * and 5, with the flows drawn to scale (800 J are 1 cm of width):
 *
 * - "Se cade Clausius": a forbidden device (dashed) takes back to the hot reservoir the heat Q_f that a real engine
 *   has given to the cold one. The engine absorbs Q_c = 800 J; the slider sets Q_f. Seen as one machine, the pair
 *   takes Q_c − Q_f from the hot reservoir alone and turns it all into work: Kelvin's forbidden engine.
 * - "Se cade Kelvin": a forbidden engine (dashed) turns the heat Q = W of the hot reservoir all into work, which
 *   drives a real refrigerator that absorbs Q_f = 400 J; the slider sets W. Seen as one machine, the pair moves
 *   Q_f from cold to hot with no work: Clausius's forbidden device.
 *
 * The button swaps the two devices for their sum, a dashed box with the net flows only.
 */

type Mode = 'clausius' | 'kelvin';
const QC = 800;
const QF_FRIGO = 400;
const K = 1 / 800;
const XL = -1.6, XR = 1.6, Y = 2.35, R = 0.65;
const f = frame(-4.35, 4.35, -0.15, 4.9);

export default function EquivalenzaEnunciati({ alt }: { alt?: string }) {
	const [mode, setMode] = useState<Mode>('clausius');
	const [qf, setQf] = useState(500);
	const [work, setWork] = useState(200);
	const [whole, setWhole] = useState(false);

	const sources = (
		<>
			<Sorgente f={f} at={v(0, 4.35)} w={6.4} calda>
				sorgente calda
			</Sorgente>
			<Sorgente f={f} at={v(0, 0.35)} w={6.4} calda={false}>
				sorgente fredda
			</Sorgente>
		</>
	);
	const box = () => {
		const a = f.px(v(-2.5, 3.0)), b = f.px(v(2.5, 1.7));
		const c = f.px(v(0, Y));
		return (
			<g pointerEvents="none">
				<rect x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} rx={10} fill={FLUSSO.macchina} stroke="#000" strokeWidth={THICK} strokeDasharray={DASH} />
				<text x={c.x} y={c.y} dy="0.35em" textAnchor="middle" fontSize={13} fontFamily={FONT}>
					i due dispositivi insieme
				</text>
			</g>
		);
	};

	let drawing, readout, caption;
	if (mode === 'clausius') {
		const w = QC - qf;
		if (!whole) {
			drawing = (
				<>
					{sources}
					<Flusso f={f} from={v(XL, 0.7)} to={v(XL, Y - R)} w={qf * K} />
					<Flusso f={f} from={v(XL, Y + R)} to={v(XL, 4.0)} w={qf * K} />
					<Macchina f={f} at={v(XL, Y)} proibita>
						vietato
					</Macchina>
					<Flusso f={f} from={v(XR, 4.0)} to={v(XR, Y + R)} w={QC * K} />
					<Flusso f={f} from={v(XR, Y - R)} to={v(XR, 0.7)} w={qf * K} />
					<Flusso f={f} from={v(XR + R, Y)} to={v(3.9, Y)} w={w * K} fill={FLUSSO.lavoro} />
					<Macchina f={f} at={v(XR, Y)}>
						macchina
					</Macchina>
					<Grandezza f={f} at={v(XL - 0.75, 3.5)} anchor="end" nome="" testo={`${qf} J`} size={14} />
					<Grandezza f={f} at={v(XL - 0.75, 1.2)} anchor="end" nome="" testo={`${qf} J`} size={14} />
					<Grandezza f={f} at={v(XR + 0.8, 3.6)} anchor="start" nome="Q" pedice="c" testo={` = ${QC} J`} size={14} />
					<Grandezza f={f} at={v(XR + 0.75, 1.2)} anchor="start" nome="Q" pedice="f" testo={` = ${qf} J`} size={14} />
					<Grandezza f={f} at={v(3.35, 1.72)} nome="W" testo={` = ${w} J`} size={14} />
				</>
			);
			readout = (
				<>
					<span>
						sorgente fredda: <Tex>{`+${qf} - ${qf} = 0`}</Tex> J
					</span>
					<span>
						sorgente calda: <Tex>{`-${QC} + ${qf} = -${w}`}</Tex> J
					</span>
				</>
			);
			caption = (
				<>
					Il dispositivo vietato riporta in alto i {qf} J che la macchina scarica in basso. Premi il bottone per vedere che cosa fanno i due insieme.
				</>
			);
		} else {
			drawing = (
				<>
					{sources}
					<Flusso f={f} from={v(0, 4.0)} to={v(0, 3.0)} w={w * K} />
					<Flusso f={f} from={v(2.5, Y)} to={v(4.1, Y)} w={w * K} fill={FLUSSO.lavoro} />
					{box()}
					<Grandezza f={f} at={v(-0.75, 3.55)} anchor="end" nome="Q" testo={` = ${w} J`} size={14} />
					<Grandezza f={f} at={v(3.4, 1.72)} nome="W" testo={` = ${w} J`} size={14} />
				</>
			);
			readout = (
				<span>
					<Tex>{`W = Q = ${w}`}</Tex> J, da una sola sorgente
				</span>
			);
			caption = <>L&apos;insieme prende {w} J dalla sola sorgente calda e li trasforma tutti in lavoro: è la macchina vietata da Kelvin.</>;
		}
	} else {
		const qc = QF_FRIGO + work;
		if (!whole) {
			drawing = (
				<>
					{sources}
					<Flusso f={f} from={v(XL, 4.0)} to={v(XL, Y + R)} w={work * K} />
					<Flusso f={f} from={v(XL + R, Y)} to={v(XR - R, Y)} w={work * K} fill={FLUSSO.lavoro} />
					<Macchina f={f} at={v(XL, Y)} proibita>
						vietata
					</Macchina>
					<Flusso f={f} from={v(XR, 0.7)} to={v(XR, Y - R)} w={QF_FRIGO * K} />
					<Flusso f={f} from={v(XR, Y + R)} to={v(XR, 4.0)} w={qc * K} />
					<Macchina f={f} at={v(XR, Y)}>
						frigorifero
					</Macchina>
					<Grandezza f={f} at={v(XL - 0.6, 3.5)} anchor="end" nome="Q" testo={` = ${work} J`} size={14} />
					<Grandezza f={f} at={v(0, 1.72)} nome="W" testo={` = ${work} J`} size={14} />
					<Grandezza f={f} at={v(XR + 0.8, 3.5)} anchor="start" nome="Q" pedice="c" testo={` = ${qc} J`} size={14} />
					<Grandezza f={f} at={v(XR + 0.65, 1.2)} anchor="start" nome="Q" pedice="f" testo={` = ${QF_FRIGO} J`} size={14} />
				</>
			);
			readout = (
				<>
					<span>
						sorgente calda: <Tex>{`-${work} + ${qc} = +${QF_FRIGO}`}</Tex> J
					</span>
					<span>
						sorgente fredda: <Tex>{`-${QF_FRIGO}`}</Tex> J
					</span>
				</>
			);
			caption = (
				<>
					La macchina vietata trasforma {work} J di calore tutti in lavoro, e con quel lavoro aziona il frigorifero. Premi il bottone per vedere che cosa fanno i due insieme.
				</>
			);
		} else {
			drawing = (
				<>
					{sources}
					<Flusso f={f} from={v(0, 0.7)} to={v(0, 1.7)} w={QF_FRIGO * K} />
					<Flusso f={f} from={v(0, 3.0)} to={v(0, 4.0)} w={QF_FRIGO * K} />
					{box()}
					<Grandezza f={f} at={v(-0.6, 3.5)} anchor="end" nome="" testo={`${QF_FRIGO} J`} size={14} />
					<Grandezza f={f} at={v(-0.6, 1.2)} anchor="end" nome="" testo={`${QF_FRIGO} J`} size={14} />
				</>
			);
			readout = (
				<span>
					<Tex>{`W = 0`}</Tex>, e {QF_FRIGO} J dal freddo al caldo
				</span>
			);
			caption = <>L&apos;insieme non scambia lavoro con l&apos;esterno e porta {QF_FRIGO} J dalla sorgente fredda a quella calda: è il dispositivo vietato da Clausius.</>;
		}
	}

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{drawing}
			</Drawing>
			<Readout>{readout}</Readout>
			<Caption>{caption}</Caption>
			<Controls>
				<div className="flex justify-center">
					<ToggleGroup
						label="Quale enunciato far cadere"
						value={mode}
						onChange={(m) => {
							setMode(m);
							setWhole(false);
						}}
						options={[
							{ value: 'clausius', label: 'Se cade Clausius' },
							{ value: 'kelvin', label: 'Se cade Kelvin' }
						]}
					/>
				</div>
				{mode === 'clausius' ? (
					<Slider label="Calore ceduto (J)" value={qf} min={200} max={700} step={50} onChange={setQf} />
				) : (
					<Slider label="Lavoro prodotto (J)" value={work} min={100} max={400} step={50} onChange={setWork} />
				)}
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => setWhole(!whole)}>
						{whole ? <Split className="size-4" aria-hidden="true" /> : <Layers className="size-4" aria-hidden="true" />}
						{whole ? 'Guarda i due dispositivi' : "Guarda l'insieme"}
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
