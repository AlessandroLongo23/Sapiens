# Note: I modelli atomici di Thomson e di Rutherford

Lezione nuova (biennio di chimica, gruppo 28, 30 settembre 2026). Conti rifatti in Python: esempio 1,
$6{,}64 \cdot 10^{-27}/9{,}11 \cdot 10^{-31} = 7289$; esempio 2,
$1{,}4 \cdot 10^{-10}/7{,}0 \cdot 10^{-15} = 2{,}0 \cdot 10^4$ e $2{,}0 \cdot 10^4\,\text{cm} = 200\,\text{m}$; esempio 3, $(1/2{,}0 \cdot 10^4)^3 = 1{,}25 \cdot 10^{-13}$. Raggio
del nucleo d'oro stimato con $1{,}2\,\text{fm} \cdot 197^{1/3} = 7{,}0\,\text{fm}$; raggio atomico dell'oro circa
$144\,\text{pm}$ (da verificare). `check.mts` passa (avvisi sui titoli con i nomi propri: sono giusti).

## Struttura

Il modello a panettone (figura dei due modelli affiancati); l'esperimento di Geiger e Marsden con la figura
dell'apparato, la previsione di Thomson, le tre osservazioni, la frase di Rutherford, l'esempio 1 sul perché gli
elettroni non contano; il modello nucleare con le tre spiegazioni in passi numerati, il modello planetario, la figura
interattiva; le dimensioni del nucleo con gli esempi 2 e 3 e due avvisi; i limiti del modello e il rimando a Bohr.

## Scelte e fonti

- Geiger e Marsden, 1909 (H. Geiger, E. Marsden, "On a diffuse reflection of the α-particles", Proc. R. Soc. A 82,
  1909): la stima di una particella su ottomila rimandata indietro è per una lamina di platino, e la lezione lo dice.
  Rutherford, "The scattering of α and β particles by matter and the structure of the atom", Philosophical Magazine,
  1911. Da verificare i titoli e il numero.
- La frase del proiettile è da una conferenza di Rutherford del 1936, pubblicata nel 1938 ("The development of the
  theory of atomic structure", in "Background to modern science"): tradotta liberamente, da verificare.
- Lamina "spessa meno di un millesimo di millimetro": nel lavoro del 1911 si parla di circa $4 \cdot 10^{-5}\,\text{cm}$
  (da verificare).
- Particelle alfa "a circa ventimila chilometri al secondo": le alfa del radio C vanno a circa $1{,}9 \cdot 10^7\,\text{m/s}$
  (da verificare).
- Nel modello di Rutherford gli elettroni sono disegnati su orbite ellittiche, come lo disegnano i libri; nessun
  livello di energia (terzo anno).

## Figure

Due TikZ, guardate in chiaro e in scuro: `thomson-rutherford-due-modelli` e `thomson-rutherford-apparato`.
Interattiva `rutherford-lamina-oro` (`chimica/RutherfordLamina.tsx`): tre atomi della lamina; si sceglie il modello e
si sparano $50$ particelle alfa a caso, oppure una mirata a una distanza scelta dal nucleo centrale. Con Rutherford ogni
particella segue l'orbita coulombiana del nucleo più vicino, scritta in forma chiusa: con il nucleo nell'origine,
$1/r = \sin\varphi/b - (d/2b^2)(1 + \cos\varphi)$, con $d$ la distanza di massimo avvicinamento in un urto centrale;
esce con l'angolo $\theta$ dato da $\tan(\theta/2) = d/(2b)$, e lungo la traiettoria rallenta come
$v_0\sqrt{1 - d/r}$ (conservazione dell'energia). Con Thomson passano tutte dritte. Sotto si contano le particelle
dritte, deviate di più di $10^\circ$ e tornate indietro. Nuclei e deviazioni sono molto esagerati (in figura circa una
particella su quattro è deviata di più di $10^\circ$ e una su cinquanta torna indietro), e la didascalia lo dice.
Guardata in chiaro, in scuro, sul telefono, dopo una raffica e dopo un colpo mirato: nessun errore in console, nessuno
scorrimento laterale.

## Esercizi

Generatore `chim-thomson-rutherford`, cinque livelli (specifica in `specs/exercises/chim-thomson-rutherford.md`), senza
scene.

## Domande per Andrea

- "Modello a panettone" o "a panino con l'uvetta"? I libri italiani usano tutti e due: la lezione dice panettone.
- Il modello di Rutherford va disegnato con le orbite ellittiche (come ora), o con una nuvola di elettroni senza
  orbite, per non preparare un'immagine che al terzo anno va smontata?
- La figura interattiva esagera molto le deviazioni: va bene così, con la didascalia, o si preferisce una versione "in
  scala" in cui quasi non si vede niente?
- I limiti del modello (l'elettrone che cade sul nucleo) sono da biennio, o si lasciano al terzo anno con Bohr?
