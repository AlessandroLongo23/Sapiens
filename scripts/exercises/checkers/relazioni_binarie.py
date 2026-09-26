"""Checker for relazioni-binarie (specs/exercises/relazioni-binarie.md).

Written from the spec, not from the generator. Its own reading of the property codes, its own LaTeX for
the sets, the properties and the table, and the relations recomputed pair by pair on A x B:
- levels 1 and 5: the correct option is the relation, read back from the option's LaTeX too;
- level 2: each statement is evaluated (a pair outside A x B is never in R), exactly one is true;
- level 3: the table in the problem is read back cell by cell; the answer is the list of marked cells,
  the rows or the columns left empty;
- level 4: each property option is evaluated on A x B, exactly one gives R, the four relations differ;
- level 6: the inverse swaps every pair; the negation (complement in A x B) is never the answer.
"""
import re

CASE_RANGES = {
    2: {"vera-appartiene": (0.38, 0.62), "vera-non-appartiene": (0.38, 0.62)},
    3: {"elenco": (0.25, 0.42), "senza-corrispondenti": (0.25, 0.42), "non-raggiunti": (0.25, 0.42)},
    6: {"coppie": (0.38, 0.62), "proprieta": (0.38, 0.62)},
}

R = r"\mathcal{R}"

# ---------------------------------------------------------------------------
# Properties


def holds(code, a, b):
    if code.startswith("not-"):
        return not holds(code[4:], a, b)
    name, _, k = code.partition(":")
    k = int(k) if k else None
    table = {
        "div": lambda: a != 0 and b % a == 0,
        "mult": lambda: b != 0 and a % b == 0,
        "lt": lambda: a < b,
        "gt": lambda: a > b,
        "le": lambda: a <= b,
        "ge": lambda: a >= b,
        "double": lambda: b == 2 * a,
        "half": lambda: a == 2 * b,
        "sq": lambda: b == a * a,
        "sum": lambda: a + b == k,
        "plus": lambda: b == a + k,
        "minus": lambda: a == b + k,
        "even": lambda: (a + b) % 2 == 0,
    }
    if name not in table:
        raise ValueError(f"unknown property {code}")
    return table[name]()


def prop_tex(code, u, v):
    """The property as the spec writes it, in the variables u, v."""
    name, _, k = code.partition(":")
    return {
        "div": f"{u} \\text{{ è un divisore di }} {v}",
        "mult": f"{u} \\text{{ è un multiplo di }} {v}",
        "lt": f"{u} < {v}",
        "gt": f"{u} > {v}",
        "le": f"{u} \\le {v}",
        "ge": f"{u} \\ge {v}",
        "double": f"{v} = 2{u}",
        "half": f"{u} = 2{v}",
        "sq": f"{v} = {u}^2",
        "sum": f"{u} + {v} = {k}",
        "plus": f"{v} = {u} + {k}",
        "minus": f"{u} = {v} + {k}",
        "even": f"{u} + {v} \\text{{ è pari}}",
    }[name]


WORDS = {"div": "un divisore di", "mult": "un multiplo di", "lt": "minore di", "gt": "maggiore di", "half": "il doppio di", "double": "la metà di"}


def prop_words(code, u, v):
    if code.startswith("not-"):
        return f"{u} \\text{{ non è {WORDS[code[4:]]} }} {v}"
    return f"{u} \\text{{ è {WORDS[code]} }} {v}"


def relation(code, A, B):
    return {(a, b) for a in A for b in B if holds(code, a, b)}


# ---------------------------------------------------------------------------
# Reading LaTeX


def set_tex(xs):
    return "\\{" + ",\\ ".join(str(v) for v in sorted(xs)) + "\\}"


def pairs_in(tex):
    return [(int(a), int(b)) for a, b in re.findall(r"\((\d+), (\d+)\)", tex)]


def option_pairs(o):
    return {tuple(int(t) for t in v.split(":")) for v in o["values"]}


