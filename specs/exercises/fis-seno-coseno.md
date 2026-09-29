# Seno e coseno per scomporre un vettore

Generatore: `fis-seno-coseno` (`src/lib/exercises/v2/generators/fis-seno-coseno.ts`, con
`src/lib/exercises/v2/vettori.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_seno_coseno.py`. Lezione
collegata: `docs/lezioni/fisica/riscritte/15-fis-seno-coseno.md`. Percorso nel database:
`high_school/physics/fis-vettori-forze/fis-seno-coseno`.

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Le componenti con l'angolo dall'asse x
2. L'angolo dall'asse y
3. I segni nei quattro quadranti
4. Dalle componenti al vettore
5. L'angolo negli altri quadranti
6. La somma per componenti

## Tipi di risposta e cifre significative

Scelta multipla con l'unità nell'opzione (`7{,}5\,\text{m/s}`, `-6{,}9\,\text{m}`), o l'angolo in gradi
(`237^\circ`). I moduli dati hanno 2 cifre significative (circa 7 volte su 10: da $11$ a $99$ senza lo zero finale,
oppure da $1{,}1$ a $9{,}9$) o 3 (da $101$ a $999$ senza lo zero finale); gli angoli sono gradi interi e non contano.
I risultati si arrotondano alle cifre significative del modulo, come la lezione "Le cifre significative"; gli angoli
al grado. Un valore a meno di $10^{-6}$ da un confine di arrotondamento non si usa, e nemmeno un risultato che
chiederebbe uno zero prima della virgola (due cifre di $150$). Tutte le opzioni hanno le stesse cifre significative
della risposta, così nessuna si tradisce.

Grandezze: una forza ($F$, N, in rosso), uno spostamento ($s$, m, in blu), una velocità ($v$, m/s, in blu scuro).

## Regole comuni

- La scena del problema disegna il vettore con il suo modulo e l'arco dell'angolo dato (livelli 1-3, 6), oppure le
  componenti tratteggiate con il loro valore (livelli 4-5). Le componenti trovate, il vettore ricostruito e la
  risultante stanno in `solutionScene`, senza gli archi (gli angoli sono nel testo).
- I passaggi scrivono il valore con qualche cifra in più, poi l'arrotondamento, e dicono quante cifre significative
  ha il risultato.

## Livello 1: le componenti con l'angolo dall'asse x

Angolo da $10^\circ$ a $80^\circ$, nessuna componente sotto un quinto del modulo; si chiede $v_x$ o $v_y$, metà
ciascuna.

- "Uno spostamento di $4{,}5\,\text{m}$ forma un angolo di $43^\circ$ con l'asse $x$. Quanto vale la componente
  $s_y$?" Risposta $3{,}1\,\text{m}$; distrattori $3{,}3\,\text{m}$ (seno e coseno scambiati), $-3{,}7\,\text{m}$ (la
  calcolatrice in radianti), $6{,}6\,\text{m}$ (diviso per il seno).
- "Una velocità di $17\,\text{m/s}$ forma un angolo di $64^\circ$ con l'asse $x$. Quanto vale $v_x$?" Risposta
  $7{,}5\,\text{m/s}$; distrattori $15$, $6{,}7$, $39\,\text{m/s}$.

## Livello 2: l'angolo dall'asse y

Lo stesso, con l'angolo dato rispetto all'asse $y$ ("verso destra e verso l'alto"), come l'esempio 3 della lezione:
la componente $x$ va con il seno.

- "Uno spostamento di $2{,}9\,\text{m}$ forma un angolo di $35^\circ$ con l'asse $y$, verso destra e verso l'alto.
  Quanto vale la componente $s_y$?" Risposta $2{,}4\,\text{m}$; distrattori $1{,}7\,\text{m}$ (la formula dell'asse
  $x$ applicata all'angolo con l'asse $y$), $-1{,}2\,\text{m}$ (radianti), $5{,}1\,\text{m}$.

## Livello 3: i segni nei quattro quadranti

Angolo da $95^\circ$ a $355^\circ$, dal semiasse positivo delle $x$ in senso antiorario, lontano almeno $5^\circ$
dagli assi; secondo, terzo e quarto quadrante circa un terzo ciascuno.

- "Uno spostamento di $4{,}5\,\text{m}$ forma un angolo di $219^\circ$ con il semiasse positivo delle $x$, misurato in
  senso antiorario. Quanto vale la componente $s_y$?" Risposta $-2{,}8\,\text{m}$; distrattori $2{,}8\,\text{m}$ (il
  segno dimenticato), $-3{,}5\,\text{m}$ (seno e coseno scambiati), $-3{,}6\,\text{m}$ (radianti).
