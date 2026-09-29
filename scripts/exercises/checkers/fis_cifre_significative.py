"""Checker for fis-cifre-significative (specs/exercises/fis-cifre-significative.md).

Written from the spec and the lesson, not from the generator. Every number is read back from the text of the problem
as a string, so the zeros that count are seen: a significant figure is a digit of the written number without the
leading zeros; a whole number with trailing zeros is ambiguous and never allowed in the data. The results are
recomputed exactly (Decimal for sums and products, Fraction for quotients and means), rounded with the rule of the 5
on the first figure dropped, and written again with the rule of the spec: scientific notation when the last
significant figure is left of the units or is a zero in the units, otherwise decimal form; thin spaces from five
figures; the unit after \\, (after \\  when it has an exponent).
- Level 1: the count by the rules of the lesson, and the type of the number (no zeros, leading zeros, zeros in the
  middle, trailing zeros after the comma, scientific notation).
- Level 2: the number rounded to n figures; the first figure dropped is never a 5 followed only by zeros; the case
  (the rounding in steps is the one with dropped figures 4 then 5 or more); truncation and rounding in steps among
  the options when they differ.
- Level 3: the sum or difference rounded to the decimals of the least precise datum.
- Level 4: the product or quotient rounded to the significant figures of the datum with fewest.
- Level 5: the exact number does not limit; the mean is the sum (with the decimals of the data) divided by the
  exact count; in two steps the sum is not rounded before the product or quotient, and rounding it too early must
  change the last figure (that wrong result is an option).
Then: four options with different writings, no option the right value with the same figures written another way,
each written by the rule, the right one where it should be, and the share of each case.
"""
import re
from decimal import Decimal
from fractions import Fraction

CASE_RANGES = {
    1: {k: (0.12, 0.28) for k in ["nessuno", "iniziali", "mezzo", "finali", "scientifica"]},
    2: {"decimale": (0.40, 0.60), "zeri": (0.10, 0.24), "scientifica": (0.10, 0.24), "passi": (0.10, 0.24)},
    3: {"somma": (0.40, 0.60), "differenza": (0.17, 0.33), "vicina": (0.17, 0.33)},
    4: {"normale": (0.45, 0.70), "zeri": (0.17, 0.33), "scientifica": (0.10, 0.24)},
    5: {k: (0.17, 0.33) for k in ["oggetti", "perimetro", "media", "passaggi"]},
}

BANNED = re.compile(r"—|piuttosto che")

# unit: (LaTeX, plain, has an exponent)
UNITS = {
    "g": (r"\text{g}", "g", False),
    "kg": (r"\text{kg}", "kg", False),
    "m": (r"\text{m}", "m", False),
    "cm": (r"\text{cm}", "cm", False),
    "mm": (r"\text{mm}", "mm", False),
    "s": (r"\text{s}", "s", False),
    "L": (r"\text{L}", "L", False),
    "m/s": (r"\text{m/s}", "m/s", False),
    "cm/s": (r"\text{cm/s}", "cm/s", False),
    "cm^2": (r"\text{cm}^2", "cm^2", True),
    "m^2": (r"\text{m}^2", "m^2", True),
    "cm^3": (r"\text{cm}^3", "cm^3", True),
    "g/cm^3": (r"\text{g/cm}^3", "g/cm^3", True),
}

WORD_N = {"una": 1, "due": 2, "tre": 3, "quattro": 4}
COUNT_WORD = {"Due": 2, "Tre": 3, "Quattro": 4, "due": 2, "tre": 3}


# ---------------------------------------------------------------------------
# Numbers as written


