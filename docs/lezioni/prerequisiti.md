# Prerequisiti delle lezioni di matematica (scuola superiore)

Il grafo dei prerequisiti: per ogni lezione, le lezioni che servono per seguirla. Vedi la decisione
`vault/Decisioni/2026-09-25 I prerequisiti si scrivono per lezione, con un solo tipo di arco.md`.
Si controlla con `scripts/lezioni/prerequisiti.mts`; dopo ogni modifica si rigenera la disposizione
con `node scripts/grafo/layout.mjs` (vedi `README.md`).

Formato: `lezione <- prerequisito, prerequisito` con gli slug di `albero.md`; `lezione <-` senza
niente dopo è una lezione di base. Le altre righe sono solo per chi legge.

Regole:
- Solo i prerequisiti diretti, al massimo 4. Se A serve a B e B serve a C, C non elenca A: lo script
  segnala gli archi ridondanti.
- Un prerequisito è una lezione senza la quale non si segue questa, non una lezione citata o
  collegata. I link "dove si usa" della teoria non sono prerequisiti.
- Il grafo non ha cicli: lo script si ferma se ne trova uno.

Prima versione del 26 settembre 2026 (anteprima: https://claude.ai/artifact/CD85rTvQ4NnXviJfwvd5uX): primo anno completo e le equazioni di secondo grado (l'unica
lezione scritta del secondo anno). Per le lezioni scritte gli archi seguono il testo; per le altre
seguono l'ordine dei libri e vanno ricontrollati quando la lezione si scrive.

# Primo anno

## Insiemi e logica
prime-definizioni <-
insiemi-rappresentazione <- prime-definizioni
sottoinsiemi-ugualianza <- insiemi-rappresentazione
insiemi-unione <- sottoinsiemi-ugualianza
insiemi-intersezione <- insiemi-unione
insiemi-differenza <- insiemi-intersezione
insiemi-prodotto-cartesiano <- insiemi-rappresentazione
insiemi-operazioni <- insiemi-differenza, insiemi-prodotto-cartesiano
logica-proposizioni <-
logica-implicazione <- logica-proposizioni, sottoinsiemi-ugualianza
logica-quantificatori <- logica-proposizioni, insiemi-rappresentazione

## Numeri naturali
numeri-naturali-operazioni <-
numeri-naturali-potenze <- numeri-naturali-operazioni
numeri-naturali-divisibilita <- numeri-naturali-potenze
numeri-naturali-mcm-mcd <- numeri-naturali-divisibilita

## Numeri interi
numeri-interi-valore-assoluto <- numeri-naturali-operazioni
numeri-interi-operazioni <- numeri-interi-valore-assoluto
numeri-interi-potenze <- numeri-interi-operazioni, numeri-naturali-potenze

## Numeri razionali
numeri-razionali-frazioni <- numeri-interi-operazioni, numeri-naturali-mcm-mcd
numeri-razionali-confronto-frazioni <- numeri-razionali-frazioni
numeri-razionali-operazioni <- numeri-razionali-confronto-frazioni
numeri-razionali-potenze <- numeri-razionali-operazioni, numeri-interi-potenze
numeri-razionali-espressioni <- numeri-razionali-potenze
numeri-razionali-conversione <- numeri-razionali-frazioni
numeri-razionali-proporzioni <- numeri-razionali-operazioni, numeri-razionali-conversione

## Relazioni e funzioni
relazioni-binarie <- insiemi-prodotto-cartesiano
relazioni-equivalenza-ordine <- relazioni-binarie, sottoinsiemi-ugualianza
definizione-funzione <- relazioni-binarie, numeri-razionali-espressioni
dominio-codominio-immagine <- definizione-funzione
funzioni-iniettive-suriettive-biettive <- dominio-codominio-immagine
composizione-di-funzioni <- funzioni-iniettive-suriettive-biettive, equazioni-primo-grado
funzioni-lineari <- definizione-funzione, numeri-razionali-proporzioni

## Monomi e polinomi
monomi <- numeri-razionali-potenze
monomi-grado <- monomi
monomi-operazioni <- monomi
monomi-mcm-mcd <- monomi-operazioni
monomi-espressioni <- monomi-operazioni, numeri-razionali-espressioni
polinomi <- monomi-grado, monomi-operazioni
polinomi-operazioni <- polinomi
polinomi-prodotti-notevoli <- polinomi-operazioni
polinomi-espressioni <- polinomi-prodotti-notevoli, monomi-espressioni
polinomi-divisione <- polinomi-operazioni
polinomi-ruffini <- polinomi-divisione

## Scomposizione in fattori
scomposizione-raccoglimento <- polinomi-operazioni, monomi-mcm-mcd
scomposizione-prodotti-notevoli <- scomposizione-raccoglimento, polinomi-prodotti-notevoli
scomposizione-trinomio <- scomposizione-raccoglimento
scomposizione-ruffini <- polinomi-ruffini, scomposizione-trinomio, scomposizione-prodotti-notevoli
polinomi-mcd-mcm <- scomposizione-prodotti-notevoli, scomposizione-trinomio

## Frazioni algebriche
frazioni-algebriche-esistenza <- scomposizione-prodotti-notevoli, scomposizione-trinomio
frazioni-algebriche-semplificazione <- frazioni-algebriche-esistenza, polinomi-mcd-mcm
frazioni-algebriche-operazioni <- frazioni-algebriche-semplificazione

## Equazioni di primo grado
equazioni-primo-grado <- polinomi-operazioni, numeri-razionali-espressioni
equazioni-fratte <- equazioni-primo-grado, frazioni-algebriche-operazioni
equazioni-letterali <- equazioni-primo-grado, frazioni-algebriche-semplificazione
equazioni-problemi <- equazioni-primo-grado, numeri-razionali-proporzioni

## Disequazioni di primo grado
disequazioni-primo-grado <- equazioni-primo-grado
sistemi-di-disequazioni <- disequazioni-primo-grado, insiemi-intersezione
disequazioni-razionali <- disequazioni-primo-grado, frazioni-algebriche-operazioni

## Statistica
statistica-dati <- numeri-razionali-proporzioni
statistica-medie <- statistica-dati
statistica-variabilita <- statistica-medie

## Geometria del piano
geometria-enti <-
angoli-e-lati-dei-triangoli <- geometria-enti
geometria-perpendicolari-parallele <- angoli-e-lati-dei-triangoli
geometria-punti-notevoli <- geometria-perpendicolari-parallele
geometria-quadrilateri <- geometria-perpendicolari-parallele

# Secondo anno

## Equazioni di secondo grado
equazioni-secondo-grado <- equazioni-primo-grado, scomposizione-raccoglimento, numeri-reali-radici

# Dubbi da sciogliere
- MCD e MCM tra monomi cita MCD e MCM in ℕ, ma l'arco è ridondante (ci si arriva passando per le
  frazioni). Per il ripasso dopo una prova conta proprio quel collegamento: il ripasso dovrà cercare
  tra tutti gli antenati, non solo tra i prerequisiti diretti.
- Dominio, codominio e immagine e Composizione e funzione inversa risolvono equazioni di primo grado
  (la controimmagine, il dominio naturale, l'inversa di $ax + b$), ma nell'albero le funzioni vengono
  prima del capitolo delle equazioni. Per la composizione l'arco c'è (metà della lezione ricava $x$);
  per Dominio, codominio e immagine no, perché bastano equazioni da una riga.
