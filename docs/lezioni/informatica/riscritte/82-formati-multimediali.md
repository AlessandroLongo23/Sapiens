# I formati dei file multimediali

Un compagno ti manda il video della gita e il tuo telefono risponde che non riesce ad aprirlo. La foto che hai scattato occupava quattro megabyte, e la stessa foto ricevuta in una chat ne occupa un decimo. Il logo della scuola, messo sulla locandina, ha attorno un rettangolo bianco che nessuno voleva. Sono tre problemi diversi con la stessa origine: il formato in cui il file è stato salvato.

## Che cos'è un formato

Un file è una sequenza di byte, e i byte da soli non dicono che cosa rappresentano: gli stessi otto bit possono essere un numero, una lettera o un pezzo del colore di un pixel. Un **formato di file** è l'insieme delle regole che dicono come leggere quei byte: in che ordine sono scritti i dati, quanti byte occupa ogni cosa, che cosa c'è all'inizio e che cosa viene dopo.

La stessa immagine si può scrivere in molti formati. Si possono mettere in fila i colori di tutti i pixel, come nella lezione [La codifica delle immagini](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-delle-immagini-pixel-e-colori), oppure scriverli in una forma più corta, da cui un programma li ricalcola. L'immagine sullo schermo è la stessa, ma i byte nel file sono del tutto diversi, e un programma che conosce le regole di un formato non sa leggere l'altro.

## L'estensione e il contenuto

Il formato si riconosce di solito dall'estensione, la parte del nome dopo l'ultimo punto, che hai incontrato nella lezione [Il file system](/materiale/scuola-superiore/informatica/il-sistema-operativo/il-file-system-file-cartelle-e-percorsi). L'estensione però è solo un pezzo del nome: chiunque la può cambiare, e i byte del file restano quelli di prima.

Per questo quasi tutti i formati cominciano con una **firma**: pochi byte, sempre gli stessi, che dicono di che formato si tratta. Un programma serio guarda la firma, non il nome.

| Formato | Primi byte, in esadecimale | Che cosa sono |
|---|---|---|
| PNG | `89 50 4E 47` | il byte 89, poi le lettere P, N, G in ASCII |
| JPEG | `FF D8 FF` | tre byte fissati dal formato |
| GIF | `47 49 46 38` | le lettere G, I, F e la cifra 8 |
| PDF | `25 50 44 46` | i caratteri %, P, D, F |

I byte sono scritti con due [cifre esadecimali](/materiale/scuola-superiore/informatica/i-sistemi-di-numerazione/il-sistema-esadecimale) ciascuno, e le lettere seguono la [codifica ASCII](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-dei-caratteri-ascii-e-unicode): $50_{16} = 80$ è la P.

Il programma qui sotto fa quello che fa un visualizzatore di immagini quando apre un file: confronta i primi byte con le firme che conosce. Nei due linguaggi un numero che comincia con `0x` è scritto in esadecimale. Per distinguere i quattro formati della tabella bastano i primi due byte, e il programma guarda quelli. Il file dell'esempio si chiama `gita.png`, ma i suoi primi byte raccontano un'altra storia: eseguilo.

```codice python
def formato(primi):
    if primi[0] == 0x89 and primi[1] == 0x50:
        return "png"
    if primi[0] == 0xFF and primi[1] == 0xD8:
        return "jpg"
    if primi[0] == 0x47 and primi[1] == 0x49:
        return "gif"
    if primi[0] == 0x25 and primi[1] == 0x50:
        return "pdf"
    return "sconosciuto"

estensione = "png"
primi = [0xFF, 0xD8, 0xFF, 0xE0]

contenuto = formato(primi)
print("L'estensione dice:", estensione)
print("I primi byte dicono:", contenuto)
if contenuto == estensione:
    print("Nome e contenuto vanno d'accordo.")
else:
    print("Il file è stato rinominato: dentro è rimasto", contenuto)
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

string formato(int primi[]) {
    if (primi[0] == 0x89 && primi[1] == 0x50) {
        return "png";
    }
    if (primi[0] == 0xFF && primi[1] == 0xD8) {
        return "jpg";
    }
    if (primi[0] == 0x47 && primi[1] == 0x49) {
        return "gif";
    }
    if (primi[0] == 0x25 && primi[1] == 0x50) {
        return "pdf";
    }
    return "sconosciuto";
}

int main() {
    string estensione = "png";
    int primi[4] = {0xFF, 0xD8, 0xFF, 0xE0};

    string contenuto = formato(primi);
    cout << "L'estensione dice: " << estensione << endl;
    cout << "I primi byte dicono: " << contenuto << endl;
    if (contenuto == estensione) {
        cout << "Nome e contenuto vanno d'accordo." << endl;
    } else {
        cout << "Il file è stato rinominato: dentro è rimasto " << contenuto << endl;
    }
    return 0;
}
```

