'use client';

import { useState } from 'react';
import { Check, Minus, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Caption } from '../kit';
import { Figura } from '../informatica';

/**
 * "Quale formato conviene per questa immagine, e perché gli altri no?" The student picks what the image is for; each
 * of the five formats of the lesson answers with a verdict (suited, possible, not suited) and the reason, which
 * always comes from the same three properties: with or without loss, transparency, animation.
 */

const SCOPI = [
	{ id: 'foto', nome: 'Fotografia', frase: 'Una fotografia: milioni di colori e sfumature, nessun bordo netto.' },
	{ id: 'logo', nome: 'Logo', frase: 'Un logo o un’icona: poche forme, colori piatti, da usare a tante dimensioni.' },
	{ id: 'schermata', nome: 'Schermata', frase: 'Una schermata: testo piccolo e zone di colore uniforme.' },
	{ id: 'animazione', nome: 'Animazione', frase: 'Una breve animazione che si ripete, senza audio.' },
	{ id: 'trasparenza', nome: 'Sfondo trasparente', frase: 'Un’immagine da appoggiare su uno sfondo qualunque, senza il suo rettangolo.' }
] as const;
type Scopo = (typeof SCOPI)[number]['id'];
type Voto = 'adatto' | 'possibile' | 'no';

const FORMATI: { nome: string; estensione: string; tratti: string; voti: Record<Scopo, [Voto, string]> }[] = [
	{
		nome: 'JPEG',
		estensione: '.jpg',
		tratti: 'con perdita',
		voti: {
			foto: ['adatto', 'La perdita si nasconde nelle sfumature: il file è molto più piccolo e non si nota.'],
			logo: ['no', 'Attorno ai bordi netti la compressione con perdita lascia aloni.'],
			schermata: ['no', 'Il testo piccolo si sporca di aloni.'],
			animazione: ['no', 'Contiene un’immagine sola.'],
			trasparenza: ['no', 'Non ha trasparenza: il vuoto diventa un colore pieno.']
		}
	},
	{
		nome: 'PNG',
		estensione: '.png',
		tratti: 'senza perdita',
		voti: {
			foto: ['possibile', 'Conserva ogni pixel, ma per una foto il file è molte volte più grande.'],
			logo: ['possibile', 'Bordi netti e trasparenza, ma a una dimensione sola: ingrandito si sgrana.'],
			schermata: ['adatto', 'Senza perdita il testo resta nitido, e le zone uniformi si comprimono bene.'],
			animazione: ['no', 'Contiene un’immagine sola.'],
			trasparenza: ['adatto', 'Ogni pixel ha il suo grado di trasparenza: i bordi sfumano nello sfondo.']
		}
	},
	{
		nome: 'GIF',
		estensione: '.gif',
		tratti: '256 colori',
		voti: {
			foto: ['no', 'Ha al massimo 256 colori: le sfumature diventano fasce.'],
			logo: ['possibile', 'Pochi colori piatti li regge, ma un logo ingrandito si sgrana.'],
			schermata: ['possibile', 'Solo se i colori sono pochi.'],
			animazione: ['adatto', 'Più immagini in fila nello stesso file, e si apre ovunque.'],
			trasparenza: ['possibile', 'Un pixel è trasparente o non lo è: i bordi restano seghettati.']
		}
	},
	{
		nome: 'WebP',
		estensione: '.webp',
		tratti: 'con o senza perdita',
		voti: {
			foto: ['adatto', 'Con perdita, come JPEG, e di solito con file più piccoli.'],
			logo: ['possibile', 'Senza perdita e con trasparenza, come PNG: resta una bitmap.'],
			schermata: ['adatto', 'Nella versione senza perdita il testo resta nitido.'],
			animazione: ['adatto', 'Animazioni con tutti i colori e file più piccoli di una GIF.'],
			trasparenza: ['adatto', 'Trasparenza sfumata, come PNG.']
		}
	},
	{
		nome: 'SVG',
		estensione: '.svg',
		tratti: 'vettoriale',
		voti: {
			foto: ['no', 'Una foto non è fatta di forme: non si descrive con cerchi e linee.'],
			logo: ['adatto', 'È fatto di forme: resta netto a ogni dimensione, in un file minuscolo.'],
			schermata: ['no', 'Una schermata è una griglia di pixel, non un disegno di forme.'],
			animazione: ['possibile', 'Solo per forme che si muovono, non per un filmato.'],
			trasparenza: ['adatto', 'Dove non c’è una forma non c’è niente: lo sfondo si vede.']
		}
	}
];

