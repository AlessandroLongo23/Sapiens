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
  `scripts/lezioni/prerequisiti.mts`; con `--write` rigenera `src/lib/content/prerequisiti.json`, che le
  pagine delle lezioni leggono per "Prima di cominciare" e "Dove si usa". `prerequisiti-layout.json` è la sua disposizione come albero
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

## Il piano cartesiano con i cursori

Un blocco `grafico` monta nella lezione il piano del plotter, con le formule già scritte: lo studente muove i
cursori e legge, non scrive. Messo subito dopo una figura TikZ la prende come copertina: la pagina mostra la
figura, e il bottone "Prova tu" mette il piano al suo posto (la figura resta per Google Immagini e per la stampa);
la croce nell'angolo del piano la riporta.
Da solo, il piano compare quando la pagina ci arriva.

````
```grafico
% nome: parabola-vertice-discriminante
% alt: La parabola y = ax² + bx + c con i cursori dei tre coefficienti, il discriminante e il vertice
curva: f(x)=ax^2+bx+c | nome
curva: y=x^2 | tratteggiata | grigio
cursore: a = 1 da -3 a 3 passo 0,1
cursore: b = -4 da -6 a 6 passo 0,1
cursore: c = 3 da -6 a 6 passo 0,1
finestra: x da -6 a 8, y da -5 a 7
valore: \Delta = b^2-4ac
valore: V = \left(-\frac{b}{2a};c-\frac{b^2}{4a}\right)
domanda: Muovi $c$ finché $\Delta = 0$: dove sta il vertice?
```
````

Una riga, una cosa:
- `curva:` una formula come la legge il plotter (funzione, equazione, disequazione, punto `A=(2;1)`, curva in
  `t`), poi l'aspetto dopo ` | `: `tratteggiata`, `a punti`, `sottile`, `spessa`, `nome` (la lettera accanto alla
  curva), un colore (`blu`, `rosso`, `verde`, `arancione`, `viola`, `verde acqua`, `magenta`, `nero`, `grigio`),
  `t da 0 a 2pi`.
- `scelta:` una delle formule tra cui sceglie un controllo a segmenti, `etichetta :: formula`, con un colore suo
  dopo ` | ` se serve (blu dove il trinomio è positivo, rosso dove è negativo); servono almeno due righe, e fanno
  una sola curva.
- `cursore:` `a = 1 da -3 a 3 passo 0,5`; con `anima` in fondo ha il bottone che lo muove da solo. Ogni lettera
  delle formule deve avere il suo.
- `finestra:` `x da -6 a 6, y da -4 a 8`. I due assi hanno la stessa scala; con `forma: 3:2` (larghezza e
  altezza del disegno) la scala dell'asse y si adatta, per i grafici di fisica.
- `valore:` un nome, `=`, e un'espressione dei parametri, o una coppia di coordinate: sta scritto sotto il piano
  e segue i cursori.
- `assi:` i nomi dei due assi, `t (s), s (m)`. `sposta: sì` lascia spostare e ingrandire la finestra.
- `domanda:` cosa provare, sotto il piano; le formule tra dollari.

Un blocco che non si legge non compare nella pagina (resta la figura di copertina): lo segnala il controllo
automatico qui sotto. Per vederlo prima di pubblicare, con il sito in sviluppo:
`/prova-grafico/lezione?file=riscritte/87-funzioni-quadratiche.md` (senza `file` apre `prove/grafico.md`, con
un esempio per ogni pezzo).

## I programmi da eseguire

Un blocco `codice` mette nella lezione l'editor con un programma che lo studente esegue e modifica. Il linguaggio
sta sulla riga del blocco: `python`, `c` oppure `cpp`. Il programma gira nel browser dello studente.

````
```codice python
for i in range(1, 6):
    print(i, "al quadrato fa", i * i)
```
````

Più blocchi uno dopo l'altro, separati solo da righe vuote e ciascuno in un linguaggio diverso, sono lo stesso
programma in più linguaggi: la pagina ne mostra uno, con una linguetta per linguaggio, e la scelta dello studente
vale per tutti i programmi e per le visite successive.

Con le prove il blocco è un esercizio. Le righe che cominciano con `%%` aprono le altre parti:

````
```codice python
n = int(input())
somma = 0
# scrivi qui il ciclo

print(somma)
%% soluzione
n = int(input())
somma = 0
for i in range(1, n + 1):
    somma += i

print(somma)
%% prova
4
%% stampa
10
%% prova
100
%% stampa
5050
```
````

- Prima di ogni `%%` c'è il programma di partenza, quello che lo studente trova nell'editor.
- `%% soluzione` è un programma che supera le prove; lo studente lo vede con il tasto "Soluzione".
- `%% prova` apre le righe che il programma legge, `%% stampa` quello che deve scrivere. "Verifica" esegue il
  programma su ogni prova e confronta l'uscita, senza contare gli spazi in fondo alle righe. Le prove si scrivono in
  un solo blocco e valgono per tutti i linguaggi.
- Nelle prove di Python la domanda di `input("...")` non viene stampata, quindi non entra nel confronto. In C e in
  C++ il programma dell'esercizio non deve scrivere domande prima di leggere.
- La consegna si scrive nel testo della lezione, prima del blocco.

Cosa c'è: in Python la libreria standard, `turtle` (ridisegnata per il browser), `numpy` e `matplotlib`; in C la
libreria standard; in C++ la libreria standard senza le eccezioni (`try`, `catch` e `throw` non compilano). Un
programma si ferma dopo 10 secondi o dopo 100.000 caratteri stampati.

Il controllo automatico qui sotto legge i blocchi. Le soluzioni si eseguono davvero sulle loro prove, nei tre
linguaggi, con:

```
node node_modules/jiti/lib/jiti-cli.mjs scripts/codice/verifica.mts docs/lezioni/informatica/riscritte/*.md
```

Per vedere i blocchi prima di pubblicare, con il sito in sviluppo: `/prova-grafico/lezione?file=prove/codice.md`
(oppure `/prova-codice/lezione`, che esiste anche nel sito pubblicato).

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
