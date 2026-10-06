'use client';

import { useState, type ReactNode } from 'react';
import { Check, Minus, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ButtonRow, Caption, Controls, Drawing, Figure, FONT, K, Tex, THIN, TINT, frame, v } from '../kit';
import { Sphere } from './sfereDalton';
import { Picker, signColor, signedText } from './chim3-i-nomi';

/**
 * Lesson 76 (Valenza e numero di ossidazione): the student picks a molecule or an ion and gives each element an
 * oxidation number with a plus and a minus. Each row shows the contribution of the element (its number times its
 * atoms); two bars show the total of the positive contributions and of the negative ones, which must be equal in a
 * neutral species and differ by the charge in an ion. "Controlla" says which numbers are wrong and which rule fixes
 * them: a sum that comes out right with the wrong numbers (+2 and -4 in water) is still wrong.
 */

type El = { sym: string; n: number; ox: number; rule?: string };
type Species = { label: string; tex: string; charge: number; els: El[]; how: string };

const H = 'L’idrogeno ha +1 (regola 6).';
const O = 'L’ossigeno ha −2 (regola 7).';
const G1 = (nome: string) => `Il ${nome} è un metallo del gruppo 1: ha sempre +1 (regola 5).`;

const SPECIES: Species[] = [
	{ label: 'H₂O', tex: 'H_2O', charge: 0, els: [{ sym: 'H', n: 2, ox: 1, rule: H }, { sym: 'O', n: 1, ox: -2, rule: O }], how: 'Idrogeno +1 e ossigeno −2: 2 · (+1) + (−2) = 0.' },
	{ label: 'SO₃', tex: 'SO_3', charge: 0, els: [{ sym: 'S', n: 1, ox: 6 }, { sym: 'O', n: 3, ox: -2, rule: O }], how: 'Tre atomi di ossigeno valgono −6: lo zolfo ha +6.' },
	{ label: 'H₂SO₄', tex: 'H_2SO_4', charge: 0, els: [{ sym: 'H', n: 2, ox: 1, rule: H }, { sym: 'S', n: 1, ox: 6 }, { sym: 'O', n: 4, ox: -2, rule: O }], how: '2 · (+1) + x + 4 · (−2) = 0: lo zolfo ha +6.' },
	{ label: 'KMnO₄', tex: 'KMnO_4', charge: 0, els: [{ sym: 'K', n: 1, ox: 1, rule: G1('potassio') }, { sym: 'Mn', n: 1, ox: 7 }, { sym: 'O', n: 4, ox: -2, rule: O }], how: '+1 + x + 4 · (−2) = 0: il manganese ha +7.' },
	{ label: 'K₂Cr₂O₇', tex: 'K_2Cr_2O_7', charge: 0, els: [{ sym: 'K', n: 2, ox: 1, rule: G1('potassio') }, { sym: 'Cr', n: 2, ox: 6 }, { sym: 'O', n: 7, ox: -2, rule: O }], how: '2 + 2x − 14 = 0: i due atomi di cromo valgono +12 insieme, +6 ciascuno.' },
	{ label: 'SO₄²⁻', tex: 'SO_4^{2-}', charge: -2, els: [{ sym: 'S', n: 1, ox: 6 }, { sym: 'O', n: 4, ox: -2, rule: O }], how: 'In uno ione la somma è la carica: x − 8 = −2, lo zolfo ha +6.' },
	{ label: 'NH₄⁺', tex: 'NH_4^+', charge: 1, els: [{ sym: 'N', n: 1, ox: -3 }, { sym: 'H', n: 4, ox: 1, rule: H }], how: 'In uno ione la somma è la carica: x + 4 = +1, l’azoto ha −3.' },
	{ label: 'H₂O₂', tex: 'H_2O_2', charge: 0, els: [{ sym: 'H', n: 2, ox: 1, rule: 'L’idrogeno ha +1 (regola 6), e la regola 6 viene prima di quella sull’ossigeno.' }, { sym: 'O', n: 2, ox: -1 }], how: 'È un perossido: fissato l’idrogeno a +1, l’ossigeno ha −1.' },
	{ label: 'NaH', tex: 'NaH', charge: 0, els: [{ sym: 'Na', n: 1, ox: 1, rule: 'Il sodio è un metallo del gruppo 1: ha sempre +1 (regola 5), e la regola 5 viene prima di quella sull’idrogeno.' }, { sym: 'H', n: 1, ox: -1 }], how: 'È un idruro di un metallo: fissato il sodio a +1, l’idrogeno ha −1.' },
	{ label: 'OF₂', tex: 'OF_2', charge: 0, els: [{ sym: 'O', n: 1, ox: 2 }, { sym: 'F', n: 2, ox: -1, rule: 'Il fluoro ha sempre −1 (regola 4), e la regola 4 viene prima di quella sull’ossigeno.' }], how: 'Fissato il fluoro a −1, l’ossigeno ha +2: solo il fluoro è più elettronegativo di lui.' },
];

