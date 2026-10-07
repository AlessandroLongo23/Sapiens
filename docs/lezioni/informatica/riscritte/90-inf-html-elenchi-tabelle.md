# Elenchi e tabelle

Sulla pagina dei Fuori Tempo, il gruppo musicale della scuola, vanno tre cose che non sono paragrafi: i nomi dei quattro componenti, la scaletta del concerto di sabato e il calendario delle date. Scritte di fila dentro un `<p>` diventerebbero un blocco di testo in cui chi legge deve cercare dove finisce una voce e dove comincia la successiva. L'HTML ha elementi fatti apposta, che si aggiungono a quelli per [il testo, i link e le immagini](/materiale/scuola-superiore/informatica/il-linguaggio-html/testo-link-e-immagini): gli elenchi per le voci in fila, le tabelle per i dati che hanno righe e colonne.

## Elenchi puntati e numerati

Un **elenco puntato** si scrive con `<ul>` (unordered list, elenco non ordinato), e ogni sua voce con `<li>` (list item, voce di elenco). Il browser manda a capo ogni voce e le mette davanti un pallino. Un **elenco numerato** si scrive con `<ol>` (ordered list, elenco ordinato) e ha le stesse voci `<li>`: al posto del pallino c'è un numero, e a contare è il browser.

Per scegliere tra i due ti fai una domanda sola: se scambio due voci, cambia il significato? I componenti del gruppo si possono elencare in qualunque ordine, quindi vanno in un `<ul>`. La scaletta dice in che ordine si suonano i pezzi, quindi va in un `<ol>`.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <h2>Chi siamo</h2>
    <ul>
        <li>Sara, voce</li>
        <li>Marta, chitarra</li>
        <li>Dario, basso</li>
        <li>Leo, batteria</li>
    </ul>
    <h2>La scaletta di sabato</h2>
    <ol>
        <li>Controtempo</li>
        <li>Ultima campanella</li>
        <li>Fuori orario</li>
    </ol>
</body>
</html>
```

Prova tre modifiche, una alla volta. Sposta la riga di "Fuori orario" sopra quella di "Controtempo": i numeri si sistemano da soli, perché nel file non sono scritti. Aggiungi un quinto componente con un altro `<li>`. Infine cambia `<ul>` e `</ul>` in `<ol>` e `</ol>`: le voci restano le stesse e davanti a ciascuna compare un numero, che per un elenco di persone non vuol dire niente.

```ad-warning
I numeri non si scrivono a mano
Una voce scritta `<li>1. Controtempo</li>` dentro un `<ol>` diventa "1. 1. Controtempo", perché il browser aggiunge il suo numero al tuo. E in un `<ul>` un numero scritto a mano resta quello anche quando sposti la voce.
```

```ad-warning
Dentro un elenco ci sono solo voci
Tra `<ul>` e `</ul>`, come tra `<ol>` e `</ol>`, stanno solo elementi `<li>`: ogni parola dell'elenco va dentro una voce, mai tra una voce e l'altra. E un `<li>` ha senso solo dentro un elenco: fuori, il browser non sa di quale elenco è la voce.
```

## Un elenco dentro un altro

Il concerto di sabato ha due tempi, e ogni tempo ha i suoi pezzi. Una voce può contenere, oltre al suo testo, un elenco intero: si chiama **elenco annidato**. La regola è una: l'elenco interno si scrive dentro la voce a cui appartiene, prima del suo `</li>`.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>La scaletta</title>
</head>
<body>
    <h1>La scaletta di sabato</h1>
    <ol>
        <li>Primo tempo
            <ol>
                <li>Controtempo</li>
                <li>Ora buca</li>
            </ol>
        </li>
        <li>Secondo tempo
            <ol>
                <li>Ultima campanella</li>
                <li>Fuori orario</li>
            </ol>
        </li>
    </ol>
</body>
</html>
```

Nella pagina i pezzi sono rientrati sotto il loro tempo, e la numerazione ricomincia da 1 in ogni elenco interno: ogni `<ol>` conta solo le sue voci. Cambia i due `<ol>` interni in `<ul>` (con le loro chiusure) e guarda il pallino: per un elenco annidato il browser ne usa uno diverso da quello del primo livello.

