# Note: Le formule di Lewis delle molecole

Lezione nuova (6 ottobre 2026), gruppo F del terzo anno: capitolo "I legami chimici", ultima lezione. Non pubblicata.
`check.mts` passa su formulario e flashcard; sulla lezione resta un avviso, "titolo con maiuscole all'inglese", per
il titolo "Che cosa mostra una formula di Lewis": la maiuscola è quella del cognome.

## Struttura e confini

Che cosa mostra una formula di Lewis (coppie di legame e coppie solitarie); il procedimento in sette passi, con
ammoniaca e diossido di carbonio; gli ossiacidi (acido carbonico, acido ipobromoso); gli ioni poliatomici (cianuro,
ammonio); la carica formale; la risonanza (triossido di zolfo); le tre eccezioni all'ottetto; le due formule
dell'acido solforico; una tabella delle formule da ricordare.

- Con la 58 (gruppo B): i simboli di Lewis degli atomi e il conto degli elettroni di valenza dal gruppo sono lì.
- Con la 63 (gruppo E): legami semplici, doppi e tripli e le formule delle molecole biatomiche sono lì. Qui si parte
  dalle molecole con un atomo centrale.
- Il formulario della 63 ha un procedimento in quattro passi per le molecole semplici (conta gli elettroni, dai a
  ogni atomo i legami che gli servono, metti il resto come coppie solitarie, controlla). Il procedimento della 67 è
  quello generale: il primo e l'ultimo passo hanno le stesse parole, e una frase dopo l'elenco dice che per le
  molecole semplici i due danno la stessa formula. Il file della 63 non è stato toccato.
- Con la 64 (gruppo E): il legame dativo è lì. Qui è richiamato in due punti, per lo ione ammonio e per l'acido
  solforico.
- Con la 02 (VSEPR): il conto delle coppie solitarie dell'atomo centrale è lo stesso della 02, che lo fa con una
  formula sola senza disegnare tutta la formula di Lewis. Le molecole sono in comune.
- Con la 80 (ossiacidi, gruppo J): qui c'è solo come si disegnano; nomi e classificazione sono lì.

Molecole: della riga 4 di `confronto-atzeni.md` la lezione svolge o disegna H₂O, BF₃, CH₄ (in tabella), CO₂, CN⁻,
SO₃, NH₃, SO₄²⁻ (in tabella), H₂SO₄, H₂CO₃, HBrO. HClO₄ è nominato in una riga. N₂O₃ non c'è: ha due atomi centrali
e uno scheletro che non si ricava dal procedimento; servirebbe un esempio in più in una lezione già al limite dei
25.000 caratteri. Sono nella lezione, oltre a quelle, NH₄⁺, NO, PCl₅ e SF₆.

## Scelte

- La carica formale è introdotta, con la formula e con la regola per scegliere tra due formule. Serve per tre cose
  che la lezione deve dire: perché CO₂ ha due doppi legami, perché BF₃ resta con sei elettroni, perché H₂SO₄ si
  disegna in due modi.
- Acido solforico, ione solfato, triossido di zolfo, acido perclorico: la lezione costruisce la formula che rispetta
  l'ottetto, mostra accanto quella con l'ottetto espanso e dichiara che negli esercizi vale la prima quando non è
  detto altro. I legami semplici con carica formale sono detti legami dativi, come nei libri italiani che li
  disegnano con la freccia. Gli esercizi non chiedono mai il numero di doppi legami di queste specie senza dire
  quale formula.
- L'ottetto espanso è limitato agli "atomi dal terzo periodo in poi", senza la spiegazione con gli orbitali $d$, che
  molti libri danno e che oggi è considerata superata.
- Il "metodo rapido" del prof. Atzeni per gli ossiacidi non è stato guardato: la lezione dà la regola dello scheletro
  (idrogeno, ossigeno, atomo centrale). Il riquadro "Quanti legami servono" è una regola diversa, valida quando
  tutti gli atomi rispettano l'ottetto.
- Atomo centrale: "di solito il meno elettronegativo, mai l'idrogeno".
- Nel passo 4 gli atomi esterni si completano prima di quello centrale; per CN⁻, che non ha un atomo centrale, la
  lezione dice di completare prima l'azoto, il più elettronegativo.
- Di SO₃ la lezione dice solo che i tre legami sono uguali. Non dice che sono "intermedi tra semplice e doppio",
  come fanno molti libri: la lunghezza misurata (circa 142 pm, a memoria) è quella di un doppio legame.

