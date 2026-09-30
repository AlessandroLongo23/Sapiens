# Note: Il moto circolare uniforme

Lezione nuova (terzo lotto di fisica, gruppo 14, 30 settembre 2026). Conti rifatti in Python: $1400/60 = 23{,}33$ Hz,
$60/1400 = 0{,}04286$ s; $2\pi \cdot 18/300 = 0{,}3770$ m/s; $2\pi \cdot 6{,}38 \cdot 10^6/86\,400 = 463{,}97$ m/s,
$\cdot 3{,}6 = 1670$ km/h; $2\pi/60 = 0{,}1047$, $2\pi/3600 = 1{,}745 \cdot 10^{-3}$ rad/s; $2\pi \cdot 3{,}0 = 18{,}85$ rad/s,
$18{,}85 \cdot 0{,}34 = 6{,}41$ m/s ($23{,}1$ km/h), $3{,}0 \cdot 0{,}34 = 1{,}02$; $2\pi/6{,}0 = 1{,}047$, $1{,}047 \cdot 2{,}5 =
2{,}618$; $1\,\text{rad} = 57{,}30^\circ$. `check.mts` passa.

## Struttura

La definizione e la velocità tangente (figura), il rimando all'accelerazione centripeta; periodo, frequenza, hertz e giri
al minuto (esempio 1, avviso); la velocità tangenziale $2\pi r/T$ (esempi 2 e 3); i radianti (definizione come arco su
raggio, figura del radiante, conversione, tabella); la velocità angolare (esempio 4); $v = \omega r$ (figura della
giostra, esempi 5 e 6, avviso sui radianti); la figura interattiva.

## Scelte

- I radianti sono spiegati qui per quanto serve (arco su raggio, conversione, tabella), con il link alla lezione di
  matematica di goniometria, che al liceo arriva più tardi.
- Il giorno di $24$ h per la rotazione della Terra, senza il giorno siderale: il risultato cambia dello $0{,}3\%$.
- $v = \omega r$ si ricava dividendo le due formule con il periodo, non con il limite di $\Delta\theta/\Delta t$.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `moto-circolare-velocita-tangente`, `radiante-arco-uguale-raggio`,
`giostra-velocita-raggio` (le due velocità in proporzione ai raggi, $0{,}8$ e $2$ cm). Interattiva
`moto-circolare-radianti` (`fisica/MotoCircolareRadianti.tsx`, che usa `fisica/MotoCircolare.tsx`): raggio
$0{,}5$-$2{,}0$ m e periodo $2$-$10$ s, arco spazzato in arancione, letti $\theta$ in radianti e gradi, l'arco $\theta r$,
$\omega$ e $v$.

## Esercizi

Generatore `fis-moto-circolare-uniforme`, cinque livelli (specifica in `specs/exercises/fis-moto-circolare-uniforme.md`),
senza scene.

## Domande per Andrea

- I radianti al secondo anno: l'Amaldi li introduce nel capitolo dei moti nel piano o usa solo $v = 2\pi r/T$ e rimanda
  $\omega$? (da verificare)
- "Velocità tangenziale" o "velocità lineare"?
- I $1400$ giri al minuto della lavatrice sono trattati come numero esatto: va detto così, o meglio dati come
  $1{,}4 \cdot 10^3$?
