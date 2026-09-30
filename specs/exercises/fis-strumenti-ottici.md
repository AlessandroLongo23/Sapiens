# L'occhio e gli strumenti ottici

Generatore: `fis-strumenti-ottici` (`src/lib/exercises/v2/generators/fis-strumenti-ottici.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_strumenti_ottici.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/37-fis-strumenti-ottici.md`. Percorso nel database:
`high_school/physics/ottica/fis-strumenti-ottici`. Scena: `lente-oggetto`, solo nella soluzione del livello 5.

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Cannocchiale e microscopio
2. Le lenti per la miopia
3. Le lenti per l'ipermetropia
4. La macchina fotografica
5. La lente d'ingrandimento
6. Il potere dell'occhio

## Convenzioni e opzioni

Le formule e i segni della lezione "Le lenti sottili": $\frac{1}{p} + \frac{1}{q} = \frac{1}{f}$, $G = -\frac{q}{p}$,
$P = \frac{1}{f}$ con $f$ in metri. Occhiali a contatto con l'occhio (lo dice il testo). Punto prossimo di
riferimento $25\,\text{cm}$; modello dell'occhio con la lente a $1{,}7\,\text{cm}$ dalla retina. I dati in metri hanno
almeno due cifre significative ($1{,}0\,\text{m}$), i risultati due; gli ingrandimenti del livello 1 sono interi esatti.
Le opzioni hanno l'unità ($-0{,}50\,\text{D}$, $36\,\text{mm}$, $400\ \text{volte}$) o la forma $G = 6{,}0$.

## Livello 1: cannocchiale e microscopio

Un terzo ciascuno: l'ingrandimento di un cannocchiale ($f_{ob}$ da $40$ a $150\,\text{cm}$ a passi di $5$, $f_{oc}$ da
$0{,}5$ a $5\,\text{cm}$, $G$ intero da $10$ a $200$), la distanza tra le lenti ($f_{ob} + f_{oc}$), l'ingrandimento di un
microscopio (obiettivo da $4$ a $100$, oculare da $5$ a $20$).

- "$f_{ob} = 90\,\text{cm}$, $f_{oc} = 1{,}5\,\text{cm}$: ingrandimento?" Risposta $G = 60$; distrattori il rapporto
  rovesciato ($0{,}017$), il prodotto, la differenza.
- "Obiettivo $40$ volte, oculare $10$ volte." Risposta $400$ volte; distrattori $50$ (la somma), $4000$.

## Livello 2: le lenti per la miopia

Punto remoto $d_R$ tra $0{,}20$ e $5{,}0\,\text{m}$ (a volte, sotto il metro, dato in centimetri). $P = -1/d_R$.

- "... vede nitido solo fino a $2{,}5\,\text{m}$." Risposta $-0{,}40\,\text{D}$; distrattori $0{,}40\,\text{D}$ (il segno),
  $-0{,}0040\,\text{D}$ (in centimetri), $-2{,}5\,\text{D}$ (senza l'inverso).

## Livello 3: le lenti per l'ipermetropia

Punto prossimo da $40\,\text{cm}$ a $2{,}5\,\text{m}$; $P = \frac{1}{0{,}25\,\text{m}} - \frac{1}{d_P}$.

- "... punto prossimo a $50\,\text{cm}$." Risposta $2{,}0\,\text{D}$; distrattori $-2{,}0$, $6{,}0$ ($4 + 2$), il fallback.

## Livello 4: la macchina fotografica

Obiettivo da $35$, $50$, $85$ o $100\,\text{mm}$, persona da $1{,}0$ a $5{,}0\,\text{m}$. Metà dei casi chiede la
distanza obiettivo-sensore $q$, metà di quanto l'obiettivo si allontana rispetto alla messa a fuoco all'infinito,
$q - f$.

- "$50\,\text{mm}$, persona a $2{,}0\,\text{m}$: distanza dal sensore?" Risposta $51\,\text{mm}$; distrattori $50$ (il
  fuoco), $49$ ($pf/(p+f)$), $1{,}3\,\text{mm}$ (lo spostamento).

## Livello 5: la lente d'ingrandimento

Distanza focale $2{,}5$, $5{,}0$, $10$, $12{,}5$ o $25\,\text{cm}$, a volte data come potere ($40$, $20$, $10$, $8$,
$4\,\text{D}$). Immagine virtuale a $25\,\text{cm}$ ($q = -25\,\text{cm}$). Metà dei casi chiede dove va l'oggetto,
metà l'ingrandimento.

- "$f = 5{,}0\,\text{cm}$: a che distanza metti il francobollo?" Risposta $4{,}2\,\text{cm}$; distrattori $5{,}0$ (nel
  fuoco), $6{,}3$ ($q$ col segno sbagliato), $20$.
- "Lente da $20\,\text{D}$: ingrandimento?" Risposta $G = 6{,}0$; distrattori $-6{,}0$, $0{,}17$.

## Livello 6: il potere dell'occhio

Oggetto da $20\,\text{cm}$ a $2{,}0\,\text{m}$. $P = \frac{1}{p} + \frac{1}{0{,}017\,\text{m}}$ con due cifre
significative; il risultato non deve coincidere con il potere per l'oggetto all'infinito ($59\,\text{D}$).

- "Oggetto a $25\,\text{cm}$." Risposta $63\,\text{D}$; distrattori $59\,\text{D}$ (solo la retina), $55\,\text{D}$ (la
  differenza), $3{,}7\,\text{D}$ (le distanze sommate prima dell'inverso).

## Verifica

`fis_strumenti_ottici.py` rilegge il testo, rifà i conti con le frazioni esatte di SymPy e arrotonda a due cifre
significative, rifiutando i confini; controlla l'opzione giusta, le unità, i vincoli, la scena della soluzione del
livello 5 e le quote dei casi.

## Domande per la revisione

- Lente d'ingrandimento: qui l'ingrandimento è $G = -q/p$ con l'immagine a $25\,\text{cm}$ ($1 + 25/f$). Molti libri usano
  l'ingrandimento angolare $25/f$ con l'immagine all'infinito: quale usa l'Amaldi? Nessun distrattore usa $25/f$.
- Il modello dell'occhio con la lente a $1{,}7\,\text{cm}$ dalla retina va bene per il primo anno?
