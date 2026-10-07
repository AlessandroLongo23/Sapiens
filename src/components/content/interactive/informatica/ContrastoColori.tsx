'use client';

import { useId, useState } from 'react';
import { ArrowLeftRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { SOGLIE, contrasto, leggiColore, scriviRapporto, supera } from '@/lib/informatica/responsive';
import { Caption } from '../kit';
import { Figura } from '../informatica';

/**
 * "Questo testo su questo sfondo si legge abbastanza, e come si fa a dirlo con un numero?" Two colours, the text's
 * and the background's: the figure shows a title and a line of text in them, computes their contrast ratio as the
 * accessibility guidelines define it (WCAG 2.2, in lib/informatica/responsive.ts) and compares it with the two
 * thresholds of level AA, 4,5 for normal text and 3 for large text.
 *
 * The two colours are the content of the figure, like the pixels of an image: they are the only ones not taken
 * from the site's tokens.
 */

const COPPIE = [
	{ nome: 'grigio chiaro su bianco', testo: '#999999', sfondo: '#ffffff' },
	{ nome: 'grigio scuro su bianco', testo: '#595959', sfondo: '#ffffff' },
	{ nome: 'bianco su arancione', testo: '#ffffff', sfondo: '#f28c28' },
	{ nome: 'nero su giallo', testo: '#1a1a1a', sfondo: '#ffd23f' }
] as const;

/** Where a ratio falls on the bar, which is logarithmic: from 1 to 21 the steps that count are the first ones. */
const sulRigo = (rapporto: number) => (Math.log(rapporto) / Math.log(21)) * 100;

function Colore({ nome, value, onChange }: { nome: string; value: string; onChange: (value: string) => void }) {
	const id = useId();
	// what is being typed, tied to the colour it started from: a colour changed elsewhere replaces it
	const [typed, setTyped] = useState<{ text: string; from: string } | null>(null);
	const draft = typed && typed.from === value ? typed.text : null;
	const bad = draft !== null && !leggiColore(draft);
	const write = (text: string) => {
		setTyped({ text, from: value });
		const read = leggiColore(text);
		// a colour is applied as soon as it can be read whole, six digits
		if (read && text.replace('#', '').trim().length === 6) onChange(`#${text.replace('#', '').trim().toLowerCase()}`);
	};
	return (
		<div className="flex min-w-0 flex-1 flex-col gap-1">
			<label htmlFor={id} className="label-mono text-fg-subtle">
				{nome}
			</label>
			<div className="flex items-center gap-2">
				<input type="color" aria-label={`${nome}: scegli il colore`} value={value} onChange={(e) => onChange(e.target.value)} className="size-9 shrink-0 cursor-pointer rounded-lg border border-edge-strong bg-surface p-0.5 focus-ring" />
				<input
					id={id}
					type="text"
					autoComplete="off"
					spellCheck={false}
					maxLength={7}
					value={draft ?? value}
					onChange={(e) => write(e.target.value)}
					onBlur={() => setTyped(null)}
					aria-invalid={bad || undefined}
					className={cn('min-h-9 w-full min-w-0 rounded-lg border bg-surface px-2.5 font-mono text-sm text-fg-strong shadow-paper transition outline-none focus:ring-3', bad ? 'border-danger focus:ring-danger/20' : 'border-edge-strong focus:border-[oklch(0.64_var(--chroma)_var(--hue))] focus:ring-tint/20')}
				/>
			</div>
		</div>
	);
}

function Esito({ nome, soglia, basta }: { nome: string; soglia: number; basta: boolean }) {
	return (
		<div data-esito={basta ? 'basta' : 'non basta'} className={cn('flex flex-1 basis-40 items-center gap-2 rounded-lg border px-3 py-2', basta ? 'border-ok-edge bg-ok-soft' : 'border-danger-edge bg-danger-soft')}>
			{basta ? <Check className="size-4 shrink-0 text-ok-fg" aria-hidden="true" /> : <X className="size-4 shrink-0 text-danger-fg" aria-hidden="true" />}
			<span className="text-sm leading-tight text-fg">
				<span className="block font-semibold text-fg-strong">{nome}</span>
				<span className="block text-xs text-fg-muted">
					<span className={cn('font-semibold', basta ? 'text-ok-fg' : 'text-danger-fg')}>{basta ? 'basta' : 'non basta'}</span>, <span className="whitespace-nowrap">serve {String(soglia).replace('.', ',')} : 1</span>
				</span>
			</span>
		</div>
	);
}

export default function ContrastoColori({ alt }: { alt?: string }) {
	const [testo, setTesto] = useState<string>(COPPIE[0].testo);
	const [sfondo, setSfondo] = useState<string>(COPPIE[0].sfondo);
	const rapporto = contrasto(leggiColore(testo)!, leggiColore(sfondo)!);
	const esito = supera(rapporto);
	const scritto = scriviRapporto(rapporto);
	return (
		<Figura>
			<div className="w-full max-w-md overflow-hidden rounded-xl border border-edge-strong shadow-paper" role="img" aria-label={alt ?? `Un titolo e una riga di testo di colore ${testo} su uno sfondo ${sfondo}`} data-campione>
				<div className="px-4 py-4" style={{ background: sfondo, color: testo }}>
					<div className="text-2xl leading-tight font-bold">I Fuori Tempo</div>
					<div className="mt-1.5 text-base leading-snug">Venerdì 12 dicembre alle 21, nella palestra della scuola.</div>
				</div>
			</div>
			<div className="flex w-full max-w-md flex-col gap-2">
				<div className="flex items-baseline justify-center gap-2" data-rapporto>
					<span className="font-mono text-3xl leading-none font-semibold text-fg-strong tabular-nums">{scritto}</span>
					<span className="font-mono text-lg leading-none text-fg-muted">: 1</span>
					<span className="label-mono ml-1 text-fg-subtle">rapporto di contrasto</span>
				</div>
				{/* the bar from 1 to 21, with the two thresholds */}
				<div className="relative mt-1 h-9" aria-hidden="true">
					<div className="absolute inset-x-0 top-1.5 h-2 rounded-full bg-surface-3" />
					<div className="absolute top-1.5 left-0 h-2 rounded-full bg-[oklch(0.7_var(--chroma)_var(--hue))] motion-safe:transition-[width] motion-safe:duration-300" style={{ width: `${sulRigo(rapporto)}%` }} />
					{[1, SOGLIE.AA.grande, SOGLIE.AA.normale, 21].map((x) => (
						<div key={x} className="absolute top-0 flex flex-col items-center" style={{ left: `${sulRigo(x)}%`, transform: x === 1 ? undefined : x === 21 ? 'translateX(-100%)' : 'translateX(-50%)' }}>
							<span className={cn('block h-5 w-[1.5px]', x === 1 || x === 21 ? 'bg-transparent' : 'bg-fg-strong')} />
							<span className={cn('font-mono text-[11px] leading-none tabular-nums', x === 1 || x === 21 ? 'text-fg-subtle' : 'font-semibold text-fg-strong')}>{String(x).replace('.', ',')}</span>
						</div>
					))}
				</div>
				<div className="flex flex-wrap gap-2">
					<Esito nome="Testo normale" soglia={SOGLIE.AA.normale} basta={esito.normale} />
					<Esito nome="Testo grande" soglia={SOGLIE.AA.grande} basta={esito.grande} />
				</div>
			</div>
			<div className="flex min-h-[4.5rem] w-full items-start justify-center sm:min-h-[2.75rem]">
				<Caption>
					{esito.normale ? (
						<>Con {scritto} : 1 questa coppia va bene per qualunque testo, anche piccolo.</>
					) : esito.grande ? (
						<>Con {scritto} : 1 la coppia va bene solo per un testo grande, come il titolo: la riga sotto, a dimensione normale, chiede almeno 4,5 : 1.</>
					) : (
						<>Con {scritto} : 1 la coppia non va bene nemmeno per il titolo: i due colori sono troppo vicini per luminosità.</>
					)}
				</Caption>
			</div>
			<div className="flex w-full max-w-md flex-col gap-3">
				<div className="flex items-end gap-2">
					<Colore nome="Testo" value={testo} onChange={setTesto} />
					<Button
						variant="secondary"
						size="sm"
						aria-label="Scambia testo e sfondo"
						title="Scambia testo e sfondo"
						className="shrink-0 px-2"
						onClick={() => {
							setTesto(sfondo);
							setSfondo(testo);
						}}
					>
						<ArrowLeftRight className="size-4" aria-hidden="true" />
					</Button>
					<Colore nome="Sfondo" value={sfondo} onChange={setSfondo} />
				</div>
				<div role="group" aria-label="Coppie di colori da provare" className="flex flex-wrap justify-center gap-1.5">
					{COPPIE.map((coppia) => {
						const on = coppia.testo === testo && coppia.sfondo === sfondo;
						return (
							<button
								key={coppia.nome}
								type="button"
								aria-pressed={on}
								onClick={() => {
									setTesto(coppia.testo);
									setSfondo(coppia.sfondo);
								}}
								className={cn('flex min-h-9 items-center gap-1.5 rounded-lg border-[1.5px] px-2 text-xs transition-colors duration-150 focus-ring', on ? 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft font-semibold text-fg-strong' : 'border-edge bg-surface text-fg-muted hover:border-edge-strong hover:bg-surface-2')}
							>
								<span aria-hidden="true" className="flex size-5 items-center justify-center rounded border border-edge-strong text-[11px] leading-none font-bold" style={{ background: coppia.sfondo, color: coppia.testo }}>
									A
								</span>
								{coppia.nome}
							</button>
						);
					})}
				</div>
			</div>
		</Figura>
	);
}
