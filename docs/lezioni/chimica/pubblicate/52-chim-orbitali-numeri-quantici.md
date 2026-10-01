# Orbitali e numeri quantici

Nei libri di chimica gli orbitali sono sfere, palloncini accoppiati, quadrifogli. Sembrano disegni arbitrari, e invece vengono tutti da una sola idea: l'elettrone, attorno al nucleo, si comporta come un'onda chiusa in uno spazio. Da questa idea escono le forme, e con le forme i tre numeri che dicono in quale orbitale si trova un elettrone. Gli orbitali disegnati in questa lezione sono quelli dell'atomo di idrogeno, l'unico per cui le forme si calcolano in modo esatto.

## Un'onda chiusa ammette solo certe forme

L'elettrone di un atomo non è una pallina che gira attorno al nucleo come un pianeta: una carica che gira perde energia e cadrebbe sul nucleo in una frazione di secondo. Si descrive invece con un'onda, e l'attrazione del nucleo tiene quest'onda chiusa attorno a sé.

Un'onda chiusa non può vibrare come vuole. Pensa alla corda di una chitarra, fissata ai due estremi: può vibrare tutta intera, oppure divisa in due metà, oppure in tre parti, e in nessun modo intermedio.

```tikz
% nome: orbitali-corda-onde-stazionarie
% alt: Tre corde fissate agli estremi, una sotto l'altra. La prima vibra tutta intera, con un solo ventre, e non ha nodi. La seconda vibra divisa in due metà, con un nodo al centro segnato in rosso. La terza vibra in tre parti, con due nodi segnati in rosso a un terzo e a due terzi della lunghezza
% svg: orbitali-corda-onde-stazionarie-3e882173.svg 319x174
\begin{tikzpicture}
\foreach \k/\y/\lab in {1/0/{nessun nodo}, 2/-1.7/{1 nodo}, 3/-3.4/{2 nodi}} {
  \draw[very thin, gray] (0,\y) -- (6,\y);
  \draw[thick, blue, domain=0:6, samples=90, smooth] plot (\x, {\y + 0.55*sin(\k*30*\x)});
  \draw[thin, blue, dashed, domain=0:6, samples=90, smooth] plot (\x, {\y - 0.55*sin(\k*30*\x)});
  \fill (0,\y) circle (1.8pt);
  \fill (6,\y) circle (1.8pt);
  \node[right] at (6.3,\y) {\small \lab};
}
\fill[red] (3,-1.7) circle (2.2pt);
\fill[red] (2,-3.4) circle (2.2pt);
\fill[red] (4,-3.4) circle (2.2pt);
\end{tikzpicture}
```

I punti della corda che restano fermi si chiamano **nodi**. Il modo più semplice di vibrare non ne ha, il secondo ne ha uno, il terzo due, e ogni nodo in più vuol dire una vibrazione più rapida, cioè più energia. Per l'elettrone vale la stessa regola: gli stati permessi si contano con i nodi, e più nodi ha uno stato, più energia ha l'elettrone.

## L'orbitale è una mappa di probabilità

L'onda dell'elettrone non è qualcosa che sale e scende. È una funzione matematica, la **funzione d'onda**, e ha un significato preciso: il suo quadrato, in un punto, dice quanto è probabile trovare l'elettrone lì.

Immagina di poter fotografare l'atomo migliaia di volte e di segnare ogni volta con un puntino dove hai trovato l'elettrone. Dopo molte foto i puntini disegnano una nuvola: fitta dove l'elettrone si trova spesso, rada dove si trova di rado. Questa nuvola è l'orbitale.

Un **orbitale** è la mappa della probabilità di trovare l'elettrone attorno al nucleo. Poiché la nuvola sfuma senza un bordo, nei libri si disegna la superficie che racchiude la zona in cui l'elettrone si trova con una probabilità del 90%: è da lì che vengono le sfere e i palloncini.

