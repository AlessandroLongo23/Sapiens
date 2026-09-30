# Note: Temperatura e calore

Lezione nuova (biennio di chimica, gruppo 21 "misure", 30 settembre 2026). La fisica ha tre lezioni sullo stesso
argomento (65 la temperatura e le scale, 67 il calore e il calore specifico, 68 l'equilibrio termico): questa le
raccoglie con lo sguardo del chimico (temperatura e agitazione delle particelle, kelvin per i gas, calore specifico per
grammo, il calorimetro per le trasformazioni esotermiche ed endotermiche) e rimanda a loro. Conti rifatti in Python:
esempio 1, $78 + 273 = 351$, $77 - 273 = -196$, differenza $274$ nelle due scale; esempio 2,
$4{,}186 \cdot 200{,}0 \cdot 55{,}0 = 46\,046\,\text{J}$; esempio 3, $5000/244 = 20{,}49$ per l'etanolo e $5000/418{,}6 = 11{,}94$ per l'acqua; esempio 4,
$4{,}186 \cdot 100{,}0 \cdot (-7{,}0) = -2930\,\text{J}$; esempio 5, $14\,000/400 = 35$. `check.mts` passa.

## Struttura

La temperatura (grandezza intensiva, agitazione delle particelle, il termometro e l'equilibrio), le scale Celsius e Kelvin
(zero assoluto, $T = t + 273$, figura delle due scale con le temperature del laboratorio, differenze, esempio 1, avviso
sul $273$, il kelvin nei gas), il calore (energia che passa, joule e calorie, avviso temperatura e calore), calore e
variazione di temperatura ($Q = c \cdot m \cdot \Delta t$, tabella in $\text{J/(g}\cdot{}^\circ\text{C)}$, esempi 2 e 3,
avviso sulle unità), il segno del calore e il calorimetro (esotermica ed endotermica, esempio 4 del ghiaccio istantaneo,
avviso su $\Delta t$), l'equilibrio termico di due masse d'acqua (esempio 5), calore senza variazione di temperatura (i
passaggi di stato, con i link).

## Scelte

- Calore specifico per grammo, $\text{J/(g}\cdot{}^\circ\text{C)}$, perché in laboratorio le masse sono in grammi; la
  lezione dice che è lo stesso valore della fisica diviso per mille. Valori della tabella della lezione di fisica 67
  (Wikipedia, "Table of specific heat capacities", letta dal gruppo 19 il 30 settembre 2026).
- $T = t + 273$ con i dati interi, $273{,}15$ nella definizione, come il README del biennio.
- Temperatura Celsius $t$ e kelvin $T$ come la fisica; nella formula del calore $\Delta t$.
- Il segno del calore come la fisica 67 ($\Delta t$ finale meno iniziale); la parola "esotermica" e "endotermica" è
  introdotta qui per il calorimetro, con il link alla lezione del quarto anno sull'entalpia.
- Esempio 4: $10\,\text{g}$ di nitrato d'ammonio in $100\,\text{g}$ d'acqua raffreddano di circa $7\,^\circ\text{C}$ con
  l'entalpia di soluzione di $+25{,}7\,\text{kJ/mol}$ (valore dei manuali, da verificare); i numeri dell'esempio sono
  realistici ma arrotondati, e la lezione trascura il bicchiere e la massa del sale.
- Il ghiaccio secco "sublima a $-78\,^\circ\text{C}$" è arrotondato ($-78{,}5\,^\circ\text{C}$, da verificare), e $195\,\text{K}$
  è $-78 + 273$.
- La scala Fahrenheit e la taratura del termometro sono solo nel link alla fisica 65.

## Figure

Una TikZ, guardata in chiaro e in scuro: `scale-celsius-kelvin-laboratorio` (Celsius e Kelvin affiancate con acqua che
bolle, ghiaccio che fonde, ghiaccio secco, azoto liquido e zero assoluto). Nessuna interattiva: la fisica ne ha già tre
sullo stesso argomento (`termometro-tre-scale`, `riscaldamento-acqua-olio`, `equilibrio-termico-due-corpi`), e un'altra
qui non aggiungerebbe niente. Si potrebbe usare `riscaldamento-acqua-olio` anche in questa lezione, se Alessandro vuole.

## Esercizi

Generatore `chim-temperatura-calore`, sei livelli (specifica in `specs/exercises/chim-temperatura-calore.md`): Celsius e
kelvin, Differenze di temperatura, Il calore, La temperatura finale, Il calorimetro, L'equilibrio termico. Senza scene.

## Domande per Andrea

- In chimica il calore specifico si dà per grammo, $\text{J/(g}\cdot{}^\circ\text{C)}$ (come qui), o per chilogrammo come
  in fisica?
- Le parole "esotermica" ed "endotermica" vanno introdotte al primo anno con il calorimetro, o si lasciano al quarto?
- $T = t + 273$ o $273{,}15$ negli esercizi del primo anno?
- L'equilibrio termico va anche con sostanze diverse (un metallo nell'acqua), o basta acqua con acqua come qui?
