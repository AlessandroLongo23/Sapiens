"""Checker for grafici-trasformazioni (specs/exercises/grafici-trasformazioni.md).

Written from the spec. The point P and the formula of g are read from the problem, and the image of P is
recomputed here from the rule of each transformation; in level 2 the vertex is found from the formula; in level
5 the formula asked for is rebuilt with SymPy from the description and compared, value by value, with every
option.
"""
import re

from sympy import Abs, Poly, Pow, Rational, sqrt

from checkers._funzioni import choice_of, common, critical_points, parse_py, plain, point, same_function, tex_to_expr, value_at, x

N = r"(-?\d+)"
CASE_RANGES = {
    1: {"verticale": (0.38, 0.62), "orizzontale": (0.38, 0.62)},
    2: {"assoluto": (0.25, 0.42), "radice": (0.25, 0.42), "parabola": (0.25, 0.42)},
    3: {"asse x": (0.25, 0.42), "asse y": (0.25, 0.42), "origine": (0.25, 0.42)},
    4: {"verticale": (0.38, 0.62), "orizzontale": (0.38, 0.62)},
    6: {"fuori": (0.38, 0.62), "dentro": (0.38, 0.62)},
    7: {"fuori e dentro": (0.48, 0.72), "dentro": (0.28, 0.52)},
}
BASES = {"\\lvert x \\rvert": Abs(x), "\\sqrt{x}": sqrt(x), "x^2": x**2}


def image(level, g, a, b):
    """Where P(a, b) of the graph of f goes on the graph of g, and the case; None if g is not of the level."""

    def sign(s):
        return -1 if s == "-" else 1

    if level == 1:
        m = re.fullmatch(r"f\(x\) ([+-]) (\d+)", g)
        if m:
            return (a, b + sign(m.group(1)) * int(m.group(2))), "verticale"
        m = re.fullmatch(r"f\(x ([+-]) (\d+)\)", g)
        if m:
            return (a - sign(m.group(1)) * int(m.group(2)), b), "orizzontale"
    if level == 3:
        table = {"-f(x)": ((a, -b), "asse x"), "f(-x)": ((-a, b), "asse y"), "-f(-x)": ((-a, -b), "origine")}
        return table.get(g, (None, None))
    if level == 4:
        m = re.fullmatch(r"(\d+)f\(x\)", g)
        if m:
            return (a, b * int(m.group(1))), "verticale"
        m = re.fullmatch(r"\\dfrac\{1\}\{(\d+)\}f\(x\)", g)
        if m:
            return (a, b / int(m.group(1))), "verticale"
        m = re.fullmatch(r"f\((\d+)x\)", g)
        if m:
            return (a / int(m.group(1)), b), "orizzontale"
        m = re.fullmatch(r"f\\left\(\\dfrac\{x\}\{(\d+)\}\\right\)", g)
        if m:
            return (a * int(m.group(1)), b), "orizzontale"
    if level == 6:
        if g == "\\lvert f(x) \\rvert":
            return (a, abs(b)), "fuori"
        if g == "f(\\lvert x \\rvert)":
            return (-a, b), "dentro"
    if level == 7:
        m = re.fullmatch(r"(-|\d+|-\d+)f\(x ([+-]) (\d+)\) ([+-]) (\d+)", g)
        if m:
            c = -1 if m.group(1) == "-" else int(m.group(1))
            h = -sign(m.group(2)) * int(m.group(3))
            k = sign(m.group(4)) * int(m.group(5))
            return (a + h, c * b + k), "fuori e dentro"
        m = re.fullmatch(r"f\((\d+)x ([+-]) (\d+)\)", g)
        if m:
            k, shift = int(m.group(1)), sign(m.group(2)) * int(m.group(3))
            return ((a - shift) / k, b), "dentro"
    return None, None


