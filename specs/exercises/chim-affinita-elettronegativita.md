# Affinità elettronica ed elettronegatività

Generatore: `chim-affinita-elettronegativita` (`src/lib/exercises/v2/generators/chim-affinita-elettronegativita.ts`,
con `src/lib/exercises/v2/chim3-d.ts`). Verifica indipendente:
`scripts/exercises/checkers/chim_affinita_elettronegativita.py`, con `_chim3_d.py`. Lezione collegata:
`docs/lezioni/chimica/riscritte/60-chim-affinita-elettronegativita.md`. Percorso nel database:
`high_school/chemistry/tavola-periodica/chim-affinita-elettronegativita`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più. Scelta multipla con quattro opzioni in tutti;
il livello 5 ha come risposta un numero e può andare a risposta aperta.

## Nomi dei livelli

1. Che cosa misurano
2. L'affinità elettronica nella tavola
3. L'elettronegatività nella tavola
4. La carica parziale in un legame
5. La differenza di elettronegatività
6. Legami a confronto

## Dati

Elettronegatività di Pauling da `src/lib/tools/elementi.json`, con due decimali. Affinità elettroniche (energia
liberata, kJ/mol) dalla tabella della lezione, in `chim3-d.ts`: non sono nel file della tavola, e sono da verificare.

## Livello 1: che cosa misurano

Sedici domande della lezione, ognuna con la risposta e tre distrattori: le due definizioni (i distrattori sono
l'altra definizione e quella dell'energia di ionizzazione), le unità ($\text{kJ/mol}$ contro numero puro), il processo
$\mathrm{X} + e^- \to \mathrm{X^-}$, la scala di Pauling, l'elemento più elettronegativo (fluoro) e quello con
l'affinità più alta (cloro), gli alogeni, i gas nobili, gli andamenti, chi prende $\delta^-$, come si calcola
$\Delta\chi$.

- "In che unità si misura l'elettronegatività?" Risposta "In nessuna: è un numero puro".
- "Quale elemento ha l'affinità elettronica più alta?" Risposta "Il cloro"; distrattori "Il fluoro", "L'ossigeno",
  "Il sodio".

## Livello 2: l'affinità elettronica nella tavola

Tre casi. "Massima" (circa 45%): un alogeno tra $\mathrm{F}$, $\mathrm{Cl}$, $\mathrm{Br}$, $\mathrm{I}$ e tre elementi
con affinità bassa o nulla ($\mathrm{Li}$, $\mathrm{Na}$, $\mathrm{K}$, $\mathrm{Be}$, $\mathrm{Mg}$, $\mathrm{Ne}$,
$\mathrm{Ar}$, $\mathrm{B}$, $\mathrm{Al}$, $\mathrm{N}$); si chiede chi libera più energia. Vincolo: almeno
$150\,\text{kJ/mol}$ tra il primo e il secondo. "Cloro e fluoro" (circa 15%): la stessa domanda con cloro e fluoro
insieme e due elementi con affinità bassa; la risposta è il cloro, come nel riquadro della lezione. "Nessuna" (circa
40%): uno tra $\mathrm{Be}$, $\mathrm{Mg}$, $\mathrm{N}$, $\mathrm{Ne}$, $\mathrm{Ar}$ e tre elementi che liberano
energia; si chiede chi non ne libera.

- "Quale di questi elementi libera più energia quando un suo atomo acquista un elettrone?" con $\mathrm{Na}$,
  $\mathrm{Br}$, $\mathrm{Mg}$, $\mathrm{Ar}$. Risposta $\mathrm{Br}$.
- "Quale di questi elementi non libera energia quando un suo atomo acquista un elettrone?" con $\mathrm{S}$,
  $\mathrm{Mg}$, $\mathrm{Li}$, $\mathrm{Cl}$. Risposta $\mathrm{Mg}$.

## Livello 3: l'elettronegatività nella tavola

Quattro elementi dello stesso periodo (periodi 2, 3 e 4, gruppi 1, 2 e da 13 a 17) o dello stesso gruppo (gruppi 1 e
2 dal secondo al sesto periodo, 16 e 17 dal secondo al quinto), metà e metà; si chiede il più o il meno
elettronegativo. Vincolo: nei dati l'elettronegatività dei quattro segue la regola (aumenta lungo il periodo,
diminuisce lungo il gruppo) con almeno $0{,}03$ tra un elemento e il successivo.

- "Quale di questi elementi del terzo periodo è il più elettronegativo?" con $\mathrm{P}$, $\mathrm{Na}$,
  $\mathrm{Cl}$, $\mathrm{Al}$. Risposta $\mathrm{Cl}$.
- "Quale di questi elementi del gruppo $17$ è il meno elettronegativo?" con $\mathrm{F}$, $\mathrm{Cl}$,
  $\mathrm{Br}$, $\mathrm{I}$. Risposta $\mathrm{I}$.

## Livello 4: la carica parziale in un legame

