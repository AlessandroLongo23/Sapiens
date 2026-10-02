import type { Metadata } from 'next';
import { parse } from '@cortex-js/compute-engine/latex-syntax';
import { Page } from '@/components/content/PageHeader';
import { Plotter } from '@/components/grafico/Plotter';
import { stateOf } from '@/lib/grafico/documento';
import { cleanLatex, type Json } from '@/lib/grafico/formula';

/** A trial page for the plotter while it is being built: not linked, not indexed, to be removed. `?f=` sets the formulas. */
export const metadata: Metadata = { title: 'Prova del grafico', robots: { index: false, follow: false } };

export default async function PlotterTrial({ searchParams }: { searchParams: Promise<{ f?: string | string[] }> }) {
	const { f } = await searchParams;
	const formulas = f ? [f].flat() : ['f\\left(x\\right)=x^2-2x-1'];
	const read = formulas.map((latex) => ({ latex, json: parse(cleanLatex(latex)) as Json }));
	return (
		<Page width="full">
			<h1 className="mb-4 text-4xl font-semibold text-fg-strong">Grafico di funzioni</h1>
			<Plotter initial={stateOf(formulas)} read={read} />
		</Page>
	);
}
