# Note: Massa, volume e densità

Lezione nuova (biennio di chimica, gruppo 21 "misure", 30 settembre 2026). In fisica la densità è nella lezione 03
(`fis-grandezze-derivate`) e la lettura del cilindro nella 04 (`fis-strumenti-misura`): qui con la bilancia tecnica e
analitica, la pesata per differenza, la vetreria graduata e tarata, il menisco nella buretta, le densità dei liquidi e
delle soluzioni. Conti rifatti in Python: esempio 1, $68{,}35 - 48{,}62 = 19{,}73$, $19{,}73/25{,}0 = 0{,}7892$, rovesciato
$1{,}267$; esempio 2, $19{,}5 - 12{,}0 = 7{,}5$, $20{,}3/7{,}5 = 2{,}707$, con $V_2$ al posto di $V$ $1{,}041$; esempio 3,
$1{,}84 \cdot 25{,}0 = 46{,}0$; esempio 4, $10{,}0/0{,}789 = 12{,}67$, e $789 \cdot 12{,}7 = 10\,020{,}3$ dell'avviso; esempio 5,
$13{,}6\,\text{g/mL} = 13\,600\,\text{kg/m}^3$. `check.mts` passa.

## Struttura

La massa e la bilancia (tecnica e analitica, tara, pesata per differenza, avviso sul recipiente, riquadro massa e peso),
il volume e la vetreria (figura dei sei recipienti, tabella graduata e tarata con la precisione tipica, la buretta con lo
zero in alto, la propipetta, avviso sul becher), la lettura del menisco (figura statica del cilindro e della buretta,
interattiva, avviso sulle due letture della buretta), il volume di un solido (formula e immersione), la densità (unità,
tabella di sedici sostanze, esempi 1-2 con i due avvisi), massa e volume dalla densità (esempi 3-5, avviso sulle unità),
da che cosa dipende la densità (temperatura, soluzioni, strati, figura della colonna di liquidi).

## Scelte

- Densità con $d$, come il README del biennio e la lezione di fisica 03 (la fisica 08 usa $\rho$ in un esempio:
  segnalato a chi rivede la fisica).
- Le letture della buretta con un decimale, come la regola del README di fisica (incertezza uguale alla sensibilità
  intera): molti laboratori le scrivono con due decimali stimando la seconda. La lezione 13 lo dice in un riquadro.
- Gli esempi 1, 2 e 4 arrotondano con le cifre significative della lezione 13, che viene dopo nel capitolo: lo dicono e
  rimandano lì, come la fisica fa nel primo capitolo.
- Valori della tabella: aria, olio, ghiaccio, acqua, alluminio, ferro, rame, piombo, mercurio, oro dalla tabella della
  lezione di fisica 03 (in $\text{kg/m}^3$ lì); acqua $0{,}998$ a $20\,^\circ\text{C}$, etanolo $0{,}789$, acetone
  $0{,}79$, glicerina $1{,}26$, acido solforico concentrato $1{,}84$, cloruro di sodio solido $2{,}16$, acqua di mare
  circa $1{,}03$: valori comuni dei manuali, da verificare su una fonte citabile (per esempio il CRC Handbook of
  Chemistry and Physics). L'acetone a $20\,^\circ\text{C}$ dovrebbe essere $0{,}791$ (da verificare).
- Precisione tipica della vetreria (pipetta da $10\,\text{mL}$ entro $0{,}02\,\text{mL}$, matraccio da $250\,\text{mL}$
  entro $0{,}2\,\text{mL}$): sono le tolleranze della classe A secondo le norme ISO 648 e ISO 1042, da verificare.
- La densità del ghiaccio in tabella è a $0\,^\circ\text{C}$; l'esempio del ghiaccio che affonda nell'etanolo è una
  dimostrazione classica.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `vetreria-volumi` (becher, beuta, cilindro, buretta, pipetta tarata, matraccio),
`menisco-buretta-cilindro` (lo stesso menisco su una scala che cresce verso l'alto e su una che cresce verso il basso) e
`colonna-densita-liquidi` (olio, acqua, mercurio e un granulo di ferro sul mercurio). Interattiva `lettura-menisco`
(`interactive/chimica/LetturaMenisco.tsx`): cilindro o buretta, l'occhio si sposta con il cursore o trascinandolo, la
linea di vista incontra la scala e la lettura si confronta con quella vera. Guardata in chiaro, in scuro, sul telefono e
dopo il clic su "Buretta"; nessun errore in console, niente scorrimento laterale. Usa `Liquid` e `Vessel` di
`interactive/fisica/liquidi.tsx`.

## Esercizi

Generatore `chim-massa-volume-densita`, sei livelli (specifica in `specs/exercises/chim-massa-volume-densita.md`): La
densità, Massa o volume, Unità diverse, La pesata per differenza, Il volume per immersione, Galleggia o affonda. Senza
scene: i dati sono nel testo. Una scena con due letture del cilindro (prima e dopo l'immersione) si potrebbe fare con
`cilindro-graduato` della fisica, ma quella scena ha un solo livello e divisioni intere.

## Domande per Andrea

- Le letture della buretta si scrivono con un decimale (sensibilità intera, come in fisica) o con due (stimando tra le
  tacche, come in molti laboratori)?
- La tabella delle densità va bene così, o servono altre sostanze del laboratorio (cloroformio, soluzioni saline a varie
  concentrazioni)?
- La bilancia analitica e la vetreria tarata sono nel programma del primo anno, o si possono togliere?
- L'unità $\text{g/cm}^3$ per i solidi e $\text{g/mL}$ per i liquidi (come qui), o una sola per tutti?
