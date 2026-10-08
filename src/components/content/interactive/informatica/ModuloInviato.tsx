'use client';

import { useId, useState, type ReactNode } from 'react';
import { Check, X } from 'lucide-react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { cn } from '@/lib/utils/cn';
import { codifica, coppia, coppie, escluso, richiesta, type Campo, type Metodo } from '@/lib/informatica/modulo-inviato';
import { Contatori, Figura, Frase } from '../informatica';
import { Codice, Titolino } from './listato';

/**
 * "Di quello che scrivi in un modulo, che cosa parte davvero, con che nome, e dove viaggia con GET e con POST?" The
 * form to sign up for the band's concert, with one field that has no `name` and a checkbox: while the student
 * fills it in, the figure lists the pairs of name and value the browser would send, says why a field sends
 * nothing, and writes the request: the pairs in the address with GET, in the body with POST.
 */
const ACTION = '/iscrizione';
const CAMPO = 'min-h-9 w-full min-w-0 rounded-lg border border-edge-strong bg-surface px-2.5 text-sm text-fg-strong shadow-paper outline-none transition focus:border-[oklch(0.64_var(--chroma)_var(--hue))] focus:ring-3 focus:ring-tint/20';

/** The attribute that decides whether a field is sent, as the HTML writes it, or its absence. */
function Attributo({ name }: { name: string | null }) {
	return name ? <span className="font-mono text-[11.5px] font-medium whitespace-nowrap text-tint-fg">{`name="${name}"`}</span> : <span className="font-mono text-[11.5px] whitespace-nowrap text-fg-faint italic">senza name</span>;
}

/** One row of what leaves: the pair of a field, or why the field sends nothing. */
function Riga({ etichetta, campo }: { etichetta: string; campo: Campo }) {
	const c = coppia(campo);
	const perche = escluso(campo);
	return (
		<div role="listitem" data-parte={c ? 'si' : 'no'} className={cn('flex min-h-9 items-center gap-2 rounded-lg border-[1.5px] px-2 py-1 motion-safe:transition-[background-color,border-color] motion-safe:duration-200', c ? 'border-ok/45 bg-ok-soft' : 'border-dashed border-edge bg-transparent')}>
			{c ? <Check className="size-3.5 shrink-0 text-ok-fg" aria-hidden="true" /> : <X className="size-3.5 shrink-0 text-fg-faint" aria-hidden="true" />}
			<span className="sr-only">{etichetta}: </span>
			{c ? (
				<span className="min-w-0 font-mono text-[12.5px] leading-tight break-all text-fg-strong">
					<span className="font-semibold text-ok-fg">{c.name}</span>
					<span className="text-fg-subtle"> = </span>
					{c.value === '' ? <span className="font-sans text-xs text-fg-subtle italic">vuoto</span> : c.value}
				</span>
			) : (
				<span className="min-w-0 text-xs leading-tight text-fg-muted">
					<span className="font-medium text-fg">{etichetta}</span> non parte: {perche === 'senza name' ? 'il campo non ha name' : 'la casella non è spuntata'}
				</span>
			)}
		</div>
	);
}

/** A part of the request, with its name above: the address, the body. */
function Parte({ nome, vuota, children }: { nome: string; vuota?: boolean; children: ReactNode }) {
	return (
		<div className="flex flex-col gap-1">
			<Titolino>{nome}</Titolino>
			<div data-parte-richiesta={nome} className={cn('min-h-[4.375rem] rounded-xl border px-2.5 py-1.5 font-mono text-[12.5px] leading-[19px] [overflow-wrap:anywhere]', vuota ? 'border-dashed border-edge bg-transparent text-fg-faint' : 'border-edge bg-surface-2 text-fg-strong')}>
				{children}
			</div>
		</div>
	);
}

/** The pairs as they are written in the request, with the names in the subject's colour and the signs that hold them together dimmed. */
function Dati({ campi }: { campi: readonly Campo[] }) {
	const cs = coppie(campi);
	return (
		<>
			{cs.map((c, i) => (
				<span key={c.name}>
					{i > 0 && <span className="text-fg-subtle">&amp;</span>}
					<wbr />
					<span className="font-semibold text-tint-fg">{codifica(c.name)}</span>
					<span className="text-fg-subtle">=</span>
					{codifica(c.value)}
				</span>
			))}
		</>
	);
}

