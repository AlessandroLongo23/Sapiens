"""Checker for fis-grandezze-si (specs/exercises/fis-grandezze-si.md).

Written from the spec and the lesson (docs/lezioni/fisica/riscritte/02-fis-grandezze-si.md): the quantity, the prefix
or the measure is read back from the text, and the answer is recomputed with the lesson's tables in exact arithmetic
(SymPy rationals). Every number must be written in the canonical way.
"""
import re

from sympy import Rational

from checkers._fis_grandezze import canonical_dec, check_choice, common, fmt_dec, fmt_sci, option_text, parse_dec, parse_sci, pow10_tex, prose_and_extra, split_unit

CASE_RANGES = {
    1: {k: (0.25, 0.42) for k in ["unita", "scrittura", "prefisso"]},
    2: {"verso-unita": (0.40, 0.60), "da-unita": (0.40, 0.60)},
    3: {"scrivi": (0.50, 0.70), "riconosci": (0.30, 0.50)},
    5: {k: (0.25, 0.42) for k in ["ore-minuti-secondi", "ore-decimali", "velocita"]},
    6: {"sotto": (0.3, 0.7), "sopra": (0.3, 0.7)},
}

SI = {
    "la lunghezza": "m",
    "la massa": "kg",
    "l'intervallo di tempo": "s",
    "la temperatura": "K",
    "l'intensità di corrente elettrica": "A",
    "la quantità di sostanza": "mol",
    "l'intensità luminosa": "cd",
}
UNIT_NAMES = {
    "metro": "m", "chilogrammo": "kg", "secondo": "s", "kelvin": "K", "ampere": "A", "mole": "mol", "candela": "cd",
    "centimetro": "cm", "chilometro": "km", "litro": "L", "grammo": "g", "newton": "N", "tonnellata": "t", "minuto": "min",
    "ora": "h", "grado Celsius": "°C",
}
VALID_SYMBOLS = {"kg", "m", "s", "g", "km", "cm"}
PREFIX = {"giga": ("G", 9), "mega": ("M", 6), "kilo": ("k", 3), "etto": ("h", 2), "deci": ("d", -1), "centi": ("c", -2), "milli": ("m", -3), "micro": ("μ", -6), "nano": ("n", -9)}
EXP = {"G": 9, "M": 6, "k": 3, "h": 2, "": 0, "d": -1, "c": -2, "m": -3, "μ": -6, "n": -9}
# the units of levels 2 and 4, as (base, exponent)
UNITS = {}
for base, prefixes in [("m", ["k", "", "d", "c", "m", "μ", "n"]), ("g", ["k", "h", "", "m", "μ"]), ("s", ["", "m", "μ", "n"]), ("L", ["h", "d", "c", "", "m", "μ"])]:
    for p in prefixes:
        UNITS[p + base] = (base, EXP[p])


def unit_of(tex):
    """'\\text{km}' or '\\mu\\text{m}' (inside $...$) -> 'km', 'μm'."""
    m = re.fullmatch(r"(\\mu)?\\text\{([^}]*)\}", tex.strip())
    if not m:
        raise ValueError(f"unit {tex!r}")
    return ("μ" if m.group(1) else "") + m.group(2)


def measure(tex):
    """'3{,}5\\,\\text{km}' -> (value as written, unit)."""
    num, u = split_unit(tex)
    return num, u


def sci_option(latex, unit, errs, normalised=True):
    num, u = split_unit(latex)
    if u != unit:
        errs.append(f"option {latex!r} not in {unit}")
    v, a, n = parse_sci(num)
    if normalised and not (1 <= a < 10):
        errs.append(f"option {latex!r} not in scientific notation")
    return v, a, n, num


