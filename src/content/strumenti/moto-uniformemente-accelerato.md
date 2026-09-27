# Moto uniformemente accelerato

## Che cos'è

Un corpo si muove di moto uniformemente accelerato quando la sua velocità cambia della stessa quantità in tempi uguali, cioè con accelerazione costante.

Un'auto che parte da ferma e ogni secondo guadagna 2 m/s ha un'accelerazione di $2\ \text{m/s}^2$. Anche un sasso che cade, se si trascura l'aria, si muove così, con l'accelerazione di gravità.

## Le tre formule

Con $v_0$ la velocità iniziale, $v$ quella finale, $a$ l'accelerazione, $t$ il tempo e $s$ lo spazio percorso dalla partenza:

$$\begin{aligned}
v &= v_0 + a t \\[6pt]
s &= v_0 t + \tfrac{1}{2} a t^2 \\[6pt]
v^2 &= v_0^2 + 2 a s
\end{aligned}$$

Ogni formula lega quattro grandezze. Scegli quella che contiene le tre che conosci e quella che cerchi. La terza formula è comoda quando il tempo non compare nel problema, come nelle frenate.

## Come si calcola a mano

```ad-example
Lo spazio di frenata
Un'auto va a 90 km/h e frena con accelerazione $-5\ \text{m/s}^2$ fino a fermarsi. Porta la velocità in m/s: $90 : 3{,}6 = 25\ \text{m/s}$. Poi usa la terza formula con $v = 0$:

$$\begin{aligned}
s &= \dfrac{v^2 - v_0^2}{2 a} \\[6pt]
&= \dfrac{0 - 625\ \text{m}^2/\text{s}^2}{-10\ \text{m/s}^2} \\[6pt]
&= 62{,}5\ \text{m}
\end{aligned}$$
```

Quando il tempo è l'incognita della seconda formula, si ottiene un'equazione di secondo grado in $t$. Delle due soluzioni si tiene quella positiva.

```ad-error
Errori frequenti
- Dimenticare il segno meno dell'accelerazione in frenata: se il corpo rallenta, $a$ è negativa.
- Scrivere $\tfrac{1}{2} a t$ al posto di $\tfrac{1}{2} a t^2$: il tempo va al quadrato.
- Lasciare le velocità in km/h con l'accelerazione in $\text{m/s}^2$.
```

## Domande frequenti

### Perché a volte il tempo ha due soluzioni?

Se il corpo frena, può raggiungere una posizione, fermarsi e tornarci indietro: passa due volte dallo stesso punto. In quel caso lo strumento non sceglie da solo. Calcola prima la velocità finale con la terza formula, poi il tempo con la prima.

### E se la posizione iniziale non è zero?

La legge completa è $s = s_0 + v_0 t + \tfrac{1}{2} a t^2$. Lo strumento calcola lo spazio percorso dalla partenza, cioè $s - s_0$: aggiungi $s_0$ alla fine.
