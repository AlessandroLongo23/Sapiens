"""statistica-medie (Media, mediana e moda), from specs/exercises/statistica-medie.md.

Written from the spec, not from the generator. The data are read back from the LaTeX of the problem
(the row of givens, the frequency tables, the classes) and compared with params; mean, median and
mode are computed again with exact Fractions and the `statistics` module on the expanded data. The
multiple-choice options are parsed from their LaTeX and must say the value they claim; the named
mistakes of the lesson (divide by the rows, the centre of the unsorted list, the frequency instead
of the mode) must be among the options when they are writable.
"""
import re
import statistics
from fractions import Fraction as F

CASE_RANGES = {
    1: {"intera": (0.40, 0.60), "decimale": (0.40, 0.60)},
    2: {"k=3": (0.50, 0.70), "k=4": (0.30, 0.50)},
    3: {c: (0.12, 0.28) for c in ["voti", "fratelli", "gol", "libri", "scarpe"]},
    4: {"dispari": (0.40, 0.60), "pari": (0.40, 0.60)},
    5: {
        "mediana-dispari": (0.14, 0.26),
        "mediana-pari-uguali": (0.14, 0.26),
        "mediana-pari-diversi": (0.14, 0.26),
        "moda": (0.10, 0.20),
        "moda-qualitativa": (0.10, 0.20),
        "bimodale": (0.03, 0.11),
        "senza-moda": (0.01, 0.07),
    },
    6: {"anomalo": (0.50, 0.70), "carattere": (0.30, 0.50)},
    7: {c: (0.17, 0.33) for c in ["minuti", "altezze", "test", "zaino"]},
}

# The kind of each character of level 6, decided here from the lesson ("Quale indice usare").
CHARACTER_KIND = {
    "il colore preferito": "qualitativo",
    "il mezzo con cui viene a scuola": "qualitativo",
    "lo sport preferito": "qualitativo",
    "il gusto di gelato preferito": "qualitativo",
    "il genere musicale preferito": "qualitativo",
    "la materia preferita": "qualitativo",
    "il giudizio sul corso di teatro (insufficiente, sufficiente, buono, ottimo)": "ordinabile",
    "quanto gli piace la matematica (per niente, poco, abbastanza, molto)": "ordinabile",
    "la taglia della maglietta (S, M, L, XL)": "ordinabile",
    "quanto spesso legge un libro (mai, a volte, spesso, sempre)": "ordinabile",
    "il livello di inglese (A1, A2, B1, B2)": "ordinabile",
    "quanti fratelli e sorelle ha": "quantitativo",
    "la sua altezza in centimetri": "quantitativo",
    "quanti minuti impiega per arrivare a scuola": "quantitativo",
    "quante ore dorme la notte": "quantitativo",
    "quanti libri ha letto nell'ultimo anno": "quantitativo",
    "il numero di scarpe": "quantitativo",
}
# Which indices each kind allows: the mean needs numbers, the median an order, the mode nothing.
INDICES = {"qualitativo": "moda", "ordinabile": "mediana,moda", "quantitativo": "media,mediana,moda"}
INDEX_LABELS = {
    "moda": r"\text{solo la moda}",
    "mediana,moda": r"\text{mediana e moda}",
    "media,moda": r"\text{media e moda}",
    "media,mediana,moda": r"\text{media, mediana e moda}",
}

NUM = r"-?\d+(?:\\,\d{3})*(?:\{,\}\d+)?"


# ---------------------------------------------------------------------------
# Numbers and LaTeX

def rat(s):
    s = str(s).strip()
    if not re.fullmatch(r"-?\d+(/\d+)?", s):
        raise ValueError(f"not an exact rational: {s!r}")
    return F(s)


def two_decimals(r):
    return (r * 100).denominator == 1


def num_value(tex):
    """'6{,}52', '-3', '13\\,000' as a Fraction; None if it is not such a number."""
    tex = tex.strip()
    if not re.fullmatch(NUM, tex):
        return None
    neg = tex.startswith("-")
    body = tex.lstrip("-").replace("\\,", "")
    if "{,}" in body:
        a, b = body.split("{,}")
        v = F(int(a)) + F(int(b), 10 ** len(b))
    else:
        v = F(int(body))
    return -v if neg else v


