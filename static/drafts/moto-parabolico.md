---

# Moto Parabolico

## 1. Definizione
Il **moto parabolico** è un tipo di moto bidimensionale in cui un oggetto si muove lungo una traiettoria curva sotto l'influenza della gravità. La traiettoria descritta è una **parabola**.

Questo tipo di moto è una combinazione di due moti indipendenti:
- **Moto rettilineo uniforme** (in orizzontale).
- **Moto uniformemente accelerato** (in verticale) a causa della gravità.

---

## 2. Obiettivo
Determinare le caratteristiche del moto, come il tempo di volo, l'altezza massima raggiunta e la gittata orizzontale, date le condizioni iniziali come la velocità iniziale e l'angolo di lancio.

---

## 3. Equazioni del Moto Parabolico

Per analizzare il moto parabolico, consideriamo un oggetto lanciato con una velocità iniziale $v_0$ ad un angolo $\theta$ rispetto all'orizzontale. Le equazioni del moto sono:

### a. Componenti della velocità iniziale
La velocità iniziale $v_0$ viene scomposta in due componenti:
- Velocità orizzontale: $v_{0x} = v_0 \cos(\theta)$
- Velocità verticale: $v_{0y} = v_0 \sin(\theta)$

### b. Equazioni del moto
1. **Posizione orizzontale ($x(t)$):**

   Il moto orizzontale è uniforme, quindi:
   $$
   x(t) = v_{0x} t = v_0 \cos(\theta) t
   $$

2. **Posizione verticale ($y(t)$):**

   Il moto verticale è uniformemente accelerato, quindi:
   $$
   y(t) = v_{0y} t - \frac{1}{2} g t^2 = v_0 \sin(\theta) t - \frac{1}{2} g t^2
   $$

   dove $g$ è l'accelerazione di gravità (circa $9.81 \, \text{m/s}^2$).

---

## 4. Caratteristiche del Moto

### a. Tempo totale di volo ($T$)
Il tempo totale di volo è il tempo impiegato dall'oggetto per tornare al livello iniziale ($y=0$):
$$
T = \frac{2 v_0 \sin(\theta)}{g}
$$

### b. Altezza massima ($H$)
L'altezza massima è il punto più alto raggiunto dall'oggetto:
$$
H = \frac{v_0^2 \sin^2(\theta)}{2g}
$$

### c. Gittata orizzontale ($R$)
La gittata orizzontale è la distanza totale percorsa orizzontalmente:
$$
R = \frac{v_0^2 \sin(2\theta)}{g}
$$

---

## 5. Esempi Svolti

### Esempio 1: Calcolo della Gittata e dell'Altezza Massima
Supponiamo un oggetto lanciato con una velocità iniziale di $50 \, \text{m/s}$ ad un angolo di $30^\circ$ rispetto all'orizzontale.

1. **Componenti della velocità:**
   $$
   v_{0x} = 50 \cos(30^\circ) = 50 \cdot \frac{\sqrt{3}}{2} \approx 43.3 \, \text{m/s}
   $$
   $$
   v_{0y} = 50 \sin(30^\circ) = 50 \cdot \frac{1}{2} = 25 \, \text{m/s}
   $$

2. **Tempo di volo:**
   $$
   T = \frac{2 \cdot 25}{9.81} \approx 5.10 \, \text{s}
   $$

3. **Altezza massima:**
   $$
   H = \frac{25^2}{2 \cdot 9.81} \approx 31.9 \, \text{m}
   $$

4. **Gittata orizzontale:**
   $$
   R = \frac{50^2 \cdot \sin(60^\circ)}{9.81} \approx 221.4 \, \text{m}
   $$

**Risultati:** La gittata orizzontale è di circa $221.4 \, \text{m}$ e l'altezza massima è di circa $31.9 \, \text{m}$.

---

## 6. Applicazioni
Il moto parabolico ha numerose applicazioni pratiche tra cui:
- **Sport:** La traiettoria di una palla da calcio o baseball.
- **Ingegneria:** Il lancio di proiettili o missili.
- **Intrattenimento:** Gli effetti visivi nei film per simulare il movimento di oggetti.

---

## 7. Consigli Utili
- La resistenza dell'aria è spesso trascurata per semplificare i calcoli, ma in applicazioni reali può avere un impatto significativo.
- L'angolo di lancio che massimizza la gittata è $45^\circ$ in assenza di resistenza dell'aria.
- Verifica sempre le unità di misura per garantire la coerenza nei calcoli.

---

## Riassunto
1. Decomponi la velocità iniziale nelle sue componenti orizzontale e verticale.
2. Usa le equazioni del moto per determinare posizione e velocità nel tempo.
3. Calcola le caratteristiche principali del moto: tempo di volo, altezza massima e gittata.
4. Considera le applicazioni pratiche e le approssimazioni fatte (come trascurare la resistenza dell'aria).

---