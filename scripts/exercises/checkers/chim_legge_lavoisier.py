"""Checker for chim-legge-lavoisier (specs/exercises/chim-legge-lavoisier.md), written from the spec and the lesson
23-chim-legge-lavoisier.md, not from the generator.

The masses are read back from the text; the answer follows from the conservation of mass, with exact decimals:
- level 1: product = sum of the two reactants;
- level 2: the missing mass = (sum of the other side) - (sum of the rest of its side);
- level 3: the gas that left = reading before - reading after; the oxygen taken = after - before;
- level 4: the gas = (beaker + full boat) - (beaker after + empty boat);
- level 5: the leftover = reactants - product, or the product = reactants - leftover.
Every mass has two decimals and the answer too. The masses must also follow the real reaction: they are compared with
the balanced equation, whose molar masses are computed here from the formulas and the atomic masses of lesson 01, and
may differ from it only by the rounding to the hundredth.
"""
import re

from sympy import Rational

from checkers._chim_leggi_ponderali import G, check_choice, common, mass_option, num, prose

CASE_RANGES = {
    2: {"reagente": (0.30, 0.70), "prodotto": (0.30, 0.70)},
    3: {"gas uscito": (0.40, 0.60), "ossigeno entrato": (0.40, 0.60)},
    5: {"avanzo": (0.40, 0.60), "prodotto": (0.40, 0.60)},
}

ATOMIC = {"H": "1.01", "C": "12.01", "N": "14.01", "O": "16.00", "Na": "22.99", "Mg": "24.31", "S": "32.07", "Cl": "35.45",
          "K": "39.10", "Ca": "40.08", "Fe": "55.85"}


def molar(formula):
    """Molar mass of a formula like Ca(OH)2 or CH3COONa, exactly."""
    def parse(s, i):
        total = Rational(0)
        while i < len(s) and s[i] != ")":
            if s[i] == "(":
                sub, i = parse(s, i + 1)
                i += 1
            else:
                m = re.match(r"[A-Z][a-z]?", s[i:])
                sub = Rational(ATOMIC[m.group(0)])
                i += len(m.group(0))
            k = re.match(r"\d+", s[i:])
            n = int(k.group(0)) if k else 1
            i += len(k.group(0)) if k else 0
            total += n * sub
        return total, i
    return parse(formula, 0)[0]


