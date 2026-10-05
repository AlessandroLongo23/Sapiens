# Operatori ed espressioni

Sulla calcolatrice del telefono scrivi un conto, premi l'uguale e leggi il risultato. In un programma il conto si scrive allo stesso modo, con numeri e segni, ma al posto di alcuni numeri ci sono i nomi delle variabili, e il risultato cambia con i valori che contengono. Questa lezione dice come si scrivono i conti, in che ordine il computer li esegue, e in quali punti Python e C++ danno risultati diversi.

## Che cos'è un'espressione

Un'**espressione** è un conto scritto con valori, variabili e segni di operazione, che il computer calcola fino a ottenere un solo valore. In `prezzo * 3 + 2` ci sono una variabile, due numeri e due **operatori**, cioè i segni che indicano le operazioni; i valori su cui un operatore lavora sono i suoi operandi. Un'espressione compare a destra di un [assegnamento](/materiale/scuola-superiore/informatica/linguaggi-e-primi-programmi/variabili-assegnamento-e-tipi-di-dato), dentro un'istruzione che stampa e, più avanti, nelle condizioni.

Gli operatori aritmetici sono quasi gli stessi nei due linguaggi.

| Operazione | Python | C++ | Esempio |
|---|---|---|---|
| addizione | `+` | `+` | `7 + 2` fa 9 |
| sottrazione | `-` | `-` | `7 - 2` fa 5 |
| moltiplicazione | `*` | `*` | `7 * 2` fa 14 |
| divisione | `/` | `/` con almeno un numero con la virgola | `7 / 2` oppure `7.0 / 2` fa 3.5 |
| quoziente della divisione intera | `//` | `/` tra due interi | `7 // 2` oppure `7 / 2` fa 3 |
| resto della divisione intera | `%` | `%` | `7 % 2` fa 1 |
| potenza | `**` | `pow(a, b)` | `2 ** 3` oppure `pow(2, 3)` fa 8 |

Le ultime quattro righe sono quelle in cui i due linguaggi si separano, e ognuna ha la sua sezione più sotto.

```ad-warning
Il segno della moltiplicazione non si sottintende
In matematica $2(a + b)$ e $3x$ sono prodotti. In un programma l'asterisco va scritto sempre: `2 * (a + b)`, `3 * x`. Senza, i due linguaggi si fermano con un errore.
```

## L'ordine dei calcoli

Le precedenze sono quelle della matematica: prima le potenze, poi moltiplicazioni, divisioni e resti, poi addizioni e sottrazioni; tra operazioni dello stesso livello si procede da sinistra a destra. Le parentesi cambiano l'ordine, e nei programmi sono solo tonde: dove in matematica useresti quadre e graffe, qui metti tonde dentro altre tonde.

Il programma calcola il perimetro di un rettangolo di base 5 e altezza 3 in tre modi, e solo uno è giusto.

```codice python
base = 5
altezza = 3
print(2 * base + altezza)
print(2 * (base + altezza))
print(base + altezza * 2)
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int base = 5, altezza = 3;
    cout << 2 * base + altezza << endl;
    cout << 2 * (base + altezza) << endl;
    cout << base + altezza * 2 << endl;
    return 0;
}
```

Escono 13, 16 e 11. Nella prima riga la moltiplicazione viene prima e raddoppia solo la base; nella terza raddoppia solo l'altezza. Prima di cambiare i valori di `base` e `altezza`, calcola a mente i tre risultati e poi controlla.

```ad-warning
La linea di frazione nasconde due parentesi
La media di due voti è $\dfrac{a + b}{2}$, e la linea di frazione dice da sola che la somma si fa prima. Su una riga la linea non c'è: `a + b / 2` divide per 2 solo `b`. Si scrive `(a + b) / 2`, e lo stesso vale per un denominatore fatto di più pezzi: $\dfrac{a}{b + c}$ è `a / (b + c)`.
```

## Divisione, quoziente e resto

Con 17 caramelle e 5 amici puoi fare due conti diversi. La divisione dà $3{,}4$ caramelle a testa, che ha senso solo se le caramelle si possono spezzare. La divisione intera dà due numeri: il quoziente 3, le caramelle intere per ciascuno, e il resto 2, quelle che avanzano. Il programma li calcola tutti e tre.

```codice python
caramelle = 17
amici = 5
print(caramelle / amici)
print(caramelle // amici)
print(caramelle % amici)
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int caramelle = 17, amici = 5;
    cout << (double) caramelle / amici << endl;
    cout << caramelle / amici << endl;
    cout << caramelle % amici << endl;
    return 0;
}
```

