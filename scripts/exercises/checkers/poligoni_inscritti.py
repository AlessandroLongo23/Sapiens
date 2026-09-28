"""poligoni-inscritti (Poligoni inscritti e circoscritti), from specs/exercises/poligoni-inscritti.md.

Written from the spec, not from the generator. Every datum is read back from the text the student sees,
never from params, and the answer is found again by building the figure with coordinates:

- level 1: a quadrilateral inscribed in the unit circle with the given angles (the arcs found with a
  linear system, then every angle measured from the coordinates); the asked angle is measured, on two
  different quadrilaterals, to see that the data determine it;
- level 2: for each quadruple of angles, a cyclic quadrilateral with those angles is looked for (the
  same arcs system); it exists for exactly one option, or for all but one;
- level 3: a quadrilateral with an inscribed circle built from its tangent lengths (the radius found by
  bisection), sides and perimeter measured, on two different quadrilaterals;
- level 4: every family of the lesson's table is drawn on a grid of sizes and angles; each shape is tested
  (four vertices on one circle; the bisectors at A and B meet in a point equidistant from the four
  sides), which gives "sempre", "mai" or "a volte" for each family;
- level 5: regular polygons drawn with coordinates, central angle measured, the hexagon's side measured;
- level 6: hexagon and square with exact SymPy coordinates, apothem and side as exact radicals, and the
  answer's LaTeX checked to be in reduced form;
- level 7: the right triangle with SymPy's circumradius and inradius; the isosceles trapezoid with the
  height solved from the tangency of the circle to the leg.
"""
import math
import re

from sympy import Line, Point, Rational, Symbol, Triangle, cos, factorint, gcd, linsolve, nsimplify, pi, simplify, sin, solve, sqrt, symbols, sympify, lambdify

CASE_RANGES = {
    1: {"consecutivi": (0.55, 0.75), "differenza": (0.25, 0.45)},
    2: {"inscrivibile": (0.50, 0.70), "non inscrivibile": (0.30, 0.50)},
    3: {"lato": (0.50, 0.70), "perimetro": (0.30, 0.50)},
    4: {k: (0.13, 0.27) for k in ["sempre inscrivibile", "sempre circoscrivibile", "sempre entrambi", "mai inscrivibile", "mai circoscrivibile"]},
    5: {"angolo al centro": (0.32, 0.48), "numero di lati": (0.22, 0.38), "esagono": (0.22, 0.38)},
    6: {"esagono": (0.32, 0.48), "lato del quadrato": (0.22, 0.38), "apotema del quadrato": (0.22, 0.38)},
    7: {"R triangolo": (0.18, 0.32), "r triangolo": (0.18, 0.32), "trapezio": (0.42, 0.58)},
}

V = "ABCD"


# ---------------------------------------------------------------------------
# Text and numbers

def prose(tex):
    """The words of a LaTeX problem or option: environments, \\text{} and line breaks removed."""
    s = re.sub(r"\\(begin|end)\{(array|gathered)\}(\{l\})?", " ", tex)
    s = s.replace("\\\\", " ")
    out, i = "", 0
    while i < len(s):
        if s.startswith("\\text{", i):
            depth, j = 1, i + 6
            while depth:
                if s[j] == "{":
                    depth += 1
                elif s[j] == "}":
                    depth -= 1
                j += 1
            out += s[i + 6 : j - 1]
            i = j
        else:
            out += s[i]
            i += 1
    return re.sub(r"\s+", " ", out).strip()


def finite(r):
    d = r.q
    for f in (2, 5):
        while d % f == 0:
            d //= f
    return d == 1


def num(s):
    """12, 3{,}5 -> Rational (no trailing zeros)."""
    m = re.fullmatch(r"(\d+)(?:\{,\}(\d+))?", s.strip())
    if not m:
        raise ValueError(f"not a number: {s!r}")
    if m.group(2) and m.group(2).endswith("0"):
        raise ValueError(f"trailing zero: {s}")
    return Rational(s.strip().replace("{,}", "."))


def squarefree(n):
    return n >= 2 and all(e == 1 for e in factorint(n).values())