L'[albero del documento](/materiale/scuola-superiore/informatica/il-linguaggio-html/struttura-di-una-pagina-html) spiega perché l'elenco interno sta dentro il `<li>`: è un figlio della voce "Primo tempo", allo stesso modo in cui le voci sono figlie dell'elenco.

```tikz
% nome: albero-elenco-annidato
% alt: L'albero della scaletta. In alto l'elemento ol. Da lui scendono due elementi li, con accanto i testi Primo tempo e Secondo tempo. Da ciascuno dei due li scende un altro elemento ol, e da ogni ol interno scendono due li: Controtempo e Ora buca sotto il primo, Ultima campanella e Fuori orario sotto il secondo. Gli elenchi interni sono colorati in modo diverso da quello esterno
\begin{tikzpicture}
\tikzset{
  fuori/.style={draw, thick, rounded corners=4pt, fill=orange!25, minimum height=0.5cm, minimum width=0.75cm, font=\small\ttfamily},
  dentro/.style={draw, thick, rounded corners=4pt, fill=blue!10, minimum height=0.5cm, minimum width=0.75cm, font=\small\ttfamily},
  tx/.style={font=\footnotesize, anchor=west}}
\node[fuori] (ol) at (0,0) {ol};
\node[fuori] (a) at (1.2,-0.8) {li};
\node[dentro] (oa) at (2.4,-1.6) {ol};
\node[dentro] (a1) at (3.6,-2.4) {li};
\node[dentro] (a2) at (3.6,-3.2) {li};
\node[fuori] (b) at (1.2,-4.0) {li};
\node[dentro] (ob) at (2.4,-4.8) {ol};
\node[dentro] (b1) at (3.6,-5.6) {li};
\node[dentro] (b2) at (3.6,-6.4) {li};
\node[tx] at (1.7,-0.8) {Primo tempo};
\node[tx] at (4.1,-2.4) {Controtempo};
\node[tx] at (4.1,-3.2) {Ora buca};
\node[tx] at (1.7,-4.0) {Secondo tempo};
\node[tx] at (4.1,-5.6) {Ultima campanella};
\node[tx] at (4.1,-6.4) {Fuori orario};
\draw[thick] (ol.south) |- (a.west) (ol.south) |- (b.west);
\draw[thick] (a.south) |- (oa.west) (oa.south) |- (a1.west) (oa.south) |- (a2.west);
\draw[thick] (b.south) |- (ob.west) (ob.south) |- (b1.west) (ob.south) |- (b2.west);
\end{tikzpicture}
```

```ad-warning
L'elenco interno dopo la chiusura della voce
Scrivere `</li>` e solo dopo aprire l'elenco interno lo mette tra una voce e l'altra, dove possono stare solo dei `<li>`. Chiudi la voce dopo l'elenco che contiene: il rientro del codice ti fa vedere subito se l'hai fatto.
```

## Le tabelle

Il calendario dei concerti non è un elenco: ogni concerto ha una data, un luogo e un prezzo, e chi legge vuole confrontare i luoghi tra loro e i prezzi tra loro. Sono dati con righe e colonne, come quelli di un [foglio di calcolo](/materiale/scuola-superiore/informatica/il-foglio-di-calcolo/celle-valori-e-formule), e per loro c'è la **tabella**.

Una tabella si scrive una riga alla volta, dall'alto in basso, e ogni riga una cella alla volta, da sinistra a destra. Gli elementi sono quattro:

- `<table>` racchiude tutta la tabella;
- `<tr>` (table row) è una riga;
- `<td>` (table data) è una cella con un dato;
- `<th>` (table header) è una cella di intestazione, cioè il titolo di una colonna o di una riga.

Le colonne non hanno un loro elemento: una colonna è fatta dalle celle che occupano lo stesso posto nelle varie righe, la prima di ogni riga, la seconda di ogni riga e così via. Per questo ogni riga deve avere lo stesso numero di celle. A questi elementi si aggiunge `<caption>`, la didascalia che dice che cosa contiene la tabella: si scrive subito dopo `<table>`, prima della prima riga.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I concerti</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <table>
        <caption>Concerti di primavera</caption>
        <tr>
            <th>Data</th>
            <th>Luogo</th>
            <th>Ingresso</th>
        </tr>
        <tr>
            <td>12 aprile</td>
            <td>Parco Verdi</td>
            <td>gratuito</td>
        </tr>
        <tr>
            <td>3 maggio</td>
            <td>Aula magna</td>
            <td>gratuito</td>
        </tr>
    </table>
