# Numeri irrazionali e numeri reali

Generatore: `numeri-reali-irrazionali`
(`src/lib/exercises/v2/generators/numeri-reali-irrazionali.ts`). Verifica indipendente:
`scripts/exercises/checkers/numeri_reali_irrazionali.py`. Lezione collegata: "Numeri irrazionali e
numeri reali" (`docs/lezioni/riscritte/71-numeri-reali-irrazionali.md`), livelli presi dalla sezione
"Per il generatore" della sua nota.

Lo studente riconosce le radici quadrate razionali, distingue i decimali razionali da quelli
irrazionali, trova le approssimazioni per difetto e per eccesso di una radice, confronta e ordina
numeri reali e stabilisce se il risultato di un conto con le radici è razionale. Sette livelli
nell'ordine della lezione.

## Rappresentazione

Ogni numero nasce dal suo valore esatto: una radice $\pm\sqrt{R}$ con $R$ razionale, un razionale o
$\pi$. I confronti sono esatti (segno, poi radicando; $\pi$ contro una radice con 12 cifre esatte), le
cifre decimali vengono da radici quadrate intere su BigInt. Il controllo Python rilegge ogni numero dal
LaTeX che lo studente vede e lo valuta con SymPy.

## Regole comuni

- Virgola decimale `{,}`, periodo sotto `\overline{}` in forma canonica, `\cdot` per il prodotto.
- Niente radici con indice maggiore di 2 e niente lettere sotto radice: la lezione usa solo la
  definizione di $\sqrt{a}$ e $\sqrt{a} \cdot \sqrt{a} = a$.
- Scelta multipla sempre con quattro opzioni distinte e una sola giusta.

## Livello 1: radici razionali o irrazionali

"Quale di questi numeri è razionale?" oppure "... irrazionale?" (metà e metà), con quattro radici
quadrate di cui una sola ha la proprietà chiesta. Tipi razionali: quadrato perfetto ($\sqrt{49}$),
frazione di quadrati ($\sqrt{\frac{4}{9}}$), frazione non ridotta che si riduce a quadrati
($\sqrt{\frac{8}{18}}$), decimale quadrato di un decimale ($\sqrt{0{,}49}$). Tipi irrazionali: naturale
vicino a un quadrato ($\sqrt{50}$), solo il denominatore quadrato ($\sqrt{\frac{2}{9}}$), solo il
numeratore quadrato ($\sqrt{\frac{4}{7}}$), frazione non ridotta con il numeratore quadrato che si
riduce a una non quadrata ($\sqrt{\frac{4}{8}}$, $\sqrt{\frac{9}{12}}$), decimale con le cifre di un
quadrato ($\sqrt{0{,}9}$, $\sqrt{2{,}5}$, $\sqrt{4{,}9}$). I tre distrattori sono di tre tipi diversi
dell'altra famiglia. Un passaggio per opzione, con il motivo.

Esempi: irrazionale tra $\sqrt{0{,}81}$, $\sqrt{\frac{16}{81}}$, $\sqrt{17}$, $\sqrt{144}$ è
$\sqrt{17}$; razionale tra $\sqrt{196}$, $\sqrt{1{,}6}$, $\sqrt{\frac{36}{54}}$, $\sqrt{\frac{7}{36}}$ è
$\sqrt{196}$ ($\frac{36}{54} = \frac{2}{3}$ non è una frazione di quadrati).

## Livello 2: razionale o irrazionale dal decimale

Stessa domanda sui decimali. Razionali: decimali limitati vicini a un irrazionale ($3{,}14$,
$3{,}1415$, $2{,}236$), il valore della calcolatrice con nove decimali ($1{,}414213562$),
$\frac{22}{7}$, periodici con periodo lungo (settimi, tredicesimi, diciassettesimi:
$0{,}\overline{0588235294117647}$) e periodici corti. Irrazionali: $\pi$, decimali costruiti con un
blocco che si allunga ($0{,}2722722272227\ldots$, $0{,}1010010001\ldots$), e $\sqrt{n}$ solo quando la
domanda chiede il razionale. Quando si chiede l'irrazionale la risposta è $\pi$ o un decimale
costruito, metà e metà.

Esempi: irrazionale tra $2{,}449489742$, $0{,}8\overline{5}$, $1{,}\overline{923076}$, $\pi$ è $\pi$;
razionale tra $0{,}7373373337\ldots$, $\pi$, $2{,}05005000500005\ldots$, $3{,}1415$ è $3{,}1415$.

## Livello 3: approssimazioni di √n

