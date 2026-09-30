# Il momento di una forza e di una coppia di forze

Generatore: `fis-momento-forza` (`src/lib/exercises/v2/generators/fis-momento-forza.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_momento_forza.py`. Lezione collegata: `docs/lezioni/fisica/riscritte/22-fis-momento-forza.md`
(note in `docs/lezioni/fisica/note/22-fis-momento-forza.md`). Le funzioni comuni ai quattro generatori del corpo rigido
sono in `src/lib/exercises/v2/fis-corpo-rigido.ts` e `scripts/exercises/checkers/_corpo_rigido.py`; la scena è
`asta-forze` (`src/components/content/exercises/scenes/AstaForze.tsx`).

Cinque livelli, ognuno con una difficoltà in più: il momento con il braccio dato, la formula rovesciata, la forza
obliqua con il seno, più forze con il segno, la coppia.

## Nomi dei livelli

1. Il momento con il braccio
2. Dal momento alla forza o al braccio
3. Il momento di una forza obliqua
4. Il momento totale con il segno
5. Il momento di una coppia

## Tipi di risposta

Livelli 1, 2, 3 e 5: una risposta `number`, arrotondata a due cifre significative come i dati (la lezione "Le cifre
significative"); un intero di almeno due cifre si scrive intero ($16\,\text{N} \cdot \text{m}$, non
$1{,}6 \cdot 10$). La variante a scelta multipla ha quattro opzioni con l'unità, scritte come la lezione:
$16\,\text{N} \cdot \text{m}$, $0{,}35\,\text{m}$. Prima i distrattori della lezione, arrotondati come la risposta,
poi valori vicini alla risposta.

Livello 4: una risposta `choice` di quattro opzioni, ciascuna un momento con il suo verso di rotazione
($9\,\text{N} \cdot \text{m}\ \text{antiorario}$); il valore dell'opzione è il momento con il segno (antiorario
positivo, come la lezione).

## Regole comuni

- Forze da $10$ a $95\,\text{N}$ a passi di $5$; distanze da $0{,}10$ a $0{,}95\,\text{m}$ a passi di $0{,}05$, o in
  centimetri.
- Testo in righe `\text{…}` scritte con `textBlock`, formule tra `$…$`. Niente trattini lunghi, niente "piuttosto che".
- La scena `asta-forze` disegna l'asta, il perno $O$, le forze con il loro valore e le distanze del testo; quello che
  si chiede è un "?" (una forza da trovare è lunga come le altre, 1,2 cm). Il livello 2 che chiede il braccio disegna
  la forza dove stava prima che il momento fosse arrotondato, senza scala: la sola distanza è "?".

## Livello 1: il momento con il braccio

$M = F \cdot b$, la forza perpendicolare all'asta. Il braccio è in metri (60%) o in centimetri (40%), e va convertito.

- "Una forza di $55\,\text{N}$, perpendicolare all'asta, è applicata a $0{,}55\,\text{m}$ da $O$." Risposta
  $30\,\text{N} \cdot \text{m}$ ($30{,}25$ arrotondato); distrattori $100$ ($F / b$), $300$ e $3{,}0$ (virgola spostata).
- "Una forza di $75\,\text{N}$ … a $35\,\text{cm}$ da $O$." Risposta $26\,\text{N} \cdot \text{m}$; distrattori
  $2600$ (il braccio lasciato in centimetri), $210$ ($F / b$).

## Livello 2: dal momento alla forza o al braccio

Metà dei problemi chiede la forza ($F = M / b$, il braccio anche in centimetri), metà il braccio ($b = M / F$). Il
momento del testo è arrotondato a due cifre, quindi la risposta si arrotonda di nuovo.

- "Una forza di $55\,\text{N}$ … ha un momento di $30\,\text{N} \cdot \text{m}$. A che distanza da $O$ è applicata?"
  Risposta $0{,}55\,\text{m}$; distrattori $1{,}8\,\text{m}$ ($F / M$), $5{,}5$ e $0{,}055\,\text{m}$.
- "Una forza perpendicolare … a $35\,\text{cm}$ dal perno … vale $32\,\text{N} \cdot \text{m}$. Quanto vale la
  forza?" Risposta $91\,\text{N}$; distrattori $0{,}91\,\text{N}$ (il braccio lasciato in centimetri), $11\,\text{N}$
  ($M \cdot b$).

## Livello 3: il momento di una forza obliqua

$M = F\,d \sin\alpha$, con $\alpha$ da $15^\circ$ a $75^\circ$ e da $105^\circ$ a $165^\circ$ a passi di $5^\circ$
(mai $90^\circ$). Il valore esatto non è mai entro il 2% di un passo dal confine di arrotondamento.

- "A $0{,}55\,\text{m}$ da $O$ … una forza di $55\,\text{N}$, che forma un angolo di $115^\circ$ con l'asta."
  Risposta $27\,\text{N} \cdot \text{m}$; distrattori $30$ ($F d$, l'angolo dimenticato), $13$ (il coseno), $29$ (la
  calcolatrice in radianti).
