/**
 * The guide to writing notes (/guida-latex): Markdown for the text, LaTeX for
 * the formulas. Every formula here is typeset by KaTeX, the library that draws
 * the notes, so the guide teaches only what a note can show; the list of
 * commands follows KaTeX's own (katex.org/docs/supported.html). The test in
 * tests/unit/writing-guide.test.mjs renders every example with
 * `throwOnError`, so a command KaTeX does not know fails there.
 */

/** A formula as typed, and what it is for. `display` for one that goes on a line of its own. */
export interface TexExample {
	tex: string;
	note?: string;
	display?: boolean;
}

/** A piece of Markdown as typed, and what it does. */
export interface MarkdownExample {
	md: string;
	note: string;
}

/** A mistake students make often, and the right way. */
export interface Mistake {
	wrong: string;
	right: string;
	why: string;
}

export interface TexSection {
	id: string;
	title: string;
	intro?: string;
	examples: TexExample[];
}

export const MARKDOWN: MarkdownExample[] = [
	{ md: '# Titolo', note: 'Il titolo della nota. Il cancelletto va all’inizio della riga, seguito da uno spazio.' },
	{ md: '## Sottotitolo', note: 'Un titolo di sezione. Titoli e sottotitoli formano l’indice della nota.' },
	{ md: '### Titoletto', note: 'Un titolo più piccolo, dentro una sezione.' },
	{ md: 'Un **teorema** importante', note: 'Grassetto: due asterischi prima e dopo.' },
	{ md: 'Si legge *seno* di x', note: 'Corsivo: un asterisco prima e dopo.' },
	{ md: 'Il risultato è ~~12~~ 21', note: 'Barrato: due tilde prima e dopo.' },
	{ md: '- primo punto\n- secondo punto\n  - un punto dentro', note: 'Elenco puntato: un trattino e uno spazio. Due spazi davanti portano il punto un livello più dentro.' },
	{ md: '1. si sposta\n2. si raccoglie\n3. si divide', note: 'Elenco numerato: numero, punto e spazio.' },
	{ md: '> Due rette parallele non si incontrano mai.', note: 'Citazione o definizione da ricordare: il segno di maggiore all’inizio della riga.' },
	{ md: 'Premi il tasto `Invio`', note: 'Codice: un accento grave prima e dopo. Il testo resta com’è, senza formattazione.' },
	{ md: '[La lezione sulle frazioni](https://esempio.it)', note: 'Collegamento: il testo tra quadre e l’indirizzo tra tonde.' },
	{ md: '<!-- pagina -->', note: 'Da qui comincia una pagina nuova. Va su una riga da sola.' }
];

