# Probabilità della somma e dell'evento contrario

Generatore: `leggi-probabilita` (`src/lib/exercises/v2/generators/leggi-probabilita.ts`). Verifica
indipendente: `scripts/exercises/checkers/leggi_probabilita.py`. Lezione collegata: "Probabilità della
somma e dell'evento contrario" (`docs/lezioni/riscritte/95-leggi-probabilita.md`), con la sezione "Per
il generatore" della sua nota (`docs/lezioni/note/95-leggi-probabilita.md`).

Lo studente calcola la probabilità dell'evento contrario, usa il contrario per gli eventi "almeno
uno", calcola la probabilità dell'unione di eventi incompatibili e di eventi compatibili (con un dado,
con il mazzo, con due dadi) e usa una tabella a doppia entrata per "A o B" e per "né A né B". Le
definizioni (evento, evento contrario, eventi incompatibili, probabilità classica) sono della lezione
94 e qui si usano senza ridefinirle.

## Rappresentazione

- Il problema è prosa, spezzata in righe `\text{}` con `textBlock` e mostrata dalla pagina come un
  paragrafo; al livello 1 (caso `astratto`) seguono due formule, `p(E) = \dfrac{3}{8}` e
  `p(\overline{E}) = \ ?`; al livello 6 (forma `tabella`) segue la tabella a doppia entrata.
- La tabella ha le colonne della lezione, con intestazioni corte perché stia in 350 px:
  `\begin{array}{c|c|c|c} & \text{Occhiali} & \text{Senza} & \text{Totale} \\ \hline \text{Ragazze} & 4
  & 8 & 12 \\ ... \\ \hline \text{Totale} & 10 & 15 & 25 \end{array}`.
- La risposta è sempre `number`: un razionale esatto e ridotto, strettamente tra $0$ e $1$ (`"7/10"`).
  La soluzione finisce con la frazione ridotta, scritta `\dfrac{7}{10}`; nei passaggi le frazioni si
  scrivono prima come si contano e poi ridotte ($\dfrac{12}{40} = \dfrac{3}{10}$), come nella lezione.
- Mazzo di $40$ carte napoletane, urna di palline colorate, dadi e monete non truccati, coppie $(a, b)$
  per i due dadi, $T$ e $C$ per le monete, $p(E)$, $\overline{E}$, $A \cup B$, $A \cap B$: tutto come
  nelle lezioni 94 e 95.
- `params` ha `case` (il caso di cui la verifica controlla la quota), `den` (il numero degli esiti,
  da cui nascono i distrattori vicini), `mistakes` (i valori sbagliati della lezione, in ordine) e i
  dati del caso: gli eventi come sono scritti nel testo, i colori e i conteggi dell'urna, i numeri
  della tabella.

## Regole comuni

- Ogni evento del testo ha un nome fisso che la verifica sa leggere: per un dado "un numero pari",
  "un numero dispari", "un numero maggiore di $k$", "un numero minore di $k$", "un multiplo di 3", "un
  numero primo" o una faccia; per il mazzo "una figura", "un asso" (e fante, cavallo, re, da "un 2" a
  "un 7"), "una carta di coppe", "una figura di spade", "l'asso di denari"; per due dadi "esca un
  doppio", "la somma sia $s$", "la somma sia maggiore (minore) di $s$", "il primo (secondo) dado dia
  $k$", "esca almeno un $k$", "escano due numeri pari (dispari)".
- Nessuna risposta vale $0$, $1$ o una probabilità banale; nell'unione di due eventi l'unione non è
  mai tutto $\Omega$, e gli eventi compatibili non sono mai uno contenuto nell'altro (altrimenti
  l'unione sarebbe il più grande dei due e la formula non servirebbe).
- Scelta multipla: quattro opzioni diverse, frazioni ridotte. Prima i distrattori degli errori della
  lezione, quando sono probabilità (tra $0$ e $1$, $1$ compreso) e diversi dalla risposta; poi i
  vicini della risposta con lo stesso denominatore naturale ($\dfrac{k \pm 1}{n}$, poi
  $\dfrac{k \pm 1}{2n}$). Un'opzione negativa c'è solo al livello 1, ed è $p(E) - 1$.
