"""Checker for equivalenza-aree (specs/exercises/equivalenza-aree.md).

Written from the spec and the lesson, not from the generator. Each problem is read back from its text (not from
params), the figure is built with exact coordinates in SymPy and the asked quantity is measured on it:
- areas are shoelace areas of the polygon (sympy.geometry.Polygon), with the triangle, the trapezio and the
  rhombus placed on concrete coordinates that respect the data (a parallelogram has its vertex D at height h on
  a side of length s, so the checker also sees that h < s);
- a measure from the area is the positive root of "area of the figure with an unknown = given area" (SymPy solve);
- the second height of a parallelogram or triangle, and the height on the hypotenuse, are distances from a vertex
  to a line, on a figure built from the data (both positions of the vertex, when there are two);
- conversions go through square metres, with each unit a square of side 1, 1/10, 1/100, 1/1000 m;
- a regular polygon: the given apothem must round the true one (cot(pi/n) * l / 2) to the hundredth, the fixed
  number to the thousandth; the area is the sum of the n triangles on the sides, and must be within 0.5% of the
  true area of the polygon.
Then: the answer, the multiple-choice variant (four different values, the right one, the text of each option), the
number of decimals, and the share of each case.
"""
import re

from sympy import Eq, Point, Polygon, Rational, Symbol, cot, nsimplify, pi, simplify, sin, solve, sqrt
from sympy.geometry import Line, RegularPolygon

CASE_RANGES = {
    1: {k: (0.11, 0.23) for k in ["rettangolo", "quadrato", "parallelogramma", "triangolo", "trapezio", "rombo"]},
    2: {"conversione": (0.40, 0.60), "rettangolo": (0.40, 0.60)},
    3: {k: (0.17, 0.33) for k in ["triangolo", "trapezio", "rombo", "parallelogramma"]},
    4: {k: (0.23, 0.43) for k in ["parallelogramma", "triangolo", "rettangolo"]},
    5: {"lato": (0.40, 0.60), "perimetro": (0.17, 0.33), "numero-fisso": (0.17, 0.33)},
    6: {k: (0.23, 0.43) for k in ["somma", "differenza", "equivalenti"]},
}

BANNED = re.compile(r"—|piuttosto che")

# ---------------------------------------------------------------------------
# Numbers as the lesson writes them: 9{,}6, 5400, 35\,000


NUM = r"(\d{1,3}(?:\\,\d{3})+|\d+)(?:\{,\}(\d+))?"
NUMC = r"((?:\d{1,3}(?:\\,\d{3})+|\d+)(?:\{,\}\d+)?)"


def parse_num(s):
    m = re.fullmatch(NUM, s)
    if not m:
        raise ValueError(f"not a number: {s!r}")
    whole = m.group(1).replace("\\,", "")
    frac = m.group(2) or ""
    return Rational(int(whole + frac), 10 ** len(frac))


def fmt(r):
    """The expected writing of a positive terminating decimal."""
    r = Rational(r)
    k = 0
    while (r * 10**k).q != 1:
        k += 1
        if k > 12:
            raise ValueError(f"{r} is not a terminating decimal")
    s = str(int(r * 10**k)).rjust(k + 1, "0")
    whole, frac = s[: len(s) - k], s[len(s) - k :]
    if len(whole) >= 5:
        whole = f"{int(whole):,}".replace(",", "\\,")
    return f"{whole}{{,}}{frac}" if frac else whole


def n_decimals(r):
    k = 0
    while (Rational(r) * 10**k).q != 1:
        k += 1
        if k > 12:
            return 99
    return k


def num(s):
    """Parses and checks that the number is written in the canonical way."""
    v = parse_num(s)
    if fmt(v) != s:
        raise ValueError(f"number {s!r} written in a non-canonical way (expected {fmt(v)!r})")
    return v


# ---------------------------------------------------------------------------
# Reading the problem


def top_lines(tex):
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", tex.strip(), re.S)
    return m.group(1).split(r" \\ ") if m else [tex.strip()]


def prose(tex):
    out = []
    for line in top_lines(tex):
        m = re.fullmatch(r"\\text\{(.*)\}", line.strip())
        if not m:
            raise ValueError(f"expected prose lines only: {line!r}")
        out.append(m.group(1))
    return " ".join(out)


