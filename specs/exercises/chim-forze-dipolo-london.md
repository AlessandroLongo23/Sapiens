# Forze dipolo-dipolo e forze di London

Generatore: `chim-forze-dipolo-london` (`src/lib/exercises/v2/generators/chim-forze-dipolo-london.ts`, con
`src/lib/exercises/v2/chim3-h.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_forze_dipolo_london.py`
(con `_chim3_h.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/72-chim-forze-dipolo-london.md`. Percorso nel
database: `high_school/chemistry/chim-forze-intermolecolari/chim-forze-dipolo-london`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più. Scelta multipla con quattro opzioni; il
livello 2 dà la risposta anche come numero intero, per la risposta aperta.

## Nomi dei livelli

1. Quali forze agiscono
2. Gli elettroni di una molecola
3. London in una famiglia
4. Stessi elettroni, polarità diversa
5. La forza ione-dipolo
6. Forma, polarizzabilità e quando vince London

## Dati

Le sostanze, la loro polarità e le temperature di ebollizione sono quelle della lezione. I numeri atomici vengono da
`src/lib/tools/elementi.json`.

| Tipo | Sostanze |
|---|---|
| atomi singoli | He, Ne, Ar, Kr, Xe |
| molecole apolari | $\mathrm{F_2}$, $\mathrm{Cl_2}$, $\mathrm{Br_2}$, $\mathrm{I_2}$, $\mathrm{N_2}$, $\mathrm{CH_4}$, $\mathrm{C_2H_6}$, $\mathrm{C_3H_8}$, $\mathrm{C_5H_{12}}$, $\mathrm{CO_2}$, $\mathrm{CCl_4}$ |
| molecole polari | $\mathrm{HCl}$, $\mathrm{HBr}$, $\mathrm{HI}$, $\mathrm{SO_2}$, $\mathrm{CHCl_3}$, $\mathrm{CH_3Cl}$, $\mathrm{ICl}$ |

Fuori, perché la regola della soglia $\Delta\chi = 0{,}4$ della lezione 02 e la polarità vera non vanno d'accordo, o
perché formano legami a idrogeno: $\mathrm{H_2S}$, $\mathrm{PH_3}$, $\mathrm{CO}$, $\mathrm{NO}$, $\mathrm{H_2O}$,
$\mathrm{NH_3}$, $\mathrm{HF}$.

## Livello 1: quali forze agiscono

Una sostanza della tabella, con la polarità detta nel testo ("ha molecole polari", "ha molecole apolari", "è fatto di
atomi singoli"). Si chiede quali forze intermolecolari agiscono tra le sue particelle. Risposta: "Solo forze di
London" per atomi e molecole apolari, "Forze di London e forze dipolo-dipolo" per le molecole polari. Distrattori:
l'altra risposta, "Solo forze dipolo-dipolo" (l'errore del riquadro: London c'è sempre), e una tra "Forze
ione-dipolo" e "Legami covalenti" (forze dentro la molecola scambiate per forze tra le molecole).

- "Il cloruro di idrogeno, $\mathrm{HCl}$, ha molecole polari. Quali forze intermolecolari agiscono tra le sue
  molecole?" Forze di London e forze dipolo-dipolo.
- "L'argon, $\mathrm{Ar}$, è fatto di atomi singoli. Quali forze intermolecolari agiscono tra i suoi atomi?" Solo
  forze di London.

## Livello 2: gli elettroni di una molecola

Una molecola tra $\mathrm{F_2}$, $\mathrm{Cl_2}$, $\mathrm{Br_2}$, $\mathrm{I_2}$, $\mathrm{N_2}$, $\mathrm{CH_4}$,
$\mathrm{C_2H_6}$, $\mathrm{C_3H_8}$, $\mathrm{C_5H_{12}}$, $\mathrm{CO_2}$, $\mathrm{CCl_4}$, $\mathrm{HCl}$,
$\mathrm{HBr}$, $\mathrm{HI}$, $\mathrm{SO_2}$, $\mathrm{CHCl_3}$, $\mathrm{CH_3Cl}$, $\mathrm{ICl}$, con i numeri
atomici dei suoi elementi nel testo. Si chiede il numero totale di elettroni: la somma dei numeri atomici, ognuno
moltiplicato per l'indice. Risposta: un numero intero (anche a risposta aperta). Distrattori, nell'ordine: gli
indici dimenticati; gli indici scambiati tra gli atomi; un atomo contato una volta in più; il doppio; un atomo
dimenticato; il numero degli atomi.

- "Quanti elettroni ha in tutto una molecola di $\mathrm{CHCl_3}$, triclorometano? Numeri atomici: $Z(\mathrm{C}) = 6$,
  $Z(\mathrm{H}) = 1$, $Z(\mathrm{Cl}) = 17$." $6 + 1 + 3 \cdot 17 = 58$.
- "... $\mathrm{Cl_2}$, cloro? ..." $2 \cdot 17 = 34$; distrattore $17$.

## Livello 3: London in una famiglia

Quattro sostanze apolari della stessa famiglia (quattro dei cinque gas nobili; i quattro alogeni; metano, etano,
propano, pentano), in ordine casuale. Una domanda tra: quale bolle alla temperatura più alta, quale alla più bassa,
in quale le forze di London sono più intense, in quale più deboli. Risposta: quella con più elettroni, o con meno. Le
opzioni sono le quattro formule. Nei passaggi gli elettroni di ognuna e la temperatura di ebollizione della risposta.

- "Queste quattro sostanze sono fatte di molecole apolari: $\mathrm{F_2}$, $\mathrm{Br_2}$, $\mathrm{I_2}$,
  $\mathrm{Cl_2}$. Quale bolle alla temperatura più alta?" $\mathrm{I_2}$ ($106$ elettroni, $184\,^\circ\text{C}$).
- "Queste quattro sostanze sono fatte di atomi singoli: Kr, He, Xe, Ne. In quale le forze di London sono più deboli?"
  He.

## Livello 4: stessi elettroni, polarità diversa

Una coppia con lo stesso numero di elettroni, una sostanza polare e una no: $\mathrm{F_2}$ e $\mathrm{HCl}$ ($18$),
Ar e $\mathrm{HCl}$ ($18$), $\mathrm{Br_2}$ e $\mathrm{ICl}$ ($70$), $\mathrm{C_3H_8}$ e $\mathrm{CH_3Cl}$ ($26$), Kr e
$\mathrm{HBr}$ ($36$), Xe e $\mathrm{HI}$ ($54$). Il testo dice gli elettroni, non la polarità. Due domande, metà e
metà:

- quale bolle più in alto e perché. Risposta: la polare, perché è polare. Distrattori: l'apolare perché è apolare; la
  polare perché ha più elettroni (ne hanno uguali); bollono alla stessa temperatura.
- quale forza agisce tra le molecole della polare e non tra le particelle dell'altra. Risposta: la forza
  dipolo-dipolo. Distrattori: la forza di London (c'è in tutte e due), la forza ione-dipolo, il legame covalente.

Esempi:

- "$\mathrm{Br_2}$ e $\mathrm{ICl}$ hanno tutti e due $70$ elettroni. Quale bolle alla temperatura più alta, e perché?"
  $\mathrm{ICl}$, perché è polare ($97$ contro $59\,^\circ\text{C}$).
- "Kr e $\mathrm{HBr}$ hanno tutti e due $36$ elettroni, ma $\mathrm{HBr}$ bolle a una temperatura più alta. Quale
  forza agisce tra le molecole di $\mathrm{HBr}$ e non tra gli atomi di Kr?" La forza dipolo-dipolo.

## Livello 5: la forza ione-dipolo

Ioni: $\mathrm{Na^+}$, $\mathrm{K^+}$, $\mathrm{Li^+}$, $\mathrm{Mg^{2+}}$, $\mathrm{Ca^{2+}}$, $\mathrm{Cl^-}$,
$\mathrm{Br^-}$, $\mathrm{F^-}$, $\mathrm{I^-}$. Quattro domande:

- (circa 30%) la forza tra uno ione e una molecola d'acqua: forza ione-dipolo. Distrattori: legame ionico (l'errore
  del riquadro), forza dipolo-dipolo, forza di London.
- (circa 25%) quale parte della molecola d'acqua si rivolge verso lo ione: l'ossigeno, che è $\delta^-$, per un
  catione; gli idrogeni, che sono $\delta^+$, per un anione. Distrattori: l'altra parte, e le due con il segno
  sbagliato.
- (circa 25%) la forza tra un catione e un anione in un cristallo: legame ionico. Distrattore principale: forza
  ione-dipolo.
- (circa 20%) quale di due cationi trattiene con più forza le molecole d'acqua: quello con la carica maggiore. Solo
  coppie in cui lo ione più carico non è anche più grande: $\mathrm{Mg^{2+}}$ con $\mathrm{Na^+}$, $\mathrm{K^+}$ o
  $\mathrm{Li^+}$; $\mathrm{Ca^{2+}}$ con $\mathrm{K^+}$ o $\mathrm{Na^+}$.

Esempi:

- "Quale parte della molecola d'acqua si rivolge verso uno ione $\mathrm{Cl^-}$?" Gli idrogeni, che sono $\delta^+$.
- "Quale dei due ioni trattiene con più forza le molecole d'acqua che ha intorno: $\mathrm{Na^+}$ o
  $\mathrm{Mg^{2+}}$?" $\mathrm{Mg^{2+}}$, perché ha la carica maggiore.

## Livello 6: forma, polarizzabilità e quando vince London

Venti domande della lezione, con la risposta e tre distrattori ciascuna: la serie $\mathrm{HCl}$, $\mathrm{HBr}$,
$\mathrm{HI}$ (chi bolle più in alto, chi più in basso, dove London è più intensa, qual è la più polare, perché la
temperatura sale); pentano e 2,2-dimetilpropano; tetracloruro di carbonio contro clorometano e contro triclorometano;
cloro e iodio; forze di van der Waals; polarizzabilità; dipolo istantaneo e dipolo indotto; che cosa si vince
nell'ebollizione; tra chi agiscono le forze di London; perché la forza ione-dipolo è più intensa; perché nei gas le
forze contano poco; quale forza è intramolecolare.

- "Tra $\mathrm{HCl}$, $\mathrm{HBr}$ e $\mathrm{HI}$, quale bolle alla temperatura più alta?" $\mathrm{HI}$.
- "Quando una sostanza molecolare bolle, che cosa si vince?" Le forze tra le molecole; distrattore: i legami covalenti
  nelle molecole.

## Esercizi da evitare

- Confronti tra una sostanza polare piccola e una apolare grande in cui lo studente deve indovinare chi vince: la
  lezione dice che la regola non decide. Compaiono solo al livello 6, con il dato nel testo.
- Sostanze che formano legami a idrogeno (sono della lezione 73).
- Molecole la cui polarità dipende da una geometria che la lezione 02 non tratta.
- Confronti tra temperature di ebollizione che differiscono di meno di $15$ gradi.
- Al livello 5, coppie di ioni in cui carica e dimensione vanno in versi opposti ($\mathrm{Ca^{2+}}$ e $\mathrm{Li^+}$).

## Controllo

Il controllo Python rilegge il testo del problema, ha la sua tabella di sostanze (polarità, temperature di ebollizione)
e la sua chiave del livello 6, ricalcola gli elettroni con i numeri atomici di `elementi.json`, e verifica che
l'opzione giusta sia quella. Al livello 3 controlla anche che l'ordine per elettroni e l'ordine per temperatura di
ebollizione coincidano; al livello 4 che gli elettroni siano uguali e che la polare bolla almeno $15$ gradi più in
alto; al livello 5 che lo ione più carico non sia più grande (raggi ionici in pm).
