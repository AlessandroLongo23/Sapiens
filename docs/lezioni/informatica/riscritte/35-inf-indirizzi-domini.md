# Indirizzi IP e nomi di dominio

Un [pacchetto](/materiale/scuola-superiore/informatica/internet-e-il-web/internet-la-rete-delle-reti) arriva a destinazione perché porta scritto dove deve andare, come una lettera con l'indirizzo sulla busta. Su Internet quell'indirizzo è un numero. Tu però non scrivi mai numeri: scrivi nomi, come `www.esempio.it`, e c'è un servizio che li traduce. Questa lezione spiega come sono fatti gli uni e gli altri, e come si passa dal nome al numero.

## L'indirizzo IP

Un **indirizzo IP** è un numero che identifica un dispositivo collegato a Internet. Ogni pacchetto ne porta due: quello del destinatario, che i router leggono per decidere da che parte mandarlo, e quello del mittente, che serve a chi riceve per sapere a chi rispondere. Due dispositivi collegati a Internet nello stesso momento non possono avere lo stesso indirizzo, altrimenti i router non saprebbero a quale dei due consegnare.

Nella versione più diffusa del protocollo IP, la versione 4 o **IPv4**, l'indirizzo è un numero di 32 bit. Scritto in binario sarebbe illeggibile, e allora lo si divide in quattro gruppi di 8 bit, cioè in quattro byte, e si scrive il valore di ogni byte in base dieci, con un punto tra l'uno e l'altro: `192.0.2.45`.

```tikz
% nome: indirizzo-ipv4-quattro-byte
% alt: L'indirizzo IPv4 192.0.2.45 scritto in quattro caselle separate da punti. Sotto ogni casella c'è lo stesso numero in binario su 8 bit: 11000000, 00000000, 00000010, 00101101. Una graffa sotto la prima casella indica 8 bit, cioè 1 byte; una graffa sotto tutte e quattro indica 32 bit
\begin{tikzpicture}
\tikzset{
  dec/.style={draw, thick, fill=blue!10, minimum width=1.8cm, minimum height=0.8cm, font=\large\ttfamily},
  bin/.style={font=\footnotesize\ttfamily}}
\node[dec] (a) at (0.9,0) {192};
\node[dec] (b) at (3.1,0) {0};
\node[dec] (c) at (5.3,0) {2};
\node[dec] (d) at (7.5,0) {45};
\node[font=\large] at (2.0,-0.1) {.};
\node[font=\large] at (4.2,-0.1) {.};
\node[font=\large] at (6.4,-0.1) {.};
\node[bin] at (0.9,-0.8) {11000000};
\node[bin] at (3.1,-0.8) {00000000};
\node[bin] at (5.3,-0.8) {00000010};
\node[bin] at (7.5,-0.8) {00101101};
\draw[thick] (0.05,-1.15) -- (0.05,-1.3) -- (1.75,-1.3) -- (1.75,-1.15);
\node[font=\footnotesize] at (0.9,-1.6) {8 bit, 1 byte};
\draw[thick] (0.05,-2.0) -- (0.05,-2.15) -- (8.35,-2.15) -- (8.35,-2.0);
\node[font=\footnotesize] at (4.2,-2.45) {32 bit in tutto};
\end{tikzpicture}
```

Da qui viene la regola per riconoscere un indirizzo IPv4 scritto bene. Con 8 bit si scrivono $2^8 = 256$ valori, da 0 a 255, come hai visto nelle [conversioni tra binario e decimale](/materiale/scuola-superiore/informatica/i-sistemi-di-numerazione/conversioni-tra-binario-e-decimale): quindi i numeri sono esattamente quattro, e ognuno è compreso tra 0 e 255.

```ad-example
Esempio 1: quali sono indirizzi IPv4
Quali di queste scritture sono indirizzi IPv4: `203.0.113.7`, `198.51.100.256`, `192.0.2`, `192.0.2.1.5`?

Solo la prima. Nella seconda l'ultimo numero è 256, che su 8 bit non si può scrivere: il massimo è 255. La terza ha tre numeri e la quarta ne ha cinque, mentre i byte sono quattro.
```

