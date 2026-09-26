# Scomposizione con la regola di Ruffini

Il polinomio $x^3 - 2x^2 - 5x + 6$ non ha un fattore comune da raccogliere, non è un prodotto notevole e i suoi quattro termini non si raggruppano bene. Eppure si scompone: $x^3 - 2x^2 - 5x + 6 = (x - 1)(x + 2)(x - 3)$. Per trovare fattori come questi si usa il teorema di Ruffini: se sai quale numero rende nullo il polinomio, conosci anche uno dei suoi fattori.

La regola di Ruffini per dividere un polinomio per $x - a$, il teorema del resto e il teorema di Ruffini sono spiegati nella lezione [Regola di Ruffini e teorema del resto](/materiale/scuola-superiore/matematica/monomi-e-polinomi/regola-di-ruffini-e-teorema-del-resto). Qui si usano per scomporre. Tutti i polinomi della lezione hanno coefficienti interi, e la scomposizione si fa con fattori a coefficienti interi.

## Da uno zero a un fattore

Un numero $a$ è uno **zero** del polinomio $P(x)$ se $P(a) = 0$. Alcuni libri lo chiamano anche radice del polinomio. Per esempio $1$ è uno zero di $P(x) = x^3 - 2x^2 - 5x + 6$, perché

$$P(1) = 1 - 2 - 5 + 6 = 0.$$

Il teorema di Ruffini dice che $x - a$ divide $P(x)$ se e solo se $P(a) = 0$. Quindi, trovato uno zero $a$, la divisione di $P(x)$ per $x - a$ ha resto $0$, e il polinomio si scrive come prodotto:

$$P(x) = (x - a) \cdot Q(x),$$

dove $Q(x)$ è il quoziente della divisione, di un grado più basso di $P(x)$. Il quoziente si trova con la regola di Ruffini. Poi si continua a scomporre $Q(x)$, che è più semplice.

```ad-warning
Sbagliare il segno del fattore
Se lo zero è $a$, il fattore è $x - a$, con il segno cambiato. Se $P(-2) = 0$ il fattore è $x - (-2) = x + 2$, non $x - 2$. Il controllo è veloce: il fattore deve valere $0$ quando metti lo zero al posto di $x$.
```

## Quali numeri provare

Provare a caso non serve: per un polinomio a coefficienti interi gli zeri razionali si cercano in un elenco finito di candidati.

### Zeri interi

Se un polinomio a coefficienti interi ha uno zero intero, questo è un divisore del termine noto. I divisori vanno presi con tutti e due i segni.

Il motivo si vede su $P(x) = x^3 - 2x^2 - 5x + 6$. Se $a$ è uno zero intero, allora $a^3 - 2a^2 - 5a + 6 = 0$, cioè

$$
\begin{aligned}
6 &= -a^3 + 2a^2 + 5a \\
&= a \cdot (-a^2 + 2a + 5).
\end{aligned}
$$

A destra c'è un multiplo di $a$, quindi $6$ è multiplo di $a$: $a$ divide $6$. I candidati sono i divisori di $6$ (trovi come si elencano in [Divisibilità e numeri primi](/materiale/scuola-superiore/matematica/numeri-naturali/divisibilita-e-numeri-primi)):

$$\pm 1, \quad \pm 2, \quad \pm 3, \quad \pm 6.$$

Non tutti i candidati sono zeri: di solito lo sono pochi, e a volte nessuno. Per sapere quali lo sono si calcola il valore del polinomio in ognuno, fino a trovare quello che dà $0$.

```ad-tip
I primi due candidati
$P(1)$ è la somma dei coefficienti: per $x^3 - 2x^2 - 5x + 6$ vale $1 - 2 - 5 + 6 = 0$. $P(-1)$ si ottiene cambiando segno ai coefficienti dei termini di grado dispari prima di sommare: $-1 - 2 + 5 + 6 = 8$. Conviene provare sempre $1$ e $-1$ per primi.
```

