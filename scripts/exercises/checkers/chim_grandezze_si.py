"""Checker for chim-grandezze-si (specs/exercises/chim-grandezze-si.md).

Written from the spec and the lesson (docs/lezioni/chimica/riscritte/10-chim-grandezze-si.md): the quantity, the
prefix or the measure is read back from the text, and the answer is recomputed with the lesson's tables in exact
arithmetic (SymPy rationals): prefixes as powers of ten, volumes as powers of ten of the millilitre (1 L = 1 dm³ =
1000 mL, 1 mL = 1 cm³, 1 m³ = 1000 L), densities and concentrations by converting the mass and the volume separately.
Every number must be written in the canonical way.
"""
import re

from sympy import Rational

from checkers._chim_misure import common, parse_num, split_q, text
from checkers._fis_grandezze import canonical_dec, check_choice, fmt_dec, fmt_sci, option_text, parse_sci, pow10_tex

CASE_RANGES = {
    1: {k: (0.25, 0.42) for k in ["unita", "scrittura", "prefisso"]},
    2: {"verso-unita": (0.40, 0.60), "da-unita": (0.40, 0.60)},
    3: {"scrivi": (0.50, 0.70), "riconosci": (0.30, 0.50)},
}

SI = {
    "la lunghezza": "m",
    "la massa": "kg",
    "l'intervallo di tempo": "s",
    "la temperatura": "K",
    "la quantità di sostanza": "mol",
    "l'intensità di corrente elettrica": "A",
    "l'intensità luminosa": "cd",
}
UNIT_NAMES = {
    "metro": "m", "chilogrammo": "kg", "secondo": "s", "kelvin": "K", "mole": "mol", "ampere": "A", "candela": "cd",
    "centimetro": "cm", "chilometro": "km", "litro": "L", "grammo": "g", "newton": "N", "minuto": "min", "ora": "h",
    "grado Celsius": "°C", "joule": "J", "caloria": "cal",
}
VALID_SYMBOLS = {"g", "kg", "mol", "mL", "K", "s"}
PREFIX = {"mega": ("M", 6), "kilo": ("k", 3), "deci": ("d", -1), "centi": ("c", -2), "milli": ("m", -3), "micro": ("μ", -6), "nano": ("n", -9), "pico": ("p", -12)}
EXP = {"M": 6, "k": 3, "": 0, "d": -1, "c": -2, "m": -3, "μ": -6, "n": -9, "p": -12}
BASES = ["mol", "g", "L", "J", "m"]


def prefixed(u):
    """'mmol' -> ('mol', -3); 'μg' -> ('g', -6); 'kJ' -> ('J', 3)."""
    for b in BASES:
        if u.endswith(b) and u[: -len(b)] in EXP:
            return b, EXP[u[: -len(b)]]
    raise ValueError(f"unit {u!r}")


VOL = {"m^3": 6, "dm^3": 3, "L": 3, "cm^3": 0, "mL": 0}
# density and concentration units: (mass exponent in g, volume exponent in mL)
COMP = {"g/mL": (0, 0), "g/cm^3": (0, 0), "kg/m^3": (3, 6), "g/L": (0, 3), "mg/mL": (-3, 0), "mg/L": (-3, 3)}


def unit_in_dollars(tex):
    m = re.fullmatch(r"(\\mu)?\\text\{([^}]*)\}(\^\d)?", tex.strip())
    if not m:
        raise ValueError(f"unit {tex!r}")
    return ("μ" if m.group(1) else "") + m.group(2) + (m.group(3) or "")


def num_option(o, unit, form):
    """The value of an option in `unit`, checking its writing: 'dec' canonical decimal, 'sci' scientific, 'val' either
    (decimal when it has at most 4 decimals and is below a million)."""
    num, u = split_q(o["latex"])
    if u != unit:
        raise ValueError(f"option in {u}, not {unit}")
    v = parse_num(num)
    if Rational(o["values"][0]) != v:
        raise ValueError("option value differs from its text")
    short = (v * 10**4).q == 1 and v < 10**6
    want = fmt_dec(v) if form == "dec" or (form == "val" and short) else fmt_sci(v)
    if num != want:
        raise ValueError(f"option {num!r} not written as {want!r}")
    return v


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
            if UNIT_NAMES.get(mm.group(1)) != mm.group(2):
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
            if pow10_tex(n) != o["latex"]:
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
    num, u1 = split_q(m.group(1))
    u2 = unit_in_dollars(m.group(2))
    x = canonical_dec(num)
    (b1, e1), (b2, e2) = prefixed(u1), prefixed(u2)
    if b1 != b2 or (e1 != 0 and e2 != 0) or e1 == e2 or b1 not in ("g", "L", "mol", "J"):
        errs.append(f"not one prefix to or from the unit: {u1} -> {u2}")
    truth = x * Rational(10) ** (e1 - e2)
    if (truth * 10**4).q != 1 or truth > 10**6:
        errs.append(f"answer {truth} out of range")
    check_choice(sample["answer"], lambda o: num_option(o, u2, "dec") == truth, errs)
    return "verso-unita" if e2 == 0 else "da-unita"


