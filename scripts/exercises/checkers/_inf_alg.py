"""Shared checks for the generators of the chapter "Algoritmi e diagrammi di flusso" (lessons 45-50).

Independent of src/lib/exercises/v2/inf-alg.ts. A sample that carries a chart says in `params` which family its
algorithm belongs to and the numbers of its story (`k`): `expected` below works out, from those numbers alone, what
the algorithm must write for given inputs. The reference chart of the sample is then run by Python
(checkers/_inf_programmi.py) and must write exactly that, so a reference that is itself wrong is caught.
"""
import re
from math import gcd

from checkers._inf_programmi import choice_of, common, run_chart

MOVES = {"quadrato": ("avanti", "gira"), "salto": ("salta", "atterra"), "ballo": ("passo", "battito"), "disegno": ("penna giù", "penna su"),
         "luce": ("accendi", "spegni"), "porta": ("apri", "chiudi"), "nuoto": ("bracciata", "respiro"), "scala": ("sali", "riposa")}
OPS = {">=": lambda a, b: a >= b, ">": lambda a, b: a > b, "<": lambda a, b: a < b, "<=": lambda a, b: a <= b}


def _ordine(k, _):
    a, b, c = k["a"], k["b"], k["c"]
    if k["tpl"] == "riusa":
        return [a * c, a + b]
    if k["tpl"] == "catena":
        return [(a - b) * c]
    if k["tpl"] == "scambio":
        return [b, b]
    return [b, a]


def _rovescia(k, inp):
    n, out = inp[0], []
    while n > 0:
        out.append(n)
        n -= k["step"]
    return out + [k["word"]]


def _divisioni(k, inp):
    n, c = inp[0], 0
    while n > 1:
        n //= k["d"]
        c += 1
    return [c]


def _traguardo(k, inp):
    p, out = 0, []
    while p < inp[0]:
        p += k["add"]
        out.append(p)
    return out + ["fatto"]


def _sblocco(k, inp):
    out = []
    for pin in inp:
        if pin == k["code"]:
            return out + ["sbloccato"]
        out.append("errato")
    return None


def _ripeti(k, _):
    a, b = MOVES[k["ctx"]]
    return [a, b] * k["n"] + ["fatto"]


