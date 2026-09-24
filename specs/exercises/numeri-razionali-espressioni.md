# Espressioni con frazioni

Generatore: `numeri-razionali-espressioni`
(`src/lib/exercises/v2/generators/numeri-razionali-espressioni.ts`). Verifica indipendente:
`scripts/exercises/checkers/numeri_razionali_espressioni.py`. Lezione collegata: "Espressioni con
frazioni" (`docs/lezioni/riscritte/25-numeri-razionali-espressioni.md`).

Lo studente calcola il valore di un'espressione con numeri razionali. La risposta è un numero
razionale ridotto (`number`, `"p/q"`). I livelli seguono la proposta delle note della lezione
(`docs/lezioni/note/25-numeri-razionali-espressioni.md`), uno per esempio svolto.

## Rappresentazione

`params.expr` è un albero:

- `{t: "n", v}`: un numero razionale `"p/q"` o `"p"`;
- `{t: "d", s}`: un numero decimale scritto come nel testo, `"0,25"`;
- `{t: "pow", b, e}`: potenza, con base un numero o una parentesi, esponente intero;
- `{t: "g", k, x}`: parentesi, `k` = 1 tonda, 2 quadra, 3 graffa;
- `{t: "sum", terms: [{s: ±1, x}]}`: somma algebrica;
- `{t: "ch", items, ops}`: catena di prodotti (`"*"`) e quozienti (`":"`), da sinistra a destra;
- `{t: "fr", n, d}`: frazione di frazioni (la linea principale).

Il testo è scritto dall'albero con le convenzioni della lezione: `\dfrac`, `\cdot` per il prodotto,
`:` per il quoziente, virgola decimale (`0{,}25`), numeri negativi sempre tra parentesi
(`\left(-\dfrac{5}{2}\right)`, `(-3)`), base frazionaria di una potenza tra parentesi, base intera
positiva senza. `params.case` descrive il caso; `params.wrong` sono i valori degli errori tipici, usati
per la scelta multipla.

## Regole comuni

