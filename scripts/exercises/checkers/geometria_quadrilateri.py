"""Checker for geometria-quadrilateri (specs/exercises/geometria-quadrilateri.md).

Written from the spec and the lesson, not from the generator. It reads each problem back from its text and
solves it on its own:
- levels 1, 3, 4 (angles): the figure is built with coordinates (a parallelogram, a rhombus, a rectangle, an
  isosceles or right trapezio) for every value of its shape parameter on a grid of half degrees; the shapes that
  match the data of the text give the asked angle, which must be one and the same (for the equations of level 4,
  x is found from the first expression and the second must agree);
- level 2 (lengths): the rules of the lesson (opposite sides, the four sides of the rhombus, diagonals that bisect
  each other, congruent diagonals of the rectangle), and a question the data do not decide is an error;
- levels 5 and 6: a bank of concrete convex quadrilaterals with integer coordinates (every convex quadrilateral is
  two diagonals crossing inside both, so the bank is built from the diagonals, plus right trapezi), classified by
  the definitions of the lesson. Level 5: the givens are parsed as formulas and the most precise family shared by
  every shape of the bank that satisfies them is the answer. Level 6: each statement is parsed from its text and
  decided on the bank;
- level 7: the proof and the step are found in a table written from the lesson; the claim of the step is checked
  on a concrete figure, pairs of angles are classified from the coordinates (alternate, corresponding, co-interior,
  vertical) and the congruence criterion is deduced from the known elements.
"""
import math
import re
from fractions import Fraction as F
from functools import lru_cache
from itertools import product

CASE_RANGES = {
    1: {"quadrilatero": (0.23, 0.43), "opposto": (0.23, 0.43), "consecutivo": (0.23, 0.43)},
    2: {"lati": (0.40, 0.60), "diagonali": (0.40, 0.60)},
    3: {"rombo": (0.40, 0.60), "rettangolo": (0.40, 0.60)},
    4: {"un-angolo": (0.25, 0.45), "equazione": (0.55, 0.75)},
    6: {"vera": (0.40, 0.60), "falsa": (0.40, 0.60)},
}

BANNED = re.compile(r"—|piuttosto che")

# ---------------------------------------------------------------------------
# Reading the problem


def top_lines(tex):
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", tex.strip(), re.S)
    return m.group(1).split(r" \\ ") if m else [tex.strip()]


def text_of(line):
    m = re.fullmatch(r"\\text\{(.*)\}", line.strip())
    return m.group(1) if m else None


def blocks(tex):
    """The problem as ("text", sentence) and ("math", formula) blocks; consecutive text lines are one sentence."""
    out = []
    for line in top_lines(tex):
        s = text_of(line)
        if s is not None and out and out[-1][0] == "text":
            out[-1] = ("text", out[-1][1] + " " + s)
        elif s is not None:
            out.append(("text", s))
        else:
            out.append(("math", line.strip()))
    return out


def prose(tex):
    b = blocks(tex)
    if len(b) != 1 or b[0][0] != "text":
        raise ValueError(f"expected a single paragraph: {tex!r}")
    return b[0][1]


# ---------------------------------------------------------------------------
# Plane geometry with floats (levels 1, 3, 4)


def sub(p, q):
    return (p[0] - q[0], p[1] - q[1])


def dot(u, v):
    return u[0] * v[0] + u[1] * v[1]


def cross(u, v):
    return u[0] * v[1] - u[1] * v[0]


def angle_at(v, x, y):
    u, w = sub(x, v), sub(y, v)
    c = dot(u, w) / math.sqrt(dot(u, u) * dot(w, w))
    return math.degrees(math.acos(max(-1.0, min(1.0, c))))


def fig_points(fig, p):
    r = math.radians(p)
    c, s = math.cos(r), math.sin(r)
    if fig == "parallelogramma":
        A, B, D = (0.0, 0.0), (5.0, 0.0), (3 * c, 3 * s)
    elif fig == "rombo":
        A, B, D = (0.0, 0.0), (5.0, 0.0), (5 * c, 5 * s)
    elif fig == "rettangolo":  # p = angle between the diagonal AC and the side AB
        A, B, D = (0.0, 0.0), (2 * c, 0.0), (0.0, 2 * s)
    elif fig == "isoscele":  # p = angle at A, the base AB is the longer one
        A, B, D = (0.0, 0.0), (10.0, 0.0), (2 * c, 2 * s)
        return {"A": A, "B": B, "C": (10 - 2 * c, 2 * s), "D": D, "M": None}
    elif fig == "trapezio-rettangolo":  # p = angle at B, right angles at A and D
        return {"A": (0.0, 0.0), "B": (10.0, 0.0), "C": (10 - 2 * c, 2 * s), "D": (0.0, 2 * s), "M": None}
    else:
        raise ValueError(fig)
    C = (B[0] + D[0], B[1] + D[1])
    return {"A": A, "B": B, "C": C, "D": D, "M": ((A[0] + C[0]) / 2, (A[1] + C[1]) / 2)}


GRID = {
    "parallelogramma": [k / 2 for k in range(1, 360)],
    "rombo": [k / 2 for k in range(1, 360)],
    "rettangolo": [k / 2 for k in range(1, 180)],
    "isoscele": [k / 2 for k in range(1, 180)],
    "trapezio-rettangolo": [k / 2 for k in range(1, 180)],
}
ORDER = "ABCD"


def named_angle(pts, name):
    m = re.fullmatch(r"\\hat\{([A-D])\}", name)
    if m:
        i = ORDER.index(m.group(1))
        return angle_at(pts[ORDER[i]], pts[ORDER[(i - 1) % 4]], pts[ORDER[(i + 1) % 4]])
    m = re.fullmatch(r"\\widehat\{([A-DM])([A-DM])([A-DM])\}", name)
    if m:
        return angle_at(pts[m.group(2)], pts[m.group(1)], pts[m.group(3)])
    raise ValueError(f"unknown angle {name!r}")


def solve_angles(fig, known, asked):
    """known: list of (angle name, value or (p, q) for p x + q). Returns the set of asked values and of x found."""
    found, xs = set(), set()
    for p in GRID[fig]:
        pts = fig_points(fig, p)
        if known and isinstance(known[0][1], tuple):
            (n1, (p1, q1)), (n2, (p2, q2)) = known
            a1, a2 = named_angle(pts, n1), named_angle(pts, n2)
            x = (a1 - q1) / p1
            if x <= 0 or abs(p2 * x + q2 - a2) > 1e-6:
                continue
            xs.add(round(x, 6))
        elif any(abs(named_angle(pts, n) - v) > 1e-6 for n, v in known):
            continue
        found.add(round(named_angle(pts, asked), 6))
    return found, xs


