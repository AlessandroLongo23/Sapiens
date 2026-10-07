'use client';

import { useState, type ReactNode } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { cn } from '@/lib/utils/cn';
import { dentro, disponi, figliDi, leggi, testoDi, type Lettura, type Nodo } from '@/lib/informatica/albero-documento';
import { Titolino } from './listato';
import { ComandiPassi, Figura, Frase, Legenda, usePassi, type Passi } from '../informatica';

/**
 * "Come fa il browser a ricavare un albero da un file scritto in fila, e che albero esce quando un tag non viene
 * chiuso?" The file of a small page, the tree of its elements and the page as boxes one inside the other. The
 * figure opens on the finished tree: the student touches an element in any of the three and finds it in the other
 * two. "Esegui" reads the file again one line at a time: a start tag adds a child to the last element still open,
 * an end tag goes back to the parent. The choice at the top takes `</h2>` away, and the paragraph that follows ends
 * up inside the heading.
 *
 * The reading is src/lib/informatica/albero-documento.ts, a pure function with its tests.
 */
const GIUSTO = [
	'<html lang="it">',
	'  <head>',
	'    <title>I Fuori Tempo</title>',
	'  </head>',
	'  <body>',
	'    <header>',
	'      <h1>I Fuori Tempo</h1>',
	'    </header>',
	'    <main>',
	'      <h2>Chi siamo</h2>',
	'      <p>Suoniamo dal 2024.</p>',
	'    </main>',
	'    <footer>Pagina della 3B</footer>',
	'  </body>',
	'</html>'
];
type File = 'giusto' | 'rotto';
const RIGHE: Record<File, string[]> = { giusto: GIUSTO, rotto: GIUSTO.map((riga) => riga.replace('Chi siamo</h2>', 'Chi siamo')) };
const LETTURE: Record<File, Lettura> = { giusto: leggi(RIGHE.giusto), rotto: leggi(RIGHE.rotto) };
const DISEGNI = { giusto: disponi(LETTURE.giusto.nodi), rotto: disponi(LETTURE.rotto.nodi) };
/** The tree keeps the height of the deeper of the two. */
const LIVELLI = Math.max(DISEGNI.giusto.livelli, DISEGNI.rotto.livelli);

const APERTURA: Record<File, string> = {
	giusto: 'Questo è l’albero che il browser ricava dal file. Tocca un elemento nel file, nell’albero o nella pagina per ritrovarlo negli altri due; con Esegui lo vedi nascere una riga alla volta.',
	rotto: 'In questo file alla riga 10 manca </h2>. Nell’albero p è finito dentro h2, e nella pagina il paragrafo è scritto come un titolo. Premi Esegui e guarda a quale riga succede.'
};

const elenco = (nomi: string[]) => (nomi.length < 2 ? nomi.join('') : `${nomi.slice(0, -1).join(', ')} e ${nomi[nomi.length - 1]}`);
const QUANTI = ['', 'un figlio', 'due figli', 'tre figli', 'quattro figli', 'cinque figli'];

/** What an element is in the tree, in the file and in the page. */
function descrivi(nodi: readonly Nodo[], id: number): string {
	const nodo = nodi[id];
	const figli = figliDi(nodo).map((f) => nodi[f].tag);
	const fratelli = nodo.genitore === null ? [] : figliDi(nodi[nodo.genitore]).filter((f) => f !== id).map((f) => nodi[f].tag);
	const famiglia = nodo.genitore === null ? `${nodo.tag} è la radice dell’albero: non ha un genitore.` : `${nodo.tag} è figlio di ${nodi[nodo.genitore].tag}${fratelli.length ? ` e fratello di ${elenco(fratelli)}` : ''}.`;
	const suoi = figli.length ? ` Ha ${QUANTI[figli.length] ?? `${figli.length} figli`}: ${elenco(figli)}.` : ' Non ha figli: contiene solo il suo testo.';
	const pagina =
		nodo.tag === 'html'
			? ' Nella pagina è tutto quello che vedi, scheda compresa.'
			: nodo.tag === 'head'
				? ' Nella finestra non ha un riquadro: quello che contiene non viene disegnato.'
				: nodo.tag === 'title'
					? ' Nella finestra non ha un riquadro: il suo testo è il nome sulla scheda.'
					: figli.length
						? ' Nella pagina il suo riquadro contiene quelli dei figli.'
						: '';
	const chiusura = nodo.chiuso === 'browser' ? ` Nel file manca </${nodo.tag}>: lo ha chiuso il browser alla riga ${nodo.fine + 1}.` : '';
	return famiglia + suoi + pagina + chiusura;
}

