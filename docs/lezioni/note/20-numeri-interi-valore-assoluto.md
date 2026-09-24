# Note: Numeri interi e valore assoluto

Lezione nuova, scritta da zero: non c'era un originale da rivedere.

## Scelte di convenzione

- Lo zero non è né positivo né negativo, e quindi non è né concorde né discorde con nessun numero. Mi sembra la scelta più diffusa nei libri del biennio, ma è da verificare sui libri adottati dalle classi beta.
- Opposti definiti come "stesso numero di unità, segno diverso", con l'aggiunta che l'opposto di $0$ è $0$. Non li ho definiti con il valore assoluto, che arriva dopo, per non avere una definizione circolare nell'ordine della lezione.
- Il valore assoluto è definito prima come distanza dall'origine, poi con la formula a due casi. La formula c'è perché serve più avanti (e perché $|-4| = -(-4)$ spiega l'errore "$-a$ è negativo"), ma per ora la si usa solo sui numeri.
- "Interi relativi" compare una volta tra parentesi, come nella lezione Prime definizioni, poi si usa sempre "interi".
- Ho evitato la notazione $\mathbb{Z}^+$, $\mathbb{Z}^-$, $\mathbb{Z}_0$: i libri non sono d'accordo (alcuni includono lo zero in $\mathbb{Z}^+$, altri no). Se serve, si decide e si aggiunge.
- In KaTeX $|-3|$ si vede con un po' di spazio attorno al meno ("$| - 3|$"), perché la sbarra è un simbolo ordinario. Ho lasciato la scrittura più comune; nella figura ho usato `|{-3}|`, che toglie lo spazio. Se il difetto dà fastidio sul sito, si può passare a `\lvert -3 \rvert` in tutta la lezione.

## Argomenti lasciati ad altre lezioni

- Le operazioni (addizione algebrica, regola dei segni, sottrazione come somma dell'opposto, parentesi con il meno davanti): lezione Operazioni in ℤ. Qui c'è solo $3 - 8 = -5$ come motivazione, con un link.
- Potenze con base negativa: lezione Potenze in ℤ.
- Equazioni e disequazioni con il valore assoluto (tipo $|x| = 4$, $|x| < 3$): terzo anno. La frase "gli interi con valore assoluto $4$ sono $4$ e $-4$" è l'unica cosa vicina, detta come conseguenza della distanza e non come equazione.
- Nell'esempio 4 compare $\{x \in \mathbb{Z} \mid -4 \leq x < 2\}$: la notazione è quella della lezione Rappresentazione degli insiemi, e l'esempio serve solo a far contare gli estremi.

## Figure

Due, compilate in locale con `scripts/figure/compile.mjs` e guardate in chiaro (da controllare in tema scuro sul sito): la retta orientata da $-5$ a $5$ con l'origine e le scritte "negativi" e "positivi"; la stessa retta con $-3$ e $3$ e le due frecce che mostrano $|{-3}| = |3| = 3$. Nessun riempimento, niente `\clip`.

## Da sistemare in lezioni già scritte (non toccate)

- Operazioni in ℕ (06): "Per poter sottrarre sempre si passa ai [numeri interi](.../numeri-interi/operazioni-in-z)". Il link starebbe meglio su questa lezione, che è quella che introduce ℤ e spiega perché servono i negativi.
- Confronto tra frazioni (10): la regola "fra due numeri negativi è maggiore quello più vicino a zero" è la stessa di qui; si può aggiungere un link a questa lezione.
- Operazioni in ℤ (21, scritta in parallelo in questo lotto): alla riga 9 definisce di nuovo concordi e discordi, in grassetto. Le definizioni coincidono (zero escluso), ma lì basterebbe richiamarle con un link a questa lezione, senza grassetto.
- Nessuna lezione pubblicata oggi spiega opposto, valore assoluto o confronto tra interi, quindi non c'è niente da togliere.

## Formulario e flashcard

- Il formulario riporta il procedimento di ordinamento in una riga invece dei quattro passi della lezione, e l'esempio di ordine crescente è quello dell'esempio 2.
- 18 carte. La carta `ordine-crescente` usa numeri dell'esempio 2 ridotti a quattro, per restare nel calcolo a mente.

## Livelli per gli esercizi

1. Segno e appartenenza: dire se un numero è positivo, negativo o nullo, e se appartiene a $\mathbb{N}$, a $\mathbb{Z}$ o a entrambi. Esempio: "$-3 \in \mathbb{N}$?" (no).
2. Opposto e valore assoluto di un singolo numero, anche con doppio segno. Esempio: "Calcola $-(-8)$ e $|-8|$" ($8$ e $8$).
3. Confronto tra due interi, con i tre casi (discordi, due positivi, due negativi) e lo zero. Esempio: "Metti il simbolo giusto tra $-14$ e $-9$" ($-14 < -9$).
4. Ordinare in ordine crescente o decrescente da cinque a sette interi, con negativi, zero e positivi. Esempio: "Ordina in ordine decrescente $-2, 5, -11, 0, 8$" ($8 > 5 > 0 > -2 > -11$).
5. Ordinare espressioni da calcolare prima, con opposti e valori assoluti. Esempio: "Ordina in ordine crescente $-|-3|$, $-(-7)$, $|-1|$, $-|6|$" ($-6 < -3 < 1 < 7$).
6. Interi compresi tra due estremi, con estremi inclusi o esclusi, o precedente e successivo di un negativo. Esempio: "Quanti interi ci sono tra $-6$ e $-1$, estremi esclusi?" ($4$: $-5, -4, -3, -2$).
