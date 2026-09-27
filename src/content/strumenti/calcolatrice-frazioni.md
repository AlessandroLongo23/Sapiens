# Calcolatrice di frazioni

## Che cos'è una frazione

Una frazione $\frac{a}{b}$ è la divisione di $a$ per $b$.

Per esempio, $\frac{3}{4}$ di una pizza sono 3 fette di una pizza tagliata in 4 parti uguali. Il numero sotto la linea è il denominatore: dice in quante parti uguali si divide l'intero. Il numero sopra è il numeratore: dice quante parti si prendono.

Il denominatore non può essere zero, perché per zero non si divide.

Due frazioni sono equivalenti quando valgono lo stesso numero. Si passa dall'una all'altra moltiplicando, o dividendo, numeratore e denominatore per lo stesso numero:

$$\frac{2}{3} = \frac{2 \cdot 4}{3 \cdot 4} = \frac{8}{12}$$

Una frazione è ridotta ai minimi termini quando numeratore e denominatore non hanno divisori comuni oltre a 1. Per arrivarci si dividono tutti e due per il loro MCD, il massimo comune divisore:

$$\frac{84}{36} = \frac{84 : 12}{36 : 12} = \frac{7}{3}$$

## Come si sommano e si sottraggono

```ad-example
Esempio: $\frac{3}{4} + \frac{5}{6}$
Il mcm dei denominatori, cioè il più piccolo numero multiplo sia di 4 sia di 6, è 12. Porta le due frazioni al denominatore 12:

$$\frac{3}{4} = \frac{3 \cdot 3}{4 \cdot 3} = \frac{9}{12}$$
$$\frac{5}{6} = \frac{5 \cdot 2}{6 \cdot 2} = \frac{10}{12}$$

Somma i numeratori e lascia il denominatore:

$$\frac{9}{12} + \frac{10}{12} = \frac{9 + 10}{12} = \frac{19}{12}$$
```

La regola, per la somma e per la differenza:

1. calcola il mcm dei denominatori: è il denominatore comune;
2. per ogni frazione, dividi il mcm per il suo denominatore e moltiplica numeratore e denominatore per il risultato;
3. somma o sottrai i numeratori e lascia il denominatore comune;
4. se puoi, semplifica il risultato.

## Come si moltiplicano e si dividono

```ad-example
Esempio: $\frac{4}{9} \cdot \frac{15}{8}$
Semplifica in croce, cioè il numeratore di una frazione con il denominatore dell'altra: 4 e 8 si dividono per 4, 15 e 9 per 3.

$$\frac{4}{9} \cdot \frac{15}{8} = \frac{1}{3} \cdot \frac{5}{2}$$

Moltiplica i numeratori tra loro e i denominatori tra loro:

$$\frac{1 \cdot 5}{3 \cdot 2} = \frac{5}{6}$$
```

Per moltiplicare due frazioni, prima semplifica in croce, poi moltiplica i numeratori tra loro e i denominatori tra loro. Semplificare prima tiene i numeri piccoli.

```ad-example
Esempio: $\frac{3}{4} : \frac{9}{10}$
Scambia numeratore e denominatore della seconda frazione: il reciproco di $\frac{9}{10}$ è $\frac{10}{9}$. Il diviso diventa per:

$$\frac{3}{4} : \frac{9}{10} = \frac{3}{4} \cdot \frac{10}{9}$$

Semplifica in croce 3 e 9 per 3, 10 e 4 per 2, poi moltiplica:

$$\frac{1}{2} \cdot \frac{5}{3} = \frac{5}{6}$$
```

Per dividere, moltiplica la prima frazione per il reciproco della seconda. Il reciproco di una frazione si ottiene scambiando numeratore e denominatore.

```ad-error
Errori frequenti
- Sommare i numeratori tra loro e i denominatori tra loro: $\frac{1}{2} + \frac{1}{3}$ fa $\frac{5}{6}$, non $\frac{2}{5}$.
- Semplificare in croce in un'addizione: la semplificazione in croce vale solo nella moltiplicazione.
- Nella divisione, capovolgere la prima frazione al posto della seconda.
- Semplificare un addendo: in $\frac{2 + 3}{2}$ il 2 non si cancella, perché al numeratore c'è una somma.
```

## Domande frequenti

### Serve per forza il mcm dei denominatori?

No, va bene qualunque denominatore comune, anche il prodotto dei due. Con il mcm i numeri restano più piccoli e alla fine c'è meno da semplificare.

### Che cos'è un numero misto?

È una frazione maggiore di 1 scritta come un intero più una frazione minore di 1. Si trova con la divisione con resto: 19 diviso 12 fa 1 con resto 7, quindi

$$\frac{19}{12} = 1 + \frac{7}{12}$$

### Come si trasforma una frazione in numero decimale?

Si divide il numeratore per il denominatore:

$$\frac{3}{8} = 3 : 8 = 0{,}375$$

Se il denominatore della frazione ridotta ha fattori primi diversi da 2 e da 5, il numero decimale è periodico: alcune cifre si ripetono all'infinito, e si scrivono una volta con una linea sopra.

$$\frac{5}{6} = 0{,}8\overline{3}$$