class W:
    """A written number: its digits as written, the value, the significant figures, the decimals."""

    def __init__(self, tex):
        self.tex = tex
        m = re.fullmatch(r"(\d)(?:\{,\}(\d+))? \\cdot 10\^\{(-?\d+)\}", tex)
        if m:
            a, b, k = m.group(1), m.group(2) or "", int(m.group(3))
            if a == "0":
                raise ValueError(f"mantissa below 1: {tex}")
            self.sci = True
            self.int, self.frac = a, b
            self.value = Decimal(f"{a}.{b}" if b else a).scaleb(k)
            self.sf = len(a + b)
            self.last = k - len(b)
            self.plain = f"{a}{',' + b if b else ''}e{k}"
            return
        m = re.fullmatch(r"(\d{1,3}(?:\\,\d{3})+|\d+)(?:\{,\}(\d+))?", tex)
        if not m:
            raise ValueError(f"not a number: {tex!r}")
        grouped, frac = m.group(1), m.group(2) or ""
        int_ = grouped.replace("\\,", "")
        if (len(int_) >= 5) != ("\\," in grouped) or (len(int_) > 1 and int_[0] == "0"):
            raise ValueError(f"thousands not written as the lesson: {tex!r}")
        if "\\," in grouped and grouped != group(int_):
            raise ValueError(f"thousands grouped wrongly: {tex!r}")
        self.sci = False
        self.int, self.frac = int_, frac
        self.value = Decimal(f"{int_}.{frac}" if frac else int_)
        sig = (int_ + frac).lstrip("0")
        if not frac and sig.endswith("0"):
            self.ambiguous = True
        self.sf = len(sig)
        self.last = -len(frac)
        self.plain = f"{int_}{',' + frac if frac else ''}"

    ambiguous = False

    @property
    def dec(self):
        return max(0, -self.last)


def group(int_):
    out = []
    while int_:
        out.insert(0, int_[-3:])
        int_ = int_[:-3]
    return "\\,".join(out)


def canonical(value, sf):
    """The writing of a positive exact value with sf significant figures, by the rule of the spec."""
    value = Fraction(value)
    k = 0
    while Fraction(10) ** k > value:
        k -= 1
    while Fraction(10) ** (k + 1) <= value:
        k += 1
    e = k - sf + 1
    scaled = value / Fraction(10) ** e
    if scaled.denominator != 1:
        raise ValueError(f"{value} has more than {sf} figures")
    digits = str(scaled.numerator)
    assert len(digits) == sf
    if e > 0 or (e == 0 and sf > 1 and digits.endswith("0")):
        rest = digits[1:]
        return f"{digits[0]}{'{,}' + rest if rest else ''} \\cdot 10^{{{k}}}"
    d = -e
    s = digits.rjust(d + 1, "0")
    int_, frac = s[: len(s) - d], s[len(s) - d :]
    int_ = group(int_) if len(int_) >= 5 else int_
    return int_ + ("{,}" + frac if d else "")


def round_sig(value, n, trunc=False):
    """(rounded value, half) with n significant figures: the first figure dropped decides (5 or more: up)."""
    value = Fraction(value)
    k = 0
    while Fraction(10) ** k > value:
        k -= 1
    while Fraction(10) ** (k + 1) <= value:
        k += 1
    return round_at(value, k - n + 1, trunc), n


def round_at(value, e, trunc=False):
    unit = Fraction(10) ** e
    q = value / unit
    fl = q.numerator // q.denominator
    rest = q - fl
    up = (not trunc) and rest >= Fraction(1, 2)
    return (fl + (1 if up else 0)) * unit, rest == Fraction(1, 2)


def rounded_sig(value, n, trunc=False):
    """The rounded value and its writing with n figures (a carry keeps n figures: 9,97 -> 10 with two)."""
    (v, half), _ = round_sig(value, n, trunc)
    return v, canonical(v, n), half


def sf_of_value(value, e):
    """Significant figures of a value written down to the place 10^e."""
    scaled = Fraction(value) / Fraction(10) ** e
    assert scaled.denominator == 1
    return len(str(scaled.numerator))


# ---------------------------------------------------------------------------
# Reading the problem and the options


def prose_of(tex):
    tex = tex.strip()
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", tex, re.S)
    lines = m.group(1).split(" \\\\ ") if m else [tex]
    out = []
    for line in lines:
        t = re.fullmatch(r"\\text\{(.*)\}", line.strip())
        if not t:
            raise ValueError(f"not a line of prose: {line!r}")
        out.append(t.group(1))
    return " ".join(out)


MEAS = r"\$[^$]+\$(?: [a-zA-Z/]+)?"


def measure(s):
    """'$12{,}3$ cm' or '$12{,}5\\ \\text{cm}^3$' -> (W, unit key)."""
    m = re.fullmatch(r"\$([^$]+)\$(?: ([a-zA-Z/]+))?", s)
    if not m:
        raise ValueError(f"not a measure: {s!r}")
    inner, word = m.group(1), m.group(2)
    if word:
        if word not in UNITS or UNITS[word][2]:
            raise ValueError(f"unknown unit {word!r}")
        return W(inner), word
    for key, (tex, _, exp) in UNITS.items():
        if exp and inner.endswith("\\ " + tex):
            return W(inner[: -len(tex) - 2]), key
    raise ValueError(f"measure without unit: {s!r}")


