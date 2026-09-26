# Note: Implicazione, condizioni necessarie e sufficienti

Lezione nuova, scritta da zero (lotto 6). Tutti i conti di lezione, formulario e carte sono stati rifatti in Python (`66-verifica.py` nello scratchpad): le tavole di verità con `itertools.product` (implicazione, inversa, contraria, contronominale, doppia implicazione, $\neg p \vee q$, negazione, le tavole di $r \to q$ e $s \to p$ degli esempi 3 e 4), le equivalenze controllate su tutte le righe, le leggi di De Morgan usate negli esempi 7, 8 e 9, i valori dell'esempio 1, i controesempi degli esempi 2 e 5 (su $n$ da $0$ a $199$ e $x$ da $-50$ a $50$), gli insiemi di verità dell'esempio 6 con `set`, i primi pari fino a $100$ (solo il $2$), l'enunciato dell'esempio 8 su tutte le coppie fino a $59$ e quello dell'esempio 9 su una griglia di razionali.

## Scelte di convenzione

Da verificare con il libro in uso, come tutte le convenzioni del lotto:
- Proposizioni $p$, $q$, $r$, valori V e F, implicazione materiale $p \to q$, doppia implicazione $p \leftrightarrow q$, implicazione ed equivalenza logica $\Rightarrow$ e $\Leftrightarrow$. Un riquadro `ad-note` avvisa che alcuni libri scrivono il connettivo con $\Rightarrow$ e che alla lavagna $\Rightarrow$ si usa per "e quindi".
- "Premessa" e "conseguenza" come termini principali (l'ordine del brief), "antecedente e conseguente" citati una volta; "ipotesi" e "tesi" solo per i teoremi.
- Inversa $q \to p$, contraria $\neg p \to \neg q$, contronominale $\neg q \to \neg p$, come nel brief. È il dubbio più grosso: i libri italiani non sono d'accordo (alcuni dicono "reciproca" o "conversa" per $q \to p$ e "inversa" per $\neg p \to \neg q$). Lo dice un riquadro `ad-note`; se il libro di riferimento usa l'altra scelta si cambiano la tabella, l'esempio 2, due carte e il formulario.
- Implicazione logica $p \Rightarrow q$ definita come "$p \to q$ è una tautologia", e per enunciati con una variabile come "$p \to q$ vera per ogni valore della variabile". Equivalenza logica come in 65 (stessa colonna), con l'aggiunta "$p \leftrightarrow q$ tautologia".
- Insieme di verità $V_p = \{x \in U \mid p(x)\}$, come nella 67 (lì è definito in grassetto; qui è solo richiamato con il link).
- Per assurdo: presentato come "si suppone vera $p \wedge \neg q$", che lega il metodo alla negazione dell'implicazione.

## Lasciato ad altre lezioni

- Proposizioni, connettivi, tautologie, equivalenza, De Morgan: link a 65.
- Enunciati aperti, insieme di verità, controesempio, negazione di "per ogni": link a 67. L'esempio 2 e il punto 3 dell'esempio 7 usano enunciati "su un numero qualsiasi" prima della sezione sull'inclusione, con una frase che dice cosa vuol dire vero e falso in quel caso; il quantificatore non viene scritto.
- Inclusione e uguaglianza tra insiemi: link a 04. Quadrato, rettangolo, diagonali congruenti: link a 62. Criterio di divisibilità per $10$: link a 19. $(-3)^2 = 9$: link a Potenze in $\mathbb{Z}$.
- Niente circuiti (sono per $\wedge$ e $\vee$, nella 65), niente nomi latini (modus ponens) né altre regole di inferenza oltre agli esempi 3 e 4.

## Dubbi

- La tavola delle quattro forme ha sei colonne; le intestazioni più larghe sono $\neg p \to \neg q$ e $\neg q \to \neg p$. Sta nel limite del brief, ma va guardata a 390 px.
- L'esempio 9 usa $a$ e $b$ numeri qualsiasi e la somma membro a membro di due disuguaglianze $\le$, che le disequazioni spiegano più avanti. È un passaggio intuitivo; se sembra troppo, si toglie l'esempio e resta la definizione del metodo.
- 13 grassetti, tutti su termini definiti qui (il controllo lo segnala come avviso). Se sono troppi, toglierei quelli su "ipotesi" e "tesi".
- La lezione è lunga (circa 22 000 caratteri, 9 esempi). Se va accorciata, gli esempi 4 e 9 sono i primi candidati.

## Figure

Due, compilate con `compileFigure` e guardate in chiaro e in scuro (PNG con il filtro del sito), stesse misure della 03 e della 04 (rettangolo 6×4), 231×155 px:
- `implicazione-inclusione-insiemi-verita`: $V_p$ colorato `blue!20` dentro $V_q$, dentro $U$.
- `insiemi-verita-multipli-4-pari` (nell'esempio 6): $U = \{1, \dots, 12\}$ con 4, 8, 12 in $V_p$, 2, 6, 10 nel resto di $V_q$ e i dispari fuori.

Niente `\clip`, niente riempimenti bianchi. Nessuna figura nel formulario.

## Formulario e flashcard

- Formulario senza figure, con tre avvisi (premessa falsa, inversa, negazione).
- 20 carte, nell'ordine della lezione; tutte usano esempi o regole della lezione.

## Prerequisiti

La riga `logica-implicazione <- logica-proposizioni, sottoinsiemi-ugualianza` va bene così. Proposizioni, tavole di verità, tautologie ed equivalenza sono indispensabili (65); l'inclusione (04) serve per la sezione sugli insiemi di verità. Non aggiungerei `logica-quantificatori`: la lezione usa insieme di verità e controesempio, ma li richiama in una riga con il link a 67, e le due lezioni si possono leggere in qualunque ordine. Se invece si decide che la sezione "Implicazione e inclusione" richiede di aver già visto gli enunciati aperti, la riga diventa `logica-implicazione <- logica-quantificatori, sottoinsiemi-ugualianza` (la 65 si toglie perché ci si arriva passando per la 67). Divisibilità (19), quadrilateri (62) e potenze in $\mathbb{Z}$ sono solo esempi: non sono prerequisiti.

## Per il generatore

1. Valore di verità di un'implicazione con premessa e conseguenza numeriche ("se $12$ è pari, allora $12$ è multiplo di $5$"), compresi i casi con la premessa falsa.
2. Scrivere l'inversa, la contraria o la contronominale di un'implicazione data a parole o in simboli, e dire quali sono equivalenti all'implicazione.
3. Tavole di verità: completare la tavola di $p \to q$, $p \leftrightarrow q$ o di una proposizione con $\to$ e un altro connettivo, e dire se è una tautologia (quindi se vale un'implicazione logica).
4. Condizioni necessarie e sufficienti: date due condizioni su un numero (multipli, divisori, pari, $x^2 = a$), scegliere tra necessaria, sufficiente, necessaria e sufficiente, né l'una né l'altra, con il controesempio.
5. Insiemi di verità: in un universo finito elencare $V_p$ e $V_q$ e dire se $p(x) \Rightarrow q(x)$, $q(x) \Rightarrow p(x)$ o $p(x) \Leftrightarrow q(x)$.
6. Negare un'implicazione a parole o in simboli, anche con una conseguenza con "e" od "o" (De Morgan).
