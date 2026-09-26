# Differenza e complementare

Generatore: `insiemi-differenza` (`src/lib/exercises/v2/generators/insiemi-differenza.ts`).
Verifica indipendente: `scripts/exercises/checkers/insiemi_differenza.py`. Lezione collegata:
"Differenza e complementare" (`docs/lezioni/riscritte/64-insiemi-differenza.md`), livelli presi dalla
sezione "Per il generatore" della nota `docs/lezioni/note/64-insiemi-differenza.md`.

Convenzioni della lezione: $A \setminus B$ per la differenza, $\overline{A}$ per il complementare,
$|A|$ per la cardinalità, $0 \in \mathbb{N}$, insiemi elencati in ordine crescente, $\emptyset$ per
l'insieme vuoto. Livelli 1, 2, 4 e 5 con risposta `set` (solo numeri), livelli 3, 6 e 7 con risposta
`number`, la variante "identità" del livello 5 con risposta `choice`. Tutti hanno la variante a scelta
multipla con quattro opzioni distinte.

## Rappresentazione

- Livello 1: `params.A`, `params.B` elencati, `asked` (`A-B` o `B-A`), `case`.
- Livello 2: `params.A`, `params.B` sono proprietà `{dom, conds}` come in `insiemi-rappresentazione`;
  il verificatore elenca il primo insieme della differenza (sempre finito) e prova ogni suo elemento
  sulle condizioni del secondo, che può essere infinito (pari, dispari, multipli).
- Livello 3: `variant` (`formula`, `complementare`, `problema`) con i numeri; per il problema anche
  `context` e `which` (quale "ma non").
- Livello 4: `variant` (`complementare`, `intersezione`) con `U`, `A` e `B`.
- Livello 5: `variant` (`unione`, `intersezione`, `identità`); per l'identità `lhs` e `rhs` sono
  codici di espressioni (`c(u(A,B))` è $\overline{A \cup B}$) e ogni opzione ha il suo codice in
  `values`.
- Livelli 6 e 7: le zone del diagramma (`total`, `a`, `b`, `both`, `none`; per tre insiemi `only`,
  `p01`, `p02`, `p12`, `t`, `none`), `context`, `which`, `variant`.
- `params.wrong` (insiemi) e `params.mistakes` (numeri) sono i distrattori.

## Livello 1: differenza di due insiemi elencati

Numeri da 1 a 12, insiemi di 2-6 elementi, si chiede $A \setminus B$ o $B \setminus A$. Tre casi:
elementi in comune (circa 70%), disgiunti (circa 15%, la differenza è il primo insieme), primo
insieme contenuto nel secondo (circa 15%, la differenza è $\emptyset$). I passaggi seguono la lezione:
si parte dal primo insieme e si cancellano gli elementi che stanno anche nel secondo.

Esempi: $A = \{6, 7, 12\}$, $B = \{4, 8, 12\}$, $A \setminus B = \{6, 7\}$.
$A = \{2, 8, 9, 10\}$, $B = \{2, 8, 10\}$, $B \setminus A = \emptyset$.

## Livello 2: insiemi descritti da una proprietà in ℕ

Come gli esempi 2 e 3 della lezione. Il primo insieme della differenza è finito: $x < n$, $x \le n$
o "$x$ è un divisore di $n$"; il secondo può essere $x$ pari, dispari, multiplo di 3, 4 o 5, $x < m$
o i divisori di $m$. Si chiede $A \setminus B$ o $B \setminus A$, e l'insieme finito può essere $A$ o
$B$. Circa 15% con differenza vuota (primo insieme contenuto nel secondo, come l'esempio 3: $x < 4$
e $x < 7$, divisori di 6 e divisori di 12). Negli altri casi si toglie almeno un elemento e ne restano
da 2 a 9. Lo $0$ conta: è in $\mathbb{N}$, è pari ed è multiplo di ogni numero.

Esempi: $A$ divisori di 20, $B = \{x \in \mathbb{N} \mid x < 10\}$: $B \setminus A = \{0, 3, 6, 7, 8, 9\}$.
$A = \{x \in \mathbb{N} \mid x \le 10\}$, $B = \{x \in \mathbb{N} \mid x < 7\}$: $B \setminus A = \emptyset$.

## Livello 3: quanti elementi

Tre varianti. `formula` (circa 35%): da $|A|$, $|B|$, $|A \cap B|$ si trova $|A \setminus B|$ o
$|B \setminus A|$ con $|A \setminus B| = |A| - |A \cap B|$; $|B|$ è nei dati apposta, per l'errore
dell'avviso della lezione. `complementare` (circa 25%): $|\overline{A}| = |U| - |A|$. `problema`
(circa 40%): l'esempio 4 della lezione ("quanti suonano ma non cantano"), senza il totale, in quattro
contesti. La risposta non è mai un numero già scritto nel testo.

