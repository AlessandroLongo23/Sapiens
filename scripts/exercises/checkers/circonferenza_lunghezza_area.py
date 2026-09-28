"""circonferenza-lunghezza-area (Lunghezza della circonferenza e area del cerchio), from
specs/exercises/circonferenza-lunghezza-area.md.

Written from the spec, not from the generator. Every datum is read back from the text the student
sees (the prose of the problem), never from params, and the answer is found again with SymPy:

- circles are SymPy `Circle`s (circumference and area from the library);
- arcs and sectors are measured in radians: the arc as the integral of r dθ, the sector as the double
  integral of ρ dρ dθ, so the degree proportions of the lesson are not reused;
- the triangle of the circular segment is a SymPy `Polygon` with exact vertices (r cos θ, r sin θ);
- composite figures are squares and rectangles as `Polygon`s, with the circles placed on them and
  their fit checked (the inscribed circle touches the sides, the quarters do not overlap, the
  semicircle fits inside the rectangle);
- inverse questions are solved with `solve` on a positive unknown.

Measures are written as the lesson writes them: 12\\pi, \\frac{9}{2}\\pi, 9\\pi - 18,
6\\pi - 9\\sqrt{3}, 64 - 16\\pi, with the unit (\\text{ cm}, \\ \\text{cm}^2, ^\\circ, \\text{ giri}).
The parser of these values also checks the form: reduced fractions, no coefficient 1, no trailing
zero, each kind of term once, a positive first term.
"""
import re

from sympy import Circle, Integer, Point, Polygon, Rational, Segment, Symbol, cos, integrate, pi, rad, simplify, sin, solve, sqrt, sympify

CASE_RANGES = {
    1: {k: (0.18, 0.32) for k in ["C-r", "C-d", "A-r", "A-d"]},
    2: {k: (0.18, 0.32) for k in ["r-C", "r-A", "A-C", "C-A"]},
    3: {"r-C": (0.27, 0.43), "r-A": (0.27, 0.43), "ruota": (0.22, 0.38)},
    4: {"arco": (0.52, 0.68), "angolo dall'arco": (0.32, 0.48)},
    5: {"settore": (0.37, 0.53), "angolo dal settore": (0.22, 0.38), "settore dall'arco": (0.17, 0.33)},
    6: {"raggi": (0.37, 0.53), "diametri": (0.17, 0.33), "raggio mancante": (0.22, 0.38)},
    7: {"90": (0.42, 0.58), "60": (0.42, 0.58)},
    8: {k: (0.14, 0.26) for k in ["cerchio inscritto", "quattro quarti", "quarto di cerchio", "finestra", "semicerchio tolto"]},
}

ANGLES = {30, 36, 40, 45, 60, 72, 90, 120, 135, 150, 180, 240, 270}
APPROX = r", con \$\\pi \\approx 3\{,\}14\$\?"
CM2 = r"\\ \\text\{cm\}\^2"
V = r"([^$]+)"  # a value inside $...$

O = Point(0, 0)
theta, rho = Symbol("theta"), Symbol("rho")
x = Symbol("x", positive=True)


# ---------------------------------------------------------------------------
# Text

def prose(tex):
    """The words of a LaTeX problem: environments, \\text{} and line breaks removed."""
    s = re.sub(r"\\(begin|end)\{array\}(\{l\})?", " ", tex)
    s = s.replace(" \\\\ ", " ")
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


NUM = r"\d+(?:\{,\}\d+)?|\\frac\{\d+\}\{\d+\}"
BASIS = {"": 1, "\\pi": pi, "\\pi^2": pi**2, "\\sqrt{3}": sqrt(3)}
TERM = re.compile(rf"({NUM})?(\\pi\^2|\\pi|\\sqrt\{{3\}})?")


