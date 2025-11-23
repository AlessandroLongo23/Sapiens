import { 
	Atom, 
	Backpack, 
	Beaker, 
	Blend, 
	Calculator, 
	CaseLower,
	CodeXml, 
	Cone,
	Dices,
	Equal,
	Hash,
	Infinity,
	TriangleRight,
	Move3D,
	School, 
	SquareFunction,
	Pi, 
	University,
} from "lucide-svelte";

export enum EducationalLevel {
	MIDDLE_SCHOOL = 'middle_school',
	HIGH_SCHOOL = 'high_school',
	UNIVERSITY = 'university',
}

export const EducationalLevelMap = {
	[EducationalLevel.MIDDLE_SCHOOL]: 'Scuola media',
	[EducationalLevel.HIGH_SCHOOL]: 'Scuola superiore',
	[EducationalLevel.UNIVERSITY]: 'Università'
}

export interface LevelNode {
	id: EducationalLevel;
	name: string;
	icon: typeof Pi;
	subjects: SubjectNode[];
}

export interface SubjectNode {
	id: string;
	name: string;
	icon: typeof Pi;
	chapters: ChapterNode[];
}

export interface ChapterNode {
	id: string;
	name: string;
	icon: typeof Pi;
	topics: TopicNode[];
}

export interface TopicNode {
	id: string;
	name: string;
	// prerequisites: SubjectNode[];
}