```ad-note
La divisione tra interi nei due linguaggi
Python ha due segni: `/` dà sempre il risultato con la virgola, `//` dà il quoziente intero. Il C++ ne ha uno solo, `/`, e guarda i tipi degli operandi: tra due interi dà il quoziente intero e scarta il resto, mentre se almeno uno dei due è un numero con la virgola dà il risultato con la virgola. Per questo nel programma C++ la prima divisione ha davanti `(double)`, che per quel conto trasforma `caramelle` in un numero con la virgola; con un numero scritto a mano si aggiunge `.0`, come in `17.0 / 5`.
```

Cambia 17 in 20 ed esegui nelle due linguette: la prima riga è `4.0` in Python e `4` in C++.

```ad-note
Come viene stampato un numero con la virgola
Python stampa sempre almeno una cifra dopo il punto, anche quando è zero (`4.0`), e mostra tutte le cifre che ha: `10 / 3` dà `3.3333333333333335`. Il `cout` del C++ stampa al massimo sei cifre in tutto e toglie gli zeri finali: `10.0 / 3` dà `3.33333`, e `20.0 / 5` dà `4`. Quell'ultimo 5 di Python non è un errore di conto: è l'approssimazione dei [numeri in virgola mobile](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/numeri-reali-in-virgola-mobile), che il C++ ha uguale e non fa vedere.
```

Il quoziente e il resto servono più di quanto sembra, ogni volta che un numero intero va spezzato in parti.

| Che cosa vuoi sapere | Espressione in Python | In C++ |
|---|---|---|
| se `n` è pari | il resto `n % 2` è 0 | uguale |
| l'ultima cifra di `n` | `n % 10` | uguale |
| `n` senza l'ultima cifra | `n // 10` | `n / 10` |
| quante ore intere in `minuti` | `minuti // 60` | `minuti / 60` |

Un film dura 135 minuti: quante ore e quanti minuti sono? Il quoziente della divisione per 60 dà le ore, il resto i minuti che avanzano.

```diagramma
% nome: diagramma-flusso-ore-e-minuti
% alt: Diagramma di flusso in sequenza: dopo l'inizio si legge minuti, un rettangolo assegna a ore il quoziente intero di minuti diviso 60, un secondo rettangolo assegna a resto il resto di minuti diviso 60, poi si scrivono ore, il testo ore e, resto e il testo minuti, e si arriva alla fine
% ingresso: 135
leggi minuti
ore = minuti // 60
resto = minuti % 60
scrivi ore, "ore e", resto, "minuti"
```

Nel disegno il quoziente intero è scritto "div" e il resto "mod", come nei libri. Esegui il diagramma con "Passo" e guarda la tabella delle variabili: dopo i due rettangoli `ore` vale 2 e `resto` vale 15, e $2 \cdot 60 + 15$ ridà 135. Il programma è lo stesso, con la domanda in più.

```codice python
minuti = int(input("Durata in minuti: "))
ore = minuti // 60
resto = minuti % 60
print(ore, "ore e", resto, "minuti")
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int minuti;
    cout << "Durata in minuti: ";
    cin >> minuti;
    int ore = minuti / 60;
    int resto = minuti % 60;
    cout << ore << " ore e " << resto << " minuti" << endl;
    return 0;
}
```

Provalo con 135, con 60 e con 45: il resto è sempre minore di 60, e con 45 le ore sono 0. In C++ la divisione tra interi non avvisa: se al posto di `minuti / 60` ti serviva il risultato con la virgola, il programma va avanti lo stesso, con un numero sbagliato.

## Il resto dei numeri negativi

Finché dividendo e divisore sono positivi, quoziente e resto sono gli stessi nei due linguaggi. Con un numero negativo no.

```codice python
print(-7 // 2)
print(-7 % 2)
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    cout << -7 / 2 << endl;
    cout << -7 % 2 << endl;
    return 0;
}
```

```ad-note
Quoziente e resto con un numero negativo
Il risultato esatto di $-7 : 2$ è $-3{,}5$. Python lo arrotonda all'intero più piccolo, $-4$, e il resto è $1$; il C++ toglie le cifre dopo la virgola, ottiene $-3$, e il resto è $-1$. Tutti e due rispettano la regola della divisione, quoziente per divisore più resto uguale dividendo: $-4 \cdot 2 + 1 = -7$ e $-3 \cdot 2 + (-1) = -7$. In Python il resto ha il segno del divisore, in C++ quello del dividendo. I diagrammi di queste pagine fanno come Python.
```

La conseguenza pratica riguarda i numeri dispari: in C++ il resto di un dispari negativo diviso 2 è $-1$, non $1$. Per riconoscere un dispari in modo che valga nei due linguaggi, chiedi che il resto sia diverso da 0. Gli esercizi di questa pagina usano solo numeri positivi.

## Le potenze

Python ha un operatore per le potenze, `**`. Il C++ non ne ha: usa `pow(base, esponente)`, che sta nella libreria `cmath`. Il programma calcola $2^{10}$, $3^2$ e $2^{30}$ (le potenze sono quelle della lezione [Potenze in $\mathbb{N}$](/materiale/scuola-superiore/matematica/numeri-naturali/potenze-in-n)).

```codice python
print(2 ** 10)
print(3 ** 2)
print(2 ** 30)
```

```codice cpp
#include <iostream>
#include <cmath>
using namespace std;

int main() {
    cout << pow(2, 10) << endl;
    cout << pow(3, 2) << endl;
    cout << pow(2, 30) << endl;
    return 0;
}
```

