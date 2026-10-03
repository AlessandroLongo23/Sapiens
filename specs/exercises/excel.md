# Celle, valori e formule

Generatore: `excel` (`src/lib/exercises/v2/generators/excel.ts`; lo slug è storico, la lezione non parla di un
prodotto). Verifica indipendente: `scripts/exercises/checkers/excel.py`. Lezione collegata: "Celle, valori e formule"
(`docs/lezioni/informatica/riscritte/23-excel.md`). Macchinario comune alle tre lezioni sul foglio di calcolo:
`src/lib/exercises/v2/inf-foglio.ts` e, per i controlli, `scripts/exercises/checkers/_inf_foglio.py`.

Sei livelli nell'ordine della lezione. La risposta è un numero (`number`) dove si chiede un valore, una scelta
(`choice`) dove si chiede una cella o un errore; la scelta multipla ha sempre quattro opzioni.

## Nomi dei livelli

1. Celle e intervalli
2. Una formula con i riferimenti
3. Le precedenze
4. Parentesi e potenze
5. Il ricalcolo
6. Gli errori

## Come è scritto un esercizio

- Formule, indirizzi e nomi degli errori sono in testo a spaziatura fissa: nel testo `$\texttt{=A1+B2}$`, nelle opzioni
  `\texttt{=A1+B2}`. Dentro `\texttt` il dollaro è `\textdollar `, il cancelletto `\#`, l'accento circonflesso
  `\textasciicircum `: così nel testo non resta nessun `$` che la pagina possa scambiare per l'inizio di una formula.
- Le formule sono quelle delle lezioni: nomi delle funzioni in italiano, punto e virgola tra gli argomenti, virgola
  decimale (`=ARROTONDA(A1*1,22;2)`).
- Il foglio è una tabella (`array`) con le lettere delle colonne in alto e i numeri delle righe a sinistra; le celle
  con una formula la mostrano per esteso. Il testo sta in righe `\text{…}` di circa 46 caratteri.
- `params.sheet` porta il foglio (indirizzo → quello che è scritto nella cella), `params.formula` la formula,
  `params.options` e `params.correct` la scelta multipla dei livelli con risposta numerica. Il controllo Python
  rilegge foglio e formula dalla pagina e li confronta con `params`.

## Il foglio che i controlli calcolano

