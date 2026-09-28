"""teorema-di-talete (Teorema di Talete), from specs/exercises/teorema-di-talete.md.

Written from the spec, not from the generator. Every datum is read back from the text the student sees
(the prose of the problem), never from params, and the answer is found again by building the figure with
exact SymPy coordinates:

- levels 1 and 2: the parallels are horizontal lines; the transversal with two known segments is placed
  with those segments, the other transversal gets the slope that gives its known segment the stated
  length, and the asked segment is measured between the intersection points;
- level 3: the proportion is solved for x, then the figure is built with the values found and the other
  segment measured again;
- level 4: A at the origin, one side on the x-axis, the other along (3/5, 4/5); the unknown side length is a
  symbol, E (or D) is found from DE parallel to BC with a cross product, and the known datum fixes the symbol;
- level 5: the triangle is built with two different angles at A and DE parallel to BC is tested with a cross
  product;
- level 6: the triangle is built from its three sides, the bisector is the line through the vertex along the
  sum of the two unit vectors, and its foot is measured;
- level 7: the triangle from its sides (or, for the converse, with the third side as a symbol and two
  different apexes), midpoints and distances;
- level 8: the three lots as a bundle of four parallels; the bisector with the perimeter as an equation in
  the unknown side, the foot of the bisector computed from coordinates.
"""
import re

from sympy import Eq, Point, Rational, Symbol, nsimplify, simplify, solve, sqrt

CASE_RANGES = {
    1: {"prima parte": (0.40, 0.60), "seconda parte": (0.40, 0.60)},
    2: {"incognita su r": (0.40, 0.60), "incognita su s": (0.40, 0.60)},
    3: {"x": (0.25, 0.42), "altro": (0.25, 0.42), "intero": (0.25, 0.42)},
    4: {"lato": (0.35, 0.55), "parte": (0.45, 0.65)},
    5: {"parallelo": (0.40, 0.60), "quasi": (0.22, 0.38), "rovesciato": (0.12, 0.28)},
    6: {"parte lunga": (0.40, 0.60), "parte corta": (0.40, 0.60)},
    7: {"lato": (0.25, 0.42), "inverso": (0.25, 0.42), "perimetro": (0.25, 0.42)},
    8: {"lotti": (0.40, 0.60), "bisettrice": (0.40, 0.60)},
}

FASCIO = (
    "Un fascio di parallele $a$, $b$, $c$ taglia la trasversale $r$ nei punti $A$, $B$, $C$ "
    "e la trasversale $s$ nei punti $A'$, $B'$, $C'$."
)
FASCIO3 = (
    "Un fascio di parallele taglia la trasversale $r$ nei punti $A$, $B$, $C$ "
    "e la trasversale $s$ nei punti $A'$, $B'$, $C'$."
)
R_NAMES = ["AB", "BC", "AC"]
S_NAMES = ["A'B'", "B'C'", "A'C'"]
AB_SIDE = ["AD", "DB", "AB"]
AC_SIDE = ["AE", "EC", "AC"]


# ---------------------------------------------------------------------------
# Text and numbers

def prose(tex):
    """The words of a LaTeX problem: environments, \\text{} and line breaks removed."""
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


def num(s):
    """12, 3{,}5 -> Rational; no trailing zeros, no fractions."""
    s = s.strip()
    m = re.fullmatch(r"(\d+)(?:\{,\}(\d+))?", s)
    if not m:
        raise ValueError(f"not a number: {s!r}")
    if m.group(2) and m.group(2).endswith("0"):
        raise ValueError(f"trailing zero: {s}")
    if len(m.group(1)) > 1 and m.group(1).startswith("0"):
        raise ValueError(f"leading zero: {s}")
    return Rational(s.replace("{,}", "."))


def ndec(r):
    d = r.q
    for f in (2, 5):
        while d % f == 0:
            d //= f
    if d != 1:
        return None
    k = 0
    while (r * 10**k).q != 1:
        k += 1
    return k


def givens(text):
    """[(name, value, unit)] of every '$\\overline{XY} = v$ cm' in the text."""
    out = []
    for m in re.finditer(r"\$\\overline\{([A-Z']+)\} = ([^$]+)\$( cm| m)?", text):
        out.append((m.group(1), num(m.group(2)), (m.group(3) or "").strip()))
    return out


