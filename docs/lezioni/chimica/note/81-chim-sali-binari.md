# Note: I sali binari

Lezione nuova (6 ottobre 2026), terzo anno, capitolo "Classificazione e nomenclatura dei composti", sesta lezione su
sette. Gruppo J del lotto del terzo anno. `check.mts` passa su lezione, formulario e flashcard senza avvisi. Non
pubblicata.

## Struttura e confini

Che cosa sono; i cationi, con i due nomi degli ioni dei metalli a due cariche; gli anioni degli idracidi; dagli ioni
alla formula con la regola dell'incrocio (figura TikZ e figura interattiva); i tre nomi, con la tabella; dalla formula
al nome, partendo dalla carica dell'anione; dal nome alla formula; come si formano, in tre schemi senza coefficienti.

Gli ioni si presentano qui, come vuole il brief, ma solo quelli che servono ai sali binari; gli anioni poliatomici
sono della 82. La regola dell'incrocio è già nella 76 (per i numeri di ossidazione) e nella lezione 28 del biennio
(per gli ioni): qui è richiamata con il link alla 76 e riscritta in quattro passi, perché è il procedimento della
lezione. Gli idracidi e i loro nomi sono della 78. Lo ione ammonio e i composti tra due non metalli
($\mathrm{PCl_3}$) hanno un riquadro `ad-note` ciascuno; lo ione cianuro, che la 78 nomina, qui non c'è.

## Scelte e convenzioni

- Tre nomi sempre nell'ordine tradizionale, Stock, IUPAC. Quando il metallo ha un solo numero di ossidazione il nome
  di Stock coincide con il tradizionale, senza numero romano, e la lezione lo dice.
- Nel nome IUPAC mono- non si scrive mai: $\mathrm{CuS}$ è "solfuro di rame", $\mathrm{NaCl}$ "cloruro di sodio". La
  76 tiene "monossido"; per i sali non c'è un caso analogo.
- Metalli con due cariche: ferro, rame, stagno, piombo, come in `src/lib/tools/elementi.json`. Fuori oro, cobalto,
  nichel, cromo, manganese e mercurio (lo ione mercurio(I) è $\mathrm{Hg_2^{2+}}$, e complicherebbe l'incrocio).
- "Ione rameoso", "ione stannoso", "ione piomboso": aggettivi della nomenclatura tradizionale, da confermare.
- Il nome tradizionale usa sempre "di" ("bromuro di argento"); nell'apertura c'è "bromuro d'argento", come si dice.
- Alcuni sali della tabella e degli esempi sono composti poco stabili o rari ($\mathrm{Fe_2S_3}$,
  $\mathrm{SnCl_4}$ è un liquido molecolare, non un solido ionico). La lezione li usa come esercizio di nomenclatura,
  come fanno i libri. Esercizi e figura escludono sei sali che non esistono ($\mathrm{FeI_3}$, $\mathrm{CuI_2}$,
  $\mathrm{PbI_4}$, $\mathrm{PbBr_4}$, $\mathrm{PbS_2}$, $\mathrm{CuF}$); la figura li lascia costruire e avvisa.

## Dubbi per Andrea

- I metalli a due cariche bastano (ferro, rame, stagno, piombo), o vuoi anche oro, cobalto, nichel, cromo e mercurio?
- Nome IUPAC senza mono-: "solfuro di rame" per $\mathrm{CuS}$, o "monosolfuro di rame"?
- $\mathrm{SnCl_4}$, $\mathrm{PbCl_4}$ e simili sono composti molecolari: va bene chiamarli sali binari negli
  esercizi di nomenclatura, o li togliamo?
- Gli schemi di formazione senza coefficienti bastano, o vuoi almeno un'equazione bilanciata per schema?

## Da verificare

- Fluoruro di sodio nei dentifrici, cloruro di calcio sulle strade, bromuro d'argento nelle pellicole: scritti a
  memoria.
- L'elenco dei sali esclusi perché instabili è fatto a memoria.

## Figure

Una TikZ, guardata in chiaro e in scuro: `sali-binari-regola-incrocio` (gli ioni $\mathrm{Al^{3+}}$ e
$\mathrm{S^{2-}}$, le due frecce incrociate, la formula e il controllo delle cariche). Somiglia a
`ossidazione-regola-incrocio` della 76, che la disegna per l'ossido di alluminio con i numeri di ossidazione: qui ci
sono le cariche degli ioni.

Una interattiva, `sali-binari-bilancia-cariche`
(`src/components/content/interactive/chimica/SaliBinariBilanciaCariche.tsx`): si scelgono un catione e un anione e si
aggiungono ioni uno alla volta; ogni ione ha sotto tanti quadratini quante sono le sue cariche, con il segno; la
figura scrive i due totali, e solo quando sono pari e nel rapporto più piccolo mostra la formula e i tre nomi,
altrimenti dice quante cariche restano o che la formula si semplifica. Guardata in chiaro a 800 px ai valori iniziali,
in scuro dopo aver aggiunto un anione (compare $\mathrm{CaCl_2}$ con i tre nomi), a 390 px in chiaro dopo aver scelto
lo stagno e in scuro dopo aver scelto l'alluminio, senza scorrimento laterale.

## Esercizio guidato

L'esempio 4 ($\mathrm{SnS_2}$): si fermerebbe sulla carica dell'anione ($2-$), sulla carica negativa totale ($-4$) e
sul numero di ossidazione dello stagno ($+4$), prima dei tre nomi. È l'esempio in cui l'incrocio al contrario sbaglia.

## Esercizi

Generatore `chim-sali-binari`, cinque livelli (specifica in `specs/exercises/chim-sali-binari.md`), tutto a scelta
multipla. PASS con i seed 1, 50001 e 777001; errori piantati tutti bocciati; `review.mts` e `width.mts` con codice 0.

Prerequisiti proposti: numero-ossidazione, chim-idruri-idracidi, legame-ionico, chim-formula-chimica
