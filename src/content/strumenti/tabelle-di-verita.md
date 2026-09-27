# Tabelle di verità

## Che cos'è

La tabella (o tavola) di verità di una proposizione dice se è vera o falsa in ogni combinazione di valori delle lettere che la formano.

Una proposizione è una frase vera (V) o falsa (F). Le lettere $p$, $q$, $r$ stanno per proposizioni semplici, e i connettivi le uniscono: $\neg$ (non), $\wedge$ (e), $\vee$ (o), $\to$ (se… allora), $\leftrightarrow$ (se e solo se), $\dot\vee$ (o… o, esclusivo).

## Come si calcola a mano

```ad-example
Tabella di (p ∨ q) ∧ ¬p
Le lettere sono due, quindi le righe sono $2^2 = 4$, nell'ordine VV, VF, FV, FF. I pezzi da calcolare, dal più interno, sono $p \vee q$, poi $\neg p$, poi la loro congiunzione:

| $p$ | $q$ | $p \vee q$ | $\neg p$ | $(p \vee q) \wedge \neg p$ |
|---|---|---|---|---|
| V | V | V | F | F |
| V | F | V | F | F |
| F | V | V | V | V |
| F | F | F | V | F |

L'ultima colonna ha una V sola: la proposizione è vera solo quando $p$ è falsa e $q$ è vera.
```

La regola generale:

1. conta le lettere diverse: con $n$ lettere le righe sono $2^n$;
2. scrivi le colonne delle lettere: la prima metà V e metà F, l'ultima alternata;
3. aggiungi una colonna per ogni pezzo, dal più interno al più esterno;
4. riempi ogni colonna con la tabella del suo connettivo.

Se l'ultima colonna è tutta V la proposizione è una tautologia, vera in ogni caso. Se è tutta F è una contraddizione. Altrimenti è soddisfacibile: vera in qualche riga.

La negazione si applica per prima, e solo alla lettera o alla parentesi che segue. Tra $\wedge$ e $\vee$ i libri non danno tutti la stessa precedenza, quindi il calcolatore chiede le parentesi. La freccia $\to$ si applica dopo $\wedge$ e $\vee$.

```ad-error
Errori frequenti
- Pensare che $p \to q$ sia falsa quando $p$ è falsa: l'implicazione è falsa solo nella riga con $p$ vera e $q$ falsa.
- Confondere $\neg p \wedge q$ con $\neg(p \wedge q)$: nella prima la negazione tocca solo $p$.
- Saltare delle righe: con tre lettere sono 8, con quattro 16.
```

## Domande frequenti

### Come scrivo i simboli dalla tastiera?

Usa i bottoni sotto il campo, oppure `!` per non, `&` per e, `|` per o, `->`, `<->` e `xor`. Vanno bene anche le parole non, e, o.

### A che cosa serve sapere se è una tautologia?

Le tautologie sono le leggi della logica, come $\neg(p \wedge q) \leftrightarrow (\neg p \vee \neg q)$, una delle leggi di De Morgan. In informatica le stesse tabelle descrivono le condizioni dei programmi e le porte logiche.
