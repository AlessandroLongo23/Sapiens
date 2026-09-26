# Implicazione, condizioni necessarie e sufficienti

"Se piove, prendo l'ombrello", "se un numero è divisibile per $4$, allora è pari": le frasi con "se... allora" le usi tutti i giorni, e in matematica quasi ogni teorema ha questa forma. In logica il "se... allora" è un connettivo, l'implicazione, e da questo connettivo vengono le parole che trovi negli enunciati: condizione necessaria, condizione sufficiente, "se e solo se". Proposizioni, connettivi e tavole di verità sono spiegati nella lezione [Proposizioni e connettivi logici](/materiale/scuola-superiore/matematica/insiemi-e-logica/proposizioni-e-connettivi-logici); qui si usano le stesse convenzioni, con le proposizioni indicate dalle lettere $p$, $q$, $r$ e i valori di verità V (vero) e F (falso).

## Implicazione materiale

Date due proposizioni $p$ e $q$, l'**implicazione materiale** $p \to q$ è la proposizione "se $p$, allora $q$", che è falsa solo quando $p$ è vera e $q$ è falsa, e vera in tutti gli altri casi. Si legge anche "$p$ implica $q$". La proposizione $p$ si chiama **premessa** e $q$ si chiama **conseguenza**; molti libri le chiamano antecedente e conseguente.

| $p$ | $q$ | $p \to q$ |
|---|---|---|
| V | V | V |
| V | F | F |
| F | V | V |
| F | F | V |

Le prime due righe sono quelle che ti aspetti: con la premessa vera, l'implicazione è vera se la conseguenza è vera e falsa se la conseguenza è falsa. Le ultime due dicono che, quando la premessa è falsa, l'implicazione è vera qualunque sia la conseguenza.

### Perché con la premessa falsa l'implicazione è vera

Pensa all'implicazione come a una promessa. Un genitore ti dice: "Se prendi 8 nella verifica, ti porto al concerto". La promessa è $p \to q$, con $p$: "prendi 8 nella verifica" e $q$: "ti porto al concerto". I casi possibili sono quattro:

- prendi 8 e vai al concerto: la promessa è mantenuta;
- prendi 8 e non vai al concerto: la promessa è tradita;
- non prendi 8 e vai lo stesso al concerto: la promessa non è tradita, perché non diceva niente su cosa succede se non prendi 8;
- non prendi 8 e non vai al concerto: anche qui la promessa è rispettata.

L'unico caso in cui puoi accusare il genitore di non aver mantenuto la parola è il secondo, con la premessa vera e la conseguenza falsa, ed è l'unica riga con F nella tavola.

```ad-warning
Pensare che l'implicazione sia falsa quando la premessa è falsa
"Se $7$ è pari, allora $7$ è divisibile per $4$" è una proposizione vera: la premessa è falsa, e un'implicazione con la premessa falsa è sempre vera. Un'implicazione è falsa in un caso solo, premessa vera e conseguenza falsa.
```

L'implicazione materiale guarda solo i valori di verità di $p$ e di $q$, non se tra le due frasi c'è un legame di causa o di significato. "Se $2 + 2 = 4$, allora Roma è in Italia" è vera perché le due proposizioni sono vere, anche se la somma non ha niente a che fare con Roma.

```ad-example
Esempio 1: il valore di verità di un'implicazione
Stabilisci se queste implicazioni sono vere o false.
1. "Se $6$ è pari, allora $6$ è divisibile per $3$."
2. "Se $9$ è dispari, allora $9$ è un numero primo."
3. "Se $10$ è divisibile per $4$, allora $10$ è pari."
4. "Se $3 > 5$, allora $3 > 8$."

Per ognuna si trova il valore della premessa e quello della conseguenza, poi si legge la riga della tavola.
1. Premessa V, conseguenza V ($6 = 3 \cdot 2$): l'implicazione è vera.
2. Premessa V, conseguenza F ($9 = 3 \cdot 3$): l'implicazione è falsa.
3. Premessa F ($10 = 4 \cdot 2 + 2$), conseguenza V: l'implicazione è vera.
4. Premessa F, conseguenza F: l'implicazione è vera.

La 3 e la 4 sono vere solo perché la premessa è falsa.
```

## Inversa, contraria e contronominale

Da un'implicazione $p \to q$ se ne ottengono altre tre scambiando le due proposizioni, negandole o facendo tutte e due le cose:

