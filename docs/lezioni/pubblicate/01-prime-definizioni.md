# Prime definizioni

Un insieme è un gruppo di oggetti che si considera come un tutto unico: le vocali dell'alfabeto, i giorni della settimana, i numeri naturali pari. Gli insiemi sono il linguaggio con cui la matematica descrive le soluzioni di un'equazione, i punti di una figura, i numeri con cui fa i conti, per cui conviene fissare subito le parole e i simboli di base.

## Che cos'è un insieme

Un **insieme** è una collezione di oggetti ben definita, cioè descritta in modo che per qualunque oggetto si possa dire, senza discutere, se fa parte della collezione oppure no. Gli oggetti che ne fanno parte si chiamano **elementi** dell'insieme.

Il criterio per decidere deve essere oggettivo: due persone che lo applicano allo stesso oggetto devono arrivare alla stessa risposta.

```ad-example
Esempio 1: insieme o no?
- "I giorni della settimana" è un insieme: lunedì ne fa parte, gennaio no.
- "I numeri naturali minori di 5" è un insieme: i suoi elementi sono 0, 1, 2, 3, 4.
- "Gli studenti della tua classe nati a marzo" è un insieme: per ogni studente la risposta è sì o no.
- "I ragazzi simpatici della tua classe" non è un insieme: essere simpatici è un giudizio personale, e due persone possono dare risposte diverse sullo stesso compagno.
- "I numeri grandi" non è un insieme: nessuno ha stabilito da quale numero in poi un numero è grande.
```

```ad-warning
Chiamare insieme una collezione non ben definita
"I film più belli dell'anno" o "i numeri piccoli" non sono insiemi, perché non c'è un criterio oggettivo per decidere chi ne fa parte. Se la domanda "questo oggetto ne fa parte?" può avere risposte diverse a seconda di chi la valuta, non hai un insieme.
```

In un insieme ogni elemento conta una volta sola e l'ordine in cui lo si pensa non ha importanza: l'insieme delle lettere della parola "matematica" ha sei elementi, cioè m, a, t, e, i, c, anche se nella parola la a compare tre volte. Quando due insiemi si possono considerare uguali lo spiega la lezione [Sottoinsiemi e uguaglianza](/materiale/scuola-superiore/matematica/insiemi-e-logica/sottoinsiemi-e-uguaglianza).

## Come si indicano insiemi ed elementi

Gli insiemi si indicano di solito con le lettere maiuscole ($A$, $B$, $C$, ...) e gli elementi con le minuscole ($a$, $b$, $x$, ...). Per scrivere un insieme elencandone gli elementi si usano le parentesi graffe:

$$A = \{1, 2, 3, 4\}$$

Questo è solo uno dei modi di descrivere un insieme; gli altri (la proprietà caratteristica e i diagrammi di Eulero-Venn) sono nella lezione [Rappresentazione degli insiemi](/materiale/scuola-superiore/matematica/insiemi-e-logica/rappresentazione-degli-insiemi).

Alcuni insiemi di numeri hanno un simbolo proprio, che userai per tutto il corso:

- $\mathbb{N}$, i numeri naturali: $0, 1, 2, 3, \dots$ (lo $0$ è compreso);
- $\mathbb{Z}$, i numeri interi relativi: $\dots, -2, -1, 0, 1, 2, \dots$;
- $\mathbb{Q}$, i numeri razionali, cioè quelli che si scrivono come frazione;
- $\mathbb{R}$, i numeri reali.

```ad-warning
Dimenticare lo 0 tra i naturali
Nella scuola italiana $0 \in \mathbb{N}$. Per questo i numeri naturali minori di 5 sono cinque (0, 1, 2, 3, 4) e non quattro.
```

## Appartenenza: i simboli ∈ e ∉

Per dire che un oggetto è un elemento di un insieme si usa il simbolo $\in$, che si legge "appartiene a". Il simbolo $\notin$ si legge "non appartiene a".

Se $A = \{1, 2, 3, 4\}$:

$$3 \in A \qquad 7 \notin A$$

