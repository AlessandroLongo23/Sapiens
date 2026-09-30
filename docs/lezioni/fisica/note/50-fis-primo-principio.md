# Note: Il primo principio della dinamica e i sistemi inerziali

Lezione nuova (terzo lotto di fisica, gruppo 15, 30 settembre 2026). Conti rifatti in Python: $30 \cdot 9{,}8 = 294$ N,
$45/294 = 0{,}153$; $8{,}5 \cdot 9{,}8 = 83{,}3$ N; $30\cos 40^\circ = 22{,}98$ N, $30\sin 40^\circ = 19{,}28$ N;
$\sqrt{48^2 + 36^2} = 60$ N, $\tan^{-1}(36/48) = 36{,}9^\circ$; nella figura della cassa le frecce sono $48/25 = 1{,}92$,
$36/25 = 1{,}44$ e $60/25 = 2{,}4$ cm. Nella figura interattiva $h = 1{,}6$ m, $\sqrt{2 g h} = 5{,}6$ m/s, e a $20^\circ$
la strada sul secondo piano è $1{,}6/\sin 20^\circ = 4{,}7$ m. `check.mts` passa.

## Struttura ed esempi

Perché i corpi si fermano (Aristotele e l'attrito; il piano inclinato doppio di Galileo, con figura TikZ e figura
interattiva), l'inerzia (la massa come misura; tovaglia, moneta, cintura), l'enunciato ($\vec F_{tot} = \vec 0$ se e solo
se $\vec v$ costante, anche come vettore; il rimando al moto circolare), l'avviso sulla "forza del moto", gli esempi 1
(slitta a velocità costante e $\mu_d$, lo stesso metodo della lezione sull'attrito), 2 (paracadute, con l'ascensore a
velocità costante), 3 (la maniglia inclinata: conta solo la componente orizzontale), 4 (due funi perpendicolari, con
figura), i sistemi inerziali (il pallone sull'autobus che frena, con figura; suolo inerziale con ottima
approssimazione; rimando alla lezione del terzo anno), l'avviso sulla frenata.

## Scelte

- Il primo principio si enuncia con la forza totale nulla e vale nei due versi, come chiede la nota della lezione 20
  ("Equilibrio e velocità costante") che rimanda qui.
- I sistemi inerziali restano al livello del secondo anno: la definizione, un esempio, il suolo come sistema
  inerziale, e niente forze apparenti, che sono della lezione "Sistemi di riferimento inerziali e non inerziali" del
  terzo anno (linkata).
- Il titolo della prima sezione non nomina Aristotele e Galileo solo perché il controllo segnala i nomi propri come
  "maiuscole all'inglese"; il testo li nomina.
- La pallina della figura interattiva scivola senza attrito (non rotola), con l'accelerazione $g\sin\theta$ lungo il
  piano: rotolando cambierebbero i tempi ma non l'altezza raggiunta.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `galileo-piano-doppio` (tre piani che arrivano alla stessa altezza, più il
piano orizzontale), `cassa-due-funi-attrito` (scala 1 cm per 25 N), `autobus-frena-pallone` (velocità in blu, accelerazione
dell'autobus in verde all'indietro). Interattiva `piano-doppio-galileo` (`fisica/PianoDoppioGalileo.tsx`): inclinazione del
secondo piano da $40^\circ$ a $0^\circ$, la pallina oscilla tra i due piani oppure, a $0^\circ$, esce dalla figura a velocità
costante; passo di integrazione scritto a mano, a velocità dimezzata.

## Esercizi

Generatore `fis-primo-principio`, quattro livelli (specifica in `specs/exercises/fis-primo-principio.md`), scene
`blocco-forze` e `punto-forze` già registrate.

## Domande per Andrea

- Il racconto del piano inclinato doppio: l'Amaldi lo attribuisce al "Dialogo" (1632) o ai "Discorsi" (1638)? Io li cito
  tutti e due; la collocazione precisa del passo (giornata seconda del Dialogo, giornata terza dei Discorsi) è da
  verificare.
- "Primo principio della dinamica" e "principio d'inerzia" come sinonimi: va bene, o l'Amaldi distingue (principio
  d'inerzia di Galileo, primo principio di Newton)?
- L'enunciato con "la forza totale" o con "la risultante delle forze"? La lezione 20 usa "risultante"; qui ho seguito le
  notazioni del secondo anno ($\vec F_{tot}$) e ho detto che è la stessa cosa.
- I sistemi inerziali al secondo anno: basta la definizione con l'esempio dell'autobus, o l'Amaldi del biennio fa anche
  la relatività galileiana?
- Nell'esempio 2 la forza dell'aria si chiama $R$ (resistenza): va bene, o si usa $\vec F_a$?
