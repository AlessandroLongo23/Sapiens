"""Checker for teorema-di-pitagora, from specs/exercises/teorema-di-pitagora.md.

Independent of the generator: every exercise is read back from the text of its problem and the figure is built
with coordinates in SymPy, without the formulas of the lesson.
- levels 1, 2, 3, 5: the triangle ABC with A(0, 0), B(c, 0), C(x, y), y > 0, the right angle in C written as a
  dot product (CA . CB = 0) and H(x, 0) the foot of the altitude; the data of the text are equations in c, x, y,
  solved with `solve`; they must fix the triangle, and the asked length is a distance between two points;
- level 4: the triangle is built from its three sides (B at the origin, C on the axis, A from two circles) and each
  angle is tested for a right angle with a dot product;
- level 6: the unit figure (a square of side 1, Triangle(sss=(1, 1, 1)), Triangle(asa=(30, 1, 60)),
  Triangle(asa=(45, 1, 45))) gives the ratio between the asked and the given element, and the scale follows;
- level 7: the quadrilateral with coordinates and one or two unknowns, solved from the data; perimeter and area
  from sympy's Polygon.
Every option is read back from its LaTeX (number and unit) and compared with its values and with the truth; lengths
must be written reduced. The case of each sample is recomputed from the text and its share per level is checked.
"""
import re
from math import gcd

from sympy import Point, Polygon, Rational, Triangle, factorint, pi, radsimp, solve, sqrt, symbols, sympify

from verify import exact

CASE_RANGES = {
    3: {"ipotenusa": (0.40, 0.60), "cateto": (0.40, 0.60)},
    4: {"rettangolo": (0.40, 0.60), "non rettangolo": (0.40, 0.60)},
    5: {"cateto": (0.20, 0.40), "proiezione": (0.12, 0.28), "altezza": (0.20, 0.40), "proiezione da altezza": (0.12, 0.28)},
    6: {"quadrato": (0.15, 0.35), "equilatero": (0.15, 0.35), "30-60": (0.20, 0.40), "45": (0.10, 0.30)},
    7: {"rettangolo": (0.17, 0.33), "rombo": (0.17, 0.33), "trapezio isoscele": (0.17, 0.33), "trapezio rettangolo": (0.17, 0.33)},
}

BANNED = re.compile(r"—|piuttosto che|\+\s*-|-\s*-|(?<!\d)1\\sqrt")
ANSWER_KIND = {1: "number", 2: "number", 3: "expression", 4: "choice", 5: "expression", 6: "expression", 7: "number"}
UNITS = {r"\ \text{cm}": "cm", r"\ \text{cm}^2": "cm2"}

# ---------------------------------------------------------------------------
# Reading


def prose(tex):
    """The problem as one sentence: the \\text{...} lines of the array joined with spaces."""
    tex = tex.strip()
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", tex, re.S)
    lines = m.group(1).split(r" \\ ") if m else [tex]
    out = []
    for line in lines:
        mm = re.fullmatch(r"\\text\{(.*)\}", line.strip())
        if not mm:
            raise ValueError(f"line that is not prose: {line!r}")
        out.append(mm.group(1))
    return " ".join(out)


def squarefree(n):
    return n >= 2 and all(e == 1 for e in factorint(n).values())


def num(tex):
    """A positive length as the lesson writes it, reduced: 15, \\frac{5}{2}, 4\\sqrt{2}, \\sqrt{13},
    \\frac{5\\sqrt{3}}{2}, \\frac{\\sqrt{2}}{2}. Anything not reduced is an error."""
    s = tex.strip()
    if re.fullmatch(r"[1-9]\d*", s):
        return Rational(int(s))
    m = re.fullmatch(r"\\frac\{(\d+)\}\{(\d+)\}", s)
    if m:
        p, q = int(m.group(1)), int(m.group(2))
        if gcd(p, q) != 1 or q < 2 or p == 0:
            raise ValueError(f"fraction not reduced: {tex!r}")
        return Rational(p, q)
    m = re.fullmatch(r"(\d*)\\sqrt\{(\d+)\}", s) or re.fullmatch(r"\\frac\{(\d*)\\sqrt\{(\d+)\}\}\{(\d+)\}", s)
    if m:
        k = int(m.group(1)) if m.group(1) else 1
        r = int(m.group(2))
        d = int(m.group(3)) if m.lastindex == 3 else 1
        if m.group(1) in ("1", "0") or not squarefree(r):
            raise ValueError(f"radical not reduced: {tex!r}")
        if m.lastindex == 3 and (d < 2 or gcd(k, d) != 1):
            raise ValueError(f"fraction with a radical not reduced: {tex!r}")
        return k * sqrt(r) / d
    raise ValueError(f"unreadable number {tex!r}")


