/**
 * The study note at the foot of a subject index page, laid out like a page of a
 * student's diary. Each note is written for one subject at one level, describes
 * only the chapters that exist in the database for it, and lays out its own
 * page from a few kinds of blocks, so that no two subjects share the same
 * shape. Keyed by `<level slug>/<subject slug>` (database slugs); the figure is
 * `public/guide/<level>-<subject>.svg`, drawn in TikZ by
 * `scripts/figure/guides.mjs`.
 *
 * Text fields take two marks: `**bold**` and `==highlighter==`.
 */

import { GUIDE_FIGURES } from './guide-figures';

export interface GuideStop {
	/** The stretch of the route, in a word or two: "Primo anno", "I viventi". */
	label: string;
	/** Its chapters, in the order they come. */
	topics: string;
	/** A red stamp beside the stop, for an exam it prepares for. */
	stamp?: string;
	/** A pencil note in the margin of the stop. */
	pencil?: string;
}

export type PostitColor = 'yellow' | 'pink' | 'blue' | 'green';

export type GuideBlock =
	/** A paragraph of the note. */
	| { kind: 'text'; text: string }
	/** The chapters in stops: circled down the page (`path`), across it by year (`timeline`), or in boxes by area (`areas`). */
	| { kind: 'route'; heading: string; style: 'path' | 'timeline' | 'areas'; stops: GuideStop[] }
	/** The subject's figure, taped to the page; `tilt` in degrees. */
	| { kind: 'figure'; tilt?: number }
	/** Steps with a red tick. */
	| { kind: 'checklist'; heading: string; items: string[] }
	| { kind: 'postit'; heading: string; text: string; color?: PostitColor; tilt?: number }
	/** A dashed rule and a short list with pencil arrows, for what to know first. */
	| { kind: 'arrows'; heading: string; items: string[] }
	/** Mistakes struck through in red, each with the correction in pencil. */
	| { kind: 'mistakes'; heading: string; items: { wrong: string; right: string }[] }
	/** An index card: a question and its answer in pencil. */
	| { kind: 'card'; heading: string; question: string; answer: string; tilt?: number }
	/** A method or a definition framed by hand; lines are numbered unless `numbered` is false (then set as formulas). */
	| { kind: 'boxed'; heading: string; lines: string[]; numbered?: boolean; pencil?: string }
	/** A small table of terms and what they mean. */
	| { kind: 'table'; heading: string; rows: [string, string][]; pencil?: string }
	/** A pencil note on its own. */
	| { kind: 'scribble'; text: string };

/** A block across the page, or blocks side by side. */
export type GuideRow = GuideBlock | GuideBlock[];

export interface SubjectGuideContent {
	/** The note's title; the subject's name, often. */
	title: string;
	/** A few words in pencil beside the title. */
	scribble?: string;
	intro: string;
	figure: { alt: string; caption: string };
	blocks: GuideRow[];
}

