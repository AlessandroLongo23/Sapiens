# Unione insiemistica

## Perché abbiamo bisogno di unire insiemi: il problema della classificazione

In una classe di 30 studenti, 15 praticano calcio e 12 praticano pallavolo. Se 5 studenti praticano entrambi gli sport, quanti studenti praticano **almeno uno dei due sport**?

La risposta immediata — sommare 15 e 12 — porta a 27, ma qualcosa non torna: quei 5 studenti che praticano entrambi gli sport verrebbero contati due volte. Il numero corretto è $15 + 12 - 5 = 22$. Questo semplice ragionamento nasconde un problema matematico profondo: **come si raccolgono in un unico insieme gli elementi che soddisfano almeno una di due condizioni, senza duplicati?**

### Situazioni quotidiane che richiedono l'unione

Situazioni di questo tipo sono ovunque. Un medico che vuole elencare tutti i pazienti con febbre **o** tosse deve costruire una lista unica, senza ripetere chi ha entrambi i sintomi. Un insegnante che vuole sapere quali numeri interi tra 1 e 20 sono **pari o multipli di 3** deve raccogliere in un unico insieme due categorie distinte. Uno studente che risolve il sistema di disequazioni $x < -1$ **oppure** $x > 3$ deve descrivere l'insieme delle soluzioni come unione di due intervalli separati.

In tutti questi casi, l'operazione che stiamo compiendo intuitivamente è la stessa: **unire** due insiemi in uno solo.

### Il problema del doppio conteggio

Notiamo che il problema nasce precisamente quando i due insiemi si **sovrappongono**, cioè quando condividono elementi. Se nessuno studente praticasse entrambi gli sport, la risposta sarebbe semplicemente $15 + 12 = 27$. Ma non appena esiste un'intersezione, la semplice somma delle cardinalità sovrastima il numero reale di elementi distinti.

Questo ci insegna qualcosa di fondamentale: l'unione di due insiemi non è una somma. È un'operazione che raccoglie **tutti gli elementi distinti** presenti in almeno uno dei due insiemi, indipendentemente da quante volte ciascun elemento compaia nelle due collezioni originali.

### Dalla pratica alla necessità di una definizione rigorosa

L'intuizione ci ha guidato fin qui, ma per lavorare con precisione — e soprattutto per estendere il concetto a insiemi infiniti, intervalli reali, soluzioni di equazioni — abbiamo bisogno di una definizione formale. Prima di arrivarci, costruiamo il concetto visivamente.

---

## Costruzione intuitiva dell'unione: dai diagrammi di Venn alla notazione

### Rappresentazione con diagrammi di Venn

Immaginiamo due insiemi $A$ e $B$ come due cerchi sovrapposti all'interno di un rettangolo che rappresenta l'insieme universo $U$. Il cerchio sinistro contiene tutti gli elementi di $A$, quello destro tutti gli elementi di $B$. La zona centrale, dove i due cerchi si sovrappongono, contiene gli elementi che appartengono **ad entrambi**.

*\* immagine: diagramma di Venn con due cerchi parzialmente sovrapposti; l'intera area colorata (cerchio sinistro + zona centrale + cerchio destro) è evidenziata in blu per rappresentare $A \cup B$; le due aree esclusive di $A$ e $B$ sono in blu chiaro, la zona di intersezione in blu scuro \**

### Identificare la regione "almeno uno dei due"

La domanda "quanti elementi appartengono **almeno a uno** dei due insiemi?" corrisponde esattamente a colorare **tutta** l'area occupata dai due cerchi: la parte esclusiva di $A$, la parte esclusiva di $B$, e la zona di sovrapposizione. Non escludiamo nulla di ciò che è coperto da almeno un cerchio.

Possiamo osservare che la parola chiave è **"almeno uno"**: chi appartiene solo ad $A$ è incluso, chi appartiene solo a $B$ è incluso, e chi appartiene a entrambi è incluso ugualmente. Nessuno viene escluso per il fatto di appartenere a entrambi — al contrario di quanto accade nel linguaggio comune, dove "o l'uno o l'altro" spesso esclude la possibilità di entrambi.

### Introduzione della notazione $A \cup B$

Questa operazione si indica con il simbolo $\cup$, che ricorda visivamente una "coppa" o una "U" — iniziale di *union* in inglese e *unione* in italiano. Scriviamo:

$$A \cup B$$

e leggiamo: **"$A$ unione $B$"**.