## Da verificare

- "Le specie con un elettrone spaiato si chiamano radicali e sono molto reattive".
- "Si comportano così i composti del boro e del berillio" (ottetto incompleto).
- Che i tre legami di SO₃ siano uguali (molecola triangolare planare simmetrica): corretto, a memoria.

## Figure

TikZ, tutte disegnate con le coordinate (RDKit non disegna le coppie solitarie), guardate in chiaro e in scuro:

- `formule-lewis-acqua-coppie`: l'acqua con le etichette "coppia solitaria" e "coppia di legame".
- `formule-lewis-diossido-carbonio-passi`: scheletro, ottetti esterni, doppi legami.
- `formule-lewis-ossiacidi-carbonico-ipobromoso`: H₂CO₃ e HBrO.
- `formule-lewis-ioni-cianuro-ammonio`: i due ioni tra parentesi quadre.
- `formule-lewis-triossido-zolfo-risonanza`: le tre formule limite. È anche nel formulario.
- `formule-lewis-eccezioni-ottetto`: BF₃, NO, PCl₅.
- `formule-lewis-acido-solforico-due-modi`: con l'ottetto e con l'ottetto espanso.

Il codice TikZ è generato da uno script (nello scratchpad, non nel repo) che mette trattini e puntini a distanze
fisse dai simboli.

Interattiva:

- `formule-lewis-costruisci` (`FormuleLewisCostruisci.tsx`): otto specie (H₂O, NH₃, CO₂, HCN, CH₂O, CN⁻, CO₃²⁻, BF₃)
  con lo scheletro già disegnato. Un tocco su un atomo aggiunge una coppia solitaria (fino a tre, poi torna a zero),
  un tocco su un legame lo rende doppio, triplo, di nuovo semplice. Sotto: elettroni di valenza, elettroni sistemati,
  elettroni intorno a ogni atomo; quando tutti gli elettroni sono sistemati, le cariche formali diverse da zero
  compaiono in blu accanto agli atomi.
  "Controlla" passa i controlli nell'ordine della lezione e dice il primo che non torna. Solo atomi dei primi due
  periodi, per non entrare nella questione dell'ottetto espanso.

Nessun blocco `grafico`.

## Esercizi

Generatore `chim-formule-lewis`, sei livelli (specifica in `specs/exercises/chim-formule-lewis.md`): elettroni di
valenza di una molecola; coppie solitarie dell'atomo centrale; quante coppie di legame; elettroni di valenza di uno
ione; la carica formale; le eccezioni all'ottetto. I primi quattro chiedono un numero intero e sono proposti a
risposta aperta. Gli esercizi chiedono i numeri che decidono la formula, non il disegno: una formula di Lewis come
opzione richiederebbe una scena nuova. Controllo indipendente `scripts/exercises/checkers/chim_formule_lewis.py`: PASS
su 1000 esercizi per livello con i seed 1, 50001 e 777001. Non collegato al sito.

## Esercizio guidato

L'esempio 2 (il diossido di carbonio). Si fermerebbe in tre punti: dopo il conto degli elettroni di valenza; dopo
aver completato gli ottetti degli ossigeni, quando il carbonio resta con quattro elettroni; prima del controllo
finale.

## Dubbi per Andrea

- H₂SO₄, SO₄²⁻, SO₃, HClO₄: quale formula vuoi come riferimento, quella con l'ottetto (legami dativi, cariche
  formali) o quella con l'ottetto espanso (doppi legami)? La lezione le mostra tutte e due e negli esercizi usa la
  prima.
- La carica formale va tenuta in una terza? Senza, non si spiega perché CO₂ non ha un triplo e un semplice.
- N₂O₃ è nell'elenco di Atzeni e qui manca: lo vuoi come esempio svolto (al posto di quale)?
- "Formule limite" e "ibrido di risonanza" sono i termini che usi, o preferisci "strutture di risonanza"?
- Il riquadro "Quanti legami servono" (elettroni per gli ottetti meno elettroni di valenza, diviso due): lo usi in
  classe? Negli esercizi è il livello 3.
- "Coppia solitaria" (come nella 02) o "doppietto libero"?

Prerequisiti proposti: chim-simboli-lewis, chim-regola-ottetto, legame-covalente, chim-legame-covalente-polare
