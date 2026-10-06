# Condizioni e funzioni logiche

Il registro elettronico scrive "insufficiente" accanto a una media del $5{,}5$ e "sufficiente" accanto a un $6$, senza che nessuno glielo dica voto per voto. Dietro c'è una formula che controlla una condizione e sceglie che cosa mostrare. Con le funzioni logiche un foglio di calcolo smette di fare solo conti e comincia a prendere decisioni: a ogni riga dà una risposta diversa, a seconda dei dati che ci trova.

Qui servono le formule e i riferimenti delle lezioni [Celle, valori e formule](/materiale/scuola-superiore/informatica/il-foglio-di-calcolo/celle-valori-e-formule) e [Riferimenti relativi e assoluti](/materiale/scuola-superiore/informatica/il-foglio-di-calcolo/riferimenti-relativi-e-assoluti), e gli intervalli come `B2:B7` della lezione [Le funzioni del foglio di calcolo](/materiale/scuola-superiore/informatica/il-foglio-di-calcolo/le-funzioni-del-foglio-di-calcolo).

## Confronti e valori logici

Una **condizione** è un confronto tra due valori, che può essere vero oppure falso. Si scrive con uno dei sei **operatori di confronto**:

| Operatore | Significato | Esempio | Con `A1` uguale a 7 |
|---|---|---|---|
| `=` | uguale a | `=A1=7` | VERO |
| `<>` | diverso da | `=A1<>7` | FALSO |
| `<` | minore di | `=A1<7` | FALSO |
| `<=` | minore o uguale a | `=A1<=7` | VERO |
| `>` | maggiore di | `=A1>6` | VERO |
| `>=` | maggiore o uguale a | `=A1>=8` | FALSO |

Il risultato di un confronto è un **valore logico**: nella cella compare la parola VERO oppure la parola FALSO. I valori logici sono solo questi due. Nella formula `=A1=7` il primo `=` dice al foglio che comincia una formula, il secondo è l'operatore di confronto.

```ad-warning
I simboli della tastiera non sono quelli del quaderno
Sulla tastiera non ci sono $\leq$, $\geq$ e $\neq$: si scrivono `<=`, `>=` e `<>`, con i due caratteri in quest'ordine. Scrivere `=<` oppure `=>` dà un errore.
```

## La funzione SE

La funzione **SE** sceglie tra due risultati in base a una condizione. Ha tre argomenti, separati dal punto e virgola:

`=SE(condizione;valore_se_vero;valore_se_falso)`

Il foglio la calcola così:

1. calcola la condizione, che vale VERO oppure FALSO;
2. se vale VERO, il risultato è il secondo argomento;
3. se vale FALSO, il risultato è il terzo argomento.

Il secondo e il terzo argomento possono essere numeri, formule oppure testi. Un testo dentro una formula va sempre tra virgolette: `"sufficiente"`.

```ad-example
Esempio 1: sufficiente o insufficiente
La colonna `B` contiene le medie di quattro studenti. Nella colonna `C` si vuole il giudizio.

|   | A | B | C |
|---|---|---|---|
| 1 | Studente | Media | Esito |
| 2 | Anna | 7,5 | |
| 3 | Bruno | 5,5 | |
| 4 | Carla | 6 | |
| 5 | Dario | 9 | |

Nella cella `C2` si scrive `=SE(B2>=6;"sufficiente";"insufficiente")`. La condizione `B2>=6` confronta $7{,}5$ con $6$: è vera, quindi in `C2` compare sufficiente.

La formula si copia poi nelle celle da `C3` a `C5`. Il riferimento `B2` è relativo e diventa `B3`, `B4`, `B5`: ogni riga controlla la sua media. In `C3` la condizione è falsa ($5{,}5$ non è maggiore o uguale a $6$) e compare insufficiente. In `C4` la media è proprio $6$: la condizione `B4>=6` è vera, perché `>=` accetta anche l'uguale, e compare sufficiente. In `C5` compare sufficiente.
```

```ad-warning
Il valore sulla soglia
Con `>` al posto di `>=` la formula dell'esempio 1 darebbe insufficiente a Carla, che ha esattamente $6$. Prima di scrivere una condizione chiediti da che parte deve stare il valore di confine.
```

```ad-example
Esempio 2: un risultato numerico
Un negozio fa lo sconto del $10\%$ a chi spende almeno $50$ euro. La spesa è nella cella `B2`, e in `C2` si vuole l'importo da pagare.

La formula è `=SE(B2>=50;B2*0,9;B2)`: se la condizione è vera il risultato è la spesa moltiplicata per $0{,}9$, altrimenti è la spesa così com'è.

Con una spesa di $80$ euro la condizione è vera e si pagano $80 \cdot 0{,}9 = 72$ euro. Con una spesa di $45$ euro la condizione è falsa e si pagano $45$ euro.
```

