# La compressione dei dati, con e senza perdita

Una foto da $12$ megapixel, scritta pixel per pixel, occupa $36\,\text{MB}$: l'hai calcolato nella lezione [La codifica delle immagini](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-delle-immagini-pixel-e-colori). Sul telefono la stessa foto ne occupa circa $3$. I trentatré megabyte che mancano hanno fatto una di due fini: o erano di troppo, e sono stati tolti senza che l'immagine cambiasse di un pixel, oppure contenevano qualcosa che l'occhio non avrebbe notato, e sono stati buttati via. Sono i due modi di comprimere.

## Perché si comprime

La **compressione** è un procedimento che riscrive dei dati con meno bit; la **decompressione** è il procedimento inverso, che dai dati compressi ricava quelli da usare. Un file più piccolo occupa meno memoria, e soprattutto viaggia più in fretta. Su una connessione da $10\,\text{Mbit/s}$ i $36\,\text{MB}$ della foto, che sono $36 \cdot 8 = 288\,\text{Mbit}$, impiegano $288 : 10 = 28{,}8$ secondi; i $3\,\text{MB}$ della foto compressa ne impiegano $2{,}4$.

Quanto si è guadagnato lo dice il **rapporto di compressione**, che confronta la dimensione di partenza con quella compressa:

$$\begin{aligned}& \text{rapporto di compressione} \\ & \quad = \frac{\text{dimensione originale}}{\text{dimensione compressa}}\end{aligned}$$

Per la foto è $36 : 3 = 12$, e si scrive anche $12 : 1$: dodici byte dell'originale per ogni byte del file compresso.

## La ridondanza

Un dato è **ridondante** quando una sua parte si può ricavare dal resto. In una foto del cielo un pixel azzurro è quasi sempre seguito da un altro pixel azzurro; in un testo italiano dopo la q viene quasi sempre la u; in una tabella di voti la stessa data compare in trenta righe. Tutto ciò che si può prevedere si può scrivere in meno spazio.

La **compressione senza perdita** toglie la ridondanza e nient'altro: decomprimendo si riottengono i dati di partenza esatti, bit per bit. È l'unica che si può usare per un testo, un programma o una tabella di dati, dove un solo bit diverso cambia il significato.

## RLE: contare invece di ripetere

Il metodo più semplice si chiama **RLE** (Run-Length Encoding, codifica delle lunghezze delle sequenze). Al posto di una sequenza di valori uguali si scrive quante volte il valore si ripete, e poi il valore.

Prendi una riga di $16$ pixel, in cui ogni pixel è una lettera: B per bianco, N per nero, R per rosso.

`BBBBBBNNNNRRRRBB`

1. Si parte dal primo pixel e si conta quanti pixel uguali ci sono di fila: sei B. Si scrive `6B`.
2. Si riparte dal primo pixel diverso e si conta di nuovo: quattro N, `4N`.
3. Si continua fino alla fine della riga: `4R`, poi `2B`.

La riga codificata è `6B4N4R2B`. Se un pixel occupa un byte, la riga ne occupa $16$; nella codifica ogni sequenza occupa due byte, uno per il numero e uno per il colore, quindi quattro sequenze fanno $8$ byte. Il rapporto di compressione è $16 : 8 = 2$.

```ad-example
Esempio 1: decodificare
Quale riga corrisponde alla codifica `3N10B3N`? E qual è il rapporto di compressione?

Si legge una coppia alla volta: tre N, dieci B, tre N, cioè `NNNBBBBBBBBBBNNN`. La riga ha $3 + 10 + 3 = 16$ pixel, quindi $16$ byte; la codifica ha tre sequenze, quindi $3 \cdot 2 = 6$ byte. Il rapporto è $16 : 6 \approx 2{,}67$.
```

RLE funziona sempre? Nella figura la riga è quella di prima. Scegli un colore e dipingi i pixel, poi prova i tre esempi: con "Scacchiera" guarda quanti byte occupa la codifica.

```interattivo
% nome: inf-rle-riga
% alt: Una riga di 16 pixel da colorare con quattro colori, bianco, nero, rosso e verde. Sotto ogni pixel c'è la sua lettera, e sotto ancora le sequenze di pixel uguali, ognuna con il numero e la lettera, come 6B 4N 4R 2B. Tre numeri dicono quanti byte occupa la riga, 16, quanti la codifica, due per sequenza, e quante sono le sequenze. Con la riga di partenza la codifica occupa 8 byte; con una riga di un colore solo ne occupa 2; con i pixel alternati bianco e nero ne occupa 32, il doppio della riga
```

