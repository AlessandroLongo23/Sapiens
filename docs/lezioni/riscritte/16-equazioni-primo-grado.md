# Equazioni di primo grado intere

Un'**equazione** è un'uguaglianza tra due espressioni che contengono una lettera, l'**incognita**, di cui ci si chiede per quali valori della lettera è vera. L'uguaglianza $2x + 3 = 11$, per esempio, è vera se al posto di $x$ metti $4$, perché $2 \cdot 4 + 3 = 11$, ed è falsa per qualunque altro numero. Risolvere un'equazione vuol dire trovare tutti i valori che la rendono vera.

Le equazioni di primo grado sono le più semplici, e il metodo con cui si risolvono ritorna in tutto quello che viene dopo: nelle [equazioni di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado), nei [sistemi di equazioni](/materiale/scuola-superiore/matematica/sistemi-lineari/sistemi-di-due-equazioni-in-due-incognite) e nelle [disequazioni di primo grado](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/disequazioni-di-primo-grado-e-intervalli).

## Membri, soluzioni e forma normale

L'espressione a sinistra dell'uguale è il **primo membro**, quella a destra il **secondo membro**. In $5x - 3 = 2x + 9$ il primo membro è $5x - 3$ e il secondo membro è $2x + 9$.

Un numero è una **soluzione** dell'equazione se, messo al posto dell'incognita, rende uguali i due membri. L'insieme di tutte le soluzioni si indica con $S$. Per $5x - 3 = 2x + 9$ la soluzione è $4$: il primo membro vale $5 \cdot 4 - 3 = 17$ e il secondo $2 \cdot 4 + 9 = 17$. Quindi $S = \{4\}$.

Un'equazione è di **primo grado** quando, svolti i calcoli, si può scrivere nella forma

$$ax = b \qquad \text{con } a \neq 0,$$

dove $a$ e $b$ sono numeri: $a$ è il coefficiente dell'incognita e $b$ il termine noto. Questa scrittura si chiama **forma normale**. Alcuni libri la scrivono come $ax + b = 0$, con tutti i termini a primo membro; il significato è lo stesso.

Il grado si legge sulla forma normale e non sul testo dell'esercizio. L'equazione $x^2 + 3x = x^2 + 5$ sembra di secondo grado, ma il termine $x^2$ compare in entrambi i membri e si può cancellare (lo vedi nel prossimo paragrafo): resta $3x = 5$, che è di primo grado.

## I principi di equivalenza

Due equazioni sono **equivalenti** se hanno le stesse soluzioni. Risolvere un'equazione significa trasformarla, un passaggio alla volta, in equazioni equivalenti sempre più semplici, fino ad arrivare a una del tipo $x = \text{numero}$, da cui la soluzione si legge subito. Le trasformazioni permesse sono date da due principi.

### Primo principio