```ad-warning
Le virgolette servono ai testi, non ai numeri
`=SE(B2>=6;sufficiente;insufficiente)` dà un errore: senza virgolette il foglio cerca una cella o una funzione che si chiami sufficiente. Al contrario, un numero tra virgolette diventa un testo: con `"10"` il foglio non fa più i conti.
```

## Più di due casi: i SE annidati

Con un solo SE i casi sono due. Per averne tre si mette un secondo SE al posto del terzo argomento del primo: si dice che i due SE sono **annidati**, cioè uno dentro l'altro.

`=SE(B2>=8;"ottimo";SE(B2>=6;"sufficiente";"insufficiente"))`

Il foglio controlla la prima condizione. Se è vera si ferma e scrive ottimo; se è falsa passa al secondo SE, che decide tra gli altri due casi.

```tikz
% nome: se-annidati-fasce
% alt: Schema di due SE annidati: la prima condizione B2>=8, se vera, porta a ottimo; se falsa porta alla seconda condizione B2>=6, che se vera porta a sufficiente e se falsa a insufficiente
% svg: se-annidati-fasce-901ddee0.svg 237x152
\begin{tikzpicture}[font=\small]
\tikzset{cond/.style={draw, thick, fill=blue!10, rounded corners=3pt, minimum width=1.8cm, minimum height=0.7cm}, esito/.style={draw, thick, fill=orange!25, minimum width=1.8cm, minimum height=0.7cm}}
\node[cond] (c1) at (0,0) {\texttt{B2>=8}};
\node[esito] (e1) at (-1.7,-1.6) {ottimo};
\node[cond] (c2) at (1.4,-1.6) {\texttt{B2>=6}};
\node[esito] (e2) at (0,-3.2) {sufficiente};
\node[esito] (e3) at (2.6,-3.2) {insufficiente};
\draw[-{Stealth}, thick] (c1) -- node[left, xshift=-3pt] {VERO} (e1);
\draw[-{Stealth}, thick] (c1) -- node[right, xshift=3pt] {FALSO} (c2);
\draw[-{Stealth}, thick] (c2) -- node[left, xshift=-3pt] {VERO} (e2);
\draw[-{Stealth}, thick] (c2) -- node[right, xshift=3pt] {FALSO} (e3);
\end{tikzpicture}
```

```ad-example
Esempio 3: tre fasce di voto
Con le medie dell'esempio 1, la formula con i due SE annidati dà:

- Anna, $7{,}5$: `B2>=8` è falsa, si passa al secondo SE; `B2>=6` è vera: sufficiente.
- Bruno, $5{,}5$: tutte e due le condizioni sono false: insufficiente.
- Carla, $6$: la prima è falsa, la seconda è vera: sufficiente.
- Dario, $9$: la prima è vera, il foglio si ferma subito: ottimo.

Quando il foglio arriva al secondo SE sa già che la media è minore di $8$: per questo la seconda condizione controlla solo `B2>=6`.
```

```ad-warning
L'ordine delle soglie
`=SE(B2>=6;"sufficiente";SE(B2>=8;"ottimo";"insufficiente"))` non scrive mai ottimo. Con un $9$ la prima condizione, `B2>=6`, è già vera e il foglio si ferma a sufficiente. Le soglie vanno messe in ordine: dalla più alta alla più bassa con `>=`, dalla più bassa alla più alta con `<`.
```

Lo schema qui sotto fa le stesse due domande della formula e si può eseguire. È un diagramma di flusso: si legge dall'alto seguendo le frecce, ogni rombo è una condizione, e da ogni rombo si esce dal ramo "sì" o dal ramo "no". Premi "Passo" per avanzare un blocco alla volta con la media di Anna, $7{,}5$, che al blocco "leggi" trovi già scritta con il punto e confermi con "Invio"; poi prova $9$, $6$ e $5{,}5$. Con "Modifica" puoi scambiare le due soglie, scrivendo $6$ nel primo rombo e $8$ nel secondo: con $9$ lo schema si ferma al primo rombo e non arriva più alla seconda domanda, come dice l'avviso qui sopra.

```diagramma
% nome: se-annidati-fasce-da-eseguire
% alt: Diagramma di flusso di due SE annidati: si legge B2; un primo rombo chiede se B2 è maggiore o uguale a 8 e il suo ramo sì scrive "ottimo"; nel ramo no un secondo rombo chiede se B2 è maggiore o uguale a 6, con il ramo sì che scrive "sufficiente" e il ramo no che scrive "insufficiente"
% ingresso: 7.5
% codice: no
leggi B2
se B2 >= 8
    scrivi "ottimo"
altrimenti
    se B2 >= 6
        scrivi "sufficiente"
    altrimenti
        scrivi "insufficiente"
```

```ad-tip
Contare le parentesi
Ogni SE apre una parentesi e la deve chiudere: una formula con due SE finisce con due parentesi chiuse, `))`.
```

## E, O, NON: più condizioni insieme

