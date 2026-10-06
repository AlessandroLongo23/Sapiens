# Formulario: Momento torcente e dinamica delle rotazioni

## Momento torcente

$$M = F\,b = r\,F \sin\varphi$$

- $r$: distanza dall'asse del punto di applicazione; $\varphi$: angolo tra $\vec r$ e $\vec F$; $b = r \sin\varphi$ è il braccio.
- Unità: $\text{N} \cdot \text{m}$. Positivo se fa ruotare in senso antiorario, negativo in senso orario.
- Una forza la cui retta d'azione passa per l'asse ha momento nullo.

## Secondo principio per le rotazioni

$$M_{tot} = I\,\alpha \qquad \alpha = \frac{M_{tot}}{I}$$

- $M_{tot}$: somma dei momenti delle forze esterne, con i segni, rispetto all'asse di rotazione.
- $I$: momento d'inerzia rispetto allo stesso asse.
- Se $M_{tot} = 0$ allora $\alpha = 0$: la velocità angolare resta costante (equilibrio, se il corpo è fermo).

| Moto su una retta | Rotazione |
|---|---|
| $F_{tot}$ | $M_{tot}$ |
| $m$ | $I$ |
| $a$ | $\alpha$ |
| $F_{tot} = m\,a$ | $M_{tot} = I\,\alpha$ |

## Carrucola con massa

Filo che non slitta su una carrucola di raggio $R$:

$$a = \alpha\,R$$

Procedimento:

1. Scegli come positivo il verso del moto di ogni corpo.
2. Scrivi $F_{tot} = m\,a$ per ogni corpo appeso.
3. Scrivi $M_{tot} = I\,\alpha$ per la carrucola, con le tensioni come forze tangenti di braccio $R$.
4. Sostituisci $\alpha = a/R$ e risolvi il sistema.

Secchio di massa $m$ appeso a una carrucola a disco di massa $M$:

$$a = \frac{m\,g}{m + \frac{1}{2}M} \qquad T = \frac{1}{2}\,M\,a$$

Macchina di Atwood con carrucola a disco di massa $M$ ($m_2 > m_1$):

$$a = \frac{(m_2 - m_1)\,g}{m_1 + m_2 + \frac{1}{2}M} \qquad T_1 = m_1 (g + a) \qquad T_2 = m_2 (g - a)$$

## Momento come vettore

$$\vec M = \vec r \times \vec F$$

- Modulo $r\,F \sin\varphi$, direzione perpendicolare al piano di $\vec r$ e $\vec F$, verso con la regola della mano destra.
- Nel piano del foglio: uscente ($\odot$) se antiorario, entrante ($\otimes$) se orario.
- Con le componenti: $M_z = r_x F_y - r_y F_x$.

```ad-warning
Stesso asse per momenti e momento d'inerzia
Bracci e momento d'inerzia si calcolano tutti rispetto all'asse di rotazione.
```

```ad-warning
La tensione non è il peso
Su una carrucola con massa agisce la tensione del filo, più piccola del peso del corpo che scende.
```

```ad-warning
Due tensioni diverse
Se il filo passa sopra una carrucola con massa, la tensione è diversa dalle due parti.
```
