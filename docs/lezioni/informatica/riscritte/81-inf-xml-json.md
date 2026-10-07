# Dati strutturati: XML e JSON

La scheda di una studentessa nel registro dice il nome, la classe e i voti: tre voti oggi, cinque tra un mese. In un [file CSV](/materiale/scuola-superiore/informatica/i-file/file-di-dati-in-formato-csv) ogni riga ha gli stessi campi e ogni campo contiene un valore solo, quindi una lista che si allunga non ha un posto suo: o prepari le colonne `voto1`, `voto2`, `voto3` e speri che bastino, o scrivi una riga per ogni voto ripetendo ogni volta nome e classe.

Il problema non è il separatore, è la forma. Una tabella è piatta; la scheda ha dei dati dentro altri dati, e per scriverla servono formati che sappiano dire "questo sta dentro quello".

## Quando una tabella non basta

Un dato fatto di parti, che a loro volta hanno delle parti, ha la forma di un **albero**, la stessa delle [cartelle del file system](/materiale/scuola-superiore/informatica/il-sistema-operativo/il-file-system-file-cartelle-e-percorsi). Ogni parte è un **nodo**; il nodo da cui parte tutto è la **radice**; i nodi che stanno sotto un altro sono i suoi **figli**, e un nodo senza figli è una **foglia**. Nella scheda la radice è lo studente, i suoi figli sono il nome, la classe e i voti, e le foglie sono i valori. I dati con questa forma si chiamano **dati strutturati**, e i due formati più usati per scriverli in un file di testo sono XML e JSON: dicono le stesse cose, con due scritture diverse.

```tikz
% nome: albero-dato-studente
% alt: Albero di un dato. In alto la radice, studente, con tre figli: nome, classe e voti. Sotto nome c'è la foglia Anna, sotto classe la foglia 3B, sotto voti tre foglie con i numeri 8, 6 e 7. I nodi con dei figli hanno gli angoli arrotondati, le foglie gli angoli vivi
\begin{tikzpicture}
\tikzset{nodo/.style={draw, thick, rounded corners=4pt, fill=blue!10, minimum height=0.55cm, inner xsep=5pt, font=\small\ttfamily}, foglia/.style={draw, thick, fill=orange!25, minimum height=0.55cm, minimum width=0.6cm, inner xsep=4pt, font=\small\ttfamily}}
\node[nodo] (s) at (0,0) {studente};
\node[nodo] (n) at (-2.4,-1.1) {nome}; \node[nodo] (c) at (-0.7,-1.1) {classe}; \node[nodo] (v) at (1.7,-1.1) {voti};
\node[foglia] (a) at (-2.4,-2.2) {Anna}; \node[foglia] (b) at (-0.7,-2.2) {3B};
\node[foglia] (v1) at (0.7,-2.2) {8}; \node[foglia] (v2) at (1.7,-2.2) {6}; \node[foglia] (v3) at (2.7,-2.2) {7};
\draw[thick] (s) -- (n) (s) -- (c) (s) -- (v) (n) -- (a) (c) -- (b) (v) -- (v1) (v) -- (v2) (v) -- (v3);
\end{tikzpicture}
```

## XML: i dati tra i tag

In **XML** (Extensible Markup Language) ogni nodo è un **elemento**: un tag di apertura con il nome tra parentesi angolari, il contenuto, e un tag di chiusura con lo stesso nome preceduto dalla barra. Il contenuto può essere un testo oppure altri elementi, ed è così che un dato sta dentro un altro.

```xml
<studente>
  <nome>Anna</nome>
  <classe>3B</classe>
  <voti>
    <voto>8</voto>
    <voto>6</voto>
    <voto>7</voto>
  </voti>
</studente>
```

I tag li hai già incontrati nell'[HTML](/materiale/scuola-superiore/informatica/internet-e-il-web/il-web-ipertesti-url-e-protocollo-http), dove hanno nomi fissati e descrivono una pagina. In XML i nomi li sceglie chi progetta i dati: `studente`, `voto`, `brano`. Un'informazione breve su un elemento si può scrivere anche come **attributo**, dentro il tag di apertura, con il valore tra virgolette: `<studente classe="3B">`. I rientri servono solo a chi legge.

