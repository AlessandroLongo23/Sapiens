# Note: La conservazione dell'energia meccanica

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 18, 30 settembre 2026). Conti rifatti in Python:

- caduta: $\sqrt{2 \cdot 9{,}8 \cdot 5{,}0} = 9{,}899$ m/s, $2{,}0 \cdot 9{,}8 \cdot 5{,}0 = 98$ J e a metà $49$ J,
  $\sqrt{2 \cdot 9{,}8 \cdot 2{,}5} = 7{,}0$ m/s;
- scivolo e pendolo: $\sqrt{2 \cdot 9{,}8 \cdot 3{,}2} = 7{,}920$ m/s, $\sqrt{2 \cdot 9{,}8 \cdot 0{,}20} = 1{,}980$ m/s,
  $\sqrt{2 \cdot 9{,}8 \cdot 0{,}10} = 1{,}400$ m/s;
- montagne russe: $\sqrt{2 \cdot 9{,}8 \cdot 18} = 18{,}78$ m/s, $\sqrt{2 \cdot 9{,}8 \cdot 30} = 24{,}25$ m/s,
  $\sqrt{16 + 294} = \sqrt{310} = 17{,}61$ m/s, $4{,}0 + \sqrt{294} = 21{,}15$ m/s, $15 + 16/19{,}6 = 15{,}82$ m;
- lancio: $144 / 19{,}6 = 7{,}347$ m;
- molla: $\tfrac12 \cdot 400 \cdot 0{,}10^2 = 2{,}0$ J, $\sqrt{8{,}0} = 2{,}828$ m/s, $2{,}0 / (0{,}50 \cdot 9{,}8) = 0{,}408$ m, con
  $1{,}0$ kg $2{,}0$ m/s e $0{,}204$ m;
- figura del pendolo: $3 \sin 40^\circ = 1{,}928$ cm, $3 - 3\cos 40^\circ = 0{,}702$ cm.

`check.mts` passa.

## Struttura ed esempi

L'energia meccanica $E = K + U$; la legge di conservazione ricavata dal teorema dell'energia cinetica (lezione 61 del
gruppo 17, linkata) e da $W = -\Delta U$, con le forze che non lavorano (reazione, tensione); la caduta libera con la
figura delle barre e $v = \sqrt{2gh}$, l'avviso sulla radice; il procedimento in cinque passi; la velocità che non
dipende dal percorso (figura, esempio 1 dello scivolo); il pendolo (figura, esempio 2, nota su $h = L - L\cos\theta$,
interattiva); le montagne russe (figura del profilo, esempio 3 da fermo, esempio 4 con la velocità iniziale e l'altezza
massima, avviso sulle velocità che non si sommano, interattiva); il lancio verticale (esempio 5); la molla che lancia un
blocco (figura, esempio 6 con il lancio e la salita, avviso sulla massa che non si semplifica, interattiva).

## Scelte

- La lezione non ripete la dimostrazione del teorema dell'energia cinetica: lo usa, con il link.
- Il lancio verticale e la caduta rimandano alla lezione del moto rettilineo (gruppo 13) per il confronto con la
  cinematica, senza rifare i conti con le leggi orarie.
- Tre interattive, perché qui le barre che si scambiano sono il punto della lezione e un disegno statico non le mostra.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `caduta-libera-energia-barre` (1 m = 0,6 cm, barre di 98 J = 3 cm),
`stessa-altezza-stessa-velocita`, `pendolo-altezza-h` (filo di 3 cm a $40^\circ$), `montagne-russe-profilo` (1 cm =
10 m: $A$ a 3 cm, $B$ a 1,2 cm; riga `% poi-interattivo`), `molla-lancio-salita`.

Interattive (registrate sotto il commento del gruppo 18 in `src/lib/utils/interactive.ts`):

- `pendolo-energia-barre` (`fisica/PendoloEnergia.tsx`): pallina di $0{,}50$ kg, filo di $1{,}0$ m, angolo di partenza da
  $10^\circ$ a $60^\circ$; passo di integrazione di $\theta'' = -(g/L)\sin\theta$ scritto a mano, con la velocità
  ripresa dall'energia a ogni passo, così le barre tornano esatte.
- `montagne-russe-energia` (`fisica/MontagneRusseEnergia.tsx`): carrello di 500 kg su una pista di 58 m fatta di archi di
  coseno, trascinabile fino alla partenza (al più 33 m), barre di $K$, $U$ e della somma alla scala del disegno (la cima
  della barra di $U$ è alla quota del carrello); l'attrito si accende con un interruttore (vedi la nota della lezione
  64).
- `molla-lancio-rampa-energia` (`fisica/MollaLancioRampa.tsx`): molla da $400$ N/m, blocco di $0{,}50$ kg, compressione
  da 2 a 12 cm, rampa a $30^\circ$; barre dell'energia elastica, cinetica, gravitazionale e della somma; la linea
  tratteggiata segna l'altezza a cui il blocco si fermerà.

Le barre sono un pezzo mio, `fisica/energia.tsx`, che il kit non ha. Con il movimento ridotto il bottone fa avanzare la
simulazione di un tratto fisso (un quarto, mezzo, un decimo di secondo) senza animazione.

## Esercizi

Generatore `energia`, cinque livelli (specifica in `specs/exercises/energia.md`): La caduta libera, L'altezza massima, Da
un punto all'altro della pista, La molla che lancia un blocco, La molla e la salita. Scena nuova `pista-energia`
(`scenes/PistaEnergia.tsx`) al livello 3.

## Domande per Andrea

- La legge di conservazione si enuncia con "lavorano solo il peso e le forze elastiche" o già con "forze conservative"?
- Il pendolo con $h = L - L\cos\theta$ in una nota: va bene, o l'Amaldi del biennio lo fa negli esempi? (da verificare)
- Nel lancio verticale, la velocità di ricaduta uguale a quella di lancio: la dico solo in una riga. Basta?
- Le montagne russe con la velocità iniziale (esempio 4) sono al livello del secondo anno, o meglio solo carrelli che
  partono da fermi?
