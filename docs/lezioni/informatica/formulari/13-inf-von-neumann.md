# Formulario: La macchina di von Neumann

## Il programma memorizzato

- Programma: una sequenza di istruzioni, cioè di ordini elementari che la macchina sa eseguire.
- Programma memorizzato: istruzioni e dati stanno nella stessa memoria, scritti come sequenze di bit.
- Per cambiare lavoro non si toccano i circuiti: si carica in memoria un altro programma.
- Un programma è un dato come gli altri: si copia, si scarica, si aggiorna.

## I quattro blocchi

| Blocco | Che cosa fa | Nel telefono |
|---|---|---|
| CPU (unità centrale di elaborazione) | esegue le istruzioni: calcola, confronta, decide quale viene dopo | il processore |
| memoria centrale | conserva il programma in esecuzione e i suoi dati | la RAM |
| periferiche | scambiano dati con l'esterno, in ingresso e in uscita | schermo, microfono, altoparlante |
| bus | trasporta i bit da un blocco all'altro | i collegamenti sulla scheda |

```tikz
% nome: macchina-von-neumann-blocchi
% alt: Schema a blocchi della macchina di von Neumann: in alto tre riquadri affiancati, CPU, memoria centrale e periferiche; in basso una barra orizzontale, il bus, collegata a ciascun riquadro da una freccia a due punte; a destra delle periferiche due frecce indicano i dati che entrano dall'esterno e i risultati che escono
\begin{tikzpicture}
\tikzset{blocco/.style={draw, thick, rounded corners=3pt, minimum width=2.1cm, minimum height=1.1cm, align=center, font=\small}}
\node[blocco, fill=blue!12] (cpu) at (0,0) {CPU};
\node[blocco, fill=blue!12] (mem) at (2.5,0) {memoria\\centrale};
\node[blocco, fill=green!15] (per) at (5,0) {periferiche};
\draw[thick, fill=orange!25, rounded corners=2pt] (-1.05,-2.0) rectangle (6.05,-1.45);
\node[font=\small] at (2.5,-1.725) {bus};
\draw[{Stealth}-{Stealth}, thick] (cpu.south) -- (0,-1.45);
\draw[{Stealth}-{Stealth}, thick] (mem.south) -- (2.5,-1.45);
\draw[{Stealth}-{Stealth}, thick] (per.south) -- (5,-1.45);
\draw[-{Stealth}, thick] (4.6,1.45) -- (4.6,0.55);
\draw[-{Stealth}, thick] (5.4,0.55) -- (5.4,1.45);
\node[font=\footnotesize, anchor=east] at (4.5,1.1) {ingresso};
\node[font=\footnotesize, anchor=west] at (5.5,1.1) {uscita};
\end{tikzpicture}
```

- Periferiche di ingresso: portano dentro i dati (tastiera, microfono, schermo quando lo tocchi).
- Periferiche di uscita: portano fuori i risultati (schermo quando mostra, altoparlanti, stampante).
- Memorie di massa (disco, chiavetta USB, memoria interna del telefono): nello schema stanno tra le periferiche.

## Il viaggio di un dato

1. Una periferica di ingresso riceve il dato.
2. Il dato viaggia sul bus e viene scritto nella memoria centrale.
3. La CPU preleva dalla memoria centrale l'istruzione e i dati.
4. La CPU esegue l'istruzione.
5. Il risultato viene scritto nella memoria centrale.
6. Il risultato passa a una periferica di uscita.

I passi 3, 4 e 5 si ripetono per ogni istruzione del programma.

```ad-warning
Le istruzioni non stanno nella CPU
Istruzioni e dati stanno nella memoria centrale: la CPU va a prendere le istruzioni lì, una alla volta.
```

```ad-warning
Il disco non è la memoria centrale
"Memoria", nello schema, è solo la memoria centrale. Il disco è una memoria di massa e sta tra le periferiche.
```

```ad-warning
Il bus non elabora e non conserva
Chi calcola è la CPU, chi conserva è la memoria centrale: il bus trasporta.
```
