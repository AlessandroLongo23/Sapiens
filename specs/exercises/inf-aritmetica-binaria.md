# Addizione e moltiplicazione in binario

Generatore: `inf-aritmetica-binaria` (`src/lib/exercises/v2/generators/inf-aritmetica-binaria.ts`).
Verifica indipendente: `scripts/exercises/checkers/inf_aritmetica_binaria.py`. Lezione collegata:
"Addizione e moltiplicazione in binario" (`docs/lezioni/informatica/riscritte/07-inf-aritmetica-binaria.md`).
Aiuti comuni del capitolo: `src/lib/exercises/v2/inf-basi.ts` e `scripts/exercises/checkers/_inf_basi.py`.

Numeri interi senza segno. I livelli seguono la lezione: addizioni con riporti semplici, addizioni con
riporti in catena, il traboccamento in un registro, il prodotto per una potenza di due, il prodotto in
colonna. I due numeri sono estratti per primi; colonne e risposta sono calcolate da loro. Tutte le
risposte sono `choice` (numeri binari). La sottrazione, che la lezione tratta in poche righe, non ha un
livello.

## Scrittura

- Problema: `1011_2 + 110_2` oppure `1011_2 \cdot 101_2`, ogni numero con il pedice 2 e i bit a gruppi
  di quattro. Al livello 3 gli addendi hanno tutti i bit del registro, zeri iniziali compresi
  (`0110_2`).
- L'addizione in colonna dei passaggi è una tabella: una colonna per bit più una per il segno; la prima
  riga porta i riporti in piccolo (`\scriptstyle 1`) sopra la colonna in cui entrano, poi i due addendi,
  la riga, la somma.
- Il prodotto in colonna è una tabella di una colonna allineata a destra: moltiplicando, `\cdot`
  moltiplicatore, riga, una copia per ogni bit 1 del moltiplicatore (dal bit di destra), riga, prodotto.
- Ogni soluzione finisce con il controllo in base dieci.

## Livello 1: addizioni con il riporto

Addendi da 2 a 31 (da 2 a 5 bit). Almeno un riporto, e nessuna colonna in cui due 1 incontrano un
riporto (niente 1 + 1 + 1).

Esempi svolti:

1. `1010_2 + 1101_2 = 1\,0111_2` (10 + 13 = 23): un solo riporto, dall'ultima colonna.
2. `101_2 + 11_2 = 1000_2` (5 + 3 = 8): tre riporti di seguito, ma mai 1 + 1 + 1.

## Livello 2: addizioni con riporti in catena

Addendi da 16 a 255 (da 5 a 8 bit), con almeno una colonna 1 + 1 + 1.

Esempi svolti:

1. `111\,0111_2 + 111\,1011_2 = 1111\,0010_2` (119 + 123 = 242).
2. `1011\,0111_2 + 101\,1101_2 = 1\,0001\,0100_2` (183 + 93 = 276).

## Livello 3: il traboccamento

"Un registro di n bit somma i due numeri senza segno. Che cosa contiene alla fine?", con n = 4 oppure 8.
Addendi da 3 a 15 (da 20 a 255 con 8 bit), con almeno un riporto. Metà delle somme trabocca
(`params.case`: `trabocca`, `non-trabocca`). La risposta dice due cose, su due righe: gli n bit che
restano nel registro e "con traboccamento" o "senza traboccamento". Quando trabocca, la somma che lascia
nel registro tutti zeri compare poco.

Esempi svolti:

1. 4 bit, `1011_2 + 0110_2`: la somma è `1\,0001_2`; restano `0001_2`, con traboccamento (17 - 16 = 1).
2. 8 bit, `0110\,0100_2 + 0011\,0010_2`: `1001\,0110_2`, senza traboccamento (100 + 50 = 150).

## Livello 4: moltiplicare per una potenza di due

Moltiplicando da 5 a 63 con almeno due bit a 1; moltiplicatore `10_2`, `100_2`, `1000_2` o `10000_2`;
prodotto fino a 1023. Il prodotto è il moltiplicando seguito dagli zeri del moltiplicatore.

Esempi svolti:

1. `1011_2 \cdot 100_2 = 10\,1100_2` (11 · 4 = 44).
2. `1\,1110_2 \cdot 10_2 = 11\,1100_2` (30 · 2 = 60).

## Livello 5: moltiplicazioni in colonna

Moltiplicando da 5 a 31 e moltiplicatore da 5 a 15, tutti e due con almeno due bit a 1; prodotto fino a
511. I passaggi elencano le copie spostate, poi la colonna con la somma.

Esempi svolti:

1. `1011_2 \cdot 101_2`: copie 1011 e 101100; somma `11\,0111_2` (11 · 5 = 55).
2. `1101_2 \cdot 1011_2`: copie 1101, 11010, 1101000; somma `1000\,1111_2` (13 · 11 = 143).

## Esercizi "brutti" da evitare

- addizioni senza riporti (basta copiare i bit);
- al livello 1 addizioni con 1 + 1 + 1, che sono il passo in più del livello 2;
- al livello 3 addendi scritti senza gli zeri iniziali: il registro ha tutti i suoi bit;
- al livello 5 un moltiplicatore con un solo 1 (è il livello 4);
- distrattori molto più corti del risultato: si tengono solo quelli con la stessa lunghezza o un bit di
  differenza.

## Variante a scelta multipla

Quattro opzioni distinte anche come valore, una corretta.

- Livelli 1 e 2: nessun riporto (1 + 1 scritto 0); 1 + 1 scritto 1; il riporto di 1 + 1 + 1
  dimenticato; l'ultimo riporto non scritto; un bit sbagliato; numeri vicini.
- Livello 3, se trabocca: gli stessi bit "senza traboccamento"; la somma con un bit in più del registro;
  il registro fermo al massimo (tutti 1); la somma senza riporti. Se non trabocca: la somma giusta "con
  traboccamento" (un riporto preso per traboccamento); la somma senza riporti; un bit sbagliato.
- Livello 4: uno zero in più o in meno; il moltiplicatore sommato invece che moltiplicato; degli 1
  aggiunti al posto degli zeri.
- Livello 5: le copie non spostate; le copie sommate senza riporti; una copia dimenticata; l'ultima
  copia spostata di un posto in meno; numeri vicini.

## Nomi dei livelli

Per `level-names.ts`:

1. Addizioni con il riporto
2. Riporti in catena
3. Il traboccamento
4. Per una potenza di due
5. Moltiplicazioni in colonna

## Domande per la revisione

- Tutte le risposte sono a scelta tra quattro numeri binari: per le addizioni brevi servirebbe la risposta aperta?
- Al livello 3 la risposta è su due righe (i bit e "con traboccamento" o "senza traboccamento"): si legge bene nei bottoni?
- La sottrazione con il prestito non ha un livello, perché la lezione la tratta in poche righe: aggiungerlo?
- Al livello 5 la somma delle copie è mostrata senza i riporti: serve una tabella con i riporti anche lì?
