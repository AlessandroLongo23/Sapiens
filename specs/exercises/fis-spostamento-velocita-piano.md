# Spostamento e velocità nel piano

Generatore: `fis-spostamento-velocita-piano` (`src/lib/exercises/v2/generators/fis-spostamento-velocita-piano.ts`, con
`src/lib/exercises/v2/fis-moti-piano.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_spostamento_velocita_piano.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/45-fis-spostamento-velocita-piano.md`. Percorso nel database:
`high_school/physics/fis-moti-piano/fis-spostamento-velocita-piano`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Lo spostamento dalle coordinate
2. La velocità media
3. Velocità media e velocità scalare media
4. Le componenti della velocità
5. Lo spostamento in un intervallo

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni, tutte con l'unità ($53\,\text{m}$, $6{,}1\,\text{m/s}$). I dati hanno due cifre
significative senza zeri ambigui (da $1{,}1$ a $9{,}9$, da $11$ a $99$, mai $20$ o $350$); le coordinate del livello 1
sono metri interi. Risultati a due cifre significative, mai a meno di $10^{-6}$ da un confine di arrotondamento e mai da
$100$ in su. Nei passaggi i valori intermedi si scrivono con quattro cifre e i puntini.

## Regole comuni

- Formule della lezione: $\Delta x = x_B - x_A$, $\Delta y = y_B - y_A$, $\Delta s = \sqrt{(\Delta x)^2 + (\Delta y)^2}$;
  $v_m = \Delta s / \Delta t$; velocità scalare media $d/\Delta t$ con $d$ la distanza percorsa; $v_x = v\cos\alpha$,
  $v_y = v\sin\alpha$; con velocità costante $\Delta x = v_x\,\Delta t$.
- Scena `vettori-piano` (quella dei vettori del primo anno): i punti, i tratti o la velocità del testo, mai la risposta.
  La soluzione aggiunge lo spostamento (arancione, $\Delta\vec{s}$) o la componente cercata, tratteggiata.

## Livello 1: lo spostamento dalle coordinate

Coordinate intere da $11$ a $60\,\text{m}$ in valore assoluto, non multiple di $10$, con il segno; componenti dello
spostamento di almeno $5\,\text{m}$.

- "Un pallone passa dal punto $A = (16\,\text{m};\ -21\,\text{m})$ al punto $B = (52\,\text{m};\ 18\,\text{m})$. Quanto
  vale il modulo dello spostamento?" $\Delta x = 36$, $\Delta y = 39$, risposta $53\,\text{m}$; distrattori
  $75\,\text{m}$ (le componenti sommate come numeri), la differenza delle distanze dall'origine, il modulo di
  $\vec{s}_A + \vec{s}_B$, la distanza di $B$ dall'origine (la posizione presa per lo spostamento).
- Scena: gli assi e i due punti; la soluzione aggiunge lo spostamento con il suo modulo.

## Livello 2: la velocità media

Uno spostamento verso est e uno verso nord (da $11$ a $99\,\text{m}$) in un tempo da $1{,}1$ a $99\,\text{s}$;
velocità media almeno $0{,}5\,\text{m/s}$.

- "Una barca a vela si sposta di $76\,\text{m}$ verso est e di $39\,\text{m}$ verso nord in $5{,}9\,\text{s}$. Quanto vale
  il modulo della sua velocità media?" $\Delta s = 85{,}42\,\text{m}$, risposta $14\,\text{m/s}$; distrattori
  $(\Delta x + \Delta y)/\Delta t$, $\Delta x/\Delta t$, $\Delta y/\Delta t$, lo spostamento stesso con l'unità della
  velocità.

## Livello 3: velocità media e velocità scalare media

Due tratti perpendicolari, verso est e poi verso nord, da $11$ a $99\,\text{m}$, ciascuno percorso a una velocità tra
$0{,}8$ e $8\,\text{m/s}$ (una persona o un cane). Metà dei casi la velocità scalare media, $(d_1 + d_2)/(t_1 + t_2)$,
metà il modulo della velocità media, $\sqrt{d_1^2 + d_2^2}/(t_1 + t_2)$; le due arrotondate non coincidono.

- "Un cane corre per $93\,\text{m}$ verso est in $85\,\text{s}$, poi per $73\,\text{m}$ verso nord in $71\,\text{s}$.
  Quanto vale il modulo della sua velocità media?" Risposta $0{,}76\,\text{m/s}$; distrattori l'altra media
  ($1{,}1\,\text{m/s}$), la media delle velocità dei due tratti, lo spostamento diviso per il tempo di un tratto solo.

## Livello 4: le componenti della velocità

Velocità e angolo sull'orizzontale secondo il contesto: un aereo da $51$ a $99\,\text{m/s}$ e da $5^\circ$ a $25^\circ$,
un pallone da $11$ a $35\,\text{m/s}$ e da $15^\circ$ a $70^\circ$, un drone da $1{,}1$ a $9{,}9\,\text{m/s}$ e da
$10^\circ$ a $80^\circ$. Componente orizzontale o verticale, metà ciascuna.

- "Un aereo sale con una velocità di $64\,\text{m/s}$ inclinata di $18^\circ$ sull'orizzontale. Quanto vale la
  componente verticale della velocità?" Risposta $20\,\text{m/s}$; distrattori seno e coseno scambiati, tutta la
  velocità, il seno con la calcolatrice in radianti (quando è positivo).
- Scena: la velocità con il modulo e l'angolo; la soluzione aggiunge la componente, tratteggiata.

## Livello 5: lo spostamento in un intervallo

Velocità costante da $1{,}1$ a $9{,}9\,\text{m/s}$ in una direzione da $10^\circ$ a $80^\circ$ dall'est verso nord, per
un tempo da $1{,}1$ a $99\,\text{s}$; si chiede lo spostamento verso nord ($v\sin\alpha\,\Delta t$) o verso est
($v\cos\alpha\,\Delta t$), metà ciascuno, di almeno $1\,\text{m}$.

- "Un ciclista si muove in linea retta a $3{,}9\,\text{m/s}$, in una direzione che forma un angolo di $48^\circ$ con la
  direzione est, verso nord. Di quanti metri si sposta verso est in $5{,}9\,\text{s}$?" Risposta $15\,\text{m}$;
  distrattori seno e coseno scambiati, $v\,\Delta t$ (tutto lo spostamento), $v\cos\alpha$ (il tempo dimenticato).
- Niente scena: il testo basta.

## Esercizi da evitare

- Componenti dello spostamento quasi nulle (livello 1), velocità da lumaca o da auto per chi cammina (livello 3).
- Risultati da $100$ in su, che andrebbero in notazione scientifica.

## Verifica

`fis_spostamento_velocita_piano.py` rilegge il testo, controlla le cifre significative e gli intervalli dei dati,
calcola con SymPy esatto (radici e funzioni trigonometriche di angoli interi), arrotonda a due cifre, confronta la
risposta e la forma di tutte le opzioni, e controlla la scena (i punti alle coordinate del testo, i tratti con le loro
lunghezze, la velocità con il modulo e l'angolo, niente risposta).

## Domande per la revisione

- Il livello 3 usa "velocità scalare media" per la distanza percorsa diviso il tempo: è il nome dell'Amaldi? (da
  verificare)
