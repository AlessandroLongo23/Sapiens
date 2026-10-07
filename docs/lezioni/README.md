# Revisione delle lezioni di matematica

Le 18 lezioni pubblicate sul sito sono state riscritte il 23 settembre 2026 e caricate nel database lo
stesso giorno, al posto degli originali (colonna `theory` di `content_nodes`).

- `originali/`: il testo della colonna `theory` di `content_nodes` al 23 settembre 2026, con
  `index.json` (id, percorso, data di aggiornamento).
- `riscritte/`: le versioni nuove, quelle ora nel database.
- `note/`: per ogni lezione, gli errori trovati nell'originale, cosa è cambiato e i dubbi.
- `stile.md`: il brief con cui sono state scritte, proposta per lo standard di qualità.
- `url.md`: le lezioni di matematica con il loro URL, per i link interni (rigenerato dall'albero).
- `programma.md`: il confronto con le Indicazioni nazionali e con YouMath e Theoremz.
- `albero.md`: l'albero delle lezioni di matematica, applicato al database con
  `scripts/lezioni/tree.mts` (prima senza scrivere, poi con `--apply`).
- `prerequisiti.md`: il grafo dei prerequisiti (una riga per lezione), controllato con
  `scripts/lezioni/prerequisiti.mts`; con `--write` rigenera `src/lib/content/prerequisiti.json`, che le
  pagine delle lezioni leggono per "Prima di cominciare" e "Dove si usa". `prerequisiti-layout.json` è la sua disposizione come albero
  delle abilità, generata da `node scripts/grafo/layout.mjs` (la prima volta serve `npm install` in
  `scripts/grafo`; con `--html file.html` scrive anche un'anteprima).
- `backup/`: i nodi di matematica com'erano prima della riorganizzazione del 24 settembre 2026.
- `pubblicate/`: la copia dell'ultima versione che lo script ha scritto nel database.

Le figure TikZ vengono compilate in SVG dallo script di pubblicazione (`scripts/figure/`, con
dipendenze proprie: la prima volta serve `npm install` in quella cartella), caricate nel bucket
`figure` di Supabase Storage e mostrate come `<img>` con il testo di `% alt`. Il funzionamento è
spiegato in `src/lib/content/figures.ts`.

Per tornare a un originale basta rimettere il suo file nella colonna `theory`. Per pubblicare una
versione nuova: `node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/publish.mts`
(prova), poi con `--apply`. Lo script scrive solo se nel database c'è ancora l'ultima versione che ha
pubblicato (`pubblicate/`, oppure `originali/` prima della prima pubblicazione): se qualcuno ha
modificato la lezione dall'interfaccia, la salta. Per correggere una lezione basta modificare il file
in `riscritte/` e rilanciare lo script.

## Il piano cartesiano con i cursori

Un blocco `grafico` monta nella lezione il piano del plotter, con le formule già scritte: lo studente muove i
cursori e legge, non scrive. Messo subito dopo una figura TikZ la prende come copertina: la pagina mostra la
figura, e il bottone "Prova tu" mette il piano al suo posto (la figura resta per Google Immagini e per la stampa);
la croce nell'angolo del piano la riporta.
Da solo, il piano compare quando la pagina ci arriva.

````
```grafico
% nome: parabola-vertice-discriminante
% alt: La parabola y = ax² + bx + c con i cursori dei tre coefficienti, il discriminante e il vertice
curva: f(x)=ax^2+bx+c | nome
curva: y=x^2 | tratteggiata | grigio
cursore: a = 1 da -3 a 3 passo 0,1
cursore: b = -4 da -6 a 6 passo 0,1
cursore: c = 3 da -6 a 6 passo 0,1
finestra: x da -6 a 8, y da -5 a 7
valore: \Delta = b^2-4ac
valore: V = \left(-\frac{b}{2a};c-\frac{b^2}{4a}\right)
domanda: Muovi $c$ finché $\Delta = 0$: dove sta il vertice?
```
````

Una riga, una cosa:
- `curva:` una formula come la legge il plotter (funzione, equazione, disequazione, punto `A=(2;1)`, curva in
  `t`), poi l'aspetto dopo ` | `: `tratteggiata`, `a punti`, `sottile`, `spessa`, `nome` (la lettera accanto alla
  curva), un colore (`blu`, `rosso`, `verde`, `arancione`, `viola`, `verde acqua`, `magenta`, `nero`, `grigio`),
  `t da 0 a 2pi`.
- `scelta:` una delle formule tra cui sceglie un controllo a segmenti, `etichetta :: formula`, con un colore suo
  dopo ` | ` se serve (blu dove il trinomio è positivo, rosso dove è negativo); servono almeno due righe, e fanno
  una sola curva.
- `cursore:` `a = 1 da -3 a 3 passo 0,5`; con `anima` in fondo ha il bottone che lo muove da solo. Ogni lettera
  delle formule deve avere il suo.
- `finestra:` `x da -6 a 6, y da -4 a 8`. I due assi hanno la stessa scala; con `forma: 3:2` (larghezza e
  altezza del disegno) la scala dell'asse y si adatta, per i grafici di fisica.
- `valore:` un nome, `=`, e un'espressione dei parametri, o una coppia di coordinate: sta scritto sotto il piano
  e segue i cursori.
- `assi:` i nomi dei due assi, `t (s), s (m)`. `sposta: sì` lascia spostare e ingrandire la finestra.
- `domanda:` cosa provare, sotto il piano; le formule tra dollari.

Un blocco che non si legge non compare nella pagina (resta la figura di copertina): lo segnala il controllo
automatico qui sotto. Per vederlo prima di pubblicare, con il sito in sviluppo:
`/prova-grafico/lezione?file=riscritte/87-funzioni-quadratiche.md` (senza `file` apre `prove/grafico.md`, con
un esempio per ogni pezzo).

## I programmi da eseguire

Un blocco `codice` mette nella lezione l'editor con un programma che lo studente esegue e modifica. Il linguaggio
sta sulla riga del blocco: `python`, `c`, `cpp` oppure `javascript`. Il programma gira nel browser dello studente.

````
```codice python
for i in range(1, 6):
    print(i, "al quadrato fa", i * i)
```
````

Più blocchi uno dopo l'altro, separati solo da righe vuote e ciascuno in un linguaggio diverso, sono lo stesso
programma in più linguaggi: la pagina ne mostra uno, con una linguetta per linguaggio, e la scelta dello studente
vale per tutti i programmi e per le visite successive.

Con le prove il blocco è un esercizio. Le righe che cominciano con `%%` aprono le altre parti:

````
```codice python
n = int(input())
somma = 0
# scrivi qui il ciclo

print(somma)
%% soluzione
n = int(input())
somma = 0
for i in range(1, n + 1):
    somma += i

print(somma)
%% prova
4
%% stampa
10
%% prova
100
%% stampa
5050
```
````

- Prima di ogni `%%` c'è il programma di partenza, quello che lo studente trova nell'editor.
- `%% soluzione` è un programma che supera le prove; lo studente lo vede con il tasto "Soluzione".
- `%% prova` apre le righe che il programma legge, `%% stampa` quello che deve scrivere. "Verifica" esegue il
  programma su ogni prova e confronta l'uscita, senza contare gli spazi in fondo alle righe. Le prove si scrivono in
  un solo blocco e valgono per tutti i linguaggi.
- Nelle prove di Python la domanda di `input("...")` non viene stampata, quindi non entra nel confronto. In C e in
  C++ il programma dell'esercizio non deve scrivere domande prima di leggere.
- In JavaScript il programma legge con `prompt()` e scrive con `console.log()`; nelle prove la domanda di `prompt()`
  non viene stampata, come in Python.
- La consegna si scrive nel testo della lezione, prima del blocco.

Una pagina web è un gruppo di blocchi che comincia con `html`: i blocchi `html`, `css` e `js` uno dopo l'altro sono
i tre file della pagina (`index.html`, `style.css`, `script.js`), e lo studente li vede con una linguetta per file
accanto alla pagina che ne esce. La pagina collega gli altri due file come una pagina vera, con
`<link rel="stylesheet" href="style.css">` e `<script src="script.js"></script>`: un file non collegato non viene
applicato, e l'editor lo dice.

Una pagina non stampa niente, quindi il suo esercizio si corregge su quello che la pagina è. `%% controllo` è seguito
dalla frase che lo studente legge, e le righe sotto sono le regole: un selettore CSS e, dopo ` | `, la condizione.

````
```codice html
<h1></h1>
<ul>
    <li>Matematica</li>
</ul>
%% soluzione
<h1>Le mie materie</h1>
<ul>
    <li>Matematica</li>
    <li>Fisica</li>
</ul>
%% controllo Il titolo dice "Le mie materie"
h1 | testo = Le mie materie
%% controllo L'elenco ha due voci
ul > li | quanti = 2
```
````

| Regola | Cosa controlla |
|---|---|
| `h1` | il selettore trova almeno un elemento |
| `ul > li \| quanti = 3` | quanti elementi trova |
| `h1 \| testo = Ciao` | il testo del primo, senza contare gli spazi ripetuti |
| `p \| testo contiene Ciao` | il testo del primo contiene la parola |
| `a \| attributo href` | il primo ha l'attributo |
| `a \| attributo href = pagina.html` | l'attributo ha quel valore; per `href`, `src` e `action` due percorsi che portano allo stesso file sono uguali (`./pagina.html`, `pagina.html`) |
| `h1 \| stile color = blue` | lo stile calcolato dal browser; il valore si scrive come in CSS, anche una scorciatoia (`padding = 4px 8px`) |

Un progetto a più file è un gruppo di blocchi che hanno ciascuno il nome di un file: lo studente li vede con una
linguetta per file, nell'ordine in cui sono scritti, e il primo è quello aperto. Serve per due pagine che si
richiamano, per un programma con un modulo, per un C++ con il suo `.h`.

````
```codice index.html
<link rel="stylesheet" href="stile.css">
<a href="contatti.html">Contatti</a>
```

```codice contatti.html
<a href="index.html">Home</a>
```

```codice stile.css
a { color: teal; }
```
````

- I nomi possono avere una cartella (`css/stile.css`); le estensioni sono `py`, `c`, `cpp`, `h`, `js`, `html`, `css`,
  `md`, `json`, `txt`, `csv`, `xml`. Un'immagine non si scrive in un blocco.
- "Esegui" avvia il programma, o mostra la pagina, del primo blocco che si può eseguire; poi quello che lo studente
  apre. In Python gli altri file sono moduli e file da leggere, in C e C++ si compilano insieme, in una pagina si
  collegano con il loro percorso e un link porta all'altra pagina.
- L'esercizio si corregge con `%% prova` e `%% stampa` se parte un programma, con `%% controllo` se parte una pagina.
  `%% soluzione` in un file è la soluzione di quel file.
- `%% crea`, da solo in fondo a un blocco, dà allo studente l'elenco dei file come nello strumento, con cui creare,
  rinominare ed eliminare file. Senza, i file sono quelli della lezione e si possono solo modificare.

### I file che un programma legge e scrive

Un programma in Python, in C o in C++ apre i file che ha accanto: `open("dati.txt")`, `ifstream`, `ofstream`,
`fstream`, `fopen`. Per dare un file di dati a un programma scritto in più linguaggi, dopo i blocchi dei linguaggi si
mette un blocco con il nome del file (`txt`, `csv`, `json` o `xml`): è lo stesso per tutti i linguaggi, e lo studente
lo vede in una linguetta accanto al programma (che si chiama `main.py`, `main.cpp`, `main.c`).

````
```codice python
with open("dati.txt") as file:
    for riga in file:
        print(riga.strip())
```

```codice cpp
#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    ifstream file("dati.txt");
    string riga;
    while (getline(file, riga)) {
        cout << riga << endl;
    }
}
```

```codice dati.txt
12
7
30
```
````

Un file che il programma scrive compare tra le linguette alla fine dell'esecuzione, e la console lo dice ("Il
programma ha creato il file uscita.txt"). Un esercizio controlla un file scritto con `%% file` e il nome del file,
dopo la `%% prova`: sotto c'è quello che il file deve contenere quando il programma è finito.

````
```codice python
n = int(input())
with open("uscita.txt", "w") as file:
    # scrivi qui
    pass
%% soluzione
n = int(input())
with open("uscita.txt", "w") as file:
    for i in range(1, n + 1):
        file.write(str(i) + "\n")
%% prova
3
%% file uscita.txt
1
2
3
```

```codice cpp
#include <fstream>
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    ofstream file("uscita.txt");
    // scrivi qui
}
%% soluzione
#include <fstream>
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    ofstream file("uscita.txt");
    for (int i = 1; i <= n; i++) {
        file << i << endl;
    }
}
```
````

- Una prova ha la sua `%% stampa`, uno o più `%% file`, o le due cose. Senza `%% stampa` quello che il programma
  stampa non viene confrontato. Il file si confronta come l'uscita: non contano gli spazi in fondo alle righe e le
  righe vuote alla fine.
- Ogni esecuzione parte dai file che lo studente vede in quel momento: un programma che accoda (`"a"`, `ios::app`)
  eseguito due volte accoda due volte, come su un computer. "Ripristina" rimette i file della lezione. Ogni prova di
  "Verifica" parte dai file dell'editor e non li cambia.
- Aprire in lettura un file che non c'è fallisce nel modo del linguaggio: in Python `FileNotFoundError`, in C++
  `if (!file)` è vero, in C `fopen` dà `NULL`.
- In un blocco senza file di dati e senza nomi di file non c'è un posto dove tenere il file scritto: la console ne
  mostra il contenuto, e alla prossima esecuzione non c'è più. `%% file` funziona anche lì.
- Entrano tra i file solo i file di testo con le estensioni dell'elenco sopra: di un file binario, o con un'altra
  estensione, la console dice che non è stato tenuto. I file si possono mettere in una cartella che c'è già
  (`dati/voti.csv`).
- In C++ non ci sono le eccezioni (`file.exceptions(...)` non serve) e `<filesystem>` non è stato provato. In
  JavaScript un programma non ha file.
- `scripts/codice/verifica.mts` esegue anche questi blocchi e i progetti, e confronta i `%% file`.

Un controllo con più regole passa quando passano tutte. `%% soluzione` in un file è la soluzione di quel file; un
file senza soluzione resta com'è.

### I controlli sul comportamento di una pagina

Un controllo può fare delle azioni sulla pagina dello studente prima di leggere le regole: sono le righe che
cominciano con `>`, e vanno tutte prima delle regole. "Verifica" ricarica la pagina per ogni controllo che ha azioni,
quindi i controlli non si influenzano, e lo script dello studente parte come in una pagina vera (`defer` e
`DOMContentLoaded` compresi).

````
```codice html
<p>Clic: <span id="conta">0</span></p>
<button id="piu">Aggiungi</button>
<script src="script.js"></script>
%% controllo Dopo due clic il contatore segna 2
> clic #piu
> clic #piu
#conta | testo = 2
```

```codice js
// scrivi qui
%% soluzione
let clic = 0;
document.querySelector("#piu").addEventListener("click", () => {
    clic = clic + 1;
    document.querySelector("#conta").textContent = clic;
});
```
````

| Azione | Cosa fa |
|---|---|
| `> clic #piu` | un clic sul primo elemento trovato; su un bottone di invio parte il modulo |
| `> scrivi #nome \| Anna` | mette il testo nel campo al posto di quello che c'è, con gli eventi `input` e `change`; `> scrivi #nome \|` lo svuota |
| `> scegli #classe \| Terza` | sceglie l'opzione di una `select`, per il suo testo o per il suo `value` |
| `> spunta #accetto`, `> togli #accetto` | mette o toglie la spunta a una casella (o sceglie un `radio`) con un clic |
| `> invia form` | invia il modulo come farebbe il suo bottone: prima il browser controlla `required` e simili |
| `> premi #cerca \| Enter` | gli eventi `keydown` e `keyup` del tasto sull'elemento; il nome è quello di `evento.key` |
| `> aspetta 400` | aspetta i millisecondi indicati (al più 3000 in un controllo), per una pagina che risponde con `setTimeout` |
| `> larghezza 400` | rende l'anteprima larga 400 pixel (da 200 a 2000) fino alla fine del controllo, per le regole dentro una media query |

| Regola | Cosa controlla |
|---|---|
| `#msg \| non esiste` | il selettore non trova niente |
| `.errore \| visibile`, `.errore \| nascosto` | il primo occupa spazio nella pagina (non è `display: none`, `hidden` o `visibility: hidden`), o il contrario |
| `#msg \| classe ok`, `#msg \| senza classe ok` | il primo ha, o non ha, la classe |
| `#nome \| valore = Anna` | quello che c'è scritto nel campo; `valore =` da solo vuol dire campo vuoto |
| `#accetto \| spuntato`, `#accetto \| non spuntato` | lo stato di una casella |
| `form \| inviato`, `form \| non inviato` | il modulo è partito (c'è stato un `submit` che nessuno ha fermato con `preventDefault()`), oppure no |
| `@avviso \| testo contiene nome` | il messaggio di un `alert()`, `confirm()` o `prompt()`; anche `@avviso \| quanti = 1` e `@avviso \| non esiste` |

- Un modulo nell'anteprima si comporta come in una pagina vera fino al momento di partire, anche quando lo usa lo
  studente a mano: il browser controlla i campi (`required`, `type="email"`, `min`, `max`) e mostra i suoi messaggi,
  l'evento `submit` nasce, gli ascoltatori girano e `preventDefault()` ha effetto. Se nessuno lo ferma, il modulo non
  va da nessuna parte e la console sotto l'anteprima dice che cosa sarebbe partito: "Modulo inviato con il metodo POST
  a iscrivi.php: nome=Anna, email=anna@scuola.example." Un campo senza `name` non compare tra i dati.
- `stile` confronta lo stile calcolato dell'elemento con quello che avrebbe con il valore chiesto, nel punto in cui
  si trova: `red` e `rgb(255, 0, 0)` sono uguali, `width = 50%` e `margin-bottom = 1em` si misurano lì, una
  scorciatoia (`border`, `margin`, `padding`, `gap`, `font`) si confronta parte per parte. Lo spessore di un bordo
  (`border-top-width = 2px`) è giusto solo se il bordo c'è: senza `border-style` il browser lo calcola 0. Dopo
  un'azione che fa partire una transizione serve un `> aspetta`.
- Due controlli con `> larghezza` provano una media query sotto e sopra la soglia:

  ````
  %% controllo Su un telefono le schede sono in colonna
  > larghezza 400
  .schede | stile flex-direction = column
  %% controllo Su un computer sono in riga
  > larghezza 900
  .schede | stile flex-direction = row
  ````

  Lo studente ha tre tasti sopra il codice per vedere l'anteprima larga come un telefono (375 pixel), come un tablet
  (768) o quanto lo spazio che c'è; su uno schermo stretto i tasti non ci sono.
- Un link a un punto della pagina (`href="#contatti"`) scorre fino all'elemento con quell'`id`; `pagina.html#contatti`
  apre l'altra pagina del progetto e scorre al punto. Se nessun elemento ha quell'`id`, la console lo dice.
- Durante "Verifica" `alert`, `confirm` e `prompt` non si aprono: `confirm` risponde di sì, `prompt` dà una stringa
  vuota (o il suo valore proposto). I loro messaggi si leggono con `@avviso`.
- Se un'azione non trova il suo elemento lo studente legge, per esempio, "Per questo controllo provo a premere
  "#piu", ma nella pagina non lo trovo." Se lo script dà un errore durante le azioni, il controllo lo riporta con il
  file e la riga.
- `premi` manda solo gli eventi del tasto: non scrive il carattere nel campo, e Invio non invia il modulo (per
  quello c'è `invia`). `visibile` non guarda l'opacità né se l'elemento è coperto da un altro.
- Per controllare due momenti (dopo un clic si vede, dopo il secondo no) servono due controlli, ciascuno con tutte le
  sue azioni dall'inizio.
- `scripts/codice/verifica.mts` non esegue i controlli delle pagine: si provano nel browser, con
  `/prova-grafico/lezione?file=...`, premendo "Soluzione" e poi "Verifica".

Cosa c'è: in Python la libreria standard, `turtle` (ridisegnata per il browser), `numpy` e `matplotlib`; in C la
libreria standard; in C++ la libreria standard senza le eccezioni (`try`, `catch` e `throw` non compilano). Un
programma si ferma dopo 10 secondi o dopo 100.000 caratteri stampati. In una pagina web lo script non può fare
richieste di rete, e un ciclo che gira per più di 2 secondi viene fermato.

Il controllo automatico qui sotto legge i blocchi. Le soluzioni si eseguono davvero sulle loro prove, in ogni
linguaggio, con il comando qui sotto; i controlli delle pagine web si provano solo nel browser.

```
node node_modules/jiti/lib/jiti-cli.mjs scripts/codice/verifica.mts docs/lezioni/informatica/riscritte/*.md
```

Per vedere i blocchi prima di pubblicare, con il sito in sviluppo: `/prova-grafico/lezione?file=prove/codice.md`.

Controllo automatico (formule KaTeX, link, formato dei riquadri, regole di stile):

```sh
node node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/check.mts docs/lezioni/riscritte/*.md
```

## Il diagramma di flusso da eseguire

Un blocco `diagramma` è un programma scritto in poche righe, che la pagina disegna come diagramma di flusso ed esegue
un blocco alla volta: il blocco in corso è acceso, la freccia appena percorsa è colorata, e accanto c'è la tabella
delle variabili, dove sono segnate quelle che il blocco legge o cambia. Su un rombo la frase accanto riscrive la
condizione con i valori al posto dei nomi ("6 ≤ 5: è falsa").

````
```diagramma
% nome: somma-da-uno-a-n
% alt: Diagramma di flusso: si legge n, s parte da 0 e i da 1; finché i è minore o uguale a n si aggiunge i a s e si aumenta i di 1; alla fine si scrive s
% ingresso: 4
leggi n
s = 0
i = 1
finché i <= n
    s = s + i
    i = i + 1
scrivi s
```
````

- `% nome:` e `% alt:` sono obbligatori, come nelle figure. `% ingresso:` dà i valori già scritti nel campo di ogni
  "leggi", nell'ordine, separati da virgole: lo studente li può cambiare.
- Un'istruzione per riga: `leggi x`, `scrivi a, "testo"` (più cose separate da virgole, scritte con uno spazio in
  mezzo), `x = espressione`, `se condizione` con `altrimenti` facoltativo, `finché condizione`. Il corpo di una
  selezione o di un ciclo è rientrato sotto la sua riga, come in Python.
- Espressioni: `+ - * /`, `//` e `%` (o `div` e `mod`) per quoziente e resto tra interi, `== != < <= > >=`, e per
  unire due condizioni `E`, `O`, `NON` in maiuscolo (`e` e `o` minuscole restano libere come nomi di variabili).
  I numeri decimali si scrivono con il punto e si vedono con la virgola. `/` è la divisione della calcolatrice:
  `7 / 2` fa 3,5 anche tra interi, come in Python e non come in C++.
- Nel disegno l'assegnamento è `s ← s + i`, e `<=`, `!=`, `*` diventano ≤, ≠, ·. Una selezione a due vie ha "sì" a
  sinistra e "no" a destra; una selezione a una via e un ciclo tengono "sì" sotto il rombo e portano "no" a destra;
  il ciclo risale a sinistra.
- Non ci sono salti: ogni diagramma che si può scrivere ha un programma in Python e in C++ che fa lo stesso.
- `leggi x: intero`, `: decimale` o `: testo` dice che cosa si legge, e un valore di altro tipo viene chiesto di
  nuovo. Senza, si legge un numero quando quello che è scritto lo è, altrimenti un testo.
- Accanto al diagramma c'è il suo programma in Python e in C++, scritto dalla pagina: la riga del blocco in corso è
  accesa. Il tipo di ogni variabile, che il C++ vuole, è dedotto dai valori che prende (e per un "leggi" dal tipo
  dichiarato o dal valore di `% ingresso:`). Controlla che il codice generato sia quello che la lezione mostra nei
  blocchi `codice`: se differisce per un tipo, dichiaralo nel `leggi`.
- Con "Modifica" lo studente cambia il diagramma: trascina un blocco dalla fila dei blocchi su una freccia, che si
  accende nel punto dove il blocco andrà; trascina allo stesso modo un blocco del diagramma su un'altra freccia;
  clicca dentro un blocco per scriverlo, lì dov'è; lo toglie con il cestino al suo angolo. Senza trascinare: un
  tocco sul blocco della fila, poi un tocco sul «+» della freccia. Il codice segue ogni modifica.
  `% modifica: sì` apre il diagramma già pronto da modificare, per un esercizio che chiede di costruirlo; in quel
  caso il programma può essere vuoto, o avere una selezione o un ciclo ancora senza corpo.
- `% codice: no` toglie il codice accanto al diagramma: serve negli esercizi in cui il programma lo deve scrivere
  lo studente, guardando il diagramma.
- `scripts/lezioni/check.mts` legge ogni blocco e lo esegue con i valori di `% ingresso:`: un diagramma che non si
  legge, che si ferma per un errore o che non finisce entro 2000 passi è un errore della lezione.

La pagina pubblicata contiene già il disegno (SVG nel testo), che è quello che resta in stampa e senza JavaScript.
Il codice è in `src/lib/diagramma/` (linguaggio, disegno, esecuzione) e `src/components/diagramma/`. Per vedere i
blocchi prima di pubblicare: `/prova-grafico/lezione?file=prove/diagramma.md`.

## L'esercizio guidato

Un blocco `guidato` è un esempio svolto che si ferma e chiede: il testo dei passaggi compare un pezzo alla volta, e
a ogni fermata lo studente risponde e conferma prima di vedere il seguito. Può anche farsi mostrare il passaggio, o
andare avanti senza rispondere: in quel caso la domanda resta aperta e ci può tornare. Come e dove si scrive sta in
`stile.md`, sezione "Esercizio guidato"; qui c'è la sintassi.

````
```guidato
% nome: esponenziale-decrescente-spostata-in-giu
% titolo: Un'esponenziale decrescente spostata in giù

Disegna il grafico di $y = \left(\dfrac{1}{3}\right)^x - 3$ e trova i punti in cui incontra gli assi.

Il $-3$ sta fuori dalla potenza: sposta in verticale tutto il grafico, asintoto compreso.

?? cursore: Porta il cursore $k$ al valore che dà la funzione dell'esercizio.
```grafico
% nome: esponenziale-decrescente-traslata-cursore
% alt: Il grafico di y = (1/3) alla x più k con il cursore di k e l'asintoto tratteggiato
curva: y=\left(\frac{1}{3}\right)^x+k
curva: y=k | tratteggiata | grigio
cursore: k = 0 da -6 a 6 passo 1
finestra: x da -6 a 6, y da -5 a 7
```
atteso: k = -3
errore: k = 3 :: Con $k = 3$ la curva sale. Nella funzione c'è $-3$: il grafico scende.
aiuto: Guarda la retta tratteggiata, che è l'asintoto $y = k$.

L'asintoto è la retta $y = -3$, e la funzione resta decrescente.

?? scegli: Qual è l'immagine della funzione?
giusta: $\mathopen{]}-3, +\infty\mathclose{[}$
sbagliata: $\mathopen{]}0, +\infty\mathclose{[}$ :: È l'immagine prima dello spostamento.
sbagliata: $\mathbb{R}$ :: I valori minori o uguali a $-3$ non vengono mai assunti.

Un punto sta sull'asse $y$ quando la sua ascissa è $0$.

?? scrivi: Scrivi l'ordinata del punto in cui il grafico incontra l'asse $y$.
numero: -2
errore: -3 :: Hai preso $\left(\dfrac{1}{3}\right)^0 = 0$. Una potenza con esponente $0$ vale $1$.
aiuto: Sostituisci $x = 0$ nella funzione.

Per $x = 0$ si ha $y = 1 - 3 = -2$. Il punto è $A(0, -2)$.
```
````

- `% nome:` (minuscole, cifre e trattini, unico nella lezione) e `% titolo:` sono obbligatori. La pagina scrive da sé
  l'etichetta "Esercizio guidato" sopra il titolo.
- Il testo tra le fermate è testo della lezione: paragrafi, formule, tabelle, figure `tikz`, anche un piano `grafico`
  da guardare. Il blocco comincia con la consegna e finisce con il testo che chiude lo svolgimento.
- Una fermata è un gruppo di righe attaccate, senza righe vuote in mezzo. La prima riga dice che cosa fa lo studente
  e fa la domanda: `?? scrivi:`, `?? scegli:`, `?? cursore:`. Le altre sono `chiave: valore`. La riga vuota chiude la
  fermata.
- I messaggi stanno dopo ` :: ` (spazio, due volte i due punti, spazio) e sono testo della lezione, con le formule
  tra dollari.

Righe che valgono per ogni fermata:

| Riga | Che cosa fa |
|---|---|
| `mostra:` | la risposta come la scrive la lezione, per esempio `$x = 0 \lor x = 2$`. È quello che si legge dopo "Risposta:" nella pagina stampata, senza JavaScript e quando lo studente si fa mostrare il passaggio. Senza, la pagina la ricava dal valore atteso; per `insieme` ed `esclusi` è obbligatoria |
| `spiegazione:` | una riga detta insieme alla risposta. Il perché lungo va nel testo dopo la fermata |
| `aiuto:` | una riga aggiunta al messaggio generico, quando l'errore non è tra quelli previsti |

`?? scrivi:` chiede una risposta scritta con la tastiera delle formule, corretta dal correttore degli esercizi
(`src/lib/exercises/v2/grade/`). Serve una sola riga con la risposta attesa, e il valore si scrive nella sintassi di
SymPy, come nei generatori: `2*x**2`, `sqrt(3)`, `3/2`, `(1/3)**x`.

| Riga | Risposta attesa | Lo studente può scrivere |
|---|---|---|
| `numero: -2` | un numero: intero, frazione `3/2`, decimale `2,5` | `-2`, `y = -2`, `-\frac{4}{2}`; non un conto ancora da fare, come `1 - 3` |
| `insieme: 0; 2` | le soluzioni, separate da `;`. `vuoto` se non ce ne sono, `R` se vanno bene tutti i numeri | `x = 0 \lor x = 2`, `0; 2`, `S = \{0; 2\}`, "impossibile" |
| `esclusi: 3` | i valori da togliere da un dominio; `nessuno` se non ce ne sono | `x \neq 3`, `\mathbb{R} \setminus \{3\}` |
| `espressione: 3*x**2 - 1` | un'espressione, confrontata per valore | qualunque scrittura equivalente |
| `retta: 2*x + 1` | una retta in forma esplicita | `y = 2x + 1`, `y = 1 + 2x`; `2x - y + 1 = 0` riceve il messaggio sulla forma |

- `forma:` chiede anche la forma, dove la forma è l'esercizio: `sviluppata`, `scomposta`, `irriducibile`,
  `semplificata`, `razionalizzata`, `esplicita`, `potenza`, `radicale`, `decimale`. A un numero si chiedono solo
  `decimale` e `irriducibile`.
- `errore: valore :: messaggio` è una risposta sbagliata prevista, scritta come la risposta attesa. Si riconosce dal
  valore, comunque lo studente la scriva. Fino a dodici per fermata.
- Il correttore non legge disequazioni, intervalli e logaritmi: per quelle risposte si usa `?? scegli:`.

`?? scegli:` ha una riga `giusta: testo` e una o più `sbagliata: testo :: messaggio`, nell'ordine in cui lo studente
le vede. Ogni opzione sbagliata ha il suo messaggio.

`?? cursore:` ha dentro un blocco `grafico`, scritto come sempre (la `domanda:` non serve: la domanda è quella della
fermata). Lo studente porta i cursori e conferma.

- `atteso: k = -3`: il valore a cui portare il cursore. Per più cursori, una riga ciascuno oppure `h = 2 e k = -3`.
- `tolleranza: 0,05`: quanto può restare lontano. Senza, serve il valore esatto, che con un passo di `1` o di `0,5`
  è la scelta giusta; la tolleranza è per i passi fini e deve restare più piccola del passo.
- `errore: k = 3 :: messaggio`: una posizione sbagliata prevista. Vale anche `k > 0` o `k < -3`, e più condizioni
  unite da ` e `. Conta la prima che è vera, nell'ordine in cui sono scritte.
- Il cursore non deve partire dal valore atteso.

Che cosa resta senza JavaScript, per i motori di ricerca e in stampa: l'esercizio per intero, come un esempio svolto,
con ogni domanda seguita da "Risposta:" e dal testo dopo. Il piano di una fermata `cursore` lì non c'è: se il grafico
serve a capire lo svolgimento, il testo finale ha la sua figura `tikz`.

La risposta scritta si corregge sul server, con la rotta pubblica `POST /api/lezioni/guidato`: la pagina manda la
risposta attesa insieme a quella dello studente, e la rotta non legge e non scrive niente nel database. Le scelte e i
cursori si correggono nel browser. Niente entra nei progressi; dove lo studente è arrivato si ricorda solo per la
visita, nella scheda del browser.

`scripts/lezioni/check.mts` legge ogni blocco e segnala: le righe che non capisce; una fermata senza risposta attesa;
una risposta attesa (quella di `mostra:` quando è una formula sola, altrimenti quella ricavata dal valore) che il
correttore boccia; un errore previsto che il correttore accetta, non riconosce o trova scritto due volte; un valore
atteso fuori dall'intervallo del cursore o che il suo passo non raggiunge. Le formule del testo e dei messaggi e il
blocco `grafico` della fermata sono controllati come nel resto della lezione.

Per aggiungere un tipo di fermata: una parola nuova dopo `??` e il suo lettore in `STOPS`
(`src/lib/guidato/blocco.ts`), il suo pezzo di pagina in `guidedFigure` (`src/lib/content/markdown.ts`) e il suo
componente in `src/components/guidato/Guided.tsx`. Per vedere un blocco prima di pubblicare:
`/prova-grafico/lezione?file=riscritte/121-funzioni-esponenziali.md`.

## Cosa c'era negli originali

- Tre lezioni sono troncate nel database, a metà frase: 04 (Sottoinsiemi e uguaglianza), 05 (Unione
  insiemistica), 18 (Funzioni iniettive, suriettive e biettive). Nella 18 un `$` rimasto aperto
  rompe le formule vicine.
- La 02 (Rappresentazione degli insiemi) è una copia della 01 (Prime definizioni).
- Errori di matematica in quasi tutte, per esempio: soluzioni "decimali o frazioni" con Δ non quadrato
  (sono irrazionali); $2{,}35 = \frac{27}{20}$ e $1{,}\overline{45} = \frac{145}{99}$ (sono
  $\frac{47}{20}$ e $\frac{16}{11}$); $3 - 8 = -5$ presentato come operazione in ℕ; l'algoritmo di
  Euclide descritto male; MCM di monomi calcolato sulle frazioni; "iniettiva e monotona sono
  indipendenti". L'elenco completo è nelle note.
- Stile: titoli numerati e con maiuscole all'inglese, separatori `---`, grassetto ovunque (fino a 50
  per lezione), trattini lunghi, `\mathrel{\char`≠}` al posto di `\neq`.

## Decisioni da prendere

Convenzioni da fissare una volta per tutte le lezioni:

1. Inclusione: $\subseteq$ e $\subset$ (scelta fatta) oppure $\subset$ e $\subsetneq$.
2. Sottoinsiemi impropri: $\emptyset$ e $A$ (scelta fatta) oppure solo $A$.
3. Cardinalità: $|A|$ (scelta fatta), $\text{card}(A)$ o $n(A)$.
4. Differenza tra insiemi: $A \setminus B$ (scelta fatta) oppure $A - B$.
5. MCD e MCM maiuscoli come nei titoli del sito, oppure m.c.m. come in molti libri.
6. Coefficiente di MCD e MCM tra monomi: MCD e MCM dei valori assoluti con coefficienti interi, 1 con
   coefficienti frazionari (scelta fatta), oppure sempre 1.
7. Equazione indeterminata: $S = \mathbb{R}$ (scelta fatta, con un riquadro su $\mathbb{Q}$) o
   $S = \mathbb{Q}$ al primo anno.
8. Elemento neutro di sottrazione e divisione: "non esiste" (scelta fatta) o "solo a destra".
9. Nomi: "monomia" per $ax^2 = 0$; "identità" per l'equazione indeterminata; la proprietà
   dissociativa, che alcuni libri non nominano.

Struttura del programma:

- La 03 (Operazioni e relazioni tra insiemi) tratta tutte le operazioni, perché le lezioni su
  intersezione, differenza, complementare e prodotto cartesiano sono vuote. Quando verranno scritte,
  la 03 va ridotta a una panoramica.
- La 11 copre anche il passaggio da frazione a decimale: rinominarla "Numeri decimali e frazioni"
  oppure spostare quella parte.
- La 10 spiega frazioni equivalenti e riduzione ai minimi termini, che forse vanno in "Operazioni in
  ℚ" (vuota).
- La 18 si sovrappone a "Dominio, codominio e immagine" e "Funzioni invertibili" (vuote).
- Le equazioni fratte e letterali non hanno una lezione nell'albero.

Figure: le 14 descritte nelle note come necessarie sono state disegnate in TikZ e controllate il 23
settembre 2026 (lezioni 02, 03, 04, 05, 07, 10, 18). Restano da fare solo quelle segnate come
facoltative nelle note.
I disegni TikZ della 03 sono stati corretti e controllati con Playwright, in chiaro e in scuro, il
23 settembre 2026 (l'intersezione colorava tutto il cerchio $B$).
