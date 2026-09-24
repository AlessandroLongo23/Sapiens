# Note: Sottoinsiemi e uguaglianza

## Errori trovati nell'originale

- Il testo nel database è troncato: finisce a metà dell'Esempio 3 ("...che sono tutti elementi di $B$"), senza chiudere la doppia inclusione. Il campo `chars` di `index.json` (11095) conferma che il taglio è già nel database, non nell'esportazione.
- "$\mathbb{N} = \{1, 2, 3, 4, 5, 6, \ldots\}$": contraddice la convenzione del sito ($0 \in \mathbb{N}$) e la lezione Prime definizioni.
- "Quando $A \subseteq B$ ma $A \neq B$, diciamo che $A$ è un sottoinsieme proprio": nella maggior parte dei libri del biennio i sottoinsiemi impropri sono $\emptyset$ e $A$, quindi $\emptyset$ non è proprio anche se $\emptyset \subset A$. L'originale non distingueva inclusione stretta e sottoinsieme proprio, e non nominava mai i sottoinsiemi impropri.
- "Questa definizione è nota come principio di estensionalità": l'estensionalità dice che due insiemi con gli stessi elementi sono uguali; chiamare così la definizione per doppia inclusione è impreciso. Tolto.
- "$\{1, 2, 3\} = \{3, 1, 2\} = \{1, 1, 2, 3\}$. In tutti e tre i casi, i due insiemi...": tre insiemi, non due.
- "come $\leq$ ordina i numeri reali": l'analogia con un ordine totale è fuorviante ($\{1, 2\}$ e $\{3, 4\}$ non sono confrontabili). Tolta insieme a "ordine parziale", che non è materia del biennio.
- Esempio 1 intitolato "Verifica di sottoinsieme" ma concludeva con un'uguaglianza. I conti erano giusti.

## Cosa è cambiato

- Testo da 11.000 a circa 10.000 caratteri, ma con sette esempi svolti al posto di tre: via l'apertura di quattro paragrafi, le domande retoriche, la definizione formale con $\forall$ e $\Rightarrow$ (la logica ha un'altra collocazione) e la ripetizione di riflessività e vuoto in due sezioni.
- Aggiunti: inclusione stretta con la nota sulla notazione ($\subseteq$/$\subset$ nei libri italiani, $\subset$/$\subsetneq$ altrove), sottoinsiemi propri e impropri con nota sulla convenzione alternativa, elenco dei sottoinsiemi di $\{a, b, c\}$, esempi con ordine e ripetizioni ("casa"/"sacca"), con $\mathbb{Z}$ contro $\mathbb{N}$, con lo zero che rompe l'uguaglianza, doppia inclusione completa; errori frequenti su $\in$/$\subseteq$, $\emptyset \in A$, stessa cardinalità, $A \subset A$.
- Tolto l'esempio $\emptyset$ contro $\{\emptyset\}$: lo tratta già Prime definizioni (riscritta); qui resta un rimando nel riquadro sull'insieme vuoto.
- L'insieme delle parti e la formula $2^n$ non ci sono, perché l'originale non li trattava. L'Esempio 3 elenca gli 8 sottoinsiemi di $\{a, b, c\}$ senza dare il nome né la formula.

## Dubbi da decidere

- Sottoinsiemi impropri: ho seguito la convenzione "impropri = $\emptyset$ e $A$", che mi risulta la più diffusa nei libri del biennio (da verificare su Bergamini e Sasso). Se preferisci "proprio = diverso da $A$", vanno cambiati il paragrafo, l'Esempio 3 e la nota.
- Insieme delle parti: molti libri lo mettono in questo capitolo. Se lo vogliamo, sta bene qui come sezione breve dopo l'Esempio 3 ($\mathcal{P}(A)$, $|\mathcal{P}(A)| = 2^n$).
- La catena $\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$ presuppone che lo studente conosca già i quattro insiemi numerici: controllare che Prime definizioni li presenti.

## Figure da fare

- Eulero-Venn dell'inclusione: rettangolo universo, insieme $B = \{1, 2, 3, 4, 5\}$ e dentro $A = \{1, 3\}$ (numeri dell'Esempio 1), da mettere dopo la frase "il sottoinsieme si disegna tutto dentro l'insieme che lo contiene".
- Facoltativa: due diagrammi affiancati, $A \subset B$ (A dentro B con elementi fuori da A) e $A = B$ (una sola linea con due nomi).

## Formulario e flashcard

- La lezione conta gli 8 sottoinsiemi di $\{a, b, c\}$ ma non dà la regola generale ($2^n$ sottoinsiemi per un insieme di $n$ elementi): nel formulario e nelle carte c'è solo il caso con 3 elementi. Se la regola entra nella lezione, va aggiunta anche qui.
- Nel formulario "al massimo tanti elementi quanti $B$" è scritto $|A| \le |B|$, con la notazione della lezione 01, che questa lezione non usa.
