"""Checker for geometria-enti, written from specs/exercises/geometria-enti.md.

For every sample it reads the data from params, checks that the text of the problem states them, computes
the answer on its own (lengths as exact Fractions, angles in minutes) and compares it with the answer and
the correct option. Options are read back from their LaTeX. On level 7 the equation of params is parsed
with SymPy, solved, and must give the same x as the story rebuilt from the data; the steps must contain it.
"""
import re
from fractions import Fraction

from sympy import Rational, Symbol, solve, sympify

X = Symbol("x")


def _around(share, slack):
    return (max(0.0, share - slack), share + slack)


CASE_RANGES = {
    1: {s: _around(0.25, 0.08) for s in ["mn", "mc", "an", "mb"]},
    2: {
        "nullo": _around(0.06, 0.04),
        "acuto": _around(0.22, 0.07),
        "retto": _around(0.10, 0.05),
        "ottuso": _around(0.22, 0.07),
        "piatto": _around(0.10, 0.05),
        "concavo": _around(0.20, 0.07),
        "giro": _around(0.10, 0.05),
    },
    3: {"somma": _around(0.5, 0.08), "differenza": _around(0.5, 0.08)},
    4: {"complementare": _around(0.35, 0.07), "supplementare": _around(0.40, 0.07), "esplementare": _around(0.25, 0.07)},
    5: {"complementare": _around(0.35, 0.07), "supplementare": _around(0.40, 0.07), "esplementare": _around(0.25, 0.07)},
    6: {s: _around(0.25, 0.08) for s in ["opposto", "adiacente", "bisettrici-adiacenti", "bisettrici-consecutivi"]},
    7: {s: _around(0.2, 0.07) for s in ["segmento-rapporto", "segmento-differenza", "angoli-rapporto", "angoli-differenza", "angolo-multiplo"]},
}

TARGET = {"complementare": 90, "supplementare": 180, "esplementare": 360}
PAIR_WORD = {"complementare": "complementari", "supplementare": "supplementari", "esplementare": "esplementari"}
TIMES = {2: "doppio", 3: "triplo", 4: "quadruplo", 5: "quintuplo", 6: "sestuplo", 7: "settuplo", 10: "decuplo"}
GREEK = ["\\alpha", "\\beta", "\\gamma", "\\delta"]
CHOICE_LEVELS = {2, 3, 5}


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
    """The text of the problem as one line: the \\text groups joined back (textBlock breaks them)."""
    return re.sub(r"\s+", " ", " ".join(text_groups(tex))).strip()


def frac_tex(f):
    f = Fraction(f)
    if f.denominator == 1:
        return str(f.numerator)
    if f.denominator == 2:
        return f"{f.numerator // 2}{{,}}5"
    raise ValueError(f"not a half: {f}")


def read_cm(latex):
    m = re.fullmatch(r"(\d+)(?:\{,\}(\d))? \\text\{ cm\}", latex)
    if not m:
        raise ValueError(f"not a length: {latex!r}")
    return Fraction(int(m.group(1))) + (Fraction(int(m.group(2)), 10) if m.group(2) else 0)


def read_deg(latex):
    m = re.fullmatch(r"(\d+)\^\\circ", latex)
    if not m:
        raise ValueError(f"not an angle: {latex!r}")
    return int(m.group(1))


def read_dm(latex):
    m = re.fullmatch(r"(\d+)\^\\circ(?: (\d+)')?", latex)
    if not m:
        raise ValueError(f"not degrees and minutes: {latex!r}")
    return int(m.group(1)), int(m.group(2) or 0)


def dm_tex(d, m):
    return f"{d}^\\circ" if m == 0 else f"{d}^\\circ {m}'"


def to_value(latex, level):
    """(value, finished) of an option: value in cm, degrees or minutes; finished = a proper answer form."""
    if level in (1,) or (level == 7 and "cm" in latex):
        return read_cm(latex), True
    if level in (3, 5):
        d, m = read_dm(latex)
        return d * 60 + m, 0 <= m < 60
    return Fraction(read_deg(latex)), True


# ---------------------------------------------------------------------------
# The answer from the data


def half(n):
    return Fraction(n, 2)