def pattern(template):
    """{L} a length in cm, {S} an area in cm^2, {V} a bare value between dollars, {N} a number inside a formula."""
    rx = re.escape(template)
    rx = rx.replace(re.escape("{L}"), r"\$" + NUMC + r"\$ cm")
    rx = rx.replace(re.escape("{S}"), r"\$" + NUMC + r"\\ \\text\{cm\}\^2\$")
    rx = rx.replace(re.escape("{V}"), r"\$" + NUMC + r"\$")
    rx = rx.replace(re.escape("{N}"), NUMC)
    return re.compile(rx)


def match(template, s):
    m = pattern(template).fullmatch(s)
    return [num(g) for g in m.groups()] if m else None


# ---------------------------------------------------------------------------
# Geometry


def area(*pts):
    return abs(Polygon(*[Point(*p) for p in pts]).area)


def rect(b, h):
    return area((0, 0), (b, 0), (b, h), (0, h))


def triangle(b, h):
    return area((0, 0), (b, 0), (b / 3, h))


def trapezio(B, b, h):
    x0 = (B - b) / 2
    return area((0, 0), (B, 0), (x0 + b, h), (x0, h))


def rhombus(d1, d2):
    return area((d1 / 2, 0), (0, d2 / 2), (-d1 / 2, 0), (0, -d2 / 2))


def square_from_diagonal(d):
    return area((d / 2, 0), (0, d / 2), (-d / 2, 0), (0, -d / 2))


def parallelogram(b, s, h, errs):
    if not 0 < h < s:
        errs.append(f"parallelogram: height {h} not shorter than the oblique side {s}")
        return None
    A, B, D = Point(0, 0), Point(b, 0), Point(sqrt(s**2 - h**2), h)
    return A, B, B + D, D


def exact_rational(v):
    """A radical expression that is a rational number, as that rational (checked exactly), else v."""
    r = nsimplify(v.evalf(60), rational=True, tolerance=Rational(1, 10**40))
    return r if (v - r).equals(0) else v


def unknown_root(expr_area, given, x):
    sols = [r for r in solve(Eq(expr_area, given), x) if r.is_real and r > 0]
    if len(sols) != 1:
        raise ValueError(f"the area does not decide the measure: {sols}")
    return simplify(sols[0])


# ---------------------------------------------------------------------------
# Answer and choice


def expect(errs, sample, truth, unit, square, max_dec):
    truth = simplify(truth)
    if not truth.is_Rational or truth <= 0:
        errs.append(f"the true answer {truth} is not a positive rational")
        return
    if n_decimals(truth) > max_dec:
        errs.append(f"answer {truth} has more than {max_dec} decimals")
    ans = sample["answer"]
    if ans.get("kind") != "number" or Rational(ans.get("value", "x")) != truth:
        errs.append(f"answer {ans.get('value')} != {truth}")
    ch = sample.get("choice")
    if ch is None:
        errs.append("no choice variant")
        return
    opts = ch.get("options", [])
    vals = [Rational(o["values"][0]) for o in opts]
    if len(opts) != 4 or len(set(vals)) != 4:
        errs.append(f"choice needs four distinct options: {[o['values'] for o in opts]}")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(opts) or vals[idx] != truth:
        errs.append("choice.correct is not the truth")
    if sum(v == truth for v in vals) != 1:
        errs.append("the truth appears more than once among the options")
    for o, v in zip(opts, vals):
        if v <= 0:
            errs.append(f"option {v} not positive")
            continue
        want = f"{fmt(v)}\\ \\text{{{unit}}}" + ("^2" if square else "")
        if o["latex"] != want:
            errs.append(f"option latex {o['latex']!r} != {want!r}")
        if sample["level"] != 2 and n_decimals(v) > max(2, n_decimals(truth)):
            errs.append(f"option {v} has more decimals than allowed")


# ---------------------------------------------------------------------------
# Level 1


