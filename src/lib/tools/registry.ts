import { CATEGORY_NAMES, type ToolCategory, type ToolMeta } from './types';

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
		related: ['calcolo-mcm', 'calcolo-mcd'],
		sample: '20\\%\\ \\text{di}\\ 150 = 30',
		keywords: ['sconto', 'aumento', 'percentuali', 'iva']
	},
	{
		slug: 'calcolo-mcm',
		title: 'Calcolo del mcm',
		lead: 'Il minimo comune multiplo di due o più numeri, con la scomposizione in fattori primi.',
		description: 'Calcola il minimo comune multiplo (mcm) di due o più numeri, con la scomposizione in fattori primi e tutti i passaggi spiegati.',
		category: 'numeri',
		lessons: ['high_school/math/numeri-naturali/numeri-naturali-mcm-mcd'],
		related: ['calcolo-mcd', 'calcolo-percentuale'],
		sample: '\\text{mcm}(12, 18) = 36',
		keywords: ['minimo comune multiplo']
	},
	{
		slug: 'calcolo-mcd',
		title: 'Calcolo del MCD',
		lead: 'Il massimo comune divisore di due o più numeri, con la scomposizione in fattori primi.',
		description: 'Calcola il massimo comune divisore (MCD) di due o più numeri, con la scomposizione in fattori primi e tutti i passaggi spiegati.',
		category: 'numeri',
		lessons: ['high_school/math/numeri-naturali/numeri-naturali-mcm-mcd'],
		related: ['calcolo-mcm', 'calcolo-percentuale'],
		sample: '\\text{MCD}(12, 18) = 6',
		keywords: ['massimo comune divisore']
	},
	{
		slug: 'scomposizione-in-fattori-primi',
		title: 'Scomposizione in fattori primi',
		lead: 'Un numero intero scritto come prodotto di potenze di numeri primi, con la colonna delle divisioni.',
		description: 'Scomponi un numero in fattori primi con la colonna delle divisioni, le potenze e tutti i passaggi. Dice anche se il numero è primo.',
		category: 'numeri',
		lessons: ['high_school/math/numeri-naturali/numeri-naturali-divisibilita', 'high_school/math/numeri-naturali/numeri-naturali-mcm-mcd'],
		related: ['calcolo-mcm', 'calcolo-mcd', 'calcolo-radice-quadrata'],
		sample: '360 = 2^3 \\cdot 3^2 \\cdot 5',
		keywords: ['fattori primi', 'fattorizzazione']
	},
	{
		slug: 'calcolatrice-frazioni',
		title: 'Calcolatrice di frazioni',
		lead: 'Somma, sottrazione, moltiplicazione e divisione tra frazioni, e la semplificazione ai minimi termini. Con i passaggi.',
		description: 'Calcola somma, differenza, prodotto e quoziente di due frazioni e semplifica una frazione ai minimi termini, con mcm, MCD e tutti i passaggi.',
		category: 'numeri',
		lessons: ['high_school/math/numeri-razionali/numeri-razionali-frazioni', 'high_school/math/numeri-razionali/numeri-razionali-operazioni'],
		related: ['calcolo-espressioni', 'calcolo-mcm', 'calcolo-mcd'],
		sample: '\\frac{1}{2} + \\frac{1}{3} = \\frac{5}{6}',
		keywords: ['frazioni', 'semplificare', 'somma di frazioni']
	},
	{
		slug: 'calcolo-espressioni',
		title: 'Calcolo di espressioni',
		lead: "Espressioni con numeri interi, decimali e frazioni, potenze e parentesi, risolte passo per passo nell'ordine giusto.",
		description: "Risolvi espressioni numeriche con frazioni, potenze e parentesi tonde, quadre e graffe, con tutti i passaggi nell'ordine delle operazioni.",
		category: 'numeri',
		lessons: ['high_school/math/numeri-naturali/numeri-naturali-operazioni', 'high_school/math/numeri-razionali/numeri-razionali-espressioni'],
		related: ['calcolatrice-frazioni', 'calcolo-mcm'],
		sample: '[2 + (3 \\cdot 4)] : 7 = 2',
		keywords: ['espressioni', 'parentesi']
	},
	{
		slug: 'calcolo-potenze',
		title: 'Calcolo delle potenze',
		lead: 'La potenza di un intero, di un decimale o di una frazione, anche con esponente negativo o zero. Con i passaggi.',
		description: 'Calcola la potenza di un numero intero, decimale o di una frazione, anche con esponente negativo o zero, con risultato esatto e passaggi.',
		category: 'numeri',
		lessons: ['high_school/math/numeri-naturali/numeri-naturali-potenze', 'high_school/math/numeri-interi/numeri-interi-potenze', 'high_school/math/numeri-razionali/numeri-razionali-potenze'],
		related: ['calcolo-radice-quadrata', 'scomposizione-in-fattori-primi', 'calcolo-proporzioni'],
		sample: '\\left(\\frac{2}{3}\\right)^{-2} = \\frac{9}{4}',
		keywords: ['esponente', 'elevamento a potenza']
	},
	{
		slug: 'calcolo-radice-quadrata',
		title: 'Calcolo della radice quadrata',
		lead: 'La radice quadrata o cubica di un numero intero: esatta, semplificata portando fuori i fattori, e in decimali.',
		description: 'Calcola la radice quadrata o cubica di un numero: risultato esatto, radicale semplificato come 6√2 e valore decimale, con i passaggi.',
		category: 'numeri',
		lessons: ['high_school/math/numeri-reali/numeri-reali-radici', 'high_school/math/numeri-reali/radicali-operazioni'],
		related: ['scomposizione-in-fattori-primi', 'calcolo-potenze'],
		sample: '\\sqrt{72} = 6\\sqrt{2}',
		keywords: ['radice cubica', 'radicali']
	},
	{
		slug: 'calcolo-proporzioni',
		title: 'Calcolo delle proporzioni',
		lead: 'Il termine incognito di una proporzione a : b = c : d, con la proprietà fondamentale e il controllo.',
		description: 'Calcola il termine incognito di una proporzione a : b = c : d con la proprietà fondamentale, anche con decimali e frazioni, e i passaggi.',
		category: 'numeri',
		lessons: ['high_school/math/numeri-razionali/numeri-razionali-proporzioni'],
		related: ['calcolo-percentuale', 'calcolo-potenze'],
		sample: '3 : 4 = x : 12',
		keywords: ['proporzione', 'medio proporzionale']
	},
	{
		slug: 'equazioni-primo-grado',
		title: 'Equazioni di primo grado',
		lead: "Scrivi l'equazione e risolvila con i passaggi: parentesi, denominatori, casi impossibili e indeterminati.",
		description: 'Risolvi equazioni di primo grado con parentesi, frazioni e decimali, con tutti i passaggi e i casi impossibili e indeterminati.',
		category: 'algebra',
		lessons: ['high_school/math/equazioni-sistemi/equazioni-primo-grado'],
		related: ['equazioni-secondo-grado', 'calcolo-mcm'],
		sample: '2x + 3 = 7 \\Rightarrow x = 2',
		keywords: ['equazione', 'incognita']
	},
	{
		slug: 'equazioni-secondo-grado',
		title: 'Equazioni di secondo grado',
		lead: "Dai coefficienti o dall'equazione scritta per intero: discriminante, formula risolutiva, soluzioni esatte e approssimate.",
		description: 'Risolvi equazioni di secondo grado con il discriminante e la formula risolutiva: soluzioni esatte con i radicali, equazioni pure e spurie.',
		category: 'algebra',
		lessons: ['high_school/math/equazioni-di-secondo-grado/equazioni-secondo-grado'],
		related: ['equazioni-primo-grado'],
		sample: 'x^2 - 5x + 6 = 0',
		keywords: ['delta', 'discriminante', 'formula risolutiva']
	},
	{
		slug: 'area-perimetro-quadrato',
		title: 'Area e perimetro del quadrato',
		lead: 'Area, perimetro e diagonale del quadrato dal lato, dalla diagonale, dall’area o dal perimetro. Con i passaggi.',
		description: 'Calcola area, perimetro e diagonale del quadrato partendo dal lato, dalla diagonale, dall’area o dal perimetro, con disegno e passaggi.',
		category: 'geometria',
		lessons: ['high_school/math/geometria-piano-circonferenza/equivalenza-aree', 'high_school/math/geometria-piano-triangoli/geometria-quadrilateri'],
		related: ['area-perimetro-rettangolo', 'area-perimetro-rombo', 'teorema-di-pitagora'],
		sample: 'A = l^2',
		keywords: ['quadrato', 'diagonale']
	},
	{
		slug: 'area-perimetro-rettangolo',
		title: 'Area e perimetro del rettangolo',
		lead: 'Area, perimetro e diagonale del rettangolo da base e altezza, base e diagonale, area o perimetro. Con i passaggi.',
		description: 'Calcola area, perimetro e diagonale del rettangolo da base e altezza, da base e diagonale, dall’area o dal perimetro, con i passaggi.',
		category: 'geometria',
		lessons: ['high_school/math/geometria-piano-circonferenza/equivalenza-aree', 'high_school/math/geometria-piano-triangoli/geometria-quadrilateri'],
		related: ['area-perimetro-quadrato', 'area-perimetro-parallelogramma', 'teorema-di-pitagora'],
		sample: 'A = b \\cdot h',
		keywords: ['rettangolo']
	},
	{
		slug: 'area-perimetro-triangolo',
		title: 'Area e perimetro del triangolo',
		lead: 'Area da base e altezza, perimetro dai lati, formula di Erone dai tre lati e triangolo equilatero. Con i passaggi.',
		description: 'Calcola area e perimetro del triangolo: base e altezza, formula di Erone dai tre lati, triangolo equilatero. Con disegno e passaggi.',
		category: 'geometria',
		lessons: ['high_school/math/geometria-piano-circonferenza/equivalenza-aree', 'high_school/math/geometria-piano-triangoli/angoli-e-lati-dei-triangoli'],
		related: ['teorema-di-pitagora', 'area-perimetro-trapezio', 'area-perimetro-parallelogramma'],
		sample: 'A = \\frac{b \\cdot h}{2}',
		keywords: ['triangolo', 'erone']
	},
	{
		slug: 'area-perimetro-trapezio',
		title: 'Area e perimetro del trapezio',
		lead: 'Area e perimetro del trapezio da basi e altezza, anche isoscele e rettangolo con il teorema di Pitagora. Con i passaggi.',
		description: 'Calcola area e perimetro del trapezio da basi e altezza; per il trapezio isoscele e rettangolo trova il lato obliquo con Pitagora.',
		category: 'geometria',
		lessons: ['high_school/math/geometria-piano-circonferenza/equivalenza-aree', 'high_school/math/geometria-piano-triangoli/geometria-quadrilateri'],
		related: ['area-perimetro-parallelogramma', 'area-perimetro-triangolo', 'teorema-di-pitagora'],
		sample: 'A = \\frac{(B + b) \\cdot h}{2}',
		keywords: ['trapezio']
	},
	{
		slug: 'area-perimetro-rombo',
		title: 'Area e perimetro del rombo',
		lead: 'Area e perimetro del rombo dalle diagonali, dal lato e da una diagonale, o da lato e altezza. Con i passaggi.',
		description: 'Calcola area, perimetro e lato del rombo dalle diagonali, oppure dal lato e da una diagonale o dall’altezza, con disegno e passaggi.',
		category: 'geometria',
		lessons: ['high_school/math/geometria-piano-circonferenza/equivalenza-aree', 'high_school/math/geometria-piano-triangoli/geometria-quadrilateri'],
		related: ['area-perimetro-quadrato', 'area-perimetro-parallelogramma', 'teorema-di-pitagora'],
		sample: 'A = \\frac{D \\cdot d}{2}',
		keywords: ['rombo', 'diagonali']
	},
	{
		slug: 'area-perimetro-parallelogramma',
		title: 'Area e perimetro del parallelogramma',
		lead: 'Area da base e altezza, perimetro con il lato obliquo, altezza dall’area. Con i passaggi.',
		description: 'Calcola area e perimetro del parallelogramma da base, altezza e lato obliquo, oppure l’altezza dall’area, con disegno e passaggi.',
		category: 'geometria',
		lessons: ['high_school/math/geometria-piano-circonferenza/equivalenza-aree', 'high_school/math/geometria-piano-triangoli/geometria-quadrilateri'],
		related: ['area-perimetro-rettangolo', 'area-perimetro-rombo', 'area-perimetro-trapezio'],
		sample: 'A = b \\cdot h',
		keywords: ['parallelogramma']
	},
	{
		slug: 'area-circonferenza-cerchio',
		title: 'Area del cerchio e lunghezza della circonferenza',
		lead: 'Area, circonferenza, raggio e diametro da una sola misura, con π esatto e il valore decimale.',
		description: 'Calcola area del cerchio, circonferenza, raggio e diametro partendo da una sola misura, con π esatto (25π) e decimale, e i passaggi.',
		category: 'geometria',
		lessons: ['high_school/math/geometria-piano-circonferenza/circonferenza-lunghezza-area', 'high_school/math/geometria-piano-circonferenza/circonferenza-cerchio'],
		related: ['area-perimetro-quadrato', 'teorema-di-pitagora'],
		sample: 'A = \\pi r^2',
		keywords: ['cerchio', 'circonferenza', 'raggio', 'pi greco']
	},
	{
		slug: 'teorema-di-pitagora',
		title: 'Teorema di Pitagora',
		lead: 'L’ipotenusa dai cateti o un cateto dall’ipotenusa, con radicali semplificati, decimali e terne pitagoriche.',
		description: 'Calcola l’ipotenusa o un cateto con il teorema di Pitagora: risultato esatto (5√2) e decimale, terne pitagoriche e tutti i passaggi.',
		category: 'geometria',
		lessons: ['high_school/math/geometria-piano-circonferenza/teorema-di-pitagora'],
		related: ['area-perimetro-triangolo', 'area-perimetro-rettangolo', 'area-perimetro-rombo'],
		sample: 'a^2 + b^2 = c^2',
		keywords: ['ipotenusa', 'cateto', 'pitagora']
	},
	{
		slug: 'media-mediana-moda',
		title: 'Media, mediana e moda',
		lead: 'Media aritmetica, mediana, moda e campo di variazione di una lista di numeri, anche la media ponderata. Con i passaggi.',
		description: 'Calcola media, mediana, moda e campo di variazione di una lista di numeri, e la media ponderata, con i dati ordinati e tutti i passaggi.',
		category: 'statistica',
		lessons: ['high_school/math/statistica/statistica-medie', 'high_school/math/statistica/statistica-variabilita'],
		related: ['calcolo-media-voti', 'calcolo-percentuale'],
		sample: '\\bar{x} = \\frac{x_1 + \\dots + x_n}{n}',
		keywords: ['media aritmetica', 'media ponderata', 'mediana', 'moda']
	},
	{
		slug: 'gradi-radianti',
		title: 'Conversione da gradi a radianti',
		lead: 'Da gradi (anche in gradi, primi e secondi) a radianti e viceversa, con π esatto e il valore decimale.',
		description: 'Converti un angolo da gradi a radianti e da radianti a gradi, con π esatto (45° = π/4), gradi primi e secondi e tutti i passaggi.',
		category: 'trigonometria',
		lessons: ['high_school/math/goniometria/misura-angoli'],
		related: ['equivalenze', 'convertitore-temperatura'],
		sample: '180^\\circ = \\pi\\ \\text{rad}',
		keywords: ['radianti', 'angoli']
	},
	{
		slug: 'equivalenze',
		title: 'Equivalenze',
		lead: "Lunghezze, masse, capacità, superfici, volumi e tempo da un'unità all'altra, con la scala delle unità e i passaggi.",
		description: 'Calcola le equivalenze di lunghezza, massa, capacità, superficie, volume e tempo, con la scala delle unità e la virgola spostata passo per passo.',
		category: 'conversioni',
		lessons: ['middle_school/math/mat-misure/mat-equivalenze', 'middle_school/math/mat-misure/mat-misure-tempo', 'high_school/physics/fis-grandezze/fis-grandezze-si'],
		related: ['convertitore-temperatura', 'gradi-radianti', 'convertitore-binario'],
		sample: '3{,}5\\ \\text{km} = 3500\\ \\text{m}',
		keywords: ['metri', 'litri', 'grammi', 'unità di misura']
	},
	{
		slug: 'convertitore-temperatura',
		title: 'Conversione di temperatura: Celsius, Fahrenheit e Kelvin',
		lead: 'Da gradi Celsius a Fahrenheit e Kelvin, e viceversa, con le formule e i passaggi.',
		description: 'Converti una temperatura tra gradi Celsius, Fahrenheit e Kelvin, con le formule e tutti i passaggi spiegati.',
		category: 'conversioni',
		lessons: ['high_school/physics/fis-temperatura-calore/fis-temperatura', 'middle_school/science/sci-calore/sci-temperatura'],
		related: ['equivalenze', 'gradi-radianti'],
		sample: '25\\ \\text{°C} = 77\\ \\text{°F}',
		keywords: ['celsius', 'fahrenheit', 'kelvin', 'gradi']
	},
	{
		slug: 'convertitore-binario',
		title: 'Convertitore binario, decimale ed esadecimale',
		lead: 'Numeri interi tra le basi 2, 8, 10 e 16, con le divisioni successive, le potenze della base e i gruppi di bit.',
		description: 'Converti numeri tra binario, ottale, decimale ed esadecimale, con le divisioni successive, la somma delle potenze e tutti i passaggi.',
		category: 'informatica',
		lessons: ['high_school/computer-science/inf-sistemi-numerazione/inf-binario-decimale', 'high_school/computer-science/inf-sistemi-numerazione/inf-esadecimale', 'middle_school/math/aritmetica/mat-sistemi-numerazione'],
		related: ['equivalenze', 'calcolo-mcm'],
		sample: '13 = 1101_2',
		keywords: ['binario', 'esadecimale', 'ottale', 'basi']
	},
	{
		slug: 'calcolo-media-voti',
		title: 'Calcolo della media dei voti',
		lead: 'La media dei tuoi voti, anche con 6+, 6-, 6½ e 7/8, semplice o ponderata, e il voto che ti serve per arrivare alla media che vuoi.',
		description: 'Calcola la media dei voti di scuola con più, meno e mezzi, anche ponderata, e scopri che voto ti serve per raggiungere la media che vuoi.',
		category: 'scuola',
		related: ['media-mediana-moda', 'calcolo-percentuale'],
		sample: '6+ = 6{,}25',
		keywords: ['voti', 'pagella', 'media scolastica']
	},
	{
		slug: 'numeri-primi',
		title: 'Numeri primi',
		lead: 'Dice se un numero è primo provando i divisori fino alla radice, e trova tutti i primi fino a 1000 con il crivello di Eratostene.',
		description: 'Scopri se un numero è primo, con le divisioni fino alla radice quadrata e la scomposizione, ed elenca i numeri primi fino a 1000 con il crivello.',
		category: 'numeri',
		lessons: ['high_school/math/numeri-naturali/numeri-naturali-divisibilita', 'middle_school/math/mat-divisibilita/mat-numeri-primi'],
		related: ['scomposizione-in-fattori-primi', 'calcolo-mcd', 'calcolo-radice-quadrata'],
		sample: '97\\ \\text{è primo}',
		keywords: ['numero primo', 'primi', 'crivello di eratostene', 'numero composto', 'divisori']
	},
	{
		slug: 'notazione-scientifica',
		title: 'Notazione scientifica',
		lead: 'Da numero decimale a notazione scientifica e ritorno, con lo spostamento della virgola e l’ordine di grandezza.',
		description: 'Scrivi un numero in notazione scientifica o torna al numero decimale, con la virgola spostata passo per passo e l’ordine di grandezza.',
		category: 'numeri',
		lessons: ['middle_school/math/mat-potenze/mat-potenze-dieci', 'high_school/math/numeri-naturali/numeri-naturali-potenze'],
		related: ['arrotondamento', 'calcolo-potenze', 'equivalenze'],
		sample: '0{,}00034 = 3{,}4 \\cdot 10^{-4}',
		keywords: ['potenze di 10', 'ordine di grandezza', 'notazione esponenziale']
	},
	{
		slug: 'arrotondamento',
		title: 'Arrotondamento di un numero',
		lead: 'Arrotonda ai decimi, ai centesimi, alle decine o alle migliaia, oppure a un numero di cifre significative, con la cifra che decide evidenziata.',
		description: 'Arrotonda un numero ai decimali che vuoi, alle decine o alle centinaia, o alle cifre significative, per eccesso o per difetto, con i passaggi.',
		category: 'numeri',
		lessons: ['middle_school/math/aritmetica/mat-approssimazione-stime', 'high_school/physics/fis-grandezze/fis-cifre-significative', 'high_school/chemistry/chim-misure/chim-errori-cifre-significative'],
		related: ['notazione-scientifica', 'calcolo-percentuale', 'calcolo-radice-quadrata'],
		sample: '3{,}14159 \\approx 3{,}14',
		keywords: ['arrotondare', 'cifre significative', 'approssimazione', 'per eccesso', 'per difetto']
	},
	{
		slug: 'frazione-generatrice',
		title: 'Frazione generatrice',
		lead: 'La frazione di un numero decimale limitato o periodico, con la regola dei 9 e degli 0 e la riduzione ai minimi termini.',
		description: 'Calcola la frazione generatrice di un numero decimale limitato o periodico, semplice o misto, con la regola del libro e tutti i passaggi.',
		category: 'numeri',
		lessons: ['high_school/math/numeri-razionali/numeri-razionali-conversione', 'middle_school/math/mat-frazioni-decimali/mat-frazione-generatrice', 'middle_school/math/mat-frazioni-decimali/mat-decimali-periodici'],
		related: ['calcolatrice-frazioni', 'calcolo-mcd', 'arrotondamento'],
		sample: '0{,}1\\overline{6} = \\frac{1}{6}',
		keywords: ['numero periodico', 'decimale periodico', 'da decimale a frazione', 'periodo', 'antiperiodo']
	},
	{
		slug: 'numeri-romani',
		title: 'Convertitore di numeri romani',
		lead: 'Da numero arabo a numero romano e viceversa, da 1 a 3999, con i simboli usati e le sottrazioni.',
		description: 'Converti un numero da 1 a 3999 in numeri romani e un numero romano in cifre arabe, con la tabella dei simboli e le sottrazioni spiegate.',
		category: 'numeri',
		lessons: ['middle_school/math/aritmetica/mat-sistemi-numerazione'],
		related: ['convertitore-binario', 'scomposizione-in-fattori-primi'],
		sample: '1994 = \\text{MCMXCIV}',
		keywords: ['numeri romani', 'convertitore romano', 'cifre romane', 'mcmxciv']
	},
	{
		slug: 'sistemi-lineari-2x2',
		title: 'Sistemi lineari 2x2',
		lead: 'Due equazioni in x e y risolte per sostituzione, per riduzione o con la regola di Cramer, con i passaggi e le frazioni esatte.',
		description: 'Risolvi sistemi lineari di due equazioni in due incognite per sostituzione, riduzione o Cramer: passaggi, frazioni esatte, casi impossibili.',
		category: 'algebra',
		lessons: ['high_school/math/sistemi-lineari/sistemi-di-equazioni', 'high_school/math/sistemi-lineari/sistemi-cramer'],
		related: ['sistemi-lineari-3x3', 'equazioni-primo-grado'],
		sample: '\\begin{cases} x + y = 5 \\\\ x - y = 1 \\end{cases}',
		keywords: ['sistema di equazioni', 'metodo di sostituzione', 'metodo di riduzione', 'regola di cramer', 'due incognite']
	},
	{
		slug: 'sistemi-lineari-3x3',
		title: 'Sistemi lineari 3x3',
		lead: 'Tre equazioni in x, y e z risolte con la regola di Cramer e i determinanti di Sarrus, oppure per riduzione.',
		description: 'Risolvi sistemi di tre equazioni in tre incognite con la regola di Cramer e Sarrus o per riduzione, con frazioni esatte e tutti i passaggi.',
		category: 'algebra',
		lessons: ['high_school/math/sistemi-lineari/sistemi-cramer'],
		related: ['sistemi-lineari-2x2', 'equazioni-primo-grado'],
		sample: 'x = \\frac{D_x}{D}',
		keywords: ['tre incognite', 'regola di sarrus', 'determinante', 'regola di cramer']
	},
	{
		slug: 'disequazioni-primo-grado',
		title: 'Disequazioni di primo grado',
		lead: 'Le soluzioni come disuguaglianza, come intervallo e sulla retta, con il cambio di verso quando si divide per un numero negativo.',
		description: 'Risolvi disequazioni di primo grado con parentesi e frazioni: i passaggi, il cambio di verso, la soluzione come intervallo e disegnata sulla retta.',
		category: 'algebra',
		lessons: ['high_school/math/disequazioni-lineari/disequazioni-primo-grado'],
		related: ['disequazioni-secondo-grado', 'equazioni-primo-grado'],
		sample: '2x + 3 > 7 \\Rightarrow x > 2',
		keywords: ['disequazioni lineari', 'intervalli', 'cambio di verso', 'maggiore o uguale']
	},
	{
		slug: 'disequazioni-secondo-grado',
		title: 'Disequazioni di secondo grado',
		lead: 'Discriminante, radici e segno della parabola: le soluzioni come valori esterni o interni, con i radicali esatti.',
		description: 'Risolvi disequazioni di secondo grado con discriminante, radici esatte e segno della parabola: soluzioni come intervalli, con tutti i passaggi.',
		category: 'algebra',
		lessons: ['high_school/math/parabola-disequazioni/disequazioni-secondo-grado'],
		related: ['disequazioni-primo-grado', 'equazioni-secondo-grado'],
		sample: 'x^2 - 4 < 0',
		keywords: ['disequazioni quadratiche', 'segno del trinomio', 'parabola', 'valori esterni', 'valori interni']
	},
	{
		slug: 'prodotti-notevoli',
		title: 'Prodotti notevoli',
		lead: 'Scrivi il prodotto e sviluppalo con la sua regola: quadrato del primo, doppio prodotto, quadrato del secondo.',
		description: 'Sviluppa i prodotti notevoli con i passaggi: quadrato di binomio e di trinomio, cubo di binomio, somma per differenza.',
		category: 'algebra',
		lessons: ['high_school/math/monomi-polinomi/polinomi-prodotti-notevoli'],
		related: ['scomposizione-polinomi', 'divisione-polinomi', 'equazioni-secondo-grado'],
		sample: '(a + b)^2',
		keywords: ['quadrato di binomio', 'somma per differenza', 'cubo di binomio', 'sviluppo']
	},
	{
		slug: 'divisione-polinomi',
		title: 'Divisione tra polinomi',
		lead: 'Dividi due polinomi in colonna: quoziente, resto e la verifica, un termine alla volta.',
		description: 'Calcola quoziente e resto della divisione tra polinomi, con la divisione in colonna passo per passo e la verifica.',
		category: 'algebra',
		lessons: ['high_school/math/monomi-polinomi/polinomi-divisione'],
		related: ['regola-di-ruffini', 'scomposizione-polinomi'],
		sample: '(x^2 - 1) : (x - 1)',
		keywords: ['quoziente', 'resto', 'divisione in colonna', 'polinomi']
	},
	{
		slug: 'regola-di-ruffini',
		title: 'Regola di Ruffini',
		lead: 'Dividi un polinomio per x - a con lo schema di Ruffini, e controlla il resto con il teorema del resto.',
		description: 'Dividi un polinomio per x - a con la regola di Ruffini: lo schema completo, quoziente, resto e teorema del resto.',
		category: 'algebra',
		lessons: ['high_school/math/monomi-polinomi/polinomi-ruffini', 'high_school/math/scomposizione/scomposizione-ruffini'],
		related: ['divisione-polinomi', 'scomposizione-polinomi'],
		sample: 'P(x) : (x - a)',
		keywords: ['ruffini', 'teorema del resto', 'schema di ruffini', 'divisione per x - a']
	},
	{
		slug: 'scomposizione-polinomi',
		title: 'Scomposizione di polinomi',
		lead: 'Scomponi un polinomio in fattori: raccoglimento, prodotti notevoli, trinomio notevole e Ruffini, con il nome di ogni metodo.',
		description: 'Scomponi i polinomi in fattori con i passaggi: raccoglimento totale, differenza di quadrati, trinomio notevole, regola di Ruffini.',
		category: 'algebra',
		lessons: [
			'high_school/math/scomposizione/scomposizione-raccoglimento',
			'high_school/math/scomposizione/scomposizione-prodotti-notevoli',
			'high_school/math/scomposizione/scomposizione-trinomio',
			'high_school/math/scomposizione/scomposizione-ruffini'
		],
		related: ['regola-di-ruffini', 'prodotti-notevoli', 'equazioni-secondo-grado'],
		sample: '(x + 1)(x + 2)',
		keywords: ['scomporre', 'fattorizzazione', 'raccoglimento totale', 'trinomio notevole', 'differenza di quadrati']
	},
	{
		slug: 'superficie-volume-cubo',
		title: 'Superficie e volume del cubo',
		lead: "Area laterale, area totale, volume e diagonale del cubo dallo spigolo, dal volume, dall'area totale o dalla diagonale.",
		description: "Calcola area laterale, area totale, volume e diagonale del cubo dallo spigolo, dal volume o dall'area totale, con disegno e passaggi.",
		category: 'geometria',
		lessons: ['middle_school/math/mat-poliedri/mat-parallelepipedo-cubo', 'high_school/math/geometria-solida/superfici-e-volumi-dei-solidi-geometrici'],
		related: ['superficie-volume-parallelepipedo', 'superficie-volume-prisma', 'area-perimetro-quadrato'],
		sample: 'V = l^3',
		keywords: ['volume cubo', 'area totale cubo', 'diagonale del cubo', 'spigolo']
	},
	{
		slug: 'superficie-volume-parallelepipedo',
		title: 'Superficie e volume del parallelepipedo',
		lead: "Area laterale, area totale, volume e diagonale del parallelepipedo rettangolo dalle tre dimensioni, dal volume o dalla diagonale.",
		description: 'Calcola area laterale, area totale, volume e diagonale del parallelepipedo rettangolo, o trova l’altezza dal volume, con i passaggi.',
		category: 'geometria',
		lessons: ['middle_school/math/mat-poliedri/mat-parallelepipedo-cubo', 'high_school/math/geometria-solida/superfici-e-volumi-dei-solidi-geometrici'],
		related: ['superficie-volume-cubo', 'superficie-volume-prisma', 'area-perimetro-rettangolo'],
		sample: 'V = a \\cdot b \\cdot c',
		keywords: ['volume parallelepipedo', 'parallelepipedo rettangolo', 'diagonale del parallelepipedo', 'scatola']
	},
	{
		slug: 'superficie-volume-prisma',
		title: 'Superficie e volume del prisma',
		lead: 'Area di base, area laterale, area totale e volume del prisma retto a base triangolare, quadrata o esagonale.',
		description: 'Calcola area laterale, area totale e volume del prisma retto regolare a base triangolare, quadrata o esagonale, con radicali esatti.',
		category: 'geometria',
		lessons: ['middle_school/math/mat-poliedri/mat-prisma', 'high_school/math/geometria-solida/superfici-e-volumi-dei-solidi-geometrici'],
		related: ['superficie-volume-parallelepipedo', 'superficie-volume-piramide', 'area-perimetro-poligoni-regolari'],
		sample: 'V = A_b \\cdot h',
		keywords: ['prisma triangolare', 'prisma esagonale', 'prisma quadrangolare', 'area laterale prisma']
	},
	{
		slug: 'superficie-volume-piramide',
		title: 'Superficie e volume della piramide',
		lead: 'Apotema, spigolo, area laterale, area totale e volume della piramide retta a base quadrata, con il teorema di Pitagora.',
		description: 'Calcola apotema, spigolo laterale, area totale e volume della piramide a base quadrata da lato, altezza, apotema o spigolo, con Pitagora.',
		category: 'geometria',
		lessons: ['middle_school/math/mat-poliedri/mat-piramide', 'high_school/math/geometria-solida/superfici-e-volumi-dei-solidi-geometrici'],
		related: ['superficie-volume-prisma', 'superficie-volume-cono', 'teorema-di-pitagora'],
		sample: 'V = \\frac{1}{3} A_b \\cdot h',
		keywords: ['apotema piramide', 'volume piramide', 'piramide quadrangolare', 'spigolo laterale']
	},
	{
		slug: 'superficie-volume-cilindro',
		title: 'Superficie e volume del cilindro',
		lead: 'Area di base, area laterale, area totale e volume del cilindro, con π esatto e il valore decimale. Anche l’altezza dal volume.',
		description: 'Calcola area laterale, area totale e volume del cilindro da raggio o diametro e altezza, con π esatto e decimale, o l’altezza dal volume.',
		category: 'geometria',
		lessons: ['middle_school/math/mat-solidi-rotazione/mat-cilindro', 'high_school/math/geometria-solida/solidi-rotazione'],
		related: ['superficie-volume-cono', 'superficie-volume-sfera', 'area-circonferenza-cerchio'],
		sample: 'V = \\pi r^2 h',
		keywords: ['volume cilindro', 'area laterale cilindro', 'superficie cilindro', 'lattina']
	},
	{
		slug: 'superficie-volume-cono',
		title: 'Superficie e volume del cono',
		lead: 'Apotema, area laterale, area totale e volume del cono da raggio e altezza, raggio e apotema o dal volume. Con i passaggi.',
		description: 'Calcola apotema, area laterale, area totale e volume del cono con il teorema di Pitagora e π esatto, anche l’altezza dal volume.',
		category: 'geometria',
		lessons: ['middle_school/math/mat-solidi-rotazione/mat-cono', 'high_school/math/geometria-solida/solidi-rotazione'],
		related: ['superficie-volume-cilindro', 'superficie-volume-piramide', 'teorema-di-pitagora'],
		sample: 'V = \\frac{1}{3}\\pi r^2 h',
		keywords: ['apotema cono', 'volume cono', 'area laterale cono']
	},
	{
		slug: 'superficie-volume-sfera',
		title: 'Superficie e volume della sfera',
		lead: 'Superficie sferica e volume dal raggio o dal diametro, e il raggio dalla superficie o dal volume, con π esatto.',
		description: 'Calcola superficie sferica e volume della sfera dal raggio o dal diametro, o il raggio dal volume, con π esatto, decimale e passaggi.',
		category: 'geometria',
		lessons: ['middle_school/math/mat-solidi-rotazione/mat-sfera', 'high_school/math/geometria-solida/solidi-rotazione'],
		related: ['superficie-volume-cilindro', 'superficie-volume-cono', 'area-circonferenza-cerchio'],
		sample: 'V = \\frac{4}{3}\\pi r^3',
		keywords: ['superficie sferica', 'volume sfera', 'palla']
	},
	{
		slug: 'area-perimetro-poligoni-regolari',
		title: 'Area e perimetro dei poligoni regolari',
		lead: 'Perimetro, apotema e area di pentagono, esagono, ottagono e degli altri poligoni regolari, con il numero fisso.',
		description: 'Calcola perimetro, apotema e area dei poligoni regolari (pentagono, esagono, ottagono…) dal lato o dall’apotema, con il numero fisso.',
		category: 'geometria',
		lessons: ['middle_school/math/mat-circonferenza/mat-poligoni-regolari', 'high_school/math/geometria-piano-circonferenza/poligoni-inscritti'],
		related: ['area-perimetro-triangolo', 'area-perimetro-quadrato', 'superficie-volume-prisma'],
		sample: 'A = \\frac{2p \\cdot a}{2}',
		keywords: ['numero fisso', 'apotema', 'pentagono', 'esagono', 'ottagono']
	},
	{
		slug: 'distanza-tra-due-punti',
		title: 'Distanza tra due punti',
		lead: 'La lunghezza del segmento AB dalle coordinate dei due punti, con il risultato esatto e i passaggi.',
		description: 'Calcola la distanza tra due punti del piano cartesiano: formula, radice semplificata e passaggi. Accetta frazioni e decimali.',
		category: 'geometria',
		lessons: ['high_school/math/geometria-analitica/il-piano-cartesiano'],
		related: ['punto-medio-segmento', 'retta-passante-per-due-punti', 'teorema-di-pitagora'],
		sample: '\\overline{AB} = 3\\sqrt{5}',
		keywords: ['piano cartesiano', 'lunghezza segmento', 'coordinate', 'geometria analitica']
	},
	{
		slug: 'punto-medio-segmento',
		title: 'Punto medio di un segmento',
		lead: 'Le coordinate del punto medio di AB, con la media delle ascisse e delle ordinate.',
		description: 'Calcola il punto medio di un segmento nel piano cartesiano dalle coordinate degli estremi, con i passaggi. Accetta frazioni e decimali.',
		category: 'geometria',
		lessons: ['high_school/math/geometria-analitica/il-piano-cartesiano'],
		related: ['distanza-tra-due-punti', 'retta-passante-per-due-punti'],
		sample: 'M\\left(1, \\frac{9}{2}\\right)',
		keywords: ['piano cartesiano', 'coordinate punto medio', 'geometria analitica']
	},
	{
		slug: 'retta-passante-per-due-punti',
		title: 'Retta passante per due punti',
		lead: 'Il coefficiente angolare e l’equazione della retta, in forma esplicita e implicita. Anche per un punto con pendenza data, parallela o perpendicolare.',
		description: 'Trova l’equazione della retta per due punti: coefficiente angolare, forma esplicita e implicita, rette parallele e perpendicolari, con i passaggi.',
		category: 'geometria',
		lessons: ['high_school/math/geometria-analitica/il-coefficiente-angolare', 'high_school/math/geometria-analitica/equazione-di-una-retta', 'high_school/math/geometria-analitica/rette-parallele-tra-loro'],
		related: ['distanza-tra-due-punti', 'punto-medio-segmento', 'parabola-vertice-fuoco-direttrice'],
		sample: 'y = \\frac{2}{3}x + \\frac{1}{3}',
		keywords: ['equazione della retta', 'coefficiente angolare', 'retta parallela', 'retta perpendicolare', 'pendenza']
	},
	{
		slug: 'parabola-vertice-fuoco-direttrice',
		title: 'Vertice, fuoco e direttrice della parabola',
		lead: 'Da y = ax² + bx + c il vertice, l’asse, il fuoco, la direttrice, la concavità e le intersezioni con gli assi.',
		description: 'Calcola vertice, fuoco, direttrice e asse di simmetria della parabola y = ax² + bx + c, con concavità, intersezioni con gli assi e passaggi.',
		category: 'geometria',
		lessons: ['high_school/math/parabola-disequazioni/funzioni-quadratiche'],
		related: ['equazioni-secondo-grado', 'retta-passante-per-due-punti'],
		sample: 'x_V = -\\frac{b}{2a}',
		keywords: ['parabola', 'vertice parabola', 'fuoco', 'direttrice', 'asse di simmetria']
	},
	{
		slug: 'seno-coseno-tangente',
		title: 'Seno, coseno e tangente',
		lead: 'Seno, coseno, tangente e cotangente di un angolo in gradi o radianti: valori esatti per gli angoli notevoli, con gli archi associati.',
		description: 'Calcola seno, coseno, tangente e cotangente di un angolo in gradi o radianti, con i valori esatti degli angoli notevoli (√3/2) e i passaggi.',
		category: 'trigonometria',
		lessons: ['high_school/math/goniometria/funzioni-goniometriche', 'high_school/math/goniometria/archi-associati'],
		related: ['gradi-radianti', 'risoluzione-triangolo-rettangolo', 'gradi-primi-secondi'],
		sample: '\\sin 150^\\circ = \\frac{1}{2}',
		keywords: ['seno', 'coseno', 'tangente', 'cotangente', 'circonferenza goniometrica']
	},
	{
		slug: 'risoluzione-triangolo-rettangolo',
		title: 'Risoluzione del triangolo rettangolo',
		lead: 'Tutti i lati e gli angoli di un triangolo rettangolo da due elementi, con i teoremi sui triangoli rettangoli e il disegno.',
		description: 'Risolvi un triangolo rettangolo: da due lati o da un lato e un angolo trova i lati e gli angoli che mancano, con seno, coseno, tangente e passaggi.',
		category: 'trigonometria',
		lessons: ['high_school/math/trigonometria/teoremi-sui-triangoli', 'high_school/math/geometria-piano-circonferenza/triangolo-rettangolo-trigonometria'],
		related: ['risoluzione-triangolo-qualsiasi', 'teorema-di-pitagora', 'seno-coseno-tangente'],
		sample: 'b = a \\sin\\beta',
		keywords: ['teoremi sui triangoli rettangoli', 'cateto', 'ipotenusa', 'trigonometria']
	},
	{
		slug: 'risoluzione-triangolo-qualsiasi',
		title: 'Risoluzione di un triangolo qualsiasi',
		lead: 'Lati e angoli di un triangolo qualsiasi con il teorema dei seni e il teorema del coseno, anche nel caso ambiguo.',
		description: 'Risolvi un triangolo qualsiasi con il teorema dei seni e del coseno: da tre lati, due lati e un angolo, o un lato e due angoli, con i passaggi.',
		category: 'trigonometria',
		lessons: ['high_school/math/trigonometria/teorema-seni', 'high_school/math/trigonometria/teorema-coseno'],
		related: ['risoluzione-triangolo-rettangolo', 'seno-coseno-tangente', 'area-perimetro-triangolo'],
		sample: '\\frac{a}{\\sin\\alpha} = \\frac{b}{\\sin\\beta}',
		keywords: ['teorema dei seni', 'teorema del coseno', 'teorema di carnot', 'triangolo scaleno']
	},
	{
		slug: 'gradi-primi-secondi',
		title: 'Gradi, primi e secondi',
		lead: 'Da gradi, primi e secondi a gradi decimali e viceversa, con le divisioni e le moltiplicazioni per 60.',
		description: 'Converti un angolo da gradi, primi e secondi a gradi decimali e viceversa (23° 15′ 36″ = 23,26°), con tutti i passaggi spiegati.',
		category: 'trigonometria',
		lessons: ['high_school/math/goniometria/misura-angoli'],
		related: ['gradi-radianti', 'seno-coseno-tangente', 'risoluzione-triangolo-rettangolo'],
		sample: "23^\\circ 15' 36'' = 23{,}26^\\circ",
		keywords: ['gradi sessagesimali', 'gradi decimali', 'conversione angoli', 'primi e secondi']
	},
	{
		slug: 'calcolo-varianza-deviazione-standard',
		title: 'Varianza e deviazione standard',
		lead: 'Varianza, scarto quadratico medio e coefficiente di variazione di una lista di numeri, con la tabella degli scarti.',
		description: 'Calcola varianza, deviazione standard (scarto quadratico medio) e coefficiente di variazione, con la tabella degli scarti e tutti i passaggi.',
		category: 'statistica',
		lessons: ['high_school/math/statistica/statistica-variabilita'],
		related: ['media-mediana-moda', 'calcolo-media-voti', 'calcolo-radice-quadrata'],
		sample: '\\sigma = \\sqrt{3{,}25} \\approx 1{,}8',
		keywords: ['scarto quadratico medio', 'sigma', 'coefficiente di variazione', 'dispersione', 'varianza campionaria']
	},
	{
		slug: 'calcolo-fattoriale',
		title: 'Calcolo del fattoriale',
		lead: 'Il fattoriale n! di un numero da 0 a 400, con tutte le cifre e le moltiplicazioni una alla volta.',
		description: 'Calcola il fattoriale n! di un numero, con tutte le cifre esatte, la notazione scientifica e le moltiplicazioni passo per passo.',
		category: 'statistica',
		lessons: ['high_school/math/calcolo-combinatorio/disposizioni-permutazioni'],
		related: ['calcolo-combinatorio', 'distribuzione-binomiale', 'calcolo-potenze'],
		sample: '5! = 120',
		keywords: ['n fattoriale', 'permutazioni', 'punto esclamativo']
	},
	{
		slug: 'calcolo-combinatorio',
		title: 'Calcolo combinatorio',
		lead: 'Permutazioni, disposizioni e combinazioni, semplici e con ripetizione, il coefficiente binomiale e gli anagrammi. Con i passaggi.',
		description: 'Calcola permutazioni, disposizioni e combinazioni semplici e con ripetizione, il coefficiente binomiale e gli anagrammi, con i passaggi.',
		category: 'statistica',
		lessons: ['high_school/math/calcolo-combinatorio/disposizioni-permutazioni', 'high_school/math/calcolo-combinatorio/combinazioni'],
		related: ['calcolo-fattoriale', 'distribuzione-binomiale'],
		sample: '\\tbinom{90}{6} = 622\\,614\\,630',
		keywords: ['combinazioni', 'disposizioni', 'permutazioni', 'coefficiente binomiale', 'anagrammi']
	},
	{
		slug: 'distribuzione-binomiale',
		title: 'Distribuzione binomiale',
		lead: 'La probabilità di esattamente, al massimo o almeno k successi in n prove (schema di Bernoulli), in frazione, decimale e percentuale.',
		description: 'Calcola la probabilità binomiale P(X = k), P(X ≤ k) e P(X ≥ k) con n prove e probabilità p: frazione esatta, decimale, percentuale e passaggi.',
		category: 'statistica',
		lessons: ['high_school/math/distribuzioni-probabilita/distribuzioni-binomiale-poisson'],
		related: ['calcolo-combinatorio', 'calcolo-fattoriale', 'calcolo-percentuale'],
		sample: 'P(X = 2) \\approx 0{,}29',
		keywords: ['schema di bernoulli', 'probabilità binomiale', 'prove ripetute', 'bernoulli']
	},
	{
		slug: 'convertitore-velocita',
		title: 'Conversione di velocità: km/h, m/s, nodi e mph',
		lead: 'Da chilometri orari a metri al secondo, nodi e miglia orarie, e viceversa, con il fattore e i passaggi.',
		description: 'Converti una velocità da km/h a m/s (dividi per 3,6), nodi e miglia orarie, con il fattore di conversione e tutti i passaggi.',
		category: 'conversioni',
		lessons: ['high_school/physics/cinematica/velocita', 'middle_school/science/sci-moto/sci-velocita-moto-uniforme'],
		related: ['equivalenze', 'convertitore-energia', 'convertitore-pressione'],
		sample: '90\\ \\text{km/h} = 25\\ \\text{m/s}',
		keywords: ['km/h in m/s', 'm/s in km/h', 'nodi', 'miglia orarie', '3,6']
	},
	{
		slug: 'convertitore-energia',
		title: 'Conversione di energia: joule, calorie, kWh ed eV',
		lead: 'Joule, calorie, kilocalorie, wattora, kilowattora ed elettronvolt, con i fattori esatti e i passaggi.',
		description: 'Converti energia tra joule, kJ, calorie, kcal, Wh, kWh ed elettronvolt, con i fattori esatti e tutti i passaggi spiegati.',
		category: 'conversioni',
		lessons: ['high_school/physics/fis-temperatura-calore/calore', 'middle_school/technology/tec-elettricita/tec-consumi-elettrici', 'middle_school/technology/tec-alimentazione/tec-fabbisogno-energetico'],
		related: ['convertitore-potenza', 'equivalenze', 'convertitore-temperatura'],
		sample: '1\\ \\text{kcal} = 4{,}184\\ \\text{kJ}',
		keywords: ['calorie in joule', 'kcal in kj', 'kwh', 'elettronvolt', 'joule']
	},
	{
		slug: 'convertitore-potenza',
		title: 'Conversione di potenza: watt, kW, CV e HP',
		lead: 'Watt, kilowatt, cavalli vapore e cavalli britannici (HP), con i fattori e i passaggi.',
		description: 'Converti una potenza tra watt, kilowatt, cavalli vapore (CV) e horsepower (HP), con i fattori di conversione e tutti i passaggi.',
		category: 'conversioni',
		lessons: ['high_school/physics/lavoro-energia/fis-potenza', 'middle_school/science/sci-lavoro-energia/sci-lavoro-potenza'],
		related: ['convertitore-kw-cv', 'convertitore-energia', 'equivalenze'],
		sample: '100\\ \\text{CV} \\approx 73{,}5\\ \\text{kW}',
		keywords: ['cavalli', 'cv', 'hp', 'horsepower', 'watt']
	},
	{
		slug: 'convertitore-kw-cv',
		title: 'Convertitore da kW a CV',
		lead: 'I kilowatt del libretto in cavalli vapore, e i cavalli in kilowatt, con il fattore esatto e i passaggi.',
		description: 'Converti kW in CV e CV in kW: la potenza del motore in cavalli vapore, con il fattore esatto 0,73549875 e tutti i passaggi.',
		category: 'conversioni',
		lessons: ['high_school/physics/lavoro-energia/fis-potenza'],
		related: ['convertitore-potenza', 'equivalenze'],
		sample: '1\\ \\text{kW} \\approx 1{,}36\\ \\text{CV}',
		keywords: ['kw in cv', 'cv in kw', 'cavalli auto', 'potenza motore']
	},
	{
		slug: 'convertitore-pressione',
		title: 'Conversione di pressione: Pa, bar, atm, mmHg e psi',
		lead: 'Pascal, ettopascal, bar, millibar, atmosfere, millimetri di mercurio e psi, con i fattori e i passaggi.',
		description: 'Converti una pressione tra pascal, hPa, bar, millibar, atmosfere, mmHg e psi, con i fattori di conversione e tutti i passaggi.',
		category: 'conversioni',
		lessons: ['high_school/physics/fis-equilibrio-fluidi/fis-pressione', 'high_school/physics/fis-equilibrio-fluidi/fis-pressione-atmosferica', 'high_school/chemistry/chim-gas/chim-pressione-gas'],
		related: ['equivalenze', 'convertitore-temperatura', 'convertitore-energia'],
		sample: '1\\ \\text{atm} = 760\\ \\text{mmHg}',
		keywords: ['bar in atm', 'pascal', 'mmhg', 'psi', 'ettopascal']
	},
	{
		slug: 'pollici-centimetri',
		title: 'Conversione da pollici a centimetri',
		lead: 'Pollici in centimetri e centimetri in pollici, anche per i televisori e con piedi e pollici (5\'11").',
		description: 'Converti pollici in centimetri e centimetri in pollici, anche piedi e pollici come 5\'11" e i pollici dei televisori, con i passaggi.',
		category: 'conversioni',
		lessons: [],
		related: ['equivalenze', 'teorema-di-pitagora'],
		sample: '1\\ \\text{in} = 2{,}54\\ \\text{cm}',
		keywords: ['pollici in cm', 'cm in pollici', 'piedi', 'pollici tv', 'inch']
	},
	{
		slug: 'tabelle-di-verita',
		title: 'Tabelle di verità',
		lead: 'La tabella di verità di una proposizione con non, e, o, implica, se e solo se e o esclusivo, con le colonne intermedie. Dice se è una tautologia.',
		description: 'Calcola la tabella di verità di una proposizione logica con le colonne intermedie e scopri se è una tautologia, una contraddizione o soddisfacibile.',
		category: 'informatica',
		lessons: ['high_school/math/insiemi-e-logica/logica-proposizioni', 'high_school/math/insiemi-e-logica/logica-implicazione', 'high_school/computer-science/inf-selezione/inf-operatori-logici'],
		related: ['complemento-a-due', 'convertitore-binario'],
		sample: 'p \\to q:\\ \\text{V F V V}',
		keywords: ['tavole di verità', 'tautologia', 'connettivi logici', 'logica', 'proposizioni']
	},
	{
		slug: 'complemento-a-due',
		title: 'Complemento a due',
		lead: 'Numeri interi con il segno in complemento a due su 8, 16 o 32 bit, e ritorno in decimale. Con i bit invertiti e il +1.',
		description: 'Converti un numero intero con segno in complemento a due su 8, 16 o 32 bit e viceversa, con i passaggi: inverti i bit, aggiungi 1.',
		category: 'informatica',
		lessons: ['high_school/computer-science/inf-codifica/inf-interi-segno', 'high_school/computer-science/inf-sistemi-numerazione/inf-aritmetica-binaria'],
		related: ['convertitore-binario', 'convertitore-ascii'],
		sample: '-14 = \\mathtt{1111\\,0010}',
		keywords: ['numeri negativi in binario', 'interi con segno', 'complemento a 2', 'binario']
	},
	{
		slug: 'convertitore-ascii',
		title: 'Testo e codici ASCII',
		lead: 'Da testo a codici ASCII in decimale, binario ed esadecimale, e dai codici al testo.',
		description: 'Converti un testo in codici ASCII in decimale, binario ed esadecimale e i codici in testo, con la tabella e i passaggi. Anche lettere accentate.',
		category: 'informatica',
		lessons: ['high_school/computer-science/inf-codifica/inf-codifica-caratteri'],
		related: ['convertitore-binario', 'complemento-a-due'],
		sample: '\\texttt{A} = 65 = \\mathtt{41}_{16}',
		keywords: ['tabella ascii', 'codice ascii', 'caratteri', 'unicode', 'utf-8']
	},
	{
		slug: 'calcolo-crediti-scolastici',
		title: 'Calcolo dei crediti scolastici',
		lead: 'La fascia di credito del terzo, quarto e quinto anno dalla media dei voti e dal voto di comportamento, con la tabella del ministero e il totale.',
		description: 'Calcola i crediti scolastici per la maturità dalla media dei voti e dal voto di condotta, con la tabella ministeriale aggiornata e il totale su 40.',
		category: 'scuola',
		related: ['calcolo-voto-maturita', 'calcolo-media-voti'],
		sample: 'M = 7{,}4 \\to 9\\ \\text{o}\\ 10',
		keywords: ['credito scolastico', 'tabella crediti', 'maturità', 'voto di condotta', 'fasce di credito']
	},
	{
		slug: 'calcolo-voto-maturita',
		title: 'Calcolo del voto di maturità',
		lead: 'Il voto finale della maturità in centesimi: credito, due scritti e colloquio, con il bonus e la lode.',
		description: 'Calcola il voto della maturità: credito scolastico, prima e seconda prova e colloquio, con il bonus fino a 3 punti e la lode. Regole aggiornate.',
		category: 'scuola',
		related: ['calcolo-crediti-scolastici', 'calcolo-media-voti', 'conversione-voti'],
		sample: '36 + 54 = 90',
		keywords: ['voto maturità', 'esame di stato', 'punteggio maturità', 'bonus maturità', 'centesimi']
	},
	{
		slug: 'conversione-voti',
		title: 'Conversione dei voti',
		lead: 'Un voto da decimi a quindicesimi, ventesimi, trentesimi o centesimi, e viceversa, con la proporzione.',
		description: 'Converti un voto tra decimi, quindicesimi, ventesimi, trentesimi e centesimi con la proporzione e i passaggi. Per verifiche, università e maturità.',
		category: 'scuola',
		related: ['calcolo-media-voti', 'calcolo-voto-maturita', 'calcolo-percentuale'],
		sample: '7/10 = 10{,}5/15',
		keywords: ['voti in quindicesimi', 'voti in decimi', 'convertire voti', 'ventesimi', 'trentesimi']
	},
	{
		slug: 'moto-rettilineo-uniforme',
		title: 'Moto rettilineo uniforme',
		lead: 'Spazio, velocità o tempo con la legge s = v · t, in m/s o in km/h. Con le conversioni e i passaggi.',
		description: 'Calcola spazio, velocità o tempo nel moto rettilineo uniforme con s = v·t, in metri, km, m/s e km/h, con le formule inverse e tutti i passaggi.',
		category: 'fisica',
		lessons: ['high_school/physics/cinematica/fis-moto-rettilineo-uniforme', 'high_school/physics/cinematica/velocita'],
		related: ['moto-uniformemente-accelerato', 'equivalenze', 'calcolo-proporzioni'],
		sample: 'v = \\frac{150\\ \\text{km}}{2\\ \\text{h}}',
		keywords: ['velocità', 'spazio tempo', 'legge oraria', 'mru']
	},
	{
		slug: 'moto-uniformemente-accelerato',
		title: 'Moto uniformemente accelerato',
		lead: 'Velocità, accelerazione, tempo o spazio con le tre formule del moto accelerato, anche in frenata. Con i passaggi.',
		description: 'Calcola velocità finale, accelerazione, tempo o spazio nel moto uniformemente accelerato con le tre formule, anche in frenata, con tutti i passaggi.',
		category: 'fisica',
		lessons: ['high_school/physics/cinematica/moto-uniforme-accelerato', 'high_school/physics/cinematica/fis-grafico-velocita-tempo'],
		related: ['moto-rettilineo-uniforme', 'equazioni-secondo-grado', 'calcolo-energia-cinetica'],
		sample: 's = v_0 t + \\frac{1}{2} a t^2',
		keywords: ['accelerazione', 'mrua', 'moto accelerato', 'spazio di frenata']
	},
	{
		slug: 'calcolo-densita',
		title: 'Calcolo della densità',
		lead: 'Densità, massa o volume con d = m / V, e la densità dei materiali più comuni. Con le conversioni e i passaggi.',
		description: 'Calcola densità, massa o volume con d = m/V in kg/m³, g/cm³ e g/mL, con la tabella delle densità dei materiali comuni e tutti i passaggi.',
		category: 'fisica',
		lessons: ['high_school/physics/fis-grandezze/fis-grandezze-derivate', 'high_school/chemistry/chim-misure/chim-massa-volume-densita'],
		related: ['equivalenze', 'calcolo-energia-potenziale', 'calcolo-moli'],
		sample: 'd = \\frac{m}{V}',
		keywords: ['densità', 'massa volume', 'peso specifico', 'massa volumica']
	},
	{
		slug: 'calcolo-energia-cinetica',
		title: "Calcolo dell'energia cinetica",
		lead: 'Energia cinetica, massa o velocità con K = ½ m v², in joule. Con le conversioni e i passaggi.',
		description: "Calcola l'energia cinetica con K = ½mv², oppure la massa o la velocità dall'energia, con la velocità anche in km/h e tutti i passaggi.",
		category: 'fisica',
		lessons: ['high_school/physics/lavoro-energia/fis-energia-cinetica'],
		related: ['calcolo-energia-potenziale', 'moto-uniformemente-accelerato'],
		sample: 'K = \\frac{1}{2} m v^2',
		keywords: ['energia cinetica', 'joule', 'energia di movimento']
	},
	{
		slug: 'calcolo-energia-potenziale',
		title: "Calcolo dell'energia potenziale",
		lead: 'Energia potenziale gravitazionale, massa o altezza con U = m g h, con g = 9,8 m/s² o il valore che vuoi. Con i passaggi.',
		description: "Calcola l'energia potenziale gravitazionale con U = mgh, oppure la massa o l'altezza, con g = 9,8 m/s² modificabile e tutti i passaggi.",
		category: 'fisica',
		lessons: ['high_school/physics/lavoro-energia/fis-energia-potenziale', 'high_school/physics/lavoro-energia/energia'],
		related: ['calcolo-energia-cinetica', 'calcolo-densita'],
		sample: 'U = m g h',
		keywords: ['energia potenziale', 'mgh', 'energia gravitazionale', 'joule']
	},
	{
		slug: 'legge-di-ohm',
		title: 'Legge di Ohm',
		lead: 'Tensione, resistenza o corrente con V = R · I, e la potenza elettrica. Con le conversioni e i passaggi.',
		description: 'Calcola tensione, resistenza o intensità di corrente con la prima legge di Ohm V = R·I, e la potenza P = V·I, in V, Ω, kΩ, A e mA.',
		category: 'fisica',
		lessons: ['high_school/physics/fis-corrente-continua/fis-leggi-ohm', 'high_school/physics/fis-corrente-continua/fis-effetto-joule'],
		related: ['equivalenze', 'calcolo-proporzioni'],
		sample: '\\frac{12\\ \\text{V}}{240\\ \\Omega} = 50\\ \\text{mA}',
		keywords: ['resistenza', 'tensione', 'corrente', 'potenza elettrica', 'ohm']
	},
	{
		slug: 'calcolo-massa-molare',
		title: 'Calcolo della massa molare',
		lead: 'La massa molare di una formula chimica, anche con parentesi e idrati, con la tabella degli atomi. Con i passaggi.',
		description: 'Calcola la massa molare di un composto dalla formula chimica, anche con parentesi e idrati come CuSO4·5H2O, con le masse atomiche e i passaggi.',
		category: 'chimica',
		lessons: ['high_school/chemistry/chim-quantita-sostanza/mole-massa-molare'],
		related: ['calcolo-moli', 'calcolo-molarita'],
		sample: '\\mathrm{H_2O}\\!: 18{,}02\\ \\text{g/mol}',
		keywords: ['peso molecolare', 'massa molecolare', 'g/mol', 'formula chimica']
	},
	{
		slug: 'calcolo-moli',
		title: 'Calcolo delle moli',
		lead: 'Da grammi a moli e da moli a grammi, con la massa molare dalla formula e il numero di particelle. Con i passaggi.',
		description: 'Converti grammi in moli e moli in grammi con n = m/M, con la massa molare calcolata dalla formula e il numero di particelle con Avogadro.',
		category: 'chimica',
		lessons: ['high_school/chemistry/chim-quantita-sostanza/mole-massa-molare'],
		related: ['calcolo-massa-molare', 'calcolo-molarita'],
		sample: 'n = \\frac{m}{M}',
		keywords: ['grammi moli', 'mole', 'numero di avogadro', 'particelle']
	},
	{
		slug: 'calcolo-molarita',
		title: 'Calcolo della molarità',
		lead: 'Molarità, moli di soluto o volume della soluzione con M = n / V. Con le conversioni e i passaggi.',
		description: 'Calcola la molarità di una soluzione con M = n/V, oppure le moli di soluto o il volume, in L e mL, con tutti i passaggi.',
		category: 'chimica',
		lessons: ['high_school/chemistry/chim-soluzioni/chim-molarita'],
		related: ['calcolo-diluizione', 'calcolo-moli', 'calcolo-massa-molare'],
		sample: '\\frac{0{,}5\\ \\text{mol}}{0{,}25\\ \\text{L}} = 2\\ \\text{M}',
		keywords: ['concentrazione molare', 'mol/l', 'soluzioni', 'molare']
	},
	{
		slug: 'calcolo-diluizione',
		title: 'Calcolo della diluizione',
		lead: "Il volume o la molarità dopo una diluizione con M₁V₁ = M₂V₂, e l'acqua da aggiungere. Con i passaggi.",
		description: "Calcola volume o molarità in una diluizione con M1·V1 = M2·V2 e quanta acqua aggiungere, in L e mL, con tutti i passaggi.",
		category: 'chimica',
		lessons: ['high_school/chemistry/chim-soluzioni/chim-diluizione'],
		related: ['calcolo-molarita', 'calcolo-moli'],
		sample: 'M_1 V_1 = M_2 V_2',
		keywords: ['diluire', 'soluzioni', 'acqua da aggiungere', 'concentrazione']
	}
];

export const toolBySlug = (slug: string): ToolMeta | undefined => TOOLS.find((t) => t.slug === slug);

/** The tools grouped by category, in the order of CATEGORY_NAMES; empty categories left out. */
export const toolsByCategory = (): [ToolCategory, ToolMeta[]][] =>
	(Object.keys(CATEGORY_NAMES) as ToolCategory[]).map((c): [ToolCategory, ToolMeta[]] => [c, TOOLS.filter((t) => t.category === c)]).filter(([, tools]) => tools.length > 0);
