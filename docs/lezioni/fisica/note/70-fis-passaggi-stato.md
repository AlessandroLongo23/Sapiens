# Note: I passaggi di stato e il calore latente

Lezione nuova (terzo lotto di fisica, il secondo anno, gruppo 20, 30 settembre 2026). Conti rifatti in Python: esempio
1, $3{,}34 \cdot 10^5 \cdot 0{,}50 = 1{,}67 \cdot 10^5\,\text{J}$; esempio 2, $4{,}52 \cdot 10^5\,\text{J}$ e
$8{,}372 \cdot 10^4\,\text{J}$, rapporto $5{,}4$; $L_v/L_f = 6{,}77$; esempio 3, $9450 + 100\,200 + 31\,395 = 141\,045\,\text{J}$,
la fusione è il $71\%$; esempio 4, $22\,600 + 2637 = 25\,237\,\text{J}$, $9{,}6$ volte l'acqua bollente; esempio 5,
$13\,360\,\text{J}$ contro $20\,930\,\text{J}$, $t_e = 6{,}236\,^\circ\text{C}$; grafico e figura interattiva, per
$0{,}50\,\text{kg}$: $42$, $167$, $209{,}3$, $1130$, $40\,\text{kJ}$, angoli a $42$, $209$, $418{,}3$, $1548{,}3$,
$1588{,}3\,\text{kJ}$ (in centimetri, a $200\,\text{kJ}$ per centimetro e $0{,}018\,\text{cm}$ per grado, gli angoli del
TikZ); pendenze, acqua e ghiaccio $4186/2100 = 1{,}99$. `check.mts` passa.

## Struttura ed esempi

Gli stati della materia, i sei passaggi con lo schema (arancione quelli che assorbono calore, blu quelli che lo cedono),
la temperatura costante durante il passaggio con l'avviso sul fuoco alto, il calore latente con la tabella (acqua, alcol,
piombo) e gli esempi 1 e 2, l'avviso su $Q = L\,m$ solo alla temperatura del passaggio, il grafico temperatura-calore
(TikZ in scala e figura interattiva), gli esempi 3 (tre tappe) e 4 (il vapore che scotta), il ghiaccio nell'acqua con
l'esempio 5, evaporazione ed ebollizione (con la pressione, la montagna e la pentola a pressione) e il loro avviso,
condensazione e sublimazione.

## Scelte

- Nomi dei passaggi come l'Amaldi Fisica.verde (Zanichelli 2017, capitolo 13, diapositive lette il 30 settembre 2026):
  fusione, solidificazione, vaporizzazione (evaporazione ed ebollizione), condensazione, sublimazione; per il passaggio da
  aeriforme a solido l'Amaldi scrive "condensazione o brinamento": la lezione usa brinamento e dice che si chiama anche
  condensazione.
- Il grafico è temperatura-calore fornito, come chiesto, e non temperatura-tempo come l'Amaldi ("curva di
  riscaldamento" a ritmo costante): con una potenza costante sono la stessa curva.
- Il grafico parte da $-40\,^\circ\text{C}$ e arriva a $140\,^\circ\text{C}$ perché i tratti del ghiaccio e del vapore si
  vedano; è in scala, e il pianerottolo dell'ebollizione occupa quasi tre quarti dell'asse.
- Calore specifico del ghiaccio $2{,}1 \cdot 10^3$, arrotondato dal $2050$ della tabella della lezione 67 (Wikipedia,
  "Table of specific heat capacities", a $-10\,^\circ\text{C}$); del vapore $2{,}0 \cdot 10^3$ (la stessa tabella dà
  $2030$ a $100\,^\circ\text{C}$).
- Esempio 5, il ghiaccio che fonde tutto; il caso in cui non fonde tutto è detto in una frase, senza conti.

## Dati

Calori latenti e temperature da Wikipedia, "Latent heat", tabella dei calori latenti specifici, letta il 30 settembre
2026: acqua $334\,\text{kJ/kg}$ a $0\,^\circ\text{C}$ e $2264{,}7\,\text{kJ/kg}$ a $100\,^\circ\text{C}$ (scritto
$2{,}26 \cdot 10^6$, il valore arrotondato che usano i libri: da verificare con l'Amaldi), alcol etilico $108$ a
$-114\,^\circ\text{C}$ e $855$ a $78{,}3\,^\circ\text{C}$, piombo $23{,}0$ a $327{,}5\,^\circ\text{C}$ e $871$ a
$1750\,^\circ\text{C}$. Temperatura di ebollizione in cima al Monte Bianco "intorno a $85\,^\circ\text{C}$" e nella pentola a
pressione "intorno a $120\,^\circ\text{C}$" a "circa il doppio" della pressione atmosferica: da verificare, scritti con
"circa" e "intorno".

## Figure

Due TikZ, guardate in chiaro e in scuro: `passaggi-di-stato-schema` (i tre stati e le sei frecce; nel tema scuro il blu
diventa lilla chiaro, ancora distinto dall'arancione) e `grafico-temperatura-calore-acqua` (in scala, con la riga
`% poi-interattivo`). Interattiva `curva-riscaldamento-acqua` (`fisica/CurvaRiscaldamentoAcqua.tsx`): il becker con il
fornello accanto al grafico disegnato per la figura; un cursore o "Avvia" forniscono il calore, il punto corre sulla
curva e il becker mostra i cubetti (sei, poi meno, a galla quando c'è abbastanza acqua), l'acqua che sale mentre il
ghiaccio fonde, le bolle, il livello che cala mentre bolle, e alla fine i puntini del vapore; sotto il calore, la
temperatura e le masse di ghiaccio, acqua e vapore. Guardata in chiaro, in scuro, sul telefono, all'inizio, durante la
fusione e l'ebollizione.

## Esercizi

Generatore `fis-passaggi-stato`, sei livelli (specifica in `specs/exercises/fis-passaggi-stato.md`), scena
`curva-riscaldamento` (nuova, `scenes/CurvaRiscaldamento.tsx`) per il livello del grafico.

## Domande per Andrea

- $L_v = 2{,}26 \cdot 10^6\,\text{J/kg}$ e $L_f = 3{,}34 \cdot 10^5\,\text{J/kg}$ sono i valori dell'Amaldi del biennio? E i
  calori specifici del ghiaccio ($2{,}1 \cdot 10^3$) e del vapore ($2{,}0 \cdot 10^3$)?
- Brinamento o condensazione per il passaggio da aeriforme a solido? E "aeriforme" o "gassoso" come nome dello stato?
- Il grafico va dato in funzione del calore fornito (come qui) o del tempo, come la "curva di riscaldamento"
  dell'Amaldi?
- Il ghiaccio nell'acqua (esempio 5) è troppo per il secondo anno? Serve anche il caso in cui non fonde tutto?
- La spiegazione dell'ebollizione con la pressione del vapore nelle bolle va bene così, senza nominare la tensione di
  vapore?
