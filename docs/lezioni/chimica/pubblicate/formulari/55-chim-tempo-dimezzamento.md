# Formulario: Il tempo di dimezzamento

## Il tempo di dimezzamento

- Tempo di dimezzamento $t_{1/2}$: il tempo in cui decade la metà dei nuclei di un campione di un radioisotopo.
- Non dipende dalla quantità iniziale, dalla temperatura, dalla pressione, dal composto in cui si trova l'atomo.
- Il decadimento di un nucleo è casuale; la legge vale per un numero grande di nuclei.

| Radioisotopo | $t_{1/2}$ |
|---|---|
| uranio-238 | $4{,}5 \cdot 10^9$ anni |
| carbonio-14 | $5730$ anni |
| radio-226 | $1600$ anni |
| cesio-137 | $30$ anni |
| cobalto-60 | $5{,}27$ anni |
| iodio-131 | $8{,}0$ giorni |

## La legge del decadimento

Numero di tempi di dimezzamento trascorsi:

$$n = \frac{t}{t_{1/2}}$$

Nuclei rimasti (lo stesso vale per la massa $m$ del radioisotopo e per l'attività $A$):

$$N = N_0 \cdot \left(\frac{1}{2}\right)^{n} = N_0 \cdot \left(\frac{1}{2}\right)^{t/t_{1/2}}$$

| Tempi di dimezzamento | $1$ | $2$ | $3$ | $4$ | $5$ | $10$ |
|---|---|---|---|---|---|---|
| Frazione rimasta | $\frac{1}{2}$ | $\frac{1}{4}$ | $\frac{1}{8}$ | $\frac{1}{16}$ | $\frac{1}{32}$ | $\frac{1}{1024}$ |
| Percentuale rimasta | $50\%$ | $25\%$ | $12{,}5\%$ | $6{,}25\%$ | $3{,}125\%$ | circa $0{,}1\%$ |

Frazione decaduta: $1 - \dfrac{N}{N_0}$.

## Trovare il tempo

$$n = \log_2 \frac{N_0}{N} \qquad t = t_{1/2} \cdot \log_2 \frac{N_0}{N} \qquad \log_2 x = \frac{\log x}{\log 2}$$

Trovare il tempo di dimezzamento: $t_{1/2} = \dfrac{t}{n}$.

## Come si risolve un problema

1. Trova la frazione rimasta $\dfrac{N}{N_0}$; se il testo dà quella decaduta, sottraila da $1$.
2. Se cerchi la quantità rimasta: calcola $n = \dfrac{t}{t_{1/2}}$, poi $N = N_0 \cdot \left(\frac{1}{2}\right)^n$.
3. Se cerchi il tempo: calcola $n = \log_2 \dfrac{N_0}{N}$, poi $t = n \cdot t_{1/2}$.
4. Controlla con le potenze di $\frac{1}{2}$ tra cui cade il risultato.

## Attività

- Attività $A$: numero di decadimenti al secondo. Unità: becquerel, $1\,\text{Bq} = 1$ decadimento al secondo.

$$A = A_0 \cdot \left(\frac{1}{2}\right)^{t/t_{1/2}} \qquad\qquad A = \frac{0{,}693}{t_{1/2}} \cdot N \quad (t_{1/2}\ \text{in secondi})$$

## Datazione con il carbonio-14

- Un organismo vivo ha una frazione costante di carbonio-14; dopo la morte la frazione si dimezza ogni $5730$ anni.

$$t = 5730\ \text{anni} \cdot \log_2 \frac{N_0}{N}$$

- Vale solo per reperti di origine vivente, fino a circa $50\,000$ anni.

```ad-warning
Due tempi di dimezzamento
Dopo due tempi di dimezzamento resta un quarto del campione, non zero.
```

```ad-warning
Rimasto e decaduto
"È decaduto il $75\%$" vuol dire che resta il $25\%$: nella formula va la frazione rimasta.
```

```ad-warning
Il rapporto nel logaritmo
Nel logaritmo va $\frac{N_0}{N}$, maggiore di $1$; con il rapporto rovesciato il tempo viene negativo.
```