Il programma scopre che dentro `gita.png` c'è un JPEG. Ora metti in `primi` i byte `0x89`, `0x50`, `0x4E`, `0x47` e controlla che nome e contenuto vadano d'accordo; poi cambia l'estensione in `"gif"` lasciando gli stessi byte, e guarda che cosa risponde.

```ad-warning
Rinominare non è convertire
Cambiare `gita.jpg` in `gita.png` cambia il nome e nient'altro: i byte sono ancora quelli di un JPEG. Per passare da un formato a un altro serve un programma che legga i dati con le regole del primo e li riscriva con le regole del secondo: si chiama conversione, e di solito si fa con "Esporta" o "Salva con nome".
```

## Contenitore e codifica

Un video non è una cosa sola. Ci sono le immagini, c'è l'audio, a volte ci sono i sottotitoli e una seconda lingua. Il file che li tiene insieme è un **contenitore**: un formato che stabilisce come impacchettare più flussi di dati, chiamati tracce, e come tenerli sincronizzati. Come sono scritti i dati dentro ogni traccia è un'altra faccenda, e la decide la **codifica**. Il programma che codifica quando si salva e decodifica quando si riproduce si chiama **codec**, da codificatore e decodificatore.

```tikz
% nome: contenitore-e-tracce
% alt: Un rettangolo grande con il nome gita.mp4 e la scritta contenitore; dentro, tre fasce una sotto l'altra: la traccia video con codifica H.264, la traccia audio con codifica AAC, la traccia dei sottotitoli che è testo
\begin{tikzpicture}
\draw[thick, rounded corners=6pt, fill=blue!10] (0,0) rectangle (7.4,3.9);
\node[font=\small\ttfamily, anchor=west] at (0.3,3.45) {gita.mp4};
\node[font=\small, anchor=east] at (7.1,3.45) {contenitore};
\draw[thick, fill=orange!25] (0.3,2.15) rectangle (7.1,2.95);
\node[font=\small, anchor=west] at (0.5,2.55) {traccia video};
\node[font=\small, anchor=east] at (6.9,2.55) {codifica H.264};
\draw[thick, fill=orange!25] (0.3,1.2) rectangle (7.1,2.0);
\node[font=\small, anchor=west] at (0.5,1.6) {traccia audio};
\node[font=\small, anchor=east] at (6.9,1.6) {codifica AAC};
\draw[thick, fill=orange!25] (0.3,0.25) rectangle (7.1,1.05);
\node[font=\small, anchor=west] at (0.5,0.65) {sottotitoli};
\node[font=\small, anchor=east] at (6.9,0.65) {testo};
\end{tikzpicture}
```

L'estensione `.mp4` dice quale contenitore è, non quali codifiche ci sono dentro. Ecco perché due file con la stessa estensione possono comportarsi in modo diverso: il lettore del tuo telefono sa aprire il contenitore, trova una traccia video scritta con una codifica che non conosce, e si ferma. Il video della gita che non partiva aveva questo problema. Codifiche e contenitori dei video sono l'argomento della lezione [Audio e video digitali](/materiale/scuola-superiore/informatica/immagini-suoni-e-video-digitali/audio-e-video-digitali).

Per le immagini la distinzione di solito non si vede, perché il formato fissa insieme l'involucro e la codifica: un file JPEG contiene un'immagine codificata nel modo JPEG.

## I formati più comuni

