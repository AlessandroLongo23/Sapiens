# Formulario: La mole e la massa molare

## Masse atomiche

L'unità di massa atomica è un dodicesimo della massa di un atomo di carbonio-12:

$$1\ \mathrm{u} \approx 1{,}661 \cdot 10^{-24}\ \mathrm{g}$$

| Elemento | Massa | Elemento | Massa | Elemento | Massa |
|---|---|---|---|---|---|
| $\mathrm{H}$ | $1{,}01$ | $\mathrm{Na}$ | $22{,}99$ | $\mathrm{Cl}$ | $35{,}45$ |
| $\mathrm{C}$ | $12{,}01$ | $\mathrm{Mg}$ | $24{,}31$ | $\mathrm{K}$ | $39{,}10$ |
| $\mathrm{N}$ | $14{,}01$ | $\mathrm{P}$ | $30{,}97$ | $\mathrm{Ca}$ | $40{,}08$ |
| $\mathrm{O}$ | $16{,}00$ | $\mathrm{S}$ | $32{,}07$ | $\mathrm{Fe}$ | $55{,}85$ |

## Dalla formula scheletrica alla formula bruta

```molecole
% nome: mole-formulario-etanolo
% alt: L'etanolo disegnato due volte: a sinistra la formula scheletrica, una linea spezzata con OH in fondo; a destra la formula di struttura con tutti gli atomi, due C, sei H e un O
% svg: mole-formulario-etanolo-77843cc4.svg 416x124
colonne: 2
CCO | formula scheletrica
CCO | formula di struttura | idrogeni: tutti | carboni: si
```

1. Ogni vertice e ogni estremo senza simbolo è un carbonio.
2. Conta gli atomi scritti ($\mathrm{O}$, $\mathrm{N}$...) e gli idrogeni scritti accanto a loro.
3. Ogni carbonio ha quattro legami: quelli che non vedi sono con atomi di idrogeno.
4. Scrivi $\mathrm{C}$, poi $\mathrm{H}$, poi gli altri in ordine alfabetico: $\mathrm{C_2H_6O}$.

## Massa molecolare e massa molare

Massa molecolare: somma delle masse atomiche, ognuna per il numero di atomi di quell'elemento.

$$\mathrm{C_6H_{12}O_6}: \ 6 \cdot 12{,}01 + 12 \cdot 1{,}01 + 6 \cdot 16{,}00 = 180{,}18\ \mathrm{u}$$

La massa molare $M$ è la massa di una mole, in $\mathrm{g/mol}$: ha lo stesso valore della massa molecolare ($M_{\mathrm{glucosio}} = 180{,}18\ \mathrm{g/mol}$).

| Sostanza | Formula | $M$ ($\mathrm{g/mol}$) |
|---|---|---|
| Acqua | $\mathrm{H_2O}$ | $18{,}02$ |
| Anidride carbonica | $\mathrm{CO_2}$ | $44{,}01$ |
| Etanolo | $\mathrm{C_2H_6O}$ | $46{,}08$ |
| Glucosio | $\mathrm{C_6H_{12}O_6}$ | $180{,}18$ |
| Acido acetilsalicilico | $\mathrm{C_9H_8O_4}$ | $180{,}17$ |
| Caffeina | $\mathrm{C_8H_{10}N_4O_2}$ | $194{,}22$ |

## La mole

Una mole contiene $N_A$ particelle (atomi, molecole o ioni):

$$N_A = 6{,}022 \cdot 10^{23}\ \mathrm{mol^{-1}}$$

## Massa, moli, particelle

$$n = \frac{m}{M} \qquad m = n \cdot M \qquad N = n \cdot N_A$$

Atomi di un elemento: $N$ per il numero di quegli atomi nella molecola. Per esempio $36{,}0\ \mathrm{g}$ di $\mathrm{H_2O}$ sono $2{,}00\ \mathrm{mol}$, cioè $1{,}20 \cdot 10^{24}$ molecole e $2{,}41 \cdot 10^{24}$ atomi di idrogeno.

Nel risultato, tante cifre significative quante ne ha il dato meno preciso.

## Composizione percentuale

Per un elemento $X$ che compare $k$ volte nella formula:

$$\%X = \frac{k \cdot A_X}{M} \cdot 100$$

Per esempio nell'acqua $\%\mathrm{O} = \dfrac{16{,}00}{18{,}02} \cdot 100 = 88{,}8\%$.

```ad-warning
Dimenticare gli idrogeni nascosti
Nella formula scheletrica gli idrogeni sul carbonio non sono scritti, ma ci sono: l'etanolo è $\mathrm{C_2H_6O}$, non $\mathrm{C_2HO}$.
```

```ad-warning
Moltiplicare invece di dividere
Da massa a moli si divide per $M$; da moli a particelle si moltiplica per $N_A$.
```

```ad-warning
Contare gli atomi al posto della massa
Nell'acqua l'idrogeno è due atomi su tre ma l'$11{,}2\%$ della massa: al numeratore va $k \cdot A_X$.
```
