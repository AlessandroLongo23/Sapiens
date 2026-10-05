# inf-espressioni: Operatori ed espressioni

Lezione: `docs/lezioni/informatica/riscritte/54-inf-espressioni.md`. Segue il generatore di riferimento
`inf-ciclo-while`, con gli aiuti di `inf-primi.ts`.

I programmi mostrati o chiesti (livelli 1, 2, 3, 5, 6) sono sequenze con soli numeri interi non negativi, `+ - *`,
`//` e `%`: così diagramma, Python e C++ scrivono la stessa cosa. La divisione `/`, i decimali e le potenze danno
risultati diversi nei due linguaggi: stanno solo nel livello 4, a scelta multipla con opzioni di testo, dove
l'istruzione è scritta a mano nel testo della domanda e la domanda dice di quale linguaggio parla.

Distrattori, dai riquadri della lezione: la moltiplicazione fatta dopo l'addizione; le parentesi dimenticate; il
quoziente scambiato con il resto; il risultato con la virgola al posto del quoziente; `7 / 2` che in C++ fa 3;
`4.0` e `4`; la potenza presa per un prodotto.

## Livelli

1. **L'ordine dei calcoli.** Due variabili e un numero, due operazioni; sette forme, tre con le parentesi.
   L'altro raggruppamento dà un altro valore. Esempio: `base = 5`, `altezza = 3`, `2 * base + altezza` → 13
   (distrattore 16).
2. **Quoziente o resto.** Una divisione intera con resto diverso da zero e dal quoziente; il quoziente o il resto,
   metà e metà. Esempio: `caramelle = 17`, `amici = 5`, `caramelle % amici` → 2 (distrattori 3, 3.4, 4).
3. **Spezzare un numero in parti.** Le cifre di un numero di due cifre (4 su 10: la somma, o il numero rovesciato)
   oppure un totale diviso per 6, 7, 12, 60, 100 con quoziente e resto su due righe.
   Esempio: `minuti = 135`, `ore = minuti // 60`, `resto = minuti % 60` → "2, 15".
4. **La divisione in Python e in C++.** Testo. Sette casi, un settimo ciascuno: in Python `/` con risultato non
   intero (3.5), `/` esatta (4.0), `//` (3), `**` (8); in C++ `/` tra interi (3), con `.0` non esatta (3.5), con
   `.0` esatta (4). Divisori 2, 4, 5, per avere al più due cifre dopo il punto.
   Esempio: "In C++, che cosa stampa «cout << 7 / 2 << endl;»?" → 3.
5. **Costruire il diagramma di un conto.** Cinque famiglie: `parti` (un terzo: ore e minuti, scatole e avanzo),
   `cifre`, `perimetro`, `resto` (pagato − prezzo · k), `sconto` ((prezzo − sconto) · k). Risposta aperta: il
   diagramma, eseguito su due o tre prove. A scelta multipla: quattro diagrammi.
6. **Scrivere il programma di un conto.** Le stesse famiglie. Risposta aperta: il programma, che parte dalle
   letture. A scelta multipla: quattro programmi.

## Da evitare

`//` e `%` con numeri negativi; `/` e decimali fuori dal livello 4; divisioni con più di due cifre dopo il punto
(Python ne stampa 16, C++ 6); potenze grandi (C++ le scrive in notazione scientifica); `^`.