# reactions: (reactants, products), each a list of (name, coefficient, formula)
REACTIONS = [
    ([("ferro", 1, "Fe"), ("zolfo", 1, "S")], [("solfuro di ferro", 1, "FeS")]),
    ([("magnesio", 2, "Mg"), ("ossigeno", 1, "O2")], [("ossido di magnesio", 2, "MgO")]),
    ([("carbonio", 1, "C"), ("ossigeno", 1, "O2")], [("diossido di carbonio", 1, "CO2")]),
    ([("idrogeno", 2, "H2"), ("ossigeno", 1, "O2")], [("acqua", 2, "H2O")]),
    ([("sodio", 2, "Na"), ("cloro", 1, "Cl2")], [("cloruro di sodio", 2, "NaCl")]),
    ([("ossido di calcio", 1, "CaO"), ("acqua", 1, "H2O")], [("idrossido di calcio", 1, "Ca(OH)2")]),
    ([("ferro", 4, "Fe"), ("ossigeno", 3, "O2")], [("ossido di ferro", 2, "Fe2O3")]),
    ([("azoto", 1, "N2"), ("idrogeno", 3, "H2")], [("ammoniaca", 2, "NH3")]),
    ([("carbonato di calcio", 1, "CaCO3")], [("ossido di calcio", 1, "CaO"), ("diossido di carbonio", 1, "CO2")]),
    ([("carbonato di magnesio", 1, "MgCO3")], [("ossido di magnesio", 1, "MgO"), ("diossido di carbonio", 1, "CO2")]),
    ([("clorato di potassio", 2, "KClO3")], [("cloruro di potassio", 2, "KCl"), ("ossigeno", 3, "O2")]),
    ([("acqua ossigenata", 2, "H2O2")], [("acqua", 2, "H2O"), ("ossigeno", 1, "O2")]),
    ([("bicarbonato di sodio", 2, "NaHCO3")], [("carbonato di sodio", 1, "Na2CO3"), ("acqua", 1, "H2O"), ("diossido di carbonio", 1, "CO2")]),
    ([("metano", 1, "CH4"), ("ossigeno", 2, "O2")], [("diossido di carbonio", 1, "CO2"), ("acqua", 2, "H2O")]),
    ([("bicarbonato di sodio", 1, "NaHCO3"), ("acido acetico", 1, "CH3COOH")], [("acetato di sodio", 1, "CH3COONa"), ("acqua", 1, "H2O"), ("diossido di carbonio", 1, "CO2")]),
    ([("carbonato di calcio", 1, "CaCO3"), ("acido cloridrico", 2, "HCl")], [("cloruro di calcio", 1, "CaCl2"), ("acqua", 1, "H2O"), ("diossido di carbonio", 1, "CO2")]),
    ([("magnesio", 1, "Mg"), ("acido cloridrico", 2, "HCl")], [("cloruro di magnesio", 1, "MgCl2"), ("idrogeno", 1, "H2")]),
]
# the gas that leaves per gram of solid, and the oxygen taken per gram of metal
GAS = {
    ("carbonato di calcio (marmo)", "diossido di carbonio"): molar("CO2") / molar("CaCO3"),
    ("bicarbonato di sodio", "diossido di carbonio"): molar("CO2") / molar("NaHCO3"),
    ("magnesio", "idrogeno"): molar("H2") / molar("Mg"),
    ("carbonato di calcio", "diossido di carbonio"): molar("CO2") / molar("CaCO3"),
    ("clorato di potassio", "ossigeno"): 3 * molar("O2") / (2 * molar("KClO3")),
}
BURN = {"magnesio": molar("O") / molar("Mg"), "calcio": molar("O") / molar("Ca"), "ferro in polvere": 3 * molar("O") / (2 * molar("Fe"))}
TOL = Rational(1, 100)  # a mass rounded to the hundredth, from another rounded one: at most about 0.01 g off
CENT = Rational(1, 100)


def two_dec(s, errs):
    if not re.fullmatch(r"\d+\{,\}\d\d", s):
        errs.append(f"mass {s} has not two decimals")
    return num(s)


def masses(text, errs):
    return [two_dec(x, errs) for x in re.findall(G, text)]


def answer_is(sample, errs, value):
    """The right option is `value` g, written with two decimals; the options are masses."""
    if value <= 0:
        errs.append(f"answer {value} not positive")
    n = value * 100
    if n.q != 1:
        errs.append(f"answer {value} not in hundredths")
        return
    s = str(int(n)).rjust(3, "0")
    written = s[:-2] + "{,}" + s[-2:]
    for o in sample["answer"]["options"]:
        v, extra = mass_option(o["latex"])
        if extra:
            errs.append(f"option with words {o['latex']!r}")
        if o["values"] != [v.replace("{,}", ".")]:
            errs.append(f"option {o['latex']!r} has value {o['values']}")
    check_choice(sample["answer"], lambda o: mass_option(o["latex"])[0] == written, errs)


def near(a, b, tol=TOL):
    return abs(a - b) <= tol + Rational(1, 10**9)


def find_reaction(rnames, pnames):
    hits = [r for r in REACTIONS if sorted(n for n, _, _ in r[0]) == sorted(rnames) and sorted(n for n, _, _ in r[1]) == sorted(pnames)]
    return hits[0] if len(hits) == 1 else None


