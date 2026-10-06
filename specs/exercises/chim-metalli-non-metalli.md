# Metalli, non metalli e semimetalli

Generatore: `chim-metalli-non-metalli` (`src/lib/exercises/v2/generators/chim-metalli-non-metalli.ts`, con
`src/lib/exercises/v2/chim3-d.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_metalli_non_metalli.py`,
con `_chim3_d.py`. Lezione collegata: `docs/lezioni/chimica/riscritte/61-chim-metalli-non-metalli.md`. Percorso nel
database: `high_school/chemistry/tavola-periodica/chim-metalli-non-metalli`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più. Tutti a scelta multipla con quattro opzioni:
le risposte sono nomi, simboli, ioni e formule.

## Nomi dei livelli

1. Metallo, semimetallo o non metallo
2. Le proprietà delle tre classi
3. Il carattere metallico
4. Le famiglie
5. Lo ione dal gruppo
6. La formula dai due ioni

## Dati

Classe, famiglia, gruppo ed energia di prima ionizzazione da `src/lib/tools/elementi.json`. La classe viene dalla
famiglia del file: semimetalli sono $\mathrm{B}$, $\mathrm{Si}$, $\mathrm{Ge}$, $\mathrm{As}$, $\mathrm{Sb}$,
$\mathrm{Te}$, $\mathrm{Po}$; alogeni e gas nobili sono non metalli.

## Livello 1: metallo, semimetallo o non metallo

Si chiede quale di quattro elementi è un metallo, un semimetallo o un non metallo (un terzo ciascuno): uno della
classe chiesta e tre delle altre due. Diciannove metalli comuni, i sei semimetalli dal boro al tellurio, quattordici
non metalli. Le opzioni sono i nomi.

- "Quale di questi elementi è un semimetallo?" con Silicio, Alluminio, Zolfo, Rame. Risposta Silicio.
- "Quale di questi elementi è un non metallo?" con Mercurio, Bromo, Germanio, Calcio. Risposta Bromo.

## Livello 2: le proprietà delle tre classi

Sedici domande della lezione con la risposta e tre distrattori: malleabile e duttile (scambiati tra loro), mercurio e
bromo (scambiati tra loro), fragilità dei non metalli, elettroni persi o acquistati, energia di ionizzazione,
conduzione al variare della temperatura per metalli e semimetalli, la classe da un gruppo di proprietà, ossidi basici
e acidi, la grafite.

- "Che cosa vuol dire che un metallo è duttile?" Risposta "Si lascia tirare in fili"; distrattore principale "Si
  lascia ridurre in lamine".
- "Un solido è lucente e fragile, e conduce poco la corrente. A quale classe appartiene?" Risposta "Ai semimetalli".

## Livello 3: il carattere metallico

Quattro elementi dello stesso periodo (periodi 2, 3 e 4, gruppi 1, 2 e da 13 a 17) o dello stesso gruppo (1 e 2 dal
secondo al sesto periodo; 14, 15, 16, 17 dal secondo al quinto), metà e metà; si chiede chi ha il carattere metallico
più forte, o più debole. Vincolo: l'energia di prima ionizzazione dei quattro cresce lungo il periodo, o cala lungo il
gruppo, con almeno $20\,\text{kJ/mol}$ tra un elemento e il successivo, così la regola e i dati dicono la stessa cosa.

- "Quale di questi elementi del terzo periodo ha il carattere metallico più forte?" con $\mathrm{Mg}$, $\mathrm{S}$,
  $\mathrm{Na}$, $\mathrm{Si}$. Risposta $\mathrm{Na}$.
- "Quale di questi elementi del gruppo $14$ ha il carattere metallico più debole?" con $\mathrm{C}$, $\mathrm{Si}$,
  $\mathrm{Ge}$, $\mathrm{Sn}$. Risposta $\mathrm{C}$.

## Livello 4: le famiglie

Tre casi. "Famiglia" (circa 42%): la famiglia di un elemento, tra metalli alcalini, alcalino-terrosi, di transizione,
alogeni, gas nobili. "Elemento" (circa 42%): quale di quattro elementi appartiene a una famiglia; gli altri tre sono
di altre famiglie o di nessuna, e tra questi c'è l'idrogeno, che non è un metallo alcalino. "Configurazione" (circa
16%): la configurazione esterna di una famiglia, tra $ns^1$, $ns^2$, $ns^2\,np^5$, $ns^2\,np^6$.

- "A quale famiglia appartiene il potassio?" Risposta "Metalli alcalini".
- "Quale di questi elementi è un alogeno?" con Zolfo, Iodio, Argon, Idrogeno. Risposta Iodio.

## Livello 5: lo ione dal gruppo

Un elemento dei gruppi 1 ($\mathrm{Li}$-$\mathrm{Cs}$), 2 ($\mathrm{Mg}$-$\mathrm{Ba}$), 13 (alluminio), 16 (ossigeno,
zolfo) o 17 ($\mathrm{F}$-$\mathrm{I}$), presentato con la famiglia o con il gruppo; si chiede lo ione che forma.
Distrattori: il segno rovesciato, una carica in più o in meno.

- "Lo stronzio è un metallo alcalino-terroso. Quale ione forma di solito?" Risposta $\mathrm{Sr^{2+}}$; distrattori
  $\mathrm{Sr^{2-}}$, $\mathrm{Sr^+}$, $\mathrm{Sr^{3+}}$.
- "Lo zolfo è un non metallo del gruppo $16$. Quale ione forma di solito?" Risposta $\mathrm{S^{2-}}$; distrattori
  $\mathrm{S^{2+}}$, $\mathrm{S^-}$, $\mathrm{S^+}$.

## Livello 6: la formula dai due ioni

Un metallo dei gruppi 1, 2 o 13 e un non metallo dei gruppi 16 o 17, gli stessi del livello 5; si chiede la formula
del composto, con il metallo a sinistra e gli indici più piccoli. Distrattori: gli indici scambiati, le cariche
scritte come indici senza semplificare ($\mathrm{Mg_2O_2}$), uno a uno, altri indici piccoli.

- "Che formula ha il composto tra lo stronzio e il bromo?" Risposta $\mathrm{SrBr_2}$; distrattori $\mathrm{Sr_2Br}$,
  $\mathrm{SrBr}$, $\mathrm{Sr_2Br_3}$.
- "Che formula ha il composto tra l'alluminio e l'ossigeno?" Risposta $\mathrm{Al_2O_3}$; distrattori
  $\mathrm{Al_3O_2}$, $\mathrm{AlO}$, $\mathrm{Al_2O}$.

## Esercizi da evitare

- Polonio e astato nel livello 1: i libri non li classificano tutti allo stesso modo.
- Confronti di carattere metallico tra magnesio e alluminio, o tra stagno e piombo, dove l'energia di ionizzazione va
  al contrario della regola.
- Ioni dei metalli di transizione, che hanno cariche diverse: sono della nomenclatura.
- I nomi dei composti: il livello 6 chiede solo la formula.

## Verifica

`chim_metalli_non_metalli.py` ricava la classe dalla famiglia della tavola, la famiglia dal gruppo (1 senza idrogeno,
2, da 3 a 12, 17, 18), la carica dello ione dal gruppo e la formula dalle due cariche con il massimo comune divisore;
ha la chiave del livello 2 scritta dalla lezione; per il carattere metallico controlla la regola sui dati
dell'energia di ionizzazione.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 178 px su 252).

### Errori piantati

Come per `proprieta-periodiche`, 60 esercizi per livello: bocciati tutti.
