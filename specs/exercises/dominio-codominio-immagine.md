# Dominio, codominio e immagine

Generatore: `dominio-codominio-immagine` (`src/lib/exercises/v2/generators/dominio-codominio-immagine.ts`).
Verifica indipendente: `scripts/exercises/checkers/dominio_codominio_immagine.py`. Lezione collegata:
`docs/lezioni/riscritte/43-dominio-codominio-immagine.md` (note in `docs/lezioni/note/`, sezione
"Per il generatore").

Sei livelli nell'ordine della lezione: controimmagini in una funzione data elemento per elemento,
insieme immagine su un dominio finito, immagine e controimmagine con una legge su ℤ o ℚ, poi tre
livelli sul dominio naturale. Iniettività e suriettività restano al generatore
`funzioni-iniettive-suriettive-biettive`; il livello 1 di quel generatore chiede già l'immagine di una
funzione su un insieme finito, e il livello 2 di questo lo riprende con il resto della divisione, il
codominio ℕ o ℤ e almeno un valore ripetuto.

## Si costruisce dalla risposta

- Livello 1: si sceglie prima quante controimmagini ha l'elemento $y$ (nessuna, una, due o tre), poi
  quali elementi di $A$ vanno in $y$, poi le altre frecce, tutte verso elementi di $B$ diversi da $y$.
- Livello 3: si sceglie la controimmagine $x_0$ intera e poi $y = ax_0 + b$; per i casi senza
  controimmagine in ℤ si sposta $y$ di un numero tra $1$ e $|a| - 1$, così $x = \frac{y - b}{a}$ non è
  intero. Per $x^2 + c$ si sceglie $y - c$: un quadrato perfetto, zero, un negativo o un non quadrato.
- Livelli 4-6: si scelgono prima gli zeri dei denominatori ($-\frac{b}{a}$, $0$ e $-\frac{m}{k}$,
  $\pm\frac{a}{p}$), poi si moltiplica; il numeratore si sceglie con uno zero diverso da quelli del
  denominatore e dai loro opposti (tranne al livello 6, caso "semplifica", dove lo zero è in comune
  apposta).

## Rappresentazione

- Livello 1: `params.A`, `params.B`, `params.map` (le immagini degli elementi di $A$ nell'ordine),
  `params.y`, `params.display` (`frecce` o `tabella`), `params.case` (`nessuna`, `una`, `piu`).
  Risposta `set` con le controimmagini ordinate; nessuna controimmagine è l'insieme vuoto, scritto
  "nessuna".
- Livello 2: `params.family` (`abs` per $|x + b|$, `quad` per $x^2 + bx + c$, `resto` per il resto
  della divisione per $k$), `b`, `c`, `k`, `A`, `cod` (`Z`, `N` o `B`), `B` se il codominio è finito.
  Risposta `set`, con latex $f(A) = \{\dots\}$.
- Livello 3: `params.case`, `family` (`lin` per $ax + b$, `sq` per $x^2 + c$), `a`, `b`, `c`, `dom`
  (`Z` o `Q`), `n`. Se si chiede l'immagine la risposta è `number`, altrimenti `set` (vuoto se non ci
  sono controimmagini).
- Livelli 4-6: `params.terms` (gli addendi della formula, ognuno con `num` e `den` come coefficienti
  per grado crescente; un polinomio ha `den = ["1"]`), `params.excluded` (i valori che annullano un
  denominatore), `params.wrong` (i distrattori), `params.case`. La risposta è di tipo `set` con i
  valori esclusi dal dominio, e il latex dice il dominio: $D = \mathbb{R} \setminus \{0,\ 3\}$, oppure
  $D = \mathbb{R}$ con `values` vuoto (vedi le domande).

## Regole comuni

- Consegne: "Trova le controimmagini di 4.", "Trova l'insieme immagine della funzione.", "Trova
  l'immagine di 6.", "Trova il dominio della funzione.".
- Notazione della lezione: insiemi elencati con `,\ `, $f: A \to B$, $f(A)$ per l'insieme immagine,
  $\lvert x \rvert$ per il valore assoluto, $D = \mathbb{R} \setminus \{\dots\}$ per il dominio,
  frazioni con `\frac`. Mai $f^{-1}(y)$: la lezione lo cita solo in un riquadro.
