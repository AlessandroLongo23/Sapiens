# Divisibilità e numeri primi

Generatore: `numeri-naturali-divisibilita` (`src/lib/exercises/v2/generators/numeri-naturali-divisibilita.ts`).
Verifica indipendente: `scripts/exercises/checkers/numeri_naturali_divisibilita.py` (interi e
SymPy: `factorint`, `isprime`, `divisor_count`). Lezione collegata: "Divisibilità e numeri primi"
(`docs/lezioni/riscritte/19-numeri-naturali-divisibilita.md`). Macchinario comune:
`src/lib/exercises/v2/naturali.ts`.

I livelli seguono l'ordine della lezione: divisibilità con la divisione, un criterio alla volta,
tutti i criteri della tabella, primo o composto, scomposizione in fattori primi, divisibilità e
numero dei divisori dalla scomposizione. Le convenzioni sono quelle della lezione: criterio dell'11
contando da destra con la differenza presa in positivo, criterio del 4 "le ultime due cifre sono 00
o formano un multiplo di 4", `\cdot` per il prodotto, fattori uguali raccolti in potenze, spazio
sottile nei numeri da 10 000 in su (`14\,553`). Niente simbolo `b \mid a`, che la lezione non usa.

## Rappresentazione

- Livelli 1 e 2: `problem` elenca i quattro numeri in ordine crescente (`84 \qquad 85 \qquad 91
  \qquad 94`), `prompt` dice il divisore; la risposta è a scelta (`choice`), con valori i numeri.
  `params.d`, `params.n` (quello giusto), `params.options`, `params.case` (il divisore).
- Livello 3: `problem` è il numero; la risposta è un insieme (`set`) con i divisori tra
  2, 3, 4, 5, 9, 10, 11, 25 in ordine crescente. `params.case` è `11` o `senza 11`.
- Livello 4: `problem` è il numero; la risposta è a scelta tra affermazioni: `primo` ("È primo")
  oppure `div:p` ("È divisibile per p"), una sola vera. `params.case` è `primo` o `composto`.
- Livello 5: `problem` è il numero; la risposta è un'espressione (`2**2*3**2*5*7`,
  `form: "factored"`). `params.factors` come coppie base ed esponente.
- Livello 6: `problem` è `n = scomposizione`. Numero dei divisori: risposta `number`. Divisibilità:
  `prompt` elenca le quattro opzioni, risposta a scelta con valori i numeri.

## Livello 1: divisibile o no, con la divisione

"Quale di questi numeri è divisibile per 7? Fai la divisione." Divisore 3, 4, 6, 7, 8 o 9 (il 7 ha
peso doppio: non ha un criterio in tabella). Quattro numeri tutti a due cifre (da 20) o tutti a tre;
uno solo è multiplo del divisore. Da uno a due trabocchetti (vedi sotto), gli altri distrattori
entro 3 volte il divisore dal numero giusto. Passaggi: ogni divisione con quoziente e resto.

Esempi svolti:

1. Per 7: 613, 630, 642, 877. `630 : 7 = 90` resto 0; 877 finisce con 7 ma `877 : 7 = 125` resto 2.
2. Per 6: 24, 31, 40, 41. `24 = 6 \cdot 4`; 40 è pari ma `40 : 6 = 6` resto 4.

## Livello 2: un criterio alla volta

Come il livello 1, con quattro numeri da 1000 a 9999 e il divisore tra 2, 3, 5, 9, 10 (3 e 9 con
peso doppio): la divisione a mente non basta più e serve il criterio. Passaggi: il criterio della
lezione applicato a ogni numero.

Esempi svolti:

1. Per 3: 1475, 1484, 1635, 4769. La somma delle cifre di 1635 è 15, multiplo di 3; 4769 finisce
   con 9 ma la somma delle cifre è 26.
2. Per 5: 5648, 6384, 6470, 6739. Solo 6470 finisce con 0 o 5; 5648 comincia con 5.

## Livello 3: tutti i criteri su un numero

