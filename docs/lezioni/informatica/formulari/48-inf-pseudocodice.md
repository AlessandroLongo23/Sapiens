# Formulario: Lo pseudocodice

## Che cos'è

- Pseudocodice: un algoritmo scritto con una riga per ogni passo, in italiano, con poche parole sempre uguali.
- Si scrive per una persona: un computer non lo esegue.
- Non ha regole ufficiali. Vale la scrittura usata in classe, purché sia una sola dall'inizio alla fine.

## Le parole

| Nel diagramma | Nello pseudocodice | Che cosa fa |
|---|---|---|
| ovali | `inizio`, `fine` | aprono e chiudono l'algoritmo |
| parallelogramma | `leggi n` | chiede un valore e lo mette in $n$ |
| parallelogramma | `scrivi n`, `scrivi "ciao"` | mostra il valore di $n$, oppure il testo |
| rettangolo | `a ← b · h` | calcola a destra e mette il risultato in $a$ |
| rombo con due rami | `se` ... `altrimenti` | selezione |
| rombo con la freccia che risale | `finché` | ripetizione |

## I segni

| Per | Si scrive | Esempio |
|---|---|---|
| assegnare | `←` | `i ← i + 1` |
| calcolare | `+`, `−`, `·`, `/` | `prezzo · sconto / 100` |
| quoziente e resto tra interi | `div`, `mod` | `17 div 5` vale 3, `17 mod 5` vale 2 |
| confrontare | `=`, `≠`, `<`, `>`, `≤`, `≥` | `voto ≥ 6` |
| unire due condizioni | `e`, `o`, `non` | `a > 0 e b > 0` |

## Le tre strutture

Sequenza: righe una sotto l'altra, al margine.

```
inizio
leggi prezzo
leggi sconto
risparmio ← prezzo · sconto / 100
finale ← prezzo − risparmio
scrivi finale
fine
```

Selezione: le righe di ogni ramo sono rientrate; `altrimenti` sta sotto il suo `se`, e si omette se nel caso "no" non c'è niente da fare.

```
se voto ≥ 6
    scrivi "sufficiente"
altrimenti
    scrivi "insufficiente"
```

Ripetizione: le righe da ripetere sono rientrate sotto `finché`; la prima riga al margine è fuori dal giro.

```
i ← 1
finché i ≤ 5
    scrivi n · i
    i ← i + 1
scrivi "fatto"
```

## Seguirlo a mano

1. Prepara una tabella con una colonna per ogni variabile.
2. Esegui una riga alla volta, dall'alto.
3. A ogni `finché` controlla la condizione: se è vera entra nelle righe rientrate, se è falsa salta alla prima riga al margine.
4. In fondo alle righe rientrate torna al `finché`.

```ad-warning
La freccia assegna, l'uguale confronta
`n ← 5` mette 5 in $n$; `n = 5` chiede se $n$ vale 5, e sta solo dopo `se` o `finché`.
```

```ad-warning
Il rientro cambia l'algoritmo
Una riga rientrata per sbaglio finisce dentro il ramo o dentro il giro che ha sopra.
```
