"""Checker for il-piano-cartesiano, from specs/exercises/il-piano-cartesiano.md.

Independent of the generator: the points are read back from the LaTeX of the problem (and the distance
and the axis from its sentence at level 4), the answer is recomputed with SymPy geometry (Point.distance,
Point.midpoint, Point.reflect, Triangle.centroid, Triangle.is_right, Triangle.area, solve) and every
option is read back from its LaTeX and compared with its values and with the truth. A distance must be a
reduced radical with a rational denominator, and so must every distractor: a distractor equal to the
answer in value is always an error. The case of each sample is recomputed from the numbers, not read
from params, and its share per level is checked against the spec.
"""
import re
from math import gcd

from sympy import Abs, Line, Point, Rational, Symbol, Triangle, factorint, solve, sqrt, sympify

from verify import FORBIDDEN, exact

CASE_RANGES = {
    1: {"quadrante": (0.60, 0.80), "asse": (0.20, 0.40)},
    2: {"segni opposti": (0.50, 0.70), "stesso segno": (0.30, 0.50)},
    3: {"intera": (0.22, 0.40), "radicale": (0.40, 0.60), "frazionarie": (0.13, 0.30)},
    4: {"due punti": (0.60, 0.80), "un punto": (0.08, 0.23), "nessun punto": (0.08, 0.23)},
    5: {"punto medio": (0.40, 0.60), "estremo": (0.40, 0.60)},
    6: {"asse x": (0.13, 0.28), "asse y": (0.13, 0.28), "origine": (0.08, 0.22), "punto": (0.18, 0.33), "baricentro": (0.13, 0.28)},
    7: {"tipo": (0.30, 0.50), "quarto vertice": (0.20, 0.40), "area": (0.20, 0.40)},
}

REGION_TEX = {
    r"\text{primo quadrante}": "I",
    r"\text{secondo quadrante}": "II",
    r"\text{terzo quadrante}": "III",
    r"\text{quarto quadrante}": "IV",
    r"\text{asse }x": "x",
    r"\text{asse }y": "y",
}
TRI_TEX = {
    r"\text{isoscele, non rettangolo}": "isoscele",
    r"\text{rettangolo, non isoscele}": "rettangolo",
    r"\text{rettangolo e isoscele}": "rettangolo isoscele",
    r"\text{scaleno, non rettangolo}": "scaleno",
}

# ---------------------------------------------------------------------------
# Reading numbers and points


def squarefree(n):
    return n >= 2 and all(e == 1 for e in factorint(n).values())


def num(tex, reduced=True):
    """A number as the lesson writes it: -4, \\frac{3}{2}, -\\frac{1}{2}, 2\\sqrt{5}, -\\sqrt{7},
    \\frac{\\sqrt{97}}{6}, \\frac{3\\sqrt{5}}{2}. With `reduced`, only the reduced form is accepted."""
    s = tex.strip()
    sign = 1
    if s.startswith("-"):
        sign, s = -1, s[1:].strip()
    m = re.fullmatch(r"\d+", s)
    if m:
        return sign * Rational(int(s))
    m = re.fullmatch(r"\\frac\{(\d+)\}\{(\d+)\}", s)
    if m:
        p, q = int(m.group(1)), int(m.group(2))
        if reduced and (gcd(p, q) != 1 or q < 2):
            raise ValueError(f"fraction not reduced: {tex!r}")
        return sign * Rational(p, q)
    m = re.fullmatch(r"(\d*)\\sqrt\{(\d+)\}", s) or re.fullmatch(r"\\frac\{(\d*)\\sqrt\{(\d+)\}\}\{(\d+)\}", s)
    if m:
        k = int(m.group(1)) if m.group(1) else 1
        r = int(m.group(2))
        d = int(m.group(3)) if m.lastindex == 3 else 1
        if reduced:
            if m.group(1) == "1" or not squarefree(r):
                raise ValueError(f"radical not reduced: {tex!r}")
            if m.lastindex == 3 and (d < 2 or gcd(k, d) != 1):
                raise ValueError(f"fraction with a radical not reduced: {tex!r}")
        return sign * k * sqrt(r) / d
    raise ValueError(f"unreadable number {tex!r}")


COORD = r"[^(),]+?"
POINT = re.compile(r"([A-Z](?:_\d|')?)(\\left)?\((" + COORD + r"), (" + COORD + r")(\\right)?\)")
PAIR = re.compile(r"(\\left)?\((" + COORD + r"), (" + COORD + r")(\\right)?\)")


