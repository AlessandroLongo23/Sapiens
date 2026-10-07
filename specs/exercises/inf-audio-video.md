# Audio e video digitali

Generatore: `inf-audio-video` (`src/lib/exercises/v2/generators/inf-audio-video.ts`). Verifica indipendente:
`scripts/exercises/checkers/inf_audio_video.py`. Lezione collegata:
`docs/lezioni/informatica/riscritte/85-inf-audio-video.md`.

Cinque livelli nell'ordine della lezione, tutti a scelta multipla con opzioni di testo. I campioni sono scritti in
testo semplice (`format: 'text'`). I numeri da cinque cifre in su hanno uno spazio stretto tra le migliaia
(`1 411 200`), i decimali la virgola. I multipli sono decimali e il fattore è sempre nel testo.

## Nomi dei livelli

1. Il bitrate di un suono
2. Dal bitrate alla dimensione
3. Un video non compresso
4. Fotogrammi chiave e differenze
5. Streaming, codec e contenitore

## Regole comuni

- Ogni opzione è una quantità con la sua unità (`176,4 kbit/s`, `2880 kB`, `6 220 800 B`, `334 pixel`, `375 MB`), e
  `values` porta lo stesso numero con il punto decimale.
- Le quattro opzioni hanno valori diversi; una sola è la quantità giusta.
- `params.case` dice il caso, per le quote.

## Livello 1: il bitrate di un suono

Un suono non compresso: frequenza tra 8000, 11 025, 12 000, 16 000, 22 050, 24 000, 32 000, 44 100, 48 000, 64 000,
88 200 e 96 000 Hz; 8, 12, 16, 20 o 24 bit per campione; mono o stereo (metà e metà, casi `mono` e `stereo`). Si
chiede il bitrate in kbit/s, che ha al più tre decimali.

Esempio: stereo, 44 100 Hz, 16 bit: $44\,100 \cdot 16 \cdot 2 = 1\,411\,200$ bit/s, cioè 1411,2 kbit/s.

Distrattori: il numero di canali sbagliato, la divisione per 8 (bit presi per byte), i bit/s non portati in kbit/s,
i bit per campione dimenticati, la moltiplicazione per 8, la divisione per 1024.

## Livello 2: dal bitrate alla dimensione

Un brano compresso a 64, 96, 128, 160, 192, 256 o 320 kbit/s, che dura da 1 a 9 minuti, metà delle volte con 15, 30
o 45 secondi in più (casi `minuti` e `minuti e secondi`). Si chiedono i kB, sempre interi: bitrate per secondi
diviso 8.

Esempio: 128 kbit/s per 3 minuti: $128 \cdot 180 : 8 = 2880$ kB.

Distrattori: la divisione per 8 dimenticata, i minuti non portati in secondi, la moltiplicazione per 8, il doppio
("per due canali"), i secondi sommati ai minuti, il risultato diviso per 1000.

## Livello 3: un video non compresso

Fotogrammi di larghezza per altezza pixel (quattordici formati, da 160 × 120 a 3840 × 2160, tutti con lati multipli
di 10) a 24 bit per pixel, con 10, 12, 15, 20, 24, 25, 30, 50 o 60 fotogrammi al secondo. Un quarto delle volte si
chiedono i byte di un fotogramma (`fotogramma`), le altre i byte di un secondo (`secondo`).

Esempio: 1920 × 1080 a 25 fotogrammi al secondo: un fotogramma occupa 6 220 800 B, un secondo 155 520 000 B.

Distrattori: i 3 byte per pixel dimenticati, 24 al posto di 3 (bit presi per byte), un solo fotogramma al posto di
un secondo (e viceversa), la divisione per 8, la somma dei lati al posto del prodotto.

## Livello 4: fotogrammi chiave e differenze

Il conto della figura della lezione. Un video di $n$ fotogrammi (da 6 a 20) di pochi pixel (da 16 × 9 a 40 × 30);
$k$ fotogrammi chiave (da 1 a 3) scritti per intero; di ognuno degli altri si scrivono $d$ pixel (da 2 a 30, al più
un sesto del fotogramma). Sei volte su dieci si chiedono i pixel scritti in tutto, $k \cdot P + (n - k) \cdot d$
(`scritti`); le altre i pixel risparmiati rispetto a $n \cdot P$ (`risparmio`).

Esempio: 10 fotogrammi di 16 × 9, 2 chiave, 8 pixel cambiati: $2 \cdot 144 + 8 \cdot 8 = 352$ pixel scritti.

Distrattori: tutti i fotogrammi interi, le differenze contate anche per i fotogrammi chiave, i fotogrammi chiave
dimenticati, un solo fotogramma chiave, le sole differenze.

## Livello 5: streaming, codec e contenitore

- `versione` (40%): un video in quattro versioni (bitrate diversi tra 1 e 25 Mbit/s) e una connessione la cui
  velocità non coincide con nessuna; si chiede la versione di qualità più alta che regge, cioè il bitrate più alto
  sotto la velocità. Le opzioni sono le quattro versioni.
- `dati` (40%): i MB consumati da $m$ minuti di streaming a $B$ Mbit/s, $B \cdot m \cdot 60 : 8$, con al più un
  decimale. Distrattori: senza dividere per 8, senza portare i minuti in secondi, per 8, il doppio.
- `parole` (20%): una descrizione presa dalla lezione, e si chiede di che cosa parla: bitrate, codec, contenitore,
  fotogramma chiave, fotogramma, streaming, frequenza dei fotogrammi.

## Da evitare

- Domande di memoria su nomi di formati o di codec, su chi li ha definiti, su valori tipici.
- Risultati con più di tre decimali.
- Opzioni senza unità.
