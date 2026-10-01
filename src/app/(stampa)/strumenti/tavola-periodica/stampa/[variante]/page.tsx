import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_NAME } from '@/lib/config/site';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { PERIODIC_PATH } from '@/components/tools/periodic/PeriodicPage';
import { PeriodicSheet, SHEET_VARIANTS, type SheetVariant } from '@/components/tools/periodic/PeriodicSheet';

/**
 * The periodic table on an A4 sheet, in colour or in black and white: the page the PDFs are made from
 * (scripts/tavola-periodica/pdf.mjs), outside the site's frame. Not indexed: the page to find is the tool.
 */

type Params = { params: Promise<{ variante: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
	return SHEET_VARIANTS.map((variante) => ({ variante }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { variante } = await params;
	return pageMetadata({
		title: `Tavola periodica degli elementi da stampare${variante === 'bianco-nero' ? ', in bianco e nero' : ''} | ${SITE_NAME}`,
		description: 'La tavola periodica degli elementi su un foglio A4 orizzontale, da stampare.',
		path: `${PERIODIC_PATH}/stampa/${variante}`,
		noindex: true,
		follow: true
	});
}

export default async function PeriodicSheetRoute({ params }: Params) {
	const { variante } = await params;
	if (!SHEET_VARIANTS.includes(variante as SheetVariant)) notFound();
	return (
		<div className="min-h-screen overflow-x-auto bg-surface-3 py-6 print:bg-white print:py-0">
			<p className="mx-auto mb-4 w-[297mm] text-sm text-fg-muted">
				<Link href={PERIODIC_PATH} className="font-medium text-fg underline underline-offset-4">
					Torna alla tavola periodica
				</Link>
				. Per stampare questo foglio scegli il formato A4 orizzontale, senza margini.
			</p>
			<div className="mx-auto w-[297mm] shadow-lift print:shadow-none">
				<PeriodicSheet variant={variante as SheetVariant} />
			</div>
		</div>
	);
}