```interattivo
% nome: orbitale-1s-mappa-probabilita
% alt: L'orbitale 1s dell'atomo di idrogeno disegnato a puntini in un piano che passa per il nucleo. I puntini sono fittissimi vicino al nucleo, al centro, e si diradano in tutte le direzioni allo stesso modo, senza un bordo netto. Una barra dà la scala in picometri
```

```ad-warning
Orbitale non vuol dire orbita
Un'orbita è una strada, come quella di un pianeta. Un orbitale non dice che strada fa l'elettrone, e nemmeno se gira: dice solo dove è probabile trovarlo. I puntini della figura non sono tanti elettroni, e non sono le tappe di un percorso: tutti insieme descrivono un solo elettrone.
```

```ad-note
Dove si trova più spesso l'elettrone dell'1s
I puntini sono più fitti sul nucleo, ma vicino al nucleo c'è pochissimo spazio. Se conti i puntini a ogni distanza, il maggior numero sta a $52{,}9\,\text{pm}$ dal nucleo: è la distanza più probabile, e si chiama raggio di Bohr.
```

## I nodi radiali: gusci uno dentro l'altro

Lo stato con meno energia non ha nodi. Si chiama $1s$, ed è la nuvola della figura precedente. Lo stato successivo deve avere un nodo, cioè una superficie su cui la funzione d'onda vale zero e l'elettrone non si trova mai.

Il modo più semplice di mettere un nodo attorno a un nucleo è una sfera. Allontanandoti dal nucleo la probabilità cresce, poi scende a zero sulla sfera, poi torna a crescere: la nuvola è divisa in due gusci, uno dentro l'altro. È l'orbitale $2s$. Con due nodi sferici i gusci sono tre, ed è il $3s$.

```interattivo
% nome: orbitali-s-nodi-radiali
% alt: Gli orbitali 1s, 2s e 3s dell'idrogeno in sezione, da scegliere con un selettore. L'1s è una nuvola unica. Il 2s ha un cerchio tratteggiato, il nodo, che separa un nucleo di puntini rossi da un guscio di puntini blu. Il 3s ha due cerchi tratteggiati e tre gusci di colori alterni
```

Un nodo a forma di sfera si chiama **nodo radiale**, perché lo incontri muovendoti lungo un raggio. I due colori della figura sono i due segni della funzione d'onda, che cambia segno ogni volta che attraversa un nodo, come la corda che da una parte del nodo sale e dall'altra scende. Il segno non cambia la probabilità, che dipende dal quadrato; conterà quando studierai i legami.

```ad-note
Come passa l'elettrone da un guscio all'altro?
Non passa. La domanda viene dal pensare all'elettrone come a una pallina che si sposta, mentre la nuvola intera, con i suoi due gusci, è un unico stato dell'elettrone. Anche la corda della chitarra vibra da tutte e due le parti del nodo senza che niente lo attraversi.
```

## Un nodo può essere un piano: gli orbitali p

Una sfera non è l'unica superficie possibile. Un nodo può essere anche un piano che passa per il nucleo e taglia la nuvola a metà. Su quel piano l'elettrone non si trova mai, e la probabilità si raccoglie in due lobi, uno per parte.

```interattivo
% nome: orbitale-2p-nodo-angolare
% alt: Gli orbitali 2s e 2p dell'idrogeno in sezione, da scegliere con un selettore. Nel 2s il nodo è un cerchio tratteggiato attorno al nucleo. Nel 2p il nodo è una linea orizzontale tratteggiata che passa per il nucleo, con un lobo di puntini rossi sopra e un lobo di puntini blu sotto
```

Un nodo di questo tipo si chiama **nodo angolare**, perché lo incontri girando attorno al nucleo e non allontanandoti. Il $2s$ e il $2p$ hanno tutti e due un solo nodo, e nell'idrogeno hanno la stessa energia; cambia la forma, perché cambia il tipo di nodo.

Un piano per il nucleo si può mettere in tre modi tra loro perpendicolari, uno per ogni asse. Per questo gli orbitali $2p$ sono tre, con la stessa forma e direzioni diverse: $2p_x$, $2p_y$ e $2p_z$, dal nome dell'asse lungo cui stanno i lobi.

