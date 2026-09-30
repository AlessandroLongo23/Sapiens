# Note: Errori di misura e cifre significative

Lezione nuova (biennio di chimica, gruppo 21 "misure", 30 settembre 2026). La fisica divide l'argomento in quattro
lezioni (05 errori, 06 valore medio, 07 incertezza relativa e propagazione, 08 cifre significative); qui è una lezione
sola, con le stesse regole del README di fisica e gli esempi del laboratorio di chimica (titolazioni, buretta, pesate per
differenza, pipetta contro cilindro, densità, moli). Conti rifatti in Python: media del gruppo C $788{,}6$ (in millesimi di
$\text{g/mL}$); esempio 1, somma $93{,}5$, media $18{,}70$, semidispersione $0{,}2$; esempio 2, $0{,}2\%$ e $10\%$; esempio 3,
$18{,}6 \pm 0{,}2$; esempio 4, $\varepsilon_m = 0{,}10\%$, $\varepsilon_V = 2{,}0\%$, $d = 0{,}7892$, $\Delta d = 0{,}0166$,
con la pipetta $0{,}22\%$; esempio 5, $M = 18{,}02$, $4{,}50/18{,}02 = 0{,}24972$; somma $48{,}62 + 5{,}3 = 53{,}92$; tabella di
arrotondamento. `check.mts` passa.

## Struttura

Da dove vengono le incertezze (strumento, chi misura, ambiente), errori sistematici con tre esempi di laboratorio, errori
casuali e sbagli, precisione e accuratezza con la figura dei tre gruppi; sensibilità e portata con la tabella degli
strumenti, incertezza di una misura singola, tolleranza della vetreria tarata, riquadro sulla lettura della buretta;
valore medio e semidispersione con le regole di scrittura del risultato (esempio 1, avviso); incertezza relativa (esempio
2); le incertezze nei calcoli (esempi 3 e 4, compatibilità con un valore di tabella); le cifre significative (cinque
regole, tabella, avviso sullo zero finale), arrotondare (tabella, avviso sul troncamento), le cifre nei calcoli (somme,
prodotti, numeri esatti, esempio 5, avviso sulla calcolatrice).

## Scelte

- Tutte le regole sono quelle del README di fisica ("Incertezze e cifre significative"): semidispersione, sensibilità
  intera per la misura singola, incertezza a una cifra, caso peggiore nella propagazione.
- La buretta con la sensibilità di $0{,}1\,\text{mL}$ e le letture a un decimale, con un riquadro che dice che molti
  laboratori stimano i centesimi (domanda per Andrea).
- La tolleranza della pipetta da $10\,\text{mL}$, $0{,}02\,\text{mL}$, e della pipetta da $25\,\text{mL}$,
  $0{,}03\,\text{mL}$: classe A secondo ISO 648, da verificare. Portate e sensibilità della tabella degli strumenti sono
  valori tipici, da verificare su qualche catalogo.
- L'esempio 4 riprende l'esempio 1 della lezione 11 e mostra che le cifre significative ($0{,}789$) promettono più
  dell'incertezza vera ($0{,}79 \pm 0{,}02$), come fa la fisica 08 con la velocità.
- Le masse molari dell'esempio 5 dalla tavola della lezione 01.

## Figure

Una TikZ, guardata in chiaro e in scuro: `precisione-accuratezza-densita` (tre righe di cinque misure della densità
dell'etanolo, con il valore vero). Nessuna interattiva: la fisica ha già `misure-ripetute-istogramma` e il bersaglio
degli errori; il menisco, che sarebbe l'esempio di errore sistematico, ha la sua interattiva nella lezione 11 ed è
linkato.

## Esercizi

Generatore `chim-errori-cifre-significative`, sei livelli (specifica in
`specs/exercises/chim-errori-cifre-significative.md`): Contare le cifre, Arrotondare, Valore medio e incertezza, Somme e
differenze, Prodotti e quozienti, L'incertezza relativa. Senza scene.

## Domande per Andrea

- La buretta: lettura con un decimale e incertezza $0{,}1\,\text{mL}$ (come qui) o con due decimali e incertezza
  $0{,}05$ o $0{,}02\,\text{mL}$?
- Una lezione sola per errori, incertezze e cifre significative va bene per la chimica, o conviene dividerla in due
  (errori e incertezze; cifre significative) come fanno alcuni libri?
- La propagazione delle incertezze (esempi 3 e 4) è nel programma di chimica del primo anno, o basta la regola delle
  cifre significative?
- L'incertezza percentuale si scrive con due cifre significative negli esercizi ($2{,}2\%$): va bene?
