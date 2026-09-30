# Note: Il pendolo e la molla

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 16, 30 settembre 2026). Conti rifatti in Python:
$2\pi\sqrt{0{,}5/20} = 0{,}9935$ s, $2\pi\sqrt{2/20} = 1{,}987$ s, $2\pi\sqrt{40} = 39{,}7$; $4\pi^2 \cdot 0{,}2/0{,}63^2 = 19{,}89$ N/m;
$2\pi\sqrt{1/9{,}8} = 2{,}0071$ s, $9{,}8 \cdot 4/(4\pi^2) = 0{,}99295$ m; $35{,}9/20 = 1{,}795$ s, $4\pi^2 \cdot 0{,}8/1{,}795^2 =
9{,}802$; $2\pi\sqrt{1/1{,}62} = 4{,}937$ s, $4{,}94/2{,}01 = 2{,}46$; $\sin 10^\circ = 0{,}17365$, $10^\circ = 0{,}17453$ rad.
Tabella delle ampiezze dal periodo esatto con l'integrale ellittico completo, $T/T_0 = \tfrac{2}{\pi}K(\sin^2(\theta_0/2))$
(scipy): $1{,}0019$ a $10^\circ$, $1{,}0077$ a $20^\circ$, $1{,}0174$ a $30^\circ$, $1{,}0400$ a $45^\circ$, $1{,}0732$ a $60^\circ$,
$1{,}1803$ a $90^\circ$; la figura interattiva, con il suo passo di Runge-Kutta, dà $2{,}011$ s contro $2{,}007$ s a $10^\circ$
con il filo di un metro ($0{,}2\,\%$). `check.mts` passa.

## Struttura ed esempi

Il moto armonico e la forza di richiamo ($a = -\omega^2 x$, $F = -Kx$ dà $\omega^2 = K/m$); la massa sulla molla
($F = -kx$, la figura, $T = 2\pi\sqrt{m/k}$, da cosa dipende, la molla in verticale), gli esempi 1 (il periodo, la massa
quadrupla) e 2 (la costante dal periodo, con il perché delle molte oscillazioni), l'avviso sulla massa e la costante
scambiate; il pendolo semplice (le forze, la scomposizione, $\sin\theta \approx \theta$, $T = 2\pi\sqrt{l/g}$), l'esempio
3 (il pendolo di un metro, quello che batte il secondo); da che cosa dipende (non la massa, isocronismo, la radice
della lunghezza, la tabella delle ampiezze grandi), l'avviso sulla massa nel pendolo, l'esempio 4 (misurare $g$); il
confronto in tabella e la Luna; la figura interattiva.

## Scelte

- La lezione si appoggia sul moto armonico della lezione 49 (gruppo 14), che dà $a = -\omega^2 x$, chiama $\omega$
  pulsazione e rimanda a questa lezione per la molla: controllato il 30 settembre.
- $K$ maiuscola per la costante di una forza di richiamo generica, per non confonderla con la $k$ della molla.
- $\theta$ in radianti, con il rimando al moto circolare uniforme (lezione 47), che introduce i radianti.
- La tensione del filo del pendolo è $\vec{T}$ con la freccia, come chiedono le notazioni del secondo anno, perché $T$ è
  il periodo; nel testo non compare il suo modulo.
- La tabella delle ampiezze grandi dà i risultati senza il calcolo (l'integrale ellittico non si fa al biennio).
- Galileo e l'isocronismo: una frase, senza date e senza l'aneddoto del lampadario di Pisa (da verificare).
- $g$ sulla Luna $1{,}62\,\text{m/s}^2$: valore standard, da verificare sulla fonte che userà il capitolo della
  gravitazione.

## Figure

Due TikZ, guardate in chiaro e in scuro: `blocco-molla-forza-richiamo`, `pendolo-forze-componenti` (angolo di
$25^\circ$, peso di $1{,}4$ cm, componenti di $0{,}59$ e $1{,}27$ cm, tensione uguale alla componente lungo il filo come nel
punto di inversione). Interattiva `pendolo-periodo-ampiezza` (`fisica/PendoloAmpiezza.tsx`), fatta partendo da
`PendoloPeriodo.tsx` della lezione 01 senza modificarlo: lunghezza da $0{,}2$ a $2{,}0$ m, massa da $50$ a $500$ g,
ampiezza da $5^\circ$ a $80^\circ$; il moto viene da un passo di Runge-Kutta del quarto ordine ogni millisecondo, senza
l'approssimazione degli angoli piccoli; il periodo si calcola integrando dal rilascio al punto di inversione successivo
(mezzo periodo) e si confronta con $2\pi\sqrt{l/g}$, con la differenza in percentuale; un contatore conta le oscillazioni
mentre il pendolo oscilla. `PendoloPeriodo.tsx` usa $L$ maiuscola per la lunghezza, questa lezione $l$ minuscola.

## Esercizi

Generatore `fis-pendolo-molla`, cinque livelli (specifica in `specs/exercises/fis-pendolo-molla.md`), senza scene.

## Domande per Andrea

- La pulsazione $\omega$ e la relazione $a = -\omega^2 x$ vengono dalla lezione sul moto armonico: nell'Amaldi di
  seconda il periodo della molla si ricava così, o si dà la formula e basta?
- Il pendolo con $\sin\theta \approx \theta$ in radianti: si fa in seconda, o è meglio dare $T = 2\pi\sqrt{l/g}$ come
  risultato sperimentale?
- La lunghezza del pendolo $l$ minuscola (come qui) o $L$ maiuscola (come la figura della lezione 01)?
- La tabella del periodo per ampiezze grandi: utile o fuori programma?
