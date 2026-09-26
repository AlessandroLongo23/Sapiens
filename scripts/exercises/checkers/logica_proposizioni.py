"""Checker for logica-proposizioni, from specs/exercises/logica-proposizioni.md.

Written from the spec, not from the TypeScript: its own parser of the prefix notation
(`and(not(p),q)`), its own LaTeX rendering, truth tables with itertools.product in the order of
the lesson (VV, VF, FV, FF), its own truth values for the sentences, rebuilt from their pieces
(kind and numbers, or an index into the lists below), never from the text. Negations of
comparisons are checked on a grid of integers, negations of sentences on every row of the two
atoms. Options written on two lines (`gathered`) are joined back before comparing.
"""
import re
from itertools import product

from checkers.insiemi_comune import base_errors, choice_errors, number_answer_errors, number_option_truth

CASE_RANGES = {
    1: {"proposizione": (0.24, 0.36), "non proposizione": (0.19, 0.31), "vera": (0.19, 0.31), "falsa": (0.14, 0.26)},
    2: {"lettere": (0.62, 0.78), "confronto": (0.22, 0.38)},
    3: {"vera": (0.4, 0.6), "falsa": (0.4, 0.6)},
    4: {"colonna": (0.62, 0.78), "quante": (0.22, 0.38)},
    5: {"colonna": (0.62, 0.78), "quante": (0.22, 0.38)},
    6: {"tautologia": (0.23, 0.37), "contraddizione": (0.18, 0.32), "equivalente": (0.38, 0.52)},
    7: {"formula": (0.28, 0.42), "frase": (0.28, 0.42), "numeri": (0.23, 0.37)},
}

# ---------------------------------------------------------------------------
# Formulas


def parse(s):
    """'and(not(p),q)' -> ('and', ('not', 'p'), 'q'); letters are 'p', 'q', 'r'."""
    tokens = re.findall(r"not|and|or|xor|[pqr]|[(),]", s)
    if "".join(tokens) != s:
        raise ValueError(f"bad formula {s!r}")
    pos = 0

    def node():
        nonlocal pos
        t = tokens[pos]
        pos += 1
        if t in "pqr":
            return t
        if tokens[pos] != "(":
            raise ValueError(s)
        pos += 1
        a = node()
        if t == "not":
            assert tokens[pos] == ")"
            pos += 1
            return ("not", a)
        assert tokens[pos] == ","
        pos += 1
        b = node()
        assert tokens[pos] == ")"
        pos += 1
        return (t, a, b)

    f = node()
    if pos != len(tokens):
        raise ValueError(f"trailing tokens in {s!r}")
    return f


OPS = {"and": "\\wedge", "or": "\\vee", "xor": "\\,\\dot\\vee\\,"}


def is_bin(f):
    return isinstance(f, tuple) and f[0] in OPS


def render(f):
    """LaTeX as the lesson writes it: ¬ on a letter without brackets, every inner ∧ ∨ ⊻ in brackets."""
    if isinstance(f, str):
        return f
    if f[0] == "not":
        return "\\neg " + f[1] if isinstance(f[1], str) else "\\neg(" + render(f[1]) + ")"
    side = lambda g: "(" + render(g) + ")" if is_bin(g) else render(g)
    return f"{side(f[1])} {OPS[f[0]]} {side(f[2])}"


def value(f, env):
    if isinstance(f, str):
        return env[f]
    if f[0] == "not":
        return not value(f[1], env)
    a, b = value(f[1], env), value(f[2], env)
    return {"and": a and b, "or": a or b, "xor": a != b}[f[0]]


def envs(letters):
    """Rows in the order of the lesson: V before F, the first letter changing slowest."""
    return [dict(zip(letters, vals)) for vals in product([True, False], repeat=len(letters))]


def col(f, letters):
    return "".join("V" if value(f, e) else "F" for e in envs(letters))


def col_tex(c):
    return "\\text{" + ", ".join(c) + "}"


def connectives(f):
    if isinstance(f, str):
        return 0
    return 1 + sum(connectives(g) for g in f[1:])


def letters_of(f):
    if isinstance(f, str):
        return {f}
    return set().union(*(letters_of(g) for g in f[1:]))


