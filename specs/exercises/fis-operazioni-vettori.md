# Somma e differenza di vettori

Generatore: `fis-operazioni-vettori` (`src/lib/exercises/v2/generators/fis-operazioni-vettori.ts`, con
`src/lib/exercises/v2/vettori.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_operazioni_vettori.py`.
Lezione collegata: `docs/lezioni/fisica/riscritte/14-fis-operazioni-vettori.md`. Percorso nel database:
`high_school/physics/fis-vettori-forze/fis-operazioni-vettori`.

Sei livelli, ognuno con una difficoltà in più: la retta, poi il prodotto per un numero, poi due direzioni
perpendicolari, poi direzioni qualsiasi sulla griglia, poi la differenza, poi tre vettori.

## Nomi dei livelli

1. Vettori sulla stessa retta
2. Il prodotto per un numero
3. Vettori perpendicolari
4. La somma sulla griglia
5. La differenza sulla griglia
6. Tre forze sulla griglia

## Tipi di risposta

Scelta multipla con l'unità nell'opzione. Ai livelli 1 e 2 l'opzione ha anche il verso
(`18\,\text{N}\ \text{verso destra}`). I numeri si costruiscono all'indietro da terne pitagoriche: ogni modulo è
intero, niente arrotondamenti.

## Regole comuni

- Tutti i livelli hanno la scena `vettori-piano` con i vettori dati, in rosso le forze e in blu gli spostamenti; il
  risultato (arancione) e, al livello 5, l'opposto di $\vec{b}$ tratteggiato stanno solo in `solutionScene`.
- Ai livelli 1 e 3 le frecce sono in scala e portano il modulo ("46 N"); ai livelli 4-6 i vettori vanno da un
  incrocio all'altro della griglia, con nessuna componente nulla, e il testo dice quanto vale un quadretto.
- Le frecce di una figura sono separate da almeno $18^\circ$ fra loro, dal risultato e dagli opposti, perché ogni
  nome abbia il suo posto.

## Livello 1: vettori sulla stessa retta

Due forze orizzontali su una cassa, da $3$ a $60$ N, diverse, con il minore almeno un quarto del maggiore; versi
opposti circa 7 volte su 10, stesso verso le altre.

- "$\vec{F}_1$ di $20\,\text{N}$ verso sinistra e $\vec{F}_2$ di $25\,\text{N}$ verso destra." Risposta
  $5\,\text{N}$ verso destra; distrattori $5\,\text{N}$ verso sinistra (il verso della forza minore),
  $45\,\text{N}$ nei due versi (i moduli sommati).
- "$\vec{F}_1$ di $39\,\text{N}$ verso destra e $\vec{F}_2$ di $16\,\text{N}$ verso destra." Risposta
  $55\,\text{N}$ verso destra; distrattori $23\,\text{N}$ nei due versi, $55\,\text{N}$ verso sinistra.

## Livello 2: il prodotto per un numero

$\vec{a}$ è una forza o uno spostamento da $2$ a $20$ unità verso est, nord, l'alto o destra (o i versi opposti);
$k$ tra $-3$, $-2{,}5$, $-2$, $-1{,}5$, $-1$, $-0{,}5$, $0{,}5$, $1{,}5$, $2$, $2{,}5$, $3$, $4$ (con un mezzo, $a$ è pari).

- "Il vettore $\vec{a}$ è una forza di $18\,\text{N}$ verso nord. Quanto vale il vettore $-0{,}5\vec{a}$?" Risposta
  $9\,\text{N}$ verso sud; distrattori $-9\,\text{N}$ verso nord (il segno meno nel modulo, l'errore dell'avviso
  della lezione), $9\,\text{N}$ verso nord, $36\,\text{N}$ verso sud (diviso al posto di moltiplicato).
- "... uno spostamento di $5\,\text{km}$ verso l'alto. Quanto vale il vettore $-\vec{a}$?" Risposta $5\,\text{km}$
  verso il basso.

## Livello 3: vettori perpendicolari

Due corde tirano un anello, una lungo est-ovest e una lungo nord-sud. Moduli da una terna pitagorica ($3, 4, 5$;
$5, 12, 13$; $8, 15, 17$; $20, 21, 29$) per $1$, $2$, $3$, $5$ o $10$.

- "$\vec{F}_1$ di $8\,\text{N}$ verso est e $\vec{F}_2$ di $15\,\text{N}$ verso nord." Risposta $17\,\text{N}$;
  distrattori $23\,\text{N}$ (i moduli sommati), $7\,\text{N}$, $289\,\text{N}$ (senza la radice).
- "$24\,\text{N}$ verso est e $10\,\text{N}$ verso nord." Risposta $26\,\text{N}$; distrattori $34$, $14$, $676$.

Il livello ha poca varietà (circa 250 esercizi diversi su 1000): le terne che danno figure leggibili sono poche.

## Livelli 4-6: la griglia

Il risultato ha le componenti di una terna pitagorica, con i segni ($3, 4$; $6, 8$; $5, 12$, e $0, 5$ lungo un asse).
I vettori dati hanno le componenti tra $-5$ e $5$, nessuna nulla, e non sono paralleli fra loro. Un quadretto vale
$1$, $2$, $5$ o $10$ N, oppure $1$, $2$ o $10$ m (al livello 6 solo forze).

- Livello 4: "Due spostamenti partono dallo stesso punto. Nella figura ogni quadretto vale $1\,\text{m}$. Quanto vale
  il modulo di $\vec{a} + \vec{b}$?" Risposta $5\,\text{m}$; distrattori $7\,\text{m}$ (le componenti sommate come
  numeri), il modulo della differenza quando è intero, $6$ e $4\,\text{m}$.