Con una riga di un colore solo la codifica è `16R`: due byte al posto di sedici. Con la scacchiera ogni sequenza è lunga un pixel, e la codifica `1B1N1B1N...` occupa $32$ byte, il doppio della riga. Il pareggio è a otto sequenze: sotto, RLE accorcia; sopra, allunga.

```ad-warning
Una compressione senza perdita non accorcia tutto
RLE guadagna solo dove ci sono sequenze lunghe, e dove non ce ne sono fa danni. Vale per ogni metodo senza perdita: accorcia i dati che hanno la ridondanza che il metodo sa riconoscere, e allunga un po' gli altri. Un metodo che accorciasse ogni file non potrebbe esistere, perché due file diversi finirebbero nello stesso file compresso e non si saprebbe più quale restituire.
```

Il programma qui sotto codifica una riga come hai fatto a mano. Scorre i caratteri dal secondo in poi e confronta ciascuno con quello prima: se è uguale la sequenza continua, altrimenti la sequenza è finita e va scritta.

```codice python
riga = "BBBBBBNNNNRRRRBB"

codifica = ""
quanti = 1
for i in range(1, len(riga)):
    if riga[i] == riga[i - 1]:
        quanti = quanti + 1
    else:
        codifica = codifica + str(quanti) + riga[i - 1]
        quanti = 1
codifica = codifica + str(quanti) + riga[len(riga) - 1]

print(codifica)
print("riga:", len(riga), "caratteri")
print("codifica:", len(codifica), "caratteri")
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string riga = "BBBBBBNNNNRRRRBB";

    string codifica = "";
    int quanti = 1;
    for (int i = 1; i < riga.length(); i++) {
        if (riga[i] == riga[i - 1]) {
            quanti = quanti + 1;
        } else {
            codifica = codifica + to_string(quanti) + riga[i - 1];
            quanti = 1;
        }
    }
    codifica = codifica + to_string(quanti) + riga[riga.length() - 1];

    cout << codifica << endl;
    cout << "riga: " << riga.length() << " caratteri" << endl;
    cout << "codifica: " << codifica.length() << " caratteri" << endl;
    return 0;
}
```

L'ultima sequenza si scrive dopo il ciclo, perché dentro il ciclo una sequenza viene scritta solo quando ne comincia un'altra. Cambia la riga in `"BNBNBNBN"` e controlla che la codifica sia più lunga. Poi dai al programma la sua stessa uscita, `"6B4N4R2B"`: comprimere una seconda volta produce `161B141N141R121B`, sedici caratteri al posto di otto.

## Il dizionario

Le ripetizioni non sono sempre una accanto all'altra. In un testo si ripetono le parole e i pezzi di frase, a distanza. L'idea è allora tenere un **dizionario**: un elenco dei pezzi che si ripetono, ciascuno con un numero, e scrivere nel testo il numero al posto del pezzo.

Lo scioglilingua "sopra la panca la capra campa, sotto la panca la capra crepa" ha $60$ caratteri, e "la panca la capra" compare due volte. Con il dizionario 1 = "la panca la capra" il testo diventa "sopra 1 campa, sotto 1 crepa", che ne ha $28$. Aggiungendo i $17$ caratteri della voce del dizionario, che va conservata per poter tornare indietro, si resta ben sotto i $60$ di partenza.

In un file vero il dizionario lo costruisce il programma, mentre legge i dati, e più un pezzo è lungo e frequente più fa guadagnare. Su questa idea si basano gli archivi ZIP e il formato PNG.

## Codici di lunghezza diversa

C'è una terza ridondanza, più nascosta: i valori non sono tutti frequenti allo stesso modo. Con quattro colori servono $2$ bit per pixel, e una riga di $16$ pixel occupa $32$ bit. Se però la riga è `BBBBBBBBBBNNNRRV`, con dieci B, tre N, due R e una V, conviene dare al colore più frequente il codice più corto.

| Colore | Quanti pixel | Codice fisso | Codice di lunghezza diversa |
|---|---|---|---|
| B | $10$ | `00` | `0` |
| N | $3$ | `01` | `10` |
| R | $2$ | `10` | `110` |
| V | $1$ | `11` | `111` |

Con i nuovi codici la riga occupa $10 \cdot 1 + 3 \cdot 2 + 2 \cdot 3 + 1 \cdot 3 = 25$ bit al posto di $32$. I codici non sono scelti a caso: nessuno è l'inizio di un altro, così i bit si possono leggere di fila senza separatori. La sequenza `0100110` si divide in un modo solo, `0`, `10`, `0`, `110`, cioè B, N, B, R.

