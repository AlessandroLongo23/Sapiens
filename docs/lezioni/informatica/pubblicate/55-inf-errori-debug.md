# Errori e debug

Nessun programma funziona alla prima, nemmeno quelli di chi programma per mestiere: un'app si aggiorna di continuo anche perché qualcuno ci ha trovato un errore. Un errore in un programma si chiama **bug**, e cercarlo e toglierlo si dice fare il **debug**. Gli errori sono di tre tipi, che si scoprono in momenti diversi e si cercano in modi diversi.

| Tipo di errore | Quando si scopre | Chi te lo dice |
|---|---|---|
| di sintassi | prima che il programma parta | il compilatore o l'interprete, con un messaggio |
| in esecuzione | mentre il programma gira, e solo con certi dati | il programma si ferma, con un messaggio |
| logico | quando guardi il risultato e non è quello giusto | nessuno |

## Gli errori di sintassi

Un **errore di sintassi** è un punto in cui il testo del programma non rispetta le regole di scrittura del linguaggio: una parentesi non chiusa, un punto e virgola che manca, le virgolette dimenticate. Il traduttore non sa che cosa fare di quel testo e non lo esegue (come lavorano compilatore e interprete è nella lezione [Linguaggi, compilatori e interpreti](/materiale/scuola-superiore/informatica/linguaggi-e-primi-programmi/linguaggi-compilatori-e-interpreti)). Il programma qui sotto ne ha uno: eseguilo.

```codice python
print("Calcolo la media")
voto1 = 7
voto2 = 8
print("Media:", (voto1 + voto2) / 2
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Calcolo la media" << endl;
    int voto1 = 7, voto2 = 8
    cout << "Media: " << (voto1 + voto2) / 2.0 << endl;
    return 0;
}
```

Non esce nemmeno "Calcolo la media": con un errore di sintassi il programma non parte, in nessuno dei due linguaggi. Sotto l'editor compare invece il messaggio di errore, in inglese. Questo è quello di Python:

```
  File "programma.py", line 4
    print("Media:", (voto1 + voto2) / 2
         ^
SyntaxError: '(' was never closed
```

E questo è quello del C++:

```
programma.cpp:6:29: error: expected ';' at end of declaration
    6 |     int voto1 = 7, voto2 = 8
      |                             ^
      |                             ;
1 error generated.
```

Un messaggio di errore si legge cercando tre cose.

1. Dove: il numero della riga. In Python è dopo la parola `line`; in C++ è il primo numero dopo il nome del file, seguito dalla colonna (`6:29` è riga 6, carattere 29).
2. Il punto esatto: la riga è ricopiata, e sotto c'è un accento `^` che indica il carattere dove il traduttore si è accorto del problema.
3. Che cosa: la descrizione. In Python è l'ultima riga, con il nome dell'errore (`SyntaxError`) e la spiegazione: "la parentesi aperta non è mai stata chiusa". In C++ è dopo la parola `error`: "mi aspettavo un punto e virgola alla fine della dichiarazione", e l'ultima riga del disegno mostra perfino che cosa aggiungere.

Correggi il programma, aggiungendo la parentesi o il punto e virgola, ed eseguilo di nuovo: scrive "Media: 7.5". I messaggi che incontrerai più spesso sono pochi, e conviene riconoscerli.

| Messaggio | Linguaggio | Che cosa è successo |
|---|---|---|
| `'(' was never closed` | Python | una parentesi aperta e non chiusa |
| `unterminated string literal` | Python | le virgolette di un testo non sono state chiuse |
| `unexpected indent` | Python | una riga comincia con degli spazi che non dovrebbe avere |
| `name 'x' is not defined` | Python | un nome scritto male, o una variabile usata prima di darle un valore |
| `expected ';'` | C++ | manca il punto e virgola |
| `use of undeclared identifier 'x'` | C++ | un nome scritto male, o una variabile non dichiarata |
| `expected '}'` | C++ | una parentesi graffa aperta e non chiusa |

