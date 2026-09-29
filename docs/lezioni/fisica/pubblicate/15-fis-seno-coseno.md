# Seno e coseno per scomporre un vettore

Chi tira una slitta con una corda inclinata la fa andare avanti, ma in parte la solleva anche. Per capire quanto della forza serve a una cosa e quanto all'altra si scompone il vettore in due vettori perpendicolari, uno orizzontale e uno verticale: le sue componenti. Nella lezione [Somma e differenza di vettori](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/somma-e-differenza-di-vettori) le componenti si contavano sui quadretti; qui si calcolano dal modulo e dall'angolo, con il seno e il coseno. Le definizioni di seno, coseno e tangente sono nella lezione di matematica [Seno, coseno e tangente nel triangolo rettangolo](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/seno-coseno-e-tangente-nel-triangolo-rettangolo).

## Il vettore negli assi cartesiani

Si mette l'origine del vettore $\vec{v}$ nell'origine di un [piano cartesiano](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio). La direzione e il verso si danno con un solo numero, l'angolo $\alpha$ che il vettore forma con il semiasse positivo delle $x$, misurato in senso antiorario, da $0^\circ$ a $360^\circ$.

Dalla punta di $\vec{v}$ si tracciano le perpendicolari ai due assi. Si ottengono due vettori, uno sull'asse $x$ e uno sull'asse $y$, che sono i lati di un rettangolo di cui $\vec{v}$ è la diagonale: per la regola del parallelogramma la loro somma è proprio $\vec{v}$. Si chiamano **vettori componenti** di $\vec{v}$, e si scrive

$$\vec{v} = \vec{v}_x + \vec{v}_y$$

Le **componenti** di $\vec{v}$ sono i due numeri $v_x$ e $v_y$ che dicono quanto sono lunghi i vettori componenti, con il segno più se vanno nel verso positivo dell'asse e con il segno meno se vanno nel verso negativo.

```tikz
% nome: componenti-vettore-seno-coseno
% alt: Un vettore v nel primo quadrante che forma l'angolo alfa con il semiasse positivo delle x; dalla punta scendono le proiezioni tratteggiate sugli assi, e i vettori componenti tratteggiati vanno dall'origine lungo l'asse x, lungo v per coseno di alfa, e lungo l'asse y, lungo v per seno di alfa
% svg: componenti-vettore-seno-coseno-cdfe07f6.svg 216x123
\begin{tikzpicture}
\draw[->] (-0.3,0) -- (3.3,0) node[right] {$x$};
\draw[->] (0,-0.3) -- (0,2.3) node[above] {$y$};
\draw[dashed, thin] (2.457,1.721) -- (2.457,0);
\draw[dashed, thin] (2.457,1.721) -- (0,1.721);
\draw[-{Stealth}, thick, blue, dashed] (0,0) -- (2.457,0);
\draw[-{Stealth}, thick, blue, dashed] (0,0) -- (0,1.721);
\draw[-{Stealth}, thick, blue] (0,0) -- (2.457,1.721) node[above right] {$\vec{v}$};
\draw (0.6,0) arc[start angle=0, end angle=35, radius=0.6];
\node at (0.85,0.25) {\small $\alpha$};
\node[below] at (1.23,0) {\small $v_x = v\cos\alpha$};
\node[left] at (0,0.86) {\small $v_y = v\sin\alpha$};
\draw (2.257,0) -- (2.257,0.2) -- (2.457,0.2);
\end{tikzpicture}
```

## Dal vettore alle componenti

Nella figura il vettore $\vec{v}$, la sua proiezione sull'asse $x$ e il tratto verticale tratteggiato formano un triangolo rettangolo. L'ipotenusa è lunga $v$, il cateto adiacente all'angolo $\alpha$ è $v_x$, il cateto opposto è lungo quanto $v_y$. Dalle definizioni di coseno e seno, $\cos\alpha = \dfrac{v_x}{v}$ e $\sin\alpha = \dfrac{v_y}{v}$, quindi

$$
\begin{gathered}
v_x = v\cos\alpha \\
v_y = v\sin\alpha
\end{gathered}
$$

