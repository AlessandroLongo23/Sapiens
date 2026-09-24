# Note: Operazioni in ℚ

Lezione nuova, scritta da zero (lotto 2). Tutti i conti di lezione, formulario e carte sono stati rifatti con `fractions` di Python.

## Scelte di convenzione

- Prima riga "# Operazioni in ℚ" con il carattere ℚ, come "# Potenze in ℚ"; nel database il titolo è "Operazioni in \mathbb{Q}".
- "MCM" in maiuscolo, come in Confronto tra frazioni e nei titoli del sito (il brief di lotto diceva "mcm").
- Denominatori positivi, come in Confronto tra frazioni: il segno si porta al numeratore.
- Divisione scritta con ":" come nelle altre lezioni del capitolo.
- Tabella "interna in ℕ / ℤ / ℚ" con la parola "interna" definita in Operazioni in ℕ. La colonna ℤ dice che la divisione non è interna, come la bozza di Operazioni in ℤ del lotto 2.
- "Reciproci" senza il sinonimo "inversi", per non avere due nomi per la stessa cosa. Alcuni libri scrivono "inverso moltiplicativo": da decidere se citarlo una volta.

## Numeri misti

Nei libri delle superiori i numeri misti quasi non compaiono (si lasciano le frazioni improprie); li usano le medie e qualche problema. Li ho messi in un solo riquadro `ad-note`, con l'unico punto che fa sbagliare: $2\tfrac{3}{5}$ vuol dire $2 + \dfrac{3}{5}$, non $2 \cdot \dfrac{3}{5}$. Nel formulario è una riga, nelle carte una. Se si preferisce, si possono togliere senza toccare il resto. Da verificare su un paio di libri in uso.

## Lasciato ad altre lezioni

- Frazioni equivalenti, riduzione ai minimi termini, proprietà invariantiva: [Frazioni e numeri razionali] (lotto 2). Qui solo "riduci ai minimi termini" con il link.
- Il procedimento del denominatore comune è lo stesso del Confronto tra frazioni: qui è ripetuto in cinque passi perché nella somma serve anche il passo del numeratore, con il link al confronto.
- Espressioni con più di due operazioni e parentesi annidate: [Espressioni con frazioni]. L'esempio 5 e l'esempio 6 usano la precedenza della moltiplicazione e una parentesi, senza spiegare l'ordine delle operazioni (che è in Operazioni in ℕ).
- Potenze: solo un rimando per il reciproco scritto come esponente $-1$.
- La frazione a più piani ha un solo esempio, senza regole sulla linea principale, che sono in Espressioni con frazioni (bozza del lotto 2). Si può togliere da qui o lasciare come anticipo.

## Da togliere o controllare in lezioni già scritte

- Confronto tra frazioni: le sezioni "Frazioni equivalenti" e "Riduzione ai minimi termini" dovrebbero passare a Frazioni e numeri razionali (lo dice già il programma), non a questa lezione.
- Operazioni tra monomi, esempio 6: "Dividere per $\frac{3}{2}$ equivale a moltiplicare per il reciproco $\frac{2}{3}$" potrebbe diventare un link a questa lezione.
- Nessuna lezione pubblicata oggi spiega somma e prodotto di frazioni, quindi non c'è altro da togliere.

## Figura

Una sola: la somma $\frac{1}{2} + \frac{1}{3} = \frac{5}{6}$ su un segmento diviso in sesti (`somma-di-frazioni-un-mezzo-piu-un-terzo`). L'ho compilata con `scripts/figure/compile.mjs` e guardata in chiaro: archi ed etichette leggibili. Non l'ho vista sul sito in tema scuro; non usa riempimenti bianchi né `\clip`. Non è nel formulario.

## Formulario e flashcard

- 19 carte. La carta `sottrazione-conto` ($\frac{5}{6} - \frac{1}{3}$) usa numeri che non sono nella lezione; la regola sì.
- Il riquadro "Semplificazione in croce solo nel prodotto" del formulario riassume due avvisi della lezione (somma e divisione).

## Livelli per gli esercizi

1. Somma o differenza di due frazioni con lo stesso denominatore, risultato da ridurre: $\dfrac{5}{12} + \dfrac{1}{12} = \dfrac{1}{2}$.
2. Somma o differenza con denominatori diversi, positivi, frazioni già ridotte: $\dfrac{7}{12} - \dfrac{3}{8} = \dfrac{5}{24}$.
3. Come il livello 2, con segni (frazione negativa, sottrazione di una negativa) o con un intero: $-\dfrac{5}{6} + \dfrac{4}{15} = -\dfrac{17}{30}$, $3 - \dfrac{7}{4} = \dfrac{5}{4}$.
4. Prodotto di due frazioni con semplificazione in croce e segni: $\left(-\dfrac{14}{15}\right) \cdot \dfrac{25}{21} = -\dfrac{10}{9}$.
5. Quoziente di due frazioni (o di frazione e intero), con segni e semplificazione dopo aver capovolto: $\left(-\dfrac{8}{9}\right) : \left(-\dfrac{4}{15}\right) = \dfrac{10}{3}$.
6. Due operazioni, una somma o differenza e un prodotto o quoziente, con o senza parentesi: $\left(\dfrac{1}{2} - \dfrac{5}{6}\right) : \dfrac{2}{3} = -\dfrac{1}{2}$, $2 - \dfrac{3}{4} \cdot \dfrac{2}{9} = \dfrac{11}{6}$.
