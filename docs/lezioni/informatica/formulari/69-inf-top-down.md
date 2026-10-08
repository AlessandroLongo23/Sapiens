# Formulario: Scomporre un problema: la progettazione top-down

## La scomposizione

- Progettazione top-down: si parte dal problema intero e lo si divide in pochi sottoproblemi più piccoli, ognuno dei quali fa una cosa sola.
- Un sottoproblema ancora troppo grande si divide a sua volta.
- Ci si ferma quando ogni pezzo si scrive in poche righe: una lettura, un ciclo con un contatore, una selezione.
- Albero della scomposizione: in cima il problema, sotto ogni problema i sottoproblemi in cui è stato diviso.

## Il procedimento

1. Dividi il problema in sottoproblemi e disegna l'albero.
2. Per ogni sottoproblema decidi il nome della funzione, che cosa riceve e che cosa restituisce.
3. Scrivi il programma principale, come se le funzioni ci fossero già.
4. Scrivi le funzioni che chiama vuote, con un valore di ritorno fisso, ed esegui.
5. Riempi una funzione alla volta scendendo lungo l'albero, ed esegui dopo ciascuna.

## Una funzione per sottoproblema

| Sottoproblema | Funzione | Riceve | Restituisce |
|---|---|---|---|
| Leggere un voto valido | `leggi_voto()` | niente | il voto, da $1$ a $10$ |
| Contare le insufficienze di uno studente | `insufficienze(materie)` | il numero delle materie | quanti voti sono sotto il $6$ |
| Decidere l'esito | `esito(quante)` | il numero di insufficienze | il testo dell'esito |
| Scrivere la riga di uno studente | `stampa_riga(numero, quante)` | il numero dello studente e le sue insufficienze | niente: scrive |

Un ramo dell'albero diventa una chiamata: `insufficienze` chiama `leggi_voto`, `stampa_riga` chiama `esito`.

## Una funzione ancora vuota

Ha il nome e i parametri giusti, e un corpo provvisorio.

| | Python | C++ |
|---|---|---|
| Restituisce un valore | `return 0` | `return 0;` del tipo dichiarato |
| Non restituisce niente | `pass` | le graffe vuote, `{ }` |

```python
def insufficienze(materie):
    return 0
```

```cpp
int insufficienze(int materie) {
    return 0;
}
```

Con le funzioni vuote i risultati sono finti, ma si controlla il programma principale: i giri del ciclo, gli argomenti delle chiamate, i contatori.

## Che cosa si guadagna

- Un errore sta nell'ultima funzione scritta.
- Una regola che cambia si corregge in una funzione sola, senza toccare le altre.

```ad-warning
Un sottoproblema che fa due cose
Se per descriverlo serve una "e", i pezzi sono due e le funzioni anche.
```

```ad-warning
Partire dai dettagli
Le funzioni scritte prima del programma principale spesso non si incastrano: mancano o avanzano parametri.
```

```ad-warning
Provare solo alla fine
Si esegue dopo ogni funzione riempita, non dopo averle scritte tutte.
```
