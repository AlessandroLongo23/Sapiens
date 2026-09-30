"""Style sheet of the theme: every piece on one page. Render with -s for the last frame."""

from manim import DOWN, LEFT, RIGHT, UP, FadeIn, MathTex, VGroup, Write

from sapiens import (
    MATH, PEN_TEXT, SapiensScene, Stendi, barra, cerchio, disegna, etichetta, evidenziatore,
    freccia, matita, metti, riquadro, spunta, testo, testo_ricco,
)


class Provino(SapiensScene):
    def construct(self):
        head, tratto = self.intestazione("Equazioni di secondo grado", "La formula risolutiva", 2, 4)
        self.entra_intestazione(head, tratto)

        formula = MathTex(r"x_{1,2} = \frac{-b \pm \sqrt{\Delta}}{2a}", font_size=72)
        formula.name = "formula"
        metti(formula, "B1:D3")
        box = riquadro(formula, seed=1)
        self.play(Write(formula), run_time=1.2)
        self.play(disegna(box))

        delta = MathTex(r"\Delta = b^2 - 4ac")
        delta.name = "delta"
        metti(delta, "B4:B6")
        band = evidenziatore(delta, variante=1)
        self.play(Write(delta))
        self.play(Stendi(band))

        corpo = testo_ricco(f"Il segno di <span fgcolor='{PEN_TEXT}'>Δ</span> dice quante soluzioni ci sono.", size=30)
        corpo.name = "corpo"
        metti(corpo, "C4:C6", allinea=LEFT)
        self.play(FadeIn(corpo))

        sbagliato = MathTex(r"-5^2 = 25")
        giusto = MathTex(r"(-5)^2 = 25")
        riga = VGroup(sbagliato, giusto).arrange(RIGHT, buff=1.2)
        riga.name = "errore"
        metti(riga, "E1:E3")
        self.play(FadeIn(riga))
        self.play(disegna(barra(sbagliato, seed=2)))
        self.play(disegna(spunta(giusto.get_right() + RIGHT * 0.35 + DOWN * 0.2)))

        nota = matita("il meno sta fuori\ndalla parentesi!", size=36)
        nota.name = "nota"
        metti(nota, "E4:F5", allinea=LEFT)
        self.play(FadeIn(nota))
        self.play(disegna(freccia(nota.get_left() + LEFT * 0.1, sbagliato.get_right() + RIGHT * 0.1 + UP * 0.05, curva=-0.25)))

        esito = MathTex(r"S = \{2,\ 3\}")
        esito.name = "esito"
        metti(esito, "D4:D5")
        self.play(Write(esito))
        self.play(disegna(cerchio(esito, seed=3)))

        lab = etichetta("esempio 6", size=18, color=MATH)
        lab.name = "etichetta"
        metti(lab, "F1:F2", allinea=LEFT)
        self.play(FadeIn(lab))
        self.wait(0.5)