- "... $12\,\text{m}$ ... $123^\circ$ ... $s_x$?" Risposta $-6{,}5\,\text{m}$; distrattori $6{,}5$, $-11$, $10$.

## Livello 4: dalle componenti al vettore

Componenti positive con 2 cifre significative, con il rapporto fra loro al più $3$; metà chiede il modulo, metà
l'angolo con il semiasse positivo delle $x$.

- "Uno spostamento ha le componenti $s_x = 3{,}6\,\text{m}$ e $s_y = 5{,}3\,\text{m}$. Quanto vale il suo modulo?"
  Risposta $6{,}4\,\text{m}$; distrattori $8{,}9\,\text{m}$ (le componenti sommate), $1{,}7\,\text{m}$ (la
  differenza), $3{,}0\,\text{m}$ (la radice della somma).
- "Una velocità ha le componenti $v_x = 5{,}1\,\text{m/s}$ e $v_y = 7{,}8\,\text{m/s}$. Quale angolo forma...?"
  Risposta $57^\circ$; distrattori $33^\circ$ (il complementare, l'angolo con l'asse $y$), $41^\circ$ (il tasto
  sbagliato: $\sin^{-1}$ del rapporto), $62^\circ$.

## Livello 5: l'angolo negli altri quadranti

Come il livello 4, con il vettore nel secondo, terzo o quarto quadrante (un terzo ciascuno); si chiede l'angolo da
$0^\circ$ a $360^\circ$.

- "$s_x = 3{,}6\,\text{m}$ e $s_y = -5{,}3\,\text{m}$." Risposta $304^\circ$; distrattori $-56^\circ$ (l'angolo della
  calcolatrice così com'è), $124^\circ$ (corretto con $180^\circ$ invece di $360^\circ$), $236^\circ$.
- "$v_x = -5{,}1\,\text{m/s}$ e $v_y = -7{,}8\,\text{m/s}$." Risposta $237^\circ$; distrattori $57^\circ$ (la
  calcolatrice), $303^\circ$, $242^\circ$.

## Livello 6: la somma per componenti

Due vettori con moduli di 2 cifre significative, uno il doppio dell'altro al più; il primo lungo l'asse $x$ (circa 4
volte su 10) o inclinato, il secondo inclinato; angoli multipli di $5^\circ$ fino a $170^\circ$, a una distanza fra
$30^\circ$ e $120^\circ$, mai $90^\circ$ (sarebbe il livello 3 della lezione precedente). La risultante, con 2 cifre
significative, deve venire uguale anche con le componenti arrotondate a 3 cifre, come le terrebbe uno studente.

- "$\vec{s}_1$ di $32\,\text{m}$ lungo l'asse $x$ e $\vec{s}_2$ di $31\,\text{m}$ a $70^\circ$ dall'asse $x$." Risposta
  $52\,\text{m}$; distrattori $63\,\text{m}$ (i moduli sommati), $45\,\text{m}$ (come se fossero perpendicolari),
  $1{,}0\,\text{m}$ (la differenza).
- "$\vec{s}_1$ di $36\,\text{m}$ a $80^\circ$ e $\vec{s}_2$ di $45\,\text{m}$ a $150^\circ$." Risposta $67\,\text{m}$;
  distrattori $81$, $58$, $9{,}0\,\text{m}$.

## Esercizi da evitare

- Componenti troppo piccole rispetto al modulo (frecce illeggibili, risultati come $0{,}17$), angoli a meno di
  $5^\circ$ da un asse al livello 3.
- Risultati al confine di un arrotondamento, o che cambiano arrotondando le componenti a 3 cifre (livello 6).
- Due opzioni con lo stesso numero, opzioni con cifre significative diverse dalla risposta.

## Verifica

`fis_seno_coseno.py` rilegge il testo e ricalcola tutto con la trigonometria esatta di SymPy
($\cos\frac{\pi\alpha}{180}$) valutata a 60 cifre, poi arrotonda con le cifre significative del dato (scritte nel
testo) o al grado, rifiutando i valori a meno di $10^{-9}$ da un confine. Controlla che la scena disegni il vettore
all'angolo dato (entro $0{,}05^\circ$) con l'arco dal riferimento giusto, o le due componenti con il loro valore;
al livello 6 ripete il conto con le componenti a 3 cifre. Poi opzioni, unità, cifre significative di ogni opzione e
quote dei casi.

## Domande per la revisione

- Arrotondare alle cifre significative del modulo (qui) o dare sempre tre cifre come molti libri?
- Livello 5: l'angolo si chiede da $0^\circ$ a $360^\circ$. Alcuni libri danno l'angolo "sotto l'asse $x$" come
  $-56^\circ$: va accettato?
- Livello 6: nessun livello chiede l'angolo della risultante; serve?
