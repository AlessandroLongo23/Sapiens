# Note: Energia di legame e regola dell'ottetto

Lezione nuova (6 ottobre 2026), prima del capitolo "I legami chimici" del terzo anno, gruppo E del lotto. Non
pubblicata. `check.mts` passa senza avvisi su lezione, formulario e flashcard.

## Struttura e confini

Perché gli atomi si legano (energia e stabilità); la curva dell'energia tra due atomi di idrogeno, letta in quattro
passi; lunghezza ed energia di legame, con una tabella di nove legami e tre esempi; rompere assorbe e formare cede,
con il bilancio di $\mathrm{H_2} + \mathrm{Cl_2}$; i gas nobili; la regola dell'ottetto con le tre strade; i limiti.

- Confine con la 58 (simboli di Lewis, ioni dei gruppi principali): qui gli ioni compaiono solo come una delle tre
  strade verso l'ottetto, con due esempi, e per l'elenco gruppo per gruppo c'è il link alla 58.
- Confine con la 63: il legame covalente è nominato come terza strada, con il $\mathrm{Cl_2}$ nella figura; coppie di
  legame, coppie solitarie e legami multipli sono tutti nella 63.
- Confine con la 65: del legame ionico c'è una riga e il link.
- La tabella dei legami ha solo molecole biatomiche con legame singolo; $\mathrm{O{=}O}$ e $\mathrm{N{\equiv}N}$
  arrivano nella 63, dove il legame multiplo è spiegato.
- Il bilancio di energia di una reazione (esempio 4) anticipa l'entalpia del quarto anno. È nella lezione perché è
  l'uso più comune delle energie di legame e perché smonta l'idea che "rompere i legami libera energia". La parola
  entalpia non compare.
- Eccezioni all'ottetto: elencate in cinque righe, senza formule di Lewis, che sono della 67.

## Scelte

- L'energia di legame è positiva ($436\,\text{kJ/mol}$), l'energia della molecola rispetto agli atomi separati è
  negativa ($-436\,\text{kJ/mol}$): la lezione usa tutti e due i numeri e dice che il primo è la profondità della
  buca.
- La curva disegnata è una curva di Morse con il minimo di $\mathrm{H_2}$ ($74\,\text{pm}$, $436\,\text{kJ/mol}$) e
  la larghezza della curva vera ($a = 0{,}0194\,\text{pm}^{-1}$): la forma è giusta, i soli valori misurati sono
  quelli del minimo. Nel testo la curva non ha altri numeri.
- "Il legame non è un bastoncino rigido: i nuclei oscillano come se ci fosse una molla": una frase sola, senza
  l'energia di punto zero.
- Lo schema a cerchi della seconda figura interattiva è uno schema dei livelli ($2$, $8$, $8$, $2$) e non orbite: la
  lezione lo dice nella frase che presenta la figura. La 52 insiste che l'orbitale non è un'orbita, e questa figura
  non deve sembrare una smentita.
- Regola del duetto per l'idrogeno, nominata così.

## Dati e cose da verificare

- Energie e lunghezze di legame: scritte a memoria dai valori delle tabelle di chimica generale (per le biatomiche
  coincidono, entro pochi kJ/mol, con il CRC Handbook of Chemistry and Physics). Da verificare una per una sul libro
  adottato: $\mathrm{H{-}H}$ $74$ e $436$; $\mathrm{F{-}F}$ $141$ e $159$; $\mathrm{Cl{-}Cl}$ $199$ e $243$;
  $\mathrm{Br{-}Br}$ $228$ e $193$; $\mathrm{I{-}I}$ $267$ e $151$; $\mathrm{H{-}F}$ $92$ e $567$; $\mathrm{H{-}Cl}$
  $127$ e $431$; $\mathrm{H{-}Br}$ $141$ e $366$; $\mathrm{H{-}I}$ $161$ e $298$. I libri differiscono di qualche
  unità ($\mathrm{H{-}F}$ da $565$ a $570$, $\mathrm{Cl{-}Cl}$ $242$ o $243$). Gli stessi numeri sono nel generatore
  di esercizi e nel suo controllo: se cambiano, vanno cambiati in `chim3-e.ts` e in `_chim3_e.py`.
