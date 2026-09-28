"""Checker for trasformazioni-geometriche, from specs/exercises/trasformazioni-geometriche.md.

Independent of the generator: points, vectors, lines, axes and equations are read back from the LaTeX of the
problem (and the kind of transformation from the prompt), the answer is recomputed with SymPy geometry
(Point.translate, Point.reflect over a Line, Point.scale about the origin, Triangle.area, the image of a line
through the images of two of its points, linsolve for the fixed points) and every option is read back from its
LaTeX and compared with its values and with the truth. Two options are the same when they are the same object:
the same point, the same line (whatever the writing), the same map of the plane (so a homothety of ratio -1
counts as the symmetry about the origin). A line must be written in reduced explicit form. The case of each
sample is recomputed from the data, not read from params, and its share per level is checked against the spec.
"""
import re
from math import gcd

from sympy import Abs, Line, Point, Rational, Symbol, Triangle, expand, linsolve, simplify, sympify

from verify import exact

X, Y = Symbol("x"), Symbol("y")

CASE_RANGES = {
    1: {"immagine": (0.50, 0.70), "vettore": (0.12, 0.28), "punto di partenza": (0.12, 0.28)},
    2: {"asse x": (0.17, 0.33), "asse y": (0.17, 0.33), "origine": (0.12, 0.28), "bisettrice": (0.22, 0.38)},
    3: {"punto": (0.32, 0.48), "rapporto": (0.22, 0.38), "area": (0.22, 0.38)},
    4: {"intero": (0.60, 0.80), "frazionario": (0.20, 0.40)},
    5: {"asse x": (0.13, 0.28), "asse y": (0.13, 0.28), "origine": (0.08, 0.22), "bisettrice": (0.13, 0.28), "omotetia": (0.17, 0.33)},
    6: {"riconoscere": (0.50, 0.70), "punti uniti": (0.30, 0.50)},
    7: {"assi paralleli": (0.32, 0.48), "due traslazioni": (0.17, 0.33), "assi perpendicolari": (0.27, 0.43)},
}

X_AXIS = Line(Point(0, 0), Point(1, 0))
Y_AXIS = Line(Point(0, 0), Point(0, 1))
BISECTOR = Line(Point(0, 0), Point(1, 1))

# ---------------------------------------------------------------------------
# Reading numbers, points, lines


def num(tex):
    """-4, \\frac{3}{2}, -\\frac{1}{2}: only reduced fractions."""
    s = tex.strip()
    sign = 1
    if s.startswith("-"):
        sign, s = -1, s[1:].strip()
    if re.fullmatch(r"\d+", s):
        return sign * Rational(int(s))
    m = re.fullmatch(r"\\frac\{(\d+)\}\{(\d+)\}", s)
    if m:
        p, q = int(m.group(1)), int(m.group(2))
        if gcd(p, q) != 1 or q < 2:
            raise ValueError(f"fraction not reduced: {tex!r}")
        return sign * Rational(p, q)
    raise ValueError(f"unreadable number {tex!r}")


COORD = r"[^(),]+?"
PAIR = re.compile(r"(\\left)?\((" + COORD + r"), (" + COORD + r")(\\right)?\)")
NAMED = re.compile(r"(P''|P'|[A-Z]|\\vec\{v\}(?:_\d)?)(\\left)?\((" + COORD + r"), (" + COORD + r")(\\right)?\)")


def pair(tex):
    """(3, -2) or \\left(\\frac{3}{2}, -1\\right): \\left exactly when a coordinate is not an integer."""
    m = PAIR.fullmatch(tex.strip())
    if not m:
        raise ValueError(f"not a pair: {tex!r}")
    x, y = num(m.group(2)), num(m.group(3))
    if bool(m.group(1)) != (not (x.is_integer and y.is_integer)):
        raise ValueError(f"\\left( used wrongly in {tex!r}")
    return Point(x, y, evaluate=False)


def givens(tex):
    """Named points and vectors of a problem: {'P': Point, '\\vec{v}': Point, ...}."""
    out = {}
    for m in NAMED.finditer(tex):
        name = m.group(1)
        if name in out:
            raise ValueError(f"{name} twice in {tex!r}")
        out[name] = pair(m.group(0)[len(name):])
    return out


