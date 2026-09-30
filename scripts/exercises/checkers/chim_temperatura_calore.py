"""Checker for chim-temperatura-calore (specs/exercises/chim-temperatura-calore.md).

Written from the spec and the lesson (docs/lezioni/chimica/riscritte/12-chim-temperatura-calore.md): T = t + 273 and
t = T - 273; a difference of temperature has the same number in kelvin and in degrees Celsius; Q = c m Δt with c in
J/(g·°C) and m in grams, Δt final minus initial; the heat of a transformation in a calorimeter is the opposite of the
water's, exothermic when the water warms; two masses of water mixed reach (m1 t1 + m2 t2)/(m1 + m2). Specific heats
from the lesson's table. Results rounded half up to the significant figures of the data (three for Q, those of the
temperature change in the calorimeter) and written as the spec says; final temperatures to the tenth.
"""
import re

from sympy import Rational

from checkers._chim_misure import check_quantity_options, common, decimals_of, fmt_dec, parse_num, rounded, sig_count, text, unit_tex

CASE_RANGES = {
    1: {"positiva": (0.50, 0.70), "negativa": (0.30, 0.50)},
    2: {"celsius": (0.40, 0.60), "misto": (0.40, 0.60)},
    4: {"riceve": (0.40, 0.60), "cede": (0.40, 0.60)},
    5: {"esotermica": (0.40, 0.60), "endotermica": (0.40, 0.60)},
}

C = {"d'acqua": Rational("4.186"), "di etanolo": Rational("2.44"), "di olio d'oliva": Rational("1.97"), "di alluminio": Rational("0.897"), "di ferro": Rational("0.449"), "di rame": Rational("0.385")}
CW = Rational("4.186")
ESO = {"si scioglie dell'idrossido di sodio": True, "si scioglie del cloruro di calcio": True, "si scioglie del nitrato d'ammonio": False, "si scioglie del cloruro di potassio": False, "avviene una reazione": None}

NUM = r"(-?[\d\\,{}]+(?: \\cdot 10(?:\^-?\d|\^\{-?\d+\})?)?)"


def qre(unit):
    return r"\$" + NUM + r"\\," + re.escape(unit_tex(unit)) + r"\$"


def int_options(sample, errs, right, unit):
    ch = sample["answer"]
    vals = []
    for o in ch["options"]:
        m = re.fullmatch(r"(-?\d+)\\," + re.escape(unit_tex(unit)), o["latex"])
        if not m:
            errs.append(f"option {o['latex']!r} not an integer in {unit}")
            return
        vals.append(int(m.group(1)))
        if o["values"] != [m.group(1)]:
            errs.append("option value")
    if len(set(vals)) != 4:
        errs.append("options not distinct")
    good = [i for i, x in enumerate(vals) if x == right]
    if len(good) != 1 or ch["correct"] != good[0]:
        errs.append(f"right option {right} not at the correct index: {vals}, {ch['correct']}")


def heat_answer(sample, errs, Q, n):
    unit = "kJ" if Q >= 1000 else "J"
    r = rounded(Q / 1000 if unit == "kJ" else Q, n)
    if r is None:
        errs.append("tie")
        return
    check_quantity_options(sample, errs, r[0], r[1], unit)


def level1(sample, s, errs):
    if m := re.fullmatch(r"Esprimi in kelvin la temperatura " + qre("°C") + r"\.", s):
        t = int(m.group(1))
        int_options(sample, errs, t + 273, "K")
        return "negativa" if t < 0 else "positiva"
    if m := re.fullmatch(r"Esprimi in gradi Celsius la temperatura " + qre("K") + r"\.", s):
        T = int(m.group(1))
        int_options(sample, errs, T - 273, "°C")
        return "negativa" if T < 273 else "positiva"
    errs.append(f"level 1 text not recognised: {s!r}")
    return None


def level2(sample, s, errs):
    if m := re.fullmatch(r"Un campione (si scalda|si raffredda) da " + qre("°C") + " a " + qre("°C") + r"\. Di quanti kelvin (aumenta|diminuisce) la sua temperatura\?", s):
        a, b = int(m.group(2)), int(m.group(3))
        if (b > a) != (m.group(1) == "si scalda") or (b > a) != (m.group(4) == "aumenta"):
            errs.append("verb and direction")
        int_options(sample, errs, abs(b - a), "K")
        return "celsius"
    if m := re.fullmatch(r"Un campione (si scalda|si raffredda) da " + qre("K") + " a " + qre("°C") + r"\. Di quanti gradi Celsius (aumenta|diminuisce) la sua temperatura\?", s):
        a, b = int(m.group(2)) - 273, int(m.group(3))
        if (b > a) != (m.group(1) == "si scalda") or (b > a) != (m.group(4) == "aumenta"):
            errs.append("verb and direction")
        int_options(sample, errs, abs(b - a), "°C")
        return "misto"
    errs.append(f"level 2 text not recognised: {s!r}")
    return None


