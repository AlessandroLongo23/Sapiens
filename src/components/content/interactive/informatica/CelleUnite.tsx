'use client';

import { useState } from 'react';
import { ArrowDown, ArrowRight, RotateCcw, Split } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { accanto, codice, daSopra, scritte, separa, tabella, unisci, type CellaTabella, type Tabella } from '@/lib/informatica/celle-unite';
import { Contatori, Figura, Frase } from '../informatica';
import { ButtonRow } from '../kit';
import { Codice, Listato, Tasto, Titolino } from './listato';

/**
 * "Quando una cella ne prende due, quante celle restano da scrivere nella sua riga (colspan) e nella riga sotto
 * (rowspan)?" The table of the band's concerts beside its HTML: the student picks a cell and joins it to the one on
 * its right or to the one below. The cell grows, its line gains `colspan` or `rowspan`, and the line of the cell it
 * took is struck through: it is no longer written.
 */
const TESTI = [
	['Data', 'Luogo', 'Ingresso'],
	['3 maggio', 'Aula magna', 'gratuito'],
	['5 giugno', 'Aula magna', 'gratuito'],
	['20 giugno', 'da definire', 'da definire']
];
const INIZIO = tabella(TESTI);
const PRIMA = 10; // the first "da definire": the join the lesson asks for first

const ORDINALE = ['prima', 'seconda', 'terza', 'quarta'];

const quante = (n: number) => (n === 1 ? 'resta scritta una cella sola' : `le celle scritte sono ${n}`);

/** What the chosen cell is and what that does to the rows, in the words of the lesson. */
function frase(t: Tabella, a: CellaTabella) {
	const nome = <b className="font-medium text-fg">«{a.testo}»</b>;
	const conto = (riga: number) => {
		const pezzi = scritte(t, riga).map((c) => String(c.colonne));
		const sopra = daSopra(t, riga);
		return `${[...pezzi, ...(sopra ? [`${sopra} da sopra`] : [])].join(' + ')} = ${t.colonne}`;
	};
	if (a.righe === 1 && a.colonne === 1) {
		const libera = accanto(t, a.id, 'destra') || accanto(t, a.id, 'basso');
		return (
			<>
				{nome} occupa un posto solo, come ogni cella scritta senza attributi. {libera ? 'Uniscila a una vicina e guarda quale riga del codice viene barrata.' : 'Da qui non ha una vicina con cui formare un rettangolo: scegli un’altra cella.'}
			</>
		);
	}
	if (a.righe === 1)
		return (
			<>
				{nome} ha <Codice>{`colspan="${a.colonne}"`}</Codice>: occupa {a.colonne} colonne. Nella {ORDINALE[a.riga]} riga {quante(scritte(t, a.riga).length)}, e i posti tornano: {conto(a.riga)}.
			</>
		);
	const sotto = a.riga + 1;
	if (a.colonne === 1)
		return (
			<>
				{nome} ha <Codice>{`rowspan="${a.righe}"`}</Codice>: scende per {a.righe} righe ed è scritta solo nella {ORDINALE[a.riga]}. Nella {ORDINALE[sotto]} riga {quante(scritte(t, sotto).length)}: {conto(sotto)}.
			</>
		);
	return (
		<>
			{nome} ha <Codice>{`colspan="${a.colonne}"`}</Codice> e <Codice>{`rowspan="${a.righe}"`}</Codice>: occupa {a.righe * a.colonne} posti ed è scritta una volta sola. Nella {ORDINALE[sotto]} riga: {conto(sotto)}.
		</>
	);
}

/** The longest sentences the figure can say, so that the height under them does not move. */
const LUNGHE = ['«da definire» occupa un posto solo, come ogni cella scritta senza attributi. Da qui non ha una vicina con cui formare un rettangolo: scegli un’altra cella.', '«Aula magna» ha rowspan="2": scende per 2 righe ed è scritta solo nella seconda. Nella terza riga resta scritta una cella sola: 1 + 2 da sopra = 3.'];

