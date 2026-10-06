---
stato: decisa
aggiornato: 2026-10-06
tag: [idea, esercizi, flashcard, matematica]
---
# Esercizi con i grafici

Decisa il 6 ottobre 2026: vedi [[2026-10-06 Gli esercizi mostrano grafici, dalla funzione al grafico e dal grafico alla funzione]].

## L'idea
Alessandro, 5 ottobre 2026, mentre si chiudeva il terzo anno di matematica. Lo studente si deve abituare ad andare nelle due direzioni: dal grafico alla funzione e dalla funzione al grafico. Un esercizio mostra una funzione, per esempio $3^x$, e chiede quale sia il suo grafico tra tre o quattro: una curva crescente, la retta costante di $1^x$, una curva decrescente. L'altro verso mostra un grafico e chiede la funzione. Lo stesso vale per le flashcard: una carta può avere un grafico sulla domanda o sulla risposta.

## Perché potrebbe valere
Dal terzo anno la matematica prepara lo studio di funzione, e oggi nessun esercizio di matematica mostra un grafico: funzioni, coniche ed esponenziali lavorano solo su testo, formule e punti (vedi "Limiti" in [[2026-10-05 Terzo anno di matematica]]). Leggere un grafico è la prima cosa che una verifica chiede e l'ultima che gli esercizi allenano.

## Cosa c'è già nel codice (Claude, 5 ottobre 2026)
- Un esercizio può avere una scena sotto il problema, descritta dai dati e disegnata nel browser (`SceneRef` in `src/lib/exercises/v2/types.ts`, le scene di fisica in `src/components/content/exercises/scenes/`).
- Un'opzione può essere un diagramma di flusso, un programma o un disegno già compilato (`ChoiceOption`), non ancora una scena.
- Il piano del plotter campiona funzioni, curve implicite e regioni (`src/lib/grafico/curva.ts`).
- Le flashcard sono solo testo e formule (`docs/lezioni/stile.md`, `src/lib/content/flashcards.ts`).

Mancano: una scena "piano" che disegna una o più curve da una formula, senza interazione; la scena come opzione di una scelta multipla, con quattro grafici piccoli che stanno su un telefono; una figura nelle flashcard.

## Proposte dal lotto del terzo anno
Appunti di Claude dai messaggi dei sette gruppi che hanno scritto le lezioni 105-129 (5 ottobre 2026), in forma abbreviata: per ogni capitolo gli esercizi nelle due direzioni e, tra parentesi, l'errore che i grafici sbagliati rappresentano. Vedi [[2026-10-05 Terzo anno di matematica]].

- **Funzioni (105-109).** 105 sqrt(x²-4) (un ramo, arco interno, ±4); V con zeri -1,3. 106 grafico→parità (simmetria x=1), x³-3x, completamento. 107 grafico→intervalli (ordinate, scambiati, positività). 108 grafico→periodo (multiplo, mezza onda), f(2x). 109 sqrt(x+3)-2 (partenza sbagliata), V rovesciata, |f| vs f(|x|)
- **Successioni (110-113).** 110 6/n (curva continua, retta, da a_0); grafico→comportamento; (-1)^n n. 111 punti→formula (a_1+nd, segno d); 112 a_1=-1,q=2; grafico→q=-1/2; aritmetica vs geometrica. 113 cornice a L
- **Circonferenza e parabola (114-117).** 114 eq→grafico (segni, non dimezzati, raggio sqrt(c)); grafico→eq. 115 d=r quale disegno; tangente tra 4 rette; due circonferenze. 116 x=-y²+2y+3; fuoco/direttrice→eq. 117 tangente tra 4 rette; quante tangenti; segmento/rettangolo/triangolo
- **Ellisse e iperbole (118-120).** 118 eq→grafico (assi scambiati, denominatori come semiassi), grafico→eq, fuochi sul grafico; 119 eq→grafico (-1 ignorato, pendenza invertita), tangente tra 4 rette; 120 xy=-4 (quadranti), omografica asintoti (segni)
- **Esponenziali (121-123).** 121 (1/2)^x (2^x, -2^x, retta), 2^x-3 (orizzontale, segno, asintoto), grafico→base. 122 quante soluzioni dal grafico; 2^x=3-x quale figura. 123 (1/2)^x>4 zona; 2^x>-3
- **Logaritmi (124-127).** 124 log_2(4x) vs log_2 x; 125 log_{1/2} x (crescente, (1/2)^x, log_2(-x)), grafico→funzione, traslata (asintoto x=4, orizzontale); 126 quale grafico mostra le soluzioni (ramo in più); 127 striscia di log_{1/2} x > -1
- **Statistica bivariata (128-129).** 129 dati→diagramma (assi scambiati, coord invertite, spezzata); diagramma→r (-0,9 vs 0,9, -0,2, -9); r→nuvola; diagramma→retta (non per G, primo-ultimo punto, x su y). 128 tabella→barre 100% (su n, per colonna, assolute); barre→indipendenza

## Dubbi e conflitti
- Nessun conflitto con le decisioni. Segue [[2026-10-01 Il piano cartesiano lo disegniamo noi sul kit, senza librerie di grafici]] e [[2026-09-29 Le figure di fisica sono TikZ, le interattive e quelle degli esercizi si disegnano con il kit]].
- I grafici sbagliati devono rappresentare errori veri (base scambiata, simmetria sbagliata, traslazione dal lato opposto), come i distrattori: vanno verificati dal controllo Python.
- Quattro grafici come opzioni su 390 px: griglia due per due, assi senza numeri fitti, le differenze devono vedersi in piccolo.
- A risposta aperta "dal grafico alla funzione" chiede di scrivere una formula: la legge il correttore solo per le funzioni che conosce (oggi non i logaritmi).
- I progressi delle flashcard sono attaccati all'id della carta: aggiungere carte è libero, cambiare quelle pubblicate no.

## Collegamenti
- [[Esercizi]], [[Flashcard]], [[Pipeline esercizi]], [[Grafico di funzioni]], [[Piano cartesiano nelle lezioni]]
- [[Esercizio guidato nelle lezioni]], [[Grafici e simulazioni interattive]]
