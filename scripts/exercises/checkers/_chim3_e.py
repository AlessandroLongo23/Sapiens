"""Shared helpers for the checkers of the chemistry chapter on bonds (third year, group E: chim-regola-ottetto,
legame-covalente, chim-legame-covalente-polare).

Written from the lessons 62-64 (docs/lezioni/chimica/riscritte/) and from the specs, not from the generators: the
tables of the elements, of the bond lengths and energies and of the noble gases are typed again here. A sample is a
multiple choice, or a whole number: then `answer` is the number, `params.options` lists it first with three wrong
ones, and `choice` (built by toChoice) is the multiple choice made of those four.
"""
import re

from sympy import Rational

from checkers._fis_grandezze import BANNED, check_choice

# name -> (symbol, Z, group, Pauling electronegativity with two decimals, metal)
EL = {
    "idrogeno": ("H", 1, 1, "2.20", False),
    "litio": ("Li", 3, 1, "0.98", True),
    "berillio": ("Be", 4, 2, "1.57", True),
    "carbonio": ("C", 6, 14, "2.55", False),
    "azoto": ("N", 7, 15, "3.04", False),
    "ossigeno": ("O", 8, 16, "3.44", False),
    "fluoro": ("F", 9, 17, "3.98", False),
    "sodio": ("Na", 11, 1, "0.93", True),
    "magnesio": ("Mg", 12, 2, "1.31", True),
    "alluminio": ("Al", 13, 13, "1.61", True),
    "silicio": ("Si", 14, 14, "1.90", False),
    "fosforo": ("P", 15, 15, "2.19", False),
    "zolfo": ("S", 16, 16, "2.58", False),
    "cloro": ("Cl", 17, 17, "3.16", False),
    "potassio": ("K", 19, 1, "0.82", True),
    "calcio": ("Ca", 20, 2, "1.00", True),
    "selenio": ("Se", 34, 16, "2.55", False),
    "bromo": ("Br", 35, 17, "2.96", False),
    "rubidio": ("Rb", 37, 1, "0.82", True),
    "stronzio": ("Sr", 38, 2, "0.95", True),
    "iodio": ("I", 53, 17, "2.66", False),
}
BY_SYMBOL = {v[0]: k for k, v in EL.items()}
NOBLE = {"elio": 2, "neon": 10, "argon": 18, "kripton": 36, "xeno": 54}

# (a, b, order) -> (length in pm, energy in kJ/mol): the tables of lessons 62 and 63
BONDS = {
    ("H", "H", 1): (74, 436), ("F", "F", 1): (141, 159), ("Cl", "Cl", 1): (199, 243), ("Br", "Br", 1): (228, 193), ("I", "I", 1): (267, 151),
    ("H", "F", 1): (92, 567), ("H", "Cl", 1): (127, 431), ("H", "Br", 1): (141, 366), ("H", "I", 1): (161, 298),
    ("C", "C", 1): (154, 348), ("C", "C", 2): (134, 614), ("C", "C", 3): (120, 839),
    ("N", "N", 1): (145, 163), ("N", "N", 2): (125, 418), ("N", "N", 3): (110, 945),
}
DASH = {1: "{-}", 2: "{=}", 3: "{\\equiv}"}
ORDER = {"singolo": 1, "doppio": 2, "triplo": 3}


def bond_tex(a, b, order=1):
    return "\\mathrm{" + a + DASH[order] + b + "}"


def parse_bond(tex):
    """\\mathrm{H{-}Cl} -> ('H', 'Cl', 1)."""
    m = re.fullmatch(r"\\mathrm\{([A-Z][a-z]?)\{(-|=|\\equiv)\}([A-Z][a-z]?)\}", tex.strip())
    if not m:
        raise ValueError(f"not a bond: {tex!r}")
    return m.group(1), m.group(3), {"-": 1, "=": 2, "\\equiv": 3}[m.group(2)]


def art(name):
    if name == "iodio" or re.match(r"(z|x|s[^aeiou])", name):
        return "lo " + name
    if name[0] in "aeiou":
        return "l'" + name
    return "il " + name


def unart(text):
    """'Lo zolfo' -> 'zolfo', checking the article."""
    name = re.sub(r"^(il |lo |l')", "", text.lower())
    if art(name) != text.lower():
        raise ValueError(f"wrong article in {text!r}")
    return name