- Livello 5: lo stesso con $\vec{a} - \vec{b}$; distrattore principale il modulo della somma.
- Livello 6: "Tre forze sono applicate allo stesso punto. Nella figura ogni quadretto vale $2\,\text{N}$. Quanto vale
  il modulo di $\vec{F}_1 + \vec{F}_2 + \vec{F}_3$?" Risposta $20\,\text{N}$; distrattori $28\,\text{N}$ e vicini.

La somma dei moduli (l'errore più frequente) compare come distrattore solo quando è un numero intero di quadretti:
altrimenti avrebbe un decimale e si tradirebbe da sola.

## Esercizi da evitare

- Due forze uguali in versi opposti (risultante nulla), frecce troppo corte per leggerle (livello 1).
- $k = 0$ o $k = 1$ (livello 2).
- Vettori paralleli fra loro o lungo le righe della griglia (livelli 4-6), risultati non interi.

## Verifica

`fis_operazioni_vettori.py`: ai livelli 1-3 rilegge i vettori dal testo, calcola la risultante con numeri esatti e
controlla che la scena disegni gli stessi vettori (le stesse componenti nella scala della scena); al livello 2 anche
che nessuna opzione negativa accompagni un $k$ positivo. Ai livelli 4-6 legge i vettori dalla scena (la griglia è il
dato), controlla che partano dall'origine e arrivino a un incrocio senza componenti nulle, calcola somma o differenza
e il modulo con SymPy, che deve essere intero, e controlla che la scena della soluzione contenga il risultato. Poi
opzioni, unità, scrittura dei numeri e quote dei casi.

## Domande per la revisione

- Livello 1: la risultante si chiede come "modulo e verso" in una sola opzione. Preferite due domande separate?
- Livello 2: $-0{,}5\vec{a}$ e $2{,}5\vec{a}$ sono scritti con la virgola; alcuni libri scrivono $-\frac{1}{2}\vec{a}$.
- Livelli 4-6: le componenti non si chiedono mai da sole (il modulo le usa tutte e due). Serve un livello con
  "quanto vale $s_x$"?
