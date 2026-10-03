# La codifica dei suoni

Generatore: `inf-codifica-suoni` (`src/lib/exercises/v2/generators/inf-codifica-suoni.ts`). Verifica indipendente:
`scripts/exercises/checkers/inf_codifica_suoni.py`. Lezione collegata:
`docs/lezioni/informatica/riscritte/12-inf-codifica-suoni.md`. Pezzi comuni del capitolo:
`src/lib/exercises/v2/inf-codifica.ts` e `scripts/exercises/checkers/_inf_codifica.py`.

Sei livelli nell'ordine della lezione. Le frequenze di campionamento sono quelle d'uso (8, 11,025, 16, 22,05, 32,
44,1, 48 e 96 kHz); le durate sono scelte in modo che ogni risultato sia un intero o abbia al più tre cifre decimali.

## Nomi dei livelli

1. Quanti campioni
2. La regola del campionamento
3. Livelli e bit per campione
4. La dimensione in byte, un canale
5. Stereo, minuti e multipli del byte
6. Bit al secondo e durata in una memoria

## Regole comuni

- Frequenze scritte `$44{,}1\,\text{kHz}$` o `$44\,100\,\text{Hz}$`. Quando la frequenza è in kHz e serve un conto, il
  testo dice `$1\,\text{kHz} = 1000\,\text{Hz}$`.
- In ogni esercizio con un multiplo il fattore è nel testo: `$1\,\text{kB} = 1000\,\text{B}$`,
  `$1\,\text{MB} = 1\,000\,000\,\text{B}$`, `$1\,\text{KiB} = 1024\,\text{B}$`, `$1\,\text{kbit} = 1000\,\text{bit}$`.
- I canali sono scritti per esteso: "mono (1 canale)", "stereo (2 canali)". I suoni sono sempre "non compressi".
- Tutte le risposte sono `number`, con le risposte sbagliate in `params.wrong` e l'unità sulle opzioni (`Hz`, `kHz`,
  `B`, `kB`, `MB`, `KiB`, `kbit/s`, `s`).

## Livello 1: quanti campioni

Una frequenza dell'elenco, in kHz (60%) o in Hz, e una durata da 2 a 120 secondi, su un canale.

Esempi:

1. $8000\,\text{Hz}$ per 9 secondi: $72\,000$ campioni.
2. $11{,}025\,\text{kHz}$ per 76 secondi: $11\,025 \cdot 76 = 837\,900$ campioni.

Distrattori: i kHz non trasformati in Hz ($837{,}9$), il doppio, il prodotto per 8, la divisione.

## Livello 2: la regola del campionamento

Metà (`minima`): un suono con frequenze fino a $f$ (da 100 Hz a 20 kHz), si chiede la frequenza di campionamento
minima, $2f$. Metà (`massima`): una frequenza di campionamento (dell'elenco, senza 11,025 kHz, oppure un multiplo di
200 Hz tra 4 e 96 kHz), si chiede la frequenza più alta registrabile, la metà. La risposta è nella stessa unità del
dato (Hz o kHz, metà e metà).

Esempi:

1. Fino a $3400\,\text{Hz}$: almeno $6800\,\text{Hz}$.
2. Campionamento a $44{,}1\,\text{kHz}$: fino a $22{,}05\,\text{kHz}$.

Distrattori: la metà al posto del doppio (e viceversa), la stessa frequenza, il quadruplo, un quarto.

## Livello 3: livelli e bit per campione

40% (`livelli`): $n$ bit per campione ($n$ tra 2 e 24), quanti livelli. 60% (`bit`): un numero di livelli da 3 a
70 000 (una volta su tre una potenza di 2 o una potenza di 2 più 1), i bit minimi.

Esempi:

1. 12 bit: $4096$ livelli.
2. Almeno 1000 livelli: 10 bit.

## Livello 4: la dimensione in byte, un canale

Frequenza in Hz (da 8000 a 48 000), 8, 16 o 24 bit per campione, da 2 a 60 secondi, un solo canale.

Esempi:

1. $8000\,\text{Hz}$, 8 bit, 59 s: $472\,000\,\text{B}$.
2. $11\,025\,\text{Hz}$, 16 bit, 19 s: $209\,475 \cdot 16 : 8 = 418\,950\,\text{B}$.

Distrattori: i bit non divisi per 8, i soli campioni, il doppio (un canale in più), un solo secondo.

## Livello 5: stereo, minuti e multipli del byte

Mono (30%) o stereo (70%); durata in secondi (da 4 a 240) o in minuti (da 1 a 12), metà e metà; frequenza in kHz;
unità kB, MB o KiB, un terzo ciascuna. Si accettano solo i casi con al più tre cifre decimali e un risultato da 1
in su.

Esempi:

1. 100 s, stereo, 8 kHz, 24 bit: $48\,000 \cdot 100 = 4\,800\,000\,\text{B} = 4800\,\text{kB}$.
2. 1 minuto, stereo, 44,1 kHz, 16 bit: $10{,}584\,\text{MB}$.

Distrattori: i bit al posto dei byte, i canali dimenticati (o contati due volte in mono), i minuti non trasformati
in secondi, il multiplo sbagliato, la virgola spostata.

## Livello 6: bit al secondo e durata in una memoria

Metà (`kbit al secondo`): frequenza, bit per campione e canali; quanti kbit per ogni secondo. Metà (`durata`): una
memoria da 1 a 700 MB; quanti secondi interi ci stanno (arrotondamento per difetto).

Esempi:

1. Stereo, 44,1 kHz, 16 bit: $1\,411\,200$ bit al secondo, $1411{,}2\,\text{kbit/s}$.
2. 410 MB, stereo, 11,025 kHz, 16 bit: $44\,100\,\text{B}$ al secondo, $410\,000\,000 : 44\,100 = 9297{,}05\ldots$,
   quindi $9297\,\text{s}$.

Distrattori: i byte al posto dei bit, i canali dimenticati, l'arrotondamento per eccesso, i minuti.

## Esercizi "brutti" da evitare

- la frequenza più alta registrabile con 11,025 kHz (5512,5 Hz, non intera);
- dimensioni con più di tre cifre decimali;
- MiB e GiB: con le frequenze d'uso quasi mai danno un risultato con poche cifre;
- suoni compressi, di cui la dimensione non si può calcolare.

## Domande per la revisione

- Al livello 2 la regola è applicata come un conto (doppio, metà): serve anche una domanda di concetto, per esempio "questa frequenza di campionamento basta?"
- Al livello 6 il flusso di bit in kbit/s è materia di una prima, o va lasciato al terzo anno?
- Al livello 5 i risultati hanno fino a tre cifre decimali ($10{,}584\,\text{MB}$): va bene?
