'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Caption, Controls } from '../kit';
import { Contatori, Figura } from '../informatica';
import { ScatolaCss, misure, type Scatola } from './web';

/**
 * "Quanto spazio occupa davvero un elemento largo 160 px, una volta aggiunti padding, bordo e margine?" The box is
 * drawn to scale while the student moves the four sizes; the choice at the top switches `box-sizing`, and with
 * `border-box` the same `width` holds padding and border too.
 */
const WIDTH = 160, HEIGHT = 70;
const MAX: Scatola = { width: WIDTH, height: HEIGHT, padding: 30, border: 16, margin: 30 };

export default function ModelloScatola() {
	const [padding, setPadding] = useState(16);
	const [border, setBorder] = useState(4);
	const [margin, setMargin] = useState(20);
	const [sizing, setSizing] = useState<'content-box' | 'border-box'>('content-box');
	const scatola: Scatola = { width: WIDTH, height: HEIGHT, padding, border, margin, borderBox: sizing === 'border-box' };
	const m = misure(scatola);
	// the drawing is to scale, and shrinks as a whole when the column is narrower than the largest box
	const box = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);
	useLayoutEffect(() => {
		const node = box.current;
		if (!node) return;
		const observer = new ResizeObserver(() => setWidth(node.clientWidth));
		observer.observe(node);
		return () => observer.disconnect();
	}, []);
	const scala = Math.min(1, (width || 330) / misure(MAX).totalW);
	return (
		<Figura>
			<ToggleGroup
				label="box-sizing"
				compact
				value={sizing}
				onChange={setSizing}
				options={[
					{ value: 'content-box', label: 'content-box' },
					{ value: 'border-box', label: 'border-box' }
				]}
			/>
			<div ref={box} className="flex w-full justify-center">
				<ScatolaCss scatola={scatola} spazio={MAX} scala={scala} />
			</div>
			<Contatori voci={{ contenuto: `${m.contentW} px`, 'con bordo': `${m.boxW} px`, 'con margine': `${m.totalW} px` }} />
			<Caption>
				{sizing === 'content-box' ? (
					<>
						Con <b className="font-mono font-medium text-fg">width: {WIDTH}px</b> è largo {WIDTH} px solo il contenuto. In larghezza la scatola occupa {m.contentW} + 2 · {padding} + 2 · {border} = {m.boxW} px, e con i margini {m.boxW} + 2 · {margin} = {m.totalW} px.
					</>
				) : (
					<>
						Con <b className="font-mono font-medium text-fg">box-sizing: border-box</b> i {WIDTH} px di <b className="font-mono font-medium text-fg">width</b> comprendono padding e bordo: al contenuto restano {WIDTH} − 2 · {padding} − 2 · {border} = {m.contentW} px. Con i margini la scatola occupa {m.totalW} px.
					</>
				)}
			</Caption>
			<Controls>
				<Slider label="padding" value={padding} min={0} max={MAX.padding} step={1} unit="px" onChange={setPadding} />
				<Slider label="border" value={border} min={0} max={MAX.border} step={1} unit="px" onChange={setBorder} />
				<Slider label="margin" value={margin} min={0} max={MAX.margin} step={1} unit="px" onChange={setMargin} />
			</Controls>
		</Figura>
	);
}
