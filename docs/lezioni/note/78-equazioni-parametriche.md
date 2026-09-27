# Note: Equazioni parametriche

Lezione nuova, scritta da zero (lotto 7). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (script `78-verifica.py` nello scratchpad): la soluzione per $k = 1$, $\dfrac{\Delta}{4} = 3 - 2k$ e la soluzione doppia $3$, i valori $k = 0$ (soluzioni $\pm\sqrt{3}$), $k = -3$ (soluzioni $0$ e $\dfrac{3}{2}$), $k = -\dfrac{1}{2}$ (soluzioni $-1$ e $\dfrac{5}{3}$), l'impossibilità di $c = a$, $k = 2$ scartato per la somma, $k = -\dfrac{1}{3}$ per il prodotto, la somma dei quadrati dell'esempio 8 ($k = 1$ accettato, $k = 7$ scartato con $\Delta = -15$), la fattorizzazione $(x - 1)(kx - 1)$ e $\Delta = (k - 1)^2$ dell'esempio 9, l'esempio 7 ($k = 2$, soluzioni $\dfrac{1}{2}$ e $2$) e la sua variante con $k = 3$ e $\Delta = -11$, le soluzioni di $x^2 - 2x + k = 0$ per $k = 0, 1, 2$. Le formule in evidenza sono state misurate con KaTeX in Chromium (script di 77): la più larga è 240 px.

## Scelte di convenzione e dubbi

- Nome del parametro: $k$. La 50 usa $a$ negli esempi (e la sua nota lascia aperta la scelta di rinominarlo in $k$), ma in un'equazione di secondo grado $a$, $b$ e $c$ sono i coefficienti, quindi qui $a$ è impossibile. La lezione lo dice in una frase. Da verificare con il libro in uso; $k$ è la lettera più comune nei libri per le parametriche.
- Il nome "equazione parametrica" è definito come equazione di secondo grado con i coefficienti che dipendono da un parametro. Alcuni libri usano il nome anche per quelle di primo grado; qui non serve.
- Discriminante: formula ridotta $\dfrac{\Delta}{4}$ dove $b$ è pari, come nella 17 (che la ha in un riquadro `ad-tip`, "La formula ridotta, quando b è pari"). La lezione dice che ha lo stesso segno di $\Delta$.
- Somma e prodotto indicati con $s$ e $p$, come nella 77. La 77 dice già che con $\Delta = 0$ le relazioni valgono contando due volte la soluzione doppia, quindi non l'ho ripetuto.
- "Soluzioni reali" per $k = 1$ (equazione di primo grado): nella risposta dell'esempio 2 il caso è separato ("una sola soluzione, $x = 2$"). Alcuni libri scrivono solo "$k \leq \dfrac{3}{2}$" per le soluzioni reali, altri "$k \leq \dfrac{3}{2}$ e $k \neq 1$" perché intendono due soluzioni. La risposta caso per caso evita la scelta. Da verificare con il libro in uso.
- Soluzioni opposte: condizione $b = 0$ più il controllo $\Delta \geq 0$. Con $b = 0$ e $c = 0$ l'equazione ha la sola soluzione $0$, che è opposta di se stessa: non ne parlo, perché nessun esercizio lo chiede e la lezione non dice nulla di falso.
- Il controllo di ogni valore ($a \neq 0$ e $\Delta \geq 0$) è in un riquadro `ad-tip`, perché è il passo che gli studenti saltano; la lezione dice anche quando il controllo di $\Delta$ è inutile (una soluzione nulla, una soluzione assegnata).
- Il discriminante di secondo grado in $k$: la lezione dice che servono le disequazioni di secondo grado "che studierai più avanti" senza link, perché quella lezione non è ancora scritta. Gli esempi scelti hanno tutti $\Delta$ di primo grado in $k$, oppure un quadrato (esempio 9), oppure si controlla sostituendo un numero. Quando la lezione Disequazioni di secondo grado sarà scritta, si può aggiungere il link in quella frase e un esempio "soluzioni reali" con $\Delta$ di secondo grado.
- Le condizioni sui segni delle soluzioni (entrambe positive, discordi) non ci sono: la regola di Cartesio è nella 77, e il brief non le elenca tra le condizioni tipiche della 78. Molti libri le mettono negli esercizi sulle parametriche: si può aggiungere un esempio dopo l'esempio 6, se si vuole.

## Lasciato ad altre lezioni

