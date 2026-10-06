# L'ibridazione degli orbitali

Il metano, $\mathrm{CH_4}$, è la molecola più semplice che il carbonio forma con l'idrogeno, e la [teoria del legame di valenza](/materiale/scuola-superiore/chimica/la-forma-delle-molecole-e-le-teorie-del-legame/teoria-del-legame-di-valenza-legami-sigma-e-pi-greco) con gli orbitali $s$ e $p$ così come sono non riesce a descriverla. L'ibridazione è l'idea che la completa: gli orbitali di un atomo, dentro una molecola, si mescolano e ne danno di nuovi, con la forma e la direzione giuste per i legami.

## Il problema del metano

Le misure dicono che nel metano i quattro legami C–H sono identici: stessa lunghezza, $109\,\text{pm}$, stessa energia, e angoli tutti di $109{,}5^\circ$, quelli del tetraedro.

Il carbonio ha configurazione $[\text{He}]\,2s^2\,2p^2$, con due soli elettroni spaiati: dovrebbe formare due legami. E se anche tutti e quattro gli elettroni di valenza fossero spaiati, uno nell'orbitale $2s$ e tre negli orbitali $2p$, i legami sarebbero di due tipi: tre fatti con gli orbitali $p$, a $90^\circ$ l'uno dall'altro, e uno diverso fatto con l'orbitale $s$. Niente di tutto questo somiglia al metano.

## Promozione e mescolamento: gli orbitali sp³

La teoria descrive il carbonio del metano in due passi.

Il primo è la **promozione**: uno dei due elettroni dell'orbitale $2s$ passa nell'orbitale $2p$ vuoto. Gli elettroni spaiati diventano quattro. La promozione costa energia, ma il carbonio la recupera con gli interessi, perché forma quattro legami al posto di due.

Il secondo è l'**ibridazione**: l'orbitale $2s$ e i tre orbitali $2p$ si mescolano e danno quattro orbitali nuovi, tutti uguali tra loro, che si chiamano **orbitali ibridi** $sp^3$. Il nome dice da che cosa sono fatti: un orbitale $s$ e tre orbitali $p$.

```tikz
% nome: ibridazione-carbonio-caselle-sp3
% alt: Tre diagrammi a caselle del guscio di valenza del carbonio, con l'energia che cresce verso l'alto. Stato fondamentale: la casella 2s in basso con due frecce, e in alto le tre caselle 2p, due con una freccia e una vuota. Dopo la promozione: una freccia nella 2s e una in ciascuna delle tre 2p. Dopo l'ibridazione: quattro caselle uguali, a un'altezza intermedia, con una freccia ciascuna, gli orbitali ibridi sp3
\begin{tikzpicture}[x=0.6cm, y=0.6cm]
\draw[->] (-1.2,-0.8) -- (-1.2,3.2) node[above] {\small $E$};
% stato fondamentale
\draw[thick] (0,-0.5) rectangle (1,0.5);
\draw[-{Stealth}, thick] (0.35,-0.33) -- (0.35,0.33);
\draw[-{Stealth}, thick] (0.65,0.33) -- (0.65,-0.33);
\foreach \x in {1.6,2.6,3.6} \draw[thick] (\x,1.6) rectangle (\x+1,2.6);
\foreach \x in {1.6,2.6} \draw[-{Stealth}, thick] (\x+0.5,1.77) -- (\x+0.5,2.43);
\node at (0.5,-1) {\small $2s$};
\node at (3.1,3.1) {\small $2p$};
\node at (2.3,-2) {\small stato fondamentale};
\draw[-{Stealth}, thick] (5,1) -- (6,1);
% promozione
\begin{scope}[shift={(6.6,0)}]
\draw[thick] (0,-0.5) rectangle (1,0.5);
\draw[-{Stealth}, thick] (0.5,-0.33) -- (0.5,0.33);
\foreach \x in {1.6,2.6,3.6} {
  \draw[thick] (\x,1.6) rectangle (\x+1,2.6);
  \draw[-{Stealth}, thick] (\x+0.5,1.77) -- (\x+0.5,2.43);
}
\node at (0.5,-1) {\small $2s$};
\node at (3.1,3.1) {\small $2p$};
\node at (2.3,-2) {\small promozione};
\draw[-{Stealth}, thick] (5,1) -- (6,1);
\end{scope}
% ibridazione
\begin{scope}[shift={(13.2,0)}]
\foreach \x in {0,1,2,3} {
  \draw[thick, fill=orange!25] (\x,0.9) rectangle (\x+1,1.9);
  \draw[-{Stealth}, thick] (\x+0.5,1.07) -- (\x+0.5,1.73);
}
\node at (2,2.4) {\small $sp^3$};
\node at (2,-2) {\small ibridazione};
\end{scope}
\end{tikzpicture}
```

