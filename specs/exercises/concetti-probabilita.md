# Eventi e probabilità

Generatore: `concetti-probabilita` (`src/lib/exercises/v2/generators/concetti-probabilita.ts`).
Verifica indipendente: `scripts/exercises/checkers/concetti_probabilita.py`. Lezione collegata:
"Eventi e probabilità" (`docs/lezioni/riscritte/94-concetti-probabilita.md`), con la sezione "Per il
generatore" della sua nota (`docs/lezioni/note/94-concetti-probabilita.md`).

Lo studente calcola con la definizione classica la probabilità di un evento descritto a parole: sul
dado, su un'urna di palline numerate, su due o tre monete, su un'urna di palline colorate, sul mazzo
di 40 carte, sulla somma di due dadi. Riconosce l'evento certo, l'impossibile e l'elementare, trova
l'intersezione di due eventi e dice se sono compatibili. Con la definizione frequentista stima una
probabilità da una frequenza relativa e ne ricava un numero atteso. Le formule della probabilità
dell'evento contrario e dell'unione sono della lezione 95 e qui non servono: gli esiti si contano
elencandoli.

## Rappresentazione

- Il problema è prosa (`textBlock`), con l'esperimento e poi l'evento tra virgolette come nella
  lezione: `Si lancia un dado non truccato. Evento: "esce un numero pari".` Al livello 2 i due
  eventi sono `$A$ = "..."`, `$B$ = "..."`.
- Notazioni della lezione: $p$ per la probabilità, $\Omega$ non compare nel testo, frazioni con
  `\dfrac`, esiti delle monete come parole ($TC$), esiti di due dadi e di dado e moneta come coppie
  ordinate $(a, b)$ e $(T, 4)$ con la virgola, virgola decimale (`0{,}024`), spazio sottile da
  cinque cifre (`10\,000`, anche nella prosa come `$10\,000$`).
- I passaggi dicono i casi possibili, elencano i casi favorevoli (con virgole di testo tra un esito e
  l'altro, così la riga va a capo) e scrivono $p = \dfrac{\text{casi favorevoli}}{\text{casi
  possibili}}$ con la frazione non ridotta e poi ridotta.
- `params` ha `case`, l'evento come frase (`event`), il numero dei casi possibili (`total`), i casi
  favorevoli (elencati, o contati al livello 4 e 5) e, per le risposte numeriche, `mistakes`: i
  valori sbagliati da cui nasce la scelta multipla.

## Regole comuni

- La risposta è `number` (un razionale esatto, `"3/10"`) ai livelli 1, 3, 4, 5, 6 e 7; `choice` al
  livello 2. Un numero si confronta per valore: $\dfrac{2}{6}$ scritto dallo studente vale come
  $\dfrac{1}{3}$ (la nota lo chiede).
- Nessuna probabilità è $0$ o $1$ ai livelli 1 e 3-6: gli eventi certi e impossibili stanno al
  livello 2.
- Scelta multipla: quattro opzioni diverse come numeri. Ai livelli 1-6 le opzioni sono frazioni
  ridotte strettamente tra $0$ e $1$ (un $0$ o un $1$ si scarterebbe da solo); prima i distrattori
  degli errori della lezione, poi i vicini $\frac{k \pm d}{n}$, e con due monete, quando i vicini
  finiscono, altre frazioni piccole ($\frac{1}{3}$, $\frac{2}{3}$, $\frac{1}{8}$...). Al livello 7
  le opzioni sono decimali con al massimo tre cifre o interi.
- Nel testo niente trattini lunghi e niente decimali con il punto.

## Livello 1: un dado o un'urna di palline numerate

Dado a sei facce (50%) o urna con $n$ palline numerate da $1$ a $n$, $n$ tra $10$, $12$, $15$, $16$,
$18$, $20$, $24$, $25$, $30$ (50%). Eventi: numero pari, dispari, primo, multiplo di $m$, maggiore di
$k$, minore di $k$, diverso da $k$, divisore di $d$, quadrato perfetto (solo urna). Si sceglie prima
il tipo di evento, poi il parametro. Almeno due casi favorevoli e non tutti: niente evento
elementare, certo o impossibile.

