# Note: L'equilibrio sul piano inclinato

Lezione nuova (secondo lotto di fisica, gruppo 6, 30 settembre 2026). Conti rifatti in Python: $\sin^{-1} 0{,}24 =
13{,}9^\circ$; $8{,}0 \cdot 9{,}8 = 78{,}4$ N, $39{,}2$ e $67{,}896$ N, $\sqrt{39{,}2^2 + 67{,}9^2} = 78{,}4$; $25 \cdot 9{,}8 =
245$ N, $245 \cdot 1{,}2 / 5{,}0 = 58{,}8$ N, $b = 4{,}854$ m, $F_v = 237{,}8$ N; $\tan 22^\circ = 0{,}404$, $\tan^{-1}
0{,}62 = 31{,}8^\circ$; $5{,}0 \cdot 9{,}8 = 49$ N, $\tan 20^\circ = 0{,}364$, $49 \sin 20^\circ = 16{,}76$ N, $0{,}50 \cdot 49
\cos 20^\circ = 23{,}02$ N; $\tan 30^\circ = 0{,}577$, $0{,}35 \cdot 49 \cos 30^\circ = 14{,}85$ N, $49 \sin 30^\circ = 24{,}5$
N; nella figura interattiva gli angoli limite $21{,}8^\circ$ e $31{,}8^\circ$. `check.mts` passa.

## Struttura ed esempi

Il piano inclinato (lunghezza, altezza, base, inclinazione, con seno, coseno e tangente), il peso scomposto (perché
l'angolo tra il peso e la componente perpendicolare è $\alpha$, formule con il seno e il coseno e con $h/l$ e $b/l$, la
similitudine), due avvisi (seno e coseno scambiati con il controllo dei casi limite; l'angolo del piano e l'angolo tra le
forze), l'esempio 1; il piano liscio (reazione $P\cos\alpha$, forza equilibrante $P\sin\alpha$, il piano come macchina
semplice), l'avviso sulla reazione che non è il peso, l'esempio 2 (una rampa con altezza e lunghezza, anche la reazione
con Pitagora); il piano con l'attrito ($\tan\alpha \le \mu_s$, angolo limite indipendente dalla massa, come si misura
$\mu_s$), gli esempi 3 (misurare $\mu_s$), 4 (resta ferma) e 5 (scivola), l'avviso sull'attrito non sempre al massimo, la
figura interattiva.

## Scelte

- $P_\parallel$ e $P_\perp$ per le componenti, $F_v$ per la reazione come nella lezione 20, $F_\perp$ per la forza
  premente come nella lezione sull'attrito (sul piano $F_\perp = F_v = P\cos\alpha$).
- L'esempio 5 dice che la cassa "scende sempre più veloce" senza calcolare l'accelerazione, che è del secondo anno.
- Non ho messo la forza orizzontale che tiene un corpo sul piano liscio ($F = P\tan\alpha$), né la forza per spingere un
  corpo in salita con l'attrito: sono esercizi classici, ma allungano la lezione. Da decidere.
- Nella figura interattiva il blocco che scivola scende a passo costante (niente dinamica), come il blocco della lezione
  sull'attrito; si ferma se l'inclinazione scende sotto $\tan^{-1}\mu_d$ o arriva in fondo al piano.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `piano-inclinato-lunghezza-altezza`, `peso-scomposto-piano-inclinato`
($30^\circ$, peso di $1{,}8$ cm, componenti di $0{,}9$ e $1{,}56$ cm, l'angolo $\alpha$ segnato alla base e tra $\vec{P}$ e
$\vec{P}_\perp$), `forze-piano-liscio-filo` (stessa scala: $F_v$ lunga come $P_\perp$, $T$ come $P_\parallel$),
`forze-piano-attrito-statico` ($20^\circ$, frecce di $1{,}4$, $1{,}32$ e $0{,}48$ cm). Interattiva
`piano-inclinato-scomposizione-peso` (`fisica/PianoInclinatoPeso.tsx`): blocco di $5{,}0$ kg, inclinazione da $0^\circ$ a
$60^\circ$, senza attrito (un filo tiene il blocco) o con due coppie di superfici ($\mu_s = 0{,}40$, $\mu_d = 0{,}30$;
legno su legno $0{,}62$ e $0{,}48$, come la figura della lezione sull'attrito).

## Esercizi

Generatore `fis-equilibrio-piano-inclinato`, cinque livelli (specifica in `specs/exercises/fis-equilibrio-piano-inclinato.md`),
scena `piano-inclinato` (nuova, `scenes/PianoInclinato.tsx`).

## Domande per Andrea

- $P_\parallel$ e $P_\perp$, o $P_x$ e $P_y$ con gli assi lungo il piano? E "componente parallela" o "componente attiva"?
- Le formule con $h/l$ e $b/l$ vanno date accanto a seno e coseno, o l'Amaldi usa solo quelle (il seno arriva dopo)?
- La forza orizzontale sul piano liscio e la forza per spingere in salita con l'attrito: servono nella lezione?
- L'angolo limite con la misura di $\mu_s$ è nell'Amaldi del primo anno, o anticipa troppo?
