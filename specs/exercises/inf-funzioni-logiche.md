# Condizioni e funzioni logiche

Generatore: `inf-funzioni-logiche` (`src/lib/exercises/v2/generators/inf-funzioni-logiche.ts`).
Verifica indipendente: `scripts/exercises/checkers/inf_funzioni_logiche.py`. Lezione collegata:
`docs/lezioni/informatica/riscritte/26-inf-funzioni-logiche.md`. Aiuti comuni ai tre generatori della seconda metà del
capitolo: `src/lib/exercises/v2/inf-foglio-dati.ts` e `scripts/exercises/checkers/_inf_foglio_dati.py`.

Sei livelli, nell'ordine della lezione. Ogni formula è costruita come un albero, scritta nella sintassi italiana e
valutata su un foglio generato; il controllo Python la rilegge dal testo e la valuta con un suo valutatore.

## Nomi dei livelli

1. Confronti: VERO o FALSO
2. La funzione SE
3. SE annidati: le fasce
4. E, O, NON
5. CONTA.SE
6. SOMMA.SE

## Regole comuni

- Formule con i nomi italiani (`SE`, `E`, `O`, `NON`, `CONTA.SE`, `SOMMA.SE`, `SOMMA`), punto e virgola tra gli
  argomenti, nessuno spazio, testi tra virgolette doppie senza lettere accentate.
- Le formule non sono matematica: stanno in testo a spaziatura fissa. Un riferimento dentro la frase è
  `$\texttt{B2}$`; una formula su una riga sua, o in un'opzione, è `\small\texttt{…}`. Una riga di formula ha al più
  33 caratteri e un'opzione al più 27 (350 px e 252 px sul telefono, con il carattere a larghezza fissa di KaTeX).
- Il foglio è un `array` con la riga delle lettere di colonna e la colonna dei numeri di riga; la riga 1 è
  l'intestazione, i dati cominciano dalla riga 2. I numeri sono interi non negativi.
- Il testo sta in righe `\text{…}`. Niente trattini lunghi e niente "piuttosto che".
- I valori logici si scrivono VERO e FALSO.

## Livello 1: confronti

Due celle (per esempio `C1` e `D1`) con due numeri da 2 a 12, uguali in circa 3 casi su 10. Quattro formule, ognuna
un solo confronto tra una cella e l'altra cella o un numero vicino, con `=`, `<>`, `<`, `<=`, `>`, `>=`. Si chiede
quale dà VERO (metà dei casi: una vera e tre false) o quale dà FALSO (una falsa e tre vere). Le quattro formule usano,
quando si può, operatori diversi.

- "La cella `A1` contiene 7 e la cella `B1` contiene 9. Quale di queste formule dà come risultato VERO?" Opzioni
  `=A1>B1`, `=B1<=8`, `=A1<>7`, `=A1<B1`. Risposta: `=A1<B1`.
- "La cella `C1` contiene 5 e la cella `D1` contiene 5. Quale dà FALSO?" Opzioni `=C1<>6`, `=C1>=D1`, `=D1<=6`,
  `=C1=6`. Risposta: `=C1=6`.

## Livello 2: la funzione SE

Tabella di quattro righe di dati con un'etichetta e un numero; nella prima colonna libera, sulla riga chiesta, un SE
con una soglia: `=SE(B4>=6;"promosso";"bocciato")`. Sei temi: voti (soglia 6, solo `>=` e `<`), punti, assenze,
temperature, spesa con sconto di 10 euro (`=SE(B3>=50;B3-10;B3)`), punti con bonus di 5. Operatori `>=`, `>`, `<`,
`<=`. Il valore della cella chiesta è uguale alla soglia in circa un caso su tre, dove `>` e `>=` danno risposte
diverse. Si chiede che cosa compare nella cella.

Opzioni: il valore del secondo argomento, quello del terzo, VERO, FALSO (chi confonde il risultato del SE con quello
della condizione).

- Voti 4, 4, 6, 5; in `C4`: `=SE(B4>=6;"promosso";"bocciato")`. Risposta: promosso.
- Spese 40, 20, 40, 20; in `C4`: `=SE(B4>40;B4-10;B4)`. Risposta: 40 (la condizione è falsa). Distrattore: 30.

## Livello 3: SE annidati

Tabella di tre righe; due SE annidati su due soglie e tre etichette (scarso, buono, ottimo; bronzo, argento, oro;
freddo, mite, caldo; ridotto, giovani, intero). La formula sta su due righe, spezzata prima del secondo SE. Tre forme:

- decrescente (circa 40%): `=SE(B3>=8;"ottimo";SE(B3>=6;"buono";"scarso"))`;
- crescente (circa 40%): `=SE(B3<6;"scarso";SE(B3<8;"buono";"ottimo"))`;
- trappola (circa 20%), con le soglie nell'ordine sbagliato: `=SE(B3>=6;"buono";SE(B3>=8;"ottimo";"scarso"))`. La
  formula si valuta così com'è: con 9 dà buono. È l'avviso "L'ordine delle soglie" della lezione.

