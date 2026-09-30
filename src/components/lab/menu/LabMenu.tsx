'use client';

import { useId, useMemo, useRef, useState, type FocusEvent, type ReactNode, type RefObject } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, FlaskConical, Info, KeyRound, Monitor, ShieldAlert, User, UsersRound } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { buttonClass } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { CLASS_DEFAULT, LABELS, LABS, SIGNALS, SOLO_DEFAULT, sessionQuery, type ClassSettings, type Experiment, type Lab, type Session, type SoloSettings } from '@/lib/lab/catalog';
import { TapedPhoto } from './TapedPhoto';
import { Sketch } from './LabSketches';

/*
 * The labs menu, in three steps down the page, each a section of the notebook: the lab (covers, like the library's
 * textbooks), the experiment (an index, and its worksheet beside it), and how to work (alone, or a room for the class
 * with its rules). A bar at the bottom says what has been chosen and goes in.
 *
 * Every choice is a native radio inside its card: one Tab stop per group, the arrows move the choice, and screen
 * readers hear a radio group. Selection looks the same everywhere (a red filled check, and a photo that straightens
 * and takes a red edge); on the cards keyboard focus is a dark outline, so it cannot pass for the red selection. The
 * segmented toggles keep the site's own focus ring: their selection is not red.
 */

/** Keyboard focus on a card whose radio is inside it. */
const FOCUS = 'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-fg-strong';
/** Controls stay clear of the sticky bar when the keyboard brings them into view. */
const CLEAR_BAR = 'sr-only scroll-mb-40';

function Tick({ on, className }: { on: boolean; className?: string }) {
	return (
		<span
			className={cn(
				'flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
				on ? 'border-accent bg-accent text-white' : 'border-edge-strong bg-surface text-transparent',
				className
			)}
			aria-hidden="true"
		>
			<Check className="size-3.5" strokeWidth={3} />
		</span>
	);
}

