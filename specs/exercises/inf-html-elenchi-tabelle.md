# inf-html-elenchi-tabelle: Elenchi e tabelle

Generatore: `src/lib/exercises/v2/generators/inf-html-elenchi-tabelle.ts` (con `inf-codice.ts`). Verifica
indipendente: `scripts/exercises/checkers/inf_html_elenchi_tabelle.py`, che legge i frammenti con
`checkers/_inf_html11.py`. Lezione: `docs/lezioni/informatica/riscritte/90-inf-html-elenchi-tabelle.md`.

Sei livelli, tutti a scelta multipla con quattro opzioni (`answer.kind = 'choice'`), in testo semplice
(`format: 'text'`). Ogni domanda mostra un frammento di HTML sotto il testo (`listing`) oppure ha frammenti come
opzioni (`ChoiceOption.listing`); non c'è niente da eseguire e nessun livello ha la risposta aperta. `params.case`
dice il caso.

I frammenti hanno un elemento per riga e il rientro di due spazi (la lezione ne usa quattro: qui lo spazio è quello
di un telefono). Un frammento sotto la domanda ha al più 18 righe di 42 caratteri, un'opzione al più 10 righe di 34.
Il controllo legge i frammenti così come sono scritti, senza le riparazioni che farebbe un browser: una cella fuori
dalla riga resta fuori dalla riga.

## Livello 1: puntato o numerato

Dodici elenchi con quattro voci ciascuno, sei puntati (i componenti di un gruppo, gli ingredienti di una macedonia)
e sei numerati (i passi di una ricetta, la classifica di un torneo); ne escono tre voci, per un elenco numerato
nell'ordine in cui sono date. Due casi, metà ciascuno.

- `scegli`: "In una pagina devi mettere la classifica di un torneo, dal primo posto in giù: Leoni, Lupi, Orsi, in
  quest'ordine. Quale frammento HTML va bene?" La frase "in quest'ordine" c'è solo quando serve `<ol>`. Opzioni:
  quattro frammenti. Giusto: `<ol>` (o `<ul>`) con un `<li>` per voce. Sbagliati: l'altro tipo di elenco (sempre
  presente), le voci senza `<li>`, tag inventati (`<list>`, `<item>`), le voci in `<p>`; per un elenco numerato anche
  i numeri scritti a mano dentro `<ol>` o dentro `<ul>`; per uno puntato i `<li>` senza elenco intorno.
- `vede`: sotto la domanda un elenco, a volte (una su tre) con i numeri scritti a mano nelle voci. "Che cosa mostra
  il browser?" Opzioni: quello che si vede, una voce per riga. Giusto: un numero o un pallino, poi il testo della
  voce com'è scritto (`<li>1. basso</li>` in un `<ol>` dà "1. 1. basso"). Sbagliati: l'altro segno, i numeri in più
  o in meno, le voci senza segno, le voci tutte su una riga.

## Livello 2: elenchi annidati

Quattro temi (scaletta, spesa, gita, gruppo), ciascuno con tre voci che hanno tre sottovoci loro. Un elenco di due o
tre voci, almeno una con un elenco dentro di due o tre voci, in al più 18 righe. Cinque casi, un quinto ciascuno.

- `esterne`: "Quante voci ha l'elenco più esterno?" Distrattori: tutti i `<li>`, le sole voci interne.
- `interne`: "Quante voci ha l'elenco annidato dentro la voce "Terzo giorno"?" Distrattori: le voci esterne, tutti
  i `<li>`.
- `tutte`: "Quanti elementi `<li>` ci sono in tutto nel frammento?" Distrattori: le sole voci esterne, le sole
  interne.
- `numeri`: un `<ol>` con una sola voce che contiene un elenco di due voci, `<ol>` (due volte su tre) o `<ul>`. "Che
  numeri mette il browser davanti alle voci "Ultimo banco" e "Rientro"?" Giusto: "1 e 2" per un `<ol>` (ogni elenco
  conta le sue voci), "nessun numero: hanno un pallino" per un `<ul>`. Distrattori: la numerazione che prosegue,
  "2.1 e 2.2".
- `bene`: "Quale frammento mette l'elenco con carote e zucchine dentro la voce "Verdura"?" Opzioni: quattro
  frammenti con due voci esterne. Giusto: l'elenco interno dopo il testo della voce e prima del suo `</li>`.
  Sbagliati: l'elenco interno dopo `</li>`, tra due voci (sempre presente, è l'errore dell'avviso); le voci interne
  senza elenco intorno; l'elenco interno dopo la chiusura di quello esterno; il testo della voce sciolto nell'elenco.

## Livello 3: righe e colonne

Cinque temi (concerti, classifica, prove, mensa, voti) con quattro intestazioni e tre righe di dati. La tabella ha
una riga di `<th>` e da una a tre righe di `<td>`, con due, tre o quattro colonne (al più 18 righe di codice: 2
colonne con 1-3 righe di dati, 3 con 1-2, 4 con 1). Quattro casi, un quarto ciascuno.