Il coseno va con la componente $x$, che sta sul lato dell'angolo; il seno con la componente $y$, che sta di fronte all'angolo. I valori del seno e del coseno si leggono sulla calcolatrice, e i risultati si arrotondano con le cifre significative dei dati, come insegna la lezione [Le cifre significative](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/le-cifre-significative).

```ad-example
Esempio 1: una forza a 30°
Una forza di $50\,\text{N}$ forma un angolo di $30^\circ$ con l'asse $x$. Trova le componenti.

$$
\begin{gathered}
F_x = 50 \cdot \cos 30^\circ = 43{,}30\ldots \approx 43\,\text{N} \\
F_y = 50 \cdot \sin 30^\circ = 25\,\text{N}
\end{gathered}
$$

Il modulo ha due cifre significative, e così i risultati. Controllo con il teorema di Pitagora: $\sqrt{43{,}30^2 + 25^2} = 50$, perché le componenti sono i cateti di un triangolo rettangolo con l'ipotenusa $F$.
```

```ad-example
Esempio 2: uno spostamento a 35°
Un escursionista si sposta di $245\,\text{m}$ in una direzione che forma $35^\circ$ con l'asse $x$, orientato verso est. Di quanto si è spostato verso est e di quanto verso nord?

$$
\begin{gathered}
s_x = 245 \cdot \cos 35^\circ = 200{,}69\ldots \approx 201\,\text{m} \\
s_y = 245 \cdot \sin 35^\circ = 140{,}52\ldots \approx 141\,\text{m}
\end{gathered}
$$

Si è spostato di circa $201\,\text{m}$ verso est e di $141\,\text{m}$ verso nord. La somma $201 + 141 = 342\,\text{m}$ è più di $245\,\text{m}$: le componenti non si sommano come numeri per ritrovare il modulo, si usa Pitagora.
```

```ad-warning
La calcolatrice in radianti
Se la calcolatrice è impostata in radianti, $\cos 30$ dà $0{,}154$ e non $0{,}866$, e nell'esempio 1 si troverebbe $F_x \approx 7{,}7\,\text{N}$. Prima di cominciare controlla che sul display ci sia $D$ o $\text{DEG}$: un controllo veloce è $\sin 30 = 0{,}5$.
```

```ad-warning
Seno e coseno scambiati
$v_x = v\cos\alpha$ vale solo se $\alpha$ è l'angolo con l'asse $x$. Non c'è una regola "orizzontale uguale coseno": il coseno va con il cateto adiacente all'angolo che conosci. Se l'angolo è dato rispetto a un'altra retta, per esempio la verticale, i ruoli si scambiano, come nell'esempio 3.
```

```ad-example
Esempio 3: l'angolo con la verticale
Una corda tira un gancio con una forza di $60\,\text{N}$, in una direzione che forma $20^\circ$ con la verticale, verso l'alto e verso destra. Trova la componente orizzontale e quella verticale.

```tikz
% nome: componenti-angolo-verticale
% alt: Una forza F applicata a un punto, inclinata di 20 gradi rispetto alla verticale tratteggiata, verso l'alto e verso destra; la componente orizzontale è opposta all'angolo di 20 gradi, la componente verticale gli è adiacente
% svg: componenti-angolo-verticale-ced19f5c.svg 89x136
\begin{tikzpicture}
\draw[dashed, thin] (0,0) -- (0,2.8);
\draw[dashed, thin] (0.889,2.443) -- (0.889,0);
\draw[dashed, thin] (0.889,2.443) -- (0,2.443);
\draw[-{Stealth}, thick, red, dashed] (0,0) -- (0.889,0);
\node[below] at (0.45,0) {\small $F_x$};
\draw[-{Stealth}, thick, red, dashed] (0,0) -- (0,2.443);
\node[left] at (0,0.6) {\small $F_y$};
\draw[-{Stealth}, thick, red] (0,0) -- (0.889,2.443) node[above right] {$\vec{F}$};
\draw (0,0.9) arc[start angle=90, end angle=70, radius=0.9];
\draw[thin] (-0.3,1.4) -- (0.12,0.93);
\node[above left] at (-0.2,1.35) {\scriptsize $20^\circ$};
\fill (0,0) circle (1.5pt);
\end{tikzpicture}
```

L'angolo di $20^\circ$ ha per lato la verticale, quindi il cateto adiacente è la componente verticale e quello opposto è la componente orizzontale:

$$
\begin{gathered}
F_x = 60 \cdot \sin 20^\circ = 20{,}52\ldots \approx 21\,\text{N} \\
F_y = 60 \cdot \cos 20^\circ = 56{,}38\ldots \approx 56\,\text{N}
\end{gathered}
$$

Si arriva allo stesso risultato con l'angolo che la forza forma con l'asse $x$, $90^\circ - 20^\circ = 70^\circ$: $F_x = 60 \cdot \cos 70^\circ$ e $F_y = 60 \cdot \sin 70^\circ$ danno gli stessi numeri, perché il seno di un angolo è il coseno del suo complementare.
```

