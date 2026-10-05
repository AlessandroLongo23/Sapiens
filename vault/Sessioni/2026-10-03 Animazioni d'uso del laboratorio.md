---
aggiornato: 2026-10-03
tag: [sessione, laboratori]
---
# Animazioni d'uso del laboratorio

Sessione di lavoro sul codice dei [[Laboratori]], 3 ottobre 2026, sul branch `grafico-funzioni`. Niente è committato. Continua [[2026-10-02 Bug e input del laboratorio]].

## Cosa si è fatto
Alessandro ha chiesto di registrare ogni animazione d'uso, guardarne i fotogrammi e sistemarle tutte, e una presa diversa per l'accendigas, con l'indice sul grilletto.

Lo strumento di misura è nel repo: `scripts/lab/usi.mjs` esegue le 14 azioni d'uso con la mano sinistra e con la destra in una stanza, salva i fotogrammi e scrive le misure; `scripts/lab/usi_sheets.py` ne fa un foglio per azione. Il dettaglio di cosa è cambiato è in [[Laboratori]], sotto "Animazioni d'uso".

Stato alla fine: 28 azioni su 28 passano sul banco singolo e 28 su 28 nell'aula.

## Altre correzioni della giornata
Dettaglio in [[Laboratori]]: la presa dell'accendigas rifatta due volte su indicazione di Alessandro, fino al pollice disteso sul bottone con un parametro per il giro del polso; l'inerzia del trackpad sulla pipetta; la posa degli oggetti dal centro; il quaderno che riconosce i passi fatti in un altro ordine; la rotazione dell'oggetto da posare con la rotella e R. In coda, il velo di liquido che restava sul fondo dopo ogni versamento: tre cause in `pour`, misurate con il nuovo `scripts/lab/versa.mjs`. Infine il controller: vedi [[2026-10-03 Il laboratorio si gioca anche con il controller]]. Dopo la prima prova di Alessandro, la spatola: prelievo e versamento anche con il barattolo o il becher in mano, posa orizzontale, versamento con il giro del polso (sezione "La spatola" in [[Laboratori]]). E l'imbuto, che ora si posa su qualunque contenitore su cui regge, nella posizione calcolata dalle due forme (sezione "L'imbuto sui contenitori"). Infine lo stato reso visibile: il letto di polvere che cresce, il liquido spostato dal solido, il barattolo che si svuota (sezione "Lo stato dell'esperimento e quello che se ne vede").

## Rimasto da fare
- Riprovare a mano: le misure dicono dove sta la punta dello strumento, il giudizio su tempi e naturalezza dei gesti resta di chi guarda.
- La presa dell'accendigas è a bacchetta, con il pollice disteso sul bottone, come nella foto di Alessandro: da rivedere a mano nel gioco.
- Il braccio copre ancora parte dell'inquadratura quando la mano lavora in alto (termometro e bacchetta nel becher sulla reticella).
- Gli script di prova degli input del 2 ottobre erano in una cartella temporanea e sono andati persi: restano da riscrivere nel repo.
- Il server di sviluppo di Sapiens è sulla porta 3001 a fine sessione (sulla 3000 c'è un altro progetto): `LAB_URL=http://localhost:3001`.
- Provare il laboratorio con il DualShock 4 vero: sensibilità e zona morta delle levette, riconoscimento nel browser. Il menu di pausa con il controller permette solo di riprendere.
- Guardare nel playground come le dita chiudono sulla spatola nella presa nuova (lungo le dita, palmo in su).