def length(s):
    """A length as the lesson writes it: 12, 3{,}5, 3\\sqrt{3}, \\frac{5\\sqrt{2}}{2}; the radical reduced."""
    s = s.strip()
    m = re.fullmatch(r"\\frac\{(\d*)\\sqrt\{(\d+)\}\}\{(\d+)\}", s)
    if m:
        k, r, d = int(m.group(1) or 1), int(m.group(2)), int(m.group(3))
        if m.group(1) == "1" or not squarefree(r) or gcd(k, d) != 1 or d == 1:
            raise ValueError(f"radical not reduced: {s}")
        return k * sqrt(r) / d
    m = re.fullmatch(r"(\d*)\\sqrt\{(\d+)\}", s)
    if m:
        k, r = int(m.group(1) or 1), int(m.group(2))
        if m.group(1) in ("1", "0") or not squarefree(r):
            raise ValueError(f"radical not reduced: {s}")
        return k * sqrt(r)
    return num(s)


def option_value(latex, unit):
    pat = {"deg": r"(\d+)\^\\circ", "lati": r"(\d+)\\text\{ lati\}", "cm": r"(.+)\\text\{ cm\}"}[unit]
    m = re.fullmatch(pat, latex)
    if not m:
        raise ValueError(f"option not in {unit}: {latex}")
    return Rational(int(m.group(1))) if unit != "cm" else length(m.group(1))


def same(a, b):
    return simplify(a - b) == 0


def choice_shape(ch, errs):
    if not ch or ch.get("kind") != "choice":
        errs.append("no choice variant")
        return None
    opts = ch["options"]
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    if len({o["latex"] for o in opts}) != len(opts) or len({"|".join(o["values"]) for o in opts}) != len(opts):
        errs.append("options not distinct")
    if not 0 <= ch["correct"] < len(opts):
        errs.append("correct index out of range")
        return None
    return opts


def check_value(sample, truth, unit, errs):
    """The answer (number or reduced radical) and its choice variant, against the truth."""
    ans = sample["answer"]
    if truth.is_rational:
        if ans.get("kind") != "number":
            errs.append("a rational answer must be a number")
        elif Rational(ans["value"]) != truth:
            errs.append(f"answer {ans['value']} != truth {truth}")
        elif unit == "cm" and not finite(truth):
            errs.append(f"periodic length {truth}")
    else:
        if ans.get("kind") != "expression" or ans.get("form") != "simplified":
            errs.append("an irrational answer must be a simplified expression")
        else:
            try:
                if not same(length(ans["latex"]), truth):
                    errs.append(f"answer latex {ans['latex']} != truth {truth}")
            except ValueError as e:
                errs.append(str(e))
            if not same(sympify(ans["value"]), truth):
                errs.append(f"answer value {ans['value']} != truth {truth}")
    opts = choice_shape(sample.get("choice"), errs)
    if opts is None:
        return
    vals = []
    for o in opts:
        try:
            vals.append(option_value(o["latex"], unit))
        except ValueError as e:
            errs.append(str(e))
            return
        if not same(sympify(o["values"][0]), vals[-1]):
            errs.append(f"option values {o['values']} != latex {o['latex']}")
    for i in range(len(vals)):
        for j in range(i):
            if same(vals[i], vals[j]):
                errs.append(f"options {opts[i]['latex']} and {opts[j]['latex']} are the same number")
    right = [i for i, v in enumerate(vals) if same(v, truth)]
    if len(right) != 1:
        errs.append(f"{len(right)} options equal the truth {truth}")
    elif right[0] != sample["choice"]["correct"]:
        errs.append("choice.correct points to a wrong option")
    for v in vals:
        if v <= 0 or (unit == "deg" and v >= 180) or (unit == "lati" and v < 3):
            errs.append(f"implausible option {v}")
        if v.is_rational and not finite(v):
            errs.append(f"periodic option {v}")


# ---------------------------------------------------------------------------
# Cyclic quadrilaterals (levels 1 and 2)

def on_circle(arcs):
    """Vertices A, B, C, D on the unit circle, with arcs AB, BC, CD, DA in degrees."""
    pts, pos = {}, 0.0
    for v, a in zip(V, arcs):
        pts[v] = (math.cos(math.radians(pos)), math.sin(math.radians(pos)))
        pos += a
    return pts


