"""Shared helpers for the checkers of the chemistry chapter on intermolecular forces and condensed states (third year,
group H: chim-forze-dipolo-london, chim-legame-idrogeno, chim-stato-liquido, chim-stato-solido), written from the
specs and the lessons 72-75, not from the generators.

Atomic numbers are read from src/lib/tools/elementi.json, the site's periodic table. Formulas are written in
\\mathrm ({\\mathrm{CH_3OH}}, \\mathrm{Mg^{2+}}), numbers have the decimal comma and a unit upright after a thin space.
"""
import json
import re
from pathlib import Path

from checkers._fis_grandezze import BANNED, check_choice, prose_and_extra  # noqa: F401 (re-exported)

_ELEMENTS = json.loads((Path(__file__).resolve().parents[3] / "src/lib/tools/elementi.json").read_text(encoding="utf-8"))
Z_OF = {e["symbol"]: e["z"] for e in _ELEMENTS}
CHI = {e["symbol"]: e.get("electronegativity") for e in _ELEMENTS}


def atoms(formula):
    """'CHCl3' -> [('C', 1), ('H', 1), ('Cl', 3)]"""
    out = re.findall(r"([A-Z][a-z]?)(\d*)", formula)
    if "".join(s + n for s, n in out) != formula:
        raise ValueError(f"not a formula: {formula!r}")
    return [(s, int(n or 1)) for s, n in out]


def electrons(formula):
    """The electrons of a neutral molecule: the sum of the atomic numbers."""
    return sum(Z_OF[s] * n for s, n in atoms(formula))


def fx(formula):
    """'CH3OH' -> \\mathrm{CH_3OH}; 'C5H12' -> \\mathrm{C_5H_{12}}; 'Mg2+' -> \\mathrm{Mg^{2+}}; 'Cl-' -> \\mathrm{Cl^-}."""
    m = re.fullmatch(r"(.*?)(?:(\d?)([+-]))?", formula)
    body = re.sub(r"\d+", lambda d: "_{" + d.group(0) + "}" if len(d.group(0)) > 1 else "_" + d.group(0), m.group(1))
    charge = ""
    if m.group(3):
        charge = "^{" + m.group(2) + m.group(3) + "}" if m.group(2) else "^" + m.group(3)
    return "\\mathrm{" + body + charge + "}"


def unfx(latex):
    """The inverse of fx, for a formula read in a text."""
    m = re.fullmatch(r"\\mathrm\{(.*)\}", latex.strip())
    if not m:
        raise ValueError(f"not a formula: {latex!r}")
    s = m.group(1)
    s = re.sub(r"\^\{(\d?)([+-])\}", r"\1\2", s)
    s = re.sub(r"\^([+-])", r"\1", s)
    s = re.sub(r"_\{(\d+)\}", r"\1", s)
    s = re.sub(r"_(\d)", r"\1", s)
    if fx(s) != latex.strip():
        raise ValueError(f"formula not written as the lessons write it: {latex!r}")
    return s


def plain(latex):
    """An option or a line as prose: \\text{...} pieces as they are, the formulas between dollars; a gathered joined with spaces."""
    s = latex.strip()
    m = re.fullmatch(r"\\begin\{gathered\} (.*) \\end\{gathered\}", s)
    if m:
        return " ".join(plain(p) for p in m.group(1).split(" \\\\ "))
    out, i = "", 0
    for t in re.finditer(r"\\text\{([^{}]*)\}", s):
        if t.start() > i:
            out += "$" + s[i : t.start()] + "$"
        out += t.group(1)
        i = t.end()
    if i < len(s):
        out += "$" + s[i:] + "$"
    return out


def choice_of(sample):
    """The multiple choice of a sample: the answer itself, or the `choice` beside a number."""
    a = sample.get("answer", {})
    return a if a.get("kind") == "choice" else sample.get("choice") or {}


def common(sample, errs):
    if not sample.get("steps"):
        errs.append("no steps")
    text = sample["problem"] + " ".join(sample["steps"]) + sample.get("solution", "")
    if BANNED.search(text):
        errs.append("forbidden words")
    kind = sample.get("answer", {}).get("kind")
    if kind not in ("choice", "number"):
        errs.append(f"answer kind {kind}")
    if kind == "number" and "choice" not in sample:
        errs.append("a number answer needs its multiple choice")


def check_text(sample, want, errs):
    """The right option is the one whose prose is `want`."""
    check_choice(choice_of(sample), lambda o: plain(o["latex"]) == want, errs)


def check_fact(sample, prose, key, errs):
    """A level of fixed questions: the question must be in the key, and the right option its answer."""
    if prose not in key:
        errs.append(f"question not in the key: {prose!r}")
        return
    check_text(sample, key[prose], errs)
    for o in choice_of(sample).get("options", []):
        if o["values"] != [plain(o["latex"])]:
            errs.append(f"option value {o['values']} is not its text")


def check_number(sample, want, errs, must_be_open=None):
    """The answer is the integer `want`: as the right option, written as a bare number, and as the open answer if there is one."""
    want = str(want)
    check_choice(choice_of(sample), lambda o: o["latex"] == want, errs)
    for o in choice_of(sample).get("options", []):
        if not re.fullmatch(r"\d+", o["latex"]) or o["values"] != [o["latex"]]:
            errs.append(f"option {o['latex']!r} is not a bare number with its own value")
    a = sample.get("answer", {})
    if a.get("kind") == "number" and a.get("value") != want:
        errs.append(f"open answer {a.get('value')} != {want}")
    if must_be_open is True and a.get("kind") != "number":
        errs.append("this level gives its answer as a number")
    if must_be_open is False and a.get("kind") != "choice":
        errs.append("this level is a multiple choice only")