Gli orbitali ibridi rispettano tre regole, che valgono per ogni tipo di ibridazione:

- sono tanti quanti gli orbitali atomici mescolati: da quattro orbitali ($s$, $p_x$, $p_y$, $p_z$) nascono quattro ibridi;
- hanno tutti la stessa energia, intermedia tra quella dell'orbitale $s$ e quella degli orbitali $p$, e la stessa forma;
- si dispongono il più lontano possibile l'uno dall'altro: quattro ibridi puntano verso i vertici di un tetraedro, a $109{,}5^\circ$.

### La forma di un orbitale ibrido

Un orbitale $p$ ha due lobi uguali, di segno opposto. Mescolandolo con un orbitale $s$, che ha lo stesso segno dappertutto, da una parte i due si sommano e dall'altra si sottraggono: l'ibrido ha un lobo grande da un lato del nucleo e un lobo piccolo dall'altro.

```tikz
% nome: ibridazione-s-piu-p
% alt: A sinistra un orbitale s, un cerchio azzurro; poi il segno più e un orbitale p con un lobo azzurro a destra e un lobo rosato a sinistra; poi una freccia e un orbitale ibrido, con un lobo azzurro grande a destra del nucleo e un lobo rosato piccolo a sinistra
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0,0) circle (0.55);
\fill (0,0) circle (1.5pt);
\node at (0,-1.1) {\small $s$};
\node at (1.1,0) {$+$};
\begin{scope}[shift={(3,0)}]
\draw[thick, fill=blue!10] (0,0) .. controls (0.3,0.5) and (1.1,0.45) .. (1.1,0) .. controls (1.1,-0.45) and (0.3,-0.5) .. (0,0);
\draw[thick, fill=red!15] (0,0) .. controls (-0.3,0.5) and (-1.1,0.45) .. (-1.1,0) .. controls (-1.1,-0.45) and (-0.3,-0.5) .. (0,0);
\fill (0,0) circle (1.5pt);
\node at (0,-1.1) {\small $p$};
\end{scope}
\draw[-{Stealth}, thick] (4.6,0) -- (5.5,0);
\begin{scope}[shift={(6.7,0)}]
\draw[thick, fill=blue!10] (0,0) .. controls (0.35,0.75) and (1.7,0.7) .. (1.7,0) .. controls (1.7,-0.7) and (0.35,-0.75) .. (0,0);
\draw[thick, fill=red!15] (0,0) .. controls (-0.12,0.25) and (-0.45,0.22) .. (-0.45,0) .. controls (-0.45,-0.22) and (-0.12,-0.25) .. (0,0);
\fill (0,0) circle (1.5pt);
\node at (0.5,-1.1) {\small ibrido};
\end{scope}
\end{tikzpicture}
```

Il lobo grande si allunga in una direzione precisa più di quanto facciano un orbitale $s$ o un orbitale $p$ da soli: si sovrappone meglio all'orbitale di un altro atomo e dà un legame $\sigma$ più forte. Nei disegni delle molecole il lobo piccolo di solito non si disegna.

Con il cursore puoi decidere quanto orbitale $p$ mettere nell'ibrido, da zero (un orbitale $s$) al $100\%$ (un orbitale $p$).

```interattivo
% nome: ibridazione-forma-ibrido
% alt: La forma di un orbitale ottenuto mescolando un orbitale s e un orbitale p, al variare della parte di p scelta con un cursore da 0 a 100 per cento. A zero è un cerchio, l'orbitale s. Aumentando la parte di p compare a sinistra del nucleo un lobo piccolo di segno opposto, che cresce, mentre il lobo di destra si allunga; al 100 per cento i due lobi sono uguali, ed è un orbitale p. Tre tacche segnano gli ibridi sp al 50 per cento, sp2 al 67 per cento e sp3 al 75 per cento
```