| Nome | Forma |
|---|---|
| Implicazione | $p \to q$ |
| Inversa | $q \to p$ |
| Contraria | $\neg p \to \neg q$ |
| Contronominale | $\neg q \to \neg p$ |

Per esempio, dall'implicazione "se un animale è un gatto, allora è un mammifero" si ottengono:

- l'inversa, "se un animale è un mammifero, allora è un gatto";
- la contraria, "se un animale non è un gatto, allora non è un mammifero";
- la contronominale, "se un animale non è un mammifero, allora non è un gatto".

L'implicazione e la contronominale sono vere; l'inversa e la contraria sono false, perché un cane è un mammifero e non è un gatto. Non è un caso, come mostra la tavola di verità delle quattro forme:

| $p$ | $q$ | $p \to q$ | $q \to p$ | $\neg p \to \neg q$ | $\neg q \to \neg p$ |
|---|---|---|---|---|---|
| V | V | V | V | V | V |
| V | F | F | V | V | F |
| F | V | V | F | F | V |
| F | F | V | V | V | V |

La colonna della contronominale è uguale, riga per riga, a quella dell'implicazione: le due proposizioni hanno sempre lo stesso valore di verità, cioè sono equivalenti. Anche l'inversa e la contraria hanno la stessa colonna tra loro, ma diversa da quella dell'implicazione.

```ad-warning
Scambiare un'implicazione con la sua inversa
"Se un quadrilatero è un quadrato, allora è un rettangolo" è vera, ma l'inversa "se un quadrilatero è un rettangolo, allora è un quadrato" è falsa: un rettangolo con i lati di $2$ cm e $5$ cm non è un quadrato. Da $p \to q$ vera non segue $q \to p$; segue la contronominale $\neg q \to \neg p$.
```

```ad-note
I nomi cambiano da un libro all'altro
Alcuni libri chiamano $q \to p$ "reciproca" o "conversa", e qualcuno chiama "inversa" la $\neg p \to \neg q$. Sul nome della contronominale sono tutti d'accordo, e i fatti non cambiano: la contronominale è equivalente all'implicazione, le altre due no.
```

```ad-example
Esempio 2: le quattro forme di un enunciato sui numeri
Considera l'enunciato "se un numero naturale è divisibile per $4$, allora è pari". Scrivi l'inversa, la contraria e la contronominale e stabilisci quali sono vere.

Chiamiamo $p$: "$n$ è divisibile per $4$" e $q$: "$n$ è pari". L'enunciato è vero, perché ogni multiplo di $4$ si scrive $4k = 2 \cdot 2k$ ed è pari.
- Inversa, $q \to p$: "se $n$ è pari, allora è divisibile per $4$". Falsa: $6$ è pari ma non è divisibile per $4$.
- Contraria, $\neg p \to \neg q$: "se $n$ non è divisibile per $4$, allora non è pari". Falsa: di nuovo $6$, che non è divisibile per $4$ ma è pari.
- Contronominale, $\neg q \to \neg p$: "se $n$ non è pari, allora non è divisibile per $4$". Vera, come l'enunciato: i multipli di $4$ sono tutti pari, quindi un numero dispari non può esserlo.

Qui le proposizioni parlano di un numero qualsiasi: l'enunciato è vero se è vero per ogni $n$, ed è falso se c'è anche un solo numero per cui la premessa è vera e la conseguenza è falsa. Un numero così si chiama controesempio: il $6$ è un controesempio per l'inversa e per la contraria. Enunciati con una variabile e controesempi sono spiegati nella lezione [Quantificatori](/materiale/scuola-superiore/matematica/insiemi-e-logica/quantificatori).
```

## Doppia implicazione

La **doppia implicazione** $p \leftrightarrow q$ si legge "$p$ se e solo se $q$" ed è vera quando $p$ e $q$ hanno lo stesso valore di verità, cioè quando sono tutte e due vere o tutte e due false.

| $p$ | $q$ | $p \to q$ | $q \to p$ | $p \leftrightarrow q$ |
|---|---|---|---|---|
| V | V | V | V | V |
| V | F | F | V | F |
| F | V | V | F | F |
| F | F | V | V | V |

Il nome viene dal fatto che $p \leftrightarrow q$ è vera esattamente nelle righe in cui sono vere sia $p \to q$ sia la sua inversa $q \to p$: la doppia implicazione vale come l'implicazione nei due sensi. Per esempio "un numero naturale è divisibile per $10$ se e solo se la sua ultima cifra è $0$" è vera, perché sono vere tutte e due le implicazioni: "se è divisibile per $10$, allora finisce con $0$" e "se finisce con $0$, allora è divisibile per $10$" (è il criterio di divisibilità per $10$ della lezione [Divisibilità e numeri primi](/materiale/scuola-superiore/matematica/numeri-naturali/divisibilita-e-numeri-primi)).

