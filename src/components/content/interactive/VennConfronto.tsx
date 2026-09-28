'use client';

import { useId, useMemo, useState, type KeyboardEvent } from 'react';
import { Check, Eraser, RotateCcw, StepForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Field';
import { frame, Drawing, Figure, ButtonRow, Tex, TINT, INK, type Frame } from './kit';
import { VENN2, VENN3, VennDefs, Zone, VennOutline, zoneAt, zoneCenters, zoneName, zonesOf, type Expr, type Layout } from './insiemi';

/**
 * Two Eulero-Venn diagrams side by side for an equality between sets. On the left the student colours the first
 * member by tapping zones and checks it; on the right the second member is built in steps, its operands hatched one
 * over the other, until its zone is filled. The two coloured zones are the same: that is the property.
 */

export type Identity = { name: string; lhs: Expr; rhs: Expr; sets: 2 | 3 };

const frameOf = (L: Layout) => frame(L.x0 - 0.05, L.x1 + 0.05, L.y0 - 0.05, L.y1 + 0.05);
const LAYOUTS = { 2: VENN2, 3: VENN3 } as const;
const CENTERS = { 2: zoneCenters(VENN2), 3: zoneCenters(VENN3) } as const;

/** How the operands of the second member combine, said in words about the hatching. */
function stepText(e: Expr, step: number): string {
	const [a, b] = e.kids ?? [];
	if (step === 0) return 'Premi «Un passo» per costruire il secondo membro.';
	if (e.op === 'bar') return step === 1 ? `Righe su $${a.tex}$.` : `$${e.tex}$ è tutto ciò che resta senza righe.`;
	if (step === 1) return `Righe inclinate a destra su $${a.tex}$.`;
	if (step === 2) return `Righe inclinate a sinistra su $${b.tex}$.`;
	if (e.op === 'cap') return `$${e.tex}$ è dove le righe si incrociano.`;
	if (e.op === 'cup') return `$${e.tex}$ è dove c'è almeno un tratteggio.`;
	return `$${e.tex}$ è dove ci sono le righe a destra ma non quelle a sinistra.`;
}

/** Text with $…$ pieces set in KaTeX. */
function Rich({ text }: { text: string }) {
	return (
		<>
			{text.split('$').map((part, i) => (i % 2 ? <Tex key={i}>{part}</Tex> : <span key={i}>{part}</span>))}
		</>
	);
}

function Panel({ f, L, id, children, label }: { f: Frame; L: Layout; id: string; children: React.ReactNode; label: string }) {
	return (
		<Drawing f={f} label={label}>
			<VennDefs L={L} f={f} id={id} />
			{children}
		</Drawing>
	);
}

export function VennConfronto({ identities, alt }: { identities: Identity[]; alt?: string }) {
	const [which, setWhich] = useState(0);
	const id = useId().replace(/:/g, '');
	const I = identities[which];
	const L = LAYOUTS[I.sets];
	const n = I.sets;
	const f = useMemo(() => frameOf(L), [L]);
	const centers = CENTERS[n];
	const target = I.lhs.zones(n);

	const [painted, setPainted] = useState(0);
	const [checked, setChecked] = useState<number | null>(null);
	const [step, setStep] = useState(0);
	const steps = I.rhs.op === 'bar' ? 2 : 3;

	const choose = (i: number) => {
		setWhich(i);
		setPainted(0);
		setChecked(null);
		setStep(0);
	};
	const toggle = (z: number) => {
		setPainted((m) => m ^ (1 << z));
		setChecked(null);
	};
	const click = (e: React.MouseEvent<SVGRectElement>) => {
		const svg = e.currentTarget.ownerSVGElement;
		if (!svg) return;
		const z = zoneAt(L, f.toTikz(e, svg));
		if (z !== null) toggle(z);
	};
	const key = (z: number) => (e: KeyboardEvent) => {
		if (e.key !== 'Enter' && e.key !== ' ') return;
		e.preventDefault();
		toggle(z);
	};

	const all = zonesOf((1 << (1 << n)) - 1, n);
	const wrong = checked === null ? [] : all.filter((z) => ((checked ^ target) >> z) & 1);
	const right = checked !== null && wrong.length === 0;
	const [a, b] = I.rhs.kids ?? [];
	const tl = f.px({ x: L.x0, y: L.y1 }), br = f.px({ x: L.x1, y: L.y0 });

	let caption: string;
	if (checked === null) caption = painted ? `Hai colorato ${zonesOf(painted, n).length === 1 ? 'una zona' : `${zonesOf(painted, n).length} zone`}. Quando hai finito, premi «Controlla».` : `Tocca le zone del primo diagramma per colorare $${I.lhs.tex}$.`;
	else if (right) caption = step === steps ? `Le due zone coincidono: $${I.lhs.tex} = ${I.rhs.tex}$.` : `Giusto, questa è $${I.lhs.tex}$. Ora costruisci il secondo membro e confronta.`;
	else {
		const extra = wrong.filter((z) => painted & (1 << z)).length, missing = wrong.length - extra;
		const parts = [extra && `${extra === 1 ? 'una zona colorata non ci va' : `${extra} zone colorate non ci vanno`}`, missing && `${missing === 1 ? 'manca una zona' : `mancano ${missing} zone`}`].filter(Boolean);
		caption = `Non ancora: ${parts.join(' e ')}. Le zone sbagliate hanno una croce.`;
	}

	return (
		<Figure>
			<div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Proprietà da verificare">
				{identities.map((it, i) => (
					<Chip key={it.name} on={i === which} onClick={() => choose(i)}>
						{it.name}
					</Chip>
				))}
			</div>
			<div className="text-center text-fg">
				<Tex display>{`${I.lhs.tex} = ${I.rhs.tex}`}</Tex>
			</div>
			<div className="flex w-full flex-wrap items-start justify-center gap-x-6 gap-y-4">
				<div className="flex flex-col items-center gap-2">
					<div className="text-sm text-fg-muted">
						<Rich text={`Colora tu $${I.lhs.tex}$`} />
					</div>
					<Panel f={f} L={L} id={`${id}l`} label={alt ?? `Diagramma da colorare: ${I.lhs.tex}`}>
						{all.map((z) => painted & (1 << z) ? <Zone key={z} L={L} f={f} id={`${id}l`} z={z} fill={TINT.blue20} /> : null)}
						<VennOutline L={L} f={f} />
						<rect x={tl.x} y={tl.y} width={br.x - tl.x} height={br.y - tl.y} fill="transparent" className="cursor-pointer" onClick={click} />
						{all.map((z) => {
							const p = f.px(centers[z]);
							const on = !!(painted & (1 << z));
							return (
								<g key={z} role="checkbox" aria-checked={on} tabIndex={0} aria-label={`Zona ${zoneName(L, z)}`} onKeyDown={key(z)} onClick={() => toggle(z)} className="group cursor-pointer outline-none">
									<circle cx={p.x} cy={p.y} r={11} fill="none" stroke="#000" strokeWidth={1} className="opacity-0 group-focus-visible:opacity-80" />
								</g>
							);
						})}
						{wrong.map((z) => {
							const p = f.px(centers[z]);
							return <path key={z} d={`M${p.x - 5},${p.y - 5} L${p.x + 5},${p.y + 5} M${p.x + 5},${p.y - 5} L${p.x - 5},${p.y + 5}`} stroke={INK.red} strokeWidth={2} pointerEvents="none" />;
						})}
					</Panel>
					<ButtonRow>
						<Button variant="secondary" size="sm" onClick={() => setChecked(painted)}>
							<Check className="size-4" aria-hidden="true" />
							Controlla
						</Button>
						<Button variant="secondary" size="sm" onClick={() => { setPainted(0); setChecked(null); }} disabled={!painted}>
							<Eraser className="size-4" aria-hidden="true" />
							Cancella
						</Button>
					</ButtonRow>
					<p className="m-0 max-w-[16rem] text-center text-sm text-fg-muted" aria-live="polite">
						<Rich text={caption} />
					</p>
				</div>
				<div className="flex flex-col items-center gap-2">
					<div className="text-sm text-fg-muted">
						<Rich text={`Secondo membro $${I.rhs.tex}$`} />
					</div>
					<Panel f={f} L={L} id={`${id}r`} label={`Secondo membro, costruito a passi: ${I.rhs.tex}`}>
						{step >= steps && zonesOf(I.rhs.zones(n), n).map((z) => <Zone key={`f${z}`} L={L} f={f} id={`${id}r`} z={z} fill={TINT.blue20} />)}
						<g opacity={step >= steps ? 0.35 : 1}>
							{step >= 1 && a && zonesOf(a.zones(n), n).map((z) => <Zone key={`a${z}`} L={L} f={f} id={`${id}r`} z={z} fill={`url(#${id}rh1)`} />)}
							{step >= 2 && b && I.rhs.op !== 'bar' && zonesOf(b.zones(n), n).map((z) => <Zone key={`b${z}`} L={L} f={f} id={`${id}r`} z={z} fill={`url(#${id}rh2)`} />)}
						</g>
						<VennOutline L={L} f={f} />
					</Panel>
					<ButtonRow>
						<Button variant="secondary" size="sm" onClick={() => setStep((s) => (s >= steps ? 0 : s + 1))}>
							{step >= steps ? <RotateCcw className="size-4" aria-hidden="true" /> : <StepForward className="size-4" aria-hidden="true" />}
							{step >= steps ? 'Ricomincia' : 'Un passo'}
						</Button>
					</ButtonRow>
					<p className="m-0 max-w-[16rem] text-center text-sm text-fg-muted" aria-live="polite">
						<Rich text={stepText(I.rhs, step)} />
					</p>
				</div>
			</div>
		</Figure>
	);
}
