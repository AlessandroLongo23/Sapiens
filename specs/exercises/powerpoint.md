# Progettare una presentazione

Generatore: `powerpoint` (`src/lib/exercises/v2/generators/powerpoint.ts`). Verifica indipendente:
`scripts/exercises/checkers/powerpoint.py`. Lezione collegata: `docs/lezioni/informatica/riscritte/31-powerpoint.md`
(note in `docs/lezioni/informatica/note/31-powerpoint.md`). Aiuti comuni del capitolo:
`src/lib/exercises/v2/inf-documenti.ts` e `scripts/exercises/checkers/_inf_documenti.py`.

Sei livelli nell'ordine della lezione. Quattro sono di concetto, a scelta multipla (`answer.kind = 'choice'`),
composti da pezzi intercambiabili; due sono conti con risposta numerica (`answer.kind = 'number'`, scelta multipla
da `toChoice` con i valori di `params.wrong`).

## Nomi dei livelli

1. Lo scopo in una frase
2. Quante slide
3. Un'idea per slide
4. Apertura, sviluppo, chiusura
5. Il tempo di ogni parte
6. L'ordine della scaletta

## Regole comuni

Come in `specs/exercises/word.md`: dodici nomi, testo in righe `\text{…}`, numeri in formula, opzioni di testo su
righe di al più 26 caratteri, niente trattini lunghi e niente "piuttosto che". I titoli delle slide stanno tra
virgolette diritte. I dati dentro i titoli (bottigliette, orari, numeri di volontari) sono inventati e appartengono
alla storia, non sono fatti da verificare.

## Livello 1: lo scopo in una frase

"{Nome} prepara una presentazione {su un argomento}, da fare {ai compagni di classe | alla professoressa | ai
genitori, nella giornata di scuola aperta | agli alunni delle medie in visita}. Quale di queste frasi ne dice lo
scopo, cioè quello che il pubblico deve ricordare alla fine?"

Dieci argomenti (raccolta differenziata, vulcani italiani, sonno, api, acqua del rubinetto, biblioteca della scuola,
bicicletta, password, acquedotti romani, torneo di pallavolo), ognuno con due frasi di scopo. Le quattro opzioni sono
sempre una per tipo:

| Tipo | Come è fatta | Esempio |
|---|---|---|
| scopo (giusta) | frase con soggetto e verbo, dice che cosa deve restare al pubblico | "Senza le api avremmo meno frutta" |
| argomento | solo il nome dell'argomento | "Le api" |
| elenco | "Tutto quello che so", "Tutte le notizie trovate", "Un elenco di dati" seguito dall'argomento | "Tutto quello che so sulle api" |
| chi presenta | "Voglio prendere un bel voto", "Devo parlare per dieci minuti", "Voglio mostrare quanto ho studiato" | |

Sono i quattro inizi dell'esempio 1 della lezione.

## Livello 2: quante slide

"{Nome} ha $T$ minuti per la sua presentazione [, di cui $Q$ vanno lasciati alle domande | , e non sono previste
domande]. Dedica {un minuto | un minuto e mezzo | $2$ minuti | $3$ minuti} a ogni slide. Quante slide prepara al
massimo?"

- Costruito all'indietro: da $4$ a $12$ slide, il tempo per slide, un eventuale avanzo più corto di una slide, e
  $Q \in \{0, 2, 3, 5\}$; $T$ è sempre un numero intero di minuti.
- Risposta: $(T - Q)$ diviso per i minuti a slide, arrotondato per difetto.
- Casi: divisione esatta (tra il 45 e il 68 per cento) o con il resto.
- Distrattori: $T$ diviso per i minuti a slide, senza togliere le domande (avviso "Dividere il tempo intero");
  arrotondato per eccesso; i minuti per parlare presi come numero di slide; una in meno.

Esempi (esempi 3 e 4 della lezione): $15$ minuti, $3$ per le domande, un minuto e mezzo a slide: $8$. $20$ minuti, $5$
per le domande, $2$ minuti a slide: $15 : 2 = 7{,}5$, quindi $7$ (distrattori $8$ e $10$).

## Livello 3: un'idea per slide

"Nella scaletta di {Nome} per la presentazione {su un argomento} ci sono questi quattro titoli. Quale contiene più
di un'idea e va diviso in due slide?" Sei argomenti con cinque titoli a un'idea ciascuno. Due titoli, presi a caso,
si uniscono con "e" ("Come vive un alveare e che cosa mangiano le api"): è la risposta. Le altre tre opzioni sono i
tre titoli rimasti. Nessun titolo singolo contiene la congiunzione "e".

