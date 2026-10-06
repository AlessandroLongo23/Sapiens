# Legame covalente polare e legame dativo

Generatore: `chim-legame-covalente-polare` (`src/lib/exercises/v2/generators/chim-legame-covalente-polare.ts`, con
`src/lib/exercises/v2/chim3-e.ts`). Verifica indipendente:
`scripts/exercises/checkers/chim_legame_covalente_polare.py` (con `_chim3_e.py`). Lezione collegata:
`docs/lezioni/chimica/riscritte/64-chim-legame-covalente-polare.md`. Percorso nel database:
`high_school/chemistry/legami-chimici/chim-legame-covalente-polare`.

Cinque livelli nell'ordine della lezione, ognuno con una difficoltà in più: il calcolo di $\Delta\chi$, il tipo di
legame, le cariche parziali, il confronto tra quattro legami, il legame dativo.

## Nomi dei livelli

1. La differenza di elettronegatività
2. Il tipo di legame
3. Le cariche parziali
4. Il legame più polare
5. Il legame dativo

## Dati

Elettronegatività di Pauling con due decimali, da `src/lib/tools/elementi.json`, sempre scritte nel testo
dell'esercizio: H $2{,}20$, Li $0{,}98$, Be $1{,}57$, C $2{,}55$, N $3{,}04$, O $3{,}44$, F $3{,}98$, Na $0{,}93$, Mg
$1{,}31$, Al $1{,}61$, Si $1{,}90$, P $2{,}19$, S $2{,}58$, Cl $3{,}16$, K $0{,}82$, Ca $1{,}00$, Se $2{,}55$, Br
$2{,}96$, Rb $0{,}82$, Sr $0{,}95$, I $2{,}66$. Soglie della lezione: sotto $0{,}4$ covalente puro, da $0{,}4$ a
$1{,}9$ covalente polare, sopra $1{,}9$ ionico. Tutto a scelta multipla, quattro opzioni.

## Le coppie ammesse

La regola delle soglie è una regola pratica, e gli esercizi usano solo le coppie su cui non sbaglia e che stanno
lontane dalle soglie:

- due non metalli diversi con $\Delta\chi \le 0{,}35$ (covalente puro) oppure $0{,}45 \le \Delta\chi \le 1{,}85$
  (covalente polare);
- un metallo e un non metallo con $\Delta\chi \ge 2{,}00$ (ionico);
- due atomi uguali di idrogeno, azoto, ossigeno, fluoro, cloro, bromo, iodio (covalente puro), solo al livello 2.

Il silicio conta tra i non metalli.

## Livello 1: la differenza di elettronegatività

Due elementi di una coppia ammessa con le loro elettronegatività, in ordine qualsiasi; si chiede $\Delta\chi$.
Distrattori: la somma, la differenza con il segno meno (il valore più grande tolto dal più piccolo), la media.

- "L'elettronegatività del cloro è $3{,}16$, quella dell'idrogeno è $2{,}20$..." Risposta $0{,}96$; distrattori
  $5{,}36$, $-0{,}96$, $2{,}68$.
- "L'elettronegatività dell'azoto è $3{,}04$, quella del bromo è $2{,}96$..." Risposta $0{,}08$; distrattori
  $6{,}00$, $-0{,}08$, $3{,}00$.

## Livello 2: il tipo di legame

Tre casi: covalente puro ($30\%$, un terzo delle volte con due atomi uguali), covalente polare ($40\%$), ionico
($30\%$). Le opzioni sono sempre le stesse quattro: covalente puro, covalente polare, ionico, dativo.

- "L'elettronegatività dell'ossigeno è $3{,}44$, quella del silicio è $1{,}90$. Che tipo di legame c'è tra l'ossigeno
  e il silicio?" $\Delta\chi = 1{,}54$: covalente polare.
