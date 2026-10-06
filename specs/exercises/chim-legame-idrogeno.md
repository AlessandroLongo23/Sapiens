# Il legame a idrogeno

Generatore: `chim-legame-idrogeno` (`src/lib/exercises/v2/generators/chim-legame-idrogeno.ts`, con
`src/lib/exercises/v2/chim3-h.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_legame_idrogeno.py`.
Lezione collegata: `docs/lezioni/chimica/riscritte/73-chim-legame-idrogeno.md`.

Cinque livelli, ognuno con una difficoltà in più: riconoscere la sostanza, contare idrogeni e coppie solitarie,
ragionare su due molecole diverse, collegare il legame alla temperatura di ebollizione, contare i legami nel DNA.
Scelta multipla con quattro opzioni; i livelli 2 e 5 vanno anche a risposta aperta (un numero intero).

## Nomi dei livelli

1. Quale sostanza forma legami a idrogeno
2. Idrogeni che contano e coppie solitarie
3. Tra due molecole diverse
4. Chi bolle più in alto, e perché
5. I legami a idrogeno nel DNA

## Dati

La regola è quella della lezione, in due condizioni: fa da donatore una molecola con un idrogeno legato a
$\mathrm{F}$, $\mathrm{O}$ o $\mathrm{N}$; fa da accettore una molecola con un atomo di $\mathrm{F}$, $\mathrm{O}$ o
$\mathrm{N}$, che nelle molecole neutre ha tre, due o una coppia solitaria. Una sostanza forma legami a idrogeno tra le
sue molecole se soddisfa tutte e due le condizioni.

| Molecola | Idrogeni legati a F, O, N | Coppie solitarie su F, O, N | Tra le sue molecole |
|---|---|---|---|
| acqua, $\mathrm{H_2O}$ | $2$ | $2$ | sì |
| ammoniaca, $\mathrm{NH_3}$ | $3$ | $1$ | sì |
| fluoruro di idrogeno, $\mathrm{HF}$ | $1$ | $3$ | sì |
| metanolo, $\mathrm{CH_3OH}$ | $1$ | $2$ | sì |
| etanolo, $\mathrm{CH_3CH_2OH}$ | $1$ | $2$ | sì |
| metano, $\mathrm{CH_4}$ | $0$ | $0$ | no |
| solfuro di idrogeno, $\mathrm{H_2S}$ | $0$ | $0$ | no |
| etere dimetilico, $\mathrm{CH_3OCH_3}$ | $0$ | $2$ | no |
| acetone, $\mathrm{CH_3COCH_3}$ | $0$ | $2$ | no |
| cloruro di idrogeno $\mathrm{HCl}$, bromuro di idrogeno $\mathrm{HBr}$, fosfina $\mathrm{PH_3}$, silano $\mathrm{SiH_4}$, propano $\mathrm{C_3H_8}$ | $0$ | $0$ | no |

Temperature di ebollizione in gradi Celsius, dalla tabella dei quattro gruppi e dall'esempio 2 della lezione:
$\mathrm{H_2O}$ $100$, $\mathrm{H_2S}$ $-60$, $\mathrm{H_2Se}$ $-41$, $\mathrm{H_2Te}$ $-2$, $\mathrm{CH_4}$ $-162$,
$\mathrm{NH_3}$ $-33$, $\mathrm{PH_3}$ $-88$, $\mathrm{AsH_3}$ $-62$, $\mathrm{HF}$ $20$, $\mathrm{HCl}$ $-85$,
$\mathrm{HBr}$ $-67$, $\mathrm{HI}$ $-35$, etanolo $78$, etere dimetilico $-25$, propano $-42$.

DNA: una coppia adenina-timina ha $2$ legami a idrogeno, una coppia guanina-citosina ne ha $3$.

## Livello 1: quale sostanza forma legami a idrogeno

Quattro sostanze, ognuna con formula e nome. Sei volte su dieci una sola forma legami a idrogeno tra le sue molecole e
si chiede quale; quattro volte su dieci tre li formano e si chiede quale non li forma. Le sostanze che li formano sono
le prime cinque della tabella, le altre nove no. Nei passaggi: a quale atomo è legato l'idrogeno e quali coppie
solitarie ci sono.

- "Tra le molecole di quale di queste sostanze si formano legami a idrogeno?" Opzioni: $\mathrm{CH_4}$, metano;
  $\mathrm{CH_3OCH_3}$, etere dimetilico; $\mathrm{H_2S}$, solfuro di idrogeno; $\mathrm{H_2O}$, acqua. Risposta:
  l'acqua.
- "Tra le molecole di quale di queste sostanze non si formano legami a idrogeno?" Opzioni: $\mathrm{CH_3OH}$,
  metanolo; $\mathrm{HF}$, fluoruro di idrogeno; $\mathrm{CH_3OCH_3}$, etere dimetilico; $\mathrm{H_2O}$, acqua.
  Risposta: l'etere dimetilico (l'ossigeno ha due coppie solitarie, ma tutti gli idrogeni sono legati al carbonio).

