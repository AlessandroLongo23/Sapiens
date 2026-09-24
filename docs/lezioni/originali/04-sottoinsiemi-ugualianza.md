# Sottoinsiemi e uguaglianza

## Perché abbiamo bisogno di confrontare gli insiemi

Se ti dico che ogni numero pari è un numero intero, ma non ogni intero è pari, come descriviamo questa relazione in modo preciso?

Nella vita quotidiana confrontiamo continuamente collezioni di oggetti. Gli studenti della classe 3A sono tutti iscritti alla scuola, ma non tutti gli iscritti alla scuola appartengono alla classe 3A. I numeri pari sono tutti numeri interi, ma non tutti gli interi sono pari. I mammiferi sono tutti animali, ma non tutti gli animali sono mammiferi. In ciascuno di questi casi, stiamo osservando che **una collezione è interamente contenuta in un'altra**, senza che le due coincidano necessariamente.

La domanda che vogliamo rispondere in modo rigoroso è questa: *se ogni elemento di un insieme $A$ è anche un elemento di un insieme $B$, cosa possiamo dire della relazione tra $A$ e $B$?*

Senza una notazione precisa, rispondere a questa domanda diventa ambiguo e scivoloso. Potremmo dire "A è più piccolo di B", ma questa espressione evoca confronti numerici, non strutturali. Potremmo dire "A è dentro B", ma anche questa formulazione è vaga. Abbiamo bisogno di un linguaggio matematico che catturi esattamente l'idea di **contenimento** tra insiemi — ed è proprio ciò che i concetti di *sottoinsieme* e *uguaglianza insiemistica* ci offrono.

---

## La relazione di inclusione: il concetto di sottoinsieme

Partiamo dall'intuizione. Consideriamo l'insieme dei numeri pari positivi $P = \{2, 4, 6, 8, \ldots\}$ e l'insieme dei numeri naturali $\mathbb{N} = \{1, 2, 3, 4, 5, 6, \ldots\}$. Ogni elemento di $P$ — cioè $2$, $4$, $6$, e così via — è certamente un elemento di $\mathbb{N}$. Non esiste alcun numero pari positivo che non sia anche un naturale. In questo senso, $P$ è **contenuto** in $\mathbb{N}$.

Possiamo visualizzare questa situazione con un diagramma di Venn: l'insieme $P$ appare come una regione colorata interamente all'interno della regione che rappresenta $\mathbb{N}$, senza mai uscire dai suoi confini.

*\* immagine: diagramma di Venn con due ellissi concentriche; quella interna, colorata in blu, rappresenta $A$ con alcuni elementi esplicitati (es. 2, 4, 6); quella esterna, in grigio chiaro, rappresenta $B$ con elementi aggiuntivi (es. 1, 3, 5, 7); una freccia evidenzia che ogni punto di $A$ cade dentro $B$ \**

Notiamo che il contenimento si traduce in un'affermazione logica molto precisa: **per ogni elemento $x$, se $x$ appartiene a $P$, allora $x$ appartiene a $\mathbb{N}$**. Questa formulazione — "per ogni $x$, se … allora …" — è il cuore della definizione formale che costruiremo tra poco.

Vediamo un altro esempio, forse meno ovvio. Consideriamo:

$$A = \{1, 3\}, \qquad B = \{1, 2, 3, 4, 5\}$$

Verifichiamo: $1 \in A$ e $1 \in B$ ✓; $3 \in A$ e $3 \in B$ ✓. Ogni elemento di $A$ è anche in $B$, quindi $A$ è contenuto in $B$. Ora consideriamo invece:

$$C = \{1, 6\}, \qquad B = \{1, 2, 3, 4, 5\}$$

Qui $6 \in C$ ma $6 \notin B$: basta un solo elemento di $C$ che non appartiene a $B$ per escludere il contenimento. $C$ **non** è contenuto in $B$.

Questo ci insegna qualcosa di importante: per verificare che un insieme *sia* contenuto in un altro, dobbiamo controllare **tutti** i suoi elementi; per verificare che *non* lo sia, è sufficiente trovarne **uno solo** che non appartiene all'altro.

---

## Definizione formale di sottoinsieme

Siamo pronti a formalizzare.

> [!definition] Definizione — Sottoinsieme
> Dati due insiemi $A$ e $B$, diciamo che $A$ è un **sottoinsieme** di $B$, e scriviamo $A \subseteq B$, se e solo se ogni elemento di $A$ è anche elemento di $B$. In simboli:
> $$A \subseteq B \iff \forall x \,(x \in A \;\Rightarrow\; x \in B)$$
> Quando $A \subseteq B$ ma $A \neq B$, diciamo che $A$ è un **sottoinsieme proprio** di $B$, e scriviamo $A \subset B$.

