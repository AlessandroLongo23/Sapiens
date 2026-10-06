# Teoria del legame di valenza: legami sigma e pi greco

Una formula di Lewis dice quante coppie di elettroni due atomi mettono in comune, e la VSEPR dice che forma prende la molecola. Nessuna delle due dice che cosa sia, fisicamente, una coppia condivisa, né perché un doppio legame non sia forte il doppio di uno singolo. La teoria del legame di valenza risponde partendo dagli [orbitali](/materiale/scuola-superiore/chimica/la-struttura-elettronica-dell-atomo/orbitali-e-numeri-quantici): un legame covalente nasce quando due orbitali di due atomi diversi si sovrappongono.

## Un legame è una sovrapposizione di orbitali

La teoria del legame di valenza (in inglese valence bond, da cui la sigla VB) è stata proposta nel 1927 da Walter Heitler e Fritz London per la molecola di idrogeno, e sviluppata negli anni successivi da Linus Pauling. Le sue idee di base sono tre.

1. Ogni atomo partecipa al legame con un orbitale del guscio di valenza che contiene un solo elettrone, cioè un elettrone spaiato.
2. Quando i due atomi si avvicinano, i due orbitali si **sovrappongono**: occupano in parte la stessa regione di spazio, tra i due nuclei. In quella regione si trovano i due elettroni, che devono avere spin opposto, come vuole il principio di esclusione di Pauli.
3. I due elettroni, stando tra i nuclei, sono attirati da tutti e due: è questa attrazione che tiene uniti gli atomi. Più estesa è la sovrapposizione, più forte è il legame.