```ad-warning
Il massimo è 255, non 256
I valori di un byte sono 256, ma si contano a partire da 0: il più grande è 255. L'altro errore è leggere i punti come virgole dei decimali o come separatori delle migliaia: `192.0.2.45` non è un numero solo, sono quattro numeri in fila.
```

### Gli indirizzi non bastano più: IPv6

Con 32 bit gli indirizzi diversi sono $2^{32} = 4\,294\,967\,296$, poco più di quattro miliardi. Quando IPv4 fu progettato sembravano un'enormità. Oggi i dispositivi collegati sono molti di più, e gli indirizzi IPv4 liberi sono finiti.

La versione 6 del protocollo, **IPv6**, usa indirizzi di 128 bit. Si scrivono in [esadecimale](/materiale/scuola-superiore/informatica/i-sistemi-di-numerazione/il-sistema-esadecimale), in otto gruppi di quattro cifre separati dai due punti, come `2001:0db8:0000:0000:0000:0000:0000:0001`. Poiché sono lunghi, si possono togliere gli zeri all'inizio di ogni gruppo e sostituire una fila di gruppi tutti a zero con `::`, e lo stesso indirizzo diventa `2001:db8::1`. Gli indirizzi possibili sono $2^{128}$, circa $3{,}4 \cdot 10^{38}$: abbastanza per darne uno a ogni oggetto che verrà mai collegato. Oggi le due versioni convivono, e molti dispositivi hanno un indirizzo dell'una e uno dell'altra.

| | IPv4 | IPv6 |
|---|---|---|
| Lunghezza | 32 bit | 128 bit |
| Come si scrive | quattro numeri in base dieci, da 0 a 255, separati da punti | otto gruppi di quattro cifre esadecimali, separati da due punti |
| Esempio | `192.0.2.45` | `2001:db8::1` |
| Quanti indirizzi | $2^{32}$, circa 4,3 miliardi | $2^{128}$, circa $3{,}4 \cdot 10^{38}$ |

### Chi ti dà l'indirizzo

L'indirizzo non è scritto dentro il dispositivo: te lo assegna la rete a cui ti colleghi. Quello con cui esci su Internet te lo dà il fornitore di accesso, che ne possiede un certo numero e li distribuisce ai clienti. Di solito è un **indirizzo dinamico**, che può cambiare da un collegamento all'altro, perché così il fornitore riusa gli indirizzi di chi in quel momento è scollegato. Un [server](/materiale/scuola-superiore/informatica/internet-e-il-web/il-modello-client-server), che deve farsi trovare sempre nello stesso posto, ha invece un **indirizzo statico**, che non cambia.

```ad-note
Gli indirizzi che vedi a casa
Nelle impostazioni del Wi-Fi il telefono mostra spesso un indirizzo che comincia con `192.168`. È un indirizzo che vale solo dentro la rete locale, assegnato dal router di casa. Verso l'esterno tutti i dispositivi della casa si presentano con l'unico indirizzo che il fornitore ha dato al router.
```

## I nomi di dominio

Ricordare `203.0.113.10` è scomodo, e ricordarne venti è impossibile. Per questo ai server si dà anche un **nome di dominio**, un nome fatto di parole separate da punti che sta al posto dell'indirizzo IP: `www.esempio.it`.

Le parti di un nome di dominio si leggono da destra verso sinistra, dalla più generale alla più particolare, come un indirizzo di casa letto a partire dallo Stato.

