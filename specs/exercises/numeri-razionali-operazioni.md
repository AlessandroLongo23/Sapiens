# Operazioni in ℚ

Generatore: `numeri-razionali-operazioni`
(`src/lib/exercises/v2/generators/numeri-razionali-operazioni.ts`). Verifica indipendente:
`scripts/exercises/checkers/numeri_razionali_operazioni.py`. Lezione collegata: "Operazioni in ℚ"
(`docs/lezioni/riscritte/24-numeri-razionali-operazioni.md`).

Lo studente calcola una somma, una differenza, un prodotto o un quoziente di frazioni, al livello 6
un'espressione con due operazioni e al livello 7 risolve un problema a parole. La risposta è un
numero razionale ridotto (`number`, `"p/q"`). I livelli seguono l'ordine della lezione.

## Rappresentazione

`params.expr` è un albero: foglie `{t: "n", v: "p/q"}` (razionale ridotto, denominatore positivo) e
nodi `{t: "add"|"sub"|"mul"|"div", a, b}`. Il testo è scritto dall'albero:

- frazioni con `\frac`, moltiplicazione con `\cdot`, divisione con `:`, come nella lezione;
- un numero negativo va tra parentesi (`\left(-\frac{3}{4}\right)`, `(-3)`), tranne il primo termine
  di una somma (`-\frac{5}{6} + \frac{4}{15}`);
- una somma dentro un prodotto o un quoziente va tra parentesi tonde.

`params.case` descrive il caso; `params.wrong` sono i valori degli errori tipici, usati per la scelta
multipla.

## Regole comuni

- Operandi mai nulli; frazioni ridotte con denominatore positivo.
- Risultato diverso da zero, numeratore fino a 150 e denominatore fino a 60; ogni valore intermedio
  con numeratore fino a 150 e denominatore fino a 72.
- Nessun `+ -`, `- -` o `+ +` nel testo.
- Il caso di ogni livello si estrae una volta sola, prima dei rifiuti, così le quote restano quelle
  scritte qui.

## Livello 1: stesso denominatore

Somma (6 su 10) o differenza (4 su 10) di due frazioni positive ridotte con lo stesso denominatore,
da 3 a 16. Il risultato va ridotto ai minimi termini, ma non diventa un intero. La differenza può
venire negativa, come nella lezione.

Esempi: `\frac{5}{12} + \frac{1}{12} = \frac{1}{2}`; `\frac{5}{9} - \frac{8}{9} = -\frac{1}{3}`.

## Livello 2: denominatori diversi

Somma (6 su 10) o differenza (4 su 10) di due frazioni positive ridotte con denominatori diversi,
fino a 15, MCM fino a 60. Risultato positivo: i segni arrivano al livello 3.

Esempi: `\frac{7}{12} - \frac{3}{8} = \frac{5}{24}`; `\frac{5}{6} + \frac{3}{4} = \frac{19}{12}`.

## Livello 3: segni e interi

Tre casi, in proporzione 4, 3, 3:

- frazione negativa: `-\frac{a}{b} \pm \frac{c}{d}`, denominatori diversi;
- sottrazione di una negativa: `\frac{a}{b} - \left(-\frac{c}{d}\right)`, denominatori diversi;
- un intero da 1 a 5 con una frazione positiva: `n + \frac{a}{b}`, `n - \frac{a}{b}` o `\frac{a}{b} - n`.

Esempi: `-\frac{5}{6} + \frac{4}{15} = -\frac{17}{30}`; `3 - \frac{7}{4} = \frac{5}{4}`.

## Livello 4: prodotto

Prodotto di due frazioni ridotte, non intere, termini fino a 40, con almeno una semplificazione in
croce. Costruito all'indietro: `\frac{p_1 k_1}{q_1 k_2} \cdot \frac{p_2 k_2}{q_2 k_1}`, con `k_1` o
`k_2` maggiore di 1 e il risultato `\frac{p_1 p_2}{q_1 q_2}` già ridotto dopo la semplificazione.
Fattori discordi, entrambi negativi o entrambi positivi, in proporzione 5, 3, 2. Risultato non intero
e diverso da ±1.

Esempi: `\left(-\frac{14}{15}\right) \cdot \frac{25}{21} = -\frac{10}{9}`;
`\left(-\frac{4}{9}\right) \cdot \left(-\frac{6}{5}\right) = \frac{8}{15}`.

## Livello 5: quoziente

