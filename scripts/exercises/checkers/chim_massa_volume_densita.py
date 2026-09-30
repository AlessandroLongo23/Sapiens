"""Checker for chim-massa-volume-densita (specs/exercises/chim-massa-volume-densita.md).

Written from the spec and the lesson (docs/lezioni/chimica/riscritte/11-chim-massa-volume-densita.md): d = m/V,
m = d V, V = m/d; 1 g/mL = 1 g/cm³ = 1000 kg/m³, 1 L = 1000 mL; the mass weighed by difference is the full beaker
minus the empty one; the volume by immersion is the second reading minus the first; a body floats in a liquid denser
than itself. Results are rounded to the significant figures of the datum with fewest (lesson 13), half up, and
written as the spec says. Densities of the liquids and metals from the lesson's table.
"""
import re

from sympy import Rational

from checkers._chim_misure import check_quantity_options, common, parse_num, rounded, sig_count, text, unit_tex

CASE_RANGES = {
    1: {"liquido": (0.50, 0.70), "solido": (0.30, 0.50)},
    2: {"massa": (0.40, 0.60), "volume": (0.40, 0.60)},
    3: {k: (0.25, 0.42) for k in ["kgm3-massa", "litri-kg", "densita-kgm3"]},
    4: {"pipetta": (0.40, 0.60), "cilindro": (0.40, 0.60)},
    6: {"galleggia": (0.40, 0.60), "affonda": (0.40, 0.60)},
}

LIQ = {
    "dell'etanolo": Rational("0.789"),
    "della glicerina": Rational("1.26"),
    "dell'acido solforico concentrato": Rational("1.84"),
    "del mercurio": Rational("13.6"),
}
METALS = {"alluminio": Rational("2.70"), "ferro": Rational("7.87"), "rame": Rational("8.96"), "piombo": Rational("11.3")}
TABLE6 = {"etanolo": Rational("0.789"), "olio d'oliva": Rational("0.92"), "acqua": Rational("1.00"), "glicerina": Rational("1.26"), "mercurio": Rational("13.6")}

NUM = r"(-?[\d\\,{}]+(?: \\cdot 10(?:\^-?\d|\^\{-?\d+\})?)?)"


def qre(unit):
    return r"\$" + NUM + r"\\," + re.escape(unit_tex(unit)) + r"\$"


def datum(s, errs, what, sigs=None):
    v = parse_num(s)
    if sigs is not None and sig_count(s) != sigs:
        errs.append(f"{what} {s} has not {sigs} significant figures")
    if "{,}" not in s and s.endswith("0"):
        errs.append(f"{what} {s}: whole number ending in zero")
    return v


def answer(sample, errs, exact, n, unit):
    r = rounded(exact, n)
    if r is None:
        errs.append("result at a rounding tie")
        return
    check_quantity_options(sample, errs, r[0], r[1], unit)