```tikz
% nome: livelli-nome-di-dominio
% alt: Il nome di dominio www.esempio.it diviso in tre caselle separate da punti. Sotto la casella it c'è scritto primo livello, sotto esempio secondo livello, sotto www terzo livello. Una freccia in alto va da destra verso sinistra, con la scritta dal generale al particolare
\begin{tikzpicture}
\tikzset{
  parte/.style={draw, thick, minimum height=0.8cm, font=\large\ttfamily},
  liv/.style={font=\footnotesize, align=center}}
\node[parte, fill=orange!25, minimum width=1.6cm] (w) at (1.6,0) {www};
\node[parte, fill=green!15, minimum width=2.4cm] (e) at (4.3,0) {esempio};
\node[parte, fill=blue!10, minimum width=1.4cm] (i) at (6.9,0) {it};
\node[font=\large] at (2.75,-0.1) {.};
\node[font=\large] at (5.85,-0.1) {.};
\node[liv] at (1.6,-0.95) {terzo livello\\scelto a piacere};
\node[liv] at (4.3,-0.95) {secondo livello\\il nome registrato};
\node[liv] at (6.9,-0.95) {primo livello\\il gruppo};
\draw[-{Stealth}, thick] (7.6,0.75) -- (0.8,0.75);
\node[font=\footnotesize] at (4.2,1.05) {dal generale al particolare};
\end{tikzpicture}
```

- L'ultima parte, `it`, è il **dominio di primo livello** (TLD, Top-Level Domain). Dice a quale grande gruppo appartiene il nome.
- La parte prima, `esempio`, è il **dominio di secondo livello**: è il nome che il proprietario ha scelto e registrato, e dentro lo stesso primo livello non ce ne possono essere due uguali.
- Quello che sta ancora più a sinistra lo decide il proprietario, senza chiedere a nessuno, per distinguere i suoi server: `www.esempio.it` per il sito, `posta.esempio.it` per la posta.

I domini di primo livello sono di due famiglie:

| Tipo | Esempi | Che cosa indica |
|---|---|---|
| nazionali, di due lettere | `.it`, `.fr`, `.de` | uno Stato: Italia, Francia, Germania |
| generici | `.com`, `.org`, `.net` | in origine il tipo di attività: aziende, organizzazioni, servizi di rete |

Un nome di dominio si usa dopo averlo registrato, cioè dopo aver pagato una quota annuale perché venga scritto a tuo nome nel registro del suo dominio di primo livello. Finché paghi è tuo e di nessun altro. Maiuscole e minuscole non contano: `WWW.Esempio.IT` e `www.esempio.it` sono lo stesso nome.

```ad-example
Esempio 2: le parti di un nome
Nel nome `registro.scuola.example`, qual è il dominio di primo livello, qual è il nome registrato e che cosa ha scelto il proprietario?

Si legge da destra. Il primo livello è `example`, un dominio riservato agli esempi. Il nome registrato è `scuola`, al secondo livello. La parte `registro` l'ha aggiunta il proprietario di `scuola.example` per il server del registro elettronico.
```

```ad-warning
Chi è il proprietario si legge a destra
Il nome `www.esempio.it.accesso-clienti.example` comincia come `www.esempio.it`, ma le ultime due parti sono `accesso-clienti.example`: il sito è di chi ha registrato quel nome, e tutto quello che sta a sinistra l'ha scritto lui a piacere. È uno dei trucchi del [phishing](/materiale/scuola-superiore/informatica/sicurezza-e-cittadinanza-digitale/phishing-e-truffe-in-rete): quando controlli un indirizzo, guarda la fine del nome e non l'inizio.
```

```ad-note
Quando le parti fisse sono due
In alcuni casi il gruppo è indicato dalle ultime due parti. I siti delle scuole italiane finiscono in `.edu.it`: lì il nome registrato dalla scuola è il terzo da destra.
```

## Il DNS: dal nome al numero

I router leggono solo numeri. Prima di mandare un pacchetto a `www.esempio.it` il tuo dispositivo deve quindi scoprire quale indirizzo IP corrisponde a quel nome. Lo chiede al **DNS** (Domain Name System, sistema dei nomi di dominio), il servizio di Internet che traduce i nomi di dominio in indirizzi IP. Funziona come la rubrica del telefono, in cui cerchi un nome e trovi un numero.

