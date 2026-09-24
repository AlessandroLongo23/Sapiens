"""Level 7 of equazioni-primo-grado (word problems), from specs/exercises/equazioni-primo-grado.md.

Called by check_linear in verify.py for level 7 only. It reads the data of the story in params,
finds by exhaustive search the value that makes the text true (the way a student could check it
by trying numbers), and compares it with the answer. It then checks that the equation written in
the steps has exactly that solution, that the text states the data in params, and that the
numbers are plausible for the story.
"""
import re

from sympy import Poly, Rational, Symbol, expand, sympify

from verify import FORBIDDEN

X = Symbol("x")

STORIES = ["consecutivi", "eta", "divisione", "rettangolo", "biglietti", "monete", "spesa", "risparmi", "tariffe"]
# Each story about 1/9 of the samples.
CASE_RANGES = {7: {s: (0.06, 0.17) for s in STORIES}}

NUM_WORD = {2: "due", 3: "tre"}
TIMES_WORD = {2: "doppio", 3: "triplo", 4: "quadruplo"}
SHARE_UNIT = ["figurine", "punti", "euro"]
RECT_UNIT = ["m", "cm", "m"]
TICKET_WORDS = [("interi", "ridotti"), ("per gli adulti", "per i ragazzi")]
COINS = [(100, 200), (20, 50), (10, 50), (50, 100), (50, 200)]
SHOP_ONE = ["una maglietta", "un biglietto", "un libro", "una pizza"]
RATE_UNIT = ["mesi", "ore"]


def euro(cents):
    e, c = divmod(cents, 100)
    return str(e) if c == 0 else f"{e}{{,}}{c:02d}"


def coin(c):
    return f"{c // 100} euro" if c >= 100 else f"{c} centesimi"


def prose(tex):
    """The text of the problem as one line: \\text{} groups joined, $…$ kept."""
    return " ".join(re.findall(r"\\text\{((?:[^{}]|\{[^{}]*\})*)\}", tex))


def one(pred, lo=0, hi=2000):
    xs = [v for v in range(lo, hi + 1) if pred(v)]
    return xs[0] if len(xs) == 1 else None


def parse_side(s):
    s = re.sub(r"(\d+)\{,\}(\d+)", lambda m: f"({m.group(1)}{m.group(2)}/{10 ** len(m.group(2))})", s)
    s = s.replace("\\cdot", "*")
    s = re.sub(r"(\d|\))\s*(x|\()", r"\1*\2", s)
    return sympify(s, locals={"x": X})


