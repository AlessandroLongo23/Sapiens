"""Checker for fis-incertezza-relativa (specs/exercises/fis-incertezza-relativa.md).

Written from the spec and the lesson (docs/lezioni/fisica/riscritte/07-fis-incertezza-relativa.md), not from the
generator. Every exercise is read back from the text of the problem, never from params: the context (which sentence),
the measures (x ± Δx) with their units, the percentage, the number of oscillations or of laps, the sides of the
polygon. Then, with exact Fractions:

- each datum is written as the lesson writes a result: Δx with one significant figure, x to the same decimal place,
  relative uncertainty at most 20% (0,1% to 10% where the spec says so);
- the answer is recomputed with the rules of the lesson: ε = Δx/x (level 1), Δx = ε·x (level 2), Δ(a ± b) = Δa + Δb
  and Δ(k·a) = k·Δa (levels 3 and 5), ε(a·b) = ε(a/b) = εa + εb and ε(aⁿ) = n·εa (levels 4, 5, 6);
- the result is rounded as the lesson says: Δ to one significant figure, the value to its position, half up on the
  first digit removed; the rounding must not be ambiguous: the removed part is at least a tenth of a unit away from
  one half, for Δ and for the value, and Δ does not change if the relative uncertainties are rounded to two
  significant figures (each, their sum, or both) or if the value is taken with one digit more or with three
  significant figures;
- the options: four, all different as writings and as (value, uncertainty) pairs, the LaTeX saying the same as
  `values`, the unit of the result, one significant figure in every uncertainty, value and uncertainty at the same
  decimal place, no uncertainty as large as the value; exactly one option equal to the result, the one marked right.
"""
import re
from fractions import Fraction as F

CASE_RANGES = {
    1: {k: (0.14, 0.26) for k in ["lunghezza", "distanza", "massa", "tempo", "volume"]},
    2: {k: (0.14, 0.26) for k in ["lunghezza", "distanza", "massa", "tempo", "volume"]},
    3: {k: (0.14, 0.26) for k in ["perimetro", "tratti", "liquido", "sasso", "temperatura"]},
    4: {k: (0.26, 0.41) for k in ["area", "velocita", "densita"]},
    5: {k: (0.19, 0.31) for k in ["quadrato", "cubo", "pendolo", "poligono"]},
    6: {k: (0.26, 0.41) for k in ["cubetto", "parallelepipedo", "pista"]},
}

BANNED = re.compile(r"—|piuttosto che")

PERCENTS = {F(s) for s in ["1/10", "1/5", "1/4", "2/5", "1/2", "4/5", "1", "6/5", "3/2", "2", "5/2", "4", "5", "8", "10"]}

# Units as the lesson writes them after a number: \, before a plain unit, "\ " before one with an exponent.
UNIT_TEX = {
    "cm": r"\,\text{cm}",
    "m": r"\,\text{m}",
    "g": r"\,\text{g}",
    "s": r"\,\text{s}",
    "mL": r"\,\text{mL}",
    "°C": r"\,^\circ\text{C}",
    "cm^2": r"\ \text{cm}^2",
    "cm^3": r"\ \text{cm}^3",
    "m/s": r"\,\text{m/s}",
    "g/cm^3": r"\ \text{g/cm}^3",
}

# ---------------------------------------------------------------------------
# Numbers

NUM = r"(?:\d{1,3}(?:\\,\d{3})+|\d+)(?:\{,\}\d+)?"


def parse(s):
    """A LaTeX number: (value, decimals)."""
    if not re.fullmatch(NUM, s):
        raise ValueError(f"not a number: {s!r}")
    whole, _, frac = s.replace("\\,", "").partition("{,}")
    return F(int(whole + frac), 10 ** len(frac)), len(frac)


