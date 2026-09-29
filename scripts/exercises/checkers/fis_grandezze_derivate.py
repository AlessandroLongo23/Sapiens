"""Checker for fis-grandezze-derivate (specs/exercises/fis-grandezze-derivate.md).

Written from the spec and the lesson: measures and units are read back from the text, brought to SI units with the
lesson's powers of ten (1 L = 10^-3 m^3, 1 g = 10^-3 kg) and the answer is recomputed exactly (SymPy rationals).
Densities of named materials must be the lesson's table; level 6 checks how close the measured density is to each
option.
"""
import re

from sympy import Rational

from checkers._fis_grandezze import canonical_dec, check_choice, common, parse_dec, prose_and_extra, split_unit

CASE_RANGES = {
    1: {"area": (0.30, 0.50), "volume": (0.50, 0.70)},
    2: {k: (0.25, 0.42) for k in ["parallelepipedo", "cubo", "immersione"]},
    5: {"massa": (0.40, 0.60), "volume": (0.40, 0.60)},
    6: {k: (0.10, 0.24) for k in ["vetro", "alluminio", "ferro", "rame", "piombo", "oro"]},
}

TEN = Rational(10)
LENGTH = {"km": TEN**3, "m": 1, "dm": TEN**-1, "cm": TEN**-2, "mm": TEN**-3}
AREA = {"km^2": TEN**6, "m^2": 1, "dm^2": TEN**-2, "cm^2": TEN**-4, "mm^2": TEN**-6}
VOLUME = {"m^3": 1, "dm^3": TEN**-3, "cm^3": TEN**-6, "mm^3": TEN**-9, "L": TEN**-3, "mL": TEN**-6, "hL": TEN**-1}
MASS = {"kg": 1, "g": TEN**-3}
DENSITY = {"kg/m^3": 1, "g/cm^3": TEN**3}
TABLE = {"olio d'oliva": Rational(92, 100), "ghiaccio": Rational(917, 1000), "acqua": 1, "vetro": Rational(25, 10), "alluminio": Rational(27, 10), "ferro": Rational(787, 100), "rame": Rational(896, 100), "piombo": Rational(113, 10), "oro": Rational(193, 10)}  # g/cm^3


def meas(tex):
    """'3{,}5\\,\\text{cm}^3' -> (value, unit), value canonical."""
    num, u = split_unit(tex)
    return canonical_dec(num), u


def unit_only(tex):
    m = re.fullmatch(r"\\text\{([^}]*)\}(\^\d)?", tex.strip())
    if not m:
        raise ValueError(f"unit {tex!r}")
    return m.group(1) + (m.group(2) or "")


def value_option(unit, max_dec=None):
    def val(o):
        v, u = meas(o["latex"])
        if u != unit:
            raise ValueError(f"option in {u}, expected {unit}")
        if Rational(o["values"][0]) != v:
            raise ValueError("option value differs from its text")
        return v

    return val


def decimals(r):
    k = 0
    while (Rational(r) * 10**k).q != 1:
        k += 1
        if k > 15:
            return 99
    return k


def distractor_decimals(sample, truth, errs, conversions=False):
    if conversions:
        return
    for o in sample["answer"]["options"]:
        v = Rational(o["values"][0])
        if v != truth and decimals(v) > max(2, decimals(truth)):
            errs.append(f"distractor {o['latex']} has more decimals than the answer")


