"""Checker for fis-seno-coseno (specs/exercises/fis-seno-coseno.md).

Written from the spec and the lesson (docs/lezioni/fisica/riscritte/15-fis-seno-coseno.md). Every problem is read
back from its text; components, moduli and angles are computed with sympy's exact trigonometry (cos(pi*a/180)) and
evaluated with 60 digits, then rounded half up to the significant figures of the data (angles to the degree),
refusing values within 1e-9 of a rounding boundary. The scene must draw the data of the text: the vector at its
angle (levels 1-3, 6) or the components (levels 4-5), never the answer.
"""
import re

from sympy import Rational, atan2, cos, pi, sin, sqrt

from checkers._vettori import check_choice, common, num, parse_option, prose, round_deg, round_sig, scene_vectors, sig_of

CASE_RANGES = {
    1: {"x": (0.40, 0.60), "y": (0.40, 0.60)},
    2: {"x": (0.40, 0.60), "y": (0.40, 0.60)},
    3: {f"quadrante {q}": (0.22, 0.45) for q in (2, 3, 4)},
    4: {"modulo": (0.40, 0.60), "angolo": (0.40, 0.60)},
    5: {f"quadrante {q}": (0.22, 0.45) for q in (2, 3, 4)},
    6: {"uno sull'asse": (0.30, 0.50), "due inclinati": (0.50, 0.70)},
}

NOUNS = {"Una forza": ("F", "N"), "Uno spostamento": ("s", "m"), "Una velocità": ("v", "m/s")}
QTY = r"\$(-?\d+(?:\{,\}\d+)?)\\,\\text\{([^}]+)\}\$"


def rad(deg):
    return pi * Rational(deg) / 180


def angle_of(x, y):
    """The angle from the positive x semi-axis, counterclockwise, between 0 and 360 degrees."""
    a = atan2(y, x) * 180 / pi
    return a + 360 if a < 0 else a


def options_unit(sample, errs, unit, n):
    for o in sample["answer"]["options"]:
        v, u, extra = parse_option(o["latex"])
        if u != unit or extra:
            errs.append(f"option unit {o['latex']!r}")
        if sig_of(v) != n:
            errs.append(f"option {v} has not {n} significant figures")


def scene_angle(sample, errs, deg, rif, given):
    """The problem scene: one vector at `deg` from the x axis, the arc from `rif` with the given measure."""
    sc = sample["scene"]
    vecs = scene_vectors(sc)
    if len(vecs) != 1:
        errs.append("the problem scene must draw only the vector")
        return
    (x0, y0), (x1, y1), w = vecs[0]
    a = angle_of(x1 - x0, y1 - y0)
    if abs(float(a) - float(deg)) > 0.05:
        errs.append(f"scene vector at {float(a):.2f} degrees, not {deg}")
    angs = sc["data"].get("angoli", [])
    if len(angs) != 1 or angs[0]["rif"] != rif or angs[0]["testo"] != f"{given}°":
        errs.append(f"scene angle {angs}")


def component_level(s, sample, errs, lvl):
    m = re.fullmatch(
        r"(Una forza|Uno spostamento|Una velocità) di " + QTY + r" forma un angolo di \$(\d+)\^\\circ\$ (con l'asse \$x\$|con l'asse \$y\$, verso destra e verso l'alto|con il semiasse positivo delle \$x\$, misurato in senso antiorario)\. Quanto vale la componente \$([Fsv])_([xy])\$\?",
        s,
    )
    if not m:
        errs.append(f"level {lvl} text: {s!r}")
        return None
    letter, unit = NOUNS[m.group(1)]
    vS, u2, given, how, L, axis = m.group(2), m.group(3), int(m.group(4)), m.group(5), m.group(6), m.group(7)
    if u2 != unit or L != letter:
        errs.append("unit or letter")
    want_how = {1: "con l'asse $x$", 2: "con l'asse $y$, verso destra e verso l'alto", 3: "con il semiasse positivo delle $x$, misurato in senso antiorario"}[lvl]
    if how != want_how:
        errs.append("angle reference differs from the level")
    v = num(vS)
    n = sig_of(vS)
    if n not in (2, 3):
        errs.append(f"modulus with {n} significant figures")
    deg = 90 - given if lvl == 2 else given
    if lvl in (1, 2) and not 10 <= given <= 80:
        errs.append("angle out of range")
    if lvl == 3 and (not 90 < deg < 360 or deg % 90 == 0):
        errs.append("angle not in the second, third or fourth quadrant")
    exact = v * (cos(rad(deg)) if axis == "x" else sin(rad(deg)))
    right = round_sig(exact.evalf(60), n)
    if right is None:
        errs.append("answer at a rounding boundary")
        return None
    check_choice(sample, errs, f"{right}\\,\\text{{{unit}}}")
    options_unit(sample, errs, unit, n)
    scene_angle(sample, errs, deg, "y" if lvl == 2 else "x", given)
    if lvl == 3:
        return f"quadrante {int(deg) // 90 + 1}"
    return axis