def write(v, d, latex=True):
    """The canonical writing of v with d decimals."""
    sc = v * 10**d
    if sc.denominator != 1 or sc < 0:
        raise ValueError(f"{v} with {d} decimals")
    s = str(sc.numerator).rjust(d + 1, "0")
    whole, frac = s[: len(s) - d], s[len(s) - d :]
    if latex and len(whole) >= 5:
        whole = f"{int(whole):,}".replace(",", "\\,")
    return whole + (("{,}" if latex else ",") + frac if d else "")


def canon(s):
    v, d = parse(s)
    if write(v, d) != s:
        raise ValueError(f"number {s!r} not written as {write(v, d)!r}")
    return v, d


def floor(x):
    return x.numerator // x.denominator


def pow10(k):
    return F(10) ** k


def exp10(x):
    """Exponent of the first significant digit of x > 0."""
    e = 0
    while x >= pow10(e + 1):
        e += 1
    while x < pow10(e):
        e -= 1
    return e


def round_at(x, p):
    return floor(x / pow10(p) + F(1, 2)) * pow10(p)


def round_sf(x, n):
    return round_at(x, exp10(x) - n + 1)


def one_sf(x):
    """(Δ rounded to one significant figure, its position)."""
    u = round_sf(x, 1)
    return u, exp10(u)


def far_from_half(x, p):
    s = x / pow10(p)
    return abs(s - floor(s) - F(1, 2)) >= F(1, 10)


def terminating_decimals(x):
    for k in range(20):
        if (x * 10**k).denominator == 1:
            return k
    return None


# ---------------------------------------------------------------------------
# Reading the problem


def prose(tex):
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", tex.strip(), re.S)
    lines = m.group(1).split(r" \\ ") if m else [tex.strip()]
    out = []
    for line in lines:
        t = re.fullmatch(r"\\text\{(.*)\}", line.strip())
        if not t:
            raise ValueError(f"expected prose lines only: {line!r}")
        out.append(t.group(1))
    return " ".join(out)


UNIT_ALT = "|".join(re.escape(u) for u in UNIT_TEX.values())
MEAS = r"\$\((" + NUM + r") \\pm (" + NUM + r")\)(" + UNIT_ALT + r")\$"
UNIT_OF_TEX = {v: k for k, v in UNIT_TEX.items()}


class Measure:
    def __init__(self, vs, us, utex, errs):
        self.v, dv = canon(vs)
        self.u, du = canon(us)
        self.unit = UNIT_OF_TEX[utex]
        self.d = du
        if dv != du:
            errs.append(f"datum ({vs} ± {us}): value and uncertainty at different places")
        if self.u <= 0 or self.v <= 0:
            errs.append(f"datum ({vs} ± {us}) not positive")
            return
        digit = self.u / pow10(exp10(self.u))
        if digit.denominator != 1 or du != max(0, -exp10(self.u)):
            errs.append(f"datum ({vs} ± {us}): uncertainty without exactly one significant figure")
        if self.u / self.v > F(1, 5):
            errs.append(f"datum ({vs} ± {us}): relative uncertainty over 20%")

    @property
    def eps(self):
        return self.u / self.v

    @property
    def sig(self):
        return len(str(int(self.v * 10**self.d)))


def template(t):
    """{M} a measure, {N} a number between dollars; the rest literal."""
    rx = re.escape(t).replace(re.escape("{M}"), MEAS).replace(re.escape("{N}"), r"\$(" + NUM + r")\$")
    return re.compile(rx)


def read(templates, text, errs):
    """The first template that matches: (name, groups)."""
    for name, t in templates:
        m = template(t).fullmatch(text)
        if m:
            return name, m.groups()
    raise ValueError(f"problem not recognised: {text!r}")


def measures(groups, errs, units):
    out = []
    for i, unit in enumerate(units):
        m = Measure(groups[3 * i], groups[3 * i + 1], groups[3 * i + 2], errs)
        if unit is not None and m.unit not in (unit if isinstance(unit, tuple) else (unit,)):
            errs.append(f"datum in {m.unit}, expected {unit}")
        out.append(m)
    return out