Per orientarsi tra i formati bastano poche domande, sempre le stesse. La prima riguarda la compressione, cioè il modo in cui il formato riduce i byte. Una compressione **senza perdita** permette di riavere i dati di partenza esatti, bit per bit. Una compressione **con perdita** butta via una parte dei dati, scelta tra quelli che occhio e orecchio notano meno, e in cambio produce file molto più piccoli. Come funzionano lo spiega la lezione [La compressione dei dati](/materiale/scuola-superiore/informatica/immagini-suoni-e-video-digitali/la-compressione-dei-dati-con-e-senza-perdita); qui conta sapere quale delle due usa ogni formato.

### Immagini

| Formato | Compressione | Trasparenza | Animazione |
|---|---|---|---|
| BMP | nessuna | no | no |
| JPEG | con perdita | no | no |
| PNG | senza perdita | sì | no |
| GIF | senza perdita, $256$ colori | sì, senza sfumature | sì |
| WebP | con o senza perdita | sì | sì |
| SVG | vettoriale | sì | sì |

BMP scrive i pixel così come sono, e i suoi file sono enormi. GIF non perde niente, ma solo dopo aver ridotto l'immagine a $256$ colori al massimo. La **trasparenza** è la possibilità di dire, per ogni pixel, quanto lascia vedere quello che gli sta dietro. Un logo salvato in un formato senza trasparenza porta con sé il suo rettangolo di sfondo: è il rettangolo bianco della locandina. SVG è diverso da tutti gli altri perché non contiene pixel ma forme, e ne parla la lezione [Grafica bitmap e grafica vettoriale](/materiale/scuola-superiore/informatica/immagini-suoni-e-video-digitali/grafica-bitmap-e-grafica-vettoriale).

Una schermata piena di testo va salvata in JPEG o in PNG? E il logo della scuola? Nella figura scegli a che cosa serve l'immagine e leggi, per ogni formato, se va bene e perché. Passa da "Fotografia" a "Schermata" e guarda i due formati che si scambiano di posto.

```interattivo
% nome: inf-scegli-formato
% alt: Cinque scopi tra cui scegliere, fotografia, logo, schermata, animazione, sfondo trasparente, e sotto i cinque formati JPEG, PNG, GIF, WebP e SVG, ognuno con un giudizio, adatto, si può oppure no, e il motivo. Per una fotografia sono adatti JPEG e WebP; per un logo SVG; per una schermata PNG e WebP; per un'animazione GIF e WebP; per lo sfondo trasparente PNG, WebP e SVG
```

Per la fotografia vince JPEG e per la schermata vince PNG, e il motivo è lo stesso visto da due lati. La compressione con perdita lavora bene dove i colori cambiano poco per volta, come nel cielo di una foto, e lavora male sui bordi netti, come quelli delle lettere, attorno ai quali lascia degli aloni. Una schermata ha grandi zone di un colore solo, che si comprimono bene anche senza perdere niente.

### Audio

| Formato | Compressione | Fatto per |
|---|---|---|
| WAV | di solito nessuna | registrare e lavorare sul suono |
| FLAC | senza perdita | conservare la musica alla qualità originale |
| MP3, AAC, Opus | con perdita | ascoltare: musica, podcast, messaggi vocali |

Un minuto di musica non compressa occupa una decina di megabyte, come hai calcolato nella lezione [La codifica dei suoni](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-dei-suoni). Un formato senza perdita lo porta a poco più della metà, uno con perdita a circa un decimo.

### Video

Per i video l'estensione indica il contenitore: MP4 è il più diffuso, WebM è nato per le pagine web, MKV accetta quasi ogni codifica e molte tracce, AVI è un contenitore più vecchio che si incontra ancora. I video sono quasi sempre compressi con perdita, perché senza compressione pochi minuti riempirebbero la memoria di un telefono.

### Documenti

| Formato | Che cosa conserva | Fatto per |
|---|---|---|
| TXT | solo i caratteri | appunti, dati, programmi |
| DOCX, ODT | testo, stili, immagini | documenti da continuare a modificare |
| PDF | le pagine così come vanno stampate | documenti finiti, da leggere e da consegnare |

Un file DOCX o ODT è a sua volta un contenitore: un archivio compresso con dentro il testo in XML e le immagini, ciascuna nel suo formato. La firma lo tradisce, perché i suoi primi byte sono quelli di un archivio ZIP. Di XML parla la lezione [Dati strutturati: XML e JSON](/materiale/scuola-superiore/informatica/i-file/dati-strutturati-xml-e-json).