def rat(v):
    if not v.is_Rational:
        v = nsimplify(simplify(v))
    if not v.is_Rational:
        raise ValueError(f"not rational: {v}")
    return Rational(v)


def check_number(sample, truth, unit, errs, max_dec=1):
    ans = sample["answer"]
    if ans.get("kind") != "number":
        errs.append("answer is not a number")
        return
    if Rational(ans["value"]) != truth:
        errs.append(f"answer {ans['value']} != truth {truth}")
    elif ans["value"] != str(truth):
        errs.append(f"answer {ans['value']} not in reduced form {truth}")
    if truth <= 0 or ndec(truth) is None or ndec(truth) > max_dec:
        errs.append(f"truth {truth} not a positive decimal with at most {max_dec} digits")
    ch = sample.get("choice")
    if not ch or ch.get("kind") != "choice":
        errs.append("no choice variant")
        return
    opts = ch["options"]
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    vals = []
    for o in opts:
        m = re.fullmatch(r"(.+?)\\text\{ (cm|m)\}", o["latex"]) if unit else re.fullmatch(r"(.+)", o["latex"])
        if not m or (unit and m.group(2) != unit):
            errs.append(f"option not in {unit or 'numbers'}: {o['latex']}")
            return
        try:
            v = num(m.group(1))
        except ValueError as e:
            errs.append(str(e))
            return
        if Rational(o["values"][0]) != v:
            errs.append(f"option values {o['values']} != latex {o['latex']}")
        if v <= 0 or ndec(v) > 1:
            errs.append(f"implausible option {v}")
        vals.append(v)
    if len(set(vals)) != len(vals):
        errs.append(f"options not distinct: {vals}")
    right = [i for i, v in enumerate(vals) if v == truth]
    if len(right) != 1:
        errs.append(f"{len(right)} options equal the truth {truth}")
    elif right[0] != ch["correct"]:
        errs.append("choice.correct points to a wrong option")


# ---------------------------------------------------------------------------
# Figures

def fascio(parts, k):
    """A bundle of horizontal parallels y = h cut by two transversals x = x0 + c*y. `parts` are the consecutive
    segments on the first transversal; the second is tilted so that its segments are k times longer (k > 0).
    Each transversal is returned as (heights of its intersections with the parallels, c^2): a point is
    (x0 + c*h, h), and two of its points are sqrt(dh^2 * (1 + c^2)) apart."""
    heights = [Rational(0)]
    for p in parts:
        heights.append(heights[-1] + p)
    if k >= 1:
        return (heights, Rational(0)), (heights, k**2 - 1)
    ys = [k * y for y in heights]
    return (ys, 1 / k**2 - 1), (ys, Rational(0))


def seg_lengths(line, i=None, j=None):
    """[first part, second part, whole] of a transversal cut by three parallels, or the segment i-j."""
    ys, c2 = line

    def d(u, v):
        return rat(sqrt((ys[v] - ys[u]) ** 2 * (1 + c2)))

    if i is not None:
        return d(i, j)
    return [d(0, 1), d(1, 2), d(0, 2)]


def two_lines(known, line_names):
    """Group the known segments by line: returns (L, O) as lists of indices per line name set."""
    by = {}
    for n, v in known.items():
        for key, names in line_names.items():
            if n in names:
                by.setdefault(key, {})[names.index(n)] = v
    return by


def parts_from(vals):
    """First and second part from two known of {0: part1, 1: part2, 2: whole}."""
    if 0 in vals and 1 in vals:
        return vals[0], vals[1]
    if 0 in vals:
        return vals[0], vals[2] - vals[0]
    return vals[2] - vals[1], vals[1]


# ---------------------------------------------------------------------------
# Levels 1 and 2

