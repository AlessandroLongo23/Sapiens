# Numeri interi con segno e complemento a due

Generatore: `inf-interi-segno` (`src/lib/exercises/v2/generators/inf-interi-segno.ts`). Verifica indipendente:
`scripts/exercises/checkers/inf_interi_segno.py`. Lezione collegata:
`docs/lezioni/informatica/riscritte/08-inf-interi-segno.md`. Pezzi comuni del capitolo:
`src/lib/exercises/v2/inf-codifica.ts` e `scripts/exercises/checkers/_inf_codifica.py`.

Cinque livelli nell'ordine della lezione. Ogni esercizio è costruito all'indietro dal numero intero di cui parla.

## Nomi dei livelli

1. Leggere modulo e segno
2. Intervallo dei valori e bit necessari
3. Leggere il complemento a due
4. Scrivere in complemento a due
5. Somma e traboccamento

## Regole comuni

- Le sequenze di 8 bit si scrivono in due gruppi di quattro con lo spazio sottile (`1110\,1100`), senza pedice:
  sono bit in una rappresentazione, non numeri in base due. Il pedice 2 compare solo nei passaggi, sul modulo.
- Il testo è in righe `\text{…}`; la sequenza di bit, quando c'è, è una riga a sé sotto il testo.
- Risposta `number` (un intero in base dieci) ai livelli 1, 2, 3 e 5, con tre o più risposte sbagliate in
  `params.wrong` per la scelta multipla; risposta `choice` tra quattro sequenze di bit al livello 4.
- Niente trattini lunghi e niente "piuttosto che".

## Livello 1: leggere modulo e segno

Otto bit in modulo e segno, da leggere in base dieci. Circa 58% negativi (modulo da 1 a 127), 36% positivi, 6% lo
zero negativo `1000\,0000`, che vale 0. Lo zero positivo non si chiede. `params.bits`, `params.case`.

Esempi:

1. `1101\,0000`: MSB 1, modulo `101\,0000_2 = 80`, risposta $-80$.
2. `1000\,0000`: lo zero con il segno meno, risposta $0$.

Distrattori: la lettura senza segno (208), la lettura in complemento a due ($-48$), il modulo senza il segno (80),
$-(127 - m)$; per i positivi $-m$, $m + 128$, $m - 128$.

## Livello 2: intervallo dei valori e bit necessari

Metà degli esercizi (`case` da `min-c2` a `quanti-ms`): con $n$ bit, da 3 a 16, in complemento a due o in modulo e
segno, il numero più piccolo, il più grande, oppure quanti numeri diversi si scrivono ($2^n$ in complemento a due,
$2^n - 1$ in modulo e segno, per i due zeri). L'altra metà (`bit-minimi`): quanti bit servono come minimo per
scrivere $x$ in complemento a due, con $5 \le |x| \le 2000$; tre volte su dieci $x$ è un caso al bordo
(127, 128, $-128$, $-129$, 255, 256, 1023, 1024 e simili).

Esempi:

1. "Qual è il numero più piccolo che si può scrivere con $6$ bit in complemento a due?" Risposta $-2^5 = -32$.
2. "Quanti bit servono, come minimo, per scrivere $-129$ in complemento a due?" Con 8 bit si arriva a $-128$:
   servono 9 bit.

Distrattori: $2^n$ al posto di $2^{n-1}$, il bordo dell'altra rappresentazione ($-127$ per $-128$), $2^n - 1$ per
$2^n$; per i bit, uno in meno (il bit di segno dimenticato) e uno in più.

## Livello 3: leggere il complemento a due

Otto bit in complemento a due, da leggere in base dieci. Circa 3 su 4 negativi (da $-128$ a $-1$), gli altri
positivi (da 1 a 127). `params.bits`.

Esempi:

1. `1101\,0000`: inverti e somma 1, `0011\,0000 = 48`, risposta $-48$ (con i pesi: $-128 + 80$).
2. `0101\,1010`: MSB 0, si legge in binario, risposta $90$.

Distrattori: la lettura senza segno, la lettura in modulo e segno, il risultato senza il "$+1$" (sbagliato di uno),
il numero con il segno cambiato.

## Livello 4: scrivere in complemento a due

Circa 65%: un numero da $-128$ a $127$, diverso da zero, da scrivere su 8 bit (4 su 5 negativi). Circa 35%
(`opposto`): una sequenza di 8 bit, da trovare la sequenza dell'opposto; mai $-128$, che non ha l'opposto, e mai 0.
Risposta a scelta tra quattro sequenze.

Esempi:

1. "Come si scrive $-20$ in complemento a due su 8 bit?" `0001\,0100`, invertito `1110\,1011`, più 1:
   `1110\,1100`.
2. L'opposto di `0010\,0000`: invertito `1101\,1111`, più 1: `1110\,0000`.

Distrattori: il modulo e segno (`1001\,0100`), i bit invertiti senza sommare 1, il numero positivo, la sequenza
sbagliata di uno; per l'opposto anche il solo MSB cambiato.

## Livello 5: somma e traboccamento

Due addendi $a$ e $b$ da $-128$ a $127$, diversi da zero. Si chiede il numero che resta negli 8 bit. Circa 40% senza
traboccamento (`senza`, addendi tra $-120$ e $120$, non opposti), 30% con la somma oltre 127 (`oltre il massimo`,
due positivi), 30% sotto $-128$ (`sotto il minimo`, due negativi).

Esempi:

1. $100 + 50$: la somma vera è 150, fuori dall'intervallo; $150 - 256 = -106$.
2. $30 + (-48) = -18$: nell'intervallo, nessun traboccamento.

Distrattori: la somma vera quando c'è traboccamento, la somma spostata di 128, il risultato con il segno
cambiato, 127 o $-128$ (il bordo); senza traboccamento, la somma spostata di 256 e $a - b$.

## Esercizi "brutti" da evitare

- lo zero positivo al livello 1 e lo zero ai livelli 3 e 4;
- l'opposto di $-128$;
- al livello 5 addendi nulli o opposti, e traboccamenti con addendi di segno diverso (impossibili).

## Domande per la revisione

- Al livello 5 si chiede il numero sbagliato che resta negli 8 bit quando c'è traboccamento: è la domanda giusta, o meglio chiedere solo "c'è traboccamento, sì o no"?
- Il livello 2 mescola l'intervallo di $n$ bit e i bit necessari per un numero: va bene come un solo livello?
- Le sequenze di bit sono scritte senza il pedice 2: va bene?
