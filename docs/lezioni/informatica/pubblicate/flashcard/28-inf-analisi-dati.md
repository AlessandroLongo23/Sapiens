# Flashcard: Ordinare, filtrare e riassumere i dati

## intestazione-definizione
Che cos'è l'intestazione di una tabella di dati?
---
La prima riga, che contiene il nome di ogni colonna.

## record-definizione
Che cos'è un record?
---
Una riga della tabella, che descrive una cosa sola: una vendita, uno studente, un brano.

## campo-definizione
Che cos'è un campo?
---
Una colonna della tabella, che contiene lo stesso tipo di dato per tutti i record.

## record-conteggio
Una tabella occupa le righe da 1 a 9, intestazione compresa. Quanti record ha?
---
8. La riga 1 è l'intestazione, i record sono nelle righe da 2 a 9.

## riga-vuota
Vero o falso: una riga vuota in mezzo alla tabella non dà problemi.
---
Falso. Il foglio considera finita la tabella alla prima riga vuota, e i record che stanno sotto restano fuori.

## ordine-crescente
Che cosa vuol dire ordine crescente?
---
Dal più piccolo al più grande per i numeri, dalla A alla Z per i testi.

## ordinare-record-interi
Quando si ordina una tabella, che cosa succede alle celle di una stessa riga?
---
Restano insieme: ogni record si sposta intero.

## ordinare-una-colonna
Che cosa succede se si ordina una sola colonna selezionata e non tutta la tabella?
---
I valori di quella colonna si spostano e gli altri no: ogni dato finisce accanto alla riga sbagliata.

## ordinare-decrescente-primo
Gli incassi sono 30, 18, 25 e 42. Dopo un ordinamento decrescente, quale sta nella riga 2, sotto l'intestazione?
---
42, il più grande.

## due-livelli
In un ordinamento su due livelli, che cosa fa il secondo livello?
---
Mette in ordine i record che nel primo livello sono alla pari, senza mescolare i gruppi.

## due-livelli-esempio
Si ordina per Classe dalla A alla Z e poi per Incasso decrescente. Viene prima il 18 della 1A o il 36 della 1B?
---
Il 18 della 1A. Il primo livello è la classe: tutta la 1A viene prima della 1B.

## filtro-definizione
Che cosa fa un filtro?
---
Mostra solo i record che rispettano una condizione e nasconde gli altri.

## filtro-non-cancella
Vero o falso: un filtro cancella le righe che non rispettano la condizione.
---
Falso. Le nasconde: tolto il filtro, tornano tutte.

## filtro-maggiore
Con il filtro "Incasso maggiore di 20", una riga con incasso 20 resta visibile?
---
No. 20 non è maggiore di 20.

## due-filtri
Due filtri sono attivi insieme. Quali record restano visibili?
---
Solo quelli che rispettano tutte e due le condizioni.

## somma-con-filtro
Con un filtro attivo, `=SOMMA(C2:C9)` somma solo le righe visibili?
---
No, le somma tutte, anche quelle nascoste. Per sommare solo le visibili c'è `=SUBTOTALE(9;C2:C9)`.

## subtotale-definizione
Che cos'è un subtotale?
---
Il totale di un gruppo di record, per esempio l'incasso di una sola classe.

## subtotali-prima-ordinare
Che cosa si fa prima di chiedere i subtotali?
---
Si ordina la tabella secondo il campo dei gruppi, così i record di ogni gruppo sono vicini.

## totale-complessivo
I subtotali di tre classi sono 80, 81 e 37. Quanto vale il totale complessivo?
---
198, la somma dei tre.

## pivot-tre-posti
Quali tre cose si scelgono per costruire una tabella pivot?
---
Il campo delle righe, il campo delle colonne e il campo dei valori, con la funzione per riassumerlo.
