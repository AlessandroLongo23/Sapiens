# Note: La conservazione della quantità di moto

Lezione nuova (lotto del terzo anno, gruppo 33, 6 ottobre 2026). `check.mts` passa senza avvisi. Conti rifatti in Python:

- esempio 1: $50 \cdot 3{,}0 / 75 = 2{,}0$ m/s, quantità di moto $\pm 150$ kg·m/s;
- esempio 2: $0{,}012 \cdot 600 / 4{,}0 = 1{,}8$ m/s, $7{,}2$ kg·m/s, rapporto delle masse $333$; energie $2160$ J e
  $6{,}48$ J; con i grammi non convertiti $1800$ m/s;
- esempio 3: $65 \cdot 2{,}0 = 130$ kg·m/s, $(130 - 40)/60 = 1{,}5$ m/s; senza lo zaino nel totale
  $(120 - 40)/60 = 1{,}33$ m/s;
- esempio 4: $p_1 = 1{,}2$, $p_2 = 0{,}90$, $p_3 = 1{,}5$ kg·m/s, $V_3 = 3{,}0$ m/s, $\tan^{-1}(0{,}75) = 36{,}87^\circ$;
- energia dei pattinatori: $225 + 150 = 375$ J;
- figura interattiva: con $6{,}0$ J e masse $1{,}0$ e $2{,}0$ kg, $2{,}83$ e $1{,}41$ m/s.

## Struttura ed esempi

Apertura con i pattinatori della lezione 52 e il fucile; sistema, forze interne ed esterne (figura); perché
$\vec p_{tot}$ si conserva, dal terzo principio e dal teorema dell'impulso, e $\Delta\vec p_{tot} = \vec F_{est}\,\Delta t$;
la legge, con l'avviso "si conserva il totale"; quando un sistema si tratta come isolato (forze bilanciate, interazione
breve, nessuna forza) e la conservazione per componenti; procedimento in cinque passi; corpi fermi che si separano
(esempio 1 con figura prima/dopo, interattiva); il rinculo (figura, esempio 2, due avvisi, il razzo in tre righe); un
sistema già in moto (esempio 3 con figura, avviso); le esplosioni nel piano (esempio 4 con figura); quantità di moto
ed energia cinetica, con il rimando alle due lezioni sugli urti.

## Scelte

- Confini. La lezione 80 (gruppo 32) definisce $\vec p$ di un corpo e di un sistema e la 81 il teorema dell'impulso:
  qui si usano con il link, senza ridefinirli. Gli urti stanno nelle lezioni 83 e 84: in questa non c'è nessun urto,
  solo separazioni (spinta, sparo, lancio, esplosione). L'esempio classico del sacco che cade su un carrello è un
  urto completamente anelastico e non c'è: la conservazione della sola componente orizzontale è enunciata in un
  paragrafo, senza esempio.
- Simboli. Velocità prima $v$, dopo $V$ (README, da verificare sull'Amaldi) anche quando non c'è un urto, per usare
  ovunque la stessa scrittura. $\vec F_{21}$ è la forza che il corpo 2 esercita sul corpo 1, come $F_{BA}$ nella
  lezione 52. $\vec F_{est}$ per la risultante delle forze esterne. Nelle figure le quantità di moto sono frecce `blue`
  (vettore generico): la tabella dei colori non ha una voce per $\vec p$.
- "Sistema isolato" è definito come "risultante delle forze esterne nulla", che è la definizione che serve ai conti;
  molti libri distinguono "isolato" (nessuna forza esterna) da "con risultante nulla". Vedi le domande.
- Il razzo è solo un capoverso: la lezione 52 ha già il razzo con il terzo principio, e l'equazione del razzo non è
  da terzo anno.
- L'energia cinetica che aumenta nell'esplosione chiude la lezione e prepara le due successive.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `sistema-forze-interne-esterne`, `pattinatori-prima-dopo` (0,5 cm per
m/s: 1,5 e 1,0 cm), `fucile-rinculo` (le due $\vec p$ lunghe uguali, 1,8 cm), `zaino-prima-dopo` (0,3 cm per m/s: 0,6,
0,45 e 2,4 cm), `esplosione-tre-frammenti` (2 cm per kg·m/s: 2,4, 1,8 e 3,0 cm; arco fino a $216{,}87^\circ$).

Interattiva `carrelli-molla-rinculo` (`fisica/CarrelliMollaRinculo.tsx`). Domanda: se raddoppio la massa di un
carrello, che cosa cambia nelle due velocità e nelle due quantità di moto? Due carrelli fermi con una molla che dà
sempre $6{,}0$ J; cursori per le masse (da 0,5 a 4 kg), bottone "Libera la molla". Le velocità vengono dalle due leggi
di conservazione, $V_1 = \sqrt{2E m_2/(m_1(m_1 + m_2))}$; sopra ogni carrello la velocità e la quantità di moto. Il
testo dopo la figura dà la risposta. Guardata in chiaro, in scuro e da telefono, ferma e a fine corsa, con le masse
iniziali; gli estremi dei cursori sono controllati con un conto (la freccia più lunga è 1,7 cm e la corsa si ferma
prima del bordo), non con uno screenshot.

## Esercizio guidato

L'esempio 3 (lo zaino lanciato in avanti) è quello che renderebbe di più. Si fermerebbe in tre punti: (1) "Qual è la
massa che si muove prima del lancio?" ($65$ kg, non $60$); (2) "Quanto vale la quantità di moto totale prima?"
($130$ kg·m/s); (3) "Scrivi la quantità di moto totale dopo il lancio, con $V$ incognita" ($60\,V + 40$).

## Esercizi

Generatore `fis-conservazione-quantita-moto`, quattro livelli (specifica in
`specs/exercises/fis-conservazione-quantita-moto.md`): Due corpi fermi che si spingono, Il rinculo di un fucile, Un
sistema già in moto che si separa, Tre frammenti nel piano. Scena `vettori-piano` (esiste già) al livello 4. L'angolo
del terzo frammento (esempio 4) non ha un livello.

## Da verificare

- Fucile di $4{,}0$ kg, proiettile di $12$ g a $600$ m/s: valori plausibili scritti a memoria, non presi da una fonte.
- La notazione $v$ prima e $V$ dopo (README: "come l'Amaldi, da verificare").

## Domande per Andrea

- "Sistema isolato" come "risultante delle forze esterne nulla" va bene, o vuoi la distinzione tra isolato e non
  isolato con risultante nulla?
- La dimostrazione usa il teorema dell'impulso con forze costanti e dice in una riga che con forze variabili si
  ripete su intervalli brevi. Basta, o serve la forza media della lezione 81?
- La conservazione di una sola componente (forze esterne verticali) è enunciata senza esempio. Aggiungo il carrello
  sotto la pioggia, oppure sta meglio nella lezione sugli urti anelastici?
- Negli esempi con le armi (fucile) preferisci un altro contesto, per esempio un cannone d'epoca o un estintore?

Prerequisiti proposti: fis-quantita-moto-def, fis-impulso, fis-terzo-principio, fis-seno-coseno