"Trova l'approssimazione per difetto (o per eccesso) al decimo (o al centesimo)" di $\sqrt{n}$, con $n$
non quadrato: fino a 99 al decimo, fino a 50 al centesimo. Difetto ed eccesso metà e metà, decimo e
centesimo metà e metà. Risposta `number`. I passaggi seguono il metodo della lezione: i due quadrati
interi, poi i quadrati dei decimi, poi dei centesimi.

Esempi: $\sqrt{17}$ per difetto al centesimo: $4{,}12^2 = 16{,}9744$ e $4{,}13^2 = 17{,}0569$, quindi
$4{,}12$; $\sqrt{2}$ per eccesso al centesimo: $1{,}42$.

## Livello 4: approssimazioni di −√n

Come il livello 3 con $-\sqrt{n}$: dopo i quadrati, un passaggio cambia il verso delle disuguaglianze
($-2{,}65 < -\sqrt{7} < -2{,}64$). La difficoltà in più è quella del riquadro della lezione: per difetto
è il numero con il valore assoluto più grande.

Esempi: $-\sqrt{17}$ per difetto al centesimo: $-4{,}13$; $-\sqrt{2}$ per eccesso al centesimo:
$-1{,}41$.

## Livello 5: confronto tra due numeri reali

"Quale di queste disuguaglianze è vera?" Quattro disuguaglianze, una per tipo: due radici
($\sqrt{27} < \sqrt{33}$), una radice e un intero vicino ($\sqrt{10} > 3$), una radice e un decimale
vicino, limitato o periodico ($\sqrt{2} > 1{,}4\overline{1}$), due negativi ($-\sqrt{5} < -2$,
$-\sqrt{32} < -\sqrt{31}$, $-\sqrt{50} > -7{,}1$). Le tre false sono vere con il verso girato. Il tipo
della disuguaglianza vera ruota: circa un quarto ciascuno. I passaggi usano i quadrati per radici e
interi, le cifre (quattro decimali) per i decimali, e "tra i positivi, poi cambia il verso" per i
negativi.

Esempi: vera tra $\sqrt{20} < 4{,}4\overline{6}$, $-3{,}4 > -\sqrt{11}$, $8 > \sqrt{50}$,
$\sqrt{44} < \sqrt{40}$ è $8 > \sqrt{50}$; vera tra $6{,}8 < \sqrt{46}$, $\sqrt{42} < \sqrt{38}$,
$-\sqrt{31} < -5$, $\sqrt{30} < 5$ è $-\sqrt{31} < -5$.

## Livello 6: mettere in ordine

Quattro numeri in ordine crescente, come nell'esempio 5 della lezione: una radice $\sqrt{n}$ ($n \le
30$) o $\pi$, un periodico con la stessa prima cifra decimale, una frazione vicina con denominatore da 3
a 9, e un negativo ($-\sqrt{m}$ o un decimale come $-1{,}7$); oppure due positivi e due negativi vicini
($-\sqrt{3}$ e $-1{,}7$). Metà e metà. I quattro numeri hanno i primi quattro decimali diversi, così si
ordinano con le cifre. Le opzioni sono catene $a < b < c < d$.

Esempi: $-\sqrt{15}$, $\sqrt{13}$, $3{,}6\overline{1}$, $-3{,}8$ danno
$-\sqrt{15} < -3{,}8 < \sqrt{13} < 3{,}6\overline{1}$; $\frac{11}{3}$, $\sqrt{14}$, $-4{,}3$,
$-\sqrt{18}$ danno $-4{,}3 < -\sqrt{18} < \frac{11}{3} < \sqrt{14}$.

## Livello 7: operazioni, razionale o irrazionale

"Calcola e stabilisci se il risultato è razionale", con i conti dell'esempio 7: somma che cancella la
radice $(3 - \sqrt{5}) + (\sqrt{5} + 1)$, prodotto per il coniugato $(2 + \sqrt{3})(2 - \sqrt{3})$,
prodotto $k\sqrt{r} \cdot \sqrt{r}$ (razionali); distributiva $\sqrt{2}\,(\sqrt{2} + 1)$, quadrato di
binomio $(1 \pm \sqrt{2})^2$, somma di due irrazionali $(\sqrt{r} + a) + (\sqrt{r} - a)$ (irrazionali).
Sei forme uniformi, razionale e irrazionale metà e metà. $r$ tra 2, 3, 5, 6, 7, 10, 11; $a, c$ da 1 a 5.
Risposta `expression` (il valore, per esempio `9+4*sqrt(5)`); ogni opzione della scelta multipla è
"valore (razionale)" oppure "valore (irrazionale)".

