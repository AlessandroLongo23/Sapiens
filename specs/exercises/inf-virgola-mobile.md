# Numeri reali in virgola mobile

Generatore: `inf-virgola-mobile` (`src/lib/exercises/v2/generators/inf-virgola-mobile.ts`). Verifica indipendente:
`scripts/exercises/checkers/inf_virgola_mobile.py`. Lezione collegata:
`docs/lezioni/informatica/riscritte/09-inf-virgola-mobile.md`. Pezzi comuni del capitolo:
`src/lib/exercises/v2/inf-codifica.ts` e `scripts/exercises/checkers/_inf_codifica.py`.

Cinque livelli nell'ordine della lezione. I numeri sono costruiti all'indietro dalle loro cifre binarie, così ogni
scrittura è finita e ogni valore è una frazione esatta.

## Nomi dei livelli

1. Dal binario con la virgola al decimale
2. Dal decimale al binario con la virgola
3. Numeri esatti e numeri arrotondati
4. L'esponente in base due
5. Il campo dell'esponente a 32 bit

## Regole comuni

- I numeri binari portano il pedice 2 e la virgola decimale: `101{,}011_2`. Niente raggruppamento a quattro delle
  cifre, che qui sono al più dieci.
- Il testo è in righe `\text{…}`; il numero binario o la formula stanno su una riga a sé.
- Risposta `number` ai livelli 1, 4 e 5 (al livello 1 una frazione esatta, mostrata come numero decimale), con le
  risposte sbagliate in `params.wrong`; risposta `choice` ai livelli 2 e 3.

## Livello 1: dal binario con la virgola al decimale

Parte intera da 0 a 15 (una volta su quattro 0), da 1 a 4 cifre dopo la virgola, l'ultima uguale a 1. Si chiede il
valore in base dieci. `params.bin` è il numero con il punto (`101.011`).

Esempi:

1. `101{,}011_2`: $5 + \frac{1}{4} + \frac{1}{8} = 5{,}375$.
2. `0{,}1_2`: $\frac{1}{2} = 0{,}5$.

Distrattori: le cifre dopo la virgola lette come un intero ($5{,}3$); i pesi che partono da 1 al posto di
$\frac{1}{2}$ ($5{,}75$); le cifre copiate ($5{,}011$); i pesi che partono da $\frac{1}{4}$; le cifre lette al
contrario.

## Livello 2: dal decimale al binario con la virgola

Gli stessi numeri, dati in base dieci (al più quattro cifre decimali). Scelta tra quattro scritture binarie.
`params.value` è la frazione.

Esempi:

1. $0{,}375$: $0{,}75 \to 0$, $1{,}5 \to 1$, $1 \to 1$, quindi `0{,}011_2`.
2. $6{,}75$: `110{,}11_2`.

Distrattori: le cifre al contrario; le cifre decimali dopo la virgola convertite come un intero ($0{,}375 \to$
`0{,}101110111_2`); uno zero in più dopo la virgola; la prima cifra saltata; la parte intera sbagliata di uno.
Nessun distrattore ha il valore giusto scritto in un altro modo (il controllo lo verifica).

## Livello 3: numeri esatti e numeri arrotondati

Quattro numeri decimali tra 0 e 13, non interi. Metà degli esercizi (`finito`): quale si scrive in base due con un
numero finito di cifre (uno solo, gli altri tre no). L'altra metà (`infinito`): quale ha infinite cifre e viene
arrotondato (uno solo). I numeri finiti hanno parte dopo la virgola $\frac{k}{16}$, $\frac{k}{8}$, $\frac{k}{4}$ o
$\frac{1}{2}$; gli altri sono centesimi il cui denominatore ridotto contiene il fattore 5 ($0{,}1$, $0{,}35$,
$0{,}04$). La parte intera è 0 una volta su due, altrimenti da 1 a 12.

Esempi:

1. Finito tra $0{,}1$, $0{,}375$, $0{,}6$, $2{,}2$: $0{,}375 = \frac{3}{8}$.
2. Infinito tra $0{,}5$, $3{,}25$, $0{,}7$, $1{,}125$: $0{,}7 = \frac{7}{10}$.

## Livello 4: l'esponente in base due

Una mantissa di 2-6 cifre che comincia e finisce con 1 e un esponente da $-6$ a 7, diverso da 0. Il problema mostra
il numero scritto per esteso uguale alla mantissa per $2^n$ e chiede $n$.

Esempi:

1. `1101{,}01_2 = 1{,}10101_2 \cdot 2^{n}`: $n = 3$.
2. `0{,}00101_2 = 1{,}01_2 \cdot 2^{n}`: $n = -3$.

Distrattori: il segno sbagliato; le cifre prima della virgola o gli zeri dopo la virgola contati al posto degli
spostamenti (sbagliato di uno); i due errori insieme.

## Livello 5: il campo dell'esponente a 32 bit

Un numero binario come al livello 4, con segno (metà negativi), senza la forma normalizzata. Si chiede il numero che
va nel campo dell'esponente del formato a 32 bit: l'esponente vero più 127.

Esempi:

1. `-110{,}1_2 = -1{,}101_2 \cdot 2^2`: $2 + 127 = 129$.
2. `0{,}0000011_2 = 1{,}1_2 \cdot 2^{-6}`: $-6 + 127 = 121$.

Distrattori: l'esponente vero; $127 - e$; $e + 128$ e $e + 126$; 127.

## Esercizi "brutti" da evitare

- numeri con un'ultima cifra 0 dopo la virgola (`1{,}10_2`) o con zeri iniziali;
- al livello 2 due opzioni con lo stesso valore;
- esponente 0 ai livelli 4 e 5;
- numeri decimali con più di quattro cifre dopo la virgola.

## Domande per la revisione

- Al livello 5 si chiede solo il campo dell'esponente, in base dieci: serve anche un esercizio sui 32 bit completi (segno, esponente, mantissa)?
- Il livello 3 usa la regola del denominatore potenza di 2: è alla portata di una prima?
- Al livello 4 la mantissa è mostrata e si chiede solo l'esponente: va bene, o meglio far scegliere tutta la forma normalizzata?
