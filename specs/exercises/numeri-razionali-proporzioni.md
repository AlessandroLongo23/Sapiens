# Rapporti, proporzioni e percentuali

Generatore: `numeri-razionali-proporzioni`
(`src/lib/exercises/v2/generators/numeri-razionali-proporzioni.ts`). Verifica indipendente:
`scripts/exercises/checkers/numeri_razionali_proporzioni.py`. Lezione collegata: "Rapporti,
proporzioni e percentuali" (`docs/lezioni/riscritte/26-numeri-razionali-proporzioni.md`).

Lo studente calcola un rapporto, il termine incognito di una proporzione, una percentuale, un
aumento o uno sconto, due variazioni una dopo l'altra, e risolve problemi a parole con una
proporzione. La risposta è sempre un numero razionale
esatto (`answer.kind = number`); la scelta multipla ha quattro opzioni, scritte come le scrive la
lezione: frazione ridotta, numero decimale con la virgola, prezzo in euro, percentuale, oppure
"aumento del …" / "diminuzione del …".

## Rappresentazione

- Livelli 1-3: il testo è una formula (`15 : 35`, `x : 12 = 5 : 4`). `params.a`, `params.b` per il
  rapporto; `params.terms` (quattro stringhe, `"x"` al posto dell'incognita), `params.forms`
  (`int`, `frac`, `dec`) e `params.pos` per la proporzione.
- Livelli 4-6: problemi brevi in parole, tutti nel `prompt`; `problem` è vuoto. I numeri del
  problema sono anche in `params` (`p`, `T`, `P`, `dir`, `V`, `W`, `changes`).
- Livello 7: problemi a parole di due o tre frasi. Il testo sta nel `problem` come righe
  `\text{...}` (con `textBlock`, la pagina lo mostra come paragrafo), il `prompt` è "Risolvi il
  problema.". `params.story` dice la storia; i numeri sono in `params` (`q1`, `q2`, `v1` per le
  grandezze proporzionali, `S` con `d` o `D` per le scale, `T`, `p`, `q`, `ask` per le parti) insieme
  ai nomi (`who`, `who2`, `item`, `unit`, `gender`): il testo si ricostruisce tutto dai params.
- `params.case` dice il caso, `params.show` come si scrivono le opzioni, `params.wrong` gli errori
  tipici da cui vengono le opzioni sbagliate.

## Regole comuni

- Virgola decimale (`1{,}5`), `\%` nelle formule, `€` solo nel testo, mai nelle formule (KaTeX non
  ha il glifo): le opzioni in euro sono numeri, e la domanda dice "in euro".
- Prezzi al centesimo: un prezzo non intero si scrive con due decimali (`57{,}60`).
- Nelle proporzioni i termini negativi stanno tra parentesi, `(-3) : x = 9 : (-12)`, come
  nell'esempio 3 della lezione.
- Nessun termine nullo; la risposta non è mai uguale a un'opzione sbagliata.

## Livello 1: rapporto tra due numeri

"Calcola il rapporto tra `a` e `b`, ridotto ai minimi termini". `a` e `b` interi positivi fino a
150, con MCD almeno 2, così la frazione va ridotta; il rapporto non è intero. Circa 3 su 10 sono
maggiori di 1.

Esempi: `18 : 45 = \frac{2}{5}`; `26 : 20 = \frac{13}{10}`.

## Livello 2: termine incognito con interi

`a : b = c : d` con interi positivi fino a 100, rapporto diverso da 1, risultato intero diverso da
1; la `x` sta in una posizione qualsiasi, metà delle volte un estremo e metà un medio. Si costruisce
all'indietro da un rapporto ridotto `p/r` e due moltiplicatori diversi.

Esempi: `x : 12 = 5 : 4`, `x = 15`; `7 : x = 21 : 9`, `x = 3`.

## Livello 3: frazioni, decimali o negativi

Un terzo per caso.

- Frazioni: almeno due dei tre termini dati sono frazioni positive non intere (denominatori da 2 a
  9); il risultato ha denominatore fino a 12 e numeratore fino a 40.
- Decimali: termini positivi con al massimo una cifra decimale, fino a 50, almeno due dei tre dati
  non interi; il risultato ha al massimo una cifra decimale e si scrive con la virgola.