def level3(sample, prose, errs):
    m = re.fullmatch(r"Scrivi in notazione scientifica la misura \$(.+?)\$\.", prose)
    if m:
        num, u = split_q(m.group(1))
        x = canonical_dec(num)
        _, a, n = parse_sci(fmt_sci(x))
        if not 3 <= abs(n) <= 9:
            errs.append(f"exponent {n} out of range")

        def val(o):
            nn, uu = split_q(o["latex"])
            if uu != u:
                raise ValueError("wrong unit")
            v = parse_num(nn)
            if Rational(o["values"][0]) != v:
                raise ValueError("option value differs from its text")
            return v, nn

        check_choice(sample["answer"], lambda o: val(o) == (x, fmt_sci(x)), errs)
        return "scrivi"
    m = re.fullmatch(r"Quale di queste scritture è la notazione scientifica della misura \$(.+?)\$\?", prose)
    if m:
        num, u = split_q(m.group(1))
        x = canonical_dec(num)
        for o in sample["answer"]["options"]:
            if parse_num(split_q(o["latex"])[0]) != x:
                errs.append(f"option {o['latex']} is not the same number")
        check_choice(sample["answer"], lambda o: 1 <= parse_sci(split_q(o["latex"])[0])[1] < 10, errs)
        return "riconosci"
    errs.append(f"level 3 text not recognised: {prose!r}")
    return None


def level4(sample, prose, errs):
    m = re.fullmatch(r"Esprimi \$(.+?)\$ in \$(.+?)\$, in notazione scientifica\.", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    num, u1 = split_q(m.group(1))
    u2 = unit_in_dollars(m.group(2))
    x = canonical_dec(num)
    (b1, e1), (b2, e2) = prefixed(u1), prefixed(u2)
    if b1 != b2 or not 3 <= abs(e1 - e2) <= 9:
        errs.append(f"prefixes {u1} {u2} not 10^3 to 10^9 apart")
    truth = x * Rational(10) ** (e1 - e2)
    _, _, n = parse_sci(fmt_sci(truth))
    if not 2 <= abs(n) <= 12:
        errs.append(f"answer exponent {n}")
    check_choice(sample["answer"], lambda o: num_option(o, u2, "sci") == truth, errs)
    return b1


def level5(sample, prose, errs):
    m = re.fullmatch(r"Esprimi il volume \$(.+?)\$ in \$(.+?)\$\.", prose)
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    num, u1 = split_q(m.group(1))
    u2 = unit_in_dollars(m.group(2))
    x = canonical_dec(num)
    if VOL[u1] == VOL[u2]:
        errs.append("same volume unit")
    truth = x * Rational(10) ** (VOL[u1] - VOL[u2])
    check_choice(sample["answer"], lambda o: num_option(o, u2, "val") == truth, errs)
    return f"{u1}>{u2}"


def level6(sample, prose, errs):
    m = re.fullmatch(r"Esprimi \$(.+?)\$ in \$(.+?)\$\.", prose)
    if not m:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    num, u1 = split_q(m.group(1))
    u2 = unit_in_dollars(m.group(2))
    x = canonical_dec(num)
    (m1, v1), (m2, v2) = COMP[u1], COMP[u2]
    # x g·10^m1 / (mL·10^v1) in g·10^m2 / (mL·10^v2)
    truth = x * Rational(10) ** (m1 - m2) / Rational(10) ** (v1 - v2)
    check_choice(sample["answer"], lambda o: num_option(o, u2, "val") == truth, errs)
    return "uguali" if truth == x else "fattore"


def check(sample):
    errs = []
    common(sample, errs)
    if errs:
        return errs, None
    prose = text(sample)
    fn = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}.get(sample["level"])
    if not fn:
        return [f"unknown level {sample['level']}"], None
    try:
        kind = fn(sample, prose, errs)
    except (ValueError, KeyError, AttributeError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
