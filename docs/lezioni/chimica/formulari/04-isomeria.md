# Formulario: Isomeria

## Isomeri

Gli isomeri sono composti diversi con la stessa formula bruta. Per riconoscerli: prima si contano gli atomi (formule diverse, non isomeri), poi si controlla che non sia la stessa molecola disegnata in un altro modo.

| Famiglia | Tipo | Che cosa cambia | Esempio |
|---|---|---|---|
| Isomeria di struttura (atomi legati in ordine diverso) | di catena | lo scheletro di carbonio | pentano e 2-metilbutano |
| | di posizione | la posizione di un gruppo o di un doppio legame | propan-1-olo e propan-2-olo |
| | di gruppo funzionale | il gruppo funzionale | etanolo e dimetiletere |
| Stereoisomeria (stessi legami, disposizione diversa nello spazio) | geometrica | la disposizione attorno a un doppio legame o a un anello | cis- e trans-but-2-ene |
| | ottica | la disposizione attorno a un carbonio chirale | (R)- e (S)-acido lattico |

Le conformazioni, cioè le posizioni che una molecola prende ruotando attorno ai legami semplici, non sono isomeri.

## Isomeria geometrica

Il doppio legame e l'anello bloccano la rotazione. Cis: i due gruppi dalla stessa parte; trans: da parti opposte.

Condizione: ognuno dei due carboni del doppio legame deve avere due gruppi diversi. Il but-1-ene ($\mathrm{CH_2{=}CH{-}CH_2CH_3}$) non ha isomeri geometrici.

## Regole di priorità (CIP)

1. Vince l'atomo legato direttamente con il numero atomico più grande: $\mathrm{Br} > \mathrm{Cl} > \mathrm{O} > \mathrm{N} > \mathrm{C} > \mathrm{H}$.
2. A parità, si confrontano i tre atomi attaccati, in ordine decrescente, fino alla prima differenza: $\mathrm{-CH_2OH}\ (\mathrm{O,H,H}) > \mathrm{-CH(CH_3)_2}\ (\mathrm{C,C,H})$.
3. Un doppio legame conta l'atomo all'altra estremità due volte: $\mathrm{-COOH}$ vale $(\mathrm{O,O,O})$.

## E e Z

Su ogni carbonio del doppio legame si prende il gruppo con la priorità più alta.

- Z (zusammen): i due gruppi con la priorità più alta dalla stessa parte.
- E (entgegen): da parti opposte.

## Carbonio chirale ed enantiomeri

Un carbonio chirale è legato a quattro gruppi tutti diversi (i gruppi interi, non solo il primo atomo). Non lo sono mai i $\mathrm{CH_3}$, i $\mathrm{CH_2}$ e i carboni con un doppio legame.

Gli enantiomeri sono immagini speculari non sovrapponibili. Con $n$ carboni chirali gli stereoisomeri sono al massimo $2^n$.

## Configurazione R e S

1. Metti in ordine di priorità i quattro gruppi, da 1 a 4.
2. Guarda la molecola con il gruppo 4 lontano da te.
3. 1 → 2 → 3 in senso orario: R; in senso antiorario: S.
4. Se il gruppo 4 viene verso di te (cuneo pieno, o H sottinteso quando un altro gruppo è sul cuneo tratteggiato), inverti.

```molecole
% nome: isomeria-formulario-acido-lattico
% alt: I due enantiomeri dell'acido lattico: a sinistra il (R), con il CH3 su un cuneo pieno, a destra il (S), con il CH3 su un cuneo tratteggiato; nei due disegni COOH è a sinistra e OH in basso a destra
% svg: isomeria-formulario-acido-lattico-40668944.svg 362x108
colonne: 2
stereo: si
C[C@@H](O)C(=O)O | (R)-acido lattico
C[C@H](O)C(=O)O | (S)-acido lattico
```

Acido lattico: $\mathrm{OH} > \mathrm{COOH} > \mathrm{CH_3} > \mathrm{H}$.

## Luce polarizzata

Due enantiomeri ruotano il piano della luce polarizzata dello stesso angolo in versi opposti: destrogiro (+), levogiro (−). La miscela racemica (50 e 50) non lo ruota. Per il resto hanno le stesse proprietà fisiche.

```ad-warning
Cis non vuol dire sempre Z
Il (Z)-2-clorobut-2-ene ha i due $\mathrm{CH_3}$ da parti opposte: decide il $\mathrm{Cl}$, che ha la priorità più alta.
```

```ad-warning
Priorità per massa
Si decide al primo atomo diverso, non per grandezza: $\mathrm{-OH}$ viene prima di $\mathrm{-CH_2CH_2CH_3}$.
```

```ad-warning
R e S non sono (+) e (−)
R e S vengono dal disegno, (+) e (−) dal polarimetro: l'(R)-carvone è levogiro.
```