def measure(tex):
    """An option: a number and its unit."""
    for u, name in UNITS.items():
        if tex.endswith(u) and not tex.endswith(u + "^2"):
            return num(tex[: -len(u)]), name
    raise ValueError(f"option without a unit: {tex!r}")


def same(a, b):
    return radsimp(sympify(a) - sympify(b)) == 0


# ---------------------------------------------------------------------------
# Right triangle ABC, right in C, with the altitude CH (levels 1, 2, 3, 5)

C_, X_, Y_ = symbols("c x y", positive=True)
A0 = Point(0, 0)


def right_triangle(data):
    """data: {segment: length}. A(0, 0), B(c, 0), C(x, y), H(x, 0); the right angle in C as CA . CB = 0."""
    B, C, H = Point(C_, 0), Point(X_, Y_), Point(X_, 0)
    eqs = [(A0 - C).dot(B - C)]
    pts = {"A": A0, "B": B, "C": C, "H": H}
    for seg, v in data.items():
        P, Q = pts[seg[0]], pts[seg[1]]
        eqs.append(P.distance(Q) ** 2 - v**2)
    sols = [s for s in solve(eqs, [C_, X_, Y_], dict=True) if 0 < s[X_] < s[C_]]
    if len(sols) != 1:
        raise ValueError(f"the data {data} give {len(sols)} triangles")
    s = sols[0]
    return {k: p.subs(s) for k, p in pts.items()}


def seg_len(pts, seg):
    return sympify(pts[seg[0]].distance(pts[seg[1]])).simplify()


SEG = r"\$(AB|AC|BC|AH|HB|CH)\$ misura \$([^$]+)\$ cm"


def read_triangle(text):
    """Data and asked segment of a problem on the right triangle ABC."""
    m = re.fullmatch(r"Un triangolo rettangolo ha i cateti di \$(\d+)\$ cm e \$(\d+)\$ cm\. Quanto misura l'ipotenusa\?", text)
    if m:
        return {"AC": num(m.group(1)), "BC": num(m.group(2))}, "AB"
    m = re.fullmatch(r"Un triangolo rettangolo ha l'ipotenusa di \$(\d+)\$ cm e un cateto di \$(\d+)\$ cm\. Quanto misura l'altro cateto\?", text)
    if m:
        return {"AB": num(m.group(1)), "AC": num(m.group(2))}, "BC"
    if not text.startswith("Nel triangolo $ABC$, rettangolo in $C$, "):
        raise ValueError(f"unknown problem {text!r}")
    data = {}
    for seg, v in re.findall(SEG, text):
        if seg in data:
            raise ValueError(f"{seg} given twice")
        data[seg] = num(v)
    q = re.search(r"Quanto misura (?:l'ipotenusa|il cateto|la proiezione|l'altezza) \$(AB|AC|BC|AH|HB|CH)\$\?$", text)
    if not q:
        raise ValueError(f"no question in {text!r}")
    names = {"AB": "l'ipotenusa", "AC": "il cateto", "BC": "il cateto", "AH": "la proiezione", "HB": "la proiezione", "CH": "l'altezza"}
    for seg in list(data) + [q.group(1)]:
        if names[seg] + f" ${seg}$" not in text and names[seg].capitalize() + f" ${seg}$" not in text:
            raise ValueError(f"{seg} named wrongly in {text!r}")
    return data, q.group(1)


# ---------------------------------------------------------------------------
# Choice


