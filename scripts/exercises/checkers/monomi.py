"""Checker for monomi (lesson 27, "Monomi"), from specs/exercises/monomi.md.

Every answer is recomputed from the text the student sees: the problem LaTeX is parsed into SymPy
with the parser of monomi_common (juxtaposition binds tighter than \\cdot). Level 2 ("is it a
monomial?") uses a parser that also accepts exponents that are not natural numbers, and reads the
reason from the structure of the LaTeX (a top-level sum, a letter in a denominator, an exponent
that is negative, a fraction or a letter); SymPy confirms that the expression is or is not a
monomial."""
import re

from sympy import Integer, Mul, Rational

from checkers.monomi_common import (
    SYMS,
    ParseError,
    _Parser,
    check_choice,
    check_steps,
    forbidden,
    mono_parts,
    normal_form_errors,
    parse,
    same,
    tokenize,
    val,
)

CASE_RANGES = {
    1: {
        "parte letterale": (0.25, 0.45),
        "coefficiente intero": (0.12, 0.28),
        "coefficiente 1 o -1": (0.12, 0.28),
        "coefficiente frazionario": (0.17, 0.33),
    },
    2: {
        "monomio": (0.30, 0.50),
        "somma": (0.08, 0.22),
        "lettera al denominatore": (0.08, 0.22),
        "esponente negativo": (0.08, 0.22),
        "esponente non naturale": (0.08, 0.22),
    },
    3: {"risultato negativo": (0.40, 0.80), "risultato positivo": (0.20, 0.60)},
    4: {"frazioni": (0.35, 0.70), "potenza di un numero": (0.30, 0.65)},
    5: {"valori positivi": (0.15, 0.35), "valore negativo": (0.55, 0.80), "una lettera vale zero": (0.05, 0.16)},
    6: {"risultato intero": (0.40, 0.80), "risultato frazionario": (0.20, 0.60)},
}

PROMPTS = {
    "coefficiente": "Qual è il coefficiente del monomio?",
    "parte": "Qual è la parte letterale del monomio?",
    "riconosci": "L'espressione è un monomio? Se non lo è, scegli il motivo.",
    "forma": "Riduci il monomio a forma normale.",
    "valore": "Calcola il valore numerico del monomio.",
}

# The verdicts of level 2, as the spec writes them (one sentence each). An option is written on one
# line, \text{...}, or on two or three lines, \begin{gathered}\text{...}\\ \text{...}\end{gathered};
# the lines joined with a space must give back the sentence.
VERDICTS = {
    "monomio": "È un monomio",
    "somma": "No: una somma di termini non simili",
    "denominatore": "No: una lettera al denominatore",
    "esponente": "No: un esponente non naturale",
    "numero": "No: un numero al denominatore",
    "ordine": "No: le lettere non sono in ordine",
}


def verdict_text(latex):
    """The sentence of a verdict option, or None if the LaTeX is not text lines."""
    m = re.fullmatch(r"\\begin\{gathered\}(.*)\\end\{gathered\}", latex, re.S)
    lines = re.split(r"\\\\", m.group(1)) if m else [latex]
    if not 1 <= len(lines) <= 3:
        return None
    out = []
    for ln in lines:
        t = re.fullmatch(r"\s*\\text\{([^{}]*)\}\s*", ln)
        if not t:
            return None
        out.append(t.group(1).strip())
    return " ".join(out)


# ---------------------------------------------------------------------------
# Helpers


class _FreeParser(_Parser):
    """Like the shared parser, but any exponent is allowed (negative, fraction, a letter)."""

    def power(self):
        b = self.atom()
        if self.peek() == "^":
            self.eat()
            if self.peek() == "{":
                self.eat()
                e = self.expr()
                self.eat("}")
            else:
                tok = self.eat()
                if tok.isdigit():
                    e = Integer(tok)
                elif len(tok) == 1 and "a" <= tok <= "z":
                    e = SYMS[tok]
                else:
                    raise ParseError(f"bad exponent {tok!r}")
            b = b**e
        return b


def parse_free(latex):
    p = _FreeParser(tokenize(latex))
    v = p.expr()
    if p.peek() is not None:
        raise ParseError(f"trailing token {p.peek()!r}")
    return v


def group(toks, i):
    """toks[i] is '{': returns (inner tokens, index after the closing '}')."""
    assert toks[i] == "{"
    depth = 0
    for j in range(i, len(toks)):
        if toks[j] == "{":
            depth += 1
        elif toks[j] == "}":
            depth -= 1
            if depth == 0:
                return toks[i + 1 : j], j + 1
    raise ParseError("unbalanced braces")


