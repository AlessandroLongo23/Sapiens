# La configurazione elettronica

Generatore: `chim-configurazione-elettronica` (`src/lib/exercises/v2/generators/chim-configurazione-elettronica.ts`, con
`src/lib/exercises/v2/chim3-b.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_configurazione_elettronica.py`
(con `_chim3_b.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/53-chim-configurazione-elettronica.md`. Percorso nel
database: `high_school/chemistry/chim-struttura-elettronica/chim-configurazione-elettronica`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più. Tutti hanno la forma a scelta multipla con
quattro opzioni; nei livelli 1 e 4 la risposta è un numero intero e il livello può andare a risposta aperta.

## Nomi dei livelli

1. Gli elettroni di una configurazione
2. La configurazione fino al 3p
3. Dopo il 3p: il 4s e il 3d
4. Gli elettroni spaiati
5. La configurazione abbreviata
6. Gli ioni

## Dati e scrittura

Le configurazioni sono quelle di `src/lib/tools/elementi.json`, la tavola periodica del sito. I sottolivelli si scrivono
nell'ordine in cui si riempiono, come nella lezione: $1s^2\,2s^2\,2p^6\,3s^2\,3p^6\,4s^2\,3d^6$, e nella forma abbreviata
$[\text{Ar}]\,4s^2\,3d^6$. Una configurazione con più di sei sottolivelli, quando è un'opzione, va su due righe (la
seconda comincia dal $4s$). Nomi degli elementi in minuscolo con l'articolo giusto ("dello zolfo", "dell'argon"); il
kripton si chiama "kripton", come nelle lezioni.

Un'opzione è giusta quando ha gli elettroni giusti in ogni sottolivello; quella giusta è scritta nell'ordine di
riempimento. Nessun distrattore ha la stessa distribuzione di elettroni della risposta scritta in un altro ordine
(per esempio $3d^{10}\,4s^2$ al posto di $4s^2\,3d^{10}$): sarebbe giusto anche quello.

## Livello 1: gli elettroni di una configurazione

Si dà la configurazione completa di un elemento con $Z$ da $3$ a $20$ e si chiede il numero totale di elettroni.
Risposta: la somma degli esponenti, un numero.

- $1s^2\,2s^2\,2p^6\,3s^2\,3p^1$ → $13$ (è l'alluminio).
- $1s^2\,2s^2\,2p^6\,3s^2\,3p^6\,4s^2$ → $20$ (è il calcio).

Distrattori: il numero di sottolivelli scritti, l'ultimo esponente, la somma senza l'$1s$, il numero del livello più
alto; poi i numeri vicini.

## Livello 2: la configurazione fino al 3p

Si dà nome e $Z$ (da $3$ a $18$) e si chiede la configurazione completa.

- Fosforo, $Z = 15$ → $1s^2\,2s^2\,2p^6\,3s^2\,3p^3$.
- Litio, $Z = 3$ → $1s^2\,2s^1$.

Distrattori, dagli errori della lezione: un sottolivello $p$ riempito con $8$ elettroni; il sottolivello $s$
dell'ultimo livello saltato ($\dots 2p^6\,3p^5$); tutti gli elettroni che restano messi nel penultimo sottolivello
oltre il suo massimo ($1s^3$, $\dots 3s^5$); un elettrone in più o in meno.

## Livello 3: dopo il 3p, il 4s e il 3d

Come il livello 2, con $Z$ da $19$ a $36$, senza cromo e rame (le eccezioni arrivano al livello 5).

- Ferro, $Z = 26$ → $1s^2\,2s^2\,2p^6\,3s^2\,3p^6\,4s^2\,3d^6$.
- Bromo, $Z = 35$ → $1s^2\,2s^2\,2p^6\,3s^2\,3p^6\,4s^2\,3d^{10}\,4p^5$.

Distrattori: il terzo livello riempito tutto prima del quarto ($\dots 3p^6\,3d^8$), solo quando la distribuzione
è diversa da quella giusta (fino a $Z = 28$); il $3d$ saltato ($\dots 4s^2\,4p^6$), fino a $Z = 26$; un sottolivello
$d$ con $6$ elettroni al massimo; un $p$ con $8$; un elettrone in più o in meno.

## Livello 4: gli elettroni spaiati

Si dà la configurazione completa di un elemento con $Z$ da $1$ a $36$ (senza cromo e rame) e si chiede il numero di
elettroni spaiati nello stato fondamentale. Risposta: un numero, dalla regola di Hund sull'ultimo sottolivello. Tre
volte su quattro l'elemento ha un sottolivello $p$ o $d$ non pieno (caso `hund`, tra l'80% e il 98% dei campioni);
negli altri l'ultimo sottolivello è un $s$ o è pieno (caso `semplice`).

- Ossigeno, $1s^2\,2s^2\,2p^4$ → $2$.
- Ferro, $\dots 4s^2\,3d^6$ → $4$.

Distrattori: gli elettroni dell'ultimo sottolivello; il numero delle sue caselle; il numero di coppie; i posti vuoti;
poi i numeri vicini.

## Livello 5: la configurazione abbreviata

Si dà nome e $Z$ (da $11$ a $38$ e da $49$ a $54$) e si chiede la configurazione abbreviata. Una volta su cinque
l'elemento è il cromo o il rame (caso `eccezione`, tra il 12% e il 28%), altrimenti un elemento che segue la regola
della diagonale (caso `regola`).

- Bromo, $Z = 35$ → $[\text{Ar}]\,4s^2\,3d^{10}\,4p^5$.
- Cromo, $Z = 24$ → $[\text{Ar}]\,4s^1\,3d^5$.

Distrattori: il gas nobile del periodo dell'elemento al posto di quello che lo precede ($[\text{Kr}]\,4s^2\,3d^{10}\,4p^5$);
il $d$ pieno dimenticato prima del $p$; il $d$ riempito senza il $4s$; una falsa eccezione ($4s^1\,3d^{k+1}$) per un
metallo di transizione che non lo è; il gas nobile precedente con gli stessi sottolivelli; un elettrone in più o in
meno. Per cromo e rame: la configurazione della regola della diagonale, l'elettrone spostato nel verso sbagliato, il
$3d$ senza il $4s$.

## Livello 6: gli ioni

Si dà la configurazione abbreviata dell'atomo e si chiede quella di un suo ione. Metà dei campioni sono ioni dei
gruppi principali (caso `principali`: $\mathrm{Li^+}$, $\mathrm{N^{3-}}$, $\mathrm{O^{2-}}$, $\mathrm{F^-}$,
$\mathrm{Na^+}$, $\mathrm{Mg^{2+}}$, $\mathrm{Al^{3+}}$, $\mathrm{P^{3-}}$, $\mathrm{S^{2-}}$, $\mathrm{Cl^-}$,
$\mathrm{K^+}$, $\mathrm{Ca^{2+}}$, $\mathrm{Se^{2-}}$, $\mathrm{Br^-}$, $\mathrm{Rb^+}$, $\mathrm{Sr^{2+}}$), metà
cationi dei metalli di transizione del quarto periodo (caso `transizione`: $\mathrm{Sc^{3+}}$, $\mathrm{Ti^{2+}}$,
$\mathrm{V^{2+}}$, $\mathrm{V^{3+}}$, $\mathrm{Cr^{2+}}$, $\mathrm{Cr^{3+}}$, $\mathrm{Mn^{2+}}$, $\mathrm{Fe^{2+}}$,
$\mathrm{Fe^{3+}}$, $\mathrm{Co^{2+}}$, $\mathrm{Co^{3+}}$, $\mathrm{Ni^{2+}}$, $\mathrm{Cu^+}$, $\mathrm{Cu^{2+}}$,
$\mathrm{Zn^{2+}}$). Ogni caso tra il 40% e il 60%.

Regole della lezione: un anione continua l'ordine di riempimento; un catione perde gli elettroni del livello più
esterno; un metallo di transizione perde prima quelli del $4s$, poi quelli del $3d$. Un catione con la configurazione
di un gas nobile si scrive con il solo gas tra parentesi ($[\text{Ne}]$); un anione con il gas nobile precedente
($[\text{Ne}]\,3s^2\,3p^6$), come nella lezione.

- $\mathrm{Fe^{3+}}$, da $[\text{Ar}]\,4s^2\,3d^6$ → $[\text{Ar}]\,3d^5$.
- $\mathrm{S^{2-}}$, da $[\text{Ne}]\,3s^2\,3p^4$ → $[\text{Ne}]\,3s^2\,3p^6$.

Distrattori per i metalli di transizione: elettroni tolti dal $3d$ con il $4s$ intatto ($[\text{Ar}]\,4s^2\,3d^3$); la
configurazione riscritta da capo con meno elettroni, con la regola della diagonale o come l'atomo che ha quegli
elettroni ($\mathrm{Fe^{2+}}$ come il cromo); l'atomo invariato; elettroni aggiunti. Per i gruppi principali: la
carica letta al contrario, l'atomo invariato, un elettrone in più o in meno.

## Da evitare

- Elementi con eccezioni che la lezione non tratta (niobio, molibdeno, rutenio, rodio, palladio, argento, e tutto il
  sesto periodo).
- Due opzioni con la stessa distribuzione di elettroni.
- Ioni che non esistono nei composti comuni, o con il $3d$ che scenderebbe sotto zero.
