# Proposizioni e connettivi logici

In matematica le frasi si costruiscono con poche parole che tornano sempre: "non", "e", "o". Se sai che "12 è pari" è vero e che "12 è multiplo di 5" è falso, puoi dire subito se è vera la frase "12 è pari e multiplo di 5", senza sapere altro. La logica studia proprio questo: come il valore di verità di una frase composta dipende da quello delle frasi che la formano. Qui trovi le proposizioni, i connettivi "non", "e", "o", le tavole di verità e le leggi di De Morgan.

## Proposizioni

Una **proposizione** è una frase di cui si può dire in modo oggettivo se è vera o falsa. Il suo **valore di verità** è V se la proposizione è vera, F se è falsa.

"Roma è la capitale d'Italia" è una proposizione vera, "Il numero 7 è pari" è una proposizione falsa: anche una frase falsa è una proposizione, perché di lei si sa dire che è falsa. Conta che la frase sia vera o falsa, non che tu lo sappia già: "Il Monte Bianco è più alto di 4000 metri" è una proposizione anche se non ricordi l'altezza del Monte Bianco (è vera).

Non sono proposizioni:
- le domande ("Che ore sono?") e gli ordini ("Apri il quaderno"), che non sono né veri né falsi;
- le opinioni ("Il calcio è lo sport più bello"), perché il valore di verità dipende da chi parla;
- le frasi con una variabile, come "$x + 3 = 5$": è vera se $x = 2$ e falsa per ogni altro numero, quindi finché non sai quanto vale $x$ non ha un valore di verità. Frasi di questo tipo si chiamano enunciati aperti, e diventano proposizioni come spiega la lezione [Quantificatori](/materiale/scuola-superiore/matematica/insiemi-e-logica/quantificatori).

Per scrivere in fretta, le proposizioni si indicano con le lettere minuscole $p$, $q$, $r$. Si scrive per esempio

$$p: \text{ il numero 7 è pari}$$

e poi si usa $p$ al posto della frase intera.

```ad-example
Esempio 1: riconoscere le proposizioni
Quali di queste frasi sono proposizioni? Per quelle che lo sono, qual è il valore di verità?

- "Roma è la capitale d'Italia": proposizione, V.
- "$2^{10} > 1000$": proposizione, V, perché $2^{10} = 1024$.
- "Il numero 7 è pari": proposizione, F.
- "Che ore sono?": non è una proposizione, è una domanda.
- "Apri il quaderno": non è una proposizione, è un ordine.
- "Il calcio è lo sport più bello": non è una proposizione, è un'opinione.
- "$x + 3 = 5$": non è una proposizione, perché il valore di verità dipende da $x$.
```

```ad-warning
Pensare che una frase falsa non sia una proposizione
"Il numero 7 è pari" è falsa, ma è una proposizione: ha un valore di verità, F. Non sono proposizioni le frasi di cui non si può dire né vero né falso.
```

## Proposizioni atomiche e composte

Una proposizione come "12 è pari" si dice **atomica**: non si può dividere in proposizioni più piccole. Con le parole "non", "e", "o" si costruiscono proposizioni **composte**, come "12 è pari e 12 è multiplo di 5", formata da due proposizioni atomiche. Le parole che uniscono o modificano le proposizioni si chiamano **connettivi logici**.

Il valore di verità di una proposizione composta dipende solo dai valori di verità delle proposizioni che la formano, non dal loro significato. Per ogni connettivo, quindi, è sufficiente sapere come si comporta in tutti i casi possibili: lo dice la sua **tavola di verità**, una tabella con una riga per ogni combinazione di valori delle proposizioni atomiche.

## Negazione

La **negazione** di una proposizione $p$ è la proposizione "non $p$", che è vera quando $p$ è falsa e falsa quando $p$ è vera. Si scrive $\neg p$ (in alcuni libri $\overline{p}$) e si legge "non $p$". Si ottiene mettendo "non" davanti al verbo oppure "non è vero che" davanti alla frase.