def pair(tex, strict=True):
    """(3, -2) or \\left(\\frac{3}{2}, -1\\right): \\left is used exactly when a coordinate is not an integer."""
    m = PAIR.fullmatch(tex.strip())
    if not m:
        raise ValueError(f"not a pair: {tex!r}")
    x, y = num(m.group(2)), num(m.group(3))
    if strict and bool(m.group(1)) != (not (x.is_integer and y.is_integer)):
        raise ValueError(f"\\left( used wrongly in {tex!r}")
    return Point(x, y, evaluate=False)


def points(tex):
    out = {}
    for m in POINT.finditer(tex):
        if m.group(1) in out:
            raise ValueError(f"point {m.group(1)} twice in {tex!r}")
        out[m.group(1)] = pair(m.group(0)[len(m.group(1)):], strict=True)
    return out


def key_point(p):
    return ("pt", sympify(p.x), sympify(p.y))


def same(a, b):
    return (sympify(a) - sympify(b)).equals(0)


# ---------------------------------------------------------------------------
# Choice


def check_choice(ch, truth, read, errs, name="choice"):
    """read(option) -> key from the LaTeX, compared with the key from the values; truth is a key."""
    if not ch or ch.get("kind") != "choice":
        errs.append(f"{name} missing")
        return
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{name}: {len(opts)} options, need 4")
    keys = []
    for o in opts:
        try:
            k_latex = read(o["latex"])
            k_values = read_values(o["values"], k_latex)
        except Exception as e:  # noqa: BLE001
            errs.append(f"{name}: unreadable option {o!r}: {e}")
            return
        if k_latex != k_values:
            errs.append(f"{name}: option latex {o['latex']!r} != values {o['values']}")
        keys.append(k_latex)
    if len(set(keys)) != len(keys):
        errs.append(f"{name}: options not distinct: {[o['latex'] for o in opts]}")
    if len(set(o["latex"] for o in opts)) != len(opts):
        errs.append(f"{name}: two options with the same latex")
    hits = [i for i, k in enumerate(keys) if k == truth]
    if len(hits) != 1:
        errs.append(f"{name}: {len(hits)} options equal the truth {truth}")
    if ch.get("correct") not in hits:
        errs.append(f"{name}: correct index {ch.get('correct')} does not point to the truth {truth}")


def read_values(values, like):
    """The key of an option from its values, in the shape of the key read from its LaTeX."""
    tag = like[0]
    if tag == "pt":
        x, y = values
        return ("pt", exact(x), exact(y))
    if tag == "num":
        (v,) = values
        return ("num", sympify(exact(v)).expand())
    if tag == "set":
        if values == ["none"]:
            return ("set", frozenset())
        pts = set()
        for v in values:
            a, b = v.split(",")
            pts.add((exact(a), exact(b)))
        return ("set", frozenset(pts))
    if tag == "label":
        return ("label", values[0])
    raise ValueError(f"unknown key {like}")


def read_num(tex):
    return ("num", sympify(num(tex)).expand())


def read_pt(tex):
    p = pair(tex)
    return ("pt", sympify(p.x), sympify(p.y))


def read_set(tex):
    tex = tex.strip()
    if tex == r"\text{nessun punto}":
        return ("set", frozenset())
    m = re.fullmatch(r"P(.+)", tex)
    m2 = re.fullmatch(r"P_1(.+),\\ P_2(.+)", tex)
    if m2:
        a, b = pair(m2.group(1)), pair(m2.group(2))
        if not (a.x < b.x or (a.x == b.x and a.y < b.y)):
            raise ValueError(f"P_1 after P_2 in {tex!r}")
        return ("set", frozenset({(a.x, a.y), (b.x, b.y)}))
    if m:
        a = pair(m.group(1))
        return ("set", frozenset({(a.x, a.y)}))
    raise ValueError(f"unreadable set of points {tex!r}")


def read_label(table):
    def read(tex):
        if tex not in table:
            raise ValueError(f"unknown label {tex!r}")
        return ("label", table[tex])

    return read


# ---------------------------------------------------------------------------
# Levels


def region(p):
    x, y = sympify(p.x), sympify(p.y)
    if x == 0:
        return "y"
    if y == 0:
        return "x"
    if x > 0:
        return "I" if y > 0 else "IV"
    return "II" if y > 0 else "III"


def need(pts, names, errs):
    for n in names:
        if n not in pts:
            errs.append(f"point {n} missing in the problem")
            return False
    if len(pts) != len(names):
        errs.append(f"points {sorted(pts)} in the problem, expected {names}")
        return False
    return True


def ints_in(pts, m):
    return all(sympify(c).is_integer and abs(c) <= m for p in pts for c in (p.x, p.y))


