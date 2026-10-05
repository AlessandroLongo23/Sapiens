# Il primo programma: input e output

In una chat scrivi un messaggio e leggi le risposte: tu dai qualcosa al programma, il programma mostra qualcosa a te. Quello che entra in un programma si chiama **input** (ingresso), quello che ne esce **output** (uscita). I primi programmi che scrivi fanno queste due cose: stampano un testo sullo schermo e leggono quello che scrivi sulla tastiera. Nei [diagrammi di flusso](/materiale/scuola-superiore/informatica/algoritmi-e-diagrammi-di-flusso/i-diagrammi-di-flusso) erano i due parallelogrammi, "scrivi" e "leggi".

## Un programma di una istruzione

Per tradizione il primo programma di chi impara un linguaggio stampa un saluto. Eseguilo nei due linguaggi.

```codice python
print("Ciao, mondo!")
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Ciao, mondo!" << endl;
    return 0;
}
```

In Python il programma è la sola istruzione `print`. In C++ l'istruzione che stampa è una, quella con `cout`, e le altre righe sono una cornice che ritrovi uguale in ogni programma.

```ad-note
La cornice di un programma in C++
`#include <iostream>` porta nel programma gli strumenti per scrivere e per leggere, `cout` e `cin`; `using namespace std;` permette di chiamarli con il nome corto. `int main() {` segna il punto da cui parte l'esecuzione, e la graffa chiusa in fondo il punto in cui finisce; `return 0;` dice al sistema operativo che il programma è arrivato alla fine senza problemi. Le tue istruzioni vanno tra le due graffe, rientrate di quattro spazi, e ognuna finisce con il punto e virgola.
```

Un programma è una sequenza: le istruzioni si eseguono una dopo l'altra, dall'alto in basso, ognuna una volta sola. In Python un'istruzione sta su una riga e finisce dove finisce la riga; in C++ finisce al punto e virgola.

## Stampare testi e numeri

L'istruzione di output si scrive `print(...)` in Python e `cout << ...` in C++, e stampa quello che le dai. Un testo tra virgolette doppie viene stampato così com'è, carattere per carattere. Un numero, o un conto, viene prima calcolato e poi stampato: `"3 * 8"` con le virgolette stampa i cinque caratteri che vedi, `3 * 8` senza virgolette stampa 24.

Con una sola istruzione puoi stampare più cose di seguito. Il programma scrive lo scontrino di tre biglietti del cinema da 8 euro.

```codice python
print("Cinema Astra")
print("Biglietti:", 3)
print("Totale:", 3 * 8, "euro")
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Cinema Astra" << endl;
    cout << "Biglietti: " << 3 << endl;
    cout << "Totale: " << 3 * 8 << " euro" << endl;
    return 0;
}
```

```ad-note
Spazi e a capo nei due linguaggi
In Python le cose da stampare si separano con la virgola: `print` mette da solo uno spazio tra l'una e l'altra, e alla fine va a capo. In C++ ogni cosa è preceduta da `<<`, e `cout` non aggiunge niente: gli spazi li scrivi tu dentro le virgolette (guarda `"Totale: "` e `" euro"`), e per andare a capo metti `endl` in fondo.
```

Cambia il prezzo da 8 a 9 e il totale si aggiorna, perché viene calcolato a ogni esecuzione. Poi metti le virgolette attorno a `3 * 8` e guarda che cosa esce. In C++ togli `<< endl` dalla prima istruzione: "Cinema Astra" e "Biglietti: 3" finiscono sulla stessa riga, attaccati.

```ad-warning
Le virgolette dimenticate
Senza virgolette, `print(Ciao)` e `cout << Ciao` non stampano la parola Ciao: il computer la prende per il nome di qualcosa che dovrebbe conoscere, non lo trova e si ferma con un errore (`name 'Ciao' is not defined` in Python, `use of undeclared identifier 'Ciao'` in C++). Le virgolette si aprono e si chiudono, sempre in coppia.
```

```ad-warning
Maiuscole e punto e virgola
Per il computer `print` e `Print` sono due parole diverse, e solo la prima esiste: i comandi si scrivono in minuscolo, lettera per lettera. In C++ l'errore più frequente dei primi giorni è il punto e virgola dimenticato in fondo a un'istruzione: il compilatore lo segnala con `expected ';'` e indica la riga.
```

## I commenti

Un **commento** è una riga di spiegazione scritta per chi legge il programma, e il computer la salta. In Python comincia con `#`, in C++ con `//`, e vale fino alla fine della riga.

Lo trovi nei programmi degli esercizi, dove indica il punto in cui scrivere (`# scrivi qui` oppure `// scrivi qui`). Serve anche a spegnere per un momento un'istruzione senza cancellarla: metti il segno del commento davanti a una `print` dello scontrino ed esegui.

## Leggere dalla tastiera

Un programma che stampa sempre le stesse cose serve a poco. Con l'istruzione di input il programma si ferma, aspetta che tu scriva qualcosa e prema Invio, e poi va avanti con quello che hai scritto. Il valore letto deve essere conservato da qualche parte: gli si dà un nome, e quel nome è una variabile, di cui parla la lezione [Variabili, assegnamento e tipi di dato](/materiale/scuola-superiore/informatica/linguaggi-e-primi-programmi/variabili-assegnamento-e-tipi-di-dato). Qui ti serve sapere solo che dove il programma scrive `nome` il computer mette quello che hai scritto tu.