</body>
</html>
```

```codice css
table { border-collapse: collapse; }
th, td { border: 1px solid gray; padding: 6px 12px; }
```

Le linee tra le celle non le disegna l'HTML: vengono dal file `style.css`, nella seconda linguetta, che per ora puoi usare senza leggerlo (i fogli di stile cominciano dalla lezione sulle [regole CSS](/materiale/scuola-superiore/informatica/i-fogli-di-stile/regole-e-selettori-css)). Le intestazioni invece sono in grassetto e centrate senza che nessuno l'abbia chiesto: è il modo in cui il browser mostra un `<th>`.

Aggiungi il concerto di fine anno, il 5 giugno in aula magna, a ingresso gratuito: serve un `<tr>` con tre `<td>`, prima di `</table>`. Poi cancella una cella da una riga e guarda che cosa succede: le celle rimaste scivolano a sinistra, la riga resta più corta e i dati finiscono sotto l'intestazione sbagliata.

```ad-warning
Una cella fuori dalla sua riga
Un `<td>` o un `<th>` sta sempre dentro un `<tr>`, e un `<tr>` sempre dentro la tabella. Il testo scritto tra una riga e l'altra, fuori dalle celle, il browser lo sposta fuori dalla tabella, di solito sopra.
```

```ad-warning
La tabella non serve a impaginare
Una tabella è per i dati che hanno righe e colonne: un orario, un calendario, una classifica. Usarla per mettere un menu a sinistra e il testo a destra confonde chi ascolta la pagina con un lettore di schermo, il programma che la legge ad alta voce: lo sente leggere una cella dopo l'altra, come dati. Per [disporre le parti di una pagina](/materiale/scuola-superiore/informatica/i-fogli-di-stile/l-impaginazione-di-una-pagina-web) c'è il CSS.
```

## Celle unite

Passato il concerto di aprile, il calendario si allunga: dopo il 3 maggio e il 5 giugno, tutti e due in aula magna, c'è una data del 20 giugno con luogo e ingresso ancora da definire. Scrivere due volte "da definire" in due celle vicine funziona, ma una cella sola larga due colonne dice meglio come stanno le cose. Una cella si allarga con due attributi:

- `colspan="2"` la fa occupare due colonne, cioè anche il posto alla sua destra;
- `rowspan="2"` la fa occupare due righe, cioè anche il posto sotto di lei.

Che cosa succede alla cella di cui ha preso il posto? Nella figura è già scelta la prima "da definire": premi "Unisci a destra". Poi tocca la prima "Aula magna" e premi "Unisci in basso". Ogni volta guarda quale riga del codice viene barrata, e in quale `<tr>` si trova.

```interattivo
% nome: inf-html-celle-unite
% alt: La tabella dei concerti, con tre colonne e quattro righe, accanto al suo codice HTML. Lo studente sceglie una cella e la unisce a quella alla sua destra o a quella sotto: la cella si allarga, nella sua riga del codice compare colspan o rowspan, e la riga della cella assorbita viene barrata. Una frase dice quante celle restano scritte nella riga e come i posti tornano uguali al numero di colonne
```

La cella assorbita sparisce dal codice: non resta vuota, non si scrive più. Con `colspan` sparisce dalla stessa riga, che passa da tre celle a due. Con `rowspan` sparisce dalla riga sotto, ed è il caso che inganna: quella riga ha due `<td>` e sembra sbagliata, ma il terzo posto è già occupato dalla cella che scende da sopra. Per controllare una tabella con celle unite fai il conto dei posti, riga per riga: i `colspan` delle celle scritte (1 per quelle senza attributo), più i posti presi dalle celle che scendono da sopra, devono dare il numero di colonne.

```ad-warning
Unire senza cancellare
Chi aggiunge `colspan="2"` e lascia nella riga la cella accanto si ritrova una riga con quattro posti in una tabella di tre colonne: l'ultima cella sporge a destra, fuori dalle intestazioni.
```

## Prova tu

I tre passi della prova generale sono scritti come paragrafi. Trasformali in un elenco numerato, poi dentro la voce "Provare i suoni" aggiungi un elenco puntato con due voci: Voce e Chitarra.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Prova generale</title>
</head>
<body>
    <h1>Prova generale</h1>
    <p>Montare gli strumenti</p>
    <p>Provare i suoni</p>
    <p>Suonare la scaletta</p>
</body>
</html>
%% soluzione
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Prova generale</title>
</head>
<body>
    <h1>Prova generale</h1>
    <ol>
        <li>Montare gli strumenti</li>
        <li>Provare i suoni
            <ul>
                <li>Voce</li>
                <li>Chitarra</li>
            </ul>
        </li>
        <li>Suonare la scaletta</li>
    </ol>
</body>
</html>
%% controllo I tre passi sono le voci di un elenco numerato
body > ol > li | quanti = 3
p | non esiste
%% controllo Dentro la seconda voce c'è un elenco puntato con due voci
body > ol > li:nth-child(2) > ul > li | quanti = 2
%% controllo Le due voci sono Voce e Chitarra
ol ul > li:first-child | testo = Voce
ol ul > li:last-child | testo = Chitarra
```

