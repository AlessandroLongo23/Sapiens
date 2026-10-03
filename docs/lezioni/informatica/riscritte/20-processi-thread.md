# Processi, thread e multitasking

Sul telefono la musica suona, una chat riceve i messaggi, un aggiornamento si scarica e tu intanto scorri le foto. Sembra che il telefono faccia quattro cose insieme, eppure ogni core della [CPU](/materiale/scuola-superiore/informatica/l-architettura-del-computer/la-cpu-e-il-ciclo-di-esecuzione-delle-istruzioni) esegue un'istruzione dopo l'altra, di un solo programma per volta. Il trucco è del sistema operativo, che fa lavorare i programmi a turni brevissimi.

## Programma e processo

Un **programma** è un elenco di istruzioni conservato in un file, nella memoria di massa: finché nessuno lo avvia non fa niente. Un **processo** è un programma in esecuzione: le sue istruzioni caricate nella RAM, i dati su cui sta lavorando e il punto a cui è arrivato.

La differenza è quella tra una ricetta e il cucinare. La ricetta sta scritta sul libro e resta uguale; il cucinare avviene in un certo momento, con ingredienti veri, ed è arrivato a un certo passo. Dalla stessa ricetta due persone possono cucinare nello stesso momento: allo stesso modo, se apri due volte lo stesso programma, il sistema operativo crea due processi distinti, ciascuno con i suoi dati.

```ad-warning
Programma e processo non sono sinonimi
Un programma installato e mai aperto non è un processo. Un programma aperto tre volte dà tre processi. E molti processi li avvia il sistema operativo senza che tu apra niente: quelli che controllano la rete, gli aggiornamenti, la tastiera.
```

## Il multitasking

Il **multitasking** è la capacità del sistema operativo di tenere in esecuzione più processi nello stesso periodo. Un core della CPU ne esegue uno solo per volta, quindi il sistema li alterna: assegna la CPU a un processo per un tempo molto breve, detto **quanto di tempo**, poi la passa a un altro, e così via. Questa tecnica si chiama condivisione del tempo (in inglese time sharing).

Un quanto dura pochi millesimi di secondo. In un secondo ogni processo riceve la CPU molte volte, e tu non ti accorgi delle pause: la musica non salta, il puntatore si muove senza scatti. Se la CPU ha più core, i processi in esecuzione nello stesso istante sono davvero più di uno, uno per core; ma i processi sono quasi sempre più dei core, e i turni servono lo stesso.

## Gli stati di un processo

In ogni momento un processo si trova in uno di tre stati:

- **in esecuzione**: sta usando la CPU;
- **pronto**: potrebbe proseguire subito, ma la CPU è occupata e lui aspetta il suo turno nella coda dei processi pronti;
- **in attesa**: non può proseguire finché non succede qualcosa, per esempio finché il disco non ha letto un file, non arrivano dati dalla rete o l'utente non preme un tasto.

```tikz
% nome: stati-di-un-processo
% alt: Diagramma degli stati di un processo: un processo appena creato entra nello stato di pronto; da pronto passa a in esecuzione quando riceve la CPU; da in esecuzione torna a pronto quando scade il quanto di tempo, passa a in attesa quando chiede un'operazione di ingresso o uscita, oppure termina; da in attesa torna a pronto quando l'operazione è completata
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

I passaggi possibili sono quelli delle frecce, e solo quelli:

- un processo appena creato entra nello stato di pronto;
- da pronto a in esecuzione, quando il sistema operativo gli assegna la CPU;
- da in esecuzione a pronto, quando il suo quanto di tempo scade: torna in coda;
- da in esecuzione a in attesa, quando chiede un'operazione di ingresso o uscita e deve aspettarne l'esito;
- da in attesa a pronto, quando l'operazione è completata;
- da in esecuzione alla fine, quando esegue la sua ultima istruzione: il processo termina e il sistema si riprende la sua memoria.

```ad-warning
Da in attesa non si passa a in esecuzione
Quando il dato che aspettava arriva, il processo non riprende subito la CPU: torna pronto e si rimette in coda. E pronto non vuol dire in attesa: al processo pronto manca solo la CPU, a quello in attesa manca un dato, e dargli la CPU non servirebbe a niente.
```

```ad-example
Esempio 1: gli stati di un lettore di musica
Avvii il lettore di musica. Il sistema crea il processo, poi gli assegna la CPU; il processo chiede di leggere il file del brano dal disco; il disco consegna i dati; il sistema gli assegna di nuovo la CPU; il quanto di tempo scade. In quale stato si trova alla fine?