```diagramma
% nome: diagramma-flusso-saluto-con-nome
% alt: Diagramma di flusso in sequenza: dopo l'inizio un parallelogramma legge nome, un secondo parallelogramma scrive Ciao seguito da nome, e si arriva alla fine
% ingresso: Sara
leggi nome: testo
scrivi "Ciao", nome
```

Esegui il diagramma con "Passo": al primo blocco il nome proposto è Sara, e lo vedi comparire nella tabella delle variabili; il secondo blocco lo riprende da lì. Il programma fa lo stesso, e in più scrive una domanda prima di leggere, così chi lo usa sa che cosa gli si chiede.

```codice python
nome = input("Come ti chiami? ")
print("Ciao", nome)
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string nome;
    cout << "Come ti chiami? ";
    cin >> nome;
    cout << "Ciao " << nome << endl;
    return 0;
}
```

Quando lo esegui, nel riquadro dell'uscita compare la domanda e, accanto, una riga su cui scrivere; in alto si legge "Aspetta una risposta". Scrivi il tuo nome e premi Invio.

```ad-note
La domanda e la lettura nei due linguaggi
In Python `input("...")` fa due cose: stampa la domanda che sta tra le parentesi e legge la risposta, che finisce nella variabile a sinistra dell'uguale. In C++ sono due istruzioni: `cout` stampa la domanda, senza `endl` per restare sulla stessa riga, e `cin >> nome` legge. La variabile va preparata prima, con `string nome;`, che vuol dire "`nome` conterrà un testo"; per usare `string` serve la riga `#include <string>`.
```

```ad-warning
Il verso delle frecce in C++
I due segni indicano la direzione in cui viaggiano i dati: in `cout << nome` vanno verso lo schermo, in `cin >> nome` dalla tastiera verso la variabile. Se li scambi, e scrivi `cin << nome`, il compilatore risponde con decine di righe di messaggi: conta solo la prima, che indica la riga dello sbaglio.
```

Esegui di nuovo il programma e rispondi con due parole, per esempio Anna Maria.

```ad-note
Una riga o una parola
`input()` di Python legge tutta la riga, spazi compresi, e il programma risponde "Ciao Anna Maria". In C++ `cin >>` si ferma al primo spazio: in `nome` finisce solo Anna. Negli esercizi di questa pagina le risposte sono di una parola sola, così i due linguaggi si comportano allo stesso modo.
```

Quello che arriva dalla tastiera è sempre un testo, anche quando scrivi delle cifre. Per fare dei conti con un numero letto bisogna dire al programma che è un numero: come si fa è nella lezione sulle variabili, alla sezione sulla lettura.

## Prova tu

Negli esercizi "Verifica" esegue il tuo programma e confronta, carattere per carattere, quello che stampa con quello che è atteso: una maiuscola o uno spazio diversi contano. Per questo i programmi degli esercizi leggono senza scrivere una domanda.

Il primo programma stampa la prima riga del cartello sulla porta di un'aula. Aggiungi le istruzioni che stampano le altre due righe, in modo che esca:

```
Liceo Galilei
Classe 2B
Aula 14
```

```codice python
print("Liceo Galilei")
# scrivi qui le altre due istruzioni
%% soluzione
print("Liceo Galilei")
print("Classe 2B")
print("Aula 14")
%% prova
%% stampa
Liceo Galilei
Classe 2B
Aula 14
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Liceo Galilei" << endl;
    // scrivi qui le altre due istruzioni

    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    cout << "Liceo Galilei" << endl;
    cout << "Classe 2B" << endl;
    cout << "Aula 14" << endl;
    return 0;
}
```

Il secondo programma legge un nome. Fagli stampare due righe: nella prima "Ciao" seguito dal nome letto, nella seconda "Buona giornata". Con il nome Sara deve uscire "Ciao Sara" e, sotto, "Buona giornata".

```codice python
nome = input()
# scrivi qui le due istruzioni che stampano
%% soluzione
nome = input()
print("Ciao", nome)
print("Buona giornata")
%% prova
Sara
%% stampa
Ciao Sara
Buona giornata
%% prova
Luca
%% stampa
Ciao Luca
Buona giornata
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string nome;
    cin >> nome;
    // scrivi qui le due istruzioni che stampano

    return 0;
}
%% soluzione
#include <iostream>
#include <string>
using namespace std;

int main() {
    string nome;
    cin >> nome;
    cout << "Ciao " << nome << endl;
    cout << "Buona giornata" << endl;
    return 0;
}
```

Nel terzo esercizio il programma lo scrivi tu, guardando il diagramma: due letture, una dopo l'altra, e una sola stampa con tre pezzi. Esegui prima il diagramma con i valori proposti, Sara e Lecce, e controlla che cosa scrive.

```diagramma
% nome: diagramma-flusso-nome-e-citta
% alt: Diagramma di flusso in sequenza: dopo l'inizio si legge nome, poi si legge citta, poi un parallelogramma scrive nome, il testo abita a, e citta, e si arriva alla fine
% ingresso: Sara, Lecce
% codice: no
leggi nome: testo
leggi citta: testo
scrivi nome, "abita a", citta
```

```codice python
nome = input()
# leggi la città e stampa la frase
%% soluzione
nome = input()
citta = input()
print(nome, "abita a", citta)
%% prova
Sara
Lecce
%% stampa
Sara abita a Lecce
%% prova
Luca
Torino
%% stampa
Luca abita a Torino
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string nome;
    cin >> nome;
    // leggi la città e stampa la frase

    return 0;
}
%% soluzione
#include <iostream>
#include <string>
using namespace std;

int main() {
    string nome, citta;
    cin >> nome;
    cin >> citta;
    cout << nome << " abita a " << citta << endl;
    return 0;
}
```
