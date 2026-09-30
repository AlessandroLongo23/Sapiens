'use client';

import { useRef, useState, type PointerEvent } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { buttonClass } from '@/components/ui/Button';
import { Drawing, Figure, Caption, Controls, ButtonRow, Label, frame, v, add, polar, THIN, DASH, TINT, type V } from '../kit';
import { Block, Ground, Thread, Point, Vector, QTY } from '../fisica';

/**
 * Lesson 53 (Il diagramma delle forze): the student builds the force diagram of a body. Three situations (a book at
 * rest on a table, a crate dragged to the right by a horizontal rope, a lamp hanging from a thread); on the left the
 * situation, on the right the body alone. Under the drawing, a row of forces, some right and some wrong (a force that
 * acts on another body, a "force of motion" that nobody exerts, friction where nothing pushes sideways): the student
 * drags them onto the body, or taps them, and they become arrows from its centre; tapping again takes one away.
 * "Controlla" says whether the diagram is complete, how many forces are missing, and why each wrong one does not act on
 * the body. Arrow lengths are indicative, not to scale.
 */

type Force = { id: string; chip: string; name: string; sub?: string; angle: number; length: number; ok: boolean; why?: string };
type Situation = { key: 'libro' | 'cassa' | 'lampada'; label: string; body: string; forces: Force[] };

const D = Math.PI / 180;
const SITUATIONS: Situation[] = [
	{
		key: 'libro',
		label: 'Libro sul tavolo',
		body: 'sul libro fermo sul tavolo',
		forces: [
			{ id: 'P', chip: 'Peso', name: 'P', angle: -90, length: 1.2, ok: true },
			{ id: 'Fv', chip: 'Reazione del tavolo', name: 'F', sub: 'v', angle: 90, length: 1.2, ok: true },
			{ id: 'libro-tavolo', chip: 'Forza del libro sul tavolo', name: 'F', sub: 'lt', angle: -90, length: 1.2, ok: false, why: 'la forza del libro sul tavolo agisce sul tavolo, non sul libro' },
			{ id: 'attrito', chip: 'Attrito', name: 'F', sub: 's', angle: 180, length: 0.7, ok: false, why: "niente spinge il libro di lato, quindi non c'è attrito" }
		]
	},
	{
		key: 'cassa',
		label: 'Cassa trascinata',
		body: 'sulla cassa trascinata verso destra',
		forces: [
			{ id: 'P', chip: 'Peso', name: 'P', angle: -90, length: 1.2, ok: true },
			{ id: 'Fv', chip: 'Reazione del pavimento', name: 'F', sub: 'v', angle: 90, length: 1.2, ok: true },
			{ id: 'T', chip: 'Tensione della fune', name: 'T', angle: 0, length: 1.1, ok: true },
			{ id: 'Fd', chip: 'Attrito', name: 'F', sub: 'd', angle: 180, length: 0.7, ok: true },
			{ id: 'moto', chip: 'Forza del moto', name: 'F', sub: 'm', angle: 0, length: 0.9, ok: false, why: 'la "forza del moto" non esiste: nessun corpo la esercita' },
			{ id: 'cassa-pav', chip: 'Forza della cassa sul pavimento', name: 'F', sub: 'cp', angle: -90, length: 1.2, ok: false, why: 'la forza della cassa sul pavimento agisce sul pavimento, non sulla cassa' }
		]
	},
	{
		key: 'lampada',
		label: 'Lampada appesa',
		body: 'sulla lampada appesa al filo',
		forces: [
			{ id: 'P', chip: 'Peso', name: 'P', angle: -90, length: 1.1, ok: true },
			{ id: 'T', chip: 'Tensione del filo', name: 'T', angle: 90, length: 1.1, ok: true },
			{ id: 'lampada-filo', chip: 'Forza della lampada sul filo', name: 'F', sub: 'lf', angle: -90, length: 1.1, ok: false, why: 'la forza della lampada sul filo agisce sul filo, non sulla lampada' },
			{ id: 'soffitto', chip: 'Reazione del soffitto', name: 'F', sub: 'v', angle: 90, length: 1.1, ok: false, why: 'il soffitto non tocca la lampada: tiene il filo, e sulla lampada tira solo il filo' }
		]
	}
];

