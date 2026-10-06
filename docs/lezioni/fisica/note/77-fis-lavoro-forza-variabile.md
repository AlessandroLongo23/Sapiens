# Note: Il lavoro di una forza variabile

Lezione nuova (lotto del terzo anno di fisica, gruppo 30, 6 ottobre 2026). Conti rifatti in Python:

- esempio 1: $6{,}0 \cdot 2{,}0 = 12$ J, $\tfrac{1}{2} \cdot 3{,}0 \cdot 6{,}0 = 9{,}0$ J, totale $21$ J; forza media
  $21/5{,}0 = 4{,}2$ N;
- esempio 2: pendenza $-2{,}0$ N/m, zero a $4{,}0$ m, $16 - 4{,}0 = 12$ J;
- esempio 3: curva $F = 32\,\text{N} \cdot [1 - (1 - x/40\,\text{cm})^2]$; contati con uno script $34$ quadretti interi e
  $14$ attraversati, $41 \cdot 0{,}20 = 8{,}2$ J; area esatta $\tfrac{2}{3} \cdot 32 \cdot 0{,}40 = 8{,}53$ J; triangolo
  della molla $6{,}4$ J;
- figura interattiva: per la molla la somma dei rettangoli vale $6{,}4\,(1 - 1/N)$ J, quindi $4{,}8$ J con 4 tratti e
  $6{,}24$ J con 40; per la fionda $6{,}8$ J con 4 tratti e $8{,}37$ J con 40;
- esempio 4: $\tfrac{1}{2} \cdot 300 \cdot (0{,}040^2 - 0{,}10^2) = 0{,}24 - 1{,}5 = -1{,}26$ J; controllo
  $21\,\text{N} \cdot 0{,}060\,\text{m} = 1{,}26$ J; l'errore del riquadro $\tfrac{1}{2} \cdot 300 \cdot 0{,}060^2 = 0{,}54$ J;
- esempio 5: $\sqrt{2 \cdot 21 / 2{,}0} = 4{,}583$ m/s;
- esempio 6: $2{,}0 \cdot \sqrt{1{,}2/480} = 0{,}10$ m, $480 \cdot 0{,}10 = 48$ N, $24 \cdot 0{,}10 = 2{,}4$ J
  $= \tfrac{1}{2} \cdot 1{,}2 \cdot 2{,}0^2$.

`check.mts` passa senza errori e senza avvisi.

## Struttura ed esempi

Richiamo in poche righe del biennio (rettangolo e triangolo, lezione 59, con il link); il lavoro come somma di piccoli
lavori $F\,\Delta x$ e la regola dell'area (figura dei rettangoli, interattiva), con il confronto con il grafico
velocità-tempo; grafici a tratti rettilinei; aree sotto l'asse; forza media; grafici curvi e conteggio dei quadretti;
lavoro della forza elastica tra due deformazioni, ricavato dall'area del trapezio; teorema dell'energia cinetica con
forze variabili.

Sei esempi: una spinta che si esaurisce; una forza che cambia verso; l'elastico di una fionda con i quadretti; la
molla tesa ancora di più; la velocità del carrello dal grafico; il respingente.

## Scelte

- Confine con il biennio: la lezione 59 ha già il rettangolo, il triangolo della molla e il trapezio tra due
  allungamenti per il lavoro della mano. Qui il passo nuovo è il ragionamento sui piccoli tratti, i grafici qualunque,
  le aree negative, la forza media, e il lavoro della forza elastica con il suo segno.
- Confine con la 78: la lezione dice che il lavoro elastico dipende solo dalle deformazioni iniziale e finale e che
  $\tfrac{1}{2} k x^2$ è l'energia potenziale elastica del biennio, poi rimanda alla 78. Non usa $W = -\Delta U$ e non
  nomina le forze conservative.
- Confine con la 79: niente attrito negli esempi con l'energia cinetica.
- Sul grafico la grandezza in verticale è $F$, la componente della forza lungo l'asse del moto, con il segno. In
  orizzontale c'è la posizione $x$; per la molla $x$ è la deformazione, come nella lezione 62.
