import Link from 'next/link';
import { Caveat } from 'next/font/google';
import { ArrowRight } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import type { ContentNode } from '@/lib/utils/tree';
import type { GuideBlock, GuideRow, GuideStop, PostitColor, SubjectGuide as Guide } from '@/lib/content/subject-copy';
import { nodePath, plainTitle, slugify } from '@/lib/seo/slug';
import { levelLong } from '@/lib/seo/meta';
import { cn } from '@/lib/utils/cn';
import { PenStroke } from './PageHeader';

// The pencil of the margin notes. Only subject pages use it, so it is loaded here and not in the root layout.
const hand = Caveat({ subsets: ['latin'], display: 'swap', variable: '--font-hand' });

const linkClass = 'inline-flex items-center gap-1.5 rounded text-accent-fg hover:underline focus-ring';

// The taped sheet and the post-it stay light in the dark theme, like the sheet on the home page.
const SHEET_INK = 'text-[oklch(0.3_0.05_262)]';
const TAPE = 'pointer-events-none absolute h-5 w-16 bg-[oklch(0.9_0.035_80/0.75)] shadow-paper';

/** `**bold**` and `==highlighter==` inside a line of the note. */
function rich(text: string): ReactNode[] {
	return text.split(/(\*\*[^*]+\*\*|==[^=]+==)/).map((part, i) => {
		if (part.startsWith('**')) return <strong key={i} className="font-semibold text-fg-strong">{part.slice(2, -2)}</strong>;
		if (part.startsWith('==')) return <mark key={i} className="marker">{part.slice(2, -2)}</mark>;
		return part;
	});
}

/** A number circled in pen, a little more than one turn and never quite closed. */
function Circled({ n }: { n: number }) {
	return (
		<span className="absolute left-0 top-0 flex size-9 items-center justify-center" aria-hidden="true">
			<svg viewBox="0 0 40 40" className="absolute inset-0 size-full text-accent">
				<path d="M27 6.5C19 3 7.5 7 6 17.5 4.6 27.5 12 35 21.5 34c9-1 13.5-8.5 12.4-16.5C33 11 28 6.5 21 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			</svg>
			<span className="pencil relative text-3xl text-fg-strong!">{n}</span>
		</span>
	);
}