def check_l12(sample, errs):
    lvl = sample["level"]
    text = prose(sample["problem"])
    m = re.fullmatch(re.escape(FASCIO) + r" Sai che (.*)\. Trova \$([A-Z']+)\$\.", text)
    if not m:
        errs.append(f"unreadable problem: {text}")
        return None
    g = givens(m.group(1))
    asked = m.group(2)
    if len(g) != 3 or any(u != "cm" for _, _, u in g):
        errs.append(f"expected three givens in cm: {g}")
        return None
    known = {n: v for n, v, _ in g}
    if len(known) != 3 or asked in known:
        errs.append("repeated or asked given")
        return None
    by = two_lines(known, {"r": R_NAMES, "s": S_NAMES})
    if sorted(len(v) for v in by.values()) != [1, 2]:
        errs.append(f"not two data on one transversal and one on the other: {known}")
        return None
    lk = next(k for k, v in by.items() if len(v) == 2)
    ok = next(k for k, v in by.items() if len(v) == 1)
    names = {"r": R_NAMES, "s": S_NAMES}
    if asked not in names[ok]:
        errs.append(f"asked {asked} is not on the transversal with one datum")
        return None
    p, qq = parts_from(by[lk])
    if p <= 0 or qq <= 0:
        errs.append("a part is not positive")
        return None
    (oi, ov), = by[ok].items()
    Lvals = [p, qq, p + qq]
    k = ov / Lvals[oi]
    P, Q = fascio([p, qq], k)
    Llen, Olen = seg_lengths(P), seg_lengths(Q)
    for i, v in by[lk].items():
        if Llen[i] != v:
            errs.append("figure does not match the data")
    if Olen[oi] != ov:
        errs.append("figure does not match the data on the second transversal")
    truth = Olen[names[ok].index(asked)]
    for v in known.values():
        if ndec(v) is None or ndec(v) > 1 or v > 40:
            errs.append(f"given {v} out of range")
    if lvl == 1:
        if lk != "r" or set(by["r"]) != {0, 1} or oi == 2 or asked == "A'C'":
            errs.append("level 1 must give AB, BC and a part on s")
        if k == 1 or p == qq:
            errs.append("congruent segments")
        if any(not v.is_integer for v in list(known.values()) + [truth]):
            errs.append("level 1 must be all integers")
        case = "seconda parte" if asked == "B'C'" else "prima parte"
    else:
        if 2 not in by[lk] and oi != 2 and names[ok].index(asked) != 2:
            errs.append("level 2 needs a whole segment")
        case = "incognita su r" if ok == "r" else "incognita su s"
    check_number(sample, truth, "cm", errs)
    return case


# ---------------------------------------------------------------------------
# Level 3

def check_l3(sample, errs):
    text = prose(sample["problem"])
    m = re.fullmatch(
        re.escape(FASCIO3)
        + r" Su \$([rs])\$ il segmento \$([A-Z']+)\$ misura \$([^$]+)\$ e \$([A-Z']+)\$ misura \$([^$]+)\$; "
        r"su \$([rs])\$, \$\\overline\{([A-Z']+)\} = (\d+)\$ ed? \$\\overline\{([A-Z']+)\} = (\d+)\$\. Trova \$([A-Z']+)\$\.",
        text,
    )
    if not m:
        errs.append(f"unreadable problem: {text}")
        return None
    xl, n1, e1, n2, e2, ol, o1n, o1, o2n, o2, asked = m.groups()
    names = {"r": R_NAMES, "s": S_NAMES}
    if {xl, ol} != {"r", "s"} or [n1, n2] != names[xl][:2] or [o1n, o2n] != names[ol][:2]:
        errs.append("wrong segment names")
        return None
    x = Symbol("x", positive=True)
    exprs = []
    for e in (e1, e2):
        mm = re.fullmatch(r"x(?: ([+-]) (\d+))?", e)
        if not mm:
            errs.append(f"bad expression {e}")
            return None
        exprs.append(x + (0 if not mm.group(1) else int(mm.group(2)) * (1 if mm.group(1) == "+" else -1)))
    if sum(1 for e in exprs if e == x) != 1:
        errs.append("exactly one segment must be x")
    o1, o2 = Rational(o1), Rational(o2)
    sol = solve(Eq(exprs[0] * o2, exprs[1] * o1), x)
    if len(sol) != 1:
        errs.append(f"no unique positive solution: {sol}")
        return None
    xv = sol[0]
    e_vals = [e.subs(x, xv) for e in exprs]
    if not xv.is_integer or any(v <= 0 for v in e_vals):
        errs.append(f"x = {xv} not a positive integer or a segment not positive")
        return None
    if [o1, o2] == e_vals:
        errs.append("the two transversals have the same segments")
    # Figure: the known transversal carries o1, o2; the other one gets the first x-segment, the second is measured.
    _, Q = fascio([o1, o2], e_vals[0] / o1)
    if seg_lengths(Q)[1] != e_vals[1]:
        errs.append("figure does not give the second segment")
    idx = names[xl].index(asked) if asked in names[xl] else None
    if idx is None:
        errs.append("asked segment not on the x transversal")
        return None
    truth = [e_vals[0], e_vals[1], e_vals[0] + e_vals[1]][idx]
    case = "intero" if idx == 2 else ("x" if exprs[idx] == x else "altro")
    if max(e_vals + [o1, o2]) > 40:
        errs.append("numbers too big")
    check_number(sample, Rational(truth), "", errs)
    return case


