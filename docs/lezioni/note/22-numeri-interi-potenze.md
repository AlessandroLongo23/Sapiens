# Note: Potenze in ℤ

Lezione nuova, scritta da zero (lotto 2). Tutti i conti di lezione, formulario e carte sono rifatti in Python, insieme alle identità $(-a)^n = \pm a^n$ e $|a^n| = |a|^n$ provate su basi da $-9$ a $9$ ed esponenti da $0$ a $8$.

## Scelte di convenzione

- Titolo nel file: `# Potenze in ℤ`, con il simbolo Unicode, come la prima riga di Potenze in ℕ (`# Potenze in ℕ`). Nel database resta `Potenze in \mathbb{Z}`.
- $0^0$: "non ha significato", come in Potenze in ℕ e Potenze in ℚ, con link a Potenze in ℕ per il motivo.
- I numeri positivi sono scritti senza il $+$ davanti ($9$, non $+9$) e i negativi tra parentesi solo quando sono base di una potenza o fattore dopo un segno ($(-8) \cdot 1$). Se Operazioni in ℤ, scritta in parallelo, usa $(+9)$ come molti libri, va allineata una delle due.
- Le proprietà sono ripetute in tabella con le condizioni di Potenze in ℕ, compresa "$a$ divisibile per $b$" nel quoziente con lo stesso esponente, che in ℤ resta necessaria. Il perché di ciascuna è rimandato a Potenze in ℕ.
- Nella regola $(-a)^n = a^n$ con $n$ pari ho aggiunto "se $n = 0$, serve $a \neq 0$", per non far rientrare $0^0$ nella formula.
- Ho detto esplicitamente che $0$ è pari e che $(-5)^0 = 1$ rientra nella regola: evita il dubbio "l'esponente zero è pari o dispari?".

## Figura

Una sola: la retta dei numeri con $(-2)^1, (-2)^2, (-2)^3, (-2)^4$ che saltano da una parte all'altra dello zero (`potenze-di-meno-due-sulla-retta`). Va guardata sul sito in chiaro e in scuro, perché le etichette $(-2)^n$ sopra i punti sono larghe e $-2$ e $0$ sotto la retta sono vicine (0,7 unità).

## Argomenti lasciati ad altre lezioni

- Esponenti negativi e $0^{-n}$: Potenze in ℚ.
- Regola dei segni del prodotto e ordine delle operazioni: Operazioni in ℤ (solo richiamati con un link).
- Valore assoluto: Numeri interi e valore assoluto (usato in $|a^n| = |a|^n$ e nel procedimento).
- Potenze di 10 e notazione scientifica: non trattate qui.

## Cosa togliere da lezioni già scritte

- `riscritte/09-numeri-razionali-potenze.md`: la sezione "Il segno della potenza" e la sottosezione "Le parentesi decidono qual è la base" rispiegano la regola di pari e dispari e la differenza tra $(-a)^n$ e $-a^n$. Già oggi rimandano a Potenze in ℤ; si possono ridurre a due righe con gli esempi sulle frazioni ($\left(-\frac{2}{3}\right)^2$ contro $-\left(\frac{2}{3}\right)^2$, e $\frac{2^2}{3}$ contro $\left(\frac{2}{3}\right)^2$, che è proprio di ℚ). Nel formulario e nelle flashcard di Potenze in ℚ le carte `segno-esponente-pari` e `segno-esponente-dispari-conto` si sovrappongono alle mie (`segno-esponente-pari`, con lo stesso id in un file diverso): da decidere se tenerle in entrambi i mazzi.
- `riscritte/13-monomi-operazioni.md` parla del segno della potenza di un monomio: è specifico dei monomi e lo lascerei, al massimo con un link a questa lezione.

## Dubbi

- Qualche libro chiama "potenza con base intera" solo quella con esponente $n \geq 1$ e tratta $a^0$ a parte; ho seguito l'impostazione di Potenze in ℕ.
- La tabella del segno non ha la riga della base $0$, che è detta a parole ($0^n = 0$ per $n \geq 1$) per non mettere in tabella un caso con l'eccezione $0^0$.

## Livelli per gli esercizi

1. Potenza di un intero con base negativa ed esponente da 0 a 4, senza segni fuori dalla base: $(-3)^3 = -27$.
2. Potenze di $-1$ con esponenti grandi, e confronto tra $(-a)^n$ e $-a^n$: $-2^4 = -16$ e $(-2)^4 = 16$; $(-1)^{51} = -1$.
3. Una proprietà delle potenze con basi negative, risultato come potenza e come numero: $(-3)^5 : (-3)^3 = (-3)^2 = 9$.
4. Basi opposte da riportare alla stessa base, o prodotto con lo stesso esponente: $(-2)^4 \cdot 2^3 = 2^7 = 128$; $(-2)^3 \cdot 5^3 = (-10)^3 = -1000$.
5. Espressione senza parentesi con tre o quattro potenze e i segni fuori dalla base: $-2^4 + (-2)^3 \cdot (-1)^{10} - (-5)^0 = -25$.
6. Espressione con parentesi tonde, quadre e graffe e più proprietà: $\{[(-2)^3]^2 : (-4)^2 - (-6)^2 : 2^2\} \cdot (-1)^7 = 5$.