def interior(pts, v):
    i = V.index(v)
    P, Q, R = pts[V[i - 1]], pts[v], pts[V[(i + 1) % 4]]
    a = math.atan2(P[1] - Q[1], P[0] - Q[0]) - math.atan2(R[1] - Q[1], R[0] - Q[0])
    a = abs(math.degrees(a)) % 360
    return 360 - a if a > 180 else a


def cyclic(conditions):
    """Arcs of cyclic quadrilaterals satisfying linear conditions on the angles (as SymPy equations in the
    arcs): two different positive solutions, or [] if there is none."""
    a = symbols("a1:5")
    # Angle at a vertex: half the arc it sees, the one not touching it.
    ang = {"A": (a[1] + a[2]) / 2, "B": (a[2] + a[3]) / 2, "C": (a[3] + a[0]) / 2, "D": (a[0] + a[1]) / 2}
    eqs = [sum(a) - 360] + [c(ang) for c in conditions]
    sol = linsolve(eqs, a)
    if not sol:
        return []
    (gen,) = sol
    free = sorted(set().union(*[e.free_symbols for e in gen]), key=str)
    found = []
    grid = [x / 2 for x in range(1, 720)]
    import itertools

    for vals in itertools.product(grid[::37], repeat=len(free)):
        arcs = [float(e.subs(dict(zip(free, vals)))) for e in gen]
        if all(x > 1e-9 for x in arcs):
            found.append(arcs)
            if len(found) == 2 or not free:
                break
    return found


def check_l1(sample, errs):
    text = prose(sample["problem"])
    m = re.fullmatch(
        r"Il quadrilatero \$ABCD\$ è inscritto in una circonferenza, con \$\\hat\{(\w)\} = (\d+)\^\\circ\$ e \$\\hat\{(\w)\} = (\d+)\^\\circ\$\. "
        r"Quanto misura \$\\hat\{(\w)\}\$\?",
        text,
    )
    m2 = re.fullmatch(
        r"Il quadrilatero \$ABCD\$ è inscritto in una circonferenza, e l'angolo \$\\hat\{(\w)\}\$ supera di \$(\d+)\^\\circ\$ l'angolo \$\\hat\{(\w)\}\$\. "
        r"Quanto misura \$\\hat\{(\w)\}\$\?",
        text,
    )
    if m:
        x, y, asked = m.group(1), m.group(3), m.group(5)
        gx, gy = int(m.group(2)), int(m.group(4))
        if (V.index(y) - V.index(x)) % 4 not in (1, 3):
            errs.append("the two given angles are not consecutive")
        if asked in (x, y):
            errs.append("asks a given angle")
        if any(g % 5 or g < 50 or g > 130 or g == 90 for g in (gx, gy)) or gx == gy or gx + gy == 180:
            errs.append(f"given angles out of spec: {gx}, {gy}")
        conds = [lambda A, x=x, gx=gx: A[x] - gx, lambda A, y=y, gy=gy: A[y] - gy]
        given = {x: gx, y: gy}
        case = "consecutivi"
    elif m2:
        u, d, w, asked = m2.group(1), int(m2.group(2)), m2.group(3), m2.group(4)
        if (V.index(u) - V.index(w)) % 4 != 2:
            errs.append("the two angles are not opposite")
        if asked not in (u, w):
            errs.append("asks an angle not named")
        if d % 10 or d < 10 or d > 100:
            errs.append(f"difference {d} out of spec")
        conds = [lambda A, u=u, w=w, d=d: A[u] - A[w] - d]
        given = {}
        case = "differenza"
    else:
        errs.append(f"unreadable problem: {text}")
        return None
    sols = cyclic(conds)
    if len(sols) < 2:
        errs.append("no inscribed quadrilateral with these data")
        return case
    measured = []
    for arcs in sols:
        pts = on_circle(arcs)
        for v, g in given.items():
            if abs(interior(pts, v) - g) > 1e-6:
                errs.append(f"built quadrilateral has {v} = {interior(pts, v)}, not {g}")
        if case == "differenza" and abs(interior(pts, u) - interior(pts, w) - d) > 1e-6:
            errs.append("built quadrilateral does not have the difference")
        measured.append(interior(pts, asked))
    if abs(measured[0] - measured[1]) > 1e-6:
        errs.append(f"the data do not determine the angle: {measured}")
    truth = Rational(round(measured[0]))
    if abs(measured[0] - float(truth)) > 1e-6:
        errs.append(f"measured angle {measured[0]} not an integer")
    check_value(sample, truth, "deg", errs)
    return case


