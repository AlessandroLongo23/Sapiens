---
stato: decisa
aggiornato: 2026-10-02
tag: [decisione, laboratori, interazione]
---
# Nel laboratorio prendere e posare sono istantanei, senza il gesto di avvicinamento

## Decisione
Nei [[Laboratori]] non c'è più l'animazione della mano che va a prendere un oggetto o che lo posa. Al clic l'oggetto sparisce da dove sta e compare in mano, con un gesto generico: il braccio sale dalla posizione di riposo lungo il fianco ed entra nell'inquadratura. Alla posa l'oggetto compare sul banco e la mano si abbassa. Il passaggio è un taglio secco, senza dissolvenza. Lo stesso vale per i comandi che una mano libera usa dove stanno, il rubinetto del gas e gli occhiali: la leva gira e gli occhiali spariscono, e la mano fa solo il gesto generico.

Resta com'è la presa: come le dita tengono ogni oggetto una volta che è in mano, cioè il lavoro su `grips.json` e sul playground `/laboratorio/mani`. Restano anche le animazioni d'uso, dove la mano tiene già l'oggetto e lo porta su un bersaglio: la pipetta nell'acido, il travaso, mescolare, l'accendigas, il termometro nel becher.

## Perché
Alessandro, 2 ottobre 2026. Con un gesto di avvicinamento per ogni oggetto la mano finisce nel banco: se la presa della pipetta è in cima e la pipetta è distesa sul tavolo, la mano che va a prenderla entra nel tavolo; posando un becher, il becher entra nel tavolo insieme alla mano. Sistemare ogni animazione perché non ci siano collisioni non finisce mai. Tanti videogiochi fanno così: l'oggetto passa di colpo dal mondo alla mano.

Claude aveva proposto una dissolvenza di un decimo di secondo sul banco; Alessandro ha scelto il taglio secco, come nei videogiochi.

Non contraddice [[2026-09-30 I laboratori devono sembrare un videogioco, in uno stile pittorico e morbido]]: quella decisione chiede una presa e un gesto per ogni strumento, e la presa in mano e i gesti d'uso restano; va via solo il gesto per raggiungere l'oggetto.

## Conseguenze
Scritto nel codice locale lo stesso giorno, non committato:
- `src/components/lab/engine/hands.ts`: `grasp` mette l'oggetto in mano subito, con la presa scelta come prima, e il braccio sale da solo dalla posizione di riposo; `drop` lo mette sul banco e lascia scendere la mano; `gesture` è il gesto generico della mano libera. L'animazione di avvicinamento (`take`) resta solo per il primo prototipo guidato (`experiment.ts`, `Lab.tsx`), che nessuna pagina usa più.
- `src/components/lab/engine/free.ts`: prendere e posare usano `grasp` e `drop`.
- `src/components/lab/engine/esperimento.ts`: rubinetto e occhiali usano `gesture`.

Verificato nel browser senza schermo: i 28 controlli degli input passano nelle due stanze, e nei fotogrammi di una presa e di una posa della pipetta l'oggetto è già in mano, o sul banco, dal primo fotogramma.

Domande aperte:
- Nell'aula la pipetta è distesa sopra il quaderno fin dall'inizio (`scripts/lab/build_aula.py` mette il quaderno sotto di lei): va spostato nel modello, che poi va ricostruito con la sua luce. Per questo il controllo "occupato" della posa non conta ancora il quaderno.
- Il primo prototipo guidato (`Lab.tsx`, `experiment.ts`) non è raggiungibile da nessuna pagina: si può eliminare, e con lui l'ultima animazione di avvicinamento.
- Nella stanza condivisa gli altri vedranno gli oggetti dei compagni passare di colpo dal banco alla mano: da guardare quando ci sarà.

## Collegamenti
- [[Laboratori]], [[2026-10-02 Nel laboratorio il mouse prende e posa, Q ed E usano le mani]]