Il codice Morse usa la stessa idea da quasi due secoli: la E, la lettera più frequente in inglese, è un solo punto. Il procedimento che trova i codici migliori a partire dalle frequenze si chiama codifica di Huffman, e i formati veri lo applicano dopo il dizionario.

## Con perdita: che cosa si butta via

Togliendo la ridondanza una foto si dimezza, più o meno. Per arrivare a un decimo bisogna rinunciare a una parte dei dati. La **compressione con perdita** elimina informazioni per sempre: decomprimendo si ottiene qualcosa che somiglia all'originale, non l'originale.

Funziona perché i dati sono destinati a un occhio e a un orecchio, che hanno i loro limiti. L'occhio distingue bene i contorni e le differenze di luminosità, e male le piccole differenze di colore e i dettagli molto fitti. L'orecchio non sente un suono debole coperto da uno forte, e sente male i suoni più acuti. Una compressione con perdita butta via per primo proprio quello che non verrebbe percepito.

Quanto si può buttare prima che si veda? Nella figura l'immagine a sinistra è l'originale, quella a destra è compressa. Porta la qualità da $50$ a $10$ e guarda i bordi dell'aquilone e le colline; poi risali e cerca il punto in cui non distingui più le due immagini.

```interattivo
% nome: inf-compressione-perdita
% alt: La stessa immagine di 64 per 64 pixel, un aquilone nel cielo sopra due colline, due volte: a sinistra l'originale, a destra dopo una compressione con perdita a blocchi di 8 per 8 pixel. Un cursore sceglie la qualità, da 5 a 95. A qualità alta le due immagini sembrano uguali e resta diverso da zero circa un terzo dei numeri che descrivono i blocchi; a qualità 50 ne resta circa un ottavo e le differenze si vedono appena; a qualità 10 ne resta un ventesimo, attorno all'aquilone compaiono aloni e le colline diventano blocchi quadrati
```

La figura fa, in piccolo, quello che fa il formato JPEG. Divide l'immagine in blocchi di $8 \times 8$ pixel e descrive ogni blocco con $64$ numeri, che dicono quanto pesano nel blocco le variazioni lente e quelle sempre più fitte. Poi arrotonda i numeri, tanto più grossolanamente quanto più bassa è la qualità, e quelli delle variazioni fitte finiscono quasi tutti a zero. A qualità $50$ resta diverso da zero circa un numero su otto, e l'immagine sembra intatta. A qualità $10$ ne resta uno su venti: i blocchi diventano visibili sulle colline, e attorno ai bordi netti dell'aquilone compaiono gli aloni. Le lunghe file di zeri vengono infine compresse senza perdita, con sequenze contate come in RLE e codici di lunghezza diversa.

```ad-note
Dove la figura semplifica
Un vero JPEG separa prima la luminosità dal colore e tratta il colore in modo più grossolano; la figura tratta allo stesso modo rosso, verde e blu. Il numero che mostra non è la dimensione di un file: conta quanti numeri restano da scrivere.
```

| | Senza perdita | Con perdita |
|---|---|---|
| Decomprimendo si ottiene | l'originale esatto | qualcosa che gli somiglia |
| Che cosa toglie | la ridondanza | la ridondanza e i dettagli meno percepiti |
| Quanto comprime | poco: dipende dai dati | molto: lo decide chi salva, con la qualità |
| Si usa per | testi, programmi, dati, archivi, disegni | fotografie, musica, video |

```ad-warning
Con perdita solo ciò che si guarda o si ascolta
Un testo o un programma compresso con perdita non avrebbe senso: una lettera o un'istruzione "che somiglia" a quella giusta è sbagliata. La perdita si accetta solo dove il destinatario è un occhio o un orecchio.
```

## Calcolare con il rapporto di compressione

```ad-example
Esempio 2: dal rapporto alla dimensione
Un brano non compresso occupa $30\,\text{MB}$. Quanto occupa compresso con rapporto $10 : 1$? E quanto spazio si risparmia, in percentuale?

La dimensione compressa è l'originale diviso il rapporto: $30 : 10 = 3\,\text{MB}$. Si risparmiano $30 - 3 = 27\,\text{MB}$ su $30$, cioè $27 : 30 = 0{,}9$: il $90\%$.
```

```ad-example
Esempio 3: dalle dimensioni al rapporto
Una schermata non compressa occupa $6\,\text{MB}$ e salvata in PNG ne occupa $1{,}5$. Qual è il rapporto di compressione?

$6 : 1{,}5 = 4$. Il rapporto è $4 : 1$: il file compresso è un quarto dell'originale.
```