def structure(latex):
    """Defects read from the LaTeX of level 2: top-level sum, letter or number in a denominator
    (outside exponents), exponents that are negative or otherwise not natural."""
    toks = tokenize(latex)
    found = {"somma": False, "den_lettera": False, "den_numero": False, "esp_negativo": False, "esp_altro": False}

    def scan(ts, in_exp, top):
        depth = 0
        i = 0
        while i < len(ts):
            t = ts[i]
            if t in ("(", "[", "\\{"):
                depth += 1
            elif t in (")", "]", "\\}"):
                depth -= 1
            elif t in ("+", "-") and top and depth == 0 and i > 0:
                found["somma"] = True
            if t == "^":
                if i + 1 < len(ts) and ts[i + 1] == "{":
                    inner, nxt = group(ts, i + 1)
                else:
                    inner, nxt = ts[i + 1 : i + 2], i + 2
                if len(inner) == 1 and inner[0].isdigit():
                    pass
                elif inner and inner[0] == "-":
                    found["esp_negativo"] = True
                else:
                    found["esp_altro"] = True
                scan(inner, True, False)
                i = nxt
                continue
            if t == "\\frac":
                num, j = group(ts, i + 1)
                den, k = group(ts, j)
                scan(num, in_exp, False)
                scan(den, in_exp, False)
                if not in_exp:
                    if any(len(x) == 1 and "a" <= x <= "z" for x in den):
                        found["den_lettera"] = True
                    elif all(x.isdigit() for x in den):
                        found["den_numero"] = True
                i = k
                continue
            i += 1

    scan(toks, False, True)
    return found


def rat_latex_errors(latex, r, where):
    """A number option or answer: its LaTeX parses to r, fractions reduced, sign outside."""
    errs = forbidden(latex, where)
    try:
        if parse(latex) != r:
            errs.append(f"{where} latex {latex} != {r}")
    except ParseError as e:
        errs.append(f"{where} latex does not parse ({e}): {latex}")
    return errs


def check_number_choice(sample, truth):
    errs = []
    ch = sample.get("choice")
    if ch is None:
        return ["no choice variant"]
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"choice has {len(opts)} options, expected 4")
    vals = []
    for o in opts:
        if len(o.get("values", [])) != 1 or not re.fullmatch(r"-?\d+(/\d+)?", o["values"][0]):
            return errs + [f"bad option values {o.get('values')}"]
        v = Rational(o["values"][0])
        vals.append(v)
        errs += rat_latex_errors(o.get("latex", ""), v, "option")
    if len(set(vals)) != len(vals):
        errs.append(f"choice options not distinct: {vals}")
    if sum(1 for v in vals if v == truth) != 1:
        errs.append(f"{sum(1 for v in vals if v == truth)} options equal the truth {truth}")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not (0 <= idx < len(vals)) or vals[idx] != truth:
        errs.append(f"choice.correct {idx} does not point at {truth}")
    return errs


def check_number_answer(sample, truth):
    ans = sample["answer"]
    if ans.get("kind") != "number":
        return ["answer.kind must be number"]
    try:
        if Rational(ans["value"]) != truth:
            return [f"answer {ans['value']} != {truth}"]
    except (TypeError, ValueError):
        return [f"answer value not a rational: {ans.get('value')}"]
    return []


def check_mono_answer(sample, truth):
    errs = []
    ans = sample["answer"]
    if ans.get("kind") != "expression":
        return ["answer.kind must be expression"]
    if not same(val(ans["value"]), truth):
        errs.append(f"answer value {ans['value']} != {truth}")
    try:
        if not same(parse(ans["latex"]), truth):
            errs.append(f"answer latex {ans['latex']} != {truth}")
    except ParseError as e:
        errs.append(f"answer latex does not parse ({e})")
    errs += forbidden(ans["latex"], "answer")
    errs += normal_form_errors(ans["latex"])
    return errs


def mono_from_params(d):
    return Rational(d["c"]) * Mul(*[SYMS[k] ** int(n) for k, n in d["e"].items()])


# ---------------------------------------------------------------------------
# Levels


def level1(sample):
    errs = []
    prob = sample["problem"]
    try:
        parts = mono_parts(parse(prob))
    except ParseError as e:
        return [f"problem does not parse ({e})"], None
    if parts is None:
        return [f"problem is not a monomial: {prob}"], None
    coef, exps = parts
    if not exps:
        errs.append("level 1: at least one letter")
    if "\\frac" in prob and re.search(r"\\frac\{\d*[a-z]", prob):
        if not re.fullmatch(r"-?\\frac\{[1-9]?\d*(?:[a-z](?:\^\d)?)+\}\{\d+\}", prob):
            errs.append(f"level 1: fraction form with letters only in the numerator: {prob}")
        if coef.is_integer:
            errs.append("level 1: fraction form with an integer coefficient")
        if re.match(r"-?\\frac\{1[a-z]", prob):
            errs.append("level 1: explicit 1 in the numerator")
    else:
        errs += normal_form_errors(prob, "problem")
    prompt = sample.get("prompt")
    if prompt == PROMPTS["parte"]:
        truth = Mul(*[SYMS[k] ** n for k, n in exps.items()])
        errs += check_mono_answer(sample, truth)
        errs += check_choice(sample, truth)
        kind = "parte letterale"
    elif prompt == PROMPTS["coefficiente"]:
        errs += check_number_answer(sample, coef)
        errs += check_number_choice(sample, coef)
        kind = "coefficiente 1 o -1" if abs(coef) == 1 else "coefficiente intero" if coef.is_integer else "coefficiente frazionario"
    else:
        return [f"unexpected prompt {prompt!r}"], None
    return errs, kind


