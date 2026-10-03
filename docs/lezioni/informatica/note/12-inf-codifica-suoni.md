# Note: La codifica dei suoni

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "La codifica dell'informazione", 3 ottobre 2026).
`check.mts` passa senza errori sui tre file.

## Struttura ed esempi

Segnale analogico e digitale; campionamento e frequenza di campionamento; la regola del campionamento (almeno il
doppio della frequenza più alta), data come regola e senza dimostrazione; quantizzazione e livelli; canali; dimensione
di un suono non compresso in cinque passi; flusso di bit; cenno alla compressione.

Sei esempi svolti: i campioni di 3 secondi a 8 kHz; la regola nei due versi; livelli con 12 bit e bit per 1000
livelli; un messaggio vocale mono (80 kB); un minuto con la qualità di un CD (10,584 MB); i secondi che stanno in
1 MB. Avvisi: il doppio e non lo stesso numero; minuti, kHz e canali dimenticati.

## Conti

Rifatti in Python: $8000 \cdot 3 = 24\,000$; $2^{12} = 4096$, $2^9 = 512$, $2^{10} = 1024$, $2^{16} = 65\,536$;
$8000 \cdot 10 \cdot 8 : 8 = 80\,000$; $44\,100 \cdot 60 = 2\,646\,000$, per 32 fa $84\,672\,000$ bit, cioè
$10\,584\,000\,\text{B}$; $44\,100 \cdot 16 : 8 = 88\,200$ e $1\,000\,000 : 88\,200 = 11{,}34$; $44\,100 \cdot 16 \cdot 2
= 1\,411\,200$; tre minuti di CD sono $31\,752\,000\,\text{B}$. I livelli della figura della quantizzazione (4, 6, 5,
5, 4, 1, 2, 3, 3, 5, 7, 4, 2) sono l'arrotondamento dei tredici campioni della prima figura al mezzo più vicino.

## Scelte

- Il teorema del campionamento è dato come regola, con una frase di perché ("le vibrazioni veloci passano tra un
  campione e l'altro") e l'avviso sui due campioni per vibrazione. Niente aliasing e niente dimostrazione.
- La regola è scritta con "almeno il doppio" ($\ge$), come nei libri di scuola. Il teorema chiede una frequenza
  strettamente maggiore del doppio: a un primo anno la differenza non si vede, ma va segnalata.
- "Livelli" per i valori della quantizzazione, "bit per campione" per la profondità; "profondità in bit" non è usato.
- "Flusso di bit" per il bit rate, in $\text{kbit/s}$ come dice il README; il termine inglese non compare.
- La compressione è un cenno di un paragrafo, senza nomi di formati (MP3, AAC, FLAC), che sono di una lezione del
  terzo anno.
- Convenzione non fissata dal README: la durata nel risultato di un esercizio si scrive `$9297\,\text{s}$`; i canali
  si scrivono per esteso, "mono (1 canale)" e "stereo (2 canali)".

## Figure

- `campionamento-di-un-suono`: il segnale con tredici campioni a intervalli regolari. Guardata in chiaro e in scuro.
- `quantizzazione-a-3-bit`: gli stessi campioni portati su otto livelli, con i numeri dei livelli sotto l'asse.
  Guardata in chiaro e in scuro.

## Fonti da verificare

- Teorema del campionamento: Claude Shannon, "Communication in the Presence of Noise", Proceedings of the IRE, 1949;
  il risultato si attribuisce anche a Harry Nyquist (1928) e a Vladimir Kotel'nikov (1933). Citato a memoria, da
  verificare. Nella lezione il teorema non ha nome: se si vuole nominarlo, "teorema del campionamento di
  Nyquist-Shannon".
- CD audio a 44,1 kHz, 16 bit, stereo: è lo standard "Red Book" di Philips e Sony (1980). Da verificare l'anno.
- Telefonia tradizionale a 8000 campioni al secondo: standard ITU-T G.711 (1972), con 8 bit per campione. Da
  verificare.
- Udito umano tra 20 Hz e 20 kHz: valore dei libri di fisica; il limite alto scende con l'età.
- "Con la compressione un minuto di musica può scendere a circa un decimo": un file a 128 kbit/s è circa un
  undicesimo di 1411,2 kbit/s. Il rapporto dipende dal formato e dalla qualità: da verificare se si vuole un numero.

## Domande per Andrea

- La regola del campionamento con "almeno il doppio": va bene, o preferisci "più del doppio"?
- Il teorema va nominato (Nyquist-Shannon) o resta "la regola del campionamento"?
- Il flusso di bit in kbit/s serve in prima?
- Per la quantizzazione basta "il livello più vicino", o in classe parlate anche del rumore di quantizzazione?
