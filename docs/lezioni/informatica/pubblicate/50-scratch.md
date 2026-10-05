# La programmazione a blocchi

Chi scrive il suo primo programma in un linguaggio testuale passa buona parte del tempo a cercare una parentesi dimenticata o una parola battuta male: il computer non perdona nemmeno un carattere, e finché l'errore c'è il programma non parte. La programmazione a blocchi toglie di mezzo questo ostacolo. Le istruzioni sono pezzi già pronti, da trascinare e incastrare come le tessere di un puzzle, e tutta l'attenzione resta sull'algoritmo.

## Programmi fatti di pezzi

Nella **programmazione a blocchi** un programma si costruisce trascinando sullo schermo dei blocchi colorati, ognuno dei quali è un'istruzione già scritta, e agganciandoli uno all'altro. Di solito l'ambiente ha tre zone: l'elenco dei blocchi tra cui scegliere, lo spazio in cui si compone il programma e una scena in cui si vede il risultato, spesso un personaggio che si muove, disegna o parla. Uno degli ambienti più usati a scuola è Scratch.

Il programma della figura fa disegnare un quadrato al personaggio: per quattro volte avanza di 50 passi e gira di 90 gradi, poi dice "fatto".

```tikz
% nome: programma-a-blocchi-quadrato
% alt: Un programma a blocchi fatto di pezzi impilati: in alto il blocco di avvio "quando si preme avvia"; sotto, un blocco a forma di C con scritto "ripeti 4 volte" che contiene i due blocchi "fai 50 passi" e "ruota di 90 gradi"; in fondo il blocco "dì fatto". Ogni blocco ha una linguetta che entra in quello sotto
% svg: programma-a-blocchi-quadrato-87232328.svg 271x167
\begin{tikzpicture}
\newcommand{\blocco}[5]{\draw[thick, fill=#4] (#1,#2) -- (#1+#3,#2) -- (#1+#3,#2-0.7) -- (#1+1.3,#2-0.7) -- (#1+1.2,#2-0.84) -- (#1+0.7,#2-0.84) -- (#1+0.6,#2-0.7) -- (#1,#2-0.7) -- cycle; \node[font=\small, anchor=west] at (#1+0.15,#2-0.35) {#5};}
\blocco{0}{-3.3}{5}{green!15}{dì ``fatto''}
\draw[thick, fill=orange!20] (0,-0.7) -- (5,-0.7) -- (5,-1.4) -- (0.5,-1.4) -- (0.5,-2.8) -- (5,-2.8) -- (5,-3.3) -- (1.3,-3.3) -- (1.2,-3.44) -- (0.7,-3.44) -- (0.6,-3.3) -- (0,-3.3) -- cycle;
\node[font=\small, anchor=west] at (0.15,-1.05) {ripeti 4 volte};
\blocco{0.5}{-2.1}{4.5}{blue!12}{ruota di 90 gradi}
\blocco{0.5}{-1.4}{4.5}{blue!12}{fai 50 passi}
\draw[thick, fill=orange!20] (1.1,-1.4) -- (1.2,-1.54) -- (1.7,-1.54) -- (1.8,-1.4);
\draw[thick, fill=yellow!25] (0,-0.7) -- (0,-0.2) to[out=60, in=180] (1,0.1) to[out=0, in=160] (2.2,0) -- (5,0) -- (5,-0.7) -- (1.3,-0.7) -- (1.2,-0.84) -- (0.7,-0.84) -- (0.6,-0.7) -- cycle;
\node[font=\small, anchor=west] at (0.15,-0.35) {quando si preme ``avvia''};
\node[font=\footnotesize, anchor=west] at (5.3,-0.35) {avvio};
\node[font=\footnotesize, anchor=west] at (5.3,-1.05) {iterazione};
\draw[thick] (5.2,-1.5) -- (5.3,-1.5) -- (5.3,-2.7) -- (5.2,-2.7);
\node[font=\footnotesize, anchor=west, align=left] at (5.4,-2.1) {istruzioni\\da ripetere};
\node[font=\footnotesize, anchor=west] at (5.3,-3.65) {dopo il giro};
\end{tikzpicture}
```

Si legge dall'alto in basso, come lo [pseudocodice](/materiale/scuola-superiore/informatica/algoritmi-e-diagrammi-di-flusso/lo-pseudocodice). Il blocco in cima, con il bordo superiore arrotondato, dice quando il programma parte; i blocchi agganciati sotto si eseguono in ordine; il blocco a forma di C tiene dentro di sé le istruzioni da ripetere, come fa il rientro sotto la riga `finché`.