def level2(sample):
    errs = []
    prob = sample["problem"]
    if sample.get("prompt") != PROMPTS["riconosci"]:
        errs.append("level 2: wrong prompt")
    try:
        expr = parse_free(prob)
        st = structure(prob)
    except (ParseError, AssertionError) as e:
        return [f"problem does not parse ({e}): {prob}"], None
    try:
        is_mono = mono_parts(expr) is not None
    except Exception:  # noqa: BLE001 - Poly on 2**x and similar: not a monomial
        is_mono = False
    defects = [k for k in ("somma", "den_lettera", "esp_negativo", "esp_altro") if st[k]]
    if is_mono != (not defects):
        errs.append(f"SymPy says monomial={is_mono}, structure says defects={defects}: {prob}")
    if len(defects) > 1:
        errs.append(f"more than one defect {defects}: {prob}")
    if is_mono:
        truth, kind = "monomio", "monomio"
        normal = sample["params"].get("normal")
        if not normal or not same(mono_from_params(normal), expr):
            errs.append("params.normal does not match the expression")
        if "\\cdot" in prob and not re.fullmatch(r"-?\d+(?: \\cdot [a-z])+", prob):
            errs.append(f"unexpected product form {prob}")
    elif defects:
        d = defects[0]
        truth = {"somma": "somma", "den_lettera": "denominatore", "esp_negativo": "esponente", "esp_altro": "esponente"}[d]
        kind = {"somma": "somma", "den_lettera": "lettera al denominatore", "esp_negativo": "esponente negativo", "esp_altro": "esponente non naturale"}[d]
        if d == "somma":
            # two terms, each a monomial, with different literal parts
            terms = re.split(r"\s[+-]\s", prob)
            ps = [mono_parts(parse(t)) for t in terms]
            if len(terms) != 2 or None in ps or ps[0][1] == ps[1][1]:
                errs.append(f"sum of similar terms or not of two monomials: {prob}")
    else:
        return errs + ["no verdict"], None

    ans = sample["answer"]
    if ans.get("kind") != "choice":
        return errs + ["level 2: answer must be a choice"], kind
    opts = ans.get("options", [])
    labels = [o.get("values", [None])[0] for o in opts]
    if len(opts) != 4 or len(set(labels)) != 4:
        errs.append(f"need 4 distinct verdicts: {labels}")
    for o, lab in zip(opts, labels):
        if lab not in VERDICTS or verdict_text(o.get("latex", "")) != VERDICTS[lab]:
            errs.append(f"unknown verdict or wrong text: {lab} {o.get('latex')}")
    if "monomio" not in labels:
        errs.append("the verdict 'monomio' must be shown")
    if ("numero" in labels) != st["den_numero"]:
        errs.append("'numero al denominatore' shown iff a number is in a denominator")
    if "ordine" in labels and not (st["esp_negativo"] or "\\cdot" in prob):
        errs.append("'ordine' is shown only with a negative exponent or a product not in normal form")
    if st["esp_negativo"] and "denominatore" in labels:
        errs.append("negative exponent with the ambiguous 'denominatore' verdict")
    idx = ans.get("correct")
    if not isinstance(idx, int) or not (0 <= idx < len(labels)) or labels[idx] != truth:
        errs.append(f"correct {idx} does not point at {truth}")
    ch = sample.get("choice")
    if ch != ans:
        errs.append("choice must equal the answer")
    return errs, kind


def split_factors(prob):
    return [f.strip() for f in prob.split("\\cdot")]