## I segni delle componenti

Quando il vettore va verso sinistra la componente $x$ è negativa, quando va verso il basso è negativa la componente $y$. Il segno dipende dal quadrante in cui cade la punta del vettore:

| Quadrante | $\alpha$ | $v_x$ | $v_y$ |
|---|---|---|---|
| primo | tra $0^\circ$ e $90^\circ$ | $+$ | $+$ |
| secondo | tra $90^\circ$ e $180^\circ$ | $-$ | $+$ |
| terzo | tra $180^\circ$ e $270^\circ$ | $-$ | $-$ |
| quarto | tra $270^\circ$ e $360^\circ$ | $+$ | $-$ |

Con l'angolo misurato dal semiasse positivo delle $x$ in senso antiorario, le formule $v_x = v\cos\alpha$ e $v_y = v\sin\alpha$ valgono in tutti i quadranti, e la calcolatrice dà da sola il segno giusto: $\cos 150^\circ$ è negativo. Il seno e il coseno di angoli maggiori di $90^\circ$ si studiano nella lezione [Funzioni goniometriche](/materiale/scuola-superiore/matematica/goniometria/funzioni-goniometriche); per le componenti basta la calcolatrice.

```ad-example
Esempio 4: un vettore nel secondo quadrante
Lo spostamento $\vec{s}$ ha modulo $8{,}0\,\text{m}$ e forma un angolo di $150^\circ$ con il semiasse positivo delle $x$. Trova le componenti.

```tikz
% nome: componenti-secondo-quadrante
% alt: Un vettore s nel secondo quadrante che forma un angolo di 150 gradi con il semiasse positivo delle x, segnato da un arco; la componente x tratteggiata va verso sinistra ed è negativa, la componente y va verso l'alto ed è positiva
% svg: componenti-secondo-quadrante-0256701a.svg 171x110
\begin{tikzpicture}
\draw[->] (-3,0) -- (1,0) node[right] {$x$};
\draw[->] (0,-0.3) -- (0,1.9) node[above] {$y$};
\draw[dashed, thin] (-2.425,1.4) -- (-2.425,0);
\draw[dashed, thin] (-2.425,1.4) -- (0,1.4);
\draw[-{Stealth}, thick, blue, dashed] (0,0) -- (-2.425,0);
\draw[-{Stealth}, thick, blue, dashed] (0,0) -- (0,1.4);
\draw[-{Stealth}, thick, blue] (0,0) -- (-2.425,1.4) node[above left] {$\vec{s}$};
\draw (0.4,0) arc[start angle=0, end angle=150, radius=0.4];
\node at (-0.42,0.68) {\scriptsize $150^\circ$};
\node[below] at (-1.21,0) {\small $s_x < 0$};
\node[right] at (0,0.95) {\small $s_y > 0$};
\end{tikzpicture}
```

$$
\begin{gathered}
s_x = 8{,}0 \cdot \cos 150^\circ = -6{,}928\ldots \approx -6{,}9\,\text{m} \\
s_y = 8{,}0 \cdot \sin 150^\circ = 4{,}0\,\text{m}
\end{gathered}
$$

Il vettore va a sinistra e in alto, e i segni lo confermano. Senza la calcolatrice si arriva allo stesso punto con l'angolo acuto che il vettore forma con l'asse $x$, $180^\circ - 150^\circ = 30^\circ$: le componenti sono lunghe $8{,}0 \cdot \cos 30^\circ$ e $8{,}0 \cdot \sin 30^\circ$, e il segno si mette guardando il disegno.
```

