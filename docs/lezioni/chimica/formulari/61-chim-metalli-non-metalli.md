# Formulario: Metalli, non metalli e semimetalli

## Le tre classi nella tavola

```tikz
% nome: metalli-tavola-tre-classi
% alt: La tavola periodica dei primi sei periodi, con i gruppi da 1 a 18, e ogni casella colorata secondo la classe dell'elemento. I metalli occupano tutta la parte sinistra e centrale e scendono verso destra in basso, fino a bismuto. I non metalli stanno in alto a destra: idrogeno, carbonio, azoto, ossigeno, fosforo, zolfo, selenio, gli alogeni e i gas nobili. Tra i due, lungo una linea spessa a scala che scende dal boro al polonio, stanno i semimetalli: boro, silicio, germanio, arsenico, antimonio, tellurio e polonio. Una casella con l'asterisco nel sesto periodo indica i lantanidi
% svg: metalli-tavola-tre-classi-2dfbb7b3.svg 360x177
\begin{tikzpicture}[x=0.5cm, y=0.6cm]
\foreach \g in {1,...,18} \node at (\g,-0.25) {\tiny \g};
\foreach \p in {1,...,6} \node at (0.1,-\p) {\tiny \p};
\foreach \g/\p/\s in {1/2/Li, 2/2/Be, 1/3/Na, 2/3/Mg, 13/3/Al, 1/4/K, 2/4/Ca, 3/4/Sc, 4/4/Ti, 5/4/V, 6/4/Cr, 7/4/Mn, 8/4/Fe, 9/4/Co, 10/4/Ni, 11/4/Cu, 12/4/Zn, 13/4/Ga, 1/5/Rb, 2/5/Sr, 3/5/Y, 4/5/Zr, 5/5/Nb, 6/5/Mo, 7/5/Tc, 8/5/Ru, 9/5/Rh, 10/5/Pd, 11/5/Ag, 12/5/Cd, 13/5/In, 14/5/Sn, 1/6/Cs, 2/6/Ba, 4/6/Hf, 5/6/Ta, 6/6/W, 7/6/Re, 8/6/Os, 9/6/Ir, 10/6/Pt, 11/6/Au, 12/6/Hg, 13/6/Tl, 14/6/Pb, 15/6/Bi} {
\draw[thin, fill=blue!12] (\g-0.5,-\p-0.5) rectangle (\g+0.5,-\p+0.5);
\node at (\g,-\p) {\scriptsize \s};
}
\foreach \g/\p/\s in {13/2/B, 14/3/Si, 14/4/Ge, 15/4/As, 15/5/Sb, 16/5/Te, 16/6/Po} {
\draw[thin, fill=orange!50] (\g-0.5,-\p-0.5) rectangle (\g+0.5,-\p+0.5);
\node at (\g,-\p) {\scriptsize \s};
}
\foreach \g/\p/\s in {1/1/H, 18/1/He, 14/2/C, 15/2/N, 16/2/O, 17/2/F, 18/2/Ne, 15/3/P, 16/3/S, 17/3/Cl, 18/3/Ar, 16/4/Se, 17/4/Br, 18/4/Kr, 17/5/I, 18/5/Xe, 17/6/At, 18/6/Rn} {
\draw[thin, fill=green!25] (\g-0.5,-\p-0.5) rectangle (\g+0.5,-\p+0.5);
\node at (\g,-\p) {\scriptsize \s};
}
\draw[thin, fill=blue!12] (2.5,-6.5) rectangle (3.5,-5.5);
\node at (3,-6) {\scriptsize $*$};
\draw[very thick] (12.5,-1.5) -- (12.5,-2.5) -- (13.5,-2.5) -- (13.5,-4.5) -- (14.5,-4.5) -- (14.5,-5.5) -- (15.5,-5.5) -- (15.5,-6.5);
\draw[thin, fill=blue!12] (1.5,-7.6) rectangle (2.5,-7);
\node[right] at (2.6,-7.3) {\scriptsize metalli};
\draw[thin, fill=orange!50] (6.5,-7.6) rectangle (7.5,-7);
\node[right] at (7.6,-7.3) {\scriptsize semimetalli};
\draw[thin, fill=green!25] (12.5,-7.6) rectangle (13.5,-7);
\node[right] at (13.6,-7.3) {\scriptsize non metalli};
\end{tikzpicture}
```

- Metalli: a sinistra e al centro; $91$ elementi su $118$.
- Non metalli: in alto a destra, più l'idrogeno; $20$ elementi.
- Semimetalli: lungo il confine a scala. Sono $\mathrm{B}$, $\mathrm{Si}$, $\mathrm{Ge}$, $\mathrm{As}$, $\mathrm{Sb}$, $\mathrm{Te}$, $\mathrm{Po}$.

## Le proprietà a confronto

| | Metalli | Semimetalli | Non metalli |
|---|---|---|---|
| Aspetto | lucenti | lucenti | opachi |
| Corrente elettrica | la conducono bene | la conducono poco | non la conducono |
| Sotto un colpo | si deformano | si rompono | si rompono (se solidi) |
| Stato a $25\,^\circ\text{C}$ | solidi (tranne $\mathrm{Hg}$) | solidi | gas, solidi, un liquido ($\mathrm{Br_2}$) |
| Energia di ionizzazione | bassa | intermedia | alta |
| Elettronegatività | bassa | intermedia | alta |
| Nelle reazioni | perdono elettroni | dipende dal partner | acquistano o condividono elettroni |

- Malleabile: si riduce in lamine. Duttile: si tira in fili.
- Scaldando: un metallo conduce peggio, un semimetallo (semiconduttore) conduce meglio.
- Ossidi: basici quelli dei metalli, acidi quelli dei non metalli.

## Carattere metallico

Tendenza a perdere elettroni e a formare ioni positivi.

- Lungo un periodo, verso destra: diminuisce.
- Lungo un gruppo, verso il basso: aumenta.
- Massimo in basso a sinistra (cesio, francio), minimo in alto a destra.

Terzo periodo: $\mathrm{Na}$, $\mathrm{Mg}$, $\mathrm{Al}$ metalli; $\mathrm{Si}$ semimetallo; $\mathrm{P}$, $\mathrm{S}$, $\mathrm{Cl}$ non metalli.

## Le famiglie

| Famiglia | Gruppo | Configurazione esterna | Ioni | Da ricordare |
|---|---|---|---|---|
| Metalli alcalini | $1$ (senza $\mathrm{H}$) | $ns^1$ | $1+$ | teneri, poco densi; con l'acqua danno idrossido e idrogeno; più reattivi scendendo |
| Metalli alcalino-terrosi | $2$ | $ns^2$ | $2+$ | più duri e meno reattivi degli alcalini |
| Metalli di transizione | da $3$ a $12$ | blocco $d$ | cariche diverse | duri, densi; composti colorati |
| Alogeni | $17$ | $ns^2\,np^5$ | $1-$ | molecole biatomiche; meno reattivi scendendo |
| Gas nobili | $18$ | $ns^2\,np^6$ ($1s^2$ l'elio) | nessuno | atomi singoli, non reagiscono |

```ad-warning
L'idrogeno
Sta nel gruppo $1$ ma è un non metallo, non un metallo alcalino.
```

```ad-warning
Il verso del carattere metallico
Cresce verso il basso e verso sinistra: al contrario di energia di ionizzazione ed elettronegatività.
```

```ad-warning
Lucente non vuol dire metallo
Anche il silicio è lucente: un metallo conduce bene e si deforma senza rompersi.
```
