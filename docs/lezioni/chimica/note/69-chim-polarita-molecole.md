# Note: Molecole polari e apolari

Lezione nuova (6 ottobre 2026), lotto del terzo anno, gruppo G: capitolo "La forma delle molecole e le teorie del
legame", seconda lezione su quattro. `check.mts` passa su lezione, formulario e flashcard, senza avvisi.

## Struttura e confini

Il dipolo di un legame, con $\mu = \delta \cdot d$, il debye e il verso della freccia; il momento dipolare della
molecola come somma di vettori, con $\mathrm{CO_2}$ e acqua e la formula $\mu = 2\,\mu_{leg}\cos\frac{\theta}{2}$; le
geometrie simmetriche e quelle con coppie solitarie; gli atomi legati diversi, con la serie dal metano al
tetraclorometano e $\mathrm{HCN}$; il procedimento in quattro passi; le conseguenze (solubilità, bacchetta
elettrizzata, un rimando alle forze tra molecole).

- La lezione 02 (VSEPR) chiude con "Dalla geometria alla polarità": tre passi e tre esempi a coppie ($\mathrm{CO_2}$ e
  acqua, $\mathrm{BF_3}$ e $\mathrm{NH_3}$, $\mathrm{CCl_4}$ e $\mathrm{CHCl_3}$). La 69 non li contraddice: stessa
  soglia di $0{,}4$ per il legame polare, stesso giudizio sul legame C–H, stesso procedimento con un passo in più (la
  freccia). Aggiunge quello che là manca: la grandezza $\mu$ con unità e numeri, la somma fatta davvero come vettori,
  la serie dei clorometani, le conseguenze. Gli esempi svolti usano altre molecole ($\mathrm{SO_3}$ e
  $\mathrm{SO_2}$, $\mathrm{HCN}$, i tre fluoruri) per non ripetere quelli della 02; le molecole sono quelle della
  riga 4 di `confronto-atzeni.md` dove hanno senso per la polarità ($\mathrm{H_2O}$, $\mathrm{BF_3}$,
  $\mathrm{CH_4}$, $\mathrm{CO_2}$, $\mathrm{SO_3}$, $\mathrm{NH_3}$). Gli ioni ($\mathrm{CN^-}$,
  $\mathrm{SO_4^{2-}}$) restano fuori: un riquadro dice che per uno ione non si parla di polare e apolare.
- Il legame polare, $\Delta\chi$ e le cariche parziali sono della 64: qui una frase con il link. Le forze
  dipolo-dipolo e i punti di ebollizione sono della 72: qui un paragrafo di rimando.
- Il filo d'acqua deviato è già nella 44 come suggerimento ("una prova che si fa in cucina", con il palloncino): la
  69 lo riprende con la bacchetta e la figura, e aggiunge che il filo devia con tutti e due i segni della carica.
- "Il simile scioglie il simile" è già nella 46: qui c'è il perché in due frasi e una tabella con quattro sostanze.

## Scelte da confermare

- Verso della freccia: dal $\delta^+$ al $\delta^-$, verso l'atomo più elettronegativo, con una piccola croce sulla
  coda, come la disegna la lezione 64 (gruppo E). La lezione 02 non disegna frecce. Vale per le figure TikZ e per le
  due interattive (il pezzo `DipoleArrow` di `chim3-g-pezzi.tsx`). Un riquadro sulla convenzione opposta della fisica
  è stato tolto per stare nei 25.000 caratteri: se serve, va nella 64, dove la freccia è definita.
- Colori: dipoli di legame blu, somma arancione (`orange!90!black`), cioè vettore e risultante delle lezioni di
  fisica. La 64 disegna il dipolo del legame in arancione: qui servono due colori per distinguere i
  dipoli dei legami dalla loro somma, e l'arancione è rimasto alla somma. Da uniformare se si preferisce. Atomi: O `red!20`, H `blue!10`, C `gray!20` come nella 44; Cl `green!20`, scelto qui.
- Il legame C–H ($\Delta\chi = 0{,}35$) è contato come apolare, come nella 02. La lezione dice "quasi apolare" e,
  dove serve, che "anche i legami C–H contano un poco".
- La formula $\mu = 2\,\mu_{leg}\cos\frac{\theta}{2}$ usa il coseno, con il link alla lezione di matematica del
  secondo anno. Se per una terza è troppo, si può togliere l'esempio 2 e lasciare la formula come lettura della
  figura interattiva.

## Dati e cose da verificare

- Elettronegatività da `src/lib/tools/elementi.json`: H 2,20; B 2,04; C 2,55; N 3,04; O 3,44; F 3,98; S 2,58; Cl
  3,16; Br 2,96; I 2,66. Le differenze della lezione sono rifatte con lo script `conti.py` dello scratchpad.
