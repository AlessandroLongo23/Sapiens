"""circonferenza-cerchio (Circonferenza e cerchio), from specs/exercises/circonferenza-cerchio.md.

Written from the spec, not from the generator. Every datum is read back from the text the student sees
(the prose and the givens of the problem), never from params, and the answer is found again with a figure
built from coordinates, not with the formulas of the lesson:

- levels 1 and 2: each point P is placed at its distance from O and tested against the SymPy circle
  (enclosed, on it, outside); each line is the horizontal line at its distance, and the number of its
  intersections with the circle says secant, tangent or external;
- level 3: the two circles with their centres at the given distance, the number of SymPy intersections and,
  when there are none or one, where the small circle and the contact point lie;
- level 4: the chord as the intersection of the circle with a line, or the point of the circle at half the
  chord (SymPy, exact);
- level 5: A, B and V on the unit circle (floating point), the angle measured with atan2; when the central
  angle is asked, every integer central angle from 1 to 359 is tried and only one may give the data;
- level 6: the two tangents from P built on the unit circle (P where they meet), the angles measured; for the
  lengths the tangent line of SymPy and the right angle in A built with coordinates;
- level 7: the triangle with the diameter on the x axis and the third vertex found by intersecting circles
  (SymPy) or a ray (floating point), the right angle measured.

It also checks the shares of the cases (CASE_RANGES), the form of the options and that exactly one option,
the one marked correct, equals the answer, with the options compared as numbers.
"""
import math
import re

from sympy import Circle, Line, Point, Rational, Triangle, nsimplify, simplify

from verify import exact

CASE_RANGES = {
    1: {k: (0.25, 0.42) for k in ["in", "on", "out"]},
    2: {k: (0.25, 0.42) for k in ["in", "on", "out"]},
    3: {k: (0.13, 0.28) for k in ["esterne", "tangenti esternamente", "secanti", "tangenti internamente", "interna"]},
    4: {k: (0.25, 0.42) for k in ["corda", "distanza", "raggio"]},
    5: {k: (0.17, 0.33) for k in ["dal centro", "dalla circonferenza", "ottuso", "altro arco"]},
    6: {k: (0.17, 0.33) for k in ["angolo tra i raggi", "angolo tra le tangenti", "bisettrice", "segmento di tangente"]},
    7: {k: (0.25, 0.42) for k in ["angolo", "cateto", "raggio"]},
}

N = r"(\d+(?:\{,\}5)?)"  # a length as the text writes it: 12 or 3{,}5


# ---------------------------------------------------------------------------
# Text

def text_of(tex):
    """The contents of every \\text{...} group, joined; the rest dropped."""
    out, i = [], 0
    while True:
        i = tex.find("\\text{", i)
        if i < 0:
            break
        depth, j = 1, i + 6
        while depth:
            if tex[j] == "{":
                depth += 1
            elif tex[j] == "}":
                depth -= 1
            j += 1
        out.append(tex[i + 6 : j - 1])
        i = j
    return out


def rows(problem):
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", problem, re.S)
    body = m.group(1) if m else problem
    return [r.strip() for r in body.split(" \\\\ ")]


def prose(problem):
    """The prose lines joined (lines made only of \\text{...}), and the other lines."""
    words, other = [], []
    for r in rows(problem):
        if re.fullmatch(r"\\text\{.*\}", r):
            words += text_of(r)
        else:
            other.append(r)
    return re.sub(r"\s+", " ", " ".join(words)).strip(), other


def num(s):
    m = re.fullmatch(r"(\d+)(\{,\}5)?", s)
    if not m:
        raise ValueError(f"not a length: {s!r}")
    return Rational(int(m.group(1))) + (Rational(1, 2) if m.group(2) else 0)


def length_tex_ok(v):
    """The way the lesson writes a length: integer or one decimal 5."""
    return v > 0 and (v * 2).is_integer


# ---------------------------------------------------------------------------
# Options

def option_value(latex, unit):
    if unit == "deg":
        m = re.fullmatch(r"(\d+)\^\\circ", latex)
        if not m:
            raise ValueError(f"not an angle option: {latex}")
        return Rational(int(m.group(1)))
    m = re.fullmatch(r"(?:(\d+(?:\{,\}5)?)|(\d*)\\sqrt\{(\d+)\})\\text\{ cm\}", latex)
    if not m:
        raise ValueError(f"not a length option: {latex}")
    if m.group(1):
        return num(m.group(1))
    k = int(m.group(2)) if m.group(2) else 1
    if m.group(2) == "1":
        raise ValueError(f"coefficient 1 written: {latex}")
    return k * exact(f"sqrt({m.group(3)})")


