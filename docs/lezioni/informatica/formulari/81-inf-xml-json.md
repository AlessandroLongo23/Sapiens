# Formulario: Dati strutturati: XML e JSON

## I dati ad albero

Un dato con parti dentro altre parti ha la forma di un albero: sono i dati strutturati.

| Parola | Che cos'è |
|---|---|
| Nodo | una parte del dato |
| Radice | il nodo da cui parte tutto |
| Figli | i nodi che stanno sotto un altro |
| Foglia | un nodo senza figli: un valore |

## XML

Ogni nodo è un elemento: tag di apertura, contenuto (un testo o altri elementi), tag di chiusura con la barra. Un attributo sta nel tag di apertura, con il valore tra virgolette.

```xml
<studente classe="3B">
  <nome>Anna</nome>
  <voti>
    <voto>8</voto>
    <voto>6</voto>
  </voti>
</studente>
```

Un documento è ben formato quando:

1. ha un solo elemento radice, che contiene tutti gli altri;
2. ogni tag aperto è chiuso con lo stesso nome, maiuscole comprese;
3. l'ultimo elemento aperto è il primo a chiudersi;
4. i valori degli attributi sono tra virgolette.

## JSON

| Pezzo | Come si scrive | Esempio |
|---|---|---|
| Oggetto | coppie tra parentesi graffe, separate da virgole | `{ "nome": "Anna", "eta": 16 }` |
| Coppia | nome tra virgolette doppie, due punti, valore | `"nome": "Anna"` |
| Array | valori tra parentesi quadre, separati da virgole | `[8, 6, 7]` |
| Testo | tra virgolette doppie | `"3B"` |
| Numero | senza virgolette, con il punto per i decimali | `7.5` |
| Vero, falso, niente | senza virgolette | `true`, `false`, `null` |

```json
{
  "nome": "Anna",
  "classe": "3B",
  "voti": [8, 6]
}
```

## Dall'albero ai due formati

| Nell'albero | In XML | In JSON |
|---|---|---|
| un nodo con figli che hanno nomi diversi | un elemento che contiene altri elementi | un oggetto |
| una lista di figli dello stesso tipo | elementi con lo stesso nome, uno dopo l'altro | un array |
| una foglia | il testo dentro un elemento, o un attributo | un valore |

## Leggere un file JSON con un programma

```python
import json
with open("studente.json") as file:
    dati = json.load(file)
print(dati["nome"], dati["voti"][0])
```

Un oggetto diventa un dizionario (`dati["nome"]`), un array una lista (`dati["voti"][0]`); i numeri sono già numeri.

## Quale formato

| | CSV | XML | JSON |
|---|---|---|---|
| Forma dei dati | una tabella | un albero | un albero |
| Nomi dei campi | una volta, nell'intestazione | a ogni elemento, due volte | a ogni valore, una volta |
| Tipi dei valori | tutto testo | tutto testo | testi, numeri, vero o falso |

```ad-warning
Tag incrociati
`<voti><voto>8</voti></voto>` non è ben formato: si chiude per primo l'ultimo tag aperto.
```

```ad-warning
Gli errori più comuni in JSON
La virgola dopo l'ultima voce, gli apici singoli, il nome di una coppia senza virgolette.
```

```ad-warning
Un solo errore basta
Chi legge XML o JSON si ferma al primo errore e non restituisce niente.
```
