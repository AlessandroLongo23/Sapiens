# MCD e MCM in ℕ

Generatore: `numeri-naturali-mcm-mcd` (`src/lib/exercises/v2/generators/numeri-naturali-mcm-mcd.ts`).
Verifica indipendente: `scripts/exercises/checkers/numeri_naturali_mcm_mcd.py` (SymPy: `factorint`,
`gcd`, `lcm`). Lezione collegata: "MCD e MCM in ℕ" (`docs/lezioni/riscritte/07-numeri-naturali-mcm-mcd.md`).

I livelli seguono l'ordine della lezione: criteri di divisibilità, scomposizione, MCD e MCM di due
numeri, di tre numeri, algoritmo di Euclide, problemi. I numeri si costruiscono dalla loro
scomposizione, così restano piccoli e hanno i fattori comuni che l'esercizio richiede. Si scrive
MCD e MCM, come nei titoli del sito, con `\text{MCD}(84, 120)`.

## Rappresentazione

- Livello 1: il problema è il numero; `params.n`, `params.divisor` (quello giusto), `params.options`.
- Livello 2: `params.n`, `params.factors` come coppie base ed esponente; la risposta è
  un'espressione (`2**3*3**2*5`, `form: "factored"`).
- Livelli 3-6: `params.numbers`, `params.which` (`MCD` o `MCM`), `params.value`; al livello 6
  anche `params.story`.

## Livello 1: criteri di divisibilità

Un numero da 100 a 9999 e quattro divisori tra 2, 3, 4, 5, 9, 10, 11, 25; il numero è divisibile
per uno solo dei quattro. Almeno un distrattore è un trabocchetto: 4 per un numero pari non
multiplo di 4, 9 per un multiplo di 3 non multiplo di 9, 25 o 10 per un numero che finisce per 5,
3 per un numero che finisce per 3, 6 o 9 ma non è multiplo di 3. Risposta a scelta.

Esempi svolti:

1. 3414, opzioni 2, 4, 9, 25. Ultima cifra pari: divisibile per 2. Le ultime due cifre, 14, non sono
   multiplo di 4; la somma delle cifre è 12, non multiplo di 9; le ultime due cifre non sono 00, 25,
   50 o 75.
2. 3905, opzioni 3, 10, 11, 25. Da destra, cifre di posto dispari 5 e 9 (somma 14), di posto pari 0
   e 3 (somma 3): 14 − 3 = 11, divisibile per 11.

## Livello 2: scomposizione in fattori primi

Un numero da 48 a 1000, prodotto di 2, 3 o 4 primi tra 2, 3, 5, 7, 11, 13, con almeno tre fattori
contati con la molteplicità e almeno un esponente 2 o più. Passaggi: la colonna delle divisioni
della lezione, poi il prodotto raccolto in potenze.

Esempi svolti:

1. `360 = 2^3 \cdot 3^2 \cdot 5`.
2. `539 = 7^2 \cdot 11`.

## Livello 3: MCD o MCM di due numeri

