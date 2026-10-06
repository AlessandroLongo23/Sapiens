# Regressione e correlazione

Generatore: `regressione-correlazione`
(`src/lib/exercises/v2/generators/regressione-correlazione.ts`), con il modulo comune del capitolo
`src/lib/exercises/v2/bivariata.ts`. Verifica indipendente:
`scripts/exercises/checkers/regressione_correlazione.py`, con `_bivariata.py`. Lezione collegata:
"Regressione e correlazione" (`docs/lezioni/riscritte/129-regressione-correlazione.md`).

Lo studente calcola la covarianza di poche coppie di dati, il coefficiente angolare della retta di
regressione, la retta e una stima a partire dagli indici, il coefficiente di correlazione lineare
(dagli indici, poi dai dati con l'arrotondamento) e legge che cosa dice un valore di $r$. I sette
livelli seguono l'ordine della lezione e ognuno aggiunge una sola difficoltà.

## Costruzione all'indietro

I livelli sui dati (1, 2, 6) partono dagli scarti: 4 o 5 scarti interi di $x$, tutti diversi, tra $-5$
e $5$ con somma zero, e altrettanti scarti di $y$ tra $-4$ e $4$ con somma zero e almeno tre valori
diversi. Poi due medie intere che tengono i dati nell'intervallo della storia. Le coppie si scrivono
in ordine crescente di $x$. Così medie e scarti sono interi e covarianza e varianze sono decimali
finiti. Le storie:

| storia | $x$ | $y$ | segno della covarianza |
|---|---|---|---|
| studenti: ore di studio e voto | da 1 a 12 | da 3 a 10 | positivo |
| auto usate: anni e prezzo in migliaia di euro | da 1 a 12 | da 2 a 20 | negativo |
| giocatori: allenamenti e gol | da 2 a 16 | da 0 a 12 | positivo |
| coppie di valori senza storia | da 0 a 12 | da 0 a 20 | qualunque, non zero |

I livelli sugli indici (3, 4, 5) partono dal risultato: un coefficiente angolare $m$ preso tra
$0{,}25$, $0{,}4$, $0{,}5$, $0{,}6$, $0{,}75$, $0{,}8$, $1{,}2$, $1{,}5$, $2$, $2{,}5$, $3$ (con il
segno), oppure un $r$ preso tra $0{,}25$, $0{,}3$, $0{,}4$, $0{,}5$, $0{,}6$, $0{,}7$, $0{,}75$,
$0{,}8$, $0{,}9$ (con il segno); la covarianza si ricava da lì.

## Convenzioni

- Quelle della lezione: $\bar{x}$, $\bar{y}$, $\sigma_{xy}$, $\sigma_x^2$, $\sigma_y^2$, $\sigma_x$,
  $\sigma_y$, $r$; retta $y = mx + q$ con $m = \dfrac{\sigma_{xy}}{\sigma_x^2}$ e
  $q = \bar{y} - m\bar{x}$; covarianza e varianze con divisione per $n$.
- Le coppie stanno in una tabella di due righe, $x$ sopra e $y$ sotto; gli indici su due righe di
  due dati ciascuna.
- Virgola decimale `{,}`. Un valore esatto si scrive senza zeri in coda. Al livello 6 la consegna dice
  "arrotondato al centesimo", tutte le opzioni hanno due cifre dopo la virgola e la soluzione ha
  $\approx$; l'arrotondamento è per eccesso da 5 in su, sul valore assoluto. Al livello 7 $r$ è scritto
  con due cifre.
- La retta si scrive $y = 0{,}5x + 3{,}5$: il coefficiente $1$ non si scrive, il termine noto zero
  nemmeno, il segno del termine noto fa da operazione.
- I livelli 1, 2, 4, 5, 6 hanno risposta `number`, con la scelta multipla costruita da
  `params.mistakes` e, se gli errori non bastano, dai vicini nell'ultima cifra mostrata; per $r$ le
  opzioni restano tra $-1$ e $1$. I livelli 3 e 7 hanno risposta `choice`.

## Livello 1: covarianza

"Calcola la covarianza." su 4 o 5 coppie. Covarianza diversa da zero, con al massimo due decimali.

Distrattori: la somma dei prodotti non divisa per $n$; la media dei prodotti presi senza segno;
la covarianza con il segno scambiato; la media dei prodotti $x_i y_i$ senza togliere
$\bar{x} \cdot \bar{y}$.

Esempi: $x$: $0, 3, 5, 8$ e $y$: $14, 18, 15, 17$ → prodotti $8, -2, -1, 4$,
$\sigma_{xy} = \dfrac{9}{4} = 2{,}25$; $x$: $2, 3, 5, 10$ e $y$: $16, 19, 19, 14$ →
$\sigma_{xy} = \dfrac{-16}{4} = -4$.

## Livello 2: coefficiente angolare dai dati

"Calcola il coefficiente angolare della retta di regressione di y rispetto a x." Serve in più la
varianza di $x$. $m$ con al massimo due decimali, diverso da $1$ e da $-1$.

Distrattori: la covarianza (ci si ferma prima); la covarianza divisa per la varianza di $y$; il
rapporto rovesciato $\dfrac{\sigma_x^2}{\sigma_{xy}}$; $m$ con il segno scambiato.

Esempi: $x$: $2, 4, 5, 8, 11$ e $y$: $6, 8, 3, 9, 9$ → $\sigma_{xy} = 4$, $\sigma_x^2 = 10$,
$m = 0{,}4$; $x$: $1, 3, 4, 5, 7$ e $y$: $3, 5, 10, 7, 5$ → $\sigma_{xy} = 1{,}6$, $\sigma_x^2 = 4$,
$m = 0{,}4$.

## Livello 3: la retta dagli indici

Sono dati $\bar{x}$ (da 2 a 12), $\bar{y}$ (da 5 a 40), $\sigma_x$ (da 2 a 5: lo scarto quadratico
medio, non la varianza) e $\sigma_{xy}$. "Scegli la retta di regressione di y rispetto a x." $m$
positivo nel 60% dei casi; $q$ diverso da zero e da $m$. Risposta `choice`.

Distrattori: la retta con $m = \dfrac{\sigma_{xy}}{\sigma_x}$ (l'avviso "varianza in $m$" della
lezione) e il suo $q$; $q = \bar{y} + m\bar{x}$; $m$ e $q$ scambiati; $q = \bar{y}$. Riserva: $q$
aumentato di 1, 2, ...

Esempi: $\bar{x} = 8$, $\bar{y} = 35$, $\sigma_x = 4$, $\sigma_{xy} = 40$ → $m = \dfrac{40}{16} = 2{,}5$,
$q = 35 - 20 = 15$, $y = 2{,}5x + 15$ (opzioni $y = 15x + 2{,}5$, $y = 10x - 45$, $y = 2{,}5x + 15$,
$y = 2{,}5x + 55$); $\bar{x} = 12$, $\bar{y} = 10$, $\sigma_x = 4$, $\sigma_{xy} = 4$ →
$y = 0{,}25x + 7$.

## Livello 4: stima con la retta

Sono dati $\bar{x}$ (da 4 a 20), $\bar{y}$ (da 10 a 60), $\sigma_x^2$ (tra 4, 5, 8, 10, 16, 20, 25) e
$\sigma_{xy}$. "Stima il valore di y per x = 15 con la retta di regressione di y rispetto a x.": il
valore di $x$ dista dalla media da 1 a 4, quindi resta vicino ai dati; la stima è positiva e $q$ non è
zero.

Distrattori: $m \cdot x$ senza $q$; $\bar{y} + m \cdot x$ ($q$ preso uguale alla media); la stima con
$q = \bar{y} + m\bar{x}$; la media $\bar{y}$.

Esempi: $\bar{x} = 14$, $\bar{y} = 53$, $\sigma_x^2 = 16$, $\sigma_{xy} = 40$, $x = 15$ →
$y = 2{,}5x + 18$, stima $55{,}5$; $\bar{x} = 20$, $\bar{y} = 17$, $\sigma_x^2 = 16$, $\sigma_{xy} = 4$,
$x = 16$ → $y = 0{,}25x + 12$, stima $16$.

## Livello 5: correlazione dagli indici

"Calcola il coefficiente di correlazione lineare." Sono dati $\sigma_{xy}$ (con al massimo un
decimale) e, metà delle volte, i due scarti quadratici medi (interi diversi da 2 a 6), l'altra metà
le due varianze, che sono i loro quadrati: lì serve prima la radice. $r$ esatto.

Distrattori: la covarianza divisa per il prodotto delle varianze (caso "varianze") o per la varianza
di $x$ (caso "scarti"); la covarianza divisa per la somma degli scarti; $r$ con il segno scambiato;
sempre dentro $[-1, 1]$.

Esempi: $\sigma_x^2 = 16$, $\sigma_y^2 = 36$, $\sigma_{xy} = 12$ → $r = \dfrac{12}{4 \cdot 6} = 0{,}5$;
$\sigma_x = 6$, $\sigma_y = 2$, $\sigma_{xy} = -6$ → $r = -0{,}5$.

## Livello 6: correlazione dai dati

"Calcola il coefficiente di correlazione lineare, arrotondato al centesimo." su 4 o 5 coppie. $r$ non
è esatto al centesimo e in valore assoluto sta tra $0{,}20$ e $0{,}98$.

Distrattori: la covarianza divisa per il prodotto delle varianze, senza radice; $r$ con il segno
scambiato; $r$ troncato, quando è diverso dall'arrotondato; il coefficiente angolare $m$.

Esempi: $x$: $0, 3, 5, 8$ e $y$: $14, 18, 15, 17$ → $\sigma_{xy} = 2{,}25$, $\sigma_x^2 = 8{,}5$,
$\sigma_y^2 = 2{,}5$, $r = \dfrac{2{,}25}{\sqrt{21{,}25}} \approx 0{,}49$; $x$: $2, 3, 5, 10$ e $y$:
$16, 19, 19, 14$ → $r = \dfrac{-4}{\sqrt{42{,}75}} \approx -0{,}61$.

## Livello 7: leggere r

Una storia di una riga e un valore di $r$. Tre casi: positiva (35%), con $r$ da $0{,}80$ a $0{,}98$;
negativa (35%), con $r$ da $-0{,}98$ a $-0{,}80$; nulla (30%), con $r$ da $-0{,}09$ a $0{,}09$. "Che
cosa dice questo valore del coefficiente di correlazione lineare?" Le opzioni sono sempre le stesse
quattro: "Al crescere di $x$, $y$ in genere cresce"; "Al crescere di $x$, $y$ in genere diminuisce";
"Tra $x$ e $y$ non c'è un legame lineare"; "$x$ è la causa di $y$". L'ultima non è mai giusta: è
l'avviso "correlazione non vuol dire causa".

Esempi: temperatura e cioccolate calde, $r = -0{,}90$ → "in genere diminuisce"; numero di scarpe e
voto di italiano, $r = 0{,}03$ → "non c'è un legame lineare".

## Esercizi da evitare

- Medie non intere, scarti di $x$ ripetuti (due unità con lo stesso $x$), covarianza zero.
- Una storia con il segno sbagliato: auto che costano di più invecchiando.
- $m = 1$ o $m = -1$ al livello 2, $q = 0$ ai livelli 3 e 4.
- Al livello 4, un valore di $x$ lontano dalla media: la lezione avverte che fuori dai dati la retta
  non vale.
- Al livello 6, un $r$ che al centesimo è esatto, o così vicino a $1$ che l'arrotondamento dà $1{,}00$.
- Valori di $r$ tra $0{,}1$ e $0{,}8$ al livello 7: la lezione non dà soglie per "forte" e "debole".

## Risposta aperta

Livelli 1, 2, 4, 5, 6: risposta numerica, proposti come `V`. Livelli 3 e 7: solo scelta multipla (al
3 la retta si potrebbe chiedere in forma esplicita, ma il generatore la dà come `choice`).