## Implicazione logica ed equivalenza logica

Se l'implicazione $p \to q$ è una tautologia, cioè è vera in tutte le righe della sua tavola di verità, si dice che $p$ **implica logicamente** $q$ e si scrive

$$p \Rightarrow q$$

Se è una tautologia la doppia implicazione $p \leftrightarrow q$, le due proposizioni sono **logicamente equivalenti** e si scrive $p \Leftrightarrow q$: nella tavola di verità hanno la stessa colonna. Tautologie e proposizioni equivalenti sono nella lezione [Proposizioni e connettivi logici](/materiale/scuola-superiore/matematica/insiemi-e-logica/proposizioni-e-connettivi-logici).

La differenza tra le due frecce è questa: $p \to q$ è una proposizione, che può essere vera o falsa; $p \Rightarrow q$ è un'affermazione su $p$ e $q$, e dice che $p \to q$ è vera sempre, qualunque siano i valori delle lettere. Dalla tavola della sezione precedente, per esempio, l'implicazione e la contronominale sono logicamente equivalenti:

$$(p \to q) \Leftrightarrow (\neg q \to \neg p)$$

Con la stessa tavola si vede che un'implicazione si può scrivere anche con la negazione e la disgiunzione: $p \to q$ è falsa solo nella riga V F, come $\neg p \vee q$.

| $p$ | $q$ | $\neg p$ | $\neg p \vee q$ | $p \to q$ |
|---|---|---|---|---|
| V | V | F | V | V |
| V | F | F | F | F |
| F | V | V | V | V |
| F | F | V | V | V |

$$(p \to q) \Leftrightarrow (\neg p \vee q)$$

Quando $p$ e $q$ parlano di una variabile, come "$n$ è divisibile per $4$" e "$n$ è pari", si scrive $p \Rightarrow q$ se $p \to q$ è vera per ogni valore della variabile. Nell'esempio 2 hai visto che "$n$ è divisibile per $4$" $\Rightarrow$ "$n$ è pari".

```ad-note
La freccia doppia nei libri
Nei ragionamenti scritti alla lavagna la freccia $\Rightarrow$ si usa per dire "e quindi", come in $x = 3 \Rightarrow x^2 = 9$, ed è lo stesso significato: ogni volta che vale la prima uguaglianza vale anche la seconda. Alcuni libri però scrivono con $\Rightarrow$ anche il connettivo $p \to q$: controlla quale scelta fa il tuo.
```

```ad-example
Esempio 3: un ragionamento corretto
"Se piove, la strada è bagnata. Piove. Quindi la strada è bagnata." Verifica con la tavola di verità che il ragionamento è corretto, cioè che $(p \to q) \wedge p \Rightarrow q$.

Con $p$: "piove" e $q$: "la strada è bagnata", chiamiamo $r$ la premessa del ragionamento, $r = (p \to q) \wedge p$, e costruiamo la tavola di $r \to q$:

| $p$ | $q$ | $p \to q$ | $r$ | $r \to q$ |
|---|---|---|---|---|
| V | V | V | V | V |
| V | F | F | F | V |
| F | V | V | F | V |
| F | F | V | F | V |

L'ultima colonna è tutta V: $r \to q$ è una tautologia, quindi $(p \to q) \wedge p \Rightarrow q$. Chi sa che vale $p \to q$ e che $p$ è vera può concludere che $q$ è vera.
```

```ad-example
Esempio 4: un ragionamento sbagliato
"Se piove, la strada è bagnata. La strada è bagnata. Quindi piove." Stabilisci se il ragionamento è corretto.

Con le stesse lettere, la premessa del ragionamento è $s = (p \to q) \wedge q$ e bisogna controllare se $s \to p$ è una tautologia:

| $p$ | $q$ | $p \to q$ | $s$ | $s \to p$ |
|---|---|---|---|---|
| V | V | V | V | V |
| V | F | F | F | V |
| F | V | V | V | F |
| F | F | V | F | V |

Nella terza riga $s \to p$ è falsa, quindi non è una tautologia e il ragionamento è sbagliato. La terza riga è il caso in cui non piove ma la strada è bagnata lo stesso, per esempio perché qualcuno l'ha lavata.
```