def need(g, names, errs):
    if sorted(g) != sorted(names):
        errs.append(f"givens {sorted(g)} in the problem, expected {sorted(names)}")
        return False
    return True


COEF = r"(\d+|\\frac\{\d+\}\{\d+\})"
EXPLICIT = re.compile(r"y = (-)?" + COEF + r"?x(?: ([+-]) " + COEF + r")?")


def coef(tex):
    if tex == "1":
        raise ValueError("coefficient 1 written")
    return num(tex)


def line_tex(tex):
    """y = mx + q in reduced explicit form -> (m, q). Never 1x, never + 0, fractions reduced."""
    m = EXPLICIT.fullmatch(tex.strip())
    if not m:
        raise ValueError(f"not an explicit line: {tex!r}")
    slope = coef(m.group(2)) if m.group(2) else Rational(1)
    if m.group(1):
        slope = -slope
    k = Rational(0)
    if m.group(3):
        k = num(m.group(4))
        if k == 0:
            raise ValueError(f"zero term in {tex!r}")
        if m.group(3) == "-":
            k = -k
    return slope, k


def line_value(v):
    """The SymPy value of an explicit line (the right-hand side) -> (m, q)."""
    e = expand(sympify(v, locals={"x": X}))
    if e.free_symbols - {X}:
        raise ValueError(f"line value with other symbols: {v!r}")
    m, k = e.coeff(X, 1), e.coeff(X, 0)
    if expand(m * X + k - e) != 0:
        raise ValueError(f"line value not linear: {v!r}")
    return Rational(m), Rational(k)


def line_of(m, k):
    return Line(Point(0, k), Point(1, m + k))


def mq_of(line):
    """y = mx + q of a non-vertical SymPy Line."""
    a, b, c = line.coefficients
    if b == 0:
        raise ValueError("vertical line")
    return Rational(sympify(-a / b)), Rational(sympify(-c / b))


def image_line(m, k, f):
    """The image of y = mx + q through the images of two of its points."""
    A, B = f(Point(0, k)), f(Point(3, 3 * m + k))
    return mq_of(Line(A, B))


# ---------------------------------------------------------------------------
# Choice


def check_choice(ch, truth, read, read_vals, errs, name="choice"):
    """read(latex) and read_vals(values) -> a key; keys compared as mathematical objects."""
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
            k_values = read_vals(o["values"])
        except Exception as e:  # noqa: BLE001
            errs.append(f"{name}: unreadable option {o!r}: {e}")
            return
        if k_latex != k_values:
            errs.append(f"{name}: option latex {o['latex']!r} != values {o['values']}")
        keys.append(k_latex)
    if len(set(keys)) != len(keys):
        errs.append(f"{name}: options not distinct: {[o['latex'] for o in opts]}")
    hits = [i for i, k in enumerate(keys) if k == truth]
    if len(hits) != 1:
        errs.append(f"{name}: {len(hits)} options equal the truth {truth}")
    if ch.get("correct") not in hits:
        errs.append(f"{name}: correct index {ch.get('correct')} does not point to the truth {truth}")


def key_pt(p):
    return ("pt", sympify(p.x), sympify(p.y))


def read_pt(tex):
    return key_pt(pair(tex))


def read_vec(tex):
    m = re.fullmatch(r"\\vec\{v\}(.+)", tex.strip())
    if not m:
        raise ValueError(f"not a vector {tex!r}")
    return key_pt(pair(m.group(1)))


def vals_pt(values):
    x, y = values
    return ("pt", exact(x), exact(y))


def read_num(tex):
    return ("num", num(tex))


def vals_num(values):
    (v,) = values
    return ("num", Rational(v))


def read_line(tex):
    return ("line",) + line_tex(tex)


def vals_line(values):
    (v,) = values
    return ("line",) + line_value(v)


# ---------------------------------------------------------------------------
# Maps of the plane (level 6)


