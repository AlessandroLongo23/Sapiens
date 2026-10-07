'use client';

import { useState } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { cn } from '@/lib/utils/cn';
import { ComandiPassi, Figura, Frase, usePassi } from '../informatica';

/**
 * "Quando lo script cerca l'elemento #liberi, il browser lo ha già costruito?" The browser reads the HTML file from
 * the top, one line at a step; beside the file is the page built so far and what the script is doing. The choice at
 * the top moves the script tag: in the head, in the head with `defer`, at the end of the body. Only in the first
 * case the script runs before the element exists, and its search gives `null`.
 */

type Posto = 'head' | 'defer' | 'body';

const SCRIPT = { head: '<script src="script.js"></script>', defer: '<script src="script.js" defer></script>', body: '<script src="script.js"></script>' } as const;

/** The lines of the file, with the script tag where the choice puts it. `SPAN` is the line of the element looked for. */
const righe = (posto: Posto) => ['<head>', ...(posto === 'body' ? [] : [`  ${SCRIPT[posto]}`]), '</head>', '<body>', '  <h1>I Fuori Tempo</h1>', '  <p>Liberi: <span id="liberi">?</span></p>', ...(posto === 'body' ? [`  ${SCRIPT.body}`] : []), '</body>'];

type Script = 'lontano' | 'attesa' | 'esecuzione' | 'errore' | 'finito';

interface Passo {
	/** The line the browser is on (all the lines before it are read); the number of lines when the file is over. */
	riga: number;
	/** How many elements of the body are built: 0, 1 (the title) or 2 (the paragraph too). */
	costruiti: 0 | 1 | 2;
	script: Script;
	/** What the search of the script gave, once it has been made. */
	trovato?: boolean;
	/** The script has written the number in the page. */
	scritto?: boolean;
	frase: string;
}

const TRACCE: Record<Posto, Passo[]> = {
	head: [
		{ riga: 0, costruiti: 0, script: 'lontano', frase: 'Il browser legge il file dall’alto verso il basso. Comincia dalla head: della pagina non c’è ancora niente.' },
		{ riga: 1, costruiti: 0, script: 'esecuzione', frase: 'Trova il tag script, senza defer: smette di leggere, chiede script.js e lo esegue subito.' },
		{ riga: 1, costruiti: 0, script: 'esecuzione', trovato: false, frase: 'Lo script cerca #liberi nella pagina costruita finora, che è vuota. La ricerca dà null.' },
		{ riga: 1, costruiti: 0, script: 'errore', trovato: false, frase: 'La riga che scrive dentro null si ferma con un errore, e lo script finisce lì. Nella console: Cannot set properties of null.' },
		{ riga: 4, costruiti: 1, script: 'errore', trovato: false, frase: 'Solo adesso il browser riprende a leggere, entra nel body e costruisce il titolo.' },
		{ riga: 5, costruiti: 2, script: 'errore', trovato: false, frase: 'Costruisce il paragrafo con lo span #liberi. È tardi: lo script è già finito.' },
		{ riga: 7, costruiti: 2, script: 'errore', trovato: false, frase: 'Il file è finito. Lo span c’è, ma nessuno ci ha scritto: nella pagina resta il punto interrogativo.' }
	],
	defer: [
		{ riga: 0, costruiti: 0, script: 'lontano', frase: 'Il browser legge il file dall’alto verso il basso. Comincia dalla head: della pagina non c’è ancora niente.' },
		{ riga: 1, costruiti: 0, script: 'attesa', frase: 'Trova il tag script con defer: chiede script.js ma non si ferma. Lo script aspetta che la pagina sia pronta.' },
		{ riga: 4, costruiti: 1, script: 'attesa', frase: 'Il browser entra nel body e costruisce il titolo. Lo script aspetta ancora.' },
		{ riga: 5, costruiti: 2, script: 'attesa', frase: 'Costruisce il paragrafo con lo span #liberi, che per ora contiene il punto interrogativo.' },
		{ riga: 7, costruiti: 2, script: 'esecuzione', frase: 'Il file è finito e la pagina è costruita tutta: adesso parte lo script che era stato rimandato.' },
		{ riga: 7, costruiti: 2, script: 'esecuzione', trovato: true, frase: 'Lo script cerca #liberi, e questa volta lo trova: lo span è lì da due passi.' },
		{ riga: 7, costruiti: 2, script: 'finito', trovato: true, scritto: true, frase: 'Lo script scrive 33 nello span e finisce. La pagina mostra il conto.' }
	],
	body: [
		{ riga: 0, costruiti: 0, script: 'lontano', frase: 'Il browser legge il file dall’alto verso il basso. Nella head questa volta non c’è nessuno script.' },
		{ riga: 3, costruiti: 1, script: 'lontano', frase: 'Entra nel body e costruisce il titolo. Dello script non sa ancora niente.' },
		{ riga: 4, costruiti: 2, script: 'lontano', frase: 'Costruisce il paragrafo con lo span #liberi, che per ora contiene il punto interrogativo.' },
		{ riga: 5, costruiti: 2, script: 'esecuzione', frase: 'Trova il tag script, in fondo al body: smette di leggere e lo esegue subito. Gli elementi scritti sopra ci sono già.' },
		{ riga: 5, costruiti: 2, script: 'esecuzione', trovato: true, frase: 'Lo script cerca #liberi e lo trova.' },
		{ riga: 5, costruiti: 2, script: 'finito', trovato: true, scritto: true, frase: 'Lo script scrive 33 nello span e finisce. Il browser riprende a leggere.' },
		{ riga: 7, costruiti: 2, script: 'finito', trovato: true, scritto: true, frase: 'Il file è finito. La pagina mostra il conto.' }
	]
};

