# Calcolatrice di frazioni

## Che cos'è una frazione

Una frazione $\frac{a}{b}$ è la divisione di $a$ per $b$: il denominatore dice in quante parti uguali si divide l'intero, il numeratore quante se ne prendono. Il denominatore non può essere zero, perché per zero non si divide.

Due frazioni sono equivalenti quando valgono lo stesso numero, come $\frac{2}{3}$ e $\frac{8}{12}$: si passa dall'una all'altra moltiplicando o dividendo numeratore e denominatore per lo stesso numero. Una frazione è ridotta ai minimi termini quando numeratore e denominatore non hanno divisori comuni oltre a 1; per arrivarci si dividono tutti e due per il loro MCD.

## Come si calcola a mano

Per sommare o sottrarre due frazioni si portano allo stesso denominatore: si calcola il mcm dei denominatori, si scrive ogni frazione come una equivalente con quel denominatore, poi si sommano o si sottraggono i numeratori.

```ad-example
Esempio: $\frac{3}{4} + \frac{5}{6}$
Il mcm di 4 e 6 è 12. Le frazioni equivalenti sono $\frac{3}{4} = \frac{9}{12}$ e $\frac{5}{6} = \frac{10}{12}$.
Quindi $\frac{3}{4} + \frac{5}{6} = \frac{9 + 10}{12} = \frac{19}{12}$.
```

Per moltiplicare si semplifica in croce, cioè il numeratore di una frazione con il denominatore dell'altra, poi si moltiplicano i numeratori tra loro e i denominatori tra loro. Per dividere si moltiplica la prima frazione per il reciproco della seconda, che si ottiene scambiando numeratore e denominatore.

```ad-example
Esempio: $\frac{3}{4} : \frac{9}{10}$
Il reciproco di $\frac{9}{10}$ è $\frac{10}{9}$, quindi $\frac{3}{4} : \frac{9}{10} = \frac{3}{4} \cdot \frac{10}{9}$.
Semplifica in croce 3 e 9 per 3, 10 e 4 per 2: $\frac{1}{2} \cdot \frac{5}{3} = \frac{5}{6}$.
```

```ad-error
Errori frequenti
- Sommare i numeratori tra loro e i denominatori tra loro: $\frac{1}{2} + \frac{1}{3}$ non fa $\frac{2}{5}$, ma $\frac{5}{6}$.
- Semplificare in croce in un'addizione: la semplificazione in croce vale solo nella moltiplicazione.
- Nella divisione, capovolgere la prima frazione al posto della seconda.
- Semplificare un addendo: in $\frac{2 + 3}{2}$ il 2 non si cancella, perché al numeratore c'è una somma.
```

## Domande frequenti

### Serve per forza il mcm dei denominatori?

No, va bene qualunque denominatore comune, anche il prodotto dei due. Con il mcm i numeri restano più piccoli e alla fine c'è meno da semplificare.

### Che cos'è un numero misto?

È una frazione maggiore di 1 scritta come un intero più una frazione minore di 1: $\frac{19}{12} = 1 + \frac{7}{12}$. Si trova con la divisione con resto: 19 diviso 12 fa 1 con resto 7.

### Come si trasforma una frazione in numero decimale?

Si divide il numeratore per il denominatore: $\frac{3}{8} = 0{,}375$. Se il denominatore della frazione ridotta ha fattori primi diversi da 2 e da 5, il numero decimale è periodico: $\frac{5}{6} = 0{,}8\overline{3}$.
