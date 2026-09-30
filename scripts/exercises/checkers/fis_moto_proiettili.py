"""Checker for fis-moto-proiettili (specs/exercises/fis-moto-proiettili.md), written from the spec and the lesson
56-fis-moto-proiettili.md, not from the generator.

Launched horizontally at v0 from a height h: the flight lasts sqrt(2 h / g), whatever v0; the range is v0 times that;
at landing the vertical component is sqrt(2 g h) and the speed sqrt(v0^2 + 2 g h), below the horizontal by the angle
whose tangent is sqrt(2 g h) / v0. Inverse: v0 = x / sqrt(2 h / g), h = g (x / v0)^2 / 2. The place in the text
follows the height (a table under 2 m, a balcony under 10 m, a cliff above). g = 49/5 exactly, answers with two
significant figures, angles to the degree; the scene has the data of the text and no answer.
"""
import re

from sympy import Rational, atan, pi, sqrt

from checkers._vettori import common, prose
from checkers._fis_forze_movimento import G, answer, answer_deg, data2, q

CASE_RANGES = {3: {"velocita": (0.40, 0.60), "altezza": (0.40, 0.60)}}
PLACE = r"(Una pallina|Un sasso)"
FROM = r"(dal bordo di un tavolo alto|da un balcone alto|dalla cima di una scogliera alta)"


def place_ok(errs, h, body, where):
    want = ("Una pallina", "dal bordo di un tavolo") if h < 2 else ("Una pallina", "da un balcone") if h < 10 else ("Un sasso", "dalla cima di una scogliera")
    if body != want[0] or not where.startswith(want[1]):
        errs.append(f"place {body!r} {where!r} does not match the height {h}")


def height(errs, s):
    h = data2(errs, s, "height")
    if not (Rational(11, 10) <= h <= Rational(99, 10) or 11 <= h <= 99):
        errs.append(f"height {s} outside 1.1-9.9 and 11-99")
    return h


def scene(sample, errs, key, want, forbid=()):
    sc = sample.get(key) or {}
    d = sc.get("data", {})
    if sc.get("type") != "lancio-orizzontale":
        errs.append(f"{key} is not lancio-orizzontale")
        return d
    for k, val in want.items():
        if d.get(k) != val:
            errs.append(f"{key} {k} = {d.get(k)!r}, expected {val!r}")
    for k in forbid:
        if k in d:
            errs.append(f"{key} gives away {k}")
    return d


def lab(s, unit):
    return f"{s.replace('{,}', ',')} {unit}"


def launched(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(PLACE + r" viene lanciat([ao]) in orizzontale a " + q("m/s") + " " + FROM + " " + q("m") + r"\. (.*)", s)
    if not m:
        errs.append(f"level {sample['level']} text not recognised: {s!r}")
        return None
    body, e, v0s, where, hs, question = m.groups()
    if (e == "a") != (body == "Una pallina"):
        errs.append("agreement")
    v0 = data2(errs, v0s, "speed", Rational(11, 10), Rational(99, 10))
    h = height(errs, hs)
    place_ok(errs, h, body, where)
    tv = sqrt(2 * h / G)
    vy = G * tv
    lvl = sample["level"]
    expected = {1: "Dopo quanto tempo tocca il suolo?", 2: "A che distanza dalla base tocca il suolo?", 4: "Con quale velocità tocca il suolo?", 5: "Quale angolo forma la sua velocità con l'orizzontale quando tocca il suolo?"}[lvl]
    if question != expected:
        errs.append(f"level {lvl} question {question!r}")
        return None
    scene(sample, errs, "scene", {"h": lab(hs, "m"), "v0": lab(v0s, "m/s")}, forbid=("x", "traiettoria"))
    if lvl == 1:
        answer(sample, errs, tv, "s")
    elif lvl == 2:
        answer(sample, errs, v0 * tv, "m")
        d = scene(sample, errs, "solutionScene", {"h": lab(hs, "m"), "v0": lab(v0s, "m/s")})
        path = d.get("traiettoria") or {}
        if abs(float(path.get("h", -1)) - float(h)) > 1e-3 or abs(float(path.get("x", -1)) - float(v0 * tv)) > 1e-3:
            errs.append("solution path does not match")
    elif lvl == 4:
        answer(sample, errs, sqrt(v0**2 + vy**2), "m/s")
    else:
        beta = atan(vy / v0) * 180 / pi
        if not 10 <= beta <= 85:
            errs.append("angle outside 10-85")
        answer_deg(sample, errs, beta)
    return "lancio"


def inverse(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(PLACE + r", lanciat([ao]) in orizzontale " + FROM + " " + q("m") + r", tocca il suolo a " + q("m") + r" dalla base\. Con quale velocità è stat([ao]) lanciat([ao])\?", s):
        body, e, where, hs, xs, e2, e3 = m.groups()
        if not (e == e2 == e3 == ("a" if body == "Una pallina" else "o")):
            errs.append("agreement")
        h = height(errs, hs)
        place_ok(errs, h, body, where)
        x = data2(errs, xs, "range")
        v0 = x / sqrt(2 * h / G)
        answer(sample, errs, v0, "m/s", lo=Rational(1, 2), hi=40)
        scene(sample, errs, "scene", {"h": lab(hs, "m"), "x": lab(xs, "m")}, forbid=("v0", "traiettoria"))
        return "velocita"
    if m := re.fullmatch(PLACE + r", lanciat([ao]) in orizzontale a " + q("m/s") + r" (dal bordo di un tavolo|da un balcone|dalla cima di una scogliera), tocca il suolo a " + q("m") + r" dalla base\. Quanto è (alto il tavolo|alto il balcone|alta la scogliera)\?", s):
        body, e, v0s, where, xs, what = m.groups()
        if (e == "a") != (body == "Una pallina"):
            errs.append("agreement")
        v0 = data2(errs, v0s, "speed", Rational(11, 10), Rational(99, 10))
        x = data2(errs, xs, "range")
        h = G * (x / v0) ** 2 / 2
        answer(sample, errs, h, "m", lo=Rational(1, 2), hi=99)
        # the place follows the rounded answer
        from checkers._fis_forze_movimento import round_sig
        from checkers._vettori import num

        r = round_sig(h, 2)
        if r is not None:
            hr = num(r)
            place_ok(errs, hr, body, where)
            if what.split()[-1] not in where:
                errs.append("the question names another place")
        scene(sample, errs, "scene", {"v0": lab(v0s, "m/s"), "x": lab(xs, "m")}, forbid=("h", "traiettoria"))
        return "altezza"
    errs.append(f"level 3 text not recognised: {s!r}")
    return None


LEVELS = {1: launched, 2: launched, 3: inverse, 4: launched, 5: launched}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
