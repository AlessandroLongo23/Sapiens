'use client';

import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { cn } from '@/lib/utils/cn';
import { vale, type Condizione } from '@/lib/informatica/responsive';
import { ButtonRow, Caption } from '../kit';
import { Figura } from '../informatica';
import { MOSSA, posto, useLarghezza, usePosti } from './impaginazione';

/**
 * "A quale larghezza la pagina del gruppo passa da una colonna a due, e quale regola del foglio di stile lo
 * decide?" The page of the band drawn as its blocks, in a window whose width the student moves from a phone's to a
 * computer's. The two dashed lines are the widths the media queries name: when the edge of the window crosses one,
 * the blocks move, and the style sheet under the page says which of its rules hold now.
 *
 * The page is laid out by the browser at its real width in a hidden copy, and drawn smaller, to scale
 * (impaginazione.tsx): what moves is what CSS would move.
 */

const MIN = 320, MAX = 1000;
const TABLET: Condizione = { tipo: 'min-width', px: 600 };
const COMPUTER: Condizione = { tipo: 'min-width', px: 900 };
/** The page at its tallest, on a phone: the drawing keeps this height so nothing under it moves. */
const ALTA = 720;

const BLOCCHI = [
	{ id: 'header', nome: 'header' },
	{ id: 'nav', nome: 'nav' },
	{ id: 'main', nome: 'main' },
	{ id: 'aside', nome: 'aside' },
	{ id: 'c1', nome: 'article' },
	{ id: 'c2', nome: 'article' },
	{ id: 'c3', nome: 'article' },
	{ id: 'footer', nome: 'footer' }
] as const;

const PROVE = [
	{ nome: 'Telefono', px: 360 },
	{ nome: 'Tablet', px: 768 },
	{ nome: 'Computer', px: 1000 }
] as const;

const b = (testo: string): ReactNode => <b className="font-mono font-medium whitespace-nowrap text-fg">{testo}</b>;

