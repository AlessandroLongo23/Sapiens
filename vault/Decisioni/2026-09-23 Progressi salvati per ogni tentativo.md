---
stato: decisa
aggiornato: 2026-09-24
tag: [decisione, tecnica, studenti]
---
# Progressi salvati per ogni tentativo

## Decisione
Si salva ogni tentativo di esercizio degli utenti registrati: utente, generatore, livello, seed, risposta, esito, tempo impiegato. Padronanza, punti deboli, ripasso e report si calcolano da lì.

## Perché
Con il seed l'esercizio si ricostruisce identico, quindi si possono rivedere gli errori e correggere sul server senza fidarsi del browser. Gli aggregati si possono sempre ricalcolare; lo storico perso no. È anche la base di un algoritmo di ripasso come FSRS (vedi [[Ripasso pianificato prima di una verifica]]).

Alternativa scartata: solo contatori per utente e tipo di esercizio.

## Conseguenze
Tabella dei tentativi in [[Schema dati]]. Il 24 settembre 2026 si è deciso di salvare anche l'esercizio intero, perché il seed non basta quando il generatore cambia: vedi [[2026-09-24 Ogni tentativo salva l'esercizio intero]]. La correzione passa dal server: oggi l'esito giusto è nella pagina (vedi [[Esercizi]]).
