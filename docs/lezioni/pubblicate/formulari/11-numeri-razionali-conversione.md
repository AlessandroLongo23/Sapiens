# Formulario: Numeri decimali e frazioni

## Tipi di numero decimale

Un decimale limitato ha un numero finito di cifre dopo la virgola: $0{,}75$.

Un decimale periodico ha un gruppo di cifre, il periodo, che si ripete all'infinito e si scrive una volta con la barra: $1{,}4545\ldots = 1{,}\overline{45}$. Le cifre tra la virgola e il periodo che non si ripetono sono l'antiperiodo.

In $0{,}25\overline{3}$: parte intera $0$, antiperiodo $25$, periodo $3$. Senza antiperiodo il periodico è semplice ($1{,}\overline{45}$), con l'antiperiodo è misto ($0{,}25\overline{3}$).

Limitati e periodici si scrivono tutti come frazione; i decimali infiniti che non si ripetono, come $\pi$, no.

## Da decimale limitato a frazione

1. Al numeratore il numero senza la virgola.
2. Al denominatore $1$ seguito da tanti zeri quante sono le cifre dopo la virgola.
3. Riduci ai minimi termini dividendo per il MCD.

$$0{,}75 = \dfrac{75}{100} = \dfrac{3}{4} \qquad 2{,}35 = \dfrac{235}{100} = \dfrac{47}{20} \qquad -0{,}08 = -\dfrac{8}{100} = -\dfrac{2}{25}$$

## Da decimale periodico a frazione

La frazione generatrice, per periodici semplici e misti:

1. Al numeratore il numero senza virgola e senza barra fino alla fine del primo periodo, meno il numero formato dalle cifre prima del periodo (parte intera e antiperiodo).
2. Al denominatore tanti $9$ quante sono le cifre del periodo, seguiti da tanti $0$ quante sono le cifre dell'antiperiodo.
3. Riduci ai minimi termini.

$$0{,}\overline{3} = \dfrac{3 - 0}{9} = \dfrac{1}{3} \qquad 1{,}\overline{45} = \dfrac{145 - 1}{99} = \dfrac{16}{11}$$

$$0{,}1\overline{6} = \dfrac{16 - 1}{90} = \dfrac{1}{6} \qquad 2{,}3\overline{18} = \dfrac{2318 - 23}{990} = \dfrac{51}{22}$$

Il periodo $9$ non si usa: $0{,}\overline{9} = 1$ e $0{,}4\overline{9} = 0{,}5$.

## Limitato o periodico: il denominatore

Riduci la frazione ai minimi termini e scomponi il denominatore.

| Fattori primi del denominatore | Decimale | Esempio |
|---|---|---|
| Solo $2$ e $5$ | limitato | $\dfrac{7}{20} = 0{,}35$ |
| Né $2$ né $5$ | periodico semplice | $\dfrac{4}{11} = 0{,}\overline{36}$ |
| $2$ o $5$ insieme ad altri | periodico misto | $\dfrac{5}{12} = 0{,}41\overline{6}$ |

## Da frazione a decimale

Si divide il numeratore per il denominatore: $3 : 8 = 0{,}375$. Se il resto diventa $0$ il decimale è limitato; se un resto si ripete, da lì si ripetono anche le cifre. Per controllare una conversione, rifai la divisione e confronta.

```ad-warning
Dimenticare di sottrarre la parte intera
$1{,}\overline{45}$ non è $\dfrac{145}{99}$: è $\dfrac{145 - 1}{99} = \dfrac{16}{11}$.
```

```ad-warning
Dimenticare gli zeri dell'antiperiodo
$0{,}1\overline{6}$ ha periodo e antiperiodo di una cifra: denominatore $90$, non $9$ né $99$.
```

```ad-warning
Guardare il denominatore di una frazione non ridotta
$\dfrac{21}{30} = \dfrac{7}{10} = 0{,}7$ è limitato anche se $30$ contiene il fattore $3$.
```
