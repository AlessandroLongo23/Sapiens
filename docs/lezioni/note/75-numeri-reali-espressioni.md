# Note: Espressioni con i radicali

Lezione nuova, scritta da zero (lotto 7). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`radsimp`, `simplify`, `solve`, `solve_univariate_inequality`, `sqrtdenest`): i sei esempi di espressioni, l'equazione $\sqrt{8}\,x - \sqrt{2}\,x = 4$, l'esempio 7 ($x = \sqrt{3} + 1$), le disequazioni degli esempi 8 e 9 e dell'avviso ($x \ge -4 - 2\sqrt{3}$, $x < 9 + 4\sqrt{5}$, $x < -3 - 3\sqrt{2}$), i due radicali doppi ($\sqrt{3 + 2\sqrt{2}} = 1 + \sqrt{2}$, $\sqrt{7 - \sqrt{40}} = \sqrt{5} - \sqrt{2}$) e i controlli numerici del riquadro sui decimali ($a = 4$ nell'esempio 6 dà $16$ da entrambe le parti). La larghezza delle formule in evidenza è stata misurata con KaTeX in Chromium a 17 px: la più larga è 254 px ($(\sqrt{3} - 2)(\sqrt{3} + 2) = 3 - 4 = -1$), nel formulario 253 px (la formula dei radicali doppi). `check.mts` passa sui tre file.

## Scelte di convenzione

- Lettere positive, come 73, 74 e 76 (accordo nello scratchpad, `75-convenzioni.md`). Nella 75 le lettere compaiono solo nell'esempio 6, che lo dice all'inizio e rimanda alla 72 per le condizioni di esistenza. Nelle equazioni e disequazioni l'incognita $x$ non sta sotto radice, quindi non serve nessuna condizione.
- "Risultato finito" definito in una sezione apposta: radicali semplificati, radicali simili sommati, denominatori razionalizzati, parte razionale ridotta. È la convenzione del lotto (sempre semplificare, sempre razionalizzare) detta in chiaro, perché è quello che lo studente deve sapere per confrontarsi con il libro. Da verificare con il libro in uso.
- Ordine delle operazioni: le radici hanno la stessa priorità delle potenze, e il segno di radice fa da parentesi sul radicando. Lo dicono quasi tutti i libri; qualcuno non lo scrive esplicitamente.
- Il segno di un coefficiente come $a - \sqrt{b}$ si trova confrontando i quadrati (tra numeri positivi) o con il valore approssimato. Il confronto tra irrazionali è nella 71: link.
- Divisione tra radicali scritta con $:$ nell'esempio 5, come nelle espressioni con le frazioni (25).
- Intervalli con `\mathopen{]}` e `\mathclose{[}`, come nella 52.
- Radicali doppi in un riquadro `ad-note`, con la formula e le condizioni $a > 0$, $b > 0$, $a^2 - b \ge 0$. Non ci sono carte o esercizi obbligatori su questo: una carta sul "quando conviene" e una con il conto, che si possono togliere se il libro in uso non li fa.

## Lasciato ad altre lezioni

- Semplificazione, trasporto fuori dal segno di radice, riduzione allo stesso indice: 72 e 73, richiamati con un link e usati negli esempi senza rispiegarli.
- Razionalizzazione con il coniugato: 74. Qui compare solo come passaggio negli esempi 4, 7, 8 e 9.
- Principi di equivalenza e cambio di verso: 16 e 52, con link.
- Confronto tra irrazionali: 71.
- Potenze con esponente razionale: 76, non citate.

## Da cambiare nelle lezioni già scritte

Niente. La 17 usa la semplificazione dei radicali (73), non questa lezione. La 52 potrebbe citare in una riga le disequazioni con coefficienti irrazionali nel riquadro finale "Dove si usano", ma non è necessario.

## Figure

Una: `soluzioni-disequazione-coefficiente-irrazionale` (260×39 px) nell'esempio 8, retta dei numeri con la semiretta da $-4 - 2\sqrt{3} \approx -7{,}46$ in poi, stesso stile della 52 (asse `black!70`, tratto `blue!45` a 2 pt, pallino pieno). Compilata con `compileFigure` di `scripts/figure/compile.mjs` e guardata in chiaro e con il filtro del tema scuro: si legge in tutti e due. Non vista sul sito. L'esempio 9 non ha la figura, perché l'estremo $9 + 4\sqrt{5} \approx 17{,}9$ è lontano dallo zero e la retta direbbe poco; se si vuole una figura per ogni disequazione come nella 52, si aggiunge con lo stesso schema. Il formulario non ha figure.

## Formulario e flashcard

- Formulario: ordine delle operazioni, risultato finito, procedimento in quattro passi, prodotti notevoli con i radicali, equazioni e disequazioni con il segno del coefficiente, radicali doppi, tre avvisi.
- 17 carte, nell'ordine della lezione, tutte con conti a mente.

## Prerequisiti

La riga `numeri-reali-espressioni <- radicali-razionalizzazione, disequazioni-primo-grado` va bene così. La lezione usa la razionalizzazione in quasi tutti gli esempi, e attraverso la 74 arrivano la 73 (operazioni, trasporto fuori, stesso indice), la 72 e la 71 (confronto tra irrazionali, che serve per il segno dei coefficienti). La 52 serve per il cambio di verso e per gli intervalli, e porta con sé la 16 per le equazioni. I prodotti notevoli (30) arrivano attraverso la 73. Non aggiungerei altro.

## Per il generatore

1. Somme algebriche di radicali da semplificare prima: $\sqrt{50} - 3\sqrt{8} + \sqrt{18} = 2\sqrt{2}$, anche con radici cubiche ($\sqrt[3]{54} - \sqrt[3]{16} = \sqrt[3]{2}$).
2. Prodotti e prodotti notevoli: $(\sqrt{3} + 1)^2 - (\sqrt{3} - 2)(\sqrt{3} + 2) = 5 + 2\sqrt{3}$, risultato nella forma $a + b\sqrt{c}$.
3. Quozienti e razionalizzazione con denominatore monomio: $\dfrac{\sqrt{6} + \sqrt{2}}{\sqrt{2}} - \dfrac{3}{\sqrt{3}} = 1$.
4. Frazioni con denominatore binomio, da razionalizzare con il coniugato o sommare con il denominatore comune: $\dfrac{1}{\sqrt{3} - 1} + \dfrac{1}{\sqrt{3} + 1} = \sqrt{3}$.
5. Radicali con indici diversi e con lettere positive: $\sqrt{2} \cdot \sqrt[3]{4} : \sqrt[6]{2} = 2$; $\sqrt{9a^3} - a\sqrt{4a} + \dfrac{a^2}{\sqrt{a}} = 2a\sqrt{a}$.
6. Equazioni di primo grado con coefficienti irrazionali: $\sqrt{3}\,x - 2 = x$, $x = \sqrt{3} + 1$.
7. Disequazioni con coefficienti irrazionali di segno da stabilire: $\sqrt{3}\,x - 2 \le 2x$, $S = [-4 - 2\sqrt{3}, +\infty[$; $(\sqrt{5} - 2)x < \sqrt{5} + 2$, $S = ]-\infty, 9 + 4\sqrt{5}[$.

Distrattori utili: $\sqrt{a + b} = \sqrt{a} + \sqrt{b}$, radicali non simili sommati, il doppio prodotto dimenticato, la semplificazione di un termine solo, il verso non cambiato con un coefficiente negativo senza meno davanti. Per il controllo, il generatore dovrebbe confrontare i risultati con `radsimp` o numericamente, non come stringhe, e accettare solo la forma finita (semplificata e razionalizzata).
