"""Checker for numeri-razionali-proporzioni, from specs/exercises/numeri-razionali-proporzioni.md.

The data are read back from what the student sees: the proportion from the problem LaTeX (levels
1-3), the numbers of the word problem from the prompt (levels 4-6) or from the text in the problem
(level 7, where each story has its own sentence and the answer comes from the rule the lesson gives
for it: the proportion between two quantities, the scale, the parts of a total). The answer is recomputed with
SymPy Rationals (the proportion is solved as an equation in x) and every option is parsed from its
LaTeX, so a wrong label or a wrong value is caught.
"""
import re
from math import gcd

from sympy import Rational, Symbol, solve

from verify import rat

X = Symbol("x")

CASE_RANGES = {
    1: {"minore di 1": (0.55, 0.85), "maggiore di 1": (0.15, 0.45)},
    2: {"estremo": (0.40, 0.60), "medio": (0.40, 0.60)},
    3: {"frazioni": (0.25, 0.42), "decimali": (0.25, 0.42), "negativi": (0.25, 0.42)},
    4: {"parte": (0.25, 0.42), "percentuale": (0.25, 0.42), "totale": (0.25, 0.42)},
    5: {"avanti": (0.25, 0.42), "indietro": (0.25, 0.42), "variazione": (0.25, 0.42)},
    6: {"finale": (0.30, 0.50), "totale": (0.30, 0.50), "annullare": (0.12, 0.28)},
    7: {"diretta": (0.42, 0.58), "scala": (0.17, 0.33), "parti": (0.17, 0.33)},
}

CM_PER_KM = 100000

NUM = r"\d+(?:,\d+)?"


def num(s):
    """Plain-text number with the decimal comma: "57,60" -> 288/5."""
    return Rational(s.replace(",", "."))


def ndec(r):
    """Decimal places of a finite decimal, None if periodic."""
    d, k = r.q, 0
    while d % 10 == 0:
        d //= 10
        k += 1
    e2 = e5 = 0
    while d % 2 == 0:
        d //= 2
        e2 += 1
    while d % 5 == 0:
        d //= 5
        e5 += 1
    return k + max(e2, e5) if d == 1 else None


def parse_term(s):
    """A proportion term: x, 12, (-3), \\frac{2}{3}, 0{,}4. Returns (value or 'x', form)."""
    s = s.strip()
    if s == "x":
        return "x", None
    m = re.fullmatch(r"\((-\d+(?:\{,\}\d+)?)\)", s)
    if m:
        return Rational(m.group(1).replace("{,}", ".")), "neg"
    m = re.fullmatch(r"\\frac\{(\d+)\}\{(\d+)\}", s)
    if m:
        n, d = int(m.group(1)), int(m.group(2))
        if gcd(n, d) != 1 or d < 2:
            raise ValueError(f"fraction not reduced: {s}")
        return Rational(n, d), "frac"
    m = re.fullmatch(r"\d+\{,\}\d+", s)
    if m:
        return Rational(s.replace("{,}", ".")), "dec"
    m = re.fullmatch(r"\d+", s)
    if m:
        return Rational(int(s)), "int"
    raise ValueError(f"unknown term {s!r}")


def parse_option(latex, show):
    """Value written in an option's LaTeX, following the spec's formats."""
    s = latex.strip()
    if show == "frac":
        m = re.fullmatch(r"(-?)\\frac\{(\d+)\}\{(\d+)\}|(-?\d+)", s)
        if not m:
            raise ValueError(f"not a fraction: {s}")
        if m.group(4):
            return Rational(int(m.group(4)))
        n, d = int(m.group(2)), int(m.group(3))
        if gcd(n, d) != 1:
            raise ValueError(f"option not reduced: {s}")
        return Rational(-n if m.group(1) else n, d)
    if show in ("dec", "money"):
        m = re.fullmatch(r"-?\d+(?:\{,\}\d+)?", s)
        if not m:
            raise ValueError(f"not a decimal: {s}")
        if show == "money" and "{,}" in s and len(s.split("{,}")[1]) != 2:
            raise ValueError(f"price without two decimals: {s}")
        return Rational(s.replace("{,}", "."))
    if show == "pct":
        m = re.fullmatch(r"(\d+(?:\{,\}\d+)?)\\%", s)
        if not m:
            raise ValueError(f"not a percentage: {s}")
        return Rational(m.group(1).replace("{,}", "."))
    if show == "change":
        if s == r"\text{nessuna variazione}":
            return Rational(0)
        m = re.fullmatch(r"\\text\{(aumento|diminuzione) del \}(\d+(?:\{,\}\d+)?)\\%", s)
        if not m:
            raise ValueError(f"not a change: {s}")
        v = Rational(m.group(2).replace("{,}", "."))
        return v if m.group(1) == "aumento" else -v
    raise ValueError(f"unknown show {show}")


