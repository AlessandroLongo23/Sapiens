# Il file system: file, cartelle e percorsi

Generatore: `inf-file-system` (`src/lib/exercises/v2/generators/inf-file-system.ts`, con gli aiuti di
`src/lib/exercises/v2/inf-so.ts`). Verifica indipendente: `scripts/exercises/checkers/inf_file_system.py`. Lezione
collegata: `docs/lezioni/informatica/riscritte/22-inf-file-system.md`.

Sei livelli. I livelli da 1 a 5 sono a scelta multipla (`answer.kind = 'choice'`): le risposte sono tipi di file e
percorsi. Il livello 6 ha una risposta numerica (`answer.kind = 'number'`), con la scelta multipla costruita da
`toChoice()` sui valori sbagliati di `params.wrong`.

## Nomi dei livelli

1. Nomi ed estensioni
2. Dall'albero al percorso
3. Da relativo ad assoluto
4. Risalire con i due punti
5. Copiare, spostare, rinominare
6. La dimensione dei file

## Regole comuni

- Il testo sta in righe `\text{…}` scritte con `textBlock`; le opzioni di testo sono `\text{…}`, su più righe con
  `\begin{gathered}` quando superano i 28 caratteri (il bottone della risposta sul telefono è largo 252 px).
- Niente trattini lunghi e niente "piuttosto che" (il `check()` lo controlla).
- I nomi di persona vengono da un elenco di dodici; nessun marchio nel testo.
- Nomi di file e percorsi in carattere da macchina da scrivere, `\texttt{…}`; la barra rovesciata si scrive
  `\textbackslash{}`. Nel testo stanno tra dollari, nelle opzioni da soli.
