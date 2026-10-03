# Struttura di un documento elettronico

Generatore: `word` (`src/lib/exercises/v2/generators/word.ts`). Verifica indipendente:
`scripts/exercises/checkers/word.py`. Lezione collegata: `docs/lezioni/informatica/riscritte/29-word.md` (note in
`docs/lezioni/informatica/note/29-word.md`). Aiuti comuni del capitolo: `src/lib/exercises/v2/inf-documenti.ts` e
`scripts/exercises/checkers/_inf_documenti.py`.

Cinque livelli nell'ordine della lezione. Tre sono di concetto, a scelta multipla con quattro opzioni
(`answer.kind = 'choice'`), composti da pezzi intercambiabili; due sono di conto (`answer.kind = 'number'`, con la
scelta multipla costruita da `toChoice` sui valori sbagliati tenuti in `params.wrong`).

## Nomi dei livelli

1. Contenuto o formattazione
2. L'area del testo
3. I caratteri non stampabili
4. Invii o interruzione di pagina
5. Il formato del file

## Regole comuni

- Il protagonista è uno studente preso da un elenco di dodici nomi; il documento, dove serve, da un elenco di otto
  (la relazione di scienze, la ricerca di storia, il tema di italiano, la tesina di geografia, il curriculum, la
  relazione di laboratorio, il giornalino di classe, la lettera al preside).
- Il testo sta in righe `\text{…}` scritte con `textBlock`; i numeri sono formule in linea, con la virgola decimale
  e l'unità in tondo (`$16{,}5\,\text{cm}$`). Le opzioni di testo sono `\text{…}`, su più righe di al più 26
  caratteri con `\begin{gathered}` quando sono più lunghe.
- Niente trattini lunghi e niente "piuttosto che" (il `check()` lo controlla).
- `params.case` dice il caso, e il controllo lo ricava di nuovo dal testo.

## Livello 1: contenuto o formattazione

"{Nome} sta sistemando {documento} e decide di {modifica}. Che cosa sta cambiando?" Le opzioni sono sempre le
stesse quattro, e ogni modifica appartiene a una sola:

| Risposta | Modifiche |
|---|---|
| La formattazione dei caratteri | grassetto a una parola, corsivo a un titolo di libro, colore rosso, da 11 a 12 punti, tipo di carattere, sottolineato |
| La formattazione del paragrafo | centrare il titolo, giustificare, interlinea, rientro della prima riga, spazio prima di un titolo, allineare a destra la data |
| Le impostazioni della pagina | allargare i margini, foglio in orizzontale, da A4 ad A5, ridurre il margine superiore, stringere il margine sinistro |
| Il contenuto | correggere una parola, aggiungere una frase, cancellare un periodo, sostituire una data, aggiungere una riga alla bibliografia, correggere il nome di una città |

Circa un quarto dei casi per risposta. Esempi:

- "Marco sta sistemando il tema di italiano e decide di scrivere in corsivo il titolo di un libro." Risposta: la
  formattazione dei caratteri. Distrattore tipico: il contenuto (c'entra un titolo).
- "Sara sta sistemando la ricerca di storia e decide di centrare il titolo." Risposta: la formattazione del
  paragrafo. Distrattore tipico: la formattazione dei caratteri.

## Livello 2: l'area del testo

"{Nome} usa un foglio {A4, A5 o A3}, che in verticale è largo … e alto …, e lo imposta in {verticale o
orizzontale}. I margini sinistro e destro sono di … e di …, quelli superiore e inferiore di … e di …. Quanti
centimetri è {larga o alta} l'area del testo?"

- Fogli: A4 $21 \times 29{,}7$, A5 $14{,}8 \times 21$, A3 $29{,}7 \times 42$ (centimetri, foglio verticale).
- Ogni margine è uno tra $1$, $1{,}5$, $2$, $2{,}5$, $3$, $3{,}5\,\text{cm}$, scelto per conto suo.
- Orientamento e dimensione chiesta: metà e metà, quattro casi da circa un quarto.
- Risposta: il lato del foglio nell'orientamento usato, meno i due margini di quella direzione. Numero esatto in
  centimetri (decimi), scritto "p/q".

Distrattori, nell'ordine: l'altro lato del foglio meno gli stessi margini (non ha girato il foglio, o ha confuso
larghezza e altezza); un solo margine tolto; tolti i margini dell'altra direzione; margini sommati invece che tolti.

Esempi:

- A4 verticale, margini sinistro $3$ e destro $2$: larghezza $21 - 3 - 2 = 16\,\text{cm}$.
- A4 orizzontale, margini sinistro e destro $2{,}5$: larghezza $29{,}7 - 2{,}5 - 2{,}5 = 24{,}7\,\text{cm}$
  (distrattore: $21 - 5 = 16$).

## Livello 3: i caratteri non stampabili

