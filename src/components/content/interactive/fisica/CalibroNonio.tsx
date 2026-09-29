'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, THICK, THIN, TINT, INK, FONT, type Frame } from '../kit';

/**
 * The scales of a vernier caliper seen up close, as the lesson "Gli strumenti di misura" draws them in TikZ
 * (nonio-decimale-lettura, nonio-ventesimale-lettura): the main scale in millimetres with the centimetres numbered,
 * on the fixed bar, and under it the vernier on the slider, `n` divisions long `n − 1` millimetres (10 in 9 mm,
 * 20 in 19 mm). The vernier division that meets a main-scale tick is drawn in orange with a small triangle.
 *
 * `NonioScala` is also what the exercises' scene `calibro` draws (src/components/content/exercises/scenes/Calibro.tsx).
 */

/**
 * Which vernier division meets a main-scale tick when the vernier's zero is at `reading` mm: with the reading
 * I + r/n, division j sits at I + r/n + j(n − 1)/n, an integer exactly when j = r.
 */
export const coincidentDivision = (reading: number, n: number) => Math.round((reading - Math.floor(reading + 1e-9)) * n) % n;

export function NonioScala({ f, reading, n, from, to, mm, x0 = 0, mark = true }: { f: Frame; reading: number; n: number; from: number; to: number; mm: number; x0?: number; mark?: boolean }) {
	const X = (m: number) => x0 + (m - from) * mm;
	const step = (n - 1) / n;
	const k = coincidentDivision(reading, n);
	const labelled = (j: number) => (n === 10 ? j % 5 === 0 : j % 10 === 0);
	const main: string[] = [];
	const labels: { x: number; t: string }[] = [];
	for (let m = Math.max(0, Math.ceil(from)); m <= to; m++) {
		const L = m % 10 === 0 ? 0.42 : m % 5 === 0 ? 0.3 : 0.2;
		main.push(f.path([v(X(m), 0), v(X(m), L)]));
		if (m % 10 === 0) labels.push({ x: X(m), t: String(m / 10) });
	}
	const ticks: string[] = [];
	const nlabels: { x: number; t: string }[] = [];
	for (let j = 0; j <= n; j++) {
		if (j === k && mark) continue;
		const x = X(reading + j * step);
		ticks.push(f.path([v(x, 0), v(x, labelled(j) ? -0.3 : -0.2)]));
	}
	for (let j = 0; j <= n; j += n === 10 ? 5 : 10) nlabels.push({ x: X(reading + j * step), t: String(n === 10 ? j : j / 2) });
	const xk = X(reading + k * step);
	const left = X(reading) - 0.4;
	const right = X(reading + n * step) + 0.4;
	const text = (x: number, y: number, t: string, key: string) => {
		const p = f.px(v(x, y));
		return (
			<text key={key} x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={13} fontFamily={FONT}>
				{t}
			</text>
		);
	};
	return (
		<g pointerEvents="none">
			<path d={f.path([v(X(from) - 0.2, 0), v(X(to) + 0.2, 0), v(X(to) + 0.2, 0.95), v(X(from) - 0.2, 0.95)], true)} fill={TINT.gray} stroke="none" />
			<path d={f.path([v(X(from) - 0.2, 0.95), v(X(to) + 0.2, 0.95)])} stroke="#000" strokeWidth={THICK} />
			<path d={f.path([v(left, 0), v(left, -0.95), v(right, -0.95), v(right, 0)], true)} fill={TINT.blue} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
			<path d={f.path([v(X(from) - 0.2, 0), v(X(to) + 0.2, 0)])} stroke="#000" strokeWidth={THICK} />
			<path d={main.join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
			<path d={ticks.join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
			{labels.map((l) => text(l.x, 0.68, l.t, `m${l.t}`))}
			{nlabels.map((l) => text(l.x, -0.58, l.t, `n${l.t}`))}
			{mark && (
				<>
					<path d={f.path([v(xk, 0), v(xk, labelled(k) ? -0.3 : -0.2)])} stroke={INK.orange} strokeWidth={THICK} />
					<path d={f.path([v(xk, -0.36), v(xk - 0.08, -0.5), v(xk + 0.08, -0.5)], true)} fill={INK.orange} />
				</>
			)}
		</g>
	);
}

const FROM = -1;
const TO = 31;
const MM = 0.235;
const f = frame(-0.3, (TO - FROM) * MM + 0.3, -1.1, 1.1);
const dec = (x: number, digits: number) => x.toFixed(digits).replace('.', '{,}');

export default function CalibroNonio({ alt }: { alt?: string }) {
	const [n, setN] = useState<10 | 20>(10);
	const [ticks, setTicks] = useState(37); // the reading in 1/n mm
	const [show, setShow] = useState(false);
	const reading = ticks / n;
	const whole = Math.floor(ticks / n);
	const k = ticks % n;
	const sens = 1 / n;
	const digits = n === 10 ? 1 : 2;

	const switchTo = (m: 10 | 20) => {
		setTicks(Math.round((ticks / n) * m));
		setN(m);
	};

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<NonioScala f={f} reading={reading} n={n} from={FROM} to={TO} mm={MM} />
			</Drawing>

			{show && (
				<Readout>
					<span>
						zero del nonio tra {whole} e {whole + 1} mm
					</span>
					<span>coincide la tacca {k}</span>
					<span className="font-medium">
						<Tex>{`${whole}\\,\\text{mm} + ${k} \\cdot ${dec(sens, digits)}\\,\\text{mm} = ${dec(reading, digits)}\\,\\text{mm}`}</Tex>
					</span>
				</Readout>
			)}
			<Caption>
				{n === 10 ? 'Nonio decimale: 10 divisioni in 9 mm, sensibilità 0,1 mm.' : 'Nonio ventesimale: 20 divisioni in 19 mm, sensibilità 0,05 mm; i numeri del nonio sono i decimi di millimetro.'}
				{!show && ' Leggi i millimetri interi allo zero del nonio, poi la tacca arancione, e controlla con «Mostra la lettura».'}
			</Caption>

			<Controls>
				<Slider label="Posizione del cursore (mm)" value={reading} min={0} max={10} step={1 / n} onChange={(x) => setTicks(Math.round(x * n))} />
				<ButtonRow>
					<Button variant={n === 10 ? 'primary' : 'secondary'} size="sm" aria-pressed={n === 10} onClick={() => switchTo(10)}>
						decimale
					</Button>
					<Button variant={n === 20 ? 'primary' : 'secondary'} size="sm" aria-pressed={n === 20} onClick={() => switchTo(20)}>
						ventesimale
					</Button>
					<Button variant="secondary" size="sm" aria-pressed={show} onClick={() => setShow((s) => !s)}>
						{show ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
						{show ? 'Nascondi la lettura' : 'Mostra la lettura'}
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