# ---------------------------------------------------------------------------
# Level 4

U = (Rational(3, 5), Rational(4, 5))


def cross(p, q):
    return p.x * q.y - p.y * q.x


def check_l4(sample, errs):
    text = prose(sample["problem"])
    m = re.fullmatch(
        r"Nel triangolo \$ABC\$ il segmento \$DE\$ è parallelo a \$BC\$, con \$D\$ su \$AB\$ ed \$E\$ su \$AC\$\. "
        r"Sai che (.*)\. Trova (il lato )?\$([A-Z]+)\$\.",
        text,
    )
    if not m:
        errs.append(f"unreadable problem: {text}")
        return None
    g = givens(m.group(1))
    asked = m.group(3)
    known = {n: v for n, v, u in g if u == "cm"}
    if len(g) != 3 or len(known) != 3 or asked in known:
        errs.append(f"bad givens {g}")
        return None
    by = two_lines(known, {"ab": AB_SIDE, "ac": AC_SIDE})
    if sorted(len(v) for v in by.values()) != [1, 2]:
        errs.append(f"not two data on one side and one on the other: {known}")
        return None
    lk = next(k for k, v in by.items() if len(v) == 2)
    ok = next(k for k, v in by.items() if len(v) == 1)
    names = {"ab": AB_SIDE, "ac": AC_SIDE}
    if asked not in names[ok]:
        errs.append("asked segment not on the side with one datum")
        return None
    if (m.group(2) is not None) != (asked in ("AB", "AC")):
        errs.append("'il lato' used wrongly")
    p, qq = parts_from(by[lk])
    if p <= 0 or qq <= 0:
        errs.append("a part is not positive")
        return None
    L = Symbol("L", positive=True)
    s = Symbol("s")
    A = Point(0, 0)
    if lk == "ab":
        B, D = Point(p + qq, 0), Point(p, 0)
        C = Point(L * U[0], L * U[1])
        E = Point(s * C.x, s * C.y)
        sv = solve(Eq(cross(E - D, C - B), 0), s)[0]
        other = [sv * L, (1 - sv) * L, L]  # AE, EC, AC
    else:
        C = Point((p + qq) * U[0], (p + qq) * U[1])
        E = Point(p * U[0], p * U[1])
        B = Point(L, 0)
        D = Point(s * L, 0)
        sv = solve(Eq(cross(E - D, C - B), 0), s)[0]
        other = [sv * L, (1 - sv) * L, L]  # AD, DB, AB
    (oi, ov), = by[ok].items()
    Lsol = solve(Eq(other[oi], ov), L)
    if len(Lsol) != 1:
        errs.append("the data do not fix the triangle")
        return None
    truth = rat(other[names[ok].index(asked)].subs(L, Lsol[0]))
    for v in known.values():
        if ndec(v) is None or ndec(v) > 1 or v > 40:
            errs.append(f"given {v} out of range")
    check_number(sample, truth, "cm", errs)
    return "lato" if asked in ("AB", "AC") else "parte"


# ---------------------------------------------------------------------------
# Level 5

YES = r"\text{sì, }DE \parallel BC"
NO = r"\text{no, }DE \nparallel BC"


