# Le stringhe

Il nome che scrivi per registrarti a un sito, il messaggio in una chat, la parola che cerchi in una pagina: sono tutti testi, e un programma li tratta come [stringhe](/materiale/scuola-superiore/informatica/linguaggi-e-primi-programmi/variabili-assegnamento-e-tipi-di-dato). Finora una stringa l'hai letta, stampata e confrontata tutta intera. Per controllare che una password contenga una cifra, o per ricavare le iniziali di un nome, bisogna entrarci dentro e guardare i caratteri uno alla volta.

## Una fila di caratteri con gli indici

Una **stringa** è una fila di caratteri, e si comporta come un [vettore](/materiale/scuola-superiore/informatica/vettori-matrici-e-stringhe/i-vettori) i cui elementi sono caratteri: ogni carattere ha un indice, gli indici partono da $0$, e `nome[2]` è il terzo carattere di `nome`. Il numero dei caratteri è la **lunghezza** della stringa. Contano tutti, anche gli spazi e i segni di punteggiatura, perché in memoria ogni carattere è un numero, il suo codice, come hai visto in [La codifica dei caratteri: ASCII e Unicode](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-dei-caratteri-ascii-e-unicode).

La stringa `"Giulia"` ha lunghezza $6$ e indici da $0$ a $5$: l'ultimo carattere ha indice $6 - 1$, e in generale una stringa di lunghezza $n$ finisce all'indice $n - 1$.

```codice python
nome = "Giulia"
n = len(nome)
print("Lunghezza:", n)
print("Primo carattere:", nome[0])
print("Terzo carattere:", nome[2])
print("Ultimo carattere:", nome[n - 1])
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string nome = "Giulia";
    int n = nome.length();
    cout << "Lunghezza: " << n << endl;
    cout << "Primo carattere: " << nome[0] << endl;
    cout << "Terzo carattere: " << nome[2] << endl;
    cout << "Ultimo carattere: " << nome[n - 1] << endl;
    return 0;
}
```

```ad-note
Che cosa cambia tra Python e C++
La lunghezza si chiede con `len(nome)` in Python e con `nome.length()` in C++, dove serve la riga `#include <string>`. In C++ un carattere solo ha un tipo suo, `char`, e si scrive tra apici singoli: `'a'` è un carattere, `"a"` è una stringa lunga $1$. In Python il tipo `char` non c'è, e un carattere è una stringa di lunghezza $1$. In C++ puoi cambiare un carattere con un assegnamento, `nome[0] = 'g'`; in Python una stringa non si modifica, e `nome[0] = "g"` dà un errore: se ne costruisce una nuova.
```

```ad-warning
La lunghezza non è un indice
`nome[n]` non esiste, come `voti[5]` in un vettore di cinque elementi: l'ultimo carattere è `nome[n - 1]`. In Python `nome[6]` ferma il programma con `IndexError: string index out of range`; il C++ non controlla e stampa un carattere che non fa parte del nome, di solito invisibile.
```

Cambia il nome in `"Anna Maria"` ed esegui: la lunghezza è $10$, perché lo spazio è un carattere, e `nome[4]` è proprio lo spazio.

## Scorrere una stringa con un ciclo

Per sapere quante vocali ha una parola non c'è un'istruzione pronta: il programma guarda un carattere alla volta, dal primo all'ultimo, e tiene un [contatore](/materiale/scuola-superiore/informatica/l-iterazione/contatori-e-accumulatori). È lo stesso ciclo che scorre un vettore, con `i` che va da $0$ a $n - 1$ e `parola[i]` al posto dell'elemento. Quanti giri fa il ciclo sulla parola "informatica", e in quanti di questi il contatore cambia? Esegui la figura un passo alla volta, poi scrivi una parola tua.

```interattivo
% nome: inf-stringa-vocali
% alt: La parola informatica scritta in undici celle attaccate, una per carattere, con gli indici da 0 a 10 sotto. Una freccia con il nome i indica il carattere in esame e avanza di una cella a ogni passo: le vocali già contate diventano verdi, le consonanti restano tratteggiate. Sotto, due contatori mostrano la lunghezza, 11, e le vocali trovate, che salgono da 0 a 5. Un campo permette di scrivere un'altra parola e un bottone ne propone altre
```

Il ciclo fa $11$ giri, uno per carattere, e il contatore sale in $5$ di questi: le vocali sono i, o, a, i, a. Nel programma la domanda "è una vocale?" sta in una [funzione](/materiale/scuola-superiore/informatica/le-funzioni/parametri-e-valore-di-ritorno) che riceve un carattere e restituisce vero o falso, così il ciclo resta di tre righe.

```codice python
def vocale(c):
    return c == "a" or c == "e" or c == "i" or c == "o" or c == "u"

