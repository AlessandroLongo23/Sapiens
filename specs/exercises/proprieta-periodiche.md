# Raggio atomico ed energia di ionizzazione

Generatore: `proprieta-periodiche` (`src/lib/exercises/v2/generators/proprieta-periodiche.ts`, con
`src/lib/exercises/v2/chim3-d.ts`). Verifica indipendente: `scripts/exercises/checkers/proprieta_periodiche.py`, con
`_chim3_d.py`. Lezione collegata: `docs/lezioni/chimica/riscritte/59-proprieta-periodiche.md`. Percorso nel database:
`high_school/chemistry/tavola-periodica/proprieta-periodiche`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più. Scelta multipla con quattro opzioni in tutti;
i livelli 1 e 6 hanno come risposta un numero intero e possono andare a risposta aperta.

## Nomi dei livelli

1. La carica nucleare efficace
2. Il raggio atomico nella tavola
3. Il raggio degli ioni
4. L'energia di ionizzazione nella tavola
5. Le due eccezioni
6. Le energie di ionizzazione successive

## Dati

Raggio atomico (covalente, pm), energia di prima ionizzazione (kJ/mol) e configurazione di ogni elemento vengono da
`src/lib/tools/elementi.json`, il file della tavola periodica del sito, come nella lezione. Raggi ionici e energie di
ionizzazione successive non sono in quel file: sono in `chim3-d.ts` con i valori della lezione (raggi di Shannon;
energie successive da manuale, arrotondate all'unità), e sono da verificare.

## Livello 1: la carica nucleare efficace

Un elemento dei gruppi principali del secondo o del terzo periodo, oppure potassio o calcio ($Z \le 20$, solo
sottolivelli $s$ e $p$ fuori dal nocciolo del gas nobile). Il testo dà $Z$ e la configurazione abbreviata; si chiede
$Z_{eff} = Z - S$, con $S$ il numero di elettroni interni. La risposta è un intero da $1$ a $8$, scritto $+7$.
Distrattori: la carica del nucleo ($+Z$), il numero di elettroni interni, zero (tolti tutti gli elettroni), uno in più
o in meno.

- "Lo zolfo ha numero atomico $Z = 16$ e configurazione elettronica $[\text{Ne}]\,3s^2\,3p^4$. Contando come schermo
  solo gli elettroni interni, quanto vale la carica nucleare efficace $Z_{eff}$ sentita dagli elettroni esterni?"
  Risposta $+6$; distrattori $+16$, $+10$, $0$.
- "Il litio ha numero atomico $Z = 3$ e configurazione elettronica $[\text{He}]\,2s^1$ ..." Risposta $+1$; distrattori
  $+3$, $+2$, $0$.

## Livello 2: il raggio atomico nella tavola

Quattro elementi dello stesso periodo (periodi 2, 3 e 4, gruppi 1, 2 e da 13 a 17) oppure dello stesso gruppo (gruppi
1 e 2 dal secondo al sesto periodo, gruppi 14, 15, 16 e 17 dal secondo al quinto), metà e metà. Si chiede chi ha il
raggio maggiore, o il minore. Vincolo: nei dati il raggio dei quattro deve seguire la regola della lezione (diminuisce
lungo il periodo, aumenta lungo il gruppo) con almeno $3\,\text{pm}$ tra un elemento e il successivo. Le opzioni sono i
quattro simboli: chi pensa "più elettroni, atomo più grande" sceglie l'estremo opposto.

- "Quale di questi elementi del terzo periodo ha il raggio atomico maggiore?" con $\mathrm{S}$, $\mathrm{Mg}$,
  $\mathrm{Cl}$, $\mathrm{Na}$. Risposta $\mathrm{Na}$.
- "Quale di questi elementi del gruppo $17$ ha il raggio atomico minore?" con $\mathrm{F}$, $\mathrm{Cl}$,
  $\mathrm{Br}$, $\mathrm{I}$. Risposta $\mathrm{F}$.

## Livello 3: il raggio degli ioni

Metà: quattro affermazioni del tipo "$\mathrm{Na^+}$ è più piccolo di $\mathrm{Na}$", su quattro elementi diversi tra
gli undici della lezione ($\mathrm{Li}$, $\mathrm{Na}$, $\mathrm{K}$, $\mathrm{Mg}$, $\mathrm{Ca}$, $\mathrm{Al}$,
$\mathrm{O}$, $\mathrm{S}$, $\mathrm{F}$, $\mathrm{Cl}$, $\mathrm{Br}$), una sola vera. Le tre false sono l'errore del
riquadro della lezione: il catione detto più grande, l'anione più piccolo. Metà: quattro ioni isoelettronici (con $10$
elettroni tra $\mathrm{O^{2-}}$, $\mathrm{F^-}$, $\mathrm{Na^+}$, $\mathrm{Mg^{2+}}$, $\mathrm{Al^{3+}}$, o i quattro con
$18$: $\mathrm{S^{2-}}$, $\mathrm{Cl^-}$, $\mathrm{K^+}$, $\mathrm{Ca^{2+}}$); si chiede il più piccolo o il più grande.

- "Quale di queste affermazioni è corretta?" Risposta "$\mathrm{Cl^-}$ è più grande di $\mathrm{Cl}$"; distrattori
  "$\mathrm{Na^+}$ è più grande di $\mathrm{Na}$", "$\mathrm{O^{2-}}$ è più piccolo di $\mathrm{O}$", "$\mathrm{Ca^{2+}}$ è
  più grande di $\mathrm{Ca}$".
