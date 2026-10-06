# Molecole polari e apolari

Generatore: `chim-polarita-molecole` (`src/lib/exercises/v2/generators/chim-polarita-molecole.ts`, con
`src/lib/exercises/v2/chim3-g.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_polarita_molecole.py`
(con `_chim3_g.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/69-chim-polarita-molecole.md`. Percorso nel
database: `high_school/chemistry/chim-forma-molecole/chim-polarita-molecole`.

Cinque livelli nell'ordine della lezione, ognuno con una difficoltà in più. Tutto a scelta multipla, quattro opzioni.

## Nomi dei livelli

1. Il dipolo di un legame
2. Molecole con atomi legati uguali
3. Atomi diversi attorno al centro
4. La somma di due dipoli
5. Solubilità e bacchetta elettrizzata

## Dati

Elettronegatività di Pauling da `src/lib/tools/elementi.json`: H 2,20; B 2,04; C 2,55; N 3,04; O 3,44; F 3,98; Si
1,90; P 2,19; S 2,58; Cl 3,16; Br 2,96; I 2,66. Un legame è polare da $\Delta\chi = 0{,}4$ in su, come nella lezione.

## Livello 1: il dipolo di un legame

Due atomi diversi con le loro elettronegatività scritte nel testo. Tre domande: verso quale atomo punta la freccia del
momento dipolare, quale atomo ha $\delta^-$, quale ha $\delta^+$. Tre volte su quattro il legame è polare
($\Delta\chi$ tra $0{,}45$ e $1{,}80$, venticinque coppie), una su quattro apolare ($\Delta\chi$ fino a $0{,}35$,
nove coppie: C–H, P–H, C–S, N–Cl, C–I, Si–H, B–H, Cl–Br, Br–I).

- "Nel legame tra un atomo di carbonio ($\chi = 2{,}55$) e un atomo di ossigeno ($\chi = 3{,}44$), verso quale atomo
  punta la freccia del momento dipolare?" Risposta: verso l'ossigeno.
- "Nel legame tra un atomo di carbonio ($\chi = 2{,}55$) e un atomo di idrogeno ($\chi = 2{,}20$), quale atomo ha la
  carica parziale $\delta^-$?" Risposta: nessuno, il legame è apolare ($\Delta\chi = 0{,}35$).

Distrattori: l'altro atomo (verso scambiato, o $\delta^+$ e $\delta^-$ scambiati); "il legame è apolare" quando non lo
è, o uno dei due atomi quando lo è; "dipende dalla forma della molecola" (confonde il legame con la molecola) o
"tutti e due".

## Livello 2: molecole con atomi legati uguali

Quattro molecole con un atomo centrale legato ad atomi tutti uguali. Metà delle volte una sola è polare, metà una sola
è apolare, e si chiede quella. Apolari (nessuna coppia solitaria sul centro): $\mathrm{CO_2}$, $\mathrm{CS_2}$,
$\mathrm{BF_3}$, $\mathrm{BCl_3}$, $\mathrm{SO_3}$, $\mathrm{CH_4}$, $\mathrm{CCl_4}$, $\mathrm{CF_4}$,
$\mathrm{SiCl_4}$, $\mathrm{SiH_4}$. Polari (coppie solitarie sul centro): $\mathrm{H_2O}$, $\mathrm{NH_3}$,
$\mathrm{SO_2}$, $\mathrm{NF_3}$, $\mathrm{PCl_3}$, $\mathrm{PF_3}$, $\mathrm{OF_2}$, $\mathrm{SCl_2}$.

- "Quale di queste molecole è polare?" $\mathrm{CO_2}$, $\mathrm{BF_3}$, $\mathrm{NH_3}$, $\mathrm{CCl_4}$. Risposta
  $\mathrm{NH_3}$.
- "Quale di queste molecole è apolare?" $\mathrm{H_2O}$, $\mathrm{SO_3}$, $\mathrm{PCl_3}$, $\mathrm{OF_2}$. Risposta
  $\mathrm{SO_3}$.

I distrattori sono gli errori della lezione: "ha legami polari, quindi è polare" ($\mathrm{CO_2}$, $\mathrm{CCl_4}$) e
le coppie solitarie dimenticate (acqua lineare, ammoniaca piatta).

## Livello 3: atomi diversi attorno al centro

Come il livello 2, ma tra le quattro molecole ce n'è almeno una con atomi legati diversi: $\mathrm{CHCl_3}$,
$\mathrm{CH_2Cl_2}$, $\mathrm{CH_3Cl}$, $\mathrm{CH_3F}$, $\mathrm{CHF_3}$, $\mathrm{CH_2F_2}$, $\mathrm{HCN}$,
$\mathrm{CH_2O}$, tutte polari. Metà delle volte la polare è una di queste, tra tre apolari del livello 2; metà delle
volte si chiede l'apolare tra due o tre di queste.

- "Quale di queste molecole è polare?" $\mathrm{CH_4}$, $\mathrm{CCl_4}$, $\mathrm{CH_2Cl_2}$, $\mathrm{CO_2}$.
  Risposta $\mathrm{CH_2Cl_2}$.
- "Quale di queste molecole è apolare?" $\mathrm{HCN}$, $\mathrm{CHCl_3}$, $\mathrm{CF_4}$, $\mathrm{NH_3}$. Risposta
  $\mathrm{CF_4}$.

L'errore preso di mira: "è tetraedrica (o lineare), quindi è apolare".

## Livello 4: la somma di due dipoli

Un atomo centrale legato a due atomi uguali; dipolo di legame da $0{,}8$ a $2{,}0\,\text{D}$ con un decimale; angolo
tra i legami scelto tra $90^\circ$, $100^\circ$, $104{,}5^\circ$, $109{,}5^\circ$, $120^\circ$, $130^\circ$,
$140^\circ$, $150^\circ$, $180^\circ$. Risposta $\mu = 2\,\mu_{leg}\cos\frac{\theta}{2}$ in debye con due decimali
($0\,\text{D}$ a $180^\circ$); si scartano i valori a meno di tre millesimi da un arrotondamento ambiguo.

- $1{,}2\,\text{D}$ e $120^\circ$: $2 \cdot 1{,}2 \cdot \cos 60^\circ = 1{,}20\,\text{D}$.
- $1{,}6\,\text{D}$ e $90^\circ$: $2 \cdot 1{,}6 \cdot \cos 45^\circ = 2{,}26\,\text{D}$; distrattori $3{,}20$ (somma
  dei moduli), $1{,}13$ (un solo coseno), $0$.

Distrattori: $2\,\mu_{leg}$ (i dipoli sommati come numeri), $\mu_{leg}\cos\frac{\theta}{2}$ (dimenticato il 2),
$2\,\mu_{leg}|\cos\theta|$ (l'angolo intero), $2\,\mu_{leg}\sin\frac{\theta}{2}$, $0$, $\mu_{leg}$.

## Livello 5: solubilità e bacchetta elettrizzata

Tre domande, ognuna con una sola sostanza giusta su quattro.

- "Quale di queste sostanze si scioglie meglio in acqua?": una polare ($\mathrm{NH_3}$, $\mathrm{HCl}$,
  $\mathrm{HF}$, $\mathrm{SO_2}$, $\mathrm{CH_2O}$, $\mathrm{HCN}$) tra tre apolari ($\mathrm{CH_4}$,
  $\mathrm{CCl_4}$, $\mathrm{I_2}$, $\mathrm{N_2}$, $\mathrm{O_2}$, $\mathrm{C_6H_{14}}$, $\mathrm{CS_2}$,
  $\mathrm{H_2}$).
- "Quale di queste sostanze si scioglie meglio nell'esano, un solvente apolare?": una apolare ($\mathrm{I_2}$,
  $\mathrm{CCl_4}$, $\mathrm{CH_4}$, $\mathrm{CS_2}$, $\mathrm{Br_2}$) tra tre polari ($\mathrm{NH_3}$,
  $\mathrm{HCl}$, $\mathrm{HF}$, $\mathrm{H_2O}$).
- "Quale di questi liquidi, fatto scendere in un filo sottile, devia di più vicino a una bacchetta elettrizzata?": un
  liquido polare ($\mathrm{H_2O}$, $\mathrm{CHCl_3}$, $\mathrm{CH_2Cl_2}$) tra tre apolari ($\mathrm{CCl_4}$,
  $\mathrm{C_6H_{14}}$, $\mathrm{CS_2}$, $\mathrm{Br_2}$).

Le opzioni hanno nome e formula ("ammoniaca, $\mathrm{NH_3}$"), su due righe quando il nome è lungo.

## Esercizi da evitare

- Legami con $\Delta\chi$ tra $0{,}36$ e $0{,}44$ (S–H $0{,}38$, C–Br $0{,}41$, N–O $0{,}40$): troppo vicini alla
  soglia. Legami sopra $1{,}8$ (B–F $1{,}94$, Si–F $2{,}08$): per la regola pratica sarebbero ionici.
- Molecole in cui la regola della lezione e la realtà non vanno d'accordo: $\mathrm{H_2S}$ e $\mathrm{PH_3}$
  (legami "apolari" per la soglia, molecole polari), $\mathrm{NCl_3}$, $\mathrm{Cl_2O}$.
- Sostanze che in acqua reagiscono o si sciolgono pur essendo apolari ($\mathrm{CO_2}$, $\mathrm{Cl_2}$,
  $\mathrm{BF_3}$), e $\mathrm{Br_2}$ tra le poco solubili in acqua.
- Ioni: per uno ione non si parla di polare e apolare.

## Verifica

`chim_polarita_molecole.py` non ha un elenco di molecole polari: per ogni molecola ha l'atomo centrale e gli atomi
legati con l'ordine di legame, conta le coppie solitarie dagli elettroni di valenza, dispone i legami secondo il
numero sterico (retta, triangolo, tetraedro), mette su ogni legame polare un vettore lungo quanto $\Delta\chi$ e somma
i vettori; controlla anche che il risultato non dipenda da come gli atomi sono disposti sui vertici. Il livello 1
rilegge le elettronegatività dal testo e le confronta con una tabella sua; il livello 4 ricalcola la somma con SymPy e
boccia i valori vicini a un arrotondamento ambiguo; il livello 5 ricava la polarità delle sostanze con lo stesso
conto (per le biatomiche dal legame, per l'esano dai legami C–H) e controlla che i liquidi siano liquidi. Quote del
livello 1: polare dal 65 all'85%, apolare dal 15 al 35%.
