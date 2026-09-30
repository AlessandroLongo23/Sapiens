"""Checker for fis-equilibrio-piano-inclinato (specs/exercises/fis-equilibrio-piano-inclinato.md), written from the
spec and the lesson 21-fis-equilibrio-piano-inclinato.md, not from the generator.

On a plane inclined at alpha the weight P = m * 49/5 N splits into P sin(alpha) along the plane and P cos(alpha)
against it; with the length l and the height h, sin(alpha) = h / l and the base is sqrt(l^2 - h^2). On a smooth plane
a thread parallel to it pulls with P h / l and the plane pushes with P b / l. A body stays on a rough plane while
tan(alpha) <= mu_s, and then the friction is P sin(alpha); when it slides the friction is mu_d P cos(alpha). The limit
angle has tan = mu_s. Exact trigonometry with sympy, answers rounded half up to two significant figures (angles to the
degree) and refused near a boundary; the scene draws the data, never the answer.
"""
import re

from sympy import Rational, asin, atan, cos, pi, sin, sqrt, tan

from checkers._vettori import check_choice, common, num, prose, round_deg, round_sig, sig_of

CASE_RANGES = {
    1: {"parallela": (0.40, 0.60), "perpendicolare": (0.40, 0.60)},
    2: {"tensione": (0.40, 0.60), "reazione": (0.40, 0.60)},
    4: {"angolo": (0.40, 0.60), "coefficiente": (0.40, 0.60)},
    5: {"fermo": (0.40, 0.60), "scivola": (0.40, 0.60)},
}

G = Rational(49, 5)
Q = r"\$(\d+(?:\{,\}\d+)?)\\,\\text\{%s\}\$"
KG, NW, M = Q % "kg", Q % "N", Q % "m"
ANG = r"\$(\d+)\^\\circ\$"
BODY = r"(Una cassa|Uno scatolone|Un blocco di legno|Una valigia)"
MU = r"\$\\mu_([sd]) = (0\{,\}\d\d)\$"


def rad(d):
    return pi * Rational(d) / 180


def fem(errs, body, *endings):
    f = body.startswith("Una")
    if any((e == "a") != f for e in endings):
        errs.append("agreement")


def data2(errs, s, what):
    if sig_of(s) != 2 or re.fullmatch(r"\d0", s):
        errs.append(f"{what} {s} has not two unambiguous significant figures")
    return num(s)


def answer(sample, errs, truth, unit="N"):
    want = round_sig(truth, 2)
    if want is None:
        errs.append(f"{truth.evalf(12)} too close to a rounding boundary, or too large")
        return
    if unit == "N" and truth < 1:
        errs.append("force under 1 N")
    right = f"{want}\\,\\text{{N}}" if unit else want
    for o in check_choice(sample, errs, right):
        m = re.fullmatch(r"(\d+(?:\{,\}\d+)?)" + (r"\\,\\text\{N\}" if unit else ""), o)
        if not m or sig_of(m.group(1)) != 2:
            errs.append(f"option {o!r} is not written like the answer")


def answer_deg(sample, errs, deg):
    want = round_deg(deg)
    if want is None:
        errs.append("angle too close to a half degree")
        return
    for o in check_choice(sample, errs, f"{want}^\\circ"):
        if not re.fullmatch(r"\d+\^\\circ", o):
            errs.append(f"option {o!r} is not an angle")