def coef(direction, p):
    return 1 + p / 100 if direction in ("aumenta", "aumento") else 1 - p / 100


def truth_of(sample, errs):
    """(truth, kind, show) recomputed from the text."""
    lvl = sample["level"]
    prompt = sample["prompt"]
    problem = sample["problem"]
    if lvl == 1:
        m = re.fullmatch(r"(\d+) : (\d+)", problem)
        if not m:
            raise ValueError(f"level 1 problem {problem!r}")
        a, b = int(m.group(1)), int(m.group(2))
        if f"rapporto tra {a} e {b}" not in prompt:
            errs.append("prompt does not name a and b in order")
        if gcd(a, b) < 2:
            errs.append("level 1: ratio already reduced")
        if a > 150 or b > 150:
            errs.append("level 1: numbers above 150")
        r = Rational(a, b)
        if r.q == 1:
            errs.append("level 1: integer ratio")
        return r, ("maggiore di 1" if r > 1 else "minore di 1"), "frac"
    if lvl in (2, 3):
        m = re.fullmatch(r"(.+) : (.+) = (.+) : (.+)", problem)
        if not m:
            raise ValueError(f"not a proportion: {problem!r}")
        parsed = [parse_term(g) for g in m.groups()]
        vals = [v for v, _ in parsed]
        if vals.count("x") != 1:
            raise ValueError("need exactly one x")
        pos = vals.index("x")
        sym = [X if v == "x" else v for v in vals]
        sols = solve(sym[0] * sym[3] - sym[1] * sym[2], X)
        if len(sols) != 1:
            raise ValueError(f"solutions {sols}")
        x = Rational(sols[0])
        given = [v for v in vals if v != "x"]
        forms = [f for _, f in parsed if f]
        if any(v == 0 for v in given) or x == 0:
            errs.append("zero term")
        # the two ratios must be equal with the solution in place
        full = [x if v == "x" else v for v in vals]
        if full[0] / full[1] != full[2] / full[3]:
            errs.append("ratios differ")
        if lvl == 2:
            if set(forms) != {"int"} or any(v <= 0 or v > 100 for v in full) or x.q != 1:
                errs.append("level 2: positive integers up to 100, integer result")
            if full[0] == full[1]:
                errs.append("level 2: ratio 1")
            if x == 1:
                errs.append("level 2: x = 1")
            return x, ("estremo" if pos in (0, 3) else "medio"), "frac"
        if "neg" in forms:
            kind = "negativi"
            if any(f not in ("int", "neg") for f in forms) or any(v.q != 1 or abs(v) > 60 for v in full):
                errs.append("negativi: integers up to 60")
            show = "frac"
        elif "dec" in forms:
            kind = "decimali"
            if sum(1 for f in forms if f == "dec") < 2 or "frac" in forms:
                errs.append("decimali: at least two decimal terms")
            if any(v <= 0 or v > 50 or ndec(v) is None or ndec(v) > 1 for v in full):
                errs.append("decimali: positive, one decimal digit, up to 50")
            show = "dec"
        elif "frac" in forms:
            kind = "frazioni"
            if sum(1 for f in forms if f == "frac") < 2:
                errs.append("frazioni: at least two fractional terms")
            if x <= 0 or x.q > 12 or x.p > 40:
                errs.append(f"frazioni: result {x} out of range")
            show = "frac"
        else:
            errs.append("level 3 with integer terms only")
            kind, show = None, "frac"
        return x, kind, show
    if lvl == 4:
        m = re.fullmatch(rf"Quanto è il ({NUM})% di ({NUM})\?", prompt)
        if m:
            p, T = num(m.group(1)), num(m.group(2))
            if T > 500:
                errs.append("parte: total above 500")
            return p / 100 * T, "parte", "dec"
        m = re.fullmatch(rf"Che percentuale di ({NUM}) è ({NUM})\?", prompt)
        if m:
            T, P = num(m.group(1)), num(m.group(2))
            if not 0 < P < T:
                errs.append("percentuale: part must be less than the total")
            return P / T * 100, "percentuale", "pct"
        m = re.fullmatch(rf"Il ({NUM})% di un numero è ({NUM})\. Qual è il numero\?", prompt)
        if m:
            p, P = num(m.group(1)), num(m.group(2))
            T = P * 100 / p
            if T.q != 1 or T > 500:
                errs.append("totale: total not an integer up to 500")
            return T, "totale", "dec"
        raise ValueError(f"level 4 prompt {prompt!r}")
    if lvl == 5:
        m = re.fullmatch(rf"Un prezzo di ({NUM}) € aumenta del ({NUM})%\. Quanto diventa, in euro\?", prompt) or re.fullmatch(
            rf"Un articolo da ({NUM}) € è (scontato) del ({NUM})%\. Quanto costa dopo lo sconto, in euro\?", prompt
        )
        if m:
            g = m.groups()
            T, p = num(g[0]), num(g[-1])
            d = "sconto" if len(g) == 3 else "aumento"
            return T * coef(d, p), "avanti", "money"
        m = re.fullmatch(rf"Dopo un (aumento) del ({NUM})% un prezzo è ({NUM}) €\. Quanto era prima, in euro\?", prompt) or re.fullmatch(
            rf"Dopo uno (sconto) del ({NUM})% un articolo costa ({NUM}) €\. Quanto costava prima, in euro\?", prompt
        )
        if m:
            d, p, F = m.group(1), num(m.group(2)), num(m.group(3))
            if ndec(F) is None or ndec(F) > 2:
                errs.append("indietro: price with more than two decimals")
            T = F / coef(d, p)
            if T.q != 1:
                errs.append("indietro: starting price not an integer")
            return T, "indietro", "money"
        m = re.fullmatch(rf"Un prezzo passa da ({NUM}) € a ({NUM}) €\. Di quale percentuale è cambiato\?", prompt)
        if m:
            V, W = num(m.group(1)), num(m.group(2))
            c = (W - V) / V * 100
            if c.q != 1 or c == 0 or abs(c) > 40:
                errs.append("variazione: integer, non-zero, up to 40")
            return c, "variazione", "change"
        raise ValueError(f"level 5 prompt {prompt!r}")
    if lvl == 6:
        m = re.fullmatch(
            rf"Un prezzo(?: di ({NUM}) €)? (aumenta|scende) del ({NUM})% e poi (aumenta|scende) del ({NUM})%\. (Quanto diventa, in euro|Di quale percentuale è cambiato in tutto)\?",
            prompt,
        )
        if m:
            T, d1, p1, d2, p2, q = m.groups()
            k = coef(d1, num(p1)) * coef(d2, num(p2))
            if q.startswith("Quanto"):
                if T is None:
                    raise ValueError("finale without a starting price")
                return num(T) * k, "finale", "money"
            if T is not None:
                errs.append("totale with a price")
            c = (k - 1) * 100
            if c == 0:
                errs.append("totale: no change")
            return c, "totale", "change"
        m = re.fullmatch(rf"Un prezzo (aumenta|scende) del ({NUM})%\. Di quale percentuale deve cambiare per tornare al valore iniziale\?", prompt)
        if m:
            k = coef(m.group(1), num(m.group(2)))
            return (1 / k - 1) * 100, "annullare", "change"
        raise ValueError(f"level 6 prompt {prompt!r}")
    if lvl == 7:
        return word_problem(sample, errs)
    raise ValueError(f"unknown level {lvl}")


