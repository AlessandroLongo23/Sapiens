# Formulario: Memoria centrale e memorie di massa

## Celle e indirizzi

- La memoria centrale è una fila di celle (qui da $1$ byte), ognuna con il suo indirizzo, a partire da $0$.
- Con $N$ celle gli indirizzi vanno da $0$ a $N - 1$; se gli indirizzi vanno da $0$ a $M$ le celle sono $M + 1$.
- Capacità in byte: numero di celle per i byte di una cella.

$$1\,\text{KiB} = 1024\,\text{B} \qquad 1\,\text{MiB} = 1024\,\text{KiB} \qquad 1\,\text{GiB} = 1024\,\text{MiB}$$

$$1\,\text{kB} = 1000\,\text{B} \qquad 1\,\text{MB} = 1000\,\text{kB} \qquad 1\,\text{GB} = 1000\,\text{MB}$$

- Esempio: $4096$ celle da $1$ byte hanno ultimo indirizzo $4095$ e capacità $4096 : 1024 = 4\,\text{KiB}$.
- Quanti file ci stanno: capacità e file nella stessa unità, poi si divide. $32\,\text{GB} = 32\,000\,\text{MB}$, e $32\,000 : 250 = 128$ video da $250\,\text{MB}$.

## RAM e ROM

| | RAM | ROM |
|---|---|---|
| Senza corrente | perde il contenuto (volatile) | lo conserva (non volatile) |
| Nell'uso normale | si legge e si scrive | si legge soltanto |
| Che cosa contiene | programmi aperti e i loro dati | il programma di avvio |

## Le memorie di massa

Non volatili, molto capienti, più lente della RAM: conservano file, programmi installati, sistema operativo.

| | Disco magnetico | Memoria a stato solido (SSD, chiavette, telefoni) |
|---|---|---|
| Come registra i bit | magnetizzando dischi che ruotano | con cariche elettriche, senza parti in movimento |
| Velocità | più lento | molto più veloce |
| Costo per byte | più basso | più alto |
| Urti e rumore | teme gli urti, fa rumore | resistente, silenziosa |

## Cache e gerarchia

- Cache: memoria piccola e molto veloce accanto alla CPU, con una copia dei dati e delle istruzioni usati più di recente.
- Gerarchia delle memorie, dalla più veloce alla più lenta: registri, cache, RAM, SSD, disco magnetico.

```tikz
% nome: gerarchia-delle-memorie
% alt: La gerarchia delle memorie disegnata come cinque fasce orizzontali sovrapposte, sempre più larghe dall'alto in basso: registri, cache, RAM, SSD, disco magnetico; a sinistra una freccia verso l'alto con la scritta più veloce e più costosa per byte, a destra una freccia verso il basso con la scritta più capiente
\begin{tikzpicture}
\tikzset{f/.style={draw, thick, font=\small, minimum height=0.62cm}}
\node[f, fill=orange!35, minimum width=1.5cm] at (0,2.6) {registri};
\node[f, fill=orange!22, minimum width=2.3cm] at (0,1.95) {cache};
\node[f, fill=blue!12, minimum width=3.1cm] at (0,1.3) {RAM};
\node[f, fill=green!15, minimum width=3.9cm] at (0,0.65) {SSD};
\node[f, fill=green!15, minimum width=4.7cm] at (0,0) {disco magnetico};
\draw[-{Stealth}, thick] (-2.75,-0.3) -- (-2.75,2.9);
\draw[-{Stealth}, thick] (2.75,2.9) -- (2.75,-0.3);
\node[font=\footnotesize, align=center] at (-2.3,-0.9) {più veloce, più\\costosa per byte};
\node[font=\footnotesize] at (2.5,-0.7) {più capiente};
\end{tikzpicture}
```

- Scendendo: la velocità diminuisce, la capacità aumenta, il costo di ogni byte diminuisce.
- Volatili: registri, cache, RAM. Non volatili: ROM, SSD, disco magnetico.

```ad-warning
L'ultimo indirizzo è uno in meno del numero di celle
Con $4096$ celle l'ultima ha indirizzo $4095$: il conto parte da $0$.
```

```ad-warning
La "memoria" del telefono non è la RAM
I $128\,\text{GB}$ di un telefono sono memoria di massa: lì restano foto e app. La RAM è un'altra, molto più piccola.
```

```ad-warning
Quello che non è salvato è solo nella RAM
Senza corrente la RAM si svuota: resta solo ciò che è stato copiato su una memoria di massa.
```