## Livello 4: apertura, sviluppo, chiusura

"{Nome} prepara una presentazione {su un argomento}. Una slide {descrizione}. In quale parte della presentazione
sta?" Opzioni fisse: nell'apertura, nello sviluppo, nella chiusura, in nessuna: va tolta. Tre descrizioni per
risposta, circa un quarto dei casi ciascuna:

| Risposta | Descrizioni |
|---|---|
| apertura | titolo della presentazione e nome di chi parla; di che cosa si parlerà e perché riguarda chi ascolta; la domanda a cui si risponderà |
| sviluppo | il secondo dei tre punti del discorso; il grafico con i dati raccolti, uno dei punti; come è stata fatta la prova, il primo punto |
| chiusura | la frase che il pubblico deve ricordare; le fonti e l'invito alle domande; che cosa si chiede di fare da domani |
| va tolta | le foto delle vacanze, che con lo scopo non hanno a che fare; una curiosità che non serve allo scopo; una slide già mostrata ripetuta per intero |

## Livello 5: il tempo di ogni parte

Due forme, metà ciascuna, con apertura di $a$ minuti ($1$-$3$), chiusura di $c$ ($1$-$2$), $k$ punti ($2$-$5$) di
$m$ minuti ($2$-$6$) e $T = a + c + k \cdot m$:

- "{Nome} ha $T$ minuti per la sua presentazione: ne dedica $a$ all'apertura e $c$ alla chiusura. Lo sviluppo ha $k$
  punti, tutti della stessa durata. Quanti minuti dura ogni punto?" Risposta $m$. Distrattori: $T : k$ e
  $(T - a) : k$ quando sono interi, $k \cdot m$ (si ferma ai minuti dello sviluppo), $m \pm 1$.
- "Nella presentazione di {Nome} l'apertura dura $a$ minuti e la chiusura $c$. Lo sviluppo ha $k$ punti di $m$
  minuti ciascuno. Quanti minuti dura la presentazione?" Risposta $T$. Distrattori: $k \cdot m$ (dimentica apertura
  e chiusura), $a + c + m$ (un punto solo), $a + c + k + m$.

Esempio (esempio 6 della lezione): $12$ minuti, $2$ e $1$, tre punti: $3$ minuti per punto.

## Livello 6: l'ordine della scaletta

"{Nome} ha scritto i titoli di quattro slide, alla rinfusa. A: "…". B: "…". C: "…". D: "…". In quale ordine vanno
nella scaletta, dall'apertura alla chiusura?" Otto scalette di quattro titoli, sempre con gli stessi ruoli: il
titolo della presentazione, il problema (o com'è oggi), quello che lo risolve (o che cosa cambia), che cosa fare. I
titoli ricevono le lettere in ordine casuale; la risposta è la sequenza delle lettere, per esempio "B, C, D, A".
Distrattori: la chiusura per prima, i due punti dello sviluppo scambiati, l'ordine al contrario, il titolo dopo il
problema.

Esempio: "Meno plastica in 1B", "Quante bottigliette buttavamo a ottobre", "Che cosa è cambiato con le borracce",
"Che cosa chiediamo alla scuola".

## Esercizi da evitare

- Al livello 2 tempi con mezzi minuti, e al livello 5 punti di durata non intera.
- Al livello 3 un titolo singolo con la "e", che sembrerebbe anche lui da dividere.
- Al livello 6 scalette in cui due ordini sono ugualmente difendibili: i ruoli devono leggersi dai titoli.

## Verifica

`powerpoint.py` rilegge ogni problema dal testo. Al livello 1 ha la tabella degli argomenti con le loro frasi di
scopo: ordina le quattro opzioni nei quattro tipi, pretende che ce ne sia una per tipo e che lo scopo sia
dell'argomento della storia. Al livello 2 rifà la divisione intera con frazioni esatte. Al livello 3 ha la tabella
dei titoli: la giusta è l'unica opzione fatta di due titoli della scaletta uniti da "e", e nessun titolo compare due
volte. Al livello 4 classifica la slide con parole chiave. Al livello 5 rifà il conto. Al livello 6 ritrova la
scaletta nella sua tabella e ne ricava l'ordine delle lettere. Poi opzioni, soluzione, `params.case` e quote dei casi.

## Domande per la revisione

- Livello 6: i ruoli dei quattro titoli si capiscono dal testo? In particolare il titolo della presentazione non è
  marcato in nessun modo.
- Livello 2: i minuti per slide sono un dato dell'esercizio, perché la regola della lezione ("da uno a due minuti") è
  un intervallo. Va bene, o si preferisce un valore fisso?