def plain(tex):
    """The level 7 text as a sentence: \text{} lines joined, inline $1 : 25\,000$ as "1 : 25000"."""
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", tex.strip())
    body = m.group(1) if m else tex.strip()
    parts = body.split(r" \\ ")
    out = []
    for part in parts:
        m = re.fullmatch(r"\\text\{(.*)\}", part)
        if not m:
            raise ValueError(f"level 7: not a text line {part!r}")
        out.append(m.group(1))
    s = " ".join(out)
    return re.sub(r"\$([^$]*)\$", lambda m: m.group(1).replace("\\,", ""), s)


WHOLE = "counts, grams and minutes must be whole"
N = r"(\d+(?:,\d+)?)"


def word_problem(sample, errs):
    """(truth, kind, show) of a level 7 story, from its text; the story in params must match."""
    s = plain(sample["problem"])
    if sample["prompt"] != "Risolvi il problema.":
        errs.append("level 7 prompt")
    if s.count("?") != 1 or not s.endswith("?"):
        errs.append("level 7: one question, at the end")
    story = sample["params"].get("story")

    def match(name, pattern):
        m = re.fullmatch(pattern, s)
        if m and story != name:
            errs.append(f"text is story {name}, params say {story}")
        return m

    def direct(q1, v1, q2, show, whole=True):
        # q1 : q2 = v1 : x, the two ratios of like quantities
        q1, v1, q2 = num(q1), num(v1), num(q2)
        x = v1 * q2 / q1
        if q1 == q2:
            errs.append("same quantity twice")
        if whole and x.q != 1:
            errs.append(WHOLE)
        return x, "diretta", show

    m = match("ricetta", rf"Per un dolce per {N} persone la ricetta della nonna di [A-Z][a-z]+ chiede {N} (g|ml) di (farina|zucchero|latte)\. Quanti (grammi|millilitri) di \4 servono per {N} persone\?")
    if m:
        if (m.group(3) == "g") != (m.group(5) == "grammi"):
            errs.append("unit of the question differs from the text")
        return direct(m.group(1), m.group(2), m.group(6), "dec")
    m = match("spesa", rf"Al mercato [A-Z][a-z]+ paga {N} euro per {N} kg di (mele|arance|pomodori|patate)\. Quanto spende, in euro, per {N} kg di \3\?")
    if m:
        if "," in m.group(1) and len(m.group(1).split(",")[1]) != 2:
            errs.append("price in the text without two decimals")
        return direct(m.group(2), m.group(1), m.group(4), "money", whole=False)
    m = match("benzina", rf"Con {N} litri di benzina l'auto della famiglia [A-Z][a-z]+ percorre {N} km\. Quanti km percorre, alla stessa andatura, con {N} litri\?")
    if m:
        return direct(m.group(1), m.group(2), m.group(3), "dec")
    m = match("bici", rf"In bicicletta, a velocità costante, ([A-Z][a-z]+) percorre {N} km in {N} minuti\. Quanti minuti (le|gli) servono per percorrere {N} km alla stessa velocità\?")
    if m:
        female = m.group(1) in ("Giulia", "Sofia", "Chiara", "Aurora", "Martina")
        if female != (m.group(4) == "le"):
            errs.append("le/gli does not match the name")
        return direct(m.group(2), m.group(3), m.group(5), "dec")
    m = match("stampante", rf"La stampante della segreteria della scuola stampa {N} pagine in {N} minuti\. Quante pagine stampa, allo stesso ritmo, in {N} minuti\?")
    if m:
        return direct(m.group(2), m.group(1), m.group(3), "dec")
    m = match("cartina", rf"Su una cartina dei sentieri in scala 1 : (\d+) due rifugi distano {N} cm\. Quanti km distano nella realtà\?")
    if m:
        km = int(m.group(1)) * num(m.group(2)) / CM_PER_KM
        if ndec(km) is None or ndec(km) > 2 or km > 20:
            errs.append("cartina: real distance up to 20 km, two decimals")
        return km, "scala", "dec"
    m = match("sentiero", rf"Un sentiero di montagna è lungo {N} km\. Quanti cm misura su una cartina in scala 1 : (\d+)\?")
    if m:
        cm = num(m.group(1)) * CM_PER_KM / int(m.group(2))
        if ndec(cm) is None or ndec(cm) > 1 or not 2 <= cm <= 40:
            errs.append("sentiero: 2 to 40 cm on the map, one decimal")
        return cm, "scala", "dec"

    def parts(T, a, b, first, show):
        T, a, b = num(T), int(a), int(b)
        if a == b or gcd(a, b) != 1:
            errs.append("ratio not reduced or equal to 1")
        share = T / (a + b) * (a if first else b)
        if show == "dec" and share.q != 1:
            errs.append(WHOLE)
        return share, "parti", show

    m = match("regalo", rf"I nonni regalano {N} euro a ([A-Z][a-z]+) e ([A-Z][a-z]+), da dividere in modo che le quote di \2 e di \3 stiano nel rapporto (\d+) : (\d+)\. Quanti euro riceve ([A-Z][a-z]+)\?")
    if m:
        if m.group(2) == m.group(3) or m.group(6) not in (m.group(2), m.group(3)):
            errs.append("regalo: two different people, one of them asked")
        return parts(m.group(1), m.group(4), m.group(5), m.group(6) == m.group(2), "money")
    m = match("classe", rf"In una classe di {N} studenti il rapporto tra ragazzi e ragazze è (\d+) : (\d+)\. (Quanti sono i ragazzi|Quante sono le ragazze)\?")
    if m:
        return parts(m.group(1), m.group(2), m.group(3), m.group(4).endswith("ragazzi"), "dec")
    m = match("bibita", rf"Una bibita si prepara mescolando sciroppo e acqua nel rapporto (\d+) : (\d+)\. Quanti ml di (sciroppo|acqua) servono per {N} ml di bibita\?")
    if m:
        return parts(m.group(4), m.group(1), m.group(2), m.group(3) == "sciroppo", "dec")
    raise ValueError(f"level 7: unknown story text {s!r}")


