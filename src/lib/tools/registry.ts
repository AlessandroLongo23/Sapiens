import type { ToolCategory, ToolMeta } from './types';

/** Public path of the tools section. */
export const TOOLS_ROOT = '/strumenti';

/**
 * Every tool, in the order the index shows them within a category. The page of a tool is `/strumenti/<slug>`, its
 * inputs are a client component in src/components/tools/registry.tsx, its article `src/content/strumenti/<slug>.md`.
 */
export const TOOLS: ToolMeta[] = [
	{
		slug: 'calcolo-percentuale',
		title: 'Calcolo percentuale',
		lead: 'La percentuale di un numero, che percentuale è una parte, la variazione percentuale, sconti e aumenti. Con i passaggi.',
		description: 'Calcola la percentuale di un numero, che percentuale è una parte del totale, la variazione percentuale, sconti e aumenti, con tutti i passaggi.',
		category: 'numeri',
		lessons: ['high_school/math/numeri-razionali/numeri-razionali-proporzioni'],
		related: ['calcolo-mcm', 'calcolo-mcd']
	},
	{
		slug: 'calcolo-mcm',
		title: 'Calcolo del mcm',
		lead: 'Il minimo comune multiplo di due o più numeri, con la scomposizione in fattori primi.',
		description: 'Calcola il minimo comune multiplo (mcm) di due o più numeri, con la scomposizione in fattori primi e tutti i passaggi spiegati.',
		category: 'numeri',
		lessons: ['high_school/math/numeri-naturali/numeri-naturali-mcm-mcd'],
		related: ['calcolo-mcd', 'calcolo-percentuale']
	},
	{
		slug: 'calcolo-mcd',
		title: 'Calcolo del MCD',
		lead: 'Il massimo comune divisore di due o più numeri, con la scomposizione in fattori primi.',
		description: 'Calcola il massimo comune divisore (MCD) di due o più numeri, con la scomposizione in fattori primi e tutti i passaggi spiegati.',
		category: 'numeri',
		lessons: ['high_school/math/numeri-naturali/numeri-naturali-mcm-mcd'],
		related: ['calcolo-mcm', 'calcolo-percentuale']
	},
	{
		slug: 'scomposizione-in-fattori-primi',
		title: 'Scomposizione in fattori primi',
		lead: 'Un numero intero scritto come prodotto di potenze di numeri primi, con la colonna delle divisioni.',
		description: 'Scomponi un numero in fattori primi con la colonna delle divisioni, le potenze e tutti i passaggi. Dice anche se il numero è primo.',
		category: 'numeri',
		lessons: ['high_school/math/numeri-naturali/numeri-naturali-divisibilita', 'high_school/math/numeri-naturali/numeri-naturali-mcm-mcd'],
		related: ['calcolo-mcm', 'calcolo-mcd', 'calcolo-radice-quadrata']
	},
	{
		slug: 'calcolatrice-frazioni',
		title: 'Calcolatrice di frazioni',
		lead: 'Somma, sottrazione, moltiplicazione e divisione tra frazioni, e la semplificazione ai minimi termini. Con i passaggi.',
		description: 'Calcola somma, differenza, prodotto e quoziente di due frazioni e semplifica una frazione ai minimi termini, con mcm, MCD e tutti i passaggi.',
		category: 'numeri',
		lessons: ['high_school/math/numeri-razionali/numeri-razionali-frazioni', 'high_school/math/numeri-razionali/numeri-razionali-operazioni'],
		related: ['calcolo-espressioni', 'calcolo-mcm', 'calcolo-mcd']
	},
	{
		slug: 'calcolo-espressioni',
		title: 'Calcolo di espressioni',
		lead: "Espressioni con numeri interi, decimali e frazioni, potenze e parentesi, risolte passo per passo nell'ordine giusto.",
		description: "Risolvi espressioni numeriche con frazioni, potenze e parentesi tonde, quadre e graffe, con tutti i passaggi nell'ordine delle operazioni.",
		category: 'numeri',
		lessons: ['high_school/math/numeri-naturali/numeri-naturali-operazioni', 'high_school/math/numeri-razionali/numeri-razionali-espressioni'],
		related: ['calcolatrice-frazioni', 'calcolo-mcm']
	},
	{
		slug: 'calcolo-potenze',
		title: 'Calcolo delle potenze',
		lead: 'La potenza di un intero, di un decimale o di una frazione, anche con esponente negativo o zero. Con i passaggi.',
		description: 'Calcola la potenza di un numero intero, decimale o di una frazione, anche con esponente negativo o zero, con risultato esatto e passaggi.',
		category: 'numeri',
		lessons: ['high_school/math/numeri-naturali/numeri-naturali-potenze', 'high_school/math/numeri-interi/numeri-interi-potenze', 'high_school/math/numeri-razionali/numeri-razionali-potenze'],
		related: ['calcolo-radice-quadrata', 'scomposizione-in-fattori-primi', 'calcolo-proporzioni']
	},
	{
		slug: 'calcolo-radice-quadrata',
		title: 'Calcolo della radice quadrata',
		lead: 'La radice quadrata o cubica di un numero intero: esatta, semplificata portando fuori i fattori, e in decimali.',
		description: 'Calcola la radice quadrata o cubica di un numero: risultato esatto, radicale semplificato come 6√2 e valore decimale, con i passaggi.',
		category: 'numeri',
		lessons: ['high_school/math/numeri-reali/numeri-reali-radici', 'high_school/math/numeri-reali/radicali-operazioni'],
		related: ['scomposizione-in-fattori-primi', 'calcolo-potenze']
	},
	{
		slug: 'calcolo-proporzioni',
		title: 'Calcolo delle proporzioni',
		lead: 'Il termine incognito di una proporzione a : b = c : d, con la proprietà fondamentale e il controllo.',
		description: 'Calcola il termine incognito di una proporzione a : b = c : d con la proprietà fondamentale, anche con decimali e frazioni, e i passaggi.',
		category: 'numeri',
		lessons: ['high_school/math/numeri-razionali/numeri-razionali-proporzioni'],
		related: ['calcolo-percentuale', 'calcolo-potenze']
	},
	{
		slug: 'equazioni-primo-grado',
		title: 'Equazioni di primo grado',
		lead: "Scrivi l'equazione e risolvila con i passaggi: parentesi, denominatori, casi impossibili e indeterminati.",
		description: 'Risolvi equazioni di primo grado con parentesi, frazioni e decimali, con tutti i passaggi e i casi impossibili e indeterminati.',
		category: 'algebra',
		lessons: ['high_school/math/equazioni-sistemi/equazioni-primo-grado'],
		related: ['equazioni-secondo-grado', 'calcolo-mcm']
	},
	{
		slug: 'equazioni-secondo-grado',
		title: 'Equazioni di secondo grado',
		lead: "Dai coefficienti o dall'equazione scritta per intero: discriminante, formula risolutiva, soluzioni esatte e approssimate.",
		description: 'Risolvi equazioni di secondo grado con il discriminante e la formula risolutiva: soluzioni esatte con i radicali, equazioni pure e spurie.',
		category: 'algebra',
		lessons: ['high_school/math/equazioni-di-secondo-grado/equazioni-secondo-grado'],
		related: ['equazioni-primo-grado']
	},
	{
		slug: 'area-perimetro-quadrato',
		title: 'Area e perimetro del quadrato',
		lead: 'Area, perimetro e diagonale del quadrato dal lato, dalla diagonale, dall’area o dal perimetro. Con i passaggi.',
		description: 'Calcola area, perimetro e diagonale del quadrato partendo dal lato, dalla diagonale, dall’area o dal perimetro, con disegno e passaggi.',
		category: 'geometria',
		lessons: ['high_school/math/geometria-piano-circonferenza/equivalenza-aree', 'high_school/math/geometria-piano-triangoli/geometria-quadrilateri'],
		related: ['area-perimetro-rettangolo', 'area-perimetro-rombo', 'teorema-di-pitagora']
	},
	{
		slug: 'area-perimetro-rettangolo',
		title: 'Area e perimetro del rettangolo',
		lead: 'Area, perimetro e diagonale del rettangolo da base e altezza, base e diagonale, area o perimetro. Con i passaggi.',
		description: 'Calcola area, perimetro e diagonale del rettangolo da base e altezza, da base e diagonale, dall’area o dal perimetro, con i passaggi.',
		category: 'geometria',
		lessons: ['high_school/math/geometria-piano-circonferenza/equivalenza-aree', 'high_school/math/geometria-piano-triangoli/geometria-quadrilateri'],
		related: ['area-perimetro-quadrato', 'area-perimetro-parallelogramma', 'teorema-di-pitagora']
	},
	{
		slug: 'area-perimetro-triangolo',
		title: 'Area e perimetro del triangolo',
		lead: 'Area da base e altezza, perimetro dai lati, formula di Erone dai tre lati e triangolo equilatero. Con i passaggi.',
		description: 'Calcola area e perimetro del triangolo: base e altezza, formula di Erone dai tre lati, triangolo equilatero. Con disegno e passaggi.',
		category: 'geometria',
		lessons: ['high_school/math/geometria-piano-circonferenza/equivalenza-aree', 'high_school/math/geometria-piano-triangoli/angoli-e-lati-dei-triangoli'],
		related: ['teorema-di-pitagora', 'area-perimetro-trapezio', 'area-perimetro-parallelogramma']
	},
	{
		slug: 'area-perimetro-trapezio',
		title: 'Area e perimetro del trapezio',
		lead: 'Area e perimetro del trapezio da basi e altezza, anche isoscele e rettangolo con il teorema di Pitagora. Con i passaggi.',
		description: 'Calcola area e perimetro del trapezio da basi e altezza; per il trapezio isoscele e rettangolo trova il lato obliquo con Pitagora.',
		category: 'geometria',
		lessons: ['high_school/math/geometria-piano-circonferenza/equivalenza-aree', 'high_school/math/geometria-piano-triangoli/geometria-quadrilateri'],
		related: ['area-perimetro-parallelogramma', 'area-perimetro-triangolo', 'teorema-di-pitagora']
	},
	{
		slug: 'area-perimetro-rombo',
		title: 'Area e perimetro del rombo',
		lead: 'Area e perimetro del rombo dalle diagonali, dal lato e da una diagonale, o da lato e altezza. Con i passaggi.',
		description: 'Calcola area, perimetro e lato del rombo dalle diagonali, oppure dal lato e da una diagonale o dall’altezza, con disegno e passaggi.',
		category: 'geometria',
		lessons: ['high_school/math/geometria-piano-circonferenza/equivalenza-aree', 'high_school/math/geometria-piano-triangoli/geometria-quadrilateri'],
		related: ['area-perimetro-quadrato', 'area-perimetro-parallelogramma', 'teorema-di-pitagora']
	},
	{
		slug: 'area-perimetro-parallelogramma',
		title: 'Area e perimetro del parallelogramma',
		lead: 'Area da base e altezza, perimetro con il lato obliquo, altezza dall’area. Con i passaggi.',
		description: 'Calcola area e perimetro del parallelogramma da base, altezza e lato obliquo, oppure l’altezza dall’area, con disegno e passaggi.',
		category: 'geometria',
		lessons: ['high_school/math/geometria-piano-circonferenza/equivalenza-aree', 'high_school/math/geometria-piano-triangoli/geometria-quadrilateri'],
		related: ['area-perimetro-rettangolo', 'area-perimetro-rombo', 'area-perimetro-trapezio']
	},
	{
		slug: 'area-circonferenza-cerchio',
		title: 'Area del cerchio e lunghezza della circonferenza',
		lead: 'Area, circonferenza, raggio e diametro da una sola misura, con π esatto e il valore decimale.',
		description: 'Calcola area del cerchio, circonferenza, raggio e diametro partendo da una sola misura, con π esatto (25π) e decimale, e i passaggi.',
		category: 'geometria',
		lessons: ['high_school/math/geometria-piano-circonferenza/circonferenza-lunghezza-area', 'high_school/math/geometria-piano-circonferenza/circonferenza-cerchio'],
		related: ['area-perimetro-quadrato', 'teorema-di-pitagora']
	},
	{
		slug: 'teorema-di-pitagora',
		title: 'Teorema di Pitagora',
		lead: 'L’ipotenusa dai cateti o un cateto dall’ipotenusa, con radicali semplificati, decimali e terne pitagoriche.',
		description: 'Calcola l’ipotenusa o un cateto con il teorema di Pitagora: risultato esatto (5√2) e decimale, terne pitagoriche e tutti i passaggi.',
		category: 'geometria',
		lessons: ['high_school/math/geometria-piano-circonferenza/teorema-di-pitagora'],
		related: ['area-perimetro-triangolo', 'area-perimetro-rettangolo', 'area-perimetro-rombo']
	},
	{
		slug: 'media-mediana-moda',
		title: 'Media, mediana e moda',
		lead: 'Media aritmetica, mediana, moda e campo di variazione di una lista di numeri, anche la media ponderata. Con i passaggi.',
		description: 'Calcola media, mediana, moda e campo di variazione di una lista di numeri, e la media ponderata, con i dati ordinati e tutti i passaggi.',
		category: 'statistica',
		lessons: ['high_school/math/statistica/statistica-medie', 'high_school/math/statistica/statistica-variabilita'],
		related: ['calcolo-media-voti', 'calcolo-percentuale']
	},
	{
		slug: 'gradi-radianti',
		title: 'Conversione da gradi a radianti',
		lead: 'Da gradi (anche in gradi, primi e secondi) a radianti e viceversa, con π esatto e il valore decimale.',
		description: 'Converti un angolo da gradi a radianti e da radianti a gradi, con π esatto (45° = π/4), gradi primi e secondi e tutti i passaggi.',
		category: 'trigonometria',
		lessons: ['high_school/math/goniometria/misura-angoli'],
		related: ['equivalenze', 'convertitore-temperatura']
	},
	{
		slug: 'equivalenze',
		title: 'Equivalenze',
		lead: "Lunghezze, masse, capacità, superfici, volumi e tempo da un'unità all'altra, con la scala delle unità e i passaggi.",
		description: 'Calcola le equivalenze di lunghezza, massa, capacità, superficie, volume e tempo, con la scala delle unità e la virgola spostata passo per passo.',
		category: 'conversioni',
		lessons: ['middle_school/math/mat-misure/mat-equivalenze', 'middle_school/math/mat-misure/mat-misure-tempo', 'high_school/physics/fis-grandezze/fis-grandezze-si'],
		related: ['convertitore-temperatura', 'gradi-radianti', 'convertitore-binario']
	},
	{
		slug: 'convertitore-temperatura',
		title: 'Conversione di temperatura: Celsius, Fahrenheit e Kelvin',
		lead: 'Da gradi Celsius a Fahrenheit e Kelvin, e viceversa, con le formule e i passaggi.',
		description: 'Converti una temperatura tra gradi Celsius, Fahrenheit e Kelvin, con le formule e tutti i passaggi spiegati.',
		category: 'conversioni',
		lessons: ['high_school/physics/fis-temperatura-calore/fis-temperatura', 'middle_school/science/sci-calore/sci-temperatura'],
		related: ['equivalenze', 'gradi-radianti']
	},
	{
		slug: 'convertitore-binario',
		title: 'Convertitore binario, decimale ed esadecimale',
		lead: 'Numeri interi tra le basi 2, 8, 10 e 16, con le divisioni successive, le potenze della base e i gruppi di bit.',
		description: 'Converti numeri tra binario, ottale, decimale ed esadecimale, con le divisioni successive, la somma delle potenze e tutti i passaggi.',
		category: 'informatica',
		lessons: ['high_school/computer-science/inf-sistemi-numerazione/inf-binario-decimale', 'high_school/computer-science/inf-sistemi-numerazione/inf-esadecimale', 'middle_school/math/aritmetica/mat-sistemi-numerazione'],
		related: ['equivalenze', 'calcolo-mcm']
	},
	{
		slug: 'calcolo-media-voti',
		title: 'Calcolo della media dei voti',
		lead: 'La media dei tuoi voti, anche con 6+, 6-, 6½ e 7/8, semplice o ponderata, e il voto che ti serve per arrivare alla media che vuoi.',
		description: 'Calcola la media dei voti di scuola con più, meno e mezzi, anche ponderata, e scopri che voto ti serve per raggiungere la media che vuoi.',
		category: 'scuola',
		related: ['media-mediana-moda', 'calcolo-percentuale']
	}
];

export const toolBySlug = (slug: string): ToolMeta | undefined => TOOLS.find((t) => t.slug === slug);

export const toolsByCategory = (): [ToolCategory, ToolMeta[]][] => {
	const groups = new Map<ToolCategory, ToolMeta[]>();
	for (const t of TOOLS) groups.set(t.category, [...(groups.get(t.category) ?? []), t]);
	return [...groups];
};