Osserviamo subito due casi particolari che possono sembrare sorprendenti, ma che seguono direttamente dalla definizione.

**Ogni insieme è sottoinsieme di sé stesso.** Infatti, per ogni elemento $x$, se $x \in A$ allora certamente $x \in A$: la condizione $A \subseteq A$ è sempre soddisfatta. Scriviamo quindi $A \subseteq A$ per ogni insieme $A$. Questo caso prende il nome di **riflessività** della relazione $\subseteq$.

**L'insieme vuoto è sottoinsieme di ogni insieme.** Questo è il caso che genera più perplessità. Affermiamo che $\emptyset \subseteq A$ per ogni insieme $A$. La definizione richiede che ogni elemento di $\emptyset$ sia anche in $A$: ma $\emptyset$ non ha elementi, quindi non esiste alcun $x$ per cui la condizione possa essere violata. In logica, un'affermazione del tipo "per ogni $x$ in $\emptyset$, vale la proprietà $P(x)$" è **vacuamente vera**, proprio perché non ci sono controesempi possibili. Dunque $\emptyset \subseteq A$ qualunque sia $A$.

Vale la pena notare anche la distinzione tra sottoinsieme ($\subseteq$) e sottoinsieme proprio ($\subset$): scrivere $A \subset B$ significa che $A$ è contenuto in $B$ **e** che esiste almeno un elemento di $B$ non presente in $A$, ovvero le due collezioni non coincidono. Nel nostro esempio iniziale, $P \subset \mathbb{N}$ perché i numeri dispari sono in $\mathbb{N}$ ma non in $P$.

---

## Quando due insiemi sono uguali

Immaginiamo ora due insiemi definiti in modi apparentemente diversi:

$$A = \{x \in \mathbb{Z} : x^2 = 1\}, \qquad B = \{-1, 1\}$$

$A$ contiene tutti gli interi il cui quadrato vale $1$: questi sono esattamente $-1$ e $1$. Dunque $A$ e $B$ contengono **gli stessi elementi**, anche se sono stati descritti in modo diverso. Come formalizziamo l'uguaglianza tra insiemi?

L'intuizione è semplice: due insiemi sono uguali se e solo se hanno esattamente gli stessi elementi. Ma come traduciamo questa intuizione in termini di inclusione? La risposta è elegante: $A = B$ se $A$ è contenuto in $B$ **e contemporaneamente** $B$ è contenuto in $A$. In altre parole, nessuno dei due ha elementi che mancano all'altro.

> [!definition] Definizione — Uguaglianza di insiemi
> Dati due insiemi $A$ e $B$, diciamo che $A$ è **uguale** a $B$, e scriviamo $A = B$, se e solo se $A \subseteq B$ e $B \subseteq A$. In simboli:
> $$A = B \iff (A \subseteq B) \wedge (B \subseteq A)$$

Questa definizione è nota come **principio di estensionalità**: un insieme è completamente determinato dai suoi elementi, indipendentemente da come viene descritto o in quale ordine gli elementi vengono elencati.

Una conseguenza immediata è che **l'ordine e la ripetizione degli elementi non contano**. Possiamo verificare, per esempio, che:

$$\{1, 2, 3\} = \{3, 1, 2\} = \{1, 1, 2, 3\}$$

In tutti e tre i casi, i due insiemi contengono esattamente gli stessi elementi distinti ($1$, $2$, $3$), quindi sono uguali per definizione.

*\* immagine: diagramma di Venn con due ellissi che si sovrappongono perfettamente, colorate con due colori semitrasparenti che si fondono in un unico contorno; didascalia "A = B: ogni elemento di A è in B e ogni elemento di B è in A" \**

La tecnica della **doppia inclusione** — dimostrare $A \subseteq B$ e poi $B \subseteq A$ separatamente — è uno degli strumenti più usati in matematica per provare che due insiemi definiti per proprietà sono uguali. La incontreremo concretamente negli esempi finali.

---

## Proprietà fondamentali e relazioni tra sottoinsiemi

La relazione di inclusione $\subseteq$ non è arbitraria: possiede una struttura logica precisa, descritta da tre proprietà fondamentali.

**Riflessività:** per ogni insieme $A$,
$$A \subseteq A$$
Ogni insieme contiene sé stesso come sottoinsieme, come abbiamo già osservato.

