# Formulario: I gruppi funzionali

## Gruppo funzionale e classe

Gruppo funzionale: atomo o gruppo di atomi che decide il comportamento chimico della molecola. Classe: le molecole con lo stesso gruppo. $\mathrm{R}$, $\mathrm{R'}$: il resto della molecola (carbonio e idrogeno); $\mathrm{Ar}$: un anello benzenico; $\mathrm{X}$: un alogeno.

## Le classi

| Classe | Formula generale | Il gruppo | Nome | Esempio |
|---|---|---|---|---|
| alogenuro alchilico | $\mathrm{R{-}X}$ | alogeno su C con soli legami semplici | cloro-, bromo-... | clorometano |
| alcol | $\mathrm{R{-}OH}$ | $\mathrm{-OH}$ su C con soli legami semplici | -olo | etanolo |
| fenolo | $\mathrm{Ar{-}OH}$ | $\mathrm{-OH}$ su un C dell'anello | ...fenolo | fenolo |
| etere | $\mathrm{R{-}O{-}R'}$ | O tra due carboni | -ossi- | metossimetano (dimetiletere) |
| aldeide | $\mathrm{R{-}CHO}$ | $\mathrm{C{=}O}$ con un H, in fondo | -ale | etanale (acetaldeide) |
| chetone | $\mathrm{R{-}CO{-}R'}$ | $\mathrm{C{=}O}$ tra due carboni | -one | propanone (acetone) |
| acido carbossilico | $\mathrm{R{-}COOH}$ | $\mathrm{C{=}O}$ con un $\mathrm{-OH}$ | acido ...-oico | acido etanoico (acetico) |
| estere | $\mathrm{R{-}COO{-}R'}$ | $\mathrm{C{=}O}$ con un O legato a un C | ...-oato di ...-ile | etanoato di etile |
| ammina | $\mathrm{R{-}NH_2}$ | N legato solo a C e H, niente $\mathrm{C{=}O}$ accanto | -ammina | metanammina (metilammina) |
| ammide | $\mathrm{R{-}CONH_2}$ | N legato al C di un $\mathrm{C{=}O}$ | -ammide | etanammide (acetammide) |

Ammine: primaria, secondaria, terziaria se l'azoto è legato a 1, 2 o 3 carboni.

```molecole
% nome: gruppi-formulario-esempi
% alt: L'esempio più semplice di ogni classe, a coppie, con il gruppo colorato come nella lezione: etanolo e fenolo, etanale e propanone, acido etanoico e etanoato di etile, metanammina ed etanammide, metossimetano e clorometano
% svg: gruppi-formulario-esempi-6ae3932e.svg 506x555
colonne: 2
CCO | alcol: etanolo | evidenzia: [OX2H1&$(O[CX4])] blu
Oc1ccccc1 | fenolo: fenolo | evidenzia: [OX2H1&$(Oc)] blu
CC=O | aldeide: etanale | evidenzia: [$([CX3H1][#6]),$([CX3H2])]=[OX1] rosso
CC(C)=O | chetone: propanone | evidenzia: [CX3&$(C([#6])[#6])]=[OX1] rosso
CC(=O)O | acido: acido etanoico | evidenzia: [$([CX3][#6]),$([CX3H1])](=[OX1])[OX2H1] arancione
CC(=O)OCC | estere: etanoato di etile | evidenzia: [$([CX3][#6]),$([CX3H1])](=[OX1])[OX2H0&$(O([#6])[#6])] verde
CN | ammina: metanammina | evidenzia: [NX3&+0&!$(N~[!#6&!#1])&!$(N[#6]=[O,S,N])] viola
CC(N)=O | ammide: etanammide | evidenzia: [CX3](=[OX1])[NX3] giallo
COC | etere: metossimetano | evidenzia: [OX2&$(O([#6])[#6])&!$(O[#6]=[O,S,N])] grigio
CCl | alogenuro: clorometano
```

Colori della lezione: blu ossidrile, grigio etere, rosso carbonile, arancione carbossile, verde estere, viola ammina, giallo ammide.

## Esterificazione

$$\text{acido carbossilico} + \text{alcol} \xrightarrow{\mathrm{H^+}} \text{estere} + \text{acqua}$$

Per esempio acido acetico + etanolo → etanoato di etile + acqua. L'ossigeno tra i due pezzi dell'estere viene dall'alcol.

## Come riconoscere i gruppi

1. Cerca O, N, F, Cl, Br, I.
2. Ogni $\mathrm{C{=}O}$: sul carbonio c'è $\mathrm{-OH}$ → acido; O legato a un C → estere; N → ammide; H → aldeide; due C → chetone.
3. Ogni O con legami semplici non ancora usato: con H → alcol (C con soli legami semplici) o fenolo (C dell'anello); tra due C → etere.
4. Ogni N non ancora usato → ammina.
5. Alogeno su C con soli legami semplici → alogenuro alchilico.

## Proprietà da ricordare

Con l'$\mathrm{-OH}$ (alcoli, acidi) le molecole formano legami a idrogeno tra loro e bollono più in alto: etano −89 °C, etanolo 78 °C, acido acetico 118 °C. Stessa formula $\mathrm{C_4H_{10}O}$: dietiletere 35 °C, butan-1-olo 118 °C.

Acidi: cedono $\mathrm{H^+}$ in acqua. Fenoli: più acidi degli alcoli. Ammine: basi, legano $\mathrm{H^+}$. Ammidi: non sono basi.

```ad-warning
Vedere un alcol nell'acido
L'$\mathrm{-OH}$ di $\mathrm{-COOH}$ fa parte del carbossile: un acido non è un alcol.
```

```ad-warning
Chiamare chetone un estere o un'ammide
Un $\mathrm{C{=}O}$ con accanto un O o un N non è un chetone: guarda sempre cosa c'è legato al carbonio.
```

```ad-warning
Ammina o ammide
Se uno dei carboni legati all'azoto ha un $\mathrm{C{=}O}$ è un'ammide, anche se l'azoto porta altri gruppi.
```
