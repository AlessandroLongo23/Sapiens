"""Checker for sistemi-problemi, written from specs/exercises/sistemi-problemi.md.

For every sample it rebuilds the system from the data of the story in params (as the text states them,
not from the LaTeX the generator wrote), solves it with SymPy's linsolve and decides on its own whether
the solution is acceptable (levels 2 and 6). Then it checks: the text states the data; the system in
params, read from its LaTeX, is the same system equation by equation (up to a factor) and is in the
steps; the numbers are plausible for the story; the answer and the options, read back from their LaTeX,
with exactly one option that solves the problem and, when the problem is impossible, the rejected
solution among the distractors.
"""
import re

from sympy import Rational, expand, linsolve, symbols, sympify

X, Y, Z = symbols("x y z")

STORIES = {
    1: ["somma-differenza", "somma-rapporto", "differenza-rapporto", "somma-supera"],
    2: ["biglietti", "quaderni", "monete", "banconote"],
    3: ["eta-differenza", "eta-somma"],
    4: ["rettangolo", "isoscele"],
    5: ["somma-scambio", "rapporto-scambio", "somma-multiplo", "differenza-somma"],
    6: ["sconti", "miscela"],
    7: ["fiume", "monete3"],
}
WITH_IMPOSSIBLE = {2, 6}
IMPOSSIBLE = "impossibile"
IMPOSSIBLE_LATEX = "\\text{Il problema è impossibile}"

CASE_RANGES = {
    1: {s: (0.15, 0.35) for s in STORIES[1]},
    2: {"accettabile": (0.55, 0.78), "impossibile": (0.22, 0.45)},
    3: {s: (0.40, 0.60) for s in STORIES[3]},
    4: {s: (0.40, 0.60) for s in STORIES[4]},
    5: {s: (0.15, 0.35) for s in STORIES[5]},
    6: {"sconti": (0.40, 0.60), "miscela accettabile": (0.17, 0.33), "miscela impossibile": (0.17, 0.33)},
    7: {s: (0.40, 0.60) for s in STORIES[7]},
}

TIMES = {2: "doppio", 3: "triplo", 4: "quadruplo", 5: "quintuplo"}
FAMILY = [("madre", "figlia"), ("madre", "figlio"), ("padre", "figlia"), ("padre", "figlio")]
ITEMS = ["scarpe", "giacca", "zaino", "felpa", "cappotto", "borsa", "casco", "bicicletta"]
SUBSTANCES = ["alcol", "sale", "zucchero"]
COINS = [(10, 20, 50), (5, 10, 20), (20, 50, 100), (50, 100, 200)]

FORBIDDEN = [
    ("1x", re.compile(r"(?<![\d},])1\s*[xyz(]")),
    ("0x", re.compile(r"(?<![\d},])0\s*[xyz]")),
    ("+ -", re.compile(r"\+\s*-")),
    ("- -", re.compile(r"-\s*-")),
    ("+ +", re.compile(r"\+\s*\+")),
]


# ---------------------------------------------------------------------------
# Reading LaTeX


def text_groups(tex):
    out, i = [], 0
    while True:
        j = tex.find("\\text{", i)
        if j < 0:
            return out
        k, depth = j + 6, 1
        while depth:
            if tex[k] == "{":
                depth += 1
            elif tex[k] == "}":
                depth -= 1
            k += 1
        out.append(tex[j + 6 : k - 1])
        i = k


def prose(tex):
    s = " ".join(text_groups(tex))
    s = s.replace("\\%", "%").replace("^\\circ", "°").replace("$", "")
    return re.sub(r"\s+", " ", s)


def latex_expr(s):
    s = s.replace("\\cdot", "*")
    s = re.sub(r"(\d+)\{,\}(\d+)", lambda m: f"({int(m.group(1) + m.group(2))}/{10 ** len(m.group(2))})", s)
    s = re.sub(r"(\d|\))\s*([xyz(])", r"\1*\2", s)
    if not re.fullmatch(r"[0-9xyz+\-*/() ]*", s):
        raise ValueError(f"unexpected characters in {s!r}")
    return sympify(s, locals={"x": X, "y": Y, "z": Z})


