import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SITE_NAME } from '@/lib/config/site';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { CATEGORY_NAMES } from '@/lib/tools/types';
import { TOOLS, TOOLS_ROOT, toolsByCategory } from '@/lib/tools/registry';
import { HOME_CRUMB } from '@/components/content/Breadcrumb';
import { Page, PageHeader } from '@/components/content/PageHeader';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = pageMetadata({
	title: `Calcolatori e convertitori online gratis | ${SITE_NAME}`,
	description: 'Calcolatori per la scuola, gratuiti e senza registrazione: percentuali, mcm e MCD e altri, con tutti i passaggi e il collegamento alla lezione.',
	path: TOOLS_ROOT
});

/** The index of the tools, by category. */
export default function ToolsIndex() {
	return (
		<Page width="medium">
			<JsonLd
				data={breadcrumbJsonLd([
					{ name: 'Home', path: '/' },
					{ name: 'Strumenti', path: TOOLS_ROOT }
				])}
			/>
			<PageHeader crumbs={[HOME_CRUMB]} eyebrow="Gratis, senza registrazione" title="Strumenti" lead={`${TOOLS.length} calcolatori per la scuola, con tutti i passaggi e il collegamento alla lezione dell'argomento.`} />
			<div className="flex flex-col gap-10">
				{toolsByCategory().map(([category, tools]) => (
					<section key={category} aria-labelledby={`cat-${category}`}>
						<h2 id={`cat-${category}`} className="mb-3 border-b border-edge pb-2 text-2xl font-semibold text-fg-strong">
							{CATEGORY_NAMES[category]}
						</h2>
						<ul className="grid gap-3 sm:grid-cols-2">
							{tools.map((t) => (
								<li key={t.slug}>
									<Link href={`${TOOLS_ROOT}/${t.slug}`} className="group flex h-full items-start gap-3 rounded-xl border border-edge bg-surface p-4 shadow-paper transition-colors hover:border-edge-strong focus-ring">
										<span className="flex min-w-0 flex-1 flex-col gap-1">
											<span className="font-medium text-fg-strong">{t.title}</span>
											<span className="text-sm text-fg-muted">{t.lead}</span>
										</span>
										<ArrowRight className="mt-1 size-4 shrink-0 text-fg-subtle transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
									</Link>
								</li>
							))}
						</ul>
					</section>
				))}
			</div>
		</Page>
	);
}
