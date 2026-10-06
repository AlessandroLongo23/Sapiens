"""Checker for fis-impulso (specs/exercises/fis-impulso.md), written from the spec and the lesson 81-fis-impulso.md, not
from the generator.

The impulse of a constant force is F times the time, in N s. The impulse of the total force is the change of
momentum, so a body at rest reaches I / m, the mean force that stops a body is m v over the time (milliseconds are
thousandths of a second), and in a bounce the change of velocity is v1 + v2. Under a force-time graph the impulse is
the area. Who lands from a jump is pushed by the ground with m v / dt plus the weight, with g = 9,8 m/s^2.
"""
import re

from sympy import Rational

from checkers._fis_energia import G, Q, answer, data
from checkers._fis_quantita_moto import NS, answer_tex, area_under, exact_answer_tex, graph
from checkers._vettori import common, num, prose

KG, MS, S, MSEC, N = Q("kg"), Q("m/s"), Q("s"), Q("ms"), Q("N")


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una forza costante di " + N + " agisce su un carrello per " + S + r"\. Quanto vale il modulo dell'impulso della forza\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    F, dt = data(errs, m.group(1), "force"), data(errs, m.group(2), "time")
    answer_tex(sample, errs, F * dt, NS, lo=1)
    return "impulso"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un carrello di " + KG + ", fermo su una rotaia senza attrito, viene spinto per " + S + " da una forza costante di " + N + r"\. Che velocità raggiunge\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    mass, dt, F = data(errs, m.group(1), "mass"), data(errs, m.group(2), "time"), data(errs, m.group(3), "force")
    answer(sample, errs, F * dt / mass, "m/s", lo=Rational(1, 2), hi=40)
    return "velocita"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(Una palla|Un pallone|Una pallina) di " + KG + " che viaggia a " + MS + r" viene (fermata|fermato) (dal guanto di un portiere|da una rete|dalle mani di un giocatore) in " + MSEC + r"\. Quanto vale il modulo della forza media che (la|lo) ferma\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    masculine = m.group(1) == "Un pallone"
    if (m.group(4) == "fermato") != masculine or (m.group(7) == "lo") != masculine:
        errs.append("gender agreement")
    mass, v, ms = data(errs, m.group(2), "mass"), data(errs, m.group(3), "speed"), data(errs, m.group(6), "time")
    if not 11 <= ms <= 99:
        errs.append("time out of range")
    answer(sample, errs, mass * v / (ms / 1000), "N", lo=5)
    return "arresto"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una palla di " + KG + " colpisce il pavimento a " + MS + " e rimbalza verso l'alto a " + MS + r"\. Il contatto dura " + MSEC + r"\. Quanto vale il modulo della forza totale media sulla palla durante il contatto\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    mass, v1, v2, ms = (data(errs, m.group(i), "datum") for i in (1, 2, 3, 4))
    if not v2 <= Rational(85, 100) * v1:
        errs.append("the speed after the bounce must be at least 15% smaller")
    answer(sample, errs, mass * (v1 + v2) / (ms / 1000), "N", lo=5)
    return "rimbalzo"


def peak(sample, errs):
    """The push of levels 5 and 6: from zero up to a force on the grid, maybe constant for a while, back to zero."""
    pts, d = graph(sample, errs)
    if len(pts) not in (3, 4) or pts[0] != (0, 0) or pts[-1][1] != 0 or pts[1][1] <= 0 or (len(pts) == 4 and pts[2][1] != pts[1][1]):
        errs.append("the graph is not a triangle or a trapezium from zero to zero")
    x, y = d.get("x", {}), d.get("y", {})
    if x.get("unita") != "s" or y.get("unita") != "N" or x.get("passo") != 0.1 or y.get("passo") not in (5, 10):
        errs.append("axes not as in the spec")
    if any((p[0] * 10).q != 1 for p in pts) or (pts[1][1] / Rational(y.get("passo", 1))).q != 1:
        errs.append("a corner is off the grid")
    if any(k in d for k in ("livello", "segna", "area")):
        errs.append("the scene shows more than the data")
    spts, sd = graph(sample, errs, "solutionScene")
    if spts != pts or sd.get("area") is not True:
        errs.append("the solution's scene does not colour the area")
    return pts, len(pts) == 4


def level5(sample, errs):
    s = prose(sample["problem"])
    if s != "Il grafico mostra la forza che una mano esercita su un carrello durante una spinta, in funzione del tempo. Quanto vale l'impulso della forza?":
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    pts, trapezium = peak(sample, errs)
    area = area_under(pts)
    if area % 10 == 0 or area < Rational(3, 2):
        errs.append("area multiple of 10 or too small")
    exact_answer_tex(sample, errs, area, NS)
    return "trapezio" if trapezium else "triangolo"


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Il grafico mostra la forza totale che agisce su un carrello di " + KG + r", fermo all'inizio, durante una spinta\. Che velocità ha il carrello alla fine della spinta\?", s)
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    mass = data(errs, m.group(1), "mass")
    pts, trapezium = peak(sample, errs)
    answer(sample, errs, area_under(pts) / mass, "m/s", lo=Rational(1, 2))
    return "trapezio" if trapezium else "triangolo"


def level7(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(Un ragazzo|Una ragazza|Un atleta|Un'atleta) di " + KG + " salta da un muretto, tocca terra a " + MS + " e si ferma in " + S + r"\. Con quale forza media il suolo spinge verso l'alto durante l'atterraggio\?", s)
    if not m:
        errs.append(f"level 7 text not recognised: {s!r}")
        return None
    mass, v, dt = num(m.group(2)), data(errs, m.group(3), "speed"), data(errs, m.group(4), "time")
    if mass.q != 1 or not 41 <= mass <= 95 or mass % 10 == 0:
        errs.append("mass out of range")
    net, w = mass * v / dt, mass * G
    if net < Rational(3, 10) * w:
        errs.append("the total force is too small beside the weight")
    answer(sample, errs, (net + w) / 1000, "kN")
    return "atterraggio"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7}
CASE_RANGES = {5: {"triangolo": (0.35, 0.65), "trapezio": (0.35, 0.65)}, 6: {"triangolo": (0.35, 0.65), "trapezio": (0.35, 0.65)}}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    if lvl not in (5, 6) and (sample.get("scene") or sample.get("solutionScene")):
        errs.append("no scene expected")
    return errs, kind
