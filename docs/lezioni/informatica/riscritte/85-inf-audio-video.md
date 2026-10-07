# Audio e video digitali

I Fuori Tempo, il gruppo musicale della scuola, hanno registrato le prove con un telefono appoggiato su una sedia: tre minuti di canzone, prima solo l'audio e poi anche il video. Il file dell'audio pesa meno di $3\,\text{MB}$ e parte subito nella chat della classe; quello del video ne pesa più di $100$ e ci mette un po'. Sono già due file compressi: senza [compressione](/materiale/scuola-superiore/informatica/immagini-suoni-e-video-digitali/la-compressione-dei-dati-con-e-senza-perdita) l'audio occuperebbe più di $30\,\text{MB}$ e il video quasi $28\,\text{GB}$, più di quanto molti telefoni hanno libero. Sono conti che puoi fare da solo, e spiegano da dove viene una differenza così grande.

## Il bitrate di un suono

Un suono digitale è una sequenza di campioni: quanti al secondo lo dice la frequenza di campionamento, con quanti bit è scritto ciascuno lo dice la quantizzazione, come hai visto nella lezione sulla [codifica dei suoni](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-dei-suoni). Un suono **stereo** ha due canali, sinistro e destro, e ogni canale ha i suoi campioni; uno **mono** ne ha uno solo.

Il **bitrate** è il numero di bit che servono per ogni secondo di suono, o di video. Si misura in bit al secondo, con i multipli decimali: $1\,\text{kbit/s} = 1000\,\text{bit/s}$ e $1\,\text{Mbit/s} = 1\,000\,000\,\text{bit/s}$. Per un suono non compresso si calcola così:

$$\begin{aligned}& \text{bitrate} = \\ & \quad \text{frequenza di campionamento} \\ & \quad \cdot \text{bit per campione} \cdot \text{canali}\end{aligned}$$

Con i numeri di un CD audio, cioè $44\,100\,\text{Hz}$, $16$ bit e due canali, il bitrate è $44\,100 \cdot 16 \cdot 2 = 1\,411\,200\,\text{bit/s}$, cioè $1411{,}2\,\text{kbit/s}$.

Conoscere il bitrate conviene perché la dimensione di un file ne discende con una moltiplicazione, qualunque cosa ci sia dentro:

$$\text{byte} = \frac{\text{bitrate} \cdot \text{secondi}}{8}$$

```ad-example
Esempio 1: la canzone senza compressione
Quanto occupano i tre minuti di prove, registrati in stereo a $44\,100\,\text{Hz}$ e $16$ bit e non compressi? Usa $1\,\text{MB} = 1\,000\,000\,\text{B}$.

Il bitrate è $1\,411\,200\,\text{bit/s}$ e tre minuti sono $180$ secondi. I byte sono $1\,411\,200 \cdot 180 : 8 = 31\,752\,000$, cioè circa $31{,}8\,\text{MB}$.
```

## Il bitrate di un file compresso

Quando un suono viene compresso, il bitrate non si calcola più dai campioni: lo sceglie chi salva il file, ed è scritto tra le proprietà del file. Un bitrate di $128\,\text{kbit/s}$ vuol dire che il programma di compressione ha a disposizione $128\,000$ bit per descrivere ogni secondo di musica, undici volte meno dei $1\,411\,200$ di partenza: deve decidere che cosa tenere. Più basso è il bitrate, più piccolo è il file e più cose vengono buttate via.

```ad-example
Esempio 2: la stessa canzone a 128 kbit/s
Quanto occupano gli stessi tre minuti salvati a $128\,\text{kbit/s}$?

$128\,\text{kbit/s}$ sono $128\,000\,\text{bit/s}$. I byte sono $128\,000 \cdot 180 : 8 = 2\,880\,000$, cioè $2{,}88\,\text{MB}$.

Frequenza, bit per campione e canali nel conto non compaiono: una volta noto il bitrate non servono.
```

```ad-warning
Kilobit e kilobyte
Il bitrate è in bit, la dimensione di un file in byte: tra i due c'è sempre una divisione per $8$. Un minuto a $128\,\text{kbit/s}$ non occupa $128 \cdot 60 = 7680\,\text{kB}$ ma $7680 : 8 = 960\,\text{kB}$. Lo stesso vale per la velocità di una connessione, che si misura in $\text{Mbit/s}$: con $8\,\text{Mbit/s}$ scarichi $1\,\text{MB}$ al secondo.
```

