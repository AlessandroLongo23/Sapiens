# Note: Grandezze fisiche e unità del Sistema Internazionale

Lezione nuova, scritta da zero (primo lotto di fisica, gruppo 1, 29 settembre 2026). `check.mts` passa senza errori; due
avvisi accettati: il titolo "Il Sistema Internazionale" ha la maiuscola perché è un nome proprio, e i grassetti sono 15,
tutti su termini definiti.

## Struttura ed esempi

Grandezza fisica e definizione operativa, misurare, misura come numero e unità, grandezze omogenee; il SI con la tabella
delle sette unità fondamentali, le definizioni del 2019 (secondo, metro, chilogrammo), una riga su kelvin e gradi Celsius,
un `ad-note` su massa e peso con link alla lezione sulla forza-peso; come si scrivono le unità, con la tabella
sbagliato/giusto; multipli e sottomultipli con la tabella dei prefissi (da tera a pico) e la figura della scala del metro,
il chilogrammo che ha già un prefisso, la tonnellata; la notazione scientifica con il procedimento in tre passi; l'ordine
di grandezza con la regola del $5$, la figura delle lunghezze e un `ad-note` sulla regola di $\sqrt{10}$; le conversioni
con il fattore di conversione, ore, minuti e secondi, $\text{km/h}$ e $\text{m/s}$.

Quattro esempi: notazione scientifica del raggio della Terra e del globulo rosso; prodotto e quoziente in notazione
scientifica; conversioni con i prefissi ($\text{mg}$, $\mu\text{s}$, $\mu\text{m}$ in $\text{mm}$); tempi e velocità
($2\,\text{h}\ 15\,\text{min}$, $1{,}5\,\text{h}$, $72\,\text{km/h}$). Avvisi: numero senza unità, maiuscole e minuscole
(Kg, mg e Mg), il primo fattore tra $1$ e $10$, un'ora e mezza. Un `ad-tip` sul verso delle conversioni.

## Scelte

- La notazione scientifica non ha una lezione di matematica (la 08 la rimanda ai razionali, la 09 fa le potenze con
  esponente negativo ma non la notazione scientifica) e il programma di fisica dice "niente notazione scientifica e niente
  equivalenze a parte". Per questo è qui, in una sezione, con il link alla 09 per le potenze negative. Se in futuro
  arriva una lezione di matematica sulla notazione scientifica, questa sezione si accorcia a un link.
- L'ordine di grandezza con la soglia $5$ ($a < 5$: $10^n$). I libri non sono d'accordo: alcuni usano $\sqrt{10}$, altri
  "la potenza più vicina" senza regola. La lezione lo dice in un `ad-note`, e gli esercizi usano solo numeri con il primo
  fattore minore di $3$ o almeno $6$, dove le regole coincidono.
- Unità scritte come dice `docs/lezioni/fisica/README.md`: `$3{,}5\,\text{km}$`, $\mu$ in corsivo come nei libri
  ($4{,}2\,\mu\text{m}$; il SI lo vorrebbe in tondo, KaTeX non ha il mu tondo senza pacchetti).
- Le ore e i minuti: "$2\,\text{h}\ 15\,\text{min}$", con uno spazio normale tra le due parti.

## Numeri

Rifatti in Python con le frazioni esatte (script `verifica.py` nello scratchpad della sessione, 40 controlli per le quattro
lezioni): $6\,370\,000 = 6{,}37 \cdot 10^6$, $0{,}0000075 = 7{,}5 \cdot 10^{-6}$, $5 \cdot 4 \cdot 10^9 = 2 \cdot 10^{10}$,
$\dfrac{6 \cdot 10^8}{3 \cdot 10^{-2}} = 2 \cdot 10^{10}$, $250\,\text{mg} = 0{,}25\,\text{g}$,
$0{,}8\,\mu\text{s} = 8 \cdot 10^{-7}\,\text{s}$, $4{,}2\,\mu\text{m} = 4{,}2 \cdot 10^{-3}\,\text{mm}$,
$2\,\text{h}\ 15\,\text{min} = 8100\,\text{s}$, $1{,}5\,\text{h} = 5400\,\text{s}$, $72\,\text{km/h} = 20\,\text{m/s}$.

## Fonti

- SI adottato nel 1960 dall'11ª Conferenza generale dei pesi e delle misure; ridefinizione in vigore dal 20 maggio 2019;
  prototipo del chilogrammo del 1889 a Sèvres; $9\,192\,631\,770$ oscillazioni del cesio-133; $299\,792\,458\,\text{m/s}$.
  Dati noti, da verificare sulla brochure del SI del BIPM (9ª edizione, 2019) prima della pubblicazione.
- Ordini di grandezza della figura: diametro di un atomo $\sim 10^{-10}\,\text{m}$, virus $\sim 10^{-7}$, globulo rosso
  $7{,}5\,\mu\text{m}$, capello $0{,}05$-$0{,}1\,\text{mm}$, formica pochi millimetri, campo da calcio circa $105\,\text{m}$,
  Everest $8849\,\text{m}$, raggio della Terra $6{,}37 \cdot 10^6\,\text{m}$, Terra-Luna $3{,}84 \cdot 10^8\,\text{m}$,
  Terra-Sole $1{,}50 \cdot 10^{11}\,\text{m}$. Valori comuni, da verificare.

## Figure

- `scala-multipli-metro` (TikZ, 341 x 144 px): dal kilometro al millimetro, con le frecce "$\cdot 10$" e "$:10$".
- `ordini-grandezza-lunghezze` (TikZ, 266 x 470 px): scala verticale delle potenze di $10$ del metro con undici
  lunghezze. Controllato che ogni oggetto stia alla sua potenza con la regola della lezione.

Nessuna figura interattiva: la scala delle potenze di dieci in TikZ basta, e una figura che scorre tra gli ordini di
grandezza non aggiungerebbe un'idea nuova.

## Per il generatore

`fis-grandezze-si`, sei livelli a scelta multipla (specifica in `specs/exercises/fis-grandezze-si.md`): unità e prefissi,
un prefisso e l'unità, notazione scientifica, tra due prefissi, ore minuti e km/h, ordine di grandezza.

## Domande per Andrea

- Ordine di grandezza: soglia $5$, $\sqrt{10}$ o "la potenza più vicina"? Il vostro libro quale usa?
- La notazione scientifica sta qui perché la matematica non ha una lezione: va bene, o preferite una lezione a parte (di
  matematica o di fisica)?
- Il simbolo del litro: qui $\text{L}$ maiuscolo (il SI accetta anche $\text{l}$). Quale usate in classe?
- "Intervallo di tempo" nella tabella delle grandezze fondamentali (come il SI) o solo "tempo"?
- Nella notazione scientifica con esponente $1$ gli esercizi scrivono $3 \cdot 10\,\mu\text{L}$: meglio $3 \cdot 10^1$?
- Il chilogrammo definito dalla costante di Planck: basta nominarla, o la lezione deve dire di più (o di meno)?