**Transitività:** se $A \subseteq B$ e $B \subseteq C$, allora
$$A \subseteq C$$
Questa proprietà è cruciale. Se ogni elemento di $A$ è in $B$, e ogni elemento di $B$ è in $C$, allora — seguendo la catena — ogni elemento di $A$ è in $C$. È grazie alla transitività che possiamo scrivere catene di inclusioni come $\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$, sapendo che $\mathbb{N} \subset \mathbb{R}$ senza doverlo verificare direttamente.

**Antisimmetria:** se $A \subseteq B$ e $B \subseteq A$, allora
$$A = B$$
Questa è esattamente la nostra definizione di uguaglianza: due insiemi che si contengono a vicenda sono necessariamente lo stesso insieme.

Queste tre proprietà — riflessività, transitività e antisimmetria — caratterizzano ciò che in matematica si chiama un **ordine parziale**. La relazione $\subseteq$ ordina gli insiemi secondo il criterio del contenimento, analogamente a come $\leq$ ordina i numeri reali.

**Un errore comune da evitare:** la confusione tra il simbolo $\in$ (appartenenza) e il simbolo $\subseteq$ (inclusione). Consideriamo l'insieme $B = \{2, 4, 6\}$:

- $2 \in B$: il numero $2$ **appartiene** a $B$ come elemento. ✓
- $\{2\} \subseteq B$: l'insieme $\{2\}$ è **contenuto** in $B$ come sottoinsieme. ✓
- $\{2\} \in B$: **falso!** L'insieme $\{2\}$ non è un elemento di $B$; $B$ contiene numeri, non insiemi di numeri.
- $2 \subseteq B$: **privo di senso** nel contesto standard, perché $2$ è un numero, non un insieme.

La distinzione è sottile ma fondamentale: $\in$ mette in relazione un **elemento** con un insieme; $\subseteq$ mette in relazione due **insiemi**.

---

## Esempi risolti e applicazioni

### Esempio 1 — Verifica di sottoinsieme

Verifichiamo se $A = \{x \in \mathbb{Z} : x^2 < 10\}$ è sottoinsieme di $B = \{-3, -2, -1, 0, 1, 2, 3\}$.

Prima determiniamo esplicitamente gli elementi di $A$. Cerchiamo tutti gli interi $x$ tali che $x^2 < 10$:

$$(-3)^2 = 9 < 10 \;\checkmark, \quad (-2)^2 = 4 < 10 \;\checkmark, \quad (-1)^2 = 1 < 10 \;\checkmark$$
$$0^2 = 0 < 10 \;\checkmark, \quad 1^2 = 1 < 10 \;\checkmark, \quad 2^2 = 4 < 10 \;\checkmark, \quad 3^2 = 9 < 10 \;\checkmark$$
$$(-4)^2 = 16 \not< 10 \;\times, \quad 4^2 = 16 \not< 10 \;\times$$

Quindi $A = \{-3, -2, -1, 0, 1, 2, 3\}$. Confrontando con $B = \{-3, -2, -1, 0, 1, 2, 3\}$, notiamo che $A$ e $B$ contengono esattamente gli stessi elementi. Pertanto $A \subseteq B$ **e** $B \subseteq A$, ovvero $A = B$.

### Esempio 2 — Distinzione tra $\emptyset$ e $\{\emptyset\}$

Dimostriamo che $\{\emptyset\} \neq \emptyset$.

L'insieme vuoto $\emptyset$ non contiene alcun elemento. L'insieme $\{\emptyset\}$, invece, contiene **un** elemento: l'insieme vuoto stesso. Poiché $\{\emptyset\}$ ha un elemento e $\emptyset$ non ne ha nessuno, i due insiemi non possono essere uguali. In particolare, $\emptyset \in \{\emptyset\}$ ma $\emptyset \notin \emptyset$.

Questo esempio illustra una distinzione sottile ma importante: la **scatola vuota** ($\emptyset$) è diversa dalla **scatola che contiene una scatola vuota** ($\{\emptyset\}$).

### Esempio 3 — Doppia inclusione per provare l'uguaglianza

Siano $A = \{x \in \mathbb{Z} : x \text{ è pari e } -4 \leq x \leq 4\}$ e $B = \{-4, -2, 0, 2, 4\}$. Proviamo che $A = B$ usando la doppia inclusione.

**Passo 1 — $A \subseteq B$:** Sia $x \in A$. Allora $x$ è un intero pari con $-4 \leq x \leq 4$. Gli interi pari in quell'intervallo sono esattamente $-4, -2, 0, 2, 4$, che sono tutti elementi di $B$