const VOTO: Record<Voto, { nome: string; stile: string; Icona: typeof Check }> = {
	adatto: { nome: 'adatto', stile: 'border-ok/45 bg-ok-soft text-ok-fg', Icona: Check },
	possibile: { nome: 'si può', stile: 'border-edge-strong bg-surface text-fg', Icona: Minus },
	no: { nome: 'no', stile: 'border-dashed border-edge-strong bg-transparent text-fg-subtle', Icona: X }
};

export default function ScegliFormato({ alt }: { alt?: string }) {
	const [scopo, setScopo] = useState<Scopo>('foto');
	const scelto = SCOPI.find((s) => s.id === scopo)!;
	return (
		<Figura>
			<div role="radiogroup" aria-label={alt ?? 'A che cosa serve l’immagine'} className="flex flex-wrap justify-center gap-1.5">
				{SCOPI.map((s) => (
					<button
						key={s.id}
						type="button"
						role="radio"
						aria-checked={scopo === s.id}
						onClick={() => setScopo(s.id)}
						className={cn('min-h-9 cursor-pointer rounded-full border-[1.5px] px-3 py-1 text-sm font-medium transition focus-ring', scopo === s.id ? 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft text-fg-strong ring-[3px] ring-tint/20' : 'border-edge-strong bg-surface text-fg-muted shadow-paper hover:border-fg-faint hover:text-fg')}
					>
						{s.nome}
					</button>
				))}
			</div>
			<Caption>{scelto.frase}</Caption>
			<div role="list" className="flex w-full max-w-xl flex-col gap-1.5" aria-live="polite" data-formati>
				{FORMATI.map((f) => {
					const [voto] = f.voti[scopo];
					const { nome, stile, Icona } = VOTO[voto];
					return (
						<div key={f.nome} role="listitem" className={cn('grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 rounded-xl border px-3 py-2 sm:grid-cols-[9rem_5.75rem_1fr]', voto === 'adatto' ? 'border-ok/45 bg-surface shadow-paper' : 'border-edge bg-surface-2')} data-formato={f.nome} data-voto={voto}>
							<div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5 sm:flex-col sm:items-start">
								<span className="font-mono text-sm leading-tight font-semibold text-fg-strong">
									{f.nome} <span className="font-normal text-fg-subtle">{f.estensione}</span>
								</span>
								<span className="text-xs leading-snug text-fg-subtle">{f.tratti}</span>
							</div>
							<span className={cn('inline-flex h-7 items-center justify-center gap-1 justify-self-end rounded-full border-[1.5px] px-2.5 text-xs font-semibold whitespace-nowrap sm:w-full sm:justify-self-stretch', stile)}>
								<Icona className="size-3.5" aria-hidden="true" />
								{nome}
							</span>
							{/* every reason of the format takes the same cell, so the row keeps the height of the longest */}
							<div className="col-span-2 grid sm:col-span-1">
								{SCOPI.map((s) => (
									<p key={s.id} aria-hidden={s.id !== scopo} className={cn('col-start-1 row-start-1 m-0 text-sm leading-snug text-fg-muted sm:self-center', s.id !== scopo && 'invisible')}>
										{f.voti[s.id][1]}
									</p>
								))}
							</div>
						</div>
					);
				})}
			</div>
		</Figura>
	);
}
