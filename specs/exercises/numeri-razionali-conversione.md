# Numeri decimali e frazioni

Generatore: `numeri-razionali-conversione`
(`src/lib/exercises/v2/generators/numeri-razionali-conversione.ts`). Verifica indipendente:
`scripts/exercises/checkers/numeri_razionali_conversione.py`. Lezione collegata: "Numeri decimali e
frazioni" (`docs/lezioni/riscritte/11-numeri-razionali-conversione.md`).

Lo studente passa da un numero decimale (limitato o periodico) alla frazione ridotta ai minimi
termini, riconosce dal denominatore che tipo di decimale darà una frazione, e scrive una frazione
come numero decimale. I livelli seguono l'ordine della lezione.

## Rappresentazione

Un decimale è `params.decimal = {neg, int, ante, period}`: segno, parte intera, antiperiodo (per un
limitato: tutte le cifre dopo la virgola) e periodo, tutte stringhe di cifre. Si scrive in LaTeX con
la virgola `{,}` e il periodo sotto `\overline{}`: `0{,}41\overline{6}`. Nei livelli 4 e 5
`params.num` e `params.den` sono la frazione mostrata; `params.case` è il tipo di decimale
(`intero`, `limitato`, `periodico semplice`, `periodico misto`).

## Regole comuni

- Virgola decimale, mai il punto; periodo scritto una volta sola, sotto la barra.
- Il decimale mostrato è sempre nella forma più corta: periodo minimo (mai `\overline{33}`), mai
  periodo 9 (la lezione spiega che `0{,}4\overline{9} = 0{,}5`), antiperiodo minimo (mai
  `0{,}1\overline{61}`, che è `0{,}\overline{16}`), limitato senza zeri finali.
- Le risposte numeriche sono frazioni ridotte `p/q` con `q > 0`.

## Livello 1: da decimale limitato a frazione

Da 1 a 3 cifre dopo la virgola, l'ultima diversa da 0; parte intera da 0 a 9; circa 1 su 5
negativo; a volte uno zero subito dopo la virgola (`0{,}08`). La frazione `N/10^k` si riduce sempre
(l'ultima cifra è 2, 4, 5, 6 o 8), così il passo "riduci" c'è sempre. Risposta `number`.

Esempi: `2{,}35 = \frac{235}{100} = \frac{47}{20}`; `-0{,}08 = -\frac{8}{100} = -\frac{2}{25}`.

## Livello 2: da periodico semplice a frazione

Periodo di 1, 2 o 3 cifre (circa 5, 4 e 1 su 10), minimo, né tutto 9 né tutto 0; parte intera da 0
a 9, metà delle volte 0. Si usa la regola della lezione: numero senza virgola e senza barra, meno
quello che viene prima del periodo, fratto tanti 9 quante le cifre del periodo.

Esempi: `0{,}\overline{36} = \frac{36 - 0}{99} = \frac{4}{11}`;
`1{,}\overline{45} = \frac{145 - 1}{99} = \frac{16}{11}`.

## Livello 3: da periodico misto a frazione

Antiperiodo di 1 o 2 cifre, periodo di 1 o 2 cifre, al massimo 3 cifre dopo la virgola in tutto;
l'ultima cifra dell'antiperiodo è diversa dall'ultima del periodo (antiperiodo minimo). Al
denominatore tanti 9 quante le cifre del periodo seguiti da tanti 0 quante le cifre
dell'antiperiodo.

Esempi: `0{,}25\overline{3} = \frac{253 - 25}{900} = \frac{19}{75}`;
`2{,}3\overline{18} = \frac{2318 - 23}{990} = \frac{51}{22}`.

## Livello 4: limitato o periodico, dal denominatore

Una frazione positiva, anche non ridotta, con denominatore fino a 120 e numeratore fino a 200. Lo
studente sceglie tra quattro risposte fisse, sempre nello stesso ordine: un numero intero, un
decimale limitato, un decimale periodico semplice, un decimale periodico misto (risposta `choice`).
Quote: circa 1 su 10 intero, 3 su 10 per ciascuno degli altri tipi. Metà delle frazioni non intere
non è ridotta e il fattore comune nasconde il tipo vero, come nella lezione: `\frac{21}{30}` sembra
periodica ma è `\frac{7}{10}`; `\frac{2}{6}` sembra periodica mista ma è `\frac{1}{3}`. I passaggi
riducono, scompongono il denominatore, concludono e mostrano il decimale per conferma.

Esempi: `\frac{21}{30} = \frac{7}{10}`, `10 = 2 \cdot 5`, limitato (`0{,}7`);
`\frac{5}{12}`, `12 = 2^2 \cdot 3`, periodico misto (`0{,}41\overline{6}`).

## Livello 5: da frazione a decimale

Frazione ridotta con denominatore scelto per tipo: limitati (2, 4, 5, 8, 16, 20, 25, 40, 50, 125),
periodici semplici (3, 9, 11, 27, 33, 37), periodici misti (6, 12, 15, …, 90); numeratore fino al
doppio del denominatore. Il decimale ha al massimo 4 cifre se è limitato; se è periodico, periodo di
al massimo 3 cifre e al massimo 4 cifre scritte dopo la virgola. Quote circa 4, 3, 3 su 10. La
risposta è il numero (`number`, uguale alla frazione); il decimale atteso è in `params.decimal`.
I passaggi prevedono il tipo dal denominatore, poi fanno la divisione mostrando i resti fino a quello
che si ripete, come nell'esempio della lezione.

Esempi: `\frac{3}{8} = 0{,}375`; `\frac{5}{12} = 0{,}41\overline{6}` (il resto 8 si ripete).

## Da evitare

- Periodo 9, periodo non minimo, antiperiodo non minimo, limitato con zeri finali.
- Livello 1 con frazione già ridotta (`0{,}3 = \frac{3}{10}`): manca il passo della riduzione.
- Periodi lunghi al livello 5 (`\frac{1}{7} = 0{,}\overline{142857}`): la scelta multipla diventa un
  confronto di cifre.
- Il punto decimale.

## Variante a scelta multipla

Quattro opzioni distinte per valore, una corretta. Livelli 1-3 (frazioni ridotte), dagli errori
della lezione:

- livello 1: uno zero in meno o in più al denominatore (`\frac{8}{10}` per `0{,}08`), la parte intera
  dimenticata (`2{,}35 \to \frac{35}{100}`), il segno perso, solo il numeratore o solo il denominatore
  diviso per il MCD;
- livello 2: la parte intera non sottratta (`\frac{145}{99}`), il periodico letto come limitato
  (`\frac{145}{100}`), la parte intera persa, un 9 in più;
- livello 3: gli zeri dell'antiperiodo dimenticati (`\frac{15}{9}` per `0{,}1\overline{6}`), tutte le
  cifre prese come periodo (`\frac{16}{99}`), 9 e 0 scambiati, niente sottratto, letto come limitato.

Livello 4: le quattro risposte fisse. Livello 5 (decimali): la barra su tutte le cifre
(`0{,}\overline{416}`), la barra dimenticata (`0{,}416`), la barra una cifra troppo presto
(`0{,}4\overline{16}`), uno zero in più dopo la virgola, la virgola spostata di un posto, la
divisione al contrario. Se non bastano, si sposta l'ultima cifra.

## Domande per la revisione

- Al livello 4 la risposta "un numero intero" va tenuta (1 su 10) o toglie serietà alla domanda?
- Al livello 1 servono anche decimali la cui frazione è già ridotta, come `0{,}3`?
- Il livello 5 dovrebbe avere anche periodi lunghi come `\frac{2}{7}`, magari solo a risposta aperta?
