# Albero delle lezioni: IA responsabile e in produzione (università)

Fonte dell'albero di `content_nodes` per la materia `ia-responsabile` sotto `university`. Viene dal blocco 5 di
`vault/Contenuti/Programma di intelligenza artificiale.md` (6 ottobre 2026): i capitoli sono quelli del programma, le
lezioni sono una prima divisione degli argomenti di ogni capitolo, da rivedere quando il capitolo si scrive. Si applica
con `scripts/lezioni/tree.mts --level university --subject ia-responsabile --title "IA responsabile e in produzione" --file <questo file>` (prima senza
scrivere, poi con `--apply`). Formato: `## slug | Titolo` è un capitolo, `- slug | Titolo` una lezione.

## ir-equita | Distorsioni ed equità
- ir-origini-distorsioni | Da dove vengono le distorsioni
- ir-criteri-equita | Criteri di equità
- ir-rimedi | Ridurre le distorsioni
- ir-distorsioni-generativi | Distorsioni nei modelli generativi

## ir-interpretabilita | Interpretabilità
- ir-importanza-caratteristiche | Importanza delle caratteristiche, SHAP e LIME
- ir-salienza | Mappe di salienza, prototipi e vettori di concetto
- ir-valutare-spiegazioni | Valutare una spiegazione
- ir-meccanicistica | Interpretabilità meccanicistica

## ir-robustezza | Robustezza e sicurezza
- ir-esempi-avversari | Esempi avversari
- ir-attacchi-llm | Attacchi ai modelli linguistici
- ir-prove-attacco | Prove d'attacco
- ir-filigrane | Filigrane e provenienza dei contenuti

## ir-riservatezza | Riservatezza
- ir-privacy-differenziale | Privacy differenziale
- ir-federato | Apprendimento federato
- ir-governo-dati | Governo dei dati di addestramento

## ir-allineamento | Allineamento e controllo
- ir-ricompense-aggirate | Ricompense aggirate
- ir-inganno | Inganno e allineamento simulato
- ir-supervisione | Supervisione scalabile
- ir-controllo | Controllo dei sistemi di intelligenza artificiale

## ir-regole | Regole
- ir-ai-act | Il regolamento europeo sull'intelligenza artificiale
- ir-altri-quadri | I quadri di Stati Uniti e Regno Unito
- ir-schede-modelli | Schede dei modelli e dei dati

## ir-produzione | Mettere un modello in produzione
- ir-riproducibilita | Riproducibilità: versioni, ambienti e test
- ir-servire | Servire un modello
- ir-osservabilita | Osservabilità e rilasci graduali
- ir-ciclo-vita | Ciclo di vita: deriva e riaddestramento
