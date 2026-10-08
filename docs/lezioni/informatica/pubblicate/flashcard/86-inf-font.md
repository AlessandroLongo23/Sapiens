# Flashcard: Caratteri tipografici e font

## carattere-glifo
Che differenza c'è tra un carattere e un glifo?
---
Il carattere è il segno in astratto, quello che ha un codice. Il glifo è un suo disegno.

## due-erre
La R di un font con le grazie e la R di un font senza grazie sono due caratteri o due glifi?
---
Due glifi dello stesso carattere: il codice è lo stesso, $82$.

## font-definizione
Che cos'è un font?
---
Un file con i glifi di un insieme di caratteri, disegnati nello stesso stile, e le misure per metterli in fila.

## glifo-mancante
Che cosa mostra un programma se nessun font ha il glifo di un carattere?
---
Un rettangolino vuoto al posto del carattere.

## copia-incolla
Vero o falso: se copi una frase e la incolli in una chat, chi la riceve la vede con il tuo font.
---
Falso. Arrivano i codici dei caratteri, e ognuno li vede con il font del suo dispositivo.

## bitmap-ingrandito
Che cosa succede a un glifo di un font bitmap mostrato al doppio della sua dimensione?
---
Ogni pixel diventa un quadrato di $2 \times 2$: la lettera cresce e gli scalini con lei.

## contorno-ingrandito
Perché un font a contorni resta nitido a ogni dimensione?
---
Perché il glifo è un contorno fatto di punti e curve: a ogni dimensione il programma ricalcola quali pixel cadono dentro.

## glifo-bitmap-byte
Quanti byte occupa un glifo bitmap di $8 \times 8$ pixel a $1$ bit per pixel?
---
$8$: sono $64$ bit.

## bitmap-doppia-altezza
Un glifo bitmap di $8 \times 16$ pixel occupa $16$ byte. Quanto occupa quello di $16 \times 32$?
---
$64$ byte: raddoppiando larghezza e altezza i pixel diventano il quadruplo.

## grazie
Che cosa sono le grazie?
---
I piccoli tratti che chiudono le estremità delle lettere in alcuni font.

## spaziatura-fissa
In quale gruppo di font la i e la M sono larghe uguale?
---
Nei font a spaziatura fissa, il gruppo che in una pagina web si chiama `monospace`.

## perche-codice-monospace
Perché il codice dei programmi si scrive con un font a spaziatura fissa?
---
Perché ogni carattere occupa la stessa larghezza, e rientri e colonne restano allineati.

## corpo
Il corpo di un carattere è l'altezza di una lettera maiuscola?
---
No. È l'altezza dello spazio riservato a una riga di lettere, comprese le aste che salgono e quelle che scendono.

## peso-numeri
Quale numero indica il peso normale, e quale il grassetto?
---
$400$ il normale, $700$ il grassetto.

## interlinea-conto
Con `font-size: 20px` e `line-height: 1.5`, quanto distano due linee di base?
---
$30$ pixel: $20 \cdot 1{,}5$.

## altezza-paragrafo
Un paragrafo ha corpo $16$ pixel e interlinea $1{,}5$. Quanto sono alte $3$ righe?
---
$72$ pixel: ogni riga ne occupa $24$.

## elenco-font
Con `font-family: "Carattere Inventato", Georgia, serif`, quale font usa il browser se Georgia è installato?
---
Georgia: il primo nome non esiste e viene saltato senza errori.

## nome-generico
Perché l'elenco di `font-family` finisce con un nome generico?
---
Perché indica il font che il dispositivo usa per quel gruppo, e quindi c'è sempre: se gli altri mancano il testo resta del tipo giusto.

## serif-tra-virgolette
Che cosa indica `font-family: "serif"`, con le virgolette?
---
Un font che si chiama proprio serif, e che quasi certamente non esiste. I nomi generici si scrivono senza virgolette.

## leggibilita-interlinea
Per un testo lungo, tra quali valori sta bene l'interlinea?
---
Tra $1{,}4$ e $1{,}6$ volte il corpo.