Nella molecola di idrogeno, $\mathrm{H_2}$, ogni atomo ha un elettrone nell'orbitale $1s$. I due orbitali sferici si sovrappongono nella zona tra i nuclei, e lì si concentra la coppia di elettroni. Gli atomi non si avvicinano oltre un certo punto, perché i due nuclei, positivi, si respingono: la distanza a cui attrazione e repulsione si bilanciano è la lunghezza di legame, come racconta la curva dell'energia della lezione [Energia di legame e regola dell'ottetto](/materiale/scuola-superiore/chimica/i-legami-chimici/energia-di-legame-e-regola-dell-ottetto).

```ad-note
Lewis e legame di valenza dicono la stessa cosa in due lingue
Il trattino di una formula di Lewis e la sovrapposizione di due orbitali sono lo stesso legame: una coppia di elettroni condivisa. La teoria del legame di valenza aggiunge dove stanno quegli elettroni e che forma ha la regione che occupano.
```

## Gli elettroni spaiati dicono quanti legami

Se ogni legame usa un orbitale con un elettrone spaiato, un atomo forma tanti legami quanti sono i suoi elettroni spaiati. Si contano scrivendo la [configurazione elettronica](/materiale/scuola-superiore/chimica/la-struttura-elettronica-dell-atomo/la-configurazione-elettronica) del guscio di valenza con il diagramma a caselle, e riempiendo gli orbitali $p$ secondo la regola di Hund.

```tikz
% nome: legame-valenza-elettroni-spaiati
% alt: Diagrammi a caselle del guscio di valenza di quattro atomi, uno per riga. Idrogeno: una casella 1s con una freccia arancione. Azoto: la casella 2s con due frecce nere e le tre caselle 2p con una freccia arancione ciascuna. Ossigeno: la 2s piena, una casella 2p con due frecce nere e due con una freccia arancione. Fluoro: la 2s piena, due caselle 2p piene e una con una freccia arancione. A destra di ogni riga il numero di elettroni spaiati: 1, 3, 2, 1
% svg: legame-valenza-elettroni-spaiati-cd09cd00.svg 307x161
\begin{tikzpicture}[x=0.62cm, y=0.62cm]
\node at (0.5,1.0) {\small $1s$};
\node at (3,1.0) {\small $2s$};
\node at (6.5,1.0) {\small $2p$};
\node at (10.6,1.0) {\small spaiati};
% H
\node at (-1,0) {H};
\draw[thick] (0,-0.5) rectangle (1,0.5);
\draw[-{Stealth}, thick, orange!90!black] (0.5,-0.33) -- (0.5,0.33);
\node at (10.6,0) {$1$};
% N
\node at (-1,-1.6) {N};
\draw[thick] (2.5,-2.1) rectangle (3.5,-1.1);
\draw[-{Stealth}, thick] (2.85,-1.93) -- (2.85,-1.27);
\draw[-{Stealth}, thick] (3.15,-1.27) -- (3.15,-1.93);
\foreach \x in {5,6,7} {
  \draw[thick] (\x,-2.1) rectangle (\x+1,-1.1);
  \draw[-{Stealth}, thick, orange!90!black] (\x+0.5,-1.93) -- (\x+0.5,-1.27);
}
\node at (10.6,-1.6) {$3$};
% O
\node at (-1,-3.2) {O};
\draw[thick] (2.5,-3.7) rectangle (3.5,-2.7);
\draw[-{Stealth}, thick] (2.85,-3.53) -- (2.85,-2.87);
\draw[-{Stealth}, thick] (3.15,-2.87) -- (3.15,-3.53);
\draw[thick] (5,-3.7) rectangle (6,-2.7);
\draw[-{Stealth}, thick] (5.35,-3.53) -- (5.35,-2.87);
\draw[-{Stealth}, thick] (5.65,-2.87) -- (5.65,-3.53);
\foreach \x in {6,7} {
  \draw[thick] (\x,-3.7) rectangle (\x+1,-2.7);
  \draw[-{Stealth}, thick, orange!90!black] (\x+0.5,-3.53) -- (\x+0.5,-2.87);
}
\node at (10.6,-3.2) {$2$};
% F
\node at (-1,-4.8) {F};
\draw[thick] (2.5,-5.3) rectangle (3.5,-4.3);
\draw[-{Stealth}, thick] (2.85,-5.13) -- (2.85,-4.47);
\draw[-{Stealth}, thick] (3.15,-4.47) -- (3.15,-5.13);
\foreach \x in {5,6} {
  \draw[thick] (\x,-5.3) rectangle (\x+1,-4.3);
  \draw[-{Stealth}, thick] (\x+0.35,-5.13) -- (\x+0.35,-4.47);
  \draw[-{Stealth}, thick] (\x+0.65,-4.47) -- (\x+0.65,-5.13);
}
\draw[thick] (7,-5.3) rectangle (8,-4.3);
\draw[-{Stealth}, thick, orange!90!black] (7.5,-5.13) -- (7.5,-4.47);
\node at (10.6,-4.8) {$1$};
\end{tikzpicture}
```

L'idrogeno e il fluoro hanno un elettrone spaiato e formano un legame, l'ossigeno ne ha due e l'azoto tre: è per questo che esistono $\mathrm{HF}$, $\mathrm{H_2O}$ e $\mathrm{NH_3}$, e non $\mathrm{H_2F}$ o $\mathrm{NH_5}$. Gli orbitali già pieni, con due elettroni, non partecipano ai legami: sono le coppie solitarie delle formule di Lewis.

```ad-example
Esempio 1: quanti legami forma lo zolfo
Lo zolfo ha configurazione $[\text{Ne}]\,3s^2\,3p^4$. Quanti legami forma con l'idrogeno?

Il sottolivello $3s$ è pieno. Nei tre orbitali $3p$ vanno quattro elettroni: per la regola di Hund i primi tre occupano un orbitale ciascuno, il quarto si appaia. Restano una coppia e due elettroni spaiati.

Lo zolfo forma due legami, ciascuno con l'orbitale $1s$ di un idrogeno: il composto è $\mathrm{H_2S}$, e le due coppie che non partecipano ($3s^2$ e una coppia $3p$) sono le coppie solitarie dello zolfo.
```

## Il legame sigma

Due orbitali si possono sovrapporre in due modi, e ne nascono due tipi di legame.

Nel primo modo i due orbitali si vengono incontro lungo la retta che unisce i due nuclei, l'asse di legame, e la zona di sovrapposizione sta su quell'asse, tra i nuclei. Un legame così si chiama **legame sigma**, e si scrive con la lettera greca $\sigma$. Lo formano due orbitali $s$, un orbitale $s$ e un orbitale $p$ diretto lungo l'asse, oppure due orbitali $p$ diretti tutti e due lungo l'asse, che si sovrappongono di testa.

```tikz
% nome: legame-valenza-sigma-tre-casi
% alt: Tre legami sigma, ciascuno con l'asse di legame tratteggiato e i due nuclei segnati da un punto. Nel primo, due orbitali s sferici si sovrappongono al centro: è la molecola di idrogeno. Nel secondo, un orbitale s sferico si sovrappone a un lobo di un orbitale p a due lobi disposto lungo l'asse: è il fluoruro di idrogeno. Nel terzo, due orbitali p disposti lungo l'asse si sovrappongono di testa con un lobo ciascuno: è la molecola di fluoro. In tutti e tre la zona di sovrapposizione è colorata in arancione e sta sull'asse, tra i nuclei
% svg: legame-valenza-sigma-tre-casi-0ce67e5f.svg 443x83
\begin{tikzpicture}
% s + s
\begin{scope}[shift={(0,0)}]
\draw[thin, dashed] (-1.4,0) -- (1.4,0);
\draw[thick, fill=blue!10] (-0.45,0) circle (0.7);
\draw[thick, fill=blue!10] (0.45,0) circle (0.7);
\fill[orange!50] (0,0.536) arc (50:-50:0.7) arc (230:130:0.7);
\draw[thick] (-0.45,0) circle (0.7);
\draw[thick] (0.45,0) circle (0.7);
\fill (-0.45,0) circle (1.5pt);
\fill (0.45,0) circle (1.5pt);
\node at (0,-1.15) {\small $s$ e $s$: $\mathrm{H_2}$};
\end{scope}
% s + p
\begin{scope}[shift={(3.7,0)}]
\draw[thin, dashed] (-1.6,0) -- (2,0);
\draw[thick, fill=blue!10] (-0.55,0) circle (0.7);
\draw[thick, fill=blue!10] (0.75,0) .. controls (0.45,0.6) and (-0.5,0.55) .. (-0.5,0) .. controls (-0.5,-0.55) and (0.45,-0.6) .. (0.75,0);
\draw[thick, fill=red!15] (0.75,0) .. controls (1.05,0.6) and (2,0.55) .. (2,0) .. controls (2,-0.55) and (1.05,-0.6) .. (0.75,0);
\fill[orange!50] (0.15,0) .. controls (0.15,0.25) and (0.05,0.38) .. (-0.15,0.41) .. controls (-0.38,0.33) and (-0.5,0.2) .. (-0.5,0) .. controls (-0.5,-0.2) and (-0.38,-0.33) .. (-0.15,-0.41) .. controls (0.05,-0.38) and (0.15,-0.25) .. (0.15,0);
\fill (-0.55,0) circle (1.5pt);
\fill (0.75,0) circle (1.5pt);
\node at (0.2,-1.15) {\small $s$ e $p$: $\mathrm{HF}$};
\end{scope}
% p + p
\begin{scope}[shift={(8,0)}]
\draw[thin, dashed] (-2.2,0) -- (2.2,0);
\draw[thick, fill=red!15] (-0.85,0) .. controls (-1.15,0.6) and (-2.1,0.55) .. (-2.1,0) .. controls (-2.1,-0.55) and (-1.15,-0.6) .. (-0.85,0);
\draw[thick, fill=blue!10] (-0.85,0) .. controls (-0.55,0.6) and (0.4,0.55) .. (0.4,0) .. controls (0.4,-0.55) and (-0.55,-0.6) .. (-0.85,0);
\draw[thick, fill=blue!10] (0.85,0) .. controls (0.55,0.6) and (-0.4,0.55) .. (-0.4,0) .. controls (-0.4,-0.55) and (0.55,-0.6) .. (0.85,0);
\draw[thick, fill=red!15] (0.85,0) .. controls (1.15,0.6) and (2.1,0.55) .. (2.1,0) .. controls (2.1,-0.55) and (1.15,-0.6) .. (0.85,0);
\fill[orange!50] (0.4,0) .. controls (0.4,0.22) and (0.25,0.36) .. (0,0.4) .. controls (-0.25,0.36) and (-0.4,0.22) .. (-0.4,0) .. controls (-0.4,-0.22) and (-0.25,-0.36) .. (0,-0.4) .. controls (0.25,-0.36) and (0.4,-0.22) .. (0.4,0);
\fill (-0.85,0) circle (1.5pt);
\fill (0.85,0) circle (1.5pt);
\node at (0,-1.15) {\small $p$ e $p$ di testa: $\mathrm{F_2}$};
\end{scope}
\end{tikzpicture}
```

Nel fluoruro di idrogeno, $\mathrm{HF}$, l'orbitale $1s$ dell'idrogeno si sovrappone all'orbitale $2p$ del fluoro che contiene l'elettrone spaiato; nella molecola di fluoro, $\mathrm{F_2}$, si sovrappongono di testa i due orbitali $2p$ semipieni dei due atomi.

Visto dalla parte di uno dei nuclei, lungo l'asse, un legame $\sigma$ ha la stessa forma tutto intorno, come un cilindro. Se uno dei due atomi ruota attorno all'asse la sovrapposizione non cambia, e per questo attorno a un legame $\sigma$ la rotazione è libera.

```ad-example
Esempio 2: quali orbitali si sovrappongono nel cloruro di idrogeno
Nel cloruro di idrogeno, $\mathrm{HCl}$, quali orbitali formano il legame, e di che tipo è?

L'idrogeno ha l'elettrone spaiato nell'orbitale $1s$. Il cloro ha configurazione $[\text{Ne}]\,3s^2\,3p^5$: dei tre orbitali $3p$ due sono pieni e uno ha un solo elettrone.

Si sovrappongono l'orbitale $1s$ dell'idrogeno e l'orbitale $3p$ semipieno del cloro, diretto verso l'idrogeno. La sovrapposizione sta sull'asse che unisce i due nuclei: è un legame $\sigma$.
```

## Il legame pi greco

Nel secondo modo si sovrappongono due orbitali $p$ paralleli tra loro e perpendicolari all'asse di legame, che si toccano di fianco. Le zone di sovrapposizione sono due, una sopra e una sotto l'asse, e sull'asse non c'è niente. Un legame così si chiama **legame pi greco**, e si scrive $\pi$.

```tikz
% nome: legame-valenza-pi-laterale
% alt: Due atomi sull'asse di legame orizzontale, tratteggiato, ciascuno con un orbitale p verticale: un lobo azzurro sopra l'asse e un lobo rosato sotto. I due lobi di sopra si sovrappongono di fianco in una zona arancione sopra l'asse, e i due lobi di sotto in una zona arancione sotto l'asse. Sull'asse, tra i due nuclei, non c'è sovrapposizione
% svg: legame-valenza-pi-laterale-f5b595b4.svg 232x114
\begin{tikzpicture}
\draw[thin, dashed] (-1.8,0) -- (1.8,0);
\draw[thick, fill=blue!10] (-0.5,0) .. controls (-1.15,0.35) and (-1.1,1.45) .. (-0.5,1.45) .. controls (0.1,1.45) and (0.15,0.35) .. (-0.5,0);
\draw[thick, fill=blue!10] (0.5,0) .. controls (-0.15,0.35) and (-0.1,1.45) .. (0.5,1.45) .. controls (1.1,1.45) and (1.15,0.35) .. (0.5,0);
\draw[thick, fill=red!15] (-0.5,0) .. controls (-1.15,-0.35) and (-1.1,-1.45) .. (-0.5,-1.45) .. controls (0.1,-1.45) and (0.15,-0.35) .. (-0.5,0);
\draw[thick, fill=red!15] (0.5,0) .. controls (-0.15,-0.35) and (-0.1,-1.45) .. (0.5,-1.45) .. controls (1.1,-1.45) and (1.15,-0.35) .. (0.5,0);
\fill[orange!50] (0,0.36) .. controls (-0.15,0.65) and (-0.15,1.0) .. (0,1.3) .. controls (0.15,1.0) and (0.15,0.65) .. (0,0.36);
\fill[orange!50] (0,-0.36) .. controls (-0.15,-0.65) and (-0.15,-1.0) .. (0,-1.3) .. controls (0.15,-1.0) and (0.15,-0.65) .. (0,-0.36);
\fill (-0.5,0) circle (1.5pt);
\fill (0.5,0) circle (1.5pt);
\node[right] at (1.9,0) {\small asse di legame};
\node[right] at (0.9,1.2) {\small sovrapposizione sopra};
\node[right] at (0.9,-1.2) {\small sovrapposizione sotto};
\end{tikzpicture}
```

I due colori dei lobi sono i due segni della funzione d'onda, come nelle figure della lezione sugli orbitali. La sovrapposizione che lega è quella tra lobi dello stesso segno: per questo i due orbitali $p$ di un legame $\pi$ devono essere paralleli, con i lobi dello stesso colore dalla stessa parte.

Un legame $\pi$ è diverso da un legame $\sigma$ in tre cose.

| | Legame $\sigma$ | Legame $\pi$ |
|---|---|---|
| Sovrapposizione | lungo l'asse di legame, di testa | di fianco, sopra e sotto l'asse |
| Orbitali | $s$ e $s$, $s$ e $p$, $p$ e $p$ | solo $p$ e $p$ paralleli |
| Forza | più forte | più debole |
| Rotazione attorno all'asse | libera | bloccata |

Il legame $\pi$ è più debole perché due orbitali affiancati si sovrappongono meno di due orbitali che si vengono incontro, e gli elettroni stanno più lontani dall'asse su cui si trovano i nuclei. La rotazione è bloccata perché, se uno dei due atomi ruota attorno all'asse, i due orbitali $p$ smettono di essere paralleli e la sovrapposizione si perde: per ruotare bisogna rompere il legame $\pi$.

Con la figura qui sotto puoi avvicinare due orbitali e vedere che legame nasce. Scegli la coppia di orbitali e poi riduci la distanza tra i nuclei con il cursore.

```interattivo
% nome: legame-valenza-sovrapposizione
% alt: Due atomi sull'asse di legame, ciascuno con un orbitale: sferico per un orbitale s, a due lobi di colore diverso per un orbitale p. Cinque bottoni scelgono la coppia: s con s, s con p lungo l'asse, p con p di testa, p con p di fianco, s con p di fianco. Un cursore avvicina i due nuclei. La zona in cui si sovrappongono lobi dello stesso segno è colorata in arancione, quella in cui si sovrappongono lobi di segno opposto in grigio. Sotto si legge se la sovrapposizione dà un legame sigma, un legame pi greco o nessun legame
```

Nei primi tre casi la zona arancione compare sull'asse, tra i nuclei: sono legami $\sigma$. Con due orbitali $p$ affiancati le zone arancioni sono due, sopra e sotto l'asse: è un legame $\pi$. Nell'ultimo caso l'orbitale $s$ si sovrappone a tutti e due i lobi dell'orbitale $p$, uno dello stesso segno e uno di segno opposto, in parti uguali: i due contributi si annullano e non nasce nessun legame. Un orbitale $s$ non può formare legami $\pi$.

```ad-warning
Un legame pi greco non sono due legami
Il legame $\pi$ ha due zone di sovrapposizione, una sopra e una sotto l'asse, ma è un legame solo: contiene una sola coppia di elettroni, che si trova un po' sopra e un po' sotto.
```

## Legami singoli, doppi e tripli

Tra due atomi c'è posto per un solo legame $\sigma$, perché l'asse di legame è uno. Se i due atomi mettono in comune più di una coppia di elettroni, le altre coppie formano legami $\pi$, con gli orbitali $p$ che restano perpendicolari all'asse.

| Legame | Coppie condivise | Legami $\sigma$ | Legami $\pi$ |
|---|---|---|---|
| singolo | $1$ | $1$ | $0$ |
| doppio | $2$ | $1$ | $1$ |
| triplo | $3$ | $1$ | $2$ |

La molecola di azoto, $\mathrm{N_2}$, ha un legame triplo. Ogni atomo ha tre elettroni spaiati nei tre orbitali $2p$, che sono perpendicolari tra loro. Quello diretto lungo l'asse si sovrappone di testa con il suo gemello dell'altro atomo e forma il legame $\sigma$. Gli altri due sono perpendicolari all'asse: ciascuno si sovrappone di fianco con quello parallelo dell'altro atomo, e si formano due legami $\pi$, in due piani perpendicolari tra loro.

```tikz
% nome: legame-valenza-azoto-triplo
% alt: La molecola di azoto con il suo triplo legame. I due nuclei sono sull'asse orizzontale; tra loro una zona arancione allungata sull'asse è il legame sigma. Sopra e sotto l'asse due zone azzurre allungate, parallele all'asse, sono il primo legame pi greco. Davanti e dietro l'asse, disegnate in obliquo, due zone verdi allungate sono il secondo legame pi greco, in un piano perpendicolare al primo
% svg: legame-valenza-azoto-triplo-16b3ef7a.svg 215x120
\begin{tikzpicture}
\draw[thin, dashed] (-2.3,0) -- (2.3,0);
\draw[thick, fill=green!20] (-0.35,0.42) ellipse (1.25 and 0.2);
\draw[thick, fill=blue!15] (0,0.95) ellipse (1.25 and 0.26);
\draw[thick, fill=orange!50] (0,0) ellipse (0.62 and 0.2);
\draw[thick, fill=blue!15] (0,-0.95) ellipse (1.25 and 0.26);
\draw[thick, fill=green!20] (0.35,-0.42) ellipse (1.25 and 0.2);
\fill (-0.9,0) circle (1.8pt);
\fill (0.9,0) circle (1.8pt);
\node[left] at (-2.3,0) {N};
\node[right] at (2.3,0) {N};
\node[right] at (1.5,0.95) {\small $\pi$};
\node[right] at (1.5,-0.95) {\small $\pi$};
\node[left] at (-1.7,0.48) {\small $\pi$};
\node[right] at (1.7,-0.48) {\small $\pi$};
\node at (0,-1.6) {\small al centro, sull'asse: $\sigma$};
\end{tikzpicture}
```

Nel legame doppio e nel legame triplo il $\sigma$ c'è sempre, ed è il primo a formarsi; i $\pi$ si aggiungono. Per questo un legame doppio è più forte di uno singolo, ma non il doppio, e un triplo non è il triplo. I legami tra due atomi di carbonio lo mostrano bene:

| Legame | Energia di legame | Lunghezza di legame |
|---|---|---|
| C–C | $347\,\text{kJ/mol}$ | $154\,\text{pm}$ |
| C=C | $614\,\text{kJ/mol}$ | $134\,\text{pm}$ |
| C≡C | $839\,\text{kJ/mol}$ | $120\,\text{pm}$ |

```ad-example
Esempio 3: quanto vale un legame pi greco
Dalla tabella, quanta energia aggiunge il legame $\pi$ quando si passa dal legame singolo C–C al doppio C=C?

Il legame doppio è fatto da un $\sigma$ e un $\pi$. Se il $\sigma$ vale circa quanto il legame singolo, il $\pi$ aggiunge
$$614\,\text{kJ/mol} - 347\,\text{kJ/mol} = 267\,\text{kJ/mol}$$
meno dei $347\,\text{kJ/mol}$ del $\sigma$. Il secondo $\pi$, passando dal doppio al triplo, aggiunge $839 - 614 = 225\,\text{kJ/mol}$.

Il conto è approssimato, perché nel legame doppio gli atomi sono più vicini e anche il $\sigma$ cambia un po'; il risultato però è quello giusto: un legame $\pi$ è più debole di un $\sigma$.
```

Nella prossima figura i due atomi sono di carbonio: scegli il legame, poi prova a ruotare uno dei due atomi attorno all'asse.

```interattivo
% nome: legame-valenza-ordine-rotazione
% alt: Due atomi di carbonio uniti da un legame singolo, doppio o triplo, da scegliere con un selettore. Il legame sigma è una zona arancione sull'asse; ogni legame pi greco è una coppia di zone allungate ai lati dell'asse, e nel doppio legame si vedono anche i due orbitali p da cui nasce. Un cursore ruota l'atomo di destra attorno all'asse da 0 a 90 gradi: nel legame singolo non cambia niente, nel doppio i due orbitali p smettono di essere paralleli e il legame pi greco sbiadisce fino a rompersi. Sotto si leggono il numero di legami sigma e pi greco, l'energia e la lunghezza del legame
```

Nel legame singolo la rotazione non cambia niente. Nel doppio, a $90^\circ$ i due orbitali $p$ sono perpendicolari, la sovrapposizione è nulla e il legame $\pi$ è rotto: per ruotare servono circa $267\,\text{kJ/mol}$, e a temperatura ambiente gli urti tra le molecole non li forniscono. Una molecola con un doppio legame resta bloccata nella sua forma. Nel triplo, i due legami $\pi$ insieme circondano l'asse da ogni lato.

```ad-warning
Il doppio legame non è fatto di due legami uguali
I due trattini di C=C nella formula sono uguali, ma i due legami no: uno è $\sigma$ e uno è $\pi$, con forma, energia e comportamento diversi. Lo stesso vale per i tre trattini di un triplo legame: un $\sigma$ e due $\pi$.
```

## Contare i legami sigma e pi greco in una molecola

Per contare i legami $\sigma$ e $\pi$ di una molecola serve la sua formula di struttura, con tutti i legami scritti:

1. Ogni legame singolo è un $\sigma$.
2. Ogni legame doppio è un $\sigma$ e un $\pi$.
3. Ogni legame triplo è un $\sigma$ e due $\pi$.

I legami $\sigma$ sono quindi tanti quante sono le coppie di atomi legati tra loro, qualunque sia il tipo di legame; i $\pi$ sono uno per ogni doppio e due per ogni triplo.

```ad-example
Esempio 4: diossido di carbonio e cianuro di idrogeno
Quanti legami $\sigma$ e $\pi$ ci sono in $\mathrm{CO_2}$ e in $\mathrm{HCN}$?

Il $\mathrm{CO_2}$ è O=C=O: due legami doppi. Ognuno dà un $\sigma$ e un $\pi$: in tutto $2$ legami $\sigma$ e $2$ legami $\pi$.

L'$\mathrm{HCN}$ è H–C≡N: un legame singolo e uno triplo. Il singolo dà un $\sigma$, il triplo un $\sigma$ e due $\pi$: in tutto $2$ legami $\sigma$ e $2$ legami $\pi$.
```

```ad-example
Esempio 5: l'etene
Quanti legami $\sigma$ e $\pi$ ci sono nell'etene, $\mathrm{CH_2{=}CH_2}$?

La formula condensata nasconde i legami con l'idrogeno: ogni carbonio è legato a due idrogeni con due legami singoli. I legami C–H sono $4$, tutti $\sigma$. Il doppio legame tra i carboni dà un $\sigma$ e un $\pi$.

In tutto $4 + 1 = 5$ legami $\sigma$ e $1$ legame $\pi$.
```

```ad-warning
Dimenticare i legami con l'idrogeno
In una formula come $\mathrm{CH_2{=}CH_2}$ o $\mathrm{CH_3{-}C{\equiv}CH}$ i legami C–H non sono disegnati, ma ci sono, e sono tutti $\sigma$. Prima di contare, scrivi la formula con tutti i trattini.
```

## Dove questo modello non basta

Con gli orbitali atomici così come sono, la teoria spiega bene le molecole biatomiche, ma si ferma davanti a due fatti.

Il primo riguarda gli angoli. Nell'acqua l'ossigeno userebbe due orbitali $2p$, che sono perpendicolari tra loro: l'angolo tra i due legami dovrebbe essere di $90^\circ$. Quello misurato è $104{,}5^\circ$. Nell'ammoniaca i tre orbitali $2p$ dell'azoto darebbero angoli di $90^\circ$, e sono circa $107^\circ$.

```tikz
% nome: legame-valenza-acqua-novanta-gradi
% alt: L'atomo di ossigeno con due orbitali p perpendicolari tra loro, uno orizzontale e uno verticale, ciascuno a due lobi. Il lobo di destra dell'orbitale orizzontale si sovrappone all'orbitale s sferico di un idrogeno, il lobo in basso dell'orbitale verticale a quello di un altro idrogeno. Tra i due legami è segnato un angolo di 90 gradi, e una scritta ricorda che l'angolo misurato è 104,5 gradi
% svg: legame-valenza-acqua-novanta-gradi-967d07c3.svg 250x143
\begin{tikzpicture}
\draw[thick, fill=red!15] (0,0) .. controls (-0.3,0.5) and (-1.2,0.45) .. (-1.2,0) .. controls (-1.2,-0.45) and (-0.3,-0.5) .. (0,0);
\draw[thick, fill=blue!10] (0,0) .. controls (0.3,0.5) and (1.2,0.45) .. (1.2,0) .. controls (1.2,-0.45) and (0.3,-0.5) .. (0,0);
\draw[thick, fill=red!15] (0,0) .. controls (-0.5,0.3) and (-0.45,1.2) .. (0,1.2) .. controls (0.45,1.2) and (0.5,0.3) .. (0,0);
\draw[thick, fill=blue!10] (0,0) .. controls (-0.5,-0.3) and (-0.45,-1.2) .. (0,-1.2) .. controls (0.45,-1.2) and (0.5,-0.3) .. (0,0);
\draw[thick, fill=blue!10] (1.5,0) circle (0.5);
\draw[thick, fill=blue!10] (0,-1.5) circle (0.5);
\fill (0,0) circle (1.5pt);
\fill (1.5,0) circle (1.5pt);
\fill (0,-1.5) circle (1.5pt);
\node at (-0.6,-0.6) {\small O};
\node at (2.25,0) {\small H};
\node at (0,-2.25) {\small H};
\draw[thin] (0.45,0) -- (0.45,-0.45) -- (0,-0.45);
\node[right] at (2.7,-0.8) {\small previsto: $90^\circ$};
\node[right] at (2.7,-1.3) {\small misurato: $104{,}5^\circ$};
\end{tikzpicture}
```

Il secondo riguarda il carbonio. La sua configurazione, $[\text{He}]\,2s^2\,2p^2$, ha solo due elettroni spaiati: il carbonio dovrebbe formare due legami, e il suo composto più semplice con l'idrogeno dovrebbe essere $\mathrm{CH_2}$. Il carbonio invece forma quasi sempre quattro legami, e nel metano, $\mathrm{CH_4}$, i quattro legami sono identici e disposti a tetraedro.

Per rendere conto di questi fatti la teoria del legame di valenza ha bisogno di un'idea in più, che è l'argomento della lezione [L'ibridazione degli orbitali](/materiale/scuola-superiore/chimica/la-forma-delle-molecole-e-le-teorie-del-legame/l-ibridazione-degli-orbitali).
