"""Checker for statistica-variabilita, from specs/exercises/statistica-variabilita.md.

Everything is read back from what the student sees: the data from the problem LaTeX (the row of
numbers, the frequency table, the two named series), the numbers from the option LaTeX (1{,}90 is
1.90). Means, deviations, S, variance and standard deviation are recomputed with Fractions; the
rounding to the hundredth is done with SymPy's exact square root (floor(100·√v + 1/2)), not with
the integer comparisons of the generator.
"""
import re
from fractions import Fraction as F

from sympy import Rational, floor, sqrt

CASE_RANGES = {
    1: {"con negativi": (0.50, 0.70), "positivi": (0.30, 0.50)},
    4: {"intero": (0.65, 0.85), "decimale": (0.15, 0.35)},
    5: {"media intera": (0.60, 0.80), "media con la virgola": (0.20, 0.40)},
    7: {"stesso campo": (0.50, 0.70), "campo discorde": (0.30, 0.50)},
}

NUM = re.compile(r"^-?\d+(\{,\}\d+)?$")


def num(s):
    s = s.strip()
    if not NUM.match(s):
        raise ValueError(f"not a number: {s!r}")
    return F(s.replace("{,}", "."))


def frac(s):
    return F(str(s))


def finite_digits(v):
    """Digits after the comma of a finite decimal, None if periodic."""
    for k in range(9):
        if (v * 10**k).denominator == 1:
            return k
    return None


def round100(v):
    """σ = √v rounded to the hundredth, half up, exact."""
    r = Rational(v.numerator, v.denominator)
    return F(int(floor(100 * sqrt(r) + Rational(1, 2))), 100)


def trunc100(v):
    r = Rational(v.numerator, v.denominator)
    return F(int(floor(100 * sqrt(r))), 100)


def exact_root(v):
    r = sqrt(Rational(v.numerator, v.denominator))
    return F(int(r.p), int(r.q)) if r.is_Rational else None


def body_lines(problem):
    m = re.fullmatch(r"\s*\\begin\{array\}\{l\}(.*)\\end\{array\}\s*", problem, re.S)
    if not m:
        return [problem.strip()]
    inner = m.group(1)
    # split on \\ outside a nested array
    out, depth, cur, i = [], 0, "", 0
    while i < len(inner):
        if inner.startswith(r"\begin{", i):
            depth += 1
        elif inner.startswith(r"\end{", i):
            depth -= 1
        if depth == 0 and inner.startswith(r"\\", i):
            out.append(cur.strip())
            cur = ""
            i += 2
            continue
        cur += inner[i]
        i += 1
    out.append(cur.strip())
    return out


def data_row(problem):
    line = body_lines(problem)[-1]
    if r"\text" in line:
        raise ValueError(f"last line is not the data: {line!r}")
    return [num(x) for x in line.split(r",\quad")]


def stats(data):
    n = len(data)
    mean = sum(data) / n
    dev = [x - mean for x in data]
    return mean, dev, sum(abs(d) for d in dev) / n, sum(d * d for d in dev) / n


def option_numbers(ch):
    return [num(o["latex"]) for o in ch["options"]]


def check_choice_shape(ch, errs):
    if not ch or ch.get("kind") != "choice":
        errs.append("manca la scelta multipla")
        return False
    opts = ch["options"]
    if len(opts) != 4:
        errs.append("servono 4 opzioni")
    if len({o["latex"] for o in opts}) != len(opts):
        errs.append("opzioni con lo stesso testo")
    if len({"|".join(o["values"]) for o in opts}) != len(opts):
        errs.append("opzioni con gli stessi valori")
    if not 0 <= ch["correct"] < len(opts):
        errs.append("indice della risposta fuori intervallo")
        return False
    return True


def check_number_choice(sample, right, errs, must=(), two_digits=False):
    """The choice of a number level: the right option is `right`, every option's LaTeX matches its
    value, the others are different, and the mistakes in `must` are among them."""
    ch = sample.get("choice")
    if not check_choice_shape(ch, errs):
        return
    vals = option_numbers(ch)
    for o, v in zip(ch["options"], vals):
        if frac(o["values"][0]) != v:
            errs.append(f"opzione {o['latex']} con valore {o['values'][0]}")
        if v < 0:
            errs.append("opzione negativa")
    if vals[ch["correct"]] != right:
        errs.append(f"opzione giusta {ch['options'][ch['correct']]['latex']}, attesa {right}")
    if sum(1 for v in vals if v == right) != 1:
        errs.append("valore giusto ripetuto")
    if two_digits and not re.search(r"\{,\}\d\d$", ch["options"][ch["correct"]]["latex"]):
        errs.append("la risposta arrotondata non ha due cifre dopo la virgola")
    for m in must:
        if m is not None and m != right and m >= 0 and m not in vals:
            errs.append(f"manca il distrattore {m}")