def check_l2(sample, errs):
    text = prose(sample["problem"])
    m = re.fullmatch(
        r"Di quattro quadrilateri convessi \$ABCD\$ sono dati gli angoli \$\\hat\{A\}\$, \$\\hat\{B\}\$, \$\\hat\{C\}\$, \$\\hat\{D\}\$, in quest'ordine\. "
        r"Quale (è|non è) inscrivibile in una circonferenza\?",
        text,
    )
    if not m:
        errs.append(f"unreadable problem: {text}")
        return None
    want = m.group(1) == "è"
    opts = choice_shape(sample["answer"], errs)
    if opts is None:
        return None
    flags, quads = [], []
    for o in opts:
        parts = o["latex"].split(",\\ ")
        try:
            qd = [int(re.fullmatch(r"(\d+)\^\\circ", p).group(1)) for p in parts]
        except AttributeError:
            errs.append(f"unreadable option {o['latex']}")
            return None
        if len(qd) != 4 or o["values"] != [",".join(map(str, qd))]:
            errs.append(f"bad option {o['latex']}")
            return None
        if sum(qd) != 360 or any(a % 5 or a < 45 or a > 135 for a in qd):
            errs.append(f"angles {qd} not of a convex quadrilateral in spec")
        quads.append(tuple(qd))
        sols = cyclic([lambda A, v=v, a=a: A[v] - a for v, a in zip(V, qd)])
        ok = bool(sols)
        for arcs in sols:
            pts = on_circle(arcs)
            if any(abs(interior(pts, v) - a) > 1e-6 for v, a in zip(V, qd)):
                errs.append(f"built quadrilateral does not have the angles {qd}")
        flags.append(ok)
    if len(set(quads)) != 4:
        errs.append("two options are the same quadrilateral")
    right = [i for i, f in enumerate(flags) if f == want]
    if len(right) != 1:
        errs.append(f"{len(right)} options answer the question")
    elif right[0] != sample["answer"]["correct"]:
        errs.append("correct option is wrong")
    if want and not any(q[0] + q[1] == 180 and q[0] != q[2] for i, q in enumerate(quads) if not flags[i]):
        errs.append("no distractor with consecutive supplementary angles")
    return "inscrivibile" if want else "non inscrivibile"


# ---------------------------------------------------------------------------
# Tangential quadrilaterals (level 3)

def tangential(tl):
    """Vertices of a quadrilateral circumscribed to a circle centred at the origin, from its four tangent
    lengths (at A, B, C, D); the radius solves sum(atan(t / r)) = pi."""
    lo, hi = 1e-9, 1e6
    for _ in range(200):
        r = (lo + hi) / 2
        s = sum(math.atan(t / r) for t in tl)
        lo, hi = (r, hi) if s > math.pi else (lo, r)
    r = (lo + hi) / 2
    pts, pos = [], 0.0
    for t in tl:
        half = math.atan(t / r)
        mid = pos + half
        d = math.hypot(r, t)
        pts.append((d * math.cos(mid), d * math.sin(mid)))
        pos += 2 * half
    # each side tangent: distance from the centre to the side's line is r
    for i in range(4):
        (x1, y1), (x2, y2) = pts[i], pts[(i + 1) % 4]
        dist = abs(x1 * y2 - x2 * y1) / math.hypot(x2 - x1, y2 - y1)
        if abs(dist - r) > 1e-6:
            raise AssertionError("side not tangent")
    return pts


def sides_of(pts):
    return [math.dist(pts[i], pts[(i + 1) % 4]) for i in range(4)]


def build_sides(known):
    """Two quadrilaterals with an inscribed circle and the known sides ({index: length}): tangent lengths
    tA..tD with side i = t_i + t_(i+1), unknown sides left free."""
    t = symbols("tA tB tC tD")
    eqs = [t[i] + t[(i + 1) % 4] - L for i, L in known.items()]
    sol = linsolve(eqs, t)
    if not sol:
        return []
    (gen,) = sol
    free = sorted(set().union(*[e.free_symbols for e in gen]), key=str)
    out = []
    import itertools

    # steps of 3/8: at least two points inside any open interval of length 1 between integers
    grid = [x / 8 for x in range(1, 400, 3)]
    fs = [lambdify(free, e) for e in gen]
    for vals in itertools.product(grid, repeat=len(free)):
        tl = [float(f(*vals)) for f in fs]
        if all(x > 1e-9 for x in tl):
            out.append(tangential(tl))
            if len(out) == 2:
                break
    return out


