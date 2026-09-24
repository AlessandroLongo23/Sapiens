# Espressioni con frazioni

Un'espressione con frazioni è una catena di operazioni tra numeri razionali (somme, differenze, prodotti, quozienti, potenze), spesso con parentesi, da ridurre a una sola frazione ai minimi termini. Le singole operazioni sono nella lezione [Operazioni in ℚ](/materiale/scuola-superiore/matematica/numeri-razionali/operazioni-in-q) e le potenze in [Potenze in ℚ](/materiale/scuola-superiore/matematica/numeri-razionali/potenze-in-q): qui conta metterle in fila senza sbagliare, organizzare i passaggi e controllare il risultato.

## L'ordine delle operazioni

L'ordine è lo stesso delle espressioni con i [numeri naturali](/materiale/scuola-superiore/matematica/numeri-naturali/operazioni-in-n) e con i [numeri interi](/materiale/scuola-superiore/matematica/numeri-interi/operazioni-in-z):

1. Si parte dalle parentesi più interne: prima le tonde, poi le quadre, poi le graffe.
2. Dentro ogni parentesi, e poi fuori, si calcolano prima le potenze.
3. Poi i prodotti e i quozienti, nell'ordine in cui compaiono, da sinistra verso destra.
4. Per ultime le somme e le differenze.
5. Quando una parentesi contiene un solo numero, la parentesi si toglie, dopo aver applicato l'eventuale potenza e il segno che la precede.

```ad-example
Esempio: prima il prodotto, poi la somma
$$\dfrac{1}{2} + \dfrac{2}{3} \cdot \dfrac{9}{4}$$

Il prodotto viene prima della somma. Semplificando in croce il $2$ con il $4$ e il $3$ con il $9$:

$$\dfrac{2}{3} \cdot \dfrac{9}{4} = \dfrac{1}{1} \cdot \dfrac{3}{2} = \dfrac{3}{2}$$

Resta la somma, con lo stesso denominatore:

$$\dfrac{1}{2} + \dfrac{3}{2} = \dfrac{4}{2} = 2$$
```

```ad-warning
Fare un prodotto prima del quoziente che lo precede
Prodotti e quozienti hanno la stessa priorità e si fanno da sinistra verso destra:

$$\dfrac{3}{4} : \dfrac{1}{2} \cdot \dfrac{2}{3} = \dfrac{3}{4} \cdot 2 \cdot \dfrac{2}{3} = 1$$

Se calcoli prima $\dfrac{1}{2} \cdot \dfrac{2}{3} = \dfrac{1}{3}$ ottieni $\dfrac{3}{4} : \dfrac{1}{3} = \dfrac{9}{4}$, che è sbagliato.
```

## Come organizzare il calcolo

Un'espressione lunga si sbaglia quasi sempre per un passaggio saltato o ricopiato male, e per questo conviene seguire sempre lo stesso schema.

1. Scrivi come frazioni i numeri decimali e gli interi che compaiono: $0{,}5 = \dfrac{1}{2}$, $0{,}25 = \dfrac{1}{4}$, $3 = \dfrac{3}{1}$. Come si fa per ogni decimale è nella lezione [Numeri decimali e frazioni](/materiale/scuola-superiore/matematica/numeri-razionali/numeri-decimali-e-frazioni).
2. Scegli la parentesi più interna e lavora solo lì. Il resto dell'espressione, a ogni riga, lo ricopi uguale.
3. Trasforma ogni quoziente in un prodotto per il reciproco del numero che segue il segno $:$ (se il divisore è una parentesi, prima calcoli la parentesi). Così una catena di prodotti e quozienti diventa una catena di soli prodotti.
4. Nei prodotti decidi prima il segno, contando i fattori negativi (pari: più; dispari: meno), poi lavori sui numeri senza segno.
5. Riduci ai minimi termini ogni frazione appena la ottieni.

### Quando semplificare

Si semplifica il prima possibile, perché con numeri piccoli si sbaglia meno. In un prodotto si semplifica in croce, un numeratore con un denominatore qualsiasi, prima di moltiplicare: $\dfrac{4}{9} \cdot \dfrac{15}{8} = \dfrac{1}{3} \cdot \dfrac{5}{2} = \dfrac{5}{6}$. In una somma invece non si semplifica niente tra un termine e l'altro: si cerca il denominatore comune, e si semplifica solo il risultato.

