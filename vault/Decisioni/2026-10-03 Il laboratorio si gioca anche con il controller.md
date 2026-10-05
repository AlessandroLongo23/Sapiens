---
stato: decisa
aggiornato: 2026-10-03
tag: [decisione, laboratori, interazione]
---
# Il laboratorio si gioca anche con il controller

## Decisione
I [[Laboratori]] si giocano anche con un controller PlayStation o Xbox, deciso da Alessandro il 3 ottobre 2026. Le etichette a schermo seguono il dispositivo usato per ultimo: i simboli e i nomi del controller PlayStation (L1, L2, quadrato…), quelli dell'Xbox (LB, LT, X…), oppure tastiera e mouse.

La disposizione tiene la regola delle due mani, un lato del controller per mano:

| Azione | Tastiera e mouse | PlayStation | Xbox |
|---|---|---|---|
| Muoversi | WASD | levetta sinistra | levetta sinistra |
| Correre | Shift | L3 (levetta premuta) | L3 |
| Guardare | mouse | levetta destra | levetta destra |
| Prendere e posare, mano sinistra | clic sinistro | L2 | LT |
| Prendere e posare, mano destra | clic destro | R2 | RT |
| Usare, mano sinistra | Q | L1 | LB |
| Usare, mano destra | E | R1 | RB |
| Ruotare l'oggetto da posare | R, rotella | quadrato, croce direzionale | X, croce direzionale |
| Regolare (pipetta, gas, aria) | rotella | croce direzionale su e giù | croce direzionale su e giù |
| Abbassarsi | C | cerchio | B |
| Avvicinare lo sguardo | Z | triangolo, R3 | Y, R3 |
| Entrare | clic | croce | A |
| Pausa e ripresa | Esc | Options | Menu |

## Perché
Alessandro vuole il laboratorio compatibile con i controller, con le etichette giuste per ciascuno. I grilletti per prendere e i dorsali per usare tengono la corrispondenza sinistra e destra con le mani, che è la regola di [[2026-10-02 Nel laboratorio il mouse prende e posa, Q ed E usano le mani]].

Alternative discusse: per la pipetta, la corsa analogica del grilletto al posto della croce direzionale. Scartata per ora perché quel grilletto fa già "posa".

## Conseguenze
Scritto nel codice locale lo stesso giorno, non committato:
- `src/components/lab/engine/pad.ts` (nuovo): il dispositivo in uso, il riconoscimento PlayStation o Xbox dal nome del controller (uno sconosciuto prende le etichette Xbox), i nomi dei tasti, e `tell`, che scrive nei testi il tasto del dispositivo in uso (nei suggerimenti i tasti stanno tra graffe: `{Q}`, `{clic}`, `{gira su}`).
- `src/components/lab/engine/fps.ts`: lettura del controller a ogni fotogramma con la Gamepad API del browser. Zona morta delle levette 0,14, risposta quadratica, croce direzionale come rotella (un tocco dà uno scatto piccolo, tenuta premuta accelera).
- Il browser non cattura il mouse per un tasto del controller: con il controller si entra e si mette in pausa senza cattura.
- `src/components/lab/hud.tsx`: i tasti del controller nel riquadro delle azioni, la legenda dei comandi e la riga iniziale per dispositivo, la sensibilità delle levette nelle impostazioni. `Esperimento.tsx` e `Banco.tsx` usano questi pezzi.
- Suggerimenti del quaderno e messaggi in `esperimento.ts`, `banco.ts` e `free.ts` riscritti con i tasti tra graffe; il quaderno si ridisegna quando cambia il dispositivo.

Verificato nel browser senza schermo con un controller simulato (`scripts/lab/pad.mjs`): 20 controlli su 20 sul banco singolo e nell'aula. Non ancora provato con un controller vero.

Domande aperte:
- La sensazione delle levette (velocità, zona morta, curva) va giudicata con il controller in mano.
- Nel menu di pausa "Ricomincia" ed "Esci" si scelgono solo con il mouse; con il controller si può solo riprendere.
- Niente inversione dell'asse verticale e niente vibrazione.
- Il riconoscimento del DualShock 4 in Chrome e Safari su macOS con la disposizione standard è da verificare sul Mac di Alessandro.

## Collegamenti
- [[Laboratori]]
