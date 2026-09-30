# Note: La dilatazione termica

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 19, 30 settembre 2026). Conti rifatti in Python: sbarra
d'alluminio $2{,}3 \cdot 10^{-5} \cdot 1 \cdot 100 = 2{,}3$ mm; esempio 1 $1{,}2 \cdot 10^{-5} \cdot 18 \cdot 40 = 8{,}64$ mm (e
con $50$: $10{,}8$ mm, "un quarto in più"); esempio 2 $1{,}2 \cdot 10^{-5} \cdot 300 \cdot 60 = 0{,}216$ m; esempio 3
$3{,}45 \cdot 10^{-3}/(1{,}50 \cdot 100) = 2{,}30 \cdot 10^{-5}$; esempio 4 $1{,}8 \cdot 10^{-4} \cdot 0{,}500 \cdot 10 =
9{,}0 \cdot 10^{-4}$ cm$^3$ $= 0{,}90$ mm$^3$, $0{,}90/0{,}010 = 90$ mm; esempio 5 $3{,}6 \cdot 10^{-5} \cdot 50 \cdot 200 =
0{,}36$ cm$^3$ (con $\lambda$: $0{,}12$); ghiaccio $1000/917 = 1{,}0905$; volume di un chilogrammo d'acqua $10^6/\rho$:
$1000{,}16$, $1000{,}03$, $1000{,}30$ cm$^3$ a $0$, $4$, $10\,^\circ\text{C}$ (differenze di $2{,}7 \cdot 10^{-4}$, "meno di tre
decimillesimi"). `check.mts` passa senza avvisi.

## Fonti dei dati

- Coefficienti di dilatazione lineare e volumica: Wikipedia (inglese), "Thermal expansion", tabella dei coefficienti a
  $20\,^\circ\text{C}$, letta il 30 settembre 2026 (alluminio $23{,}1$, ottone $19$, rame $17$, oro $14$, ferro $11{,}8$,
  acciaio $11$-$13$, calcestruzzo $12$, vetro $8{,}5$, borosilicato $3{,}3$, invar $1{,}2 \cdot 10^{-6}\,\text{K}^{-1}$; volumici
  acqua $207$, mercurio $181$, etanolo $750 \cdot 10^{-6}\,\text{K}^{-1}$). Arrotondati a due cifre nella tabella della lezione.
- Alcol etilico: $7{,}5 \cdot 10^{-4}$ da quella tabella; altre tabelle danno $1{,}1 \cdot 10^{-3}$. Da verificare, e la lezione
  lo dice.
- Densità dell'acqua: Wikipedia, "Water (data page)", letta il 30 settembre 2026 ($0{,}9998395$, $0{,}9999720$,
  $0{,}9997026$ g/cm$^3$ a $0$, $4$, $10\,^\circ\text{C}$; massimo a $3{,}984\,^\circ\text{C}$). La curva del grafico è la formula di
  Tanaka e altri (Metrologia 38, 2001) per l'acqua senza aria, che differisce dai tre punti di meno di $3 \cdot 10^{-5}$
  g/cm$^3$ (sul disegno, al più $0{,}03$ cm); la formula è a memoria, da verificare, ma i tre punti sono quelli della fonte.
- Ghiaccio $917\,\text{kg/m}^3$: la tabella della lezione 03.

## Scelte

- Simboli: $\lambda$ per il coefficiente lineare e $\alpha$ per il volumico, come dice il README ("come l'Amaldi, da
  verificare"). Molti libri (e Wikipedia) usano $\alpha$ per il lineare e $\beta$ o $\gamma$ per il volumico: se l'Amaldi fa
  così, va cambiato nella lezione, nel formulario, nelle flashcard, nella figura interattiva e nel generatore.
- La dilatazione superficiale in un `ad-note` con $\Delta S \approx 2\lambda S_0 \Delta t$, perché non so se l'Amaldi del
  biennio la tratta (da verificare); l'esempio del coperchio che si allenta chiude il cerchio con l'apertura.
- $\alpha \approx 3\lambda$ detto senza dimostrazione.
- La lamina bimetallica in una sezione breve con una figura (termostati): non era nella richiesta, ma è l'applicazione più
  comune della dilatazione di due metalli diversi.
- La dilatazione "apparente" dei liquidi (il recipiente che si dilata) solo in un `ad-note`; negli esercizi si trascura e
  il testo lo dice.
- Rotaie: "si lasciava" un giunto (le linee moderne hanno le rotaie saldate, non lo dico nel dettaglio).

## Figure

Tre TikZ, guardate in chiaro e in scuro. `sbarra-allungamento-ingrandito`: due sbarre di $5$ cm, la calda più lunga di
$0{,}575$ cm (l'allungamento esagerato, lo dice il testo). `lamina-bimetallica`: dritta e piegata (archi di raggio $8{,}6$ cm,
$20^\circ$), l'ottone all'esterno. `acqua-volume-temperatura`: $0{,}4$ cm per grado, $8$ cm per cm$^3$ sopra $1000$, l'asse
verticale che parte da $1000$ (lo dice l'alt); i tre punti della fonte sulle coordinate dei dati (a $1{,}284$, $0{,}224$,
$2{,}380$ cm). Ha la riga `% poi-interattivo`.

Interattiva `dilatazione-sbarra` (`fisica/DilatazioneSbarra.tsx`): sbarra di $1{,}000$ m a $20\,^\circ\text{C}$ disegnata a
$5$ cm per metro contro una parete, cinque materiali (alluminio, rame, acciaio, pyrex, invar), temperatura da $20$ a
$220\,^\circ\text{C}$ a passi di $5$; l'allungamento è disegnato $60$ volte più grande della sbarra, con un righello in
millimetri alla stessa scala sotto l'estremo libero ($0{,}3$ cm per millimetro, fino a $5$ mm: il massimo è $4{,}6$ mm
dell'alluminio a $220\,^\circ\text{C}$), la quota $\Delta l$ e la scritta "allungamento ingrandito 60 volte". Il colore della
sbarra passa da `blue!10` ad arancione. Guardata in chiaro, in scuro, al telefono e a $220\,^\circ\text{C}$.

## Esercizi

Generatore `fis-dilatazione-termica`, cinque livelli (specifica in `specs/exercises/fis-dilatazione-termica.md`):
l'allungamento, la temperatura finale, il coefficiente di dilatazione, un liquido che trabocca, il volume di un solido.
Nessuna scena.

## Domande per Andrea

- Simboli: $\lambda$ e $\alpha$ come qui, o $\alpha$ e $\beta$ (o $\gamma$)? È la domanda che decide più file.
- La dilatazione superficiale è nel programma del secondo anno, o si toglie anche dal riquadro?
- I valori della tabella ($2{,}3$, $1{,}9$, $1{,}7$, $1{,}2 \cdot 10^{-5}$, vetro $8{,}5 \cdot 10^{-6}$): coincidono con quelli
  dell'Amaldi? Il ferro nel libro è $1{,}2$ come l'acciaio?
- La lamina bimetallica: resta, o è fuori programma?
- Il comportamento anomalo dell'acqua: il grafico del volume tra $0$ e $12\,^\circ\text{C}$ con l'asse che non parte da zero
  va bene per il secondo anno, o meglio la densità?
