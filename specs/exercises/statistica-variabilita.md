# Indici di variabilità

Generatore: `statistica-variabilita`
(`src/lib/exercises/v2/generators/statistica-variabilita.ts`). Verifica indipendente:
`scripts/exercises/checkers/statistica_variabilita.py`. Lezione collegata: "Indici di variabilità"
(`docs/lezioni/riscritte/57-statistica-variabilita.md`), con la nota
`docs/lezioni/note/57-statistica-variabilita.md` (sezione "Per il generatore").

Lo studente calcola il campo di variazione, gli scarti dalla media, lo scarto semplice medio, la
varianza e lo scarto quadratico medio (esatto o arrotondato al centesimo, anche da una tabella di
frequenze) e confronta due serie con la stessa media. I sette livelli sono quelli proposti dalla nota,
nell'ordine della lezione; ognuno aggiunge una sola difficoltà.

## Costruzione all'indietro

Ogni esercizio parte dagli scarti: una lista di interi piccoli con somma zero (l'ultimo compensa gli
altri). Poi si sceglie una media intera che tenga i dati nell'intervallo della storia (voti da 3 a 10,
temperature da -9 a 15, minuti di ritardo da 0 a 20, punti da 0 a 30, ore di sonno da 4 a 10, dati
senza storia da -20 a 20). Così la media è sempre esatta, gli scarti sono interi e la varianza è una
frazione nota prima di scrivere il testo. Si tiene solo quello che il livello chiede: $S$ o $\sigma^2$
decimali finiti con al massimo due cifre, $\sigma$ esatto al livello 4, $\sigma$ non esatto ai livelli
5 e 6. Per la media con la virgola (livello 5) gli scarti sono metà di interi dispari, come nell'esempio
4 della lezione ($3, 5, 6, 8$, media $5{,}5$).

## Convenzioni

- Quelle della lezione: $\bar{x}$ per la media, $S$ per lo scarto semplice medio, $\sigma^2$ per la
  varianza, $\sigma$ per lo scarto quadratico medio, $x_{\max} - x_{\min}$ per il campo di
  variazione; varianza con divisione per $n$.
- Virgola decimale scritta `{,}`; i valori arrotondati hanno sempre due cifre dopo la virgola
  ($1{,}90$, non $1{,}9$) e il segno $\approx$; quelli esatti si scrivono con $=$ e senza zeri in coda.
- L'arrotondamento è quello solito: al centesimo, per eccesso da 5 in su. Il generatore lo calcola con
  confronti tra interi, il controllo con la radice esatta di SymPy.
- Negli scarti e nelle differenze un minimo o una media negativa va tra parentesi: $5 - (-4)$,
  $-8 - (-5)$.
- Unità nella soluzione (°C, minuti, punti, ore, gol, figli, libri), al singolare per $1$.
- Ogni esercizio ha la variante a scelta multipla con quattro opzioni diverse sia nel testo sia nel
  valore. I livelli 1 e 3-6 hanno risposta `number` (razionale esatto: un valore arrotondato è
  `k/100`) e la scelta si costruisce dai `params.mistakes`, con i vicini nell'ultima cifra come
  riserva; i livelli 2 e 7 hanno risposta `choice`.

## Livello 1: campo di variazione

Da 4 a 8 interi non in ordine (né crescente né decrescente), con almeno tre valori diversi e campo
almeno 3. Sei volte su dieci ci sono dati dei due segni (temperature o dati senza storia), le altre
quattro dati positivi (voti, ritardi, punti, ore di sonno). Il primo e l'ultimo dato non sono i due
estremi.