Il valore chiesto cade in una di cinque zone (sotto la prima soglia, sulla prima, in mezzo, sulla seconda, sopra), con
le soglie più frequenti. Opzioni: le tre etichette e VERO.

- 15, 30, 33 gradi; in `C4`: `=SE(B4<15;"freddo";SE(B4<25;"mite";"caldo"))`. Risposta: caldo.
- Voto 9; `=SE(B3>=6;"buono";SE(B3>=8;"ottimo";"scarso"))`. Risposta: buono.

## Livello 4: E, O, NON

Tabella di quattro righe con due colonne di numeri (scritto e orale, due gare, andata e ritorno). In colonna `D` un SE
la cui condizione è `E(…;…)`, `O(…;…)`, `NON(…)`, oppure un intervallo `E(B3>=6;B3<=8)`; i due risultati sono due
etichette corte (premio e niente, passa e no, ok e no), scelte in modo che la formula stia in 33 caratteri. Per la
riga chiesta si estrae prima il valore di verità di ogni condizione, poi un numero vicino alla soglia che lo dà: così
né E né O hanno una risposta tipica.

Opzioni: le due etichette, VERO, FALSO.

- Gara 1: 8, Gara 2: 10; `=SE(E(B4<15;C4>10);"ok";"no")`. Risposta: no ($10 > 10$ è falso).
- Andata 5, ritorno 3; `=SE(O(B3>3;C3>3);"ok";"no")`. Risposta: ok.

## Livello 5: CONTA.SE

Tabella di sei righe di dati con tre colonne: un nome, un gruppo (tre gruppi, ognuno presente almeno una volta), un
numero. Una soglia, presa a metà della scala, compare almeno una volta tra i numeri.

- Valore (circa 65%): in `C9` c'è `=CONTA.SE(C2:C7;">30")`, oppure con `>=`, `<`, `<=`, `<>`, con il solo numero
  (`=CONTA.SE(C2:C7;30)`), o su un gruppo (`=CONTA.SE(B2:B7;"Pisa")`). Risposta: un numero. Distrattori: il conto con
  `>` scambiato con `>=`, la somma al posto del conteggio, le righe che non rispettano il criterio, tutte le righe.
- Formula (circa 35%): "Quale di queste formule dà come risultato 4?", con quattro `CONTA.SE` che danno quattro
  risultati diversi.

Esempi: acquisti 30, 35, 15, 50, 40, 20: `=CONTA.SE(C2:C7;">30")` dà 3. Con 30, 60, 15, 30, 35, 40 la formula che dà
4 è `=CONTA.SE(C2:C7;"<=35")`.

## Livello 6: SOMMA.SE

Stessa tabella. Valore: `=SOMMA.SE(C2:C7;">30")` (due argomenti) oppure `=SOMMA.SE(B2:B7;"Pisa";C2:C7)` (tre
argomenti, metà dei casi). Distrattori: il conteggio, la somma con `>` scambiato con `>=`, la somma delle altre righe,
la somma di tutta la colonna. Formula: quattro opzioni tra `SOMMA.SE` a due argomenti, `CONTA.SE` con lo stesso tipo
di criterio e `=SOMMA(C2:C7)`, con risultati tutti diversi.

Esempi: `=SOMMA.SE(C2:C7;">30")` su 30, 35, 15, 50, 40, 20 dà 125. Su 20, 35, 10, 5, 5, 35 con le città Bari, Roma,
Roma, Bari, Bari, Pisa, `=SOMMA.SE(B2:B7;"Pisa";C2:C7)` dà 35.

## Esercizi da evitare

- Confronti tra testi, o tra un numero e un testo.
- Un SE con i due rami uguali; tre etichette non tutte diverse.
- Una formula più lunga di 33 caratteri su una riga, o di 27 in un'opzione.
- Al livello 5 e 6, due opzioni-formula con lo stesso risultato.

## Verifica

Il controllo rilegge il foglio e la formula dal problema, analizza la formula con un piccolo parser (numeri, testi,
riferimenti, intervalli, confronti, somme e prodotti, funzioni) e la valuta. Poi controlla: al livello 1 che una sola
opzione dia il valore logico chiesto; ai livelli 2-4 la forma della formula (un SE sulla riga della sua cella, annidato
o con E, O, NON come dice il livello), le quattro opzioni attese e quella giusta; ai livelli 5 e 6 il numero, la scelta
multipla che lo accompagna, e per il caso "formula" che le quattro formule diano risultati diversi e una sola quello
chiesto. Quote dei casi: VERO e FALSO al livello 1, le tre forme al livello 3, il caso "formula" ai livelli 5 e 6.

## Domande per la revisione

- Le etichette nelle formule sono senza accenti ("ok", "no", "passa") per stare nella larghezza del telefono: va bene,
  o si preferiscono etichette più scolastiche su due righe?
- Il livello 3 valuta anche formule con le soglie nell'ordine sbagliato: va bene come esercizio, o confonde?