const f = frame(-0.2, 8.2, -1.95, 1.95);
const BODY = v(6, 0.2);
const ZONE = 1.5; // cm around the body where a dropped force lands

/** The situation drawn on the left. */
function Scene({ k }: { k: Situation['key'] }) {
	if (k === 'libro')
		return (
			<>
				<path d={f.path([v(0.3, 0), v(3.3, 0)])} stroke="#000" strokeWidth={2.4} fill="none" />
				<path d={f.path([v(0.6, 0), v(0.6, -1.4)])} stroke="#000" strokeWidth={1.2} fill="none" />
				<path d={f.path([v(3, 0), v(3, -1.4)])} stroke="#000" strokeWidth={1.2} fill="none" />
				<Ground f={f} from={v(0.1, -1.4)} to={v(3.5, -1.4)} />
				<Block f={f} at={v(1.8, 0.03)} w={1.1} h={0.3} />
			</>
		);
	if (k === 'cassa')
		return (
			<>
				<Ground f={f} from={v(0.1, -0.4)} to={v(3.6, -0.4)} />
				<Block f={f} at={v(1.3, -0.4)} w={1} h={0.8} />
				<Thread f={f} from={v(1.8, 0)} to={v(3.3, 0)} />
				<Vector f={f} from={v(0.9, 0.75)} to={v(1.7, 0.75)} color={QTY.velocita} name="v" labelDir={v(1, 0)} />
			</>
		);
	return (
		<>
			<Ground f={f} from={v(3, 1.8)} to={v(0.6, 1.8)} />
			<Thread f={f} from={v(1.8, 1.8)} to={v(1.8, 0.5)} />
			<path d={f.path([v(1.4, 0.1), v(2.2, 0.1), v(1.95, 0.5), v(1.65, 0.5)], true)} fill={TINT.yellow} stroke="#000" strokeWidth={1.2} strokeLinejoin="round" />
		</>
	);
}

/** The body alone on the right: the same shape, smaller for the book. */
function Body({ k }: { k: Situation['key'] }) {
	if (k === 'libro') return <Block f={f} at={v(BODY.x, BODY.y - 0.15)} w={1.1} h={0.3} />;
	if (k === 'cassa') return <Block f={f} at={v(BODY.x, BODY.y - 0.4)} w={0.9} h={0.8} />;
	return <path d={f.path([v(BODY.x - 0.4, BODY.y - 0.2), v(BODY.x + 0.4, BODY.y - 0.2), v(BODY.x + 0.15, BODY.y + 0.2), v(BODY.x - 0.15, BODY.y + 0.2)], true)} fill={TINT.yellow} stroke="#000" strokeWidth={1.2} strokeLinejoin="round" />;
}

type Drag = { id: string; x: number; y: number; x0: number; y0: number; moved: boolean };