Si segue un evento alla volta: creato, quindi pronto; riceve la CPU, in esecuzione; chiede la lettura, in attesa; i dati arrivano, pronto; riceve la CPU, in esecuzione; il quanto scade, pronto. Alla fine il processo è pronto.
```

## Lo scheduler e il round robin

Lo **scheduler** è la parte del nucleo che decide a quale dei processi pronti assegnare la CPU. Una regola semplice e molto usata è il **round robin**, cioè "a giro":

1. I processi pronti stanno in una coda, nell'ordine in cui sono arrivati.
2. Lo scheduler assegna la CPU al primo della coda per un quanto di tempo.
3. Se il processo finisce prima che il quanto scada, lascia subito la CPU ed esce dalla coda.
4. Se allo scadere del quanto non ha finito, viene interrotto e torna in fondo alla coda.
5. Si riparte dal punto 2, finché la coda è vuota. Quando in coda resta un solo processo, quello riceve un quanto dopo l'altro.

A ogni turno il sistema salva il punto a cui è arrivato il processo che esce e ripristina quello del processo che entra: è il **cambio di contesto**. Richiede un po' di tempo, che negli esempi qui sotto è trascurato.

Di ogni processo interessano due numeri: l'istante in cui finisce e il tempo in coda, cioè il tempo totale che ha passato da pronto ad aspettare il turno. Se tutti i processi sono in coda dall'istante $0$ e nessuno va in attesa, vale

$$\text{tempo in coda} = \text{istante di fine} - \text{tempo di CPU richiesto}$$

```ad-example
Esempio 2: tempi multipli del quanto
Tre processi sono in coda nell'ordine $P_1$, $P_2$, $P_3$ e chiedono $8\,\text{ms}$, $4\,\text{ms}$ e $12\,\text{ms}$ di CPU. Il quanto è di $4\,\text{ms}$. In che ordine vengono eseguiti, e quando finisce ciascuno?

Primo giro: $P_1$ lavora da $0$ a $4$ e gli restano $4\,\text{ms}$; $P_2$ lavora da $4$ a $8$ e finisce; $P_3$ lavora da $8$ a $12$ e gli restano $8\,\text{ms}$. Secondo giro: $P_1$ lavora da $12$ a $16$ e finisce. Resta solo $P_3$, che lavora da $16$ a $20$ e da $20$ a $24$, e finisce.

