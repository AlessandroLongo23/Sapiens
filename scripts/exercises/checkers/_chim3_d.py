"""Shared helpers for the checkers of the chemistry chapter on the periodic properties (third year, group D:
proprieta-periodiche, chim-affinita-elettronegativita, chim-metalli-non-metalli).

The elements' data are read from the site's periodic table (src/lib/tools/elementi.json), the same file the lessons
59-61 take their numbers from. What that file does not have is typed here from the lessons, not from the generators:
electron affinities, ionic radii, successive ionisation energies. The rules (which way a property goes along a period
and down a group, which ion a group forms) are written here from the lessons.
"""
import json
import os
import re

from sympy import Rational

from checkers._fis_grandezze import BANNED, check_choice

_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..")
with open(os.path.join(_ROOT, "src", "lib", "tools", "elementi.json"), encoding="utf-8") as _f:
    ELEMENTS = json.load(_f)

BY_SYMBOL = {e["symbol"]: e for e in ELEMENTS}
BY_NAME = {e["name"].lower(): e for e in ELEMENTS}

# lesson 60, the table of the second and third period and the text (kJ/mol released; None: the anion is not stable)
AFFINITY = {
    "H": 73, "Li": 60, "Be": None, "B": 27, "C": 122, "N": None, "O": 141, "F": 328, "Ne": None,
    "Na": 53, "Mg": None, "Al": 42, "Si": 134, "P": 72, "S": 200, "Cl": 349, "Ar": None, "K": 48, "Br": 325, "I": 295,
}
# lesson 59, the table of the ions: symbol -> (charge, radius in pm)
IONS = {
    "Li": (1, 76), "Na": (1, 102), "K": (1, 138), "Mg": (2, 72), "Ca": (2, 100), "Al": (3, 54),
    "O": (-2, 140), "S": (-2, 184), "F": (-1, 133), "Cl": (-1, 181), "Br": (-1, 196),
}
# successive ionisation energies, kJ/mol (lesson 59 for Na, Mg, Al; handbook values for the others)
SUCCESSIVE = {
    "Li": [520, 7298, 11815], "Be": [900, 1757, 14849, 21007], "B": [801, 2427, 3660, 25026],
    "C": [1086, 2353, 4621, 6223, 37831], "Na": [496, 4562, 6910, 9543], "Mg": [738, 1451, 7733, 10543],
    "Al": [578, 1817, 2745, 11577], "Si": [787, 1577, 3232, 4356, 16091], "K": [419, 3052, 4420, 5877],
    "Ca": [590, 1145, 4912, 6491],
}

ORD = {"primo": 1, "secondo": 2, "terzo": 3, "quarto": 4, "quinto": 5, "sesto": 6}
MAIN_GROUPS = (1, 2, 13, 14, 15, 16, 17, 18)


def art(name):
    if name == "iodio" or re.match(r"(z|x|s[^aeiou])", name):
        return "lo " + name
    if name[0] in "aeiou":
        return "l'" + name
    return "il " + name


def no_art(text):
    """'il sodio', 'L'argon', 'lo zolfo' -> the element's name, checking the article."""
    name = re.sub(r"^(il |lo |l')", "", text.lower())
    if art(name) != text.lower():
        raise ValueError(f"wrong article in {text!r}")
    if name not in BY_NAME:
        raise ValueError(f"unknown element {name!r}")
    return name


def cap(s):
    return s[0].upper() + s[1:]


def dec(s):
    """2{,}20 -> 11/5; 11\\,577 -> 11577; 495{,}8 -> 2479/5."""
    s = s.strip().replace("\\,", "")
    if not re.fullmatch(r"-?\d+(\{,\}\d+)?", s):
        raise ValueError(f"not a number: {s!r}")
    return Rational(s.replace("{,}", "."))


def sym_of(latex):
    m = re.fullmatch(r"\\mathrm\{([A-Z][a-z]?)\}", latex.strip())
    if not m or m.group(1) not in BY_SYMBOL:
        raise ValueError(f"not an element: {latex!r}")
    return m.group(1)