- Negativi: interi fino a 60 in valore assoluto, almeno un termine dato negativo; il risultato è
  intero e può essere negativo.

Esempi: `\frac{2}{3} : x = \frac{4}{5} : \frac{6}{7}`, `x = \frac{5}{7}`;
`0{,}4 : 1{,}2 = x : 4{,}5`, `x = 1{,}5`; `(-3) : x = 9 : (-12)`, `x = 4`.

## Livello 4: percentuali

Un terzo per ognuna delle tre domande della lezione, con risultato positivo e al massimo un
decimale.

- La parte: "Quanto è il 15% di 80?" (12). Percentuali della lista della lezione, anche 120% e
  150%; totale fino a 500.
- La percentuale: "Che percentuale di 24 è 18?" (75%). La parte è minore del totale; può uscire
  37,5%.
- Il totale: "Il 30% di un numero è 12. Qual è il numero?" (40). Totale intero fino a 500.

## Livello 5: aumento o sconto

Un terzo per caso; aumento o sconto a caso, percentuali da 5 a 50.

- Avanti: "Un articolo da 80 € è scontato del 15%. Quanto costa dopo lo sconto, in euro?" (68).
- Indietro: "Dopo uno sconto del 20% un articolo costa 48 €. Quanto costava prima, in euro?" (60).
  Il prezzo di prima è intero, quello dopo è al centesimo.
- Variazione: "Un prezzo passa da 40 € a 46 €. Di quale percentuale è cambiato?" (aumento del 15%).
  Variazione intera, non nulla, fino al 40%; il segno meno è una diminuzione, come nella lezione.

## Livello 6: variazioni successive

- Prezzo finale (2 su 5): "Un prezzo di 100 € scende del 20% e poi scende del 10%. Quanto diventa,
  in euro?" (72). Si moltiplicano i coefficienti.
- Variazione totale (2 su 5): "Un prezzo aumenta del 20% e poi scende del 20%. Di quale percentuale
  è cambiato in tutto?" (diminuzione del 4%). Mai nulla; al massimo un decimale.
- Annullare (1 su 5): "Un prezzo aumenta del 25%. Di quale percentuale deve cambiare per tornare al
  valore iniziale?" (diminuzione del 20%). Solo le percentuali che danno un risultato con al
  massimo un decimale: aumenti del 25, 60, 100, 150, 300%, sconti del 20, 50, 60, 75, 80%.

## Livello 7: problemi con le proporzioni

Segue la sezione "Problemi con le proporzioni" della lezione e i suoi quattro esempi. Metà dei
problemi hanno due grandezze direttamente proporzionali, un quarto una scala, un quarto un totale da
dividere in parti proporzionali. Dieci storie, con nomi italiani:

- Grandezze direttamente proporzionali (`diretta`), `q1 : q2 = v1 : x` come negli esempi 1 e 2:
  - `ricetta`: persone e grammi di farina o zucchero, o millilitri di latte (da 2 a 8 persone, poi da
    2 a 12); la quantità per persona è intera, quindi anche la risposta.
  - `spesa`: chili di mele, arance, pomodori o patate e prezzo al mercato; prezzo al chilo al
    centesimo (da 0,90 a 3,20 euro), risposta al centesimo.
  - `benzina`: litri e chilometri dell'auto di una famiglia, da 12 a 20 km con un litro.
  - `bici`: chilometri e minuti a velocità costante, da 2 a 4 minuti al chilometro.
  - `stampante`: minuti e pagine della stampante della segreteria, da 12 a 30 pagine al minuto.
- Scale (`scala`), come l'esempio 3: `cartina` (dalla carta alla realtà, da 2 a 20 cm, risposta in
  km con al massimo due decimali e fino a 20 km) e `sentiero` (dalla realtà alla carta, da 0,5 a 10
  km, risposta in cm con al massimo un decimale, da 2 a 40 cm). Scale 1 : 10 000, 20 000, 25 000,
  50 000 e 100 000 (quest'ultima solo dalla carta alla realtà). La scala si scrive `$1 : 25\,000$`.
- Parti proporzionali (`parti`), come l'esempio 4: `regalo` (i nonni dividono da 40 a 400 euro tra
  due nipoti), `classe` (da 18 a 30 studenti, ragazzi e ragazze), `bibita` (sciroppo e acqua nel
  rapporto 1 : q o 2 : q, da 250 a 1500 ml). Rapporto ridotto e diverso da 1, totale divisibile per
  la somma dei termini, ogni parte almeno 2; si chiede l'una o l'altra quota.