Distrattori: il minimo tolto senza segno ($5 - 4$ al posto di $5 - (-4)$, l'avviso della lezione),
l'ultimo dato meno il primo, il massimo meno il secondo valore più piccolo, il secondo valore più grande
meno il minimo.

Esempi: temperature $6, -8, -9, 13$ → $13 - (-9) = 22$ °C (opzioni $22, 4, 7, 21$); voti
$6, 9, 6, 8, 8$ → $3$.

## Livello 2: scarti dalla media

Da 4 a 6 dati con media intera, scarti da -5 a 5 con somma zero, almeno uno negativo e uno positivo,
almeno uno di valore assoluto 2 o più. "Calcola gli scarti dalla media, nell'ordine in cui sono
scritti i dati." Risposta `choice`: la lista degli scarti. I passaggi finiscono con il controllo della
somma nulla, come il riquadro `ad-tip` della lezione.

Distrattori: $\bar{x} - x_i$ (segni scambiati), gli scarti senza segno, gli scarti dalla mediana
(quando è diversa dalla media), gli scarti da una media sbagliata di uno.

Esempi: ritardi $18, 12, 19, 16, 10$ → $3, -3, 4, 1, -5$; dati $-17, -17, -14, -16$ →
$-1, -1, 2, 0$ (media $-16$).

## Livello 3: scarto semplice medio

Come il livello 2, con $S$ decimale finito di al massimo due cifre (con 6 dati la somma dei valori
assoluti è multipla di 3).

Distrattori: $0$ (la media degli scarti con il segno, l'avviso "Dimenticare il valore assoluto"), la
somma dei valori assoluti non divisa per $n$, la varianza.

Esempi: voti $10, 9, 7, 10, 4$ → $S = 2$ (opzioni $2, 0, 10, 5{,}2$); ritardi $18, 10, 19, 13$
→ $S = 3{,}5$.

## Livello 4: scarto quadratico medio con radice esatta

Da 4 a 8 dati con media intera, scarti da -6 a 6, non tutti uguali in valore assoluto (così
$S < \sigma$). Tre volte su quattro $\sigma$ è intero da 2 a 5; una volta su quattro ha un decimale,
$\sigma$ da $1{,}5$ a $4{,}5$ con 8 dati, più spesso $3{,}5$. Con meno dati non si può: la somma dei
quadrati di scarti interi con somma zero è sempre pari, e divisa per 4, 5, 6 o 7 non dà mai il
quadrato di un numero con un decimale. L'ultimo passaggio controlla
elevando al quadrato: $\sigma = \sqrt{20{,}25} = 4{,}5$ perché $4{,}5^2 = 20{,}25$.

Distrattori: la varianza (l'avviso "Fermarsi alla varianza"), la somma dei quadrati non divisa, $S$
quando è un decimale finito.

Esempi: voti $3, 4, 6, 10, 3, 10$ → $\sigma^2 = 9$, $\sigma = 3$; punti
$12, 19, 10, 16, 18, 21, 22, 10$ → $\sigma^2 = 20{,}25$, $\sigma = 4{,}5$.

## Livello 5: scarto quadratico medio arrotondato al centesimo

Da 4 a 6 dati, varianza decimale finita con al massimo due cifre, $\sigma$ non esatto. Sette volte su
dieci la media è intera (come i voti di Luca: $\sqrt{3{,}6} \approx 1{,}90$), tre volte su dieci
finisce in $,5$ con 4 o 6 dati (come l'esempio 4: $\sqrt{3{,}25} \approx 1{,}80$). La consegna chiede
l'arrotondamento al centesimo.

Distrattori: la varianza, $\sigma$ troncato al posto di arrotondato (quando cambia), $S$ arrotondato,
lo scarto con la divisione per $n - 1$ (il tasto $s_x$ del riquadro sulla calcolatrice).

Esempi: temperature $11, 6, 5, 6$ → $\sigma^2 = 5{,}5$, $\sigma \approx 2{,}35$ (troncato $2{,}34$);
punti $9, 0, 3, 6$ → media $4{,}5$, $\sigma^2 = 11{,}25$, $\sigma \approx 3{,}35$.

## Livello 6: tabella di frequenze

Una tabella con 4 o 5 valori consecutivi (gol per partita, figli per famiglia, voti, libri letti) e
frequenze da 1 a 8, con $n$ da 10 a 30; media ponderata intera, varianza con al massimo due decimali,
$\sigma$ non esatto e arrotondato al centesimo, come l'esempio 2 della lezione. Il testo dice $n$ ("In
20 partite…"), e i passaggi ripetono che si divide per $n$ e non per le righe.

Distrattori: la varianza divisa per il numero delle righe (l'avviso "Dividere per il numero delle
righe"), la varianza, gli scarti al quadrato senza frequenze divisi per le righe, $\sigma$ troncato.

Esempi: voti da 6 a 9 di 20 studenti con frequenze $1, 6, 5, 8$ → media $8$, $\sigma^2 = 0{,}9$,
$\sigma \approx 0{,}95$; voti da 5 a 9 di 25 studenti con frequenze $3, 8, 6, 2, 6$ →
$\sigma \approx 1{,}36$.

## Livello 7: due serie con la stessa media

Due persone, 5 o 6 dati ciascuna, stessa media intera, varianze diverse e decimali finiti, $\sigma$
che differiscono di almeno $0{,}30$. Sei volte su dieci le serie hanno anche lo stesso campo di
variazione, come l'esempio 5 (Anna e Bea); quattro volte su dieci il campo è più grande nella serie
con $\sigma$ più piccolo, così il campo porterebbe alla risposta sbagliata. La domanda è "Chi ha i
dati più dispersi?" o "Chi è più regolare?", a metà. Risposta `choice`: il nome con il suo $\sigma$.

Distrattori: l'altra persona con il suo $\sigma$, la persona giusta con la varianza al posto di
$\sigma$, "Nessuna: stessa media".

Esempi: minuti per andare a scuola, Marta $35, 26, 36, 27, 36$ ed Elena $33, 27, 29, 33, 38$
(campi 10 e 11), "più dispersi" → Marta, $\sigma \approx 4{,}52$; Elena $33, 33, 38, 34, 27$ e
Chiara $35, 38, 30, 27, 35$ (stesso campo 11), "più regolare" → Elena, $\sigma \approx 3{,}52$.

## Esercizi da evitare

- Dati già ordinati al livello 1, o con il primo e l'ultimo dato uguali agli estremi (l'errore "ultimo
  meno primo" darebbe la risposta giusta).
- Scarti tutti uguali in valore assoluto ($S = \sigma$: il controllo della lezione $\sigma \geq S$
  non si vede) ai livelli 2-5.
- Medie periodiche, varianze con più di due decimali, radici esatte dove si chiede di arrotondare.
- Due serie con varianze quasi uguali al livello 7.

## Telefono

`width.mts statistica-variabilita` esce con 0: il problema più largo è la tabella del livello 6
(276 px su 350), l'opzione più larga la lista di sei scarti del livello 2 (243 px su 252). La storia
è un paragrafo, i dati una riga di valori separati da `\quad` che va a capo da sola, la tabella e le
due serie del livello 7 formule a sé. Le soluzioni e i passaggi non hanno ambienti con `\text{}` (il
nome nel pedice di $\sigma$ è in `\mathrm`); `steps-scan.mts` non stampa niente.

Nessun livello ha bisogno di una figura. La retta con i pallini della lezione aiuterebbe al livello 7,
ma i dati si leggono bene anche in riga.

## Verifica

- `sample.mts statistica-variabilita 1000 all 1 | verify.py`: PASS, 7.000 su 7.000. Con il seed 7001:
  PASS, 7.000 su 7.000.
- Quote dei casi (seed 1): livello 1 con negativi 598, positivi 402; livello 4 intero 759, decimale
  241; livello 5 media intera 696, con la virgola 304; livello 7 stesso campo 598, campo discorde 402.
  Il caso si estrae una volta per esercizio, prima dei tentativi, così un caso scartato più spesso
  mantiene la sua quota.
- Esercizi diversi su 1.000 per livello (seed 1): 1.000, 1.000, 1.000, 1.000, 999, 790, 1.000.
- Errori piantati a mano, tutti bocciati: risposta cambiata (livelli 1, 3), opzione giusta spostata
  su un distrattore (1, 2, 7), dati ordinati (1), caso sbagliato (1), gli scarti con i segni scambiati
  come opzione giusta (2), distrattore $0$ tolto (3), varianza come risposta (4), dati cambiati che
  rendono la media non intera (4), $\sigma$ troncato come risposta (5), opzione giusta scritta con una
  sola cifra (5), valore di un'opzione diverso dal suo testo (5), varianza divisa per le righe come
  risposta (6), una frequenza cambiata (6), domanda invertita da "dispersi" a "regolare" (7), opzioni
  doppie (7), generatore in errore.
- `review.mts` esce con 0; `tsc` ed `eslint` non danno errori sul generatore.

## Domande per la revisione

- Livello 5: la media con la virgola (esempio 4) sta nello stesso livello della media intera, tre
  esercizi su dieci. È una seconda difficoltà nello stesso livello; in alternativa diventa un livello
  a sé, ma si arriverebbe a otto.
- Nelle opzioni arrotondate anche i distrattori hanno due cifre ($4{,}00$ per un $S$ uguale a 4), così
  la forma non tradisce la risposta; la varianza invece resta esatta ($5{,}2$). Va bene così?
- Livello 7: l'opzione "Bea, con $\sigma = 12{,}8$" (la varianza scritta come $\sigma$) ha il nome
  giusto e il numero sbagliato. Uno studente che ha scelto bene la persona ma si è fermato alla
  varianza la sceglie: è il comportamento voluto, ma può sembrare pignolo.
- Le storie sono sei (voti, temperature, ritardi dell'autobus, punti a basket, ore di sonno, dati
  senza storia) più quattro per le tabelle: se ne servono altre, o altre più vicine agli studenti?