Un legame tra due elementi diversi, presi da una lista di quaranta coppie che si legano davvero, con i due valori di
$\chi$ nel testo. Si chiede su quale atomo sta $\delta^-$. Le quattro opzioni incrociano l'atomo e il motivo: quella
giusta è "sull'atomo più elettronegativo"; le altre sono il valore maggiore letto sull'atomo sbagliato, e $\delta^-$
messa sull'atomo meno elettronegativo (con i valori letti bene o male).

- "Nel legame tra idrogeno ($\chi = 2{,}20$) e cloro ($\chi = 3{,}16$), su quale atomo sta la carica parziale
  $\delta^-$?" Risposta "Sul cloro, che è più elettronegativo"; distrattori "Sull'idrogeno, che è più elettronegativo",
  "Sull'idrogeno, che è meno elettronegativo", "Sul cloro, che è meno elettronegativo".
- "Nel legame tra sodio ($\chi = 0{,}93$) e idrogeno ($\chi = 2{,}20$) ..." Risposta "Sull'idrogeno, che è più
  elettronegativo".

## Livello 5: la differenza di elettronegatività

Le stesse coppie; si chiede $\Delta\chi$, con due decimali. Distrattori: il minore meno il maggiore (negativo), la
somma, la media (quando ha due decimali), il valore maggiore da solo.

- "Nel legame tra carbonio ($\chi = 2{,}55$) e ossigeno ($\chi = 3{,}44$), quanto vale la differenza di
  elettronegatività $\Delta\chi$?" Risposta $0{,}89$; distrattori $-0{,}89$, $5{,}99$, $3{,}44$.
- "Nel legame tra cloro ($\chi = 3{,}16$) e idrogeno ($\chi = 2{,}20$) ..." Risposta $0{,}96$; distrattori $-0{,}96$,
  $5{,}36$, $2{,}68$.

## Livello 6: legami a confronto

Una tabella con i valori di $\chi$ di quattro o cinque elementi tra $\mathrm{H}$, $\mathrm{B}$, $\mathrm{C}$,
$\mathrm{N}$, $\mathrm{O}$, $\mathrm{F}$, $\mathrm{Si}$, $\mathrm{P}$, $\mathrm{S}$, $\mathrm{Cl}$, $\mathrm{Br}$,
$\mathrm{I}$, e quattro legami tra loro; si chiede quello con gli elettroni più spostati, cioè con $\Delta\chi$ più
grande. Vincoli: le quattro differenze sono tutte diverse e la più grande supera la seconda di almeno $0{,}10$; la
tabella elenca tutti e soli gli elementi dei quattro legami.

- Tabella $\mathrm{H}$ $2{,}20$, $\mathrm{O}$ $3{,}44$, $\mathrm{F}$ $3{,}98$, $\mathrm{Si}$ $1{,}90$, $\mathrm{P}$
  $2{,}19$; legami $\mathrm{Si{-}P}$, $\mathrm{H{-}F}$, $\mathrm{O{-}Si}$, $\mathrm{H{-}O}$. Risposta $\mathrm{H{-}F}$
  ($1{,}78$).
- Tabella $\mathrm{B}$ $2{,}04$, $\mathrm{C}$ $2{,}55$, $\mathrm{N}$ $3{,}04$, $\mathrm{P}$ $2{,}19$, $\mathrm{I}$
  $2{,}66$; legami $\mathrm{B{-}P}$, $\mathrm{C{-}N}$, $\mathrm{P{-}I}$, $\mathrm{N{-}P}$. Risposta $\mathrm{N{-}P}$
  ($0{,}85$).

## Esercizi da evitare

- Confronti di elettronegatività nei gruppi 13, 14 e 15, dove i dati non scendono con regolarità (gallio e germanio
  sopra alluminio e silicio, fosforo e arsenico a $0{,}01$), e tra potassio e rubidio, che hanno lo stesso valore.
- Il tipo di legame da $\Delta\chi$: è della lezione "Legame covalente polare e legame dativo".
- Confronti di affinità elettronica tra elementi con valori vicini, o con elementi che la tabella della lezione non
  ha.
- Nel livello 6, legami tra atomi che non esistono come coppia legata non sono esclusi (per esempio
  $\mathrm{B{-}I}$): l'esercizio è sul confronto dei numeri.

## Risposta aperta

Livello 5: la risposta è un numero (`answer.kind = 'number'`, in forma di frazione esatta, $0{,}96$ è `24/25`),
classificazione `V`.

## Verifica

`chim_affinita_elettronegativita.py` ha la chiave delle risposte del livello 1 scritta dalla lezione; per gli altri
livelli legge testo e opzioni e ricalcola dai valori di `elementi.json` e dalla tabella delle affinità di
`_chim3_d.py`: il massimo con il suo margine, chi non libera energia, la regola dell'elettronegatività sui dati, i
valori di $\chi$ scritti nel testo contro quelli della tavola, la differenza, il legame con la differenza più grande.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 203 px su 252, tabella del livello 6 304 px su 350).

### Errori piantati

Come per `proprieta-periodiche`, 60 esercizi per livello: bocciati tutti.