def number(s):
    """12, 3{,}14, \\frac{9}{2} as a Rational, refusing unreduced or badly written numbers."""
    m = re.fullmatch(r"\\frac\{(\d+)\}\{(\d+)\}", s)
    if m:
        n, d = int(m.group(1)), int(m.group(2))
        r = Rational(n, d)
        if d < 2 or r.q != d:
            raise ValueError(f"fraction not reduced: {s}")
        return r
    m = re.fullmatch(r"(\d+)(?:\{,\}(\d+))?", s)
    if not m:
        raise ValueError(f"not a number: {s!r}")
    if (m.group(2) or "").endswith("0") or (len(m.group(1)) > 1 and m.group(1).startswith("0")):
        raise ValueError(f"badly written number: {s}")
    return Rational(s.replace("{,}", "."))


def value(tex):
    """An exact measure as written in the lesson, with its form checked."""
    s = tex.strip()
    parts = re.split(r" ([+-]) ", s)
    signs = ["+"] + parts[1::2]
    terms = parts[0::2]
    if terms[0].startswith("-"):
        raise ValueError(f"first term negative: {tex!r}")
    total, seen = Integer(0), set()
    for sg, term in zip(signs, terms):
        m = TERM.fullmatch(term)
        if not m or not (m.group(1) or m.group(2)):
            raise ValueError(f"unreadable term {term!r} in {tex!r}")
        coef = number(m.group(1)) if m.group(1) else Integer(1)
        basis = m.group(2) or ""
        if m.group(1) and basis and coef == 1:
            raise ValueError(f"coefficient 1 written: {tex!r}")
        if not basis and m.group(1).startswith("\\frac") and finite(coef):
            raise ValueError(f"finite decimal written as a fraction: {tex!r}")
        if basis and "{,}" in (m.group(1) or ""):
            raise ValueError(f"decimal coefficient of {basis}: {tex!r}")
        if basis in seen:
            raise ValueError(f"terms not collected: {tex!r}")
        seen.add(basis)
        total += (1 if sg == "+" else -1) * coef * BASIS[basis]
    return total


def finite(r):
    d = Rational(r).q
    for f in (2, 5):
        while d % f == 0:
            d //= f
    return d == 1


UNITS = {"cm": r"\\text\{ cm\}", "cm2": CM2, "deg": r"\^\\circ", "giri": r"\\text\{ giri\}"}


def measure(latex, unit):
    m = re.fullmatch(rf"(.+?){UNITS[unit]}", latex)
    if not m:
        raise ValueError(f"not in {unit}: {latex!r}")
    return value(m.group(1))


def eq(a, b):
    return simplify(sympify(a) - sympify(b)) == 0


# ---------------------------------------------------------------------------
# Answer and choice

