'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SIMPLE, binarySalt, chargeTex, gcd, metal, saltTex, stable } from '@/lib/exercises/v2/chim3-j';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, FONT, K, THIN } from '../kit';
import { Sphere } from './sfereDalton';

/**
 * Lesson 81 (I sali binari): the formula of a binary salt from the charges of its ions. The student picks a cation
 * and an anion and adds ions one at a time; every ion is a sphere with as many small squares under it as it has
 * charges (red with a plus, blue with a minus). The figure writes the two totals; when they are equal and the ions
 * are in the smallest ratio it gives the formula and the three names, otherwise it says how many charges are left,
 * or that the formula can be reduced.
 *
 * The squares carry their sign, so the colour is not the only information (the dark theme changes it).
 */

const CATIONS: [string, number][] = [['Na', 1], ['Ca', 2], ['Al', 3], ['Fe', 2], ['Fe', 3], ['Cu', 1], ['Cu', 2], ['Sn', 4]];
const MAX = 6;
const COL = 1.25;
const f = frame(0, 1.9 + MAX * COL, 0, 3.3);

function Row({ y, sym, charge, sign, n, title }: { y: number; sym: string; charge: number; sign: 1 | -1; n: number; title: string }) {
	const s = 0.24;
	return (
		<g>
			<Label f={f} at={v(0.1, y + 0.1)} dir={v(1, 0)} upright size={13}>
				{title}
			</Label>
			{Array.from({ length: n }, (_, k) => {
				const x = 2.4 + k * COL;
				return (
					<g key={k}>
						<Sphere f={f} at={v(x, y + 0.25)} el={sym} r={0.26} />
						{Array.from({ length: charge }, (_, c) => {
							const p = f.px(v(x + (c - (charge - 1) / 2) * (s + 0.03) - s / 2, y - 0.17));
							return (
								<g key={c}>
									<rect x={p.x} y={p.y} width={s * K} height={s * K} fill={sign > 0 ? '#ffb3b3' : '#b3b3ff'} stroke="#000" strokeWidth={THIN} />
									<text x={p.x + (s * K) / 2} y={p.y + (s * K) / 2} dy="0.35em" textAnchor="middle" fontSize={11} fontFamily={FONT} fill="#000">
										{sign > 0 ? '+' : '−'}
									</text>
								</g>
							);
						})}
					</g>
				);
			})}
		</g>
	);
}