Nella figura qui sotto scegli come è fatto un brano e quanto dura: le due barre sono in scala, e il conto è scritto sotto. Lascia i valori del CD e porta la durata a $10$ minuti, poi cerca la combinazione più leggera che riesci a ottenere senza compressione, e confrontala con il file compresso a $320\,\text{kbit/s}$.

```interattivo
% nome: inf-audio-video-dimensione
% alt: Un calcolatore della dimensione di un brano o di un video. Per il brano si scelgono frequenza di campionamento, bit per campione, canali, durata e il bitrate del file compresso; per il video risoluzione, fotogrammi al secondo, durata e bitrate del file compresso. Due barre in scala confrontano la dimensione senza compressione e quella del file compresso, e sotto è scritto il conto
```

La combinazione più leggera, $8\,\text{kHz}$ con $8$ bit e un solo canale, in dieci minuti occupa $4{,}8\,\text{MB}$, ma suona come una vecchia telefonata. Con i valori del CD gli stessi dieci minuti occupano $105{,}84\,\text{MB}$, e il file compresso a $320\,\text{kbit/s}$ ne occupa $24$: più di quattro volte meno, a un bitrate a cui quasi nessuno distingue il file dall'originale.

## I formati dell'audio

I [formati dei file audio](/materiale/scuola-superiore/informatica/immagini-suoni-e-video-digitali/i-formati-dei-file-multimediali) si dividono in tre gruppi, secondo quello che fanno ai campioni.

| Che cosa contiene il file | Bitrate per la qualità di un CD | Esempi | Quando si usa |
|---|---|---|---|
| i campioni così come sono | $1411{,}2\,\text{kbit/s}$ | WAV | registrare e montare |
| i campioni compressi senza perdita | circa la metà, secondo il brano | FLAC | conservare un originale |
| un suono compresso con perdita | da $96$ a $320\,\text{kbit/s}$ | MP3, AAC, Opus | ascoltare, inviare, pubblicare |

La compressione con perdita dell'audio elimina quello che l'orecchio non distingue: i suoni troppo acuti, e quelli deboli coperti da un suono forte nello stesso istante. Per la voce di un messaggio bastano poche decine di kbit/s, per la musica di solito se ne usano da $128$ in su.

## Un video è una sequenza di immagini

Un video è fatto di immagini ferme mostrate una dopo l'altra, così in fretta che l'occhio vede un movimento. Ogni immagine è un **fotogramma** (in inglese frame), e la **frequenza dei fotogrammi** dice quanti ne passano in un secondo: si misura in fotogrammi al secondo, abbreviati fps (frames per second). Il cinema ne usa $24$, la televisione europea $25$, molti telefoni $30$ o $60$.

Ogni fotogramma è un'immagine bitmap, con la sua risoluzione: $1920 \times 1080$ pixel per il formato chiamato Full HD. Con $24$ bit per pixel, cioè $3$ byte, la [dimensione di un'immagine](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-delle-immagini-pixel-e-colori) la sai già calcolare; per il video basta moltiplicarla per i fotogrammi.

$$\begin{aligned}& \text{byte} = \text{larghezza} \cdot \text{altezza} \cdot 3 \\ & \quad \cdot \text{fotogrammi al secondo} \cdot \text{secondi}\end{aligned}$$

```ad-example
Esempio 3: tre minuti di video non compresso
Quanto occupa il video delle prove, $1920 \times 1080$ pixel a $25$ fotogrammi al secondo, se dura tre minuti e non è compresso? Usa $1\,\text{GB} = 10^9\,\text{B}$.

1. Un fotogramma: $1920 \cdot 1080 \cdot 3 = 6\,220\,800\,\text{B}$, più di $6\,\text{MB}$.
2. Un secondo: $6\,220\,800 \cdot 25 = 155\,520\,000\,\text{B}$, cioè $155{,}52\,\text{MB}$.
3. Tre minuti, cioè $180$ secondi: $155\,520\,000 \cdot 180 = 27\,993\,600\,000\,\text{B}$, quasi $28\,\text{GB}$.

Il bitrate è $155\,520\,000 \cdot 8 = 1\,244\,160\,000\,\text{bit/s}$, più di $1200\,\text{Mbit/s}$: quasi nessuna connessione di casa lo regge.
```

