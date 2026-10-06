'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, frame, v, texNum, num, INK, THIN, THICK, VERY_THIN, DASH, type V } from '../kit';
import { Arrow } from '../fisica';
import { Words } from '../fisica/calore';

/**
 * Chemistry lesson 56 (Fissione e fusione nucleare): the curve of the binding energy per nucleon against the mass
 * number, and a nucleus chosen on it with a slider. The student decides what to do with it: split it in two equal
 * parts (fission) or join it to another one like it (fusion). The figure reads the binding energies before and after
 * on the curve, draws the two levels as dashed lines with an arrow for the step between them (green upwards: energy
 * released; red downwards: energy absorbed), and says which it is: products higher on the curve, energy out.
 *
 * For every mass number from 1 to 240 the nucleus is the most tightly bound one with that A, with its measured binding
 * energy per nucleon (AME2020, Wang et al., Chinese Physics C 45, 030003, 2021), in keV below. A real fission gives
 * two unequal fragments and a few neutrons; the equal, most bound fragments used here give the total energy, the
 * later β decays of the fragments included (about 200 MeV for uranium-235).
 */

const SYM = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu'.split(' ');
/** Z of the most bound nucleus with mass number A, for A = 1 … 240. */
const Z_OF = [1, 1, 1, 2, 2, 3, 3, 4, 4, 4, 5, 6, 6, 6, 7, 8, 8, 8, 9, 10, 10, 10, 11, 12, 12, 12, 13, 14, 14, 14, 15, 16, 15, 16, 16, 16, 17, 18, 18, 18, 19, 20, 20, 20, 20, 20, 21, 22, 22, 22, 23, 24, 24, 24, 25, 26, 26, 26, 27, 28, 28, 28, 28, 28, 29, 30, 29, 30, 31, 30, 31, 32, 32, 32, 33, 34, 33, 34, 34, 34, 35, 36, 36, 36, 36, 36, 37, 38, 39, 40, 40, 40, 40, 40, 42, 42, 42, 42, 43, 44, 44, 44, 44, 44, 45, 46, 46, 46, 47, 48, 48, 48, 48, 48, 49, 50, 50, 50, 50, 50, 50, 50, 51, 52, 51, 52, 52, 52, 53, 54, 54, 54, 54, 54, 55, 56, 56, 56, 57, 58, 58, 58, 60, 60, 60, 60, 61, 62, 62, 62, 62, 62, 63, 62, 63, 64, 64, 64, 65, 66, 65, 66, 66, 66, 67, 68, 68, 68, 68, 68, 69, 70, 70, 70, 70, 70, 71, 72, 72, 72, 73, 74, 74, 74, 74, 74, 75, 76, 76, 76, 76, 76, 77, 78, 78, 78, 78, 78, 79, 80, 80, 80, 80, 80, 81, 82, 82, 82, 82, 82, 83, 84, 84, 84, 84, 84, 85, 86, 86, 86, 87, 88, 88, 88, 88, 88, 89, 90, 90, 90, 90, 90, 91, 92, 92, 92, 92, 92, 93, 94];
/** Its binding energy per nucleon, keV. */
const KEV = [0, 1112, 2827, 7074, 5512, 5332, 5606, 7062, 6463, 6498, 6928, 7680, 7470, 7520, 7699, 7976, 7751, 7767, 7779, 8032, 7972, 8080, 8111, 8261, 8224, 8334, 8332, 8448, 8449, 8521, 8481, 8493, 8514, 8583, 8538, 8575, 8570, 8614, 8563, 8595, 8576, 8617, 8601, 8658, 8631, 8669, 8665, 8723, 8711, 8756, 8742, 8776, 8760, 8778, 8765, 8790, 8770, 8792, 8768, 8781, 8765, 8795, 8763, 8777, 8757, 8760, 8737, 8756, 8725, 8730, 8718, 8732, 8705, 8725, 8701, 8711, 8696, 8718, 8696, 8711, 8696, 8711, 8696, 8717, 8699, 8712, 8711, 8733, 8714, 8710, 8693, 8693, 8672, 8667, 8649, 8654, 8635, 8635, 8614, 8619, 8601, 8607, 8584, 8587, 8573, 8580, 8561, 8567, 8548, 8551, 8537, 8545, 8527, 8532, 8517, 8523, 8510, 8517, 8499, 8504, 8485, 8488, 8472, 8473, 8458, 8463, 8446, 8449, 8436, 8438, 8424, 8428, 8413, 8414, 8401, 8403, 8392, 8393, 8378, 8376, 8355, 8347, 8330, 8327, 8309, 8304, 8284, 8280, 8263, 8262, 8244, 8244, 8229, 8227, 8217, 8215, 8204, 8202, 8189, 8184, 8174, 8173, 8162, 8159, 8147, 8142, 8132, 8130, 8117, 8112, 8102, 8097, 8087, 8084, 8071, 8064, 8053, 8049, 8039, 8035, 8023, 8018, 8008, 8005, 7993, 7989, 7978, 7974, 7963, 7962, 7951, 7949, 7938, 7936, 7927, 7927, 7916, 7914, 7907, 7906, 7898, 7897, 7887, 7886, 7878, 7875, 7870, 7867, 7849, 7836, 7820, 7810, 7794, 7785, 7768, 7759, 7745, 7739, 7724, 7717, 7703, 7697, 7685, 7680, 7668, 7662, 7651, 7645, 7635, 7631, 7620, 7615, 7605, 7601, 7591, 7586, 7576, 7570, 7561, 7556];

