# Note: Idruri e idracidi

Lezione nuova (6 ottobre 2026), terzo anno, capitolo "Classificazione e nomenclatura dei composti", terza di sette. Gruppo I del lotto. `check.mts` passa senza avvisi su lezione, formulario e flashcard.

## Struttura

L'idrogeno a metà della scala dell'elettronegatività, con i due n.o.; la tabella delle tre famiglie e i composti del terzo periodo in fila; gli idruri metallici; gli idruri covalenti; gli idracidi, con i due nomi (composto puro e soluzione); come si riconosce la famiglia dalla formula, con un esempio; la figura interattiva.

## Scelte e confini

- Il filo è l'elettronegatività: il segno del n.o. dell'idrogeno si legge dal confronto con l'altro elemento. È più del solito elenco dei libri ("negli idruri metallici $-1$"), ma permette di dire le cose giuste sui casi di confine.
- Casi di confine, in una nota: nella fosfina le due elettronegatività sono in pratica uguali ($2{,}19$ e $2{,}20$) e i n.o. si contano per convenzione come nell'ammoniaca; nel silano l'idrogeno ha $-1$ perché il silicio è meno elettronegativo, anche se il composto è molecolare. Nella tabella delle famiglie la colonna del n.o. dice "$+1$ con carbonio, azoto e fosforo" per non affermare una regola falsa per il silicio. Gli esercizi non chiedono il n.o. in $\mathrm{SiH_4}$, $\mathrm{PH_3}$ e $\mathrm{AsH_3}$.
- Idruri metallici in tabella: solo metalli con un n.o. (gruppi 1 e 2, alluminio). Un solo esempio con due n.o., $\mathrm{CuH}$, in una frase.
- "Solidi ionici" è detto solo per gli idruri del gruppo 1 e di calcio, stronzio e bario; di magnesio e alluminio la lezione dà formula e nome, senza dire com'è il legame.
- Idruri covalenti: formula d'uso con l'idrogeno a destra ($\mathrm{NH_3}$, $\mathrm{CH_4}$), come nel brief; il nome proprio (metano, ammoniaca) sta nella colonna del nome tradizionale, e gli esercizi lo chiedono come "nome tradizionale". La colonna Stock ha "idruro di azoto", che nessuno usa: c'è per tenere le quattro colonne uguali in tutte le tabelle.
- L'acqua è nominata come composto dell'idrogeno con un elemento del gruppo 16 che non è un idracido.
- Idracidi: cinque (i quattro alogeni e lo zolfo). $\mathrm{HCN}$ in una nota. $\mathrm{H_2Se}$ non è nella lezione, ma è nel modulo degli esercizi e si può togliere.
- Per gli idracidi il brief chiede tre nomi: tradizionale "acido cloridrico", IUPAC "cloruro di idrogeno"; nella colonna Stock lo stesso nome IUPAC senza prefissi ("solfuro di idrogeno"), con la spiegazione che l'idrogeno ha un solo n.o. positivo. Gli ioni (cloruro, solfuro) sono lasciati al gruppo J, lezione 81: qui il suffisso -uro compare solo nel nome del composto.
- La reazione degli idruri con l'acqua e la ionizzazione di $\mathrm{HCl}$ sono date come schema; l'equazione di $\mathrm{HCl}$ in acqua è la stessa della lezione 47.

## Dubbi per Andrea

1. Colonna Stock per idracidi e idruri covalenti ("solfuro di idrogeno", "idruro di azoto"): la teniamo, o per queste due famiglie bastano due nomi?
2. La nota su fosfina e silano: è giusta la scelta di dire che nel silano l'idrogeno ha $-1$, o a scuola si dà $+1$ a tutti gli idruri covalenti?
3. $\mathrm{H_2O}$: va bene tenerla fuori dalle tre famiglie?
4. Idracidi: aggiungiamo $\mathrm{H_2Se}$ e $\mathrm{H_2Te}$, o cinque bastano?
5. Negli idruri covalenti mettiamo anche il diborano e gli idruri del gruppo 13?

## Da verificare

- Idruro di calcio "come riserva di idrogeno e per togliere le ultime tracce d'acqua dai solventi".
- "L'acido fluoridrico corrode il vetro e si conserva in bottiglie di plastica"; acido solfidrico "delle sorgenti sulfuree".
- Gli idracidi puri sono "gas a temperatura ambiente": per $\mathrm{HF}$ il punto di ebollizione è vicino alla temperatura ambiente (circa $20\,^\circ\text{C}$), da controllare.
- Elettronegatività da `elementi.json`: Na $0{,}93$, Ca $1{,}00$, Al $1{,}61$, H $2{,}20$, C $2{,}55$, N $3{,}04$, Cl $3{,}16$, F $3{,}98$, P $2{,}19$, Si $1{,}90$ (controllate con lo script).

## Figure

Due TikZ, guardate in chiaro e in scuro: `idruri-scala-elettronegativita-idrogeno`, `idruri-terzo-periodo-famiglie` (copiata nel formulario).

Una interattiva, `idruri-idracidi-scegli-elemento` (`IdruriIdracidiScegli.tsx`): quindici elementi; sulla scala dell'elettronegatività sono segnati l'idrogeno e l'elemento, con una freccia verso il più elettronegativo; sotto, la formula con i n.o. sopra i simboli, la famiglia e i nomi. Con il fosforo e con il silicio la didascalia spiega il caso di confine.

Nessun blocco `grafico`.

## Esercizio guidato

L'esempio 2 ($\mathrm{H_2S}$). Si fermerebbe in tre punti: il n.o. dello zolfo; a quale famiglia appartiene il composto, guardando dove sta l'idrogeno e il gruppo dello zolfo; quale nome va al composto puro e quale alla soluzione.

Prerequisiti proposti: numero-ossidazione, chim-affinita-elettronegativita, chim-metalli-non-metalli, chim-acqua-acidi-basi
