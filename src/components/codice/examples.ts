/** Programs for trying the editor: each leans on a different part of the runner (input, loops, random, turtle, matplotlib, errors). */
export const EXAMPLES: { title: string; code: string }[] = [
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