def unprep(text, il, lo, l):
    """'dello zolfo' -> 'zolfo' for (del, dello, dell'); 'Sul cloro' -> 'cloro' for (sul, sullo, sull')."""
    low = text.lower()
    for prefix, a in ((lo + " ", "lo "), (l, "l'"), (il + " ", "il ")):
        if low.startswith(prefix):
            name = low[len(prefix):]
            if art(name) != a + name:
                raise ValueError(f"wrong preposition in {text!r}")
            return name
    raise ValueError(f"no preposition in {text!r}")


def valence(name):
    g = EL[name][2]
    return g if g <= 2 else g - 10


def chi(name):
    return Rational(EL[name][3])


def dec2(r):
    """A rational with two decimals as the lessons write it: 0{,}96, -0{,}08."""
    r = Rational(r)
    k = r * 100
    if k.q != 1:
        raise ValueError(f"{r} has more than two decimals")
    k = int(k)
    return ("-" if k < 0 else "") + f"{abs(k) // 100}{{,}}{abs(k) % 100:02d}"


def parse_dec2(s):
    m = re.fullmatch(r"(-?)(\d+)\{,\}(\d\d)", s.strip())
    if not m:
        raise ValueError(f"not a number with two decimals: {s!r}")
    v = Rational(int(m.group(2) + m.group(3)), 100)
    return -v if m.group(1) else v


def parse_formula(tex):
    """\\mathrm{C_2H_4} -> [('C', 2), ('H', 4)]."""
    m = re.fullmatch(r"\\mathrm\{((?:[A-Z][a-z]?(?:_\d)?)+)\}", tex.strip())
    if not m:
        raise ValueError(f"not a formula: {tex!r}")
    return [(s, int(k) if k else 1) for s, k in re.findall(r"([A-Z][a-z]?)(?:_(\d))?", m.group(1))]


def mixed(latex):
    """An option made of words and formulas, \\text{Cede }539\\,\\text{kJ}, as plain text with the formulas between
    dollars: 'Cede $539\\,\\text{kJ}$'. Units inside a formula (\\,\\text{kJ}) stay in the formula."""
    out, i, s = "", 0, latex.strip()
    math = ""
    while i < len(s):
        if s.startswith("\\text{", i) and not math.endswith("\\,"):
            j = s.index("}", i)
            if math:
                out += "$" + math + "$"
                math = ""
            out += s[i + 6 : j]
            i = j + 1
        elif s.startswith("\\text{", i):
            j = s.index("}", i)
            math += s[i : j + 1]
            i = j + 1
        else:
            math += s[i]
            i += 1
    if math:
        out += "$" + math + "$"
    return out


def common(sample, errs):
    if not sample.get("steps"):
        errs.append("no steps")
    text = sample["problem"] + " ".join(sample["steps"]) + sample.get("solution", "")
    if BANNED.search(text):
        errs.append("forbidden words")
    if sample.get("answer", {}).get("kind") not in ("choice", "number"):
        errs.append("answer is neither a choice nor a number")


def choice_answer(sample, is_right, errs):
    """A level that is a multiple choice: four options, one right, `correct` on it."""
    a = sample["answer"]
    if a.get("kind") != "choice":
        errs.append(f"answer.kind is {a.get('kind')}, expected choice")
        return
    check_choice(a, is_right, errs)


def number_answer(sample, expected, errs):
    """A level that asks for a whole number: the answer, the four numbers of params.options, and the choice."""
    a = sample["answer"]
    want = str(int(expected))
    if a.get("kind") != "number":
        errs.append(f"answer.kind is {a.get('kind')}, expected number")
        return
    if a.get("value") != want:
        errs.append(f"answer {a.get('value')!r}, expected {want}")
    if sample.get("solution") != want:
        errs.append(f"solution {sample.get('solution')!r}, expected {want}")
    opts = sample["params"].get("options")
    if not isinstance(opts, list) or len(opts) != 4 or len(set(opts)) != 4 or not all(isinstance(o, str) and re.fullmatch(r"\d+", o) for o in opts):
        errs.append(f"params.options must be four different whole numbers: {opts!r}")
        return
    if opts[0] != want:
        errs.append(f"params.options[0] is {opts[0]!r}, expected {want}")
    ch = sample.get("choice")
    if ch is not None:
        if sorted(o["latex"] for o in ch.get("options", [])) != sorted(opts):
            errs.append("choice options are not the four numbers of params.options")
        check_choice(ch, lambda o: o["latex"] == want and o["values"] == [want], errs)
