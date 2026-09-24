# Funzioni iniettive, suriettive e biettive

## Perché classificare le funzioni: il problema dell'invertibilità

Se conosco il risultato di una funzione, posso sempre scoprire quale input l'ha generato? E se sì, in un solo modo, o potrebbe esserci ambiguità?

Queste due domande, apparentemente semplici, nascondono una distinzione profonda che attraversa tutta la matematica. Proviamo a rispondere con un esempio concreto.

Supponiamo di conoscere la temperatura di una città espressa in gradi Fahrenheit: possiamo sempre risalire alla temperatura in gradi Celsius, in modo univoco, applicando la formula inversa. La conversione è **reversibile senza ambiguità**. Ora consideriamo invece una funzione diversa: quella che, dato un punto nello spazio tridimensionale, restituisce la sua proiezione su un piano. Se conosco la proiezione, posso risalire al punto originale? No — infiniti punti diversi, posti alla stessa altezza ma in posizioni verticali diverse, producono la stessa proiezione. L'informazione sulla quota è andata **perduta**.

Questi due esempi mostrano che le funzioni non si comportano tutte allo stesso modo quando proviamo a "tornare indietro". Alcune conservano tutta l'informazione sull'input; altre ne perdono una parte; altre ancora non coprono nemmeno tutti i possibili output. Per descrivere con precisione questi comportamenti, la matematica ha introdotto tre classificazioni fondamentali: **iniettività**, **suriettività** e **biettività**.

La domanda che guiderà l'intera lezione è dunque: *quando una funzione può essere invertita, e in che senso?*

---

## Funzioni iniettive: quando input diversi danno output diversi

### L'idea intuitiva: il test della retta orizzontale

Consideriamo il grafico di una funzione $f$. Tracciamo una retta orizzontale qualsiasi, ad esempio $y = k$. Quante volte questa retta interseca il grafico?

- Se la retta interseca il grafico **al più una volta** per ogni valore di $k$, allora a ogni output corrisponde **al più un** input. La funzione non "confonde" due input diversi producendo lo stesso output.
- Se invece la retta interseca il grafico **più di una volta**, esistono almeno due valori $x_1 \neq x_2$ tali che $f(x_1) = f(x_2)$: la funzione ha "collassato" due input distinti in un unico output, perdendo informazione.

Questo strumento visivo si chiama **test della retta orizzontale** ed è il modo più immediato per intuire l'iniettività. Attenzione, però: si tratta di uno strumento grafico, non di una definizione. La definizione formale è la seguente.

> [!definition] Definizione
> Una funzione $f: A \to B$ è **iniettiva** se per ogni $x_1, x_2 \in A$,
> $$f(x_1) = f(x_2) \implies x_1 = x_2.$$
> Equivalentemente, $x_1 \neq x_2 \implies f(x_1) \neq f(x_2)$.

