"""Shared helpers for the checkers of the second half of the chemistry chapter on bonds (third year, group F:
legame-ionico, chim-legame-metallico, chim-formule-lewis).

The elements' data are read from the site's periodic table (src/lib/tools/elementi.json), the same file the lessons
65-67 take their numbers from. What that file does not have is typed here from the lessons, not from the generators:
the ionic radii of the table of lesson 65 and the names of the anions. The rules (which elements are metals, which
ion a group forms, how a formula is made neutral) are written here from the lessons.
"""
import json
import os
import re
from math import gcd

from sympy import Rational

from checkers._fis_grandezze import BANNED, check_choice, option_text, parse_sci, prose_and_extra  # noqa: F401

_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..")
with open(os.path.join(_ROOT, "src", "lib", "tools", "elementi.json"), encoding="utf-8") as _f:
    ELEMENTS = json.load(_f)

BY_SYMBOL = {e["symbol"]: e for e in ELEMENTS}
BY_NAME = {e["name"].lower(): e for e in ELEMENTS}

METAL_FAMILIES = {"alcalini", "alcalino-terrosi", "transizione", "altri-metalli", "lantanidi", "attinidi"}
NON_METAL_FAMILIES = {"non-metalli", "alogeni", "gas-nobili"}

N_A = Rational(602, 100) * 10**23

# lesson 65: ionic radii in pm (Shannon, coordination 6), from which the table of the lesson takes its distances
IONIC_RADIUS = {"Li": 76, "Na": 102, "K": 138, "Mg": 72, "Ca": 100, "F": 133, "Cl": 181, "Br": 196, "O": 140}
# lesson 27 and lesson 65: the names of the anions
ANION_NAME = {"F": "fluoruro", "Cl": "cloruro", "Br": "bromuro", "I": "ioduro", "O": "ossido", "S": "solfuro", "N": "nitruro"}


def is_metal(sym):
    return BY_SYMBOL[sym]["family"] in METAL_FAMILIES


def is_non_metal(sym):
    return BY_SYMBOL[sym]["family"] in NON_METAL_FAMILIES


def chi(sym):
    return Rational(str(BY_SYMBOL[sym]["electronegativity"]))


def mass(sym):
    """The atomic mass with two decimals, as the table of lesson 01 and the site's periodic table write it."""
    return Rational(BY_SYMBOL[sym]["mass"].replace(",", "."))


def valence(sym):
    """Valence electrons of a main-group element, from its group."""
    g = BY_SYMBOL[sym]["group"]
    if g in (1, 2):
        return g
    if 13 <= g <= 18:
        return g - 10
    raise ValueError(f"{sym} is not a main-group element")


def ion_charge(sym):
    """Lesson 65: a metal loses all its valence electrons, a non-metal gains those it misses to reach eight."""
    v = valence(sym)
    return v if is_metal(sym) else v - 8


def art(name):
    if name == "iodio" or re.match(r"(z|x|s[^aeiou])", name):
        return "lo " + name
    if name[0] in "aeiou":
        return "l'" + name
    return "il " + name


def no_art(text):
    """'Il sodio', "l'argon", 'lo zolfo' -> the element's name, checking the article."""
    name = re.sub(r"^(il |lo |l')", "", text.lower())
    if art(name) != text.lower():
        raise ValueError(f"wrong article in {text!r}")
    if name not in BY_NAME:
        raise ValueError(f"unknown element {name!r}")
    return name


def dec(s):
    """2{,}20 -> 11/5."""
    s = s.strip()
    if not re.fullmatch(r"-?\d+(\{,\}\d+)?", s):
        raise ValueError(f"not a number: {s!r}")
    return Rational(s.replace("{,}", "."))


def ion_of(latex):
    """\\mathrm{Na^+} -> ('Na', 1); \\mathrm{O^{2-}} -> ('O', -2). The charge 1 is written without the digit."""
    m = re.fullmatch(r"\\mathrm\{([A-Z][a-z]?)\^(?:([+-])|\{(\d)([+-])\})\}", latex.strip())
    if not m or m.group(1) not in BY_SYMBOL:
        raise ValueError(f"not an ion: {latex!r}")
    if m.group(3) == "1":
        raise ValueError("charge 1 written with the digit")
    n = int(m.group(3)) if m.group(3) else 1
    sign = m.group(2) or m.group(4)
    return m.group(1), n if sign == "+" else -n


def parse_formula(tex):
    """\\mathrm{Na_2O} -> [('Na', 2), ('O', 1)]. An index 1 must not be written."""
    m = re.fullmatch(r"\\mathrm\{((?:[A-Z][a-z]?(?:_\d)?)+)\}", tex.strip())
    if not m:
        raise ValueError(f"not a formula: {tex!r}")
    if "_1" in m.group(1):
        raise ValueError("index 1 written")
    return [(s, int(k) if k else 1) for s, k in re.findall(r"([A-Z][a-z]?)(?:_(\d))?", m.group(1))]


def neutral(cation, qc, anion, qa):
    """The smallest numbers of cations and anions that make the compound neutral (qa without sign)."""
    l = qc * qa // gcd(qc, qa)
    return l // qc, l // qa


def common(sample, errs):
    """Steps, forbidden words, and an answer that is a choice or a number."""
    if not sample.get("steps"):
        errs.append("no steps")
    text = sample["problem"] + " ".join(sample["steps"]) + sample.get("solution", "")
    if BANNED.search(text):
        errs.append("forbidden words")
    if sample.get("answer", {}).get("kind") not in ("choice", "number"):
        errs.append("answer is neither a choice nor a number")


def check_number(sample, truth, errs):
    """A level that asks for a whole number: the answer, the four numbers of params.options with the right one first,
    and the multiple choice built from them, with exactly one right option and `correct` pointing to it."""
    a = sample["answer"]
    if a.get("kind") != "number":
        errs.append("answer is not a number")
        return
    if a.get("value") != str(truth):
        errs.append(f"answer {a.get('value')}, expected {truth}")
    opts = sample.get("params", {}).get("options")
    if not isinstance(opts, list) or len(opts) != 4 or len(set(opts)) != 4:
        errs.append(f"params.options are not four different numbers: {opts}")
    else:
        if opts[0] != str(truth):
            errs.append("the first of params.options is not the answer")
        if not all(re.fullmatch(r"\d+", o) for o in opts):
            errs.append(f"an option is not a whole number: {opts}")
    ch = sample.get("choice")
    if ch is None:
        errs.append("no multiple choice")
        return
    check_choice(ch, lambda o: o["latex"] == str(truth) and o["values"] == [str(truth)], errs)
    if isinstance(opts, list) and sorted(o["latex"] for o in ch.get("options", [])) != sorted(opts):
        errs.append("the multiple choice does not have the numbers of params.options")
