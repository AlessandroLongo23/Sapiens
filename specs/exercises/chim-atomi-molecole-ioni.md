# Atomi, molecole e ioni

Generatore: `chim-atomi-molecole-ioni` (`src/lib/exercises/v2/generators/chim-atomi-molecole-ioni.ts`, con
`src/lib/exercises/v2/chim-trasformazioni.ts`). Verifica indipendente:
`scripts/exercises/checkers/chim_atomi_molecole_ioni.py` (con `_chim_trasformazioni.py`). Lezione collegata:
`docs/lezioni/chimica/riscritte/27-chim-atomi-molecole-ioni.md`. Percorso nel database:
`high_school/chemistry/chim-trasformazioni-chimiche/chim-atomi-molecole-ioni`.

Cinque livelli, tutti a scelta multipla su particelle e sostanze prese dalle tabelle della lezione: è una lezione
descrittiva, e le situazioni variano con la particella, non con i numeri.

## Nomi dei livelli

1. Atomo, molecola o ione
2. Dall'atomo allo ione
3. Gli elettroni di uno ione
4. Il nome dello ione
5. Di che particelle è fatta

## Livello 1: atomo, molecola o ione

"Che cos'è la particella $\mathrm{H_2O_2}$?" Quattro opzioni fisse: un atomo, una molecola di un elemento, una
molecola di un composto, uno ione; la risposta si sceglie con la stessa probabilità, poi la particella tra dieci o
tredici di quel tipo ($\mathrm{He}$, $\mathrm{Fe}$...; $\mathrm{O_3}$, $\mathrm{P_4}$, $\mathrm{S_8}$...; $\mathrm{NH_3}$,
$\mathrm{HCl}$...; $\mathrm{Na^+}$, $\mathrm{SO_4^{2-}}$...).

- $\mathrm{H_2O_2}$: una molecola di un composto.
- $\mathrm{OH^-}$: uno ione.

## Livello 2: dall'atomo allo ione

"Un atomo di zolfo acquista 2 elettroni. Che ione si forma?" Metalli che perdono da 1 a 3 elettroni (sodio, potassio,
magnesio, calcio, alluminio), non metalli che ne acquistano da 1 a 3 (fluoro, cloro, bromo, iodio, ossigeno, zolfo,
azoto). Distrattori dagli errori della lezione: il segno rovesciato ($\mathrm{S^{2+}}$), la carica scritta come indice
($\mathrm{S_2}$), un elettrone di troppo ($\mathrm{S^{3-}}$), il segno rovesciato con un elettrone di troppo.

- Risposta $\mathrm{S^{2-}}$; distrattori $\mathrm{S^{3-}}$, $\mathrm{S^{2+}}$, $\mathrm{S_2}$.
- "Un atomo di bromo acquista un elettrone." Risposta $\mathrm{Br^-}$.

## Livello 3: gli elettroni di uno ione

"L'atomo da cui viene lo ione $\mathrm{O^{2-}}$ ha perso o acquistato elettroni? Quanti?" Gli ioni di un atomo della
tabella della lezione, compresi $\mathrm{Fe^{2+}}$ e $\mathrm{Fe^{3+}}$. Opzioni: perso o acquistato, per il numero
giusto e per un numero vicino (2 al posto di 1, $n - 1$ negli altri casi).

- Risposta "Ha acquistato 2 elettroni"; distrattori "Ha perso 2 elettroni", "Ha acquistato un elettrone", "Ha perso un
  elettrone".
- $\mathrm{Cl^-}$: "Ha acquistato un elettrone".

## Livello 4: il nome dello ione

"Come si chiama lo ione $\mathrm{HCO_3^-}$?" Venti ioni delle due tabelle della lezione. Distrattori prima dagli errori
vicini (l'anione chiamato come l'elemento, "ione cloro"; il catione con la desinenza *-uro*; nomi che si confondono:
solfuro e solfato, nitruro e nitrato, ossido e idrossido, carbonato e idrogenocarbonato), poi altri nomi della tabella.

- Risposta "ione idrogenocarbonato"; distrattori "ione carbonio", "ione carbonato", "ione fosfato".
- $\mathrm{NH_4^+}$: "ione ammonio"; distrattori "ione ammoniaca", "ione azoto", "ione idrogeno".

## Livello 5: di che particelle è fatta

"Di che particelle è fatta la sostanza $\mathrm{KNO_3}$, nitrato di potassio?" Quattro opzioni fisse: atomi isolati
(gas nobili), atomi impacchettati di un metallo, molecole, ioni; la risposta con la stessa probabilità, poi una delle
sostanze di quel tipo (tre gas nobili, cinque metalli, dieci sostanze molecolari, nove composti ionici, tra cui il
cloruro di ammonio, ionico senza metalli).

- $\mathrm{KNO_3}$: ioni. $\mathrm{Br_2}$: molecole.

## Esercizi da evitare

- Particelle ambigue (niente $\mathrm{H}$ da solo, che può essere un atomo o far pensare allo ione; niente ossidi
  come $\mathrm{SiO_2}$, covalenti ma non molecolari).
- Nomi inventati che siano nomi veri di altri ioni fuori dalla lezione.

## Verifica

Il controllo classifica da sé: una carica fa uno ione; un simbolo solo, un atomo; più atomi dello stesso elemento,
una molecola di un elemento; elementi diversi, una molecola di un composto. Lo ione di un atomo ha la carica degli
elettroni persi (positiva) o acquistati (negativa), e i metalli perdono. I nomi vengono da una tabella propria (cationi
con il nome dell'elemento, anioni di un atomo con la desinenza della lezione, ioni poliatomici). Le sostanze: gas
nobile, metallo da solo, un metallo o lo ione ammonio insieme ad altri elementi (ioni), il resto molecole.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0.

### Errori piantati

Su 60 esercizi (seed da 300): indice dell'opzione giusta, opzione doppia, testo dell'opzione giusta, parole vietate
bocciati 60 su 60. Una cifra del testo aumentata di uno: bocciati 12 su 23; gli altri 11 cambiano un indice senza
cambiare la risposta ($\mathrm{O_2}$ che diventa $\mathrm{O_3}$ resta una molecola di un elemento), quindi non sono
errori.

### Esercizi diversi su 1.000

Seed da 1: livello 1 634, livello 2 281, livello 3 321, livello 4 960, livello 5 473. I livelli 2 e 3 hanno pochi casi
(12 e 14 ioni, con le opzioni in ordine diverso): è il limite di una lezione descrittiva.