def level1(p, text):
    st = p["story"]
    errs = []
    if st == "mb":
        s, a = int(p["AC"]), int(p["AB"])
        if not (8 <= s <= 30 and 1 <= a < s):
            errs.append("dati fuori intervallo")
        for phrase in [f"$AC$ è lungo ${s}$ cm", f"$AB = {a}$ cm", "$M$ è il punto medio di $AC$", "Quanto è lungo $MB$?"]:
            if phrase not in text:
                errs.append(f"manca nel testo: {phrase}")
        ans = abs(Fraction(a) - half(s))
        if ans in (0, a, s):
            errs.append("risposta uguale a un dato")
        return ans, errs
    a, b = int(p["AB"]), int(p["BC"])
    if not (2 <= a <= 20 and 2 <= b <= 20 and a != b):
        errs.append("dati fuori intervallo")
    for phrase in ["$AB$ e $BC$ sono adiacenti", f"$AB = {a}$ cm", f"$BC = {b}$ cm"]:
        if phrase not in text:
            errs.append(f"manca nel testo: {phrase}")
    if st == "mn":
        ans, need = half(a) + half(b), ["$M$ è il punto medio di $AB$", "$N$ è il punto medio di $BC$", "lungo $MN$?"]
    elif st == "mc":
        ans, need = half(a) + b, ["$M$ è il punto medio di $AB$", "lungo $MC$?"]
    elif st == "an":
        ans, need = a + half(b), ["$N$ è il punto medio di $BC$", "lungo $AN$?"]
    else:
        return None, [f"storia sconosciuta {st}"]
    for phrase in need:
        if phrase not in text:
            errs.append(f"manca nel testo: {phrase}")
    if ans in (a, b):
        errs.append("risposta uguale a un dato")
    return ans, errs


def kind_of(m):
    if m == 0:
        return "nullo"
    if m < 90:
        return "acuto"
    if m == 90:
        return "retto"
    if m < 180:
        return "ottuso"
    if m == 180:
        return "piatto"
    if m < 360:
        return "concavo"
    if m == 360:
        return "giro"
    raise ValueError(m)


def level3(p, text, problem):
    g1, p1, g2, p2 = (int(p[k]) for k in ("g1", "p1", "g2", "p2"))
    errs = []
    if not (0 < p1 < 60 and 0 < p2 < 60):
        errs.append("primi fuori da 1-59 nei dati")
    if p["case"] == "somma":
        if problem != f"{dm_tex(g1, p1)} + {dm_tex(g2, p2)}":
            errs.append("testo della somma diverso dai dati")
        if p1 + p2 <= 60:
            errs.append("somma senza riporto")
        tot = (g1 * 60 + p1) + (g2 * 60 + p2)
    else:
        if problem != f"{dm_tex(g1, p1)} - {dm_tex(g2, p2)}":
            errs.append("testo della differenza diverso dai dati")
        if p1 >= p2:
            errs.append("differenza senza prestito")
        tot = (g1 * 60 + p1) - (g2 * 60 + p2)
        if tot < 60:
            errs.append("differenza sotto un grado")
    if tot % 60 == 0:
        errs.append("risultato senza primi")
    return tot, errs


def level45(p, text, level):
    kase = p["case"]
    T = TARGET[kase]
    errs = []
    art = "l'" if kase == "esplementare" else "il "
    if level == 4:
        a = int(p["angle"])
        if not 5 <= a <= T - 5 or 2 * a == T:
            errs.append("angolo fuori intervallo o uguale alla risposta")
        if p["phrasing"] == "trova":
            need = f"Trova {art}{kase} di un angolo di ${a}^\\circ$."
        else:
            need = f"Gli angoli $\\alpha$ e $\\beta$ sono {PAIR_WORD[kase]} e $\\alpha = {a}^\\circ$. Quanto misura $\\beta$?"
        if text != need:
            errs.append(f"testo diverso: {text!r}")
        return Fraction(T - a), errs
    d, m = int(p["deg"]), int(p["min"])
    if not (0 < m < 60 and d >= 2 and d * 60 + m < T * 60):
        errs.append("angolo fuori intervallo")
    if text != f"Trova {art}{kase} di un angolo di ${dm_tex(d, m)}$.":
        errs.append(f"testo diverso: {text!r}")
    return T * 60 - (d * 60 + m), errs


