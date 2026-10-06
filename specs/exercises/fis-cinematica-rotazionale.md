# Velocità angolare e accelerazione angolare

Generatore: `fis-cinematica-rotazionale` (`src/lib/exercises/v2/generators/fis-cinematica-rotazionale.ts`, con
`src/lib/exercises/v2/fis-rotazioni.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_cinematica_rotazionale.py` (con `_fis_rotazioni.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/86-fis-cinematica-rotazionale.md`. Percorso nel database:
`high_school/physics/fis-momento-angolare/fis-cinematica-rotazionale`.

Sette livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Accelerazione angolare media
2. Dai giri al minuto
3. Velocità angolare nel tempo
4. Angolo descritto
5. Numero di giri
6. Senza il tempo
7. Accelerazione tangenziale e centripeta

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($\text{rad/s}^2$, $\text{rad/s}$, $\text{rad}$, $\text{s}$, giri,
$\text{m/s}^2$). Dati con due cifre significative senza zeri ambigui; i giri al minuto di un motore sono numeri esatti.
Risultati a due cifre significative, minori di $100$ e mai vicini a un confine di arrotondamento.

## Regole comuni

- Formule della lezione: $\alpha_m = (\omega - \omega_0)/\Delta t$; $\omega = 2\pi n/60\,\text{s}$ per $n$ giri al
  minuto; $\omega = \omega_0 + \alpha\,t$; $\theta = \omega_0 t + \frac{1}{2}\alpha t^2$; $N = \theta/2\pi$;
  $\omega^2 = \omega_0^2 + 2\alpha\,\Delta\theta$; $a_t = \alpha\,r$; $a_c = \omega^2 r$.
- Le risposte sono moduli: dove la rotazione rallenta la consegna chiede il modulo, e il segno è spiegato nei passaggi.
- Niente scene: i problemi non hanno una geometria che cambi con i dati.

## Livello 1: accelerazione angolare media

Metà: un disco, una ruota, una puleggia o un volano parte da fermo e in $1{,}1$-$20\,\text{s}$ raggiunge
$1{,}1$-$40\,\text{rad/s}$. Metà: la velocità angolare passa da un valore a un altro (tutti e due tra $1{,}1$ e
$40\,\text{rad/s}$, diversi di almeno il $20\%$ del più grande e con il più piccolo almeno un quarto del più grande, perché i
distrattori non si accalchino sulla risposta; in aumento o in diminuzione) e si chiede il modulo.
Risultato di almeno $0{,}1\,\text{rad/s}^2$.

- "Un volano parte da fermo e in $4{,}0\,\text{s}$ raggiunge la velocità angolare di $18\,\text{rad/s}$. Quanto vale la
  sua accelerazione angolare media?" Risposta $4{,}5\,\text{rad/s}^2$; distrattori $\omega\,\Delta t$, $\Delta t/\omega$,
  $\omega/\Delta t^2$.
- "La velocità angolare di un disco passa da $8{,}3\,\text{rad/s}$ a $3{,}8\,\text{rad/s}$ in $7{,}5\,\text{s}$. Quanto
  vale, in modulo, la sua accelerazione angolare media?" Risposta $0{,}60\,\text{rad/s}^2$; distrattori la somma delle
  velocità divisa per il tempo, $\omega/\Delta t$, la differenza per il tempo.

## Livello 2: dai giri al minuto

Il cestello di una lavatrice, il disco di una smerigliatrice, la punta di un trapano o le lame di un frullatore partono
da fermi e raggiungono $120$, $180$, $240$, $300$, $450$, $600$, $900$ o $1200$ giri al minuto in $2{,}0$-$20\,\text{s}$.

- "La punta di un trapano parte da ferma e raggiunge i $900$ giri al minuto in $3{,}9\,\text{s}$. Quanto vale la sua
  accelerazione angolare media?" Risposta $24\,\text{rad/s}^2$; distrattori $n/\Delta t$ (giri al minuto non
  convertiti), $(n/60)/\Delta t$ (il $2\pi$ dimenticato), $2\pi n/\Delta t$ (i minuti non convertiti).
- "Il cestello di una lavatrice parte da fermo e raggiunge i $1200$ giri al minuto in $8{,}0\,\text{s}$." Risposta
  $16\,\text{rad/s}^2$ (esempio 1 della lezione).

## Livello 3: velocità angolare nel tempo

Metà: una ruota gira a $\omega_0$ ($1{,}1$-$40\,\text{rad/s}$) e accelera con $\alpha$ ($0{,}50$-$9{,}9\,\text{rad/s}^2$)
per $1{,}1$-$9{,}9\,\text{s}$; si chiede $\omega$. Metà: le pale di un ventilatore girano a $\omega_0$ e rallentano con
accelerazione angolare di modulo $\alpha$; si chiede dopo quanto tempo si fermano (almeno $0{,}5\,\text{s}$).

- "Una ruota gira a $11\,\text{rad/s}$ e accelera, con accelerazione angolare costante di $0{,}80\,\text{rad/s}^2$, per
  $6{,}6\,\text{s}$. Quale velocità angolare raggiunge?" Risposta $16\,\text{rad/s}$; distrattori $\alpha t$ (la
  velocità iniziale dimenticata), $\omega_0 + \alpha$, $\omega_0 + \frac{1}{2}\alpha t^2$.
- "Le pale di un ventilatore girano a $12\,\text{rad/s}$. Spento il motore, rallentano con accelerazione angolare
  costante di modulo $2{,}0\,\text{rad/s}^2$. Dopo quanto tempo si fermano?" Risposta $6{,}0\,\text{s}$; distrattori
  $\alpha/\omega_0$, $\omega_0\,\alpha$, $2\omega_0/\alpha$.

