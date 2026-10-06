# Note: Affinità elettronica ed elettronegatività

Lezione nuova (terzo anno di chimica, gruppo D, 6 ottobre 2026), capitolo "Il sistema periodico", quarta lezione su
cinque. Non pubblicata. `check.mts` passa su lezione, formulario e flashcard, senza avvisi. Conti rifatti in Python:
$495{,}8 - 349 = 146{,}8$; $\Delta\chi$ di $\mathrm{H{-}Cl}$ $0{,}96$, $\mathrm{O{-}H}$ $1{,}24$, $\mathrm{C{-}H}$ $0{,}35$,
$\mathrm{C{-}S}$ $0{,}03$.

## Struttura

L'affinità elettronica (definizione, tabella dei periodi 2 e 3, alogeni e metalli alcalini, gli atomi che non
liberano energia, andamento, avviso su cloro e fluoro, esempio 1, nota sul segno); ionizzazione e affinità a
confronto (tabella sodio-cloro, esempio 2, avviso); l'elettronegatività (definizione, figura della coppia spostata,
scala di Pauling, tabella dei valori, andamenti, figura interattiva, esempio 3, avviso, nota su Mulliken); la
differenza di elettronegatività (esempi 4 e 5, avviso); le quattro proprietà insieme (schema e tabella).

## Scelte

- Confine con la lezione 64 (gruppo E): qui si definisce $\Delta\chi$, si calcola e si dice chi prende $\delta^-$; le
  soglie e il tipo di legame non compaiono, c'è solo il link. Le cariche parziali sono introdotte in due righe perché
  senza di esse l'elettronegatività resta una parola.
- Affinità elettronica definita come energia liberata, con valori positivi; una nota dice che molti libri scrivono
  il segno meno. Simbolo $A_e$.
- Per gli atomi con anione non stabile (berillio, magnesio, azoto, gas nobili) la tabella dice "nessuna" e il testo
  "non liberano energia": niente valori negativi o stimati.
- La seconda affinità elettronica (l'ossigeno che diventa $\mathrm{O^{2-}}$) non c'è.
- Una sola figura interattiva. Una seconda con due atomi a scelta e la coppia che si sposta sarebbe stata la stessa
  che il brief assegna alla lezione 64.

## Dati

- Elettronegatività da `elementi.json`. Il file dà un valore anche a kripton ($3{,}00$) e xeno ($2{,}60$) e nessuno a
  elio, neon, argon: la lezione dice "i gas nobili più leggeri non hanno un valore".
- Nei gruppi 13 e 14 i valori non scendono con regolarità (gallio $1{,}81$ sopra alluminio $1{,}61$, germanio $2{,}01$
  sopra silicio $1{,}90$): la lezione lo dice in una frase. Potassio e rubidio hanno lo stesso valore, $0{,}82$.
- Le affinità elettroniche non sono in `elementi.json`. Valori scritti a memoria, arrotondati all'unità, in kJ/mol:
  H $73$, Li $60$, B $27$, C $122$, O $141$, F $328$, Na $53$, Al $42$, Si $134$, P $72$, S $200$, Cl $349$, K $48$,
  Br $325$, I $295$; nella figura interattiva anche Rb $47$, Cs $46$, Se $195$, Te $190$. Da verificare (CRC
  Handbook). Proposta: aggiungere il campo al file della tavola, così lezione, figura ed esercizi leggono da lì.

## Da verificare

- Pauling, scala proposta nel 1932; Mulliken, 1934.
- "Il fluoro vale $3{,}98$, il cesio $0{,}79$": dal file; il francio ($0{,}70$) è escluso con "tra quelli comuni".

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `affinita-elettronica-periodi`, `elettronegativita-coppia-spostata`,
`elettronegativita-scala-pauling`, `elettronegativita-andamenti-tavola`. Nelle due tabelle il colore delle caselle
cresce con il valore; nel tema scuro si inverte (valore alto, casella chiara), ma i numeri sono scritti in ogni
casella e il colore non porta informazione da solo.

Una interattiva: `elettronegativita-andamenti` (`ElettronegativitaAndamenti.tsx`, con `chim3-D-andamenti.tsx`),
colonne dell'elettronegatività o dell'affinità elettronica lungo un periodo o un gruppo; per l'affinità solo i
periodi 2 e 3 e i gruppi 1, 16, 17. Guardata in chiaro, in scuro e a 390 px.

## Esercizio guidato

L'esempio 4 ($\Delta\chi$ in tre legami). Tre fermate: leggere i due valori dalla tabella; fare la differenza nel
verso giusto; decidere su quale atomo sta $\delta^-$.

## Esercizi

Generatore `chim-affinita-elettronegativita`, sei livelli. Livello 5 con risposta numerica, proposto anche a risposta
aperta.

## Dubbi per Andrea

- Affinità elettronica come energia liberata con il segno più, o con il segno meno come il Valitutti?
- "Nessuna" per gli atomi con anione non stabile, o preferisci i valori negativi delle tabelle?
- Le cariche parziali $\delta^+$ e $\delta^-$ compaiono già qui, prima della lezione sul legame polare: va bene?
- La nota su Mulliken si tiene?
- Il confronto "il cloro ha l'affinità più alta, il fluoro l'elettronegatività più alta" è un riquadro e una
  flashcard: è un punto che chiedi in verifica?

Prerequisiti proposti: proprieta-periodiche, chim-configurazione-elettronica, gruppi-periodi