```ad-warning
Dedurre la premessa dalla conseguenza
Sapere che $p \to q$ è vera e che $q$ è vera non dice niente su $p$: è l'errore dell'esempio 4, e usa di nascosto l'inversa $q \to p$. Da $p \to q$ e da $\neg q$ invece si deduce $\neg p$, grazie alla contronominale.
```

## Condizione necessaria e condizione sufficiente

Quando $p \Rightarrow q$:

- $p$ è **condizione sufficiente** per $q$: sapere che $p$ è vera garantisce che anche $q$ lo sia;
- $q$ è **condizione necessaria** per $p$: se $q$ è falsa, anche $p$ è falsa (è la contronominale), quindi senza $q$ non si può avere $p$.

Essere divisibile per $4$ è una condizione sufficiente perché un numero sia pari, ma non necessaria: $6$ è pari senza essere divisibile per $4$. Viceversa, essere pari è una condizione necessaria per essere divisibile per $4$, ma non sufficiente, e il controesempio è ancora il $6$. Lo stesso succede in geometria: un quadrato è un rettangolo, quindi essere un rettangolo è necessario per essere un quadrato, ma non sufficiente (lo trovi nella lezione [Parallelogrammi e trapezi](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/parallelogrammi-e-trapezi)).

Quando $p \Leftrightarrow q$, ognuna delle due è **condizione necessaria e sufficiente** per l'altra. L'ultima cifra uguale a $0$ è condizione necessaria e sufficiente perché un numero naturale sia divisibile per $10$; avere le diagonali congruenti è condizione necessaria e sufficiente perché un parallelogramma sia un rettangolo.

Le stesse cose si dicono con parole diverse, e conviene saperle riconoscere tutte:

| Frase | In simboli |
|---|---|
| se $p$, allora $q$ | $p \Rightarrow q$ |
| $q$ se $p$ | $p \Rightarrow q$ |
| $p$ solo se $q$ | $p \Rightarrow q$ |
| $p$ è sufficiente per $q$ | $p \Rightarrow q$ |
| $q$ è necessaria per $p$ | $p \Rightarrow q$ |
| $p$ se e solo se $q$ | $p \Leftrightarrow q$ |
| $p$ è necessaria e sufficiente per $q$ | $p \Leftrightarrow q$ |

```ad-warning
Leggere "solo se" come "se"
"Supero l'esame solo se studio" dice che studiare è necessario: "supero" $\Rightarrow$ "studio". Non promette che studiando si supera l'esame; quella sarebbe "supero l'esame se studio", cioè "studio" $\Rightarrow$ "supero".
```

Per decidere se una condizione $A$ è sufficiente per $B$ controlli se $A \Rightarrow B$; per decidere se è necessaria controlli se $B \Rightarrow A$. Ogni volta che la risposta è no, la prova è un controesempio.

```ad-example
Esempio 5: necessaria, sufficiente, tutte e due o nessuna
Per ogni coppia, stabilisci se la prima condizione è necessaria, sufficiente, necessaria e sufficiente o né necessaria né sufficiente per la seconda.
1. "$n$ è multiplo di $6$" per "$n$ è multiplo di $3$", con $n$ naturale.
2. "$x = 3$" per "$x^2 = 9$", con $x$ intero.
3. "$ABCD$ è un rettangolo" per "$ABCD$ è un quadrato".
4. "$n$ è pari" per "$n$ è multiplo di $3$", con $n$ naturale.

1. Ogni multiplo di $6$ si scrive $6k = 3 \cdot 2k$ ed è multiplo di $3$: la condizione è sufficiente. Non è necessaria, perché $3$ è multiplo di $3$ ma non di $6$.
2. Se $x = 3$, allora $x^2 = 9$: la condizione è sufficiente. Non è necessaria, perché anche $(-3)^2 = 9$ (le potenze con base negativa sono nella lezione [Potenze in $\mathbb{Z}$](/materiale/scuola-superiore/matematica/numeri-interi/potenze-in-z)).
3. Ogni quadrato è un rettangolo, quindi "quadrato" $\Rightarrow$ "rettangolo": essere un rettangolo è necessario. Non è sufficiente, perché ci sono rettangoli che non sono quadrati.
4. Né necessaria né sufficiente: $4$ è pari ma non è multiplo di $3$, quindi non è sufficiente; $3$ è multiplo di $3$ ma non è pari, quindi non è necessaria.
```

## Implicazione e inclusione