def level6(p, text):
    kase = p["case"]
    errs = []
    if kase in ("opposto", "adiacente"):
        a = int(p["angle"])
        gi, ai = GREEK.index(p["given"]), GREEK.index(p["asked"])
        if a == 90 or not 20 <= a <= 160:
            errs.append("angolo fuori intervallo")
        need = (
            "Due rette incidenti in $O$ formano quattro angoli, $\\alpha$, $\\beta$, $\\gamma$ e $\\delta$, uno dopo"
            f" l'altro intorno a $O$. Se ${p['given']} = {a}^\\circ$, quanto misura ${p['asked']}$?"
        )
        if text != need:
            errs.append(f"testo diverso: {text!r}")
        opposite = (gi - ai) % 4 == 2
        if gi == ai or opposite != (kase == "opposto"):
            errs.append("caso diverso dalla posizione degli angoli")
        return Fraction(a if opposite else 180 - a), errs
    if kase == "bisettrici-adiacenti":
        a = int(p["a"])
        if a % 2 or a == 90 or not 20 <= a <= 160:
            errs.append("angolo fuori intervallo")
        if f"sono adiacenti e $\\widehat{{AOB}} = {a}^\\circ$" not in text or "bisettrici" not in text:
            errs.append("testo diverso dai dati")
        # The bisectors split AOB and its adjacent BOC = 180 - a: half of each.
        return half(a) + half(180 - a), errs
    a, b = int(p["a"]), int(p["b"])
    if a % 2 or b % 2 or a == b or a + b >= 180:
        errs.append("angoli fuori intervallo")
    if f"consecutivi $\\widehat{{AOB}}$ e $\\widehat{{BOC}}$ misurano ${a}^\\circ$ e ${b}^\\circ$" not in text:
        errs.append("testo diverso dai dati")
    return half(a) + half(b), errs


def parse_eq(tex):
    lhs, rhs = tex.split("=")
    conv = lambda s: sympify(re.sub(r"(\d)\s*([x(])", r"\1*\2", s.replace("\\cdot", "*")), locals={"x": X})  # noqa: E731
    return conv(lhs) - conv(rhs)


def level7(p, text, steps):
    st = p["story"]
    errs = []
    eq = p["equation"]
    if not any(eq in s for s in steps):
        errs.append("l'equazione non è nei passaggi")
    if re.search(r"(?<!\d)1x|(?<!\d)0x|\+\s*-|-\s*-", eq):
        errs.append(f"equazione scritta male: {eq}")
    if st == "segmento-rapporto":
        s, k = int(p["AC"]), int(p["k"])
        x = Fraction(s, k + 1)
        story_expr = k * X + X - s
        if f"$AC$ è lungo ${s}$ cm" not in text or f"con $AB$ {TIMES[k]} di $BC$" not in text:
            errs.append("testo diverso dai dati")
        ans = {"AB": k * x, "BC": x}[p["ask"]]
        unit = "cm"
    elif st == "segmento-differenza":
        s, d = int(p["AC"]), int(p["d"])
        x = Fraction(s - d, 2)
        story_expr = X + (X + d) - s
        if f"$AC$ è lungo ${s}$ cm" not in text or f"più lungo di $BC$ di ${d}$ cm" not in text:
            errs.append("testo diverso dai dati")
        ans = {"AB": x + d, "BC": x}[p["ask"]]
        unit = "cm"
    elif st in ("angoli-rapporto", "angoli-differenza"):
        pair = p["pair"]
        T = {"complementari": 90, "supplementari": 180, "adiacenti": 180}[pair]
        if st == "angoli-rapporto":
            k = int(p["k"])
            x = Fraction(T, k + 1)
            story_expr = k * X + X - T
            big = k * x
            if f"Due angoli {pair} sono uno il {TIMES[k]} dell'altro." not in text:
                errs.append("testo diverso dai dati")
        else:
            d = int(p["d"])
            x = Fraction(T - d, 2)
            story_expr = X + X + d - T
            big = x + d
            if f"Due angoli {pair} differiscono di ${d}^\\circ$." not in text:
                errs.append("testo diverso dai dati")
        if f"Quanto misura il {p['ask']}?" not in text:
            errs.append("domanda diversa")
        ans = {"maggiore": big, "minore": x}[p["ask"]]
        unit = "deg"
    elif st == "angolo-multiplo":
        k, form = int(p["k"]), p["form"]
        if form == "sup-comp":
            story_expr = (180 - X) - k * (90 - X)
            need = f"Trova l'angolo acuto il cui supplementare è il {TIMES[k]} del suo complementare."
            lim = 90
        elif form == "sup-angolo":
            story_expr = (180 - X) - k * X
            need = f"Trova l'angolo il cui supplementare è il {TIMES[k]} dell'angolo stesso."
            lim = 180
        else:
            story_expr = (90 - X) - k * X
            need = f"Trova l'angolo il cui complementare è il {TIMES[k]} dell'angolo stesso."
            lim = 90
        if text != need:
            errs.append(f"testo diverso: {text!r}")
        sol = solve(story_expr, X)
        x = Fraction(int(sol[0].p), int(sol[0].q))
        if not 0 < x < lim:
            errs.append("soluzione fuori dalle limitazioni")
        ans = x
        unit = "deg"
    else:
        return None, None, [f"storia sconosciuta {st}"]
    if x.denominator != 1 or x <= 0:
        errs.append("x non è un intero positivo")
    if Fraction(p["x"]) != x:
        errs.append("x di params sbagliata")
    sol = solve(parse_eq(eq), X)
    if len(sol) != 1 or sol[0] != Rational(x.numerator, x.denominator):
        errs.append(f"l'equazione {eq} non dà x = {x}")
    if solve(story_expr, X) != sol:
        errs.append("l'equazione non traduce la storia")
    return ans, unit, errs