- I rettangoli della figura e dell'interattiva sono alti quanto la forza all'inizio del tratto (somma per difetto se la
  forza cresce): così con pochi tratti l'errore si vede bene. Con il punto medio la molla darebbe subito il valore
  esatto e la figura non mostrerebbe niente.
- Forza elastica scritta $F = -k\,x$, come componente. Lavoro $W_{el} = \tfrac{1}{2} k x_1^2 - \tfrac{1}{2} k x_2^2$.
- La parola "integrale" non c'è. Per le curve si dice che il valore esatto chiede strumenti del quinto anno.
- Gravità e gas compaiono in un paragrafo, con i link alle lezioni 97 e 109.

## Figure

Sette TikZ, guardate in chiaro e in scuro: `lavoro-forza-variabile-rettangoli` (curva $0{,}5 + 1{,}1x - 0{,}11x^2$,
rettangoli alti $0{,}5$, $1{,}49$, $2{,}26$, $2{,}81$, $3{,}14$), `grafico-forza-spostamento-spinta` (1 cm = 1 m, 0,4 cm
= 1 N), `grafico-forza-spostamento-area-negativa` (0,9 cm = 1 m, 0,25 cm = 1 N), `forza-media-rettangolo-stessa-area`
($4{,}2$ N a 1,68 cm), `grafico-fionda-quadretti` (quadretti di 0,55 cm, curva $2x - 0{,}22727x^2$),
`grafico-forza-elastica-trapezio`, `carrello-respingente-molla`.

Interattiva (registrata sotto il commento del gruppo 30):

- `lavoro-area-rettangoli-tratti` (`fisica/LavoroRettangoli.tsx`). Domanda: in quanti tratti bisogna dividere lo
  spostamento perché la somma dei rettangoli dia l'area sotto il grafico? Cursore per il numero di tratti (da 1 a 40),
  scelta tra la molla e la fionda dell'esempio 3.

## Esercizi

Generatore `fis-lavoro-forza-variabile`, sei livelli (specifica in `specs/exercises/fis-lavoro-forza-variabile.md`).
Scena nuova `grafico-forza-spostamento` (`scenes/GraficoForzaSpostamento.tsx`) ai livelli 1, 2, 3 e 5. Senza esercizio
resta il conteggio dei quadretti sotto una curva (esempio 3): la risposta dipende da come si contano i quadretti di
bordo, e a scelta multipla le opzioni dovrebbero essere intervalli.

## Esercizio guidato

L'esempio 2 (la forza che cambia verso). Si fermerebbe tre volte: dopo il grafico, "dove si annulla la forza?"; dopo
le due aree, "che segno ha il lavoro tra 4 e 6 metri, e perché?"; prima della somma, "il lavoro totale è 20 J o 12 J?".

## Domande per Andrea

- Il titolo "lavoro di una forza variabile" nei libri copre spesso solo la molla. Qui metà della lezione è sui grafici
  qualunque: è l'equilibrio giusto, o la molla merita più spazio?
- Il conteggio dei quadretti (esempio 3) si fa ancora in classe, o è meglio toglierlo e dire solo che il risultato si
  enuncia?
- La forza media è definita come $W / \Delta x$ (media sullo spostamento). Nella lezione 81 il gruppo 32 definisce la
  forza media sull'intervallo di tempo, dall'impulso: serve una frase che distingua le due?
- Nell'esempio 6 il respingente: la formula $x = v\sqrt{m/k}$ è ricavata dal teorema dell'energia cinetica. Nel biennio
  lo stesso tipo di problema si faceva con la conservazione dell'energia: va detto, o confonde?
- Il segno di $F = -k\,x$ con $x$ che può essere negativo (molla compressa): è chiaro così, o meglio trattare solo
  l'allungamento?

## Da verificare

- La forma del grafico della fionda (forza che cresce sempre meno) è un modello scelto per avere un conto esatto, non
  una misura; i $32$ N a $40$ cm sono un ordine di grandezza plausibile, scritto a memoria.
- I numeri dei quadretti dell'esempio 3 ($34$ interi, $14$ attraversati) sono contati con uno script sulla curva
  esatta: conviene ricontarli a occhio sulla figura pubblicata.

Prerequisiti proposti: lavoro, fis-forza-elastica, fis-energia-cinetica, fis-grafico-velocita-tempo