def latex_number(s):
    s = s.strip()
    m = re.fullmatch(r"(-?)\\frac\{(\d+)\}\{(\d+)\}", s)
    if m:
        return Rational(int(m.group(2)), int(m.group(3))) * (-1 if m.group(1) else 1)
    m = re.fullmatch(r"(-?\d+)\{,\}(\d+)", s)
    if m:
        v = Rational(int(m.group(1).lstrip("-") + m.group(2)), 10 ** len(m.group(2)))
        return -v if m.group(1).startswith("-") else v
    if re.fullmatch(r"-?\d+", s):
        return Rational(int(s))
    raise ValueError(f"not a number: {s!r}")


def read_cases(tex):
    m = re.fullmatch(r"\\begin\{cases\} (.+) \\end\{cases\}", tex)
    if not m:
        raise ValueError(f"not a system: {tex!r}")
    eqs = []
    for eq in m.group(1).split(" \\\\ "):
        lhs, rhs = eq.split(" = ")
        eqs.append(expand(latex_expr(lhs) - latex_expr(rhs)))
    return eqs


def proportional(a, b):
    """Two linear equations (lhs - rhs) are the same equation: a = c·b with c a nonzero number."""
    a, b = expand(a), expand(b)
    for v in (X, Y, Z, 1):
        cb = b.coeff(v) if v != 1 else b.subs({X: 0, Y: 0, Z: 0})
        if cb != 0:
            ca = a.coeff(v) if v != 1 else a.subs({X: 0, Y: 0, Z: 0})
            c = ca / cb
            return c != 0 and expand(a - c * b) == 0
    return False


def euros(cents):
    return f"{cents // 100}" if cents % 100 == 0 else f"{cents // 100},{cents % 100:02d}"


def coin_name(c):
    return f"da {c // 100} euro" if c >= 100 else f"da {c} centesimi"


# ---------------------------------------------------------------------------
# The stories: equations, unknowns, phrases of the text, labels and unit of the options, the number asked
# (None when the answer is the values of the unknowns), plausibility errors.


