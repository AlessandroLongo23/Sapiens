# Note: Riferimenti relativi e assoluti

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "Il foglio di calcolo", prima metà, 3 ottobre
2026). `check.mts` passa senza errori e senza avvisi su lezione, formulario e flashcard.

## Il dollaro nel codice in linea: una deroga da decidere

Il README di informatica chiede di scrivere i riferimenti in codice in linea, per esempio `` `$B$2` ``. Oggi non
funziona: `protect()` in `src/lib/content/markdown.ts` e `scripts/lezioni/check.mts` cercano le formule `$…$` prima di
guardare gli apici inversi, quindi `` `=A2*$D$1` `` diventa una formula KaTeX "D" in mezzo al codice, e un riferimento
misto come `` `$A2` ``, con un dollaro solo, si accoppia con il primo dollaro che trova più avanti nel testo
(`check.mts` dà "simbolo $ spaiato" o un errore di LaTeX).

Non potendo toccare né il renderer né il controllo, in questa lezione, nel suo formulario e nelle sue flashcard ogni
pezzo di codice che contiene un dollaro è scritto in HTML: ``=A2*$D$1`` (`&#36;` è il dollaro,
`&#42;` l'asterisco, che fuori dagli apici inversi farebbe partire il corsivo). markdown-it ha `html: true` e lo
mostra come ogni altro codice in linea; l'ho provato con markdown-it da solo, non sulla pagina del sito. Il codice
senza dollari resta tra apici inversi.

Se si corregge `protect()` (e `check.mts`) perché saltino il codice in linea, i file si riportano alla forma del
README con una sostituzione: le bozze con gli apici inversi sono in `/tmp/informatica-cap6a/draft/` e lo script che
le converte è `/tmp/informatica-cap6a/dollari.py` (cartella temporanea: da copiare se serve). Nelle figure TikZ il
dollaro è `\char36`, perché `\$` chiede un carattere (`tcrm0900`) che node-tikzjax non ha.

Negli esercizi il problema non c'è: il dollaro è `\textdollar` dentro `\texttt`.

## Struttura ed esempi

Come si copia una formula (copia e incolla, trascinamento del quadratino); i riferimenti relativi come posizione
rispetto alla cella della formula, con la figura delle frecce e la regola in quattro passi; il caso in cui il
riferimento non deve spostarsi (aliquota IVA in `D1`, la colonna di zeri); i riferimenti assoluti, con la figura
delle tre formule che puntano a `D1`; i riferimenti misti, con la tabella dei quattro tipi e la tavola pitagorica;
come scegliere il riferimento, in cinque passi; la differenza tra copiare e spostare.

Sette esempi svolti: copia in basso, a destra, in diagonale verso l'alto; IVA con l'aliquota in una cella; peso da
massa per 9,8 (fisica); tavola pitagorica; tre tipi di riferimento nella stessa formula.

La lezione è più lunga delle altre (210 righe, di cui una cinquantina di TikZ): il brief chiede "molti esempi di che
formula c'è nella cella dopo la copia".

## Conti

Ogni copia degli esempi, del formulario e delle flashcard è stata rifatta con `copy_formula` del controllo Python
(`scripts/exercises/checkers/_inf_foglio.py`): 20 casi, tutti uguali al testo. Valori: $20 \cdot 0{,}22 = 4{,}4$,
$35 \cdot 0{,}22 = 7{,}7$, $50 \cdot 0{,}22 = 11$; $0{,}5 \cdot 9{,}8 = 4{,}9$, $1{,}2 \cdot 9{,}8 = 11{,}76$,
$2 \cdot 9{,}8 = 19{,}6$.

## Scelte

- "22%" nella cella dell'aliquota: il testo dice una volta che la cella contiene 0,22 mostrato come percentuale; i
  formati dei numeri non sono spiegati in nessuna delle tre lezioni.
- Il tasto che fa passare da un tipo di riferimento all'altro (F4 in molti programmi) non è nominato: dipende dal
  programma e dalla tastiera.
- "Quadratino" per il quadratino di riempimento: i programmi lo chiamano in modi diversi.
- 9,8 è presentato come "i newton che pesa un chilogrammo", senza scrivere l'unità N/kg: la lezione di fisica sul
  peso non è tra quelle che si possono linkare da qui.

## Da verificare

- Tagliare e incollare una formula non ne cambia i riferimenti (vale in Excel, LibreOffice e Fogli Google, a quanto
  ricordo): da controllare su un programma.
- Il trascinamento del quadratino nell'angolo in basso a destra: uguale nei tre programmi, da controllare su Fogli
  Google dal telefono, dove il gesto è diverso.

## Domande per Andrea

- Aliquota IVA al 22% come esempio: va bene, o meglio un cambio di valuta, che non invecchia?
- I riferimenti misti a 14 anni: tenerli in questa lezione con la tavola pitagorica, o spostarli in fondo come
  approfondimento?
- Serve dire il tasto F4?
