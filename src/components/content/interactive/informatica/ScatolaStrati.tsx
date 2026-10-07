'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Caption, Controls } from '../kit';
import { Contatori, Figura } from '../informatica';
import { ScatolaCss, misure, type Scatola } from './web';

/**
 * "Il riquadro del concerto ha `width: 200px`: quanto spazio occupa davvero nella pagina, una volta aggiunti padding,
 * bordo e margine?" The box of the lesson drawn to scale, with its four sizes on sliders: the content stays as wide
 * as `width` says, and everything else is added around it. Adapted from ModelloScatola, with the numbers of the
 * lesson and without the choice of `box-sizing`, which has its own figure (ConfrontoBoxSizing).
 */
const HEIGHT = 56;
const MAX: Scatola = { width: 220, height: HEIGHT, padding: 30, border: 12, margin: 30 };

export default function ScatolaStrati() {
	const [width, setWidth] = useState(200);
	const [padding, setPadding] = useState(16);
	const [border, setBorder] = useState(4);
	const [margin, setMargin] = useState(20);
	const scatola: Scatola = { width, height: HEIGHT, padding, border, margin };
	const m = misure(scatola);
	// the drawing is to scale, and shrinks as a whole when the column is narrower than the largest box
	const box = useRef<HTMLDivElement>(null);
	const [room, setRoom] = useState(0);
	useLayoutEffect(() => {
		const node = box.current;
		if (!node) return;
		const observer = new ResizeObserver(() => setRoom(node.clientWidth));
		observer.observe(node);
		return () => observer.disconnect();
	}, []);
	const scala = Math.min(1, (room || 330) / misure(MAX).totalW);
	return (
		<Figura>
			<div ref={box} className="flex w-full justify-center">
				<ScatolaCss scatola={scatola} spazio={MAX} scala={scala} />
			</div>
			<Contatori voci={{ contenuto: `${m.contentW} px`, 'fino al bordo': `${m.boxW} px`, 'con i margini': `${m.totalW} px` }} />
			<Caption>
				<b className="font-mono font-medium text-fg">width: {width}px</b> è la larghezza del solo contenuto. Fino al bordo il riquadro è largo {width} + 2 · {padding} + 2 · {border} = {m.boxW} px; con i margini occupa {m.boxW} + 2 · {margin} = {m.totalW} px.
			</Caption>
			<Controls>
				<Slider label="width" value={width} min={120} max={MAX.width} step={10} unit="px" onChange={setWidth} />
				<Slider label="padding" value={padding} min={0} max={MAX.padding} step={1} unit="px" onChange={setPadding} />
				<Slider label="border" value={border} min={0} max={MAX.border} step={1} unit="px" onChange={setBorder} />
				<Slider label="margin" value={margin} min={0} max={MAX.margin} step={1} unit="px" onChange={setMargin} />
			</Controls>
		</Figura>
	);
}