def level1(sample, prose, errs):
    m = re.fullmatch(r"Esprimi \$(.+?)\$ in \$(.+?)\$\.", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    x, u1 = meas(m.group(1))
    u2 = unit_only(m.group(2))
    table = AREA if u1 in AREA else VOLUME
    if u2 not in table or u1 == u2:
        errs.append(f"{u1} -> {u2} is not a change of area or volume unit")
        return None
    truth = x * table[u1] / table[u2]
    if decimals(truth) > 4 or truth > 10**7 or decimals(x) > 3:
        errs.append(f"answer {truth} or data {x} out of range")
    check_choice(sample["answer"], lambda o: value_option(u2)(o) == truth, errs)
    return "area" if table is AREA else "volume"


def level2(sample, prose, errs):
    m = re.fullmatch(r"In un cilindro graduato l'acqua arriva a \$(.+?)\$\. Dopo aver immerso del tutto un sasso arriva a \$(.+?)\$\. Qual è il volume del sasso\?", prose)
    if m:
        (v1, a), (v2, b) = meas(m.group(1)), meas(m.group(2))
        if a != "mL" or b != "mL" or v2 <= v1:
            errs.append("readings not in mL or not increasing")
        truth = (v2 - v1) * VOLUME["mL"] / VOLUME["cm^3"]
        check_choice(sample["answer"], lambda o: value_option("cm^3")(o) == truth, errs)
        return "immersione"
    m = re.fullmatch(r"Un cubo ha lo spigolo di \$(.+?)\$\. Qual è il suo volume in \$(.+?)\$\?", prose)
    if m:
        l, u = meas(m.group(1))
        target = unit_only(m.group(2))
        truth = (l * LENGTH[u]) ** 3 / VOLUME[target]
        check_choice(sample["answer"], lambda o: value_option(target)(o) == truth, errs)
        distractor_decimals(sample, truth, errs)
        return "cubo"
    m = re.fullmatch(r"Una scatola ha la forma di un parallelepipedo con gli spigoli di \$(.+?)\$, \$(.+?)\$ e \$(.+?)\$\. Qual è il suo volume in \$(.+?)\$\?", prose)
    if m:
        edges = [meas(m.group(k)) for k in (1, 2, 3)]
        if len({u for _, u in edges}) != 2:
            errs.append("the edges should be in two different units")
        target = unit_only(m.group(4))
        vol = 1
        for v, u in edges:
            vol *= v * LENGTH[u]
        truth = vol / VOLUME[target]
        if decimals(truth) > 4:
            errs.append(f"volume {truth} with more than four decimals")
        check_choice(sample["answer"], lambda o: value_option(target)(o) == truth, errs)
        distractor_decimals(sample, truth, errs)
        return "parallelepipedo"
    errs.append(f"level 2 text not recognised: {prose!r}")
    return None


def density_of(m_tex, v_tex, target):
    (mv, mu), (vv, vu) = meas(m_tex), meas(v_tex)
    return mv * MASS[mu] / (vv * VOLUME[vu]) / DENSITY[target], mu, vu


def level3(sample, prose, errs):
    m = re.fullmatch(r"Un oggetto ha la massa di \$(.+?)\$ e il volume di \$(.+?)\$\. Qual è la sua densità\?", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    _, mu = meas(m.group(1))
    _, vu = meas(m.group(2))
    pair = {("g", "cm^3"): "g/cm^3", ("kg", "m^3"): "kg/m^3"}.get((mu, vu))
    if pair is None:
        errs.append(f"units {mu}, {vu} do not go together")
        return None
    truth, _, _ = density_of(m.group(1), m.group(2), pair)
    if decimals(truth) > 3:
        errs.append(f"density {truth} with more than three decimals")
    check_choice(sample["answer"], lambda o: value_option(pair)(o) == truth, errs)
    distractor_decimals(sample, truth, errs)
    return "g-cm3" if pair == "g/cm^3" else "kg-m3"


def level4(sample, prose, errs):
    m = re.fullmatch(r"Esprimi in \$(.+?)\$ la densità \$(.+?)\$\.", prose)
    if m:
        target = unit_only(m.group(1))
        x, u = meas(m.group(2))
        if {u, target} != {"g/cm^3", "kg/m^3"}:
            errs.append("not between g/cm^3 and kg/m^3")
        truth = x * DENSITY[u] / DENSITY[target]
        check_choice(sample["answer"], lambda o: value_option(target)(o) == truth, errs)
        return "converti"
    m = re.fullmatch(r"Un (?:liquido|oggetto) ha la massa di \$(.+?)\$ e il volume di \$(.+?)\$\. Qual è la sua densità in \$(.+?)\$\?", prose)
    if m:
        target = unit_only(m.group(3))
        truth, mu, vu = density_of(m.group(1), m.group(2), target)
        if (mu, vu) not in {("g", "L"), ("kg", "cm^3")}:
            errs.append(f"units {mu}, {vu} not one of the two cases")
        check_choice(sample["answer"], lambda o: value_option(target)(o) == truth, errs)
        distractor_decimals(sample, truth, errs)
        return "mista"
    errs.append(f"level 4 text not recognised: {prose!r}")
    return None


def level5(sample, prose, errs):
    m = re.fullmatch(r"Qual è la massa di \$(.+?)\$ di (.+?), che ha la densità di \$(.+?)\$\?", prose)
    if m:
        V, vu = meas(m.group(1))
        name = m.group(2)
        d, du = meas(m.group(3))
        if name not in TABLE or d * DENSITY[du] != TABLE[name] * 1000:
            errs.append(f"density of {name} is not the lesson's")
        if name in ("acqua", "olio d'oliva") and vu != "L":
            errs.append("a liquid measured in cm^3")
        truth = d * DENSITY[du] * V * VOLUME[vu]  # kg
        check_choice(sample["answer"], lambda o: value_option("kg")(o) == truth, errs)
        distractor_decimals(sample, truth, errs)
        return "massa"
    m = re.fullmatch(r"Un oggetto di (.+?) ha la massa di \$(.+?)\$\. La densità (?:del |dell')(.+?) è \$(.+?)\$\. Qual è il suo volume\?", prose)
    if m:
        name = m.group(1)
        if m.group(3) != name:
            errs.append("two materials in the text")
        mass, mu = meas(m.group(2))
        d, du = meas(m.group(4))
        if name not in TABLE or name in ("acqua", "olio d'oliva") or d * DENSITY[du] != TABLE[name] * 1000:
            errs.append(f"density of {name} is not the lesson's, or it is a liquid")
        art = "dell'" if name[0] in "aeiou" else "del "
        if f"La densità {art}{name} è" not in prose:
            errs.append("wrong article")
        truth = mass * MASS[mu] / (d * DENSITY[du]) / VOLUME["cm^3"]
        check_choice(sample["answer"], lambda o: value_option("cm^3")(o) == truth, errs)
        distractor_decimals(sample, truth, errs)
        return "volume"
    errs.append(f"level 5 text not recognised: {prose!r}")
    return None


def level6(sample, prose, errs):
    m = re.fullmatch(r"Un oggetto di metallo o di vetro ha la massa di \$(.+?)\$\. In un cilindro graduato l'acqua passa da \$(.+?)\$ a \$(.+?)\$ quando lo si immerge\. Di che materiale è fatto\?", prose)
    if not m:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    mass, mu = meas(m.group(1))
    (v1, a), (v2, b) = meas(m.group(2)), meas(m.group(3))
    if mu != "g" or a != "mL" or b != "mL" or v2 <= v1 or decimals(mass) > 1:
        errs.append("data out of the spec")
        return None
    d = mass / (v2 - v1)  # g/cm^3

    def material(o):
        mm = re.fullmatch(r"\\text\{(.+?) \} \((.+)\)", o["latex"])
        name = mm.group(1)
        v, u = meas(mm.group(2))
        if u != "g/cm^3" or TABLE.get(name) != v or o["values"] != [name]:
            raise ValueError(f"option {o['latex']} is not a material with its density")
        return name, v

    names = []
    for o in sample["answer"]["options"]:
        try:
            names.append(material(o))
        except ValueError as e:
            errs.append(str(e))
            return None
    close = [n for n, v in names if abs(d / v - 1) <= Rational(1, 100)]
    for n, v in names:
        if n not in close and abs(v / d - 1) < Rational(1, 10):
            errs.append(f"option {n} too close to the measured density {float(d):.3f}")
    if len(close) != 1:
        errs.append(f"{len(close)} materials within 1% of {float(d):.3f}")
        return None
    check_choice(sample["answer"], lambda o: material(o)[0] == close[0], errs)
    return close[0]


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
    return errs, fn(sample, prose, errs)
