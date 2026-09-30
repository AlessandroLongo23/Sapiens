# Note: La spinta di Archimede e il galleggiamento

Lezione nuova (secondo lotto di fisica, gruppo 9, 30 settembre 2026). Tutti i numeri rifatti in Python: sasso
$19{,}6 \approx 20\,\text{N}$ in acqua e $18{,}03 \approx 18\,\text{N}$ nell'olio; ferro $4{,}9\,\text{N}$ contro
$38{,}6 \approx 39\,\text{N}$ con la densità sbagliata; alluminio $2{,}646$, $0{,}98$, $1{,}666 \approx 1{,}7\,
\text{N}$; corona $1{,}6\,\text{N}$ e $15\,312{,}5 \approx 1{,}5 \cdot 10^4\,\text{kg/m}^3$, corona d'oro dello stesso
peso $1{,}27\,\text{N}$ di spinta e $23{,}23\,\text{N}$ in acqua; legno $6{,}0$ e $6{,}52 \approx 6{,}5\,\text{cm}$;
iceberg $917/1030 = 0{,}890$; chiatta $3{,}0$ e $2{,}91 \approx 2{,}9\,\text{m}$; mongolfiera $28\,224$, $22\,344$,
$5880\,\text{N}$, $600\,\text{kg}$; spinta dell'aria su una persona di circa $0{,}07\,\text{m}^3$: $0{,}82\,\text{N}$.
`check.mts` passa con un avviso letto (il titolo "Il principio di Archimede": nome proprio).

## Struttura ed esempi

Da dove viene la spinta (cubetto, differenza delle pressioni con Stevino, linkata), il principio con la formula
$S_A = d_{fl} \cdot V_{imm} \cdot g$ e la tabella dei fluidi, esempio 1 (sasso in acqua e in olio), tre avvisi
(densità del fluido, spinta che non dipende dal peso, volume immerso e profondità), il peso apparente (figura delle
forze, esempio 2, interattiva), la densità con il dinamometro (esempio 3, la corona), galleggiare o affondare (figura
dei tre casi, avviso "pesante non vuol dire che affonda"), la parte immersa (esempio 4, avviso sul rapporto,
interattiva), iceberg (figura), navi (esempio 5, la chiatta), mongolfiere (esempio 6), densimetro (figura).

## Fonti

- Densità: tabella della lezione 03 per aria, olio, acqua, ghiaccio, ferro, alluminio, rame, piombo, mercurio, oro.
  Nuove qui: alcol etilico $790$, glicerina $1260$ (valori a $20\,^\circ\text{C}$ citati a memoria, da verificare) e
  acqua di mare "circa $1030$" (in superficie tra circa $1020$ e $1030$, spesso $1025$: da verificare, e da decidere
  con Andrea).
- La storia della corona di Gerone viene da Vitruvio (De architectura, libro IX); nel racconto Archimede misura il
  volume con l'acqua traboccata, non pesando la corona in acqua. La lezione dice "si racconta" e usa il metodo del
  dinamometro, che è quello che la lezione insegna: da verificare se va bene presentarla così.
- Aria calda a circa $100\,^\circ\text{C}$: $1{,}204 \cdot 293/373 \approx 0{,}95\,\text{kg/m}^3$, calcolato da me con
  la legge dei gas (non ancora studiata, per questo la densità è data). Il volume di $2400\,\text{m}^3$ è quello di una
  mongolfiera media (da verificare).
- "Nave da centomila tonnellate": ordine di grandezza delle grandi navi portacontainer e da crociera (fatto noto, senza
  fonte precisa).
- Densimetri per vino, mosto e batterie: usi noti, citati senza fonte.

## Scelte

- Densità con $d$, come nel primo lotto: $d_{fl}$ nella formula della spinta, $d_{corpo}$ e $d_{liquido}$ nel
  galleggiamento (i pedici sono parole intere per chiarezza; da confermare).
- Peso apparente $P_{app}$; il filo del dinamometro nella figura delle forze è $\vec{T}$, come la tensione.
- Il centro di spinta è nominato in una frase; la stabilità delle navi è della lezione sul baricentro.
- Per la mongolfiera l'aria esterna è $1{,}20\,\text{kg/m}^3$ (tre cifre), così $1{,}20 - 0{,}95 = 0{,}25$ ha due cifre
  significative anche con la regola delle differenze.
- Il corpo sul fondo: nella figura dei tre casi disegno solo peso e spinta, e il testo dice che il fondo regge il resto;
  nell'interattiva compare anche $\vec{N}$.
- Nelle interattive il liquido è `cyan!20` e l'olio `yellow!20`, per distinguerlo; il gruppo 8 (`liquidi.tsx`) usa
  `orange!25` per l'olio. Da uniformare: non ho usato `liquidi.tsx` perché è arrivato mentre scrivevo, e il brief
  chiedeva il recipiente nei miei file.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `spinta-differenza-pressione`, `peso-apparente-forze` (frecce in scala,
$T + S_A = P$), `affonda-sospeso-galleggia` (stesso volume, stessa spinta per il corpo sul fondo e per quello sospeso),
`iceberg-parte-immersa`, `densimetro-due-liquidi`.

Interattive:

- `dinamometro-corpo-immerso` (`fisica/DinamometroImmersione.tsx`): blocco di $100\,\text{cm}^3$ ($5 \times 5 \times
  4\,\text{cm}$) di alluminio o di ferro, appeso a un dinamometro da $10\,\text{N}$ in $20$ divisioni tenuto da un
  sostegno; il cursore abbassa il blocco da $0$ a $6\,\text{cm}$ sotto la superficie; olio, acqua, acqua di mare. La
  lettura cala fino a $4\,\text{cm}$ e poi resta ferma; il livello del liquido sale di $V_{imm} / 100\,\text{cm}^2$.
- `galleggiamento-densita` (`fisica/CorpoGalleggiante.tsx`): blocco di $1\,\text{dm}^3$, densità da $100$ a
  $1500\,\text{kg/m}^3$; il blocco si sposta con un'animazione e la spinta disegnata è quella della parte immersa in
  quel momento; sul fondo compare $\vec{N}$.

Scene degli esercizi: `dinamometri-archimede` (`scenes/DinamometriArchimede.tsx`, due dinamometri, in aria e con il
corpo nel liquido) e `galleggiante-quote` (`scenes/GalleggianteQuote.tsx`, blocco che galleggia con le due altezze
segnate). Tutte guardate in chiaro, in scuro e al telefono.

## Esercizi

Generatore `fis-archimede`, specifica in `specs/exercises/fis-archimede.md`: sei livelli (La spinta su un corpo
immerso, Il peso apparente, Dalle letture dei due dinamometri, La parte immersa di un corpo che galleggia, La densità
dalla linea di galleggiamento, Il carico massimo), scene ai livelli 3 e 5.

## Domande per Andrea

- Acqua di mare $1030$ o $1025\,\text{kg/m}^3$?
- La spinta con $d_{fl}$ (fluido) o $d_{liquido}$? E $V_{imm}$ o $V_{immerso}$?
- La spiegazione con il cubetto e la differenza di pressione è adatta alla prima, o basta enunciare il principio?
- La corona di Gerone con il dinamometro: va bene o è meglio il racconto di Vitruvio con l'acqua traboccata?
- Il carico della zattera e della mongolfiera in chilogrammi (massa) o in newton (peso)?
- Il densimetro è ancora nei programmi, o si può togliere?
