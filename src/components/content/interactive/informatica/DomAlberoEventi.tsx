'use client';

import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { ComandiPassi, Figura, Frase, Legenda } from '../informatica';
import { usePassiAvvio } from './passi-avvio';

/**
 * "Quando premo un bottone, quale nodo del DOM riceve l'evento e quale nodo viene cambiato?" A small page on the
 * left, its DOM as a tree on the right. A click on a button of the page starts the path, one step at a time: the
 * event is born on the node of the button, the browser calls the function that listens there, the function changes
 * another node (a class of the list, the text of the counter), and the browser draws the page again from the tree.
 *
 * The tree is drawn as in MarkupTestoAlberoPagina.tsx (lesson 87): an outline, a tick from the line of the parent.
 */

type Azione = 'mostra' | 'vota';
/** What the page is: the list is shown or not, and how many votes there are. */
type Pagina = { aperta: boolean; voti: number };

const dopo = (p: Pagina, azione: Azione): Pagina => (azione === 'mostra' ? { ...p, aperta: !p.aperta } : { ...p, voti: p.voti + 1 });

const FERMA = 'La pagina è ferma. Lo script è finito da un pezzo: ha registrato la funzione mostra sul primo bottone e vota sul secondo, e adesso aspetta. Premi un bottone nella pagina.';

function frasi(azione: Azione, prima: Pagina): string[] {
	if (azione === 'mostra')
		return [
			FERMA,
			'Clic su «Mostra la scaletta». Il browser crea un evento click sul nodo su cui è successo: button #mostra.',
			'Su quel nodo è registrato un ascoltatore per click: il browser chiama la funzione mostra.',
			prima.aperta
				? 'La funzione mostra esegue scaletta.classList.toggle("nascosto"): la classe non c’era, e il nodo ul la riceve. Il nodo del bottone non è cambiato.'
				: 'La funzione mostra esegue scaletta.classList.toggle("nascosto"): la classe c’era, e il nodo ul la perde. Il nodo del bottone non è cambiato.',
			prima.aperta ? 'Il browser ridisegna la pagina guardando il DOM: la scaletta non si vede più. Il file HTML è rimasto com’era.' : 'Il browser ridisegna la pagina guardando il DOM: ora la scaletta si vede. Il file HTML è rimasto com’era.'
		];
	return [
		FERMA,
		'Clic su «Mi piace». Il browser crea un evento click sul nodo su cui è successo: button #vota.',
		'Su quel nodo è registrato un ascoltatore per click: il browser chiama la funzione vota.',
		`La funzione vota aumenta la variabile quanti e scrive ${prima.voti + 1} in voti.textContent: cambia il testo del nodo span. Il nodo del bottone non è cambiato.`,
		`Il browser ridisegna la pagina guardando il DOM: accanto al bottone ora c’è ${prima.voti + 1}.`
	];
}

const RAMO = 'relative pl-5 before:absolute before:top-[15px] before:left-0 before:h-px before:w-3.5 before:bg-edge-strong after:absolute after:top-0 after:left-0 after:w-px after:bg-edge-strong after:h-full last:after:h-[15px]';
const ARANCIONE = 'border-[oklch(0.64_var(--chroma)_var(--hue))]';
/** A node at rest, the node the event is born on, the node a function is changing: the states of the cells of the kit. */
const NODO = {
	fermo: 'border-edge-strong bg-surface text-fg-strong shadow-paper',
	evento: `${ARANCIONE} bg-tint-soft text-fg-strong ring-[3px] ring-tint/20`,
	cambiato: `${ARANCIONE} bg-[oklch(0.75_var(--chroma)_var(--hue))] text-ink-950`
} as const;

function Nodo({ tag, nome, stato = 'fermo', children, figli }: { tag: string; nome?: string; stato?: keyof typeof NODO; children?: ReactNode; figli?: ReactNode }) {
	return (
		<div role="listitem" className={tag === 'body' ? '' : RAMO}>
			<div className="flex min-h-[30px] flex-wrap items-center gap-x-2 gap-y-0.5">
				<span data-nodo={nome ?? tag} data-stato={stato} className={cn('rounded-md border-[1.5px] px-2 py-0.5 font-mono text-[13px] leading-5 font-semibold whitespace-nowrap motion-safe:transition-colors motion-safe:duration-200', NODO[stato])}>
					{tag}
					{nome && <span className={cn('ml-1 font-medium', stato === 'cambiato' ? 'text-ink-950' : 'text-tint-fg')}>{nome}</span>}
				</span>
				{children}
			</div>
			{figli && (
				<div role="list" className="ml-3">
					{figli}
				</div>
			)}
		</div>
	);
}

/** What a node holds, said beside it: its text, or one of its attributes. */
const Testo = ({ children, acceso = false }: { children: ReactNode; acceso?: boolean }) => <span className={cn('font-mono text-xs whitespace-nowrap motion-safe:transition-colors motion-safe:duration-200', acceso ? 'font-semibold text-fg-strong' : 'text-fg-muted')}>{children}</span>;

/** The function registered on a node, lit while the browser calls it. */
function Ascoltatore({ funzione, chiamato }: { funzione: string; chiamato: boolean }) {
	return (
		<span data-ascoltatore={funzione} className={cn('rounded-full border-[1.5px] border-dashed px-2 py-px font-mono text-[11px] leading-5 whitespace-nowrap motion-safe:transition-colors motion-safe:duration-200', chiamato ? `${ARANCIONE} border-solid bg-tint-soft font-semibold text-fg-strong ring-[3px] ring-tint/20` : 'border-edge-strong text-fg-muted')}>
			click → {funzione}
		</span>
	);
}

