# Frazione generatrice

## Che cos'è la frazione generatrice

La frazione generatrice di un numero decimale è la frazione che, dividendo il numeratore per il denominatore, dà quel numero.

Per esempio $\frac{1}{6}$ è la frazione generatrice di $0{,}1\overline{6} = 0{,}1666\ldots$, perché $1 : 6 = 0{,}1666\ldots$ Ogni decimale limitato o periodico ha la sua frazione generatrice.

In un numero periodico il gruppo di cifre che si ripete si chiama periodo e si scrive con una barra sopra. Le cifre tra la virgola e il periodo formano l'antiperiodo. In $0{,}1\overline{6}$ il periodo è 6 e l'antiperiodo è 1. Nel calcolatore il periodo si scrive tra parentesi: 0,1(6).

## Come si calcola a mano

Per un periodico la regola è questa:

1. al numeratore scrivi il numero senza virgola fino alla fine del periodo e togli le cifre che vengono prima del periodo;
2. al denominatore scrivi un 9 per ogni cifra del periodo e uno 0 per ogni cifra dell'antiperiodo;
3. riduci ai minimi termini.

```ad-example
Esempio: 2,3 con periodo 18
Il numero senza virgola è 2318, prima del periodo c'è 23. Il periodo ha due cifre e l'antiperiodo una, quindi il denominatore è 990. Il MCD di 2295 e 990 è 45:

$$\begin{aligned} 2{,}3\overline{18} &= \frac{2318 - 23}{990} \\ &= \frac{2295}{990} \\ &= \frac{51}{22} \end{aligned}$$
```

Per un decimale limitato basta scrivere il numero senza virgola su 1 seguito da tanti zeri quante sono le cifre dopo la virgola:

$$0{,}75 = \frac{75}{100} = \frac{3}{4}$$

```ad-error
Errori frequenti
- Dimenticare di togliere la parte intera: $1{,}\overline{45}$ non è $\frac{145}{99}$ ma $\frac{145 - 1}{99} = \frac{16}{11}$.
- Dimenticare gli zeri dell'antiperiodo: $0{,}1\overline{6}$ ha denominatore 90, non 9.
- Trattare un periodico come un limitato: $0{,}\overline{3}$ è $\frac{1}{3}$, non $\frac{3}{10}$.
```

## Domande frequenti

### Perché la regola funziona?

Prendi $x = 1{,}\overline{45}$ e moltiplicalo per 100: $100x = 145{,}\overline{45}$. I due numeri hanno le stesse cifre dopo la virgola, quindi sottraendo spariscono: $99x = 144$, cioè $x = \frac{144}{99} = \frac{16}{11}$.

### Quanto vale 0,9 periodico?

Vale esattamente 1. La regola dà $\frac{9}{9} = 1$: $0{,}\overline{9}$ e 1 sono due scritture dello stesso numero.