Un enunciato con una variabile, come $p(x)$: "$x$ è divisibile per $4$", diventa vero o falso solo quando al posto di $x$ metti un valore. Fissato un insieme universo $U$, l'insieme dei valori di $U$ per cui $p(x)$ è vera si chiama insieme di verità di $p$ e si indica con $V_p$:

$$V_p = \{x \in U \mid p(x)\}$$

Gli enunciati con una variabile e i loro insiemi di verità sono spiegati nella lezione [Quantificatori](/materiale/scuola-superiore/matematica/insiemi-e-logica/quantificatori).

Dire che $p(x) \Rightarrow q(x)$ vuol dire che ogni valore di $x$ che rende vera $p(x)$ rende vera anche $q(x)$: ogni elemento di $V_p$ è anche elemento di $V_q$, cioè $V_p$ è un sottoinsieme di $V_q$ (l'inclusione è spiegata in [Sottoinsiemi e uguaglianza](/materiale/scuola-superiore/matematica/insiemi-e-logica/sottoinsiemi-e-uguaglianza)).

$$
\begin{gathered}
p(x) \Rightarrow q(x) \\
\text{se e solo se} \\
V_p \subseteq V_q
\end{gathered}
$$

Nel diagramma di Eulero-Venn l'insieme di verità della condizione sufficiente sta dentro quello della condizione necessaria:

```tikz
% nome: implicazione-inclusione-insiemi-verita
% alt: Implicazione e inclusione: nel diagramma di Eulero-Venn l'insieme di verità V_p, colorato, è tutto dentro l'insieme di verità V_q, che è dentro l'universo U
% svg: implicazione-inclusione-insiemi-verita-d79d02c3.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\fill[blue!20] (-0.4,0) circle (0.8);
\draw (0.3,0) circle (1.75);
\draw (-0.4,0) circle (0.8);
\node at (-0.4,0) {$V_p$};
\node at (1.3,0) {$V_q$};
\end{tikzpicture}
```

Stare nel cerchio piccolo è sufficiente per stare in quello grande; stare nel cerchio grande è necessario per stare in quello piccolo. Un controesempio per l'inversa $q(x) \Rightarrow p(x)$ è un elemento che sta in $V_q$ ma non in $V_p$. Le due condizioni sono equivalenti, $p(x) \Leftrightarrow q(x)$, quando i due insiemi di verità sono uguali, $V_p = V_q$.

```ad-example
Esempio 6: gli insiemi di verità di due condizioni
Nell'universo $U = \{1, 2, 3, \dots, 12\}$ considera $p(x)$: "$x$ è divisibile per $4$" e $q(x)$: "$x$ è pari". Trova $V_p$ e $V_q$ e controlla che $p(x) \Rightarrow q(x)$.

Elencando gli elementi:
$$
\begin{gathered}
V_p = \{4, 8, 12\} \\
V_q = \{2, 4, 6, 8, 10, 12\}
\end{gathered}
$$
Ogni elemento di $V_p$ sta in $V_q$, quindi $V_p \subseteq V_q$ e $p(x) \Rightarrow q(x)$. I numeri $2$, $6$ e $10$ stanno in $V_q$ ma non in $V_p$: sono i controesempi che rendono falsa l'inversa.

```tikz
% nome: insiemi-verita-multipli-4-pari
% alt: Diagramma di Eulero-Venn con U da 1 a 12: 4, 8 e 12 nell'insieme V_p dei multipli di 4, tutto dentro l'insieme V_q dei pari, che contiene anche 2, 6 e 10; 1, 3, 5, 7, 9 e 11 fuori da entrambi
% svg: insiemi-verita-multipli-4-pari-6151c3c5.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\fill[blue!20] (-0.5,0) circle (0.8);
\draw (0.3,0) circle (1.75);
\draw (-0.5,0) circle (0.8);
\node at (-0.5,1.05) {$V_p$};
\node at (1.9,1.55) {$V_q$};
\node at (-0.8,0.3) {$4$};
\node at (-0.2,0.3) {$8$};
\node at (-0.5,-0.35) {$12$};
\node at (0.95,0.95) {$2$};
\node at (1.45,0) {$6$};
\node at (0.95,-0.95) {$10$};
\node at (-2.4,1.3) {$1$};
\node at (-2.4,0) {$3$};
\node at (-2.4,-1.3) {$5$};
\node at (2.55,0.6) {$7$};
\node at (2.55,-0.4) {$9$};
\node at (2.55,-1.4) {$11$};
\end{tikzpicture}
```
```

## Negazione di un'implicazione

L'implicazione $p \to q$ è falsa in un caso solo, quando $p$ è vera e $q$ è falsa. La sua negazione quindi è vera esattamente in quel caso, cioè quando è vera $p \wedge \neg q$:

| $p$ | $q$ | $p \to q$ | $\neg(p \to q)$ | $p \wedge \neg q$ |
|---|---|---|---|---|
| V | V | V | F | F |
| V | F | F | V | V |
| F | V | V | F | F |
| F | F | V | F | F |

$$\neg(p \to q) \Leftrightarrow p \wedge \neg q$$

La negazione di "se piove, prendo l'ombrello" è "piove e non prendo l'ombrello": la negazione di un'implicazione non è un'altra implicazione, ma una congiunzione.

```ad-warning
Negare un'implicazione con un'altra implicazione
"Se piove, non prendo l'ombrello" non è la negazione di "se piove, prendo l'ombrello". Nei giorni in cui non piove sono vere tutte e due, perché hanno la premessa falsa, mentre una proposizione e la sua negazione hanno sempre valori di verità opposti.
```

```ad-example
Esempio 7: negare un'implicazione
Scrivi la negazione di queste implicazioni.
1. "Se Marco ha la patente, allora è maggiorenne."
2. "Se piove, resto a casa o prendo l'ombrello."
3. "Se un numero naturale è primo, allora è dispari."

1. Premessa vera e conseguenza falsa: "Marco ha la patente e non è maggiorenne".
2. La conseguenza è una disgiunzione, e per la legge di De Morgan la negazione di "resto a casa o prendo l'ombrello" è "non resto a casa e non prendo l'ombrello". La negazione è "piove, non resto a casa e non prendo l'ombrello".
3. L'enunciato parla di un numero qualsiasi, quindi la negazione dice che c'è almeno un numero per cui la premessa è vera e la conseguenza è falsa: "esiste un numero naturale primo che non è dispari". La negazione è vera, perché $2$ è primo e pari, e quindi l'enunciato di partenza è falso. La negazione degli enunciati con "per ogni" ed "esiste" è nella lezione [Quantificatori](/materiale/scuola-superiore/matematica/insiemi-e-logica/quantificatori).
```

## Dimostrazioni per contronominale e per assurdo

Un teorema ha di solito la forma $p \Rightarrow q$: $p$ si chiama **ipotesi** e $q$ **tesi**, e dimostrare il teorema vuol dire mostrare che ogni volta che l'ipotesi è vera anche la tesi è vera. Oltre alla dimostrazione diretta, che parte dall'ipotesi e arriva alla tesi, ci sono due strade indirette che vengono da questa lezione.

Nella **dimostrazione per contronominale** si dimostra $\neg q \Rightarrow \neg p$: se la tesi è falsa, allora l'ipotesi è falsa. Poiché la contronominale è equivalente all'implicazione, dimostrare l'una è come dimostrare l'altra.

Nella **dimostrazione per assurdo** si suppone che l'ipotesi sia vera e la tesi falsa, cioè che sia vera la negazione $p \wedge \neg q$, e si arriva a una contraddizione. Allora $p \wedge \neg q$ è falsa, e quindi $p \to q$ è vera.

```ad-example
Esempio 8: una dimostrazione per contronominale
Dimostra che, se il prodotto di due numeri naturali $a$ e $b$ è dispari, allora $a$ e $b$ sono tutti e due dispari.

La tesi è "$a$ è dispari e $b$ è dispari"; la sua negazione, per la legge di De Morgan, è "$a$ è pari o $b$ è pari". La contronominale è quindi: "se $a$ è pari o $b$ è pari, allora $ab$ è pari".

Se $a$ è pari, si scrive $a = 2k$ con $k$ naturale, e $ab = 2kb = 2 \cdot (kb)$ è pari. Se è pari $b$ il ragionamento è lo stesso. La contronominale è vera, e con lei il teorema.
```

```ad-example
Esempio 9: una dimostrazione per assurdo
Dati due numeri $a$ e $b$, dimostra che, se $a + b > 10$, allora $a > 5$ oppure $b > 5$.

Supponiamo per assurdo che l'ipotesi sia vera e la tesi falsa: $a + b > 10$ e, negando la tesi con De Morgan, $a \le 5$ e $b \le 5$. Sommando le ultime due disuguaglianze si ottiene $a + b \le 10$, che contraddice l'ipotesi $a + b > 10$. La supposizione è falsa, quindi il teorema è vero.
```