def measures(s):
    return [measure(x) for x in re.findall(MEAS, s)]


def read_option(latex):
    """(W, unit key) of an option written 'number\\,unit' or 'number\\ unit^k'."""
    for key, (tex, _, exp) in sorted(UNITS.items(), key=lambda kv: -len(kv[1][0])):
        sep = "\\ " if exp else "\\,"
        if latex.endswith(sep + tex):
            return W(latex[: -len(sep + tex)]), key
    raise ValueError(f"option without a known unit: {latex!r}")


def check_options(errs, sample, truth_value, truth_sf, unit):
    """Four options with different writings, each written by the rule; the right one once, at `correct`."""
    a = sample["answer"]
    opts = a.get("options", [])
    if a.get("kind") != "choice" or len(opts) != 4:
        errs.append("the answer must be a choice with four options")
        return None
    want = canonical(truth_value, truth_sf)
    parsed = []
    for o in opts:
        w, u = read_option(o["latex"])
        if u != unit:
            errs.append(f"option in {u}, expected {unit}")
        if w.value <= 0:
            errs.append(f"option not positive: {o['latex']}")
        if w.ambiguous or canonical(w.value, w.sf) != w.tex:
            errs.append(f"option not written by the rule: {o['latex']}")
        if o.get("values") != [f"{w.plain} {UNITS[u][1]}"]:
            errs.append(f"values {o.get('values')} do not match {o['latex']}")
        parsed.append(w)
    keys = [(w.value, w.sf) for w in parsed]
    if len(set(keys)) != 4 or len({o["latex"] for o in opts}) != 4:
        errs.append("two options are the same writing, or the same value with the same figures")
    hits = [i for i, w in enumerate(parsed) if w.tex == want]
    if len(hits) != 1 or a.get("correct") != hits[0]:
        errs.append(f"right option should be {want!r}; options {[o['latex'] for o in opts]}, correct {a.get('correct')}")
    return {w.tex for w in parsed}


# ---------------------------------------------------------------------------
# Levels


def level1(prose, sample, errs):
    m = re.fullmatch(r"Quante cifre significative ha la misura (" + MEAS + r")\?", prose)
    if not m:
        raise ValueError(f"level 1 text not recognised: {prose!r}")
    w, _ = measure(m.group(1))
    if w.ambiguous:
        errs.append("a whole number with trailing zeros is ambiguous")
    digits = w.int + w.frac
    sig = digits.lstrip("0")
    count = len(sig)
    if w.sci:
        kind = "scientifica"
    elif w.frac and w.frac.endswith("0"):
        kind = "finali"
    elif "0" in sig.rstrip("0")[1:]:
        kind = "mezzo"
    elif w.int == "0":
        kind = "iniziali"
    else:
        kind = "nessuno"
    if not 1 <= count <= 5:
        errs.append(f"count {count} outside 1-5")
    a = sample["answer"]
    opts = a.get("options", [])
    nums = []
    for o in opts:
        t = re.fullmatch(r"\\text\{(\d)\}", o["latex"])
        if not t or o.get("values") != [t.group(1)]:
            errs.append(f"option {o} is not a count")
            return kind
        nums.append(int(t.group(1)))
    if len(opts) != 4 or len(set(nums)) != 4 or min(nums) < 1:
        errs.append(f"options {nums}: four different counts from 1")
    if count not in nums or a.get("correct") != nums.index(count):
        errs.append(f"right count {count}, options {nums}, correct {a.get('correct')}")
    # the count with the leading zeros is the first mistake of the spec
    written = len(sig) + 2 if w.sci else len(digits)
    if written != count and written not in nums:
        errs.append(f"the count of all written digits ({written}) is missing")
    return kind


