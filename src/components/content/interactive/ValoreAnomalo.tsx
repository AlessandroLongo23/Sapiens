'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ButtonRow, Caption, clamp, Controls, DASH, Drawing, Figure, frame, INK, Readout, Tex, THICK, v } from './kit';
import { Grip, Line, PT, Text, Tick, xc } from './retta';

/**
 * Lesson 56, "Quale indice usare" (example 8): five salaries on a line, the mean and the median marked. The student
 * drags the owner's salary: the mean follows it, the median stays with the third datum in order. Drawn like
 * `valore-anomalo-media-mediana`; any salary can be dragged, in steps of 100 euro.
 */

const U = 0.88; // cm per 1000 euro, as in the TikZ figure
const LO = 1000, HI = 8000;
const X = (e: number) => (e / 1000) * U;
const START = [1200, 1300, 1300, 1400, 7800];
const f = frame(X(650), X(8650), -0.7, 2.0);
const DOT = xc('blue', 45);
const MEAN = xc('orange', 80, 'black');
const MEDIAN = INK.green; // green!50!black
const SMALL = 13.5; // \small

/** 13 000 with a thin space from five digits on, as the lesson writes it; 7800 without. */
const euro = (x: number) => (Math.abs(x) >= 10000 ? String(x).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : String(x));
const plain = (x: number) => (Math.abs(x) >= 10000 ? String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : String(x));

export default function ValoreAnomalo({ alt }: { alt?: string }) {
	const [xs, setXs] = useState(START);
	const S = xs.reduce((s, x) => s + x, 0);
	const m = S / 5; // a multiple of 20: the salaries go by 100
	const sorted = [...xs].sort((a, b) => a - b);
	const me = sorted[2];
	const move = (i: number, x: number) => setXs((a) => a.map((y, j) => (j === i ? clamp(Math.round((x / U) * 10) * 100, LO, HI) : y)));
	const level = xs.map((x, i) => xs.slice(0, i).filter((y) => y === x).length);
	const below = xs.filter((x) => x < m / 2).length;
	// Labels side by side when the two lines are close, so "media" never sits on the median's line.
	const close = Math.abs(X(m) - X(me)) < 0.9;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Line f={f} from={v(X(800), 0)} to={v(X(8300), 0)} width={THICK} arrow />
				{[1, 2, 3, 4, 5, 6, 7, 8].map((t) => (
					<g key={t}>
						<Tick f={f} x={X(t * 1000)} />
						{t !== 3 && t !== 5 && t !== 7 && (
							<Text f={f} at={v(X(t * 1000), -0.16)} baseline="top" size={SMALL}>
								{t * 1000}
							</Text>
						)}
					</g>
				))}
				<Line f={f} from={v(X(m), -0.3)} to={v(X(m), 1)} color={MEAN} width={THICK} />
				<Text f={f} at={v(X(m) + (close ? (m >= me ? 0.04 : -0.04) : 0), 1.06)} anchor={close ? (m >= me ? 'start' : 'end') : 'middle'} baseline="bottom" size={SMALL} color={MEAN}>
					media
				</Text>
				<Line f={f} from={v(X(me), 0.55)} to={v(X(me), 1.5)} color={MEDIAN} width={THICK} dash={DASH} />
				<Text f={f} at={v(X(me), 1.56)} baseline="bottom" size={SMALL} color={MEDIAN}>
					mediana
				</Text>
				{xs.map((x, i) => {
					const c = v(X(x), 0.2 + level[i] * 0.2);
					return (
						<Grip key={i} f={f} at={c} onMove={(p) => move(i, p.x)} label={`Stipendio di ${x} euro${i === 4 ? ', quello del titolare' : ''}`} step={0.1 * U} ring={7}>
							<circle cx={f.px(c).x} cy={f.px(c).y} r={2.5 * PT} fill={DOT} />
						</Grip>
					);
				})}
			</Drawing>
			<Readout>
				<Tex>{`\\bar{x} = \\frac{${euro(S)}}{5} = ${euro(m)}`}</Tex>
				<Tex>{`\\text{Me} = ${euro(me)}`}</Tex>
			</Readout>
			<Caption>
				Trascina lo stipendio del titolare, il pallino più a destra, o uno degli altri. La media, {plain(m)} euro, cambia con ogni dato; la mediana, {plain(me)} euro, è il terzo dato
				in ordine e resta ferma finché l’ordine non cambia.{' '}
				{below === 4 ? 'Quattro dipendenti su cinque guadagnano meno della metà della media.' : ''}
			</Caption>
			<Controls>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => setXs(START)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Torna agli stipendi dell’esempio
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
