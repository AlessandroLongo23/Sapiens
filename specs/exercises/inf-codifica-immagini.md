# La codifica delle immagini: pixel e colori

Generatore: `inf-codifica-immagini` (`src/lib/exercises/v2/generators/inf-codifica-immagini.ts`). Verifica
indipendente: `scripts/exercises/checkers/inf_codifica_immagini.py`. Lezione collegata:
`docs/lezioni/informatica/riscritte/11-inf-codifica-immagini.md`. Pezzi comuni del capitolo:
`src/lib/exercises/v2/inf-codifica.ts` e `scripts/exercises/checkers/_inf_codifica.py`.

Sei livelli nell'ordine della lezione. Le misure sono scelte all'indietro, in modo che ogni risultato sia un intero o
un numero con al più due cifre decimali.

## Nomi dei livelli

1. Quanti pixel ha un'immagine
2. Colori e bit per pixel
3. Riconoscere un colore RGB
4. La dimensione in byte
5. La dimensione in kB, MB, KiB, MiB
6. Foto in una memoria e bit per pixel

## Regole comuni

- La risoluzione si scrive `$640 \times 480$`; i numeri da 10 000 in su hanno lo spazio sottile.
- In ogni esercizio con un multiplo del byte il fattore è nel testo: `$1\,\text{kB} = 1000\,\text{B}$`,
  `$1\,\text{MB} = 1\,000\,000\,\text{B}$`, `$1\,\text{KiB} = 1024\,\text{B}$`,
  `$1\,\text{MiB} = 1024 \cdot 1024\,\text{B} = 1\,048\,576\,\text{B}$`, `$1\,\text{GB} = 1000\,\text{MB}$`.
- Le immagini sono sempre "non compresse".
- Risposta `number` (livelli 1, 2, 4, 5, 6), con le risposte sbagliate in `params.wrong` e l'unità sulle opzioni
  (`B`, `kB`, `MB`, `KiB`, `MiB`); risposta `choice` tra nomi di colori al livello 3.

## Livello 1: quanti pixel ha un'immagine

Larghezza da 40 a 1200 (multipli di 20), altezza da 30 a 900 (multipli di 10). Si chiede il prodotto.

Esempi:

1. $220 \times 580$: $127\,600$ pixel.
2. $40 \times 80$: $3200$ pixel.

Distrattori: la somma, il perimetro, il prodotto con uno zero in meno o in più.

## Livello 2: colori e bit per pixel

40% (`colori`): $n$ bit per pixel, con $n$ tra 1, 2, …, 10, 12, 16, 24; quanti colori, $2^n$. 60% (`bit`): un numero
di colori da 2 a 5000 (una volta su tre una potenza di 2 o una potenza di 2 più 1); i bit minimi.

Esempi:

1. $9$ bit: $2^9 = 512$ colori.
2. $100$ colori: $2^6 = 64$ non basta, servono $7$ bit. $257$ colori: $9$ bit.

Distrattori: $2n$, $n^2$, $8n$, la potenza vicina; per i bit uno in meno e uno in più.

## Livello 3: riconoscere un colore RGB

Una terna RGB, in base dieci (60%) o in esadecimale a due cifre (40%), e quattro nomi di colore. Circa 72%: uno dei
sei colori con una o due componenti accese allo stesso livello (da 96 a 255) e le altre a zero: rosso, verde, blu,
giallo, ciano, magenta. Circa 14%: un grigio (tre componenti uguali, tra 32 e 224). Circa 14%: bianco o nero.
`params.rgb`, `params.hex`, `params.case`.

Esempi:

1. R = 160, G = 160, B = 0: giallo.
2. R = 00, G = C0, B = C0 in esadecimale: ciano.

Distrattori: i colori delle singole componenti accese (per il giallo, rosso e verde), poi i colori vicini; per i
grigi, bianco e nero.

## Livello 4: la dimensione in byte

Larghezza da 20 a 800 (multipli di 20), altezza da 10 a 600 (multipli di 10); profondità 8, 16, 24 o 32 bit, una
volta su cinque 1 o 4 bit. Il prodotto dei pixel è sempre multiplo di 8, così i byte sono interi.

Esempi:

1. $140 \times 380$ a 24 bit: $53\,200 \cdot 24 : 8 = 159\,600\,\text{B}$.
2. $800 \times 600$ a 1 bit: $60\,000\,\text{B}$.

Distrattori: i bit (non divisi per 8), i soli pixel, i pixel per 8, i pixel diviso 8.

## Livello 5: la dimensione in kB, MB, KiB, MiB

Un quarto per unità. Con i multipli decimali le misure sono multipli di 50, con quelli binari multipli di 64;
profondità 8, 16, 24 o 32 bit. Si accettano solo i casi con al più due cifre decimali e un risultato tra 0,1 e
10 000.

Esempi:

1. $1024 \times 768$ a 8 bit, in KiB: $786\,432 : 1024 = 768\,\text{KiB}$.
2. $4096 \times 2624$ a 8 bit, in MiB: $10{,}25\,\text{MiB}$.

Distrattori: i bit al posto dei byte, la profondità dimenticata, il multiplo sbagliato (kB per MB), la virgola
spostata. Solo valori con al più tre cifre decimali.

## Livello 6: foto in una memoria e bit per pixel

Metà (`quante foto`): una memoria da 1 a 64 GB e foto a 24 bit con misure da un elenco di quindici, tutte con un
numero intero di MB; si chiede quante foto intere ci stanno (si arrotonda per difetto). Metà (`profondità`): le
misure e i byte di un'immagine, si chiedono i bit per pixel (1, 4, 8, 16, 24, 32).

Esempi:

1. 20 GB, foto $5000 \times 3000$: 45 MB l'una, $20\,000 : 45 = 444{,}4\ldots$, quindi 444 foto.
2. $400 \times 200$ pixel in $240\,000\,\text{B}$: $1\,920\,000 : 80\,000 = 24$ bit per pixel.

Distrattori: l'arrotondamento per eccesso, il 3 dimenticato, i bit confusi con i byte, 1 GB = 1024 MB; per la
profondità i byte per pixel al posto dei bit.

## Esercizi "brutti" da evitare

- dimensioni che non sono un numero intero di byte;
- risultati con più di due cifre decimali;
- colori con componenti accese a livelli diversi (un arancione), che non hanno un nome sicuro;
- componenti accese sotto 96, troppo scure per chiamarle con il nome del colore.

## Domande per la revisione

- Il livello 3 chiede il nome del colore anche per componenti in esadecimale: va bene, o l'esadecimale va tolto?
- Al livello 5 le misure delle immagini sono a volte insolite ($2300 \times 750$) per avere risultati con poche cifre: va bene?
- Al livello 6 si usa 1 GB = 1000 MB: aggiungere una variante con i multipli binari?
