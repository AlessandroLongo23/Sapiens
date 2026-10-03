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

export const EXAMPLES: Record<Language, Example[]> = { python: PYTHON, c: C, cpp: CPP };
