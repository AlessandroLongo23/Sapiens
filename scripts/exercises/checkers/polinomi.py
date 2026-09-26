"""Checker for polinomi, from specs/exercises/polinomi.md.

Everything is recomputed from the text the student sees: the problem LaTeX is parsed into SymPy
(with the parser of monomi_common), split into its written terms, and the answer (normal form,
degree, properties, value) is computed again from those terms and the prompt."""
import re

from sympy import Integer, Poly, Rational, expand

from checkers.monomi_common import (
    SYMS,
    ParseError,
    check_choice,
    check_steps,
    forbidden,
    mono_parts,
    parse,
    poly_normal_form_errors,
    same,
    val,
)

CASE_RANGES = {
    4: {"complessivo": (0.38, 0.62), "rispetto a una lettera": (0.38, 0.62)},
    5: {"complessivo": (0.58, 0.82), "rispetto a una lettera": (0.18, 0.42)},
    6: {
        k: (0.08, 0.17)
        for k in [
            "ordinato-completo",
            "ordinato-non-completo",
            "completo-non-ordinato",
            "ne-ordinato-ne-completo",
            "omogeneo-completo",
            "omogeneo-non-completo",
            "completo-non-omogeneo",
            "ne-omogeneo-ne-completo",
        ]
    },
    7: {"intero negativo": (0.25, 0.42), "frazione": (0.25, 0.42), "due lettere": (0.25, 0.42)},
}

PROP_LABELS = {
    "ordinato": {
        "ordinato-completo": "ordinato e completo",
        "ordinato-non-completo": "ordinato ma non completo",
        "completo-non-ordinato": "completo ma non ordinato",
        "ne-ordinato-ne-completo": "né ordinato né completo",
    },
    "omogeneo": {
        "omogeneo-completo": "omogeneo e completo",
        "omogeneo-non-completo": "omogeneo ma non completo",
        "completo-non-omogeneo": "completo ma non omogeneo",
        "ne-omogeneo-ne-completo": "né omogeneo né completo",
    },
}

MAX_LEN = 170


def flatten(prob):
    """A problem written on more lines (aligned, broken before a + or -, or before the values of
    level 7) back to the one-line text. Returns (text, number of lines)."""
    m = re.fullmatch(r"\\begin\{aligned\}(.*)\\end\{aligned\}", prob, re.S)
    if not m:
        return prob, 1
    lines = m.group(1).split("\\\\")
    out = []
    for i, ln in enumerate(lines):
        if not ln.startswith("&"):
            raise ParseError(f"line without &: {ln}")
        ln = ln[1:]
        if i == 0:
            out.append(ln)
        elif ln.startswith("\\quad "):
            rest = ln[len("\\quad "):]
            if not rest[:2] in ("+ ", "- "):
                raise ParseError(f"continuation line must start with + or -: {ln}")
            out.append(" " + rest)
        elif ln.startswith("\\text{per }") or ln.startswith("P("):
            out.append(" \\qquad " + ln)
        else:
            raise ParseError(f"unexpected line {ln}")
    return "".join(out), len(lines)


def split_terms(latex):
    """Top-level written terms of a sum written with spaced binary signs: '3x - 2 + a \\cdot b'."""
    parts = re.split(r"\s([+-])\s", latex.strip())
    return [parts[0]] + [("-" if parts[i] == "-" else "") + parts[i + 1] for i in range(1, len(parts), 2)]


def written_monos(latex):
    """[(coef, {letter: exp})] for every written term (a product is reduced here)."""
    out = []
    for t in split_terms(latex):
        mp = mono_parts(parse(t))
        if mp is None:
            raise ParseError(f"written term is not a nonzero monomial: {t}")
        out.append(mp)
    return out


def lit_key(e):
    return tuple(sorted(e.items()))


def deg(e):
    return sum(e.values())


def letters_of(monos):
    return sorted({v for _, e in monos for v in e})


def reduced(monos):
    """{literal key: coefficient} of the normal form, zero sums dropped."""
    acc = {}
    for c, e in monos:
        k = lit_key(e)
        acc[k] = acc.get(k, 0) + c
    return {k: c for k, c in acc.items() if c != 0}


def ordered_desc(latex, vars_):
    """The terms of a normal form are in strictly descending powers (first letter, then the next)."""
    ms = written_monos(latex)
    keys = [tuple(e.get(v, 0) for v in vars_) for _, e in ms]
    return all(keys[i] > keys[i + 1] for i in range(len(keys) - 1))


