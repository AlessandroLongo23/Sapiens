import 'katex/dist/katex.min.css';
import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/config/site';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { CATEGORY_NAMES, type ToolCategory } from '@/lib/tools/types';
import { TOOLS, TOOLS_ROOT, toolsByCategory } from '@/lib/tools/registry';
import { mathLine } from '@/lib/tools/tex';
import { HOME_CRUMB } from '@/components/content/Breadcrumb';
import { Page, PageHeader } from '@/components/content/PageHeader';
import { JsonLd } from '@/components/seo/JsonLd';
import { normalise } from '@/lib/tools/search';
import { ToolIndex, type ToolGroup } from '@/components/tools/ToolIndex';
import { TOOL_ART } from '@/components/tools/art';

export const metadata: Metadata = pageMetadata({
	title: `Calcolatori e convertitori online gratis | ${SITE_NAME}`,
	description: 'Calcolatori per la scuola, gratuiti e senza registrazione: percentuali, mcm e MCD, equazioni, aree, conversioni e altri, con tutti i passaggi.',
	path: TOOLS_ROOT
});

/** The name on a category's tab, short enough for ten tabs in a row. */
const TAB_NAMES: Record<ToolCategory, string> = {
	numeri: 'Numeri',
	algebra: 'Algebra',
	geometria: 'Geometria',
	statistica: 'Statistica',
	trigonometria: 'Trigonometria',
	conversioni: 'Conversioni',
	fisica: 'Fisica',
	chimica: 'Chimica',
	informatica: 'Informatica',
	scuola: 'Scuola'
};

/** The index of the tools: search, one tab per category, a card per tool with a worked example. */
export default function ToolsIndex() {
	const groups: ToolGroup[] = toolsByCategory().map(([category, tools]) => ({
		category,
		name: CATEGORY_NAMES[category],
		short: TAB_NAMES[category],
		tools: tools.map((t) => ({
			href: `${TOOLS_ROOT}/${t.slug}`,
			title: t.title,
			lead: t.lead,
			sample: mathLine(t.sample),
			art: TOOL_ART[t.slug],
			haystack: normalise([t.title, t.lead, ...(t.keywords ?? []), CATEGORY_NAMES[category]].join(' '))
		}))
	}));
	return (
		<Page width="wide">
			<JsonLd
				data={breadcrumbJsonLd([
					{ name: 'Home', path: '/' },
					{ name: 'Strumenti', path: TOOLS_ROOT }
				])}
			/>
			<PageHeader crumbs={[HOME_CRUMB]} eyebrow="Gratis, senza registrazione" title="Strumenti" lead={`${TOOLS.length} calcolatori e convertitori per la scuola, con tutti i passaggi e il collegamento alla lezione dell'argomento.`} />
			<ToolIndex groups={groups} />
		</Page>
	);
}
