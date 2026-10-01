"""Checker for chim-orbitali-numeri-quantici (specs/exercises/chim-orbitali-numeri-quantici.md), written from the spec
and the lesson 52-chim-orbitali-numeri-quantici.md, not from the generator.

The rules are recomputed here from the text of the problem: l from 0 to n - 1, m_l from -l to +l, the letters s p d f,
2l + 1 orbitals in a sublevel and n^2 in a level, n - 1 nodes of which l angular, 2 electrons in an orbital.
"""
import re

from checkers._fis_grandezze import check_choice, common, option_text, prose_and_extra

CASE_RANGES = {3: {"terna": (0.40, 0.60), "regola": (0.40, 0.60)}}

LETTER = {"s": 0, "p": 1, "d": 2, "f": 3}
ORBITAL = r"\$(\d)([spdf])\$"


def ints(tex):
    """'0,\\ 1,\\ 2' or '-1,\\ 0,\\ +1' -> [0, 1, 2]."""
    return [int(x) for x in tex.replace("\\ ", "").split(",")]


def triple(tex):
    m = re.fullmatch(r"\((\d+),\\ (\d+),\\ ([+-]?\d+)\)", tex)
    if not m:
        raise ValueError(f"not a triple: {tex!r}")
    return int(m.group(1)), int(m.group(2)), int(m.group(3))


def broken_rules(t):
    """The rules a triple (n, l, m_l) breaks."""
    n, l, m = t
    out = set()
    if n < 1:
        out.add("n")
    elif l > n - 1:
        out.add("l")
    if abs(m) > l:
        out.add("m")
    return out


def orbital(n, letter, errs, max_n=5):
    n, l = int(n), LETTER[letter]
    if not (1 <= n <= max_n and l <= n - 1):
        errs.append(f"the orbital {n}{letter} does not exist")
    return n, l


def number(sample, want, errs):
    check_choice(sample["answer"], lambda o: o["latex"] == str(want), errs)


def level1(sample, prose, errs):
    m = re.fullmatch(r"Quali valori può avere il numero quantico secondario \$l\$ in un orbitale del livello \$n = (\d)\$\?", prose)
    if m:
        n = int(m.group(1))
        if not 2 <= n <= 5:
            errs.append("n out of range")
        check_choice(sample["answer"], lambda o: ints(o["latex"]) == list(range(0, n)), errs)
        return "valori-l"
    m = re.fullmatch(r"Come si chiama un orbitale con \$n = (\d)\$ e \$l = (\d)\$\?", prose)
    if m:
        n, l = int(m.group(1)), int(m.group(2))
        if not (2 <= n <= 4 and 0 <= l <= n - 1):
            errs.append("the orbital asked for does not exist")
        want = f"{n}{'spdf'[l]}"
        for o in sample["answer"]["options"]:
            if not re.fullmatch(rf"{n}[spdf]", o["latex"]):
                errs.append(f"option {o['latex']!r} is not a name with n = {n}")
        check_choice(sample["answer"], lambda o: o["latex"] == want, errs)
        return "nome"
    m = re.fullmatch(r"Quanti sottolivelli ha il livello \$n = (\d)\$\?", prose)
    if m:
        n = int(m.group(1))
        if not 2 <= n <= 5:
            errs.append("n out of range")
        number(sample, n, errs)
        return "sottolivelli"
    errs.append(f"level 1 text not recognised: {prose!r}")
    return None


