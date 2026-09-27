# Calcolo del pH

## Che cos'è

Il pH è un numero che dice quanto è acida una soluzione: è il logaritmo in base 10 della concentrazione degli ioni $\mathrm{H^+}$, cambiato di segno. Qui e nei libri "log" vuol dire logaritmo in base 10.

$$\mathrm{pH} = -\log\,[\mathrm{H^+}]$$

Le parentesi quadre indicano la concentrazione in mol/L. Alcuni libri scrivono $\mathrm{H_3O^+}$ al posto di $\mathrm{H^+}$: il calcolo è lo stesso. Il pOH si calcola allo stesso modo dagli ioni $\mathrm{OH^-}$.

## Come si calcola a mano

```ad-example
Una soluzione con [H⁺] = 2,5 · 10⁻³ mol/L
Il logaritmo di un prodotto è la somma dei logaritmi, e $\log 10^{-3} = -3$:

$$\begin{aligned}
\mathrm{pH} &= -\log(2{,}5 \cdot 10^{-3}) \\[6pt]
&= -(\log 2{,}5 - 3) \\[6pt]
&\approx -(0{,}40 - 3) \\[6pt]
&\approx 2{,}60
\end{aligned}$$
```

A 25 °C il prodotto ionico dell'acqua è $K_w = [\mathrm{H^+}] \cdot [\mathrm{OH^-}] = 10^{-14}$, quindi pH e pOH sommano sempre 14. Nell'esempio il pOH è $14 - 2{,}60 = 11{,}40$.

Il pH è minore di 7: la soluzione è acida. Con pH 7 è neutra, sopra 7 è basica.

Per un acido forte, come HCl, la concentrazione di $\mathrm{H^+}$ è uguale alla molarità dell'acido, perché l'acido si dissocia del tutto. Per una base forte con due gruppi OH, come $\mathrm{Ca(OH)_2}$, $[\mathrm{OH^-}]$ è il doppio della molarità.

```ad-error
Errori frequenti
- Dimenticare il segno meno: il logaritmo di un numero minore di 1 è negativo, il pH no.
- Calcolare il pH dalla concentrazione di $\mathrm{OH^-}$: da lì viene il pOH, e il pH è $14 - \mathrm{pOH}$.
- Usare 14 a temperature diverse da 25 °C: $K_w$ cambia con la temperatura.
```

## Domande frequenti

### Il pH può essere negativo?

Sì, in soluzioni di acidi forti più concentrate di 1 mol/L: per HCl 2 M il pH è circa $-0{,}30$. Sono casi rari negli esercizi.

### Perché non si può usare per un acido molto diluito?

Sotto $10^{-6}$ mol/L gli ioni $\mathrm{H^+}$ dell'acqua non sono più trascurabili. Un acido $10^{-8}$ M non ha pH 8, che sarebbe basico: il suo pH è appena sotto 7.

### E gli acidi deboli?

Un acido debole si dissocia solo in parte e serve la sua costante $K_a$. Questo strumento calcola gli acidi e le basi forti.