def num_tex(r):
    """How the spec writes a number: comma, at most two decimals, thin space from five digits."""
    if not two_decimals(r):
        return None
    neg = r < 0
    r = abs(r)
    whole = r.numerator // r.denominator
    frac = r - whole
    ints = str(whole)
    if len(ints) >= 5:
        ints = re.sub(r"\B(?=(\d{3})+(?!\d))", r"\\,", ints)
    s = ints
    if frac:
        digits = str(int(frac * 100)).rjust(2, "0").rstrip("0")
        s += "{," + "}" + digits
    return ("-" if neg else "") + s


def lines_of(problem):
    """The lines of the problem: the outer array split at top-level \\\\ (a nested table stays whole)."""
    body = problem.strip()
    m = re.fullmatch(r"\\begin\{array\}\{l\}(.*)\\end\{array\}", body, re.S)
    if not m:
        return [body]
    body = m.group(1)
    out, depth, start, i = [], 0, 0, 0
    while i < len(body):
        if body.startswith("\\begin{", i):
            depth += 1
        elif body.startswith("\\end{", i):
            depth -= 1
        elif depth == 0 and body.startswith("\\\\", i):
            out.append(body[start:i].strip())
            i += 2
            start = i
            continue
        i += 1
    out.append(body[start:].strip())
    return [x for x in out if x]


def prose_of(problem):
    return " ".join(re.findall(r"\\text\{([^{}]*)\}", " ".join(l for l in lines_of(problem) if l.startswith("\\text{"))))


def givens_of(problem):
    rows = [l for l in lines_of(problem) if "\\quad" in l]
    if len(rows) != 1:
        return None
    items = [x.strip() for x in rows[0].split(",\\quad")]
    vals = [num_value(x) for x in items]
    return None if any(v is None for v in vals) else vals


def table_rows(problem, cols):
    m = re.search(r"\\begin\{array\}\{" + re.escape(cols) + r"\}(.*?)\\end\{array\}", problem, re.S)
    if not m:
        return None
    rows = [r.replace("\\hline", "").strip() for r in m.group(1).split("\\\\")]
    return [[c.strip() for c in r.split("&")] for r in rows if r]


def vertical_table(problem):
    rows = table_rows(problem, "c|c")
    if rows is None:
        return None, None
    return rows[0], rows[1:]


def unbrace(c):
    c = c.strip()
    return c[1:-1] if c.startswith("{") and c.endswith("}") else c


# ---------------------------------------------------------------------------
# Choice

def choice_errors(ch, truth_values, named=()):
    """Four options, distinct in values and text, exactly one equal to the truth, `correct` on it."""
    errs = []
    if ch is None:
        return ["choice mancante"]
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} opzioni")
    keys = [tuple(o["values"]) for o in opts]
    if len(set(keys)) != len(keys):
        errs.append(f"opzioni ripetute: {keys}")
    if len({o["latex"] for o in opts}) != len(opts):
        errs.append("opzioni con lo stesso testo")
    truth = tuple(truth_values)
    hits = [i for i, k in enumerate(keys) if k == truth]
    if len(hits) != 1:
        errs.append(f"{len(hits)} opzioni uguali alla risposta {truth}")
    elif ch.get("correct") != hits[0]:
        errs.append(f"correct = {ch.get('correct')}, la risposta è l'opzione {hits[0]}")
    for n in named:
        if tuple(n) != truth and tuple(n) not in keys:
            errs.append(f"manca il distrattore {n}")
    return errs


def number_choice_errors(ch, truth, named=()):
    errs = choice_errors(ch, [str(truth)], [[str(n)] for n in named if two_decimals(n)])
    for o in (ch or {}).get("options", []):
        v = num_value(o["latex"])
        if v is None or [str(v)] != [str(rat(x)) for x in o["values"]]:
            errs.append(f"opzione {o['latex']!r} non dice {o['values']}")
        if num_tex(v if v is not None else F(0)) != o["latex"]:
            errs.append(f"opzione scritta male: {o['latex']!r}")
    return errs


def number_answer_errors(sample, truth):
    ans = sample["answer"]
    if ans.get("kind") != "number":
        return [f"risposta di tipo {ans.get('kind')}"]
    errs = []
    if rat(ans["value"]) != truth:
        errs.append(f"risposta {ans['value']} invece di {truth}")
    if not two_decimals(truth):
        errs.append(f"risposta {truth} con più di due decimali")
    tex = num_tex(truth)
    if tex and tex not in sample["solution"]:
        errs.append(f"la soluzione non dice {tex}")
    return errs


