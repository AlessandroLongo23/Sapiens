# Note: Progressioni geometriche

Lezione nuova (lotto del terzo anno, gruppo B). Conti rifatti con SymPy (`gruppo-b/verifica.py` nello scratchpad): i nove esempi, la tabella dei comportamenti, le radici reali di $q^3 = 27$ e $q^4 = 81$, la formula della somma, $2^{64} - 1$, $1000 \cdot 1{,}03^5$, le somme parziali $1 - \frac{1}{2^n}$.

## Scelte

- Definizione con termini diversi da zero e $q \neq 0$: così il rapporto $\frac{a_{n+1}}{a_n}$ esiste sempre.
- Monotonia in una tabella ($q > 1$, $q = 1$, $0 < q < 1$, per i due segni di $a_1$), giustificata con $a_{n+1} - a_n = a_n(q - 1)$; $q < 0$ a parte, "a segni alterni, non monotona".
- Termine generale $a_n = a_1 \cdot q^{n-1}$; tra due termini $a_n = a_k \cdot q^{n-k}$, con i due casi dell'esponente dispari (una ragione) e pari (due ragioni, o nessuna se la potenza è negativa).
- Il posto di un termine si trova solo quando il numero è una potenza esatta della ragione; per il caso generale c'è il link a "Equazioni esponenziali" (gruppo E).
- Somma: $S_n = a_1 \frac{q^n - 1}{q - 1}$, dimostrata moltiplicando per $q$ e sottraendo; la forma con $1 - q^n$ per $q < 1$; il caso $q = 1$ in un avviso.
- "Media geometrica" definita qui ($\sqrt{ab}$ per numeri positivi): nel biennio c'è solo "medio proporzionale" nella 103.
- Interesse composto con $C_0$ e $C_n = C_0(1 + i)^n$: l'indice parte da $0$, e l'avviso lo dice. Arrotondamento al centesimo.
- La serie geometrica infinita è in un `ad-note` finale ("Sommare infiniti termini"), con la figura del quadrato: dice che le somme "si avvicinano sempre di più" a $\frac{a_1}{1 - q}$ quando la ragione è tra $-1$ e $1$, senza la parola limite e senza la parola serie, e rimanda al quinto anno. L'esempio dei decimali periodici non c'è.
- Lasciato fuori: il prodotto dei primi $n$ termini, $P_n = \sqrt{(a_1 a_n)^n}$, che alcuni libri danno.

## Confini

- Con la 121 (funzione esponenziale): una frase dice che per $q > 0$ i punti stanno sul grafico di una funzione esponenziale, con il link.
- Con la 111: la struttura è la stessa, e la lezione lo dice (addizione che diventa moltiplicazione).

## Figure e piano

- `progressioni-geometriche-tre-ragioni`: tre grafici, $q = 2$, $q = \frac{1}{2}$, $q = -\frac{1}{2}$, cinque punti ciascuno.
- `somma-meta-un-quarto-un-ottavo-quadrato`: dentro l'`ad-note` finale; rettangoli di area $\frac{1}{2}, \frac{1}{4}, \dots, \frac{1}{64}$, controllati uno per uno.
- Blocco `grafico` `progressione-geometrica-cursore-ragione`: sei punti $(n, q^{n-1})$ con $a_1 = 1$ fisso e il cursore $q$ da $-1{,}5$ a $1{,}6$, `forma: 3:2`. Guardato nella pagina di prova a 420 px, in chiaro e in scuro, anche con $q = -0{,}7$. Limiti: con $q$ tra $-1$ e $1$ i punti sono piccoli rispetto alla scala; il cursore passa per $q = 0$, dove i punti sull'asse non sono una progressione geometrica: lo dice la `domanda:`.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Tre, più una figura nuova.

- `progressione-geometrica-cursore-ragione` (c'era): domanda cambiata, ora chiede il caso $q = 1$ e dice che $q = 0$ non dà una progressione; sotto il piano un paragrafo dà le risposte, compreso $q = -1$.
- `interesse-composto-cursore-tasso` (nuovo), dopo l'avviso "Le percentuali non si sommano", con la figura nuova `interesse-composto-e-percentuali-sommate` come copertina: il capitale di $100$ euro in sei anni, punti dell'interesse composto e retta tratteggiata delle percentuali sommate, cursore $i$ da $0$ a $0{,}3$ (parte da $0{,}2$), valori $C_6$ e $100(1 + 6i)$. Domanda: di quanto il capitale supera le percentuali sommate dopo sei anni con $i = 0{,}2$, e che cosa resta con $i = 0$. Il paragrafo dopo risponde ($298{,}60$ contro $220$; con $i = 0$ tutto fermo a $100$).
- `somme-parziali-geometriche-cursore-ragione` (nuovo), dentro l'`ad-note` "Sommare infiniti termini", dopo la figura del quadrato: le prime otto somme con $a_1 = \frac{1}{2}$, la retta tratteggiata a quota $\frac{a_1}{1 - q}$, cursore $q$ da $-0{,}9$ a $0{,}9$ (parte da $0{,}5$, lo stato della figura). Domanda: a quale numero si avvicinano le somme con $q = -0{,}5$, e se con $q = 0{,}8$ ci arrivano più in fretta o più lentamente. Il cursore si ferma a $\pm 0{,}9$ perché oltre la retta non avrebbe più significato, e il blocco non sa nasconderla. Sempre senza le parole limite e serie.

Guardati a 390 px ai valori iniziali, agli estremi e nei casi limite ($q = 1$, $q = -1$, $i = 0$); la figura nuova in chiaro e in scuro. La lezione è passata da 18.784 a 23.416 caratteri.

## Domande per Andrea

- La serie geometrica nel riquadro finale: va bene a questo livello, o è meglio toglierla del tutto e lasciarla al quinto anno?
- Volete il prodotto dei primi $n$ termini?
- Interesse composto: tenerlo qui o è materia di un'altra disciplina? E il capitale iniziale $C_0$ con indice $0$ crea confusione con le successioni che partono da $a_1$?
- "Media geometrica" o "medio proporzionale" per $\sqrt{ab}$?

## Da verificare

- I due link verso lezioni di altri gruppi (121 e 122) funzionano solo se quelle lezioni si pubblicano insieme.
- Il blocco `grafico` su un telefono vero.

Prerequisiti proposti: progressioni-aritmetiche, numeri-razionali-potenze, numeri-razionali-proporzioni
