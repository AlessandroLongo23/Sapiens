import type { ReactNode } from 'react';
import Link from 'next/link';
import { romeParts, weekdayOf, WEEKDAYS_SHORT } from '@/lib/tutoring/agenda';
import type { SubjectTone } from '@/lib/utils/icons';
import { cn } from '@/lib/utils/cn';
import { ArrowRight } from 'lucide-react';
import { PenStroke } from '@/components/content/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

/** The colour of a tutor's subject, as the library colours its own: mathematics red, physics blue, and so on. */
export function subjectTone(subject: string | null): SubjectTone {
	if (!subject) return 'ink';
	if (/^(matematica|analisi|algebra|statistica)/.test(subject)) return 'math';
	if (/^fisica/.test(subject)) return 'physics';
	if (/^chimica/.test(subject)) return 'chemistry';
	if (/^(informatica|programmazione|fondamenti|database|sistemi|reti|teoria)/.test(subject)) return 'cs';
	return 'ink';
}

/** The top of a page of the agenda: a mono eyebrow, the title in the serif with the pen stroke, a lead and the page's action. */
export function AreaHeader({ eyebrow, title, lead, action, size = 'lg' }: { eyebrow?: ReactNode; title: ReactNode; lead?: ReactNode; action?: ReactNode; size?: 'lg' | 'md' }) {
	return (
		<header className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 sm:mb-10">
			<div className="min-w-0 space-y-3">
				{eyebrow && <p className="label-mono text-fg-subtle">{eyebrow}</p>}
				<h1 className={cn('w-fit max-w-full font-semibold leading-[1.05] text-fg-strong', size === 'lg' ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl')}>
					{title}
					<PenStroke className="mt-1.5" />
				</h1>
				{lead && <p className="max-w-2xl text-fg-muted">{lead}</p>}
			</div>
			{action && <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>}
		</header>
	);
}

/** A section of a page: the heading in the serif on a rule, a mono count, an action at the right end. */
export function SectionTitle({ id, title, count, action }: { id?: string; title: ReactNode; count?: number; action?: ReactNode }) {
	return (
		<div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-edge-strong pb-2.5">
			<h2 id={id} className="flex items-baseline gap-3 text-2xl font-semibold text-fg-strong">
				{title}
				{count !== undefined && <span className="label-mono text-fg-subtle">{String(count).padStart(2, '0')}</span>}
			</h2>
			{action}
		</div>
	);
}

/** A number that waits for the reader, in the site's accent pill. `label` says what it counts. */
export function Count({ n, label }: { n: number; label: string }) {
	if (n <= 0) return null;
	return (
		<Badge tone="accent" className="font-sans">
			{n}
			<span className="sr-only"> {label}</span>
		</Badge>
	);
}

/** "See the rest": a link in the accent, with an arrow, under a list or beside a section's title. */
export function MoreLink({ href, children }: { href: string; children: ReactNode }) {
	return (
		<LinkButton href={href} variant="link" className="min-h-[36px] gap-1 text-sm">
			{children}
			<ArrowRight className="size-3.5" aria-hidden="true" />
		</LinkButton>
	);
}

/** The initials of a student on a tilted tab in the colour of their subject, like the sticker on a notebook. */
export function Initials({ name, subject, size = 'md' }: { name: string; subject: string | null; size?: 'sm' | 'md' | 'lg' }) {
	const letters = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join('');
	const box = { sm: 'size-10 rounded-lg text-sm', md: 'size-12 rounded-xl text-base', lg: 'size-16 rounded-2xl text-xl' }[size];
	return (
		<span data-subject={subjectTone(subject)} className={cn('flex shrink-0 rotate-[-4deg] items-center justify-center border border-tint-edge bg-tint-soft font-display font-semibold text-tint-fg shadow-lift', box)} aria-hidden="true">
			{letters || '?'}
		</span>
	);
}

/** A day as the diary writes it: the weekday in small capitals, the number in the serif, the month under it. */
export function DayLeaf({ iso, muted = false }: { /** An instant, shown as its day in Rome. */ iso: string; muted?: boolean }) {
	const { day } = romeParts(iso);
	const month = new Intl.DateTimeFormat('it-IT', { month: 'short', timeZone: 'UTC' }).format(new Date(`${day}T00:00:00Z`)).replace('.', '');
	return (
		<span className="flex w-12 shrink-0 flex-col items-center self-start" aria-hidden="true">
			<span className={cn('label-mono text-[0.6rem]', muted ? 'text-fg-subtle' : 'text-accent-fg')}>{WEEKDAYS_SHORT[weekdayOf(day)]}</span>
			<span className={cn('font-display text-2xl font-semibold leading-7 tabular-nums', muted ? 'text-fg-muted' : 'text-fg-strong')}>{Number(day.slice(8))}</span>
			<span className="label-mono text-[0.6rem] text-fg-subtle">{month}</span>
		</span>
	);
}

const figureClass = 'flex flex-col gap-1 border-l border-edge-strong pl-4 first:border-l-0 first:pl-0';

/** A figure, as `Stat` under the page titles: the number in the serif, the label in small capitals. With `href` it is a link. */
export function Figure({ value, label, href }: { value: ReactNode; label: string; href?: string }) {
	const body = (
		<>
			<span className="font-display text-4xl font-medium leading-none tracking-tight text-fg-strong tabular-nums">{value}</span>
			<span className="label-mono text-fg-subtle">{label}</span>
		</>
	);
	return href ? (
		<Link href={href} className={cn(figureClass, 'rounded-sm focus-ring [&>span:last-child]:hover:text-accent-fg')}>
			{body}
		</Link>
	) : (
		<span className={figureClass}>{body}</span>
	);
}

/** A row of figures divided by rules, as under a page title. */
export function Figures({ children, label, compact = false }: { children: ReactNode; label: string; /** Two by two, without the rules, for a narrow column. */ compact?: boolean }) {
	return (
		<div role="group" aria-label={label} className={compact ? 'grid grid-cols-2 gap-x-6 gap-y-5 [&>*]:border-l-0 [&>*]:pl-0' : 'grid grid-cols-2 gap-x-6 gap-y-5 max-sm:[&>*]:border-l-0 max-sm:[&>*]:pl-0 sm:flex sm:flex-wrap sm:gap-y-4'}>
			{children}
		</div>
	);
}

/** Nothing here yet, as everywhere on the site: a line in a dashed frame, with an optional way forward. */
export function Empty({ children, action }: { children: ReactNode; action?: ReactNode }) {
	return (
		<Card tone="dashed" className="flex flex-col items-start gap-3 p-6 text-sm text-fg-muted">
			<p>{children}</p>
			{action}
		</Card>
	);
}
