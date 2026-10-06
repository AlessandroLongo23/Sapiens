"""Checker for funzioni-monotone (specs/exercises/funzioni-monotone.md).

Written from the spec. Levels 1 and 7 are read from the sentence of the problem; in levels 2-5 the formula is
read from the problem, its turning point is found here (vertex of the parabola, zero of the argument of the
absolute value) and the direction on each side is decided by evaluating the function; in level 6 every option
is a formula, read from its LaTeX, and its monotonicity on its own domain is decided on exact sample points.
"""
import re

from sympy import Abs, Poly, Rational

from checkers._funzioni import choice_of, common, critical_points, domain, inside, intervals, parse_py, plain, same_function, tex_to_expr, value_at, x

DEF = {"crescente": "crescente", "decrescente": "decrescente", "crescente-lato": "crescente in senso lato", "decrescente-lato": "decrescente in senso lato"}
LINE = {"crescente": "\\text{crescente su tutto }\\mathbb{R}", "decrescente": "\\text{decrescente su tutto }\\mathbb{R}", "costante": "\\text{costante}", "meta": "\\text{crescente solo per }x > 0"}
HALVES = {"crescente": (0.38, 0.62), "decrescente": (0.38, 0.62)}
CASE_RANGES = {
    1: {k: (0.17, 0.33) for k in DEF},
    2: {"crescente": (0.33, 0.55), "decrescente": (0.33, 0.55), "costante": (0.05, 0.18)},
    3: HALVES,
    4: HALVES,
    5: HALVES,
    6: HALVES,
    7: HALVES,
}
GRID = [Rational(n, 2) for n in range(-20, 21)]


def labelled(ch, names, truth, errs):
    for o in ch["options"]:
        if len(o["values"]) != 1 or names.get(o["values"][0]) != o["latex"]:
            errs.append(f"opzione {o['latex']!r} diversa da quelle della specifica")
    if {o["values"][0] for o in ch["options"]} != set(names):
        errs.append("le quattro opzioni non sono quelle della specifica")
    if ch["options"][ch["correct"]]["values"] != [truth]:
        errs.append(f"opzione giusta sbagliata: la risposta è {truth}")


def monotonic(f):
    """'crescente', 'decrescente' or None, on the whole domain of f, from its values on a grid of the domain."""
    dom = domain(f)
    vals = [value_at(f, v) for v in GRID if inside(dom, v)]
    if len(vals) < 6:
        raise ValueError("troppo pochi punti nel dominio")
    if all(a < b for a, b in zip(vals, vals[1:])):
        return "crescente"
    if all(a > b for a, b in zip(vals, vals[1:])):
        return "decrescente"
    return None


