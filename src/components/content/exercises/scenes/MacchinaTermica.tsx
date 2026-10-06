'use client';

import { Drawing, frame, v } from '@/components/content/interactive/kit';
import { Sorgente, Macchina, Flusso, Grandezza, FLUSSO } from '@/components/content/interactive/fisica/flussiCalore';
import type { SceneProps } from '.';

/**
 * The diagram of a heat engine or a refrigerator between its two reservoirs (third year, group 43: lessons 114-116),
 * drawn like the lessons' TikZ figures: the hot reservoir above, the cold one below, each device a circle, heat and
 * work as fat arrows. One device, or two side by side (a forbidden device next to a real one, lesson 115). The arrows
 * all have the same width, whatever the numbers, so the drawing never gives the answer; the labels are the
 * generator's ('Qc = 800 J', 'W = ?').
 *
 *   { type: 'macchina-termica', data: {
 *       sorgenti: { calda: '520 K', fredda: '300 K' },            // optional, written after the reservoir's name
 *       dispositivi: [{ nome: 'macchina', vietato: false,
 *           caldo: { verso: 'entra', testo: 'Qc = 800 J' },       // entra: into the device; esce: out of it
 *           freddo: { verso: 'esce', testo: 'Qf = ?' },
 *           lavoro: { verso: 'esce', testo: 'W = 300 J' } }] } }   // esce, entra, or passa (to the device on its right)
 *
 * A label that begins with Q, Qc, Qf or W has its letter in italics with the subscript; anything else is plain text.
 * A device without `freddo` has no arrow to the cold reservoir, and so on.
 */
type Flow = { verso: 'entra' | 'esce' | 'passa'; testo: string };
type Device = { nome?: string; vietato?: boolean; caldo?: Flow; freddo?: Flow; lavoro?: Flow };

const isFlow = (x: unknown): x is Flow => !!x && typeof x === 'object' && typeof (x as Flow).testo === 'string' && ['entra', 'esce', 'passa'].includes((x as Flow).verso);
const Y = 2.35, R = 0.65, HEAT = 0.4, WORK = 0.3;

function Etichetta({ f, x, y, anchor, testo }: { f: ReturnType<typeof frame>; x: number; y: number; anchor: 'start' | 'middle' | 'end'; testo: string }) {
	const m = /^(Q|W)([cf]?)(?![A-Za-z])(.*)$/.exec(testo);
	if (!m) return <Grandezza f={f} at={v(x, y)} anchor={anchor} nome="" testo={testo} size={14} />;
	return <Grandezza f={f} at={v(x, y)} anchor={anchor} nome={m[1]} pedice={m[2] || undefined} testo={m[3]} size={14} />;
}

export default function MacchinaTermica({ data, alt }: SceneProps) {
	const devices = (Array.isArray(data.dispositivi) ? (data.dispositivi as Device[]) : []).filter((d) => !!d && typeof d === 'object').slice(0, 2);
	if (!devices.length) return <p className="sr-only">{alt}</p>;
	const two = devices.length === 2;
	const xs = two ? [-1.6, 1.6] : [0];
	const half = two ? 3.2 : 1.7;
	const f = two ? frame(-4.4, 4.4, -0.15, 4.85) : frame(-3.5, 3.7, -0.15, 4.85);
	const extra = (data.sorgenti && typeof data.sorgenti === 'object' ? data.sorgenti : {}) as { calda?: unknown; fredda?: unknown };
	const name = (base: string, more: unknown) => (typeof more === 'string' && more ? `${base}, ${more}` : base);

	return (
		<Drawing f={f} label={alt}>
			<Sorgente f={f} at={v(0, 4.35)} w={2 * half} calda>
				{name('sorgente calda', extra.calda)}
			</Sorgente>
			<Sorgente f={f} at={v(0, 0.35)} w={2 * half} calda={false}>
				{name('sorgente fredda', extra.fredda)}
			</Sorgente>
			{devices.map((d, i) => {
				const x = xs[i];
				// Labels go on the outer side of a device: left of the left one (or of the only one), right of the right one.
				const side = two && i === 1 ? 1 : -1;
				const lx = x + side * (HEAT / 2 + 0.3);
				const anchor = side < 0 ? 'end' : 'start';
				const hot = isFlow(d.caldo) ? d.caldo : null;
				const cold = isFlow(d.freddo) ? d.freddo : null;
				const work = isFlow(d.lavoro) ? d.lavoro : null;
				const right = two && i === 0 ? xs[1] - R : x + R + 1.65;
				return (
					<g key={i}>
						{hot && <Flusso f={f} from={v(x, hot.verso === 'entra' ? 4.0 : Y + R)} to={v(x, hot.verso === 'entra' ? Y + R : 4.0)} w={HEAT} />}
						{cold && <Flusso f={f} from={v(x, cold.verso === 'entra' ? 0.7 : Y - R)} to={v(x, cold.verso === 'entra' ? Y - R : 0.7)} w={HEAT} />}
						{work && work.verso !== 'entra' && <Flusso f={f} from={v(x + R, Y)} to={v(right, Y)} w={WORK} fill={FLUSSO.lavoro} />}
						{work && work.verso === 'entra' && <Flusso f={f} from={v(x + R + 1.65, Y)} to={v(x + R, Y)} w={WORK} fill={FLUSSO.lavoro} />}
						<Macchina f={f} at={v(x, Y)} proibita={d.vietato === true}>
							{typeof d.nome === 'string' ? d.nome : ''}
						</Macchina>
						{hot && <Etichetta f={f} x={lx} y={3.55} anchor={anchor} testo={hot.testo} />}
						{cold && <Etichetta f={f} x={lx} y={1.2} anchor={anchor} testo={cold.testo} />}
						{work && <Etichetta f={f} x={work.verso === 'passa' ? (x + R + right) / 2 : x + R + 0.95} y={Y + 0.6} anchor="middle" testo={work.testo} />}
					</g>
				);
			})}
		</Drawing>
	);
}
