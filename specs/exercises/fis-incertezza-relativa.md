# Incertezza relativa e propagazione delle incertezze

Generatore: `fis-incertezza-relativa` (`src/lib/exercises/v2/generators/fis-incertezza-relativa.ts`).
Verifica indipendente: `scripts/exercises/checkers/fis_incertezza_relativa.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/07-fis-incertezza-relativa.md` (note in
`docs/lezioni/fisica/note/07-fis-incertezza-relativa.md`).

Sei livelli nell'ordine della lezione: l'incertezza relativa, il ritorno all'assoluta, somme e differenze, prodotti
e quozienti, potenze e numeri esatti, formule con più passaggi.

## Nomi dei livelli

1. Incertezza relativa
2. Dalla relativa all'assoluta
3. Somme e differenze
4. Prodotti e quozienti
5. Potenze e numeri esatti
6. Formule con più passaggi

## Le regole della lezione (le stesse per tutti i gruppi di fisica)

- $\varepsilon = \dfrac{\Delta x}{\bar{x}}$, numero puro; $\varepsilon_\% = \varepsilon \cdot 100\%$.
- Somme e differenze: $\Delta(a \pm b) = \Delta a + \Delta b$. Numero esatto: $\Delta(k a) = k\,\Delta a$.
- Prodotti e quozienti: $\varepsilon = \varepsilon_a + \varepsilon_b$. Potenze: $\varepsilon(a^n) = n\,\varepsilon_a$.
- Risultato: $\Delta x$ con una cifra significativa, il valore alla stessa posizione decimale; per arrotondare si
  guarda la prima cifra tolta.

## Tipi di risposta

Risposte `choice` con quattro opzioni, senza `toChoice`. Livello 1: una percentuale, `0{,}5\%`. Livelli 2-6: un
risultato con l'unità, `(624 \pm 5)\ \text{cm}^2`, `(8{,}0 \pm 0{,}2)\,\text{m/s}`, `(2{,}7 \pm 0{,}3)\ \text{g/cm}^3`.
`values` è la scrittura senza LaTeX (`"0,5 %"`, `"624 ± 5 cm^2"`), così il controllo vede gli zeri finali. Quattro
scritture diverse e quattro coppie (valore, incertezza) diverse.

## Regole comuni

- Dati scritti come risultati della lezione: $(29{,}7 \pm 0{,}1)\,\text{cm}$, con l'incertezza di una cifra
  significativa e il valore fino alla sua posizione.
- Virgola decimale `{,}`, `\cdot`, unità dopo `\,` (dopo `\ ` quando c'è un esponente, come la lezione:
  `623{,}7\ \text{cm}^2`); percentuali `2{,}1\%` dentro le formule (il `%` fuori da `$…$` rompe `textBlock`).
- Arrotondamenti mai ambigui: la risposta è la stessa se lo studente usa le incertezze relative esatte o arrotondate a
  due cifre significative, e se tiene tutte le cifre del valore o una in più. In pratica: la parte tolta
  dell'incertezza assoluta dista almeno un decimo di unità dalla metà, e lo stesso per il valore.
- I passaggi seguono i tre passi della lezione (valore, incertezze relative, incertezza assoluta e arrotondamento), con
  i numeri intermedi scritti con due o tre cifre significative.
- Niente trattini lunghi e niente "piuttosto che".

## Livello 1: incertezza relativa

"Quanto vale l'incertezza percentuale della misura $(x \pm \Delta x)$ unità?" Contesti: lunghezze in cm e in m, masse
in g, tempi in s, volumi in mL. Costruzione: si sceglie $\varepsilon_\%$ in
$\{0{,}1;\ 0{,}2;\ 0{,}25;\ 0{,}4;\ 0{,}5;\ 0{,}8;\ 1;\ 1{,}2;\ 1{,}5;\ 2;\ 2{,}5;\ 4;\ 5;\ 8;\ 10\}$ e un'incertezza
$\Delta x$ con una cifra significativa, poi $x = \Delta x / \varepsilon$, che deve avere l'ultima cifra nella
posizione di $\Delta x$ e stare tra $1$ e $5000$.

