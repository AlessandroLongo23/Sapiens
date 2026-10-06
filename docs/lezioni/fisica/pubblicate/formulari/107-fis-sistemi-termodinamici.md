# Formulario: Sistemi termodinamici e principio zero

## Sistema, ambiente, universo

- Sistema termodinamico: la porzione di materia che si studia.
- Ambiente: tutto il resto, che può interagire con il sistema.
- Universo: sistema e ambiente insieme.

| Sistema | Scambia materia | Scambia energia | Esempio |
|---|---|---|---|
| aperto | sì | sì | pentola senza coperchio |
| chiuso | no | sì | gas in un cilindro con pistone |
| isolato | no | no | thermos perfetto |

Pareti: adiabatica (non passa il calore) o diatermica (passa); rigida o mobile (con la parete mobile si scambia lavoro).

## Stato e variabili di stato

- Variabili di stato di un gas: pressione $p$, volume $V$, temperatura $T$, numero di moli $n$. Il loro valore dipende solo dallo stato, non da come ci si è arrivati.
- Estensive (raddoppiano unendo due sistemi uguali): $V$, $n$. Intensive (non cambiano): $p$, $T$.
- Equazione di stato del gas perfetto, che lega le variabili:

$$p\,V = n\,R\,T \qquad\qquad T = \frac{p\,V}{n\,R}$$

con $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$, $p$ in pascal, $V$ in metri cubi, $T$ in kelvin.

- Per una quantità fissata di gas lo stato è un punto del piano pressione-volume ($V$ in ascissa, $p$ in ordinata).

## Equilibrio termodinamico

Servono insieme:

1. equilibrio meccanico: nessuna forza non equilibrata, pressione uguale in tutti i punti;
2. equilibrio termico: temperatura uguale in tutti i punti;
3. equilibrio chimico: composizione che non cambia.

Solo uno stato di equilibrio ha un valore per ogni variabile, e si disegna come un punto.

Due gas separati da un pistone mobile che conduce il calore: all'equilibrio stessa $p$ e stessa $T$, quindi

$$\frac{V_1}{V_2} = \frac{n_1}{n_2}$$

Due recipienti alla stessa temperatura messi in comunicazione:

$$p_f = \frac{p_1\,V_1 + p_2\,V_2}{V_1 + V_2}$$

## Trasformazioni

| Trasformazione | Stati intermedi | Nel piano pressione-volume |
|---|---|---|
| quasistatica (molto lenta) | di equilibrio | una linea continua |
| brusca | non di equilibrio | solo il punto iniziale e quello finale |

## Principio zero

Se $A$ è in equilibrio termico con $C$ e $B$ è in equilibrio termico con $C$, allora $A$ e $B$ sono in equilibrio termico tra loro.

- Due sistemi sono in equilibrio termico se e solo se hanno la stessa temperatura.
- Il termometro fa la parte di $C$.

```ad-warning
Chiuso non è isolato
Il sistema chiuso non scambia materia ma scambia energia; quello isolato non scambia né l'una né l'altra.
```

```ad-warning
Stessa temperatura, non stessa energia
Due sistemi in equilibrio termico hanno la stessa temperatura; pressione ed energia possono essere diverse.
```