- Polinomi ordinati per potenze decrescenti, niente "1x", "+ -", termini nulli.
- Controimmagini dette come nella lezione: "$-2$ e $2$", "$1,\ 2$ e $5$", "nessuna".

## Livello 1: controimmagini con frecce o tabella

$A$: da 4 a 6 interi distinti tra $-3$ e $6$; $B$: da 3 a 5 interi distinti tra $0$ e $9$. La funzione è
data con le frecce (circa 6 volte su 10) o con una tabella a due righe. Circa un terzo nessuna
controimmagine, un terzo una, un terzo due o tre. Non tutti gli elementi vanno in $y$.

1. $A = \{-2,\ 0,\ 1,\ 4\}$, $B = \{0,\ 5,\ 8\}$, $-2 \mapsto 0$, $0 \mapsto 5$, $1 \mapsto 5$,
   $4 \mapsto 8$. Controimmagini di $5$: $0$ e $1$.
2. Stessa funzione, controimmagini di $0$: una sola, $-2$. Con $B = \{0,\ 3,\ 4,\ 7,\ 9\}$ e nessuna
   freccia verso $9$: $9$ non ha controimmagini.

## Livello 2: insieme immagine su un dominio finito

Tre famiglie, un terzo ciascuna: $|x + b|$ con $b$ tra $-2$ e $2$ e $x^2 + c$ o $x^2 + bx$ su 5-7
interi tra $-3$ e $3$; il resto della divisione per $3$, $4$ o $5$ su 5-7 interi tra $1$ e $12$
(esempio 1 della lezione). Almeno un valore esce due volte (va scritto una volta sola). Il codominio è
un insieme finito $B$ più grande dell'immagine (circa 4 volte su 10), oppure $\mathbb{N}$ o
$\mathbb{Z}$ (ℕ solo se i valori non sono negativi).

1. $f: A \to \mathbb{Z}$, $A = \{-2,\ -1,\ 1,\ 2,\ 3\}$, $f(x) = x^2 + 4$: $f(A) = \{5,\ 8,\ 13\}$.
2. $f: A \to B$, $A = \{1,\ 2,\ 5,\ 8,\ 10,\ 11\}$, $B = \{0,\ 1,\ 2,\ 4\}$, $f(x)$ resto della
   divisione per $3$: $f(A) = \{1,\ 2\}$, e $0$ e $4$ restano fuori.

## Livello 3: immagine e controimmagine con una legge

Su ℤ o su ℚ. Circa 25 su 100 l'immagine di un numero con $f(x) = ax + b$ ($2 \le |a| \le 5$,
$b \neq 0$, $|b| \le 9$, numero tra $-6$ e $6$); 20 su 100 la controimmagine intera; 20 su 100 un numero
senza controimmagine in ℤ ($x$ frazionario); 15 su 100 la controimmagine frazionaria in ℚ; 20 su 100
le controimmagini di $x^2 + c$ in ℤ ($c$ tra $-5$ e $5$, nullo circa 4 volte su 10): due, una sola
($y = c$), nessuna perché $y - c$ è negativo, nessuna perché $y - c$ non è un quadrato. I numeri
restano entro $45$ in valore assoluto.

1. $f: \mathbb{Z} \to \mathbb{Z}$, $f(x) = -5x - 8$, controimmagini di $-12$: da $-5x = -4$ viene
   $x = \frac{4}{5}$, che non è intero, quindi nessuna (esempio 3 della lezione).
2. $f: \mathbb{Z} \to \mathbb{Z}$, $f(x) = x^2$, controimmagini di $9$: $-3$ e $3$ (esempio 4).

## Livello 4: polinomio o denominatore di primo grado

Circa 25 su 100 un polinomio (di primo grado $k(x - r)$, di secondo grado con due zeri interi, o
$x^3 + bx + c$): $D = \mathbb{R}$. Gli altri $\frac{cx + d}{ax + b}$ (o un numero al numeratore, circa 2
volte su 10), metà con lo zero del denominatore intero, metà frazionario ($a$ da $2$ a $5$ che non
divide $b$). Il coefficiente di $x$ al numeratore è positivo.

