# Conduzione, convezione e irraggiamento

Il manico di un cucchiaio lasciato nella pentola diventa caldo anche se non tocca l'acqua, l'aria sopra un termosifone sale e scalda la stanza, e il Sole scalda la Terra attraverso centocinquanta milioni di chilometri di spazio vuoto. Sono tre modi diversi in cui il calore passa da un corpo più caldo a uno più freddo: la conduzione, la convezione e l'irraggiamento. Conoscerli spiega perché le pentole hanno il manico di plastica, perché i termosifoni stanno in basso e come funziona un thermos.

## Il calore va dal caldo al freddo

Come nella lezione sull'[equilibrio termico](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/l-equilibrio-termico-e-il-calorimetro), il calore passa sempre da dove la temperatura è più alta a dove è più bassa, e il passaggio si ferma quando le temperature sono uguali. Cambia il modo in cui l'energia viaggia:

- nella **conduzione** l'energia passa attraverso la materia, da una parte all'altra di un corpo o tra due corpi a contatto, senza che la materia si sposti;
- nella **convezione** l'energia viaggia con la materia stessa, un liquido o un gas che si muove e porta il calore con sé;
- nell'**irraggiamento** l'energia viaggia come radiazione, e non ha bisogno di materia: passa anche nel vuoto.

## La conduzione

Nella conduzione le particelle della parte più calda di un corpo, che si agitano di più, urtano le particelle vicine e cedono loro una parte della loro energia di agitazione; queste la passano alle successive, e così via, mentre ogni particella resta al suo posto. È il modo in cui il calore si propaga nei solidi: il cucchiaio nella pentola si scalda a partire dalla parte immersa, e il calore risale lungo il manico.

I materiali in cui il calore passa facilmente sono **conduttori termici**: i metalli, come il rame, l'alluminio e il ferro. Quelli in cui passa con difficoltà sono **isolanti termici**: il legno, la plastica, la lana, il polistirolo, e soprattutto l'aria ferma. Molti isolanti, come la lana, il piumino e il polistirolo espanso, isolano proprio perché intrappolano tanta aria in piccole cavità, dove non può muoversi.

```ad-warning
Il metallo non è più freddo del legno
In una stanza una maniglia di metallo sembra più fredda della porta di legno, ma dopo ore nella stessa stanza hanno tutte e due la temperatura della stanza. La mano, più calda, sente quanto rapidamente perde calore: il metallo, buon conduttore, lo porta via in fretta, il legno lentamente. Per lo stesso motivo un pavimento di piastrelle sembra più freddo di un tappeto alla stessa temperatura.
```

### La legge della conduzione

Si consideri una lastra di un materiale, con due facce parallele di area $S$ a distanza $d$ (lo spessore), una più calda dell'altra: la differenza di temperatura tra le due facce è $\Delta T$.

```tikz
% nome: lastra-conduzione-calore
% alt: Una lastra disegnata in prospettiva, di spessore d, con la faccia di sinistra calda alla temperatura T1 e quella di destra più fredda alla temperatura T2; la faccia di destra, di area S, è segnata con la lettera S. Due frecce arancioni, una che entra da sinistra e una che esce a destra con la lettera Q, indicano il calore che attraversa la lastra dalla faccia calda a quella fredda
% svg: lastra-conduzione-calore-402a3f9b.svg 184x152
\begin{tikzpicture}
\draw[thick, fill=gray!20] (0,0) rectangle (1.5,2.5);
\draw[thick, fill=gray!10] (0,2.5) -- (0.6,3.1) -- (2.1,3.1) -- (1.5,2.5) -- cycle;
\draw[thick, fill=gray!30] (1.5,0) -- (2.1,0.6) -- (2.1,3.1) -- (1.5,2.5) -- cycle;
\draw[thin, dashed] (0,0) -- (0.6,0.6) -- (0.6,3.1);
\draw[thin, dashed] (0.6,0.6) -- (2.1,0.6);
\node at (1.8,1.55) {$S$};
\draw[-{Stealth}, thick, orange!90!black] (-1.3,1.25) -- (-0.15,1.25);
\draw[-{Stealth}, thick, orange!90!black] (2.25,1.25) -- (3.4,1.25) node[above left] {$Q$};
\node[left] at (-0.1,2.3) {$T_1$};
\node[right] at (2.2,2.7) {$T_2$};
\draw[{Stealth}-{Stealth}, thin] (0,-0.35) -- (1.5,-0.35) node[midway, below] {$d$};
\node[below] at (-0.7,0.6) {\small caldo};
\node[below] at (2.9,0.6) {\small freddo};
\end{tikzpicture}
```

