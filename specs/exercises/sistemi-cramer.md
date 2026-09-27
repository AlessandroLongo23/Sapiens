# Determinanti e regola di Cramer

Generatore: `sistemi-cramer` (`src/lib/exercises/v2/generators/sistemi-cramer.ts`).
Verifica indipendente: `scripts/exercises/checkers/sistemi_cramer.py`. Lezione collegata:
`docs/lezioni/riscritte/69-sistemi-cramer.md` (nota in `docs/lezioni/note/69-sistemi-cramer.md`,
sezione "Per il generatore").

Sette livelli nell'ordine della lezione, gli stessi sette proposti dalla nota: determinante $2 \times 2$,
regola di Cramer, forma normale, discussione con $D = 0$, sistemi letterali, regola di Sarrus, sistemi di
tre equazioni. Ogni livello aggiunge una sola difficoltà al precedente, tranne il 6 che apre la parte sulle
tre incognite (come nella lezione, dove Sarrus arriva dopo i sistemi letterali).

## Forma della risposta

- Livelli 1 e 6: `number` (il determinante), con la variante a scelta multipla fra quattro numeri.
- Livelli 2, 3 e 7: la soluzione è una coppia o una terna, e nessun tipo di risposta ha due campi. La
  risposta è quindi una `choice` fra quattro coppie (terne) scritte come nella lezione:
  `\left(\frac{5}{3}, \frac{1}{2}\right)`, con `values` uguali a `["5/3", "1/2"]`.
- Livello 4: due forme.
  - "Quale di questi sistemi è impossibile?" oppure "... indeterminato?": `choice` fra quattro sistemi
    (`\begin{cases} … \end{cases}`), uno del tipo chiesto, due dell'altro tipo con $D = 0$, uno determinato.
    Le risposte possibili a "com'è questo sistema?" sono tre, e la regola chiede quattro opzioni: per questo
    la domanda chiede di scegliere il sistema. `values` di un'opzione: `["a,b,c;a',b',c'"]`. Il problema è
    solo la frase "Per ogni sistema calcola i tre determinanti."
  - "Trova il valore di k per cui il sistema non è determinato.": `number` (il valore di $k$, intero), con
    la variante fra quattro numeri.
- Livello 5: la risposta è una discussione intera, `choice` fra quattro discussioni, come in
  `equazioni-letterali`. Ogni opzione è un `\begin{gathered}` con la coppia per i valori generici e una riga
  per ogni valore che annulla $D$, in ordine crescente:

  ```
  k \neq \pm 1\text{: } \left(\frac{1}{k + 1}, \frac{1}{k + 1}\right)
  k = -1\text{: impossibile}
  k = 1\text{: indeterminato}
  ```

  La condizione è `k \neq \pm v` per due valori opposti, `k \neq v` per uno, `k \neq v_1,\ k \neq v_2`
  per due valori non opposti; in quest'ultimo caso la condizione finisce con `\text{:}` e la coppia va sulla
  riga dopo, perché sul telefono una riga sola non ci sta. La discussione sbagliata "formula per tutti i
  valori" ha per prima riga `\text{per ogni } k\text{: } …`. `values`:
  `["x=(N)/(M)", "y=(N)/(M)", "k=-1:imp", "k=1:ind"]`, con `"per_ogni"` in testa quando non c'è esclusione.
  La soluzione (`solution`) dice la stessa discussione su una riga sola, senza ambienti:
  `\text{per } k \neq \pm 1\text{: } \left(…\right)\text{; per } k = -1\text{: impossibile}…`.

## Rappresentazione (`params`)

- `case`: il caso del livello (`determinante`, `cramer`, `manca`/`denominatori`/`altro` al livello 3,
  `impossibile`/`indeterminato`/`valore` al livello 4, la categoria del livello 5, `sarrus`, `tre incognite`).
