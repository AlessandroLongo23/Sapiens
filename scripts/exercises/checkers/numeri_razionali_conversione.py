"""Checker for numeri-razionali-conversione, written from specs/exercises/numeri-razionali-conversione.md.

A decimal is valued as a geometric series (integer part + antiperiod / 10^a + period / (10^a (10^p - 1))),
not with the "numero senza virgola meno quello prima del periodo" rule the generator uses. The problem
and every option are parsed back from their LaTeX, so what the student sees is what is checked.
"""
import re

from sympy import Rational, factorint

from verify import rat

DEC_RE = re.compile(r"^(-?)(\d+)(?:\{,\}(\d*)(?:\\overline\{(\d+)\})?)?$")
FRAC_RE = re.compile(r"^(-?)\\frac\{(\d+)\}\{(\d+)\}$|^(-?\d+)$")

KINDS = ["intero", "limitato", "periodico semplice", "periodico misto"]

CASE_RANGES = {
    4: {"intero": (0.05, 0.16), "limitato": (0.22, 0.40), "periodico semplice": (0.22, 0.40), "periodico misto": (0.22, 0.40)},
    5: {"limitato": (0.30, 0.50), "periodico semplice": (0.20, 0.40), "periodico misto": (0.20, 0.40)},
}


def series_value(neg, i, ante, period):
    v = Rational(int(i))
    a = len(ante)
    if ante:
        v += Rational(int(ante), 10**a)
    if period:
        v += Rational(int(period), 10**a * (10 ** len(period) - 1))
    return -v if neg else v


def parse_decimal(latex):
    m = DEC_RE.match(latex)
    if not m:
        return None
    return {"neg": m.group(1) == "-", "int": m.group(2), "ante": m.group(3) or "", "period": m.group(4) or ""}


def parse_frac(latex):
    m = FRAC_RE.match(latex)
    if not m:
        return None
    if m.group(4) is not None:
        return Rational(int(m.group(4)))
    v = Rational(int(m.group(2)), int(m.group(3)))
    return -v if m.group(1) == "-" else v


