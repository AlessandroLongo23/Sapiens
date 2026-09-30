# La riflessione e gli specchi piani

Generatore: `riflessione` (`src/lib/exercises/v2/generators/riflessione.ts`, con
`src/lib/exercises/v2/raggi-specchi.ts`). Verifica indipendente: `scripts/exercises/checkers/riflessione.py`. Lezione
collegata: `docs/lezioni/fisica/riscritte/32-riflessione.md`. Percorso nel database:
`high_school/physics/ottica/riflessione`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. L'angolo tra i due raggi
2. Dall'angolo con lo specchio
3. L'immagine nello specchio piano
4. Lo specchio per vedersi per intero
5. Due specchi ad angolo

## Numeri e risposte

Angoli in gradi interi (multipli di $5^\circ$ con due specchi); distanze al decimetro (livello 3) o al centimetro
(livello 4), scritte con le cifre decimali di quel dato ($4{,}0\,\text{m}$, $0{,}79\,\text{m}$). Tutti i risultati
sono esatti. Scelta multipla, con i gradi o i metri nell'opzione.

## Regole comuni

- La scena (`raggi-specchi`) disegna i dati: lo specchio, la normale e il raggio incidente con l'angolo del testo; la
  persona e lo specchio con le quote; i due specchi con il loro angolo. Il raggio riflesso, l'immagine e lo specchio
  cercato stanno nella `solutionScene`.

## Livello 1: l'angolo tra i due raggi

Angolo di incidenza da $20^\circ$ a $75^\circ$ (non $45^\circ$); si chiede l'angolo tra raggio incidente e riflesso,
$2i$.

- "$i = 41^\circ$." Risposta $82^\circ$; distrattori $41^\circ$ (solo $r$), $49^\circ$ (il complementare),
  $98^\circ$ ($180^\circ - 2i$).
- "$i = 52^\circ$." Risposta $104^\circ$; distrattori $52^\circ$, $38^\circ$, $76^\circ$.

## Livello 2: dall'angolo con lo specchio

Si dà l'angolo tra il raggio e la superficie (da $15^\circ$ a $75^\circ$, non $45^\circ$); si chiede $r = 90^\circ$
meno l'angolo.

- "$41^\circ$ con la superficie." Risposta $49^\circ$; distrattori $41^\circ$ (angolo dalla superficie), $82^\circ$,
  $98^\circ$.
- "$52^\circ$." Risposta $38^\circ$.

## Livello 3: l'immagine nello specchio piano

Sei a $d$ (da $1{,}2$ a $4{,}9\,\text{m}$) e fai un passo $x$ verso lo specchio; metà dei casi si chiede la distanza
da te all'immagine, $2(d - x)$, metà di quanto si è avvicinata l'immagine, $2x$.

- "$d = 2{,}8\,\text{m}$, $x = 0{,}8\,\text{m}$, distanza." Risposta $4{,}0\,\text{m}$; distrattori $2{,}0\,\text{m}$
  (immagine sullo specchio), $4{,}8\,\text{m}$, $5{,}6\,\text{m}$.
- "$d = 1{,}2\,\text{m}$, $x = 0{,}2\,\text{m}$, avvicinamento." Risposta $0{,}4\,\text{m}$; distrattori $0{,}2$,
  $0{,}8$, $2{,}0\,\text{m}$.

## Livello 4: lo specchio per vedersi per intero

Altezza $H$ da $1{,}50$ a $1{,}90\,\text{m}$, occhi da 8 a 12 cm più in basso, distanza dal muro (che non serve) da
$0{,}8$ a $2{,}5\,\text{m}$. Un terzo dei casi per domanda: lunghezza minima ($H/2$), bordo inferiore (metà degli
occhi), bordo superiore (a metà tra occhi e testa).

- "$H = 1{,}76$, occhi a $1{,}68\,\text{m}$, lunghezza." Risposta $0{,}88\,\text{m}$; distrattori $1{,}76$ (alto
  quanto la persona), $0{,}84$ (metà degli occhi), $0{,}44\,\text{m}$.
- "$H = 1{,}68$, occhi a $1{,}58$, bordo inferiore." Risposta $0{,}79\,\text{m}$.

## Livello 5: due specchi ad angolo

Angolo tra gli specchi da $60^\circ$ a $120^\circ$ (un quinto dei casi $90^\circ$), angolo di incidenza sul primo da
$10^\circ$ a $80^\circ$; si chiede l'angolo di incidenza sul secondo, dal triangolo raggio-specchi. Esclusi i casi con
risposta sotto $10^\circ$ o uguale al dato.

- "$85^\circ$, $i_1 = 30^\circ$." Risposta $55^\circ$; distrattori $30^\circ$ (lo stesso angolo), $60^\circ$ (come se
  fossero perpendicolari), $35^\circ$ (angolo con la superficie).
- "$75^\circ$, $i_1 = 25^\circ$." Risposta $50^\circ$.

## Verifica

`riflessione.py` rilegge il testo e rifà i conti; al livello 5 traccia il raggio con i vettori (riflessione di un
vettore, angolo con la retta del secondo specchio), non con il triangolo. Misura le scene: raggio incidente
all'angolo del testo, specchi all'angolo del testo, persona al suo posto; nella soluzione ogni raggio riflesso
rispetta $r = i$, l'immagine è simmetrica, lo specchio del livello 4 è sul muro all'altezza giusta, e gli specchi
non si spostano tra problema e soluzione.

## Domande per la revisione

- Il livello 5 generalizza l'esempio della lezione con angoli qualunque: nell'Amaldi c'è?
- Livello 3: "quanto si è avvicinata a te l'immagine" è una domanda chiara?
