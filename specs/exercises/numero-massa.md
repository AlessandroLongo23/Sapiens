# Numero atomico, numero di massa e isotopi

Generatore: `numero-massa` (`src/lib/exercises/v2/generators/numero-massa.ts`, con `src/lib/exercises/v2/chim-atomo.ts`).
Verifica indipendente: `scripts/exercises/checkers/numero_massa.py`. Lezione collegata:
`docs/lezioni/chimica/riscritte/42-numero-massa.md`. Percorso nel database:
`high_school/chemistry/atomo-struttura/numero-massa`.

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Le particelle dell'atomo
2. Il simbolo
3. Gli ioni
4. Gli isotopi
5. La massa atomica media
6. L'abbondanza di un isotopo

## Dati e tipi di risposta

Scelta multipla, quattro opzioni. Gli atomi dei livelli 1-4 sono nuclidi veri: gli isotopi stabili dei primi 36
elementi, più il trizio e il carbonio-14 (IUPAC, "Isotopic compositions of the elements", 2021; da verificare sulla
tabella IUPAC l'elenco degli stabili). Simbolo completo come nella lezione, ${}^{23}_{11}\mathrm{Na}$, carica in alto a
destra, ${}^{24}_{12}\mathrm{Mg^{2+}}$. Livelli 5 e 6: metà elementi veri con i dati IUPAC 2021 arrotondati come nella
lezione (masse al centesimo di $\text{u}$, abbondanze al centesimo di punto percentuale), metà un elemento $\mathrm{X}$
inventato con due isotopi a una o due unità di distanza, masse poco sotto il numero di massa, abbondanze dal $10$ al
$90\%$. Massa atomica al centesimo di $\text{u}$, abbondanza al decimo di punto percentuale; mai a meno di $10^{-6}$ da
un confine di arrotondamento.

## Livello 1: le particelle dell'atomo

Un atomo neutro (da $Z = 2$), un terzo delle volte i protoni, un terzo i neutroni, un terzo gli elettroni. Distrattori:
per i neutroni $A$, $A + Z$, $Z$; per protoni ed elettroni $A - Z$, $A$, $Z \pm 1$.

- "Quanti neutroni ha l'atomo neutro ${}^{56}_{26}\mathrm{Fe}$?" Risposta $30$; distrattori $56$, $82$, $26$.
- "Quanti elettroni ha l'atomo neutro ${}^{64}_{28}\mathrm{Ni}$?" Risposta $28$.

## Livello 2: il simbolo

Protoni, neutroni ed elettroni di un atomo neutro vero (da $Z = 3$, con $N \ne Z$); si sceglie il simbolo. Distrattori:
$A$ e $Z$ scambiati, i neutroni scritti come $A$, i neutroni presi come $Z$ (un altro elemento), $A + Z$ come numero di
massa.

- "$26$ protoni, $28$ neutroni e $26$ elettroni" Risposta ${}^{54}_{26}\mathrm{Fe}$; distrattori
  ${}^{28}_{26}\mathrm{Fe}$, ${}^{26}_{54}\mathrm{Fe}$, ${}^{54}_{28}\mathrm{Ni}$.

## Livello 3: gli ioni

Diciotto ioni comuni ($\mathrm{Li^+}$, $\mathrm{Na^+}$, $\mathrm{K^+}$, $\mathrm{Mg^{2+}}$, $\mathrm{Ca^{2+}}$,
$\mathrm{Al^{3+}}$, $\mathrm{Fe^{2+}}$, $\mathrm{Fe^{3+}}$, $\mathrm{Cu^{2+}}$, $\mathrm{Zn^{2+}}$, $\mathrm{F^-}$,
$\mathrm{Cl^-}$ con $A = 35$ e $37$, $\mathrm{Br^-}$, $\mathrm{O^{2-}}$, $\mathrm{S^{2-}}$, $\mathrm{N^{3-}}$,
$\mathrm{Se^{2-}}$). Metà gli elettroni, un quarto i protoni, un quarto i neutroni. Distrattori: la carica sommata agli
elettroni di un catione (o tolta a quelli di un anione), il numero atomico, i neutroni; per i protoni gli elettroni.

- "Quanti elettroni ha lo ione ${}^{64}_{30}\mathrm{Zn^{2+}}$?" Risposta $28$; distrattori $32$, $30$, $34$.
- "Quanti neutroni ha lo ione ${}^{37}_{17}\mathrm{Cl^-}$?" Risposta $20$.

## Livello 4: gli isotopi

Un nuclide vero di un elemento con almeno due isotopi; la risposta è un altro isotopo vero dello stesso elemento. Le
altre opzioni hanno un altro numero atomico: un nuclide con lo stesso $A$ (se esiste), uno con lo stesso numero di
neutroni, un isotopo di un elemento vicino.

- "Quale di questi atomi è un isotopo di ${}^{65}_{29}\mathrm{Cu}$?" Risposta ${}^{63}_{29}\mathrm{Cu}$; distrattori
  ${}^{65}_{30}\mathrm{Zn}$ (stesso $A$), ${}^{64}_{28}\mathrm{Ni}$ (stessi neutroni), ${}^{64}_{30}\mathrm{Zn}$.

## Livello 5: la massa atomica media

Elementi veri: litio, boro, cloro, rame, gallio, bromo, rubidio, argento, antimonio, europio, tallio (due isotopi),
magnesio, silicio, neon (tre isotopi). Distrattori: la media semplice, le abbondanze scambiate (con due isotopi), i
numeri di massa al posto delle masse, la divisione per $100$ dimenticata.

- "Il cloro ha due isotopi: cloro-35 ($34{,}97\,\text{u}$, $75{,}76\,\%$) e cloro-37 ($36{,}97\,\text{u}$,
  $24{,}24\,\%$)." Risposta $35{,}45\,\text{u}$.