Due numeri diversi da 12 a 400, nessuno multiplo dell'altro, MCM fino a 3000. Metà degli esercizi
chiede il MCD, metà il MCM. Circa 1 su 10 ha numeri primi tra loro (MCD 1), anche al livello 4.
Passaggi: la scomposizione dei due numeri, i fattori scelti (comuni con l'esponente più piccolo,
oppure tutti con l'esponente più grande), il prodotto.

Esempi svolti:

1. `\text{MCD}(84, 120)`: 84 = 2² · 3 · 7, 120 = 2³ · 3 · 5, fattori comuni con l'esponente più
   piccolo 2² · 3 = 12.
2. `\text{MCM}(30, 20)`: 30 = 2 · 3 · 5, 20 = 2² · 5, tutti i fattori con l'esponente più grande
   2² · 3 · 5 = 60.

## Livello 4: MCD o MCM di tre numeri

Come il livello 3 con tre numeri diversi da 12 a 300, nessuno multiplo di un altro, MCM fino a 3000.

Esempi svolti:

1. `\text{MCM}(24, 18, 30) = 2^3 \cdot 3^2 \cdot 5 = 360`.
2. `\text{MCD}(280, 24, 180) = 2^2 = 4`.

## Livello 5: algoritmo di Euclide

Due numeri `a > b`, `a` fino a 999, `b` almeno 60, con MCD da 2 a 40; l'algoritmo richiede da tre a
sei divisioni. Passaggi: una riga `a = b \cdot q + r` per divisione, poi il divisore dell'ultima.

Esempi svolti:

1. `\text{MCD}(252, 198)`: 252 = 198 · 1 + 54, 198 = 54 · 3 + 36, 54 = 36 · 1 + 18,
   36 = 18 · 2 + 0. MCD = 18.
2. `\text{MCD}(287, 189)`: resti 98, 91, 7, 0. MCD = 7.

## Livello 6: problemi

Metà problemi di MCD, metà di MCM; la domanda dice quale serve, come spiega la lezione.

- MCD: piastrelle quadrate più grandi possibili per un pavimento `a × b` (lato), nastri da tagliare
  in pezzi uguali più lunghi possibile (lunghezza di un pezzo), sacchetti uguali con tutte le
  caramelle e i cioccolatini (numero di sacchetti). Numeri da 20 a 400, MCD almeno 4.
- MCM: due linee di autobus, due fari, due persone in piscina che ripartono o si ritrovano insieme.
  Periodi da 4 a 30, nessuno multiplo dell'altro, MCM fino a 360.

Il testo del problema sta in `prompt` (testo semplice); `problem` riassume i dati in LaTeX senza
dire se serve MCD o MCM.

Esempi svolti:

1. Pavimento 360 cm per 264 cm: MCD(360, 264) = 24, lato 24 cm.
2. Autobus ogni 12 e ogni 18 minuti: MCM(12, 18) = 36, dopo 36 minuti.

## Esercizi "brutti" da evitare

- un numero multiplo dell'altro (MCD e MCM si leggono senza calcolare);
- MCM enormi, oltre 3000 (oltre 360 nei problemi);
- al livello 1, due opzioni che dividono il numero, o nessun trabocchetto;
- al livello 2, numeri primi o prodotti di due soli primi distinti;
- ad Euclide, due o meno divisioni (il MCD si vede subito).

## Variante a scelta multipla

Quattro opzioni distinte, una corretta.

- Livello 2: un fattore composto lasciato nella scomposizione (`2^3 \cdot 9 \cdot 5`), la
  scomposizione interrotta (`2^3 \cdot 45`), un esponente sbagliato di 1, esponenti scambiati.
- Livelli 3 e 4, per il MCD: il MCM; i fattori comuni con l'esponente più grande; tutti i fattori
  con l'esponente più piccolo; con tre numeri il MCD dei primi due; un divisore comune più piccolo.
  Per il MCM: il MCD; il prodotto (con tre numeri il prodotto diviso per il MCD, cioè la formula
  dei due numeri usata con tre); i soli fattori comuni con l'esponente più grande; con tre numeri
  il MCM dei primi due.
- Livello 5: il dividendo dell'ultima divisione, il primo resto, l'ultimo quoziente, un divisore
  comune più piccolo.
- Livello 6: l'altra operazione (MCM al posto del MCD e viceversa), il prodotto, l'altra quantità
  del problema (numero di piastrelle, di pezzi, dolci per sacchetto; per il MCM la somma dei
  periodi).
- Se non bastano, numeri vicini.

## Domande per la revisione

- Al livello 1 va bene chiedere "per quale di questi numeri è divisibile", o meglio "quale di
  questi numeri è divisibile per 9"?
- Al livello 6 il riassunto dei dati in `problem` serve, o basta il testo?
- Serve un livello sui divisori e i multipli (elencare i divisori di 36) prima dei criteri?