- Dado, "esce un multiplo di 3": casi $3$, $6$, $p = \dfrac{2}{6} = \dfrac{1}{3}$; opzioni
  $\dfrac{1}{3}$, $\dfrac{2}{3}$ (i casi sfavorevoli), $\dfrac{1}{2}$ ("o succede o no"),
  $\dfrac{1}{6}$.
- Urna di $10$, "esce un numero minore di 4": $p = \dfrac{3}{10}$; opzioni $\dfrac{3}{10}$,
  $\dfrac{7}{10}$, $\dfrac{1}{2}$, $\dfrac{3}{7}$ (favorevoli su sfavorevoli).

Distrattori: i casi sfavorevoli su $n$, $\dfrac{1}{2}$, favorevoli su sfavorevoli, $\dfrac{1}{n}$.

## Livello 2: eventi certi, impossibili, compatibili

Due casi.

`tipo` (40%): "Che tipo di evento è?" Un evento sul dado (75%) o su due monete (25%); un quarto
ciascuno certo ("esce un numero minore di 9", "escono al massimo due teste"), impossibile ("esce 7",
"escono tre teste", come nell'esempio 1), elementare ("esce un multiplo di 5", "escono due croci"),
nessuno dei tre. Opzioni sempre nello stesso ordine: "evento certo", "evento impossibile", "evento
elementare", "nessuno dei tre". Nei passaggi l'evento scritto come insieme.

`compatibili` (30%) e `incompatibili` (30%): due eventi sul dado (70%) o su due monete (30%), ognuno
con da uno a quattro esiti (tre per le monete), diversi come insiemi. "Trova A ∩ B e di' se gli
eventi sono compatibili." Ogni opzione è un insieme e un verdetto su due righe (`gathered`):
$A \cap B = \{4, 6\}$ e sotto "compatibili".

- Dado, $A$ = "esce un numero pari", $B$ = "esce un numero maggiore di 3": opzioni $\{4, 6\}$
  compatibili (giusta), $\{4, 6\}$ incompatibili (il distrattore della nota: incompatibili pur con
  esiti in comune), $\emptyset$ incompatibili, $\{2, 4, 5, 6\}$ compatibili (l'unione al posto
  dell'intersezione).
- Dado, $A$ = "esce un numero maggiore di 2", $B$ = "esce un numero minore di 3": opzioni
  $\emptyset$ incompatibili (giusta), $\emptyset$ compatibili (definizione rovesciata), l'unione
  compatibili, l'unione incompatibili.

## Livello 3: monete ed esiti ordinati

Due monete (30%), tre monete (45%), un dado e una moneta (25%). Eventi delle monete: esattamente,
almeno, al massimo una o due teste (o croci), nessuna testa, facce uguali o diverse, la prima (o la
seconda) moneta dà testa. Dado e moneta: "esce testa e un numero pari", "esce croce e il numero 6",
con gli eventi del dado del livello 1 da uno a quattro esiti. I passaggi elencano gli esiti
nell'ordine della lezione ($TTT$, $TTC$, $TCT$, $TCC$, $CTT$...) e ricordano che i risultati contati
per numero di teste non sono equiprobabili.

- Tre monete, "esce esattamente una testa": $p = \dfrac{3}{8}$; opzioni $\dfrac{3}{8}$,
  $\dfrac{1}{4}$ (un risultato su quattro, contati senza ordine), $\dfrac{1}{8}$, $\dfrac{5}{8}$.
- Due monete, "escono una testa e una croce": $p = \dfrac{1}{2}$; tra le opzioni $\dfrac{1}{3}$.
- Dado e moneta, "esce testa e un numero dispari": $p = \dfrac{3}{12} = \dfrac{1}{4}$; tra le
  opzioni $\dfrac{3}{8}$ (gli esiti contati $2 + 6$).

Distrattori: i risultati "per numero di teste" come se fossero equiprobabili (quando l'evento dipende
solo da quante teste escono: $\frac{1}{3}$ e $\frac{2}{3}$ con due monete, quarti con tre), un esito
solo, i casi sfavorevoli, $\frac{1}{2}$; per dado e moneta i casi su $8$, la probabilità del solo
dado, $\frac{1}{12}$.

## Livello 4: urna con palline di più colori

Tre contesti, un terzo ciascuno: palline in un'urna, caramelle di gusti diversi in un sacchetto,
penne colorate in un astuccio. 3 colori (60%) o 4, da $1$ a $9$ oggetti per colore (il primo almeno
$2$), da $6$ a $24$ in tutto. Evento: un colore (50%), "che non è" un colore (25%), uno di due colori
(25%). La probabilità è diversa da quella che si otterrebbe contando i colori ($\frac{1}{c}$,
$\frac{c-1}{c}$, $\frac{2}{c}$), così il distrattore dell'esempio 5 è sempre sbagliato.

- Urna con $3$ rosse, $5$ blu, $2$ verdi, "esce una pallina rossa": $p = \dfrac{3}{10}$; opzioni
  $\dfrac{3}{10}$, $\dfrac{1}{3}$ (un colore su tre), $\dfrac{3}{7}$, $\dfrac{7}{10}$.
- Sacchetto con $6$ all'arancia, $5$ al limone, $4$ alla menta, "esce una caramella all'arancia":
  $p = \dfrac{6}{15} = \dfrac{2}{5}$.

Distrattori: il conto sui colori, favorevoli su sfavorevoli, i casi sfavorevoli, $\frac{1}{n}$.

## Livello 5: una carta dal mazzo di 40

Mazzo napoletano come nel riquadro della lezione. Dodici tipi di evento, scelti con la stessa
probabilità: un asso (o fante, cavallo, re), un $v$ con $v$ da $2$ a $7$, una figura, una carta di un
seme, una carta precisa ("il re di spade"), una figura di un seme, una carta di due semi, uno di due
valori ("un asso o un re"), una carta che non è una figura, una carta di un seme che non è una
figura, valore minore di $k$ ($k$ da $3$ a $8$), valore maggiore di $k$ ($k$ da $3$ a $8$).

- "Esce una figura": $12$ casi, $p = \dfrac{12}{40} = \dfrac{3}{10}$; opzioni $\dfrac{3}{10}$,
  $\dfrac{3}{40}$ (le figure di un seme solo), $\dfrac{3}{13}$ ($12$ su $52$, il mazzo francese),
  $\dfrac{7}{10}$.
- "Esce il re di spade": $p = \dfrac{1}{40}$; opzioni $\dfrac{1}{40}$, $\dfrac{1}{52}$,
  $\dfrac{1}{10}$, $\dfrac{39}{40}$.

Distrattori: i casi favorevoli su $52$, le carte di un seme solo quando l'evento non nomina un seme,
i casi sfavorevoli, i casi su $10$.

## Livello 6: due dadi

Cinque casi: somma uguale a $s$, con $s$ da $3$ a $11$ (40%); somma minore o maggiore di $s$, $s$ da
$4$ a $10$ (20%); due numeri uguali (10%); almeno un $v$ (15%); altri eventi (15%: somma pari o
dispari, somma multiplo di $3$, $4$ o $5$, il primo dado maggiore o minore del secondo, i numeri
differiscono di $d$, prodotto $4$, $6$ o $12$, due numeri pari o due dispari). I passaggi elencano le
coppie favorevoli, o per le disuguaglianze le contano somma per somma.

- "La somma è 7": $p = \dfrac{6}{36} = \dfrac{1}{6}$; opzioni $\dfrac{1}{6}$, $\dfrac{1}{11}$ (le
  somme possibili), $\dfrac{1}{12}$ (tre coppie senza ordine su $36$), $\dfrac{1}{7}$ (tre su $21$).
- "Esce almeno un 2": $p = \dfrac{11}{36}$; opzioni $\dfrac{11}{36}$, $\dfrac{1}{3}$ ($(2, 2)$
  contata due volte), $\dfrac{5}{18}$ ($(2, 2)$ dimenticata), $\dfrac{1}{6}$.

Distrattori: $\frac{1}{11}$ e le coppie senza ordine (somma data), il numero delle somme su $11$, la
somma di confine contata ("minore" letto come "minore o uguale"), i casi sfavorevoli (disuguaglianza),
$\frac{2}{7}$, $\frac{1}{36}$, $\frac{5}{6}$ (doppio), $\frac{12}{36}$ e $\frac{10}{36}$ (almeno un
numero), le coppie senza ordine su $36$ e su $21$ (altri eventi).

## Livello 7: frequenza relativa e stima

Cinque contesti, un quinto ciascuno: lampadine difettose (l'esempio 8), semi che germogliano, una
puntina che cade con la punta in su, tiri liberi segnati, bulloni difettosi. $N$ tra $50$ e $1000$,
$f_a$ piccolo per i difetti (fino al $12\%$ di $N$), tra il $20\%$ e il $90\%$ negli altri.

`frequenza` (60%): "Stima la probabilità che...". Risposta $f_r = \dfrac{f_a}{N}$, decimale con al
massimo tre cifre. Esempio: $12$ lampadine difettose su $500$, $f_r = 0{,}024$; opzioni $0{,}024$,
$2{,}4$ (la percentuale scritta come numero), $0{,}976$ (il complemento), $0{,}24$.

`stima` (40%): "Quante ... ci si aspetta su $M$?", $M$ tra $600$, $1000$, $1500$, $2000$, $3000$,
$5000$, $10\,000$. Risposta $f_r \cdot M$, intera. Esempio: $136$ su $400$, $M = 10\,000$, risposta
$3400$; opzioni $3400$, $6600$ (il complemento), $34\,000$ (la virgola spostata), $1360$.

Distrattori: $\frac{N}{f_a}$ (quando è un decimale di tre cifre: la nota lo propone, ma quasi mai lo
è), la percentuale come numero, il complemento, la frequenza per $10$; nella stima il complemento,
il risultato per $10$, $10 f_a$, il risultato più $f_a$.

## Verifica

Il controllo Python rilegge l'esperimento e l'evento dalla prosa del problema, con espressioni
regolari sue per ogni frase di evento; enumera lo spazio campionario con `itertools` (il dado, le
palline numerate, le parole di $T$ e $C$, le coppie moneta-dado e dado-dado, le 40 carte come coppie
valore-seme, le palline colorate una per una) e calcola la probabilità con `Fraction`. Confronta
risposta, soluzione (la frazione ridotta), `params.total`, i casi favorevoli e `case`. Controlla che
ogni opzione dica il valore che dichiara, ridotto, strettamente tra $0$ e $1$ ai livelli 1-6, che le
opzioni siano quattro e diverse come numeri (al livello 2 come coppie insieme-verdetto, con
l'insieme confrontato come insieme: $\{6, 2\}$ e $\{2, 6\}$ sono la stessa opzione), che una sola
sia giusta e che `correct` la indichi, e che ci siano i distrattori con nome: i casi sfavorevoli
(livello 1), il verdetto sbagliato e l'unione (livello 2), i risultati senza ordine e i casi su $8$
(livello 3), il conto sui colori (livello 4), i casi su $52$ e un seme solo (livello 5),
$\frac{1}{11}$ e $\frac{12}{36}$ (livello 6), il complemento (livello 7).

Esito (28 settembre 2026, 1.000 esercizi per livello): PASS con seed 1 e con seed 50001, 7.000 su
7.000. Quote dei casi dentro gli intervalli di `CASE_RANGES` con tutti e due i seed.

Esercizi diversi su 1.000 (seed 1 / seed 50001): livello 1 257 / 278, livello 2 400 / 386, livello
3 73 / 74, livello 4 1.000 / 1.000, livello 5 62 / 62, livello 6 46 / 46, livello 7 880 / 911. I
livelli 3, 5 e 6 hanno pochi esercizi possibili perché lo spazio campionario è piccolo e fisso: sono
tutti gli eventi del catalogo (62 sul mazzo, 46 sui due dadi).

Errori piantati a mano, tutti bocciati (18): risposta cambiata; opzione non ridotta
($\dfrac{2}{4}$); evento elementare al livello 1; soluzione sbagliata; `correct` spostato (livello 2
e 3); verdetto dell'opzione diverso dai suoi `values`; stesso insieme scritto in un altro ordine in
due opzioni; caso compatibili su eventi incompatibili; esiti non elencati nei passaggi (tre monete);
distrattore dei colori tolto; urna del problema diversa dalla risposta; evento e risposta del mazzo
cambiati; casi favorevoli manomessi (livello 6); distrattore $\frac{1}{11}$ tolto; punto decimale in
un'opzione; numero atteso cambiato; `params` diversi dal testo (livello 7).

Larghezza (`width.mts`, 150 esercizi per livello): il problema è tutto prosa; nessuna opzione oltre
252 px, la più larga è un'opzione del livello 2 con $223$ px ($A \cap B = \{1, 2, 3, 4, 5, 6\}$).

## Figure

- Livello 6: la tabella $6 \times 6$ delle somme della lezione (`due-dadi-tabella-somme`, senza
  colori) aiuterebbe a contare le coppie; oggi lo studente la deve ricostruire.
- Livello 2: il diagramma di Venn del dado (`eventi-dado-diagramma-venn`) con i due eventi dati
  renderebbe visibile l'intersezione, ma darebbe la risposta.
- Livello 3: l'elenco degli otto esiti di tre monete è nei passaggi; non serve una figura.

## Domande per la revisione

- Livello 1: l'urna con palline numerate fino a $30$ e gli eventi "divisore di $d$" e "quadrato
  perfetto" non sono nella lezione, che usa solo il dado. Vanno bene come variante, o si resta sul
  dado (e il livello avrebbe una trentina di esercizi)?
- Livello 2: "evento elementare" è accanto a "certo" e "impossibile" come quarta categoria, con
  "nessuno dei tre" per gli altri. Su un dado "esce un multiplo di 5" è elementare: è una domanda
  giusta per il biennio, o troppo di vocabolario?
- Livello 2: il caso del riquadro "Incompatibili in un esperimento, compatibili in un altro" (due
  dadi, "il primo dà 6" e "il secondo dà 1") non c'è: gli insiemi di coppie non stanno in
  un'opzione sul telefono. Serve un caso a parte, con risposta solo "compatibili" o "incompatibili"?
- Livello 3: il dado con la moneta non è un esempio della lezione, che però spiega gli esiti come
  coppie. Si tiene?
- Livello 5: la nota della lezione dice che le carte piacentine e siciliane sono uguali per i
  conti. Il testo dice sempre "napoletane": va bene così?
- Livello 6: "i due numeri differiscono di $d$" e "il prodotto è $k$" sono fuori dagli esempi della
  lezione, messi per avere più di trenta esercizi. Il livello resta comunque sotto i cinquanta.
- Livello 7: la nota propone il distrattore $\frac{500}{12}$ (il rapporto rovesciato), che quasi
  mai è un decimale finito e non si può scrivere accanto agli altri; al suo posto c'è la percentuale
  scritta come numero ($2{,}4$). Va bene?
- Notazione $p(E)$ o $P(E)$, e $TC$ o $(T, C)$ per le monete: il generatore segue la lezione, quindi
  cambia con lei (è già nelle domande della nota).
