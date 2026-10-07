# Prova dei programmi nelle lezioni

Questa pagina prova i blocchi `codice`: un esempio da eseguire, lo stesso programma in tre linguaggi, un esercizio con le prove, un esercizio in JavaScript, una pagina web con i suoi controlli e due progetti a più file.

## Un programma da eseguire

Un ciclo `for` ripete le istruzioni rientrate una volta per ogni valore dell'intervallo. Esegui il programma, poi cambia `range(1, 6)` e guarda che cosa succede.

```codice python
for i in range(1, 6):
    print(i, "al quadrato fa", i * i)
```

## Lo stesso programma in tre linguaggi

Il programma legge due numeri interi e scrive il più grande. La linguetta sceglie il linguaggio, e la scelta vale per tutti i programmi della pagina.

```codice python
a = int(input("Primo numero: "))
b = int(input("Secondo numero: "))

if a > b:
    print("Il più grande è", a)
else:
    print("Il più grande è", b)
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cout << "Primo numero: ";
    cin >> a;
    cout << "Secondo numero: ";
    cin >> b;

    if (a > b) {
        cout << "Il più grande è " << a << endl;
    } else {
        cout << "Il più grande è " << b << endl;
    }
    return 0;
}
```

```codice c
#include <stdio.h>

int main(void) {
    int a, b;
    printf("Primo numero: ");
    scanf("%d", &a);
    printf("Secondo numero: ");
    scanf("%d", &b);

    if (a > b) {
        printf("Il più grande è %d\n", a);
    } else {
        printf("Il più grande è %d\n", b);
    }
    return 0;
}
```

## Un esercizio

Scrivi un programma che legge un numero intero $n$ e stampa la somma dei numeri da $1$ a $n$. Il programma di partenza legge $n$ e stampa sempre $0$: completalo. "Verifica" lo prova su quattro valori di $n$.

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
1
%% stampa
1
%% prova
4
%% stampa
10
%% prova
100
%% stampa
5050
%% prova
0
%% stampa
0
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int n, somma = 0;
    cin >> n;
    // scrivi qui il ciclo

    cout << somma << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int n, somma = 0;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        somma += i;
    }

    cout << somma << endl;
    return 0;
}
```

```codice c
#include <stdio.h>

int main(void) {
    int n, somma = 0;
    scanf("%d", &n);
    /* scrivi qui il ciclo */

    printf("%d\n", somma);
    return 0;
}
%% soluzione
#include <stdio.h>

int main(void) {
    int n, somma = 0;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) {
        somma += i;
    }

    printf("%d\n", somma);
    return 0;
}
```

## Un esercizio in JavaScript

Il programma legge un numero con `prompt()` e scrive con `console.log()` se è pari o dispari.

```codice javascript
const n = Number(prompt("Numero?"));
// scrivi qui
%% soluzione
const n = Number(prompt("Numero?"));
if (n % 2 === 0) {
    console.log("pari");
} else {
    console.log("dispari");
}
%% prova
4
%% stampa
pari
%% prova
7
%% stampa
dispari
```

## Una pagina web

La pagina ha un titolo e un elenco. Scrivi "Le mie materie" nel titolo, aggiungi una terza voce all'elenco e fai diventare il titolo blu nel foglio di stile.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Materie</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1></h1>
    <ul>
        <li>Matematica</li>
        <li>Informatica</li>
    </ul>
</body>
</html>
%% soluzione
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Materie</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Le mie materie</h1>
    <ul>
        <li>Matematica</li>
        <li>Informatica</li>
        <li>Fisica</li>
    </ul>
</body>
</html>
%% controllo Il titolo dice "Le mie materie"
h1 | testo = Le mie materie
%% controllo L'elenco ha tre voci
ul > li | quanti = 3
%% controllo Il titolo è blu
h1 | stile color = blue
```

```codice css
h1 {
    color: black;
}
%% soluzione
h1 {
    color: blue;
}
```

## Un sito di due pagine