def check_answer(sample, truth, unit, errs):
    ans = sample["answer"]
    truth = simplify(truth)
    if truth.is_rational:
        if ans.get("kind") != "number":
            errs.append(f"answer kind {ans.get('kind')}, expected number")
        elif Rational(ans["value"]) != truth:
            errs.append(f"answer {ans['value']} != {truth}")
        if not truth.is_integer or truth <= 0:
            errs.append(f"answer {truth} not a positive integer")
        if unit == "deg" and truth >= 360:
            errs.append(f"angle {truth} >= 360")
    else:
        if ans.get("kind") != "expression":
            errs.append(f"answer kind {ans.get('kind')}, expected expression")
            return
        if not eq(ans["value"], truth):
            errs.append(f"answer {ans['value']} != {truth}")
        try:
            if not eq(value(ans["latex"]), truth):
                errs.append(f"answer latex {ans['latex']} != {truth}")
        except ValueError as e:
            errs.append(str(e))
        if truth.has(pi**2):
            errs.append("pi squared in the answer")
    if not (truth > 0):
        errs.append(f"answer {truth} not positive")
    sol = sample.get("solution", "")
    try:
        shown = measure(re.split(r" = ", sol)[-1], unit) if unit != "giri" else measure(sol, unit)
        if not eq(shown, truth):
            errs.append(f"solution {sol} != {truth}")
    except (ValueError, IndexError) as e:
        errs.append(f"solution: {e}")

    ch = sample.get("choice")
    if not ch or ch.get("kind") != "choice":
        errs.append("no choice variant")
        return
    opts = ch["options"]
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    vals = []
    for o in opts:
        try:
            v = measure(o["latex"], unit)
        except ValueError as e:
            errs.append(f"option: {e}")
            return
        if not eq(sympify(o["values"][0]), v):
            errs.append(f"option latex {o['latex']} != values {o['values']}")
        if not (v > 0):
            errs.append(f"option {o['latex']} not positive")
        if unit in ("deg", "giri") and not v.is_integer:
            errs.append(f"option {o['latex']} not an integer")
        vals.append(v)
    for i in range(len(vals)):
        for j in range(i):
            if eq(vals[i], vals[j]):
                errs.append(f"options {opts[j]['latex']} and {opts[i]['latex']} are the same number")
    k = ch.get("correct")
    if not isinstance(k, int) or not 0 <= k < len(opts):
        errs.append("choice.correct out of range")
        return
    if not eq(vals[k], truth):
        errs.append(f"choice.correct is {opts[k]['latex']}, truth {truth}")
    if sum(1 for v in vals if eq(v, truth)) != 1:
        errs.append("not exactly one option equals the truth")


# ---------------------------------------------------------------------------
# Figures

def circle(r):
    return Circle(O, r)


def arc_length(r, deg):
    return integrate(r, (theta, 0, rad(deg)))


def sector_area(r, deg):
    return integrate(integrate(rho, (rho, 0, r)), (theta, 0, rad(deg)))


def whole(n, lo, hi, what, errs):
    if not (n.is_integer and lo <= n <= hi):
        errs.append(f"{what} {n} out of [{lo}, {hi}]")


# ---------------------------------------------------------------------------
# Levels

def check_l1(text, errs):
    m = re.fullmatch(r"Quanto è lunga una circonferenza di (raggio|diametro) \$(\d+)\$ cm\?", text)
    if m:
        n = Integer(m.group(2))
        r = n if m.group(1) == "raggio" else n / 2
        whole(n, 2 if m.group(1) == "raggio" else 3, 25 if m.group(1) == "raggio" else 40, m.group(1), errs)
        return circle(r).circumference, "cm", "C-r" if m.group(1) == "raggio" else "C-d"
    m = re.fullmatch(r"Qual è l'area di un cerchio di (raggio|diametro) \$(\d+)\$ cm\?", text)
    if m:
        n = Integer(m.group(2))
        r = n if m.group(1) == "raggio" else n / 2
        whole(r, 2, 20, "radius", errs)
        return circle(r).area, "cm2", "A-r" if m.group(1) == "raggio" else "A-d"
    return None


def check_l2(text, errs):
    m = re.fullmatch(rf"Una circonferenza è lunga \${V}\$ cm\. (Quanto misura il (raggio|diametro)\?|Qual è l'area del cerchio\?)", text)
    if m:
        (r,) = solve(circle(x).circumference - value(m.group(1)), x)
        whole(r, 2, 25, "radius", errs)
        if m.group(3):
            return (r if m.group(3) == "raggio" else 2 * r), "cm", "r-C"
        return circle(r).area, "cm2", "A-C"
    m = re.fullmatch(rf"Un cerchio ha l'area di \${V}{CM2}\$\. (Quanto misura il (raggio|diametro)\?|Quanto è lunga la circonferenza\?)", text)
    if m:
        (r,) = solve(circle(x).area - value(m.group(1)), x)
        whole(r, 2, 20, "radius", errs)
        if m.group(3):
            return (r if m.group(3) == "raggio" else 2 * r), "cm", "r-A"
        return circle(r).circumference, "cm", "C-A"
    return None