```ad-warning
Semplificare in croce in una somma
$\dfrac{2}{3} + \dfrac{3}{4}$ non si può semplificare "in croce" il $3$ con il $3$: la semplificazione in croce vale solo nei prodotti. Il conto giusto è $\dfrac{8}{12} + \dfrac{9}{12} = \dfrac{17}{12}$.
```

### Usare le proprietà delle potenze prima di calcolare

Quando due potenze hanno basi uguali o reciproche, conviene applicare le [proprietà delle potenze](/materiale/scuola-superiore/matematica/numeri-razionali/potenze-in-q) prima di fare i conti, perché gli esponenti si semplificano e i numeri restano piccoli. Una base reciproca si trasforma nell'altra cambiando segno all'esponente:

$$\left(\dfrac{2}{3}\right)^5 \cdot \left(\dfrac{3}{2}\right)^3 = \left(\dfrac{2}{3}\right)^5 \cdot \left(\dfrac{2}{3}\right)^{-3} = \left(\dfrac{2}{3}\right)^2 = \dfrac{4}{9}$$

Calcolare prima le due potenze darebbe $\dfrac{32}{243} \cdot \dfrac{27}{8}$: stesso risultato, con molti più conti.

### Il meno davanti a una parentesi

Un segno meno davanti a una parentesi cambia il segno di tutto quello che c'è dentro, come nei [numeri interi](/materiale/scuola-superiore/matematica/numeri-interi/operazioni-in-z). Il modo più sicuro è calcolare prima la parentesi, e togliere il meno solo quando dentro resta un numero.

```ad-warning
Il meno che cambia solo il primo termine
$\dfrac{1}{2} - \left(\dfrac{1}{3} - \dfrac{1}{4}\right) = \dfrac{1}{2} - \dfrac{1}{12} = \dfrac{5}{12}$. Se togli la parentesi senza cambiare il segno di $-\dfrac{1}{4}$ scrivi $\dfrac{1}{2} - \dfrac{1}{3} - \dfrac{1}{4}$, che vale $-\dfrac{1}{12}$.
```

## Frazioni di frazioni

A volte il numeratore o il denominatore di una frazione sono a loro volta frazioni, o intere espressioni:

$$\dfrac{\dfrac{2}{3}}{\dfrac{4}{9}} \qquad\qquad \dfrac{1 - \dfrac{1}{4}}{\dfrac{1}{2} + \dfrac{1}{3}}$$

La linea di frazione più lunga, quella principale, è un segno di divisione, e fa anche da parentesi: il numeratore si calcola da solo, il denominatore si calcola da solo, e alla fine si divide il primo per il secondo. Nel primo caso:

$$\dfrac{\dfrac{2}{3}}{\dfrac{4}{9}} = \dfrac{2}{3} : \dfrac{4}{9} = \dfrac{2}{3} \cdot \dfrac{9}{4} = \dfrac{3}{2}$$

```ad-warning
Sbagliare la linea principale
$\dfrac{\;\dfrac{1}{2}\;}{3}$ e $\dfrac{1}{\;\dfrac{2}{3}\;}$ sono numeri diversi. Il primo è $\dfrac{1}{2} : 3 = \dfrac{1}{6}$, il secondo è $1 : \dfrac{2}{3} = \dfrac{3}{2}$. Quando scrivi a mano, la linea principale va più lunga delle altre e all'altezza del segno $=$.
```

```ad-warning
Semplificare dentro una somma
In $\dfrac{3 + \dfrac{1}{2}}{3}$ non si può semplificare il $3$ di sopra con il $3$ di sotto, perché quello di sopra è un addendo e non un fattore. Il numeratore vale $\dfrac{7}{2}$ e il risultato è $\dfrac{7}{2} : 3 = \dfrac{7}{6}$, non $\dfrac{1}{2}$.
```

## Come controllare il risultato

Alla fine di un'espressione ci sono tre controlli che richiedono pochi secondi.

- Il risultato è ridotto ai minimi termini? Se numeratore e denominatore hanno ancora un fattore comune, manca l'ultimo passaggio.
- Il segno è plausibile? Se in un prodotto ci sono tre fattori negativi e il risultato è positivo, c'è un errore.
- I decimali approssimati tornano? Rifai il conto a grandi linee con i numeri decimali (anche con la calcolatrice, se è permessa) e confronta con il decimale del risultato.

