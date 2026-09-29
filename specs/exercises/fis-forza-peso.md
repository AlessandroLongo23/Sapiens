# La forza-peso e la massa

Generatore: `fis-forza-peso` (`src/lib/exercises/v2/generators/fis-forza-peso.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_forza_peso.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/17-fis-forza-peso.md` (note in `docs/lezioni/fisica/note/17-fis-forza-peso.md`).

Cinque livelli, ognuno con una difficoltà in più: il peso dalla massa, la massa dal peso letto sul dinamometro, la
massa in grammi, un altro corpo celeste, il passaggio da un corpo celeste a un altro.

## Nomi dei livelli

1. Il peso dalla massa
2. La massa dal dinamometro
3. La massa in grammi
4. Il peso su un altro corpo celeste
5. Da un corpo celeste a un altro

## Tipi di risposta

Risposta `number`, il valore esatto arrotondato a due cifre significative (mezzo in su), in N o in kg. I dati hanno
due cifre significative e $g = 9{,}8$ N/kg ne ha due: il risultato ne ha due, come insegna la lezione "Le cifre
significative". Un dato che darebbe un arrotondamento a metà (per esempio $24{,}5$) si scarta. Oltre $99$ un numero
si scrive in notazione scientifica ($5{,}5 \cdot 10^{2}$ N), come i distrattori grandi. Scelta multipla con l'unità
nell'opzione, i distrattori arrotondati allo stesso modo.

## Regole comuni

- $P = m \cdot g$, $g = 9{,}8$ N/kg sulla Terra; negli altri corpi celesti il $g$ della tabella della lezione,
  scritto nel testo tra parentesi: "(Marte: $g = 3{,}7\,\text{N/kg}$)". Luna $1{,}6$, Marte $3{,}7$, Venere $8{,}9$,
  Giove $23{,}1$, Saturno $9{,}0$, Nettuno $11{,}0$ N/kg (NASA Planetary Fact Sheet, 18 marzo 2025). Mercurio e Urano
  non ci sono: Mercurio ha lo stesso $g$ di Marte.
- Pesi e masse della risposta tra $1$ e $99$ (livelli 4 e 5).
- Passaggi con il valore non arrotondato e poi "$\approx$" con due cifre, come gli esempi della lezione.

## Livello 1: il peso dalla massa

Massa da $1{,}0$ a $9{,}9$ kg, di uno zaino, una cassa, un secchio, una valigia, un pacco, una borsa, un cane, una
bicicletta.

- "Uno zaino ha la massa di $6{,}0$ kg. Quanto pesa sulla Terra?" Risposta $59$ N ($58{,}8$); distrattori $6{,}0$ N
  (la massa presa per il peso), $0{,}61$ N ($m / g$), $5{,}9 \cdot 10^{2}$ N.
- "Un pacco ha la massa di $5{,}6$ kg." Risposta $55$ N.

## Livello 2: la massa dal dinamometro

Scena `dinamometro` con un sacchetto; il testo dice anche la lettura. Quattro scale: $5$ N in $25$ divisioni, $10$ N
in $20$ (letture da $1{,}0$ a $9{,}8$ N, con un decimale), $20$ N in $20$, $50$ N in $25$ (letture intere da $10$ a
$48$ N). La lettura ha sempre due cifre significative.

- "Un sacchetto è appeso al dinamometro della figura, che segna $3{,}5$ N. Qual è la massa del sacchetto?" Risposta
  $0{,}36$ kg; distrattori $34$ kg ($P \cdot g$), $3{,}5$ kg (il peso preso per la massa), $3{,}6 \cdot 10^{2}$ kg (i
  grammi scritti come chilogrammi).
- "… che segna $11$ N." Risposta $1{,}1$ kg.

## Livello 3: la massa in grammi

Massa da $100$ a $990$ g, multipla di $10$.

- "Quanto pesa sulla Terra un oggetto con la massa di $300$ g?" Risposta $2{,}9$ N; distrattori
  $2{,}9 \cdot 10^{3}$ N (i grammi non convertiti, l'avviso della lezione), $0{,}30$ N, $0{,}031$ N.
- "… $560$ g?" Risposta $5{,}5$ N.

## Livello 4: il peso su un altro corpo celeste

Un robot con la massa di due cifre significative (da $1{,}0$ a $99$ kg), scelta in modo che il peso stia tra $1$ e
$99$ N: così i sei corpi celesti escono circa un sesto delle volte ciascuno.

- "Un robot ha la massa di $6{,}4$ kg. Quanto pesa sulla Luna? (Luna: $g = 1{,}6$ N/kg)" Risposta $10$ N;
  distrattori $63$ N (il $g$ della Terra), $4{,}0$ N ($m / g$), $6{,}4$ N.
- "… $3{,}0$ kg … su Giove? (Giove: $g = 23{,}1$ N/kg)" Risposta $69$ N.

## Livello 5: da un corpo celeste a un altro

Una sonda con un peso di due cifre significative su un corpo celeste; si chiede il peso su un altro (la Terra in
circa metà dei casi). Prima la massa, poi il peso, come l'esempio 5 della lezione; il risultato si calcola con la
massa non arrotondata.

- "Una sonda pesa $37$ N su Marte. Quanto pesa sulla Terra? (Marte: $g = 3{,}7$ N/kg)" Risposta $98$ N (la massa
  è $10$ kg). Con $74$ N, come l'esempio 5 della lezione, la risposta sarebbe $2{,}0 \cdot 10^{2}$ N, fuori
  dall'intervallo: il generatore la scarta.
- "Una sonda pesa $61$ N su Giove. Quanto pesa sulla Terra?" Risposta $26$ N; distrattori $61$ N (lo stesso peso),
  $1{,}4 \cdot 10^{2}$ N (il rapporto dei $g$ rovesciato), $2{,}6$ N (la massa presa per il peso).

## Esercizi da evitare

- Arrotondamenti a metà; masse con una o tre cifre significative ai livelli 1, 4, 5.
- Un corpo celeste con lo stesso $g$ di un altro nello stesso esercizio.
- Pesi sopra $99$ N nella risposta dei livelli 4 e 5.

## Verifica

`fis_forza_peso.py` rilegge il testo, controlla che ogni dato abbia due cifre significative, che il $g$ scritto nel
testo sia quello della sua tabella (scritta dalla lezione), calcola il valore esatto con SymPy e lo arrotonda a due
cifre; al livello 2 la lettura del testo deve essere quella della scena, su una tacca di una delle quattro scale.
Poi la risposta, le opzioni (quattro, diverse, arrotondate, scritte con lo spazio sottile), la quota dei casi.

Esito: seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS. `review.mts` e `width.mts` con codice 0.

### Errori piantati

Tutti bocciati: risposta cambiata, opzione giusta spostata, due opzioni uguali, opzione senza lo spazio sottile, un
dato cambiato, la scena del dinamometro cambiata, un $g$ sbagliato nel testo.

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 522 (523), livello 2 68 (68), livello 3 88 (88), livello 4 434 (438), livello 5 901
(909). I livelli 2 e 3 sono stretti per costruzione (le tacche delle scale, le masse multiple di $10$ g).

## Domande per la revisione

- Due cifre significative sempre, anche quando la massa è "$300$ g" (una, due o tre cifre?). Va bene questa scelta?
- Il $g$ degli altri corpi celesti dato nel testo: o si vuole che lo studente usi la tabella della lezione?
- Il livello 2 dà la lettura anche nel testo; si può togliere e far leggere solo la scala (è il livello 1 di `forze`).
