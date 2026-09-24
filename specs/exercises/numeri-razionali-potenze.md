# Potenze in ℚ

Generatore: `numeri-razionali-potenze`
(`src/lib/exercises/v2/generators/numeri-razionali-potenze.ts`). Verifica indipendente:
`scripts/exercises/checkers/numeri_razionali_potenze.py`. Lezione collegata: "Potenze in ℚ"
(`docs/lezioni/riscritte/09-numeri-razionali-potenze.md`).

Lo studente calcola il valore di una potenza o di una piccola espressione con le potenze. La
risposta è un numero razionale ridotto (`number`, `"p/q"`). I livelli seguono l'ordine della lezione.

## Rappresentazione

`params.expr` è un albero: `{t: "pow", b, e}` (la base `b` è un razionale `"p/q"`, l'esponente `e`
un intero), `{t: "pp", b, e1, e2}` (potenza di potenza), `{t: "neg", x}` (segno meno davanti alla
potenza), `{t: "mul"|"div", a, b}`, `{t: "sum", terms: [{s: ±1, x}]}`. Il testo è scritto dall'albero:
base frazionaria o negativa tra parentesi (`\left(-\frac{2}{3}\right)^{2}`, `(-2)^{-3}`), base intera
positiva senza parentesi (`2^{-3}`), potenza di potenza con le quadre (`\left[\left(\frac{1}{2}\right)^{3}\right]^{-2}`),
divisione con `:` e moltiplicazione con `\cdot`. `params.case` descrive il caso; `params.wrong` sono i
valori degli errori tipici, usati per la scelta multipla.

## Regole comuni

- Mai base zero; risultato con numeratore e denominatore al massimo 5000.
- Esponente sempre tra graffe; esponenti 0 e 1 solo dove sono l'argomento (livello 3) o il risultato
  di una proprietà.
- Nessun `+ -` o `- -` nel testo.

## Livello 1: potenza di una frazione

`(a/b)^n` con `a/b` positiva, ridotta, non intera; `n = 2` (a, b fino a 9), `n = 3` (fino a 5),
`n = 4` (fino a 3), in proporzione 5, 4, 1.

Esempi: `\left(\frac{2}{3}\right)^{3} = \frac{8}{27}`; `\left(\frac{5}{2}\right)^{2} = \frac{25}{4}`.

## Livello 2: base negativa e segno meno

Circa 6 su 10 `\left(-\frac{a}{b}\right)^{n}`, 4 su 10 `-\left(\frac{a}{b}\right)^{n}`; esponenti da 2
a 5, pari e dispari. I passaggi dicono qual è la base e se l'esponente è pari o dispari.

Esempi: `\left(-\frac{2}{3}\right)^{2} = \frac{4}{9}`; `-\left(\frac{2}{3}\right)^{2} = -\frac{4}{9}`.

## Livello 3: esponente 0 ed esponente 1

Circa 6 su 10 esponente 0, 4 su 10 esponente 1; base positiva, base negativa tra parentesi o segno
meno fuori, come nell'esempio della lezione.

Esempi: `\left(-\frac{5}{7}\right)^{0} = 1`; `-\left(\frac{5}{7}\right)^{0} = -1`.

## Livello 4: esponente negativo

Esponente da −1 a −3; basi intere (a volte negative), frazioni positive, frazioni negative, in
proporzione 3, 4, 3. Reciproco della base ed esponente opposto; il segno segue la regola di pari e
dispari.

Esempi: `2^{-3} = \frac{1}{8}`; `\left(-\frac{1}{2}\right)^{-3} = -8`.

## Livello 5: proprietà delle potenze

Una sola base (2, 3, 5 o una frazione con termini fino a 5) e almeno un esponente negativo. Forme:
prodotto (3 su 10), quoziente (3 su 10), potenza di potenza (2 su 10), prodotto seguito da quoziente
(2 su 10). L'esponente finale è al massimo 4 in valore assoluto.

Esempi: `\left(\frac{2}{3}\right)^{2} \cdot \left(\frac{2}{3}\right)^{-5} = \left(\frac{2}{3}\right)^{-3} = \frac{27}{8}`;
`\left(2^{3}\right)^{-1} = \frac{1}{8}`.

## Livello 6: espressioni con le potenze

Circa 6 su 10: prodotto o quoziente di due potenze con basi reciproche (`\frac{3}{5}` e `\frac{5}{3}`)
o opposte (`\frac{2}{3}` e `-\frac{2}{3}`, `-\frac{3}{2}`), con esponente pari sulla base negativa,
come l'esempio 1 della lezione; si porta tutto a una base, poi si usa la proprietà. Esponente finale
da −3 a 3, diverso da 0.

Circa 4 su 10: somma algebrica di tre potenze come l'esempio 4 della lezione, con un esponente 0, un
esponente negativo, una base negativa e un segno meno fuori dalla parentesi (mai `-3^{2}` con base
intera). Ogni termine ha numeratore e denominatore fino a 27, il risultato denominatore fino a 72.

Esempi: `\left(-\frac{3}{2}\right)^{-2} \cdot \left(\frac{2}{3}\right)^{3} = \frac{32}{243}`;
`-\left(\frac{1}{2}\right)^{2} + \left(-\frac{1}{2}\right)^{-2} - \left(-\frac{2}{3}\right)^{0} = \frac{11}{4}`.

## Da evitare

- Numeri enormi: esponenti alti con basi grandi.
- Esercizi in cui la scelta multipla va riempita con numeri a caso: si scarta l'esercizio se gli
  errori tipici non danno tre valori diversi dalla risposta.
- `-3^{2}` con base intera, che molti leggono come `(-3)^{2}`.

## Variante a scelta multipla

Quattro opzioni distinte per valore, una corretta, dagli errori della lezione:

- livello 1: esponente solo al numeratore (`\frac{a^n}{b}`), solo al denominatore, la base non
  elevata, il reciproco, un esponente in più;
- livello 2: il segno opposto, l'esponente solo al numeratore con l'uno o l'altro segno;
- livello 3: il segno opposto, 0, la base (per l'esponente 0); 1, il segno opposto, il reciproco (per
  l'esponente 1);
- livello 4: il risultato negativo ("l'esponente negativo rende negativo"), la potenza senza
  reciproco con l'uno o l'altro segno, base per esponente (`2^{-3} \to -6`);
- livello 5: esponenti moltiplicati invece che sommati, sommati invece che sottratti, sottratti al
  contrario, il reciproco del risultato, il risultato cambiato di segno;
- livello 6: la base reciproca trattata come la stessa base, il segno opposto, il reciproco; nelle
  somme un errore alla volta: `-(\frac{a}{b})^2` preso positivo, `(-\frac{a}{b})^2` preso negativo,
  la potenza con esponente 0 presa come 0, l'esponente negativo che rende negativo, il reciproco
  dimenticato.

## Domande per la revisione

- Il livello 6 mescola due tipi di esercizio (basi reciproche e somme): meglio due livelli separati?
- Al livello 5 serve anche la base negativa, o basta al livello 6?