## Formati aperti e formati proprietari

Un **formato aperto** ha regole pubbliche, scritte in un documento che chiunque può leggere e usare per costruire un programma che apre e salva quei file, senza chiedere il permesso a nessuno. Sono aperti, tra gli altri, TXT, PNG, SVG, FLAC, ODT, WebM e PDF.

Un **formato proprietario** appartiene a un'azienda, che ne tiene segrete le regole oppure decide chi le può usare e a quali condizioni. Sono di questo tipo i formati con cui molti programmi di grafica e di montaggio salvano i loro progetti.

La differenza si vede con il tempo. Un file in un formato aperto si potrà aprire anche tra vent'anni, perché chiunque potrà scrivere un programma che lo legge. Un file in un formato proprietario dipende da un programma solo: se l'azienda smette di venderlo, o cambia formato, il file rischia di restare chiuso. Per questo ciò che si vuole conservare a lungo, o scambiare con chi usa programmi diversi, si salva in un formato aperto.

```ad-note
Aperto non vuol dire gratuito, né senza compressione
"Aperto" riguarda le regole del formato, non il prezzo dei programmi né la qualità dei dati. Esistono formati aperti con perdita, e programmi a pagamento che salvano in formati aperti.
```

## Come scegliere un formato

Davanti a "Salva con nome" le domande da farsi sono quattro, in quest'ordine.

1. Che cosa contiene? Una foto, un disegno fatto di forme, una schermata, un suono, un testo: è il contenuto a decidere quali formati hanno senso.
2. Ci devo lavorare ancora? Se sì, serve un formato che non butti via niente: senza perdita per immagini e suoni, modificabile per i testi.
3. Chi lo deve aprire, e con che cosa? Un formato diffuso e aperto si apre dappertutto; il formato di un programma particolare solo con quel programma.
4. Quanto può pesare? Per un allegato o una pagina web conta ogni megabyte, e allora la compressione con perdita è la scelta giusta.

```ad-example
Esempio 1: la relazione di scienze
Hai scritto la relazione con un programma di videoscrittura e la devi consegnare alla professoressa. In che formato la tieni, e in che formato la mandi?

Per te tieni il file modificabile, ODT o DOCX: ti servirà per correggerla. Alla professoressa mandi un PDF: la relazione è finita, deve leggerla così come l'hai impaginata, e il PDF si apre allo stesso modo su ogni dispositivo.
```

```ad-example
Esempio 2: le foto per il giornalino
Hai ritoccato venti foto per il giornalino della scuola, che esce sul sito. In che formato le salvi?

Le foto ritoccate vanno sul sito in JPEG o in WebP: sono fotografie, devono pesare poco, e la perdita non si nota. Gli originali, però, li conservi: ogni salvataggio con perdita butta via qualcosa, e ripartire dall'originale è l'unico modo per non accumulare i danni.
```

```ad-warning
Convertire non restituisce quello che è stato buttato via
Trasformare un MP3 in WAV, o un JPEG in PNG, produce un file più grande con la stessa qualità di prima. I dati eliminati dalla compressione con perdita non ci sono più, e nessun formato li può ricostruire. La conversione ha senso nell'altro verso: dall'originale senza perdita alla copia leggera.
```

## Prova tu

Il primo esercizio lavora sull'estensione. Completa la funzione `famiglia`, che riceve un'estensione e restituisce `immagine` per `jpg`, `png`, `gif` e `svg`, `audio` per `wav`, `mp3` e `flac`, `video` per `mp4` e `webm`, `documento` per `txt`, `odt` e `pdf`, e `sconosciuto` per tutte le altre. Il programma legge un'estensione e scrive la famiglia.