def separated_similar(monos):
    ks = [lit_key(e) for _, e in monos]
    return any(ks[i] == ks[j] for i in range(len(ks)) for j in range(i + 2, len(ks)))


def check_reduction(sample, lvl, prob, errs):
    if sample.get("prompt") != "Riduci il polinomio a forma normale.":
        errs.append(f"unexpected prompt {sample.get('prompt')!r}")
    ms = written_monos(prob)
    truth = expand(parse(prob))
    red = reduced(ms)
    vars_ = letters_of(ms)
    ans = sample["answer"]
    if ans.get("kind") != "expression" or ans.get("form") != "expanded":
        errs.append("answer must be an expression in expanded form")
        return
    if not same(val(ans["value"]), truth):
        errs.append(f"answer value {ans['value']} != {truth}")
    try:
        if not same(parse(ans["latex"]), truth):
            errs.append(f"answer latex {ans['latex']} != {truth}")
    except ParseError as e:
        errs.append(f"answer latex does not parse ({e})")
    errs += poly_normal_form_errors(ans["latex"], "answer")
    if not ordered_desc(ans["latex"], vars_):
        errs.append(f"answer not in descending powers: {ans['latex']}")
    if len(written_monos(ans["latex"])) != len(red):
        errs.append("answer has a different number of terms than the normal form")
    if sample.get("solution") != ans["latex"]:
        errs.append("solution differs from answer latex")
    if len(red) == 0 or len(red) == len(ms):
        errs.append("nothing to reduce, or the null polynomial")
    if not 4 <= len(ms) <= 7:
        errs.append(f"{len(ms)} written terms")
    if not separated_similar(ms):
        errs.append("similar terms are all next to each other")
    vanished = {lit_key(e) for _, e in ms} - set(red)
    has_frac = "\\frac" in prob
    n_prod = prob.count("\\cdot")
    if lvl == 1:
        if len(vars_) != 1 or has_frac or n_prod or vanished or len(ms) < 5:
            errs.append("level 1: one letter, integers, 5-7 terms, nothing that vanishes")
    elif lvl == 2:
        if len(vars_) != 2 or has_frac or n_prod or len(vanished) != 1:
            errs.append("level 2: two letters, integers, exactly one group summing to 0")
    elif lvl == 3:
        if not has_frac or n_prod != 1 or vanished:
            errs.append("level 3: a fraction, one product, nothing that vanishes")
        else:
            terms = split_terms(prob)
            pi = next(i for i, t in enumerate(terms) if "\\cdot" in t)
            pk = lit_key(ms[pi][1])
            if sum(1 for _, e in ms if lit_key(e) == pk) < 2:
                errs.append("level 3: the product has no similar term")
    for c in red.values():
        if Rational(c).q > 12 or abs(Rational(c).p) > 30:
            errs.append(f"result coefficient {c} too big")
    errs += check_choice(sample, truth)
    for o in (sample.get("choice") or {}).get("options", []):
        if not ordered_desc(o["latex"], vars_):
            errs.append(f"option not in descending powers: {o['latex']}")


def check_degree(sample, lvl, prob, errs):
    prompt = sample.get("prompt", "")
    m = re.fullmatch(r"Calcola il grado del polinomio rispetto alla lettera ([a-z])\.", prompt)
    if m:
        ask = m.group(1)
    elif prompt == "Calcola il grado complessivo del polinomio.":
        ask = None
    else:
        errs.append(f"unexpected prompt {prompt!r}")
        return None
    ms = written_monos(prob)
    red = reduced(ms)
    if not red:
        errs.append("null polynomial has no degree")
        return None
    measure = (lambda e: deg(e)) if ask is None else (lambda e: e.get(ask, 0))
    red_es = [dict(k) for k in red]
    truth = max(measure(e) for e in red_es)
    # cross-check with SymPy
    expr = expand(parse(prob))
    syms = [SYMS[v] for v in letters_of(ms)]
    P = Poly(expr, *syms)
    sp = P.total_degree() if ask is None else P.degree(SYMS[ask])
    if sp != truth:
        errs.append(f"sympy degree {sp} != {truth}")
    ans = sample["answer"]
    if ans.get("kind") != "number" or ans.get("value") != str(truth):
        errs.append(f"answer {ans.get('value')} != degree {truth}")
    if ask is not None and ask not in letters_of(ms):
        errs.append("the letter asked does not appear")
    written_top = max(measure(e) for _, e in ms)
    vanished = {lit_key(e) for _, e in ms} - set(red)
    if lvl == 4:
        errs += poly_normal_form_errors(prob, "problem")
        if vanished or len(red) != len(ms):
            errs.append("level 4: polynomial already reduced")
        if ask is None:
            if deg(ms[0][1]) == truth:
                errs.append("level 4: the first term has the highest degree")
        else:
            topdeg = max(deg(e) for _, e in ms)
            if any(deg(e) == topdeg and e.get(ask, 0) == truth for _, e in ms):
                errs.append("level 4: the highest-degree term also has the highest exponent of the letter")
            if truth == 0:
                errs.append("level 4: degree 0 in the letter")
    else:
        if len(vanished) != 1:
            errs.append("level 5: exactly one group that cancels")
        if written_top <= truth:
            errs.append("level 5: the cancelling terms must be higher than the answer")
        if truth < 1:
            errs.append("level 5: degree at least 1")
        opts = [o["values"][0] for o in (sample.get("choice") or {}).get("options", [])]
        if str(written_top) not in opts:
            errs.append("level 5: the degree before reducing must be a distractor")
    errs += check_choice(sample, Integer(truth), number=True)
    return "complessivo" if ask is None else "rispetto a una lettera"