EXPECTED = {
    "gita": lambda k, i: [i[0] // i[2] + i[1]],
    "quota": lambda k, i: [i[0] * k["p"] + k["f"]],
    "unita": lambda k, i: [i[0] * k["per"] + i[1]],
    "rettangolo": lambda k, i: [i[0] * i[1] if k["what"] == "area" else 2 * (i[0] + i[1])],
    "ordine": _ordine,
    "soglia": lambda k, i: ["sì" if OPS[k["op"]](i[0], k["t"]) else "no"],
    "sconto": lambda k, i: [i[0] - k["d"] if i[0] > k["t"] else i[0]],
    "spedizione": lambda k, i: [i[0] if i[0] >= k["t"] else i[0] + k["f"]],
    "due numeri": lambda k, i: [max(i) if k["what"] == "maggiore" else min(i)],
    "divisibile": lambda k, i: ["sì" if i[0] % k["d"] == 0 else "no"],
    "tetto": lambda k, i: [min(i[0] * k["p"], k["cap"])],
    "quiz": lambda k, i: [k["g"] if i[0] == k["x"] * k["y"] else 0],
    "rovescia": _rovescia,
    "somma": lambda k, i: [sum(range(1, i[0] + 1))],
    "multipli": lambda k, i: [i[0] * j for j in range(1, k["count"] + 1)],
    "addizioni": lambda k, i: [i[0] * i[1]],
    "risparmio": lambda k, i: [-(-i[0] // k["w"]) if i[0] > 0 else 0],
    "divisioni": _divisioni,
    "traguardo": _traguardo,
    "ripeti": _ripeti,
    "sblocco": _sblocco,
    "somma in giù": lambda k, i: [sum(range(1, i[0] + 1))],
    "euclide": lambda k, i: [gcd(i[0], i[1])],
    "bum": lambda k, i: ["bum" if j % k["d"] == 0 else j for j in range(1, i[0] + 1)],
    "sufficienti": lambda k, i: [sum(1 for v in i[1 : 1 + i[0]] if v >= 6)],
}

STRUCTURES = {
    "gita": "sequenza",
    "quota": "sequenza", "unita": "sequenza", "rettangolo": "sequenza", "ordine": "sequenza",
    "soglia": "selezione", "sconto": "selezione", "spedizione": "selezione", "due numeri": "selezione", "divisibile": "selezione",
    "tetto": "selezione", "quiz": "selezione",
    "rovescia": "iterazione", "somma": "iterazione", "multipli": "iterazione", "addizioni": "iterazione", "risparmio": "iterazione",
    "divisioni": "iterazione", "traguardo": "iterazione", "ripeti": "iterazione", "sblocco": "iterazione", "somma in giù": "iterazione",
    "euclide": "iterazione", "bum": "iterazione", "sufficienti": "iterazione",
}


def expected(family, k, inputs):
    """What the algorithm of a family writes on these inputs, as the lines of text a chart writes."""
    out = EXPECTED[family](k, [int(x) for x in inputs])
    return None if out is None else [str(x) for x in out]


def shape(source):
    """The control structures of a chart, read from its lines: (selections, loops, one inside another)."""
    rows = [r for r in source.split("\n") if r.strip()]
    sel = sum(1 for r in rows if r.strip().startswith("se "))
    loops = sum(1 for r in rows if re.match(r"finch[ée]\s", r.strip()))
    nested = any(r.startswith("    ") and re.match(r"(se |finch[ée]\s)", r.strip()) for r in rows)
    return sel, loops, nested


def structure_of(source):
    sel, loops, _ = shape(source)
    return "iterazione" if loops else "selezione" if sel else "sequenza"


def base(sample, reference=True):
    """The checks of every sample of these generators. `reference`: the chart in params is the right algorithm of
    its family (not one with a mistake put there on purpose), and must write what the family writes."""
    errors = common(sample)
    params = sample["params"]
    if "case" not in params:
        errors.append("no case in params")
    source = params.get("source")
    if source is None:
        return errors
    tests = params.get("tests")
    if not tests:
        return errors + ["no tests in params"]
    family = params.get("family")
    if family not in EXPECTED:
        return errors + [f"unknown family {family}"]
    if reference:
        for t in tests:
            if run_chart(source, t) != expected(family, params["k"], t):
                errors.append(f"on {t} the reference does not write what a chart of the family {family} must")
        if structure_of(source) != STRUCTURES[family] or params.get("structure") != STRUCTURES[family]:
            errors.append("the structure of the reference is not the one of its family")
    answer = sample["answer"]
    if answer["kind"] == "chart":
        if len(answer["tests"]) < 2:
            errors.append("a chart to build with fewer than two tests")
        if [[str(x) for x in t] for t in tests] != [t["inputs"] for t in answer["tests"]]:
            errors.append("the tests of the answer are not those of params")
        for t in answer["tests"]:
            if t["output"] != expected(family, params["k"], t["inputs"]):
                errors.append("a test of the answer expects something else than the family writes")
        if len(tests[0]) > 0 and len({tuple(run_chart(source, t) or []) for t in tests}) < 2:
            errors.append("the tests all write the same")
    choice = choice_of(sample)
    if choice and all("chart" in o for o in choice["options"]) and len(tests) < 2:
        errors.append("charts to choose from need at least two runs")
    return errors


def right_of(sample):
    choice = choice_of(sample)
    return choice["options"][choice["correct"]]


def check_written(sample, errors, source=None, inputs=None):
    """A "che cosa scrive" question: the right option is what the chart writes on the inputs asked, run here; the
    inputs are the first test; the question names them."""
    params = sample["params"]
    source = source or params["source"]
    inputs = params["inputs"] if inputs is None else inputs
    if params["tests"][0] != inputs:
        errors.append("the inputs asked are not the first test")
    written = run_chart(source, inputs)
    if written is None:
        errors.append("the chart does not end on the inputs asked")
        return
    if right_of(sample)["values"][0] != "\n".join(written):
        errors.append(f"on {inputs} the chart writes {written}")
    for x in inputs:
        if not re.search(rf"(?<!\d){x}(?!\d)", sample["problem"]):
            errors.append(f"the question does not say the input {x}")
    if "chart" not in sample:
        errors.append("the chart is not shown")


def check_ids(sample, errors, table, want):
    """A choice among texts with ids: `table` gives for each id (value, words its text must contain); the right
    option is the only one whose value is `want`."""
    choice = choice_of(sample)
    for i, o in enumerate(choice["options"]):
        oid = o["values"][0]
        if oid not in table:
            errors.append(f"unknown option {oid}")
            continue
        value, words = table[oid]
        if words not in o["latex"]:
            errors.append(f"option {oid} does not say «{words}»")
        if (value == want) != (i == choice["correct"]):
            errors.append(f"option {oid}: {'the right option is not ' + str(want) if i == choice['correct'] else 'a wrong option is also ' + str(want)}")


def check_statements(sample, errors, table):
    """"Quale affermazione è vera / falsa": `table` gives for each id (truth, words)."""
    case = sample["params"]["case"]
    if case not in ("vera", "falsa"):
        errors.append(f"unknown case {case}")
        return
    if ("vera" in sample["problem"]) != (case == "vera") or ("falsa" in sample["problem"]) != (case == "falsa"):
        errors.append("the question does not ask what the case says")
    check_ids(sample, errors, table, case == "vera")
