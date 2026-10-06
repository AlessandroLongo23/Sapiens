# Note: Dal sistema tolemaico al sistema copernicano

Lezione nuova (lotto del terzo anno di fisica, gruppo 36, 6 ottobre 2026). Conti rifatti in Python:

- esempio 1: $0{,}658 \cdot 1{,}88 = 1{,}237$ ($1/1{,}52 = 0{,}658$);
- esempio 2: $\sin 46^\circ = 0{,}7193$; Mercurio $\sin 23^\circ = 0{,}3907$;
- esempio 3: $1/365{,}25 - 1/780 = 1{,}4558 \cdot 10^{-3}$, $T = 686{,}9$ d $= 1{,}881$ anni; Venere
  $1/(1/365{,}25 + 1/584) = 224{,}7$ d; Saturno $1/(1 - 1/29{,}46) \cdot 365{,}25 = 378$ d;
- durata del moto retrogrado di Marte con orbite circolari ($1$ e $1{,}52$ UA, $365{,}25$ e $687$ d): i punti stazionari
  cadono $36{,}5$ giorni prima e dopo l'opposizione, quindi $73$ giorni, con un arco di $16^\circ$;
- figura del sorpasso: Terra a $1{,}1$ cm, Marte a $1{,}672$ cm, Terra a $-80^\circ, -40^\circ, 0^\circ, 40^\circ, 80^\circ$,
  Marte agli stessi istanti a $-42{,}55^\circ, -21{,}28^\circ, 0^\circ, \ldots$ (angoli divisi per $1{,}88$); le linee di
  vista arrivano sulla retta $x = 9$ a $-1{,}485$, $0{,}437$, $0$, $-0{,}437$, $1{,}485$;
- figura di Venere: $3 \sin 46^\circ = 2{,}158$ cm, $V = (1{,}499;\ -1{,}552)$, e $\vec{TV} \cdot \vec{SV} = 0$.

`check.mts` passa senza errori. Avvisi rimasti: "titolo con maiuscole all'inglese" sui titoli che contengono nomi
propri (Terra, Sole, Tolomeo, Copernico, Galileo), che sono falsi allarmi.

## Struttura ed esempi

Che cosa si vede dalla Terra (stelle fisse, Sole e Luna, pianeti con il moto retrogrado, figura della Z di Marte); il
sistema di Tolomeo (deferente ed epiciclo, figura, interattiva dei cappi, esempio 1 sulle due velocità, avviso sul
modello che "non funzionava"); il sistema di Copernico (i cinque punti, il moto retrogrado come sorpasso con figura e
interattiva, avviso sul moto apparente, le distanze con l'esempio 2 di Venere e la sua figura, il periodo sinodico con
l'esempio 3, avviso su sinodico e rivoluzione, i limiti del modello e l'avviso sugli epicicli); Tycho (precisione, stella
nuova e cometa, parallasse, sistema ticonico); Galileo (Luna, macchie, satelliti di Giove, fasi di Venere con la figura,
il Dialogo e il processo); tabella dei tre sistemi.

## Scelte

- Confine con la 93: qui i modelli e le prove fino a Galileo; l'ellisse e le tre leggi stanno nella 93. Keplero è solo
  nominato come assistente di Tycho e come chi toglie i cerchi.
- Confine con la 94: Newton è nominato nell'ultima riga, con il link.
- L'unità astronomica si definisce qui, perché serve nell'esempio 2 e in tutta la 93. Valore del README:
  $1{,}50 \cdot 10^{11}$ m.
- Tre esempi con un conto, come chiede il brief per le lezioni storiche: il rapporto tra le velocità sull'epiciclo e sul
  deferente (moto circolare uniforme del biennio), la distanza di Venere dall'elongazione massima (seno nel triangolo
  rettangolo), il periodo di Marte dal periodo sinodico (un giro in più).
- Il periodo sinodico si indica con $S$ e il periodo di rivoluzione con $T$ (quello della Terra $T_T$). $S$ non compare
  nelle notazioni del README: è usato solo qui. Le lezioni 72-75 usano $S$ per un sistema di riferimento, che in questa lezione
  non compare.
- Il giorno come unità ha il simbolo d ($687\,\text{d}$), detto nell'esempio 3.
- L'equante e l'eccentrico di Tolomeo sono descritti in una frase senza nome ("la Terra un po' spostata dal centro",
  "un punto rispetto al quale il moto appare uniforme").
- Nell'esempio 1 l'epiciclo di Marte ha il periodo misurato rispetto alle stelle (un anno): è il modo in cui il conto
  delle due velocità torna semplice. Nei testi l'epiciclo è spesso descritto con il periodo rispetto alla linea
  Terra-centro, che per Marte è il periodo sinodico.