def check(sample):
    errs = common(sample)
    level = sample["level"]
    if level not in range(1, 8):
        return errs + [f"livello {level} sconosciuto"], None
    ch, e2 = choice_of(sample)
    errs += e2
    if ch is None or sample["answer"]["kind"] != "choice":
        return errs + ["la risposta deve essere a scelta multipla"], None
    problem = sample["problem"]
    right = ch["options"][ch["correct"]]

    if level == 1:
        text, extra = plain(problem)
        if text != "Per ogni coppia di numeri x_1 < x_2 di un intervallo I si ha" or len(extra) != 1:
            return errs + ["problema illeggibile"], None
        m = re.fullmatch(r"f\(x_1\) (<|>|\\leq|\\geq) f\(x_2\)", extra[0])
        d = re.fullmatch(r"f\(x_2\) - f\(x_1\) (<|>|\\leq|\\geq) 0", extra[0])
        if m:
            truth = {"<": "crescente", ">": "decrescente", "\\leq": "crescente-lato", "\\geq": "decrescente-lato"}[m.group(1)]
        elif d:
            truth = {">": "crescente", "<": "decrescente", "\\geq": "crescente-lato", "\\leq": "decrescente-lato"}[d.group(1)]
        else:
            return errs + ["disuguaglianza illeggibile"], None
        labelled(ch, {k: "\\text{" + v + "}" for k, v in DEF.items()}, truth, errs)
        if sample["solution"] != right["latex"]:
            errs.append("soluzione scritta diversa dalla risposta")
        return errs, truth

    if level == 6:
        m = re.fullmatch(r"Quale funzione è (crescente|decrescente) in tutto il suo dominio\?", sample["prompt"])
        if not m:
            return errs + ["consegna illeggibile"], None
        ask = m.group(1)
        found = []
        for i, o in enumerate(ch["options"]):
            if not o["latex"].startswith("y = "):
                errs.append("ogni opzione è una funzione y = …")
                continue
            f = tex_to_expr(o["latex"][4:])
            if not same_function(f, parse_py(o["values"][0])):
                errs.append(f"opzione scritta {o['latex']!r} diversa dal suo valore")
            if monotonic(f) == ask:
                found.append(i)
        if found != [ch["correct"]]:
            errs.append(f"le opzioni {ask} in tutto il dominio sono {found}, quella indicata è {ch['correct']}")
        if sample["solution"] != right["latex"]:
            errs.append("soluzione scritta diversa dalla risposta")
        return errs, ask

    if level == 7:
        text, extra = plain(problem)
        m = re.fullmatch(r"La funzione f è (crescente|decrescente) su tutto \\mathbb\{R\} e f\((-?\d+)\) = (-?\d+)\. Per quali x si ha f\(x\) ([<>]) (-?\d+)\?", text)
        if not m or extra:
            return errs + ["problema illeggibile"], None
        mono, a, k, rel, k2 = m.group(1), m.group(2), m.group(3), m.group(4), m.group(5)
        if k != k2:
            errs.append("il valore della disequazione non è quello dato")
        to_right = (mono == "crescente") == (rel == ">")
        truth = [f"({a},oo)"] if to_right else [f"(-oo,{a})"]
        kind = mono
    else:
        if not problem.startswith("f(x) = "):
            return errs + ["il problema deve dare f(x)"], None
        f = tex_to_expr(problem[7:])
        if not same_function(f, parse_py(sample["params"]["fx"])):
            errs.append("la formula scritta è diversa da quella dei parametri")
        if level == 2:
            p = Poly(f, x)
            if p.degree() > 1:
                return errs + ["livello 2: una retta"], None
            slope = p.coeff_monomial(x)
            if slope.q not in (1, 2):
                errs.append("livello 2: coefficiente angolare intero o con denominatore 2")
            truth = "crescente" if slope > 0 else "decrescente" if slope < 0 else "costante"
            labelled(ch, LINE, truth, errs)
            if sample["solution"] != right["latex"]:
                errs.append("soluzione scritta diversa dalla risposta")
            return errs, truth
        m = re.fullmatch(r"In quale intervallo la funzione è (crescente|decrescente)\?", sample["prompt"])
        if not m:
            return errs + ["consegna illeggibile"], None
        ask = kind = m.group(1)
        if level in (3, 4):
            p = Poly(f, x)
            if p.degree() != 2:
                return errs + ["livelli 3 e 4: una parabola"], None
            a2, b1 = p.coeff_monomial(x**2), p.coeff_monomial(x)
            if (a2 > 0) != (level == 3):
                errs.append("segno di a diverso da quello del livello")
            t = -b1 / (2 * a2)
            if t.q != 1 or t == 0 or abs(t) > 5:
                errs.append("ascissa del vertice intera, non nulla, tra -5 e 5")
        else:
            args = [g.args[0] for g in f.atoms(Abs)]
            if len(args) != 1:
                return errs + ["livello 5: un solo valore assoluto"], None
            roots = critical_points(args[0])
            if len(roots) != 1 or roots[0] == 0 or roots[0].q != 1:
                return errs + ["livello 5: argomento di primo grado con zero intero non nullo"], None
            t = roots[0]
        rises_after = value_at(f, t + 1) > value_at(f, t)
        if (value_at(f, t - 1) > value_at(f, t)) != rises_after:
            errs.append("la funzione non cambia verso nel punto trovato")
        truth = [f"[{t},oo)"] if rises_after == (ask == "crescente") else [f"(-oo,{t}]"]
        opened = [truth[0].replace("[", "(").replace("]", ")")]
        if any(o["values"] == opened for o in ch["options"]):
            errs.append("un distrattore è l'intervallo giusto scritto aperto")
    for o in ch["options"]:
        if intervals(o["latex"]) != o["values"]:
            errs.append(f"opzione scritta {o['latex']!r} diversa dai suoi valori")
    if right["values"] != truth:
        errs.append(f"opzione giusta sbagliata: {truth}")
    if sample["solution"] != right["latex"]:
        errs.append("soluzione scritta diversa dalla risposta")
    return errs, kind
