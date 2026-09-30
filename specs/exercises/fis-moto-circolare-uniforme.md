# Il moto circolare uniforme

Generatore: `fis-moto-circolare-uniforme` (`src/lib/exercises/v2/generators/fis-moto-circolare-uniforme.ts`, con
`src/lib/exercises/v2/fis-moti-piano.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_moto_circolare_uniforme.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/47-fis-moto-circolare-uniforme.md`. Percorso nel database:
`high_school/physics/fis-moti-piano/fis-moto-circolare-uniforme`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Periodo e frequenza
2. La velocità tangenziale
3. La velocità angolare
4. Velocità tangenziale e angolare
5. Due punti sulla stessa ruota

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($\text{s}$, $\text{Hz}$, $\text{m/s}$, $\text{rad/s}$). Dati con due cifre
significative senza zeri ambigui; i giri contati e i giri al minuto di una lavatrice sono numeri esatti. Risultati a due
cifre significative, mai vicini a un confine di arrotondamento.

## Regole comuni

- Formule della lezione: $f = 1/T$, giri al minuto divisi per $60$; $v = 2\pi r/T$; $\omega = 2\pi/T = 2\pi f$;
  $v = \omega\,r$; i punti di una ruota hanno la stessa $\omega$.
- Niente scene: la figura non aggiunge dati.

## Livello 1: periodo e frequenza

Metà: una ruota, un disco, una trottola o una giostra fa da $11$ a $99$ giri (non multipli di $10$) in un tempo da
$2{,}0$ a $99\,\text{s}$, e si chiede la frequenza (almeno $0{,}2\,\text{Hz}$). Metà: il cestello di una lavatrice fa
$400$, $600$, ..., $1600$ giri al minuto, e si chiede il periodo.

- "Una trottola fa $18$ giri in $5{,}7\,\text{s}$. Quanto vale la frequenza del suo moto?" Risposta $3{,}2\,\text{Hz}$;
  distrattori il periodo ($0{,}32$), $2\pi f$, giri per tempo.
- "Il cestello di una lavatrice in centrifuga fa $1200$ giri al minuto. Quanto dura un giro?" Risposta
  $0{,}050\,\text{s}$; distrattori la frequenza ($20$), $1/n$ (il minuto non convertito), $n/3600$.

## Livello 2: la velocità tangenziale

Un terzo ciascuno: una ruota panoramica (raggio $11$-$60\,\text{m}$, un giro in $2{,}0$-$20\,\text{min}$, da convertire in
secondi), una giostra (raggio $1{,}1$-$9{,}9\,\text{m}$, periodo $5{,}0$-$30\,\text{s}$), le pale di un ventilatore
(lunghe $11$-$60\,\text{cm}$, da convertire in metri, periodo $0{,}050$-$0{,}99\,\text{s}$). Velocità di almeno
$0{,}1\,\text{m/s}$.

- "Le pale di un ventilatore sono lunghe $26\,\text{cm}$ e fanno un giro in $0{,}29\,\text{s}$. Con quale velocità si
  muove la punta di una pala?" Risposta $5{,}6\,\text{m/s}$; distrattori $\pi r/T$, $r/T$, i centimetri non convertiti
  ($5{,}6 \cdot 100$, scartato quando supera $99$). Per la ruota panoramica il distrattore è il periodo lasciato in
  minuti, per la giostra $2\pi r\,T$.

## Livello 3: la velocità angolare

Metà dal periodo ($0{,}20$-$60\,\text{s}$), metà dalla frequenza ($0{,}11$-$15\,\text{Hz}$).

- "Un disco gira con la frequenza di $0{,}72\,\text{Hz}$. Quanto vale la sua velocità angolare?" Risposta
  $4{,}5\,\text{rad/s}$; distrattori la frequenza stessa, $2\pi/f$, $\pi f$.
- Dal periodo i distrattori sono $1/T$, $360/T$ (i gradi al secondo), $2\pi T$.

## Livello 4: velocità tangenziale e angolare

Metà: una ruota di raggio $0{,}11$-$2{,}0\,\text{m}$ fa da $11$ a $99$ giri al minuto; si chiede la velocità del bordo,
passando da $f = n/60$ e $\omega = 2\pi f$ (almeno $0{,}1\,\text{m/s}$). Metà: velocità e raggio, si chiede $\omega = v/r$.

- "Una ruota di raggio $0{,}34\,\text{m}$ fa $45$ giri al minuto. Con quale velocità si muove un punto del bordo?"
  Risposta $1{,}6\,\text{m/s}$; distrattori $n\,r$ (i giri al minuto per il raggio), $(n/60)\,r$ (il $2\pi$
  dimenticato), $2\pi n\,r$ (i minuti non convertiti).
- Per $\omega = v/r$ i distrattori sono $v\,r$, $r/v$, $v/(2\pi r)$ (la frequenza).

## Livello 5: due punti sulla stessa ruota

Anna e Bruno su una giostra, a distanze dal centro da $0{,}50$ a $5{,}0\,\text{m}$ che differiscono di almeno il $30\%$;
la velocità di Anna da $0{,}50$ a $9{,}9\,\text{m/s}$. Metà la velocità di Bruno ($v_A\,r_B/r_A$), metà il periodo della
giostra ($2\pi r_A/v_A$, e la distanza di Bruno è un dato in più).

- "Su una giostra che gira, Anna è seduta a $0{,}53\,\text{m}$ dal centro e va a $0{,}60\,\text{m/s}$; Bruno è seduto a
  $0{,}91\,\text{m}$ dal centro. Quanto dura un giro della giostra?" Risposta $5{,}6\,\text{s}$; distrattori $r/v$,
  $2\pi v/r$, il raggio di Bruno con la velocità di Anna.
- Per la velocità di Bruno i distrattori sono la stessa velocità di Anna, il rapporto dei raggi rovesciato,
  $v_A\,|r_B - r_A|$.

## Esercizi da evitare

- Lavatrici a $8000$ giri al minuto o ruote panoramiche a $12\,\text{m/s}$: i dati stanno negli intervalli detti.
- Due bambini quasi alla stessa distanza dal centro.

## Verifica

`fis_moto_circolare_uniforme.py` rilegge il testo, controlla cifre significative e intervalli, calcola con SymPy esatto
($\pi$ simbolico), arrotonda a due cifre e confronta la risposta e la forma delle opzioni.

## Domande per la revisione

- Il livello 4 fa passare dai giri al minuto alla velocità in tre passaggi: è un esercizio tipico del secondo anno o
  va spezzato?
