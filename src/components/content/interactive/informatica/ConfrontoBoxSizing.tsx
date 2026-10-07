'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { cn } from '@/lib/utils/cn';
import { Caption, Controls } from '../kit';
import { Contatori, Figura } from '../informatica';
import { ScatolaCss, misure, type Scatola } from './web';

/**
 * "Due riquadri hanno la stessa regola, `width: 200px` con lo stesso padding e lo stesso bordo, e cambia solo
 * `box-sizing`: quanto è largo ciascuno?" The two boxes are drawn to scale one under the other, between two lines
 * 200 px apart: with `content-box` padding and border are added and the box goes past the line, with `border-box`
 * they are taken from the 200 px and the content shrinks. Under each box is its width with the sum that gives it.
 */
const WIDTH = 200;
const CONTENT_H = 34;
const MAX = { padding: 24, border: 8 };
const WIDEST = WIDTH + 2 * (MAX.padding + MAX.border);
const TALLEST = CONTENT_H + 2 * (MAX.padding + MAX.border);

/** The width of a box under it: a bracket as wide as the box, and the number with the sum it comes from. */
function Misura({ px, scala, conto, fuori }: { px: number; scala: number; conto: string; fuori?: boolean }) {
	return (
		<div className="flex flex-col gap-1" style={{ width: Math.max(px * scala, 1) }}>
			<div aria-hidden="true" className={cn('h-1.5 border-x border-b', fuori ? 'border-danger' : 'border-fg-subtle')} />
			<div className={cn('font-mono text-[11.5px] leading-4 whitespace-nowrap tabular-nums', fuori ? 'text-danger-fg' : 'text-fg-muted')}>{conto}</div>
		</div>
	);
}

export default function ConfrontoBoxSizing() {
	const [padding, setPadding] = useState(20);
	const [border, setBorder] = useState(4);
	const attorno = 2 * (padding + border);
	const content: Scatola = { width: WIDTH, height: CONTENT_H, padding, border, margin: 0 };
	const borderBox: Scatola = { width: WIDTH, height: CONTENT_H + attorno, padding, border, margin: 0, borderBox: true };
	const a = misure(content), b = misure(borderBox);
	const box = useRef<HTMLDivElement>(null);
	const [room, setRoom] = useState(0);
	useLayoutEffect(() => {
		const node = box.current;
		if (!node) return;
		const observer = new ResizeObserver(() => setRoom(node.clientWidth));
		observer.observe(node);
		return () => observer.disconnect();
	}, []);
	const k = Math.min(1, (room || 330) / WIDEST);
	const fuori = a.boxW - WIDTH;
	const somma = attorno ? `${WIDTH} + 2 · ${padding} + 2 · ${border} = ${a.boxW} px` : `${WIDTH} px`;
	const resto = attorno ? `${WIDTH} px, contenuto ${WIDTH} − ${attorno} = ${b.contentW}` : `${WIDTH} px`;
	const riga = (nome: string, scatola: Scatola, px: number, conto: string, esce: boolean) => (
		<div className="flex flex-col gap-1.5" style={{ height: TALLEST * k + 60 }} data-riga={nome}>
			<div className="font-mono text-xs leading-4 font-medium text-fg">
				box-sizing: <span className="text-tint-fg">{nome}</span>
			</div>
			<div className="relative w-fit">
				<ScatolaCss scatola={scatola} scala={k} />
				{/* where the 200 px of the rule end */}
				<div aria-hidden="true" className={cn('pointer-events-none absolute -inset-y-1.5 border-l border-dashed', esce ? 'border-danger' : 'border-fg-subtle')} style={{ left: WIDTH * k }} />
			</div>
			<Misura px={px} scala={k} conto={conto} fuori={esce} />
		</div>
	);
	return (
		<Figura>
			<div ref={box} className="flex w-full justify-center">
				<div className="flex flex-col gap-2" style={{ width: WIDEST * k }} role="img" aria-label={`Due riquadri con width di ${WIDTH} pixel, padding ${padding} e bordo ${border}. Con content-box il riquadro è largo ${a.boxW} pixel, con border-box ${b.boxW} pixel e il contenuto ${b.contentW}.`}>
					{/* the room the rule asks for */}
					<div className="flex flex-col gap-1" style={{ width: WIDTH * k }}>
						<div className="text-center font-mono text-[11.5px] leading-4 whitespace-nowrap text-fg-muted">width: {WIDTH}px</div>
						<div aria-hidden="true" className="h-1.5 border-x border-t border-fg-subtle" />
					</div>
					{riga('content-box', content, a.boxW, somma, fuori > 0)}
					{riga('border-box', borderBox, b.boxW, resto, false)}
				</div>
			</div>
			<Contatori voci={{ 'content-box': `${a.boxW} px`, 'border-box': `${b.boxW} px` }} />
			<div className="flex min-h-[6.25rem] w-full items-start justify-center sm:min-h-[3.75rem]">
				<Caption>
					{attorno ? (
						<>
							Con <b className="font-mono font-medium text-fg">content-box</b> i {WIDTH} px sono del contenuto, e padding e bordo si aggiungono: il riquadro arriva a {a.boxW} px, {fuori} in più di quelli chiesti. Con <b className="font-mono font-medium text-fg">border-box</b> i {WIDTH} px sono del riquadro intero, e al contenuto ne restano {b.contentW}.
						</>
					) : (
						<>Senza padding e senza bordo non c’è niente da aggiungere né da togliere: i due riquadri sono larghi {WIDTH} px, e i due modi di contare danno lo stesso risultato.</>
					)}
				</Caption>
			</div>
			<Controls>
				<Slider label="padding" value={padding} min={0} max={MAX.padding} step={1} unit="px" onChange={setPadding} />
				<Slider label="border" value={border} min={0} max={MAX.border} step={1} unit="px" onChange={setBorder} />
			</Controls>
		</Figura>
	);
}
