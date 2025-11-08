import { Pi, University, Backpack, Calculator, Atom, Beaker, CodeXml, School } from "lucide-svelte";

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
}

export const contentTree: LevelNode[] = [
	{	
		id: EducationalLevel.MIDDLE_SCHOOL,
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
						topics: []
					},
					{ 
						id: 'frazioni', 
						name: 'Frazioni e decimali',
						icon: Calculator,
						topics: []
					},
					{ id: 'percentuali', name: 'Percentuali', icon: Calculator, topics: [] },
					{ id: 'geometria-piana', name: 'Geometria piana', icon: Calculator, topics: [] },
					{ id: 'aree-perimetri', name: 'Aree e perimetri', icon: Calculator, topics: [] },
					{ id: 'proporzioni', name: 'Proporzioni', icon: Calculator, topics: [] },
					{ id: 'equazioni-primo', name: 'Equazioni di primo grado', icon: Calculator, topics: [] },
					{ id: 'geometria-solida', name: 'Geometria solida', icon: Calculator, topics: [] },
					{ id: 'statistica', name: 'Statistica', icon: Calculator, topics: [] },
				]
			},
			{
				id: 'physics',
				name: 'Fisica',
				icon: Atom,
				chapters: [
					{ id: 'movimento', name: 'Movimento e velocità', icon: Atom, topics: [] },
					{ id: 'forze', name: 'Forze e movimento', icon: Atom, topics: [] },
					{ id: 'energia', name: 'Energia', icon: Atom, topics: [] },
					{ id: 'calore-temperatura', name: 'Calore e temperatura', icon: Atom, topics: [] },
					{ id: 'onde', name: 'Onde e suono', icon: Atom, topics: [] },
					{ id: 'luce', name: 'Luce e ottica', icon: Atom, topics: [] },
					{ id: 'elettricita', name: 'Elettricità', icon: Atom, topics: [] },
					{ id: 'magnetismo', name: 'Magnetismo', icon: Atom, topics: [] },
					{ id: 'energie-rinnovabili', name: 'Energie rinnovabili', icon: Atom, topics: [] },
				]
			},
			{
				id: 'chemistry',
				name: 'Chimica',
				icon: Beaker,
				chapters: [
					{ id: 'materia-stati', name: 'Materia e stati di aggregazione', icon: Beaker, topics: [] },
					{ id: 'elementi-composti', name: 'Elementi e composti', icon: Beaker, topics: [] },
					{ id: 'reazioni', name: 'Reazioni chimiche', icon: Beaker, topics: [] },
					{ id: 'acidi-basi', name: 'Acidi e basi', icon: Beaker, topics: [] },
					{ id: 'soluzioni', name: 'Soluzioni', icon: Beaker, topics: [] },
					{ id: 'chimica-ambiente', name: 'Chimica e ambiente', icon: Beaker, topics: [] },
					{ id: 'tavola-periodica', name: 'Tavola periodica', icon: Beaker, topics: [] },
				]
			},
		]
	},
	{
		id: EducationalLevel.HIGH_SCHOOL,
		icon: School,
		subjects: [
			{
				id: 'math',
				name: 'Matematica',
				icon: Pi,
				chapters: [
					{
						id: 'fondamenti-matematici',
						name: 'Fondamenti matematici',
						icon: Pi,
						topics: [
							{ id: 'insiemi-e-logica', name: 'Insiemi e logica' },
							{ id: 'rappresentazione-insiemi', name: 'Rappresentazione degli insiemi' },
							{ id: 'operazioni-e-relazioni-tra-insiemi', name: 'Operazioni e relazioni tra insiemi' },
							{ id: 'sottoinsiemi-ugualianza', name: 'Sottoinsiemi e uguaglianza' },
							{ id: 'unione-insiemistica', name: 'Unione insiemistica' },
							{ id: 'intersezione-insiemistica', name: 'Intersezione insiemistica' },
							{ id: 'differenza-insiemistica', name: 'Differenza insiemistica' },
							{ id: 'complementare-insiemistica', name: 'Complementare insiemistica' },
							{ id: 'prodotto-cartesiano', name: 'Prodotto cartesiano' },
							{ id: 'insiemi-numerici', name: 'Insiemi numerici' },
							{ id: 'numeri-naturali', name: 'Numeri naturali' },
							{ id: 'numeri-interi', name: 'Numeri interi' },
							{ id: 'numeri-razionali', name: 'Numeri razionali' },
							{ id: 'numeri-reali', name: 'Numeri reali' },
							{ id: 'numeri-immaginari', name: 'Numeri immaginari' },
							{ id: 'numeri-complessi', name: 'Numeri complessi' },
						]
					},
					{ 
						id: 'algebra', 
						name: 'Algebra', 
						icon: Pi, 
						topics: [
							{ id: 'insiemi-e-logica', name: 'Insiemi e logica' },
							{ id: 'monomi-e-polinomi', name: 'Monomi e polinomi' },
							{ id: 'equazioni-primo-grado', name: 'Equazioni di primo grado' },
							{ id: 'equazioni-secondo-grado', name: 'Equazioni di secondo grado' },
							{ id: 'sistemi-di-equazioni', name: 'Sistemi di equazioni' },
							{ id: 'disequazioni-primo-grado', name: 'Disequazioni di primo grado' },
							{ id: 'disequazioni-secondo-grado', name: 'Disequazioni di secondo grado' },
							{ id: 'disequazioni-razionali', name: 'Disequazioni razionali' },
							{ id: 'sistemi-di-disequazioni', name: 'Sistemi di disequazioni' },
							{ id: 'funzioni-lineari', name: 'Funzioni lineari' },
							{ id: 'funzioni-quadratiche', name: 'Funzioni quadratiche' },
							{ id: 'funzioni-esponenziali', name: 'Funzioni esponenziali' },
							{ id: 'funzioni-logaritmiche', name: 'Funzioni logaritmiche' },
						],
					},
					{ id: 'equazioni-sistemi', name: 'Equazioni e sistemi', icon: Pi, topics: [] },
					{ 
						id: 'geometria-analitica', 
						name: 'Geometria analitica', 
						icon: Pi, 
						topics: [
							{ id: 'il-piano-cartesiano', name: 'Il piano cartesiano' },
							{ id: 'la-distanza-tra-due-punti', name: 'La distanza tra due punti' },
							{ id: 'rette-passanti-per-origine-assi', name: 'Rette passanti per l\'origine degli assi' },
							{ id: 'equazioni-degli-assi', name: 'Equazioni degli assi' },
							{ id: 'rette-parallele-asse-x', name: 'Rette parallele all\'asse x' },
							{ id: 'rette-parallele-asse-y', name: 'Rette parallele all\'asse y' },
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
						icon: Pi,
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
						icon: Pi, 
						topics: [
							{ id: 'solidi-geometrici', name: 'Solidi geometrici' },
							{ id: 'superfici-e-volumi-dei-solidi-geometrici', name: 'Superfici e volumi dei solidi geometrici' },
						]
					},
					{
						id: 'funzioni',
						name: 'Funzioni',
						icon: Pi,
						topics: [
							{ id: 'defizione-di-funzione', name: 'Definizione di funzione' },
							{ id: 'dominio-codominio-immagine', name: 'Dominio, codominio e immagine' },
							{ id: 'funzioni-iniettive-suriettive-biettive', name: 'Funzioni iniettive, suriettive e biettive' },
							{ id: 'funzioni-reali-di-variabile-reale', name: 'Funzioni reali di variabile reale' },
							{ id: 'composizione-di-funzioni', name: 'Composizione di funzioni' },
							{ id: 'funzioni-invertibili', name: 'Funzioni invertibili' },
							{ id: 'funzioni-periodiche', name: 'Funzioni periodiche' },
							{ id: 'funzioni-dispari-pari', name: 'Funzioni dispari e pari' },
						]
					},
					{ 
						id: 'limiti', 
						name: 'Limiti', 
						icon: Pi, 
						topics: [
							{ id: 'definizione-di-limite', name: 'Definizione di limite' },
							{ id: 'teoremi-sui-limiti', name: 'Teoremi sui limiti' },
							{ id: 'forme-indeterminate', name: 'Forme indeterminate' },
							{ id: 'limiti-notevoli', name: 'Limiti notevoli' },
						] 
					},
					{ id: 'derivate', name: 'Derivate', icon: Pi, topics: [] },
					{ id: 'integrali', name: 'Integrali', icon: Pi, topics: [] },
					{ id: 'probabilita', name: 'Probabilità', icon: Pi, topics: [] },
				]
			},
			{
				id: 'physics',
				name: 'Fisica',
				icon: Atom,
				chapters: [
					{ id: 'cinematica', name: 'Cinematica', icon: Atom, topics: [] },
					{ id: 'dinamica', name: 'Dinamica', icon: Atom, topics: [] },
					{ id: 'lavoro-energia', name: 'Lavoro ed energia', icon: Atom, topics: [] },
					{ id: 'termodinamica', name: 'Termodinamica', icon: Atom, topics: [] },
					{ id: 'elettrostatica', name: 'Elettrostatica', icon: Atom, topics: [] },
					{ id: 'onde-meccaniche', name: 'Onde meccaniche', icon: Atom, topics: [] },
					{ id: 'elettromagnetismo', name: 'Elettromagnetismo', icon: Atom, topics: [] },
					{ id: 'ottica', name: 'Ottica', icon: Atom, topics: [] },
					{ id: 'termodinamica', name: 'Termodinamica', icon: Atom, topics: [] },
					{ id: 'meccanica-razionale', name: 'Meccanica razionale', icon: Atom, topics: [] },
					{ id: 'fisica-moderna', name: 'Fisica moderna', icon: Atom, topics: [] },
					{ id: 'relativita', name: 'Relatività', icon: Atom, topics: [] },
					{ id: 'meccanica-quantistica', name: 'Meccanica quantistica', icon: Atom, topics: [] },
					{ id: 'fisica-nucleare', name: 'Fisica nucleare', icon: Atom, topics: [] },
					{ id: 'astrofisica', name: 'Astrofisica', icon: Atom, topics: [] }
				]
			},
			{
				id: 'computer-science',
				name: 'Informatica',
				icon: CodeXml,
				chapters: [
					{ id: 'informatica', name: 'Informatica', icon: CodeXml, topics: [] },
					{ id: 'sistemi-operativi', name: 'Sistemi operativi', icon: CodeXml, topics: [] },
					{ id: 'internet-web', name: 'Internet e web', icon: CodeXml, topics: [] },
					{ id: 'sicurezza', name: 'Sicurezza informatica', icon: CodeXml, topics: [] },
					{ id: 'programmazione-visiva', name: 'Programmazione visuale', icon: CodeXml, topics: [] },
					{ id: 'office', name: 'Strumenti office', icon: CodeXml, topics: [] },
					{ id: 'multimedia', name: 'Multimedia', icon: CodeXml, topics: [] },
					{ id: 'presentazioni', name: 'Presentazioni digitali', icon: CodeXml, topics: [] },
					{ id: 'collaborazione-digitale', name: 'Collaborazione digitale', icon: CodeXml, topics: [] }
				]
			},
			{
				id: 'chemistry',
				name: 'Chimica',
				icon: Beaker,
				chapters: [
					{ id: 'atomo-struttura', name: 'Struttura dell\'atomo', icon: Beaker, topics: [] },
					{ id: 'tavola-periodica', name: 'Tavola periodica', icon: Beaker, topics: [] },
					{ id: 'legami-chimici', name: 'Legami chimici', icon: Beaker, topics: [] },
					{ id: 'stechiometria', name: 'Stechiometria', icon: Beaker, topics: [] },
					{ id: 'reazioni-redox', name: 'Reazioni redox', icon: Beaker, topics: [] },
					{ id: 'chimica-organica', name: 'Chimica organica', icon: Beaker, topics: [] },
					{ id: 'chimica-organica', name: 'Chimica organica', icon: Beaker, topics: [] },
					{ id: 'chimica-fisica', name: 'Chimica fisica', icon: Beaker, topics: [] },
					{ id: 'equilibrio-chimico', name: 'Equilibrio chimico', icon: Beaker, topics: [] },
					{ id: 'cinetica-chimica', name: 'Cinetica chimica', icon: Beaker, topics: [] },
					{ id: 'elettrochimica', name: 'Elettrochimica', icon: Beaker, topics: [] },
					{ id: 'chimica-analitica', name: 'Chimica analitica', icon: Beaker, topics: [] },
					{ id: 'biochimica', name: 'Biochimica', icon: Beaker, topics: [] },
					{ id: 'chimica-ambientale', name: 'Chimica ambientale', icon: Beaker, topics: [] },
					{ id: 'chimica-industriale', name: 'Chimica industriale', icon: Beaker, topics: [] },
				]
			}
		]
	},
	{
		id: EducationalLevel.UNIVERSITY,
		icon: University,
		subjects: [
			{
				id: 'analisi-1',
				name: 'Analisi matematica I',
				icon: Pi,
				chapters: [
					{ id: 'successioni-serie', name: 'Successioni e serie', icon: Pi, topics: [] },
					{ id: 'limiti', name: 'Limiti', icon: Pi, topics: [] },
					{ id: 'derivate', name: 'Derivate', icon: Pi, topics: [] },
					{ id: 'integrali', name: 'Integrali', icon: Pi, topics: [] },
					{ id: 'equazioni-differenziali', name: 'Equazioni differenziali', icon: Pi, topics: [] },
				]
			},
			{
				id: 'analisi-2',
				name: 'Analisi matematica II',
				icon: Pi,
				chapters: [
					{ id: 'integralidoppi', name: 'Integrali doppi', icon: Pi, topics: [] },
					{ id: 'integrali-tripli', name: 'Integrali tripli', icon: Pi, topics: [] },
					{ id: 'serie-di-Taylor', name: 'Serie di Taylor', icon: Pi, topics: [] },
				]
			},
			{
				id: 'fisica-1',
				name: 'Fisica I',
				icon: Atom,
				chapters: [
					{ id: 'cinematica-del-punto-materiale', name: 'Cinematica del punto materiale', icon: Atom, topics: [] },
					{ id: 'dinamica-del-punto-materiale', name: 'Dinamica del punto materiale', icon: Atom, topics: [] },
					{ id: 'lavoro-ed-energia', name: 'Lavoro ed energia', icon: Atom, topics: [] },
					{ id: 'meccanica-del-corpo-rigido', name: 'Meccanica del corpo rigido', icon: Atom, topics: [] },
				]
			},
			{
				id: 'fisica-2',
				name: 'Fisica II',
				icon: Atom,
				chapters: [
					{ id: 'termodinamica', name: 'Termodinamica', icon: Atom, topics: [] },
					{ id: 'elettromagnetismo', name: 'Elettromagnetismo', icon: Atom, topics: [] },
					{ id: 'ottica', name: 'Ottica', icon: Atom, topics: [] },
				]
			},
			{
				id: 'fondamenti-informatica',
				name: 'Fondamenti di Informatica',
				icon: CodeXml,
				chapters: [
					{ id: 'variabili-logiche', name: 'Variabili logiche', icon: CodeXml, topics: [] },
					{ id: 'funzioni-logiche', name: 'Funzioni logiche', icon: CodeXml, topics: [] },
					{ id: 'porte-logiche', name: 'Porte logiche', icon: CodeXml, topics: [] },
					{ id: 'reti-combinatorie', name: 'Reti combinatorie', icon: CodeXml, topics: [] },
					{ id: 'reti-sequenziali', name: 'Reti sequenziali', icon: CodeXml, topics: [] },
				]
			}
		]
	},
];
