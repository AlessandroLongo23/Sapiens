# Formulario: Amminoacidi e legame peptidico

## Struttura di un α-amminoacido

Gruppo amminico e gruppo carbossilico legati allo stesso carbonio, il carbonio α, che porta anche un H e la catena laterale R:

$$\mathrm{H_2N{-}CH(R){-}COOH}$$

I venti amminoacidi delle proteine differiscono solo per R (nella glicina R = H).

```molecole
% nome: peptidi-formulario-struttura
% alt: Alanina, serina e fenilalanina con il gruppo amminico in blu, il carbonio alfa in giallo, il gruppo carbossilico in rosso e la catena laterale in verde
% svg: peptidi-formulario-struttura-a9fc349c.svg 678x137
colonne: 3
atomi: 0 blu
atomi: 1 giallo
atomi: 2 3 4 rosso
N[C@H](C(=O)O)C | alanina | evidenzia: [CH3] verde
N[C@H](C(=O)O)CO | serina | evidenzia: [CH2][OH] verde
N[C@H](C(=O)O)Cc1ccccc1 | fenilalanina | evidenzia: [CH2]c1ccccc1 verde
```

## Configurazione L

- Il carbonio α è uno stereocentro in tutti gli amminoacidi tranne la glicina.
- Proiezione di Fischer con $-\mathrm{COOH}$ in alto e R in basso: $-\mathrm{NH_2}$ a sinistra è L, a destra è D.
- Le proteine usano solo amminoacidi L.
- Con le regole CIP gli amminoacidi L sono S, tranne la cisteina, che è R: lo zolfo di $-\mathrm{CH_2SH}$ porta R davanti a $-\mathrm{COOH}$.

## Forme e pH

$$\mathrm{H_2N{-}CH(R){-}COOH} \longrightarrow \mathrm{{}^{+}H_3N{-}CH(R){-}COO^-} \quad \text{(zwitterione)}$$

| pH | Gruppo carbossilico | Gruppo amminico | Carica netta |
|---|---|---|---|
| molto acido (pH 1) | $-\mathrm{COOH}$ | $-\mathrm{NH_3^+}$ | $+1$ |
| intorno a 7 | $-\mathrm{COO^-}$ | $-\mathrm{NH_3^+}$ | $0$ |
| molto basico (pH 12) | $-\mathrm{COO^-}$ | $-\mathrm{NH_2}$ | $-1$ |

Punto isoelettrico: il pH a cui la carica media è zero (per l'alanina circa $6{,}0$).

## Catene laterali

| Catena laterale | Cosa contiene | A pH 7 | Esempi |
|---|---|---|---|
| apolare | solo C e H (o S tra due carboni) | senza carica | Gly, Ala, Val, Leu, Ile, Phe, Met |
| polare neutra | $-\mathrm{OH}$, $-\mathrm{SH}$, $-\mathrm{CONH_2}$ | senza carica | Ser, Thr, Cys, Asn, Gln, Tyr |
| acida | un secondo $-\mathrm{COOH}$ | $-\mathrm{COO^-}$, carica $-1$ | Asp, Glu |
| basica | un secondo gruppo basico con N | carica $+1$ | Lys, Arg, His (a pH 7 in gran parte neutra) |

## Legame peptidico

Condensazione: il $-\mathrm{COOH}$ del primo amminoacido perde $-\mathrm{OH}$, il $-\mathrm{NH_2}$ del secondo perde un $\mathrm{H}$, si forma $-\mathrm{CO{-}NH}-$.

$$\text{amminoacido} + \text{amminoacido} \longrightarrow \text{dipeptide} + \mathrm{H_2O}$$

```reazione
% nome: peptidi-formulario-reazione
% alt: Glicina più alanina danno il dipeptide glicilalanina più acqua; gli atomi della glicina sono in blu e quelli dell'alanina in arancione, e nell'acqua l'ossigeno e un idrogeno sono blu, l'altro idrogeno è arancione
% svg: peptidi-formulario-reazione-c58db745.svg 720x150
reazione: [NH2:1][CH2:2][C:3](=[O:4])[O:5][H:12].[H:13][NH:6][C@@H:7]([CH3:8])[C:9](=[O:10])[OH:11]>>[NH2:1][CH2:2][C:3](=[O:4])[NH:6][C@@H:7]([CH3:8])[C:9](=[O:10])[OH:11].[H:12][O:5][H:13]
colora: si
larghezza: 720
altezza: 150
```

Formula del dipeptide: somma delle formule meno $\mathrm{H_2O}$. Per esempio Ala-Ser: $\mathrm{C_3H_7NO_2} + \mathrm{C_3H_7NO_3} - \mathrm{H_2O} = \mathrm{C_6H_{12}N_2O_4}$, $89{,}11 + 105{,}11 - 18{,}02 = 176{,}20\ \mathrm{g/mol}$.

Il gruppo peptidico è planare e rigido: per risonanza il legame $\mathrm{C{-}N}$ ha in parte il carattere di un doppio legame. L'idrolisi è la reazione inversa.

## Verso della catena e numero di legami

- Si scrive dall'N-terminale ($-\mathrm{NH_2}$ libero), a sinistra, al C-terminale ($-\mathrm{COOH}$ libero), a destra.
- Gly-Ala e Ala-Gly sono isomeri diversi, stessa formula $\mathrm{C_5H_{10}N_2O_3}$.
- Con 20 amminoacidi: $20^2 = 400$ dipeptidi, $20^3 = 8000$ tripeptidi.

$$n \text{ amminoacidi in catena} \quad \longrightarrow \quad n - 1 \text{ legami peptidici e } n - 1 \text{ molecole d'acqua}$$

Massa di un peptide: somma delle masse degli amminoacidi meno $(n - 1) \cdot 18{,}02\ \mathrm{g/mol}$. Con più catene si conta $n - 1$ per ogni catena.

## Livelli di struttura

1. Primaria: la sequenza degli amminoacidi (legami peptidici).
2. Secondaria: α-elica e foglietto β (legami a idrogeno tra $\mathrm{C{=}O}$ e $\mathrm{N{-}H}$ della catena principale).
3. Terziaria: la forma 3D della catena (catene laterali: apolari all'interno, legami ionici, legami a idrogeno, ponti disolfuro $-\mathrm{S{-}S}-$).
4. Quaternaria: più catene insieme (emoglobina: quattro).

Denaturazione: si perdono i livelli 2, 3 e 4, i legami peptidici restano.

```ad-warning
L non vuol dire S
La cisteina è L ma R: D/L e R/S sono convenzioni diverse.
```

```ad-warning
A pH 7 l'amminoacido ha le cariche
Si scrive $-\mathrm{COO^-}$ e $-\mathrm{NH_3^+}$, non $-\mathrm{COOH}$ e $-\mathrm{NH_2}$.
```

```ad-warning
Le ammidi delle catene laterali non sono legami peptidici
Il $-\mathrm{CONH_2}$ di asparagina e glutammina non unisce due amminoacidi: non si conta.
```
