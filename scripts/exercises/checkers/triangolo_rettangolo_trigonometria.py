"""triangolo-rettangolo-trigonometria (Seno, coseno e tangente nel triangolo rettangolo), from
specs/exercises/triangolo-rettangolo-trigonometria.md.

Written from the spec, not from the generator. Every datum is read back from the text the student sees
(the prose of the problem, the LaTeX of the options), never from params, and the answer is found again
with coordinates and SymPy:

- level 1: the triangle is drawn with C = (0, 0), A on the x axis, B on the y axis; the hypotenuse given in
  the text must be the distance AB, and the ratio is measured from the vectors at the vertex of the angle
  (cosine from the dot product, sine from the cross product);
- level 2: SymPy's exact sin, cos, tan of pi/6, pi/4, pi/3, and of asin/acos/atan of the given value;
- level 3: SymPy's cos(asin(p/q)), tan(acos(p/q)) and so on, simplified exactly;
- levels 4 and 5: a triangle with the given angle drawn with unit hypotenuse, then scaled so that the given
  side has its length; level 4 is exact, level 5 is evaluated with 50 digits and rounded half up;
- level 6: the triangle from its sides (the third by Pythagoras), the angle measured with acos of the dot
  product at the vertex, in degrees, with 50 digits;
- level 7: the scene drawn with coordinates (the eye, the foot and the top of the object; the ramp; the ladder
  against the wall), lengths and angles measured on it.

Rounded answers must be the value rounded half up to the hundredth, and the value must not lie within 1e-6 of
a rounding boundary (the spec forbids those, since two correct calculators could disagree).
"""
import re

from sympy import Line, Point, Rational, acos, asin, atan, cos, factorint, floor, gcd, expand, pi, radsimp, sin, sqrt, sympify, tan

CASE_RANGES = {
    1: {"sin": (0.25, 0.42), "cos": (0.25, 0.42), "tan": (0.25, 0.42)},
    2: {"valore": (0.25, 0.42), "dal valore": (0.25, 0.42), "uguaglianza vera": (0.25, 0.42)},
    3: {"terna": (0.30, 0.50), "radicale": (0.50, 0.70)},
    4: {"dall'ipotenusa": (0.34, 0.54), "da un cateto": (0.46, 0.66)},
    5: {"dall'ipotenusa": (0.28, 0.46), "da un cateto": (0.54, 0.72)},
    6: {"due cateti": (0.40, 0.60), "ipotenusa e cateto opposto": (0.16, 0.34), "ipotenusa e cateto adiacente": (0.16, 0.34)},
    7: {"elevazione": (0.32, 0.48), "rampa": (0.22, 0.38), "scala": (0.22, 0.38)},
}

DIGITS = 50


# ---------------------------------------------------------------------------
# Reading the text

def prose(tex):
    """The problem as prose with its inline $...$ formulas: array, \\text{} and line breaks removed."""
    s = re.sub(r"\\(begin|end)\{array\}(\{l\})?", " ", tex)
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


def squarefree(n):
    return n >= 2 and all(e == 1 for e in factorint(n).values())


def dec(s):
    """12, 3{,}5 (no trailing zero) -> Rational."""
    m = re.fullmatch(r"(\d+)(?:\{,\}(\d+))?", s.strip())
    if not m:
        raise ValueError(f"not a decimal: {s!r}")
    if m.group(2) and m.group(2).endswith("0"):
        raise ValueError(f"trailing zero in {s!r}")
    if len(m.group(1)) > 1 and m.group(1).startswith("0"):
        raise ValueError(f"leading zero in {s!r}")
    return Rational(s.strip().replace("{,}", "."))