def story(level, p):
    st = p["story"]
    n = lambda k: int(p[k])  # noqa: E731
    errs = []
    vs = [X, Y]
    labels, unit, asked = [], "", None
    if level == 1:
        if st == "somma-differenza":
            S, D = n("S"), n("D")
            eqs = [X + Y - S, X - Y - D]
            phr = [f"La somma di due numeri è {S} e la loro differenza è {D}."]
        elif st == "somma-rapporto":
            S, k = n("S"), n("k")
            eqs = [X + Y - S, X - k * Y]
            phr = [f"La somma di due numeri è {S}, e uno è il {TIMES[k]} dell'altro."]
        elif st == "differenza-rapporto":
            D, k = n("D"), n("k")
            eqs = [X - Y - D, X - k * Y]
            phr = [f"Due numeri differiscono di {D}, e il maggiore è il {TIMES[k]} del minore."]
        else:
            S, k, d = n("S"), n("k"), n("d")
            eqs = [X + Y - S, X - (k * Y + d)]
            phr = [f"La somma di due numeri è {S}, e il maggiore supera di {d} il {TIMES[k]} del minore."]
        phr.append("Quali sono i due numeri?")
    elif level == 2:
        N, p1, p2, I = n("N"), n("p1"), n("p2"), n("I")
        eqs = [X + Y - N, p1 * X + p2 * Y - I]
        if not p1 > p2 >= 1:
            errs.append("prices out of order")
        if st == "biglietti":
            phr = [f"si vendono {N} biglietti: gli interi costano {p1} euro e i ridotti {p2} euro. L'incasso è di {I} euro."]
            labels = ["interi", "ridotti"]
        elif st == "quaderni":
            phr = [f"compra {N} oggetti, tra quaderni da {p1} euro e penne da {p2} euro, e spende {I} euro."]
            labels = ["quaderni", "penne"]
        elif st == "monete":
            if (p1, p2) != (2, 1):
                errs.append("coins of 2 and 1 euro")
            phr = [f"ci sono {N} monete, da 2 euro e da 1 euro, per un totale di {I} euro."]
            labels = ["da 2 euro", "da 1 euro"]
        else:
            phr = [f"ci sono {N} banconote, da {p1} euro e da {p2} euro, per un totale di {I} euro."]
            labels = [f"da {p1} euro", f"da {p2} euro"]
    elif level == 3:
        P, C = FAMILY[n("family")]
        k, nn, when = n("k"), n("n"), p["when"]
        sg = 1 if when == "tra" else -1
        art_p = "la madre" if P == "madre" else "il padre"
        del_c = "della figlia" if C == "figlia" else "del figlio"
        if st == "eta-differenza":
            d = n("d")
            first = X - Y - d
            phr = [f"ha {d} anni più {del_c}."]
        else:
            S = n("S")
            first = X + Y - S
            phr = [f"Oggi la somma delle età di {'una madre' if P == 'madre' else 'un padre'} e {'di sua figlia' if C == 'figlia' else 'di suo figlio'} è {S} anni."]
        eqs = [first, (X + sg * nn) - k * (Y + sg * nn)]
        verb = "avrà" if sg == 1 else "aveva"
        phr.append(f"{'Tra ' + str(nn) + ' anni' if sg == 1 else str(nn) + ' anni fa'} {art_p} {verb} il {TIMES[k]} degli anni {del_c}. Quanti anni hanno oggi?")
        labels, unit = [P, C], "anni"
    elif level == 4:
        if st == "rettangolo":
            u, which, k, s, a, P, P2 = p["u"], p["which"], n("k"), n("s"), n("a"), n("P"), n("P2")
            if which == "altezza":
                eqs = [2 * (X + Y) - P, 2 * (X + s * a + k * Y) - P2]
            else:
                eqs = [2 * (X + Y) - P, 2 * (k * X + Y + s * a) - P2]
            verb_k = {2: "si raddoppia", 3: "si triplica"}[k]
            move = "allunga" if s > 0 else "accorcia"
            change = f"Se si {move} la base di {a} {u} e {verb_k} l'altezza" if which == "altezza" else f"Se {verb_k} la base e si {move} l'altezza di {a} {u}"
            phr = [f"Un rettangolo ha perimetro {P} {u}.", f"{change}, il perimetro diventa {P2} {u}.", "Calcola l'area del rettangolo."]
            asked = lambda sol: sol[0] * sol[1]  # noqa: E731
        else:
            rel, d, k = p["rel"], n("d"), n("k")
            second = {"vertice-supera": X - Y - d, "base-supera": Y - X - d, "vertice-volte": X - k * Y, "base-volte": Y - k * X}[rel]
            eqs = [X + 2 * Y - 180, second]
            words = {
                "vertice-supera": f"l'angolo al vertice supera di {d}° ciascuno degli angoli alla base",
                "base-supera": f"ciascuno degli angoli alla base supera di {d}° l'angolo al vertice",
                "vertice-volte": f"l'angolo al vertice è il {TIMES.get(k)} di ciascuno degli angoli alla base",
                "base-volte": f"ciascuno degli angoli alla base è il {TIMES.get(k)} dell'angolo al vertice",
            }[rel]
            phr = [f"In un triangolo isoscele {words}. Quanto misurano gli angoli?"]
            labels, unit = ["al vertice", "alla base"], "°"
    elif level == 5:
        swap = 10 * Y + X
        num = 10 * X + Y
        if st in ("somma-scambio", "rapporto-scambio"):
            D, up = n("D"), p["dir"] == "aumenta"
            swap_eq = swap - (num + D) if up else swap - (num - D)
            swap_phr = f"si ottiene un numero che supera di {D} quello di partenza." if up else f"il numero diminuisce di {D}."
        if st == "somma-scambio":
            s = n("s")
            eqs = [X + Y - s, swap_eq]
            phr = [f"Un numero di due cifre ha la somma delle cifre uguale a {s}.", swap_phr]
        elif st == "rapporto-scambio":
            k, rel = n("k"), p["rel"]
            eqs = [X - k * Y if rel == "decine" else Y - k * X, swap_eq]
            phr = [f"la cifra delle {'decine' if rel == 'decine' else 'unità'} è il {TIMES.get(k)} di quella delle {'unità' if rel == 'decine' else 'decine'}.", swap_phr]
        elif st == "somma-multiplo":
            s, k = n("s"), n("k")
            eqs = [X + Y - s, num - k * (X + Y)]
            phr = [f"Un numero di due cifre ha la somma delle cifre uguale a {s}, ed è uguale a {k} volte la somma delle sue cifre."]
        else:
            d, M, rel = n("d"), n("M"), p["rel"]
            eqs = [X - Y - d if rel == "decine" else Y - X - d, num + swap - M]
            phr = [
                f"la cifra delle {'decine' if rel == 'decine' else 'unità'} supera di {d} quella delle {'unità' if rel == 'decine' else 'decine'}.",
                f"La somma del numero e di quello che si ottiene scambiando le cifre è {M}.",
            ]
        phr.append("Qual è il numero?")
        asked = lambda sol: 10 * sol[0] + sol[1]  # noqa: E731
    elif level == 6:
        if st == "sconti":
            A, B, T, p1, p2, T2 = n("A"), n("B"), n("T"), n("p1"), n("p2"), n("T2")
            eqs = [X + Y - T, (1 - Rational(p1, 100)) * X + (1 - Rational(p2, 100)) * Y - T2]
            if A == B or p1 == p2:
                errs.append("sconti: same item or same discount")
            phr = [f"costano insieme {T} euro.", f"del {p1}%", f"del {p2}%, e insieme costano {T2} euro.", "Quanto costava ciascun articolo prima dei saldi?"]
            labels, unit = [ITEMS[A], ITEMS[B]], "euro"
        else:
            sub, c1, c2, V, c = n("sub"), n("c1"), n("c2"), n("V"), n("c")
            eqs = [X + Y - V, Rational(c1, 100) * X + Rational(c2, 100) * Y - Rational(c * V, 100)]
            if not 0 < c1 < c2 < 100 or not 0 < c < 100:
                errs.append("miscela: concentrations out of range")
            phr = [f"una soluzione di {SUBSTANCES[sub]} al {c1}% e una al {c2}%.", f"per ottenere {V} litri di soluzione al {c}%?"]
            labels, unit = [f"al {c1}\\%", f"al {c2}\\%"], "litri"
    else:
        if st == "fiume":
            t1, t2, D1, D2, veh = n("t1"), n("t2"), n("D1"), n("D2"), p["vehicle"]
            eqs = [t1 * (X - Y) - D1, t2 * (X + Y) - D2]
            h = lambda t: "un'ora" if t == 1 else f"{t} ore"  # noqa: E731
            if veh == "aereo":
                phr = [f"Un aereo percorre {D1} km in {h(t1)} con il vento contrario", f"{D2} km in {h(t2)} con il vento a favore."]
                labels = ["aereo", "vento"]
            else:
                phr = [f"Una barca percorre {D1} km risalendo un fiume, cioè contro la corrente, in {h(t1)}", f"{D2} km", f"in {h(t2)}."]
                labels = ["barca", "corrente"]
            unit = "km/h"
        else:
            a, b, c = COINS[n("coins")]
            N, V, rel = n("N"), n("V"), p["rel"]
            vs = [X, Y, Z]
            relq = {"x=kz": X - n("k") * Z if rel == "x=kz" else None, "y=z+d": Y - Z - n("d") if rel == "y=z+d" else None, "x=y+d": X - Y - n("d") if rel == "x=y+d" else None}[rel]
            eqs = [X + Y + Z - N, a * X + b * Y + c * Z - V, relq]
            names = [coin_name(v) for v in (a, b, c)]
            which = {"x=kz": (0, 2), "y=z+d": (1, 2), "x=y+d": (0, 1)}[rel]
            how = f"il {TIMES[n('k')]}" if rel == "x=kz" else f"{n('d')} più"
            phr = [f"ci sono {N} monete", f"per un totale di {euros(V)} euro.", f"Le monete {names[which[0]]} sono {how} di quelle {names[which[1]]}."]
            labels = names
    return eqs, vs, phr, labels, unit, asked, errs