| $p$ | $\neg p$ |
|---|---|
| V | F |
| F | V |

Se $p$ è "Il numero 7 è pari", che è falsa, $\neg p$ è "Il numero 7 non è pari", che è vera. Negando due volte si torna alla proposizione di partenza: $\neg(\neg p)$ ha sempre lo stesso valore di verità di $p$.

```ad-warning
Negare "maggiore" con "minore"
La negazione di "$5 > 3$" è "$5$ non è maggiore di $3$", cioè "$5 \leq 3$", e non "$5 < 3$". Tra "maggiore" e "minore" resta il caso "uguale", e la negazione lo deve comprendere: una proposizione e la sua negazione devono coprire insieme tutti i casi.
```

## Congiunzione

La **congiunzione** di due proposizioni $p$ e $q$ è la proposizione "$p$ e $q$", che è vera solo quando $p$ e $q$ sono vere tutte e due. Si scrive $p \wedge q$ e si legge "$p$ e $q$" (in latino et).

| $p$ | $q$ | $p \wedge q$ |
|---|---|---|
| V | V | V |
| V | F | F |
| F | V | F |
| F | F | F |

Le righe sono sempre in quest'ordine: VV, VF, FV, FF. La proposizione "12 è pari e 12 è multiplo di 5" è falsa, perché la prima parte è vera e la seconda è falsa (seconda riga). Nel linguaggio comune la congiunzione si fa anche con "ma" o con la virgola: "Piove, ma fa caldo" è vera solo se piove e fa caldo.

La congiunzione si comporta come un circuito con due interruttori in serie: la lampadina si accende solo se sono chiusi tutti e due. Ogni interruttore è una proposizione, chiuso vuol dire vero e aperto vuol dire falso.

```tikz
% nome: circuito-interruttori-serie-congiunzione
% alt: Circuito con una pila, una lampadina e due interruttori p e q in serie: la corrente passa solo se sono chiusi tutti e due, come nella congiunzione
% svg: circuito-interruttori-serie-congiunzione-eabdb29c.svg 193x110
\begin{tikzpicture}
\draw (0,0) -- (0,0.85);
\draw (0,1.15) -- (0,2) -- (0.8,2);
\draw (-0.3,1.15) -- (0.3,1.15);
\draw (-0.15,0.85) -- (0.15,0.85);
\fill (0.8,2) circle (1.5pt);
\draw (0.8,2) -- (1.5,2.35);
\fill (1.6,2) circle (1.5pt);
\node at (1.2,2.6) {$p$};
\draw (1.6,2) -- (2.6,2);
\fill (2.6,2) circle (1.5pt);
\draw (2.6,2) -- (3.3,2.35);
\fill (3.4,2) circle (1.5pt);
\node at (3,2.6) {$q$};
\draw (3.4,2) -- (4.4,2) -- (4.4,1.3);
\draw (4.4,1) circle (0.3);
\draw (4.19,0.79) -- (4.61,1.21);
\draw (4.19,1.21) -- (4.61,0.79);
\draw (4.4,0.7) -- (4.4,0) -- (0,0);
\end{tikzpicture}
```

## Disgiunzione inclusiva

La **disgiunzione inclusiva** di $p$ e $q$ è la proposizione "$p$ o $q$", che è vera quando almeno una delle due è vera, e quindi falsa solo quando sono false tutte e due. Si scrive $p \vee q$ e si legge "$p$ o $q$" oppure "$p$ vel $q$", dal latino vel.

| $p$ | $q$ | $p \vee q$ |
|---|---|---|
| V | V | V |
| V | F | V |
| F | V | V |
| F | F | F |

La proposizione "12 è pari o 12 è multiplo di 5" è vera, perché la prima parte è vera. È vera anche "10 è pari o 10 è multiplo di 5", in cui sono vere tutte e due le parti: nella prima riga della tavola $p \vee q$ vale V.

