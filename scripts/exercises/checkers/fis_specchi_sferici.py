"""Checker for fis-specchi-sferici (specs/exercises/fis-specchi-sferici.md).

Written from the spec and the lesson (docs/lezioni/fisica/riscritte/33-fis-specchi-sferici.md), not from the
generator. Every problem is read back from its text and solved with exact fractions (sympy Rational) and the
lesson's convention: 1/p + 1/q = 1/f, p > 0, q > 0 real and < 0 virtual, f > 0 concave and f = -R/2 convex,
G = -q/p. Every result must be exact (no rounding), the right option must be exactly that value with its unit.
The problem scene must draw the mirror of the right kind and the object at -p*k (k, the drawing scale, is in
params), the focus and the centre where the text gives them, and no image; the solution scene must draw the image
at -q*k with height G*0.7, and every reflected ray (or its backward extension) must pass through the tip of it.
"""
import re

from sympy import Rational

from checkers._vettori import check_choice, common, fmt_exact, num, parse_option, prose

CASE_RANGES = {
    1: {"fuoco": (0.40, 0.60), "raggio": (0.40, 0.60)},
    6: {"reale": (0.25, 0.42), "virtuale ingrandita": (0.25, 0.42), "virtuale rimpicciolita": (0.25, 0.42)},
}

H = Rational(7, 10)
Q = r"\$(-?\d+(?:\{,\}\d+)?)\\,\\text\{cm\}\$"
SIZES = {
    "alta il doppio dell'oggetto": Rational(2),
    "alta il triplo dell'oggetto": Rational(3),
    "alta quattro volte l'oggetto": Rational(4),
    "alta la metà dell'oggetto": Rational(1, 2),
    "alta un terzo dell'oggetto": Rational(1, 3),
    "alta un quarto dell'oggetto": Rational(1, 4),
}


def cm(x, extra=None):
    s = fmt_exact(x) + "\\,\\text{cm}"
    return s + (f"\\ \\text{{{extra}}}" if extra else "")


def fixed1(x):
    q = Rational(x) * 10
    if q.q != 1:
        raise ValueError(f"{x} not to the millimetre")
    s = str(int(q)).rjust(2, "0")
    return s[:-1] + "{,}" + s[-1]


def is_exact(x, places=1):
    return (Rational(x) * 10**places).q == 1


def els(sc, kind):
    return [e for e in sc["data"]["elementi"] if e["tipo"] == kind]


def near(a, b, tol=Rational(1, 100)):
    return abs(Rational(str(a)) - Rational(b)) <= tol


def check_units(sample, errs, extras=False):
    for o in sample["answer"]["options"]:
        v, u, extra = parse_option(o["latex"])
        if u != "cm":
            errs.append(f"unit {u}")
        if bool(extra) != extras:
            errs.append(f"option extra {o['latex']!r}")
        if not is_exact(num(v)):
            errs.append(f"option {v} not to the millimetre")


