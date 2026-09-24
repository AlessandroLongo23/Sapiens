# Note: Conversione da numeri decimali a frazioni

## Errori trovati nell'originale

- "Ogni numero decimale può essere convertito in una frazione": falso per i decimali illimitati non periodici ($\pi$, $\sqrt{2}$). Ora la lezione dice che solo limitati e periodici sono frazioni.
- Esempio $2{,}35$: "$\frac{235 / 5}{100 / 5} = \frac{27}{20}$". Il risultato giusto è $\frac{47}{20}$ ($235 : 5 = 47$).
- Esempio $1{,}625$: "Semplifico dividendo per $\text{MCD}(625, 1000) = 125$". Il MCD da calcolare è $\text{MCD}(1625, 1000)$; il valore $125$ e il risultato $\frac{13}{8}$ sono giusti per caso.
- Regola dei periodici semplici: "Il numeratore corrisponde al decimale, scritto senza virgole". Funziona solo con parte intera $0$. L'esempio che segue lo mostra: "$1{,}\overline{45} = \frac{145}{99}$" è sbagliato, $\frac{145}{99} = 1{,}\overline{46}$. Il risultato giusto è $\frac{145 - 1}{99} = \frac{16}{11}$.
- Regola dei periodici misti: "meno la parte non periodica" non dice che la parte intera va compresa nel numero da sottrarre.
- $0{,}\overline{3} = \frac{3}{9}$ lasciato non ridotto, nonostante il passo 3 dica di semplificare.
- Negli esempi dei periodici misti c'era il punto decimale (`0.1\overline{6}`, `0.25\overline{3}`) al posto della virgola.

Gli altri conti ($0{,}75 = \frac{3}{4}$, $0{,}1\overline{6} = \frac{1}{6}$, $0{,}25\overline{3} = \frac{19}{75}$) erano corretti.

## Cosa è cambiato

- Una sola regola per la frazione generatrice, valida per semplici e misti, con la spiegazione del perché funziona (moltiplicare per potenze di 10 e sottrarre).
- Aggiunti: esempio con parte intera e antiperiodo ($2{,}3\overline{18} = \frac{51}{22}$), esempio con decimale negativo, $0{,}\overline{9} = 1$ in un riquadro di nota, il criterio dei fattori $2$ e $5$ del denominatore (con l'avvertenza di ridurre prima), la conversione inversa frazione → decimale con la divisione e il motivo per cui una frazione dà sempre un decimale limitato o periodico.
- La sezione "Verifica della conversione" è diventata un riquadro di suggerimento.
- Ho usato "decimale limitato" al posto di "finito/terminante", che è il termine più diffuso nei libri italiani.

## Dubbi da decidere

- Il titolo dice "da numeri decimali a frazioni" ma la lezione ora copre anche il verso opposto e il criterio del denominatore. Se si preferisce tenerla stretta al titolo, quelle due sezioni potrebbero andare in "Operazioni in ℚ"; in alternativa si può cambiare il titolo in "Numeri decimali e frazioni".
- La regola "semplice se non ci sono né 2 né 5, misto se ci sono insieme ad altri fattori" è corretta ma non tutti i libri del biennio la danno; si può togliere se appesantisce.
- Il riferimento a $\pi$ come numero non razionale anticipa i numeri reali: le lezioni del capitolo ℝ non hanno ancora testo, quindi non c'è un link.

## Formulario e flashcard

- Il criterio del denominatore, che nella lezione è un elenco, nel formulario è una tabella a tre righe (limitato, periodico semplice, periodico misto). Se si decide di togliere dalla lezione la distinzione semplice/misto, vanno cambiati anche la tabella e la carta `criterio-misto`.
- La divisione in colonna (da frazione a decimale) non ha carte: è un conto con carta e penna, adatto ai generatori di esercizi.
