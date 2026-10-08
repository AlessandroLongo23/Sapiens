'use client';

import { useId, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { ComandiPassi, Figura, Frase, Stringa } from '../informatica';
import { usePassiAvvio } from './passi-avvio';

/**
 * "Che strada fa quello che scrivo nel campo Nome prima di diventare un messaggio d'errore o un invio, e quale
 * controllo ferma tre spazi?" The student writes in the field (or takes one of four values) and presses the button
 * of the form; the datum goes through the stops of the lesson's script one step at a time: the value read, the
 * value after trim(), the check for empty, the check on the length, and the outcome, which is a message beside the
 * field with the sending stopped, or the form that leaves.
 */

const MAX = 10;
const MESSAGGI = { vuoto: 'Scrivi il tuo nome', corto: 'Il nome ha almeno 2 lettere' } as const;
const PROVE = [
	{ nome: 'vuoto', valore: '' },
	{ nome: 'tre spazi', valore: '   ' },
	{ nome: 'una lettera', valore: ' G' },
	{ nome: 'Anna', valore: 'Anna ' }
] as const;

type Tappa = 'valore' | 'trim' | 'vuoto' | 'lunghezza' | 'esito';
const ORDINE: Tappa[] = ['valore', 'trim', 'vuoto', 'lunghezza', 'esito'];

const caratteri = (n: number) => (n === 1 ? '1 carattere' : `${n} caratteri`);

/** The stops the datum goes through, with the sentence of each: the check on the length is skipped when the first one stops it. */
function percorso(scritto: string): { tappa: Tappa | null; frase: string }[] {
	const testo = scritto.trim();
	const tolti = scritto.length - testo.length;
	const messaggio = testo === '' ? MESSAGGI.vuoto : testo.length < 2 ? MESSAGGI.corto : '';
	return [
		{ tappa: null, frase: 'Premi «Iscriviti»: sul modulo nasce l’evento submit, e il browser chiama la funzione che lo ascolta. Il dato comincia il suo percorso.' },
		{ tappa: 'valore', frase: scritto === '' ? 'nome.value restituisce quello che c’è nel campo: qui la stringa vuota, senza nessun carattere.' : `nome.value restituisce quello che c’è nel campo, così com’è: una stringa di ${caratteri(scritto.length)}${scritto.includes(' ') ? ', spazi compresi' : ''}.` },
		{ tappa: 'trim', frase: tolti === 0 ? 'trim() toglie gli spazi all’inizio e alla fine: qui non ce n’erano, e il testo resta uguale.' : testo === '' ? 'trim() toglie gli spazi all’inizio e alla fine: qui erano tutti spazi, e resta la stringa vuota.' : `trim() toglie gli spazi all’inizio e alla fine: ne toglie ${tolti}, e ${testo.length === 1 ? 'resta 1 carattere' : `restano ${testo.length} caratteri`}.` },
		{ tappa: 'vuoto', frase: testo === '' ? 'Primo controllo: il testo è la stringa vuota? Sì. Il dato si ferma qui, e il controllo sulla lunghezza non serve più.' : 'Primo controllo: il testo è la stringa vuota? No, c’è almeno un carattere: il dato va avanti.' },
		...(testo === '' ? [] : [{ tappa: 'lunghezza' as const, frase: testo.length < 2 ? `Secondo controllo: il testo ha meno di 2 caratteri? Sì, ne ha ${testo.length}. Il dato si ferma qui.` : `Secondo controllo: il testo ha meno di 2 caratteri? No, ne ha ${testo.length}: il dato ha superato tutti i controlli.` }]),
		{ tappa: 'esito', frase: messaggio ? `La funzione scrive «${messaggio}» accanto al campo e chiama event.preventDefault(): l’invio è fermato.` : 'Nessun messaggio da mostrare, e preventDefault() non viene chiamata: il browser invia il modulo.' }
	];
}

/** The answer of a check: the datum stops (the condition of the error is true) or goes on. */
function Risposta({ ferma }: { ferma: boolean }) {
	return <span className={cn('shrink-0 rounded-full border px-2 py-px text-xs font-medium whitespace-nowrap', ferma ? 'border-danger-edge bg-danger-soft text-danger-fg' : 'border-ok/45 bg-ok-soft text-ok-fg')}>{ferma ? 'vero: si ferma' : 'falso: passa'}</span>;
}

/** A string in its cells, or the two quotes of the empty one. */
function Testo({ testo, tolti }: { testo: string; tolti?: boolean }) {
	if (testo === '') return <span className="font-mono text-sm text-fg-strong">&quot;&quot; <span className="font-sans text-xs text-fg-subtle">nessun carattere</span></span>;
	const primo = testo.length - testo.trimStart().length;
	const ultimo = testo.trimEnd().length;
	return (
		<div className="w-full" style={{ maxWidth: Math.min(290, testo.length * 30) }}>
			<Stringa testo={testo} max={26} stato={(i) => (tolti && (i < primo || i >= ultimo) ? 'scartata' : 'normale')} label={`La stringa, con gli spazi segnati: ${[...testo].map((c) => (c === ' ' ? 'spazio' : c)).join(', ')}`} />
		</div>
	);
}

function Riga({ codice, stato, children }: { codice: string; stato: 'prima' | 'ora' | 'fatta' | 'saltata'; children: ReactNode }) {
	return (
		<div role="listitem" data-tappa={stato} aria-current={stato === 'ora' ? 'step' : undefined} className={cn('flex min-h-[58px] items-center gap-3 rounded-xl border-[1.5px] px-3 py-1.5 motion-safe:transition-[background-color,border-color,opacity] motion-safe:duration-200', stato === 'ora' ? 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft' : 'border-edge bg-surface', (stato === 'prima' || stato === 'saltata') && 'opacity-55')}>
			<span className="w-[118px] shrink-0 font-mono text-[11.5px] [font-variant-ligatures:none] leading-tight font-medium whitespace-nowrap text-fg-strong">{codice}</span>
			<div className="flex min-w-0 flex-1 items-center justify-end gap-2">{stato === 'prima' ? <span className="text-xs text-fg-faint">non ancora</span> : stato === 'saltata' ? <span className="text-xs text-fg-subtle">non serve più</span> : children}</div>
		</div>
	);
}

export default function ModuloPercorsoDato() {
	const id = useId();
	const [scritto, setScritto] = useState<string>('   ');
	const lista = percorso(scritto);
	const passi = usePassiAvvio(lista.length, { ritmo: 2000 });
	const passo = lista[Math.min(passi.passo, lista.length - 1)];
	const testo = scritto.trim();
	const messaggio = testo === '' ? MESSAGGI.vuoto : testo.length < 2 ? MESSAGGI.corto : '';
	const arrivo = passo.tappa === 'esito';
	const a = passo.tappa === null ? -1 : ORDINE.indexOf(passo.tappa);
	const stato = (tappa: Tappa) => {
		const i = ORDINE.indexOf(tappa);
		if (tappa === 'lunghezza' && testo === '' && a > ORDINE.indexOf('vuoto')) return 'saltata';
		return i < a ? 'fatta' : i === a ? 'ora' : 'prima';
	};
	const scrivi = (valore: string) => {
		setScritto(valore.slice(0, MAX));
		passi.ricomincia();
	};
	return (
		<Figura>
			<form
				className="flex w-full max-w-md flex-col gap-2 rounded-xl border border-edge-strong bg-surface px-4 py-3.5 shadow-paper"
				noValidate
				onSubmit={(e) => {
					// the figure's own form is never sent: the button starts the path of the datum
					e.preventDefault();
					passi.parti(1);
				}}
				data-modulo
			>
				<div className="flex flex-wrap items-end gap-x-3 gap-y-2">
					<label htmlFor={id} className="flex min-w-0 flex-1 basis-40 flex-col gap-1">
						<span className="label-mono text-fg-subtle">Nome</span>
						<input
							id={id}
							type="text"
							autoComplete="off"
							spellCheck={false}
							maxLength={MAX}
							value={scritto}
							onChange={(e) => scrivi(e.target.value)}
							aria-describedby={`${id}-errore`}
							aria-invalid={arrivo && messaggio ? true : undefined}
							className={cn('min-h-9 w-full min-w-0 rounded-lg border bg-surface px-2.5 font-mono text-sm whitespace-pre text-fg-strong shadow-paper transition outline-none focus:ring-3', arrivo && messaggio ? 'border-danger focus:ring-danger/20' : 'border-edge-strong focus:border-[oklch(0.64_var(--chroma)_var(--hue))] focus:ring-tint/20')}
						/>
					</label>
					<Button type="submit" variant="primary" size="sm">
						Iscriviti
					</Button>
				</div>
				<div id={`${id}-errore`} aria-live="polite" className={cn('min-h-5 text-sm leading-5', arrivo && !messaggio ? 'text-ok-fg' : 'text-danger-fg')} data-esito>
					{arrivo ? messaggio || 'Modulo inviato.' : ''}
				</div>
				<div role="group" aria-label="Valori di prova da scrivere nel campo" className="flex flex-wrap items-center gap-1.5">
					<span className="mr-0.5 text-xs text-fg-subtle">Prova con:</span>
					{PROVE.map((prova) => (
						<button key={prova.nome} type="button" aria-pressed={scritto === prova.valore} onClick={() => scrivi(prova.valore)} className={cn('min-h-8 cursor-pointer rounded-full border px-3 text-xs transition-colors focus-ring', scritto === prova.valore ? 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft font-semibold text-fg-strong' : 'border-edge-strong bg-surface text-fg hover:border-tint-edge')}>
							{prova.nome}
						</button>
					))}
				</div>
			</form>
			<div role="list" className="flex w-full max-w-md flex-col gap-1.5" aria-label="Le tappe del dato, dal campo all'esito">
				<Riga codice="nome.value" stato={stato('valore')}>
					<Testo testo={scritto} tolti={a >= ORDINE.indexOf('trim')} />
				</Riga>
				<Riga codice=".trim()" stato={stato('trim')}>
					<Testo testo={testo} />
				</Riga>
				<Riga codice={'testo === ""'} stato={stato('vuoto')}>
					<Risposta ferma={testo === ''} />
				</Riga>
				<Riga codice="testo.length < 2" stato={stato('lunghezza')}>
					<span className="font-mono text-xs text-fg-muted">length: {testo.length}</span>
					<Risposta ferma={testo.length < 2} />
				</Riga>
				<Riga codice="esito" stato={stato('esito')}>
					<span className={cn('text-right text-sm font-medium', messaggio ? 'text-danger-fg' : 'text-ok-fg')}>{messaggio ? 'messaggio, invio fermato' : 'nessun messaggio, il modulo parte'}</span>
				</Riga>
			</div>
			<Frase tutte={[...lista, ...PROVE.flatMap((prova) => percorso(prova.valore))].map((x) => x.frase)}>{passo.frase}</Frase>
			<ComandiPassi passi={passi} />
		</Figura>
	);
}