Più blocchi con il nome di un file sono un progetto: ogni file ha la sua linguetta, e il primo è quello aperto. Le due pagine si richiamano con un link e usano lo stesso foglio di stile.

```codice index.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Home</title>
    <link rel="stylesheet" href="stile.css">
</head>
<body>
    <h1>Home</h1>
    <a href="contatti.html">Contatti</a>
</body>
</html>
```

```codice contatti.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Contatti</title>
    <link rel="stylesheet" href="stile.css">
</head>
<body>
    <h1>Contatti</h1>
    <a href="index.html">Torna alla home</a>
</body>
</html>
```

```codice stile.css
h1 {
    color: teal;
}
```

## Un programma con un modulo

Il programma usa una funzione scritta in un altro file. Completa `doppio` nel modulo `conti.py`.

```codice main.py
import conti

n = int(input())
print(conti.doppio(n))
%% prova
4
%% stampa
8
```

```codice conti.py
def doppio(n):
    # scrivi qui
    return n
%% soluzione
def doppio(n):
    return n * 2
```

## Leggere un file

Il programma ha accanto il file `dati.txt`, uguale per i due linguaggi: lo legge riga per riga e somma i numeri. Poi prova ad aprire un file che non c'è.

```codice python
somma = 0
with open("dati.txt") as file:
    for riga in file:
        somma += int(riga)
print("Somma:", somma)

try:
    open("manca.txt")
except FileNotFoundError:
    print("manca.txt non c'è")
%% prova
%% stampa
Somma: 49
manca.txt non c'è
```

```codice cpp
#include <fstream>
#include <iostream>
using namespace std;

int main() {
    ifstream file("dati.txt");
    int numero, somma = 0;
    while (file >> numero) {
        somma += numero;
    }
    cout << "Somma: " << somma << endl;

    ifstream altro("manca.txt");
    if (!altro) {
        cout << "manca.txt non c'è" << endl;
    }
}
```

```codice dati.txt
12
7
30
```

## Scrivere un file

Leggi un numero `n` dalla tastiera e scrivi nel file `uscita.txt` i numeri da 1 a `n`, uno per riga. "Verifica" controlla il file.

```codice python
n = int(input())
with open("uscita.txt", "w") as file:
    # scrivi qui
    pass
print("Fatto")
%% soluzione
n = int(input())
with open("uscita.txt", "w") as file:
    for i in range(1, n + 1):
        file.write(str(i) + "\n")
print("Fatto")
%% prova
3
%% stampa
Fatto
%% file uscita.txt
1
2
3
%% prova
1
%% file uscita.txt
1
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

    cout << "Fatto" << endl;
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
    cout << "Fatto" << endl;
}
```

## Accodare a un file

Il programma chiede un nome e lo aggiunge in fondo a `registro.txt`, poi rilegge il file. La risposta dalla tastiera non deve far scrivere il nome due volte.

```codice python
nome = input("Come ti chiami? ")
with open("registro.txt", "a") as file:
    file.write(nome + "\n")

with open("registro.txt") as file:
    print(file.read())
%% prova
Luca
%% file registro.txt
Ada
Luca
```

```codice cpp
#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    string nome;
    getline(cin, nome);
    ofstream file("registro.txt", ios::app);
    file << nome << endl;
    file.close();

    ifstream letto("registro.txt");
    string riga;
    while (getline(letto, riga)) {
        cout << riga << endl;
    }
}
```

```codice registro.txt
Ada
```

## Un contatore

Il bottone deve aumentare di uno il numero a ogni clic. "Verifica" preme il bottone sulla tua pagina e guarda che cosa segna il contatore.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Contatore</title>
    <script src="script.js" defer></script>
</head>
<body>
    <p>Clic: <span id="conta">0</span></p>
    <button id="piu">Aggiungi</button>
