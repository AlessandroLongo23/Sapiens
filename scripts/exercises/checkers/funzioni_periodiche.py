"""Checker for funzioni-periodiche (specs/exercises/funzioni-periodiche.md).

Written from the spec. Every exercise is read from the sentence the student reads (period, numbers, formula,
interval) and the answer is recomputed here with integer arithmetic and SymPy; params are not used.
"""
import re

from sympy import Rational, floor

from checkers._funzioni import choice_of, common, number, plain, tex_to_expr, x

CASE_RANGES = {
    1: {"avanti": (0.48, 0.72), "indietro": (0.28, 0.52)},
    5: {"intera": (0.38, 0.62), "frazionaria": (0.38, 0.62)},
    6: {"diviso": (0.22, 0.45), "moltiplicato": (0.22, 0.45), "uguale": (0.22, 0.45)},
}
FIRST = r"\[0, (\d+)\\mathclose\{\[\}"


def set_values(latex):
    m = re.fullmatch(r"\\\{(.*)\\\}", latex)
    if not m:
        raise ValueError(f"non è un insieme: {latex!r}")
    return [str(number(p)) for p in m.group(1).split(",\\ ")]


def check(sample):
    errs = common(sample)
    level = sample["level"]
    if level not in range(1, 8):
        return errs + [f"livello {level} sconosciuto"], None
    ch, e2 = choice_of(sample)
    errs += e2
    if ch is None:
        return errs, None
    ans = sample["answer"]
    right = ch["options"][ch["correct"]]
    text, extra = plain(sample["problem"])
    kind = None

    if level == 1:
        m = re.fullmatch(r"La funzione f ha periodo (\d+)\.", text)
        if not m or extra or ans["kind"] != "choice":
            return errs + ["problema illeggibile"], None
        T = int(m.group(1))
        valid = []
        for i, o in enumerate(ch["options"]):
            s = re.fullmatch(r"f\(x ([+-]) (\d+)\) = f\(x\)", o["latex"])
            k = re.fullmatch(r"f\((\d+)x\) = f\(x\)", o["latex"])
            a = re.fullmatch(r"f\(x\) \+ (\d+) = f\(x\)", o["latex"])
            if s:
                n = int(s.group(2)) * (-1 if s.group(1) == "-" else 1)
                want = f"sposta:{n}"
                if n % T == 0 and n != 0:
                    valid.append(i)
                    kind = "indietro" if n < 0 else "avanti"
            elif k:
                want = f"scala:{k.group(1)}"
                if int(k.group(1)) == 1:
                    errs.append("f(1x) non si propone")
            elif a:
                want = f"somma:{a.group(1)}"
            else:
                errs.append(f"opzione illeggibile {o['latex']!r}")
                continue
            if o["values"] != [want]:
                errs.append(f"opzione scritta {o['latex']!r} diversa dal suo valore")
        if valid != [ch["correct"]]:
            errs.append(f"le uguaglianze vere sono {valid}, quella indicata è {ch['correct']}")
        return errs, kind

    if level == 7:
        m = re.fullmatch(r"La funzione f ha periodo (\d+) e nell'intervallo " + FIRST + r" si annulla solo per x = (\d+)\. Quali sono i suoi zeri nell'intervallo \[(-?\d+), (-?\d+)\]\?", text)
        if not m or extra:
            return errs + ["problema illeggibile"], None
        T, T2, a, lo, hi = (int(g) for g in m.groups())
        if T != T2 or not 0 <= a < T or lo >= hi:
            errs.append("dati incoerenti")
        truth = [str(v) for v in range(lo, hi + 1) if (v - a) % T == 0]
        if not 2 <= len(truth) <= 4:
            errs.append("livello 7: da due a quattro zeri")
        if ans["kind"] != "set" or ans["values"] != truth:
            errs.append(f"risposta sbagliata: {truth}")
        for o in ch["options"]:
            if set_values(o["latex"]) != o["values"]:
                errs.append(f"opzione scritta {o['latex']!r} diversa dai suoi valori")
        if right["values"] != truth:
            errs.append("opzione giusta sbagliata")
        if sample["solution"] != right["latex"]:
            errs.append("soluzione scritta diversa dalla risposta")
        return errs, None

    if level in (2, 3):
        m = re.fullmatch(r"La funzione f ha periodo (\d+)\. Per quale numero x_0 dell'intervallo " + FIRST + r" si ha f\((-?\d+)\) = f\(x_0\)\?", text)
        if not m or extra:
            return errs + ["problema illeggibile"], None
        T, T2, n = (int(g) for g in m.groups())
        if T != T2:
            errs.append("l'intervallo non è lungo un periodo")
        if (level == 2 and n <= T) or (level == 3 and n >= 0):
            errs.append("numero dalla parte sbagliata per il livello")
        truth = Rational(n % T)
        shown = f"x_0 = {truth}"
    elif level == 4:
        m = re.fullmatch(r"La funzione f ha periodo (\d+) e per 0 \\leq x < (\d+) vale f\(x\) = (.+)\. Calcola f\((-?\d+)\)\.", text)
        if not m or extra:
            return errs + ["problema illeggibile"], None
        T, T2, n = int(m.group(1)), int(m.group(2)), int(m.group(4))
        f = tex_to_expr(m.group(3))
        if T != T2 or n <= T:
            errs.append("dati incoerenti")
        truth = f.subs(x, n % T)
        if f.subs(x, n) == truth:
            errs.append("livello 4: la formula applicata al numero dato dà lo stesso valore")
        shown = f"f({n}) = {truth}"
    elif level == 5:
        fl = re.fullmatch(r"\\lfloor (.+) \\rfloor", sample["problem"])
        ma = re.fullmatch(r"\\operatorname\{mant\}\((.+)\)", sample["problem"])
        if not (fl or ma):
            return errs + ["problema illeggibile"], None
        v = number((fl or ma).group(1))
        if not re.fullmatch(r"-?\d+\{,\}\d", (fl or ma).group(1)):
            errs.append("livello 5: una cifra decimale")
        truth = floor(v) if fl else v - floor(v)
        kind = "intera" if fl else "frazionaria"
        shown = None
    else:
        m = re.fullmatch(r"La funzione f ha periodo (\d+)\. Qual è il periodo di g\?", text)
        if not m or len(extra) != 1 or not extra[0].startswith("g(x) = "):
            return errs + ["problema illeggibile"], None
        T, g = int(m.group(1)), extra[0][7:]
        k = re.fullmatch(r"f\((\d+)x\)", g)
        d = re.fullmatch(r"f\\left\(\\dfrac\{x\}\{(\d+)\}\\right\)", g)
        if k:
            truth, kind = Rational(T, int(k.group(1))), "diviso"
        elif d:
            truth, kind = Rational(T * int(d.group(1))), "moltiplicato"
        elif re.fullmatch(r"\d+f\(x\) [+-] \d+", g) or re.fullmatch(r"f\(x [+-] \d+\)", g):
            truth, kind = Rational(T), "uguale"
        else:
            return errs + [f"trasformazione sconosciuta: {g}"], None
        if (k and int(k.group(1)) < 2) or (d and int(d.group(1)) < 2):
            errs.append("livello 6: fattore almeno 2")
        shown = None
    if ans["kind"] != "number" or Rational(ans["value"]) != truth:
        errs.append(f"risposta sbagliata: {truth}")
    for o in ch["options"]:
        if [str(number(o["latex"]))] != o["values"]:
            errs.append(f"opzione scritta {o['latex']!r} diversa dal suo valore")
    if right["values"] != [str(truth)]:
        errs.append("opzione giusta sbagliata")
    if shown and sample["solution"] != shown:
        errs.append("soluzione scritta diversa dalla risposta")
    if not shown and not sample["solution"].endswith("= " + right["latex"]):
        errs.append("soluzione scritta diversa dalla risposta")
    return errs, kind