Vincoli: persone, pagine, minuti, grammi e millilitri interi; prezzi al centesimo; la risposta è
positiva e non è un numero già scritto nel testo (nemmeno l'1 della scala); una sola domanda, alla
fine. Il testo non nomina luoghi veri: rifugi, sentieri e paesi sono generici.

Esempi: "Per un dolce per 6 persone la ricetta della nonna di Sofia chiede 120 g di zucchero.
Quanti grammi di zucchero servono per 4 persone?" (`6 : 4 = 120 : x`, 80 g); "I nonni regalano 105
euro a Luca e Matteo, da dividere in modo che le quote di Luca e di Matteo stiano nel rapporto
4 : 1. Quanti euro riceve Matteo?" (21 euro); "Su una cartina dei sentieri in scala 1 : 25 000 due
rifugi distano 18 cm. Quanti km distano nella realtà?" (`450\,000` cm, 4,5 km).

## Da evitare

- Rapporti già ridotti al livello 1, proporzioni con rapporto 1 o `x = 1` al livello 2.
- Percentuali o prezzi con decimali periodici; prezzi con più di due decimali.
- Opzioni negative dove la risposta è positiva, tranne nel caso con i negativi e nelle variazioni.

## Variante a scelta multipla

Quattro opzioni diverse per valore, dagli errori della lezione, poi valori vicini se non bastano.

- Livello 1: antecedente e conseguente scambiati, la parte sul totale (`\frac{p}{p+q}`), riduzione
  del solo numeratore o del solo denominatore.
- Livelli 2-3: la `x` accoppiata con un termine dell'altra coppia (i due modi), la stessa differenza
  al posto dello stesso rapporto, il reciproco; con i negativi anche il segno opposto.
- Livello 4: la parte senza dividere per 100, la virgola spostata di un posto solo, il totale diviso
  per la percentuale; la percentuale capovolta (`T/P · 100`) o non moltiplicata per 100; il totale
  preso come percentuale della parte (l'avviso della lezione, 3,6 invece di 40).
- Livello 5: solo lo sconto o l'aumento, la variazione nel verso sbagliato, la percentuale tolta come
  numero; all'indietro, la percentuale del prezzo nuovo aggiunta o tolta (57,60 invece di 60); nella
  variazione, il segno opposto, la differenza divisa per il valore finale, la differenza letta come
  percentuale.
- Livello 6: le percentuali sommate (l'avviso della lezione), una sola delle due variazioni, il
  segno opposto; per annullare, la stessa percentuale nel verso opposto.
- Livello 7, grandezze proporzionali: la proporzione inversa (`q1 · v1 / q2`, l'avviso della lezione
  sulle grandezze non direttamente proporzionali), la stessa differenza al posto dello stesso
  rapporto, il valore per una unità (risposta a una domanda diversa: il prezzo al chilo, i minuti al
  chilometro), il prodotto non diviso, il dato del testo sommato alla risposta (usato due volte).
  Scale: centimetri e chilometri convertiti con 1000, 10 000 o un milione al posto di 100 000, la
  scala divisa per la distanza. Parti: l'altra quota (domanda diversa), una parte sola, il totale
  preso come l'altra quota (`x : T = k : altro`), metà del totale. Dove la risposta è un conteggio
  intero, le opzioni sbagliate sono intere anche loro.

## Domande per la revisione

- Il livello 7 mescola tre tipi di problema (grandezze proporzionali, scale, parti): va bene come
  livello unico, o è meglio dividerlo in due (proporzionalità e scale, parti proporzionali)?
- Al livello 7 le opzioni hanno il numero senza unità (la domanda dice "in km", "in euro", "quanti
  grammi"): basta, o va aggiunta l'unità alle opzioni?
- Nessun problema con grandezze inversamente proporzionali: la lezione le cita solo come avviso e
  le rimanda a "Proporzionalità diretta e inversa". Va bene lasciarle fuori?
- Al livello 1 va aggiunto il rapporto tra grandezze con unità diverse (45 cm e 3 m)?
- I livelli 4-6 hanno il testo solo nel prompt, senza formula: nella pagina si legge bene?
