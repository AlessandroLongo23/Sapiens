---
stato: decisa
aggiornato: 2026-09-29
tag: [idea, laboratori, scuole, multigiocatore]
---
# Laboratorio condiviso

## L'idea
Alessandro, 29 settembre 2026. Estendere i [[Laboratori]] a una stanza condivisa, come in un videogioco: un laboratorio abbastanza grande per al massimo 32 persone, docente compreso. Si lavora a gruppi, e ci sono impostazioni: gli avatar si urtano o si passano attraverso come fantasmi, i membri di un gruppo possono o non possono usare il banco di un altro gruppo, e così via.

## Perché potrebbe valere
- È la lezione di laboratorio di una classe intera, anche in una scuola senza laboratorio: il docente e i gruppi nella stessa stanza, dall'aula computer o da casa.
- Si aggancia alla decisione sui laboratori da computer per docenti e studenti ([[2026-09-29 I laboratori sono da computer, per i docenti alla LIM e gli studenti al pc]]) e alla vendita alle scuole ([[Vendita alle scuole]]).

Note tecniche di Claude, 29 settembre 2026 (numeri da verificare):
- L'unità naturale di sincronizzazione è il banco: una simulazione per banco, con un'autorità sola; le posizioni degli avatar sono un canale a parte, leggero.
- 32 persone che mandano la posizione 15 volte al secondo sono circa 480 messaggi al secondo in arrivo e circa 15.000 consegne al secondo in uscita. Per una stanza così servono stanze con stato su un server: Cloudflare Durable Objects (un oggetto per stanza, con WebSocket) è la strada più adatta; Supabase Realtime, che c'è già, va verificato sui limiti di messaggi del piano.
- La decisione che conviene prendere subito, anche senza fare il multigiocatore: il motore del laboratorio tiene lo stato del mondo separato dal disegno, serializzabile, e cambia solo attraverso azioni (comandi). Serve anche a salvare un esperimento, rivederlo, mostrarlo al docente e scrivere test.

## Decisioni del 29 settembre 2026
- [[2026-09-29 Il motore dei laboratori è stato serializzabile cambiato solo da azioni]]
- [[2026-09-29 Il laboratorio condiviso si costruisce insieme al motore]]
- [[2026-09-29 Nel laboratorio condiviso niente chat, solo segnali]]
- [[2026-09-29 Il laboratorio condiviso usa Cloudflare Durable Objects, non Supabase Realtime]]

## Decisioni del 30 settembre 2026
- [[2026-09-30 Nel laboratorio condiviso la postazione è l'unità, per gruppi da 1 a 3]]
- [[2026-09-30 L'aula si sceglie all'avvio dai presenti, e si ottimizza per la classe intera]]
- [[2026-09-30 Gli avatar sono un kit di forme semplici, opachi nel laboratorio e adesivi nel sito]]

## Domande aperte
- Chi crea una stanza e come si entra.
- Cosa si salva di una sessione.
- L'elenco dei segnali.

## Dubbi e conflitti
- Minori in una stanza condivisa: chat, voce, nomi e presenza sono dati personali e un rischio di moderazione ([[GDPR e minori]]). Una chat libera tra minorenni è il punto più delicato.
- Costo e tempo: un server in tempo reale è un'infrastruttura nuova, per una persona sola che sviluppa, mentre il motore del laboratorio non esiste ancora ([[2026-09-29 Il primo traguardo dei laboratori è il motore, in un laboratorio libero senza esperimenti]]).
- Le reti delle scuole possono bloccare i WebSocket o essere lente (da verificare).

## Collegamenti
- [[Laboratori]], [[2026-09-29 Laboratori]], [[Docente]], [[Vendita alle scuole]]
