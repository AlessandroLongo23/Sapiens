"""Checker for riflessione (specs/exercises/riflessione.md).

Written from the spec and the lesson (docs/lezioni/fisica/riscritte/32-riflessione.md). The problem is read back
from its text and solved again: r = i with the angles from the normal, the image as far behind the mirror as the
object is in front, the mirror from half the eyes' height to half-way between eyes and head, and for two mirrors
the reflection is traced with vectors (not with the triangle of the lesson) and the angle of incidence on the second
mirror measured from its normal. Lengths are exact (sympy Rational). The scenes are measured too: the incident ray
at the angle of the text, the mirrors at the angle of the text, the person where the text puts it, and in the
solution every reflected ray obeys r = i.
"""
import math
import re

from sympy import Rational

from checkers._vettori import check_choice, common, num, parse_option, prose

CASE_RANGES = {
    1: {"i < 45": (0.35, 0.65), "i > 45": (0.35, 0.65)},
    2: {"i < 45": (0.35, 0.65), "i > 45": (0.35, 0.65)},
    3: {"distanza": (0.40, 0.60), "avvicinamento": (0.40, 0.60)},
    4: {"lunghezza": (0.25, 0.42), "bordo inferiore": (0.25, 0.42), "bordo superiore": (0.25, 0.42)},
}

M = r"\$(\d+\{,\}\d+)\\,\\text\{m\}\$"


def els(sc, kind):
    return [e for e in sc["data"]["elementi"] if e["tipo"] == kind]


def angle_deg(v):
    return math.degrees(math.atan2(v[1], v[0]))


def between(u, w):
    c = (u[0] * w[0] + u[1] * w[1]) / (math.hypot(*u) * math.hypot(*w))
    return math.degrees(math.acos(max(-1, min(1, c))))


def deg_options(sample, errs, right):
    check_choice(sample, errs, f"{right}^\\circ")
    for o in sample["answer"]["options"]:
        m = re.fullmatch(r"(\d+)\^\\circ", o["latex"])
        if not m or not 0 < int(m.group(1)) < 180:
            errs.append(f"angle option {o['latex']!r}")


def m_options(sample, errs, right, places):
    check_choice(sample, errs, f"{fixed(right, places)}\\,\\text{{m}}")
    for o in sample["answer"]["options"]:
        v, u, extra = parse_option(o["latex"])
        if u != "m" or extra or len(v.split("{,}")[-1]) != places or "{,}" not in v:
            errs.append(f"length option {o['latex']!r}")


def fixed(x, places):
    q = Rational(x) * 10**places
    if q.q != 1:
        raise ValueError(f"{x} not exact to {places} places")
    s = str(abs(int(q))).rjust(places + 1, "0")
    return ("-" if x < 0 else "") + s[:-places] + "{,}" + s[-places:]


def one_mirror(s, sample, errs, lvl):
    if lvl == 1:
        m = re.fullmatch(r"Un raggio di luce colpisce uno specchio piano con un angolo di incidenza di \$(\d+)\^\\circ\$\. Quanto è ampio l'angolo tra il raggio incidente e il raggio riflesso\?", s)
    else:
        m = re.fullmatch(r"Un raggio di luce forma un angolo di \$(\d+)\^\\circ\$ con la superficie di uno specchio piano\. Quanto vale l'angolo di riflessione\?", s)
    if not m:
        errs.append(f"level {lvl} text: {s!r}")
        return None
    a = int(m.group(1))
    i = a if lvl == 1 else 90 - a
    if not 15 <= a <= 75 or a == 45:
        errs.append("angle out of range")
    deg_options(sample, errs, 2 * i if lvl == 1 else i)
    rays = els(sample["scene"], "raggio")
    if len(rays) != 1:
        errs.append("the problem scene must have only the incident ray")
    else:
        d = (rays[0]["da"][0] - rays[0]["a"][0], rays[0]["da"][1] - rays[0]["a"][1])  # towards the source
        if abs(between(d, (0, 1)) - i) > 0.1:
            errs.append("scene ray at the wrong angle")
    texts = [e["testo"] for e in els(sample["scene"], "angolo")]
    if texts != [f"{a}°"]:
        errs.append(f"scene angle {texts}")
    sol = els(sample["solutionScene"], "raggio")
    if len(sol) != 2:
        errs.append("solution rays")
    else:
        out = (sol[1]["a"][0] - sol[1]["da"][0], sol[1]["a"][1] - sol[1]["da"][1])
        if abs(between(out, (0, 1)) - i) > 0.1 or out[0] * (sol[0]["da"][0]) > 0:
            errs.append("the reflected ray breaks r = i")
    return "i < 45" if i < 45 else "i > 45"