def eq_mass(sub):
    return sub[1] * molar(sub[2])


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In un recipiente chiuso " + G + r" di (.+?) reagiscono completamente con " + G + r" di (.+?), e si forma (.+?)\. Quanti grammi di (.+?) si formano\?", s)
    if not m or m.group(5) != m.group(6):
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    a, b = two_dec(m.group(1), errs), two_dec(m.group(3), errs)
    R = find_reaction([m.group(2), m.group(4)], [m.group(5)])
    if not R:
        errs.append("unknown reaction")
        return None
    MA = eq_mass(next(x for x in R[0] if x[0] == m.group(2)))
    MB = eq_mass(next(x for x in R[0] if x[0] == m.group(4)))
    if not near(b, a * MB / MA):
        errs.append(f"masses {a}, {b} do not follow the reaction")
    if not (1 <= a <= 30):
        errs.append("first mass outside 1-30 g")
    answer_is(sample, errs, a + b)
    return None


def split_items(text):
    """ "$2{,}12\\,\\text{g}$ di X, una certa massa di Y e $1{,}00...$ di Z" → [(mass or None, name)]."""
    parts = re.split(r", | e (?=\$|una certa massa)", text)
    out = []
    for p in parts:
        if m := re.fullmatch(G + r" di (.+)", p):
            out.append((m.group(1), m.group(2)))
        elif m := re.fullmatch(r"una certa massa di (.+)", p):
            out.append((None, m.group(1)))
        else:
            raise ValueError(f"item not recognised: {p!r}")
    return out


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In un recipiente chiuso reagiscono completamente (.+?), e si formano (.+?)\. Quanti grammi di (.+?) (hanno reagito|si formano)\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    rs, ps = split_items(m.group(1)), split_items(m.group(2))
    unknown = [(side, name) for side, items in (("r", rs), ("p", ps)) for (x, name) in items if x is None]
    if len(unknown) != 1 or unknown[0][1] != m.group(3) or (unknown[0][0] == "r") != (m.group(4) == "hanno reagito"):
        errs.append(f"the unknown is not the one asked: {unknown}")
        return None
    side = unknown[0][0]
    R = find_reaction([n for _, n in rs], [n for _, n in ps])
    if not R:
        errs.append("unknown reaction")
        return None
    mr = [two_dec(x, errs) for x, _ in rs if x is not None]
    mp = [two_dec(x, errs) for x, _ in ps if x is not None]
    x = (sum(mp) - sum(mr)) if side == "r" else (sum(mr) - sum(mp))
    # every mass against the equation, scaled on the first reactant when it is known, else on the first product
    allm = {**{("r", n): (num(v) if v else x) for v, n in rs}, **{("p", n): (num(v) if v else x) for v, n in ps}}
    ref_side, ref = ("r", R[0][0]) if rs[0][0] is not None else ("p", R[1][0])
    k = allm[(ref_side, ref[0])] / eq_mass(ref)
    for sd, subs in (("r", R[0]), ("p", R[1])):
        for sub in subs:
            if not near(allm[(sd, sub[0])], k * eq_mass(sub), 3 * TOL):
                errs.append(f"mass of {sub[0]} does not follow the reaction")
    answer_is(sample, errs, x)
    return "reagente" if side == "r" else "prodotto"


