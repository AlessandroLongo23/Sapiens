# Note: L'energia cinetica e il teorema dell'energia cinetica

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 17, 30 settembre 2026). Conti rifatti in Python:
$\tfrac{1}{2} \cdot 0{,}45 \cdot 12^2 = 32{,}4$ J; $90/3{,}6 = 25$ m/s, $\tfrac{1}{2} \cdot 1100 \cdot 625 = 343\,750$ J, a
$45$ km/h $85\,937{,}5$ J; $3{,}6^2 = 12{,}96$; esempio 2 $\tfrac{1}{2} \cdot 0{,}50 \cdot 32 = 8{,}0$ J e, con l'errore,
$4{,}0$ J; esempio 3 $\sqrt{7{,}28} = 2{,}698$ m/s; esempio 4 $100/13{,}72 = 7{,}289$ m e $400/13{,}72 = 29{,}15$ m,
rapporto $4{,}0$; spazio di reazione $10$ e $20$ m; esempio 5 $1100 \cdot 400 / 64 = 6875$ N; nel grafico i punti
$(36;\ 7{,}29)$ e $(72;\ 29{,}15)$ a $0{,}04$ cm per unità, e la parabola arriva a $81$ m a $120$ km/h; flashcard
$\tfrac{1}{2} \cdot 2 \cdot 9 = 9$ J. `check.mts` passa.

## Struttura ed esempi

L'energia cinetica (energia come capacità di compiere lavoro, $K = \tfrac{1}{2}m\,v^2$, il joule, la formula ricavata dal
lavoro di una forza costante con il moto uniformemente accelerato, proporzionalità alla massa e al quadrato della
velocità; avviso sul quadrato e sui km/h; esempio 1, pallone e auto); il teorema ($W_{tot} = \Delta K$, i tre casi del
segno, il moto circolare uniforme; avviso sul lavoro totale; esempio 2; avviso sulla differenza dei quadrati; esempio 3,
che riprende la cassa dell'esempio 5 della lezione sul lavoro); lo spazio di frenata ($d = v^2/(2\,\mu_d\,g)$, la massa
che si semplifica, velocità doppia e spazio quadruplo; esempio 4 con il grafico; nota sullo spazio di arresto; esempio
5, la forza frenante; interattiva); un paragrafo finale che porta all'energia potenziale e alla conservazione (lezioni
62 e 63, del gruppo 18).

## Scelte

- La formula $v^2 = 2 a s$ (da ferma) è ricavata nel testo dalle leggi del moto uniformemente accelerato, perché non so
  se la lezione 42 del gruppo 13 la scrive: se la scrive, basta un link.
- Il teorema è enunciato per il lavoro totale e detto valido anche per forze non costanti, senza dimostrazione.
- $\mu_d = 0{,}70$ per l'asfalto asciutto e $0{,}40$ per il bagnato (nella figura interattiva) sono valori indicativi da
  verificare con una fonte (per esempio un manuale per la patente); lo stesso per il tempo di reazione di circa un
  secondo della nota sullo spazio di arresto.
- "Un camion e un'utilitaria con le stesse gomme si fermano nello stesso spazio": vero nel modello dell'attrito
  dinamico con $\mu_d$ costante, e la lezione lo dice solo in quel modello. Nella realtà i camion frenano peggio: se
  Andrea preferisce, si toglie l'esempio del camion.
- Massa di $1{,}1 \cdot 10^3$ kg in notazione scientifica per non avere zeri ambigui.

## Figure

Una TikZ, `spazio-frenata-velocita-grafico` (parabola $d = (v/3{,}6)^2/13{,}72$ tracciata con `plot`, griglia a passi
di $0{,}6$ e $0{,}4$ cm, tacche ogni $30$ km/h e $20$ m, i due punti dell'esempio 4), con la riga `% poi-interattivo:`,
guardata in chiaro e in scuro.

Interattiva `frenata-spazio-velocita` (`fisica/FrenataSpazio.tsx`, registrata sotto il gruppo 17): due auto su due
corsie frenano dalla stessa linea, una a $v$ e una a $2v$ ($v$ da $10$ a $65$ km/h), su asfalto asciutto o bagnato;
le posizioni vengono dalla formula chiusa $x = v\,t - \tfrac{1}{2}a\,t^2$, al doppio del tempo reale; dove si fermano
resta una linea con lo spazio, e sotto sono scritti i due spazi. Strada di $170$ m a $0{,}045$ cm per metro, auto non in
scala. Guardata in chiaro, in scuro, al telefono e dopo il bottone Frena: niente errori, niente scorrimento laterale.

## Esercizi

Generatore `fis-energia-cinetica`, cinque livelli (specifica in `specs/exercises/fis-energia-cinetica.md`): L'energia
cinetica, La velocità in km/h, La velocità dall'energia, Il teorema dell'energia cinetica, Lo spazio di frenata. Niente
scene.

## Domande per Andrea

- La formula dell'energia cinetica si ricava dal lavoro, come qui, o l'Amaldi la dà e poi dimostra il teorema?
- "Teorema dell'energia cinetica" o "teorema delle forze vive"? Il secondo nome va almeno citato?
- I coefficienti di attrito dell'asfalto ($0{,}70$ asciutto, $0{,}40$ bagnato) e il tempo di reazione di un secondo:
  quali valori usa il libro, e con quale fonte?
- Lo spazio di arresto (reazione più frenata) in una nota: basta, o merita un esempio?
- Il camion e l'utilitaria che si fermano nello stesso spazio: si tiene, con la precisazione, o si toglie?
