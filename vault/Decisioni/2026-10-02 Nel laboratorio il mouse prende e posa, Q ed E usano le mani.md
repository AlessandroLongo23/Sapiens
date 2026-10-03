---
stato: decisa
aggiornato: 2026-10-02
tag: [decisione, laboratori, interazione]
---
# Nel laboratorio il mouse prende e posa, Q ed E usano le mani

## Decisione
Nei [[Laboratori]] gli input seguono una regola sola, decisa da Alessandro il 2 ottobre 2026.

- Il tasto sinistro e il tasto destro del mouse afferrano e posano gli oggetti, con la mano sinistra e con la destra. Non fanno altro.
- Q ed E interagiscono, sempre con la mano sinistra e con la destra: aprire e chiudere il rubinetto, mettere gli occhiali, usare lo strumento che la mano tiene su quello che si punta. "Prendere e aprire" è una sola azione, non due passaggi.
- Con un oggetto per mano, Q fa l'azione del sinistro sul destro ed E quella del destro sul sinistro, quando sono possibili tutte e due (due recipienti con del liquido: Q versa il sinistro nel destro, E il destro nel sinistro). Se è possibile una sola azione (un termometro e un recipiente), la fa uno qualunque dei due tasti.
- Il quaderno è un oggetto sul banco con cui si interagisce: non compare più dal nulla con Q.

## Perché
Alessandro vuole uniformare gli input. Prima erano mescolati: il clic prendeva e posava ma girava anche il rubinetto e indossava gli occhiali, F usava lo strumento in mano o le due mani insieme (scegliendo da solo quale recipiente versare), E valeva come clic destro e Q alzava il quaderno dal nulla.

Alternative discusse: nessuna, la regola è arrivata già formata.

## Conseguenze
Scritto nel codice locale lo stesso giorno, non committato:
- `src/components/lab/engine/fps.ts` e `scene.ts`: Q ed E arrivano alla scena come uso della mano sinistra e destra; F e "E come clic destro" non ci sono più.
- `src/components/lab/engine/free.ts`: il clic prende e posa soltanto; le azioni a due mani stanno su Q ed E secondo la regola; il quaderno si legge puntandolo sul banco con Q o E (leggere non occupa una mano, quindi vale qualunque cosa si tenga) e si chiude con gli stessi tasti; mentre è alzato sparisce dal banco.
- `src/components/lab/engine/esperimento.ts`: pipetta, accendigas, termometro, spatola, bacchetta, carta da filtro e travasi stanno sul tasto della mano che tiene lo strumento; rubinetto e occhiali sul tasto di una mano libera; "il menisco è sulla tacca" sul tasto della mano con la pipetta; il riposo di due giorni su tutti e due. Il termometro entra anche in un recipiente tenuto nell'altra mano. I suggerimenti del quaderno sono riscritti.
- `src/components/lab/hud.tsx`: i tasti Q ed E nel riquadro delle azioni; un'azione che fanno tutti e due sta su una riga sola. Menu di pausa e riga iniziale aggiornati in `Esperimento.tsx` e `Banco.tsx`.
- La rotella resta per regolare (ghiera, fiamma, propipetta).

Verificato nel browser senza schermo con 28 controlli, sul banco singolo e nell'aula, più 5 sulla pagina `/laboratorio/banco`.

Supera in parte [[2026-09-30 I laboratori devono sembrare un videogioco, in uno stile pittorico e morbido]], dove il quaderno si alzava con Q.

Domande aperte:
- "Prendere e aprire" in una sola azione: oggi nessun oggetto dell'esperimento si apre (il barattolo dell'ossido è già aperto). La regola vale per i prossimi, per esempio le bottiglie con il tappo.
- Togliersi gli occhiali non è previsto.
- Con tutte e due le mani occupate il rubinetto mostra "Serve una mano libera": resta da vedere se va bene in gioco.

## Collegamenti
- [[Laboratori]], [[Laboratorio condiviso]]
