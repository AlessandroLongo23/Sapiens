"""Checker for fis-equilibrio-punto (specs/exercises/fis-equilibrio-punto.md), written from the spec and the lesson
20-fis-equilibrio-punto.md, not from the generator.

Every problem is read back from its text. The weight is m * 49/5 N; on a level support the reaction is the weight
plus the push of a hand or minus the pull of a thread; the equilibrant has the modulus of the resultant; a body hung
from two threads at the same angle alpha with the horizontal has T = P / (2 sin alpha) (with the angle beta from the
vertical, sin alpha = cos beta); an inclined thread at beta from the vertical and a horizontal one give T = P / cos beta
and F = P tan beta; two threads at a1 and a2 from the horizontal give T1 = P cos a2 / sin(a1 + a2) and
T2 = P cos a1 / sin(a1 + a2); a clothesline holding at most T breaks under the angle arcsin(P / 2T). Trigonometry is
sympy's, exact, evaluated with 60 digits; answers are rounded half up to two significant figures (angles to the
degree) and refused near a boundary. The scenes must draw the data of the text and not the answer.
"""
import re

from sympy import Rational, asin, cos, pi, sin, sqrt, tan

from checkers._vettori import check_choice, common, num, prose, round_deg, round_sig, sig_of

CASE_RANGES = {
    1: {"mano": (0.40, 0.60), "filo": (0.40, 0.60)},
    2: {"due": (0.40, 0.60), "tre": (0.40, 0.60)},
    3: {"orizzontale": (0.40, 0.60), "verticale": (0.40, 0.60)},
    4: {"inclinato": (0.40, 0.60), "orizzontale": (0.40, 0.60)},
    5: {"sinistra": (0.40, 0.60), "destra": (0.40, 0.60)},
}

G = Rational(49, 5)
Q = r"\$(\d+(?:\{,\}\d+)?)\\,\\text\{%s\}\$"
KG, NW = Q % "kg", Q % "N"
ANG = r"\$(\d+)\^\\circ\$"


def rad(d):
    return pi * Rational(d) / 180


def data2(errs, s, what, small_ok=True):
    """A datum with two significant figures, no trailing zero before the comma (11..99 or 1,1..9,9)."""
    if sig_of(s) != 2 or re.fullmatch(r"\d0", s):
        errs.append(f"{what} {s} has not two unambiguous significant figures")
    return num(s)


def answer_n(sample, errs, truth):
    """The right option is truth rounded to two figures, in newton; all four options are forces with two figures."""
    want = round_sig(truth, 2)
    if want is None:
        errs.append(f"{truth.evalf(12)} too close to a rounding boundary, or 100 N or more")
        return
    if truth < 1:
        errs.append("force under 1 N")
    opts = check_choice(sample, errs, f"{want}\\,\\text{{N}}")
    for o in opts:
        m = re.fullmatch(r"(\d+(?:\{,\}\d+)?)\\,\\text\{N\}", o)
        if not m:
            errs.append(f"option {o!r} is not a force in newton")
        elif sig_of(m.group(1)) != 2:
            errs.append(f"option {o!r} has not two significant figures")
    return want


def answer_deg(sample, errs, truth_deg):
    want = round_deg(truth_deg)
    if want is None:
        errs.append("angle too close to a half degree")
        return
    opts = check_choice(sample, errs, f"{want}^\\circ")
    for o in opts:
        if not re.fullmatch(r"\d+\^\\circ", o):
            errs.append(f"option {o!r} is not an angle in whole degrees")


def threads(sample):
    return (sample.get("scene") or {}).get("data", {}).get("fili", [])


def near(a, b):
    return abs(float(a) - float(b)) < 1e-6