### Zeri frazionari

Il [coefficiente direttore](/materiale/scuola-superiore/matematica/monomi-e-polinomi/polinomi-e-grado-di-un-polinomio) di un polinomio è il coefficiente del suo termine di grado più alto: in $4x^3 - 5x + 6$ è $4$. Quando il coefficiente direttore è $1$ o $-1$, gli zeri razionali, se ci sono, sono tutti interi. Altrimenti il polinomio può avere zeri frazionari, e si cercano così: se la frazione $\dfrac{p}{q}$, ridotta ai minimi termini, è uno zero, allora $p$ è un divisore del termine noto e $q$ è un divisore del coefficiente direttore.

Per $4x^3 - 5x + 6$ i divisori del termine noto sono $1, 2, 3, 6$ e quelli del coefficiente direttore sono $1, 2, 4$. Le frazioni $\dfrac{p}{q}$ diverse tra loro, con tutti e due i segni, sono

$$
\begin{aligned}
&\pm 1, \qquad \pm 2, \qquad \pm 3, \qquad \pm 6, \\[6pt]
&\pm \frac{1}{2}, \qquad \pm \frac{3}{2}, \qquad \pm \frac{1}{4}, \qquad \pm \frac{3}{4}.
\end{aligned}
$$

Con tanti candidati si parte dagli interi più piccoli: i conti sono più rapidi.

### Se il termine noto è zero

Se il termine noto è $0$, lo zero è $x = 0$ e il fattore è $x$: invece di usare Ruffini, raccogli la $x$ (o la sua potenza più alta che compare in tutti i termini), come nel [raccoglimento totale](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/raccoglimento-totale-e-parziale). Per esempio $x^3 - 2x^2 - 5x = x(x^2 - 2x - 5)$. I candidati si cercano poi sul polinomio rimasto, con il suo termine noto.

## Procedimento

1. Ordina il polinomio secondo le potenze decrescenti di $x$ e raccogli quello che si può raccogliere, compresa la $x$ se il termine noto è $0$.
2. Scrivi i candidati: i divisori del termine noto con i due segni e, se il coefficiente direttore non è $\pm 1$, le frazioni $\dfrac{p}{q}$.
3. Calcola il valore del polinomio nei candidati, fino a trovarne uno che dà $0$: è uno zero $a$.
4. Dividi il polinomio per $x - a$ con la regola di Ruffini e scrivi $P(x) = (x - a) \cdot Q(x)$.
5. Scomponi $Q(x)$: se è di secondo grado, con il [trinomio di secondo grado](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/trinomio-di-secondo-grado) o un prodotto notevole; se il grado è più alto, di nuovo con Ruffini. Ti fermi quando nessun fattore si scompone più.
6. Controlla il risultato: moltiplica i fattori, oppure calcola il polinomio e il prodotto in uno stesso punto.

Nella tabella di Ruffini la prima riga contiene i coefficienti del dividendo, a sinistra c'è lo zero, e l'ultima riga dà i coefficienti del quoziente e, dopo la barra, il resto. Se lo zero è giusto, il resto è $0$.

## Esempi svolti

```ad-example
Esempio 1: un polinomio di terzo grado
Scomponi $P(x) = x^3 - 2x^2 - 5x + 6$.

Non c'è niente da raccogliere. Il coefficiente direttore è $1$, quindi i candidati sono i divisori di $6$: $\pm 1$, $\pm 2$, $\pm 3$, $\pm 6$. Il primo funziona:

$$P(1) = 1 - 2 - 5 + 6 = 0.$$

Dividi per $x - 1$ con la regola di Ruffini:

$$\begin{array}{r|rrr|r} & 1 & -2 & -5 & 6 \\ 1 & & 1 & -1 & -6 \\ \hline & 1 & -1 & -6 & 0 \end{array}$$

Il resto è $0$ e il quoziente è $x^2 - x - 6$, quindi

$$P(x) = (x - 1)(x^2 - x - 6).$$

Il quoziente è un trinomio di secondo grado: i due numeri con somma $-1$ e prodotto $-6$ sono $2$ e $-3$, quindi $x^2 - x - 6 = (x + 2)(x - 3)$. Il risultato è

$$
\begin{aligned}
&x^3 - 2x^2 - 5x + 6 \\
&= (x - 1)(x + 2)(x - 3).
\end{aligned}
$$

Controllo in $x = 2$: il polinomio vale $8 - 8 - 10 + 6 = -4$ e il prodotto $(2 - 1)(2 + 2)(2 - 3) = 1 \cdot 4 \cdot (-1) = -4$.
```