def check_l3(text, errs):
    p314 = Rational(314, 100)
    m = re.fullmatch(rf"Una circonferenza è lunga \$({NUM})\$ cm\. Quanto misura il raggio{APPROX}", text)
    if m:
        (r,) = solve(2 * p314 * x - number(m.group(1)), x)
        whole(r, 2, 30, "radius", errs)
        return r, "cm", "r-C"
    m = re.fullmatch(rf"Un cerchio ha l'area di \$({NUM}){CM2}\$\. Quanto misura il raggio{APPROX}", text)
    if m:
        (r,) = solve(p314 * x**2 - number(m.group(1)), x)
        whole(r, 2, 20, "radius", errs)
        return r, "cm", "r-A"
    m = re.fullmatch(rf"Una ruota ha il diametro di \$(\d+)\$ cm\. Quanti giri fa per percorrere \$({NUM})\$ m{APPROX}", text)
    if m:
        d = Integer(m.group(1))
        dist_cm = number(m.group(2)) * 100
        n = dist_cm / (p314 * d)
        whole(d, 40, 90, "diameter", errs)
        whole(n, 100, 1000, "turns", errs)
        return n, "giri", "ruota"
    return None


def check_l4(text, errs):
    m = re.fullmatch(r"In una circonferenza di raggio \$(\d+)\$ cm, quanto è lungo l'arco che corrisponde a un angolo al centro di \$(\d+)\^\\circ\$\?", text)
    if m:
        r, a = Integer(m.group(1)), int(m.group(2))
        if a not in ANGLES:
            errs.append(f"angle {a} not in the list")
        whole(r, 1, 30, "radius", errs)
        ell = arc_length(r, a)
        if not (ell / pi).is_integer:
            errs.append(f"arc {ell} not a whole multiple of pi")
        return ell, "cm", "arco"
    m = re.fullmatch(rf"In una circonferenza di raggio \$(\d+)\$ cm un arco è lungo \${V}\$ cm\. Quanto misura l'angolo al centro\?", text)
    if m:
        r, ell = Integer(m.group(1)), value(m.group(2))
        a = simplify(ell / r * 180 / pi)
        if a not in ANGLES:
            errs.append(f"angle {a} not in the list")
        return a, "deg", "angolo dall'arco"
    return None


def check_l5(text, errs):
    m = re.fullmatch(r"Qual è l'area di un settore circolare di raggio \$(\d+)\$ cm e angolo al centro di \$(\d+)\^\\circ\$\?", text)
    if m:
        r, a = Integer(m.group(1)), int(m.group(2))
        if a not in ANGLES:
            errs.append(f"angle {a} not in the list")
        whole(r, 2, 20, "radius", errs)
        A = sector_area(r, a)
        if not (A / pi).is_integer:
            errs.append(f"sector {A} not a whole multiple of pi")
        return A, "cm2", "settore"
    m = re.fullmatch(rf"Un settore circolare di raggio \$(\d+)\$ cm ha l'area di \${V}{CM2}\$\. Quanto misura l'angolo al centro\?", text)
    if m:
        r, A = Integer(m.group(1)), value(m.group(2))
        (t,) = solve(integrate(integrate(rho, (rho, 0, r)), (theta, 0, x)) - A, x)
        a = simplify(t * 180 / pi)
        if a not in ANGLES:
            errs.append(f"angle {a} not in the list")
        return a, "deg", "angolo dal settore"
    m = re.fullmatch(rf"In un settore circolare di raggio \$(\d+)\$ cm l'arco è lungo \${V}\$ cm\. Qual è l'area del settore\?", text)
    if m:
        r, ell = Integer(m.group(1)), value(m.group(2))
        t = ell / r
        if not (0 < t < 2 * pi):
            errs.append(f"arc {ell} longer than the circle")
        a = simplify(t * 180 / pi)
        if a not in ANGLES:
            errs.append(f"angle {a} not in the list")
        A = sector_area(r, a)
        if not (A / pi).is_integer:
            errs.append(f"sector {A} not a whole multiple of pi")
        return A, "cm2", "settore dall'arco"
    return None