Tre funzioni combinano i valori logici, e il loro risultato è di nuovo VERO o FALSO:

- **E** dà VERO solo se tutte le condizioni sono vere: `=E(B2>=6;C2>=6)`;
- **O** dà VERO se almeno una condizione è vera: `=O(B2>=6;C2>=6)`;
- **NON** rovescia un valore logico: `=NON(B2>=6)` dà VERO quando `B2>=6` è falsa.

| Prima condizione | Seconda condizione | E | O |
|---|---|---|---|
| VERO | VERO | VERO | VERO |
| VERO | FALSO | FALSO | VERO |
| FALSO | VERO | FALSO | VERO |
| FALSO | FALSO | FALSO | FALSO |

Sono la congiunzione, la disgiunzione e la negazione che in matematica si studiano nella lezione [Proposizioni e connettivi logici](/materiale/scuola-superiore/matematica/insiemi-e-logica/proposizioni-e-connettivi-logici). Di solito queste funzioni si usano come condizione di un SE.

```ad-example
Esempio 4: scritto e orale
Per superare un esame servono almeno $6$ sia allo scritto sia all'orale.

|   | A | B | C | D |
|---|---|---|---|---|
| 1 | Studente | Scritto | Orale | Esito |
| 2 | Anna | 7 | 5 | |
| 3 | Bruno | 6 | 6 | |
| 4 | Carla | 4 | 9 | |
| 5 | Dario | 5 | 5 | |

In `D2` si scrive `=SE(E(B2>=6;C2>=6);"ammesso";"respinto")` e si copia fino a `D5`. Per Anna `B2>=6` è vera ma `C2>=6` è falsa: E dà FALSO e compare respinto. Per Bruno le due condizioni sono vere: ammesso. Carla e Dario sono respinti.

Se bastasse una sola prova sufficiente, la condizione sarebbe `O(B2>=6;C2>=6)`: ammessi Anna, Bruno e Carla, respinto solo Dario, che non ha nessuna delle due.
```

```ad-warning
Un valore compreso tra due numeri
In matematica si scrive $6 \leq x \leq 8$, ma nel foglio `=6<=B2<=8` non controlla quello che sembra: confronta $6$ con `B2`, e poi confronta con $8$ il valore logico che ha ottenuto. La condizione giusta usa E: `=E(B2>=6;B2<=8)`.
```

## Contare e sommare con una condizione

Due funzioni applicano una condizione a un intero intervallo.

**CONTA.SE** conta quante celle di un intervallo rispettano un criterio: `=CONTA.SE(intervallo;criterio)`.

**SOMMA.SE** somma i numeri delle righe che rispettano un criterio: `=SOMMA.SE(intervallo;criterio;intervallo_somma)`. Il criterio si controlla sul primo intervallo, la somma si fa sul terzo, riga per riga. Se il terzo argomento manca, si sommano le celle stesse del primo intervallo.

Il **criterio** è un valore da cercare, come `"cibo"` oppure `6`, o un confronto scritto tra virgolette, con l'operatore davanti al numero: `">=6"`, `"<10"`, `"<>0"`.

```ad-example
Esempio 5: le spese della settimana

|   | A | B |
|---|---|---|
| 1 | Voce | Euro |
| 2 | cibo | 12 |
| 3 | trasporti | 8 |
| 4 | cibo | 5 |
| 5 | svago | 20 |
| 6 | cibo | 9 |
| 7 | trasporti | 6 |

- `=CONTA.SE(A2:A7;"cibo")` conta le celle della colonna `A` uguali a cibo: sono le righe 2, 4 e 6, quindi il risultato è $3$.
- `=CONTA.SE(B2:B7;">=9")` conta le spese di almeno $9$ euro: $12$, $20$ e $9$, quindi $3$.
- `=SOMMA.SE(A2:A7;"cibo";B2:B7)` cerca cibo nella colonna `A` e somma gli euro delle stesse righe: $12 + 5 + 9 = 26$.
- `=SOMMA.SE(B2:B7;">=9")` somma le spese di almeno $9$ euro: $12 + 20 + 9 = 41$.

Con le medie dell'esempio 1, `=CONTA.SE(B2:B5;">=6")` dice quanti studenti sono sufficienti: $3$.
```

```ad-warning
Contare non è sommare
CONTA.SE risponde alla domanda "quante sono?", SOMMA.SE alla domanda "quanto fanno in tutto?". Nell'esempio 5 le spese per il cibo sono $3$, ma valgono $26$ euro.
```

```ad-warning
Il criterio con un confronto va tra virgolette
`=CONTA.SE(B2:B7;>=9)` dà un errore: il confronto va scritto come testo, `">=9"`.
```

```ad-note
I nomi in inglese
Nei programmi in inglese le stesse funzioni si chiamano IF, AND, OR, NOT, COUNTIF e SUMIF, e i valori logici TRUE e FALSE.
```