# ---------------------------------------------------------------------------


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"(Un libro|Una cassa|Uno scatolone|Una valigia) di " + KG + r" è appoggiat([ao]) su (un tavolo orizzontale|un pavimento orizzontale)\. "
        r"(Una mano (la|lo) preme verso il basso|Un filo verticale (la|lo) tira verso l'alto) con una forza di " + NW + r"(, più piccola del suo peso)?\. Quanto vale la reazione vincolare del piano\?",
        s,
    )
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    fem = m.group(1).startswith("Una")
    pron = m.group(6) or m.group(7)
    if (m.group(3) == "a") != fem or (pron == "la") != fem:
        errs.append("agreement")
    if (m.group(1) == "Un libro") != (m.group(4) == "un tavolo orizzontale"):
        errs.append("a book goes on a table, the others on the floor")
    mass, F = data2(errs, m.group(2), "mass"), data2(errs, m.group(8), "force")
    P = mass * G
    down = m.group(5).startswith("Una mano")
    if down == bool(m.group(9)):
        errs.append("the thread (and only the thread) says it pulls less than the weight")
    if not (Rational(15, 100) * P <= F <= Rational(80, 100) * P):
        errs.append("the force is not between 15% and 80% of the weight")
    answer_n(sample, errs, P + F if down else P - F)
    if sample.get("scene"):
        errs.append("level 1 has no scene")
    return "mano" if down else "filo"