/** A block of the style sheet, with whether it holds at this width. */
function Blocco({ stato, children }: { stato: 'sempre' | 'attiva' | 'spenta'; children: ReactNode }) {
	const on = stato !== 'spenta';
	return (
		<div data-regola={stato} className={cn('relative rounded-lg border-[1.5px] px-2.5 py-1.5 motion-safe:transition-colors motion-safe:duration-300', stato === 'attiva' ? 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft' : stato === 'sempre' ? 'border-edge-strong bg-surface' : 'border-dashed border-edge bg-transparent')}>
			<div className={cn('overflow-hidden font-mono text-[11.5px] leading-[1.65] whitespace-pre', on ? 'text-fg-strong' : 'text-fg-faint')}>{children}</div>
			<span className={cn('label-mono absolute top-2 right-2.5', stato === 'attiva' ? 'text-tint-fg' : 'text-fg-subtle')}>{stato === 'sempre' ? 'vale sempre' : stato === 'attiva' ? 'attiva' : 'non attiva'}</span>
		</div>
	);
}

export default function MediaQueryLarghezza({ alt }: { alt?: string }) {
	const [larghezza, setLarghezza] = useState(360);
	const tablet = vale(TABLET, larghezza);
	const computer = vale(COMPUTER, larghezza);

	const [box, misurata] = useLarghezza<HTMLDivElement>();
	const k = Math.min(520, misurata || 300) / MAX; // pixels of the drawing for one pixel of the page
	const [copia, posti] = usePosti<HTMLDivElement>(`${larghezza}`);
	const pagina = posti.get('pagina');

	return (
		<Figura>
			<div ref={box} className="flex w-full justify-center">
				<div className="relative" style={{ width: MAX * k, height: ALTA * k + 22 }} role="img" aria-label={alt ?? `La pagina in una finestra larga ${larghezza} pixel: ${tablet ? 'main e aside affiancati' : 'main e aside uno sotto l’altro'}, ${computer ? 'i tre concerti in riga' : 'i tre concerti in colonna'}`}>
					{/* the page at its real width, laid out by the browser and never seen */}
					<div aria-hidden="true" className="invisible absolute top-0 left-0 size-0 overflow-hidden">
						<div ref={copia} className="absolute top-0 left-0" style={{ width: larghezza }}>
							<div data-posto="pagina" className="flex flex-col gap-3 p-4">
								<div data-posto="header" style={{ height: 64 }} />
								<div data-posto="nav" style={{ height: 40 }} />
								<div className="flex gap-3" style={{ flexDirection: tablet ? 'row' : 'column' }}>
									<div data-posto="main" style={tablet ? { flex: 1, height: 150 } : { height: 150 }} />
									<div data-posto="aside" style={tablet ? { width: 200 } : { height: 90 }} />
								</div>
								<div className="flex gap-3" style={{ flexDirection: computer ? 'row' : 'column' }}>
									{['c1', 'c2', 'c3'].map((id) => (
										<div key={id} data-posto={id} style={computer ? { flex: 1, height: 70 } : { height: 70 }} />
									))}
								</div>
								<div data-posto="footer" style={{ height: 40 }} />
							</div>
						</div>
					</div>
					{/* the widths the media queries name */}
					{[TABLET, COMPUTER].map((soglia) => {
						const passata = vale(soglia, larghezza);
						return (
							<div key={soglia.px} aria-hidden="true" className="absolute top-0 bottom-0" style={{ left: soglia.px * k }}>
								<div className={cn('absolute top-[18px] bottom-0 left-0 border-l-[1.5px] border-dashed motion-safe:transition-colors motion-safe:duration-300', passata ? 'border-[oklch(0.64_var(--chroma)_var(--hue))]' : 'border-edge-strong')} />
								<span className={cn('absolute top-0 left-0 -translate-x-1/2 font-mono text-[11px] leading-none whitespace-nowrap', passata ? 'font-semibold text-tint-fg' : 'text-fg-subtle')}>{soglia.px}px</span>
							</div>
						);
					})}
					{/* the window, as wide as the student says, and the blocks of the page in it */}
					<div className="absolute top-[22px] left-0">
						{pagina && <div className={cn('absolute top-0 left-0 rounded-lg border-[1.5px] border-fg-muted bg-surface shadow-paper', MOSSA)} style={posto(pagina, k)} data-finestra />}
						{BLOCCHI.map(({ id, nome }) => {
							const r = posti.get(id);
							const mosso = (id === 'main' || id === 'aside') ? tablet : id.startsWith('c') ? computer : false;
							return (
								r && (
									<div key={id} data-blocco={id} className={cn('absolute top-0 left-0 flex items-center justify-center overflow-hidden rounded-[5px] border-[1.5px] font-mono text-[10.5px] leading-none', mosso ? 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft text-fg-strong' : 'border-edge-strong bg-surface-2 text-fg-muted', MOSSA)} style={posto(r, k)}>
										{r.w * k >= nome.length * 6.4 + 4 && r.h * k >= 12 ? nome : ''}
									</div>
								)
							);
						})}
					</div>
				</div>
			</div>
			<div className="flex w-full max-w-md flex-col gap-1.5" data-foglio>
				<Blocco stato="sempre">{'.contenuto, .concerti {\n    display: flex;\n    flex-direction: column;\n}'}</Blocco>
				<Blocco stato={tablet ? 'attiva' : 'spenta'}>{'@media (min-width: 600px) {\n    .contenuto { flex-direction: row; }\n}'}</Blocco>
				<Blocco stato={computer ? 'attiva' : 'spenta'}>{'@media (min-width: 900px) {\n    .concerti { flex-direction: row; }\n}'}</Blocco>
			</div>
			<div className="flex min-h-[5.5rem] w-full items-start justify-center sm:min-h-[4rem]">
				<Caption>
					{!tablet && (
						<>
							A {larghezza} px nessuna media query è attiva, perché {larghezza} è meno di 600: valgono solo le regole di base, e tutto sta in colonna.
						</>
					)}
					{tablet && !computer && (
						<>
							A {larghezza} px è attiva la prima media query, perché {larghezza} è almeno 600: {b('main')} e {b('aside')} si affiancano. I concerti restano in colonna fino a 900 px.
						</>
					)}
					{computer && (
						<>
							A {larghezza} px sono attive tutte e due le media query, perché {larghezza} è almeno 900: anche i tre concerti si mettono in riga.
						</>
					)}
				</Caption>
			</div>
			<div className="flex w-full max-w-lg flex-col gap-3">
				<Slider label="Larghezza" value={larghezza} min={MIN} max={MAX} step={10} unit="px" onChange={setLarghezza} />
				<ButtonRow>
					{PROVE.map(({ nome, px }) => (
						<Button key={nome} variant="secondary" size="sm" aria-pressed={larghezza === px} onClick={() => setLarghezza(px)}>
							{nome}
							<span className="font-mono text-xs font-normal text-fg-subtle">{px}</span>
						</Button>
					))}
				</ButtonRow>
			</div>
		</Figura>
	);
}