def level2(sample, prose, errs):
    m = re.fullmatch(rf"Quali valori può avere il numero quantico magnetico \$m_l\$ in un orbitale {ORBITAL}\?", prose)
    if m:
        n, l = orbital(m.group(1), m.group(2), errs, 4)
        if l < 1:
            errs.append("an s orbital has only m_l = 0: not a question")
        check_choice(sample["answer"], lambda o: ints(o["latex"]) == list(range(-l, l + 1)), errs)
        for o in sample["answer"]["options"]:
            for part in o["latex"].replace("\\ ", "").split(","):
                if int(part) > 0 and not part.startswith("+"):
                    errs.append(f"positive value without its sign in {o['latex']!r}")
        return "valori-m"
    m = re.fullmatch(rf"Quanti orbitali ha il sottolivello {ORBITAL}\?", prose)
    if m:
        n, l = orbital(m.group(1), m.group(2), errs, 4)
        number(sample, 2 * l + 1, errs)
        return "orbitali-sottolivello"
    m = re.fullmatch(r"Quanti orbitali ha in tutto il livello \$n = (\d)\$\?", prose)
    if m:
        n = int(m.group(1))
        if not 2 <= n <= 5:
            errs.append("n out of range")
        number(sample, sum(2 * l + 1 for l in range(n)), errs)
        return "orbitali-livello"
    errs.append(f"level 2 text not recognised: {prose!r}")
    return None


RULE_TEXT = {"l": "$l$ deve essere minore di $n$", "m": "$m_l$ non può superare $l$", "n": "$n$ non può essere zero", "zero": "$m_l$ non può essere zero"}


def rule_of(option):
    """The rule an option of the 'why' question states, from its LaTeX (text with inline formulas)."""
    flat = re.sub(r"\\text\{([^}]*)\}", r"\1", option["latex"])
    for key, text in RULE_TEXT.items():
        if flat == text.replace("$", ""):
            return key
    raise ValueError(f"not a rule: {option['latex']!r}")


def level3(sample, prose, errs):
    if prose == "Le terne sono scritte nell'ordine $(n,\\ l,\\ m_l)$. Quale indica un orbitale che esiste?":
        for o in sample["answer"]["options"]:
            broken = broken_rules(triple(o["latex"]))
            if len(broken) > 1:
                errs.append(f"{o['latex']!r} breaks two rules")
        check_choice(sample["answer"], lambda o: not broken_rules(triple(o["latex"])), errs)
        return "terna"
    m = re.fullmatch(r"La terna \$(\(.+\))\$, scritta nell'ordine \$\(n,\\ l,\\ m_l\)\$, non indica un orbitale\. Perché\?", prose)
    if m:
        broken = broken_rules(triple(m.group(1)))
        if len(broken) != 1:
            errs.append(f"the triple breaks {len(broken)} rules, not one")
            return "regola"
        (rule,) = broken
        check_choice(sample["answer"], lambda o: rule_of(o) == rule, errs)
        return "regola"
    errs.append(f"level 3 text not recognised: {prose!r}")
    return None


def level4(sample, prose, errs):
    m = re.fullmatch(rf"Quanti (nodi in tutto|nodi angolari|nodi radiali) ha un orbitale {ORBITAL}\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    n, l = orbital(m.group(2), m.group(3), errs)
    want = {"nodi in tutto": n - 1, "nodi angolari": l, "nodi radiali": n - l - 1}[m.group(1)]
    number(sample, want, errs)
    return m.group(1).split()[-1]


def level5(sample, prose, errs):
    m = re.fullmatch(r"Quanti elettroni può contenere al massimo il livello \$n = (\d)\$\?", prose)
    if m:
        n = int(m.group(1))
        if not 1 <= n <= 5:
            errs.append("n out of range")
        number(sample, 2 * n * n, errs)
        return "livello"
    m = re.fullmatch(rf"Quanti elettroni può contenere al massimo un solo orbitale {ORBITAL}\?", prose)
    if m:
        orbital(m.group(1), m.group(2), errs, 4)
        number(sample, 2, errs)
        return "orbitale"
    m = re.fullmatch(rf"Quanti elettroni può contenere al massimo il sottolivello {ORBITAL}\?", prose)
    if m:
        n, l = orbital(m.group(1), m.group(2), errs, 4)
        number(sample, 2 * (2 * l + 1), errs)
        return "sottolivello"
    errs.append(f"level 5 text not recognised: {prose!r}")
    return None


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append(f"unexpected lines {extra}")
    try:
        kind = LEVELS[lvl](sample, prose, errs)
    except (ValueError, KeyError, TypeError, AttributeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