A zero la forma è una sfera, al $100\%$ sono due lobi uguali. In mezzo il lobo di un lato cresce a spese dell'altro. I tre ibridi che servono in chimica sono tre punti di questo percorso: l'ibrido $sp^3$ ha tre quarti di $p$ e un quarto di $s$, e ne incontrerai altri due, $sp^2$ (due terzi di $p$) e $sp$ (metà e metà).

### I legami del metano

Ognuno dei quattro ibridi $sp^3$ del carbonio contiene un elettrone e si sovrappone di testa all'orbitale $1s$ di un idrogeno: nascono quattro legami $\sigma$ identici, diretti verso i vertici di un tetraedro. È la geometria che la [VSEPR](/materiale/scuola-superiore/chimica/la-forma-delle-molecole-e-le-teorie-del-legame/la-geometria-delle-molecole) prevede contando i domini, ritrovata a partire dagli orbitali.

```ad-warning
L'ibridazione non è qualcosa che l'atomo fa prima di legarsi
Promozione e ibridazione non sono due tappe che avvengono una dopo l'altra nel tempo, e un atomo di carbonio isolato non è ibridato. Sono un modo di descrivere gli orbitali del carbonio quando è già dentro la molecola, costruito per rendere conto della geometria che si misura.
```

## Ammoniaca e acqua: ibridi con coppie solitarie

Anche l'azoto dell'ammoniaca e l'ossigeno dell'acqua si descrivono con quattro ibridi $sp^3$. Hanno però più elettroni del carbonio, e in quattro orbitali cinque o sei elettroni non possono stare tutti spaiati.

L'azoto ha $5$ elettroni di valenza: un ibrido ne contiene due e gli altri tre uno ciascuno. I tre ibridi semipieni formano i legami $\sigma$ con gli idrogeni; quello pieno è la coppia solitaria. L'ossigeno ha $6$ elettroni di valenza: due ibridi pieni, le due coppie solitarie, e due semipieni, che formano i due legami O–H.

```tikz
% nome: ibridazione-metano-ammoniaca-acqua
% alt: Tre molecole disegnate con gli orbitali ibridi sp3 dell'atomo centrale, lobi allungati che partono dal nucleo. Nel metano quattro lobi azzurri puntano verso i vertici di un tetraedro e ciascuno si sovrappone al cerchio di un idrogeno. Nell'ammoniaca tre lobi azzurri si sovrappongono a tre idrogeni e un lobo giallo in alto, con due puntini, è la coppia solitaria. Nell'acqua due lobi azzurri si sovrappongono a due idrogeni e due lobi gialli in alto, con due puntini ciascuno, sono le coppie solitarie
\begin{tikzpicture}
% metano
\foreach \a/\s in {90/1,205/1,335/1,270/0.8} {
  \draw[thick, fill=gray!20] (\a:1.35*\s) circle (0.3);
  \draw[thick, fill=blue!10, rotate=\a, scale=\s] (0,0) .. controls (0.3,0.5) and (1.2,0.45) .. (1.2,0) .. controls (1.2,-0.45) and (0.3,-0.5) .. (0,0);
  \node at (\a:1.42*\s) {\small H};
}
\fill (0,0) circle (1.5pt);
\node at (0,-1.9) {\small $\mathrm{CH_4}$};
% ammoniaca
\begin{scope}[shift={(3.8,0)}]
\draw[thick, fill=yellow!40, rotate=90] (0,0) .. controls (0.3,0.5) and (1.2,0.45) .. (1.2,0) .. controls (1.2,-0.45) and (0.3,-0.5) .. (0,0);
\fill (-0.1,0.85) circle (1.3pt); \fill (0.1,0.85) circle (1.3pt);
\foreach \a/\s in {205/1,335/1,270/0.8} {
  \draw[thick, fill=gray!20] (\a:1.35*\s) circle (0.3);
  \draw[thick, fill=blue!10, rotate=\a, scale=\s] (0,0) .. controls (0.3,0.5) and (1.2,0.45) .. (1.2,0) .. controls (1.2,-0.45) and (0.3,-0.5) .. (0,0);
  \node at (\a:1.42*\s) {\small H};
}
\fill (0,0) circle (1.5pt);
\node at (0,-1.9) {\small $\mathrm{NH_3}$};
\end{scope}
% acqua
\begin{scope}[shift={(7.6,0)}]
\foreach \a in {55,125} {
  \draw[thick, fill=yellow!40, rotate=\a] (0,0) .. controls (0.3,0.5) and (1.2,0.45) .. (1.2,0) .. controls (1.2,-0.45) and (0.3,-0.5) .. (0,0);
  \fill (\a-7:0.85) circle (1.3pt); \fill (\a+7:0.85) circle (1.3pt);
}
\foreach \a in {215,325} {
  \draw[thick, fill=gray!20] (\a:1.35) circle (0.3);
  \draw[thick, fill=blue!10, rotate=\a] (0,0) .. controls (0.3,0.5) and (1.2,0.45) .. (1.2,0) .. controls (1.2,-0.45) and (0.3,-0.5) .. (0,0);
  \node at (\a:1.42) {\small H};
}
\fill (0,0) circle (1.5pt);
\node at (0,-1.9) {\small $\mathrm{H_2O}$};
\end{scope}
\end{tikzpicture}
```

