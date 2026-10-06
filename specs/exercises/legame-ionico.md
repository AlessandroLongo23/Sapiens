# Il legame ionico

Generatore: `legame-ionico` (`src/lib/exercises/v2/generators/legame-ionico.ts`, con `src/lib/exercises/v2/chim3-f.ts`).
Verifica indipendente: `scripts/exercises/checkers/legame_ionico.py` (con `_chim3_f.py`). Lezione collegata:
`docs/lezioni/chimica/riscritte/65-legame-ionico.md`. Percorso nel database:
`high_school/chemistry/legami-chimici/legame-ionico`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più. Tutti a scelta multipla con quattro opzioni:
le risposte sono coppie di elementi, ioni, formule, numeri in notazione scientifica, frasi.

## Nomi dei livelli

1. Quale coppia forma un legame ionico
2. Lo ione dal gruppo
3. La formula dai due ioni
4. Quanti ioni in una massa
5. Energia reticolare a confronto
6. Le proprietà dei composti ionici

## Dati

Elettronegatività, gruppi e masse atomiche con due decimali da `src/lib/tools/elementi.json`. Raggi ionici in pm, quelli
da cui viene la tabella della lezione: $\mathrm{Li^+}$ 76, $\mathrm{Na^+}$ 102, $\mathrm{K^+}$ 138, $\mathrm{Mg^{2+}}$ 72,
$\mathrm{Ca^{2+}}$ 100, $\mathrm{F^-}$ 133, $\mathrm{Cl^-}$ 181, $\mathrm{Br^-}$ 196, $\mathrm{O^{2-}}$ 140.
$N_A = 6{,}02 \cdot 10^{23}\,\text{mol}^{-1}$.

## Livello 1: quale coppia forma un legame ionico

