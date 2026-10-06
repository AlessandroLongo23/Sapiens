'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, polar, TINT, INK, THICK, THIN, DASH } from '../kit';

/**
 * Lesson 62 (Energia di legame e regola dell'ottetto): an atom of one of twelve elements of the first four periods,
 * drawn as its symbol with a circle for every occupied level and the electrons as dots on the circles. Two buttons
 * take an electron away or add one (up to four either way). Read under the drawing: the atom or ion with its charge,
 * the electrons level by level, and whether the outermost level is complete, with the noble gas that has the same
 * configuration.
 *
 * The circles are a scheme of the energy levels, not orbits (the lesson says so). Up to twenty electrons the levels
 * fill as 2, 8, 8, 2, which is why the list stops at calcium.
 */

const ELEMENTS = [
	{ sym: 'Li', nome: 'litio', z: 3, gruppo: 1 },
	{ sym: 'C', nome: 'carbonio', z: 6, gruppo: 14 },
	{ sym: 'N', nome: 'azoto', z: 7, gruppo: 15 },
	{ sym: 'O', nome: 'ossigeno', z: 8, gruppo: 16 },
	{ sym: 'F', nome: 'fluoro', z: 9, gruppo: 17 },
	{ sym: 'Na', nome: 'sodio', z: 11, gruppo: 1 },
	{ sym: 'Mg', nome: 'magnesio', z: 12, gruppo: 2 },
	{ sym: 'Al', nome: 'alluminio', z: 13, gruppo: 13 },
	{ sym: 'S', nome: 'zolfo', z: 16, gruppo: 16 },
	{ sym: 'Cl', nome: 'cloro', z: 17, gruppo: 17 },
	{ sym: 'K', nome: 'potassio', z: 19, gruppo: 1 },
	{ sym: 'Ca', nome: 'calcio', z: 20, gruppo: 2 }
] as const;

const CAPACITY = [2, 8, 8, 2];
const NOBLE: Record<number, string> = { 2: 'l’elio', 10: 'il neon', 18: 'l’argon' };
const RADII = [0.85, 1.45, 2.05, 2.65];

/** Electrons level by level: 11 → [2, 8, 1]. */
function levels(e: number): number[] {
	const out: number[] = [];
	for (const c of CAPACITY) {
		if (e <= 0) break;
		out.push(Math.min(c, e));
		e -= c;
	}
	return out;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const art = (nome: string) => (/^[aeiou]/.test(nome) ? `l’${nome}` : nome.startsWith('z') ? `lo ${nome}` : `il ${nome}`);
const quanti = (k: number) => (k === 1 ? '1 elettrone' : `${k} elettroni`);

const f = frame(-3, 3, -3, 3);

export default function OttettoElettroni({ alt }: { alt?: string }) {
	const [k, setK] = useState(5); // sodium
	const [delta, setDelta] = useState(0); // electrons added (negative: taken away)
	const el = ELEMENTS[k];
	const e = el.z + delta;
	const lv = levels(e);
	const outer = lv[lv.length - 1];
	const complete = outer === CAPACITY[lv.length - 1] && lv.length < 4;
	const charge = -delta;
	const min = Math.max(2, el.z - 4) - el.z;
	const max = Math.min(20, el.z + 4) - el.z;

	const neutral = levels(el.z);
	const valence = neutral[neutral.length - 1];
	const target = neutral.length === 1 ? 2 : 8;

	const chargeTex = charge === 0 ? '' : `^{${Math.abs(charge) === 1 ? '' : Math.abs(charge)}${charge > 0 ? '+' : '-'}}`;

	let caption: string;
	if (complete && charge !== 0) {
		caption = `${cap(art(el.nome))} ha ${charge > 0 ? 'ceduto' : 'acquistato'} ${quanti(Math.abs(charge))}: il livello più esterno ora è completo, con ${outer} elettroni, come ${NOBLE[e]}. I protoni sono sempre ${el.z}: è uno ione ${charge > 0 ? 'positivo' : 'negativo'} di ${el.nome}, non un gas nobile.`;
	} else if (charge === 0) {
		const lose = valence;
		const gain = target - valence;
		const short = lose < gain ? `cederne ${lose}` : gain < lose ? `acquistarne ${gain}` : '';
		caption = `${cap(el.nome)}, gruppo ${el.gruppo}: ${quanti(valence)} di valenza. Per avere il livello esterno completo può cederne ${lose} o acquistarne ${gain}${short ? `: la strada più corta è ${short}.` : ': le due strade sono lunghe uguali, e il carbonio di solito non fa né l’una né l’altra cosa: mette in comune i suoi elettroni.'}`;
	} else {
		caption = `Il livello più esterno ha ${quanti(outer)} su ${CAPACITY[lv.length - 1]}: non è completo. ${charge > 0 ? 'Continua a togliere elettroni, oppure torna indietro.' : 'Continua ad aggiungere elettroni, oppure torna indietro.'}`;
	}

	const c = f.px(v(0, 0));
	const unit = f.W / 6;
	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{lv.map((n, i) => {
					const last = i === lv.length - 1;
					return (
						<g key={i}>
							<circle cx={c.x} cy={c.y} r={RADII[i] * unit} fill="none" stroke={last && complete ? INK.green : '#000'} strokeWidth={last && complete ? THICK * 1.5 : THIN} strokeDasharray={last && complete ? undefined : DASH} />
							{Array.from({ length: n }, (_, j) => {
								const p = f.px(polar(RADII[i], Math.PI / 2 - (2 * Math.PI * j) / CAPACITY[i] + i * 0.35));
								return <circle key={j} cx={p.x} cy={p.y} r={5} fill={TINT.blue20} stroke="#000" strokeWidth={THIN} />;
							})}
						</g>
					);
				})}
				<circle cx={c.x} cy={c.y} r={0.45 * unit} fill={TINT.red} stroke="#000" strokeWidth={THICK} />
				<Label f={f} at={v(0, 0)} upright>
					{el.sym}
				</Label>
				<Label f={f} at={v(-2.9, -2.8)} dir={v(1, 0)} upright size={12}>
					{`${el.z} protoni, ${e} elettroni`}
				</Label>
			</Drawing>

			<Readout>
				<span className="text-base">
					<Tex>{`\\mathrm{${el.sym}${chargeTex}}`}</Tex>
				</span>
				<span>{charge === 0 ? 'atomo neutro' : `ione con carica ${charge > 0 ? '+' : '−'}${Math.abs(charge)}`}</span>
				<span>elettroni per livello: {lv.join(', ')}</span>
				<span>{complete ? `livello esterno completo, come ${NOBLE[e]}` : 'livello esterno non completo'}</span>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex flex-wrap justify-center gap-1.5">
					{ELEMENTS.map((x, i) => (
						<button
							key={x.sym}
							type="button"
							onClick={() => {
								setK(i);
								setDelta(0);
							}}
							aria-pressed={i === k}
							aria-label={x.nome}
							className={`min-w-10 rounded-full border px-2.5 py-1 text-sm transition-colors ${i === k ? 'border-accent bg-accent text-white' : 'border-edge text-fg-muted hover:border-fg-muted'}`}
						>
							{x.sym}
						</button>
					))}
				</div>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={delta <= min} onClick={() => setDelta(delta - 1)}>
						Togli un elettrone
					</Button>
					<Button variant="secondary" size="sm" disabled={delta >= max} onClick={() => setDelta(delta + 1)}>
						Aggiungi un elettrone
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
