---
stato: bozza
release: v4
aggiornato: 2026-09-23
tag: [prodotto, scuole, algoritmo]
---
# Orario e aule

L'orario delle lezioni e l'assegnazione di classi, docenti e aule a inizio anno o semestre.

## Stato attuale
Niente in Sapiens. Esiste l'algoritmo di Alessandro, fuori dalla repo:
- Programmazione lineare, con i vincoli scritti direttamente nel codice (nessuna interfaccia).
- Usato prima per un ospedale (quale persona in quale stanza in quale fascia oraria, per i turni) e poi per l'Università di Padova (quale docente insegna in quale aula a quale ora). Con l'università ha funzionato abbastanza bene.
- L'algoritmo è di Alessandro e si può riusare.

## Obiettivo
Chi prepara l'orario (di solito un docente "orarista" su delega del dirigente) lo fa direttamente in Sapiens:
1. Descrive i vincoli della sua scuola in un'interfaccia semplice, senza sapere cosa sia la programmazione lineare.
2. Sapiens traduce quei vincoli nel modello matematico e lancia il solver.
3. Il risultato si può correggere a mano e si ricalcola quando cambia qualcosa (un docente in malattia, un'aula inagibile).

Deciso: [[2026-09-23 Vincoli dell'algoritmo configurabili dall'interfaccia]].

## Dettagli
Proposta per il passaggio da vincoli nel codice a vincoli configurabili:
- **Catalogo di tipi di vincolo.** Ogni tipo ha un modulo con campi (per esempio "il docente ___ non è disponibile il ___ dalle ___ alle ___", "massimo ___ ore consecutive per classe", "___ si fa solo in laboratorio"). Ogni tipo ha il suo pezzo di codice che lo trasforma in vincoli lineari. La scuola compila i moduli e non scrive codice.
- **Vincoli rigidi e preferenze.** Un vincolo rigido non si può violare; una preferenza ha un peso e il solver cerca di rispettarla. Nelle scuole quasi tutto è preferenza, tranne la disponibilità dei docenti divisi tra più scuole e le aule speciali.
- **Spiegare quando non c'è soluzione.** È la parte che decide se lo strumento è usabile. Quando i vincoli sono in conflitto, Sapiens deve dire quali ("questi tre vincoli sul prof. Rossi del martedì non si possono rispettare insieme"), non solo "nessuna soluzione".
- **Vincoli tipici della scuola:** docenti su più scuole con giorni fissati, laboratori e palestre condivisi, massimo di ore consecutive, giorno libero, distribuzione delle materie nella settimana, classi articolate, compresenze, ore di sostegno.
- **Concorrenti:** aSc Orari, EDT e altri. Da analizzare per prezzo e punti deboli.

## Domande aperte
- Quale solver usa l'algoritmo (HiGHS, CBC, Gurobi, OR-Tools) e in che linguaggio è scritto? Alcuni solver commerciali hanno licenze che non permettono l'uso in un prodotto venduto.
- Quanto è grande il problema di una scuola (classi, docenti, aule, ore) e in quanto tempo si risolve? L'orario scolastico ha molti più vincoli del caso universitario.
- Dove gira: servizio separato (per esempio Python con il solver) chiamato da Sapiens, o dentro l'app?
- L'uso per l'Università di Padova è avvenuto con un contratto o un incarico? Se sì, controllare che non abbia ceduto i diritti sul codice.
