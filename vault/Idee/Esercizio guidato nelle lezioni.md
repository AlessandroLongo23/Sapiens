---
stato: decisa
aggiornato: 2026-10-06
tag: [idea, lezioni, esercizi]
---
# Esercizio guidato nelle lezioni

Decisa il 6 ottobre 2026: vedi [[2026-10-06 Le lezioni hanno un esercizio guidato, con fermate non fisse]].

## L'idea
Alessandro, 5 ottobre 2026. Dentro la lezione, oltre alla teoria e agli esempi svolti, un esercizio guidato: uno svolgimento curato, spiegato passo per passo, in cui a un certo punto lo studente deve fare qualcosa e confermare prima di andare avanti. Scrivere una funzione, inserire un risultato, cambiare un parametro su un grafico e confermare. La lezione dà un riscontro e diventa un po' più impegnativa: lo studente non si limita a leggere o a muovere dei cursori.

Serve da passaggio tra lezione ed esercizi, che oggi manca: chi legge la lezione arriva agli esercizi con la teoria e pochi esempi svolti. La sequenza che Alessandro ha in mente è teoria, pratica svolta, pratica guidata con le parti in cui si risponde e si conferma, poi gli esercizi. La spiegazione è quella che oggi si vede dopo una risposta sbagliata, ma su esempi scelti e curati, dove ogni passaggio è insegnato e non solo elencato.

## Perché potrebbe valere
È il pezzo che manca tra "ho letto" e "so fare". Gli esempi svolti si leggono senza accorgersi di non aver capito; un passaggio da completare lo fa vedere subito, dentro la lezione e prima della prova.

## Cosa c'è già nel codice (Claude, 5 ottobre 2026)
- Il correttore della risposta aperta legge un numero, un insieme o un'espressione scritti con MathLive (`src/lib/exercises/v2/grade/`).
- Nelle lezioni un blocco può già avere una verifica: il blocco `codice` con "Verifica" e il `diagramma` da costruire.
- Il blocco `grafico` ha cursori e valori calcolati, senza una risposta da confermare.
- I generatori scrivono i passaggi di ogni esercizio, in righe brevi.

## Proposte dal lotto del terzo anno
Appunti di Claude dai messaggi dei sette gruppi che hanno scritto le lezioni 105-129 (5 ottobre 2026), in forma abbreviata: per ogni lezione l'esempio svolto più adatto e, tra parentesi, le fermate in cui lo studente risponde e conferma. Vedi [[2026-10-05 Terzo anno di matematica]].

- **Funzioni (105-109).** 105 es.7; 106 es.3; 107 es.2; 108 es.2 (riportare 3 e -4,5); 109 es.5 (punto (4,2) passo per passo)
- **Successioni (110-113).** 110 es.7 (a_{n+1}; differenza 2n-5; cursore n). 111 es.8 multipli di 7 (105,294; 28 termini; somma). 112 es.4 (q²=4; due ragioni; a_1). 113 es.2 somma dispari (base; termine 2k+1; (k+1)²)
- **Circonferenza e parabola (114-117).** 114 es.2 (α,β; α²+β²-c; cursore c fino a 13). 115 es.4 (fascio implicito; 3m²+10m+3=0; cursore m). 116 es.4 (concavità; vertice; direttrice). 117 es.4 (risolvente; eq in m; cursore m)
- **Ellisse e iperbole (118-120).** 118 es.6 tangenti da P (fascio; cursore m; risolvi 4m²+3m-1=0). 119 es.4 (prevedi q; Δ=25; classifica). 120 es.5 (asintoti; intersezione e simmetrico; scegli grafico)
- **Esponenziali (121-123).** 121 es.4 (cursore k asintoto; ordinata; zero). 122 es.10 (eq in t; quali t tenere; x). 123 es.10 (interni/esterni; impossibile/sempre/da risolvere; estremo e verso)
- **Logaritmi (124-127).** 124 es.1 log_4 8; 125 es.7 (cursore h asintoto; zero; intersezione y); 126 es.5 (C.E. prima; radici; quale scartare); 127 es.4 (verso; doppia disequazione; grafico del sistema)
- **Statistica bivariata (128-129).** 129 es.1 scarpe (prodotto riga negativa; dividere per varianza non sigma, m=0,3; cursore q fino a G, q=-11, stima 174). 128 es.5 (totali 30,16,50; teorica 9,6 non arrotondare; contingenza 5,4 e significato)

## Dubbi e conflitti
- Tocca [[2026-09-30 Ogni lezione ha una pagina di esercizi svolti, fatta dai suoi generatori]]: lì gli esercizi svolti stanno in una pagina a parte, vengono dai generatori e si leggono; qui stanno dentro la lezione, sono scritti a mano e chiedono una risposta. Le due cose possono convivere (guidato nella lezione, svolti per tipologia nella pagina a parte), ma va deciso se la pagina a parte serve ancora.
- Vicina a [[Tipi di esercizio sui passaggi]] (completa il passaggio che manca), che però vive nel percorso degli esercizi.
- La lezione è gratuita e indicizzata: l'esercizio guidato funziona senza accesso, quindi la risposta si corregge nel browser o su una rotta pubblica, e non entra nei progressi. Da decidere se un utente iscritto se lo vede segnato come fatto.
- Scritto a mano per ogni lezione: per 129 lezioni di matematica è un lotto di lavoro a sé, e ogni risposta attesa va verificata come i conti degli esempi.
- Senza JavaScript e in stampa deve restare un esempio svolto leggibile.

## Collegamenti
- [[Lezioni]], [[Esercizi]], [[Pipeline lezioni]], [[Standard di qualità]], [[Piano cartesiano nelle lezioni]]
- [[Esercizi con i grafici]], [[Video di spiegazione e di esercizi svolti]]