Gli angoli previsti sono quelli del tetraedro, $109{,}5^\circ$, molto più vicini ai valori misurati dei $90^\circ$ degli orbitali $p$ non mescolati: circa $107^\circ$ nell'ammoniaca e $104{,}5^\circ$ nell'acqua. La piccola differenza è quella che conosci dalla VSEPR: le coppie solitarie occupano più spazio delle coppie di legame e stringono un poco gli angoli.

```ad-example
Esempio 1: lo ione ammonio
Qual è l'ibridazione dell'azoto nello ione ammonio, $\mathrm{NH_4^+}$, e quali orbitali formano i suoi legami?

L'azoto è legato a quattro idrogeni e non ha coppie solitarie: quattro domini, disposti a tetraedro. Servono quattro orbitali ibridi, e l'azoto è ibridato $sp^3$.

Ogni legame N–H è un legame $\sigma$ tra un ibrido $sp^3$ dell'azoto e l'orbitale $1s$ di un idrogeno. I quattro legami sono identici, come nel metano, e gli angoli sono di $109{,}5^\circ$.
```

## L'ibridazione sp²: l'etene

Nell'etene, $\mathrm{CH_2{=}CH_2}$, ogni carbonio è legato a tre atomi, tutti nello stesso piano, con angoli di circa $120^\circ$. Quattro ibridi a tetraedro qui non servono: ne servono tre in un piano.

Dopo la promozione, il carbonio mescola l'orbitale $2s$ con due soli orbitali $2p$. Nascono tre orbitali ibridi $sp^2$, che stanno in un piano e puntano verso i vertici di un triangolo equilatero, a $120^\circ$ l'uno dall'altro. Il terzo orbitale $2p$ non partecipa al mescolamento: resta com'era, perpendicolare al piano degli ibridi, con il suo elettrone.

```tikz
% nome: ibridazione-caselle-sp2-sp
% alt: Due diagrammi a caselle del carbonio ibridato, con l'energia che cresce verso l'alto. A sinistra l'ibridazione sp2: tre caselle arancioni uguali con una freccia ciascuna, gli ibridi sp2, e più in alto una casella bianca con una freccia, l'orbitale 2p rimasto. A destra l'ibridazione sp: due caselle arancioni con una freccia ciascuna, gli ibridi sp, e più in alto due caselle bianche con una freccia ciascuna, i due orbitali 2p rimasti
\begin{tikzpicture}[x=0.6cm, y=0.6cm]
\draw[->] (-1.2,-0.3) -- (-1.2,3.4) node[above] {\small $E$};
\foreach \x in {0,1,2} {
  \draw[thick, fill=orange!25] (\x,0.3) rectangle (\x+1,1.3);
  \draw[-{Stealth}, thick] (\x+0.5,0.47) -- (\x+0.5,1.13);
}
\draw[thick] (3.6,1.6) rectangle (4.6,2.6);
\draw[-{Stealth}, thick] (4.1,1.77) -- (4.1,2.43);
\node at (1.5,-0.3) {\small $sp^2$};
\node at (4.1,3.1) {\small $2p$};
\begin{scope}[shift={(8.5,0)}]
\foreach \x in {0,1} {
  \draw[thick, fill=orange!25] (\x,0.1) rectangle (\x+1,1.1);
  \draw[-{Stealth}, thick] (\x+0.5,0.27) -- (\x+0.5,0.93);
}
\foreach \x in {2.6,3.6} {
  \draw[thick] (\x,1.6) rectangle (\x+1,2.6);
  \draw[-{Stealth}, thick] (\x+0.5,1.77) -- (\x+0.5,2.43);
}
\node at (1,-0.5) {\small $sp$};
\node at (3.6,3.1) {\small $2p$};
\end{scope}
\end{tikzpicture}
```