La disgiunzione inclusiva si comporta come un circuito con due interruttori in parallelo: la lampadina si accende se è chiuso almeno uno dei due.

```tikz
% nome: circuito-interruttori-parallelo-disgiunzione
% alt: Circuito con una pila, una lampadina e due interruttori p e q in parallelo: la corrente passa se è chiuso almeno uno dei due, come nella disgiunzione inclusiva
% svg: circuito-interruttori-parallelo-disgiunzione-c3869176.svg 193x137
\begin{tikzpicture}
\draw (0,0) -- (0,0.85);
\draw (0,1.15) -- (0,2) -- (1,2);
\draw (-0.3,1.15) -- (0.3,1.15);
\draw (-0.15,0.85) -- (0.15,0.85);
\fill (1,2) circle (1.5pt);
\draw (1,2) -- (1,2.7) -- (1.8,2.7);
\fill (1.8,2.7) circle (1.5pt);
\draw (1.8,2.7) -- (2.5,3.05);
\fill (2.6,2.7) circle (1.5pt);
\node at (2.2,3.3) {$p$};
\draw (2.6,2.7) -- (3.4,2.7) -- (3.4,2);
\draw (1,2) -- (1,1.4) -- (1.8,1.4);
\fill (1.8,1.4) circle (1.5pt);
\draw (1.8,1.4) -- (2.5,1.75);
\fill (2.6,1.4) circle (1.5pt);
\node at (2.2,2) {$q$};
\draw (2.6,1.4) -- (3.4,1.4) -- (3.4,2);
\fill (3.4,2) circle (1.5pt);
\draw (3.4,2) -- (4.4,2) -- (4.4,1.3);
\draw (4.4,1) circle (0.3);
\draw (4.19,0.79) -- (4.61,1.21);
\draw (4.19,1.21) -- (4.61,0.79);
\draw (4.4,0.7) -- (4.4,0) -- (0,0);
\end{tikzpicture}
```

## Disgiunzione esclusiva

Nel linguaggio comune "o" ha spesso un altro senso: "Stasera vado al cinema o a teatro" di solito vuol dire una sola delle due cose. La **disgiunzione esclusiva** di $p$ e $q$ è vera quando una sola delle due proposizioni è vera, e falsa quando sono vere tutte e due o false tutte e due. Si scrive $p \,\dot\vee\, q$ e si legge "o $p$ o $q$" oppure "$p$ aut $q$", dal latino aut.

| $p$ | $q$ | $p \,\dot\vee\, q$ |
|---|---|---|
| V | V | F |
| V | F | V |
| F | V | V |
| F | F | F |

L'unica differenza con la disgiunzione inclusiva è la prima riga: se $p$ e $q$ sono vere tutte e due, $p \vee q$ è vera e $p \,\dot\vee\, q$ è falsa. Per esempio "o 10 è pari o 10 è multiplo di 5" è falsa, perché le due parti sono tutte e due vere.

```ad-warning
Leggere "o" come esclusivo
In matematica "o" è sempre inclusivo, a meno che il testo non dica "o... o..." o non precisi "ma non entrambi". "$x$ è pari o multiplo di 3" comprende anche i numeri pari e multipli di 3, come il 6. È lo stesso "o" dell'[unione](/materiale/scuola-superiore/matematica/insiemi-e-logica/unione-insiemistica).
```

## Tavola di verità di una proposizione composta

Con i connettivi si possono costruire proposizioni più lunghe, come $(p \vee q) \wedge \neg p$. Il suo valore di verità si trova per ogni combinazione di valori di $p$ e $q$ con la tavola di verità, che si costruisce così:

