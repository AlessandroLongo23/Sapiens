---
stato: idea
aggiornato: 2026-09-26
tag: [idea, lezioni, progressi]
---
# Mappa dei prerequisiti

## L'idea
Un grafo delle lezioni, gamificato o no, in cui gli archi sono i prerequisiti o i semplici link tra lezioni, magari di tipi diversi che lo studente può evidenziare e filtrare. Serve a dare allo studente una visione d'insieme dei concetti e delle competenze che sta acquisendo, e a spronarlo mostrandogli quello che ha imparato. Il grafo dei prerequisiti dovrebbe essere un DAG: la matematica si costruisce a blocchi, dalle fondamenta in su, e la visualizzazione potrebbe richiamare le costruzioni per bambini, una torre in cui ogni blocco poggia sui concetti più in basso.

Lo spunto: le lezioni hanno già molti link tra loro. In "Equazioni di primo grado" ce ne sono tre nel secondo paragrafo.

## Perché potrebbe valere
Lo studente vede dove si trova e cosa ha costruito. Lo stesso dato serve anche fuori dalla mappa: un riquadro "prima di cominciare" nella lezione e, quando una prova va male, il suggerimento di ripassare il prerequisito più debole.

## Dubbi e conflitti
- I link di oggi non sono prerequisiti. Al 25 settembre 2026 le 26 lezioni pubblicate hanno 101 link verso 35 lezioni diverse, in entrambe le direzioni: dei quattro link di "Equazioni di primo grado", tre puntano avanti (secondo grado, sistemi, disequazioni) e uno indietro (MCD e mcm), e le equazioni di primo e secondo grado si citano a vicenda. Il DAG va scritto a mano, lezione per lezione, e non si ricava dai link.
- Con 26 lezioni su 183, una mappa di tutta la matematica oggi sarebbe quasi vuota.
- Un grafo di 183 nodi sul telefono è difficile da leggere, e l'app è mobile-first (vedi [[2026-09-03 Mobile-first, poi PWA, poi Capacitor]]).
- Gli esercizi sono appena diventati un percorso lineare di livelli (vedi [[2026-09-25 Gli esercizi sono un percorso di livelli]]): la mappa deve convivere con quel percorso, non sostituirlo.
- La gamificazione deve rispettare le regole degli [[Adesivi]] e i [[Principi]]: niente classifiche, niente pressioni inventate.

## Prove di disposizione (26 settembre 2026)
Due anteprime dello stesso grafo del primo anno, fuori dal sito:
- Torre a piani fissi: https://claude.ai/artifact/CD85rTvQ4NnXviJfwvd5uX. Ogni lezione sta al piano più alto possibile, cioè sopra la catena di prerequisiti più lunga che ha sotto. Risultato: 18 piani, con geometria e logica schiacciate in basso accanto ai numeri.
- Albero delle abilità: https://claude.ai/artifact/MGpj14dz6FQ27iwpiKLUbY. Disposizione calcolata con ELK, a strati ma con gli strati liberi, e tra più ordini dei nodi si tiene quello con meno incroci. Archi ad angolo retto sui quadretti, zoom e trascinamento. Restano 10 incroci su 88 archi.

Contando gli archi come segmenti dritti:
- ELK con i piani fissi della torre lascia 45 incroci;
- ELK con gli strati liberi ne lascia 15;
- dagre, con le varie impostazioni, ne lascia tra 35 e 56.

La disposizione si può calcolare al momento della pubblicazione, così il sito non carica librerie per il grafo.

## Decisioni
Il 25 settembre 2026 i prerequisiti sono stati decisi come dato, per lezione e con un solo tipo di arco, e la torre è rimandata a dopo la beta: vedi [[2026-09-25 I prerequisiti si scrivono per lezione, con un solo tipo di arco]].

## Cosa si trova in giro
Ricerca sul web del 25 settembre 2026. Le voci "da verificare" sono fonti che non si sono potute aprire direttamente.

