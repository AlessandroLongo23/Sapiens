---
stato: decisa
aggiornato: 2026-09-23
tag: [decisione, business]
---
# Piani che crescono con le funzioni

## Decisione
Un piano esiste quando serve un tipo di cliente diverso e quando le sue funzioni esistono già. La scala di riferimento:

| Piano | Per chi | Cosa | Quando |
|---|---|---|---|
| Free | chi scopre Sapiens | teoria, formulari e calcolatrici, diario, Zaino limitato, una sessione di esercizi al giorno | beta |
| Studio, €7,99-9,99 | chi si allena con regolarità | esercizi illimitati con progressi, Zaino illimitato, Sapiens AI con limite giornaliero, flashcard | beta |
| Plus, circa €15-20 | chi prepara verifiche ed esami | ripasso pianificato, AI sugli appunti, video di esercizi svolti, simulazioni di verifica | quando queste funzioni esistono |
| Famiglia, circa €30 | il genitore | Plus, contatto con il tutor pagato da Sapiens, area genitori, più figli | v2 |

Nella [[Release Beta]] ci sono quindi solo Free e Studio. Prezzi indicativi, da fissare prima del lancio.

## Perché
- I piani si distinguono per il valore, non per il costo: l'AI costa pochi centesimi al mese per studente e le note ancora meno (vedi [[Provider AI]], [[Piani e prezzi]]).
- Si vende quello che esiste (vedi [[Principi]]): un piano senza funzioni proprie non ha niente da vendere.
- Il piano per il genitore viene confrontato con il prezzo delle ripetizioni (€20-30 l'ora, pass Superprof €29 al mese). Senza una componente umana, €50-60 è difficile da difendere.

Alternative scartate: tre piani già nella beta; piano completo a €50-60 (idea di Alessandro, da riconsiderare se il piano Famiglia avrà una componente umana).

## Conseguenze
Da cambiare in `src/lib/stripe/config.ts` e nella pagina prezzi prima della beta: via Lite, Base e Pro, dentro Studio. Il vecchio Pro è sostituito da Famiglia (vedi [[2026-09-23 Il piano Pro non include ore di ripetizione]]).