def pairs_option_errors(o):
    """The option's LaTeX shows the same pairs as its values, in order, each once."""
    errs = []
    shown = pairs_in(o["latex"])
    vals = [tuple(int(t) for t in v.split(":")) for v in o["values"]]
    if shown != sorted(vals):
        errs.append(f"option {o['latex']} shows {shown}, values {vals}")
    if len(set(vals)) != len(vals):
        errs.append("repeated pair in an option")
    if not 1 <= len(vals) <= 10:
        errs.append(f"option with {len(vals)} pairs")
    # The phone's answer button takes four pairs a line, three when a number has two digits.
    per = 3 if any(v > 9 for pr in vals for v in pr) else 4
    if len(vals) > per:
        if not o["latex"].startswith("\\begin{gathered}"):
            errs.append(f"option with more than {per} pairs on one line")
        body = o["latex"].replace("\\begin{gathered}", "").replace("\\end{gathered}", "")
        for line in body.split("\\\\"):
            if len(pairs_in(line)) > per:
                errs.append(f"option line with more than {per} pairs: {line}")
    return errs


def choice_errors(ch, truth_of_option, expected_options=4):
    """truth_of_option(o) -> True for the right one. Exactly one, and it is `correct`."""
    errs = []
    opts = ch.get("options", [])
    if len(opts) != expected_options:
        errs.append(f"{len(opts)} options")
    right = [i for i, o in enumerate(opts) if truth_of_option(o)]
    if len(right) != 1:
        errs.append(f"{len(right)} right options")
    elif ch.get("correct") != right[0]:
        errs.append(f"correct = {ch.get('correct')}, right option is {right[0]}")
    if len({o["latex"] for o in opts}) != len(opts):
        errs.append("options with the same LaTeX")
    return errs


def pairs_choice_errors(ch, truth):
    errs = choice_errors(ch, lambda o: option_pairs(o) == truth)
    sets = [frozenset(option_pairs(o)) for o in ch.get("options", [])]
    if len(set(sets)) != len(sets):
        errs.append("two options with the same pairs")
    for o in ch.get("options", []):
        errs += pairs_option_errors(o)
    return errs


def relation_shown(tex, name=R):
    """Pairs of `name = \\{...\\}` in the problem, joining the lines of a gathered."""
    i = tex.find(f"{name} = ")
    if i < 0:
        raise ValueError(f"no {name} in the problem")
    end = tex.find("\\}", i)
    return pairs_in(tex[i:end])


def table_shown(tex, A, B):
    """Marked cells of the double-entry table: row labels are A, column labels B."""
    m = re.search(r"\\begin\{array\}\{c\|(c+)\}(.*?)\\end\{array\}", tex)
    if not m:
        raise ValueError("no table in the problem")
    if len(m.group(1)) != len(B):
        raise ValueError("table columns differ from B")
    head, rest = m.group(2).split("\\hline")
    cols = [c.strip() for c in head.replace("\\\\", "").split("&")]
    if cols[0] != "a \\backslash b" or [int(c) for c in cols[1:]] != sorted(B):
        raise ValueError(f"table header {cols}")
    rows = [r for r in rest.split("\\\\")]
    if len(rows) != len(A):
        raise ValueError("table rows differ from A")
    marked = set()
    for row, a in zip(rows, sorted(A)):
        cells = [c.strip() for c in row.split("&")]
        if int(cells[0]) != a or len(cells) != len(B) + 1:
            raise ValueError(f"bad row {row}")
        for c, b in zip(cells[1:], sorted(B)):
            if c == "\\bullet":
                marked.add((a, b))
            elif c != "":
                raise ValueError(f"bad cell {c!r}")
    return marked


def ints(xs):
    return [int(v) for v in xs]


# ---------------------------------------------------------------------------


