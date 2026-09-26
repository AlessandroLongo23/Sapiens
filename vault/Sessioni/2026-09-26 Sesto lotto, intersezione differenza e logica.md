---
aggiornato: 2026-09-26
tag: [sessione, contenuti, matematica]
---
# Sesto lotto: intersezione, differenza e logica

Sessione del 26 settembre 2026, seguito di [[2026-09-26 Quinto lotto, disequazioni statistica e geometria]]. Alessandro ha chiesto di finire le lezioni che mancavano al primo anno: le ultime cinque del capitolo Insiemi e logica. Con questo lotto il primo anno di matematica ha tutte le sue 66 lezioni con teoria, formulario, flashcard ed esercizi.

## Cosa si è deciso
- La lezione 03 (Proprietà delle operazioni tra insiemi) tiene di intersezione, differenza e complementare solo un riepilogo con la definizione, l'esempio e il link alla lezione nuova, come già per il prodotto cartesiano. La numerazione degli esempi non cambia e ogni flashcard già pubblicata della 03 resta coperta dal testo (proposta degli agenti, applicata da Claude).
- Prerequisiti: Intersezione insiemistica dipende ora da Unione insiemistica (conta gli elementi con la formula dell'unione), e l'arco dalla 03 all'unione diventa ridondante. Chiuso il dubbio su Proposizioni e connettivi logici: resta una lezione di base, perché il legame con le operazioni tra insiemi è una sezione breve alla fine, fatta di link.
- Convenzioni di logica, uguali nelle tre lezioni (Claude, da verificare con il libro in uso): lettere $p$, $q$, $r$, valori V e F, $\neg$, $\wedge$, $\vee$, $\dot\vee$, $\to$ e $\leftrightarrow$ per i connettivi, $\Rightarrow$ e $\Leftrightarrow$ per implicazione ed equivalenza logica, righe delle tavole nell'ordine VV, VF, FV, FF, $\forall x \in U,\ p(x)$ ed $\exists x \in U : p(x)$, insieme di verità $V_p$.
- Nelle tabelle delle lezioni, sul telefono, le celle non hanno più una larghezza minima di 6rem: la tengono solo quelle con un'immagine. Una tavola di verità a sei colonne ora entra in 390 px senza scorrere di lato (`src/app/globals.css`).

## Cosa si è fatto
- Cinque lezioni nuove (file 63-67 in `docs/lezioni/`): Intersezione insiemistica; Differenza e complementare; Proposizioni e connettivi logici; Implicazione, condizioni necessarie e sufficienti; Quantificatori. 42 esempi svolti, 20 figure (diagrammi di Eulero-Venn, circuiti in serie e in parallelo, insiemi di verità), 100 flashcard, tutti i conti rifatti in Python. Pubblicate, con la 03 ridotta e la 53, che ora rimanda all'intersezione.
- Cinque generatori di esercizi (34 livelli), verificati su 1.000 esercizi per livello con tre seed, errori piantati tutti bocciati, `width.mts` a 0. Collegati al sito con i nomi dei livelli. Nel browser a 390 px nessun errore di KaTeX e nessuna formula fuori dallo schermo. L'agente dei quantificatori ha trovato un difetto vero nel suo generatore: con $x^2 > 5$ in $\mathbb{N}$ il distrattore con $<$ al posto di $\le$ era anch'esso una negazione giusta, perché i due lati non sono mai uguali; ora il generatore lo esclude.
- Commit: lezioni 9f6ecef, tabelle c215a8a, generatori a3f55b3. Non ancora sul sito: servono push e deploy.

## Domande aperte
Per Andrea, oltre ai dubbi in fondo a ogni nota (`docs/lezioni/note/63-67`) e a ogni specifica:
- i nomi delle forme dell'implicazione: la 66 chiama inversa $q \to p$ e contraria $\neg p \to \neg q$, ma alcuni libri dicono reciproca (o conversa) la prima e inversa la seconda;
- l'equivalenza tra proposizioni con $\Leftrightarrow$ (alcuni libri usano $\equiv$) e la precedenza tra $\wedge$ e $\vee$, su cui i libri non sono d'accordo (la 65 mette sempre le parentesi);
- la 64 e la 66 sono lunghe (circa 22.000 caratteri): le note dicono quali esempi togliere se serve;
- il motore delle figure non compila `\mathbb{N}` né `\complement`: in due figure c'è una scritta al posto del simbolo;
- esercizi che vorrebbero una figura: i problemi con i diagrammi (livelli 5-6 dell'intersezione, 6-7 della differenza), gli insiemi di verità (livello 6 dell'implicazione, livello 2 dei quantificatori).

## Prossimo argomento
Push e deploy dei lotti quarto, quinto e sesto; poi il secondo anno.
