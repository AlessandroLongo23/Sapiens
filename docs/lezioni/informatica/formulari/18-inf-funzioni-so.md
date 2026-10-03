# Formulario: Funzioni del sistema operativo

## Che cos'è

- Sistema operativo: il software di base che gestisce le risorse del computer e le mette a disposizione dei programmi e dell'utente.
- Risorse: tempo della CPU, spazio nella RAM, spazio nelle memorie di massa, periferiche.
- Due lavori: arbitro (chi usa che cosa, e per quanto) e intermediario (nasconde ai programmi i dettagli dell'hardware).
- Esempi: Windows, macOS, Linux sui computer; Android, iOS su telefoni e tablet.

## Le cinque funzioni

| Funzione | Che cosa gestisce | Esempio |
|---|---|---|
| gestione dei processi | il tempo della CPU | la musica continua mentre scrivi |
| gestione della memoria | lo spazio nella RAM | ogni programma ha la sua parte di memoria |
| gestione dei file | i dati nelle memorie di massa | la foto diventa un file in una cartella |
| gestione delle periferiche | tastiera, schermo, stampante, rete | la stampante nuova funziona con tutti i programmi |
| interfaccia utente | il dialogo con la persona | icone, finestre, comandi scritti |

- Driver: il programma, scritto per un modello preciso di periferica, che traduce le richieste nei comandi di quel dispositivo.
- File system: la parte del sistema che gestisce i file.

## Il nucleo

- Nucleo (kernel): la parte centrale del sistema, caricata all'avvio e sempre in memoria; è il solo software che comanda direttamente l'hardware.
- Chiamata di sistema: la richiesta con cui un'applicazione chiede una risorsa al nucleo.

## Il modello a strati

```tikz
% nome: strati-sistema-operativo
% alt: Il modello a strati di un computer, dall'alto in basso: utente, applicazioni, sistema operativo con il nucleo nella sua parte più bassa, hardware; frecce a due punte collegano ogni strato solo a quello vicino
\begin{tikzpicture}
\tikzset{strato/.style={draw, thick, rounded corners=3pt, minimum width=6.4cm, minimum height=0.8cm, font=\small}}
\node[font=\small] (u) at (0,5.6) {utente};
\node[strato, fill=green!12] (a) at (0,4.2) {applicazioni};
\draw[thick, rounded corners=3pt, fill=blue!8] (-3.2,1.1) rectangle (3.2,3.1);
\node[font=\small] at (0,2.7) {sistema operativo: interfaccia, file system};
\node[draw, thick, rounded corners=3pt, fill=blue!25, minimum width=5.6cm, minimum height=0.8cm, font=\small] (k) at (0,1.8) {nucleo: processi, memoria, driver};
\node[strato, fill=orange!25] (h) at (0,0) {hardware: CPU, memorie, periferiche};
\draw[{Stealth}-{Stealth}, thick] (0,5.35) -- (0,4.6);
\draw[{Stealth}-{Stealth}, thick] (0,3.8) -- (0,3.1);
\draw[{Stealth}-{Stealth}, thick] (0,1.1) -- (0,0.4);
\end{tikzpicture}
```

- Dal basso: hardware, sistema operativo (con il nucleo in basso), applicazioni, utente.
- Ogni strato comunica solo con gli strati vicini.
- Una richiesta di stampa: utente, applicazione, sistema operativo (nucleo e driver), hardware.

```ad-warning
Software, non hardware
Il sistema operativo si installa, si aggiorna e si può sostituire lasciando lo stesso hardware.
```

```ad-warning
Non è solo quello che vedi
Icone e finestre sono l'interfaccia; il nucleo lavora senza mostrare niente.
```

```ad-warning
Già installato non vuol dire sistema operativo
Browser e calcolatrice restano applicazioni, e nessuna applicazione comanda l'hardware direttamente.
```
