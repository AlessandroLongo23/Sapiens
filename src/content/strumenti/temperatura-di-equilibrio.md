# Temperatura di equilibrio

## Che cos'è

La temperatura di equilibrio è la temperatura comune che raggiungono due o più corpi messi a contatto, quando smettono di scambiarsi calore. I corpi caldi cedono calore, quelli freddi lo assorbono, e il calore ceduto è uguale a quello assorbito.

Ogni corpo scambia $Q = m c\, \Delta T$, dove $c$ è il calore specifico: quanti joule servono per scaldare di 1 K un chilogrammo di quella sostanza.

## Come si calcola a mano

```ad-example
250 g di acqua a 20 °C e 150 g di ferro a 95 °C
Scrivi che il calore ceduto dal ferro è uguale a quello assorbito dall'acqua, poi ricava $T_e$.

$$\begin{aligned}
T_e &= \frac{m_1 c_1 T_1 + m_2 c_2 T_2}{m_1 c_1 + m_2 c_2} \\[6pt]
&= \frac{0{,}25 \cdot 4186 \cdot 20 + 0{,}15 \cdot 450 \cdot 95}{0{,}25 \cdot 4186 + 0{,}15 \cdot 450}\ {}^\circ\text{C} \\[6pt]
&= \frac{20\,930 + 6412{,}5}{1046{,}5 + 67{,}5}\ {}^\circ\text{C} \approx 24{,}54\ {}^\circ\text{C}
\end{aligned}$$
```

Con più corpi si aggiungono termini sopra e sotto la frazione: la temperatura di equilibrio è una media delle temperature, pesata con le capacità termiche $m c$. Per questo sta sempre tra la temperatura più bassa e la più alta.

Per controllare, calcola il calore di ogni corpo con $Q = m c\, (T_e - T)$: la somma dei calori positivi (assorbiti) deve essere uguale alla somma dei negativi (ceduti).

```ad-error
Errori frequenti
- Lasciare le masse in grammi con il calore specifico in J/(kg·K).
- Scrivere $\Delta T$ con il segno sbagliato: per chi cede calore $T_e - T$ è negativo.
- Dimenticare il recipiente: in un calorimetro anche il contenitore assorbe calore, e va messo come un corpo in più.
- Usare questa formula quando il ghiaccio fonde o l'acqua bolle.
```

## Domande frequenti

### Posso usare i gradi Celsius invece dei kelvin?

Sì. Nella formula entrano solo differenze di temperatura, e una differenza di 1 °C è una differenza di 1 K. Anche il risultato esce in gradi Celsius.

### E se c'è del ghiaccio che fonde?

Allora una parte del calore serve a cambiare stato, e nel bilancio entra il calore latente di fusione. Lo strumento se ne accorge e non fa il calcolo.

### Da dove vengono i calori specifici?

Sono i valori arrotondati delle tabelle dei libri, a temperatura ambiente. Se il tuo libro ne usa di diversi, scegli "Altro" e scrivi il suo valore.