Esempi: $|A| = 7$, $|B| = 30$, $|A \cap B| = 5$: $|A \setminus B| = 2$. "In una classe 20 studenti
giocano a calcio, 20 fanno nuoto e 6 fanno tutti e due gli sport. Quanti studenti giocano a calcio ma
non fanno nuoto?" 14.

## Livello 4: complementare e $A \cap \overline{B}$

$U = \{1, \dots, n\}$ con $n$ da 8 a 12, scritto per esteso. `complementare` (circa 55%): $A$ elencato,
si chiede $\overline{A}$, con almeno 3 elementi. `intersezione` (circa 45%): $A$ e $B$ con elementi in
comune, si chiede $A \cap \overline{B}$, come nell'esempio 7: prima $\overline{B}$, poi l'intersezione,
e il passaggio finale dice che è $A \setminus B$.

Esempi: $U = \{1, \dots, 11\}$, $A = \{1, 2, 4, 7, 8\}$: $\overline{A} = \{3, 5, 6, 9, 10, 11\}$.
$U = \{1, \dots, 12\}$, $A = \{2, 5, 7, 11\}$, $B = \{5, 8, 11, 12\}$: $A \cap \overline{B} = \{2, 7\}$.

## Livello 5: leggi di De Morgan

Due varianti con gli insiemi, come l'esempio 8: $U = \{1, \dots, n\}$ con $n$ da 8 a 12, $A$ e $B$
con elementi in comune e che non coprono $U$; si chiede $\overline{A \cup B}$ (circa 35%) o
$\overline{A \cap B}$ (circa 35%). I passaggi calcolano prima quello che sta sotto la sbarra, poi il
complementare, poi controllano con la legge. Il verificatore controlla che la legge sbagliata
($\overline{A} \cup \overline{B}$ al posto di $\overline{A} \cap \overline{B}$) dia un insieme diverso.

Variante `identità` (circa 30%): "quale espressione è uguale a questa, qualunque siano gli insiemi
$A$ e $B$?" per $\overline{A \cup B}$, $\overline{A \cap B}$, $\overline{\overline{A} \cup B}$,
$\overline{A \cap \overline{B}}$ e $A \setminus B$. Il verificatore prova ogni opzione su tutte le 64
coppie di sottoinsiemi di $\{1, 2, 3\}$ (ogni zona del diagramma ha un suo elemento): la giusta è
uguale al primo membro su tutte, ogni distrattore è diverso almeno su una, e i distrattori sono
diversi tra loro.

Esempi: $U = \{1, \dots, 12\}$, $A = \{2, 5, 8, 9, 10, 11\}$, $B = \{3, 4, 5, 10, 11, 12\}$:
$\overline{A \cup B} = \{1, 6, 7\}$. $\overline{A \cap \overline{B}} = \overline{A} \cup B$.

## Livello 6: problemi con due insiemi