# ---------------------------------------------------------------------------


def check(sample):
    errs = []
    lvl = sample["level"]
    p = sample["params"]
    problem = sample["problem"]
    text = prose(problem)
    if "—" in problem or "piuttosto che" in problem:
        errs.append("parole vietate")
    kind = None
    if lvl == 1:
        truth, e = level1(p, text)
        kind = p["story"]
    elif lvl == 2:
        m = int(p["measure"])
        truth, e = kind_of(m), []
        if p["case"] != truth:
            e.append("caso sbagliato")
        if text != f"L'angolo ${p['name']}$ misura ${m}^\\circ$. Che tipo di angolo è?":
            e.append(f"testo diverso: {text!r}")
        if m > 180 and p["name"].startswith("\\widehat"):
            e.append("un angolo concavo scritto con tre lettere")
        kind = truth
    elif lvl == 3:
        truth, e = level3(p, text, problem)
        kind = p["case"]
    elif lvl in (4, 5):
        truth, e = level45(p, text, lvl)
        kind = p["case"]
    elif lvl == 6:
        truth, e = level6(p, text)
        kind = p["case"]
    elif lvl == 7:
        truth, _unit, e = level7(p, text, sample["steps"])
        kind = p["story"]
    else:
        return [f"livello sconosciuto {lvl}"], None
    errs += e
    if truth is None:
        return errs, kind

    ch = sample["answer"] if lvl in CHOICE_LEVELS else sample.get("choice")
    if lvl in CHOICE_LEVELS and sample["answer"].get("kind") != "choice":
        errs.append("la risposta deve essere a scelta multipla")
    if lvl not in CHOICE_LEVELS:
        ans = sample["answer"]
        if ans.get("kind") != "number" or Fraction(ans["value"]) != truth:
            errs.append(f"risposta {ans.get('value')} invece di {truth}")
    if not ch or ch.get("kind") != "choice" or len(ch["options"]) != 4:
        return errs + ["servono quattro opzioni"], kind
    opts = ch["options"]
    if len({o["latex"] for o in opts}) != 4 or len({"|".join(o["values"]) for o in opts}) != 4:
        errs.append("opzioni ripetute")
    right = []
    for i, o in enumerate(opts):
        if lvl == 2:
            m = re.fullmatch(r"\\text\{(\w+)\}", o["latex"])
            if not m or m.group(1) not in CASE_RANGES[2] or o["values"] != [m.group(1)]:
                errs.append(f"opzione illeggibile {o['latex']}")
                continue
            if m.group(1) == truth:
                right.append(i)
            continue
        try:
            val, finished = to_value(o["latex"], lvl)
        except ValueError as ex:
            errs.append(str(ex))
            continue
        if lvl in (3, 5):
            d, mm = read_dm(o["latex"])
            if o["values"] != [str(d), str(mm)]:
                errs.append(f"valori dell'opzione diversi dal LaTeX: {o}")
        elif Fraction(o["values"][0]) != val:
            errs.append(f"valori dell'opzione diversi dal LaTeX: {o}")
        if val <= 0:
            errs.append(f"opzione non positiva {o['latex']}")
        # A distractor with the value of the answer is wrong only because it is not finished (55°75').
        if val == truth and finished:
            right.append(i)
    if right != [ch["correct"]]:
        errs.append(f"opzioni giuste {right}, correct {ch['correct']}")
    return errs, kind