def check_l6(text, errs):
    m = re.fullmatch(r"Due circonferenze concentriche hanno i (raggi|diametri) di \$(\d+)\$ cm e \$(\d+)\$ cm\. Qual è l'area della corona circolare\?", text)
    if m:
        k = 1 if m.group(1) == "raggi" else Rational(1, 2)
        R, r = Integer(m.group(2)) * k, Integer(m.group(3)) * k
        if not 0 < r < R <= 15 or not (R.is_integer and r.is_integer):
            errs.append(f"radii {R}, {r} out of range")
        return circle(R).area - circle(r).area, "cm2", m.group(1)
    m = re.fullmatch(
        rf"Una corona circolare ha l'area di \${V}{CM2}\$, e il raggio della circonferenza (minore|maggiore) misura \$(\d+)\$ cm\. "
        r"Quanto misura il raggio della circonferenza (maggiore|minore)\?",
        text,
    )
    if m:
        A, known = value(m.group(1)), Integer(m.group(3))
        if m.group(2) == m.group(4):
            errs.append("asks the radius it gives")
        if m.group(2) == "minore":
            (R,) = solve(circle(x).area - circle(known).area - A, x)
            r = known
            want = R
        else:
            sols = solve(circle(known).area - circle(x).area - A, x)
            if len(sols) != 1:
                errs.append(f"no positive smaller radius: {sols}")
                return None
            R, r = known, sols[0]
            want = r
        if not (0 < r < R <= 15):
            errs.append(f"radii {R}, {r} out of range")
        whole(want, 1, 15, "radius", errs)
        return want, "cm", "raggio mancante"
    return None


def check_l7(text, errs):
    m = re.fullmatch(
        rf"In un cerchio (di raggio \$\d+\$ cm|di diametro \$\d+\$ cm|con la circonferenza lunga \${V}\$ cm|di area \${V}{CM2}\$), "
        r"qual è l'area del segmento circolare che corrisponde a un angolo al centro di \$(90|60)\^\\circ\$\?",
        text,
    )
    if not m:
        return None
    data = m.group(1)
    n = re.search(r"\$([^$]+)\$", data).group(1)
    if data.startswith("di raggio"):
        r = Integer(n)
    elif data.startswith("di diametro"):
        r = Integer(n) / 2
    elif data.startswith("con la circonferenza"):
        (r,) = solve(circle(x).circumference - value(n), x)
    else:
        (r,) = solve(circle(x).area - value(n.replace("\\ \\text{cm}^2", "")), x)
    a = int(m.group(4))
    t = rad(a)
    A, B = Point(r, 0), Point(r * cos(t), r * sin(t))
    tri = Polygon(O, A, B)
    if a == 90 and not (r.is_integer and r % 2 == 0 and r <= 30):
        errs.append(f"radius {r} for 90 degrees: even, up to 30")
    if a == 60:
        if not (r.is_integer and r % 6 == 0 and r <= 30):
            errs.append(f"radius {r} for 60 degrees: multiple of 6, up to 30")
        if not (eq(A.distance(B), r)):
            errs.append("the 60 degree triangle is not equilateral")
    return sector_area(r, a) - abs(tri.area), "cm2", m.group(4)


