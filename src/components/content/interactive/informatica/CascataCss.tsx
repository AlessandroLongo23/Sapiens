'use client';

import { useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { cascata, type Esito, type Nodo } from '@/lib/informatica/css';
import { Caption } from '../kit';
import { Figura } from '../informatica';

/**
 * "Cinque regole danno cinque colori allo stesso paragrafo: quale vince, e che cosa cambia togliendone una o
 * scambiandone due di posto?" The student switches the rules off one at a time and moves them up and down the style
 * sheet; the paragraph takes the colour of the winner, and each rule says whether it wins, loses, or only reaches
 * the paragraph by inheritance, with its weight (ids, classes, element names) beside it.
 */
const PERCORSO: Nodo[] = [{ tag: 'body' }, { tag: 'main' }, { tag: 'p', id: 'avviso', classi: ['nota'] }];

type Riga = { nome: string; selettore: string; valore: string };
const REGOLE: Riga[] = [
	{ nome: 'main', selettore: 'main', valore: 'gray' },
	{ nome: 'p-primo', selettore: 'p', valore: 'navy' },
	{ nome: 'nota', selettore: '.nota', valore: 'teal' },
	{ nome: 'avviso', selettore: '#avviso', valore: 'crimson' },
	{ nome: 'p-secondo', selettore: 'p', valore: 'purple' }
];
/** The colours of the page, which is white in both themes: they are its content, as the pixels of a picture are. */
const COLORE: Record<string, string> = { gray: '#808080', navy: '#000080', teal: '#008080', crimson: '#dc143c', purple: '#800080', black: '#000000' };

const ETICHETTA: Record<Esito | 'spenta', string> = { vince: 'vince', battuta: 'battuta', ereditata: 'ereditata', 'non lo prende': 'non prende il paragrafo', spenta: 'spenta' };

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

export default function CascataCss({ alt }: { alt?: string }) {
	const [ordine, setOrdine] = useState(() => REGOLE.map((r) => r.nome));
	const [spente, setSpente] = useState<readonly string[]>([]);
	const righe = ordine.map((nome) => REGOLE.find((r) => r.nome === nome)!);
	const accese = righe.filter((r) => !spente.includes(r.nome));
	const esito = cascata(accese, PERCORSO);
	const vincente = esito.vince >= 0 ? accese[esito.vince] : null;
	const colore = vincente?.valore ?? 'black';
	const statoDi = (riga: Riga): Esito | 'spenta' => (spente.includes(riga.nome) ? 'spenta' : esito.esiti[accese.indexOf(riga)]);

	let frase: string;
	if (!vincente) frase = 'Nessuna regola dà un colore al paragrafo, e nessuna lo dà a un elemento che lo contiene: resta il nero del foglio di stile del browser.';
	else if (esito.ereditata) frase = `Nessuna regola prende il paragrafo. Il colore \`${vincente.valore}\` gli arriva da \`main\`, l’elemento che lo contiene: lo eredita.`;
	else {
		const dirette = accese.filter((_, i) => esito.esiti[i] === 'vince' || esito.esiti[i] === 'battuta');
		const pari = dirette.filter((r) => r !== vincente && r.selettore === vincente.selettore);
		if (dirette.length === 1) frase = `\`${vincente.selettore}\` è la sola regola che prende il paragrafo: il colore è \`${vincente.valore}\`.${accese.some((r) => r.selettore === 'main') ? ' Quello di `main` sarebbe solo ereditato, e una regola sull’elemento lo batte sempre.' : ''}`;
		else if (vincente.selettore === '#avviso') frase = 'Vince `#avviso`: un id pesa più di qualunque classe e di qualunque nome di elemento, dovunque sia scritta la regola.';
		else if (vincente.selettore === '.nota') frase = 'Vince `.nota`: una classe pesa più di un nome di elemento, anche se una regola con `p` è scritta più in basso.';
		else if (pari.length) frase = `Le due regole con \`p\` pesano uguale: vince quella scritta per ultima, cioè \`${vincente.valore}\`. Scambiale di posto e il colore cambia.`;
		else frase = `Vince \`${vincente.selettore}\`, con il colore \`${vincente.valore}\`.`;
	}

	const sposta = (i: number, di: -1 | 1) => {
		const j = i + di;
		if (j < 0 || j >= ordine.length) return;
		const nuovo = [...ordine];
		[nuovo[i], nuovo[j]] = [nuovo[j], nuovo[i]];
		setOrdine(nuovo);
	};
	const cambiato = spente.length > 0 || ordine.some((nome, i) => nome !== REGOLE[i].nome);

	return (
		<Figura>
			{/* the page: white paper in both themes, with the paragraph in the colour that wins */}
			<div className="w-full max-w-md overflow-hidden rounded-xl border border-edge-strong shadow-paper" data-pagina>
				<div className="border-b border-edge bg-surface-2 px-3 py-1.5 font-mono text-[11.5px] leading-5 text-fg-muted">
					&lt;main&gt; &lt;p id=&quot;avviso&quot; class=&quot;nota&quot;&gt;
				</div>
				<div className="bg-white px-3 py-3" role="img" aria-label={`${alt ?? 'Il paragrafo della pagina'}: il testo è di colore ${colore}.`}>
					<div className="text-[15px] leading-snug font-medium motion-safe:transition-colors motion-safe:duration-200" style={{ color: COLORE[colore] }} data-colore={colore}>
						Ingresso libero fino a esaurimento dei posti.
					</div>
				</div>
			</div>

			<div role="list" className="flex w-full max-w-md flex-col gap-1.5" aria-label="Le regole del foglio di stile, nell’ordine in cui sono scritte">
				{righe.map((riga, i) => {
					const stato = statoDi(riga);
					const accesa = stato !== 'spenta';
					const peso = accesa ? esito.pesi[accese.indexOf(riga)] : null;
					const testo = `${riga.selettore} { color: ${riga.valore}; }`;
					return (
						<div
							key={riga.nome}
							role="listitem"
							data-regola={riga.nome}
							data-esito={stato}
							className={cn(
								'flex items-center gap-1 rounded-lg border-[1.5px] py-1.5 pr-1 pl-2.5 motion-safe:transition-[background-color,border-color] motion-safe:duration-200',
								stato === 'vince' && 'border-ok/45 bg-ok-soft',
								stato === 'ereditata' && 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft',
								(stato === 'battuta' || stato === 'non lo prende') && 'border-edge-strong bg-surface',
								stato === 'spenta' && 'border-dashed border-edge bg-transparent'
							)}
						>
							<button type="button" role="checkbox" aria-checked={accesa} aria-label={`La regola ${testo}: ${ETICHETTA[stato]}`} onClick={() => setSpente(accesa ? [...spente, riga.nome] : spente.filter((n) => n !== riga.nome))} className="flex min-w-0 flex-1 cursor-pointer items-start gap-2.5 rounded-md text-left focus-ring">
								<span aria-hidden="true" className={cn('mt-px flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px]', accesa ? 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-[oklch(0.75_var(--chroma)_var(--hue))] text-ink-950' : 'border-edge-strong bg-surface')}>
									{accesa && <Check className="size-3" strokeWidth={3.5} />}
								</span>
								<span className="flex min-w-0 flex-col gap-0.5">
									<span className={cn('flex items-center gap-1.5 font-mono text-[13px] leading-5 font-medium', stato === 'spenta' ? 'text-fg-faint' : stato === 'battuta' ? 'text-fg-muted' : 'text-fg-strong')}>
										<span className="inline-block size-2.5 shrink-0 rounded-full border border-edge-strong" style={{ background: COLORE[riga.valore], opacity: accesa ? 1 : 0.35 }} />
										<span className={cn('whitespace-nowrap', stato === 'battuta' && 'line-through decoration-fg-faint decoration-1')}>{testo}</span>
									</span>
									<span className={cn('text-[11.5px] leading-4', stato === 'vince' ? 'font-medium text-ok-fg' : stato === 'ereditata' ? 'font-medium text-tint-fg' : 'text-fg-subtle')}>
										{ETICHETTA[stato]}
										{peso && (
											<span className="font-mono font-normal text-fg-subtle">
												{' · '}id {peso[0]}, classi {peso[1]}, elementi {peso[2]}
											</span>
										)}
									</span>
								</span>
							</button>
							<span className="flex shrink-0">
								<button type="button" onClick={i === 0 ? undefined : () => sposta(i, -1)} aria-disabled={i === 0 || undefined} aria-label={`Sposta in su la regola ${testo}`} title="Sposta in su" className="flex size-8 cursor-pointer items-center justify-center rounded-md text-fg-muted focus-ring hover:bg-surface-3 hover:text-fg aria-disabled:pointer-events-none aria-disabled:opacity-35">
									<ArrowUp className="size-4" aria-hidden="true" />
								</button>
								<button type="button" onClick={i === righe.length - 1 ? undefined : () => sposta(i, 1)} aria-disabled={i === righe.length - 1 || undefined} aria-label={`Sposta in giù la regola ${testo}`} title="Sposta in giù" className="flex size-8 cursor-pointer items-center justify-center rounded-md text-fg-muted focus-ring hover:bg-surface-3 hover:text-fg aria-disabled:pointer-events-none aria-disabled:opacity-35">
									<ArrowDown className="size-4" aria-hidden="true" />
								</button>
							</span>
						</div>
					);
				})}
			</div>

			<div className="flex min-h-[5rem] w-full items-start justify-center sm:min-h-[2.75rem]" data-frase>
				<Caption>{conCodice(frase)}</Caption>
			</div>
			<Button
				variant="secondary"
				size="sm"
				aria-disabled={!cambiato || undefined}
				onClick={
					cambiato
						? () => {
								setOrdine(REGOLE.map((r) => r.nome));
								setSpente([]);
							}
						: undefined
				}
				className="aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:shadow-none"
			>
				<RotateCcw className="size-3.5" aria-hidden="true" />
				Ricomincia
			</Button>
		</Figura>
	);
}
