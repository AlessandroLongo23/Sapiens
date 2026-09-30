# Note: I raggi di luce e la propagazione rettilinea

Lezione nuova, secondo lotto di fisica, gruppo 10, 30 settembre 2026. Numeri degli esempi rifatti in Python
(frazioni esatte e arrotondamenti), coordinate delle figure calcolate in Python (tangenti comuni per l'eclissi,
triangoli simili per ombra e camera oscura); `check.mts` passa su lezione, formulario e flashcard senza errori né
avvisi.

## Struttura ed esempi

Sorgenti e corpi illuminati (puntiformi ed estese); trasparenti, traslucidi, opachi; raggio come modello e fasci
(parallelo, divergente, convergente); propagazione rettilinea con i tre cartoncini forati; ombra con sorgente
puntiforme e proporzione $H/h = D/d$ dai triangoli simili (link a "Similitudine"); ombra e penombra con sorgente
estesa; eclissi di Sole e di Luna; camera oscura con $h'/h = d'/d$; velocità della luce, $t = d/c$, anno luce.

Esempi: ombra di un cartoncino ($5{,}0\,\text{cm}$, $40$ e $120\,\text{cm}$: $15\,\text{cm}$); dove mettere il
cartoncino ($30\,\text{cm}$); albero nella camera oscura ($8{,}0\,\text{cm}$); Luna ($1{,}28\,\text{s}$); Sole
($5{,}00 \cdot 10^2\,\text{s}$, 8 minuti e 20 secondi); Proxima Centauri ($4{,}0 \cdot 10^{16}\,\text{m}$).

Avvisi accanto alla regola: l'ombra non è grande quanto l'oggetto; le potenze di 10 nella divisione (e i
chilometri non convertiti); l'anno luce non è un tempo.

## Scelte

- Velocità della luce e anno luce stanno qui: `programma.md` non dice in quale lezione dell'Amaldi (capitolo 13, "La
  luce") compaiano; da verificare sul libro.
- $c = 3{,}00 \cdot 10^8\,\text{m/s}$ con tre cifre. L'anno luce calcolato con questo valore viene $9{,}47 \cdot
  10^{15}\,\text{m}$; la lezione lo dice e spiega che le tabelle danno $9{,}46 \cdot 10^{15}\,\text{m}$ (con $c$
  preciso). Formulario, flashcard ed esercizi usano $9{,}46 \cdot 10^{15}\,\text{m}$, scritto nel testo.
- Le tappe storiche (Galileo, Rømer 1676, Fizeau 1849, definizione del 1983) sono in un riquadro `ad-note`.
- Nella camera oscura la parete di fondo è detta "schermo traslucido, per esempio di carta da forno", come nelle
  versioni da laboratorio.

## Figure

Statiche (chiaro e scuro): `fasci-di-luce`, `ombra-sorgente-puntiforme` (scala 1:20, ostacolo e ombra nel rapporto
$1:3$), `ombra-e-penombra` (lampada lunga come segmento: i bordi della sorgente sono punti esatti, e i quattro raggi
passano davvero per i bordi del cartoncino), `eclissi-di-sole` (non in scala, tangenti comuni esterne e interne
calcolate), `camera-oscura` (rapporto $d'/d = 2/3$, i due raggi passano per il foro). Il raggio usa lo stile
`raggio` definito con `\tikzset` dentro la figura, con la stessa resa del README.

Interattiva: `ombra-penombra-sorgente` (`OmbraPenombra.tsx`): si trascina il cartoncino lungo l'asse e un cursore
cambia l'altezza della sorgente da $0$ (puntiforme) a $1\,\text{cm}$; ombra grigio scuro, penombra grigio chiaro,
larghezze lette sotto. Guardata in chiaro, in scuro, sul telefono, con la sorgente puntiforme e con quella più
grande, con il cartoncino vicino e lontano.

## Esercizi

Generatore `ottica-geometrica`, sei livelli: il tempo della luce; chilometri e minuti; l'anno luce; l'ombra di un
cartoncino; la camera oscura; l'ombra al contrario. Scene `raggi-specchi` ai livelli 4-6.

## Domande per Andrea

- La velocità della luce e l'anno luce vanno in questa lezione, come qui, o l'Amaldi li mette altrove?
- $c = 3{,}00 \cdot 10^8\,\text{m/s}$ (tre cifre) o $3 \cdot 10^8\,\text{m/s}$? E l'anno luce: $9{,}46$ o $9{,}47 \cdot
  10^{15}\,\text{m}$?
- "Traslucido" è il termine dell'Amaldi, o "semitrasparente"?
- Ombra e penombra: si chiede anche il calcolo delle larghezze con la sorgente estesa, o basta la parte qualitativa?
- Le eclissi: basta lo schema qualitativo, o servono i numeri (diametri e distanze di Sole e Luna)?

## Verifiche

- `check.mts`: nessun errore e nessun avviso su lezione, formulario e 18 carte.
- Generatore: seed 1, 50001 e 777001, 6000 esercizi ciascuno, `verify.py` PASS; errori piantati bocciati (opzione
  giusta spostata, opzioni doppie, risposta cambiata: tutti; scena spostata: 3000 su 3000). Un dato del testo cambiato
  di poco passa in circa un caso su cento, quando il risultato arrotondato non cambia (71 o 74 minuti danno tutti e due
  $1{,}3 \cdot 10^{12}\,\text{m}$). `review.mts` e `width.mts` codice 0.