def check_l5(sample, errs):
    text = prose(sample["problem"])
    m = re.fullmatch(
        r"Nel triangolo \$ABC\$ il punto \$D\$ sta su \$AB\$ con \$\\overline\{AD\} = (\d+)\$ ed? \$\\overline\{(DB|AB)\} = (\d+)\$, "
        r"il punto \$E\$ sta su \$AC\$ con \$\\overline\{AE\} = (\d+)\$ ed? \$\\overline\{(EC|AC)\} = (\d+)\$\. Il segmento \$DE\$ è parallelo a \$BC\$\?",
        text,
    )
    if not m:
        errs.append(f"unreadable problem: {text}")
        return None
    ad, ab = int(m.group(1)), int(m.group(3))
    ae, ac = int(m.group(4)), int(m.group(6))
    if m.group(2) == "DB":
        ab += ad
    if m.group(5) == "EC":
        ac += ae
    db, ec = ab - ad, ac - ae
    if min(ad, db, ae, ec) < 2 or max(ad, db, ae, ec) > 30:
        errs.append("segments out of range")
    if m.group(2) == "AB" and m.group(5) == "AC":
        errs.append("both sides given whole")
    verdicts = set()
    for u in (U, (Rational(5, 13), Rational(12, 13))):
        B, D = Point(ab, 0), Point(ad, 0)
        C, E = Point(ac * u[0], ac * u[1]), Point(ae * u[0], ae * u[1])
        verdicts.add(cross(E - D, C - B) == 0)
    if len(verdicts) != 1:
        errs.append("parallelism depends on the angle")
        return None
    par = verdicts.pop()
    opts = sample["answer"].get("options", [])
    if sample["answer"].get("kind") != "choice" or sorted(o["latex"] for o in opts) != sorted([YES, NO]):
        errs.append(f"options are not yes and no: {[o['latex'] for o in opts]}")
        return None
    want = YES if par else NO
    if opts[sample["answer"]["correct"]]["latex"] != want:
        errs.append("correct option is wrong")
    for o in opts:
        if o["values"] != (["parallelo"] if o["latex"] == YES else ["non parallelo"]):
            errs.append("option values do not match")
    if par:
        return "parallelo"
    if ad * ae == db * ec:
        return "rovesciato"
    near = abs(Rational(ad, db) / Rational(ae, ec) - 1)
    if near > Rational(1, 3):
        errs.append(f"not a near miss: {ad}:{db} vs {ae}:{ec}")
    return "quasi"


# ---------------------------------------------------------------------------
# Level 6

def triangle(sides):
    """Vertices A, B, C from {'AB': c, 'AC': b, 'BC': a}: B at the origin, C on the x-axis, A above. A point is
    stored as (x, t) with y = t * h, and h^2 is returned with the points (so every coordinate stays rational);
    the map (x, t) -> (x, t*h) keeps lines, intersections and midpoints."""
    a, b, c = sides["BC"], sides["AC"], sides["AB"]
    xa = (c**2 - b**2 + a**2) / (2 * a)
    h2 = c**2 - xa**2
    if h2 <= 0:
        raise ValueError("degenerate triangle")
    return {"A": (xa, Rational(1)), "B": (Rational(0), Rational(0)), "C": (a, Rational(0))}, h2