def check_l8(text, errs):
    m = re.fullmatch(
        r"Un quadrato ha il lato di \$(\d+)\$ cm, e dentro c'è il cerchio inscritto\. Qual è l'area della parte del quadrato che resta fuori dal cerchio\?",
        text,
    )
    if m:
        s = Integer(m.group(1))
        sq = Polygon(Point(0, 0), Point(s, 0), Point(s, s), Point(0, s))
        centre = sq.centroid
        r = Segment(Point(0, 0), Point(s, 0)).distance(centre)
        if not all(eq(side.distance(centre), r) for side in sq.sides):
            errs.append("the circle does not touch the four sides")
        whole(s, 4, 20, "side", errs)
        if s % 2:
            errs.append("odd side")
        return sq.area - circle(r).area, "cm2", "cerchio inscritto"
    m = re.fullmatch(
        r"Un quadrato ha il lato di \$(\d+)\$ cm\. Con il centro in ognuno dei quattro vertici si disegna, dentro il quadrato, un quarto di cerchio "
        r"di raggio \$(\d+)\$ cm\. Qual è l'area della parte del quadrato che resta fuori dai quattro quarti di cerchio\?",
        text,
    )
    if m:
        s, r = Integer(m.group(1)), Integer(m.group(2))
        sq = Polygon(Point(0, 0), Point(s, 0), Point(s, s), Point(0, s))
        if 2 * r > s:
            errs.append("the quarters overlap")
        whole(s, 2, 20, "side", errs)
        return sq.area - 4 * circle(r).area / 4, "cm2", "quattro quarti"
    m = re.fullmatch(
        r"Il quadrato \$ABCD\$ ha il lato di \$(\d+)\$ cm\. Con il centro in \$A\$ si disegna, dentro il quadrato, il quarto di cerchio di raggio \$AB\$\. "
        r"Qual è l'area della parte del quadrato che resta fuori dal quarto di cerchio\?",
        text,
    )
    if m:
        s = Integer(m.group(1))
        A, B, C, D = Point(0, 0), Point(s, 0), Point(s, s), Point(0, s)
        sq = Polygon(A, B, C, D)
        whole(s, 2, 20, "side", errs)
        return sq.area - circle(A.distance(B)).area / 4, "cm2", "quarto di cerchio"
    m = re.fullmatch(
        r"Una finestra è fatta da un rettangolo di base \$(\d+)\$ cm e altezza \$(\d+)\$ cm, con sopra un semicerchio che ha per diametro la base\. "
        r"Qual è l'area della finestra\?",
        text,
    )
    if m:
        b, h = Integer(m.group(1)), Integer(m.group(2))
        rect = Polygon(Point(0, 0), Point(b, 0), Point(b, h), Point(0, h))
        return rect.area + circle(b / 2).area / 2, "cm2", "finestra"
    m = re.fullmatch(
        r"Da un rettangolo di base \$(\d+)\$ cm e altezza \$(\d+)\$ cm si toglie un semicerchio che ha per diametro la base\. Qual è l'area della parte che resta\?",
        text,
    )
    if m:
        b, h = Integer(m.group(1)), Integer(m.group(2))
        rect = Polygon(Point(0, 0), Point(b, 0), Point(b, h), Point(0, h))
        if b / 2 >= h:
            errs.append("the semicircle does not fit in the rectangle")
        return rect.area - circle(b / 2).area / 2, "cm2", "semicerchio tolto"
    return None


LEVELS = {1: check_l1, 2: check_l2, 3: check_l3, 4: check_l4, 5: check_l5, 6: check_l6, 7: check_l7, 8: check_l8}


def check(sample):
    errs = []
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    lvl = sample["level"]
    fn = LEVELS.get(lvl)
    if fn is None:
        return [f"unknown level {lvl}"], None
    everything = " ".join([sample["prompt"], sample["problem"], sample["solution"], *sample["steps"]])
    if "—" in everything or "piuttosto che" in everything:
        errs.append("em dash or 'piuttosto che'")
    text = prose(sample["problem"])
    try:
        got = fn(text, errs)
    except ValueError as e:
        return errs + [f"unreadable data: {e}"], None
    if got is None:
        return errs + [f"unreadable problem: {text}"], None
    truth, unit, kind = got
    check_answer(sample, truth, unit, errs)
    if sample.get("params", {}).get("case") != kind:
        errs.append(f"params.case {sample.get('params', {}).get('case')} != {kind}")
    return errs, kind