def level1(s, sample, errs):
    Q = " Quanto misura l'area?"
    exp = lambda v: expect(errs, sample, v, "cm", True, 2)  # noqa: E731
    if d := match("Un rettangolo ha la base di {L} e l'altezza di {L}." + Q, s):
        exp(rect(*d))
        return "rettangolo"
    if d := match("Un quadrato ha il lato di {L}." + Q, s):
        exp(rect(d[0], d[0]))
        return "quadrato"
    if d := match("Un quadrato ha la diagonale di {L}." + Q, s):
        exp(square_from_diagonal(d[0]))
        return "quadrato"
    if d := match(
        "Nel parallelogramma $ABCD$ la base $AB$ misura {L}, il lato $AD$ misura {L} e l'altezza $DH$ relativa ad $AB$ misura {L}." + Q,
        s,
    ):
        b, side, h = d
        if side == b:
            errs.append("the parallelogram is a rhombus")
        P = parallelogram(b, side, h, errs)
        if P:
            exp(abs(Polygon(*P).area))
        return "parallelogramma"
    if d := match("Un triangolo ha la base di {L} e l'altezza relativa alla base di {L}." + Q, s):
        exp(triangle(*d))
        return "triangolo"
    if d := match(
        r"Il triangolo $ABC$ è rettangolo in $C$: i cateti misurano $\overline{AC} = {N}$ cm e $\overline{BC} = {N}$ cm, l'ipotenusa $\overline{AB} = {N}$ cm."
        + Q,
        s,
    ):
        a, c, z = d
        C, A, B = Point(0, 0), Point(a, 0), Point(0, c)
        if A.distance(B) != z:
            errs.append(f"hypotenuse {z} but the legs give {A.distance(B)}")
        exp(abs(Polygon(A, B, C).area))
        return "triangolo"
    if d := match("Un trapezio ha le basi di {L} e di {L} e l'altezza di {L}." + Q, s):
        B, b, h = d
        if not B > b:
            errs.append("the first base is not the larger")
        exp(trapezio(B, b, h))
        return "trapezio"
    if d := match("Un rombo ha le diagonali di {L} e di {L}." + Q, s):
        if d[0] == d[1]:
            errs.append("rhombus with equal diagonals is a square")
        exp(rhombus(*d))
        return "rombo"
    errs.append(f"level 1 text not recognised: {s!r}")
    return None


# ---------------------------------------------------------------------------
# Level 2

SIDE = {"m": Rational(1), "dm": Rational(1, 10), "cm": Rational(1, 100), "mm": Rational(1, 1000)}
UNIT = r"(m|dm|cm|mm)"


def level2(s, sample, errs):
    m = re.fullmatch(r"Esprimi \$" + NUMC + r"\\ \\text\{" + UNIT + r"\}\^2\$ in \$\\text\{" + UNIT + r"\}\^2\$\.", s)
    if m:
        v, u1, u2 = num(m.group(1)), m.group(2), m.group(3)
        if u1 == u2:
            errs.append("same unit")
        square_metres = v * SIDE[u1] ** 2
        expect(errs, sample, square_metres / SIDE[u2] ** 2, u2, True, 4)
        return "conversione"
    m = re.fullmatch(
        r"Un rettangolo ha la base di \$" + NUMC + r"\$ " + UNIT + r" e l'altezza di \$" + NUMC + r"\$ " + UNIT
        + r"\. Quanto misura l'area in \$\\text\{" + UNIT + r"\}\^2\$\?",
        s,
    )
    if m:
        b, ub, h, uh, ua = num(m.group(1)), m.group(2), num(m.group(3)), m.group(4), m.group(5)
        if ub == uh:
            errs.append("the two sides are in the same unit")
        if ua not in (ub, uh):
            errs.append("the area is asked in a third unit")
        a = rect(b * SIDE[ub], h * SIDE[uh])
        expect(errs, sample, a / SIDE[ua] ** 2, ua, True, 4)
        return "rettangolo"
    errs.append(f"level 2 text not recognised: {s!r}")
    return None


# ---------------------------------------------------------------------------
# Level 3

x = Symbol("x", positive=True)


