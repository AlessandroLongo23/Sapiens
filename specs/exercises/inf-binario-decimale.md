# Conversioni tra binario e decimale

Generatore: `inf-binario-decimale` (`src/lib/exercises/v2/generators/inf-binario-decimale.ts`).
Verifica indipendente: `scripts/exercises/checkers/inf_binario_decimale.py`. Lezione collegata:
"Conversioni tra binario e decimale" (`docs/lezioni/informatica/riscritte/05-inf-binario-decimale.md`).
Aiuti comuni del capitolo: `src/lib/exercises/v2/inf-basi.ts` e `scripts/exercises/checkers/_inf_basi.py`.

Solo numeri interi senza segno, fino a 10 bit (1023). I livelli seguono la lezione: da binario a
decimale con i pesi, da decimale a binario con le divisioni successive e con le potenze di due, quanti
bit servono. Il numero è estratto per primo; le due scritture vengono da lui.

## Scrittura

- Binario con il pedice 2 e i bit a gruppi di quattro da destra (`1100\,1010_2`); decimale senza pedice
  nel testo, con `_{10}` nella soluzione dove compaiono le due basi.
- Da binario a decimale la risposta è `number`. Da decimale a binario è `choice`: quattro numeri binari
  diversi tra loro anche come valore (due scritture che differiscono per gli zeri iniziali non possono
  stare insieme), senza zeri iniziali.

## Livello 1: da binario a decimale, fino a 7 bit

Numeri da 8 a 127 (da 4 a 7 bit), con almeno due bit a 1. I numeri fatti solo di 1 (15, 31, 63, 127)
compaiono, ma la metà viene scartata. Passaggi: la tabella dei pesi sopra i bit, poi la somma dei pesi
dei bit a 1. `params.bits`, `params.value`.

Esempi svolti:

1. `1011_2`: pesi 8, 4, 2, 1; 8 + 2 + 1 = 11.
2. `110\,0101_2`: 64 + 32 + 4 + 1 = 101.

## Livello 2: da binario a decimale, fino a 10 bit

Come il livello 1, con numeri da 128 a 1023 (da 8 a 10 bit).

Esempi svolti:

1. `1100\,1010_2 = 128 + 64 + 8 + 2 = 202`.
2. `10\,0000\,0001_2 = 512 + 1 = 513`.

## Livello 3: da decimale a binario con le divisioni

Numeri da 8 a 127. Le potenze di due compaiono poco (8 su 10 scartate). Passaggi: la tabella delle
divisioni successive per 2 (divisione, quoziente, resto) fino al quoziente 0; i resti letti dal basso; il
controllo con i pesi.

Esempi svolti:

1. `46`: resti 0, 1, 1, 1, 0, 1; dal basso `10\,1110_2`; controllo 32 + 8 + 4 + 2 = 46.
2. `13`: resti 1, 0, 1, 1; dal basso `1101_2`.

## Livello 4: da decimale a binario, numeri grandi

Numeri da 128 a 1023. Stessa domanda del livello 3, ma i passaggi usano il secondo metodo della lezione:
la più grande potenza di due che non supera il numero, poi "sì, resta ..." o "no" per ogni potenza fino a
1, un bit per ogni potenza, il controllo con i pesi.

Esempi svolti:

1. `200`: 128 sì, resta 72; 64 sì, resta 8; 32 no; 16 no; 8 sì, resta 0; 4, 2, 1 no: `1100\,1000_2`.
2. `1000 = 512 + 256 + 128 + 64 + 32 + 8 = 11\,1110\,1000_2`.

## Livello 5: quanti bit servono

Tre domande, risposta `number`, `params.case`:

- `bit-necessari` (circa 60%): "Quanti bit servono, come minimo, per scrivere il numero in binario?", per
  un numero da 5 a 1023; 4 volte su 10 il numero è una potenza di due da 8 a 512 o un suo vicino (più o
  meno 1), dove si sbaglia: 255 chiede 8 bit, 256 ne chiede 9;
- `massimo` (circa 20%): il numero più grande che si scrive con n bit, n da 2 a 10: 2^n - 1;
- `quanti` (circa 20%): quanti numeri diversi si scrivono con n bit: 2^n.

Esempi svolti:

1. `256`: con 8 bit si arriva a 255, non bastano; servono 9 bit.
2. `8 bit`, il più grande: `1111\,1111_2 = 2^8 - 1 = 255`.

## Esercizi "brutti" da evitare

- numeri binari con un solo 1 ai livelli 1 e 2 (si leggono senza sommare);
- numeri di 3 bit o meno: troppo pochi per fare un livello;
- opzioni che sono lo stesso numero scritto con zeri iniziali;
- distrattori molto più corti del risultato, che si scartano a colpo d'occhio: il numero letto al
  contrario si usa solo se è dispari (altrimenti perde cifre), quello senza l'ultimo resto solo se il
  secondo bit è 1.

## Variante a scelta multipla

Quattro opzioni distinte, una corretta.

- Livelli 1 e 2: i pesi dati da sinistra (il numero letto al contrario); i pesi che partono da 2 (il
  doppio); l'ultimo 1 dimenticato; le posizioni sommate al posto dei pesi; il primo peso sbagliato di un
  posto; numeri vicini.
- Livelli 3 e 4: i resti letti dall'alto; l'ultima divisione dimenticata (manca l'MSB); un bit
  sbagliato; il numero vicino, il doppio, la metà.
- Livello 5: un bit in meno (256 "sta" in 8 bit), un bit in più, il numero delle cifre decimali, il
  numero degli 1; per il massimo 2^n, 2^(n-1), 2n; per la quantità 2^n - 1, 2n, n^2.

## Nomi dei livelli

Per `level-names.ts`:

1. Da binario a decimale
2. Binario fino a 10 bit
3. Da decimale a binario
4. Decimale fino a 1023
5. Quanti bit servono

## Domande per la revisione

- I livelli 3 e 4 fanno la stessa domanda con numeri più grandi, e nei passaggi mostrano due metodi diversi (divisioni, potenze di due): va bene, o lo studente deve poter scegliere il metodo della soluzione?
- Da decimale a binario la risposta è a scelta tra quattro numeri binari: è la regola del lotto per le risposte che sono cifre in un'altra base. Servirà anche la risposta aperta?
- Il livello 5 ha solo 9 domande diverse sul massimo e 9 sulla quantità (n da 2 a 10): bastano?
- Il limite è 10 bit: alzarlo a 12 o 16 per gli ultimi livelli?
