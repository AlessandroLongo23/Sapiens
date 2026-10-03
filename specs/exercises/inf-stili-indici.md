# Stili, titoli, tabelle e indici automatici

Generatore: `inf-stili-indici` (`src/lib/exercises/v2/generators/inf-stili-indici.ts`). Verifica indipendente:
`scripts/exercises/checkers/inf_stili_indici.py`. Lezione collegata:
`docs/lezioni/informatica/riscritte/30-inf-stili-indici.md` (note in `docs/lezioni/informatica/note/30-inf-stili-indici.md`).
Aiuti comuni del capitolo: `src/lib/exercises/v2/inf-documenti.ts` e `scripts/exercises/checkers/_inf_documenti.py`.

Sei livelli nell'ordine della lezione. Il primo e il quarto sono a scelta multipla (`answer.kind = 'choice'`); gli
altri quattro sono conti con risposta numerica (`answer.kind = 'number'`), e la loro scelta multipla viene da
`toChoice`, con i valori sbagliati di `params.wrong`.

## Nomi dei livelli

1. Lo stile giusto
2. Modificare uno stile
3. Le voci dell'indice
4. L'indice dopo una modifica
5. La numerazione automatica
6. Le celle di una tabella

## Regole comuni

Come in `specs/exercises/word.md`: dodici nomi, testo in righe `\text{…}`, numeri in formula, opzioni di testo su
righe di al più 26 caratteri, niente trattini lunghi e niente "piuttosto che", `params.case` ricavato di nuovo dal
controllo. I nomi degli stili sono quelli della lezione: Titolo 1, Titolo 2, Titolo 3, Corpo del testo, Didascalia.

## Livello 1: lo stile giusto

"Nella ricerca "{documento}" di {Nome}, "{C}" è un capitolo, "{P}" è una parte di quel capitolo e "{S}" è una parte
di "{P}". Quale stile dà {Nome} {pezzo}?" Dieci ricerche, ognuna con la sua terna (per esempio "L'acqua": "Il ciclo
dell'acqua", "Le precipitazioni", "La neve"). Il pezzo chiesto decide lo stile, circa un quinto dei casi ciascuno:

| Pezzo chiesto | Stile |
|---|---|
| al titolo "{C}" | Titolo 1 |
| al titolo "{P}" | Titolo 2 |
| al titolo "{S}" | Titolo 3 |
| al testo normale scritto sotto il titolo "{C, P o S}" | Corpo del testo |
| alla riga con il numero e la descrizione di una figura, sotto il titolo "{C, P o S}" | Didascalia |

Opzioni: lo stile giusto e tre degli altri quattro. Esempi:

- "… Quale stile dà Anna al titolo "Le precipitazioni"?" Titolo 2. Distrattore tipico: Titolo 1 (è un titolo
  importante) o Titolo 3.
- "… al testo normale scritto sotto il titolo "La neve"?" Corpo del testo. Distrattore tipico: Titolo 3 (il livello del
  titolo sopra).

## Livello 2: modificare uno stile

"Nel documento di {Nome} ci sono $a$ titoli con lo stile Titolo 1, $b$ con lo stile Titolo 2 e $m$ titoli formattati
a mano, senza stile, che somigliano ai Titolo $j$. {Nome} modifica lo stile Titolo $j$: {sceglie il colore blu |
sceglie il colore verde | passa al carattere di 18 punti | aggiunge il corsivo}. Quanti titoli cambiano aspetto?"