## Perché i blocchi si incastrano

La forma di un blocco dice dove può stare, e fa il lavoro che in un linguaggio testuale fanno le regole di scrittura.

| Forma del blocco | Che cosa è | Dove si incastra |
|---|---|---|
| bordo superiore arrotondato, linguetta sotto | l'avvio del programma | in cima, senza niente sopra |
| incavo sopra e linguetta sotto | un'istruzione | sotto un altro blocco, in una pila |
| a forma di C | una selezione o un'iterazione | in una pila, con altri blocchi al suo interno |
| pezzo piccolo, arrotondato o a punta | un valore oppure una condizione | nel foro della stessa forma dentro un altro blocco |

Un pezzo che non ha la forma giusta non si aggancia. Una condizione, che ha i lati a punta, entra nel foro a punta del blocco "se" e non nel foro tondo dei numeri di "fai ... passi"; un'istruzione non entra in nessun foro. Per questo in un programma a blocchi non possono esserci **errori di sintassi**, cioè errori nel modo di scrivere le istruzioni: non c'è niente da battere, quindi niente da battere male, e quello che si riesce a comporre è sempre un programma che parte.

```ad-warning
Un programma che parte non è un programma giusto
I blocchi impediscono gli errori di scrittura, non quelli di ragionamento. Se nel quadrato scrivi 80 gradi al posto di 90, o metti "dì fatto" dentro la C, tutto si incastra alla perfezione e il personaggio fa un'altra cosa. Questi sono **errori logici**, e si trovano come in qualunque algoritmo: eseguendo un passo alla volta e confrontando con quello che ti aspettavi.
```

## Le tre strutture nei blocchi

I blocchi sono un altro modo di scrivere le tre strutture della lezione [Sequenza, selezione, iterazione e teorema di Böhm-Jacopini](/materiale/scuola-superiore/informatica/algoritmi-e-diagrammi-di-flusso/sequenza-selezione-iterazione-e-teorema-di-bohm-jacopini). La sequenza è la pila: un blocco sotto l'altro. La selezione è un blocco "se ... allora ... altrimenti" con due spazi, uno per ramo. L'iterazione è un blocco a C con un solo spazio, in più versioni: "ripeti 4 volte", "ripeti fino a quando" seguito da una condizione, "per sempre".

Il blocco "ripeti 4 volte" conta i giri da solo. Nei diagrammi di flusso di queste lezioni il conto si scrive: una variabile $i$ parte da 1, cresce di uno a ogni giro, e il giro si ripete finché $i$ non supera 4. Qui sotto c'è il programma del quadrato come diagramma. Non avendo un personaggio da muovere, scrive le mosse.

```diagramma
% nome: blocchi-quadrato-come-diagramma
% alt: Diagramma di flusso con una ripetizione: i prende 1; un rombo chiede se i è minore o uguale a 4; nel giro si scrive "avanti di 50 passi", si scrive "gira di 90 gradi" e i prende i più 1, poi una freccia risale al rombo; all'uscita si scrive "fatto"
i = 1
finché i <= 4
    scrivi "avanti di 50 passi"
    scrivi "gira di 90 gradi"
    i = i + 1
scrivi "fatto"
```

Premi "Esegui" e conta le righe scritte: otto mosse e "fatto". Tre righe della figura (la C e i due blocchi che contiene) qui diventano cinque blocchi, perché il contatore è in vista.

Un programma a blocchi può anche avere più pile, ognuna con il suo blocco di avvio ("quando si preme la barra spaziatrice", "quando si clicca sul personaggio"), e ogni pila parte quando succede la cosa scritta in cima. Un diagramma di flusso ha invece un solo inizio.

## Costruire con i blocchi dei diagrammi

In questo sito non c'è un ambiente a blocchi con un personaggio, ma i diagrammi di flusso si costruiscono nello stesso modo. Premi "Modifica" sul diagramma del quadrato: compare la fila dei blocchi disponibili ("leggi", "scrivi", "assegna", "selezione", "ciclo"), e un blocco si trascina su una freccia. Come le tessere, un blocco può finire solo dove ha senso: su una freccia, mai a metà di un altro blocco o fuori dal percorso, e una selezione nasce già con i suoi due rami. Il disegno che ottieni è sempre un diagramma che si può eseguire.

