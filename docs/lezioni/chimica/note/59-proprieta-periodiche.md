# Note: Raggio atomico ed energia di ionizzazione

Lezione nuova (terzo anno di chimica, gruppo D, 6 ottobre 2026), capitolo "Il sistema periodico", terza lezione su
cinque. Non pubblicata. `check.mts` passa su lezione, formulario e flashcard, senza avvisi. Conti rifatti in Python
(`conti.py` nello scratchpad): $495{,}8\,\text{kJ/mol}$ diviso $N_A$ dà $8{,}233 \cdot 10^{-19}\,\text{J}$; rapporti
$1817/578 = 3{,}14$, $2745/1817 = 1{,}51$, $11\,577/2745 = 4{,}22$, differenza $8832$.

## Struttura

La carica nucleare efficace con il modello $Z_{eff} = Z - S$ (figura, esempio 1, due regole, nota sul limite del
modello, avviso); il raggio atomico (definizione, figura in scala, andamenti, tabella del gruppo 1, avviso, esempi 2
e 3, figura interattiva, nota sui gas nobili); il raggio degli ioni (figura, tabella, ioni isoelettronici, esempio 4,
figura interattiva, avviso); l'energia di prima ionizzazione (definizione, esempio 5, grafico dei primi venti
elementi, andamenti, le due eccezioni, avviso, esempio 6); le energie successive (tabella, esempio 7, avviso); lo
schema degli andamenti.

## Scelte

- Confini nel gruppo: la carica nucleare efficace si spiega qui una volta e le lezioni 60 e 61 la richiamano. Qui
  niente affinità, elettronegatività, carattere metallico. Le energie successive sono trattate come proprietà (il
  salto dà gli elettroni di valenza e spiega la carica degli ioni); che dimostrino i livelli è della lezione 50, con
  il link.
- $Z_{eff}$ con il modello più semplice (ogni elettrone interno scherma una carica intera, quelli dello stesso livello
  niente), dichiarato come modello, con i valori di Slater per sodio e cloro ($2{,}2$ e $6{,}1$) in una nota. Il pedice
  è scritto $Z_{eff}$ in corsivo, come $F_{tot}$ in fisica.
- Raggi atomici da `elementi.json`: sono raggi covalenti (legame singolo). Molti libri usano per i metalli il raggio
  metallico (sodio $186\,\text{pm}$) e hanno numeri diversi; l'andamento è lo stesso.
- Simbolo dell'energia di prima ionizzazione: $E_i$. I libri usano anche $EI$ o $E_{ion}$.
- Gruppi 1-18 con la numerazione tradizionale tra parentesi alla prima occorrenza ("gruppo 1 (IA)").

## Dati che in `elementi.json` non ci sono, o che non seguono la regola

- Mancano i raggi ionici: ho usato i raggi di Shannon per sei vicini, arrotondati al picometro ($\mathrm{Li^+}$ $76$,
  $\mathrm{Na^+}$ $102$, $\mathrm{K^+}$ $138$, $\mathrm{Mg^{2+}}$ $72$, $\mathrm{Ca^{2+}}$ $100$, $\mathrm{Al^{3+}}$ $54$,
  $\mathrm{O^{2-}}$ $140$, $\mathrm{S^{2-}}$ $184$, $\mathrm{F^-}$ $133$, $\mathrm{Cl^-}$ $181$, $\mathrm{Br^-}$ $196$),
  scritti a memoria: da verificare (Shannon, 1976).
- Mancano le energie di ionizzazione successive: quelle di sodio, magnesio e alluminio nella lezione, e delle altre
  sette nell'esercizio (litio, berillio, boro, carbonio, silicio, potassio, calcio), sono scritte a memoria da tabelle
  di manuale: da verificare (CRC Handbook o NIST).
- Ossigeno $63\,\text{pm}$ e fluoro $64\,\text{pm}$: il fluoro risulta appena più grande. La lezione lo dice dopo la
  figura interattiva; gli esercizi non confrontano i due.
- Gallio $124\,\text{pm}$, più piccolo dell'alluminio ($126$); germanio e arsenico tutti e due $121$. La lezione non
  disegna il quarto periodo nella figura statica e non ne parla; la figura interattiva non offre il gruppo 13.
- I gas nobili hanno un raggio nel file (neon $67$, più del fluoro): la lezione li tiene fuori dal confronto e dice
  perché.
- "La distanza tra i nuclei in $\mathrm{Cl_2}$ è circa $198\,\text{pm}$": scelto per dare $99$; il valore misurato è
  vicino a $199$. Da verificare.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `raggio-carica-nucleare-efficace`, `raggio-atomico-periodi-gruppi`,
`raggio-ionico-atomo-ione`, `ionizzazione-prima-energia-grafico`, `raggio-ionizzazione-andamenti-tavola`.

Due interattive, guardate in chiaro, in scuro e a 390 px, ai valori iniziali e dopo aver mosso i comandi, senza
errori in console e senza scorrimento laterale:

- `raggio-ionizzazione-andamenti` (`RaggioIonizzazioneAndamenti.tsx`, con il modulo comune
  `chim3-D-andamenti.tsx`): colonne del raggio o dell'energia di ionizzazione lungo un periodo (2, 3, 4) o un gruppo
  a scelta; un tocco su un elemento dà valore, $Z_{eff}$ e livello esterno; la didascalia nomina i passi che vanno
  contro l'andamento.
- `raggio-atomo-ione-confronto` (`RaggioAtomoIone.tsx`): l'atomo e il suo ione in scala per undici elementi, con
  protoni ed elettroni.

Il sito in sviluppo di Sapiens risponde sulla porta 3111, non sulla 3000 (lì c'è un altro progetto): gli screenshot
sono fatti con `--porta 3111`.

## Esercizio guidato

L'esempio 7 (il gruppo dalle energie successive). Tre fermate: calcolare le differenze tra energie consecutive;
trovare il salto più grande; passare dal numero di elettroni tolti prima del salto al gruppo.

## Esercizi

Generatore `proprieta-periodiche`, sei livelli (specifica in `specs/exercises/proprieta-periodiche.md`). Livelli 1 e 6
con risposta numerica, proposti anche a risposta aperta.

## Dubbi per Andrea

- La carica nucleare efficace calcolata come $Z$ meno gli elettroni interni va bene per una terza, o preferisci
  darla solo a parole?
- Raggi covalenti (quelli della tavola del sito) o raggi metallici per i metalli, come fanno molti libri? Con i
  covalenti il sodio è $155\,\text{pm}$, non $186$.
- Le due eccezioni dell'energia di ionizzazione sono spiegate con il sottolivello $p$ più alto in energia e con la
  repulsione tra due elettroni nello stesso orbitale: è il livello giusto?
- $E_i$ come simbolo va bene?
- Le energie successive stanno sia qui sia nella lezione 50: va bene la divisione (là come prova dei livelli, qui
  come proprietà periodica)?

Prerequisiti proposti: chim-configurazione-elettronica, gruppi-periodi, chim-simboli-lewis, chim-atomi-molecole-ioni
