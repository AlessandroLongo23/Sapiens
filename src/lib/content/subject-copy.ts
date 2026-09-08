/**
 * Editorial copy for subject index pages. Each text is written for
 * one subject at one level and describes only the chapters that exist in the
 * database for it. Keyed by `<level slug>/<subject slug>` (database slugs).
 *
 * The owner can move these texts into the `description` column or a CMS later;
 * until then this file is the single place to edit them.
 */

export interface GuideSection {
	heading: string;
	paragraphs: string[];
}

export interface SubjectGuideContent {
	sections: GuideSection[];
}

const guides: Record<string, SubjectGuideContent> = {
	'high_school/math': {
		sections: [
			{
				heading: 'Cosa trovi in Matematica per le superiori',
				paragraphs: [
					"Il percorso di matematica per la scuola superiore segue l'ordine in cui gli argomenti si incontrano in classe. Si parte da insiemi e logica, il linguaggio con cui è scritto tutto il resto, e si attraversano i numeri naturali, interi, razionali e reali, ognuno con le sue operazioni e le sue potenze. Seguono monomi e polinomi, poi equazioni, disequazioni e sistemi, che sono il cuore del biennio.",
					"La seconda parte copre la geometria analitica della retta, la trigonometria con i teoremi sui triangoli e la geometria solida. L'ultima parte è quella del triennio: funzioni, limiti, derivate, integrali e probabilità, gli argomenti che tornano nella seconda prova di maturità dello scientifico.",
					"Ogni capitolo è spezzato in lezioni corte, una per idea. Nel capitolo sui numeri naturali, per esempio, operazioni, MCD e MCM e potenze sono tre lezioni distinte. Ogni lezione ha una scheda di teoria, un formulario, esercizi interattivi e flashcard; dove una sezione non è ancora pronta lo trovi scritto in pagina."
				]
			},
			{
				heading: 'Come prepararsi a una verifica',
				paragraphs: [
					"Per una verifica su un capitolo preciso leggi le lezioni nell'ordine in cui compaiono: ognuna usa solo quello che viene prima. Alla prima lettura non fermarti sui dettagli, arriva in fondo. Alla seconda copri gli esempi svolti e prova a rifarli da solo, confrontando poi passaggio per passaggio.",
					"Gli esercizi interattivi, dove disponibili, danno la correzione subito: usali per capire quale tipo di errore ripeti, non per collezionare risposte giuste. Il formulario è utile come ripasso finale la sera prima, quando la teoria è già chiara; da solo non basta, perché nelle verifiche si chiede di applicare, non di ricordare.",
					"Se ti stai preparando alla maturità, i capitoli su funzioni, limiti, derivate e integrali coprono la parte di analisi; geometria analitica e trigonometria coprono gli strumenti che servono nei problemi. Parti dai capitoli in cui hai più dubbi e torna alle lezioni precedenti ogni volta che un passaggio non torna."
				]
			},
			{
				heading: 'Cosa conviene sapere prima',
				paragraphs: [
					"Per i primi capitoli bastano le basi delle medie: le quattro operazioni, le frazioni, le percentuali e un po' di geometria piana, tutte disponibili nella sezione per la scuola media. Per monomi, polinomi ed equazioni servono soprattutto le proprietà delle potenze e la sicurezza con i numeri razionali, che qui trovi nei capitoli precedenti.",
					"Per limiti, derivate e integrali serve una buona familiarità con le funzioni e con l'equazione della retta. Se uno di questi prerequisiti ti manca, segui il collegamento al capitolo corrispondente prima di andare avanti: recuperare una base costa meno che rileggere tre volte una dimostrazione."
				]
			}
		]
	},

	'high_school/physics': {
		sections: [
			{
				heading: 'Cosa trovi in Fisica per le superiori',
				paragraphs: [
					"La fisica delle superiori parte dalla meccanica: cinematica, con velocità, accelerazione e i moti uniforme e uniformemente accelerato; dinamica, con le leggi di Newton e le forze più comuni come peso, attrito e tensione; lavoro ed energia, con potenza ed energia cinetica e potenziale. È la parte che occupa quasi tutto il primo biennio ed è anche quella su cui si costruisce il resto.",
					"Il percorso continua con la termodinamica (calore, temperatura, leggi dei gas e i primi due principi), le onde meccaniche e l'acustica, l'ottica con riflessione e rifrazione, e poi elettrostatica ed elettromagnetismo: carica e campo elettrico, potenziale, campi magnetici, legge di Ampère, induzione e legge di Faraday.",
					"L'ultima parte raccoglie i temi del quinto anno e dei licei che li affrontano: meccanica razionale, modelli atomici, relatività ristretta, quantizzazione dell'energia, radioattività e cicli di vita delle stelle. Ogni capitolo è diviso in lezioni brevi, con teoria, formulario, esercizi e flashcard; le sezioni ancora in scrittura sono indicate in pagina."
				]
			},
			{
				heading: 'Come prepararsi a una verifica di fisica',
				paragraphs: [
					"Le verifiche di fisica premiano chi sa impostare un problema, e per impostarlo serve prima di tutto capire quali grandezze entrano in gioco e quali leggi le collegano. Leggi la teoria della lezione facendo attenzione alle definizioni e alle unità di misura, poi rifai gli esempi svolti da solo, scrivendo per esteso i dati, le incognite e la formula prima di sostituire i numeri.",
					"Il formulario serve per il ripasso rapido, ma controlla sempre da dove viene ogni formula: nelle verifiche si chiede spesso di ricavarne una a partire da un'altra, e chi le ha imparate a memoria si blocca. Con gli esercizi interattivi, quando disponibili, verifica se l'errore è di concetto o di calcolo: si correggono in modo diverso.",
					"Per l'esame di maturità i capitoli di elettromagnetismo e quelli di fisica moderna sono i più richiesti nei licei scientifici; conviene ripassarli insieme alla meccanica, perché le domande collegano spesso più argomenti."
				]
			},
			{
				heading: 'Cosa conviene sapere prima',
				paragraphs: [
					"Per cinematica e dinamica bastano le proporzioni, le equazioni di primo grado e un uso sicuro delle potenze di dieci. Lavoro ed energia usano anche le equazioni di secondo grado. Onde, ottica ed elettromagnetismo si appoggiano alla trigonometria di base (seno, coseno e i teoremi sui triangoli), mentre per i capitoli di fisica moderna aiuta conoscere le funzioni esponenziali.",
					"Tutti questi argomenti sono nella sezione di matematica per le superiori: se un passaggio matematico ti frena, recuperalo lì prima di riprendere la fisica."
				]
			}
		]
	},

	'high_school/computer-science': {
		sections: [
			{
				heading: 'Cosa trovi in Informatica per le superiori',
				paragraphs: [
					"Il materiale di informatica per le superiori copre le basi che si incontrano nel biennio e negli istituti che la insegnano come materia autonoma. Si parte da cosa sono hardware e software e da come si descrive un procedimento con algoritmi e pseudocodice; seguono i sistemi operativi, con processi, thread, memoria e file system, e poi internet e il web, con le reti, il protocollo HTTP e i primi elementi di HTML.",
					"Una parte è dedicata alla sicurezza informatica (virus, malware, password sicure e cifratura) e una alla programmazione visuale a blocchi con Scratch e ai diagrammi di flusso, che sono il modo più diretto per imparare a ragionare per passi prima di scrivere codice.",
					"Chiudono il percorso gli strumenti di lavoro quotidiano: elaboratore di testi, foglio di calcolo e presentazioni, i formati per immagini, audio e video con le nozioni di editing, e la collaborazione digitale attraverso servizi cloud e strumenti condivisi. Ogni capitolo è spezzato in lezioni brevi con teoria, formulario, esercizi e flashcard; dove una sezione non è ancora pronta lo trovi indicato in pagina."
				]
			},
			{
				heading: 'Come usare il materiale per verifiche e prove pratiche',
				paragraphs: [
					"In informatica le verifiche sono spesso miste: domande di teoria e una parte pratica al computer. Per la teoria leggi la lezione e prova a spiegare ogni concetto con un esempio concreto (un processo è come..., un pacchetto viaggia così...): se non riesci a trovarne uno, il concetto non è ancora chiaro.",
					"Per la parte pratica non basta leggere: apri il programma di cui parla la lezione e ripeti i passaggi mentre li leggi. Per gli algoritmi, scrivi lo pseudocodice a mano e seguilo con un esempio numerico, riga per riga, come farebbe la macchina. Il formulario raccoglie comandi, sigle e definizioni da ripassare prima della prova."
				]
			},
			{
				heading: 'Cosa conviene sapere prima',
				paragraphs: [
					"Non servono prerequisiti particolari: il materiale parte da zero. Aiuta avere confidenza con l'uso di un computer e con la logica elementare, che si incontra anche nel capitolo su insiemi e logica di matematica. Per il foglio di calcolo tornano utili percentuali e proporzioni, disponibili nella sezione di matematica."
				]
			}
		]
	},

	'high_school/chemistry': {
		sections: [
			{
				heading: 'Cosa trovi in Chimica per le superiori',
				paragraphs: [
					"La chimica delle superiori inizia dalla struttura dell'atomo, con protoni, neutroni ed elettroni, numero atomico e numero di massa, e dalla tavola periodica, con gruppi, periodi e proprietà periodiche come raggio ed energia di ionizzazione. Su queste basi si costruiscono i legami chimici, ionico e covalente, e la stechiometria: il concetto di mole e il bilanciamento delle reazioni.",
					"Seguono le reazioni redox con il numero di ossidazione, la chimica organica con idrocarburi e gruppi funzionali, e la chimica fisica con la legge dei gas ideali. Equilibrio chimico, cinetica ed elettrochimica (come funziona una pila) sono i capitoli del triennio, insieme alla chimica analitica con le titolazioni acido-base.",
					"Chiudono il percorso tre capitoli di raccordo con altre discipline: biochimica, con le macromolecole del vivente; chimica ambientale, con gli inquinanti in aria, acqua e suolo; chimica industriale, con i grandi processi produttivi. Ogni capitolo è diviso in lezioni con teoria, formulario, esercizi e flashcard; le sezioni ancora in scrittura sono indicate in pagina."
				]
			},
			{
				heading: 'Come prepararsi a una verifica di chimica',
				paragraphs: [
					"In chimica le verifiche mescolano domande di teoria e problemi numerici, e i problemi si risolvono quasi tutti con lo stesso metodo: scrivere la reazione bilanciata, passare a moli, usare i rapporti stechiometrici, tornare a grammi o litri. Se il capitolo sulla stechiometria è chiaro, buona parte degli esercizi successivi lo diventa.",
					"Studia ogni lezione partendo dalle definizioni e dai nomi: in chimica il lessico è metà del lavoro. Rifai gli esempi svolti da solo, poi usa gli esercizi interattivi dove disponibili per verificare la parte di calcolo. Il formulario raccoglie costanti, formule e regole (per esempio le regole per il numero di ossidazione) da tenere a portata di mano durante il ripasso."
				]
			},
			{
				heading: 'Cosa conviene sapere prima',
				paragraphs: [
					"Bastano le proporzioni, le percentuali, le potenze di dieci e le equazioni di primo grado, tutte nella sezione di matematica. Per l'equilibrio e la cinetica servono anche le equazioni di secondo grado e un'idea di cosa sia una funzione. Chi arriva dalle medie trova utile ripassare la differenza tra massa e volume e gli stati della materia prima di iniziare dalla struttura dell'atomo."
				]
			}
		]
	},

	'middle_school/math': {
		sections: [
			{
				heading: 'Cosa trovi in Matematica per le medie',
				paragraphs: [
					"Il materiale di matematica per la scuola media copre quattro capitoli che stanno alla base di tutto quello che viene dopo. L'aritmetica riprende il sistema di numerazione decimale, le quattro operazioni con le loro proprietà, le espressioni, le potenze e la radice quadrata. Frazioni e decimali spiegano frazioni proprie, improprie e apparenti, le frazioni equivalenti, le operazioni tra frazioni e il passaggio da frazione a numero decimale.",
					"Il capitolo sulle percentuali mostra come calcolarle e come usarle nei problemi, dagli sconti agli aumenti. La geometria piana presenta punto, retta e piano, gli angoli, i triangoli con le loro proprietà, i quadrilateri e il cerchio con le sue parti.",
					"Ogni capitolo è diviso in lezioni brevi, una per argomento, così da poter studiare solo quello che serve per il compito della settimana. Ogni lezione ha una scheda di teoria, un formulario, esercizi e flashcard; le sezioni ancora in preparazione sono segnalate in pagina."
				]
			},
			{
				heading: 'Come usare il materiale per i compiti e le verifiche',
				paragraphs: [
					"Leggi la teoria della lezione con carta e penna vicino e rifai ogni esempio prima di andare avanti: alle medie la matematica si impara facendo, e leggere soltanto dà l'impressione di aver capito. Se un passaggio non torna, torna alla lezione precedente, che contiene quello che serve.",
					"Per una verifica sulle frazioni o sulle percentuali fai gli esercizi interattivi, dove disponibili, e conta gli errori dello stesso tipo: se sbagli sempre nello stesso punto, rileggi solo quella parte di teoria. Il formulario serve per ripassare le formule di aree e perimetri e le regole delle operazioni la sera prima.",
					"Anche i genitori possono usare queste pagine per rivedere un argomento e seguire i compiti: le spiegazioni partono sempre da un esempio concreto."
				]
			},
			{
				heading: 'Cosa conviene sapere prima',
				paragraphs: [
					"Basta quello che si impara alle elementari: contare, fare le quattro operazioni in colonna e conoscere le figure geometriche più comuni. Il capitolo di aritmetica riparte comunque dal sistema decimale, quindi si può iniziare da lì anche con qualche lacuna. Chi finisce le medie con questi quattro capitoli chiari parte bene con il materiale per le superiori, che inizia da insiemi e numeri naturali."
				]
			}
		]
	},

	'university/analisi-1': {
		sections: [
			{
				heading: 'Cosa trovi in Analisi matematica I',
				paragraphs: [
					"Il materiale di Analisi I segue la struttura tipica del primo esame di analisi nei corsi di laurea scientifici e di ingegneria. Si parte dalle successioni di numeri reali e dalle serie numeriche con i criteri di convergenza, poi si passa alla definizione di limite di funzione, alle regole e ai teoremi sulle derivate, agli integrali definiti e indefiniti con il teorema fondamentale del calcolo, e infine alle equazioni differenziali del primo e del secondo ordine.",
					"Rispetto alle superiori cambia il livello di rigore: le definizioni sono date con epsilon e delta, i teoremi hanno ipotesi precise e vanno saputi enunciare e dimostrare. Le lezioni sono organizzate per accompagnare questo passaggio: definizione, enunciato, dimostrazione, esempi e controesempi. Ogni lezione ha teoria, formulario, esercizi e flashcard; le sezioni ancora in scrittura sono indicate in pagina."
				]
			},
			{
				heading: "Come prepararsi all'esame",
				paragraphs: [
					"L'esame di Analisi I ha quasi sempre una prova scritta di esercizi e una prova orale su definizioni, enunciati e dimostrazioni. Per lo scritto conta la pratica: studia la lezione, rifai gli esempi e poi risolvi esercizi a tempo, senza guardare le soluzioni finché non hai finito. Per l'orale la strategia è diversa: per ogni teorema scrivi su un foglio ipotesi, tesi e schema della dimostrazione, e chiediti perché ogni ipotesi serve.",
					"Il formulario raccoglie limiti notevoli, derivate e integrali elementari e le forme standard delle equazioni differenziali: va usato per il ripasso finale, dopo aver capito da dove viene ogni formula. Cerca di collegare i capitoli tra loro, perché all'orale le domande saltano facilmente dalle successioni ai limiti di funzione e dalle derivate agli integrali."
				]
			},
			{
				heading: 'Cosa conviene sapere prima',
				paragraphs: [
					"Servono con sicurezza gli argomenti del triennio delle superiori: funzioni e loro proprietà, limiti, derivate e integrali a livello introduttivo, trigonometria, esponenziali e logaritmi. Tutti sono trattati nella sezione di matematica per le superiori, che è il posto giusto da cui ripartire se una base manca. Anche l'algebra dei polinomi e delle disequazioni torna in continuazione nello studio dei domini e dei segni."
				]
			}
		]
	},

	'university/analisi-2': {
		sections: [
			{
				heading: 'Cosa trovi in Analisi matematica II',
				paragraphs: [
					"Il materiale di Analisi II raccoglie tre capitoli del secondo corso di analisi: gli integrali doppi in coordinate cartesiane e polari, gli integrali tripli con il cambio di coordinate, e le serie di Taylor e Maclaurin. Sono gli argomenti che estendono il calcolo integrale a più variabili e mostrano come approssimare una funzione con polinomi.",
					"Le lezioni presentano prima l'idea geometrica (un volume, una massa, un'area), poi la definizione formale e le tecniche di calcolo: ordine di integrazione, descrizione del dominio, scelta delle coordinate. Ogni lezione ha teoria, formulario, esercizi e flashcard; le sezioni ancora in scrittura sono indicate in pagina."
				]
			},
			{
				heading: "Come prepararsi all'esame",
				paragraphs: [
					"Negli esercizi di Analisi II la difficoltà sta quasi sempre nella descrizione del dominio e nella scelta delle coordinate, non nel calcolo dell'integrale. Prima di integrare disegna il dominio, scrivi le disuguaglianze che lo descrivono e decidi in quale ordine integrare; solo dopo passa ai conti. Rifai gli esempi svolti seguendo questo schema finché non diventa automatico.",
					"Per le serie di Taylor impara a memoria gli sviluppi delle funzioni elementari, raccolti nel formulario, e allenati a combinarli: la maggior parte degli esercizi si risolve componendo sviluppi noti invece di derivare da capo. All'orale aspettati domande sul teorema del cambio di variabili e sul resto di Taylor: preparali con ipotesi, tesi e idea della dimostrazione."
				]
			},
			{
				heading: 'Cosa conviene sapere prima',
				paragraphs: [
					"È necessario avere superato o almeno studiato Analisi I: derivate, integrali in una variabile, successioni e serie numeriche sono usati in ogni lezione. Serve anche un po' di geometria analitica dello spazio (piani, sfere, cilindri) per descrivere i domini, e le funzioni trigonometriche per le coordinate polari, cilindriche e sferiche."
				]
			}
		]
	},

	'university/fisica-1': {
		sections: [
			{
				heading: 'Cosa trovi in Fisica I',
				paragraphs: [
					"Il materiale di Fisica I copre la meccanica classica del primo anno: la cinematica del punto materiale, con il moto in una dimensione e il moto di un proiettile; la dinamica del punto, con i principi di Newton e i sistemi di riferimento inerziali; lavoro ed energia, con il lavoro di una forza e la conservazione dell'energia; e la meccanica del corpo rigido, con il moto rotazionale e il momento d'inerzia.",
					"Rispetto alla fisica delle superiori il trattamento usa il calcolo differenziale: velocità e accelerazione sono derivate, il lavoro è un integrale, le leggi del moto sono equazioni differenziali. Le lezioni introducono ogni concetto in questa forma e lo collegano alla versione già nota dalle superiori. Ogni lezione ha teoria, formulario, esercizi e flashcard; le sezioni ancora in scrittura sono indicate in pagina."
				]
			},
			{
				heading: "Come prepararsi all'esame",
				paragraphs: [
					"Gli esercizi di Fisica I si risolvono con un metodo fisso: disegnare il sistema, scegliere il riferimento, scrivere le forze o le energie in gioco, impostare le equazioni, risolvere e controllare le unità di misura e i casi limite. Rifai gli esempi svolti seguendo questi passaggi per esteso, anche quando sembrano ovvi: all'esame gli errori nascono quasi sempre nell'impostazione.",
					"Per l'orale prepara le definizioni e i teoremi di conservazione (energia, quantità di moto, momento angolare) con le ipotesi sotto cui valgono. Il formulario raccoglie le leggi del moto, le espressioni delle energie e i momenti d'inerzia dei corpi più comuni: usalo per il ripasso, non al posto della derivazione."
				]
			},
			{
				heading: 'Cosa conviene sapere prima',
				paragraphs: [
					"Servono derivate e integrali di base (Analisi I, almeno la prima parte), i vettori con prodotto scalare e vettoriale, e la trigonometria. È utile avere presente la fisica delle superiori, in particolare cinematica, dinamica e lavoro ed energia, che qui vengono riprese con più strumenti matematici."
				]
			}
		]
	},

	'university/fisica-2': {
		sections: [
			{
				heading: 'Cosa trovi in Fisica II',
				paragraphs: [
					"Il materiale di Fisica II raccoglie tre capitoli del secondo corso di fisica: la termodinamica, con le leggi dei gas perfetti e i principi della termodinamica; l'elettromagnetismo, dalla legge di Coulomb e il campo elettrico fino alla legge di Faraday e all'induzione; l'ottica, con la propagazione delle onde luminose.",
					"Le lezioni introducono i concetti a partire dalle leggi sperimentali e li portano alla forma matematica usata all'università, con campi, flussi e circuitazioni. Ogni lezione ha teoria, formulario, esercizi e flashcard; le sezioni ancora in scrittura sono indicate in pagina."
				]
			},
			{
				heading: "Come prepararsi all'esame",
				paragraphs: [
					"In elettromagnetismo la parte più delicata è la geometria: prima di calcolare un campo o un flusso disegna la configurazione, individua le simmetrie e scegli la superficie o il percorso su cui applicare la legge. Rifai gli esempi svolti con questo schema, e per ogni legge chiediti in quali condizioni si può usare in forma semplificata.",
					"In termodinamica allenati a distinguere le grandezze di stato dalle grandezze di processo e a rappresentare le trasformazioni sul piano pressione-volume: molti esercizi si riducono a leggere correttamente un grafico. Il formulario raccoglie le leggi dei gas, le espressioni di lavoro e calore per le trasformazioni principali e le leggi dell'elettromagnetismo in forma integrale."
				]
			},
			{
				heading: 'Cosa conviene sapere prima',
				paragraphs: [
					"Sono necessari Fisica I e gli integrali di Analisi I; per gli integrali di flusso e di linea aiutano gli integrali doppi e tripli di Analisi II. Dalla fisica delle superiori conviene ripassare termodinamica, elettrostatica ed elettromagnetismo, che qui vengono ripresi con più formalismo."
				]
			}
		]
	},

	'university/fondamenti-informatica': {
		sections: [
			{
				heading: 'Cosa trovi in Fondamenti di Informatica',
				paragraphs: [
					"Il materiale di Fondamenti di Informatica copre la parte di logica digitale che apre i corsi di informatica e ingegneria: le variabili booleane, le funzioni booleane con le tavole di verità, le porte logiche di base (AND, OR, NOT), i circuiti combinatori elementari e le memorie di base con i flip-flop, primo passo verso le reti sequenziali.",
					"I cinque capitoli sono in ordine di dipendenza: ognuno usa il precedente. Le lezioni presentano il concetto, il modo di rappresentarlo (tavola, espressione, schema circuitale) e le regole per passare da una rappresentazione all'altra. Ogni lezione ha teoria, formulario, esercizi e flashcard; le sezioni ancora in scrittura sono indicate in pagina."
				]
			},
			{
				heading: "Come prepararsi all'esame",
				paragraphs: [
					"Gli esercizi tipici chiedono di costruire una tavola di verità da un'espressione, di semplificare una funzione booleana o di disegnare il circuito corrispondente. Sono attività meccaniche, ma vanno fatte molte volte per diventare veloci: rifai gli esempi svolti e poi inventa varianti cambiando una riga della tavola o un operatore.",
					"Per la parte sulle reti sequenziali disegna sempre il diagramma temporale dei segnali: è il modo più sicuro per capire cosa fa un flip-flop a ogni fronte di clock. Il formulario raccoglie le identità dell'algebra booleana e le tabelle caratteristiche dei flip-flop, da ripassare prima della prova."
				]
			},
			{
				heading: 'Cosa conviene sapere prima',
				paragraphs: [
					"Non servono prerequisiti universitari. Aiuta il capitolo su insiemi e logica della matematica per le superiori, perché le operazioni tra insiemi e i connettivi logici sono le stesse idee delle funzioni booleane, e il capitolo di informatica per le superiori su hardware, software e algoritmi per il contesto generale."
				]
			}
		]
	}
};

export function subjectCopy(levelSlug: string | undefined, subjectSlug: string): SubjectGuideContent | null {
	if (!levelSlug) return null;
	return guides[`${levelSlug}/${subjectSlug}`] ?? null;
}
