---
aggiornato: 2026-09-30
tag: [sessione, contenuti, fisica]
---
# Terzo lotto di fisica

Sessione del 30 settembre 2026, seguito di [[2026-09-30 Secondo lotto di fisica]]. Alessandro ha chiesto di andare avanti con la fisica. Il lotto è tutto il secondo anno, lezioni 38-70, in sei capitoli:
- il moto rettilineo (7 lezioni);
- i moti nel piano (5);
- i principi della dinamica (4);
- le forze e il movimento (5);
- lavoro ed energia (6);
- la temperatura e il calore (6).

Con i primi due lotti le lezioni di fisica complete sono 70, il primo e il secondo anno. Pubblicate gratis come deciso in [[2026-09-29 La fisica si pubblica gratis accanto alla beta]].

## Cosa si è fatto
- Prima del lotto (Claude):
  - nel README di fisica, le notazioni del secondo anno, fissate per tutti i gruppi perché le lezioni si richiamano a vicenda: $s$, $\Delta s$, $v_0$, $a$; $T$, $f$, $\omega$, $a_c$; $\vec F_{tot} = m\vec a$; $W$, $P$, $K$, $U$, $E$; $t$ in gradi Celsius, $T$ in kelvin, $Q$, $c$, $C$, $L$;
  - come si disegnano i grafici spazio-tempo e velocità-tempo finché non c'è il piano cartesiano del kit;
  - un file di istruzioni comuni letto da tutti gli agenti, con una regola nuova: una figura si registra solo dopo averne creato il file (nel secondo lotto una registrazione anticipata aveva bloccato il sito di sviluppo).
- Le 33 lezioni sono state scritte da nove agenti in parallelo, ognuna con formulario, flashcard e note. In tutto ci sono:
  - 103 figure TikZ;
  - 34 figure interattive, fra cui l'auto con i grafici che si tracciano mentre si muove, il grafico velocità-tempo a tratti da modificare, il lancio verticale, la barca sul fiume, il moto circolare e l'ombra del moto armonico, il carrello del secondo principio, l'ascensore con la bilancia, il diagramma delle forze da costruire, la macchina di Atwood, il proiettile dal tavolo, il pendolo ad ampiezza grande, le montagne russe con le barre dell'energia, la frenata che quadruplica, il termometro a tre scale, la sbarra che si dilata, l'equilibrio termico e la curva di riscaldamento dell'acqua;
  - scene nuove negli esercizi;
  - 33 generatori, per 173 livelli.
- Verifiche:
  - ogni generatore dà PASS con i seed 1, 50001 e 777001, boccia gli errori piantati e passa `review.mts` e `width.mts`;
  - i numeri delle lezioni sono rifatti in Python;
  - `check.mts` non dà errori, `tsc` ed ESLint sono puliti.
- Pubblicate: 103 figure e 99 colonne. Controllate sul sito di sviluppo a 390 px le 33 lezioni e le schede, anche muovendo i cursori e premendo i bottoni delle figure interattive.

## Informazioni nuove
- Nel kit mancano ancora pezzi che i gruppi hanno riscritto più volte, e vanno portati nel kit comune:
  - le tacche numerate sugli assi, scritte in almeno cinque file;
  - l'auto, copiata da `MotoIncontro.tsx` in tre figure;
  - il termometro;
  - le barre dell'energia (`fisica/energia.tsx`);
  - un grafico a tratti con valori negativi (la scena `grafico-dati` parte da zero; il gruppo della cinematica ha scritto `grafico-velocita-tempo`);
  - un'etichetta con lettera in corsivo e unità diritta ("$F$ = 50 N").
- Difetti di componenti comuni:
  - `Slider` accavalla l'unità al numero ("2,0m/s");
  - `ToggleGroup` non va a capo oltre quattro o cinque opzioni;
  - la scena `blocco-forze` fa partire tutte le forze dal centro, quindi una spinta verso il basso attraversa il pavimento.
- Due moduli comuni per la termologia, scritti in parallelo: `fis-termologia.ts` e `fis-calore.ts`. Da unire.
- `\tfrac` non compila nei nodi TikZ (scritto nel README). KaTeX rifiuta `\text{m/s^2}`: i gruppi scrivono `\text{m/s}^2`, e nei generatori già pubblicati la forma sbagliata non c'è.
- La regola degli zeri finali ambigui (40 N) negli esercizi è stata messa nel README: il generatore del piano inclinato del secondo lotto li ammette ancora.
- Esercizi poco vari dove il dato è uno solo, per esempio la conversione km/h ↔ m/s (80 diversi), i livelli 3 e 4 di `fis-temperatura` (58 e 38), il livello 1 di `fis-piano-inclinato` (circa 200).
- Un agente ha letto delle diapositive dell'Amaldi su un sito con il certificato HTTPS scaduto, scaricandole senza verificarlo: la fonte va considerata non verificata.

## Domande aperte
- Le domande di contenuto sono in [[Domande per Andrea]], nella sezione del terzo lotto; quelle di ogni lezione nelle note `docs/lezioni/fisica/note/38-70`.
- I simboli della dilatazione ($\lambda$ lineare e $\alpha$ volumica) li ha fissati il README "come l'Amaldi, da verificare", e la conducibilità termica usa anch'essa $\lambda$: se l'Amaldi fa così va bene, altrimenti va cambiata la lezione 66.

## Stato
In produzione dal 30 settembre 2026 con la PR #16 (master non si era mosso, nessun conflitto). Controllate su `sapiens-edu.vercel.app` a 390 px le lezioni 43, 53 e 70 con le loro schede: figure caricate, interattive montate, scene disegnate, nessun errore.

## Prossimo argomento
Un giro sul kit, per portarci i pezzi riscritti più volte e correggere `Slider` e `ToggleGroup`. Poi il terzo anno di fisica, oppure il terzo anno di matematica.
