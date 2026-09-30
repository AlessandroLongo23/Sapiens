"""Clip 4: irrational solutions and how to simplify them (piano.md, clip 4)."""

from manim import DOWN, LEFT, RIGHT, UP, FadeIn, Line, MathTex, VGroup, Write

from sapiens import (
    GRAPHITE, INK, INK_MUTED, SapiensScene, sottolinea, Stendi, barra, cerchio, disegna, etichetta, evidenziatore, matita, metti,
)

LEZIONE = "Equazioni di secondo grado"


def frazione(num: list[str], den: list[str], font_size=72, prima: str | None = None) -> VGroup:
    """A fraction built from pieces, so single numbers inside it can be marked.

    MathTex cannot split a substring inside \\frac{...}: numerator and denominator are
    separate MathTex joined by a line.
    """
    n = MathTex(*num, font_size=font_size)
    d = MathTex(*den, font_size=font_size)
    bar = Line(LEFT, RIGHT).set_stroke(INK, 3.2)
    bar.set_width(max(n.width, d.width) + 0.2)
    frac = VGroup(n, bar, d).arrange(DOWN, buff=0.14)
    if prima:
        lhs = MathTex(prima, font_size=font_size)
        g = VGroup(lhs, frac).arrange(RIGHT, buff=0.2)
        lhs.align_to(bar, UP).shift(UP * lhs.height / 2 * 0.95)
        return g
    return frac