## Livello 4: angolo descritto

Metà: un disco parte da fermo con $\alpha$ e si chiede l'angolo dopo $t$. Metà: una ruota gira a $\omega_0$
($1{,}1$-$20\,\text{rad/s}$) e accelera. Risposta in radianti.

- "Un disco parte da fermo con accelerazione angolare costante di $2{,}0\,\text{rad/s}^2$. Di quale angolo ruota in
  $3{,}0\,\text{s}$?" Risposta $9{,}0\,\text{rad}$; distrattori $\alpha t^2$ (il mezzo dimenticato), $\alpha t$,
  $\frac{1}{2}\alpha t$.
- "Una ruota gira a $7{,}2\,\text{rad/s}$ e accelera, con accelerazione angolare costante di $6{,}8\,\text{rad/s}^2$,
  per $3{,}0\,\text{s}$. Di quale angolo ruota in questo tempo?" Risposta $52\,\text{rad}$; distrattori $\omega_0 t$,
  $\omega_0 t + \alpha t^2$, $\frac{1}{2}\alpha t^2$.

## Livello 5: numero di giri

Metà: le pale di un ventilatore girano a $5{,}0$-$60\,\text{rad/s}$ e si fermano in $2{,}0$-$20\,\text{s}$ con
accelerazione angolare costante (esempio 2 della lezione). Metà: una mola parte da ferma con $\alpha$ e si chiedono i
giri nei primi $t$ secondi. Almeno un giro.

- "Le pale di un ventilatore girano a $12\,\text{rad/s}$. Spento il motore, rallentano con accelerazione angolare
  costante e si fermano in $6{,}0\,\text{s}$. Quanti giri fanno prima di fermarsi?" Risposta $5{,}7$ giri; distrattori
  i radianti presi per giri ($36$), $\omega_0 t/2\pi$ (il rallentamento dimenticato), $\theta/\pi$.
- "Una mola parte da ferma con accelerazione angolare costante di $0{,}80\,\text{rad/s}^2$. Quanti giri fa nei primi
  $8{,}8\,\text{s}$?" Risposta $4{,}9$ giri; distrattori i radianti ($31$), $\alpha t^2/2\pi$, $\theta/\pi$.

## Livello 6: senza il tempo

Un volano parte da fermo con $\alpha$. Metà: di quale angolo ha ruotato quando la velocità angolare è $\omega$
($2{,}0$-$40\,\text{rad/s}$; almeno $1\,\text{rad}$). Metà: quale velocità angolare ha dopo aver ruotato di
$\Delta\theta$ ($2{,}0$-$60\,\text{rad}$).

- "Un volano parte da fermo con accelerazione angolare costante di $2{,}0\,\text{rad/s}^2$. Di quale angolo ha ruotato
  quando la sua velocità angolare è $12\,\text{rad/s}$?" Risposta $36\,\text{rad}$; distrattori $\omega^2/\alpha$,
  $\omega/2\alpha$, $\omega/\alpha$ (il tempo).
- "... Quale velocità angolare ha dopo aver ruotato di $13\,\text{rad}$?" con $\alpha = 0{,}50\,\text{rad/s}^2$:
  risposta $3{,}6\,\text{rad/s}$; distrattori $2\alpha\,\Delta\theta$ (la radice dimenticata), $\sqrt{\alpha\,\Delta\theta}$,
  $\alpha\,\Delta\theta$.

## Livello 7: accelerazione tangenziale e centripeta

Un punto di un disco a $11$-$99\,\text{cm}$ dall'asse, da convertire in metri. Metà: $a_t = \alpha\,r$ con $\alpha$ tra
$0{,}50$ e $20\,\text{rad/s}^2$. Metà: $a_c = \omega^2 r$ con $\omega$ tra $1{,}1$ e $20\,\text{rad/s}$. Risultato di
almeno $0{,}1\,\text{m/s}^2$.

- "Un disco ruota con accelerazione angolare di $3{,}0\,\text{rad/s}^2$. Quanto vale l'accelerazione tangenziale di un
  punto a $41\,\text{cm}$ dall'asse?" Risposta $1{,}2\,\text{m/s}^2$; distrattori i centimetri non convertiti,
  $\alpha/r$, $\alpha^2 r$.
- "In un certo istante un disco gira con velocità angolare $3{,}2\,\text{rad/s}$. Quanto vale l'accelerazione
  centripeta di un punto a $79\,\text{cm}$ dall'asse?" Risposta $8{,}1\,\text{m/s}^2$; distrattori $\omega r$ (la
  velocità), $\omega^2/r$, i centimetri non convertiti.

## Esercizi da evitare

- Giostre o ruote a centinaia di radianti al secondo: gli intervalli sono quelli detti.
- Due velocità angolari quasi uguali nel livello 1.
- Risultati di tre cifre o con uno zero ambiguo ($120\,\text{rad}$): si scartano.

## Verifica

`fis_cinematica_rotazionale.py` rilegge il testo, controlla cifre significative e intervalli, ricalcola con SymPy
esatto ($\pi$ simbolico, radice esatta), arrotonda a due cifre e confronta la risposta e la forma delle opzioni.

## Domande per la revisione

- L'accelerazione totale $\sqrt{a_t^2 + a_c^2}$ (esempio 4 della lezione) non ha un livello: va aggiunta come ottavo
  livello, o in un livello solo con le due componenti?
- Il livello 6 parte sempre da fermo: serve anche il caso con $\omega_0 \ne 0$ e i giri, come nell'esempio 3?