def check_scene(sample, errs, p, f, k, show_f, show_c, solution_only=False):
    concave = f > 0

    def base(sc, label):
        mir = els(sc, "sferico")
        if len(mir) != 1 or mir[0]["concavo"] != concave:
            errs.append(f"{label}: mirror kind")
        obj = els(sc, "oggetto")
        if len(obj) != 1 or not near(obj[0]["piede"][0], -p * k) or obj[0]["piede"][1] != 0:
            errs.append(f"{label}: object not at -p*k")
        pts = {e["nome"]: e["at"] for e in els(sc, "punto")}
        return pts

    if not solution_only:
        sc = sample["scene"]
        pts = base(sc, "scene")
        if ("F" in pts) != show_f or ("C" in pts) != show_c:
            errs.append(f"scene points {sorted(pts)}")
        if "F" in pts and not near(pts["F"][0], -f * k):
            errs.append("scene focus misplaced")
        if "C" in pts and not near(pts["C"][0], -2 * f * k):
            errs.append("scene centre misplaced")
        if els(sc, "immagine") or els(sc, "raggio"):
            errs.append("the problem scene shows the image or the rays")
    sol = sample["solutionScene"]
    pts = base(sol, "solution")
    if "F" not in pts or not near(pts["F"][0], -f * k):
        errs.append("solution focus")
    q = 1 / (1 / f - 1 / p)
    G = -q / p
    img = els(sol, "immagine")
    if len(img) != 1:
        errs.append("solution image missing")
        return
    I = (-q * k, G * H)
    if not near(img[0]["piede"][0], I[0]) or not near(img[0]["h"], I[1]) or bool(img[0].get("virtuale")) != (q < 0):
        errs.append(f"solution image {img[0]} != {I}")
    # Each reflected ray: the solid piece that starts on the mirror (x near 0) must lie on a line through I.
    rays = [e for e in els(sol, "raggio") if not e.get("virtuale")]
    out = [r for r in rays if abs(Rational(str(r["da"][0]))) < Rational(1, 2) and Rational(str(r["a"][0])) < Rational(str(r["da"][0]))]
    if len(out) != 3:
        errs.append(f"{len(out)} reflected rays")
    for r in out:
        (x0, y0), (x1, y1) = [tuple(Rational(str(c)) for c in pt) for pt in (r["da"], r["a"])]
        cross = (x1 - x0) * (I[1] - y0) - (y1 - y0) * (I[0] - x0)
        length = ((x1 - x0) ** 2 + (y1 - y0) ** 2) ** Rational(1, 2)
        if abs(cross) / length > Rational(2, 100):
            errs.append("a reflected ray misses the image")


def level1(s, sample, errs):
    m = re.fullmatch(r"Uno specchio concavo ha il raggio di curvatura di " + Q + r"\. È puntato verso il Sole, con l'asse ottico parallelo ai raggi\. A quale distanza dal vertice si concentra la luce riflessa\?", s)
    if m:
        R = num(m.group(1))
        right, case = R / 2, "fuoco"
    else:
        m = re.fullmatch(r"Uno specchio concavo è puntato verso il Sole, con l'asse ottico parallelo ai raggi, e concentra la luce riflessa in un punto a " + Q + r" dal vertice\. Quanto vale il suo raggio di curvatura\?", s)
        if not m:
            errs.append(f"level 1 text: {s!r}")
            return None
        right, case = 2 * num(m.group(1)), "raggio"
    check_choice(sample, errs, cm(right))
    check_units(sample, errs)
    sc = sample["scene"]
    names = {e["nome"] for e in els(sc, "punto")}
    if names != ({"C"} if case == "fuoco" else {"F"}):
        errs.append(f"level 1 scene points {names}")
    if any(e.get("virtuale") for e in els(sc, "raggio")) or len(els(sc, "raggio")) != 2:
        errs.append("level 1 scene: only the two incoming rays")
    return case


def level23(s, sample, errs, lvl):
    if lvl == 2:
        m = re.fullmatch(r"Un oggetto si trova a " + Q + r" da uno specchio concavo con distanza focale " + Q + r"\. A quale distanza dallo specchio si forma l'immagine\?", s)
        g = (None, 1, 2)
    else:
        m = re.fullmatch(r"Un oggetto alto " + Q + r" si trova a " + Q + r" da uno specchio concavo con distanza focale " + Q + r"\. Quanto è alta la sua immagine, e com'è orientata\?", s)
        g = (1, 2, 3)
    if not m:
        errs.append(f"level {lvl} text: {s!r}")
        return None
    p, f = num(m.group(g[1])), num(m.group(g[2]))
    if not p > f > 0:
        errs.append("the object must be beyond the focus")
    q = 1 / (1 / f - 1 / p)
    if not is_exact(2 * q, 0):
        errs.append(f"q = {q} not to the half centimetre")
    G = -q / p
    if lvl == 2:
        check_choice(sample, errs, cm(q))
        check_units(sample, errs)
        case = "oltre C" if p > 2 * f else "tra C e F" if p < 2 * f else "in C"
    else:
        h = num(m.group(g[0]))
        hi = G * h
        if not is_exact(hi):
            errs.append("image height not to the millimetre")
        check_choice(sample, errs, fixed1(abs(hi)) + "\\,\\text{cm}\\ \\text{capovolta}")
        check_units(sample, errs, extras=True)
        for o in sample["answer"]["options"]:
            if parse_option(o["latex"])[2] not in ("capovolta", "diritta"):
                errs.append("orientation word")
        case = "ingrandita" if abs(G) > 1 else "rimpicciolita"
    k = Rational(str(sample["params"]["k"]))
    check_scene(sample, errs, p, f, k, True, True)
    return case