export function LabMenu() {
	const [labSlug, setLab] = useState(LABS[0].slug);
	const lab = LABS.find((l) => l.slug === labSlug)!;
	const firstReady = (l: Lab) => l.experiments.find((e) => e.status === 'ready')?.slug ?? '';
	const [expSlug, setExp] = useState(firstReady(lab));
	const exp = lab.experiments.find((e) => e.slug === expSlug);
	const [mode, setMode] = useState<'solo' | 'classe'>('solo');
	const [solo, setSolo] = useState<SoloSettings>(SOLO_DEFAULT);
	const [klass, setKlass] = useState<ClassSettings>(CLASS_DEFAULT);
	const session: Session = mode === 'solo' ? solo : klass;
	const ready = !!exp && exp.status === 'ready';
	const href = ready ? `/laboratorio/${lab.slug}/${exp.slug}?${sessionQuery(session)}` : '';
	const readyCount = lab.experiments.filter((e) => e.status === 'ready').length;
	const bar = useRef<HTMLElement>(null);
	// what the keyboard focuses can be on screen yet behind the sticky bar, where no scroll-margin helps: lift it
	const clearBar = (e: FocusEvent<HTMLDivElement>) => {
		const el = e.target as HTMLElement;
		const box = (el.closest('label') ?? el).getBoundingClientRect();
		const top = bar.current?.getBoundingClientRect().top;
		if (top === undefined || bar.current?.contains(el)) return;
		if (box.bottom > top - 12)
			el.scrollIntoView({
				block: 'center',
				behavior: 'instant' as ScrollBehavior
			});
	};

	return (
		<div className="space-y-16 pb-8 sm:space-y-20" onFocus={clearBar}>
			<Step n={1} id="lab-scelta" title="Il laboratorio" hint="La chimica è aperta; fisica ed elettronica sono in preparazione.">
				<fieldset>
					<legend className="sr-only">Scegli il laboratorio</legend>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						{LABS.map((l, i) => (
							<LabCover
								key={l.slug}
								tilt={[3, -2.5, 2][i % 3]}
								lab={l}
								selected={l.slug === labSlug}
								onSelect={() => {
									setLab(l.slug);
									setExp(firstReady(l));
								}}
							/>
						))}
					</div>
				</fieldset>
			</Step>

			<Step n={2} id="lab-esperimento" title="L'esperimento" hint={`${readyCount} ${readyCount === 1 ? 'pronto' : 'pronti'}; gli altri arrivano uno alla volta.`}>
				<div data-subject={lab.tone} className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
					<fieldset className="self-start lg:sticky lg:top-24">
						<legend className="sr-only">Scegli l&apos;esperimento</legend>
						<div className="border-t border-edge">
							{lab.experiments.map((e, i) => (
								<ExperimentRow key={e.slug} exp={e} n={i + 1} on={e.slug === expSlug} onSelect={() => setExp(e.slug)} />
							))}
							{!lab.experiments.length && <p className="border-b border-edge py-6 text-sm text-fg-muted">Gli esperimenti di questo laboratorio non sono ancora scritti.</p>}
						</div>
					</fieldset>
					{exp && exp.status === 'ready' && <Worksheet key={exp.slug} exp={exp} />}
				</div>
			</Step>

			<Step n={3} id="lab-modo" title="Come si lavora" hint="Da soli, con i compagni simulati, o in una stanza per tutta la classe.">
				<fieldset>
					<legend className="sr-only">Scegli come lavorare</legend>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<ModeCard
							name="modo"
							on={mode === 'solo'}
							onSelect={() => setMode('solo')}
							icon={User}
							photo="/lab/copertine/da-solo.webp"
							position="object-[50%_18%]"
							tilt={-1}
							title="Da solo"
							text="Il tuo banco, il tuo ritmo. In aula i compagni lavorano intorno a te, controllati dal computer; il quaderno segna i passi che hai fatto."
						/>
						<ModeCard
							name="modo"
							on={mode === 'classe'}
							onSelect={() => setMode('classe')}
							icon={UsersRound}
							photo="/lab/copertine/con-la-classe.webp"
							tilt={1}
							title="Con la classe"
							badge="Per i docenti"
							text="Il docente prepara una stanza e dà un codice; gli studenti entrano ciascuno dal suo computer, a gruppi. Niente chat: solo messaggi pronti come «Aiuto» o «Ho finito»."
						/>
					</div>
				</fieldset>

				<div className="mt-8 overflow-hidden rounded-2xl border border-edge bg-surface shadow-paper">
					{mode === 'solo' ? (
						<div className="divide-y divide-edge">
							<Setting label="Ambiente" help="L'aula ha la classe intera intorno a te; il banco singolo è più leggero, per i computer lenti.">
								<PhotoChoice
									name="ambiente"
									value={solo.room}
									onChange={(room) => setSolo({ ...solo, room })}
									options={[
										{
											value: 'aula',
											label: LABELS.room.aula,
											src: '/lab/copertine/aula.webp'
										},
										{
											value: 'banco',
											label: LABELS.room.banco,
											src: '/lab/copertine/banco-singolo.webp'
										}
									]}
								/>
							</Setting>
							<QualitySetting value={solo.quality} onChange={(quality) => setSolo({ ...solo, quality })} />
						</div>
					) : (
						<>
							<div className="flex items-start gap-3 border-b border-edge bg-surface-2 px-5 py-4 text-sm text-fg-muted sm:px-6">
								<Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
								<p>
									<span className="font-semibold text-fg">Anteprima.</span> La stanza condivisa non è ancora attiva: puoi prepararla e vedere la sala d&apos;attesa, ma in laboratorio i compagni sono
									simulati.
								</p>
							</div>
							<div className="divide-y divide-edge">
								<Setting bare label="Postazioni" help="Sei banchi divisi a metà: dodici postazioni, con una o due persone ciascuna.">
									{(h) => (
										<ToggleGroup
											describedBy={h}
											compact
											label="Postazioni"
											value={String(klass.seats) as '12' | '24'}
											onChange={(v) => setKlass({ ...klass, seats: v === '12' ? 12 : 24 })}
											options={[
												{ value: '12', label: '12 studenti' },
												{ value: '24', label: '24 studenti' }
											]}
										/>
									)}
								</Setting>
								<Setting bare label="Gruppi" help="Chi lavora insieme sullo stesso esperimento.">
									{(h) => (
										<ToggleGroup
											describedBy={h}
											compact
											label="Gruppi"
											value={klass.groups}
											onChange={(groups) => setKlass({ ...klass, groups })}
											options={[
												{ value: 'meta', label: 'In coppia' },
												{ value: 'banco', label: 'Per banco' },
												{ value: 'singoli', label: 'Da soli' }
											]}
										/>
									)}
								</Setting>
								<Setting bare label="Avatar" help="Se si attraversano, nessuno resta bloccato nei corridoi. Se si urtano, la stanza sembra più vera.">
									{(h) => (
										<ToggleGroup
											describedBy={h}
											compact
											label="Avatar"
											value={klass.bodies}
											onChange={(bodies) => setKlass({ ...klass, bodies })}
											options={[
												{ value: 'fantasmi', label: LABELS.bodies.fantasmi },
												{ value: 'urtano', label: LABELS.bodies.urtano }
											]}
										/>
									)}
								</Setting>
								<Setting bare label="Banchi" help="Se un gruppo può prendere e usare gli strumenti degli altri gruppi.">
									{(h) => (
										<ToggleGroup
											describedBy={h}
											compact
											label="Banchi"
											value={klass.benches}
											onChange={(benches) => setKlass({ ...klass, benches })}
											options={[
												{ value: 'propri', label: LABELS.benches.propri },
												{ value: 'tutti', label: LABELS.benches.tutti }
											]}
										/>
									)}
								</Setting>
								<Setting bare label="Messaggi" help="Non c'è una chat: gli studenti mandano questi messaggi già scritti, e il docente li vede tutti.">
									{(h) => (
										<div className="flex flex-col items-start gap-3 sm:items-end">
											<ToggleGroup
												describedBy={h}
												compact
												label="Messaggi"
												value={klass.signals ? 'si' : 'no'}
												onChange={(v) => setKlass({ ...klass, signals: v === 'si' })}
												options={[
													{ value: 'si', label: 'Attivi' },
													{ value: 'no', label: 'Spenti' }
												]}
											/>
											<ul className="flex flex-wrap gap-1.5 sm:justify-end" aria-label={klass.signals ? 'Messaggi disponibili' : 'Messaggi spenti'}>
												{SIGNALS.map((s) => (
													<li key={s} className={cn('rounded-full border border-edge bg-surface-2 px-2.5 py-0.5 text-xs text-fg-muted', !klass.signals && 'line-through decoration-fg-muted/60')}>
														{s}
													</li>
												))}
											</ul>
										</div>
									)}
								</Setting>
								<QualitySetting value={klass.quality} onChange={(quality) => setKlass({ ...klass, quality })} />
							</div>
							<JoinByCode />
						</>
					)}
				</div>
			</Step>

			<Launch barRef={bar} href={href} ready={ready} lab={lab} expTitle={exp?.title} session={session} />
		</div>
	);
}