# ---------------------------------------------------------------------------
# Rounding of a result


def rounded(X, D):
    u, p = one_sf(D)
    return round_at(X, p), u, p


def clear_rounding(X, D, errs):
    u, p = one_sf(D)
    if not far_from_half(D, exp10(D)):
        errs.append(f"uncertainty {D} too close to one half when rounded")
    if not far_from_half(X, p):
        errs.append(f"value {X} too close to one half when rounded at 10^{p}")


def relative_result(X, parts, errs):
    """parts: [(Measure, multiplier)]. The result by the relative uncertainties, and the robustness of its rounding."""
    e = sum(k * m.eps for m, k in parts)
    D = e * X
    v, u, p = rounded(X, D)
    clear_rounding(X, D, errs)
    each2 = sum(k * round_sf(m.eps, 2) for m, k in parts)
    for ee in (e, each2, round_sf(e, 2), round_sf(each2, 2)):
        for xx in (X, round_at(X, p - 1), round_sf(X, 3)):
            if one_sf(ee * xx)[0] != u:
                errs.append(f"the uncertainty changes with eps {ee} and value {xx}")
                return v, u, p
    if round_at(round_at(X, p - 1), p) != v:
        errs.append("the value changes if kept with one more digit")
    return v, u, p


# ---------------------------------------------------------------------------
# Options


def read_option(o, level, errs):
    """(value, uncertainty, unit) from the LaTeX, checked against `values`."""
    latex, values = o.get("latex", ""), o.get("values", [])
    if len(values) != 1:
        errs.append(f"option with values {values}")
        return None
    plain = values[0]
    if level == 1:
        m = re.fullmatch(r"(" + NUM + r")\\%", latex)
        if not m:
            errs.append(f"percentage option not readable: {latex!r}")
            return None
        v, d = canon(m.group(1))
        if d != terminating_decimals(v):
            errs.append(f"percentage {latex!r} with trailing zeros")
        if plain != f"{write(v, d, False)} %":
            errs.append(f"option {latex!r} but values {plain!r}")
        return (v, None, "%")
    m = re.fullmatch(r"\((" + NUM + r") \\pm (" + NUM + r")\)(" + UNIT_ALT + r")", latex)
    if not m:
        errs.append(f"option not readable: {latex!r}")
        return None
    v, dv = canon(m.group(1))
    u, du = canon(m.group(2))
    unit = UNIT_OF_TEX[m.group(3)]
    if plain != f"{write(v, dv, False)} ± {write(u, du, False)} {unit}":
        errs.append(f"option {latex!r} but values {plain!r}")
    if u == 0:
        if level != 3 or m.group(2) != "0":
            errs.append(f"option with zero uncertainty: {latex!r}")
        return (v, u, unit, dv)
    if dv != du:
        errs.append(f"option {latex!r}: value and uncertainty at different places")
    if (u / pow10(exp10(u))).denominator != 1 or du != max(0, -exp10(u)):
        errs.append(f"option {latex!r}: uncertainty without one significant figure")
    if u >= v:
        errs.append(f"option {latex!r}: uncertainty not smaller than the value")
    return (v, u, unit, dv)


def check_options(sample, truth, unit, errs, data_decimals=None):
    ch = sample.get("answer", {})
    if ch.get("kind") != "choice":
        errs.append("the answer must be a choice")
        return
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    read_opts = [read_option(o, sample["level"], errs) for o in opts]
    if any(r is None for r in read_opts):
        return
    plains = [o["values"][0] for o in opts]
    if len(set(plains)) != len(plains):
        errs.append(f"two options written the same: {plains}")
    pairs = [(r[0], r[1]) for r in read_opts]
    if len(set(pairs)) != len(pairs):
        errs.append(f"two options with the same value and uncertainty: {plains}")
    for r in read_opts:
        if r[2] != unit:
            errs.append(f"option in {r[2]}, expected {unit}")
        if len(r) > 3 and r[1] == 0 and data_decimals is not None and r[3] != data_decimals:
            errs.append("option with zero uncertainty not at the place of the data")
    right = [i for i, pr in enumerate(pairs) if pr == truth]
    if len(right) != 1:
        errs.append(f"{len(right)} options equal the result {truth}: {plains}")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(opts) or pairs[idx] != truth:
        errs.append(f"the option marked right is not the result {truth}")


