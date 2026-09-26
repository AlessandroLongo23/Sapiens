"""Checker for monomi-espressioni, from specs/exercises/monomi-espressioni.md and lesson 15.

The expression is parsed from the problem LaTeX with the textbook order of operations (see
monomi_common): the parser in strict mode also reports any bracket, quotient or final result
that is not a nonzero monomial. Brackets must follow the convention round < square < curly.

A problem too wide for a phone is written on two or three lines (see unfold): the lines are joined
back into one expression and read as the others."""
import re

from checkers.monomi_common import (
    ParseError,
    bracket_errors,
    check_choice,
    check_steps,
    forbidden,
    groups_with_sum,
    mono_parts,
    normal_form_errors,
    parse,
    parse_strict,
    same,
    tokenize,
    val,
)

# Lines for the phone: a problem wider than ONE_LINE (estimated) is written as
# \begin{aligned}&line 1\\&\quad line 2 ...\end{aligned}, a new line before a +, a -, a \cdot or a :,
# each line within LINE (LINE - 2 after the \quad).
ONE_LINE = 33.5
LINE = 26
ALIGNED = re.compile(r"^\\begin\{aligned\}&(.*)\\end\{aligned\}$", re.S)

CASE_RANGES = {
    1: {"prodotto e somma": (0.4, 0.7), "quoziente e somma": (0.3, 0.6)},
    2: {"quoziente poi prodotto": (0.55, 0.85), "prodotto poi quoziente": (0.15, 0.45)},
    3: {"potenza": (0.6, 0.9), "meno fuori dalla potenza": (0.1, 0.4)},
}


def check(sample):
    errs = []
    lvl = sample["level"]
    prob, line_errs = unfold(sample["problem"])
    errs += line_errs
    if sample.get("prompt") != "Semplifica l'espressione.":
        errs.append(f"unexpected prompt {sample.get('prompt')!r}")
    errs += forbidden(prob)
    try:
        truth, issues = parse_strict(prob)
    except ParseError as e:
        return [f"problem does not parse ({e}): {prob}"], None
    errs += issues
    parts = mono_parts(truth)
    if parts is None:
        return errs + [f"result {truth} is not a nonzero monomial"], None
    coef, exps = parts
    if not exps or abs(coef.p) > 100 or coef.q > 9 or max(exps.values()) > 12:
        errs.append(f"result out of range: {truth}")

    ans = sample["answer"]
    if ans.get("kind") != "expression" or not same(val(ans["value"]), truth):
        errs.append(f"answer {ans.get('value')} != {truth}")
    try:
        if not same(parse(ans["latex"]), truth):
            errs.append(f"answer latex {ans['latex']} != {truth}")
    except ParseError as e:
        errs.append(f"answer latex does not parse ({e})")
    errs += normal_form_errors(ans["latex"])
    errs += forbidden(ans["latex"], "answer")

    # every monomial written in the text is in normal form, with letters and small coefficients
    for m in re.finditer(r"(?<![\\a-zA-Z^])-?(?:\d+|\\frac\{\d+\}\{\d+\})?(?:[a-z](?:\^\d)?)+", prob):
        errs += normal_form_errors(m.group(0), "monomial in the problem")
    for m in re.finditer(r"\\frac\{(\d+)\}\{(\d+)\}|(?<![\^\d{])(\d+)", prob):
        n = int(m.group(1) or m.group(3))
        if n > 60 or (m.group(2) and int(m.group(2)) > 9):
            errs.append(f"number out of range in the problem: {m.group(0)}")

    berrs, top = bracket_errors(prob)
    errs += berrs
    sums = groups_with_sum(prob)
    toks = tokenize(prob)
    ops = [t for t in toks if t in ("\\cdot", ":")]
    powered = bool(re.search(r"\)\^\d", prob))
    top_sum = _top_level_sum(toks)
    kind = None
    if lvl == 1:
        if powered or sums or len(ops) != 1 or not top_sum or top > 1:
            errs.append("level 1: one product or quotient and a sum, no powers or brackets")
        kind = "prodotto e somma" if ops == ["\\cdot"] else "quoziente e somma"
    elif lvl == 2:
        if powered or sums or len(ops) != 2 or set(ops) != {"\\cdot", ":"} or top > 1:
            errs.append("level 2: a chain of three monomials with both \\cdot and :")
        kind = "quoziente poi prodotto" if ops == [":", "\\cdot"] else "prodotto poi quoziente"
    elif lvl == 3:
        if not powered or sums or not top_sum or top > 1:
            errs.append("level 3: a power of a monomial, then a sum, no bracket with a sum")
        kind = "meno fuori dalla potenza" if _minus_before_power(prob) else "potenza"
    elif lvl == 4:
        if sums != 1 or top > 2:
            errs.append("level 4: exactly one bracket containing a sum, at most square brackets")
    elif lvl == 5:
        if top != 3 or sums < 3:
            errs.append("level 5: round, square and curly brackets")
    else:
        errs.append(f"unknown level {lvl}")

    errs += check_steps(sample)
    errs += check_choice(sample, truth)
    return errs, kind


