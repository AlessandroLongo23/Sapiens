# Note: Equazioni di primo grado

## Errori nell'originale

- "$a$ e $b$ sono numeri reali (cioè numeri che possono essere positivi, negativi o zero)": la spiegazione tra parentesi descrive i numeri relativi, non i reali. Nella riscrittura $a$ e $b$ sono solo "numeri".
- La definizione ("una sola variabile elevata al massimo alla prima potenza") guarda il testo dell'equazione e non la forma normale: $x^2 + 3x = x^2 + 5$ è di primo grado. Ho aggiunto questo caso.
- La forma generale imponeva $a \neq 0$, e poi la sezione "Tipi di soluzione" presentava equazioni impossibili e indeterminate, che hanno proprio $a = 0$. Non era spiegato come i due punti stanno insieme; ora c'è la tabella su $ax = b$ con i tre casi.
- Il procedimento diceva "dividi per il coefficiente di $x$" senza il caso in cui il coefficiente è $0$.
- Nessun conto sbagliato negli esempi (verificati tutti).
- Formato: titoli numerati e con le maiuscole, `---` tra le sezioni, emoji (✅, 📌), grassetto per enfasi, riepilogo che ripeteva il procedimento.

## Cosa è cambiato

- Aggiunti i principi di equivalenza, con le regole che ne derivano (trasporto e cancellazione dal primo; divisione per il coefficiente, cambio di segno ed eliminazione dei denominatori dal secondo) e un ad-note sul perché non si moltiplica per zero.
- Procedimento in sei passi, con la verifica come ultimo passo.
- Otto esempi: tre dell'originale (uno solo trasporto, incognita nei due membri) più coefficiente negativo, parentesi con meno davanti e soluzione $\frac{13}{3}$, frazioni con il MCM e verifica completa, impossibile, indeterminata, problema (quaderni e penna, con la virgola decimale). Tutti verificati con SymPy.
- Errori frequenti nuovi: trasporto senza cambio di segno, trasporto del coefficiente, meno davanti alla frazione, termini interi dimenticati nel MCM, $x = 0$ confusa con l'equazione impossibile.
- Tolti "Obiettivo", "Consigli utili" e "Riassunto", che ripetevano il resto.

## Dubbi da decidere

- Forma normale: ho usato $ax = b$ e citato $ax + b = 0$. I libri si dividono; va scelta una convenzione per tutto il capitolo (la lezione sulle disequazioni la userà).
- Equazione indeterminata: ho scritto $S = \mathbb{R}$, con un ad-note che dice che molti libri del primo anno scrivono $S = \mathbb{Q}$. Da decidere quale insieme usare come principale.
- "Indeterminata" e "identità" presentati come sinonimi; alcuni testi riservano "identità" alle uguaglianze vere per ogni valore delle lettere in generale. Da verificare sui libri adottati.
- Il paragrafo sui problemi è breve. Se nascerà una lezione dedicata ai problemi di primo grado, qui resta un solo esempio con il link.
- Non ho trattato le equazioni fratte (incognita al denominatore) né le letterali: non hanno una lezione nell'elenco, e servirebbe decidere dove metterle.

## Figure

Nessuna figura necessaria. Facoltativa: una bilancia in equilibrio per illustrare il primo principio.

## Formulario e flashcard

- Formulario e carte scrivono $S = \mathbb{R}$ per l'equazione indeterminata e "identità" come sinonimo, come la lezione. Se si sceglie $S = \mathbb{Q}$, vanno cambiati la tabella del formulario e la carta `equazione-indeterminata`.
- La lezione non tratta equazioni fratte e letterali, quindi non ci sono nemmeno qui.
