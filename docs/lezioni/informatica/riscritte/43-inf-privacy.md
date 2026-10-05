# Privacy e dati personali

Ogni volta che apri un'app, da qualche parte viene scritto qualcosa di te: dove ti trovi, che cosa hai guardato e per quanto, a chi hai scritto. Presa da sola ogni informazione è poca cosa; messe insieme ti descrivono meglio di un diario. La privacy non riguarda chi ha qualcosa da nascondere: è la possibilità di decidere chi sa che cosa di te, e la legge la tratta come un diritto.

## Che cos'è un dato personale

Un **dato personale** è qualunque informazione che riguarda una persona identificata o identificabile. Il nome e il cognome, l'indirizzo di casa, il numero di telefono, l'indirizzo di posta, una foto del viso, la voce, i voti del registro elettronico, la posizione del telefono: sono tutti dati personali.

La parola che conta è "identificabile". Un'informazione è un dato personale anche quando non contiene il nome, se combinandola con altre si arriva alla persona. Il soprannome che usi in un gioco è legato al tuo account, e l'account al tuo indirizzo di posta: anche quello è un dato personale. Non lo sono invece le informazioni che non riguardano nessuno in particolare, come la media dei voti di tutta la scuola o la temperatura di oggi.

```ad-warning
"Non c'è il mio nome, quindi non si capisce che sono io"
"La ragazza di seconda B che fa nuoto agonistico e abita vicino alla stazione" non contiene nessun nome, eppure nella tua scuola indica una persona sola. Tre o quattro dettagli innocui, messi in fila, identificano qualcuno con la stessa precisione di un cognome: vale per quello che scrivi degli altri e per quello che scrivi di te.
```

Alcuni dati sono protetti con più severità, perché se diffusi possono esporre una persona a discriminazioni. La legge li chiama **categorie particolari** di dati, e nel linguaggio comune "dati sensibili": quelli che rivelano lo stato di salute, le convinzioni religiose, le opinioni politiche, l'origine etnica, l'orientamento sessuale, e i dati biometrici usati per riconoscere una persona, come l'impronta del dito.

```ad-example
Esempio 1: è un dato personale?
Classifica queste informazioni: il certificato medico per l'esonero da educazione fisica; il numero di studenti iscritti alla tua scuola; l'elenco dei libri che hai preso in prestito in biblioteca; la targa del motorino di tuo fratello.

Il certificato è un dato personale di categoria particolare, perché parla della salute. Il numero degli iscritti non è un dato personale: non riguarda nessuno in particolare. L'elenco dei prestiti è un dato personale, legato alla tua tessera, e dice molto dei tuoi interessi. La targa è un dato personale: da sola non porta un nome, ma attraverso un registro conduce a una persona.
```

## Chi tratta i tuoi dati

La legge usa tre parole precise. Il **trattamento** è qualunque operazione fatta su un dato personale: raccoglierlo, conservarlo, consultarlo, comunicarlo ad altri, cancellarlo. L'**interessato** è la persona a cui i dati si riferiscono, cioè tu. Il **titolare del trattamento** è chi decide perché e come quei dati vengono usati: la scuola per il registro elettronico, l'azienda che produce un'app per i dati dell'app.

```tikz
% nome: interessato-titolare-garante
% alt: Schema con tre riquadri. A sinistra l'interessato, cioè tu; a destra il titolare del trattamento, per esempio la scuola o l'azienda di un'app. Dall'interessato al titolare va una freccia con scritto dati personali; dal titolare all'interessato torna una freccia con scritto informativa e risposte alle richieste. In basso il Garante: riceve i reclami dell'interessato e controlla il titolare
\begin{tikzpicture}
\tikzset{b/.style={draw, thick, rounded corners=3pt, align=center, font=\small, minimum height=1.1cm}}
\node[b, fill=green!15, minimum width=2.4cm] (i) at (0,0) {interessato\\(tu)};
\node[b, fill=blue!12, minimum width=2.9cm] (t) at (5.5,0) {titolare del\\trattamento};
\node[b, fill=orange!25, minimum width=2.6cm] (g) at (2.75,-2.3) {Garante};
\draw[-{Stealth}, thick] (1.2,0.25) -- node[above, font=\footnotesize] {dati personali} (4.05,0.25);
\draw[-{Stealth}, thick] (4.05,-0.25) -- node[below, font=\footnotesize] {informativa, risposte} (1.2,-0.25);
\draw[-{Stealth}, thick] (i.south) |- node[pos=0.75, below, font=\footnotesize] {reclamo} (g.west);
\draw[-{Stealth}, thick] (g.east) -| node[pos=0.25, below, font=\footnotesize] {controllo} (t.south);
\end{tikzpicture}
```

