'use client';

import { useId, useMemo, useState, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { elementi, leggiSelettore, prende, type Nodo, type Selettore, type Semplice } from '@/lib/informatica/css';
import { Caption } from '../kit';
import { Figura } from '../informatica';

/**
 * "Quali elementi della pagina prende un selettore, e perché `nav a` ne prende meno di `a`?" The page of the band is
 * drawn as its elements one inside the other; the student writes a selector, or picks one, and the elements it takes
 * light up. A selector that takes nothing says what is wrong with it (a class without its dot, an id written as a
 * class), which is the mistake the lesson warns about.
 */
const PAGINA: Nodo = {
	tag: 'body',
	figli: [
		{
			tag: 'header',
			figli: [
				{ tag: 'h1', testo: 'I Fuori Tempo' },
				{ tag: 'nav', figli: [{ tag: 'a', testo: 'Home' }, { tag: 'a', testo: 'Concerti' }] }
			]
		},
		{
			tag: 'main',
			figli: [
				{ tag: 'h2', testo: 'Prossimi concerti' },
				{ tag: 'p', classi: ['avviso'], testo: 'Ingresso libero' },
				{
					tag: 'ul',
					id: 'date',
					figli: [
						{ tag: 'li', classi: ['prossimo'], testo: '12 dicembre' },
						{ tag: 'li', testo: '20 gennaio' },
						{ tag: 'li', testo: '7 marzo' }
					]
				},
				{ tag: 'p', figli: [{ tag: 'a', testo: 'Torna alle date' }] }
			]
		}
	]
};
const TUTTI = elementi(PAGINA);
const POSTO = new Map(TUTTI.map(({ nodo }, i) => [nodo, i]));
const CLASSI = new Set(TUTTI.flatMap(({ nodo }) => nodo.classi ?? []));
const ID = new Set(TUTTI.flatMap(({ nodo }) => (nodo.id ? [nodo.id] : [])));
const TAG = new Set(TUTTI.map(({ nodo }) => nodo.tag));

const PRONTI = ['a', 'nav a', 'main a', 'li', '.prossimo', '#date', '#date li'];

/** The opening tag of an element as it is written in the page. */
const apertura = (nodo: Nodo) => `<${nodo.tag}${nodo.id ? ` id="${nodo.id}"` : ''}${nodo.classi?.length ? ` class="${nodo.classi.join(' ')}"` : ''}>`;

/** One piece of a selector in words: the elements it takes, or the one element the next piece must be inside. */
function inParole(s: Semplice, dentro: boolean): string {
	const classi = s.classi.length ? ` con classe ${s.classi.map((c) => `\`${c}\``).join(' e ')}` : '';
	if (s.id) return `l’elemento${s.tag ? ` \`${s.tag}\`` : ''} con id \`${s.id}\`${classi}`;
	if (dentro) return `un elemento${s.tag ? ` \`${s.tag}\`` : ''}${classi}`;
	return `gli elementi${s.tag ? ` \`${s.tag}\`` : ''}${classi}`;
}

function spiega(s: Selettore): string {
	let frase = inParole(s.parti[s.parti.length - 1], false);
	for (let i = s.parti.length - 2; i >= 0; i--) frase += `${s.legami[i] === '>' ? ' figli diretti di ' : i === s.parti.length - 2 ? ' che stanno dentro ' : ', dentro '}${inParole(s.parti[i], true)}`;
	return frase;
}

/** Why a selector that is written well takes nothing in this page. */
function perche(s: Selettore): string {
	for (const parte of s.parti) {
		if (parte.tag && !TAG.has(parte.tag)) {
			if (CLASSI.has(parte.tag)) return `Nessun elemento si chiama \`${parte.tag}\`: è il nome di una classe, e una classe vuole il punto davanti, \`.${parte.tag}\`.`;
			if (ID.has(parte.tag)) return `Nessun elemento si chiama \`${parte.tag}\`: è un id, e un id vuole il cancelletto davanti, \`#${parte.tag}\`.`;
			return `Nella pagina non c’è nessun elemento \`${parte.tag}\`.`;
		}
		for (const classe of parte.classi) {
			if (CLASSI.has(classe)) continue;
			if (ID.has(classe)) return `\`${classe}\` nella pagina è un id, non una classe: si scrive \`#${classe}\`.`;
			return `Nessun elemento ha la classe \`${classe}\`: conta ogni lettera, anche le maiuscole.`;
		}
		if (parte.id && !ID.has(parte.id)) {
			if (CLASSI.has(parte.id)) return `\`${parte.id}\` nella pagina è una classe, non un id: si scrive \`.${parte.id}\`.`;
			return `Nessun elemento ha l’id \`${parte.id}\`.`;
		}
	}
	return 'Ogni pezzo del selettore esiste nella pagina, ma nessun elemento li mette insieme in questo modo.';
}

/** A sentence with the code between backticks set in the monospaced font. */
function conCodice(frase: string): ReactNode[] {
	return frase.split('`').map((pezzo, i) =>
		i % 2 ? (
			<b key={i} className="font-mono font-medium whitespace-nowrap text-fg">
				{pezzo}
			</b>
		) : (
			pezzo
		)
	);
}

