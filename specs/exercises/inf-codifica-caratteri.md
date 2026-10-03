# La codifica dei caratteri: ASCII e Unicode

Generatore: `inf-codifica-caratteri` (`src/lib/exercises/v2/generators/inf-codifica-caratteri.ts`). Verifica
indipendente: `scripts/exercises/checkers/inf_codifica_caratteri.py`. Lezione collegata:
`docs/lezioni/informatica/riscritte/10-inf-codifica-caratteri.md`. Pezzi comuni del capitolo:
`src/lib/exercises/v2/inf-codifica.ts` e `scripts/exercises/checkers/_inf_codifica.py`.

Sei livelli nell'ordine della lezione. Nessun esercizio chiede di sapere a memoria un codice: il codice di partenza
è sempre nel testo.

## Nomi dei livelli

1. Il codice ASCII di un carattere
2. Dal codice al carattere
3. Maiuscole e minuscole
4. Quanti byte occupa un testo
5. Un testo con gli accenti in UTF-8
6. I byte di un carattere in UTF-8

## Regole comuni

- I caratteri si nominano a parole, senza virgolette: "la lettera maiuscola K", "la lettera minuscola k", "la cifra
  7". I messaggi stanno tra virgolette alte doppie (`“…”`), le sole che KaTeX scrive in `\text{}`; il simbolo
  dell'euro e le virgolette basse non passano da KaTeX e non si usano.
- Nei messaggi non ci sono mai due spazi di seguito né spazi all'inizio o alla fine: la pagina li perderebbe.
- Risposta `number` (livelli 1, 3, 4, 5, 6), con le risposte sbagliate in `params.wrong` e l'unità sulle opzioni
  dove serve (`B`, `kB`); risposta `choice` al livello 2.
- In ogni esercizio con i multipli il fattore è nel testo: `$1\,\text{kB} = 1000\,\text{B}$`.

## Livello 1: il codice ASCII di un carattere

Un carattere noto con il suo codice e un altro della stessa famiglia da trovare: due maiuscole (40%), due minuscole
(40%), due cifre (20%). `params.known`, `params.asked`.

Esempi:

1. "Nel codice ASCII la lettera maiuscola K ha codice $75$. Qual è il codice della lettera maiuscola P?"
   $75 + 5 = 80$.
2. "… la cifra 0 ha codice $48$. Qual è il codice della cifra 7?" $55$.

Distrattori: il posto nell'alfabeto (16) o la cifra stessa (7); la differenza presa nel verso sbagliato; il codice
dell'altra forma della lettera ($\pm 32$); sbagliato di uno.

## Livello 2: dal codice al carattere

Il testo ricorda i tre codici di partenza (A 65, a 97, la cifra 0 48) e dà un codice, metà delle volte in base dieci
e metà in binario su 7 bit (`100\,0111_2`). Scelta tra quattro caratteri, scritti "G maiuscola", "g minuscola",
"la cifra 7". `params.code`, `params.binary`.

Esempi:

1. Codice $71$: $71 - 65 = 6$, sei posti dopo la A: G maiuscola.
2. Codice `011\,0101_2 = 53`: $53 - 48 = 5$: la cifra 5.

Distrattori: la stessa lettera nell'altra forma; le lettere vicine; per una cifra, le cifre vicine e la lettera nel
posto corrispondente.

## Livello 3: maiuscole e minuscole

Nota una lettera con il suo codice, si chiede il codice di una lettera dell'altro tipo: la stessa lettera (30%)
oppure un'altra (70%). Metà dalla maiuscola alla minuscola, metà al contrario.

Esempi:

1. "… la lettera maiuscola G ha codice $71$. Qual è il codice della lettera minuscola g?" $71 + 32 = 103$.
2. "… la lettera minuscola d ha codice $100$. Qual è il codice della lettera maiuscola K?" $100 - 32 = 68$,
   $68 + 7 = 75$.

Distrattori: il 32 dimenticato; il 32 nel verso sbagliato; 26 al posto di 32; sbagliato di uno.

## Livello 4: quanti byte occupa un testo

Metà (`frase`): un messaggio in ASCII composto da un saluto, un nome, a volte un'ora e un segno finale
("Buona sera Elena!"); si chiedono i byte, uno per carattere. Metà (`documento`): pagine (da 2 a 120) per righe
(20, 25, 30, 40, 50) per caratteri (50, 60, 70, 80), un byte per carattere; si chiedono i kB.

Esempi:

1. “Ciao Anna” ha 9 caratteri: $9\,\text{B}$.
2. 30 pagine, 40 righe, 60 caratteri: $72\,000\,\text{B} = 72\,\text{kB}$.

Distrattori: gli spazi non contati; nemmeno la punteggiatura; i bit al posto dei byte; il numero delle parole; per
il documento una pagina sola, i bit, la virgola spostata.

## Livello 5: un testo con gli accenti in UTF-8

Un messaggio con da 1 a 4 lettere accentate (sedici frasi per dieci code). Il testo ricorda la regola: 2 byte per le
accentate, 1 per gli altri caratteri. `params.phrase`.

Esempi:

1. “La città è lontana”: 18 caratteri, 2 accentate, $20\,\text{B}$.
2. “Perché no?”: 10 caratteri, 1 accentata, $11\,\text{B}$.

Distrattori: i soli caratteri; due byte in più per ogni accentata; il doppio dei caratteri; gli spazi non contati.

## Livello 6: i byte di un carattere in UTF-8

Un punto di codice in esadecimale (`U+20AC`), da stampabile ASCII fino a U+10FFFF, esclusi i surrogati; un quarto
circa per ognuna delle quattro lunghezze, con i bordi degli intervalli e alcuni caratteri noti più frequenti. La
scelta multipla ha sempre le opzioni 1, 2, 3, 4.

Esempi:

1. U+00E8: tra U+0080 e U+07FF, 2 byte.
2. U+1F600: da U+10000 in poi, 4 byte.

## Esercizi "brutti" da evitare

- chiedere un codice senza darne uno di partenza;
- caratteri di punteggiatura da riconoscere dal codice;
- messaggi con caratteri che KaTeX non scrive (€, «») o con spazi doppi;
- al livello 5 caratteri non ASCII che non siano lettere accentate da 2 byte.

## Domande per la revisione

- Il livello 6 chiede di confrontare numeri esadecimali con i bordi della tabella UTF-8: è adatto a una prima, o va tolto?
- Al livello 4 il documento è in kB con il fattore 1000: aggiungere anche i KiB?
- I caratteri sono nominati a parole ("la lettera maiuscola K"): si legge bene, o meglio le virgolette?
