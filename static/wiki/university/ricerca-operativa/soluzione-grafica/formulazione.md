## 1. Cos'è un Problema di Programmazione Lineare?

Un problema di **Programmazione Lineare (PL)** è un problema di ottimizzazione matematica in cui si cerca di **massimizzare** o **minimizzare** una funzione obiettivo lineare, rispettando una serie di vincoli espressi tramite equazioni o disequazioni lineari.

La forma generale di un problema di massimizzazione è la seguente:

$$
\max z(x) = \sum_{j=1}^{n} p_j x_j
$$

Soggetto a (s.v.):

$$
\sum_{j=1}^{n} a_{ij} x_j \le b_i \quad (i = 1, \dots, m)
$$

$$
x_j \ge 0 \quad (j = 1, \dots, n)
$$

- $x_j$: variabili di decisione del problema.  
- $z(x)$: funzione obiettivo (F.O.).  
- **Vincoli**: condizioni (disequazioni) che le variabili devono soddisfare.  
- I vincoli $x_j \ge 0$ sono detti **vincoli di non-negatività**.

---

## 2. Concetti Geometrici Fondamentali

Per risolvere un problema graficamente, è essenziale comprendere la geometria che sta alla base della PL.

### Iperpiani e Semispazi

Un **iperpiano** è la generalizzazione di un piano in uno spazio a $ \mathbb{R}^n $.  
È l'insieme di tutti i punti che soddisfano una singola equazione lineare:

$$
a^T x = b
$$

- In due dimensioni ($\mathbb{R}^2$), un iperpiano è una **retta**.  
- In tre dimensioni ($\mathbb{R}^3$), è un **piano**.

Un iperpiano divide lo spazio $ \mathbb{R}^n $ in due **semispazi**.  
In $ \mathbb{R}^2 $, una retta divide il piano in due **semipiani**.  
Questi rappresentano le disequazioni lineari dei vincoli:

$$
a^T x \le b \quad \text{oppure} \quad a^T x \ge b
$$

### La Regione Ammissibile (Poliedro)

La **Regione Ammissibile** (o insieme ammissibile) è l'insieme di tutte le soluzioni (i vettori $x$) che soddisfano **tutti i vincoli** del problema, inclusi quelli di non-negatività.

- Geometricamente, la regione ammissibile è un **poliedro**, ovvero l'intersezione di un numero finito di semispazi.
- Un poliedro è sempre un **insieme convesso**.
- Un **politopo** è un poliedro **limitato**, cioè contenuto in una sfera di raggio finito.

### Vertici (o Punti Estremi)

Un **vertice** di un poliedro è un "angolo" o "spigolo" della regione ammissibile.  
Formalmente, è un punto del poliedro che **non può essere espresso** come combinazione convessa di altri due punti del poliedro stesso.

➡️ **Importanza dei vertici**:  
Una proprietà fondamentale della PL afferma che se un problema ammette una soluzione ottima, **esiste almeno un vertice della regione ammissibile che è una soluzione ottima**.

---

## 3. Il Metodo di Risoluzione Grafica

Questo metodo è applicabile solo a problemi con **due variabili di decisione** ($x_1, x_2$), poiché possiamo rappresentarli su un piano cartesiano.

### Passaggi Fondamentali

La procedura consiste in tre passaggi chiave:

#### 1️⃣ Disegnare la Regione Ammissibile
- Si considera il **piano cartesiano**.  
- I vincoli di non-negatività ($x_1 \ge 0$, $x_2 \ge 0$) limitano l’analisi al **primo quadrante**.  
- Per ogni vincolo, si disegna l’iperpiano associato (la retta).  
  - Esempio: per il vincolo $7x_1 + 9x_2 \le 35$, si disegna la retta
    $$
    7x_1 + 9x_2 = 35
    $$
  - Per tracciarla basta individuare due punti (ad esempio ponendo $x_1=0$ e $x_2=0$ a turno).  
- Si identifica il **semispazio corretto** testando un punto (ad esempio l'origine $(0,0)$ se non giace sulla retta).  
- La **regione ammissibile** è l'area che soddisfa **tutti i vincoli contemporaneamente**, ossia l'intersezione dei semispazi.

#### 2️⃣ Rappresentare la Funzione Obiettivo
La funzione obiettivo  
$$
z = p_1 x_1 + p_2 x_2
$$  
può essere rappresentata come un **fascio di rette parallele**, dove ogni retta corrisponde a un diverso valore di $z$ (curve di isolivello).

- Il **gradiente** della funzione obiettivo è il vettore $(p_1, p_2)$ che indica la direzione di massima crescita di $z$.

#### 3️⃣ Trovare la Soluzione Ottima
- Per un problema di **massimizzazione**, si "sposta" la retta della funzione obiettivo **nella direzione del gradiente**.  
  L'ultimo punto (o vertice) della regione ammissibile che la retta tocca è la **soluzione ottima**.
- Per un problema di **minimizzazione**, ci si muove nella direzione **opposta al gradiente** (l'antigradiente).  
  L'ultimo vertice toccato sarà il **punto di minimo**.

Una volta identificato il vertice ottimo $x^\ast$, le sue coordinate $(x_1^\ast, x_2^\ast)$ sono i valori ottimi delle variabili di decisione.  
Il valore ottimo della funzione obiettivo si calcola sostituendo queste coordinate in $z$.

---

## 4. Analisi dei Risultati Possibili

Quando si risolve un problema di PL, si possono verificare quattro casi:

1. **Soluzione Ottima Unica**  
   - Esiste un solo vertice che ottimizza la funzione obiettivo.  
   - 👉 Caso più comune.

2. **Infinite Soluzioni Ottime**  
   - Se la retta della funzione obiettivo è **parallela a un lato** (vincolo) della regione ammissibile, tutti i punti su quel segmento, inclusi i due vertici estremi, sono soluzioni ottime.

3. **Problema Inammissibile**  
   - La regione ammissibile è **vuota**, cioè non esiste nessun punto che soddisfi tutti i vincoli.

4. **Problema Illimitato**  
   - La regione ammissibile non è limitata nella direzione di ottimizzazione.  
   - È possibile trovare soluzioni ammissibili che migliorano il valore della funzione obiettivo **all’infinito**.  
   - 👉 Attenzione: una regione ammissibile illimitata **non implica necessariamente** che il problema sia illimitato; dipende anche dall'orientamento della funzione obiettivo.
