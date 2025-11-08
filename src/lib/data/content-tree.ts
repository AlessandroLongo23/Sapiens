import { Pi, University, Backpack, Calculator, Atom, Beaker, CodeXml, GraduationCap, School } from "lucide-svelte";

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
						id: 'aritmetica-base', 
						name: 'Aritmetica base',
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
					{ id: 'geometria-solida-base', name: 'Geometria solida base', icon: Calculator, topics: [] },
					{ id: 'statistica-base', name: 'Statistica base', icon: Calculator, topics: [] },
				]
			},
			{
				id: 'physics',
				name: 'Fisica',
				icon: Atom,
				chapters: [
					{ id: 'movimento-base', name: 'Movimento e velocità', icon: Calculator, topics: [] },
					{ id: 'forze-base', name: 'Forze e movimento', icon: Calculator, topics: [] },
					{ id: 'energia-base', name: 'Energia base', icon: Calculator, topics: [] },
					{ id: 'calore-temperatura', name: 'Calore e temperatura', icon: Calculator, topics: [] },
					{ id: 'onde-base', name: 'Onde e suono', icon: Calculator, topics: [] },
					{ id: 'luce-base', name: 'Luce e ottica base', icon: Calculator, topics: [] },
					{ id: 'elettricita-base', name: 'Elettricità base', icon: Calculator, topics: [] },
					{ id: 'magnetismo-base', name: 'Magnetismo base', icon: Calculator, topics: [] },
					{ id: 'energie-rinnovabili', name: 'Energie rinnovabili', icon: Calculator, topics: [] },
				]
			},
			{
				id: 'chemistry',
				name: 'Chimica',
				icon: Beaker,
				chapters: [
					{ id: 'materia-stati', name: 'Materia e stati di aggregazione', icon: Calculator, topics: [] },
					{ id: 'elementi-composti', name: 'Elementi e composti', icon: Calculator, topics: [] },
					{ id: 'reazioni-base', name: 'Reazioni chimiche base', icon: Calculator, topics: [] },
					{ id: 'acidi-basi-base', name: 'Acidi e basi base', icon: Calculator, topics: [] },
					{ id: 'soluzioni-base', name: 'Soluzioni base', icon: Calculator, topics: [] },
					{ id: 'chimica-ambiente', name: 'Chimica e ambiente', icon: Calculator, topics: [] },
					{ id: 'tavola-periodica-base', name: 'Tavola periodica base', icon: Calculator, topics: [] },
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
					{ id: 'algebra-base', name: 'Algebra base', icon: Calculator, topics: [] },
					{ id: 'equazioni-sistemi', name: 'Equazioni e sistemi', icon: Calculator, topics: [] },
					{ id: 'geometria-analitica-base', name: 'Geometria analitica base', icon: Calculator, topics: [] },
					{ id: 'funzioni-base', name: 'Funzioni elementari', icon: Calculator, topics: [] },
					{ id: 'trigonometria-base', name: 'Trigonometria base', icon: Calculator, topics: [] },
					{ id: 'geometria-solida', name: 'Geometria solida', icon: Calculator, topics: [] },
					{ id: 'funzioni-avanzate', name: 'Funzioni avanzate', icon: Calculator, topics: [] },
					{ id: 'limiti', name: 'Limiti', icon: Calculator, topics: [] },
					{ id: 'derivate', name: 'Derivate', icon: Calculator, topics: [] },
					{ id: 'integrali', name: 'Integrali', icon: Calculator, topics: [] },
					{ id: 'geometria-analitica', name: 'Geometria analitica', icon: Calculator, topics: [] },
					{ id: 'probabilita', name: 'Probabilità', icon: Calculator, topics: [] },
				]
			},
			{
				id: 'physics',
				name: 'Fisica',
				icon: Atom,
				chapters: [
					{ id: 'cinematica', name: 'Cinematica', icon: Calculator, topics: [] },
					{ id: 'dinamica', name: 'Dinamica', icon: Calculator, topics: [] },
					{ id: 'lavoro-energia', name: 'Lavoro ed energia', icon: Calculator, topics: [] },
					{ id: 'termodinamica-base', name: 'Termodinamica base', icon: Calculator, topics: [] },
					{ id: 'elettrostatica-base', name: 'Elettrostatica base', icon: Calculator, topics: [] },
					{ id: 'onde-meccaniche', name: 'Onde meccaniche', icon: Calculator, topics: [] },
					{ id: 'elettromagnetismo', name: 'Elettromagnetismo', icon: Calculator, topics: [] },
					{ id: 'ottica', name: 'Ottica', icon: Calculator, topics: [] },
					{ id: 'termodinamica', name: 'Termodinamica', icon: Calculator, topics: [] },
					{ id: 'meccanica-razionale', name: 'Meccanica razionale', icon: Calculator, topics: [] },
					{ id: 'fisica-moderna', name: 'Fisica moderna', icon: Calculator, topics: [] },
					{ id: 'relativita-base', name: 'Relatività base', icon: Calculator, topics: [] },
					{ id: 'meccanica-quantistica-base', name: 'Meccanica quantistica base', icon: Calculator, topics: [] },
					{ id: 'fisica-nucleare-base', name: 'Fisica nucleare base', icon: Calculator, topics: [] },
					{ id: 'astrofisica-base', name: 'Astrofisica base', icon: Calculator, topics: [] }
				]
			},
			{
				id: 'computer-science',
				name: 'Informatica',
				icon: CodeXml,
				chapters: [
					{ id: 'informatica-base', name: 'Informatica base', icon: Calculator, topics: [] },
					{ id: 'sistemi-operativi', name: 'Sistemi operativi', icon: Calculator, topics: [] },
					{ id: 'internet-web-base', name: 'Internet e web base', icon: Calculator, topics: [] },
					{ id: 'sicurezza-base', name: 'Sicurezza informatica base', icon: Calculator, topics: [] },
					{ id: 'programmazione-visiva', name: 'Programmazione visuale', icon: Calculator, topics: [] },
					{ id: 'office-base', name: 'Strumenti office base', icon: Calculator, topics: [] },
					{ id: 'multimedia-base', name: 'Multimedia base', icon: Calculator, topics: [] },
					{ id: 'presentazioni', name: 'Presentazioni digitali', icon: Calculator, topics: [] },
					{ id: 'collaborazione-digitale', name: 'Collaborazione digitale', icon: Calculator, topics: [] }
				]
			},
			{
				id: 'chemistry',
				name: 'Chimica',
				icon: Beaker,
				chapters: [
					{ id: 'atomo-struttura', name: 'Struttura dell\'atomo', icon: Calculator, topics: [] },
					{ id: 'tavola-periodica', name: 'Tavola periodica', icon: Calculator, topics: [] },
					{ id: 'legami-chimici', name: 'Legami chimici', icon: Calculator, topics: [] },
					{ id: 'stechiometria', name: 'Stechiometria', icon: Calculator, topics: [] },
					{ id: 'reazioni-redox', name: 'Reazioni redox', icon: Calculator, topics: [] },
					{ id: 'chimica-organica-base', name: 'Chimica organica base', icon: Calculator, topics: [] },
					{ id: 'chimica-organica', name: 'Chimica organica', icon: Calculator, topics: [] },
					{ id: 'chimica-fisica', name: 'Chimica fisica', icon: Calculator, topics: [] },
					{ id: 'equilibrio-chimico', name: 'Equilibrio chimico', icon: Calculator, topics: [] },
					{ id: 'cinetica-chimica', name: 'Cinetica chimica', icon: Calculator, topics: [] },
					{ id: 'elettrochimica', name: 'Elettrochimica', icon: Calculator, topics: [] },
					{ id: 'chimica-analitica', name: 'Chimica analitica', icon: Calculator, topics: [] },
					{ id: 'biochimica-base', name: 'Biochimica base', icon: Calculator, topics: [] },
					{ id: 'chimica-ambientale', name: 'Chimica ambientale', icon: Calculator, topics: [] },
					{ id: 'chimica-industriale', name: 'Chimica industriale', icon: Calculator, topics: [] },
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
					{ id: 'successioni-serie', name: 'Successioni e serie', icon: Calculator, topics: [] },
					{ id: 'limiti', name: 'Limiti', icon: Calculator, topics: [] },
					{ id: 'derivate', name: 'Derivate', icon: Calculator, topics: [] },
					{ id: 'integrali', name: 'Integrali', icon: Calculator, topics: [] },
					{ id: 'equazioni-differenziali', name: 'Equazioni differenziali', icon: Calculator, topics: [] },
				]
			},
			{
				id: 'analisi-2',
				name: 'Analisi matematica II',
				icon: Pi,
				chapters: [
					{ id: 'integralidoppi', name: 'Integrali doppi', icon: Calculator, topics: [] },
					{ id: 'integrali-tripli', name: 'Integrali tripli', icon: Calculator, topics: [] },
					{ id: 'serie-di-Taylor', name: 'Serie di Taylor', icon: Calculator, topics: [] },
				]
			},
			{
				id: 'fisica-1',
				name: 'Fisica I',
				icon: Atom,
				chapters: [
					{ id: 'cinematica-del-punto-materiale', name: 'Cinematica del punto materiale', icon: Calculator, topics: [] },
					{ id: 'dinamica-del-punto-materiale', name: 'Dinamica del punto materiale', icon: Calculator, topics: [] },
					{ id: 'lavoro-ed-energia', name: 'Lavoro ed energia', icon: Calculator, topics: [] },
					{ id: 'meccanica-del-corpo-rigido', name: 'Meccanica del corpo rigido', icon: Calculator, topics: [] },
				]
			},
			{
				id: 'fisica-2',
				name: 'Fisica II',
				icon: Atom,
				chapters: [
					{ id: 'termodinamica', name: 'Termodinamica', icon: Calculator, topics: [] },
					{ id: 'elettromagnetismo', name: 'Elettromagnetismo', icon: Calculator, topics: [] },
					{ id: 'ottica', name: 'Ottica', icon: Calculator, topics: [] },
				]
			},
			{
				id: 'fondamenti-informatica',
				name: 'Fondamenti di Informatica',
				icon: CodeXml,
				chapters: [
					{ id: 'variabili-logiche', name: 'Variabili logiche', icon: Calculator, topics: [] },
					{ id: 'funzioni-logiche', name: 'Funzioni logiche', icon: Calculator, topics: [] },
					{ id: 'porte-logiche', name: 'Porte logiche', icon: Calculator, topics: [] },
					{ id: 'reti-combinatorie', name: 'Reti combinatorie', icon: Calculator, topics: [] },
					{ id: 'reti-sequenziali', name: 'Reti sequenziali', icon: Calculator, topics: [] },
				]
			}
		]
	},
];