Gli esperimenti mostrano che il calore $Q$ che attraversa la lastra in un intervallo di tempo $\Delta t$ è direttamente proporzionale all'area $S$, alla differenza di temperatura $\Delta T$ e al tempo, e inversamente proporzionale allo spessore $d$:

$$\frac{Q}{\Delta t} = \lambda\,\frac{S\,\Delta T}{d}$$

- $Q/\Delta t$ è il calore che passa ogni secondo, in joule al secondo, cioè in watt, come una [potenza](/materiale/scuola-superiore/fisica/lavoro-ed-energia/la-potenza);
- $\lambda$ è il **coefficiente di conducibilità termica**, che dipende dal materiale: grande per i conduttori, piccolo per gli isolanti;
- $\Delta T$ è la differenza di temperatura tra le due facce: una differenza di $1\,\text{K}$ è una differenza di $1\,^\circ\text{C}$, quindi si può usare l'una o l'altra scala.

Dalla formula l'unità di $\lambda$ è $\text{W/(m}\cdot\text{K)}$: la conducibilità è il calore che passa ogni secondo attraverso $1\,\text{m}^2$ di materiale spesso $1\,\text{m}$, con $1\,\text{K}$ di differenza tra le facce.

```ad-note
Due lettere da non confondere
In questa formula la temperatura si scrive con la $T$ maiuscola, perché la $t$ minuscola serve per il tempo, $\Delta t$. La lettera $\lambda$ è quella che usa l'Amaldi per la conducibilità termica; la stessa lettera, nella lezione sulla [dilatazione termica](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/la-dilatazione-termica), indica il coefficiente di dilatazione lineare, che è un'altra grandezza, con un'altra unità.
```

| Materiale | $\lambda$ in $\text{W/(m}\cdot\text{K)}$ |
|---|---|
| rame | $401$ |
| alluminio | $237$ |
| ferro | $80$ |
| acciaio inossidabile | circa $16$ |
| vetro | circa $1$ |
| mattoni pieni | circa $0{,}8$ |
| acqua | $0{,}6$ |
| legno | circa $0{,}1$ |
| polistirolo espanso | circa $0{,}035$ |
| aria ferma | $0{,}025$ |

Dal rame all'aria ferma la conducibilità cambia di più di diecimila volte. I valori con "circa" cambiano da un campione all'altro dello stesso materiale.

```ad-example
Esempio 1: il calore attraverso un vetro
Una finestra ha un vetro di $1{,}2\,\text{m}^2$, spesso $4{,}0\,\text{mm}$, con $\lambda = 1{,}0\,\text{W/(m}\cdot\text{K)}$. Tra la faccia interna e quella esterna del vetro ci sono $2{,}0\,^\circ\text{C}$ di differenza. Quanto calore passa ogni secondo?

Lo spessore va in metri: $d = 4{,}0\,\text{mm} = 4{,}0 \cdot 10^{-3}\,\text{m}$. Allora

$$\frac{Q}{\Delta t} = \lambda\,\frac{S\,\Delta T}{d} = 1{,}0\,\frac{\text{W}}{\text{m}\cdot\text{K}} \cdot \frac{1{,}2\,\text{m}^2 \cdot 2{,}0\,\text{K}}{4{,}0 \cdot 10^{-3}\,\text{m}} = 600\,\text{W} = 6{,}0 \cdot 10^2\,\text{W}$$

come una stufetta elettrica accesa. Per questo le finestre hanno il doppio vetro: tra i due vetri c'è uno strato d'aria ferma, che conduce quaranta volte meno del vetro.
```

```ad-warning
Lo spessore in metri
Con $\lambda$ in $\text{W/(m}\cdot\text{K)}$ lo spessore va in metri e l'area in metri quadrati. Con lo spessore dell'esempio 1 lasciato in millimetri, $4{,}0$ invece di $0{,}0040$, il risultato viene mille volte troppo piccolo; con un'area in $\text{cm}^2$, diecimila volte troppo grande.
```