Un documento XML è **ben formato** quando rispetta quattro regole:

- c'è un solo elemento radice, che contiene tutti gli altri;
- ogni tag aperto viene chiuso con lo stesso nome, maiuscole comprese: `<Voto>` e `</voto>` sono due nomi diversi;
- gli elementi si chiudono in ordine inverso a come sono stati aperti, cioè l'ultimo aperto è il primo a chiudersi;
- il valore di un attributo sta sempre tra virgolette.

Un browser, davanti a una pagina HTML con un errore, mostra quello che riesce. Un programma che legge XML fa il contrario: al primo errore si ferma e non restituisce niente. La severità ha una ragione: chi scrive il programma non deve indovinare che cosa intendeva chi ha scritto il file.

```ad-warning
Tag incrociati
In `<voti><voto>8</voti></voto>` l'elemento `voto` è stato aperto dentro `voti` ma viene chiuso fuori: i due elementi si accavallano, e nessun albero è fatto così. Chiudi sempre per primo l'ultimo tag che hai aperto: `<voti><voto>8</voto></voti>`.
```

## JSON: oggetti, array e valori

**JSON** (JavaScript Object Notation) scrive lo stesso albero con meno segni. Un **oggetto** sta tra parentesi graffe ed è un elenco di coppie: un nome tra virgolette doppie, i due punti, un valore. Un **array** sta tra parentesi quadre ed è una lista ordinata di valori. In tutti e due le voci si separano con la virgola.

```json
{
  "nome": "Anna",
  "classe": "3B",
  "voti": [8, 6, 7]
}
```

Un valore può essere un testo tra virgolette doppie, un numero (con il punto per i decimali: `7.5`), `true` o `false`, `null` quando il valore manca, oppure un altro oggetto o un altro array. L'albero nasce da qui: dentro un oggetto può starci un array, dentro l'array altri oggetti. Le virgolette distinguono i tipi: `8` è un numero, `"8"` è un testo.

```ad-warning
Tre errori che rendono illeggibile un file JSON
La virgola dopo l'ultima voce, come in `[8, 6, 7,]`; gli apici singoli al posto delle virgolette doppie, `'nome'`; il nome di una coppia scritto senza virgolette, `nome: "Anna"`. Come per XML, chi legge si ferma al primo errore.
```

## Lo stesso dato in tre modi

La figura mette vicini l'albero, l'XML e il JSON della scheda di Anna. Tocca un nodo dell'albero e guarda quale pezzo si accende negli altri due: comincia da `voti`, poi tocca un singolo voto, poi `nome` e la foglia `Anna`.

```interattivo
% nome: inf-albero-xml-json
% alt: Tre riquadri con lo stesso dato. In alto l'albero: la radice studente con i figli nome, classe e voti, e sotto le foglie Anna, 3B e i tre voti 8, 6 e 7. Sotto, affiancati, il testo XML con gli elementi studente, nome, classe, voti e tre elementi voto, e il testo JSON con un oggetto che ha le coppie nome, classe e voti, quest'ultima con l'array 8, 6, 7. Toccando un nodo dell'albero o un pezzo di testo si accende la parte corrispondente in tutti e tre, insieme a quello che contiene, e una frase dice come la scrivono i due formati: toccando voti si accendono l'elemento voti con i suoi tre elementi voto e, nel JSON, la coppia voti con il suo array
```

| Nell'albero | In XML | In JSON |
|---|---|---|
| un nodo con figli che hanno nomi diversi | un elemento che contiene altri elementi | un oggetto, tra `{` e `}` |
| una lista di figli dello stesso tipo | elementi con lo stesso nome, uno dopo l'altro | un array, tra `[` e `]` |
| una foglia | il testo dentro un elemento, o un attributo | un valore: testo, numero, `true`, `false`, `null` |

Le differenze si vedono sui voti. XML dà un nome a ogni elemento della lista e lo scrive due volte, in apertura e in chiusura; JSON scrive solo i valori, e a distinguerli è la posizione. In XML ogni foglia è un testo, e chi legge deve convertire `8` in un numero come con un file CSV; in JSON il tipo è scritto nel dato.

## Leggere un file JSON con un programma