def exact_tex(tex, raw=False):
    """An exact positive value in reduced form: 3, \\frac{3}{5}, 2\\sqrt{3}, \\frac{\\sqrt{2}}{2},
    \\frac{15\\sqrt{3}}{2}, and with `raw` also \\frac{1}{\\sqrt{2}}. A finite decimal (3{,}5) only when
    written as a decimal is accepted by `length`."""
    s = tex.strip()
    if re.fullmatch(r"\d+", s):
        return Rational(int(s))
    m = re.fullmatch(r"\\frac\{(\d+)\}\{(\d+)\}", s)
    if m:
        p, q = int(m.group(1)), int(m.group(2))
        if gcd(p, q) != 1 or q < 2:
            raise ValueError(f"fraction not reduced: {tex!r}")
        return Rational(p, q)
    m = re.fullmatch(r"(\d*)\\sqrt\{(\d+)\}", s) or re.fullmatch(r"\\frac\{(\d*)\\sqrt\{(\d+)\}\}\{(\d+)\}", s)
    if m:
        k = int(m.group(1)) if m.group(1) else 1
        r = int(m.group(2))
        d = int(m.group(3)) if m.lastindex == 3 else 1
        if m.group(1) == "1" or not squarefree(r):
            raise ValueError(f"radical not simplified: {tex!r}")
        if m.lastindex == 3 and (d < 2 or gcd(k, d) != 1):
            raise ValueError(f"fraction with a radical not reduced: {tex!r}")
        return k * sqrt(r) / d
    if raw:
        m = re.fullmatch(r"\\frac\{1\}\{\\sqrt\{(\d+)\}\}", s)
        if m and squarefree(int(m.group(1))):
            return 1 / sqrt(int(m.group(1)))
    raise ValueError(f"unreadable exact value {tex!r}")


def length_tex(tex):
    """A length: a decimal (3{,}5) when rational, the radical form otherwise; never a fraction."""
    s = tex.strip()
    if re.fullmatch(r"\d+(\{,\}\d+)?", s):
        return dec(s)
    v = exact_tex(s)
    if v.is_rational:
        raise ValueError(f"rational length not written as a decimal: {tex!r}")
    return v


def canon(v):
    return expand(radsimp(v))


def same(a, b):
    """Exact equality of two sums of radicals: rationalised and expanded, the difference is 0."""
    return canon(a - b) == 0


def round_half_up(x):
    """(k, margin): x rounded to the hundredth in hundredths, and how far 100x is from the nearest boundary."""
    y = (100 * x).evalf(DIGITS)
    k = int(floor(y + Rational(1, 2)))
    frac = y - floor(y)
    return k, abs(frac - Rational(1, 2))


def fixed2(k):
    s = str(k).rjust(3, "0")
    return f"{s[:-2]}{{,}}{s[-2:]}"


# ---------------------------------------------------------------------------
# Choice

def choice_of(sample, errs):
    ch = sample.get("choice") if sample["answer"]["kind"] != "choice" else sample["answer"]
    if not ch or ch.get("kind") != "choice":
        errs.append("no choice variant")
        return None
    if sample["answer"]["kind"] == "choice" and sample.get("choice") not in (None, sample["answer"]):
        errs.append("choice variant differs from the choice answer")
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    if len({o["latex"] for o in opts}) != len(opts):
        errs.append("options with the same latex")
    if not isinstance(ch.get("correct"), int) or not 0 <= ch["correct"] < len(opts):
        errs.append("choice.correct out of range")
        return None
    return ch


def check_value_options(ch, truth, read, errs, is_truth=None):
    """read(latex) -> value; the values must be distinct, positive, and exactly one (the correct) equal to truth."""
    vals = []
    for o in ch["options"]:
        try:
            v = read(o["latex"])
        except ValueError as e:
            errs.append(f"option: {e}")
            return
        vals.append(v)
        try:
            if not same(sympify_value(o["values"][0]), v):
                errs.append(f"option values {o['values']} != latex {o['latex']}")
        except ValueError as e:
            errs.append(f"option value unreadable: {o['values']} ({e})")
    for i in range(len(vals)):
        if vals[i] <= 0:
            errs.append(f"option {ch['options'][i]['latex']} not positive")
        for j in range(i):
            if same(vals[i], vals[j]):
                errs.append(f"options {ch['options'][j]['latex']} and {ch['options'][i]['latex']} are the same value")
    eq = is_truth or (lambda v: same(v, truth))
    right = [i for i, v in enumerate(vals) if eq(v)]
    if len(right) != 1:
        errs.append(f"{len(right)} options equal the truth {truth}")
    elif right[0] != ch["correct"]:
        errs.append("choice.correct points to a wrong option")