// ---------------------------------------------------------------------------------------------

function Step({ n, id, title, hint, children }: { n: number; id: string; title: string; hint?: string; children: ReactNode }) {
	return (
		<section className="animate-fade-in space-y-6" aria-labelledby={id}>
			<div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1 border-b border-edge-strong pb-3">
				<h2 id={id} tabIndex={-1} className="flex items-baseline gap-4 text-3xl font-semibold text-fg-strong outline-none app:max-md:text-2xl">
					<span className="font-mono text-sm text-accent-fg" aria-hidden="true">
						{String(n).padStart(2, '0')}
					</span>
					{title}
				</h2>
				{hint && <p className="pb-1 text-sm text-fg-muted">{hint}</p>}
			</div>
			{children}
		</section>
	);
}

/** A lab as a textbook cover: a photo of the room taped on it, what the room has, and a stamp while it is not open. */
function LabCover({ lab, selected, onSelect, tilt }: { lab: Lab; selected: boolean; onSelect: () => void; tilt: number }) {
	const ready = lab.status === 'ready';
	const readyN = lab.experiments.filter((e) => e.status === 'ready').length;
	const id = useId();
	return (
		<label className={cn('group relative isolate block h-full rounded-2xl', FOCUS, ready ? 'cursor-pointer' : 'cursor-not-allowed')}>
			<input
				type="radio"
				name="laboratorio"
				value={lab.slug}
				checked={selected}
				disabled={!ready}
				onChange={onSelect}
				className={CLEAR_BAR}
				aria-labelledby={`${id}-t`}
				aria-describedby={`${id}-d ${id}-s`}
			/>
			{/* the block of pages under the cover */}
			<span className="absolute inset-y-1.5 left-3 right-0 -z-10 rounded-r-xl bg-surface shadow-paper ring-1 ring-edge" aria-hidden="true" />
			<span
				data-subject={lab.tone}
				className={cn(
					'relative mr-1.5 flex h-full min-h-72 flex-col overflow-hidden rounded-2xl rounded-l-lg bg-tint-cover p-6 pl-8 text-white shadow-paper transition-shadow duration-300',
					// the orange cover is light: a darker one here, so its white text reads
					lab.tone === 'cs' && '[--tint-cover:oklch(0.5_0.14_52)]! dark:[--tint-cover:oklch(0.45_0.12_52)]!',
					ready && 'group-hover:shadow-lift',
					// not open yet: a veil of ink over the colour (a background image, so it sits on the background colour and under
					// everything else), and the open lab leads the row
					!ready && 'bg-[linear-gradient(rgb(40_44_56/0.42),rgb(40_44_56/0.42))]',
					selected && 'shadow-lift ring-2 ring-accent ring-offset-2 ring-offset-page-alt'
				)}
			>
				<span className="grid-paper absolute inset-0 -z-10 opacity-60 [--grid:color-mix(in_oklab,white_14%,transparent)]" aria-hidden="true" />
				<span className="absolute inset-y-0 left-0 -z-10 w-3.5 bg-black/20" aria-hidden="true" />
				<span className="absolute inset-y-0 left-5 -z-10 w-px bg-black/15" aria-hidden="true" />
				<span className="flex items-start justify-between gap-4">
					<span className="font-mono text-xs tracking-wider text-white/90 uppercase" aria-hidden="true">
						Laboratorio
					</span>
					{ready && <Tick on={selected} className={selected ? 'border-white' : 'border-white/70 bg-transparent'} />}
				</span>
				<span className={cn('pointer-events-none relative mt-3 mb-5 block w-[64%] self-end', ready && 'group-hover:[--tilt:0deg]', selected && '[--tilt:0deg]')}>
					<TapedPhoto src={lab.photo} alt={lab.photo ? `Il laboratorio di ${lab.title.toLowerCase()}` : ''} sketch={<Sketch id={lab.slug} />} small={!ready} tilt={tilt} sizes="260px" />
					{!ready && (
						<span
							className="absolute right-2 bottom-2 rotate-[-10deg] rounded-md border-2 border-crimson-700 bg-white/85 px-2 py-0.5 font-display text-sm font-semibold tracking-wide text-crimson-700 uppercase"
							aria-hidden="true"
						>
							Presto
						</span>
					)}
				</span>
				<span id={`${id}-t`} className="mt-auto block font-display text-4xl font-semibold leading-none tracking-tight">
					{lab.title}
				</span>
				<span id={`${id}-d`} className="mt-3 block min-h-[3lh] max-w-xs text-sm leading-snug text-white/90">
					{lab.inside}
				</span>
				<span className="mt-5 block border-t border-white/25 pt-3">
					<span id={`${id}-s`} className="font-mono text-xs tracking-wider text-white/90 uppercase">
						{ready ? `${readyN} ${readyN === 1 ? 'esperimento' : 'esperimenti'} · ${lab.experiments.length - readyN} in arrivo` : 'In preparazione'}
					</span>
				</span>
			</span>
		</label>
	);
}