SIDES = ["AB", "BC", "CD", "DA"]


def check_l3(sample, errs):
    text = prose(sample["problem"])
    m = re.fullmatch(r"Il quadrilatero \$ABCD\$ è circoscritto a una circonferenza, con (.*)\. Quanto misura (il lato \$(\w\w)\$|il perimetro)\?", text)
    if not m:
        errs.append(f"unreadable problem: {text}")
        return None
    known = {}
    for s, L in re.findall(r"\$\\overline\{(\w\w)\} = (\d+)\$ cm", m.group(1)):
        known[SIDES.index(s)] = int(L)
    if any(L < 3 or L > 20 for L in known.values()):
        errs.append(f"side out of 3..20: {known}")
    asked = m.group(3)
    quads = build_sides(known)
    if len(quads) < 2:
        errs.append("no circumscribed quadrilateral with these sides")
        return "lato" if asked else "perimetro"
    vals = []
    for pts in quads:
        ls = sides_of(pts)
        if any(abs(ls[i] - L) > 1e-6 for i, L in known.items()):
            errs.append("built quadrilateral does not have the given sides")
        vals.append(ls[SIDES.index(asked)] if asked else sum(ls))
    if abs(vals[0] - vals[1]) > 1e-6:
        errs.append(f"the data do not determine the answer: {vals}")
    truth = Rational(round(vals[0]))
    if abs(vals[0] - float(truth)) > 1e-6:
        errs.append(f"answer {vals[0]} not an integer")
    if asked:
        if len(known) != 3 or SIDES.index(asked) in known:
            errs.append("the missing side is not the one asked")
        if truth < 3 or truth > 20:
            errs.append(f"missing side {truth} out of 3..20")
    elif len(known) == 2 and set(known) not in ({0, 2}, {1, 3}):
        errs.append("two given sides are not opposite")
    check_value(sample, truth, "cm", errs)
    return "lato" if asked else "perimetro"


# ---------------------------------------------------------------------------
# Level 4: the families of the table, drawn

def concyclic(P):
    (ax, ay), (bx, by), (cx, cy), (dx, dy) = P
    d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
    ux = ((ax**2 + ay**2) * (by - cy) + (bx**2 + by**2) * (cy - ay) + (cx**2 + cy**2) * (ay - by)) / d
    uy = ((ax**2 + ay**2) * (cx - bx) + (bx**2 + by**2) * (ax - cx) + (cx**2 + cy**2) * (bx - ax)) / d
    return abs(math.dist((ux, uy), (ax, ay)) - math.dist((ux, uy), (dx, dy))) < 1e-9


def has_incircle(P):
    """The bisectors of the angles at A and B meet in a point at the same distance from the four sides."""
    def unit(p, q):
        d = math.dist(p, q)
        return ((q[0] - p[0]) / d, (q[1] - p[1]) / d)

    A, B, C, D = P
    u1, u2 = unit(A, B), unit(A, D)
    da = (u1[0] + u2[0], u1[1] + u2[1])
    w1, w2 = unit(B, A), unit(B, C)
    db = (w1[0] + w2[0], w1[1] + w2[1])
    det = da[0] * (-db[1]) - da[1] * (-db[0])
    s = ((B[0] - A[0]) * (-db[1]) - (B[1] - A[1]) * (-db[0])) / det
    I = (A[0] + s * da[0], A[1] + s * da[1])

    def dist_line(p, q):
        return abs((q[0] - p[0]) * (p[1] - I[1]) - (p[0] - I[0]) * (q[1] - p[1])) / math.dist(p, q)

    ds = [dist_line(P[i], P[(i + 1) % 4]) for i in range(4)]
    return max(ds) - min(ds) < 1e-9


def para(a, b, deg):
    c, s = math.cos(math.radians(deg)), math.sin(math.radians(deg))
    return [(0, 0), (a, 0), (a + b * c, b * s), (b * c, b * s)]


def trap(B, b, x, h):
    return [(0, 0), (B, 0), (x + b, h), (x, h)]