Quoziente di due frazioni (7 su 10) o di una frazione e un intero, in una delle due posizioni (3 su
10). Dopo aver capovolto il divisore c'è almeno una semplificazione in croce (stessa costruzione del
livello 4). Segni con le stesse proporzioni del livello 4. Divisore diverso da ±1, risultato non
intero e diverso da ±1.

Esempi: `\left(-\frac{8}{9}\right) : \left(-\frac{4}{15}\right) = \frac{10}{3}`;
`\frac{2}{9} : 4 = \frac{1}{18}`.

## Livello 6: due operazioni

Tre numeri e due operazioni, una somma o differenza e un prodotto o quoziente, in due forme a metà:

- parentesi: `(x \pm y) \cdot z`, `(x \pm y) : z` (7 su 10) o `z \cdot (x \pm y)`, `z : (x \pm y)`,
  con la parentesi diversa da zero; `x` a volte intero o negativo;
- precedenza: `x \pm y \cdot z`, `x \pm y : z` (7 su 10) o `y \cdot z \pm x`; `x` spesso intero, `y`
  a volte negativo.

Esempi: `\left(\frac{1}{2} - \frac{5}{6}\right) : \frac{2}{3} = -\frac{1}{2}`;
`2 - \frac{3}{4} \cdot \frac{2}{9} = \frac{11}{6}`.

## Livello 7: problemi con le frazioni