```interattivo
% nome: orbitali-2p-tre-direzioni
% alt: I tre orbitali 2p dell'idrogeno come nuvole di punti in tre dimensioni, da scegliere con un selettore e da ruotare trascinando. Ognuno ha due lobi, uno rosso e uno blu, lungo l'asse x, lungo l'asse y o lungo l'asse z verticale. Una casella mostra il piano del nodo tra i due lobi
```

Un piano inclinato non dà un quarto orbitale: quello che si ottiene è una combinazione dei tre, come una freccia in una direzione qualunque è una combinazione delle tre direzioni dello spazio.

## Due nodi angolari: gli orbitali d

Con due nodi le possibilità sono tre. Due nodi radiali danno il $3s$, che hai già visto. Un nodo radiale e uno angolare danno un orbitale $p$ con un guscio in più, il $3p$. Due nodi angolari danno una forma nuova: due piani perpendicolari dividono la nuvola in quattro lobi. Sono gli orbitali $d$.

```interattivo
% nome: orbitali-3d-cinque-forme
% alt: I cinque orbitali 3d dell'idrogeno come nuvole di punti in tre dimensioni, da scegliere con un selettore e da ruotare. Quattro hanno quattro lobi di colori alterni, disposti in piani diversi. Il quinto ha due lobi lungo l'asse verticale e un anello attorno. Una casella mostra i due nodi di ogni orbitale
```

Gli orbitali $d$ sono cinque. Quattro hanno i quattro lobi che ti aspetti; il quinto, $d_{z^2}$, ha due lobi e un anello, perché i suoi due nodi sono due coni invece di due piani. Che i modi indipendenti di disporre due nodi angolari siano proprio cinque non si vede a occhio: esce dai conti, e la regola è nella prossima sezione.

## I tre numeri quantici

Per dire in quale orbitale si trova un elettrone servono tre numeri interi, i **numeri quantici**. Adesso che conosci i nodi, ognuno ha un significato che si vede.

Il **numero quantico principale** $n$ vale $1, 2, 3, \dots$ e indica il livello di energia. Un orbitale del livello $n$ ha in tutto $n - 1$ nodi. Più grande è $n$, più energia ha l'elettrone e più lontano dal nucleo si trova.

Il **numero quantico secondario** $l$ è il numero di nodi angolari, e decide la forma dell'orbitale. Poiché i nodi sono in tutto $n - 1$, $l$ può valere da $0$ a $n - 1$. Ogni valore ha una lettera:

| $l$ | Nodi angolari | Lettera | Forma |
|---|---|---|---|
| $0$ | nessuno | $s$ | sfera |
| $1$ | uno | $p$ | due lobi |
| $2$ | due | $d$ | quattro lobi, oppure due lobi e un anello |
| $3$ | tre | $f$ | forme con più lobi |

Il **numero quantico magnetico** $m_l$ indica l'orientazione dell'orbitale nello spazio. Può valere tutti gli interi da $-l$ a $+l$, zero compreso: sono $2l + 1$ valori, e quindi $2l + 1$ orbitali con la stessa forma.

$$l = 0, 1, \dots, n - 1 \qquad\qquad m_l = -l, \dots, 0, \dots, +l$$

Il nome di un orbitale si scrive con il numero $n$ seguito dalla lettera di $l$: $n = 3$ e $l = 2$ è un orbitale $3d$. Gli orbitali con lo stesso $n$ e lo stesso $l$ formano un **sottolivello**.

| Livello $n$ | Valori di $l$ | Sottolivelli | Orbitali per sottolivello | Orbitali nel livello |
|---|---|---|---|---|
| $1$ | $0$ | $1s$ | $1$ | $1$ |
| $2$ | $0, 1$ | $2s$, $2p$ | $1, 3$ | $4$ |
| $3$ | $0, 1, 2$ | $3s$, $3p$, $3d$ | $1, 3, 5$ | $9$ |
| $4$ | $0, 1, 2, 3$ | $4s$, $4p$, $4d$, $4f$ | $1, 3, 5, 7$ | $16$ |