- "L'elettronegatività del carbonio è $2{,}55$, quella dello zolfo è $2{,}58$..." $\Delta\chi = 0{,}03$: covalente
  puro, anche se gli atomi sono diversi (l'errore del riquadro della lezione).

## Livello 3: le cariche parziali

Una coppia covalente polare di due non metalli; si chiede su quale atomo sta $\delta^-$ (sei volte su dieci) oppure
$\delta^+$. Opzioni: i due atomi, "Su tutti e due", "Su nessuno dei due".

- "L'elettronegatività dell'idrogeno è $2{,}20$, quella del cloro è $3{,}16$... su quale si trova la carica parziale
  $\delta^+$?" Risposta: sull'idrogeno.
- "L'elettronegatività del fluoro è $3{,}98$, quella dello zolfo è $2{,}58$... la carica parziale $\delta^-$?"
  Risposta: sul fluoro.

## Livello 4: il legame più polare

Quattro legami covalenti tra non metalli (puri o polari), scritti con l'atomo meno elettronegativo per primo, e una
tabella con le elettronegatività degli elementi che servono. Si chiede il più polare (sei volte su dieci) o il meno
polare. I quattro valori di $\Delta\chi$ distano tra loro almeno $0{,}05$. Le opzioni sono i quattro legami.

- $\mathrm{Si{-}O}$ ($1{,}54$), $\mathrm{S{-}F}$ ($1{,}40$), $\mathrm{S{-}Cl}$ ($0{,}58$), $\mathrm{H{-}Cl}$
  ($0{,}96$): il più polare è $\mathrm{Si{-}O}$.
- $\mathrm{O{-}F}$ ($0{,}54$), $\mathrm{Br{-}N}$ ($0{,}08$), $\mathrm{I{-}F}$ ($1{,}32$), $\mathrm{Se{-}Cl}$
  ($0{,}61$): il meno polare è $\mathrm{Br{-}N}$.

## Livello 5: il legame dativo

Quattordici domande della lezione con la risposta e tre distrattori: da dove vengono gli elettroni della coppia, che
cosa devono avere donatore e accettore, chi dona e chi accetta nello ione ammonio, nello ione ossonio e nel composto
tra $\mathrm{BF_3}$ e $\mathrm{NH_3}$, le coppie solitarie rimaste, gli elettroni intorno all'azoto e al boro, il
legame dativo identico agli altri, la freccia, perché $\mathrm{H^+}$ accetta.

- "Che cosa deve avere l'atomo donatore di un legame dativo?" Risposta: una coppia solitaria. Distrattori: un
  elettrone spaiato, una carica positiva, il livello esterno vuoto.
- "Nello ione $\mathrm{NH_4^+}$, com'è il legame dativo rispetto agli altri tre legami?" Risposta: identico agli
  altri. Distrattori: più lungo, più debole, più corto.

## Esercizi da evitare

- Coppie vicine a una soglia: $\mathrm{S{-}H}$ ($0{,}38$), $\mathrm{P{-}S}$ ($0{,}39$), $\mathrm{C{-}Br}$ ($0{,}41$):
  un centesimo deciderebbe la risposta. Il legame $\mathrm{C{-}H}$ ($0{,}35$) resta, perché la lezione lo classifica.
- Un metallo e un non metallo con $\Delta\chi$ sotto $2{,}0$: $\mathrm{NaI}$ ($1{,}73$), $\mathrm{MgCl_2}$
  ($1{,}85$), $\mathrm{NaH}$ ($1{,}27$) sono composti ionici, e la regola direbbe covalente polare.
- Due non metalli con $\Delta\chi$ sopra $1{,}85$: $\mathrm{Si{-}F}$ ($2{,}08$) è covalente. Il boro non compare
  ($\mathrm{B{-}F}$, $1{,}94$).
- Due metalli: il legame è metallico e la regola non si usa.
- Domande sulla polarità della molecola intera: sono della lezione "Molecole polari e apolari".
- Legami dativi negli ossiacidi e negli ossidi dello zolfo: la lezione non li tratta.

## Verifica

`chim_legame_covalente_polare.py` confronta le elettronegatività del testo con la sua tabella, rifà la differenza in
aritmetica esatta, classifica con le soglie della lezione e rifiuta le coppie che la specifica esclude; per le cariche
parziali sceglie l'atomo dal confronto delle elettronegatività; per il livello 4 rilegge la tabella dell'esercizio,
calcola le quattro differenze e controlla che distino almeno $0{,}05$; per il livello 5 ha una chiave delle risposte
scritta dalla lezione.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0.

### Errori piantati

Su 60 esercizi per livello (seed da 300): indice dell'opzione giusta, opzione doppia, testo dell'opzione giusta, un
dato del testo cambiato, parole vietate: tutti bocciati.