def scene_angle(sample, errs, deg, text=None):
    d = (sample.get("scene") or {}).get("data", {})
    if (sample.get("scene") or {}).get("type") != "piano-inclinato":
        errs.append("no inclined plane scene")
        return d
    if abs(float(d.get("angolo", -1)) - float(deg)) > 1e-3:
        errs.append(f"scene angle {d.get('angolo')} is not {float(deg)}")
    if text is not None and d.get("testoAngolo") != text:
        errs.append(f"scene angle text {d.get('testoAngolo')!r}")
    if "forze" in d:
        errs.append("the problem scene draws forces")
    return d


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BODY + " di " + KG + r" è appoggiat([ao]) su un piano inclinato di " + ANG + r"\. Quanto vale la componente del peso (parallela|perpendicolare) al piano\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    fem(errs, m.group(1), m.group(3))
    mass, a = data2(errs, m.group(2), "mass"), int(m.group(4))
    if not 10 <= a <= 70:
        errs.append("angle outside 10-70")
    P = mass * G
    answer(sample, errs, P * (sin(rad(a)) if m.group(5) == "parallela" else cos(rad(a))))
    scene_angle(sample, errs, a, f"{a}°")
    return m.group(5)


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        BODY + " di " + KG + r" è ferm([ao]) su un piano inclinato liscio, lungo " + M + " e alto " + M + r", tenut([ao]) da un filo parallelo al piano\. Quanto vale (la tensione del filo|la reazione vincolare del piano)\?",
        s,
    )
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    fem(errs, m.group(1), m.group(3), m.group(6))
    mass, l, h = data2(errs, m.group(2), "mass"), data2(errs, m.group(4), "length"), data2(errs, m.group(5), "height")
    if not Rational(15, 100) * l <= h <= Rational(85, 100) * l:
        errs.append("height not between 15% and 85% of the length")
    P = mass * G
    tension = m.group(7) == "la tensione del filo"
    answer(sample, errs, P * h / l if tension else P * sqrt(l**2 - h**2) / l)
    d = scene_angle(sample, errs, asin(h / l) * 180 / pi)
    if d.get("altezza") != f"{m.group(5).replace('{,}', ',')} m" or d.get("lunghezza") != f"{m.group(4).replace('{,}', ',')} m" or d.get("filo") is not True:
        errs.append("scene labels do not match the data")
    return "tensione" if tension else "reazione"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BODY + " di " + KG + r" è tenut([ao]) ferm([ao]) su un piano inclinato liscio da un filo parallelo al piano, con una tensione di " + NW + r"\. Quanto vale l'inclinazione del piano\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    fem(errs, m.group(1), m.group(3), m.group(4))
    mass, F = data2(errs, m.group(2), "mass"), data2(errs, m.group(5), "tension")
    ratio = F / (mass * G)
    if not sin(rad(8)) <= ratio <= sin(rad(70)):
        errs.append("inclination outside 8-70")
    answer_deg(sample, errs, asin(ratio) * 180 / pi)
    # the angle is the answer: the scene draws a generic 25 degrees marked alpha
    scene_angle(sample, errs, 25, "α")
    return "angolo"


def level4(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Tra un blocco e un'asse di legno il coefficiente di attrito statico è " + MU + r"\. Si inclina l'asse sempre di più\. A quale inclinazione il blocco comincia a scivolare\?", s):
        mu = num(m.group(2))
        if m.group(1) != "s" or not Rational(1, 10) <= mu <= Rational(9, 10):
            errs.append("coefficient")
        answer_deg(sample, errs, atan(mu) * 180 / pi)
        if sample.get("scene"):
            errs.append("no scene when the angle is asked")
        return "angolo"
    if m := re.fullmatch(r"Un libro è appoggiato su un'asse di legno, che viene inclinata sempre di più\. Il libro comincia a scivolare quando l'asse forma un angolo di " + ANG + r" con l'orizzontale\. Quanto vale il coefficiente di attrito statico\?", s):
        a = int(m.group(1))
        if not 6 <= a <= 40:
            errs.append("angle outside 6-40")
        answer(sample, errs, tan(rad(a)), unit="")
        scene_angle(sample, errs, a, f"{a}°")
        return "coefficiente"
    errs.append(f"level 4 text not recognised: {s!r}")
    return None


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BODY + " di " + KG + r" è appoggiat([ao]) su un piano inclinato di " + ANG + ", con " + MU + " e " + MU + r"\. Quanto vale la forza di attrito\?", s)
    if not m or m.group(5) != "s" or m.group(7) != "d":
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    fem(errs, m.group(1), m.group(3))
    mass, a, mus, mud = data2(errs, m.group(2), "mass"), int(m.group(4)), num(m.group(6)), num(m.group(8))
    if not (10 <= a <= 50 and Rational(2, 10) <= mus <= Rational(9, 10) and Rational(1, 10) <= mud <= mus - Rational(5, 100)):
        errs.append("data outside the ranges")
    P = mass * G
    t = tan(rad(a))
    scene_angle(sample, errs, a, f"{a}°")
    if t <= Rational(9, 10) * mus:
        answer(sample, errs, P * sin(rad(a)))
        return "fermo"
    if t >= Rational(11, 10) * mus:
        answer(sample, errs, mud * P * cos(rad(a)))
        return "scivola"
    errs.append("tan(alpha) too close to mu_s")
    return None


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


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