Le due formulazioni sono logicamente equivalenti (una è la contronominale dell'altra), ma la seconda rende l'intuizione ancora più trasparente: **input distinti producono output distinti**. Una funzione iniettiva non "collassa" mai due elementi del dominio in uno stesso elemento del codominio.

*\* immagine: due grafici affiancati — a sinistra, $f(x) = 2x+1$ con rette orizzontali che intersecano il grafico esattamente una volta ciascuna; a destra, $f(x) = x^2$ con una retta orizzontale $y = 4$ che interseca il grafico in due punti, $x = 2$ e $x = -2$ \**

### Esempi risolti

**Esempio 1: $f(x) = 2x + 1$ su $\mathbb{R}$.**
Supponiamo $f(x_1) = f(x_2)$, cioè $2x_1 + 1 = 2x_2 + 1$. Sottraendo $1$ da entrambi i membri e dividendo per $2$, otteniamo $x_1 = x_2$. La funzione è **iniettiva**.

**Esempio 2: $f(x) = x^2$ su $\mathbb{R}$.**
Notiamo che $f(2) = 4 = f(-2)$, ma $2 \neq -2$. Abbiamo trovato due input distinti con lo stesso output: la funzione **non è iniettiva** su $\mathbb{R}$.

**Esempio 3: $f(x) = x^2$ su $[0, +\infty)$.**
Riducendo il dominio ai soli reali non negativi, se $f(x_1) = f(x_2)$ allora $x_1^2 = x_2^2$, e poiché entrambi sono non negativi, necessariamente $x_1 = x_2$. La funzione **è iniettiva** su $[0, +\infty)$.

Questo terzo esempio ci insegna qualcosa di importante: **l'iniettività dipende dal dominio**. La stessa formula può essere iniettiva o non iniettiva a seconda dell'insieme su cui è definita.

> **Errore comune.** Molti studenti confondono "iniettiva" con "monotona". Una funzione iniettiva non deve necessariamente essere crescente o decrescente: deve solo garantire che input diversi diano output diversi. La funzione $f(x) = x^3$ è iniettiva su $\mathbb{R}$ ed è anche strettamente crescente, ma in generale le due proprietà sono indipendenti.

---

## Funzioni suriettive: quando ogni elemento del codominio è raggiunto

### Il ruolo cruciale del codominio

Finora ci siamo concentrati sul dominio: quanti input producono lo stesso output? Ora spostiamo l'attenzione sul **codominio**: tutti gli elementi di $B$ vengono effettivamente "raggiunti" dalla funzione?

Ricordiamo una distinzione fondamentale che spesso genera confusione: l'**immagine** di $f$ è l'insieme di tutti i valori che $f$ assume effettivamente, cioè $\{f(x) \mid x \in A\}$; il **codominio** $B$ è l'insieme in cui dichiariamo che i valori cadono, e può essere più grande dell'immagine. Una funzione è suriettiva quando queste due cose coincidono.

> [!definition] Definizione
> Una funzione $f: A \to B$ è **suriettiva** se per ogni $y \in B$ esiste almeno un $x \in A$ tale che $f(x) = y$.
> In altre parole, l'immagine di $f$ coincide con il codominio $B$:
> $$\mathrm{Im}(f) = B.$$

*\* immagine: due diagrammi di Venn con frecce — a sinistra, una funzione suriettiva in cui ogni elemento di $B$ riceve almeno una freccia; a destra, una funzione non suriettiva in cui alcuni elementi di $B$ rimangono "orfani", senza frecce che li raggiungano \**

### Esempi risolti

**Esempio 1: $f(x) = x^2$ da $\mathbb{R}$ a $\mathbb{R}$.**
Il valore $y = -1$ non è mai raggiunto, perché $x^2 \geq 0$ per ogni $x \in \mathbb{R}$. Dunque la funzione **non è suriettiva** con codominio $\mathbb{R}$.

**Esempio 2: $f(x) = x^2$ da $\mathbb{R}$ a $[0, +\infty)$.**
Cambiando il codominio in $[0, +\infty)$, ogni $y \geq 0$ è raggiunto: basta prendere $x = \sqrt{y}$. La funzione **è suriettiva** con questo codominio.

**Esempio 3: $f(x) = 2x + 1$ da $\mathbb{R}$ a $\mathbb{R}$.**
Dato un qualsiasi $y \in \mathbb{R}$, vogliamo trovare $x$ tale che $2x + 1 = y$. Risolvendo, $x = \frac{y - 1}{2}$, che esiste sempre in $\mathbb{R}$. La funzione **è suriettiva**.

Il secondo esempio è particolarmente istruttivo: **la suriettività non è una proprietà intrinseca della formula**, ma dipende dalla scelta del codominio $B$. Riducendo $B$ all'immagine effettiva di $f$, qualsiasi funzione diventa suriettiva per definizione. Per questo motivo, quando si parla di suriettività è sempre indispensabile specificare esplicitamente il codominio.

---

## Funzioni biettive: l'equilibrio perfetto tra iniettività e suriettività

### Una corrispondenza uno a uno

Abbiamo visto che l'iniettività garantisce che ogni output provenga **al più** da un input, mentre la suriettività garantisce che ogni output provenga **almeno** da un input. Se una funzione soddisfa entrambe le condizioni simultaneamente, ogni elemento del codominio è raggiunto **esattamente una volta**: si stabilisce una corrispondenza perfetta, biunivoca, tra dominio e codominio.

> [!definition] Definizione
> Una funzione $f: A \to B$ è **biettiva** se è sia iniettiva che suriettiva.
> Equivalentemente, per ogni $y \in B$ esiste **uno e un solo** $x \in A$ tale che $f(x) = y$.

*\* immagine: due diagrammi affiancati — a sinistra, una funzione biettiva $f: A \to B$ con frecce che formano un abbinamento perfetto; a destra, la funzione inversa $f^{-1}: B \to A$ con le stesse frecce invertite \**

### Biettività e invertibilità

La biettività è esattamente la condizione che rende una funzione **invertibile**. Vediamo perché in modo intuitivo.

- Se $f$ non è iniettiva, esistono $x_1 \neq x_2$ con $f(x_1) = f(x_2) = y$. Quando proviamo a definire $f^{-1}(y)$, non sappiamo se scegliere $x_1$ o $x_2$: l'inversa non è ben definita.
- Se $f$ non è suriettiva, esiste un $y \in B$ non raggiunto da alcun $x$. L'espressione $f^{-1}(y)$ sarebbe priva di significato.

Solo quando $f$ è biettiva possiamo definire senza ambiguità la **funzione inversa** $f^{-1}: B \to A$, che a ogni $y \in B$ associa l'unico $x \in A$ tale che $f(x) = y$.

**Esempio: $f(x) = 2x + 1$ da $\mathbb{R}$ a $\mathbb{R}$.**
Abbiamo già verificato che questa funzione è sia iniettiva che suriettiva, dunque è biettiva. Per trovare l'inversa, risolviamo $y = 2x + 1$ rispetto a $x$:
$$x = \frac{y - 1}{2}.$$
Quindi $f^{-1}(x) = \dfrac{x - 1}{2}$. Notiamo che il dominio di $f^{-1}$ è $\mathbb{R}$, che coincide con il codominio di $f$.

### Ulteriori esempi

| Funzione | Dominio → Codominio | Iniettiva? | Suriettiva? | Biettiva? |
|---|---|---|---|---|
| $f(x) = 2x+1$ | $\mathbb{R} \to \mathbb{R}$ | Sì | Sì | **Sì** |
| $f(x) = x^3$ | $\mathbb{R} \to \mathbb{R}$ | Sì | Sì | **Sì** |
| $f(x) = x^2$ | $\mathbb{R} \to \mathbb{R}$ | No | No | No |
| $f(x) = x^2$ | $[0,+\infty) \to [0,+\infty)$ | Sì | Sì | **Sì** |

---

## Strategie per verificare iniettività, suriettività e biettività

Disponiamo ora di un metodo sistematico per classificare qualsiasi funzione. Presentiamo un **algoritmo in tre passi**.

**Passo 1 — Analisi grafica (iniettività).**
Traccia il grafico di $f$ e applica il test della retta orizzontale. Se ogni retta orizzontale interseca il grafico al più una volta, la funzione è iniettiva.

**Passo 2 — Verifica algebrica dell'iniettività.**
Supponi $f(x_1) = f(x_2)$ e dimostra che necessariamente $x_1 = x_2$. Se riesci a trovare un controesempio con $x_1 \neq x_2$ ma $f(x_1) = f(x_2)$, la funzione non è iniettiva.

**Passo 3 — Verifica della suriettività.**
Prendi un generico $y \in B$ e risolvi l'equazione $f(x) = y$ rispetto a $x$. Se la soluzione esiste sempre (e appartiene ad $A$), la funzione è suriettiva.

Applichiamo questo algoritmo a quattro funzioni significative.

**$f(x) = 3x - 2$, da $\mathbb{R}$ a $\mathbb{R}$.**
- Iniettività: $3x_1 - 2 = 3x_2 - 2 \implies x_1 = x_2$. ✓
- Suriettività: $y = 3x - 2 \implies x = \dfrac{y+2}{3} \in \mathbb{R}$ per ogni $y$. ✓
- Conclusione: **biettiva**.

**$f(x) = |x|$, da $\mathbb{R}$ a $\mathbb{R}$.**
- Iniettività: $f(1) = 1 = f(-1)$, ma $1 \neq -1$. ✗
- Suriettività: $y = -1$ non è raggiunto. ✗
- Conclusione: **né iniettiva né suriettiva**.

**$f(x) = e^x$, da $\mathbb{R}$ a $\mathbb{R}$.**
- Iniettività: $e^{x_1} = e^{x_2} \implies x_1 = x_2$ (l'esponenziale è strettamente crescente). ✓
- Suriettività: $y = -1$ non è raggiunto, poiché $