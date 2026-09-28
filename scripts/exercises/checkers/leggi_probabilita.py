"""leggi-probabilita (Probabilità della somma e dell'evento contrario), from specs/exercises/leggi-probabilita.md.

Written from the spec, not from the generator. The experiment and the events are read back from the
prose of the problem (and from the givens or the two-way table), each event phrase is turned into a
predicate written here, the sample space is enumerated with itertools (a die, two dice, coins, the
40-card deck, the balls of an urn, the people of the table) and every probability is counted with
Fraction. The multiple-choice options are parsed from their LaTeX: reduced fractions, distinct, one
equal to the truth, `correct` on it, and the named mistakes of the lesson among them when they are
probabilities.
"""
import itertools
import re
from fractions import Fraction as F
from math import gcd

CASE_RANGES = {
    1: {c: (0.17, 0.33) for c in ["dado", "mazzo", "urna", "astratto"]},
    2: {"dadi": (0.50, 0.70), "monete": (0.30, 0.50)},
    3: {c: (0.25, 0.42) for c in ["mazzo", "urna", "dado"]},
    4: {"mazzo": (0.40, 0.60), "dado": (0.40, 0.60)},
    5: {"compatibili": (0.65, 0.85), "incompatibili": (0.15, 0.35)},
    6: {c: (0.17, 0.33) for c in ["testo-unione", "testo-nessuno", "tabella-unione", "tabella-nessuno"]},
}

SUITS = ["coppe", "denari", "bastoni", "spade"]
DIE = range(1, 7)
TWO_DICE = list(itertools.product(DIE, DIE))
DECK = [(v, s) for s in SUITS for v in range(1, 11)]
NUMBER_WORDS = {"due": 2, "tre": 3, "quattro": 4}
PLURAL = {"rosse": "rossa", "blu": "blu", "verdi": "verde", "gialle": "gialla", "bianche": "bianca", "nere": "nera"}
FIGURE_VALUE = {"asso": 1, "fante": 8, "cavallo": 9, "re": 10}
DECK_PROSE = "Si pesca una carta dal mazzo di 40 carte napoletane."


# ---------------------------------------------------------------------------
# Reading the problem

def lines_of(problem):
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
        elif body.startswith("\\\\", i) and depth == 0:
            out.append(body[start:i].strip())
            i += 2
            start = i
            continue
        i += 1
    out.append(body[start:].strip())
    return [x for x in out if x]


def prose_of(problem):
    texts = [l for l in lines_of(problem) if re.fullmatch(r"\\text\{[^{}]*\}", l)]
    return re.sub(r"\s+", " ", " ".join(l[6:-1] for l in texts)).strip()


def prob(omega, pred):
    omega = list(omega)
    return F(sum(1 for o in omega if pred(o)), len(omega))


# ---------------------------------------------------------------------------
# Events, one predicate per phrase of the spec

def die_pred(ph):
    m = re.fullmatch(r"(\d)", ph)
    if m:
        k = int(m.group(1))
        return lambda x: x == k
    if ph == "un numero pari":
        return lambda x: x % 2 == 0
    if ph == "un numero dispari":
        return lambda x: x % 2 == 1
    if ph == "un multiplo di 3":
        return lambda x: x % 3 == 0
    if ph == "un numero primo":
        return lambda x: x in (2, 3, 5)
    m = re.fullmatch(r"un numero (maggiore|minore) di (\d)", ph)
    if m:
        k = int(m.group(2))
        return (lambda x: x > k) if m.group(1) == "maggiore" else (lambda x: x < k)
    raise ValueError(f"evento del dado non letto: {ph!r}")


def card_value(word):
    return FIGURE_VALUE[word] if word in FIGURE_VALUE else int(word)


def card_pred(ph):
    if ph == "una figura":
        return lambda c: c[0] in (8, 9, 10)
    m = re.fullmatch(r"una figura di (\w+)", ph)
    if m and m.group(1) in SUITS:
        s = m.group(1)
        return lambda c: c[0] >= 8 and c[1] == s
    m = re.fullmatch(r"una carta di (\w+)", ph)
    if m and m.group(1) in SUITS:
        s = m.group(1)
        return lambda c: c[1] == s
    m = re.fullmatch(r"un (asso|fante|cavallo|re|[2-7])", ph)
    if m:
        v = card_value(m.group(1))
        return lambda c: c[0] == v
    m = re.fullmatch(r"(?:l'(asso)|il (fante|cavallo|re|[2-7])) di (\w+)", ph)
    if m and m.group(3) in SUITS:
        v, s = card_value(m.group(1) or m.group(2)), m.group(3)
        return lambda c: c == (v, s)
    raise ValueError(f"evento del mazzo non letto: {ph!r}")