def level2(prose, sample, errs):
    m = re.fullmatch(r"Arrotonda (" + MEAS + r") a (una|due|tre|quattro) cifr[ae] significativ[ae]\.", prose)
    if not m:
        raise ValueError(f"level 2 text not recognised: {prose!r}")
    x, unit = measure(m.group(1))
    n = WORD_N[m.group(2)]
    if (n == 1) != ("una cifra significativa" in prose):
        errs.append("singular and plural")
    if x.sci or x.ambiguous:
        errs.append("the number is written in full, never ambiguous")
    if not 4 <= x.sf <= 7 or not n < x.sf:
        errs.append(f"{x.sf} figures rounded to {n}")
    sig = (x.int + x.frac).lstrip("0")
    dropped = sig[n:]
    if re.fullmatch(r"50*", dropped):
        errs.append("halfway case")
    v, text, _ = rounded_sig(x.value, n)
    kind_last = W(text)
    if len(dropped) >= 2 and dropped[0] == "4" and dropped[1] >= "5":
        kind = "passi"
    elif kind_last.sci and kind_last.last > 0:
        kind = "scientifica"
    elif text.replace("{,}", "").split(" ")[0].endswith("0") or (kind_last.sci and kind_last.last == 0):
        kind = "zeri"
    else:
        kind = "decimale"
    shown = check_options(errs, sample, v, n, unit)
    if shown is None:
        return kind
    tv, ttext, _ = rounded_sig(x.value, n, trunc=True)
    if ttext != text and ttext not in shown:
        errs.append(f"the truncation {ttext} is missing")
    if kind == "passi":
        cur, cs = Fraction(x.value), x.sf
        while cs > n:
            (cur, _), cs = round_sig(cur, cs - 1)
        step = canonical(cur, n)
        if step == text or step not in shown:
            errs.append(f"the rounding in steps {step} is missing or equals the answer")
    return kind


SUMS = {
    r"(Due|Tre) asticelle, lunghe (.+), sono messe in fila una dopo l'altra\. Quanto vale la lunghezza della fila\?": "cm",
    r"Sul piatto di una bilancia ci sono (due|tre) oggetti, con le masse di (.+)\. Quanto vale la massa totale\?": "g",
    r"Un ciclista percorre (due|tre) tratti di una pista in (.+)\. Quanto vale il tempo totale\?": "s",
}
# pattern -> (unit, the first datum is the larger)
DIFFS = {
    r"Un sacchetto pieno ha la massa di (" + MEAS + r")\. Si toglie un oggetto e la massa diventa (" + MEAS + r")\. Quanto vale la massa dell'oggetto tolto\?": ("g", True),
    r"Una molla a riposo è lunga (" + MEAS + r"); con un peso appeso è lunga (" + MEAS + r")\. Quanto vale l'allungamento della molla\?": ("cm", False),
    r"Un becher vuoto ha la massa di (" + MEAS + r"); con dentro un po' d'acqua ha la massa di (" + MEAS + r")\. Quanto vale la massa dell'acqua\?": ("g", False),
}


def level3(prose, sample, errs):
    data, unit, op = None, None, None
    for pat, u in SUMS.items():
        m = re.fullmatch(pat, prose)
        if m:
            data, unit, op = measures(m.group(2)), u, "somma"
            if len(data) != COUNT_WORD[m.group(1)] or not re.fullmatch(r"(?:" + MEAS + r", )*" + MEAS + r" e " + MEAS, m.group(2)):
                errs.append("the list of data does not match its count")
    for pat, (u, big_first) in DIFFS.items():
        m = re.fullmatch(pat, prose)
        if m:
            data, unit, op = [measure(m.group(1)), measure(m.group(2))], u, "differenza"
            if not big_first:
                data = data[::-1]
    if data is None:
        raise ValueError(f"level 3 text not recognised: {prose!r}")
    ws = [w for w, _ in data]
    if any(u != unit for _, u in data) or any(w.sci or w.ambiguous for w in ws):
        errs.append("data in another unit or not written in full")
    decs = [w.dec for w in ws]
    if len(set(decs)) == 1:
        errs.append("all data have the same decimals")
    dm = min(decs)
    exact = sum((w.value for w in ws), Decimal(0)) if op == "somma" else ws[0].value - ws[1].value
    if exact <= 0:
        errs.append("the difference is not positive (the order of the data)")
        return None
    v, half = round_at(Fraction(exact), -dm)
    if half:
        errs.append("halfway case")
    if v <= 0:
        errs.append("the result rounds to zero")
        return None
    sf = sf_of_value(v, -dm)
    min_sf = min(w.sf for w in ws)
    kind = op if op == "somma" else ("vicina" if sf <= 2 and min_sf >= 3 else "differenza")
    shown = check_options(errs, sample, v, sf, unit)
    calc = Fraction(exact.normalize())
    if shown is not None and calc != v:
        # the calculator's result: all its figures, when it can be written without ambiguity
        e = exact.normalize().as_tuple().exponent
        if e <= 0:
            c = canonical(calc, sf_of_value(calc, e))
            if c not in shown:
                errs.append(f"the calculator's result {c} is missing")
    return kind