def check_shape(ch, errs, n=4):
    if not ch or ch.get("kind") != "choice":
        errs.append("no choice")
        return None
    opts = ch["options"]
    if len(opts) != n:
        errs.append(f"{len(opts)} options, expected {n}")
    if len({o["latex"] for o in opts}) != len(opts) or len({"|".join(o["values"]) for o in opts}) != len(opts):
        errs.append("options not distinct")
    if not isinstance(ch.get("correct"), int) or not 0 <= ch["correct"] < len(opts):
        errs.append("correct index out of range")
        return None
    return opts


def check_number(sample, truth, unit, errs):
    ans = sample["answer"]
    if ans.get("kind") != "number":
        errs.append("answer is not a number")
        return
    if Rational(ans["value"]) != truth:
        errs.append(f"answer {ans['value']} != truth {truth}")
    if unit == "cm" and not length_tex_ok(truth):
        errs.append(f"answer {truth} is not a length with at most the half")
    if unit == "deg" and not (truth.is_integer and 0 < truth < 360):
        errs.append(f"answer {truth} is not an angle in whole degrees below 360")
    opts = check_shape(sample.get("choice"), errs)
    if opts is None:
        return
    vals = []
    for o in opts:
        try:
            v = option_value(o["latex"], unit)
        except ValueError as e:
            errs.append(str(e))
            return
        if simplify(exact(o["values"][0]) - v) != 0:
            errs.append(f"option values {o['values']} != latex {o['latex']}")
        if v <= 0 or (unit == "deg" and v >= 360):
            errs.append(f"implausible option {o['latex']}")
        vals.append(v)
    if len({nsimplify(v) for v in vals}) != len(vals):
        errs.append("two options with the same value")
    right = [i for i, v in enumerate(vals) if simplify(v - truth) == 0]
    if len(right) != 1:
        errs.append(f"{len(right)} options equal the truth {truth}")
    elif right[0] != sample["choice"]["correct"]:
        errs.append("choice.correct points to a wrong option")


def check_letter_choice(ans, truth, allowed, errs, n=4):
    """Choice between labelled objects; returns the label of the correct option."""
    opts = check_shape(ans, errs, n)
    if opts is None:
        return None
    labels = []
    for o in opts:
        labels.append(allowed(o["latex"]))
        if labels[-1] is None or o["values"] != [labels[-1]]:
            errs.append(f"bad option {o['latex']} {o['values']}")
            return None
    if labels.count(truth) != 1:
        errs.append(f"the truth {truth} is {labels.count(truth)} times among the options")
    got = labels[ans["correct"]]
    if got != truth:
        errs.append(f"correct option {got}, truth {truth}")
    return labels


# ---------------------------------------------------------------------------
# Levels 1 and 2: four points, four lines