- Operatori `+ - * / ^`; prima le parentesi, poi le potenze, poi `*` e `/`, poi `+` e `-`; a pari livello da
  sinistra a destra. Il meno davanti a un numero non compare mai (i programmi non sono d'accordo su `=-2^2`).
- Una cella vuota in un calcolo vale 0. Un testo in un calcolo dà `#VALORE!`; una divisione per zero `#DIV/0!`; un
  nome che non è un riferimento né una funzione `#NOME?`; una formula che usa la propria cella è un riferimento
  circolare.

## Livello 1: celle e intervalli

Un intervallo con la prima cella nelle colonne da `A` a `F` e nelle righe da 1 a 12, largo da 1 a 4 colonne e alto da
1 a 6 righe, con almeno due celle. Due domande, metà e metà:

- "Quante celle contiene l'intervallo?": il numero di colonne per il numero di righe;
- "Quale di queste celle appartiene all'intervallo?": una cella dentro e tre fuori, vicine al bordo.

Esempi:

1. `B2:D5`: 3 colonne e 4 righe, 12 celle.
2. `E4:F7`: appartiene `F6`; non `E8`, `G8`, `D5`.

## Livello 2: una formula con i riferimenti

Un foglio 3 × 3 (`A1:C3`) di numeri interi da 1 a 12 e una formula con due celle diverse e una operazione tra `+`,
`-`, `*`, `/`, scritta in una cella della colonna `D`. Risultato con al più un decimale, tra −50 e 200 (vale anche
per i livelli 3 e 4, e per ogni risultato intermedio).

Esempi:

1. `=A1+C2` con `A1` = 5 e `C2` = 10: 15.
2. `=B3/A2` con `B3` = 9 e `A2` = 6: 1,5.

## Livello 3: le precedenze

Tre o quattro celle diverse, senza parentesi e senza potenze: `a+b*c`, `a-b*c`, `a+b/c`, `a-b/c`, `a*b-c*d`,
`a+b*c-d`, `a/b+c*d`, e, con operazioni dello stesso livello, `a-b+c`, `a-b-c`, `a/b*c`. Se la formula mescola i due
livelli, letta da sinistra a destra senza precedenze deve dare un altro valore; se le operazioni sono dello stesso
livello, deve dare un altro valore letta da destra a sinistra.

Esempi:

1. `=C2/C1+B2*B3` con 12, 1, 2, 3: `12 : 1 + 2 · 3 = 12 + 6 = 18`.
2. `=B3-C2-C3` con 4, 9, 6: `4 − 9 − 6 = −5 − 6 = −11` (non `4 − (9 − 6) = 1`).

## Livello 4: parentesi e potenze

Parentesi tonde o potenze con esponente 2 o 3: `(a+b)*c`, `a*(b-c)`, `(a+b)/c`, `(a-b)*(c+d)`, `a/(b+c)`,
`(a+b)/2`, `(a+b+c)/3`, `2*(a+b)`, `a^2+b`, `a^3-b`, `a*b^2`, `a-b^2`, `(a+b)^2`, `(a-b)^2`. Togliere le parentesi
deve cambiare il valore; leggere `^` come `*` anche.

Esempi:

1. `=(B1+A1)/2` con 1 e 12: `13 : 2 = 6,5`.
2. `=B1*A3^2` con 5 e 3: `5 · 9 = 45` (non `15² = 225`).

## Livello 5: il ricalcolo

Il foglio mostra le sue formule. Due forme, metà e metà:

- catena: `A1` e `B1` numeri, `C1` una formula su `A1` e `B1`, `D1` una formula su `C1`; cambia `A1` o `B1` e si
  chiede `D1`;
- totale: tre righe con `A`, `B` e `C = A * B` (o `A + B`), e in `C4` la somma `=C1+C2+C3`; cambia una cella di `A`
  o di `B` e si chiede `C4`.

Il numero nuovo è diverso dal vecchio e il valore chiesto cambia; risultato intero, in valore assoluto fino a 300.

Esempi:

1. `C1` = `=A1*B1`, `D1` = `=C1-A1`, con `A1` = 4 e `B1` = 12; `A1` diventa 6: `C1` = 72, `D1` = 66.
2. Tre prodotti 54, 36, 42 con il totale 132; `B2` passa da 4 a 7 (con `A2` = 9): il prodotto diventa 63, il
   totale 159.

## Livello 6: gli errori

Un foglio con tre testi nella colonna `A` e numeri nelle colonne `B` e `C`; una formula scritta nella colonna `D`.
Quattro casi, uno su quattro ciascuno, e le opzioni sono sempre i quattro errori:

- `#DIV/0!`: si divide per una cella che vale 0, per una cella vuota, o per la differenza di due celle uguali;
- `#VALORE!`: un'operazione tra `+`, `-`, `*` con una cella della colonna `A`;
- `#NOME?`: un riferimento senza numero di riga (`=B1+C`), una funzione scritta male (`=SOMA(B1:B3)`), una parola
  (`=prezzo*C2`);
- riferimento circolare: la formula usa la cella in cui è scritta (`=B1+D2` in `D2`).

Solo le formule del primo caso contengono una divisione, così l'errore è uno solo.

## Esercizi "brutti" da evitare

- intervalli di una sola cella; risultati con più di un decimale o risultati intermedi periodici (`8 : 7 · 7`);
- al livello 3 formule in cui l'ordine non conta (`a*b+c`); al livello 4 parentesi inutili;
- al livello 5 un cambiamento che lascia uguale il valore chiesto;
- al livello 6 formule con due errori diversi.

## Variante a scelta multipla

Quattro opzioni distinte, una corretta. Se gli errori tipici non bastano, numeri vicini.

- Livello 1 (quante celle): `(colonne − 1) · (righe − 1)`, 2 (solo gli estremi), colonne + righe, una riga o una
  colonna in meno; sempre interi positivi.
- Livello 2: l'altra operazione (`+` per `*`, `-` per `/`), la cella con riga e colonna scambiate (`B1` per `A2`),
  gli operandi scambiati.
- Livello 3: il calcolo da sinistra a destra senza precedenze; il calcolo da destra a sinistra.
- Livello 4: senza parentesi; `^` letto come `*`; da sinistra a destra.
- Livello 5: il valore di prima (niente ricalcolo); il valore della sola formula intermedia; il valore di prima più
  la variazione del dato.
- Livello 6: gli altri tre errori.

## Domande per la revisione

- Al livello 6 le opzioni sono sempre i quattro errori. Serve anche il caso "nessun errore", con un numero come
  quinta possibilità?
- Il riferimento circolare è scritto in parole, perché i programmi lo segnalano in modi diversi. Va bene così?
- Al livello 1 la domanda "quale cella appartiene all'intervallo" è abbastanza, o serve anche "qual è la cella in
  alto a sinistra / in basso a destra"?
