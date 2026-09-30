'use client';

import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Drawing, Figure, Caption, Controls, Readout, Tex, frame, v, TINT, THIN } from '../kit';

/**
 * Lesson 42 (Numero atomico, numero di massa e isotopi): an atom built by adding and removing protons, neutrons and
 * electrons, up to twelve protons. The nucleus is a cluster of balls (protons red, neutrons grey) laid on a sunflower
 * spiral, the electrons small blue balls scattered in a pale cloud around it: no shells, which are third-year matter.
 *
 * Read under the drawing: the element (from the protons alone), the full symbol with A and Z and the charge, whether it
 * is a neutral atom, a cation or an anion, and the isotope's name with whether its nucleus is stable. The stable
 * nuclides of the first twelve elements are listed below (IUPAC, "Isotopic compositions of the elements", 2021); every
 * other combination is an unstable nucleus, or one that does not exist.
 */

const ELEMENTS = [
	{ sym: 'H', nome: 'idrogeno' },
	{ sym: 'He', nome: 'elio' },
	{ sym: 'Li', nome: 'litio' },
	{ sym: 'Be', nome: 'berillio' },
	{ sym: 'B', nome: 'boro' },
	{ sym: 'C', nome: 'carbonio' },
	{ sym: 'N', nome: 'azoto' },
	{ sym: 'O', nome: 'ossigeno' },
	{ sym: 'F', nome: 'fluoro' },
	{ sym: 'Ne', nome: 'neon' },
	{ sym: 'Na', nome: 'sodio' },
	{ sym: 'Mg', nome: 'magnesio' }
];
/** Mass numbers of the stable isotopes, by Z. */
const STABLE: Record<number, number[]> = { 1: [1, 2], 2: [3, 4], 3: [6, 7], 4: [9], 5: [10, 11], 6: [12, 13], 7: [14, 15], 8: [16, 17, 18], 9: [19], 10: [20, 21, 22], 11: [23], 12: [24, 25, 26] };
const MAX = { p: 12, n: 16, e: 14 };

const f = frame(-3, 3, -3, 3);
const R = 0.17; // a nucleon's radius
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/** The nucleons in the order they are drawn: protons and neutrons interleaved, so both show all over the nucleus. */
function nucleons(p: number, n: number): ('p' | 'n')[] {
	const out: ('p' | 'n')[] = [];
	let i = 0, j = 0;
	while (i < p || j < n) {
		// the kind that is behind in proportion goes next
		if (j >= n || (i < p && i * (n + 1) <= j * (p + 1))) {
			out.push('p');
			i++;
		} else {
			out.push('n');
			j++;
		}
	}
	return out;
}

/** Where the k-th of `total` nucleons goes: a sunflower spiral, the last ones on top. */
const spot = (k: number) => {
	const r = R * 1.45 * Math.sqrt(k);
	return v(r * Math.cos(k * GOLDEN), r * Math.sin(k * GOLDEN));
};

/** Where the k-th electron goes: scattered in the cloud, at radii between 1,55 and 2,4. */
const electronSpot = (k: number) => {
	const r = 1.55 + 0.85 * ((k * 0.618034) % 1);
	const a = k * GOLDEN + 0.9;
	return v(r * Math.cos(a), r * Math.sin(a));
};

function Counter({ name, one, value, max, onChange }: { name: string; one: string; value: number; max: number; onChange: (x: number) => void }) {
	return (
		<div className="flex items-center justify-between gap-3">
			<span className="text-sm text-fg">{name}</span>
			<div className="flex items-center gap-2">
				<Button variant="secondary" size="sm" aria-label={`Togli un ${one}`} disabled={value <= 0} onClick={() => onChange(value - 1)}>
					<Minus className="size-4" aria-hidden="true" />
				</Button>
				<span className="w-8 text-center font-mono text-sm tabular-nums text-fg" aria-live="polite">
					{value}
				</span>
				<Button variant="secondary" size="sm" aria-label={`Aggiungi un ${one}`} disabled={value >= max} onClick={() => onChange(value + 1)}>
					<Plus className="size-4" aria-hidden="true" />
				</Button>
			</div>
		</div>
	);
}

