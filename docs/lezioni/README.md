# Revisione delle lezioni di matematica

Le 18 lezioni pubblicate sul sito sono state riscritte il 23 settembre 2026 e caricate nel database lo
stesso giorno, al posto degli originali (colonna `theory` di `content_nodes`).

- `originali/`: il testo della colonna `theory` di `content_nodes` al 23 settembre 2026, con
  `index.json` (id, percorso, data di aggiornamento).
- `riscritte/`: le versioni nuove, quelle ora nel database.
- `note/`: per ogni lezione, gli errori trovati nell'originale, cosa è cambiato e i dubbi.
- `stile.md`: il brief con cui sono state scritte, proposta per lo standard di qualità.
- `url.md`: le lezioni di matematica con il loro URL, per i link interni (rigenerato dall'albero).
- `programma.md`: il confronto con le Indicazioni nazionali e con YouMath e Theoremz.
- `albero.md`: l'albero delle lezioni di matematica, applicato al database con
  `scripts/lezioni/tree.mts` (prima senza scrivere, poi con `--apply`).
- `prerequisiti.md`: il grafo dei prerequisiti (una riga per lezione), controllato con
  `scripts/lezioni/prerequisiti.mts`. `prerequisiti-layout.json` è la sua disposizione come albero
  delle abilità, generata da `node scripts/grafo/layout.mjs` (la prima volta serve `npm install` in
  `scripts/grafo`; con `--html file.html` scrive anche un'anteprima).
- `backup/`: i nodi di matematica com'erano prima della riorganizzazione del 24 settembre 2026.
- `pubblicate/`: la copia dell'ultima versione che lo script ha scritto nel database.

Le figure TikZ vengono compilate in SVG dallo script di pubblicazione (`scripts/figure/`, con
dipendenze proprie: la prima volta serve `npm install` in quella cartella), caricate nel bucket
`figure` di Supabase Storage e mostrate come `<img>` con il testo di `% alt`. Il funzionamento è
spiegato in `src/lib/content/figures.ts`.

Per tornare a un originale basta rimettere il suo file nella colonna `theory`. Per pubblicare una
versione nuova: `node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/publish.mts`
(prova), poi con `--apply`. Lo script scrive solo se nel database c'è ancora l'ultima versione che ha
pubblicato (`pubblicate/`, oppure `originali/` prima della prima pubblicazione): se qualcuno ha
modificato la lezione dall'interfaccia, la salta. Per correggere una lezione basta modificare il file
in `riscritte/` e rilanciare lo script.

Controllo automatico (formule KaTeX, link, formato dei riquadri, regole di stile):

```sh
node node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/check.mts docs/lezioni/riscritte/*.md
```

## Cosa c'era negli originali

- Tre lezioni sono troncate nel database, a metà frase: 04 (Sottoinsiemi e uguaglianza), 05 (Unione
  insiemistica), 18 (Funzioni iniettive, suriettive e biettive). Nella 18 un `$` rimasto aperto
  rompe le formule vicine.
- La 02 (Rappresentazione degli insiemi) è una copia della 01 (Prime definizioni).
- Errori di matematica in quasi tutte, per esempio: soluzioni "decimali o frazioni" con Δ non quadrato
  (sono irrazionali); $2{,}35 = \frac{27}{20}$ e $1{,}\overline{45} = \frac{145}{99}$ (sono
  $\frac{47}{20}$ e $\frac{16}{11}$); $3 - 8 = -5$ presentato come operazione in ℕ; l'algoritmo di
  Euclide descritto male; MCM di monomi calcolato sulle frazioni; "iniettiva e monotona sono
  indipendenti". L'elenco completo è nelle note.
- Stile: titoli numerati e con maiuscole all'inglese, separatori `---`, grassetto ovunque (fino a 50
  per lezione), trattini lunghi, `\mathrel{\char`≠}` al posto di `\neq`.

## Decisioni da prendere

Convenzioni da fissare una volta per tutte le lezioni:

1. Inclusione: $\subseteq$ e $\subset$ (scelta fatta) oppure $\subset$ e $\subsetneq$.
2. Sottoinsiemi impropri: $\emptyset$ e $A$ (scelta fatta) oppure solo $A$.
3. Cardinalità: $|A|$ (scelta fatta), $\text{card}(A)$ o $n(A)$.
4. Differenza tra insiemi: $A \setminus B$ (scelta fatta) oppure $A - B$.
5. MCD e MCM maiuscoli come nei titoli del sito, oppure m.c.m. come in molti libri.
6. Coefficiente di MCD e MCM tra monomi: MCD e MCM dei valori assoluti con coefficienti interi, 1 con
   coefficienti frazionari (scelta fatta), oppure sempre 1.
7. Equazione indeterminata: $S = \mathbb{R}$ (scelta fatta, con un riquadro su $\mathbb{Q}$) o
   $S = \mathbb{Q}$ al primo anno.
8. Elemento neutro di sottrazione e divisione: "non esiste" (scelta fatta) o "solo a destra".
9. Nomi: "monomia" per $ax^2 = 0$; "identità" per l'equazione indeterminata; la proprietà
   dissociativa, che alcuni libri non nominano.

Struttura del programma:

- La 03 (Operazioni e relazioni tra insiemi) tratta tutte le operazioni, perché le lezioni su
  intersezione, differenza, complementare e prodotto cartesiano sono vuote. Quando verranno scritte,
  la 03 va ridotta a una panoramica.
- La 11 copre anche il passaggio da frazione a decimale: rinominarla "Numeri decimali e frazioni"
  oppure spostare quella parte.
- La 10 spiega frazioni equivalenti e riduzione ai minimi termini, che forse vanno in "Operazioni in
  ℚ" (vuota).
- La 18 si sovrappone a "Dominio, codominio e immagine" e "Funzioni invertibili" (vuote).
- Le equazioni fratte e letterali non hanno una lezione nell'albero.

Figure: le 14 descritte nelle note come necessarie sono state disegnate in TikZ e controllate il 23
settembre 2026 (lezioni 02, 03, 04, 05, 07, 10, 18). Restano da fare solo quelle segnate come
facoltative nelle note.
I disegni TikZ della 03 sono stati corretti e controllati con Playwright, in chiaro e in scuro, il
23 settembre 2026 (l'intersezione colorava tutto il cerchio $B$).
