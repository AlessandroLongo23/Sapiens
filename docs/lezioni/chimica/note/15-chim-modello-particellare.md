# Note: Il modello particellare della materia

Lezione nuova (biennio di chimica, gruppo 22, 30 settembre 2026). Conti rifatti in Python: molecole in una goccia di
$0{,}05\,\text{mL}$, $0{,}05/18{,}02 \cdot 6{,}02 \cdot 10^{23} = 1{,}67 \cdot 10^{21}$, cioè $2{,}1 \cdot 10^{11}$ per
ciascuno di $8{,}1$ miliardi di persone ("più di duecento miliardi"); esempio 1, $25 + 273 = 298$, $-196 + 273 = 77$,
$500 - 273 = 227$; esempio 2, $-10 + 273 = 263 > 250$. `check.mts` passa.

## Struttura

Le quattro idee del modello (particelle, vuoto, movimento, attrazioni), le dimensioni (molecola d'acqua, goccia, link
alla mole e ad "Atomi, molecole e ioni"), avviso sull'aria tra le particelle; i tre stati visti dalle particelle (figura,
tabella, avviso sul solido "fermo", link alla pressione dei gas); temperatura e agitazione, zero assoluto e scala
Kelvin (figura delle due scale, esempi, avviso sul segno), la figura interattiva; le prove (diffusione, moto browniano,
alcol e acqua, esempio della sfera e dell'anello con link alla dilatazione termica di fisica, avviso "le particelle non
cambiano"); i passaggi di stato con le particelle, in breve, con link alla lezione 19 e alla teoria cinetico-molecolare
del secondo anno.

## Scelte

- "Particelle" senza distinguere atomi, molecole e ioni, che arrivano nel capitolo successivo; la molecola d'acqua si
  nomina come esempio.
- La temperatura "misura l'agitazione media" (energia di movimento media), senza formula: l'energia cinetica media e
  $\tfrac{3}{2}kT$ sono della teoria cinetica del secondo anno. La frase "due corpi alla stessa temperatura hanno
  particelle con la stessa agitazione media, anche se sono sostanze diverse" è vera per l'energia cinetica media
  (equipartizione), non per la velocità: la figura interattiva segue la stessa scelta e lo dice nel codice.
- $T = t + 273$ come dice il README del biennio, con $273{,}15$ nominato.
- Moto browniano: Brown 1827, Einstein 1905, Perrin (misure del 1908-1909): date che ricordo, da verificare.

## Dati da verificare

- Dimensione della molecola d'acqua "circa $0{,}3$ nanometri" (valore comune, da verificare la fonte).
- $50\,\text{mL}$ di alcol e $50\,\text{mL}$ d'acqua danno "circa $97\,\text{mL}$": il valore più citato è tra $96$ e
  $97\,\text{mL}$ a seconda della temperatura, da verificare su una tabella delle densità delle miscele etanolo-acqua.
- Popolazione mondiale $8{,}1$ miliardi (2025, ordine di grandezza).

## Figure

Due TikZ, guardate in chiaro e in scuro: `particelle-tre-stati` (reticolo con i segni di vibrazione, liquido
disordinato sul fondo, gas con le frecce della velocità) e `particelle-scala-kelvin` (le due scale affiancate con zero
assoluto, fusione del ghiaccio ed ebollizione dell'acqua).

Interattiva `particelle-stati-temperatura` (`chimica/ParticelleStatiTemperatura.tsx`): trenta particelle in un recipiente
chiuso, sostanza a scelta (acqua, etanolo, azoto), temperatura da $-220$ a $150\,^\circ\text{C}$; lo stato viene dalle
temperature di fusione e di ebollizione. Moto scritto a mano: nel solido vibrazione sinusoidale attorno ai siti di un
reticolo, con ampiezza $\propto \sqrt{T}$; nel liquido gravità, repulsione a corto raggio e un termostato di Langevin
(smorzamento e spinte casuali $\propto \sqrt{T}$); nel gas rimbalzi sulle pareti, urti come repulsione, energia media
riportata a un valore $\propto T$. A destra la scala delle temperature della sostanza con i tre intervalli e un
indicatore. Con "Ferma" (o con il movimento ridotto) la figura calcola subito tre secondi di simulazione dopo ogni
cambio di stato. Guardata in chiaro, in scuro, sul telefono, con l'azoto (gas) e a $-35\,^\circ\text{C}$ (acqua
solida); nessun errore in console, nessuno scorrimento laterale. I pezzi comuni delle figure del gruppo (colori delle
particelle e degli stati, generatore casuale con seme) sono in `chimica/particelle-materia.ts`.

## Esercizi

Generatore `chim-modello-particellare`, quattro livelli (specifica in `specs/exercises/chim-modello-particellare.md`),
senza scene.

## Domande per Andrea

- Al primo anno si dice "la temperatura misura l'energia cinetica media delle particelle", o si resta su "agitazione"
  come fa la lezione?
- Il moto browniano con Einstein e Perrin è adatto al primo anno, o basta l'osservazione di Brown?
- La scala Kelvin è già nella lezione "Temperatura e calore" del gruppo 21: va bene rispiegarla qui in breve, o basta
  il link?
- La figura interattiva mostra tutte le sostanze con la stessa velocità alla stessa temperatura assoluta (vera per
  l'energia media, non per la velocità): è una semplificazione accettabile?