Il simbolo $\in$ mette sempre a sinistra un elemento e a destra un insieme. Per confrontare due insiemi tra loro (per esempio per dire che uno è contenuto nell'altro) servono altri simboli, che trovi nella lezione [Sottoinsiemi e uguaglianza](/materiale/scuola-superiore/matematica/insiemi-e-logica/sottoinsiemi-e-uguaglianza).

```ad-example
Esempio 2: vero o falso
Sia $P$ l'insieme dei numeri naturali pari minori di 10, cioè $P = \{0, 2, 4, 6, 8\}$.
- $4 \in P$ è vero.
- $0 \in P$ è vero: $0$ è un numero naturale ed è pari, perché $0 = 2 \cdot 0$.
- $10 \in P$ è falso: $10$ è pari ma non è minore di 10, quindi $10 \notin P$.
- $-2 \in P$ è falso: $-2$ è pari, ma non è un numero naturale.
- $\frac{1}{2} \in \mathbb{N}$ è falso, mentre $\frac{1}{2} \in \mathbb{Q}$ è vero.
```

## L'insieme vuoto

Un insieme può non avere nessun elemento: si chiama **insieme vuoto** e si indica con $\emptyset$ (a volte anche con $\{\ \}$). Non esiste un insieme vuoto delle vocali e uno dei numeri: l'insieme vuoto è uno solo.

L'insieme vuoto compare spesso quando la proprietà che descrive un insieme non è soddisfatta da nessun oggetto.

```ad-example
Esempio 3: insiemi vuoti
- L'insieme dei numeri naturali minori di 0 è vuoto, perché il più piccolo numero naturale è 0.
- L'insieme dei mesi dell'anno con 32 giorni è vuoto.
- L'insieme dei numeri naturali $x$ tali che $x + 5 = 2$ è vuoto: l'unico numero che soddisfa l'uguaglianza è $-3$, che non è naturale.
```

Un insieme che ha un solo elemento, come $\{0\}$, si chiama **insieme unitario**.

```ad-warning
Confondere $\emptyset$ con $\{0\}$
$\{0\}$ non è vuoto: ha un elemento, il numero 0, e la sua cardinalità è 1. Lo stesso vale per $\{\emptyset\}$, che ha come unico elemento l'insieme vuoto. L'insieme vuoto si scrive $\emptyset$ oppure $\{\ \}$, senza niente dentro le graffe.
```

## Insiemi finiti e infiniti

Un insieme è **finito** se ha un numero finito di elementi, cioè se contandoli uno alla volta a un certo punto si finisce. Altrimenti è **infinito**.

Il numero degli elementi di un insieme finito si chiama **cardinalità** e si indica con $|A|$ (alcuni libri scrivono $\text{card}(A)$ oppure $n(A)$).

```ad-example
Esempio 4: finito o infinito?
- $A = \{1, 2, 3, 4\}$ è finito e $|A| = 4$.
- L'insieme $L$ delle lettere della parola "matematica" è finito e $|L| = 6$, perché le lettere ripetute si contano una volta.
- L'insieme dei numeri naturali minori di un milione è finito, anche se molto grande: i suoi elementi vanno da 0 a 999.999, quindi sono 1.000.000.
- $\mathbb{N}$ è infinito: dopo ogni numero naturale ce n'è un altro.
- L'insieme dei multipli di 5 in $\mathbb{N}$, cioè $0, 5, 10, 15, \dots$, è infinito.
- $\emptyset$ è finito e $|\emptyset| = 0$.
```

```ad-warning
Contare due volte lo stesso elemento
Nell'insieme delle lettere della parola "cocco" gli elementi sono c e o, quindi la cardinalità è 2, non 5. Un elemento o appartiene all'insieme o no: non può appartenergli "due volte".
```

## L'insieme universo

Quando si lavora con più insiemi, di solito i loro elementi si prendono tutti da uno stesso insieme più grande, fissato all'inizio: si chiama **insieme universo** e si indica con $U$. In un problema sugli studenti di una classe, l'universo è l'insieme di tutti gli studenti della classe; in un problema sui numeri da 1 a 20, l'universo è $U = \{1, 2, \dots, 20\}$.

L'universo non è sempre lo stesso: lo decide il problema. Scegliere l'universo serve, per esempio, a dire quali elementi mancano a un insieme, cioè a calcolarne il complementare, che trovi nella lezione [Differenza e complementare](/materiale/scuola-superiore/matematica/insiemi-e-logica/differenza-e-complementare).

```ad-example
Esempio 5: lo stesso insieme in due universi
Sia $A$ l'insieme dei numeri pari.
- Se l'universo è $U = \{1, 2, 3, 4, 5, 6\}$, allora $A = \{2, 4, 6\}$, è finito e $|A| = 3$.
- Se l'universo è $\mathbb{N}$, allora $A = \{0, 2, 4, 6, \dots\}$ ed è infinito.
La proprietà "essere pari" è la stessa, ma cambia quali oggetti si considerano, e quindi cambia l'insieme.
```