def check_l12(sample, errs):
    lines = sample["level"] == 2
    text, other = prose(sample["problem"])
    if lines:
        m = re.fullmatch(
            rf"Una circonferenza di centro \$O\$ ha (raggio|diametro) \${N}\$ cm\. Le rette \$s\$, \$t\$, \$u\$, \$v\$ hanno dal centro "
            r"le distanze scritte sotto\. Quale retta è (secante|tangente|esterna) alla circonferenza\?",
            text,
        )
    else:
        m = re.fullmatch(
            rf"Una circonferenza di centro \$O\$ ha (raggio|diametro) \${N}\$ cm\. Quale di questi punti "
            r"(è interno alla circonferenza|sta sulla circonferenza|è esterno alla circonferenza)\?",
            text,
        )
    if not m or len(other) != 1:
        errs.append(f"unreadable problem: {text} / {other}")
        return None
    given = num(m.group(2))
    r = given / 2 if m.group(1) == "diametro" else given
    asked = {
        "secante": "in", "tangente": "on", "esterna": "out",
        "è interno alla circonferenza": "in", "sta sulla circonferenza": "on", "è esterno alla circonferenza": "out",
    }[m.group(3)]
    item = r"d_([stuv])" if lines else r"\\overline\{O([ABCD])\}"
    items = []
    for g in re.split(r" \\quad ", other[0]):
        gm = re.fullmatch(rf"{item} = {N}\\text\{{ cm\}}", g)
        if not gm:
            errs.append(f"unreadable given {g}")
            return None
        items.append((gm.group(1), num(gm.group(2))))
    names = [n for n, _ in items]
    if names != (list("stuv") if lines else list("ABCD")):
        errs.append(f"names {names}")
    if len({d for _, d in items}) != 4:
        errs.append("two equal distances")
    C = Circle(Point(0, 0), r)
    where = {}
    for n, d in items:
        if lines:
            k = len(C.intersection(Line(Point(-1, d), Point(1, d))))
            where[n] = {2: "in", 1: "on", 0: "out"}[k]
        else:
            P = Point(d, 0)
            where[n] = "in" if C.encloses_point(P) else "on" if P in C else "out"
    hits = [n for n in names if where[n] == asked]
    if len(hits) != 1:
        errs.append(f"{len(hits)} objects in the asked position")
        return None
    if set(where.values()) != {"in", "on", "out"}:
        errs.append("the three positions are not all present")
    if m.group(1) == "diametro":
        # The trap of the spec: compared with the diameter, another object looks like the answer.
        D = given
        trap = {"on": lambda d: d == D, "in": lambda d: r < d < D, "out": lambda d: True}[asked]
        if not any(trap(d) for n, d in items if n != hits[0]):
            errs.append("no trap distance with the diameter given")
    noun = r"\\text\{la retta \}([stuv])" if lines else r"\\text\{il punto \}([ABCD])"
    check_letter_choice(sample["answer"], hits[0], lambda s: (re.fullmatch(noun, s) or [None, None])[1], errs)
    return asked


# ---------------------------------------------------------------------------
# Level 3: two circles

LABELS = {
    "esterne": "esterne",
    "tangenti esternamente": "tangenti esternamente",
    "secanti": "secanti",
    "tangenti internamente": "tangenti internamente",
    "una interna all'altra": "interna",
}


def check_l3(sample, errs):
    text, _ = prose(sample["problem"])
    m = re.fullmatch(
        rf"Due circonferenze hanno raggi \${N}\$ cm e \${N}\$ cm, e i loro centri distano \${N}\$ cm\. Come sono le due circonferenze\?",
        text,
    )
    m0 = re.fullmatch(
        rf"Due circonferenze hanno lo stesso centro e raggi \${N}\$ cm e \${N}\$ cm\. Come sono le due circonferenze\?",
        text,
    )
    if m:
        r1, r2, d = num(m.group(1)), num(m.group(2)), num(m.group(3))
    elif m0:
        r1, r2, d = num(m0.group(1)), num(m0.group(2)), Rational(0)
    else:
        errs.append(f"unreadable problem: {text}")
        return None
    if r1 == r2:
        errs.append("equal radii")
        return None
    big, small = max(r1, r2), min(r1, r2)
    C1, C2 = Circle(Point(0, 0), big), Circle(Point(d, 0), small)
    cut = C1.intersection(C2) if d else []
    if len(cut) == 2:
        truth = "secanti"
    elif len(cut) == 1:
        T = cut[0]
        # Externally tangent: the contact point lies between the two centres.
        truth = "tangenti esternamente" if 0 < T.x < d else "tangenti internamente"
    else:
        truth = "interna" if C1.encloses_point(Point(d + small, 0)) else "esterne"
    if big + small > 25:
        errs.append("radii too large")
    check_letter_choice(sample["answer"], truth, lambda s: LABELS.get((re.fullmatch(r"\\text\{(.*)\}", s) or [None, ""])[1]), errs)
    if (d == 0) != bool(sample["params"].get("concentric")):
        errs.append("concentric flag")
    return truth


# ---------------------------------------------------------------------------
# Level 4: chord, distance, radius

