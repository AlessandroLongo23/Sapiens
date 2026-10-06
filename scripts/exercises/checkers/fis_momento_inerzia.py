"""Checker for fis-momento-inerzia (specs/exercises/fis-momento-inerzia.md), written from the spec and the lesson
87-fis-momento-inerzia.md, not from the generator.

I = m r^2 for a point mass and the sum for several; the distances are taken from the axis; the table of the lesson
(disc 1/2 M R^2, ring M R^2, full sphere 2/5 M R^2, rod 1/12 M L^2 through the centre and 1/3 M L^2 through an end);
Huygens-Steiner I = I_cm + M d^2; the parts of a body add up. Exact rationals, answers rounded half up to two
significant figures. Levels 2 and 3 carry the scene `masse-asse`, checked against the text.
"""
import re

from checkers._fis_rotazioni import Q, Rational, answer, common, data2, prose

U = "kg·m^2"
END = r" Quanto vale il suo momento d'inerzia rispetto a questo asse\?"

CASE_RANGES = {
    1: {"m": (0.40, 0.60), "cm": (0.40, 0.60)},
    2: {"due": (0.40, 0.60), "tre": (0.40, 0.60)},
    3: {"su una sfera": (0.40, 0.60), "interno": (0.40, 0.60)},
    4: {k: (0.13, 0.27) for k in ("disco", "anello", "sfera", "asta centro", "asta estremo")},
    5: {k: (0.18, 0.32) for k in ("disco", "anello", "sfera", "asta")},
    6: {"giostra": (0.40, 0.60), "manubrio": (0.40, 0.60)},
}


def tenth(errs, s, what, lo, hi):
    """A length that is a whole number of tenths of a metre, written with two significant figures."""
    x = data2(errs, s, what, lo, hi)
    if (x * 10).q != 1:
        errs.append(f"{what} {s} is not a whole number of tenths")
    return x


def comma(x):
    """A scene's value as the exercises write it: 0,40 or 1,2 (two significant figures)."""
    return s2(x).replace(".", ",")


def s2(x):
    x = Rational(x)
    return f"{float(x):.2f}" if x < 1 else f"{float(x):.1f}"


def scene(sample, errs, length, axis, masses, quotes):
    sc = sample.get("scene")
    if not sc or sc.get("type") != "masse-asse":
        errs.append("scene masse-asse missing")
        return
    d = sc["data"]
    if Rational(str(d["lunghezza"])) != length or Rational(str(d["asse"])) != axis:
        errs.append("scene: rod or axis not as in the text")
    got = [(Rational(str(m["x"])), m["valore"]) for m in d["masse"]]
    if got != [(x, comma_mass(v)) for x, v in masses]:
        errs.append(f"scene: masses {got} not as in the text")
    gq = sorted((Rational(str(q["da"])), Rational(str(q["a"])), q["testo"]) for q in d["quote"])
    if gq != sorted((a, b, comma(abs(b - a)) + " m") for a, b in quotes):
        errs.append(f"scene: distances {gq} not as in the text")
    if not sc.get("alt"):
        errs.append("scene without alt")


def comma_mass(tex):
    return tex.replace("{,}", ",") + " kg"


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una pallina di massa " + Q("kg") + r" è fissata all'estremità di un'asticella leggera e gira a \$(\d+(?:\{,\}\d+)?)\\,\\text\{(m|cm)\}\$ dall'asse di rotazione\. Quanto vale il suo momento d'inerzia rispetto all'asse\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    mass = data2(errs, m.group(1), "m", 0.11, 9.9)
    cm = m.group(3) == "cm"
    r = data2(errs, m.group(2), "r", 11, 99) / 100 if cm else data2(errs, m.group(2), "r", 0.11, 2.0)
    I = mass * r**2
    if I < Rational(1, 1000):
        errs.append("moment of inertia under 0,001")
    answer(sample, errs, I, U)
    return "cm" if cm else "m"