- Il bilancio dell'esempio 4 dà $183\,\text{kJ}$; il valore sperimentale per due moli di $\mathrm{HCl}$ è circa
  $185\,\text{kJ}$ (da verificare).
- Energie di ionizzazione del neon ($2081\,\text{kJ/mol}$) e del sodio ($496\,\text{kJ/mol}$) e configurazioni dei
  gas nobili: da `src/lib/tools/elementi.json`, controllate con lo script.
- "Idea proposta nel 1916 da Gilbert Lewis e da Walther Kossel": data e nomi a memoria, da verificare.
- "Con poche eccezioni ottenute in laboratorio per i più pesanti": i composti dello xeno (dal 1962, Neil Bartlett,
  da verificare); la data non è nella lezione.
- $\mathrm{PCl_5}$ con dieci elettroni e $\mathrm{SF_6}$ con dodici intorno all'atomo centrale: è il conto di Lewis
  dei libri di scuola.

## Figure

Due TikZ, guardate in chiaro e in scuro: `energia-legame-curva-idrogeno` (la curva con minimo, lunghezza ed energia
di legame) e `ottetto-tre-strade` (sodio che cede, cloro che acquista, due clori che mettono in comune, con i simboli
di Lewis).

Due interattive:

| Nome | File | Che cosa fa |
|---|---|---|
| `energia-legame-curva-distanza` | `EnergiaLegameCurva.tsx` | due atomi di idrogeno a una distanza scelta con un cursore ($30$-$300\,\text{pm}$); il punto si muove sulla curva, si leggono distanza, energia e se gli atomi si attraggono o si respingono; un bottone li lascia liberi e li porta nel minimo |
| `ottetto-elettroni-gas-nobile` | `OttettoElettroni.tsx` | un atomo tra dodici (Li, C, N, O, F, Na, Mg, Al, S, Cl, K, Ca) con gli elettroni livello per livello; si tolgono o si aggiungono elettroni e la figura dice quando il livello esterno è completo e come quale gas nobile |

Guardate in chiaro, in scuro e a 390 px, ai valori iniziali e dopo un clic, senza scorrimento laterale. Il server di
sviluppo sulla porta 3000 era di un altro progetto: gli screenshot sono stati fatti su quello di Sapiens già acceso
sulle porte 3111 e poi 3131.

## Esercizio guidato

L'esempio 4 (idrogeno e cloro): si fermerebbe in tre punti. Quali legami si rompono e quanti (una mole di
$\mathrm{H{-}H}$, una di $\mathrm{Cl{-}Cl}$); quanti legami si formano (due moli di $\mathrm{H{-}Cl}$, il $2$ che si
dimentica); il confronto finale, cede o assorbe.

## Esercizi

Generatore `chim-regola-ottetto`, sei livelli (specifica in `specs/exercises/chim-regola-ottetto.md`): fatti; lettura
della tabella; energia per un campione; bilancio di $\mathrm{H_2} + \mathrm{X_2}$; elettroni per l'ottetto (numero
intero, anche a risposta aperta); ione e gas nobile. Controllo `scripts/exercises/checkers/chim_regola_ottetto.py`:
PASS su 1000 esercizi per livello con i seed 1, 50001 e 777001; errori piantati tutti bocciati; `review.mts` e
`width.mts` con codice 0. Non collegato al sito.

## Dubbi per Andrea

- Il bilancio di energia con le energie di legame (esempio 4 e livello 4 degli esercizi) va in questa lezione, o si
  rimanda tutto all'entalpia del quarto anno?
- La curva dell'energia per $\mathrm{H_2}$: va bene presentarla con i numeri del minimo e senza formula, o al terzo
  anno è troppo?
- Lo schema a cerchi dei livelli nella figura dell'ottetto: accettabile dopo la lezione sugli orbitali, o confonde?
- Le energie di legame: quale tabella si prende come riferimento (libro adottato)?
- Tra i limiti della regola sono nominati $\mathrm{BF_3}$, $\mathrm{PCl_5}$, $\mathrm{SF_6}$, $\mathrm{NO}$ e gli
  ioni del ferro: troppi per una lezione che introduce la regola?

Prerequisiti proposti: `chim-simboli-lewis`, `chim-configurazione-elettronica`, `proprieta-periodiche`, `mole-massa-molare`
