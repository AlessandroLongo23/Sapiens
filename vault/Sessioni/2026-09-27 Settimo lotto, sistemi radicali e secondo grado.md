---
aggiornato: 2026-09-27
tag: [sessione, contenuti, matematica]
---
# Settimo lotto: sistemi, radicali e secondo grado

Sessione del 27 settembre 2026, seguito di [[2026-09-26 Sesto lotto, intersezione differenza e logica]]. Chiuso il primo anno, Alessandro ha chiesto il lotto successivo: è il primo del secondo anno, con i tre capitoli che nei libri vengono per primi. Le lezioni complete di matematica passano da 67 a 79.

## Cosa si è deciso
- Il settimo lotto è di 12 lezioni: Sistemi lineari (3), Numeri reali e radicali (6) e le tre lezioni di Equazioni di secondo grado che mancavano accanto alla 17 (Claude). Parabola, grado superiore, probabilità e geometria del secondo anno vanno ai lotti successivi.
- Lettere sotto radice: la 72 tratta condizioni di esistenza e valori assoluti ($\sqrt{x^2} = |x|$), che sono il suo argomento; dalla 73 alla 76 le lettere sono positive, e lo dichiara ogni lezione, con un riquadro sul caso generale nella 73 (gli agenti, da verificare con il libro in uso).
- "Semplificare" un radicale nella 72 vuol dire dividere indice ed esponenti; $\sqrt{12} = 2\sqrt{3}$ è "portare fuori", nella 73. La 17 ora rimanda alla 73 per quel passaggio, e il suo prerequisito diventa Operazioni con i radicali.
- Prime righe del secondo anno nel grafo dei prerequisiti (`docs/lezioni/prerequisiti.md`), dalla bozza del brief con le correzioni degli agenti: i sistemi dipendono anche dalle equazioni fratte e dalla funzione lineare, gli irrazionali dalle potenze in ℚ, i radicali dalle disequazioni di primo grado (condizioni di esistenza), parametriche e problemi di secondo grado dalle equazioni fratte. 79 lezioni, 115 archi, nessun ciclo.
- Parametro delle equazioni parametriche e dei sistemi letterali: $k$, perché $a$, $b$, $c$ sono già i coefficienti. La 50 usa $a$: resta un dubbio per Andrea.

## Cosa si è fatto
- Dodici lezioni nuove (file 68-79 in `docs/lezioni/`): Sistemi di due equazioni in due incognite; Determinanti e regola di Cramer; Problemi con i sistemi; Numeri irrazionali e numeri reali; Radicali e loro proprietà; Operazioni con i radicali; Razionalizzazione; Espressioni con i radicali; Potenze con esponente razionale; Relazioni tra soluzioni e coefficienti; Equazioni parametriche; Problemi di secondo grado. 125 esempi svolti, 17 figure, 229 flashcard, ogni conto rifatto con SymPy. Pubblicate. Sul telefono nessuna formula esce dalla colonna e nessuna tabella scorre di lato.
- Link dalle lezioni già scritte verso le nuove: 17, 36 (il trinomio scomposto con i radicali), 45, 50, 51, 57.
- Dodici generatori di esercizi (83 livelli), verificati su 1.000 esercizi per livello con tre seed, errori piantati tutti bocciati, `width.mts` a 0. I controlli Python verificano anche la forma della risposta: radicale semplificato, denominatore razionalizzato, radicale irriducibile, così una risposta con il valore giusto ma non ridotta ($\sqrt{12}$ al posto di $2\sqrt{3}$) è sbagliata. Collegati al sito con i nomi dei livelli. Nel browser nessun errore di KaTeX; lo script segnala come larghi i bottoni con una radice, ma è il modo in cui KaTeX disegna il segno di radice (un'immagine molto larga, mostrata solo in parte): nelle schermate le opzioni si leggono per intero.
- Due agenti hanno fermato con `pkill -f verify.py` anche le verifiche degli altri: nessun file perso, ma le verifiche vanno rifatte, e Claude le ha rifatte tutte con il suo seed.
- Commit: lezioni a56a3c9, generatori 848218d.

## Domande aperte
Per Andrea (raccolte anche in [[Domande per Andrea]], dove si segnano le risposte), oltre ai dubbi in fondo a ogni nota (`docs/lezioni/note/68-79`) e a ogni specifica:
- la convenzione sulle lettere sotto radice (valori assoluti nella 72, lettere positive dalla 73) e il senso di "semplificare";
- le coppie soluzione dei sistemi: $(x, y)$ con la virgola, $S = \{(3, 2)\}$ nella 68 e "la coppia $(2, 1)$" nella 69;
- i nomi "regola di Cartesio", "permanenza" e "variazione" (77), e le lettere $s$ e $p$, che nella 36 hanno un altro segno;
- le approssimazioni per difetto dei numeri negativi (71): $-2{,}65$ per $-\sqrt{7}$;
- esercizi con il valore giusto in forma non ridotta tra le opzioni (livelli 1-4 della razionalizzazione, 1 e 5 delle espressioni): è giusto contarli come errori?
- il sasso lanciato in alto (79), che viene dalla fisica.

## Prossimo argomento
Push e deploy del settimo lotto; poi il secondo lotto del secondo anno: piano cartesiano e retta, parabola e disequazioni di secondo grado.