def check_l4(sample, errs):
    text, _ = prose(sample["problem"])
    pats = {
        "corda": rf"Una circonferenza di centro \$O\$ ha raggio \${N}\$ cm, e la corda \$([A-Z]{{2}})\$ ha distanza \${N}\$ cm dal centro\. Quanto è lunga la corda \$([A-Z]{{2}})\$\?",
        "distanza": rf"In una circonferenza di centro \$O\$ e raggio \${N}\$ cm la corda \$([A-Z]{{2}})\$ è lunga \${N}\$ cm\. Quanto dista la corda dal centro\?",
        "raggio": rf"In una circonferenza di centro \$O\$ la corda \$([A-Z]{{2}})\$ è lunga \${N}\$ cm e ha distanza \${N}\$ cm dal centro\. Quanto misura il raggio\?",
    }
    case = next((k for k, p in pats.items() if re.fullmatch(p, text)), None)
    if case is None:
        errs.append(f"unreadable problem: {text}")
        return None
    m = re.fullmatch(pats[case], text)
    O = Point(0, 0)
    if case == "corda":
        r, d = num(m.group(1)), num(m.group(3))
        if m.group(2) != m.group(4):
            errs.append("two chord names")
        pts = Circle(O, r).intersection(Line(Point(0, d), Point(1, d)))
        if len(pts) != 2:
            errs.append("the line at that distance does not cut the circle")
            return None
        truth = pts[0].distance(pts[1])
    elif case == "distanza":
        r, c = num(m.group(1)), num(m.group(3))
        if c >= 2 * r:
            errs.append("chord not shorter than the diameter")
            return None
        # A chord of length c, horizontal and centred on the y axis: its endpoint (c/2, y) on the circle.
        pts = [p for p in Circle(O, r).intersection(Line(Point(c / 2, 0), Point(c / 2, 1))) if p.y > 0]
        truth = pts[0].y
    else:
        c, d = num(m.group(2)), num(m.group(3))
        truth = O.distance(Point(c / 2, d))
    truth = nsimplify(truth)
    if not truth.is_Rational:
        errs.append(f"irrational answer {truth}")
        return None
    check_number(sample, Rational(truth), "cm", errs)
    return case


# ---------------------------------------------------------------------------
# Level 5: central and inscribed angles

def on_unit(a):
    return (math.cos(math.radians(a)), math.sin(math.radians(a)))


def angle_at(P, X, Y):
    """Angle XPY in degrees, between 0 and 180."""
    a = math.degrees(math.atan2(X[1] - P[1], X[0] - P[0]) - math.atan2(Y[1] - P[1], Y[0] - P[0]))
    a = abs(a) % 360
    return 360 - a if a > 180 else a


def inscribed(mu):
    """A at 0°, B at mu° (the arc AB from A to B counter-clockwise, mu degrees); V on the other arc."""
    return angle_at(on_unit(mu + (360 - mu) / 2), on_unit(0), on_unit(mu))


def rounded(x, errs):
    r = round(x)
    if abs(x - r) > 1e-6:
        errs.append(f"measured angle {x} not an integer")
    return Rational(r)


def check_l5(sample, errs):
    text, _ = prose(sample["problem"])
    A = r"\$\\widehat\{AOB\}\$"
    V = r"\$\\widehat\{AVB\}\$"
    m1 = re.fullmatch(rf"L'angolo al centro {A} misura \$(\d+)\^\\circ\$\. Quanto misura l'angolo alla circonferenza {V} che insiste sullo stesso arco\?", text)
    m2 = re.fullmatch(rf"L'angolo alla circonferenza {V} misura \$(\d+)\^\\circ\$\. Quanto misura l'angolo al centro corrispondente\?", text)
    m3 = re.fullmatch(rf"L'angolo al centro convesso {A} misura \$(\d+)\^\\circ\$, e il punto \$V\$ sta sull'arco minore \$AB\$\. Quanto misura l'angolo alla circonferenza {V}\?", text)
    if m1:
        x = int(m1.group(1))
        if not 0 < x < 180:
            errs.append("central angle not convex")
            return None
        # The angle AOB of the text is convex: it contains the minor arc, and V is on the major one.
        truth = rounded(inscribed(x), errs)
        case = "dal centro"
    elif m2:
        y = int(m2.group(1))
        # The corresponding central angle contains the arc the inscribed angle stands on: try them all.
        found = [mu for mu in range(1, 360) if abs(inscribed(mu) - y) < 1e-6]
        if len(found) != 1:
            errs.append(f"{len(found)} central angles give the inscribed angle {y}")
            return None
        truth = Rational(found[0])
        case = "ottuso" if y > 90 else "dalla circonferenza"
        if y == 90:
            errs.append("right inscribed angle")
    elif m3:
        x = int(m3.group(1))
        if not 0 < x < 180:
            errs.append("central angle not convex")
            return None
        truth = rounded(angle_at(on_unit(x / 2), on_unit(0), on_unit(x)), errs)
        case = "altro arco"
    else:
        errs.append(f"unreadable problem: {text}")
        return None
    check_number(sample, truth, "deg", errs)
    return case


# ---------------------------------------------------------------------------
# Level 6: tangents from an external point

