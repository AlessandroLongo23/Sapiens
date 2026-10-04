---
stato: decisa
aggiornato: 2026-10-04
tag: [decisione, informatica, lezioni]
---
# L'editor di codice ha anche JavaScript e le pagine web

## Decisione
Alessandro, 4 ottobre 2026: l'[[Editor di codice]] ha anche HTML, CSS e JavaScript, per gli esercizi di programmazione web. Sulla proposta di Claude ha detto "vai":
1. un editor a tre linguette (HTML, CSS, JavaScript) con l'anteprima della pagina al posto della console;
2. l'anteprima in un iframe isolato, come i programmi;
3. una console sotto l'anteprima;
4. nelle lezioni lo stesso blocco `codice`;
5. gli esercizi di pagina corretti con controlli sulla struttura, quelli di JavaScript senza pagina corretti sull'uscita come Python. I controlli sul comportamento (un clic che cambia la pagina) si fanno quando arrivano le lezioni che li chiedono.

## Perché
Il browser esegue questi linguaggi da solo, quindi non c'è niente da scaricare. La parte difficile era l'isolamento, già fatto il giorno stesso ([[2026-10-04 I programmi dell'editor girano in un iframe senza l'origine del sito]]).

## Scelte di Claude, da confermare
- JavaScript è due cose nell'editor: "JavaScript" è un programma con la console (`prompt()` legge, `console.log()` scrive), "Pagina web" sono i tre file con l'anteprima.
- I tre file si collegano come in una pagina vera, con `<link>` e `<script src>`. Un file non collegato non viene applicato e l'editor lo dice: è l'errore tipico di chi comincia.
- L'anteprima segue i tasti solo se la pagina non ha script; con uno script aspetta "Esegui".
- Un ciclo in uno script di pagina viene fermato dopo 2 secondi.
- I nomi dei file sono fissi: `index.html`, `style.css`, `script.js`.

## Conseguenze
- Aggiornate [[Editor di codice]], `docs/lezioni/README.md` (il formato dei blocchi e dei controlli) e l'articolo dello strumento.
- Le lezioni di HTML e CSS dell'albero sono al terzo anno: non sono scritte.

## Collegamenti
- [[Editor di codice]], [[2026-10-03 L'editor di codice ha Python, C e C++, tutti eseguiti nel browser]]
- [[2026-10-04 Isolamento dell'editor di codice]]
