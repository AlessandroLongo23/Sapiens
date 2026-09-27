# Razionalizzazione

Generatore: `radicali-razionalizzazione` (`src/lib/exercises/v2/generators/radicali-razionalizzazione.ts`).
Verifica indipendente: `scripts/exercises/checkers/radicali_razionalizzazione.py`. Lezione collegata:
`docs/lezioni/riscritte/74-radicali-razionalizzazione.md` (note in `docs/lezioni/note/`).

Lo studente riceve una frazione con un radicale al denominatore e la scrive con il denominatore
razionale. La consegna è "Razionalizza il denominatore e semplifica il risultato."; quando ci sono
lettere si aggiunge "Le lettere indicano numeri positivi.", come nel riquadro della lezione. La
risposta è un'espressione (`answer.kind = "expression"`, `form = "rationalized"`) con `value` in forma
SymPy (`(5/2)*sqrt(2)`, `(2)*(27)**(1/5)`, `(6*sqrt(x)+(-6)*sqrt(y))/(x-y)`).

## Si costruisce dalla risposta

Il denominatore si sceglie in modo che il risultato sia pulito: ai livelli 1-4 il numeratore è spesso
un multiplo di un divisore del denominatore razionalizzato ($\frac{6}{\sqrt{3}} = 2\sqrt{3}$); ai livelli
5-6 il numeratore è $c = t \cdot D / s$, dove $D$ è il denominatore dopo il prodotto per il coniugato e
$s$ un suo divisore fino a 6, così il risultato è $t \cdot (\text{coniugato}) / s$; nel caso con il
radicale al numeratore si sceglie prima il risultato $u + v\sqrt{r}$ e il numeratore è il risultato per il
denominatore. Al livello 7 i modelli con le lettere danno sempre un risultato semplice.

## Forma della risposta

Una risposta è giusta se ha il valore della frazione e se è nella forma finale che la lezione chiede
nel paragrafo "Controllare il risultato": nessun radicale in un denominatore; ogni radicando senza
fattori da portare fuori e con l'indice più piccolo possibile ($\sqrt[4]{4}$ va scritto $\sqrt{2}$);
la frazione ridotta (nessun fattore comune tra i numeri fuori dalla radice e il denominatore, né lettere
comuni); il denominatore positivo; i radicali simili sommati. Il verificatore lo controlla sull'albero
della formula letta dal LaTeX. Quindi $\frac{30\sqrt{2}}{2}$, $\frac{\sqrt{12}}{4}$ e
$\frac{x\sqrt{xy}}{xy}$ hanno il valore giusto ma sono risposte sbagliate.

Ordine dei termini: ai livelli 5-6 con un numero al numeratore il risultato segue l'ordine del
coniugato ($\frac{4}{\sqrt{5} - 1} = \sqrt{5} + 1$, $\frac{3}{2 - \sqrt{7}} = -2 - \sqrt{7}$, come negli
esempi 8 e 11); con un radicale anche al numeratore prima il numero ($2 + \sqrt{3}$, esempio 12). Un
termine negativo seguito da uno positivo si scambia: $\frac{\sqrt{15} - \sqrt{5}}{2}$, non
$\frac{-\sqrt{5} + \sqrt{15}}{2}$.

## Rappresentazione

`params.case` è il caso del livello. Ai livelli 1-4 `params.mono` contiene il numeratore (`b` e le
lettere `numLit`), il numero davanti alla radice `k`, l'indice `n` e il radicando `rad` scomposto in
fattori (primi e lettere con esponente). Ai livelli 5-6 `params.bin` contiene il numeratore `num` e i due
termini del denominatore `den`, ognuno come coefficiente intero `c` e radicando `r` ($r = 1$ per un
numero). Al livello 7 `params.let` contiene il modello `t` (da 1 a 5), `c`, `k`, il segno `s` e le
lettere `v`, `w`. Il verificatore non usa questi parametri per ricalcolare la risposta: rilegge la
frazione dal testo del problema e la valuta con SymPy, lettere positive.

## Livello 1: denominatore con una radice quadrata

$\frac{b}{\sqrt{a}}$ (metà) o $\frac{b}{k\sqrt{a}}$ con $k$ da 2 a 5 (metà), $a$ senza fattori quadrati
fino a 30 (fino a 15 con il $k$), $b$ fino a 30 (fino a 20 con il $k$).

