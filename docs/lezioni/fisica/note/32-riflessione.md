# Note: La riflessione e gli specchi piani

Lezione nuova, secondo lotto di fisica, gruppo 10, 30 settembre 2026. Numeri degli esempi rifatti in Python; in ogni
figura i raggi rispettano $r = i$, controllato con le pendenze (per esempio nella figura con l'occhio i due tratti di
ogni raggio hanno pendenza $0{,}154$ e $0{,}461$ ai due lati dello specchio). `check.mts` passa su lezione,
formulario e flashcard senza errori né avvisi.

## Struttura ed esempi

Raggio incidente, punto di incidenza, normale, raggio riflesso, angoli di incidenza e di riflessione dalla normale;
le due leggi; cammino inverso (`ad-note`); riflessione speculare e diffusa; immagine di un punto (costruzione in tre
passi) e di un oggetto (virtuale, diritta, grande uguale, simmetrica); specchio lungo metà dell'altezza; due specchi
(perpendicolari e a $70^\circ$) e le immagini tra due specchi ($360^\circ/\alpha - 1$, in un `ad-note`).

Esempi: $25^\circ$ con lo specchio ($i = r = 65^\circ$, $130^\circ$ tra i raggi); lo specchio dell'armadio
($3{,}0\,\text{m}$, poi $2{,}0\,\text{m}$); lo specchio per vedersi interi ($1{,}70\,\text{m}$, occhi a
$1{,}60\,\text{m}$: da $0{,}80$ a $1{,}65\,\text{m}$); specchi perpendicolari ($60^\circ$ e $30^\circ$); specchi a
$70^\circ$ ($i_2 = 40^\circ$).

Avvisi accanto alla regola: gli angoli dalla normale e non dalla superficie; l'immagine non è dentro lo specchio (né
sulla sua superficie); lo spostamento dell'immagine è il doppio del passo.

## Scelte

- La regola delle immagini tra due specchi è limitata al caso $360^\circ/\alpha$ intero pari, dove vale per ogni
  posizione dell'oggetto; per i dispari dipende dalla posizione, e la lezione non lo dice.
- L'inversione "destra-sinistra" è detta come simmetria rispetto allo specchio, con l'esempio della mano e della scritta
  AMBULANZA.
- Il livello 5 degli esercizi (due specchi con angolo qualunque) generalizza l'esempio 5.

## Figure

Statiche (chiaro e scuro): `leggi-della-riflessione` ($i = 40^\circ$), `riflessione-speculare-diffusa` (superficie
ruvida come spezzata, ogni raggio riflesso con la normale del suo tratto: $54^\circ$, $23{,}3^\circ$, $37{,}1^\circ$),
`immagine-di-un-punto`, `immagine-oggetto-specchio-piano` (con l'occhio, sopra l'oggetto perché i raggi non lo
attraversino), `specchio-meta-altezza` (scala 2 cm per metro), `due-specchi-perpendicolari`, `due-specchi-ad-angolo`.

Interattive: `riflessione-angolo-specchio` (`RiflessioneSpecchio.tsx`): si trascina l'inizio del raggio incidente
intorno al punto di incidenza, ai gradi interi; il riflesso è calcolato con `reflect` di `ottica.tsx`; sotto $i$, $r$ e
l'angolo con lo specchio. `immagine-specchio-piano` (`ImmagineSpecchioPiano.tsx`): si trascinano l'oggetto e l'occhio;
lo specchio ha una lunghezza finita, e quando il raggio cadrebbe fuori dallo specchio non si disegna e la didascalia
dice quale punto l'occhio non vede. Guardate in chiaro, in scuro, sul telefono, dopo averle mosse.

## Esercizi

Generatore `riflessione`, cinque livelli: l'angolo tra i due raggi; dall'angolo con lo specchio; l'immagine nello
specchio piano; lo specchio per vedersi per intero; due specchi ad angolo. Scene `raggi-specchi` a tutti i livelli.

## Domande per Andrea

- L'Amaldi tratta i due specchi ad angolo, e la formula delle immagini $360^\circ/\alpha - 1$?
- Si dice "specchio lungo metà dell'altezza" come qui, o anche si chiede a che altezza appenderlo?
- Il nome "punto di incidenza" e "normale" come qui? I simboli $i$ e $r$, o $\theta_i$ e $\theta_r$?
- La prima legge (i tre raggi nello stesso piano) va enunciata, come qui, anche se al biennio le figure sono piane?

## Verifiche

- `check.mts`: nessun errore e nessun avviso su lezione, formulario e 17 carte.
- Generatore: seed 1, 50001 e 777001, 5000 esercizi ciascuno, `verify.py` PASS; errori piantati bocciati (opzione
  giusta spostata, opzioni doppie, risposta cambiata, dato del testo cambiato, scena spostata: tutti). `review.mts` e
  `width.mts` codice 0.