export default function CelleUnite() {
	const [t, setT] = useState(INIZIO);
	const [scelta, setScelta] = useState(PRIMA);
	const a = t.celle.find((c) => c.id === scelta) ?? t.celle[0];
	const destra = accanto(t, a.id, 'destra');
	const basso = accanto(t, a.id, 'basso');
	const unita = a.righe > 1 || a.colonne > 1;
	const cambiata = t.celle.length !== INIZIO.celle.length;
	return (
		<Figura>
			<div className="flex w-full flex-wrap items-start justify-center gap-x-6 gap-y-4">
				<div className="flex w-full max-w-[21rem] flex-col gap-2">
					<Titolino>La tabella: tocca una cella</Titolino>
					<div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${t.colonne}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${t.righe}, 2.5rem)` }} data-tabella>
						{t.celle.map((c) => {
							const grande = c.righe > 1 || c.colonne > 1;
							return (
								<button
									key={c.id}
									type="button"
									onClick={() => setScelta(c.id)}
									aria-pressed={c.id === a.id}
									aria-label={`${c.testo}: ${c.intestazione ? 'intestazione' : 'cella'} della riga ${c.riga + 1}, colonna ${c.colonna + 1}${c.colonne > 1 ? `, occupa ${c.colonne} colonne` : ''}${c.righe > 1 ? `, occupa ${c.righe} righe` : ''}`}
									data-cella={c.id}
									data-unita={grande || undefined}
									className={cn(
										'flex min-w-0 cursor-pointer items-center justify-center rounded-lg border-[1.5px] px-1 text-center text-[13px] leading-tight focus-ring motion-safe:transition-[background-color,border-color,box-shadow] motion-safe:duration-200',
										c.intestazione ? 'font-semibold' : 'font-normal',
										c.id === a.id
											? 'relative z-[1] border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft text-fg-strong ring-[3px] ring-tint/20'
											: grande
												? 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft text-fg-strong'
												: cn('border-edge-strong text-fg-strong shadow-paper hover:border-tint', c.intestazione ? 'bg-surface-2' : 'bg-surface')
									)}
									style={{ gridColumn: `${c.colonna + 1} / span ${c.colonne}`, gridRow: `${c.riga + 1} / span ${c.righe}` }}
								>
									<span className="truncate">{c.testo}</span>
								</button>
							);
						})}
					</div>
					<ButtonRow>
						<Tasto off={!destra} onClick={() => setT(unisci(t, a.id, 'destra'))}>
							<ArrowRight className="size-3.5" aria-hidden="true" />
							Unisci a destra
						</Tasto>
						<Tasto off={!basso} onClick={() => setT(unisci(t, a.id, 'basso'))}>
							<ArrowDown className="size-3.5" aria-hidden="true" />
							Unisci in basso
						</Tasto>
						<Tasto off={!unita} onClick={() => setT(separa(t, a.id))}>
							<Split className="size-3.5" aria-hidden="true" />
							Separa
						</Tasto>
						<Tasto
							off={!cambiata}
							onClick={() => {
								setT(INIZIO);
								setScelta(PRIMA);
							}}
						>
							<RotateCcw className="size-3.5" aria-hidden="true" />
							Ricomincia
						</Tasto>
					</ButtonRow>
					<Frase tutte={LUNGHE}>{frase(t, a)}</Frase>
				</div>
				<div className="flex w-full max-w-[21rem] flex-col gap-2">
					<Titolino>Il suo codice</Titolino>
					<Listato
						label="Il codice HTML della tabella: le righe barrate sono le celle che non si scrivono più"
						stretto={t.celle.some((c) => c.righe > 1 && c.colonne > 1)}
						righe={codice(t).map((riga, i) => ({
							chiave: i,
							testo: riga.testo,
							rientro: riga.rientro,
							stato: riga.tolta !== undefined ? 'tolta' : riga.cella === a.id ? 'accesa' : 'normale'
						}))}
					/>
					<p className="m-0 text-center text-xs text-fg-muted">
						<del className="text-fg-faint">barrata</del>: una cella che non si scrive più
					</p>
				</div>
			</div>
			<Contatori voci={{ colonne: t.colonne, posti: t.righe * t.colonne, 'celle scritte': t.celle.length }} />
		</Figura>
	);
}