1. Conta le lettere diverse: con 2 lettere le righe sono 4, con 3 lettere sono 8 (ogni lettera in più raddoppia le righe).
2. Scrivi le colonne delle lettere con le combinazioni nell'ordine VV, VF, FV, FF (con tre lettere VVV, VVF, VFV, VFF, FVV, FVF, FFV, FFF).
3. Aggiungi una colonna per ogni pezzo della proposizione, dal più interno al più esterno.
4. Riempi ogni colonna riga per riga con la tavola del connettivo.
5. L'ultima colonna dà il valore della proposizione intera.

L'ordine in cui si applicano i connettivi segue una regola di precedenza: la negazione si applica per prima, e solo alla lettera o alla parentesi che la segue. Così $\neg p \wedge q$ vuol dire $(\neg p) \wedge q$, mentre per negare tutta la congiunzione si scrive $\neg(p \wedge q)$. Tra $\wedge$ e $\vee$ i libri non sono tutti d'accordo, quindi quando nella stessa proposizione ce ne sono più di uno si mettono le parentesi, e si calcola partendo da quelle più interne.

```ad-warning
Confondere $\neg p \wedge q$ e $\neg(p \wedge q)$
Nella prima la negazione tocca solo $p$, nella seconda tutta la congiunzione. Con $p$ vera e $q$ falsa, $\neg p \wedge q$ è $\text{F} \wedge \text{F}$, cioè F, mentre $\neg(p \wedge q)$ è la negazione di F, cioè V.
```

```ad-example
Esempio 2: una tavola con due lettere
Costruisci la tavola di verità di $(p \vee q) \wedge \neg p$.

Le lettere sono due, quindi le righe sono 4. I pezzi da calcolare sono $p \vee q$ e $\neg p$, e poi la loro congiunzione:

| $p$ | $q$ | $p \vee q$ | $\neg p$ | risultato |
|---|---|---|---|---|
| V | V | V | F | F |
| V | F | V | F | F |
| F | V | V | V | V |
| F | F | F | V | F |

L'ultima colonna è la congiunzione della terza e della quarta: è V solo nella terza riga, dove sono vere tutte e due. La proposizione è vera solo quando $p$ è falsa e $q$ è vera.
```

```ad-example
Esempio 3: una tavola con tre lettere
Costruisci la tavola di verità di $(p \wedge q) \vee \neg r$.

Le lettere sono tre, quindi le righe sono 8. Nella colonna di $p$ ci sono quattro V e poi quattro F, in quella di $q$ due V e due F alternati, in quella di $r$ un V e un F alternati:

| $p$ | $q$ | $r$ | $p \wedge q$ | $\neg r$ | risultato |
|---|---|---|---|---|---|
| V | V | V | V | F | V |
| V | V | F | V | V | V |
| V | F | V | F | F | F |
| V | F | F | F | V | V |
| F | V | V | F | F | F |
| F | V | F | F | V | V |
| F | F | V | F | F | F |
| F | F | F | F | V | V |

L'ultima colonna è la disgiunzione di $p \wedge q$ e $\neg r$: è F solo nelle righe in cui tutte e due valgono F. La proposizione è falsa in tre casi, quando $r$ è vera e $p$ e $q$ non sono vere tutte e due.
```

```ad-warning
Dimenticare delle righe
Con tre lettere le combinazioni sono 8: se ne scrivi a caso, è facile saltarne una o scriverne due uguali. Segui sempre lo schema delle colonne (quattro e quattro, due e due, uno e uno) e conta le righe alla fine.
```

## Tautologie e contraddizioni

Una proposizione composta che è vera in tutte le righe della sua tavola, qualunque sia il valore delle lettere, si chiama **tautologia**. Una che è falsa in tutte le righe si chiama **contraddizione**.

L'esempio più semplice di tautologia è $p \vee \neg p$: una proposizione o è vera o è falsa, e quindi è vera lei o la sua negazione (principio del terzo escluso). L'esempio più semplice di contraddizione è $p \wedge \neg p$: una proposizione e la sua negazione non possono essere vere insieme (principio di non contraddizione).

