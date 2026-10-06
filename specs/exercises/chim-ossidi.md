# Ossidi basici e ossidi acidi

Generatore: `chim-ossidi` (`src/lib/exercises/v2/generators/chim-ossidi.ts`, con `src/lib/exercises/v2/chim3-i.ts`).
Verifica indipendente: `scripts/exercises/checkers/chim_ossidi.py`, con `scripts/exercises/checkers/_chim3_i.py`.
Lezione collegata: `docs/lezioni/chimica/riscritte/77-chim-ossidi.md`. Percorso nel database:
`high_school/chemistry/chim-nomenclatura/chim-ossidi`.

Sei livelli, ognuno con una difficoltà in più. Tutti a scelta multipla, quattro opzioni: nomi e formule non si
scrivono a mano.

## Nomi dei livelli

1. Che tipo di ossido è
2. Ossidi basici: dalla formula al nome
3. Ossidi basici: dal nome alla formula
4. Anidridi: dalla formula al nome
5. Anidridi: dal nome alla formula
6. Perossidi e ossidi particolari

## Dati e nomi

Metalli con un solo numero di ossidazione: litio, sodio, potassio, argento ($+1$); magnesio, calcio, bario, zinco
($+2$); alluminio ($+3$). Metalli con due: ferro $+2$, $+3$ (ferr-); rame $+1$, $+2$ (rame-); stagno e piombo $+2$,
$+4$ (stann-, piomb-); cobalto, nichel, cromo e manganese $+2$, $+3$ (cobalt-, nichel-, crom-, mangan-); oro $+1$, $+3$
(aur-).

Non metalli e anidridi: boro $+3$ (bor-), carbonio $+4$ (carbon-), silicio $+4$ (silic-), azoto $+3$, $+5$ (nitr-),
fosforo $+3$, $+5$ (fosfor-), zolfo $+4$, $+6$ (solfor-), cloro $+1$, $+3$, $+5$, $+7$ (clor-), bromo $+1$, $+5$
(brom-), iodio $+1$, $+5$, $+7$ (iod-).

La formula è l'incrocio del numero di ossidazione con il $2$ dell'ossigeno, ridotto. I tre nomi:

- tradizionale: "ossido di" e il metallo, oppure "ossido" con -oso (il più basso) e -ico (il più alto); "anidride" con
  -ica (una sola), -osa e -ica (due), e per gli alogeni ipo- e -osa ($+1$), -osa ($+3$), -ica ($+5$), per- e -ica
  ($+7$);
- Stock: "ossido di", l'elemento e il numero romano tra parentesi, solo se l'elemento ha più di un numero di
  ossidazione (per il carbonio sì, perché esiste anche $\mathrm{CO}$; per boro e silicio no);
- IUPAC: prefissi di, tri, tetra, penta, esa, epta senza elisione; l'uno non si dice, tranne in "monossido" quando gli
  atomi sono uno a uno e l'elemento ha più di un ossido ($\mathrm{FeO}$ monossido di ferro, $\mathrm{CaO}$ ossido di
  calcio).

Vincolo comune dei livelli sui nomi: nessuna opzione sbagliata è un nome giusto dello stesso composto in un'altra
nomenclatura, e non si chiede una nomenclatura il cui nome coincide con quello tradizionale ($\mathrm{CaO}$ solo
tradizionale; $\mathrm{Na_2O}$ tradizionale o IUPAC; Stock solo con il numero romano). Ogni nome porta a una sola
formula.

## Livello 1: che tipo di ossido è

Una formula, quattro risposte fisse: "Ossido basico", "Ossido acido (anidride)", "Perossido", "Non è un ossido". Quote:
circa 30% basico, 30% acido, 20% perossido, 20% nessuno. Non ossidi: $\mathrm{OF_2}$, composti ternari
($\mathrm{NaOH}$, $\mathrm{H_2SO_4}$, $\mathrm{CaCO_3}$), composti senza ossigeno ($\mathrm{HCl}$, $\mathrm{NaCl}$,
$\mathrm{CaH_2}$). Gli ossidi di alluminio e di zinco non compaiono: sono anfoteri.

- "Che tipo di composto è $\mathrm{SO_3}$?" Risposta: ossido acido (anidride).
- "Che tipo di composto è $\mathrm{BaO_2}$?" Risposta: perossido.

## Livello 2: ossidi basici, dalla formula al nome

L'ossido di un metallo e una nomenclatura. Distrattori: tradizionale, il suffisso scambiato (ferroso per ferrico),
"anidride" con lo stesso aggettivo, "idrossido", "perossido"; Stock, l'altro numero di ossidazione e gli indici letti
come numero romano; IUPAC, i prefissi scambiati, un prefisso tolto, un atomo in più.

- "Qual è il nome tradizionale di $\mathrm{Fe_2O_3}$?" Risposta: ossido ferrico; distrattori ossido ferroso, anidride
  ferrica, idrossido ferrico.
- "Qual è il nome di $\mathrm{PbO_2}$ nella notazione di Stock?" Risposta: ossido di piombo(IV); distrattori ossido di
  piombo(II), ossido di piombo(I), ossido di piombo(V).

## Livello 3: ossidi basici, dal nome alla formula

Il nome di un ossido di un metallo in una nomenclatura. Distrattori: l'altro ossido dello stesso metallo, la formula
non ridotta, gli indici scambiati, il numero di ossidazione lasciato sul metallo.

