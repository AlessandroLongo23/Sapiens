# Note: Ossidi basici e ossidi acidi

Lezione nuova (6 ottobre 2026), terzo anno, capitolo "Classificazione e nomenclatura dei composti", seconda di sette. Gruppo I del lotto. `check.mts` passa senza avvisi su lezione, formulario e flashcard.

## Struttura

Che cos'è un ossido e la formula dal n.o.; lo schema metallo, ossido basico, idrossido e non metallo, anidride, ossiacido; gli ossidi basici con tabella dei tre nomi e due esempi (formula verso nome, nome verso formula); le anidridi con tabella e due esempi; il passaggio dal carattere basico a quello acido lungo il terzo periodo, gli anfoteri, cromo e manganese ad alto n.o., gli ossidi che non sono anidridi; la figura interattiva; i perossidi con un esempio.

## Scelte e confini

- Le tre nomenclature sono spiegate nella 76: qui c'è solo come si applicano agli ossidi. Idrossidi e ossiacidi compaiono come nomi nello schema, con il link.
- Reazioni solo come schema, senza coefficienti, come chiede il brief. $\mathrm{CaO}$, $\mathrm{CO_2}$ e i loro prodotti con l'acqua sono scritti nella figura come formule nei riquadri, non come equazione.
- Nome di Stock delle anidridi: "ossido di zolfo(VI)", con la parola "ossido" anche per i non metalli. Per boro e silicio, che in tabella hanno un solo n.o., senza numero romano ("ossido di silicio").
- Alogeni: i quattro nomi seguono il n.o. ($+1$, $+3$, $+5$, $+7$) anche per bromo e iodio, che non hanno tutte e quattro le anidridi; detto in una frase.
- Anidridi del fosforo con le formule minime $\mathrm{P_2O_3}$ e $\mathrm{P_2O_5}$; una nota dice che le molecole sono $\mathrm{P_4O_6}$ e $\mathrm{P_4O_{10}}$.
- Cromo e manganese: $+2$ e $+3$ come ossidi basici (cromoso, cromico; manganoso, manganico), $\mathrm{MnO_2}$ "biossido di manganese", $\mathrm{CrO_3}$ anidride cromica, $\mathrm{Mn_2O_7}$ anidride permanganica. L'anidride manganica ($+6$) non è nella lezione, e l'elenco "+7 e +5" dei video di Atzeni è tra gli errori segnalati in `confronto-atzeni.md`.
- $\mathrm{CO}$, $\mathrm{NO}$ e $\mathrm{N_2O}$ in una nota, come ossidi che non sono anidridi; $\mathrm{NO_2}$ non è nominato.
- Perossidi in breve: definizione dal n.o., tre esempi, la formula non semplificata e come si distinguono da un ossido con il conto ($\mathrm{BaO_2}$ contro $\mathrm{PbO_2}$).

## Dubbi per Andrea

1. $\mathrm{MnO_2}$: "biossido di manganese" come nome tradizionale va bene? E lo teniamo in tabella, visto che non è né -oso né -ico?
2. Ossidi di cromo e manganese: li vuoi nella lezione (ora sono in una tabella a parte, sotto "Dal carattere basico al carattere acido") o sono troppo per il terzo anno?
3. Anidridi del bromo e dello iodio: va bene dire "si comportano come il cloro" e dare i nomi dal n.o., senza la loro tabella?
4. Stock per le anidridi: "ossido di zolfo(VI)" è la forma che usi? Alcuni libri non danno il nome di Stock per i non metalli.
5. Ossidi anfoteri: bastano $\mathrm{Al_2O_3}$ e $\mathrm{ZnO}$ in due righe?

## Da verificare

- La calce viva fonde "a circa $2600\,^\circ\text{C}$": scritto a memoria.
- "Alcune anidridi, come la clorosa e la clorica, sono così instabili che non si conservano": scritto a memoria; per l'anidride clorica non sono sicuro che sia mai stata isolata.
- $\mathrm{N_2O}$ "gas esilarante"; l'acqua ossigenata "dei disinfettanti".
- Formano perossidi "soprattutto l'idrogeno e i metalli dei gruppi 1 e 2".

## Figure

Tre TikZ, guardate in chiaro e in scuro: `ossidi-da-metalli-e-non-metalli`, `ossidi-terzo-periodo-carattere`, `ossidi-acqua-e-acqua-ossigenata`. I colori dei riquadri si invertono nel tema scuro, ma ogni gruppo ha la sua scritta (basici, anfotero, acidi).

Una interattiva, `ossidi-costruisci-formula-nomi` (`OssidiCostruisci.tsx`): sedici elementi tra metalli e non metalli, e per ciascuno i suoi n.o.; la figura fa l'incrocio, disegna gli atomi dell'unità formula, e sotto dà la formula, la semplificazione quando c'è, il tipo di ossido e i tre nomi. I nomi vengono da `src/lib/exercises/v2/chim3-i.ts`, lo stesso modulo degli esercizi.

Nessun blocco `grafico`.

## Esercizio guidato

L'esempio 3 ($\mathrm{N_2O_5}$, dalla formula ai tre nomi). Si fermerebbe in tre punti: il n.o. dell'azoto, con il $2x$; se $+5$ è il più basso o il più alto dei n.o. dell'azoto nelle anidridi, e quindi il suffisso; il nome IUPAC letto sugli indici.

Prerequisiti proposti: numero-ossidazione, chim-metalli-non-metalli, legame-ionico, chim-acqua-acidi-basi