def sympify_value(s):
    """A value string of the generator: "3/5", "15*sqrt(3)/2", "(3-sqrt(5))/2"."""
    if not re.fullmatch(r"[0-9+\-*/() ]*(sqrt\(\d+\)[0-9+\-*/() ]*)*", s) or not s.strip():
        raise ValueError(f"bad value string {s!r}")
    return sympify(s)


# ---------------------------------------------------------------------------
# Level 1: the ratios from the sides

FN_WORD = {"seno": "sin", "coseno": "cos", "tangente": "tan"}


def ratio_at(vertex, P, fn):
    """sin, cos or tan of the angle at vertex P[vertex] of the triangle with points P (right angle at C)."""
    other = "B" if vertex == "A" else "A"
    u = P[other] - P[vertex]
    w = P["C"] - P[vertex]
    dot = u.x * w.x + u.y * w.y
    cross = abs(u.x * w.y - u.y * w.x)
    nu, nw = sqrt(u.x**2 + u.y**2), sqrt(w.x**2 + w.y**2)
    c, s = dot / (nu * nw), cross / (nu * nw)
    return canon({"sin": s, "cos": c, "tan": s / c}[fn])


def check_l1(sample, errs):
    text = prose(sample["problem"])
    if not text.startswith("Nel triangolo $ABC$ rettangolo in $C$"):
        errs.append("not the triangle ABC right-angled in C")
    sides = {}
    for m in re.finditer(r"\$(a|b|c) = (\d+)\$ cm", text):
        sides[{"a": "BC", "b": "AC", "c": "AB"}[m.group(1)]] = int(m.group(2))
    for m in re.finditer(r"\$\\overline\{(AB|BC|AC)\} = (\d+)\$ cm", text):
        sides[m.group(1)] = int(m.group(2))
    if set(sides) != {"AB", "BC", "AC"}:
        errs.append(f"three sides not found: {text}")
        return None
    m = re.search(r"Quanto vale \$\\(sin|cos|tan)\\(alpha|beta)\$\?$", text)
    if m:
        fn, vertex = m.group(1), "A" if m.group(2) == "alpha" else "B"
        if "\\overline" in text:
            errs.append("alpha and beta with segment names")
    else:
        m = re.search(r"Quanto vale il (seno|coseno|tangente) dell'angolo \$\\widehat\{(BAC|ABC)\}\$\?$", text)
        if not m:
            errs.append(f"question not found: {text}")
            return None
        fn, vertex = FN_WORD[m.group(1)], m.group(2)[1]
    P = {"C": Point(0, 0), "A": Point(sides["AC"], 0), "B": Point(0, sides["BC"])}
    if P["A"].distance(P["B"]) != sides["AB"]:
        errs.append(f"sides {sides} are not a right triangle with hypotenuse AB")
        return None
    if max(sides.values()) > 60:
        errs.append("side over 60 cm")
    truth = ratio_at(vertex, P, fn)
    ans = sample["answer"]
    if ans.get("kind") != "number" or Rational(ans["value"]) != truth:
        errs.append(f"answer {ans} != truth {truth}")
    if not sample["solution"].endswith(f"= {latex_ratio(truth)}"):
        errs.append(f"solution {sample['solution']!r} does not end with the reduced ratio")
    ch = choice_of(sample, errs)
    if ch:
        check_value_options(ch, truth, exact_tex, errs)
    return fn


def latex_ratio(r):
    return str(r.p) if r.q == 1 else f"\\frac{{{r.p}}}{{{r.q}}}"


# ---------------------------------------------------------------------------
# Level 2: 30, 45, 60 degrees

TRIG = {"sin": sin, "cos": cos, "tan": tan}
INV = {"sin": asin, "cos": acos, "tan": atan}


