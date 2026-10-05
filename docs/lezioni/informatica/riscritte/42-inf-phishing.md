# Phishing e truffe in rete

"Il tuo account sarà chiuso entro 24 ore: clicca qui per confermare i tuoi dati." Messaggi così arrivano ogni giorno, per posta, per SMS, in chat. La maggior parte delle truffe in rete non forza nessun computer: convince una persona a consegnare da sola quello che il truffatore cerca. Chi sa come sono fatti questi messaggi li riconosce quasi sempre in pochi secondi.

## Che cos'è il phishing

Il **phishing** (dall'inglese fishing, pescare) è una truffa in cui qualcuno si finge un soggetto di cui ti fidi, per esempio la banca, un corriere, la scuola, la piattaforma di un gioco o un amico, per farti consegnare credenziali, codici o denaro, oppure per farti installare un programma. Il messaggio è l'esca, e viene gettato a moltissime persone insieme, contando sul fatto che qualcuna abbocchi.

Il phishing è il caso più diffuso di **ingegneria sociale**, cioè l'insieme delle tecniche che ottengono qualcosa ingannando la persona, non la macchina. Fa leva su reazioni che abbiamo tutti: la fretta, la paura di perdere qualcosa, la curiosità, la voglia di un guadagno facile, il rispetto per chi sembra un'autorità. Per questo ci cascano anche gli adulti e anche le persone esperte: non è questione di intelligenza, ma di attenzione in quel momento.

## I passi di un attacco e dove si ferma

Un attacco di phishing che punta alle credenziali segue sempre lo stesso percorso, e a ogni passo c'è un controllo che lo interrompe.

```tikz
% nome: passi-attacco-phishing
% alt: Quattro passi di un attacco di phishing in colonna, ciascuno con accanto il modo di fermarlo. Primo: arriva un messaggio che mette fretta; lo fermi non usando il link e andando sul sito da solo. Secondo: il link apre una pagina che imita quella vera; lo fermi leggendo il dominio nell'indirizzo. Terzo: scrivi nome utente e password; ti ferma il gestore di password, che su quel dominio non le propone. Quarto: le credenziali vengono usate sul sito vero; le ferma il secondo fattore, e tu cambi la password
\begin{tikzpicture}
\tikzset{p/.style={draw, thick, rounded corners=2pt, fill=orange!28, text width=3.5cm, minimum height=1.05cm, align=center, font=\footnotesize},
d/.style={draw, thick, rounded corners=2pt, fill=green!15, text width=3.7cm, minimum height=1.05cm, align=center, font=\footnotesize}}
\node[font=\small] at (0,0.95) {che cosa succede};
\node[font=\small] at (4.5,0.95) {che cosa lo ferma};
\node[p] (a) at (0,0) {1. arriva un messaggio\\che mette fretta};
\node[p] (b) at (0,-1.5) {2. il link apre una pagina\\che imita quella vera};
\node[p] (c) at (0,-3.0) {3. scrivi nome utente\\e password};
\node[p] (e) at (0,-4.5) {4. le credenziali vengono\\usate sul sito vero};
\node[d] at (4.5,0) {non usi il link:\\vai sul sito da solo};
\node[d] at (4.5,-1.5) {leggi il dominio\\nell'indirizzo};
\node[d] at (4.5,-3.0) {il gestore di password\\lì non le propone};
\node[d] at (4.5,-4.5) {il secondo fattore;\\cambi subito la password};
\draw[-{Stealth}, thick] (a) -- (b);
\draw[-{Stealth}, thick] (b) -- (c);
\draw[-{Stealth}, thick] (c) -- (e);
\end{tikzpicture}
```

Prima ti fermi, meno danni ci sono: al primo passo non succede niente, al quarto devi correre ai ripari.

## I segnali in un messaggio

Questo messaggio è inventato, ma ha la forma di quelli veri.

```tikz
% nome: messaggio-phishing-segnali
% alt: Un messaggio di posta con cinque punti numerati. Uno: il mittente si chiama Assistenza GiocoEsempio ma l'indirizzo è aiuto@giocoesempio.premi-vip.example. Due: l'oggetto è Urgente, account sospeso. Tre: il saluto è Gentile utente. Quattro: il testo chiede di confermare la password entro 24 ore, altrimenti l'account sarà eliminato. Cinque: un pulsante con scritto Conferma ora
\begin{tikzpicture}
\tikzset{r/.style={font=\footnotesize, anchor=west},
n/.style={draw, thick, circle, inner sep=1.5pt, fill=orange!35, font=\footnotesize}}
\draw[thick, rounded corners=4pt] (0,0) rectangle (7.6,4.5);
\draw[thick] (0,2.75) -- (7.6,2.75);
\node[r] at (0.15,4.1) {Da: Assistenza GiocoEsempio};
\node[r, font=\footnotesize\ttfamily] at (0.15,3.65) {aiuto@giocoesempio.premi-vip.example};
\node[r] at (0.15,3.1) {Oggetto: URGENTE, account sospeso};
\node[r] at (0.15,2.35) {Gentile utente,};
\node[r] at (0.15,1.9) {conferma la tua password entro 24 ore};
\node[r] at (0.15,1.5) {o il tuo account sarà eliminato.};
\node[draw, thick, rounded corners=3pt, fill=blue!12, font=\footnotesize, minimum width=2.4cm, minimum height=0.6cm] at (1.5,0.6) {Conferma ora};
\node[n] at (7.15,3.65) {1};
\node[n] at (7.15,3.1) {2};
\node[n] at (7.15,2.35) {3};
\node[n] at (7.15,1.7) {4};
\node[n] at (3.2,0.6) {5};
\end{tikzpicture}
```

1. L'indirizzo del mittente non corrisponde al nome. Il nome mostrato lo sceglie chi scrive; l'indirizzo dice da dove arriva davvero il messaggio, e qui il dominio è `premi-vip.example`, non quello del servizio.
2. Il tono è urgente e minaccioso. La fretta serve a non lasciarti il tempo di controllare.
3. Il saluto è generico. Chi ha davvero un tuo account sa come ti chiami; chi scrive a migliaia di indirizzi no.
4. Ti chiede una password. Nessun servizio chiede per messaggio password, codici o numeri di carta.
5. C'è un pulsante, cioè un link di cui non vedi la destinazione.

```ad-warning
Un messaggio scritto bene non è per questo vero
Una volta i messaggi falsi si riconoscevano dagli errori di grammatica; oggi molti sono scritti in un italiano corretto, con il logo giusto e i colori giusti, perché copiare l'aspetto di un messaggio vero non costa niente. L'aspetto non prova nulla: contano l'indirizzo del mittente, la destinazione del link e che cosa ti viene chiesto.
```

## Leggere l'indirizzo di un link

Il testo di un link e la sua destinazione sono due cose distinte: su un pulsante può esserci scritto qualunque cosa. Per vedere dove porta, al computer fermi il puntatore sopra il link senza fare clic; sul telefono tieni premuto finché compare l'indirizzo.

Di un [URL](/materiale/scuola-superiore/informatica/internet-e-il-web/il-web-ipertesti-url-e-protocollo-http) la parte che conta è il [nome di dominio](/materiale/scuola-superiore/informatica/internet-e-il-web/indirizzi-ip-e-nomi-di-dominio), che sta tra `://` e la prima barra e si legge da destra: le ultime due parti, quelle subito prima della barra, sono il nome registrato e il suo dominio di primo livello, e dicono a chi appartiene il sito. Tutto quello che sta più a sinistra lo sceglie liberamente il proprietario del dominio, che può scriverci anche il nome di qualcun altro.

```tikz
% nome: dominio-vero-in-un-url
% alt: L'indirizzo https://banca.esempio.it.conto-ok.example/accedi diviso in quattro riquadri: https:// è il protocollo; banca.esempio.it. è una parte scelta da chi possiede il dominio, messa lì per ingannare; conto-ok.example, subito prima della prima barra, è il dominio vero; /accedi è il percorso della pagina
\begin{tikzpicture}
\tikzset{pezzo/.style={draw, thick, minimum height=0.7cm, inner xsep=2pt, font=\scriptsize\ttfamily}}
\node[pezzo, fill=gray!20, minimum width=1.3cm] at (0.65,0) {https://};
\node[pezzo, fill=blue!12, minimum width=2.6cm] at (2.6,0) {banca.esempio.it.};
\node[pezzo, fill=orange!35, minimum width=2.6cm] at (5.2,0) {conto-ok.example};
\node[pezzo, fill=gray!20, minimum width=1.3cm] at (7.15,0) {/accedi};
\draw[thick] (2.6,-0.35) -- (2.6,-0.8);
\draw[thick] (5.2,0.35) -- (5.2,0.8);
\node[font=\footnotesize, align=center] at (2.6,-1.25) {lo sceglie chi possiede il\\dominio: serve a ingannare};
\node[font=\footnotesize, align=center] at (5.2,1.25) {il dominio vero: subito\\prima della prima barra};
\end{tikzpicture}
```

```ad-example
Esempio 1: quale indirizzo è del sito vero
Il sito vero di un servizio è `esempio.it`. Quali di questi indirizzi gli appartengono?

- `https://www.esempio.it/accedi`: sì, il dominio è `esempio.it`.
- `https://accedi.esempio.it/`: sì, prima della barra c'è ancora `esempio.it`; `accedi` è una parte aggiunta dal proprietario.
- `https://esempio.it.accesso.example/accedi`: no, prima della barra c'è `accesso.example`.
- `https://esempio-it.example/accedi`: no, il dominio è `esempio-it.example`: il trattino al posto del punto cambia tutto.
- `https://www.esernpio.it/accedi`: no, guardando bene le lettere sono `r` e `n` accostate per sembrare una `m`.
```

```ad-warning
Il lucchetto non dice che il sito è onesto
Il lucchetto accanto all'indirizzo, e `https` all'inizio, dicono che i dati viaggiano cifrati tra te e quel sito, così che nessuno li legga lungo il percorso. Non dicono chi c'è dall'altra parte: anche una pagina falsa può avere il lucchetto, e in quel caso consegni la password in modo riservatissimo alla persona sbagliata.
```

## Le altre forme della stessa truffa

Il canale cambia, lo schema resta: qualcuno che si finge un altro, una ragione per fare in fretta, una richiesta.

| Come arriva | Che cosa dice, di solito | Che cosa fare |
|---|---|---|
| SMS | un pacco in giacenza, un accesso sospetto al conto, con un link | aprire l'app o il sito del corriere o della banca, senza il link |
| telefonata | un finto operatore chiede di "confermare" un codice appena arrivato | riattaccare e chiamare il numero ufficiale |
| chat, dal profilo di un amico | "ti è arrivato un codice per sbaglio, me lo giri?" | non girarlo: è il codice del tuo account; sentire l'amico a voce |
| annuncio o negozio | un prezzo molto più basso degli altri, pagamento solo con ricariche o buoni regalo | lasciar perdere: quei pagamenti non si possono annullare |
| pagina o video su un gioco | monete o oggetti gratis in cambio dell'accesso con il tuo account | niente di gratis passa dalla tua password |
| codice QR | un adesivo o un volantino che rimanda a una pagina | leggere l'indirizzo che compare prima di aprirlo |

Quando il messaggio è costruito per una persona precisa, con il suo nome, la sua scuola, la sua classe, è molto più credibile. Quelle informazioni di solito vengono da ciò che la persona stessa ha pubblicato: è uno dei motivi per cui conta la lezione su [privacy e dati personali](/materiale/scuola-superiore/informatica/sicurezza-e-cittadinanza-digitale/privacy-e-dati-personali).

```ad-example
Esempio 2: il codice chiesto in chat
Sara riceve un messaggio dal profilo di Luca, un compagno: "Ho sbagliato numero e ti è arrivato un mio codice di 6 cifre, me lo mandi? È urgente". Un attimo prima le è arrivato davvero un SMS con un codice. Che cosa sta succedendo?

Qualcuno è entrato nell'account di Luca e ora prova a entrare in quello di Sara: ha chiesto al servizio di accedere con il numero di lei, e il servizio ha mandato a lei il codice di verifica. Se Sara lo gira, consegna il proprio account. Non risponde in chat, chiama Luca per avvisarlo che il suo profilo è in mano ad altri, e non usa quel codice.
```

## Le regole, con il loro motivo

1. Non usare il link del messaggio: apri l'app o scrivi tu l'indirizzo del sito. Se l'avviso è vero, lo ritrovi lì; se è falso, non hai toccato niente.
2. Verifica con un altro canale. Un amico lo chiami; la banca la chiami al numero stampato sulla carta, non a quello scritto nel messaggio.
3. Non comunicare mai password, codici usa e getta o dati della carta a chi te li chiede. Chi gestisce il servizio non ne ha bisogno, quindi chi li chiede non è il servizio.
4. Prenditi dieci minuti. La fretta è lo strumento della truffa, e nessuna scadenza vera scade mentre controlli.
5. Lascia inserire le credenziali al [gestore di password](/materiale/scuola-superiore/informatica/sicurezza-e-cittadinanza-digitale/password-e-autenticazione). Il gestore le propone solo sul dominio per cui le ha salvate: se su una pagina che sembra quella solita non propone niente, guarda l'indirizzo.
6. Segnala il messaggio come phishing nel programma di [posta](/materiale/scuola-superiore/informatica/internet-e-il-web/posta-elettronica-e-altri-servizi-di-internet) o nell'app, poi cancellalo. La segnalazione serve ai filtri che proteggono anche gli altri.

## Se ci sei cascato

Può succedere a chiunque, e conta quanto in fretta reagisci.

1. Cambia subito la password dell'account, entrando dal sito vero, e cambiala ovunque usavi la stessa. Attiva i due fattori e chiudi le sessioni aperte su altri dispositivi.
2. Se hai dato i dati di una carta o hai pagato, avvisa i tuoi genitori e fate bloccare la carta chiamando la banca.
3. Se hai installato qualcosa, segui i passi della lezione su [virus e malware](/materiale/scuola-superiore/informatica/sicurezza-e-cittadinanza-digitale/virus-e-malware).
4. Conserva i messaggi, anche con una schermata, e parlane con un adulto: una truffa si può denunciare alla Polizia Postale. Tacere per vergogna aiuta solo chi ti ha ingannato.
