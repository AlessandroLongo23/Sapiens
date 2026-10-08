'use client';

import { useState, type ReactNode } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Caption } from '../kit';
import { Contatori, Figura } from '../informatica';

/**
 * "Quanto occupa un brano o un video senza compressione, e quanto con il bitrate di un file compresso?"
 * The student sets how the sound or the video is made and how long it lasts; the figure does the count of the
 * lesson (bits per second, then the size) and draws the two sizes to scale, one bar under the other.
 * Multiples are decimal, as in the lesson: 1 kB = 1000 B.
 */

/** 1411200 → "1 411 200", with spaces that do not break. */
const mille = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const virgola = (x: number, cifre = 1) => {
	const fisso = x.toFixed(cifre).replace(/\.?0+$/, '');
	const [intero, decimali] = fisso.split('.');
	return mille(Number(intero)) + (decimali ? `,${decimali}` : '');
};
/** A number of bytes with the multiple that reads best, three figures or so. */
function dimensione(byte: number): string {
	if (byte < 1000) return `${virgola(byte, 0)} B`;
	for (const [unita, quanto] of [['kB', 1e3], ['MB', 1e6], ['GB', 1e9]] as const) {
		const x = byte / quanto;
		if (x < 1000 || unita === 'GB') return `${virgola(x, x < 10 ? 2 : 1)} ${unita}`;
	}
	return '';
}
/** Bits per second in kbit/s or Mbit/s. */
const flusso = (bit: number, unita: 'kbit/s' | 'Mbit/s') => (unita === 'kbit/s' ? `${virgola(bit / 1e3, 1)} kbit/s` : `${virgola(bit / 1e6, 1)} Mbit/s`);

// in the order shown: an object would put the keys that are whole numbers first
const FREQUENZE = ['8', '22,05', '44,1', '48'] as const;
const hertz = (kHz: (typeof FREQUENZE)[number]) => Number(kHz.replace(',', '.')) * 1000;
const PROFONDITA = ['8', '16', '24'] as const;
const CANALI = { mono: 1, stereo: 2 } as const;
const AUDIO_COMPRESSO = ['64', '128', '192', '320'] as const;

const RISOLUZIONI = ['1280 × 720', '1920 × 1080', '3840 × 2160'] as const;
const FPS = ['24', '25', '30', '60'] as const;
const VIDEO_COMPRESSO = ['2', '5', '8', '16'] as const;

function Riga({ nome, children }: { nome: string; children: ReactNode }) {
	return (
		<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
			<span className="label-mono text-fg-subtle">{nome}</span>
			{children}
		</div>
	);
}

function Barra({ nome, valore, quota, piena }: { nome: string; valore: string; quota: number; piena?: boolean }) {
	return (
		<div className="flex flex-col gap-1.5">
			<div className="flex items-baseline justify-between gap-3 text-sm">
				<span className="text-fg-muted">{nome}</span>
				<span className="font-mono font-semibold whitespace-nowrap text-fg-strong tabular-nums">{valore}</span>
			</div>
			<div className="h-3 w-full overflow-hidden rounded-full bg-surface-3">
				<div className={piena ? 'h-full rounded-full bg-[oklch(0.7_var(--chroma)_var(--hue))] motion-safe:transition-[width] motion-safe:duration-200' : 'h-full rounded-full bg-ok motion-safe:transition-[width] motion-safe:duration-200'} style={{ width: `max(3px, ${quota * 100}%)` }} />
			</div>
		</div>
	);
}