def level1(sample, prose, errs):
    ch = sample["answer"]
    m = re.fullmatch(r"Qual è l'unità di misura del Sistema Internazionale per (.+)\?", prose)
    if m:
        sym = SI.get(m.group(1))
        if sym is None:
            errs.append(f"unknown quantity {m.group(1)!r}")
            return None

        def unit(o):
            mm = re.fullmatch(r"(.+) \((.+)\)", option_text(o["latex"]))
            if UNIT_NAMES.get(mm.group(1)) != mm.group(2) or o["values"] != [mm.group(2)]:
                raise ValueError(f"{o['latex']} is not a unit with its symbol")
            return mm.group(2)

        check_choice(ch, lambda o: unit(o) == sym, errs)
        return "unita"
    if prose == "Quale di queste misure è scritta correttamente?":
        numbers = set()

        def right(o):
            mm = re.fullmatch(r"(\d+|\d,\d) (\S+)", option_text(o["latex"]))
            numbers.add(mm.group(1))
            return mm.group(2) in VALID_SYMBOLS

        check_choice(ch, right, errs)
        if len(numbers) != 1:
            errs.append(f"options with different numbers {numbers}")
        return "scrittura"
    m = re.fullmatch(r"Quanto vale il prefisso (\w+), di simbolo \$(.+)\$\?", prose)
    if m:
        sym, e = PREFIX[m.group(1)]
        shown = "μ" if m.group(2) == "\\mu" else re.fullmatch(r"\\text\{(\w+)\}", m.group(2)).group(1)
        if shown != sym:
            errs.append(f"prefix {m.group(1)} shown as {shown}")

        def power(o):
            mm = re.fullmatch(r"10(?:\^(-?\d)|\^\{(-?\d+)\})?", o["latex"])
            n = int(mm.group(1) or mm.group(2) or 1)
            if pow10_tex(n) != o["latex"] or o["values"] != [str(n)]:
                raise ValueError(f"power {o['latex']} not canonical")
            return n

        check_choice(ch, lambda o: power(o) == e, errs)
        return "prefisso"
    errs.append(f"level 1 text not recognised: {prose!r}")
    return None