const LABELS = SPECIES.map((s) => s.label);
const MIN = -4;
const MAX = 7;
const ROW = 0.8;
const BAR0 = 1.7;
const UNIT = 0.4;
const CAP = 14;
const f = frame(0, 8, 0, 3 * ROW + 1.75);

export default function NumeroOssidazioneCalcola({ alt }: { alt?: string }) {
	const [label, setLabel] = useState(LABELS[0]);
	const [values, setValues] = useState<Record<string, number>>({});
	const [checked, setChecked] = useState(false);
	const sp = SPECIES.find((s) => s.label === label) ?? SPECIES[0];
	const val = (e: El) => values[e.sym] ?? 0;
	const pick = (l: string) => {
		setLabel(l);
		setValues({});
		setChecked(false);
	};
	const change = (e: El, d: number) => {
		setValues({ ...values, [e.sym]: Math.max(MIN, Math.min(MAX, val(e) + d)) });
		setChecked(false);
	};

	const pos = sp.els.reduce((s, e) => s + Math.max(0, val(e) * e.n), 0);
	const neg = sp.els.reduce((s, e) => s + Math.max(0, -val(e) * e.n), 0);
	const sum = pos - neg;
	const wrong = sp.els.filter((e) => val(e) !== e.ox);
	const touched = sp.els.some((e) => val(e) !== 0);
	const target = signedText(sp.charge);
	const top = f.y1 - ((3 - sp.els.length) * ROW) / 2;

	let caption: ReactNode;
	if (checked && wrong.length === 0) caption = <>Giusto. {sp.how}</>;
	else if (checked) {
		const byRule = wrong.find((e) => e.rule);
		caption = byRule ? (
			<>Non ancora. {byRule.rule} Fissato quello, il numero che manca si ricava dalla somma.</>
		) : (
			<>
				Non ancora: la somma fa {signedText(sum)} e deve fare {target}. Correggi il numero di ossidazione di {wrong[0].sym}.
			</>
		);
	} else if (!touched)
		caption = (
			<>
				Dai un numero di ossidazione a ogni elemento di <Tex>{`\\mathrm{${sp.tex}}`}</Tex>. La somma dei contributi deve fare {target}
				{sp.charge !== 0 ? ', la carica dello ione' : ''}.
			</>
		);
	else
		caption = (
			<>
				La somma dei contributi fa {signedText(sum)}; deve fare {target}. Quando pensi di avere i numeri giusti, premi Controlla.
			</>
		);

	const bar = (y: number, total: number, name: string, tint: string, sign: number) => {
		const a = f.px(v(BAR0, y + 0.19));
		const w = Math.min(total, CAP) * UNIT * K;
		const lab = f.px(v(0.1, y));
		const end = f.px(v(BAR0 + Math.min(total, CAP) * UNIT + 0.15, y));
		return (
			<g>
				<text x={lab.x} y={lab.y} dy="0.35em" fontSize={13} fontFamily={FONT} fill="#000">
					{name}
				</text>
				{total > 0 && <rect x={a.x} y={a.y} width={w} height={0.38 * K} fill={tint} stroke="#000" strokeWidth={THIN} />}
				{Array.from({ length: Math.max(0, Math.min(total, CAP) - 1) }, (_, k) => {
					const t = f.px(v(BAR0 + (k + 1) * UNIT, y));
					return <line key={k} x1={t.x} y1={t.y - 0.19 * K} x2={t.x} y2={t.y + 0.19 * K} stroke="#000" strokeWidth={0.3} />;
				})}
				<text x={end.x} y={end.y} dy="0.35em" fontSize={14} fontFamily={FONT} fill={signColor(sign * total)}>
					{signedText(sign * total)}
				</text>
			</g>
		);
	};

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{sp.els.map((e, r) => {
					const y = top - ROW * (r + 0.5);
					const times = f.px(v(1.0, y));
					const ox = f.px(v(2.35, y));
					const contrib = f.px(v(3.25, y));
					const verdict = f.px(v(7.9, y));
					return (
						<g key={e.sym}>
							<Sphere f={f} at={v(0.45, y)} el={e.sym} r={0.28} />
							<text x={times.x} y={times.y} dy="0.35em" fontSize={14} fontFamily={FONT} fill="#000">
								× {e.n}
							</text>
							<text x={ox.x} y={ox.y} dy="0.35em" textAnchor="middle" fontSize={20} fontFamily={FONT} fill={signColor(val(e))}>
								{signedText(val(e))}
							</text>
							<text x={contrib.x} y={contrib.y} dy="0.35em" fontSize={14} fontFamily={FONT} fill="#000">
								{e.n} · ({signedText(val(e))}) = {signedText(e.n * val(e))}
							</text>
							{checked && (
								<text x={verdict.x} y={verdict.y} dy="0.35em" textAnchor="end" fontSize={13} fontFamily={FONT} fill={val(e) === e.ox ? '#008000' : '#ff0000'}>
									{val(e) === e.ox ? 'giusto' : 'da rivedere'}
								</text>
							)}
						</g>
					);
				})}
				<path d={f.path([v(0, 1.6), v(8, 1.6)])} stroke="#000" strokeWidth={0.3} />
				{bar(1.1, pos, 'positivi', TINT.red, 1)}
				{bar(0.45, neg, 'negativi', TINT.blue20, -1)}
			</Drawing>

			<p className="m-0 text-center text-lg text-fg">
				<Tex>{`\\mathrm{${sp.tex}}`}</Tex>
			</p>
			<Caption>{caption}</Caption>

			<Controls>
				<Picker label="Formula" items={LABELS} value={label} onPick={pick} />
				<div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
					{sp.els.map((e) => (
						<div key={e.sym} className="flex items-center gap-1.5">
							<Button variant="secondary" size="sm" aria-label={`Diminuisci il numero di ossidazione di ${e.sym}`} disabled={val(e) === MIN} onClick={() => change(e, -1)}>
								<Minus className="size-4" aria-hidden="true" />
							</Button>
							<span className="min-w-[3.25rem] text-center text-sm tabular-nums text-fg">
								{e.sym}: {signedText(val(e))}
							</span>
							<Button variant="secondary" size="sm" aria-label={`Aumenta il numero di ossidazione di ${e.sym}`} disabled={val(e) === MAX} onClick={() => change(e, 1)}>
								<Plus className="size-4" aria-hidden="true" />
							</Button>
						</div>
					))}
				</div>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={!touched} onClick={() => setChecked(true)}>
						<Check className="size-4" aria-hidden="true" />
						Controlla
					</Button>
					<Button variant="secondary" size="sm" disabled={!touched} onClick={() => pick(label)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Azzera
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
