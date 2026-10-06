"""What the checkers of the four generators of chemistry, third year, group I share (numero-ossidazione, chim-ossidi,
chim-idruri-idracidi, chim-idrossidi). Written from the specs (specs/exercises/<id>.md) and from lessons 76-79, not
from the generators: formulas are read from the LaTeX of the sample, oxidation numbers are found again with the rules
of lesson 76 in their order of precedence, and names are built again from tables typed here.
"""
import re
from math import gcd

from sympy import Rational

from checkers._fis_grandezze import check_choice, option_text, prose_and_extra  # noqa: F401 (re-exported)

BANNED = re.compile(r"—|piuttosto che")

NAMES = {
    "H": "idrogeno", "Li": "litio", "B": "boro", "C": "carbonio", "N": "azoto", "O": "ossigeno", "F": "fluoro", "Na": "sodio", "Mg": "magnesio",
    "Al": "alluminio", "Si": "silicio", "P": "fosforo", "S": "zolfo", "Cl": "cloro", "K": "potassio", "Ca": "calcio", "Cr": "cromo", "Mn": "manganese",
    "Fe": "ferro", "Co": "cobalto", "Ni": "nichel", "Cu": "rame", "Zn": "zinco", "As": "arsenico", "Se": "selenio", "Br": "bromo", "Ag": "argento",
    "Sn": "stagno", "I": "iodio", "Ba": "bario", "Au": "oro", "Pb": "piombo",
}
BY_NAME = {v: k for k, v in NAMES.items()}
METAL_SET = {"Li", "Na", "K", "Ag", "Mg", "Ca", "Ba", "Zn", "Al", "Fe", "Cu", "Sn", "Pb", "Co", "Ni", "Cr", "Mn", "Au"}
GROUP = {"Li": 1, "Na": 1, "K": 1, "Mg": 2, "Ca": 2, "Ba": 2, "B": 13, "Al": 13, "C": 14, "Si": 14, "N": 15, "P": 15, "As": 15, "O": 16, "S": 16, "Se": 16, "F": 17, "Cl": 17, "Br": 17, "I": 17}


def il(name):
    if name == "iodio" or re.match(r"(z|s[^aeiou])", name):
        return "lo " + name
    if name[0] in "aeiou":
        return "l'" + name
    return "il " + name


def del_(name):
    a = il(name)
    return a.replace("il ", "del ", 1) if a.startswith("il ") else a.replace("lo ", "dello ", 1) if a.startswith("lo ") else "dell'" + a[2:]


def element_after(article_and_name, kind="del"):
    """'dello zolfo' -> 'S', checking the article; kind 'del' or 'il'."""
    name = re.sub(r"^(del |dello |dell'|il |lo |l')", "", article_and_name)
    if name not in BY_NAME:
        raise ValueError(f"unknown element {article_and_name!r}")
    want = del_(name) if kind == "del" else il(name)
    if want != article_and_name:
        raise ValueError(f"article: {article_and_name!r}, expected {want!r}")
    return BY_NAME[name]


def signed(n):
    return f"+{n}" if n > 0 else str(n)


# ---------------------------------------------------------------------------
# Formulas


def parse_formula(tex):
    """\\mathrm{Ca_3(PO_4)_2} -> ([('Ca', 3), ('P', 2), ('O', 8)], 0, 'Ca3(PO4)2'); \\mathrm{SO_4^{2-}} -> (..., -2, 'SO4')."""
    m = re.fullmatch(r"\\mathrm\{(.*)\}", tex.strip())
    if not m:
        raise ValueError(f"not a formula: {tex!r}")
    body = m.group(1)
    charge = 0
    c = re.search(r"\^\{(\d*)([+-])\}$", body)
    if c:
        charge = int(c.group(1) or 1) * (1 if c.group(2) == "+" else -1)
        body = body[: c.start()]
    atoms = []

    def add(sym, n):
        for i, (s, k) in enumerate(atoms):
            if s == sym:
                atoms[i] = (s, k + n)
                return
        atoms.append((sym, n))

    key = ""
    pos = 0
    token = re.compile(r"([A-Z][a-z]?)(?:_(\d)|_\{(\d+)\})?|\(((?:[A-Z][a-z]?(?:_\d)?)+)\)(?:_(\d))?")
    while pos < len(body):
        t = token.match(body, pos)
        if not t:
            raise ValueError(f"cannot read {tex!r} at {body[pos:]!r}")
        if t.group(1):
            n = int(t.group(2) or t.group(3) or 1)
            add(t.group(1), n)
            key += t.group(1) + (str(n) if n != 1 else "")
        else:
            k = int(t.group(5) or 1)
            inner, _, ikey = parse_formula("\\mathrm{" + t.group(4) + "}")
            for s, n in inner:
                add(s, n * k)
            key += "(" + ikey + ")" + (str(k) if k != 1 else "")
        pos = t.end()
    return atoms, charge, key