export default function ModuloInviato() {
	const id = useId();
	const [nome, setNome] = useState('Anna');
	const [email, setEmail] = useState('anna@esempio.it');
	const [classe, setClasse] = useState('3B');
	const [notizie, setNotizie] = useState(false);
	const [metodo, setMetodo] = useState<Metodo>('get');
	const campi: Campo[] = [
		{ tipo: 'text', id: 'nome', name: 'nome', valore: nome },
		{ tipo: 'email', id: 'email', name: 'email', valore: email },
		{ tipo: 'text', id: 'classe', name: null, valore: classe },
		{ tipo: 'checkbox', id: 'notizie', name: 'notizie', value: 'si', spuntata: notizie }
	];
	const etichette = ['Nome', 'Email', 'Classe', 'Notizie'];
	const cs = coppie(campi);
	const r = richiesta(metodo, ACTION, cs);
	const testo = (i: number, etichetta: string, tipo: string, valore: string, onChange: (v: string) => void) => (
		<label htmlFor={`${id}-${i}`} className="flex flex-col gap-1">
			<span className="flex items-baseline justify-between gap-2">
				<span className="text-sm font-medium text-fg">{etichetta}</span>
				<Attributo name={campi[i].name} />
			</span>
			<input id={`${id}-${i}`} type={tipo} value={valore} maxLength={22} autoComplete="off" spellCheck={false} onChange={(e) => onChange(e.target.value)} className={CAMPO} />
		</label>
	);
	return (
		<Figura>
			<div className="flex w-full flex-wrap items-start justify-center gap-x-6 gap-y-5">
				<div className="flex w-full max-w-[21rem] flex-col gap-2.5">
					<Titolino>Il modulo: compilalo</Titolino>
					{testo(0, 'Nome', 'text', nome, setNome)}
					{testo(1, 'Email', 'text', email, setEmail)}
					{testo(2, 'Classe', 'text', classe, setClasse)}
					<label htmlFor={`${id}-3`} className="flex min-h-9 cursor-pointer items-center justify-between gap-2">
						<span className="flex items-center gap-2 text-sm font-medium text-fg">
							<input id={`${id}-3`} type="checkbox" checked={notizie} onChange={(e) => setNotizie(e.target.checked)} className="size-4 shrink-0" style={{ accentColor: 'oklch(0.64 var(--chroma) var(--hue))' }} />
							Voglio le notizie del gruppo
						</span>
						<Attributo name="notizie" />
					</label>
					<div className="flex items-baseline justify-between gap-2 pt-1">
						<span className="text-sm font-medium text-fg">Come viene inviato</span>
						<span className="font-mono text-[11.5px] font-medium whitespace-nowrap text-tint-fg">{`method="${metodo}"`}</span>
					</div>
					<ToggleGroup
						label="method"
						compact
						value={metodo}
						onChange={setMetodo}
						options={[
							{ value: 'get', label: 'get' },
							{ value: 'post', label: 'post' }
						]}
					/>
				</div>
				<div className="flex w-full max-w-[21rem] flex-col gap-2.5">
					<Titolino>Premendo Invia parte questo</Titolino>
					<div role="list" className="flex flex-col gap-1.5" data-coppie>
						{campi.map((campo, i) => (
							<Riga key={campo.id} etichetta={etichette[i]} campo={campo} />
						))}
					</div>
					<Parte nome="Indirizzo chiesto">
						<span className="text-fg-subtle">{r.metodo} </span>
						{ACTION}
						{metodo === 'get' && (
							<>
								<span className="text-fg-subtle">?</span>
								<Dati campi={campi} />
							</>
						)}
					</Parte>
					<Parte nome="Corpo della richiesta" vuota={r.corpo === null}>
						{r.corpo === null ? <span className="font-sans text-xs italic">vuoto: con GET i dati sono nell’indirizzo</span> : <Dati campi={campi} />}
					</Parte>
				</div>
			</div>
			<Frase tutte={['Con method="post" l’indirizzo resta /iscrizione e le coppie viaggiano nel corpo della richiesta, unite da &: nella barra degli indirizzi non si vedono.']}>
				{metodo === 'get' ? (
					<>
						Con <Codice>{'method="get"'}</Codice> le coppie si attaccano all’indirizzo dopo un <Codice>?</Codice>, unite da <Codice>&amp;</Codice>: chi guarda la barra degli indirizzi le legge.
					</>
				) : (
					<>
						Con <Codice>{'method="post"'}</Codice> l’indirizzo resta <Codice>{ACTION}</Codice> e le coppie viaggiano nel corpo della richiesta: nella barra degli indirizzi non si vedono.
					</>
				)}
			</Frase>
			<Contatori voci={{ campi: campi.length, 'coppie inviate': cs.length }} />
		</Figura>
	);
}