def pair_pred(ph):
    if ph == "esca un doppio":
        return lambda o: o[0] == o[1]
    if ph == "escano due numeri pari":
        return lambda o: o[0] % 2 == 0 and o[1] % 2 == 0
    if ph == "escano due numeri dispari":
        return lambda o: o[0] % 2 == 1 and o[1] % 2 == 1
    m = re.fullmatch(r"la somma sia (\d+)", ph)
    if m:
        s = int(m.group(1))
        return lambda o: o[0] + o[1] == s
    m = re.fullmatch(r"la somma sia (maggiore|minore) di (\d+)", ph)
    if m:
        s = int(m.group(2))
        return (lambda o: o[0] + o[1] > s) if m.group(1) == "maggiore" else (lambda o: o[0] + o[1] < s)
    m = re.fullmatch(r"il (primo|secondo) dado dia (\d)", ph)
    if m:
        i, k = (0 if m.group(1) == "primo" else 1), int(m.group(2))
        return lambda o: o[i] == k
    m = re.fullmatch(r"esca almeno un (\d)", ph)
    if m:
        k = int(m.group(1))
        return lambda o: k in o
    raise ValueError(f"evento dei due dadi non letto: {ph!r}")


def face_set(ph):
    """After "almeno un": "6", "numero pari", "numero maggiore di 4", "multiplo di 3"."""
    if re.fullmatch(r"\d", ph):
        return {int(ph)}
    pred = die_pred("un " + ph)
    return {x for x in DIE if pred(x)}


def read_urn(prose):
    m = re.fullmatch(r"Un'urna contiene (.+?)\. Si estrae una pallina senza guardare\. (.*)", prose)
    if not m:
        return None, None
    items = re.split(r", | e ", m.group(1))
    balls, first = [], True
    for it in items:
        mm = re.fullmatch(r"(\d+) palline (\w+)" if first else r"(\d+) (\w+)", it)
        if not mm or mm.group(2) not in PLURAL:
            raise ValueError(f"urna non letta: {it!r}")
        balls += [PLURAL[mm.group(2)]] * int(mm.group(1))
        first = False
    return balls, m.group(2)


# ---------------------------------------------------------------------------
# Options

def option_value(tex):
    m = re.fullmatch(r"(-?)\\dfrac\{(\d+)\}\{(\d+)\}", tex)
    if m:
        n, d = int(m.group(2)), int(m.group(3))
        if gcd(n, d) != 1 or d == 1:
            raise ValueError(f"frazione non ridotta: {tex!r}")
        return F(n, d) * (-1 if m.group(1) else 1)
    if re.fullmatch(r"-?\d+", tex):
        return F(int(tex))
    raise ValueError(f"opzione non letta: {tex!r}")


def tex_of(r):
    if r.denominator == 1:
        return str(r.numerator)
    return ("-" if r < 0 else "") + f"\\dfrac{{{abs(r.numerator)}}}{{{r.denominator}}}"


def choice_errors(sample, truth, named):
    ch = sample.get("choice")
    if ch is None:
        return ["choice mancante"]
    errs = []
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} opzioni")
    vals = []
    for o in opts:
        try:
            v = option_value(o["latex"])
        except ValueError as e:
            errs.append(str(e))
            continue
        if [str(v)] != o["values"]:
            errs.append(f"opzione {o['latex']!r} non dice {o['values']}")
        if v == 0 or v > 1 or v < -1:
            errs.append(f"opzione {v} fuori da [-1, 1] o nulla")
        if v < 0 and sample["level"] != 1:
            errs.append(f"opzione negativa {v} fuori dal livello 1")
        vals.append(v)
    if len(set(vals)) != len(vals):
        errs.append(f"opzioni uguali: {[str(v) for v in vals]}")
    hits = [i for i, v in enumerate(vals) if v == truth]
    if len(hits) != 1:
        errs.append(f"{len(hits)} opzioni uguali alla risposta {truth}")
    elif ch.get("correct") != hits[0]:
        errs.append(f"correct = {ch.get('correct')}, la risposta è l'opzione {hits[0]}")
    # The named mistakes, in order: the first ones that are probabilities (or 1 - p taken backwards at level 1) must be there.
    wanted = []
    for n in named:
        ok = n != truth and n != 0 and n <= 1 and (n > 0 or sample["level"] == 1)
        if ok and n not in wanted:
            wanted.append(n)
    for n in wanted[:3]:
        if n not in vals:
            errs.append(f"manca il distrattore {n}")
    return errs


