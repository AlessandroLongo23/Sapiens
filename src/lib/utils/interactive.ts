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
	// Scenes of the physics sandbox, fixed for a lesson (src/components/sandbox/LessonScene.tsx).
	'scena-lampada-due-fili': () => import('@/components/content/interactive/fisica/ScenaLampadaDueFili'),
	'scena-carrello-pesetto': () => import('@/components/content/interactive/fisica/ScenaCarrelloPesetto'),
	'scena-cassa-in-salita': () => import('@/components/content/interactive/fisica/ScenaCassaInSalita'),
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
	// Physics, third year: vector products, projectile, variable force (group 30).
	'prodotto-scalare-proiezione-segno': () => import('@/components/content/interactive/fisica/ProdottoScalare'),
	'prodotto-vettoriale-area-verso': () => import('@/components/content/interactive/fisica/ProdottoVettoriale'),
	'lancio-obliquo-angolo-gittata': () => import('@/components/content/interactive/fisica/LancioObliquo'),
	'lavoro-area-rettangoli-tratti': () => import('@/components/content/interactive/fisica/LavoroRettangoli'),
	// Physics, third year: frames of reference (group 31).
	'autobus-frena-due-osservatori': () => import('@/components/content/interactive/fisica/AutobusFrena'),
	'trasformazioni-galileo-vagone': () => import('@/components/content/interactive/fisica/VagoneGalileo'),
	'nave-galileo-sasso': () => import('@/components/content/interactive/fisica/NaveGalileo'),
	'giostra-coriolis-palla': () => import('@/components/content/interactive/fisica/GiostraCoriolis'),
	// Physics, third year: conservative forces, momentum, impulse (group 32).
	'lavoro-due-cammini-peso-attrito': () => import('@/components/content/interactive/fisica/LavoroDueCammini'),
	'grafico-energia-potenziale-buca': () => import('@/components/content/interactive/fisica/GraficoEnergiaPotenziale'),
	'rampa-liscia-pavimento-attrito': () => import('@/components/content/interactive/fisica/RampaPavimentoAttrito'),
	'quantita-moto-due-carrelli': () => import('@/components/content/interactive/fisica/QuantitaMotoCarrelli'),
	'impulso-tempo-arresto-forza': () => import('@/components/content/interactive/fisica/ImpulsoTempoArresto'),
	// Physics, third year: collisions and centre of mass (group 33).
	'carrelli-molla-rinculo': () => import('@/components/content/interactive/fisica/CarrelliMollaRinculo'),
	'urto-anelastico-energia': () => import('@/components/content/interactive/fisica/UrtoAnelasticoEnergia'),
	'urto-elastico-masse': () => import('@/components/content/interactive/fisica/UrtoElasticoMasse'),
	'biliardo-urto-angoli': () => import('@/components/content/interactive/fisica/BiliardoUrtoAngoli'),
	'centro-massa-urto-carrelli': () => import('@/components/content/interactive/fisica/CentroMassaUrto'),
	// Physics, third year: rotation, kinematics and dynamics (group 34).
	'disco-accelerazione-angolare': () => import('@/components/content/interactive/fisica/DiscoAccelerazioneAngolare'),
	'asta-masse-momento-inerzia': () => import('@/components/content/interactive/fisica/AstaMasseMomentoInerzia'),
	'carrucola-massa-secchio': () => import('@/components/content/interactive/fisica/CarrucolaMassaSecchio'),
	// Physics, third year: rotational energy and angular momentum (group 35).
	'rotolamento-gara-piano-inclinato': () => import('@/components/content/interactive/fisica/GaraRotolamento'),
	'momento-angolare-moto-rettilineo-braccio': () => import('@/components/content/interactive/fisica/MomentoAngolareRetta'),
	'momento-angolare-masse-piattaforma': () => import('@/components/content/interactive/fisica/PiattaformaMasse'),
	// Physics, third year: cosmological systems, Kepler, universal gravitation (group 36).
	'epiciclo-deferente-cappi': () => import('@/components/content/interactive/fisica/EpicicloDeferente'),
	'moto-retrogrado-sorpasso': () => import('@/components/content/interactive/fisica/MotoRetrogradoSorpasso'),
	'orbita-ellittica-aree': () => import('@/components/content/interactive/fisica/OrbitaAree'),
	'gravitazione-due-masse': () => import('@/components/content/interactive/fisica/GravitazioneDueMasse'),
	// Physics, third year: gravitational field, satellites, energy (group 37).
	'campo-gravitazionale-sonda': () => import('@/components/content/interactive/fisica/CampoGravitazionaleSonda'),
	'cannone-newton-orbita': () => import('@/components/content/interactive/fisica/CannoneNewton'),
	'lancio-verticale-energia-fuga': () => import('@/components/content/interactive/fisica/LancioVerticaleFuga'),
	// Physics, third year: fluid dynamics (group 38).
	'tubo-continuita-diametro': () => import('@/components/content/interactive/fisica/TuboContinuita'),
	'bernoulli-tubo-barre': () => import('@/components/content/interactive/fisica/BernoulliTubo'),
	'serbatoio-foro-getto': () => import('@/components/content/interactive/fisica/SerbatoioGetto'),
	'sferette-glicerina-velocita-limite': () => import('@/components/content/interactive/fisica/SferetteViscose'),
	// Physics, third year: gas laws (group 39).
	'boyle-pistone-pesetti': () => import('@/components/content/interactive/fisica/BoylePistonePesetti'),
	'termometro-gas-zero-assoluto': () => import('@/components/content/interactive/fisica/TermometroGasZeroAssoluto'),
	'gas-perfetto-piano-pv': () => import('@/components/content/interactive/fisica/GasPerfettoPianoPV'),
	// Physics, third year: kinetic theory and internal energy (group 40).
	'gas-scatola-urti-pressione': () => import('@/components/content/interactive/fisica/GasScatolaPressione'),
	'maxwell-velocita-temperatura': () => import('@/components/content/interactive/fisica/MaxwellVelocita'),
	'compressione-lenta-e-brusca': () => import('@/components/content/interactive/fisica/CompressioneLentaBrusca'),
	'espansione-libera-gas': () => import('@/components/content/interactive/fisica/EspansioneLibera'),
	// Physics, third year: work, first law, transformations (group 41).
	'pistone-lavoro-cammini': () => import('@/components/content/interactive/fisica/PistoneLavoroCammini'),
	'primo-principio-bilancio': () => import('@/components/content/interactive/fisica/PrimoPrincipioBilancio'),
	'trasformazioni-gas-bilancio': () => import('@/components/content/interactive/fisica/TrasformazioniGasBilancio'),
	// Physics, third year: molar heats and adiabatic (group 42).
	'calori-molari-due-cilindri': () => import('@/components/content/interactive/fisica/CaloriMolariCilindri'),
	'adiabatica-isoterma-pistone': () => import('@/components/content/interactive/fisica/AdiabaticaIsoterma'),
	// Physics, third year: heat engines and Carnot (group 43).
	'macchina-termica-flussi': () => import('@/components/content/interactive/fisica/MacchinaTermicaFlussi'),
	'equivalenza-kelvin-clausius': () => import('@/components/content/interactive/fisica/EquivalenzaEnunciati'),
	'ciclo-carnot-temperature': () => import('@/components/content/interactive/fisica/CicloCarnot'),
	// Physics, third year: refrigerators and entropy (group 44).
	'frigorifero-cop-temperature': () => import('@/components/content/interactive/fisica/FrigoriferoCop'),
	'entropia-universo-due-sorgenti': () => import('@/components/content/interactive/fisica/EntropiaDueSorgenti'),
	'molecole-due-meta-microstati': () => import('@/components/content/interactive/fisica/MolecoleDueMeta'),
	// Chemistry, first two years: measurements (group 21).
	'lettura-menisco': () => import('@/components/content/interactive/chimica/LetturaMenisco'),
	// Chemistry, first two years: matter 1 (group 22).
	'particelle-stati-temperatura': () => import('@/components/content/interactive/chimica/ParticelleStatiTemperatura'),
	'miscuglio-ingrandisci': () => import('@/components/content/interactive/chimica/MiscuglioIngrandisci'),
	'soluzione-aggiungi-soluto': () => import('@/components/content/interactive/chimica/SoluzioneAggiungiSoluto'),
	// Chemistry, first two years: matter 2 (group 23).
	'distillazione-temperatura-colonna': () => import('@/components/content/interactive/chimica/DistillazioneColonna'),
	'cromatografia-carta-macchie': () => import('@/components/content/interactive/chimica/CromatografiaCarta'),
	'fusione-sostanza-pura-miscuglio': () => import('@/components/content/interactive/chimica/FusionePuraMiscuglio'),
	// Chemistry, first two years: chemical changes 1 (group 24).
	'lavoisier-bilancia-aperto-chiuso': () => import('@/components/content/interactive/chimica/LavoisierBilancia'),
	'proust-rapporto-combinazione': () => import('@/components/content/interactive/chimica/ProustRapporto'),
	// Chemistry, first two years: chemical changes 2 (group 25).
	'proporzioni-multiple-ossidi': () => import('@/components/content/interactive/chimica/ProporzioniMultiple'),
	'costruisci-formula-atomi': () => import('@/components/content/interactive/chimica/CostruisciFormula'),
	// Chemistry, first two years: gases (group 26).
	'gas-effusione-foro': () => import('@/components/content/interactive/chimica/GasEffusione'),
	'gas-cilindro-boyle': () => import('@/components/content/interactive/chimica/GasCilindroBoyle'),
	'gas-cilindro-charles': () => import('@/components/content/interactive/chimica/GasCilindroCharles'),
	'gas-cilindro-avogadro': () => import('@/components/content/interactive/chimica/GasCilindroAvogadro'),
	// Chemistry, first two years: the mole (group 27).
	'composizione-formula-minima': () => import('@/components/content/interactive/chimica/ComposizioneFormulaMinima'),
	'miscela-gas-dalton': () => import('@/components/content/interactive/chimica/MiscelaGasDalton'),
	// Chemistry, first two years: the atom (group 28).
	'rutherford-lamina-oro': () => import('@/components/content/interactive/chimica/RutherfordLamina'),
	'costruisci-atomo': () => import('@/components/content/interactive/chimica/CostruisciAtomo'),
	// Chemistry, first two years: water (group 29).
	'acqua-legami-idrogeno-temperatura': () => import('@/components/content/interactive/chimica/LegamiIdrogenoTemperatura'),
	'acqua-sale-si-scioglie': () => import('@/components/content/interactive/chimica/SaleSiScioglie'),
	'acqua-scala-ph-indicatori': () => import('@/components/content/interactive/chimica/ScalaPhIndicatori'),
	// Chemistry, third year: orbitals and quantum numbers (the orbital figure with the parameters of each paragraph).
	'orbitale-1s-mappa-probabilita': () => import('@/components/content/interactive/chimica/orbitali').then((m) => ({ default: m.Mappa1s })),
	'orbitali-s-nodi-radiali': () => import('@/components/content/interactive/chimica/orbitali').then((m) => ({ default: m.NodiRadiali })),
	'orbitale-2p-nodo-angolare': () => import('@/components/content/interactive/chimica/orbitali').then((m) => ({ default: m.NodoAngolare })),
	'orbitali-2p-tre-direzioni': () => import('@/components/content/interactive/chimica/orbitali').then((m) => ({ default: m.TreOrbitaliP })),
	'orbitali-3d-cinque-forme': () => import('@/components/content/interactive/chimica/orbitali').then((m) => ({ default: m.CinqueOrbitaliD })),
	'orbitali-livelli-stessa-scala': () => import('@/components/content/interactive/chimica/orbitali').then((m) => ({ default: m.LivelliStessaScala })),
	'orbitali-2p-in-moto': () => import('@/components/content/interactive/chimica/orbitali').then((m) => ({ default: m.OrbitaliInMoto })),
	'orbitali-esplora': () => import('@/components/orbitali/OrbitalViewer'),
	// Chemistry, third year: light, Bohr, levels, wave-particle (group A).
	'luce-lunghezza-onda-fotone': () => import('@/components/content/interactive/chimica/LuceLunghezzaOnda'),
	'luce-spettri-righe-elementi': () => import('@/components/content/interactive/chimica/LuceSpettriRighe'),
	'bohr-livelli-salto-riga': () => import('@/components/content/interactive/chimica/BohrLivelliSalto'),
	'livelli-ionizzazioni-successive': () => import('@/components/content/interactive/chimica/LivelliIonizzazioni'),
	'livelli-sottolivelli-idrogeno-altri': () => import('@/components/content/interactive/chimica/LivelliSottolivelliOrdine'),
	'onda-particella-de-broglie': () => import('@/components/content/interactive/chimica/OndaDeBroglie'),
	'onda-particella-indeterminazione': () => import('@/components/content/interactive/chimica/OndaIndeterminazione'),
	// Chemistry, third year: configuration, groups and blocks, Lewis symbols (group B).
	'configurazione-caselle-riempi': () => import('@/components/content/interactive/chimica/ConfigurazioneCaselle'),
	'gruppi-periodi-elettrone-casella': () => import('@/components/content/interactive/chimica/GruppiPeriodiCasella'),
	'lewis-simboli-gruppo': () => import('@/components/content/interactive/chimica/LewisSimboliGruppo'),
	// Chemistry, third year: nucleus and radioactivity (group C).
	'radioattivita-carta-nuclidi': () => import('@/components/content/interactive/chimica/RadioattivitaCartaNuclidi'),
	'dimezzamento-campione-nuclei': () => import('@/components/content/interactive/chimica/DimezzamentoCampioneNuclei'),
	'fissione-fusione-curva-energia': () => import('@/components/content/interactive/chimica/FissioneFusioneCurva'),
	// Chemistry, third year: periodic properties (group D).
	'raggio-ionizzazione-andamenti': () => import('@/components/content/interactive/chimica/RaggioIonizzazioneAndamenti'),
	'raggio-atomo-ione-confronto': () => import('@/components/content/interactive/chimica/RaggioAtomoIone'),
	'elettronegativita-andamenti': () => import('@/components/content/interactive/chimica/ElettronegativitaAndamenti'),
	'metalli-tavola-classi': () => import('@/components/content/interactive/chimica/MetalliTavolaClassi'),
	// Chemistry, third year: bonds 1 (group E).
	'energia-legame-curva-distanza': () => import('@/components/content/interactive/chimica/EnergiaLegameCurva'),
	'ottetto-elettroni-gas-nobile': () => import('@/components/content/interactive/chimica/OttettoElettroni'),
	'legame-covalente-condividi-coppie': () => import('@/components/content/interactive/chimica/LegameCovalenteCondividi'),
	'legame-polare-delta-chi-nube': () => import('@/components/content/interactive/chimica/LegamePolareDeltaChi'),
	// Chemistry, third year: bonds 2 (group F).
	'ionico-formula-ioni-neutro': () => import('@/components/content/interactive/chimica/IonicoFormulaIoni'),
	'ionico-energia-reticolare-ioni': () => import('@/components/content/interactive/chimica/IonicoEnergiaReticolare'),
	'metallico-mare-elettroni-pila': () => import('@/components/content/interactive/chimica/MetallicoMareElettroni'),
	'metallico-colpo-martello-ionico': () => import('@/components/content/interactive/chimica/MetallicoColpoMartello'),
	'formule-lewis-costruisci': () => import('@/components/content/interactive/chimica/FormuleLewisCostruisci'),
	// Chemistry, third year: polarity, valence bond, hybridisation (group G).
	'polarita-somma-dipoli': () => import('@/components/content/interactive/chimica/PolaritaSommaDipoli'),
	'polarita-sostituisci-atomi': () => import('@/components/content/interactive/chimica/PolaritaSostituisciAtomi'),
	'legame-valenza-sovrapposizione': () => import('@/components/content/interactive/chimica/LegameValenzaSovrapposizione'),
	'legame-valenza-ordine-rotazione': () => import('@/components/content/interactive/chimica/LegameValenzaOrdineRotazione'),
	'ibridazione-forma-ibrido': () => import('@/components/content/interactive/chimica/IbridazioneFormaIbrido'),
	'ibridazione-mescola-orbitali': () => import('@/components/content/interactive/chimica/IbridazioneMescolaOrbitali'),
	// Chemistry, third year: intermolecular forces and condensed states (group H).
	'forze-ebollizione-scegli-molecola': () => import('@/components/content/interactive/chimica/ForzeEbollizioneMolecola'),
	'legame-idrogeno-chi-con-chi': () => import('@/components/content/interactive/chimica/LegameIdrogenoCoppie'),
	'liquido-tensione-vapore-ebollizione': () => import('@/components/content/interactive/chimica/LiquidoTensioneVapore'),
	'solidi-tipo-particelle-conduce': () => import('@/components/content/interactive/chimica/SolidiTipoConduce'),
	// Chemistry, third year: nomenclature 1 (group I).
	'ossidazione-calcola-atomo-per-atomo': () => import('@/components/content/interactive/chimica/NumeroOssidazioneCalcola'),
	'ossidi-costruisci-formula-nomi': () => import('@/components/content/interactive/chimica/OssidiCostruisci'),
	'idruri-idracidi-scegli-elemento': () => import('@/components/content/interactive/chimica/IdruriIdracidiScegli'),
	'idrossidi-costruisci-formula-nomi': () => import('@/components/content/interactive/chimica/IdrossidiCostruisci'),
	// Chemistry, third year: nomenclature 2 (group J).
	'ossiacidi-anidride-piu-acqua': () => import('@/components/content/interactive/chimica/OssiacidiAnidrideAcqua'),
	'sali-binari-bilancia-cariche': () => import('@/components/content/interactive/chimica/SaliBinariBilanciaCariche'),
	'sali-ternari-acido-metallo': () => import('@/components/content/interactive/chimica/SaliTernariAcidoMetallo'),
	// Artificial intelligence (university): the perceptron and the first networks.
	'percettrone-separa-a-mano': () => import('@/components/content/interactive/ia/Percettrone').then((m) => ({ default: m.SeparaAMano })),
	'percettrone-regola-apprendimento': () => import('@/components/content/interactive/ia/Percettrone').then((m) => ({ default: m.Apprendimento })),
	'rete-xor-strato-nascosto': () => import('@/components/content/interactive/ia/ReteXor'),
	// Computer science, third year.
	'inf-ricerca-sequenziale-passi': () => import('@/components/content/interactive/informatica/RicercaSequenzialePassi'),
	'inf-selection-sort-passi': () => import('@/components/content/interactive/informatica/SelectionSortPassi'),
	'inf-ricerca-binaria-passi': () => import('@/components/content/interactive/informatica/RicercaBinariaPassi'),
	'inf-bubble-sort-passi': () => import('@/components/content/interactive/informatica/BubbleSortPassi'),
	'inf-insertion-sort-passi': () => import('@/components/content/interactive/informatica/InsertionSortPassi'),
	'inf-scambia-valore-riferimento': () => import('@/components/content/interactive/informatica/ScambiaValoreRiferimento'),
	'inf-pixel-risoluzione-profondita': () => import('@/components/content/interactive/informatica/PixelRisoluzioneProfondita'),
	'inf-css-modello-scatola': () => import('@/components/content/interactive/informatica/ModelloScatola'),
	'inf-kit-campionario': () => import('@/components/content/interactive/informatica/Campionario'),
	// Computer science, third year: CSS rules and the box model (group 12).
	'inf-css-selettori': () => import('@/components/content/interactive/informatica/SelettoriCss'),
	'inf-css-cascata': () => import('@/components/content/interactive/informatica/CascataCss'),
	'inf-css-scatola-strati': () => import('@/components/content/interactive/informatica/ScatolaStrati'),
	'inf-css-box-sizing-confronto': () => import('@/components/content/interactive/informatica/ConfrontoBoxSizing'),
	// Computer science, third year: functions (group 01).
	'inf-definire-funzione-passi': () => import('@/components/content/interactive/informatica/DefinireFunzionePassi'),
	'inf-parametri-ritorno-passi': () => import('@/components/content/interactive/informatica/ParametriRitornoPassi'),
	// Computer science, third year: scope and parameters (group 02).
	'inf-visibilita-pila': () => import('@/components/content/interactive/informatica/VisibilitaPila'),
	'inf-passaggio-parametri-pila': () => import('@/components/content/interactive/informatica/PassaggioParametriPila'),
	'inf-top-down-albero': () => import('@/components/content/interactive/informatica/TopDownAlbero'),
	// Computer science, third year: arrays (group 03).
	'inf-vettore-indice-elemento': () => import('@/components/content/interactive/informatica/VettoreIndiceElemento'),
	'inf-vettore-scorri-passi': () => import('@/components/content/interactive/informatica/VettoreScorriPassi'),
	'inf-ricerca-sequenziale-posizione': () => import('@/components/content/interactive/informatica/RicercaSequenzialePosizione'),
	'inf-ricerca-sequenziale-casi': () => import('@/components/content/interactive/informatica/RicercaSequenzialeCasi'),
	// Computer science, third year: sorting and counting operations (group 06).
	'inf-bubble-sort-giri': () => import('@/components/content/interactive/informatica/BubbleSortGiri'),
	'inf-insertion-sort-carte': () => import('@/components/content/interactive/informatica/InsertionSortCarte'),
	'inf-gara-ordinamenti': () => import('@/components/content/interactive/informatica/GaraOrdinamenti'),
	'inf-gara-ricerche': () => import('@/components/content/interactive/informatica/GaraRicerche'),
	// Computer science, third year: binary search and selection sort (group 05).
	'inf-ricerca-binaria-armadietti': () => import('@/components/content/interactive/informatica/RicercaBinariaArmadietti'),
	'inf-ricerca-binaria-sequenziale': () => import('@/components/content/interactive/informatica/RicercaBinariaSequenziale'),
	'inf-selection-sort-imin': () => import('@/components/content/interactive/informatica/SelectionSortImin'),
	// Computer science, third year: matrices and strings (group 04).
	'inf-matrice-indici': () => import('@/components/content/interactive/informatica/MatriceIndici'),
	'inf-matrice-somme': () => import('@/components/content/interactive/informatica/MatriceSomme'),
	'inf-stringa-vocali': () => import('@/components/content/interactive/informatica/StringaVocali'),
	'inf-stringa-palindroma': () => import('@/components/content/interactive/informatica/StringaPalindroma'),
	// Computer science, third year: media formats and compression (group 08).
	'inf-scegli-formato': () => import('@/components/content/interactive/informatica/ScegliFormato'),
	'inf-bitmap-vettoriale-zoom': () => import('@/components/content/interactive/informatica/BitmapVettorialeZoom'),
	'inf-rle-riga': () => import('@/components/content/interactive/informatica/RleRiga'),
	'inf-compressione-perdita': () => import('@/components/content/interactive/informatica/CompressionePerdita'),
	// Computer science, third year: audio, video, fonts and markup (group 09).
	'inf-audio-video-dimensione': () => import('@/components/content/interactive/informatica/AudioVideoDimensione'),
	'inf-video-fotogrammi-differenza': () => import('@/components/content/interactive/informatica/VideoFotogrammiDifferenza'),
	'inf-font-bitmap-contorno': () => import('@/components/content/interactive/informatica/FontBitmapContorno'),
	'inf-markup-testo-albero-pagina': () => import('@/components/content/interactive/informatica/MarkupTestoAlberoPagina'),
	// Computer science, third year: lists, tables and forms (group 11).
	'inf-html-celle-unite': () => import('@/components/content/interactive/informatica/CelleUnite'),
	'inf-html-modulo-inviato': () => import('@/components/content/interactive/informatica/ModuloInviato'),
	// Computer science, third year: layout and responsive pages (group 13).
	'inf-css-flexbox': () => import('@/components/content/interactive/informatica/Flexbox'),
	'inf-media-query-larghezza': () => import('@/components/content/interactive/informatica/MediaQueryLarghezza'),
	'inf-contrasto-colori': () => import('@/components/content/interactive/informatica/ContrastoColori'),
	// Computer science, third year: files (group 07).
	'inf-file-lettura-righe': () => import('@/components/content/interactive/informatica/LetturaRighe'),
	'inf-csv-campi': () => import('@/components/content/interactive/informatica/CsvCampi'),
	'inf-albero-xml-json': () => import('@/components/content/interactive/informatica/AlberoXmlJson'),
	// Computer science, third year: HTML structure and text (group 10).
	'inf-html-albero-documento': () => import('@/components/content/interactive/informatica/AlberoDocumento'),
	'inf-html-percorsi-sito': () => import('@/components/content/interactive/informatica/PercorsiSito'),
	// Computer science, third year: scripts, DOM and form checks (group 14).
	'inf-script-ordine-lettura': () => import('@/components/content/interactive/informatica/ScriptOrdineLettura'),
	'inf-js-costrutti-confronto': () => import('@/components/content/interactive/informatica/CostruttiConfronto'),
	'inf-dom-albero-eventi': () => import('@/components/content/interactive/informatica/DomAlberoEventi'),
	'inf-modulo-percorso-dato': () => import('@/components/content/interactive/informatica/ModuloPercorsoDato'),
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
