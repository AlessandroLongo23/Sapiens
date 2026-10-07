# I linguaggi di markup

Generatore: `inf-markup` (`src/lib/exercises/v2/generators/inf-markup.ts`). Verifica indipendente:
`scripts/exercises/checkers/inf_markup.py`. Lezione collegata: `docs/lezioni/informatica/riscritte/87-inf-markup.md`.

Cinque livelli nell'ordine della lezione, tutti a scelta multipla. I frammenti di HTML e di Markdown stanno in
`listing` (sotto la domanda, al più 42 caratteri per riga) e nelle opzioni (`listingOption`, al più 34). Si usano solo
gli elementi della lezione: `h1`, `p`, `em`, `strong`, `ul`, `li`, `a`.

## Nomi dei livelli

1. Le parti di un elemento
2. Tag chiusi e annidati
3. L'albero degli elementi
4. Struttura, aspetto e istruzioni
5. Da Markdown a HTML

## Livello 1: le parti di un elemento

Un elemento con un attributo e un contenuto di solo testo, su una riga, per esempio
`<a href="concerti.html">I concerti</a>`. Si chiede una delle sei parti (un sesto ciascuna): il tag di apertura, il
tag di chiusura, il contenuto, il nome dell'attributo, il valore dell'attributo, il nome dell'elemento. Le opzioni
sono pezzi dello stesso elemento.

Distrattori: il tag di apertura senza l'attributo, l'attributo intero al posto del nome o del valore, il valore
scambiato con il contenuto, il tag di chiusura con la barra in fondo.

## Livello 2: tag chiusi e annidati

Un elemento (`p`, `li` o `h1`) con dentro del testo e un secondo elemento (`em` o `strong`), su tre righe.

- `giusto` (60%): quattro frammenti con le stesse parole, uno scritto bene e tre con un errore; si chiede quello
  scritto bene.
- `sbagliato` (40%): tre frammenti scritti bene, con parole diverse, e uno con un errore; si chiede quello sbagliato.

Gli errori sono sei: i due elementi accavallati; l'elemento interno non chiuso; il tag di chiusura senza barra; il
tag di chiusura con un altro nome; la barra in fondo al tag; l'elemento esterno chiuso senza barra.

Il controllo legge ogni frammento con un lettore severo, scritto per questo: un tag di chiusura deve avere il nome
dell'ultimo elemento aperto, niente attributi, e alla fine non deve restare aperto niente.

## Livello 3: l'albero degli elementi

Un elenco `ul` con da due a quattro voci `li`; almeno una voce, e in media metà, ha dentro un `em` o uno `strong`.

- `figli` (35%): quanti figli ha `ul` (le voci, non quello che c'è dentro).
- `elementi` (35%): quanti elementi ci sono in tutto ($1$ più le voci più gli elementi dentro le voci).
- `genitore` (30%): qual è il genitore di un `li` (cioè `ul`) o di un `em` o `strong` (cioè `li`).

Distrattori: i discendenti contati come figli, i tag contati al posto degli elementi, il nonno al posto del
genitore.

## Livello 4: struttura, aspetto e istruzioni

- `struttura` (30%) e `aspetto` (20%): quattro frasi su un pezzo di testo; una sola descrive la struttura ("è il
  titolo della pagina", "sono le voci di un elenco"), oppure una sola l'aspetto ("è in grassetto", "è centrata").
- `istruzione` (30%) e `marcato` (20%): quattro righe a larghezza fissa; una sola è un'istruzione di un programma
  (`x = x + 1`, `print(somma)`), oppure una sola è un testo marcato (`<p>Somma: 12</p>`, `# Risultati`). Tra i testi
  marcati ce ne sono alcuni che parlano di programmi (`<h1>x = x + 1</h1>`): restano testi.

## Livello 5: da Markdown a HTML

I quattro segni della lezione, un quarto ciascuno: `# Titolo` e `h1`; `*parola*` ed `em`; `**parola**` e `strong`;
due righe con il trattino e un `ul` con due `li`. Due volte su tre si dà il Markdown e si chiede l'HTML, le altre il
contrario.

Distrattori: `em` e `strong` scambiati; i `li` senza `ul`; il segno del Markdown messo tra `<` e `>`; il tag di
chiusura senza barra; un segno di un altro tipo.

## Da evitare

- Elementi che la lezione non ha ancora presentato (`ol`, `div`, `img`, tabelle).
- Frammenti che un browser mostra bene pur essendo sbagliati senza che la domanda parli di tag chiusi e annidati.
- Domande di memoria su sigle e date.