Nell'etene ogni carbonio usa i tre ibridi $sp^2$ per tre legami $\sigma$: due con gli orbitali $1s$ di due idrogeni e uno con un ibrido $sp^2$ dell'altro carbonio. I due orbitali $p$ rimasti, uno per carbonio, sono paralleli e si sovrappongono di fianco: formano il legame $\pi$. Il doppio legame C=C è fatto così, un $\sigma$ tra due ibridi e un $\pi$ tra due orbitali $p$ non ibridati.

```tikz
% nome: ibridazione-etene-sigma-pi
% alt: La molecola di etene vista di lato e un poco dall'alto. I due carboni e i quattro idrogeni sono uniti da trattini spessi, i legami sigma, tutti nello stesso piano. Su ogni carbonio c'è un orbitale p verticale, perpendicolare al piano, con un lobo azzurro sopra e uno rosato sotto. Due archi tratteggiati arancioni uniscono i due lobi di sopra e i due lobi di sotto: è il legame pi greco
\begin{tikzpicture}
\foreach \x in {-0.75,0.75} {
  \draw[thick, fill=blue!10] (\x,0) .. controls (\x-0.5,0.3) and (\x-0.45,1.3) .. (\x,1.3) .. controls (\x+0.45,1.3) and (\x+0.5,0.3) .. (\x,0);
  \draw[thick, fill=red!15] (\x,0) .. controls (\x-0.5,-0.3) and (\x-0.45,-1.3) .. (\x,-1.3) .. controls (\x+0.45,-1.3) and (\x+0.5,-0.3) .. (\x,0);
}
\draw[very thick] (-0.75,0) -- (0.75,0);
\draw[very thick] (-0.75,0) -- (-1.9,0.4);
\draw[very thick] (-0.75,0) -- (-1.7,-0.5);
\draw[very thick] (0.75,0) -- (1.9,0.4);
\draw[very thick] (0.75,0) -- (1.7,-0.5);
\fill (-0.75,0) circle (2pt);
\fill (0.75,0) circle (2pt);
\node at (-2.15,0.45) {\small H};
\node at (-1.95,-0.6) {\small H};
\node at (2.15,0.45) {\small H};
\node at (1.95,-0.6) {\small H};
\draw[thick, dashed, orange!90!black] (-0.55,1.2) .. controls (-0.3,1.6) and (0.3,1.6) .. (0.55,1.2);
\draw[thick, dashed, orange!90!black] (-0.55,-1.2) .. controls (-0.3,-1.6) and (0.3,-1.6) .. (0.55,-1.2);
\node at (0,1.8) {\small $\pi$};
\node at (0,0.25) {\small $\sigma$};
\node[right] at (2.6,0.9) {\small trattini: legami $\sigma$};
\node[right] at (2.6,0.4) {\small tra ibridi $sp^2$ e con H};
\node[right] at (2.6,-0.4) {\small lobi: orbitali $p$};
\node[right] at (2.6,-0.9) {\small non ibridati};
\end{tikzpicture}
```

Perché i due orbitali $p$ siano paralleli, i due triangoli degli ibridi devono stare nello stesso piano: per questo i sei atomi dell'etene sono complanari, e la molecola non ruota attorno al doppio legame.