ANG = [30, 45, 60, 75, 90, 105, 120]
FAMILIES = {
    "rettangolo": [para(w, h, 90) for w in range(1, 7) for h in range(1, 7)],
    "rettangolo non quadrato": [para(w, h, 90) for w in range(1, 7) for h in range(1, 7) if w != h],
    "quadrato": [para(s, s, 90) for s in range(1, 6)],
    "rombo": [para(s, s, a) for s in (2, 5) for a in ANG],
    "rombo non quadrato": [para(s, s, a) for s in (2, 5) for a in ANG if a != 90],
    "parallelogramma qualsiasi": [para(a, b, t) for a in range(1, 5) for b in range(1, 5) for t in ANG],
    "parallelogramma non rombo": [para(a, b, t) for a in range(1, 5) for b in range(1, 5) for t in ANG if a != b],
    "trapezio isoscele": [trap(B, b, (B - b) / 2, h) for B in range(2, 13) for b in range(1, B) for h in range(1, 9)],
    "trapezio rettangolo": [trap(B, b, 0, h) for B in range(2, 13) for b in range(1, B) for h in range(1, 9)],
    "trapezio non isoscele": [trap(B, b, x, h) for B in range(2, 13) for b in range(1, B) for x in range(0, B - b + 1) if 2 * x != B - b for h in range(1, 9)],
}


def verdict(shapes, test):
    r = [test(P) for P in shapes]
    return "sempre" if all(r) else "mai" if not any(r) else "a volte"


TABLE = {f: (verdict(s, concyclic), verdict(s, has_incircle)) for f, s in FAMILIES.items()}
LABELS = {
    "rettangolo": "rettangolo",
    "rombo": "rombo",
    "quadrato": "quadrato",
    "trapezio isoscele": "trapezio isoscele",
    "trapezio rettangolo": "trapezio rettangolo",
    "parallelogramma qualsiasi": "parallelogramma qualsiasi",
    "rombo che non è un quadrato": "rombo non quadrato",
    "rettangolo che non è un quadrato": "rettangolo non quadrato",
    "parallelogramma che non è un rombo": "parallelogramma non rombo",
    "trapezio non isoscele": "trapezio non isoscele",
}
QUESTIONS = {
    "è sempre inscrivibile in una circonferenza": ("sempre inscrivibile", lambda i, c: i == "sempre"),
    "è sempre circoscrivibile a una circonferenza": ("sempre circoscrivibile", lambda i, c: c == "sempre"),
    "è sempre sia inscrivibile sia circoscrivibile": ("sempre entrambi", lambda i, c: i == c == "sempre"),
    "non è mai inscrivibile in una circonferenza": ("mai inscrivibile", lambda i, c: i == "mai"),
    "non è mai circoscrivibile a una circonferenza": ("mai circoscrivibile", lambda i, c: c == "mai"),
}


def check_l4(sample, errs):
    text = prose(sample["problem"])
    m = re.fullmatch(r"Quale di questi quadrilateri (.*)\?", text)
    if not m or m.group(1) not in QUESTIONS:
        errs.append(f"unreadable problem: {text}")
        return None
    case, test = QUESTIONS[m.group(1)]
    opts = choice_shape(sample["answer"], errs)
    if opts is None:
        return case
    fams = []
    for o in opts:
        label = prose(o["latex"])
        if label not in LABELS:
            errs.append(f"unknown option {label}")
            return case
        fams.append(LABELS[label])
    right = [i for i, f in enumerate(fams) if test(*TABLE[f])]
    if len(right) != 1:
        errs.append(f"{len(right)} options answer the question: {fams}")
    elif right[0] != sample["answer"]["correct"]:
        errs.append(f"correct option {fams[sample['answer']['correct']]}, truth {fams[right[0]]}")
    return case


# ---------------------------------------------------------------------------
# Levels 5 and 6: regular polygons

def regular(n, R):
    """Exact vertices of a regular n-gon inscribed in a circle of radius R centred at the origin."""
    return [Point(R * cos(2 * pi * k / n), R * sin(2 * pi * k / n)) for k in range(n)]


NAMES = {"triangolo equilatero": 3, "quadrato": 4, "pentagono regolare": 5, "esagono regolare": 6, "ottagono regolare": 8, "decagono regolare": 10, "dodecagono regolare": 12}


