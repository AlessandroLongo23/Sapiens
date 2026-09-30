# Soluzioni acide e basiche: una prima idea del pH

Generatore: `chim-acqua-acidi-basi` (`src/lib/exercises/v2/generators/chim-acqua-acidi-basi.ts`, con
`src/lib/exercises/v2/chim-acqua.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_acqua_acidi_basi.py` (con
`_chim_acqua.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/47-chim-acqua-acidi-basi.md`. Percorso nel
database: `high_school/chemistry/chim-acqua/chim-acqua-acidi-basi`.

Sei livelli, ognuno con una difficoltà in più. Niente logaritmi: il pH si usa come la lezione, con il fattore $10$ per
unità.

## Nomi dei livelli

1. Che cosa dice la prova
2. Acidi e basi secondo Arrhenius
3. La scala del pH
4. Dieci volte per unità
5. La diluizione
6. Gli indicatori

## Tipi di risposta

Scelta multipla, quattro opzioni di testo (con le formule dentro): verdetti, ragioni, valori di pH ("pH $3{,}7$"),
fattori ("$100$ volte"), colori. pH con un decimale ai livelli 3 e 4, interi ai livelli 5 e 6 (indicatore universale).

## Livello 1: che cosa dice la prova

Dieci prove della lezione su una soluzione sconosciuta: tornasole rosso o blu, zinco con idrogeno, marmo con
effervescenza, fenolftaleina rosa o incolore, indicatore universale verde, viola o rosso, conducibilità. Opzioni fisse:
acida, basica, neutra, "non si può dire con questa sola prova" (la risposta per la fenolftaleina incolore e per la
corrente).

## Livello 2: acidi e basi secondo Arrhenius

Un terzo acidi (cloridrico, nitrico, solforico, acetico), un terzo basi (idrossido di sodio, di potassio, di calcio,
ammoniaca), un terzo sostanze neutre (cloruro di sodio, nitrato di potassio, glucosio, etanolo). Opzioni fisse: "acida:
libera ioni $\mathrm{H^+}$", "basica: libera ioni $\mathrm{OH^-}$", "neutra: non libera né $\mathrm{H^+}$ né
$\mathrm{OH^-}$", "basica: libera ioni $\mathrm{H^+}$". L'etanolo è la trappola del gruppo $\mathrm{OH}$.

## Livello 3: la scala del pH

Quattro soluzioni a $25\,^\circ\text{C}$, pH da $0{,}5$ a $13{,}5$ con un decimale, un quarto dei casi ciascuno: la più
acida (deve essere acida), la più basica (deve essere basica), la sola acida, la sola basica (le altre dall'altra parte
del $7$, a volte una a pH $7{,}0$). Nella più acida e nella più basica i due valori estremi distano almeno $0{,}3$.

## Livello 4: dieci volte per unità

Due pH dalla stessa parte del $7$, interi o con $,5$, a distanza intera da $1$ a $4$; metà chiede "quante volte più
ioni $\mathrm{H^+}$" (coppia acida), metà "quante volte meno" (coppia basica). Risposta $10^\Delta$. Distrattori: la
differenza $\Delta$, $10\,\Delta$, $10^{\Delta+1}$, il rapporto dei due pH, $2^\Delta$ (mai "1 volte").

- "Quante volte più ioni $\mathrm{H^+}$ in una soluzione a pH $2{,}5$ che in una a pH $4{,}5$?" Risposta $100$ volte;
  distrattori $2$, $20$, $1000$ volte.

## Livello 5: la diluizione

Acido cloridrico (pH $1$-$4$) o idrossido di sodio (pH $10$-$13$), diluiti $10$ o $100$ volte con volumi dati
($10\,\text{mL}$ fino a $1{,}0\,\text{L}$ e simili): il pH sale o scende di $1$ o $2$ unità, senza arrivare a $7$.
Distrattori: il verso sbagliato, il pH che non cambia, $7$, il doppio della variazione.

- "Si prendono $25\,\text{mL}$ di acido cloridrico a pH $1$ e si aggiunge acqua fino a $250\,\text{mL}$." Risposta pH
  $2$; distrattori pH $0$, $1$, $7$.

## Livello 6: gli indicatori

Tornasole a pH $0{,}5$-$3{,}5$ (rosso) o $9{,}5$-$13{,}5$ (blu); fenolftaleina a pH $0{,}5$-$7{,}5$ (incolore) o
$10{,}5$-$13{,}5$ (rosa acceso); indicatore universale a pH intero, con le bande della lezione (rosso $0$-$2$, arancione
$3$-$4$, giallo $5$-$6$, verde $7$, blu $8$-$10$, viola $11$-$14$). Lontano dai viraggi, perché la lezione non dà i colori
intermedi.

## Verifica

`chim_acqua_acidi_basi.py` classifica prove e sostanze con regole proprie (le formule che cominciano con H o finiscono
con COOH sono acidi, gli idrossidi e l'ammoniaca basi) e una tabella nome-formula; rilegge pH, volumi e fattori dalle
opzioni e ricalcola.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS. `review.mts` e `width.mts` con
codice 0 (opzioni al più 210 px su 252).

### Errori piantati

Su 72 esercizi (seed da 300): indice, opzione doppia, testo dell'opzione giusta, parole vietate bocciati 72 su 72; un
dato aumentato di uno bocciato 53 su 53.

### Esercizi diversi su 1.000

Seed da 1: livello 1 10, livello 2 12, livello 3 999, livello 4 59, livello 5 56, livello 6 540.

## Domande per la revisione

- I colori dell'indicatore universale cambiano da una marca all'altra: le bande della lezione vanno bene?
- La regola della diluizione ("dieci volte, un'unità") va data al biennio, o è meglio lasciarla al quarto anno?