- Nel testo niente trattini lunghi e niente parole vietate dalle regole di scrittura.

## Livello 1: evento contrario

Quattro casi, un quarto ciascuno.

- `dado`: "Si lancia un dado. Qual è la probabilità che non esca un numero maggiore di 4?"
  $\Rightarrow 1 - \dfrac{2}{6} = \dfrac{2}{3}$.
- `mazzo`: una figura, un valore, un seme, le figure di un seme o una carta sola. "Qual è la
  probabilità che non esca una figura?" $\Rightarrow 1 - \dfrac{3}{10} = \dfrac{7}{10}$ (esempio 1);
  opzioni $\dfrac{7}{10}$, $\dfrac{3}{10}$ ($p(E)$), $-\dfrac{7}{10}$ ($p(E) - 1$), $\dfrac{29}{40}$.
- `urna`: tre colori da $2$ a $9$ palline, da $10$ a $24$ in tutto. "Qual è la probabilità che la
  pallina estratta non sia bianca?"
- `astratto`: è data $p(E) = \dfrac{a}{b}$ con $b$ da $5$ a $12$ (o, metà delle volte, $p(\overline{E})$)
  e si chiede l'altra.

Vincolo: $p(E) \neq \dfrac{1}{2}$, altrimenti il distrattore $p(E)$ sarebbe la risposta. Distrattori:
$p(E)$, l'evento stesso; $p(E) - 1$, la sottrazione al contrario (la nota della lezione li propone
tutti e due).

## Livello 2: almeno uno

- `dadi` (60%): "Si lanciano due dadi. Qual è la probabilità che esca almeno un 6?" Metà delle volte
  una faccia, metà un insieme di facce ("almeno un numero pari", "maggiore di $k$", "minore di $k$",
  "multiplo di 3"). Si conta il contrario, nessun dado nell'insieme: $(6 - m)^2$ coppie. Almeno un $6$
  $\Rightarrow \dfrac{11}{36}$; opzioni $\dfrac{11}{36}$, $\dfrac{1}{3}$ ($\frac{1}{6} + \frac{1}{6}$),
  $\dfrac{5}{18}$ (esattamente un $6$), $\dfrac{25}{36}$ (il contrario).