def tex_expr(tex):
    """x' = ... right-hand sides: x, -y, x - 3, 2x, -\\frac{1}{2}y."""
    s = tex.strip()
    if not re.fullmatch(r"[-+ 0-9xy{}\\frac]*", s):
        raise ValueError(f"unexpected equation {tex!r}")
    if re.search(r"(?<![\d}])1\s*[xy]|[+-]\s*0(?!\d)", s):
        raise ValueError(f"1x or zero term in {tex!r}")
    s = re.sub(r"\\frac\{(\d+)\}\{(\d+)\}", lambda m: f"({num(m.group(0))})", s)
    s = re.sub(r"([\d)])\s*([xy])", r"\1*\2", s)
    return expand(sympify(s, locals={"x": X, "y": Y}))


def read_system(tex):
    m = re.fullmatch(r"\\begin\{cases\} x' = (.+?) \\\\ y' = (.+?) \\end\{cases\}", tex.strip())
    if not m:
        raise ValueError(f"not a system {tex!r}")
    return (tex_expr(m.group(1)), tex_expr(m.group(2)))


def map_key(fx, fy):
    return ("map", expand(fx), expand(fy))


def read_tr(tex):
    s = tex.strip()
    m = re.fullmatch(r"\\text\{traslazione di vettore \}\\vec\{v\}(.+)", s)
    if m:
        v = pair(m.group(1))
        if v.x == 0 and v.y == 0:
            raise ValueError("null vector")
        return map_key(X + v.x, Y + v.y)
    if s == r"\text{simmetria rispetto all'asse }x":
        return map_key(X, -Y)
    if s == r"\text{simmetria rispetto all'asse }y":
        return map_key(-X, Y)
    if s == r"\text{simmetria rispetto all'origine}":
        return map_key(-X, -Y)
    if s == r"\text{simmetria rispetto a }y = x":
        return map_key(Y, X)
    m = re.fullmatch(r"\\text\{omotetia di centro \}O\\text\{ e \}k = (.+)", s)
    if m:
        k = num(m.group(1))
        if k == 0:
            raise ValueError("ratio 0")
        return map_key(k * X, k * Y)
    raise ValueError(f"unknown transformation {tex!r}")


def vals_tr(values):
    tag = values[0]
    if tag == "T":
        return map_key(X + Rational(values[1]), Y + Rational(values[2]))
    if tag == "H":
        k = Rational(values[1])
        return map_key(k * X, k * Y)
    table = {"Sx": (X, -Y), "Sy": (-X, Y), "SO": (-X, -Y), "Sb": (Y, X)}
    if tag in table and len(values) == 1:
        return map_key(*table[tag])
    raise ValueError(f"unknown values {values}")


FIXED_TEX = {
    r"\text{nessun punto}": "none",
    r"\text{solo l'origine }O": "O",
    r"\text{i punti dell'asse }x": "x",
    r"\text{i punti dell'asse }y": "y",
    r"\text{i punti della retta }y = x": "bis",
    r"\text{tutti i punti del piano}": "all",
}


def fixed_points(fx, fy):
    sol = linsolve([fx - X, fy - Y], [X, Y])
    if not sol:
        return "none"
    (sx, sy) = list(sol)[0]
    free = (sympify(sx).free_symbols | sympify(sy).free_symbols)
    if not free:
        return "O" if sx == 0 and sy == 0 else f"point {sx},{sy}"
    if len(free) == 2:
        return "all"
    if sy == 0:
        return "x"
    if sx == 0:
        return "y"
    if simplify(sx - sy) == 0:
        return "bis"
    return f"line {sx},{sy}"


def read_label(table):
    def read(tex):
        if tex not in table:
            raise ValueError(f"unknown label {tex!r}")
        return ("label", table[tex])

    return read


def vals_label(values):
    return ("label", values[0])


# ---------------------------------------------------------------------------
# Levels


def ints_in(pts, m):
    return all(sympify(c).is_integer and abs(c) <= m for p in pts for c in (p.x, p.y))