export const DELIMITERS: TexExample[] = [
	{ tex: 'x^2 + 1', note: 'Tra due dollari, dentro la frase: $x^2 + 1$.' },
	{ tex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', display: true, note: 'Tra due coppie di dollari, su una riga tutta sua: $$x = …$$' }
];

export const RULES: { title: string; text: string; tex: string }[] = [
	{
		title: 'I comandi cominciano con la barra rovesciata',
		text: 'Una parola preceduta da \\ è un comando: \\pi scrive la lettera greca, \\sqrt la radice. Senza barra, LaTeX scrive le lettere una per una, in corsivo.',
		tex: '\\pi r^2 \\quad pi r^2'
	},
	{
		title: 'Le graffe tengono insieme',
		text: 'Esponente, indice, numeratore e radicando sono un solo carattere, a meno di chiuderli tra graffe. Le graffe non si vedono.',
		tex: 'x^{10} \\quad x^10'
	},
	{
		title: 'Gli spazi non contano',
		text: 'LaTeX decide da solo dove mettere lo spazio: x+1 e x + 1 vengono uguali. Per uno spazio in più ci sono i comandi della sezione “Testo e spazi”.',
		tex: 'x+1=2 \\quad x + 1 = 2'
	}
];

export const SECTIONS: TexSection[] = [
	{
		id: 'operazioni',
		title: 'Operazioni e confronti',
		examples: [
			{ tex: 'a + b - c', note: 'Più e meno si scrivono come sulla tastiera.' },
			{ tex: 'a \\cdot b', note: 'Il puntino della moltiplicazione.' },
			{ tex: 'a \\times b', note: 'La croce.' },
			{ tex: 'a : b \\quad a \\div b', note: 'Diviso: i due punti o il segno ÷.' },
			{ tex: '\\pm 3', note: 'Più o meno.' },
			{ tex: 'x \\neq 0', note: 'Diverso.' },
			{ tex: 'x \\leq 5 \\quad x \\geq 5', note: 'Minore o uguale, maggiore o uguale. Minore e maggiore stretti sono < e >.' },
			{ tex: '\\pi \\approx 3{,}14', note: 'Circa uguale. La virgola tra graffe non lascia spazio dopo di sé: 3{,}14 e non 3, 14.' },
			{ tex: 'x \\equiv 1 \\pmod 3', note: 'Congruenza.' },
			{ tex: '5! = 120', note: 'Fattoriale.' },
			{ tex: '|x - 3|', note: 'Valore assoluto: la barra verticale della tastiera.' },
			{ tex: '\\cancel{3} x', note: 'Barrare un termine che si semplifica.' }
		]
	},
	{
		id: 'frazioni-potenze',
		title: 'Frazioni, potenze, indici e radici',
		examples: [
			{ tex: '\\frac{3}{4}', note: 'Frazione: prima il numeratore, poi il denominatore, ognuno tra graffe.' },
			{ tex: '\\frac{x + 1}{x - 2}', note: 'Tra le graffe ci va qualunque cosa.' },
			{ tex: '\\dfrac{1}{2} \\quad \\tfrac{1}{2}', note: 'Frazione grande o piccola, qualunque sia il posto in cui sta.' },
			{ tex: 'x^2', note: 'Potenza: l’accento circonflesso.' },
			{ tex: '2^{n+1}', note: 'Un esponente di più caratteri va tra graffe.' },
			{ tex: 'a_1, a_2, \\dots, a_n', note: 'Indice: il trattino basso. \\dots scrive i puntini.' },
			{ tex: 'x_1^2', note: 'Indice e potenza insieme.' },
			{ tex: '\\sqrt{2}', note: 'Radice quadrata.' },
			{ tex: '\\sqrt[3]{8} = 2', note: 'Radice con indice: l’indice tra quadre.' },
			{ tex: '\\sqrt{\\frac{a}{b}}', note: 'I comandi si mettono uno dentro l’altro.' },
			{ tex: '10^{-3}', note: 'Esponente negativo.' },
			{ tex: '\\binom{5}{2} = 10', note: 'Coefficiente binomiale.' }
		]
	},
	{
		id: 'parentesi',
		title: 'Parentesi',
		intro: 'Tonde e quadre si scrivono come sulla tastiera. Le graffe no, perché LaTeX le usa per raggruppare: si scrivono \\{ e \\}.',
		examples: [
			{ tex: '(a + b)^2', note: 'Tonde.' },
			{ tex: '[x + (y - 1)]', note: 'Quadre.' },
			{ tex: '\\{1, 2, 3\\}', note: 'Graffe, con la barra rovesciata.' },
			{ tex: '\\left( \\frac{1}{2} \\right)^2', note: '\\left e \\right fanno crescere la parentesi con quello che contiene.' },
			{ tex: '\\left[ \\frac{a}{b} + 1 \\right]', note: 'Vale per ogni tipo di parentesi.' },
			{ tex: '\\left| \\frac{x}{2} \\right|', note: 'Anche per il valore assoluto.' },
			{ tex: '(0, +\\infty)', note: 'Un intervallo.' },
			{ tex: '\\lfloor 2{,}7 \\rfloor = 2', note: 'Parte intera.' }
		]
	},
	{
		id: 'greche',
		title: 'Lettere greche',
		intro: 'Il nome della lettera dopo la barra rovesciata. Con l’iniziale maiuscola si ha la maiuscola.',
		examples: [
			{ tex: '\\alpha \\quad \\beta \\quad \\gamma \\quad \\delta', note: 'alfa, beta, gamma, delta' },
			{ tex: '\\varepsilon \\quad \\theta \\quad \\lambda \\quad \\mu', note: 'epsilon, theta, lambda, mu' },
			{ tex: '\\pi \\quad \\rho \\quad \\sigma \\quad \\varphi', note: 'pi greco, rho, sigma, phi' },
			{ tex: '\\omega \\quad \\tau \\quad \\eta \\quad \\xi', note: 'omega, tau, eta, xi' },
			{ tex: '\\Delta \\quad \\Sigma \\quad \\Omega \\quad \\Phi', note: 'Delta, Sigma, Omega, Phi maiuscole' },
			{ tex: '\\Delta = b^2 - 4ac', note: 'Il delta dell’equazione di secondo grado.' }
		]
	},
	{
		id: 'insiemi-logica',
		title: 'Insiemi e logica',
		examples: [
			{ tex: 'x \\in A \\quad y \\notin A', note: 'Appartiene, non appartiene.' },
			{ tex: 'A \\subset B \\quad A \\subseteq B', note: 'Sottoinsieme proprio e sottoinsieme.' },
			{ tex: 'A \\cup B \\quad A \\cap B', note: 'Unione e intersezione.' },
			{ tex: 'A \\setminus B', note: 'Differenza.' },
			{ tex: 'A \\times B', note: 'Prodotto cartesiano.' },
			{ tex: '\\overline{A}', note: 'Complementare.' },
			{ tex: '\\emptyset \\quad \\varnothing', note: 'Insieme vuoto, nelle due forme.' },
			{ tex: '\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}', note: 'Gli insiemi numerici: \\mathbb scrive la lettera doppia.' },
			{ tex: '\\{ x \\in \\mathbb{R} \\mid x > 0 \\}', note: 'Un insieme descritto da una proprietà.' },
			{ tex: 'p \\land q \\quad p \\lor q \\quad \\lnot p', note: 'E, o, non.' },
			{ tex: 'p \\Rightarrow q \\quad p \\Leftrightarrow q', note: 'Implica, se e solo se.' },
			{ tex: '\\forall x \\quad \\exists y', note: 'Per ogni, esiste.' }
		]
	},
	{
		id: 'funzioni',
		title: 'Funzioni, limiti, trigonometria e logaritmi',
		intro: 'Seno, logaritmo e le altre funzioni hanno un comando: così si scrivono in tondo, come sul libro, e non come tre lettere in corsivo.',
		examples: [
			{ tex: 'f(x) = 2x + 1', note: 'Una funzione.' },
			{ tex: 'f\\colon A \\to B', note: 'Una funzione da A a B.' },
			{ tex: 'x \\mapsto x^2', note: 'La freccia che manda x nel suo valore.' },
			{ tex: '\\sin x \\quad \\cos x \\quad \\tan x', note: 'Seno, coseno, tangente.' },
			{ tex: '\\sin^2 \\alpha + \\cos^2 \\alpha = 1', note: 'La relazione fondamentale.' },
			{ tex: '\\log_2 8 = 3', note: 'Logaritmo in base 2.' },
			{ tex: '\\ln x \\quad \\log x', note: 'Logaritmo naturale e logaritmo.' },
			{ tex: 'e^{i\\pi} + 1 = 0', note: 'L’identità di Eulero.' },
			{ tex: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1', note: 'Limite: sotto, quello a cui tende x.' },
			{ tex: '\\lim_{x \\to +\\infty} \\frac{1}{x} = 0', note: 'Più infinito.' },
			{ tex: 'f\'(x) \\quad f\'\'(x)', note: 'Derivata prima e seconda: l’apostrofo.' },
			{ tex: '\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}', display: true, note: 'Sommatoria: sotto da dove parte, sopra dove arriva.' },
			{ tex: '\\int_0^1 x^2 \\, dx = \\frac{1}{3}', display: true, note: 'Integrale. \\, lascia un piccolo spazio prima di dx.' }
		]
	},
	{
		id: 'geometria',
		title: 'Geometria e vettori',
		examples: [
			{ tex: '\\overline{AB}', note: 'Segmento.' },
			{ tex: '\\widehat{ABC}', note: 'Angolo, con il cappello sopra.' },
			{ tex: '\\angle A = 90^\\circ', note: 'Angolo e gradi: \\circ è il pallino.' },
			{ tex: '\\triangle ABC', note: 'Triangolo.' },
			{ tex: 'r \\parallel s \\quad r \\perp s', note: 'Parallele e perpendicolari.' },
			{ tex: 'ABC \\cong DEF', note: 'Congruenti.' },
			{ tex: 'ABC \\sim DEF', note: 'Simili.' },
			{ tex: '\\vec{v} \\quad \\overrightarrow{AB}', note: 'Vettore.' },
			{ tex: 'P(x_0, y_0)', note: 'Un punto e le sue coordinate.' },
			{ tex: 'y = mx + q', note: 'Una retta.' }
		]
	},
	{
		id: 'strutture',
		title: 'Sistemi, passaggi e matrici',
		intro: 'Queste si scrivono su una riga a parte, tra $$ e $$. Dentro, \\\\ va a capo e & allinea.',
		examples: [
			{ tex: '\\begin{cases} x + y = 5 \\\\ x - y = 1 \\end{cases}', display: true, note: 'Sistema: ogni equazione su una riga, separate da \\\\.' },
			{ tex: 'f(x) = \\begin{cases} x & \\text{se } x \\geq 0 \\\\ -x & \\text{se } x < 0 \\end{cases}', display: true, note: 'Funzione definita a tratti: & separa il valore dalla condizione.' },
			{ tex: '\\begin{aligned} 2x + 3 &= 7 \\\\ 2x &= 4 \\\\ x &= 2 \\end{aligned}', display: true, note: 'Passaggi uno sotto l’altro, allineati sull’uguale: & va prima dell’uguale.' },
			{ tex: '\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}', display: true, note: 'Matrice: & separa le colonne, \\\\ le righe.' },
			{ tex: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc', display: true, note: 'Determinante.' }
		]
	},
	{
		id: 'testo-spazi',
		title: 'Testo e spazi',
		examples: [
			{ tex: 'x > 0 \\text{ per ogni } x', note: '\\text scrive parole normali dentro una formula. Gli spazi dentro le graffe contano.' },
			{ tex: 'a \\, b \\quad a \\; b \\quad a \\quad b \\quad a \\qquad b', note: 'Spazi sempre più larghi: \\, \\; \\quad \\qquad.' },
			{ tex: '\\boxed{x = 2}', note: 'Il risultato in un riquadro.' },
			{ tex: '\\underbrace{a + a + a}_{3 \\text{ volte}}', note: 'Una graffa sotto, con la spiegazione.' },
			{ tex: '\\textcolor{red}{x^2} + 1', note: 'Un colore.' },
			{ tex: '\\mathbf{v} \\quad \\mathrm{kg}', note: 'Grassetto e tondo, per esempio nelle unità di misura.' }
		]
	}
];

export const MISTAKES: Mistake[] = [
	{ wrong: 'x^10', right: 'x^{10}', why: 'Senza graffe l’esponente è solo la prima cifra.' },
	{ wrong: '\\frac12 + 1', right: '\\frac{1}{2} + 1', why: 'Funziona per caso con una cifra sola: con le graffe non si sbaglia mai.' },
	{ wrong: 'sin x', right: '\\sin x', why: 'Senza la barra sono tre lettere in corsivo, come s per i per n.' },
	{ wrong: '{1, 2}', right: '\\{1, 2\\}', why: 'Le graffe senza barra raggruppano e non si vedono.' },
	{ wrong: '2 * 3', right: '2 \\cdot 3', why: 'L’asterisco non è un segno di moltiplicazione.' },
	{ wrong: '3,14', right: '3{,}14', why: 'Dopo una virgola LaTeX lascia uno spazio, come in un elenco.' },
	{ wrong: '<=', right: '\\leq', why: 'Il minore o uguale ha un comando.' },
	{ wrong: 'x > 0 per ogni x', right: 'x > 0 \\text{ per ogni } x', why: 'Le parole fuori da \\text diventano lettere in corsivo, senza spazi.' }
];

export const EXAMPLES: TexExample[] = [
	{ tex: 'ax^2 + bx + c = 0 \\quad \\Rightarrow \\quad x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}', display: true, note: 'La formula risolutiva dell’equazione di secondo grado.' },
	{ tex: 'a^2 + b^2 = c^2', display: true, note: 'Il teorema di Pitagora.' },
	{ tex: '\\frac{x - 1}{x + 2} \\geq 0 \\quad \\Rightarrow \\quad x < -2 \\ \\lor \\ x \\geq 1', display: true, note: 'Una disequazione fratta e le sue soluzioni.' },
	{ tex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}', display: true, note: 'Il coefficiente angolare della retta per due punti.' },
	{ tex: '\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{ab} \\quad (a, b \\geq 0)', display: true, note: 'Una proprietà dei radicali, con la condizione.' },
	{ tex: 'v = \\frac{\\Delta s}{\\Delta t} \\quad [\\mathrm{m/s}]', display: true, note: 'La velocità media, con l’unità di misura.' }
];
