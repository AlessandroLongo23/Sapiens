# Formulario: Le forze apparenti: forza centrifuga e forza di Coriolis

## La forza apparente

In un sistema che ha accelerazione $\vec A$ rispetto a un sistema inerziale, $\vec a = \vec a\,' + \vec A$ e

$$\vec F_{app} = -m\,\vec A \qquad \vec F_{tot} + \vec F_{app} = m\,\vec a\,'$$

- Verso opposto all'accelerazione del sistema, modulo $m\,A$.
- Proporzionale alla massa del corpo.
- Nessun corpo la esercita: non ha una reazione, e nel sistema inerziale non c'è.

## Risolvere un problema

1. Dal sistema inerziale: solo forze vere, $\vec F_{tot} = m\,\vec a$.
2. Dal sistema non inerziale: forze vere e $\vec F_{app}$; se il corpo è fermo rispetto al sistema è un problema di equilibrio.

| Situazione | Risultato |
|---|---|
| Pendolo nel veicolo che accelera | $\tan\theta = A/g$ |
| Corpo sul pavimento, attrito statico $\mu_s$ | non scivola se $A \le \mu_s\,g$ |
| Ascensore che accelera verso l'alto | il pavimento spinge con $m\,(g + A)$ |
| Ascensore che accelera verso il basso | il pavimento spinge con $m\,(g - A)$ |

## Forza centrifuga

In un sistema che ruota con velocità angolare $\omega$, su un corpo a distanza $r$ dall'asse, diretta verso l'esterno:

$$F_{cf} = m\,\omega^2\,r = \frac{m\,v^2}{r} \qquad \omega = \frac{2\pi}{T}$$

Corpo fermo sul piatto con attrito statico $\mu_s$: resta fermo se $\omega \le \sqrt{\mu_s\,g/r}$.

| | Dal suolo | Dal sistema che ruota |
|---|---|---|
| Il corpo | gira | è fermo |
| Forze | solo vere, risultante centripeta | vere e centrifuga |
| Equazione | $F_{tot} = m\,\omega^2 r$ | $F_{tot} - m\,\omega^2 r = 0$ |

## Forza di Coriolis

- Agisce solo sui corpi in moto rispetto al sistema che ruota.
- È perpendicolare alla velocità: devia, non cambia il modulo.
- Rotazione antioraria: devia a destra del moto. Rotazione oraria: a sinistra.
- Sulla Terra: a destra nell'emisfero nord, a sinistra nell'emisfero sud; nulla all'equatore per i moti orizzontali.
- Effetti: cicloni (antiorari a nord, orari a sud), alisei, correnti oceaniche, pendolo di Foucault.

```ad-warning
Le forze apparenti non hanno una reazione
Nessun corpo le esercita: il terzo principio non le riguarda.
```

```ad-warning
Centripeta e centrifuga non stanno nello stesso disegno
Dal suolo solo forze vere e accelerazione centripeta; dal sistema che ruota forze vere, centrifuga ed equilibrio.
```

```ad-warning
Il lavandino non è un ciclone
Su piccole distanze e tempi brevi la forza di Coriolis sulla Terra è trascurabile.
```