1. $\frac{x + 2}{2x + 3}$: $2x + 3 = 0$, $x = -\frac{3}{2}$, $D = \mathbb{R} \setminus \{-\frac{3}{2}\}$;
   lo zero del numeratore, $-2$, resta nel dominio (esempio 6).
2. $x^3 + 5x - 8$: $D = \mathbb{R}$ (esempio 5).

## Livello 5: denominatore da scomporre o due frazioni

Un terzo ciascuno:

- raccoglimento totale, $kx^2 + mx = x(kx + m)$ con $k \in \{1, 2, 3\}$ e $m$ tra $-9$ e $9$ (esempio 7);
- differenza di quadrati, $x^2 - a^2$ con $a$ fino a $9$, oppure $p^2x^2 - a^2$ con $p = 2, 3$ e
  $a$ primo con $p$ (zeri $\pm\frac{a}{p}$);
- due frazioni $\frac{n_1}{x - r} + \frac{n_2}{x - s}$ con $r \neq s$ tra $-6$ e $6$ (esempio 9).

1. $\frac{6}{x^2 + 7x}$: $x(x + 7)$, $D = \mathbb{R} \setminus \{-7,\ 0\}$.
2. $-\frac{4}{x} - \frac{3}{x - 3}$: $D = \mathbb{R} \setminus \{0,\ 3\}$.

## Livello 6: i casi scomodi

Un terzo ciascuno:

- un denominatore che non si annulla mai, $x^2 + k$ con $k$ da $1$ a $9$ (quadrato perfetto metà delle
  volte): $D = \mathbb{R}$ (esempio 8);
- un numero al denominatore, $\frac{x - 9}{2}$ o $\frac{x^2 + bx + c}{k}$: $D = \mathbb{R}$ (riquadro
  "Escludere i numeri sbagliati");
- una frazione che si semplifica, $\frac{x^2 - a^2}{x \mp a}$, $\frac{x^2 + mx}{x}$ o
  $\frac{x^2 + mx}{x + m}$: si esclude lo zero del denominatore, prima di semplificare (esempio 10).

1. $\frac{6}{x^2 + 9}$: $D = \mathbb{R}$.
2. $\frac{x^2 - 9}{x - 3}$: $D = \mathbb{R} \setminus \{3\}$, anche se per $x \neq 3$ la frazione vale $x + 3$.

## Esercizi "brutti" da evitare

- una funzione del livello 1 che manda tutto in $y$, o un $y$ fuori dal codominio;
- un livello 2 senza valori ripetuti (sarebbe solo un calcolo di immagini);
- $a = \pm 1$ al livello 3: ogni $y$ avrebbe una controimmagine intera e il caso "nessuna" sparirebbe;
- denominatori con zeri irrazionali ($x^2 - 2$): il verificatore li boccia;
- ai livelli 4 e 5, numeratore e denominatore con uno zero in comune (la frazione si semplificherebbe:
  quel caso è solo al livello 6).

## Variante a scelta multipla

Quattro opzioni diverse, una sola giusta. Distrattori dai riquadri della lezione:

- "Scambiare immagine e controimmagine": al livello 1 $f(y)$ quando $y$ sta anche in $A$; al livello 3
  l'immagine $f(y)$ al posto della controimmagine, e la controimmagine $\frac{n - b}{a}$ al posto
  dell'immagine $f(n)$;
- una controimmagine dimenticata, "nessuna" quando ce n'è almeno una, l'elemento $y$ stesso, le
  controimmagini di un altro elemento;
- "Confondere codominio e insieme immagine": al livello 2 il codominio $B$ quando è finito (il
  verificatore controlla che ci sia), il dominio $A$, tutti i resti possibili $\{0, \dots, k - 1\}$, il
  segno sbagliato su un negativo ($(-2)^2 = -4$, $|-2| = -2$), il quoziente al posto del resto;
- al livello 3 il segno di $b$ non cambiato, il segno perso nella divisione, la frazione $\frac{y - b}{a}$
  quando in ℤ non c'è controimmagine, per $x^2$ la radice negativa dimenticata e $x^2 = -9$ "risolta"
  con $\pm 3$;
