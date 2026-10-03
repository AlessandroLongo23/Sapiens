# Note: Progettare una presentazione

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "Documenti di testo e presentazioni", 3 ottobre
2026). Lo slug `powerpoint` è storico: la lezione parla di come si progetta una presentazione prima di aprire un
programma, e i programmi (PowerPoint, LibreOffice Impress, Presentazioni Google) compaiono una volta, nell'apertura.
`check.mts` passa su lezione, formulario e flashcard senza errori e senza avvisi.

## Struttura ed esempi

Lo scopo in una frase; a chi parli; il tempo e il numero di slide, con il procedimento in quattro passi; un'idea per
slide; apertura, sviluppo e chiusura, con la figura della scaletta; la scaletta prima della grafica.

Sette esempi: argomento o scopo (quattro inizi); tre conti del numero di slide (divisione esatta, con le domande, con
il resto); una slide da dividere; il tempo di ogni parte; una scaletta da mettere in ordine. Tre avvisi: dividere il
tempo intero, finire senza chiusura, cominciare dalla grafica; un quarto errore (trenta slide per dieci minuti) è
nel testo della sezione sul tempo.

## Scelte

- La lezione non insegna a usare un programma: tutto quello che dice si fa con carta e penna. L'aspetto delle slide è
  nella lezione 32, a cui rimanda l'ultimo avviso.
- "Scopo" e non "messaggio" o "obiettivo": una parola sola, definita come "quello che il pubblico deve sapere, o voler
  fare, quando hai finito".
- "Slide" con "diapositive" tra parentesi alla prima occorrenza: è la parola che lo studente usa. Segue la
  convenzione del README (l'inglese dove l'italiano non si usa), ma i programmi in italiano scrivono "diapositiva": da
  decidere.
- La regola del tempo è un intervallo ("da uno a due minuti per ogni slide"), e negli esempi e negli esercizi i
  minuti per slide sono un dato. Così il conto ha una risposta sola senza fissare una convenzione che i libri non
  hanno.
- L'arrotondamento è per difetto: una slide in più non ci sta. È l'unico punto del procedimento in cui uno studente
  sbaglia per abitudine (arrotonda $7{,}5$ a $8$).
- La figura mostra una scaletta vera di sei slide con i tempi delle tre parti, invece di uno schema astratto.

## Numeri

Rifatti in Python (`/tmp/informatica-cap7/conti.py`): $10 : 2 = 5$; $(15 - 3) : 1{,}5 = 8$; $(20 - 5) : 2 = 7{,}5$,
quindi $7$, con un minuto di margine; $(12 - 2 - 1) : 3 = 3$; nella figura $1 + 8 + 1 = 10$ minuti.

## Fonti e cose da verificare

- "Da uno a due minuti per slide": è una regola pratica diffusa nei manuali sulle presentazioni, senza una fonte
  unica. Da verificare con Andrea se il libro in uso ne dà un'altra.
- "I vulcani italiani sono sorvegliati giorno e notte" (esempio 1): si riferisce alle sale operative dell'INGV,
  attive 24 ore su 24. È una frase d'esempio, ma è un fatto: da verificare.
- "Un litro dal rubinetto costa meno di un centesimo" (esempio 7): con una tariffa di circa 2 euro al metro cubo un
  litro costa 0,2 centesimi. Ordine di grandezza che ricordo, da verificare (ARERA) o da sostituire con un titolo
  senza numeri.
- I dati sulla plastica della classe 1B (bottigliette dimezzate) sono inventati: sono la storia di una classe, non
  un fatto.

## Figure

- `scaletta-apertura-sviluppo-chiusura` (TikZ): sei titoli numerati, colorati per parte, con tre parentesi a destra e
  i minuti di apertura, sviluppo e chiusura. Guardata in chiaro e in scuro.

## Per il generatore

`powerpoint`, sei livelli (specifica in `specs/exercises/powerpoint.md`): lo scopo in una frase, quante slide (conto),
un'idea per slide, apertura sviluppo chiusura, il tempo di ogni parte (conto), l'ordine della scaletta.

## Domande per Andrea

- "Slide" o "diapositiva" nel testo delle lezioni?
- La regola "da uno a due minuti per slide" va bene, o ne preferite una con un numero solo?
- Lo sviluppo "di solito tre o quattro punti": va bene come indicazione?
- Livello 6 degli esercizi (mettere in ordine quattro titoli): le otto scalette hanno sempre i ruoli titolo,
  problema, risposta, che cosa fare. L'ordine si capisce dai titoli, o qualche scaletta ammette due ordini?
- Serve una parte sulle note del relatore e sulle prove a voce (cronometrarsi), o è fuori dalla lezione?
