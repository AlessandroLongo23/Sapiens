# Relazioni binarie

Generatore: `relazioni-binarie` (`src/lib/exercises/v2/generators/relazioni-binarie.ts`). Verifica
indipendente: `scripts/exercises/checkers/relazioni_binarie.py`. Lezione collegata:
`docs/lezioni/riscritte/40-relazioni-binarie.md`, con la sezione "Per il generatore" della nota
`docs/lezioni/note/40-relazioni-binarie.md`.

Sei livelli nell'ordine della nota: dalla proprietà alle coppie, l'appartenenza di una coppia, la
tabella a doppia entrata, dalle coppie alla proprietà, la relazione in un insieme con i cappi, la
relazione inversa. Tutte le relazioni sono insiemi finiti di coppie di numeri naturali piccoli (da 1 a
12), calcolati da una proprietà o scelti a caso tra le caselle di $A \times B$ ("ogni sottoinsieme di
$A \times B$ è una relazione").

## Notazione

Come nella lezione: $\mathcal{R}$ per la relazione, $a \mathrel{\mathcal{R}} b$ e
$(a, b) \in \mathcal{R}$ come scritture equivalenti, $a \mathrel{\not\mathcal{R}} b$ per la coppia
che non sta nella relazione, $\mathcal{R}^{-1}$ per l'inversa. Insiemi scritti $\{2,\ 3,\ 5\}$,
coppie $(2, 4)$, elenchi di coppie $\{(2, 4),\ (2, 6)\}$ in ordine (primo elemento, poi secondo).
Lettere $a, b$ per le relazioni da $A$ a $B$, $x, y$ per le relazioni in un insieme. La proprietà si
dà con $a \mathrel{\mathcal{R}} b \iff \dots$. Nella tabella a doppia entrata il segno è $\bullet$,
l'angolo in alto a sinistra è $a \backslash b$, gli elementi di $A$ sulle righe e quelli di $B$ sulle
colonne. Niente diagrammi a frecce né grafici cartesiani: un esercizio generato è una formula LaTeX,
e la tabella è l'unica rappresentazione che ci sta.

Proprietà usate (codice in `params.code`): "$a$ è un divisore di $b$" (`div`), "$a$ è un multiplo di
$b$" (`mult`), $a < b$, $a > b$, $a \le b$, $a \ge b$ (`lt`, `gt`, `le`, `ge`), $b = 2a$ (`double`),
$a = 2b$ (`half`), $b = a^2$ (`sq`), $a + b = k$ (`sum:k`), $b = a + k$ (`plus:k`), $a = b + k$
(`minus:k`), "$a + b$ è pari" (`even`); `not-…` è la negazione. Al livello 6 le proprietà sono a
parole: "è minore di", "è maggiore di", "è il doppio di", "è la metà di".

## Tipi di risposta

- Livelli 1, 4, 5, 6 e il caso `elenco` del livello 3: `choice`, quattro opzioni. Le opzioni con le
  coppie hanno in `values` le coppie come `"a:b"`; quelle con le proprietà il codice della proprietà;
  al livello 2 i valori sono `[in|notin, pair|rel, "a:b"]`.
- Livello 3, casi `senza-corrispondenti` e `non-raggiunti`: `set`, i numeri in ordine crescente, con
  la variante a scelta multipla.

Ogni campione ha la variante a scelta multipla, con quattro opzioni distinte e una sola giusta.

## Regole comuni

- Gli insiemi hanno da 3 a 6 elementi distinti tra 1 e 12, in ordine crescente.
- Una relazione non è mai tutto $A \times B$ e non è mai vuota.
- Al telefono: un'opzione tiene al massimo quattro coppie per riga, tre se c'è un numero di due cifre;
  oltre, va su più righe di un `gathered` con le graffe `\Big`. Nel problema l'elenco delle coppie va
  a capo ogni tre coppie, come nella lezione.
- I casi di un livello e la proprietà si estraggono una volta sola prima dei tentativi, così ognuno
  esce con la sua quota: la verifica controlla le quote dei casi dei livelli 2, 3 e 6.

## Livello 1: dalla proprietà alle coppie

$A$ e $B$ con 3-4 elementi, una proprietà tra "$a$ è un divisore di $b$", $a + b = k$ ($k$ da 5 a
10), $b = 2a$, $a < b$, $b = a + k$ ($k$ da 1 a 4), ognuna un quinto delle volte. La relazione ha da 2
a 6 coppie. Si chiede l'elenco delle coppie.

Esempio: $A = \{1,\ 4,\ 6\}$, $B = \{3,\ 7,\ 8\}$, $b = a + 2$. Per $a = 1$ serve $b = 3$, che sta in
$B$; per $a = 4$ serve $6$, che non ci sta; per $a = 6$ serve $8$: $\mathcal{R} = \{(1, 3),\ (6, 8)\}$.

Esempio: $A = \{4,\ 6,\ 7\}$, $B = \{5,\ 6,\ 7\}$, $a < b$. $\mathcal{R} = \{(4, 5),\ (4, 6),\ (4, 7),\ (6, 7)\}$;
$7$ non compare in nessuna coppia.

Distrattori: le coppie scambiate (riquadro "Scambiare l'ordine nella coppia"); la relazione con una
coppia in più, per $a < b$ di preferenza una coppia $(x, x)$ (l'errore di $\le$); la relazione con una
coppia in meno; una in meno e una in più.

## Livello 2: la coppia sta nella relazione?

Stessi insiemi e proprietà del livello 1. Quattro affermazioni su quattro coppie diverse, scritte con
$(a, b) \in \mathcal{R}$, $(a, b) \notin \mathcal{R}$, $a \mathrel{\mathcal{R}} b$ o
$a \mathrel{\not\mathcal{R}} b$ (a caso); una sola è vera. Le coppie trappola vengono dagli avvisi
della lezione: una coppia di $\mathcal{R}$ scambiata, che non sta in $\mathcal{R}$, e una coppia che
soddisfa la proprietà ma non sta in $A \times B$ ("Dimenticare gli insiemi").

Due casi, metà ciascuno:
- `vera-appartiene`: la vera dice che una coppia di $\mathcal{R}$ ci appartiene; le false dicono che
  appartengono la coppia scambiata e la coppia fuori da $A \times B$, più una tra "appartiene" per una
  coppia di $A \times B$ senza la proprietà e "non appartiene" per un'altra coppia di $\mathcal{R}$.
- `vera-non-appartiene`: la vera dice che la coppia scambiata, oppure quella fuori da
  $A \times B$, non appartiene; le false dicono che appartiene l'altra trappola, che appartiene una
  coppia di $A \times B$ senza la proprietà, che non appartiene una coppia di $\mathcal{R}$.

Esempio: $A = \{4,\ 6,\ 7\}$, $B = \{5,\ 6,\ 7\}$, $a < b$. Vera: $3 \mathrel{\not\mathcal{R}} 6$,
perché $3 \notin A$. False: $4 \mathrel{\not\mathcal{R}} 7$, $(7, 6) \in \mathcal{R}$ (vale
$7 \ge 6$), $6 \mathrel{\mathcal{R}} 4$ ($4 \notin B$).

Esempio: $A = \{2,\ 3,\ 5,\ 7\}$, $B = \{4,\ 6,\ 9,\ 10\}$, "$a$ è un divisore di $b$". Vera:
$(3, 9) \in \mathcal{R}$. False: $(6, 2) \in \mathcal{R}$, $(2, 8) \in \mathcal{R}$ ($8 \notin B$),
$(3, 4) \in \mathcal{R}$.

I passaggi spiegano ogni affermazione: quale elemento non sta nel suo insieme, oppure il conto che
fa valere o no la proprietà.

## Livello 3: la tabella a doppia entrata

$A$ con 3-4 elementi tra 1 e 9, $B$ con 3-4 elementi tra 1 e 12, da 3 a 7 caselle segnate scelte a
caso. Tre casi, un terzo ciascuno:
- `elenco`: scrivere le coppie. Distrattori: la tabella letta per colonne (coppie scambiate), le
  caselle vuote al posto di quelle segnate (se sono al massimo 9), una coppia in meno, una in più.
- `senza-corrispondenti`: gli elementi di $A$ con la riga vuota (almeno uno, non tutti).
- `non-raggiunti`: gli elementi di $B$ con la colonna vuota (almeno uno, non tutti).

Negli ultimi due casi i distrattori sono: righe e colonne scambiate (le colonne vuote al posto delle
righe vuote, o il contrario), gli elementi che hanno corrispondenti, la risposta con un elemento in
più o in meno.

Esempio: $A = \{1,\ 2,\ 4,\ 5\}$, $B = \{1,\ 5,\ 12\}$, segnate $(2, 12)$, $(5, 1)$, $(5, 5)$. Le righe
di $1$ e di $4$ sono vuote: $\{1,\ 4\}$.

Esempio: $A = \{4,\ 6,\ 8,\ 9\}$, $B = \{2,\ 4,\ 5,\ 8\}$, segnate $(6, 2)$, $(8, 2)$, $(8, 4)$,
$(9, 4)$, $(9, 8)$. La colonna di $5$ è vuota: $\{5\}$.

## Livello 4: dalle coppie alla proprietà

$A$ e $B$ con 3-4 elementi, una relazione di 3-5 coppie da una proprietà tra divisore, $a + b = k$,
$b = 2a$, $a < b$, $b = a + k$ e $b = a^2$ (un sesto ciascuna). Si dà l'elenco e si sceglie la
proprietà tra quattro. Le quattro proprietà danno quattro relazioni diverse su $A \times B$, e solo la
giusta dà $\mathcal{R}$.

Distrattori, in quest'ordine di preferenza: una proprietà vera per tutte le coppie ma anche per altre
(l'errore dell'esempio 2 della lezione: controllare che la proprietà non includa coppie in più);
la proprietà rovesciata ("multiplo" per "divisore", $a = 2b$ per $b = 2a$, $a > b$ per $a < b$,
$a = b + k$ per $b = a + k$); per $a + b = k$ e $b = a + k$ lo stesso tipo con $k \pm 1$; poi
proprietà vere per qualcuna delle coppie.

Esempio: $A = \{1,\ 2,\ 3\}$, $B = \{1,\ 4,\ 6,\ 9\}$, $\mathcal{R} = \{(1, 1),\ (2, 4),\ (3, 9)\}$.
Giusta $b = a^2$; "$a + b$ è pari" vale anche per $(1, 9)$; $a < b$ non vale per $(1, 1)$.

Esempio: $A = \{1,\ 2,\ 4\}$, $B = \{1,\ 2,\ 4,\ 8\}$, $\mathcal{R} = \{(1, 2),\ (2, 4),\ (4, 8)\}$.
Giusta $b = 2a$; "$a$ è un divisore di $b$" vale anche per $(1, 1)$; $a = 2b$ non vale per $(1, 2)$.

## Livello 5: relazione in un insieme, con i cappi

$A$ con 3-5 elementi (tra 1 e 9 per il divisore, tra 1 e 7 per le altre), una proprietà tra
"$x$ è un divisore di $y$", $x < y$, $x \le y$, "$x + y$ è pari", $x + y = k$ (un quinto ciascuna), da
3 a 8 coppie. Con le proprietà che valgono per $(x, x)$ la relazione ha sempre anche coppie che non
sono cappi.

Distrattori: la relazione senza i cappi (sempre presente quando ci sono cappi); la relazione con
tutti i cappi aggiunti (per $x < y$ e simili); l'inversa, se è diversa; una coppia in meno o in più.

Esempio: $A = \{2,\ 6,\ 7\}$, "$x + y$ è pari". $\mathcal{R} = \{(2, 2),\ (2, 6),\ (6, 2),\ (6, 6),\ (7, 7)\}$,
con tre cappi; il distrattore principale è $\{(2, 6),\ (6, 2)\}$.

Esempio: $A = \{1,\ 2,\ 3,\ 4\}$, "$x$ è un divisore di $y$": le otto coppie dell'esempio 4 della
lezione.

## Livello 6: la relazione inversa

Due casi, metà ciascuno.

- `coppie`: $A$ con 3 elementi, $B$ con 3-4, una relazione di 2-5 caselle scelte a caso, data come
  elenco; si chiedono le coppie di $\mathcal{R}^{-1}$. Opzioni: l'inversa, $\mathcal{R}$ stessa, la
  negazione ($A \times B$ meno $\mathcal{R}$) e la negazione scambiata. La negazione ha al massimo 8
  coppie.
- `proprieta`: una relazione in $A$ (4-6 elementi) data a parole, tra divisore, multiplo, minore,
  maggiore, doppio e metà, con almeno due coppie. Opzioni: la proprietà dell'inversa, la proprietà
  stessa, la sua negazione e la negazione dell'inversa, che su $A$ danno quattro relazioni diverse
  (riquadro "Confondere l'inversa con la negazione").

Esempio: $A = \{1,\ 2,\ 6,\ 8\}$, "$x$ è un divisore di $y$". L'inversa è "$x$ è un multiplo di $y$";
la negazione "$x$ non è un divisore di $y$" ha $16 - 9 = 7$ coppie, l'inversa $9$.

Esempio: $A = \{2,\ 5,\ 7\}$, $B = \{1,\ 3,\ 6\}$, $\mathcal{R} = \{(2, 3),\ (5, 1)\}$. $\mathcal{R}^{-1} = \{(1, 5),\ (3, 2)\}$;
la negazione ha le altre 7 coppie di $A \times B$.

## Esercizi da evitare

- Relazioni vuote o uguali a tutto $A \times B$: la domanda diventa banale.
- Una coppia fuori da $A \times B$ trattata come elemento della relazione.
- Due opzioni con le stesse coppie, anche se scritte in modo diverso; al livello 4 e al livello 6
  due proprietà che su quegli insiemi danno le stesse coppie.
- Relazioni in un insieme fatte solo di cappi.
- $y = 2x$ al livello 5: su 3-5 numeri piccoli dà quasi sempre meno di tre coppie, ed è stato tolto.

## Verifica

`sample.mts relazioni-binarie 1000 all 1` e `… 7001`, passati a `verify.py`: PASS con entrambi i
seed, 6.000 esercizi su 6.000 ciascuno. Quote dei casi con il seed 1: livello 2 504 e 496, livello 3
341, 331 e 328, livello 6 504 e 496.

Esercizi diversi su 1.000 per livello (seed 1, poi 7001): livello 1 984 e 987, livello 2 973 e 988,
livello 3 1.000 e 1.000, livello 4 791 e 788, livello 5 363 e 359, livello 6 934 e 935. Il livello 5
è il più stretto perché un insieme di 3-5 numeri tra 1 e 7 (o 9) con meno di 9 coppie ha poche
scelte.

Larghezza (`width.mts`): problema al massimo 265 px su 350, opzioni al massimo 219 px su 252. La
prima misura trovava un'opzione a 257 px (quattro coppie con un numero di due cifre); da allora le
opzioni con un numero di due cifre tengono tre coppie per riga, e il controllo Python lo verifica.

Errori piantati, tutti bocciati dal controllo:
- livello 1: indice dell'opzione giusta spostato; coppie giuste scambiate nei valori; LaTeX di
  un'opzione diverso dai suoi valori; proprietà cambiata in `params`; un elemento 13 in $A$;
- livello 2: l'affermazione vera trasformata in "non appartiene" (anche con il testo coerente); caso
  dichiarato sbagliato; la coppia fuori da $A \times B$ portata dentro gli insiemi, con il problema
  riscritto;
- livello 3: una casella tolta dalla tabella; una riga vuota riempita nella tabella; un numero in più
  nella risposta; indice della scelta spostato;
- livello 4: la proprietà giusta sostituita dal primo distrattore (anche con il testo coerente);
  l'elenco del problema cambiato;
- livello 5: la risposta giusta senza i cappi; la proprietà cambiata;
- livello 6: l'inversa sostituita da $\mathcal{R}$; l'inversa sostituita dalla negazione (anche con il
  testo coerente); il testo di un'opzione diverso dal suo codice;
- campione senza variante a scelta multipla.

## Domande per la revisione

- La lezione ha cinque rappresentazioni, ma gli esercizi usano solo la proprietà, l'elenco e la
  tabella: il diagramma a frecce e il grafico cartesiano richiedono una figura. Vale la pena generare
  figure (come fa la chimica) o bastano la lezione e le flashcard?
- Al livello 2 compare la coppia con un elemento fuori da $A$ o da $B$ anche quando la proprietà vale
  (per esempio $(2, 8)$ con $8 \notin B$). È la trappola dell'avviso "Dimenticare gli insiemi", ma
  qualche studente potrebbe trovarla un tranello: la teniamo in metà degli esercizi o in tutti?
- Al livello 6 le proprietà a parole "$x$ è il doppio di $y$" e "$x$ è la metà di $y$" non sono nella
  lezione (che usa divisore, multiplo, minore e maggiore). Vanno bene o si tolgono?
- La tabella del livello 3 ha nell'angolo $a \backslash b$, come la lezione; sul telefono si legge?
  Da controllare nella pagina.