def formula_grader(truth):
    """Options whose values are [formula]; the LaTeX must be the formula's."""

    def grade(o):
        f = parse(o["values"][0])
        if o["latex"] != render(f):
            raise ValueError(f"latex {o['latex']} != {render(f)}")
        return truth(f)

    return grade


# ---------------------------------------------------------------------------
# Sentences

GATHERED = re.compile(r"\\begin\{gathered\}\\text\{([^{}]*)\} \\\\ \\text\{([^{}]*)\}\\end\{gathered\}")


def one_line(t):
    m = GATHERED.fullmatch(t)
    return f"\\text{{{m.group(1)} {m.group(2)}}}" if m else t


def is_prime(n):
    return n >= 2 and all(n % d for d in range(2, int(n**0.5) + 1))


REL_TEX = {">": ">", "<": "<", ">=": "\\geq", "<=": "\\leq", "=": "=", "!=": "\\neq"}
REL_FN = {
    ">": lambda a, b: a > b,
    "<": lambda a, b: a < b,
    ">=": lambda a, b: a >= b,
    "<=": lambda a, b: a <= b,
    "=": lambda a, b: a == b,
    "!=": lambda a, b: a != b,
}


def atom_truth(a):
    k = a[0]
    n = [int(x) for x in a[1:] if re.fullmatch(r"-?\d+", x)]
    if k == "pari":
        return n[0] % 2 == 0
    if k == "dispari":
        return n[0] % 2 == 1
    if k == "multiplo":
        return n[0] % n[1] == 0
    if k == "primo":
        return is_prime(n[0])
    if k == "divisore":
        return n[1] % n[0] == 0
    if k == "cmp":
        return REL_FN[a[2]](int(a[1]), int(a[3]))
    if k == "somma":
        return n[0] + n[1] == n[2]
    if k == "prodotto":
        return n[0] * n[1] == n[2]
    raise ValueError(f"atom {a}")


def atom_words(a):
    k = a[0]
    return {
        "pari": lambda: f"{a[1]} è pari",
        "dispari": lambda: f"{a[1]} è dispari",
        "multiplo": lambda: f"{a[1]} è multiplo di {a[2]}",
        "primo": lambda: f"{a[1]} è un numero primo",
        "divisore": lambda: f"{a[1]} è un divisore di {a[2]}",
    }.get(k, lambda: None)()


def atom_math(a):
    if a[0] == "cmp":
        return f"{a[1]} {REL_TEX[a[2]]} {a[3]}"
    if a[0] == "somma":
        return f"{a[1]} + {a[2]} = {a[3]}"
    if a[0] == "prodotto":
        return f"{a[1]} \\cdot {a[2]} = {a[3]}"
    raise ValueError(a)


# Facts with their truth value, checked one by one.
FACTS = [
    ("Roma è la capitale d'Italia", True),
    ("Milano è la capitale d'Italia", False),
    ("Un'ora ha 60 minuti", True),
    ("Un'ora ha 100 minuti", False),
    ("Una settimana ha 7 giorni", True),
    ("Una settimana ha 8 giorni", False),
    ("Un anno ha 12 mesi", True),
    ("Un anno ha 10 mesi", False),
    ("Parigi è in Francia", True),
    ("Parigi è in Spagna", False),
    ("Un triangolo ha tre lati", True),
    ("Un quadrato ha cinque lati", False),
]
QUESTIONS = ["Che ore sono?", "Come ti chiami?", "Dove abiti?", "Che tempo fa?"]
ORDERS = ["Apri il quaderno", "Chiudi la finestra", "Scrivi la data", "Leggi il testo"]
OPINIONS = [
    "Il calcio è lo sport più bello",
    "La matematica è facile",
    "Il 7 è un bel numero",
    "Le frazioni sono noiose",
    "La pizza è il cibo migliore",
    "L'estate è la stagione più bella",
    "Il blu è il colore più bello",
]