- `monete` (40%): due (25%), tre (50%) o quattro (25%) monete, almeno una testa o almeno una croce.
  Tre monete $\Rightarrow 1 - \dfrac{1}{8} = \dfrac{7}{8}$ (esempio 3); opzioni $\dfrac{7}{8}$,
  $\dfrac{1}{8}$, $\dfrac{3}{8}$ (esattamente una), $\dfrac{5}{8}$ (il contrario sbagliato, "esattamente
  una").

Distrattori: la somma delle probabilità dei singoli dadi ($\frac{m}{6} + \frac{m}{6}$) o delle monete
($\frac{1}{2} \cdot n$) quando non supera $1$; "esattamente uno"; il contrario; $1$ meno "esattamente
uno" (l'avviso "Il contrario sbagliato").

## Livello 3: unione di eventi incompatibili

Tre casi, un terzo ciascuno.

- `mazzo`: due valori ("un asso o un re", $\dfrac{1}{5}$, esempio 4), un valore da asso a $7$ e una
  figura, due semi.
- `urna`: tre colori, se ne chiedono due; un quarto delle volte quattro colori, e se ne chiedono tre
  (la regola per più eventi incompatibili a due a due).
- `dado`: due eventi senza esiti comuni e con unione diversa da $\Omega$ ("un numero minore di 3 o un
  numero maggiore di 4", $\dfrac{2}{3}$).

Distrattori: il prodotto $p(A) \cdot p(B)$ (la nota), la somma sbagliata delle frazioni
$\dfrac{k_A + k_B}{2n}$ (numeratori e denominatori sommati), il contrario $1 - p$, la sola probabilità
dell'evento più grande.

## Livello 4: unione di eventi compatibili

- `mazzo` (50%): un seme e una figura ($\dfrac{19}{40}$, esempio 6) o un seme e un valore
  ($\dfrac{13}{40}$), nei due ordini.
- `dado` (50%): due eventi con esiti comuni, nessuno dentro l'altro, unione diversa da $\Omega$ ("un
  numero pari o un numero maggiore di 3", $\dfrac{2}{3}$, l'avviso della lezione). Nei passaggi
  $A$, $B$ e $A \cap B$ scritti come insiemi.

Distrattori: $p(A) + p(B)$ senza togliere l'intersezione (quando non supera $1$: nel caso dell'avviso
è proprio $1$), l'intersezione tolta due volte, $p(A \cap B)$, il contrario.

## Livello 5: unione con due dadi

- `compatibili` (75%): due eventi di tipo diverso (il doppio, la somma, la somma maggiore o minore di,
  il primo o il secondo dado, almeno un $k$, due pari o due dispari) con coppie comuni, nessuno dentro
  l'altro. "Si lanciano due dadi. Qual è la probabilità che esca un doppio o che la somma sia 8?"
  $\Rightarrow \dfrac{6}{36} + \dfrac{5}{36} - \dfrac{1}{36} = \dfrac{5}{18}$ (esempio 7); opzioni con
  $\dfrac{11}{36}$ (la nota).
- `incompatibili` (25%): due eventi senza coppie comuni ("la somma sia maggiore di 10 o che il secondo
  dado dia 2", $\dfrac{1}{4}$): il passo 4 del procedimento, controllare se ci sono esiti comuni prima
  di sottrarre.

Distrattori (compatibili): la somma senza sottrarre, l'intersezione tolta due volte, $p(A \cap B)$, il
contrario. Distrattori (incompatibili): una coppia comune tolta senza che ci sia
($\dfrac{k_A + k_B - 1}{36}$), il prodotto, il contrario, l'evento più grande.

## Livello 6: tabella a doppia entrata

Quattro contesti: una classe (ragazze e ragazzi, occhiali, come nell'esempio 8), una squadra di
atletica (ragazze e ragazzi, chi fa anche nuoto), una gita (prima e seconda, pranzo al sacco), un
sondaggio (biennio e triennio, chi legge fumetti). $N$ da $20$ a $32$, ogni casella almeno $1$, "di cui"
almeno $2$. Due forme per due domande, un quarto ciascuna:

- `testo`: i numeri come nell'esempio 8 ("In una classe di 25 studenti ci sono 12 ragazze e 13 ragazzi;
  portano gli occhiali 10 studenti, di cui 4 ragazze."); lo studente completa la tabella, che è nel
  primo passaggio.
- `tabella`: la tabella completa, con i totali, sotto il testo.
- `unione`: "Qual è la probabilità che sia una ragazza o porti gli occhiali?" ($\dfrac{18}{25}$).
- `nessuno`: "Qual è la probabilità che non sia una ragazza né porti gli occhiali?" ($\dfrac{7}{25}$),
  il contrario dell'unione.

Metà delle domande riguarda il secondo gruppo (i ragazzi, la seconda, il triennio): l'intersezione non
è il numero scritto dopo "di cui" ma la differenza.

Distrattori (unione): la somma senza sottrarre ($\dfrac{22}{25}$), l'intersezione ($\dfrac{4}{25}$),
l'intersezione tolta due volte, "né... né...". Distrattori (né... né...): l'unione (manca l'ultimo
passo), $1 - p(A) - p(B)$ quando è positivo, l'intersezione.

## Verifica

Il controllo Python rilegge l'esperimento e gli eventi dalla prosa del problema, trasforma ogni frase in
un predicato scritto nel controllo (non preso dal generatore), costruisce lo spazio campionario con
`itertools` (un dado, $36$ coppie, $2^n$ esiti delle monete, $40$ carte, le palline dell'urna, le
persone della tabella) e conta le probabilità con `Fraction`. Controlla: risposta uguale al conto e
ridotta, strettamente tra $0$ e $1$; soluzione che finisce con la frazione ridotta; vincoli del livello
(eventi incompatibili al 3, compatibili e non annidati al 4, unione diversa da $\Omega$, $p(E) \neq
p(\overline{E})$ al 1, totali della tabella coerenti, gruppo della domanda uguale alla riga della
tabella); caso uguale a `params.case` e quote dei casi; opzioni: quattro, frazioni ridotte che dicono il
valore dichiarato, tutte diverse come numeri, una sola giusta e `correct` su quella, negative solo al
livello 1, e i primi distrattori con nome della lezione presenti quando sono probabilità.

Esito (28 settembre 2026, 1.000 esercizi per livello): PASS con seed 1 e con seed 50001, 6.000 su
6.000 ogni volta. Quote dei casi dentro `CASE_RANGES` con tutti e due i seed.

Esercizi diversi su 1.000 (seed 1 / seed 50001): livello 1 388 / 362, livello 2 21 / 21, livello 3
490 / 452, livello 4 138 / 140, livello 5 643 / 621, livello 6 999 / 1.000. Il livello 2 ha solo 21
esercizi possibili (15 domande con due dadi, 6 con le monete): la regola si applica a pochi esperimenti
e i numeri non si possono cambiare senza uscire dalla lezione. Il livello 4 ne ha 142 (88 con il mazzo,
54 con il dado).

Errori piantati a mano, tutti bocciati: risposta cambiata (livello 1); `correct` spostato (livello 3);
opzione scritta non ridotta, $\dfrac{2}{4}$ (livello 4); eventi incompatibili al livello 4; eventi
compatibili al livello 3 (un seme e un asso); distrattore prodotto tolto (livello 3); distrattore
$p(E)$ tolto (livello 1); riga dei totali sbagliata (livello 6); gruppo cambiato nella domanda con la
risposta vecchia (livello 6); unione data come risposta a "né... né..." (livello 6); soluzione non
ridotta, $\dfrac{10}{36}$ (livello 5); eventi uno dentro l'altro, doppio e somma 2 (livello 5); caso
sbagliato in `params` (livello 2); domanda senza "non" (livello 1); opzione con il LaTeX che non dice
il suo valore (livello 2).

Larghezza (`width.mts`): nessuna formula del problema oltre 350 px, la più larga è la tabella del
livello 6 con $344$ px; nessuna opzione oltre 252 px, la più larga $53$ px.

## Figure

Il livello 5 vorrebbe la tabella $6 \times 6$ dei due dadi con le caselle dei due eventi colorate, come
`due-dadi-doppio-o-somma-otto` della lezione: con eventi come "la somma è minore di 6" contare le coppie
a mente è la parte difficile, e la tabella la toglie o la lascia allo studente secondo che la si mostri
nel problema o nella soluzione (la proposta è nella soluzione). Il livello 4 con il mazzo potrebbe avere
nella soluzione il diagramma di Venn con i numeri di carte per zona (`coppe-o-figura-diagramma-venn`).
Il livello 2 con i dadi, nella soluzione, la tabella di `due-dadi-almeno-un-sei`. Nessun livello ne ha
bisogno per capire il testo.

## Domande per la revisione

- Livello 1, caso `astratto`: la probabilità data come numero, senza esperimento, è nella lezione solo
  come formula ($p(E) = 1 - p(\overline{E})$). Va bene come esercizio, o meglio sempre un esperimento?
- Livello 1: il distrattore $p(E) - 1$ è negativo e si scarta a occhio. La nota lo propone; lo teniamo
  o lo sostituiamo con un vicino?
- Livello 2: le quattro monete ($16$ esiti) non sono nella lezione, che arriva a tre. Troppe?
- Livello 3: la somma sbagliata $\dfrac{k_A + k_B}{2n}$ (numeratori e denominatori sommati) non è nella
  nota; l'ho aggiunta perché è l'errore più comune con le frazioni. Va bene?
- Livello 5: eventi come "il secondo dado dia 2" o "escano due numeri dispari" sono nella 94 solo in
  parte. Il vocabolario degli eventi sui due dadi è quello che usate?
- Livello 6: "né... né..." è scritto "che non sia una ragazza né porti gli occhiali" (la lezione dice
  "che non sia né una ragazza né porti gli occhiali"). La nota chiede se nel biennio si fanno domande
  con "né... né...": se no, il livello tiene solo l'unione.
- Livello 6: le intestazioni della tabella sono accorciate ("Senza" al posto di "Senza occhiali",
  "Pranzo" per "pranzo al sacco") perché la tabella stia sul telefono. Si capiscono?
- La formula dell'unione non ha nome nei passaggi, come nella lezione (la nota chiede ad Andrea se nei
  libri si chiama "teorema della probabilità totale").