def minimal(period):
    n = len(period)
    return not any(n % t == 0 and period[:t] * (n // t) == period for t in range(1, n))


def canonical(d):
    """Shortest antiperiod and period, no period 9, limited without trailing zeros."""
    a, p = d["ante"], d["period"]
    if p:
        if set(p) == {"9"} or set(p) == {"0"} or not minimal(p):
            return False
        if a and a[-1] == p[-1]:
            return False
    elif a and a.endswith("0"):
        return False
    return True


def kind_of(r):
    if r.q == 1:
        return "intero"
    ps = set(factorint(r.q))
    if ps <= {2, 5}:
        return "limitato"
    return "periodico misto" if ps & {2, 5} else "periodico semplice"


def check_choice(sample, truth, parse):
    errs = []
    ch = sample.get("choice")
    if ch is None:
        return ["no multiple-choice variant"]
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    vals = []
    for o in opts:
        v = rat(o["values"][0])
        vals.append(v)
        shown = parse(o["latex"])
        if shown is None:
            errs.append(f"option latex not parsable: {o['latex']}")
        elif shown != v:
            errs.append(f"option {o['latex']} shows {shown}, values say {v}")
    if len(set(vals)) != len(vals):
        errs.append("options not distinct")
    if sum(1 for v in vals if v == truth) != 1:
        errs.append("not exactly one correct option")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(vals) or vals[idx] != truth:
        errs.append("choice.correct is wrong")
    return errs


def parse_dec_value(latex):
    d = parse_decimal(latex)
    if d is None:
        return None
    if not canonical(d):
        return f"non-canonical {latex}"
    return series_value(d["neg"], d["int"], d["ante"], d["period"])


def check(sample):
    errs = []
    p = sample["params"]
    lvl = sample["level"]
    ans = sample["answer"]
    texts = [sample["problem"], sample["solution"]] + sample.get("steps", [])
    if any(re.search(r"\d\.\d", t) for t in texts):
        errs.append("decimal point instead of comma")
    if not sample.get("steps"):
        errs.append("no steps")
    kind = None
    if lvl in (1, 2, 3):
        d = parse_decimal(sample["problem"])
        if d is None:
            return [f"problem is not a decimal: {sample['problem']}"], None
        if d != {k: p["decimal"][k] for k in ("neg", "int", "ante", "period")}:
            errs.append("problem differs from params.decimal")
        truth = series_value(d["neg"], d["int"], d["ante"], d["period"])
        if ans.get("kind") != "number" or rat(ans["value"]) != truth:
            errs.append(f"answer {ans.get('value')} != {truth}")
        elif ans["value"] != (str(truth.p) if truth.q == 1 else f"{truth.p}/{truth.q}"):
            errs.append("answer not in reduced p/q form")
        a, per = len(d["ante"]), len(d["period"])
        if not canonical(d):
            errs.append("decimal not in canonical form")
        if not re.fullmatch(r"\d", d["int"]):
            errs.append("integer part must be 0-9")
        if lvl == 1:
            if per or not 1 <= a <= 3:
                errs.append("level 1: limited decimal with 1-3 decimals")
            if truth.q == 10**a:
                errs.append("level 1: the fraction must reduce")
            if truth.q == 1:
                errs.append("level 1: integer value")
        else:
            if d["neg"]:
                errs.append("negative periodic")
            if lvl == 2 and (a != 0 or not 1 <= per <= 3):
                errs.append("level 2: simple periodic, period 1-3 digits")
            if lvl == 3 and (not 1 <= a <= 2 or not 1 <= per <= 2 or a + per > 3):
                errs.append("level 3: mixed periodic, antiperiod and period 1-2 digits, at most 3 decimals")
        errs += check_choice(sample, truth, parse_frac)
    elif lvl == 4:
        m = re.fullmatch(r"\\frac\{(\d+)\}\{(\d+)\}", sample["problem"])
        if not m:
            return [f"problem is not a fraction: {sample['problem']}"], None
        n, d = int(m.group(1)), int(m.group(2))
        if (str(n), str(d)) != (p.get("num"), p.get("den")):
            errs.append("problem differs from params")
        if d < 2 or d > 120 or n < 1 or n > 200:
            errs.append("level 4: numbers out of range")
        kind = kind_of(Rational(n, d))
        if p.get("case") != kind:
            errs.append(f"params.case {p.get('case')} but fraction gives {kind}")
        if ans.get("kind") != "choice":
            errs.append("level 4 answer must be a choice")
        else:
            got = [o["values"][0] for o in ans["options"]]
            if sorted(got) != sorted(KINDS):
                errs.append(f"options {got} are not the four kinds")
            if got[ans["correct"]] != kind:
                errs.append(f"correct option {got[ans['correct']]} but fraction gives {kind}")
            for o in ans["options"]:
                if o["values"][0] not in o["latex"]:
                    errs.append(f"option latex {o['latex']} does not say {o['values'][0]}")
        if sample.get("choice") and sample["choice"] != ans:
            errs.append("choice differs from answer")
    elif lvl == 5:
        m = re.fullmatch(r"\\frac\{(\d+)\}\{(\d+)\}", sample["problem"])
        if not m:
            return [f"problem is not a fraction: {sample['problem']}"], None
        n, d = int(m.group(1)), int(m.group(2))
        truth = Rational(n, d)
        if truth.p != n:
            errs.append("level 5: fraction not reduced")
        if ans.get("kind") != "number" or rat(ans["value"]) != truth:
            errs.append("answer differs from the fraction")
        dec = p["decimal"]
        if series_value(dec["neg"], dec["int"], dec["ante"], dec["period"]) != truth:
            errs.append(f"params.decimal {dec} != {truth}")
        if not canonical(dec):
            errs.append("params.decimal not canonical")
        a, per = len(dec["ante"]), len(dec["period"])
        if per == 0 and a > 4:
            errs.append("level 5: more than 4 decimals")
        if per and (per > 3 or a + per > 4):
            errs.append("level 5: periodic too long")
        kind = kind_of(truth)
        if kind == "intero":
            errs.append("level 5: integer")
        if p.get("case") != kind:
            errs.append("params.case wrong")
        shown = sample["solution"].split("=")[-1].strip()
        if parse_dec_value(shown) != truth:
            errs.append(f"solution shows {shown}, not {truth}")
        errs += check_choice(sample, truth, parse_dec_value)
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