def acceptable(level, p, sol):
    if level == 2:
        return all(v.is_integer and v > 0 for v in sol)
    if level == 6 and p["story"] == "miscela":
        V = int(p["V"])
        return all(0 < v < V for v in sol)
    return True


def plausible(level, p, sol):
    errs = []
    x, y = sol[0], sol[1]
    if level != 2 and not (level == 6 and p["story"] == "miscela"):
        if not all(v.is_integer and v > 0 for v in sol):
            errs.append(f"solution {sol} is not made of positive integers")
    if level == 1 and not (x > y >= 2 and x + y <= 160):
        errs.append("level 1: need x > y >= 2 and x + y <= 160")
    if level == 3:
        if not (20 <= x - y <= 45 and x <= 70 and y >= 2):
            errs.append(f"implausible ages {x}, {y}")
        if p["when"] == "fa" and y - int(p["n"]) < 1:
            errs.append("the child was not born yet")
    if level == 4 and p["story"] == "rettangolo":
        s, a, k = int(p["s"]), int(p["a"]), int(p["k"])
        nb, nh = (x + s * a, k * y) if p["which"] == "altezza" else (k * x, y + s * a)
        if nb <= 0 or nh <= 0 or x == y:
            errs.append("rettangolo: sides of the new rectangle not positive, or a square")
    if level == 4 and p["story"] == "isoscele" and (x == y or x + 2 * y != 180):
        errs.append("isoscele: equilateral or angles not adding up")
    if level == 5 and not (1 <= x <= 9 and 1 <= y <= 9 and x != y):
        errs.append(f"digits {x}, {y} out of range")
    if level == 7 and p["story"] == "fiume" and not x > 2 * y:
        errs.append("fiume: the current too fast for the boat")
    return errs


