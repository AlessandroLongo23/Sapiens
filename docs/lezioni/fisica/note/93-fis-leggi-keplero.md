# Note: Le leggi di Keplero

Lezione nuova (lotto del terzo anno di fisica, gruppo 36, 6 ottobre 2026). Conti rifatti in Python:

- esempio 1: $(1{,}471 + 1{,}521)/2 = 1{,}496$; $0{,}050/2{,}992 = 0{,}016711$; $c = 0{,}0167 \cdot 1{,}496 \cdot 10^{11} =
  2{,}50 \cdot 10^{9}$ m; $1{,}521/1{,}471 = 1{,}034$ (il $3\%$ dell'avviso sulle stagioni);
- esempio 2: $54{,}5 \cdot 0{,}586/35{,}1 = 0{,}90989$ km/s; $35{,}1/0{,}586 = 59{,}9$;
- esempio 3: $5{,}20^3 = 140{,}608$, radice $11{,}8578$;
- esempio 4: $75{,}3^2 = 5670{,}09$, radice cubica $17{,}8319$, $2 \cdot 17{,}8319 - 0{,}586 = 35{,}078$;
- avvisi: $0{,}586^{1{,}5} = 0{,}4486$ anni $= 5{,}4$ mesi; $\sqrt{125} = 11{,}18$, $\sqrt[3]{25} = 2{,}92$;
- costante: $365{,}25 \cdot 86\,400 = 3{,}15576 \cdot 10^7$ s; $(3{,}156 \cdot 10^7)^2/(1{,}496 \cdot 10^{11})^3 = 2{,}9749 \cdot
  10^{-19}$ s²/m³;
- esempio 5: $6{,}71/4{,}22 = 1{,}59005$, al cubo $4{,}02004$, radice $2{,}00500$, per $1{,}77$ dà $3{,}5489$ d;
- tabella, $T^2/a^3$: Mercurio $1{,}0021$, Venere $1{,}0008$, Marte $0{,}9996$, Giove $0{,}9986$, Saturno $0{,}9996$: tutti
  $1{,}00$ con tre cifre;
- figura delle aree ($a = 3$, $b = 2{,}4$, $e = 0{,}6$): anomalia media da $-0{,}3$ a $0{,}3$ rad e da $\pi - 0{,}3$ a $\pi + 0{,}3$,
  cioè anomalia eccentrica $\pm 38{,}67^\circ$ e da $169{,}23^\circ$ a $190{,}77^\circ$ (equazione di Keplero risolta con Newton);
  le due aree valgono $\tfrac12 a\,b \cdot 0{,}6 = 2{,}16$ cm² ciascuna;
- figura del confronto: semiasse $1{,}3$ cm, $b = 1{,}272$ e $c = 0{,}268$ per Mercurio, $b = 0{,}331$ e $c = 1{,}257$ per
  Halley, $c = 0{,}022$ per la Terra;
- grafico: Mercurio $(1{,}161;\ 0{,}482)$, Venere $(2{,}169;\ 1{,}230)$, Terra $(3;\ 2)$, Marte $(4{,}572;\ 3{,}762)$ con
  3 cm per UA e 2 cm per anno.

`check.mts` passa senza errori; gli avvisi rimasti sono nel rapporto.

## Struttura ed esempi

L'apertura con Keplero e gli otto primi d'arco; l'ellisse (fuochi, semiassi, $c$, eccentricità, figura); la prima legge
(perielio, afelio, raggio vettore, $r_p$ e $r_a$, $a$ ed $e$ dalle due distanze, esempio 1 sulla Terra, figura del
confronto tra le eccentricità, avvisi sul Sole che non è al centro e sulle stagioni); la seconda legge (figura dei due
settori, interattiva dei dodici settori, $v_p r_p = v_a r_a$ ricavata dai triangoli sottili, esempio 2 sulla cometa di
Halley, avviso sul limite della formula); la terza legge (tabella dei sei pianeti, $T^2 = a^3$ in anni e UA, grafico,
esempio 3 su Giove, esempio 4 sull'afelio della cometa, avvisi sul semiasse e sugli esponenti, la costante in unità SI e
la forma con i rapporti, esempio 5 sulle lune di Giove, avviso sulla costante); tabella di riepilogo e i limiti delle
leggi.

## Scelte

- Confine con la 92: Tycho, Copernico e Galileo sono solo richiamati. Confine con la 94 e la 96: nessuna dinamica. La
  dimostrazione della terza legge per le orbite circolari e il valore $K = 4\pi^2/(G M)$ stanno nella 96, come dice il
  brief; qui si dice solo che $K$ dipende dal corpo centrale, con il link.
- Confine con la 91: la seconda legge è collegata alla conservazione del momento angolare in due righe, con il link;
  il conto $m\,v\,r$ è dato solo al perielio e all'afelio.
- Simboli del README: semiasse maggiore $a$, $T^2/a^3 = $ costante. La costante si chiama $K$ ($K_S$ quella del Sole):
  nel README non ha un nome. In questa lezione non compare l'energia cinetica, quindi non si confonde.
- $r_p$, $r_a$, $v_p$, $v_a$ per distanze e velocità al perielio e all'afelio; il pedice $a$ di afelio convive con il
  semiasse $a$, come nei libri.
- $v_p r_p = v_a r_a$ si ricava dalle aree di due triangoli sottili, una dimostrazione che i libri di terza danno.
- L'ellisse è definita con i fuochi e lo spago; $b = a\sqrt{1 - e^2}$ non c'è, perché non serve in nessun conto.
- La terza legge ha due forme: $T^2 = a^3$ in anni e UA attorno al Sole, e l'uguaglianza dei rapporti per gli altri
  corpi centrali. La costante in unità SI è calcolata una volta, per far vedere le unità.
- I dati di Saturno sono $9{,}54$ UA e $29{,}46$ anni: con il valore $9{,}58$ UA che si trova in alcune tabelle il
  rapporto verrebbe $0{,}99$.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `ellisse-fuochi-semiassi`, `prima-legge-perielio-afelio`,
`orbite-eccentricita-confronto`, `seconda-legge-aree-uguali` (settori di area uguale, calcolati), 
`terza-legge-grafico-periodo-semiasse` (con la riga `% poi-interattivo`).

Interattiva, registrata sotto il commento del gruppo 36:

- `orbita-ellittica-aree` (`fisica/OrbitaAree.tsx`). Domanda: come cambiano i settori, e la velocità, quando l'orbita
  diventa più schiacciata? Semiasse fisso (1 UA, periodo di un anno), eccentricità da 0 a $0{,}8$, dodici settori
  percorsi in tempi uguali, il settore del pianeta in arancione; sotto, $r$ in UA e $v$ in km/s. La posizione viene
  dall'equazione di Keplero risolta con il metodo di Newton; la velocità da $v^2 = v_0^2\,(2a/r - 1)$ con
  $v_0 = 29{,}8$ km/s, formula che la lezione non dà (è nella 97) e che serve solo alla lettura.

## Esercizio guidato

L'esempio 4 (l'afelio della cometa di Halley) renderebbe di più come esercizio guidato: si fermerebbe a chiedere quale
legge lega il periodo alla grandezza dell'orbita (scelta), il valore del semiasse maggiore, e poi quale relazione lega
$a$, $r_p$ e $r_a$ prima del risultato.

