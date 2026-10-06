# Dualismo onda-particella e principio di indeterminazione

Generatore: `chim-onda-particella` (`src/lib/exercises/v2/generators/chim-onda-particella.ts`, con
`src/lib/exercises/v2/chim3-a.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_onda_particella.py` (con
`_chim3_a.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/51-chim-onda-particella.md`. Percorso nel database:
`high_school/chemistry/chim-struttura-elettronica/chim-onda-particella`.

Sei livelli, ognuno con una difficoltà in più. Tutto a scelta multipla, quattro opzioni; le risposte con unità hanno
l'unità nell'opzione. Costanti della lezione: $h = 6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s}$, massa dell'elettrone
$9{,}11 \cdot 10^{-31}\,\text{kg}$, massa del protone $1{,}67 \cdot 10^{-27}\,\text{kg}$; le masse sono sempre scritte nel
problema. Risultati a tre cifre in notazione scientifica, a due cifre dove i dati ne hanno due (oggetti di tutti i
giorni, principio di indeterminazione). Un risultato a meno di $0{,}08$ dall'arrotondamento dell'ultima cifra si
scarta; nessun distrattore con la stessa unità sta a meno del $4\%$ dalla risposta. Gli elettroni non superano
$10^7\,\text{m/s}$, un trentesimo della velocità della luce.

## Nomi dei livelli

1. La relazione di de Broglie, senza conti
2. La lunghezza d'onda di una particella
3. Con le unità da convertire
4. Dalla lunghezza d'onda alla velocità
5. Il principio di indeterminazione
6. Orbita e orbitale

## Livello 1: la relazione di de Broglie, senza conti

Tre casi in parti uguali.

- La velocità di un elettrone raddoppia, triplica, si dimezza o diventa un terzo: che cosa succede alla lunghezza
  d'onda. Distrattori: la stessa variazione (proporzionalità diretta), "resta uguale", "diventa quattro volte più
  grande".
- Due oggetti alla stessa velocità (elettrone, protone, atomo di elio, atomo di ferro, granello di polvere): quale ha
  la lunghezza d'onda più lunga, o più corta. Distrattori: l'altro, "hanno la stessa", "nessuno dei due ha una
  lunghezza d'onda".
- Per quale oggetto il comportamento da onda si può osservare: un elettrone, un protone o un atomo di elio tra tre
  oggetti grandi (pallina da tennis, granello di sabbia, automobile, pallone da calcio, goccia d'acqua, proiettile).

Esempi:

- "La velocità di un elettrone raddoppia. Che cosa succede alla sua lunghezza d'onda di de Broglie?" Risposta: si
  dimezza.
- "Un protone e un elettrone si muovono alla stessa velocità. Quale dei due ha la lunghezza d'onda di de Broglie più
  lunga?" Risposta: un elettrone.

## Livello 2: la lunghezza d'onda di una particella

$\lambda = h / (m\,v)$ per un elettrone (velocità $k \cdot 10^5$ o $k \cdot 10^6\,\text{m/s}$) o un protone (da
$k \cdot 10^3$ a $k \cdot 10^6\,\text{m/s}$), con $k$ da $1{,}00$ a $9{,}99$. Risposta in metri. Distrattori: la formula
rovesciata ($m\,v / h$), $h / m$ senza la velocità, $h\,v / m$, l'esponente sbagliato di uno.

- "Un elettrone, di massa $9{,}11 \cdot 10^{-31}\,\text{kg}$, si muove alla velocità di $2{,}19 \cdot 10^{6}\,\text{m/s}$. Qual
  è la sua lunghezza d'onda di de Broglie?" Risposta: $3{,}32 \cdot 10^{-10}\,\text{m}$.
- "Un protone, di massa $1{,}67 \cdot 10^{-27}\,\text{kg}$, si muove alla velocità di $2{,}19 \cdot 10^{6}\,\text{m/s}$. Qual è
  la sua lunghezza d'onda di de Broglie?" Risposta: $1{,}81 \cdot 10^{-13}\,\text{m}$.

## Livello 3: con le unità da convertire

Due casi in parti uguali. Un oggetto con la massa in grammi (pallina da tennis $57\,\text{g}$, pallina da golf
$46\,\text{g}$, biglia $5{,}2\,\text{g}$, pallone da calcio $430\,\text{g}$, pallina da ping pong $2{,}7\,\text{g}$) e la
velocità in metri al secondo, da $11$ a $99$ senza zero finale: risposta a due cifre; distrattori: i grammi non
convertiti (mille volte più piccola), la formula rovesciata, $h / m$. Oppure un elettrone a $k \cdot 10^6\,\text{m/s}$ e
la lunghezza d'onda chiesta in picometri, tra $100$ e $999$: distrattori i metri scritti come picometri, il fattore
sbagliato di dieci o di mille.

- "Una pallina da tennis di massa $57\,\text{g}$ si muove alla velocità di $51\,\text{m/s}$. Qual è la sua lunghezza
  d'onda di de Broglie?" Risposta: $2{,}3 \cdot 10^{-34}\,\text{m}$.
- "Un elettrone, di massa $9{,}11 \cdot 10^{-31}\,\text{kg}$, si muove alla velocità di $2{,}19 \cdot 10^{6}\,\text{m/s}$. Qual
  è la sua lunghezza d'onda di de Broglie, in picometri?" Risposta: $332\,\text{pm}$.

## Livello 4: dalla lunghezza d'onda alla velocità

Due casi in parti uguali. La velocità di un elettrone con una lunghezza d'onda da $100$ a $999\,\text{pm}$:
$v = h / (m\,\lambda)$; distrattori: i picometri non convertiti, la formula rovesciata, l'esponente sbagliato di uno.
Oppure una particella di cui sono date velocità e lunghezza d'onda, da riconoscere tra elettrone e protone calcolando
la massa $m = h / (\lambda\,v)$, che deve coincidere con una delle due entro lo $0{,}4\%$; distrattori: l'altra
particella, "nessuna delle due", "non si può stabilire".

- "Un elettrone, di massa $9{,}11 \cdot 10^{-31}\,\text{kg}$, ha una lunghezza d'onda di de Broglie di $332\,\text{pm}$. A
  che velocità si muove?" Risposta: $2{,}19 \cdot 10^{6}\,\text{m/s}$.
- "Una particella si muove alla velocità di $2{,}19 \cdot 10^{6}\,\text{m/s}$ e ha una lunghezza d'onda di de Broglie di
  $1{,}81 \cdot 10^{-13}\,\text{m}$. L'elettrone ha massa $9{,}11 \cdot 10^{-31}\,\text{kg}$, il protone
  $1{,}67 \cdot 10^{-27}\,\text{kg}$. Che particella è?" Risposta: un protone.

## Livello 5: il principio di indeterminazione

Tre casi: il calcolo ($50\%$), la proporzione ($25\%$), le affermazioni ($25\%$).

- Calcolo: $\Delta v = h / (4\pi\,m\,\Delta x)$ per un elettrone, con $\Delta x$ a due cifre tra $10^{-11}$ e
  $10^{-8}\,\text{m}$; risposta a due cifre. Distrattori: senza il $4\pi$, la formula rovesciata, senza la massa, il
  doppio, l'esponente sbagliato di uno.
- Proporzione: l'incertezza sulla posizione si dimezza, raddoppia, diventa un decimo o dieci volte più grande; quella
  minima sulla velocità fa il contrario. Distrattori: la stessa variazione, "resta uguale".
- Affermazioni: una vera tra tre sbagliate ($60\%$) o una sbagliata tra tre vere. Sbagliate: con strumenti abbastanza
  precisi l'indeterminazione si elimina; il principio vale solo per gli elettroni; la posizione di un elettrone non si
  può misurare in nessun modo; più è precisa la posizione, più è precisa la velocità; l'elettrone percorre un'orbita
  precisa che gli strumenti non riescono a seguire.

Esempi:

- "La posizione di un elettrone, di massa $9{,}11 \cdot 10^{-31}\,\text{kg}$, è nota con un'incertezza
  $\Delta x = 1{,}1 \cdot 10^{-10}\,\text{m}$. Qual è l'incertezza minima sulla sua velocità?" Risposta:
  $5{,}3 \cdot 10^{5}\,\text{m/s}$.
- "L'incertezza sulla posizione di un elettrone si dimezza. Che cosa succede all'incertezza minima sulla sua
  velocità?" Risposta: raddoppia.

## Livello 6: orbita e orbitale

Due casi: affermazioni su orbite e orbitali ($67\%$), una vera tra tre sbagliate o una sbagliata tra tre vere, e
l'esperimento che ha mostrato il comportamento da onda degli elettroni ($33\%$: la diffrazione attraverso un cristallo;
distrattori: la lamina d'oro, l'effetto fotoelettrico, i raggi catodici deviati). Sbagliate: l'orbitale è la
traiettoria dell'elettrone; è un'orbita misurata con meno precisione; i puntini sono tanti elettroni; fuori dalla
superficie disegnata l'elettrone non si trova mai.

- "Quale affermazione su orbite e orbitali è vera?" Risposta: un orbitale è la regione in cui è alta la probabilità di
  trovare l'elettrone.
- "Quale esperimento ha mostrato che gli elettroni si comportano anche come onde?" Risposta: la diffrazione di un
  fascio di elettroni attraverso un cristallo.

## Da evitare

- Elettroni più veloci di $10^7\,\text{m/s}$: la formula della lezione non vale più bene.
- Velocità in $\text{km/h}$: una seconda conversione nello stesso livello.
- Il principio di indeterminazione scritto con la quantità di moto $\Delta p$: la lezione usa $m\,\Delta v$.
- Domande sui nomi e sulle date degli esperimenti.

## Risposta aperta

Nessun livello: le risposte numeriche hanno un'unità, le altre sono frasi.
