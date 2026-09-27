# Conversione di pressione: Pa, bar, atm, mmHg e psi

## Che cos'è

La pressione è una forza divisa per la superficie su cui preme. Nel Sistema Internazionale si misura in pascal (Pa): un pascal è un newton su un metro quadrato. È un'unità piccola, per questo si usano spesso i suoi multipli e altre unità.

Per esempio, la pressione dell'aria al livello del mare è di circa un'atmosfera:

$$1\ \text{atm} = 101\,325\ \text{Pa} = 1013{,}25\ \text{hPa} = 760\ \text{mmHg}$$

## Come si calcola a mano

```ad-example
Esempio: 2,5 bar in atmosfere
Un'atmosfera vale 101 325 pascal e un bar 100 000 pascal, quindi:

$$1\ \text{atm} = 1{,}01325\ \text{bar}$$

Da bar ad atm dividi per 1,01325:

$$2{,}5 : 1{,}01325 \approx 2{,}467$$
```

Queste sono le equivalenze da cui partire. Sono tutte esatte per definizione, tranne l'ultima:

$$\begin{aligned}
1\ \text{hPa} &= 100\ \text{Pa} = 1\ \text{mbar} \\[6pt]
1\ \text{bar} &= 100\,000\ \text{Pa} \\[6pt]
1\ \text{atm} &= 101\,325\ \text{Pa} = 760\ \text{mmHg} \\[6pt]
1\ \text{psi} &\approx 6894{,}76\ \text{Pa}
\end{aligned}$$

Le previsioni del tempo usano gli ettopascal, uguali ai millibar. I millimetri di mercurio (mmHg) vengono dall'esperimento di Torricelli del 1644: l'aria sostiene una colonna di mercurio alta 760 millimetri. Si usano ancora per la pressione del sangue.

Il psi è una libbra-forza su un pollice quadrato, e si trova sui manometri per le gomme.

```ad-example
Esempio: 750 mmHg in ettopascal
Da mmHg a hPa il fattore non è un decimale esatto: passa per le atmosfere.

$$\begin{aligned}
750 : 760 &\approx 0{,}9868\ \text{atm} \\[6pt]
0{,}9868 \cdot 1013{,}25 &\approx 999{,}9\ \text{hPa}
\end{aligned}$$
```

```ad-error
Errori frequenti
- Considerare uguali bar e atmosfera: sono vicini, ma 1 atm vale 1,01325 bar.
- Dimenticare che 1 hPa è 100 Pa, non 1000.
- Moltiplicare invece di dividere: passando a un'unità più grande il numero diventa più piccolo.
```

## Domande frequenti

### Quanti bar sono 32 psi?

Circa 2,2 bar, la pressione tipica delle gomme di un'auto:

$$32 : 14{,}50377 \approx 2{,}206$$

### Perché la pressione del sangue si misura in mmHg?

I primi strumenti per misurarla, gli sfigmomanometri, avevano una colonna di mercurio. L'unità è rimasta anche negli strumenti elettronici: 120 mmHg sono circa 160 hPa.