export default function DiagrammaForzeCostruisci({ alt }: { alt?: string }) {
	const [key, setKey] = useState<Situation['key']>('libro');
	const [placed, setPlaced] = useState<string[]>([]);
	const [checked, setChecked] = useState(false);
	const [drag, setDrag] = useState<Drag | null>(null);
	const [over, setOver] = useState(false);
	const zone = useRef<SVGCircleElement>(null);
	const dragged = useRef(false);

	const sit = SITUATIONS.find((s) => s.key === key)!;
	const byId = (id: string) => sit.forces.find((F) => F.id === id)!;

	const change = (next: string[]) => {
		setPlaced(next);
		setChecked(false);
	};
	const toggle = (id: string) => change(placed.includes(id) ? placed.filter((x) => x !== id) : [...placed, id]);
	const inZone = (x: number, y: number) => {
		const r = zone.current?.getBoundingClientRect();
		return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
	};

	const chipHandlers = (id: string) => ({
		onPointerDown: (e: PointerEvent<HTMLButtonElement>) => {
			e.currentTarget.setPointerCapture(e.pointerId);
			setDrag({ id, x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, moved: false });
		},
		onPointerMove: (e: PointerEvent<HTMLButtonElement>) => {
			if (!drag || drag.id !== id) return;
			const moved = drag.moved || Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 6;
			setDrag({ ...drag, x: e.clientX, y: e.clientY, moved });
			setOver(moved && inZone(e.clientX, e.clientY));
		},
		onPointerUp: (e: PointerEvent<HTMLButtonElement>) => {
			if (drag?.id === id && drag.moved) {
				dragged.current = true;
				if (inZone(e.clientX, e.clientY) && !placed.includes(id)) change([...placed, id]);
			}
			setDrag(null);
			setOver(false);
		},
		onPointerCancel: () => {
			setDrag(null);
			setOver(false);
		},
		onClick: () => {
			if (dragged.current) {
				dragged.current = false;
				return;
			}
			toggle(id);
		}
	});

	const wrong = placed.map(byId).filter((F) => !F.ok);
	const missing = sit.forces.filter((F) => F.ok && !placed.includes(F.id));
	const complete = wrong.length === 0 && missing.length === 0;

	let caption: string;
	if (!checked) caption = placed.length === 0 ? `Trascina sul corpo, a destra, le forze che agiscono ${sit.body}; tocca una forza per metterla o toglierla.` : 'Quando pensi che il diagramma sia finito, premi Controlla.';
	else if (complete) caption = `Diagramma completo: ${sit.body} agiscono ${sit.forces.filter((F) => F.ok).length} forze, e ci sono tutte.`;
	else {
		const parts: string[] = [];
		if (wrong.length) parts.push(wrong.map((F) => F.why).join('; ') + '.');
		if (missing.length) parts.push(missing.length === 1 ? 'Manca ancora una forza: guarda che cosa tocca il corpo, e non dimenticare il peso.' : `Mancano ancora ${missing.length} forze: guarda che cosa tocca il corpo, e non dimenticare il peso.`);
		caption = parts.join(' ').replace(/^./, (c) => c.toUpperCase());
	}

	// Two forces with the same direction are drawn side by side, so neither hides the other.
	const drawn = placed.map((id, i) => {
		const F = byId(id);
		const twin = placed.slice(0, i).filter((o) => byId(o).angle === F.angle).length;
		const side = polar(0.4 * twin, (F.angle + 90) * D);
		return { F, from: add(BODY, side) as V, wrongShown: checked && !F.ok };
	});

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Scene k={key} />
				<Label f={f} at={v(BODY.x, BODY.y - ZONE - 0.02)} dir={v(0, -1)} upright size={13}>
					{over ? 'lascia qui la forza' : 'il corpo da solo'}
				</Label>
				<circle ref={zone} cx={f.px(BODY).x} cy={f.px(BODY).y} r={ZONE * (f.W / (f.x1 - f.x0))} fill={over ? TINT.green : 'none'} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} opacity={over ? 0.6 : 0.35} />
				<Body k={key} />
				{drawn.map(({ F, from, wrongShown }) => {
					const to = add(from, polar(F.length, F.angle * D));
					return (
						<g key={F.id} opacity={wrongShown ? 0.45 : 1}>
							<Vector f={f} from={from} to={to} color={wrongShown ? '#808080' : QTY.forza} name={F.name} sub={F.sub} dashed={wrongShown} labelDir={F.angle === 90 || F.angle === -90 ? v(1, 0) : v(0, 1)} />
						</g>
					);
				})}
				<Point f={f} at={BODY} />
			</Drawing>

			<div className="flex max-w-lg flex-wrap justify-center gap-2" role="group" aria-label="Forze da mettere sul corpo">
				{sit.forces.map((F) => {
					const on = placed.includes(F.id);
					return (
						<button key={F.id} type="button" aria-pressed={on} className={buttonClass(on ? 'primary' : 'secondary', 'sm', 'touch-none select-none')} {...chipHandlers(F.id)}>
							{F.chip}
						</button>
					);
				})}
			</div>
			{drag?.moved && (
				<div className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-edge-strong bg-surface px-2 py-1 text-sm text-fg shadow-paper" style={{ left: drag.x, top: drag.y }}>
					{byId(drag.id).chip}
				</div>
			)}
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup
						label="Situazione"
						options={SITUATIONS.map((s) => ({ value: s.key, label: s.label }))}
						value={key}
						onChange={(k) => {
							setKey(k);
							change([]);
						}}
					/>
				</div>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={placed.length === 0} onClick={() => setChecked(true)}>
						<Check className="size-4" aria-hidden="true" />
						Controlla
					</Button>
					<Button variant="secondary" size="sm" disabled={placed.length === 0} onClick={() => change([])}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
