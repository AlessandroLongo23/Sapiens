# Note: L'occhio e gli strumenti ottici

Lezione nuova, secondo lotto di fisica, gruppo 11, 30 settembre 2026. Numeri rifatti in Python; `check.mts` passa sui tre
file.

## Struttura ed esempi

L'occhio (cornea, pupilla, cristallino, retina), accomodamento, punto remoto e prossimo; miopia e ipermetropia con le
lenti che le correggono, presbiopia; lente d'ingrandimento; macchina fotografica; microscopio; cannocchiale con la sua
storia. Esempi: potere dell'occhio nel modello ($59\,\text{D}$ e $63\,\text{D}$); occhiali del miope ($-0{,}50\,\text{D}$);
dell'ipermetrope ($+2{,}0\,\text{D}$); lente da $5{,}0\,\text{cm}$ ($p \approx 4{,}2\,\text{cm}$, $G = 6{,}0$); obiettivo
da $50\,\text{mm}$ e persona a $2{,}0\,\text{m}$ ($q \approx 51\,\text{mm}$); cannocchiale da 60 ingrandimenti. Avvisi:
miope con le lenti convergenti, il rapporto rovesciato del cannocchiale.

## Scelte

- Modello semplificato dell'occhio: una lente in aria a $1{,}7\,\text{cm}$ dalla retina, che dà un potere di circa
  $59\,\text{D}$, vicino ai $60\,\text{D}$ dei libri. L'occhio vero ha l'immagine in un liquido ($n \approx 1{,}34$) e la
  retina a circa $2{,}4\,\text{cm}$: la lezione non entra nel dettaglio. Da verificare con il libro di classe.
- Occhiali a contatto con l'occhio (distanza trascurata), detto nel testo.
- Lente d'ingrandimento con l'immagine a $25\,\text{cm}$ e $G = -q/p$ (per $f = 5\,\text{cm}$, $G = 6 = 1 + 25/f$). Molti
  libri danno l'ingrandimento angolare $25\,\text{cm}/f$ con l'immagine all'infinito: la lezione non lo usa.
- Microscopio e cannocchiale a livello qualitativo, con le due formule dell'ingrandimento senza dimostrazione.

## Dati e fonti

- Punto prossimo $25\,\text{cm}$ per convenzione (distanza della visione distinta).
- Potere dell'occhio di circa $60\,\text{D}$: valore dei manuali, a memoria, da verificare.
- Galileo 1609, Keplero *Dioptrice* 1611: date a memoria, da verificare.

## Figure

Statiche: `occhio-schema-raggi`, `miopia-correzione` e `ipermetropia-correzione` (due pannelli ciascuna, geometria
coerente: occhio miope con fuoco a $1{,}35$ cm dalla lente e lente divergente con $f = -4{,}15$ cm a $0{,}85$ cm
davanti; occhio ipermetrope con fuoco a $2{,}35$ cm), `cannocchiale-kepleriano` ($f_{ob} = 3$, $f_{oc} = 1$, raggi da una
stella a $8^\circ$, che escono a $22{,}9^\circ$). Nessuna interattiva: le figure di valore alto di questo gruppo sono
nelle lezioni 34-36; una possibile è l'occhio con l'accomodamento e le lenti correttive.

## Esercizi

Generatore `fis-strumenti-ottici`, sei livelli: cannocchiale e microscopio; miopia; ipermetropia; macchina fotografica;
lente d'ingrandimento; potere dell'occhio. Scena `lente-oggetto` solo nella soluzione del livello 5.

## Domande per Andrea

- Il modello dell'occhio con la lente a $1{,}7\,\text{cm}$ dalla retina: va bene, o meglio il solo dato "circa $60\,\text{D}$"?
- Ingrandimento della lente: $G = -q/p$ con l'immagine a $25\,\text{cm}$ (qui) o l'ingrandimento angolare $25/f$?
- Microscopio e cannocchiale: bastano le formule dell'ingrandimento, o servono le costruzioni?
- Presbiopia e astigmatismo: l'astigmatismo non c'è; va aggiunto?