def check_l2(sample, errs):
    text = prose(sample["problem"])
    ch = choice_of(sample, errs)
    if ch is None:
        return None
    m = re.fullmatch(r"Quanto vale \$\\(sin|cos|tan) (30|45|60)\^\\circ\$\?", text)
    if m:
        truth = TRIG[m.group(1)](pi * int(m.group(2)) / 180)
        check_value_options(ch, truth, exact_tex, errs)
        return "valore"
    m = re.fullmatch(r"Di un angolo acuto \$\\alpha\$ si sa che \$\\(sin|cos|tan)\\alpha = (.+?)\$\. Quanto vale \$\\(sin|cos|tan)\\alpha\$\?", text)
    if m:
        f, g = m.group(1), m.group(3)
        if f == g:
            errs.append("asks the given function")
        v = exact_tex(m.group(2))
        alpha = INV[f](v)
        if not any(same(alpha, pi * k / 180) for k in (30, 45, 60)):
            errs.append(f"given value {v} is not of 30, 45 or 60 degrees")
        truth = canon(TRIG[g](alpha))
        check_value_options(ch, truth, exact_tex, errs)
        return "dal valore"
    if text == "Quale di queste uguaglianze è vera?":
        truths, keys = [], set()
        for o in ch["options"]:
            mm = re.fullmatch(r"\\(sin|cos|tan) (30|45|60)\^\\circ = (.+)", o["latex"])
            if not mm:
                errs.append(f"not an equality: {o['latex']}")
                return None
            if (mm.group(1), mm.group(2)) in keys:
                errs.append(f"two options about {mm.group(1)} {mm.group(2)}")
            keys.add((mm.group(1), mm.group(2)))
            try:
                v = exact_tex(mm.group(3), raw=True)
            except ValueError as e:
                errs.append(str(e))
                return None
            truths.append(same(TRIG[mm.group(1)](pi * int(mm.group(2)) / 180), v))
        if truths.count(True) != 1:
            errs.append(f"{truths.count(True)} true equalities")
        elif truths.index(True) != ch["correct"]:
            errs.append("choice.correct points to a false equality")
        return "uguaglianza vera"
    errs.append(f"unknown level 2 problem: {text}")
    return None


# ---------------------------------------------------------------------------
# Level 3: from one value to the others

def check_exact_answer(sample, truth, read, errs):
    ans = sample["answer"]
    if truth.is_rational:
        if ans.get("kind") != "number" or Rational(ans["value"]) != truth:
            errs.append(f"answer {ans} != truth {truth}")
        return
    if ans.get("kind") != "expression" or ans.get("form") != "rationalized":
        errs.append("irrational answer must be an expression in rationalized form")
        return
    try:
        shown = read(ans["latex"])
    except ValueError as e:
        errs.append(f"answer latex: {e}")
        return
    if not same(shown, truth) or not same(sympify_value(ans["value"]), truth):
        errs.append(f"answer {ans['value']} / {ans['latex']} != truth {truth}")


def check_l3(sample, errs):
    text = prose(sample["problem"])
    m = re.fullmatch(r"Di un angolo acuto \$\\alpha\$ si sa che \$\\(sin|cos)\\alpha = \\frac\{(\d+)\}\{(\d+)\}\$\. Quanto vale \$\\(sin|cos|tan)\\alpha\$\?", text)
    if not m:
        errs.append(f"unreadable level 3 problem: {text}")
        return None
    f, p, q, g = m.group(1), int(m.group(2)), int(m.group(3)), m.group(4)
    if f == g or not 0 < p < q or gcd(p, q) != 1 or q > 25:
        errs.append(f"bad data {f} = {p}/{q}, asked {g}")
        return None
    if Rational(p, q) == Rational(1, 2):
        errs.append("1/2 is a notable value (level 2)")
    alpha = INV[f](Rational(p, q))
    truth = canon(TRIG[g](alpha))
    check_exact_answer(sample, truth, exact_tex, errs)
    ch = choice_of(sample, errs)
    if ch:
        check_value_options(ch, truth, exact_tex, errs)
    other = sqrt(q * q - p * p)
    return "terna" if other.is_integer else "radicale"


# ---------------------------------------------------------------------------
# Levels 4 and 5: a side from a side and an angle

SIDE_AT = {"a": ("B", "C"), "b": ("A", "C"), "c": ("A", "B")}

SIDE_ANGLE = re.compile(
    r"Nel triangolo \$ABC\$ rettangolo in \$C\$ (?:l'ipotenusa misura \$c = (?P<c>\d+)\$ cm|il cateto \$(?P<leg>[ab])\$ misura \$(?P<x>\d+)\$ cm)"
    r" e l'angolo \$\\(?P<ang>alpha|beta)\$ misura \$(?P<deg>\d+)\^\\circ\$\. Quanto misura (?:l'ipotenusa \$(?P<tc>c)\$|il cateto \$(?P<tl>[ab])\$)\?"
)


