# Note: Miscele di gas e pressioni parziali

Lezione nuova (biennio di chimica, secondo anno, gruppo 27, 30 settembre 2026). Conti rifatti in Python: esempio 1,
$0{,}400 \cdot 0{,}0821 \cdot 300/10{,}0 = 0{,}9852$, $0{,}100 \cdot \ldots = 0{,}2463$, totale $1{,}2315$ (lo stesso con
$0{,}500\,\text{mol}$); esempio 2, $0{,}21 \cdot 0{,}70 = 0{,}147$; esempio 3, $8{,}00/16{,}05 = 0{,}49844$,
$n_{tot} = 1{,}49844$, $x = 0{,}33264$, $p = 0{,}49896$ e $1{,}00104\,\text{atm}$, frazione in massa $0{,}20$ e
$0{,}20 \cdot 1{,}50 = 0{,}30$; esempio 4, $755 - 23{,}8 = 731{,}2$, $731{,}2/760 = 0{,}96211$,
$n = 0{,}96211 \cdot 0{,}250/(0{,}0821 \cdot 298) = 9{,}831 \cdot 10^{-3}$. `check.mts` passa.

## Struttura

La pressione parziale (con il perché: ogni gas occupa tutto il recipiente) e la sua formula con l'equazione di stato;
la legge di Dalton con la figura dei tre recipienti e la dimostrazione in una riga; l'esempio 1; la figura interattiva;
l'avviso sul volume; la frazione molare e $p_1 = x_1 p_{tot}$; la composizione dell'aria in una tabella; gli esempi 2
(montagna) e 3 (miscela in grammi) con l'avviso sulla frazione in massa; il gas raccolto sopra l'acqua con l'esempio 4.

## Scelte e fonti

- Legge di Dalton del 1801: la data è quella dei libri (Dalton presentò il lavoro alla Manchester Literary and
  Philosophical Society nel 1801, pubblicato nel 1802; da verificare quale anno citare).
- Composizione dell'aria secca in volume: $78{,}08\%$ azoto, $20{,}95\%$ ossigeno, $0{,}93\%$ argon (NASA, "Earth Fact
  Sheet", valori da verificare sulla pagina); anidride carbonica $0{,}04\%$, circa $420\,\text{ppm}$ nel 2024 (NOAA,
  da verificare). L'argon non è nella tavola della lezione 01, ma la lezione non ne calcola la massa molare.
- Pressione a $3000\,\text{m}$ circa $0{,}70\,\text{atm}$: atmosfera standard internazionale ($70{,}1\,\text{kPa}$ a
  $3000\,\text{m}$, da verificare).
- Tensione di vapore dell'acqua a $25\,^\circ\text{C}$: $23{,}8\,\text{mmHg}$ ($3{,}17\,\text{kPa}$), dalla tabella del
  CRC Handbook come la riportano i libri, da verificare. Gli esercizi usano la stessa tabella da 18 a 30 °C.
- Simbolo della pressione totale $p_{tot}$, come $F_{tot}$ della fisica.

## Figure

- TikZ `pressioni-parziali-dalton-tre-recipienti`: solo azoto ($0{,}6\,\text{atm}$), solo ossigeno
  ($0{,}2\,\text{atm}$), la miscela ($0{,}8\,\text{atm}$). Guardata in chiaro e in scuro: nel tema scuro le molecole blu
  diventano azzurro chiaro, come tutti i colori scuri dei TikZ.
- Interattiva `miscela-gas-dalton` (`interactive/chimica/MiscelaGasDalton.tsx`): recipiente di $22{,}4\,\text{L}$ con
  azoto, ossigeno e anidride carbonica (da 0 a 1 mol ciascuno, venti puntini per mole) e la temperatura (0-100 °C); i
  puntini vanno dritti e rimbalzano sulle pareti, con velocità proporzionale a $\sqrt{T/M}$ (un passo scritto a mano, i
  puntini non si urtano tra loro, come in un gas ideale); le barre delle tre pressioni parziali e quella della totale
  fatta dei tre pezzi; «Guarda un gas» mette in evidenza un gas alla volta. A $0\,^\circ\text{C}$ ogni pressione in
  atmosfere vale quanto le moli. Guardata in chiaro, in scuro, sul telefono e con un gas selezionato, senza errori in
  console. Con il movimento ridotto i puntini stanno fermi.

## Esercizi

Generatore `chim-pressioni-parziali`, cinque livelli (specifica in `specs/exercises/chim-pressioni-parziali.md`), senza
scene.

## Domande per Andrea

- La frazione molare è introdotta qui, al secondo anno; il programma la ha anche nella lezione "Molalità e frazione
  molare" del quarto anno. Va bene anticiparla, o qui si usa solo "la parte delle moli" senza nome?
- Il gas raccolto sopra l'acqua è nel programma del biennio, o è da togliere (e con lui il livello 5 degli esercizi)?
- Tensione di vapore dell'acqua: quale tabella usano i libri (valori in mmHg o in kPa)?
- La composizione dell'aria con quattro gas va bene, o basta dire "78% azoto, 21% ossigeno"?