def level34(sample, lvl):
    errs = []
    prob = sample["problem"]
    if sample.get("prompt") != PROMPTS["forma"]:
        errs.append("wrong prompt")
    try:
        truth = parse(prob)
        fparts = [mono_parts(parse(f)) for f in split_factors(prob)]
    except ParseError as e:
        return [f"problem does not parse ({e}): {prob}"], None
    tp = mono_parts(truth)
    if tp is None or None in fparts:
        return [f"not a product of monomials: {prob}"], None
    coef, exps = tp
    errs += check_mono_answer(sample, truth)
    errs += check_choice(sample, truth)
    if len(fparts) < 2:
        errs.append("at least two factors")
    counts = {}
    for _, e in fparts:
        for k in e:
            counts[k] = counts.get(k, 0) + 1
    if not any(n >= 2 for n in counts.values()):
        errs.append("no letter repeated in two factors")
    if abs(coef.p) > 60 or coef.q > 9 or max(exps.values(), default=0) > 9:
        errs.append(f"result too big: {truth}")
    number_power = bool(re.search(r"(?:\d|\\right\)|\))\^", prob))
    fracs = sum(1 for c, _ in fparts if not c.is_integer)
    if lvl == 3:
        if "\\frac" in prob or number_power:
            errs.append("level 3: integer coefficients, no powers of numbers")
        if "-" not in prob:
            errs.append("level 3: at least one minus sign")
        kind = "risultato negativo" if coef < 0 else "risultato positivo"
    else:
        if number_power:
            kind = "potenza di un numero"
            if not re.match(r"(?:\d|\(-\d\)|\\left\(-?\\frac\{\d\}\{\d\}\\right\))\^[2-4][a-z]", prob):
                errs.append(f"level 4: the power must be the coefficient of the first factor: {prob}")
        elif fracs >= 2:
            kind = "frazioni"
            raw_den = 1
            for c, _ in fparts:
                raw_den *= c.q
            if raw_den == coef.q:
                errs.append("level 4: nothing to simplify")
        else:
            return errs + [f"level 4: neither fractions nor a power: {prob}"], None
    errs += check_steps(sample)
    return errs, kind


def level56(sample, lvl):
    errs = []
    prob = sample["problem"]
    if sample.get("prompt") != PROMPTS["valore"]:
        errs.append("wrong prompt")
    m = re.fullmatch(r"(.+?) \\quad \\text\{per \} (.+)", prob)
    if not m:
        return [f"problem is not 'monomial \\quad per ...': {prob}"], None
    mono_tex, assign = m.groups()
    errs += forbidden(mono_tex)
    errs += normal_form_errors(mono_tex, "monomial")
    try:
        mexpr = parse(mono_tex)
        values = {}
        for part in re.split(r",\\;\s*", assign):
            am = re.fullmatch(r"([a-z]) = (.+)", part.strip())
            if not am:
                raise ParseError(f"bad assignment {part}")
            values[am.group(1)] = parse(am.group(2))
    except ParseError as e:
        return [f"problem does not parse ({e}): {prob}"], None
    parts = mono_parts(mexpr)
    if parts is None:
        return ["not a monomial"], None
    coef, exps = parts
    if sorted(values) != sorted(exps):
        errs.append(f"values {sorted(values)} for letters {sorted(exps)}")
    if sum(exps.values()) > 5:
        errs.append("degree above 5")
    truth = Rational(mexpr.subs({SYMS[k]: v for k, v in values.items()}))
    errs += check_number_answer(sample, truth)
    if sample["params"].get("value") != str(truth):
        errs.append(f"params.value {sample['params'].get('value')} != {truth}")
    errs += check_number_choice(sample, truth)
    vs = list(values.values())
    if lvl == 5:
        if not coef.is_integer or not all(v.is_integer for v in vs):
            errs.append("level 5: integers only")
        if any(v == 0 for v in vs):
            kind = "una lettera vale zero"
            if truth != 0:
                errs.append("zero letter but nonzero value")
        elif any(v < 0 for v in vs):
            kind = "valore negativo"
        else:
            kind = "valori positivi"
        if abs(truth) > 300:
            errs.append(f"value too big {truth}")
    else:
        if all(v.is_integer for v in vs) or not any(v < 0 for v in vs) or any(v == 0 for v in vs):
            errs.append("level 6: a fractional value, a negative value, no zero")
        if abs(coef.p) > 9 or coef.q > 9:
            errs.append(f"coefficient too big {coef}")
        if truth.q > 9 or abs(truth.p) > 30:
            errs.append(f"value not simple {truth}")
        kind = "risultato intero" if truth.is_integer else "risultato frazionario"
    errs += check_steps(sample)
    return errs, kind


def check(sample):
    lvl = sample["level"]
    prob = sample["problem"]
    errs = forbidden(prob) if lvl != 5 and lvl != 6 else []
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("steps or solution missing")
    if lvl == 1:
        e, kind = level1(sample)
    elif lvl == 2:
        e, kind = level2(sample)
    elif lvl in (3, 4):
        e, kind = level34(sample, lvl)
    elif lvl in (5, 6):
        e, kind = level56(sample, lvl)
    else:
        return [f"unknown level {lvl}"], None
    if kind is not None and sample["params"].get("case") != kind:
        e.append(f"params.case {sample['params'].get('case')} but the exercise is {kind}")
    return errs + e, kind