```codice python
def famiglia(estensione):
    # scrivi qui
    return "sconosciuto"

estensione = input()
print(famiglia(estensione))
%% soluzione
def famiglia(estensione):
    if estensione == "jpg" or estensione == "png" or estensione == "gif" or estensione == "svg":
        return "immagine"
    if estensione == "wav" or estensione == "mp3" or estensione == "flac":
        return "audio"
    if estensione == "mp4" or estensione == "webm":
        return "video"
    if estensione == "txt" or estensione == "odt" or estensione == "pdf":
        return "documento"
    return "sconosciuto"

estensione = input()
print(famiglia(estensione))
%% prova
png
%% stampa
immagine
%% prova
flac
%% stampa
audio
%% prova
webm
%% stampa
video
%% prova
pdf
%% stampa
documento
%% prova
xyz
%% stampa
sconosciuto
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

string famiglia(string estensione) {
    // scrivi qui
    return "sconosciuto";
}

int main() {
    string estensione;
    cin >> estensione;
    cout << famiglia(estensione) << endl;
    return 0;
}
%% soluzione
#include <iostream>
#include <string>
using namespace std;

string famiglia(string estensione) {
    if (estensione == "jpg" || estensione == "png" || estensione == "gif" || estensione == "svg") {
        return "immagine";
    }
    if (estensione == "wav" || estensione == "mp3" || estensione == "flac") {
        return "audio";
    }
    if (estensione == "mp4" || estensione == "webm") {
        return "video";
    }
    if (estensione == "txt" || estensione == "odt" || estensione == "pdf") {
        return "documento";
    }
    return "sconosciuto";
}

int main() {
    string estensione;
    cin >> estensione;
    cout << famiglia(estensione) << endl;
    return 0;
}
```

Il secondo lavora sul contenuto. Il programma legge un'estensione e poi i primi quattro byte di un file, scritti come numeri in base dieci. Deve scrivere su una riga il formato che i byte indicano (`png`, `jpg`, `gif`, `pdf` oppure `sconosciuto`) e sulla riga dopo `coerente` se coincide con l'estensione, `rinominato` altrimenti. Le firme sono quelle della tabella: in base dieci, $89_{16} = 137$, $50_{16} = 80$, $\text{4E}_{16} = 78$, $47_{16} = 71$, $\text{FF}_{16} = 255$, $\text{D8}_{16} = 216$, $49_{16} = 73$, $46_{16} = 70$, $38_{16} = 56$, $25_{16} = 37$, $44_{16} = 68$.

```codice python
estensione = input()
primi = []
for i in range(4):
    primi.append(int(input()))

# scrivi qui
%% soluzione
def formato(primi):
    if primi[0] == 137 and primi[1] == 80:
        return "png"
    if primi[0] == 255 and primi[1] == 216:
        return "jpg"
    if primi[0] == 71 and primi[1] == 73:
        return "gif"
    if primi[0] == 37 and primi[1] == 80:
        return "pdf"
    return "sconosciuto"

estensione = input()
primi = []
for i in range(4):
    primi.append(int(input()))

contenuto = formato(primi)
print(contenuto)
if contenuto == estensione:
    print("coerente")
else:
    print("rinominato")
%% prova
png
137
80
78
71
%% stampa
png
coerente
%% prova
png
255
216
255
224
%% stampa
jpg
rinominato
%% prova
gif
71
73
70
56
%% stampa
gif
coerente
%% prova
pdf
80
75
3
4
%% stampa
sconosciuto
rinominato
%% prova
jpg
37
80
68
70
%% stampa
pdf
rinominato
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string estensione;
    int primi[4];
    cin >> estensione;
    for (int i = 0; i < 4; i++) {
        cin >> primi[i];
    }

    // scrivi qui
    return 0;
}
%% soluzione
#include <iostream>
#include <string>
using namespace std;

string formato(int primi[]) {
    if (primi[0] == 137 && primi[1] == 80) {
        return "png";
    }
    if (primi[0] == 255 && primi[1] == 216) {
        return "jpg";
    }
    if (primi[0] == 71 && primi[1] == 73) {
        return "gif";
    }
    if (primi[0] == 37 && primi[1] == 80) {
        return "pdf";
    }
    return "sconosciuto";
}

int main() {
    string estensione;
    int primi[4];
    cin >> estensione;
    for (int i = 0; i < 4; i++) {
        cin >> primi[i];
    }

    string contenuto = formato(primi);
    cout << contenuto << endl;
    if (contenuto == estensione) {
        cout << "coerente" << endl;
    } else {
        cout << "rinominato" << endl;
    }
    return 0;
}
```
