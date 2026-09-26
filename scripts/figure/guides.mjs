/**
 * The figures of the subject pages' study notes, one per subject: TikZ compiled
 * to static SVG in public/guide/. Each one pictures an idea the note talks about.
 *
 *   node scripts/figure/guides.mjs
 *
 * The figures sit on a taped sheet that stays light in both themes, so their
 * colours are fixed: the pen's blue-black and the corrector's red.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileFigure } from './compile.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = join(ROOT, 'public/guide');
const SIZES = join(ROOT, 'src/lib/content/guide-figures.ts');

const COLORS = String.raw`\definecolor{ink}{RGB}{38,50,74}\definecolor{pen}{RGB}{196,40,52}\definecolor{soft}{RGB}{120,128,145}\definecolor{fillred}{RGB}{250,222,220}\definecolor{fillblue}{RGB}{222,232,248}`;

const FIGURES = {
	// y = x² − 2x − 3: the roots are an equation of the biennio, the tangent a derivative of the triennio.
	'high_school-math': String.raw`\begin{tikzpicture}[scale=0.62,line cap=round,ink]
\draw[soft!60,very thin,step=1] (-2.4,-4.6) grid (4.4,3.4);
\draw[->] (-2.4,0) -- (4.5,0) node[right] {$x$};
\draw[->] (0,-4.6) -- (0,3.5) node[above] {$y$};
\draw[soft,dashed] (1,-4.6) -- (1,3.2);
\draw[very thick,domain=-1.6:3.6,samples=80] plot (\x,{\x*\x-2*\x-3});
\draw[pen,thick] (2.2,-3.2) -- (3.85,3.4);
\fill[pen] (3,0) circle (3.2pt);
\fill[pen] (-1,0) circle (3.2pt);
\draw[pen,thick] (-1,0) circle (9pt);
\draw[pen,thick] (3,0) circle (9pt);
\fill (1,-4) circle (2.6pt) node[below left] {$V$};
\node[below left] at (-1,0) {$-1$};
\node[below right] at (3.1,-0.05) {$3$};
\node[pen,right] at (3.7,1.6) {$f'(3)=4$};
\node[fill=white,inner sep=2pt] at (-0.9,3.9) {$y=x^2-2x-3$};
\end{tikzpicture}`,

	// Dynamics starts from the forces on the body: weight, normal reaction, friction.
	'high_school-physics': String.raw`\begin{tikzpicture}[scale=0.95,line cap=round,ink]
\fill[fillblue] (0,0) -- (6,0) -- (0,3) -- cycle;
\draw[thick] (0,0) -- (6,0) -- (0,3) -- cycle;
\draw (4.9,0) arc (180:153.4:1.1);
\node at (4.45,0.24) {$\alpha$};
\begin{scope}[shift={(2.6,1.7)},rotate=-26.57]
\draw[thick,fill=white] (-0.55,0) rectangle (0.55,0.8);
\coordinate (c) at (0,0.4);
\end{scope}
\draw[pen,very thick,->] (c) -- ++(0,-1.65) node[below] {$\vec P$};
\draw[pen,very thick,->] (c) -- ++(0.66,1.32) node[above right] {$\vec N$};
\draw[pen,very thick,->] (c) -- ++(-0.98,0.49) node[above left] {$\vec f$};
\end{tikzpicture}`,

	// Almost every problem: balanced reaction, grams to moles, the ratio, back to grams.
	'high_school-chemistry': String.raw`\begin{tikzpicture}[line cap=round,ink,box/.style={draw,thick,rounded corners=3pt,minimum width=1.9cm,minimum height=0.8cm,fill=white}]
\node at (3.1,1.15) {$2\,\mathrm{H_2} + \mathrm{O_2} \longrightarrow 2\,\mathrm{H_2O}$};
\node[box] (a) at (0,0) {grammi};
\node[box] (b) at (0,-1.6) {moli};
\node[box,fill=fillred] (c) at (6.2,-1.6) {moli};
\node[box] (d) at (6.2,0) {grammi};
\draw[->,thick] (a) -- node[left] {$\div M$} (b);
\draw[->,thick,pen] (b) -- node[above] {$\times\frac{2}{1}$} node[below] {\small coefficienti} (c);
\draw[->,thick] (c) -- node[right] {$\times M$} (d);
\end{tikzpicture}`,

	// An algorithm in pieces: input, a decision, two branches that meet again.
	'high_school-computer-science': String.raw`\begin{tikzpicture}[line cap=round,ink,node distance=0.9cm,
term/.style={draw,thick,rounded corners=9pt,minimum width=1.7cm,minimum height=0.65cm,fill=white},
io/.style={draw,thick,trapezium,trapezium left angle=72,trapezium right angle=108,minimum height=0.65cm,fill=white},
op/.style={draw,thick,minimum width=1.8cm,minimum height=0.65cm,fill=white},
dec/.style={draw,thick,diamond,aspect=2.1,inner sep=1pt,fill=fillred}]
\node[term] (s) at (0,0) {Inizio};
\node[op] (i) at (0,-1.2) {leggi $n$};
\node[dec,draw=pen] (d) at (0,-2.7) {$n>0$?};
\node[op] (y) at (-2.3,-4.2) {scrivi positivo};
\node[op] (n) at (2.3,-4.2) {scrivi no};
\node[term] (e) at (0,-5.5) {Fine};
\draw[->,thick] (s) -- (i);
\draw[->,thick] (i) -- (d);
\draw[->,thick] (d) -| node[pos=0.25,above] {s\`\i} (y);
\draw[->,thick] (d) -| node[pos=0.25,above] {no} (n);
\draw[->,thick] (y) |- (e);
\draw[->,thick] (n) |- (e);
\end{tikzpicture}`,

	// Three ways to write the same number: a fraction, a decimal, a percentage.
	'middle_school-math': String.raw`\begin{tikzpicture}[line cap=round,ink]
\foreach \a in {0,90,270} \fill[fillred] (0,0) -- (\a:1.3) arc (\a:\a+90:1.3) -- cycle;
\draw[thick] (0,0) circle (1.3);
\foreach \a in {0,90,180,270} \draw[thick] (0,0) -- (\a:1.3);
\node at (0,-1.85) {$\displaystyle\frac{3}{4}$};
\node at (2.05,0) {$=$};
\node at (3.05,0) {$0{,}75$};
\node at (4.05,0) {$=$};
\begin{scope}[shift={(4.6,-1.25)}]
\fill[fillred] (0,0) rectangle (2.5,1.875);
\draw[soft,very thin,step=0.25] (0,0) grid (2.5,2.5);
\draw[thick] (0,0) rectangle (2.5,2.5);
\node at (1.25,-0.6) {$75\%$};
\end{scope}
\end{tikzpicture}`,

	// The water cycle: one substance changing state, and the sea, the air and the land it passes through.
	'middle_school-science': String.raw`\begin{tikzpicture}[line cap=round,ink,font=\small]
\fill[fillblue] (0,-0.7) rectangle (3.3,0);
\draw[thick] (0,0) .. controls (0.4,0.12) and (0.8,-0.12) .. (1.2,0) .. controls (1.6,0.12) and (2,-0.12) .. (2.4,0) .. controls (2.8,0.12) and (3.05,-0.05) .. (3.3,0);
\draw[thick] (3.3,-0.7) -- (4.6,1.3) -- (5.2,0.6) -- (6.2,-0.7) -- cycle;
\draw[thick] (0,-0.7) -- (3.3,-0.7);
\node at (1.6,-0.38) {mare};
\draw[pen,thick] (0.55,3.1) circle (0.32);
\foreach \a in {0,45,...,315} \draw[pen,thick] (0.55,3.1) ++(\a:0.45) -- ++(\a:0.2);
\node[cloud,draw,thick,fill=white,cloud puffs=10,minimum width=2cm,minimum height=0.95cm] (c) at (4.3,3) {};
\foreach \x in {3.8,4.15,4.5,4.85} \draw[soft,thick] (\x,2.35) -- ++(-0.15,-0.5);
\draw[pen,thick,->] (1.5,0.25) to[bend left=25] node[left=1pt,pos=0.3] {evaporazione} (3.3,2.75);
\node[above=1pt] at (c.north) {condensazione};
\node[right] at (4.95,1.95) {precipitazione};
\draw[pen,thick,->] (4.1,1.0) to[bend left=15] (3.15,0.15);
\end{tikzpicture}`,

	// Orthogonal projections of an L-shaped piece, European method: elevation, side view to the right, plan below.
	'middle_school-technology': String.raw`\begin{tikzpicture}[line cap=round,ink,font=\small,scale=0.8]
\draw[soft,thin,dash dot] (-0.6,-0.6) -- (5.9,-0.6);
\draw[soft,thin,dash dot] (3.5,2.4) -- (3.5,-3.1);
\draw[soft,thin,dash dot] (3.5,-0.6) -- (5.8,-2.9);
\foreach \x in {0,1,3} \draw[soft,thin,dash dot] (\x,0) -- (\x,-1.1);
\foreach \y in {0,2} \draw[soft,thin,dash dot] (3,\y) -- (4,\y);
\draw[soft,thin,dash dot] (3,-1.1) -- (4,-1.1) -- (4,0);
\draw[soft,thin,dash dot] (3,-2.6) -- (5.5,-2.6) -- (5.5,0);
\draw[very thick,fill=fillblue] (0,0) -- (3,0) -- (3,1) -- (1,1) -- (1,2) -- (0,2) -- cycle;
\draw[very thick,fill=fillblue] (4,0) rectangle (5.5,2);
\draw[very thick,fill=fillblue] (0,-1.1) rectangle (3,-2.6);
\draw[pen,very thick] (1,-1.1) -- (1,-2.6);
\node[below,fill=white,inner sep=1.5pt] at (1.5,-0.05) {prospetto};
\node[below,fill=white,inner sep=1.5pt] at (4.75,-0.05) {fianco};
\node[below] at (1.5,-2.6) {pianta};
\end{tikzpicture}`,

	// The definition of limit: ε chosen first around L, δ found after around x₀.
	'university-analisi-1': String.raw`\begin{tikzpicture}[scale=0.9,line cap=round,ink]
\fill[fillred] (-0.3,2.1) rectangle (5.4,3.1);
\fill[fillblue] (2.1,-0.3) rectangle (3.3,3.9);
\draw[->] (-0.3,0) -- (5.6,0) node[right] {$x$};
\draw[->] (0,-0.3) -- (0,4.2) node[above] {$y$};
\draw[very thick,domain=0.3:5.2,samples=80] plot (\x,{0.9+0.02*(\x-2.7)^3+0.75*\x-0.5*sin(\x r)});
\draw[pen,dashed] (0,2.1) -- (5.4,2.1);
\draw[pen,dashed] (0,3.1) -- (5.4,3.1);
\draw[soft,dashed] (0,2.6) -- (2.7,2.6) -- (2.7,0);
\node[left] at (0,2.6) {$L$};
\node[pen,right] at (5.4,3.1) {$L+\varepsilon$};
\node[pen,right] at (5.4,2.1) {$L-\varepsilon$};
\node[below] at (2.7,0) {$x_0$};
\draw[<->,thick] (2.1,-0.55) -- node[below] {$2\delta$} (3.3,-0.55);
\end{tikzpicture}`,

	// A normal domain between y = x² and y = x, sliced along x.
	'university-analisi-2': String.raw`\begin{tikzpicture}[scale=3.4,line cap=round,ink]
\fill[fillred,domain=0:1,samples=60] plot (\x,{\x*\x}) -- (1,1) -- (0,0) -- cycle;
\draw[->] (-0.1,0) -- (1.25,0) node[right] {$x$};
\draw[->] (0,-0.1) -- (0,1.2) node[above] {$y$};
\draw[very thick,domain=0:1,samples=60] plot (\x,{\x*\x});
\draw[very thick] (0,0) -- (1,1);
\draw[pen,very thick] (0.55,0.3025) -- (0.55,0.55);
\draw[pen,dashed] (0.55,0.3025) -- (0.55,0);
\node[below] at (0.55,0) {$x$};
\node[above left] at (0.42,0.42) {$y=x$};
\node[below right] at (0.78,0.6) {$y=x^2$};
\node[pen] at (0.42,0.31) {$D$};
\end{tikzpicture}`,

	// A projectile: the velocity split into a constant horizontal part and a vertical part that changes.
	'university-fisica-1': String.raw`\begin{tikzpicture}[scale=0.85,line cap=round,ink]
\draw[->] (-0.2,0) -- (8,0) node[right] {$x$};
\draw[->] (0,-0.2) -- (0,3.6) node[above] {$y$};
\draw[very thick,domain=0:7.4,samples=80] plot (\x,{1.6*\x-0.2162*\x*\x});
\foreach \t in {0,1.2,2.4,3.7,5,6.2} \fill (\t,{1.6*\t-0.2162*\t*\t}) circle (1.8pt);
\draw[pen,very thick,->] (1.2,1.609) -- ++(1.1,1.19) node[above] {$\vec v$};
\draw[->,thick] (1.2,1.609) -- ++(1.1,0) node[right] {$v_x$};
\draw[->,thick] (1.2,1.609) -- ++(0,1.19) node[left] {$v_y$};
\draw[pen,very thick,->] (5,2.595) -- ++(1.1,-0.62);
\draw[->,thick] (5,2.595) -- ++(1.1,0) node[right] {$v_x$};
\draw[->,thick] (5,2.595) -- ++(0,-0.62) node[below] {$v_y$};
\end{tikzpicture}`,

	// A cycle on the pressure-volume plane: the work is the area inside.
	'university-fisica-2': String.raw`\begin{tikzpicture}[scale=0.95,line cap=round,ink]
\fill[fillred,domain=1:4,samples=60] (1,3.2) -- (4,3.2) -- plot[domain=4:1] (\x,{3.2/\x}) -- cycle;
\draw[->] (-0.2,0) -- (5,0) node[right] {$V$};
\draw[->] (0,-0.2) -- (0,3.8) node[above] {$p$};
\draw[very thick,->] (1,3.2) -- (2.6,3.2);
\draw[very thick] (2.5,3.2) -- (4,3.2);
\draw[very thick,domain=4:1,samples=60] plot (\x,{3.2/\x});
\draw[very thick,->] (4,3.2) -- (4,2.0);
\draw[very thick] (4,2.1) -- (4,0.8);
\fill (1,3.2) circle (2pt) node[above left] {$A$};
\fill (4,3.2) circle (2pt) node[above right] {$B$};
\fill (4,0.8) circle (2pt) node[below right] {$C$};
\node[pen] at (2.4,2.55) {$L$};
\node[soft,rotate=-38] at (1.55,1.45) {\small isoterma};
\end{tikzpicture}`,

	// An AND gate and its truth table: the same function in two representations.
	'university-fondamenti-informatica': String.raw`\begin{tikzpicture}[line cap=round,ink]
\draw[very thick,fill=fillred] (0,0) -- (0.8,0) arc (-90:90:0.7) -- (0,1.4) -- cycle;
\draw[thick] (-0.8,1.05) node[left] {$A$} -- (0,1.05);
\draw[thick] (-0.8,0.35) node[left] {$B$} -- (0,0.35);
\draw[thick] (1.5,0.7) -- (2.3,0.7) node[right] {$A\cdot B$};
\begin{scope}[shift={(4.3,1.8)}]
\foreach \a/\b/\y [count=\i] in {0/0/0,0/1/0,1/0/0,1/1/1} {
\node at (0,-0.5*\i) {$\a$};
\node at (0.7,-0.5*\i) {$\b$};
\node at (1.6,-0.5*\i) {$\y$};
}
\node at (0,0) {$A$};
\node at (0.7,0) {$B$};
\node at (1.6,0) {$A\cdot B$};
\draw[thick] (-0.35,-0.25) -- (2.1,-0.25);
\draw[thick] (1.1,0.25) -- (1.1,-2.25);
\draw[pen,thick] (1.6,-2) circle (0.22);
\end{scope}
\end{tikzpicture}`
};

mkdirSync(OUT, { recursive: true });
const sizes = {};
for (const [name, body] of Object.entries(FIGURES)) {
	const { svg, width, height } = await compileFigure(`${COLORS}\n${body}`, { tikzLibraries: 'shapes.geometric,shapes.symbols' });
	writeFileSync(join(OUT, `${name}.svg`), svg);
	sizes[name] = [width, height];
	console.log(`${name}.svg ${width}×${height}`);
}
// The sizes go to the page, so each <img> reserves its box before the file loads.
writeFileSync(
	SIZES,
	`// Generated by scripts/figure/guides.mjs. Do not edit by hand.\n\n/** Width and height of each figure in public/guide/, in CSS pixels. */\nexport const GUIDE_FIGURES: Record<string, [width: number, height: number]> = {\n${Object.entries(sizes).map(([k, [w, h]]) => `\t'${k}': [${w}, ${h}]`).join(',\n')}\n};\n`
);