function ExperimentRow({ exp, n, on, onSelect }: { exp: Experiment; n: number; on: boolean; onSelect: () => void }) {
	const ready = exp.status === 'ready';
	const id = useId();
	return (
		<label
			className={cn(
				'group relative -mx-3 flex items-start gap-4 rounded-xl px-3 py-4 transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-px after:bg-edge',
				FOCUS,
				'has-[:focus-visible]:outline-offset-0',
				ready ? 'cursor-pointer hover:bg-surface' : 'cursor-not-allowed',
				on && 'bg-surface'
			)}
		>
			<input type="radio" name="esperimento" value={exp.slug} checked={on} disabled={!ready} onChange={onSelect} className={CLEAR_BAR} aria-labelledby={`${id}-t`} aria-describedby={`${id}-d`} />
			<span className={cn('w-6 shrink-0 pt-1.5 font-mono text-xs', on ? 'text-accent-fg' : 'text-fg-muted')} aria-hidden="true">
				{String(n).padStart(2, '0')}
			</span>
			<span className={cn('mt-1 block w-24 shrink-0 sm:w-28', ready && 'group-hover:[--tilt:0deg]', on && '[--tilt:0deg]')}>
				<TapedPhoto src={exp.photo} sketch={<Sketch id={exp.slug} />} small selected={on} tilt={n % 2 ? -2 : 2.5} sizes="112px" />
			</span>
			<span className="min-w-0 flex-1">
				<span id={`${id}-t`} className={cn('block font-display text-xl font-semibold leading-tight', ready ? 'text-fg-strong' : 'text-fg-muted')}>
					{exp.title}
				</span>
				<span id={`${id}-d`} className={cn('mt-1.5 block text-sm leading-snug', ready ? 'text-fg-muted' : 'text-fg-subtle')}>
					{exp.summary}
					{!ready && <span className="sr-only"> In arrivo.</span>}
				</span>
			</span>
			{ready ? (
				<Tick on={on} className="mt-1" />
			) : (
				<span className="mt-1.5 shrink-0 text-xs font-medium text-fg-subtle" aria-hidden="true">
					in arrivo
				</span>
			)}
		</label>
	);
}

