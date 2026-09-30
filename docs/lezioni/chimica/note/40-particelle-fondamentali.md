# Note: Elettroni, protoni e neutroni

Lezione nuova (biennio di chimica, gruppo 28, 30 settembre 2026). Conti rifatti in Python: esempio 1,
$1{,}60 \cdot 10^{-19}/1{,}76 \cdot 10^{11} = 9{,}09 \cdot 10^{-31}\,\text{kg}$; esempio 2, $4{,}80/1{,}60 = 3$,
$8{,}00/1{,}60 = 5$, $6{,}40/1{,}60 = 4$, $5{,}6/1{,}60 = 3{,}5$; esempio 3, $1{,}673 \cdot 10^{-27}/9{,}11 \cdot 10^{-31} =
1836{,}4$; esempio 4, $-2e = -3{,}20 \cdot 10^{-19}\,\text{C}$; tabella in $\text{u}$: $9{,}109 \cdot 10^{-31}/1{,}6605 \cdot
10^{-27} = 0{,}000549$, $1{,}6726/1{,}6605 = 1{,}0073$, $1{,}6749/1{,}6605 = 1{,}0087$. `check.mts` passa.

## Struttura

Tubo di Crookes e raggi catodici (tre osservazioni, figura), Thomson e $e/m$, Millikan con la figura della goccia ed
esempi 1 e 2; i raggi canale di Goldstein, il protone di Rutherford, l'esempio 3 e due avvisi (masse diverse, raggi
canale che non sono sempre protoni); il neutrone di Chadwick; la tabella delle tre particelle con un esempio sulla carica
di uno ione.

## Scelte e fonti

- Simboli $\mathrm{e^-}$, $\mathrm{p^+}$, $\mathrm{n^0}$, come molti libri italiani (da verificare sul Valitutti).
- Valori della tabella: CODATA 2018 arrotondati (massa dell'elettrone $9{,}109 \cdot 10^{-31}\,\text{kg}$, protone
  $1{,}6726 \cdot 10^{-27}$, neutrone $1{,}6749 \cdot 10^{-27}$, $1\,\text{u} = 1{,}6605 \cdot 10^{-27}\,\text{kg}$),
  valori a memoria, da verificare sulla tabella CODATA. $1\,\text{u}$ scritto $1{,}661 \cdot 10^{-27}\,\text{kg}$ come la
  lezione 01 ($1{,}661 \cdot 10^{-24}\,\text{g}$).
- Date: Crookes, tubi degli anni Settanta dell'Ottocento; Goldstein, raggi canale, 1886; Thomson, $e/m$, 1897;
  Millikan, goccia d'olio, 1909 (pubblicazioni 1910 e 1913); Rutherford, protone dall'azoto, 1919, il nome nel 1920;
  Chadwick, neutrone, 1932, dal berillio colpito da particelle alfa. Da manuali, da verificare.
- Il valore di $e/m$ di Thomson del 1897 era circa $10^{11}\,\text{C/kg}$ (da verificare): la lezione dà il valore
  moderno, $1{,}76 \cdot 10^{11}$, e dice solo "più di mille volte" quello dello ione idrogeno, che è quello che Thomson
  poteva dire.
- La ruota a palette di Crookes è nella lezione come la raccontano i libri ("trasportano energia, come un getto di
  particelle"); oggi si sa che la ruota gira soprattutto per effetti termici: la frase non dice che è la prova della
  massa, ma andrebbe detto ad Andrea.

## Figure

Due TikZ, guardate in chiaro e in scuro: `particelle-tubo-raggi-catodici` (catodo, anodo forato, placche, fascio che si
piega verso il più, schermo) e `particelle-goccia-millikan`. Nessuna interattiva.

## Esercizi

Generatore `particelle-fondamentali`, cinque livelli (specifica in `specs/exercises/particelle-fondamentali.md`), senza
scene.

## Domande per Andrea

- La ruota a palette di Crookes si racconta ancora come prova che i raggi catodici sono particelle, o si toglie?
- Millikan va fatto solo a parole (come ora), o serve la formula dell'equilibrio della goccia ($q E = m g$)? Nella
  lezione non c'è, perché il campo elettrico al biennio non si fa.
- I raggi canale di Goldstein servono, o basta dire che il protone è lo ione idrogeno?
- Il nome "particelle subatomiche" o "particelle fondamentali"? Lo slug dice "fondamentali", ma protone e neutrone non
  lo sono (sono fatti di quark): la lezione usa "subatomiche".