- Livelli 1 e 6: `matrix`, gli elementi come stringhe.
- Livelli 2, 3, 7: `rows`, le equazioni in forma normale `[a, b, c]` (o `[a, b, c, d]`) a coefficienti
  interi; `solution`. Al livello 3 anche `forms` (la forma di ciascuna equazione nel testo) e `naive` (la forma
  normale che si ottiene con l'errore della lezione, o `null`).
- Livello 4: `systems` (le quattro opzioni) oppure `matrix`, `position` (dove sta $k$), `constants`, `k`.
- Livello 5: `rows`, ogni coefficiente come `[α, β]` cioè $\alpha k + \beta$; `D` (coefficienti crescenti),
  `x`, `y` (la soluzione generica in SymPy), `cases` (`"-1:imp"`, `"1:ind"`).

## Costruzione all'indietro

- Livelli 2, 3, 7: si sceglie la soluzione, poi i coefficienti delle incognite, e i termini noti si
  calcolano. Si scarta solo se $D = 0$ o se un termine noto esce dall'intervallo.
- Livello 3: si sceglie la soluzione (sette volte su dieci con una frazione), poi per ogni equazione una
  forma: un termine a secondo membro (`6x = 4y + 25`), una parentesi (`2(x - 2) + 5y = -15`), i denominatori
  (`\dfrac{3x}{2} - 3y = 3`, costruita scegliendo i coefficienti frazionari e calcolando il secondo membro),
  un'incognita che manca (`2x = 4`), oppure la forma normale. Almeno un'equazione non è in forma normale, al
  più una ha un'incognita che manca.
- Livello 4, scelta del sistema: si fissano i coefficienti $p$, $q$ di una riga e ogni opzione ha l'altra
  riga uguale a $t$ volte questa ($t \in \{2, 3, -1, -2, -3\}$), con il termine noto moltiplicato per $t$
  (indeterminato) o spostato (impossibile); il sistema determinato ha un coefficiente cambiato. Le due righe
  sono in ordine casuale.
- Livello 4, valore di $k$: si scelgono tre coefficienti e la posizione di $k$, e $k$ si ricava da $D = 0$;
  si tiene solo se è intero, non nullo, al più 12 in valore assoluto.
- Livello 5: si sceglie prima la categoria (impossibile 30 %, indeterminato 20 %, tre casi 35 %, degenere
  15 %). Per le prime tre le righe sono $V_i + (k - r)W_i$: per $k = r$ le righe valgono $V_1 = tV_2$
  (indeterminato) oppure $V_1 = tV_2$ con il termine noto spostato (impossibile), quindi $D(r) = 0$ per
  costruzione. Per il caso degenere, come l'esempio 5, i coefficienti delle incognite sono tutti multipli di
  $(k - r)$ e i termini noti numeri. Si tiene il sistema se $D$ si scompone in fattori con radici intere fra
  $-5$ e $5$, se la categoria è quella scelta e se la soluzione generica, semplificata, ha numeratore e
  denominatore di primo grado con coefficienti fino a 9.
- Livelli 1 e 6: elementi a caso; al livello 6 si scarta un determinante nullo o oltre 150.

## Livello 1: determinante di una matrice 2 × 2

Elementi interi da $-9$ a $9$, non nulli, almeno uno negativo (il segno di $-(-bc)$ è l'errore della
lezione). Determinante zero ammesso solo di rado (2 casi su 1.000 con il seed 1).

- $\begin{vmatrix} 2 & -9 \\ 1 & 9 \end{vmatrix} = 18 - (-9) = 27$
- $\begin{vmatrix} 4 & -3 \\ -4 & 1 \end{vmatrix} = 4 - 12 = -8$

## Livello 2: regola di Cramer, sistema in forma normale

Coefficienti interi da $-6$ a $6$, non nulli; soluzione intera da $-6$ a $6$; termini noti fino a 40.

- $\begin{cases} 6x + 6y = -24 \\ -3x + y = -12 \end{cases}$: $D = 24$, $D_x = 48$, $D_y = -144$, coppia $(2, -6)$.
- $\begin{cases} -3x + 5y = -19 \\ 2x - 2y = 10 \end{cases}$: $D = -4$, coppia $(3, -2)$.

## Livello 3: prima la forma normale

Soluzione anche frazionaria, denominatori fino a 5.

- $\begin{cases} 6x = 4y + 25 \\ 3x - 4(y - 1) = 14 \end{cases}$: forma normale $6x - 4y = 25$, $3x - 4y = 10$;
  coppia $\left(5, \frac{5}{4}\right)$.
- $\begin{cases} -3y = 6 \\ -6x - 3(y - 4) = 26 \end{cases}$: nella prima riga di $D$ il coefficiente di $x$ è
  $0$; coppia $\left(-\frac{4}{3}, -2\right)$.

## Livello 4: D = 0, impossibile o indeterminato

Tre esercizi su dieci chiedono il sistema impossibile, tre l'indeterminato, quattro il valore di $k$.
Coefficienti non nulli, fino a 20 in valore assoluto.

- "Quale è indeterminato?" fra $\begin{cases} -x - 3y = -3 \\ -x - y = -1 \end{cases}$,
  $\begin{cases} -2x - 2y = 15 \\ -x - y = 6 \end{cases}$, $\begin{cases} -x - y = -1 \\ -2x - 2y = -2 \end{cases}$,
  $\begin{cases} -2x - 2y = 3 \\ -x - y = 3 \end{cases}$: il terzo.
- $\begin{cases} -6x + 6y = 4 \\ kx - 3y = -1 \end{cases}$: $D = -6k + 18$, $k = 3$.

## Livello 5: sistemi letterali con il parametro k

- $\begin{cases} 2x + (k + 3)y = 8 \\ (k + 2)x + y = 4 \end{cases}$: $D = -(k + 4)(k + 1)$; per
  $k \neq -4,\ k \neq -1$ la coppia $\left(\frac{4}{k + 4}, \frac{8}{k + 4}\right)$; $k = -4$ impossibile,
  $k = -1$ indeterminato.
- $\begin{cases} kx + ky = 2 \\ -2kx + 2ky = 3 \end{cases}$: $D = 4k^2$; per $k \neq 0$
  $\left(\frac{1}{4k}, \frac{7}{4k}\right)$; per $k = 0$ i coefficienti sono tutti nulli e il sistema è
  impossibile anche se $D = D_x = D_y = 0$.

## Livello 6: determinante 3 × 3 con la regola di Sarrus

Elementi interi da $-4$ a $4$, al più due zeri, almeno un negativo; determinante non nullo, fino a 150.

- $\begin{vmatrix} -4 & 4 & -2 \\ 2 & 4 & -3 \\ -2 & -4 & 2 \end{vmatrix} = 8 - (-16) = 24$
- $\begin{vmatrix} -2 & 3 & -1 \\ -3 & -3 & 3 \\ -3 & -1 & -4 \end{vmatrix} = -54 - 33 = -87$

## Livello 7: tre equazioni in tre incognite

Coefficienti interi da $-3$ a $3$, almeno due non nulli per equazione; soluzione intera da $-4$ a $4$, al più
uno zero; termini noti fino a 20; $D \neq 0$. I passaggi usano Cramer; il prompt ammette la sostituzione.

- $\begin{cases} 3x + y - z = -1 \\ -3x - 2y - 3z = 5 \\ 2x - 2y = 10 \end{cases}$: terna $(1, -4, 0)$.
- $\begin{cases} 3x - y - 3z = 14 \\ -2x + 2y - 3z = -2 \\ -x - 3y - 3z = 10 \end{cases}$: terna $(2, -2, -2)$.

## Da evitare

- `1x`, `0x`, `+ -`, `- -`, termini nulli nel testo (controllati da generatore e verifica).
- Sistemi omogenei al livello 5 (tutti i termini noti nulli): la soluzione generica è $(0, 0)$ e le quattro
  discussioni si distinguono solo per le etichette.
- Coefficienti letterali con due segni meno, come $(-k - 2)x$; un coefficiente $\alpha k + \beta$ ha
  $|\alpha| \le 2$.
- Soluzioni con denominatore oltre 5 (livello 3); determinanti $3 \times 3$ nulli.

## Distrattori

- Livello 1: il segno di un prodotto negativo perso ($2 - 12$ al posto di $2 - (-12)$); i due prodotti
  sommati; le diagonali scambiate ($bc - ad$); i prodotti delle righe ($ab - cd$). Poi numeri vicini.
- Livelli 2 e 3: $x$ e $y$ scambiati; il quoziente rovesciato $\left(\frac{D}{D_x}, \frac{D}{D_y}\right)$;
  il meno davanti al prodotto negativo perso in $D_x$ e $D_y$; la coppia opposta ($D$ con le diagonali
  scambiate). Al livello 3, prima di tutti, la soluzione del sistema letto con l'errore della lezione: il
  termine portato a primo membro senza cambiare segno, il fattore davanti alla parentesi moltiplicato solo
  per la lettera, solo il primo membro moltiplicato per il mcm dei denominatori.
- Livello 4 (valore di $k$): $-k$ (segno della diagonale secondaria); il $k$ che annulla i prodotti delle
  colonne ($aa' - bb'$) o delle righe ($ab - a'b'$).
- Livello 4 (scelta del sistema): gli altri tre sistemi, due con $D = 0$ del tipo opposto e uno determinato.
- Livello 5: la formula semplificata usata anche per i valori dove ha senso (riquadro "Usare la formula
  semplificata per tutti i valori"); impossibile e indeterminato scambiati (nel caso degenere è l'errore
  "Fermarsi ai determinanti"); $x$ e $y$ scambiati; la coppia con il segno cambiato; il quoziente rovesciato.
- Livello 6: la seconda somma aggiunta invece che tolta; le due somme scambiate; solo le due diagonali
  principali, come in un $2 \times 2$; solo il primo prodotto della seconda somma tolto.
- Livello 7: le terne con due incognite scambiate, la terna opposta, una sola componente di segno opposto.

## Verifica

Il controllo Python rilegge tutto dal LaTeX con un parser scritto a parte (numeri, $x$, $y$, $z$, $k$,
parentesi, `\frac`, `\dfrac`, moltiplicazione sottintesa): determinanti con `Matrix.det`, soluzioni con
`linsolve`, i valori di $k$ con `solve`. La discussione del livello 5 è ricalcolata sostituendo ogni valore
che annulla $D$ nel sistema e risolvendolo di nuovo, quindi il caso degenere è giudicato dalle equazioni e
non dalla tabella. Ogni opzione è riletta dal LaTeX e confrontata con i suoi `values`; ne deve essere giusta
esattamente una, e `correct` deve puntare lì. Le quote dei casi dei livelli 4 e 5 sono in `CASE_RANGES`.

Risultati del 27 settembre 2026:

- `sample.mts sistemi-cramer 1000 all 1 | verify.py`: PASS, 7.000 esercizi su 7.000. Casi al livello 4:
  impossibile 316, indeterminato 282, valore 402; al livello 5: impossibile 316, indeterminato 188, tre casi
  339, degenere 157.
- Stesso comando con seed di partenza 7001: PASS, 7.000 su 7.000.
- Esercizi diversi su 1.000 per livello (testo del problema, più le opzioni per la scelta del sistema del
  livello 4): 996, 999, 1.000, 1.000, 1.000, 1.000, 1.000.
- `width.mts sistemi-cramer`: esce con 0. Formula del problema più larga 249 px (livello 5), opzione più
  larga 213 px (livello 5, dopo aver messo la coppia su una riga sua quando la condizione ha due valori non
  opposti: prima 9 opzioni su 600 superavano 252 px).
- `review.mts`: esce con 0. `steps-scan.mts`: niente da segnalare. `tsc` ed `eslint`: nessun errore nel
  generatore.

Errori piantati a mano, tutti bocciati (33 prove): risposta numerica cambiata (livelli 1, 4, 6); `correct`
spostato su un distrattore (tutti i livelli); opzione giusta sostituita da un doppione di un distrattore;
distrattore uguale alla risposta (livelli 2, 3, 5, 7), anche scritto con una frazione non ridotta
($\frac{2}{4}$ al posto di $\frac{1}{2}$); termine noto cambiato nel testo; `1x` nel testo; elemento nullo
al livello 1; elemento oltre 4 al livello 6; equazione cambiata al livello 7; un sistema del livello 2 fatto
passare per livello 3 (già in forma normale); domanda del livello 4 cambiata da impossibile a indeterminato;
casi impossibile e indeterminato scambiati nell'opzione giusta del livello 5; caso degenere segnato
"indeterminato"; `values` non coerenti con il LaTeX; categoria sbagliata; un ambiente nella soluzione.

## Figure

Nessun livello usa figure. Il livello 4 (sistema impossibile o indeterminato) ne vorrebbe una: le due rette
parallele o coincidenti, come nella lezione 68.

## Domande per la revisione

- Livello 4: per il riconoscimento ho chiesto di scegliere il sistema impossibile (o indeterminato) fra
  quattro, perché le risposte naturali sono tre. Il problema è solo una frase e i sistemi sono nelle opzioni.
  Va bene così, o è meglio un sistema solo con tre opzioni?
- Livello 5: i denominatori della soluzione generica non sono scomposti ($\frac{3 - 2k}{3k - 6}$ e non
  $\frac{3 - 2k}{3(k - 2)}$), e la coppia si scrive $(x, y)$ come nella lezione. Se la lezione 68 scrive le
  soluzioni come $S = \{(x, y)\}$, le opzioni vanno allineate.
- Livello 3: con un'incognita che manca un'equazione dà subito il valore (`2x = 4`), e il sistema si
  risolverebbe senza Cramer. La lezione cita il caso come errore frequente nel mettere i coefficienti in
  colonna; lo teniamo o lo togliamo?
