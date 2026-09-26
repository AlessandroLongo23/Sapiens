# Note: Polinomi e grado di un polinomio

Lezione nuova, scritta da zero (lotto 3). Nel database oggi ci sono due nodi vuoti, "Polinomi" (`polinomi`) e "Grado di un polinomio" (`polinomi-grado`): questa lezione li unisce, come dice `programma.md`. Tutti i conti di lezione, formulario e carte (riduzioni a forma normale, gradi, valori numerici, $P(2)$, $P(-1)$, $P\left(\frac{1}{2}\right)$) sono stati rifatti con SymPy.

## Scelte di convenzione

- Definizione: polinomio come "somma algebrica di monomi", e forma normale (o polinomio ridotto) quando non ci sono termini simili. Un monomio è un polinomio con un solo termine. Alcuni libri definiscono il polinomio direttamente come somma di monomi non simili: ho seguito la scelta del brief di lotto, che separa le due cose.
- Binomio, trinomio, quadrinomio si contano sul polinomio in forma normale (esempio 3: sei termini scritti, un binomio).
- Termine noto: se manca, "il termine noto è $0$", come nella maggior parte dei libri. Non ho messo il "termine noto rispetto a una lettera" (i termini senza $x$ in un polinomio in più lettere), che alcuni libri usano per Ruffini: da aggiungere solo se le lezioni 33 e 37 ne hanno bisogno.
- Polinomio nullo senza grado, coerente con Grado di un monomio. Le costanti non nulle hanno grado $0$.
- Completo rispetto a una lettera: tutte le potenze dalla più alta fino alla potenza $0$, termine noto compreso. È la definizione più diffusa; il riquadro "Anche il termine noto conta" dipende da questa scelta.
- Ordinamento: potenze decrescenti nei risultati, come dice la convenzione del lotto. Il testo dice "In queste lezioni, come nella maggior parte dei libri"; se non piace il riferimento alle lezioni, si può togliere.
- Ho definito qui il coefficiente direttore (in grassetto, nella sezione su $P(x)$), perché le lezioni 36 e 37 lo usano. Non ho usato "termine direttore", che è meno diffuso.
- Grassetti: 12 (il limite del controllo automatico), tutti su termini definiti. Binomio, trinomio e quadrinomio sono senza grassetto per restare nel limite.

## Lasciato ad altre lezioni

- Definizione di monomio, forma normale del monomio e valore numerico di un monomio: Monomi (27), con link. Qui il valore numerico si ripete per i polinomi con due passi e tre esempi, perché il brief lo mette in questa lezione.
- Grado di un monomio: link a Grado di un monomio. Somma di monomi simili: link a Operazioni tra monomi.
- Somma, prodotto e grado della somma e del prodotto: Operazioni tra polinomi (29). Qui nessuna operazione tra polinomi, solo la riduzione dei termini simili dentro un polinomio.
- Il completamento con coefficienti $0$ è solo annunciato, con il link a Divisione tra polinomi (32).
- Il controllo con il valore numerico in un punto è citato con il link a Espressioni con polinomi (31), con la precisazione che trova un errore ma non dimostra che il conto è giusto.

## Da cambiare in lezioni già scritte

- Grado di un monomio, riquadro finale "Il grado di un polinomio": dice "Un polinomio è una somma di monomi non simili". Con la definizione di questa lezione sarebbe "una somma algebrica di monomi"; oppure "un polinomio in forma normale è una somma di monomi non simili".
- Operazioni tra monomi, sezione "Potenza": il link "potenza di un monomio" punta alla lezione stessa (`operazioni-tra-monomi`). Non riguarda questa lezione, ma l'ho visto rileggendola.

## Figure

Nessuna. La lezione non parla di diagrammi, e non ho trovato un disegno che chiarisca più del testo: l'unico candidato era un polinomio con i termini, il grado di ciascuno e il termine noto indicati da frecce, che ripeterebbe l'esempio 4.

## Formulario e flashcard

- Formulario con una tabella che confronta ordinato, completo e omogeneo, e tre avvisi (grado non somma, completo fino al termine noto, meno davanti alla potenza).
- 20 carte. `termine-noto-assente` usa $x^3 - 4x$, che non è nella lezione (la regola sì).

## Livelli per gli esercizi

1. Riconoscere termini, numero di termini e termine noto di un polinomio già ridotto: termini di $x^2 - 3x + 2$.
2. Ridurre a forma normale un polinomio in una lettera con coefficienti interi: $3x^2 - 2x + 5 - x^2 + 4x - 7 = 2x^2 + 2x - 2$.
3. Ridurre in due lettere, con frazioni o un monomio da ridurre prima: esempio 2 della lezione.
4. Grado complessivo e grado rispetto a ogni lettera, anche su un polinomio da ridurre prima: $3x^2y^3 - 5x^4 + 2xy - 1$.
5. Riconoscere e ordinare: ordinato, completo (con completamento), omogeneo.
6. Valore numerico con numeri negativi e frazioni, anche nella scrittura $P(a)$: $x^2y - 2xy^2 + 3$ per $x = \frac{1}{2}$, $y = -2$ vale $-\frac{3}{2}$.

## Prerequisiti

La riga `polinomi <- monomi-grado, monomi-operazioni` va bene così. Il grado dei monomi serve per il grado del polinomio, la somma di monomi simili per la forma normale; la lezione Monomi (definizione e valore numerico) arriva di sicuro, perché è prerequisito di entrambe.