- Formula risolutiva, discriminante, formula ridotta: link alla 17.
- Somma e prodotto, loro dimostrazione, somma dei quadrati come espressione simmetrica: link alla 77. La lezione ricava $s^2 - 2p$ in una riga, perché serve nel procedimento.
- Discussione di $0x = c$: link alla 50.
- Disequazione di primo grado in $k$ ($3 - 2k \geq 0$): link alla 52. Equazione fratta in $k$ con la C.E. $k \neq 1$: link alla 49.
- $\sqrt{(k - 1)^2} = |k - 1|$ nell'esempio 9: link alla 72 (Radicali e loro proprietà).
- Link finale ai problemi di secondo grado (79).

## Figure

Nessuna. L'argomento non ha diagrammi a cui il testo si riferisca; il brief non ne chiede per la 78.

## Formulario e flashcard

- Il formulario ha l'equazione di esempio con i suoi coefficienti e il caso $a = 0$, la tabella del discriminante, la tabella delle condizioni (con la riga "soluzione assegnata"), la somma dei quadrati e il procedimento in cinque passi. Tre avvisi: caso $a = 0$, discriminante non controllato (con l'esempio della somma $4$), somma dei quadrati.
- 19 carte. `discriminante-ridotto-conto` e `reali-conto` usano $x^2 - 2x + k = 0$ dell'apertura (la lezione ne calcola le soluzioni per tre valori di $k$ ma non il $\dfrac{\Delta}{4}$: il conto è di una riga e usa la formula ridotta della lezione). Le altre carte usano l'equazione ricorrente e gli esempi della lezione.

## Da cambiare nelle lezioni già scritte

- 50 (Equazioni letterali): niente di obbligatorio. Se si decide di rinominare il parametro in $k$ (dubbio aperto nella nota 50), le due lezioni diventano coerenti; altrimenti va bene così, perché la 78 spiega perché usa $k$. Si può aggiungere alla fine della sezione "La discussione", dopo l'esempio 5, una frase: "Le equazioni con un parametro tornano con il secondo grado, nelle [equazioni parametriche](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-parametriche), dove si cerca il valore del parametro per cui le soluzioni hanno una proprietà data."
- 17 (Equazioni di secondo grado): nessuna modifica. Ha già la formula ridotta, che la 78 usa.

## Prerequisiti

La riga proposta `equazioni-parametriche <- equazioni-secondo-grado-relazioni, equazioni-letterali` va bene, ma la allargherei:

`equazioni-parametriche <- equazioni-secondo-grado-relazioni, equazioni-letterali, disequazioni-primo-grado, equazioni-fratte`

perché la condizione "soluzioni reali" è una disequazione di primo grado in $k$ (esempio 2: $3 - 2k \geq 0$), e le condizioni su somma e prodotto, appena $a$ dipende da $k$, danno un'equazione fratta in $k$ (esempio 6). Nessuna delle due è antenata delle altre righe: `disequazioni-primo-grado` e `equazioni-fratte` dipendono solo da `equazioni-primo-grado` e dalle frazioni algebriche, e né `equazioni-secondo-grado-relazioni` né `equazioni-letterali` le hanno tra gli antenati (da ricontrollare con `scripts/lezioni/prerequisiti.mts` quando le righe del lotto entrano nel file). Sono quattro, il massimo. Se si vuole restare a tre, toglierei `equazioni-fratte`: le equazioni fratte in $k$ dell'esempio 6 si risolvono con un passaggio, mentre la disequazione torna in ogni esercizio sulle soluzioni reali.

## Per il generatore

1. Caso $a = 0$: trovare il valore di $k$ per cui l'equazione è di primo grado e risolverla (come l'esempio 1).
2. Soluzioni reali, coincidenti, distinte con $\dfrac{\Delta}{4}$ di primo grado in $k$: disequazione in $k$, soluzione doppia, valore di $k$ da escludere perché annulla $a$ (esempio 2).
3. Soluzione assegnata: sostituire $x_0$, trovare $k$ e l'altra soluzione con il prodotto o la somma (esempio 3).
4. Soluzioni opposte, reciproche, una nulla: relazione tra i coefficienti, controllo di $a$ e $\Delta$, compresi i casi senza valori accettabili (esempi 4, 5 e 7).
5. Somma o prodotto assegnati con $a$ che dipende da $k$: equazione fratta in $k$, controllo di $\Delta$, a volte il valore si scarta (esempio 6).
6. Somma dei quadrati: equazione di secondo grado in $k$, due valori, uno da scartare con il discriminante (esempio 8).
