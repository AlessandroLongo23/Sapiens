# Formulario: Confrontare gli algoritmi contando le operazioni

## Contare le operazioni

Il tempo dipende dal computer; il numero di confronti e di scambi dipende solo dall'algoritmo e dai dati. Si contano con un contatore, aumentato prima della selezione che fa il confronto.

```python
confronti = confronti + 1
if v[j] > v[j + 1]:
    # scambio con temp
    scambi = scambi + 1
```

Il caso migliore è l'ingresso che fa lavorare meno l'algoritmo, il caso peggiore quello che lo fa lavorare di più.

## I tre ordinamenti su $n$ elementi

| | In ordine | Rovesciato |
|---|---|---|
| Selezione, confronti | $\frac{n(n - 1)}{2}$ | $\frac{n(n - 1)}{2}$ |
| Selezione, scambi | $0$ | al massimo $n - 1$ |
| Bolle con la bandierina, confronti | $n - 1$ | $\frac{n(n - 1)}{2}$ |
| Bolle, scambi | $0$ | $\frac{n(n - 1)}{2}$ |
| Inserimento, confronti | $n - 1$ | $\frac{n(n - 1)}{2}$ |
| Inserimento, spostamenti | $0$ | $\frac{n(n - 1)}{2}$ |

Con $12$ elementi: $\frac{12 \cdot 11}{2} = 66$ e $n - 1 = 11$. Su uno stesso vettore gli scambi delle bolle sono quanti gli spostamenti dell'inserimento.

## Le due ricerche, nel caso peggiore

| | Confronti | Con $12$ elementi | Con $1000$ |
|---|---|---|---|
| Ricerca sequenziale | $n$ | $12$ | $1000$ |
| Ricerca binaria | quante volte $n$ si dimezza prima di finire gli elementi | $4$ | $10$ |

## Quando $n$ raddoppia

| Algoritmo | Cresce come | Se $n$ raddoppia, i confronti |
|---|---|---|
| Ricerca binaria | $\log_2 n$ | aumentano di $1$ |
| Ricerca sequenziale | $n$ | raddoppiano |
| Selezione, bolle, inserimento | $n^2$ | diventano circa il quadruplo |

| $n$ | Sequenziale | Binaria | Ordinamento |
|---|---|---|---|
| $100$ | $100$ | $7$ | $4950$ |
| $200$ | $200$ | $8$ | $19\,900$ |
| $400$ | $400$ | $9$ | $79\,800$ |

## Quando un algoritmo non regge

Il lavoro cresce molto più in fretta dei dati: con una crescita come $n^2$, dieci volte i dati sono cento volte il lavoro.

Con un milione di elementi: ricerca binaria $20$ confronti, ricerca sequenziale $1\,000\,000$, ordinamento circa $500\,000\,000\,000$.

```ad-warning
Il contatore nel posto sbagliato
Dentro l'`if`, accanto allo scambio, il contatore conta gli scambi e non i confronti.
```

```ad-warning
Cresce come n² non vuol dire n²
I confronti sono $\frac{n(n - 1)}{2}$: quello che conta è che quadruplicano quando $n$ raddoppia.
```
