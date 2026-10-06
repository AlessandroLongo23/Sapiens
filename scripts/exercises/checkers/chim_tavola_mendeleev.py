"""Checker for chim-tavola-mendeleev (specs/exercises/chim-tavola-mendeleev.md), written from the spec and the lesson
43-chim-tavola-mendeleev.md, not from the generator.

The facts of the lesson (answer key below); a missing mass estimated as the mean of the element above and the one below
(masses checked against IUPAC values with two decimals); the modern table ordered by atomic number, with the three
pairs of the lesson whose masses go the other way (Ar-K, Co-Ni, Te-I); elements of a group combine in the same
proportions (the formulas of the partner compounds checked against a valence table of their own).
"""
import re

from sympy import Rational, floor

from checkers._fis_grandezze import check_choice, common, option_text, prose_and_extra

CASE_RANGES = {3: {"coppia": (0.40, 0.60), "ordine": (0.40, 0.60)}}

KEY = {
    "Con quale criterio Mendeleev ordinava gli elementi?": "Per massa atomica crescente",
    "Con quale criterio è ordinata la tavola periodica moderna?": "Per numero atomico crescente",
    "In che anno Mendeleev presentò la sua tavola periodica?": "1869",
    "Chi scoprì che gli elementi vanno ordinati per numero atomico?": "Moseley",
    "Chi osservò per primo le triadi di elementi simili?": "Döbereiner",
    "Quale elemento era l'eka-silicio previsto da Mendeleev?": "Il germanio",
    "Quale elemento era l'eka-alluminio previsto da Mendeleev?": "Il gallio",
    "Quale elemento era l'eka-boro previsto da Mendeleev?": "Lo scandio",
    "Che cosa sono i gruppi della tavola periodica?": "Le colonne",
    "Che cosa sono i periodi della tavola periodica?": "Le righe",
    "Perché Mendeleev lasciò delle caselle vuote nella sua tavola?": "Per elementi non ancora scoperti",
    "Perché Mendeleev mise il tellurio prima dello iodio, anche se è più pesante?": "Lo iodio somiglia al cloro",
    "Come si chiamano gli elementi del gruppo 18?": "Gas nobili",
    "Come si chiamano gli elementi del gruppo 17?": "Alogeni",
    "Come si chiamano gli elementi del gruppo 1, tranne l'idrogeno?": "Metalli alcalini",
    "Come si chiamano gli elementi del gruppo 2?": "Metalli alcalino-terrosi",
    "Quanti gruppi ha la tavola periodica moderna?": "18",
    "Quanti periodi ha la tavola periodica moderna?": "7",
}

