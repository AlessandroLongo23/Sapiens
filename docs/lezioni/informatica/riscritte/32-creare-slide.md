# Slide efficaci: testo, immagini e grafici

Una slide viene guardata per pochi secondi da qualcuno che intanto ti ascolta, spesso dal fondo di un'aula. Se in quei secondi capisce che cosa dice la slide, torna ad ascoltare te; se deve leggere dieci righe, smette di ascoltarti. Le regole di questa lezione servono tutte a questo, e si applicano quando la [scaletta della presentazione](/materiale/scuola-superiore/informatica/documenti-di-testo-e-presentazioni/progettare-una-presentazione) è già pronta.

## Poco testo

La slide non è il tuo discorso scritto. Chi presenta leggendo le slide volta le spalle al pubblico, e il pubblico, che legge più in fretta di quanto tu parli, arriva in fondo prima di te e si distrae. Sulla slide vanno le parole che aiutano a seguire: il titolo, che dice l'idea, e pochi punti brevi. Il resto lo dici a voce.

Una regola pratica per non sbagliare: al massimo $6$ righe di testo sotto il titolo, e ogni riga di poche parole, senza frasi intere.

```ad-example
Esempio 1: da un paragrafo a tre punti
Sulla slide di Anna c'è scritto: "Nel mese di ottobre abbiamo contato tutte le bottigliette di plastica buttate nel cestino della classe e abbiamo visto che erano 120; poi a novembre, dopo aver portato le borracce, le abbiamo contate di nuovo ed erano diventate 60." Come si riscrive?

Il titolo dice l'idea: "In un mese le bottigliette sono dimezzate". Sotto, tre righe: "Ottobre: 120 bottigliette", "Novembre, con le borracce: 60", "La metà in un mese". Come avete contato e chi ha portato le borracce lo racconta Anna a voce.
```

## Testo che si legge dal fondo dell'aula

Perché un testo proiettato si legga servono caratteri grandi e un buon contrasto con lo sfondo.

La dimensione: almeno $24$ punti per il testo, e di più per i titoli. Se per farci stare tutto devi scendere sotto i $24$ punti, il testo è troppo: si toglie testo, non si rimpicciolisce il carattere.

Il **contrasto** è la differenza di luminosità tra il testo e lo sfondo. Funzionano il testo scuro su uno sfondo chiaro (nero su bianco) e il testo chiaro su uno sfondo scuro (bianco su blu scuro). Non funzionano due colori chiari insieme, come il giallo chiaro sul bianco, né due scuri, come il blu scuro sul nero: sullo schermo del tuo computer si distinguono, proiettati in un'aula con le luci accese spariscono. Uno sfondo fatto con una fotografia è chiaro in alcuni punti e scuro in altri, e il testo sopra si legge a tratti.

| Regola | Va bene | Non va bene |
|---|---|---|
| al massimo $6$ righe di testo | $4$ righe brevi | $9$ righe |
| almeno $24$ punti | testo di $28$ punti | testo di $16$ punti |
| testo e sfondo, uno chiaro e uno scuro | bianco su blu scuro | grigio chiaro su bianco |

```tikz
% nome: slide-carica-e-slide-pulita
% alt: Due slide a confronto. Quella di sinistra, carica, ha un titolo, nove righe fitte di testo piccolo e tre immagini piccole in fila in basso. Quella di destra, pulita, ha un titolo, tre righe brevi di testo grande e una sola immagine grande accanto
% svg: slide-carica-e-slide-pulita-0f94a360.svg 368x121
\begin{tikzpicture}
\draw[thick, fill=gray!8] (0,0) rectangle (4.4,2.5);
\draw[line width=2pt, blue!60!black] (0.25,2.2) -- (3.2,2.2);
\foreach \y in {1.92,1.78,1.64,1.50,1.36,1.22,1.08,0.94} {\draw[line width=0.7pt, gray!70] (0.25,\y) -- (4.15,\y);}
\draw[line width=0.7pt, gray!70] (0.25,0.80) -- (2.6,0.80);
\foreach \x in {0.25,1.65,3.05} {\draw[fill=orange!30] (\x,0.12) rectangle (\x+1.1,0.66);}
\node[font=\small] at (2.2,-0.35) {carica};
\draw[thick, fill=gray!8] (5.2,0) rectangle (9.6,2.5);
\draw[line width=2pt, blue!60!black] (5.45,2.2) -- (8.0,2.2);
\foreach \y/\l in {1.55/1.5,1.1/1.2,0.65/1.6} {\draw[line width=1.6pt, gray!70] (5.6,\y) -- (5.6+\l,\y); \fill[gray!70] (5.47,\y) circle (0.04);}
\draw[fill=orange!30] (7.6,0.3) rectangle (9.35,1.8);
\draw[thick] (7.6,0.3) -- (8.15,1.0) -- (8.6,0.6) -- (9.0,1.2) -- (9.35,0.8);
\node[font=\small] at (7.4,-0.35) {pulita};
\end{tikzpicture}
```