def plane_image(s, sample, errs):
    m = re.fullmatch(r"Sei a " + M + r" da uno specchio piano verticale e fai un passo di " + M + r" verso lo specchio\. (Quanto dista, adesso, la tua immagine da te\?|Di quanto si è avvicinata a te la tua immagine\?)", s)
    if not m:
        errs.append(f"level 3 text: {s!r}")
        return None
    d, x = num(m.group(1)), num(m.group(2))
    if not 0 < x < d:
        errs.append("step longer than the distance")
    dist = m.group(3).startswith("Quanto")
    m_options(sample, errs, 2 * (d - x) if dist else 2 * x, 1)
    s_ = Rational(str(sample["params"]["s"]))
    p = els(sample["scene"], "persona")
    if len(p) != 1 or abs(Rational(str(p[0]["piede"][0])) + d * s_) > Rational(1, 100):
        errs.append("scene person misplaced")
    ps = els(sample["solutionScene"], "persona")
    real = [e for e in ps if not e.get("virtuale")]
    virt = [e for e in ps if e.get("virtuale")]
    if len(real) != 1 or len(virt) != 1 or abs(Rational(str(real[0]["piede"][0])) + (d - x) * s_) > Rational(1, 100) or abs(Rational(str(virt[0]["piede"][0])) - (d - x) * s_) > Rational(1, 100):
        errs.append("solution: the image is not symmetric")
    return "distanza" if dist else "avvicinamento"


def shortest(s, sample, errs):
    m = re.fullmatch(r"Una persona alta " + M + r" ha gli occhi a " + M + r" da terra e sta a " + M + r" da uno specchio verticale appeso al muro\. (.+)", s)
    qs = {
        "Quanto deve essere lungo, al minimo, lo specchio perché si veda per intero?": "lunghezza",
        "A quale altezza da terra deve stare, al massimo, il bordo inferiore dello specchio perché si veda i piedi?": "bordo inferiore",
        "A quale altezza da terra deve arrivare, almeno, il bordo superiore dello specchio perché si veda la cima della testa?": "bordo superiore",
    }
    if not m or m.group(4) not in qs:
        errs.append(f"level 4 text: {s!r}")
        return None
    H, E = num(m.group(1)), num(m.group(2))
    if not Rational(1) < E < H < 2:
        errs.append("heights")
    case = qs[m.group(4)]
    low, high = E / 2, (H + E) / 2
    m_options(sample, errs, {"lunghezza": high - low, "bordo inferiore": low, "bordo superiore": high}[case], 2)
    if high - low != H / 2:
        errs.append("the mirror is not half the height")
    s_ = Rational(str(sample["params"]["s"]))
    if els(sample["scene"], "specchio") or els(sample["scene"], "raggio"):
        errs.append("the problem scene shows the mirror")
    mir = els(sample["solutionScene"], "specchio")
    if len(mir) != 1:
        errs.append("solution mirror")
    else:
        if mir[0]["da"][0] != 0 or mir[0]["a"][0] != 0:
            errs.append("solution mirror not on the wall")
        ys = sorted(Rational(str(mir[0][k][1])) for k in ("da", "a"))
        if abs(ys[0] - low * s_) > Rational(1, 100) or abs(ys[1] - high * s_) > Rational(1, 100):
            errs.append("solution mirror misplaced")
    rays = els(sample["solutionScene"], "raggio")
    for a, b in zip(rays[0::2], rays[1::2]):
        inc = (a["a"][0] - a["da"][0], a["a"][1] - a["da"][1])
        out = (b["a"][0] - b["da"][0], b["a"][1] - b["da"][1])
        if abs(between((-inc[0], -inc[1]), (-1, 0)) - between(out, (-1, 0))) > 0.3:
            errs.append("a ray breaks r = i on the mirror")
    return case