def central_angle(n):
    P = [Point(cos(2 * pi * k / n), sin(2 * pi * k / n)) for k in (0, 1)]
    a = math.degrees(math.atan2(float(P[1].y), float(P[1].x)) - math.atan2(float(P[0].y), float(P[0].x)))
    return a % 360


def check_l5(sample, errs):
    text = prose(sample["problem"])
    m1 = re.fullmatch(r"Quanto misura l'angolo al centro di un (?:poligono regolare di \$(\d+)\$ lati|(.+))\?", text)
    m2 = re.fullmatch(r"L'angolo al centro di un poligono regolare misura \$(\d+)\^\\circ\$\. Quanti lati ha il poligono\?", text)
    m3 = re.fullmatch(r"Un esagono regolare è inscritto in una circonferenza di raggio \$(\d+)\$ cm\. Quanto misura il perimetro dell'esagono\?", text)
    m4 = re.fullmatch(r"Un esagono regolare ha il perimetro di \$(\d+)\$ cm\. Quanto misura il raggio della circonferenza circoscritta\?", text)
    if m1:
        n = int(m1.group(1)) if m1.group(1) else NAMES.get(m1.group(2))
        if n is None or n not in (3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36):
            errs.append(f"polygon out of spec: {text}")
            return None
        if m1.group(1) and int(m1.group(1)) in NAMES.values():
            errs.append("a polygon with a name written as n sides")
        a = central_angle(n)
        truth = Rational(round(a))
        if abs(a - float(truth)) > 1e-9:
            errs.append("central angle not an integer")
        check_value(sample, truth, "deg", errs)
        return "angolo al centro"
    if m2:
        a = int(m2.group(1))
        ns = [n for n in range(3, 400) if abs(central_angle(n) - a) < 1e-9]
        if len(ns) != 1 or ns[0] < 5:
            errs.append(f"angle {a} gives {ns}")
            return "numero di lati"
        check_value(sample, Rational(ns[0]), "lati", errs)
        return "numero di lati"
    if m3 or m4:
        if m3:
            r = int(m3.group(1))
            P = regular(6, r)
            truth = nsimplify(sum(P[i].distance(P[(i + 1) % 6]) for i in range(6)))
            if r < 2 or r > 20:
                errs.append("radius out of spec")
        else:
            per = int(m4.group(1))
            R = Symbol("R", positive=True)
            P = regular(6, R)
            sols = solve(sum(P[i].distance(P[(i + 1) % 6]) for i in range(6)) - per, R)
            if len(sols) != 1:
                errs.append(f"radius not determined: {sols}")
                return "esagono"
            truth = nsimplify(sols[0])
            if per % 6 or per < 12 or per > 120:
                errs.append("perimeter out of spec")
        check_value(sample, nsimplify(truth), "cm", errs)
        return "esagono"
    errs.append(f"unreadable problem: {text}")
    return None


def check_l6(sample, errs):
    text = prose(sample["problem"])
    m1 = re.fullmatch(r"Un esagono regolare ha il lato di \$(\d+)\$ cm\. Quanto misura l'apotema\?", text)
    m2 = re.fullmatch(r"Un esagono regolare è inscritto in una circonferenza di raggio \$(\d+)\$ cm\. Quanto misura l'apotema dell'esagono\?", text)
    m3 = re.fullmatch(r"Un quadrato è inscritto in una circonferenza di raggio \$(\d+)\$ cm\. Quanto misura (il lato|l'apotema) del quadrato\?", text)
    O = Point(0, 0)
    if m1 or m2:
        if m1:
            ell = int(m1.group(1))
            R = Symbol("R", positive=True)
            P = regular(6, R)
            (Rv,) = solve(P[0].distance(P[1]) - ell, R)
            if ell % 2 or ell < 2 or ell > 20:
                errs.append("side out of spec (even, 2..20)")
        else:
            Rv = int(m2.group(1))
            if Rv % 2 or Rv < 2 or Rv > 20:
                errs.append("radius out of spec (even, 2..20)")
        P = regular(6, Rv)
        truth = simplify(O.distance(P[0].midpoint(P[1])))
        check_value(sample, truth, "cm", errs)
        return "esagono"
    if m3:
        r = int(m3.group(1))
        if r < 2 or r > 15:
            errs.append("radius out of spec")
        P = regular(4, r)
        truth = simplify(P[0].distance(P[1]) if m3.group(2) == "il lato" else O.distance(P[0].midpoint(P[1])))
        check_value(sample, truth, "cm", errs)
        return "lato del quadrato" if m3.group(2) == "il lato" else "apotema del quadrato"
    errs.append(f"unreadable problem: {text}")
    return None