La tabella delle prove di aprile ha solo la prima riga di dati. Aggiungi la didascalia "Prove di aprile" e una riga per la prova di giovedì 16, alle 15:00, in Aula 12.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Le prove</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <table>
        <tr>
            <th>Giorno</th>
            <th>Ora</th>
            <th>Aula</th>
        </tr>
        <tr>
            <td>lunedì 13</td>
            <td>14:30</td>
            <td>Aula 12</td>
        </tr>
    </table>
</body>
</html>
%% soluzione
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Le prove</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <table>
        <caption>Prove di aprile</caption>
        <tr>
            <th>Giorno</th>
            <th>Ora</th>
            <th>Aula</th>
        </tr>
        <tr>
            <td>lunedì 13</td>
            <td>14:30</td>
            <td>Aula 12</td>
        </tr>
        <tr>
            <td>giovedì 16</td>
            <td>15:00</td>
            <td>Aula 12</td>
        </tr>
    </table>
</body>
</html>
%% controllo La tabella ha la didascalia "Prove di aprile"
table > caption | testo = Prove di aprile
%% controllo Le righe sono tre, e l'ultima ha tre celle di dati
table tr | quanti = 3
table tr:last-child > td | quanti = 3
%% controllo La nuova riga comincia con "giovedì 16"
table tr:last-child > td:first-child | testo = giovedì 16
```

```codice css
table { border-collapse: collapse; }
th, td { border: 1px solid gray; padding: 6px 12px; }
```

Nell'orario qui sotto "Aula 12" è scritta due volte, una sotto l'altra, e giovedì la prova è sospesa. Scrivi "Aula 12" una volta sola, in una cella che occupa due righe, e al posto dei due trattini di giovedì metti una sola cella "Prova sospesa" che occupa due colonne.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Orario delle prove</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <table>
        <tr>
            <th>Giorno</th>
            <th>Ora</th>
            <th>Aula</th>
        </tr>
        <tr>
            <td>lunedì</td>
            <td>14:30</td>
            <td>Aula 12</td>
        </tr>
        <tr>
            <td>mercoledì</td>
            <td>16:00</td>
            <td>Aula 12</td>
        </tr>
        <tr>
            <td>giovedì</td>
            <td>-</td>
            <td>-</td>
        </tr>
    </table>
</body>
</html>
%% soluzione
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Orario delle prove</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <table>
        <tr>
            <th>Giorno</th>
            <th>Ora</th>
            <th>Aula</th>
        </tr>
        <tr>
            <td>lunedì</td>
            <td>14:30</td>
            <td rowspan="2">Aula 12</td>
        </tr>
        <tr>
            <td>mercoledì</td>
            <td>16:00</td>
        </tr>
        <tr>
            <td>giovedì</td>
            <td colspan="2">Prova sospesa</td>
        </tr>
    </table>
</body>
</html>
%% controllo "Aula 12" è scritta una volta sola, in una cella alta due righe
td[rowspan="2"] | testo = Aula 12
table tr:nth-child(3) > td | quanti = 2
%% controllo "Prova sospesa" occupa due colonne, e la sua riga ha due celle
td[colspan="2"] | testo = Prova sospesa
table tr:nth-child(4) > td | quanti = 2
```

```codice css
table { border-collapse: collapse; }
th, td { border: 1px solid gray; padding: 6px 12px; }
```