# ---------------------------------------------------------------------------
# Levels: each returns (truth, named mistakes, kind, errors)

def level1(s, prose):
    errs = []
    if prose.startswith("Di un evento $E$ si conosce la probabilità"):
        reverse = "dell'evento contrario" in prose
        given_line, ask_line = [l for l in lines_of(s["problem"]) if not l.startswith("\\text")]
        gl, al = ("p(\\overline{E})", "p(E)") if reverse else ("p(E)", "p(\\overline{E})")
        m = re.fullmatch(re.escape(gl) + r" = (.+)", given_line)
        if not m or ask_line != f"{al} = \\ ?":
            return None, [], "astratto", [f"dati non letti: {given_line!r}, {ask_line!r}"]
        given = option_value(m.group(1))
        if not 0 < given < 1:
            errs.append(f"probabilità data {given} fuori da ]0, 1[")
        if given.denominator < 5:
            errs.append(f"denominatore {given.denominator} < 5")
        truth = 1 - given
        return truth, [given, given - 1], "astratto", errs
    if prose.startswith("Si lancia un dado."):
        m = re.fullmatch(r"Si lancia un dado\. Qual è la probabilità che non esca (.+)\?", prose)
        pe = prob(DIE, die_pred(m.group(1)))
        kind = "dado"
    elif prose.startswith(DECK_PROSE):
        m = re.fullmatch(re.escape(DECK_PROSE) + r" Qual è la probabilità che non esca (.+)\?", prose)
        pe = prob(DECK, card_pred(m.group(1)))
        kind = "mazzo"
    else:
        balls, rest = read_urn(prose)
        m = re.fullmatch(r"Qual è la probabilità che la pallina estratta non sia (\w+)\?", rest or "")
        if not balls or not m:
            return None, [], None, [f"testo non letto: {prose!r}"]
        pe = prob(balls, lambda b: b == m.group(1))
        kind = "urna"
        if len(set(balls)) != 3:
            errs.append("l'urna non ha tre colori")
    truth = 1 - pe
    if pe == truth:
        errs.append("p(E) uguale alla risposta")
    return truth, [pe, pe - 1], kind, errs


def level2(s, prose):
    m = re.fullmatch(r"Si lanciano due dadi\. Qual è la probabilità che esca almeno un (.+)\?", prose)
    if m:
        S = face_set(m.group(1))
        truth = prob(TWO_DICE, lambda o: o[0] in S or o[1] in S)
        exactly = prob(TWO_DICE, lambda o: (o[0] in S) != (o[1] in S))
        none = prob(TWO_DICE, lambda o: o[0] not in S and o[1] not in S)
        return truth, [F(2 * len(S), 6), exactly, none, 1 - exactly], "dadi", []
    m = re.fullmatch(r"Si lanciano (due|tre|quattro) monete\. Qual è la probabilità che esca almeno una (testa|croce)\?", prose)
    if not m:
        return None, [], None, [f"testo non letto: {prose!r}"]
    n, face = NUMBER_WORDS[m.group(1)], m.group(2)[0].upper()
    omega = list(itertools.product("TC", repeat=n))
    truth = prob(omega, lambda o: face in o)
    exactly = prob(omega, lambda o: o.count(face) == 1)
    return truth, [1 - truth, exactly, 1 - exactly, F(n, 2)], "monete", []


def two_events(prose, head):
    m = re.fullmatch(re.escape(head) + r" Qual è la probabilità che esca (.+?) o (.+)\?", prose)
    return (m.group(1), m.group(2)) if m else None


def union_level(prose, compatible):
    """Levels 3 (die, deck) and 4: two events on one die or on the deck."""
    for head, omega, pred, kind in [("Si lancia un dado.", list(DIE), die_pred, "dado"), (DECK_PROSE, DECK, card_pred, "mazzo")]:
        ev = two_events(prose, head) if prose.startswith(head) else None
        if ev:
            pa, pb = pred(ev[0]), pred(ev[1])
            A = {o for o in omega if pa(o)}
            B = {o for o in omega if pb(o)}
            return omega, A, B, kind
    return None