def check(sample):
    errs = []
    p = sample["params"]
    lvl = sample["level"]
    prob = sample["problem"]
    A = ints(p["A"])
    B = ints(p["B"]) if "B" in p else A
    code = p.get("code")
    given = {tuple(int(t) for t in s.split(":")) for s in p.get("pairs", [])}
    ans = sample["answer"]
    ch = sample.get("choice")
    kind = p.get("case")

    for xs in (A, B):
        if xs != sorted(set(xs)) or any(not 1 <= v <= 12 for v in xs):
            errs.append(f"set {xs}: distinct integers 1-12, ascending")
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    if ch is None:
        errs.append("no multiple-choice variant")
    elif ans["kind"] == "choice" and ch != ans:
        errs.append("choice differs from the choice answer")

    if "B" in p:
        if f"A = {set_tex(A)},\\quad B = {set_tex(B)}" not in prob:
            errs.append("problem does not show A and B")
    elif f"A = {set_tex(A)}" not in prob:
        errs.append("problem does not show A")

    if lvl in (1, 2, 4):
        rel = relation(code, A, B)
        if rel != given:
            errs.append(f"params.pairs {sorted(given)} != relation {sorted(rel)}")
        if not (3 <= len(A) <= 4 and 3 <= len(B) <= 4):
            errs.append("A and B need 3-4 elements")
        if len(rel) == len(A) * len(B):
            errs.append("the relation is all of A x B")
        if lvl in (1, 2):
            if code.split(":")[0] not in ("div", "sum", "double", "lt", "plus"):
                errs.append(f"property {code} not in the spec for level {lvl}")
            if f"a \\mathrel{{{R}}} b \\iff {prop_tex(code, 'a', 'b')}" not in prob:
                errs.append("problem does not show the property")
        if lvl == 1:
            if not 2 <= len(rel) <= 6:
                errs.append(f"{len(rel)} pairs, need 2-6")
            errs += pairs_choice_errors(ans, rel)
        elif lvl == 2:
            if not 2 <= len(rel) <= 6:
                errs.append(f"{len(rel)} pairs, need 2-6")

            def true_stmt(o):
                op, form, pair = o["values"]
                a, b = (int(t) for t in pair.split(":"))
                inside = a in A and b in B and holds(code, a, b)
                want = f"({a}, {b}) \\in {R}" if form == "pair" else f"{a} \\mathrel{{{R}}} {b}"
                if op == "notin":
                    want = f"({a}, {b}) \\notin {R}" if form == "pair" else f"{a} \\mathrel{{\\not{R}}} {b}"
                if o["latex"] != want:
                    errs.append(f"statement {o['latex']} != {want}")
                return inside if op == "in" else not inside

            errs += choice_errors(ans, true_stmt)
            pairs = [o["values"][2] for o in ans["options"]]
            if len(set(pairs)) != 4:
                errs.append("two statements on the same pair")
            ok = [o for o in ans["options"] if true_stmt(o)]
            truth_kind = ("vera-appartiene" if ok[0]["values"][0] == "in" else "vera-non-appartiene") if len(ok) == 1 else None
            if truth_kind != kind:
                errs.append(f"params.case {kind} but the true statement is {truth_kind}")
            # The traps of the lesson: a swapped pair and a pair outside A x B among the four.
            def outside(o):
                a, b = (int(t) for t in o["values"][2].split(":"))
                return (a not in A) or (b not in B)
            if not any(outside(o) for o in ans["options"]):
                errs.append("no pair outside A x B")
            kind = truth_kind
        else:
            if not 3 <= len(rel) <= 5:
                errs.append(f"{len(rel)} pairs, need 3-5")
            if set(relation_shown(prob)) != rel or len(relation_shown(prob)) != len(rel):
                errs.append("problem does not list the relation")

            def right(o):
                c = o["values"][0]
                if o["latex"] != prop_tex(c, "a", "b"):
                    errs.append(f"option {o['latex']} != {prop_tex(c, 'a', 'b')}")
                return relation(c, A, B) == rel

            errs += choice_errors(ans, right)
            rels = [frozenset(relation(o["values"][0], A, B)) for o in ans["options"]]
            if len(set(rels)) != 4:
                errs.append("two property options give the same pairs")
            kind = None
    elif lvl == 3:
        try:
            shown = table_shown(prob, A, B)
        except ValueError as e:
            return [f"table: {e}"], kind
        if shown != given:
            errs.append(f"table shows {sorted(shown)}, params {sorted(given)}")
        if not 3 <= len(shown) <= 7:
            errs.append(f"{len(shown)} marked cells, need 3-7")
        if not (3 <= len(A) <= 4 and 3 <= len(B) <= 4):
            errs.append("A and B need 3-4 elements")
        if kind == "elenco":
            if ans["kind"] != "choice":
                errs.append("level 3 elenco needs a choice answer")
            else:
                errs += pairs_choice_errors(ans, shown)
        elif kind in ("senza-corrispondenti", "non-raggiunti"):
            if kind == "senza-corrispondenti":
                truth = [a for a in A if not any(q[0] == a for q in shown)]
                own = A
            else:
                truth = [b for b in B if not any(q[1] == b for q in shown)]
                own = B
            if not truth or len(truth) == len(own):
                errs.append(f"answer set {truth} empty or the whole set")
            if ans["kind"] != "set" or ints(ans["values"]) != truth:
                errs.append(f"answer {ans.get('values')} != {truth}")
            if ans.get("latex") != set_tex(truth):
                errs.append("answer latex")
            if ch:
                def right(o):
                    shown_o = [int(t) for t in re.findall(r"\d+", o["latex"])]
                    if shown_o != ints(o["values"]):
                        errs.append(f"option {o['latex']} != values {o['values']}")
                    return ints(o["values"]) == truth
                errs += choice_errors(ch, right)
        else:
            errs.append(f"unknown case {kind}")
    elif lvl == 5:
        rel = relation(code, A, A)
        if rel != given:
            errs.append("params.pairs != relation")
        if code.split(":")[0] not in ("div", "lt", "le", "even", "sum"):
            errs.append(f"property {code} not in the spec")
        if f"x \\mathrel{{{R}}} y \\iff {prop_tex(code, 'x', 'y')}" not in prob:
            errs.append("problem does not show the property")
        if not 3 <= len(A) <= 5:
            errs.append("A needs 3-5 elements")
        if not 3 <= len(rel) <= 8:
            errs.append(f"{len(rel)} pairs, need 3-8")
        loops = {q for q in rel if q[0] == q[1]}
        if code in ("div", "le", "even") and not loops:
            errs.append("reflexive property with no loops")
        if loops and loops == rel:
            errs.append("only loops")
        errs += pairs_choice_errors(ans, rel)
        # With loops, the relation without them must be among the options (the mistake of the lesson).
        if loops and frozenset(rel - loops) not in {frozenset(option_pairs(o)) for o in ans["options"]}:
            errs.append("no option without the loops")
        kind = "cappi" if loops else "senza cappi"
    elif lvl == 6:
        if kind == "coppie":
            if not (len(A) == 3 and 3 <= len(B) <= 4):
                errs.append("A with 3 elements, B with 3-4")
            if any(a not in A or b not in B for a, b in given):
                errs.append("pair outside A x B")
            if not 2 <= len(given) <= 5:
                errs.append(f"{len(given)} pairs, need 2-5")
            shown = relation_shown(prob)
            if set(shown) != given or len(shown) != len(given):
                errs.append("problem does not list R")
            inverse = {(b, a) for a, b in given}
            errs += pairs_choice_errors(ans, inverse)
            negation = {(a, b) for a in A for b in B} - given
            opts = {frozenset(option_pairs(o)) for o in ans["options"]}
            if frozenset(negation) not in opts:
                errs.append("the negation is not among the options")
        elif kind == "proprieta":
            if code not in WORDS:
                errs.append(f"property {code} not in the spec")
            rel = relation(code, A, A)
            if rel != given:
                errs.append("params.pairs != relation")
            if len(rel) < 2:
                errs.append("fewer than 2 pairs")
            if f"x \\mathrel{{{R}}} y \\iff {prop_words(code, 'x', 'y')}" not in prob:
                errs.append("problem does not show the property")
            inverse = {(b, a) for a, b in rel}

            def right(o):
                c = o["values"][0]
                if o["latex"] != prop_words(c, "x", "y"):
                    errs.append(f"option {o['latex']} != {prop_words(c, 'x', 'y')}")
                return relation(c, A, A) == inverse

            errs += choice_errors(ans, right)
            codes = [o["values"][0] for o in ans["options"]]
            if f"not-{code}" not in codes or code not in codes:
                errs.append("the property itself and its negation must be distractors")
            rels = [frozenset(relation(c, A, A)) for c in codes]
            if len(set(rels)) != 4:
                errs.append("two options give the same pairs")
        else:
            errs.append(f"unknown case {kind}")
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
