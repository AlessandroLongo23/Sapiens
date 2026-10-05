# Il cloud: archiviare, condividere e lavorare insieme

Scatti una foto con il telefono e la sera la ritrovi sul computer, senza averla spostata. Cominci una relazione a scuola e la finisci a casa, da un altro dispositivo. In entrambi i casi il file non sta solo dove lo hai creato: una copia è su un computer lontano, che raggiungi attraverso [Internet](/materiale/scuola-superiore/informatica/internet-e-il-web/internet-la-rete-delle-reti). Questo modo di usare la rete si chiama cloud, "nuvola", ma la parola non deve ingannare: di nuvole non ce ne sono, ci sono computer.

## Che cos'è il cloud

Il **cloud computing** è l'uso, attraverso Internet, di risorse che appartengono a computer remoti: spazio per i file, programmi, capacità di calcolo. Le risorse sono offerte come un servizio, che usi quando ti serve e nella quantità che ti serve, senza possedere le macchine.

Quei computer sono [server](/materiale/scuola-superiore/informatica/internet-e-il-web/il-modello-client-server), e stanno a migliaia in edifici costruiti apposta, i **data center**, con alimentazione di riserva, raffreddamento e collegamenti veloci alla rete. Il tuo telefono e il tuo computer fanno da client: chiedono un file, il server lo manda.

```tikz
% nome: dispositivi-e-data-center
% alt: A sinistra tre dispositivi, telefono, computer e tablet; a destra un data center che contiene tre server. Ogni dispositivo è collegato al data center da una freccia a due punte che passa per Internet: i file stanno sui server e i dispositivi li raggiungono dalla rete
\begin{tikzpicture}
\tikzset{
  disp/.style={draw, thick, rounded corners=3pt, fill=green!15, minimum width=1.9cm, minimum height=0.7cm, font=\small},
  serv/.style={draw, thick, fill=blue!25, minimum width=2.0cm, minimum height=0.55cm, font=\footnotesize}}
\node[disp] (t) at (0,1.2) {telefono};
\node[disp] (c) at (0,0) {computer};
\node[disp] (b) at (0,-1.2) {tablet};
\draw[thick, rounded corners=3pt, fill=blue!8] (5.0,-1.75) rectangle (7.8,1.75);
\node[font=\small] at (6.4,1.4) {data center};
\node[serv] at (6.4,0.65) {server};
\node[serv] at (6.4,-0.1) {server};
\node[serv] at (6.4,-0.85) {server};
\draw[{Stealth}-{Stealth}, thick] (0.95,1.2) -- (5.0,0.5);
\draw[{Stealth}-{Stealth}, thick] (0.95,0) -- (5.0,0);
\draw[{Stealth}-{Stealth}, thick] (0.95,-1.2) -- (5.0,-0.5);
\node[font=\footnotesize] at (2.9,1.25) {Internet};
\end{tikzpicture}
```

Che un'azienda costruisca data center e ne affitti l'uso conviene a entrambe le parti. I server restano accesi giorno e notte, e ogni file viene registrato in più copie su macchine diverse, così il guasto di un disco non lo fa perdere; chi usa il servizio non deve comprare né curare niente, e raggiunge i suoi dati da qualunque dispositivo.

## Archiviare i file in rete

L'**archiviazione nel cloud** (in inglese cloud storage) è il servizio che ti dà uno spazio, sui server di un fornitore, in cui tenere i tuoi file. Lo spazio è legato al tuo account e si usa come una [memoria di massa](/materiale/scuola-superiore/informatica/l-architettura-del-computer/memoria-centrale-e-memorie-di-massa) in più, con [cartelle e file](/materiale/scuola-superiore/informatica/il-sistema-operativo/il-file-system-file-cartelle-e-percorsi) come quelle del computer. Sono servizi di questo tipo, per esempio, Google Drive, OneDrive e iCloud.

Lo spazio ha un limite. Di solito una parte è gratuita e quella in più si paga con un abbonamento; quando lo spazio finisce, i file nuovi non vengono più caricati.

```ad-example
Esempio 1: quante foto stanno nello spazio
Un servizio offre $5\,\text{GB}$ di spazio. Quante foto da $4\,\text{MB}$ ci stanno? E quanto spazio tolgono dieci video da $200\,\text{MB}$?

Con $1\,\text{GB} = 1000\,\text{MB}$ lo spazio è di $5000\,\text{MB}$, quindi ci stanno $5000 : 4 = 1250$ foto. I dieci video occupano $10 \cdot 200 = 2000\,\text{MB}$, cioè $2\,\text{GB}$: da soli prendono lo spazio di $500$ foto. Quando lo spazio si riempie, quasi sempre la colpa è dei video.
```

