# Formulario: La codifica dei caratteri: ASCII e Unicode

## Il codice ASCII

- 7 bit per carattere: $2^7 = 128$ codici, da $0$ a $127$.

| Codici | Caratteri |
|---|---|
| da $0$ a $31$, e $127$ | caratteri di controllo |
| $32$ | lo spazio |
| da $48$ a $57$ | le cifre da 0 a 9 |
| da $65$ a $90$ | le maiuscole da A a Z |
| da $97$ a $122$ | le minuscole da a a z |

- Cifre e lettere hanno codici consecutivi: la E è quattro posti dopo la A, quindi $65 + 4 = 69$.
- Da ricordare: $48$ (la cifra 0), $65$ (la A maiuscola), $97$ (la a minuscola).

## Maiuscole e minuscole

$$\text{codice della minuscola} = \text{codice della maiuscola} + 32$$

- Cambia un solo bit, quello di peso $32$: la A è $100\,0001_2$, la a è $110\,0001_2$.
- Nell'ordine dei codici tutte le maiuscole vengono prima delle minuscole.

## Estensioni a 8 bit

- 8 bit: $2^8 = 256$ codici. I primi $128$ sono l'ASCII, gli altri cambiano da una tabella all'altra.
- In Latin-1 la è ha codice $232$.

## Unicode e UTF-8

- Unicode: un numero per ogni carattere di ogni scrittura, il punto di codice, scritto U+ e il numero in esadecimale. I primi $128$ sono quelli dell'ASCII.
- UTF-8: scrive i punti di codice con un numero variabile di byte.

| Punti di codice | Byte | Che cosa contiene |
|---|---|---|
| da U+0000 a U+007F | 1 | i caratteri ASCII |
| da U+0080 a U+07FF | 2 | lettere accentate, greco, cirillico |
| da U+0800 a U+FFFF | 3 | il simbolo €, caratteri cinesi e giapponesi |
| da U+10000 a U+10FFFF | 4 | le emoji |

## Quanti byte occupa un testo

1. Conta i caratteri, con spazi, punteggiatura e a capo.
2. ASCII o estensione a 8 bit: 1 byte per carattere.
3. UTF-8: 1 byte per i caratteri ASCII, 2 per le lettere accentate, 3 per €, 4 per le emoji.

Esempio: "Perché è così?" ha $14$ caratteri, tre accentati: in UTF-8 occupa $14 + 3 = 17$ byte.

```ad-warning
Il carattere 7 non è il numero 7
La cifra 7 scritta in un testo ha codice $55$.
```

```ad-warning
Lo spazio conta
Spazi, punteggiatura e a capo sono caratteri e occupano byte.
```

```ad-warning
In UTF-8 caratteri e byte non coincidono
"più" ha 3 caratteri e 4 byte.
```
