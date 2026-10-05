# Formulario: Dal problema all'algoritmo

## Le cinque fasi

1. Analisi del problema: che cosa conosco e che cosa devo trovare.
2. Strategia risolutiva: l'idea, trovata risolvendo a mano un caso con numeri veri.
3. Algoritmo: l'idea scritta come elenco di passi, a parole o con un diagramma di flusso.
4. Prova: l'algoritmo eseguito su dati di cui conosco già il risultato.
5. Programma: l'algoritmo tradotto in un linguaggio di programmazione, e provato di nuovo.

## L'analisi

- Dati di ingresso: i valori che si conoscono prima di cominciare; l'algoritmo li legge.
- Dati di uscita: i valori da trovare; l'algoritmo li scrive.
- Valori intermedi: quelli che l'algoritmo calcola strada facendo e non scrive.
- Vincoli: le condizioni che i dati devono rispettare perché il problema abbia senso.

La tabella dell'analisi per la quota della gita:

| Dato | Nome | Tipo | Vincolo |
|---|---|---|---|
| costo del pullman, in euro | `pullman` | ingresso | non negativo |
| prezzo del biglietto, in euro | `biglietto` | ingresso | non negativo |
| numero di studenti | $n$ | ingresso | intero, maggiore di zero |
| quota a testa, in euro | `quota` | uscita | |

## Dalla strategia all'algoritmo

1. Risolvi a mano un caso: $600 : 24 + 9 = 34$.
2. Rifai il conto con i nomi: `quota` è `pullman` diviso $n$, più `biglietto`.
3. Scrivi i passi: prima le letture, poi i calcoli, alla fine le scritture.

## I casi di prova

Un caso di prova è un gruppo di dati di ingresso con il risultato atteso, calcolato a mano prima di eseguire.

| Caso | Che cosa controlla | Esempio per le settimane di risparmio |
|---|---|---|
| normale | il conto nella situazione più comune | prezzo $60$, paghetta $8$: $8$ settimane |
| sul confine | il valore in cui la risposta cambia | prezzo $60$, paghetta $10$: $6$ settimane |
| scomodo | valori molto piccoli, molto grandi o uguali a zero | prezzo $60$, paghetta $100$: $1$ settimana |

```ad-warning
Un dato di uscita non si legge
Quello che si ricava con un conto non va tra i dati di ingresso.
```

```ad-warning
Il risultato atteso si calcola prima
Se guardi l'uscita e poi decidi che sembra giusta, non stai provando niente.
```

```ad-warning
Il vincolo dimenticato
Con zero studenti la gita divide per zero; con la paghetta a zero il risparmio non finisce mai.
```