Distrattori: le sostanze con idrogeno e ossigeno nella formula ma senza idrogeni legati all'ossigeno (l'errore del
riquadro "C'è idrogeno e c'è ossigeno, quindi ci sono legami a idrogeno") e i composti dell'idrogeno con zolfo, cloro,
bromo, fosforo, silicio, carbonio.

## Livello 2: idrogeni che contano e coppie solitarie

Le sette molecole della tabella della lezione, più etanolo e acetone. Metà delle volte si chiede quanti atomi di
idrogeno sono legati a $\mathrm{F}$, $\mathrm{O}$ o $\mathrm{N}$, metà quante coppie solitarie ci sono su quegli
atomi. Ogni domanda ha due forme: una che nomina i tre elementi, una che chiede quanti idrogeni possono formare un
legame a idrogeno con un'altra molecola, o quante coppie solitarie possono ricevere l'idrogeno di un'altra molecola.
La risposta $0$ è ammessa. Anche a risposta aperta.

- "Quanti atomi di idrogeno della molecola di metanolo, $\mathrm{CH_3OH}$, sono legati a un atomo di fluoro, ossigeno
  o azoto?" Risposta $1$; distrattori $4$ (tutti gli idrogeni), $2$ (le coppie solitarie), un altro numero vicino.
- "Nella molecola di solfuro di idrogeno, $\mathrm{H_2S}$, quante coppie solitarie possono ricevere l'idrogeno di
  un'altra molecola in un legame a idrogeno?" Risposta $0$; distrattori $2$ (le coppie dello zolfo), $1$, $3$.

Distrattori. Per gli idrogeni: tutti gli idrogeni della molecola, il numero delle coppie solitarie, il numero degli
atomi di $\mathrm{F}$, $\mathrm{O}$, $\mathrm{N}$. Per le coppie: le coppie contate anche sullo zolfo, il numero degli
idrogeni legati a $\mathrm{F}$, $\mathrm{O}$, $\mathrm{N}$, il doppio (gli elettroni delle coppie), il numero degli
atomi. Quando alcuni coincidono si completa con i numeri vicini.

## Livello 3: tra due molecole diverse

Due molecole diverse tra acqua, ammoniaca, fluoruro di idrogeno, metanolo (donatore e accettore), etere dimetilico,
acetone (solo accettore), metano, solfuro di idrogeno (né l'uno né l'altro). Si chiede in quale verso si può formare un
legame a idrogeno tra le due. Le quattro opzioni sono sempre le stesse: "In tutti e due i versi", "Solo con [la prima]
come donatore", "Solo con [la seconda] come donatore", "In nessuno dei due versi". Tre volte su dieci la risposta è
due versi, quattro un verso solo, tre nessuno.

- "Una molecola d'acqua, $\mathrm{H_2O}$, è vicina a una di etere dimetilico, $\mathrm{CH_3OCH_3}$. In quale verso si
  può formare un legame a idrogeno tra le due?" Risposta: "Solo con l'acqua come donatore".
- "Una molecola di metano, $\mathrm{CH_4}$, è vicina a una di ammoniaca, $\mathrm{NH_3}$. ..." Risposta: "In nessuno
  dei due versi".

## Livello 4: chi bolle più in alto, e perché

Due sostanze scritte con la formula, una che forma legami a idrogeno e una no, in ordine casuale e con due forme della
domanda. Le coppie: $\mathrm{H_2O}$ con $\mathrm{H_2S}$, $\mathrm{H_2Se}$, $\mathrm{H_2Te}$, $\mathrm{CH_4}$;
$\mathrm{NH_3}$ con $\mathrm{PH_3}$, $\mathrm{AsH_3}$, $\mathrm{CH_4}$; $\mathrm{HF}$ con $\mathrm{HCl}$,
$\mathrm{HBr}$, $\mathrm{HI}$; $\mathrm{CH_3CH_2OH}$ con $\mathrm{CH_3OCH_3}$ e $\mathrm{C_3H_8}$. Vincolo: quella con i
legami a idrogeno bolle almeno $20$ gradi più in alto. Ogni opzione è una sostanza con la sua ragione. I passaggi danno
le due temperature.