| $p$ | $\neg p$ | $p \vee \neg p$ | $p \wedge \neg p$ |
|---|---|---|---|
| V | F | V | F |
| F | V | V | F |

La maggior parte delle proposizioni composte non è né una tautologia né una contraddizione: quella dell'esempio 2 è vera in una riga e falsa nelle altre tre.

```ad-example
Esempio 4: una tautologia e una contraddizione
Stabilisci se $\neg(p \wedge q) \vee p$ e $(p \vee q) \wedge (\neg p \wedge \neg q)$ sono tautologie, contraddizioni o nessuna delle due.

Per la prima, $\neg(p \wedge q)$ è falsa solo nella riga VV, e lì $p$ è vera:

| $p$ | $q$ | $p \wedge q$ | $\neg(p \wedge q)$ | risultato |
|---|---|---|---|---|
| V | V | V | F | V |
| V | F | F | V | V |
| F | V | F | V | V |
| F | F | F | V | V |

L'ultima colonna è tutta V: è una tautologia.

Per la seconda, $\neg p \wedge \neg q$ è vera solo quando $p$ e $q$ sono false tutte e due, e proprio in quella riga $p \vee q$ è falsa:

| $p$ | $q$ | $p \vee q$ | $\neg p \wedge \neg q$ | risultato |
|---|---|---|---|---|
| V | V | V | F | F |
| V | F | V | F | F |
| F | V | V | F | F |
| F | F | F | V | F |

L'ultima colonna è tutta F: è una contraddizione.
```

## Proposizioni equivalenti

Due proposizioni composte con le stesse lettere si dicono **equivalenti** se hanno lo stesso valore di verità in ogni riga della tavola. Si scrive con il simbolo $\Leftrightarrow$, che si legge "è equivalente a" (il suo legame con il "se e solo se" è nella lezione [Implicazione, condizioni necessarie e sufficienti](/materiale/scuola-superiore/matematica/insiemi-e-logica/implicazione-condizioni-necessarie-e-sufficienti)).

Sono equivalenti per esempio $\neg(\neg p)$ e $p$, e anche $p \wedge q$ e $q \wedge p$, perché l'ordine delle due proposizioni non cambia il valore della congiunzione (lo stesso vale per la disgiunzione). La proposizione dell'esempio 2 è vera solo quando $p$ è falsa e $q$ è vera, esattamente come $\neg p \wedge q$:

$$(p \vee q) \wedge \neg p \Leftrightarrow \neg p \wedge q$$

Per dimostrare che due proposizioni sono equivalenti si scrivono le due colonne nella stessa tavola e si controlla che coincidano riga per riga. Per dimostrare che non lo sono è sufficiente una riga in cui hanno valori diversi.

## Leggi di De Morgan

Le leggi di De Morgan dicono come si nega una congiunzione e come si nega una disgiunzione:

$$
\begin{gathered}
\neg(p \wedge q) \Leftrightarrow \neg p \vee \neg q \\
\neg(p \vee q) \Leftrightarrow \neg p \wedge \neg q
\end{gathered}
$$

Negando, "e" diventa "o" e "o" diventa "e", e ogni proposizione viene negata. La prima legge si controlla con la tavola:

| $p$ | $q$ | $p \wedge q$ | $\neg(p \wedge q)$ | $\neg p \vee \neg q$ |
|---|---|---|---|---|
| V | V | V | F | F |
| V | F | F | V | V |
| F | V | F | V | V |
| F | F | F | V | V |

Le ultime due colonne coincidono. A parole: "$p$ e $q$" è falsa quando almeno una delle due è falsa, cioè quando è vera "non $p$ o non $q$".

Nel linguaggio comune la legge serve a negare frasi con "e" e con "o". La negazione di "Piove e fa freddo", cioè "Non è vero che piove e fa freddo", è "Non piove o non fa freddo": è sufficiente che manchi una delle due cose. La negazione di "Il sabato studio o gioco" è "Il sabato non studio e non gioco", che si dice anche "Il sabato non studio né gioco".