- Ogni valore intermedio (ogni nodo dell'albero) ha numeratore e denominatore al massimo 36; il
  risultato al massimo 30, e non è zero.
- Nessuna parte vale zero; nessun divisore nullo; nessuna parentesi vale 1 o −1.
- Il tipo di parentesi è quello dell'annidamento: tonde dentro, poi quadre, poi graffe. Le parentesi
  attorno a un solo numero (negativo o base di una potenza) non contano.
- Mai fattore 1 o −1, mai lo stesso fattore due volte nella stessa catena, mai una somma di soli
  interi, mai un addendo negativo scritto `+ (-x)`: il segno sta fuori.
- Basi delle potenze con numeratore e denominatore al massimo 5, mai 1 o −1; mai esponente 1;
  esponente 0 solo al livello 3.
- Denominatore comune di ogni somma al massimo 36.
- Nessun `+ -`, `- -`, `+ +` nel testo.

## Livello 1: priorità delle operazioni

Numeri positivi, due operazioni, niente parentesi, risultato positivo. Circa 7 su 10 una somma o
differenza con un prodotto o un quoziente (`a ± b · c`, `b : c ± a`): il prodotto viene prima. Circa
3 su 10 una catena `a : b · c` o `a : b : c`, da fare da sinistra, come l'avvertenza della lezione.

Esempi: `\dfrac{7}{2} + \dfrac{2}{3} \cdot \dfrac{5}{4} = \dfrac{13}{3}`;
`\dfrac{2}{3} : \dfrac{7}{6} \cdot \dfrac{1}{12} = \dfrac{1}{21}`.

## Livello 2: una parentesi e i segni

`a ± (b ± c) op d` oppure `a ± d op (b ± c)`, con una sola tonda che contiene due numeri positivi.
Circa 4 su 10 un meno davanti al prodotto o quoziente con la parentesi (`meno`), 3 su 10 un fattore
negativo `d` (`fattore negativo`), 3 su 10 tutti e due, come l'esempio 2 della lezione (`entrambi`).

Esempi: `\dfrac{5}{2} - \left(\dfrac{5}{9} - \dfrac{1}{4}\right) \cdot 2 = \dfrac{17}{9}`;
`1 - \left(-\dfrac{1}{2}\right) : \left(3 - \dfrac{9}{4}\right) = \dfrac{5}{3}`.

## Livello 3: potenze nell'espressione

Due termini, ciascuno prodotto o quoziente di due fattori, come l'esempio 3 della lezione. I fattori
sono potenze di numeri (almeno tre) o numeri positivi; esponenti tra −2, −1, 2, 3. Almeno una base
negativa con esponente diverso da 0 e almeno un esponente negativo. Circa 3 su 10 hanno un solo
esponente 0 (`esponente zero`), gli altri no (`esponente negativo`). Niente parentesi.

Esempi: `\left(-\dfrac{3}{4}\right)^{-1} \cdot \left(\dfrac{1}{2}\right)^{3} - 2^{-1} \cdot \dfrac{5}{9} = -\dfrac{4}{9}`;
`(-2)^{2} \cdot (-2)^{-1} - 3^{-2} : \left(\dfrac{2}{5}\right)^{0} = -\dfrac{19}{9}`.

## Livello 4: frazioni di frazioni

`\dfrac{a ± b}{c ± d}` con numeri positivi (a volte interi), come l'esempio 4 della lezione.
Numeratore e denominatore si calcolano per conto loro, poi la linea principale è una divisione.

Esempi: `\dfrac{1 + \dfrac{4}{9}}{2 - \dfrac{5}{3}} = \dfrac{13}{3}`;
`\dfrac{\dfrac{1}{4} - 2}{3 + \dfrac{6}{5}} = -\dfrac{5}{12}`.

## Livello 5: decimali ed esponenti negativi

Frazione di frazioni come al livello 4, ma tra i quattro termini c'è almeno un decimale limitato
(0,1; 0,2; 0,25; 0,4; 0,5; 0,6; 0,75; 0,8; 1,2; 1,5; 2,5) e almeno una potenza con esponente −1 o
−2, a volte con base negativa, come l'esempio 5 della lezione. I decimali si scrivono come frazioni al
primo passaggio.

Esempi: `\dfrac{0{,}4 + \left(\dfrac{2}{5}\right)^{-1}}{2 + \dfrac{1}{10}} = \dfrac{29}{21}`;
`\dfrac{\left(-\dfrac{1}{2}\right)^{-1} + 0{,}75}{2 - 1{,}5} = -\dfrac{5}{2}`.

## Livello 6: tonde, quadre e graffe

La forma dell'esempio 6 della lezione:
`\left\{\left[(a ± b)^{m} \text{ op } X^{n} ± c\right] \cdot F ± d\right\} \text{ op' } e`, con
`a ± b = X`: calcolata la tonda, le due potenze hanno la stessa base e si uniscono con le proprietà
(esponenti sommati nel prodotto, sottratti nel quoziente). `m` è 2 o 3, `n` tra −2, −1, 2, 3,
l'esponente finale tra −3 e 3, diverso da 0. `F` è una potenza con esponente negativo o un numero, e
sta prima o dopo la quadra; `e` può essere negativo. Metà prodotto (`prodotto`), metà quoziente
(`quoziente`) tra le due potenze.

Esempi:
`\left\{\left[\left(2 - \dfrac{9}{5}\right)^{2} \cdot \left(\dfrac{1}{5}\right)^{-1} - 2\right] \cdot 2^{-2} + \dfrac{3}{5}\right\} : \left(-\dfrac{3}{10}\right) = -\dfrac{1}{2}`;
`\left\{3 \cdot \left[\left(2 - \dfrac{5}{2}\right)^{2} : \left(-\dfrac{1}{2}\right)^{3} - \dfrac{1}{3}\right] + 1\right\} : \left(-\dfrac{2}{9}\right) = 27`.

## Passaggi

Seguono lo schema della lezione: prima i decimali in frazione, poi la parentesi più interna (tonda,
quadra, graffa) ricopiando il resto, poi numeratore e denominatore di una frazione di frazioni e la
linea principale come divisione. Dentro ogni parte: proprietà delle potenze con la stessa base,
potenze, quozienti trasformati in prodotti per il reciproco, prodotti, segni portati fuori
(`- \left(-\dfrac{3}{2}\right) = + \dfrac{3}{2}`), somma con il denominatore comune. L'ultimo
passaggio termina con il risultato.

## Da evitare

- Numeri grandi a metà strada: si scarta l'esercizio se un valore intermedio supera 36.
- Parentesi che valgono 1 o −1, fattori 1, somme di soli interi (`3 + 2`), lo stesso fattore ripetuto
  (`a : b \cdot b`).
- Esercizi in cui la scelta multipla va riempita con numeri a caso: si scarta l'esercizio se gli
  errori tipici non danno tre valori diversi dalla risposta.

## Variante a scelta multipla

Quattro opzioni distinte per valore, una corretta. Gli errori sono l'espressione stessa calcolata con
uno sbaglio della lezione, nell'ordine:

- livello 1: da sinistra senza priorità (`a + b · c` come `(a + b) · c`, `a : b · c` come
  `a : (b · c)`), quoziente senza reciproco, denominatore comune senza riportare i numeratori,
  numeratori e denominatori sommati tra loro, reciproco del dividendo;
- livello 2: il meno che cambia solo il primo termine della parentesi, poi come al livello 1, e il
  risultato con il segno opposto;
- livello 3: base negativa che tiene il segno qualunque sia l'esponente, esponente negativo senza
  reciproco, `x^0 = 0`, il meno davanti al quoziente perso, priorità, reciproco, `- (-x)` letto `-x`;
- livello 4: linea principale capovolta, numeratore per denominatore, errori nelle somme, segno;
- livello 5: esponente negativo senza reciproco, `- (-x)` letto `-x`, segno della base, linea
  principale capovolta, somme, segno;
- livello 6: esponenti moltiplicati nel prodotto o sottratti al contrario nel quoziente, segno della
  base, esponente negativo, priorità, reciproco, `- (-x)`, segno.

## Domande per la revisione

- Il livello 3 non ha parentesi con somme dentro, per aggiungere una sola difficoltà rispetto al
  livello 2 (le potenze): va bene, o serve anche una tonda come nell'esempio 3?
- Al livello 6 l'esponente finale può essere 1 (`\left(\dfrac{1}{5}\right)^{1}` compare nei
  passaggi): meglio escluderlo?
- Il livello 5 usa solo decimali limitati; i periodici restano alla lezione "Numeri decimali e
  frazioni". Va bene così?