def check_measure_choice(ch, truth, unit, errs, name="choice"):
    if not ch or ch.get("kind") != "choice":
        errs.append(f"{name} missing")
        return
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{name}: {len(opts)} options, need 4")
    vals = []
    for o in opts:
        try:
            v, u = measure(o["latex"])
            (w,) = o["values"]
            w = exact(w)
        except Exception as e:  # noqa: BLE001
            errs.append(f"{name}: unreadable option {o!r}: {e}")
            return
        if u != unit:
            errs.append(f"{name}: option {o['latex']!r} in {u}, expected {unit}")
        if not same(v, w):
            errs.append(f"{name}: option latex {o['latex']!r} != values {o['values']}")
        vals.append(v)
    for i in range(len(vals)):
        for j in range(i):
            if same(vals[i], vals[j]):
                errs.append(f"{name}: options {i} and {j} are the same number")
    hits = [i for i, v in enumerate(vals) if same(v, truth)]
    if len(hits) != 1:
        errs.append(f"{name}: {len(hits)} options equal the truth {truth}")
    if ch.get("correct") not in hits:
        errs.append(f"{name}: correct index {ch.get('correct')} does not point to the truth {truth}")


def check_value_answer(s, truth, unit, errs):
    ans = s["answer"]
    kind = ANSWER_KIND[s["level"]]
    if ans.get("kind") != kind:
        errs.append(f"answer kind {ans.get('kind')}, expected {kind}")
        return
    if kind == "number":
        if not (truth.is_integer and truth > 0):
            errs.append(f"level {s['level']} needs a positive integer, truth {truth}")
        if not re.fullmatch(r"\d+", ans["value"]) or Rational(ans["value"]) != truth:
            errs.append(f"answer {ans['value']} != {truth}")
    else:
        if ans.get("form") != "simplified":
            errs.append("expression answer without form simplified")
        if not same(exact(ans["value"]), truth):
            errs.append(f"answer value {ans['value']} != {truth}")
        try:
            if not same(num(ans["latex"]), truth):
                errs.append(f"answer latex {ans['latex']} != {truth}")
        except ValueError as e:
            errs.append(f"answer latex: {e}")
    check_measure_choice(s.get("choice"), truth, unit, errs)


def small_int(v, hi):
    return v.is_integer and 0 < v <= hi


# ---------------------------------------------------------------------------
# Levels


def level123(s, errs):
    text = prose(s["problem"])
    data, asked = read_triangle(text)
    if len(data) != 2 or set(data) - {"AB", "AC", "BC"} or asked not in ("AB", "AC", "BC") or asked in data:
        errs.append(f"levels 1-3 give two sides and ask the third: {data}, {asked}")
        return None
    if not all(small_int(v, 60) for v in data.values()):
        errs.append(f"data must be integers up to 60: {data}")
    pts = right_triangle(data)
    truth = seg_len(pts, asked)
    lvl = s["level"]
    if lvl == 1 and asked != "AB":
        errs.append("level 1 asks the hypotenuse")
    if lvl == 2 and asked == "AB":
        errs.append("level 2 asks a leg")
    if lvl in (1, 2) and not truth.is_integer:
        errs.append(f"level {lvl} needs an integer result, got {truth}")
    if lvl == 3:
        k = truth.as_coeff_Mul()[0]
        if truth.is_rational or k < 2:
            errs.append(f"level 3 needs a radical to simplify, got {truth}")
        if any(v > 20 for v in data.values()):
            errs.append("level 3 data up to 20")
    check_value_answer(s, truth, "cm", errs)
    return "ipotenusa" if asked == "AB" else "cateto"