```ad-example
Esempio 2: una parete in una notte d'inverno
Una parete di mattoni pieni, con $\lambda = 0{,}80\,\text{W/(m}\cdot\text{K)}$, ha un'area di $10\,\text{m}^2$ ed è spessa $25\,\text{cm}$. La faccia interna è a $18\,^\circ\text{C}$, quella esterna a $3\,^\circ\text{C}$. Quanto calore esce in $10$ ore?

Il calore che passa ogni secondo è

$$\frac{Q}{\Delta t} = 0{,}80 \cdot \frac{10 \cdot 15}{0{,}25}\,\text{W} = 480\,\text{W}$$

In $10$ ore, cioè $\Delta t = 10 \cdot 3600\,\text{s} = 36\,000\,\text{s}$:

$$Q = 480\,\text{W} \cdot 36\,000\,\text{s} = 1{,}728 \cdot 10^7\,\text{J} \approx 1{,}7 \cdot 10^7\,\text{J}$$

È il calore che il riscaldamento deve fornire, solo per questa parete, per tenere la stanza a $18\,^\circ\text{C}$.
```

Nella figura qui sotto una sbarra ha un'estremità in acqua che bolle, a $100\,^\circ\text{C}$, e l'altra in acqua e ghiaccio, a $0\,^\circ\text{C}$. Scegli il materiale di due sbarre e guarda come si scaldano: in una sbarra di rame il calore arriva in fondo in pochi minuti, in una di vetro serve molto più tempo, e alla fine ogni sbarra lascia passare ogni secondo il calore dato dalla legge della conduzione.

```interattivo
% nome: conduzione-sbarra-materiali
% alt: Due sbarre lunghe 20 centimetri, con una sezione di 1 centimetro quadrato, una sopra l'altra, con l'estremità sinistra in acqua che bolle a 100 gradi e la destra in acqua e ghiaccio a 0 gradi; all'inizio le sbarre sono a 0 gradi, e per ognuna si sceglie il materiale (rame, ferro, acciaio, vetro). Un bottone avvia il tempo, un minuto o dieci minuti per ogni secondo: le sbarre si colorano dal blu al rosso man mano che il calore avanza, prima quella di materiale più conduttore, e un triangolo sotto ogni sbarra segna fin dove ha superato 50 gradi. Sotto si leggono il tempo trascorso, la temperatura a metà di ogni sbarra, il calore che arriva ogni secondo all'estremità fredda e quello a regime, lambda per S per delta T diviso d: 20 watt per il rame, 4 per il ferro
```

## La convezione

Nei liquidi e nei gas la conduzione è poco efficace, perché la conducibilità dei fluidi è piccola; il calore si propaga soprattutto per **convezione**, cioè trasportato dal fluido che si muove. In una pentola sul fuoco l'acqua sul fondo si scalda, si [dilata](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/la-dilatazione-termica) e diventa meno densa dell'acqua intorno: la [spinta di Archimede](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-spinta-di-archimede-e-il-galleggiamento) la porta verso l'alto, e il suo posto è preso dall'acqua più fredda, più densa, che scende dai lati. Si forma una corrente circolare, un **moto convettivo**, che mescola tutta l'acqua e la scalda molto più in fretta della conduzione.