def _top_level_sum(toks):
    depth = 0
    prev = None
    for t in toks:
        if t in ("(", "[", "\\{"):
            depth += 1
        elif t in (")", "]", "\\}"):
            depth -= 1
        elif t in ("+", "-") and depth == 0 and prev is not None:
            return True
        prev = t
    return False


def _minus_before_power(prob):
    """A minus sign written right before a parenthesis that is raised to a power: -(2a)^2."""
    return bool(re.search(r"(?:^|\s)-\s*(?:\((?:[^()]*)\)|\\left\((?:(?!\\right\)).)*\\right\))\^\d", prob))


def est_width(latex):
    """Width in character units: visible characters (\\left, \\right and spaces do not count, a
    fraction counts as its longer line, \\cdot and each bracket count one) plus 0.6 per fraction."""
    s = re.sub(r"\\left|\\right", "", latex)
    s = re.sub(r"\\frac\{([^{}]*)\}\{([^{}]*)\}", lambda m: "#" * max(len(m.group(1)), len(m.group(2))), s)
    s = s.replace("\\cdot", "*").replace("\\{", "{").replace("\\}", "}")
    s = re.sub(r"\^\{([^{}]*)\}", r"\1", s).replace("^", "")
    return len(re.sub(r"\s", "", s)) + 0.6 * latex.count("\\frac")


def unfold(problem):
    """The problem on one line, and the errors of its layout. An aligned block must be needed (the
    expression does not fit ONE_LINE), have two or three lines, each within LINE (LINE - 2 after
    the \\quad); every line after the first starts with +, -, \\cdot or :, and no
    \\left ... \\right pair is cut."""
    errs = []
    m = ALIGNED.match(problem)
    if not m:
        if est_width(problem) > ONE_LINE:
            errs.append(f"problem wider than {ONE_LINE} on one line: {problem}")
        if re.search(r"aligned|&|\\\\|\\quad", problem):
            errs.append(f"malformed layout: {problem}")
        return problem, errs
    lines = m.group(1).split("\\\\&\\quad ")
    if not 2 <= len(lines) <= 3:
        errs.append(f"{len(lines)} lines")
    for i, ln in enumerate(lines):
        if re.search(r"aligned|&|\\\\|\\quad", ln):
            errs.append(f"malformed line {i + 1}: {ln}")
        if i > 0 and not re.match(r"(?:[+-]|\\cdot|:) ", ln):
            errs.append(f"line {i + 1} does not start with +, -, \\cdot or :: {ln}")
        if ln.count("\\left") != ln.count("\\right"):
            errs.append(f"a \\left ... \\right pair is cut at line {i + 1}: {ln}")
        if est_width(ln) > (LINE if i == 0 else LINE - 2):
            errs.append(f"line {i + 1} too wide for a phone: {ln}")
    flat = " ".join(lines)
    if est_width(flat) <= ONE_LINE:
        errs.append(f"problem split although it fits one line: {flat}")
    return flat, errs
