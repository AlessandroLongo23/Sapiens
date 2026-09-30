"""Clip 3: the sign of the discriminant (piano.md, clip 3). Three columns built one at a time."""

from manim import DOWN, LEFT, RIGHT, UP, Axes, Create, Dot, FadeIn, MathTex, VGroup, Write

from sapiens import (
    INK, INK_FAINT, PAPER, PEN, SapiensScene, Stendi, blocco, cerchio, disegna, evidenziatore, matita,
    metti, testo,
)

LEZIONE = "Equazioni di secondo grado"
# One vertical unit for the three graphs, so their steepness can be compared.
Y_RANGE = (-1.6, 4.5)
Y_LEN = 1.7
X_UNIT = 0.8


def grafico(nome, f, x_range, radici):
    ax = Axes(
        x_range=[*x_range, 1], y_range=[*Y_RANGE, 1], x_length=(x_range[1] - x_range[0]) * X_UNIT, y_length=Y_LEN,
        tips=False, axis_config={"color": INK_FAINT, "stroke_width": 2.5, "include_ticks": False},
    )
    ax.y_axis.set_stroke(opacity=0)  # only the x axis matters here
    curva = ax.plot(f, x_range=x_range, color=INK, stroke_width=4.5)
    punti = VGroup(*[Dot(ax.c2p(x, 0), radius=0.1, color=PEN).set_stroke(PAPER, width=3, background=True) for x, _ in radici])
    etichette = VGroup(*[MathTex(t, font_size=36).next_to(ax.c2p(x, 0), DOWN, buff=0.2) for x, t in radici])
    blocco(nome, ax, curva, punti, etichette)
    return ax, curva, punti, etichette


class Clip3Discriminante(SapiensScene):
    def construct(self):
        head, tratto = self.intestazione(LEZIONE, "Due, una o nessuna", 3, 4)
        self.tieni(head, tratto)
        delta = MathTex(r"\Delta = b^2 - 4ac", font_size=60)
        delta.name = "delta"
        metti(delta, "A4:A6", allinea=RIGHT)
        self.tieni(delta)

        with self.voiceover(text="Il segno del discriminante <bookmark mark='d'/>ti dice quante soluzioni ha l'equazione, prima ancora di usare la formula."):
            self.entra_intestazione(head, tratto)
            self.wait_until_bookmark("d")
            self.play(Write(delta))
            band = evidenziatore(delta)
            self.play(Stendi(band))
            self.tieni(band)

        def colonna(zona, nome, cond, verdetto, eq, calc, g, esito):
            c = MathTex(cond, font_size=56)
            v = testo(verdetto, size=28)
            testa = VGroup(c, v).arrange(RIGHT, buff=0.35, aligned_edge=DOWN)
            e = MathTex(eq, font_size=36)
            d = MathTex(calc, font_size=36)
            ax, curva, punti, etich = g
            fig = VGroup(ax, curva, punti, etich)
            s = MathTex(esito, font_size=38)
            # Five dense rows: snapping each to the grid would not fit a third of the page.
            col = self.colonna([testa, e, d, fig, s], zona, nome, buff=0.26, quadretti=False, verticale=UP)
            fig.name = f"{nome}.grafico"
            return dict(c=c, v=v, e=e, d=d, ax=ax, curva=curva, punti=punti, etich=etich, s=s, col=col, righe=[testa, e, d, fig, s])

        c1 = colonna("B1:F2", "positivo", r"\Delta > 0", "due soluzioni", "x^2 - 5x + 6 = 0", r"\Delta = 25 - 24 = 1",
                     grafico("g1", lambda x: x * x - 5 * x + 6, (0.4, 4.6), [(2, "2"), (3, "3")]), r"S = \{2,\ 3\}")
        c2 = colonna("B3:F4", "nullo", r"\Delta = 0", "una, doppia", "4x^2 - 12x + 9 = 0", r"\Delta = 144 - 144 = 0",
                     grafico("g2", lambda x: 4 * x * x - 12 * x + 9, (0.4, 2.6), [(1.5, r"\frac{3}{2}")]), r"S = \left\{\frac{3}{2}\right\}")
        c3 = colonna("B5:F6", "negativo", r"\Delta < 0", "nessuna", "2x^2 - 4x + 5 = 0", r"\Delta = 16 - 40 = -24",
                     grafico("g3", lambda x: 2 * x * x - 4 * x + 5, (0.0, 2.0), []), r"S = \emptyset")

        # Same row, same height in the three columns: axes and results line up across the page.
        cols = [c1, c2, c3]
        top = max(c["righe"][0].get_top()[1] for c in cols)
        altezze = [max(c["righe"][i].height for c in cols) for i in range(5)]
        for c in cols:
            y = top
            for r, h in zip(c["righe"], altezze):
                r.shift(UP * (y - h / 2 - r.get_center()[1]))
                y -= h + 0.26
        # The graphs: align the x axes themselves, not the boxes.
        asse = min(c["ax"].c2p(0, 0)[1] for c in cols)
        for c in cols:
            c["righe"][3].shift(UP * (asse - c["ax"].c2p(0, 0)[1]))

        def costruisci(c):
            self.play(FadeIn(c["c"], shift=DOWN * 0.1), FadeIn(c["v"]))
            self.wait_until_bookmark("e")
            self.play(Write(c["e"]))
            self.wait_until_bookmark("d")
            self.play(Write(c["d"]))
            self.wait_until_bookmark("g")
            self.play(Create(c["ax"]), run_time=0.5)
            self.play(Create(c["curva"]), run_time=0.9)
            if len(c["punti"]):
                self.play(FadeIn(c["punti"], scale=0.5), FadeIn(c["etich"]))
            self.wait_until_bookmark("s")
            self.play(Write(c["s"]))
            self.wait(1.2)

        with self.voiceover(text="Se delta è positivo, le soluzioni sono due, distinte. <bookmark mark='e'/>Per x al quadrato meno cinque x più sei, <bookmark mark='d'/>delta è uno. <bookmark mark='g'/>Le soluzioni sono i punti dove la parabola taglia l'asse x: <bookmark mark='s'/>due e tre."):
            costruisci(c1)
        with self.voiceover(text="Se delta è zero, la radice di delta vale zero, e il più e il meno della formula danno lo stesso numero. <bookmark mark='e'/>Per quattro x al quadrato meno dodici x più nove, <bookmark mark='d'/>delta è zero. <bookmark mark='g'/>La parabola tocca l'asse in un punto solo: <bookmark mark='s'/>la soluzione è tre mezzi, doppia."):
            self.play(self.sbiadisci(c1["col"]), run_time=0.4)
            costruisci(c2)
        with self.voiceover(text="Se delta è negativo, la radice di un numero negativo non esiste tra i reali. <bookmark mark='e'/>Per due x al quadrato meno quattro x più cinque, <bookmark mark='d'/>delta è meno ventiquattro. <bookmark mark='g'/>La parabola non incontra l'asse: <bookmark mark='s'/>nessuna soluzione reale."):
            self.play(self.sbiadisci(c2["col"]), run_time=0.4)
            costruisci(c3)

        nota = matita("hai già finito", size=34)
        nota.name = "nota"
        loop = cerchio(c3["c"], seed=9)
        with self.voiceover(text="Per questo delta si calcola per primo: <bookmark mark='f'/>se è negativo, hai già finito."):
            self.play(self.ravviva(c1["col"], c2["col"]), run_time=0.5)
            self.wait_until_bookmark("f")
            self.play(disegna(loop))
            nota.next_to(c3["s"], RIGHT, buff=0.4)
            self.play(self.nota(nota))
        self.wait(2.0)
