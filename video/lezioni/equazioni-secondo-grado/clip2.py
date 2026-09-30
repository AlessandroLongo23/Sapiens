"""Clip 2: the quadratic formula (piano.md, clip 2)."""

from manim import DOWN, LEFT, RIGHT, UP, FadeIn, MathTex, Write

from sapiens import (
    GRAPHITE, INK_MUTED, SapiensScene, Stendi, barra, cerchio, disegna, etichetta, evidenziatore, freccia,
    matita, metti, riquadro, sottolinea, spunta,
)

LEZIONE = "Equazioni di secondo grado"


class Clip2Formula(SapiensScene):
    def construct(self):
        head, tratto = self.intestazione(LEZIONE, "La formula risolutiva", 2, 4)
        self.tieni(head, tratto)

        # 1. Coefficients carry their sign: each one written under its term.
        eq = MathTex("3x^2", r"\quad -\,x", r"\quad -\,2", r"\quad = 0", font_size=84)
        eq.name = "equazione"
        metti(eq, "B1:C6")
        coef = [MathTex(t, font_size=48) for t in ("a = 3", "b = -1", "c = -2")]
        for c, part in zip(coef, eq[:3]):
            c.next_to(part, DOWN, buff=1.0).match_x(part)
            c.name = c.get_tex_string()
        with self.voiceover(text="Prima di usare la formula devi leggere i coefficienti, <bookmark mark='segno'/>e il segno fa parte del coefficiente. In tre x al quadrato meno x meno due, <bookmark mark='a'/>a è tre, <bookmark mark='b'/>b è meno uno, <bookmark mark='c'/>c è meno due."):
            self.entra_intestazione(head, tratto)
            self.play(Write(eq), run_time=1.0)
            self.wait_until_bookmark("segno")
            self.play(disegna(sottolinea(eq[1], seed=1, color=GRAPHITE, width=4)), disegna(sottolinea(eq[2], seed=2, color=GRAPHITE, width=4)))
            for c, bm in zip(coef, "abc"):
                self.wait_until_bookmark(bm)
                self.play(Write(c), run_time=0.5)

        # 2-3. Discriminant and formula; the order of the two solutions.
        self.pulisci()
        delta = MathTex(r"\Delta = b^2 - 4ac", font_size=72)
        delta.name = "delta"
        metti(delta, "B1:B4", allinea=LEFT)
        formula = MathTex(r"x_{1,2} = \frac{-b \pm \sqrt{\Delta}}{2a}", font_size=96)
        formula.name = "formula"
        metti(formula, "C1:E4")
        box = riquadro(formula, seed=3)
        n1 = matita("due conti:\ncon il meno e con il più", size=40)
        n2 = matita("se a > 0, il meno\ndà la più piccola", size=40)
        self.colonna([n1, n2], "C5:E6", "note", buff=0.6)
        with self.voiceover(text="Poi calcoli il discriminante, delta, <bookmark mark='d'/>che è b al quadrato meno quattro a c. <bookmark mark='f'/>Le soluzioni sono meno b più o meno radice di delta, tutto diviso due a. <bookmark mark='pm'/>Il più o meno vuol dire due conti: <bookmark mark='pos'/>se a è positivo, con il meno trovi la soluzione più piccola e con il più la più grande."):
            self.play(Write(delta))
            self.wait_until_bookmark("d")
            self.play(Stendi(evidenziatore(delta)))
            self.wait_until_bookmark("f")
            self.play(Write(formula), run_time=1.6)
            self.play(disegna(box))
            self.wait_until_bookmark("pm")
            self.play(self.nota(n1))
            pm = formula[0][7]
            self.play(disegna(freccia(n1.get_top() + UP * 0.15, pm.get_top() + UP * 0.12, curva=-0.6, color=GRAPHITE)))
            self.wait_until_bookmark("pos")
            self.play(self.nota(n2))

        # 4-6. Worked example 6.
        self.pulisci()
        e = [
            etichetta("esempio"),
            MathTex("x^2 - 5x + 6 = 0", font_size=64),
            MathTex(r"a = 1 \quad b = -5 \quad c = 6", font_size=52),
            MathTex(r"\Delta = (-5)^2 - 4 \cdot 1 \cdot 6", font_size=56),
            MathTex("= 25 - 24 =", "1", font_size=56),
        ]
        self.colonna(e, "B1:F3", "esempio")
        e[4].align_to(e[3][0][1], LEFT)
        f = [
            MathTex(r"x_{1,2} = \frac{5 \pm \sqrt{1}}{2} = \frac{5 \pm 1}{2}", font_size=54),
            MathTex(r"x_1 = \frac{5 - 1}{2} = 2", font_size=52),
            MathTex(r"x_2 = \frac{5 + 1}{2} = 3", font_size=52),
            MathTex(r"S = \{2,\ 3\}", font_size=64),
        ]
        self.colonna(f, "B4:F6", "soluzioni", buff=0.3, quadretti=False)
        with self.voiceover(text="Proviamo con x al quadrato meno cinque x più sei. <bookmark mark='c'/>a è uno, b è meno cinque, c è sei."):
            self.play(FadeIn(e[0]), Write(e[1]))
            self.wait_until_bookmark("c")
            self.play(Write(e[2]))
        with self.voiceover(text="Delta è <bookmark mark='a'/>il quadrato di meno cinque, meno quattro per uno per sei: <bookmark mark='b'/>venticinque meno ventiquattro, uno."):
            self.wait_until_bookmark("a")
            self.play(Write(e[3]))
            self.wait_until_bookmark("b")
            self.play(Write(e[4]))
        with self.voiceover(text="Nella formula <bookmark mark='a'/>meno b diventa cinque, e la radice di uno è uno. <bookmark mark='b'/>Cinque meno uno, diviso due, fa due; <bookmark mark='c'/>cinque più uno, diviso due, fa tre. <bookmark mark='s'/>Le soluzioni sono due e tre."):
            self.wait_until_bookmark("a")
            self.play(Write(f[0]), run_time=1.4)
            self.wait_until_bookmark("b")
            self.play(Write(f[1]))
            self.wait_until_bookmark("c")
            self.play(Write(f[2]))
            self.wait_until_bookmark("s")
            self.play(Write(f[3]))
            self.play(disegna(cerchio(f[3], seed=5)))

        # 7. Frequent error: writing b squared without brackets.
        self.pulisci()
        lab = etichetta("errore frequente", color=INK_MUTED)
        sbagliato = MathTex(r"b^2 = -5^2 = -25", font_size=76)
        giusto = MathTex(r"b^2 = (-5)^2 = 25", font_size=76)
        nota = matita("b negativo? sempre tra parentesi")
        self.colonna([lab, sbagliato, giusto, nota], "B1:F6", "errore", buff=0.5)
        with self.voiceover(text="Attento a come scrivi b al quadrato quando b è meno cinque. <bookmark mark='a'/>Senza parentesi l'esponente va solo sul cinque, e ottieni meno venticinque: <bookmark mark='x'/>è sbagliato. <bookmark mark='b'/>Con le parentesi il quadrato è venticinque. <bookmark mark='n'/>Quando b è negativo, mettilo sempre tra parentesi."):
            self.play(FadeIn(lab))
            self.wait_until_bookmark("a")
            self.play(Write(sbagliato))
            self.wait_until_bookmark("x")
            self.play(disegna(barra(sbagliato, seed=6)))
            self.wait_until_bookmark("b")
            self.play(Write(giusto))
            self.play(disegna(spunta(giusto.get_right() + RIGHT * 0.5 + DOWN * 0.2)))
            self.wait_until_bookmark("n")
            self.play(self.nota(nota))

        # 8. The formula stays; the sign of delta is the next clip.
        self.pulisci()
        fin = MathTex(r"x_{1,2} = \frac{-b \pm \sqrt{\Delta}}{2a}", font_size=110)
        fin.name = "formula finale"
        dom = matita("Δ > 0,  Δ = 0,  Δ < 0 ?", size=48)
        self.colonna([fin, dom], "B1:F6", "fine", buff=0.9)
        box2 = riquadro(fin, seed=7)
        with self.voiceover(text="<bookmark mark='p'/>Il segno di delta dice anche quante soluzioni ci sono, prima ancora della formula: lo vedi nella prossima clip."):
            self.play(FadeIn(fin), run_time=0.5)
            self.play(disegna(box2), self.nota(dom))
        self.wait(0.8)
