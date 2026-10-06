# Gli idrossidi

Generatore: `chim-idrossidi` (`src/lib/exercises/v2/generators/chim-idrossidi.ts`, con
`src/lib/exercises/v2/chim3-i.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_idrossidi.py`, con
`scripts/exercises/checkers/_chim3_i.py`. Lezione collegata: `docs/lezioni/chimica/riscritte/79-chim-idrossidi.md`.
Percorso nel database: `high_school/chemistry/chim-nomenclatura/chim-idrossidi`.

Cinque livelli, ognuno con una difficoltà in più. Il livello 1 ha come risposta un numero intero con il segno
(`number`, con la scelta multipla da `toChoice`); gli altri sono a scelta multipla, quattro opzioni.

## Nomi dei livelli

1. Il numero di ossidazione del metallo
2. Dal metallo alla formula
3. Dalla formula al nome
4. Dal nome alla formula
5. Dall'ossido basico all'idrossido

## Dati e nomi

I metalli sono quelli della specifica `chim-ossidi.md`: con un solo numero di ossidazione litio, sodio, potassio,
argento ($+1$), magnesio, calcio, bario, zinco ($+2$), alluminio ($+3$); con due ferro, rame, stagno, piombo, cobalto,
nichel, cromo, manganese e oro, con le stesse radici.

La formula è $\mathrm{M(OH)}_n$, con $n$ uguale al numero di ossidazione del metallo; le parentesi si mettono da due
gruppi in su. I tre nomi:

- tradizionale: "idrossido di" e il metallo, oppure "idrossido" con -oso e -ico;
- Stock: "idrossido di", il metallo e il numero romano, solo se il metallo ha più di un numero di ossidazione;
- IUPAC: idrossido, diidrossido, triidrossido, tetraidrossido "di" e il metallo.

Vincolo comune dei livelli sui nomi: nessuna opzione sbagliata è un nome giusto dello stesso composto in un'altra
nomenclatura, e non si chiede una nomenclatura il cui nome coincide con quello tradizionale.

## Livello 1: il numero di ossidazione del metallo

La formula di un idrossido; si chiede il numero di ossidazione del metallo, che è il numero dei gruppi
$\mathrm{OH}$. Distrattori: $+1$ (l'indice del metallo), il segno cambiato, uno in più, il doppio (ossigeno e
idrogeno contati tutti e due).

- "Qual è il numero di ossidazione del ferro in $\mathrm{Fe(OH)_3}$?" Risposta $+3$; distrattori $+1$, $-3$, $+4$.
- "Qual è il numero di ossidazione del sodio in $\mathrm{NaOH}$?" Risposta $+1$.

## Livello 2: dal metallo alla formula

Il metallo e il suo numero di ossidazione; si sceglie la formula. Distrattori: la formula senza parentesi
($\mathrm{CaOH_2}$), l'indice sul metallo ($\mathrm{Ca_2OH}$), un gruppo in più o in meno, l'idrossido con l'altro
numero di ossidazione, le parentesi dove non servono.

- "In un idrossido il calcio ha numero di ossidazione $+2$. Qual è la formula dell'idrossido?" Risposta
  $\mathrm{Ca(OH)_2}$; distrattori $\mathrm{CaOH_2}$, $\mathrm{Ca_2OH}$, $\mathrm{Ca(OH)_3}$.
- "In un idrossido il rame ha numero di ossidazione $+1$..." Risposta $\mathrm{CuOH}$; distrattori $\mathrm{Cu(OH)_2}$,
  $\mathrm{Cu_2OH}$, $\mathrm{CuOH_2}$.

## Livello 3: dalla formula al nome

Distrattori: tradizionale, il suffisso scambiato, "ossido" e "idruro" con lo stesso aggettivo, "perossido"; Stock,
l'altro numero di ossidazione e numeri vicini; IUPAC, il prefisso sul metallo, un gruppo in più o in meno, "ossido" e
"idruro" con lo stesso prefisso.

- "Qual è il nome tradizionale di $\mathrm{Cr(OH)_2}$?" Risposta: idrossido cromoso; distrattori idrossido cromico,
  ossido cromoso, idruro cromoso.
- "Qual è il nome IUPAC di $\mathrm{Al(OH)_3}$?" Risposta: triidrossido di alluminio.

## Livello 4: dal nome alla formula

- "Qual è la formula del composto che ha questo nome: idrossido di piombo(IV)?" Risposta $\mathrm{Pb(OH)_4}$;
  distrattori $\mathrm{Pb(OH)_2}$, $\mathrm{PbOH_4}$, $\mathrm{Pb_4OH}$.
- "... idrossido rameoso?" Risposta $\mathrm{CuOH}$.

## Livello 5: dall'ossido basico all'idrossido

Metà: la formula di un ossido basico; si sceglie la formula dell'idrossido in cui il metallo ha lo stesso numero di
ossidazione. Distrattori: gli indici dell'ossido portati nell'idrossido ($\mathrm{Fe_2(OH)_3}$, $\mathrm{Fe_2OH}$),
l'idrossido con l'altro numero di ossidazione. Metà: il nome tradizionale o di Stock dell'ossido; si sceglie il nome
dell'idrossido nella stessa nomenclatura.

- "Quale idrossido corrisponde all'ossido $\mathrm{Fe_2O_3}$?" Risposta $\mathrm{Fe(OH)_3}$; distrattori
  $\mathrm{Fe_2(OH)_3}$, $\mathrm{Fe_2OH}$, $\mathrm{Fe(OH)_2}$.
- "Quale idrossido corrisponde all'ossido rameoso?" Risposta: idrossido rameoso; distrattori idrossido rameico, ossido
  rameoso, idruro rameoso.

## Esercizi da evitare

- Distrattori che sono un altro nome giusto del composto ("diidrossido di calcio" tra le opzioni sul nome tradizionale
  di $\mathrm{Ca(OH)_2}$).
- Il nome IUPAC quando coincide con il tradizionale ($\mathrm{NaOH}$).
- Nel livello 5, l'ossido dato con il nome IUPAC: i prefissi contano gli atomi e non dicono il numero di ossidazione.
- L'idrossido di ammonio e gli idrossidi di non metalli.

## Risposta aperta

Il livello 1 ha come risposta un numero intero: si può dare a risposta aperta, corretto sul valore.

## Verifica

`chim_idrossidi.py` ritrova il numero di ossidazione del metallo dalla somma, con ossigeno a $-2$ e idrogeno a $+1$,
e controlla che sia il numero dei gruppi; ricostruisce formula e nomi dalle tabelle di `_chim3_i.py`; per il livello 5
ricava il numero di ossidazione dall'ossido (dalla formula o dal nome) e cerca l'idrossido con lo stesso numero.
Controlla che nessuna opzione sbagliata sia un altro nome giusto, che nessuna formula sbagliata abbia gli stessi atomi
di quella giusta e le quote dei casi del livello 5.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 200 px su 252; il testo dei problemi è prosa e va a
capo da sé).

### Errori piantati

Su 60 esercizi per livello (seed da 300): risposta o indice dell'opzione giusta, opzione doppia, distrattore uguale alla
risposta, parole vietate, caso dichiarato, testo dell'opzione giusta bocciati 300 su 300; un altro nome giusto tra i
distrattori 47 su 47; un indice della formula o un numero del testo cambiato 78 su 78.