const STATO: Record<Script, { nome: string; stile: string }> = {
	lontano: { nome: 'non ancora incontrato', stile: 'border-edge bg-surface-2 text-fg-subtle' },
	attesa: { nome: 'in attesa', stile: 'border-edge-strong bg-surface text-fg' },
	esecuzione: { nome: 'in esecuzione', stile: 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft text-fg-strong' },
	errore: { nome: 'fermato da un errore', stile: 'border-danger-edge bg-danger-soft text-danger-fg' },
	finito: { nome: 'finito', stile: 'border-ok/45 bg-ok-soft text-ok-fg' }
};

const TITOLO = 'label-mono mb-1.5 text-fg-subtle';

export default function ScriptOrdineLettura() {
	const [posto, setPosto] = useState<Posto>('head');
	const traccia = TRACCE[posto];
	const passi = usePassi(traccia.length, { ritmo: 2200 });
	const passo = traccia[passi.passo];
	const file = righe(posto);
	return (
		<Figura>
			<ToggleGroup
				label="Dove sta il tag script"
				compact
				value={posto}
				onChange={(value) => {
					setPosto(value);
					passi.ricomincia();
				}}
				options={[
					{ value: 'head', label: 'head' },
					{ value: 'defer', label: 'head, defer' },
					{ value: 'body', label: 'fine body' }
				]}
			/>
			<div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
				<div className="min-w-0">
					<div className={TITOLO}>index.html</div>
					<div role="list" className="overflow-hidden rounded-xl border border-edge bg-surface py-1.5 font-mono text-[11px] [font-variant-ligatures:none] leading-[1.75] shadow-paper sm:text-[11.5px]" aria-label="Le righe del file, con quella che il browser sta leggendo">
						{file.map((riga, i) => {
							const qui = i === passo.riga;
							const script = riga.includes('<script');
							return (
								<div role="listitem" key={riga + i} aria-current={qui ? 'step' : undefined} className={cn('flex items-center border-l-[3px] pr-2 pl-2 whitespace-pre motion-safe:transition-colors motion-safe:duration-200', qui ? 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft text-fg-strong' : 'border-transparent', !qui && (i < passo.riga ? 'text-fg' : 'text-fg-faint'), script && i <= passo.riga && 'font-semibold')}>
									{riga}
								</div>
							);
						})}
					</div>
				</div>
				<div className="flex min-w-0 flex-col gap-3">
					<div>
						<div className={TITOLO}>La pagina costruita finora</div>
						<div className="flex h-[86px] flex-col justify-center gap-1 rounded-xl border border-edge bg-surface px-3.5 shadow-paper" role="img" aria-label={passo.costruiti === 0 ? 'La pagina è ancora vuota' : passo.costruiti === 1 ? 'Nella pagina c’è il titolo' : `Nella pagina ci sono il titolo e il paragrafo: Liberi ${passo.scritto ? '33' : 'punto interrogativo'}`}>
							{passo.costruiti === 0 && <span className="text-center text-sm text-fg-faint">ancora vuota</span>}
							{passo.costruiti >= 1 && <span className="text-base leading-tight font-bold text-fg-strong motion-safe:animate-drop-in">I Fuori Tempo</span>}
							{passo.costruiti >= 2 && (
								<span className="text-sm text-fg motion-safe:animate-drop-in">
									Liberi:{' '}
									<span className={cn('rounded-md border-[1.5px] px-1.5 py-px font-mono font-semibold motion-safe:transition-colors motion-safe:duration-200', passo.scritto ? 'border-ok/45 bg-ok-soft text-ok-fg' : passo.trovato ? 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft text-fg-strong' : 'border-edge-strong text-fg-strong')}>{passo.scritto ? '33' : '?'}</span>
								</span>
							)}
						</div>
					</div>
					<div>
						<div className={TITOLO}>script.js</div>
						<div className={cn('flex h-[62px] flex-col justify-center gap-1 rounded-xl border-[1.5px] px-3.5 motion-safe:transition-colors motion-safe:duration-200', STATO[passo.script].stile)}>
							<span className="text-sm font-medium">{STATO[passo.script].nome}</span>
							<span className="font-mono text-[11px] leading-tight sm:text-xs">
								{passo.trovato === undefined ? <span className="opacity-60">cerca #liberi: non ancora</span> : <>cerca #liberi: {passo.trovato ? <b className="font-semibold">trovato</b> : <b className="font-semibold">null</b>}</>}
							</span>
						</div>
					</div>
				</div>
			</div>
			<Frase tutte={Object.values(TRACCE).flatMap((t) => t.map((p) => p.frase))}>{passo.frase}</Frase>
			<ComandiPassi passi={passi} />
		</Figura>
	);
}