# ---------------------------------------------------------------------------
# Levels

SUBJECTS = {
    "lunghezza": ("Una lunghezza", "cm", True),
    "distanza": ("Una distanza", "m", True),
    "massa": ("Una massa", "g", True),
    "tempo": ("Un intervallo di tempo", "s", False),
    "volume": ("Un volume", "mL", False),
}


def level1(text, errs):
    for name, (subj, unit, _) in SUBJECTS.items():
        verb = "dura" if name == "tempo" else "misura"
        m = template(f"{subj} {verb} {{M}}. Quanto vale l'incertezza percentuale della misura?").fullmatch(text)
        if m:
            (x,) = measures(m.groups(), errs, [unit])
            P = x.u / x.v * 100
            if P not in PERCENTS:
                errs.append(f"percentage {P} not in the list of the spec")
            if not 1 <= x.v <= 5000:
                errs.append(f"value {x.v} out of 1 - 5000")
            return name, (P, None), "%"
    raise ValueError(f"problem not recognised: {text!r}")


def article(P):
    s = write(P, terminating_decimals(P), False)
    if s.startswith("0"):
        return "dello "
    if s.split(",")[0] in ("1", "8", "11") or s.split(",")[0].startswith("8"):
        return "dell'"
    return "del "


def level2(text, errs):
    for name, (subj, unit, fem) in SUBJECTS.items():
        rx = (
            re.escape(f"{subj} di ")
            + r"\$(" + NUM + r")\$ "
            + re.escape(f"{unit} è {'misurata' if fem else 'misurato'} con un'incertezza ")
            + r"(del |dello |dell')\$(" + NUM + r")\\%\$"
            + re.escape(". Come si scrive il risultato della misura?")
        )
        m = re.fullmatch(rx, text)
        if not m:
            continue
        x, d = canon(m.group(1))
        P, _ = canon(m.group(3))
        if P not in PERCENTS:
            errs.append(f"percentage {P} not in the list of the spec")
        if m.group(2) != article(P):
            errs.append(f"'{m.group(2)}' before {P}%")
        D = x * P / 100
        # Δx must come out with one significant figure, at the place of the last digit of x
        if D != (D / pow10(-d)).numerator * pow10(-d) or not 1 <= D / pow10(-d) <= 9:
            errs.append(f"Δx = {D} is not one digit at the last place of {m.group(1)}")
        if not 1 <= x <= 5000:
            errs.append(f"value {x} out of 1 - 5000")
        return name, (x, D), unit
    raise ValueError(f"problem not recognised: {text!r}")


LEVEL3 = [
    ("perimetro", "I lati di un rettangolo misurano {M} e {M}. Quanto vale il perimetro?"),
    ("tratti", "Un percorso è fatto di due tratti in fila, lunghi {M} e {M}. Quanto è lungo il percorso?"),
    ("liquido", "Un bicchiere vuoto ha la massa di {M}; pieno d'acqua ha la massa di {M}. Quanto vale la massa dell'acqua?"),
    ("liquido", "Un bicchiere vuoto ha la massa di {M}; pieno d'olio ha la massa di {M}. Quanto vale la massa dell'olio?"),
    ("liquido", "Un bicchiere vuoto ha la massa di {M}; pieno di latte ha la massa di {M}. Quanto vale la massa del latte?"),
    ("sasso", "Si immerge un sasso in un cilindro graduato e l'acqua sale da {M} a {M}. Quanto vale il volume del sasso?"),
    ("temperatura", "La temperatura dell'acqua in una pentola sul fuoco sale da {M} a {M}. Quanto vale l'aumento di temperatura?"),
]
UNIT3 = {"perimetro": "cm", "tratti": "m", "liquido": "g", "sasso": "mL", "temperatura": "°C"}