```tikz
% nome: moti-convettivi-pentola
% alt: Una pentola d'acqua su una fiamma, vista in sezione. Al centro l'acqua calda sale, con frecce rosse verso l'alto; in superficie si sposta verso i lati, lungo le pareti scende come acqua più fredda, con frecce blu verso il basso, e sul fondo torna verso il centro: due correnti circolari, una per parte
% svg: moti-convettivi-pentola-64b358c4.svg 155x133
\begin{tikzpicture}
\fill[cyan!20] (0,0.3) rectangle (4,2.6);
\draw[thin] (0,2.6) -- (4,2.6);
\draw[thick] (0,3.1) -- (0,0.3) -- (4,0.3) -- (4,3.1);
\draw[thick, fill=orange!40] (1.5,0) .. controls (1.6,-0.05) and (1.7,0.2) .. (1.75,0.25) .. controls (1.8,0.1) and (1.9,0.0) .. (2,0.28) .. controls (2.1,0.0) and (2.2,0.1) .. (2.25,0.25) .. controls (2.3,0.2) and (2.4,-0.05) .. (2.5,0) -- cycle;
\draw[thick] (0.9,-0.3) -- (3.1,-0.3);
\draw[-{Stealth}, thick, red] (1.8,0.6) -- (1.8,2.0);
\draw[-{Stealth}, thick, red] (2.2,0.6) -- (2.2,2.0);
\draw[-{Stealth}, thick, red] (1.7,2.3) .. controls (1.2,2.4) and (0.7,2.4) .. (0.45,2.1);
\draw[-{Stealth}, thick, red] (2.3,2.3) .. controls (2.8,2.4) and (3.3,2.4) .. (3.55,2.1);
\draw[-{Stealth}, thick, blue] (0.4,1.9) -- (0.4,0.8);
\draw[-{Stealth}, thick, blue] (3.6,1.9) -- (3.6,0.8);
\draw[-{Stealth}, thick, blue] (0.5,0.55) .. controls (0.9,0.45) and (1.3,0.45) .. (1.6,0.5);
\draw[-{Stealth}, thick, blue] (3.5,0.55) .. controls (3.1,0.45) and (2.7,0.45) .. (2.4,0.5);
\end{tikzpicture}
```

La convezione è all'opera in molti fenomeni di ogni giorno:

- il termosifone scalda l'aria vicina, che sale verso il soffitto e fa scendere l'aria fredda dall'altra parte della stanza: per questo i termosifoni si mettono in basso, sotto le finestre, e i condizionatori in alto;
- di giorno la terra si scalda più del mare, l'aria sopra la terra sale e quella fresca del mare prende il suo posto: è la brezza di mare, che di notte si inverte e diventa brezza di terra;
- il fumo di una candela e l'aria sopra l'asfalto d'estate salgono per la stessa ragione.

Nei solidi la convezione non c'è, perché le particelle non possono spostarsi; e nell'aria ferma, intrappolata nella lana o nel polistirolo, è impedita.

## L'irraggiamento

Ogni corpo emette energia sotto forma di **radiazione elettromagnetica**, la stessa famiglia di onde della luce, e ne emette di più quanto più è caldo. I corpi alla temperatura di una stanza emettono soprattutto radiazione infrarossa, che l'occhio non vede ma la pelle sente come calore davanti a un camino; un pezzo di ferro scaldato a lungo sulla fiamma comincia anche a brillare, prima rosso e poi quasi bianco. Nello stesso tempo ogni corpo assorbe una parte della radiazione che gli arriva dall'ambiente: se ne assorbe più di quanta ne emette si scalda, altrimenti si raffredda. Questo passaggio di energia è l'**irraggiamento**, e a differenza della conduzione e della convezione avviene anche nel vuoto: è così che l'energia del Sole arriva sulla Terra.

Quanta radiazione un corpo assorbe dipende dalla sua superficie. Le superfici scure e opache assorbono quasi tutta la radiazione che le colpisce, e sono anche quelle che ne emettono di più; le superfici chiare e lucide ne riflettono gran parte. D'estate una maglietta nera al sole scotta più di una bianca, e i pannelli solari per l'acqua calda sono neri.

```ad-note
Quanto irraggia un corpo
La potenza emessa per irraggiamento cresce molto con la temperatura: è proporzionale alla quarta potenza della temperatura assoluta $T$ (la legge di Stefan-Boltzmann). Un corpo a $600\,\text{K}$ irraggia sedici volte più di uno a $300\,\text{K}$.
```

## Il thermos e il cappotto termico

Per tenere caldo, o freddo, un corpo bisogna ostacolare tutti e tre i modi. Il **thermos**, o vaso di Dewar, ci riesce così:

- ha due pareti di vetro con il vuoto in mezzo: senza materia tra le pareti non ci sono né conduzione né convezione;
- le pareti sono argentate, come specchi: riflettono la radiazione infrarossa e ostacolano l'irraggiamento;
- il tappo, di plastica o di sughero, è isolante e impedisce all'aria calda di uscire.