Qui i programmi sono solo in Python, che ha il modulo `json` già pronto; in C++ servirebbe una libreria da installare a parte. La funzione `json.load` legge tutto il file e ricostruisce l'albero: un array diventa una lista, e un oggetto diventa un dizionario, un contenitore in cui un valore si prende con il suo nome tra parentesi quadre, come in un vettore si prende con l'indice.

```codice python
import json
with open("studente.json") as file:
    dati = json.load(file)
somma = 0
for voto in dati["voti"]:
    somma = somma + voto
print(dati["nome"], "ha", len(dati["voti"]), "voti")
print("Media:", somma / len(dati["voti"]))
```

```codice studente.json
{
  "nome": "Anna",
  "classe": "3B",
  "voti": [8, 6, 7]
}
```

Nel programma non c'è nessun `split` e nessuna conversione: i voti arrivano già come numeri, in una lista. Aggiungi un 10 ai voti nel file ed esegui di nuovo, poi cancella una virgola: il programma si ferma con un `JSONDecodeError`, che indica la riga e la colonna dove la lettura si è interrotta.

## CSV, XML o JSON?

| | CSV | XML | JSON |
|---|---|---|---|
| Forma dei dati | una tabella | un albero | un albero |
| Nomi dei campi | una volta sola, nell'intestazione | a ogni elemento, due volte | a ogni valore, una volta |
| Tipi dei valori | tutto testo | tutto testo | testi, numeri, vero o falso |
| Dove lo incontri | dati esportati da un foglio di calcolo | documenti, immagini vettoriali, fatture elettroniche | dati scambiati tra un'app e il suo server, file di impostazioni |

Scritta senza spazi, la scheda di Anna occupa 13 caratteri come riga di un file CSV (`Anna,3B,8,6,7`), 44 in JSON e 112 in XML. I caratteri in più sono i nomi: un file CSV non si capisce senza la sua intestazione, mentre in XML e in JSON ogni valore porta con sé il proprio nome, e il file si spiega da solo. Se i dati sono una tabella, CSV resta la scelta più leggera; se hanno parti dentro altre parti, serve un albero, e tra i due formati sceglie di solito chi riceve i dati.

## Prova tu

Il file `gita.xml` non è ben formato: ha tre errori. Il programma `main.py` è già scritto e non va cambiato: legge il file e si ferma al primo errore, indicando riga e colonna. Correggi il file finché il programma stampa la meta, il numero degli iscritti e i loro nomi.

```codice gita.xml
<gita meta=Torino>
  <iscritto>Anna</iscritto>
  <iscritto>Luca<iscritto>
  <Iscritto>Sara</iscritto>
</gita>
%% soluzione
<gita meta="Torino">
  <iscritto>Anna</iscritto>
  <iscritto>Luca</iscritto>
  <iscritto>Sara</iscritto>
</gita>
```

```codice main.py
import xml.etree.ElementTree as ET

gita = ET.parse("gita.xml").getroot()
print(gita.get("meta"), len(gita), "iscritti")
for iscritto in gita:
    print(iscritto.text)
%% prova
%% stampa
Torino 3 iscritti
Anna
Luca
Sara
```

Nel secondo esercizio traduci un dato da XML a JSON. Una playlist è scritta così:

```xml
<playlist titolo="Estate">
  <brano durata="187">Onde</brano>
  <brano durata="204">Alba</brano>
</playlist>
```

Completa `playlist.json` con lo stesso dato: l'oggetto ha già il `titolo`, e gli manca la coppia `brani`, un array di due oggetti, ciascuno con un `titolo` e una `durata` in secondi. Il programma somma le durate, quindi devono essere numeri.

```codice playlist.json
{
  "titolo": "Estate"
}
%% soluzione
{
  "titolo": "Estate",
  "brani": [
    { "titolo": "Onde", "durata": 187 },
    { "titolo": "Alba", "durata": 204 }
  ]
}
```

```codice main.py
import json

with open("playlist.json") as file:
    playlist = json.load(file)
secondi = 0
for brano in playlist["brani"]:
    secondi = secondi + brano["durata"]
print(playlist["titolo"], len(playlist["brani"]), "brani")
print(secondi, "secondi")
%% prova
%% stampa
Estate 2 brani
391 secondi
```