```ad-example
Esempio 5: verificare la seconda legge
Verifica con la tavola di verità che $\neg(p \vee q) \Leftrightarrow \neg p \wedge \neg q$.

| $p$ | $q$ | $p \vee q$ | $\neg(p \vee q)$ | $\neg p \wedge \neg q$ |
|---|---|---|---|---|
| V | V | V | F | F |
| V | F | V | F | F |
| F | V | V | F | F |
| F | F | F | V | V |

Per l'ultima colonna, $\neg p \wedge \neg q$ è vera solo quando $\neg p$ e $\neg q$ sono vere, cioè quando $p$ e $q$ sono false: è la quarta riga. Le ultime due colonne coincidono, quindi le due proposizioni sono equivalenti.
```

```ad-warning
Negare "e" lasciando "e"
La negazione di "Piove e fa freddo" non è "Non piove e non fa freddo": questa frase dice di più, perché esclude anche il caso in cui piove ma fa caldo. Quando si nega, "e" diventa "o".
```

```ad-example
Esempio 6: negare frasi con i numeri
Scrivi la negazione di queste proposizioni e trova il valore di verità di ciascuna proposizione e della sua negazione.

a) "15 è multiplo di 3 e di 5". È una forma breve di "15 è multiplo di 3 e 15 è multiplo di 5", una congiunzione. La sua negazione, per la prima legge di De Morgan, è
"15 non è multiplo di 3 o 15 non è multiplo di 5".
La proposizione è vera (V e V), quindi la negazione è falsa: infatti è una disgiunzione di due proposizioni false.

b) "8 è maggiore di 5 o minore di 2". È la disgiunzione di "$8 > 5$" e "$8 < 2$". Per la seconda legge di De Morgan la negazione è
"8 non è maggiore di 5 e 8 non è minore di 2",
cioè "$8 \leq 5$ e $8 \geq 2$". La proposizione è vera, perché $8 > 5$ è vera; la negazione è falsa, perché $8 \leq 5$ è falsa.
```

## Connettivi e operazioni tra insiemi

I connettivi corrispondono alle operazioni tra insiemi. Un elemento $x$ sta nell'[intersezione](/materiale/scuola-superiore/matematica/insiemi-e-logica/intersezione-insiemistica) $A \cap B$ se $x \in A$ e $x \in B$, sta nell'[unione](/materiale/scuola-superiore/matematica/insiemi-e-logica/unione-insiemistica) $A \cup B$ se $x \in A$ o $x \in B$ (con "o" inclusivo) e sta nel [complementare](/materiale/scuola-superiore/matematica/insiemi-e-logica/differenza-e-complementare) $\overline{A}$ se non è vero che $x \in A$.

| Connettivo | Operazione |
|---|---|
| $\wedge$ (e) | $A \cap B$, intersezione |
| $\vee$ (o) | $A \cup B$, unione |
| $\neg$ (non) | $\overline{A}$, complementare |

Per questo le leggi di De Morgan valgono anche per gli insiemi, con la stessa forma: $\overline{A \cup B} = \overline{A} \cap \overline{B}$ e $\overline{A \cap B} = \overline{A} \cup \overline{B}$ (le trovi nella lezione [Differenza e complementare](/materiale/scuola-superiore/matematica/insiemi-e-logica/differenza-e-complementare)). Per esempio, tra i numeri da 1 a 10, quelli che non sono né pari né multipli di 3 sono $1$, $5$ e $7$: stanno nel complementare dell'unione, e anche nell'intersezione dei due complementari.

Resta da vedere il connettivo "se... allora", con cui si scrivono le regole e i teoremi: è l'argomento della lezione [Implicazione, condizioni necessarie e sufficienti](/materiale/scuola-superiore/matematica/insiemi-e-logica/implicazione-condizioni-necessarie-e-sufficienti).