def check(sample):
    errs = []
    try:
        truth, kind, show = truth_of(sample, errs)
    except ValueError as e:
        return [str(e)], None
    ans = sample["answer"]
    if ans.get("kind") != "number":
        return errs + ["answer must be a number"], kind
    if rat(ans["value"]) != truth:
        errs.append(f"answer {ans['value']} != {truth}")
    p = sample["params"]
    if kind is not None and p.get("case") != kind:
        errs.append(f"params.case {p.get('case')!r} but the text is {kind!r}")
    lvl = sample["level"]
    d = ndec(truth)
    if lvl == 4 and (d is None or d > 1 or truth <= 0):
        errs.append("level 4: result with at most one decimal")
    if lvl in (5, 6, 7) and show == "money" and (d is None or d > 2 or truth <= 0):
        errs.append("price not to the cent")
    if lvl == 6 and show == "change" and (d is None or d > 1):
        errs.append("level 6: change with more than one decimal")
    if lvl in (4, 5, 6) and sample["problem"].strip():
        errs.append("word problems have an empty problem")
    if lvl == 7:
        given = [num(g) for g in re.findall(r"\d+(?:,\d+)?", plain(sample["problem"]))]
        if truth in given:
            errs.append("the answer is a number already in the text")
        if truth <= 0:
            errs.append("level 7: non-positive answer")
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")

    ch = sample.get("choice")
    if ch is None:
        errs.append("no choice")
        return errs, kind
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options")
    vals = []
    for o in opts:
        try:
            v = parse_option(o["latex"], show)
        except ValueError as e:
            errs.append(str(e))
            continue
        if v != rat(o["values"][0]):
            errs.append(f"option {o['latex']} has value {o['values'][0]}")
        if show in ("money", "pct") and v <= 0:
            errs.append(f"non-positive option {o['latex']}")
        if kind not in ("negativi",) and show in ("frac", "dec") and (v > 0) != (truth > 0):
            errs.append(f"option {o['latex']} with the wrong sign")
        vals.append(v)
    if len(set(vals)) != len(vals):
        errs.append("options not distinct")
    idx = ch.get("correct")
    right = [i for i, v in enumerate(vals) if v == truth]
    if len(vals) == len(opts) and right != [idx]:
        errs.append(f"options equal to the truth {right}, correct {idx}")
    return errs, kind