```ad-warning
Fermarsi dopo la prima divisione
$(x - 1)(x^2 - x - 6)$ è un prodotto, ma la scomposizione non è finita: il quoziente si scompone ancora. Dopo ogni divisione guarda il quoziente e chiediti se si può scomporre.
```

```ad-example
Esempio 2: zero negativo e polinomio incompleto
Scomponi $P(x) = x^3 - 13x - 12$.

I candidati sono i divisori di $12$: $\pm 1$, $\pm 2$, $\pm 3$, $\pm 4$, $\pm 6$, $\pm 12$.

$$
\begin{gathered}
P(1) = 1 - 13 - 12 = -24 \\
P(-1) = -1 + 13 - 12 = 0
\end{gathered}
$$

Lo zero è $-1$, quindi il fattore è $x - (-1) = x + 1$. Nel polinomio manca il termine in $x^2$: nella tabella al suo posto va uno $0$, altrimenti i coefficienti finiscono sotto le potenze sbagliate.

$$\begin{array}{r|rrr|r} & 1 & 0 & -13 & -12 \\ -1 & & -1 & 1 & 12 \\ \hline & 1 & -1 & -12 & 0 \end{array}$$

Il quoziente è $x^2 - x - 12$, e i due numeri con somma $-1$ e prodotto $-12$ sono $3$ e $-4$:

$$
\begin{aligned}
&x^3 - 13x - 12 \\
&= (x + 1)(x^2 - x - 12) \\
&= (x + 1)(x + 3)(x - 4).
\end{aligned}
$$
```

```ad-warning
Dimenticare lo zero nella tabella
Se nella prima riga scrivi solo $1$, $-13$, $-12$, la tabella tratta il polinomio come $x^2 - 13x - 12$ e il resto non viene $0$. Ogni potenza mancante, dalla più alta al termine noto, ha il suo $0$.
```

```ad-example
Esempio 3: uno zero frazionario
Scomponi $P(x) = 2x^3 + x^2 + x - 1$.

Il termine noto è $-1$, con divisori $\pm 1$; il coefficiente direttore è $2$, con divisori $1$ e $2$. I candidati sono $\pm 1$ e $\pm \dfrac{1}{2}$.

$$
\begin{gathered}
P(1) = 2 + 1 + 1 - 1 = 3 \\
P(-1) = -2 + 1 - 1 - 1 = -3
\end{gathered}
$$

$$
\begin{aligned}
P\left(\frac{1}{2}\right) &= 2 \cdot \frac{1}{8} + \frac{1}{4} + \frac{1}{2} - 1 \\
&= \frac{1}{4} + \frac{1}{4} + \frac{1}{2} - 1 \\
&= 0
\end{aligned}
$$

Lo zero è $\dfrac{1}{2}$. Dividi per $x - \dfrac{1}{2}$:

$$\begin{array}{r|rrr|r} & 2 & 1 & 1 & -1 \\ \frac{1}{2} & & 1 & 1 & 1 \\ \hline & 2 & 2 & 2 & 0 \end{array}$$

Quindi $P(x) = \left(x - \dfrac{1}{2}\right)(2x^2 + 2x + 2)$. Per avere fattori a coefficienti interi raccogli il $2$ dal quoziente e portalo nel primo fattore:

$$
\begin{aligned}
&\left(x - \frac{1}{2}\right) \cdot 2(x^2 + x + 1) \\
&= 2\left(x - \frac{1}{2}\right)(x^2 + x + 1) \\
&= (2x - 1)(x^2 + x + 1).
\end{aligned}
$$

Il trinomio $x^2 + x + 1$ non si scompone: non ci sono due interi con somma $1$ e prodotto $1$. Il risultato è

$$
\begin{aligned}
&2x^3 + x^2 + x - 1 \\
&= (2x - 1)(x^2 + x + 1).
\end{aligned}
$$
```

