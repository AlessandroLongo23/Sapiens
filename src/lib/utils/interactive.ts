import { createElement, type ComponentType } from 'react';
import type { Root } from 'react-dom/client';

/**
 * Interactive figures in lessons: an ```interattivo block is published as an empty <figure data-interattivo="name">
 * (see interactiveFigure in content/markdown.ts). When it scrolls near, its component is loaded and mounted there.
 * Each component is its own chunk, so a lesson pays only for the figures it has.
 */
const FIGURES: Record<string, () => Promise<{ default: ComponentType<{ alt?: string }> }>> = {
	'trapezio-triangolo': () => import('@/components/content/interactive/TrapezioTriangolo'),
	// Pieces that move and keep their area.
	'parallelogramma-rettangolo': () => import('@/components/content/interactive/ParallelogrammaRettangolo'),
	'differenza-di-quadrati': () => import('@/components/content/interactive/DifferenzaDiQuadrati'),
	'cerchio-settori': () => import('@/components/content/interactive/CerchioSettori'),
	'euclide-primo-teorema': () => import('@/components/content/interactive/EuclidePrimoTeorema'),
	'pitagora-quadrati-mobili': () => import('@/components/content/interactive/PitagoraQuadrati'),
	// Geometry with points to drag.
	'famiglie-quadrilateri': () => import('@/components/content/interactive/FamiglieQuadrilateri'),
	'punti-notevoli-posizione': () => import('@/components/content/interactive/PuntiNotevoli'),
	'somma-angoli-triangolo': () => import('@/components/content/interactive/SommaAngoliTriangolo'),
	'trasversale-angoli': () => import('@/components/content/interactive/TrasversaleAngoli'),
	'disuguaglianza-triangolare': () => import('@/components/content/interactive/DisuguaglianzaTriangolare'),
	'angolo-alla-circonferenza': () => import('@/components/content/interactive/AngoloAllaCirconferenza'),
	'quadrilatero-inscritto': () => import('@/components/content/interactive/QuadrilateroInscritto'),
	'rapporti-stesso-angolo': () => import('@/components/content/interactive/RapportiStessoAngolo'),
	'talete-segmenti-proporzionali': () => import('@/components/content/interactive/TaleteProporzionali'),
	'similitudine-aree-copie': () => import('@/components/content/interactive/SimilitudineAree'),
	'omotetia-rapporto-k': () => import('@/components/content/interactive/Omotetia'),
	// The number line and statistics.
	'addizione-interi-retta': () => import('@/components/content/interactive/AddizioneInteri'),
	'secondo-principio-retta': () => import('@/components/content/interactive/SecondoPrincipio'),
	'disequazione-prova-valori': () => import('@/components/content/interactive/DisequazioneProva'),
	'media-equilibrio-pesi': () => import('@/components/content/interactive/MediaEquilibrio'),
	'valore-anomalo-trascina': () => import('@/components/content/interactive/ValoreAnomalo'),
	'sistema-disequazioni-grafico': () => import('@/components/content/interactive/SistemaDisequazioni'),
	'scarti-quadrati-voti': () => import('@/components/content/interactive/ScartiQuadrati'),
	'radice-sulla-retta-compasso': () => import('@/components/content/interactive/RadiceRetta'),
	'equazione-date-le-soluzioni': () => import('@/components/content/interactive/EquazioneDaSoluzioni'),
	// Sets, relations and tables of outcomes.
	'venn-elementi-trascina': () => import('@/components/content/interactive/VennElementi'),
	'venn-proprieta-operazioni': () => import('@/components/content/interactive/VennProprieta'),
	'unione-cerchio-mobile': () => import('@/components/content/interactive/UnioneConta'),
	'frecce-funzione-costruisci': () => import('@/components/content/interactive/FrecceFunzione'),
	'relazione-proprieta-spie': () => import('@/components/content/interactive/RelazioneProprieta'),
	'venn-de-morgan-colora': () => import('@/components/content/interactive/VennDeMorgan'),
	'due-dadi-unione-eventi': () => import('@/components/content/interactive/DueDadiUnione'),
	// Fractions, divisibility and percentages.
	'frazioni-equivalenti': () => import('@/components/content/interactive/FrazioniEquivalenti'),
	'moltiplicazione-frazioni': () => import('@/components/content/interactive/MoltiplicazioneFrazioni'),
	'somma-di-frazioni': () => import('@/components/content/interactive/SommaFrazioni'),
	'sconti-successivi': () => import('@/components/content/interactive/ScontiSuccessivi'),
	'piastrelle-mcd': () => import('@/components/content/interactive/PiastrelleMCD'),
	'euclide-rettangolo': () => import('@/components/content/interactive/EuclideRettangolo'),
	'crivello-di-eratostene': () => import('@/components/content/interactive/CrivelloEratostene'),
	// Simulations and manipulatives.
	'bilancia-principi-equivalenza': () => import('@/components/content/interactive/BilanciaEquivalenza'),
	'trinomio-tessere': () => import('@/components/content/interactive/TessereTrinomio'),
	'moto-incontro-tempo': () => import('@/components/content/interactive/MotoIncontro'),
	'tabella-segni-cursore': () => import('@/components/content/interactive/TabellaSegniCursore'),
	'frequenza-relativa-lanci': () => import('@/components/content/interactive/FrequenzaLanci'),
};

export function activateInteractives(root: HTMLElement): () => void {
	const roots: Root[] = [];
	let stopped = false;
	const mount = async (figure: HTMLElement) => {
		const load = FIGURES[figure.dataset.interattivo ?? ''];
		if (!load) return;
		const [{ createRoot }, { default: Figure }] = await Promise.all([import('react-dom/client'), load()]);
		if (stopped) return;
		const root = createRoot(figure);
		root.render(createElement(Figure, { alt: figure.dataset.alt }));
		roots.push(root);
	};
	const observer = new IntersectionObserver(
		(entries) =>
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				observer.unobserve(entry.target);
				void mount(entry.target as HTMLElement);
			}),
		{ rootMargin: '400px 0px' }
	);
	root.querySelectorAll('[data-interattivo]').forEach((figure) => observer.observe(figure));
	return () => {
		stopped = true;
		observer.disconnect();
		// Unmounted after the current render, as React asks of a root torn down from an effect.
		const done = roots.splice(0);
		queueMicrotask(() => done.forEach((r) => r.unmount()));
	};
}
