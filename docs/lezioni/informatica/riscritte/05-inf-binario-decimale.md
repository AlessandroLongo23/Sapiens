# Conversioni tra binario e decimale

Dentro un computer ogni numero è una fila di bit, ma chi lo usa ragiona in base dieci: l'età che scrivi in un modulo viene convertita in binario per essere memorizzata, e riconvertita in decimale quando compare sullo schermo. Le conversioni sono due, da binario a decimale e da decimale a binario, e si fanno a mano con le potenze di due. Qui si parla solo di numeri interi senza segno, cioè da zero in su.

## Le potenze di due

In base due il peso della posizione $k$, contando da destra a partire da $0$, è $2^k$ (lo spiega la lezione [I sistemi di numerazione posizionali](/materiale/scuola-superiore/informatica/i-sistemi-di-numerazione/i-sistemi-di-numerazione-posizionali)). Le prime undici potenze conviene saperle a memoria, perché ogni peso è il doppio di quello alla sua destra:

| $2^{10}$ | $2^9$ | $2^8$ | $2^7$ | $2^6$ | $2^5$ | $2^4$ | $2^3$ | $2^2$ | $2^1$ | $2^0$ |
|---|---|---|---|---|---|---|---|---|---|---|
| $1024$ | $512$ | $256$ | $128$ | $64$ | $32$ | $16$ | $8$ | $4$ | $2$ | $1$ |

In un numero binario il bit più a sinistra, quello di peso maggiore, è il bit più significativo (MSB, most significant bit); quello più a destra, di peso $1$, è il bit meno significativo (LSB, least significant bit). I numeri binari lunghi si scrivono a gruppi di quattro bit a partire da destra, per leggerli meglio: $1100\,1010_2$.

## Da binario a decimale

Ogni bit vale $0$ oppure il peso della sua posizione, quindi il valore del numero è la somma dei pesi dei bit che valgono $1$.

1. Scrivi sopra ogni bit il suo peso, partendo da destra: $1$, $2$, $4$, $8$ e così via, raddoppiando ogni volta.
2. Cancella i pesi che stanno sopra uno $0$.
3. Somma i pesi rimasti.

```ad-example
Esempio 1: quattro bit
Converti $1011_2$ in base dieci.

I pesi, da sinistra, sono $8$, $4$, $2$, $1$. I bit a $1$ sono il primo, il terzo e il quarto.

$$
1011_2 = 8 + 2 + 1 = 11
$$
```

```ad-example
Esempio 2: otto bit
Converti $1100\,1010_2$ in base dieci.

Con otto bit il peso dell'MSB è $2^7 = 128$. I bit a $1$ hanno peso $128$, $64$, $8$ e $2$.

$$
1100\,1010_2 = 128 + 64 + 8 + 2 = 202
$$
```

```tikz
% nome: binario-decimale-pesi
% alt: Gli otto bit del numero 1100 1010, ognuno in una casella con sopra il suo peso: 128, 64, 32, 16, 8, 4, 2, 1. Le caselle dei bit che valgono 1 sono colorate, e sotto è scritta la somma dei loro pesi: 128 più 64 più 8 più 2 uguale 202
% svg: binario-decimale-pesi-586e04b9.svg 275x79
\begin{tikzpicture}[font=\small]
\foreach \b/\w [count=\i from 0] in {1/128, 1/64, 0/32, 0/16, 1/8, 0/4, 1/2, 0/1} {
  \ifnum\b=1
    \node[draw, thick, fill=orange!30, minimum width=0.7cm, minimum height=0.7cm, font=\large] at (0.78*\i,0) {$\b$};
    \node at (0.78*\i,0.7) {$\w$};
  \else
    \node[draw, thick, minimum width=0.7cm, minimum height=0.7cm, font=\large] at (0.78*\i,0) {$\b$};
    \node[gray] at (0.78*\i,0.7) {$\w$};
  \fi
}
\node[left] at (-0.5,0.7) {peso};
\node[left] at (-0.5,0) {bit};
\node at (2.73,-0.85) {$128 + 64 + 8 + 2 = 202$};
\end{tikzpicture}
```

```ad-example
Esempio 3: dieci bit, quasi tutti zeri
Converti $10\,0000\,0001_2$ in base dieci.

I bit sono dieci: l'MSB è nella posizione $9$ e pesa $2^9 = 512$. L'unico altro bit a $1$ è l'LSB, che pesa $1$.

$$
10\,0000\,0001_2 = 512 + 1 = 513
$$
```