- `righe`: "Quante righe ha la tabella, contando anche quella delle intestazioni?" Risposta: i `<tr>`.
- `colonne`: "Quante colonne ha la tabella?" Risposta: le celle di una riga.
- `celle`: "Quante celle di dati, cioè quanti `<td>`, ha la tabella?"
- `intestazione`: "Sotto quale intestazione compare "9"?" Il dato è scritto una volta sola nella tabella e non sta
  nella prima colonna. Opzioni: le intestazioni della tabella, quelle del tema che la tabella non usa, il primo dato
  della riga, "sotto nessuna".

Distrattori dei conti: righe e colonne scambiate, il prodotto, le celle contando anche le intestazioni.

## Livello 4: scrivere una tabella

Opzioni: quattro frammenti. Due casi, metà ciascuno.

- `struttura`: "Quale frammento mostra una tabella con le celle di intestazione "Orale" e "Pratico" e, sotto, le
  celle di dati "7" e "8"?" Giusto: due `<tr>`, il primo con due `<th>`, il secondo con due `<td>` (10 righe).
  Sbagliati: la tabella scritta una colonna alla volta (sempre presente), le celle senza `<tr>`, tag inventati
  (`<row>`, `<cell>`), `<th>` e `<td>` scambiati, una riga con una cella sola, i dati sopra le intestazioni.
- `didascalia`: "Quale frammento dà alla tabella la didascalia "Mensa"?" Giusto: `<caption>` subito dopo `<table>`.
  Sbagliati: `<caption>` prima di `<table>`, dopo `</table>`, dentro un `<tr>`; `<title>`; un attributo `caption`;
  un `<h2>` dentro la tabella. Una `<caption>` in fondo alla tabella, che i browser mostrano lo stesso, non è tra le
  opzioni.

## Livello 5: celle larghe, colspan

Il conto dei posti della lezione: i `colspan` delle celle di una riga (1 per chi non lo ha) danno il numero di
colonne. Due casi, metà ciascuno.

- `colonne`: sotto la domanda la prima riga di una tabella: due intestazioni con `colspan` da 2 a 4 (Sabato e
  Domenica, Mattina e Pomeriggio) e, due volte su tre, una prima cella senza attributi. "Quante colonne ha la
  tabella?" Risposta: la somma. Distrattori: il numero di celle scritte (sempre presente), la somma senza la cella
  normale, il prodotto, il colspan più grande.
- `riga`: "Una tabella ha 4 colonne: Data, Luogo, Ingresso, Ora. Quale riga la completa bene, con una sola cella
  "vacanza" che occupa le colonne Luogo, Ingresso e Ora?" La cella larga prende da 2 colonne a tutte tranne la
  prima. Opzioni: quattro righe. Giusta: le celle prima, la cella con `colspan`, le celle dopo. Sbagliate: `colspan`
  senza cancellare le celle assorbite (sempre presente), `rowspan` al posto di `colspan`, un `colspan` troppo
  grande, la cella senza attributo, l'attributo inventato `span`, `colspan` sul `<tr>`.

## Livello 6: celle alte, rowspan

Una cella con `rowspan` occupa un posto anche nelle righe sotto, e lì non si scrive. Due casi, metà ciascuno.

- `mancano`: una tabella di 3 o 4 colonne con le intestazioni, una riga in cui una o due celle hanno `rowspan="2"`
  (o `"3"`), e un terzo `<tr>` con il solo commento `<!-- quante celle? -->`. "Quante celle vanno scritte nella riga
  con il commento, perché la tabella sia giusta?" Risposta: le colonne meno le celle che scendono. Distrattori: il
  numero di colonne (sempre presente), le colonne meno il valore di `rowspan`.
- `colonna`: una tabella di 3 colonne; nella seconda riga una cella ha `rowspan="2"`, e la terza riga ha due celle.
  "Sotto quale intestazione compare "pesce"?" Le due celle occupano i posti rimasti liberi, da sinistra. Opzioni: le
  tre intestazioni e "sotto nessuna: la riga è sbagliata". Il dato è scritto una volta sola.

## Vincoli

- Quattro opzioni diverse, una sola giusta: nei livelli con frammenti come opzioni il controllo legge ogni frammento
  e verifica che solo quello giusto sia scritto bene.
- Le quote dei casi sono quelle scritte sopra.
- Niente trattini lunghi e niente "piuttosto che", anche nelle opzioni.

## Da evitare

Un dato scritto due volte nella tabella quando la domanda chiede dove sta; opzioni che un browser mostrerebbe bene
pur essendo scritte male e che la lezione non chiama errore (la `<caption>` in fondo alla tabella); domande di
memoria sui nomi dei tag senza un frammento da leggere.
