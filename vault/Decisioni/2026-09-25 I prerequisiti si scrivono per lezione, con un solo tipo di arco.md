---
stato: decisa
aggiornato: 2026-09-26
tag: [decisione, contenuti, progressi]
---
# I prerequisiti si scrivono per lezione, con un solo tipo di arco

## Decisione
Ogni lezione dichiara le lezioni che le servono come prerequisiti. Il grafo che ne esce è un DAG di lezioni, con un solo tipo di arco, letto nei due versi: "cosa mi serve" e "dove si usa". Il dato entra da subito nei lotti, insieme al suggerimento di ripassare il prerequisito più debole quando una prova va male; la mappa visiva (la torre di blocchi) arriva dopo la beta, disegnata con Dario.

## Perché
Alessandro, il 25 settembre 2026, ha proposto un grafo delle lezioni come vista d'insieme di quello che lo studente impara (vedi [[Mappa dei prerequisiti]]); le tre scelte sono le opzioni consigliate nella discussione dello stesso giorno.
- I link di oggi non bastano: dei 101 link nelle 26 lezioni pubblicate, molti puntano in avanti ("dove si usa") e alcune lezioni si citano a vicenda, quindi il grafo dei link ha cicli. I prerequisiti vanno scritti a parte.
- Grana della lezione e non del concetto: 183 nodi e i progressi esistono già per lezione. Scrivere i concetti costerebbe circa cinque volte tanto, senza progressi a quella grana.
- Un solo tipo di arco: "dove si usa" è l'arco dei prerequisiti letto al contrario. Altri tipi (applicazione, richiamo, analogia) aggiungono dati da mantenere senza un uso chiaro per lo studente.
- Tempi: il dato costa poco se si scrive insieme alla lezione, e il suggerimento dopo una prova rafforza il messaggio della beta (vedi [[2026-09-23 Pratica con progressi come messaggio principale]]). La torre oggi sarebbe quasi vuota (26 lezioni su 183) e toglierebbe tempo ai lotti e al diario.

## Conseguenze
- Ogni lotto aggiunge i prerequisiti delle sue lezioni, proposti da Claude e riletti con il resto da Andrea. Si riprendono anche le 26 lezioni già scritte.
- Serve un controllo automatico che rifiuti i cicli e tolga gli archi ridondanti (se A serve a B e B serve a C, l'arco A→C non si scrive).
- Da decidere: dove vive il dato (intestazione del file della lezione o tabella in Supabase), come si mostra il riquadro "Prima di cominciare" nella lezione, come si sceglie il prerequisito più debole dopo una prova.
- La torre: una per capitolo o per anno, mai tutta la matematica in una volta. Deve mostrare dall'alto il percorso dei livelli (vedi [[2026-09-25 Gli esercizi sono un percorso di livelli]]), non essere un secondo sistema di progressi.
- La ricerca sul web del 25 settembre 2026 (in [[Mappa dei prerequisiti]]) conferma la decisione. Aggiunge quattro proposte, ancora da discutere:
  - suggerire il ripasso dopo il secondo errore allo stesso livello, e non dopo il primo;
  - al massimo 3 o 4 prerequisiti diretti per lezione;
  - gli archi in un solo file o tabella controllata;
  - un prerequisito chiave per livello degli esercizi, dove l'arco per lezione è troppo generico.
- 26 settembre 2026: prima versione del grafo in `docs/lezioni/prerequisiti.md`, controllata da `scripts/lezioni/prerequisiti.mts`. Copre il primo anno (66 lezioni) ed Equazioni di secondo grado: 88 archi, 18 piani, nessun ciclo. Delle quattro proposte ne sono state adottate due, perché servivano per scrivere il primo arco: al massimo 4 prerequisiti diretti, archi in un solo file controllato. Gli archi delle lezioni scritte seguono il testo, gli altri l'ordine dei libri; i dubbi sono in fondo al file. Anteprima della torre: https://claude.ai/artifact/CD85rTvQ4NnXviJfwvd5uX (pagina di prova, non nel sito).

## Collegamenti
- [[Mappa dei prerequisiti]], [[Lezioni]], [[Progressi dello studente]], [[Pipeline lezioni]]