PRODS = {
    r"Un rettangolo ha i lati di (" + MEAS + r") e di (" + MEAS + r")\. Quanto vale l'area\?": ("*", "cm", "cm", "cm^2"),
    r"Un terreno rettangolare ha i lati di (" + MEAS + r") e di (" + MEAS + r")\. Quanto vale l'area\?": ("*", "m", "m", "m^2"),
    r"Un corridore percorre (" + MEAS + r") in (" + MEAS + r")\. Quanto vale la velocità\?": ("/", "m", "s", "m/s"),
    r"Un carrello percorre (" + MEAS + r") in (" + MEAS + r")\. Quanto vale la velocità\?": ("/", "cm", "s", "cm/s"),
    r"Un oggetto ha la massa di (" + MEAS + r") e il volume di (" + MEAS + r")\. Quanto vale la densità\?": ("/", "g", "cm^3", "g/cm^3"),
}


def calc_writing(value):
    """The calculator's display: up to six figures, no trailing zeros; None if a whole number ending in 0."""
    (v, _), _ = round_sig(value, 6)
    d = Decimal(v.numerator) / Decimal(v.denominator)
    d = d.normalize()
    e = d.as_tuple().exponent
    if e > 0 or (e == 0 and str(d).endswith("0")):
        return None
    return canonical(Fraction(d), len(str(d).replace(".", "").lstrip("0")))


def level4(prose, sample, errs):
    for pat, (op, ua, ub, ur) in PRODS.items():
        m = re.fullmatch(pat, prose)
        if m:
            break
    else:
        raise ValueError(f"level 4 text not recognised: {prose!r}")
    (a, ua_), (b, ub_) = measure(m.group(1)), measure(m.group(2))
    if (ua_, ub_) != (ua, ub):
        errs.append(f"units {ua_}, {ub_}, expected {ua}, {ub}")
    if any(w.sci or w.ambiguous for w in (a, b)):
        errs.append("data not written in full")
    exact = Fraction(a.value) * Fraction(b.value) if op == "*" else Fraction(a.value) / Fraction(b.value)
    n = min(a.sf, b.sf)
    v, text, half = rounded_sig(exact, n)
    if half:
        errs.append("halfway case")
    w = W(text)
    kind = "scientifica" if w.sci else ("zeri" if text.endswith("0") else "normale")
    shown = check_options(errs, sample, v, n, ur)
    c = calc_writing(exact)
    if shown is not None and c is not None and c != text and c not in shown:
        errs.append(f"the calculator's result {c} is missing")
    return kind


OBJECTS = {
    r"Un sacchetto contiene \$(\d+)\$ biglie uguali, ognuna con la massa di (" + MEAS + r")\. Quanto vale la massa delle biglie\?": "g",
    r"Una pila è fatta di \$(\d+)\$ monete uguali, ognuna con la massa di (" + MEAS + r")\. Quanto vale la massa della pila\?": "g",
    r"In una fila ci sono \$(\d+)\$ piastrelle uguali, ognuna lunga (" + MEAS + r")\. Quanto vale la lunghezza della fila\?": "cm",
}
POLYGONS = {"un triangolo equilatero": 3, "un quadrato": 4, "un pentagono regolare": 5, "un esagono regolare": 6, "un ottagono regolare": 8}
MEANS = {"del periodo di un pendolo": "s", "del tempo di caduta di una pallina": "s", "della lunghezza di una matita": "cm", "della massa di un sasso": "g"}
TWO = {
    r"Una lastra rettangolare è formata da due pezzi accostati, lunghi (" + MEAS + r") e (" + MEAS + r"), larghi entrambi (" + MEAS + r")\. Quanto vale l'area della lastra\?": ("*", "m", "m^2"),
    r"Un carrello percorre due tratti, lunghi (" + MEAS + r") e (" + MEAS + r"), in (" + MEAS + r") in tutto\. Quanto vale la velocità media\?": ("/", "s", "m/s"),
}