def ion_of(latex):
    """\\mathrm{Na^+} -> ('Na', 1); \\mathrm{O^{2-}} -> ('O', -2)."""
    m = re.fullmatch(r"\\mathrm\{([A-Z][a-z]?)\^(?:([+-])|\{(\d)([+-])\})\}", latex.strip())
    if not m or m.group(1) not in BY_SYMBOL:
        raise ValueError(f"not an ion: {latex!r}")
    n = int(m.group(3)) if m.group(3) else 1
    if m.group(3) == "1":
        raise ValueError("charge 1 written with the digit")
    return m.group(1), n if (m.group(2) or m.group(4)) == "+" else -n


def klass(sym):
    """Metal, semimetal or non-metal, from the family of the site's table (lesson 61)."""
    fam = BY_SYMBOL[sym]["family"]
    if fam == "semimetalli":
        return "semimetallo"
    if fam in ("non-metalli", "alogeni", "gas-nobili"):
        return "non metallo"
    return "metallo"


def group_charge(sym):
    """The charge of the ion an element of a main group usually forms (lessons 59 and 61)."""
    g = BY_SYMBOL[sym]["group"]
    return {1: 1, 2: 2, 13: 3, 16: -2, 17: -1}[g]


def the_choice(sample, errs):
    """The multiple choice of a sample, and the common checks. A number answer keeps its choice in `choice`."""
    if not sample.get("steps"):
        errs.append("no steps")
    text = sample["problem"] + " ".join(sample["steps"]) + sample.get("solution", "")
    if BANNED.search(text):
        errs.append("forbidden words")
    a = sample.get("answer", {})
    if a.get("kind") == "choice":
        return a
    if a.get("kind") != "number":
        errs.append("answer is neither a choice nor a number")
        return None
    ch = sample.get("choice")
    if not ch:
        errs.append("number answer without its choice")
        return None
    if ch != sample.get("params", {}).get("choice"):
        errs.append("choice differs from params.choice")
    return ch


def check_number(sample, ch, value, errs):
    """A number answer: the value, and the option with that value as the only right one."""
    want = str(value)
    if sample["answer"].get("kind") != "number":
        errs.append("answer should be a number")
    elif sample["answer"].get("value") != want:
        errs.append(f"answer {sample['answer'].get('value')}, expected {want}")
    check_choice(ch, lambda o: o["values"] == [want], errs)


def row_of(where, syms, prop, groups_in_period, groups, errs):
    """The four elements of a period or a group named in the text, in order, with the property's values.

    `where` is 'terzo periodo' or 'gruppo $17$'. Returns (mode, elements in order, values) or None.
    """
    els = [BY_SYMBOL[s] for s in syms]
    m = re.fullmatch(r"(\w+) periodo", where)
    if m:
        p = ORD[m.group(1)]
        if any(e["period"] != p or e["group"] not in groups_in_period for e in els):
            errs.append("an option is not in that period, or not in a main group")
            return None
        els.sort(key=lambda e: e["group"])
        mode = "periodo"
    else:
        m = re.fullmatch(r"gruppo \$(\d+)\$", where)
        if not m:
            errs.append(f"place not recognised: {where!r}")
            return None
        g = int(m.group(1))
        if g not in groups or any(e["group"] != g or e["period"] < 2 for e in els):
            errs.append("an option is not in that group")
            return None
        els.sort(key=lambda e: e["period"])
        mode = "gruppo"
    vals = [prop(e) for e in els]
    if any(x is None for x in vals) or len(set(e["symbol"] for e in els)) != 4:
        errs.append("missing value or repeated element")
        return None
    return mode, els, vals


def monotonic(vals, gap, rising, errs):
    """The values go the way the lesson's rule says, with steps of at least `gap`."""
    steps = [b - a for a, b in zip(vals, vals[1:])]
    if not all((d if rising else -d) >= gap for d in steps):
        errs.append(f"the data do not follow the rule clearly: {vals}")
        return False
    return True