- "A $0{,}40\,\text{m}$ … $45\,\text{N}$ … $30^\circ$": $9{,}0\,\text{N} \cdot \text{m}$, l'esempio 3 della lezione.

## Livello 4: il momento totale con il segno

Due forze perpendicolari all'asta, verso l'alto o verso il basso. Perno nel centro (60%), con una forza per parte;
perno a un'estremità (40%), con le due forze dalla stessa parte, a distanze diverse e in versi opposti. Bracci da
$0{,}20$ a $0{,}90\,\text{m}$ a passi di $0{,}10$, e prodotti $F\,b$ interi: il totale è intero, come nell'esempio 2
della lezione. Il totale non è mai sotto $2\,\text{N} \cdot \text{m}$ e i due momenti non sono uguali.

- "Perno nel centro. A destra, a $0{,}60\,\text{m}$, $F_1 = 55\,\text{N}$ verso il basso; a sinistra, a
  $0{,}80\,\text{m}$, $F_2 = 60\,\text{N}$ verso l'alto." $M_1 = -33$, $M_2 = -48$: risposta
  $81\,\text{N} \cdot \text{m}$ orario; distrattori $81$ antiorario, $15$ orario e $15$ antiorario (i momenti sottratti
  come se fossero opposti).
- "Perno nel centro … $F_1 = 75\,\text{N}$ verso il basso a $0{,}60\,\text{m}$; $F_2 = 65\,\text{N}$ verso l'alto a
  $0{,}80\,\text{m}$." Risposta $97\,\text{N} \cdot \text{m}$ orario.

Distrattori: il verso sbagliato; i due momenti sommati senza segno (quando hanno segni opposti), o sottratti (quando
hanno lo stesso segno), in tutti e due i versi.

## Livello 5: il momento di una coppia

Tre casi: il volante di diametro $d$ (40%, $M = F d$), la chiave a croce con i bracci lunghi $r$ (30%, $M = F \cdot 2r$),
la forza dal momento e dal braccio (30%, $F = M / b$). Forze da $10$ a $40\,\text{N}$, diametri da $0{,}28$ a
$0{,}45\,\text{m}$, bracci da $0{,}14$ a $0{,}24\,\text{m}$.

- "Un volante di diametro $0{,}38\,\text{m}$ … due forze tangenti di $12\,\text{N}$." Risposta
  $4{,}6\,\text{N} \cdot \text{m}$; distrattori $2{,}3$ (il raggio al posto del diametro), $9{,}1$ (il doppio), $32$.
- "Una chiave a croce ha i bracci lunghi $0{,}23\,\text{m}$ … due forze di $26\,\text{N}$." Risposta
  $12\,\text{N} \cdot \text{m}$; distrattori $6{,}0$ (un braccio solo), $24$, $110$.

## Esercizi da evitare

- Un momento a metà strada tra due arrotondamenti ($12{,}5$ con due cifre) o, al livello 3, a meno del 2% di un passo.
- Due momenti uguali al livello 4 (l'asta sarebbe in equilibrio: è la lezione dopo) o un totale sotto
  $2\,\text{N} \cdot \text{m}$.
- Una scena che dà la risposta: la forza da trovare disegnata in scala, la distanza da trovare con la quota.

## Verifica

`fis_momento_forza.py` rilegge il testo con modelli fissi, ricalcola la risposta con SymPy (il seno esatto al
livello 3), controlla i vincoli, la scena (perno, forza, angolo, quote, "?"), le quattro opzioni e il loro testo; al
livello 4 rifà i segni dei due momenti dalla posizione e dal verso di ciascuna forza.

Esito: `sample.mts fis-momento-forza 1000 all` con i seed $1$, $50001$ e $777001$, 5.000 esercizi ciascuno, PASS;
`review.mts` e `width.mts` escono con codice 0 (opzioni al massimo di $159$ px, al livello 4).

### Errori piantati

Su 25 esercizi e 6 modifiche ciascuno (risposta cambiata, opzione giusta spostata, due opzioni uguali, opzione scritta
senza lo spazio sottile, un dato del testo cambiato, la forza spostata nella scena): 150 su 150 bocciati.

### Esercizi diversi su 1.000

Seed da 1 (tra parentesi da 50001): livello 1 415 (415), livello 2 599 (579), livello 3 943 (937), livello 4 990
(992), livello 5 687 (685).

## Domande per la revisione

- Il segno del momento: positivo antiorario, come gli angoli. È la convenzione dell'Amaldi?
- Livello 4: la risposta "$81\,\text{N} \cdot \text{m}$ orario" va bene, o si preferisce $-81\,\text{N} \cdot \text{m}$?
- Livello 3: gli angoli ottusi ($115^\circ$) confondono troppo al primo anno?
