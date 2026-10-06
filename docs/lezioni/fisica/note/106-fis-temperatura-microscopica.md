# Note: Temperatura ed energia cinetica delle molecole

Lezione nuova (lotto del terzo anno, gruppo 40, 6 ottobre 2026). `check.mts`: 0 errori, 1 avviso (il titolo "Non tutte
alla stessa velocità: la distribuzione di Maxwell" ha la maiuscola di un nome proprio; lo stesso nel formulario).
Conti rifatti in Python (`scratchpad/gruppo-40/conti106.py`):

- $k_B = R/N_A = 1{,}380 \cdot 10^{-23}$; esempio 1: $\frac{3}{2} \cdot 1{,}38 \cdot 10^{-23} \cdot 293 = 6{,}065 \cdot 10^{-21}$ J, per una mole $3651$ J;
- esempio 2: $2 \cdot 293 = 586$ K $= 313\,^\circ$C; $313/293 = 1{,}068$;
- esempio 3: $\sqrt{3 \cdot 8{,}31 \cdot 293 / 0{,}0280} = 510{,}8$ m/s; con $M$ in grammi $16{,}2$ m/s;
- tabella a 293 K: idrogeno $1902$, elio $1351$, vapore d'acqua $637$, azoto $511$, ossigeno $478$, anidride carbonica $407$ m/s
  (i primi due scritti $1900$ e $1350$);
- esempio 4: $\sqrt{28{,}0/4{,}00} = 2{,}646$; esempio 5: $4{,}00 \cdot 10^{-3} \cdot (1{,}37 \cdot 10^3)^2 / (3 \cdot 8{,}31) = 301{,}1$ K;
- azoto a 300 K: $v_p = 422$, $\bar v = 476$, $v_{qm} = 517$ m/s; a 600 K $731$ m/s; rapporti $0{,}816$ e $0{,}921$;
- neon: $430$ m/s a 150 K, $861$ a 600 K; $K_m$ a 300 K $= 6{,}21 \cdot 10^{-21}$ J;
- esempio 6: $\frac{3}{2} \cdot 8{,}31 \cdot 293 = 3652$ J, $3652/9{,}8 = 372{,}7$ m; una mole a 293 K e 1 atm occupa $24{,}1$ L;
- curve di Maxwell nel TikZ: $f(v) = \sqrt{2/\pi}\,v^2/a^3\,e^{-v^2/2a^2}$ con $a = \sqrt{RT/M}$ ($298{,}4$ m/s a 300 K, $516{,}8$ a
  900 K), massimi a $3{,}60$ cm e $2{,}08$ cm (rapporto $\sqrt{3}$, aree uguali).

## Scelte

- Confine con la 105: qui si parte dai due $pV$ e si ricava $K_m = \frac{3}{2} k_B T$; la pressione dagli urti non si
  ripete.
- Confine con la 108: l'energia cinetica di tutte le molecole, $\frac{3}{2} n R T$, compare qui in una sezione breve
  con l'esempio 6, come ponte; il nome "energia interna", la funzione di stato e l'esperienza di Joule sono della 108.
- Confine con la 112 (gruppo 42): la rotazione delle molecole biatomiche è solo nominata in una nota, con il link.
- La distribuzione di Maxwell è qualitativa: niente formula nel testo (c'è solo nel codice delle figure). Le tre
  velocità $v_p$, $\bar v$, $v_{qm}$ con i rapporti $0{,}82$ e $0{,}92$ dati come "si dimostra".
- Simboli: $K_m$ come nel README; $v_p$ per la velocità più probabile (non è nel README).
- La tabella delle velocità dà valori a 293 K per collegarsi all'esempio 3.

## Domande per Andrea

- "Agitazione termica" va introdotta qui o c'è già nella 104?
- La velocità più probabile e la velocità media: tenerle (con i due rapporti numerici) o lasciare solo $v_{qm}$?
- La coda della distribuzione con l'evaporazione e la fuga di idrogeno ed elio dall'atmosfera: resta qui o va
  spostata dove si parla di velocità di fuga (97)?
- Nell'esempio 6 il confronto con il chilogrammo che cade da 370 metri è chiaro o distrae?

## Da verificare

- Masse molari (g/mol): idrogeno $2{,}02$, elio $4{,}00$, acqua $18{,}0$, neon $20{,}2$, azoto $28{,}0$, ossigeno $32{,}0$, argon
  $39{,}9$, anidride carbonica $44{,}0$, kripton $83{,}8$.
- Maxwell ricavò la distribuzione nel 1860: scritto a memoria.
- Velocità di fuga dalla Terra $11{,}2$ km/s (è il valore della lezione 97? controllare che coincida).
- "Idrogeno ed elio si sono dispersi nello spazio in miliardi di anni": affermazione corrente dei libri, semplificata
  (conta la temperatura dell'alta atmosfera, molto più alta di quella al suolo).

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `grafico-energia-cinetica-media-temperatura`,
`grafico-velocita-quadratica-media-temperatura` (elio e azoto), `distribuzione-maxwell-tre-velocita`,
`distribuzione-maxwell-due-temperature` (copiata anche nel formulario). Le due con le curve di Maxwell ci mettono un
paio di minuti a compilare (cento campioni di un esponenziale).

Interattiva `maxwell-velocita-temperatura` (`fisica/MaxwellVelocita.tsx`): risponde a "se la temperatura passa da 150 a
600 K, di quanto aumenta $v_{qm}$? e se cambi il neon con il kripton, che cosa succede all'energia cinetica media?".
Sessanta atomi in una scatola, l'istogramma delle loro velocità (mediato sugli ultimi secondi) e la curva di Maxwell;
cursore della temperatura (150-600 K), scelta tra neon, argon e kripton. Ho scelto tre gas nobili perché sono davvero
atomi singoli, e perché con l'elio la curva a 600 K sarebbe otto volte più bassa di quella del kripton a 150 K e non
starebbero sullo stesso asse. L'asse verticale è fisso, così si vede la curva che si abbassa.

## Esercizio guidato

L'esempio 3 (la velocità dell'azoto). Si fermerebbe: (1) sulla temperatura in kelvin; (2) sulla massa molare in
chilogrammi per mole; (3) sul controllo dell'ordine di grandezza del risultato.

## Esercizi

Generatore `fis-temperatura-microscopica`, sei livelli: L'energia cinetica media; Dai gradi Celsius; La temperatura
dall'energia cinetica media; La velocità quadratica media; Il rapporto tra due velocità; La temperatura dalla velocità.
Nessuna scena: l'argomento non ha una geometria. La distribuzione di Maxwell e l'esempio 6 restano senza esercizio.

Prerequisiti proposti: fis-teoria-cinetica, fis-gas-perfetto, fis-energia-cinetica, fis-temperatura