def level4(s, errs):
    text = prose(s["problem"])
    if not text.endswith("Il triangolo è rettangolo? Se sì, in quale vertice?"):
        errs.append("level 4 question not recognised")
    found = re.findall(r"\$\\overline\{(AB|BC|CA)\} = ([^$]+)\$ cm", text)
    sides = {k: num(v) for k, v in found}
    if len(found) != 3 or len(sides) != 3:
        errs.append(f"three sides needed: {found}")
        return None
    a, b, c = sides["BC"], sides["CA"], sides["AB"]
    if not (a + b > c and a + c > b and b + c > a):
        errs.append(f"the sides {sides} do not make a triangle")
        return None
    # B(0, 0), C(a, 0), A(u, w) with |AB| = c, |AC| = b, w > 0.
    u, w = symbols("u w", real=True)
    sol = [z for z in solve([u**2 + w**2 - c**2, (u - a) ** 2 + w**2 - b**2], [u, w], dict=True) if z[w].is_positive]
    if len(sol) != 1:
        errs.append("triangle not determined")
        return None
    P = {"A": Point(sol[0][u], sol[0][w]), "B": Point(0, 0), "C": Point(a, 0)}
    right = [v for v in "ABC" if radsimp(sympify((P[[x for x in "ABC" if x != v][0]] - P[v]).dot(P[[x for x in "ABC" if x != v][1]] - P[v]))).expand() == 0]
    if len(right) > 1:
        errs.append("two right angles")
        return None
    truth = right[0] if right else "no"
    ans = s["answer"]
    labels = {r"\text{Rettangolo in }A": "A", r"\text{Rettangolo in }B": "B", r"\text{Rettangolo in }C": "C", r"\text{Non è rettangolo}": "no"}
    opts = ans.get("options", [])
    if ans.get("kind") != "choice" or len(opts) != 4:
        errs.append("level 4 answer must be a choice among four")
        return None
    keys = []
    for o in opts:
        if o["latex"] not in labels or o["values"] != [labels[o["latex"]]]:
            errs.append(f"unknown option {o}")
            return None
        keys.append(labels[o["latex"]])
    if sorted(keys) != sorted(labels.values()):
        errs.append(f"options {keys}")
    if keys[ans.get("correct", -1)] != truth:
        errs.append(f"correct option {keys[ans.get('correct', -1)]}, truth {truth}")
    if s.get("choice") is not None and s["choice"] != ans:
        errs.append("choice differs from the answer")
    sq = sorted(sympify(v**2) for v in (a, b, c))
    if not all(z.is_integer for z in sq):
        errs.append("squares of the sides must be integers")
    if sq[1] == sq[2]:
        errs.append("two longest sides")
    if not all(v.is_integer and v <= 50 for v in (a, b, c) if v.is_rational):
        errs.append("integer sides up to 50")
    return "rettangolo" if right else "non rettangolo"


def level5(s, errs):
    text = prose(s["problem"])
    if "$CH$ è l'altezza relativa all'ipotenusa." not in text:
        errs.append("altitude CH not introduced")
    data, asked = read_triangle(text)
    if len(data) != 2 or asked in data:
        errs.append(f"two data needed: {data}, {asked}")
        return None
    if not all(small_int(v, 40) for v in data.values()):
        errs.append(f"data must be integers up to 40: {data}")
    pts = right_triangle(data)
    truth = seg_len(pts, asked)
    if not truth.is_rational:
        k, r = truth.as_coeff_Mul()
        if k > 30 or sympify(r**2) > 30:
            errs.append(f"radical too large {truth}")
    if sympify(seg_len(pts, "AB")) > 40:
        errs.append("hypotenuse over 40")
    check_value_answer(s, truth, "cm", errs)
    if asked == "CH":
        return "altezza"
    if asked in ("AC", "BC"):
        return "cateto"
    return "proiezione da altezza" if "CH" in data else "proiezione"


ANG = r"\$(30|45|60)\^\\circ\$"


def unit_triangle_elements(T):
    """Legs, hypotenuse and the leg opposite each acute angle of a unit right triangle."""
    ang = {v: a for v, a in T.angles.items()}
    right = [v for v, a in ang.items() if a == pi / 2]
    if len(right) != 1:
        raise ValueError("not a right triangle")
    R = right[0]
    others = [v for v in T.vertices if v != R]
    el = {"l'ipotenusa": others[0].distance(others[1])}
    for v in others:
        opp_vertex = [w for w in others if w != v][0]
        deg = sympify(ang[v] * 180 / pi)
        el[f"il cateto opposto all'angolo di ${deg}^\\circ$"] = R.distance(opp_vertex)
    return el