export default function CostruisciAtomo({ alt }: { alt?: string }) {
	const [p, setP] = useState(6);
	const [n, setN] = useState(6);
	const [e, setE] = useState(6);

	const A = p + n;
	const charge = p - e;
	const el = p > 0 ? ELEMENTS[p - 1] : null;
	const chargeTex = charge === 0 ? '' : `^{${Math.abs(charge) === 1 ? '' : Math.abs(charge)}${charge > 0 ? '+' : '-'}}`;
	const symbolTex = el ? `{}^{${A}}_{${p}}\\mathrm{${el.sym}${chargeTex}}` : '';
	const stable = el ? STABLE[p].includes(A) : false;

	const kindText = charge === 0 ? 'atomo neutro' : charge > 0 ? `catione, con ${charge} ${charge === 1 ? 'elettrone' : 'elettroni'} in meno dei protoni` : `anione, con ${-charge} ${charge === -1 ? 'elettrone' : 'elettroni'} in più dei protoni`;

	let caption: string;
	if (!el) caption = 'Senza protoni non c’è nessun elemento: aggiungi almeno un protone. È il numero di protoni a dire di che elemento si tratta.';
	else if (stable)
		caption = `${el.nome.charAt(0).toUpperCase() + el.nome.slice(1)}-${A}: ${p} protoni e ${n} neutroni formano un nucleo stabile, un isotopo presente in natura. ${charge === 0 ? 'Con ' + e + ' elettroni l’atomo è neutro.' : 'La carica è ' + (charge > 0 ? '+' : '−') + Math.abs(charge) + ': è uno ione.'}`;
	else caption = `${el.nome.charAt(0).toUpperCase() + el.nome.slice(1)}-${A}: con ${p} protoni e ${n} neutroni il nucleo non è stabile, e ${n < p || n > p + 4 ? 'non si trova in natura' : 'dopo un po’ si trasforma in un altro (è la radioattività)'}. Cambia il numero di neutroni per trovare un isotopo stabile.`;

	const order = nucleons(p, n);
	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<circle cx={f.px(v(0, 0)).x} cy={f.px(v(0, 0)).y} r={2.75 * (f.W / 6)} fill={TINT.blue} opacity={0.55} />
				{order.map((kind, k) => {
					const c = f.px(spot(order.length - 1 - k));
					return (
						<g key={k}>
							<circle cx={c.x} cy={c.y} r={R * (f.W / 6)} fill={kind === 'p' ? TINT.red : TINT.gray} stroke="#000" strokeWidth={THIN} />
							{kind === 'p' && (
								<text x={c.x} y={c.y} dy="0.33em" textAnchor="middle" fontSize={9} fill="#000" pointerEvents="none">
									+
								</text>
							)}
						</g>
					);
				})}
				{Array.from({ length: e }, (_, k) => {
					const c = f.px(electronSpot(k));
					return <circle key={k} cx={c.x} cy={c.y} r={4} fill={TINT.blue20} stroke="#000" strokeWidth={THIN} />;
				})}
			</Drawing>

			<Readout>
				{el ? (
					<>
						<span className="text-base">
							<Tex>{symbolTex}</Tex>
						</span>
						<span>
							{el.nome} ({el.sym}), <Tex>{`Z = ${p}`}</Tex>, <Tex>{`A = ${A}`}</Tex>
						</span>
						<span>{kindText}</span>
						<span>{stable ? `${el.nome}-${A}: isotopo stabile` : `${el.nome}-${A}: nucleo instabile`}</span>
					</>
				) : (
					<span>nessun elemento</span>
				)}
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Counter name="Protoni" one="protone" value={p} max={MAX.p} onChange={setP} />
				<Counter name="Neutroni" one="neutrone" value={n} max={MAX.n} onChange={setN} />
				<Counter name="Elettroni" one="elettrone" value={e} max={MAX.e} onChange={setE} />
			</Controls>
		</Figure>
	);
}
