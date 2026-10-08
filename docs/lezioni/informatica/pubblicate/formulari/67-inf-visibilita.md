# Formulario: Variabili locali e globali

## Variabili locali

- Variabile locale: creata dentro una funzione. Si usa solo lì, dal punto in cui nasce alla fine della funzione. I parametri sono variabili locali.
- Visibilità: la parte del programma in cui un nome si può usare.
- Tempo di vita: nasce alla chiamata, sparisce al ritorno. A ogni chiamata nascono variabili nuove.
- Due funzioni possono usare lo stesso nome: sono due variabili diverse.

```python
def punti(vinte, pareggi):
    totale = 3 * vinte + pareggi
    return totale

totale = 0
totale = totale + punti(4, 1)
```

```cpp
int punti(int vinte, int pareggi) {
    int totale = 3 * vinte + pareggi;
    return totale;
}

int main() {
    int totale = 0;
    totale = totale + punti(4, 1);
}
```

Durante la chiamata `punti(4, 1)` il `totale` di `punti` vale $13$ e quello del programma principale vale ancora $0$.

## La pila delle chiamate

Un riquadro per ogni funzione chiamata e non ancora finita, uno sopra l'altro: in fondo il programma principale, in cima la funzione in esecuzione.

1. La chiamata appoggia un riquadro con i parametri e le variabili locali.
2. `return` restituisce un valore a chi ha chiamato.
3. Il riquadro viene tolto con tutto quello che contiene.

## Variabili globali

Variabile globale: creata fuori da ogni funzione. Vive fino alla fine del programma e si può usare in tutte le funzioni che la seguono.

| | Python | C++ |
|---|---|---|
| Quali sono globali | tutte quelle create fuori dalle funzioni | quelle dichiarate fuori da tutte le funzioni, `main` compresa |
| Le variabili del programma principale | globali | locali di `main` |
| Leggere una globale in una funzione | si può | si può |
| Modificarla in una funzione | serve `global nome` prima dell'assegnamento | un assegnamento qualunque |
| Usare una locale fuori dalla sua funzione | `NameError` quando l'esecuzione arriva a quella riga | errore del compilatore, il programma non parte |

## Perché le globali si evitano

- Una funzione che usa solo parametri e variabili locali si capisce leggendo le sue righe.
- Con una globale, il risultato di una chiamata dipende da chi ha toccato la globale e quando.
- Regola: quello che serve entra dai parametri, quello che si produce esce con `return`.
- Eccezione: le costanti, scritte in maiuscolo. In C++ con `const`: `const int PER_VITTORIA = 3;`.

```ad-warning
Il risultato non esce da solo
Fuori dalla funzione una sua variabile locale non esiste: esce solo il valore di `return`.
```

```ad-warning
La locale non ricorda
Un contatore creato nella funzione riparte da $0$ a ogni chiamata: il conto lo tiene chi chiama.
```

```ad-warning
La locale nasconde la globale
Una variabile creata in una funzione con il nome di una globale è un'altra variabile: la globale resta com'era.
```
