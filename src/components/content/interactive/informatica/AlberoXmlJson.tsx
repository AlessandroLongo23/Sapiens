'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Figura, Frase } from '../informatica';

/**
 * "Che cosa corrisponde, in XML e in JSON, a ogni nodo dell'albero di un dato?" The student of lesson 81 (a name, a
 * class, a list of three marks) seen in three ways: as a tree, as XML and as JSON. Touching a node of the tree, or
 * a piece of either text, lights the same part in all three, with what it contains, and a sentence says how each
 * format writes it.
 *
 * Every node is a button in the tree, so the whole figure can be used from the keyboard; the pieces of the two
 * texts answer to the pointer too.
 */
type Id = 'studente' | 'nome' | 'nome.v' | 'classe' | 'classe.v' | 'voti' | 'v0' | 'v1' | 'v2';

/** A node of the tree: where it is drawn (x in hundredths of the width, the level from 0) and what it says. */
const NODI: { id: Id; padre: Id | null; testo: string; x: number; livello: 0 | 1 | 2; foglia: boolean; nome: string; frase: string }[] = [
	{ id: 'studente', padre: null, testo: 'studente', x: 50, livello: 0, foglia: false, nome: 'studente, la radice', frase: "La radice: tutto il dato. In XML è l'elemento studente, che contiene tutti gli altri; in JSON è l'oggetto tra le parentesi graffe." },
	{ id: 'nome', padre: 'studente', testo: 'nome', x: 15, livello: 1, foglia: false, nome: 'nome, un campo dello studente', frase: 'Un campo con il suo nome. In XML è un elemento, con il valore tra il tag di apertura e quello di chiusura; in JSON è una coppia: il nome, i due punti, il valore.' },
	{ id: 'nome.v', padre: 'nome', testo: 'Anna', x: 15, livello: 2, foglia: true, nome: 'Anna, il valore di nome', frase: 'Una foglia: il valore Anna, un testo. In XML sta tra i due tag, senza virgolette; in JSON un testo va sempre tra virgolette doppie.' },
	{ id: 'classe', padre: 'studente', testo: 'classe', x: 42, livello: 1, foglia: false, nome: 'classe, un campo dello studente', frase: 'Un altro campo, fatto come nome: un elemento in XML, una coppia di nome e valore in JSON, separata dalla successiva con una virgola.' },
	{ id: 'classe.v', padre: 'classe', testo: '3B', x: 42, livello: 2, foglia: true, nome: '3B, il valore di classe', frase: 'Una foglia: il valore 3B. È un testo anche se contiene una cifra, e in JSON lo dicono le virgolette. In XML tutto il contenuto è testo.' },
	{ id: 'voti', padre: 'studente', testo: 'voti', x: 75, livello: 1, foglia: false, nome: 'voti, la lista dei voti', frase: 'Un nodo con tre figli: la lista dei voti. In XML è un elemento che ne contiene altri tre; in JSON è un array, tra parentesi quadre.' },
	{ id: 'v0', padre: 'voti', testo: '8', x: 60, livello: 2, foglia: true, nome: '8, il primo voto', frase: "Il primo voto. In XML ogni elemento della lista ha il suo tag voto; in JSON c'è solo il valore, e conta la posizione nell'array. Senza virgolette, 8 è un numero." },
	{ id: 'v1', padre: 'voti', testo: '6', x: 75, livello: 2, foglia: true, nome: '6, il secondo voto', frase: 'Il secondo voto. In XML è un altro elemento voto, uguale nel nome al primo; in JSON è il secondo valore, dopo la virgola.' },
	{ id: 'v2', padre: 'voti', testo: '7', x: 90, livello: 2, foglia: true, nome: '7, il terzo voto', frase: "Il terzo voto. In JSON dopo l'ultimo valore non ci va la virgola; in XML l'ultimo elemento si chiude come gli altri, prima del tag di chiusura di voti." }
];
const NODO = Object.fromEntries(NODI.map((n) => [n.id, n])) as Record<Id, (typeof NODI)[number]>;
const FRASI = NODI.map((n) => n.frase);

/** Whether `id` is `antenato` or one of the nodes under it. */
const dentro = (id: Id, antenato: Id): boolean => id === antenato || (NODO[id].padre !== null && dentro(NODO[id].padre!, antenato));

type Pezzo = readonly [string, Id];
const XML: Pezzo[] = [
	['<studente>', 'studente'], ['\n  ', 'studente'],
	['<nome>', 'nome'], ['Anna', 'nome.v'], ['</nome>', 'nome'], ['\n  ', 'studente'],
	['<classe>', 'classe'], ['3B', 'classe.v'], ['</classe>', 'classe'], ['\n  ', 'studente'],
	['<voti>', 'voti'], ['\n    ', 'voti'],
	['<voto>8</voto>', 'v0'], ['\n    ', 'voti'],
	['<voto>6</voto>', 'v1'], ['\n    ', 'voti'],
	['<voto>7</voto>', 'v2'], ['\n  ', 'studente'],
	['</voti>', 'voti'], ['\n', 'studente'],
	['</studente>', 'studente']
];
const JSON_: Pezzo[] = [
	['{', 'studente'], ['\n  ', 'studente'],
	['"nome": ', 'nome'], ['"Anna"', 'nome.v'], [',', 'studente'], ['\n  ', 'studente'],
	['"classe": ', 'classe'], ['"3B"', 'classe.v'], [',', 'studente'], ['\n  ', 'studente'],
	['"voti": [', 'voti'], ['8', 'v0'], [', ', 'voti'], ['6', 'v1'], [', ', 'voti'], ['7', 'v2'], [']', 'voti'],
	['\n', 'studente'], ['}', 'studente']
];