- "Questi ioni hanno tutti $10$ elettroni. Qual è il più piccolo?" con $\mathrm{F^-}$, $\mathrm{Mg^{2+}}$,
  $\mathrm{O^{2-}}$, $\mathrm{Na^+}$. Risposta $\mathrm{Mg^{2+}}$.

## Livello 4: l'energia di ionizzazione nella tavola

Come il livello 2, con l'energia di prima ionizzazione: periodi 2, 3 e 4 con i gruppi 1, 2 e da 13 a 18; gruppi 1 e 2
(periodi da 2 a 6) e 15, 16, 17, 18 (periodi da 2 a 5). Vincolo: nei dati l'energia dei quattro segue la regola
(aumenta lungo il periodo, diminuisce lungo il gruppo) con almeno $20\,\text{kJ/mol}$ tra un elemento e il successivo:
restano fuori gli insiemi che contengono tutti e due gli elementi di una coppia che fa eccezione.

- "Quale di questi elementi del secondo periodo ha l'energia di prima ionizzazione maggiore?" con $\mathrm{Li}$,
  $\mathrm{C}$, $\mathrm{N}$, $\mathrm{Ne}$. Risposta $\mathrm{Ne}$.
- "Quale di questi elementi del gruppo $1$ ha l'energia di prima ionizzazione minore?" con $\mathrm{Li}$,
  $\mathrm{Na}$, $\mathrm{K}$, $\mathrm{Cs}$. Risposta $\mathrm{Cs}$.

## Livello 5: le due eccezioni

Quattro coppie di elementi vicini nello stesso periodo (secondo o terzo), scritte da sinistra a destra. Una sola è una
delle quattro in cui il primo ha l'energia maggiore: berillio e boro, magnesio e alluminio (gruppi 2 e 13), azoto e
ossigeno, fosforo e zolfo (gruppi 15 e 16). Le altre tre sono coppie normali. I due tipi di eccezione escono metà e
metà.

- "In quale di queste coppie di elementi vicini nello stesso periodo il primo ha l'energia di prima ionizzazione
  maggiore del secondo?" Risposta "Magnesio e alluminio"; distrattori "Sodio e magnesio", "Silicio e fosforo", "Cloro
  e argon".
- Stessa domanda. Risposta "Azoto e ossigeno"; distrattori "Boro e carbonio", "Ossigeno e fluoro", "Litio e berillio".

## Livello 6: le energie di ionizzazione successive

Una tabella con le prime tre, quattro o cinque energie successive di un elemento (litio, berillio, boro, carbonio,
sodio, magnesio, alluminio, silicio, potassio, calcio), una per riga, e il periodo. Metà delle volte si chiede il
numero di elettroni di valenza, metà il gruppo. Vincolo: la differenza più grande e il rapporto più grande tra due
energie consecutive cadono nello stesso punto. Distrattori per gli elettroni di valenza: il salto letto un posto dopo o
un posto prima, $1$ (il primo aumento preso per il salto), il numero di energie in tabella. Per il gruppo: il numero
di elettroni di valenza scritto come gruppo ($3$ per $13$), i gruppi vicini.

- "Un elemento del terzo periodo ha queste energie di ionizzazione successive, in kJ/mol. Quanti elettroni di valenza
  ha?" con $578$, $1817$, $2745$, $11\,577$. Risposta $3$.
- "Un elemento del secondo periodo ... In quale gruppo della tavola periodica si trova?" con $900$, $1757$, $14\,849$,
  $21\,007$. Risposta $2$.

## Esercizi da evitare

- Confronti di raggio tra ossigeno e fluoro ($63$ e $64\,\text{pm}$), tra germanio e arsenico ($121$ e $121$), e nel
  gruppo 13 (il gallio, $124$, è più piccolo dell'alluminio, $126$): i dati non seguono la regola.
- Confronti di raggio con i gas nobili, che la lezione tiene fuori.
- Nel livello 4, insiemi con tutte e due gli elementi di una coppia che fa eccezione: sono il livello 5.
- Elementi in diagonale, dove le due regole vanno in versi opposti: senza i valori non si decide.

## Risposta aperta

Livelli 1 e 6: la risposta è un numero intero (`answer.kind = 'number'`), classificazione `V` (il valore). La scelta
multipla sta in `params.choice` e `toChoice` la restituisce.

## Verifica

`proprieta_periodiche.py` legge il testo e le opzioni e rifà tutto dai dati di `elementi.json` e dalle tabelle di
`_chim3_d.py`, scritte dalla lezione: conta gli elettroni interni dalla configurazione; controlla che i quattro
elementi stiano dove dice il testo, che i dati seguano la regola con il margine chiesto, e trova l'estremo; valuta le
affermazioni sugli ioni con la regola e con i raggi; controlla che le coppie siano di elementi vicini e che l'unica
inversione sia una delle due eccezioni; riconosce l'elemento dalle energie e trova il salto.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 199 px su 252, tabella del livello 6 173 px su 350).

### Errori piantati

Su 60 esercizi per livello (seed da 1): indice dell'opzione giusta spostato, distrattore uguale alla risposta, opzione
giusta scambiata con una sbagliata, parola vietata, numero della risposta cambiato, una cifra del testo cambiata,
"maggiore" e "minore" scambiati. Bocciati tutti.