/** A box drawn by hand and the corrector's red tick in it. */
function Ticked() {
	return (
		<svg viewBox="0 0 28 28" className="mt-0.5 size-6 shrink-0" aria-hidden="true">
			<path d="M4.5 6.5c6-.6 12.2-.8 17.4-.3.5 5.4.4 11 .1 16.3-5.7.4-11.4.3-17.1.1-.4-5.4-.6-10.7-.4-16.1Z" fill="none" stroke="var(--graphite)" strokeWidth="1.4" strokeLinejoin="round" />
			<path d="M8 14.5l4.5 5.5L25 2.5" fill="none" stroke="var(--color-accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

/** A pencil arrow curling from a margin note towards what it is about. */
function CurlyArrow({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 48 30" className={cn('h-6 w-10 shrink-0', className)} fill="none" stroke="var(--graphite)" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
			<path d="M46 4C33 3 22 8 17 17c-2 4-4 7-11 9" />
			<path d="M12 21.5 5.5 26l7.5 2" />
		</svg>
	);
}

const HAND_BOX = 'rounded-[255px_15px_225px_15px/15px_225px_15px_255px]';

const POSTIT: Record<PostitColor, string> = {
	yellow: 'bg-[oklch(0.93_0.11_98)]',
	pink: 'bg-[oklch(0.9_0.07_5)]',
	blue: 'bg-[oklch(0.91_0.05_230)]',
	green: 'bg-[oklch(0.92_0.08_145)]'
};

/** Blocks that keep their own width beside a wider one. */
const NARROW = new Set<GuideBlock['kind']>(['figure', 'postit', 'card']);

function Heading({ children }: { children: ReactNode }) {
	return <h3 className="mb-5 font-display text-2xl font-semibold text-fg-strong">{children}</h3>;
}

function StopText({ stop }: { stop: GuideStop }) {
	return (
		<>
			<p className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
				<span className="text-lg font-semibold text-fg-strong">{stop.label}</span>
				{stop.stamp && <span className="label-mono rotate-[-6deg] rounded-sm border-2 border-accent px-1.5 py-0.5 text-accent-fg">{stop.stamp}</span>}
			</p>
			<p className="mt-1 max-w-xl leading-relaxed text-fg-muted">{rich(stop.topics)}</p>
			{stop.pencil && <p className="pencil mt-1 rotate-[-1deg] text-2xl">↳ {stop.pencil}</p>}
		</>
	);
}

/** Stops circled in pen and joined by a dashed line: down the page, or across it for the years of a school. */
function Route({ block }: { block: Extract<GuideBlock, { kind: 'route' }> }) {
	const { stops } = block;
	if (block.style === 'areas')
		return (
			<div>
				<Heading>{block.heading}</Heading>
				<ul className="grid gap-5 sm:grid-cols-2">
					{stops.map((stop, i) => (
						<li key={stop.label} className={cn('border-2 border-edge-strong p-4 pt-3', HAND_BOX, i % 2 ? 'rotate-[0.6deg]' : 'rotate-[-0.5deg]')}>
							<StopText stop={stop} />
						</li>
					))}
				</ul>
			</div>
		);
	const across = block.style === 'timeline';
	return (
		<div>
			<Heading>{block.heading}</Heading>
			<ol className={cn(across && 'md:grid md:gap-6 md:[grid-template-columns:repeat(var(--stops),minmax(0,1fr))]')} style={{ '--stops': stops.length } as CSSProperties}>
				{stops.map((stop, i) => (
					<li key={stop.label} className={cn('relative pb-7 pl-14 last:pb-0', across && 'md:pb-0 md:pl-0 md:pt-12')}>
						<Circled n={i + 1} />
						{i < stops.length - 1 && (
							<span
								className={cn('absolute bottom-1 left-[17px] top-10 border-l-2 border-dashed border-edge-strong', across && 'md:bottom-auto md:left-11 md:right-0 md:top-[17px] md:border-l-0 md:border-t-2')}
								aria-hidden="true"
							/>
						)}
						<StopText stop={stop} />
					</li>
				))}
			</ol>
		</div>
	);
}

function Figure({ guide, tilt }: { guide: Guide; tilt?: number }) {
	if (!guide.image) return null;
	return (
		<figure
			className="relative mx-auto w-fit max-w-full self-start rounded-sm bg-[oklch(0.99_0.004_85)] p-4 pb-3 shadow-lift dark:brightness-[0.9]"
			style={{ rotate: `${tilt ?? 1.5}deg` }}
		>
			<span className={cn(TAPE, '-top-2.5 left-1/2 -translate-x-1/2 -rotate-2')} aria-hidden="true" />
			{/* eslint-disable-next-line @next/next/no-img-element -- a static SVG: nothing for the image optimizer to do */}
			<img src={guide.image.src} width={guide.image.width} height={guide.image.height} alt={guide.figure.alt} loading="lazy" className="h-auto max-w-full" style={{ width: Math.round(guide.image.width * 1.2) }} />
			<figcaption className="pencil mx-auto mt-2 max-w-72 text-center text-2xl text-[oklch(0.45_0.015_265)]!">{guide.figure.caption}</figcaption>
		</figure>
	);
}

function Block({ block, guide }: { block: GuideBlock; guide: Guide }) {
	switch (block.kind) {
		case 'text':
			return <p className="max-w-2xl text-lg leading-relaxed text-fg">{rich(block.text)}</p>;
		case 'route':
			return <Route block={block} />;
		case 'figure':
			return <Figure guide={guide} tilt={block.tilt} />;
		case 'checklist':
			return (
				<div>
					<Heading>{block.heading}</Heading>
					<ul className="space-y-3">
						{block.items.map((item) => (
							<li key={item} className="flex max-w-xl gap-3 leading-relaxed text-fg-muted">
								<Ticked />
								<span>{rich(item)}</span>
							</li>
						))}
					</ul>
				</div>
			);
		case 'postit':
			return (
				<aside className={cn('relative mx-auto w-64 p-5 pt-6 shadow-lift dark:brightness-[0.85]', POSTIT[block.color ?? 'yellow'], SHEET_INK)} style={{ rotate: `${block.tilt ?? -2.5}deg` }}>
					<span className={cn(TAPE, '-top-2.5 left-1/2 -translate-x-1/2 rotate-3')} aria-hidden="true" />
					<p className="pencil mb-1 text-3xl text-current!">{block.heading}</p>
					<p className="leading-relaxed [&_strong]:text-current">{rich(block.text)}</p>
				</aside>
			);
		case 'arrows':
			return (
				<div className="border-t-2 border-dashed border-edge pt-6">
					<h3 className="mb-3 font-display text-xl font-semibold text-fg-strong">{block.heading}</h3>
					<ul className="grid gap-x-8 gap-y-2 text-fg-muted sm:grid-cols-2 lg:grid-cols-3">
						{block.items.map((item) => (
							<li key={item} className="flex gap-2 leading-relaxed">
								<span className="pencil text-2xl leading-6" aria-hidden="true">→</span>
								<span>{rich(item)}</span>
							</li>
						))}
					</ul>
				</div>
			);
		case 'mistakes':
			return (
				<div>
					<Heading>{block.heading}</Heading>
					<ul className="space-y-4">
						{block.items.map((m) => (
							<li key={m.wrong} className="max-w-xl">
								<p className="font-mono text-fg-muted line-through decoration-accent decoration-2">
									<span className="sr-only">Sbagliato: </span>
									{m.wrong}
								</p>
								<p className="pencil mt-0.5 text-2xl">
									<span className="sr-only">Giusto: </span>→ {m.right}
								</p>
							</li>
						))}
					</ul>
				</div>
			);
		case 'card':
			return (
				// Every line is one row of the card (32px), so the text sits on the rules; the red rule is drawn, not a border.
				<div className="ruled-paper relative mx-auto w-72 max-w-full border border-edge bg-surface px-5 pb-8 shadow-paper" style={{ rotate: `${block.tilt ?? 1}deg` }}>
					<span className="absolute inset-x-0 top-[30px] h-0.5 bg-accent/60" aria-hidden="true" />
					<p className="label-mono leading-8 text-fg-subtle">{block.heading}</p>
					<p className="font-semibold leading-8 text-fg-strong">{rich(block.question)}</p>
					<p className="pencil text-2xl leading-8!">{rich(block.answer)}</p>
				</div>
			);
		case 'boxed':
			return (
				<div className="max-w-2xl">
					<div className={cn('border-2 border-accent px-6 py-5', HAND_BOX)}>
						<h3 className="mb-3 font-display text-xl font-semibold text-fg-strong">{block.heading}</h3>
						<ol className="space-y-1.5 leading-relaxed text-fg">
							{block.lines.map((line, i) => (
								<li key={line} className="flex gap-3">
									{block.numbered !== false && <span className="font-mono text-accent-fg">{i + 1}.</span>}
									<span className={cn(block.numbered === false && 'font-mono')}>{rich(line)}</span>
								</li>
							))}
						</ol>
					</div>
					{block.pencil && (
						<p className="pencil ml-8 mt-2 flex items-start gap-1 text-2xl">
							<CurlyArrow className="-scale-y-100 rotate-[200deg]" />
							{block.pencil}
						</p>
					)}
				</div>
			);
		case 'table':
			return (
				<div>
					<Heading>{block.heading}</Heading>
					<table className="w-full max-w-xl text-left">
						<tbody>
							{block.rows.map(([term, meaning]) => (
								<tr key={term} className="border-b border-dashed border-edge-strong last:border-b-0">
									<th scope="row" className="py-2 pr-5 align-top font-mono font-semibold whitespace-nowrap text-fg-strong">
										{term}
									</th>
									<td className="py-2 leading-relaxed text-fg-muted">{rich(meaning)}</td>
								</tr>
							))}
						</tbody>
					</table>
					{block.pencil && <p className="pencil mt-3 rotate-[-1deg] text-2xl">{block.pencil}</p>}
				</div>
			);
		case 'scribble':
			return <p className="pencil max-w-2xl rotate-[-1deg] text-3xl">“{block.text}”</p>;
	}
}

/** One row of the note: a block across the page, or blocks side by side, the narrow ones at their own width. */
function Row({ row, guide }: { row: GuideRow; guide: Guide }) {
	if (!Array.isArray(row)) return <Block block={row} guide={guide} />;
	const cols = row.map((b) => (NARROW.has(b.kind) ? 'auto' : 'minmax(0,1fr)')).join(' ');
	return (
		<div className="grid items-start gap-10 md:[grid-template-columns:var(--cols)]" style={{ '--cols': cols } as CSSProperties}>
			{row.map((b, i) => (
				<Block key={i} block={b} guide={guide} />
			))}
		</div>
	);
}

/**
 * The study note under a subject's chapters, as a page of a student's diary.
 * Each subject lays out its own page from a few kinds of blocks (the route
 * through the chapters, a taped figure, a checklist, post-its, corrected
 * mistakes, an index card, a framed method, a small table, pencil notes), so
 * no two pages share the same shape. Then links to the other subjects at the
 * level and to the same subject at the other levels.
 */
export function SubjectGuide({ guide, subject, level, tree }: { guide: Guide; subject: ContentNode; level: ContentNode; tree: ContentNode[] }) {
	const family = slugify(subject.title).split('-')[0];
	const siblings = level.children.filter((s) => s.id !== subject.id);
	const otherLevels = tree
		.filter((l) => l.id !== level.id)
		.map((l) => ({ level: l, subject: l.children.find((s) => s.slug === subject.slug) ?? l.children.find((s) => slugify(s.title).split('-')[0] === family) ?? null }));

	return (
		<section className={cn('mt-16', hand.variable)} aria-labelledby="guida-heading">
			<div className="note-paper relative max-w-5xl rounded-md border border-edge bg-surface px-5 py-8 shadow-lift sm:py-10 sm:pl-24 sm:pr-10">
				{/* The diary's punched holes and the red margin line. */}
				<div className="absolute inset-y-0 left-6 hidden flex-col justify-around py-10 sm:flex" aria-hidden="true">
					{[0, 1, 2, 3].map((i) => (
						<span key={i} className="size-4 rounded-full bg-page shadow-[inset_0_1px_2px_color-mix(in_oklab,black_22%,transparent)]" />
					))}
				</div>
				<span className="absolute inset-y-0 left-16 hidden w-px bg-[var(--grid-margin)] sm:block" aria-hidden="true" />

				<header className="mb-6">
					<p className="label-mono mb-2 text-fg-subtle">Appunti · {plainTitle(level.title)}</p>
					<div className="flex flex-wrap items-end gap-x-4 gap-y-1">
						<div className="inline-block">
							<h2 id="guida-heading" className="text-3xl font-semibold text-fg-strong sm:text-4xl">
								{guide.title}
							</h2>
							<PenStroke className="mt-1" />
						</div>
						{guide.scribble && (
							<p className="pencil flex rotate-[-3deg] items-end gap-1 pb-3 text-3xl">
								<CurlyArrow className="-scale-x-100 rotate-12" />
								{guide.scribble}
							</p>
						)}
					</div>
				</header>

				<p className="max-w-2xl text-lg leading-relaxed text-fg">{rich(guide.intro)}</p>

				<div className="mt-10 space-y-12">
					{guide.blocks.map((row, i) => (
						<Row key={i} row={row} guide={guide} />
					))}
				</div>
			</div>

			<nav className="mt-10 max-w-3xl" aria-label="Collegamenti correlati">
				<h2 className="mb-3 text-lg font-semibold text-fg">Continua a esplorare</h2>
				<ul className="space-y-2 text-fg-muted">
					{siblings.map((s) => (
						<li key={s.id}>
							<Link href={nodePath([level, s])} className={linkClass}>
								{plainTitle(s.title)} per {levelLong(level)}
								<ArrowRight className="size-4" aria-hidden="true" />
							</Link>
						</li>
					))}
					{otherLevels.map(({ level: l, subject: s }) => (
						<li key={l.id}>
							<Link href={s ? nodePath([l, s]) : nodePath([l])} className={linkClass}>
								{s ? `${plainTitle(s.title)} per ${levelLong(l)}` : `Tutto il materiale per ${levelLong(l)}`}
								<ArrowRight className="size-4" aria-hidden="true" />
							</Link>
						</li>
					))}
					<li>
						<Link href="/pricing" className={linkClass}>
							Piani Premium: esercizi, flashcard e lezioni individuali
							<ArrowRight className="size-4" aria-hidden="true" />
						</Link>
					</li>
				</ul>
			</nav>
		</section>
	);
}