Anche il boro del trifluoruro di boro, $\mathrm{BF_3}$, è ibridato $sp^2$: tre ibridi per i tre legami $\sigma$ con i fluori, a $120^\circ$, e un orbitale $p$ che resta vuoto.

## L'ibridazione sp: l'etino

Nell'etino, $\mathrm{HC{\equiv}CH}$, ogni carbonio è legato a due atomi soli, e i quattro atomi stanno su una retta. Il carbonio mescola l'orbitale $2s$ con un solo orbitale $2p$: nascono due orbitali ibridi $sp$, che puntano in versi opposti, a $180^\circ$. Restano due orbitali $2p$ non ibridati, perpendicolari tra loro e alla retta degli ibridi, con un elettrone ciascuno.

Ogni carbonio forma due legami $\sigma$ con i due ibridi $sp$, uno con l'idrogeno e uno con l'altro carbonio. I due orbitali $p$ di un carbonio si sovrappongono di fianco con i due dell'altro e danno due legami $\pi$, in due piani perpendicolari. Il triplo legame è un $\sigma$ tra due ibridi $sp$ più due $\pi$ tra orbitali $p$.

Nella figura qui sotto scegli quanti orbitali $p$ mescolare con l'orbitale $s$ del carbonio, e guarda quanti ibridi nascono, come si dispongono e quanti orbitali $p$ restano per i legami $\pi$.

```interattivo
% nome: ibridazione-mescola-orbitali
% alt: Un atomo di carbonio con i suoi orbitali, e un selettore che sceglie l'ibridazione sp3, sp2 o sp. A sinistra il diagramma a caselle: le caselle arancioni degli ibridi, quattro, tre o due, e sopra le caselle bianche degli orbitali p rimasti, nessuna, una o due. A destra gli orbitali attorno al nucleo: i lobi arancioni degli ibridi disposti a tetraedro, a triangolo in un piano oppure su una retta, e gli orbitali p rimasti disegnati con due lobi sottili perpendicolari agli ibridi. Sotto si leggono il numero di ibridi, l'angolo tra loro, gli orbitali p rimasti e i legami pi greco che il carbonio può formare
```

Ogni orbitale $p$ che entra nel mescolamento aggiunge un ibrido e toglie un orbitale $p$ libero: gli ibridi più gli orbitali $p$ rimasti fanno sempre quattro. Con meno ibridi gli angoli si allargano, da $109{,}5^\circ$ a $120^\circ$ a $180^\circ$, e ogni orbitale $p$ rimasto è un legame $\pi$ che il carbonio può formare.

## Dalla geometria all'ibridazione

Gli orbitali ibridi di un atomo servono a due cose: formare i legami $\sigma$ e ospitare le coppie solitarie. I legami $\pi$ si fanno con gli orbitali $p$ non ibridati. Un atomo ha quindi tanti orbitali ibridi quanti sono i suoi domini elettronici, cioè il suo numero sterico:

| Numero sterico | Ibridazione | Orbitali mescolati | Disposizione degli ibridi | Orbitali $p$ rimasti | Esempi |
|---|---|---|---|---|---|
| $4$ | $sp^3$ | $s$ e tre $p$ | tetraedro, $109{,}5^\circ$ | $0$ | $\mathrm{CH_4}$, $\mathrm{NH_3}$, $\mathrm{H_2O}$ |
| $3$ | $sp^2$ | $s$ e due $p$ | triangolo, $120^\circ$ | $1$ | $\mathrm{C_2H_4}$, $\mathrm{BF_3}$ |
| $2$ | $sp$ | $s$ e un $p$ | retta, $180^\circ$ | $2$ | $\mathrm{C_2H_2}$, $\mathrm{CO_2}$ |

Per trovare l'ibridazione di un atomo in una molecola:

1. Scrivi la [formula di Lewis](/materiale/scuola-superiore/chimica/i-legami-chimici/le-formule-di-lewis-delle-molecole).
2. Conta i domini di quell'atomo: gli atomi a cui è legato più le sue coppie solitarie. Un legame doppio o triplo conta come un solo dominio.
3. Quattro domini: $sp^3$. Tre: $sp^2$. Due: $sp$.