DEG = r"\$(\d+)\^\\circ\$"
ANG = r"\\hat\{[A-D]\}|\\widehat\{[A-DM]{3}\}"


def expect_number(errs, sample, truth_set, unit):
    if len(truth_set) != 1:
        errs.append(f"the data give {len(truth_set)} values for the asked quantity: {sorted(truth_set)[:5]}")
        return None
    truth = next(iter(truth_set))
    if abs(truth - round(truth)) > 1e-6:
        errs.append(f"answer {truth} is not an integer")
        return None
    truth = int(round(truth))
    ans = sample["answer"]
    if ans.get("kind") != "number" or ans.get("value") != str(truth):
        errs.append(f"answer {ans.get('value')} != {truth}")
    check_number_choice(errs, sample, truth, unit)
    return truth


def check_number_choice(errs, sample, truth, unit):
    ch = sample.get("choice")
    if ch is None:
        errs.append("no choice variant")
        return
    opts = ch.get("options", [])
    vals = [o["values"][0] for o in opts]
    if len(opts) != 4 or len(set(vals)) != 4:
        errs.append(f"choice needs four distinct options: {vals}")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(opts) or vals[idx] != str(truth):
        errs.append("choice.correct is not the truth")
    for o in opts:
        v = int(o["values"][0])
        want = f"{v}^\\circ" if unit == "deg" else f"{v}\\ \\text{{cm}}"
        if o["latex"] != want:
            errs.append(f"option latex {o['latex']!r} != {want!r}")
        if v <= 0:
            errs.append(f"option {v} not positive")


# ---------------------------------------------------------------------------
# Level 1


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Nel quadrilatero \$ABCD\$ gli angoli \$\\hat\{([A-D])\}\$, \$\\hat\{([A-D])\}\$ e \$\\hat\{([A-D])\}\$ misurano "
        + DEG + ", " + DEG + " e " + DEG + r"\. Quanto misura l'angolo \$\\hat\{([A-D])\}\$\?",
        s,
    )
    if m:
        names = [m.group(1), m.group(2), m.group(3)]
        vals = [int(m.group(i)) for i in (4, 5, 6)]
        asked = m.group(7)
        if len(set(names + [asked])) != 4:
            errs.append("the four angles are not the four vertices")
        d = 360 - sum(vals)
        for v in vals + [d]:
            if not 45 <= v <= 150:
                errs.append(f"angle {v} outside [45, 150]")
        if any(v % 5 for v in vals):
            errs.append("given angles not multiples of 5")
        expect_number(errs, sample, {d}, "deg")
        return "quadrilatero"
    m = re.fullmatch(r"Nel parallelogramma \$ABCD\$ l'angolo (\$\\hat\{[A-D]\}\$) misura " + DEG + r"\. Quanto misura l'angolo (\$\\hat\{[A-D]\}\$)\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    g, a, q = m.group(1).strip("$"), int(m.group(2)), m.group(3).strip("$")
    if not 25 <= a <= 155 or a == 90:
        errs.append(f"given angle {a} outside [25, 155] or right")
    found, _ = solve_angles("parallelogramma", [(g, a)], q)
    expect_number(errs, sample, found, "deg")
    gi, qi = ORDER.index(g[-2]), ORDER.index(q[-2])
    if gi == qi:
        errs.append("asked angle is the given one")
    return "opposto" if (gi - qi) % 4 == 2 else "consecutivo"


# ---------------------------------------------------------------------------
# Level 2

SIDE_RE = r"\$([A-D]{2})\$"


def consecutive(s1, s2):
    return len(set(s1) & set(s2)) == 1


def half_of(seg):
    """AM, MC -> AC; BM, MD -> BD (the halves of the diagonals, M their common point)."""
    ends = seg.replace("M", "")
    if len(ends) != 1 or "M" not in seg:
        return None
    return "AC" if ends in "AC" else "BD"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Nel parallelogramma \$ABCD\$ il lato " + SIDE_RE + r" misura \$(\d+)\$ cm e il lato " + SIDE_RE + r" misura \$(\d+)\$ cm\. Quanto misura il perimetro\?", s)
    if m:
        s1, a, s2, b = m.group(1), int(m.group(2)), m.group(3), int(m.group(4))
        if not consecutive(s1, s2):
            errs.append("the two sides are not consecutive")
        expect_number(errs, sample, {2 * (a + b)}, "cm")
        return "lati"
    m = re.fullmatch(r"Il parallelogramma \$ABCD\$ ha il perimetro di \$(\d+)\$ cm e il lato " + SIDE_RE + r" di \$(\d+)\$ cm\. Quanto misura il lato " + SIDE_RE + r"\?", s)
    if m:
        P, s1, a, s2 = int(m.group(1)), m.group(2), int(m.group(3)), m.group(4)
        if not consecutive(s1, s2):
            errs.append("the asked side is not consecutive to the given one")
        b = F(P, 2) - a
        if b <= 0:
            errs.append("the perimeter is too small for the given side")
        expect_number(errs, sample, {b}, "cm")
        return "lati"
    m = re.fullmatch(r"Il rombo \$ABCD\$ ha il perimetro di \$(\d+)\$ cm\. Quanto misura il lato " + SIDE_RE + r"\?", s)
    if m:
        expect_number(errs, sample, {F(int(m.group(1)), 4)}, "cm")
        return "lati"
    m = re.fullmatch(r"Nel rombo \$ABCD\$ il lato " + SIDE_RE + r" misura \$(\d+)\$ cm\. Quanto misura il perimetro\?", s)
    if m:
        expect_number(errs, sample, {4 * int(m.group(2))}, "cm")
        return "lati"
    m = re.fullmatch(
        r"Nel (parallelogramma|rettangolo) \$ABCD\$ (le diagonali si incontrano nel punto \$M\$ e )?(la diagonale|il segmento) \$([A-DM]{2})\$ misura \$(\d+)\$ cm\. Quanto misura (la diagonale|il segmento) \$([A-DM]{2})\$\?",
        s,
    )
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    fig, hasM, gk, g, v, ak, a = m.group(1), bool(m.group(2)), m.group(3), m.group(4), int(m.group(5)), m.group(6), m.group(7)
    for kind, seg in ((gk, g), (ak, a)):
        is_diag = seg in ("AC", "BD")
        if (kind == "la diagonale") != is_diag:
            errs.append(f"{kind} {seg}")
        if not is_diag and half_of(seg) is None:
            errs.append(f"unknown segment {seg}")
        if not is_diag and not hasM:
            errs.append("a half of a diagonal without the point M")
    # lengths known: each diagonal and each half, from the rules of the lesson
    diag = {}
    gd = g if g in ("AC", "BD") else half_of(g)
    if gd is None:
        return "diagonali"
    diag[gd] = F(v) if g == gd else 2 * F(v)  # the diagonals bisect each other
    if fig == "rettangolo":
        other = "BD" if gd == "AC" else "AC"
        diag[other] = diag[gd]  # congruent diagonals
    ad = a if a in ("AC", "BD") else half_of(a)
    if ad not in diag:
        errs.append(f"{a} is not determined by the data")
        return "diagonali"
    truth = diag[ad] if a == ad else diag[ad] / 2
    if a == g:
        errs.append("asked segment is the given one")
    expect_number(errs, sample, {truth}, "cm")
    return "diagonali"


# ---------------------------------------------------------------------------
# Level 3


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Nel (rombo|rettangolo) \$ABCD\$ le diagonali si incontrano nel punto \$M\$ e l'angolo \$(" + ANG + r")\$ misura " + DEG + r"\. Quanto misura l'angolo \$(" + ANG + r")\$\?",
        s,
    )
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    fig, g, v, q = m.group(1), m.group(2), int(m.group(3)), m.group(4)
    if g == q:
        errs.append("asked angle is the given one")
    found, _ = solve_angles(fig, [(g, v)], q)
    truth = expect_number(errs, sample, found, "deg")
    if truth is not None and truth == 90:
        errs.append("asked angle is the right angle at M")
    if fig == "rombo" and v in (90, 45):
        errs.append("the rhombus is a square")
    return fig


