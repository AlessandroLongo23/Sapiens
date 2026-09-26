---
stato: decisa
aggiornato: 2026-09-26
tag: [decisione, contenuti]
---
# Fisica, informatica e medie hanno l'albero per anno dal programma

## Decisione
Fisica e informatica delle superiori e le materie delle medie hanno un albero di capitoli e lezioni costruito sul programma ministeriale e sui libri più diffusi, con i capitoli divisi per anno come la matematica e la chimica. Le superiori seguono il liceo scientifico: fisica del liceo scientifico, informatica del liceo scientifico delle scienze applicate. Le medie hanno tre materie: matematica, Scienze intera (fisica, chimica, biologia, Terra e astronomia) e Tecnologia intera (compresa l'informatica). L'università resta com'è, se ne parla dopo.

## Perché
Alessandro, il 26 settembre 2026: matematica e chimica delle superiori erano organizzate per anno, fisica e informatica no, e le medie avevano solo quattro capitoli di matematica. Vuole finire di organizzare medie e superiori secondo i programmi ministeriali.

Alle medie fisica e informatica non sono materie: la fisica sta in Scienze e l'informatica in Tecnologia. Claude ha proposto Scienze intera e un'Informatica ricavata dalla parte digitale di Tecnologia; Alessandro ha scelto Scienze intera e Tecnologia intera, cioè le materie come stanno sul registro. Alternative scartate: una "Fisica" delle medie separata, o Scienze con la sola fisica e chimica; niente informatica alle medie. Per le superiori è stato scartato di aggiungere il triennio dell'ITIS informatica (sistemi e reti, TPSIT, basi di dati), molto più grande; il liceo scientifico è coerente con [[2026-09-23 La v1.0 è lo STEM del liceo scientifico]].

Sulle scelte di dettaglio Alessandro ha approvato le raccomandazioni di Claude: Python come linguaggio di informatica (i libri Hoepli e l'unica scuola letta usano C/C++); alberi interi anche dove superano la stima (fisica 219 lezioni, scienze 187); in tecnologia le lezioni che si ripetono con scienze (lavoro ed energia, legge di Ohm, alimentazione) restano, perché ogni materia deve stare in piedi da sola come nei libri; le 20 lezioni di informatica che vengono dalla bozza delle nuove Indicazioni dei licei (intelligenza artificiale, grafi, crittografia) restano anche se la bozza non è definitiva; gli anni di fisica seguono i volumi dell'Amaldi.

## Conseguenze
- Alberi, fonti e motivazioni in `docs/lezioni/fisica/`, `docs/lezioni/informatica/` e `docs/lezioni/medie/{matematica,scienze,tecnologia}/`, un `programma.md` e un `albero.md` per materia. Applicati al database il 26 settembre 2026 con `scripts/lezioni/tree.mts`:

| Materia | Capitoli | Lezioni |
|---|---|---|
| Fisica, superiori | 41 | 219 |
| Informatica, superiori | 36 | 171 |
| Matematica, medie | 33 | 150 |
| Scienze, medie (nuova, slug `science`) | 39 | 187 |
| Tecnologia, medie (nuova, slug `technology`) | 29 | 135 |

- Tutte le lezioni sono vuote: il sito le mostra "in preparazione". Le lezioni di oggi, tutte vuote, sono state riusate o assorbite; nessun indirizzo pubblicato cambia.
- Le Nuove Indicazioni del primo ciclo sono in vigore: DM 221/2025, in Gazzetta il 27 gennaio 2026, dalle prime del 2026/27. Gli alberi delle medie ne tengono conto (sistema binario, algoritmi, luce come onda, energia nucleare, informatica in tecnologia). Vedi [[Programma ministeriale]].
- La beta resta di sola matematica delle superiori ([[2026-09-23 Beta a pagamento a gennaio 2027 con la sola matematica]]); le medie non hanno ancora una data.
- Codice: `tree.mts` accetta `--level` e `--title` e crea la materia quando manca; legge la tabella a pagine, perché con 1.509 righe una sola query si fermava a 1.000. Lo stesso limite toccava il sito (`src/lib/server/content.ts`) e `scripts/chimica/pubblica.mts`, corretti nel codice. In produzione, con il codice vecchio, dopo l'applicazione la matematica mostrava 4 capitoli su 39: per rimediare senza deploy Claude ha portato `max_rows` di PostgREST da 1.000 a 10.000 (API di gestione di Supabase, `PATCH /v1/projects/godqhjgwmlzfnymzhqdq/postgrest`). Scienze e Tecnologia hanno icona e colore in `src/lib/utils/icons.ts` (i colori di chimica e informatica).
- Da fare: i testi delle pagine delle materie in `src/lib/content/subject-copy.ts` (fisica, informatica, matematica delle medie, e le due materie nuove), quando il file non è più in modifica in un'altra sessione; `scripts/check-placeholder.mjs` legge ancora al massimo 1.000 righe.

## Collegamenti
- [[2026-09-25 I capitoli si mostrano per anno]]
- [[2026-09-26 La chimica si pubblica gratis accanto alla beta]]
- [[2026-09-23 Superiori STEM come segmento iniziale]]
- [[Programma ministeriale]], [[Lezioni]], [[2026-09-26 Alberi di fisica, informatica e medie]]