Nell'Unione europea le regole sono fissate dal Regolamento generale sulla protezione dei dati, che tutti chiamano con la sigla inglese GDPR (General Data Protection Regulation). Vale in tutti i paesi dell'Unione e anche per le aziende che hanno sede altrove ma offrono i loro servizi a chi vive qui. In Italia a farlo rispettare è il **Garante per la protezione dei dati personali**, un'autorità indipendente dal governo.

### Che cosa deve rispettare chi tratta i dati

Il regolamento non vieta di usare i dati personali: stabilisce a quali condizioni si può. Le principali si capiscono con un esempio ciascuna.

| Regola | Che cosa vuol dire | Esempio |
|---|---|---|
| finalità | i dati si raccolgono per uno scopo dichiarato e non si riusano per un altro | la scuola ha il tuo indirizzo per comunicare con la famiglia, non per passarlo a una palestra |
| minimizzazione | si raccolgono solo i dati che servono a quello scopo | un'app che fa da torcia non ha bisogno della rubrica |
| conservazione limitata | i dati non si tengono per sempre | chiuso un account, i dati non restano in archivio senza motivo |
| trasparenza | l'interessato deve sapere chi tratta i dati e perché | l'informativa che trovi quando ti iscrivi |
| sicurezza | i dati vanno protetti da accessi e perdite | l'archivio delle [password](/materiale/scuola-superiore/informatica/sicurezza-e-cittadinanza-digitale/password-e-autenticazione) non si conserva in chiaro |

Per trattare un dato serve inoltre un motivo previsto dalla legge. Il più noto è il **consenso** dell'interessato, che deve essere libero, informato e riferito a uno scopo preciso, e che si può ritirare in ogni momento. Non è però l'unico: la scuola tratta i tuoi voti perché è il suo compito, e un negozio in rete tratta il tuo indirizzo perché altrimenti non potrebbe spedirti il pacco. In questi casi il consenso non ti viene chiesto.

```ad-note
L'età per dare il consenso in rete
Per i servizi in rete rivolti direttamente ai ragazzi, il regolamento europeo fissa a 16 anni l'età da cui il consenso è valido e lascia a ogni paese la possibilità di abbassarla, non sotto i 13. L'Italia ha scelto 14 anni: da quell'età puoi dare da solo il consenso al trattamento dei tuoi dati, prima lo danno i tuoi genitori. È una cosa diversa dall'età minima per iscriversi, che ogni servizio stabilisce nelle proprie condizioni d'uso.
```

## I tuoi diritti

Sui dati che ti riguardano hai dei diritti, che valgono verso qualunque titolare.

| Diritto | Che cosa puoi chiedere |
|---|---|
| accesso | sapere se qualcuno tratta i tuoi dati, quali sono, e averne una copia |
| rettifica | far correggere i dati sbagliati |
| cancellazione | far cancellare i dati, nei casi previsti, per esempio quando ritiri il consenso o non servono più |
| opposizione | far smettere un trattamento, per esempio l'invio di pubblicità |
| portabilità | ricevere i tuoi dati in un formato che puoi portare a un altro servizio |

La richiesta si rivolge al titolare, ai contatti scritti nell'informativa, ed è di norma gratuita. Il titolare deve rispondere, di norma entro un mese; se non lo fa, o se la risposta non ti convince, puoi presentare un reclamo al Garante. Finché sei minorenne è più pratico farlo insieme ai tuoi genitori.