const TITOLO = 'label-mono mb-1.5 text-fg-subtle';

export default function DomAlberoEventi() {
	const [ferma, setFerma] = useState<Pagina>({ aperta: false, voti: 0 });
	const [azione, setAzione] = useState<Azione>('mostra');
	const passi = usePassiAvvio(5, { ritmo: 1900 });
	const p = passi.passo;
	// the tree changes when the function runs (step 3), the page is drawn again a step later
	const dom = p >= 3 ? dopo(ferma, azione) : ferma;
	const pagina = p >= 4 ? dopo(ferma, azione) : ferma;
	const lista = frasi(azione, ferma);

	const premi = (nuova: Azione) => {
		// what the click before did stays done, also when this one comes before its path is over
		setFerma(p >= 1 ? dopo(ferma, azione) : ferma);
		setAzione(nuova);
		passi.parti(1);
	};
	const stato = (bottone: Azione, bersaglio: boolean) => (azione !== bottone ? 'fermo' : bersaglio ? (p >= 3 ? 'cambiato' : 'fermo') : p === 1 || p === 2 ? 'evento' : 'fermo');
	const ridisegnata = p === 4;

	return (
		<Figura>
			<div className="grid w-full max-w-2xl gap-x-6 gap-y-4 sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
				<section className="min-w-0">
					<div className={TITOLO}>La pagina: premi un bottone</div>
					<div className="flex min-h-[214px] flex-col items-start gap-2.5 rounded-xl border border-edge-strong bg-surface px-4 py-3.5 shadow-paper" data-pagina>
						<div className="text-lg leading-tight font-bold text-fg-strong">I Fuori Tempo</div>
						<Button variant="secondary" size="sm" onClick={() => premi('mostra')} className={cn(azione === 'mostra' && (p === 1 || p === 2) && 'ring-[3px] ring-tint/30')}>
							Mostra la scaletta
						</Button>
						{pagina.aperta && (
							<div role="list" className={cn('flex flex-col gap-0.5 rounded-md px-2 py-0.5 text-sm text-fg motion-safe:animate-drop-in', ridisegnata && azione === 'mostra' && 'bg-tint-soft')} data-scaletta>
								<div role="listitem">• Controtempo</div>
								<div role="listitem">• Fuori orario</div>
							</div>
						)}
						<div className="mt-auto flex items-center gap-2.5">
							<Button variant="secondary" size="sm" onClick={() => premi('vota')} className={cn(azione === 'vota' && (p === 1 || p === 2) && 'ring-[3px] ring-tint/30')}>
								Mi piace
							</Button>
							<span className={cn('rounded-md px-1.5 font-mono text-base font-semibold text-fg-strong tabular-nums motion-safe:transition-colors motion-safe:duration-200', ridisegnata && azione === 'vota' && 'bg-tint-soft')} data-voti>
								{pagina.voti}
							</span>
						</div>
					</div>
				</section>
				<section className="min-w-0">
					<div className={TITOLO}>Il DOM</div>
					<div role="list" aria-label={`L'albero del DOM. body contiene: h1; button mostra, con l'ascoltatore mostra; ul scaletta, ${dom.aperta ? 'senza classi' : 'con la classe nascosto'}, con due li; button vota, con l'ascoltatore vota; span voti, con il testo ${dom.voti}.`} data-albero>
						<Nodo
							tag="body"
							figli={
								<>
									<Nodo tag="h1">
										<Testo>«I Fuori Tempo»</Testo>
									</Nodo>
									<Nodo tag="button" nome="#mostra" stato={stato('mostra', false)}>
										<Ascoltatore funzione="mostra" chiamato={azione === 'mostra' && p === 2} />
									</Nodo>
									<Nodo
										tag="ul"
										nome="#scaletta"
										stato={stato('mostra', true)}
										figli={
											<>
												<Nodo tag="li">
													<Testo>«Controtempo»</Testo>
												</Nodo>
												<Nodo tag="li">
													<Testo>«Fuori orario»</Testo>
												</Nodo>
											</>
										}
									>
										<Testo acceso={azione === 'mostra' && p >= 3}>class=&quot;{dom.aperta ? '' : 'nascosto'}&quot;</Testo>
									</Nodo>
									<Nodo tag="button" nome="#vota" stato={stato('vota', false)}>
										<Ascoltatore funzione="vota" chiamato={azione === 'vota' && p === 2} />
									</Nodo>
									<Nodo tag="span" nome="#voti" stato={stato('vota', true)}>
										<Testo acceso={azione === 'vota' && p >= 3}>«{dom.voti}»</Testo>
									</Nodo>
								</>
							}
						/>
					</div>
				</section>
			</div>
			<Legenda stati={{ esame: 'riceve l’evento', scambio: 'viene cambiato' }} />
			<Frase tutte={[...frasi('mostra', { aperta: true, voti: 0 }), ...frasi('mostra', { aperta: false, voti: 0 }), ...frasi('vota', { aperta: false, voti: 0 })]}>{lista[p]}</Frase>
			<ComandiPassi passi={passi} />
		</Figura>
	);
}
