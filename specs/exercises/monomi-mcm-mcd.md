# MCD e MCM tra monomi

Generatore: `monomi-mcm-mcd` (`src/lib/exercises/v2/generators/monomi-mcm-mcd.ts`).
Verifica indipendente: `scripts/exercises/checkers/monomi_mcm_mcd.py`. Lezione collegata:
`docs/lezioni/riscritte/14-monomi-mcm-mcd.md`.

Lo studente riceve due o tre monomi e calcola il MCD oppure il MCM, come dice la consegna ("Calcola
il MCD dei monomi.", circa metà degli esercizi, o "Calcola il MCM dei monomi."). Il testo è la lista
dei monomi separati da virgola, `12x^3y^2,\quad 18x^2y^5`. La risposta è un monomio
(`answer.kind = "expression"`).

## Convenzione sul coefficiente

Quella della lezione 14: se tutti i coefficienti sono interi, il coefficiente del MCD (del MCM) è il
MCD (il MCM) dei loro valori assoluti; se almeno uno è una frazione, il coefficiente è 1. Il
risultato ha sempre coefficiente positivo. Per la parte letterale: nel MCD le lettere comuni a tutti
i monomi con l'esponente minimo, nel MCM tutte le lettere con l'esponente massimo. Il verificatore
riscrive la regola dal testo della lezione e la applica ai monomi letti dal LaTeX del problema.

## Rappresentazione

`params.case` vale `MCD` o `MCM`; `params.monomials` è la lista dei monomi (`{c: "p/q", e: {x: 2}}`)
nell'ordine del testo; `params.result` il risultato.

## Regole comuni

- Monomi in forma normale, con almeno una lettera, esponenti da 1 a 6, lettere di una sola famiglia.
- Coefficienti interi fino a 40 (30 con tre monomi), diversi tra loro in valore assoluto, con MCM
  fino a 360; frazioni con denominatore fino a 8.
- Mai due monomi con la stessa parte letterale; mai un MCD uguale a 1.
- I passaggi dicono per ogni lettera gli esponenti e se si prende il minimo o il massimo; il
  verificatore controlla anche queste affermazioni.

## Livello 1: due monomi con le stesse lettere

Coefficienti interi positivi, almeno 2, con un fattore comune.

1. MCD di `12x^3y^2` e `18x^2y^5`: `\text{MCD}(12, 18) = 6`, `x` minimo 2, `y` minimo 2: `6x^2y^2`.
2. MCM di `6ab^2` e `9ab^3`: `\text{MCM}(6, 9) = 18`, `a` massimo 1, `b` massimo 3: `18ab^3`.

## Livello 2: lettere non comuni

Due monomi con lettere non tutte uguali, coefficienti interi positivi; circa 2 su 10 senza lettere
in comune, e allora il MCD è solo un numero (esempio 4 della lezione).

1. MCD di `15ab^4c` e `55a^5b^2`: la `c` manca nel secondo, `5ab^2`.
2. MCM di `6x^3` e `3x^4z^4`: `6x^4z^4`.

## Livello 3: segni negativi

Due monomi a coefficienti interi, almeno uno negativo. Si usano i valori assoluti e il risultato è
positivo.

1. MCD di `40a^6b^6` e `-16a^5b^2c^3`: `8a^5b^2`.
2. MCM di `12a^3bc^2` e `-24a^3b^4`: `24a^3b^4c^2`.

## Livello 4: tre monomi

Tre monomi a coefficienti interi, circa 1 su 4 negativi; circa 2 su 10 senza lettere comuni a tutti.

1. MCD di `52a^2b^4c^3`, `4a^2b^5c^2`, `56b`: `4b`.
2. MCM di `-10b^2`, `30a^4b^3c^6`, `15a^3b^6`: `\text{MCM}(10, 30, 15) = 30`, `a` massimo 4, `b`
   massimo 6, `c` massimo 6: `30a^4b^6c^6`.

## Livello 5: coefficienti frazionari

2 o 3 monomi, almeno un coefficiente frazionario: il coefficiente del risultato è 1.

1. MCD di `-\frac{5}{8}ac^3` e `\frac{7}{2}a^6c^4`: `ac^3`.
2. MCM di `\frac{3}{5}y^3`, `\frac{3}{8}x^6y^4z^6`, `11y^6`: `x^6y^6z^6`.

## Esercizi "brutti" da evitare

- monomi simili tra loro, o coefficienti uguali che rendono banale la parte numerica;
- MCD uguale a 1;
- numeri grandi: la lezione lavora con coefficienti come 12, 18, 20, e il MCM resta entro 360;
- il segno meno nel risultato.

## Variante a scelta multipla

Quattro monomi distinti, uno corretto. Distrattori, dagli errori frequenti della lezione: il MCM al
posto del MCD e viceversa; nel MCD anche le lettere non comuni; esponente massimo al posto del
minimo (e viceversa); nel MCM solo le lettere comuni; il coefficiente dell'altro calcolo, il
prodotto dei coefficienti, il coefficiente dimenticato (1); il segno meno; con le frazioni "il MCD
delle frazioni" (MCD dei numeratori su MCM dei denominatori, e il contrario per il MCM). Se non
bastano, coefficiente ±1 o un esponente +1.

## Domande per la revisione

- La convenzione sul coefficiente è quella della lezione; se una scuola usa sempre coefficiente 1,
  serve un'opzione per cambiarla?
- Con coefficienti frazionari e interi insieme (`\frac{3}{5}y^3`, `11y^6`) il coefficiente 1 è
  quello che si aspetta un insegnante?
- La lista dei monomi separata da virgole va bene, o si preferisce il punto e virgola, visto che la
  virgola è anche il separatore decimale?