Torna alla figura di prima e scegli "Un video": con gli stessi tre minuti, il file compresso a $5\,\text{Mbit/s}$ occupa $112{,}5\,\text{MB}$, circa $250$ volte meno. Una fotografia compressa bene diventa dieci o venti volte più piccola; per arrivare a $250$ serve un'altra idea.

## Tra un fotogramma e il successivo cambia poco

L'idea viene dal guardare due fotogrammi vicini. In un venticinquesimo di secondo il batterista ha mosso un braccio, e il muro dietro di lui è rimasto dov'era. Scrivere di nuovo tutto il muro, venticinque volte al secondo, è uno spreco: basta scrivere che cosa è cambiato.

Nella figura c'è un video piccolissimo, dieci fotogrammi di $16 \times 9 = 144$ pixel. A sinistra vedi il fotogramma, a destra solo i pixel diversi da quelli del fotogramma precedente. Vai avanti un passo alla volta e guarda quanti sono, finché arrivi al fotogramma 7.

```interattivo
% nome: inf-video-fotogrammi-differenza
% alt: Dieci fotogrammi di 16 per 9 pixel, da scorrere uno alla volta. Nei primi sei una palla rossa attraversa il cielo sopra un prato; negli ultimi quattro, dopo un cambio di scena, un'automobile avanza su una strada di notte. Accanto a ogni fotogramma sono colorati solo i pixel diversi dal fotogramma precedente: tutti i 144 nel primo e nel settimo, 8 quando si sposta la palla, 2 quando avanza l'automobile. Due contatori dicono quanti pixel sono cambiati e quanti ne sono stati scritti in tutto
```

Il primo fotogramma va scritto per intero, perché non ha niente prima. Poi, finché si muove solo la palla, cambiano $8$ pixel su $144$. Al settimo fotogramma la scena cambia e non si salva niente: conviene scriverlo di nuovo per intero. Alla fine i pixel scritti sono $334$ al posto di $10 \cdot 144 = 1440$.

Un video compresso è fatto così. Ogni tanto c'è un **fotogramma chiave**, completo, compresso come una fotografia; tra un fotogramma chiave e il successivo ci sono fotogrammi che contengono solo le differenze. Questa è la **compressione tra fotogrammi**, e si aggiunge a quella dentro ogni fotogramma. I programmi veri fanno di più di questo esempio: se un oggetto si sposta, scrivono "questo pezzo dell'immagine si è spostato di tanto" senza ridescriverne i pixel, e accettano piccole differenze che l'occhio non nota.

```ad-note
Perché i fotogrammi chiave non possono essere troppo rari
Per mostrare un fotogramma fatto di differenze bisogna aver ricostruito quelli prima, fino all'ultimo fotogramma chiave. Quando salti a metà di un video il lettore riparte dal fotogramma chiave più vicino; per questo ce n'è uno ogni pochi secondi, anche se la scena non cambia.
```

```ad-warning
Lo stesso bitrate non dà sempre la stessa qualità
Una lezione ripresa con la telecamera ferma ha fotogrammi quasi uguali, e a $2\,\text{Mbit/s}$ si vede bene. Una partita, dove tutto si muove, allo stesso bitrate si riempie di quadretti: le differenze sono troppe per i bit a disposizione.
```

## Codec e contenitore

Il modo in cui un suono o un video viene compresso è la sua codifica, e il programma che lo comprime e poi lo ricostruisce per riprodurlo è il codec: sono le due parole della lezione su [I formati dei file multimediali](/materiale/scuola-superiore/informatica/immagini-suoni-e-video-digitali/i-formati-dei-file-multimediali). MP3 e AAC sono codifiche per l'audio; per il video una molto diffusa è H.264. Parlando si usa spesso una parola per l'altra, e "il codec H.264" indica tutte e due le cose.

Un video da guardare ha però almeno due flussi, le immagini e l'audio, e spesso altri: una seconda lingua, i sottotitoli. Il file che li tiene insieme, e che dice in quale istante va mostrato ogni pezzo perché restino sincronizzati, è il contenitore: MP4, MKV e WebM sono contenitori. L'estensione del file dice quale contenitore è, non quali codifiche ci sono dentro.