Le prime due righe sono uguali, 1024 e 9. La terza è `1073741824` in Python e `1.07374e+09` in C++.

```ad-note
Le potenze nei due linguaggi
In Python `**` tra due interi dà un intero, grande quanto serve: prova `2 ** 100`. In C++ `pow` dà sempre un numero con la virgola, e `cout` scrive quelli grandi in notazione scientifica: `1.07374e+09` vuol dire $1{,}07374 \cdot 10^9$, con sei cifre soltanto. Per avere tutte le cifre metti il risultato in una variabile intera, `int p = pow(2, 30);`, e stampa `p`. Per un quadrato in C++ si scrive più spesso `a * a`. Una variabile `int` del C++, poi, ha un valore massimo, $2^{31} - 1 = 2\,147\,483\,647$ (il perché è nella lezione sui [numeri interi con segno](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/numeri-interi-con-segno-e-complemento-a-due)): un conto che lo supera dà un risultato sbagliato.
```

```ad-warning
L'accento circonflesso non è la potenza
Sulla calcolatrice $5^2$ si scrive spesso `5^2`. In Python e in C++ il segno `^` esiste, ma fa un'altra operazione, sui bit: `5 ^ 2` dà 7, non 25, e nessuno dei due linguaggi lo considera un errore.
```

## Le forme brevi dell'assegnamento

Aggiornare una variabile a partire dal suo valore è così frequente che ha una scrittura corta, uguale nei due linguaggi: l'operatore seguito dall'uguale. `punti += 5` vuol dire `punti = punti + 5`, e allo stesso modo `punti -= 1` toglie 1 e `punti *= 2` raddoppia.

In C++ esistono anche `i++` e `i--`, che aumentano e diminuiscono `i` di 1 e che ritroverai nel [ciclo for](/materiale/scuola-superiore/informatica/l-iterazione/il-ciclo-for). In Python non ci sono: si scrive `i += 1`.

Oltre agli operatori aritmetici ci sono quelli di confronto, come `<` e `==`, e quelli logici, che danno come risultato vero o falso: sono nelle lezioni [Condizioni e operatori di confronto](/materiale/scuola-superiore/informatica/la-selezione/condizioni-e-operatori-di-confronto) e [Gli operatori logici](/materiale/scuola-superiore/informatica/la-selezione/gli-operatori-logici).

## Prova tu

Il primo programma legge la base e l'altezza di un rettangolo, due numeri interi. Fagli stampare il perimetro e, nella riga sotto, l'area.

```codice python
base = int(input())
altezza = int(input())
# scrivi qui le due istruzioni che stampano
%% soluzione
base = int(input())
altezza = int(input())
print(2 * (base + altezza))
print(base * altezza)
%% prova
5
3
%% stampa
16
15
%% prova
10
1
%% stampa
22
10
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int base, altezza;
    cin >> base;
    cin >> altezza;
    // scrivi qui le due istruzioni che stampano

    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int base, altezza;
    cin >> base;
    cin >> altezza;
    cout << 2 * (base + altezza) << endl;
    cout << base * altezza << endl;
    return 0;
}
```

Il secondo programma legge una durata in secondi, un numero intero positivo, e deve stampare su tre righe le ore, i minuti e i secondi: 3725 secondi sono 1 ora, 2 minuti e 5 secondi. Un'ora ha 3600 secondi; tolte le ore intere, quello che avanza si divide per 60.

```codice python
secondi = int(input())
# calcola ore, minuti e resto

print(ore)
print(minuti)
print(resto)
%% soluzione
secondi = int(input())
ore = secondi // 3600
minuti = secondi % 3600 // 60
resto = secondi % 60

print(ore)
print(minuti)
print(resto)
%% prova
3725
%% stampa
1
2
5
%% prova
59
%% stampa
0
0
59
%% prova
86399
%% stampa
23
59
59
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int secondi, ore, minuti, resto;
    cin >> secondi;
    // calcola ore, minuti e resto

    cout << ore << endl;
    cout << minuti << endl;
    cout << resto << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int secondi, ore, minuti, resto;
    cin >> secondi;
    ore = secondi / 3600;
    minuti = secondi % 3600 / 60;
    resto = secondi % 60;

    cout << ore << endl;
    cout << minuti << endl;
    cout << resto << endl;
    return 0;
}
```

Nel terzo esercizio costruisci un diagramma. Deve leggere un numero intero `n` di due cifre e scrivere la somma delle sue cifre: con 47 scrive 11. Ti servono un "leggi", due blocchi "assegna" (uno per la cifra delle decine, uno per quella delle unità: guarda la tabella degli usi di quoziente e resto) e uno "scrivi"; nei blocchi il quoziente e il resto si scrivono `//` e `%`. Quando hai finito premi "Prova il diagramma" ed eseguilo con 47 e con 90.

```diagramma
% nome: diagramma-flusso-da-costruire-somma-cifre
% alt: Un diagramma di flusso da costruire, con i soli blocchi di inizio e di fine: deve leggere un numero di due cifre e scrivere la somma delle sue cifre
% modifica: sì
% ingresso: 47
```