/** Binding energy per nucleon of the nucleus with mass number A, MeV. */
const perNucleon = (A: number) => KEV[A - 1] / 1000;
/** Its whole binding energy, MeV. */
const binding = (A: number) => perNucleon(A) * A;
const tex = (A: number) => `{}^{${A}}\\mathrm{${SYM[Z_OF[A - 1] - 1]}}`;

type Mode = 'fissione' | 'fusione';
const RANGE: Record<Mode, [number, number]> = { fissione: [2, 238], fusione: [1, 119] };

const SX = 0.03, SY = 0.42; // cm per mass number, cm per MeV
const f = frame(-0.75, 240 * SX + 0.55, -0.65, 9.2 * SY + 0.45);
const at = (A: number): V => v(A * SX, perNucleon(A) * SY);
const CURVE = f.path(Array.from({ length: 240 }, (_, i) => at(i + 1)));
const BLUE = '#3333ff';

export default function FissioneFusioneCurva({ alt }: { alt?: string }) {
	const [mode, setMode] = useState<Mode>('fissione');
	const [A, setA] = useState(235);

	const [lo, hi] = RANGE[mode];
	const choose = (m: Mode) => {
		setMode(m);
		setA(Math.min(RANGE[m][1], Math.max(RANGE[m][0], A)));
	};

	// what forms: two halves (equal, or differing by one), or one nucleus twice as heavy
	const products = mode === 'fissione' ? [Math.floor(A / 2), Math.ceil(A / 2)] : [2 * A];
	const before = mode === 'fissione' ? binding(A) : 2 * binding(A);
	const after = products.reduce((s, p) => s + binding(p), 0);
	const energy = after - before; // MeV released (negative: absorbed)
	const nucleons = mode === 'fissione' ? A : 2 * A;
	const released = energy > 0.05;
	const reaction = mode === 'fissione' ? `${tex(A)} \\longrightarrow ${products[0] === products[1] ? `2\\,${tex(products[0])}` : `${tex(products[0])} + ${tex(products[1])}`}` : `2\\,${tex(A)} \\longrightarrow ${tex(2 * A)}`;

	const verb = mode === 'fissione' ? 'Dividere questo nucleo' : 'Fondere due nuclei come questo';
	let caption: string;
	if (Math.abs(energy) <= 0.05) caption = 'Prima e dopo i nucleoni sono legati quasi allo stesso modo: la reazione non libera e non assorbe energia in modo apprezzabile.';
	else if (released) caption = `I nuclei che si formano stanno più in alto sulla curva: i nucleoni sono legati di più e la differenza esce come energia, ${num(energy, energy < 10 ? 1 : 0)} MeV, cioè ${num(energy / nucleons, 2)} MeV per nucleone.`;
	else caption = `${verb} porta più in basso sulla curva: i nucleoni finirebbero legati di meno, e la reazione assorbe ${num(-energy, -energy < 10 ? 1 : 0)} MeV invece di liberarli.`;

	const pA = f.px(at(A));
	// the two levels, before and after, as dashed lines, and the step between them as an arrow
	const yBefore = (before / nucleons) * SY;
	const yAfter = (after / nucleons) * SY;
	const xArrow = Math.max(0.45, ((A + products[products.length - 1]) / 2) * SX);
	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([v(0, 9.2 * SY + 0.2), v(0, 0), v(240 * SX + 0.3, 0)])} fill="none" stroke="#000" strokeWidth={THIN} />
				{[50, 100, 150, 200].map((a) => (
					<g key={a}>
						<path d={f.path([v(a * SX, 0), v(a * SX, -0.07)])} stroke="#000" strokeWidth={THIN} />
						<Words f={f} at={v(a * SX, -0.25)} size={11}>
							{a}
						</Words>
					</g>
				))}
				<Words f={f} at={v(120 * SX, -0.52)} size={11}>
					numero di massa A
				</Words>
				{[2, 4, 6, 8].map((e) => (
					<g key={e}>
						<path d={f.path([v(0, e * SY), v(240 * SX, e * SY)])} stroke="#000" strokeWidth={VERY_THIN} strokeDasharray="1 3" />
						<Words f={f} at={v(-0.1, e * SY)} anchor="end" size={11}>
							{e}
						</Words>
					</g>
				))}
				<Words f={f} at={v(-0.65, 9.2 * SY + 0.3)} anchor="start" size={11}>
					E/A (MeV)
				</Words>
				<path d={CURVE} fill="none" stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
				<path d={f.path([v(0, yBefore), v(240 * SX, yBefore)])} stroke={INK.orange} strokeWidth={THIN} strokeDasharray={DASH} />
				<path d={f.path([v(0, yAfter), v(240 * SX, yAfter)])} stroke={BLUE} strokeWidth={THIN} strokeDasharray={DASH} />
				{Math.abs(yAfter - yBefore) > 0.08 && <Arrow f={f} from={v(xArrow, yBefore)} to={v(xArrow, yAfter)} color={released ? INK.green : INK.red} weight="thick" />}
				{products.map((p, i) => {
					const c = f.px(at(p));
					return <circle key={i} cx={c.x} cy={c.y} r={4.5} fill={BLUE} stroke="#000" strokeWidth={THIN} />;
				})}
				<circle cx={pA.x} cy={pA.y} r={5} fill={INK.orange} stroke="#000" strokeWidth={THIN} />
				<circle cx={f.px(v(3.1, 1.9)).x} cy={f.px(v(3.1, 1.9)).y} r={5} fill={INK.orange} stroke="#000" strokeWidth={THIN} />
				<Words f={f} at={v(3.3, 1.9)} anchor="start" size={12}>
					il nucleo scelto
				</Words>
				<circle cx={f.px(v(3.1, 1.4)).x} cy={f.px(v(3.1, 1.4)).y} r={4.5} fill={BLUE} stroke="#000" strokeWidth={THIN} />
				<Words f={f} at={v(3.3, 1.4)} anchor="start" size={12}>
					quello che si forma
				</Words>
				<Words f={f} at={v(3.3, 0.9)} anchor="start" size={12} color={released ? INK.green : INK.red}>
					{Math.abs(energy) <= 0.05 ? 'energia: nessuna' : released ? 'energia liberata' : 'energia assorbita'}
				</Words>
			</Drawing>

			<Readout>
				<span className="text-base">
					<Tex>{reaction}</Tex>
				</span>
				<span>
					prima: <Tex>{`${texNum(before / nucleons, 2)}\\,\\text{MeV}`}</Tex> per nucleone
				</span>
				<span>
					dopo: <Tex>{`${texNum(after / nucleons, 2)}\\,\\text{MeV}`}</Tex> per nucleone
				</span>
				<span>
					{energy >= 0 ? 'energia liberata' : 'energia assorbita'}: <Tex>{`${texNum(Math.abs(energy), Math.abs(energy) < 10 ? 1 : 0)}\\,\\text{MeV}`}</Tex>
				</span>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup
						label="Che cosa fare del nucleo"
						value={mode}
						onChange={choose}
						options={[
							{ value: 'fissione', label: 'Dividi in due' },
							{ value: 'fusione', label: 'Fondi due uguali' }
						]}
					/>
				</div>
				<Slider label="Numero di massa A" value={A} min={lo} max={hi} step={1} onChange={setA} />
			</Controls>
		</Figure>
	);
}