def unit_triangle(alpha):
    """A at the origin, C on the x axis, B above C: right angle in C, angle alpha in A, hypotenuse 1."""
    return {"A": Point(0, 0, evaluate=False), "C": Point(cos(alpha), 0), "B": Point(cos(alpha), sin(alpha))}


def side_len(P, s):
    u, v = SIDE_AT[s]
    return sqrt((P[u].x - P[v].x) ** 2 + (P[u].y - P[v].y) ** 2)


def read_side_angle(text, errs):
    m = SIDE_ANGLE.fullmatch(text)
    if not m:
        errs.append(f"unreadable problem: {text}")
        return None
    given = "c" if m.group("c") else m.group("leg")
    x = int(m.group("c") or m.group("x"))
    target = m.group("tc") or m.group("tl")
    d = int(m.group("deg"))
    if given == target:
        errs.append("asks the given side")
        return None
    if not 0 < d < 90:
        errs.append(f"angle {d} not acute")
        return None
    alpha_deg = d if m.group("ang") == "alpha" else 90 - d
    P = unit_triangle(pi * alpha_deg / 180)
    truth = x * side_len(P, target) / side_len(P, given)
    return given, x, target, d, truth


def check_l4(sample, errs):
    r = read_side_angle(prose(sample["problem"]), errs)
    if r is None:
        return None
    given, x, target, d, truth = r
    truth = canon(truth)
    if d not in (30, 45, 60):
        errs.append(f"angle {d} not notable")
    if not 2 <= x <= 20:
        errs.append(f"given side {x} out of 2..20")
    if same(truth, x):
        errs.append("the answer is the given side")
    check_exact_answer(sample, truth, length_tex, errs)
    ch = choice_of(sample, errs)
    if ch:
        check_value_options(ch, truth, lambda s: length_tex(unit_of(s, "cm")), errs)
    return "dall'ipotenusa" if given == "c" else "da un cateto"


def unit_of(latex, unit):
    if unit == "deg":
        m = re.fullmatch(r"(.+)\^\\circ", latex)
    else:
        m = re.fullmatch(r"(.+)\\text\{ " + unit + r"\}", latex)
    if not m:
        raise ValueError(f"option {latex!r} not in {unit}")
    return m.group(1)


def approx_read(unit):
    def read(latex):
        s = unit_of(latex, unit)
        m = re.fullmatch(r"(\d+)\{,\}(\d\d)", s)
        if not m or (len(m.group(1)) > 1 and m.group(1).startswith("0")):
            raise ValueError(f"not a value with two decimals: {latex!r}")
        return Rational(int(m.group(1) + m.group(2)), 100)

    return read


def check_rounded(sample, truth, unit, errs, exact_ok=False):
    """The answer is truth rounded half up to the hundredth; the options have two decimals in `unit`."""
    k, margin = round_half_up(truth)
    if margin < Rational(1, 10**6):
        errs.append(f"value {truth.evalf(12)} too close to a rounding boundary")
    ans = sample["answer"]
    if ans.get("kind") != "number" or Rational(ans["value"]) != Rational(k, 100):
        errs.append(f"answer {ans} != {truth.evalf(10)} rounded ({k}/100)")
    sol = sample["solution"]
    exact = exact_ok and (100 * truth).is_integer
    shown = fixed2(k)
    if exact:
        if "\\approx" in sol:
            errs.append("exact value written with \\approx")
    elif f"\\approx {shown}" not in sol:
        errs.append(f"solution {sol!r} does not say \\approx {shown}")
    ch = choice_of(sample, errs)
    if ch:
        check_value_options(ch, Rational(k, 100), approx_read(unit), errs)
        if unit == "deg":
            for o in ch["options"]:
                v = approx_read(unit)(o["latex"])
                if not 0 < v < 90:
                    errs.append(f"angle option {o['latex']} not acute")
    return k


def check_l5(sample, errs):
    r = read_side_angle(prose(sample["problem"]), errs)
    if r is None:
        return None
    given, x, target, d, truth = r
    if d in (30, 45, 60) or not 10 <= d <= 80:
        errs.append(f"angle {d} not for the calculator (10 to 80, not 30, 45, 60)")
    if not 3 <= x <= 40:
        errs.append(f"given side {x} out of 3..40")
    if not 1 <= truth.evalf(20) <= 150:
        errs.append(f"answer {truth.evalf(8)} out of 1..150 cm")
    check_rounded(sample, truth, "cm", errs)
    return "dall'ipotenusa" if given == "c" else "da un cateto"


