"""Checker for funzioni-reali-di-variabile-reale (specs/exercises/funzioni-reali-di-variabile-reale.md).

Written from the spec. The formula is read from the problem as the student sees it and compared with the one in
params; domain, zeros and sign are recomputed by probing the formula (checkers/_funzioni.py), never taken from
the generator. Every option is read back from its LaTeX.
"""
import re

from sympy import Pow, Rational, denom, fraction, together

from checkers._funzioni import choice_of, common, critical_points, domain, function_of, intervals, number, sign_set, x, zeros

CASE_RANGES = {
    2: {"verso destra": (0.50, 0.80), "verso sinistra": (0.20, 0.50)},
    3: {"esterni": (0.38, 0.62), "interni": (0.38, 0.62)},
    4: {"un punto tolto": (0.22, 0.45), "semiretta": (0.22, 0.45), "aperti": (0.22, 0.45)},
    5: {"fuori": (0.52, 0.78), "tra": (0.22, 0.48)},
    6: {"nessuno": (0.15, 0.35), "uno": (0.30, 0.60), "due": (0.20, 0.50)},
    7: {"positiva": (0.38, 0.62), "negativa": (0.38, 0.62)},
}


def excluded_points(dom):
    """The points left out when the domain is ℝ without some points; None otherwise."""
    if not dom or not dom[0].startswith("(-oo,") or not dom[-1].endswith(",oo)"):
        return None
    pts = []
    for a, b in zip(dom, dom[1:]):
        if not a.endswith(")") or not b.startswith("(") or a[:-1].split(",")[1] != b[1:].split(",")[0]:
            return None
        pts.append(a[:-1].split(",")[1])
    return pts


def zero_list(latex):
    if latex == "\\text{nessuno zero}":
        return []
    out = []
    for part in latex.split(",\\ "):
        m = re.fullmatch(r"x = (.+)", part)
        if not m:
            raise ValueError(f"zeri illeggibili: {latex!r}")
        out.append(str(number(m.group(1))))
    return out


def has_sqrt(e):
    return any(p.exp.is_Rational and p.exp.q == 2 for p in e.atoms(Pow))


def ends_closed(t):
    lo, hi = t[1:-1].split(",")
    return (lo == "-oo" or t[0] == "[") and (hi == "oo" or t[-1] == "]")


def check(sample):
    errs = common(sample)
    level = sample["level"]
    if level not in range(1, 8):
        return errs + [f"livello {level} sconosciuto"], None
    try:
        f = function_of(sample)
    except ValueError as e:
        return errs + [str(e)], None
    ch, e2 = choice_of(sample)
    errs += e2
    if ch is None:
        return errs, None
    ans = sample["answer"]
    dom = domain(f)
    kind = None

    if level in (1, 6):
        if ans["kind"] != "set":
            return errs + ["la risposta deve essere un insieme di numeri"], None
        if level == 1:
            truth = excluded_points(dom)
            if truth is None or len(truth) != 2:
                return errs + ["livello 1: il dominio deve essere ℝ senza due punti"], None
            if any(Rational(t).q != 1 or abs(Rational(t)) > 7 for t in truth):
                errs.append("livello 1: valori esclusi interi tra -7 e 7")
            n, d = fraction(together(f))
            if d.as_poly(x) is None or d.as_poly(x).degree() != 2 or n.as_poly(x).degree() > 1:
                errs.append("livello 1: denominatore di secondo grado, numeratore al massimo di primo")
            read = lambda o: excluded_points(intervals(o["latex"])) or []  # noqa: E731
            if ans["latex"] != "D = " + ch["options"][ch["correct"]]["latex"]:
                errs.append("la soluzione scritta è diversa dall'opzione giusta")
        else:
            truth = [str(z) for z in zeros(f)]
            read = lambda o: zero_list(o["latex"])  # noqa: E731
            if ans["latex"] != ch["options"][ch["correct"]]["latex"]:
                errs.append("la soluzione scritta è diversa dall'opzione giusta")
            kind = ["nessuno", "uno", "due"][min(len(truth), 2)]
            if sample["prompt"] != "Trova gli zeri della funzione.":
                errs.append("consegna diversa da quella della specifica")
        if ans["values"] != truth:
            errs.append(f"risposta {ans['values']} diversa da quella ricalcolata {truth}")
        for o in ch["options"]:
            if read(o) != o["values"]:
                errs.append(f"opzione scritta {o['latex']!r} diversa dai suoi valori")
        if ch["options"][ch["correct"]]["values"] != truth:
            errs.append("opzione giusta sbagliata")
        return errs, kind

    if ans["kind"] != "choice":
        return errs + ["la risposta deve essere a scelta multipla"], None
    if level == 7:
        m = re.fullmatch(r"Per quali x la funzione è (positiva|negativa)\?", sample["prompt"])
        if not m:
            return errs + ["consegna diversa da quella della specifica"], None
        kind = m.group(1)
        truth = sign_set(f, 1 if kind == "positiva" else -1)
        if any("[" in t or "]" in t for t in truth):
            errs.append("livello 7: intervalli aperti")
        if has_sqrt(f) or denom(together(f)).as_poly(x).degree() != 1:
            errs.append("livello 7: una frazione con il denominatore di primo grado")
        if len(critical_points(f)) != len(set(critical_points(f))):
            errs.append("livello 7: zeri semplici")
    else:
        if sample["prompt"] != "Trova il dominio della funzione.":
            errs.append("consegna diversa da quella della specifica")
        truth = dom
        if not has_sqrt(f):
            errs.append(f"livello {level}: serve una radice quadrata")
        if level == 2:
            kind = "verso destra" if truth and truth[0].endswith(",oo)") else "verso sinistra"
            if len(truth) != 1 or not (truth[0].startswith("[") or truth[0].endswith("]")):
                errs.append("livello 2: una semiretta con l'estremo incluso")
        if level == 3:
            kind = "esterni" if len(truth) == 2 else "interni"
            if not all(ends_closed(t) for t in truth):
                errs.append("livello 3: estremi compresi")
            if len(critical_points(f)) != 2:
                errs.append("livello 3: due zeri distinti del radicando")
        if level == 4:
            opened = all(t.startswith("(") and t.endswith(")") for t in truth)
            kind = "aperti" if opened else "un punto tolto" if len(truth) == 2 else "semiretta"
        if level == 5:
            kind = "fuori" if len(truth) == 2 else "tra"
            closed = sum(t.startswith("[") + t.endswith("]") for t in truth)
            if closed != 1:
                errs.append("livello 5: un estremo incluso e uno escluso")
    if not truth:
        errs.append("la risposta non può essere l'insieme vuoto")
    if sample["params"].get("truth") != truth:
        errs.append(f"params.truth diverso dall'insieme ricalcolato {truth}")
    for o in ch["options"]:
        try:
            if intervals(o["latex"]) != o["values"]:
                errs.append(f"opzione scritta {o['latex']!r} diversa dai suoi valori")
        except ValueError as e:
            errs.append(str(e))
    if ch["options"][ch["correct"]]["values"] != truth:
        errs.append("opzione giusta sbagliata")
    want = ("D = " if level != 7 else "") + ch["options"][ch["correct"]]["latex"]
    if sample["solution"] != want:
        errs.append("la soluzione scritta è diversa dall'opzione giusta")
    return errs, kind