def level6(s, errs):
    text = prose(s["problem"])
    m = re.search(r"misura \$([^$]+)\$ cm\.", text)
    if not m:
        errs.append(f"no given length in {text!r}")
        return None
    val = num(m.group(1))
    unit = "cm"
    scale_pow = 1
    kind = None
    if text.startswith("In un quadrato "):
        kind = "quadrato"
        m = re.fullmatch(r"In un quadrato (il lato|la diagonale) misura \$[^$]+\$ cm\. Calcola (il lato|la diagonale)\.", text)
        if not m or m.group(1) == m.group(2):
            errs.append(f"square text not recognised: {text!r}")
            return None
        g, a = m.group(1), m.group(2)
        el = {"il lato": Point(0, 0).distance(Point(1, 0)), "la diagonale": Point(0, 0).distance(Point(1, 1))}
    elif text.startswith("In un triangolo equilatero "):
        kind = "equilatero"
        m = re.fullmatch(r"In un triangolo equilatero (il lato|l'altezza) misura \$[^$]+\$ cm\. Calcola (il lato|l'altezza|l'area)\.", text)
        if not m or m.group(1) == m.group(2):
            errs.append(f"equilateral text not recognised: {text!r}")
            return None
        g, a = m.group(1), m.group(2)
        T = Triangle(sss=(1, 1, 1))
        alt = list(T.altitudes.values())[0].length
        el = {"il lato": sympify(1), "l'altezza": alt, "l'area": abs(T.area)}
        if a == "l'area":
            unit, scale_pow = "cm2", 2
    elif text.startswith("Un triangolo rettangolo "):
        m = re.fullmatch(r"Un triangolo rettangolo (?:ha un angolo di " + ANG + r"|è isoscele)\. (.+?) misura \$[^$]+\$ cm\. Calcola (.+)\.", text)
        if not m:
            errs.append(f"right triangle text not recognised: {text!r}")
            return None
        angle = m.group(1)
        g = m.group(2)[0].lower() + m.group(2)[1:]
        a = m.group(3)
        if angle in ("30", "60"):
            kind = "30-60"
            el = unit_triangle_elements(Triangle(asa=(30, 1, 60)))
        else:
            kind = "45"
            T = Triangle(asa=(45, 1, 45))
            e = unit_triangle_elements(T)
            leg = e["il cateto opposto all'angolo di $45^\\circ$"]
            el = {"l'ipotenusa": e["l'ipotenusa"], "un cateto": leg}
        if g == a:
            errs.append("given and asked are the same element")
            return None
    else:
        errs.append(f"unknown figure: {text!r}")
        return None
    if g not in el or a not in el:
        errs.append(f"elements {g!r}, {a!r} not in the figure {kind}")
        return None
    k = val / el[g]
    truth = radsimp(sympify(el[a] * k**scale_pow)).simplify()
    if not (val.is_rational or sympify(val / sqrt(3)).is_rational):
        errs.append(f"given value {val} not an integer or k√3")
    if val.is_rational and not (val.is_integer and 1 <= val <= 20):
        errs.append(f"given value {val} out of 1..20")
    check_value_answer(s, truth, unit, errs)
    return kind


