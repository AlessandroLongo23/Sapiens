# Formulario: Proposizioni e connettivi logici

## Proposizioni

Una proposizione è una frase di cui si può dire in modo oggettivo se è vera (V) o falsa (F). Si indica con una lettera minuscola: $p$, $q$, $r$.

Non sono proposizioni le domande, gli ordini, le opinioni e le frasi con una variabile come "$x + 3 = 5$". Una frase falsa è una proposizione.

Atomica: non si divide in proposizioni più piccole. Composta: formata da proposizioni atomiche unite dai connettivi "non", "e", "o".

## Connettivi

| Nome | Simbolo | Si legge | È vera quando |
|---|---|---|---|
| Negazione | $\neg p$ | non $p$ | $p$ è falsa |
| Congiunzione | $p \wedge q$ | $p$ e $q$ | tutte e due sono vere |
| Disgiunzione inclusiva | $p \vee q$ | $p$ o $q$ (vel) | almeno una è vera |
| Disgiunzione esclusiva | $p \,\dot\vee\, q$ | o $p$ o $q$ (aut) | una sola è vera |

La negazione si scrive anche $\overline{p}$. La negazione di "$5 > 3$" è "$5 \leq 3$".

## Tavole di verità

| $p$ | $q$ | $\neg p$ | $p \wedge q$ | $p \vee q$ | $p \,\dot\vee\, q$ |
|---|---|---|---|---|---|
| V | V | F | V | V | F |
| V | F | F | F | V | V |
| F | V | V | F | V | V |
| F | F | V | F | F | F |

## Tavola di una proposizione composta

1. Conta le lettere: 2 lettere, 4 righe; 3 lettere, 8 righe.
2. Scrivi le combinazioni in ordine: VV, VF, FV, FF (con tre lettere VVV, VVF, VFV, VFF, FVV, FVF, FFV, FFF).
3. Aggiungi una colonna per ogni pezzo, dal più interno al più esterno.
4. Riempi ogni colonna con la tavola del connettivo; l'ultima è il risultato.

Precedenza: $\neg$ si applica per prima, solo a ciò che la segue ($\neg p \wedge q$ è $(\neg p) \wedge q$). Con più di un $\wedge$ o $\vee$ si mettono le parentesi.

## Tautologie, contraddizioni, equivalenze

Tautologia: vera in tutte le righe. Contraddizione: falsa in tutte le righe.

$$
\begin{gathered}
p \vee \neg p \ \text{ è una tautologia} \\
p \wedge \neg p \ \text{ è una contraddizione}
\end{gathered}
$$

Due proposizioni sono equivalenti ($\Leftrightarrow$) se hanno lo stesso valore in ogni riga della tavola. Per esempio $\neg(\neg p) \Leftrightarrow p$.

## Leggi di De Morgan

$$
\begin{gathered}
\neg(p \wedge q) \Leftrightarrow \neg p \vee \neg q \\
\neg(p \vee q) \Leftrightarrow \neg p \wedge \neg q
\end{gathered}
$$

"Non è vero che piove e fa freddo": non piove o non fa freddo. "Non è vero che studio o gioco": non studio e non gioco.

## Connettivi e insiemi

| Connettivo | Operazione |
|---|---|
| $\wedge$ (e) | $A \cap B$, intersezione |
| $\vee$ (o) | $A \cup B$, unione |
| $\neg$ (non) | $\overline{A}$, complementare |

```ad-warning
Negare "e" lasciando "e"
La negazione di "$p$ e $q$" è "non $p$ o non $q$", non "non $p$ e non $q$".
```

```ad-warning
Confondere $\neg p \wedge q$ e $\neg(p \wedge q)$
Con $p$ vera e $q$ falsa la prima è F, la seconda è V.
```

```ad-warning
Leggere "o" come esclusivo
In matematica "o" è inclusivo: $p \vee q$ è vera anche quando $p$ e $q$ sono vere tutte e due.
```
