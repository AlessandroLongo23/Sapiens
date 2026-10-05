# Diritto d'autore e licenze

Generatore: `inf-diritto-autore` (`src/lib/exercises/v2/generators/inf-diritto-autore.ts`, con gli aiuti di
`src/lib/exercises/v2/inf-sic.ts`). Verifica indipendente: `scripts/exercises/checkers/inf_diritto_autore.py`.
Lezione collegata: `docs/lezioni/informatica/riscritte/44-inf-diritto-autore.md`.

Sei livelli, tutti a scelta multipla con quattro opzioni di testo (campioni in testo semplice). I livelli 3 e 4 sono
sulla sigla di una licenza Creative Commons, costruiti all'indietro dai suoi elementi. Le domande restano su quello
che la lezione dice: niente numeri di articolo, niente durate da ricordare, niente casi legali al limite.

## Nomi dei livelli

1. Che cosa protegge il diritto d'autore
2. Citazione, plagio o permesso
3. Leggere una sigla Creative Commons
4. Scegliere la licenza
5. Le licenze del software
6. In una ricerca o in una presentazione

## Livello 1: che cosa protegge il diritto d'autore

Dodici affermazioni vere e dodici false, le false prese dall'avviso "Tre ragionamenti sbagliati" e dalle tre
caratteristiche del diritto d'autore (nasce da solo, protegge la forma, in rete non tutto è libero). Metà "Quale di
queste affermazioni sul diritto d'autore è vera?", metà "… è falsa?".

## Livello 2: citazione, plagio o permesso

Dodici situazioni, tre per risposta, con un nome estratto. Domanda: "Di che cosa si tratta?" Opzioni fisse: Una
citazione corretta; Un plagio; Un uso che richiede il permesso dell'autore; Un uso libero: l'opera è nel pubblico
dominio. Un quarto dei casi ciascuna.

Esempio: "Sara copia nella sua ricerca tre paragrafi di un'enciclopedia in rete, che permette di riusare i suoi
testi, senza dire da dove vengono." Risposta: Un plagio.

Distrattori: "ho citato la fonte, quindi posso" (un capitolo intero con autore e titolo richiede il permesso); il
plagio di un'opera libera o nel pubblico dominio.

## Livello 3: leggere una sigla Creative Commons

"Marta trova una foto con licenza CC BY-NC-SA e vuole modificarla e pubblicare la sua versione sul sito della classe.
Può farlo?" Si estrae prima il verdetto, poi una licenza e un uso che lo danno. Sei licenze (BY, BY-SA, BY-ND, BY-NC,
BY-NC-SA, BY-NC-ND), sei opere, otto usi: l'opera resta "così com'è" oppure viene modificata; l'uso porta guadagni
(vendere) oppure no. Opzioni fisse:

- Sì, indicando l'autore;
- Sì, indicando l'autore e dando alla sua versione la stessa licenza (SA, quando l'opera viene modificata);
- No: la licenza non permette di modificarla (ND, quando l'opera viene modificata);
- No: la licenza non permette usi commerciali (NC, quando l'uso porta guadagni).

Un quarto dei casi ciascuna. Non escono mai due motivi per dire no insieme (NC con un uso commerciale e ND con una
modifica), perché le opzioni giuste sarebbero due.

## Livello 4: scegliere la licenza

"Luca pubblica una sua illustrazione e decide così: chi la usa deve indicare l'autore; gli usi commerciali sono
permessi; l'opera si può modificare, ma la versione modificata deve avere la stessa licenza. Quale licenza Creative
Commons corrisponde a queste scelte?" Risposta: CC BY-SA. Opzioni: quattro delle sei licenze. Le sei escono ciascuna
in circa un sesto dei casi.

## Livello 5: le licenze del software

- tipo (65 su 100): la descrizione di un programma (otto programmi, tre descrizioni per tipo) e "Di che tipo di
  software si tratta?" Opzioni fisse: Software proprietario a pagamento; Freeware; Software libero con copyleft;
  Software libero con licenza permissiva.
- puoi, non puoi (35 su 100): "Con un freeware, quale di queste cose puoi fare?", dalla tabella della lezione. Con un
  programma proprietario o un freeware: una cosa che puoi fare tra tre che non puoi. Con un software libero: quella
  che non puoi (presentarlo come scritto da te) tra tre che puoi.

Distrattore: "libero vuol dire gratis" (l'avviso della lezione).

## Livello 6: in una ricerca o in una presentazione

- situazioni (3 su 4): nove, con un nome estratto, la cosa giusta e quattro sbagliate (se ne mostrano tre):
  l'immagine senza indicazioni, la canzone comprata per il video, il film da scaricare, i paragrafi
  dell'enciclopedia, da dove cominciare la ricerca delle immagini, la licenza di quel file preciso, i crediti di
  un'opera nel pubblico dominio, la licenza per una foto propria, il fotomontaggio con un'immagine ND.
- crediti (1 su 4): "Luca usa in una slide una foto con licenza Creative Commons. Quale di queste attribuzioni è
  completa?" Titolo, autore, fonte (un indirizzo sotto `esempio.it`) e licenza estratti; la risposta le ha tutte e
  quattro, ognuna delle altre tre ne perde una.

Distrattori: i tre ragionamenti sbagliati dell'avviso ("l'ho comprato", "ho citato la fonte", "non ci guadagno").

## Esercizi da evitare

- CC0 nei livelli 3 e 4: la lezione non dice se l'autore va indicato.
- Usi in cui non è chiaro se l'opera viene modificata (una canzone come sottofondo di un video): ogni uso dice
  "così com'è" oppure "modificarla".
- Con il software libero, "usarlo senza pagare": la tabella dice sì, l'avviso dice che si può anche vendere. Con il
  freeware, "darne copie ad altri": la tabella dice "dipende".
- Durate dei diritti, anni, numeri di articolo.

## Verifica

`inf_diritto_autore.py` legge la sigla dal testo e la divide nei suoi elementi; dal testo legge anche se l'uso
modifica l'opera e se porta guadagni, e da NC, ND e SA ricava il verdetto. Al livello 4 compone la sigla dalle scelte
scritte nel testo. Al livello 5 classifica la descrizione dalle parole, e ha la sua tabella di che cosa permette ogni
tipo di software. Al livello 6 un'attribuzione è completa se contiene le quattro parti, e ognuna delle altre deve
perderne una sola.

## Domande per la revisione

- Livello 3: con una licenza SA, condividere l'opera "così com'è" chiede solo di indicare l'autore; SA scatta quando
  la si modifica. Va bene questa lettura? (Nell'esempio 3 della lezione un video con un brano BY-SA deve avere la
  stessa licenza: per questo gli usi "dentro un'altra opera" sono stati lasciati fuori.)
- Livello 2: "presenta come sua una poesia di un autore dell'Ottocento" è dato come plagio, con "uso libero: pubblico
  dominio" tra le opzioni sbagliate. Va bene?
- Livello 5: le licenze "con copyleft" e "permissiva" come due risposte distinte sono al livello giusto?