- Le figure in scuro invertono i colori: nel testo non si nominano i colori dei pallini, e l'ombra di Venere è fatta
  con righe sottili, non con un grigio.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `moto-retrogrado-marte-tra-le-stelle`, `deferente-epiciclo-tolomeo`,
`moto-retrogrado-sorpasso-copernico` (geometria vera: le linee di vista arrivano davvero nei punti segnati),
`venere-massima-elongazione`, `fasi-venere-sistema-copernicano`.

Interattive, registrate sotto il commento del gruppo 36 in `src/lib/utils/interactive.ts`:

- `epiciclo-deferente-cappi` (`fisica/EpicicloDeferente.tsx`). Domanda: che cosa succede ai cappi se l'epiciclo gira più
  lentamente? Cursori: $r/R$ da $0{,}2$ a $0{,}8$, giri sull'epiciclo per ogni giro del deferente da 2 a 8 (misurati
  rispetto a direzioni fisse). La strada intera è disegnata tenue, il tratto percorso in arancione; sotto c'è
  $v_e/v_d = n\,r/R$.
- `moto-retrogrado-sorpasso` (`fisica/MotoRetrogradoSorpasso.tsx`). Domanda: quando si inverte il verso sulla striscia
  delle stelle? Orbite circolari, 300 giorni con l'opposizione al giorno 150; la striscia segna la direzione della linea
  di vista ($0{,}08$ cm per grado), non il punto in cui la linea la incontra: le stelle sono troppo lontane perché la
  posizione della Terra conti. La traccia sale un poco con il tempo, per non sovrapporre andata e ritorno.

## Esercizio guidato

L'esempio 3 (il periodo di Marte dalle opposizioni) renderebbe di più come esercizio guidato. Si fermerebbe in tre
punti: chi fa un giro in più tra due opposizioni, la Terra o Marte? (scelta); quale equazione lega $S$, $T_T$ e $T$?
(scelta tra le due con i segni scambiati); il valore di $T$ in giorni.

## Esercizi

Generatore `fis-sistemi-cosmologici`, cinque livelli (specifica in `specs/exercises/fis-sistemi-cosmologici.md`), con
la scena `elongazione-pianeta` al livello 3.

## Da verificare

- Tolomeo: II secolo d.C., *Almagesto*; precisione "pochi gradi al massimo" (ordine di grandezza a memoria).
- Aristarco di Samo, III secolo a.C.; Aristotele, IV secolo a.C.
- Copernico: *De revolutionibus orbium coelestium*, 1543, anno della morte.
- Tycho Brahe 1546-1601, isola di Hven, precisione di circa un primo d'arco e "dieci volte" meglio dei predecessori;
  stella nuova del 1572, cometa del 1577; "per vent'anni" di osservazioni.
- Parallasse stellare: prima misura nel 1838 (Bessel, non nominato); stella più vicina meno di $1''$ ($0{,}77''$).
- Galileo: cannocchiale nel 1609, *Sidereus Nuncius* nel 1610, *Dialogo* nel 1632, processo e abiura nel 1633.
  Le fasi di Venere (fine 1610) e le macchie solari (lettere del 1613) sono posteriori al *Sidereus Nuncius*: il testo
  dice "altre seguirono nei tre anni successivi".
- Marte: periodo sinodico $780$ d ($779{,}9$), periodo $687$ d, semiasse $1{,}52$ UA, moto retrogrado "circa due mesi e
  mezzo ogni due anni circa" (il conto con orbite circolari dà $73$ giorni).
- Venere: elongazione massima $46^\circ$ (tra $45^\circ$ e $47^\circ$), periodo sinodico $584$ d, periodo $225$ d.
- Mercurio: elongazione massima media $23^\circ$ (va da $18^\circ$ a $28^\circ$ perché l'orbita è eccentrica).
- Saturno: periodo sinodico $378$ d, periodo $29{,}46$ anni.

## Domande per Andrea

- Il periodo sinodico con la formula $1/T = 1/T_T - 1/S$ sta nei libri di terza, o è meglio lasciarlo alle scienze della
  Terra e togliere l'esempio 3?
- L'esempio 1 confronta le velocità sull'epiciclo e sul deferente: è un conto che i libri non fanno. Lo teniamo come
  esempio "con un conto" o basta la descrizione a parole?
- Il sistema ticonico ha una sezione sua e una colonna nella tabella. Troppo per una lezione di terza?
- Il processo a Galileo è in una riga. Serve di più, o è materia di storia e filosofia?

Prerequisiti proposti: fis-moto-circolare-uniforme, fis-seno-coseno
