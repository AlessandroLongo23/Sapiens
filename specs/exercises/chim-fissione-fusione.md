# Fissione e fusione nucleare

Generatore: `chim-fissione-fusione` (`src/lib/exercises/v2/generators/chim-fissione-fusione.ts`, con
`src/lib/exercises/v2/chim3-c.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_fissione_fusione.py`, con
`_chim3_c.py`. Lezione collegata: `docs/lezioni/chimica/riscritte/56-chim-fissione-fusione.md`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il difetto di massa
2. L'energia di legame
3. L'energia di legame per nucleone
4. Il nucleo più stabile
5. L'energia di una reazione
6. L'energia di una massa di combustibile

## Dati e tipi di risposta

Scelta multipla, quattro opzioni, con l'unità nell'opzione (nel livello 4 le opzioni sono i quattro nuclei). Nessun
livello a risposta aperta: tutte le risposte hanno un'unità o sono un nucleo.

Costanti della lezione: protone $1{,}00728\,\text{u}$, neutrone $1{,}00866\,\text{u}$,
$1\,\text{u} = 1{,}6605 \cdot 10^{-27}\,\text{kg}$, $c = 3{,}00 \cdot 10^8\,\text{m/s}$, e quindi
$1\,\text{u} \leftrightarrow 1{,}494 \cdot 10^{-10}\,\text{J}$; $N_A = 6{,}022 \cdot 10^{23}\,\text{mol}^{-1}$.

Masse ed energie di legame vere, da AME2020 (Wang e altri, "The AME 2020 atomic mass evaluation (II)", Chinese
Physics C 45, 030003, 2021): masse dei nuclei (massa dell'atomo meno $Z$ elettroni) e masse degli atomi a cinque
decimali di $\text{u}$, energie di legame al decimo di $\text{MeV}$. Gli elenchi sono nel generatore (`NUCLEAR_MASS`,
38 nuclei stabili dal deuterio allo zinco-64; `BINDING`, 34 nuclei dal deuterio all'uranio-238; `ATOMIC_MASS`) e,
ricopiati dalla tabella, nel controllo.

Le energie in joule hanno tre cifre significative (due nel livello 6), in notazione scientifica; mai a meno di
$10^{-6}$ da un confine di arrotondamento. Dove la lezione ha due strade (i kilogrammi e $c^2$, oppure
$1{,}494 \cdot 10^{-10}\,\text{J}$ per unità di massa atomica) le due devono dare la stessa risposta.

## Livello 1: il difetto di massa

Un nucleo stabile con la sua massa; si chiede $\Delta m = Z \cdot m_p + N \cdot m_n - m$, a cinque decimali.
Distrattori: protoni e neutroni scambiati; tutti i nucleoni contati come protoni, o come neutroni; il numero di massa
al posto della massa del nucleo.

- "Il nucleo di elio-4, ${}^{4}_{2}\mathrm{He}$, ha una massa di $4{,}00151\,\text{u}$. Quanto vale il suo difetto di
  massa? Il protone ha massa $1{,}00728\,\text{u}$, il neutrone $1{,}00866\,\text{u}$." Risposta
  $0{,}03037\,\text{u}$; distrattori $0{,}02761\,\text{u}$, $0{,}03313\,\text{u}$, $0{,}03188\,\text{u}$.
- "Il nucleo di ferro-56, ${}^{56}_{26}\mathrm{Fe}$, ha una massa di $55{,}92067\,\text{u}$. ..." Risposta
  $0{,}52841\,\text{u}$.

## Livello 2: l'energia di legame

Il difetto di massa di un nucleo dell'elenco, in unità di massa atomica; si chiede l'energia di legame in joule,
$E = \Delta m \cdot c^2$ con la massa in kilogrammi. Distrattori: $c$ non elevato al quadrato; la massa lasciata in
unità di massa atomica; $\frac{1}{2}\,m\,c^2$; il valore in megaelettronvolt scritto come joule.

- "Il difetto di massa del nucleo ${}^{4}_{2}\mathrm{He}$ è $0{,}03037\,\text{u}$. Quanto vale la sua energia di
  legame, in joule? Usa $1\,\text{u} = 1{,}6605 \cdot 10^{-27}\,\text{kg}$ e $c = 3{,}00 \cdot 10^{8}\,\text{m/s}$."
  Risposta $4{,}54 \cdot 10^{-12}\,\text{J}$; distrattori $1{,}51 \cdot 10^{-20}\,\text{J}$,
  $2{,}73 \cdot 10^{15}\,\text{J}$, $2{,}27 \cdot 10^{-12}\,\text{J}$.
- "Il difetto di massa del nucleo ${}^{24}_{12}\mathrm{Mg}$ è $0{,}21282\,\text{u}$. ..." Risposta
  $3{,}18 \cdot 10^{-11}\,\text{J}$.

## Livello 3: l'energia di legame per nucleone

L'energia di legame di un nucleo (da $A = 4$), in megaelettronvolt; si chiede $E : A$ a tre cifre. Distrattori:
l'energia divisa per i protoni, per i neutroni, per tutte le particelle dell'atomo ($A + Z$), non divisa.

- "L'energia di legame del nucleo ${}^{56}_{26}\mathrm{Fe}$ è $492{,}3\,\text{MeV}$. Quanto vale la sua energia di
  legame per nucleone?" Risposta $8{,}79\,\text{MeV}$; distrattori $18{,}9\,\text{MeV}$, $16{,}4\,\text{MeV}$,
  $6{,}00\,\text{MeV}$.
- "L'energia di legame del nucleo ${}^{88}_{38}\mathrm{Sr}$ è $768{,}5\,\text{MeV}$. ..." Risposta
  $8{,}73\,\text{MeV}$.

## Livello 4: il nucleo più stabile

Quattro nuclei con le loro energie di legame; il più stabile è quello con la maggiore energia per nucleone. Vincoli:
il più stabile supera il secondo di almeno $0{,}1\,\text{MeV}$ per nucleone, e non è il più pesante dei quattro, così
che il nucleo con l'energia di legame più grande sia il distrattore principale.

- "Le energie di legame di quattro nuclei, in megaelettronvolt, sono: ${}^{12}\mathrm{C}$ $92{,}2$,
  ${}^{90}\mathrm{Zr}$ $783{,}9$, ${}^{120}\mathrm{Sn}$ $1020{,}5$, ${}^{144}\mathrm{Nd}$ $1199{,}1$. Qual è il nucleo
  più stabile?" Risposta ${}^{90}_{40}\mathrm{Zr}$ ($8{,}71$ contro $8{,}50$, $8{,}33$ e $7{,}68$).
- "... ${}^{2}\mathrm{H}$ $2{,}2$, ${}^{12}\mathrm{C}$ $92{,}2$, ${}^{63}\mathrm{Cu}$ $551{,}4$, ${}^{120}\mathrm{Sn}$
  $1020{,}5$ ..." Risposta ${}^{63}_{29}\mathrm{Cu}$.

## Livello 5: l'energia di una reazione

Una fissione o una fusione vera, metà e metà (quote tra il 40% e il 60%), con le masse degli atomi che servono; si
chiede l'energia liberata, $\Delta m = m_{\text{reagenti}} - m_{\text{prodotti}}$ per $1{,}494 \cdot 10^{-10}\,\text{J}$.
Fissioni: tredici divisioni dell'uranio-235 e del plutonio-239 in due frammenti e da due a quattro neutroni, bilanciate
su $A$ e $Z$. Fusioni: dieci reazioni tra nuclei fino all'ossigeno (deuterio e trizio, deuterio e deuterio, tre nuclei
di elio in carbonio-12 e altre). Distrattori: i neutroni lasciati fuori dal bilancio; ogni particella contata una
volta sola, senza il suo coefficiente; la massa in unità di massa atomica moltiplicata per $c^2$; $c$ non al quadrato;
il valore in megaelettronvolt scritto come joule.

- "${}^{2}_{1}\mathrm{H} + {}^{3}_{1}\mathrm{H} \longrightarrow {}^{4}_{2}\mathrm{He} + {}^{1}_{0}n$", con le masse
  $2{,}01410$, $3{,}01605$, $4{,}00260$ e $1{,}00866$. Risposta $2{,}82 \cdot 10^{-12}\,\text{J}$.
- "${}^{235}_{\ 92}\mathrm{U} + {}^{1}_{0}n \longrightarrow {}^{141}_{\ 56}\mathrm{Ba} + {}^{92}_{36}\mathrm{Kr} + 3\,{}^{1}_{0}n$",
  con le masse $235{,}04393$, $1{,}00866$, $140{,}91440$ e $91{,}92617$. Risposta $2{,}78 \cdot 10^{-11}\,\text{J}$.

## Livello 6: l'energia di una massa di combustibile

L'energia di una reazione, la massa di una mole di reazioni e una massa di combustibile con due cifre significative
(da $0{,}11\,\text{g}$ a $99\,\text{g}$, senza zero finale); si chiede l'energia totale,
$\frac{m}{M} \cdot N_A \cdot E$, a due cifre. Tre combustibili: uranio-235 ($3{,}20 \cdot 10^{-11}\,\text{J}$ per
fissione, il valore medio di circa $200\,\text{MeV}$ della lezione; $235\,\text{g/mol}$), miscela di deuterio e trizio
($2{,}82 \cdot 10^{-12}\,\text{J}$; $5{,}03\,\text{g}$ per mole di coppie), deuterio che fonde in elio-3
($5{,}25 \cdot 10^{-13}\,\text{J}$; $4{,}03\,\text{g}$ per mole di coppie). La risposta deve restare la stessa se il
numero di nuclei si arrotonda a tre cifre. Distrattori: le moli non trasformate in nuclei; i grammi moltiplicati per
il numero di Avogadro; una mole qualunque sia la massa; la massa molare rovesciata.

- "La fissione di un nucleo di uranio-235 libera in media $3{,}20 \cdot 10^{-11}\,\text{J}$. La massa molare
  dell'uranio-235 è $235\,\text{g/mol}$. Quanta energia libera la fissione di $1{,}5\,\text{g}$ di uranio-235?"
  Risposta $1{,}2 \cdot 10^{11}\,\text{J}$.
- "La fusione di un nucleo di deuterio con uno di trizio libera $2{,}82 \cdot 10^{-12}\,\text{J}$. Una mole di coppie
  deuterio-trizio ha una massa di $5{,}03\,\text{g}$. Quanta energia libera la fusione di $1{,}5\,\text{g}$ di
  miscela?" Risposta $5{,}1 \cdot 10^{11}\,\text{J}$.

## Da evitare

- Masse inventate: un difetto di massa negativo o un'energia di legame per nucleone sopra i $9\,\text{MeV}$ non
  esistono.
- Equazioni nucleari non bilanciate su $A$ e $Z$.
- Reazioni che assorbono energia presentate come reazioni che ne liberano.
- Nel livello 4, quattro nuclei in cui il più stabile è anche il più pesante, o due nuclei quasi alla pari.
- Risposte in megaelettronvolt nei livelli 2 e 5: la lezione fa i conti in joule.