def level1(s, errs):
    g = givens(s["problem"])
    pr = s["prompt"]
    if pr.startswith("Trova l'immagine P'"):
        if not need(g, ["P", r"\vec{v}"], errs):
            return None
        P, v = g["P"], g[r"\vec{v}"]
        truth, read, kind, img = key_pt(P.translate(v.x, v.y)), read_pt, "immagine", P.translate(v.x, v.y)
    elif pr.startswith("Una traslazione manda P in P'"):
        if not need(g, ["P", "P'"], errs):
            return None
        P, img = g["P"], g["P'"]
        v = Point(img.x - P.x, img.y - P.y)
        truth, read, kind = key_pt(v), read_vec, "vettore"
        if P.translate(v.x, v.y) != img:
            errs.append("vector does not move P onto P'")
    elif pr.startswith("P' è l'immagine di P"):
        if not need(g, ["P'", r"\vec{v}"], errs):
            return None
        img, v = g["P'"], g[r"\vec{v}"]
        P = img.translate(-v.x, -v.y)
        truth, read, kind = key_pt(P), read_pt, "punto di partenza"
    else:
        errs.append(f"unknown prompt {pr!r}")
        return None
    if not ints_in([P], 8) or not ints_in([v], 6) or not ints_in([img], 12):
        errs.append("coordinates out of spec")
    if P.x == 0 or P.y == 0 or (v.x == 0 and v.y == 0):
        errs.append("P on an axis or null vector")
    check_choice(s["answer"], truth, read, vals_pt, errs, "answer")
    return kind


def level2(s, errs):
    g = givens(s["problem"])
    if not need(g, ["P"], errs):
        return None
    P = g["P"]
    pr = s["prompt"]
    axes = {"all'asse x.": ("asse x", X_AXIS), "all'asse y.": ("asse y", Y_AXIS), "alla bisettrice y = x.": ("bisettrice", BISECTOR)}
    if pr.endswith("rispetto all'origine."):
        kind, truth = "origine", P.scale(-1, -1)
    else:
        hit = [v for k, v in axes.items() if pr.endswith("rispetto " + k)]
        if len(hit) != 1:
            errs.append(f"unknown prompt {pr!r}")
            return None
        kind, truth = hit[0][0], P.reflect(hit[0][1])
    if P.x == 0 or P.y == 0 or Abs(P.x) == Abs(P.y):
        errs.append("P on an axis or a bisector")
    if not (sympify(P.y).is_integer and abs(P.y) <= 9 and abs(P.x) <= 9 and sympify(2 * P.x).is_integer):
        errs.append("P out of spec")
    check_choice(s["answer"], key_pt(truth), read_pt, vals_pt, errs, "answer")
    return kind


def ratio_ok(k):
    return k != 0 and abs(k) != 1 and k.q <= 3


def level3(s, errs):
    prob, pr = s["problem"], s["prompt"]
    if pr.startswith("Trova l'immagine P' di P nell'omotetia"):
        m = re.fullmatch(r"(.+) \\quad k = (.+)", prob)
        if not m:
            errs.append("level 3 problem not recognised")
            return None
        g = givens(m.group(1))
        if not need(g, ["P"], errs):
            return None
        k = num(m.group(2))
        P = g["P"]
        truth = P.scale(k, k)
        if not ratio_ok(k) or not ints_in([P], 9) or not ints_in([truth], 18):
            errs.append("level 3 point out of spec")
        check_choice(s["answer"], key_pt(truth), read_pt, vals_pt, errs, "answer")
        return "punto"
    if pr.startswith("Un'omotetia di centro O manda P in P'"):
        g = givens(prob)
        if not need(g, ["P", "P'"], errs):
            return None
        P, Q = g["P"], g["P'"]
        if P.x == 0 or P.y == 0:
            errs.append("P on an axis")
            return None
        k = Rational(Q.x / P.x)
        if P.scale(k, k) != Q:
            errs.append("P' is not the image of P in a homothety with centre O")
        if not ratio_ok(k):
            errs.append(f"ratio {k} out of spec")
        ans = s["answer"]
        if ans.get("kind") != "number" or Rational(ans["value"]) != k:
            errs.append(f"answer {ans.get('value')} != ratio {k}")
        check_choice(s.get("choice"), ("num", k), read_num, vals_num, errs)
        return "rapporto"
    if pr.startswith("Trova l'area del triangolo A'B'C'"):
        m = re.fullmatch(r"(.+) \\quad k = (.+)", prob)
        if not m:
            errs.append("level 3 problem not recognised")
            return None
        g = givens(m.group(1))
        if not need(g, ["A", "B", "C"], errs):
            return None
        k = num(m.group(2))
        T = Triangle(g["A"], g["B"], g["C"])
        if not isinstance(T, Triangle):
            errs.append("degenerate triangle")
            return None
        img = Triangle(*[p.scale(k, k) for p in (g["A"], g["B"], g["C"])])
        area = Abs(img.area)
        if Abs(T.area) * k**2 != area:
            errs.append("area of the image is not k^2 times the area")
        if not T.is_right() or not ints_in([g["A"], g["B"], g["C"]], 6) or not ratio_ok(k):
            errs.append("level 3 triangle out of spec")
        ans = s["answer"]
        if ans.get("kind") != "number" or Rational(ans["value"]) != area:
            errs.append(f"answer {ans.get('value')} != area {area}")
        check_choice(s.get("choice"), ("num", area), read_num, vals_num, errs)
        return "area"
    errs.append(f"unknown prompt {pr!r}")
    return None