```ad-tip
Il controllo con i decimali
Nell'esempio 2 qui sotto, $\dfrac{5}{6} \approx 0{,}833$ e la parentesi vale circa $0{,}333 - 0{,}75 = -0{,}417$. Diviso per $-2{,}5$ fa circa $0{,}167$, e $0{,}833 - 0{,}167 = 0{,}666$, che a meno degli arrotondamenti è $\dfrac{2}{3} = 0{,}666\dots$. Se il risultato fosse stato $\dfrac{3}{2} = 1{,}5$, il controllo lo avrebbe scoperto subito.
```

Nessuno di questi controlli dimostra che il risultato è giusto, ma ognuno scopre un tipo di errore frequente: la semplificazione dimenticata, il segno perso, il passaggio sbagliato.

## Esempi svolti

```ad-example
Esempio 1: una sola parentesi
$$\dfrac{3}{5} \cdot \left(\dfrac{1}{2} + \dfrac{1}{3}\right) - \dfrac{1}{4}$$

Prima la parentesi, con denominatore comune $6$:

$$\dfrac{1}{2} + \dfrac{1}{3} = \dfrac{3}{6} + \dfrac{2}{6} = \dfrac{5}{6}$$

Poi il prodotto, semplificando in croce il $5$ con il $5$ e il $3$ con il $6$:

$$\dfrac{3}{5} \cdot \dfrac{5}{6} = \dfrac{1}{2}$$

Infine la differenza: $\dfrac{1}{2} - \dfrac{1}{4} = \dfrac{2}{4} - \dfrac{1}{4} = \dfrac{1}{4}$.
```

```ad-example
Esempio 2: segni e quoziente
$$\dfrac{5}{6} - \left(\dfrac{1}{3} - \dfrac{3}{4}\right) : \left(-\dfrac{5}{2}\right)$$

La parentesi, con denominatore comune $12$:

$$\dfrac{1}{3} - \dfrac{3}{4} = \dfrac{4}{12} - \dfrac{9}{12} = -\dfrac{5}{12}$$

Il quoziente viene prima della differenza. Si trasforma in prodotto per il reciproco di $-\dfrac{5}{2}$, cioè $-\dfrac{2}{5}$; i fattori negativi sono due, quindi il segno è più:

$$-\dfrac{5}{12} : \left(-\dfrac{5}{2}\right) = -\dfrac{5}{12} \cdot \left(-\dfrac{2}{5}\right) = +\dfrac{1}{6}$$

Resta la differenza:

$$\dfrac{5}{6} - \dfrac{1}{6} = \dfrac{4}{6} = \dfrac{2}{3}$$
```

```ad-example
Esempio 3: potenze con segno ed esponente negativo
$$\left(-\dfrac{1}{2}\right)^3 \cdot \left(\dfrac{4}{3}\right)^2 - \left(\dfrac{2}{3}\right)^{-1} : 3^2$$

Prima le potenze. La base $-\dfrac{1}{2}$ ha esponente dispari, quindi resta negativa; l'esponente $-1$ dà il reciproco:

$$\left(-\dfrac{1}{2}\right)^3 = -\dfrac{1}{8} \qquad \left(\dfrac{4}{3}\right)^2 = \dfrac{16}{9} \qquad \left(\dfrac{2}{3}\right)^{-1} = \dfrac{3}{2} \qquad 3^2 = 9$$

L'espressione diventa $-\dfrac{1}{8} \cdot \dfrac{16}{9} - \dfrac{3}{2} : 9$. Poi il prodotto e il quoziente:

$$-\dfrac{1}{8} \cdot \dfrac{16}{9} = -\dfrac{2}{9} \qquad \dfrac{3}{2} : 9 = \dfrac{3}{2} \cdot \dfrac{1}{9} = \dfrac{1}{6}$$

Infine la differenza, con denominatore comune $18$:

$$-\dfrac{2}{9} - \dfrac{1}{6} = -\dfrac{4}{18} - \dfrac{3}{18} = -\dfrac{7}{18}$$
```