I turni sono $P_1$, $P_2$, $P_3$, $P_1$, $P_3$, $P_3$. Gli istanti di fine sono $8\,\text{ms}$ per $P_2$, $16\,\text{ms}$ per $P_1$ e $24\,\text{ms}$ per $P_3$. Il tempo in coda di $P_1$ è $16 - 8 = 8\,\text{ms}$, quello di $P_2$ è $8 - 4 = 4\,\text{ms}$, quello di $P_3$ è $24 - 12 = 12\,\text{ms}$.
```

```tikz
% nome: round-robin-turni
% alt: Linea del tempo del round robin dell'esempio 2, con quanto di 4 millisecondi: P1 da 0 a 4, P2 da 4 a 8, P3 da 8 a 12, P1 da 12 a 16, P3 da 16 a 20 e ancora P3 da 20 a 24
\begin{tikzpicture}[x=0.26cm]
\foreach \a/\b/\n/\c in {0/4/1/blue!15, 4/8/2/orange!30, 8/12/3/green!20, 12/16/1/blue!15, 16/20/3/green!20, 20/24/3/green!20} {
  \draw[thick, fill=\c] (\a,0) rectangle (\b,0.8);
  \node[font=\small] at ({(\a+\b)/2},0.4) {$P_\n$};
}
\foreach \t in {0,4,8,12,16,20,24} \node[font=\small] at (\t,-0.3) {\t};
\node[font=\small] at (26,-0.3) {ms};
\end{tikzpicture}
```

```ad-example
Esempio 3: un processo finisce prima del quanto
Tre processi sono in coda nell'ordine $P_1$, $P_2$, $P_3$ e chiedono $7\,\text{ms}$, $2\,\text{ms}$ e $5\,\text{ms}$ di CPU. Il quanto è di $3\,\text{ms}$. Quando finisce ciascuno, e quanto tempo passa in coda?

$P_1$ lavora da $0$ a $3$ e gli restano $4\,\text{ms}$. $P_2$ ha bisogno di soli $2\,\text{ms}$: lavora da $3$ a $5$, finisce e lascia la CPU senza aspettare la fine del quanto. $P_3$ lavora da $5$ a $8$ e gli restano $2\,\text{ms}$. $P_1$ lavora da $8$ a $11$ e gli resta $1\,\text{ms}$. $P_3$ lavora da $11$ a $13$ e finisce. $P_1$ lavora da $13$ a $14$ e finisce.

Gli istanti di fine sono $5\,\text{ms}$ per $P_2$, $13\,\text{ms}$ per $P_3$ e $14\,\text{ms}$ per $P_1$. I tempi in coda sono $14 - 7 = 7\,\text{ms}$ per $P_1$, $5 - 2 = 3\,\text{ms}$ per $P_2$ e $13 - 5 = 8\,\text{ms}$ per $P_3$.
```

```ad-warning
Il turno non dura sempre un quanto intero
L'errore più frequente è contare $3\,\text{ms}$ per ogni turno, anche per quello di $P_2$, che ne usa $2$. Un processo che finisce lascia subito la CPU: l'orologio avanza del tempo usato davvero. E un processo che ha finito non rientra in coda.
```

```ad-example
Esempio 4: lo stesso caso con un quanto troppo lungo
Gli stessi processi dell'esempio 3, $7\,\text{ms}$, $2\,\text{ms}$ e $5\,\text{ms}$, con un quanto di $10\,\text{ms}$. Che cosa cambia?

Nessun processo usa un quanto intero: $P_1$ lavora da $0$ a $7$ e finisce, $P_2$ da $7$ a $9$, $P_3$ da $9$ a $14$. Il round robin è diventato una fila ordinaria, in cui ciascuno aspetta che chi sta davanti abbia finito del tutto. $P_2$, a cui servono $2\,\text{ms}$, comincia a lavorare dopo $7\,\text{ms}$; con il quanto di $3\,\text{ms}$ cominciava dopo $3$.

Per questo il quanto è breve: nessun processo resta fermo a lungo. Non può essere brevissimo, però, perché a ogni turno c'è un cambio di contesto, e con turni troppo corti la CPU passerebbe più tempo a cambiare processo che a lavorare.
```

## I thread

Un **thread** è una sequenza di istruzioni che avanza per conto suo all'interno di un processo. Un processo ha almeno un thread e può averne molti: in un browser un thread disegna la pagina mentre un altro scarica le immagini, in un gioco uno calcola i movimenti e un altro produce i suoni.

I thread di uno stesso processo condividono la sua memoria, mentre due processi diversi hanno ciascuno la propria e il sistema operativo li tiene separati. Per lo scheduler i thread sono unità da eseguire a turno, come i processi: con più core, due thread dello stesso programma possono lavorare nello stesso istante, e il programma va più veloce.