def formulas_in(text):
    return re.findall(r"\$(\\mathrm\{[^$]*\})\$", text)


# ---------------------------------------------------------------------------
# Oxidation numbers: the rules of lesson 76, in their order of precedence

RULES = [  # (order, symbols, value)
    (4, {"F"}, -1),
    (5, {"Li", "Na", "K", "Ag"}, 1),
    (5, {"Mg", "Ca", "Ba", "Zn"}, 2),
    (5, {"Al"}, 3),
    (6, {"H"}, 1),
    (7, {"O"}, -2),
    (8, {"Cl", "Br", "I"}, -1),
]


def rule(sym):
    for order, syms, value in RULES:
        if sym in syms:
            return order, value
    return None


def solve(atoms, charge):
    """Every element takes the value of its rule, except the one whose rule comes last (or that has none), found from
    the sum. Returns ({symbol: number}, the symbol found from the sum)."""
    if len(atoms) == 1:
        sym, n = atoms[0]
        return {sym: Rational(charge, n)}, sym
    ranked = sorted(atoms, key=lambda a: rule(a[0])[0] if rule(a[0]) else 99)
    if sum(1 for s, _ in atoms if rule(s) is None) > 1:
        raise ValueError("two elements without a rule")
    last, n_last = ranked[-1]
    values, total = {}, 0
    for s, n in ranked[:-1]:
        values[s] = rule(s)[1]
        total += values[s] * n
    values[last] = Rational(charge - total, n_last)
    return values, last


# ---------------------------------------------------------------------------
# Samples


def common(sample, errs):
    if not sample.get("steps"):
        errs.append("no steps")
    text = sample.get("prompt", "") + sample["problem"] + " ".join(sample["steps"]) + sample.get("solution", "")
    if BANNED.search(text):
        errs.append("forbidden words")


def check_number(sample, expected, errs):
    """The answer is the whole number `expected`; three wrong numbers in params; the choice has it once, written with its sign."""
    if Rational(expected).q != 1:
        errs.append(f"the oxidation number {expected} is not whole")
        return
    expected = int(expected)
    ans = sample.get("answer", {})
    if ans.get("kind") != "number" or not re.fullmatch(r"-?\d+", str(ans.get("value", ""))):
        errs.append(f"answer is not a whole number: {ans}")
        return
    if int(ans["value"]) != expected:
        errs.append(f"answer {ans['value']}, expected {expected}")
    if sample.get("solution") != signed(expected):
        errs.append(f"solution {sample.get('solution')!r}, expected {signed(expected)!r}")
    wrong = sample.get("params", {}).get("wrong")
    if not isinstance(wrong, list) or len(wrong) != 3 or len({expected, *wrong}) != 4:
        errs.append(f"wrong answers {wrong}")
    ch = sample.get("choice")
    if ch is None:
        errs.append("no multiple choice")
        return
    for o in ch.get("options", []):
        if not re.fullmatch(r"[+-]\d+|0", o["latex"]) or o["values"] != [str(int(o["latex"]))]:
            errs.append(f"option {o} badly written")
    check_choice(ch, lambda o: int(o["values"][0]) == expected, errs)


def choice_of(sample, errs):
    ans = sample.get("answer", {})
    if ans.get("kind") != "choice":
        errs.append("answer is not a choice")
        return None
    if "choice" in sample and sample["choice"] != ans:
        errs.append("the choice differs from the answer")
    return ans


def check_name_options(ch, right_name, valid_names, errs):
    """Text options: exactly one is the right name, and no other is a right name of the compound in another nomenclature."""
    for o in ch.get("options", []):
        text = option_text(o["latex"])
        if text != right_name and text in valid_names:
            errs.append(f"option {text!r} is another right name of the compound")
    check_choice(ch, lambda o: option_text(o["latex"]) == right_name, errs)


def check_formula_options(ch, right_key, errs):
    """Formula options: exactly one is the right formula; no wrong one has the same atoms written another way."""
    right_atoms = None
    seen = []
    for o in ch.get("options", []):
        atoms, charge, key = parse_formula(o["latex"])
        if o["values"] != [key]:
            errs.append(f"option {o['latex']!r} has value {o['values']}")
        seen.append((key, dict(atoms)))
        if key == right_key:
            right_atoms = dict(atoms)
    if right_atoms is None:
        errs.append(f"the right formula {right_key} is not among the options")
        return
    for key, atoms in seen:
        if key != right_key and atoms == right_atoms:
            errs.append(f"option {key} has the same atoms as {right_key}")
    check_choice(ch, lambda o: parse_formula(o["latex"])[2] == right_key, errs)