- "Quale delle due sostanze bolle a temperatura più alta, $\mathrm{HF}$ o $\mathrm{HBr}$, e perché?" Risposta:
  $\mathrm{HF}$ perché forma legami a idrogeno. Distrattori: $\mathrm{HBr}$ perché ha più elettroni; $\mathrm{HBr}$
  perché è più polare; $\mathrm{HF}$ perché i suoi legami covalenti sono più forti.
- "Tra $\mathrm{CH_3CH_2OH}$ e $\mathrm{C_3H_8}$, quale sostanza ha la temperatura di ebollizione più alta, e perché?"
  Risposta: $\mathrm{CH_3CH_2OH}$ perché forma legami a idrogeno. Qui le due molecole hanno gli stessi $26$ elettroni,
  e il primo distrattore diventa "Nessuna delle due: hanno gli stessi elettroni".

Distrattori: ragionare solo con le forze di London (più elettroni, o stessi elettroni e quindi stessa temperatura);
attribuire la differenza alla polarità; scambiare il legame a idrogeno con il legame covalente, l'errore del riquadro
"Il legame a idrogeno non è il legame covalente con l'idrogeno".

## Livello 5: i legami a idrogeno nel DNA

Metà delle volte il tratto è dato con i numeri: da $2$ a $15$ coppie adenina-timina e da $2$ a $15$ guanina-citosina,
con il totale. Metà con la sequenza delle basi di un filamento, da $4$ a $8$ basi: ogni A o T è una coppia A-T, ogni G
o C una coppia G-C. Vincoli: i due numeri di coppie sono diversi (altrimenti scambiare $2$ e $3$ darebbe lo stesso
risultato) e ci sono tutti e due i tipi di coppia. Anche a risposta aperta.

- "Un tratto di DNA è lungo $10$ coppie di basi: $6$ sono coppie adenina-timina e $4$ guanina-citosina. Quanti legami
  a idrogeno tengono uniti i due filamenti in quel tratto?" $6 \cdot 2 + 4 \cdot 3 = 24$.
- "Su un filamento di un tratto di DNA si leggono, in ordine, le basi $\mathrm{A\,C\,G\,T\,G\,G\,C}$. Ogni base è
  appaiata a una base dell'altro filamento. Quanti legami ..." $2 \cdot 2 + 5 \cdot 3 = 19$.

Distrattori: $2$ e $3$ scambiati (sempre presente), poi due tra $2$ legami per tutte le coppie, $3$ per tutte, il
numero delle coppie.

## Esercizi da evitare

- $\mathrm{NH_3}$ contro $\mathrm{SbH_3}$: la stibina bolle a $-17\,^\circ\text{C}$, più in alto dell'ammoniaca. In
  generale nessuna coppia in cui la sostanza senza legami a idrogeno bolle più in alto o quasi alla stessa
  temperatura (lo iodio contro l'acqua, della fine della lezione).
- Coppie del livello 4 con molecole di dimensioni molto diverse: la lezione avverte che lì il confronto va fatto con
  prudenza.
- Molecole che la lezione non usa (acqua ossigenata, ammine, acidi carbossilici), e ioni: le coppie solitarie "una,
  due, tre" valgono per le molecole neutre.
- Nel livello 3, domande su quanti legami forma una molecola o su quale dei due versi è più forte: la lezione non lo
  dice.
- Nel livello 5, tratti con lo stesso numero di coppie dei due tipi, e sequenze di sole A e T o di sole G e C.

## Verifica

`chim_legame_idrogeno.py` descrive ogni molecola con il suo scheletro (gli atomi diversi dall'idrogeno, ognuno con gli
idrogeni che porta), controlla all'avvio che lo scheletro abbia gli stessi atomi della formula, e ne ricava idrogeni
legati a F, O, N e coppie solitarie. Rilegge il testo del problema, riconosce nomi e formule con tabelle sue, ricalcola
la risposta e controlla che l'opzione giusta sia quella e sia una sola. Nei livelli 3 e 4 controlla anche che le
quattro opzioni siano quelle della specifica; nel livello 4 conta gli elettroni con `elementi.json`, controlla i 20
gradi di distanza e che i passaggi diano le due temperature; nei livelli 2 e 5 controlla la risposta aperta.

Quote dei casi: livello 1 "forma" tra 50 e 70%, "non-forma" tra 30 e 50%; livello 2 e livello 5 ognuno dei due casi
tra 40 e 60%; livello 3 due versi e nessun verso tra 22 e 38%, un verso tra 32 e 48%.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 214 px su 252).

### Errori piantati

Su 300 esercizi (60 per livello, seed da 300), 1.020 guasti: indice dell'opzione giusta spostato 300 su 300 bocciati;
testo dell'opzione giusta scambiato con un distrattore 300 su 300; un distrattore reso uguale alla risposta 300 su 300;
`answer.value` cambiato nei livelli 2 e 5 120 su 120.
