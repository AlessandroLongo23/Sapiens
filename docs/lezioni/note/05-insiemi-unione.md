# Note: Unione insiemistica

## Errori trovati nell'originale

- Il testo nel database è troncato: finisce a metà della frase che risolve il problema iniziale ("in una classe con 15 calciatori e 12 pallavolisti, di cui"). Il campo `chars` di `index.json` (11548) conferma che il taglio è già nel database.
- "Idempotenza (assorbimento): $A \cup A = A$": l'assorbimento è un'altra legge, $A \cup (A \cap B) = A$. Nome sbagliato.
- "Uno studente che risolve il sistema di disequazioni $x < -1$ oppure $x > 3$": un sistema chiede che le condizioni valgano insieme (intersezione), non "oppure" (unione).
- Esempio 3: "la cardinalità (nel senso della lunghezza degli intervalli) è la somma delle due": la cardinalità non è la lunghezza, e i due intervalli illimitati non hanno lunghezza finita. Inoltre l'esempio partiva da $|x| > 2$, disequazione con valore assoluto che al primo anno lo studente non conosce.
- "Il simbolo $\cup$ è stato introdotto da Giuseppe Peano" e "U iniziale di union": aneddoti non verificati e non necessari. Tolti.
- "l'unione raccoglie il massimo, l'intersezione il minimo": vago; tolto con tutta la sezione su intersezione, distributività, differenza e De Morgan, che appartengono alle lezioni sulle altre operazioni.
- Gli altri conti erano corretti: $[0, 2) \cup (1, 5] = [0, 5]$, $15 + 12 - 5 = 22$, gli esempi con $\{1, 2, 3\} \cup \{3, 4, 5\}$ e $\{a, b, c\} \cup \{b, c, d, e\}$.

## Cosa è cambiato

- Testo da 11.500 a circa 9.000 caratteri. Via l'introduzione in quattro sottosezioni, la notazione $\bigcup_{i=1}^{n}$, la sezione sulle altre operazioni (ci sono le lezioni Intersezione, Differenza, Complementare e il quadro in Operazioni e relazioni).
- La definizione usa "oppure" con la spiegazione del senso inclusivo (vel, $\vee$) in un paragrafo solo, invece di due sezioni.
- Proprietà in tabella, con "Idempotenza" al posto di "Idempotenza (assorbimento)" e con $A \cup U = U$. Aggiunto un esempio della proprietà associativa.
- Nuova sezione unione e inclusione: $A \subseteq A \cup B$ e $A \subseteq B \iff A \cup B = B$, con l'esempio "roma"/"amore".
- Cardinalità dell'unione con un esempio di verifica, il problema calcio/pallavolo completato (classe di 28, risposta 22 e 6 senza sport, con controllo sulle quattro zone) e un problema inverso (trovare $|I \cap S|$). La cardinalità rimanda a Prime definizioni, che la definisce con $|A|$.
- Gli intervalli sono ridotti a un riquadro `ad-note` con rimando a Disequazioni di primo grado; ho tenuto l'esempio $[0, 2) \cup (1, 5] = [0, 5]$ e aggiunto $(-\infty, -2) \cup (2, +\infty)$ senza il valore assoluto.
- Errori frequenti: elementi comuni scritti due volte, somma delle cardinalità senza togliere l'intersezione, "oppure" esclusivo, scambio tra $\cup$ e $\cap$.

## Dubbi da decidere

- Intervalli: se al biennio l'insieme ℝ e gli intervalli arrivano dopo, il riquadro si può togliere del tutto; il link a Disequazioni di primo grado punta a una lezione ancora vuota.
- "Unione con l'universo" non ha un nome condiviso nei libri (alcuni la chiamano "elemento assorbente" $U$): ho lasciato un nome descrittivo.
- La lezione Operazioni e relazioni (riscritta da un altro autore) avrà una sezione breve sull'unione: controllare che non contraddica questa (simboli, uso di "oppure", notazione $|A|$).

## Figure da fare

- Eulero-Venn con due insiemi sovrapposti in un rettangolo universo, tutta l'area di $A \cup B$ colorata (può riusare il blocco tikz dell'unione nella lezione 03 originale, che è corretto), dopo il primo paragrafo di "Diagramma di Eulero-Venn".
- Eulero-Venn con due insiemi disgiunti, entrambi colorati, nella stessa sezione.
- Per l'Esempio 7: diagramma con i numeri nelle zone (10 solo calcio, 5 entrambi, 7 solo pallavolo, 6 fuori dai cerchi).

## Formulario e flashcard

- Una carta (`intervalli-unione`) viene dal riquadro facoltativo sugli intervalli, che usa una notazione spiegata solo in un altro capitolo. Se lo studente arriva qui dal biennio senza averla vista, la carta si può togliere; il formulario invece non ne parla.
- Il formulario copia il diagramma dell'unione della lezione (unica figura): quello degli insiemi disgiunti non aggiunge niente alla formula.