```tikz
% nome: dns-dal-nome-all-indirizzo
% alt: A sinistra il client, cioè il browser. A destra due server: in alto il server DNS, in basso il server web. La freccia 1 va dal client al server DNS con la domanda www.esempio.it; la freccia 2 torna al client con l'indirizzo 203.0.113.10. La freccia 3 va dal client al server web con la richiesta all'indirizzo 203.0.113.10; la freccia 4 torna al client con la pagina
\begin{tikzpicture}
\tikzset{
  nodo/.style={draw, thick, rounded corners=4pt, minimum width=1.9cm, align=center, font=\small},
  et/.style={font=\footnotesize}}
\node[nodo, fill=blue!10, minimum height=4.2cm] (c) at (0.95,0) {client\\{\footnotesize il browser}};
\node[nodo, fill=orange!25, minimum height=1.5cm] (d) at (7.95,1.35) {server\\DNS};
\node[nodo, fill=green!15, minimum height=1.5cm] (w) at (7.95,-1.35) {server\\web};
\draw[-{Stealth}, thick] (2.0,1.55) -- (6.9,1.55);
\draw[-{Stealth}, thick] (6.9,1.15) -- (2.0,1.15);
\draw[-{Stealth}, thick] (2.0,-1.15) -- (6.9,-1.15);
\draw[-{Stealth}, thick] (6.9,-1.55) -- (2.0,-1.55);
\node[et] at (4.45,1.85) {1. che indirizzo ha \texttt{www.esempio.it}?};
\node[et] at (4.45,0.85) {2. \texttt{203.0.113.10}};
\node[et] at (4.45,-0.85) {3. richiesta a \texttt{203.0.113.10}};
\node[et] at (4.45,-1.85) {4. risposta: la pagina};
\end{tikzpicture}
```

1. Scrivi `www.esempio.it` nel browser. Il browser chiede a un server DNS quale indirizzo ha quel nome.
2. Il server DNS risponde con l'indirizzo: `203.0.113.10`.
3. Il browser manda la sua richiesta a quell'indirizzo.
4. Il server risponde con la pagina.

I primi due passi durano una frazione di secondo e non li vedi. Il dispositivo inoltre ricorda per un po' le risposte che ha ricevuto, così non rifà la domanda ogni volta che torni sullo stesso sito. Nessun server DNS conosce tutti i nomi del mondo: quello a cui ti rivolgi, di solito del tuo fornitore di accesso, quando non sa la risposta la chiede ad altri server DNS, che si dividono i nomi seguendo i livelli.

Tenere separati il nome e il numero ha un vantaggio preciso: il nome è per le persone e può restare lo stesso per anni, mentre il numero dipende dalla rete in cui si trova il server e può cambiare.

```ad-example
Esempio 3: il sito cambia server
La scuola sposta il suo sito su un server nuovo, che ha indirizzo `198.51.100.20` al posto di `203.0.113.10`. Che cosa deve cambiare chi visita il sito?

Niente. La scuola aggiorna la voce del DNS, che da quel momento fa corrispondere al nome `www.scuola.example` il nuovo indirizzo. Chi scrive il nome riceve dal DNS il numero nuovo e arriva al server nuovo senza accorgersi di nulla.
```

```ad-example
Esempio 4: il DNS non risponde
Una sera nessun sito si apre scrivendo il nome, mentre un servizio a cui il telefono si collega usando direttamente l'indirizzo IP continua a funzionare. Dov'è il guasto?

Il collegamento a Internet funziona, perché i pacchetti verso un indirizzo IP arrivano. Manca la traduzione: il server DNS non risponde, e senza l'indirizzo il browser non sa dove mandare la richiesta.
```

```ad-warning
Il DNS non è un motore di ricerca
Il DNS traduce un nome esatto, lettera per lettera, e non indovina che cosa volevi scrivere. Se sbagli una lettera ottieni un errore, oppure arrivi su un altro sito che ha registrato proprio il nome sbagliato.
```