def level45(s, sample, errs, lvl):
    if lvl == 4:
        m = re.fullmatch(r"Un oggetto si trova a " + Q + r" da uno specchio concavo con distanza focale " + Q + r"\. Qual è la distanza \$q\$ dell'immagine dallo specchio, con il suo segno\?", s)
    else:
        m = re.fullmatch(r"Un oggetto si trova a " + Q + r" da uno specchio convesso con raggio di curvatura " + Q + r"\. Qual è la distanza \$q\$ dell'immagine dallo specchio, con il suo segno\?", s)
    if not m:
        errs.append(f"level {lvl} text: {s!r}")
        return None
    p = num(m.group(1))
    f = num(m.group(2)) if lvl == 4 else -num(m.group(2)) / 2
    if lvl == 4 and not 0 < p < f:
        errs.append("level 4 object not between the focus and the mirror")
    q = 1 / (1 / f - 1 / p)
    if q >= 0 or not is_exact(2 * q, 0):
        errs.append(f"q = {q}")
    check_choice(sample, errs, cm(q))
    check_units(sample, errs)
    if not any(num(parse_option(o["latex"])[0]) == -q for o in sample["answer"]["options"]):
        errs.append("the sign-lost distractor is missing")
    k = Rational(str(sample["params"]["k"]))
    check_scene(sample, errs, p, f, k, lvl == 4, True)
    return "virtuale" if lvl == 4 else ("oltre F" if p > -f else "dentro F")


def level6(s, sample, errs):
    m = re.fullmatch(r"Un oggetto si trova a " + Q + r" da uno specchio sferico\. La sua immagine è (reale e capovolta|virtuale e diritta), (.+?)\. Qual è la distanza focale \$f\$ dello specchio, con il suo segno\?", s)
    if not m or m.group(3) not in SIZES:
        errs.append(f"level 6 text: {s!r}")
        return None
    p = num(m.group(1))
    g = SIZES[m.group(3)]
    real = m.group(2).startswith("reale")
    G = -g if real else g
    q = -G * p
    f = p * q / (p + q)
    if not is_exact(2 * f, 0):
        errs.append("f not to the half centimetre")
    check_choice(sample, errs, cm(f))
    check_units(sample, errs)
    if sample.get("scene"):
        errs.append("level 6 has no problem scene")
    k = Rational(str(sample["params"]["k"]))
    check_scene(sample, errs, p, f, k, True, True, solution_only=True)
    return "reale" if real else ("virtuale ingrandita" if g > 1 else "virtuale rimpicciolita")


def check(sample):
    errs = []
    lvl = sample.get("level")
    if lvl not in (1, 2, 3, 4, 5, 6):
        return [f"unknown level {lvl}"], None
    common(sample, errs)
    if not sample.get("solutionScene") or (lvl != 6 and not sample.get("scene")):
        return errs + ["scene missing"], None
    try:
        s = prose(sample["problem"])
        if lvl == 1:
            kind = level1(s, sample, errs)
        elif lvl <= 3:
            kind = level23(s, sample, errs, lvl)
        elif lvl <= 5:
            kind = level45(s, sample, errs, lvl)
        else:
            kind = level6(s, sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