def check_properties(sample, prob, errs):
    prompt = sample.get("prompt", "")
    m1 = re.fullmatch(r"Il polinomio è ordinato secondo le potenze decrescenti di ([a-z])\? È completo rispetto ad? ([a-z])\?", prompt)
    m2 = re.fullmatch(r"Il polinomio è omogeneo\? È completo rispetto ad? ([a-z])\?", prompt)
    if m1 and m1.group(1) == m1.group(2):
        prop, v = "ordinato", m1.group(1)
    elif m2:
        prop, v = "omogeneo", m2.group(1)
    else:
        errs.append(f"unexpected prompt {prompt!r}")
        return None
    if re.search(r"rispetto a a\b|rispetto ad [b-z]", prompt):
        errs.append("wrong preposition before the letter")
    ms = written_monos(prob)
    if len(reduced(ms)) != len(ms):
        errs.append("level 6: the polynomial must be in normal form")
    errs += poly_normal_form_errors(prob, "problem")
    es = [e.get(v, 0) for _, e in ms]
    present = set(es)
    complete = all(k in present for k in range(max(es) + 1))
    if prop == "ordinato":
        first = all(es[i] > es[i + 1] for i in range(len(es) - 1))
        if letters_of(ms) != [v] or len(ms) < 3:
            errs.append("ordinato: one letter, at least three terms")
        if len(es) > 1 and all(es[i] < es[i + 1] for i in range(len(es) - 1)):
            errs.append("ordinato: ascending order is ambiguous")
    else:
        degs = [deg(e) for _, e in ms]
        first = len(set(degs)) == 1
        ls = letters_of(ms)
        if len(ls) != 2 or ls[0] != v:
            errs.append("omogeneo: two letters, completeness asked on the first")
        if not all(es[i] > es[i + 1] for i in range(len(es) - 1)):
            errs.append("omogeneo: written in descending powers of the first letter")
    if first and complete:
        kind = f"{prop}-completo"
    elif first:
        kind = f"{prop}-non-completo"
    elif complete:
        kind = f"completo-non-{prop}"
    else:
        kind = f"ne-{prop}-ne-completo"
    labels = PROP_LABELS[prop]
    for where in ("answer", "choice"):
        a = sample.get(where) or {}
        opts = a.get("options", [])
        if a.get("kind") != "choice" or len(opts) != 4:
            errs.append(f"{where}: a choice with 4 options")
            continue
        ids = [o["values"][0] for o in opts]
        if sorted(ids) != sorted(labels):
            errs.append(f"{where}: options {ids}")
        for o in opts:
            if o["latex"] != f"\\text{{{labels.get(o['values'][0], '?')}}}":
                errs.append(f"{where}: option latex {o['latex']} does not match {o['values'][0]}")
        idx = a.get("correct")
        if not isinstance(idx, int) or not 0 <= idx < 4 or ids[idx] != kind:
            errs.append(f"{where}: correct option is not {kind}")
    return kind


def noparens_pow(a, n):
    """(-3)^2 written -3^2, (1/2)^2 written 1^2/2."""
    if n == 1:
        return a
    mag = Rational(abs(a.p) ** n, a.q)
    return -mag if a < 0 else mag