def level3(s, sample, errs):
    exp = lambda v: expect(errs, sample, v, "cm", False, 1)  # noqa: E731
    if d := match("Un triangolo ha l'area di {S} e la base di {L}. Quanto misura l'altezza relativa alla base?", s):
        A, b = d
        exp(unknown_root(area((0, 0), (b, 0), (b / 3, x)), A, x))
        return "triangolo"
    if d := match("Un triangolo ha l'area di {S} e l'altezza relativa alla base di {L}. Quanto misura la base?", s):
        A, h = d
        exp(unknown_root(area((0, 0), (x, 0), (0, h)), A, x))
        return "triangolo"
    if d := match("Un trapezio ha l'area di {S} e le basi di {L} e di {L}. Quanto misura l'altezza?", s):
        A, B, b = d
        if not B > b:
            errs.append("bases not in order")
        exp(unknown_root(area((0, 0), (B, 0), (b + 1, x), (1, x)), A, x))
        return "trapezio"
    if d := match("Un trapezio ha l'area di {S}, la base maggiore di {L} e l'altezza di {L}. Quanto misura la base minore?", s):
        A, B, h = d
        root = unknown_root(area((0, 0), (B, 0), (x, h), (0, h)), A, x)
        if not root < B:
            errs.append(f"the smaller base {root} is not smaller than {B}")
        exp(root)
        return "trapezio"
    if d := match("Un rombo ha l'area di {S} e la diagonale $AC$ di {L}. Quanto misura la diagonale $BD$?", s):
        A, d1 = d
        root = unknown_root(area((d1 / 2, 0), (0, x / 2), (-d1 / 2, 0), (0, -x / 2)), A, x)
        if root == d1:
            errs.append("equal diagonals: a square")
        exp(root)
        return "rombo"
    if d := match("Un parallelogramma ha l'area di {S} e la base di {L}. Quanto misura l'altezza relativa alla base?", s):
        A, b = d
        exp(unknown_root(area((0, 0), (b, 0), (b + 3, x), (3, x)), A, x))
        return "parallelogramma"
    errs.append(f"level 3 text not recognised: {s!r}")
    return None


# ---------------------------------------------------------------------------
# Level 4

y = Symbol("y", positive=True)


def level4(s, sample, errs):
    exp = lambda v: expect(errs, sample, v, "cm", False, 2)  # noqa: E731
    intro = "Nel parallelogramma $ABCD$ il lato $AB$ misura {L}, il lato $AD$ misura {L} e "
    if d := match(intro + "l'altezza $DH$ relativa ad $AB$ misura {L}. Quanto misura l'altezza $BK$ relativa ad $AD$?", s):
        b, side, h = d
        P = parallelogram(b, side, h, errs)
        if P:
            A, B, C, D = P
            bk = simplify(Line(A, D).distance(B))
            if not bk < b:
                errs.append("BK not shorter than AB")
            exp(bk)
        return "parallelogramma"
    if d := match(intro + "l'altezza $BK$ relativa ad $AD$ misura {L}. Quanto misura l'altezza $DH$ relativa ad $AB$?", s):
        b, side, k = d
        if not k < b:
            errs.append(f"BK = {k} not shorter than AB = {b}")
        dist = Line(Point(0, 0), Point(sqrt(side**2 - y**2), y)).distance(Point(b, 0))
        sols = [r for r in solve(Eq(dist, k), y) if r.is_real and 0 < r < side]
        if len(sols) != 1:
            errs.append(f"the data do not decide DH: {sols}")
        else:
            exp(sols[0])
        return "parallelogramma"
    if d := match(
        "Nel triangolo $ABC$ il lato $AB$ misura {L}, il lato $BC$ misura {L} e l'altezza $CH$ relativa ad $AB$ misura {L}. Quanto misura l'altezza $AK$ relativa a $BC$?",
        s,
    ):
        c, a, h = d
        if not h < a:
            errs.append("CH not shorter than BC")
            return "triangolo"
        A, B = Point(0, 0), Point(c, 0)
        found = {simplify(Line(B, Point(c + e * sqrt(a**2 - h**2), h)).distance(A)) for e in (1, -1)}
        if len(found) != 1:
            errs.append(f"AK not decided: {found}")
        else:
            exp(found.pop())
        return "triangolo"
    if d := match(
        r"Il triangolo $ABC$ è rettangolo in $C$: i cateti misurano $\overline{AC} = {N}$ cm e $\overline{BC} = {N}$ cm, l'ipotenusa $\overline{AB} = {N}$ cm. Quanto misura l'altezza $CH$ relativa all'ipotenusa?",
        s,
    ):
        a, b, c = d
        C, A, B = Point(0, 0), Point(a, 0), Point(0, b)
        if A.distance(B) != c:
            errs.append(f"hypotenuse {c} but the legs give {A.distance(B)}")
        exp(Line(A, B).distance(C))
        return "rettangolo"
    if d := match("Un triangolo rettangolo ha l'area di {S} e l'ipotenusa di {L}. Quanto misura l'altezza relativa all'ipotenusa?", s):
        A, c = d
        u, v = Symbol("u", positive=True), Symbol("v", positive=True)
        legs = [sol for sol in solve([Eq(u**2 + v**2, c**2), Eq(u * v / 2, A)], [u, v], dict=True)]
        legs = [(sol[u], sol[v]) for sol in legs if sol[u].is_real and sol[v].is_real and sol[u] != sol[v]]
        if not legs:
            errs.append("no right triangle with this area and hypotenuse (or only the isosceles one)")
            return "rettangolo"
        heights = {exact_rational(Line(Point(p, 0), Point(0, q)).distance(Point(0, 0))) for p, q in legs}
        if len(heights) != 1:
            errs.append(f"height not decided: {heights}")
        else:
            exp(heights.pop())
        return "rettangolo"
    errs.append(f"level 4 text not recognised: {s!r}")
    return None