"Per quali tra 2, 3, 4, 5, 9, 10, 11 e 25 è divisibile questo numero?" Numero da 100 a 99 999
(circa 20% a tre cifre, 50% a quattro, 30% a cinque), divisibile per almeno uno e al massimo sei
dei divisori della tabella, con almeno un trabocchetto tra quelli che non lo dividono. Circa un terzo
dei numeri è multiplo di 11 (quota verificata tra 25% e 50%). Passaggi: gli otto criteri, nell'ordine
della tabella.

Esempi svolti:

1. 8650: divisibile per 2, 5, 10 e 25 (le ultime due cifre sono 50); non per 4 (50 non è multiplo
   di 4), non per 3 né per 9 (somma 19), non per 11 (differenza 0 + 6 = 6, 5 + 8 = 13, 13 − 6 = 7).
2. 5995: divisibile per 5 e 11 (da destra 5 + 9 = 14 e 9 + 5 = 14, differenza 0); non per 10 né per
   25 (finisce con 95).

## Livello 4: primo o composto

"Quale di queste affermazioni è vera?" Numero da 49 a 400: metà primi, metà composti senza fattori
2, 3, 5 (91, 119, 143, 221, 289, 301, ...), così i criteri non bastano e bisogna dividere per 7,
11, 13, ... fino a quando il quadrato del primo supera il numero. Opzioni: "È primo" e "È divisibile
per p". Per un composto l'opzione giusta è il suo fattore primo più piccolo, e nessun'altra opzione
nomina un suo divisore. Passaggi: i criteri di 2, 3, 5, poi una divisione per ogni primo da 7, fino
al primo divisore o al primo il cui quadrato supera il numero.

Esempi svolti:

1. 221: non divisibile per 2, 3 (somma 5), 5; `221 = 7 \cdot 31 + 4`, `221 = 11 \cdot 20 + 1`,
   `221 = 13 \cdot 17`. Composto: "È divisibile per 13".
2. 211: `211 = 7 \cdot 30 + 1`, `211 = 11 \cdot 19 + 2`, `211 = 13 \cdot 16 + 3`; `17 \cdot 17 = 289`
   supera 211. "È primo".

## Livello 5: scomposizione in fattori primi

Numero da 60 a 5000 con almeno due primi diversi, almeno tre fattori contati con la molteplicità e
un esponente almeno 2. Metà solo con 2, 3, 5; metà con 7, 11 o 13 (uno o due, il 7 anche al
quadrato), come nell'esempio 9 della lezione. Passaggi: la colonna delle divisioni, poi il prodotto
raccolto in potenze.

Esempi svolti:

1. `4900 = 2^2 \cdot 5^2 \cdot 7^2`.
2. `240 = 2^4 \cdot 3 \cdot 5`.

## Livello 6: dalla scomposizione

La scomposizione è data nel testo. Metà degli esercizi:

- Numero dei divisori. Da due a quattro primi tra 2, 3, 5, 7, un esponente almeno 2, numero fino a
  10 000. Passaggi: un fattore (esponente + 1) per ogni primo, il prodotto.
- Divisibilità. Numero fino a 20 000 con tre o quattro primi tra 2, 3, 5, 7, 11, un esponente
  almeno 2. Quattro numeri da confrontare: uno solo lo divide (almeno due fattori primi, non il
  numero stesso, fino a 1000); gli altri hanno un esponente più grande di quello della scomposizione
  o un primo che non c'è. Passaggi: la scomposizione di ogni opzione e il confronto degli esponenti;
  per quella giusta, il quoziente.

Esempi svolti:

1. Quanti divisori ha `1400 = 2^3 \cdot 5^2 \cdot 7`? `(3 + 1) \cdot (2 + 1) \cdot (1 + 1) = 24`.
2. Per quale tra 6, 81, 99 e 121 è divisibile `14\,553 = 3^3 \cdot 7^2 \cdot 11`? `99 = 3^2 \cdot 11`
   sì, quoziente 147; `6 = 2 \cdot 3` no (il 2 non c'è), `81 = 3^4` no (il 3 ha esponente 3),
   `121 = 11^2` no (l'11 ha esponente 1).

## Trabocchetti

Un numero non divisibile che uno studente frettoloso accetterebbe. Livelli 1 e 2 ne hanno almeno uno
tra le opzioni, il livello 3 almeno uno tra i divisori della tabella che non dividono il numero.

- per 2: la prima cifra è pari (si guarda la cifra sbagliata);
- per 3: l'ultima cifra è 3, 6 o 9;
- per 4: il numero è pari (il riquadro "Guardare solo l'ultima cifra per il 4");
- per 5: c'è un 5 o uno 0, ma non in fondo;
- per 6: multiplo di 2 o di 3; per 8: multiplo di 4 (livello 1);
- per 7: l'ultima cifra è 7 (livello 1);
- per 9: multiplo di 3;
- per 10: l'ultima cifra è 5, oppure (livello 2) c'è uno 0 non in fondo;
- per 25: multiplo di 5.

## Esercizi "brutti" da evitare

- al livello 1 e 2, due opzioni divisibili, o opzioni tutte lontane dal numero giusto (la grandezza
  non deve suggerire la risposta);
- al livello 3, numeri non divisibili per nessuno dei divisori della tabella, o divisibili per sette
  o otto (finiscono con 00 e la domanda si svuota);
- al livello 4, composti con un fattore 2, 3 o 5 (li scoprono i criteri) e numeri sotto 49 (non si
  divide nemmeno per 7);
- al livello 5, numeri primi, potenze di un solo primo, prodotti di due soli fattori;
- al livello 6, un divisore banale (1, un primo, il numero stesso) come risposta giusta.

## Variante a scelta multipla

Quattro opzioni distinte, una corretta.

- Livelli 1, 2, 4 e 6 (divisibilità): la risposta è già a scelta, con i distrattori descritti sopra.
  Al livello 4 i distrattori sono "È divisibile per 3" (sempre), per altri primi da 7 a 23 che non
  dividono il numero e, per un composto, "È primo".
- Livello 3: la risposta con un trabocchetto in più (4 per un pari, 9 per un multiplo di 3, 10 o 25
  per un multiplo di 5), la risposta senza uno dei divisori meno ovvi (4, 9, 11, 25), l'11 aggiunto o
  tolto; se non bastano, un altro divisore aggiunto o tolto.
- Livello 5: un fattore composto lasciato (`2^2 \cdot 5^2 \cdot 49`), la scomposizione interrotta
  (`2^2 \cdot 1225`), un esponente sbagliato di 1, esponenti scambiati.
- Livello 6, numero dei divisori: il prodotto degli esponenti (dimenticato il più uno, il riquadro
  della lezione), la somma degli (esponente + 1), il prodotto degli esponenti più 1, la somma degli
  esponenti; se non bastano, numeri vicini.

## Differenze dalla proposta nelle note della lezione

- Livelli 1 e 2 chiedono quale di quattro numeri è divisibile, non "sì o no" su un solo numero: così
  c'è la scelta multipla a quattro opzioni e c'è posto per un trabocchetto.
- La cifra mancante ("quali cifre al posto del quadratino rendono `4\square8` divisibile per 12")
  non c'è: combinare due criteri è una difficoltà a sé, e il livello 6 resta sulla scomposizione.

## Domande per la revisione

- Al livello 2 il divisore 2 è quasi gratuito anche con il trabocchetto della prima cifra pari: va
  tolto o tenuto come esercizio di riscaldamento?
- Al livello 4 le opzioni "È divisibile per 23" per numeri piccoli sono deboli: meglio limitarle ai
  primi il cui quadrato non supera il numero?
- Serve un livello sulla cifra mancante (combinare due criteri, esempio 4 della lezione), magari al
  posto del livello 2?
- Serve un esercizio "elenca tutti i divisori di 36" (il procedimento a coppie della lezione), che
  oggi non ha un livello?
