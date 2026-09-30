# Il diagramma delle forze

Generatore: `fis-diagramma-corpo-libero` (`src/lib/exercises/v2/generators/fis-diagramma-corpo-libero.ts`, con
`src/lib/exercises/v2/fis-dinamica.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_diagramma_corpo_libero.py` (con `_dinamica.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/53-fis-diagramma-corpo-libero.md`. Percorso nel database:
`high_school/physics/dinamica/fis-diagramma-corpo-libero`.

Sei livelli, ognuno con una difficoltà in più: prima si contano le forze, poi si usano le componenti, poi l'ascensore.

## Nomi dei livelli

1. Quante forze
2. La fune inclinata
3. La reazione del pavimento
4. La fune inclinata con l'attrito
5. Quanto segna la bilancia
6. L'accelerazione dell'ascensore

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni: al livello 1 numeri interi consecutivi (le forze da contare), poi accelerazioni
($4{,}7\,\text{m/s}^2$, al livello 6 con il verso), forze ($39\,\text{N}$), letture della bilancia in chilogrammi
($33\,\text{kg}$). Dati con due cifre significative (masse delle casse da $1{,}1$ a $9{,}9\,\text{kg}$, delle persone da $41$ a
$99\,\text{kg}$, forze da $1{,}1$ a $9{,}9$ o da $11$ a $99\,\text{N}$, accelerazioni da $1{,}1$ a $3{,}9\,\text{m/s}^2$, mai un
intero che finisce con zero), angoli in gradi interi, coefficienti con due decimali; $g = 9{,}8\,\text{m/s}^2$. Risultati a
due cifre significative, mai a meno di $10^{-6}$ da un confine di arrotondamento, mai un intero di due cifre che finisce
con zero, sotto $100$.

## Livello 1: quante forze

Dieci situazioni, con il numero delle forze che agiscono sul corpo: il libro sul tavolo (2), la lampada appesa (2), il
disco da hockey che scivola senza attrito (2: niente "forza del moto"), il sasso in volo senza resistenza dell'aria (1),
la cassa tirata su un pavimento liscio (3), la cassa trascinata con l'attrito (4), il quadro appeso con due fili (3), la
cassa ferma sul piano inclinato con l'attrito (3), il libro premuto da una mano (3), la persona nell'ascensore a velocità
costante (2). Le opzioni sono quattro numeri consecutivi da 1 in su che contengono la risposta, in ordine crescente.
Niente scena. Alcune situazioni (il sasso, il quadro, il piano inclinato) non sono nella lezione, ma usano solo le forze
del primo anno.

- "Quante forze agiscono su un disco da hockey che scivola sul ghiaccio, se l'attrito si trascura?" Risposta $2$,
  opzioni $1$, $2$, $3$, $4$. L'errore tipico è $3$, con la forza del moto.

Il livello ha pochi esercizi diversi (dieci situazioni).

## Livello 2: la fune inclinata

Una cassa su un pavimento liscio tirata da una fune inclinata di un angolo tra $20^\circ$ e $35^\circ$ o tra $55^\circ$ e
$65^\circ$ (vicino a $45^\circ$ seno e coseno darebbero quasi lo stesso numero); la componente verticale della forza è meno
dell'$80\%$ del peso. $a = F\cos\alpha / m$. Scena `blocco-forze` con la forza all'angolo del testo.

- "Una cassa di $4{,}9\,\text{kg}$ su un pavimento liscio, senza attrito, è tirata con una fune inclinata di $27^\circ$
  sull'orizzontale, con una forza di $36\,\text{N}$. Quanto vale l'accelerazione della cassa?" Risposta
  $6{,}5\,\text{m/s}^2$; distrattori $7{,}3\,\text{m/s}^2$ (tutta la forza), $3{,}3\,\text{m/s}^2$ (il seno),
  $8{,}2\,\text{m/s}^2$ (diviso per il coseno).

## Livello 3: la reazione del pavimento

Metà: una cassa tirata da una fune inclinata sopra l'orizzontale, $F_v = P - F\sin\alpha$, con la scena `blocco-forze`;
metà: un carrello spinto da un manico inclinato sotto l'orizzontale, $F_v = P + F\sin\alpha$, con la scena `punto-forze`
(nella scena del blocco una spinta verso il basso attraverserebbe il pavimento). La componente verticale è almeno il
$15\%$ del peso, e al più l'$80\%$ quando solleva.

- "Una cassa di $4{,}8\,\text{kg}$ è tirata sul pavimento con una fune inclinata di $63^\circ$ sopra l'orizzontale, con una
  forza di $9{,}3\,\text{N}$. Quanto vale la reazione del pavimento?" Risposta $39\,\text{N}$; distrattori $47\,\text{N}$ (la
  reazione uguale al peso), $55\,\text{N}$ (il segno sbagliato), $43\,\text{N}$ (il coseno al posto del seno).

## Livello 4: la fune inclinata con l'attrito

L'esempio 1 della lezione: fune inclinata tra $20^\circ$ e $35^\circ$, $\mu_d$ da $0{,}10$ a $0{,}50$, l'attrito calcolato con
$F_v = P - F\sin\alpha$; la forza totale è almeno un quarto della componente orizzontale. Scena con la forza.

- "Una cassa di $4{,}9\,\text{kg}$ è tirata sul pavimento con una fune inclinata di $26^\circ$ sopra l'orizzontale, con una
  forza di $36\,\text{N}$; il coefficiente di attrito dinamico è $\mu_d = 0{,}29$. Quanto vale l'accelerazione della
  cassa?" Risposta $4{,}7\,\text{m/s}^2$; distrattori $3{,}8\,\text{m/s}^2$ (l'attrito con la reazione uguale al peso, l'avviso
  della lezione), $6{,}6\,\text{m/s}^2$ (l'attrito dimenticato), $5{,}4\,\text{m/s}^2$ (tutta la forza lungo $x$).

## Livello 5: quanto segna la bilancia

Una persona su una bilancia in un ascensore che parte verso l'alto, sale e frena, parte verso il basso, scende e frena
(un quarto ciascuno); la bilancia segna $m\,(g \pm a)/g$, con il più quando l'accelerazione è verso l'alto. Niente
scena.

- "Una persona di $41\,\text{kg}$ sta su una bilancia pesapersone in un ascensore che sale e sta frenando, con
  un'accelerazione di $1{,}9\,\text{m/s}^2$. Quanto segna la bilancia?" Risposta $33\,\text{kg}$; distrattori $49\,\text{kg}$
  (il segno del moto al posto di quello dell'accelerazione), $41\,\text{kg}$ (la massa), $26\,\text{kg}$.

## Livello 6: l'accelerazione dell'ascensore

La bilancia segna un valore diverso dalla massa di almeno $2$ e al più $20\,\text{kg}$, sopra o sotto a metà: 
$a = g\,(r - m)/m$, con il verso. Niente scena.

- "Una persona di $67\,\text{kg}$ sta su una bilancia pesapersone in un ascensore. Mentre l'ascensore si muove, la bilancia
  segna $52\,\text{kg}$. Quanto vale l'accelerazione dell'ascensore?" Risposta $2{,}2\,\text{m/s}^2$ verso il basso;
  distrattori $2{,}2\,\text{m/s}^2$ verso l'alto, $0{,}22\,\text{m/s}^2$ verso il basso ($g$ dimenticato),
  $7{,}6\,\text{m/s}^2$ verso il basso (la reazione intera divisa per la massa).

## Esercizi da evitare

- Angoli vicini a $45^\circ$ ai livelli 2 e 3.
- Una fune che quasi solleva la cassa; un attrito quasi uguale alla forza (livello 4).
- Letture della bilancia oltre $99\,\text{kg}$ o quasi uguali alla massa.

## Verifica

`fis_diagramma_corpo_libero.py` ha la sua tabella delle dieci situazioni del livello 1 e controlla che le opzioni siano
quattro interi consecutivi; negli altri livelli rilegge il testo, controlla cifre significative e intervalli, calcola con
SymPy (trigonometria esatta), confronta la risposta e le opzioni, e controlla la scena (la forza del testo, con il modulo e
l'angolo, sotto l'orizzontale per il manico).

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 1.000 esercizi per livello ciascuno, PASS, quote dei casi dentro
gli intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 193 px su 252, quelle con il verso).

### Errori piantati

Bocciati tutti (240 su 240; 120 su 120 per la scena): indice dell'opzione giusta, un numero del testo cambiato, il testo
dell'opzione giusta, un'opzione doppia, parole vietate, un modulo della scena spostato, la scena tolta.

### Esercizi diversi su 1.000

Seed da 1: livello 1 10, livello 2 995, livello 3 997, livello 4 1000, livello 5 894, livello 6 721.

## Domande per la revisione

- Il livello 1 con le situazioni che la lezione non disegna (il sasso, il quadro, il piano inclinato): va bene, o si
  resta alle tre della figura interattiva?
- Il livello 6 dà il verso ma non dice se l'ascensore parte o frena: basta, visto che dalla bilancia non si può sapere?