### La sincronizzazione

La **sincronizzazione** è il meccanismo che tiene uguali la copia di un file sul dispositivo e la copia sul server. Ogni volta che una delle due cambia, la modifica viene trasmessa all'altra, e da lì a tutti i dispositivi collegati allo stesso account. È ciò che porta la foto dal telefono al computer senza che tu faccia niente.

Se modifichi un file mentre sei senza connessione, la modifica resta sul dispositivo e viene caricata appena la rete torna. Può capitare che nel frattempo lo stesso file sia stato cambiato anche da un altro dispositivo: il servizio non sa quale delle due versioni vuoi, e di solito le conserva entrambe come due file distinti, lasciando a te la scelta.

```ad-warning
Sincronizzare non è fare una copia di sicurezza
Chi vede le foto sia sul telefono sia nel cloud pensa di averne due copie indipendenti. Con la sincronizzazione non è così: le due copie vengono tenute uguali, quindi se cancelli una foto dal telefono per fare spazio, sparisce anche dal cloud e dagli altri dispositivi. Di solito il file resta per qualche tempo nel cestino del servizio, da cui si può recuperare. Per liberare memoria sul telefono senza perdere le foto si usa l'apposita funzione dell'app, che toglie solo la copia locale.
```

## Condividere

Condividere un file nel cloud vuol dire dare ad altri l'accesso allo stesso file, che resta nel tuo spazio. Non parte nessuna copia: per questo si può condividere un video troppo grande per un [allegato di posta](/materiale/scuola-superiore/informatica/internet-e-il-web/posta-elettronica-e-altri-servizi-di-internet), e per questo, se correggi il file dopo averlo condiviso, gli altri vedono la versione corretta.

L'accesso si dà in due modi. Con un invito indichi gli indirizzi di posta delle persone, e solo loro, dopo essere entrate con il proprio account, possono aprire il file. Con un link ottieni un indirizzo che apre il file a chiunque lo possieda.

Per ogni persona, o per il link, scegli un **permesso**, cioè che cosa si può fare con il file.

| Permesso | Che cosa permette | Quando usarlo |
|---|---|---|
| lettura | aprire il file e leggerlo | far vedere un lavoro finito |
| commento | leggere e lasciare commenti a margine, senza toccare il testo | chiedere un parere o una correzione |
| modifica | cambiare il contenuto | lavorare insieme allo stesso file |

Vale la regola di dare a ciascuno il permesso più basso che gli basta: chi deve solo leggere non ha motivo di poter cancellare.

```ad-example
Esempio 2: i permessi di una relazione di gruppo
Anna, Luca e Sara scrivono insieme la relazione di laboratorio. Prima di consegnarla vogliono un parere della professoressa, e alla fine la faranno leggere alla classe. Quali permessi servono?

Anna crea il file e invita Luca e Sara con il permesso di modifica, perché devono scrivere. La professoressa riceve il permesso di commento: può segnare a margine che cosa correggere, senza cambiare il testo dei ragazzi. Alla classe basta la lettura.
```

```ad-warning
Un link aperto a chiunque non è privato
Un file condiviso con "chiunque abbia il link" è protetto solo dal fatto che il link è difficile da indovinare. Ma un link si copia e si inoltra: basta che uno dei destinatari lo incolli in una chat perché lo aprano persone che non conosci. Per i file con dati personali, come un elenco di nomi e numeri di telefono, usa l'invito a persone precise, e quando il lavoro è finito togli la condivisione.
```

## Lavorare insieme sullo stesso file

Senza il cloud un lavoro di gruppo passa per gli allegati: ognuno modifica la sua copia, la rispedisce, e dopo tre giorni circolano `relazione_v2`, `relazione_finale` e `relazione_finale_corretta`, senza che nessuno sappia quale contiene tutto. Con un file condiviso in modifica il documento è uno solo e tutti scrivono lì.