```ad-note
Quanti errori alla volta, e gli avvisi del C++
Python segnala un solo errore di sintassi alla volta: lo correggi, esegui, e se ce n'è un altro compare quello. Il compilatore C++ li elenca tutti insieme: si parte dal primo, perché spesso quelli sotto sono conseguenze del primo e spariscono con lui. Il compilatore scrive anche degli avvisi, con la parola `warning` al posto di `error`: il programma parte lo stesso, ma l'avviso indica qualcosa di sospetto, come una variabile dichiarata e mai usata (`unused variable`), e va letto.
```

```ad-warning
La riga indicata è quella in cui il computer se ne accorge
Se assegni 12 a `prezo`, con una zeta sola, e due righe dopo stampi `prezzo * 2`, il messaggio indica la riga della stampa: lì il nome non esiste. Ma lo sbaglio è nella riga sopra. Quando la riga indicata ti sembra giusta, guarda le righe che la precedono.
```

## Gli errori in esecuzione

Un **errore in esecuzione** capita a un programma scritto secondo le regole, che parte e a un certo punto incontra un'operazione impossibile: il programma si ferma lì. Il caso tipico è la divisione per zero. Il programma divide una spesa tra più persone: eseguilo con 60 e 4, poi con 60 e 0.

```codice python
spesa = int(input("Spesa totale: "))
persone = int(input("Quante persone: "))
print("Divido la spesa")
quota = spesa // persone
print("A testa:", quota, "euro")
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int spesa, persone;
    cout << "Spesa totale: ";
    cin >> spesa;
    cout << "Quante persone: ";
    cin >> persone;
    cout << "Divido la spesa" << endl;
    int quota = spesa / persone;
    cout << "A testa: " << quota << " euro" << endl;
    return 0;
}
```

Con 4 persone la quota è 15 euro. Con 0 persone esce "Divido la spesa" e poi il programma si ferma: le istruzioni prima dell'errore sono state eseguite, quelle dopo no. Python scrive:

```
Traceback (most recent call last):
  File "programma.py", line 4, in <module>
    quota = spesa // persone
            ~~~~~~^^~~~~~~~~
ZeroDivisionError: division by zero
```