def level1(sample, s, errs):
    m = re.fullmatch(r"Un campione di un (liquido|solido) ha la massa di " + qre("g") + r" e il volume di \$" + NUM + r"\\,\\text\{(mL|cm)\}(\^3)?\$\. Quanto vale la sua densità\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    solid = m.group(1) == "solido"
    unit = "cm^3" if solid else "mL"
    if m.group(4) + (m.group(5) or "") != unit:
        errs.append("volume unit")
    mass = datum(m.group(2), errs, "mass", 3)
    V = datum(m.group(3), errs, "volume", 3)
    answer(sample, errs, mass / V, 3, "g/cm^3" if solid else "g/mL")
    return "solido" if solid else "liquido"


def level2(sample, s, errs):
    if mm := re.fullmatch(r"Un pezzo di (\w+) ha il volume di " + qre("cm^3") + r"\. La densità del (\w+) è " + qre("g/cm^3") + r"\. Quanto vale la sua massa\?", s):
        if mm.group(1) != mm.group(3) or METALS.get(mm.group(1)) != parse_num(mm.group(4)):
            errs.append("metal or density")
        V = datum(mm.group(2), errs, "volume", 3)
        answer(sample, errs, parse_num(mm.group(4)) * V, 3, "g")
        return "massa"
    if mm := re.fullmatch(r"La densità (.+?) è " + qre("g/mL") + r"\. Quanto vale la massa di " + qre("mL") + r"\?", s):
        if LIQ.get(mm.group(1)) != parse_num(mm.group(2)):
            errs.append("liquid or density")
        V = datum(mm.group(3), errs, "volume", 3)
        answer(sample, errs, parse_num(mm.group(2)) * V, 3, "g")
        return "massa"
    if mm := re.fullmatch(r"La densità (.+?) è " + qre("g/mL") + r"\. Quanti millilitri bisogna prelevare per averne " + qre("g") + r"\?", s):
        if LIQ.get(mm.group(1)) != parse_num(mm.group(2)):
            errs.append("liquid or density")
        mass = datum(mm.group(3), errs, "mass", 3)
        answer(sample, errs, mass / parse_num(mm.group(2)), 3, "mL")
        return "volume"
    errs.append(f"level 2 text not recognised: {s!r}")
    return None


def level3(sample, s, errs):
    if mm := re.fullmatch(r"La densità (.+?) è " + qre("kg/m^3") + r"\. Quanti grammi pesano " + qre("mL") + r"\?", s):
        dk = parse_num(mm.group(2))
        if LIQ.get(mm.group(1)) * 1000 != dk:
            errs.append("liquid or density")
        V = datum(mm.group(3), errs, "volume", 3)
        answer(sample, errs, dk / 1000 * V, 3, "g")
        return "kgm3-massa"
    if mm := re.fullmatch(r"La densità (.+?) è " + qre("g/mL") + r"\. Quanti chilogrammi pesano " + qre("L") + r"\?", s):
        d = parse_num(mm.group(2))
        if LIQ.get(mm.group(1)) != d:
            errs.append("liquid or density")
        V = datum(mm.group(3), errs, "volume", 3)
        answer(sample, errs, d * V * 1000 / 1000, 3, "kg")
        return "litri-kg"
    if mm := re.fullmatch(r"Un liquido ha la massa di " + qre("g") + r" e il volume di " + qre("mL") + r"\. Quanto vale la sua densità in \$\\text\{kg/m\}\^3\$\?", s):
        mass = datum(mm.group(1), errs, "mass", 3)
        V = datum(mm.group(2), errs, "volume", 3)
        answer(sample, errs, mass / V * 1000, 3, "kg/m^3")
        return "densita-kgm3"
    errs.append(f"level 3 text not recognised: {s!r}")
    return None


def level4(sample, s, errs):
    mm = re.fullmatch(
        r"Un becher vuoto ha la massa di " + qre("g") + r"\. Si prelevano con (una pipetta tarata|un cilindro graduato) " + qre("mL")
        + r" di un liquido e si versano nel becher, e la bilancia segna " + qre("g") + r"\. Quanto vale la densità del liquido\?",
        s,
    )
    if not mm:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    m1s, m2s, Vs = mm.group(1), mm.group(4), mm.group(3)
    for x in (m1s, m2s):
        if not re.fullmatch(r"\d+\{,\}\d\d", x):
            errs.append(f"mass {x} not to the hundredth")
    pipette = mm.group(2) == "una pipetta tarata"
    if pipette and Vs not in ("10{,}00", "20{,}00", "25{,}00", "50{,}00"):
        errs.append(f"pipette volume {Vs}")
    if not pipette and sig_count(Vs) != 3:
        errs.append(f"cylinder volume {Vs}")
    m_liq = parse_num(m2s) - parse_num(m1s)
    # the difference has the hundredths: its significant figures are those of its writing with two decimals
    whole = m_liq.p // m_liq.q
    n_m = len(str(int(m_liq * 100))) if whole > 0 else len(str(int(m_liq * 100)).lstrip("0"))
    n = min(n_m, sig_count(Vs))
    d = m_liq / parse_num(Vs)
    if not Rational("0.7") < d < Rational("2"):
        errs.append(f"density {d} outside the liquids")
    answer(sample, errs, d, n, "g/mL")
    return "pipetta" if pipette else "cilindro"


def level5(sample, s, errs):
    mm = re.fullmatch(
        r"Un granulo di metallo ha la massa di " + qre("g") + r"\. In un cilindro graduato l'acqua è a " + qre("mL")
        + r"; si immerge il granulo, e l'acqua sale a " + qre("mL") + r"\. Quanto vale la densità del metallo\?",
        s,
    )
    if not mm:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    mass = datum(mm.group(1), errs, "mass")
    V1, V2 = parse_num(mm.group(2)), parse_num(mm.group(3))
    for x in (mm.group(1), mm.group(2), mm.group(3)):
        if not re.fullmatch(r"\d+\{,\}\d", x):
            errs.append(f"{x} not with one decimal")
    if (V1 * 2).q != 1 or (V2 * 2).q != 1:
        errs.append("readings not in half millilitres")
    V = V2 - V1
    nV = 3 if V >= 10 else 2
    n = min(nV, sig_count(mm.group(1)))
    d = mass / V
    near = [k for k, x in METALS.items() if abs(d - x) / x < Rational(3, 100)]
    if not near:
        errs.append(f"density {float(d)} is not a metal of the lesson")
    answer(sample, errs, d, n, "g/mL")
    return near[0] if near else None


def level6(sample, s, errs):
    mm = re.fullmatch(r"Un oggetto ha la massa di " + qre("g") + r" e il volume di " + qre("cm^3") + r"\. In quale di questi liquidi (galleggia|affonda)\?", s)
    if not mm:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    mass = datum(mm.group(1), errs, "mass", 3)
    V = datum(mm.group(2), errs, "volume", 3)
    d = mass / V
    floats = mm.group(3) == "galleggia"
    for x in TABLE6.values():
        if abs(d - x) < Rational(2, 100):
            errs.append(f"density {float(d)} too close to a liquid's")
    ch = sample["answer"]
    good = []
    for i, o in enumerate(ch["options"]):
        m2 = re.fullmatch(r"\\text\{(.+), \}" + NUM + r"\\," + re.escape(unit_tex("g/mL")), o["latex"])
        if not m2 or m2.group(1) not in TABLE6:
            errs.append(f"option {o['latex']!r} unreadable")
            continue
        if parse_num(m2.group(2)) != TABLE6[m2.group(1)]:
            errs.append(f"option {o['latex']!r}: wrong density")
        dl = TABLE6[m2.group(1)]
        if (dl > d) == floats:
            good.append(i)
    if len(good) != 1:
        errs.append(f"{len(good)} right options")
    elif ch["correct"] != good[0]:
        errs.append("correct index")
    if len({o["latex"] for o in ch["options"]}) != 4:
        errs.append("options not distinct")
    return "galleggia" if floats else "affonda"


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