def solve_story(p):
    """(x, answer, given numbers, phrases the text must contain, plausibility errors)."""
    n = lambda k: int(p[k])
    st = p["story"]
    errs = []
    if st == "consecutivi":
        k, S = n("n"), n("S")
        x = one(lambda v: sum(v + i for i in range(k)) == S)
        if x is None:
            return None
        ans = x if p["asked"] == "piccolo" else x + k - 1
        if k not in (2, 3) or x < 8 or x + k - 1 > 101:
            errs.append("consecutivi: numbers out of range")
        return x, ans, [S], [f"{NUM_WORD[k]} numeri naturali consecutivi è {S}", f"il più {p['asked']}"], errs
    if st == "eta":
        k, par, ch = n("k"), n("parent"), n("child")
        y = one(lambda v: par + v == k * (ch + v), 1)
        if y is None:
            return None
        if not (20 <= par - ch <= 45) or par > 65 or ch < 2:
            errs.append("eta: implausible ages")
        if p["P"] == p["C"]:
            errs.append("eta: same name twice")
        return y, y, [par, ch], [f"{p['P']} ha {par} anni", f"{p['C']} ne ha {ch}.", f"il {TIMES_WORD[k]} degli anni di {p['C']}"], errs
    if st == "divisione":
        people, T, d, q = n("people"), n("T"), n("d"), n("asked")
        names = p["names"].split(",")
        shares = lambda v: [v, v + d] if people == 2 else [v, v + d, 2 * v]
        x = one(lambda v: sum(shares(v)) == T, 1)
        if x is None:
            return None
        sh = shares(x)
        if len(set(sh)) != people or len(set(names)) != people or not 0 <= q < people:
            errs.append("divisione: equal shares or names")
        unit = SHARE_UNIT[n("context")]
        if unit == "punti" and max(sh) > 40:
            errs.append("divisione: too many points for one player")
        phrases = [f"{T} {unit}", f"{d} {'euro ' if unit == 'euro' else ''}più di {names[0]}", names[q] + "?"]
        if people == 3:
            phrases.append(f"{names[2]}" + (" ne ha il doppio" if unit == "figurine" else " il doppio"))
        return x, sh[q], [T, d], phrases, errs
    if st == "rettangolo":
        P, u = n("P"), RECT_UNIT[n("context")]
        long = (lambda s: s + n("d")) if p["rel"] == "piu" else (lambda s: n("k") * s)
        s = one(lambda v: 2 * (v + long(v)) == P, 1)
        if s is None:
            return None
        ans = s if p["asked"] == "corto" else long(s)
        rel = f"supera il lato corto di {n('d')} {u}" if p["rel"] == "piu" else f"il {TIMES_WORD[n('k')]} del lato corto"
        if s < 3 or long(s) > 90:
            errs.append("rettangolo: sides out of range")
        given = [P, n("d")] if p["rel"] == "piu" else [P]
        return s, ans, given, [f"{P} {u}", rel, f"lato {p['asked']}?"], errs
    if st == "biglietti":
        N, p1, p2, T = n("N"), n("p1"), n("p2"), n("T")
        x = one(lambda v: p1 * v + p2 * (N - v) == T, 0, N)
        if x is None:
            return None
        if min(x, N - x) < 2 or p2 >= p1:
            errs.append("biglietti: fewer than 2 tickets of a kind")
        hi, lo = TICKET_WORDS[n("context")]
        ans = x if p["asked"] == "hi" else N - x
        return x, ans, [N, p1, p2, T], [f"{N} biglietti", f"{p1} euro {hi}" if n("context") else f"{hi} da {p1} euro", f"{p2} euro", f"{T} euro", (hi if p["asked"] == "hi" else lo) + " ha"], errs
    if st == "monete":
        lo, hi = COINS[n("coins")]
        N, T = n("N"), n("T")
        x = one(lambda v: hi * v + lo * (N - v) == T, 0, N)
        if x is None:
            return None
        if min(x, N - x) < 2:
            errs.append("monete: fewer than 2 coins of a kind")
        ans = x if p["asked"] == "hi" else N - x
        t = euro(T)
        total = t if "," not in t else f"${t}$"
        asked = coin(hi if p["asked"] == "hi" else lo)
        return x, ans, [N, lo, hi, lo // 100, hi // 100, T, T // 100], [f"{p['name']} ha {N} monete", f"da {coin(lo)} e le altre da {coin(hi)}", f"totale di {total} euro", f"monete da {asked}?"], errs
    if st == "spesa":
        k, extra, T = n("n"), n("extra"), n("T")
        x = one(lambda v: k * v * 100 + extra == T, 1)
        if x is None:
            return None
        if extra % 100 == 0 or not 2 <= k <= 6 or not 6 <= x <= 25:
            errs.append("spesa: implausible prices")
        return x, x, [k], [f"{p['name']} compra {k} ", f"da ${euro(extra)}$ euro", f"in tutto ${euro(T)}$ euro", f"costa {SHOP_ONE[n('context')]}?"], errs
    if st == "risparmi":
        a0, r1, b0, r2, sp = n("a0"), n("r1"), n("b0"), n("r2"), n("spends")
        w = one(lambda v: a0 + r1 * v == b0 + (-r2 if sp else r2) * v, 1)
        if w is None:
            return None
        if sp and b0 - r2 * w < 10:
            errs.append("risparmi: the money runs out")
        ans = w if p["asked"] == "settimane" else a0 + r1 * w
        first = f"{p['A']} non ha risparmi e ogni settimana mette da parte {r1} euro" if a0 == 0 else f"{p['A']} ha {a0} euro nel salvadanaio e ogni settimana ne aggiunge {r1}"
        second = f"{p['B']} ha {b0} euro e ogni settimana ne {'spende' if sp else 'aggiunge'} {r2}"
        question = "Tra quante settimane" if p["asked"] == "settimane" else "quanti euro avrà ciascuno"
        return w, ans, [a0, r1, b0, r2], [first, second, question], errs
    if st == "tariffe":
        F1, m1, F2, m2 = n("F1"), n("m1"), n("F2"), n("m2")
        h = one(lambda v: F1 + m1 * v == F2 + m2 * v, 1)
        if h is None:
            return None
        return h, h, [F1, m1, F2, m2], [f"{F1} euro", f"{m1} euro", f"{F2} euro", f"{m2} euro", f"Dopo quant{'i' if n('context') == 0 else 'e'} {RATE_UNIT[n('context')]}"], errs
    return None


def check_problem(sample):
    p = sample["params"]
    st = p.get("story")
    if st not in STORIES:
        return [f"unknown story {st!r}"], None
    solved = solve_story(p)
    if solved is None:
        return ["the story has no single integer solution"], st
    x, truth, given, phrases, errs = solved
    ans = sample["answer"]
    if ans.get("kind") != "number" or ans.get("value") != str(truth):
        errs.append(f"answer {ans.get('value')} != {truth}")
    if truth <= 0:
        errs.append("answer not positive")
    if truth in given:
        errs.append("the answer is a number already in the text")
    text = prose(sample["problem"])
    missing = [ph for ph in phrases if ph not in text]
    if missing:
        errs.append(f"text does not state {missing}: {text}")
    if "—" in sample["problem"] or "piuttosto che" in sample["problem"]:
        errs.append("forbidden words in the text")

    eq = p.get("equation", "")
    for name, rx in FORBIDDEN:
        if rx.search(eq):
            errs.append(f"equation contains forbidden '{name}': {eq}")
    sides = eq.split("=")
    if len(sides) != 2:
        return errs + [f"bad equation {eq!r}"], st
    expr = expand(parse_side(sides[0]) - parse_side(sides[1]))
    P = Poly(expr, X)
    if P.degree() != 1:
        errs.append(f"equation is not of first degree: {eq}")
    else:
        A, B = P.coeff_monomial(X), P.coeff_monomial(1)
        if -B / A != x:
            errs.append(f"equation {eq} has solution {-B / A}, the story needs x = {x}")
        a, b = Rational(p["normal"]["a"]), Rational(p["normal"]["b"])
        if a == 0 or A * (-b) != B * a:
            errs.append(f"normal form {a}x = {b} is not equivalent to {eq}")
    steps = sample.get("steps", [])
    if not any(eq in s for s in steps):
        errs.append("the equation is not in the steps")
    if not any("Controllo" in s for s in steps):
        errs.append("no check step")

    ch = sample.get("choice")
    if not ch:
        errs.append("missing choice")
    else:
        opts = ch.get("options", [])
        vals = [o.get("values") for o in opts]
        if len(opts) != 4 or len({tuple(v) for v in vals}) != 4:
            errs.append(f"choice needs 4 distinct options: {vals}")
        if any(len(v) != 1 or not re.fullmatch(r"[1-9]\d*", v[0]) or o.get("latex") != v[0] for v, o in zip(vals, opts)):
            errs.append(f"choice options must be positive integers: {vals}")
        c = ch.get("correct")
        if not isinstance(c, int) or not 0 <= c < len(opts) or vals[c] != [str(truth)]:
            errs.append("choice.correct is wrong")
        if sum(1 for v in vals if v == [str(truth)]) != 1:
            errs.append("not exactly one correct option")
    return errs, st
