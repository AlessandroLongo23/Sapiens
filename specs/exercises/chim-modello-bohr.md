# Il modello atomico di Bohr

Generatore: `chim-modello-bohr` (`src/lib/exercises/v2/generators/chim-modello-bohr.ts`, con
`src/lib/exercises/v2/chim3-a.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_modello_bohr.py` (con
`_chim3_a.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/49-chim-modello-bohr.md`. Percorso nel database:
`high_school/chemistry/chim-struttura-elettronica/chim-modello-bohr`.

Cinque livelli, ognuno con una difficoltà in più. I primi quattro a scelta multipla, quattro opzioni; il quinto ha per
risposta un numero intero, e va anche a risposta aperta. Solo l'atomo di idrogeno, livelli da $1$ a $6$.

I numeri seguono il procedimento della lezione:

1. le energie dei livelli sono quelle della sua tabella, $E_n = -2{,}18 \cdot 10^{-18}\,\text{J} / n^2$ a tre cifre:
   $-2{,}18 \cdot 10^{-18}$, $-5{,}45 \cdot 10^{-19}$, $-2{,}42 \cdot 10^{-19}$, $-1{,}36 \cdot 10^{-19}$,
   $-8{,}72 \cdot 10^{-20}$, $-6{,}06 \cdot 10^{-20}\,\text{J}$;
2. l'energia di un salto è la differenza tra due di questi valori, a tre cifre;
3. la lunghezza d'onda è $h\,c / \Delta E$ con quel $\Delta E$, $h = 6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s}$ e
   $c = 3{,}00 \cdot 10^8\,\text{m/s}$, a tre cifre: $656$, $486$, $434$, $411\,\text{nm}$ per la serie di Balmer.

Il salto tra i livelli $1$ e $2$ ha $\Delta E = 1{,}635 \cdot 10^{-18}\,\text{J}$, che cade su un arrotondamento: non
compare dove si chiede l'energia o la lunghezza d'onda. Il salto tra $1$ e $3$ ha $\lambda = 102{,}5\,\text{nm}$: non
compare dove si chiede la lunghezza d'onda.

## Nomi dei livelli

1. Orbite e stati
2. L'energia di un livello
3. L'energia di un salto
4. La lunghezza d'onda di una riga
5. Dalla riga al livello

## Livello 1: orbite e stati

Tre casi in parti uguali.

- Raggio dell'orbita $n$ (da $2$ a $6$): $r_n = n^2 \cdot 52{,}9\,\text{pm}$, tre cifre ($212$, $476$, $846\,\text{pm}$,
  $1{,}32 \cdot 10^3$, $1{,}90 \cdot 10^3\,\text{pm}$). Distrattori: $n \cdot 52{,}9$, $52{,}9 / n^2$, $2n \cdot 52{,}9$.
- Verso del salto: dal livello $a$ al livello $b$, l'atomo "assorbe un fotone" o "emette un fotone". Distrattori: il
  contrario, "non scambia energia", "perde il suo elettrone".
- Stato: con l'elettrone nel livello $n$ l'atomo è "nello stato fondamentale" ($n = 1$, il $40\%$ delle volte) o "in
  uno stato eccitato". Distrattori: "non è più un atomo: è uno ione", "in uno stato che non esiste".

Esempi:

- "Nel modello di Bohr la prima orbita dell'idrogeno ha raggio $52{,}9\,\text{pm}$. Qual è il raggio dell'orbita con
  $n = 3$?" Risposta: $476\,\text{pm}$.
- "L'elettrone di un atomo di idrogeno passa dal livello $n = 4$ al livello $n = 2$. Che cosa fa l'atomo?" Risposta:
  emette un fotone.

## Livello 2: l'energia di un livello

Tre casi: l'energia del livello $n$ da $2$ a $6$ ($50\%$; distrattori: senza il segno meno, diviso $n$ e non $n^2$,
moltiplicato per $n^2$); il livello che ha una data energia ($25\%$; distrattori: $n^2$, $n \pm 1$); in quale di due
livelli l'elettrone ha più, o meno, energia ($25\%$; distrattori: l'altro, "è la stessa nei due livelli", "dipende
dalla temperatura").

