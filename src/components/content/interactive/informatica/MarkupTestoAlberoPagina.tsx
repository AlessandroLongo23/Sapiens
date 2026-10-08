'use client';

import { useState, type ReactNode } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { cn } from '@/lib/utils/cn';
import { Figura, Frase } from '../informatica';

/**
 * "Che cosa hanno in comune il testo marcato, l'albero degli elementi e la pagina?" The same short text three
 * times: with its marks, as the tree of its elements, and as the page a browser draws. The student picks an element
 * in any of the three and sees where it is in the other two. A choice at the top writes the marks in HTML or in
 * Markdown: the tree and the page stay the same.
 */
type Id = 'body' | 'h1' | 'p' | 'em' | 'ul' | 'li1' | 'li2';
type Lingua = 'html' | 'markdown';

const GENITORE: Record<Id, Id | null> = { body: null, h1: 'body', p: 'body', em: 'p', ul: 'body', li1: 'ul', li2: 'ul' };
const TAG: Record<Id, string> = { body: 'body', h1: 'h1', p: 'p', em: 'em', ul: 'ul', li1: 'li', li2: 'li' };
/** Whether `id` is `antenato` or inside it. */
function sta(id: Id, antenato: Id): boolean {
	for (let at: Id | null = id; at; at = GENITORE[at]) if (at === antenato) return true;
	return false;
}

/** A piece of the marked text: of which element it is the innermost part, and whether it is one of its marks. */
type Pezzo = { t: string; di: Id; segno?: boolean };
const s = (t: string, di: Id): Pezzo => ({ t, di, segno: true });
const t = (text: string, di: Id): Pezzo => ({ t: text, di });

const SORGENTE: Record<Lingua, Pezzo[][]> = {
	html: [
		[s('<h1>', 'h1'), t('I Fuori Tempo', 'h1'), s('</h1>', 'h1')],
		[s('<p>', 'p'), t('Suoniamo ', 'p'), s('<em>', 'em'), t('rock', 'em'), s('</em>', 'em'), t(' dal 2024.', 'p'), s('</p>', 'p')],
		[s('<ul>', 'ul')],
		[t('  ', 'ul'), s('<li>', 'li1'), t('Sara, voce', 'li1'), s('</li>', 'li1')],
		[t('  ', 'ul'), s('<li>', 'li2'), t('Leo, batteria', 'li2'), s('</li>', 'li2')],
		[s('</ul>', 'ul')]
	],
	markdown: [[s('# ', 'h1'), t('I Fuori Tempo', 'h1')], [t(' ', 'body')], [t('Suoniamo ', 'p'), s('*', 'em'), t('rock', 'em'), s('*', 'em'), t(' dal 2024.', 'p')], [t(' ', 'body')], [s('- ', 'li1'), t('Sara, voce', 'li1')], [s('- ', 'li2'), t('Leo, batteria', 'li2')]]
};

const FRASI: Record<Lingua, Record<Id, string>> = {
	html: {
		body: "body è la radice dell'albero: contiene tutto quello che la pagina mostra. I suoi figli sono h1, p e ul, che nella pagina stanno uno sotto l'altro.",
		h1: 'Tra <h1> e </h1> c’è un titolo. Nell’albero h1 è figlio di body e contiene solo il suo testo; il browser lo scrive grande perché sa che è un titolo.',
		p: 'Tra <p> e </p> c’è un paragrafo. Dentro ha tre pezzi in fila: un testo, l’elemento em e un altro testo.',
		em: 'em sta dentro p: si apre e si chiude prima che p finisca. Dice che la parola rock è messa in evidenza, e il browser la scrive in corsivo.',
		ul: 'ul è un elenco. Di suo non contiene testo: ha solo due figli, gli elementi li, uno per ogni voce.',
		li1: 'Ogni voce dell’elenco è un elemento li dentro ul. Questa è la prima: il pallino davanti lo disegna il browser, nel testo marcato non c’è.',
		li2: 'La seconda voce è un altro li: ha lo stesso genitore del primo, ul, e viene dopo di lui.'
	},
	markdown: {
		body: 'In Markdown la radice non ha un segno: è tutto il testo. L’albero e la pagina sono gli stessi che escono dall’HTML.',
		h1: 'In Markdown il titolo è la riga che comincia con il cancelletto. Il segno è diverso, il nodo h1 dell’albero e il titolo nella pagina sono gli stessi.',
		p: 'Il paragrafo non ha un segno suo: è una riga di testo staccata dalle altre da una riga vuota.',
		em: 'I due asterischi attorno a rock fanno il lavoro di <em> e </em>: il primo apre la messa in evidenza, il secondo la chiude.',
		ul: 'Nemmeno l’elenco ha un segno suo: lo formano le righe che cominciano con il trattino, una dopo l’altra.',
		li1: 'Il trattino a inizio riga dice che la riga è una voce dell’elenco: in HTML la stessa voce sta tra <li> e </li>.',
		li2: 'Un’altra riga con il trattino, un’altra voce: nell’albero è il secondo li, figlio di ul.'
	}
};

