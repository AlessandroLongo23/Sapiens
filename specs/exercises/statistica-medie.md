# Media, mediana e moda

Generatore: `statistica-medie` (`src/lib/exercises/v2/generators/statistica-medie.ts`). Verifica
indipendente: `scripts/exercises/checkers/statistica_medie.py`. Lezione collegata: "Media, mediana e
moda" (`docs/lezioni/riscritte/56-statistica-medie.md`), con la sezione "Per il generatore" della sua
nota (`docs/lezioni/note/56-statistica-medie.md`).

Lo studente calcola la media aritmetica di una lista, la media ponderata e la media da una tabella di
frequenze; trova la mediana di una lista non ordinata e di una tabella (con le frequenze cumulate);
trova la moda, anche di un carattere qualitativo, con due mode o senza moda; sceglie l'indice adatto
quando c'è un valore anomalo o in base al tipo di carattere; calcola la media approssimata di dati in
classi con i valori centrali. Frequenze relative, cumulate e classi sono della lezione 55 e qui si
usano senza ridefinirle.

## Rappresentazione

- Le liste di dati sono una riga di dati separati da `,\quad`: `-3,\quad 1,\quad 0,\quad -2`. La
  pagina (`present.ts`) le mostra come una riga di dati con le virgole, che va a capo sul telefono.
  Sopra, quando c'è un contesto, una frase con `textBlock`.
