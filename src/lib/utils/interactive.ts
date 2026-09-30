import { createElement, type ComponentType } from 'react';
import type { Root } from 'react-dom/client';

/**
 * Interactive figures in lessons: an ```interattivo block is published as an empty <figure data-interattivo="name">
 * (see interactiveFigure in content/markdown.ts). When it scrolls near, its component is loaded and mounted there.
 * Each component is its own chunk, so a lesson pays only for the figures it has.
 */
export const FIGURES: Record<string, () => Promise<{ default: ComponentType<{ alt?: string }> }>> = {
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
	// Physics, first year: quantities and units (group 1).
	'pendolo-periodo': () => import('@/components/content/interactive/fisica/PendoloPeriodo'),
	'densita-massa-volume': () => import('@/components/content/interactive/fisica/DensitaMassaVolume'),
	'calibro-nonio': () => import('@/components/content/interactive/fisica/CalibroNonio'),
	// Physics, first year: errors and uncertainty (group 2).
	'bersaglio-errori': () => import('@/components/content/interactive/fisica/BersaglioErrori'),
	'misure-ripetute-istogramma': () => import('@/components/content/interactive/fisica/MisureRipetute'),
	'rettangolo-lati-incerti': () => import('@/components/content/interactive/fisica/RettangoloIncerto'),
	// Physics, first year: graphs (group 3).
	'molla-pesetti': () => import('@/components/content/interactive/fisica/MollaPesetti'),
	'siringa-pressione-volume': () => import('@/components/content/interactive/fisica/SiringaPressione'),
	// Physics, first year: vectors (group 4).
	'vettori-confronto-griglia': () => import('@/components/content/interactive/fisica/VettoriConfronto'),
	'somma-vettori-parallelogramma': () => import('@/components/content/interactive/fisica/SommaVettori'),
	'differenza-vettori-opposto': () => import('@/components/content/interactive/fisica/DifferenzaVettori'),
	'vettore-per-scalare': () => import('@/components/content/interactive/fisica/VettorePerScalare'),
	'componenti-vettore-quadranti': () => import('@/components/content/interactive/fisica/ComponentiVettore'),
	// Physics, first year: forces (group 5).
	'dinamometro-pesetti': () => import('@/components/content/interactive/fisica/DinamometroPesetti'),
	'peso-massa-pianeti': () => import('@/components/content/interactive/fisica/PesoMassaPianeti'),
	'molla-hooke-righello': () => import('@/components/content/interactive/fisica/MollaHookeRighello'),
	'attrito-blocco-spinta': () => import('@/components/content/interactive/fisica/AttritoBloccoSpinta'),
	// Physics, first year: equilibrium of a point (group 6).
	'corpo-due-fili-tensioni': () => import('@/components/content/interactive/fisica/CorpoDueFili'),
	'piano-inclinato-scomposizione-peso': () => import('@/components/content/interactive/fisica/PianoInclinatoPeso'),
	// Physics, first year: rigid bodies and levers (group 7).
	'chiave-inglese-momento': () => import('@/components/content/interactive/fisica/ChiaveInglese'),
	'altalena-momenti': () => import('@/components/content/interactive/fisica/Altalena'),
	'leva-tre-generi': () => import('@/components/content/interactive/fisica/LevaGeneri'),
	'blocco-ribaltamento': () => import('@/components/content/interactive/fisica/BloccoRibaltamento'),
	// Physics, first year: pressure, Pascal and Stevin (group 8).
	'torchio-idraulico': () => import('@/components/content/interactive/fisica/TorchioIdraulico'),
	'pressione-profondita': () => import('@/components/content/interactive/fisica/PressioneProfondita'),
	'tubo-a-u-liquidi': () => import('@/components/content/interactive/fisica/TuboAU'),
	// Physics, first year: atmosphere and Archimedes (group 9).
	'torricelli-tubo-inclinato': () => import('@/components/content/interactive/fisica/TorricelliTubo'),
	'dinamometro-corpo-immerso': () => import('@/components/content/interactive/fisica/DinamometroImmersione'),
	'galleggiamento-densita': () => import('@/components/content/interactive/fisica/CorpoGalleggiante'),
	// Physics, first year: rays and mirrors (group 10).
	'ombra-penombra-sorgente': () => import('@/components/content/interactive/fisica/OmbraPenombra'),
	'riflessione-angolo-specchio': () => import('@/components/content/interactive/fisica/RiflessioneSpecchio'),
	'immagine-specchio-piano': () => import('@/components/content/interactive/fisica/ImmagineSpecchioPiano'),
	'specchio-sferico-immagine': () => import('@/components/content/interactive/fisica/SpecchioSferico'),
	// Physics, first year: refraction and lenses (group 11).
	'rifrazione-due-mezzi': () => import('@/components/content/interactive/fisica/RifrazioneDueMezzi'),
	'prisma-dispersione-colori': () => import('@/components/content/interactive/fisica/PrismaDispersione'),
	'sintesi-additiva-sottrattiva': () => import('@/components/content/interactive/fisica/SintesiColori'),
	'lente-oggetto-immagine': () => import('@/components/content/interactive/fisica/LenteOggettoImmagine'),
	// Physics, second year: kinematics 1 (group 12).
	'andata-ritorno-distanza-spostamento': () => import('@/components/content/interactive/fisica/AndataRitorno'),
	'moto-uniforme-grafico-spazio-tempo': () => import('@/components/content/interactive/fisica/MotoUniformeGrafico'),
	'incontro-rette-spazio-tempo': () => import('@/components/content/interactive/fisica/IncontroRette'),
	// Physics, second year: kinematics 2 (group 13).
	'auto-accelerata-grafici': () => import('@/components/content/interactive/fisica/AutoAccelerataGrafici'),
	'grafico-velocita-tempo-tratti': () => import('@/components/content/interactive/fisica/GraficoVTratti'),
	'lancio-verticale-velocita': () => import('@/components/content/interactive/fisica/LancioVerticale'),
	// Physics, second year: motion in a plane (group 14).
	'velocita-media-tangente': () => import('@/components/content/interactive/fisica/VelocitaMediaTangente'),
	'barca-fiume-correnti': () => import('@/components/content/interactive/fisica/BarcaFiume'),
	'moto-circolare-radianti': () => import('@/components/content/interactive/fisica/MotoCircolareRadianti'),
	'moto-circolare-accelerazione': () => import('@/components/content/interactive/fisica/MotoCircolare'),
	'moto-armonico-ombra': () => import('@/components/content/interactive/fisica/MotoArmonicoOmbra'),
	// Physics, second year: laws of motion (group 15).
	'carrello-forza-accelerazione': () => import('@/components/content/interactive/fisica/CarrelloForza'),
	'piano-doppio-galileo': () => import('@/components/content/interactive/fisica/PianoDoppioGalileo'),
	'ascensore-bilancia': () => import('@/components/content/interactive/fisica/AscensoreBilancia'),
	'diagramma-forze-costruisci': () => import('@/components/content/interactive/fisica/DiagrammaForzeCostruisci'),
	'pattinatori-spinta': () => import('@/components/content/interactive/fisica/PattinatoriSpinta'),
	// Physics, second year: forces and motion (group 16).
	'piano-inclinato-moto-attrito': () => import('@/components/content/interactive/fisica/PianoInclinatoMoto'),
	'macchina-atwood-masse': () => import('@/components/content/interactive/fisica/MacchinaAtwood'),
	'proiettile-tavolo-gittata': () => import('@/components/content/interactive/fisica/ProiettileTavolo'),
	'forza-centripeta-filo-spezzato': () => import('@/components/content/interactive/fisica/FiloSpezzato'),
	'pendolo-periodo-ampiezza': () => import('@/components/content/interactive/fisica/PendoloAmpiezza'),
	// Physics, second year: work and power (group 17).
	'cassa-fune-lavoro': () => import('@/components/content/interactive/fisica/CassaFuneLavoro'),
	'molla-area-lavoro': () => import('@/components/content/interactive/fisica/MollaAreaLavoro'),
	'frenata-spazio-velocita': () => import('@/components/content/interactive/fisica/FrenataSpazio'),
	// Physics, second year: energy (group 18).
	'montagne-russe-energia': () => import('@/components/content/interactive/fisica/MontagneRusseEnergia'),
	'montagne-russe-attrito': () => import('@/components/content/interactive/fisica/MontagneRusseAttrito'),
	'pendolo-energia-barre': () => import('@/components/content/interactive/fisica/PendoloEnergia'),
	'molla-lancio-rampa-energia': () => import('@/components/content/interactive/fisica/MollaLancioRampa'),
	// Physics, second year: temperature (group 19).
	'termometro-tre-scale': () => import('@/components/content/interactive/fisica/TermometroScale'),
	'dilatazione-sbarra': () => import('@/components/content/interactive/fisica/DilatazioneSbarra'),
	'riscaldamento-acqua-olio': () => import('@/components/content/interactive/fisica/RiscaldamentoAcquaOlio'),
	// Physics, second year: heat (group 20).
	'equilibrio-termico-due-corpi': () => import('@/components/content/interactive/fisica/EquilibrioTermicoDueCorpi'),
	'conduzione-sbarra-materiali': () => import('@/components/content/interactive/fisica/ConduzioneSbarra'),
	'curva-riscaldamento-acqua': () => import('@/components/content/interactive/fisica/CurvaRiscaldamentoAcqua'),
	// Chemistry, first two years: measurements (group 21).
	// Chemistry, first two years: matter 1 (group 22).
	// Chemistry, first two years: matter 2 (group 23).
	// Chemistry, first two years: chemical changes 1 (group 24).
	// Chemistry, first two years: chemical changes 2 (group 25).
	// Chemistry, first two years: gases (group 26).
	// Chemistry, first two years: the mole (group 27).
	// Chemistry, first two years: the atom (group 28).
	// Chemistry, first two years: water (group 29).
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