# name -> (symbol, Z, mass with two decimals, group)
EL = {
    "litio": ("Li", 3, "6.94", 1), "sodio": ("Na", 11, "22.99", 1), "potassio": ("K", 19, "39.10", 1), "rubidio": ("Rb", 37, "85.47", 1), "cesio": ("Cs", 55, "132.91", 1),
    "berillio": ("Be", 4, "9.01", 2), "magnesio": ("Mg", 12, "24.31", 2), "calcio": ("Ca", 20, "40.08", 2), "stronzio": ("Sr", 38, "87.62", 2), "bario": ("Ba", 56, "137.33", 2),
    "boro": ("B", 5, "10.81", 13), "alluminio": ("Al", 13, "26.98", 13), "gallio": ("Ga", 31, "69.72", 13), "indio": ("In", 49, "114.82", 13),
    "carbonio": ("C", 6, "12.01", 14), "silicio": ("Si", 14, "28.09", 14), "germanio": ("Ge", 32, "72.63", 14), "stagno": ("Sn", 50, "118.71", 14),
    "azoto": ("N", 7, "14.01", 15), "fosforo": ("P", 15, "30.97", 15), "arsenico": ("As", 33, "74.92", 15), "antimonio": ("Sb", 51, "121.76", 15),
    "ossigeno": ("O", 8, "16.00", 16), "zolfo": ("S", 16, "32.07", 16), "selenio": ("Se", 34, "78.97", 16), "tellurio": ("Te", 52, "127.60", 16),
    "fluoro": ("F", 9, "19.00", 17), "cloro": ("Cl", 17, "35.45", 17), "bromo": ("Br", 35, "79.90", 17), "iodio": ("I", 53, "126.90", 17),
    "neon": ("Ne", 10, "20.18", 18), "argon": ("Ar", 18, "39.95", 18), "kripton": ("Kr", 36, "83.80", 18), "xeno": ("Xe", 54, "131.29", 18),
    "ferro": ("Fe", 26, "55.85", 8), "cobalto": ("Co", 27, "58.93", 9), "nichel": ("Ni", 28, "58.69", 10), "rame": ("Cu", 29, "63.55", 11), "zinco": ("Zn", 30, "65.38", 12),
}
BY_SYMBOL = {v[0]: k for k, v in EL.items()}
# the usual valence towards O, Cl, H, S, Na, Mg of each group (lesson 43's examples and the first two years)
VALENCE = {1: 1, 2: 2, 13: 3, 14: 4, 15: 3, 16: 2, 17: 1}
PARTNER_VALENCE = {"O": 2, "Cl": 1, "H": 1, "S": 2, "Na": 1, "Mg": 2}
PARTNERS = {"con l'ossigeno": "O", "con il cloro": "Cl", "con l'idrogeno": "H", "con lo zolfo": "S", "con il sodio": "Na", "con il magnesio": "Mg"}


def art(name):
    if name == "iodio" or re.match(r"(z|x|s[^aeiou])", name):
        return "lo " + name
    if name[0] in "aeiou":
        return "l'" + name
    return "il " + name


def cap(s):
    return s[0].upper() + s[1:]


def dec(s):
    return Rational(s.replace("{,}", "."))


def mass_text(name):
    return EL[name][2].replace(".", "{,}")


def level1(sample, prose, errs):
    if prose not in KEY:
        errs.append(f"level 1 question not in the key: {prose!r}")
        return None
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) == KEY[prose], errs)
    return "fatto"


def level2(sample, prose, errs):
    m = re.fullmatch(
        r"Immagina di non conoscere (.+)\. Nella tavola periodica, sopra la sua casella c'è (.+), con massa atomica \$(\d+\{,\}\d\d)\$, e sotto (.+), con massa atomica \$(\d+\{,\}\d\d)\$\. Quale massa atomica stimi per l'elemento che manca, con la media dei due\?",
        prose,
    )
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    names = [re.sub(r"^(il |lo |l')", "", x) for x in (m.group(1), m.group(2), m.group(4))]
    if [art(n) for n in names] != [m.group(1), m.group(2), m.group(4)]:
        errs.append("articles")
    mid, up, down = (EL[n] for n in names)
    if not (mid[3] == up[3] == down[3] and up[1] < mid[1] < down[1]):
        errs.append("the three elements are not one above the other in a group")
    if m.group(3) != mass_text(names[1]) or m.group(5) != mass_text(names[2]):
        errs.append("masses are not the real ones")
    mean = (dec(m.group(3)) + dec(m.group(5))) / 2
    real = Rational(mid[2])
    if abs(mean - real) / real > Rational(3, 100):
        errs.append("the triad does not work: mean more than 3% away")
    y = mean * 10
    if abs(y - floor(y) - Rational(1, 2)) < Rational(1, 10**9):
        errs.append("tie")
        return None
    k = int(floor(y + Rational(1, 2)))
    want = f"{k // 10}{{,}}{k % 10}"
    check_choice(sample["answer"], lambda o: o["latex"] == want, errs)
    return "triade"