def level3(s, prose):
    errs = []
    if prose.startswith("Un'urna"):
        balls, rest = read_urn(prose)
        m = re.fullmatch(r"Qual è la probabilità che la pallina estratta sia (.+)\?", rest or "")
        if not balls or not m:
            return None, [], None, [f"testo non letto: {prose!r}"]
        asked = re.split(r", | o ", m.group(1))
        if len(asked) not in (2, 3) or len(set(asked)) != len(asked) or any(c not in balls for c in asked):
            errs.append(f"colori chiesti {asked}")
        if len(asked) == 3 and len(set(balls)) != 4:
            errs.append("tre colori chiesti da un'urna senza quattro colori")
        truth = prob(balls, lambda b: b in asked)
        ps = [prob(balls, lambda b, c=c: b == c) for c in asked]
        product = F(1)
        for p in ps:
            product *= p
        wrong_sum = F(sum(balls.count(c) for c in asked), len(balls) * len(asked))
        return truth, [product, wrong_sum], "urna", errs
    got = union_level(prose, False)
    if not got:
        return None, [], None, [f"testo non letto: {prose!r}"]
    omega, A, B, kind = got
    n = len(omega)
    if A & B:
        errs.append("eventi compatibili al livello 3")
    if not A or not B or len(A | B) == n:
        errs.append("evento vuoto o unione uguale a Ω")
    truth = F(len(A | B), n)
    return truth, [F(len(A), n) * F(len(B), n), F(len(A) + len(B), 2 * n)], kind, errs


def level4(s, prose):
    errs = []
    got = union_level(prose, True)
    if not got:
        return None, [], None, [f"testo non letto: {prose!r}"]
    omega, A, B, kind = got
    n = len(omega)
    if not A & B:
        errs.append("eventi incompatibili al livello 4")
    if A <= B or B <= A:
        errs.append("un evento contiene l'altro")
    if len(A | B) == n:
        errs.append("unione uguale a Ω")
    truth = F(len(A | B), n)
    return truth, [F(len(A) + len(B), n), F(len(A & B), n), F(len(A) + len(B) - 2 * len(A & B), n)], kind, errs


def level5(s, prose):
    errs = []
    m = re.fullmatch(r"Si lanciano due dadi\. Qual è la probabilità che (.+?) o che (.+)\?", prose)
    if not m:
        return None, [], None, [f"testo non letto: {prose!r}"]
    pa, pb = pair_pred(m.group(1)), pair_pred(m.group(2))
    A = {o for o in TWO_DICE if pa(o)}
    B = {o for o in TWO_DICE if pb(o)}
    if not A or not B or len(A | B) == 36:
        errs.append("evento vuoto o unione uguale a Ω")
    if A & B and (A <= B or B <= A):
        errs.append("un evento contiene l'altro")
    truth = F(len(A | B), 36)
    if A & B:
        return truth, [F(len(A) + len(B), 36), F(len(A) + len(B) - 2 * len(A & B), 36), F(len(A & B), 36)], "compatibili", errs
    return truth, [F(len(A) + len(B) - 1, 36), F(len(A), 36) * F(len(B), 36)], "incompatibili", errs


# Level 6: the four contexts, written again from the spec.
GROUP_CLAUSES = {
    "sia una ragazza": ("Ragazze", 0),
    "sia un ragazzo": ("Ragazzi", 1),
    "sia di prima": ("Prima", 0),
    "sia di seconda": ("Seconda", 1),
    "sia del biennio": ("Biennio", 0),
    "sia del triennio": ("Triennio", 1),
}
ATTRIBUTES = ["porti gli occhiali", "faccia anche nuoto", "porti il pranzo al sacco", "legga fumetti"]
TEXTS = [
    r"In una classe di (\d+) studenti ci sono (\d+) ragazze e (\d+) ragazzi; portano gli occhiali (\d+) studenti, di cui (\d+) ragazze\.",
    r"In una squadra di atletica di (\d+) atleti ci sono (\d+) ragazze e (\d+) ragazzi; fanno anche nuoto (\d+) atleti, di cui (\d+) ragazze\.",
    r"Alla gita scolastica partecipano (\d+) studenti, (\d+) di prima e (\d+) di seconda; (\d+) portano il pranzo al sacco, di cui (\d+) di prima\.",
    r"Si intervistano (\d+) studenti, (\d+) del biennio e (\d+) del triennio; (\d+) leggono fumetti, di cui (\d+) del biennio\.",
]
QUESTION = r" Si sceglie a caso (?:uno studente|un atleta|uno degli intervistati)\. Qual è la probabilità che (non )?(sia [^?]+?) (o|né) ([^?]+)\?"


def read_table(problem):
    m = re.search(r"\\begin\{array\}\{c\|c\|c\|c\}(.*?)\\end\{array\}", problem, re.S)
    if not m:
        return None
    rows = [[c.strip() for c in r.replace("\\hline", "").split("&")] for r in m.group(1).split("\\\\")]
    return [r for r in rows if any(r)]