def level3(sample, s, errs):
    m = re.fullmatch(r"Quanto calore serve per scaldare " + qre("g") + " (.+?) da " + qre("°C") + " a " + qre("°C") + r"\? Il calore specifico è " + qre("J/(g·°C)") + r"\.", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    c = parse_num(m.group(5))
    if C.get(m.group(2)) != c:
        errs.append("substance or specific heat")
    mass = parse_num(m.group(1))
    ti, tf = parse_num(m.group(3)), parse_num(m.group(4))
    if sig_count(m.group(1)) != 3 or decimals_of(m.group(3)) != 1 or decimals_of(m.group(4)) != 1:
        errs.append("data figures")
    dt = tf - ti
    if dt < 10:
        errs.append("Δt below 10")
    heat_answer(sample, errs, c * mass * dt, 3)
    return m.group(2)


def level4(sample, s, errs):
    m = re.fullmatch(r"Un campione (.+?) di " + qre("g") + ", a " + qre("°C") + ", (riceve|cede) " + qre("kJ") + r" di calore\. A quale temperatura arriva\? Il calore specifico è " + qre("J/(g·°C)") + r"\.", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    c = parse_num(m.group(6))
    if C.get(m.group(1)) != c:
        errs.append("substance or specific heat")
    mass, ti, Q = parse_num(m.group(2)), parse_num(m.group(3)), parse_num(m.group(5)) * 1000
    dt = Q / (c * mass)
    if not 10 <= dt < 100:
        errs.append("Δt outside 10-100")
    tf = ti + dt if m.group(4) == "riceve" else ti - dt
    y = tf * 10
    frac = y - (y.p // y.q)
    if abs(frac - Rational(1, 2)) < Rational(1, 100):
        errs.append("final temperature near a tie")
    want = Rational(round(float(tf) * 10), 10) if tf > 0 else None
    if want is None:
        errs.append("negative final temperature")
        return None
    check_quantity_options(sample, errs, want, fmt_dec(want, 1), "°C")
    for o in sample["answer"]["options"]:
        if not re.fullmatch(r"\d+\{,\}\d\\," + re.escape(unit_tex("°C")), o["latex"]):
            errs.append(f"option {o['latex']!r} not to the tenth")
    return m.group(4)


def level5(sample, s, errs):
    m = re.fullmatch(
        r"In un calorimetro con " + qre("g") + " d'acqua a " + qre("°C") + " (.+?), e la temperatura (sale|scende) a " + qre("°C")
        + r"\. Quanto calore scambia la trasformazione, e di che tipo è\? Si trascura il calorimetro\.",
        s,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    if m.group(3) not in ESO:
        errs.append(f"process {m.group(3)!r}")
        return None
    mass, ti, tf = parse_num(m.group(1)), parse_num(m.group(2)), parse_num(m.group(5))
    warms = tf > ti
    if (m.group(4) == "sale") != warms:
        errs.append("sale/scende")
    if ESO[m.group(3)] is not None and ESO[m.group(3)] != warms:
        errs.append("the process goes the wrong way")
    change = abs(tf - ti)
    ch_s = fmt_dec(change, 1)
    n = min(sig_count(m.group(1)), sig_count(ch_s))
    Qw = CW * mass * change
    unit = "kJ" if Qw >= 1000 else "J"
    r = rounded(Qw / 1000 if unit == "kJ" else Qw, n)
    if r is None:
        errs.append("tie")
        return None
    want = ("\\text{esotermica, cede }" if warms else "\\text{endotermica, assorbe }") + r[1] + "\\," + unit_tex(unit)
    ch = sample["answer"]
    lat = [o["latex"] for o in ch["options"]]
    if len(set(lat)) != 4 or len({"|".join(o["values"]) for o in ch["options"]}) != 4:
        errs.append("options not distinct")
    good = [i for i, x in enumerate(lat) if x == want]
    if len(good) != 1 or ch["correct"] != good[0]:
        errs.append(f"expected {want!r} at the correct index: {lat}")
    for o in ch["options"]:
        if not re.fullmatch(r"\\text\{(esotermica, cede|endotermica, assorbe) \}" + NUM + r"\\," + re.escape(unit_tex(unit)), o["latex"]):
            errs.append(f"option {o['latex']!r} malformed")
    return "esotermica" if warms else "endotermica"


def level6(sample, s, errs):
    m = re.fullmatch(r"In un becher isolato si mescolano " + qre("g") + " d'acqua a " + qre("°C") + " e " + qre("g") + " d'acqua a " + qre("°C") + r"\. A quale temperatura arriva l'acqua\?", s)
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    m1, t1, m2, t2 = (int(m.group(i)) for i in range(1, 5))
    if m1 == m2:
        errs.append("equal masses")
    te = Rational(m1 * t1 + m2 * t2, m1 + m2)
    if te.q != 1:
        errs.append("te not whole")
    if te - min(t1, t2) < 3 or max(t1, t2) - te < 3:
        errs.append("te too close to a starting temperature")
    int_options(sample, errs, int(te), "°C")
    return "acqua"


def check(sample):
    errs = []
    common(sample, errs)
    fn = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}.get(sample["level"])
    if not fn:
        return [f"unknown level {sample['level']}"], None
    try:
        kind = fn(sample, text(sample), errs)
    except (ValueError, KeyError, AttributeError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