```ad-example
Esempio 2: controllare una slide
Una slide ha il titolo e $8$ righe di testo di $20$ punti, grigio scuro su sfondo bianco. Quali regole rispetta?

Le righe sono $8$, più di $6$: troppe. I caratteri sono di $20$ punti, meno di $24$: troppo piccoli. Il contrasto va bene, perché il testo è scuro e lo sfondo chiaro. I due difetti hanno la stessa causa, troppo testo: tolte quattro righe, quelle che restano possono salire a $28$ punti.
```

```ad-warning
Provarla solo sul proprio schermo
A cinquanta centimetri dal portatile si legge tutto. Per sapere se una slide regge, mettila a schermo intero e guardala dal fondo della stanza, oppure rimpiccioliscila finché è grande come una carta da gioco: quello che non leggi così, il pubblico non lo leggerà.
```

## Immagini e grafici che dicono una cosa sola

Un'immagine sta sulla slide se mostra l'idea della slide: la foto del cestino pieno di bottigliette, lo schema di come funziona un vulcano. Un'immagine messa per riempire uno spazio vuoto è un'idea in più, e una slide ne regge una. Vale lo stesso per il numero: un'immagine grande al posto di quattro piccole.

Un grafico in una presentazione ha lo stesso compito. Dei dati che hai raccolto mostra solo quelli che servono all'idea, con un titolo che dice che cosa si deve vedere. Per dire che le bottigliette sono dimezzate servono due barre, ottobre e novembre; la tabella con i conteggi di tutti i giorni è il lavoro che c'è dietro e, se qualcuno la chiede, si mostra dopo. Quale tipo di grafico scegliere lo spiega la lezione [Grafici per rappresentare i dati](/materiale/scuola-superiore/informatica/il-foglio-di-calcolo/grafici-per-rappresentare-i-dati).

```ad-warning
Stirare un'immagine
Un'immagine tirata da un lato solo si deforma: le persone diventano larghe o strette. Si ingrandisce trascinando un angolo, così larghezza e altezza crescono insieme.
```

### Quanti pixel servono a un'immagine

Un'immagine è una griglia di pixel, come spiega la lezione [La codifica delle immagini: pixel e colori](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-delle-immagini-pixel-e-colori), e anche il proiettore ne ha un numero fisso: uno schermo Full HD ha $1920$ pixel in larghezza e $1080$ in altezza. Se l'immagine ha meno pixel dello spazio che deve coprire, il programma la ingrandisce e i bordi diventano sgranati. Il controllo si fa così:

1. prendi la larghezza dello schermo in pixel;
2. moltiplicala per la frazione della larghezza della slide che l'immagine occupa: ottieni i pixel che servono;
3. confrontali con la larghezza dell'immagine: se l'immagine ne ha almeno altrettanti, va bene.

```ad-example
Esempio 3: un'immagine a tutta larghezza
Lo schermo è largo $1920$ pixel e Luca vuole una foto larga quanto la slide. La foto è larga $1280$ pixel. Va bene?

Servono $1920 \cdot 1 = 1920$ pixel. La foto ne ha $1280$, meno di $1920$: verrà ingrandita e si vedrà sgranata.
```

```ad-example
Esempio 4: un'immagine su metà slide
Sullo stesso schermo Sara mette una foto larga $1200$ pixel nella metà destra della slide. Va bene?

Servono $1920 \cdot \dfrac{1}{2} = 960$ pixel. La foto ne ha $1200$: va bene.
```

```ad-example
Esempio 5: un terzo della slide
Uno schermo è largo $3840$ pixel. Un'immagine deve occupare un terzo della larghezza della slide. Quanti pixel di larghezza deve avere almeno?

$3840 \cdot \dfrac{1}{3} = 1280$ pixel. Un'immagine larga $1000$ pixel, che sullo schermo Full HD degli esempi precedenti sarebbe bastata per un terzo della slide ($1920 : 3 = 640$), qui non basta.
```

## Tutte le slide con lo stesso aspetto

In una presentazione ordinata i titoli stanno sempre nello stesso punto, con lo stesso carattere e lo stesso colore, e i caratteri diversi sono al massimo due. Così il pubblico impara alla prima slide dove guardare, e nota subito quello che cambia: il contenuto.

Questa uniformità non si ottiene sistemando le slide una per una. Ogni presentazione ha uno **schema delle diapositive**, un modello che contiene quello che le slide hanno in comune: sfondo, caratteri, colori, posizione del titolo e del testo, il logo della scuola. Una modifica fatta nello schema arriva a tutte le slide, come una modifica a uno stile arriva a tutti i paragrafi che lo usano (lezione [Stili, titoli, tabelle e indici automatici](/materiale/scuola-superiore/informatica/documenti-di-testo-e-presentazioni/stili-titoli-tabelle-e-indici-automatici)). Quello che riguarda una slide sola, come la sua immagine o il suo testo, si cambia in quella slide.