def level3(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Su una bilancia c'è un becher con dell'(aceto|acido cloridrico); si aggiungono " + G + r" di (.+?), che reagiscono tutti\. Prima della reazione la bilancia segnava " + G + r", alla fine segna " + G + r"\. Quanto (.+?) è uscito dal becher\?", s):
        sld, M1, M2, gas = m.group(3), two_dec(m.group(4), errs), two_dec(m.group(5), errs), m.group(6)
        sm = two_dec(m.group(2), errs)
    elif m := re.fullmatch(r"In un crogiolo aperto si scaldano " + G + r" di (.+?), che si decompongono tutti in (.+?) e (.+?)\. Il crogiolo pesava " + G + r" prima e pesa " + G + r" dopo\. Quanto (.+?) è uscito dal crogiolo\?", s):
        sm, sld, gas, M1, M2 = two_dec(m.group(1), errs), m.group(2), m.group(4), two_dec(m.group(5), errs), two_dec(m.group(6), errs)
        if m.group(7) != gas:
            errs.append("the gas asked is not the gas formed")
    elif m := re.fullmatch(r"In un crogiolo aperto si scaldano all'aria " + G + r" di (.+?), che si trasformano tutti in (.+?)\. Il crogiolo pesava " + G + r" prima e pesa " + G + r" dopo\. Quanto ossigeno dell'aria ha reagito\?", s):
        mm, metal, M1, M2 = two_dec(m.group(1), errs), m.group(2), two_dec(m.group(4), errs), two_dec(m.group(5), errs)
        if metal not in BURN or not near(M2 - M1, mm * BURN[metal]):
            errs.append(f"oxygen {M2 - M1} does not follow the burning of {mm} g of {metal}")
        answer_is(sample, errs, M2 - M1)
        return "ossigeno entrato"
    else:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    if (sld, gas) not in GAS or not near(M1 - M2, sm * GAS[(sld, gas)]):
        errs.append(f"gas {M1 - M2} does not follow {sm} g of {sld}")
    answer_is(sample, errs, M1 - M2)
    return "gas uscito"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un becher con dell'(aceto|acido cloridrico) pesa " + G + r", e un vetrino con del (.+?) pesa " + G + r"\. Si versa tutto il solido nel becher: reagisce completamente, e alla fine il becher pesa " + G + r" e il vetrino vuoto " + G + r"\. Quanto (.+?) si è formato\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    Mb, sld, Ms, Mb2, Mv, gas = two_dec(m.group(2), errs), m.group(3), two_dec(m.group(4), errs), two_dec(m.group(5), errs), two_dec(m.group(6), errs), m.group(7)
    x = Mb + Ms - Mb2 - Mv
    if (sld, gas) not in GAS or not near(x, (Ms - Mv) * GAS[(sld, gas)]):
        errs.append(f"gas {x} does not follow {Ms - Mv} g of {sld}")
    answer_is(sample, errs, x)
    return None


def level5(sample, errs):
    s = prose(sample["problem"])
    head = r"In un recipiente chiuso si fanno reagire " + G + r" di (.+?) e " + G + r" di (.+?)\. "
    if m := re.fullmatch(head + r"Alla fine ci sono " + G + r" di (.+?) e una parte di (.+?) che non ha reagito\. Quanto (.+?) avanza\?", s):
        mA, A, mB, B, c, C, E = two_dec(m.group(1), errs), m.group(2), two_dec(m.group(3), errs), m.group(4), two_dec(m.group(5), errs), m.group(6), m.group(7)
        if m.group(8) != E:
            errs.append("the substance asked is not the one in excess")
        left = mA + mB - c
        kind, x = "avanzo", left
    elif m := re.fullmatch(head + r"Alla fine restano " + G + r" di (.+?) che non hanno reagito, e il resto è diventato (.+?)\. Quanti grammi di (.+?) si sono formati\?", s):
        mA, A, mB, B, left, E, C = two_dec(m.group(1), errs), m.group(2), two_dec(m.group(3), errs), m.group(4), two_dec(m.group(5), errs), m.group(6), m.group(7)
        if m.group(8) != C:
            errs.append("the substance asked is not the product")
        c = mA + mB - left
        kind, x = "prodotto", c
    else:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    R = find_reaction([A, B], [C])
    if not R or E not in (A, B):
        errs.append("unknown reaction or reactant in excess")
        return None
    MA = eq_mass(next(x_ for x_ in R[0] if x_[0] == A))
    MB = eq_mass(next(x_ for x_ in R[0] if x_[0] == B))
    usedA, usedB = (mA, mB - left) if E == B else (mA - left, mB)
    # the reactant in excess is computed from the limiting one, which reacts completely
    follows = near(usedB, usedA * MB / MA) if E == B else near(usedA, usedB * MA / MB)
    if left <= 0 or not follows:
        errs.append(f"the reacting masses {usedA}, {usedB} do not follow the reaction")
    answer_is(sample, errs, x)
    return kind


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    common(sample, errs)
    fn = LEVELS.get(sample["level"])
    if not fn:
        return [f"unknown level {sample['level']}"], None
    try:
        kind = fn(sample, errs)
    except Exception as e:  # noqa: BLE001
        errs.append(f"checker error: {e!r}")
        kind = None
    return errs, kind