```ad-warning
I pesi partono da 1, e da destra
Il primo peso a destra è $2^0 = 1$, non $2$. Chi parte da $2$ trova il doppio del numero giusto; chi assegna i pesi partendo da sinistra converte il numero letto al contrario.
```

```ad-tip
Due controlli veloci
Un numero binario che finisce per $1$ è dispari, uno che finisce per $0$ è pari, perché l'LSB è l'unico bit con un peso dispari. Un numero fatto di $n$ bit tutti a $1$ vale $2^n - 1$: $1111\,1111_2 = 2^8 - 1 = 255$.
```

## Da decimale a binario con le divisioni successive

Dividendo un numero per $2$, il resto dice se è dispari o pari, cioè qual è il suo ultimo bit; il quoziente è il numero che resta togliendo quel bit. Ripetendo la divisione sul quoziente si trovano tutti i bit, dall'ultimo al primo.

1. Dividi il numero per $2$ e scrivi il quoziente e il resto ($0$ oppure $1$).
2. Dividi il quoziente per $2$, e continua così finché il quoziente diventa $0$.
3. Leggi i resti dal basso verso l'alto: l'ultimo resto trovato è l'MSB, il primo è l'LSB.

```ad-example
Esempio 4: il numero 46
Converti $46$ in binario.

| Divisione | Quoziente | Resto |
|---|---|---|
| $46 : 2$ | $23$ | $0$ |
| $23 : 2$ | $11$ | $1$ |
| $11 : 2$ | $5$ | $1$ |
| $5 : 2$ | $2$ | $1$ |
| $2 : 2$ | $1$ | $0$ |
| $1 : 2$ | $0$ | $1$ |

I resti letti dal basso verso l'alto sono $1$, $0$, $1$, $1$, $1$, $0$: quindi $46 = 10\,1110_2$. Controllo: $32 + 8 + 4 + 2 = 46$.
```

```tikz
% nome: divisioni-successive-46
% alt: Le divisioni successive di 46 per 2 scritte una sotto l'altra: 46, 23, 11, 5, 2, 1, ognuna con il suo resto: 0, 1, 1, 1, 0, 1. Una freccia sale lungo la colonna dei resti con la scritta si legge dal basso, e in fondo c'è il risultato 10 1110 in base due
% svg: divisioni-successive-46-80b691e1.svg 217x170
\begin{tikzpicture}[font=\small]
\foreach \n/\q/\r [count=\i from 0] in {46/23/0, 23/11/1, 11/5/1, 5/2/1, 2/1/0, 1/0/1} {
  \node[anchor=east] at (1.6,-0.6*\i) {$\n : 2 = \q$};
  \node at (2.35,-0.6*\i) {resto};
  \node[draw, thick, fill=orange!30, minimum width=0.5cm, minimum height=0.5cm] at (3.2,-0.6*\i) {$\r$};
}
\draw[-{Stealth}, very thick] (3.85,-3.1) -- (3.85,0.1);
\node[right, align=left] at (3.95,-1.5) {si legge\\dal basso};
\node at (2.2,-3.9) {$46 = 10\,1110_2$};
\end{tikzpicture}
```

Le divisioni successive sono una ripetizione, e si possono far eseguire a una macchina. Lo schema qui sotto è un diagramma di flusso: si legge dall'alto seguendo le frecce, il rombo è una domanda, e finché la risposta è sì si rifà il giro. Nel giro `n mod 2` è il resto della divisione di $n$ per $2$ e `n div 2` è il quoziente. Premi "Passo" per avanzare un blocco alla volta, e al blocco "leggi" conferma il $46$ con "Invio": i resti escono nell'ordine in cui li trovi, quindi il numero binario si legge dall'ultimo al primo. Guarda il rombo quando $n$ vale $1$: la risposta è ancora sì, e il giro che segue dà l'ultimo resto. Poi cambia $46$ in $200$, il numero dell'esempio 5.

```diagramma
% nome: divisioni-successive-diagramma
% alt: Diagramma di flusso delle divisioni successive: si legge n; un rombo chiede se n è maggiore di zero; nel giro resto prende il resto di n diviso 2, si scrive resto e n prende il quoziente di n diviso 2, poi una freccia risale al rombo; quando n è zero il diagramma finisce
% ingresso: 46
% codice: no
leggi n
finché n > 0
    resto = n % 2
    scrivi resto
    n = n // 2
```

