# Formulario: Nomenclatura degli alcani

## Gli alcani

Idrocarburi saturi, solo legami semplici. Con $n$ atomi di carbonio, lineari o ramificati:

$$\mathrm{C}_n\mathrm{H}_{2n+2}$$

## Tre formule della stessa molecola

Formula di struttura: tutti gli atomi e tutti i legami.

Formula razionale: i carboni in fila con i loro idrogeni, i gruppi tra parentesi dopo il carbonio che li porta: $\mathrm{CH_3CH(CH_3)CH_2CH_3}$ (2-metilbutano).

Formula scheletrica: ogni vertice e ogni estremità è un carbonio; una linea $\mathrm{CH_3}$, due linee $\mathrm{CH_2}$, tre linee $\mathrm{CH}$, quattro linee $\mathrm{C}$.

## Radici dei primi dieci alcani

| Carboni | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Radice | met- | et- | prop- | but- | pent- | es- | ept- | ott- | non- | dec- |

Nome dell'alcano lineare: radice + -ano (esano, $\mathrm{C_6H_{14}}$).

## Gruppi alchilici

| Gruppo | Formula | Nel nome |
|---|---|---|
| metile | $-\mathrm{CH_3}$ | metil |
| etile | $-\mathrm{CH_2CH_3}$ | etil |
| propile | $-\mathrm{CH_2CH_2CH_3}$ | propil |

## Le regole IUPAC

1. Catena principale: la più lunga; a parità di lunghezza, quella con più ramificazioni.
2. Numerazione: dall'estremità che dà i locanti più bassi al primo punto di differenza ($2, 2, 4$ batte $2, 4, 4$).
3. Stessi locanti da tutte e due le parti: il più basso al sostituente che viene prima in ordine alfabetico.
4. Sostituenti uguali: di-, tri-, tetra-, con un locante per ciascuno (2,2-dimetil).
5. Sostituenti in ordine alfabetico (etil, metil, propil) senza contare di-, tri-, tetra-, poi la radice con -ano.

Forma del nome: virgola tra numeri, trattino tra numero e lettera, ultimo sostituente attaccato alla radice: 3-etil-5-metileptano, 5-etil-2,2-dimetileptano.

```molecola
% nome: alcani-formulario-etil-dimetileptano
% alt: Formula scheletrica del 5-etil-2,2-dimetileptano con la catena principale di sette carboni colorata e numerata: due metili sul carbonio 2 e un etile sul carbonio 5
% svg: alcani-formulario-etil-dimetileptano-d0396dc4.svg 228x111
smiles: CC(C)(C)CCC(CC)CC
catena: 0 1 4 5 6 7 8
legenda: 5-etil-2,2-dimetileptano
```

Controllo: un metile non sta mai sull'1, un etile mai sull'1 o sul 2, un propile mai prima del 4; se succede, la catena scelta non è la più lunga.

```ad-warning
Prendere la catena scritta dritta
"2-etilpentano" è il 3-metilesano: cerca la catena più lunga partendo da tutte le estremità.
```

```ad-warning
Sommare i locanti
$2, 7, 8$ batte $3, 4, 9$ anche se la somma è più grande: decide il primo numero diverso.
```

```ad-warning
Ordine alfabetico e prefissi
Non "2,2-dimetil-5-etileptano" né "2,2-metileptano": etil prima di dimetil, e due metili vogliono di- e due locanti.
```