```ad-warning
"Ho il file .mp4 ma non si apre"
Un lettore apre un video solo se conosce il contenitore e ha il codec di ogni traccia. Due file con la stessa estensione possono contenere video compressi con codifiche diverse: uno si vede e l'altro no, oppure si sente l'audio e lo schermo resta nero.
```

## Lo streaming

Con lo **streaming** il video viene riprodotto mentre arriva, senza aspettare di averlo scaricato tutto. Il lettore tiene da parte qualche secondo già ricevuto e intanto continua a chiedere i pezzi successivi.

Funziona a una condizione: i bit devono arrivare almeno alla velocità con cui vengono consumati, cioè la velocità della connessione non deve essere minore del bitrate del video. Se è minore, la scorta si svuota e il video si ferma a caricare. Per questo i servizi di streaming tengono lo stesso video in più versioni, a bitrate diversi, e il lettore passa dall'una all'altra secondo la connessione del momento: è il motivo per cui un video a volte comincia sgranato e dopo qualche secondo diventa nitido.

```ad-example
Esempio 4: regge o si ferma, e quanti dati consuma
Un film è disponibile a $8\,\text{Mbit/s}$ e a $3\,\text{Mbit/s}$. La tua connessione arriva a $5\,\text{Mbit/s}$. Quale versione vedi senza interruzioni, e quanti dati consuma in un'ora?

Quella a $3\,\text{Mbit/s}$, la sola con un bitrate minore della velocità della connessione. In un'ora, cioè $3600$ secondi, i byte sono $3\,000\,000 \cdot 3600 : 8 = 1\,350\,000\,000$, cioè $1{,}35\,\text{GB}$.
```

## Prova tu

Il primo programma fa il conto di un suono non compresso. Legge quattro numeri interi, uno per riga: la frequenza di campionamento in hertz, i bit per campione, il numero dei canali e la durata in secondi. Deve stampare quanti byte occupa il suono.

```codice python
frequenza = int(input())
bit = int(input())
canali = int(input())
secondi = int(input())
# scrivi qui il conto e stampa i byte
%% soluzione
frequenza = int(input())
bit = int(input())
canali = int(input())
secondi = int(input())
bitrate = frequenza * bit * canali
print(bitrate * secondi // 8)
%% prova
8000
8
1
10
%% stampa
80000
%% prova
44100
16
2
60
%% stampa
10584000
%% prova
48000
24
2
180
%% stampa
51840000
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int frequenza, bit, canali, secondi;
    cin >> frequenza >> bit >> canali >> secondi;
    // scrivi qui il conto e stampa i byte
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int frequenza, bit, canali, secondi;
    cin >> frequenza >> bit >> canali >> secondi;
    int bitrate = frequenza * bit * canali;
    cout << bitrate * secondi / 8 << endl;
    return 0;
}
```

Il secondo programma riguarda un video in streaming. Legge tre numeri interi: il bitrate del video in Mbit/s, la durata in minuti e la velocità della connessione in Mbit/s. Sulla prima riga stampa quanti MB di dati consuma il video (con $1\,\text{MB} = 1\,000\,000\,\text{B}$, e la divisione intera); sulla seconda stampa `regge` se la connessione basta, cioè se il bitrate non supera la velocità, altrimenti `si ferma`.

```codice python
bitrate = int(input())
minuti = int(input())
velocita = int(input())
# scrivi qui
%% soluzione
bitrate = int(input())
minuti = int(input())
velocita = int(input())
print(bitrate * minuti * 60 // 8)
if bitrate <= velocita:
    print("regge")
else:
    print("si ferma")
%% prova
5
10
20
%% stampa
375
regge
%% prova
8
90
6
%% stampa
5400
si ferma
%% prova
4
1
4
%% stampa
30
regge
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int bitrate, minuti, velocita;
    cin >> bitrate >> minuti >> velocita;
    // scrivi qui
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int bitrate, minuti, velocita;
    cin >> bitrate >> minuti >> velocita;
    cout << bitrate * minuti * 60 / 8 << endl;
    if (bitrate <= velocita) {
        cout << "regge" << endl;
    } else {
        cout << "si ferma" << endl;
    }
    return 0;
}
```
