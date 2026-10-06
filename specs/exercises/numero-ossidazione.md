# Valenza e numero di ossidazione

Generatore: `numero-ossidazione` (`src/lib/exercises/v2/generators/numero-ossidazione.ts`, con
`src/lib/exercises/v2/chim3-i.ts`). Verifica indipendente: `scripts/exercises/checkers/numero_ossidazione.py`, con
`scripts/exercises/checkers/_chim3_i.py`. Lezione collegata: `docs/lezioni/chimica/riscritte/76-numero-ossidazione.md`.
Percorso nel database: `high_school/chemistry/chim-nomenclatura/numero-ossidazione`.

Sei livelli, ognuno con una difficoltà in più, nell'ordine della lezione. Nei livelli da 1 a 5 la risposta è un numero
intero con il segno (`number`, con la scelta multipla ricavata da `toChoice`); il livello 6 è a scelta multipla tra
formule.

## Nomi dei livelli

1. Elementi liberi e ioni di un solo atomo
2. Composti di due elementi
3. Composti di tre elementi
4. Ioni poliatomici
5. Idruri, perossidi e altri casi
6. Dai numeri di ossidazione alla formula

## Regole

Le otto regole della lezione, in ordine di precedenza: (1) elemento non combinato $0$; (2) ione di un solo atomo, la
carica; (3) la somma è $0$, o la carica dello ione; (4) fluoro $-1$; (5) litio, sodio, potassio e argento $+1$,
magnesio, calcio, bario e zinco $+2$, alluminio $+3$; (6) idrogeno $+1$; (7) ossigeno $-2$; (8) cloro, bromo e iodio
$-1$. Ogni elemento prende il valore della sua regola, tranne quello la cui regola viene per ultima (o che non ne ha):
quello si ricava dalla somma. Così $\mathrm{NaH}$ dà idrogeno $-1$, $\mathrm{H_2O_2}$ ossigeno $-1$, $\mathrm{OF_2}$
ossigeno $+2$.

Vincoli comuni: in ogni specie al massimo un elemento non ha una regola; il numero cercato è intero e sta tra $-4$ e
$+7$; quattro opzioni diverse, scritte con il segno ($+6$, $-2$, $0$).

## Livello 1: elementi liberi e ioni di un solo atomo

Metà: un elemento non combinato, come si scrive ($\mathrm{Na}$, $\mathrm{Fe}$, $\mathrm{O_2}$, $\mathrm{Cl_2}$,
$\mathrm{S_8}$, $\mathrm{P_4}$): risposta $0$. Distrattori: il numero che l'elemento ha di solito nei composti, il suo
opposto, l'indice. Metà: uno ione di un solo atomo ($\mathrm{Na^+}$, $\mathrm{Fe^{3+}}$, $\mathrm{S^{2-}}$): la risposta
è la carica. Distrattori: $0$, il segno cambiato, una carica in più.

- "Qual è il numero di ossidazione dell'ossigeno in $\mathrm{O_2}$?" Risposta $0$; distrattori $-2$, $+2$, $-3$.
- "Qual è il numero di ossidazione del ferro in $\mathrm{Fe^{3+}}$?" Risposta $+3$; distrattori $0$, $-3$, $+4$.

## Livello 2: composti di due elementi

Un composto binario neutro: ossidi di metalli e di non metalli, composti con l'idrogeno ($\mathrm{NH_3}$,
$\mathrm{CH_4}$, $\mathrm{H_2S}$), cloruri, solfuri e nitruri di metalli, $\mathrm{SF_6}$. Si chiede l'elemento che si
ricava dalla somma. Distrattori: il totale non diviso per il numero di atomi ($+10$ per $\mathrm{N_2O_5}$), l'indice
dell'altro elemento dimenticato, il segno cambiato, due in più o in meno.

- "Qual è il numero di ossidazione dello zolfo in $\mathrm{SO_3}$?" Risposta $+6$.
- "Qual è il numero di ossidazione dell'azoto in $\mathrm{N_2O_5}$?" Risposta $+5$; distrattori $+10$, $-5$, $+1$.

## Livello 3: composti di tre elementi

Un composto ternario neutro: ossiacidi, sali di sodio, potassio, calcio, magnesio, bario e alluminio, idrossidi di
metalli con più numeri di ossidazione, formule con le parentesi ($\mathrm{Al_2(SO_4)_3}$, $\mathrm{Ca_3(PO_4)_2}$).

- "Qual è il numero di ossidazione dello zolfo in $\mathrm{H_2SO_4}$?" Risposta $+6$.
- "Qual è il numero di ossidazione del cromo in $\mathrm{K_2Cr_2O_7}$?" Risposta $+6$; distrattori $+12$, $-6$, $+8$.

## Livello 4: ioni poliatomici