def check_value(sample, prob, errs):
    prompt = sample.get("prompt", "")
    m = re.fullmatch(r"P\(x\) = (.+) \\qquad P(?:\\left)?\((.+?)(?:\\right)?\)", prob)
    if m:
        if prompt != "Calcola il valore indicato.":
            errs.append(f"unexpected prompt {prompt!r}")
        poly, subs = m.group(1), {"x": parse(m.group(2))}
    else:
        m = re.fullmatch(r"(.+) \\qquad \\text\{per \} (.+)", prob)
        if not m or prompt != "Calcola il valore numerico del polinomio.":
            errs.append(f"unexpected problem or prompt: {prob}")
            return None
        poly = m.group(1)
        subs = {}
        for a in m.group(2).split(",\\ "):
            am = re.fullmatch(r"([a-z]) = (.+)", a)
            if not am:
                errs.append(f"bad assignment {a}")
                return None
            subs[am.group(1)] = parse(am.group(2))
    errs += forbidden(poly)
    errs += poly_normal_form_errors(poly, "problem")
    ms = written_monos(poly)
    if letters_of(ms) != sorted(subs):
        errs.append("the letters of the polynomial and the values do not match")
        return None
    expr = parse(poly)
    truth = expr.subs({SYMS[v]: r for v, r in subs.items()})
    if not truth.is_Rational:
        errs.append(f"value is not rational: {truth}")
        return None
    ans = sample["answer"]
    if ans.get("kind") != "number" or Rational(ans.get("value", "x")) != truth:
        errs.append(f"answer {ans.get('value')} != {truth}")
    if truth.q > 12 or abs(truth.p) > 200:
        errs.append(f"ugly value {truth}")
    vals = list(subs.values())
    if len(subs) == 2:
        kind = "due lettere"
        if not any(r < 0 for r in vals):
            errs.append("two letters: one value must be negative")
    elif vals[0].is_integer:
        kind = "intero negativo"
        v = next(iter(subs))
        if vals[0] >= 0:
            errs.append("the integer must be negative")
        if not any(e.get(v, 0) % 2 == 0 and e.get(v, 0) > 0 for _, e in ms):
            errs.append("an even power is needed")
    else:
        kind = "frazione"
    # choice: four distinct rationals, one right, and the no-parentheses mistake among them when it differs
    ch = sample.get("choice") or {}
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append("choice needs 4 options")
        return kind
    ovals = []
    for o in opts:
        r = Rational(o["values"][0])
        ovals.append(r)
        try:
            if parse(o["latex"]) != r:
                errs.append(f"option latex {o['latex']} != {r}")
        except ParseError as e:
            errs.append(f"option does not parse ({e})")
    if len(set(ovals)) != 4:
        errs.append("options not distinct")
    if ovals.count(truth) != 1 or ch.get("correct") not in range(4) or ovals[ch["correct"]] != truth:
        errs.append("choice.correct does not point at the value")
    wrong = sum(c * Rational(1) * _prod(noparens_pow(subs[v], n) for v, n in e.items()) for c, e in ms)
    if wrong != truth and wrong not in ovals:
        errs.append(f"the no-parentheses mistake {wrong} is not a distractor")
    return kind


def _prod(xs):
    out = Rational(1)
    for x in xs:
        out *= x
    return out


def check(sample):
    errs = []
    lvl = sample["level"]
    try:
        prob, nlines = flatten(sample["problem"])
    except ParseError as e:
        return [f"bad multi-line problem ({e}): {sample['problem']}"], None
    if len(prob) > MAX_LEN:
        errs.append(f"problem too long ({len(prob)})")
    if nlines > 1 and len(prob) < 30:
        errs.append("a short problem split on more lines")
    if not sample.get("steps"):
        errs.append("no steps")
    kind = None
    try:
        if lvl in (1, 2, 3):
            errs += forbidden(prob)
            check_reduction(sample, lvl, prob, errs)
        elif lvl in (4, 5):
            errs += forbidden(prob)
            kind = check_degree(sample, lvl, prob, errs)
        elif lvl == 6:
            errs += forbidden(prob)
            kind = check_properties(sample, prob, errs)
        elif lvl == 7:
            kind = check_value(sample, prob, errs)
        else:
            errs.append(f"unknown level {lvl}")
    except ParseError as e:
        return [f"does not parse ({e}): {prob}"], None
    errs += check_steps(sample)
    return errs, kind
