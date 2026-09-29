# Grandezze scalari e grandezze vettoriali

Generatore: `fis-scalari-vettori` (`src/lib/exercises/v2/generators/fis-scalari-vettori.ts`, con i pezzi comuni in
`src/lib/exercises/v2/vettori.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_scalari_vettori.py` (con
`checkers/_vettori.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/13-fis-scalari-vettori.md` (note in
`docs/lezioni/fisica/note/13-fis-scalari-vettori.md`). Percorso nel database:
`high_school/physics/fis-vettori-forze/fis-scalari-vettori`.

Cinque livelli, nell'ordine della lezione, ognuno con una difficoltà in più del precedente.

## Nomi dei livelli

Per `src/lib/exercises/level-names.ts`, da aggiungere quando si collega la lezione:

1. Scalare o vettoriale
2. Vettori uguali e opposti
3. La scala di un disegno
4. Distanza e spostamento su una retta
5. Lo spostamento sulla griglia

## Tipi di risposta

Tutti i livelli hanno una risposta a scelta multipla (`choice`), come chiede il README di fisica per le risposte con
l'unità: quattro opzioni, l'unità dentro l'opzione (`7\,\text{km}\ \text{verso est}`, `4{,}5\,\text{cm}`), la
virgola decimale `{,}`. Al livello 1 le opzioni sono grandezze scritte a parole, al livello 2 i nomi dei vettori.
Le opzioni sono diverse come testo; i valori (`values`) sono la stringa decimale, più il verso quando c'è.

## Regole comuni

- Convenzioni della lezione e del README di fisica: unità dopo lo spazio sottile, vettori con la freccia, il modulo
  senza freccia, "modulo, direzione e verso".
- Il testo sta in righe `\text{…}` scritte con `textBlock`, con le formule tra `$…$`.
- I livelli 2, 4 e 5 hanno una scena `vettori-piano` (`src/components/content/exercises/scenes/VettoriPiano.tsx`)
  che disegna i dati; lo spostamento trovato sta solo in `solutionScene`, in arancione.
- Niente trattini lunghi e niente "piuttosto che" (il `check()` lo controlla).

## Livello 1: scalare o vettoriale

"Quale di queste grandezze è vettoriale?" (metà) oppure "... è scalare?" (metà). Una grandezza del tipo chiesto e
tre dell'altro, dagli elenchi della lezione: vettoriali lo spostamento, la velocità, l'accelerazione, la forza;
scalari la massa, la durata, la temperatura, il volume, la densità, la distanza percorsa, l'area.

- "Quale di queste grandezze è vettoriale?" Risposta "la forza su una porta"; le altre "la densità del ferro",
  "la massa di uno zaino", "l'area di un campo".
- "Quale di queste grandezze è scalare?" Risposta "la durata di una partita"; le altre "l'accelerazione di una moto",
  "la forza su una porta", "lo spostamento di un'auto".

Il distrattore che conta è "la distanza percorsa", scalare, accanto a "lo spostamento", vettoriale: la lezione li
distingue.

## Livello 2: vettori uguali e opposti

Una griglia di 15 per 10 quadretti con cinque vettori: $\vec{a}$ in alto a sinistra, e $\vec{b}$, $\vec{c}$,
$\vec{d}$, $\vec{e}$ in quattro delle altre cinque caselle. $\vec{a}$ ha le componenti intere tra $-2$ e $2$. Quattro
domande, circa un quarto ciascuna: quale vettore è uguale ad $\vec{a}$; quale è l'opposto; quale ha la stessa
direzione e lo stesso verso ma un modulo diverso (il doppio); quale ha lo stesso modulo ma una direzione diversa
(girato di un angolo retto). Gli altri tre vettori vengono dalle categorie che non rispondono: uguale, opposto,
doppio, doppio opposto, girato, e un vettore qualsiasi con modulo e direzione diversi.

- "Nella figura, quale vettore è l'opposto di $\vec{a}$?" Risposta $\vec{c}$.
- "Nella figura, quale vettore ha lo stesso modulo di $\vec{a}$, ma una direzione diversa?" Risposta $\vec{e}$.

## Livello 3: la scala di un disegno

Metà dalla lunghezza al modulo ("In un disegno in scala $1\,\text{cm} : 20\,\text{N}$ una forza è rappresentata da
una freccia lunga $4{,}5\,\text{cm}$..."), metà dal modulo alla lunghezza ("Devi disegnare uno spostamento di
$100\,\text{m}$ in scala $1\,\text{cm} : 20\,\text{m}$..."). Scale da $2$ a $500$; lunghezze da $2$ a $9{,}5$ cm, con
un decimale circa 7 volte su 10; il modulo è sempre intero. Risultati esatti, niente arrotondamenti.

- Risposta $5\,\text{cm}$; distrattori $50\,\text{cm}$ (dieci volte), $2000\,\text{cm}$ (il modulo per la scala),
  $0{,}5\,\text{cm}$.
- Risposta $90\,\text{N}$ da $4{,}5\,\text{cm}$ e $1\,\text{cm} : 20\,\text{N}$; distrattori la lunghezza divisa per
  la scala, dieci volte, un decimo.

## Livello 4: distanza e spostamento su una retta

Due tratti (circa 2 volte su 3) o tre, lunghi da $2$ a $12$ km o m, in versi alternati (est, ovest, est), che non
riportano al punto di partenza e restano entro $14$ unità. Metà chiede la distanza percorsa, metà lo spostamento
con il modulo e il verso. La scena disegna i tratti uno sotto l'altro, con la loro lunghezza, e la partenza $A$.

- "Un ciclista percorre $9\,\text{km}$ verso ovest, poi $7\,\text{km}$ verso est, lungo una strada dritta. Quanto vale
  lo spostamento?" Risposta $2\,\text{km}$ verso ovest; distrattori $2\,\text{km}$ verso est, $16\,\text{km}$ verso
  ovest ed est (la distanza al posto dello spostamento).
- "Un'auto percorre $6\,\text{km}$ verso est, poi $7\,\text{km}$ verso ovest... Quanto vale la distanza percorsa?"
  Risposta $13\,\text{km}$; distrattori $1\,\text{km}$ (lo spostamento), $7\,\text{km}$, $19\,\text{km}$.

## Livello 5: lo spostamento sulla griglia

Due o tre tratti perpendicolari lungo le strade di una città a scacchiera (o i quadrati di un campo, i quadretti di
una mappa), con isolati di $100$ o $200$ m, quadrati di $10$ m, quadretti di $1$ km. Lo spostamento da $A$ a $B$ ha
le componenti di una terna pitagorica ($3, 4, 5$; $6, 8, 10$; $5, 12, 13$; $9, 12, 15$, nei due ordini e con i
segni); con tre tratti il primo va oltre e il terzo torna indietro di $1$, $2$ o $3$.

- "... ogni isolato è lungo $100\,\text{m}$. Luca parte da $A$ e va per 7 isolati verso est, poi 12 isolati verso nord
  e infine 2 isolati verso ovest, fino a $B$." Risposta $1300\,\text{m}$; distrattori $2100\,\text{m}$ (la strada
  fatta), $1700\,\text{m}$ (i due cateti sommati), $700\,\text{m}$.
- "... ogni quadrato è largo $10\,\text{m}$. Un robot parte da $A$ e va per 4 quadrati verso sud e poi 3 quadrati
  verso est." Risposta $50\,\text{m}$; distrattori $70\,\text{m}$, $40\,\text{m}$, $10\,\text{m}$.

## Esercizi da evitare

- Uno spostamento nullo (livello 4), due tratti consecutivi nello stesso verso, un percorso che esce dalla figura.
- Una freccia lunga $1\,\text{cm}$ (livello 3: troppo facile).
- Al livello 2 due vettori che rispondono alla stessa domanda, o un vettore fuori dagli incroci della griglia.
- Una scena che disegna lo spostamento cercato.

## Verifica

`fis_scalari_vettori.py` rilegge ogni problema dal testo e, dove c'è, dalla scena:

- livello 1: una tabella scritta dalla lezione dice di ogni grandezza se è scalare o vettoriale; una sola opzione
  deve essere del tipo chiesto, ed è quella giusta;
- livello 2: dalla scena prende le componenti di $\vec{a}$ e degli altri quattro vettori, controlla che stiano sugli
  incroci, e cerca il vettore che risponde alla domanda (parallelo, stesso verso, stesso modulo, con numeri esatti):
  deve essere uno solo, ed è l'opzione giusta;
- livello 3: la lunghezza per la scala, o il modulo diviso la scala, in razionali esatti;
- livello 4: somma con segno e somma dei moduli dei tratti letti nel testo; la scena deve disegnare proprio quei
  tratti, in quell'ordine, e la scena della soluzione lo spostamento da $A$ a $B$;
- livello 5: la somma dei tratti del testo, il modulo con SymPy (`sqrt`), che deve essere esatto; la scena deve
  disegnare i tratti del testo.

Controlla anche le quattro opzioni diverse, l'opzione giusta, l'unità e la scrittura di ogni numero, e la quota di
ogni caso (`CASE_RANGES`). L'esito dei controlli è nella nota della lezione.

## Domande per la revisione

- Livello 1: gli esempi di grandezze bastano, o volete anche il peso (una forza, quindi vettoriale), che però la
  lezione nomina solo nella lezione sulla forza-peso?
- Livello 3: la scala si scrive $1\,\text{cm} : 20\,\text{N}$, come nella lezione. Il vostro libro usa un'altra
  scrittura?
- Livello 4: i versi sono sempre est e ovest; servono anche su e giù (un ascensore)?