# ---------------------------------------------------------------------------
# Level 4

ISO = r"Nel trapezio isoscele \$ABCD\$, con le basi \$AB\$ e \$DC\$,"
RETT = r"Nel trapezio rettangolo \$ABCD\$, con le basi \$AB\$ e \$DC\$ e gli angoli retti in \$A\$ e in \$D\$,"
EXPR = r"\$(\d*)x(?: ([+-]) (\d+)\^\\circ)?\$"


def expr(m, i):
    p = int(m.group(i)) if m.group(i) else 1
    q = int(m.group(i + 2)) if m.group(i + 2) else 0
    if m.group(i + 1) == "-":
        q = -q
    if m.group(i) == "1":
        errs_extra.append("coefficient 1 written")
    if m.group(i + 2) == "0":
        errs_extra.append("term + 0 written")
    return p, q


errs_extra = []


def level4(sample, errs):
    s = prose(sample["problem"])
    fig = "isoscele" if s.startswith("Nel trapezio isoscele") else "trapezio-rettangolo"
    head = ISO if fig == "isoscele" else RETT
    m = re.fullmatch(head + r" l'angolo \$(\\hat\{[A-D]\})\$ misura " + DEG + r"\. Quanto misura l'angolo \$(\\hat\{[A-D]\})\$\?", s)
    if m:
        g, v, q = m.group(1), int(m.group(2)), m.group(3)
        if g == q:
            errs.append("asked angle is the given one")
        found, _ = solve_angles(fig, [(g, v)], q)
        truth = expect_number(errs, sample, found, "deg")
        if truth == 90:
            errs.append("asked a right angle of the trapezio")
        return "un-angolo"
    m = re.fullmatch(head + r" l'angolo \$(\\hat\{[A-D]\})\$ misura " + EXPR + r" e l'angolo \$(\\hat\{[A-D]\})\$ misura " + EXPR + r"\. Quanto misura l'angolo \$(\\hat\{[A-D]\})\$\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    errs_extra.clear()
    n1, e1, n2, e2, q = m.group(1), expr(m, 2), m.group(5), expr(m, 6), m.group(9)
    errs.extend(errs_extra)
    if n1 == n2:
        errs.append("the same angle twice")
    found, xs = solve_angles(fig, [(n1, e1), (n2, e2)], q)
    truth = expect_number(errs, sample, found, "deg")
    if len(xs) == 1:
        x = next(iter(xs))
        if abs(x - round(x)) > 1e-6 or x < 1:
            errs.append(f"x = {x} is not a positive integer")
        elif str(int(round(x))) != sample["params"].get("x"):
            errs.append(f"params.x {sample['params'].get('x')} != {x}")
        else:
            for p, qq in (e1, e2):
                val = p * round(x) + qq
                if not 30 <= val <= 150:
                    errs.append(f"angle {val} outside [30, 150]")
            if truth is not None and truth == round(x):
                errs.append("the answer equals x")
    if truth == 90:
        errs.append("asked a right angle of the trapezio")
    return "equazione"


# ---------------------------------------------------------------------------
# Exact geometry on integer coordinates (levels 5, 6, 7)


def vsub(p, q):
    return (p[0] - q[0], p[1] - q[1])


def n2(u):
    return u[0] * u[0] + u[1] * u[1]


def sgn(x):
    return (x > 0) - (x < 0)


def parallel(p, q, r, s):
    return cross(vsub(q, p), vsub(s, r)) == 0


def perp(p, q, r, s):
    return dot(vsub(q, p), vsub(s, r)) == 0


def seg_eq(p, q, r, s):
    return n2(vsub(q, p)) == n2(vsub(s, r))


def ang_cmp(a1, a2, supp=False):
    """a = (vertex, x, y). Equal (or supplementary) angles, exactly: compare the cosines."""
    (v1, x1, y1), (v2, x2, y2) = a1, a2
    u1, w1, u2, w2 = vsub(x1, v1), vsub(y1, v1), vsub(x2, v2), vsub(y2, v2)
    d1, d2 = dot(u1, w1), dot(u2, w2)
    if sgn(d1) != (-sgn(d2) if supp else sgn(d2)):
        return False
    return d1 * d1 * n2(u2) * n2(w2) == d2 * d2 * n2(u1) * n2(w1)


def right(v, x, y):
    return dot(vsub(x, v), vsub(y, v)) == 0


def interior(P, i):
    return (P[i], P[(i - 1) % 4], P[(i + 1) % 4])


def meet(P):
    """Intersection of the diagonals P0P2 and P1P3, exactly."""
    A, B, C, D = P
    lam = F(cross(vsub(B, A), vsub(D, B)), cross(vsub(C, A), vsub(D, B)))
    return (A[0] + lam * (C[0] - A[0]), A[1] + lam * (C[1] - A[1]))


def convex(P):
    s = [sgn(cross(vsub(P[(i + 1) % 4], P[i]), vsub(P[(i + 2) % 4], P[(i + 1) % 4]))) for i in range(4)]
    return all(x == s[0] != 0 for x in s)


def families(P):
    """The families of the lesson, from the definitions (trapezio: two only opposite sides parallel)."""
    fam = set()
    p1, p2 = parallel(P[0], P[1], P[3], P[2]), parallel(P[1], P[2], P[0], P[3])
    retti = all(right(*interior(P, i)) for i in range(4))
    lati = all(seg_eq(P[i], P[(i + 1) % 4], P[0], P[1]) for i in range(4))
    if p1 and p2:
        fam.add("par")
    if retti:
        fam.add("rett")
    if lati:
        fam.add("rombo")
    if retti and lati:
        fam.add("quad")
    if p1 != p2:
        fam.add("trap")
        # the legs are the two sides that are not parallel
        legs = [(P[1], P[2]), (P[3], P[0])] if p1 else [(P[0], P[1]), (P[2], P[3])]
        base = (P[0], P[1]) if p1 else (P[1], P[2])
        if seg_eq(*legs[0], *legs[1]):
            fam.add("trap-iso")
        if any(perp(*leg, *base) for leg in legs):
            fam.add("trap-rett")
    return frozenset(fam)


DIRS = [(0, 5), (3, 4), (4, 3), (-3, 4), (-4, 3)]


@lru_cache(maxsize=None)
def bank():
    """Convex quadrilaterals ABCD with integer coordinates: from two diagonals AC (on the x axis) and BD crossing at
    (5t, 0), plus right trapezi. Each with its families."""
    shapes = set()
    for L in (6, 12):
        for t in range(1, L):
            for dx, dy in DIRS:
                for s_ in range(1, 9):
                    for u in range(1, 9):
                        P = ((0, 0), (5 * t - s_ * dx, -s_ * dy), (5 * L, 0), (5 * t + u * dx, u * dy))
                        shapes.add(P)
    for b, c, h in product(range(1, 9), range(1, 9), range(1, 5)):
        if b != c:
            shapes.add(((0, 0), (b, 0), (c, h), (0, h)))
    out = []
    for P in sorted(shapes):
        if convex(P):
            out.append((P, families(P)))
    return out


def relabelings(P):
    """The eight ways to call the vertices of the same quadrilateral ABCD (in order around it)."""
    for k in range(4):
        rot = P[k:] + P[:k]
        yield rot
        yield (rot[0], rot[3], rot[2], rot[1])


@lru_cache(maxsize=None)
def labelled_bank():
    return [(Q, fam) for P, fam in bank() for Q in relabelings(P)]


FAMILY_NAME = {
    "par": "Parallelogramma",
    "rett": "Rettangolo",
    "rombo": "Rombo",
    "quad": "Quadrato",
    "trap": "Trapezio",
    "trap-iso": "Trapezio isoscele",
    "trap-rett": "Trapezio rettangolo",
    "nessuna": "Solo quadrilatero",
}
RANK = {"par": 1, "trap": 1, "rett": 2, "rombo": 2, "trap-iso": 2, "trap-rett": 2, "quad": 3}


def most_precise(fams):
    """The most precise family shared by all the shapes: the one of highest rank, which must be unique."""
    common = frozenset.intersection(*fams) if fams else frozenset()
    if not common:
        return "nessuna"
    top = max(RANK[f] for f in common)
    best = [f for f in common if RANK[f] == top]
    if len(best) != 1:
        raise ValueError(f"no single most precise family in {sorted(common)}")
    return best[0]


# ---------------------------------------------------------------------------
# Level 5: the givens as formulas


def parse_given(item, names, mname):
    """A given as a predicate on (P, M): P the four vertices, M the meeting point of the diagonals (lazily)."""
    idx = {c: i for i, c in enumerate(names)}

    def pt(c, P, M):
        if c == mname:
            return M()
        return P[idx[c]]

    def seg(tok):
        if not re.fullmatch(r"[A-Z]{2}", tok) or any(c not in idx and c != mname for c in tok):
            raise ValueError(f"not a segment: {tok!r}")
        return tok

    item = item.strip()
    m = re.fullmatch(r"(.+) = 90\^\\circ", item)
    if m:
        vs = []
        for part in m.group(1).split(" = "):
            h = re.fullmatch(r"\\hat\{([A-Z])\}", part.strip())
            if not h or h.group(1) not in idx:
                raise ValueError(f"not an angle: {part!r}")
            vs.append(idx[h.group(1)])
        return lambda P, M: all(right(*interior(P, i)) for i in vs)
    for op, fn in ((r"\parallel", parallel), (r"\nparallel", lambda *a: not parallel(*a)), (r"\perp", perp)):
        parts = item.split(f" {op} ")
        if len(parts) == 2 and "\\" not in parts[0] + parts[1]:
            a, b = seg(parts[0]), seg(parts[1])
            return lambda P, M, a=a, b=b, fn=fn: fn(pt(a[0], P, M), pt(a[1], P, M), pt(b[0], P, M), pt(b[1], P, M))
    parts = [x.strip() for x in item.split(r" \cong ")]
    if len(parts) >= 2:
        if all(re.fullmatch(r"\\hat\{[A-Z]\}", x) for x in parts):
            vs = [idx[x[5]] for x in parts]
            return lambda P, M: all(ang_cmp(interior(P, vs[0]), interior(P, j)) for j in vs[1:])
        segs = [seg(x) for x in parts]
        return lambda P, M: all(seg_eq(pt(segs[0][0], P, M), pt(segs[0][1], P, M), pt(s[0], P, M), pt(s[1], P, M)) for s in segs[1:])
    raise ValueError(f"given not understood: {item!r}")


@lru_cache(maxsize=None)
def recognise(names, mname, items):
    preds = [parse_given(i, names, mname) for i in items]
    fams = []
    for P, fam in labelled_bank():
        cache = {}

        def M(P=P, cache=cache):
            if "m" not in cache:
                cache["m"] = meet(P)
            return cache["m"]

        if all(p(P, M) for p in preds):
            fams.append(fam)
    if not fams:
        raise ValueError("no quadrilateral of the bank satisfies the givens")
    return most_precise(fams)


def level5(sample, errs):
    b = blocks(sample["problem"])
    if [k for k, _ in b] != ["text", "math", "text"]:
        errs.append("level 5 layout: text, givens, question")
        return None
    intro, givens, question = b[0][1], b[1][1], b[2][1]
    m = re.fullmatch(r"Le diagonali del quadrilatero \$([A-Z]{4})\$ si incontrano nel punto \$([A-Z])\$\. Si sa soltanto che:", intro)
    m2 = re.fullmatch(r"Del quadrilatero \$([A-Z]{4})\$ si sa soltanto che:", intro)
    if not (m or m2):
        errs.append(f"level 5 intro not recognised: {intro!r}")
        return None
    names = (m or m2).group(1)
    mname = m.group(2) if m else None
    if len(set(names)) != 4 or (mname and mname in names):
        errs.append("repeated letters")
    if question != "Qual è il nome più preciso che gli si può dare con certezza?":
        errs.append(f"question {question!r}")
    items = tuple(x.strip() for x in givens.split(r"\quad"))
    if mname and not any(mname in i for i in items):
        errs.append("the point of the diagonals is named but not used")
    # the same givens with the letters of the lesson, so that the bank is searched once per set of givens
    table = dict(zip(names, "ABCD"))
    if mname:
        table[mname] = "M"
    canon = tuple(re.sub(r"(?<!\\)[A-Z]", lambda c: table.get(c.group(0), "?"), i) for i in items)
    try:
        truth = recognise("ABCD", "M" if mname else None, canon)
    except ValueError as e:
        errs.append(str(e))
        return None
    ans = sample["answer"]
    opts = ans.get("options", [])
    keys = [o["values"][0] for o in opts]
    if ans.get("kind") != "choice" or len(opts) != 4 or len(set(keys)) != 4:
        errs.append("level 5 needs four distinct options")
        return truth
    for o in opts:
        k = o["values"][0]
        if k not in FAMILY_NAME or o["latex"] != f"\\text{{{FAMILY_NAME[k]}}}":
            errs.append(f"option {o['latex']!r} / {k!r} not a family")
    if keys[ans["correct"]] != truth:
        errs.append(f"correct option {keys[ans['correct']]} != {truth}")
    check_same_choice(errs, sample)
    return None


def check_same_choice(errs, sample):
    ch = sample.get("choice")
    if ch is None:
        errs.append("no choice variant")
    elif ch != sample["answer"]:
        errs.append("choice variant differs from the answer")


# ---------------------------------------------------------------------------
# Level 6: statements parsed from their text and decided on the bank

NOUNS = {
    "parallelogramma": "par",
    "rettangolo": "rett",
    "rombo": "rombo",
    "quadrato": "quad",
    "trapezio isoscele": "trap-iso",
    "trapezio": "trap",
    "quadrilatero": "any",
}
NOUN_RE = "(" + "|".join(sorted(NOUNS, key=len, reverse=True)) + ")"


def all_i(f):
    return lambda P: all(f(P, i) for i in range(4))


PROPS = {
    "le diagonali si tagliano a metà": lambda P: (P[0][0] + P[2][0], P[0][1] + P[2][1]) == (P[1][0] + P[3][0], P[1][1] + P[3][1]),
    "le diagonali sono congruenti": lambda P: seg_eq(P[0], P[2], P[1], P[3]),
    "le diagonali sono perpendicolari": lambda P: perp(P[0], P[2], P[1], P[3]),
    "le diagonali sono bisettrici degli angoli": all_i(lambda P, i: ang_cmp((P[i], P[(i - 1) % 4], P[(i + 2) % 4]), (P[i], P[(i + 2) % 4], P[(i + 1) % 4]))),
    "gli angoli opposti sono congruenti": lambda P: ang_cmp(interior(P, 0), interior(P, 2)) and ang_cmp(interior(P, 1), interior(P, 3)),
    "gli angoli opposti sono supplementari": lambda P: ang_cmp(interior(P, 0), interior(P, 2), True) and ang_cmp(interior(P, 1), interior(P, 3), True),
    "gli angoli consecutivi sono supplementari": all_i(lambda P, i: ang_cmp(interior(P, i), interior(P, (i + 1) % 4), True)),
    "gli angoli consecutivi sono congruenti": all_i(lambda P, i: ang_cmp(interior(P, i), interior(P, (i + 1) % 4))),
    "i lati opposti sono congruenti": lambda P: seg_eq(P[0], P[1], P[2], P[3]) and seg_eq(P[1], P[2], P[3], P[0]),
}


def any_i(f):
    return lambda P: any(f(P, i) for i in range(4))


CONDS = {
    "le diagonali perpendicolari": PROPS["le diagonali sono perpendicolari"],
    "le diagonali congruenti": PROPS["le diagonali sono congruenti"],
    "le diagonali che si tagliano a metà": PROPS["le diagonali si tagliano a metà"],
    "due lati opposti paralleli": lambda P: parallel(P[0], P[1], P[3], P[2]) or parallel(P[1], P[2], P[0], P[3]),
    "due lati opposti paralleli e congruenti": any_i(lambda P, i: i < 2 and parallel(P[i], P[i + 1], P[(i + 3) % 4], P[i + 2]) and seg_eq(P[i], P[i + 1], P[(i + 3) % 4], P[i + 2])),
    "un angolo retto": any_i(lambda P, i: right(*interior(P, i))),
    "due lati consecutivi congruenti": any_i(lambda P, i: seg_eq(P[i], P[(i + 1) % 4], P[(i + 1) % 4], P[(i + 2) % 4])),
}


def members(fam):
    return [P for P, f in bank() if fam == "any" or fam in f]


@lru_cache(maxsize=None)
def statement_truth(text):
    m = re.fullmatch(r"Ogni " + NOUN_RE + r" è un " + NOUN_RE, text)
    if m:
        xs = members(NOUNS[m.group(1)])
        assert xs, text
        return all(NOUNS[m.group(2)] in fam for P, fam in bank() if NOUNS[m.group(1)] in fam)
    m = re.fullmatch(r"Nessun " + NOUN_RE + r" è un " + NOUN_RE, text)
    if m:
        assert members(NOUNS[m.group(1)]), text
        return not any(NOUNS[m.group(2)] in fam for P, fam in bank() if NOUNS[m.group(1)] in fam)
    m = re.fullmatch(r"In ogni " + NOUN_RE + " (.+)", text)
    if m and m.group(2) in PROPS:
        xs = members(NOUNS[m.group(1)])
        assert xs, text
        return all(PROPS[m.group(2)](P) for P in xs)
    m = re.fullmatch(r"Se un " + NOUN_RE + r" ha (.+), è un " + NOUN_RE, text)
    if m and m.group(2) in CONDS:
        xs = [(P, fam) for P, fam in bank() if (NOUNS[m.group(1)] == "any" or NOUNS[m.group(1)] in fam) and CONDS[m.group(2)](P)]
        assert xs, text
        return all(NOUNS[m.group(3)] in fam for P, fam in xs)
    raise ValueError(f"statement not understood: {text!r}")


def option_text(latex):
    m = re.fullmatch(r"\\begin\{gathered\} (.*) \\end\{gathered\}", latex)
    lines = m.group(1).split(r" \\ ") if m else [latex]
    words = []
    for line in lines:
        s = text_of(line)
        if s is None:
            raise ValueError(f"option line not text: {line!r}")
        words.append(s)
    return " ".join(words)


def level6(sample, errs):
    q = prose(sample["problem"])
    if q not in ("Quale di queste affermazioni è vera?", "Quale di queste affermazioni è falsa?"):
        errs.append(f"question {q!r}")
        return None
    want = q.endswith("vera?")
    ans = sample["answer"]
    opts = ans.get("options", [])
    if ans.get("kind") != "choice" or len(opts) != 4:
        errs.append("level 6 needs four options")
        return None
    try:
        texts = [option_text(o["latex"]) for o in opts]
        truths = [statement_truth(t) for t in texts]
    except (ValueError, AssertionError) as e:
        errs.append(f"statement: {e}")
        return None
    if len(set(texts)) != 4:
        errs.append("repeated statements")
    good = [i for i, tv in enumerate(truths) if tv == want]
    if good != [ans["correct"]]:
        errs.append(f"{len(good)} options are {'true' if want else 'false'}; correct = {ans['correct']}, truths {truths}")
    check_same_choice(errs, sample)
    return "vera" if want else "falsa"


# ---------------------------------------------------------------------------
# Level 7: the justification of a step

JUST = {
    "Sono angoli alterni interni": "alterni",
    "Sono angoli corrispondenti": "corrispondenti",
    "Sono angoli coniugati interni": "coniugati",
    "Sono angoli opposti al vertice": "opposti-vertice",
    "Primo criterio di congruenza": "crit1",
    "Secondo criterio di congruenza": "crit2",
    "Terzo criterio di congruenza": "crit3",
    "Per ipotesi": "ipotesi",
    "Lati opposti di un parallelogramma": "lati-opp",
    "Sono entrambi angoli retti": "retti",
    "I lati del rombo sono congruenti": "lati-rombo",
    "Le diagonali si tagliano a metà": "diag-meta",
    "Sono adiacenti e congruenti": "adiacenti",
    "Metà di segmenti congruenti": "meta",
    "Stanno su due rette parallele": "su-parallele",
    "Due lati opposti paralleli e congruenti": "cond4",
    "Lati opposti congruenti a due a due": "cond1",
    "Diagonali che si tagliano a metà": "cond3",
    "Ha i lati opposti paralleli": "def-par",
    "Angoli alla base di un triangolo isoscele": "base-isoscele",
    "Angoli alla base del trapezio isoscele": "base-trapezio",
    "Alterni interni congruenti": "par-alterni",
    "Corrispondenti congruenti": "par-corrispondenti",
    "Opposti al vertice congruenti": "par-opposti",
}
PAIR = {"alterni", "corrispondenti", "coniugati", "opposti-vertice"}
CRIT = {"crit1", "crit2", "crit3"}

PARALLELOGRAM = {"A": (0, 0), "B": (8, 0), "C": (11, 4), "D": (3, 4)}
TRAPEZIO = {"A": (0, 0), "B": (10, 0), "C": (7, 4), "D": (3, 4), "E": (4, 0)}
FIGURES = {
    "parallelogramma": dict(PARALLELOGRAM, M=(F(11, 2), F(2))),
    "punti-medi": dict(PARALLELOGRAM, M=(4, 0), N=(7, 4)),
    "rettangolo": {"A": (0, 0), "B": (8, 0), "C": (8, 5), "D": (0, 5)},
    "rombo": {"A": (0, 0), "B": (5, 0), "C": (8, 4), "D": (3, 4), "M": (4, 2)},
    "trapezio": TRAPEZIO,
}

# (context, figure, [(claim, known, answer)]), from the proofs of the lesson
PROOFS = [
    (
        "Ipotesi: $ABCD$ è un quadrilatero con $AB \\parallel DC$ e $AD \\parallel BC$. Si traccia la diagonale $AC$ e si confrontano i triangoli $ABC$ e $CDA$.",
        "parallelogramma",
        [
            ("\\widehat{BAC} \\cong \\widehat{DCA}", None, "alterni"),
            ("\\widehat{BCA} \\cong \\widehat{DAC}", None, "alterni"),
            ("ABC \\cong CDA", "Si sa già che $AC$ è in comune, $\\widehat{BAC} \\cong \\widehat{DCA}$ e $\\widehat{BCA} \\cong \\widehat{DAC}$.", "crit2"),
        ],
    ),
    (
        "$ABCD$ è un parallelogramma e le diagonali $AC$ e $BD$ si incontrano nel punto $M$. Si confrontano i triangoli $ABM$ e $CDM$.",
        "parallelogramma",
        [
            ("AB \\cong DC", None, "lati-opp"),
            ("\\widehat{MAB} \\cong \\widehat{MCD}", None, "alterni"),
            ("\\widehat{MBA} \\cong \\widehat{MDC}", None, "alterni"),
            ("ABM \\cong CDM", "Si sa già che $AB \\cong DC$, $\\widehat{MAB} \\cong \\widehat{MCD}$ e $\\widehat{MBA} \\cong \\widehat{MDC}$.", "crit2"),
        ],
    ),
    (
        "Ipotesi: le diagonali $AC$ e $BD$ del quadrilatero $ABCD$ si incontrano in $M$, con $AM \\cong MC$ e $BM \\cong MD$. Tesi: $AB \\parallel DC$. Si confrontano i triangoli $AMB$ e $CMD$.",
        "parallelogramma",
        [
            ("\\widehat{AMB} \\cong \\widehat{CMD}", None, "opposti-vertice"),
            ("AMB \\cong CMD", "Si sa già che $AM \\cong MC$, $BM \\cong MD$ e $\\widehat{AMB} \\cong \\widehat{CMD}$.", "crit1"),
            ("AB \\parallel DC", "Si sa già che $\\widehat{MAB} \\cong \\widehat{MCD}$, e $M$ sta su $AC$.", "par-alterni"),
        ],
    ),
    (
        "Ipotesi: $ABCD$ è un parallelogramma, $M$ è il punto medio di $AB$ e $N$ è il punto medio di $DC$. Tesi: $AMCN$ è un parallelogramma.",
        "punti-medi",
        [
            ("AB \\cong DC", None, "lati-opp"),
            ("AM \\cong NC", "Si sa già che $AB \\cong DC$.", "meta"),
            ("AM \\parallel NC", None, "su-parallele"),
            ("AMCN \\text{ è un parallelogramma}", "Si sa già che $AM \\cong NC$ e $AM \\parallel NC$.", "cond4"),
        ],
    ),
    (
        "$ABCD$ è un rettangolo. Per dimostrare che $AC \\cong BD$ si confrontano i triangoli $ABC$ e $BAD$.",
        "rettangolo",
        [
            ("BC \\cong AD", None, "lati-opp"),
            ("\\widehat{ABC} \\cong \\widehat{BAD}", None, "retti"),
            ("ABC \\cong BAD", "Si sa già che $AB$ è in comune, $BC \\cong AD$ e $\\widehat{ABC} \\cong \\widehat{BAD}$.", "crit1"),
        ],
    ),
    (
        "$ABCD$ è un rombo e le diagonali si incontrano nel punto $M$. Si confrontano i triangoli $AMB$ e $AMD$.",
        "rombo",
        [
            ("AB \\cong AD", None, "lati-rombo"),
            ("BM \\cong MD", None, "diag-meta"),
            ("AMB \\cong AMD", "Si sa già che $AB \\cong AD$, $BM \\cong MD$ e $AM$ è in comune.", "crit3"),
            ("\\widehat{AMB} = \\widehat{AMD} = 90^\\circ", "Si sa già che $\\widehat{AMB} \\cong \\widehat{AMD}$.", "adiacenti"),
        ],
    ),
    (
        "Ipotesi: $ABCD$ è un trapezio con le basi $AB$ e $DC$, e $AD \\cong BC$. Da $C$ si traccia la parallela al lato $AD$, che incontra $AB$ in $E$.",
        "trapezio",
        [
            ("AECD \\text{ è un parallelogramma}", "Si sa già che $AE \\parallel DC$ e $AD \\parallel EC$.", "def-par"),
            ("EC \\cong AD", None, "lati-opp"),
            ("\\widehat{CEB} \\cong \\widehat{CBE}", "Si sa già che $EC \\cong BC$.", "base-isoscele"),
            ("\\widehat{CEB} \\cong \\widehat{DAB}", None, "corrispondenti"),
        ],
    ),
    (
        "$ABCD$ è un trapezio isoscele con le basi $AB$ e $DC$. Per dimostrare che $AC \\cong BD$ si confrontano i triangoli $ABC$ e $BAD$.",
        "trapezio",
        [
            ("BC \\cong AD", None, "ipotesi"),
            ("\\widehat{ABC} \\cong \\widehat{BAD}", None, "base-trapezio"),
            ("ABC \\cong BAD", "Si sa già che $AB$ è in comune, $BC \\cong AD$ e $\\widehat{ABC} \\cong \\widehat{BAD}$.", "crit1"),
        ],
    ),
]

LETTER_SETS = ["ABCDMNE", "PQRSOTH", "EFGHOKL", "KLMNOPQ"]


def rename(s, letters):
    table = dict(zip("ABCDMNE", letters))

    def math(m):
        return "$" + re.sub(r"[ABCDEMN]", lambda c: table[c.group(0)], m.group(1)) + "$"

    return re.sub(r"\$([^$]*)\$", math, s)


def rename_math(s, letters):
    table = dict(zip("ABCDMNE", letters))
    return re.sub(r"[ABCDEMN]", lambda c: table[c.group(0)], s)


def angle_pts(fig, name):
    m = re.fullmatch(r"\\widehat\{([A-Z])([A-Z])([A-Z])\}", name.strip())
    if not m:
        raise ValueError(f"not an angle {name!r}")
    return tuple(fig[c] for c in (m.group(2), m.group(1), m.group(3)))


def pair_type(a1, a2):
    """Two angles (vertex, x, y): vertical, or the pair made by two lines and the transversal through the vertices."""
    (v1, x1, y1), (v2, x2, y2) = a1, a2
    if v1 == v2:
        def opposite(r, s):
            return cross(vsub(r, v1), vsub(s, v1)) == 0 and dot(vsub(r, v1), vsub(s, v1)) < 0
        if (opposite(x1, x2) and opposite(y1, y2)) or (opposite(x1, y2) and opposite(y1, x2)):
            return "opposti-vertice"
        return None
    t = vsub(v2, v1)

    def split(v, x, y):
        on = [p for p in (x, y) if cross(t, vsub(p, v)) == 0]
        if len(on) != 1:
            return None
        other = y if on[0] is x else x
        return on[0], other

    s1, s2 = split(v1, x1, y1), split(v2, x2, y2)
    if not s1 or not s2:
        return None
    toward1 = dot(vsub(s1[0], v1), t) > 0
    toward2 = dot(vsub(s2[0], v2), t) < 0
    side1, side2 = sgn(cross(t, vsub(s1[1], v1))), sgn(cross(t, vsub(s2[1], v2)))
    if not parallel(v1, s1[1], v2, s2[1]):
        return None
    if toward1 and toward2:
        return "alterni" if side1 != side2 else "coniugati"
    if toward1 != toward2 and side1 == side2:
        return "corrispondenti"
    return None


def claim_true(fig, claim):
    c = claim.strip()
    m = re.fullmatch(r"([A-Z]{4}) \\text\{ è un parallelogramma\}", c)
    if m:
        P = [fig[x] for x in m.group(1)]
        return parallel(P[0], P[1], P[3], P[2]) and parallel(P[1], P[2], P[0], P[3])
    m = re.fullmatch(r"(\\widehat\{[A-Z]{3}\}) = (\\widehat\{[A-Z]{3}\}) = 90\^\\circ", c)
    if m:
        return all(right(*angle_pts(fig, g)) for g in (m.group(1), m.group(2)))
    m = re.fullmatch(r"([A-Z]{2}) \\parallel ([A-Z]{2})", c)
    if m:
        a, b = m.group(1), m.group(2)
        return parallel(fig[a[0]], fig[a[1]], fig[b[0]], fig[b[1]])
    m = re.fullmatch(r"(\\widehat\{[A-Z]{3}\}) \\cong (\\widehat\{[A-Z]{3}\})", c)
    if m:
        return ang_cmp(angle_pts(fig, m.group(1)), angle_pts(fig, m.group(2)))
    m = re.fullmatch(r"([A-Z]{2}) \\cong ([A-Z]{2})", c)
    if m:
        a, b = m.group(1), m.group(2)
        return seg_eq(fig[a[0]], fig[a[1]], fig[b[0]], fig[b[1]])
    m = re.fullmatch(r"([A-Z]{3}) \\cong ([A-Z]{3})", c)
    if m:
        t1, t2 = m.group(1), m.group(2)
        return all(seg_eq(fig[t1[i]], fig[t1[(i + 1) % 3]], fig[t2[i]], fig[t2[(i + 1) % 3]]) for i in range(3))
    raise ValueError(f"claim not understood: {claim!r}")


def criterion(fig, claim, known):
    """The congruence criterion that the known elements of the first triangle allow."""
    t1 = re.fullmatch(r"([A-Z]{3}) \\cong ([A-Z]{3})", claim.strip()).group(1)
    sides, angles = set(), set()
    for f in re.findall(r"\$([^$]*)\$ è in comune", known):
        sides.add(frozenset(f))
    for a, b in re.findall(r"\$([A-Z]{2}) \\cong ([A-Z]{2})\$", known):
        sides.add(frozenset(a if set(a) <= set(t1) else b))
    for a, b in re.findall(r"\$(\\widehat\{[A-Z]{3}\}) \\cong (\\widehat\{[A-Z]{3}\})\$", known):
        g = a if set(a[9:12]) <= set(t1) else b
        v = g[10]
        i = t1.index(v)
        tri = (fig[v], fig[t1[(i + 1) % 3]], fig[t1[(i + 2) % 3]])
        if not (ang_cmp(angle_pts(fig, g), tri) or ang_cmp(angle_pts(fig, g), (tri[0], tri[2], tri[1]))):
            raise ValueError(f"{g} is not the angle of {t1} at {v}")
        angles.add(v)
    if any(not s <= set(t1) or len(s) != 2 for s in sides):
        raise ValueError(f"known sides {sides} not of {t1}")
    if len(sides) == 3 and not angles:
        return "crit3"
    if len(sides) == 2 and len(angles) == 1:
        common = set.intersection(*[set(s) for s in sides])
        return "crit1" if common == angles else None
    if len(sides) == 1 and len(angles) == 2:
        return "crit2" if set(next(iter(sides))) == angles else None
    return None


def level7(sample, errs):
    b = blocks(sample["problem"])
    if [k for k, _ in b] != ["text", "math", "text"] or b[2][1] != "Perché vale questo passo?":
        errs.append("level 7 layout: text, claim, question")
        return None
    text, claim = b[0][1], b[1][1]
    match = None
    for (context, figname, steps), (claim0, known, answer), letters in (
        (p, s, L) for p in PROOFS for s in p[2] for L in LETTER_SETS
    ):
        want = rename(context + (f" {known}" if known else "") + " Un passo della dimostrazione dice:", letters)
        if want == text and rename_math(claim0, letters) == claim:
            match = (figname, claim0, known, answer)
            break
    if match is None:
        errs.append(f"level 7: proof step not found: {text!r} / {claim!r}")
        return None
    figname, claim0, known, answer = match
    fig = FIGURES[figname]
    try:
        if not claim_true(fig, claim0):
            errs.append(f"claim {claim0} false on the figure")
        if answer in PAIR:
            a, c = re.fullmatch(r"(\\widehat\{[A-Z]{3}\}) \\cong (\\widehat\{[A-Z]{3}\})", claim0).groups()
            kind = pair_type(angle_pts(fig, a), angle_pts(fig, c))
            if kind != answer:
                errs.append(f"the angles are {kind}, table says {answer}")
        if answer == "par-alterni":
            a, c = re.search(r"\$(\\widehat\{[A-Z]{3}\}) \\cong (\\widehat\{[A-Z]{3}\})\$", known).groups()
            if pair_type(angle_pts(fig, a), angle_pts(fig, c)) != "alterni" or not ang_cmp(angle_pts(fig, a), angle_pts(fig, c)):
                errs.append("par-alterni: the known angles are not congruent alternate angles")
        if answer in CRIT:
            crit = criterion(fig, claim0, known)
            if crit != answer:
                errs.append(f"criterion from the known elements is {crit}, table says {answer}")
    except (ValueError, AttributeError) as e:
        errs.append(f"level 7 geometry: {e}")
    ans = sample["answer"]
    opts = ans.get("options", [])
    try:
        ids = [JUST[option_text(o["latex"])] for o in opts]
    except (KeyError, ValueError) as e:
        errs.append(f"option not a justification: {e}")
        return None
    if len(opts) != 4 or len(set(ids)) != 4:
        errs.append("level 7 needs four distinct justifications")
    if [o["values"][0] for o in opts] != ids:
        errs.append("option values differ from their text")
    if ids[ans["correct"]] != answer:
        errs.append(f"correct option {ids[ans['correct']]} != {answer}")
    if answer in PAIR and not all(i in PAIR for i in ids):
        errs.append("a pair of angles needs pair-of-angles options")
    if answer in CRIT and sum(i in CRIT for i in ids) != 3:
        errs.append("a criterion step needs the three criteria")
    check_same_choice(errs, sample)
    return None


# ---------------------------------------------------------------------------

LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7}


def check(sample):
    errs = []
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    for field in [sample["problem"], sample["solution"], *sample["steps"]]:
        if BANNED.search(field):
            errs.append("banned words")
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    try:
        kind = LEVELS[lvl](sample, errs)
    except ValueError as e:
        return errs + [str(e)], None
    return errs, kind