## Esercizi

Generatore `fis-leggi-keplero`, sei livelli (specifica in `specs/exercises/fis-leggi-keplero.md`), con la scena
`orbita-perielio-afelio` nei livelli 1, 2 e 3.

## Da verificare

- Keplero 1571-1630; *Astronomia nova* 1609 (prime due leggi), *Harmonices mundi* 1619 (terza); lo scarto di otto primi
  d'arco per Marte.
- Terra: perielio $1{,}471 \cdot 10^{11}$ m, afelio $1{,}521 \cdot 10^{11}$ m, $e = 0{,}0167$; perielio a inizio
  gennaio, afelio a inizio luglio; $1\,\text{UA} = 1{,}496 \cdot 10^{11}$ m (il README dà $1{,}50 \cdot 10^{11}$).
- Diametro del Sole $1{,}39 \cdot 10^{9}$ m (per "meno del doppio del diametro del Sole").
- Eccentricità: Mercurio $0{,}206$, cometa di Halley $0{,}967$.
- Cometa di Halley: perielio $0{,}586$ UA, afelio $35{,}1$ UA, periodo $75{,}3$ anni, velocità al perielio
  $54{,}5$ km/s (all'afelio $0{,}91$ km/s).
- Tabella dei pianeti: semiassi $0{,}387$, $0{,}723$, $1{,}000$, $1{,}524$, $5{,}203$, $9{,}54$ UA; periodi $0{,}241$,
  $0{,}615$, $1{,}000$, $1{,}881$, $11{,}86$, $29{,}46$ anni. Nettuno a $30$ UA.
- Lune di Giove: Io $4{,}22 \cdot 10^5$ km e $1{,}77$ d; Europa $6{,}71 \cdot 10^5$ km e $3{,}55$ d.

## Domande per Andrea

- La costante della terza legge: $K$ va bene, o i libri che usate la chiamano in un altro modo ($k$, $K_S$)?
- La relazione $v_p r_p = v_a r_a$ ricavata dai triangoli sottili: la teniamo in questa lezione o la lasciamo alla 91
  (conservazione del momento angolare), che la riprende?
- Gli esponenti frazionari ($a^{3/2}$, $T^{2/3}$) sono dati come tasti della calcolatrice con il link a matematica. In
  terza li hanno già fatti tutti?
- La tabella dà $T^2/a^3 = 1{,}00$ per tutti i pianeti con tre cifre. Preferisci i valori con quattro cifre, che
  mostrano gli scarti ($0{,}9986$ per Giove)?
- L'eccentricità si definisce qui come $c/a$, come nella lezione di matematica sull'ellisse: va bene anche se quella
  lezione può arrivare dopo?

Prerequisiti proposti: fis-sistemi-cosmologici, fis-moto-circolare-uniforme, ellisse, fis-proporzionalita-inversa