Il livello $n$ ha $n$ sottolivelli e $n^2$ orbitali.

```ad-example
Esempio 1: gli orbitali del terzo livello
Con $n = 3$, $l$ può valere $0$, $1$ e $2$: i sottolivelli sono $3s$, $3p$ e $3d$.

Per $l = 0$ c'è solo $m_l = 0$: un orbitale $3s$.

Per $l = 1$ ci sono $m_l = -1, 0, +1$: tre orbitali $3p$.

Per $l = 2$ ci sono $m_l = -2, -1, 0, +1, +2$: cinque orbitali $3d$.

In tutto $1 + 3 + 5 = 9$ orbitali, cioè $3^2$.
```

```ad-example
Esempio 2: una terna che non esiste
La terna $n = 2$, $l = 2$, $m_l = 0$ indica un orbitale?

No. Con $n = 2$ i nodi sono in tutto $n - 1 = 1$, e $l = 2$ ne chiederebbe due angolari. Il valore più grande di $l$ è $n - 1 = 1$: l'orbitale $2d$ non esiste.
```

```ad-example
Esempio 3: i nodi di un orbitale 4p
Un orbitale $4p$ ha $n = 4$ e $l = 1$.

I nodi sono in tutto $n - 1 = 3$. Quelli angolari sono $l = 1$, quindi quelli radiali sono $3 - 1 = 2$.

Un orbitale $4p$ ha due lobi, come ogni $p$, e ogni lobo è diviso in tre gusci da due nodi sferici.
```

```ad-warning
$l$ si ferma a $n - 1$, e $m_l$ comprende lo zero
I due errori più comuni sono contare $l$ fino a $n$ e dimenticare lo zero tra i valori di $m_l$. Nel secondo livello non ci sono orbitali $d$; un sottolivello $p$ ha tre orbitali, non due.
```

## Più energia, più spazio

Un elettrone con più energia è trattenuto meno dal nucleo e si trova in media più lontano. Qui gli orbitali $s$ dei primi quattro livelli sono disegnati tutti alla stessa scala, aperti per mostrare i gusci.

```interattivo
% nome: orbitali-livelli-stessa-scala
% alt: Gli orbitali 1s, 2s, 3s e 4s dell'idrogeno disegnati alla stessa scala come nuvole di punti in tre dimensioni, con un ottavo tolto per vedere i gusci interni. L'1s è un puntino al centro del riquadro, il 4s lo riempie quasi tutto. Una barra dà la scala
```

La distanza media dal nucleo cresce circa come $n^2$: da $79\,\text{pm}$ per l'$1s$ a $1270\,\text{pm}$ per il $4s$.

## Il quarto numero: lo spin

L'elettrone ha anche una proprietà che non riguarda la sua posizione, lo **spin**, descritta dal numero quantico $m_s$, che può valere solo $+\frac{1}{2}$ o $-\frac{1}{2}$. I primi tre numeri dicono l'orbitale; il quarto distingue i due elettroni che lo stesso orbitale può ospitare.

Il **principio di esclusione di Pauli** dice che in un atomo non ci sono due elettroni con gli stessi quattro numeri quantici. Quindi in un orbitale stanno al massimo due elettroni, con spin opposto. Un sottolivello con $2l + 1$ orbitali ne contiene al massimo $2(2l + 1)$, e il livello $n$ al massimo $2n^2$.

| Sottolivello | Orbitali | Elettroni al massimo |
|---|---|---|
| $s$ | $1$ | $2$ |
| $p$ | $3$ | $6$ |
| $d$ | $5$ | $10$ |
| $f$ | $7$ | $14$ |

```ad-example
Esempio 4: quanti elettroni nel terzo livello
Il terzo livello ha $3^2 = 9$ orbitali, e ognuno contiene al massimo due elettroni: $2 \cdot 9 = 18$ elettroni.

Lo stesso conto per sottolivelli: $2$ nel $3s$, $6$ nel $3p$, $10$ nel $3d$, in tutto $18$.
```

## Un solo elettrone, tanti orbitali

