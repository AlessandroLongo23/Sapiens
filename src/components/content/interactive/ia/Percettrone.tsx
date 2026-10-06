'use client';

import { useEffect, useReducer, useState } from 'react';
import { ArrowLeftRight, Pause, Play, Shuffle, StepForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Handle, frame, v, clamp, len, sub, texNum, type V } from '../kit';
import { BERSAGLI, INGRESSI, giusti, ordineCasuale, passo, pesiCasuali, uscita, type Funzione, type Passo, type Pesi } from './regola';
import { BORDO, Legenda, Piano, makePiano, type Punto } from './piano';

/**
 * The two figures of the lesson "Il percettrone" on the plane of the inputs. In the first the student moves the
 * decision line by hand and counts how many of the four inputs it gets right: on AND and OR four, on XOR never more
 * than three. In the second the learning rule trains a perceptron from random weights, with the examples in a random
 * order at every epoch: the line is drawn from the weights as they are, so every run is different. On AND and OR it
 * stops at the first epoch without errors; on XOR it goes on until the student stops it.
 */

const FUNZIONI: { value: Funzione; label: string }[] = [
	{ value: 'AND', label: 'AND' },
	{ value: 'OR', label: 'OR' },
	{ value: 'XOR', label: 'XOR' }
];

const U = 2.4;
const f = frame(-1.25, 4.0, -1.2, 3.85);
const g = makePiano(v(0, 0), U);

const punti = (fn: Funzione, p: Pesi | null, acceso = -1): Punto[] =>
	INGRESSI.map((x, i) => ({ x: x[0], y: x[1], classe: BERSAGLI[fn][i], sbagliato: p ? uscita(p, x) !== BERSAGLI[fn][i] : false, acceso: i === acceso }));

const texPesi = (p: Pesi, digits = 2) => `w_1 = ${texNum(p.w1, digits)},\\quad w_2 = ${texNum(p.w2, digits)},\\quad b = ${texNum(p.b, digits)}`;

// ---------------------------------------------------------------- by hand

/** The unit whose line goes through P and Q, answering 1 on the left of P→Q (or on the right with `giro`), with |w| = 1. */
function daRetta(P: V, Q: V, giro: boolean): Pesi {
	const d = sub(Q, P);
	const n = len(d) || 1;
	const k = giro ? -1 : 1;
	const w1 = (-d.y / n) * k, w2 = (d.x / n) * k;
	return { w1, w2, b: -(w1 * P.x + w2 * P.y) };
}

