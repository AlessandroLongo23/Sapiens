'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Label, frame, v, THIN } from '../kit';
import { ColourLayer, wavelengthCss } from './chim3-A-luce';

/**
 * Lesson 48 (La luce e gli spettri atomici), "Ogni elemento ha il suo spettro": two line spectra between 400 and
 * 700 nm. The upper one belongs to an unknown sample, the lower one to the element the student picks (H, He, Li,
 * Na, Ne, Hg); a toggle turns both from emission (bright lines on black) into absorption (dark lines on the
 * continuous band). When the two coincide the caption names the element in the sample, and a button brings another
 * sample. The samples come in a fixed order, so the page is the same on the server and in the browser.
 *
 * Wavelengths of the strongest visible lines, in nm, with a relative strength used as opacity (NIST Atomic Spectra
 * Database, values written from memory: to be checked, see the lesson's notes). The spectra are drawn in a layer
 * left out of the dark theme's inversion.
 */

type El = 'H' | 'He' | 'Li' | 'Na' | 'Ne' | 'Hg';
const ELEMENTS: Record<El, { nome: string; con: string; righe: [number, number][] }> = {
	H: { nome: 'idrogeno', con: "dell'idrogeno", righe: [[656.3, 1], [486.1, 1], [434.0, 0.85], [410.2, 0.7]] },
	He: { nome: 'elio', con: "dell'elio", righe: [[667.8, 0.85], [587.6, 1], [501.6, 0.85], [492.2, 0.55], [471.3, 0.55], [447.1, 0.9], [402.6, 0.5]] },
	Li: { nome: 'litio', con: 'del litio', righe: [[670.8, 1], [610.4, 0.85], [497.2, 0.5], [460.3, 0.7]] },
	Na: { nome: 'sodio', con: 'del sodio', righe: [[589.0, 1], [589.6, 1], [568.8, 0.5], [616.1, 0.5], [498.3, 0.4]] },
	Ne: {
		nome: 'neon',
		con: 'del neon',
		righe: [[540.1, 0.5], [585.2, 0.9], [588.2, 0.6], [594.5, 0.65], [603.0, 0.55], [607.4, 0.65], [609.6, 0.65], [614.3, 0.85], [616.4, 0.55], [621.7, 0.55], [626.6, 0.65], [633.4, 0.75], [638.3, 0.85], [640.2, 1], [650.6, 0.85], [659.9, 0.65], [667.8, 0.65], [692.9, 0.6]]
	},
	Hg: { nome: 'mercurio', con: 'del mercurio', righe: [[404.7, 0.75], [407.8, 0.5], [435.8, 1], [491.6, 0.45], [546.1, 1], [577.0, 0.85], [579.1, 0.85], [690.7, 0.4]] }
};
const ORDER: El[] = ['H', 'He', 'Li', 'Na', 'Ne', 'Hg'];
const SAMPLES: El[] = ['Na', 'H', 'Hg', 'Li', 'Ne', 'He'];

const MIN = 400, MAX = 700;
const f = frame(-0.3, 10.3, -1.2, 3.75);
const xOf = (nm: number) => ((nm - MIN) / (MAX - MIN)) * 10;
const TOP = { y0: 2.25, y1: 3.0 };
const BOTTOM = { y0: 0.25, y1: 1.0 };

function Strip({ el, mode, y0, y1 }: { el: El; mode: 'emissione' | 'assorbimento'; y0: number; y1: number }) {
	const p = f.px(v(0, y1));
	const w = f.px(v(10, 0)).x - p.x;
	const h = f.px(v(0, y0)).y - p.y;
	const slices = Array.from({ length: 160 }, (_, i) => MIN + ((i + 0.5) / 160) * (MAX - MIN));
	return (
		<g>
			<rect x={p.x} y={p.y} width={w} height={h} fill="#000" />
			{mode === 'assorbimento' && slices.map((nm) => <rect key={nm} x={f.px(v(xOf(nm - 1), 0)).x} y={p.y} width={w / 160 + 0.5} height={h} fill={wavelengthCss(nm)} />)}
			{ELEMENTS[el].righe.map(([nm, k]) => (
				<rect key={nm} x={f.px(v(xOf(nm), 0)).x - 1} y={p.y} width={2} height={h} fill={mode === 'emissione' ? wavelengthCss(nm) : '#000'} fillOpacity={mode === 'emissione' ? 0.35 + 0.65 * k : 0.5 + 0.5 * k} />
			))}
		</g>
	);
}

export default function LuceSpettriRighe({ alt }: { alt?: string }) {
	const [el, setEl] = useState<El>('H');
	const [mode, setMode] = useState<'emissione' | 'assorbimento'>('emissione');
	const [sample, setSample] = useState(0);
	const unknown = SAMPLES[sample % SAMPLES.length];
	const found = unknown === el;
	const main = [...ELEMENTS[el].righe].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([nm]) => nm).sort((a, b) => a - b).map((x) => x.toFixed(1).replace('.', ',')).join(', ');

	return (
		<Figure>
			<div className="relative max-w-full">
				<Drawing f={f} label={alt}>
					<Label f={f} at={v(0, TOP.y1 + 0.08)} dir={v(1, 1)} upright size={13}>
						{found ? `campione: ${ELEMENTS[unknown].nome}` : 'campione sconosciuto'}
					</Label>
					<Label f={f} at={v(0, BOTTOM.y1 + 0.08)} dir={v(1, 1)} upright size={13}>
						{`${ELEMENTS[el].nome} (${el}), spettro di ${mode}`}
					</Label>
					{[400, 450, 500, 550, 600, 650, 700].map((t) => (
						<g key={t}>
							<path d={f.path([v(xOf(t), BOTTOM.y0), v(xOf(t), BOTTOM.y0 - 0.12)])} stroke="#000" strokeWidth={THIN} />
							<Label f={f} at={v(xOf(t), BOTTOM.y0 - 0.12)} dir={v(0, -1)} upright size={12}>
								{t}
							</Label>
						</g>
					))}
					<Label f={f} at={v(5, BOTTOM.y0 - 0.62)} dir={v(0, -1)} upright size={12}>
						lunghezza d&apos;onda (nm)
					</Label>
				</Drawing>
				<ColourLayer f={f}>
					<Strip el={unknown} mode={mode} {...TOP} />
					<Strip el={el} mode={mode} {...BOTTOM} />
				</ColourLayer>
			</div>
			<Caption>
				{found
					? `Le righe coincidono tutte: il campione contiene ${ELEMENTS[el].nome}. Righe più intense: ${main} nm.`
					: `Le righe del campione non sono quelle ${ELEMENTS[el].con} (le più intense: ${main} nm). Prova un altro elemento.`}
			</Caption>
			<Controls>
				<div className="flex justify-center">
					<ToggleGroup label="Elemento" options={ORDER.map((k) => ({ value: k, label: k }))} value={el} onChange={setEl} />
				</div>
				<div className="flex justify-center">
					<ToggleGroup
						label="Tipo di spettro"
						options={[
							{ value: 'emissione', label: 'emissione' },
							{ value: 'assorbimento', label: 'assorbimento' }
						]}
						value={mode}
						onChange={setMode}
					/>
				</div>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => setSample((s) => s + 1)}>
						Altro campione
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