def two_mirrors(s, sample, errs):
    m = re.fullmatch(r"Due specchi piani formano un angolo di \$(\d+)\^\\circ\$\. Un raggio colpisce il primo specchio con un angolo di incidenza di \$(\d+)\^\\circ\$ e, riflesso, va a colpire il secondo\. Con quale angolo di incidenza\?", s)
    if not m:
        errs.append(f"level 5 text: {s!r}")
        return None
    beta, i1 = int(m.group(1)), int(m.group(2))
    # Trace: first mirror on the x axis, the ray comes down towards -x; second mirror from the origin at beta.
    d = (-math.sin(math.radians(i1)), -math.cos(math.radians(i1)))
    r = (d[0], -d[1])
    u = (math.cos(math.radians(beta)), math.sin(math.radians(beta)))
    n = (-u[1], u[0])
    g = between(r, u)
    i2 = 90 - min(g, 180 - g)
    i2 = round(i2, 6)
    if abs(i2 - round(i2)) > 1e-6:
        errs.append("i2 not whole")
    right = int(round(i2))
    if right < 10:
        errs.append("i2 too small")
    deg_options(sample, errs, right)
    sc = sample["scene"]
    mirrors = els(sc, "specchio")
    dirs = sorted(round(angle_deg((e["da"][0] - e["a"][0], e["da"][1] - e["a"][1])) % 360, 1) if e["a"] == [0, 0] else round(angle_deg((e["a"][0] - e["da"][0], e["a"][1] - e["da"][1])) % 360, 1) for e in mirrors)
    if len(mirrors) != 2 or abs(dirs[0]) > 0.1 or abs(dirs[1] - beta) > 0.1:
        errs.append(f"scene mirrors at {dirs}")
    rays = els(sc, "raggio")
    if len(rays) != 1 or abs(between((rays[0]["da"][0] - rays[0]["a"][0], rays[0]["da"][1] - rays[0]["a"][1]), (0, 1)) - i1) > 0.1:
        errs.append("scene incident ray")
    sol = els(sample["solutionScene"], "raggio")
    if len(sol) != 3:
        errs.append("solution rays")
    else:
        pq = (sol[1]["a"][0] - sol[1]["da"][0], sol[1]["a"][1] - sol[1]["da"][1])
        out = (sol[2]["a"][0] - sol[2]["da"][0], sol[2]["a"][1] - sol[2]["da"][1])
        Q = sol[1]["a"]
        if abs(Q[0] * u[1] - Q[1] * u[0]) > 0.01:
            errs.append("the reflected ray does not end on the second mirror")
        nn = n if n[0] * pq[0] + n[1] * pq[1] < 0 else (-n[0], -n[1])
        if abs(between((-pq[0], -pq[1]), nn) - right) > 0.2 or abs(between(out, nn) - right) > 0.2:
            errs.append("second reflection breaks r = i")
    return None


def same_mirrors(sample, errs):
    """The mirrors of the problem are drawn again, unchanged, in the solution."""
    a = sorted(json_key(e) for e in els(sample["scene"], "specchio"))
    b = sorted(json_key(e) for e in els(sample["solutionScene"], "specchio"))
    if a and a != b:
        errs.append("the solution moves the mirrors")


def json_key(e):
    return (tuple(e["da"]), tuple(e["a"]))


def check(sample):
    errs = []
    lvl = sample.get("level")
    if lvl not in (1, 2, 3, 4, 5):
        return [f"unknown level {lvl}"], None
    common(sample, errs)
    if not sample.get("scene") or not sample.get("solutionScene"):
        return errs + ["scene missing"], None
    try:
        s = prose(sample["problem"])
        if lvl <= 2:
            kind = one_mirror(s, sample, errs, lvl)
        elif lvl == 3:
            kind = plane_image(s, sample, errs)
        elif lvl == 4:
            kind = shortest(s, sample, errs)
        else:
            kind = two_mirrors(s, sample, errs)
        if lvl != 4:
            same_mirrors(sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