def check_line_answer(s, truth, errs):
    ans = s["answer"]
    if ans.get("kind") != "expression" or ans.get("form") != "explicit":
        errs.append("answer must be an expression in explicit form")
        return
    try:
        if line_tex(ans["latex"]) != truth:
            errs.append(f"answer latex {ans['latex']} != {truth}")
        if line_value(ans["value"]) != truth:
            errs.append(f"answer value {ans['value']} != {truth}")
    except ValueError as e:
        errs.append(f"answer: {e}")
    if s.get("solution") != "r'\\colon " + ans.get("latex", ""):
        errs.append("solution is not r': answer")
    check_choice(s.get("choice"), ("line",) + truth, read_line, vals_line, errs)


def split_line_problem(prob):
    head, _, rest = prob.partition(" \\quad ")
    if not head.startswith("r\\colon "):
        raise ValueError(f"line problem not recognised {prob!r}")
    return line_tex(head[len("r\\colon "):]), rest


def level4(s, errs):
    (m, k), rest = split_line_problem(s["problem"])
    g = givens(rest or "")
    if not need(g, [r"\vec{v}"], errs):
        return None
    v = g[r"\vec{v}"]
    truth = image_line(m, k, lambda p: p.translate(v.x, v.y))
    if truth == (m, k):
        errs.append("the image is r itself")
    if v.x == 0 or v.y == 0 or not ints_in([v], 6) or abs(k) > 6 or abs(truth[1]) > 20:
        errs.append("level 4 data out of spec")
    check_line_answer(s, truth, errs)
    return "intero" if m.is_integer else "frazionario"


def level5(s, errs):
    (m, k), rest = split_line_problem(s["problem"])
    pr = s["prompt"]
    if k == 0 or abs(k) > 6:
        errs.append("q out of spec")
    if pr.startswith("Trova l'equazione della retta r', immagine di r nell'omotetia"):
        mm = re.fullmatch(r"k = (.+)", rest or "")
        if not mm:
            errs.append("ratio missing")
            return None
        h = num(mm.group(1))
        if not ratio_ok(h):
            errs.append("ratio out of spec")
        f, kind = (lambda p: p.scale(h, h)), "omotetia"
    else:
        if rest:
            errs.append("unexpected givens")
        table = {
            "rispetto all'asse x.": ("asse x", lambda p: p.reflect(X_AXIS)),
            "rispetto all'asse y.": ("asse y", lambda p: p.reflect(Y_AXIS)),
            "rispetto all'origine.": ("origine", lambda p: p.scale(-1, -1)),
            "rispetto alla bisettrice y = x.": ("bisettrice", lambda p: p.reflect(BISECTOR)),
        }
        hit = [v for key, v in table.items() if pr.startswith("Trova l'equazione della retta r', simmetrica di r") and pr.endswith(key)]
        if len(hit) != 1:
            errs.append(f"unknown prompt {pr!r}")
            return None
        kind, f = hit[0]
    truth = image_line(m, k, f)
    if truth == (m, k):
        errs.append("the image is r itself")
    if abs(truth[1]) > 20:
        errs.append("image out of spec")
    check_line_answer(s, truth, errs)
    return kind