1. $\frac{6}{\sqrt{3}} = \frac{6\sqrt{3}}{3} = 2\sqrt{3}$ (esempio 1 della lezione).
2. $\frac{5}{2\sqrt{10}} = \frac{5\sqrt{10}}{20} = \frac{\sqrt{10}}{4}$ (esempio 2).

## Livello 2: prima semplifica il radicale, o con le lettere

7 su 10: $\frac{b}{\sqrt{m^2 r}}$ con $m$ da 2 a 5, $r$ senza fattori quadrati, radicando fino a 200.
3 su 10: lettere positive, $\frac{t \cdot \ldots}{\sqrt{m \cdot \ldots}}$ con una o due lettere
($x, y$ oppure $a, b$) di esponente 1 e $m \in \{1, 2, 3, 5, 6\}$.

1. $\frac{3}{\sqrt{12}} = \frac{3}{2\sqrt{3}} = \frac{3\sqrt{3}}{6} = \frac{\sqrt{3}}{2}$ (esempio 3).
2. $\frac{x}{\sqrt{xy}} = \frac{x\sqrt{xy}}{xy} = \frac{\sqrt{xy}}{y}$ (esempio 4).

## Livello 3: radice di indice n di una potenza

$\frac{b}{\sqrt[n]{p^m}}$ con $p \in \{2, 3, 5, 7\}$, $n$ da 3 a 5, $m$ primo con $n$ (così nessun indice
si riduce), $p^m$ e $p^{n-m}$ fino a 250, scritti come numeri. Fattore razionalizzante
$\sqrt[n]{p^{n-m}}$. Circa 6 su 10 con indice 3.

1. $\frac{10}{\sqrt[5]{8}} = \frac{10\sqrt[5]{4}}{2} = 5\sqrt[5]{4}$ (esempio 5).
2. $\frac{2}{\sqrt[3]{2}} = \frac{2\sqrt[3]{4}}{2} = \sqrt[3]{4}$.

## Livello 4: radice di indice n con due fattori o con le lettere

6 su 10: due primi, $\sqrt[n]{p^i q^j}$ con $n \in \{3, 4\}$, $i, j < n$, $\gcd(i, j, n) = 1$, radicando e
fattore razionalizzante fino a 400. 4 su 10: lettere, $\sqrt[n]{u^i v^j}$ con $n$ da 3 a 5 (a volte una
lettera sola), numeratore con nessuna, una o due lettere.

1. $\frac{6}{\sqrt[3]{12}} = \frac{6\sqrt[3]{18}}{6} = \sqrt[3]{18}$ (esempio 6).
2. $\frac{a}{\sqrt[4]{a^3b}} = \frac{a\sqrt[4]{ab^3}}{ab} = \frac{\sqrt[4]{ab^3}}{b}$ (esempio 7).

## Livello 5: binomio al denominatore, il coniugato

Numeratore intero, denominatore $a \pm \sqrt{r}$ o $\sqrt{r} \pm a$ (circa 55 su 100) oppure
$\sqrt{p} \pm \sqrt{r}$ (circa 45 su 100), tutti i radicali con coefficiente 1. Il denominatore dopo il
prodotto è positivo e fino a 30: il numero o il radicale maggiore sta sempre per primo.

1. $\frac{4}{\sqrt{5} - 1} = \frac{4(\sqrt{5} + 1)}{4} = \sqrt{5} + 1$ (esempio 8).
2. $\frac{2}{\sqrt{7} + \sqrt{5}} = \frac{2(\sqrt{7} - \sqrt{5})}{2} = \sqrt{7} - \sqrt{5}$ (esempio 9).

## Livello 6: coniugato, i casi scomodi

Un terzo ciascuno, e in ogni esercizio uno solo dei tre:

- coefficiente davanti al radicale: $a \pm k\sqrt{r}$ o $k\sqrt{r} \pm a$ con $k$ da 2 a 4,
  denominatore positivo dopo il prodotto: $\frac{1}{3 - 2\sqrt{2}} = 3 + 2\sqrt{2}$ (esempio 10);