Il C++ dell'editor scrive `Errore durante l'esecuzione: divisione intera per zero.`

```ad-note
Che cosa dicono i due linguaggi quando si fermano
Python dice il tipo di errore nell'ultima riga e la riga del programma in cui è successo. In C++ il messaggio non porta il numero di riga: per sapere dove si è fermato il programma guardi che cosa ha fatto in tempo a stampare. Cambia anche la reazione a un dato scritto male. Rispondi "quattro" alla seconda domanda: Python si ferma subito con `ValueError: invalid literal for int() with base 10: 'quattro'`, perché non sa trasformare quel testo in un numero; il C++ non si ferma alla lettura, mette 0 in `persone` e si ferma dopo, alla divisione.
```

L'errore non c'è sempre: dipende dai dati. Per questo un programma si prova anche con i valori scomodi, come lo zero, un numero negativo o una risposta vuota.

## Gli errori logici

Un **errore logico** è un programma che parte, arriva in fondo senza messaggi e dà un risultato sbagliato. Il computer ha fatto quello che c'è scritto, e quello che c'è scritto non è quello che volevi. È l'errore più difficile, perché nessuno te lo segnala: te ne accorgi solo se sai già quale risultato aspettarti.

Il diagramma dovrebbe calcolare la media di due voti. Eseguilo con i valori proposti, 6 e 8.

```diagramma
% nome: diagramma-flusso-media-con-errore
% alt: Diagramma di flusso in sequenza con un errore da trovare: dopo l'inizio si legge a, si legge b, un rettangolo assegna a media il valore di a più b diviso 2, senza parentesi, poi si scrive media e si arriva alla fine
% ingresso: 6, 8
leggi a
leggi b
media = a + b / 2
scrivi media
```

Scrive 10, e la media di due voti non può essere più alta di tutti e due. Nella tabella delle variabili `a` e `b` sono giuste dopo le due letture, quindi l'errore è nel rettangolo: manca una coppia di parentesi, e la divisione viene fatta solo su `b` (l'ordine dei calcoli è nella lezione [Operatori ed espressioni](/materiale/scuola-superiore/informatica/linguaggi-e-primi-programmi/operatori-ed-espressioni)). Premi "Modifica", clicca dentro il rettangolo, correggi l'espressione e premi "Prova il diagramma": con 6 e 8 deve uscire 7.

```ad-warning
Un caso giusto non dimostra che il programma è giusto
Prima di correggerlo, esegui il diagramma sbagliato con 0 e 8: scrive 4, che è la media esatta. Un programma con un errore logico può dare il risultato giusto con certi dati. Provalo con più casi, scelti in modo che abbiano risultati diversi tra loro, e calcola il risultato atteso a mano prima di eseguire, non dopo.
```

## Cercare un errore logico

Quando il risultato è sbagliato e il programma ha più passaggi, bisogna capire in quale passaggio i valori smettono di essere quelli giusti. Il programma calcola il prezzo di un paio di scarpe da 80 euro scontate del 25%: lo sconto vale 20 euro, quindi deve uscire 60. Esce 55.

```codice python
prezzo = 80
sconto = 25
risparmio = prezzo * sconto // 100
finale = prezzo - sconto
print("Prezzo finale:", finale)
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int prezzo = 80;
    int sconto = 25;
    int risparmio = prezzo * sconto / 100;
    int finale = prezzo - sconto;
    cout << "Prezzo finale: " << finale << endl;
    return 0;
}
```

In C++ c'è già un indizio: sopra il risultato il compilatore avvisa che la variabile `risparmio` non è mai usata (`unused variable 'risparmio'`). Python non dice niente.

Il primo strumento sono le **stampe di controllo**: istruzioni di stampa aggiunte per vedere quanto vale una variabile in un certo punto. Dopo la riga che calcola `risparmio` aggiungi una stampa, `print("risparmio =", risparmio)` in Python oppure `cout << "risparmio = " << risparmio << endl;` in C++, ed esegui. Esce 20, che è giusto: l'errore sta più in basso. Resta una sola riga di calcolo, quella di `finale`, che sottrae la percentuale al posto degli euro risparmiati. Correggila, controlla che esca 60, e poi togli la stampa di controllo, o mettile davanti il segno del commento.

Il secondo strumento è la [tabella di traccia](/materiale/scuola-superiore/informatica/linguaggi-e-primi-programmi/variabili-assegnamento-e-tipi-di-dato), che fa lo stesso lavoro sulla carta: esegui tu il programma, una riga alla volta, e accanto al valore che ogni variabile prende scrivi quello che dovrebbe avere. La prima riga in cui le due colonne sono diverse è quella sbagliata.

| Riga eseguita | Valore che prende | Valore giusto |
|---|---|---|
| calcolo di `risparmio` | $80 \cdot 25 : 100 = 20$ | $20$, il 25% di 80 |
| calcolo di `finale` | $80 - 25 = 55$ | $80 - 20 = 60$ |

In tutti e due i modi il procedimento è lo stesso.

1. Scegli un dato preciso con cui il programma sbaglia, e calcola a mano il risultato giusto.
2. Segui i valori delle variabili, con le stampe o con la tabella, fino alla prima riga in cui un valore non è quello atteso.
3. Correggi quella riga, e solo quella.
4. Riprova con il dato di prima e con altri due o tre, compresi i casi scomodi.

```ad-warning
Cambiare a caso finché funziona
Davanti a un risultato sbagliato viene voglia di cambiare un segno, poi un altro, e riprovare. Così si aggiungono errori nuovi a quello vecchio, e alla fine non si sa più che cosa è stato cambiato. Prima si trova la riga, poi si corregge.
```

## Prova tu

Il primo programma legge un nome e un'età e deve scrivere due righe: con Sara e 15, "Ciao Sara" e "Tra dieci anni ne avrai 25". Ha tre errori che gli impediscono di partire. Eseguilo, leggi il messaggio, correggi e ripeti finché "Verifica" passa.

```codice python
nome = input()
anni = int(input()
Print("Ciao", nome)
print("Tra dieci anni ne avrai, anni + 10)
%% soluzione
nome = input()
anni = int(input())
print("Ciao", nome)
print("Tra dieci anni ne avrai", anni + 10)
%% prova
Sara
15
%% stampa
Ciao Sara
Tra dieci anni ne avrai 25
%% prova
Luca
40
%% stampa
Ciao Luca
Tra dieci anni ne avrai 50
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string nome;
    int anni
    cin >> nome;
    cin >> anni;
    cout << "Ciao " << nome << endl;
    cout << "Tra dieci anni ne avrai " << ani + 10 << endl
    return 0;
}
%% soluzione
#include <iostream>
#include <string>
using namespace std;

int main() {
    string nome;
    int anni;
    cin >> nome;
    cin >> anni;
    cout << "Ciao " << nome << endl;
    cout << "Tra dieci anni ne avrai " << anni + 10 << endl;
    return 0;
}
```

Il secondo programma legge un numero di uova e deve scrivere quante scatole da 6 si riempiono e, nella riga sotto, quante uova avanzano: con 20 uova, 3 e 2. Parte senza messaggi, ma i risultati sono sbagliati. Trova l'errore con una stampa di controllo o con la tabella di traccia, e correggilo.

```codice python
uova = int(input())
scatole = uova % 6
avanzo = uova // 6
print(scatole)
print(avanzo)
%% soluzione
uova = int(input())
scatole = uova // 6
avanzo = uova % 6
print(scatole)
print(avanzo)
%% prova
20
%% stampa
3
2
%% prova
6
%% stampa
1
0
%% prova
5
%% stampa
0
5
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int uova;
    cin >> uova;
    int scatole = uova % 6;
    int avanzo = uova / 6;
    cout << scatole << endl;
    cout << avanzo << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int uova;
    cin >> uova;
    int scatole = uova / 6;
    int avanzo = uova % 6;
    cout << scatole << endl;
    cout << avanzo << endl;
    return 0;
}
```

Il terzo errore è in un ciclo, la struttura con la freccia che torna indietro che hai visto nei [diagrammi di flusso](/materiale/scuola-superiore/informatica/algoritmi-e-diagrammi-di-flusso/i-diagrammi-di-flusso) e che ritroverai nel [ciclo while](/materiale/scuola-superiore/informatica/l-iterazione/il-ciclo-while). Il diagramma dovrebbe sommare i numeri da 1 a `n`: con 4 deve scrivere 10, perché $1 + 2 + 3 + 4 = 10$. Eseguilo con "Passo" e, a ogni passaggio dal rombo, segna su un foglio i valori di `i` e di `s`: all'ultimo giro manca qualcosa. Poi premi "Modifica", correggi il blocco sbagliato e riprova con 4 e con 1.

```diagramma
% nome: diagramma-flusso-somma-con-errore
% alt: Diagramma di flusso con un errore da trovare: dopo l'inizio si legge n, s prende il valore 0 e i prende il valore 1; un rombo chiede se i è minore di n; il ramo sì scende a s prende s più i e poi a i prende i più 1, da cui una freccia risale fino a sopra il rombo; il ramo no esce a destra e scende a scrivi s e alla fine
% ingresso: 4
leggi n
s = 0
i = 1
finché i < n
    s = s + i
    i = i + 1
scrivi s
```
