# Note: Equazioni e disequazioni irrazionali

Lezione nuova, scritta da zero (lotto 9). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy in `lotto9/92/verifica.py` nello scratchpad (43 controlli): `solveset` sui reali per ogni equazione degli esempi, degli avvisi e delle carte, e per l'equazione elevata al quadrato (per vedere quali soluzioni sono estranee); `discriminant` e `expand` per ogni risolvente e ogni quadrato o cubo di binomio; i due elevamenti dell'esempio 7 passo per passo, con la verifica di $4$ e di $84$. Nell'esempio 6 SymPy accetta anche $x = -1$, perché lavora con le radici complesse ($\sqrt{-3} = \sqrt{-3}$): lo script lo scarta controllando che i radicandi siano non negativi, come fa la lezione. Le disequazioni (esempi 9-13, $\sqrt{x + 1} \gtrless -2$) sono controllate confrontando l'insieme $S$ scritto nella lezione con la disequazione valutata su 224 001 punti tra $-12$ e $100$, estremi interi compresi, con la radice definita solo dove il radicando non è negativo; i trinomi con `solve_univariate_inequality`. Lo script delle figure (`lotto9/92/figs.py`) controlla che i punti disegnati stiano sulle curve. Il controllo `check.mts` passa sui tre file. Le formule in evidenza, misurate con KaTeX in Chromium a 17 px, sono larghe al massimo 245 px (le due righe del secondo elevamento dell'esempio 7).

## Struttura ed esempi

Definizione con il controesempio $\sqrt{2}\,x = 4$ (link alla 75) e i due fatti sulla radice quadrata (esistenza e segno, link alla 72). Poi $\sqrt{A(x)} = k$ nei tre casi di $k$; la sezione sulle soluzioni estranee ($a^2 = b^2$ vuol dire $a = \pm b$) con $\sqrt{x + 3} = x - 3$ e il grafico; $\sqrt{A(x)} = B(x)$ con il sistema $B(x) \geq 0$, $A(x) = [B(x)]^2$, la spiegazione del perché $A(x) \geq 0$ non serve (come chiede il brief) e il procedimento in quattro passi. La verifica è il metodo alternativo, in un `ad-tip`. Poi due radicali, radici cubiche, disequazioni.

Tredici esempi svolti:

1. $\sqrt{2x - 1} = 3$ e $\sqrt{x^2 - 7} = 3$, numero positivo a secondo membro;
2. $\sqrt{3x + 1} = x - 1$, soluzioni $0$ (estranea) e $5$;
3. $x + \sqrt{x - 1} = 7$, prima si isola il radicale, $S = \{5\}$;
4. $\sqrt{x + 6} = -x$, soluzione negativa accettabile, $S = \{-2\}$;
5. $\sqrt{x^2 + 3} = x - 1$, risolvente di primo grado, impossibile;
6. $\sqrt{x^2 - 4} = \sqrt{3x}$, condizione sul radicando più semplice, $S = \{4\}$;
7. $\sqrt{2x + 1} + \sqrt{x - 3} = 4$, due elevamenti e verifica, $S = \{4\}$ ($84$ estranea);
8. $\sqrt[3]{x^3 - 7} = x - 1$, radice cubica, $S = \{-1, 2\}$;
9. $\sqrt{x - 2} < 3$, $S = [2, 11\mathclose{[}$;
10. $\sqrt{x^2 - 5} \geq 2$, valori esterni;
11. $\sqrt{x + 5} < x - 1$, sistema di tre disequazioni con figura, $S = \,\mathopen{]}4, +\infty\mathclose{[}$;
12. $\sqrt{x^2 - 4} < x + 1$, radicando di secondo grado, $S = [2, +\infty\mathclose{[}$;
13. $\sqrt{x + 5} > x - 1$, unione di due sistemi, $S = [-5, 4\mathclose{[}$, con il grafico che confronta i due membri.

Gli esempi 11 e 13 hanno la stessa coppia di membri con i versi opposti, così la figura dell'esempio 13 spiega tutti e due. Avvisi (`ad-warning`), ognuno dopo il suo punto: elevare al quadrato con il secondo membro negativo, elevare termine per termine (doppio prodotto), non isolare il radicale, scartare le soluzioni negative, le condizioni della radice quadrata sulla radice cubica, dimenticare l'esistenza nel verso $<$, un sistema solo nel verso $>$, intersezione al posto dell'unione. Nessuna sezione "Errori frequenti" in fondo: tutti gli errori hanno un punto preciso.

## Scelte di convenzione (da verificare con il libro in uso)

- Metodo principale: le condizioni ($B(x) \geq 0$ e, per le disequazioni, i sistemi); la verifica è l'alternativa per le sole equazioni. Alcuni libri fanno il contrario per le equazioni (verifica sempre, condizioni come "metodo più rapido").
- Il sistema per $\sqrt{A(x)} = B(x)$ è scritto con due righe, senza $A(x) \geq 0$; molti libri scrivono tre righe e poi osservano che la prima è superflua. La lezione nomina tutte e tre le richieste nel testo e spiega perché una cade.
- Le parentesi quadre $[B(x)]^2$ per il quadrato del secondo membro, come nei libri; nel resto della lezione le parentesi quadre sono solo quelle degli intervalli.
- "Soluzioni estranee" in grassetto dove è definito. Alcuni libri dicono "soluzioni non accettabili" o "soluzioni spurie"; "spurie" non l'ho usato perché nella 17 "spuria" è un tipo di equazione di secondo grado.
- Il sistema di $\sqrt{A(x)} < B(x)$ con $B(x) > 0$ stretto, come nella maggior parte dei libri; con $B(x) \geq 0$ il risultato sarebbe lo stesso.
- Intervalli come nella 88: `\mathopen{]}`, `\mathclose{[}`, "$x \leq -3$ oppure $x \geq 3$". Condizioni con $\geq$ e $\leq$ (come 88 e 89), non `\ge` (come la 72).
- Le equazioni con un numero a secondo membro sono in una tabella per le disequazioni ($k < 0$, $k = 0$, $k > 0$); per le equazioni un elenco.
- Il grafico di $y = \sqrt{x + 3}$ si presenta come curva disegnata per punti (link alla 42), senza dire che è mezza parabola con l'asse orizzontale: le coniche arrivano al terzo anno.

## Lasciato ad altre lezioni

- Le condizioni di esistenza e $\sqrt{x^2} = |x|$: link alla 72, non rispiegati. $\sqrt{x^2} = |x|$ non serve nella lezione.
- Radicali di indice qualunque ($\sqrt[4]{\ }$, $\sqrt[5]{\ }$): la lezione dice solo quadrate e cubiche, come chiede il brief; le regole per indice pari e dispari sono le stesse, ma non l'ho scritto per non aggiungere casi senza esempi.
- Equazioni con tre radicali, radicali al denominatore, equazioni irrazionali fratte: fuori.
- Disequazioni con due radicali ($\sqrt{A} < \sqrt{B}$, $\sqrt{A} + \sqrt{B} > k$): fuori, perché il brief chiede solo $\sqrt{A} \gtrless B$ e i casi con $k$. Se servono, $\sqrt{A} < \sqrt{B}$ si aggiunge in un paragrafo (sistema $A \geq 0$, $A < B$).
- Il metodo grafico per le disequazioni ($y = \sqrt{A}$ contro $y = B$) è solo nella figura dell'esempio 13, come controllo, non come metodo.

## Figure

Tre blocchi TikZ, generati da `lotto9/92/figs.py` e compilati con `compileFigure` di `scripts/figure/compile.mjs` (script `lotto9/render.mjs`); guardati in PNG in chiaro e con il filtro del tema scuro (`invert(1) hue-rotate(180deg)`, come in `globals.css`) su un riquadro bianco.

- `equazione-irrazionale-soluzione-estranea`, 250x168: $y = \sqrt{x + 3}$ (blu), $y = -\sqrt{x + 3}$ (blu tratteggiata), la retta $y = x - 3$ (rossa); pallino pieno in $(6, 3)$, pallino rosso in $(1, -2)$. Stessa scala sui due assi. Le curve sono tracciate parametrizzando con $y$ ($x = y^2 - 3$), così il tratto vicino a $(-3, 0)$ è liscio.
- `sistema-disequazione-irrazionale`, 276x98: grafico del sistema dell'esempio 11, con lo stesso schema e le stesse misure del `sistema-secondo-grado` della 89 (strisce arancioni, righe blu, pallini).
- `disequazione-irrazionale-confronto-grafici`, 264x168: $y = \sqrt{x + 5}$ con l'arco sopra la retta in blu spesso, la retta $y = x - 1$, il punto $(4, 3)$ e sotto la riga $S$ come nelle figure della 88.

Niente `\clip`, niente riempimenti bianchi, niente `\mathbb`. Due figure superano di poco i 260 px di larghezza (come quelle della 89 con le etichette a sinistra); sul telefono si riducono.

## Formulario e flashcard

- Formulario: i due fatti, radice uguale a un numero, il sistema di $\sqrt{A} = B$ con i passi, estranee e verifica, due radicali e radici cubiche, la tabella con $k$, i sistemi delle disequazioni, tre avvisi. Il simbolo $\iff$ non c'è, perché la lezione non lo usa: "equivale al sistema".
- 18 carte, nell'ordine della lezione; i numeri vengono tutti dalla lezione.

## Da cambiare nelle lezioni già scritte

Nessuna modifica necessaria: nessuna lezione scritta rimanda alle equazioni irrazionali. Una modifica facoltativa:

- 75 (Espressioni con i radicali), sezione "Equazioni e disequazioni con coefficienti irrazionali", dopo la prima frase "Un'equazione di primo grado può avere coefficienti irrazionali, come $\sqrt{3}\,x - 2 = x$.": aggiungere "Non è un'[equazione irrazionale](/materiale/scuola-superiore/matematica/equazioni-e-disequazioni-di-grado-superiore/equazioni-e-disequazioni-irrazionali), perché l'incognita non sta sotto la radice." È la distinzione che la 92 fa con $\sqrt{2}\,x = 4$.

## Prerequisiti

La riga del brief ha un arco ridondante: `numeri-reali-radici` è già antenata di `disequazioni-secondo-grado-fratte` (attraverso `disequazioni-secondo-grado`, `funzioni-quadratiche`, `equazioni-secondo-grado`, `radicali-operazioni`), controllato sul grafo di `prerequisiti.md`. La riga proposta è

```
equazioni-irrazionali <- disequazioni-secondo-grado-fratte
```

`disequazioni-secondo-grado-fratte` porta con sé le equazioni e le disequazioni di secondo grado, i sistemi di disequazioni e i radicali, cioè tutto quello che la lezione usa.

## Per il generatore

1. $\sqrt{A(x)} = k$ con $A$ di primo o secondo grado e $k$ intero, anche negativo ($\sqrt{2x - 1} = 3$; $\sqrt{x + 5} = -2$). Distrattori: $x = -1$ per $\sqrt{x + 5} = -2$ (quadrato senza guardare il segno); una sola soluzione per $\sqrt{x^2 - 7} = 3$.
2. $\sqrt{A(x)} = B(x)$ con $A$ e $B$ di primo grado, una soluzione estranea ($\sqrt{3x + 1} = x - 1$, $S = \{5\}$). Distrattori: tutte e due le soluzioni del quadrato ($\{0, 5\}$); il quadrato senza doppio prodotto.
3. Radicale da isolare ($x + \sqrt{x - 1} = 7$). Distrattore: $\{5, 10\}$.
4. Condizione su $B(x)$ con soluzioni negative accettabili ($\sqrt{x + 6} = -x$, $S = \{-2\}$), o risolvente di primo grado impossibile ($\sqrt{x^2 + 3} = x - 1$). Distrattori: $\emptyset$ o $\{3\}$ nel primo (scartare le negative), $\{-1\}$ nel secondo.
5. Due radicali: $\sqrt{A} = \sqrt{B}$ ($\sqrt{x^2 - 4} = \sqrt{3x}$) e $\sqrt{A} + \sqrt{B} = k$ con due elevamenti. Distrattori: $\{-1, 4\}$; $\{4, 84\}$.
6. Radice cubica ($\sqrt[3]{x^3 - 7} = x - 1$). Distrattore: $\{2\}$ (condizione $B \geq 0$ imposta).
7. Disequazioni con $k$ costante ($\sqrt{x - 2} < 3$, $\sqrt{x^2 - 5} \geq 2$, $\sqrt{x + 1} > -2$). Distrattori: $x < 11$ senza l'esistenza; $\emptyset$ per $\sqrt{x + 1} > -2$.
8. $\sqrt{A} < B$ ($\sqrt{x + 5} < x - 1$, $S = \,]4, +\infty[$). Distrattore: $x < -1$ oppure $x > 4$ (solo il quadrato).
9. $\sqrt{A} > B$ ($\sqrt{x + 5} > x - 1$, $S = [-5, 4[$). Distrattori: $[1, 4[$ (un sistema solo), $]-1, 4[$ (solo il quadrato), $\emptyset$ (intersezione dei due sistemi).

Il controllo del generatore deve risolvere l'equazione di partenza sui reali con le radici definite solo per radicandi non negativi (SymPy da solo accetta soluzioni con radicandi negativi uguali, come $x = -1$ nell'esempio 6).

## Domande per Andrea

- Per le equazioni, metodo principale con le condizioni e verifica come alternativa, o il contrario? Molti insegnanti chiedono sempre la verifica.
- Il sistema di $\sqrt{A(x)} = B(x)$: due righe (come nella lezione) o tre, con $A(x) \geq 0$ scritta e poi dichiarata superflua?
- "Soluzioni estranee" o "soluzioni non accettabili"?
- Servono le disequazioni con due radicali ($\sqrt{A} < \sqrt{B}$) e gli indici diversi da $2$ e $3$?
- Nel sistema di $\sqrt{A(x)} < B(x)$: $B(x) > 0$ (lezione) o $B(x) \geq 0$?
