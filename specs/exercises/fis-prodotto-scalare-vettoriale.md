# Prodotto scalare e prodotto vettoriale

Generatore: `fis-prodotto-scalare-vettoriale` (`src/lib/exercises/v2/generators/fis-prodotto-scalare-vettoriale.ts`,
con `src/lib/exercises/v2/fis-lavoro.ts`, `fis-forze-movimento.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica
indipendente: `scripts/exercises/checkers/fis_prodotto_scalare_vettoriale.py` (con `_fis_lavoro.py` e `_vettori.py`).
Lezione collegata: `docs/lezioni/fisica/riscritte/71-fis-prodotto-scalare-vettoriale.md`. Percorso nel database:
`high_school/physics/fis-relativita-galileiana/fis-prodotto-scalare-vettoriale`.

Sette livelli, nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il prodotto scalare con un angolo acuto
2. L'angolo ottuso e il segno
3. Il prodotto scalare dalle componenti
4. L'angolo tra due vettori
5. Il modulo del prodotto vettoriale
6. Il prodotto vettoriale nel piano: esce o entra
7. Le componenti nello spazio

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni. Ai livelli 1, 2, 3 e 5 una grandezza con l'unità ($78\,\text{J}$, $-92\,\text{J}$,
$5{,}5\,\text{N}\cdot\text{m}$), a due cifre significative, scritta come nella lezione "Il lavoro di una forza"
(`fis-lavoro.ts`: notazione scientifica da $100$ in su). Al livello 4 un angolo al grado. Al livello 6 il modulo con il
verso ("$16$, entra nel foglio"). Al livello 7 la terna delle componenti, $(6;\ 5;\ -4)$. I vettori dei livelli 4, 6 e
7 sono vettori senza unità, come negli esempi 4, 6 e 7 della lezione. La risposta giusta non è mai un numero di due
cifre che finisce con zero, né a meno di $10^{-6}$ da un confine di arrotondamento.

## Livello 1: il prodotto scalare con un angolo acuto

Forza da $11$ a $99\,\text{N}$, spostamento da $1{,}1$ a $9{,}9\,\text{m}$, angolo intero da $10^\circ$ a $80^\circ$.

- "Una forza di modulo $75\,\text{N}$ agisce su un corpo che si sposta di $1{,}4\,\text{m}$. Forza e spostamento formano
  un angolo di $42^\circ$. Quanto vale il lavoro $W = \vec F \cdot \vec s$?" Risposta $78\,\text{J}$; distrattori
  $70\,\text{J}$ (il seno), $56\,\text{J}$ ($F\cos\alpha$, lo spostamento dimenticato), $94\,\text{J}$ (di riserva: il
  prodotto dei moduli, $105\,\text{J}$, cade su un confine di arrotondamento e viene saltato).
- $93\,\text{N}$, $1{,}8\,\text{m}$, $26^\circ$: $1{,}5 \cdot 10^2\,\text{J}$.

## Livello 2: l'angolo ottuso e il segno

Angolo da $100^\circ$ a $170^\circ$: il risultato è negativo.

- $17\,\text{N}$, $7{,}8\,\text{m}$, $134^\circ$: $-92\,\text{J}$; distrattori $92\,\text{J}$ (il segno dimenticato,
  l'errore di chi usa l'angolo supplementare), $95\,\text{J}$ (il seno), $-1{,}3 \cdot 10^2\,\text{J}$ (meno il prodotto
  dei moduli).
- $93\,\text{N}$, $1{,}8\,\text{m}$, $116^\circ$: $-73\,\text{J}$.

## Livello 3: il prodotto scalare dalle componenti

Componenti intere da $-9$ a $9$, mai zero, almeno una negativa; risultato diverso da zero.

- "Una forza ha componenti $F_x = -3\,\text{N}$ e $F_y = 2\,\text{N}$. Il corpo su cui agisce compie uno spostamento di
  componenti $s_x = 7\,\text{m}$ e $s_y = -8\,\text{m}$. Quanto lavoro compie la forza?" Risposta $-37\,\text{J}$;
  distrattori $10\,\text{J}$ ($F_x s_y - F_y s_x$, la formula del prodotto vettoriale), $-5{,}0\,\text{J}$ (il meno tra i
  due prodotti), $38\,\text{J}$ (le componenti incrociate).
- $F = (9;\ 2)\,\text{N}$, $s = (-3;\ -1)\,\text{m}$: $-29\,\text{J}$.

## Livello 4: l'angolo tra due vettori

Componenti intere da $-6$ a $6$, mai zero; prodotto scalare diverso da zero; angolo tra $15^\circ$ e $165^\circ$.

- "I vettori $\vec a$ e $\vec b$ hanno componenti $\vec a = (4;\ 3)$ e $\vec b = (-1;\ 2)$. Quanto vale l'angolo tra i
  due vettori?" Risposta $80^\circ$ (l'esempio 4 della lezione); distrattori $100^\circ$ (il supplementare, da un segno
  sbagliato nel prodotto scalare), $10^\circ$ (il seno al posto del coseno), poi angoli a $12^\circ$ o $25^\circ$ di
  distanza.
- $\vec a = (6;\ -6)$, $\vec b = (-3;\ 1)$: $153^\circ$.

## Livello 5: il modulo del prodotto vettoriale

$r$ da $0{,}11$ a $0{,}99\,\text{m}$, $F$ da $11$ a $99\,\text{N}$, angolo multiplo di $5^\circ$ da $20^\circ$ a
$160^\circ$, mai $90^\circ$. Scena `vettori-piano` (quella dei vettori del primo anno): i due vettori dallo stesso
punto, con i moduli e l'angolo.

- "Il vettore $\vec r$, di modulo $0{,}34\,\text{m}$, e la forza $\vec F$, di modulo $28\,\text{N}$, partono dallo stesso
  punto e formano un angolo di $35^\circ$. Quanto vale il modulo di $\vec r \times \vec F$?" Risposta
  $5{,}5\,\text{N}\cdot\text{m}$; distrattori $7{,}8\,\text{N}\cdot\text{m}$ (il coseno), $9{,}5\,\text{N}\cdot\text{m}$
  (il prodotto dei moduli), $17\,\text{N}\cdot\text{m}$ (diviso per il seno).
- $0{,}93\,\text{m}$, $18\,\text{N}$, $55^\circ$: $14\,\text{N}\cdot\text{m}$.

## Livello 6: il prodotto vettoriale nel piano

Componenti intere da $-6$ a $6$, mai zero; $c_z \ne 0$.

- "I vettori $\vec a = (-2;\ -2)$ e $\vec b = (-4;\ 4)$ stanno nel piano del foglio, con l'asse $x$ verso destra e
  l'asse $y$ verso l'alto. Quanto vale il modulo di $\vec a \times \vec b$, e il prodotto esce dal foglio o vi entra?"
  Risposta "$16$, entra nel foglio" ($c_z = -16$); distrattori "$16$, esce dal foglio" (i fattori scambiati), poi il
  valore del prodotto scalare e quello di $a_x b_y + a_y b_x$ con il verso del loro segno, poi $|c_z| \pm 2$.
- $\vec a = (3;\ 2)$, $\vec b = (1;\ 4)$: "$10$, esce dal foglio" (l'esempio 6).

## Livello 7: le componenti nello spazio

Componenti intere da $-4$ a $4$, al più uno zero in tutto; $c_y \ne 0$ e al più una componente nulla nel risultato.

- "Nello spazio i vettori $\vec a$ e $\vec b$ hanno componenti $\vec a = (2;\ 0;\ 3)$ e $\vec b = (3;\ -2;\ 2)$. Quali
  sono le componenti di $\vec c = \vec a \times \vec b$?" Risposta $(6;\ 5;\ -4)$; distrattori $(6;\ -5;\ -4)$ (il segno
  di $c_y$, l'avviso della lezione), $(-6;\ -5;\ 4)$ (i fattori scambiati), $(6;\ 0;\ 6)$ (le componenti moltiplicate
  una per una).
- $\vec a = (2;\ -1;\ 3)$, $\vec b = (1;\ 4;\ -2)$: $(-10;\ 7;\ 9)$ (l'esempio 7).

## Esercizi da evitare

- Vettori paralleli o perpendicolari ai livelli 4 e 6 (il caso si riconosce a occhio e i distrattori coincidono).
- L'angolo di $90^\circ$ ai livelli 1, 2 e 5.
- Componenti nulle ai livelli 3, 4 e 6: un addendo sparirebbe e l'esercizio non sarebbe più lo stesso.

## Verifica

`fis_prodotto_scalare_vettoriale.py` rilegge il testo, controlla gli intervalli, calcola con seno e coseno esatti e
con interi, confronta la risposta e la forma di tutte le opzioni; al livello 5 controlla che la scena abbia i due
vettori dallo stesso punto, l'angolo del testo e le etichette dei dati; al livello 7 controlla anche che il risultato
sia perpendicolare ai due vettori.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 7.000 esercizi ciascuno, PASS. `review.mts` e `width.mts` con codice 0 (opzioni al più 147 px su 252).

### Errori piantati

Su 84 campioni (12 per livello, seed da 4242), bocciati tutti: indice dell'opzione giusta, testo dell'opzione giusta, opzione doppia, vettore della scena cambiato, parole vietate. Una cifra di un dato cambiata: 83 su 84; nel caso passato (forza da 92 a 93 N) la risposta arrotondata non cambia.

## Domande per la revisione

- I livelli 1 e 2 sono vicini al livello 2 del generatore `lavoro` del biennio (forza inclinata). Qui c'è la scrittura
  $\vec F \cdot \vec s$ e, al livello 2, l'angolo ottuso: bastano a distinguerli, o meglio due grandezze diverse dal
  lavoro?
- Al livello 6 il verso si dà con le parole "esce dal foglio" e "entra nel foglio". Meglio i simboli $\odot$ e
  $\otimes$ nelle opzioni?
- Manca un livello sulla regola della mano destra senza componenti (dato un disegno, dire il verso): servirebbe una
  scena con i due vettori senza numeri. Lo aggiungo se Andrea lo ritiene utile.