const TUTTE = (['giusto', 'rotto'] as const).flatMap((file) => [APERTURA[file], ...LETTURE[file].passi.map((p) => p.frase), ...LETTURE[file].nodi.map((n) => descrivi(LETTURE[file].nodi, n.id))]);

const ARANCIONE = 'border-[oklch(0.64_var(--chroma)_var(--hue))]';
const SCELTO = `${ARANCIONE} bg-[oklch(0.75_var(--chroma)_var(--hue))] text-ink-950`;
const DENTRO = `${ARANCIONE} bg-tint-soft text-fg-strong`;

const LIVELLO = 40; // px between two levels of the tree
const NODO = 26; // px, the height of a node

function Vista({ titolo, children }: { titolo: string; children: ReactNode }) {
	return (
		<section className="flex min-w-0 flex-col gap-1.5">
			<Titolino>{titolo}</Titolino>
			{children}
		</section>
	);
}

/** How the text of an element is written by a browser with no style sheet: sizes in em, so a paragraph inside a heading is written as the heading. */
const SCRITTURA: Record<string, string> = { h1: 'text-[1.4em] leading-tight font-bold', h2: 'text-[1.2em] leading-tight font-bold' };

export default function AlberoDocumento({ alt }: { alt?: string }) {
	const [file, setFile] = useState<File>('giusto');
	// the figure opens on the finished tree; the steps start when a command is used
	const [partito, setPartito] = useState(false);
	const [toccato, setToccato] = useState<{ id: number; passo: number } | null>(null);
	const { nodi, passi: lista } = LETTURE[file];
	const disegno = DISEGNI[file];
	const righe = RIGHE[file];
	const veri = usePassi(lista.length, { ritmo: 1900 });
	const ultimo = lista.length - 1;
	const quale = partito ? veri.passo : ultimo;
	const passo = lista[quale];
	const via = <T extends unknown[]>(fa: (...args: T) => void) => (...args: T) => {
		setPartito(true);
		fa(...args);
	};
	const passi: Passi = partito ? veri : { ...veri, passo: ultimo, inizio: false, fine: true, inCorso: false, esegui: via(veri.esegui), ricomincia: via(veri.ricomincia), indietro: via(() => veri.vai(ultimo - 1)), vai: via(veri.vai), avanti: () => {} };

	const scelto = toccato && toccato.passo === quale && toccato.id < passo.nati ? toccato.id : passo.corrente;
	const tocca = (id: number) => setToccato({ id, passo: quale });
	const nato = (id: number) => id < passo.nati;
	const aperto = (id: number) => passo.aperti.includes(id);
	const stato = (id: number) => (scelto === null ? '' : id === scelto ? SCELTO : dentro(nodi, id, scelto) ? DENTRO : '');
	/** The lines read so far: all of them once the reading is over. */
	const letta = (riga: number) => passo.riga === null ? quale > 0 : riga <= passo.riga;
	/** The element a line of the file is about: the one it opens, or the one its end tag closes. */
	const diRiga = (riga: number) => nodi.find((n) => n.riga === riga) ?? nodi.find((n) => n.fine === riga && n.chiuso === 'tag');

	const frase = toccato && scelto === toccato.id && toccato.passo === quale ? descrivi(nodi, scelto) : partito ? passo.frase : APERTURA[file];
	const body = nodi.find((n) => n.tag === 'body');
	const title = nodi.find((n) => n.tag === 'title');
	const head = nodi.find((n) => n.tag === 'head');

	/** An element of the body as the box it takes in the page, with the boxes of its children inside. */
	const scatola = (id: number): ReactNode => {
		const nodo = nodi[id];
		return (
			<div
				key={id}
				onClick={(e) => {
					e.stopPropagation();
					if (nato(id)) tocca(id);
				}}
				data-scatola={nodo.tag}
				className={cn(
					'relative flex cursor-pointer flex-col gap-1 rounded-[5px] border border-dashed px-1.5 pt-[14px] pb-1 motion-safe:transition-[background-color,border-color] motion-safe:duration-150',
					SCRITTURA[nodo.tag],
					!nato(id) && 'invisible',
					id === scelto ? `${SCELTO} border-solid` : scelto !== null && dentro(nodi, id, scelto) ? `${ARANCIONE} bg-tint-soft` : 'border-edge-strong'
				)}
			>
				<span aria-hidden="true" className={cn('pointer-events-none absolute top-0 left-1.5 font-mono text-[10px] leading-[14px] font-normal', id === scelto ? 'text-ink-950' : 'text-fg-subtle')}>
					{nodo.tag}
				</span>
				{nodo.contenuto.map((c, k) => (typeof c === 'number' ? scatola(c) : <span key={`t${k}`}>{c}</span>))}
			</div>
		);
	};

	return (
		<Figura>
			<ToggleGroup
				label="Il file"
				compact
				value={file}
				onChange={(value) => {
					setFile(value);
					setPartito(false);
					setToccato(null);
					veri.ricomincia();
				}}
				options={[
					{ value: 'giusto', label: 'Scritto bene' },
					{ value: 'rotto', label: 'Senza </h2>' }
				]}
			/>
			<div className="grid w-full max-w-3xl gap-x-6 gap-y-4 sm:grid-cols-2" role="group" aria-label={alt ?? 'Il file di una pagina, l’albero dei suoi elementi e la pagina'}>
				<Vista titolo="Il file">
					<div className="overflow-x-auto rounded-lg border border-edge bg-surface-2 py-1.5 font-mono text-[11.5px] leading-[18px]" data-file>
						{righe.map((testo, riga) => {
							const nodo = diRiga(riga);
							const sua = nodo && scelto !== null && nodo.id === scelto;
							const interna = scelto !== null && nato(scelto) && riga >= nodi[scelto].riga && riga <= nodi[scelto].fine;
							const ora = passo.riga === riga;
							return (
								<button
									key={riga}
									type="button"
									disabled={!nodo || !letta(riga)}
									onClick={() => nodo && tocca(nodo.id)}
									aria-label={`Riga ${riga + 1}: ${testo.trim()}`}
									aria-pressed={!!sua}
									data-riga={ora ? 'ora' : letta(riga) ? 'letta' : 'da leggere'}
									className={cn(
										'flex w-full min-w-max cursor-pointer items-baseline border-0 border-l-[3px] p-0 pr-2 text-left whitespace-pre focus-ring disabled:cursor-default motion-safe:transition-[background-color,border-color,color] motion-safe:duration-150',
										sua ? `${SCELTO} font-medium` : interna ? `${ARANCIONE} bg-tint-soft text-fg-strong` : 'border-transparent bg-transparent',
										!sua && !interna && (letta(riga) ? 'text-fg-strong' : 'text-fg-faint')
									)}
								>
									<span aria-hidden="true" className={cn('w-7 shrink-0 pr-2 text-right text-[10px] tabular-nums', ora ? 'font-semibold text-tint-fg' : 'text-fg-faint')}>
										{ora ? '▸' : riga + 1}
									</span>
									{testo}
								</button>
							);
						})}
					</div>
					<p className="m-0 flex min-h-6 flex-wrap items-center gap-x-1 gap-y-0.5 text-xs text-fg-muted" data-aperti>
						<span>Ancora aperti:</span>
						{passo.aperti.length ? (
							passo.aperti.map((id, k) => (
								<span key={id} className="inline-flex items-center gap-1 font-mono font-medium text-fg-strong">
									{k > 0 && <span aria-hidden="true" className="font-sans font-normal text-fg-faint">›</span>}
									{nodi[id].tag}
								</span>
							))
						) : (
							<span>nessuno</span>
						)}
					</p>
				</Vista>
				<div className="flex min-w-0 flex-col gap-4">
					<Vista titolo="L'albero">
						<div className="relative w-full" style={{ height: (LIVELLI - 1) * LIVELLO + NODO }} data-albero>
							<svg aria-hidden="true" className="absolute inset-0 size-full overflow-visible" viewBox={`0 0 ${disegno.foglie} ${(LIVELLI - 1) * LIVELLO + NODO}`} preserveAspectRatio="none">
								{nodi.map(
									(nodo) =>
										nodo.genitore !== null &&
										nato(nodo.id) && (
											<line
												key={nodo.id}
												x1={disegno.x[nodo.genitore] + 0.5}
												y1={disegno.y[nodo.genitore] * LIVELLO + NODO}
												x2={disegno.x[nodo.id] + 0.5}
												y2={disegno.y[nodo.id] * LIVELLO}
												vectorEffect="non-scaling-stroke"
												strokeWidth={1.5}
												className={scelto !== null && dentro(nodi, nodo.id, scelto) && nodo.id !== scelto ? 'stroke-[oklch(0.64_var(--chroma)_var(--hue))]' : 'stroke-edge-strong'}
											/>
										)
								)}
							</svg>
							{nodi.map(
								(nodo) =>
									nato(nodo.id) && (
										<button
											key={nodo.id}
											type="button"
											onClick={() => tocca(nodo.id)}
											aria-pressed={scelto === nodo.id}
											aria-label={`L'elemento ${nodo.tag}${testoDi(nodo) ? `, con il testo ${testoDi(nodo)}` : ''}${nodo.genitore === null ? ', la radice' : `, figlio di ${nodi[nodo.genitore].tag}`}`}
											data-nodo={nodo.tag}
											data-aperto={aperto(nodo.id) || undefined}
											className={cn(
												'absolute flex -translate-x-1/2 cursor-pointer items-center justify-center rounded-md border-[1.5px] px-[7px] font-mono text-xs font-semibold focus-ring motion-safe:transition-colors motion-safe:duration-150',
												stato(nodo.id) || (aperto(nodo.id) ? `${ARANCIONE} bg-surface text-fg-strong` : 'border-edge-strong bg-surface text-fg-strong shadow-paper hover:border-tint')
											)}
											style={{ left: `${((disegno.x[nodo.id] + 0.5) / disegno.foglie) * 100}%`, top: disegno.y[nodo.id] * LIVELLO, height: NODO }}
										>
											{nodo.tag}
										</button>
									)
							)}
						</div>
					</Vista>
					<Vista titolo="La pagina">
						<div className={cn('overflow-hidden rounded-lg border border-edge-strong bg-surface shadow-paper', scelto !== null && nodi[scelto].tag === 'html' && ARANCIONE)} data-pagina>
							<div className="flex items-end border-b border-edge bg-surface-2 px-2 pt-1.5">
								<span
									onClick={() => title && nato(title.id) && tocca(title.id)}
									className={cn(
										'cursor-pointer rounded-t-md border border-b-0 px-2.5 py-0.5 text-[11px] leading-5 motion-safe:transition-colors motion-safe:duration-150',
										title && nato(title.id) ? 'text-fg-strong' : 'text-transparent',
										title && scelto === title.id ? SCELTO : head && scelto !== null && title && dentro(nodi, title.id, scelto) ? DENTRO : 'border-edge bg-surface'
									)}
									data-scheda
								>
									{title ? testoDi(title) : ''}
								</span>
							</div>
							<div className="p-2 text-[13px] leading-snug text-fg-strong" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
								{body && scatola(body.id)}
							</div>
						</div>
					</Vista>
				</div>
			</div>
			<Legenda stati={{ scambio: 'elemento scelto', esame: 'quello che contiene' }} />
			<Frase tutte={TUTTE}>{frase}</Frase>
			<ComandiPassi passi={passi} />
		</Figura>
	);
}