export const contentTree: LevelNode[] = [
	{	
		id: EducationalLevel.MIDDLE_SCHOOL,
		name: EducationalLevelMap[EducationalLevel.MIDDLE_SCHOOL],
		icon: Backpack,
		subjects: [
			{
				id: 'math',
				name: "Matematica",
				icon: Calculator,
				chapters: [
					{ 
						id: 'aritmetica', 
						name: 'Aritmetica',
						icon: Calculator,
						topics: [
							{ id: 'numerazione-decimale', name: 'Sistema di numerazione decimale' },
							{ id: 'quattro-operazioni', name: 'Le quattro operazioni' },
							{ id: 'proprieta-operazioni', name: 'Proprietà delle operazioni' },
							{ id: 'espressioni-aritmetiche', name: 'Espressioni aritmetiche' },
							{ id: 'potenze-radice', name: 'Potenze e radice quadrata' }
						]
					},
					{ 
						id: 'frazioni', 
						name: 'Frazioni e decimali',
						icon: Calculator,
						topics: [
							{ id: 'frazioni-proprie', name: 'Frazioni proprie, improprie e apparenti' },
							{ id: 'frazioni-equivalenti', name: 'Frazioni equivalenti' },
							{ id: 'operazioni-frazioni', name: 'Operazioni con le frazioni' },
							{ id: 'numeri-decimali', name: 'Numeri decimali e frazioni' }
						]
					},
					{ 
						id: 'percentuali', 
						name: 'Percentuali', 
						icon: Calculator, 
						topics: [
							{ id: 'calcolo-percentuali', name: 'Calcolo delle percentuali' },
							{ id: 'percentuali-problemi', name: 'Problemi con le percentuali' }
						] 
					},
					{ 
						id: 'geometria-piana', 
						name: 'Geometria piana', 
						icon: Calculator, 
						topics: [
							{ id: 'enti-fondamentali', name: 'Elementi fondamentali (punto, retta, piano)' },
							{ id: 'angoli', name: 'Angoli (tipi e proprietà)' },
							{ id: 'triangoli', name: 'Triangoli (classificazione e proprietà)' },
							{ id: 'quadrilateri', name: 'Quadrilateri (proprietà)' },
							{ id: 'cerchio', name: 'Cerchio e sue parti' }
						] 
					},
					{ 
						id: 'aree-perimetri', 
						name: 'Aree e perimetri', 
						icon: Calculator, 
						topics: [
							{ id: 'perimetro-poligoni', name: 'Perimetro dei poligoni' },
							{ id: 'area-poligoni', name: 'Area dei poligoni' },
							{ id: 'circonferenza-cerchio', name: 'Circonferenza e area del cerchio' }
						] 
					},
					{ 
						id: 'proporzioni', 
						name: 'Proporzioni', 
						icon: Calculator, 
						topics: [
							{ id: 'rapporto-proporzione', name: 'Rapporto e proporzione' },
							{ id: 'problemi-proporzioni', name: 'Problemi con proporzioni' }
						] 
					},
					{ 
						id: 'equazioni-primo', 
						name: 'Equazioni di primo grado', 
						icon: Calculator, 
						topics: [
							{ id: 'equazioni-di-primo-grado', name: 'Equazioni di primo grado' },
							{ id: 'problemi-equazioni', name: 'Problemi risolvibili con equazioni' }
						] 
					},
					{ 
						id: 'geometria-solida', 
						name: 'Geometria solida', 
						icon: Calculator, 
						topics: [
							{ id: 'solid-solidi', name: 'Solidi geometrici fondamentali' },
							{ id: 'superficie-volume', name: 'Superficie e volume dei solidi' }
						] 
					},
					{ 
						id: 'statistica', 
						name: 'Statistica', 
						icon: Calculator, 
						topics: [
							{ id: 'media-moda-mediana', name: 'Media, moda e mediana' },
							{ id: 'rappresentazione-dati', name: 'Rappresentazione dei dati (grafici)' }
						] 
					},
				]
			},
			{
				id: 'physics',
				name: 'Fisica',
				icon: Atom,
				chapters: [
					{ id: 'movimento', name: 'Movimento e velocità', icon: Atom, topics: [
						{ id: 'velocita-media', name: 'Velocità media (rapporto spazio/tempo)' },
						{ id: 'moto-uniforme', name: 'Moto rettilineo uniforme' }
					] },
					{ id: 'forze', name: 'Forze e movimento', icon: Atom, topics: [
						{ id: 'leggi-dinamica', name: 'Leggi della dinamica di Newton' },
						{ id: 'forza-elastica-frott', name: 'Forza elastica e forza di attrito' }
					] },
					{ id: 'energia', name: 'Energia', icon: Atom, topics: [
						{ id: 'energia-cinetica-potenziale', name: 'Energia cinetica e potenziale' },
						{ id: 'conservazione-energia', name: 'Legge di conservazione dell\'energia' }
					] },
					{ id: 'calore-temperatura', name: 'Calore e temperatura', icon: Atom, topics: [
						{ id: 'temperatura-calore', name: 'Differenza tra temperatura e calore' },
						{ id: 'cambi-di-stato', name: 'Passaggi di stato' }
					] },
					{ id: 'onde', name: 'Onde e suono', icon: Atom, topics: [
						{ id: 'caratteristiche-onde', name: 'Caratteristiche delle onde' },
						{ id: 'suono-propagazione', name: 'Suono: frequenza e propagazione' }
					] },
					{ id: 'luce', name: 'Luce e ottica', icon: Atom, topics: [
						{ id: 'riflessione-rifrazione', name: 'Riflessione e rifrazione della luce' },
						{ id: 'lenti-specchi', name: 'Lenti e specchi' }
					] },
					{ id: 'elettricita', name: 'Elettricità', icon: Atom, topics: [
						{ id: 'carica-corrente', name: 'Carica elettrica e corrente' },
						{ id: 'legge-ohm', name: 'Legge di Ohm e circuiti semplici' }
					] },
					{ id: 'magnetismo', name: 'Magnetismo', icon: Atom, topics: [
						{ id: 'magneti', name: 'Magneti e campo magnetico' },
						{ id: 'elettromagnetismo-base', name: 'Campi magnetici e leggi di base' }
					] },
					{ id: 'energie-rinnovabili', name: 'Energie rinnovabili', icon: Atom, topics: [
						{ id: 'tipi-energie', name: 'Fonti di energia rinnovabile' },
						{ id: 'energia-ambiente', name: 'Impatto ambientale delle energie rinnovabili' }
					] },
				]
			},
			{
				id: 'chemistry',
				name: 'Chimica',
				icon: Beaker,
				chapters: [
					{ 
						id: 'materia-stati', 
						name: 'Materia e stati di aggregazione', 
						icon: Beaker, 
						topics: [
							{ id: 'stati-aggregazione', name: 'Stati di aggregazione della materia' },
							{ id: 'proprieta-materia', name: 'Proprietà della materia (massa, volume)' }
						] 
					},
					{ id: 'elementi-composti', name: 'Elementi e composti', icon: Beaker, topics: [
						{ id: 'elementi-atomici', name: 'Elementi, atomi e molecole' },
						{ id: 'proprieta-elementi', name: 'Proprietà degli elementi chimici' }
					] },
					{ id: 'reazioni', name: 'Reazioni chimiche', icon: Beaker, topics: [
						{ id: 'equazioni-chimiche', name: 'Equazioni chimiche' },
						{ id: 'tipi-reattivi', name: 'Tipi di reazioni chimiche (esotermiche, endotermiche)' }
					] },
					{ id: 'acidi-basi', name: 'Acidi e basi', icon: Beaker, topics: [
						{ id: 'ph', name: 'pH e indicatori acido-base' },
						{ id: 'esempi-acidi-basi', name: 'Esempi di acidi e basi comuni' }
					] },
					{ id: 'soluzioni', name: 'Soluzioni', icon: Beaker, topics: [
						{ id: 'solute-solvente', name: 'Soluzioni: soluto, solvente e solubilità' },
						{ id: 'concentrazione', name: 'Concentrazione e percentuale di soluti' }
					] },
					{ id: 'chimica-ambiente', name: 'Chimica e ambiente', icon: Beaker, topics: [
						{ id: 'inquinamento-cicli', name: 'Inquinamento e cicli biogeochimici' },
						{ id: 'risorse-chimiche', name: 'Risorse chimiche e sostenibilità' }
					] },
					{ id: 'tavola-periodica', name: 'Tavola periodica', icon: Beaker, topics: [
						{ id: 'organizzazione-tavola', name: 'Organizzazione della tavola periodica' },
						{ id: 'proprieta-periodiche', name: 'Proprietà periodiche degli elementi' }
					] },
				]
			}
		]
	},
	{
		id: EducationalLevel.HIGH_SCHOOL,
		name: EducationalLevelMap[EducationalLevel.HIGH_SCHOOL],
		icon: School,
		subjects: [
			{
				id: 'math',
				name: 'Matematica',
				icon: Pi,
				chapters: [
					{
						id: 'insiemi-e-logica',
						name: 'Insiemi e logica',
						icon: Blend,
						topics: [
							{ id: 'prime-definizioni', name: 'Prime definizioni' },
							{ id: 'insiemi-rappresentazione', name: 'Rappresentazione degli insiemi' },
							{ id: 'insiemi-operazioni', name: 'Operazioni e relazioni tra insiemi' },
							{ id: 'sottoinsiemi-ugualianza', name: 'Sottoinsiemi e uguaglianza' },
							{ id: 'insiemi-unione', name: 'Unione insiemistica' },
							{ id: 'insiemi-intersezione', name: 'Intersezione insiemistica' },
							{ id: 'insiemi-differenza', name: 'Differenza insiemistica' },
							{ id: 'insiemi-complementare', name: 'Complementare insiemistica' },
							{ id: 'insiemi-prodotto-cartesiano', name: 'Prodotto cartesiano' },
						]
					},
					{
						id: 'numeri-naturali',
						name: 'Numeri naturali \\mathbb{N}',
						icon: Hash,
						topics: [
							{ id: 'numeri-naturali-operazioni', name: 'Operazioni in \\mathbb{N}' },
							{ id: 'numeri-naturali-mcm-mcd', name: 'MCD e MCM in \\mathbb{N}' },
							{ id: 'numeri-naturali-potenze', name: 'Potenze in \\mathbb{N}' },
						]
					},
					{
						id: 'numeri-interi',
						name: 'Numeri interi \\mathbb{Z}',
						icon: Hash,
						topics: [
							{ id: 'numeri-interi-operazioni', name: 'Operazioni in \\mathbb{Z}' },
							{ id: 'numeri-interi-potenze', name: 'Potenze in \\mathbb{Z}' },
						]
					},
					{
						id: 'numeri-razionali',
						name: 'Numeri razionali \\mathbb{Q}',
						icon: Hash,
						topics: [
							{ id: 'numeri-razionali-operazioni', name: 'Operazioni in \\mathbb{Q}' },
							{ id: 'numeri-razionali-potenze', name: 'Potenze in \\mathbb{Q}' },
							{ id: 'numeri-razionali-confronto-frazioni', name: 'Confronto tra frazioni' },
							{ id: 'numeri-razionali-espressioni', name: 'Espressioni con frazioni' },
							{ id: 'numeri-razionali-conversione', name: 'Conversione da numeri decimali a frazioni' },
						]
					},
					{
						id: 'numeri-reali',
						name: 'Numeri reali \\mathbb{R}',
						icon: Hash,
						topics: [
							{ id: 'numeri-reali-radici', name: 'Operazione di radice' },
							{ id: 'numeri-reali-espressioni', name: 'Espressioni con reali' },
						]
					},
					{
						id: 'monomi-polinomi',
						name: 'Monomi e polinomi',
						icon: CaseLower,
						topics: [
							{ id: 'monomi', name: 'Monomi' },
							{ id: 'monomi-grado', name: 'Grado di un monomio' },
							{ id: 'monomi-operazioni', name: 'Operazioni tra monomi' },
							{ id: 'monomi-potenza', name: 'Potenza di un monomio' },
							{ id: 'monomi-mcm-mcd', name: 'MCD e MCM tra monomi' },
							{ id: 'monomi-espressioni', name: 'Espressioni con monomi' },
							{ id: 'polinomi', name: 'Polinomi' },
							{ id: 'polinomi-grado', name: 'Grado di un polinomio' },
							{ id: 'polinomi-operazioni', name: 'Operazioni tra polinomi' },
							{ id: 'polinomi-espressioni', name: 'Espressioni con polinomi' },
						],
					},
					{ 
						id: 'equazioni-sistemi', 
						name: 'Equazioni e sistemi', 
						icon: Equal,
						topics: [
							{ id: 'equazioni-primo-grado', name: 'Equazioni di primo grado' },
							{ id: 'equazioni-secondo-grado', name: 'Equazioni di secondo grado' },
							{ id: 'sistemi-di-equazioni', name: 'Sistemi di equazioni' },
							{ id: 'disequazioni-primo-grado', name: 'Disequazioni di primo grado' },
							{ id: 'disequazioni-secondo-grado', name: 'Disequazioni di secondo grado' },
							{ id: 'disequazioni-razionali', name: 'Disequazioni razionali' },
							{ id: 'sistemi-di-disequazioni', name: 'Sistemi di disequazioni' },
						]
					},
					{ 
						id: 'geometria-analitica', 
						name: 'Geometria analitica', 
						icon: Move3D,
						topics: [
							{ id: 'il-piano-cartesiano', name: 'Il piano cartesiano' },
							{ id: 'la-distanza-tra-due-punti', name: 'La distanza tra due punti' },
							{ id: 'rette-passanti-per-origine-assi', name: 'Retta passante per l\'origine degli assi' },
							{ id: 'equazioni-degli-assi', name: 'Equazioni degli assi' },
							{ id: 'rette-parallele-asse-x', name: 'Retta parallela all\'asse x' },
							{ id: 'rette-parallele-asse-y', name: 'Retta parallela all\'asse y' },
							{ id: 'equazione-di-una-retta', name: 'Equazione di una retta' },
							{ id: 'il-coefficiente-angolare', name: 'Il coefficiente angolare' },
							{ id: 'rette-parallele-tra-loro', name: 'Rette parallele tra loro' },
							{ id: 'rette-perpendicolari-tra-loro', name: 'Rette perpendicolari tra loro' },
							{ id: 'punto-medio-segmento', name: 'Il punto medio di un segmento' },
							{ id: 'intersezione-tra-due-rette', name: 'Intersezione tra due rette' },
							{ id: 'retta-passante-per-un-punto', name: 'Retta passante per un punto' },
							{ id: 'retta-passante-per-due-punti', name: 'Retta passante per due punti' },
							{ id: 'distanza-punto-retta', name: 'Distanza di un punto da una retta' },
						] 
					},
					{ 
						id: 'trigonometria', 
						name: 'Trigonometria', 
						icon: TriangleRight,
						topics: [
							{ id: 'angoli-e-lati-dei-triangoli', name: 'Angoli e lati dei triangoli' },
							{ id: 'teoremi-sui-triangoli', name: 'Teoremi sui triangoli' },
							{ id: 'teorema-di-pitagora', name: 'Teorema di Pitagora' },
							{ id: 'teorema-di-euclide', name: 'Teorema di Euclide' },
							{ id: 'teorema-di-talete', name: 'Teorema di Talete' },
						]
					},
					{ 
						id: 'geometria-solida', 
						name: 'Geometria solida', 
						icon: Cone, 
						topics: [
							{ id: 'solidi-geometrici', name: 'Solidi geometrici' },
							{ id: 'superfici-e-volumi-dei-solidi-geometrici', name: 'Superfici e volumi dei solidi geometrici' }
						]
					},
					{ 
						id: 'funzioni',
						name: 'Funzioni',
						icon: SquareFunction,
						topics: [
							{ id: 'definizione-funzione', name: 'Definizione di funzione' },
							{ id: 'dominio-codominio-immagine', name: 'Dominio, codominio e immagine' },
							{ id: 'funzioni-iniettive-suriettive-biettive', name: 'Funzioni iniettive, suriettive e biettive' },
							{ id: 'funzioni-reali-di-variabile-reale', name: 'Funzioni reali di variabile reale' },
							{ id: 'composizione-di-funzioni', name: 'Composizione di funzioni' },
							{ id: 'funzioni-invertibili', name: 'Funzioni invertibili' },
							{ id: 'funzioni-periodiche', name: 'Funzioni periodiche' },
							{ id: 'funzioni-dispari-pari', name: 'Funzioni dispari e pari' },
							{ id: 'funzioni-lineari', name: 'Funzioni lineari' },
							{ id: 'funzioni-quadratiche', name: 'Funzioni quadratiche' },
							{ id: 'funzioni-esponenziali', name: 'Funzioni esponenziali' },
							{ id: 'funzioni-logaritmiche', name: 'Funzioni logaritmiche' },
						]
					},
					{ 
						id: 'limiti', 
						name: 'Limiti', 
						icon: Infinity, 
						topics: [
							{ id: 'definizione-di-limite', name: 'Definizione di limite' },
							{ id: 'teoremi-sui-limiti', name: 'Teoremi sui limiti' },
							{ id: 'forme-indeterminate', name: 'Forme indeterminate' },
							{ id: 'limiti-notevoli', name: 'Limiti notevoli' },
						] 
					},
					{ 
						id: 'derivate', 
						name: 'Derivate', 
						icon: Infinity, 
						topics: [
							{ id: 'definizione-derivata', name: 'Definizione di derivata' },
							{ id: 'regole-derivazione', name: 'Regole di derivazione' },
							{ id: 'derivate-funzioni', name: 'Derivate di funzioni elementari' },
							{ id: 'applicazioni-derivate', name: 'Applicazioni delle derivate' }
						] 
					},
					{ 
						id: 'integrali', 
						name: 'Integrali', 
						icon: Infinity, 
						topics: [
							{ id: 'definizione-integrale', name: 'Definizione di integrale' },
							{ id: 'integrali-indefiniti', name: 'Integrali indefiniti' },
							{ id: 'integrali-definiti', name: 'Integrali definiti' },
							{ id: 'teorema-fondamentale', name: 'Teorema fondamentale del calcolo' }
						] 
					},
					{ 
						id: 'probabilita', 
						name: 'Probabilità', 
						icon: Dices, 
						topics: [
							{ id: 'concetti-probabilita', name: 'Concetti di probabilità (evento, probabilità)' },
							{ id: 'leggi-probabilita', name: 'Leggi della probabilità' }
						] 
					},
				]
			},
			{
				id: 'physics',
				name: 'Fisica',
				icon: Atom,
				chapters: [
					{ id: 'cinematica', name: 'Cinematica', icon: Atom, topics: [
						{ id: 'velocita', name: 'Velocità e accelerazione' },
						{ id: 'moto-uniforme-accelerato', name: 'Moto uniforme e uniformemente accelerato' }
					] },
					{ id: 'dinamica', name: 'Dinamica', icon: Atom, topics: [
						{ id: 'leggi-newton', name: 'Leggi di Newton' },
						{ id: 'forze', name: 'Forze (peso, attrito, tensione)' }
					] },
					{ id: 'lavoro-energia', name: 'Lavoro ed energia', icon: Atom, topics: [
						{ id: 'lavoro', name: 'Lavoro e potenza' },
						{ id: 'energia', name: 'Energia cinetica e potenziale' }
					] },
					{ id: 'termodinamica', name: 'Termodinamica', icon: Atom, topics: [
						{ id: 'calore', name: 'Calore, temperatura e leggi dei gas' },
						{ id: 'principi-termo', name: 'Primi due principi della termodinamica' }
					] },
					{ id: 'elettrostatica', name: 'Elettrostatica', icon: Atom, topics: [
						{ id: 'carica-campo', name: 'Carica elettrica e campo elettrico' },
						{ id: 'potenziale', name: 'Potenziale elettrico' }
					] },
					{ id: 'onde-meccaniche', name: 'Onde meccaniche', icon: Atom, topics: [
						{ id: 'propagazione-onde', name: 'Propagazione delle onde' },
						{ id: 'acustica', name: 'Acustica e suono' }
					] },
					{ id: 'elettromagnetismo', name: 'Elettromagnetismo', icon: Atom, topics: [
						{ id: 'campi-magnetici', name: 'Campi magnetici e legge di Ampère' },
						{ id: 'indu-faraday', name: 'Legge di Faraday e induzione elettromagnetica' }
					] },
					{ id: 'ottica', name: 'Ottica', icon: Atom, topics: [
						{ id: 'riflessione', name: 'Riflessione e rifrazione' },
						{ id: 'ottica-geometrica', name: 'Ottica geometrica' }
					] },
					{ id: 'meccanica-razionale', name: 'Meccanica razionale', icon: Atom, topics: [
						{ id: 'lagrangiana', name: 'Principio di Lagrange' }
					] },
					{ id: 'fisica-moderna', name: 'Fisica moderna', icon: Atom, topics: [
						{ id: 'modello-atomico', name: 'Modelli atomici' }
					] },
					{ id: 'relativita', name: 'Relatività', icon: Atom, topics: [
						{ id: 'relativita-ristretta', name: 'Relatività ristretta' }
					] },
					{ id: 'meccanica-quantistica', name: 'Meccanica quantistica', icon: Atom, topics: [
						{ id: 'quantizzazione-energia', name: 'Quantizzazione dell’energia' }
					] },
					{ id: 'fisica-nucleare', name: 'Fisica nucleare', icon: Atom, topics: [
						{ id: 'radioattivita', name: 'Radioattività (alfa, beta, gamma)' }
					] },
					{ id: 'astrofisica', name: 'Astrofisica', icon: Atom, topics: [
						{ id: 'evoluzione-stelle', name: 'Cicli di vita delle stelle' }
					] }
				]
			},
			{
				id: 'computer-science',
				name: 'Informatica',
				icon: CodeXml,
				chapters: [
					{ id: 'informatica', name: 'Informatica', icon: CodeXml, topics: [
						{ id: 'hardware-software', name: 'Hardware e software' },
						{ id: 'algoritmi', name: 'Algoritmi e pseudocodice' }
					] },
					{ id: 'sistemi-operativi', name: 'Sistemi operativi', icon: CodeXml, topics: [
						{ id: 'processi-thread', name: 'Processi e thread' },
						{ id: 'memoria-storage', name: 'Memoria e file system' }
					] },
					{ id: 'internet-web', name: 'Internet e web', icon: CodeXml, topics: [
						{ id: 'internet', name: 'Internet e reti' },
						{ id: 'http-html', name: 'HTTP e HTML di base' }
					] },
					{ id: 'sicurezza', name: 'Sicurezza informatica', icon: CodeXml, topics: [
						{ id: 'virus-malware', name: 'Virus e malware' },
						{ id: 'password-sicure', name: 'Password sicure e cifratura' }
					] },
					{ id: 'programmazione-visiva', name: 'Programmazione visuale', icon: CodeXml, topics: [
						{ id: 'scratch', name: 'Programmazione a blocchi (Scratch)' },
						{ id: 'diagrammi-flusso', name: 'Diagrammi di flusso' }
					] },
					{ id: 'office', name: 'Strumenti office', icon: CodeXml, topics: [
						{ id: 'word', name: 'Elaboratore testi (Word)' },
						{ id: 'excel', name: 'Foglio di calcolo (Excel)' },
						{ id: 'powerpoint', name: 'Presentazioni (PowerPoint)' }
					] },
					{ id: 'multimedia', name: 'Multimedia', icon: CodeXml, topics: [
						{ id: 'formati-multimediali', name: 'Formati immagine, audio e video' },
						{ id: 'editing-base', name: 'Nozioni di editing multimediale' }
					] },
					{ id: 'presentazioni', name: 'Presentazioni digitali', icon: CodeXml, topics: [
						{ id: 'creare-slide', name: 'Creazione di slide efficaci' },
						{ id: 'tools-present', name: 'Strumenti per presentazioni' }
					] },
					{ id: 'collaborazione-digitale', name: 'Collaborazione digitale', icon: CodeXml, topics: [
						{ id: 'cloud', name: 'Servizi cloud e condivisione' },
						{ id: 'collab-tools', name: 'Strumenti collaborativi online' }
					] }
				]
			},
			{
				id: 'chemistry',
				name: 'Chimica',
				icon: Beaker,
				chapters: [
					{ id: 'atomo-struttura', name: 'Struttura dell\'atomo', icon: Beaker, topics: [
						{ id: 'particelle-fondamentali', name: 'Protoni, neutroni ed elettroni' },
						{ id: 'numero-massa', name: 'Numero atomico e numero di massa' }
					] },
					{ id: 'tavola-periodica', name: 'Tavola periodica', icon: Beaker, topics: [
						{ id: 'gruppi-periodi', name: 'Gruppi e periodi' },
						{ id: 'proprieta-periodiche', name: 'Proprietà periodiche (raggio, energia di ionizzazione)' }
					] },
					{ id: 'legami-chimici', name: 'Legami chimici', icon: Beaker, topics: [
						{ id: 'legame-ionico', name: 'Legame ionico' },
						{ id: 'legame-covalente', name: 'Legame covalente' }
					] },
					{ id: 'stechiometria', name: 'Stechiometria', icon: Beaker, topics: [
						{ id: 'mole', name: 'Concetto di mole' },
						{ id: 'equazioni-bilanciate', name: 'Bilanciamento delle reazioni chimiche' }
					] },
					{ id: 'reazioni-redox', name: 'Reazioni redox', icon: Beaker, topics: [
						{ id: 'numero-ossidazione', name: 'Numero di ossidazione' },
						{ id: 'reazioni-redox', name: 'Esempi di ossidoriduzione' }
					] },
					{ id: 'chimica-organica', name: 'Chimica organica', icon: Beaker, topics: [
						{ id: 'idrocarburi', name: 'Idrocarburi (alcheni, alcani)' },
						{ id: 'gruppi-funzionali', name: 'Gruppi funzionali principali' }
					] },
					{ id: 'chimica-fisica', name: 'Chimica fisica', icon: Beaker, topics: [
						{ id: 'gas-ideali', name: 'Legge dei gas ideali' },
						{ id: 'cinetica-chimica', name: 'Nozioni di cinetica chimica' }
					] },
					{ id: 'equilibrio-chimico', name: 'Equilibrio chimico', icon: Beaker, topics: [
						{ id: 'costante-equilibrio', name: 'Costante di equilibrio chimico' }
					] },
					{ id: 'cinetica-chimica', name: 'Cinetica chimica', icon: Beaker, topics: [
						{ id: 'velocita-reattiva', name: 'Velocità di reazione' }
					] },
					{ id: 'elettrochimica', name: 'Elettrochimica', icon: Beaker, topics: [
						{ id: 'pile', name: 'Funzionamento di una pila' }
					] },
					{ id: 'chimica-analitica', name: 'Chimica analitica', icon: Beaker, topics: [
						{ id: 'titolazioni', name: 'Titolazioni acido-base' }
					] },
					{ id: 'biochimica', name: 'Biochimica', icon: Beaker, topics: [
						{ id: 'macromolecole-vita', name: 'Macromolecole del vivente (proteine, lipidi, carboidrati)' }
					] },
					{ id: 'chimica-ambientale', name: 'Chimica ambientale', icon: Beaker, topics: [
						{ id: 'inquinanti-ambientali', name: 'Inquinanti in aria, acqua e suolo' }
					] },
					{ id: 'chimica-industriale', name: 'Chimica industriale', icon: Beaker, topics: [
						{ id: 'processi-industriali', name: 'Processi chimici industriali (Haber, produzione amoniaca)' }
					] },
				]
			}
		]
	},
	{
		id: EducationalLevel.UNIVERSITY,
		name: EducationalLevelMap[EducationalLevel.UNIVERSITY],
		icon: University,
		subjects: [
			{
				id: 'analisi-1',
				name: 'Analisi matematica I',
				icon: Pi,
				chapters: [
					{ 
						id: 'successioni-serie', 
						name: 'Successioni e serie', 
						icon: Pi, 
						topics: 
						[
							{ id: 'successioni-definizione', name: 'Successioni di numeri reali' },
							{ id: 'serie-numeriche-definizione', name: 'Serie numeriche e convergenza' }
						]
					},
					{ 
						id: 'limiti', 
						name: 'Limiti', 
						icon: Pi, 
						topics: [
							{ id: 'limite-definizione', name: 'Definizione di limite di funzione' }
						]
					},
					{ 
						id: 'derivate', 
						name: 'Derivate', 
						icon: Pi, 
						topics: 
						[
							{ id: 'regole-derivazione-analisi', name: 'Regole e teoremi sulle derivate' }
						]
					},
					{ 
						id: 'integrali', 
						name: 'Integrali', 
						icon: Pi, 
						topics: [
							{ id: 'integrali-definizione-analisi', name: 'Integrali definiti e indefiniti' },
							{ id: 'teorema-fondamentale-analisi', name: 'Teorema fondamentale del calcolo' }
						] 
					},
					{ 
						id: 'equazioni-differenziali', 
						name: 'Equazioni differenziali', 
						icon: Pi, 
						topics: 
						[
							{ id: 'ode-ordine1', name: 'Equazioni differenziali di 1º ordine' },
							{ id: 'ode-ordine2', name: 'Equazioni differenziali di 2º ordine' }
						]
					}
				]
			},
			{
				id: 'analisi-2',
				name: 'Analisi matematica II',
				icon: Pi,
				chapters: [
					{ id: 'integralidoppi', name: 'Integrali doppi', icon: Pi, topics: [
						{ id: 'integrali-doppi', name: 'Integrali doppi in coordinate cartesiane e polari' }
					] },
					{ id: 'integrali-tripli', name: 'Integrali tripli', icon: Pi, topics: [
						{ id: 'integrali-tripli', name: 'Integrali tripli e cambio di coordinate' }
					] },
					{ id: 'serie-di-Taylor', name: 'Serie di Taylor', icon: Pi, topics: [
						{ id: 'serie-taylor', name: 'Serie di Taylor e Maclaurin' }
					] }
				]
			},
			{
				id: 'fisica-1',
				name: 'Fisica I',
				icon: Atom,
				chapters: [
					{ id: 'cinematica-del-punto-materiale', name: 'Cinematica del punto materiale', icon: Atom, topics: [
						{ id: 'moto-1d', name: 'Moto in una dimensione' },
						{ id: 'moto-parabolico', name: 'Moto di un proiettile' }
					] },
					{ id: 'dinamica-del-punto-materiale', name: 'Dinamica del punto materiale', icon: Atom, topics: [
						{ id: 'principi-newton', name: 'Principi di Newton e sistemi di riferimento inerziali' }
					] },
					{ id: 'lavoro-ed-energia', name: 'Lavoro ed energia', icon: Atom, topics: [
						{ id: 'lavoro-energia', name: 'Lavoro di una forza e conservazione dell\'energia' }
					] },
					{ id: 'meccanica-del-corpo-rigido', name: 'Meccanica del corpo rigido', icon: Atom, topics: [
						{ id: 'rotazione', name: 'Moto rotazionale e momento d\'inerzia' }
					] }
				]
			},
			{
				id: 'fisica-2',
				name: 'Fisica II',
				icon: Atom,
				chapters: [
					{ id: 'termodinamica', name: 'Termodinamica', icon: Atom, topics: [
						{ id: 'gas-ideali', name: 'Leggi dei gas perfetti' },
						{ id: 'principi-td', name: 'Leggi della termodinamica' }
					] },
					{ id: 'elettromagnetismo', name: 'Elettromagnetismo', icon: Atom, topics: [
						{ id: 'coulomb', name: 'Legge di Coulomb e campo elettrico' },
						{ id: 'faraday', name: 'Legge di Faraday e induzione' }
					] },
					{ id: 'ottica', name: 'Ottica', icon: Atom, topics: [
						{ id: 'ottica-wav', name: 'Propagazione delle onde luminose' }
					] }
				]
			},
			{
				id: 'fondamenti-informatica',
				name: 'Fondamenti di Informatica',
				icon: CodeXml,
				chapters: [
					{ id: 'variabili-logiche', name: 'Variabili logiche', icon: CodeXml, topics: [
						{ id: 'variabili-booleane', name: 'Variabili booleane (vero/falso)' }
					] },
					{ id: 'funzioni-logiche', name: 'Funzioni logiche', icon: CodeXml, topics: [
						{ id: 'funzioni-boolean', name: 'Funzioni booleane e tavole di verità' }
					] },
					{ id: 'porte-logiche', name: 'Porte logiche', icon: CodeXml, topics: [
						{ id: 'porte-base', name: 'Porte logiche di base (AND, OR, NOT)' }
					] },
					{ id: 'reti-combinatorie', name: 'Reti combinatorie', icon: CodeXml, topics: [
						{ id: 'circuiti-combinatori', name: 'Circuiti combinatori elementari' }
					] },
					{ id: 'reti-sequenziali', name: 'Reti sequenziali', icon: CodeXml, topics: [
						{ id: 'memorie-basiche', name: 'Memorie di base e flip-flop' }
					] }
				]
			}
		]
	}
];