# ---------------------------------------------------------------------------
# Level 5

POLY = {"triangolo equilatero": 3, "pentagono regolare": 5, "esagono regolare": 6}
PNAME = "(" + "|".join(POLY) + ")"


def polygon_area(nsides, side, apothem):
    """The sum of the n triangles with a side as base and the apothem as height."""
    return nsides * area((0, 0), (side, 0), (side / 2, apothem))


def close_to_true(errs, nsides, side, a_area):
    true = RegularPolygon(Point(0, 0), side / (2 * sin(pi / nsides)), nsides).area
    if abs(float(a_area) / float(true) - 1) > 0.005:
        errs.append(f"area {a_area} too far from the true {float(true):.3f}")


def level5(s, sample, errs):
    exp = lambda v: expect(errs, sample, v, "cm", True, 2)  # noqa: E731
    m = re.fullmatch(
        r"Un " + PNAME + r" ha (il lato|il perimetro) di \$" + NUMC + r"\$ cm e l'apotema di \$" + NUMC
        + r"\$ cm \(arrotondato ai centesimi\)\. Quanto misura l'area\?",
        s,
    )
    if m:
        nsides = POLY[m.group(1)]
        v, a = num(m.group(3)), num(m.group(4))
        side = v if m.group(2) == "il lato" else v / nsides
        if not side.is_integer:
            errs.append(f"side {side} not an integer")
        true_a = cot(pi / nsides) * side / 2
        if abs(float(true_a) - float(a)) > 0.005 or n_decimals(a) != 2:
            errs.append(f"apothem {a} is not {float(true_a):.4f} rounded to hundredths")
        A = polygon_area(nsides, side, a)
        close_to_true(errs, nsides, side, A)
        exp(A)
        return "lato" if m.group(2) == "il lato" else "perimetro"
    m = re.fullmatch(
        r"In un " + PNAME + r" l'apotema è circa \$" + NUMC + r"\$ volte il lato\. Quanto misura l'area di un " + PNAME
        + r" con il lato di \$" + NUMC + r"\$ cm\?",
        s,
    )
    if m:
        if m.group(1) != m.group(3):
            errs.append("two different polygons")
        nsides = POLY[m.group(1)]
        f, side = num(m.group(2)), num(m.group(4))
        if abs(float(cot(pi / nsides) / 2) - float(f)) > 0.0005 or n_decimals(f) != 3:
            errs.append(f"fixed number {f} is not cot(pi/{nsides})/2 to the thousandth")
        A = polygon_area(nsides, side, f * side)
        close_to_true(errs, nsides, side, A)
        exp(A)
        return "numero-fisso"
    errs.append(f"level 5 text not recognised: {s!r}")
    return None


# ---------------------------------------------------------------------------
# Level 6

RECT = r"rettangolo $ABCD$, con $\overline{AB} = {N}$ cm e $\overline{BC} = {N}$ cm, "