```ad-warning
Perdere il coefficiente
Scrivere $\left(x - \dfrac{1}{2}\right)(x^2 + x + 1)$ è sbagliato: il $2$ raccolto dal quoziente è sparito, e infatti il prodotto ha coefficiente direttore $1$ invece di $2$. Il $2$ va moltiplicato nel fattore $x - \dfrac{1}{2}$, che diventa $2x - 1$. In generale, allo zero $\dfrac{p}{q}$ corrisponde il fattore $qx - p$.
```

```ad-example
Esempio 4: quarto grado, con uno zero che si ripete
Scomponi $P(x) = x^4 - x^3 - 3x^2 + 5x - 2$.

I candidati sono $\pm 1$ e $\pm 2$. $P(1) = 1 - 1 - 3 + 5 - 2 = 0$:

$$\begin{array}{r|rrrr|r} & 1 & -1 & -3 & 5 & -2 \\ 1 & & 1 & 0 & -3 & 2 \\ \hline & 1 & 0 & -3 & 2 & 0 \end{array}$$

Il quoziente è $Q(x) = x^3 - 3x + 2$, di terzo grado, e si scompone ancora con Ruffini. I suoi candidati sono i divisori di $2$, e $Q(1) = 1 - 3 + 2 = 0$: lo zero $1$ si ripete.

$$\begin{array}{r|rrr|r} & 1 & 0 & -3 & 2 \\ 1 & & 1 & 1 & -2 \\ \hline & 1 & 1 & -2 & 0 \end{array}$$

Il nuovo quoziente è $x^2 + x - 2 = (x + 2)(x - 1)$. Mettendo insieme i fattori,

$$
\begin{aligned}
&P(x) \\
&= (x - 1)(x - 1)(x + 2)(x - 1) \\
&= (x - 1)^3(x + 2).
\end{aligned}
$$
```

```ad-tip
Quali candidati riprovare sul quoziente
Se $P(x) = (x - a) \cdot Q(x)$, ogni zero di $Q(x)$ è anche uno zero di $P(x)$. Quindi un candidato che hai già scartato per $P(x)$ non può essere zero di $Q(x)$ e non va riprovato. Lo zero appena trovato invece va riprovato, come nell'esempio 4.
```

## Quando nessun candidato funziona

Se nessun candidato è uno zero, il polinomio non ha zeri razionali e non ha fattori di primo grado a coefficienti interi: Ruffini non lo scompone. Che cosa vuol dire dipende dal grado.

Un polinomio di secondo o di terzo grado senza zeri razionali non si scompone: se si scomponesse, uno dei fattori sarebbe di primo grado, e darebbe uno zero. Per esempio in $x^3 + x + 1$ i candidati sono $\pm 1$, e nessuno funziona: $1 + 1 + 1 = 3$ e $-1 - 1 + 1 = -1$. Quindi $x^3 + x + 1$ è irriducibile.

Dal quarto grado in su non è più così: un polinomio può non avere zeri e scomporsi in fattori di secondo grado. $x^4 + 5x^2 + 6$ è sempre positivo, quindi non ha zeri, ma è un trinomio in $x^2$ e si scompone: $x^4 + 5x^2 + 6 = (x^2 + 2)(x^2 + 3)$.

## Come scegliere il metodo

Davanti a un polinomio da scomporre non si parte da Ruffini, che è il metodo più lungo. Si provano i metodi in quest'ordine:

1. Il raccoglimento totale, sempre per primo: il fattore comune a tutti i termini, compresa la $x$ se il termine noto è $0$.
2. Poi conta i termini di quello che resta e cerca il metodo adatto (tabella qui sotto).
3. Se niente funziona, e il polinomio è in una sola lettera, Ruffini.
4. Ogni fattore ottenuto si riprova dall'inizio, finché nessuno si scompone più.

| Termini | Metodi da provare |
|---|---|
| $2$ | differenza di quadrati, somma o differenza di cubi |
| $3$ | quadrato di un binomio, trinomio di secondo grado |
| $4$ | raccoglimento parziale, cubo di un binomio |
| $6$ | quadrato di un trinomio, raccoglimento parziale |

I prodotti notevoli sono nella lezione [Scomposizione con i prodotti notevoli](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-i-prodotti-notevoli), il raccoglimento in [Raccoglimento totale e parziale](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/raccoglimento-totale-e-parziale). Se riconosci un prodotto notevole o un trinomio, usa quello anche quando Ruffini potrebbe arrivare allo stesso risultato: i conti sono più corti, e Ruffini trova solo i fattori di primo grado.

```ad-example
Esempio 5: tre metodi nello stesso esercizio
Scomponi $2x^5 + 2x^4 - 14x^3 - 2x^2 + 12x$.

Raccoglimento totale. I coefficienti hanno MCD $2$ e tutti i termini contengono la $x$:

$$
\begin{aligned}
&2x^5 + 2x^4 - 14x^3 - 2x^2 + 12x \\
&= 2x(x^4 + x^3 - 7x^2 - x + 6).
\end{aligned}
$$

La parentesi ha cinque termini: niente prodotti notevoli e niente raccoglimento parziale. Resta Ruffini, con i candidati $\pm 1$, $\pm 2$, $\pm 3$, $\pm 6$. La somma dei coefficienti è $1 + 1 - 7 - 1 + 6 = 0$, quindi $1$ è uno zero:

$$\begin{array}{r|rrrr|r} & 1 & 1 & -7 & -1 & 6 \\ 1 & & 1 & 2 & -5 & -6 \\ \hline & 1 & 2 & -5 & -6 & 0 \end{array}$$

Il quoziente $x^3 + 2x^2 - 5x - 6$ è di terzo grado. Il candidato $1$ non va più bene ($1 + 2 - 5 - 6 = -8$), mentre $-1$ sì: $-1 + 2 + 5 - 6 = 0$.

$$\begin{array}{r|rrr|r} & 1 & 2 & -5 & -6 \\ -1 & & -1 & -1 & 6 \\ \hline & 1 & 1 & -6 & 0 \end{array}$$

L'ultimo quoziente è il trinomio $x^2 + x - 6$: i numeri con somma $1$ e prodotto $-6$ sono $3$ e $-2$, quindi $x^2 + x - 6 = (x + 3)(x - 2)$. Il risultato è

$$
\begin{aligned}
&2x^5 + 2x^4 - 14x^3 \\
&\quad - 2x^2 + 12x \\
&= 2x(x - 1)(x + 1) \\
&\quad \cdot (x + 3)(x - 2).
\end{aligned}
$$
```

```ad-warning
Usare Ruffini prima di raccogliere
Senza raccogliere $2x$, il termine noto dell'esempio 5 è $0$ e il polinomio è di quinto grado: le divisioni diventano una in più, con numeri più grandi. Raccogliere prima abbassa il grado e rende più corti i conti.
```

La scomposizione completa serve in quasi tutto quello che viene dopo: per il [MCD e MCM di polinomi](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/mcd-e-mcm-di-polinomi), per le frazioni algebriche e, al secondo anno, per le [equazioni di grado superiore](/materiale/scuola-superiore/matematica/equazioni-e-disequazioni-di-grado-superiore/equazioni-binomie-trinomie-e-scomponibili).