# ---------------------------------------------------------------------------
# Level 6: an angle from two sides

def angle_deg(P, vertex):
    other = "B" if vertex == "A" else "A"
    u = P[other] - P[vertex]
    w = P["C"] - P[vertex]
    c = (u.x * w.x + u.y * w.y) / (sqrt(u.x**2 + u.y**2) * sqrt(w.x**2 + w.y**2))
    return acos(c) * 180 / pi


def check_l6(sample, errs):
    text = prose(sample["problem"])
    m = re.fullmatch(
        r"Nel triangolo \$ABC\$ rettangolo in \$C\$ (?:i cateti misurano \$a = (?P<a>\d+)\$ cm e \$b = (?P<b>\d+)\$ cm"
        r"|l'ipotenusa misura \$c = (?P<c>\d+)\$ cm e il cateto \$(?P<leg>[ab])\$ misura \$(?P<x>\d+)\$ cm)\. Quanto misura l'angolo \$\\(?P<ang>alpha|beta)\$\?",
        text,
    )
    if not m:
        errs.append(f"unreadable level 6 problem: {text}")
        return None
    vertex = "A" if m.group("ang") == "alpha" else "B"
    if m.group("a"):
        a, b = Rational(int(m.group("a"))), Rational(int(m.group("b")))
        kind = "due cateti"
    else:
        c, x = int(m.group("c")), int(m.group("x"))
        if not x < c:
            errs.append("a leg not shorter than the hypotenuse")
            return None
        other = sqrt(c * c - x * x)
        a, b = (x, other) if m.group("leg") == "a" else (other, x)
        opposite = "a" if vertex == "A" else "b"
        kind = "ipotenusa e cateto opposto" if m.group("leg") == opposite else "ipotenusa e cateto adiacente"
    P = {"C": Point(0, 0), "A": Point(b, 0), "B": Point(0, a)}
    truth = angle_deg(P, vertex)
    if any(same(truth, k) for k in (30, 45, 60)):
        errs.append("notable angle")
    if not 5 <= truth.evalf(20) <= 85:
        errs.append(f"angle {truth.evalf(8)} out of 5..85")
    check_rounded(sample, truth, "deg", errs)
    return kind


# ---------------------------------------------------------------------------
# Level 7: problems

OBJECT_RANGE = {"un albero": (4, 30), "un lampione": (4, 12), "un campanile": (15, 90), "una torre": (15, 90), "un palazzo": (10, 60)}
THE = {"un albero": ("l'albero", "alto"), "un lampione": ("il lampione", "alto"), "un campanile": ("il campanile", "alto"), "una torre": ("la torre", "alta"), "un palazzo": ("il palazzo", "alto")}