def level1(s, errs):
    pts = points(s["problem"])
    if not need(pts, ["P"], errs):
        return None
    P = pts["P"]
    reg = region(P)
    if s["params"].get("region") != reg:
        errs.append(f"params.region {s['params'].get('region')} but P is in {reg}")
    check_choice(s["answer"], ("label", reg), read_label(REGION_TEX), errs, "answer")
    for c in (P.x, P.y):
        c = sympify(c)
        if c != 0 and not (c.is_rational and abs(c.p) <= 15 and c.q <= 5) and not (c**2).is_integer:
            errs.append(f"coordinate {c} out of spec")
    return "asse" if reg in ("x", "y") else "quadrante"


def level2(s, errs):
    pts = points(s["problem"])
    if not need(pts, ["A", "B"], errs):
        return None
    A, B = pts["A"], pts["B"]
    if not ints_in([A, B], 9):
        errs.append("coordinates must be integers in [-9, 9]")
    if A.x == B.x:
        a, b = A.y, B.y
    elif A.y == B.y:
        a, b = A.x, B.x
    else:
        errs.append("segment neither horizontal nor vertical")
        return None
    if a == b:
        errs.append("A = B")
        return None
    d = A.distance(B)
    ans = s["answer"]
    if ans.get("kind") != "number" or Rational(ans["value"]) != d:
        errs.append(f"answer {ans.get('value')} != distance {d}")
    check_choice(s.get("choice"), ("num", d), read_num, errs)
    if a == 0 or b == 0:
        errs.append("a moving coordinate is zero")
    return "segni opposti" if a * b < 0 else "stesso segno"


def level3(s, errs):
    pts = points(s["problem"])
    if not need(pts, ["A", "B"], errs):
        return None
    A, B = pts["A"], pts["B"]
    if A.x == B.x or A.y == B.y:
        errs.append("segment not oblique")
    d = sympify(A.distance(B)).expand()
    ans = s["answer"]
    if ans.get("kind") != "expression" or ans.get("form") != "simplified":
        errs.append("answer must be an expression in simplified form")
    else:
        if not same(exact(ans["value"]), d):
            errs.append(f"answer value {ans['value']} != distance {d}")
        try:
            if not same(num(ans["latex"]), d):
                errs.append(f"answer latex {ans['latex']} != distance {d}")
        except ValueError as e:
            errs.append(f"answer latex: {e}")
    check_choice(s.get("choice"), ("num", d), read_num, errs)
    coords = [sympify(c) for p in (A, B) for c in (p.x, p.y)]
    if all(c.is_integer for c in coords):
        if not ints_in([A, B], 9):
            errs.append("integer coordinates out of [-9, 9]")
        return "intera" if d.is_rational else "radicale"
    if any(c.q > 4 for c in coords):
        errs.append("fraction with denominator > 4")
    return "frazionarie"


def level4(s, errs):
    prob = s["problem"]
    m = re.search(r"dell'asse \$([xy])\$ che distano \$([^$]+)\$ da", prob)
    if not m:
        errs.append("level 4 sentence not recognised")
        return None
    axis, d = m.group(1), num(m.group(2))
    pts = points(prob)
    if not need(pts, ["A"], errs):
        return None
    A = pts["A"]
    if not ints_in([A], 8):
        errs.append("A out of spec")
    v = Symbol("v", real=True)
    P = Point(v, 0) if axis == "x" else Point(0, v)
    sols = solve(A.distance(P) ** 2 - d**2, v)
    truth = frozenset((sympify(P.x).subs(v, r), sympify(P.y).subs(v, r)) for r in sols)
    check_choice(s["answer"], ("set", truth), read_set, errs, "answer")
    if any(not sympify(c).is_integer for pt in truth for c in pt):
        errs.append(f"non-integer solutions {truth}")
    return {0: "nessun punto", 1: "un punto", 2: "due punti"}[len(truth)]


def level5(s, errs):
    pts = points(s["problem"])
    prompt = s["prompt"]
    if prompt.startswith("Trova il punto medio"):
        if not need(pts, ["A", "B"], errs):
            return None
        truth = pts["A"].midpoint(pts["B"])
        if not ints_in([pts["A"], pts["B"]], 9):
            errs.append("A, B out of spec")
        kind = "punto medio"
    elif prompt.startswith("M è il punto medio"):
        if not need(pts, ["A", "M"], errs):
            return None
        A, M = pts["A"], pts["M"]
        truth = Point(2 * M.x - A.x, 2 * M.y - A.y)
        if truth.midpoint(A) != M:
            errs.append("endpoint does not have M as midpoint")
        if not ints_in([A, truth], 9):
            errs.append("A, B out of spec")
        kind = "estremo"
    else:
        errs.append(f"unknown prompt {prompt!r}")
        return None
    check_choice(s["answer"], key_point(truth), read_pt, errs, "answer")
    return kind