export function SeparaAMano({ alt }: { alt?: string }) {
	const [fn, setFn] = useState<Funzione>('AND');
	const [P, setP] = useState(v(-0.2, 0.6));
	const [Q, setQ] = useState(v(0.6, -0.2));
	const [giro, setGiro] = useState(true);
	const pesi = daRetta(P, Q, giro);
	const ok = giusti(pesi, fn);
	const dentro = (p: V) => {
		const q = g.unita(p);
		return v(clamp(q.x, -BORDO, 1 + BORDO), clamp(q.y, -BORDO, 1 + BORDO));
	};
	// the two handles never meet: a line needs two points
	const muovi = (set: (p: V) => void, altro: V) => (p: V) => {
		const q = dentro(p);
		if (len(sub(q, altro)) > 0.15) set(q);
	};

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Piano f={f} g={g} pesi={pesi} punti={punti(fn, pesi)} />
				<Handle f={f} at={g.at(P.x, P.y)} onMove={muovi(setP, Q)} label="Primo punto della retta" color="#0000ff" />
				<Handle f={f} at={g.at(Q.x, Q.y)} onMove={muovi(setQ, P)} label="Secondo punto della retta" color="#0000ff" />
			</Drawing>
			<Legenda />
			<Readout>
				<span><Tex>{texPesi(pesi)}</Tex></span>
				<span>giusti: <strong>{ok} su 4</strong></span>
			</Readout>
			<Caption>
				{ok === 4 ? (
					<>La retta separa i punti: questo percettrone calcola {fn}.</>
				) : fn === 'XOR' ? (
					ok === 3 ? <>Tre su quattro è il massimo: sistemato un punto, ne esce un altro. Nessuna retta lascia i due punti pieni da una parte e i due vuoti dall&apos;altra.</> : <>Trascina i due punti blu per spostare la retta: quanti dei quattro ingressi riesci a sistemare?</>
				) : (
					<>Trascina i due punti blu finché i punti pieni stanno tutti nella zona colorata e i vuoti fuori.</>
				)}
			</Caption>
			<Controls>
				<ButtonRow>
					<ToggleGroup options={FUNZIONI} value={fn} onChange={setFn} label="Funzione da calcolare" />
					<Button variant="secondary" size="sm" onClick={() => setGiro((x) => !x)}>
						<ArrowLeftRight className="size-4" aria-hidden="true" />
						Scambia i due lati
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

// ---------------------------------------------------------------- the learning rule

/** Milliseconds between two examples while the training runs. */
const RITMO = 220;
/** How many finished epochs the bars under the figure show. */
const BARRE = 40;

type Stato = {
	fn: Funzione;
	pesi: Pesi;
	/** The examples still to present in this epoch, in the order drawn for it. */
	coda: number[];
	/** Errors of the epoch under way. */
	inCorso: number;
	/** Errors of each finished epoch. */
	errori: number[];
	correzioni: number;
	ultimo: Passo | null;
	corre: boolean;
};

const inizio = (fn: Funzione): Stato => ({ fn, pesi: pesiCasuali(), coda: ordineCasuale(), inCorso: 0, errori: [], correzioni: 0, ultimo: null, corre: false });
/** The last finished epoch had no errors: the rule has nothing left to correct. */
const finito = (s: Stato) => s.errori.length > 0 && s.errori[s.errori.length - 1] === 0;

function avanza(s: Stato, eta: number): Stato {
	if (finito(s)) return { ...s, corre: false };
	const [i, ...resto] = s.coda;
	const r = passo(s.pesi, s.fn, i, eta);
	const sbagliato = r.y !== r.t ? 1 : 0;
	const base = { ...s, pesi: r.dopo, ultimo: r, correzioni: s.correzioni + sbagliato };
	if (resto.length > 0) return { ...base, coda: resto, inCorso: s.inCorso + sbagliato };
	const errori = [...s.errori, s.inCorso + sbagliato];
	return { ...base, coda: ordineCasuale(), inCorso: 0, errori, corre: s.corre && errori[errori.length - 1] > 0 };
}

type Azione = { tipo: 'passo'; eta: number } | { tipo: 'avvia' } | { tipo: 'ferma' } | { tipo: 'funzione'; fn: Funzione } | { tipo: 'nuovi pesi' };
function riduci(s: Stato, a: Azione): Stato {
	switch (a.tipo) {
		case 'passo':
			return avanza(s, a.eta);
		case 'avvia':
			return { ...s, corre: !finito(s) };
		case 'ferma':
			return { ...s, corre: false };
		case 'funzione':
			return inizio(a.fn);
		case 'nuovi pesi':
			return inizio(s.fn);
	}
}

const coppia = (x: readonly [number, number]) => `(${x[0]},\\,${x[1]})`;

/** One bar per finished epoch, as tall as its errors (0 to 4): the last BARRE epochs. */
function Storia({ errori }: { errori: number[] }) {
	const ultime = errori.slice(-BARRE);
	return (
		<div className="flex w-full max-w-lg flex-col gap-1">
			<div className="flex h-10 items-end gap-px" role="img" aria-label={`Errori nelle ultime ${ultime.length} epoche: ${ultime.join(', ')}`}>
				{ultime.map((e, i) => (
					<span key={errori.length - ultime.length + i} className={e === 0 ? 'flex-1 rounded-sm bg-accent' : 'flex-1 rounded-sm bg-fg-muted'} style={{ height: `${e === 0 ? 8 : e * 25}%`, maxWidth: 12 }} />
				))}
			</div>
			<p className="m-0 text-xs text-fg-muted">Errori per epoca, da 0 a 4{errori.length > BARRE ? ` (le ultime ${BARRE})` : ''}</p>
		</div>
	);
}

export function Apprendimento({ alt }: { alt?: string }) {
	const [s, invia] = useReducer(riduci, 'AND' as Funzione, inizio);
	const [eta, setEta] = useState(0.2);
	const fermo = finito(s);

	useEffect(() => {
		if (!s.corre) return;
		const id = setTimeout(() => invia({ tipo: 'passo', eta }), RITMO);
		return () => clearTimeout(id);
	}, [s, eta]);

	const u = s.ultimo;
	const acceso = u ? INGRESSI.findIndex((x) => x === u.x) : -1;
	const epoca = s.errori.length + (fermo ? 0 : 1);
	const ora = giusti(s.pesi, s.fn);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Piano f={f} g={g} pesi={s.pesi} punti={punti(s.fn, s.pesi, acceso)} />
			</Drawing>
			<Legenda />
			<Readout>
				<span><Tex>{texPesi(s.pesi)}</Tex></span>
				<span>epoca {epoca}</span>
				<span>correzioni: {s.correzioni}</span>
				<span>giusti ora: <strong>{ora} su 4</strong></span>
			</Readout>
			{s.errori.length > 0 && <Storia errori={s.errori} />}
			<Caption>
				{!u ? (
					<>I pesi di partenza sono estratti a caso, e la retta è quella che ne esce. Premi «Avvia»: la regola presenta gli esempi in ordine casuale e corregge i pesi a ogni errore.</>
				) : fermo ? (
					<>Un&apos;epoca intera senza errori: l&apos;addestramento si ferma da solo, dopo {s.errori.length} {s.errori.length === 1 ? 'epoca' : 'epoche'} e {s.correzioni} {s.correzioni === 1 ? 'correzione' : 'correzioni'}. Con «Nuovi pesi» riparte da un&apos;altra retta e arriva a un&apos;altra soluzione.</>
				) : (
					<>
						Ingresso <Tex>{coppia(u.x)}</Tex>: <Tex>{`s = ${texNum(u.s)}`}</Tex>, quindi <Tex>{`y = ${u.y}`}</Tex>; doveva essere <Tex>{`t = ${u.t}`}</Tex>.{' '}
						{u.y === u.t ? 'Giusto: i pesi restano come sono.' : u.t === 1 ? <>Somma troppo bassa: la retta si sposta per portare il punto nella zona dell&apos;1.</> : <>Somma troppo alta: la retta si sposta per lasciare il punto fuori dalla zona dell&apos;1.</>}
						{s.fn === 'XOR' && s.errori.length >= 15 && <> Dopo {s.errori.length} epoche non ce n&apos;è stata una senza errori: le barre non toccano mai lo zero.</>}
					</>
				)}
			</Caption>
			<Controls>
				<ButtonRow>
					<ToggleGroup options={FUNZIONI} value={s.fn} onChange={(fn) => invia({ tipo: 'funzione', fn })} label="Funzione da imparare" />
				</ButtonRow>
				<Slider label="Tasso di apprendimento η" value={eta} min={0.05} max={1} step={0.05} onChange={setEta} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={fermo} onClick={() => invia({ tipo: s.corre ? 'ferma' : 'avvia' })}>
						{s.corre ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{s.corre ? 'Ferma' : u ? 'Riprendi' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={fermo || s.corre} onClick={() => invia({ tipo: 'passo', eta })}>
						<StepForward className="size-4" aria-hidden="true" />
						Un esempio
					</Button>
					<Button variant="secondary" size="sm" onClick={() => invia({ tipo: 'nuovi pesi' })}>
						<Shuffle className="size-4" aria-hidden="true" />
						Nuovi pesi
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