def centre_as_written(xs):
    n = len(xs)
    return F(xs[(n - 1) // 2]) if n % 2 else F(xs[n // 2 - 1] + xs[n // 2], 2)


def median_exact(xs):
    return F(statistics.median(sorted(F(x) for x in xs)))


# ---------------------------------------------------------------------------
# Levels

def level1(s, p):
    errs = []
    xs = givens_of(s["problem"])
    if xs is None or [str(x) for x in xs] != p["data"]:
        return [f"dati del problema {xs} diversi da params {p['data']}"], None
    n = len(xs)
    if not 4 <= n <= 7:
        errs.append(f"{n} dati")
    if any(x.denominator != 1 for x in xs):
        errs.append("dati non interi")
    if p["context"] in ("numeri", "temperature") and not any(x < 0 for x in xs):
        errs.append("nessun dato negativo")
    mean = sum(xs) / n
    kind = "intera" if mean.denominator == 1 else "decimale"
    errs += number_answer_errors(s, mean)
    named = [sum(xs) / (n - 1)] if 0 in xs else []
    errs += number_choice_errors(s.get("choice"), mean, named)
    return errs, kind


def level2(s, p):
    errs = []
    rows = table_rows(s["problem"], "c|" + "c" * len(p["marks"]))
    if not rows or len(rows) != 2:
        return ["tabella voti e pesi mancante"], None
    marks = [num_value(c) for c in rows[0][1:]]
    weights = [num_value(c) for c in rows[1][1:]]
    if rows[0][0] != r"\text{Voto}" or rows[1][0] != r"\text{Peso}":
        errs.append("intestazione della tabella")
    if [str(m) for m in marks] != p["marks"] or [str(w) for w in weights] != p["weights"]:
        errs.append("tabella diversa da params")
    k = len(marks)
    if k not in (3, 4) or len(set(marks)) != k or not all(3 <= m <= 10 for m in marks):
        errs.append(f"voti {marks}")
    if not all(w in (1, 2, 3) for w in weights) or len(set(weights)) == 1:
        errs.append(f"pesi {weights}")
    W = sum(weights)
    P = sum(m * w for m, w in zip(marks, weights))
    mean = P / W
    if mean == sum(marks) / k:
        errs.append("la media ponderata è uguale alla media semplice")
    if not min(marks) <= mean <= max(marks):
        errs.append("media fuori dall'intervallo dei voti")
    errs += number_answer_errors(s, mean)
    errs += number_choice_errors(s.get("choice"), mean, [P / k])
    return errs, f"k={k}"


def read_num_table(s, p, errs):
    head, rows = vertical_table(s["problem"])
    if head is None:
        errs.append("tabella mancante")
        return None, None
    if not head[1] == r"\text{Frequenza }f_i" or not head[0].endswith("x_i"):
        errs.append(f"intestazione {head}")
    values = [num_value(r[0]) for r in rows]
    freqs = [num_value(r[1]) for r in rows]
    if [str(v) for v in values] != p["values"] or [str(f) for f in freqs] != p["freqs"]:
        errs.append("tabella diversa da params")
    if values != sorted(values) or len(set(values)) != len(values):
        errs.append("valori non crescenti")
    if any(f < 1 for f in freqs):
        errs.append("frequenza nulla")
    n = sum(freqs)
    if not re.search(rf"(?<!\d){n}(?!\d)", prose_of(s["problem"])):
        errs.append(f"il testo non dice n = {n}")
    return values, freqs


def expand(values, freqs):
    return [v for v, f in zip(values, freqs) for _ in range(int(f))]


def level3(s, p):
    errs = []
    values, freqs = read_num_table(s, p, errs)
    if values is None:
        return errs, None
    n = sum(freqs)
    k = len(values)
    if not 10 <= n <= 30:
        errs.append(f"n = {n}")
    if not 4 <= k <= 6:
        errs.append(f"{k} righe")
    S = sum(v * f for v, f in zip(values, freqs))
    mean = S / n
    if mean != F(statistics.mean(expand(values, freqs))):
        errs.append("media diversa da statistics.mean")
    errs += number_answer_errors(s, mean)
    errs += number_choice_errors(s.get("choice"), mean, [S / k])
    return errs, p["case"]


def level4(s, p):
    errs = []
    xs = givens_of(s["problem"])
    if xs is None or [str(x) for x in xs] != p["data"]:
        return [f"dati del problema {xs} diversi da params"], None
    n = len(xs)
    if n not in (5, 6, 7, 8, 9, 10):
        errs.append(f"{n} dati")
    if xs == sorted(xs):
        errs.append("lista già ordinata")
    me = median_exact(xs)
    centre = centre_as_written(xs)
    if centre == me:
        errs.append("il dato scritto al centro è la mediana")
    errs += number_answer_errors(s, me)
    errs += number_choice_errors(s.get("choice"), me, [centre, F(n + 1, 2)])
    return errs, "dispari" if n % 2 else "pari"


def level5(s, p):
    errs = []
    case = p["case"]
    if case.startswith("mediana") or case == "moda":
        values, freqs = read_num_table(s, p, errs)
        if values is None:
            return errs, None
        n = sum(freqs)
        if not 11 <= n <= 30:
            errs.append(f"n = {n}")
        data = sorted(expand(values, freqs))
        if case == "moda":
            modes = statistics.multimode(data)
            if len(modes) != 1:
                return errs + [f"mode {modes}"], None
            top = max(freqs)
            if F(modes[0]) == top:
                errs.append("la moda è uguale alla sua frequenza")
            errs += number_answer_errors(s, F(modes[0]))
            errs += number_choice_errors(s.get("choice"), F(modes[0]), [F(top)])
            return errs, "moda"
        me = median_exact(data)
        if n % 2:
            kind = "mediana-dispari"
        else:
            kind = "mediana-pari-uguali" if data[n // 2 - 1] == data[n // 2] else "mediana-pari-diversi"
        errs += number_answer_errors(s, me)
        errs += number_choice_errors(s.get("choice"), me)
        if "cumulate" not in " ".join(s["steps"]):
            errs.append("passaggi senza frequenze cumulate")
        return errs, kind
    if case == "moda-qualitativa":
        head, rows = vertical_table(s["problem"])
        if head is None or not re.fullmatch(r"\\text\{[A-Z][a-z]+\}", head[0]) or head[1] != r"\text{Frequenza}":
            errs.append(f"intestazione {head}")
        names = [re.fullmatch(r"\\text\{(.+)\}", r[0]).group(1) for r in rows]
        freqs = [num_value(r[1]) for r in rows]
        if names != p["modes"] or [str(f) for f in freqs] != p["freqs"]:
            errs.append("tabella diversa da params")
        top = max(freqs)
        if freqs.count(top) != 1:
            return errs + ["più di una moda"], None
        mode = names[freqs.index(top)]
        ch = s["answer"]
        if ch.get("kind") != "choice":
            return errs + ["risposta non a scelta"], None
        errs += choice_errors(ch, [f"valore:{mode}"], [[f"frequenza:{top}"]])
        for o in ch["options"]:
            key = o["values"][0]
            if key.startswith("valore:"):
                if key[7:] not in names or o["latex"] != r"\text{" + key[7:].lower() + "}":
                    errs.append(f"opzione {o}")
            elif key != f"frequenza:{top}" or o["latex"] != str(top):
                errs.append(f"opzione {o}")
        if mode.lower() not in s["solution"]:
            errs.append("la soluzione non dice la moda")
        return errs, case
    if case in ("bimodale", "senza-moda"):
        xs = givens_of(s["problem"])
        if xs is None or [str(x) for x in xs] != p["data"]:
            return ["dati diversi da params"], None
        if not 5 <= len(xs) <= 10:
            errs.append(f"{len(xs)} dati")
        modes = statistics.multimode(xs)
        distinct = set(xs)
        if len(modes) == len(distinct):
            kind, truth = "senza-moda", ["nessuna"]
        elif len(modes) == 2:
            kind, truth = "bimodale", [str(m) for m in sorted(modes)]
        else:
            return errs + [f"mode {modes}"], None
        ch = s["answer"]
        errs += choice_errors(ch, truth)
        for o in ch["options"]:
            vals = o["values"]
            if vals == ["nessuna"]:
                ok = o["latex"] == r"\text{non c'è moda}"
            elif len(vals) == 2:
                ok = o["latex"] == f"{vals[0]} " + r"\text{ e }" + f" {vals[1]}" and all(F(v) in distinct for v in vals)
            else:
                ok = o["latex"] == vals[0] and F(vals[0]) in distinct
            if not ok:
                errs.append(f"opzione {o}")
        return errs, kind
    return [f"caso {case}"], None


def level6(s, p):
    errs = []
    ch = s["answer"]
    if ch.get("kind") != "choice":
        return ["risposta non a scelta"], None
    if p["case"] == "carattere":
        m = re.fullmatch(r"In una classe si chiede a ogni studente (.+)\.", prose_of(s["problem"]))
        character = m.group(1) if m else None
        if character not in CHARACTER_KIND:
            return [f"carattere sconosciuto {character!r}"], None
        want = INDICES[CHARACTER_KIND[character]]
        errs += choice_errors(ch, [want])
        if [o["values"][0] for o in ch["options"]] != list(INDEX_LABELS):
            errs.append("opzioni non nell'ordine fisso")
        for o in ch["options"]:
            if INDEX_LABELS.get(o["values"][0]) != o["latex"]:
                errs.append(f"opzione {o}")
        return errs, "carattere"
    xs = givens_of(s["problem"])
    if xs is None or [str(x) for x in xs] != p["data"]:
        return ["dati diversi da params"], None
    n = len(xs)
    if n not in (5, 6, 7):
        errs.append(f"{n} dati")
    srt = sorted(xs)
    if srt[-1] < 3 * srt[-2]:
        errs.append(f"nessun valore anomalo: {srt}")
    mean = sum(xs) / n
    me = median_exact(xs)
    if mean.denominator != 1:
        errs.append("media non intera")
    if not mean > me:
        errs.append("la media non è tirata in alto")
    centre = centre_as_written(xs)
    errs += choice_errors(ch, ["mediana", str(me)], [["media", str(mean)], ["mediana", str(centre)]])
    for o in ch["options"]:
        which, v = o["values"]
        if o["latex"] != r"\text{la " + which + ": }" + (num_tex(rat(v)) or "?"):
            errs.append(f"opzione {o}")
    if num_tex(me) not in s["solution"]:
        errs.append("la soluzione non dice la mediana")
    return errs, "anomalo"


def level7(s, p):
    errs = []
    head, rows = vertical_table(s["problem"])
    if head is None:
        return ["tabella mancante"], None
    classes = []
    for r in rows:
        m = re.fullmatch(r"\[(\d+), (\d+)\[", unbrace(r[0]))
        if not m:
            return [f"classe scritta male: {r[0]}"], None
        classes.append((int(m.group(1)), int(m.group(2))))
    freqs = [num_value(r[1]) for r in rows]
    widths = {b - a for a, b in classes}
    if len(widths) != 1:
        errs.append("classi di ampiezza diversa")
    if any(classes[i][1] != classes[i + 1][0] for i in range(len(classes) - 1)):
        errs.append("classi non contigue")
    if [str(a) for a, _ in classes] != p["lows"] or [str(f) for f in freqs] != p["freqs"] or str(widths.pop()) != p["width"]:
        errs.append("tabella diversa da params")
    n = sum(freqs)
    if not 10 <= n <= 40 or not 3 <= len(classes) <= 5:
        errs.append(f"n = {n}, {len(classes)} classi")
    if not re.search(rf"(?<!\d){n}(?!\d)", prose_of(s["problem"])):
        errs.append(f"il testo non dice n = {n}")
    centres = [F(a + b, 2) for a, b in classes]
    mean = sum(c * f for c, f in zip(centres, freqs)) / n
    errs += number_answer_errors(s, mean)
    errs += number_choice_errors(s.get("choice"), mean)
    return errs, p["case"]


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7}


def check(sample):
    p = sample["params"]
    errs = []
    text = sample["problem"] + " ".join(sample["steps"]) + sample["solution"]
    if "—" in text or "piuttosto che" in text:
        errs.append("parole vietate")
    if re.search(r"\d\.\d", sample["problem"]):
        errs.append("punto decimale nel problema")
    if not sample["steps"] or not sample["solution"]:
        errs.append("passaggi o soluzione mancanti")
    f = LEVELS.get(sample["level"])
    if not f:
        return errs + [f"livello {sample['level']}"], None
    e, kind = f(sample, p)
    errs += e
    if kind is not None and p.get("case") != kind:
        errs.append(f"params.case {p.get('case')!r}, il problema è {kind!r}")
    return errs, kind
