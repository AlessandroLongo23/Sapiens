---
aggiornato: 2026-09-29
tag: [sessione, contenuti, fisica]
---
# Primo lotto di fisica

Sessione del 29 settembre 2026, seguito di [[2026-09-29 Figure di fisica]]. Alessandro ha chiesto se il programma di fisica fosse già pronto (sì: albero di 41 capitoli e 219 lezioni nel database dal 26 settembre, vedi [[2026-09-26 Fisica, informatica e medie hanno l'albero per anno dal programma]]) e poi di procedere con il lotto. Il lotto copre i primi tre capitoli del primo anno: le grandezze fisiche e la misura (9 lezioni), relazioni tra grandezze e grafici (3), i vettori e le forze (7). Sono le prime 19 lezioni di fisica complete, e sono pubblicate gratis come deciso in [[2026-09-29 La fisica si pubblica gratis accanto alla beta]].

## Cosa si è fatto
- Infrastruttura, prima del lotto (Claude):
  - il modulo di fisica del kit delle figure interattive, `src/components/content/interactive/fisica.tsx`: frecce con la punta `Stealth` misurata sul TikZ compilato, vettori con il nome, componenti, assi, suolo a trattini, blocchi, molle a zigzag, fili, piano inclinato, carrucole;
  - le scene negli esercizi, cioè un campo `scene` e `solutionScene` nel campione, disegnato nella pagina dai componenti di `src/components/content/exercises/scenes/`, anche nella scheda stampabile, con il tema scuro come le figure;
  - `scripts/lezioni/publish.mts --dir docs/lezioni/fisica`;
  - `scripts/fisica/indice.mts`, che scrive gli indirizzi e l'indice delle lezioni di fisica;
  - due script di anteprima: `scripts/figure/anteprima.mjs` per i blocchi TikZ, e `anteprima-interattivo.mjs` per figure interattive e scene, sulla pagina `/prova-fisica`, che esiste solo in sviluppo;
  - le convenzioni di fisica in `docs/lezioni/fisica/README.md`.
- Le 19 lezioni sono state scritte da cinque agenti in parallelo, uno per gruppo di argomenti (grandezze e unità, errori e incertezze, grafici, vettori, forze), ognuna con formulario, flashcard e note. Ci sono 68 figure TikZ (nelle lezioni e nei formulari), 17 figure interattive in 15 lezioni, 10 tipi di scena per gli esercizi e 19 generatori (100 livelli), tutti a scelta multipla con l'unità nell'opzione.
- Verifiche:
  - ogni generatore dà PASS con i seed 1, 50001 e 777001, boccia gli errori piantati e passa `review.mts` e `width.mts`;
  - i numeri delle lezioni sono stati rifatti in Python (oltre 400 controlli);
  - `check.mts` non dà errori, `tsc` ed ESLint sono puliti.
- Pubblicate con `publish.mts`: 68 figure nel bucket, teoria, formulario e flashcard delle 19 lezioni. Controllate sul sito in sviluppo, che legge lo stesso database, a 390 px: tutte le figure caricate, le 17 interattive montate, nessun errore di KaTeX, nessuna pagina che scorre di lato. Anche la scheda degli esercizi della lezione 14 è stata vista sul telefono, con 34 scene.
- Esercizi collegati al sito in `src/lib/exercises/config.ts`, `index.ts` e `level-names.ts`, con i nomi dei livelli presi dalle specifiche.

## Regole fissate nel lotto
Scritte nelle lezioni 04-08 e da rispettare in tutta la fisica (da confermare con Andrea):
- **Incertezza:**
  - l'incertezza di una serie è la semidispersione; per una misura sola, o quando la semidispersione è sotto la sensibilità, si prende la sensibilità intera;
  - il risultato si scrive $(\bar x \pm \Delta x)$, con l'incertezza a una cifra significativa e la media arrotondata alla stessa posizione.
- **Propagazione, nel caso peggiore:**
  - somme e differenze: si sommano le incertezze assolute;
  - prodotti e quozienti: si sommano le incertezze relative;
  - potenze: $n$ volte la relativa.
- **Compatibilità:** due misure sono compatibili se gli intervalli si sovrappongono.
- **Cifre significative:** nelle somme conta il numero di decimali, nei prodotti il numero di cifre significative. I numeri esatti non limitano il risultato.

## Informazioni nuove
- node-tikzjax non disegna i riempimenti `pattern=`: suolo e pareti si tratteggiano a trattini, in TikZ e nel kit.
- Pezzi che gli agenti hanno scritto per conto loro e che andrebbero portati nel kit:
  - il dinamometro (`interactive/fisica/Dinamometro.tsx`, usato da due figure e una scena);
  - un righello in centimetri;
  - la griglia con i punti che scattano e il nome con il meno davanti (`fisica/griglia.tsx`);
  - la disposizione dei nomi senza sovrapposizioni (`fisica/nomi.ts`);
  - le tacche numerate sugli assi, scritte a mano in due posti.
- Difetti del kit, segnalati dal gruppo dei vettori:
  - `VecLabel` stima la larghezza delle lettere in modo grezzo, quindi la freccia sopra la "b" è spostata;
  - non si può centrare un nome in un punto;
  - il punto trascinabile copre la punta della freccia.

  `Components` scriveva la freccia anche sulle componenti ed è stato corretto. `VecLabel` non è stato toccato perché molte figure dipendono dalla sua geometria.
- Esercizi poco vari, da tenere d'occhio: il livello 1 della relazione di laboratorio (circa 500 diversi su 1000), i livelli 1 e 2 dell'incertezza relativa (circa 580), il livello 3 delle operazioni con i vettori (circa 250, le terne pitagoriche leggibili sono poche).
- Fonti da verificare, segnate nelle note: citazioni di Galileo, date del SI, valori di $g$ (NASA Planetary Fact Sheet, 18 marzo 2025), coefficienti di attrito (Engineering ToolBox, senza data), densità.
- I grafici marcati `% poi-interattivo` elencano cosa servirà al piano cartesiano del kit: punti trascinabili lungo una retta con le proiezioni, una retta da spostare a mano tra i punti, il triangolo della pendenza con le unità, scale indipendenti con tacche numerate, il passaggio animato tra $p(V)$ e $p(1/V)$, punti che compaiono da una tabella. Vedi [[Grafici e simulazioni interattive]].

## Domande aperte
- Le domande di contenuto sono in [[Domande per Andrea]], nella sezione del primo lotto di fisica; quelle di ogni lezione nelle note `docs/lezioni/fisica/note/`.
- I prerequisiti delle lezioni di fisica non sono scritti: il grafo di `docs/lezioni/prerequisiti.md` è solo di matematica, e un arco dalla fisica alla matematica (per esempio verso "Seno, coseno e tangente") non è previsto dallo script.

## Stato
In produzione. Lezioni pubblicate nel database; il codice è entrato in master con la PR #13 (unita con master, che nel frattempo aveva il cestino dello Zaino e gli adesivi per argomento) ed è online dal 29 settembre 2026. Controllato su `sapiens-edu.vercel.app` a 390 px: le lezioni 14 e 19 con tutte le figure e le interattive montate, la scheda della 14 con 34 scene. Il pre-push non passava nel working tree condiviso, perché la build includeva i file non committati del laboratorio di un'altra sessione: il push è partito da un worktree pulito del branch.

## Prossimo argomento
Il secondo lotto di fisica (equilibrio dei solidi e dei fluidi, ottica: 18 lezioni), oppure il terzo anno di matematica.