Esempi: $(2 + \sqrt{5})^2 = 9 + 4\sqrt{5}$, irrazionale; $2\sqrt{2} \cdot \sqrt{2} = 4$, razionale.

## Da evitare

- Decimali con i puntini che non mostrano la regola: $0{,}272727\ldots$ è ambiguo. I soli $\ldots$
  ammessi sono quelli dei decimali costruiti, e il controllo riconosce il blocco che cresce.
- Numeri da ordinare che coincidono fino al quarto decimale.
- Un decimale "vicino" che è un intero al livello 5 (cambierebbe il tipo della coppia).
- Il punto decimale.

## Variante a scelta multipla

- Livelli 1 e 2: le quattro opzioni del testo; i distrattori sono le trappole dei riquadri della
  lezione (frazione non ridotta, $3{,}14$ e $\frac{22}{7}$ al posto di $\pi$, la cifra della
  calcolatrice, il periodo lungo scambiato per irrazionale).
- Livelli 3 e 4: difetto ed eccesso scambiati (per $-\sqrt{n}$ è anche il troncamento del riquadro),
  il segno perso, la stessa approssimazione con una cifra in meno o in più; se non bastano, un vicino.
- Livello 5: le disuguaglianze con il verso girato (per i negativi è l'errore del riquadro, il
  confronto dei quadrati senza cambiare verso).
- Livello 6: i due negativi scambiati (ordinati per valore assoluto), i due positivi più vicini
  scambiati, il negativo messo dove andrebbe il suo valore assoluto, l'ordine decrescente.
- Livello 7: il valore giusto con il verdetto sbagliato ("due irrazionali danno un irrazionale"), il
  doppio prodotto dimenticato ($a^2 + b$), il 2 del doppio prodotto dimenticato; nel coniugato $a^2 + b$ (segno),
  $a - b$ ($a$ non elevato al quadrato) e i termini con la radice non cancellati; $\sqrt{r} \cdot \sqrt{r} = \sqrt{r}$, $\sqrt{r} + \sqrt{r} = \sqrt{2r}$. Ogni
  distrattore sbaglia una cosa sola: o il valore (con il suo verdetto vero) o il verdetto.

## Verifica

- `sample.mts numeri-reali-irrazionali 1000 all 1 | verify.py`: PASS, 7.000 esercizi. Con seed 7001:
  PASS. Quote nei limiti (livello 5 da 218 a 264 per tipo su 1.000).
- Esercizi diversi su 1.000 (seed da 1): livello 1: 1.000; 2: 991; 3: 259; 4: 259; 5: 1.000; 6: 999;
  7: 298. I livelli 3 e 4 sono quasi tutti quelli possibili ($n$ fino a 99 o 50, due precisioni, difetto
  o eccesso).
- Errori piantati, tutti bocciati: opzione giusta spostata (livelli 1, 2, 5, 6), un distrattore che è
  anche giusto ($\sqrt{\frac{8}{18}}$ tra gli irrazionali), un decimale periodico scritto con i
  puntini, risposta cambiata (3, 7), difetto ed eccesso scambiati, troncamento del negativo come
  risposta, segno perso al livello 4, radicando quadrato perfetto, disuguaglianza vera girata, numero
  del testo cambiato al livello 6, verdetto sbagliato sull'opzione giusta, radicale non semplificato
  (`sqrt(8)`), distrattore sbagliato due volte, punto decimale, generatore in errore.
- `width.mts`: 0 oltre il limite; la formula più larga del problema è 197 px (livello 7), l'opzione
  più larga 216 px (livello 6).
- `review.mts` esce con 0; `steps-scan` non segnala niente.

## Figure

Nessun livello ne ha bisogno. La costruzione di $\sqrt{2}$ e $\sqrt{5}$ sulla retta con riga e
compasso (esempio 3) resta fuori: vorrebbe una figura, per esempio "quale punto della retta è
$\sqrt{5}$", e si può aggiungere quando il sito genererà figure.

## Domande per la revisione

- Al livello 2 i decimali costruiti ($0{,}2722722272227\ldots$) si leggono senza la frase "dopo ogni 7
  c'è un 2 in più" che la lezione aggiunge: con quattro blocchi la regola si vede, ma uno studente
  potrebbe dire che non si sa come continua. Va bene così o serve la frase?
- Al livello 7 la risposta aperta è solo il valore; il verdetto razionale o irrazionale c'è solo nella
  scelta multipla. Per la risposta aperta serve un tipo con due campi.
- I livelli 3 e 4 ammettono solo decimo e centesimo: serve anche l'unità o il millesimo? E per i
  negativi va bene la convenzione della lezione (per difetto è il minore), che alcuni libri non usano?
