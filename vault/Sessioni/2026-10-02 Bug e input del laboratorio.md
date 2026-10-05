---
aggiornato: 2026-10-02
tag: [sessione, laboratori]
---
# Bug e input del laboratorio

Sessione di lavoro sul codice dei [[Laboratori]], 2 ottobre 2026, sul branch `grafico-funzioni`. Niente è committato.

## Cinque bug corretti
Il dettaglio di ognuno, con le misure, è in [[Laboratori]] sotto "Bug corretti".
- Rettangoli neri su gran parte dello schermo: un NaN nello shader dei raggi di sole, allargato dal bloom.
- Gli occhiali "tolti" da un clic sul banco e mai più indossabili: da indossati restavano cliccabili, invisibili, davanti al viso.
- La pipetta che si svuotava a 14 cm dal becher con la mano destra: il polso non arrivava alla posa chiesta.
- I palazzi fuori dalla finestra tagliati a 40 m: la camera ora disegna fino a 400 m (corretto il 3 ottobre).
- L'anteprima dell'imbuto con la carta distesa, e l'imbuto posato in piedi a mezz'aria: ora l'anteprima segue la piega e l'imbuto si posa disteso.

## Due decisioni
[[2026-10-02 Nel laboratorio il mouse prende e posa, Q ed E usano le mani]]: scritta e verificata nel browser senza schermo.

[[2026-10-02 Nel laboratorio prendere e posare sono istantanei, senza il gesto di avvicinamento]]: scritta e verificata allo stesso modo. Alessandro ha scelto il taglio secco, senza dissolvenza.

## Rimasto da fare
- Riprovare tutto a mano nel gioco: le verifiche sono state fatte nel browser senza schermo.
- Committare il lavoro del laboratorio, da decidere su quale branch: oggi è nell'albero di `grafico-funzioni` insieme al plotter.
- Decidere se eliminare il primo prototipo guidato (`Lab.tsx`, `experiment.ts`), che nessuna pagina usa più.
- Nell'aula la pipetta è distesa sopra il quaderno: spostare il quaderno in `scripts/lab/build_aula.py` e ricostruire il modello.
- L'imbuto tolto dalla beuta non si può rimettere sopra: se succede prima di filtrare, l'esperimento si blocca.
- La manica del camice copre ancora buona parte dell'inquadratura quando la mano lavora in alto.