def level3(text, errs):
    name, groups = read(LEVEL3, text, errs)
    a, b = measures(groups, errs, [UNIT3[name]] * 2)
    if a.d != b.d:
        errs.append("the two uncertainties are not at the same place")
    if name == "perimetro":
        X, D = 2 * a.v + 2 * b.v, 2 * a.u + 2 * b.u
    elif name == "tratti":
        X, D = a.v + b.v, a.u + b.u
    else:
        if b.v <= a.v:
            errs.append("the second reading is not larger than the first")
        X, D = b.v - a.v, a.u + b.u
    clear_rounding(X, D, errs)
    if X <= 2 * D:
        errs.append(f"result {X} not more than twice its uncertainty {D}")
    v, u, _ = rounded(X, D)
    return name, (v, u), UNIT3[name], a.d


LEVEL4 = [("area", "Un rettangolo ha i lati {M} e {M}. Quanto vale l'area?")]
LEVEL4 += [("velocita", f"{s} percorre {{M}} in {{M}}. Quanto vale la velocità media?") for s in ["Un carrello", "Un corridore", "Un ciclista", "Un'automobile"]]
LEVEL4 += [("densita", f"{s} ha la massa di {{M}} e il volume di {{M}}. Quanto vale la densità?") for s in ["Un oggetto", "Un sasso", "Un blocchetto"]]


def eps_range(ms, errs):
    for m in ms:
        if not F(1, 1000) <= m.eps <= F(1, 10):
            errs.append(f"relative uncertainty {m.eps} of a datum out of 0,1% - 10%")


def level4(text, errs):
    name, groups = read(LEVEL4, text, errs)
    if name == "area":
        a, b = measures(groups, errs, ["cm", "cm"])
        X, parts, unit = a.v * b.v, [(a, 1), (b, 1)], "cm^2"
        sig = [(a, 3), (b, 3)]
    elif name == "velocita":
        s, t = measures(groups, errs, ["m", "s"])
        X, parts, unit = s.v / t.v, [(s, 1), (t, 1)], "m/s"
        sig = [(s, 4), (t, 3)]  # the distance of the lesson's example, 100,0 m, has four figures
    else:
        m, V = measures(groups, errs, ["g", ("cm^3", "mL")])
        X, parts, unit = m.v / V.v, [(m, 1), (V, 1)], "g/cm^3"
        sig = [(m, 3), (V, 3)]
    for d, most in sig:
        if not 2 <= d.sig <= most:
            errs.append(f"datum with {d.sig} significant figures")
    eps_range([m for m, _ in parts], errs)
    v, u, _ = relative_result(X, parts, errs)
    return name, (v, u), unit


POLYGONS = {"un triangolo equilatero": 3, "un quadrato": 4, "un pentagono regolare": 5, "un esagono regolare": 6}
LEVEL5 = [
    ("quadrato", "Il lato di un quadrato misura {M}. Quanto vale l'area?"),
    ("cubo", "Lo spigolo di un cubo misura {M}. Quanto vale il volume?"),
    ("pendolo", "Il tempo di {N} oscillazioni di un pendolo è {M}. Quanto vale il periodo?"),
] + [(f"poligono:{k}", f"Il lato di {p} misura {{M}}. Quanto vale il perimetro?") for p, k in POLYGONS.items()]