- $3 \le a \le 9$, $4 \le b \le 14$, $a \ne b$, $1 \le m \le 4$, $j$ è 1 o 2 (metà e metà).
- Risposta: $a$ se $j = 1$, $b$ se $j = 2$.
- Distrattori: quelli con lo stile più quelli a mano (l'errore dell'avviso "Un titolo non è un testo grande e in
  grassetto"), $a + b$, $a + b + m$, l'altro stile.

Esempio (esempio 1 della lezione): $5$ Titolo 1, $8$ Titolo 2, $2$ a mano simili ai Titolo 1, si modifica Titolo 1:
$5$. Distrattori $7$, $13$, $15$.

## Livello 3: le voci dell'indice

"Il documento di {Nome} ha $a$ titoli con lo stile Titolo 1, $b$ con lo stile Titolo 2 e $c$ con lo stile Titolo 3
[, più $m$ titoli scritti in grassetto senza uno stile di titolo]. L'indice automatico mostra i titoli fino al
livello $L$. Quante voci ha l'indice?"

- $2 \le a \le 6$, $4 \le b \le 12$, $3 \le c \le 10$, $1 \le m \le 3$; $L$ è 1, 2 o 3 (un terzo ciascuno); i titoli
  senza stile compaiono in metà dei casi.
- Risposta: la somma dei titoli con stile di livello fino a $L$.
- Distrattori: con i titoli a mano contati, tutti e tre i livelli, i primi due, solo il livello $L$.

Esempi (esempi 3 e 4 della lezione): $4$, $9$, $6$, fino al livello 2: $13$ voci; con un titolo in grassetto in più:
ancora $13$.

## Livello 4: l'indice dopo una modifica

"Nell'indice del documento di {Nome}, alla voce "{A}" corrisponde la pagina $p$. {Nome} cambia quel titolo in "{B}" e
aggiunge $k$ pagine prima di quel capitolo. {Poi aggiorna l'indice | Non aggiorna l'indice}. Che cosa si legge ora
nell'indice per quel capitolo?"

- Dieci coppie di titoli (per esempio "Le eruzioni" e "Come erutta un vulcano"); $3 \le p \le 12$, $1 \le k \le 4$.
- Opzioni, sempre le quattro combinazioni: "{A}, pagina $p$", "{B}, pagina $p + k$", "{B}, pagina $p$", "{A},
  pagina $p + k$".
- Non aggiornato (metà dei casi): titolo vecchio e pagina vecchia. Aggiornato: titolo nuovo e pagina $p + k$.

Esempio (esempio 5 della lezione): "L'acqua potabile" a pagina 5, nuovo titolo "L'acqua che beviamo", $2$ pagine in
più: senza aggiornare "L'acqua potabile, pagina 5"; aggiornando "L'acqua che beviamo, pagina 7".

## Livello 5: la numerazione automatica

"Nel documento di {Nome} ci sono $n$ {figure | tabelle | note a piè di pagina} numerate in automatico. {Nome} {ne
inserisce una nuova | ne inserisce $j$ nuove} tra la {Figura} $i$ e la {Figura} $i + 1$ [oppure: elimina la {Figura}
$d$]. Che numero ha ora quella che era la {Figura} $x$?"

- $5 \le n \le 12$, $1 \le j \le 3$.
- Tre casi: il numero sale (inserimento prima di $x$: $x + j$), circa metà; resta (inserimento o eliminazione dopo
  $x$), circa un quarto; scende (eliminazione prima di $x$: $x - 1$), circa un quarto. Non si chiede mai dell'elemento
  eliminato.
- Distrattori: $x$ (o $x \pm j$ quando resta), $x + 1$, $x - 1$, $x + j + 1$.

Esempio (esempio 6 della lezione): $6$ figure, una nuova tra la 2 e la 3: la Figura 5 diventa $6$, la Figura 2 resta $2$.

## Livello 6: le celle di una tabella

Due forme, metà ciascuna:

- "{Nome} prepara una tabella con una riga di intestazione e una riga per ciascuno dei $r$ {compagni, libri, giorni,
  esperimenti | per ciascuna delle $r$ materie, squadre}; le colonne sono $c$. Quante celle ha la tabella?" Con
  $3 \le r \le 9$ e $2 \le c \le 6$: $(r + 1) \cdot c$. Distrattori: $r \cdot c$ (dimentica l'intestazione),
  $(r + 1)(c + 1)$, $r + 1 + c$.
- "Una tabella di {Nome} ha $R$ righe e $C$ colonne. {Nome} unisce in una sola cella $m$ celle vicine della prima
  riga. Quante celle ha ora la tabella?" Con $3 \le R \le 8$, $3 \le C \le 6$, $2 \le m \le C$: $R \cdot C - (m - 1)$.
  Distrattori: $R \cdot C - m$ (toglie tutte le celle unite), $R \cdot C$, $R \cdot C - 1$.

Esempio (esempio 7 della lezione): intestazione più $5$ materie, $3$ colonne: $18$ celle; una tabella di $7$ righe e
$3$ colonne con le $3$ celle della prima riga unite: $21 - 2 = 19$.

## Esercizi da evitare

- Al livello 2 $a = b$: il distrattore "l'altro stile" coinciderebbe con la risposta.
- Al livello 4 un titolo nuovo uguale al vecchio, o nessuna pagina aggiunta: le quattro opzioni non sarebbero diverse.
- Al livello 5 la domanda sull'elemento eliminato.

## Verifica

`inf_stili_indici.py` rilegge ogni problema dal testo e ricostruisce la risposta: al livello 1 dalla profondità del
titolo nominato (capitolo, parte, parte della parte) e dal tipo di pezzo; ai livelli 2 e 3 dai conteggi; al livello 4
da titolo, pagina, pagine aggiunte e aggiornamento, leggendo titolo e pagina di ogni opzione; al livello 5 costruendo
l'elenco degli elementi, inserendo o togliendo, e cercando la nuova posizione; al livello 6 da righe, colonne e celle
unite. Controlla le opzioni (quattro, diverse, una sola giusta, quella di `correct`), la soluzione, la scrittura dei
numeri, il caso in `params.case` e le quote dei casi.

## Domande per la revisione

- I nomi degli stili sono quelli di LibreOffice Writer ("Corpo del testo", "Didascalia"); in Word il testo normale si
  chiama "Normale". Va bene tenere un solo nome?
- Al livello 4 "aggiorna l'indice" vuol dire aggiornare tutto l'indice, titoli e numeri di pagina. Alcuni programmi
  offrono anche "aggiorna solo i numeri di pagina": si lascia fuori?