Come gli esempi 9 e 10, in quattro contesti (calcio e nuoto, strumento e coro, cane e gatto, inglese
e tedesco), con al massimo 60 persone e ogni zona del diagramma di almeno 2. Cinque domande: solo uno
dei due, detto "ma non" (circa 25%); uno solo dei due (circa 20%); nessuno (circa 20%); tutti e due
sapendo quanti non fanno niente (circa 20%, l'esempio 10); solo uno dei due sapendo quanti non fanno
niente (circa 15%). L'ultimo passaggio è il controllo con le quattro zone.

Esempi: "In un gruppo di 32 ragazzi, 10 hanno un cane, 16 hanno un gatto e 2 hanno sia un cane sia un
gatto. Quanti ragazzi hanno uno solo dei due animali?" 22. "In una classe di 30 studenti, 11 giocano a
calcio, 20 fanno nuoto e 7 non fanno nessuno dei due sport. Quanti studenti fanno tutti e due gli
sport?" 8.

## Livello 7: problemi con tre insiemi

Come l'esempio 11, in tre contesti (tre sport, tre lingue, tre strumenti). Si costruisce dalle otto
zone: centro da 2 a 4, zone con esattamente due insiemi da 1 a 5, zone con un solo insieme da 2 a 12,
nessuno da 2 a 8, totale fino a 70. Il testo dà i tre insiemi, le tre intersezioni a due (che
comprendono il centro) e il centro. Quattro domande: un solo insieme (circa 30%), solo uno di
un insieme scelto (circa 25%), esattamente due (circa 20%), nessuno (circa 25%). I passaggi riempiono
il diagramma dal centro verso l'esterno. Il verificatore crea una persona per ogni posto di ogni zona,
ricostruisce i tre insiemi, ricalcola tutti i dati del testo e le risposte contando le persone.

Esempio: "In una classe di 44 studenti, 17 giocano a calcio, 18 fanno nuoto e 17 giocano a pallavolo.
7 fanno calcio e nuoto, 3 calcio e pallavolo, 6 nuoto e pallavolo, e 2 fanno tutti e tre gli sport.
Quanti studenti fanno solo pallavolo?" 10.

## Variante a scelta multipla

Insiemi, dagli avvisi della lezione: $B \setminus A$ al posto di $A \setminus B$; gli elementi che
stanno in uno solo dei due insiemi (il $3$ dell'avviso messo nella differenza); l'intersezione; il
secondo insieme; per la differenza vuota $\{0\}$ (l'avviso "scrivere $0$ o $\{0\}$ al posto di
$\emptyset$") e il primo insieme intero. Al livello 2 lo $0$ dimenticato o tenuto quando va tolto, e
l'estremo di $x < n$ preso dentro. Al livello 4 $A$ stesso, il complementare in un universo che si
ferma al massimo di $A$ (l'avviso "calcolare il complementare senza guardare l'universo"),
$\overline{B}$ senza l'intersezione, $B \setminus A$, $A \cap B$, $\overline{A \cap B}$. Al livello 5
la sbarra portata su ogni insieme senza cambiare l'operazione, quello che sta sotto la sbarra,
$\overline{A} \cap B$. Solo come ultima risorsa l'insieme giusto con un elemento in meno o in più.

Numeri: $|A| - |B|$ (l'avviso "sottrarre $|B|$ invece di $|A \cap B|$"), la risposta a un'altra
domanda dello stesso problema, l'unione; al livello 7 il "solo calcio" calcolato come $20 - 6 - 5$
(l'avviso "togliere le intersezioni senza partire dal centro") e le intersezioni a due sommate senza
togliere il centro; poi ±1, ±2.

## Righe sul telefono

Misura con `scripts/exercises/width.mts` (26 settembre 2026): formule del problema al massimo 326 px
(livelli 4 e 5, la riga di $A$ e $B$ con 6 elementi ciascuno) e 305 px al livello 2; opzioni al
massimo 234 px. Niente oltre i limiti. Gli insiemi lunghi nelle opzioni vanno su due righe con
`fitSetChoice`.

## Esercizi diversi

Su 1.000 per livello (seed 1-1000), contando prompt e problema: 1.000 al livello 1, 457 al livello 2,
942 al livello 3, 942 al livello 4, 689 al livello 5, 999 al livello 6, 1.000 al livello 7. Il livello 5
comprende la variante `identità`, che ha solo cinque problemi diversi (le opzioni cambiano ordine).

## Figure

Nessuna figura: il sito oggi non le genera per gli esercizi di matematica. I livelli 6 e 7 vorrebbero
il diagramma di Eulero-Venn nella soluzione, con i numeri nelle zone come nelle figure
`problema-calcio-nuoto-venn` e `problema-tre-sport-venn` della lezione; il livello 4 (variante
`intersezione`) e il livello 5 vorrebbero la zona colorata.

## Verifiche

- `sample.mts insiemi-differenza 1000 all 1 | verify.py`: PASS, 7.000 esercizi. Con il seed 7001:
  PASS.
- Errori piantati, tutti bocciati: risposta senza un elemento (livello 1), caso sbagliato (livelli 1
  e 2), differenza chiesta scambiata (livello 2), risposta cambiata di 1 (livelli 3 e 7), un dato di
  params diverso dal testo (livello 3), opzione giusta spostata e due opzioni giuste (livello 4),
  LaTeX di un'opzione diverso dai suoi valori (livello 4), opzione giusta sostituita con un'espressione
  sbagliata e identità sbagliata in params (livello 5), risposta sbagliata (livello 5), zone che non
  danno il totale e testo cambiato (livello 6), una zona cambiata e l'insieme della domanda cambiato
  (livello 7), un ambiente `aligned` in un passaggio.
- `review.mts`, `width.mts` e il controllo dei passaggi con KaTeX escono senza errori.

## Esercizi da evitare

- Elementi ripetuti negli elenchi del problema.
- Risposte che sono già un numero del testo, e conteggi sotto 2 nei problemi ("1 studenti").
- Nei problemi, numeri 1 nel testo, che romperebbero l'accordo del verbo ("1 fanno").
- Differenze in cui il primo insieme è infinito (la risposta non si scrive per elencazione).

## Domande per la revisione

- Livello 2: il secondo insieme descritto come "$x$ è pari" o "$x$ è multiplo di 3" è infinito, e il
  passaggio lo scrive $\{0, 2, 4, \dots\}$ fino al massimo del primo. Va bene per il biennio, o meglio
  limitarlo con "$x \le 20$"?
- Livello 5, variante `identità`: $\overline{\overline{A} \cup B}$ e $A \setminus B = A \cap \overline{B}$
  sono un passo oltre l'esempio 8. Si tengono nel livello o vanno tolti?
- Livello 7: i problemi con tre insiemi hanno testi di sei righe sul telefono, con frasi che iniziano
  con un numero ("7 fanno calcio e nuoto"), come l'esempio 11. Serve un diagramma nella soluzione
  prima di pubblicarli?