L'idrogeno ha un solo elettrone, eppure hai visto orbitali fino al $4s$. Un orbitale è uno stato in cui l'elettrone può trovarsi, non qualcosa che l'atomo possiede: gli stati possibili sono infiniti, e l'elettrone ne occupa uno alla volta.

Di solito l'elettrone dell'idrogeno sta nell'$1s$, lo stato con meno energia, che si chiama **stato fondamentale**. Se l'atomo riceve energia, per esempio da una scarica elettrica, l'elettrone passa a un orbitale di un livello più alto, uno **stato eccitato**. Ci resta pochissimo: torna verso il basso ed emette la differenza di energia come luce. Le righe colorate dello spettro dell'idrogeno sono questi salti.

Negli atomi con più elettroni gli orbitali occupati sono molti contemporaneamente, perché in ognuno ne stanno al massimo due. Le forme restano quelle dell'idrogeno, con dimensioni diverse, e sono un'approssimazione, perché gli elettroni si respingono tra loro.

## Approfondimento: gli orbitali in moto

Gli orbitali dei libri stanno fermi. Esiste però un altro modo di scegliere gli orbitali di uno stesso sottolivello, in cui ognuno ha un valore preciso di $m_l$. In questi stati la nuvola non cambia forma, ma la probabilità circola attorno all'asse $z$, come l'acqua di un vortice.

```interattivo
% nome: orbitali-2p-in-moto
% alt: I tre stati del sottolivello 2p con un valore preciso del numero quantico magnetico, come nuvole di punti in tre dimensioni. Con m uguale a più uno la nuvola è una ciambella i cui puntini girano attorno all'asse verticale in senso antiorario; con m uguale a meno uno girano in senso orario; con m uguale a zero la nuvola ha due lobi e i puntini sono fermi. Un bottone ferma il moto
```

La densità dei puntini dice dove è probabile trovare l'elettrone; la loro velocità dice come scorre quella probabilità. Questo scorrere è il momento angolare dell'elettrone attorno all'asse, che vale $m_l$ volte una quantità fissa: ogni puntino ne porta la stessa parte, e per questo quelli vicini all'asse girano più svelti. Il segno di $m_l$ dà il verso, e con $m_l = 0$ non gira niente.

Una carica che circola è una piccola corrente, e una corrente si comporta come una calamita: da qui il nome di numero quantico magnetico. La velocità dei puntini non è la velocità che misureresti sull'elettrone. Gli orbitali $2p_x$ e $2p_y$ dei libri si ottengono sommando in parti uguali i due versi di rotazione, $m_l = +1$ e $m_l = -1$: le due correnti si annullano, e resta una nuvola ferma con due lobi. L'orbitale $2p_z$ è lo stato con $m_l = 0$.

## Esplora gli orbitali

Qui puoi scegliere tu l'orbitale, fino al settimo livello: dalla tabella dei sottolivelli, quella dello schema della configurazione elettronica, dove ogni casella è un orbitale, oppure con i valori di $n$, $l$ e $m_l$. Puoi guardare la nuvola o una sua sezione, accendere i nodi e contarli. Se scegli un elemento, le caselle si riempiono con i suoi elettroni, disegnati come frecce: è la sua configurazione elettronica, l'argomento della prossima lezione.

```interattivo
% nome: orbitali-esplora
% alt: Un visualizzatore degli orbitali dell'atomo di idrogeno. Sotto la figura c'è la tabella dei sottolivelli da 1s a 7p, con una casella per ogni orbitale: un clic su una casella mostra quell'orbitale. Scegliendo un elemento le caselle si riempiono con i suoi elettroni, una o due frecce per casella, e una casella mostra la regola della diagonale con l'ordine di riempimento dei sottolivelli. In alternativa si scelgono il livello n da 1 a 7, la forma l e l'orientazione m; la figura è una nuvola di punti in tre dimensioni da ruotare, oppure una sua sezione in un piano. Si possono mostrare i nodi, sezionare la nuvola, mettere tutti i livelli alla stessa scala e vedere gli stati in moto. Accanto si leggono il numero di nodi radiali e angolari
```
