import type { ReactNode } from 'react';
import type { IconComponent, SubjectTone } from '@/lib/utils/icons';
import { cn } from '@/lib/utils/cn';
import { Sticker } from '@/components/ui/Sticker';
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb';

/**
 * A stroke of red pen, drawn under a title the way a student marks a heading.
 * By default it draws itself once on load; `onHover` leaves it undrawn until
 * the enclosing `group` is hovered or focused, and takes it back on leave.
 */
export function PenStroke({ className, onHover = false }: { className?: string; onHover?: boolean }) {
	return (
		<svg viewBox="0 0 200 12" preserveAspectRatio="none" className={cn('pointer-events-none h-2.5 w-full text-accent', className)} aria-hidden="true">
			<path
				d="M2 8.5c30-4.2 62-6.1 98-5.9 32 .2 62 1.9 98 4.6"
				fill="none"
				stroke="currentColor"
				strokeWidth="3.2"
				strokeLinecap="round"
				className={onHover ? '[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-500 ease-out-soft group-hover:[stroke-dashoffset:0] group-focus-visible:[stroke-dashoffset:0] group-active:[stroke-dashoffset:0] motion-reduce:transition-none' : 'pen-stroke'}
				pathLength={1}
			/>
		</svg>
	);
}

/**
 * The top of an index page: trail, an eyebrow, the title in the display serif
 * with a pen stroke under it, a lead paragraph and a row of figures. The icon
 * sits on the right as a tinted tab, like the sticker on a notebook's cover.
 * In the installed app on a phone it is a title bar's large title: no trail
 * (the header has a back arrow), no figures, a smaller title.
 */
export function PageHeader({ crumbs, icon: Icon, eyebrow, title, lead, stats, extra }: { crumbs: BreadcrumbItem[]; icon: IconComponent; eyebrow?: ReactNode; title: ReactNode; lead?: ReactNode; stats?: ReactNode; extra?: ReactNode }) {
	return (
		<header className="mb-10 animate-fade-in sm:mb-16 app:max-md:mb-6">
			<Breadcrumb items={crumbs} />
			<div className="flex items-start justify-between gap-8">
				<div className="min-w-0 flex-1 space-y-6 app:max-md:space-y-4">
					<div className="space-y-4 app:max-md:space-y-3">
						{eyebrow && <p className="label-mono text-tint-fg">{eyebrow}</p>}
						<h1 className="w-fit max-w-full text-5xl font-semibold leading-[1.02] text-fg-strong sm:text-6xl lg:text-7xl app:max-md:text-4xl">
							{title}
							<PenStroke className="mt-2" />
						</h1>
						{lead && <p className="max-w-2xl text-lg leading-relaxed text-fg-muted app:max-md:text-base">{lead}</p>}
					</div>
					{stats && <div className="flex flex-wrap gap-x-6 gap-y-4 pt-2 app:max-md:hidden">{stats}</div>}
					{extra}
				</div>
				<Sticker icon={Icon} size="lg" className="hidden sm:flex" />
			</div>
		</header>
	);
}

/**
 * A section of an index page: a mono count, the heading in the serif, and its
 * items. `layout="grid"` lays out cards; `layout="list"` is a numbered table of
 * contents, in two columns on wide screens.
 */
export function CardGridSection({ id, title, count, layout = 'grid', children }: { id: string; title: string; count?: number; layout?: 'grid' | 'list'; children: ReactNode }) {
	return (
		<section className="animate-fade-in space-y-6" aria-labelledby={id}>
			<div className="flex items-end justify-between gap-4 border-b border-edge-strong pb-3">
				<h2 id={id} className="text-3xl font-semibold text-fg-strong app:max-md:text-2xl">
					{title}
				</h2>
				{count !== undefined && <span className="label-mono pb-1 text-fg-subtle">{String(count).padStart(2, '0')}</span>}
			</div>
			{layout === 'grid' ? (
				<div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">{children}</div>
			) : (
				<ol className="grid grid-cols-1 gap-x-12 lg:grid-cols-2">{children}</ol>
			)}
		</section>
	);
}

/**
 * Index pages share one page background and container: the page, with a band
 * of squared paper behind the header that fades out as the content begins.
 * `tone` colours everything tinted on the page after a subject.
 */
export function Page({ children, width = 'wide', tone }: { children: ReactNode; width?: 'wide' | 'medium' | 'narrow'; tone?: SubjectTone }) {
	const max = { wide: 'max-w-7xl', medium: 'max-w-5xl', narrow: 'max-w-3xl' }[width];
	return (
		<div className="relative min-h-screen overflow-hidden bg-page-alt" data-subject={tone}>
			<div className="grid-paper pointer-events-none absolute inset-x-0 top-0 h-[30rem] [mask-image:linear-gradient(to_bottom,black_30%,transparent)]" aria-hidden="true" />
			<div className={`relative z-10 mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 app:max-md:pt-5 ${max}`}>{children}</div>
		</div>
	);
}
