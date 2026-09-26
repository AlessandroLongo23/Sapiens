# Divisione tra polinomi

Generatore: `polinomi-divisione` (`src/lib/exercises/v2/generators/polinomi-divisione.ts`).
Verifica indipendente: `scripts/exercises/checkers/polinomi_divisione.py`. Lezione collegata:
`docs/lezioni/riscritte/32-polinomi-divisione.md` (note in `docs/lezioni/note/32-polinomi-divisione.md`).

Lo studente divide un polinomio in $x$ per un polinomio con almeno due termini, con la divisione in
colonna della lezione, e trova quoziente e resto.

## Forma della risposta

La risposta è la coppia quoziente e resto, a scelta multipla (`answer.kind = "choice"`, e `choice`
uguale ad `answer`). Ogni opzione ha due `values`, il quoziente e il resto in forma SymPy. Al
livello 1 è scritta su una riga, `Q(x) = x + 3,\ \ R(x) = 1`; dal livello 2 in poi su due righe,
`\begin{gathered}Q(x) = x^2 + 2x - 3 \\ R(x) = 0\end{gathered}`, perché il pulsante della risposta
sul telefono ha circa 252 px (KaTeX a 16 px) e in questi livelli una parte delle coppie non ci sta
(misurate fino a 320 px). Le due righe valgono per tutte le opzioni del livello, così le quattro
risposte hanno la stessa forma. Il controllo accetta solo la forma del livello e boccia un'opzione
con una riga persa. La soluzione (`solution`) usa la stessa scrittura.

Perché la coppia e non solo il quoziente o solo il resto:

- l'errore principale della lezione (riquadri "Un resto con grado troppo alto" e "Fermarsi al
  momento sbagliato") dà una coppia per cui $A = B \cdot Q + R$ è vera ma il resto ha grado troppo
  alto. Si vede solo guardando quoziente e resto insieme: chiedendo solo il quoziente, il
  distrattore "mi sono fermato un passo prima" è un polinomio qualunque; chiedendo solo il resto,
  diventa un resto di grado sbagliato, facile da scartare a occhio;
- la lezione definisce la divisione come la coppia $(Q, R)$ e verifica il risultato con
  $B \cdot Q + R = A$ e con il grado di $R$: il controllo fa la stessa cosa su ogni opzione;
- chiedere solo il resto con divisore $x - a$ è il teorema del resto, che è nella lezione 33
  (Ruffini), e qui toglierebbe il procedimento.

Una risposta aperta futura avrà bisogno di due campi (quoziente e resto), che il tipo `expression`
oggi non ha: vedi le domande in fondo.

## Costruzione all'indietro

Si scelgono il divisore $B$, il quoziente $Q$ e il resto $R$ (grado di $R$ minore del grado di
$B$), e il dividendo è $A = B \cdot Q + R$. Così dividendo e divisore hanno coefficienti interi
piccoli, il quoziente è intero (tranne al livello 5) e il resto è piccolo.