Segue la sezione "Problemi con le frazioni" della lezione. Il testo (due o tre frasi) va nel
`problem` come righe `\text{...}` scritte con `textBlock`, la consegna è "Risolvi il problema.". Una
storia con due frazioni proprie `x` e `y`, ridotte, diverse tra loro, con denominatore in
{2, …, 10, 12} e mai oltre `\frac{3}{4}` (nessuno spende gli 11/12 dello stipendio per l'affitto).
Due casi, estratti prima dei rifiuti:

- somma (4 su 10): `x` e `y` sono frazioni dello stesso intero e si chiede quello che resta,
  `1 - (x + y)`; denominatori diversi, MCM fino a 40, `x + y < 1`;
- resto (6 su 10): `y` è una frazione di quello che resta dopo `x`; metà delle volte si chiede la
  seconda parte, `y \cdot (1 - x)`, metà quello che resta alla fine, `(1 - x) - y \cdot (1 - x)`.

La frazione cercata ha denominatore fino a 60. In 4 esercizi su 10 il testo dà il totale e la
risposta è un intero, la frazione cercata di quel totale; il totale è scelto in modo che ogni parte
della storia sia un numero intero (niente pagine o studenti a metà, euro senza centesimi). Nel testo
non compaiono altri numeri oltre alle due frazioni e al totale.

Storie (`params.story`), con nomi italiani e l'intervallo del totale:

| storia | situazione | totale |
|---|---|---|
| stipendio | affitto e spesa | 1200-2400 euro, multipli di 50 |
| libro | pagine lette il primo e il secondo giorno | 96-480 pagine |
| viaggio | una famiglia in auto, primo e secondo giorno | 300-1200 km, multipli di 10 |
| risparmi | scarpe da calcio e videogioco | 60-360 euro, multipli di 5 |
| figurine | figurine attaccate a settembre e a ottobre | 240-720 figurine |
| orto | pomodori e zucchine nell'orto del nonno | 60-360 metri quadrati |
| nuoto | stile libero, dorso e il resto a rana | 1000-3000 metri, multipli di 50 |
| scuola | studenti in autobus, in bicicletta, a piedi | 300-1200 studenti |

Nel caso resto il testo dice di che cosa è frazione `y` ("di quello che le rimane", "delle pagine che
restano", "della strada che manca", "di quelle che mancano", "della parte rimasta", "della distanza
rimasta", "degli altri"); nel caso somma queste parole non ci sono. `params`: `story`, `case`
(`somma` o `resto`), `ask` (`resta` o `seconda`), `x`, `y`, `total` (stringa o `null`), `wrong`.

Esempi:

- somma: "Ogni mese Matteo spende $\frac{1}{3}$ dello stipendio per l'affitto e i $\frac{3}{7}$ per la
  spesa. Che frazione dello stipendio gli resta?" `1 - \left(\frac{1}{3} + \frac{3}{7}\right) =
  1 - \frac{16}{21} = \frac{5}{21}`.
- resto, con il totale: "In allenamento Marta nuota $\frac{1}{7}$ della distanza a stile libero e i
  $\frac{3}{8}$ della distanza rimasta a dorso; il resto lo fa a rana. L'allenamento è di 2800 metri.
  Quanti metri nuota a rana?" Resta `\frac{6}{7}`, a dorso `\frac{3}{8} \cdot \frac{6}{7} =
  \frac{9}{28}`, a rana `\frac{6}{7} - \frac{9}{28} = \frac{15}{28}`, cioè `2800 : 28 \cdot 15 = 1500`.

## Passaggi

Gli stessi della lezione: "stesso denominatore: somma i numeratori" e riduzione; MCM dei denominatori
con i quozienti e un'unica linea di frazione (`\frac{-25 + 8}{30}`); l'intero scritto come frazione;
"sottrarre −c/d vuol dire sommare c/d"; la regola dei segni del prodotto o del quoziente; la
semplificazione in croce con i numeri e il divisore comune; la divisione trasformata nel prodotto per
il reciproco. Al livello 6 prima la parentesi o l'operazione che ha la precedenza, poi l'altra.
Al livello 7 i passaggi dicono prima di che cosa sono frazioni i dati ("le due frazioni sono dello
stesso intero" oppure "la seconda frazione è di quello che resta"), poi fanno i conti come ai livelli
precedenti e, se c'è il totale, calcolano la frazione del totale
(`\frac{15}{28} \text{ di } 2800 = 2800 : 28 \cdot 15 = 1500`).

## Da evitare

- Frazioni non ridotte negli operandi e denominatori negativi.
- Al livello 1 le somme che danno un intero (`\frac{1}{3} + \frac{2}{3}`), che non fanno ridurre
  niente.
- Prodotti e quozienti senza niente da semplificare.
- Esercizi in cui la scelta multipla va riempita con numeri a caso: si scarta l'esercizio se gli
  errori tipici non danno tre valori distinti e diversi dalla risposta.

## Variante a scelta multipla

Quattro opzioni distinte per valore, una corretta, dagli errori della lezione:

- livello 1: denominatori sommati (`\frac{a + b}{2d}`), solo il numeratore ridotto, il segno opposto,
  l'altra operazione;
- livello 2: numeratori con numeratori e denominatori con denominatori (`\frac{a + c}{b + d}`), MCM
  sotto e numeratori lasciati come sono, solo il primo numeratore moltiplicato, il segno opposto;
- livello 3: il meno esteso a tutta la somma, il meno dimenticato, `\frac{a + c}{b + d}`, il segno
  opposto; `-\left(-\frac{c}{d}\right)` preso come `-\frac{c}{d}`; l'intero sommato al solo numeratore
  (`3 + \frac{2}{5} \to \frac{5}{5}`, cioè 1);
- livello 4: il segno opposto, la moltiplicazione in croce (`\frac{a d}{b c}`), il reciproco;
- livello 5: il dividendo capovolto (il reciproco del risultato), il prodotto senza capovolgere, la
  semplificazione in croce fatta prima di capovolgere, il segno opposto;
- livello 6: la parentesi ignorata o le operazioni fatte da sinistra a destra, la somma sbagliata con
  `\frac{a + c}{b + d}`, la divisione fatta come prodotto, il segno opposto;
- livello 7, somma: la parte spesa `x + y` (la risposta a un'altra domanda), `1 - \frac{a + c}{b + d}`,
  le frazioni moltiplicate (`1 - x y`), una delle due frazioni dimenticata (`1 - x`, `1 - y`);
- livello 7, resto: la frazione del resto presa sul totale (`1 - (x + y)` oppure `y`), la risposta
  all'altra domanda (la seconda parte oppure quello che resta), la frazione presa della prima parte
  (`x y`), la prima parte non sottratta (`1 - y(1 - x)`), `1 - y`. Con il totale gli stessi valori
  moltiplicati per il totale, tenuti solo se interi; senza tre distrattori positivi e distinti
  l'esercizio si scarta.

## Domande per la revisione

- Il livello 3 mescola tre difficoltà (frazione negativa, sottrazione di una negativa, intero), come
  propone la nota della lezione: meglio separare l'intero in un livello a sé?
- Al livello 1 lo spazio degli esercizi è piccolo (circa 550 diversi su 1000 estratti): va bene per
  un primo livello o serve allargare i denominatori?
- Livello 7: i due casi "del resto" hanno difficoltà diverse (quello che resta alla fine chiede una
  sottrazione in più della seconda parte). Vanno bene nello stesso livello?
- Livello 7: con il tetto a 3/4 restano storie come "i 5/7 dello stipendio per l'affitto": servono
  tetti diversi per storia?
- Livello 7: la lezione ha ora 21 flashcard, una in più del massimo di 20 di `stile.md`.
