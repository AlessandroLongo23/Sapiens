# Note: Prodotto scalare e prodotto vettoriale

Lezione nuova (lotto del terzo anno di fisica, gruppo 30, 6 ottobre 2026). Conti rifatti in Python:

- esempio 1: $80 \cdot 12 \cdot \cos 35^\circ = 786{,}39$ J;
- coseno dell'angolo ottuso: $\cos 145^\circ = -0{,}8192$;
- esempio 2: $4{,}0 \cdot 9{,}8 = 39{,}2$ N, $39{,}2 \cdot 2{,}5 \cdot \cos 115^\circ = -41{,}42$ J, controllo
  $2{,}5 \cdot \sin 25^\circ = 1{,}0565$ m e $39{,}2 \cdot 1{,}0565 = 41{,}42$ J;
- esempio 3: $3 \cdot 5 + 4 \cdot (-2) = 7$;
- esempio 4: prodotto scalare $2$, moduli $5$ e $2{,}2361$, $\cos\alpha = 0{,}17889$, $\alpha = 79{,}70^\circ$;
- esempio 5: $0{,}25 \cdot 40 \cdot \sin 60^\circ = 8{,}660$ N·m, braccio $0{,}2165$ m;
- esempio 6: $3 \cdot 4 - 2 \cdot 1 = 10$;
- esempio 7: $(-10;\ 7;\ 9)$, con i due prodotti scalari di controllo uguali a zero.

`check.mts` passa senza errori e senza avvisi (28.600 caratteri circa, vicino al limite alto: la lezione ha due
operazioni).

## Struttura ed esempi

Il prodotto scalare a partire dal lavoro $F\,s\cos\alpha$ del biennio, con la proiezione (figura); il segno e il coseno
di un angolo ottuso, introdotto con $\cos(180^\circ - \alpha) = -\cos\alpha$ e la calcolatrice, senza circonferenza
goniometrica (figura dei tre casi, tabella, interattiva); le proprietà; il prodotto scalare con le componenti, ricavato
dalla proprietà distributiva; l'angolo tra due vettori. Poi il prodotto vettoriale: modulo come area del parallelogramma
(figura), direzione e verso con la mano destra (figura in prospettiva), i simboli $\odot$ e $\otimes$ (figura),
anticommutatività, interattiva; le componenti nel piano ($c_z$) e nello spazio; tabella di confronto.

Sette esempi: lavoro con angolo acuto; lavoro del peso in salita con angolo ottuso; lavoro dalle componenti; angolo tra
due vettori; modulo, direzione e verso di $\vec r \times \vec F$ per una chiave; componenti nel piano con i fattori
scambiati; componenti nello spazio con il controllo di perpendicolarità.

## Scelte

- Confine con le lezioni 88 e 90: il momento di una forza compare solo nell'esempio 5, come numero che lo studente
  riconosce dal primo anno ($M = F\,b$), con il link alle due lezioni. Momento torcente come vettore e momento angolare
  non sono trattati.
- Niente versori: le formule con le componenti si ricavano dai vettori componenti $\vec a_x$ e $\vec a_y$ e dalla
  proprietà distributiva. Il README chiede i versori "solo se una lezione li introduce", e qui non servono.
- La regola della mano destra è data nella forma "dita che si chiudono da $\vec a$ verso $\vec b$, pollice". La forma
  dell'Amaldi (pollice lungo $\vec a$, dita lungo $\vec b$, verso uscente dal palmo) è in un riquadro `ad-note`.
- Il seno di un angolo ottuso è introdotto con $\sin(180^\circ - \alpha) = \sin\alpha$, in una riga.
- Terna degli assi: $x$ a destra, $y$ in alto, $z$ uscente dal foglio.
- I vettori degli esempi 4, 6 e 7 sono senza unità, come nei libri di matematica; quelli degli esempi 1, 2, 3 e 5 sono
  forze e spostamenti.
- La proprietà distributiva è enunciata senza dimostrazione, per tutti e due i prodotti.
- Il prodotto misto e il doppio prodotto vettoriale non ci sono.

## Figure

Sette TikZ, guardate in chiaro e in scuro: `prodotto-scalare-proiezione` ($\vec b$ a $40^\circ$, lungo 2,6 cm:
proiezione $1{,}992$ cm), `prodotto-scalare-segno-tre-casi` ($50^\circ$, $90^\circ$, $130^\circ$),
`lavoro-peso-salita-angolo-ottuso` (rampa a $25^\circ$, arco di $115^\circ$ da $-90^\circ$ a $25^\circ$),
`prodotto-vettoriale-area-parallelogramma`, `prodotto-vettoriale-mano-destra`, `prodotto-vettoriale-uscente-entrante`,
`prodotto-vettoriale-chiave-bullone` ($\vec r$ di 2,5 cm, $\vec F$ a $60^\circ$).

Interattive (registrate sotto il commento del gruppo 30 in `src/lib/utils/interactive.ts`):

- `prodotto-scalare-proiezione-segno` (`fisica/ProdottoScalare.tsx`). Domanda: che cosa succede al prodotto scalare
  quando l'angolo tra i due vettori supera $90^\circ$? Si trascina la punta di $\vec b$ sulla griglia; $\vec a$ è fisso,
  lungo 4 quadretti.
- `prodotto-vettoriale-area-verso` (`fisica/ProdottoVettoriale.tsx`). Domanda: quando il prodotto vettoriale esce dal
  foglio e quando entra, e quanto è grande? Si trascinano le punte dei due vettori; il parallelogramma è colorato e il
  simbolo cambia tra $\odot$ e $\otimes$.

## Esercizi

Generatore `fis-prodotto-scalare-vettoriale`, sette livelli (specifica in
`specs/exercises/fis-prodotto-scalare-vettoriale.md`). La scena del livello 5 è `vettori-piano`, che esiste già. Senza
esercizio restano la regola della mano destra su un disegno senza numeri e il controllo di perpendicolarità
dell'esempio 7.

## Esercizio guidato

L'esempio 7 (componenti nello spazio). Si fermerebbe tre volte: dopo il testo, "quali componenti di $\vec a$ e di
$\vec b$ entrano in $c_x$?"; prima di $c_y$, "in che ordine vanno le lettere?"; alla fine, "come controlli che il
risultato sia perpendicolare ai due vettori?".

## Domande per Andrea

- La regola della mano destra: va bene quella delle dita che si chiudono, o in classe si usa quella del palmo (o quella
  delle tre dita) e conviene metterla per prima?
- Le componenti nello spazio (esempio 7) sono al livello del terzo anno, o meglio fermarsi a $c_z$ nel piano e spostare
  il resto in un riquadro?
- Il prodotto scalare con le componenti è ricavato con la proprietà distributiva enunciata e non dimostrata: basta?
- Per l'angolo ottuso l'esempio 2 trova $115^\circ$ come $90^\circ + 25^\circ$ dal disegno. È chiaro, o serve un passo in
  più?
- I punti e virgola tra le componenti, $(4;\ 3)$: è la scrittura che usi, o preferisci $(4, 3)$?

## Da verificare

- La forma della regola della mano destra dell'Amaldi (pollice lungo $\vec a$, dita lungo $\vec b$, verso uscente dal
  palmo), scritta a memoria nel riquadro.
- I colori dei vettori nelle figure seguono la tabella del README (blu per i vettori generici, rosso per le forze,
  arancione per il risultato), in attesa della conferma già chiesta ad Andrea.

Prerequisiti proposti: fis-operazioni-vettori, fis-seno-coseno, lavoro, fis-momento-forza