parola = input("Parola: ")
n = len(parola)
conta = 0
for i in range(n):
    if vocale(parola[i]):
        conta = conta + 1
print("Vocali:", conta, "su", n, "caratteri")
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

bool vocale(char c) {
    return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
}

int main() {
    string parola;
    cout << "Parola: ";
    cin >> parola;
    int n = parola.length();
    int conta = 0;
    for (int i = 0; i < n; i++) {
        if (vocale(parola[i])) {
            conta = conta + 1;
        }
    }
    cout << "Vocali: " << conta << " su " << n << " caratteri" << endl;
    return 0;
}
```

Esegui con "Aiuola": le vocali contate sono $4$ e non $5$, perché la A maiuscola e la a minuscola sono caratteri diversi, con codici diversi, e la funzione conosce solo le minuscole.

```ad-note
Leggere una frase intera
In Python `input()` legge tutta la riga, spazi compresi. In C++ `cin >> parola` si ferma al primo spazio: di "Anna Maria" legge solo "Anna". Per leggere tutta la riga si scrive `getline(cin, parola);`.
```

```ad-warning
Le lettere accentate in C++
In C++ la lunghezza di una `string` conta i byte, non i caratteri, e nella codifica più usata una lettera accentata occupa due byte: `"città"` risulta lunga $6$, e il ciclo trova due caratteri strani al posto della à. In Python `len("città")` vale $5$. Negli esempi di queste lezioni le parole sono senza accenti.
```

## Costruire una stringa un pezzo alla volta

L'operatore `+` tra due stringhe le unisce in una sola: è la **concatenazione**, e `"regi" + "stro"` dà `"registro"`. Con un ciclo si costruisce una stringa nuova partendo dalla stringa vuota, `""`, e aggiungendo un carattere a ogni giro, come un accumulatore che al posto di sommare numeri attacca caratteri. Per rovesciare una parola la si legge dall'ultimo carattere al primo, attaccando ogni carattere in fondo alla stringa nuova.

```codice python
parola = input("Parola: ")
rovescia = ""
for i in range(len(parola) - 1, -1, -1):
    rovescia = rovescia + parola[i]
