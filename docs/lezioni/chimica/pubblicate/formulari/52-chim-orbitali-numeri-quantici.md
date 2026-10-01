# Formulario: Orbitali e numeri quantici

## Orbitale e nodi

- Orbitale: la mappa della probabilità di trovare l'elettrone attorno al nucleo. Nei disegni, la superficie che racchiude il 90% della probabilità.
- Nodo: una superficie su cui la funzione d'onda vale zero e l'elettrone non si trova mai.
- Nodo radiale: una sfera attorno al nucleo. Divide la nuvola in gusci.
- Nodo angolare: un piano o un cono che passa per il nucleo. Divide la nuvola in lobi.

Nodi di un orbitale del livello $n$ con numero secondario $l$:

$$\text{nodi in tutto} = n - 1 \qquad \text{angolari} = l \qquad \text{radiali} = n - l - 1$$

Un orbitale $4p$ ha $3$ nodi: $1$ angolare e $2$ radiali.

## I numeri quantici

| Numero | Nome | Valori | Che cosa dice |
|---|---|---|---|
| $n$ | principale | $1, 2, 3, \dots$ | livello di energia e dimensione |
| $l$ | secondario | da $0$ a $n - 1$ | forma (numero di nodi angolari) |
| $m_l$ | magnetico | da $-l$ a $+l$ | orientazione nello spazio |
| $m_s$ | di spin | $+\frac{1}{2}$, $-\frac{1}{2}$ | spin dell'elettrone |

Lettere di $l$: $0 \to s$, $1 \to p$, $2 \to d$, $3 \to f$. Il nome di un orbitale è $n$ seguito dalla lettera: $n = 3$, $l = 2$ è $3d$.

## Quanti orbitali e quanti elettroni

- Orbitali in un sottolivello: $2l + 1$.
- Orbitali in un livello: $n^2$.
- Elettroni in un orbitale: al massimo $2$, con spin opposto (principio di esclusione di Pauli).
- Elettroni in un sottolivello: al massimo $2(2l + 1)$.
- Elettroni in un livello: al massimo $2n^2$.

| Sottolivello | $l$ | Orbitali | Elettroni al massimo |
|---|---|---|---|
| $s$ | $0$ | $1$ | $2$ |
| $p$ | $1$ | $3$ | $6$ |
| $d$ | $2$ | $5$ | $10$ |
| $f$ | $3$ | $7$ | $14$ |

## Controllare una terna

1. $n$ è un intero da $1$ in su.
2. $l$ è un intero tra $0$ e $n - 1$.
3. $m_l$ è un intero tra $-l$ e $+l$.

La terna $n = 2$, $l = 2$, $m_l = 0$ non esiste: con $n = 2$, $l$ arriva al massimo a $1$.

## Stati dell'idrogeno

- Stato fondamentale: l'elettrone nell'orbitale $1s$, quello con meno energia.
- Stato eccitato: l'elettrone in un orbitale di un livello più alto, dopo aver assorbito energia. Tornando giù emette luce.

```ad-warning
Orbita e orbitale
Un'orbita è una strada; un orbitale dice solo dove è probabile trovare l'elettrone.
```

```ad-warning
Dove si ferma $l$
$l$ arriva a $n - 1$, non a $n$: nel secondo livello non ci sono orbitali $d$.
```

```ad-warning
Lo zero di $m_l$
I valori di $m_l$ comprendono lo zero: un sottolivello $p$ ha $3$ orbitali, non $2$.
```
