import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Page, PageHeader } from '@/components/content/PageHeader';
import { HOME_CRUMB } from '@/components/content/Breadcrumb';
import { VERSIONS } from '@/components/landing/prova/common';

/** The three candidates for the new landing page, to open side by side. Out of the index, with no link from the site. */
export const metadata: Metadata = { title: 'Landing, le tre versioni', robots: { index: false, follow: false } };

export default function LandingTrials() {
	return (
		<Page>
			<PageHeader crumbs={[HOME_CRUMB, { label: 'Landing' }]} eyebrow="PROVA" title="Tre versioni della landing" lead="Stesso contenuto e stessi numeri, tre modi di raccontarlo. In fondo a ogni pagina c'è la barra per passare da una all'altra." />
			<ol className="grid gap-5 md:grid-cols-3">
				{VERSIONS.map((v, i) => (
					<li key={v.slug}>
						<Link href={`/prova-home/${v.slug}`} className="group flex h-full flex-col rounded-3xl border border-edge bg-surface p-7 no-underline shadow-paper transition-[translate,box-shadow,border-color] duration-300 ease-out-soft hover:-translate-y-1 hover:border-edge-strong hover:shadow-lift focus-ring-offset">
							<span className="font-mono text-sm text-fg-faint">0{i + 1}</span>
							<span className="mt-3 font-display text-4xl font-semibold tracking-tight text-fg-strong">{v.name}</span>
							<span className="mt-3 flex-1 text-base leading-relaxed text-fg-muted">{v.line}</span>
							<span className="label-mono mt-6 flex items-center gap-2 text-accent-fg">
								Apri
								<ArrowRight className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-1" aria-hidden="true" />
							</span>
						</Link>
					</li>
				))}
			</ol>
		</Page>
	);
}