def level6(s, sample, errs):
    for tn, sn in (("DCE", "DC"), ("BCE", "BC")):
        d = match(
            "Una figura è formata dal rettangolo $ABCD$, con $\\overline{AB} = {N}$ cm e $\\overline{BC} = {N}$ cm, e dal triangolo $"
            + tn + "$, esterno al rettangolo, che ha la base $" + sn + "$ e l'altezza relativa a $" + sn
            + "$ di {L}. Quanto misura l'area della figura?",
            s,
        )
        if d:
            b, h, t = d
            if b == h:
                errs.append("the rectangle is a square")
            if sn == "DC":
                pts = [(0, 0), (b, 0), (b, h), (b / 3, h + t), (0, h)]
            else:
                pts = [(0, 0), (b, 0), (b + t, h / 3), (b, h), (0, h)]
            expect(errs, sample, area(*pts), "cm", True, 1)
            return "somma"
    if d := match(
        "Dal " + RECT + "si toglie il triangolo $BCE$, con $E$ sul lato $DC$ e $\\overline{CE} = {N}$ cm. Quanto misura l'area della parte che resta?",
        s,
    ):
        b, h, xx = d
        if not 0 < xx < b:
            errs.append("E is not inside DC")
        expect(errs, sample, area((0, 0), (b, 0), (b - xx, h), (0, h)), "cm", True, 1)
        return "differenza"
    if d := match(
        "Dal " + RECT + "si toglie il quadrato $CEFG$ di lato {L}, con $E$ sul lato $CD$ e $G$ sul lato $CB$. Quanto misura l'area della parte che resta?",
        s,
    ):
        b, h, sd = d
        if not sd < min(b, h):
            errs.append("the square does not fit")
        pts = [(0, 0), (b, 0), (b, h - sd), (b - sd, h - sd), (b - sd, h), (0, h)]
        expect(errs, sample, area(*pts), "cm", True, 1)
        return "differenza"
    m = re.fullmatch(r"(.*) è equivalente a (.*)\. Quanto misura (.*)\?", s)
    if m:
        f_area = given_area(m.group(2), errs)
        if f_area is None:
            return "equivalenti"
        ans = asked_measure(m.group(1), m.group(3), f_area, errs)
        if ans is not None:
            expect(errs, sample, ans, "cm", False, 1)
        return "equivalenti"
    errs.append(f"level 6 text not recognised: {s!r}")
    return None


def given_area(txt, errs):
    if d := match("un rettangolo di {L} per {L}", txt):
        if d[0] == d[1]:
            errs.append("rectangle is a square")
        return rect(*d)
    if d := match("un quadrato di lato {L}", txt):
        return rect(d[0], d[0])
    if d := match("un triangolo con la base di {L} e l'altezza relativa alla base di {L}", txt):
        return triangle(*d)
    if d := match("un rombo con le diagonali di {L} e di {L}", txt):
        if d[0] == d[1]:
            errs.append("rhombus is a square")
        return rhombus(*d)
    errs.append(f"equivalent figure not recognised: {txt!r}")
    return None


def asked_measure(g, asked, A, errs):
    cases = [
        ("Un triangolo con la base di {L}", "l'altezza del triangolo relativa alla base", lambda k: area((0, 0), (k, 0), (k / 3, x)), "triangolo"),
        ("Un triangolo con l'altezza relativa alla base di {L}", "la base del triangolo", lambda k: area((0, 0), (x, 0), (0, k)), "triangolo"),
        ("Un rettangolo con la base di {L}", "l'altezza del rettangolo", lambda k: rect(k, x), "rettangolo"),
        ("Un parallelogramma con la base di {L}", "l'altezza del parallelogramma relativa alla base", lambda k: area((0, 0), (k, 0), (k + 2, x), (2, x)), "parallelogramma"),
        ("Un rombo con una diagonale di {L}", "l'altra diagonale del rombo", lambda k: rhombus(k, x), "rombo"),
    ]
    for gt, at, build, _name in cases:
        d = match(gt, g)
        if d and asked == at:
            root = unknown_root(build(d[0]), A, x)
            if root == d[0]:
                errs.append("the asked figure is a square")
            return root
    if g == "Un quadrato" and asked == "il lato del quadrato":
        return unknown_root(rect(x, x), A, x)
    errs.append(f"asked figure not recognised: {g!r} / {asked!r}")
    return None


# ---------------------------------------------------------------------------

LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


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
        kind = LEVELS[lvl](prose(sample["problem"]), sample, errs)
    except ValueError as e:
        return errs + [str(e)], None
    return errs, kind
