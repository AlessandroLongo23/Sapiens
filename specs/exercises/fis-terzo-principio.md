# Il terzo principio della dinamica

Generatore: `fis-terzo-principio` (`src/lib/exercises/v2/generators/fis-terzo-principio.ts`, con
`src/lib/exercises/v2/fis-dinamica.ts`, `fisica-equilibrio.ts`, `vettori.ts` e `raggi-specchi.ts`). Verifica
indipendente: `scripts/exercises/checkers/fis_terzo_principio.py` (con `_dinamica.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/52-fis-terzo-principio.md`. Percorso nel database:
`high_school/physics/dinamica/fis-terzo-principio`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Azione e reazione
2. Stessa forza, accelerazioni diverse
3. Dall'accelerazione di uno a quella dell'altro
4. L'accelerazione della Terra
5. Il razzo

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni. Al livello 1 le opzioni sono forze descritte a parole ("il libro attira la Terra"); negli
altri livelli accelerazioni con l'unità ($0{,}92\,\text{m/s}^2$), al livello 4 in notazione scientifica
($5{,}9 \cdot 10^{-24}\,\text{m/s}^2$). Dati con due cifre significative (masse delle persone da $40$ a $99\,\text{kg}$, forze
da $1{,}1$ a $9{,}9$ o da $11$ a $99\,\text{N}$, accelerazioni da $1{,}1$ a $9{,}9\,\text{m/s}^2$, masse dei razzi da $0{,}11$ a
$0{,}99\,\text{kg}$), $g = 9{,}8\,\text{m/s}^2$, massa della Terra $5{,}97 \cdot 10^{24}\,\text{kg}$ (quella della lezione).
Risultati a due cifre significative, mai a meno di $10^{-6}$ da un confine di arrotondamento, mai un intero di due cifre
che finisce con zero.

## Livello 1: azione e reazione

Sette situazioni della lezione, ciascuna con una forza data: il libro sul tavolo (il peso, oppure la reazione del
tavolo), camminare, il razzo, la lampada appesa, il martello sul chiodo, il nuotatore. Si chiede quale forza forma con
quella una coppia di azione e reazione; le quattro opzioni sono fisse per ogni situazione, in ordine casuale, e i
distrattori sono gli errori della lezione: la forza uguale e opposta sullo stesso corpo (la reazione del tavolo per il
peso), la forza con il verso sbagliato, il peso per ogni cosa, una forza su un terzo corpo.

- "Un libro è fermo su un tavolo. Quale forza forma una coppia di azione e reazione con il peso del libro, cioè la
  Terra che attira il libro?" Risposta: il libro attira la Terra; distrattori: il tavolo spinge il libro, il libro preme
  sul tavolo, la Terra attira il tavolo.
- "Un razzo decolla. Quale forza forma una coppia di azione e reazione con la forza con cui il razzo spinge i gas di
  scarico verso il basso?" Risposta: i gas spingono il razzo in su; distrattori: la Terra attira il razzo, l'aria spinge
  il razzo in su, i gas spingono il razzo in giù.

Il livello ha pochi esercizi diversi (7 situazioni per 24 ordini delle opzioni).

## Livello 2: stessa forza, accelerazioni diverse

Due pattinatori che si spingono, o due canoe tirate una verso l'altra da una fune (metà ciascuno); masse diverse di
almeno $10\,\text{kg}$. Si chiede l'accelerazione di uno dei due, a caso: $a = F/m$.

- "Due pattinatori, di $63\,\text{kg}$ e $86\,\text{kg}$, sono fermi sul ghiaccio e si spingono con una forza di
  $58\,\text{N}$. Quanto vale l'accelerazione del pattinatore di $63\,\text{kg}$?" Risposta $0{,}92\,\text{m/s}^2$;
  distrattori $0{,}67\,\text{m/s}^2$ (l'accelerazione dell'altro), $0{,}39\,\text{m/s}^2$ (la forza divisa per le due
  masse insieme), $1{,}1\,\text{m/s}^2$.

## Livello 3: dall'accelerazione di uno a quella dell'altro

Due pattinatori; è data l'accelerazione del primo. La forza è $m_A\,a_A$, e agisce uguale sull'altro:
$a_B = a_A\,m_A/m_B$.

- "Due pattinatori, di $62\,\text{kg}$ e $94\,\text{kg}$, sono fermi sul ghiaccio e si spingono. Il pattinatore di
  $62\,\text{kg}$ ha un'accelerazione di $2{,}4\,\text{m/s}^2$. Quanto vale l'accelerazione dell'altro?" Risposta
  $1{,}6\,\text{m/s}^2$; distrattori $2{,}4\,\text{m/s}^2$ (la stessa accelerazione), $3{,}6\,\text{m/s}^2$ (il rapporto
  delle masse rovesciato), $1{,}9\,\text{m/s}^2$.

## Livello 4: l'accelerazione della Terra

Un sasso, un vaso o uno zaino da $1{,}1$ a $9{,}9\,\text{kg}$ cade; la Terra è attirata con il suo peso, e
$a_T = m\,g / M_T$.

- "Un sasso di $3{,}6\,\text{kg}$ cade dall'alto. Quanto vale l'accelerazione che il sasso dà alla Terra? La massa della
  Terra è $5{,}97 \cdot 10^{24}\,\text{kg}$." Risposta $5{,}9 \cdot 10^{-24}\,\text{m/s}^2$; distrattori $9{,}8\,\text{m/s}^2$
  (la stessa accelerazione del sasso), $6{,}0 \cdot 10^{-25}\,\text{m/s}^2$ ($m/M_T$, senza $g$), $5{,}9 \cdot
  10^{-23}\,\text{m/s}^2$ (l'esponente sbagliato di uno).

## Livello 5: il razzo

Un razzo modello spinto verso l'alto dai gas, con una spinta tra $1{,}3$ e $4$ volte il peso: $a = (F - m\,g)/m$.

- "Un razzo modello di $0{,}36\,\text{kg}$ parte verticalmente; i gas di scarico lo spingono verso l'alto con una forza di
  $6{,}2\,\text{N}$. Quanto vale la sua accelerazione alla partenza?" Risposta $7{,}4\,\text{m/s}^2$; distrattori
  $17\,\text{m/s}^2$ (il peso dimenticato), $27\,\text{m/s}^2$ (il peso sommato), $16\,\text{m/s}^2$ (la massa al posto
  del peso).

## Esercizi da evitare

- Masse quasi uguali ai livelli 2 e 3, dove le accelerazioni sarebbero quasi le stesse.
- Una spinta del razzo appena più grande del peso (accelerazioni minuscole) o enorme.

## Verifica

`fis_terzo_principio.py` ha la sua tabella delle sette situazioni, scritta dalla lezione, e controlla che la risposta
sia la reazione giusta e che le opzioni siano le quattro della situazione; negli altri livelli rilegge il testo,
controlla cifre significative e intervalli, calcola con SymPy e confronta la risposta e le opzioni. Al livello 2
controlla anche che tra le opzioni ci sia l'accelerazione dell'altro corpo, l'errore tipico, che dipende dall'altra
massa.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 1.000 esercizi per livello ciascuno, PASS, quote dei casi dentro
gli intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 248 px su 252, le frasi del livello 1).

### Esercizi diversi su 1.000

Seed da 1: livello 1 7, livello 2 1000, livello 3 996, livello 4 241, livello 5 839.

### Errori piantati

Bocciati tutti (200 su 200): indice dell'opzione giusta, un numero del testo cambiato, il testo dell'opzione giusta,
un'opzione doppia, parole vietate. Senza il controllo sull'accelerazione dell'altro corpo, al livello 2 passavano 4
esercizi su 200 con la massa non richiesta cambiata.

## Domande per la revisione

- Le frasi del livello 1 ("il suolo spinge il piede in avanti") sono abbastanza chiare, o servono i nomi delle forze?
- Il livello 5 (il razzo) usa anche il secondo principio: va bene qui, o è delle applicazioni?