def check_l7(sample, errs):
    text = prose(sample["problem"])
    DEG = r"\$(\d+)\^\\circ\$"
    NUM = r"\$(\d+(?:\{,\}\d+)?)\$"
    m = re.fullmatch(
        r"(?:Da " + NUM + r" m di distanza dal piede di (?P<o1>.+?) vedi la cima con un angolo di elevazione di " + DEG + r"\. I tuoi occhi sono a " + NUM + r" m da terra\."
        r"|Un goniometro appoggiato a terra, a " + NUM + r" m dal piede di (?P<o2>.+?), ne vede la cima con un angolo di elevazione di " + DEG + r"\.)"
        r" Quanto è (alto|alta) (.+?)\?",
        text,
    )
    if m:
        g = m.groups()
        if m.group("o1"):
            d, obj, ang, eye = dec(g[0]), g[1], int(g[2]), dec(g[3])
        else:
            d, obj, ang, eye = dec(g[4]), g[5], int(g[6]), Rational(0)
        if obj not in OBJECT_RANGE or THE[obj] != (g[8], g[7]):
            errs.append(f"object {obj!r} / {g[7]} {g[8]} not consistent")
            return "elevazione"
        if ang in (30, 45, 60) or not 15 <= ang <= 70:
            errs.append(f"elevation angle {ang}")
        eye_pt, foot = Point(0, eye), Point(d, 0)
        sight = Line(eye_pt, Point(cos(pi * ang / 180), eye + sin(pi * ang / 180)))
        top = sight.intersection(Line(foot, Point(d, 1)))[0]
        truth = top.y
        lo, hi = OBJECT_RANGE[obj]
        if not lo <= truth.evalf(20) <= hi:
            errs.append(f"height {truth.evalf(6)} unrealistic for {obj}")
        check_rounded(sample, truth, "m", errs)
        return "elevazione"
    m = re.fullmatch(r"Una rampa deve superare un dislivello di " + NUM + r" m con una pendenza (del |dell')\$(\d+)\\%\$\. (Quanto è lunga in orizzontale\?|Che angolo forma con il terreno\?|Quanto è lunga la rampa\?)", text)
    if m:
        h, art, p, ask = dec(m.group(1)), m.group(2), int(m.group(3)), m.group(4)
        if (art == "dell'") != (p in (8, 11, 80)):
            errs.append(f"article {art!r} before {p}%")
        if p not in (5, 6, 8, 10, 12, 15, 20) or not Rational(3, 10) <= h <= Rational(6, 5):
            errs.append(f"slope {p}% or drop {h} out of spec")
        # The ramp from (0, 0) to (x, h) with h / x = p / 100.
        top = Line(Point(0, 0), Point(100, p)).intersection(Line(Point(0, h), Point(1, h)))[0]
        if "orizzontale" in ask:
            truth, unit = top.x, "m"
            if truth.is_integer:
                errs.append("integer horizontal length")
        elif "angolo" in ask:
            truth, unit = atan(Rational(p, 100)) * 180 / pi, "deg"
        else:
            truth, unit = Point(0, 0).distance(top), "m"
        check_rounded(sample, truth, unit, errs, exact_ok=True)
        return "rampa"
    m = re.fullmatch(
        r"Una scala lunga " + NUM + r" m è appoggiata a un muro verticale(?: e forma con il pavimento un angolo di " + DEG + r"\. (A che altezza arriva sul muro\?|A che distanza dal muro sta il piede della scala\?)"
        r"|, con il piede a " + NUM + r" m dal muro\. Che angolo forma con il pavimento\?)",
        text,
    )
    if m:
        L = dec(m.group(1))
        if L not in [Rational(n, 2) for n in (5, 6, 7, 8, 9, 10, 12, 14, 16)]:
            errs.append(f"ladder length {L} out of spec")
        foot = Point(0, 0)
        if m.group(2):
            ang = int(m.group(2))
            if ang == 60 or not 55 <= ang <= 80:
                errs.append(f"ladder angle {ang} out of spec")
            top = Point(L * cos(pi * ang / 180), L * sin(pi * ang / 180))
            truth = top.y if "altezza" in m.group(3) else top.x
            check_rounded(sample, truth, "m", errs)
        else:
            d = dec(m.group(4))
            if not d < L:
                errs.append("foot farther than the ladder is long")
                return "scala"
            top = Point(d, sqrt(L**2 - d**2))
            truth = acos((top.x - foot.x) / foot.distance(top)) * 180 / pi
            if not 55 <= truth.evalf(20) <= 82:
                errs.append(f"ladder angle {truth.evalf(6)} out of 55..82")
            check_rounded(sample, truth, "deg", errs)
        return "scala"
    errs.append(f"unknown level 7 problem: {text}")
    return None


# ---------------------------------------------------------------------------

LEVELS = {1: check_l1, 2: check_l2, 3: check_l3, 4: check_l4, 5: check_l5, 6: check_l6, 7: check_l7}


def check(sample):
    errs = []
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    words = " ".join([sample.get("problem", ""), sample.get("solution", ""), *sample.get("steps", [])])
    if "\u2014" in words or "piuttosto che" in words or "--" in words:
        errs.append("em dash or 'piuttosto che' in the text")
    kind = LEVELS[lvl](sample, errs)
    if kind is not None and sample.get("params", {}).get("case") not in (None, kind):
        errs.append(f"params.case {sample['params'].get('case')!r} but the problem is {kind!r}")
    return errs, kind