def level2(sample, errs):
    s = prose(sample["problem"])
    tail = r" dall'asse\. Quanto vale il momento d'inerzia del sistema rispetto all'asse\?"
    mid = " sono fissate a un'asta leggera perpendicolare all'asse di rotazione, a "
    if m := re.fullmatch("Due sfere di massa " + Q("kg") + " e " + Q("kg") + mid + Q("m") + " e a " + Q("m") + tail, s):
        ms, rs, kind = [m.group(1), m.group(2)], [m.group(3), m.group(4)], "due"
    elif m := re.fullmatch("Tre sfere di massa " + Q("kg") + ", " + Q("kg") + " e " + Q("kg") + mid + Q("m") + ", " + Q("m") + " e " + Q("m") + tail, s):
        ms, rs, kind = [m.group(1), m.group(2), m.group(3)], [m.group(4), m.group(5), m.group(6)], "tre"
    else:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    M = [data2(errs, x, "m", 0.5, 9.9) for x in ms]
    R = [tenth(errs, x, "r", 0.2, 2.2) for x in rs]
    if R[0] == R[1]:
        errs.append("the first two distances are equal")
    if kind == "tre" and R[2] < R[1] + Rational(3, 10):
        errs.append("the third sphere is not beyond the second")
    answer(sample, errs, sum(a * b**2 for a, b in zip(M, R)), U)
    # the first sphere on one side of the axis, the others on the other side
    xs = [Rational(0)] + [R[0] + r for r in R[1:]]
    scene(sample, errs, R[0] + R[-1], R[0], list(zip(xs, ms)), [(Rational(0), R[0])] + [(R[0], R[0] + r) for r in R[1:]])
    return kind


def level3(sample, errs):
    s = prose(sample["problem"])
    head = "Due sfere di massa " + Q("kg") + " e " + Q("kg") + " sono fissate alle estremità di un'asta leggera lunga " + Q("m") + r"\. L'asse di rotazione è perpendicolare all'asta e passa "
    tail = r" Quanto vale il momento d'inerzia del sistema rispetto all'asse\?"
    if m := re.fullmatch(head + r"per la prima sfera\." + tail, s):
        d, kind = Rational(0), "su una sfera"
    elif m := re.fullmatch(head + "a " + Q("m") + r" dalla prima sfera\." + tail, s):
        d, kind = tenth(errs, m.group(4), "d", 0.1, 1.9), "interno"
    else:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    m1, m2 = data2(errs, m.group(1), "m1", 0.5, 9.9), data2(errs, m.group(2), "m2", 0.5, 9.9)
    L = tenth(errs, m.group(3), "L", 0.6, 2.0)
    if kind == "interno" and (d >= L or 2 * d == L):
        errs.append("axis outside the rod, or at its centre")
    answer(sample, errs, m1 * d**2 + m2 * (L - d) ** 2, U)
    quotes = [(Rational(0), L)] + ([(Rational(0), d)] if d else [])
    scene(sample, errs, L, d, [(Rational(0), m.group(1)), (L, m.group(2))], quotes)
    return kind


TABLE = [
    ("disco", "Un disco pieno di massa " + Q("kg") + " e raggio " + Q("m") + r" ruota attorno al suo asse\.", Rational(1, 2), (0.11, 0.99)),
    ("anello", "Un anello sottile di massa " + Q("kg") + " e raggio " + Q("m") + r" ruota attorno al suo asse\.", Rational(1), (0.11, 0.99)),
    ("sfera", "Una sfera piena di massa " + Q("kg") + " e raggio " + Q("m") + r" ruota attorno a un asse che passa per il suo centro\.", Rational(2, 5), (0.11, 0.99)),
    ("asta centro", "Un'asta sottile di massa " + Q("kg") + " e lunga " + Q("m") + r" ruota attorno a un asse perpendicolare che passa per il suo centro\.", Rational(1, 12), (0.5, 2.0)),
    ("asta estremo", "Un'asta sottile di massa " + Q("kg") + " e lunga " + Q("m") + r" ruota attorno a un asse perpendicolare che passa per un suo estremo\.", Rational(1, 3), (0.5, 2.0)),
]