Il simbolo $\cup$ è stato introdotto dal matematico italiano Giuseppe Peano alla fine dell'Ottocento, proprio per formalizzare questa operazione fondamentale.

---

## Definizione formale e caratterizzazione dell'unione

### La definizione

> [!definition] Definizione — Unione di due insiemi
> Dati due insiemi $A$ e $B$, l'**unione** $A \cup B$ è l'insieme di tutti gli elementi che appartengono ad $A$ oppure a $B$ (o a entrambi). Formalmente:
> $$A \cup B = \{x \mid x \in A \vee x \in B\}$$
> dove il simbolo $\vee$ rappresenta la **disgiunzione logica inclusiva** ("oppure, nel senso di almeno uno dei due").

### Il simbolo $\vee$ e l'"oppure" matematico

È importante soffermarsi sul simbolo $\vee$. In logica, la disgiunzione $p \vee q$ è **vera** se almeno una delle due proposizioni $p$, $q$ è vera — incluso il caso in cui siano vere entrambe. Questo è diverso dall'uso comune della parola "o" nel linguaggio quotidiano, dove spesso si intende un'alternativa esclusiva ("o l'uno o l'altro, non entrambi").

In matematica, l'"oppure" è sempre **inclusivo**: $x \in A \vee x \in B$ è vero anche quando $x \in A$ e $x \in B$ contemporaneamente. Confondere i due significati è uno degli errori più frequenti quando si inizia a lavorare con gli insiemi.

### Unione di più di due insiemi

L'operazione si estende naturalmente a tre o più insiemi:

$$A \cup B \cup C = \{x \mid x \in A \vee x \in B \vee x \in C\}$$

Per un numero arbitrario di insiemi $A_1, A_2, \ldots, A_n$, si usa la notazione compatta:

$$\bigcup_{i=1}^{n} A_i = \{x \mid x \in A_i \text{ per almeno un } i \in \{1, 2, \ldots, n\}\}$$

### Casi particolari notevoli

Tre casi particolari meritano attenzione:

- **Unione con l'insieme vuoto:** $A \cup \emptyset = A$. Aggiungere nessun elemento non cambia l'insieme.
- **Unione con se stesso:** $A \cup A = A$. Un insieme unito a se stesso è ancora se stesso — non si "duplicano" gli elementi.
- **Unione con l'insieme universo:** $A \cup U = U$. L'unione con l'insieme che contiene tutto restituisce tutto.

---

## Proprietà fondamentali dell'operazione di unione

L'unione gode di proprietà algebriche precise, che la rendono manipolabile con regole chiare.

> [!definition] Proprietà dell'unione
> Siano $A$, $B$, $C$ insiemi qualsiasi e $U$ l'insieme universo. Valgono le seguenti proprietà:
>
> **1. Proprietà commutativa:**
> $$A \cup B = B \cup A$$
>
> **2. Proprietà associativa:**
> $$(A \cup B) \cup C = A \cup (B \cup C)$$
>
> **3. Elemento neutro:**
> $$A \cup \emptyset = A$$
>
> **4. Idempotenza (assorbimento):**
> $$A \cup A = A$$
>
> **5. Relazione con l'inclusione:**
> $$A \subseteq A \cup B \qquad \text{e} \qquad B \subseteq A \cup B$$

La **commutatività** è intuitiva: che si dica "calcio o pallavolo" o "pallavolo o calcio", l'insieme degli studenti coinvolti non cambia. L'**associatività** ci dice che, quando uniamo tre insiemi, l'ordine in cui eseguiamo le operazioni non influisce sul risultato finale. L'**idempotenza** — proprietà insolita rispetto alla somma ordinaria, dove $a + a = 2a \neq a$ — riflette il fatto che in un insieme ogni elemento compare una sola volta.

La relazione con l'inclusione ci dice qualcosa di geometricamente ovvio: l'unione è sempre "più grande" (o uguale) di ciascuno dei due insiemi di partenza.

**Nota sulle Leggi di De Morgan.** Esiste una proprietà profonda che lega l'unione al complementare:

$$(A \cup B)^c = A^c \cap B^c$$

Questa legge, dovuta al logico Augustus De Morgan, afferma che il complementare dell'unione è l'intersezione dei complementari. La tratteremo in dettaglio quando avremo consolidato il concetto di complementare insiemistico.

---

## Esempi risolti: dall'identificazione alla verifica

### Esempio 1 — Insiemi numerici finiti

Siano $A = \{1, 2, 3\}$ e $B = \{3, 4, 5\}$. Calcolare $A \cup B$.

