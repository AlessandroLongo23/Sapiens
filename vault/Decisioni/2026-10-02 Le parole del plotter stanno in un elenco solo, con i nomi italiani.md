---
stato: presa
aggiornato: 2026-10-02
tag: [decisione, strumenti, matematica, geometria]
---
# Le parole del plotter stanno in un elenco solo, con i nomi italiani

## Decisione
Alessandro, 2 ottobre 2026, sulla proposta in [[Elenco dei comandi e completamento nel plotter]]:
1. I comandi hanno nomi italiani (`retta`, `circonferenza`, `tg`) e gli argomenti si separano con il punto e virgola.
2. Mentre si scrive una formula, i cursori dei parametri compaiono solo quando la formula è confermata: Invio, oppure un clic altrove.

Fatto nella stessa sessione, sulla raccomandazione di Claude e senza un no di Alessandro: un solo elenco di parole (`src/lib/grafico/comandi.ts`) da cui escono le proposte mentre si scrive, la scrittura degli oggetti geometrici e la guida di ogni parola. Le funzioni che hanno già una scrittura loro sono nell'elenco per essere trovate, e sceglierle inserisce la scrittura della scuola ($|x|$, $\sqrt{x}$), senza una seconda sintassi.

## Perché
La virgola è quella dei decimali, quindi tra gli argomenti serve un altro segno, ed è lo stesso che separa le coordinate di un punto. I cursori alla conferma tolgono il conflitto tra le lettere di una parola non finita ("tra" verso "tratti") e i parametri.

## Regola per ammettere una parola
È nel programma del liceo, e il suo risultato si disegna sul piano o ci si legge sopra come numero. Fuori: commesso viaggiatore, Voronoi, foglio di calcolo, calcolo simbolico (Risolvi, Fattorizza).

## Conseguenze
- Le scorciatoie a parole di MathLive sono spente nei campi del plotter: una parola ha un padrone solo. "sin" resta tre lettere finché non arriva un altro tasto, perché può continuare in "sinh".
- Un comando scritto e confermato diventa le stesse righe che farebbe lo strumento con i clic, nella sezione "Costruzione": non resta come testo da modificare.
- I nomi vanno confermati da Andrea con le altre convenzioni.

## Ancora aperto
L'ordine dei pezzi che mancano (trasformazioni, limiti, statistica, area tra due curve, campo di direzioni): proposto da Claude, non confermato.

## Collegamenti
- [[Elenco dei comandi e completamento nel plotter]], [[Grafico di funzioni]], [[Geometria analitica nel plotter]]
- [[2026-10-02 La geometria analitica sta nel plotter e si costruisce prima con i clic]]
