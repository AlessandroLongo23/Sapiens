"""Clip 1: pure and spurious equations, solved without the formula (piano.md, clip 1)."""

from manim import DOWN, LEFT, RIGHT, UP, UL, Create, FadeIn, MathTex, Square, TransformMatchingTex, VGroup, Write

from sapiens import (
    GRAPHITE, INK, INK_MUTED, MATH_SOFT, SQUARE, testo, SapiensScene, Stendi, barra, blocco, cerchio, disegna, etichetta,
    evidenziatore, freccia, matita, metti, riquadro, su_quadretto,
)

LEZIONE = "Equazioni di secondo grado"


class Clip1PuraSpuria(SapiensScene):
    def construct(self):
        head, tratto = self.intestazione(LEZIONE, "Pura e spuria, senza formula", 1, 4)
        self.tieni(head, tratto)

        # 1-2. The square of area 49: 7 x 7 squares of the page.
        sq = Square(side_length=7 * SQUARE).set_stroke(INK, 4).set_fill(MATH_SOFT, 0.35)
        metti(sq, "B1:F2")
        su_quadretto(sq, UL)
        area = MathTex(r"49\ \text{cm}^2", font_size=52).move_to(sq)
        lx = MathTex("x", font_size=52).next_to(sq, DOWN, buff=0.2)
        blocco("quadrato", sq, area, lx)
        lx7 = MathTex(r"x = 7\ \text{cm}", font_size=52).move_to(lx)
        blocco("quadrato", lx7)

        eq = MathTex("x^2 = 49", font_size=64)
        sol = MathTex("x = 7", r"\qquad", "x = -7", font_size=64)
        nota = matita("una lunghezza\nnon è negativa", size=44)
        self.colonna([eq, sol, nota], "B3:F6", "risolvi", buff=0.6)

        with self.voiceover(text="Un quadrato ha l'area di quarantanove centimetri quadrati. <bookmark mark='lato'/>Quanto misura il lato?"):
            self.entra_intestazione(head, tratto)
            self.play(Create(sq), run_time=0.8)
            self.play(FadeIn(area), run_time=0.4)
            self.wait_until_bookmark("lato")
            self.play(Write(lx), run_time=0.5)
        with self.voiceover(text="Se chiami x il lato, devi risolvere <bookmark mark='eq'/>x al quadrato uguale a quarantanove. I numeri che al quadrato danno quarantanove sono due, <bookmark mark='sol'/>sette e meno sette; <bookmark mark='neg'/>ma una lunghezza non può essere negativa, <bookmark mark='sette'/>quindi il lato misura sette centimetri."):
            self.wait_until_bookmark("eq")
            self.play(Write(eq))
            self.wait_until_bookmark("sol")
            self.play(Write(sol))
            self.wait_until_bookmark("neg")
            self.play(disegna(barra(sol[2], seed=1)), self.nota(nota))
            self.wait_until_bookmark("sette")
            self.play(disegna(cerchio(sol[0], seed=2)), TransformMatchingTex(lx, lx7))

        # 3. Normal form, then the two incomplete ones.
        self.pulisci()
        normale = MathTex(r"ax^2 + bx + c = 0", r"\qquad a \neq 0", font_size=64)
        normale.name = "normale"
        metti(normale, "B1:C6")
        box = riquadro(normale, seed=3)

        def scheda(nome, parti, manca, pulita, zona):
            lab = etichetta(nome)
            f = MathTex(*parti, font_size=60)
            g = VGroup(lab, f).arrange(DOWN, aligned_edge=LEFT, buff=0.3)
            g.name = f"scheda {nome}"
            metti(g, zona)
            fp = MathTex(*pulita, font_size=60).move_to(f, aligned_edge=LEFT)
            return lab, f, f[manca], fp

        lp, fp_, bx, fp_pulita = scheda("pura", ["ax^2", "+ bx", "+ c = 0"], 1, ["ax^2", "+ c = 0"], "D1:F3")
        ls, fs_, c, fs_pulita = scheda("spuria", ["ax^2", "+ bx", "+ c", "= 0"], 2, ["ax^2", "+ bx", "= 0"], "D4:F6")
        with self.voiceover(text="Le equazioni in cui l'incognita compare al quadrato sono di secondo grado, <bookmark mark='cosi'/>e in forma normale si scrivono così. <bookmark mark='inc'/>Se manca il termine in x, <bookmark mark='c'/>o il termine noto, l'equazione è incompleta, <bookmark mark='noformula'/>e si risolve senza formula."):
            self.wait_until_bookmark("cosi")
            self.play(Write(normale), run_time=1.3)
            self.play(disegna(box))
            self.wait_until_bookmark("inc")
            self.play(FadeIn(lp), FadeIn(fp_))
            segno = barra(bx, seed=4)
            self.play(disegna(segno))
            self.play(TransformMatchingTex(fp_, fp_pulita), segno.animate.set_opacity(0))
            self.wait_until_bookmark("c")
            self.play(FadeIn(ls), FadeIn(fs_))
            segno2 = barra(c, seed=5)
            self.play(disegna(segno2))
            self.play(TransformMatchingTex(fs_, fs_pulita), segno2.animate.set_opacity(0))

        # 4. Pure with two solutions: the steps on the left, the result on the right.
        self.pulisci()
        p = [etichetta("pura"), MathTex("4x^2 - 49 = 0"), MathTex("4x^2 = 49"), MathTex(r"x^2 = \frac{49}{4}")]
        self.colonna(p, "B1:F3", "pura")
        p2 = [MathTex(r"x = \pm\sqrt{\frac{49}{4}}", r"= \pm\frac{7}{2}"), MathTex(r"S = \left\{-\frac{7}{2},\ \frac{7}{2}\right\}")]
        self.colonna(p2, "B4:F6", "pura soluzioni", buff=0.5)
        with self.voiceover(text="In un'equazione pura manca il termine in x. Prendi <bookmark mark='e'/>quattro x al quadrato meno quarantanove uguale a zero: <bookmark mark='a'/>porti il termine noto a destra, <bookmark mark='b'/>dividi per quattro, <bookmark mark='c'/>poi estrai la radice. Le soluzioni sono due, opposte: <bookmark mark='r'/>più o meno sette mezzi."):
            self.play(FadeIn(p[0]))
            self.wait_until_bookmark("e")
            self.play(Write(p[1]))
            self.wait_until_bookmark("a")
            self.play(Write(p[2]))
            self.wait_until_bookmark("b")
            self.play(Write(p[3]))
            self.wait_until_bookmark("c")
            self.play(Write(p2[0][0]))
            self.wait_until_bookmark("r")
            self.play(Write(p2[0][1]))
            self.play(Stendi(evidenziatore(p2[0][1][1:])))
            self.play(Write(p2[1]))
            self.wait(1.0)

        # 5. Pure with no solutions.
        self.pulisci()
        q = [etichetta("pura"), MathTex("2x^2 + 8 = 0"), MathTex("2x^2 = -8"), MathTex("x^2 = -4"), MathTex(r"S = \emptyset")]
        self.colonna(q, "B1:F3", "vuota")
        nota2 = matita("nessun quadrato\nè negativo")
        nota2.name = "nota2"
        metti(nota2, "D4:E6", allinea=LEFT)
        with self.voiceover(text="Attenzione al segno. <bookmark mark='a'/>In due x al quadrato più otto uguale a zero, <bookmark mark='b'/>x al quadrato viene meno quattro. <bookmark mark='c'/>Nessun numero reale ha il quadrato negativo, <bookmark mark='s'/>quindi non ci sono soluzioni."):
            self.wait_until_bookmark("a")
            self.play(FadeIn(q[0]), Write(q[1]))
            self.wait_until_bookmark("b")
            self.play(Write(q[2]))
            self.play(Write(q[3]))
            self.wait_until_bookmark("c")
            self.play(self.nota(nota2))
            self.wait_until_bookmark("s")
            self.play(Write(q[4]))
            self.play(disegna(cerchio(q[4], seed=6)))
            self.play(disegna(freccia(nota2.get_left() + LEFT * 0.2, q[4].get_right() + RIGHT * 0.5, curva=0.3, color=GRAPHITE)))

        # 6-7. Spurious: factor out 2x; the frequent error of dividing by x.
        self.pulisci()
        s = [
            etichetta("spuria"),
            MathTex("2x^2 - 6x = 0"),
            MathTex("2x", "(x - 3)", "= 0"),
            MathTex(r"2x = 0 \quad\text{oppure}\quad x - 3 = 0"),
            MathTex(r"x = 0 \quad\text{oppure}\quad x = 3"),
            MathTex(r"S = \{0,\ 3\}"),
        ]
        self.colonna(s, "B1:F4", "spuria", buff=0.3)
        lab4 = etichetta("errore frequente", color=INK_MUTED)
        err = MathTex("2x - 6 = 0", font_size=60)
        nota3 = matita("così perdi x = 0")
        self.colonna([lab4, err, nota3], "C5:F6", "errore", buff=0.45)
        diviso = matita("÷ x", size=48)
        diviso.name = "diviso"

        with self.voiceover(text="In un'equazione spuria manca il termine noto. In due x al quadrato meno sei x <bookmark mark='a'/>raccogli due x. <bookmark mark='b'/>Un prodotto vale zero se e solo se almeno uno dei fattori vale zero: è la legge di annullamento del prodotto. <bookmark mark='c'/>Quindi due x uguale a zero, oppure x meno tre uguale a zero. <bookmark mark='d'/>Le soluzioni sono zero e tre."):
            self.play(FadeIn(s[0]), Write(s[1]))
            self.wait_until_bookmark("a")
            self.play(Write(s[2]))
            self.wait_until_bookmark("b")
            self.play(Stendi(evidenziatore(s[2][0], variante=1, pad=0.05)))
            self.play(Stendi(evidenziatore(s[2][1], variante=2, pad=0.05)))
            self.wait_until_bookmark("c")
            self.play(Write(s[3]))
            self.wait_until_bookmark("d")
            self.play(Write(s[4]))
            self.play(Write(s[5]))
            self.play(disegna(cerchio(s[5], seed=7)))
        # From the right end of the first line, arching over the empty right side, down onto the error:
        # it never crosses the rows of the calculation.
        arrow = freccia(s[1].get_right() + RIGHT * 0.3, err.get_left() + LEFT * 0.2 + UP * 0.1, curva=0.6, color=GRAPHITE)
        diviso.move_to(arrow[0].point_from_proportion(0.5)).shift(UP * 0.35 + RIGHT * 0.3)
        with self.voiceover(text="Non dividere per x: <bookmark mark='a'/>così perdi la soluzione zero. <bookmark mark='b'/>Raccogli, sempre."):
            self.play(FadeIn(lab4))
            self.play(disegna(arrow), self.nota(diviso), Write(err))
            self.wait_until_bookmark("a")
            self.play(disegna(barra(err, seed=8)), self.nota(nota3))
            self.wait_until_bookmark("b")
            self.play(disegna(cerchio(s[2], seed=10, pad=0.14)))

        # 8. Summary.
        self.pulisci()

        def regola(nome, parole, formula, extra=None):
            parti = [testo(nome, size=40, weight="SEMIBOLD"), testo(parole, size=40), MathTex(formula, font_size=64)]
            riga = VGroup(*parti).arrange(RIGHT, buff=0.25, aligned_edge=DOWN)
            return riga, parti[2]

        r1, m1 = regola("Pura:", "ricavi", "x^2")
        r2, m2 = regola("Spuria:", "raccogli", "x")
        r1b = testo("poi due soluzioni opposte, con il ±", size=32, color=INK_MUTED)
        r2b = testo("una soluzione è sempre 0", size=32, color=INK_MUTED)
        r3 = testo("Complete: serve la formula", size=32, color=INK_MUTED)
        self.colonna([r1, r1b, r2, r2b, r3], "B1:F5", "riepilogo", buff=0.4)
        with self.voiceover(text="Pura: <bookmark mark='a'/>ricavi x al quadrato, poi le soluzioni sono due, opposte. Spuria: <bookmark mark='b'/>raccogli x, e una soluzione è sempre zero. <bookmark mark='c'/>Per le equazioni complete serve la formula: la vedi nella prossima clip."):
            self.play(FadeIn(r1))
            self.wait_until_bookmark("a")
            self.play(Stendi(evidenziatore(m1)))
            self.play(FadeIn(r1b))
            self.play(FadeIn(r2))
            self.wait_until_bookmark("b")
            self.play(Stendi(evidenziatore(m2, variante=1)))
            self.play(FadeIn(r2b))
            self.wait_until_bookmark("c")
            self.play(FadeIn(r3, shift=UP * 0.1))
        self.wait(0.8)