# ---------------------------------------------------------------------------
# Names: the tables of lessons 76-79

ROMAN = {1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII"}
PRE = {1: "", 2: "di", 3: "tri", 4: "tetra", 5: "penta", 6: "esa", 7: "epta"}

# symbol -> (oxidation numbers, root of the adjectives or None)
METALS = {
    "Li": ([1], None), "Na": ([1], None), "K": ([1], None), "Ag": ([1], None), "Mg": ([2], None), "Ca": ([2], None), "Ba": ([2], None), "Zn": ([2], None), "Al": ([3], None),
    "Fe": ([2, 3], "ferr"), "Cu": ([1, 2], "rame"), "Sn": ([2, 4], "stann"), "Pb": ([2, 4], "piomb"), "Co": ([2, 3], "cobalt"), "Ni": ([2, 3], "nichel"),
    "Cr": ([2, 3], "crom"), "Mn": ([2, 3], "mangan"), "Au": ([1, 3], "aur"),
}
# symbol -> (oxidation numbers with an anhydride, root, halogen, Roman numeral in the Stock name)
NON_METALS = {
    "B": ([3], "bor", False, False), "C": ([4], "carbon", False, True), "Si": ([4], "silic", False, False), "N": ([3, 5], "nitr", False, True), "P": ([3, 5], "fosfor", False, True),
    "S": ([4, 6], "solfor", False, True), "Cl": ([1, 3, 5, 7], "clor", True, True), "Br": ([1, 5], "brom", True, True), "I": ([1, 5, 7], "iod", True, True),
}
HALOGEN_NAMES = {1: ("ipo", "osa"), 3: ("", "osa"), 5: ("", "ica"), 7: ("per", "ica")}


def cross(p, q):
    g = gcd(p, q)
    return q // g, p // g


def sub(sym, n):
    return sym + (str(n) if n != 1 else "")


def metal_words(sym, n):
    """('di sodio', 'di sodio') or ('ferrico', 'di ferro(III)'): the traditional and the Stock ending."""
    ox, root = METALS[sym]
    name = NAMES[sym]
    if len(ox) == 1:
        return "di " + name, "di " + name
    return root + ("oso" if n == min(ox) else "ico"), f"di {name}({ROMAN[n]})"


def basic_oxide(sym, n):
    a, b = cross(n, 2)
    trad, stock = metal_words(sym, n)
    mono = a == 1 and b == 1 and len(METALS[sym][0]) > 1
    return {"key": sub(sym, a) + sub("O", b), "trad": "ossido " + trad, "stock": "ossido " + stock, "iupac": ("mon" if mono else PRE[b]) + "ossido di " + PRE[a] + NAMES[sym], "sym": sym, "n": n, "classe": "basico"}


def anhydride(sym, n):
    ox, root, halogen, roman = NON_METALS[sym]
    a, b = cross(n, 2)
    if halogen:
        pre, suf = HALOGEN_NAMES[n]
        adj = pre + root + suf
    elif len(ox) == 1:
        adj = root + "ica"
    else:
        adj = root + ("osa" if n == min(ox) else "ica")
    stock = f"ossido di {NAMES[sym]}" + (f"({ROMAN[n]})" if roman else "")
    return {"key": sub(sym, a) + sub("O", b), "trad": "anidride " + adj, "stock": stock, "iupac": PRE[b] + "ossido di " + PRE[a] + NAMES[sym], "sym": sym, "n": n, "classe": "acido"}


def hydroxide(sym, n):
    trad, stock = metal_words(sym, n)
    return {"key": sym + ("OH" if n == 1 else f"(OH){n}"), "trad": "idrossido " + trad, "stock": "idrossido " + stock, "iupac": PRE[n] + "idrossido di " + NAMES[sym], "sym": sym, "n": n, "classe": "idrossido"}


def metal_hydride(sym):
    n = METALS[sym][0][0]
    return {"key": sym + sub("H", n), "trad": "idruro di " + NAMES[sym], "stock": "idruro di " + NAMES[sym], "iupac": PRE[n] + "idruro di " + NAMES[sym], "sym": sym, "n": n, "classe": "metallico"}


BASIC_OXIDES = [basic_oxide(s, n) for s, (ox, _) in METALS.items() for n in ox]
ANHYDRIDES = [anhydride(s, n) for s, v in NON_METALS.items() for n in v[0]]
HYDROXIDES = [hydroxide(s, n) for s, (ox, _) in METALS.items() for n in ox]
METAL_HYDRIDES = [metal_hydride(s) for s in ("Li", "Na", "K", "Mg", "Ca", "Ba", "Al")]
COVALENT_HYDRIDES = [
    {"key": "CH4", "trad": "metano", "stock": "idruro di carbonio", "iupac": "tetraidruro di carbonio", "sym": "C", "classe": "covalente"},
    {"key": "SiH4", "trad": "silano", "stock": "idruro di silicio", "iupac": "tetraidruro di silicio", "sym": "Si", "classe": "covalente"},
    {"key": "NH3", "trad": "ammoniaca", "stock": "idruro di azoto", "iupac": "triidruro di azoto", "sym": "N", "classe": "covalente"},
    {"key": "PH3", "trad": "fosfina", "stock": "idruro di fosforo", "iupac": "triidruro di fosforo", "sym": "P", "classe": "covalente"},
    {"key": "AsH3", "trad": "arsina", "stock": "idruro di arsenico", "iupac": "triidruro di arsenico", "sym": "As", "classe": "covalente"},
]
HYDRACIDS = [
    {"key": "HF", "trad": "acido fluoridrico", "stock": "fluoruro di idrogeno", "iupac": "fluoruro di idrogeno", "sym": "F", "classe": "idracido"},
    {"key": "HCl", "trad": "acido cloridrico", "stock": "cloruro di idrogeno", "iupac": "cloruro di idrogeno", "sym": "Cl", "classe": "idracido"},
    {"key": "HBr", "trad": "acido bromidrico", "stock": "bromuro di idrogeno", "iupac": "bromuro di idrogeno", "sym": "Br", "classe": "idracido"},
    {"key": "HI", "trad": "acido iodidrico", "stock": "ioduro di idrogeno", "iupac": "ioduro di idrogeno", "sym": "I", "classe": "idracido"},
    {"key": "H2S", "trad": "acido solfidrico", "stock": "solfuro di idrogeno", "iupac": "solfuro di diidrogeno", "sym": "S", "classe": "idracido"},
]
PEROXIDES = {"H2O2": "idrogeno", "Na2O2": "sodio", "K2O2": "potassio", "BaO2": "bario", "CaO2": "calcio"}


def by_key(table):
    return {c["key"]: c for c in table}


def names_of(c):
    return {c["trad"], c["stock"], c["iupac"]}


def find_by_name(table, name):
    """The compounds of a table that have this name in some nomenclature: there must be exactly one formula."""
    found = {c["key"] for c in table if name in names_of(c)}
    if len(found) != 1:
        raise ValueError(f"the name {name!r} gives {sorted(found)}")
    return by_key(table)[found.pop()]


ASK = [
    (re.compile(r"Qual è il nome tradizionale di \$(\\mathrm\{[^$]*\})\$\?"), "trad"),
    (re.compile(r"Qual è il nome di \$(\\mathrm\{[^$]*\})\$ nella notazione di Stock\?"), "stock"),
    (re.compile(r"Qual è il nome IUPAC di \$(\\mathrm\{[^$]*\})\$\?"), "iupac"),
]
ASK_FORMULA = re.compile(r"Qual è la formula del composto che ha questo nome: (.+)\?")


def read_name_question(prose):
    """(which, formula key) of a question from the formula to the name, or None."""
    for pattern, which in ASK:
        m = pattern.fullmatch(prose)
        if m:
            return which, parse_formula(m.group(1))[2]
    return None


def check_name_question(sample, prose, table, errs):
    """From the formula to the name: the compound is in the table, the right option is its name in the nomenclature
    asked, no other option is another right name of it. Returns the nomenclature asked."""
    q = read_name_question(prose)
    if not q:
        errs.append(f"text not recognised: {prose!r}")
        return None
    which, key = q
    comp = by_key(table).get(key)
    if comp is None:
        errs.append(f"{key} is not a compound of this level")
        return None
    if which == "iupac" and comp["iupac"] == comp["trad"]:
        errs.append("the IUPAC name is the traditional one: the question does not tell them apart")
    if which == "stock" and comp["stock"] == comp["trad"]:
        errs.append("the Stock name is the traditional one: the question does not tell them apart")
    ch = choice_of(sample, errs)
    if ch:
        check_name_options(ch, comp[which], names_of(comp), errs)
    if sample.get("solution") != "\\text{" + comp[which] + "}":
        errs.append("solution is not the right name")
    return which


def check_formula_question(sample, prose, table, errs):
    """From a name to the formula: the name gives one compound of the table, and the right option is its formula."""
    m = ASK_FORMULA.fullmatch(prose)
    if not m:
        errs.append(f"text not recognised: {prose!r}")
        return None
    comp = find_by_name(table, m.group(1))
    ch = choice_of(sample, errs)
    if ch:
        check_formula_options(ch, comp["key"], errs)
    if parse_formula(sample.get("solution", ""))[2] != comp["key"]:
        errs.append("solution is not the right formula")
    name = m.group(1)
    return "iupac" if name == comp["iupac"] and name != comp["trad"] else "stock" if name == comp["stock"] and name != comp["trad"] else "trad"