def level6(s, prose):
    errs = []
    table = read_table(s["problem"])
    if table is None:
        head = next((mm for mm in (re.match(t, prose) for t in TEXTS) if mm), None)
        if not head:
            return None, [], None, [f"testo non letto: {prose!r}"]
        N, x, y, z, w = (int(g) for g in head.groups())
        if x + y != N:
            errs.append(f"{x} + {y} != {N}")
        if w < 2:
            errs.append(f"'di cui {w}': almeno 2")
        cells = [[w, x - w], [z - w, y - (z - w)]]
        rest = prose[head.end():]
        form = "testo"
    else:
        header, r1, r2, tot = table
        cells = [[int(c) for c in r1[1:3]], [int(c) for c in r2[1:3]]]
        for r in (r1, r2):
            if int(r[3]) != int(r[1]) + int(r[2]):
                errs.append(f"totale di riga sbagliato: {r}")
        if [int(c) for c in tot[1:]] != [cells[0][0] + cells[1][0], cells[0][1] + cells[1][1], sum(map(sum, cells))]:
            errs.append(f"riga dei totali sbagliata: {tot}")
        labels = [re.fullmatch(r"\\text\{(.+)\}", r[0]).group(1) for r in (r1, r2)]
        mm = re.match(r"La tabella descrive (?:i )?(\d+) [^.]*\.", prose)
        if not mm or int(mm.group(1)) != sum(map(sum, cells)):
            errs.append("il totale del testo non è quello della tabella")
        rest = prose[mm.end():] if mm else ""
        form = "tabella"
    q = re.fullmatch(QUESTION, rest)
    if not q:
        return None, [], None, errs + [f"domanda non letta: {rest!r}"]
    neg, gclause, conj, attr = q.groups()
    if (neg is None) != (conj == "o") or gclause not in GROUP_CLAUSES or attr not in ATTRIBUTES:
        return None, [], None, errs + [f"domanda non letta: {rest!r}"]
    label, g = GROUP_CLAUSES[gclause]
    if table is not None and labels[g] != label:
        errs.append(f"la riga {g} è {labels[g]}, la domanda chiede {label}")
    if any(c < 1 for row in cells for c in row):
        errs.append(f"casella minore di 1: {cells}")
    people = [(r, a) for r in (0, 1) for a in (0, 1) for _ in range(cells[r][a])]
    N = len(people)
    if not 20 <= N <= 32:
        errs.append(f"N = {N} fuori da 20-32")
    pA = sum(1 for p in people if p[0] == g)
    pB = sum(1 for p in people if p[1] == 0)
    pAB = sum(1 for p in people if p[0] == g and p[1] == 0)
    union = prob(people, lambda p: p[0] == g or p[1] == 0)
    if neg:
        truth = prob(people, lambda p: p[0] != g and p[1] != 0)
        named = [union, F(N - pA - pB, N), F(pAB, N)]
    else:
        truth = union
        named = [F(pA + pB, N), F(pAB, N), F(pA + pB - 2 * pAB, N)]
    return truth, named, f"{form}-{'nessuno' if neg else 'unione'}", errs


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    text = sample["problem"] + " ".join(sample["steps"]) + sample["solution"]
    if "—" in text or "piuttosto che" in text:
        errs.append("parole vietate")
    if not sample["steps"] or not sample["solution"]:
        errs.append("passaggi o soluzione mancanti")
    f = LEVELS.get(sample["level"])
    if not f:
        return errs + [f"livello {sample['level']}"], None
    prose = prose_of(sample["problem"])
    truth, named, kind, e = f(sample, prose)
    errs += e
    if truth is None:
        return errs, kind
    if not 0 < truth < 1:
        errs.append(f"probabilità {truth} fuori da ]0, 1[")
    ans = sample["answer"]
    if ans.get("kind") != "number":
        errs.append(f"risposta di tipo {ans.get('kind')}")
    else:
        if not re.fullmatch(r"\d+/\d+", ans["value"]) or F(ans["value"]) != truth or str(F(ans["value"])) != ans["value"]:
            errs.append(f"risposta {ans['value']} invece di {truth}")
    if not sample["solution"].endswith(" = " + tex_of(truth)):
        errs.append(f"la soluzione {sample['solution']!r} non finisce con {tex_of(truth)}")
    errs += choice_errors(sample, truth, named)
    p = sample["params"]
    if kind is not None and p.get("case") != kind:
        errs.append(f"params.case {p.get('case')!r}, il problema è {kind!r}")
    return errs, kind