`params`: `A`, `B`, `Q`, `R` come liste di coefficienti esatti per grado crescente (`"1/2"`),
`order` (i gradi dei termini di $A$ nell'ordine in cui sono scritti), `case`.

## Regole comuni

- Consegna: "Trova il quoziente e il resto della divisione." Testo: `(A) : (B)`, come nelle note
  della lezione (`(x^2 + 5x + 7) : (x + 2)`).
- Larghezza sul telefono (colonna di circa 350 px, KaTeX a 18 px): quando la stima della larghezza
  supera 340 px il problema va su due righe, spezzato prima del ":",
  `\begin{aligned}&(A) \\ &\quad : (B)\end{aligned}`. La stima conta caratteri visibili, esponenti
  e operatori, con coefficienti ricavati dalle larghezze misurate di questi problemi (errore entro
  3 px). Su 1.000 esercizi per livello va a capo circa il 36% del livello 4 e il 2% del livello 6;
  gli altri livelli restano su una riga. Il controllo accetta solo quella forma su due righe, con
  un polinomio tra parentesi per riga, e ricostruisce `(A) : (B)`.
- Dividendo e divisore a coefficienti interi; coefficienti del dividendo fino a 40, del divisore fino
  a 5; quoziente con coefficienti fino a 12 e denominatore fino a 3; resto fino a 30.
- Il quoziente ha tutte le potenze (un passo della divisione per ogni termine, come negli esempi); il
  dividendo ha sempre il termine noto, così il completamento non scrive mai "+ 0" in fondo.
- Divisore con primo coefficiente 1, dividendo ordinato per potenze decrescenti, quoziente intero:
  ai livelli 1, 2, 3, 4 e 6.
- Opzioni e testo senza `1x`, `+ -`, `x^1`, termini nulli; quoziente e resto ordinati.

## Passaggi

Come l'esempio 1 della lezione, un passo alla volta:

1. se serve, "Ordina e completa il dividendo" con i termini $0x^n$ (`6x^3 - x^2 + 0x + 4`);
2. per ogni termine del quoziente, `\text{Passo 1: } 2x^3 : x = 2x^2 \qquad 2x^2(x - 2) = 2x^3 - 4x^2`
   e poi `\text{Somma l'opposto: } (2x^3 - 3x^2 + 4x - 5) + (-2x^3 + 4x^2) = x^2 + 4x - 5`;
3. il criterio per fermarsi: "Il resto ha grado 0, minore del grado 1 del divisore";
4. la verifica `(x - 2)(2x^2 + x + 6) + 7 = 2x^3 - 3x^2 + 4x - 5`.

Il controllo Python rilegge ogni passaggio con un'uguaglianza, controlla che i passi siano tanti
quanti i termini del quoziente e che la verifica finale dia il dividendo.

## Livello 1: divisore di primo grado

Dividendo di secondo grado completo, divisore $x + b$ con $b$ da −5 a 5; quoziente $q_1x + q_0$ con
$q_1$ tra 1 e 3; resto da −9 a 9 (l'esempio iniziale della lezione e il livello 1 delle note).

1. `(x^2 + 5x + 7) : (x + 2)`: $Q(x) = x + 3$, $R(x) = 1$.
2. `(3x^2 + 4x + 2) : (x + 1)`: $Q(x) = 3x + 1$, $R(x) = 1$.

## Livello 2: dividendo di terzo grado

Come il livello 1 con un dividendo di terzo grado completo, quindi tre passi (esempio 1).

1. `(2x^3 - 3x^2 + 4x - 5) : (x - 2)`: $Q(x) = 2x^2 + x + 6$, $R(x) = 7$.
2. `(2x^3 + 6x^2 + 5x - 7) : (x + 1)`: $Q(x) = 2x^2 + 4x + 1$, $R(x) = -8$.

## Livello 3: dividendo incompleto

Divisore $x + b$ con $b$ da −3 a 3, dividendo di terzo grado (circa 3 su 4) o di quarto grado a cui
mancano una o più potenze intermedie (esempio 2). Le potenze mancanti si scelgono prima e il
quoziente si costruisce in modo che si annullino ($q_{i-1} = -b\,q_i$). Circa 1 su 3 è divisibile
(resto 0, caso `divisibile`), gli altri `con resto`.

1. `(x^3 - 7x + 6) : (x - 2)`: $Q(x) = x^2 + 2x - 3$, $R(x) = 0$.
2. `(x^3 - 6x + 8) : (x - 1)`: $Q(x) = x^2 + x - 5$, $R(x) = 3$.

## Livello 4: divisore di secondo grado

Divisore $x^2 + bx + c$ completo ($b$, $c$ da −4 a 4, non nulli), dividendo di terzo grado (circa 4
su 10) o di quarto grado, resto di primo grado (esempio 3: "il resto questa volta non è un
numero"). Il dividendo può essere incompleto.

1. `(x^4 + 2x^3 - x + 3) : (x^2 - x + 1)`: $Q(x) = x^2 + 3x + 2$, $R(x) = -2x + 1$.
2. `(x^3 + x^2 - 2x + 2) : (x^2 - x + 3)`: $Q(x) = x + 2$, $R(x) = -3x - 4$.

## Livello 5: dividendo in disordine, quoziente con frazioni

Divisore $ax + b$ con $a = 2$ (2 volte su 3) o $a = 3$ e $b$ primo con $a$; dividendo di terzo
grado a coefficienti interi, scritto in disordine (esempio 4). Solo il termine noto del quoziente è
una frazione, $k/a$, e il resto è $m - b\,k/a$: così il dividendo resta intero, come nella lezione
("dividendo e divisore hanno coefficienti interi, ma quoziente e resto no").

1. `(4 - x^2 + 6x^3) : (2x - 1)`: $Q(x) = 3x^2 + x + \frac{1}{2}$, $R(x) = \frac{9}{2}$.
2. `(-5 + 4x^3 + 8x^2 + 4x) : (2x + 1)`: $Q(x) = 2x^2 + 3x + \frac{1}{2}$, $R(x) = -\frac{11}{2}$.

## Livello 6: divisore incompleto

Divisore $x^2 + c$ (circa 7 su 10, $c$ da −5 a 5) oppure $x^2 + bx$; dividendo di quarto grado,
spesso incompleto; resto non nullo di grado al massimo 1 (esempio 5).

1. `(3x^4 - 2x^3 + x - 4) : (x^2 + 2)`: $Q(x) = 3x^2 - 2x - 6$, $R(x) = 5x + 8$.
2. `(2x^4 + 5x^3 + 3x^2 + 5x - 4) : (x^2 + 1)`: $Q(x) = 2x^2 + 5x + 1$, $R(x) = -5$.

## Esercizi "brutti" da evitare

- quoziente con una potenza mancante (la divisione si fa in un passo e non allena niente);
- dividendo senza termine noto, che si completerebbe con "+ 0";
- coefficienti grandi: il limite del dividendo è 40, degli esempi della lezione circa 10;
- al livello 5, frazioni con denominatore 4 o 8 (per questo è frazionario solo l'ultimo termine del
  quoziente).

## Variante a scelta multipla

Quattro coppie distinte, una corretta. I distrattori rifanno la divisione con gli errori dei
riquadri `ad-warning` della lezione, in quest'ordine a seconda del livello:

- fermarsi un passo prima: la coppia prima dell'ultimo passo, con $A = B \cdot Q + R$ vera ma il
  resto di grado uguale o maggiore del divisore (tutti i livelli; al livello 4 per primo);
- cambiare segno solo al primo termine del prodotto: al primo passo (come nel riquadro della
  lezione) oppure a ogni passo;
- non lasciare lo spazio per le potenze mancanti: i termini del dividendo scritti in colonne vicine,
  così il prodotto finisce sotto il termine sbagliato (livelli con il dividendo incompleto; al
  livello 3 per primo);
- divisore incompleto: il $+c$ del prodotto scritto nella colonna accanto, cioè la divisione per
  $x^2 + cx$ (livello 6, per primo);
- ultimo passo con la frazione rovesciata, $x : 2x = 2$ invece di $\frac{1}{2}$ (livello 5, per
  primo);
- resto con il segno cambiato.

Si tengono solo i distrattori con coefficienti fino a 60 (denominatore fino a 12). Se non bastano,
resto ±1, ±2 o termine noto del quoziente ±1: su 250 esercizi per livello sono il 15% dei
distrattori al livello 2 (l'errore di segno a ogni passo, con $b$ fino a 4, supera spesso 60), tra
il 5% e il 7% ai livelli 1, 3, 4 e 6, nessuno al livello 5. Il controllo verifica che ogni distrattore sia sbagliato: o $A \ne B \cdot Q + R$, o
il resto ha grado troppo alto.

## Verifiche fatte (26 settembre 2026)

- `sample.mts polinomi-divisione 1000 all 1 | verify.py`: PASS, 6.000 su 6.000. Con seed di partenza
  7001: PASS. Quote: livello 3 circa 38% divisibili; livello 4 circa 41% con quoziente di primo
  grado; livello 6 circa 72% con divisore $x^2 + c$.
- Esercizi diversi su 1.000 (seed 1 / seed 7001): livello 1 913 / 908, livello 2 986 / 986,
  livello 3 779 / 795, livello 4 999 / 1.000, livello 5 1.000 / 995, livello 6 1.000 / 1.000.
- Errori piantati a mano, tutti bocciati: indice della risposta giusta spostato; resto della
  risposta cambiato nel LaTeX; `values` della risposta giusta sbagliati; due opzioni uguali; la
  coppia giusta ripetuta in un'altra forma (`R(x) = 0 + 9`); come risposta giusta un distrattore
  al livello 4; dividendo in disordine al livello 2; dividendo completo al livello 3; esercizio del livello 2
  dichiarato di livello 5 (quoziente intero); un passaggio con i due membri diversi; la verifica
  finale tolta; un problema su due righe con la seconda riga persa, o con il divisore senza
  parentesi.
- Opzioni misurate con KaTeX a 16 px (quattro opzioni di 150 esercizi per livello): nessuna oltre i
  252 px (massimi: 218, 170, 215, 178, 179, 170 px dal livello 1 al 6; prima delle due righe erano
  troppo larghe 70, 211, 356, 253 e 539 opzioni su 600 dal livello 2 al 6, fino a 320 px). Errori
  piantati sulle opzioni, bocciati: riga di R(x) persa nella risposta giusta e in un distrattore, una
  sola opzione su una riga al livello 4.
- Larghezza misurata con KaTeX a 18 px su 150 esercizi per livello: nessun problema oltre i 350 px
  (massimi: 216, 278, 267, 337, 291, 338 px dal livello 1 al 6; prima della correzione il livello 4
  arrivava a 390 px, con 32 problemi su 150 troppo larghi).
- `review.mts`: esce con 0; `npx tsc --noEmit -p .`: nessun errore nei file di questo generatore.

## Domande per la revisione

- La risposta è sempre la coppia quoziente e resto. Per la risposta aperta serviranno due campi;
  in alternativa si può chiedere il solo quoziente ai livelli 1-3 e la coppia dopo. Andrea che cosa
  preferisce?
- Al livello 5 i distrattori con quoziente intero si scartano sapendo che il divisore $2x + b$ dà
  frazioni: è un ragionamento da premiare o un suggerimento involontario?
- I passaggi "Somma l'opposto" dei livelli 4 e 6 sono lunghi (dividendo di quarto grado intero tra
  parentesi) e sul telefono scorrono in orizzontale. Meglio lo schema in colonna come immagine, o
  basta così?
- La lezione nomina anche il riquadro "Dividere per tutto il divisore": non ha un distrattore,
  perché l'errore non dà una coppia prevedibile.