```tikz
% nome: thermos-sezione
% alt: Un thermos in sezione: due pareti con uno spazio vuoto in mezzo, le facce verso il vuoto argentate e disegnate grigie, il liquido caldo all'interno e un tappo isolante in alto. Il vuoto tra le pareti ferma conduzione e convezione, le pareti argentate riflettono la radiazione, il tappo isola in alto
% svg: thermos-sezione-4a50ad62.svg 218x155
\begin{tikzpicture}
\fill[orange!25] (0.4,0.4) rectangle (2.6,3.0);
\draw[thin] (0.4,3.0) -- (2.6,3.0);
\draw[thick] (0,3.6) -- (0,0) -- (3,0) -- (3,3.6);
\draw[thick] (0.4,3.6) -- (0.4,0.4) -- (2.6,0.4) -- (2.6,3.6);
\draw[very thick, gray] (0.08,3.6) -- (0.08,0.08) -- (2.92,0.08) -- (2.92,3.6);
\draw[very thick, gray] (0.32,3.6) -- (0.32,0.32) -- (2.68,0.32) -- (2.68,3.6);
\draw[thick, fill=gray!20] (0.55,3.35) rectangle (2.45,4.0);
\draw[thick] (0,3.6) -- (0.4,3.6);
\draw[thick] (2.6,3.6) -- (3,3.6);
\draw[thin] (3.1,0.2) -- (2.8,0.2);
\node[right] at (3.15,0.2) {\small vuoto};
\draw[thin] (3.1,1.6) -- (2.68,1.6);
\node[right] at (3.15,1.6) {\small pareti argentate};
\draw[thin] (3.1,3.7) -- (2.45,3.7);
\node[right] at (3.15,3.7) {\small tappo isolante};
\node at (1.5,1.7) {\small liquido caldo};
\end{tikzpicture}
```

Il **cappotto termico** di una casa fa la stessa cosa con le pareti: uno strato di materiale isolante, di solito polistirolo espanso o lana di roccia spessi qualche centimetro, incollato sulla faccia esterna dei muri. La legge della conduzione dice quanto conviene: a parità di calore che passa, lo spessore necessario è proporzionale alla conducibilità.

```ad-example
Esempio 3: quanto vale un centimetro di polistirolo
Quale spessore di polistirolo espanso, con $\lambda = 0{,}035\,\text{W/(m}\cdot\text{K)}$, lascia passare lo stesso calore di una parete di mattoni pieni spessa $25\,\text{cm}$, con $\lambda = 0{,}80\,\text{W/(m}\cdot\text{K)}$, a parità di area e di differenza di temperatura?

Il calore che passa ogni secondo è lo stesso se $\lambda / d$ è lo stesso:

$$\frac{\lambda_p}{d_p} = \frac{\lambda_m}{d_m} \qquad d_p = d_m \cdot \frac{\lambda_p}{\lambda_m} = 25\,\text{cm} \cdot \frac{0{,}035}{0{,}80} = 1{,}09\ldots\,\text{cm} \approx 1{,}1\,\text{cm}$$

Poco più di un centimetro di polistirolo isola quanto un quarto di metro di mattoni. Un cappotto di $10\,\text{cm}$ riduce di molte volte il calore che esce dalla parete dell'esempio 2.
```

```ad-example
Esempio 4: lo spessore di una borsa frigo
Una borsa frigo di polistirolo espanso ($\lambda = 0{,}035\,\text{W/(m}\cdot\text{K)}$) ha una superficie totale di $0{,}50\,\text{m}^2$. Dentro ci sono $4\,^\circ\text{C}$, fuori $30\,^\circ\text{C}$. Quanto devono essere spesse le pareti perché entrino al massimo $6{,}5\,\text{W}$?

Dalla legge della conduzione si ricava lo spessore:

$$d = \lambda\,\frac{S\,\Delta T}{Q/\Delta t} = 0{,}035 \cdot \frac{0{,}50 \cdot 26}{6{,}5}\,\text{m} = 0{,}070\,\text{m} = 7{,}0\,\text{cm}$$

Con pareti più sottili entrerebbe più calore: con metà spessore, il doppio.
```

```ad-warning
La differenza di temperatura, non la temperatura
Nella legge della conduzione c'è $\Delta T$, la differenza tra le temperature delle due facce. Nell'esempio 4 è $30 - 4 = 26\,^\circ\text{C}$: usare $30\,^\circ\text{C}$, o peggio $303\,\text{K}$, dà un risultato sbagliato. Se le due facce hanno la stessa temperatura, il calore non passa, qualunque sia il materiale.
```
