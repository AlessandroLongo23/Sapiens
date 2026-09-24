# Flashcard: Sottoinsiemi e uguaglianza

## sottoinsieme-definizione
Quando $A$ è un sottoinsieme di $B$?
---
Quando ogni elemento di $A$ è anche elemento di $B$; si scrive $A \subseteq B$.

## simbolo-contiene
Come si legge $B \supseteq A$?
---
"$B$ contiene $A$": è un altro modo di scrivere $A \subseteq B$.

## inclusione-controesempio
Vero o falso: $\{1, 6\} \subseteq \{1, 2, 3, 4, 5\}$.
---
Falso. $6$ non sta in $\{1, 2, 3, 4, 5\}$, e un solo elemento fuori basta a smentire l'inclusione.

## vuoto-sottoinsieme
Vero o falso: l'insieme vuoto è sottoinsieme di ogni insieme.
---
Vero. Per smentire $\emptyset \subseteq A$ servirebbe un elemento di $\emptyset$ fuori da $A$, ma $\emptyset$ non ha elementi.

## vuoto-elemento
Con $A = \{1, 2\}$, vero o falso: $\emptyset \in A$.
---
Falso. Gli elementi di $A$ sono solo $1$ e $2$; vale invece $\emptyset \subseteq A$.

## inclusione-stretta-definizione
Che cosa significa $A \subset B$?
---
Che $A \subseteq B$ e $A \neq B$: $B$ ha almeno un elemento che non sta in $A$.

## inclusione-stretta-se-stesso
Vero o falso: $A \subset A$.
---
Falso. L'inclusione stretta richiede che i due insiemi siano diversi; vale $A \subseteq A$.

## catena-insiemi-numerici
Metti in ordine di inclusione stretta $\mathbb{Q}$, $\mathbb{N}$, $\mathbb{R}$, $\mathbb{Z}$.
---
$\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$.

## sottoinsiemi-impropri
Quali sono i sottoinsiemi impropri di un insieme $A$?
---
$\emptyset$ e $A$ stesso.

## numero-sottoinsiemi-abc
Quanti sottoinsiemi ha $\{a, b, c\}$?
---
8, di cui 2 impropri ($\emptyset$ e $\{a, b, c\}$) e 6 propri.

## uguaglianza-definizione
Quando due insiemi sono uguali?
---
Quando hanno esattamente gli stessi elementi.

## doppia-inclusione
Completa: $A = B$ se e solo se $\dots$
---
$A \subseteq B$ e $B \subseteq A$. Il metodo si chiama doppia inclusione.

## lettere-casa-sacca
Vero o falso: l'insieme delle lettere di "casa" è uguale all'insieme delle lettere di "sacca".
---
Vero. Tutti e due sono $\{a, c, s\}$.

## stesso-numero-elementi
Vero o falso: due insiemi con lo stesso numero di elementi sono uguali.
---
Falso. $\{1, 2, 3\}$ e $\{a, b, c\}$ hanno tre elementi ciascuno ma sono diversi.

## zero-fa-differenza
Vero o falso: $\{x \in \mathbb{N} \mid x < 4\} = \{1, 2, 3\}$.
---
Falso. Il primo insieme contiene anche lo $0$, quindi $\{1, 2, 3\} \subset \{x \in \mathbb{N} \mid x < 4\}$.

## proprieta-transitiva
Come si chiama la proprietà "se $A \subseteq B$ e $B \subseteq C$, allora $A \subseteq C$"?
---
Proprietà transitiva.

## proprieta-antisimmetrica
Come si chiama la proprietà "se $A \subseteq B$ e $B \subseteq A$, allora $A = B$"?
---
Proprietà antisimmetrica.

## appartenenza-o-inclusione
Con $B = \{2, 4, 6\}$, vero o falso: $\{2\} \in B$.
---
Falso. Gli elementi di $B$ sono numeri; è vero invece $\{2\} \subseteq B$.