# ---------------------------------------------------------------------------
# Options


LINE = re.compile(r"\\text\{(.+?): \} (-?\\frac\{\d+\}\{\d+\}|-?\d+(?:\{,\}\d+)?)(\^\\circ|\\text\{ ([^{}]+)\})?")


def read_option(latex, level, labels, unit):
    """The values an option shows, or None for 'impossibile'."""
    if latex == IMPOSSIBLE_LATEX:
        return None
    if level == 1:
        m = re.fullmatch(r"(\d+) \\text\{ e \} (\d+)", latex)
        if not m:
            raise ValueError(f"level 1 option {latex!r}")
        return [Rational(int(m.group(1))), Rational(int(m.group(2)))]
    m = re.fullmatch(r"\\begin\{gathered\} (.+) \\end\{gathered\}", latex)
    if not m:
        raise ValueError(f"option not in gathered: {latex!r}")
    lines = m.group(1).split(" \\\\ ")
    if len(lines) != len(labels):
        raise ValueError(f"option with {len(lines)} lines, expected {len(labels)}")
    vals = []
    for line, lab in zip(lines, labels):
        lm = LINE.fullmatch(line)
        if not lm:
            raise ValueError(f"option line {line!r}")
        if lm.group(1) != lab:
            raise ValueError(f"option label {lm.group(1)!r}, expected {lab!r}")
        u = "°" if lm.group(3) == "^\\circ" else (lm.group(4) or "")
        if u != unit:
            raise ValueError(f"option unit {u!r}, expected {unit!r}")
        vals.append(latex_number(lm.group(2)))
    return vals