# ---------------------------------------------------------------------------
# Level 7

def check_l7(sample, errs):
    text = prose(sample["problem"])
    m1 = re.fullmatch(
        r"Il triangolo \$ABC\$ è rettangolo in \$C\$, con (?:i cateti \$\\overline\{AC\} = (\d+)\$ cm e \$\\overline\{BC\} = (\d+)\$ cm|"
        r"il cateto \$\\overline\{AC\} = (\d+)\$ cm e l'ipotenusa \$\\overline\{AB\} = (\d+)\$ cm)\. "
        r"Quanto misura il raggio della circonferenza (inscritta|circoscritta)\?",
        text,
    )
    m2 = re.fullmatch(
        r"Un trapezio isoscele è circoscritto a una circonferenza, e le basi misurano \$(\d+)\$ cm e \$(\d+)\$ cm\. "
        r"(Quanto misurano i lati obliqui|Quanto misura l'altezza|Quanto misura il raggio della circonferenza)\?",
        text,
    )
    if m1:
        C = Point(0, 0)
        if m1.group(1):
            A, B = Point(int(m1.group(1)), 0), Point(0, int(m1.group(2)))
        else:
            ac, ab = int(m1.group(3)), int(m1.group(4))
            if ab <= ac:
                errs.append("leg not shorter than the hypotenuse")
                return None
            A, B = Point(ac, 0), Point(0, sqrt(ab**2 - ac**2))
            if not sqrt(ab**2 - ac**2).is_integer:
                errs.append("third side not an integer")
        T = Triangle(A, B, C)
        if not T.is_right() or A.distance(B) > 50 or not A.distance(B).is_integer:
            errs.append("triangle out of spec")
        inner = m1.group(5) == "inscritta"
        truth = nsimplify(T.inradius if inner else T.circumradius)
        check_value(sample, nsimplify(truth), "cm", errs)
        return "r triangolo" if inner else "R triangolo"
    if m2:
        Bb, b = int(m2.group(1)), int(m2.group(2))
        if not b < Bb <= 40 or b < 2:
            errs.append("bases out of spec")
            return "trapezio"
        h = Symbol("h", positive=True)
        A, B, Cc, D = Point(0, 0), Point(Bb, 0), Point(Rational(Bb + b, 2), h), Point(Rational(Bb - b, 2), h)
        centre = Point(Rational(Bb, 2), h / 2)
        # tangent to both bases by construction; tangent to the leg AD (and by symmetry BC)
        sols = solve(Line(A, D).distance(centre) ** 2 - (h / 2) ** 2, h)
        sols = [s for s in sols if s.is_positive]
        if len(sols) != 1:
            errs.append(f"height not determined: {sols}")
            return "trapezio"
        hv = sols[0]
        q = m2.group(3)
        truth = nsimplify(
            A.distance(D).subs(h, hv) if "obliqui" in q else hv if "altezza" in q else hv / 2
        )
        if not A.distance(D).subs(h, hv).is_integer or not hv.is_integer:
            errs.append("leg or height not an integer")
        check_value(sample, nsimplify(truth), "cm", errs)
        return "trapezio"
    errs.append(f"unreadable problem: {text}")
    return None


def check(sample):
    errs = []
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    lvl = sample["level"]
    fn = {1: check_l1, 2: check_l2, 3: check_l3, 4: check_l4, 5: check_l5, 6: check_l6, 7: check_l7}.get(lvl)
    if fn is None:
        return [f"unknown level {lvl}"], None
    kind = fn(sample, errs)
    if lvl in (2, 4) and sample.get("choice") is not None and sample["choice"] != sample["answer"]:
        errs.append("the choice variant differs from the choice answer")
    if kind and sample.get("params", {}).get("case") != kind:
        errs.append(f"params.case {sample.get('params', {}).get('case')} != {kind}")
    return errs, kind