- denominatore negativo dopo il prodotto: $a \pm \sqrt{r}$ con $a^2 < r$ o $\sqrt{p} \pm \sqrt{r}$ con
  $p < r$: $\frac{3}{2 - \sqrt{7}} = -2 - \sqrt{7}$ (esempio 11);
- radicale anche al numeratore, con lo stesso radicando del denominatore:
  $\frac{\sqrt{3} + 1}{\sqrt{3} - 1} = 2 + \sqrt{3}$ (esempio 12); il numeratore ha il primo termine
  positivo e coefficienti fino a 20.

## Livello 7: coniugato con le lettere

Cinque modelli, circa un quinto ciascuno, con il segno del denominatore a caso:

- $\frac{cx}{\sqrt{x + k^2} \mp k} = c\sqrt{x + k^2} \pm ck$ (esempio 13), $c$ da 1 a 4, $k$ da 1 a 5;
- $\frac{x - k^2}{\sqrt{x} \mp k} = \sqrt{x} \pm k$, $k$ da 1 a 6;
- $\frac{c(a - b)}{\sqrt{a} \mp \sqrt{b}} = c\sqrt{a} \pm c\sqrt{b}$ (riquadro "A volte si semplifica senza
  razionalizzare"), $c$ da 1 a 3;
- $\frac{c}{\sqrt{a} \mp \sqrt{b}} = \frac{c\sqrt{a} \pm c\sqrt{b}}{a - b}$, $c$ da 1 a 6;
- $\frac{c}{\sqrt{x} \mp k} = \frac{c\sqrt{x} \pm ck}{x - k^2}$, $c$ da 1 a 5, $k$ da 1 a 5.

Quando il denominatore si può annullare per valori positivi delle lettere (con il meno), o quando lo
può il denominatore razionalizzato ($a - b$, $x - k^2$), la condizione è scritta accanto al problema,
separata da `\quad`: $\frac{1}{\sqrt{x} - 2} \quad x \neq 4$. Il verificatore controlla che ci sia.

## Regole comuni

- Mai un coefficiente 1 scritto, mai "+ -", mai un denominatore 1.
- Nessun numero oltre 400 nella risposta.
- I passaggi seguono la lezione: il radicale semplificato (livello 2), il fattore razionalizzante con il
  motivo ($\sqrt[5]{8} \cdot \sqrt[5]{4} = \sqrt[5]{32} = 2$), il coniugato, il prodotto al denominatore
  con i quadrati dei due termini, la catena di uguaglianze fino al risultato; con il denominatore negativo,
  la frase sul cambio di segno di tutti i termini. Il verificatore controlla che ogni uguaglianza dei
  passaggi sia vera (con le lettere, in tre punti razionali).

## Scelta multipla

Quattro opzioni distinte. I distrattori vengono dagli avvisi della lezione:

- moltiplicare solo il denominatore ($\frac{6}{\sqrt{3}} = \frac{6}{3} = 2$): il risultato senza radicale;
- dimenticare il denominatore dopo il prodotto ($6\sqrt{3}$);
- semplificare un numero sotto la radice con uno fuori ($\frac{\sqrt{10}}{4} \to \frac{\sqrt{5}}{2}$), solo
  se sotto la radice resta qualcosa;
- con l'indice $n > 2$, moltiplicare per lo stesso radicale ($\sqrt[5]{8}$ al posto di $\sqrt[5]{4}$) o
  prendere $p^m$ come denominatore;
- con le lettere, la lettera sbagliata al denominatore ($\frac{\sqrt{xy}}{x}$);
- in metà degli esercizi dei livelli 1-4, se esiste, un'opzione con il valore giusto nella forma
  sbagliata: la frazione non ridotta ($\frac{30\sqrt{2}}{2}$) o, al livello 2, il radicale non semplificato
  ($\frac{\sqrt{12}}{4}$). Al più una per esercizio; il verificatore la conta come sbagliata per la forma;
- il coniugato sbagliato: lo stesso binomio al numeratore;
- il segno meno solo sul primo termine ($-2 + \sqrt{7}$) e il segno del denominatore perso
  ($2 + \sqrt{7}$);
- $(2\sqrt{2})^2$ preso come $4$ o come $2 \cdot 2$, quindi un denominatore sbagliato;
- la somma per differenza con il più ($A^2 + B^2$);
- spezzare il denominatore ($\frac{c}{a + \sqrt{b}} = \frac{c}{a} + \frac{c}{\sqrt{b}}$, razionalizzato),
  solo quando il risultato ha numeri piccoli;
- diviso per $D$ solo il primo termine del numeratore ($\frac{4 + 2\sqrt{3}}{2} \to 2 + 2\sqrt{3}$);
- al livello 7: $\sqrt{x + k^2}$ spezzato in $\sqrt{x} + k$, $\sqrt{a - b}$, $k^2$ al posto di $k$, il
  denominatore $x + k^2$ o $x - k$, i segni.

Se mancano, coefficienti vicini a quelli giusti.

## Da evitare

- Radicandi con fattori da portare fuori dove il livello non li prevede, indici riducibili
  ($\sqrt[4]{4}$), un radicale che sparisce in un distrattore per semplificazione ($\sqrt{2}/10 \to 1/5$).
- Denominatori che dopo il prodotto valgono più di 30 in valore assoluto.
- Al livello 6, due difficoltà nello stesso esercizio.

## Figure

Nessun livello ha bisogno di una figura: l'argomento è tutto di calcolo.

## Verifica (27 settembre 2026)

- `sample.mts radicali-razionalizzazione 1000 all 1 | verify.py`: PASS, 7.000 esercizi. Con il seed di
  partenza 7001: PASS.
- Quote dei casi controllate da `CASE_RANGES` ai livelli 1, 2, 4, 5 e 6.
- Esercizi diversi su 1.000 per livello (seed da 1): 570, 501, 223, 462, 724, 824, 219. Il livello 3 ha
  pochi casi per costruzione (22 combinazioni di primo, indice ed esponente per circa 12 numeratori),
  il livello 7 ha modelli fissi con parametri piccoli; tutti e due restano sopra 100.
- `width.mts`: 0 formule oltre 350 px e 0 opzioni oltre 252 px; massimo 111 px per il problema (livello
  7) e 124 px per un'opzione.
- `review.mts` esce con 0; `steps-scan.mts` non trova passaggi che KaTeX non disegna.
- Errori piantati a mano, tutti bocciati: risposta cambiata ($14\sqrt{2}$ al posto di $15\sqrt{2}$);
  risposta con il valore giusto non ridotta ($\frac{30\sqrt{2}}{2}$); risposta con la radice al
  denominatore; radicale non semplificato ($\frac{5\sqrt{8}}{4}$); frazione non ridotta con l'indice 5;
  opzione giusta spostata (livelli 1, 4, 5, 6, 7); due opzioni uguali; `values` di un'opzione diverso
  dal suo LaTeX; numeratore del testo cambiato, così che la risposta non torna (livelli 1, 3, 5); testo
  con il radicando cambiato (livelli 5 e 7); vincolo del livello 1 violato ($\sqrt{12}$); caso sbagliato
  in `params.case`; condizione $x \neq y$ tolta al livello 7; un passaggio falso; denominatore negativo
  lasciato nella risposta.

## Domande per la revisione

- L'opzione "giusta ma non semplificata" ($\frac{30\sqrt{2}}{2}$, $\frac{\sqrt{12}}{4}$) conta come
  sbagliata. La consegna dice "semplifica il risultato", ma uno studente che la sceglie ha razionalizzato
  bene: va tenuta, e in metà degli esercizi come oggi?
- Ordine dei termini del risultato: segue il coniugato ($\sqrt{5} + 1$) o mette prima il numero
  ($1 + \sqrt{5}$)? Oggi segue la lezione, che fa tutte e due le cose (esempi 8 e 12). Al livello 7 il
  risultato $\frac{c\sqrt{a} + c\sqrt{b}}{a - b}$ è sviluppato: il libro in uso scrive
  $\frac{c(\sqrt{a} + \sqrt{b})}{a - b}$?
- Il livello 4 non ha radicandi con un esponente maggiore dell'indice da portare fuori prima
  ($\frac{1}{\sqrt[3]{48}}$), che la lezione cita in una frase: serve un livello o un caso in più? I due
  riquadri `ad-note` (tre termini, radici cubiche nel binomio) restano fuori, come nelle carte.