/** The experiment's worksheet: what it teaches, what is on the bench, the hazards. */
function Worksheet({ exp }: { exp: Experiment }) {
	return (
		<article className="animate-panel-in relative self-start rounded-2xl border border-edge bg-surface p-6 shadow-lift sm:p-8" aria-labelledby="scheda-titolo">
			{exp.photo && (
				<TapedPhoto
					src={exp.photo}
					alt={`Il banco pronto per l'esperimento: ${exp.title.toLowerCase()}`}
					caption="il banco, prima di cominciare"
					tilt={-1.5}
					tape="corners"
					ratio="aspect-[16/7]"
					className="-mx-2 -mt-12 mb-6"
				/>
			)}
			<p className="font-mono text-xs tracking-wider text-tint-fg uppercase">Scheda di laboratorio</p>
			<h3 id="scheda-titolo" className="mt-2 font-display text-3xl font-semibold leading-tight text-fg-strong">
				{exp.title}
			</h3>
			<p className="mt-3 text-fg-muted">{exp.summary}</p>
			<div className="mt-4 flex flex-wrap gap-2">
				{exp.years && <Chip>{exp.years}</Chip>}
				{exp.steps && <Chip>{exp.steps} passi</Chip>}
				<Chip>
					<Monitor className="size-3.5" aria-hidden="true" /> Mouse e tastiera
				</Chip>
			</div>
			<div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
				{exp.skills && (
					<div>
						<h4 className="mb-2 text-sm font-semibold text-fg">Cosa impari</h4>
						<ul className="space-y-1.5 text-sm text-fg">
							{exp.skills.map((s) => (
								<li key={s} className="flex gap-2">
									<Check className="mt-0.5 size-4 shrink-0 text-accent-fg" strokeWidth={2.5} aria-hidden="true" />
									{s}
								</li>
							))}
						</ul>
					</div>
				)}
				{exp.equipment && (
					<div>
						<h4 className="mb-2 text-sm font-semibold text-fg">Sul banco</h4>
						<ul className="space-y-1.5 text-sm text-fg">
							{exp.equipment.map((s) => (
								<li key={s} className="flex gap-2">
									<FlaskConical className="mt-0.5 size-4 shrink-0 text-tint-fg" aria-hidden="true" />
									{s}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
			{exp.safety && (
				<div className="mt-6 rounded-xl border border-accent-edge bg-accent-soft px-4 py-3">
					<h4 className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-accent-fg">
						<ShieldAlert className="size-4" aria-hidden="true" /> Sicurezza
					</h4>
					<p className="text-sm text-fg">{exp.safety.join(' · ')}</p>
				</div>
			)}
		</article>
	);
}

function Chip({ children }: { children: ReactNode }) {
	return <span className="inline-flex items-center gap-1.5 rounded-full border border-edge bg-surface-2 px-2.5 py-1 text-xs font-medium text-fg-muted">{children}</span>;
}

function ModeCard({
	name,
	on,
	onSelect,
	icon: Icon,
	title,
	text,
	badge,
	photo,
	tilt,
	position
}: {
	name: string;
	on: boolean;
	onSelect: () => void;
	icon: typeof User;
	title: string;
	text: string;
	badge?: string;
	photo: string;
	tilt: number;
	position?: string;
}) {
	const id = useId();
	return (
		<label
			className={cn(
				'group relative flex cursor-pointer flex-col rounded-2xl border-2 bg-surface p-5 pt-7 shadow-paper transition-[border-color,box-shadow] duration-200 sm:p-6 sm:pt-8',
				FOCUS,
				on ? 'border-accent shadow-lift' : 'border-edge hover:border-edge-strong hover:shadow-lift'
			)}
		>
			<input type="radio" name={name} checked={on} onChange={onSelect} className={CLEAR_BAR} aria-labelledby={`${id}-t`} aria-describedby={`${id}-d`} />
			<span className={cn('mb-6 block group-hover:[--tilt:0deg]', on && '[--tilt:0deg]')}>
				<TapedPhoto src={photo} tilt={tilt} ratio="aspect-[16/7]" position={position} sizes="(min-width: 768px) 40vw, 90vw" />
			</span>
			<span className="flex items-start gap-4">
				<span
					className={cn(
						'flex size-12 shrink-0 rotate-[-4deg] items-center justify-center rounded-xl border shadow-lift transition-colors',
						on ? 'border-accent-edge bg-accent-soft text-accent-fg' : 'border-edge bg-surface-2 text-fg-muted'
					)}
					aria-hidden="true"
				>
					<Icon className="size-6" strokeWidth={1.75} />
				</span>
				<span className="min-w-0 flex-1">
					<span className="flex flex-wrap items-center gap-2">
						<span id={`${id}-t`} className="font-display text-2xl font-semibold text-fg-strong">
							{title}
						</span>
						{badge && <span className="rounded-md border border-edge px-1.5 py-0.5 text-xs font-medium text-fg-muted">{badge}</span>}
					</span>
					<span id={`${id}-d`} className="mt-1.5 block text-sm leading-relaxed text-fg-muted">
						{text}
					</span>
				</span>
				<Tick on={on} className="mt-1" />
			</span>
		</label>
	);
}

/** A choice shown as photos taped side by side: the chosen one straightens and takes a red edge. */
function PhotoChoice<T extends string>({ name, value, onChange, options }: { name: string; value: T; onChange: (v: T) => void; options: { value: T; label: string; src: string }[] }) {
	return (
		<div className="flex flex-wrap gap-5 sm:justify-end">
			{options.map((o, i) => {
				const on = o.value === value;
				return (
					<label key={o.value} className={cn('group relative flex w-44 cursor-pointer flex-col items-center gap-2.5 rounded-lg p-1', FOCUS, 'has-[:focus-visible]:outline-offset-2')}>
						<input type="radio" name={name} value={o.value} checked={on} onChange={() => onChange(o.value)} className={CLEAR_BAR} />
						<span className={cn('block w-full transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:[--tilt:0deg] motion-reduce:transition-none', on && '[--tilt:0deg]')}>
							<TapedPhoto src={o.src} tilt={[-3, 2.5][i % 2]} selected={on} sizes="176px" />
						</span>
						<span className="flex items-center gap-2 text-sm font-medium">
							<Tick on={on} className="size-5 [&>svg]:size-3" />
							<span className={on ? 'text-fg' : 'text-fg-muted'}>{o.label}</span>
						</span>
					</label>
				);
			})}
		</div>
	);
}

/**
 * A row of the settings: the label and what it means on the left, the control on the right. A row whose control is
 * a group of its own (a ToggleGroup, named by its label) gets `bare`, and the help's id to describe it: a fieldset
 * around it would announce the name twice.
 */
function Setting({ label, help, bare = false, children }: { label: string; help: string; bare?: boolean; children: ReactNode | ((helpId: string) => ReactNode) }) {
	const id = useId();
	const body = (
		<div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8 sm:px-6">
			<div className="max-w-sm sm:pt-1">
				<p className="font-semibold text-fg" aria-hidden="true">
					{label}
				</p>
				<p id={`${id}-h`} className="mt-0.5 text-sm text-fg-muted">
					{help}
				</p>
			</div>
			<div className="shrink-0">{typeof children === 'function' ? children(`${id}-h`) : children}</div>
		</div>
	);
	if (bare) return body;
	return (
		<fieldset aria-describedby={`${id}-h`}>
			<legend className="sr-only">{label}</legend>
			{body}
		</fieldset>
	);
}

function QualitySetting({ value, onChange }: { value: 'auto' | 'alta' | 'leggera'; onChange: (v: 'auto' | 'alta' | 'leggera') => void }) {
	return (
		<Setting bare label="Grafica" help="Automatica segue il computer: se rallenta, abbassa la risoluzione da sola. Leggera è per i computer lenti.">
			{(h) => (
				<ToggleGroup
					describedBy={h}
					compact
					label="Grafica"
					value={value}
					onChange={onChange}
					options={[
						{ value: 'auto', label: LABELS.quality.auto },
						{ value: 'alta', label: LABELS.quality.alta },
						{ value: 'leggera', label: LABELS.quality.leggera }
					]}
				/>
			)}
		</Setting>
	);
}

/** For the students: the code the teacher gives. Not active until the shared room exists. */
function JoinByCode() {
	return (
		<div className="flex flex-col gap-3 border-t border-dashed border-edge-strong bg-page-alt/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
			<div className="flex items-center gap-3">
				<KeyRound className="size-5 shrink-0 text-fg-muted" aria-hidden="true" />
				<div>
					<p className="font-semibold text-fg">Sei uno studente?</p>
					<p className="text-sm text-fg-muted">Presto qui scriverai il codice della stanza che ti dà il docente. Per ora non è attivo.</p>
				</div>
			</div>
			<div className="flex gap-2">
				<input
					disabled
					placeholder="ABC-123"
					aria-label="Codice della stanza (non ancora attivo)"
					className="w-32 rounded-xl border border-edge bg-surface px-3 py-2 text-center font-mono tracking-[0.2em] uppercase opacity-60 shadow-paper"
				/>
				<button type="button" disabled className={buttonClass('secondary', 'md')}>
					Entra
				</button>
			</div>
		</div>
	);
}

/** The bar at the bottom, sticky while the menu scrolls: what has been chosen, and the way in. */
function Launch({ barRef, href, ready, lab, expTitle, session }: { barRef: RefObject<HTMLElement | null>; href: string; ready: boolean; lab: Lab; expTitle?: string; session: Session }) {
	const detail = useMemo(() => {
		if (session.mode === 'solo') return `Da solo · ${LABELS.room[session.room]}`;
		return `Con la classe · ${session.seats} studenti · ${session.groups === 'meta' ? 'in coppia' : session.groups === 'banco' ? 'per banco' : 'da soli'}`;
	}, [session]);
	const action = session.mode === 'solo' ? 'Entra in laboratorio' : 'Prepara la stanza';
	return (
		<aside ref={barRef} aria-label="Riepilogo e avvio" className="sticky bottom-6 z-30 [@media(max-height:560px)]:static">
			<div className="flex flex-col gap-3 rounded-2xl border border-edge-strong bg-surface/95 p-3 pl-5 shadow-lift backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
				<div className="min-w-0" data-subject={lab.tone}>
					<p className="font-mono text-xs tracking-wider text-tint-fg uppercase">Laboratorio di {lab.title.toLowerCase()}</p>
					<p className="font-display text-lg font-semibold text-fg-strong">
						{expTitle ?? 'Scegli un esperimento'} <span className="font-sans text-sm font-normal text-fg-muted">· {detail}</span>
					</p>
				</div>
				{ready ? (
					<Link href={href} className={buttonClass('primary', 'lg', 'shrink-0')}>
						{action}
						<ArrowRight className="size-4" aria-hidden="true" />
					</Link>
				) : (
					<p className="shrink-0 text-sm text-fg-muted">Scegli un esperimento pronto per entrare.</p>
				)}
			</div>
		</aside>
	);
}