const ARANCIO = 'border-[oklch(0.64_var(--chroma)_var(--hue))]';
const Y = [20, 76, 132]; // the middle of each level of the tree, in pixels
const ALTEZZA = 152;
const MEZZA = 16; // half the height of a node

/** One of the two texts, with the pieces of the chosen node and of what it contains lit. */
function Testo({ titolo, pezzi, scelto, onScelto }: { titolo: string; pezzi: Pezzo[]; scelto: Id; onScelto: (id: Id) => void }) {
	return (
		<div className="min-w-0 overflow-hidden rounded-xl border border-edge bg-surface shadow-paper" data-testo={titolo}>
			<div className="label-mono border-b border-edge bg-surface-2 px-2.5 py-1 text-fg-muted">{titolo}</div>
			{/* not a <pre>: inside a lesson the page's own style for code blocks would win over these classes */}
			<div className="overflow-x-auto px-2 py-2 font-mono text-[11px] leading-[1.65] whitespace-pre [font-variant-ligatures:none] sm:px-3 sm:text-[13px]">
				<div>
					{pezzi.map(([testo, id], i) => {
						const acceso = dentro(id, scelto);
						return (
							<span key={i} onClick={() => onScelto(id)} data-nodo={id} data-acceso={acceso || undefined} className={cn('cursor-pointer motion-safe:transition-colors motion-safe:duration-200', acceso ? 'bg-tint-soft text-fg-strong' : 'text-fg-muted', acceso && id === scelto && testo.trim() && 'font-semibold')}>
								{testo}
							</span>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default function AlberoXmlJson({ alt }: { alt?: string }) {
	const [scelto, setScelto] = useState<Id>('voti');
	return (
		<Figura>
			<div className="flex w-full max-w-xl flex-col gap-3" role="group" aria-label={alt ?? 'Lo stesso dato come albero, come XML e come JSON'}>
				{/* the tree: lines under, the nodes as buttons over them */}
				<div className="overflow-hidden rounded-xl border border-edge bg-surface shadow-paper" data-albero>
					<div className="label-mono border-b border-edge bg-surface-2 px-2.5 py-1 text-fg-muted">Albero</div>
					<div className="relative mx-auto w-full max-w-md" style={{ height: ALTEZZA }}>
						<svg aria-hidden="true" className="absolute inset-0 size-full" viewBox={`0 0 100 ${ALTEZZA}`} preserveAspectRatio="none">
							{NODI.filter((n) => n.padre).map((n) => {
								const p = NODO[n.padre!];
								const acceso = dentro(n.id, scelto) && dentro(p.id, scelto);
								return <line key={n.id} x1={p.x} y1={Y[p.livello] + MEZZA} x2={n.x} y2={Y[n.livello] - MEZZA} vectorEffect="non-scaling-stroke" strokeWidth={acceso ? 2 : 1.25} className={cn('motion-safe:transition-[stroke] motion-safe:duration-200', acceso ? 'stroke-[oklch(0.64_var(--chroma)_var(--hue))]' : 'stroke-edge-strong')} />;
							})}
						</svg>
						{NODI.map((n) => {
							const questo = n.id === scelto;
							const acceso = dentro(n.id, scelto);
							return (
								<button
									key={n.id}
									type="button"
									onClick={() => setScelto(n.id)}
									aria-pressed={questo}
									aria-label={n.nome}
									data-nodo={n.id}
									className={cn(
										'absolute flex h-8 min-w-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center border-[1.5px] px-2 font-mono text-[13px] leading-none font-semibold focus-ring motion-safe:transition-[background-color,border-color,color] motion-safe:duration-200',
										n.foglia ? 'rounded-full' : 'rounded-lg',
										questo ? cn(ARANCIO, 'bg-[oklch(0.75_var(--chroma)_var(--hue))] text-ink-950') : acceso ? cn(ARANCIO, 'bg-tint-soft text-fg-strong') : 'border-edge-strong bg-surface text-fg-strong hover:border-tint'
									)}
									style={{ left: `${n.x}%`, top: Y[n.livello] }}
								>
									{n.testo}
								</button>
							);
						})}
					</div>
				</div>
				<div className="grid grid-cols-2 gap-2 sm:gap-3">
					<Testo titolo="XML" pezzi={XML} scelto={scelto} onScelto={setScelto} />
					<Testo titolo="JSON" pezzi={JSON_} scelto={scelto} onScelto={setScelto} />
				</div>
			</div>
			<Frase tutte={FRASI}>{NODO[scelto].frase}</Frase>
		</Figura>
	);
}