def check(sample):
    errs = []
    p = sample["params"]
    lvl = sample["level"]
    st = p.get("story")
    if st not in STORIES.get(lvl, []):
        return [f"story {st} not in level {lvl}"], None
    eqs, vs, phrases, labels, unit, asked, e0 = story(lvl, p)
    errs += e0
    sols = list(linsolve(eqs, vs))
    if len(sols) != 1 or any(s.free_symbols for s in sols[0]):
        return errs + [f"system without a unique solution: {sols}"], None
    sol = list(sols[0])
    if [Rational(s) for s in p.get("sol", [])] != sol:
        errs.append(f"params.sol {p.get('sol')} != sympy {sol}")
    ok = acceptable(lvl, p, sol)
    case = "accettabile" if ok else "impossibile"
    if lvl in WITH_IMPOSSIBLE and p.get("case") != case:
        errs.append(f"params.case {p.get('case')} but the solution is {case}")
    if lvl not in WITH_IMPOSSIBLE and not ok:
        errs.append("not acceptable on a level without impossible problems")
    if ok:
        errs += plausible(lvl, p, sol)
    kind = case if lvl == 2 else (f"miscela {case}" if st == "miscela" else st)

    # the text, the system and the steps
    text = prose(sample["problem"])
    missing = [ph for ph in phrases if ph not in text]
    if missing:
        errs.append(f"text does not state {missing}: {text}")
    if "—" in sample["problem"] or "piuttosto che" in sample["problem"]:
        errs.append("forbidden words in the text")
    want_prompt = "Risolvi il problema con un sistema" + (" e controlla che la soluzione sia accettabile." if lvl in WITH_IMPOSSIBLE else ".")
    if sample.get("prompt") != want_prompt:
        errs.append(f"prompt {sample.get('prompt')!r}")
    system = p.get("system", "")
    try:
        written = read_cases(system)
        if len(written) != len(eqs) or not all(proportional(a, b) for a, b in zip(written, eqs)):
            errs.append(f"params.system {system} is not the system of the story")
    except Exception as ex:  # noqa: BLE001
        errs.append(f"params.system unreadable: {ex}")
    for name, rx in FORBIDDEN:
        if rx.search(system):
            errs.append(f"system contains '{name}': {system}")
    steps = sample.get("steps", [])
    if system not in steps:
        errs.append("the system is not in the steps")
    if ok and not any("Controllo sul testo" in s for s in steps):
        errs.append("no check on the text")
    if not ok and not any("non è accettabile" in s for s in steps):
        errs.append("the rejection is not explained")
    if not sample.get("solution"):
        errs.append("no solution")

    # the answer
    ans = sample["answer"]
    if asked is not None:
        truth = asked(sol)
        if ans.get("kind") != "number" or ans.get("value") != str(truth):
            errs.append(f"answer {ans} != {truth}")
        ch = sample.get("choice")
    else:
        truth = (sorted(sol) if lvl == 1 else sol) if ok else None
        if ans.get("kind") != "choice":
            errs.append("the values of the unknowns are a choice")
        ch = ans
        if p.get("labels") != labels and lvl != 1:
            errs.append(f"params.labels {p.get('labels')} != {labels}")
    if not ch:
        return errs + ["missing choice"], kind

    # the options
    opts = ch.get("options", [])
    vals = [tuple(o.get("values", [])) for o in opts]
    if len(opts) != 4 or len({tuple(sorted(v)) if lvl == 1 else v for v in vals}) != 4 or len({o.get("latex") for o in opts}) != 4:
        errs.append(f"choice needs 4 distinct options: {vals}")
    try:
        shown = []
        for o in opts:
            if asked is not None:
                num = latex_number(o["latex"])
                if o["values"] != [str(num)]:
                    errs.append(f"option {o['latex']!r} != {o['values']}")
                if not (num.is_integer and num > 0):
                    errs.append(f"option {num} is not a positive integer")
                shown.append(num)
                continue
            v = read_option(o["latex"], lvl, labels, unit)
            if v is None:
                if o["values"] != [IMPOSSIBLE]:
                    errs.append("impossible option with values")
                shown.append(None)
                continue
            if [Rational(s) for s in o["values"]] != v:
                errs.append(f"option {o['latex']!r} != {o['values']}")
            # an option that solves the system is the answer; nothing else may
            solves = len(v) == len(vs) and all(eq.subs(dict(zip(vs, v))) == 0 for eq in eqs)
            if lvl == 1:
                solves = solves or (len(v) == 2 and all(eq.subs({X: v[1], Y: v[0]}) == 0 for eq in eqs))
                v = sorted(v)
            if ok and solves != (v == truth):
                errs.append(f"option {v}: solves the system {solves}, equals the answer {v == truth}")
            if ok and lvl not in WITH_IMPOSSIBLE and not all(x.is_integer and x > 0 for x in v):
                errs.append(f"option {v} is not made of positive integers")
            shown.append(v)
        c = ch.get("correct")
        if not isinstance(c, int) or not 0 <= c < len(opts) or shown[c] != truth:
            errs.append(f"choice.correct points to {vals[c] if isinstance(c, int) and 0 <= c < len(opts) else c}, truth {truth}")
        if sum(1 for s in shown if s == truth) != 1:
            errs.append("not exactly one correct option")
        if lvl in WITH_IMPOSSIBLE and None not in shown:
            errs.append("no 'impossibile' option")
        if not ok and sol not in shown:
            errs.append("an impossible problem without the rejected solution among the options")
    except Exception as ex:  # noqa: BLE001
        errs.append(f"options unreadable: {ex}")
    return errs, kind
