# Note: Potenze in ℚ

## Errori trovati nell'originale

- Il titolo interno era "Potenze con esponente negativo" e il testo trattava solo quello: mancavano la potenza di una frazione ($\left(\frac{a}{b}\right)^n = \frac{a^n}{b^n}$), le basi negative con la regola pari/dispari, l'esponente 0 e 1. Per una lezione intitolata "Potenze in ℚ" è una lacuna di contenuto.
- "Per qualsiasi numero $a \neq 0$ [...] $a^{-n}$" e "l'esponente negativo capovolge la frazione": la seconda formula $\left(\frac{a}{b}\right)^{-n} = \left(\frac{b}{a}\right)^n$ era data senza la condizione $a \neq 0$.
- Il simbolo di diverso era scritto `` \mathrel{\char`≠} ``, che KaTeX probabilmente non rende (da verificare sul sito); ora è `\neq`.
- Decimali scritti `0,0001` senza `{,}`: in LaTeX la virgola aggiunge uno spazio.
- Le proprietà erano ripetute per esteso come nella lezione su ℕ, con esempi solo su basi intere (nessuna frazione) tranne l'ultimo.

I conti degli esempi originali erano corretti (li ho rifatti tutti, compreso $7^5 = 16807$ e $\left(\frac{5}{2}\right)^5 = \frac{3125}{32}$).

## Cosa è cambiato

- Aggiunte le sezioni su potenza di una frazione, segno con base negativa, parentesi ($(-\frac{2}{3})^2$ contro $-(\frac{2}{3})^2$, e $\frac{2^2}{3}$ contro $(\frac{2}{3})^2$), esponente 0 e 1, con la giustificazione di $a^0 = 1$ e $a^{-n} = 1/a^n$ tramite il quoziente di potenze.
- Le cinque proprietà sono in una tabella con esempi su frazioni ed esponenti anche negativi; la definizione di base ed esponente rimanda a Potenze in ℕ, la regola dei segni a Potenze in ℤ (lezione ancora senza testo).
- Quattro esempi svolti nuovi, dal più semplice all'espressione con tre termini di segno diverso; quattro errori frequenti.
- Le potenze di 10 con esponente negativo sono ridotte a un riquadro.

## Dubbi da decidere

- $0^0$: la lezione su ℕ lo chiama "indefinito"; qui ho scritto "non ha significato", che è la formula più comune nei libri del biennio. Conviene uniformare le due lezioni.
- Il link a Potenze in ℤ punta a una lezione ancora vuota: se resta vuota a lungo, meglio togliere il link o spostare lì la regola dei segni.
- Titolo: nel database è "Potenze in \mathbb{Q}"; qui ho usato il carattere ℚ nella prima riga, che comunque il sito scarta.

## Formulario e flashcard

- La carta `zero-alla-zero` e il formulario dicono che $0^0$ "non ha significato", come la lezione: se si uniforma la formula con Potenze in ℕ ("indefinito"), vanno cambiati anche questi due file.
- Nel formulario ho scritto $a^1 = a$ come formula; la lezione lo dice solo a parole con l'esempio $\left(\frac{3}{4}\right)^1 = \frac{3}{4}$.
- La tabella delle proprietà è copiata intera dalla lezione: è la parte più lunga del formulario, ma toglierla lascerebbe le proprietà senza esempi su frazioni ed esponenti negativi.
