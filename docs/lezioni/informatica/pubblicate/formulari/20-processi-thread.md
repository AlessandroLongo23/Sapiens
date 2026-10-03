# Formulario: Processi, thread e multitasking

## Programma, processo, thread

- Programma: un elenco di istruzioni in un file, nella memoria di massa.
- Processo: un programma in esecuzione, con le istruzioni nella RAM, i suoi dati e il punto a cui è arrivato. Un programma aperto due volte dà due processi.
- Thread: una sequenza di istruzioni che avanza per conto suo dentro un processo. I thread di un processo condividono la sua memoria; due processi no.

## Multitasking

- Multitasking: più processi in esecuzione nello stesso periodo.
- Condivisione del tempo: la CPU passa da un processo all'altro a turni brevi.
- Quanto di tempo: la durata massima di un turno, pochi millesimi di secondo.

## Gli stati di un processo

```tikz
% nome: stati-di-un-processo
% alt: Diagramma degli stati di un processo: un processo appena creato entra nello stato di pronto; da pronto passa a in esecuzione quando riceve la CPU; da in esecuzione torna a pronto quando scade il quanto di tempo, passa a in attesa quando chiede un'operazione di ingresso o uscita, oppure termina; da in attesa torna a pronto quando l'operazione è completata
% svg: stati-di-un-processo-d5c39cdf.svg 302x183
\begin{tikzpicture}
\tikzset{stato/.style={draw, thick, rounded corners=6pt, minimum width=2.1cm, minimum height=0.75cm, font=\small}}
\node[stato, fill=blue!10] (p) at (0,0) {pronto};
\node[stato, fill=green!15] (e) at (4.6,0) {in esecuzione};
\node[stato, fill=orange!25] (a) at (2.3,-2.7) {in attesa};
\draw[-{Stealth}, thick] (0,1.25) -- (p.north);
\node[font=\small] at (0,1.45) {creazione};
\draw[-{Stealth}, thick] (e.north) -- (4.6,1.25);
\node[font=\small] at (4.6,1.45) {fine};
\draw[-{Stealth}, thick] (1.05,0.18) -- (3.55,0.18);
\node[font=\small] at (2.3,0.45) {riceve la CPU};
\draw[-{Stealth}, thick] (3.55,-0.18) -- (1.05,-0.18);
\node[font=\small] at (2.3,-0.45) {quanto scaduto};
\draw[-{Stealth}, thick] (4.6,-0.375) -- (3.1,-2.325);
\node[font=\small, align=left, right] at (4.05,-1.5) {richiesta di\\ingresso o uscita};
\draw[-{Stealth}, thick] (1.5,-2.325) -- (0,-0.375);
\node[font=\small, align=right, left] at (0.55,-1.5) {operazione\\completata};
\end{tikzpicture}
```

| Da | A | Quando |
|---|---|---|
| creazione | pronto | il processo viene creato |
| pronto | in esecuzione | riceve la CPU |
| in esecuzione | pronto | il quanto scade |
| in esecuzione | in attesa | chiede un'operazione di ingresso o uscita |
| in attesa | pronto | l'operazione è completata |
| in esecuzione | fine | esegue l'ultima istruzione |

## Il round robin

- Scheduler: la parte del nucleo che sceglie a quale processo pronto dare la CPU.
- Cambio di contesto: salvare lo stato del processo che esce e ripristinare quello del processo che entra.

1. I processi pronti stanno in coda, in ordine di arrivo.
2. Il primo riceve la CPU per un quanto.
3. Se finisce prima, lascia subito la CPU ed esce dalla coda.
4. Se non ha finito, torna in fondo alla coda.
5. Si ripete finché la coda è vuota.

Con tutti i processi in coda dall'istante $0$:

$$\text{tempo in coda} = \text{istante di fine} - \text{tempo di CPU richiesto}$$

Esempio: quanto di $3\,\text{ms}$, processi da $7$, $2$ e $5\,\text{ms}$. Turni: $P_1$ ($0$-$3$), $P_2$ ($3$-$5$), $P_3$ ($5$-$8$), $P_1$ ($8$-$11$), $P_3$ ($11$-$13$), $P_1$ ($13$-$14$). Fine: $14$, $5$, $13\,\text{ms}$. In coda: $7$, $3$, $8\,\text{ms}$.

```ad-warning
Da in attesa si torna a pronto
Quando il dato arriva, il processo si rimette in coda: non riprende subito la CPU.
```

```ad-warning
Un turno può durare meno di un quanto
Chi finisce lascia subito la CPU, e chi ha finito non rientra in coda.
```