def check(sample):
    errs = []
    lvl = sample["level"]
    ans = sample["answer"]
    p = sample.get("params", {})
    if not sample.get("steps"):
        errs.append("mancano i passaggi")
    kind = p.get("case")

    if lvl in (1, 2, 3, 4, 5):
        data = data_row(sample["problem"])
        n = len(data)
        mean, dev, S, var = stats(data)
        if any(x.denominator != 1 for x in data):
            errs.append("dati non interi")
        if [str(x) for x in data] != [str(frac(x)) for x in p.get("data", [])]:
            errs.append("params.data diversi dal testo")

    if lvl == 1:
        xs = [int(x) for x in data]
        rng = max(xs) - min(xs)
        if not 4 <= n <= 8:
            errs.append("servono da 4 a 8 dati")
        if xs == sorted(xs) or xs == sorted(xs, reverse=True):
            errs.append("dati già in ordine")
        if ans["kind"] != "number" or frac(ans["value"]) != rng:
            errs.append(f"campo di variazione: atteso {rng}")
        kind = "con negativi" if min(xs) < 0 else "positivi"
        if kind != p.get("case"):
            errs.append("caso sbagliato")
        if kind == "con negativi" and max(xs) <= 0:
            errs.append("servono dati di due segni")
        must = [F(max(xs) - abs(min(xs)))] if min(xs) < 0 else []
        check_number_choice(sample, F(rng), errs, must)

    elif lvl == 2:
        if not 4 <= n <= 6 or mean.denominator != 1:
            errs.append("servono da 4 a 6 dati con media intera")
        if sum(dev) != 0:
            errs.append("somma degli scarti non nulla")
        if not any(d < 0 for d in dev) or not any(d > 0 for d in dev):
            errs.append("servono scarti dei due segni")
        ch = ans if ans["kind"] == "choice" else None
        if check_choice_shape(ch, errs):
            lists = [[num(x) for x in o["latex"].split(r", \ ")] for o in ch["options"]]
            for o, l in zip(ch["options"], lists):
                if [frac(v) for v in o["values"]] != l or len(l) != n:
                    errs.append(f"opzione {o['latex']} non coerente")
            if lists[ch["correct"]] != dev:
                errs.append("gli scarti giusti non sono l'opzione giusta")
            if sum(1 for l in lists if l == dev) != 1:
                errs.append("scarti giusti ripetuti")
            if [-d for d in dev] not in lists:
                errs.append("manca il distrattore con i segni scambiati")
        if sample.get("choice") != ans:
            errs.append("la scelta multipla deve essere la risposta")
        kind = f"{n} dati"

    elif lvl == 3:
        if not 4 <= n <= 6 or mean.denominator != 1:
            errs.append("servono da 4 a 6 dati con media intera")
        d = finite_digits(S)
        if d is None or d > 2:
            errs.append("S non è un decimale con al massimo due cifre")
        if ans["kind"] != "number" or frac(ans["value"]) != S:
            errs.append(f"S: atteso {S}")
        check_number_choice(sample, S, errs, [F(0), sum(abs(x) for x in dev)])
        kind = f"{n} dati"

    elif lvl == 4:
        if mean.denominator != 1:
            errs.append("media non intera")
        s = exact_root(var)
        if s is None:
            errs.append("σ non esatto")
        else:
            if ans["kind"] != "number" or frac(ans["value"]) != s:
                errs.append(f"σ: atteso {s}")
            if s.denominator == 1:
                kind = "intero"
                if not 2 <= s <= 5:
                    errs.append("σ intero fuori da 2..5")
            else:
                kind = "decimale"
                if finite_digits(s) != 1 or n != 8:
                    errs.append("σ decimale: una cifra e 8 dati")
            if len({abs(x) for x in dev}) == 1:
                errs.append("scarti tutti uguali in valore assoluto")
            check_number_choice(sample, s, errs, [var])

    elif lvl == 5:
        if not 4 <= n <= 6:
            errs.append("servono da 4 a 6 dati")
        if mean.denominator == 1:
            kind = "media intera"
        elif mean.denominator == 2:
            kind = "media con la virgola"
        else:
            errs.append("media né intera né con ,5")
        d = finite_digits(var)
        if d is None or d > 2:
            errs.append("varianza non decimale con al massimo due cifre")
        if exact_root(var) is not None:
            errs.append("σ esatto: il livello chiede l'arrotondamento")
        r = round100(var)
        if ans["kind"] != "number" or frac(ans["value"]) != r:
            errs.append(f"σ arrotondato: atteso {r}")
        if r - F(1, 200) > 0 and not (r - F(1, 200)) ** 2 <= var < (r + F(1, 200)) ** 2:
            errs.append("arrotondamento fuori intervallo")
        check_number_choice(sample, r, errs, [var, trunc100(var) if trunc100(var) != r else None], two_digits=True)

    elif lvl == 6:
        m = re.search(r"\\begin\{array\}\{c\|c+\}(.*?)\\end\{array\}", sample["problem"], re.S)
        if not m:
            errs.append("tabella mancante")
            return errs, None
        rows = [r.replace(r"\hline", "").strip() for r in m.group(1).split(r"\\")]
        xs = [num(c) for c in rows[0].split("&")[1:]]
        fs = [num(c) for c in rows[1].split("&")[1:]]
        k = len(xs)
        if len(fs) != k or not 4 <= k <= 5:
            errs.append("tabella con righe diverse o fuori da 4..5 valori")
        if any(xs[i + 1] - xs[i] != 1 for i in range(k - 1)):
            errs.append("valori non consecutivi")
        if any(not 1 <= f <= 8 for f in fs):
            errs.append("frequenza fuori da 1..8")
        n = sum(fs)
        if not 10 <= n <= 30:
            errs.append("n fuori da 10..30")
        if f"{int(n)} " not in sample["problem"]:
            errs.append("il testo non dice n")
        mean = sum(x * f for x, f in zip(xs, fs)) / n
        if mean.denominator != 1:
            errs.append("media non intera")
        ss = sum((x - mean) ** 2 * f for x, f in zip(xs, fs))
        var = ss / n
        d = finite_digits(var)
        if d is None or d > 2:
            errs.append("varianza non decimale con al massimo due cifre")
        if exact_root(var) is not None:
            errs.append("σ esatto")
        r = round100(var)
        if ans["kind"] != "number" or frac(ans["value"]) != r:
            errs.append(f"σ arrotondato: atteso {r}")
        # dividing by the rows is the mistake the lesson warns about
        check_number_choice(sample, r, errs, [round100(ss / k), var], two_digits=True)
        kind = f"{k} righe"

    elif lvl == 7:
        lines = body_lines(sample["problem"])
        series = []
        for line in lines:
            mm = re.fullmatch(r"\\text\{([A-Z][a-z]+): \}\s*(.*)", line)
            if mm:
                series.append((mm.group(1), [num(x) for x in mm.group(2).split(r", \ ")]))
        if len(series) != 2:
            errs.append("servono due serie")
            return errs, None
        (na, a), (nb, b) = series
        if len(a) != len(b) or len(a) not in (5, 6):
            errs.append("serie di lunghezza diversa o fuori da 5..6")
        ma, da, _, va = stats(a)
        mb, db, _, vb = stats(b)
        if ma != mb or ma.denominator != 1:
            errs.append("medie diverse o non intere")
        if va == vb:
            errs.append("varianze uguali")
        if sorted(a) == sorted(b):
            errs.append("stessi dati")
        for v in (va, vb):
            d = finite_digits(v)
            if d is None or d > 2:
                errs.append("varianza non decimale con al massimo due cifre")
        big, small = ((na, va, a), (nb, vb, b)) if va > vb else ((nb, vb, b), (na, va, a))
        rng = lambda xs: max(xs) - min(xs)  # noqa: E731
        if rng(a) == rng(b):
            kind = "stesso campo"
        elif rng(small[2]) > rng(big[2]):
            kind = "campo discorde"
        else:
            errs.append("il campo di variazione dà già la risposta")
        if "dispersi" in sample["prompt"]:
            want = big
        elif "regolare" in sample["prompt"]:
            want = small
        else:
            errs.append("domanda sconosciuta")
            return errs, kind
        ch = ans if ans["kind"] == "choice" else None
        if check_choice_shape(ch, errs):
            rightopt = ch["options"][ch["correct"]]["latex"]
            mm = re.fullmatch(r"\\text\{([A-Z][a-z]+), con \}\s*\\sigma (=|\\approx) (\S+)", rightopt)
            if not mm:
                errs.append(f"opzione giusta illeggibile: {rightopt}")
            else:
                name, rel, val = mm.group(1), mm.group(2), num(mm.group(3))
                if name != want[0]:
                    errs.append(f"serie giusta {name}, attesa {want[0]}")
                s = exact_root(want[1])
                if s is not None and finite_digits(s) is not None and finite_digits(s) <= 2:
                    if rel != "=" or val != s:
                        errs.append("σ esatto scritto male")
                elif rel != r"\approx" or val != round100(want[1]):
                    errs.append("σ arrotondato sbagliato")
            texts = [o["latex"] for o in ch["options"]]
            if not any("Nessuna" in x for x in texts):
                errs.append("manca l'opzione nessuna")
            others = [x for i, x in enumerate(texts) if i != ch["correct"]]
            if not any(x.startswith(rf"\text{{{want[0]}, con }}") for x in others):
                errs.append("manca il distrattore con la varianza")
            other = small if want is big else big
            if not any(x.startswith(rf"\text{{{other[0]}, con }}") for x in others):
                errs.append("manca l'altra serie")
        if sample.get("choice") != ans:
            errs.append("la scelta multipla deve essere la risposta")
    else:
        errs.append(f"livello sconosciuto {lvl}")

    if kind != p.get("case"):
        errs.append(f"caso {p.get('case')}, ricalcolato {kind}")
    return errs, kind