- "Qual è l'energia dell'elettrone dell'idrogeno nel livello $n = 3$?" Risposta: $-2{,}42 \cdot 10^{-19}\,\text{J}$.
- "In quale dei due livelli l'elettrone dell'idrogeno ha più energia: $n = 1$ oppure $n = 3$?" Risposta: nel livello 3.

## Livello 3: l'energia di un salto

L'energia del fotone emesso o assorbito tra due livelli ($75\%$; distrattori: la somma delle due energie, la differenza
calcolata con $1/n$ al posto di $1/n^2$, l'energia di uno solo dei due livelli), oppure l'energia per staccare
l'elettrone dal livello $n$ da $1$ a $4$ ($25\%$; distrattori: il valore con il segno meno, diviso $n$, moltiplicato per
$n^2$).

- "L'elettrone di un atomo di idrogeno scende dal livello $n = 3$ al livello $n = 2$. Quanta energia ha il fotone che
  l'atomo emette?" Risposta: $3{,}03 \cdot 10^{-19}\,\text{J}$.
- "L'elettrone di un atomo di idrogeno è nel livello $n = 2$. Quanta energia serve per staccarlo dall'atomo?"
  Risposta: $5{,}45 \cdot 10^{-19}\,\text{J}$.

## Livello 4: la lunghezza d'onda di una riga

Tre casi. La lunghezza d'onda della riga emessa in un salto che arriva ai livelli $1$, $2$ o $3$ ($50\%$): in
nanometri, numero di tre cifre sotto i $1000\,\text{nm}$, notazione scientifica sopra; distrattori: $\lambda$ dalla
somma delle energie, i metri scritti come nanometri, l'esponente sbagliato di uno. La serie e la regione dello spettro
dal livello di arrivo ($25\%$): "Lyman, ultravioletto", "Balmer, visibile", "Paschen, infrarosso"; distrattori: le
altre serie, la serie giusta con la regione sbagliata. Quale di due salti che arrivano allo stesso livello dà la riga
con la lunghezza d'onda più corta, o più lunga ($25\%$).

- "L'elettrone di un atomo di idrogeno scende dal livello $n = 4$ al livello $n = 2$. Qual è la lunghezza d'onda della
  luce emessa?" Risposta: $486\,\text{nm}$.
- "Nell'atomo di idrogeno, quale dei due salti dà la riga con la lunghezza d'onda più corta: $3 \to 2$ oppure
  $5 \to 2$?" Risposta: $5 \to 2$.

## Livello 5: dalla riga al livello

Risposta: un numero intero da $2$ a $6$. Due casi in parti uguali: data la lunghezza d'onda di una riga della serie di
Lyman o di Balmer, il livello da cui è sceso l'elettrone; dato il livello di partenza (da $1$ a $3$) e l'energia del
fotone assorbito, il livello di arrivo. Distrattori: $n \pm 1$, il livello dato, $n^2$.

- "Una riga della serie di Balmer dell'idrogeno ha lunghezza d'onda $434\,\text{nm}$. Da quale livello $n$ è sceso
  l'elettrone?" Risposta: $5$.
- "Un atomo di idrogeno con l'elettrone nel livello $n = 1$ assorbe un fotone di energia $1{,}94 \cdot 10^{-18}\,\text{J}$.
  In quale livello $n$ arriva l'elettrone?" Risposta: $3$.

## Da evitare

- Atomi diversi dall'idrogeno: il modello non li descrive.
- Livelli oltre il $6$: le energie si confondono a tre cifre.
- I salti $1$-$2$ e $1$-$3$ dove il risultato cade su un arrotondamento (vedi sopra).
- Lunghezze d'onda di salti tra i livelli $4$, $5$ e $6$: la lezione non ne parla.

## Risposta aperta

Livello 5: il valore (un numero intero). `'chim-modello-bohr': { 5: V }`.