```tikz
% nome: allegati-o-file-condiviso
% alt: Due schemi a confronto. A sinistra, con gli allegati, Anna, Luca e Sara hanno ciascuno una copia diversa della relazione: tre file. A destra, con il file condiviso, Anna, Luca e Sara sono collegati da frecce a una sola relazione, che sta nel cloud
\begin{tikzpicture}
\tikzset{
  pers/.style={font=\small, minimum width=1.1cm},
  doc/.style={draw, thick, fill=orange!25, minimum width=1.0cm, minimum height=0.7cm, font=\footnotesize}}
\node[font=\small] at (1.4,2.6) {con gli allegati};
\node[pers] at (0,1.8) {Anna};
\node[pers] at (1.4,1.8) {Luca};
\node[pers] at (2.8,1.8) {Sara};
\node[doc] at (0,0) {v1};
\node[doc] at (1.4,0) {v2};
\node[doc] at (2.8,0) {v3};
\draw[thick] (0,1.5) -- (0,0.35);
\draw[thick] (1.4,1.5) -- (1.4,0.35);
\draw[thick] (2.8,1.5) -- (2.8,0.35);
\draw[thick, dashed] (3.8,-0.6) -- (3.8,2.9);
\node[font=\small] at (6.3,2.6) {con il file condiviso};
\node[pers] at (4.9,1.8) {Anna};
\node[pers] at (6.3,1.8) {Luca};
\node[pers] at (7.7,1.8) {Sara};
\node[doc, minimum width=2.2cm] at (6.3,0) {un solo file};
\draw[{Stealth}-{Stealth}, thick] (4.9,1.5) -- (5.7,0.35);
\draw[{Stealth}-{Stealth}, thick] (6.3,1.5) -- (6.3,0.35);
\draw[{Stealth}-{Stealth}, thick] (7.7,1.5) -- (6.9,0.35);
\end{tikzpicture}
```

Più persone possono scrivere nello stesso momento: ognuna vede comparire le modifiche delle altre mentre vengono fatte, con un cursore colorato che mostra dove sta lavorando ciascuno. Il salvataggio è continuo, e non c'è un comando da ricordare.

Poiché tutti possono cambiare tutto, serve un modo per tornare indietro. La **cronologia delle versioni** è l'elenco degli stati precedenti del file che il servizio conserva, con la data e il nome di chi ha fatto ogni modifica: una versione vecchia si può riaprire e ripristinare.

```ad-example
Esempio 3: un paragrafo sparito
La sera prima della consegna Luca cancella per sbaglio la sezione dei risultati, e se ne accorge solo la mattina, quando il file è già stato salvato molte volte. Come la recupera?

Annullare l'ultima operazione non serve più. Luca apre la cronologia delle versioni, sceglie quella della sera prima, dove la sezione c'è ancora, la copia e la incolla nel documento di oggi. Così non perde le modifiche fatte nel frattempo dai compagni, che sparirebbero dal documento ripristinando per intero la versione vecchia.
```

In un lavoro a più mani conviene anche mettersi d'accordo su chi scrive che cosa, e usare i commenti per discutere di una frase al posto di cambiarla senza avvisare.

## Programmi che girano nel cloud

Nel cloud non stanno solo i file. Una **applicazione web** è un programma che usi dal browser, senza installarlo: la parte che vedi gira sul tuo dispositivo, mentre i dati e buona parte dell'elaborazione stanno sul server. Il registro elettronico funziona così, e così la webmail e i programmi per scrivere documenti, fogli di calcolo e presentazioni direttamente in rete.

Ne segue che il dispositivo conta meno: lo stesso documento si apre da un computer vecchio, da un tablet o dal telefono, perché il lavoro pesante lo fa il server, e quando il programma viene aggiornato tutti hanno subito la versione nuova.

## Vantaggi e limiti

| Vantaggi | Limiti |
|---|---|
| i file si raggiungono da qualunque dispositivo collegato | senza connessione si usano solo i file già scaricati |
| se il telefono si rompe o viene perso, i file restano | lo spazio gratuito è limitato |
| più persone lavorano sullo stesso file | i dati stanno sui computer di un'azienda, che detta le condizioni |
| niente da installare né da aggiornare | chi entra nel tuo account entra in tutti i tuoi file |

Gli ultimi due limiti chiedono attenzione. Tutto quello che hai nel cloud è protetto dall'accesso al tuo account, quindi dalla sua password: come sceglierla e come aggiungere un secondo controllo è nella lezione su [password e autenticazione](/materiale/scuola-superiore/informatica/sicurezza-e-cittadinanza-digitale/password-e-autenticazione). E affidare a un fornitore foto, documenti e messaggi vuol dire affidargli dati personali, tuoi e delle persone che compaiono nei tuoi file: che cosa può farne e quali diritti hai lo trovi nella lezione su [privacy e dati personali](/materiale/scuola-superiore/informatica/sicurezza-e-cittadinanza-digitale/privacy-e-dati-personali).

```ad-tip
I file che non puoi permetterti di perdere
Per le cose che contano davvero, come le foto di anni o la tesina, tieni una seconda copia fuori dal cloud, su un disco esterno o su una chiavetta. Un account si può perdere, per una password dimenticata o un servizio che chiude, e una copia in un posto solo non è al sicuro in nessun posto.
```
