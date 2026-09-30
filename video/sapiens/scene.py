"""The base scene of a Sapiens clip: squared paper, the narrator, the layout check.

After every `play` and `wait` it records the time and the layout problems on screen; at
the end it writes them to media/controlli/<Scene>.json, which `tools/frames.py` uses to
pull one frame per step for the critic.
"""

from __future__ import annotations

import json
import os
from pathlib import Path

import math

from manim import DOWN, LEFT, ORIGIN, UP, AnimationGroup, FadeIn, FadeOut, Restore, VGroup, Write, config
from manim_voiceover import VoiceoverScene

from .layout import controlla, metti, regione
from .marks import disegna, sottolinea
from .theme import MATH, SQUARE, etichetta, quadretti, titolo
from .voice import SapiensVoice

REPORTS = Path(__file__).resolve().parent.parent / "media" / "controlli"


class SapiensScene(VoiceoverScene):
    def setup(self):
        super().setup()
        self.add(quadretti())
        self.set_speech_service(SapiensVoice(motore=os.getenv("SAPIENS_VOCE", "say")))
        self._passi: list[dict] = []

    def _registra(self, tipo: str):
        issues = controlla(self.mobjects, lambda m: m.name)
        self._passi.append({"n": len(self._passi), "tipo": tipo, "t": round(self.renderer.time, 3), "problemi": issues})

    def play(self, *args, **kwargs):
        super().play(*args, **kwargs)
        self._registra("play")

    def wait(self, *args, **kwargs):
        super().wait(*args, **kwargs)
        self._registra("wait")

    def tear_down(self):
        super().tear_down()
        REPORTS.mkdir(parents=True, exist_ok=True)
        problemi = sorted({p for s in self._passi for p in s["problemi"]})
        out = {"scena": type(self).__name__, "durata": round(self.renderer.time, 3), "passi": self._passi, "problemi": problemi}
        (REPORTS / f"{type(self).__name__}.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))

    # Pieces every clip shares.

    def intestazione(self, lezione: str, titolo_clip: str, n: int, tot: int, zona: str = "A1:A6"):
        """Label with lesson and clip number, the title in Fraunces, a red pen stroke under it."""
        lab = etichetta(f"{lezione}  ·  {n}/{tot}", size=24, color=MATH)
        tit = titolo(titolo_clip, size=46)
        blocco = VGroup(lab, tit).arrange(DOWN, aligned_edge=LEFT, buff=0.18)
        blocco.name = "intestazione"
        metti(blocco, zona, allinea=LEFT + UP)
        tratto = sottolinea(tit, seed=n, gap=0.14)
        return blocco, tratto

    def entra_intestazione(self, blocco, tratto):
        self.play(FadeIn(blocco, shift=UP * 0.1), run_time=0.6)
        self.play(disegna(tratto, run_time=0.5))

    def tieni(self, *mobs):
        """Mobjects that survive `pulisci` (the heading)."""
        self._tenuti = getattr(self, "_tenuti", set()) | {id(m) for m in mobs}

    def pulisci(self, run_time: float = 0.5, pausa: float = 1.0):
        """Clear the page, keeping the squared paper and what `tieni` marked.

        It first holds the page for `pausa` seconds: the last result needs a beat on screen.
        """
        if pausa:
            self.wait(pausa)
        keep = getattr(self, "_tenuti", set())
        via = [m for m in self.mobjects if m.z_index > -100 and id(m) not in keep]
        if via:
            self.play(*[FadeOut(m, shift=LEFT * 0.25) for m in via], run_time=run_time)

    @staticmethod
    def colonna(righe, zona: str, nome: str, buff: float = 0.36, allinea=LEFT, verticale=ORIGIN, quadretti: bool = True):
        """Steps of a calculation, one under the other, placed once so nothing moves later.

        The block is centred in its zone (or pushed up/down with `verticale`), then each row
        is dropped so its bottom sits on a line of the squared paper, as on a notebook page.
        """
        g = VGroup(*righe).arrange(DOWN, aligned_edge=allinea, buff=buff)
        # Rows stay left-aligned inside the block; the block itself is centred in its zone.
        metti(g, zona, allinea=verticale)
        prev_bottom = None
        for r in righe if quadretti else []:
            b = r.get_bottom()[1]
            target = math.floor(b / SQUARE + 1e-6) * SQUARE  # only ever down: never into the header
            if prev_bottom is not None:
                while target + r.height > prev_bottom - buff * 0.7:
                    target -= SQUARE
            r.shift(UP * (target - b))
            prev_bottom = r.get_bottom()[1]
        # Snapping only moves rows down: if the block now spills out of its zone, lift it whole.
        _, _, zb, zt = regione(zona)
        spill = zb - g.get_bottom()[1]
        if spill > 0:
            # Lift by whole squares, but never past the top of the zone.
            g.shift(UP * min(math.ceil(spill / SQUARE) * SQUARE, max(zt - g.get_top()[1], 0)))
        scala = getattr(g, "sapiens_scala", 1.0)
        for i, r in enumerate(righe):
            r.name = f"{nome}.{i}"
            r.sapiens_scala = scala
            r.sapiens_zona = zona
        return g

    @staticmethod
    def sbiadisci(mob, quanto: float = 0.6):
        """Dim a finished block. `fade` scales each part's own opacity, so empty fills stay empty
        (a raw `set_opacity` on a group fills curves). Undo with `ravviva`."""
        mob.save_state()
        return mob.animate.fade(quanto)

    @staticmethod
    def ravviva(*mobs):
        return AnimationGroup(*[Restore(m) for m in mobs])

    @staticmethod
    def nota(mob, **kw):
        """Pencil notes are written by hand, like the pen marks, not faded in."""
        kw.setdefault("run_time", 0.8)
        return Write(mob, **kw)