def level6(s, errs):
    pts = points(s["problem"])
    prompt = s["prompt"]
    if "rispetto all'asse x" in prompt or "rispetto all'asse y" in prompt or "rispetto all'origine" in prompt:
        if not need(pts, ["P"], errs):
            return None
        P = pts["P"]
        if "asse x" in prompt:
            truth, kind = P.reflect(Line(Point(0, 0), Point(1, 0))), "asse x"
        elif "asse y" in prompt:
            truth, kind = P.reflect(Line(Point(0, 0), Point(0, 1))), "asse y"
        else:
            truth, kind = P.scale(-1, -1), "origine"
        if P.x == 0 or P.y == 0 or Abs(P.x) == Abs(P.y):
            errs.append("P on an axis or on a bisector")
    elif "rispetto al punto C" in prompt:
        if not need(pts, ["A", "C"], errs):
            return None
        A, C = pts["A"], pts["C"]
        truth, kind = Point(2 * C.x - A.x, 2 * C.y - A.y), "punto"
        if A.midpoint(truth) != C:
            errs.append("C is not the midpoint of AA'")
    elif prompt.startswith("Trova il baricentro"):
        if not need(pts, ["A", "B", "C"], errs):
            return None
        T = Triangle(pts["A"], pts["B"], pts["C"])
        if not isinstance(T, Triangle):
            errs.append("degenerate triangle")
            return None
        truth, kind = T.centroid, "baricentro"
    else:
        errs.append(f"unknown prompt {prompt!r}")
        return None
    check_choice(s["answer"], key_point(truth), read_pt, errs, "answer")
    return kind


def tri_type(T):
    s = sorted(sympify(a.length**2) for a in T.sides)
    iso = s[0] == s[1] or s[1] == s[2]
    right = T.is_right()
    if right != (s[0] + s[1] == s[2]):
        raise ValueError("is_right disagrees with Pythagoras")
    return ("rettangolo isoscele" if iso else "rettangolo") if right else ("isoscele" if iso else "scaleno")


def level7(s, errs):
    pts = points(s["problem"])
    prompt = s["prompt"]
    if not need(pts, ["A", "B", "C"], errs):
        return None
    A, B, C = pts["A"], pts["B"], pts["C"]
    if not ints_in([A, B, C], 8):
        errs.append("vertices out of [-8, 8]")
    T = Triangle(A, B, C)
    if not isinstance(T, Triangle):
        errs.append("degenerate triangle")
        return None
    if prompt == "Che triangolo è ABC?":
        check_choice(s["answer"], ("label", tri_type(T)), read_label(TRI_TEX), errs, "answer")
        return "tipo"
    if prompt.startswith("A, B e C sono tre vertici del parallelogramma ABCD"):
        D = Point(A.x + C.x - B.x, A.y + C.y - B.y)
        if A.midpoint(C) != B.midpoint(D):
            errs.append("diagonals do not share the midpoint")
        check_choice(s["answer"], key_point(D), read_pt, errs, "answer")
        return "quarto vertice"
    if prompt.startswith("Il triangolo ABC è rettangolo") or prompt.startswith("Il triangolo ABC è isoscele sulla base AB"):
        if "rettangolo" in prompt and not T.is_right():
            errs.append("the triangle is not right")
        if "isoscele" in prompt:
            if A.distance(C) != B.distance(C):
                errs.append("not isosceles on the base AB")
            if A.x != B.x and A.y != B.y:
                errs.append("base AB not horizontal or vertical")
        area = Abs(T.area)
        ans = s["answer"]
        if ans.get("kind") != "number" or Rational(ans["value"]) != area:
            errs.append(f"answer {ans.get('value')} != area {area}")
        check_choice(s.get("choice"), ("num", area), read_num, errs)
        return "area"
    errs.append(f"unknown prompt {prompt!r}")
    return None


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7}


def check(sample):
    errs = []
    for name, rx in FORBIDDEN:
        if name in ("+ -", "- -") and rx.search(sample["problem"]):
            errs.append(f"problem contains '{name}'")
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("steps or solution missing")
    for st in [sample.get("solution", "")] + sample.get("steps", []):
        if re.search(r"\\begin\{(aligned|gathered|array)\}", st) and "\\text" in st:
            errs.append("environment with \\text in a step")
    ch = sample.get("choice")
    if sample["answer"].get("kind") == "choice" and ch is not None and ch != sample["answer"]:
        errs.append("choice differs from the answer")
    fn = LEVELS.get(sample["level"])
    if fn is None:
        return [f"unknown level {sample['level']}"], None
    kind = fn(sample, errs)
    return errs, kind