def check(sample):
    errs = common(sample)
    level = sample["level"]
    if level not in range(1, 8):
        return errs + [f"livello {level} sconosciuto"], None
    ch, e2 = choice_of(sample)
    errs += e2
    if ch is None or sample["answer"]["kind"] != "choice":
        return errs + ["la risposta deve essere a scelta multipla"], None
    right = ch["options"][ch["correct"]]
    problem = sample["problem"]

    if level == 5:
        text, extra = plain(problem)
        m = re.fullmatch(r"Il grafico di y = (.+?) viene (.+)\. Qual è l'equazione del nuovo grafico\?", text)
        if not m or extra or m.group(1) not in BASES:
            return errs + ["problema illeggibile"], None
        base, what = BASES[m.group(1)], m.group(2)
        t = re.fullmatch(r"traslato del vettore \\vec\{v\}\(" + N + ", " + N + r"\)", what)
        u = re.fullmatch(r"ribaltato rispetto all’asse x e poi spostato in su di (\d+)", what)
        if t:
            h, k = int(t.group(1)), int(t.group(2))
            if h == 0 or k == 0:
                errs.append("livello 5: vettore con le due componenti non nulle")
            truth, kind = base.subs(x, x - h) + k, "traslazione"
        elif what == "ribaltato rispetto all’asse x":
            truth, kind = -base, "asse x"
        elif what == "ribaltato rispetto all’asse y":
            truth, kind = base.subs(x, -x), "asse y"
            if same_function(truth, base):
                errs.append("livello 5: la simmetria rispetto all'asse y non cambia una funzione pari")
        elif u:
            truth, kind = -base + int(u.group(1)), "ribaltata e alzata"
        else:
            return errs + [f"trasformazione sconosciuta: {what}"], None
        same = []
        for i, o in enumerate(ch["options"]):
            if not o["latex"].startswith("y = "):
                errs.append("ogni opzione è una formula y = …")
                continue
            f = tex_to_expr(o["latex"][4:])
            if not same_function(f, parse_py(o["values"][0])):
                errs.append(f"opzione scritta {o['latex']!r} diversa dal suo valore")
            if same_function(f, truth):
                same.append(i)
        if same != [ch["correct"]]:
            errs.append(f"le opzioni uguali alla formula giusta sono {same}, quella indicata è {ch['correct']}")
        if sample["solution"] != right["latex"]:
            errs.append("soluzione scritta diversa dalla risposta")
        return errs, kind

    if level == 2:
        if not problem.startswith("y = "):
            return errs + ["il problema deve dare y = …"], None
        f = tex_to_expr(problem[4:])
        if not same_function(f, parse_py(sample["params"]["fx"])):
            errs.append("la formula scritta è diversa da quella dei parametri")
        inner = [g.args[0] for g in f.atoms(Abs)]
        roots = [p.base for p in f.atoms(Pow) if p.exp == Rational(1, 2)]
        if len(inner) == 1 and not roots:
            t, kind, want = critical_points(inner[0])[0], "assoluto", "Trova il vertice del grafico."
        elif len(roots) == 1 and not inner:
            t, kind, want = critical_points(roots[0])[0], "radice", "Trova il punto da cui parte il grafico."
        elif f.is_polynomial(x) and Poly(f, x).degree() == 2:
            p = Poly(f, x)
            t, kind, want = -p.coeff_monomial(x) / (2 * p.coeff_monomial(x**2)), "parabola", "Trova il vertice del grafico."
            if "(x" not in problem:
                errs.append("livello 2: la parabola va scritta come (x - a)^2 + b")
        else:
            return errs + ["livello 2: valore assoluto, radice o parabola"], None
        if sample["prompt"] != want:
            errs.append("consegna diversa da quella della specifica")
        truth = (t, value_at(f, t))
        if truth[0] == 0 or truth[1] == 0:
            errs.append("livello 2: a e b non nulli")
    else:
        text, extra = plain(problem)
        other = "Oltre che per P, per quale punto passa di sicuro il grafico di g?"
        m = re.fullmatch(r"Il grafico di f passa per il punto P\(" + N + ", " + N + r"\)\. (.+)", text)
        if not m or len(extra) != 1 or not extra[0].startswith("g(x) = "):
            return errs + ["problema illeggibile"], None
        a, b, ask = Rational(m.group(1)), Rational(m.group(2)), m.group(3)
        truth, kind = image(level, extra[0][7:], a, b)
        if truth is None:
            return errs + [f"trasformazione sconosciuta per il livello: {extra[0]}"], None
        if level == 6 and ((kind == "fuori" and b >= 0) or (kind == "dentro" and a <= 0)):
            errs.append("livello 6: ordinata negativa per |f(x)|, ascissa positiva per f(|x|)")
        if ask != (other if (level == 6 and kind == "dentro") else "Per quale punto passa di sicuro il grafico di g?"):
            errs.append("domanda diversa da quella della specifica")
        if level != 6 and truth == (a, b):
            errs.append("il punto non si sposta")
    truth = [str(Rational(truth[0])), str(Rational(truth[1]))]
    for o in ch["options"]:
        if [str(v) for v in point(o["latex"])] != o["values"]:
            errs.append(f"opzione scritta {o['latex']!r} diversa dai suoi valori")
    if right["values"] != truth:
        errs.append(f"opzione giusta sbagliata: {truth}")
    if sample["solution"] != right["latex"]:
        errs.append("soluzione scritta diversa dalla risposta")
    return errs, kind