Nessun prodotto trovato usa un grafo completo delle lezioni come navigazione principale dello studente.
- Khan Academy aveva una "Knowledge Map" delle esercitazioni, su Google Maps, dal 2010 (Ben Kamens, "Constellation Knowledge", 23 novembre 2010). L'ha tolta intorno ad agosto 2013, con l'arrivo delle Missions. Secondo lo staff, nei forum di supporto, "la maggior parte di studenti e docenti trova che il percorso lineare funzioni meglio" (da verificare). Gli utenti la richiedono da dieci anni.
- Duolingo ha sostituito l'albero con un percorso lineare nel 2022: gli studenti "non sapevano se stavano usando Duolingo nel modo giusto" (blog Duolingo, 6 maggio 2022). Nel white paper del 2024 il percorso richiede più tempo e porta a risultati migliori dell'albero; il confronto è con studi precedenti, non con un test A/B.
- Math Academy ha circa 2.500 argomenti, con circa 5 prerequisiti ciascuno, scritti tutti a mano (Justin Skycak, justinmath.com, 13 novembre 2024), e un controllo automatico di cicli e connessione a ogni modifica. Il grafo del corso si mostra solo come immagine dei progressi, che si riempie man mano. Quando uno studente sbaglia due volte nello stesso punto di una lezione, il sistema gli assegna un ripasso del prerequisito collegato a quel punto; al primo errore lo lascia andare avanti e riprovare più tardi. Gli studenti erano confusi dal colore di un argomento finito ma non ancora consolidato.
- ALEKS usa il grafo solo nel motore; allo studente mostra una torta con una fetta per area.
- Edmentum Exact Path, "Building Blocks" (13 dicembre 2023): sotto l'80% in una verifica inserisce un prerequisito, presentato come il passo successivo e non come un ripasso; al secondo errore scende di un altro livello. È il caso più vicino al suggerimento deciso per la beta.
- Metacademy: nei test di usabilità nessuno ha trovato da solo la vista a grafo, e uno studente di dottorato l'ha trovata "troppo grande e complicata" e ha preferito l'elenco.
- In Italia nessuna piattaforma trovata mostra un grafo dei prerequisiti. La "mappa concettuale" però è uno strumento compensativo dei DSA (legge 170/2010, linee guida del DM 12 luglio 2011): per docenti e famiglie la parola "mappa" ha già quel significato.

Studi:
- Nesbit e Adesope, Review of Educational Research, 2006 (55 studi): studiare una mappa già pronta aiuta poco più di un testo o di uno schema, e aiuta gli studenti più deboli; usata per navigare non è meglio di un indice.
- Hanus e Fox, Computers & Education, 2015: in un corso di 16 settimane, badge e classifica hanno abbassato motivazione e risultati all'esame.

Modi di mostrare il grafo su un telefono:
- Vista locale: la lezione aperta, sotto i suoi prerequisiti diretti, sopra le lezioni che la usano. Regge qualunque dimensione del grafo, ed è una piccola torre.
- Grafo a strati (disposizione di Sugiyama), con i soli archi diretti. Sul telefono il limite è la larghezza di uno strato, non il numero di nodi. La libreria d3-dag dispone circa 184 nodi in 5 ms.
- Colonna unica in ordine topologico, con gli archi come archi laterali, come il percorso di Duolingo.
- Mappa della metropolitana, se le linee sono pochi temi.
- Griglia di quadrati per lezione o torta per area, senza archi (Khan Academy, ALEKS).

Cosa se ne ricava:
- La torre resta una vista secondaria. La navigazione principale resta il percorso dei livelli.
- Il suggerimento di ripasso va dopo un secondo errore allo stesso livello, non dopo il primo. Va presentato come il passo successivo.
- Un arco per lezione dice "qualcosa nella lezione X", non quale regola manca. Si può aggiungere, per ogni livello degli esercizi, il prerequisito chiave.
- Al massimo 3 o 4 prerequisiti diretti per lezione (Skycak). Gli archi stanno in un solo file o tabella controllata.
- Il colore di un blocco deve avere un significato che lo studente prevede.
- Sulla torre niente classifiche.
- Prima di investire in una grafica elaborata, misurare se gli studenti aprono la torre e se seguono il suggerimento.

## Collegamenti
- [[Lezioni]], [[Progressi dello studente]], [[Programma ministeriale]], [[Adesivi]]