export default function AudioVideoDimensione({ alt }: { alt?: string }) {
	const [cosa, setCosa] = useState<'audio' | 'video'>('audio');
	const [minuti, setMinuti] = useState(3);
	// audio
	const [frequenza, setFrequenza] = useState<(typeof FREQUENZE)[number]>('44,1');
	const [bit, setBit] = useState<(typeof PROFONDITA)[number]>('16');
	const [canali, setCanali] = useState<keyof typeof CANALI>('stereo');
	const [kbit, setKbit] = useState<(typeof AUDIO_COMPRESSO)[number]>('128');
	// video
	const [risoluzione, setRisoluzione] = useState<(typeof RISOLUZIONI)[number]>('1920 × 1080');
	const [fps, setFps] = useState<(typeof FPS)[number]>('25');
	const [mbit, setMbit] = useState<(typeof VIDEO_COMPRESSO)[number]>('5');

	const secondi = minuti * 60;
	const audio = cosa === 'audio';
	const f = hertz(frequenza), b = Number(bit), c = CANALI[canali];
	const [w, h] = risoluzione.split(' × ').map(Number);
	const fotogramma = w * h * 3; // bytes
	const alSecondo = audio ? f * b * c : fotogramma * 8 * Number(fps); // bits
	const compressoAlSecondo = audio ? Number(kbit) * 1000 : Number(mbit) * 1e6;
	const intero = (alSecondo * secondi) / 8;
	const compresso = (compressoAlSecondo * secondi) / 8;
	const volte = intero / compresso;
	const quanteVolte = virgola(volte, volte < 10 ? 1 : 0);

	return (
		<Figura>
			<ToggleGroup
				label="Che cosa misurare"
				compact
				value={cosa}
				onChange={setCosa}
				options={[
					{ value: 'audio', label: 'Un brano' },
					{ value: 'video', label: 'Un video' }
				]}
			/>
			<div className="flex w-full max-w-md flex-col gap-3" role="img" aria-label={alt ?? `Due barre in scala: senza compressione ${dimensione(intero)}, compresso ${dimensione(compresso)}`}>
				<Barra nome="Senza compressione" valore={dimensione(intero)} quota={1} piena />
				<Barra nome={`Compresso a ${audio ? `${kbit} kbit/s` : `${mbit} Mbit/s`}`} valore={dimensione(compresso)} quota={compresso / intero} />
			</div>
			<Contatori voci={audio ? { 'al secondo': flusso(alSecondo, 'kbit/s'), 'un minuto': dimensione((alSecondo * 60) / 8) } : { 'un fotogramma': dimensione(fotogramma), 'un secondo': dimensione(alSecondo / 8) }} />
			<Caption>
				{audio ? (
					<>
						Ogni secondo: {mille(f)} · {b} · {c} = {mille(alSecondo)} bit. In {minuti} {minuti === 1 ? 'minuto' : 'minuti'}, cioè {secondi} secondi: {mille(alSecondo)} · {secondi} : 8 = {mille(intero)} B, cioè {dimensione(intero)}. A {kbit} kbit/s gli stessi {secondi} secondi occupano {mille(compressoAlSecondo)} · {secondi} : 8 = {mille(compresso)} B, cioè {dimensione(compresso)}: {quanteVolte} volte meno.
					</>
				) : (
					<>
						Un fotogramma: {mille(w)} · {mille(h)} · 3 = {mille(fotogramma)} B. Ogni secondo ne passano {fps}: {dimensione(alSecondo / 8)}, cioè {flusso(alSecondo, 'Mbit/s')}. In {minuti} {minuti === 1 ? 'minuto' : 'minuti'}: {dimensione(intero)}. A {mbit} Mbit/s lo stesso video occupa {mille(compressoAlSecondo)} · {secondi} : 8 = {mille(compresso)} B, cioè {dimensione(compresso)}: {quanteVolte} volte meno.
					</>
				)}
			</Caption>
			<div className="flex w-full max-w-md flex-col gap-3">
				{audio ? (
					<>
						<Riga nome="Frequenza (kHz)">
							<ToggleGroup label="Frequenza di campionamento in kHz" compact value={frequenza} onChange={setFrequenza} options={FREQUENZE.map((value) => ({ value, label: value }))} />
						</Riga>
						<Riga nome="Bit per campione">
							<ToggleGroup label="Bit per campione" compact value={bit} onChange={setBit} options={PROFONDITA.map((value) => ({ value, label: value }))} />
						</Riga>
						<Riga nome="Canali">
							<ToggleGroup label="Canali" compact value={canali} onChange={setCanali} options={(Object.keys(CANALI) as (keyof typeof CANALI)[]).map((value) => ({ value, label: value }))} />
						</Riga>
						<Riga nome="Compresso (kbit/s)">
							<ToggleGroup label="Bitrate del file compresso in kbit/s" compact value={kbit} onChange={setKbit} options={AUDIO_COMPRESSO.map((value) => ({ value, label: value }))} />
						</Riga>
					</>
				) : (
					<>
						<Riga nome="Risoluzione">
							<ToggleGroup label="Risoluzione in pixel" compact value={risoluzione} onChange={setRisoluzione} options={RISOLUZIONI.map((value) => ({ value, label: value }))} />
						</Riga>
						<Riga nome="Fotogrammi al secondo">
							<ToggleGroup label="Fotogrammi al secondo" compact value={fps} onChange={setFps} options={FPS.map((value) => ({ value, label: value }))} />
						</Riga>
						<Riga nome="Compresso (Mbit/s)">
							<ToggleGroup label="Bitrate del file compresso in Mbit/s" compact value={mbit} onChange={setMbit} options={VIDEO_COMPRESSO.map((value) => ({ value, label: value }))} />
						</Riga>
					</>
				)}
				<Slider label="Durata" value={minuti} min={1} max={10} step={1} unit="min" onChange={setMinuti} />
			</div>
		</Figura>
	);
}