export default function SaliBinariBilanciaCariche({ alt }: { alt?: string }) {
	const [ci, setCi] = useState(1);
	const [ai, setAi] = useState(1);
	const [nCat, setNCat] = useState(1);
	const [nAn, setNAn] = useState(1);
	const [sym, q] = CATIONS[ci];
	const m = metal(sym);
	const a = SIMPLE[ai];
	const pos = nCat * q;
	const neg = nAn * a.charge;
	const even = pos === neg && pos > 0;
	const lowest = even && gcd(nCat, nAn) === 1;
	const salt = binarySalt(m, q, a);
	const reset = () => {
		setNCat(1);
		setNAn(1);
	};

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Row y={2.2} sym={sym} charge={q} sign={1} n={nCat} title="cationi" />
				<Row y={0.6} sym={a.sym} charge={a.charge} sign={-1} n={nAn} title="anioni" />
			</Drawing>

			<Readout>
				<span>
					cariche positive: <Tex>{`${nCat} \\cdot (+${q}) = ${pos === 0 ? '0' : `+${pos}`}`}</Tex>
				</span>
				<span>
					cariche negative: <Tex>{`${nAn} \\cdot (-${a.charge}) = ${neg === 0 ? '0' : `-${neg}`}`}</Tex>
				</span>
			</Readout>
			{lowest && (
				<>
					<p className="m-0 text-center text-lg text-fg">
						<Tex>{`\\mathrm{${salt.tex}}`}</Tex>
					</p>
					<Readout>
						<span>tradizionale: {salt.trad}</span>
						<span>Stock: {salt.stock}</span>
						<span>IUPAC: {salt.iupac}</span>
					</Readout>
				</>
			)}
			<Caption>
				{pos === 0 && neg === 0 ? (
					<>Aggiungi cationi e anioni finché le cariche positive e quelle negative sono pari.</>
				) : !even ? (
					<>
						Non è ancora neutro: {Math.abs(pos - neg) === 1 ? 'resta 1 carica' : `restano ${Math.abs(pos - neg)} cariche`} {Math.abs(pos - neg) === 1 ? (pos > neg ? 'positiva' : 'negativa') : pos > neg ? 'positive' : 'negative'} da compensare.
					</>
				) : !lowest ? (
					<>
						Le cariche sono pari, ma la formula <Tex>{`\\mathrm{${saltTex(sym, nCat, false, a.sym, nAn, false)}}`}</Tex> si può semplificare: lo stesso rapporto si ha con {nCat / gcd(nCat, nAn)} e {nAn / gcd(nCat, nAn)}.
					</>
				) : (
					<>
						Neutro, con il rapporto più piccolo: {nCat === 1 ? 'uno ione' : `${nCat} ioni`} <Tex>{`\\mathrm{${sym}${chargeTex(q)}}`}</Tex> e {nAn === 1 ? 'uno ione' : `${nAn} ioni`} <Tex>{`\\mathrm{${a.sym}${chargeTex(-a.charge)}}`}</Tex>.
						{stable(m, q, a) ? '' : ' Questo sale in realtà non è stabile: formula e nomi seguono comunque le regole.'}
					</>
				)}
			</Caption>

			<Controls>
				<ButtonRow>
					{CATIONS.map(([s, c], k) => (
						<Button
							key={`${s}${c}`}
							variant={k === ci ? 'primary' : 'secondary'}
							size="sm"
							aria-pressed={k === ci}
							aria-label={`ione ${metal(s).nome} ${c}+`}
							onClick={() => {
								setCi(k);
								reset();
							}}
						>
							<Tex>{`\\mathrm{${s}${chargeTex(c)}}`}</Tex>
						</Button>
					))}
				</ButtonRow>
				<ButtonRow>
					{SIMPLE.map((x, k) => (
						<Button
							key={x.sym}
							variant={k === ai ? 'primary' : 'secondary'}
							size="sm"
							aria-pressed={k === ai}
							aria-label={`ione ${x.nome}`}
							onClick={() => {
								setAi(k);
								reset();
							}}
						>
							<Tex>{`\\mathrm{${x.sym}${chargeTex(-x.charge)}}`}</Tex>
						</Button>
					))}
				</ButtonRow>
				<div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
					<div className="flex items-center gap-1.5">
						<Button variant="secondary" size="sm" aria-label="Togli un catione" disabled={nCat === 0} onClick={() => setNCat(nCat - 1)}>
							<Minus className="size-4" aria-hidden="true" />
						</Button>
						<span className="min-w-[5.5rem] text-center text-sm text-fg">cationi: {nCat}</span>
						<Button variant="secondary" size="sm" aria-label="Aggiungi un catione" disabled={nCat === MAX} onClick={() => setNCat(nCat + 1)}>
							<Plus className="size-4" aria-hidden="true" />
						</Button>
					</div>
					<div className="flex items-center gap-1.5">
						<Button variant="secondary" size="sm" aria-label="Togli un anione" disabled={nAn === 0} onClick={() => setNAn(nAn - 1)}>
							<Minus className="size-4" aria-hidden="true" />
						</Button>
						<span className="min-w-[5.5rem] text-center text-sm text-fg">anioni: {nAn}</span>
						<Button variant="secondary" size="sm" aria-label="Aggiungi un anione" disabled={nAn === MAX} onClick={() => setNAn(nAn + 1)}>
							<Plus className="size-4" aria-hidden="true" />
						</Button>
					</div>
				</div>
			</Controls>
		</Figure>
	);
}