```tikz
% nome: schema-delle-diapositive
% alt: In alto un riquadro chiamato schema, con una barra del titolo blu e un piccolo logo in un angolo. Tre frecce scendono verso tre slide, che hanno la stessa barra del titolo nello stesso punto e lo stesso logo, ma contenuti diversi: righe di testo, un'immagine, un grafico a barre
% svg: schema-delle-diapositive-10a6d426.svg 307x165
\begin{tikzpicture}
\draw[thick, fill=blue!10] (2.7,2.3) rectangle (5.3,3.8);
\draw[line width=2pt, blue!60!black] (2.9,3.5) -- (4.4,3.5);
\draw[fill=orange!30] (4.85,2.4) rectangle (5.2,2.65);
\node[font=\small] at (4.0,4.05) {schema};
\foreach \x in {0,2.9,5.8} {
\draw[thick, fill=gray!8] (\x,0) rectangle (\x+2.2,1.3);
\draw[line width=1.6pt, blue!60!black] (\x+0.15,1.05) -- (\x+1.4,1.05);
\draw[fill=orange!30] (\x+1.8,0.08) rectangle (\x+2.1,0.3);
}
\draw[-{Stealth}, thick] (3.2,2.3) -- (1.1,1.4);
\draw[-{Stealth}, thick] (4.0,2.3) -- (4.0,1.4);
\draw[-{Stealth}, thick] (4.8,2.3) -- (6.9,1.4);
\foreach \y in {0.75,0.55,0.35} {\draw[line width=1.1pt, gray!70] (0.2,\y) -- (1.3,\y);}
\draw[fill=green!20] (3.1,0.2) rectangle (4.3,0.8);
\foreach \x/\h in {6.0/0.3,6.35/0.5,6.7/0.2} {\draw[fill=green!20] (\x,0.2) rectangle (\x+0.25,0.2+\h);}
\end{tikzpicture}
```

## Animazioni e transizioni, con misura

Un'**animazione** è un effetto applicato a un elemento dentro una slide: un punto dell'elenco che compare, un'immagine che entra. Una **transizione** è l'effetto con cui si passa da una slide alla successiva.

Un'animazione ha un uso che aiuta: far comparire i punti uno alla volta mentre li spieghi, così il pubblico non legge il terzo mentre parli del primo. Tutto il resto, cioè scritte che ruotano, slide che entrano a scacchi, suoni, attira l'attenzione sull'effetto e la toglie a quello che dici. Se usi una transizione, usa la stessa per tutta la presentazione.

## Le fonti delle immagini e il diritto d'autore

Un'immagine trovata in rete ha un autore, e per legge è l'autore a decidere chi può usarla: è il **diritto d'autore**, che vale anche quando accanto all'immagine non c'è scritto niente. Che un'immagine si possa scaricare non vuol dire che si possa usare.

Molti autori dichiarano in anticipo che cosa permettono con una **licenza**. Le più diffuse sono le licenze Creative Commons: la licenza CC BY, per esempio, permette a chiunque di usare l'opera a patto di indicarne l'autore. Le opere nel pubblico dominio si possono usare senza condizioni. Se la licenza non c'è, o dice "tutti i diritti riservati", serve il permesso dell'autore.

| Da dove viene l'immagine | Si può usare? |
|---|---|
| l'hai fatta tu (una foto, un disegno, un grafico con i tuoi dati) | sì, è tua |
| ha una licenza che lo permette, come CC BY | sì, citando l'autore e la licenza |
| "tutti i diritti riservati", o nessuna licenza indicata | solo con il permesso dell'autore |

In ogni caso la fonte delle immagini non tue si scrive: sotto l'immagine in piccolo, oppure tutte insieme nell'ultima slide, con l'autore, il sito da cui viene e la licenza.

```ad-example
Esempio 6: tre immagini per una presentazione
Per la presentazione sui vulcani Pietro ha tre immagini: una foto dell'Etna scattata da lui in gita, uno schema preso da un'enciclopedia in rete con licenza CC BY, la foto di un'eruzione dal sito di un fotografo, con la scritta "tutti i diritti riservati". Quali può usare?

La sua foto senza chiedere a nessuno. Lo schema sì, scrivendo sotto l'autore, il sito e la licenza. La foto del fotografo solo se gli scrive e ottiene il permesso; altrimenti ne cerca un'altra con una licenza che ne permetta l'uso.
```

```ad-warning
"L'ho trovata con il motore di ricerca"
Il motore di ricerca non è la fonte, e non è l'autore: mostra immagini che stanno su altri siti. La fonte è la pagina da cui l'immagine viene, ed è lì che si trovano l'autore e la licenza.
```