"{Nome} scrive {documento} e vuole {lavoro}. Che cosa inserisce in quel punto?" Opzioni fisse: un fine paragrafo,
un'interruzione di riga, una tabulazione, un'interruzione di pagina. Tre lavori per risposta:

| Risposta | Lavori |
|---|---|
| fine paragrafo | nuovo capoverso; chiudere il titolo e passare al testo; chiudere un punto dell'elenco |
| interruzione di riga | a capo dentro un indirizzo senza aprire un altro paragrafo; titolo lungo su due righe che resta un paragrafo; verso di una strofa che è un solo paragrafo |
| tabulazione | nomi che cominciano nello stesso punto della riga; prezzi in colonna; data sempre alla stessa distanza dal margine |
| interruzione di pagina | secondo capitolo su pagina nuova; bibliografia su una pagina a sé; indice su una pagina separata dalla copertina |

Esempi: "… vuole allineare in colonna i prezzi di un elenco": una tabulazione (errore vero: gli spazi, che qui non
sono un'opzione; il distrattore più scelto è il fine paragrafo). "… vuole far cominciare il secondo capitolo su una
pagina nuova": un'interruzione di pagina.

## Livello 4: Invii o interruzione di pagina

"Ogni pagina del documento di {Nome} contiene $R$ righe, e il primo capitolo ne occupa $c$. Per far cominciare il
secondo capitolo in cima alla pagina 2, {Nome} {preme Invio $R - c$ volte | inserisce un'interruzione di pagina}
dopo il primo capitolo. Poi aggiunge $k$ righe al primo capitolo. Su quale riga della pagina 2 si trova ora il
titolo del secondo capitolo?"

- $30 \le R \le 45$, $2 \le k \le 9$, $c \ge 12$ e $c + k \le R - 3$ (il primo capitolo resta nella pagina 1).
- Con gli Invii (circa 6 casi su 10) la risposta è $k + 1$; con l'interruzione (circa 4 su 10) è $1$.
- Distrattori: con gli Invii $1$ (crede che non cambi niente), $k$ (conta le righe vuote e non la riga del titolo),
  $k + 2$, il numero degli Invii; con l'interruzione $k + 1$, $k$, $k + 2$.

Esempio (è l'esempio 6 della lezione): $R = 40$, $c = 26$, $14$ Invii, $k = 5$: riga $6$. Con l'interruzione: riga $1$.

## Livello 5: il formato del file

"{Nome} deve {uso}. In quale formato salva il file?" Tre risposte possibili, circa un terzo ciascuna, e una quarta
opzione che non è mai giusta:

| Risposta | Usi |
|---|---|
| Un formato modificabile: .odt o .docx | mandare la ricerca a chi deve continuare a scriverla; salvare a metà; farla correggere scrivendoci dentro; lavorare in tre a turno |
| Il formato PDF (.pdf) | consegnare la versione finale uguale su ogni computer; copisteria; pubblicare sul sito senza ritocchi; allegare il curriculum finito |
| Il testo semplice (.txt) | solo le parole, senza formattazione; appunti senza grassetti da aprire con qualunque editor; solo i caratteri, nel file più piccolo |
| mai giusta | "Una foto dello schermo (.jpg)" oppure "Un'immagine della pagina (.png)" |

La quarta opzione è l'errore dell'avviso "Consegnare la foto dello schermo" della lezione.

## Esercizi da evitare

- Una modifica o un lavoro che sta in due categorie (per esempio "centrare e sottolineare").
- Al livello 2 margini che lasciano un'area nulla o negativa: con margini fino a $3{,}5\,\text{cm}$ e il lato più corto
  di $14{,}8\,\text{cm}$ non succede.
- Al livello 4 un primo capitolo che, con le righe aggiunte, esce dalla pagina 1: la risposta "riga 1" con
  l'interruzione non sarebbe più vera.

## Verifica

`word.py` rilegge ogni problema dal testo. Ai livelli 1, 3 e 5 classifica la modifica, il lavoro o l'uso con parole
chiave scritte dalla specifica (una sola categoria deve corrispondere) e controlla che le opzioni siano le etichette
previste, con la giusta indicata da `correct`. Al livello 2 ricava foglio, orientamento e margini, controlla le misure
del foglio con la sua tabella e rifà la sottrazione con frazioni esatte. Al livello 4 conta le righe prima del titolo
e le dispone su pagine di $R$ righe. Per i livelli di conto controlla anche la scelta multipla (quattro numeri
diversi, scritti in forma canonica, uno solo giusto) e la soluzione. Infine confronta il caso con `params.case` e
le quote dei casi.

## Domande per la revisione

- Il livello 5 ha una quarta opzione che non è mai giusta (l'immagine della pagina). Va bene, o si preferisce
  distinguere `.odt` e `.docx` in due risposte?
- Il livello 4 conta le righe: è un conto piccolo, ma mostra perché gli Invii non reggono. Tenerlo come livello a sé?