def level6(s, errs):
    fx, fy = read_system(s["problem"])
    truth = map_key(fx, fy)
    pr = s["prompt"]
    # The transformation must be one of the lesson's: translation, symmetries about the axes, O, y = x, homothety.
    known = any(truth == vals_tr(v) for v in [["Sx"], ["Sy"], ["SO"], ["Sb"]])
    a, b = fx.coeff(X, 1), fy.coeff(Y, 1)
    if not known:
        if fx.coeff(Y, 1) != 0 or fy.coeff(X, 1) != 0 or a != b:
            errs.append(f"transformation not in the lesson: {fx}, {fy}")
        elif a == 1:
            if fx - X == 0 or fy - Y == 0 or not ints_in([Point(fx - X, fy - Y)], 6):
                errs.append("translation vector out of spec")
        elif fx.coeff(X, 0) != 0 or fy.coeff(Y, 0) != 0 or not ratio_ok(Rational(a)):
            errs.append("homothety out of spec")
    if pr == "Che trasformazione descrivono le equazioni?":
        check_choice(s["answer"], truth, read_tr, vals_tr, errs, "answer")
        return "riconoscere"
    if pr == "Quali sono i punti uniti della trasformazione?":
        check_choice(s["answer"], ("label", fixed_points(fx, fy)), read_label(FIXED_TEX), vals_label, errs, "answer")
        return "punti uniti"
    errs.append(f"unknown prompt {pr!r}")
    return None


def axis_line(w, h):
    return Line(Point(h, 0), Point(h, 1)) if w == "x" else Line(Point(0, h), Point(1, h))


def level7(s, errs):
    prob, pr = s["problem"], s["prompt"]
    if pr.startswith("Trova il vettore v della traslazione"):
        g = givens(prob)
        if not need(g, [r"\vec{v}_1", r"\vec{v}_2"], errs):
            return None
        v1, v2 = g[r"\vec{v}_1"], g[r"\vec{v}_2"]
        O = Point(0, 0)
        w = O.translate(v1.x, v1.y).translate(v2.x, v2.y)
        if not ints_in([v1, v2], 6) or w.x == 0 or w.y == 0:
            errs.append("vectors out of spec")
        check_choice(s["answer"], key_pt(w), read_vec, vals_pt, errs, "answer")
        return "due traslazioni"
    if pr.startswith("Trova l'immagine P'' di P applicando prima la simmetria di asse a e poi quella di asse b"):
        m = re.fullmatch(r"a\\colon ([xy]) = (-?\d+) \\quad b\\colon ([xy]) = (-?\d+) \\quad (.+)", prob)
        if not m:
            errs.append("level 7 problem not recognised")
            return None
        a = axis_line(m.group(1), int(m.group(2)))
        b = axis_line(m.group(3), int(m.group(4)))
        g = givens(m.group(5))
        if not need(g, ["P"], errs):
            return None
        P = g["P"]
        if a.contains(P) or b.contains(P):
            errs.append("P on an axis")
        truth = P.reflect(a).reflect(b)
        if not ints_in([P], 6):
            errs.append("P out of spec")
        check_choice(s["answer"], key_pt(truth), read_pt, vals_pt, errs, "answer")
        if a.is_parallel(b):
            if a.equals(b):
                errs.append("coincident axes")
            if P.distance(truth) != 2 * a.distance(b.p1):
                errs.append("the composition does not move P by 2d")
            return "assi paralleli"
        if a.is_perpendicular(b):
            C = a.intersection(b)[0]
            if truth != P.scale(-1, -1, pt=C) and truth != Point(2 * C.x - P.x, 2 * C.y - P.y):
                errs.append("the composition is not the central symmetry about the crossing point")
            if C == Point(0, 0):
                errs.append("axes crossing at the origin")
            return "assi perpendicolari"
        errs.append("axes neither parallel nor perpendicular")
        return None
    errs.append(f"unknown prompt {pr!r}")
    return None


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7}


def check(sample):
    errs = []
    for name, rx in [("+ -", r"\+\s*-"), ("- -", r"-\s*-"), ("+ 0", r"[+-]\s*0(?!\d)")]:
        if re.search(rx, sample["problem"]):
            errs.append(f"problem contains '{name}'")
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("steps or solution missing")
    ch = sample.get("choice")
    if sample["answer"].get("kind") == "choice" and ch is not None and ch != sample["answer"]:
        errs.append("choice differs from the answer")
    fn = LEVELS.get(sample["level"])
    if fn is None:
        return [f"unknown level {sample['level']}"], None
    kind = fn(sample, errs)
    return errs, kind
