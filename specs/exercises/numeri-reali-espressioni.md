# Espressioni con i radicali

Generatore: `numeri-reali-espressioni` (`src/lib/exercises/v2/generators/numeri-reali-espressioni.ts`).
Verifica indipendente: `scripts/exercises/checkers/numeri_reali_espressioni.py`. Lezione collegata:
`docs/lezioni/riscritte/75-numeri-reali-espressioni.md` (note in `docs/lezioni/note/`, sezione "Per il
generatore", da cui vengono i sette livelli).

Sette livelli nell'ordine della lezione: le somme di radicali, i prodotti notevoli, i quozienti con un
monomio al denominatore, i denominatori binomi, gli indici diversi, poi le equazioni e le
disequazioni con coefficienti irrazionali. Ai livelli 1-5 lo studente calcola un'espressione e la
risposta è un'espressione (`answer.kind = "expression"`, `value` in forma SymPy, `form =
"simplified"` ai livelli 1, 2 e 5, `"rationalized"` ai livelli 3 e 4). Al livello 6 la risposta è
l'insieme delle soluzioni (`set`, un solo valore). Al livello 7 la risposta è a scelta multipla
(`choice`), perché un intervallo non entra in nessun tipo di risposta di oggi.

Consegne: "Calcola e scrivi il risultato nella forma più semplice." (livelli 1, 2, 5), "Calcola e
scrivi il risultato nella forma più semplice, con il denominatore razionale." (livelli 3, 4),
"Risolvi l'equazione." (6), "Risolvi la disequazione." (7).

## Si costruisce dalla risposta

I pezzi si scelgono piccoli e la risposta si calcola in modo esatto: nel campo $\mathbb{Q}(\sqrt{r})$
(numeri $a + b\sqrt{r}$ con $a$ e $b$ razionali, classe `Q2` del generatore) ai livelli 2, 3, 4, 6 e
7, come $k\sqrt[n]{r}$ al livello 1, come prodotto di potenze di primi con esponente razionale al
livello 5. Se la risposta non è bella (denominatore troppo grande, coefficienti grandi, zero) si
estrae di nuovo. Il radicale $r$ è sempre libero da quadrati.

## Risultato finito

La lezione dice quando un risultato è finito, e il verificatore lo controlla sul LaTeX della risposta
e di ogni opzione: un intero, oppure una somma di al più un intero e di termini $k\sqrt[n]{R}$, oppure
una somma così su un denominatore intero $d \ge 2$; ogni radicando senza potenze $n$-esime e con
l'indice non riducibile ($\sqrt[6]{8}$ non va, è $\sqrt{2}$); radicali simili già sommati; nessun
radicale al denominatore; numeratore e denominatore senza fattori comuni ($\frac{2 + 4\sqrt{3}}{2}$
non va, $\frac{3 + 4\sqrt{3}}{2}$ sì); niente coefficiente 1 scritto. La forma di Surd,
$\frac{a + b\sqrt{r}}{d}$, è quella della lezione ("la frazione resta com'è").

## Rappresentazione

`params.case` è il caso del livello; `params.r` il radicando; `params.right` è la risposta come
opzione (`latex` e `values`), `params.named` gli errori tipici e `params.fallback` i distrattori di
riserva, da cui `toChoice` sceglie. Al livello 1 `params.terms` sono i termini $s \cdot c \sqrt{m^n r}$,
al livello 5 i radicali $\sqrt[n]{p^e}$ con l'operazione ($s = 1$ per, $s = -1$ diviso). Al livello 7
`params.rel` e `params.bound` sono il verso e l'estremo della soluzione. Il verificatore non usa i
`params` per ricalcolare: rilegge il testo del problema con un suo parser LaTeX.

## Livello 1: semplificare prima di sommare

Da 2 a 4 radicali dello stesso indice, almeno due da semplificare, tutti simili dopo aver portato
fuori i fattori. Radici quadrate con $r \in \{2, 3, 5, 6, 7\}$, radicando fino a 200, coefficienti 1,
2 o 3; circa una volta su quattro radici cubiche con $r \in \{2, 3, 5\}$, radicando fino a 250.
Risultato $k\sqrt[n]{r}$ con $k \ne 0$, $|k| \le 15$.

1. $\sqrt{50} - 3\sqrt{8} + \sqrt{18} = 5\sqrt{2} - 6\sqrt{2} + 3\sqrt{2} = 2\sqrt{2}$ (esempio 1).
2. $\sqrt[3]{54} + \sqrt[3]{16} - \sqrt[3]{2} = 3\sqrt[3]{2} + 2\sqrt[3]{2} - \sqrt[3]{2} = 4\sqrt[3]{2}$.

## Livello 2: prodotti notevoli

Un quadrato di binomio $(k\sqrt{r} \pm a)^2$ o $(a \pm k\sqrt{r})^2$, più o meno un secondo prodotto
con lo stesso radicale: una somma per differenza (circa 4 su 10, di solito con il meno davanti,
come nell'esempio 2), un altro quadrato, la proprietà distributiva $c\sqrt{r}(\sqrt{r} \pm a)$ o un
prodotto di binomi $(\sqrt{r} + a)(\sqrt{r} + c)$. Risultato $a + b\sqrt{r}$ intero, non nullo,
$|a| \le 80$, $|b| \le 30$; può essere razionale.

1. $(\sqrt{3} + 1)^2 - (\sqrt{3} - 2)(\sqrt{3} + 2) = (4 + 2\sqrt{3}) - (-1) = 5 + 2\sqrt{3}$ (esempio 2).
2. $(\sqrt{2} + 4)^2 + \sqrt{2}(\sqrt{2} - 3) = (18 + 8\sqrt{2}) + (2 - 3\sqrt{2}) = 20 + 5\sqrt{2}$.

## Livello 3: denominatore monomio

Tre casi: una frazione il cui numeratore si divide termine a termine più o meno $\frac{m}{\sqrt{r}}$
(circa 45 su 100, come l'esempio 3); un radicale da semplificare più o meno $\frac{m}{v\sqrt{r}}$, a
volte con un intero (circa 25 su 100); un binomio su un monomio $\frac{a + b\sqrt{r}}{v\sqrt{r}}$ (circa
30 su 100). Risultato $\frac{a + b\sqrt{r}}{d}$ con $d \le 6$, coefficienti fino a 30, non nullo.

1. $\frac{\sqrt{6} + \sqrt{2}}{\sqrt{2}} - \frac{3}{\sqrt{3}} = (\sqrt{3} + 1) - \sqrt{3} = 1$ (esempio 3).
2. $\sqrt{20} - \frac{9}{\sqrt{5}} = 2\sqrt{5} - \frac{9\sqrt{5}}{5} = \frac{\sqrt{5}}{5}$.

## Livello 4: denominatore binomio

Tre casi, circa un terzo ciascuno: due frazioni con denominatori coniugati $\frac{m}{\sqrt{r} - b} \pm
\frac{n}{\sqrt{r} + b}$ (esempio 4); una frazione $\frac{m}{k\sqrt{r} \pm b}$ più un intero o un
radicale; un binomio su un binomio $\frac{\sqrt{r} + c}{\sqrt{r} + d}$. Radicandi $2, 3, 5, 6, 7, 10,
11, 13$. Risultato $\frac{a + b\sqrt{r}}{d}$ con $d \le 6$, coefficienti fino a 40, non nullo.

1. $\frac{1}{\sqrt{3} - 1} + \frac{1}{\sqrt{3} + 1} = \frac{2\sqrt{3}}{2} = \sqrt{3}$ (esempio 4).
2. $\frac{\sqrt{6} + 3}{\sqrt{6} - 1} = \frac{(\sqrt{6} + 3)(\sqrt{6} + 1)}{6 - 1} = \frac{9 + 4\sqrt{6}}{5}$.

## Livello 5: radicali con indici diversi

Due o tre radicali $\sqrt[n]{p^e}$ con $n \in \{2, 3, 4, 6\}$, $e$ primo con $n$, radicando fino a 250,
almeno due indici diversi, moltiplicati o divisi (il diviso si scrive $:$, come nell'esempio 5). Circa
7 su 10 con una base sola ($2$, $3$ o $5$), gli altri con le basi $2$ e $3$. Ogni esponente del
risultato è positivo (niente denominatori da razionalizzare). Risultato $c\sqrt[m]{N}$ semplificato,
con $c \le 30$ e $N \le 1000$; può essere un intero.

1. $\sqrt{2} \cdot \sqrt[3]{4} : \sqrt[6]{2} = \sqrt[6]{2^3 \cdot 2^4 : 2} = \sqrt[6]{2^6} = 2$ (esempio 5).
2. $\sqrt[4]{2} \cdot \sqrt[6]{3} = \sqrt[12]{2^3 \cdot 3^2} = \sqrt[12]{72}$.

L'esempio 6 della lezione (lettere positive, $\sqrt{9a^3} - a\sqrt{4a} + \frac{a^2}{\sqrt{a}}$) non è
qui: vedi le domande per la revisione.

## Livello 6: equazioni con coefficienti irrazionali

Tre casi: due membri con $x$, $k\sqrt{r}\,x + u = mx + w$ (o con il radicale a destra), che dopo il
trasporto danno $(k\sqrt{r} - m)\,x = w - u$ (circa 6 su 10, esempio 7); la forma già raccolta
$(k\sqrt{r} - m)\,x = c_0 + c_1\sqrt{r}$ (circa 2 su 10); radicali simili da semplificare,
$\sqrt{a^2 r}\,x - \sqrt{b^2 r}\,x = c$ (circa 2 su 10, come $\sqrt{8}\,x - \sqrt{2}\,x = 4$ della
lezione). Soluzione $\frac{a + b\sqrt{r}}{d}$ con $d \le 4$, coefficienti fino a 30.

1. $\sqrt{3}\,x - 2 = x$: $(\sqrt{3} - 1)\,x = 2$, $x = \frac{2(\sqrt{3} + 1)}{3 - 1} = \sqrt{3} + 1$ (esempio 7).
2. $\sqrt{27}\,x - \sqrt{12}\,x = 8$: $\sqrt{3}\,x = 8$, $x = \frac{8\sqrt{3}}{3}$.

## Livello 7: disequazioni, il segno del coefficiente

Il coefficiente di $x$ è sempre una differenza, $k\sqrt{r} - m$ o $m - k\sqrt{r}$, così il suo segno si
deve trovare confrontando i quadrati. Negativo circa 55 volte su 100. Due membri con $x$ (circa 6 su
10) o forma raccolta. I passaggi dicono il segno con il confronto dei quadrati e se il verso cambia.
Estremo $\frac{a + b\sqrt{r}}{d}$ con $d \le 4$, coefficienti fino a 30. La soluzione è scritta come
$x \ge \ldots$ e, nell'ultimo passaggio, come intervallo con `\mathopen{]}` e `\mathclose{[}`.

1. $\sqrt{3}\,x - 2 \le 2x$: $(\sqrt{3} - 2)\,x \le 2$, coefficiente negativo, $x \ge -4 - 2\sqrt{3}$ (esempio 8).
2. $(2 - \sqrt{6})\,x < 8$: $(\sqrt{6})^2 = 6 > 2^2 = 4$, coefficiente negativo, $x > -8 - 4\sqrt{6}$.

## Esercizi "brutti" da evitare

- Coefficiente 1 scritto ($1\sqrt{2}$, $1x$), termini nulli, "+ -", esponente 1: vietati nel testo e
  controllati da tutti e due i lati.
- Livello 1 con un solo radicale da semplificare, o con radicali che non diventano simili.
- Risultato nullo ai livelli 1-5 (ai livelli 2 e 3 un risultato razionale è ammesso: la lezione dice
  che succede spesso).
- Livello 5 con tutti gli indici uguali, o con un esponente negativo nel risultato (servirebbe
  razionalizzare, che è il livello 4).
- Livello 7 con un coefficiente somma di due positivi, dove il segno è ovvio.

## Variante a scelta multipla

Quattro opzioni distinte; ai livelli 1-6 `toChoice` sceglie tre distrattori tra gli errori tipici
(mescolati) e poi, se mancano, tra quelli di riserva ($\pm 1$, $\pm\sqrt{r}$). Gli errori tipici sono
quelli dei riquadri della lezione:

- livello 1: i fattori portati fuori dimenticati ($(1 - 3 + 1)\sqrt{2}$), coefficiente e fattore
  sommati invece che moltiplicati, il segno dell'ultimo termine; circa una volta su tre il risultato
  giusto non semplificato ($\sqrt{8}$ per $2\sqrt{2}$), che ha lo stesso valore ma non è finito;
- livello 2: il doppio prodotto dimenticato (riquadro "Il quadrato di un binomio senza il doppio
  prodotto"), la somma per differenza con il segno sbagliato ($r + b^2$), il meno davanti che cambia
  solo il primo termine, termini non simili sommati ($2 + 3\sqrt{2} = 5\sqrt{2}$);
- livello 3: $\frac{m}{\sqrt{r}} = m\sqrt{r}$ (dimenticato di dividere per $r$), il segno
  dell'operazione, la semplificazione di un termine solo (riquadro "Semplificare solo un termine"),
  termini non simili sommati;
- livello 4: il coniugato sbagliato (moltiplicato per lo stesso binomio), $r + b^2$ al denominatore,
  il segno dell'operazione, la semplificazione di un termine solo;
- livello 5: gli indici portati allo stesso valore senza alzare gli esponenti
  ($\sqrt{2} \cdot \sqrt[3]{4} = \sqrt[6]{8}$), il diviso letto come per, il risultato non
  semplificato ($\sqrt[6]{128}$ per $2\sqrt[6]{2}$, stesso valore);
- livello 6: il coniugato sbagliato, $r + m^2$ al denominatore, il segno, il numeratore non
  moltiplicato per il coniugato; con i radicali simili, $\sqrt{27} - \sqrt{12}$ letto come
  $\sqrt{15}$ (riquadro "La radice di una somma"), la divisione per $r$ dimenticata;
- livello 7: il verso non cambiato con un coefficiente negativo, o cambiato con uno positivo
  (riquadro "Il meno che non si vede"), l'estremo con gli stessi errori del livello 6.

Il verificatore conta come giusta un'opzione solo se ha il valore della risposta e se è finita: ne
deve esserci esattamente una, quella indicata da `correct`. Un'opzione con lo stesso valore ma non
finita è un distrattore legittimo. Controlla anche che i `values` di ogni opzione dicano la stessa
cosa del suo testo.

## Figure

Nessun livello ha bisogno di una figura. Il livello 7 potrebbe mostrare la soluzione sulla retta dei
numeri, come la figura dell'esempio 8 della lezione.

## Verifiche fatte (27 settembre 2026)

- `sample.mts numeri-reali-espressioni 1000 all 1 | verify.py`: PASS, 7.000 su 7.000; con il seed di
  partenza 7001: PASS, 7.000 su 7.000. Quote dei casi nei limiti di `CASE_RANGES`.
- Esercizi diversi su 1.000 per livello (seed da 1): 815, 978, 945, 890, 600, 965, 977.
- Errori piantati a mano, tutti bocciati: risposta cambiata (livello 2); risposta $\sqrt{12}$ invece
  di $2\sqrt{3}$ (1); $\frac{1}{\sqrt{3}}$ invece di $\frac{\sqrt{3}}{3}$ (3); frazione con numeratore
  e denominatore moltiplicati per 2 (3); `correct` spostato (4); indici tutti uguali (5); un solo
  radicale da semplificare (1); soluzione sbagliata (6); verso non cambiato nell'opzione giusta (7);
  due opzioni uguali (2); `params.case` sbagliato (4); opzione giusta scritta non semplificata (1);
  $\sqrt[6]{128}$ e $\sqrt[6]{8}$ come risposta (5); denominatore binomio al livello 3; coefficiente
  razionale al livello 6.
- `width.mts numeri-reali-espressioni`: esce con 0; problema più largo 293 px (livello 2), opzione
  più larga 130 px (livelli 6 e 7).
- `review.mts` esce con 0; lo scan dei passaggi con `presentStep` e KaTeX non trova errori; `tsc` e
  `eslint --max-warnings=0` puliti sul generatore.
- Il verificatore svuota la cache di SymPy ogni 100 campioni: senza, i 7.000 campioni in un solo
  processo finivano la memoria e il processo veniva ucciso.

## Domande per la revisione

- L'esempio 6 della lezione (espressioni con una lettera positiva) non ha un livello: il livello 5
  delle note metteva insieme indici diversi e lettere, che sono due difficoltà. Serve un livello in
  più con le lettere?
- Ai livelli 1 e 5 un distrattore ha il valore giusto ma non è semplificato ($\sqrt{8}$ per
  $2\sqrt{2}$): la consegna chiede la forma più semplice, ma uno studente potrebbe sentirlo come un
  tranello. Va bene, o si tiene solo nella risposta aperta?
- Al livello 4 compaiono risultati con il denominatore fino a 6 come $\frac{10 + 7\sqrt{10}}{6}$: sono
  nel limite dei libri, o si stringe a 4?
- Il livello 7 è solo a scelta multipla: per la risposta aperta servirà un tipo "intervallo".
- I radicali doppi del riquadro finale non hanno esercizi (la nota li dà per facoltativi).
