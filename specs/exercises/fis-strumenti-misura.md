# Gli strumenti di misura

Generatore: `fis-strumenti-misura` (`src/lib/exercises/v2/generators/fis-strumenti-misura.ts`).
Verifica indipendente: `scripts/exercises/checkers/fis_strumenti_misura.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/04-fis-strumenti-misura.md`.

Cinque livelli, tutti a scelta multipla con quattro opzioni (`answer.kind = 'choice'`). Dal livello 3 l'esercizio ha
una scena, disegnata dal kit delle figure (`src/components/content/exercises/scenes/`): un righello (`righello`), un tratto
di cilindro graduato (`cilindro-graduato`), le scale di un calibro (`calibro`). La scena disegna i dati che lo studente
legge (le estremità dell'oggetto, il menisco, lo zero del nonio e la divisione che coincide), mai la risposta.

## Nomi dei livelli

1. Portata e sensibilità
2. Scrivere e scegliere
3. Righello e cilindro
4. Calibro decimale
5. Calibro ventesimale

## Regole comuni

- Una misura con la sua incertezza si scrive come nella lezione, `$(12{,}3 \pm 0{,}1)\,\text{cm}$`, con valore e
  incertezza con gli stessi decimali; l'incertezza di una lettura singola è la sensibilità dello strumento, quella della
  differenza di due letture (righello che non parte da zero) è la somma delle due, come l'esempio 2 della lezione.
- Le opzioni hanno tutte la stessa forma, così la forma non tradisce la risposta.
- Niente trattini lunghi e niente "piuttosto che".

## Livello 1: portata e sensibilità

Tre casi, un terzo ciascuno:

- un display (bilancia elettronica con uno o due decimali, cronometro con due, termometro digitale con uno): la
  sensibilità è un'unità dell'ultima cifra. Distrattori: $1$, un decimale in più o in meno, l'ultima cifra letta come
  valore;
- una scala (cilindro graduato, termometro, bilancia pesapersone): due tacche numerate e il numero di intervalli tra loro
  ($5$ o $10$); la sensibilità è la differenza divisa per gli intervalli. Distrattori: $1$ (ogni tacca un'unità, l'avviso
  della lezione), il numero di intervalli, la differenza, la differenza divisa per le tacche invece che per gli
  intervalli;
- portata e sensibilità di un cilindro graduato, come l'esempio 1 della lezione, da una tabella di cilindri veri ($10$,
  $25$, $50$, $100$, $250$, $500$, $1000\,\text{mL}$). Opzioni a due righe, "portata" e "sensibilità".

Esempio: "In un cilindro graduato tra la tacca numerata $40\,\text{mL}$ e quella numerata $50\,\text{mL}$ ci sono $5$
intervalli." Risposta $2\,\text{mL}$; distrattori $1\,\text{mL}$, $5\,\text{mL}$, $10\,\text{mL}$.

## Livello 2: scrivere e scegliere

Due casi, metà ciascuno:

- una lettura con uno strumento (righello $0{,}1\,\text{cm}$, calibro decimale $0{,}1\,\text{mm}$, calibro ventesimale
  $0{,}05\,\text{mm}$, micrometro $0{,}01\,\text{mm}$, bilancia elettronica $0{,}1\,\text{g}$, cilindro graduato
  $2\,\text{mL}$), da scrivere con l'incertezza. Distrattori: incertezza $1$, il valore troncato all'unità, l'incertezza
  dieci volte più piccola o più grande;
- lo strumento adatto a una misura (il diametro di un filo, di una moneta, di un tubo, la lunghezza di una matita, di un
  libro, di un banco, di un'aula, di un campo) con una precisione chiesta. Cinque strumenti con portata e sensibilità:
  righello ($30\,\text{cm}$, $1\,\text{mm}$), metro a nastro ($5\,\text{m}$, $1\,\text{mm}$), rotella metrica
  ($20\,\text{m}$, $1\,\text{cm}$), calibro ventesimale ($15\,\text{cm}$, $0{,}05\,\text{mm}$), micrometro
  ($25\,\text{mm}$, $0{,}01\,\text{mm}$). Esattamente uno ha portata abbastanza grande e sensibilità abbastanza piccola;
  gli altri tre sono scelti tra quelli che non vanno.

## Livello 3: righello e cilindro

Tre casi, un terzo ciascuno, con la scena:

- righello dallo zero: oggetto da $15$ a $42\,\text{mm}$, risposta in centimetri con $\pm 0{,}1\,\text{cm}$;
- righello spostato: l'oggetto parte da $1$, $2$ o $3\,\text{cm}$, risposta la differenza con $\pm 0{,}2\,\text{cm}$.
  Distrattori: la lettura finale senza togliere quella iniziale (l'avviso della lezione), la lunghezza giusta con
  $\pm 0{,}1$;
- cilindro graduato: sensibilità $1$, $2$ o $5\,\text{mL}$, numeri ogni $10\,\text{mL}$ (o $50\,\text{mL}$ con $5$),
  tratto di $20$ divisioni, fondo del menisco su una tacca ad almeno tre divisioni dagli estremi. Distrattori: una
  divisione sopra (il bordo del menisco), una sotto, le tacche contate come millilitri, l'incertezza di $1\,\text{mL}$.

## Livello 4: calibro decimale

Lettura $I + \dfrac{k}{10}\,\text{mm}$ con $I$ da $3$ a $60$ e $k$ da $1$ a $9$; la scena disegna le due scale, a partire dal
centimetro numerato che precede lo zero del nonio (così i millimetri interi si contano da un numero), e segna la
divisione $k$ che coincide. Risposta $(I{,}k \pm 0{,}1)\,\text{mm}$. Distrattori: il numero della scala principale sotto la
tacca che coincide ($I + k$, l'avviso della lezione), il millimetro successivo, la divisione contata dall'altra parte
($10 - k$), la sensibilità sbagliata.

## Livello 5: calibro ventesimale

Come il livello 4 con il nonio di $20$ divisioni in $19\,\text{mm}$: lettura $I + \dfrac{k}{20}$ con $k$ da $1$ a $19$,
risposta con due decimali e $\pm 0{,}05\,\text{mm}$. Distrattore principale $I + k \cdot 0{,}1$ (l'avviso "Con il
ventesimale ogni divisione vale 0,05 mm").

## Esercizi da evitare

- Due strumenti adatti tra le opzioni del livello 2.
- Un menisco sul bordo del tratto disegnato; una lettura del calibro con $k = 0$ (nessuna divisione da cercare).
- Distrattori con una forma diversa dalla risposta (decimali diversi), tranne quelli che sono l'errore di scrittura
  stesso al livello 2.

## Verifica

`scripts/exercises/checkers/fis_strumenti_misura.py` rilegge dal testo e dai dati della scena la lettura e lo strumento,
ricalcola la risposta con le sensibilità della lezione e controlla che la scena sia coerente con il testo (il tipo di
nonio, la finestra del cilindro, il menisco lontano dagli estremi), poi opzioni, forma dei numeri e quote dei casi. Al
livello 2 ricontrolla portata e sensibilità di ogni strumento dell'opzione con la tabella e che uno solo sia adatto.

## Domande per la revisione

- Incertezza di una lettura singola: la sensibilità intera (come qui e come la lezione) o metà divisione?
- Righello spostato: l'incertezza $0{,}2\,\text{cm}$ viene dalla somma delle incertezze, che la lezione rimanda a una
  lezione successiva. Tenere il caso in questo livello o spostarlo agli esercizi della propagazione?
- Il micrometro non ha un livello con la scena: serve (con la scena di un tamburo), o basta la lezione?
