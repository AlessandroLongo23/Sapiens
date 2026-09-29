# Note: Le forze e il dinamometro

Lezione nuova, scritta da zero (primo lotto di fisica, gruppo 5, 29 settembre 2026). I conti di lezione, formulario
e carte sono rifatti con SymPy in `verifica_lezioni.py` (scratchpad del lotto, 52 controlli sulle quattro lezioni del
gruppo): la mela da $100$ g e il newton ($1 / 9{,}8 = 0{,}102$ kg), la persona di $60$ kg ($588 \approx 590$ N), le
sensibilità, la lettura $1{,}3$ N, le risultanti $200$, $40$, $50$ e $\sqrt{1125} = 33{,}5 \approx 34$ N, l'angolo di
$36{,}87^\circ \approx 37^\circ$. `check.mts` passa senza avvisi.

## Struttura ed esempi

Che cos'è una forza (effetti statici e dinamici), la forza come vettore (i quattro elementi), il newton con tre ordini
di grandezza, forze di contatto e a distanza, il dinamometro (com'è fatto, portata e sensibilità, come si legge, in
passi), la risultante nei tre casi facili. Quattro esempi: la lettura del dinamometro della figura; due ragazzi e una
slitta (stesso verso e versi opposti); due forze perpendicolari ($30$ e $40$ N); tre forze su due direzioni. Avvisi:
la forza non si misura in chilogrammi, oltre la portata la molla si rovina, la risultante non è la somma dei moduli.

## Scelte

- Il newton si dà come unità derivata con $1\ \text{N} = 1\ \text{kg} \cdot \text{m/s}^2$ e il rimando al secondo
  principio; l'Amaldi del biennio lo introduce così? Da verificare sul libro.
- Il dinamometro è quello con l'indice su una scala fissa (il tipo "a molla con indice"); i dinamometri a tubo, con la
  scala sul cilindretto interno che esce, sono diffusi nei laboratori ma si leggono allo stesso modo. Non li ho
  descritti.
- Incertezza di una lettura singola uguale alla sensibilità, come nella lezione 04 "Gli strumenti di misura" (che
  dice anche che alcuni libri usano metà della sensibilità).
- Le direzioni negli esempi 3 e 4 con i punti cardinali (est, nord), per non dire "verso destra" di una forza su un
  corpo visto dall'alto.
- L'equilibrio è solo un cenno in chiusura, con il link alla prima lezione del capitolo successivo.
- La definizione di forza ("capace di cambiarne il movimento o di deformarlo") è quella di molti libri del biennio;
  non ho la formulazione esatta dell'Amaldi.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `forza-caratteristiche` (scala $1$ cm per $10$ N, la freccia di $20$ N è
lunga $2$ cm), `dinamometro-struttura` (portata $2$ N, $20$ divisioni da $0{,}15$ cm, indice a $1{,}3$ N; l'asta lunga
quanto la scala più $0{,}5$ cm, come nel pezzo del kit, perciò il gancio scende con l'indice), `risultante-stessa-direzione`
($1$ cm per $40$ N: $3$, $2$, $5$ e $1$ cm), `risultante-forze-perpendicolari` e `risultante-tre-forze` ($1$ cm per
$10$ N). Le due forze nello stesso verso sono disegnate una sopra l'altra, e il testo lo dice.

Interattiva `dinamometro-pesetti` (`src/components/content/interactive/fisica/DinamometroPesetti.tsx`): pesetti da
$0{,}5$ N e $0{,}2$ N su un portapesi, due dinamometri (portata $2$ N e sensibilità $0{,}1$ N; portata $5$ N e
sensibilità $0{,}5$ N), la lettura con l'incertezza e l'avviso oltre la portata. Il pezzo del dinamometro è in
`fisica/Dinamometro.tsx`, usato anche dalla figura della lezione 17 e dalla scena degli esercizi.

## Esercizi

Generatore `forze`, specifica in `specs/exercises/forze.md`: cinque livelli (leggere il dinamometro, portata e
sensibilità, forze sulla stessa retta, forze perpendicolari, più forze su due direzioni), scene `dinamometro` e
`punto-forze`. `punto-forze` è nuova: `blocco-forze` disegna sempre un blocco di $1{,}2 \times 0{,}8$ cm, che copre le
frecce sotto i $0{,}6$ cm.

## Lasciato ad altre lezioni

- La somma di vettori con il metodo punta-coda e il parallelogramma: alla lezione "Somma e differenza di vettori".
- La risultante di forze non perpendicolari (con seno e coseno): alla lezione "Seno e coseno per scomporre un
  vettore", citata nell'esempio 3.
- La forza-peso, la forza elastica e l'attrito: alle tre lezioni successive, linkate.

## Domande per Andrea

- Il newton: lo date come unità derivata già qui, o solo come unità della forza, rimandando la definizione alla
  dinamica?
- Forze di contatto e a distanza: basta, o volete anche le quattro interazioni fondamentali, come alcuni libri?
- Negli esempi le direzioni con i punti cardinali o con destra, sinistra, alto, basso?
- Incertezza di una lettura: la sensibilità, o metà della sensibilità (alcuni libri la usano per gli strumenti
  analogici)?