def sentence(s):
    """(one-line LaTeX, is a proposition, truth or None) of a level-1 sentence."""
    k = s[0]
    if k == "atom":
        a = s[1:]
        w = atom_words(a)
        return (f"\\text{{{w}}}" if w else atom_math(a)), True, atom_truth(a)
    if k == "fatto":
        text, t = FACTS[int(s[1])]
        return f"\\text{{{text}}}", True, t
    if k == "domanda":
        if s[1] == "fissa":
            return f"\\text{{{QUESTIONS[int(s[2])]}}}", False, None
        if s[1] == "somma":
            return f"\\text{{Quanto fa }} {s[2]} + {s[3]}\\text{{?}}", False, None
        if s[1] == "pari":
            return f"\\text{{{s[2]} è pari?}}", False, None
        if s[1] == "primo":
            return f"\\text{{{s[2]} è un numero primo?}}", False, None
    if k == "ordine":
        if s[1] == "fisso":
            return f"\\text{{{ORDERS[int(s[2])]}}}", False, None
        if s[1] == "calcola":
            return f"\\text{{Calcola }} {s[2]} + {s[3]}", False, None
        if s[1] == "doppio":
            return f"\\text{{Scrivi il doppio di {s[2]}}}", False, None
    if k == "opinione":
        return f"\\text{{{OPINIONS[int(s[1])]}}}", False, None
    if k == "aperta":
        if s[1] == "somma":
            return f"x + {s[2]} = {s[3]}", False, None
        if s[1] == "prodotto":
            if int(s[2]) < 2:
                raise ValueError("coefficient 1 or 0 in front of x")
            return f"{s[2]}x = {s[3]}", False, None
        if s[1] == "cmp":
            return f"x > {s[2]}", False, None
        if s[1] == "multiplo":
            return f"x \\text{{ è multiplo di }} {s[2]}", False, None
    raise ValueError(f"unknown sentence {s}")


WEATHER = [
    ("piove", "non piove"),
    ("fa freddo", "non fa freddo"),
    ("nevica", "non nevica"),
    ("tira vento", "non tira vento"),
    ("c'è il sole", "non c'è il sole"),
]
PEOPLE = ["Luca", "Marta", "Sara", "Paolo", "Giulia", "Marco"]
ACTIONS = [
    ("studia", "non studia"),
    ("legge", "non legge"),
    ("gioca a calcio", "non gioca a calcio"),
    ("va al cinema", "non va al cinema"),
    ("ha fame", "non ha fame"),
    ("parla inglese", "non parla inglese"),
    ("suona il piano", "non suona il piano"),
]


def phrase(ph):
    who, i1, n1, conn, i2, n2 = ph
    if conn not in ("e", "o") or n1 not in "01" or n2 not in "01" or i1 == i2:
        raise ValueError(f"bad phrase {ph}")
    table = WEATHER if who == "meteo" else ACTIONS
    if who != "meteo" and who not in PEOPLE:
        raise ValueError(f"unknown person {who}")
    s = f"{table[int(i1)][int(n1)]} {conn} {table[int(i2)][int(n2)]}"
    return s[0].upper() + s[1:] if who == "meteo" else f"{who} {s}"


def phrase_value(ph, a, b):
    l = (not a) if ph[2] == "1" else a
    r = (not b) if ph[5] == "1" else b
    return (l and r) if ph[3] == "e" else (l or r)


def cmp_tex(x):
    a, r1, b, conn, r2, c = x
    return f"{a} {REL_TEX[r1]} {b} \\text{{ {conn} }} {a} {REL_TEX[r2]} {c}"


def cmp_value(x, a):
    l = REL_FN[x[1]](a, int(x[2]))
    r = REL_FN[x[4]](a, int(x[5]))
    return (l and r) if x[3] == "e" else (l or r)


# ---------------------------------------------------------------------------


def lines_of(tex):
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", tex, re.S)
    if not m:
        return [tex]
    body, out, depth, cur, i = m.group(1), [], 0, "", 0
    while i < len(body):
        if body.startswith("\\begin{", i):
            depth += 1
        elif body.startswith("\\end{", i):
            depth -= 1
        if depth == 0 and body.startswith(" \\\\ ", i):
            out.append(cur)
            cur = ""
            i += 4
            continue
        cur += body[i]
        i += 1
    out.append(cur)
    return out


def prose(tex):
    return " ".join(re.findall(r"\\text\{([^{}]*)\}", tex))