</body>
</html>
%% controllo All'inizio il contatore segna 0
#conta | testo = 0
%% controllo Dopo un clic il contatore segna 1
> clic #piu
#conta | testo = 1
%% controllo Dopo tre clic il contatore segna 3
> clic #piu
> clic #piu
> clic #piu
#conta | testo = 3
```

```codice js
const conta = document.querySelector("#conta");
const piu = document.querySelector("#piu");
let clic = 0;
// scrivi qui: al clic sul bottone il numero aumenta
%% soluzione
const conta = document.querySelector("#conta");
const piu = document.querySelector("#piu");
let clic = 0;
piu.addEventListener("click", () => {
    clic = clic + 1;
    conta.textContent = clic;
});
```

## Un modulo che controlla il nome

Se il campo del nome è vuoto, il modulo non deve partire e deve comparire il messaggio di errore. Con il nome scritto il modulo parte e il messaggio resta nascosto.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Iscrizione</title>
</head>
<body>
    <form id="iscrizione">
        <label>Nome <input id="nome" name="nome"></label>
        <button>Invia</button>
        <p class="errore" hidden>Scrivi il tuo nome.</p>
    </form>
    <script src="script.js"></script>
</body>
</html>
%% controllo Con il nome vuoto compare l'errore e il modulo non parte
> clic #iscrizione button
.errore | visibile
.errore | testo contiene nome
#iscrizione | non inviato
%% controllo Con il nome scritto il modulo parte e l'errore non si vede
> scrivi #nome | Anna
> clic #iscrizione button
#nome | valore = Anna
.errore | nascosto
#iscrizione | inviato
```

```codice js
const modulo = document.querySelector("#iscrizione");
const nome = document.querySelector("#nome");
const errore = document.querySelector(".errore");

modulo.addEventListener("submit", (evento) => {
    // scrivi qui: se il nome è vuoto ferma l'invio e mostra l'errore
});
%% soluzione
const modulo = document.querySelector("#iscrizione");
const nome = document.querySelector("#nome");
const errore = document.querySelector(".errore");

modulo.addEventListener("submit", (evento) => {
    if (nome.value.trim() === "") {
        evento.preventDefault();
        errore.hidden = false;
    } else {
        errore.hidden = true;
    }
});
```

## Le altre azioni di un controllo

Una pagina già finita, per provare le azioni che i due esercizi sopra non usano: scegliere un'opzione, spuntare una casella, premere un tasto, aspettare, e leggere il messaggio di un `alert`.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Azioni</title>
    <script src="script.js" defer></script>
</head>
<body>
    <select id="classe">
        <option value="">Scegli la classe</option>
        <option value="3">Terza</option>
        <option value="4">Quarta</option>
    </select>
    <label><input type="checkbox" id="accetto"> Accetto</label>
    <input id="cerca" placeholder="Scrivi e premi Invio">
    <button id="saluta">Saluta</button>
    <p id="esito"></p>
    <ul id="lista"></ul>
</body>
</html>
%% controllo Scegliendo "Terza" la pagina scrive la classe
> scegli #classe | Terza
#classe | valore = 3
#esito | testo = Classe 3
#lista li | non esiste
@avviso | non esiste
%% controllo La casella spuntata dà la classe "ok" al messaggio
> spunta #accetto
#accetto | spuntato
#esito | classe ok
%% controllo Tolta la spunta, la classe "ok" va via
> spunta #accetto
> togli #accetto
#accetto | non spuntato
#esito | senza classe ok
%% controllo Invio nel campo aggiunge la voce all'elenco e svuota il campo
> scrivi #cerca | pane
> premi #cerca | Enter
#lista li | quanti = 1
#lista li | testo = pane
#cerca | valore =
%% controllo Il bottone saluta con un avviso e poco dopo scrive "Fatto"
> clic #saluta
> aspetta 400
@avviso | testo contiene Ciao
#esito | testo = Fatto
```

```codice js
const esito = document.querySelector("#esito");
const cerca = document.querySelector("#cerca");

document.querySelector("#classe").addEventListener("change", (evento) => {
    esito.textContent = "Classe " + evento.target.value;
});

document.querySelector("#accetto").addEventListener("change", (evento) => {
    esito.classList.toggle("ok", evento.target.checked);
});

cerca.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        const voce = document.createElement("li");
        voce.textContent = cerca.value;
        document.querySelector("#lista").append(voce);
        cerca.value = "";
    }
});

