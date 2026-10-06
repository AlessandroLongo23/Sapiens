'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, Readout, Tex, frame, v, texNum } from '../kit';
import { Sorgente, Macchina, Flusso, Grandezza, FLUSSO } from './flussiCalore';

/**
 * Lesson 114, after the definition of the efficiency: the diagram of a heat engine with its three flows drawn to
 * scale. The student sets the heat absorbed in a cycle and the heat given off; the work is their difference and the
 * efficiency W / Q_c. Starts from Q_c = 1000 J and Q_f = 700 J (W = 300 J, η = 0,30), the numbers of the text under
 * the figure. Drawn like the TikZ figure `macchina-termica-schema-flussi`: 1000 J are 1,1 cm of width.
 */

const QC_MIN = 200, QC_MAX = 1000, STEP = 50;
const CM_PER_J = 1.1 / QC_MAX;
const f = frame(-3.6, 3.6, -0.15, 4.9);

export default function MacchinaTermicaFlussi({ alt }: { alt?: string }) {
	const [qc, setQc] = useState(1000);
	const [qfWanted, setQf] = useState(700);
	// The heat given off cannot be more than the heat absorbed: the machine would need work from outside.
	const qf = Math.min(qfWanted, qc);
	const w = qc - qf;
	const eta = w / qc;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Sorgente f={f} at={v(0, 4.35)} calda>
					sorgente calda
				</Sorgente>
				<Sorgente f={f} at={v(0, 0.35)} calda={false}>
					sorgente fredda
				</Sorgente>
				<Flusso f={f} from={v(0, 4.0)} to={v(0, 3.0)} w={qc * CM_PER_J} />
				<Flusso f={f} from={v(0, 1.7)} to={v(0, 0.7)} w={qf * CM_PER_J} />
				<Flusso f={f} from={v(0.65, 2.35)} to={v(2.7, 2.35)} w={w * CM_PER_J} fill={FLUSSO.lavoro} />
				<Macchina f={f} at={v(0, 2.35)}>
					macchina
				</Macchina>
				<Grandezza f={f} at={v(-0.95, 3.55)} anchor="end" nome="Q" pedice="c" testo={` = ${qc} J`} />
				<Grandezza f={f} at={v(-0.95, 1.25)} anchor="end" nome="Q" pedice="f" testo={` = ${qf} J`} />
				<Grandezza f={f} at={v(1.75, 3.25)} nome="W" testo={` = ${w} J`} />
			</Drawing>

			<Readout>
				<span>
					<Tex>{`W = Q_c - Q_f = ${qc} - ${qf} = ${w}`}</Tex> J
				</span>
				<span>
					<Tex>{`\\eta = \\dfrac{W}{Q_c} = \\dfrac{${w}}{${qc}} = ${eta.toFixed(2).replace(".", "{,}")}`}</Tex>
				</span>
			</Readout>
			<Caption>
				{w === 0 ? (
					<>La macchina cede tutto il calore che assorbe: non compie lavoro, e il rendimento è zero.</>
				) : (
					<>
						Su {qc} J assorbiti, {w} J diventano lavoro: il {texNum(eta * 100, 0).replace('{,}', ',')}%. Il resto scende alla sorgente fredda.
					</>
				)}
			</Caption>

			<Controls>
				<Slider label="Calore assorbito (J)" value={qc} min={QC_MIN} max={QC_MAX} step={STEP} onChange={setQc} />
				<Slider label="Calore ceduto (J)" value={qf} min={100} max={QC_MAX} step={STEP} onChange={(x) => setQf(Math.min(x, qc))} />
			</Controls>
		</Figure>
	);
}
