"""Checker for funzioni-dispari-pari (specs/exercises/funzioni-dispari-pari.md).

Written from the spec. The formula (and the domain, where the problem gives one) is read from the problem; the
parity is decided here from the definition: the domain must be its own mirror image, and f(-v) is compared with
f(v) and -f(v) at exact rational points of the domain. Levels 5 and 6 are read from the sentence of the problem.
"""
import re

from sympy import Poly, Rational, expand

from checkers._funzioni import PROBES, choice_of, common, domain, inside, intervals, mirrored, number, parse_py, plain, tex_to_expr, value_at, x

LABELS = {"pari": "pari", "dispari": "dispari", "ne": "né pari né dispari", "entrambe": "sia pari sia dispari"}
POSITIVE = [Rational(1, 7), Rational(1, 3), Rational(1, 2), Rational(2, 3), Rational(1), Rational(3, 2), Rational(2), Rational(5, 2), Rational(3), Rational(4), Rational(11, 2), Rational(7)]
THIRDS = {"pari": (0.25, 0.42), "dispari": (0.25, 0.42), "ne": (0.25, 0.42)}
CASE_RANGES = {
    2: THIRDS,
    3: THIRDS,
    4: {"dominio dato": (0.38, 0.62), "formula": (0.38, 0.62)},
    5: {"pari": (0.30, 0.52), "dispari": (0.30, 0.52), "zero": (0.04, 0.18)},
}


def parity(f, dom):
    if not dom:
        raise ValueError("dominio vuoto")
    if mirrored(dom) != dom:
        return "ne"
    even = odd = True
    tested = 0
    for v in POSITIVE:
        if not inside(dom, v):
            continue
        a, b = value_at(f, v), value_at(f, -v)
        if a is None or b is None:
            raise ValueError("la funzione non esiste in un punto del dominio dato")
        tested += 1
        even = even and (a - b).simplify() == 0
        odd = odd and (a + b).simplify() == 0
    if tested < 3:
        raise ValueError("troppo pochi punti di prova nel dominio")
    return "entrambe" if even and odd else "pari" if even else "dispari" if odd else "ne"


def label_options(ch, truth, errs):
    seen = {}
    for o in ch["options"]:
        if len(o["values"]) != 1 or o["values"][0] not in LABELS or o["latex"] != "\\text{" + LABELS[o["values"][0]] + "}":
            errs.append(f"opzione {o['latex']!r} diversa dalle quattro della specifica")
        seen[o["values"][0]] = 1
    if len(seen) != 4:
        errs.append("servono le quattro risposte: pari, dispari, né pari né dispari, sia pari sia dispari")
    if ch["options"][ch["correct"]]["values"] != [truth]:
        errs.append(f"opzione giusta sbagliata: la risposta è {truth}")