def level4(sample, errs):
    s = prose(sample["problem"])
    for kind, pattern, k, (lo, hi) in TABLE:
        if m := re.fullmatch(pattern + END, s):
            M, x = data2(errs, m.group(1), "M", 0.5, 9.9), data2(errs, m.group(2), "size", lo, hi)
            I = k * M * x**2
            if I < Rational(1, 1000):
                errs.append("moment of inertia under 0,001")
            answer(sample, errs, I, U)
            return kind
    errs.append(f"level 4 text not recognised: {s!r}")
    return None


SHIFTED = [
    ("disco", "Un disco pieno di massa " + Q("kg") + " e raggio " + Q("m") + r" ruota attorno a un asse perpendicolare al disco che passa per un punto del bordo\.", Rational(1, 2)),
    ("anello", "Un anello sottile di massa " + Q("kg") + " e raggio " + Q("m") + r" ruota attorno a un asse perpendicolare al suo piano che passa per un punto dell'anello\.", Rational(1)),
    ("sfera", "Una sfera piena di massa " + Q("kg") + " e raggio " + Q("m") + r" ruota attorno a un asse tangente alla sua superficie\.", Rational(2, 5)),
]


def level5(sample, errs):
    s = prose(sample["problem"])
    for kind, pattern, k in SHIFTED:
        if m := re.fullmatch(pattern + END, s):
            M, R = data2(errs, m.group(1), "M", 0.5, 9.9), data2(errs, m.group(2), "R", 0.11, 0.99)
            I = k * M * R**2 + M * R**2
            if I < Rational(1, 1000):
                errs.append("moment of inertia under 0,001")
            answer(sample, errs, I, U)
            return kind
    m = re.fullmatch("Un'asta sottile di massa " + Q("kg") + " e lunga " + Q("m") + " ruota attorno a un asse perpendicolare che passa a " + Q("m") + r" dal suo centro\." + END, s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    M, L, d = data2(errs, m.group(1), "M", 0.5, 9.9), tenth(errs, m.group(2), "L", 0.6, 2.0), tenth(errs, m.group(3), "d", 0.1, 0.9)
    if 2 * d >= L:
        errs.append("axis at the end of the rod or outside it")
    answer(sample, errs, M * L**2 / 12 + M * d**2, U)
    return "asta"


def level6(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch("La piattaforma di una giostra è un disco pieno di massa " + Q("kg") + " e raggio " + Q("m") + ", che gira attorno al suo asse. Un bambino di " + Q("kg") + " è seduto a " + Q("m") + r" dal centro\. Quanto vale il momento d'inerzia della giostra con il bambino\?", s):
        M, R, mb, r = data2(errs, m.group(1), "M", 41, 99), data2(errs, m.group(2), "R", 1.1, 1.6), data2(errs, m.group(3), "m", 11, 45), data2(errs, m.group(4), "r", 0.5, 1.6)
        if r > R:
            errs.append("the child sits outside the platform")
        answer(sample, errs, M * R**2 / 2 + mb * r**2, U)
        return "giostra"
    m = re.fullmatch("Un manubrio è fatto di un'asta sottile di massa " + Q("kg") + " e lunga " + Q("m") + ", con due sfere di " + Q("kg") + r" ciascuna alle estremità\. Ruota attorno a un asse perpendicolare all'asta che passa per il suo centro\. Quanto vale il suo momento d'inerzia\?", s)
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    M, L, ms = data2(errs, m.group(1), "M", 0.5, 5.0), tenth(errs, m.group(2), "L", 0.6, 2.0), data2(errs, m.group(3), "m", 0.5, 9.9)
    if (L * 5).q != 1:
        errs.append("half the rod is not a whole number of tenths")
    answer(sample, errs, M * L**2 / 12 + 2 * ms * (L / 2) ** 2, U)
    return "manubrio"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


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