def dist(p, q, h2):
    return rat(sqrt((p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 * h2))


def meet(p, d, q, e):
    """Intersection of the lines p + l*d and q + m*e."""
    det = d[0] * (-e[1]) - d[1] * (-e[0])
    if det == 0:
        raise ValueError("parallel lines")
    rx, ry = q[0] - p[0], q[1] - p[1]
    lam = (rx * (-e[1]) - ry * (-e[0])) / det
    return (p[0] + lam * d[0], p[1] + lam * d[1])


def check_l6(sample, errs):
    text = prose(sample["problem"])
    m = re.fullmatch(
        r"Nel triangolo \$ABC\$ i lati misurano (.*)\. La bisettrice dell'angolo \$\\hat\{([ABC])\}\$ incontra \$([ABC])([ABC])\$ in \$D\$\. "
        r"Trova \$([A-D]{2})\$\.",
        text,
    )
    if not m:
        errs.append(f"unreadable problem: {text}")
        return None
    g = givens(m.group(1))
    sides = {n: v for n, v, u in g if u == "cm"}
    if sorted(sides) != ["AB", "AC", "BC"] or len(g) != 3:
        errs.append(f"bad sides {g}")
        return None
    V, X, Y = m.group(2), m.group(3), m.group(4)
    if {V, X, Y} != {"A", "B", "C"} or X > Y:
        errs.append("bisector does not meet the opposite side")
        return None
    asked = m.group(5)
    if asked not in (f"{X}D", f"D{Y}"):
        errs.append(f"asked {asked} is not a part of {X}{Y}")
        return None
    try:
        P, h2 = triangle(sides)
    except ValueError:
        errs.append("triangle does not exist")
        return None
    side = lambda u, v: sides["".join(sorted(u + v))]  # noqa: E731
    if side(V, X) == side(V, Y):
        errs.append("isosceles on the base: the bisector is the median")
    # Unit vectors from V towards X and Y (lengths are the sides); their sum is along the bisector.
    d = tuple((P[X][i] - P[V][i]) / side(V, X) + (P[Y][i] - P[V][i]) / side(V, Y) for i in (0, 1))
    Dp = meet(P[V], d, P[X], (P[Y][0] - P[X][0], P[Y][1] - P[X][1]))
    near = X if asked.startswith(X) else Y
    truth = dist(Dp, P[near], h2)
    for v in sides.values():
        if not v.is_integer or v > 30:
            errs.append(f"side {v} out of range")
    check_number(sample, truth, "cm", errs)
    return "parte lunga" if side(V, near) > side(V, X if near == Y else Y) else "parte corta"


# ---------------------------------------------------------------------------
# Level 7

MIDS = {"M": "AB", "N": "AC", "P": "BC"}


def check_l7(sample, errs):
    text = prose(sample["problem"])
    m1 = re.fullmatch(
        r"Nel triangolo \$ABC\$ i lati misurano (.*)\. I punti \$([MNP])\$ e \$([MNP])\$ sono i punti medi di \$([ABC]{2})\$ e \$([ABC]{2})\$\. Trova \$([MNP]{2})\$\.",
        text,
    )
    m2 = re.fullmatch(
        r"Nel triangolo \$ABC\$ i punti \$([MNP])\$ e \$([MNP])\$ sono i punti medi di \$([ABC]{2})\$ e \$([ABC]{2})\$, e (.*)\. Trova \$([ABC]{2})\$\.",
        text,
    )
    m3 = re.fullmatch(
        r"Il triangolo \$ABC\$ ha (.*); \$M\$, \$N\$ e \$P\$ sono i punti medi di \$AB\$, \$AC\$ e \$BC\$\. Trova il perimetro del triangolo \$MNP\$\.",
        text,
    )
    if m1 or m3:
        g = givens((m1 or m3).group(1))
        sides = {n: v for n, v, u in g if u == "cm"}
        if sorted(sides) != ["AB", "AC", "BC"] or len(g) != 3:
            errs.append(f"bad sides {g}")
            return None
        if len(set(sides.values())) != 3:
            errs.append("triangle not scalene")
        try:
            P, h2 = triangle(sides)
        except ValueError:
            errs.append("triangle does not exist")
            return None
        mid = {k: tuple((P[s[0]][i] + P[s[1]][i]) / 2 for i in (0, 1)) for k, s in MIDS.items()}
        if m1:
            p1, p2, s1, s2, asked = m1.group(2, 3, 4, 5, 6)
            if MIDS[p1] != s1 or MIDS[p2] != s2 or sorted(asked) != sorted(p1 + p2):
                errs.append("midpoints and asked segment do not match")
                return None
            truth = dist(mid[p1], mid[p2], h2)
            case = "lato"
        else:
            truth = dist(mid["M"], mid["N"], h2) + dist(mid["N"], mid["P"], h2) + dist(mid["M"], mid["P"], h2)
            case = "perimetro"
    elif m2:
        p1, p2, s1, s2, rest, asked = m2.groups()
        if p1 == p2 or {s1, s2, asked} != {"AB", "AC", "BC"}:
            errs.append("bad midpoint data")
            return None
        g = givens(rest)
        if len(g) != 1 or sorted(g[0][0]) != sorted(p1 + p2) or g[0][2] != "cm":
            errs.append(f"bad given {g}")
            return None
        v = g[0][1]
        # The asked side from (0, 0) to (L, 0), the apex anywhere: two apexes must give the same L.
        L = Symbol("L", positive=True)
        found = set()
        for apex in (Point(2, 5), Point(-3, 7)):
            ends = {asked[0]: Point(0, 0), asked[1]: Point(L, 0)}
            third = next(c for c in "ABC" if c not in asked)
            ends[third] = apex
            m_1 = (ends[s1[0]] + ends[s1[1]]) / 2
            m_2 = (ends[s2[0]] + ends[s2[1]]) / 2
            sol = solve(Eq(m_1.distance(m_2), v), L)
            found.add(tuple(sol))
        if len(found) != 1 or len(next(iter(found))) != 1:
            errs.append("the midpoint segment does not determine the side")
            return None
        truth = rat(next(iter(found))[0])
        if ndec(v) is None or ndec(v) > 1:
            errs.append(f"given {v} out of range")
        case = "inverso"
    else:
        errs.append(f"unreadable problem: {text}")
        return None
    check_number(sample, truth, "cm", errs)
    return case


# ---------------------------------------------------------------------------
# Level 8

ORD = {"primo": 0, "secondo": 1, "terzo": 2}


def check_l8(sample, errs):
    text = prose(sample["problem"])
    m1 = re.fullmatch(
        r"Tre lotti di terreno stanno tra due strade rettilinee \$r\$ e \$s\$, e i confini tra un lotto e l'altro sono paralleli\. "
        r"Sulla strada \$r\$ i lotti hanno i fronti di \$(\d+)\$ m, \$(\d+)\$ m e \$(\d+)\$ m; sulla strada \$s\$ i tre fronti insieme misurano \$(\d+)\$ m\. "
        r"Trova il fronte del (primo|secondo|terzo) lotto sulla strada \$s\$\.",
        text,
    )
    m2 = re.fullmatch(
        r"Il triangolo \$ABC\$ ha perimetro \$(\d+)\$ cm\. La bisettrice dell'angolo \$\\hat\{A\}\$ divide il lato \$BC\$ in "
        r"\$\\overline\{BD\} = (\d+)\$ cm e \$\\overline\{DC\} = (\d+)\$ cm\. Trova \$(AB|AC)\$\.",
        text,
    )
    if m1:
        f = [Rational(m1.group(i)) for i in (1, 2, 3)]
        S = Rational(m1.group(4))
        if len(set(f)) != 3 or S == sum(f):
            errs.append("equal fronts or the same total on both roads")
        # Four parallels (the three boundaries and the two ends): measure on s.
        P, Q = fascio(f, S / sum(f))
        if seg_lengths(P, 0, 3) != sum(f) or seg_lengths(Q, 0, 3) != S:
            errs.append("figure does not give the totals")
        i = ORD[m1.group(5)]
        truth = seg_lengths(Q, i, i + 1)
        check_number(sample, truth, "m", errs)
        return "lotti"
    if m2:
        per, bd, dc = (Rational(m2.group(i)) for i in (1, 2, 3))
        a = bd + dc
        c = Symbol("c", positive=True)  # AB
        b = per - a - c  # AC
        xa = (c**2 - b**2 + a**2) / (2 * a)
        A, B, C = (xa, Rational(1)), (Rational(0), Rational(0)), (a, Rational(0))  # (x, t) as in triangle()
        d = tuple((B[i] - A[i]) / c + (C[i] - A[i]) / b for i in (0, 1))
        foot = simplify(meet(A, d, B, (a, Rational(0)))[0])
        sol = [s for s in solve(Eq(foot, bd), c) if s > 0 and per - a - s > 0]
        if len(sol) != 1:
            errs.append(f"no unique triangle: {sol}")
            return None
        ab, ac = sol[0], per - a - sol[0]
        if not (ab + ac > a and abs(ab - ac) < a):
            errs.append("triangle does not exist")
        if bd == dc:
            errs.append("isosceles")
        truth = Rational(ab if m2.group(4) == "AB" else ac)
        check_number(sample, truth, "cm", errs)
        return "bisettrice"
    errs.append(f"unreadable problem: {text}")
    return None


def check(sample):
    errs = []
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    for s in [sample["problem"], sample["solution"], *sample["steps"]]:
        if "—" in s or "piuttosto che" in s:
            errs.append("long dash or 'piuttosto che'")
    lvl = sample["level"]
    fn = {1: check_l12, 2: check_l12, 3: check_l3, 4: check_l4, 5: check_l5, 6: check_l6, 7: check_l7, 8: check_l8}.get(lvl)
    if fn is None:
        return [f"unknown level {lvl}"], None
    kind = fn(sample, errs)
    if kind and sample.get("params", {}).get("case") != kind:
        errs.append(f"params.case {sample.get('params', {}).get('case')} != {kind}")
    return errs, kind