def tangents(theta):
    """Unit circle, A and B at ±theta/2 (so the convex angle AOB is theta), P where the tangents meet."""
    A = on_unit(theta / 2)
    B = on_unit(-theta / 2)
    P = (1 / math.cos(math.radians(theta / 2)), 0.0)
    return (0.0, 0.0), A, B, P


def check_l6(sample, errs):
    text, _ = prose(sample["problem"])
    intro = r"Da un punto \$P\$ esterno a una circonferenza di centro \$O\$ si conducono le tangenti \$PA\$ e \$PB\$, e "
    m1 = re.fullmatch(intro + r"\$\\widehat\{APB\} = (\d+)\^\\circ\$\. Quanto misura l'angolo \$\\widehat\{AOB\}\$\?", text)
    m2 = re.fullmatch(intro + r"\$\\widehat\{AOB\} = (\d+)\^\\circ\$\. Quanto misura l'angolo \$\\widehat\{APB\}\$ tra le tangenti\?", text)
    m3 = re.fullmatch(intro + r"\$\\widehat\{APB\} = (\d+)\^\\circ\$\. Quanto misura l'angolo \$\\widehat\{AOP\}\$\?", text)
    seg = r"Da un punto \$P\$ si conduce la tangente \$PA\$ a una circonferenza di centro \$O\$ e raggio \$" + N + r"\$ cm, e "
    m4 = re.fullmatch(seg + r"\$\\overline\{OP\} = " + N + r"\$ cm\. Quanto è lungo il segmento di tangente \$PA\$\?", text)
    m5 = re.fullmatch(seg + r"il segmento di tangente \$PA\$ è lungo \$" + N + r"\$ cm\. Quanto dista \$P\$ dal centro\?", text)
    if m1 or m3:
        x = int((m1 or m3).group(1))
        found = [th for th in range(1, 180) if abs(angle_at(tangents(th)[3], tangents(th)[1], tangents(th)[2]) - x) < 1e-6]
        if len(found) != 1:
            errs.append(f"{len(found)} configurations with APB = {x}")
            return None
        O, A, B, P = tangents(found[0])
        if m1:
            truth, case = rounded(angle_at(O, A, B), errs), "angolo tra i raggi"
        else:
            truth, case = rounded(angle_at(O, A, P), errs), "bisettrice"
    elif m2:
        y = int(m2.group(1))
        if not 0 < y < 180:
            errs.append("AOB not convex")
            return None
        O, A, B, P = tangents(y)
        truth, case = rounded(angle_at(P, A, B), errs), "angolo tra le tangenti"
    elif m4:
        r, op = num(m4.group(1)), num(m4.group(2))
        if op <= r:
            errs.append("P not outside the circle")
            return None
        C, P = Circle(Point(0, 0), r), Point(op, 0)
        tl = C.tangent_lines(P)
        T = C.intersection(tl[0])
        if len(T) != 1:
            errs.append("tangent line not tangent")
            return None
        truth, case = nsimplify(P.distance(T[0])), "segmento di tangente"
    elif m5:
        r, pa = num(m5.group(1)), num(m5.group(2))
        # A on the circle at (r, 0), the tangent in A is vertical, P on it at distance pa.
        A, P = Point(r, 0), Point(r, pa)
        if Line(Point(0, 0), A).is_perpendicular(Line(A, P)) is not True:
            errs.append("not a right angle in A")
        truth, case = nsimplify(Point(0, 0).distance(P)), "segmento di tangente"
    else:
        errs.append(f"unreadable problem: {text}")
        return None
    if case == "segmento di tangente":
        if not truth.is_Rational:
            errs.append(f"irrational answer {truth}")
            return None
        check_number(sample, Rational(truth), "cm", errs)
    else:
        check_number(sample, truth, "deg", errs)
    return case


# ---------------------------------------------------------------------------
# Level 7: triangle in a semicircle