document.querySelector("#saluta").addEventListener("click", () => {
    alert("Ciao!");
    setTimeout(() => {
        esito.textContent = "Fatto";
    }, 300);
});
```

## Un modulo inviato a mano

Una pagina senza script. Premi "Invia" con i campi vuoti: il browser segnala il primo campo sbagliato e il modulo non parte. Riempi i campi e premi di nuovo: sotto l'anteprima compare che cosa è stato inviato, e la pagina resta dov'è.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Iscrizione</title>
</head>
<body>
    <form method="post" action="iscrivi.php">
        <label>Nome <input name="nome" id="nome" required></label>
        <label>Email <input name="email" id="email" type="email" required></label>
        <button>Invia</button>
    </form>
</body>
</html>
%% controllo Con i campi vuoti il browser non fa partire il modulo
> invia form
form | non inviato
%% controllo Un'email scritta male ferma il modulo
> scrivi #nome | Anna
> scrivi #email | anna
> clic button
form | non inviato
%% controllo Con i campi giusti il modulo parte
> scrivi #nome | Anna
> scrivi #email | anna@scuola.example
> clic button
form | inviato
```

## Stili, percorsi e larghezza dell'anteprima

Dai al titolo un bordo sopra di 2 pixel e fallo diventare rosso quando la pagina è larga al più 600 pixel. I controlli leggono lo stile calcolato, anche di una scorciatoia; l'ultimo guarda il link, che può essere scritto `./orari.html`.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Stili</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Biblioteca</h1>
    <nav>
        <a href="./orari.html">Orari</a>
        <a href="#fondo">In fondo</a>
    </nav>
    <p id="fondo">Aperta ogni giorno.</p>
</body>
</html>
%% controllo Il titolo ha un bordo sopra di 2 pixel, continuo
h1 | stile border-top-width = 2px
h1 | stile border-top-style = solid
%% controllo Il menu è una riga centrata, con 10 pixel tra i link
nav | stile display = flex
nav | stile justify-content = center
nav | stile gap = 10px
%% controllo Il titolo è largo metà pagina, centrato, con il suo spazio
h1 | stile width = 50%
h1 | stile text-align = center
h1 | stile padding = 4px 8px
h1 | stile margin-bottom = 1em
h1 | stile font-weight = bold
%% controllo Su una pagina larga 900 pixel il titolo è nero
> larghezza 900
h1 | stile color = black
%% controllo Su una pagina larga 400 pixel il titolo è rosso
> larghezza 400
h1 | stile color = red
%% controllo Il primo link porta a orari.html
nav a | attributo href = orari.html
```

```codice css
h1 {
    width: 50%;
    text-align: center;
    padding: 4px 8px;
    margin-bottom: 1em;
}

nav {
    display: flex;
    justify-content: center;
    gap: 10px;
}
%% soluzione
h1 {
    width: 50%;
    text-align: center;
    padding: 4px 8px;
    margin-bottom: 1em;
    border-top: 2px solid teal;
}

nav {
    display: flex;
    justify-content: center;
    gap: 10px;
}

@media (max-width: 600px) {
    h1 {
        color: red;
    }
}
```

## Un link a un punto di un'altra pagina

Il link della prima pagina apre la seconda e la fa scorrere fino all'elemento con `id="fondo"`; il link della seconda scorre nella stessa pagina.

```codice index.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Inizio</title>
</head>
<body>
    <h1>Inizio</h1>
    <a id="vai" href="lunga.html#fondo">Vai in fondo alla pagina lunga</a>
</body>
</html>
```

```codice lunga.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Pagina lunga</title>
</head>
<body>
    <h1 id="cima">Pagina lunga</h1>
    <a id="giu" href="#fondo">Vai in fondo</a>
    <div style="height: 1500px"></div>
    <h2 id="fondo">Il fondo</h2>
    <a id="su" href="lunga.html#cima">Torna su</a>
    <div style="height: 600px"></div>
</body>
</html>
```
