# Editor di codice

## Un editor che esegue i programmi nel browser

Questo strumento è un editor di codice online: scrivi un programma a sinistra, premi "Esegui" e vedi a destra, nella console, quello che il programma stampa. Funziona con Python, C, C++ e JavaScript, più le pagine web in HTML e CSS, e non c'è niente da installare: il programma gira dentro il tuo browser, sul tuo computer, e il codice che scrivi non viene mandato a nessun server.

La prima volta che esegui un programma il browser scarica il linguaggio: Python è leggero, mentre per C e C++ il compilatore pesa circa 20 MB e ci vuole un po' di più. Dalla seconda volta è già lì. JavaScript e le pagine web non scaricano niente: li esegue il browser.

Nel menu accanto al linguaggio trovi alcuni programmi di esempio, da eseguire così come sono e poi da cambiare. La scorciatoia per eseguire è Ctrl+Invio, oppure ⌘+Invio sul Mac.

## Rispondere alle domande del programma

Quando il programma chiede un dato, con `input()` in Python, con `scanf` in C o con `cin` in C++, la console si ferma in quel punto e ti lascia scrivere: scrivi la risposta e premi Invio, come in un terminale.

```ad-example
Un programma che fa una domanda
In Python:

    nome = input("Come ti chiami? ")
    print("Ciao", nome)

La console mostra "Come ti chiami?" e aspetta. Scrivi il tuo nome, premi Invio, e il programma continua.
```

```ad-note
Come funziona dietro le quinte
A ogni risposta il programma viene eseguito di nuovo dall'inizio, con tutte le risposte date fino a quel momento. Tu non te ne accorgi, perché quello che è già sulla console non viene riscritto e i numeri casuali restano gli stessi per tutta l'esecuzione. Se però cambi il programma mentre aspetta una risposta, l'esecuzione si chiude e va fatta ripartire.
```

## Python: libreria standard, tartaruga e grafici

In Python hai tutta la libreria standard: `math`, `random`, `statistics`, `fractions`, `datetime` e le altre si importano come sul tuo computer.

La tartaruga funziona: con `import turtle` compare un foglio da disegno sopra la console, e la tartaruga si muove alla sua velocità. Il tasto "Salta" porta il disegno alla fine. Ci sono i comandi per muoversi (`forward`, `left`, `goto`, `circle`), la penna e i colori, i riempimenti con `begin_fill` ed `end_fill`, più tartarughe insieme. Non ci sono i tasti, i clic e i timer (`onkey`, `onclick`, `ontimer`): qui la tartaruga disegna, non risponde.

Ci sono anche `numpy` e `matplotlib`, che si scaricano la prima volta che un programma li importa. Con `plt.show()` il grafico compare nella console, nel punto in cui il programma lo mostra.

## C e C++

I programmi in C e in C++ vengono compilati da Clang, un compilatore vero, lo stesso tipo di strumento che useresti sul tuo computer: se il programma ha un errore, il messaggio dice la riga e la colonna, e i messaggi sono quelli del compilatore, in inglese. Gli avvisi (`warning`) compaiono in rosso prima dell'uscita del programma, ma non gli impediscono di partire.

In C hai la libreria standard (`stdio.h`, `stdlib.h`, `string.h`, `math.h`). In C++ hai la libreria standard con `iostream`, `string`, `vector`, `map`, `algorithm`, e puoi scrivere classi, ereditarietà e puntatori.

```ad-warning
In C++ non ci sono le eccezioni
`try`, `catch` e `throw` non si possono usare: il compilatore si ferma con un errore, e sotto l'errore l'editor te lo ricorda. Il resto del linguaggio c'è.
```

Gli errori che succedono mentre il programma gira sono detti in italiano: una divisione intera per zero, un accesso alla memoria fuori dai limiti (di solito un indice sbagliato in un vettore, o un puntatore non valido), una ricorsione che non finisce.

## JavaScript

Con "JavaScript" scrivi un programma con la console, come in Python: `console.log()` stampa, `prompt()` fa una domanda e legge la risposta dalla console, `alert()` scrive un messaggio. Un errore dice la riga in cui è successo.

```ad-example
Leggere un numero
    const n = Number(prompt("Quanti anni hai?"));
    console.log("Tra dieci anni ne avrai", n + 10);

`prompt()` restituisce sempre un testo: `Number()` lo trasforma in un numero.
```

Questo JavaScript non ha una pagina: `document` non esiste. Per lavorare con una pagina scegli "Pagina web".

## Pagine web: HTML, CSS e JavaScript

Con "Pagina web" l'editor ha tre file, `index.html`, `style.css` e `script.js`, e a destra la pagina che ne esce. Finché la pagina non ha script, l'anteprima si aggiorna da sola mentre scrivi; quando c'è del JavaScript si aggiorna con "Esegui", così un `alert()` non si apre a ogni pausa.

I tre file si collegano come in una pagina vera. Nella `head` di `index.html` va la riga che carica il foglio di stile, e prima di `</body>` quella che carica lo script:

    <link rel="stylesheet" href="style.css">
    <script src="script.js"></script>

```ad-warning
Un file non collegato non fa niente
Se scrivi in `style.css` ma la pagina non ha il `<link>`, lo stile non viene applicato: succede lo stesso con un sito vero. L'editor te lo ricorda sotto l'anteprima.
```

Sotto l'anteprima compaiono quello che lo script scrive con `console.log()` e i suoi errori, con la riga di `script.js`. Nell'anteprima i link non si aprono, i moduli non vengono inviati e lo script non può scaricare dati da altri siti; le immagini prese dal web con un indirizzo `https` si vedono.

## Salvare i programmi

Con un account, "I miei programmi" salva quello che hai scritto con un nome e te lo fa ritrovare da ogni dispositivo. "Salva con nome" crea un programma nuovo; "Salva" scrive sopra quello che hai caricato. Di una pagina web vengono salvati i tre file insieme. Anche dagli esercizi delle lezioni puoi salvare il tuo programma, e riaprirlo poi qui.

## Quando un programma non finisce

Un ciclo che non termina è l'errore più comune di chi comincia. L'editor ferma il programma da solo dopo 10 secondi, oppure prima, se il programma ha già stampato più di 100.000 caratteri. Puoi fermarlo tu in ogni momento con il tasto "Ferma". In una pagina web un ciclo viene fermato dopo 2 secondi, perché lì bloccherebbe l'anteprima.

```ad-tip
Se il programma viene fermato
Guarda la condizione del ciclo e chiediti che cosa la fa diventare falsa. Nella maggior parte dei casi manca l'istruzione che aggiorna la variabile del ciclo, per esempio `i = i + 1`.
```

## Che cosa non fa

Non è un ambiente di sviluppo completo: un programma è un solo file e una pagina web ne ha tre, non ci sono cartelle, progetti o un terminale, e un programma non può leggere né scrivere file sul tuo computer. Da telefono i programmi si leggono e si eseguono bene, ma per scriverne di lunghi serve una tastiera. Senza un account il programma che scrivi non viene salvato: se ti serve, copialo prima di chiudere la pagina.
