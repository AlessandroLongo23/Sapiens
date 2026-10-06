# Le trasformazioni di Galileo e la composizione delle velocità

Generatore: `fis-trasformazioni-galileo` (`src/lib/exercises/v2/generators/fis-trasformazioni-galileo.ts`, con
`src/lib/exercises/v2/fis-riferimenti.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_trasformazioni_galileo.py`.
Lezione collegata: `docs/lezioni/fisica/riscritte/73-fis-trasformazioni-galileo.md`. Percorso nel database:
`high_school/physics/fis-relativita-galileiana/fis-trasformazioni-galileo`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Da un sistema all'altro: la posizione
2. La velocità di un veicolo vista da un altro
3. Raggiungersi e incontrarsi
4. La pioggia vista dall'auto
5. Velocità per componenti
6. La palla lanciata sul treno

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità. Ai livelli 1 e 2 dati e risultati sono interi ed esatti (somme e differenze),
senza zero finale. Dal livello 3 dati con due cifre significative, $g = 9{,}8\,\text{m/s}^2$, risultati a due cifre
(angoli al grado), mai vicini a un confine di arrotondamento e mai con uno zero finale ambiguo.

## Livello 1: da un sistema all'altro, la posizione

Treno a $11$-$35\,\text{m/s}$ lungo una banchina, origini coincidenti nell'istante zero, tempo intero da $2$ a $9\,\text{s}$
(scritto $4{,}0\,\text{s}$). Metà: passeggero a $11$-$99\,\text{m}$ dall'origine del treno, $x = x' + V\,t$. Metà: semaforo a
$151$-$399\,\text{m}$ dall'origine della banchina, $x' = x - V\,t$, con $x' \ge 5\,\text{m}$.

- "Un treno passa lungo una banchina a $25\,\text{m/s}$; le origini dei due sistemi di riferimento coincidono
  nell'istante zero. Un passeggero è seduto a $12\,\text{m}$ dall'origine del treno, verso la testa. A quale distanza
  dall'origine della banchina si trova dopo $4{,}0\,\text{s}$?" Risposta $112\,\text{m}$; distrattori $|x' - V\,t|$ (il segno
  sbagliato), $V\,t$, $x'$.
- "... Un semaforo si trova a $169\,\text{m}$ dall'origine della banchina, davanti al treno. A quale distanza dall'origine
  del treno si trova dopo $5{,}0\,\text{s}$?" con $V = 11\,\text{m/s}$: $114\,\text{m}$; distrattori $x + V\,t$, $V\,t$, $x$.

## Livello 2: la velocità di un veicolo vista da un altro

Auto a $21$-$39\,\text{m/s}$ e furgone più lento di almeno $2\,\text{m/s}$, sulla stessa strada, nello stesso verso o in
versi opposti (metà ciascuno): $v' = v - V$ con i segni.

- "Su una strada rettilinea un'auto viaggia a $24\,\text{m/s}$ e un furgone a $18\,\text{m/s}$, in versi opposti. Quanto
  vale, in modulo, la velocità dell'auto rispetto al furgone?" Risposta $42\,\text{m/s}$; distrattori $6\,\text{m/s}$,
  $24\,\text{m/s}$, $18\,\text{m/s}$.
- Nello stesso verso, $31$ e $26\,\text{m/s}$: $5\,\text{m/s}$; distrattore principale $57\,\text{m/s}$ (l'avviso "Velocità
  relativa: differenza, non somma").

## Livello 3: raggiungersi e incontrarsi

Stessi veicoli (furgone più lento di almeno $3\,\text{m/s}$) e una distanza di $11$-$99\,\text{m}$: $t = d/(v - V)$ per
raggiungere, $t = d/(v + V)$ per incontrarsi, almeno $1\,\text{s}$.

- "..., in versi opposti, uno verso l'altro; sono distanti $59\,\text{m}$. Dopo quanto tempo si incontrano?" con $24$ e
  $17\,\text{m/s}$: $1{,}4\,\text{s}$; distrattori $d/(v - V)$, $d/v$, $d/V$.
- "..., nello stesso verso; l'auto è $42\,\text{m}$ dietro il furgone. Dopo quanto tempo lo raggiunge?" con $32$ e
  $26\,\text{m/s}$: $7{,}0\,\text{s}$.

## Livello 4: la pioggia vista dall'auto

Pioggia verticale a $4{,}0$-$9{,}9\,\text{m/s}$, auto a $5{,}0$-$30\,\text{m/s}$. Metà $v' = \sqrt{v^2 + V^2}$, metà l'angolo con
la verticale, $\tan\beta = V/v$, tra $20^\circ$ e $85^\circ$. Scena `vettori-piano`: la velocità della pioggia verso il
basso e quella dell'auto in orizzontale, con i valori; la soluzione disegna $-\vec V$ dalla punta di $\vec v$ e la somma
$\vec v\,'$ in arancione.

- "Non c'è vento e la pioggia cade in verticale a $8{,}0\,\text{m/s}$. Un'auto viaggia su una strada orizzontale a
  $15\,\text{m/s}$. Con quale velocità chi è in auto vede cadere la pioggia?" Risposta $17\,\text{m/s}$; distrattori
  $23\,\text{m/s}$ (i moduli sommati), $7{,}0\,\text{m/s}$, $15\,\text{m/s}$.
- "... Di quale angolo, rispetto alla verticale, chi è in auto vede inclinata la pioggia?" Risposta $62^\circ$;
  distrattori il complementare ($28^\circ$) e il seno al posto della tangente ($32^\circ$).

## Livello 5: velocità per componenti

Traghetto verso est a $2{,}0$-$9{,}9\,\text{m/s}$; il radar vede un motoscafo con $v'_x$ tra $1{,}1$ e $9{,}9\,\text{m/s}$ in
modulo, positivo o negativo, e $v'_y$ tra $1{,}1$ e $9{,}9\,\text{m/s}$. $v_x = v'_x + V$, $v_y = v'_y$, poi il modulo;
$|v_x| \ge 0{,}45\,\text{m/s}$. Scena `vettori-piano`: $\vec V$ e $\vec v\,'$ uno dopo l'altro; la soluzione aggiunge la somma.

- "Il radar di un traghetto, che naviga verso est a $5{,}0\,\text{m/s}$, vede un motoscafo muoversi con velocità di
  componenti $v'_x = -3{,}0\,\text{m/s}$ e $v'_y = 4{,}0\,\text{m/s}$ (asse x verso est, asse y verso nord). Quanto vale la
  velocità del motoscafo rispetto al mare?" Risposta $4{,}5\,\text{m/s}$; distrattori $5{,}0\,\text{m/s}$ (il traghetto
  dimenticato), $8{,}9\,\text{m/s}$ (il segno di $V$), $6{,}0\,\text{m/s}$ (le componenti sommate), $10\,\text{m/s}$ scartato
  per lo zero ambiguo.
- Con $V = 7{,}7$, $v'_x = -1{,}4$, $v'_y = 5{,}1\,\text{m/s}$: $v_x = 6{,}3\,\text{m/s}$, $v = 8{,}1\,\text{m/s}$.

## Livello 6: la palla lanciata sul treno

Treno a $5{,}0$-$30\,\text{m/s}$, palla lanciata in verticale a $2{,}0$-$9{,}9\,\text{m/s}$ rispetto al treno e ripresa alla
stessa altezza: $t = 2v'_0/g$ e $\Delta x = V\,t$.

- "Su un treno che viaggia a $5{,}0\,\text{m/s}$ una ragazza lancia una palla verso l'alto, in verticale rispetto al
  treno, a $4{,}9\,\text{m/s}$, e la riprende alla stessa altezza. Di quanto avanza la palla rispetto alla banchina durante
  il volo?" Risposta $5{,}0\,\text{m}$; distrattori $2{,}5\,\text{m}$ (solo la salita), $4{,}9\,\text{m}$ ($2v_0'^2/g$),
  $1{,}2\,\text{m}$ (l'altezza massima).
- Con $V = 9{,}8$ e $v'_0 = 2{,}3\,\text{m/s}$: $4{,}6\,\text{m}$.

## Esercizi da evitare

- Risultati interi che finiscono con zero ai livelli 1 e 2; un semaforo già dietro il treno.
- Tempi sotto $1\,\text{s}$ al livello 3; angoli sotto $20^\circ$ al livello 4, dove la pioggia sembra quasi verticale.
- Al livello 5 una somma con $v_x$ quasi nulla.

## Verifica

`fis_trasformazioni_galileo.py` rilegge il testo, controlla intervalli e cifre dei dati, ricalcola con SymPy esatto,
confronta la risposta e la forma delle opzioni, e controlla le scene (i due vettori dei dati, la somma solo nella
soluzione).

## Senza esercizio

Non hanno un livello l'invarianza delle lunghezze (un conto di una riga) e l'incontro con l'auto sulla corsia opposta
dell'esempio 2 (è il caso "versi opposti" del livello 3).

## Domande per la revisione

- Ai livelli 1 e 2 i risultati hanno tre cifre o una sola ($114\,\text{m}$, $5\,\text{m/s}$), perché sono somme esatte di
  interi: va bene, o si preferiscono dati con un decimale?
- Al livello 5 $v'_y$ è sempre positiva: serve anche il caso negativo?