def check_l7(sample, errs):
    text, _ = prose(sample["problem"])
    m1 = re.fullmatch(
        r"Il triangolo \$ABC\$ è inscritto in una circonferenza e il lato \$([ABC]{2})\$ è un diametro\. "
        r"Se \$\\hat\{([ABC])\} = (\d+)\^\\circ\$, quanto misura \$\\hat\{([ABC])\}\$\?",
        text,
    )
    m2 = re.fullmatch(
        rf"(?:In una circonferenza di raggio \${N}\$ cm il lato \$([ABC]{{2}})\$ del triangolo \$ABC\$ è un diametro, e il vertice \$([ABC])\$ sta sulla circonferenza"
        rf"|Il triangolo \$ABC\$ ha il vertice \$([ABC])\$ su una circonferenza di diametro \$\\overline\{{([ABC]{{2}})\}} = {N}\$ cm)\. "
        rf"Se \$\\overline\{{([ABC]{{2}})\}} = {N}\$ cm, quanto è lungo \$([ABC]{{2}})\$\?",
        text,
    )
    m3 = re.fullmatch(
        rf"Il triangolo \$ABC\$ ha i lati \$\\overline\{{([ABC]{{2}})\}} = {N}\$ cm e \$\\overline\{{([ABC]{{2}})\}} = {N}\$ cm, "
        r"ed è inscritto in una semicirconferenza di diametro \$([ABC]{2})\$\. Quanto misura il raggio della circonferenza\?",
        text,
    )
    if m1:
        diam, X, a, Y = m1.group(1), m1.group(2), int(m1.group(3)), m1.group(4)
        if X == Y or {X, Y} != set(diam):
            errs.append("the angles are not at the ends of the diameter")
            return None
        if not 0 < a < 90:
            errs.append("given angle not acute")
            return None
        # X = (-1, 0), Y = (1, 0); the side from X at angle a meets the circle again in Z.
        ca, sa = math.cos(math.radians(a)), math.sin(math.radians(a))
        Z = (-1 + 2 * ca * ca, 2 * ca * sa)
        if abs(Z[0] ** 2 + Z[1] ** 2 - 1) > 1e-9:
            errs.append("Z not on the circle")
        Xp, Yp = (-1.0, 0.0), (1.0, 0.0)
        if abs(angle_at(Xp, Yp, Z) - a) > 1e-6 or abs(angle_at(Z, Xp, Yp) - 90) > 1e-6:
            errs.append("figure not as described")
        check_number(sample, rounded(angle_at(Yp, Xp, Z), errs), "deg", errs)
        return "angolo"
    if m2:
        if m2.group(1):
            D, diam, Z = 2 * num(m2.group(1)), m2.group(2), m2.group(3)
        else:
            Z, diam, D = m2.group(4), m2.group(5), num(m2.group(6))
        known, c, asked = m2.group(7), num(m2.group(8)), m2.group(9)
        if len({diam, known, asked}) != 3 or Z in diam or Z not in known or Z not in asked:
            errs.append("letters of the sides")
            return None
        if c >= D:
            errs.append("a leg not shorter than the diameter")
            return None
        X, Y = Point(-D / 2, 0), Point(D / 2, 0)
        cut = [p for p in Circle(Point(0, 0), D / 2).intersection(Circle(X, c)) if p.y > 0]
        if len(cut) != 1:
            errs.append("no third vertex")
            return None
        truth = nsimplify(cut[0].distance(Y))
        if not truth.is_Rational:
            errs.append(f"irrational answer {truth}")
            return None
        check_number(sample, Rational(truth), "cm", errs)
        return "cateto"
    if m3:
        s1, c1, s2, c2, diam = m3.group(1), num(m3.group(2)), m3.group(3), num(m3.group(4)), m3.group(5)
        Z = next(v for v in "ABC" if v not in diam)
        if s1 == s2 or Z not in s1 or Z not in s2:
            errs.append("letters of the sides")
            return None
        T = Triangle(Point(0, 0), Point(c1, 0), Point(0, c2))
        truth = nsimplify(T.circumradius)
        if not truth.is_Rational:
            errs.append(f"irrational answer {truth}")
            return None
        check_number(sample, Rational(truth), "cm", errs)
        return "raggio"
    errs.append(f"unreadable problem: {text}")
    return None


def check(sample):
    errs = []
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    blob = sample["problem"] + " ".join(sample.get("steps", []))
    if "—" in blob or "piuttosto che" in blob:
        errs.append("forbidden words")
    lvl = sample["level"]
    fn = {1: check_l12, 2: check_l12, 3: check_l3, 4: check_l4, 5: check_l5, 6: check_l6, 7: check_l7}.get(lvl)
    if fn is None:
        return [f"unknown level {lvl}"], None
    kind = fn(sample, errs)
    if kind and sample.get("params", {}).get("case") != kind:
        errs.append(f"params.case {sample.get('params', {}).get('case')} != {kind}")
    return errs, kind