Trascina la punta del vettore in tutti e quattro i quadranti e guarda come cambiano i segni delle componenti.

```interattivo
% nome: componenti-vettore-quadranti
% alt: Negli assi cartesiani con la griglia la punta del vettore v si trascina sugli incroci; le componenti tratteggiate seguono, l'arco segna l'angolo alfa dal semiasse positivo delle x; sotto sono scritti il modulo, l'angolo e le componenti con il loro segno, calcolate con il coseno e il seno, e il quadrante
```

```ad-warning
Il segno dimenticato
Una componente negativa non è un errore di calcolo: dice che il vettore componente va nel verso negativo dell'asse. Se lavori con l'angolo acuto, come alla fine dell'esempio 4, la calcolatrice dà sempre numeri positivi, e il segno lo devi mettere tu, guardando in quale quadrante sta la punta.
```

## Dalle componenti al vettore

Il percorso inverso: dalle componenti $v_x$ e $v_y$ si ritrovano il modulo e l'angolo. Il modulo è l'ipotenusa del triangolo rettangolo che ha per cateti le componenti, e l'angolo si trova con la tangente, che è il rapporto tra il cateto opposto e quello adiacente:

$$
\begin{gathered}
v = \sqrt{v_x^2 + v_y^2} \\
\tan\alpha = \frac{v_y}{v_x}
\end{gathered}
$$

Per trovare $\alpha$ si usa la funzione inversa $\tan^{-1}$ della calcolatrice, come nella lezione di matematica.

```ad-example
Esempio 5: modulo e angolo nel primo quadrante
Una forza ha le componenti $F_x = 12\,\text{N}$ e $F_y = 5{,}0\,\text{N}$. Trova il modulo e l'angolo con l'asse $x$.

$$
\begin{gathered}
F = \sqrt{12^2 + 5{,}0^2} = \sqrt{169} = 13\,\text{N} \\
\alpha = \tan^{-1}\frac{5{,}0}{12} = 22{,}6\ldots^\circ \approx 23^\circ
\end{gathered}
$$

Controllo: $13 \cdot \cos 23^\circ \approx 12$ e $13 \cdot \sin 23^\circ \approx 5{,}1$. La piccola differenza da $5{,}0$ viene dall'angolo arrotondato: con $22{,}6^\circ$ si ritrova $5{,}0$.
```

La calcolatrice dà l'angolo di $\tan^{-1}$ sempre tra $-90^\circ$ e $90^\circ$, cioè nel primo o nel quarto quadrante. Se la componente $x$ è negativa il vettore sta nel secondo o nel terzo quadrante, e all'angolo della calcolatrice si aggiunge $180^\circ$. Se è negativa solo la componente $y$, il vettore sta nel quarto quadrante e si aggiunge $360^\circ$ per avere un angolo tra $0^\circ$ e $360^\circ$.

```ad-example
Esempio 6: modulo e angolo nel secondo quadrante
Uno spostamento ha le componenti $s_x = -3{,}0\,\text{m}$ e $s_y = 4{,}0\,\text{m}$. Trova il modulo e l'angolo con il semiasse positivo delle $x$.

Il modulo è $s = \sqrt{(-3{,}0)^2 + 4{,}0^2} = \sqrt{25} = 5{,}0\,\text{m}$. Per l'angolo la calcolatrice dà

$$\tan^{-1}\frac{4{,}0}{-3{,}0} = -53{,}1\ldots^\circ$$

un angolo del quarto quadrante. Ma il vettore va a sinistra e in alto, quindi sta nel secondo quadrante: l'angolo giusto è $-53{,}1^\circ + 180^\circ = 126{,}9^\circ \approx 127^\circ$.
```

```ad-warning
L'angolo della calcolatrice non sempre è quello giusto
Il vettore con $s_x = -3{,}0\,\text{m}$ e $s_y = 4{,}0\,\text{m}$ e quello con $s_x = 3{,}0\,\text{m}$ e $s_y = -4{,}0\,\text{m}$ hanno lo stesso rapporto $\frac{v_y}{v_x}$, e la calcolatrice dà per tutti e due $-53^\circ$. Prima di scrivere l'angolo, guarda i segni delle componenti e disegna il vettore.
```