def level5(text, errs):
    name, groups = read(LEVEL5, text, errs)
    if name in ("quadrato", "cubo"):
        (l,) = measures(groups, errs, ["cm"])
        n = 2 if name == "quadrato" else 3
        eps_range([l], errs)
        v, u, _ = relative_result(l.v**n, [(l, n)], errs)
        return name, (v, u), "cm^2" if n == 2 else "cm^3"
    if name == "pendolo":
        n, _ = canon(groups[0])
        if n not in (10, 20):
            errs.append(f"{n} oscillations, expected 10 or 20")
        (t,) = measures(groups[1:], errs, ["s"])
        X, D = t.v / n, t.u / n
        unit = "s"
    else:
        k = int(name.split(":")[1])
        name = "poligono"
        (l,) = measures(groups, errs, ["cm"])
        X, D = k * l.v, k * l.u
        unit = "cm"
    clear_rounding(X, D, errs)
    v, u, _ = rounded(X, D)
    return name, (v, u), unit


MATERIALS = ["di legno", "di plastica", "di metallo"]
LEVEL6 = [("cubetto", f"Un cubetto {mat} ha lo spigolo {{M}} e la massa {{M}}. Quanto vale la densità?") for mat in MATERIALS]
LEVEL6 += [("parallelepipedo", f"Un blocchetto {mat} a forma di parallelepipedo ha gli spigoli {{M}}, {{M}} e {{M}} e la massa {{M}}. Quanto vale la densità?") for mat in MATERIALS]
LEVEL6 += [("pista", f"{s} fa {{N}} giri di una pista lunga {{M}} in {{M}}. Quanto vale la velocità media?") for s in ["Un corridore", "Un ciclista"]]


def material_ok(text, rho):
    want = "di legno" if rho < 1 else "di plastica" if rho < 2 else "di metallo"
    return want in text


def level6(text, errs):
    name, groups = read(LEVEL6, text, errs)
    if name == "cubetto":
        l, m = measures(groups, errs, ["cm", "g"])
        X = m.v / l.v**3
        parts = [(m, 1), (l, 3)]
    elif name == "parallelepipedo":
        a, b, c, m = measures(groups, errs, ["cm", "cm", "cm", "g"])
        X = m.v / (a.v * b.v * c.v)
        parts = [(m, 1), (a, 1), (b, 1), (c, 1)]
    else:
        n, _ = canon(groups[0])
        L, t = measures(groups[1:], errs, ["m", "s"])
        if not (n.denominator == 1 and 2 <= n <= 10):
            errs.append(f"{n} laps")
        X = n * L.v / t.v
        parts = [(L, 1), (t, 1)]  # n is exact
    if name != "pista" and not material_ok(text, X):
        errs.append(f"the material does not fit the density {float(X):.2f}")
    eps_range([m for m, _ in parts], errs)
    v, u, _ = relative_result(X, parts, errs)
    return name, (v, u), "m/s" if name == "pista" else "g/cm^3"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    level = sample.get("level")
    if level not in LEVELS:
        return [f"unknown level {level}"], None
    alltext = " ".join([sample.get("prompt", ""), sample.get("problem", ""), sample.get("solution", "")] + sample.get("steps", []))
    if BANNED.search(alltext):
        errs.append("forbidden words")
    if not sample.get("steps"):
        errs.append("no steps")
    try:
        text = prose(sample["problem"])
        if re.search(r"[%&#_]", re.sub(r"\$[^$]*\$", "", text)):
            errs.append("special character outside the formulas")
        out = LEVELS[level](text, errs)
    except ValueError as e:
        return errs + [str(e)], None
    name, truth, unit = out[0], out[1], out[2]
    data_decimals = out[3] if len(out) > 3 else None
    if level >= 3:
        v, u = truth
        if not F(1, 10) <= v <= 10000:
            errs.append(f"result {v} out of 0,1 - 10000")
        if u >= v:
            errs.append("result with the uncertainty not smaller than the value")
    check_options(sample, truth, unit, errs, data_decimals)
    return errs, name