- Due scritture, metà ciascuna: con la barra dalla radice `/`, sotto `/home/<utente>` (sei utenti di tre lettere); con
  la barra rovesciata dalla radice `C:\`, sotto una cartella di sei lettere (`scuola`, `giochi`, `musica`, `lavoro`).
  Le due basi sono lunghe uguali.
- Nomi corti: cartelle di quattro lettere, file di otto caratteri. Nessun percorso delle opzioni supera i 28 caratteri,
  che è quanto entra nel bottone della risposta sul telefono.

## Livello 1: nomi ed estensioni

Sedici nomi base, alcuni scelti per ingannare (`musica`, `foto`, `video`), e le estensioni della tabella della
lezione. Due domande:

- tipo (circa 3 su 4): "Che tipo di file è `musica.txt`?" Risposta: Un documento di testo. Opzioni: il tipo giusto, il
  tipo suggerito dal nome se è diverso (Un file audio), altri due tra i nove tipi. In circa 3 casi su 10 il nome ha un
  punto in più (`gita.finale.jpg`).
- estensione (circa 1 su 4): "Qual è l'estensione del file `foto.mare.png`?" Risposta: `.png`. Distrattori:
  `.mare.png`, `.mare`, `foto`, `foto.mare`.

## Livello 2: dall'albero al percorso

Un albero da 6 a 9 righe, una per nome, con un rientro per ogni livello: la radice, la base, due cartelle con un file
ciascuna e, in metà dei casi, una sottocartella con un terzo file. I nomi sono tutti diversi. "Nell'albero ogni nome
sta dentro la cartella che lo precede con un rientro in meno. Qual è il percorso assoluto del file `inno.mp3`?"
Distrattori: il percorso senza la radice; senza una cartella intermedia; passando dalla cartella sorella; senza il
nome del file.

Esempi: `/home/ada/jazz/inno.mp3` (distrattore `home/ada/jazz/inno.mp3`); `C:\giochi\note\luna.jpg` (distrattore
`C:\giochi\arte\luna.jpg`).

## Livello 3: da relativo ad assoluto

"La cartella corrente è `/home/ada`. Qual è il percorso assoluto di `temi/tema.odt`?" Il percorso relativo ha due o
tre nomi e nessun `..`. Risposta: `/home/ada/temi/tema.odt`. Distrattori: il percorso relativo attaccato alla radice
(`/temi/tema.odt`); l'ultima cartella corrente persa (`/home/temi/tema.odt`); un nome saltato; senza la radice; senza
il file.

Secondo esempio: cartella corrente `C:\scuola\arte`, relativo `rock\coro.mp3`: `C:\scuola\arte\rock\coro.mp3`.

## Livello 4: risalire con i due punti

Come il livello 3, con uno o due `..` in testa al percorso relativo (due in circa un caso su tre), seguiti da uno, due
o tre nomi. Cinque forme: salire di uno e scendere in un'altra cartella; salire di uno fino a un file, da una cartella o da una
sottocartella; salire di due e scendere in un'altra cartella;
salire di due fino alla cartella di un altro utente (solo con la barra: con la barra rovesciata i distrattori non
starebbero nel bottone). Distrattori: i `..` ignorati (il relativo attaccato così com'è, il primo dei valori
sbagliati); un `..` in meno; un `..` in più; il resto attaccato alla radice; senza il file.

Esempi:

- cartella corrente `/home/ada/temi`, relativo `../foto/gita.jpg`: `/home/ada/foto/gita.jpg` (distrattore
  `/home/ada/temi/foto/gita.jpg`);
- cartella corrente `/home/ada/film`, relativo `../../lia/jazz/film.mp4`: `/home/lia/jazz/film.mp4`.

## Livello 5: copiare, spostare, rinominare

Un file in una cartella, una cartella di arrivo sorella, un nome nuovo con la stessa estensione. Cinque storie, circa 1
su 5 ciascuna:

- sposta: "Il file `/home/ada/temi/tema.odt` viene spostato nella cartella `/home/ada/foto`. Qual è ora il suo
  percorso assoluto?" Risposta: `/home/ada/foto/tema.odt`;
- copia: "… viene copiato nella cartella … Qual è il percorso assoluto della copia?";
- originale: "… Dopo la copia, qual è il percorso assoluto dell'originale?" Risposta: quello di partenza;
- rinomina: "… viene rinominato `rime.odt`. Qual è ora il suo percorso assoluto?";
- sposta e rinomina: le due operazioni di seguito.

Distrattori: il percorso di partenza; la cartella senza il nome del file; la cartella di arrivo dentro quella di
partenza; il nome nuovo nella cartella sbagliata.

## Livello 6: la dimensione dei file

Due domande, metà ciascuna:

- totale: "Una cartella contiene $40$ documenti da $250\,\text{kB}$ ciascuno. Sapendo che $1\,\text{MB} =
  1000\,\text{kB}$, quanti megabyte occupa la cartella?" Risposta: $10\,\text{MB}$. Numero di file tra dieci valori da
  20 a 400, dimensione tra dieci valori da 50 a $750\,\text{kB}$. Valori sbagliati: senza conversione ($10\,000$), con
  il fattore 100 o 10 000, il doppio, la metà.
- quanti: "Su una chiavetta restano $98\,\text{MB}$ liberi. Quanti video da $6\,\text{MB}$ ciascuno ci stanno per
  intero?" Risposta: $16$. La divisione ha sempre il resto. Valori sbagliati, nell'ordine: l'arrotondamento per eccesso
  ($17$), poi valori vicini.

## Esercizi da evitare

- Percorsi più lunghi di 28 caratteri, che escono dal bottone.
- Due nomi uguali nello stesso albero.
- Un nome nuovo con un'altra estensione (la lezione dice che rinominare non converte).
- I simboli KB o MB con il significato di 1024.

## Verifica

`scripts/exercises/checkers/inf_file_system.py` legge nomi e percorsi dal testo. Al livello 1 prende l'estensione dopo
l'ultimo punto e ne cerca il tipo nella sua tabella. Al livello 2 ricostruisce l'albero dai rientri e legge il
percorso dagli antenati del file. Ai livelli 3 e 4 applica il percorso relativo alla cartella corrente un pezzo alla
volta, e controlla quanti `..` e quanti nomi ci sono. Al livello 5 riconosce la storia e ricalcola il percorso. Al
livello 6 rifà il conto con frazioni esatte. Ogni opzione deve avere `values` uguale al percorso scritto e non
superare i 28 caratteri; una sola è giusta.

## Domande per la revisione

- Negli esercizi i nomi sono tutti minuscoli, per non entrare nella questione di maiuscole e minuscole. Va bene?
- Con la barra rovesciata la base è `C:\scuola` e non `C:\Utenti\ada`, per stare nel bottone. Va bene?
- Il livello 6 usa solo i multipli decimali (kB, MB), come le dimensioni dei file nei sistemi più recenti; i multipli
  binari sono nella lezione sulle unità e nella lezione sulla memoria. Va bene la divisione?