- Le tabelle di frequenze sono verticali come nella lezione, due colonne con una riga orizzontale
  sotto l'intestazione: `\begin{array}{c|c} \text{Voto }x_i & \text{Frequenza }f_i \\ \hline 4 & 2
  \\ 5 & 3 \end{array}`. La colonna dei prodotti $x_i \cdot f_i$ e quella delle cumulate non ci sono:
  le costruisce lo studente, e compaiono nei passaggi. Le classi si scrivono `[0, 10[` (tra graffe
  nella tabella, perché dopo `\\` una parentesi quadra si leggerebbe come una misura).
- I voti e i pesi della media ponderata sono una tabella orizzontale di due righe, `Voto` e `Peso`.
- `params` ha i dati come interi in stringa (`data`, oppure `values` e `freqs`, `marks` e `weights`,
  `lows`, `width` e `freqs`), il contesto, `case` (il caso di cui la verifica controlla la quota) e,
  per le risposte numeriche, `mistakes`: i valori sbagliati da cui nasce la scelta multipla.

## Regole comuni

- Virgola decimale (`6{,}52`), `\cdot`, frazioni con `\dfrac`, $\bar{x}$ per la media e
  $\text{Me}$ per la mediana, come nella lezione. Da cinque cifre lo spazio sottile (`15\,300`), come
  $13\,000$ nell'esempio 8; $7800$ e $2600$ senza.
- Numeri belli per costruzione: i dati si estraggono (o si completano, come il valore anomalo del
  livello 6) finché media e mediana sono intere o decimali con al massimo due cifre dopo la virgola.
  Nessuna risposta, opzione o passaggio ha un numero periodico o più di due decimali.
- La risposta è `number` (un razionale esatto, `"163/25"`) ai livelli 1, 2, 3, 4, 7 e nei casi
  "mediana" e "moda" del livello 5; è `choice` nei casi qualitativi del livello 5 e al livello 6.
- Scelta multipla: quattro opzioni diverse per valore e per testo. Per le risposte numeriche prima i
  distrattori degli errori della lezione (quando sono decimali con al massimo due cifre e diversi
  dalla risposta), poi i vicini della risposta (passo $1$, $0{,}5$ o $0{,}1$).
- Nel testo niente trattini lunghi e niente parole vietate dalle regole di scrittura; decimali mai con il punto.

## Livello 1: media aritmetica di una lista

Da 4 a 7 dati interi. Quattro contesti, un quarto ciascuno: numeri senza contesto (da $-9$ a $15$),
temperature minime in gradi (da $-6$ a $9$), punti di basket (da $2$ a $25$), voti (da $3$ a $10$).
Nei primi due c'è sempre almeno un dato negativo, e lo zero compare spesso, come nell'esempio 1. Al
più un valore ripetuto. Media intera in metà dei casi, decimale con al massimo due cifre nell'altra.

- `0, 10, -2, -5` $\Rightarrow \bar{x} = \dfrac{3}{4} = 0{,}75$; opzioni $0{,}75$, $1$ (lo zero non
  contato: $3 : 3$), $4{,}25$ (i segni ignorati: $17 : 4$), $-1$.
- Temperature `2, 8, 4, 1, -1` $\Rightarrow \bar{x} = 2{,}8$.

Distrattori: la somma divisa per $n - 1$ quando c'è uno zero (l'avviso dell'esempio 1: lo zero conta
nel denominatore), la somma dei valori assoluti divisa per $n$ (i negativi sommati come positivi), la
mediana, la somma divisa per $n + 1$.

## Livello 2: media ponderata dei voti

Tre voti (60%) o quattro (40%), diversi, da $3$ a $10$; pesi da $1$ a $3$, non tutti uguali. La media
ha al massimo due decimali, sta tra il voto più basso e il più alto ed è diversa dalla media semplice
(altrimenti i pesi non contano). Il testo è quello dell'esempio 2: "Nel primo periodo Anna ha preso
questi voti in storia. Il peso dice quante volte conta ogni voto.", con la tabella voto-peso.

- Voti $6, 9, 7, 8$ con pesi $3, 1, 1, 1$ $\Rightarrow \bar{x} = \dfrac{42}{6} = 7$; opzioni $7$,
  $10{,}5$ ($42 : 4$), $7{,}5$ (media semplice), $6$.
- Voti $8, 3, 9, 10$ con pesi $3, 1, 3, 1$ $\Rightarrow \bar{x} = \dfrac{64}{8} = 8$; tra le opzioni
  $16$ ($64 : 4$).

Distrattori: la somma dei prodotti divisa per il numero dei voti (l'avviso "Dividere per il numero
dei dati", che dà anche voti impossibili come $11$ o $16$: la lezione lo usa proprio così), la media
semplice dei voti, la somma dei prodotti divisa per la somma dei pesi più uno.

## Livello 3: media da una tabella di frequenze

Cinque contesti, un quinto ciascuno: voti di una verifica (5 o 6 voti consecutivi da $3$-$5$ in su),
fratelli e sorelle ($0$-$3$ o $0$-$4$), gol per partita ($0$-$3$ fino a $0$-$5$), libri letti
d'estate, numeri di scarpe (da $36$-$38$, 5 o 6 numeri). Frequenze da $1$ a $8$ o $9$, $n$ tra $10$
e $30$, scritto nel testo come nell'esempio 3. Media con al massimo due decimali.

- Libri $0, 1, 2, 3$ con frequenze $4, 2, 2, 4$, $n = 12$ $\Rightarrow \bar{x} = \dfrac{18}{12} =
  1{,}5$; opzioni $1{,}5$, $4{,}5$ ($18 : 4$ righe), $2$, $1$.
- Libri $0, \dots, 4$ con frequenze $3, 7, 1, 7, 2$, $n = 20$ $\Rightarrow \bar{x} = 1{,}9$; tra le
  opzioni $7{,}6$ ($38 : 5$ righe) e $2$ (la media dei valori senza frequenze).

Distrattori: la somma dei prodotti divisa per il numero delle righe (l'avviso "Dividere per il numero
delle righe"), la media dei valori senza le frequenze, la mediana dei dati.

## Livello 4: mediana di una lista non ordinata

$n$ dispari ($5$, $7$, $9$) o pari ($6$, $8$, $10$), metà ciascuno. Quattro contesti: numeri (da $-5$ a
$20$), minuti per finire un test, punti di pallavolo, altezze in centimetri. Valori ripetuti ammessi
(al più due ripetizioni). La lista non è già in ordine crescente e il dato scritto al centro (o la
media dei due scritti al centro, con $n$ pari) non è la mediana: così l'errore dell'avviso "Prendere il
dato al centro senza ordinare" dà sempre una risposta sbagliata. Con $n$ pari la mediana può essere
un decimale con $,5$ (esempio 5).

- `-1, -4, 6, 10, 15, 2` $\Rightarrow$ in ordine $-4, -1, 2, 6, 10, 15$, $\text{Me} = \dfrac{2 +
  6}{2} = 4$; opzioni $4$, $8$ (centro scritto: $\frac{6 + 10}{2}$), $3{,}5$ (il posto
  $\frac{n + 1}{2}$), $2$ (solo il primo dei due centrali).
- Minuti `18, 27, 21, 17, 14, 25` $\Rightarrow \text{Me} = 19{,}5$.

Distrattori: il centro della lista come è scritta, il posto $\frac{n + 1}{2}$ al posto del valore
(l'avviso "Confondere il posto con il valore"), la media, e con $n$ pari il solo primo dei due dati
centrali.

## Livello 5: mediana e moda da una tabella

Sette casi:

| Caso | Quota | Cosa si chiede |
|---|---|---|
| `mediana-dispari` | 20% | mediana da tabella, $n$ dispari |
| `mediana-pari-uguali` | 20% | $n$ pari, i due posti centrali nello stesso valore |
| `mediana-pari-diversi` | 20% | $n$ pari, i due posti centrali in valori diversi (esempio 6) |
| `moda` | 15% | moda di una tabella numerica |
| `moda-qualitativa` | 15% | moda di un carattere qualitativo (esempio 7) |
| `bimodale` | 6,7% | moda di una lista con due mode |
| `senza-moda` | 3,3% | lista in cui tutti i valori hanno la stessa frequenza |

Le tabelle numeriche sono quelle del livello 3, con $n$ tra $11$ e $30$. Nei passaggi della mediana
ci sono le frequenze cumulate e i posti occupati da ogni valore, come nell'esempio 6.

- Mediana: libri $0, \dots, 4$ con frequenze $6, 8, 5, 2, 7$, $n = 28$: cumulate $6, 14, 19, 21,
  28$, posti centrali $14$ e $15$, il $14$ è $1$ e il $15$ è $2$ $\Rightarrow \text{Me} = 1{,}5$;
  opzioni $1{,}5$, $14{,}5$ (il posto), $1$ (solo il quattordicesimo), $2$.
- Moda numerica: gol $0, \dots, 5$ con frequenze $7, 1, 1, 5, 6, 2$ $\Rightarrow$ moda $0$; opzioni
  $0$, $7$ (la frequenza), $3$, $4$.
- Moda qualitativa: gusti di gelato, cioccolato con frequenza $12$ $\Rightarrow$ "cioccolato";
  opzioni "cioccolato", $12$, "vaniglia" (la seconda frequenza), "fragola".
- Bimodale: `2, 7, 7, 10, 8, 10` $\Rightarrow$ due mode, $7$ e $10$; opzioni "$7$ e $10$", $7$, $10$,
  "non c'è moda".

Vincoli: nella moda numerica la moda è unica e diversa dalla sua frequenza (altrimenti il distrattore
"frequenza" coinciderebbe con la risposta); nella qualitativa 4 o 5 modalità in ordine casuale,
frequenze da $2$ a $12$, moda unica; le liste hanno da $5$ a $10$ dati tra $1$ e $12$. Senza moda: tre
o quattro valori ripetuti lo stesso numero di volte, oppure da tre a sei valori diversi.

Distrattori: il posto al posto del valore, il valore del solo primo posto centrale, la moda, il valore
della riga di mezzo della tabella, la media (mediana); la frequenza più alta (l'avviso "Scrivere la
frequenza al posto del valore"), la mediana, il valore con la seconda frequenza, il valore più grande
(moda numerica); la frequenza e altre due modalità (qualitativa); una sola delle due mode e "non c'è
moda" (bimodale); il valore più piccolo, quello di mezzo e il più grande (senza moda).

## Livello 6: quale indice usare

Due casi.

`anomalo` (60%): da 5 a 7 dati con un valore anomalo, nei contesti dell'esempio 8 e simili: stipendi
mensili (base da $1100$ a $1700$ euro, anomalo da $5500$ a $9000$), prezzi di appartamenti in
migliaia di euro (base $110$-$200$, anomalo $600$-$900$), minuti di attesa in pizzeria (base $10$-$30$,
anomalo $90$-$150$), paghetta settimanale (base $5$-$20$, anomalo $60$-$100$). Il valore anomalo è
almeno il triplo del secondo dato più grande, ed è scelto in modo che la media sia intera. La lista
non è ordinata e il centro scritto non è la mediana. La domanda chiede l'indice che descrive meglio i
dati con il suo valore; le opzioni sono `\text{la mediana: }1325`, `\text{la media: }2550`,
`\text{la mediana: }5000` (centro senza ordinare), `\text{la media: }3060` (divisa per $n - 1$, o
$n + 1$, o la media più un passo se nessuna delle due è un decimale con due cifre).

- Stipendi `1100, 1100, 1200, 8800, 1650, 1450` $\Rightarrow \bar{x} = 2550$, $\text{Me} = 1325$:
  risposta "la mediana: $1325$".
- Paghette o attese con $n$ dispari: la mediana è il dato al posto $\frac{n + 1}{2}$.

`carattere` (40%): "In una classe si chiede a ogni studente il gusto di gelato preferito." Quali indici
si possono calcolare? Diciassette caratteri, un terzo qualitativi non ordinabili (colore, mezzo, sport,
gelato, genere musicale, materia), un terzo qualitativi ordinabili con le modalità tra parentesi
(giudizio, gradimento della matematica, taglia, frequenza di lettura, livello di inglese), un terzo
quantitativi (fratelli, altezza, minuti, ore di sonno, libri letti, numero di scarpe). Opzioni sempre
nello stesso ordine: "solo la moda", "mediana e moda", "media e moda", "media, mediana e moda". Le
risposte vengono dalla tabella "Quale indice usare" della lezione.

## Livello 7: media di dati in classi

Da 3 a 5 classi della stessa ampiezza, contigue, scritte `[a, b[`; frequenze da $1$ a $12$, $n$ tra
$10$ e $40$ scritto nel testo. Quattro contesti, un quarto ciascuno: minuti per arrivare a scuola
(ampiezza $5$ o $10$, da $0$), altezze in centimetri (ampiezza $5$ o $10$, da $140$-$160$), punteggi di
un test (ampiezza $10$, da $40$-$60$), peso dello zaino in chilogrammi (ampiezza $2$, da $2$ o $4$).
La media approssimata ha al massimo due decimali.

- Punti $[50, 60[, \dots, [90, 100[$ con frequenze $4, 3, 8, 7, 10$, $n = 32$ $\Rightarrow \bar{x}
  \approx \dfrac{2560}{32} = 80$; opzioni $80$, $75$ (estremi inferiori), $85$ (estremi superiori),
  $512$ (divisa per le classi).
- Punti $[40, 50[, \dots, [70, 80[$ con frequenze $2, 1, 12, 10$ $\Rightarrow \bar{x} \approx 67$.

Distrattori: gli estremi inferiori o superiori al posto dei valori centrali ($\bar{x} \mp$ metà
ampiezza), la somma dei prodotti divisa per il numero delle classi, la media dei soli valori centrali.

## Verifica

Il controllo Python rilegge i dati dal LaTeX del problema (la riga dei dati, le tabelle, le classi) e
li confronta con `params`; ricalcola media, mediana e moda con `Fraction` e il modulo `statistics`
sui dati espansi dalle tabelle; controlla i vincoli di ogni livello, che $n$ sia scritto nel testo,
che ogni opzione dica il valore che dichiara (rileggendo il numero dal LaTeX), che le opzioni siano
quattro e diverse, che una sola sia giusta e che `correct` la indichi, che i distrattori con nome (la
media divisa per le righe al livello 3, per il numero dei voti al livello 2, il centro scritto e il
posto al livello 4, la frequenza nella moda, la media e il centro scritto al livello 6) ci siano
quando sono scrivibili. Il tipo del carattere al livello 6 viene da una tabella scritta nel
controllo, non dal generatore.

Esito (26 settembre 2026, 1.000 esercizi per livello): PASS con seed 1 e con seed 7001, 7.000 su
7.000. Quote dei casi dentro gli intervalli di `CASE_RANGES`.

Esercizi diversi su 1.000 (seed 1 / seed 7001): livello 1 1.000 / 1.000, livello 2 998 / 997,
livello 3 989 / 992, livello 4 1.000 / 1.000, livello 5 999 / 997, livello 6 615 / 621, livello 7
977 / 975. Al livello 6 il caso `carattere` ha solo 17 esercizi possibili (uno per carattere):
basta, perché la domanda è di riconoscimento e le opzioni sono sempre le stesse quattro; il caso
`anomalo` è quasi sempre nuovo.

Errori piantati a mano, tutti bocciati: risposta cambiata (livello 1); opzione con il LaTeX che non
dice il suo valore; pesi tutti uguali (livello 2); `correct` spostato (livello 3); distrattore "diviso
per le righe" tolto; tabella del problema diversa da `params`; lista già ordinata (livello 4);
risposta uguale al centro scritto; frequenza al posto della moda (livello 5); caso della mediana
sbagliato; opzione giusta sulla frequenza nella moda qualitativa; una sola moda in una lista
bimodale; "la media" come risposta con un valore anomalo (livello 6); carattere qualitativo con la
risposta "media, mediana e moda"; valore anomalo tolto; classi non contigue (livello 7); estremi
inferiori al posto dei valori centrali.

Larghezza (`width.mts`, 150 esercizi per livello): nessuna formula del problema oltre 350 px, la più
larga è una tabella di $244$ px; nessuna opzione oltre 252 px, la più larga "media, mediana e moda"
con $184$ px.

## Figure

Nessun livello ne ha bisogno: i dati stanno in liste e tabelle. Il livello 7 potrebbe mostrare
l'istogramma delle classi, e il livello 6 la retta con media e mediana dell'esempio 8, ma sarebbero
un aiuto in più, non una condizione per capire il testo.

## Domande per la revisione

- Livello 5, caso `senza-moda`: la lezione dice che quando tutti i valori hanno la stessa frequenza la
  distribuzione non ha moda, e la nota segnala che alcuni libri dicono invece che tutti i valori sono
  mode. Per questo nelle opzioni non c'è "tutti i valori" e il caso è raro (3%). Se il libro in uso
  segue l'altra convenzione, il caso va tolto.
- Livello 6, caso `anomalo`: la risposta è sempre "la mediana", e lo studente attento lo capisce senza
  calcolare; le opzioni lo obbligano però a trovarne il valore, e due delle quattro dicono "la
  mediana". Serve anche un caso senza valori anomali in cui la risposta è "la media"? La lezione dice
  che senza valori anomali si usa la media, ma lì media e mediana sono vicine e la scelta sarebbe
  discutibile.
- Livello 6, caso `carattere`: "media e moda" è un distrattore che nessun carattere rende giusto. Va
  bene, o meglio una frase ("nessuno dei tre")? E il numero di scarpe è quantitativo: qualcuno
  potrebbe vederlo come una taglia, cioè ordinabile.
- Livello 7: nel contesto dei punteggi l'ultima classe può essere $[90, 100[$, che esclude $100$; il
  testo non dice qual è il punteggio massimo.