Raccogliamo tutti gli elementi che compaiono in almeno uno dei due insiemi, senza ripetizioni:

$$A \cup B = \{1, 2, 3, 4, 5\}$$

Notiamo che l'elemento $3$, pur appartenendo a entrambi gli insiemi, compare **una sola volta** nell'unione. Verifichiamo anche: $|A| = 3$, $|B| = 3$, $|A \cap B| = 1$ (solo l'elemento 3), quindi $|A \cup B| = 3 + 3 - 1 = 5$. ✓

### Esempio 2 — Insiemi infiniti: intervalli reali

Siano $A = [0, 2)$ e $B = (1, 5]$. Calcolare $A \cup B$.

I due intervalli si sovrappongono nella regione $(1, 2)$. L'unione raccoglie tutti i punti coperti da almeno uno dei due:

$$A \cup B = [0, 5]$$

*\* immagine: retta reale con i due intervalli $[0,2)$ e $(1,5]$ evidenziati in colori diversi, e l'unione $[0,5]$ mostrata come intervallo continuo nella riga sottostante \**

Possiamo osservare che il punto $0$ è incluso (grazie ad $A$), il punto $5$ è incluso (grazie a $B$), e tutti i punti intermedi appartengono ad almeno uno dei due intervalli.

### Esempio 3 — Unione in contesto logico: soluzioni di disequazioni

Trovare l'insieme delle soluzioni della disequazione $|x| > 2$, ovvero $x < -2$ oppure $x > 2$.

Le due condizioni definiscono due insiemi:

$$A = \{x \in \mathbb{R} \mid x < -2\} = (-\infty, -2), \qquad B = \{x \in \mathbb{R} \mid x > 2\} = (2, +\infty)$$

L'insieme soluzione è:

$$A \cup B = (-\infty, -2) \cup (2, +\infty)$$

Notiamo che in questo caso i due insiemi **non si sovrappongono**: $A \cap B = \emptyset$. L'unione è quindi semplicemente la loro giustapposizione, e la cardinalità (nel senso della "lunghezza" degli intervalli) è la somma delle due, senza correzioni.

### Esempio 4 — Verifica della proprietà commutativa

Siano $A = \{a, b, c\}$ e $B = \{b, c, d, e\}$. Verifichiamo che $A \cup B = B \cup A$.

$$A \cup B = \{a, b, c, d, e\}$$
$$B \cup A = \{b, c, d, e, a\} = \{a, b, c, d, e\}$$

I due insiemi coincidono. ✓ Ricordiamo che in teoria degli insiemi l'**ordine degli elementi non conta**: $\{a, b, c, d, e\}$ e $\{b, c, d, e, a\}$ sono lo stesso insieme.

*\* immagine: quattro diagrammi di Venn affiancati, uno per ciascun esempio, con le aree di unione evidenziate in colore; per l'esempio 3, i due cerchi sono separati e non sovrapposti \**

---

## Connessioni con altre operazioni: intersezione, complementare e differenza

### Quando $A \cup B = A \cap B$?

L'unione e l'intersezione sono operazioni "duali": l'unione raccoglie il massimo, l'intersezione il minimo. Vale $A \cup B = A \cap B$ se e solo se $A = B$: solo quando i due insiemi coincidono, il "massimo" e il "minimo" sono uguali.

### Distributività

L'unione e l'intersezione si distribuiscono reciprocamente, in modo analogo alla moltiplicazione e all'addizione tra numeri:

$$A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$$
$$A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$$

Queste identità sono strumenti potenti per semplificare espressioni insiemistiche complesse.

### Relazione tra unione e differenza

Possiamo esprimere l'unione anche attraverso la **differenza insiemistica** $B \setminus A$ (l'insieme degli elementi di $B$ che non appartengono ad $A$):

$$A \cup B = A \cup (B \setminus A)$$

Questa scrittura rende esplicito che $A \cup B$ si ottiene prendendo $A$ e aggiungendovi solo gli elementi di $B$ che non ci sono già — eliminando alla radice il problema del doppio conteggio.

### Il principio di inclusione-esclusione

> [!definition] Principio di inclusione-esclusione
> Per due insiemi finiti $A$ e $B$, la cardinalità dell'unione è:
> $$|A \cup B| = |A| + |B| - |A \cap B|$$

Ritorniamo così alla domanda con cui abbiamo aperto: in una classe con 15 calciatori e 12 pallavolisti, di cui 