print(rovescia)
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string parola;
    cout << "Parola: ";
    cin >> parola;
    string rovescia = "";
    int n = parola.length();
    for (int i = n - 1; i >= 0; i--) {
        rovescia = rovescia + parola[i];
    }
    cout << rovescia << endl;
    return 0;
}
```

Con "roma" esce "amor". Ora fai andare `i` in avanti, da $0$ a $n - 1$, e scambia l'ordine dei due pezzi: `rovescia = parola[i] + rovescia`. Il risultato è lo stesso, perché ogni carattere nuovo viene messo davanti a quelli già presi.

```ad-warning
Il + tra una stringa e un numero
`"3" + "4"` fa `"34"`, non $7$: tra stringhe il `+` attacca. Per unire un numero a un testo bisogna prima trasformarlo in stringa, con `str(eta)` in Python e `to_string(eta)` in C++: `"Hai " + str(eta) + " anni"`. Senza la conversione Python si ferma con `TypeError`. Il C++ è più insidioso: `"Hai " + eta`, con un testo tra virgolette e un numero, compila e stampa un testo sbagliato.
```

## Confrontare due stringhe

Con `==` due stringhe sono uguali se hanno gli stessi caratteri nello stesso ordine, e con `<` viene prima quella che precede l'altra nell'ordine dei codici, come hai visto parlando di [condizioni](/materiale/scuola-superiore/informatica/la-selezione/condizioni-e-operatori-di-confronto). Anche i singoli caratteri si confrontano così, ed è quello che serve per riconoscere una parola **palindroma**, cioè che si legge uguale nei due versi, come "radar" e "ossesso".

Si può rovesciare la parola e confrontarla con l'originale. Oppure si usano due indici: `i` parte dal primo carattere e `j` dall'ultimo, si confrontano `parola[i]` e `parola[j]`, e se sono uguali i due indici si avvicinano di un posto. Quanti confronti servono per una parola di $7$ lettere, e quanti se una coppia è diversa? Esegui la figura su "ossesso", poi premi "Un'altra parola" fino a "ossuto".

```interattivo
% nome: inf-stringa-palindroma
% alt: La parola ossesso scritta in sette celle attaccate con gli indici da 0 a 6. Una freccia con il nome i parte sotto la prima cella e una con il nome j sopra l'ultima: a ogni passo i due caratteri indicati vengono confrontati e, se sono uguali, le due celle diventano verdi e le frecce si avvicinano di un posto. Un contatore mostra i confronti, che per ossesso sono 3; alla fine le frecce sono tutte e due sulla cella di mezzo e la figura dice che la parola è palindroma. Con una parola come ossuto la seconda coppia, s e t, si colora di arancione pieno e la figura si ferma dopo 2 confronti. Un campo permette di scrivere un'altra parola
```

Per "ossesso" bastano $3$ confronti: le coppie sono tre e il carattere di mezzo resta da solo. In generale i confronti sono al più la metà della lunghezza, perché ogni confronto sistema due caratteri. Con "ossuto" la prima coppia è uguale e la seconda no: dopo $2$ confronti la risposta c'è già, e il ciclo si ferma. Il programma usa una variabile booleana, come `trovato` nella [ricerca sequenziale](/materiale/scuola-superiore/informatica/vettori-matrici-e-stringhe/la-ricerca-sequenziale): parte da vero, e la prima coppia diversa la porta a falso.

```codice python
parola = input("Parola: ")
i = 0
j = len(parola) - 1
palindroma = True
while i < j and palindroma:
    if parola[i] != parola[j]:
        palindroma = False
    else:
        i = i + 1
        j = j - 1
if palindroma:
    print(parola, "è palindroma")
