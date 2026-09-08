import type { ReactNode } from 'react';
import type { IconComponent } from '@/lib/utils/icons';
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb';

/** The top of an index page: trail, a big icon, the title, a lead paragraph and a row of figures. */
export function PageHeader({ crumbs, icon: Icon, title, lead, stats, extra }: { crumbs: BreadcrumbItem[]; icon: IconComponent; title: ReactNode; lead?: ReactNode; stats?: ReactNode; extra?: ReactNode }) {
	return (
		<header className="mb-8 animate-fade-in sm:mb-12">
			<Breadcrumb items={crumbs} />
			<div className="flex items-start gap-6">
				<div className="hidden size-28 shrink-0 items-center justify-center rounded-2xl border border-edge bg-surface text-accent-fg shadow-sm sm:flex lg:size-32">
					<Icon className="size-14 lg:size-16" aria-hidden="true" />
				</div>
				<div className="flex-1 space-y-4">
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<Icon className="size-8 text-accent-fg sm:hidden" aria-hidden="true" />
							<h1 className="text-4xl font-bold tracking-tight text-fg-strong sm:text-5xl">{title}</h1>
						</div>
						{lead && <p className="max-w-2xl text-lg leading-relaxed text-fg-muted">{lead}</p>}
					</div>
					{stats && <div className="flex flex-wrap gap-3">{stats}</div>}
					{extra}
				</div>
			</div>
		</header>
	);
}

/** A section of an index page with its heading and an icon, holding a grid of cards. */
export function CardGridSection({ id, icon: Icon, color = 'text-accent-fg', title, children }: { id: string; icon: IconComponent; color?: string; title: string; children: ReactNode }) {
	return (
		<section className="animate-fade-in space-y-6" aria-labelledby={id}>
			<div className="flex items-center justify-between border-b border-edge pb-4">
				<h2 id={id} className="flex items-center gap-2 text-2xl font-semibold text-fg">
					<Icon className={`size-5 ${color}`} aria-hidden="true" />
					{title}
				</h2>
			</div>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{children}</div>
		</section>
	);
}

/** Index pages share one page background and container. */
export function Page({ children, width = 'wide' }: { children: ReactNode; width?: 'wide' | 'medium' | 'narrow' }) {
	const max = { wide: 'max-w-7xl', medium: 'max-w-5xl', narrow: 'max-w-3xl' }[width];
	return (
		<div className="relative min-h-screen overflow-hidden bg-page-alt">
			<div className={`relative z-10 mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 ${max}`}>{children}</div>
		</div>
	);
}