## La somma per componenti

Con le componenti la somma di vettori diventa una somma di numeri. Per sommare due o più vettori dati con il modulo e l'angolo:

1. trova le componenti di ogni vettore, con il loro segno;
2. somma tra loro tutte le componenti $x$, e poi tutte le componenti $y$: sono le componenti della risultante, $R_x$ e $R_y$;
3. trova il modulo della risultante con il teorema di Pitagora, $R = \sqrt{R_x^2 + R_y^2}$;
4. trova l'angolo con $\tan^{-1}\dfrac{R_y}{R_x}$, correggendolo se $R_x$ è negativa.

Nei passaggi intermedi conviene tenere una cifra in più, e arrotondare solo il risultato.

```ad-example
Esempio 7: due forze a 60°
Su un punto agiscono due forze: $\vec{F}_1$ di $50\,\text{N}$ lungo l'asse $x$, e $\vec{F}_2$ di $30\,\text{N}$ a $60^\circ$ dall'asse $x$. Trova la risultante.

```tikz
% nome: somma-per-componenti-forze
% alt: La forza F1 di 50 newton lungo l'asse x e la forza F2 di 30 newton inclinata di 60 gradi, disegnata con l'origine sulla punta di F1; la risultante R, in arancione, va dall'origine di F1 alla punta di F2
% svg: somma-per-componenti-forze-4fa9b413.svg 175x77
\begin{tikzpicture}
\draw[->] (-0.3,0) -- (3.8,0) node[right] {$x$};
\draw[-{Stealth}, thick, red] (0,0) -- (2.5,0) node[midway, below] {$\vec{F}_1$};
\draw[-{Stealth}, thick, red] (2.5,0) -- (3.25,1.299) node[midway, right] {$\vec{F}_2$};
\draw[-{Stealth}, thick, orange!90!black] (0,0) -- (3.25,1.299) node[midway, above left] {$\vec{R}$};
\draw (2.9,0) arc[start angle=0, end angle=60, radius=0.4];
\node at (3.12,0.3) {\scriptsize $60^\circ$};
\fill (0,0) circle (1.5pt);
\end{tikzpicture}
```

Le componenti delle due forze:

$$
\begin{gathered}
F_{1x} = 50\,\text{N} \qquad F_{1y} = 0 \\
F_{2x} = 30 \cdot \cos 60^\circ = 15\,\text{N} \\
F_{2y} = 30 \cdot \sin 60^\circ = 25{,}98\ldots\,\text{N}
\end{gathered}
$$

Le componenti della risultante sono le somme:

$$
\begin{gathered}
R_x = 50 + 15 = 65\,\text{N} \\
R_y = 0 + 25{,}98 = 25{,}98\,\text{N}
\end{gathered}
$$

Poi il modulo e l'angolo:

$$
\begin{gathered}
R = \sqrt{65^2 + 25{,}98^2} = 70{,}0\ldots \approx 70\,\text{N} \\
\alpha = \tan^{-1}\frac{25{,}98}{65} = 21{,}8\ldots^\circ \approx 22^\circ
\end{gathered}
$$

La risultante vale $70\,\text{N}$ e forma un angolo di circa $22^\circ$ con l'asse $x$. Non vale $50 + 30 = 80\,\text{N}$, perché le due forze non hanno la stessa direzione.
```

```ad-warning
Sommare i moduli, o sommare le componenti a caso
I moduli di vettori con direzioni diverse non si sommano: si sommano le componenti $x$ con le componenti $x$ e le componenti $y$ con le componenti $y$, ciascuna con il suo segno. E il modulo della risultante non è $R_x + R_y$, ma $\sqrt{R_x^2 + R_y^2}$.
```

Le componenti servono soprattutto con le forze: per esempio, per un corpo su un piano inclinato si scompone il peso lungo il piano e perpendicolarmente al piano, come nella lezione [L'equilibrio sul piano inclinato](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-sul-piano-inclinato).