else:
    print(parola, "non è palindroma")
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string parola;
    cout << "Parola: ";
    cin >> parola;
    int i = 0;
    int j = parola.length() - 1;
    bool palindroma = true;
    while (i < j && palindroma) {
        if (parola[i] != parola[j]) {
            palindroma = false;
        } else {
            i = i + 1;
            j = j - 1;
        }
    }
    if (palindroma) {
        cout << parola << " è palindroma" << endl;
    } else {
        cout << parola << " non è palindroma" << endl;
    }
    return 0;
}
```

Prova con "Anna": il programma risponde che non è palindroma, perché confronta la A maiuscola con la a minuscola.

## Qualche operazione già pronta

Le operazioni più comuni sulle stringhe non vanno riscritte ogni volta con un ciclo: i due linguaggi le hanno già. Una **sottostringa** è un pezzo di stringa fatto di caratteri consecutivi.

| Operazione | Python | C++ |
|---|---|---|
| lunghezza | `len(s)` | `s.length()` |
| posizione della prima "@" | `s.find("@")` | `s.find("@")` |
| sottostringa dall'indice 0 al 4 | `s[0:5]` | `s.substr(0, 5)` |
| sottostringa dall'indice 6 alla fine | `s[6:]` | `s.substr(6)` |
| tutta in maiuscolo | `s.upper()` | un ciclo con `toupper(s[i])` |

In Python tra le quadre si scrivono l'indice di partenza e quello a cui fermarsi, che resta escluso; in C++ `substr` vuole l'indice di partenza e quanti caratteri prendere. Il programma divide un indirizzo di posta nei due pezzi attorno alla chiocciola.

```codice python
indirizzo = "giulia.rossi@scuola.example"
p = indirizzo.find("@")
utente = indirizzo[0:p]
dominio = indirizzo[p + 1:]
print("Chiocciola all'indice", p)
print("Utente:", utente)
print("Dominio:", dominio)
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string indirizzo = "giulia.rossi@scuola.example";
    int p = indirizzo.find("@");
    string utente = indirizzo.substr(0, p);
    string dominio = indirizzo.substr(p + 1);
    cout << "Chiocciola all'indice " << p << endl;
    cout << "Utente: " << utente << endl;
    cout << "Dominio: " << dominio << endl;
    return 0;
}
```

Togli la chiocciola dall'indirizzo ed esegui: `find` non trova niente e nella variabile finisce $-1$, e i due pezzi che escono non hanno senso. Prima di usare la posizione va controllato che non sia $-1$.

## Prova tu

Il programma legge un nome e un cognome, uno per riga, e deve scrivere le iniziali, ognuna seguita da un punto: con "Giulia" e "Rossi" scrive `G.R.`

```codice python
nome = input()
cognome = input()
# scrivi qui la stampa delle iniziali
%% soluzione
nome = input()
cognome = input()
print(nome[0] + "." + cognome[0] + ".")
%% prova
Giulia
Rossi
%% stampa
G.R.
%% prova
Ada
Lovelace
%% stampa
A.L.
%% prova
x
y
%% stampa
x.y.
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string nome, cognome;
    cin >> nome;
    cin >> cognome;
    // scrivi qui la stampa delle iniziali

    return 0;
}
%% soluzione
#include <iostream>
#include <string>
using namespace std;

int main() {
    string nome, cognome;
    cin >> nome;
    cin >> cognome;
    cout << nome[0] << "." << cognome[0] << "." << endl;

    return 0;
}
```

Nel secondo esercizio il programma legge una parola scritta in minuscolo e ne costruisce una nuova, in cui ogni vocale è sostituita da un asterisco: "informatica" diventa `*nf*rm*t*c*`. Parti dalla stringa vuota e a ogni giro attacca il carattere giusto. La funzione `vocale` c'è già.

```codice python
def vocale(c):
    return c == "a" or c == "e" or c == "i" or c == "o" or c == "u"

parola = input()
nuova = ""
# scrivi qui il ciclo

print(nuova)
%% soluzione
def vocale(c):
    return c == "a" or c == "e" or c == "i" or c == "o" or c == "u"

parola = input()
nuova = ""
for i in range(len(parola)):
    if vocale(parola[i]):
        nuova = nuova + "*"
    else:
        nuova = nuova + parola[i]

print(nuova)
%% prova
informatica
%% stampa
*nf*rm*t*c*
%% prova
ritmo
%% stampa
r*tm*
%% prova
aiuole
%% stampa
****l*
%% prova
tre
%% stampa
tr*
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

bool vocale(char c) {
    return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
}

int main() {
    string parola;
    cin >> parola;
    string nuova = "";
    // scrivi qui il ciclo

    cout << nuova << endl;
    return 0;
}
%% soluzione
#include <iostream>
#include <string>
using namespace std;

bool vocale(char c) {
    return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
}

int main() {
    string parola;
    cin >> parola;
    string nuova = "";
    int n = parola.length();
    for (int i = 0; i < n; i++) {
        if (vocale(parola[i])) {
            nuova = nuova + "*";
        } else {
            nuova = nuova + parola[i];
        }
    }

    cout << nuova << endl;
    return 0;
}
```