- "Un elemento $\mathrm{X}$ ha due isotopi: $\mathrm{X}$-20 ($19{,}98\,\text{u}$, $15{,}60\,\%$) e $\mathrm{X}$-22
  ($21{,}95\,\text{u}$, $84{,}40\,\%$)." Risposta $21{,}64\,\text{u}$; distrattori $20{,}29$ (media semplice), $21{,}69$
  (numeri di massa), $2164{,}27\,\text{u}$.

## Livello 6: l'abbondanza di un isotopo

Due isotopi con le loro masse e la massa atomica dell'elemento (per gli elementi veri quella della tavola); si chiede
l'abbondanza di uno dei due, $x = (m_b - M)/(m_b - m_a)$. Distrattori: l'abbondanza dell'altro isotopo, i numeri di
massa al posto delle masse, $50\%$, la differenza non divisa, metà del risultato.

- "Il cloro ha due isotopi, cloro-35 ($34{,}97\,\text{u}$) e cloro-37 ($36{,}97\,\text{u}$), e la sua massa atomica è
  $35{,}45$. Quanto è abbondante il cloro-35?" Risposta $76{,}0\,\%$.
- "Il gallio ... gallio-69 ($68{,}93\,\text{u}$) e gallio-71 ($70{,}92\,\text{u}$) ... $69{,}72$. Quanto è abbondante il
  gallio-69?" Risposta $60{,}3\,\%$.

## Esercizi da evitare

- Nuclidi inventati nei livelli 1-4: tutti gli atomi del testo e l'isotopo giusto sono veri.
- Abbondanze fuori da $0$-$100\%$ tra le opzioni.

## Verifica

`numero_massa.py` legge i simboli, controlla che simbolo e $Z$ corrispondano e che i nuclidi siano veri (con un elenco
suo degli isotopi stabili), ricalcola le particelle, controlla i dati degli elementi veri con una tabella sua
(IUPAC 2021) e ricalcola medie e abbondanze con i razionali esatti di SymPy.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 86 px su 252).

### Errori piantati

Su 72 esercizi (seed da 300): indice dell'opzione giusta, opzione doppia, testo dell'opzione giusta, parole vietate
bocciati 72 su 72; un numero del testo cambiato bocciato 36 su 36.