/** A child in the tree: a tick from the line of its parent, which goes on down to the next child. */
const RAMO = 'relative pl-5 before:absolute before:top-[15px] before:left-0 before:h-px before:w-3.5 before:bg-edge-strong after:absolute after:top-0 after:left-0 after:w-px after:bg-edge-strong after:h-full last:after:h-[15px]';
const ARANCIONE = 'border-[oklch(0.64_var(--chroma)_var(--hue))]';

function Vista({ titolo, children, className }: { titolo: string; children: ReactNode; className?: string }) {
	return (
		<section className={cn('flex min-w-0 flex-col gap-1.5', className)}>
			<div className="label-mono text-fg-subtle">{titolo}</div>
			{children}
		</section>
	);
}

export default function MarkupTestoAlberoPagina({ alt }: { alt?: string }) {
	const [lingua, setLingua] = useState<Lingua>('html');
	const [scelto, setScelto] = useState<Id>('em');

	/** An element of the tree: a button with the name of the tag, and what it holds under it. */
	const nodo = (id: Id, figli: ReactNode = null, testo?: string) => (
		<div key={id} role="listitem" className={id === 'body' ? '' : RAMO}>
			<div className="flex min-h-[30px] items-center gap-2">
				<button
					type="button"
					onClick={() => setScelto(id)}
					aria-pressed={scelto === id}
					aria-label={`L'elemento ${TAG[id]}${testo ? `, con il testo ${testo}` : ''}`}
					data-nodo={id}
					className={cn(
						'cursor-pointer rounded-md border-[1.5px] px-2 py-0.5 font-mono text-[13px] leading-5 font-semibold focus-ring motion-safe:transition-colors motion-safe:duration-150',
						scelto === id ? `${ARANCIONE} bg-[oklch(0.75_var(--chroma)_var(--hue))] text-ink-950` : sta(id, scelto) ? `${ARANCIONE} bg-tint-soft text-fg-strong` : 'border-edge-strong bg-surface text-fg-strong shadow-paper hover:border-tint'
					)}
				>
					{TAG[id]}
				</button>
				{testo && <Foglia testo={testo} dentro={sta(id, scelto)} />}
			</div>
			{figli && <div role="list" className={id === 'body' ? 'ml-3' : 'ml-3'}>{figli}</div>}
		</div>
	);
	const foglia = (key: string, testo: string, di: Id) => (
		<div key={key} role="listitem" className={RAMO}>
			<div className="flex min-h-[30px] items-center">
				<Foglia testo={testo} dentro={sta(di, scelto)} />
			</div>
		</div>
	);
	/** A part of the page: it takes the choice on a click, and shows it. */
	const parte = (id: Id) => ({
		onClick: (e: { stopPropagation: () => void }) => {
			e.stopPropagation();
			setScelto(id);
		},
		'data-parte': id,
		className: cn('cursor-pointer rounded-[3px] outline-offset-2 motion-safe:transition-[background-color] motion-safe:duration-150', scelto === id && 'bg-tint-soft outline-2 outline-[oklch(0.64_var(--chroma)_var(--hue))]')
	});

	return (
		<Figura>
			<ToggleGroup
				label="Il linguaggio in cui è marcato il testo"
				compact
				value={lingua}
				onChange={setLingua}
				options={[
					{ value: 'html', label: 'HTML' },
					{ value: 'markdown', label: 'Markdown' }
				]}
			/>
			<div className="grid w-full max-w-2xl gap-x-6 gap-y-4 sm:grid-cols-2" role="group" aria-label={alt ?? 'Lo stesso testo come testo marcato, come albero e come pagina'}>
				<Vista titolo="Il testo marcato">
					<pre className="m-0 overflow-x-auto rounded-lg border border-edge bg-surface-2 px-3 py-2.5 font-mono text-[12.5px] leading-[22px] text-fg-strong" data-sorgente>
						{SORGENTE[lingua].map((riga, r) => (
							<div key={r} className="whitespace-pre">
								{riga.map((pezzo, k) => {
									const dentro = sta(pezzo.di, scelto);
									const suo = pezzo.segno && pezzo.di === scelto;
									return (
										<span key={k} onClick={pezzo.t.trim() ? () => setScelto(pezzo.di) : undefined} className={cn('py-[3px]', pezzo.t.trim() && 'cursor-pointer', suo ? 'bg-[oklch(0.75_var(--chroma)_var(--hue))] font-semibold text-ink-950' : dentro ? 'bg-tint-soft' : '', !suo && pezzo.segno && 'text-tint-fg')}>
											{pezzo.t}
										</span>
									);
								})}
							</div>
						))}
					</pre>
				</Vista>
				<Vista titolo="L'albero" className="sm:row-span-2">
					<div role="list" data-albero>
						{nodo(
							'body',
							<>
								{nodo('h1', null, 'I Fuori Tempo')}
								{nodo(
									'p',
									<>
										{foglia('a', 'Suoniamo ', 'p')}
										{nodo('em', null, 'rock')}
										{foglia('b', ' dal 2024.', 'p')}
									</>
								)}
								{nodo(
									'ul',
									<>
										{nodo('li1', null, 'Sara, voce')}
										{nodo('li2', null, 'Leo, batteria')}
									</>
								)}
							</>
						)}
					</div>
				</Vista>
				<Vista titolo="La pagina">
					<div {...parte('body')} className={cn('flex flex-col gap-2 rounded-lg border border-edge-strong bg-surface px-4 py-3 text-fg-strong shadow-paper', parte('body').className)} style={{ fontFamily: 'Georgia, "Times New Roman", serif' }} data-pagina>
						<div {...parte('h1')} className={cn('text-[22px] leading-tight font-bold', parte('h1').className)}>
							I Fuori Tempo
						</div>
						<div {...parte('p')} className={cn('text-[15px] leading-snug', parte('p').className)}>
							Suoniamo{' '}
							<span {...parte('em')} className={cn('italic', parte('em').className)}>
								rock
							</span>{' '}
							dal 2024.
						</div>
						<div {...parte('ul')} className={cn('flex flex-col gap-0.5 pl-1 text-[15px] leading-snug', parte('ul').className)}>
							{(['li1', 'li2'] as const).map((id) => (
								<div key={id} {...parte(id)} className={cn('flex gap-2', parte(id).className)}>
									<span aria-hidden="true">•</span>
									{id === 'li1' ? 'Sara, voce' : 'Leo, batteria'}
								</div>
							))}
						</div>
					</div>
				</Vista>
			</div>
			<Frase tutte={[...Object.values(FRASI.html), ...Object.values(FRASI.markdown)]}>{FRASI[lingua][scelto]}</Frase>
		</Figura>
	);
}

/** A text of the tree: what an element holds that is not another element. */
function Foglia({ testo, dentro }: { testo: string; dentro: boolean }) {
	return <span className={cn('rounded-[3px] px-1 font-mono text-[12.5px] leading-5 whitespace-pre', dentro ? 'bg-tint-soft text-fg-strong' : 'text-fg-muted')}>“{testo}”</span>;
}
