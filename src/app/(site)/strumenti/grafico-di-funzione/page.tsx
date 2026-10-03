import type { Metadata } from 'next';
import { parse } from '@cortex-js/compute-engine/latex-syntax';
import { SITE_NAME } from '@/lib/config/site';
import { stateOf } from '@/lib/grafico/documento';
import { cleanLatex, type Json } from '@/lib/grafico/formula';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { toolBySlug } from '@/lib/tools/registry';
import { toolArticle, toolLessons } from '@/lib/server/tools';
import { PLOTTER_PATH, PLOTTER_SLUG, PlotterPage } from '@/components/grafico/PlotterPage';

/**
 * The plotter (vault/Prodotti/Studenti/Grafico di funzioni.md): a tool with a page of its own. Static: the formula
 * it opens with is read here, so its curve is in the HTML; a graph a student shares lives after the # of the
 * address, and the canonical is the plain address.
 */

// The links to lessons follow the content tree: a publish refreshes them through /api/revalidate, with no timer.
export const revalidate = false;

/** What the plane shows before anything is typed. */
const START = ['f\\left(x\\right)=x^2-2x-1'];

export function generateMetadata(): Metadata {
	const tool = toolBySlug(PLOTTER_SLUG)!;
	return pageMetadata({ title: `Grafico di funzione online: calcolatrice grafica e geometria analitica | ${SITE_NAME}`, description: tool.description, path: PLOTTER_PATH });
}

export default async function PlotterRoute() {
	const tool = toolBySlug(PLOTTER_SLUG)!;
	const [lessons, articleHtml] = await Promise.all([toolLessons(tool), toolArticle(tool.slug)]);
	const read = START.map((latex) => ({ latex, json: parse(cleanLatex(latex)) as Json }));
	return <PlotterPage tool={tool} lessons={lessons} articleHtml={articleHtml} initial={stateOf(START)} read={read} />;
}