```ad-warning
Il rapporto si legge dalla parte giusta
Un rapporto $4 : 1$ vuol dire che il file compresso è un quarto dell'originale, cioè il $25\%$, non il $4\%$. E un rapporto minore di $1$ vuol dire che la compressione ha allungato i dati, come RLE con la scacchiera: $16 : 32 = 0{,}5$.
```

## Comprimere due volte

Comprimere di nuovo un file già compresso senza perdita non serve: la prima passata ha tolto la ridondanza, e la seconda non ne trova più. Lo hai visto dando al programma la sua stessa uscita. Per la stessa ragione mettere in un archivio ZIP delle foto JPEG o dei video non li rimpicciolisce: sono già compressi.

Con la perdita è peggio. Ogni volta che apri una foto JPEG, la modifichi e la salvi di nuovo, la compressione riparte e butta via ancora qualcosa, e i danni si sommano a quelli di prima. Per questo si conserva l'originale, si lavora in un formato senza perdita, e si comprime con perdita una volta sola, alla fine. I formati che usano l'una o l'altra compressione sono nella lezione [I formati dei file multimediali](/materiale/scuola-superiore/informatica/immagini-suoni-e-video-digitali/i-formati-dei-file-multimediali).

## Prova tu

Il programma legge una riga di pixel, scritta con le lettere dei colori, e deve scrivere su tre righe: il numero delle sequenze di pixel uguali, i byte della codifica RLE (due per sequenza) e la parola `conviene` se la codifica occupa meno byte della riga, `non conviene` altrimenti. Ogni pixel della riga occupa un byte.

```codice python
riga = input()

# scrivi qui
%% soluzione
riga = input()

sequenze = 1
for i in range(1, len(riga)):
    if riga[i] != riga[i - 1]:
        sequenze = sequenze + 1

peso = 2 * sequenze
print(sequenze)
print(peso)
if peso < len(riga):
    print("conviene")
else:
    print("non conviene")
%% prova
BBBBBBNNNNRRRRBB
%% stampa
4
8
conviene
%% prova
BNBNBNBN
%% stampa
8
16
non conviene
%% prova
RRRRRRRRRRRR
%% stampa
1
2
conviene
%% prova
BBNNBBNN
%% stampa
4
8
non conviene
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string riga;
    cin >> riga;

    // scrivi qui
    return 0;
}
%% soluzione
#include <iostream>
#include <string>
using namespace std;

int main() {
    string riga;
    cin >> riga;

    int sequenze = 1;
    for (int i = 1; i < riga.length(); i++) {
        if (riga[i] != riga[i - 1]) {
            sequenze = sequenze + 1;
        }
    }

    int peso = 2 * sequenze;
    cout << sequenze << endl;
    cout << peso << endl;
    if (peso < riga.length()) {
        cout << "conviene" << endl;
    } else {
        cout << "non conviene" << endl;
    }
    return 0;
}
```

Ora il procedimento inverso: il programma legge una codifica RLE, come `6B4N4R2B`, e deve scrivere la riga di partenza. In questo esercizio ogni sequenza è lunga al massimo $9$, quindi la codifica è fatta di coppie di caratteri: una cifra e una lettera. Nel programma di partenza trovi già come trasformare il carattere della cifra in un numero.

```codice python
codifica = input()

riga = ""
for i in range(0, len(codifica), 2):
    quanti = int(codifica[i])
    # scrivi qui

print(riga)
%% soluzione
codifica = input()

riga = ""
for i in range(0, len(codifica), 2):
    quanti = int(codifica[i])
    for k in range(quanti):
        riga = riga + codifica[i + 1]

print(riga)
%% prova
6B4N4R2B
%% stampa
BBBBBBNNNNRRRRBB
%% prova
1B1N1B1N
%% stampa
BNBN
%% prova
9V
%% stampa
VVVVVVVVV
%% prova
3N7B3N
%% stampa
NNNBBBBBBBNNN
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string codifica;
    cin >> codifica;

    string riga = "";
    for (int i = 0; i < codifica.length(); i = i + 2) {
        int quanti = codifica[i] - '0';
        // scrivi qui
    }

    cout << riga << endl;
    return 0;
}
%% soluzione
#include <iostream>
#include <string>
using namespace std;

int main() {
    string codifica;
    cin >> codifica;

    string riga = "";
    for (int i = 0; i < codifica.length(); i = i + 2) {
        int quanti = codifica[i] - '0';
        for (int k = 0; k < quanti; k++) {
            riga = riga + codifica[i + 1];
        }
    }

    cout << riga << endl;
    return 0;
}
```