def exact_as_measure(errs, shown, exact, count, n, text):
    """The mistake of the spec: the exact number counted as a measure (its figures, without trailing zeros)."""
    k = min(n, len(str(count).rstrip("0")))
    _, t, _ = rounded_sig(exact, k)
    if t != text and t not in shown:
        errs.append(f"the exact number treated as a measure ({t}) is missing")


def level5(prose, sample, errs):
    for pat, unit in OBJECTS.items():
        m = re.fullmatch(pat, prose)
        if m:
            k = int(m.group(1))
            x, u = measure(m.group(2))
            if u != unit or not 6 <= k <= 40 or x.sci or x.ambiguous:
                errs.append("objects: unit, count or writing")
            exact = k * Fraction(x.value)
            v, text, half = rounded_sig(exact, x.sf)
            if half:
                errs.append("halfway case")
            shown = check_options(errs, sample, v, x.sf, unit)
            if shown is not None:
                exact_as_measure(errs, shown, exact, k, x.sf, text)
            return "oggetti"
    m = re.fullmatch(r"Quanto vale il perimetro di (.+) con il lato di (" + MEAS + r")\?", prose)
    if m:
        k = POLYGONS[m.group(1)]
        x, u = measure(m.group(2))
        if x.sci or x.ambiguous:
            errs.append("the side is not written in full")
        exact = k * Fraction(x.value)
        v, text, half = rounded_sig(exact, x.sf)
        if half:
            errs.append("halfway case")
        shown = check_options(errs, sample, v, x.sf, u)
        if shown is not None:
            exact_as_measure(errs, shown, exact, k, x.sf, text)
        return "perimetro"
    m = re.fullmatch(r"(Tre|Quattro) misure (.+?) danno (.+)\. Quanto vale il valore medio\?", prose)
    if m:
        N = COUNT_WORD[m.group(1)]
        unit = MEANS[m.group(2)]
        data = measures(m.group(3))
        ws = [w for w, _ in data]
        if len(ws) != N or any(u != unit for _, u in data) or any(w.sci or w.ambiguous for w in ws):
            errs.append("mean: count, unit or writing of the data")
        d = ws[0].dec
        if any(w.dec != d for w in ws) or d == 0:
            errs.append("the data of a mean have the same decimals")
        S = sum((w.value for w in ws), Decimal(0))
        n = sf_of_value(Fraction(S), -d)
        exact = Fraction(S) / N
        v, text, half = rounded_sig(exact, n)
        if half:
            errs.append("halfway case")
        if W(text).dec != d or W(text).sci:
            errs.append(f"the mean {text} does not have the decimals of the data")
        shown = check_options(errs, sample, v, n, unit)
        if shown is not None:
            exact_as_measure(errs, shown, exact, N, n, text)
        return "media"
    for pat, (op, uw, ur) in TWO.items():
        m = re.fullmatch(pat, prose)
        if m:
            (a, ua), (b, ub), (w, uw_) = (measure(m.group(i)) for i in (1, 2, 3))
            if (ua, ub, uw_) != ("m", "m", uw) or any(z.sci or z.ambiguous for z in (a, b, w)):
                errs.append("two steps: units or writing")
            if a.dec == b.dec:
                errs.append("the two lengths have the same decimals")
            L = Fraction(a.value + b.value)
            dm = min(a.dec, b.dec)
            Lr, half_l = round_at(L, -dm)
            n = min(sf_of_value(Lr, -dm), w.sf)
            f = (lambda p, q: p * q) if op == "*" else (lambda p, q: p / q)
            v, text, half = rounded_sig(f(L, Fraction(w.value)), n)
            _, early, half_e = rounded_sig(f(Lr, Fraction(w.value)), n)
            if half or half_l or half_e:
                errs.append("halfway case")
            if early == text:
                errs.append("rounding too early does not change the result")
            shown = check_options(errs, sample, v, n, ur)
            if shown is not None and early not in shown:
                errs.append(f"the early rounding {early} is missing")
            return "passaggi"
    raise ValueError(f"level 5 text not recognised: {prose!r}")


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    for field in [sample.get("problem", ""), sample.get("solution", ""), *sample.get("steps", [])]:
        if BANNED.search(field):
            errs.append("banned words")
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("no steps or no solution")
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        prose = prose_of(sample["problem"])
        if re.search(r"[%&#_]", re.sub(r"\$[^$]*\$", "", prose)):
            errs.append("special character in the prose")
        kind = LEVELS[lvl](prose, sample, errs)
    except (ValueError, KeyError, AssertionError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
