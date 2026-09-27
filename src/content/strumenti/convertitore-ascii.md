# Testo e codici ASCII

## Che cos'è

Il codice ASCII è la tabella che dà a ogni carattere un numero da 0 a 127, così che un computer possa salvarlo in bit.

Le lettere, le cifre, i segni di punteggiatura e lo spazio hanno i codici da 32 a 126: sono i caratteri stampabili. I codici da 0 a 31 e il 127 sono comandi, come l'a capo (10) o la tabulazione (9).

Alcuni codici da ricordare:

| Carattere | Codice |
|---|---|
| spazio | $32$ |
| cifre, da 0 a 9 | da $48$ a $57$ |
| maiuscole, da A a Z | da $65$ a $90$ |
| minuscole, da a a z | da $97$ a $122$ |

Tra una maiuscola e la sua minuscola ci sono sempre 32 posti: A è 65, a è 97.

## Come si calcola a mano

```ad-example
Esempio: la parola "Ok"
Cerca i due caratteri nella tabella: O è 79 e k è 107. In binario su 8 bit, cioè un byte, scomponi ogni codice in potenze di 2:

$$\begin{aligned}
79 &= 64 + 8 + 4 + 2 + 1 = 0100\,1111 \\[6pt]
107 &= 64 + 32 + 8 + 2 + 1 = 0110\,1011
\end{aligned}$$

Per l'esadecimale dividi ogni byte in due gruppi di 4 bit: $0100 = 4$ e $1111 = \text{F}$, quindi 79 è $4\text{F}$. Allo stesso modo 107 è $6\text{B}$.
```

Per tornare dai codici al testo si fa il contrario: si porta ogni codice in decimale e si cerca il carattere nella tabella.

```ad-error
Errori frequenti
- Scrivere il binario senza gli zeri a sinistra: nei libri ogni carattere occupa un byte intero, 8 bit.
- Confondere la cifra con il suo codice: il carattere "7" ha codice 55, non 7.
- Dimenticare lo spazio: anche lui è un carattere, con codice 32.
```

## Domande frequenti

### Perché le lettere accentate non ci sono?

L'ASCII è nato negli Stati Uniti nel 1963 e ha solo le lettere dell'alfabeto inglese. Per "è", "ñ", le lettere greche o le emoji serve Unicode, che dà a ogni carattere un numero chiamato code point: "è" è U+00E8, cioè 232. Nei file e nelle pagine web Unicode si salva di solito in UTF-8, che usa da 1 a 4 byte per carattere e scrive i caratteri ASCII con gli stessi codici di sempre.

### Perché il binario ha 8 cifre se l'ASCII ne usa 7?

I codici da 0 a 127 stanno in 7 bit, ma i computer lavorano a byte da 8 bit. Il bit in più a sinistra è 0.