Il **primo principio di equivalenza** dice che, se aggiungi o sottrai lo stesso numero (o la stessa espressione con l'incognita) a entrambi i membri, ottieni un'equazione equivalente.

Da questo principio vengono due regole che userai in ogni esercizio.

La **regola del trasporto**: un termine si può spostare da un membro all'altro cambiandogli il segno. In $3x + 5 = 11$, sottrarre $5$ da entrambi i membri dà $3x + 5 - 5 = 11 - 5$, cioè $3x = 11 - 5$: il $+5$ è passato a secondo membro ed è diventato $-5$.

La **regola di cancellazione**: se lo stesso termine, con lo stesso segno, compare in entrambi i membri, puoi cancellarlo. In $5x + 2 = 2 - 3x$ il termine $+2$ sta in tutti e due i membri; cancellandolo resta $5x = -3x$, cioè $8x = 0$, e quindi $x = 0$.

### Secondo principio

Il **secondo principio di equivalenza** dice che, se moltiplichi o dividi entrambi i membri per lo stesso numero diverso da zero, ottieni un'equazione equivalente.

Lo usi in tre situazioni:

- per ricavare l'incognita, dividendo per il suo coefficiente: da $3x = 6$, dividendo per $3$, ottieni $x = 2$;
- per cambiare segno a tutti i termini, moltiplicando per $-1$: $-2x = -8$ diventa $2x = 8$;
- per eliminare i denominatori, moltiplicando per il loro MCM: $\dfrac{x}{2} + \dfrac{x}{3} = 5$, moltiplicata per $6$, diventa $3x + 2x = 30$.

```ad-warning
Trasportare il coefficiente
Da $3x = 12$ non si scrive $x = 12 - 3$, né $x = \dfrac{12}{-3}$. Il $3$ moltiplica la $x$, non le viene sommato: per toglierlo dividi entrambi i membri per $3$ (secondo principio), e il segno resta quello che è. Quindi $x = \dfrac{12}{3} = 4$.
```

```ad-note
Perché non si moltiplica per zero
Moltiplicando entrambi i membri per $0$, qualunque equazione diventa $0 = 0$, che è vera per ogni numero. L'equazione nuova avrebbe soluzioni che quella di partenza non aveva, quindi non sarebbe equivalente. Per la stessa ragione non si divide per $0$: la divisione per zero non è definita.
```

## Come si risolve

1. Se ci sono denominatori numerici, calcola il loro MCM (lo trovi spiegato in [MCD e MCM in ℕ](/materiale/scuola-superiore/matematica/numeri-naturali/mcd-e-mcm-in-n)) e moltiplica per il MCM tutti i termini di entrambi i membri. Il numeratore di ogni frazione va scritto tra parentesi.
2. Svolgi i prodotti e togli le parentesi.
3. Con la regola del trasporto porta i termini con l'incognita a primo membro e i numeri a secondo membro.
4. Riduci i termini simili: arrivi alla forma normale $ax = b$.
5. Se $a \neq 0$, dividi entrambi i membri per $a$ e ottieni $x = \dfrac{b}{a}$, da semplificare se è una frazione. Se $a = 0$, guarda la sezione su equazioni determinate, impossibili e indeterminate.
6. Verifica: sostituisci il valore trovato nell'equazione di partenza e controlla che i due membri vengano uguali.

Non tutti i passi servono in ogni esercizio: se non ci sono frazioni il primo si salta, se non ci sono parentesi si salta il secondo.

## Esempi svolti

```ad-example
Esempio 1: un solo trasporto
$$3x + 5 = 11$$

Porta $+5$ a secondo membro, cambiandogli il segno:

$$3x = 11 - 5 \quad\Rightarrow\quad 3x = 6$$

Dividi entrambi i membri per $3$:

$$x = \frac{6}{3} = 2$$

La soluzione è $S = \{2\}$.
```

```ad-example
Esempio 2: incognita in entrambi i membri
$$5x - 3 = 2x + 9$$

Porta $2x$ a primo membro e $-3$ a secondo membro, cambiando segno a entrambi:

$$5x - 2x = 9 + 3 \quad\Rightarrow\quad 3x = 12 \quad\Rightarrow\quad x = \frac{12}{3} = 4$$

La soluzione è $S = \{4\}$.
```

```ad-warning
Trasportare senza cambiare segno
Da $5x - 3 = 2x + 9$ non si passa a $5x - 2x = 9 - 3$. Il termine che cambia membro cambia anche segno, sempre: $-3$ diventa $+3$, e si ottiene $5x - 2x = 9 + 3$.
```

```ad-example
Esempio 3: coefficiente negativo
$$7 - 2x = 5x + 21$$

Porta i termini con $x$ a primo membro e i numeri a secondo membro:

$$-2x - 5x = 21 - 7 \quad\Rightarrow\quad -7x = 14$$

Dividi per $-7$, facendo attenzione al segno:

$$x = \frac{14}{-7} = -2$$

In alternativa, moltiplica prima per $-1$: $7x = -14$, e quindi $x = -2$. La soluzione è $S = \{-2\}$.
```

```ad-example
Esempio 4: parentesi e soluzione frazionaria
$$3(x - 2) - 2(2x + 1) = 5 - 4x$$

Togli le parentesi. Il $-2$ davanti alla seconda parentesi moltiplica tutti e due i termini: $-2 \cdot 2x = -4x$ e $-2 \cdot 1 = -2$.

$$3x - 6 - 4x - 2 = 5 - 4x$$

Riduci i termini simili a primo membro:

$$-x - 8 = 5 - 4x$$

Trasporta e riduci:

$$-x + 4x = 5 + 8 \quad\Rightarrow\quad 3x = 13 \quad\Rightarrow\quad x = \frac{13}{3}$$

La soluzione è $S = \left\{\dfrac{13}{3}\right\}$: una frazione è una soluzione come un'altra, e non va trasformata in un numero decimale approssimato.
```

```ad-example
Esempio 5: equazione con le frazioni, con la verifica
$$\frac{x - 1}{3} - \frac{x + 2}{4} = \frac{1}{6}$$

Il MCM tra $3$, $4$ e $6$ è $12$. Moltiplica per $12$ ogni termine, tenendo i numeratori tra parentesi:

$$12 \cdot \frac{x - 1}{3} - 12 \cdot \frac{x + 2}{4} = 12 \cdot \frac{1}{6} \quad\Rightarrow\quad 4(x - 1) - 3(x + 2) = 2$$

Togli le parentesi. Il $-3$ cambia il segno di entrambi i termini di $x + 2$:

$$4x - 4 - 3x - 6 = 2 \quad\Rightarrow\quad x - 10 = 2 \quad\Rightarrow\quad x = 12$$

Verifica, sostituendo $12$ nell'equazione di partenza:

$$\frac{12 - 1}{3} - \frac{12 + 2}{4} = \frac{11}{3} - \frac{7}{2} = \frac{22}{6} - \frac{21}{6} = \frac{1}{6}$$

Il primo membro vale $\dfrac{1}{6}$, come il secondo. La soluzione è $S = \{12\}$.
```

```ad-warning
Il meno davanti a una frazione
In $-\dfrac{x + 2}{4}$ il meno riguarda tutto il numeratore. Moltiplicando per $12$ ottieni $-3(x + 2) = -3x - 6$, non $-3x + 6$. Per non sbagliare, quando elimini i denominatori scrivi sempre i numeratori tra parentesi.
```

```ad-warning
Dimenticare i termini senza denominatore
Il MCM moltiplica tutti i termini, anche quelli interi. In $\dfrac{x}{2} + 1 = \dfrac{x}{3}$, moltiplicando per $6$ si ottiene $3x + 6 = 2x$, non $3x + 1 = 2x$.
```

## Equazioni determinate, impossibili e indeterminate

A volte, riducendo i termini simili, il coefficiente dell'incognita diventa $0$ e si arriva a $0x = b$. Poiché $0 \cdot x$ vale $0$ qualunque sia $x$, tutto dipende da $b$:

| Forma normale | Nome | Soluzioni |
|---|---|---|
| $ax = b$ con $a \neq 0$ | determinata | una sola: $S = \left\{\dfrac{b}{a}\right\}$ |
| $0x = b$ con $b \neq 0$ | impossibile | nessuna: $S = \emptyset$ |
| $0x = 0$ | indeterminata | tutti i numeri: $S = \mathbb{R}$ |

Un'equazione **impossibile** non ha soluzioni, perché chiede che $0$ sia uguale a un numero diverso da $0$. Un'equazione **indeterminata** è vera per qualunque valore dell'incognita: si chiama anche **identità**.

```ad-example
Esempio 6: equazione impossibile
$$2(x + 3) = 2x + 5$$

$$2x + 6 = 2x + 5 \quad\Rightarrow\quad 2x - 2x = 5 - 6 \quad\Rightarrow\quad 0x = -1$$

Nessun numero moltiplicato per $0$ dà $-1$. L'equazione è impossibile: $S = \emptyset$.
```

```ad-example
Esempio 7: equazione indeterminata
$$3(x - 1) + x = 4x - 3$$

$$3x - 3 + x = 4x - 3 \quad\Rightarrow\quad 4x - 4x = -3 + 3 \quad\Rightarrow\quad 0x = 0$$

Qualunque numero moltiplicato per $0$ dà $0$, quindi l'uguaglianza è vera per ogni $x$. L'equazione è indeterminata: $S = \mathbb{R}$.
```

```ad-note
$\mathbb{Q}$ oppure $\mathbb{R}$
Nel primo anno molti libri scrivono $S = \mathbb{Q}$ per un'equazione indeterminata, perché i numeri reali non sono ancora stati introdotti. Il senso è lo stesso: è soluzione ogni numero dell'insieme in cui stai lavorando.
```

```ad-warning
Confondere zero con impossibile
L'equazione $8x = 0$ è determinata e ha soluzione $x = 0$: $S = \{0\}$, che non è l'insieme vuoto. Al contrario, $0x = 0$ non significa $x = 0$ (è indeterminata), e $0x = 5$ non si risolve dividendo per $0$ (è impossibile).
```

## Dal testo all'equazione

Molti problemi si risolvono con un'equazione di primo grado. Il procedimento è sempre lo stesso: scegli l'incognita e scrivi che cosa rappresenta, traduci il testo in un'equazione, la risolvi, controlli che la soluzione abbia senso nel problema (un prezzo non può essere negativo, un numero di persone deve essere intero) e rispondi alla domanda con una frase.

```ad-example
Esempio 8: un problema
Compri tre quaderni uguali e una penna da $1{,}50$ euro, e spendi in tutto $9$ euro. Quanto costa un quaderno?

Chiama $x$ il prezzo di un quaderno, in euro. Tre quaderni costano $3x$, e con la penna la spesa è $3x + 1{,}50$:

$$3x + 1{,}50 = 9 \quad\Rightarrow\quad 3x = 7{,}50 \quad\Rightarrow\quad x = 2{,}50$$

Controllo: $3 \cdot 2{,}50 + 1{,}50 = 7{,}50 + 1{,}50 = 9$. Un quaderno costa $2{,}50$ euro.
```