const guides: Record<string, SubjectGuideContent> = {
	'high_school/math': {
		title: 'Matematica per le superiori',
		scribble: 'cinque anni, un filo solo',
		intro: "Gli argomenti arrivano ==nell'ordine in cui li incontri in classe==, anno per anno, dagli insiemi agli integrali. Ogni capitolo è diviso in **lezioni corte, una per idea**: ognuna usa solo quello che viene prima.",
		figure: {
			alt: 'La parabola y = x² − 2x − 3 con le radici −1 e 3 cerchiate in rosso, il vertice V e la retta tangente in x = 3, di pendenza 4.',
			caption: 'la stessa parabola: equazione in seconda, derivata in quinta'
		},
		blocks: [
			{
				kind: 'route',
				heading: 'Anno per anno',
				style: 'timeline',
				stops: [
					{ label: 'Primo anno', topics: 'Insiemi e logica, i numeri fino ai razionali, **polinomi ed equazioni di primo grado**, statistica, triangoli.' },
					{ label: 'Secondo anno', topics: 'Sistemi, radicali, la retta, **equazioni di secondo grado** e parabola, probabilità.', pencil: 'il cuore del biennio' },
					{ label: 'Terzo anno', topics: 'Funzioni, successioni, coniche, esponenziali e logaritmi.' },
					{ label: 'Quarto anno', topics: 'Goniometria e trigonometria, numeri complessi, calcolo combinatorio, geometria dello spazio.' },
					{ label: 'Quinto anno', topics: 'Limiti, **derivate**, studio di funzione, **integrali**, equazioni differenziali.', stamp: 'Maturità' }
				]
			},
			[
				{ kind: 'figure', tilt: -1.5 },
				{
					kind: 'mistakes',
					heading: 'Errori che costano mezzo voto',
					items: [
						{ wrong: '(a + b)² = a² + b²', right: 'manca il doppio prodotto: a² + 2ab + b²' },
						{ wrong: '−3² = 9', right: 'la potenza viene prima del segno: −9' },
						{ wrong: '√(9 + 16) = 3 + 4', right: 'la radice non si spezza su una somma: √25 = 5' }
					]
				}
			],
			[
				{
					kind: 'checklist',
					heading: 'Verso la verifica',
					items: [
						'Leggi le lezioni **in ordine** e arriva in fondo senza fermarti sui dettagli.',
						'Alla seconda lettura ==copri gli esempi svolti== e rifalli da solo, passaggio per passaggio.',
						'Negli esercizi guarda **che tipo di errore ripeti**, non quante risposte giuste collezioni.'
					]
				},
				{ kind: 'postit', heading: 'La sera prima', color: 'pink', text: 'Il formulario serve al ripasso finale, ma in verifica si chiede di **applicare**, non di ricordare.' }
			],
			{ kind: 'scribble', text: 'recuperare una base costa meno che rileggere tre volte una dimostrazione' }
		]
	},

	'high_school/physics': {
		title: 'Fisica per le superiori',
		scribble: 'dalle misure ai quanti',
		intro: "Il primo anno sembra poca fisica: misure, grafici, vettori, equilibrio. È ==l'attrezzatura che serve dopo==: senza vettori non si capiscono né le forze né i campi. Ogni capitolo è diviso in **lezioni brevi, una per idea**.",
		figure: {
			alt: 'Un blocco su un piano inclinato di angolo alfa, con le tre forze in rosso: il peso P, la reazione normale N e l’attrito f.',
			caption: 'prima di ogni conto: disegna le forze'
		},
		blocks: [
			[
				{ kind: 'figure', tilt: 2 },
				{
					kind: 'route',
					heading: 'Il percorso',
					style: 'path',
					stops: [
						{ label: 'Primo anno', topics: 'Grandezze e misura, relazioni e grafici, vettori e forze, equilibrio dei solidi e dei fluidi, ottica geometrica.', pencil: 'la cassetta degli attrezzi' },
						{ label: 'Secondo anno', topics: 'Moto rettilineo e nel piano, **principi della dinamica**, lavoro ed energia, temperatura e calore.' },
						{ label: 'Terzo anno', topics: 'Quantità di moto, corpo rigido, **gravitazione**, fluidi, gas e principi della termodinamica.' },
						{ label: 'Quarto anno', topics: 'Onde, suono e luce; carica, campo e potenziale elettrico, corrente continua, campo magnetico.' },
						{ label: 'Quinto anno', topics: '**Induzione** e onde elettromagnetiche, relatività ristretta, quanti, atomo e nucleo.', stamp: 'Maturità', pencil: 'può essere la seconda prova' }
					]
				}
			],
			{
				kind: 'boxed',
				heading: 'Un problema in quattro righe',
				lines: [
					'**Disegno**: i corpi, le forze, il verso positivo.',
					'Dati e incognite, tutti in unità del Sistema Internazionale.',
					'La legge che lega i dati alle incognite, poi i conti.',
					"Il risultato: ==unità di misura e ordine di grandezza==."
				],
				pencil: "se il numero è assurdo, l'errore è quasi sempre al punto 2"
			},
			[
				{
					kind: 'table',
					heading: 'Unità da sapere a occhi chiusi',
					rows: [
						['N', 'newton, la forza: kg · m/s²'],
						['J', 'joule, lavoro ed energia: N · m'],
						['W', 'watt, la potenza: J/s'],
						['Pa', 'pascal, la pressione: N/m²'],
						['C', 'coulomb, la carica: A · s']
					]
				},
				{ kind: 'postit', heading: 'Formule inverse', color: 'blue', tilt: 2, text: 'Non impararle tutte: impara quella diretta e ==ricava le altre==. In verifica si chiede proprio questo.' }
			],
			{
				kind: 'arrows',
				heading: 'Da matematica',
				items: [
					'Primo anno: proporzioni, **potenze di dieci**, equazioni di primo grado.',
					'Seno e coseno servono già per i vettori: una lezione del primo anno li spiega.',
					'Quinto anno: **derivate e integrali**, per induzione e circuiti.'
				]
			}
		]
	},

	'high_school/computer-science': {
		title: 'Informatica per le superiori',
		scribble: 'si parte da zero',
		intro: "Il percorso del liceo scientifico delle scienze applicate. Il primo anno spiega ==come un computer rappresenta le informazioni==; dal secondo si programma, e ogni anno aggiunge uno strumento: funzioni, oggetti, basi di dati, reti. **Non servono prerequisiti.**",
		figure: {
			alt: 'Un diagramma di flusso: Inizio, leggi n, la domanda n > 0 in un rombo rosso, due rami che scrivono positivo o no, e Fine.',
			caption: 'un algoritmo: una domanda, due strade'
		},
		blocks: [
			{
				kind: 'route',
				heading: 'Cinque anni in una riga',
				style: 'timeline',
				stops: [
					{ label: 'Primo anno', topics: 'Numeri binari, codifica, architettura del computer, sistema operativo, foglio di calcolo.' },
					{ label: 'Secondo anno', topics: 'Internet e sicurezza; **algoritmi**, primi programmi, selezione e cicli.', pencil: 'qui si comincia a programmare' },
					{ label: 'Terzo anno', topics: 'Funzioni, vettori e stringhe, ordinamento, file; HTML, CSS e pagine interattive.' },
					{ label: 'Quarto anno', topics: 'Ricorsione, oggetti, strutture dati, **basi di dati e SQL**, intelligenza artificiale.' },
					{ label: 'Quinto anno', topics: 'Reti e TCP/IP, crittografia, grafi, calcolo numerico, apprendimento automatico.' }
				]
			},
			[
				{
					kind: 'mistakes',
					heading: 'Errori da primo programma',
					items: [
						{ wrong: 'if x = 5:', right: 'un uguale assegna, due confrontano: x == 5' },
						{ wrong: 'range(1, 10) conta fino a 10', right: "si ferma a 9: l'ultimo numero è escluso" },
						{ wrong: 'funziona con 3, quindi è giusto', right: 'provalo con 0, con un negativo e con il caso più grande' }
					]
				},
				{ kind: 'figure', tilt: 1 }
			],
			[
				{ kind: 'postit', heading: 'Il linguaggio', color: 'green', tilt: -2, text: 'Negli esempi usiamo **Python**. Se in classe usate C++ le idee sono le stesse: cambia la grammatica.' },
				{
					kind: 'checklist',
					heading: 'Per imparare a programmare',
					items: [
						'Scrivi il procedimento **in italiano** prima di scrivere codice.',
						'Esegui a mano, ==una riga alla volta e con un numero vero==, annotando il valore delle variabili.',
						"Quando sbagli, leggi il messaggio di errore **fino in fondo**: di solito dice la riga."
					]
				}
			]
		]
	},

	'high_school/chemistry': {
		title: 'Chimica per le superiori',
		intro: "Nei primi due anni la chimica si vede: miscugli, passaggi di stato, gas. Dal terzo si entra ==dentro l'atomo==, e da lì si spiega tutto il resto: legami, reazioni, equilibri. Il quinto anno è **chimica organica e biochimica**.",
		figure: {
			alt: 'La reazione 2 H₂ + O₂ → 2 H₂O e lo schema per risolvere i problemi: grammi diviso massa molare dà le moli, i coefficienti danno le moli del prodotto, per massa molare si torna ai grammi.',
			caption: 'il metodo che risolve quasi tutti i problemi'
		},
		blocks: [
			[
				{
					kind: 'route',
					heading: 'Il percorso',
					style: 'path',
					stops: [
						{ label: 'Primo anno', topics: 'Misure, stati della materia e miscugli, leggi ponderali e **teoria atomica di Dalton**.' },
						{ label: 'Secondo anno', topics: "Leggi dei gas, **la mole**, le particelle dell'atomo, la chimica dell'acqua.", pencil: 'la mole torna in ogni capitolo dopo' },
						{ label: 'Terzo anno', topics: 'Configurazione elettronica, tavola periodica, legami e forma delle molecole, nomenclatura.' },
						{ label: 'Quarto anno', topics: 'Soluzioni, stechiometria, energia e velocità delle reazioni, **equilibrio**, acidi e basi, redox e pile.' },
						{ label: 'Quinto anno', topics: 'Idrocarburi e gruppi funzionali, biomolecole, metabolismo.' }
					]
				},
				{ kind: 'card', heading: 'Domanda da interrogazione', tilt: 1.5, question: "Che cos'è una mole?", answer: 'Tante particelle quanto il numero di Avogadro, 6,022 · 10²³.' }
			],
			[
				{ kind: 'figure', tilt: -1 },
				{
					kind: 'checklist',
					heading: 'Nei problemi',
					items: [
						'Scrivi la reazione e **bilanciala** prima di ogni conto.',
						'Passa ==da grammi a moli==: i coefficienti parlano di moli, non di grammi.',
						'Alla fine torna alle unità richieste e controlla le **cifre significative**.'
					]
				}
			],
			{ kind: 'postit', heading: 'Nomenclatura', tilt: 1.5, text: 'Si impara come un vocabolario: **dieci minuti al giorno** rendono più di un pomeriggio prima della verifica.' }
		]
	},

	'middle_school/math': {
		title: 'Matematica per le medie',
		scribble: 'tre anni, le basi di tutto',
		intro: 'Tre anni che ==stanno sotto a tutto quello che viene dopo==. In ogni anno ci sono numeri e geometria, e le lezioni sono brevi, una per argomento: **studi quello che serve** per il compito della settimana.',
		figure: {
			alt: 'Un cerchio diviso in quattro spicchi con tre colorati, uguale a 0,75, uguale a un quadrato di cento quadretti con settantacinque colorati: 3/4 = 0,75 = 75%.',
			caption: 'lo stesso numero, scritto in tre modi'
		},
		blocks: [
			[
				{
					kind: 'route',
					heading: 'Il percorso',
					style: 'path',
					stops: [
						{ label: 'Prima', topics: 'Numeri naturali e potenze, **divisibilità**, frazioni; enti geometrici, angoli, triangoli.', pencil: 'm.c.m. e M.C.D. servono per le frazioni' },
						{ label: 'Seconda', topics: 'Decimali e radice quadrata, **proporzioni e percentuali**; quadrilateri, aree, Pitagora, similitudine.' },
						{ label: 'Terza', topics: 'Numeri relativi, calcolo letterale, **equazioni**, funzioni, statistica e probabilità; cerchio e solidi.', stamp: 'Esame' }
					]
				},
				{ kind: 'figure', tilt: 2 }
			],
			[
				{ kind: 'card', heading: 'Prova tu', tilt: -1.5, question: 'Quanto fa 3/4 in percentuale?', answer: '75%: 3 diviso 4 fa 0,75, cioè 75 centesimi.' },
				{ kind: 'postit', heading: 'Per i genitori', tilt: 2.5, text: 'Le spiegazioni partono **sempre da un esempio concreto**: vanno bene anche per seguire i compiti.' }
			],
			{
				kind: 'checklist',
				heading: 'Compiti e verifiche',
				items: [
					'Leggi con **carta e penna vicino** e rifai ogni esempio prima di andare avanti.',
					'Se un passaggio non torna, ==torna alla lezione precedente==.',
					'Negli esercizi **conta gli errori dello stesso tipo** e rileggi solo quella parte.'
				]
			},
			{ kind: 'scribble', text: 'dopo la terza si passa alle superiori, e si riparte dagli insiemi' }
		]
	},

	'middle_school/science': {
		title: 'Scienze per le medie',
		scribble: 'quattro scienze in una',
		intro: "Scienze mette insieme ==fisica, chimica, biologia e scienze della Terra==. Durante l'anno gli argomenti si alternano: qui sotto li trovi divisi per area, e ogni area cresce dalla prima alla terza. Sopra, i capitoli sono in ordine di classe.",
		figure: {
			alt: "Il ciclo dell'acqua: il sole scalda il mare, una freccia rossa di evaporazione sale fino a una nuvola dove avviene la condensazione, la pioggia cade su una montagna e una freccia riporta l'acqua al mare.",
			caption: "la stessa acqua, in tre stati diversi"
		},
		blocks: [
			{
				kind: 'route',
				heading: 'Quattro aree',
				style: 'areas',
				stops: [
					{ label: 'Materia ed energia', topics: 'In prima misure, stati della materia, calore. In seconda **atomi e reazioni**, moto e forze. In terza energia, suono, elettricità, luce.' },
					{ label: 'La Terra e il cielo', topics: "In prima acqua, aria e suolo. In seconda minerali e rocce. In terza vulcani, terremoti, **tettonica** e Sistema solare." },
					{ label: 'I viventi', topics: 'In prima la cellula, piante e animali. In seconda gli ecosistemi. In terza **evoluzione**, genetica e DNA.' },
					{ label: 'Il corpo umano', topics: 'In seconda movimento, digestione, respirazione, circolazione. In terza sistema nervoso, sensi e riproduzione.' }
				]
			},
			[
				{
					kind: 'boxed',
					heading: 'Il metodo scientifico',
					lines: [
						'Osservo un fenomeno e mi faccio una domanda.',
						"Formulo un'**ipotesi** che si possa controllare.",
						"Faccio un esperimento ==cambiando una cosa sola==.",
						"Guardo i dati: confermano l'ipotesi o no?"
					],
					pencil: 'vale per ogni capitolo, non solo per il primo'
				},
				{ kind: 'figure', tilt: -2 }
			],
			[
				{
					kind: 'table',
					heading: 'Parole che si confondono',
					rows: [
						['massa', 'quanta materia ha un corpo, in kilogrammi'],
						['peso', 'la forza con cui la Terra lo attira, in newton'],
						['calore', 'energia che passa da un corpo più caldo a uno più freddo'],
						['temperatura', 'quanto è caldo un corpo, in gradi Celsius']
					]
				},
				{ kind: 'postit', heading: 'Interrogazione', color: 'green', tilt: 2, text: 'Per ogni capitolo fai ==uno schema con parole chiave e frecce==. Se sai spiegarlo guardando solo lo schema, sei pronto.' }
			]
		]
	},

	'middle_school/technology': {
		title: 'Tecnologia per le medie',
		scribble: 'si studia e si disegna',
		intro: "Tecnologia ha due anime: ==la teoria== (materiali, alimenti, edifici, energia, computer) e **il disegno tecnico**, che si fa con squadre e compasso. Le lezioni di disegno seguono una costruzione alla volta, un passo dopo l'altro.",
		figure: {
			alt: 'Le proiezioni ortogonali di un pezzo a forma di L con il metodo europeo: il prospetto in alto a sinistra, il fianco alla sua destra, la pianta sotto, con le linee di richiamo e la retta a 45 gradi; lo spigolo del gradino è in rosso nella pianta.',
			caption: 'tre viste, un solo pezzo'
		},
		blocks: [
			{
				kind: 'route',
				heading: 'Tre anni',
				style: 'timeline',
				stops: [
					{ label: 'Prima', topics: 'Legno, carta, fibre, metalli e plastiche; **costruzioni geometriche**; hardware, software e algoritmi.' },
					{ label: 'Seconda', topics: '**Proiezioni ortogonali**; agricoltura e alimenti; edifici e città; Internet, sicurezza, programmazione a blocchi.' },
					{ label: 'Terza', topics: 'Assonometrie; **energia** e sue fonti, elettricità; macchine e trasporti; dati, intelligenza artificiale e robot.', pencil: "all'esame entra nel colloquio" }
				]
			},
			[
				{ kind: 'figure', tilt: -1.5 },
				{
					kind: 'table',
					heading: 'Le scale',
					rows: [
						['1 : 1', 'il disegno è grande come il vero'],
						['1 : 2', 'è la metà del vero'],
						['1 : 100', '1 cm sul foglio è 1 m nella realtà'],
						['2 : 1', 'è il doppio: si usa per i pezzi piccoli']
					],
					pencil: 'il primo numero è il disegno, il secondo la realtà'
				}
			],
			[
				{
					kind: 'checklist',
					heading: 'Prima di consegnare la tavola',
					items: [
						'Squadratura e **cartiglio** con nome, classe, titolo e scala.',
						'Linee di costruzione ==sottili e leggere==, contorni in vista spessi.',
						'Misure controllate con il righello, **non a occhio**.'
					]
				},
				{ kind: 'postit', heading: 'Proiezioni', color: 'pink', tilt: -3, text: 'La **pianta** va sotto il prospetto, il **fianco** alla sua destra. Se sbagli il posto, sbagli la tavola.' }
			]
		]
	},

	'university/analisi-1': {
		title: 'Analisi matematica I',
		scribble: 'il primo esame',
		intro: "Il percorso tipico del primo esame di analisi. Rispetto alle superiori cambia ==il livello di rigore==: definizioni con epsilon e delta, teoremi con **ipotesi precise, da enunciare e dimostrare**.",
		figure: {
			alt: 'La definizione di limite: una curva, una fascia rossa larga 2ε attorno a L sull’asse y e una fascia azzurra larga 2δ attorno a x₀ sull’asse x.',
			caption: 'fissi la fascia di L, trovi quella di x₀'
		},
		blocks: [
			[
				{
					kind: 'boxed',
					heading: 'La definizione da sapere',
					numbered: false,
					lines: ['lim f(x) = L  per x → x₀  se', 'per ogni ε > 0 esiste δ > 0 tale che', '0 < |x − x₀| < δ  ⇒  |f(x) − L| < ε'],
					pencil: 'epsilon prima, delta dopo'
				},
				{ kind: 'figure', tilt: 1.5 }
			],
			{
				kind: 'route',
				heading: 'Il programma',
				style: 'timeline',
				stops: [
					{ label: 'Successioni', topics: 'Successioni di numeri reali, serie numeriche e criteri di convergenza.' },
					{ label: 'Limiti e derivate', topics: '**Limite di funzione**, regole e teoremi sulle derivate.' },
					{ label: 'Integrali', topics: 'Integrali definiti e indefiniti, teorema fondamentale del calcolo.' },
					{ label: 'Equazioni differenziali', topics: 'Del primo e del secondo ordine.' }
				]
			},
			{
				kind: 'checklist',
				heading: "Verso l'esame",
				items: [
					'Per lo scritto: esercizi **a tempo**, senza guardare le soluzioni finché non hai finito.',
					"Per l'orale: per ogni teorema ==ipotesi, tesi e schema della dimostrazione== su un foglio.",
					'Chiediti **perché serve ogni ipotesi**, e collega i capitoli tra loro.'
				]
			},
			{ kind: 'arrows', heading: 'Prima di iniziare', items: ['Il triennio delle superiori: **funzioni, limiti, derivate, integrali**.', 'Trigonometria, esponenziali e logaritmi.', 'Polinomi e disequazioni, per domini e segni.'] }
		]
	},

	'university/analisi-2': {
		title: 'Analisi matematica II',
		scribble: 'il calcolo in più variabili',
		intro: 'Tre capitoli che ==portano gli integrali in più variabili== e mostrano come approssimare una funzione con polinomi. Ogni lezione parte **dall’idea geometrica**: un volume, una massa, un’area.',
		figure: {
			alt: 'Il dominio D tra la parabola y = x² e la retta y = x, colorato, con una sezione verticale rossa in corrispondenza di x.',
			caption: 'prima il dominio, poi i conti'
		},
		blocks: [
			[
				{
					kind: 'route',
					heading: 'Il percorso',
					style: 'path',
					stops: [
						{ label: 'Integrali doppi', topics: 'In coordinate cartesiane e polari.' },
						{ label: 'Integrali tripli', topics: 'Con il cambio di coordinate: cilindriche e sferiche.' },
						{ label: 'Taylor', topics: 'Serie di Taylor e Maclaurin.', pencil: 'si combinano sviluppi noti' }
					]
				},
				{ kind: 'figure', tilt: -2 }
			],
			[
				{
					kind: 'mistakes',
					heading: 'Dove si perde il punto',
					items: [
						{ wrong: 'estremi di integrazione presi a occhio', right: 'scrivi le disuguaglianze che descrivono il dominio' },
						{ wrong: 'dx dy = dρ dθ', right: 'manca lo jacobiano: dx dy = ρ dρ dθ' }
					]
				},
				{ kind: 'postit', heading: 'A memoria', tilt: 2, text: 'Gli sviluppi delle funzioni elementari: quasi ogni esercizio si risolve **componendoli**, non derivando da capo.' }
			]
		]
	},

	'university/fisica-1': {
		title: 'Fisica I',
		scribble: 'meccanica classica',
		intro: 'La meccanica del primo anno, ==con il calcolo differenziale==: la velocità è una derivata, il lavoro un integrale, le leggi del moto **equazioni differenziali**.',
		figure: {
			alt: 'La traiettoria parabolica di un proiettile; in due punti la velocità in rosso e le sue componenti: v_x sempre uguale, v_y che cambia verso.',
			caption: 'v_x non cambia mai; v_y sì'
		},
		blocks: [
			[
				{ kind: 'figure', tilt: 1 },
				{ kind: 'card', heading: "Domanda d'orale", tilt: -1.5, question: "Quando si conserva l'energia meccanica?", answer: 'Quando lavorano solo forze conservative. Con l’attrito una parte diventa calore.' }
			],
			{
				kind: 'route',
				heading: 'Il percorso',
				style: 'timeline',
				stops: [
					{ label: 'Cinematica', topics: 'Moto in una dimensione, moto di un proiettile.' },
					{ label: 'Dinamica', topics: 'I principi di Newton, i sistemi di riferimento inerziali.' },
					{ label: 'Energia', topics: 'Lavoro di una forza, **conservazione dell’energia**.' },
					{ label: 'Corpo rigido', topics: "Moto rotazionale, momento d'inerzia." }
				]
			},
			{
				kind: 'checklist',
				heading: "Verso l'esame",
				items: [
					'Un metodo fisso: ==disegno, riferimento, forze o energie, equazioni==, poi i conti.',
					'Alla fine controlla **unità di misura e casi limite**.',
					"Per l'orale: i teoremi di conservazione **con le ipotesi** sotto cui valgono."
				]
			},
			{ kind: 'scribble', text: "all'esame gli errori nascono quasi sempre nell'impostazione, non nei conti" }
		]
	},

	'university/fisica-2': {
		title: 'Fisica II',
		scribble: 'campi, gas e luce',
		intro: 'Tre capitoli del secondo corso di fisica, dalle leggi sperimentali ==alla forma con campi, flussi e circuitazioni==.',
		figure: {
			alt: 'Un ciclo sul piano pressione-volume: un’isobara da A a B, un’isocora da B a C e un’isoterma da C ad A; l’area rossa racchiusa è il lavoro L.',
			caption: "il lavoro del ciclo è l'area dentro"
		},
		blocks: [
			{
				kind: 'route',
				heading: 'Tre capitoli',
				style: 'areas',
				stops: [
					{ label: 'Termodinamica', topics: 'Gas perfetti e **principi della termodinamica**.', pencil: 'leggi bene il grafico p–V' },
					{ label: 'Elettromagnetismo', topics: 'Dalla legge di Coulomb e il campo elettrico fino a Faraday e all’induzione.' },
					{ label: 'Ottica', topics: 'La propagazione delle onde luminose.' }
				]
			},
			[
				{ kind: 'figure', tilt: -1.5 },
				{
					kind: 'table',
					heading: 'Stato o processo?',
					rows: [
						['p, V, T', 'grandezze di stato: dipendono solo da dove sei'],
						['U, S', 'energia interna ed entropia: anche loro di stato'],
						['L, Q', 'lavoro e calore: dipendono dalla strada fatta']
					]
				}
			],
			{
				kind: 'checklist',
				heading: "Verso l'esame",
				items: [
					'In elettromagnetismo **disegna la configurazione** e cerca le simmetrie.',
					'Scegli ==la superficie o il percorso== su cui applicare la legge.',
					'Nel formulario tieni le leggi di Maxwell **in forma integrale**.'
				]
			}
		]
	},

	'university/fondamenti-informatica': {
		title: 'Fondamenti di Informatica',
		scribble: 'la logica digitale',
		intro: 'La logica digitale che apre i corsi di informatica e ingegneria. Ogni lezione passa ==da una rappresentazione all’altra==: **tavola, espressione, circuito**.',
		figure: {
			alt: 'Una porta AND con ingressi A e B e uscita A·B, accanto alla sua tavola di verità: l’uscita vale 1 solo quando A e B valgono 1.',
			caption: 'la stessa funzione, due modi di scriverla'
		},
		blocks: [
			{ kind: 'figure', tilt: -1 },
			[
				{
					kind: 'route',
					heading: 'Il percorso',
					style: 'path',
					stops: [
						{ label: 'Booleani', topics: 'Variabili e funzioni booleane, tavole di verità.' },
						{ label: 'Porte logiche', topics: 'AND, OR, NOT e i circuiti combinatori elementari.' },
						{ label: 'Memorie', topics: 'I flip-flop, primo passo verso le reti sequenziali.', pencil: 'ogni capitolo usa il precedente' }
					]
				},
				{ kind: 'card', heading: 'Esercizio lampo', tilt: 2, question: 'Quanto vale A + A · B?', answer: 'A: è la legge di assorbimento.' }
			],
			{
				kind: 'checklist',
				heading: "Verso l'esame",
				items: [
					'Tavole, semplificazioni e circuiti: ==attività meccaniche, da fare molte volte==.',
					'Rifai gli esempi e poi **inventa varianti**: cambia una riga o un operatore.',
					'Per i flip-flop **disegna il diagramma temporale** a ogni fronte di clock.'
				]
			},
			{ kind: 'arrows', heading: 'Aiuta sapere', items: ['Nessun prerequisito universitario.', 'Insiemi e **connettivi logici**, dalla matematica per le superiori.', 'Hardware, software e algoritmi, dall’informatica per le superiori.'] }
		]
	}
};

export interface SubjectGuide extends SubjectGuideContent {
	image: { src: string; width: number; height: number } | null;
}

export function subjectCopy(levelSlug: string | undefined, subjectSlug: string): SubjectGuide | null {
	if (!levelSlug) return null;
	const guide = guides[`${levelSlug}/${subjectSlug}`];
	if (!guide) return null;
	const name = `${levelSlug}-${subjectSlug}`;
	const size = GUIDE_FIGURES[name];
	return { ...guide, image: size ? { src: `/guide/${name}.svg`, width: size[0], height: size[1] } : null };
}
