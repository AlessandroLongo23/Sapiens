# L'energia potenziale gravitazionale e la velocità di fuga

Generatore: `fis-energia-gravitazionale` (`src/lib/exercises/v2/generators/fis-energia-gravitazionale.ts`, con
`src/lib/exercises/v2/fis-campo-orbite.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_energia_gravitazionale.py` (con `_fis_campo_orbite.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/97-fis-energia-gravitazionale.md`. Percorso nel database:
`high_school/physics/fis-gravitazione/fis-energia-gravitazionale`.

Cinque livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. L'energia potenziale, con il segno
2. Dalla superficie a una quota
3. Fin dove arriva un proiettile
4. L'energia di un satellite in orbita
5. La velocità di fuga

## Tipi di risposta e cifre significative

Come in `fis-campo-gravitazionale.md`: scelta multipla con l'unità nell'opzione, tre cifre significative, notazione
scientifica fuori dall'intervallo $0{,}1$-$1000$, $G = 6{,}67 \cdot 10^{-11}$. Le energie negative hanno il segno
nell'opzione ($-2{,}81 \cdot 10^{10}\,\text{J}$).

## Regole comuni

- Formule della lezione: $U = -G M m / r$; $\Delta U = G M m\,(1/r_1 - 1/r_2)$; conservazione
  $\tfrac{1}{2} v^2 - G M / r$ costante; in orbita circolare $E = -G M m / (2r)$; $v_f = \sqrt{2 G M / R}$.
- Corpi come nel generatore del campo (massa tra $10^{22}$ e $10^{27}\,\text{kg}$, densità tra $1000$ e
  $6000\,\text{kg/m}^3$, stessi nomi). Satelliti e sonde da $10^{2}$ a $10^{5}\,\text{kg}$.
- Distrattori a meno del $3\%$ dalla risposta scartati, e completati con multipli della risposta.
- Scena `orbita-pianeta` ai livelli 2 (corpo e sonda a quota $h$, in scala, con $R$ e $h$ scritti sotto) e 3 (corpo e
  proiettile che parte dalla superficie con la velocità $\vec v_0$; il punto di arresto non è disegnato, e il
  rapporto del disegno è fisso).

## Livello 1: l'energia potenziale, con il segno

Satellite a una distanza dal centro tra $1{,}1$ e $6$ raggi del corpo (il raggio non compare nel testo).

- "Un satellite di $584\,\text{kg}$ si trova a $8{,}01 \cdot 10^{7}\,\text{m}$ dal centro di un pianeta di massa
  $5{,}77 \cdot 10^{25}\,\text{kg}$. Quanto vale la sua energia potenziale gravitazionale?" Risposta $-2{,}81 \cdot
  10^{10}\,\text{J}$; distrattori $2{,}81 \cdot 10^{10}\,\text{J}$ (il segno dimenticato), $-3{,}50 \cdot
  10^{2}\,\text{J}$ e $3{,}50 \cdot 10^{2}\,\text{J}$ ($r^2$ al denominatore, come nella forza).
- Con $1{,}13 \cdot 10^{4}\,\text{kg}$, $1{,}65 \cdot 10^{7}\,\text{m}$ e $1{,}69 \cdot 10^{25}\,\text{kg}$: risposta
  $-7{,}72 \cdot 10^{11}\,\text{J}$.

## Livello 2: dalla superficie a una quota

Quota tra $0{,}15$ e $2{,}5$ raggi: abbastanza grande perché $m g h$ sbagli di almeno il $15\%$.

- "Un pianeta ha massa $1{,}69 \cdot 10^{25}\,\text{kg}$ e raggio $8{,}91 \cdot 10^{6}\,\text{m}$. Una sonda di
  $1{,}13 \cdot 10^{4}\,\text{kg}$ viene portata dalla superficie a una quota di $4{,}47 \cdot 10^{6}\,\text{m}$. Di
  quanto aumenta la sua energia potenziale gravitazionale?" Risposta $4{,}78 \cdot 10^{11}\,\text{J}$; distrattori
  $7{,}17 \cdot 10^{11}$ ($m g h$ con il campo alla superficie), $9{,}52 \cdot 10^{11}$ (solo $G M m / r_2$),
  $2{,}38 \cdot 10^{12}$ (i due termini sommati).
- Con $M = 5{,}84 \cdot 10^{22}\,\text{kg}$, $R = 1{,}56 \cdot 10^{6}\,\text{m}$, $m = 5{,}05 \cdot
  10^{3}\,\text{kg}$, $h = 2{,}41 \cdot 10^{6}\,\text{m}$: risposta $7{,}65 \cdot 10^{9}\,\text{J}$.

## Livello 3: fin dove arriva un proiettile

Lancio verticale dalla superficie di un corpo senza atmosfera; si chiede la distanza dal centro a cui il proiettile
si ferma. La velocità è scelta in modo che $\tfrac{1}{2} v_0^2$ stia tra il $20\%$ e il $90\%$ di $G M / R$ (distanza
massima tra $1{,}3$ e $10$ raggi circa, lontano dalla velocità di fuga).

- "Un pianeta senza atmosfera ha massa $1{,}69 \cdot 10^{25}\,\text{kg}$ e raggio $8{,}91 \cdot 10^{6}\,\text{m}$.
  Dalla sua superficie un proiettile viene lanciato in verticale a $1{,}11 \cdot 10^{4}\,\text{m/s}$. A quale distanza
  dal centro si ferma, prima di ricadere?" Risposta $1{,}74 \cdot 10^{7}\,\text{m}$; distrattori $1{,}32 \cdot 10^{7}$
  ($R + v_0^2 / (2 g)$, il peso costante del biennio), $8{,}46 \cdot 10^{6}$ (la quota al posto della distanza),
  $1{,}83 \cdot 10^{7}$ ($2 G M / v_0^2$, l'energia potenziale di partenza dimenticata).
- Con $M = 5{,}77 \cdot 10^{25}\,\text{kg}$, $R = 1{,}52 \cdot 10^{7}\,\text{m}$ e $v_0 = 2{,}01 \cdot
  10^{4}\,\text{m/s}$: risposta $7{,}52 \cdot 10^{7}\,\text{m}$.

## Livello 4: l'energia di un satellite in orbita

Stessi dati del livello 1, ma il satellite è in orbita circolare e si chiede l'energia totale.

- Con $584\,\text{kg}$, $r = 8{,}01 \cdot 10^{7}\,\text{m}$, $M = 5{,}77 \cdot 10^{25}\,\text{kg}$: risposta
  $-1{,}40 \cdot 10^{10}\,\text{J}$; distrattori $-2{,}81 \cdot 10^{10}$ (la sola energia potenziale),
  $1{,}40 \cdot 10^{10}$ (l'energia cinetica: il segno), $2{,}81 \cdot 10^{10}$.
- Con $1{,}13 \cdot 10^{4}\,\text{kg}$, $1{,}65 \cdot 10^{7}\,\text{m}$, $1{,}69 \cdot 10^{25}\,\text{kg}$: risposta
  $-3{,}86 \cdot 10^{11}\,\text{J}$.

## Livello 5: la velocità di fuga

- "Un pianeta ha massa $1{,}69 \cdot 10^{25}\,\text{kg}$ e raggio $8{,}91 \cdot 10^{6}\,\text{m}$. Quanto vale la
  velocità di fuga dalla sua superficie?" Risposta $1{,}59 \cdot 10^{4}\,\text{m/s}$; distrattori $1{,}12 \cdot
  10^{4}$ (la velocità orbitale, senza il $2$), $2{,}53 \cdot 10^{8}$ (senza radice), $5{,}33\,\text{m/s}$ ($R^2$
  sotto la radice).
- Con $5{,}77 \cdot 10^{25}\,\text{kg}$ e $1{,}52 \cdot 10^{7}\,\text{m}$: risposta $2{,}25 \cdot
  10^{4}\,\text{m/s}$.

## Esercizi da evitare

- Quote piccole rispetto al raggio, dove $m g h$ darebbe quasi la stessa risposta.
- Lanci vicini alla velocità di fuga, dove la distanza massima cambia di molto con l'ultima cifra del dato.
- Energie potenziali chieste "in valore assoluto": il segno è il punto del livello 1.

## Verifica

`fis_energia_gravitazionale.py` rilegge il testo, controlla dati, intervalli, densità e nomi dei corpi; calcola con
razionali esatti (la radice della velocità di fuga a 50 cifre), arrotonda a tre cifre e confronta risposta e opzioni,
segno compreso; ai livelli 2 e 3 controlla la scena (al 3: il lancio, il solo raggio tra i dati, il rapporto fisso
$2{,}2$), agli altri che non ci sia.

## Domande per la revisione

- Il livello 3 chiede la distanza dal centro e mette la quota tra i distrattori: è una trappola onesta?
- Serve un livello sull'energia per passare da un'orbita a un'altra, o sulla velocità con cui un corpo arriva al suolo
  cadendo da lontano?
- La velocità di fuga è l'ultimo livello perché è l'ultima nella lezione, ma è più facile del livello 3: va bene
  l'ordine?
- Le energie con il segno nelle opzioni: chiaro sul telefono?