```ad-example
Esempio 2: il carbonio della formaldeide
Qual è l'ibridazione del carbonio nella formaldeide, $\mathrm{CH_2O}$, e come sono fatti i suoi legami?

Il carbonio è legato a due idrogeni con due legami singoli e all'ossigeno con un legame doppio; non ha coppie solitarie. I domini sono tre: ibridazione $sp^2$, con gli atomi in un piano e angoli di circa $120^\circ$.

I tre ibridi $sp^2$ formano tre legami $\sigma$, due con gli idrogeni e uno con l'ossigeno. L'orbitale $p$ rimasto si sovrappone di fianco a un orbitale $p$ dell'ossigeno: è il legame $\pi$ del doppio legame C=O.
```

```ad-example
Esempio 3: il carbonio del diossido di carbonio
Qual è l'ibridazione del carbonio nel $\mathrm{CO_2}$?

Il carbonio è legato a due ossigeni con due legami doppi e non ha coppie solitarie: due domini, ibridazione $sp$, molecola lineare.

I due ibridi $sp$ formano i due legami $\sigma$ con gli ossigeni. I due orbitali $p$ rimasti formano due legami $\pi$, uno con ciascun ossigeno, in due piani perpendicolari tra loro.
```

```ad-example
Esempio 4: i tre carboni del propene
Nel propene, $\mathrm{CH_3{-}CH{=}CH_2}$, i tre carboni hanno la stessa ibridazione?

Il primo carbonio, quello del gruppo $\mathrm{CH_3}$, è legato a tre idrogeni e a un carbonio con quattro legami singoli: quattro domini, $sp^3$.

Il secondo è legato a un idrogeno, al primo carbonio e, con un doppio legame, al terzo: tre domini, $sp^2$. Il terzo è legato a due idrogeni e al secondo carbonio con il doppio legame: tre domini, $sp^2$.

Il legame tra il primo e il secondo carbonio è un $\sigma$ tra un ibrido $sp^3$ e un ibrido $sp^2$. Nella stessa molecola atomi dello stesso elemento possono avere ibridazioni diverse: l'ibridazione si assegna a un atomo alla volta.
```

```ad-warning
Contare i legami al posto dei domini
Nel $\mathrm{CO_2}$ il carbonio ha quattro coppie di legame, e chi conta le coppie risponde $sp^3$. Gli ibridi fanno solo i legami $\sigma$: un legame doppio ne usa uno, come un legame singolo. I domini sono due e l'ibridazione è $sp$.
```

```ad-warning
Dimenticare le coppie solitarie
L'azoto dell'ammoniaca è legato a tre atomi, e chi conta solo gli atomi risponde $sp^2$. La coppia solitaria occupa un orbitale ibrido come un legame: i domini sono quattro e l'ibridazione è $sp^3$. Lo stesso vale per l'ossigeno dell'acqua, che è $sp^3$ e non $sp$.
```

## Che cosa dice l'ibridazione, e che cosa no

L'ibridazione è un modello, e va usata sapendo che cosa fa. Non prevede la geometria di una molecola: la si sceglie guardando la geometria, misurata o trovata con la VSEPR, e serve a descrivere i legami di quella geometria con gli orbitali. Dice quali orbitali formano i legami $\sigma$, dove stanno le coppie solitarie e da dove vengono i legami $\pi$.

```ad-note
Non tutti gli atomi si ibridano allo stesso modo
Nel solfuro di idrogeno, $\mathrm{H_2S}$, l'angolo tra i legami è di circa $92^\circ$, vicino ai $90^\circ$ degli orbitali $p$ non mescolati: lo zolfo, più grande dell'ossigeno, usa orbitali quasi puri. La regola che lega il numero sterico all'ibridazione funziona bene per gli atomi del secondo periodo, come carbonio, azoto e ossigeno; per quelli dei periodi successivi è un'approssimazione più grossolana.
```

```ad-note
Più di quattro domini
Per le molecole con cinque o sei domini, come $\mathrm{PCl_5}$ e $\mathrm{SF_6}$, alcuni libri usano ibridi che comprendono anche orbitali $d$, chiamati $sp^3d$ e $sp^3d^2$. In questa lezione non servono.
```
