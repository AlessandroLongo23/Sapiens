# Note: Espressioni con frazioni

Lezione nuova, scritta da zero (nel database c'è solo il titolo). Nel programma (`programma.md`) è la numero 23; il file porta il numero 25 come indicato nel brief del lotto.

## Scelte

- L'ordine delle operazioni è ripetuto in cinque righe, con link a Operazioni in ℕ e Operazioni in ℤ: senza, la lezione non si regge da sola, e la lista è la stessa di Espressioni con monomi (tonde, quadre, graffe; potenze; prodotti e quozienti da sinistra; somme).
- Le singole operazioni (mcm dei denominatori, reciproco, semplificazione in croce) non sono rispiegate: sono usate negli esempi e rimandano a Operazioni in ℚ. La semplificazione in croce compare perché la domanda "quando semplificare" è nell'ambito della lezione.
- Aggiunta una sezione "Frazioni di frazioni" (linea principale come divisione e parentesi), con due errori: linea principale sbagliata e semplificazione di un addendo.
- Aggiunta una sezione breve sui controlli finali (minimi termini, segno, decimali approssimati), con un riquadro che rifà l'esempio 2 in decimali.
- I decimali si trasformano in frazioni come primo passo; la conversione in generale (periodici compresi) è lasciata a Numeri decimali e frazioni, con un link. Negli esempi compare solo $0{,}5$.
- Nessuna figura: l'argomento non ne ha bisogno (niente retta dei numeri o diagrammi a cui il testo si riferisca).
- Sei esempi svolti: una parentesi; segni e quoziente; potenze con segno ed esponente negativo; frazione di frazioni; frazione di frazioni con decimale ed esponente negativo a base negativa; tonde, quadre e graffe con proprietà delle potenze. Tutti i conti rifatti con `fractions` di Python.

## Dubbi

- Nell'esempio 6 il quoziente $\left(-\frac{1}{3}\right)^2 : \left(-\frac{1}{3}\right)^3$ è fatto con la proprietà (esponente $-1$). Alcuni docenti preferiscono calcolare le due potenze; il risultato è lo stesso ($\frac{1}{9} : \left(-\frac{1}{27}\right) = -3$).
- Nel formulario ho scritto la formula generale $\dfrac{a/b}{c/d} = \dfrac{a}{b} \cdot \dfrac{d}{c}$ e $a : \dfrac{b}{c} = a \cdot \dfrac{c}{b}$: la lezione le dice a parole e con numeri, non in lettere. Se si vuole il formulario strettamente fedele, si sostituiscono con l'esempio $\dfrac{2/3}{4/9} = \dfrac{3}{2}$.
- La lezione parla di "linea di frazione principale"; qualche libro dice "linea di frazione più lunga" o "tratto di frazione principale". Ho usato entrambe le parole una volta, poi solo "linea principale".

## Sovrapposizioni con lezioni già scritte

- Potenze in ℚ, esempio 4 ("attenzione ai segni"), è già un'espressione con frazioni a tre termini: può restare, perché è centrato sulle potenze, ma se si vuole alleggerire quella lezione è il candidato.
- Operazioni in ℕ ha la sezione "Ordine delle operazioni nelle espressioni", che resta la fonte della regola; qui c'è solo il richiamo.
- Nessuna lezione già pubblicata tratta frazioni di frazioni o controlli del risultato, quindi niente da togliere.

## Livelli per gli esercizi

1. Due operazioni senza parentesi, con priorità da rispettare e numeri positivi: $\dfrac{1}{2} + \dfrac{2}{3} \cdot \dfrac{9}{4} = 2$.
2. Una parentesi tonda e un meno davanti o un fattore negativo: $\dfrac{5}{6} - \left(\dfrac{1}{3} - \dfrac{3}{4}\right) : \left(-\dfrac{5}{2}\right) = \dfrac{2}{3}$.
3. Potenze con base negativa ed esponente negativo o zero dentro l'espressione: $\left(-\dfrac{1}{2}\right)^3 \cdot \left(\dfrac{4}{3}\right)^2 - \left(\dfrac{2}{3}\right)^{-1} : 3^2 = -\dfrac{7}{18}$.
4. Frazioni di frazioni, con somme al numeratore e al denominatore: $\dfrac{1 - \dfrac{1}{4}}{\dfrac{1}{2} + \dfrac{1}{3}} = \dfrac{9}{10}$.
5. Numeri decimali da convertire, insieme a esponenti negativi: $\dfrac{\left(\dfrac{1}{2}\right)^{-2} - \dfrac{1}{3}}{0{,}5 - \left(-\dfrac{2}{3}\right)^{-1}} = \dfrac{11}{6}$.
6. Tonde, quadre e graffe con potenze da trattare con le proprietà: $\left\{\left[\left(\dfrac{2}{3} - 1\right)^2 : \left(-\dfrac{1}{3}\right)^3 + \dfrac{5}{2}\right] \cdot \left(\dfrac{1}{2}\right)^{-2} - \dfrac{3}{4}\right\} : \left(-\dfrac{5}{4}\right) = \dfrac{11}{5}$.

Per il generatore: conviene costruire le espressioni all'indietro dal risultato, in modo che ogni risultato intermedio abbia numeratore e denominatore piccoli (sotto 30), e scartare quelle in cui un divisore vale zero.