```ad-warning
Cancellare non vuol dire far sparire
Il diritto alla cancellazione riguarda il titolare: il servizio toglie il contenuto dai suoi archivi. Non raggiunge chi nel frattempo ha salvato la foto, ha fatto una schermata della chat o l'ha girata ad altri. Una cosa pubblicata, anche per pochi minuti e anche in una storia che "scade", può avere copie che nessuno riesce più a contare.
```

## Le tracce che lasci

Le tue **tracce digitali** sono l'insieme dei dati che la tua attività in rete lascia dietro di sé. Alcune le lasci tu, sapendolo: i post, i commenti, le foto, i "mi piace". Altre vengono raccolte mentre usi un servizio: la posizione, le ricerche, i video guardati e per quanto tempo, il modello del telefono.

Una parte di questa raccolta passa dai cookie. Un **cookie** è un piccolo file che un sito salva nel tuo browser per riconoscerti quando torni. Quelli tecnici servono al funzionamento: ricordano che sei entrato nel tuo account o che cosa hai messo nel carrello. Quelli di profilazione ti seguono da un sito all'altro. La **profilazione** è la raccolta di dati sul comportamento di una persona per dedurne interessi e abitudini, e mostrarle di conseguenza pubblicità e contenuti. È così che si finanziano molti servizi che usi senza pagare. Il banner che compare alla prima visita di un sito serve a chiederti il consenso per i cookie di profilazione, e puoi rifiutarli.

## Che cosa puoi fare oggi

1. Concedi a un'app solo i permessi che servono a ciò che fa, e toglili quando non servono più: si cambiano nelle impostazioni del telefono. Ogni permesso in più è un dato in più che esce.
2. Controlla chi vede il tuo profilo. Spesso l'impostazione di partenza è "tutti", e renderlo visibile ai soli contatti richiede un minuto.
3. Prima di pubblicare, chiediti se ti andrebbe bene che lo vedessero un insegnante, i tuoi genitori, o tu stesso fra cinque anni. Una volta pubblicato, un contenuto non è più sotto il tuo controllo.
4. Non pubblicare i dati degli altri senza il loro accordo: le foto dei compagni, le schermate delle chat, i numeri di telefono. La loro immagine è un loro dato personale, e decidono loro.
5. Non condividere la posizione in tempo reale con chi non conosci, e pubblica le foto dei viaggi al ritorno: una foto con il luogo dice dove sei, e anche dove non sei.
6. Nei moduli di iscrizione compila solo i campi obbligatori. Quello che non hai dato non può essere perso, venduto o rubato.
7. Ogni tanto elimina le app e gli account che non usi più: i dati di un account dimenticato restano in un archivio che nessuno sorveglia per te.

```ad-example
Esempio 2: i permessi di un'app
Un'app per mettere i filtri alle foto chiede cinque permessi: fotocamera, galleria delle foto, rubrica, posizione precisa, microfono. Quali sono giustificati?

Si confronta ogni permesso con quello che l'app deve fare. Fotocamera e galleria servono a scattare e a modificare le foto. Rubrica, posizione e microfono non servono a mettere un filtro: sono dati raccolti per altri scopi, e si possono negare. Se l'app si rifiuta di funzionare senza, hai scoperto qual era il suo vero interesse.
```

```ad-example
Esempio 3: la foto della gita
Giulia vuole pubblicare sul suo profilo, aperto a tutti, una foto di gruppo scattata in gita. Tommaso, che è nella foto, le dice che non vuole. Giulia può pubblicarla lo stesso, visto che la foto l'ha scattata lei?

No. Avere scattato la foto non le dà il diritto di decidere dell'immagine degli altri: per pubblicare il ritratto di una persona serve il suo consenso. Giulia può scegliere una foto in cui Tommaso non c'è, ritagliarla, oppure condividerla solo nel gruppo privato della classe, se a lui va bene.
```

Una regola a parte vale per le immagini intime. Diffondere immagini di questo tipo che ritraggono un'altra persona, senza il suo consenso, è un reato, e può risponderne anche chi le ha ricevute e le fa girare. Se te ne arriva una, non inoltrarla e parlane con un adulto di cui ti fidi.