```ad-example
Esempio 5: un numero pari, con gli zeri in fondo
Converti $200$ in binario.

Le divisioni danno i quozienti $100$, $50$, $25$, $12$, $6$, $3$, $1$, $0$ e i resti $0$, $0$, $0$, $1$, $0$, $0$, $1$, $1$. I primi tre resti sono zeri perché $200$ si può dividere per $2$ tre volte di seguito.

Letti dal basso i resti danno $200 = 1100\,1000_2$. Controllo: $128 + 64 + 8 = 200$.
```

```ad-warning
Due errori con le divisioni
Il primo è leggere i resti dall'alto: per $46$ si otterrebbe $01\,1101_2$, che è $29$. Il secondo è fermarsi quando il quoziente è $1$: manca ancora la divisione $1 : 2$, che dà quoziente $0$ e resto $1$, e quel resto è l'MSB.
```

## Da decimale a binario sottraendo le potenze di due

Il secondo metodo costruisce il numero da sinistra, e con i numeri grandi è spesso più rapido.

1. Cerca la più grande potenza di due che non supera il numero: il suo bit è $1$, ed è l'MSB.
2. Sottrai quella potenza dal numero.
3. Passa alla potenza subito più piccola: se sta in quello che resta, scrivi $1$ e sottraila; se non ci sta, scrivi $0$.
4. Continua fino a $2^0 = 1$. Alla fine il resto deve essere $0$.

```ad-example
Esempio 6: 46 con le potenze di due
La più grande potenza che non supera $46$ è $32$, quindi servono sei bit, con i pesi $32$, $16$, $8$, $4$, $2$, $1$.

| Peso | $32$ | $16$ | $8$ | $4$ | $2$ | $1$ |
|---|---|---|---|---|---|---|
| Ci sta? | sì, resta $14$ | no | sì, resta $6$ | sì, resta $2$ | sì, resta $0$ | no |
| Bit | $1$ | $0$ | $1$ | $1$ | $1$ | $0$ |

Si ritrova $46 = 10\,1110_2$.
```

```ad-example
Esempio 7: un numero di dieci bit
Converti $1000$ in binario.

La più grande potenza che non supera $1000$ è $512$. Sottraendo le potenze che ci stanno: $1000 - 512 = 488$, $488 - 256 = 232$, $232 - 128 = 104$, $104 - 64 = 40$, $40 - 32 = 8$; il $16$ non ci sta; $8 - 8 = 0$; non restano $4$, $2$, $1$.

$$
1000 = 512 + 256 + 128 + 64 + 32 + 8 = 11\,1110\,1000_2
$$
```

```ad-warning
Gli zeri delle potenze saltate vanno scritti
Una potenza che non ci sta vale un bit $0$, non un posto vuoto. Scrivere solo gli $1$ di $200 = 128 + 64 + 8$ darebbe $111_2$, che è $7$: il numero giusto è $1100\,1000_2$, con uno $0$ per ognuna delle potenze $32$, $16$, $4$, $2$, $1$.
```

## Quanti bit servono

Con $n$ bit si scrivono $2^n$ numeri diversi, da $0$ a $2^n - 1$: con $4$ bit da $0$ a $15$, con $8$ bit da $0$ a $255$, con $10$ bit da $0$ a $1023$. Per sapere quanti bit servono per un numero si cerca la prima potenza di due che lo supera: $200$ è minore di $2^8 = 256$ e non di $2^7 = 128$, quindi servono $8$ bit.

Se i bit a disposizione sono più del necessario, si aggiungono zeri a sinistra, che non cambiano il valore: in un byte $13$ si scrive $0000\,1101_2$.

```ad-warning
Una potenza di due ha bisogno di un bit in più
$255 = 1111\,1111_2$ sta in $8$ bit, ma $256 = 1\,0000\,0000_2$ ne chiede $9$. In generale $2^n$ si scrive con $1$ seguito da $n$ zeri, cioè con $n + 1$ bit.
```

I numeri negativi e quelli con la virgola hanno bisogno di altre regole: sono nelle lezioni [Numeri interi con segno e complemento a due](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/numeri-interi-con-segno-e-complemento-a-due) e [Numeri reali in virgola mobile](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/numeri-reali-in-virgola-mobile).
