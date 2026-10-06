'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { AMMONIUM, OXOACIDS, acidTex, acidTrad, chargeTex, metal, oxoanion, ternarySalt, type Metal } from '@/lib/exercises/v2/chim3-j';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, THICK, TINT } from '../kit';
import { Formula } from './chim3-J-formula';

/**
 * Lesson 82 (I sali ternari): from the oxoacid to the salt. The student picks an oxoacid, how many of its hydrogen
 * atoms leave as H⁺ and the cation that takes their place. Three boxes, one under the other: the acid, the anion
 * left with its charge, the salt. Under the drawing, how many cations and anions make a neutral unit and the three
 * names; when the anion keeps some hydrogen the figure says the salt is an acid salt.
 */

const ACIDS = ['carbonico', 'nitroso', 'nitrico', 'solforoso', 'solforico', 'fosforico', 'ipocloroso', 'perclorico'].map((t) => OXOACIDS.find((a) => a.trad === t)!);
const CATIONS: [Metal, number][] = [
	[metal('Na'), 1],
	[metal('K'), 1],
	[metal('Ca'), 2],
	[metal('Al'), 3],
	[metal('Fe'), 2],
	[metal('Fe'), 3],
	[metal('Cu'), 2],
	[AMMONIUM, 1],
];

const W = 7.6;
const f = frame(0, W, 0, 5.9);
const BOX = { w: 5.6, h: 1.25 };

function Box({ y, title, tex, name, tint }: { y: number; title: string; tex: string; name: string; tint: string }) {
	const p = f.px(v((W - BOX.w) / 2, y + BOX.h / 2));
	const s = f.px(v((W + BOX.w) / 2, y - BOX.h / 2));
	return (
		<g>
			<rect x={p.x} y={p.y} width={s.x - p.x} height={s.y - p.y} rx={3} fill={tint} stroke="#000" strokeWidth={THICK} />
			<Label f={f} at={v((W - BOX.w) / 2 + 0.1, y + BOX.h / 2 - 0.22)} dir={v(1, 0)} upright size={11}>
				{title}
			</Label>
			<Formula f={f} at={v(W / 2, y + 0.12)} tex={tex} size={19} />
			<Label f={f} at={v(W / 2, y - 0.36)} upright size={13}>
				{name}
			</Label>
		</g>
	);
}

function Arrow({ y0, y1, text }: { y0: number; y1: number; text: string }) {
	const a = f.px(v(W / 2, y0));
	const b = f.px(v(W / 2, y1));
	return (
		<g>
			<path d={`M${a.x},${a.y} L${b.x},${b.y}`} stroke="#000" strokeWidth={THICK} />
			<path d={`M${b.x - 4},${b.y - 7} L${b.x},${b.y} L${b.x + 4},${b.y - 7}`} stroke="#000" strokeWidth={THICK} fill="none" />
			<Formula f={f} at={v(W / 2 + 1.35, (y0 + y1) / 2)} tex={text} size={13} />
		</g>
	);
}

export default function SaliTernariAcidoMetallo({ alt }: { alt?: string }) {
	const [ai, setAi] = useState(4);
	const [removed, setRemoved] = useState(2);
	const [ci, setCi] = useState(0);
	const acid = ACIDS[ai];
	const out = Math.min(removed, acid.h);
	const an = oxoanion(acid, acid.h - out);
	const [m, q] = CATIONS[ci];
	const salt = ternarySalt(m, q, an);
	const cat = `${m.sym}${chargeTex(q)}`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Box y={5.1} title="acido" tex={acidTex(acid)} name={acidTrad(acid)} tint={TINT.orange} />
				<Arrow y0={4.4} y1={3.65} text={out === 1 ? '− H^+' : `− ${out} H^+`} />
				<Box y={2.95} title="anione" tex={`${an.tex}${chargeTex(-an.charge)}`} name={`ione ${an.trad}`} tint={TINT.blue} />
				<Arrow y0={2.25} y1={1.5} text={`+ ${cat}`} />
				<Box y={0.8} title={an.kept > 0 ? 'sale acido' : 'sale'} tex={salt.tex} name={salt.trad} tint={TINT.green} />
			</Drawing>

			<Readout>
				<span>tradizionale: {salt.trad}</span>
				<span>Stock: {salt.stock}</span>
				<span>IUPAC: {salt.iupac}</span>
			</Readout>
			<Caption>
				L’acido perde {out === 1 ? 'uno ione' : `${out} ioni`} <Tex>{'\\mathrm{H^+}'}</Tex> e l’anione ha carica <Tex>{`${an.charge}-`}</Tex>. Per compensare {salt.nCat === 1 ? 'un catione' : `${salt.nCat} cationi`} <Tex>{`\\mathrm{${cat}}`}</Tex> {salt.nAn === 1 ? 'serve' : 'servono'} {salt.nAn === 1 ? 'un anione' : `${salt.nAn} anioni`}: <Tex>{`${salt.nCat} \\cdot (+${q}) + ${salt.nAn} \\cdot (-${an.charge}) = 0`}</Tex>.
				{an.kept > 0 ? ` All’anione ${an.kept === 1 ? 'resta un atomo' : `restano ${an.kept} atomi`} di idrogeno: è un sale acido.` : ''}
			</Caption>

			<Controls>
				<ButtonRow>
					{ACIDS.map((a, k) => (
						<Button
							key={a.trad}
							variant={k === ai ? 'primary' : 'secondary'}
							size="sm"
							aria-pressed={k === ai}
							aria-label={acidTrad(a)}
							onClick={() => {
								setAi(k);
								setRemoved(a.h);
							}}
						>
							<Tex>{`\\mathrm{${acidTex(a)}}`}</Tex>
						</Button>
					))}
				</ButtonRow>
				<ButtonRow>
					{Array.from({ length: acid.h }, (_, k) => k + 1).map((k) => (
						<Button key={k} variant={k === out ? 'primary' : 'secondary'} size="sm" aria-pressed={k === out} onClick={() => setRemoved(k)}>
							{k === 1 ? 'toglie 1 H' : `toglie ${k} H`}
						</Button>
					))}
				</ButtonRow>
				<ButtonRow>
					{CATIONS.map(([c, charge], k) => (
						<Button key={`${c.sym}${charge}`} variant={k === ci ? 'primary' : 'secondary'} size="sm" aria-pressed={k === ci} aria-label={`ione ${c.nome} ${charge}+`} onClick={() => setCi(k)}>
							<Tex>{`\\mathrm{${c.sym}${chargeTex(charge)}}`}</Tex>
						</Button>
					))}
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