def level2(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Su un punto materiale agiscono una forza di " + NW + r" verso est e una forza di " + NW + r" verso nord\. Quanto vale il modulo della forza equilibrante\?", s):
        F1, F2 = data2(errs, m.group(1), "F1"), data2(errs, m.group(2), "F2")
        forces, x, y, kind = [(F1, 0), (F2, 90)], F1, F2, "due"
    elif m := re.fullmatch(r"Su un punto materiale agiscono tre forze: " + NW + r" verso est, " + NW + r" verso ovest e " + NW + r" verso nord\. Quanto vale il modulo della forza equilibrante\?", s):
        F1, F2, F3 = (data2(errs, m.group(i), f"F{i}") for i in (1, 2, 3))
        if F1 <= F2:
            errs.append("the force to the east must be the larger")
        forces, x, y, kind = [(F1, 0), (F2, 180), (F3, 90)], F1 - F2, F3, "tre"
    else:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    if x < y / 4 or y < x / 4:
        errs.append("one direction is less than a quarter of the other")
    answer_n(sample, errs, sqrt(x**2 + y**2))
    sc = sample.get("scene") or {}
    drawn = [(Rational(str(F["modulo"])), F["angolo"]) for F in sc.get("data", {}).get("forze", [])]
    if sc.get("type") != "punto-forze" or drawn != forces:
        errs.append(f"scene forces {drawn} are not the data {forces}")
    return kind


HUNG = r"(Un lampadario|Un quadro|Un'insegna|Una lampada) di " + KG + r" è appes([ao])"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(HUNG + r" a due fili, che formano ciascuno un angolo di " + ANG + r" con (l'orizzontale|la verticale)\. Quanto vale la tensione di ciascun filo\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    if (m.group(3) == "a") != (m.group(1) in ("Un'insegna", "Una lampada")):
        errs.append("agreement")
    mass, a = data2(errs, m.group(2), "mass"), int(m.group(4))
    if not 15 <= a <= 75:
        errs.append("angle outside 15-75")
    vertical = m.group(5) == "la verticale"
    elev = 90 - a if vertical else a
    answer_n(sample, errs, mass * G / (2 * sin(rad(elev))))
    th = threads(sample)
    rif = "verticale" if vertical else "orizzontale"
    if len(th) != 2 or not near(th[0]["angolo"], 180 - elev) or not near(th[1]["angolo"], elev) or any(t.get("rif") != rif or t.get("testo") != f"{a}°" for t in th):
        errs.append(f"scene threads {th} do not match {a} degrees from the {rif}")
    return "verticale" if vertical else "orizzontale"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Una lampada di " + KG + r" è appesa al soffitto con un filo che forma un angolo di " + ANG + r" con (l'orizzontale|la verticale); un secondo filo, orizzontale e legato alla parete, la tiene scostata\. Quanto vale la tensione del filo (inclinato|orizzontale)\?",
        s,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    mass, a = data2(errs, m.group(1), "mass"), int(m.group(2))
    vertical = m.group(3) == "la verticale"
    beta = a if vertical else 90 - a
    if not 15 <= beta <= 70:
        errs.append("inclined thread outside 15-70 degrees from the vertical")
    P = mass * G
    T, F = P / cos(rad(beta)), P * tan(rad(beta))
    for other in (T, F):
        if round_sig(other, 2) is None:
            errs.append("a tension of the solution is too close to a rounding boundary")
    answer_n(sample, errs, T if m.group(4) == "inclinato" else F)
    th = threads(sample)
    rif = "verticale" if vertical else "orizzontale"
    if len(th) != 2 or not near(th[0]["angolo"], 180) or th[0].get("supporto") != "parete" or not near(th[1]["angolo"], 90 - beta) or th[1].get("rif") != rif or th[1].get("testo") != f"{a}°":
        errs.append(f"scene threads {th} do not match")
    return m.group(4)


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Un lampadario di " + KG + r" è appeso a due fili: quello di sinistra forma un angolo di " + ANG + r" con l'orizzontale, quello di destra un angolo di " + ANG + r"\. Quanto vale la tensione del filo di (sinistra|destra)\?",
        s,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    mass, a1, a2 = data2(errs, m.group(1), "mass"), int(m.group(2)), int(m.group(3))
    if not (20 <= a1 <= 75 and 20 <= a2 <= 75 and abs(a1 - a2) >= 10):
        errs.append("angles outside 20-75 or less than 10 degrees apart")
    P = mass * G
    den = sin(rad(a1 + a2))
    T1, T2 = P * cos(rad(a2)) / den, P * cos(rad(a1)) / den
    # the two tensions must balance: horizontal and vertical components
    if abs((T1 * cos(rad(a1)) - T2 * cos(rad(a2))).evalf(40)) > 1e-30 or abs((T1 * sin(rad(a1)) + T2 * sin(rad(a2)) - P).evalf(40)) > 1e-30:
        errs.append("tensions do not balance")
    for other in (T1, T2):
        if round_sig(other, 2) is None:
            errs.append("a tension of the solution is too close to a rounding boundary")
    answer_n(sample, errs, T1 if m.group(4) == "sinistra" else T2)
    th = threads(sample)
    if len(th) != 2 or not near(th[0]["angolo"], 180 - a1) or not near(th[1]["angolo"], a2) or th[0].get("testo") != f"{a1}°" or th[1].get("testo") != f"{a2}°":
        errs.append(f"scene threads {th} do not match")
    return m.group(4)


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Un filo per stendere regge al massimo una tensione di " + NW + r"\. Al centro si appende (una borsa|un secchio|un asciugamano bagnato|un cappotto) di " + KG + r"\. Qual è l'angolo più piccolo che i due tratti del filo possono formare con l'orizzontale\?",
        s,
    )
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    T, mass = data2(errs, m.group(1), "tension"), data2(errs, m.group(3), "mass")
    ratio = mass * G / (2 * T)
    if not (sin(rad(4)) <= ratio <= sin(rad(40))):
        errs.append("angle outside 4-40 degrees")
    answer_deg(sample, errs, asin(ratio) * 180 / pi)
    th = threads(sample)
    if len(th) != 2 or any(t.get("testo") != "α" for t in th):
        errs.append("the scene must mark the unknown angle as alpha")
    return "angolo"


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
    if lvl >= 3 and sample.get("scene", {}).get("type") != "fili-corpo":
        errs.append("levels 3-6 draw the threads")
    # no scene gives the answer away: the problem scene has no forces
    if lvl >= 3 and "forze" in sample.get("scene", {}).get("data", {}):
        errs.append("the problem scene draws forces")
    return errs, kind