function Elemento({ nodo, accesi, riga = false }: { nodo: Nodo; accesi: ReadonlySet<number>; riga?: boolean }) {
	const acceso = accesi.has(POSTO.get(nodo)!);
	// the links of the menu sit side by side, as they do in the page
	const affiancati = nodo.tag === 'nav';
	return (
		<div
			data-elemento={nodo.tag}
			data-preso={acceso || undefined}
			className={cn(
				'min-w-0 rounded-lg border-[1.5px] px-1.5 pt-1 pb-1.5 motion-safe:transition-[background-color,border-color,box-shadow] motion-safe:duration-200',
				riga && 'flex-1',
				acceso ? 'relative z-[1] border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft ring-[3px] ring-tint/20' : 'border-edge-strong bg-surface'
			)}
		>
			<div className="flex items-baseline gap-x-2 leading-5">
				<span className={cn('font-mono text-[11.5px] font-medium whitespace-nowrap', acceso ? 'text-fg-strong' : 'text-fg-muted')}>{apertura(nodo)}</span>
				{nodo.testo && <span className="min-w-0 truncate text-xs text-fg-subtle">{nodo.testo}</span>}
				{acceso && <Check className="ml-auto size-3.5 shrink-0 self-center text-tint-fg" aria-hidden="true" />}
			</div>
			{nodo.figli && (
				<div className={cn('mt-1 flex gap-1.5', affiancati ? 'flex-row' : 'flex-col')}>
					{nodo.figli.map((figlio, i) => (
						<Elemento key={i} nodo={figlio} accesi={accesi} riga={affiancati} />
					))}
				</div>
			)}
		</div>
	);
}

export default function SelettoriCss({ alt }: { alt?: string }) {
	const id = useId();
	const [scritto, setScritto] = useState('nav a');
	const { accesi, frase, errore } = useMemo(() => {
		const letto = leggiSelettore(scritto);
		if ('errore' in letto) return { accesi: new Set<number>(), frase: letto.errore, errore: true };
		const accesi = new Set(TUTTI.flatMap(({ percorso }, i) => (letto.selettori.some((s) => prende(s, percorso)) ? [i] : [])));
		const nome = `\`${letto.selettori.map((s) => s.testo).join(', ')}\``;
		const quanti = accesi.size === 1 ? '1 elemento' : `${accesi.size} elementi`;
		if (letto.selettori.length > 1) return { accesi, frase: `${nome} prende ${quanti}: la virgola mette insieme quelli di ciascun selettore dell’elenco.`, errore: false };
		const s = letto.selettori[0];
		if (accesi.size === 0) return { accesi, frase: `${nome} non prende niente. ${perche(s)}`, errore: false };
		return { accesi, frase: `${nome} prende ${quanti}: ${spiega(s)}.`, errore: false };
	}, [scritto]);
	const nomi = [...accesi].map((i) => apertura(TUTTI[i].nodo)).join(', ');
	return (
		<Figura>
			<div className="flex w-full max-w-md flex-col gap-2">
				<label htmlFor={id} className="label-mono text-fg-subtle">
					Selettore
				</label>
				<input
					id={id}
					type="text"
					value={scritto}
					onChange={(e) => setScritto(e.target.value)}
					autoComplete="off"
					autoCapitalize="off"
					autoCorrect="off"
					spellCheck={false}
					aria-invalid={errore || undefined}
					className={cn(
						'min-h-10 w-full min-w-0 rounded-lg border bg-surface px-3 font-mono text-[15px] text-fg-strong shadow-paper transition outline-none focus:ring-3',
						errore ? 'border-danger focus:ring-danger/20' : 'border-edge-strong focus:border-[oklch(0.64_var(--chroma)_var(--hue))] focus:ring-tint/20'
					)}
				/>
				<div role="group" aria-label="Selettori da provare" className="flex flex-wrap gap-1.5">
					{PRONTI.map((pronto) => (
						<button
							key={pronto}
							type="button"
							onClick={() => setScritto(pronto)}
							aria-pressed={scritto.trim() === pronto}
							className={cn(
								'min-h-8 cursor-pointer rounded-lg border px-2.5 font-mono text-[13px] font-medium transition-[background-color,border-color] duration-150 focus-ring',
								scritto.trim() === pronto ? 'border-tint-edge bg-tint-soft text-tint-fg' : 'border-edge-strong bg-surface text-fg shadow-paper hover:bg-surface-2'
							)}
						>
							{pronto}
						</button>
					))}
				</div>
			</div>
			<div className="w-full max-w-md" role="img" aria-label={`${alt ?? 'Gli elementi della pagina, uno dentro l’altro'}. ${accesi.size ? `Presi dal selettore: ${nomi}.` : 'Nessun elemento preso.'}`}>
				<Elemento nodo={PAGINA} accesi={accesi} />
			</div>
			<div className="flex min-h-[5.25rem] w-full items-start justify-center sm:min-h-[3.75rem]" data-frase>
				<Caption>{conCodice(frase)}</Caption>
			</div>
		</Figura>
	);
}