- "Escludere i numeri sbagliati": lo zero del numeratore (il verificatore controlla che ci sia al
  livello 4 quando il numeratore ha la $x$), lo zero con il segno cambiato, $-b$ senza dividere per $a$,
  gli zeri di un polinomio esclusi dal suo dominio, $\mathbb{R} \setminus \{0\}$;
- al livello 5 lo zero $x = 0$ dimenticato nel raccoglimento (controllato), un solo zero della
  differenza di quadrati, $a^2$ al posto di $a$, una sola delle due frazioni;
- al livello 6 $\pm 3$ per $x^2 + 9$ come se fosse $x^2 - 9$, il numero al denominatore escluso, e per la
  frazione che si semplifica $D = \mathbb{R}$ (controllato), gli zeri del numeratore esclusi.

## Verifiche fatte (26 settembre 2026)

- `sample.mts dominio-codominio-immagine 1000 all 1 | verify.py`: PASS, 6.000 su 6.000; con il seed di
  partenza 7001: PASS, 6.000 su 6.000. Quote dei casi dentro gli intervalli (`CASE_RANGES`).
- Esercizi diversi su 1.000 (consegna e problema, seed da 1): 1.000 al livello 1, 771 al livello 2,
  865 al livello 3, 787 al livello 4, 897 al livello 5, 538 al livello 6.
- `width.mts`: esce con 0. Formula del problema più larga 288 px (la tabella del livello 1), opzione più
  larga 199 px (un insieme immagine di sei elementi); le opzioni lunghe andrebbero comunque su due righe
  con `fitSetChoice`.
- `review.mts`: esce con 0, i dieci esempi letti.
- `tsc --noEmit` senza errori nel generatore, `eslint --max-warnings=0` pulito.
- Errori piantati a mano, tutti bocciati: risposta con una controimmagine in meno; immagine $+1$;
  "nessuna" cambiata in una frazione; valore escluso con il segno cambiato; raccoglimento con un solo
  zero; frazione semplificata con $D = \mathbb{R}$; il codominio come insieme immagine; `choice.correct`
  spostato a ogni livello; il testo di un'opzione copiato su un'altra a ogni livello; opzioni doppie;
  denominatore cambiato nel testo e non nei params; una freccia cambiata; legge $x + 1$ con la risposta
  giusta per quella legge ($|a| = 1$ vietato); $\frac{x^2 - 9}{x + 2}$ dichiarata "semplifica";
  un denominatore $x^2 - 2$ con zeri irrazionali; `params.case` sbagliato ai livelli 1 e 5; "1x" nel
  testo; opzioni senza $D = \mathbb{R}$ nel caso "semplifica", senza il codominio $B$, senza la risposta
  che dimentica $x = 0$.

## Domande per la revisione

- Il dominio è una risposta `set` con i valori esclusi, e $D = \mathbb{R}$ ha `values` vuoto. Nel tipo
  `set` di oggi un insieme vuoto vuol dire "nessuna soluzione": quando arriverà la risposta aperta
  servirà un tipo "dominio" o un campo che dica come leggere i valori. Oggi il sito mostra solo la
  scelta multipla e il problema non si vede.
- Il livello 3 mescola due domande (immagine e controimmagine) per esercitare l'avviso "Scambiare
  immagine e controimmagine"; la consegna dice quale. Va bene nello stesso livello, o l'immagine va
  tolta perché è già nel livello 1 del generatore delle funzioni iniettive?
- Le funzioni reali con un insieme immagine infinito (i dispari per $2x + 1$ su ℤ, tutto ℚ su ℚ,
  esempio 3) non ci sono: la risposta non è un elenco. Si potrebbe aggiungere una domanda a scelta
  fra "i numeri dispari", "i numeri pari", "tutto ℤ", "i quadrati perfetti"; per ora è fuori.
- Il vero o falso sugli zeri del numeratore proposto nella nota non c'è, perché la scelta multipla
  vuole quattro opzioni: lo zero del numeratore è un distrattore dei livelli 4 e 5.
- Il codominio finito del livello 2 con il resto può contenere numeri che un resto non darebbe mai
  (per esempio $4$ con la divisione per $3$): è corretto, ma Andrea può preferire codomini più "credibili".