def check(sample):
    errs = common(sample)
    level = sample["level"]
    if level not in range(1, 7):
        return errs + [f"livello {level} sconosciuto"], None
    ch, e2 = choice_of(sample)
    errs += e2
    if ch is None:
        return errs, None
    ans = sample["answer"]
    problem = sample["problem"]

    if level == 1:
        if not problem.startswith("f(x) = "):
            return errs + ["il problema deve dare f(x)"], None
        f = tex_to_expr(problem[7:])
        p = Poly(f, x)
        degs = [m[0] for m in p.monoms()]
        if not (2 <= len(degs) <= 3) or all(d % 2 == 0 for d in degs) or all(d % 2 == 1 for d in degs) or max(degs) > 5:
            errs.append("livello 1: due o tre termini, di grado pari e di grado dispari, fino al grado 5")
        if any(c.q != 1 for c in p.coeffs()):
            errs.append("livello 1: coefficienti interi")
        truth = expand(f.subs(x, -x))
        if ans["kind"] != "expression" or ans.get("form") != "expanded":
            return errs + ["la risposta deve essere un'espressione in forma normale"], None
        if expand(parse_py(ans["value"]) - truth) != 0 or expand(tex_to_expr(ans["latex"]) - truth) != 0:
            errs.append("f(-x) sbagliato")
        if "(" in ans["latex"]:
            errs.append("la risposta non è in forma normale")
        for o in ch["options"]:
            if expand(tex_to_expr(o["latex"]) - parse_py(o["values"][0])) != 0:
                errs.append(f"opzione scritta {o['latex']!r} diversa dal suo valore")
        if expand(parse_py(ch["options"][ch["correct"]]["values"][0]) - truth) != 0:
            errs.append("opzione giusta sbagliata")
        others = [expand(parse_py(o["values"][0]) - truth) for i, o in enumerate(ch["options"]) if i != ch["correct"]]
        if any(d == 0 for d in others):
            errs.append("un distrattore è uguale alla risposta")
        return errs, None

    if level in (2, 3, 4):
        if ans["kind"] != "choice":
            return errs + ["la risposta deve essere a scelta multipla"], None
        m = re.fullmatch(r"f\(x\) = (.+?)(?:, \\quad D = (.+))?", problem)
        if not m:
            return errs + ["problema illeggibile"], None
        f = tex_to_expr(m.group(1))
        given = intervals(m.group(2)) if m.group(2) else None
        natural = domain(f)
        if given and not all(inside(natural, v) for v in PROBES if inside(given, v)):
            errs.append("il dominio dato esce dal dominio naturale")
        dom = given or natural
        truth = parity(f, dom)
        label_options(ch, truth, errs)
        if truth == "entrambe":
            errs.append("la funzione nulla non si propone")
        if level == 2 and (not f.is_polynomial(x) or given):
            errs.append("livello 2: un polinomio su tutto ℝ")
        if level == 3 and (f.is_polynomial(x) or given or mirrored(dom) != dom):
            errs.append("livello 3: non un polinomio, dominio naturale simmetrico")
        if level == 4 and not given and mirrored(dom) == dom:
            errs.append("livello 4: dominio dato, oppure dominio naturale non simmetrico")
        if sample["solution"] != "\\text{" + LABELS[truth] + "}":
            errs.append("soluzione scritta diversa dalla risposta")
        kind = truth if level != 4 else ("dominio dato" if given else "formula")
        return errs, kind

    text, extra = plain(problem)
    if level == 5:
        m = re.fullmatch(r"La funzione f è (pari|dispari), è definita su tutto \\mathbb\{R\} e f\((-?\d+)\) = (-?\d+)\. Quanto vale f\((-?\d+)\)\?", text)
        if not m or extra:
            return errs + ["problema illeggibile"], None
        par, given, v, asked = m.group(1), int(m.group(2)), int(m.group(3)), int(m.group(4))
        if given == 0 or v == 0:
            errs.append("livello 5: il valore dato non è in zero e non è zero")
        if asked == -given:
            truth, kind = (v if par == "pari" else -v), par
        elif asked == 0 and par == "dispari":
            truth, kind = 0, "zero"
        else:
            return errs + ["il valore chiesto non si ricava dalla simmetria"], None
        if ans["kind"] != "number" or Rational(ans["value"]) != truth:
            errs.append(f"risposta sbagliata: {truth}")
        for o in ch["options"]:
            if [str(number(o["latex"]))] != o["values"]:
                errs.append(f"opzione scritta {o['latex']!r} diversa dal suo valore")
        if ch["options"][ch["correct"]]["values"] != [str(truth)]:
            errs.append("opzione giusta sbagliata")
        if sample["solution"] != f"f({asked}) = {truth}":
            errs.append("soluzione scritta diversa dalla risposta")
        return errs, kind

    # level 6
    two = re.fullmatch(r"Le funzioni f e g sono definite su tutto \\mathbb\{R\} e nessuna delle due vale sempre zero; f è (pari|dispari) e g è (pari|dispari)\. Com'è la funzione h\?", text)
    one = re.fullmatch(r"La funzione f è definita su tutto \\mathbb\{R\}, non vale sempre zero ed è (pari|dispari)\. Com'è la funzione h\?", text)
    if len(extra) != 1 or not (two or one):
        return errs + ["problema illeggibile"], None
    h = extra[0]
    if two and h == "h(x) = f(x) \\cdot g(x)":
        truth = "pari" if two.group(1) == two.group(2) else "dispari"
    elif two and h == "h(x) = f(x) + g(x)":
        truth = two.group(1) if two.group(1) == two.group(2) else "ne"
    elif one and h == "h(x) = -f(x)":
        truth = one.group(1)
    elif one and h in ("h(x) = \\lvert f(x) \\rvert", "h(x) = [f(x)]^2"):
        truth = "pari"
    else:
        return errs + [f"operazione sconosciuta: {h}"], None
    if ans["kind"] != "choice":
        return errs + ["la risposta deve essere a scelta multipla"], None
    label_options(ch, truth, errs)
    if sample["solution"] != "\\text{" + LABELS[truth] + "}":
        errs.append("soluzione scritta diversa dalla risposta")
    return errs, None
