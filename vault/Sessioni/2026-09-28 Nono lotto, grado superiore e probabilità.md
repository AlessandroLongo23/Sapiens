---
aggiornato: 2026-09-28
tag: [sessione, contenuti, matematica]
---
# Nono lotto: grado superiore e probabilità

Sessione del 28 settembre 2026, seguito di [[2026-09-27 Ottavo lotto, piano cartesiano retta e parabola]]. Alessandro ha chiesto il lotto successivo. Restavano 15 lezioni del secondo anno, tutte vuote nel database: il nono lotto prende le 4 di Equazioni e disequazioni di grado superiore e le 2 di Probabilità; le 9 di geometria (circonferenza, aree, Pitagora, similitudine, trasformazioni) vanno al decimo, perché sono quasi tutte figure e rallenterebbero l'algebra. Le lezioni complete di matematica passano da 89 a 95.

## Cosa si è deciso
- Il nono lotto è di 6 lezioni, il decimo sarà la geometria del secondo anno, 9 lezioni, con cui il biennio è completo (Claude).
- La 90 ha in fondo una sezione breve sulle disequazioni scomponibili (scomposizione e tabella dei segni), perché il capitolo si chiama "Equazioni e disequazioni di grado superiore" e nessun'altra lezione le tratta. Le equazioni reciproche restano fuori. Tutte e due le scelte sono domande per Andrea.
- La probabilità del biennio si ferma alla somma e all'evento contrario: probabilità composta ed eventi indipendenti stanno nel capitolo Probabilità condizionata degli anni dopo, e le lezioni non li linkano finché sono vuoti. Notazione $p(E)$, spazio campionario $\Omega$, mazzo di 40 carte napoletane (da verificare con il libro in uso).
- Prerequisiti, con le correzioni degli agenti agli archi ridondanti della bozza: binomie da Ruffini e disequazioni di secondo grado; valore assoluto e irrazionali dalle disequazioni fratte (la 89); sistemi di secondo grado da sistemi lineari, relazioni tra soluzioni e coefficienti e parabola; Eventi e probabilità da differenza e complementare e statistica; la somma dalla 94. 95 lezioni, 144 archi, nessun ciclo.
- Due generatori hanno nove livelli, uno per sezione della lezione (valore assoluto, irrazionali): più dei cinque-sette soliti. Si tengono così; l'alternativa, dividere equazioni e disequazioni in due generatori, è una domanda per Andrea.

## Cosa si è fatto
- Sei lezioni nuove (file 90-95 in `docs/lezioni/`): Equazioni binomie, trinomie e scomponibili; Equazioni e disequazioni con il valore assoluto; Equazioni e disequazioni irrazionali; Sistemi di secondo grado; Eventi e probabilità; Probabilità della somma e dell'evento contrario. 64 esempi svolti, 20 figure, 112 flashcard. Ogni conto rifatto con SymPy; le probabilità contando gli esiti dello spazio campionario enumerato. Il controllo ha trovato una frase sbagliata nella 94 (la frequenza dopo 10.000 lanci era detta più lontana da 0,5 che dopo 1.000), corretta. Nella 92 SymPy accettava una soluzione con un radicando negativo, perché lavora sui complessi: lo script scarta a mano i radicandi negativi.
- Pubblicate. In produzione, su un Pixel 7: nessuna pagina scorre di lato, nessuna formula esce dalla colonna, nessun errore di KaTeX, tutte le figure caricate, in lezioni e formulari.
- Link dalle lezioni già scritte verso le nuove: 17, 20, 55, 63, 68, 75, 77.
- Sei generatori di esercizi (44 livelli), verificati su 1.000 esercizi per livello con i seed 1 e 50001 dagli agenti e 777001 da Claude, errori piantati tutti bocciati, `width.mts` a 0. Per la probabilità il controllo Python rilegge l'esperimento dal testo ed enumera gli esiti con `itertools` e `Fraction`. Coppie soluzione, intervalli e posizione della retta sono a scelta multipla, come nei lotti precedenti. Collegati al sito con i nomi dei livelli; in locale le schede giornaliere delle sei lezioni non hanno errori di KaTeX e non scorrono di lato.

## Informazioni nuove
- Alcuni livelli hanno pochi esercizi diversi perché lo spazio dei casi è piccolo: 21 esercizi possibili in "Almeno uno" (95), 46 nella somma di due dadi e 62 sul mazzo di 40 (94). Per una prova da 10 domande bastano, per chi ripete il livello molte volte no.
- Le figure che servirebbero negli esercizi: la tabella dei due dadi (94 e 95), retta e parabola (93), i grafici di $x^4$ e $x^3$ (90), le righe dei sistemi di disequazioni (91, 92). Vedi le specifiche.

## Domande aperte
Le principali sono in [[Domande per Andrea]], le altre nella sezione "Domande per Andrea" di ogni nota (`docs/lezioni/note/90-95`) e nella sezione "Domande per la revisione" di ogni specifica.

## Prossimo argomento
Deploy dei generatori del nono lotto (le lezioni sono già online); poi il decimo lotto, la geometria del secondo anno: circonferenza e cerchio, poligoni inscritti e circoscritti, equivalenza e aree, lunghezza della circonferenza e area del cerchio, Pitagora ed Euclide, seno coseno e tangente nel triangolo rettangolo, Talete, similitudine, trasformazioni geometriche.