Uno ione poliatomico: la somma è la carica. Distrattori: la somma posta uguale a zero ($+8$ per lo zolfo del solfato),
la carica con il segno cambiato, il totale non diviso.

- "Qual è il numero di ossidazione dello zolfo in $\mathrm{SO_4^{2-}}$?" Risposta $+6$; distrattori $+8$, $+10$, $0$.
- "Qual è il numero di ossidazione dell'azoto in $\mathrm{NH_4^{+}}$?" Risposta $-3$.

## Livello 5: idruri, perossidi e altri casi

Si chiede l'idrogeno o l'ossigeno in un composto neutro. Sei volte su dieci (tra il 50% e il 70%) è un'eccezione: un
idruro di un metallo ($\mathrm{NaH}$, $\mathrm{CaH_2}$, $\mathrm{AlH_3}$), un perossido ($\mathrm{H_2O_2}$,
$\mathrm{Na_2O_2}$, $\mathrm{BaO_2}$) o $\mathrm{OF_2}$; le altre volte un composto senza eccezioni ($\mathrm{H_2O}$,
$\mathrm{CaO}$, $\mathrm{HCl}$, $\mathrm{NH_3}$, $\mathrm{NaOH}$). Opzioni: per l'ossigeno tra $-2$, $-1$, $+2$, $0$,
$+1$; per l'idrogeno tra $+1$, $-1$, $0$, $-2$, $+2$.

- "Qual è il numero di ossidazione dell'idrogeno in $\mathrm{CaH_2}$?" Risposta $-1$.
- "Qual è il numero di ossidazione dell'ossigeno in $\mathrm{BaO}$?" Risposta $-2$.

## Livello 6: dai numeri di ossidazione alla formula

Due elementi con i loro numeri di ossidazione: un metallo con ossigeno, zolfo, cloro, bromo o fluoro, oppure un non
metallo con l'ossigeno. La formula è quella dell'incrocio, con gli indici ridotti e l'elemento positivo a sinistra.
Distrattori: la formula non ridotta ($\mathrm{Pb_2O_4}$), i numeri lasciati ciascuno sul proprio elemento
($\mathrm{Al_3O_2}$), gli indici scambiati, uno a uno.

- "Che formula ha il composto tra l'alluminio, con numero di ossidazione $+3$, e l'ossigeno, con numero di ossidazione
  $-2$?" Risposta $\mathrm{Al_2O_3}$; distrattori $\mathrm{Al_3O_2}$, $\mathrm{AlO}$, $\mathrm{Al_2O_4}$.
- "... tra il piombo, $+4$, e l'ossigeno, $-2$?" Risposta $\mathrm{PbO_2}$; distrattori $\mathrm{Pb_2O_4}$,
  $\mathrm{Pb_4O_2}$, $\mathrm{Pb_2O}$.

## Esercizi da evitare

- Specie in cui due elementi non hanno una regola ($\mathrm{FeSO_4}$, $\mathrm{CuSO_4}$): servirebbe conoscere lo ione.
- Numeri di ossidazione frazionari ($\mathrm{Fe_3O_4}$) o medi su atomi diversi ($\mathrm{S_2O_3^{2-}}$).
- Cloruri di non metalli ($\mathrm{PCl_5}$, $\mathrm{CCl_4}$): la regola 8 della lezione parla solo di idrogeno e
  metalli.
- Silano, fosfina e arsina: il segno dell'idrogeno lì è una convenzione (lezione 78).
- Nel livello 6, composti tra due non metalli diversi dall'ossigeno, e nitruri di metalli di transizione.

## Risposta aperta

I livelli da 1 a 5 hanno come risposta un numero intero: si possono dare a risposta aperta, corretti sul valore
(`V` in `open-answers.ts`). Da controllare che il correttore accetti il segno più davanti al numero ("+6").

## Verifica

`numero_ossidazione.py` legge la specie dal LaTeX della domanda (elementi, indici, parentesi, carica), ritrova i numeri
di ossidazione con le regole in ordine di precedenza e confronta quello chiesto con la risposta e con le quattro
opzioni; controlla il tipo di specie di ogni livello, che nei livelli 2-4 l'elemento chiesto sia quello che si ricava
dalla somma, e le quote dei casi dei livelli 1 e 5. Per il livello 6 incrocia i due numeri del testo, riduce gli
indici e controlla che ogni opzione sia una formula dei due elementi nell'ordine giusto.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 200 px su 252; il testo dei problemi è prosa e va a
capo da sé).

### Errori piantati

Su 60 esercizi per livello (seed da 300): risposta o indice dell'opzione giusta cambiati, opzione doppia, distrattore uguale
alla risposta, parole vietate, caso dichiarato cambiato, testo dell'opzione giusta cambiato bocciati 360 su 360; un
indice della formula o un numero del testo cambiato bocciato 262 su 262.
