"""Checker for monomi-grado, from specs/exercises/monomi-grado.md.

The degree is recomputed from the problem LaTeX (parsed into SymPy) and the prompt, which says
whether the total degree or the degree with respect to one letter is asked."""
import re

from sympy import Integer, Mul, Rational

from checkers.monomi_common import (
    ParseError,
    check_choice,
    check_steps,
    forbidden,
    mono_parts,
    SYMS,
    normal_form_errors,
    parse,
    same,
)

CASE_RANGES = {
    1: {"esponente sottinteso": (0.22, 0.48), "esponente scritto": (0.52, 0.78)},
    2: {"con esponente sottinteso": (0.45, 0.75), "esponenti tutti scritti": (0.25, 0.55)},
    3: {"lettera assente": (0.28, 0.52), "costante": (0.15, 0.35), "controllo": (0.25, 0.45)},
    4: {"totale": (0.6, 0.9), "rispetto a una lettera": (0.1, 0.4)},
    6: {"prodotto": (0.2, 0.4), "quoziente": (0.25, 0.45), "potenza": (0.25, 0.45)},
}

COEF_POW = re.compile(r"(?:[235]|\(-[23]\)|\\left\(-?\\frac\{\d\}\{\d\}\\right\))\^[2-4](?:[a-z](?:\^\d)?)+")


def check(sample):
    errs = []
    prob = sample["problem"]
    prompt = sample.get("prompt", "")
    lvl = sample["level"]
    errs += forbidden(prob)
    try:
        expr = parse(prob)
    except ParseError as e:
        return [f"problem does not parse ({e}): {prob}"], None
    parts = mono_parts(expr)
    if parts is None:
        return [f"problem is not a nonzero monomial: {prob} = {expr}"], None
    coef, exps = parts
    m = re.search(r"rispetto alla lettera ([a-z])\.$", prompt)
    if m:
        letter = m.group(1)
        truth = exps.get(letter, 0)
    elif prompt in ("Calcola il grado complessivo del monomio.", "Calcola il grado del risultato dell'operazione."):
        letter = None
        truth = sum(exps.values())
    else:
        return [f"unexpected prompt {prompt!r}"], None

    ans = sample["answer"]
    if ans.get("kind") != "number" or ans.get("value") != str(truth):
        errs.append(f"answer {ans.get('value')} != degree {truth}")
    if sample["params"].get("degree") != truth:
        errs.append(f"params.degree {sample['params'].get('degree')} != {truth}")
    if max(exps.values(), default=0) > 16:
        errs.append("exponent > 16")

    # params must describe the same monomial as the text
    try:
        fs = [Rational(f["c"]) * Mul(*[SYMS[k] ** int(n) for k, n in f["e"].items()]) for f in sample["params"]["factors"]]
        pm = sample["params"]
        if pm.get("op") == "potenza":
            pexpr = fs[0] ** int(pm["n"])
        elif pm.get("op") == "quoziente":
            pexpr = fs[0] / fs[1]
        else:
            pexpr = Mul(*fs)
        if not same(pexpr, expr):
            errs.append(f"params describe {pexpr}, the problem is {expr}")
    except (KeyError, TypeError, ValueError) as e:
        errs.append(f"params not readable: {e!r}")

    is_op = prompt.startswith("Calcola il grado del risultato")
    kind = None
    if lvl in (1, 2, 3):
        errs += normal_form_errors(prob, "problem")
        if is_op:
            errs.append("levels 1-3 ask about one monomial")
    if lvl == 1:
        if letter is None or truth == 0 or len(exps) < 2:
            errs.append("level 1: degree w.r.t. a letter present, at least two letters")
        kind = "esponente sottinteso" if truth == 1 else "esponente scritto"
    elif lvl == 2:
        if letter is not None or len(exps) < 2:
            errs.append("level 2: total degree, at least two letters")
        kind = "con esponente sottinteso" if 1 in exps.values() else "esponenti tutti scritti"
    elif lvl == 3:
        if not exps:
            kind = "costante"
            if letter is not None:
                errs.append("constant: the total degree is asked")
        elif letter is not None and letter not in exps:
            kind = "lettera assente"
        else:
            kind = "controllo"
    elif lvl == 4:
        if not COEF_POW.fullmatch(prob):
            errs.append(f"level 4: coefficient written as a power, then letters: {prob}")
        kind = "totale" if letter is None else "rispetto a una lettera"
        if letter is not None and letter not in exps:
            errs.append("level 4: the letter asked must be present")
    elif lvl == 5:
        if "\\cdot" not in prob or is_op or "^{" in prob:
            errs.append("level 5: a product written with \\cdot")
        written = re.findall(r"[a-z]", prob.replace("\\cdot", ""))
        if len(written) == len(set(written)):
            errs.append("level 5: no repeated letter")
        if letter is not None and written.count(letter) < 2:
            errs.append("level 5: the letter asked must be repeated")
    elif lvl == 6:
        if not is_op:
            errs.append("level 6: the prompt must ask for the degree of the result")
        if re.fullmatch(r"(\(.*\)|\\left\(.*\\right\))\\cdot(\(.*\)|\\left\(.*\\right\))", prob):
            kind = "prodotto"
        elif " : " in prob:
            kind = "quoziente"
            if truth < 1:
                errs.append("level 6: quotient of degree 0")
        elif re.fullmatch(r"(\(.*\)|\\left\(.*\\right\))\^[2-4]", prob):
            kind = "potenza"
        else:
            errs.append(f"level 6: unexpected operation {prob}")
    else:
        errs.append(f"unknown level {lvl}")

    errs += check_steps(sample)
    errs += check_choice(sample, Integer(truth), number=True)
    return errs, kind