def level2(sample, prose, errs):
    m = re.fullmatch(r"Esprimi \$(.+?)\$ in \$(.+?)\$\.", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    num, u1 = measure(m.group(1))
    u2 = unit_of(m.group(2))
    x = canonical_dec(num)
    (b1, e1), (b2, e2) = UNITS[u1], UNITS[u2]
    if b1 != b2 or (e1 != 0 and e2 != 0) or e1 == e2:
        errs.append(f"not one prefix to or from the unit: {u1} -> {u2}")
    truth = x * Rational(10) ** (e1 - e2)
    if len(str(truth.q)) > 5 or truth > 10**6:
        errs.append(f"answer {truth} out of range")

    def val(o):
        n, u = split_unit(o["latex"])
        if u != u2:
            raise ValueError(f"option in {u}")
        v = canonical_dec(n)
        if Rational(o["values"][0]) != v:
            raise ValueError("option value differs from its text")
        return v

    check_choice(sample["answer"], lambda o: val(o) == truth, errs)
    return "verso-unita" if e2 == 0 else "da-unita"


def level3(sample, prose, errs):
    m = re.fullmatch(r"Scrivi in notazione scientifica la misura \$(.+?)\$\.", prose)
    if m:
        num, u = measure(m.group(1))
        x = canonical_dec(num)
        _, a, n = parse_sci(fmt_sci(x))
        if not (2 <= abs(n) <= 9) or n == 2:
            errs.append(f"exponent {n} out of range")

        def val(o):
            v, a2, n2, s = sci_option(o["latex"], u, errs, normalised=False)
            if Rational(o["values"][0]) != v:
                raise ValueError("option value differs from its text")
            return v, s

        check_choice(sample["answer"], lambda o: val(o) == (x, fmt_sci(x)), errs)
        return "scrivi"
    m = re.fullmatch(r"Quale di queste scritture è la notazione scientifica della misura \$(.+?)\$\?", prose)
    if m:
        num, u = measure(m.group(1))
        x = canonical_dec(num)
        for o in sample["answer"]["options"]:
            v, a, n, s = sci_option(o["latex"], u, errs, normalised=False)
            if v != x:
                errs.append(f"option {o['latex']} is not the same number")
        check_choice(sample["answer"], lambda o: 1 <= parse_sci(split_unit(o["latex"])[0])[1] < 10, errs)
        return "riconosci"
    errs.append(f"level 3 text not recognised: {prose!r}")
    return None


def level4(sample, prose, errs):
    m = re.fullmatch(r"Esprimi \$(.+?)\$ in \$(.+?)\$, in notazione scientifica\.", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    num, u1 = measure(m.group(1))
    u2 = unit_of(m.group(2))
    x = canonical_dec(num)
    (b1, e1), (b2, e2) = UNITS[u1], UNITS[u2]
    if b1 != b2 or not 3 <= abs(e1 - e2) <= 9:
        errs.append(f"prefixes {u1} {u2} not 10^3 to 10^9 apart")
    truth = x * Rational(10) ** (e1 - e2)
    _, _, n = parse_sci(fmt_sci(truth))
    if not 2 <= abs(n) <= 12:
        errs.append(f"answer exponent {n}")

    def val(o):
        v, a, nn, s = sci_option(o["latex"], u2, errs)
        if s != fmt_sci(v):
            raise ValueError(f"option {s} not canonical")
        if Rational(o["values"][0]) != v:
            raise ValueError("option value differs from its text")
        return v

    check_choice(sample["answer"], lambda o: val(o) == truth, errs)
    return b1


def level5(sample, prose, errs):
    ch = sample["answer"]
    m = re.fullmatch(r"Esprimi in secondi il tempo \$(\d+)\\,\\text\{h\}\\ (\d+)\\,\\text\{min\}\$\.", prose)
    if m:
        h, mi = int(m.group(1)), int(m.group(2))
        if not (1 <= h <= 5 and 5 <= mi <= 55 and mi % 5 == 0):
            errs.append("hours or minutes out of range")

        def val(o):
            n, u = split_unit(o["latex"])
            if u != "s":
                raise ValueError("not in seconds")
            return canonical_dec(n)

        check_choice(ch, lambda o: val(o) == 3600 * h + 60 * mi, errs)
        return "ore-minuti-secondi"
    m = re.fullmatch(r"Esprimi in ore e minuti il tempo \$(.+?)\$\.", prose)
    if m:
        num, u = measure(m.group(1))
        hours = canonical_dec(num)
        if u != "h":
            errs.append("not in hours")
        total = hours * 60
        if total.q != 1 or hours == int(hours):
            errs.append(f"{hours} h is not a whole number of minutes with a fraction of an hour")

        def val(o):
            mm = re.fullmatch(r"(\d+)\\,\\text\{h\}\\ (\d+)\\,\\text\{min\}", o["latex"])
            hh, mn = int(mm.group(1)), int(mm.group(2))
            if not 0 < mn < 60 or o["values"] != [str(60 * hh + mn)]:
                raise ValueError(f"option {o['latex']} malformed")
            return 60 * hh + mn

        check_choice(ch, lambda o: val(o) == total, errs)
        return "ore-decimali"
    m = re.fullmatch(r"Esprimi in \$\\text\{(km/h|m/s)\}\$ la velocità \$(.+?)\$\.", prose)
    if m:
        num, u = measure(m.group(2))
        v = canonical_dec(num)
        target = m.group(1)
        if {u, target} != {"km/h", "m/s"}:
            errs.append("not between km/h and m/s")
        # 1 km/h = 1000 m / 3600 s
        truth = v * Rational(1000, 3600) if u == "km/h" else v * Rational(3600, 1000)

        def val(o):
            n, uu = split_unit(o["latex"])
            if uu != target:
                raise ValueError("wrong unit")
            return canonical_dec(n)

        check_choice(ch, lambda o: val(o) == truth, errs)
        return "velocita"
    errs.append(f"level 5 text not recognised: {prose!r}")
    return None


def level6(sample, prose, errs):
    m = re.fullmatch(r"Qual è l'ordine di grandezza della misura \$(.+?)\$\?", prose)
    if not m:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    num, u = split_unit(m.group(1))
    x, a, n = parse_sci(num)
    if " \\cdot " in num:
        if not 1 <= a < 10 or num != fmt_sci(x):
            errs.append(f"{num} not in scientific notation")
    else:
        canonical_dec(num)
    _, a, n = parse_sci(fmt_sci(x))
    if 3 <= a < 6:
        errs.append(f"first factor {a} between 3 and 6")
    order = n + 1 if a >= 5 else n
    if order == 0:
        errs.append("order 10^0")

    def val(o):
        p, uu = split_unit(o["latex"])
        if uu != u:
            raise ValueError("wrong unit")
        mm = re.fullmatch(r"10(?:\^(-?\d)|\^\{(-?\d+)\})?", p)
        k = int(mm.group(1) or mm.group(2) or 1)
        if pow10_tex(k) != p:
            raise ValueError("power not canonical")
        return k

    check_choice(sample["answer"], lambda o: val(o) == order, errs)
    return "sopra" if a >= 5 else "sotto"


def check(sample):
    errs = []
    common(sample, errs)
    if errs:
        return errs, None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append("unexpected non-prose lines")
    fn = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}.get(sample["level"])
    if not fn:
        return [f"unknown level {sample['level']}"], None
    kind = fn(sample, prose, errs)
    return errs, kind