def check(sample):
    if "error" in sample:
        return [f"generator error: {sample['error']}"], None
    errs = base_errors(sample)
    p = sample["params"]
    lvl = sample["level"]
    ans = sample["answer"]
    prob = sample["problem"]
    kind = None

    if lvl == 1:
        kind = p["variant"]
        question = {
            "proposizione": "è una proposizione",
            "non proposizione": "non è una proposizione",
            "vera": "è una proposizione vera",
            "falsa": "è una proposizione falsa",
        }[kind]
        if prob != f"\\text{{Quale di queste frasi {question}?}}":
            errs.append(f"problem {prob!r}")

        def grade(o):
            tex, is_prop, truth = sentence(o["values"])
            if one_line(o["latex"]) != tex:
                raise ValueError(f"latex {o['latex']} != {tex}")
            if kind == "proposizione":
                return is_prop
            if kind == "non proposizione":
                return not is_prop
            return is_prop and truth == (kind == "vera")

        errs += choice_errors(ans, grade)
        if kind == "proposizione" and ans.get("kind") == "choice":
            kinds = [o["values"][0] for o in ans["options"] if o["values"][0] not in ("atom", "fatto")]
            if len(set(kinds)) != 3:
                errs.append(f"non-propositions of repeated kinds: {kinds}")

    elif lvl == 2:
        kind = p["variant"]
        if kind == "confronto":
            a, rel, b = int(p["a"]), p["rel"], int(p["b"])
            if a == b or rel not in (">", "<", ">=", "<="):
                errs.append("bad comparison")
            if lines_of(prob) != ["\\text{Qual è la negazione di questa proposizione?}", f"{a} {REL_TEX[rel]} {b}"]:
                errs.append(f"problem {prob!r}")

            def grade(o):
                r = o["values"][0]
                if o["latex"] != f"{a} {REL_TEX[r]} {b}":
                    raise ValueError(o["latex"])
                return all(REL_FN[r](x, y) != REL_FN[rel](x, y) for x in range(-4, 5) for y in range(-4, 5))

            errs += choice_errors(ans, grade)
        else:
            ap, aq, ask = p["p"], p["q"], p["ask"]
            env = {"p": atom_truth(ap), "q": atom_truth(aq)}

            def line(name, a):
                w = atom_words(a)
                return f"{name}: \\text{{ {w}}}" if w else f"{name}: {atom_math(a)}"

            if lines_of(prob) != [line("p", ap), line("q", aq), f"\\text{{Quale di queste proposizioni è {ask}?}}"]:
                errs.append(f"problem {prob!r}")
            if ap == aq:
                errs.append("p and q are the same sentence")

            def truth(f):
                if connectives(f) != 1 or letters_of(f) - {"p", "q"}:
                    raise ValueError(f"not a single connective on p, q: {f}")
                return value(f, env) == (ask == "vera")

            errs += choice_errors(ans, formula_grader(truth))

    elif lvl == 3:
        kind = p["ask"]
        env = {k: v == "V" for k, v in p["env"].items()}
        letters = sorted(env)
        if letters not in (["p", "q"], ["p", "q", "r"]):
            errs.append(f"letters {letters}")
        said = [f"${l}$ è {'vera' if env[l] else 'falsa'}" for l in letters]
        known = " e ".join(said) if len(said) == 2 else f"{said[0]}, {said[1]} e {said[2]}"
        if prose(prob) != f"Sai che {known}. Quale di queste proposizioni è {kind}?" and " ".join(prose(prob).split()) != f"Sai che {known}. Quale di queste proposizioni è {kind}?":
            errs.append(f"problem {prob!r}")

        def truth(f):
            if not 2 <= connectives(f) <= 3:
                raise ValueError(f"{connectives(f)} connectives in {f}")
            if not letters_of(f) <= set(letters) or len(letters_of(f)) < 2:
                raise ValueError(f"letters of {f}")
            return value(f, env) == (kind == "vera")

        errs += choice_errors(ans, formula_grader(truth))
        if len(letters) == 3 and ans.get("kind") == "choice":
            if sum("r" in letters_of(parse(o["values"][0])) for o in ans["options"]) < 2:
                errs.append("r in fewer than two options")

    elif lvl in (4, 5):
        kind = p["variant"]
        letters = ["p", "q"] if lvl == 4 else ["p", "q", "r"]
        f = parse(p["formula"])
        c = col(f, letters)
        if not 2 <= connectives(f) <= 3:
            errs.append(f"{connectives(f)} connectives")
        if letters_of(f) != set(letters):
            errs.append(f"formula does not use every letter: {letters_of(f)}")
        if "V" not in c or "F" not in c:
            errs.append("tautology or contradiction in a table level")
        ls = lines_of(prob)
        if lvl == 4:
            rows = " \\\\ ".join(
                " & ".join("\\text{V}" if e[l] else "\\text{F}" for l in letters) + " & ?" for e in envs(letters)
            )
            table = f"\\begin{{array}}{{c|c|c}} p & q & {render(f)} \\\\ \\hline {rows} \\end{{array}}"
            if len(ls) != 2 or ls[1] != table:
                errs.append(f"table {prob!r}")
        elif len(ls) != 2 or ls[1] != render(f):
            errs.append(f"problem {prob!r}")
        if kind == "quante":
            n = c.count("V")
            errs += number_answer_errors(sample, n)
            errs += choice_errors(sample.get("choice"), number_option_truth(n))
            if sample.get("choice"):
                if any(int(o["latex"]) > len(c) for o in sample["choice"]["options"]):
                    errs.append("a count larger than the rows")
        else:

            def grade(o):
                v = o["values"][0]
                if not re.fullmatch(f"[VF]{{{len(c)}}}", v) or o["latex"] != col_tex(v):
                    raise ValueError(f"bad column option {o}")
                return v == c

            errs += choice_errors(ans, grade)

    elif lvl == 6:
        kind = p["variant"]
        letters = ["p", "q"]
        if kind in ("tautologia", "contraddizione"):
            if prob != f"\\text{{Quale di queste proposizioni è una {kind}?}}":
                errs.append(f"problem {prob!r}")
            target = "VVVV" if kind == "tautologia" else "FFFF"
            errs += choice_errors(ans, formula_grader(lambda f: col(f, letters) == target))
        else:
            X = parse(p["X"])
            if lines_of(prob) != ["\\text{Quale di queste proposizioni è equivalente a questa?}", render(X)]:
                errs.append(f"problem {prob!r}")
            cx = col(X, letters)

            def truth(f):
                if f == X:
                    raise ValueError("the proposition itself among the options")
                return col(f, letters) == cx

            errs += choice_errors(ans, formula_grader(truth))

    elif lvl == 7:
        kind = p["variant"]
        if kind == "formula":
            X = parse(p["X"])
            if not (is_bin(X) and X[0] in ("and", "or") and connectives(X) <= 3):
                errs.append(f"not a conjunction or disjunction of two literals: {X}")
            if lines_of(prob) != ["\\text{Qual è la negazione di questa proposizione?}", render(X)]:
                errs.append(f"problem {prob!r}")
            rows = envs(["p", "q"])
            errs += choice_errors(ans, formula_grader(lambda f: all(value(f, e) != value(X, e) for e in rows)))
        elif kind == "frase":
            orig = p["orig"]
            text = phrase(orig)
            if " ".join(prose(prob).split()) != f"Qual è la negazione della frase “{text}”?":
                errs.append(f"problem {prob!r}")

            def grade(o):
                ph = o["values"]
                if one_line(o["latex"]) != f"\\text{{{phrase(ph)}}}":
                    raise ValueError(f"latex {o['latex']} != {phrase(ph)}")
                if (ph[0], ph[1], ph[4]) != (orig[0], orig[1], orig[4]):
                    return False
                return all(phrase_value(ph, a, b) != phrase_value(orig, a, b) for a in (True, False) for b in (True, False))

            errs += choice_errors(ans, grade)
        else:
            orig = p["orig"]
            if lines_of(prob) != ["\\text{Qual è la negazione di questa proposizione?}", cmp_tex(orig)]:
                errs.append(f"problem {prob!r}")

            def grade(o):
                x = o["values"]
                if o["latex"] != cmp_tex(x):
                    raise ValueError(o["latex"])
                if (x[0], x[2], x[5]) != (orig[0], orig[2], orig[5]):
                    return False
                return all(cmp_value(x, a) != cmp_value(orig, a) for a in range(-5, 40))

            errs += choice_errors(ans, grade)
    else:
        errs.append(f"unknown level {lvl}")

    if ans.get("kind") == "choice" and sample.get("choice") and sample["choice"] != ans:
        errs.append("choice differs from the answer")
    return errs, kind