Distrattori: $\varepsilon$ senza moltiplicare per $100$, scritta come percentuale ($0{,}005\%$ al posto di $0{,}5\%$);
il rapporto rovesciato $\dfrac{x}{\Delta x}\cdot 100\%$ (l'avviso della lezione); $10$ volte la risposta.

Esempi:

- "$(20{,}0 \pm 0{,}1)\,\text{cm}$." Risposta $0{,}5\%$; distrattori $0{,}005\%$, $20\,000\%$, $5\%$.
- "$(250 \pm 5)\,\text{g}$." Risposta $2\%$; distrattori $0{,}02\%$, $5000\%$, $20\%$.

## Livello 2: dalla relativa all'assoluta

"Una misura vale $x$ unità con un'incertezza del $\varepsilon_\%$. Come si scrive il risultato?" Stessa costruzione del
livello 1, con $x$ dato senza incertezza e $\varepsilon_\%$ dato. Risposta $(x \pm \Delta x)$.

Distrattori: la percentuale usata come incertezza assoluta, $(250 \pm 2)\,\text{g}$; l'incertezza $100$ volte più
grande, $(250 \pm 500)\,\text{g}$ (da scartare se assurda: al suo posto $10$ volte); $\dfrac{x}{\varepsilon_\%}$,
$125$ g, che nella forma corretta è $(300 \pm 100)\,\text{g}$.

Esempi:

- "Una massa di $250$ g è misurata con un'incertezza del $2\%$." Risposta $(250 \pm 5)\,\text{g}$.
- "Un tempo di $12{,}50$ s è misurato con un'incertezza dello $0{,}4\%$." Risposta $(12{,}50 \pm 0{,}05)\,\text{s}$.

## Livello 3: somme e differenze

Cinque contesti, circa un quinto ciascuno:

- il perimetro di un rettangolo di lati $a$ e $b$: $P = 2a + 2b$, $\Delta P = 2\Delta a + 2\Delta b$;
- due tratti in fila: $L = a + b$;
- la massa di un liquido: bicchiere pieno meno bicchiere vuoto;
- il volume di un sasso: $V_2 - V_1$ in un cilindro graduato;
- l'aumento di temperatura di un liquido: $T_2 - T_1$ (senza il simbolo $\Delta T$, che si confonderebbe con
  l'incertezza).

I dati hanno le incertezze nella stessa posizione decimale. Circa quattro volte su cinque l'incertezza del risultato
ha una cifra sola ($0{,}2 + 0{,}3 = 0{,}5$); le altre volte ha due cifre ($0{,}6 + 0{,}5 = 1{,}1$) e va arrotondata,
con il valore.

Distrattori: la differenza delle incertezze $|\Delta a - \Delta b|$ (o $0$ se sono uguali, l'avviso della lezione);
la media delle incertezze; per il perimetro $\Delta a + \Delta b$ senza il $2$; la più grande delle due.

Esempi:

- "I lati di un foglio misurano $(29{,}7 \pm 0{,}1)\,\text{cm}$ e $(21{,}0 \pm 0{,}1)\,\text{cm}$. Quanto vale il
  perimetro?" Risposta $(101{,}4 \pm 0{,}4)\,\text{cm}$; distrattori $(101{,}4 \pm 0{,}2)$, $(101{,}4 \pm 0{,}1)$,
  $(101{,}4 \pm 0)$.
- "Nel cilindro graduato l'acqua sale da $(35 \pm 1)\,\text{mL}$ a $(47 \pm 1)\,\text{mL}$. Quanto vale il volume del
  sasso?" Risposta $(12 \pm 2)\,\text{mL}$; distrattori $(12 \pm 0)$, $(12 \pm 1)$, e un valore vicino.

## Livello 4: prodotti e quozienti

Tre contesti, un terzo ciascuno: l'area di un rettangolo ($A = a \cdot b$, $\text{cm}^2$), la velocità media
($v = s / t$, m/s), la densità ($\rho = m / V$, $\text{g/cm}^3$, con il volume in $\text{cm}^3$ o in mL). Dati con
due o tre cifre significative, incertezze relative dei due dati tra lo $0{,}1\%$ e il $10\%$.

Distrattori:

- le incertezze assolute sommate come se fosse una somma, quando i dati hanno la stessa unità (area:
  $(623{,}7 \pm 0{,}2)\ \text{cm}^2$); altrimenti il prodotto delle incertezze;
- l'incertezza relativa scritta come assoluta, arrotondata a una cifra;
- una sola incertezza relativa, quella più piccola (il dato che pesa di più dimenticato);
- il risultato non arrotondato.

Ogni distrattore si scrive nella forma corretta, con il valore arrotondato alla posizione della sua incertezza.

Esempi:

- "Un foglio ha i lati $(29{,}7 \pm 0{,}1)\,\text{cm}$ e $(21{,}0 \pm 0{,}1)\,\text{cm}$. Quanto vale l'area?" Risposta
  $(624 \pm 5)\ \text{cm}^2$; distrattori $(623{,}7 \pm 0{,}2)$, $(624 \pm 2)$ (solo la relativa di $a$, la più
  piccola: $0{,}34\%$ di $623{,}7$ è $2{,}1$), $(623{,}700 \pm 0{,}008)$ (la relativa $0{,}0081$ scritta come
  assoluta).
- "Un corridore percorre $(100{,}0 \pm 0{,}5)\,\text{m}$ in $(12{,}5 \pm 0{,}2)\,\text{s}$. Quanto vale la velocità
  media?" Risposta $(8{,}0 \pm 0{,}2)\,\text{m/s}$; distrattori $(8{,}00 \pm 0{,}04)$ (solo la relativa di $s$),
  $(8{,}00 \pm 0{,}02)$ (la relativa $0{,}021$ scritta come assoluta), $(8{,}0 \pm 0{,}1)$ (il prodotto
  $0{,}5 \cdot 0{,}2$).

## Livello 5: potenze e numeri esatti

Quattro contesti, un quarto ciascuno:

- l'area di un quadrato di lato $l$: $\varepsilon_A = 2\varepsilon_l$;
- il volume di un cubo di spigolo $l$: $\varepsilon_V = 3\varepsilon_l$;
- il periodo di un pendolo dal tempo di $n$ oscillazioni ($n = 10$ o $20$): $\Delta T = \Delta t / n$;
- il perimetro di un poligono regolare di $k$ lati ($k = 3, 4, 5, 6$): $\Delta P = k\,\Delta l$.

Distrattori: l'esponente dimenticato ($\varepsilon_A = \varepsilon_l$); l'incertezza assoluta elevata alla potenza;
per il periodo $\Delta t$ non diviso, o moltiplicato per $n$; per il perimetro $\Delta l$ non moltiplicato.

Esempi:

- "Il tempo di $10$ oscillazioni è $(12{,}50 \pm 0{,}06)\,\text{s}$. Quanto vale il periodo?" Risposta
  $(1{,}250 \pm 0{,}006)\,\text{s}$; distrattori $(1{,}25 \pm 0{,}06)$, $(1{,}3 \pm 0{,}6)$, e un valore vicino.
- "Lo spigolo di un cubo è $(3{,}0 \pm 0{,}1)\,\text{cm}$. Quanto vale il volume?" Risposta
  $(27 \pm 3)\ \text{cm}^3$; distrattori $(27{,}0 \pm 0{,}9)$ (l'esponente dimenticato), $(27{,}000 \pm 0{,}001)$
  ($0{,}1^3$).

## Livello 6: formule con più passaggi

Tre contesti, un terzo ciascuno:

- la densità di un cubetto: $\rho = \dfrac{m}{l^3}$, $\varepsilon_\rho = \varepsilon_m + 3\varepsilon_l$ (come
  l'esempio 6 della lezione);
- la densità di un parallelepipedo: $\rho = \dfrac{m}{a \cdot b \cdot c}$, $\varepsilon = \varepsilon_m +
  \varepsilon_a + \varepsilon_b + \varepsilon_c$;
- la velocità media su $n$ giri di una pista lunga $L$: $v = \dfrac{n L}{t}$, $\varepsilon_v = \varepsilon_L +
  \varepsilon_t$ ($n$ esatto).

Distrattori: il $3$ dimenticato ($\varepsilon_m + \varepsilon_l$); le incertezze relative di una sola grandezza;
per la pista $n$ moltiplicato anche nell'incertezza relativa; il risultato non arrotondato.

Esempi:

- "Un cubetto ha lo spigolo $(3{,}0 \pm 0{,}1)\,\text{cm}$ e la massa $(72{,}9 \pm 0{,}1)\,\text{g}$. Quanto vale la
  densità?" Risposta $(2{,}7 \pm 0{,}3)\ \text{g/cm}^3$; distrattore $(2{,}70 \pm 0{,}09)$ (il $3$ dimenticato).
- "Un ciclista fa $4$ giri di una pista lunga $(400{,}0 \pm 0{,}5)\,\text{m}$ in $(160 \pm 2)\,\text{s}$. Quanto vale
  la velocità media?" Risposta $(10{,}0 \pm 0{,}1)\,\text{m/s}$.

## Esercizi da evitare

- Risultati con l'arrotondamento vicino alla metà (vedi le regole comuni).
- Incertezze relative oltre il $20\%$ nei dati, o risultati con l'incertezza più grande del valore.
- Distrattori con incertezza e valore in posizioni diverse ($(8{,}0 \pm 0{,}02)$): si riscrivono nella forma
  corretta o si sostituiscono.
- Valori enormi o minuscoli: tutti i risultati tra $0{,}1$ e $10\,000$ nella loro unità.

## Verifica

`scripts/exercises/checkers/fis_incertezza_relativa.py` rilegge dal testo i dati e il contesto, ricalcola con
`Rational` il risultato e la sua incertezza con le regole della lezione, arrotonda, controlla che l'arrotondamento
non sia ambiguo (anche con le incertezze relative arrotondate a due cifre), che l'opzione giusta sia l'unica uguale al
risultato, la scrittura delle opzioni (posizioni del valore e dell'incertezza uguali, una cifra significativa
nell'incertezza), e la quota dei casi.

Il ricalcolo usa `Fraction` (Python) e rilegge ogni esercizio da una delle frasi del generatore, riscritte nel
checker: un testo che non corrisponde a nessuna è un errore. Per i dati controlla anche la scrittura (una cifra
significativa nell'incertezza, valore alla stessa posizione, incertezza relativa entro il $20\%$, tra lo $0{,}1\%$ e il
$10\%$ ai livelli 4-6, due o tre cifre significative al livello 4, quattro per lo spazio della velocità media come nell'esempio
$(100{,}0 \pm 0{,}5)\,\text{m}$). L'arrotondamento non è ambiguo se la parte tolta
dell'incertezza e del valore dista almeno un decimo di unità dalla metà, e se l'incertezza arrotondata resta la
stessa con dodici varianti del calcolo: le incertezze relative esatte, arrotondate a due cifre una per una, la loro
somma arrotondata a due cifre, o tutte e due le cose; il valore esatto, con una cifra in più del risultato, o con tre
cifre significative.

Esito: `sample.mts fis-incertezza-relativa 1000 all 1`, `… 1000 all 50001` e `… 1000 all 777001`, 6.000 esercizi
ciascuno, PASS (e nessuna violazione del `check()` del generatore). `review.mts` esce con codice 0 (tutto il LaTeX
passa da KaTeX), `width.mts` anche: l'opzione più larga misura 194 px su 252. Al livello 3 l'incertezza da
arrotondare esce 188, 207 e 212 volte su 1.000.

### Errori piantati

427 su 427 bocciati, su 10 esercizi validi per livello (seed da 1) e 7 esercizi costruiti a mano:

- risposta cambiata (il valore dell'opzione giusta spostato di due unità, la percentuale moltiplicata per tre);
- opzione giusta spostata su un'altra; due opzioni uguali;
- un dato del testo cambiato (un $1$ davanti al primo valore) con la risposta lasciata com'era;
- un'incertezza con due cifre significative nell'opzione giusta ($0{,}41$ al posto di $0{,}4$, con il valore a due
  decimali; al livello 1 una percentuale con una cifra in più);
- un valore con posizione diversa dall'incertezza ($(101{,}40 \pm 0{,}4)$; al livello 1 $0{,}50\%$ con lo zero
  finale);
- un'unità sbagliata nell'opzione giusta, o `values` diverso dal LaTeX;
- arrotondamenti ambigui: $0{,}7 + 0{,}8 = 1{,}5$ e un volume di $20{,}5$ mL (livello 3), $5 \cdot 0{,}3 = 1{,}5$ cm e
  $0{,}3 : 20 = 0{,}015$ s (livello 5), e tre aree (livello 4) trovate cercando: una con l'incertezza a metà, una con
  il valore a metà, una ($(2{,}0 \pm 0{,}2)$ per $(2{,}3 \pm 0{,}1)$ cm) che è chiara con i numeri esatti ma cambia
  se lo studente arrotonda le incertezze relative a due cifre.

### Esercizi diversi su 1.000

Seed da 1 (tra parentesi da 50001 e da 777001): livello 1 585 (576, 588), livello 2 585 (576, 588), livello 3 999
(1.000, 1.000), livello 4 1.000 (1.000, 1.000), livello 5 984 (970, 977), livello 6 1.000 (1.000, 1.000). I livelli 1
e 2 sono stretti per costruzione: quindici percentuali, un'incertezza di una cifra e il valore che ne viene, in cinque
contesti; lo stesso seed dà ai due livelli la stessa misura, una volta da leggere e una da ricostruire.