class Clip4Radicali(SapiensScene):
    def construct(self):
        head, tratto = self.intestazione(LEZIONE, "Soluzioni con la radice", 4, 4)
        self.tieni(head, tratto)

        # 0. When the solutions keep a root.
        regola = MathTex(r"\Delta > 0,\ \text{non quadrato perfetto} \;\Rightarrow\; \sqrt{\Delta}\ \text{irrazionale}", font_size=52)
        regola.name = "regola"
        metti(regola, "C1:D6")
        with self.voiceover(text="Quando delta è positivo ma non è un quadrato perfetto, <bookmark mark='r'/>la sua radice è irrazionale, e lo sono anche le soluzioni: si lasciano scritte con la radice, senza trasformarle in numeri decimali."):
            self.entra_intestazione(head, tratto)
            self.wait_until_bookmark("r")
            self.play(Write(regola), run_time=1.6)

        # 1-3. Delta and the square root.
        self.pulisci()
        eq = MathTex("x^2 - 8x - 2 = 0", font_size=64)
        coef = MathTex(r"a = 1 \quad b = -8 \quad c = -2", font_size=52)
        d0 = MathTex(r"\Delta = (-8)^2 - 4 \cdot 1 \cdot (-2)", font_size=56)
        d1 = MathTex("= 64", "+ 8", font_size=56)
        d2 = MathTex("= 72", font_size=56)
        self.colonna([eq, coef, d0, d1, d2], "B1:F3", "delta", verticale=UP, quadretti=False, buff=0.3)
        for riga in (d1, d2):
            riga.align_to(d0[0][1], LEFT)
        r0 = MathTex(r"\sqrt{72} = \sqrt{36 \cdot 2}", font_size=60)
        r1 = MathTex(r"= \sqrt{36}", r"\cdot \sqrt{2}", font_size=60)
        r2 = MathTex(r"= 6\sqrt{2}", font_size=64)
        self.colonna([r0, r1, r2], "B4:F6", "radice", buff=0.45, verticale=UP)

        with self.voiceover(text="Prendi x al quadrato meno otto x meno due. <bookmark mark='c'/>a è uno, b è meno otto, c è meno due."):
            self.play(Write(eq))
            self.wait_until_bookmark("c")
            self.play(Write(coef))
        with self.voiceover(text="Delta è <bookmark mark='a'/>il quadrato di meno otto, meno quattro per uno per meno due. <bookmark mark='b'/>Meno per meno fa più: <bookmark mark='c'/>sessantaquattro più otto, <bookmark mark='d'/>settantadue."):
            self.wait_until_bookmark("a")
            self.play(Write(d0))
            self.wait_until_bookmark("b")
            self.play(Write(d1))
            self.play(Stendi(evidenziatore(d1[1], pad=0.06)))
            self.wait_until_bookmark("d")
            self.play(Write(d2))
        with self.voiceover(text="Settantadue non è un quadrato perfetto, <bookmark mark='a'/>ma è trentasei per due, e trentasei lo è. <bookmark mark='b'/>La radice del prodotto è il prodotto delle radici: <bookmark mark='c'/>radice di settantadue è sei radice di due."):
            self.wait_until_bookmark("a")
            self.play(Write(r0))
            self.wait_until_bookmark("b")
            self.play(Write(r1))
            self.play(disegna(cerchio(r1[0][1:], seed=1, pad=0.2)))
            self.wait_until_bookmark("c")
            self.play(Write(r2))

        # 4. Into the formula; divide all three numbers.
        self.pulisci()
        rad = MathTex(r"\sqrt{72} = 6\sqrt{2}", font_size=48, color=INK)
        rad.name = "promemoria"
        metti(rad, "B5:B6", allinea=RIGHT)
        f = frazione(["8", r"\pm", "6", r"\sqrt{2}"], ["2"], font_size=80, prima=r"x_{1,2} =")
        f.name = "formula"
        num, den = f[1][0], f[1][2]
        ris = MathTex(r"= 4 \pm 3\sqrt{2}", font_size=80)
        ris.name = "risultato"
        ris.next_to(f, RIGHT, buff=0.3)
        ris.align_to(f[0], DOWN)
        # Place formula and result as one line, centred, before either is shown.
        metti(VGroup(f, ris), "C1:D6")
        tutti = matita("÷ 2 tutti e tre")
        tutti.name = "tutti e tre"
        tutti.next_to(f, DOWN, buff=0.5).align_to(f[1], LEFT)

        with self.voiceover(text="Nella formula metti meno b, cioè otto, <bookmark mark='q'/>e al posto di radice di delta la radice che hai appena semplificato, sei radice di due. <bookmark mark='a'/>Ora dividi per due tutti e tre i numeri: <bookmark mark='o'/>l'otto, <bookmark mark='s'/>il sei davanti alla radice <bookmark mark='d'/>e il due sotto. <bookmark mark='r'/>Resta quattro più o meno tre radice di due."):
            self.play(FadeIn(rad))
            self.play(Write(f), run_time=1.4)
            self.wait_until_bookmark("q")
            self.play(disegna(sottolinea(rad, seed=8, color=GRAPHITE, width=4)), disegna(sottolinea(VGroup(num[2], num[3]), seed=9, color=GRAPHITE, width=4)))
            self.wait_until_bookmark("a")
            self.play(self.nota(tutti))
            self.wait_until_bookmark("o")
            self.play(disegna(cerchio(num[0], seed=2, pad=0.2)))
            self.wait_until_bookmark("s")
            self.play(disegna(cerchio(num[2], seed=3, pad=0.2)))
            self.wait_until_bookmark("d")
            self.play(disegna(cerchio(den[0], seed=4, pad=0.2)))
            self.wait_until_bookmark("r")
            self.play(Write(ris))

        # 5. The frequent error: only the 8 divided.
        self.pulisci()
        lab = etichetta("errore frequente", color=INK_MUTED)
        sbagliato = MathTex(r"\frac{8 \pm 6\sqrt{2}}{2}", r"= 4 \pm 6\sqrt{2}", font_size=72)
        nota2 = matita("dividi tutti e tre i numeri, non solo l'otto")
        self.colonna([lab, sbagliato, nota2], "B1:F4", "errore", buff=0.5)
        with self.voiceover(text="L'errore più comune è dividere solo l'otto: <bookmark mark='a'/>quattro più o meno sei radice di due è sbagliato."):
            self.play(FadeIn(lab), Write(sbagliato))
            self.wait_until_bookmark("a")
            self.play(disegna(barra(sbagliato[1], seed=5)), self.nota(nota2))

        # 6. The two solutions.
        self.pulisci()
        x1 = MathTex(r"x_1 = 4 - 3\sqrt{2}", font_size=80)
        x2 = MathTex(r"x_2 = 4 + 3\sqrt{2}", font_size=80)
        rid = matita("con la formula ridotta: meno conti, stesso risultato (nella lezione)", size=40)
        self.colonna([x1, x2, rid], "B1:F6", "soluzioni", buff=0.6)
        with self.voiceover(text="Le soluzioni sono <bookmark mark='a'/>quattro meno tre radice di due <bookmark mark='b'/>e quattro più tre radice di due. <bookmark mark='c'/>Con la formula ridotta arrivi allo stesso risultato con meno conti: la trovi nella lezione."):
            self.wait_until_bookmark("a")
            self.play(Write(x1))
            self.wait_until_bookmark("b")
            self.play(Write(x2))
            self.play(disegna(cerchio(x1, seed=6, pad=0.2)), disegna(cerchio(x2, seed=7, pad=0.2)))
            self.wait_until_bookmark("c")
            self.play(self.nota(rid))
        self.wait(1.5)
