import type { ProjectFiles } from '@/lib/codice/progetto';
import type { Language } from './runtime';

type Example = { title: string; code: string };

/** Programs for trying the editor: each leans on a different part of the runner (input, loops, random, turtle, matplotlib, errors). */
const PYTHON: Example[] = [
	{
		title: 'Saluto',
		code: `nome = input("Come ti chiami? ")
anno = int(input("In che anno sei nato? "))

print(f"Ciao {nome}!")
print(f"Nel 2026 compi {2026 - anno} anni.")
`
	},
	{
		title: 'Tabellina',
		code: `n = int(input("Di quale numero vuoi la tabellina? "))

for i in range(1, 11):
    print(f"{n} x {i:2} = {n * i}")
`
	},
	{
		title: 'Indovina il numero',
		code: `import random

segreto = random.randint(1, 100)
tentativi = 0

print("Ho pensato un numero da 1 a 100.")
while True:
    n = int(input("Il tuo numero: "))
    tentativi += 1
    if n < segreto:
        print("Troppo piccolo.")
    elif n > segreto:
        print("Troppo grande.")
    else:
        break

print(f"Indovinato in {tentativi} tentativi!")
`
	},
	{
		title: 'Numeri primi',
		code: `def primo(n):
    """Dice se n è un numero primo."""
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d += 1
    return True

primi = [n for n in range(1, 100) if primo(n)]
print(primi)
print("Sono", len(primi))
`
	},
	{
		title: 'Tartaruga: stella',
		code: `import turtle

t = turtle.Turtle()
t.penup()
t.goto(-100, 30)
t.pendown()

t.color("red", "gold")
t.begin_fill()
for _ in range(5):
    t.forward(200)
    t.right(144)
t.end_fill()
`
	},
	{
		title: 'Tartaruga: spirale',
		code: `import turtle

turtle.speed(10)
turtle.bgcolor("black")
colori = ["red", "orange", "yellow", "green", "deepskyblue", "violet"]

for i in range(120):
    turtle.pencolor(colori[i % 6])
    turtle.width(i / 40 + 1)
    turtle.forward(i * 2)
    turtle.left(59)

turtle.hideturtle()
`
	},
	{
		title: 'Grafico con matplotlib',
		code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-2, 4, 200)
plt.plot(x, x**2 - 2*x - 1, label="y = x² - 2x - 1")
plt.axhline(0, color="gray", linewidth=0.8)
plt.axvline(0, color="gray", linewidth=0.8)
plt.grid(True, alpha=0.3)
plt.legend()
plt.title("Una parabola")
plt.show()

radici = np.roots([1, -2, -1])
print("Radici:", np.round(radici, 3))
`
	},
	{
		title: 'Un errore',
		code: `def media(voti):
    return sum(voti) / len(voti)

print(media([7, 8, 6.5]))
print(media([]))
`
	},
	{
		title: 'Un ciclo che non finisce',
		code: `# Manca l'aggiornamento di i: il programma viene fermato.
i = 0
while i < 10:
    print(i)
`
	}
];

const C: Example[] = [
	{
		title: 'Saluto',
		code: `#include <stdio.h>

int main(void) {
    char nome[50];
    int anno;

    printf("Come ti chiami? ");
    scanf("%49s", nome);
    printf("In che anno sei nato? ");
    scanf("%d", &anno);

    printf("Ciao %s!\\n", nome);
    printf("Nel 2026 compi %d anni.\\n", 2026 - anno);
    return 0;
}
`
	},
	{
		title: 'Tabellina',
		code: `#include <stdio.h>

int main(void) {
    int n;
    printf("Di quale numero vuoi la tabellina? ");
    scanf("%d", &n);

    for (int i = 1; i <= 10; i++) {
        printf("%d x %2d = %d\\n", n, i, n * i);
    }
    return 0;
}
`
	},
	{
		title: 'Media di un vettore',
		code: `#include <stdio.h>

#define N 5

float media(int v[], int n) {
    int somma = 0;
    for (int i = 0; i < n; i++) {
        somma += v[i];
    }
    return (float) somma / n;
}

int main(void) {
    int voti[N] = {7, 8, 6, 9, 5};
    printf("Media: %.2f\\n", media(voti, N));
    return 0;
}
`
	},
	{
		title: 'Puntatori',
		code: `#include <stdio.h>

void scambia(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int main(void) {
    int x = 3, y = 8;
    printf("Prima:  x = %d, y = %d\\n", x, y);
    scambia(&x, &y);
    printf("Dopo:   x = %d, y = %d\\n", x, y);
    return 0;
}
`
	},
	{
		title: 'Un errore di compilazione',
		code: `#include <stdio.h>

int main(void) {
    int n = 5
    printf("%d\\n", m);
    return 0;
}
`
	},
	{
		title: 'Una divisione per zero',
		code: `#include <stdio.h>

int main(void) {
    int a = 10, b = 0;
    printf("Calcolo %d / %d...\\n", a, b);
    printf("%d\\n", a / b);
    return 0;
}
`
	}
];

const CPP: Example[] = [
	{
		title: 'Saluto',
		code: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string nome;
    int anno;

    cout << "Come ti chiami? ";
    cin >> nome;
    cout << "In che anno sei nato? ";
    cin >> anno;

    cout << "Ciao " << nome << "!" << endl;
    cout << "Nel 2026 compi " << 2026 - anno << " anni." << endl;
    return 0;
}
`
	},
	{
		title: 'Indovina il numero',
		code: `#include <cstdlib>
#include <ctime>
#include <iostream>
using namespace std;

int main() {
    srand(time(0));
    int segreto = rand() % 100 + 1;
    int tentativi = 0, n;

    cout << "Ho pensato un numero da 1 a 100." << endl;
    do {
        cout << "Il tuo numero: ";
        cin >> n;
        tentativi++;
        if (n < segreto) cout << "Troppo piccolo." << endl;
        else if (n > segreto) cout << "Troppo grande." << endl;
    } while (n != segreto);

    cout << "Indovinato in " << tentativi << " tentativi!" << endl;
    return 0;
}
`
	},
	{
		title: 'Vettore ordinato',
		code: `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {42, 7, 19, 3, 25};
    sort(v.begin(), v.end());

    for (int x : v) {
        cout << x << " ";
    }
    cout << endl;
    cout << "Il massimo è " << v.back() << endl;
    return 0;
}
`
	},
	{
		title: 'Classi ed ereditarietà',
		code: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Figura {
public:
    virtual ~Figura() {}
    virtual double area() const = 0;
    virtual string nome() const = 0;
};

class Rettangolo : public Figura {
    double base, altezza;
public:
    Rettangolo(double b, double h) : base(b), altezza(h) {}
    double area() const override { return base * altezza; }
    string nome() const override { return "Rettangolo"; }
};

class Cerchio : public Figura {
    double raggio;
public:
    Cerchio(double r) : raggio(r) {}
    double area() const override { return 3.14159265 * raggio * raggio; }
    string nome() const override { return "Cerchio"; }
};

int main() {
    vector<Figura*> figure = {new Rettangolo(3, 4), new Cerchio(1)};
    for (Figura* f : figure) {
        cout << f->nome() << ": area " << f->area() << endl;
        delete f;
    }
    return 0;
}
`
	},
	{
		title: 'Un errore di compilazione',
		code: `#include <iostream>
using namespace std;

int main() {
    int n = "cinque";
    cout << m << endl
    return 0;
}
`
	},
	{
		title: 'Un ciclo che non finisce',
		code: `#include <iostream>
using namespace std;

int main() {
    // Manca l'aggiornamento di i: il programma viene fermato.
    int i = 0;
    while (i < 10) {
        cout << i << endl;
    }
    return 0;
}
`
	}
];

const JAVASCRIPT: Example[] = [
	{
		title: 'Saluto',
		code: `const nome = prompt("Come ti chiami?");
const anno = Number(prompt("In che anno sei nato?"));

console.log(\`Ciao \${nome}!\`);
console.log(\`Nel 2026 compi \${2026 - anno} anni.\`);
`
	},
	{
		title: 'Tabellina',
		code: `const n = Number(prompt("Di quale numero vuoi la tabellina?"));

for (let i = 1; i <= 10; i++) {
    console.log(\`\${n} x \${i} = \${n * i}\`);
}
`
	},
	{
		title: 'Liste e oggetti',
		code: `const voti = [7, 8.5, 6, 9, 7.5];

const somma = voti.reduce((totale, voto) => totale + voto, 0);
const media = somma / voti.length;

console.log("Voti:", voti);
console.log("Media:", media.toFixed(2));
console.log("Sufficienti:", voti.filter((voto) => voto >= 6).length);

const studente = { nome: "Giulia", classe: "3B", voti };
console.log(studente);
`
	},
	{
		title: 'Indovina il numero',
		code: `const segreto = Math.floor(Math.random() * 100) + 1;
let tentativi = 0;

while (true) {
    const numero = Number(prompt("Prova a indovinare (1-100):"));
    tentativi++;
    if (numero < segreto) {
        console.log("Troppo piccolo");
    } else if (numero > segreto) {
        console.log("Troppo grande");
    } else {
        console.log(\`Indovinato in \${tentativi} tentativi!\`);
        break;
    }
}
`
	},
	{
		title: 'Un errore',
		code: `function media(numeri) {
    return somma(numeri) / numeri.length;
}

console.log(media([4, 8, 6]));
`
	},
	{
		title: 'Un ciclo che non finisce',
		code: `let i = 0;
while (i < 10) {
    console.log(i);
}
`
	}
];

/**
 * Projects for trying the editor: a page with its style and its script, a site of two pages that link each other, a
 * Python program with a module and a file to read, a C++ program in more files, a mistake to find.
 */
export const PROJECTS: { title: string; open: string; files: ProjectFiles }[] = [
	{
		title: 'La mia prima pagina',
		open: 'index.html',
		files: {
			'index.html': `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>La mia prima pagina</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Ciao, mondo!</h1>
    <p>Questa è la mia <strong>prima pagina</strong> web.</p>
    <ul>
        <li>HTML dice che cosa c'è nella pagina</li>
        <li>CSS dice che aspetto ha</li>
        <li>JavaScript dice che cosa fa</li>
    </ul>
</body>
</html>
`,
			'style.css': `body {
    font-family: system-ui, sans-serif;
    margin: 2rem;
    color: #222;
}

h1 {
    color: #c2410c;
}

li {
    margin-bottom: 0.5rem;
}
`,
			'script.js': ''
		}
	},
	{
		title: 'Un contatore',
		open: 'index.html',
		files: {
			'index.html': `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Contatore</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Contatore</h1>
    <p id="numero">0</p>
    <button id="meno">-1</button>
    <button id="piu">+1</button>

    <script src="script.js"></script>
</body>
</html>
`,
			'style.css': `body {
    font-family: system-ui, sans-serif;
    text-align: center;
    margin-top: 2rem;
}

#numero {
    font-size: 4rem;
    margin: 1rem 0;
}

button {
    font-size: 1.25rem;
    padding: 0.5rem 1.25rem;
    border: 1px solid #999;
    border-radius: 0.5rem;
    background: white;
    cursor: pointer;
}
`,
			'script.js': `let conto = 0;
const numero = document.querySelector("#numero");

function mostra() {
    numero.textContent = conto;
    numero.style.color = conto < 0 ? "crimson" : "black";
    console.log("Il contatore vale", conto);
}

document.querySelector("#piu").addEventListener("click", () => {
    conto++;
    mostra();
});

document.querySelector("#meno").addEventListener("click", () => {
    conto--;
    mostra();
});
`
		}
	},
	{
		title: 'Una lista di cose da fare',
		open: 'index.html',
		files: {
			'index.html': `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Da fare</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Da fare</h1>
    <input id="testo" placeholder="Che cosa devi fare?">
    <button id="aggiungi">Aggiungi</button>
    <ul id="lista"></ul>

    <script src="script.js"></script>
</body>
</html>
`,
			'style.css': `body {
    font-family: system-ui, sans-serif;
    margin: 2rem;
}

input, button {
    font-size: 1rem;
    padding: 0.4rem 0.6rem;
}

li {
    margin-top: 0.5rem;
    cursor: pointer;
}

li.fatto {
    text-decoration: line-through;
    color: gray;
}
`,
			'script.js': `const testo = document.querySelector("#testo");
const lista = document.querySelector("#lista");

document.querySelector("#aggiungi").addEventListener("click", () => {
    if (testo.value === "") return;

    const voce = document.createElement("li");
    voce.textContent = testo.value;
    // un clic sulla voce la segna come fatta
    voce.addEventListener("click", () => voce.classList.toggle("fatto"));
    lista.append(voce);

    testo.value = "";
    testo.focus();
});
`
		}
	},
	{
		title: 'Un sito di due pagine',
		open: 'index.html',
		files: {
			'index.html': `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Il mio sito</title>
    <link rel="stylesheet" href="css/stile.css">
</head>
<body>
    <nav>
        <a href="index.html">Home</a>
        <a href="chi-sono.html">Chi sono</a>
    </nav>
    <h1>Benvenuto nel mio sito</h1>
    <p>Questa è la pagina iniziale. Il menu qui sopra porta all'altra pagina.</p>
</body>
</html>
`,
			'chi-sono.html': `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Chi sono</title>
    <link rel="stylesheet" href="css/stile.css">
</head>
<body>
    <nav>
        <a href="index.html">Home</a>
        <a href="chi-sono.html">Chi sono</a>
    </nav>
    <h1>Chi sono</h1>
    <p>Le due pagine usano lo stesso foglio di stile, che sta nella cartella <code>css</code>.</p>
</body>
</html>
`,
			'css/stile.css': `body {
    font-family: system-ui, sans-serif;
    margin: 0 2rem 2rem;
    color: #222;
}

nav {
    display: flex;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid #ccc;
}

nav a {
    color: #c2410c;
    text-decoration: none;
    font-weight: 600;
}
`
		}
	},
	{
		title: 'Python con un modulo',
		open: 'main.py',
		files: {
			'main.py': `import geometria

# i numeri stanno in un file di testo, uno per riga
with open("raggi.txt") as file:
    raggi = [float(riga) for riga in file]

for r in raggi:
    print(f"raggio {r}: area {geometria.area_cerchio(r):.2f}, circonferenza {geometria.circonferenza(r):.2f}")
`,
			'geometria.py': `import math


def area_cerchio(raggio):
    return math.pi * raggio ** 2


def circonferenza(raggio):
    return 2 * math.pi * raggio
`,
			'raggi.txt': `1
2.5
10
`
		}
	},
	{
		title: 'C++ in più file',
		open: 'main.cpp',
		files: {
			'main.cpp': `#include <iostream>
#include "frazione.h"
using namespace std;

int main() {
    Frazione a(1, 2), b(1, 3);
    Frazione somma = a.piu(b);
    cout << "1/2 + 1/3 = ";
    somma.stampa();
    cout << endl;
    return 0;
}
`,
			'frazione.h': `#pragma once

class Frazione {
public:
    Frazione(int numeratore, int denominatore);
    Frazione piu(const Frazione& altra) const;
    void stampa() const;

private:
    int n, d;
};
`,
			'frazione.cpp': `#include <iostream>
#include <numeric>
#include "frazione.h"

Frazione::Frazione(int numeratore, int denominatore) {
    int divisore = std::gcd(numeratore, denominatore);
    n = numeratore / divisore;
    d = denominatore / divisore;
}

Frazione Frazione::piu(const Frazione& altra) const {
    return Frazione(n * altra.d + altra.n * d, d * altra.d);
}

void Frazione::stampa() const {
    std::cout << n << "/" << d;
}
`
		}
	},
	{
		title: 'Un foglio di stile dimenticato',
		open: 'index.html',
		files: {
			'index.html': `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Manca qualcosa</title>
</head>
<body>
    <h1>Perché non sono blu?</h1>
    <p>Nel file style.css il titolo è blu, ma la pagina non lo sa.</p>
</body>
</html>
`,
			'style.css': `h1 {
    color: royalblue;
}
`,
			'script.js': ''
		}
	}
];

export const EXAMPLES: Record<Language, Example[]> = { python: PYTHON, c: C, cpp: CPP, javascript: JAVASCRIPT };