def level7(s, errs):
    text = prose(s["problem"])
    m = re.fullmatch(r"Un (rettangolo|rombo|trapezio isoscele|trapezio rettangolo) ha (.+)\. Calcola (.+)\.", text)
    if not m:
        errs.append(f"level 7 text not recognised: {text!r}")
        return None
    fig, data_s, asked = m.groups()
    data = {}
    for k, v in re.findall(r"(la base|la diagonale|l'altezza|il lato obliquo|i lati obliqui|il lato|una diagonale) di \$(\d+)\$ cm", data_s):
        data[k] = Rational(int(v))
    pair = re.search(r"le (basi|diagonali) di \$(\d+)\$ cm e \$(\d+)\$ cm", data_s)
    if pair:
        data[pair.group(1)] = sorted([Rational(int(pair.group(2))), Rational(int(pair.group(3)))], reverse=True)
    t, h = symbols("t h", positive=True)
    extra = []
    if fig == "rettangolo":
        b = data["la base"]
        H = data.get("l'altezza", h)
        A, B, C, D = Point(0, 0), Point(b, 0), Point(b, H), Point(0, H)
        if "la diagonale" in data:
            extra.append(A.distance(C) ** 2 - data["la diagonale"] ** 2)
        el = lambda P: {"l'altezza": H, "il perimetro": P.perimeter, "l'area": P.area, "la diagonale": A.distance(C)}
    elif fig == "rombo":
        if "diagonali" in data:
            D1, D2 = data["diagonali"]
        else:
            D1, D2 = data["una diagonale"], 2 * h
        A, B, C, D = Point(-D1 / 2, 0), Point(0, -D2 / 2), Point(D1 / 2, 0), Point(0, D2 / 2)
        if "il lato" in data:
            extra.append(A.distance(B) ** 2 - data["il lato"] ** 2)
        el = lambda P: {"il lato": A.distance(B), "il perimetro": P.perimeter, "l'area": P.area, "l'altra diagonale": B.distance(D)}
    elif fig == "trapezio isoscele":
        Bb, bb = data["basi"]
        H = data.get("l'altezza", h)
        A, B, C, D = Point(0, 0), Point(Bb, 0), Point(t + bb, H), Point(t, H)
        extra.append(A.distance(D) ** 2 - B.distance(C) ** 2)
        if "i lati obliqui" in data:
            extra.append(A.distance(D) ** 2 - data["i lati obliqui"] ** 2)
        el = lambda P: {"l'altezza": H, "il perimetro": P.perimeter, "l'area": P.area, "il lato obliquo": A.distance(D)}
    else:
        Bb, bb = data["basi"]
        H = data.get("l'altezza", h)
        A, B, C, D = Point(0, 0), Point(Bb, 0), Point(bb, H), Point(0, H)
        if "il lato obliquo" in data:
            extra.append(B.distance(C) ** 2 - data["il lato obliquo"] ** 2)
        el = lambda P: {"l'altezza": H, "il perimetro": P.perimeter, "l'area": P.area, "il lato obliquo": B.distance(C)}
    unknowns = [z for z in (t, h) if any(sympify(e).has(z) for e in extra) or any(sympify(c).has(z) for P in (A, B, C, D) for c in P.args)]
    sols = [{}]
    if unknowns:
        sols = [z for z in solve(extra, unknowns, dict=True) if all(v.is_positive for v in z.values())]
    if len(sols) != 1:
        errs.append(f"the data {data} give {len(sols)} figures")
        return None
    pts = [P.subs(sols[0]) for P in (A, B, C, D)]
    P = Polygon(*pts)
    if not isinstance(P, Polygon) or not P.is_convex():
        errs.append("degenerate or non-convex quadrilateral")
        return None
    elements = {k: sympify(v).subs(sols[0]) for k, v in el(P).items()}
    elements["l'area"] = abs(elements["l'area"])
    if asked not in elements:
        errs.append(f"unknown asked element {asked!r} for {fig}")
        return None
    truth = radsimp(elements[asked]).simplify()
    if fig.startswith("trapezio") and not pts[1].x > pts[2].x - pts[3].x:
        errs.append("bases in the wrong order")
    unit = "cm2" if asked == "l'area" else "cm"
    check_value_answer(s, truth, unit, errs)
    if any(v > 60 for v in data.get("basi", [])):
        errs.append("bases over 60")
    return fig


LEVELS = {1: level123, 2: level123, 3: level123, 4: level4, 5: level5, 6: level6, 7: level7}


def check(sample):
    errs = []
    for field in ("problem", "solution", "prompt"):
        if BANNED.search(sample.get(field, "")):
            errs.append(f"{field} contains a banned pattern")
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("steps or solution missing")
    lvl = sample["level"]
    fn = LEVELS.get(lvl)
    if fn is None:
        return [f"unknown level {lvl}"], None
    kind = fn(sample, errs)
    return errs, kind