- "Qual è la formula del composto che ha questo nome: ossido rameoso?" Risposta $\mathrm{Cu_2O}$; distrattori
  $\mathrm{CuO}$, $\mathrm{CuO_2}$, $\mathrm{Cu_2O_2}$.
- "... triossido di dicromo?" Risposta $\mathrm{Cr_2O_3}$.

## Livello 4: anidridi, dalla formula al nome

L'ossido di un non metallo e una nomenclatura. Distrattori: tradizionale, l'altro suffisso (solforosa per solforica),
gli altri nomi degli alogeni, "ossido" con l'aggettivo al maschile; Stock e IUPAC come al livello 2.

- "Qual è il nome tradizionale di $\mathrm{Cl_2O_7}$?" Risposta: anidride perclorica; distrattori anidride clorica,
  anidride clorosa, anidride ipoclorosa.
- "Qual è il nome IUPAC di $\mathrm{N_2O_5}$?" Risposta: pentaossido di diazoto.

## Livello 5: anidridi, dal nome alla formula

- "Qual è la formula del composto che ha questo nome: anidride solforosa?" Risposta $\mathrm{SO_2}$; distrattori
  $\mathrm{SO_3}$, $\mathrm{S_2O_4}$, $\mathrm{S_2O}$.
- "... ossido di azoto(III)?" Risposta $\mathrm{N_2O_3}$.

## Livello 6: perossidi e ossidi particolari

Tre tipi di domanda, circa un terzo ciascuno.

- "Quale di questi composti è un perossido?": un perossido ($\mathrm{H_2O_2}$, $\mathrm{Na_2O_2}$, $\mathrm{K_2O_2}$,
  $\mathrm{BaO_2}$, $\mathrm{CaO_2}$), due ossidi con due atomi di ossigeno ($\mathrm{PbO_2}$, $\mathrm{SnO_2}$,
  $\mathrm{MnO_2}$, $\mathrm{CO_2}$, $\mathrm{SO_2}$, $\mathrm{SiO_2}$) e un ossido di un metallo dei gruppi 1 e 2.
- Il nome o la formula di un perossido: "Che nome ha $\mathrm{Na_2O_2}$?" (perossido di sodio; distrattori ossido,
  idrossido, anidride, idruro di sodio); "... perossido di bario?" ($\mathrm{BaO_2}$; distrattori $\mathrm{BaO}$,
  $\mathrm{Ba_2O_2}$, $\mathrm{Ba_2O}$).
- Quindici domande fisse sugli ossidi fuori dalle due regole: i nomi di $\mathrm{CrO_3}$ (anidride cromica, ossido di
  cromo(VI)), $\mathrm{Mn_2O_7}$ (anidride permanganica, ossido di manganese(VII)), $\mathrm{MnO_2}$ (ossido di
  manganese(IV)), $\mathrm{CO}$ (monossido di carbonio); le formule di anidride cromica, anidride permanganica,
  monossido di azoto; quale ossido è anfotero ($\mathrm{Al_2O_3}$, $\mathrm{ZnO}$); quale ossido di un metallo è acido
  ($\mathrm{CrO_3}$, $\mathrm{Mn_2O_7}$); quale ossido di un non metallo non è un'anidride ($\mathrm{CO}$,
  $\mathrm{NO}$).

## Esercizi da evitare

- Distrattori che sono un altro nome giusto del composto (l'IUPAC "ossido di disodio" tra le opzioni di una domanda sul
  nome tradizionale di $\mathrm{Na_2O}$).
- "Ossido di ferro" senza numero romano come distrattore del nome IUPAC di $\mathrm{FeO}$: alcuni libri lo accettano.
- Domande sul nome IUPAC quando coincide con il tradizionale ($\mathrm{CaO}$, $\mathrm{ZnO}$).
- Ossidi di alluminio e zinco al livello 1; $\mathrm{N_2O}$, $\mathrm{NO_2}$ e l'anidride manganica, che la lezione non
  nomina.

## Verifica

`chim_ossidi.py` decide il tipo di un composto dalla formula (due elementi, ossigeno a $-2$ o a $-1$ con le regole
della lezione 76, metallo o non metallo), ricostruisce i tre nomi di ogni ossido dalle tabelle di `_chim3_i.py`,
controlla che l'opzione giusta sia il nome nella nomenclatura chiesta e che nessun'altra sia un nome giusto, che ogni
nome porti a una sola formula e che nessuna formula sbagliata abbia gli stessi atomi di quella giusta. Per il livello
6 classifica le quattro formule e ha una chiave delle risposte scritta dalla lezione. Quote dei casi dei livelli 1 e 6.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 200 px su 252; il testo dei problemi è prosa e va a
capo da sé).

### Errori piantati

Su 60 esercizi per livello (seed da 300): indice dell'opzione giusta, opzione doppia, distrattore uguale alla risposta,
parole vietate, caso dichiarato bocciati 360 su 360; testo dell'opzione giusta 355 su 355; un altro nome giusto del
composto messo tra i distrattori 106 su 106; un indice della formula del testo cambiato 151 su 152 (quello che passa è
$\mathrm{SO_2}$ diventato $\mathrm{SO_3}$ al livello 1, che resta un esercizio giusto).
