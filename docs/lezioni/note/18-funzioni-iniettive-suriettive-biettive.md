# Note: Funzioni iniettive, suriettive e biettive

## Errori nell'originale

- Il testo pubblicato è troncato: finisce a metà frase, nell'esempio su $e^x$ ("Suriettività: $y = -1$ non è raggiunto, poiché $"). Manca la parte finale e il `$` aperto rompe il rendering delle formule vicine.
- "Molti studenti confondono iniettiva con monotona [...] in generale le due proprietà sono indipendenti": sbagliato. Una funzione strettamente monotona è sempre iniettiva; il contrario non vale. Riscritto come errore frequente, con il controesempio $\frac{1}{x}$.
- Esempio della proiezione: "infiniti punti diversi, posti alla stessa altezza ma in posizioni verticali diverse, producono la stessa proiezione". Contraddittorio: i punti con la stessa proiezione stanno sulla stessa verticale e hanno quote diverse. Esempio tolto, sostituito dal registro di classe e dal mese di nascita.
- Le definizioni usano callout Obsidian `> [!definition]`, che il renderer del sito non conosce: escono come citazione con la scritta "[!definition]". I segnaposto "*\* immagine: ...*" comparivano come testo nella pagina.
- "Algoritmo in tre passi": due dei tre passi riguardavano l'iniettività, e il test grafico era dato solo per l'iniettività, non per la suriettività.
- Domande retoriche in apertura, trattini lunghi, grassetto per enfasi, simboli ✓ e ✗.

## Cosa è cambiato

- Richiamo breve di dominio, codominio e immagine con link alle due lezioni (ancora senza testo), invece di rispiegarli.
- Definizioni precise delle tre proprietà, ognuna tradotta nel diagramma a frecce (al massimo una, almeno una, esattamente una freccia in arrivo) e riassunta in tabella.
- Tre esempi con insiemi finiti, un ad-tip sul conteggio degli elementi (con il controesempio: stesso numero di elementi non basta).
- Verifica algebrica e test delle rette orizzontali per tutte e tre le proprietà; warning sulla differenza con il test delle rette verticali.
- Esempi reali: $2x + 1$; $x^2$ con le quattro combinazioni di dominio e codominio ($\mathbb{R}$ e $[0, +\infty)$), in tabella; $2x$ su $\mathbb{Z}$ e su $\mathbb{Q}$.
- Invertibile se e solo se biettiva, con il perché e due inverse ($\frac{y - 1}{2}$ e $\sqrt{y}$); il resto rimanda a Funzioni invertibili.
- Tolti $e^x$ (appartiene a Funzioni esponenziali) e $x^3$ (la suriettività richiede la radice cubica). Conti verificati con SymPy.

## Dubbi da decidere

- Le lezioni Dominio, codominio e immagine e Funzioni invertibili non hanno ancora testo: quando verranno scritte, controllare che non ripetano questa (e viceversa).
- Notazione dell'immagine: ho usato $\mathrm{Im}(f)$; alcuni libri scrivono $f(A)$.
- La notazione per intervalli $[0, +\infty)$ non ha una lezione nell'elenco: se gli studenti a cui è rivolta non la conoscono, serve una riga di spiegazione o un link.
- "Biettiva" e "biunivoca" presentati come sinonimi: nei libri italiani "biunivoca" è diffuso, va bene tenerli tutti e due.
- La funzione $\frac{1}{x}$ nell'ultimo errore frequente: se lo studente non la conosce ancora, si può sostituire con una funzione a tratti.

## Figure da fare

1. Diagramma a frecce di $f(x) = x^2$ da $\{-1, 0, 1, 2\}$ a $\{0, 1, 2, 3, 4\}$: due frecce su $1$, nessuna su $2$ e $3$.
2. Tre diagrammi a frecce affiancati per gli esempi 1, 2 e 3 (iniettiva non suriettiva, suriettiva non iniettiva, biettiva), con $d$ senza frecce nel primo e due frecce su $a$ nel secondo.
3. Due grafici affiancati per il test delle rette orizzontali: a sinistra $y = 2x + 1$ con due o tre rette orizzontali che la incontrano una volta; a destra la parabola $y = x^2$ con la retta $y = 4$ che la incontra in $x = -2$ e $x = 2$ e la retta $y = -1$ che non la incontra.
4. Facoltativa: la parabola $y = x^2$ con il ramo $x \geq 0$ evidenziato, per l'esempio 7.

## Formulario e flashcard

- Il formulario unisce in una tabella il criterio delle frecce e quello delle rette orizzontali. La lezione, per l'iniettività, parla di "ogni retta orizzontale" senza limitarla a $k \in B$; le due versioni sono equivalenti, perché fuori dal codominio il grafico non ha punti.
- "Biettiva" e "biunivoca" sono trattate come sinonimi, come nella lezione; alcuni libri usano "biunivoca" solo per la corrispondenza. Da verificare sui libri adottati.