- Momenti dipolari, scritti a memoria dai valori dei manuali (CRC Handbook of Chemistry and Physics, tabella "Dipole
  moments"; edizione e anno da verificare): HF 1,82 D, HCl 1,08 D, HBr 0,82 D, HI 0,44 D; $\mathrm{H_2O}$ 1,85 D;
  $\mathrm{SO_2}$ 1,63 D; $\mathrm{CH_3Cl}$ 1,87 D; $\mathrm{CH_2Cl_2}$ 1,60 D; $\mathrm{CHCl_3}$ 1,04 D;
  $\mathrm{HCN}$ 2,98 D. Da verificare tutti: le edizioni recenti del CRC danno per HCl 1,11 D e per $\mathrm{CHCl_3}$
  1,04 D, e i libri di scuola riportano spesso 1,08 e 1,01.
- $1\,\text{D} = 3{,}34 \cdot 10^{-30}\,\text{C}\cdot\text{m}$ (3,336): da verificare la terza cifra.
- Distanza H–Cl $127\,\text{pm}$ e angolo di $\mathrm{SO_2}$ $119^\circ$: da verificare.
- Esempio 1: $\delta = 2{,}84 \cdot 10^{-20}\,\text{C}$, il 18% della carica dell'elettrone ($0{,}178$). Esempio 2:
  $1{,}85 / (2 \cdot 0{,}612) = 1{,}51\,\text{D}$. Rifatti con lo script.
- Solubilità nella tabella ("molto solubile", "pochissimo solubile"): qualitative, senza numeri. L'ammoniaca e l'HCl
  in acqua non si limitano a sciogliersi (reagiscono): per l'argomento della lezione conta che ci stanno bene.
- $\Delta\chi$ di B–F è $1{,}94$, sopra la soglia di $1{,}9$ che il brief dà per il legame ionico, ma
  $\mathrm{BF_3}$ è una molecola covalente. La lezione non dà il numero e parla solo di "legami polari con il
  fluoro". È una delle eccezioni della regola pratica, da dire nella 64.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `polarita-dipolo-legame-hcl`, `polarita-somma-co2-acqua`,
`polarita-geometrie-somma`, `polarita-filo-liquido-bacchetta`.

Due interattive, in `src/components/content/interactive/chimica/`:

| Nome | File | Che cosa fa |
|---|---|---|
| `polarita-somma-dipoli` | `PolaritaSommaDipoli.tsx` | una molecola $\mathrm{AX_2}$ ($\mathrm{CO_2}$, $\mathrm{SO_2}$, $\mathrm{H_2O}$) da piegare con un cursore da $180^\circ$ a $90^\circ$; accanto, i due dipoli sommati con il parallelogramma; sotto, $2\cos\frac{\theta}{2}$ e polare o apolare |
| `polarita-sostituisci-atomi` | `PolaritaSostituisciAtomi.tsx` | il tetraedro da $\mathrm{CH_4}$ a $\mathrm{CCl_4}$: ogni atomo si cambia con un clic, la freccia arancione è la somma dei dipoli C–Cl; sotto, formula, polare o apolare, $\mu$ misurato |

Nella seconda la somma è fatta in tre dimensioni e poi disegnata con la stessa proiezione degli atomi. Il modello a
frecce uguali dà 1, 1,15, 1 volte il dipolo C–Cl per uno, due e tre cloro, mentre i valori misurati sono 1,87, 1,60 e
1,04 D: la lezione lo dice (le frecce dicono polare o apolare, non il valore).

## Esercizio guidato

L'esempio 5 (tre molecole con il fluoro), su una sola molecola per volta, per esempio $\mathrm{NF_3}$. Si fermerebbe
in tre punti: quante coppie solitarie ha l'atomo centrale; qual è la geometria; se le frecce si annullano.

## Dubbi per Andrea

- Nella 64 il dipolo di un legame è arancione, qui è blu e l'arancione è la somma: va bene, o si scambiano i colori?
- Il debye e la formula $\mu = \delta \cdot d$ con un conto (esempio 1) vanno bene per una terza, o basta il
  confronto qualitativo?
- La formula della somma con il coseno (esempio 2) resta, o la somma si lascia solo grafica?
- La serie dei clorometani con i valori misurati che non seguono il modello: aiuta o confonde?
- Va detto qualcosa sugli ioni poliatomici simmetrici ($\mathrm{SO_4^{2-}}$, $\mathrm{NH_4^+}$) oltre al riquadro?

## Esercizi

Generatore `chim-polarita-molecole`, cinque livelli (specifica in `specs/exercises/chim-polarita-molecole.md`).

Prerequisiti proposti: chim-legame-covalente-polare, geometria-molecolare-vsepr, chim-affinita-elettronegativita, chim-formule-lewis