```ad-warning
Il segno della differenza davanti al quoziente
Nell'esempio 3 il meno davanti a $\left(\dfrac{2}{3}\right)^{-1} : 3^2$ resta lì mentre calcoli il quoziente: il quoziente vale $\dfrac{1}{6}$ e il termine è $-\dfrac{1}{6}$. Spesso quel meno si perde, e il risultato diventa $-\dfrac{2}{9} + \dfrac{1}{6} = -\dfrac{1}{18}$.
```

```ad-example
Esempio 4: frazione di frazioni
$$\dfrac{1 - \dfrac{1}{4}}{\dfrac{1}{2} + \dfrac{1}{3}}$$

Il numeratore e il denominatore si calcolano ciascuno per conto suo:

$$1 - \dfrac{1}{4} = \dfrac{3}{4} \qquad \dfrac{1}{2} + \dfrac{1}{3} = \dfrac{5}{6}$$

Poi la linea principale diventa una divisione:

$$\dfrac{3}{4} : \dfrac{5}{6} = \dfrac{3}{4} \cdot \dfrac{6}{5} = \dfrac{3}{2} \cdot \dfrac{3}{5} = \dfrac{9}{10}$$
```

```ad-example
Esempio 5: decimali ed esponenti negativi in una frazione di frazioni
$$\dfrac{\left(\dfrac{1}{2}\right)^{-2} - \dfrac{1}{3}}{0{,}5 - \left(-\dfrac{2}{3}\right)^{-1}}$$

Al numeratore, $\left(\dfrac{1}{2}\right)^{-2} = 2^2 = 4$, quindi

$$4 - \dfrac{1}{3} = \dfrac{12}{3} - \dfrac{1}{3} = \dfrac{11}{3}$$

Al denominatore, $0{,}5 = \dfrac{1}{2}$ e $\left(-\dfrac{2}{3}\right)^{-1} = -\dfrac{3}{2}$: il reciproco di un numero negativo è negativo. Il meno davanti cambia il segno:

$$\dfrac{1}{2} - \left(-\dfrac{3}{2}\right) = \dfrac{1}{2} + \dfrac{3}{2} = 2$$

Resta la divisione: $\dfrac{11}{3} : 2 = \dfrac{11}{3} \cdot \dfrac{1}{2} = \dfrac{11}{6}$.
```

```ad-example
Esempio 6: tonde, quadre e graffe
$$\left\{\left[\left(\dfrac{2}{3} - 1\right)^2 : \left(-\dfrac{1}{3}\right)^3 + \dfrac{5}{2}\right] \cdot \left(\dfrac{1}{2}\right)^{-2} - \dfrac{3}{4}\right\} : \left(-\dfrac{5}{4}\right)$$

La tonda più interna: $\dfrac{2}{3} - 1 = \dfrac{2}{3} - \dfrac{3}{3} = -\dfrac{1}{3}$.

Nella quadra ora c'è $\left(-\dfrac{1}{3}\right)^2 : \left(-\dfrac{1}{3}\right)^3 + \dfrac{5}{2}$. Il quoziente ha la stessa base, quindi si sottraggono gli esponenti:

$$\left(-\dfrac{1}{3}\right)^2 : \left(-\dfrac{1}{3}\right)^3 = \left(-\dfrac{1}{3}\right)^{-1} = -3$$

e la quadra vale $-3 + \dfrac{5}{2} = -\dfrac{6}{2} + \dfrac{5}{2} = -\dfrac{1}{2}$.

Nella graffa ora c'è $-\dfrac{1}{2} \cdot \left(\dfrac{1}{2}\right)^{-2} - \dfrac{3}{4}$. Prima la potenza, $\left(\dfrac{1}{2}\right)^{-2} = 4$, poi il prodotto e la differenza:

$$-\dfrac{1}{2} \cdot 4 - \dfrac{3}{4} = -2 - \dfrac{3}{4} = -\dfrac{8}{4} - \dfrac{3}{4} = -\dfrac{11}{4}$$

Resta l'ultimo quoziente. I fattori negativi sono due, quindi il risultato è positivo:

$$-\dfrac{11}{4} : \left(-\dfrac{5}{4}\right) = -\dfrac{11}{4} \cdot \left(-\dfrac{4}{5}\right) = \dfrac{11}{5}$$
```