def from_components(s, sample, errs, lvl):
    m = re.fullmatch(
        r"(Una forza|Uno spostamento|Una velocità) ha le componenti \$([Fsv])_x = (-?\d+(?:\{,\}\d+)?)\\,\\text\{([^}]+)\}\$ e \$([Fsv])_y = (-?\d+(?:\{,\}\d+)?)\\,\\text\{([^}]+)\}\$\. (Quale angolo forma con il semiasse positivo delle \$x\$, misurato in senso antiorario\?|Quanto vale il suo modulo\?)",
        s,
    )
    if not m:
        errs.append(f"level {lvl} text: {s!r}")
        return None
    letter, unit = NOUNS[m.group(1)]
    if m.group(2) != letter or m.group(5) != letter or m.group(4) != unit or m.group(7) != unit:
        errs.append("letter or unit")
    xS, yS = m.group(3), m.group(6)
    x, y = num(xS), num(yS)
    if sig_of(xS) != 2 or sig_of(yS) != 2:
        errs.append("components without two significant figures")
    if lvl == 4 and (x <= 0 or y <= 0):
        errs.append("level 4 components not positive")
    if lvl == 5 and x > 0 and y > 0:
        errs.append("level 5 vector in the first quadrant")
    # The scene: the two components, dashed, with their values; not the vector.
    vecs = scene_vectors(sample["scene"])
    labels = sorted(w.get("etichetta", "") for _, _, w in vecs)
    want = sorted(f"{t.replace('{,}', ',').replace('-', '−')} {unit}" for t in (xS, yS))
    if len(vecs) != 2 or labels != want or not all(w.get("tratteggiato") for _, _, w in vecs):
        errs.append(f"scene components {labels} != {want}")
    else:
        # Drawn to scale: one along x, one along y, from the origin, in the ratio and with the signs of the text.
        tips = {("x" if q[1] == 0 else "y" if q[0] == 0 else "?"): q for p, q, _ in vecs if p == (0, 0)}
        if set(tips) != {"x", "y"}:
            errs.append("scene components not on the axes")
        else:
            kx, ky = tips["x"][0] / x, tips["y"][1] / y
            if kx <= 0 or ky <= 0 or abs(float(kx / ky) - 1) > 0.01:
                errs.append("scene components not to scale")
    if m.group(8).startswith("Quanto"):
        right = round_sig(sqrt(x**2 + y**2).evalf(60), 2)
        if right is None:
            errs.append("modulus at a rounding boundary")
            return None
        check_choice(sample, errs, f"{right}\\,\\text{{{unit}}}")
        options_unit(sample, errs, unit, 2)
        return "modulo"
    a = angle_of(x, y)
    right = round_deg(a.evalf(60))
    if right is None:
        errs.append("angle at a rounding boundary")
        return None
    check_choice(sample, errs, f"{right}^\\circ")
    for o in sample["answer"]["options"]:
        if not re.fullmatch(r"-?\d+\^\\circ", o["latex"]):
            errs.append(f"angle option {o['latex']!r}")
    if lvl == 4:
        return "angolo"
    q = 2 if x < 0 < y else 3 if x < 0 else 4
    return f"quadrante {q}"


def level6(s, sample, errs):
    m = re.fullmatch(
        r"Due vettori partono dall'origine: \$\\vec\{([Fsv])\}_1\$ di " + QTY + r" (lungo l'asse \$x\$|a \$(\d+)\^\\circ\$ dall'asse \$x\$) e \$\\vec\{([Fsv])\}_2\$ di " + QTY + r" a \$(\d+)\^\\circ\$ dall'asse \$x\$, in senso antiorario\. Quanto vale il modulo della loro somma \$\\vec\{R\}\$\?",
        s,
    )
    if not m:
        errs.append(f"level 6 text: {s!r}")
        return None
    unit = m.group(3)
    if m.group(8) != unit or m.group(1) != m.group(6):
        errs.append("units or letters")
    a, b = num(m.group(2)), num(m.group(7))
    t1 = int(m.group(5)) if m.group(5) else 0
    t2 = int(m.group(9))
    if sig_of(m.group(2)) != 2 or sig_of(m.group(7)) != 2:
        errs.append("moduli without two significant figures")
    Rx = a * cos(rad(t1)) + b * cos(rad(t2))
    Ry = a * sin(rad(t1)) + b * sin(rad(t2))
    R = sqrt(Rx**2 + Ry**2)
    right = round_sig(R.evalf(60), 2)
    if right is None:
        errs.append("resultant at a rounding boundary")
        return None
    # The same result with the components kept to three figures, as a student would.
    r3 = lambda z: num(round_sig(z.evalf(60), 3)) if abs(z.evalf(30)) > Rational(1, 10**9) else 0  # noqa: E731
    R3 = sqrt((r3(a * cos(rad(t1))) + r3(b * cos(rad(t2)))) ** 2 + (r3(a * sin(rad(t1))) + r3(b * sin(rad(t2)))) ** 2)
    if round_sig(R3.evalf(60), 2) != right:
        errs.append("the answer depends on rounding the components")
    check_choice(sample, errs, f"{right}\\,\\text{{{unit}}}")
    options_unit(sample, errs, unit, 2)
    vecs = scene_vectors(sample["scene"])
    if len(vecs) != 2:
        errs.append("the problem scene must draw the two vectors only")
    else:
        for ((x0, y0), (x1, y1), _w), t in zip(vecs, (t1, t2)):
            if abs(float(angle_of(x1 - x0, y1 - y0)) % 360 - t) > 0.05:
                errs.append("scene vector at the wrong angle")
    return "uno sull'asse" if t1 == 0 else "due inclinati"


def check(sample):
    errs = []
    lvl = sample.get("level")
    if lvl not in (1, 2, 3, 4, 5, 6):
        return [f"unknown level {lvl}"], None
    common(sample, errs)
    if not sample.get("scene") or not sample.get("solutionScene"):
        return errs + ["scene missing"], None
    try:
        s = prose(sample["problem"])
        if lvl <= 3:
            kind = component_level(s, sample, errs, lvl)
        elif lvl <= 5:
            kind = from_components(s, sample, errs, lvl)
        else:
            kind = level6(s, sample, errs)
    except ValueError as e:
        return errs + [str(e)], None
    return errs, kind