Prova a trasformare il quadrato in un triangolo con i lati uguali: clicca dentro il rombo e cambia la condizione in `i <= 3`, clicca dentro il secondo "scrivi" e porta i gradi a 120, poi premi "Prova il diagramma" ed "Esegui". Devono uscire sei mosse. "Modifica" e poi "Ripristina" riportano il quadrato.

C'è una differenza rispetto ai blocchi veri: qui il contenuto di un blocco lo batti tu sulla tastiera, quindi un errore di scrittura è possibile. Prova a scrivere nel rombo `i = 3`, con un solo uguale: il diagramma non lo accetta e ti dice che cosa non va. È un piccolo anticipo di quello che succede con un linguaggio testuale.

Accanto al diagramma, intanto, c'è lo stesso programma in un linguaggio testuale, che cambia a ogni blocco che sposti: è la stessa pila, con le righe al posto dei pezzi.

## Dai blocchi al testo

I blocchi vanno bene per cominciare, perché fanno vedere la struttura del programma e lasciano fuori la sintassi. Quando il programma cresce diventano scomodi: una pila di centinaia di blocchi non sta sullo schermo, e trascinare è più lento che scrivere. Per questo i programmi che usi ogni giorno sono scritti in linguaggi testuali, di cui parla la lezione [Linguaggi, compilatori e interpreti](/materiale/scuola-superiore/informatica/linguaggi-e-primi-programmi/linguaggi-compilatori-e-interpreti). Quello che hai imparato con i blocchi resta valido riga per riga: variabili, sequenza, selezione e iterazione sono le stesse, cambia solo il modo di scriverle.

## Prova tu

### Un errore che i blocchi non impediscono

Il diagramma dovrebbe fare il conto alla rovescia da $n$ a 1 e poi scrivere "via!". Il diagramma si esegue senza fermarsi (premi "Prova il diagramma" per vederlo), ma con 3 scrive 2, 1, 0. È un errore logico: torna su "Modifica", trova i due blocchi nell'ordine sbagliato, trascinane uno sulla freccia giusta e riprova.

```diagramma
% nome: blocchi-da-correggere-conto-alla-rovescia
% alt: Diagramma di flusso da correggere: si legge n; un rombo chiede se n è maggiore di zero; nel giro prima n prende n meno 1 e poi si scrive n, e una freccia risale al rombo; all'uscita si scrive "via!"
% ingresso: 3
% codice: no
% modifica: sì
leggi n
finché n > 0
    n = n - 1
    scrivi n
scrivi "via!"
```

### Il quiz con i punti

In un quiz a blocchi il personaggio chiede quanto fa $7 \cdot 8$, e se la risposta è giusta il blocco "cambia punti di 10" aggiunge 10 ai punti. Nel diagramma la domanda del rombo c'è già e il ramo "sì" è vuoto: trascinaci un blocco "assegna" e scrivilo, con `punti` prima della freccia e `punti + 10` dopo. Provalo con 56 e con 54: deve scrivere 10 e poi 0.

```diagramma
% nome: blocchi-da-completare-quiz-punti
% alt: Diagramma di flusso da completare: punti prende 0 e si legge risposta; un rombo chiede se risposta è uguale a 56; il ramo sì è vuoto e il ramo no non ha blocchi; poi si scrive punti
% ingresso: 56
% modifica: sì
punti = 0
leggi risposta
se risposta == 56
scrivi punti
```

### Ripeti fino a quando

Un contapassi a blocchi è fatto così:

1. chiedi l'obiettivo e mettilo in `obiettivo`;
2. porta `passi` a 0;
3. ripeti fino a quando `passi` è maggiore o uguale a `obiettivo`: cambia `passi` di 1000, dì `passi`;
4. dì "obiettivo raggiunto".

Costruisci il diagramma. Il blocco "ripeti fino a quando" dice quando si esce dal giro, mentre il rombo di un ciclo chiede quando si resta: la condizione va scritta al contrario, `passi < obiettivo`. Con un obiettivo di 3000 deve scrivere 1000, 2000, 3000 e "obiettivo raggiunto"; prova poi con 2500 e con 0.

```diagramma
% nome: blocchi-da-costruire-contapassi
% alt: Un diagramma di flusso da costruire, con i soli blocchi di inizio e di fine: deve leggere un obiettivo di passi, aggiungere 1000 passi alla volta scrivendoli, e scrivere "obiettivo raggiunto"
% ingresso: 3000
% modifica: sì
```