def level3(sample, prose, errs):
    if prose == "In quale coppia di elementi, uno dopo l'altro nella tavola periodica, il primo ha massa atomica maggiore del secondo?":
        _, extra = prose_and_extra(sample["problem"])
        if len(extra) != 1:
            errs.append("table missing")
            return None
        rows = re.findall(r"(\d+) & \\mathrm\{([A-Z][a-z]?)\} & (\d+\{,\}\d\d)", extra[0])
        table = {}
        for z, s, ms in rows:
            name = BY_SYMBOL[s]
            if EL[name][1] != int(z) or EL[name][2].replace(".", "{,}") != ms:
                errs.append(f"row {s} wrong")
            table[int(z)] = (name, dec(ms))

        def inverted(o):
            mm = re.fullmatch(r"(\w+) e (\w+)", option_text(o["latex"]))
            a, b = mm.group(1).lower(), mm.group(2)
            za, zb = EL[a][1], EL[b][1]
            if zb != za + 1 or za not in table or zb not in table:
                raise ValueError(f"option {o['latex']!r} is not a pair of the table")
            return table[za][1] > table[zb][1]

        check_choice(sample["answer"], inverted, errs)
        return "coppia"
    m = re.fullmatch(
        r"(.+) ha numero atomico \$(\d+)\$ e massa atomica \$(\d+\{,\}\d\d)\$; (.+) ha numero atomico \$(\d+)\$ e massa atomica \$(\d+\{,\}\d\d)\$\. Quale dei due viene prima nella tavola periodica moderna\?",
        prose,
    )
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    pairs = []
    for name_art, z, ms in ((m.group(1), m.group(2), m.group(3)), (m.group(4), m.group(5), m.group(6))):
        name = re.sub(r"^(il |lo |l')", "", name_art.lower())
        if EL[name][1] != int(z) or mass_text(name) != ms:
            errs.append(f"data of {name} wrong")
        pairs.append((int(z), name))
    if abs(pairs[0][0] - pairs[1][0]) != 1:
        errs.append("not consecutive")
    first = min(pairs)[1]
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) == cap(art(first)), errs)
    return "ordine"


def parse_formula(tex):
    """\\mathrm{Na_2O} -> [('Na', 2), ('O', 1)]."""
    m = re.fullmatch(r"\\mathrm\{((?:[A-Z][a-z]?(?:_\d)?)+)\}", tex)
    if not m:
        raise ValueError(f"not a formula: {tex!r}")
    return [(s, int(k) if k else 1) for s, k in re.findall(r"([A-Z][a-z]?)(?:_(\d))?", m.group(1))]


def expected(name, partner):
    """The formula of the element's compound with the partner, from the valences: symbols and counts."""
    sym, _, _, g = EL[name]
    v, w = VALENCE[g], PARTNER_VALENCE[partner]
    from math import gcd

    l = v * w // gcd(v, w)
    return {sym: l // v, partner: l // w}


def level4(sample, prose, errs):
    m = re.fullmatch(r"(.+) forma (con \S+ ?\S*) il composto \$(.+)\$\. (.+) sta nello stesso gruppo\. Che formula ha il composto (?:del |dello |dell')(\w+) (con \S+ ?\S*)\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    a = re.sub(r"^(il |lo |l')", "", m.group(1).lower())
    b = re.sub(r"^(il |lo |l')", "", m.group(4).lower())
    if b != m.group(5) or m.group(2) != m.group(6) or m.group(2) not in PARTNERS:
        errs.append("names or partner do not match")
        return None
    partner = PARTNERS[m.group(2)]
    if EL[a][3] != EL[b][3] or a == b:
        errs.append("not two elements of the same group")
    known = dict(parse_formula(m.group(3)))
    if known != expected(a, partner):
        errs.append(f"the known formula {m.group(3)} is not the real one")
    want = expected(b, partner)

    def right(o):
        return dict(parse_formula(o["latex"])) == want

    for o in sample["answer"]["options"]:
        if set(dict(parse_formula(o["latex"]))) != {EL[b][0], partner}:
            errs.append(f"option {o['latex']!r} with other elements")
    check_choice(sample["answer"], right, errs)
    return partner


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    prose, extra = prose_and_extra(sample["problem"])
    if extra and lvl != 3:
        errs.append(f"unexpected lines {extra}")
    try:
        kind = LEVELS[lvl](sample, prose, errs)
    except (ValueError, KeyError, TypeError, AttributeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