Quattro coppie di elementi: una di un metallo e un non metallo con $\Delta\chi \ge 1{,}9$ (i due criteri della lezione
sono d'accordo), una di due non metalli diversi, una di due atomi dello stesso non metallo, una di due metalli.

- "Quale di queste coppie di elementi forma un legame ionico?" Opzioni: Sodio e cloro (giusta), Idrogeno e cloro, Due
  atomi di bromo, Litio e sodio.
- Opzioni: Magnesio e ossigeno (giusta), Zolfo e ossigeno, Due atomi di ossigeno, Rame e zinco.

Distrattori: l'idrogeno con un alogeno (lo studente pensa a $\mathrm{HCl}$ come a un composto ionico), due non metalli
con elettronegatività diversa, due metalli.

## Livello 2: lo ione dal gruppo

Un elemento dei gruppi 1, 2, 13, 15, 16, 17 (litio, sodio, potassio, magnesio, calcio, bario, alluminio, azoto,
ossigeno, zolfo, fluoro, cloro, bromo, iodio) con il suo gruppo: si chiede lo ione.

- "Il calcio è nel gruppo $2$ della tavola periodica. Quale ione forma in un composto ionico?" Risposta
  $\mathrm{Ca^{2+}}$; distrattori $\mathrm{Ca^{2-}}$, $\mathrm{Ca^{6-}}$, $\mathrm{Ca^{6+}}$.
- "Il cloro è nel gruppo $17$ ..." Risposta $\mathrm{Cl^-}$; distrattori $\mathrm{Cl^+}$, $\mathrm{Cl^{7-}}$,
  $\mathrm{Cl^{7+}}$.

Distrattori: il segno scambiato (perdere elettroni dà una carica negativa); gli elettroni di valenza presi per la
carica di un non metallo; gli elettroni che mancano all'ottetto presi per la carica di un metallo.

## Livello 3: la formula dai due ioni

Un catione tra $\mathrm{Li^+}$, $\mathrm{Na^+}$, $\mathrm{K^+}$, $\mathrm{Mg^{2+}}$, $\mathrm{Ca^{2+}}$, $\mathrm{Ba^{2+}}$,
$\mathrm{Al^{3+}}$ e un anione tra $\mathrm{F^-}$, $\mathrm{Cl^-}$, $\mathrm{Br^-}$, $\mathrm{I^-}$, $\mathrm{O^{2-}}$,
$\mathrm{S^{2-}}$, $\mathrm{N^{3-}}$. La formula ha il metallo per primo e gli indici più piccoli.

- "Qual è la formula del composto ionico formato dagli ioni $\mathrm{Al^{3+}}$ e $\mathrm{O^{2-}}$?" Risposta
  $\mathrm{Al_2O_3}$; distrattori $\mathrm{Al_3O_2}$, $\mathrm{AlO}$, $\mathrm{Al_2O}$.
- "... $\mathrm{Mg^{2+}}$ e $\mathrm{O^{2-}}$?" Risposta $\mathrm{MgO}$; distrattori $\mathrm{Mg_2O_2}$, $\mathrm{Mg_2O}$,
  $\mathrm{MgO_2}$.

Distrattori: l'incrocio non semplificato, gli indici scambiati, un catione e un anione qualunque siano le cariche, poi
altri rapporti piccoli.

## Livello 4: quanti ioni in una massa

Un composto tra quelli degli ioni della lezione (cloruri, ossidi, fluoruri, bromuri e solfuri di litio, sodio,
potassio, magnesio, calcio; l'ossido di alluminio), una massa a tre cifre che corrisponde a $0{,}0500$, $0{,}100$,
$0{,}150$, $0{,}200$, $0{,}250$, $0{,}300$, $0{,}400$ o $0{,}500\,\text{mol}$. Il testo dà le masse atomiche e $N_A$.
Si chiede il numero totale di ioni, in notazione scientifica con tre cifre.

- "Quanti ioni ci sono in tutto in $33{,}3\,\text{g}$ di cloruro di calcio, $\mathrm{CaCl_2}$? ..." Risposta
  $5{,}42 \cdot 10^{23}$; distrattori $1{,}81 \cdot 10^{23}$ (le unità formula), $3{,}61 \cdot 10^{23}$ (solo gli
  anioni), $6{,}02 \cdot 10^{24}$ (la massa molare divisa per la massa).
- "... in $2{,}92\,\text{g}$ di cloruro di sodio, $\mathrm{NaCl}$? ..." Risposta $6{,}02 \cdot 10^{22}$.

Vincoli: la massa divisa per la massa molare, arrotondata a tre cifre, ridà la quantità di sostanza di partenza; la
risposta giusta sta entro lo $0{,}6\%$ del valore esatto (chi usa $6{,}022$ o non arrotonda $n$ arriva alla stessa
opzione) e nessun distrattore sta entro il $5\%$.

Distrattori: le unità formula al posto degli ioni; solo gli anioni o solo i cationi; la massa molare divisa per la
massa; la massa usata al posto delle moli.

## Livello 5: energia reticolare a confronto

Due composti, e si chiede quale ha l'energia reticolare maggiore e perché. Due casi:

- `distanza` (circa il 60%): stesse cariche, uno ione in comune, l'altro dello stesso gruppo. La risposta è il
  composto con la distanza minore, "ioni più piccoli".
- `cariche` (circa il 40%): un composto di ioni con carica 2 (ossido di magnesio o di calcio) e uno di ioni con
  carica 1. La risposta è quello con le cariche doppie, "cariche più alte".

Esempi:

- "Quale dei due composti ha l'energia reticolare maggiore, $\mathrm{NaCl}$ o $\mathrm{KCl}$, e perché?" Risposta
  "$\mathrm{NaCl}$: ioni più piccoli"; distrattori "$\mathrm{KCl}$: ioni più grandi", "$\mathrm{NaCl}$: ioni più
  grandi", "$\mathrm{KCl}$: ioni più piccoli".
- "... $\mathrm{CaO}$ o $\mathrm{NaF}$ ..." Risposta "$\mathrm{CaO}$: cariche più alte"; distrattori "$\mathrm{NaF}$:
  ioni più piccoli", "$\mathrm{NaF}$: cariche più alte", "$\mathrm{CaO}$: ioni più grandi".

Vincolo: la stima $q_+ \cdot q_- / d$ dei due composti differisce di almeno il $5\%$.

Distrattori: "ioni più grandi, legame più forte" (l'errore del riquadro della lezione); la distanza fatta contare più
delle cariche.

## Livello 6: le proprietà dei composti ionici

Quattordici domande della lezione con la loro risposta e tre distrattori: fragilità, conduzione da solido, fuso e in
soluzione, chi trasporta la carica, punti di fusione, reticolo e unità formula, numero di coordinazione, che cosa fanno
gli elettroni, definizione di energia reticolare, riconoscere un composto ionico dalle proprietà, solubilità in acqua.

- "Il cloruro di sodio solido conduce la corrente elettrica?" Risposta: "No: gli ioni sono bloccati"; distrattori "Sì:
  è fatto di ioni", "Sì: ha elettroni liberi", "No: non contiene cariche".
- "Di che cosa è fatto un cristallo di cloruro di sodio?" Risposta: "Di ioni in un reticolo"; distrattore principale
  "Di molecole di cloruro di sodio".

## Esercizi da evitare

- Coppie metallo e non metallo con $\Delta\chi < 1{,}9$ (ioduro di potassio, cloruro di magnesio, ossido di
  alluminio, solfuro di sodio): i due criteri della lezione danno risposte diverse. Al livello 1 non compaiono.
- Nitruri di sodio e di potassio al livello 3: come solidi ionici semplici non esistono.
- Coppie del livello 5 con stime vicine ($\mathrm{KCl}$ e $\mathrm{KBr}$, $4{,}7\%$): tolte.
- Composti con rapporto diverso da uno a uno al livello 5: la stima per coppia di ioni non si confronta con l'energia
  reticolare per mole.
- Ioni poliatomici: le formule con le parentesi sono della lezione 28 e della 82.

## Verifica

`legame_ionico.py` legge gruppi, famiglie, elettronegatività e masse da `elementi.json`: classifica da sé metalli e
non metalli, ricava la carica dello ione dal gruppo, rende neutra la formula con il minimo comune multiplo, ricalcola
massa molare, moli e ioni dai numeri scritti nel testo, stima $q_+ \cdot q_- / d$ con una sua tabella di raggi e ha
una chiave delle risposte del livello 6 scritta dalla lezione.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0.

Alla prima corsa il controllo ha bocciato la coppia $\mathrm{KCl}$ e $\mathrm{KBr}$ del livello 5 (stime troppo
vicine), che è stata tolta dal generatore.

### Errori piantati

Su 60 esercizi (seed da 300): indice dell'opzione giusta spostato, distrattore uguale alla risposta, testo dell'opzione
giusta scambiato, parole vietate, nessun passaggio: tutti bocciati. Un numero del testo cambiato: bocciato dove il
numero entra nel conto (i dettagli nel messaggio di consegna).
