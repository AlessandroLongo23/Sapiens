"""Checker for inf-html-elenchi-tabelle (specs/exercises/inf-html-elenchi-tabelle.md).

Written from the spec. Nothing is copied from the generator: every fragment shown or offered is read here with
Python's HTML parser (checkers/_inf_html11.py) and the answer is worked out again from what is written in it.
- level 1: the one fragment that is a list of the right kind with each item in its <li>; or what a browser shows of
  the list in the question, a number or a bullet before the text of each item;
- level 2: the items of the outer list, of an inner one, of all; the numbers of an inner list; the one fragment
  where the inner list is inside its item;
- level 3: rows, columns and data cells counted on the table; the heading above a datum;
- level 4: the one fragment that is the table asked for, row by row; the one where <caption> is the first child;
- level 5: the columns as the sum of the colspans of the first row; the one row whose places add up;
- level 6: the cells left to write under cells with rowspan; the heading above a cell of the row below, placed as
  a browser places it.
"""
import re

from checkers._inf_codice import choice_of, common
from checkers._inf_html11 import places, read, span

CASE_RANGES = {
    1: {"scegli": (0.40, 0.60), "vede": (0.40, 0.60)},
    2: {case: (0.14, 0.27) for case in ("esterne", "interne", "tutte", "numeri", "bene")},
    3: {case: (0.19, 0.31) for case in ("righe", "colonne", "celle", "intestazione")},
    4: {"struttura": (0.40, 0.60), "didascalia": (0.40, 0.60)},
    5: {"colonne": (0.40, 0.60), "riga": (0.40, 0.60)},
    6: {"mancano": (0.40, 0.60), "colonna": (0.40, 0.60)},
}


def is_list(node, tag, items):
    """Whether a node is a list of that kind whose children are <li> with those texts and nothing else."""
    return node.tag == tag and not node.attrs and all(not isinstance(c, str) for c in node.children) and [(c.tag, c.children) for c in node.nodes] == [("li", [item]) for item in items]


def only(fragment):
    """The one element a fragment is made of, or None when it holds more, or loose text."""
    top = read(fragment).children
    return top[0] if len(top) == 1 and not isinstance(top[0], str) else None


def one_right(errors, options, correct, good):
    if good != [i == correct for i in range(len(options))]:
        errors.append(f"the right fragment is not the only one written well: {good}")


def label(option):
    return option["values"][0]


def lists_shown(sample, errors):
    """The outer list of the question as (tag, [(text, inner tag or None, [inner items])])."""
    top = only(sample["listing"])
    if top is None or top.tag not in ("ul", "ol") or any(isinstance(c, str) or c.tag != "li" for c in top.children):
        errors.append("the fragment shown is not one list of items")
        return None
    voci = []
    for li in top.nodes:
        inner = li.nodes
        if len(inner) > 1 or any(n.tag not in ("ul", "ol") or any(isinstance(c, str) or c.tag != "li" or c.nodes for c in n.children) for n in inner):
            errors.append("an item holds something else than its text and one list")
            return None
        voci.append((li.text, inner[0].tag if inner else None, [c.text for c in inner[0].nodes] if inner else []))
    return top.tag, voci


def level1(sample, errors, options, correct):
    params = sample["params"]
    items = params["items"]
    if len(items) != 3 or len(set(items)) != 3:
        errors.append("a list of three different items")
    if params["case"] == "scegli":
        if not all("listing" in o for o in options):
            return errors.append("the options are fragments")
        if not all(item in sample["problem"] for item in items):
            errors.append("the question does not name the items")
        ordered = "in quest’ordine" in sample["problem"]
        if ordered != (params["kind"] == "ol"):
            errors.append("an ordered list is asked for exactly when the order is said to count")
        tops = [only(o["listing"]) for o in options]
        one_right(errors, options, correct, [top is not None and is_list(top, params["kind"], items) for top in tops])
        if sample.get("solutionListing") != options[correct]["listing"]:
            errors.append("the fragment of the solution is not the right option")
    else:
        top = only(sample.get("listing", ""))
        if top is None or top.tag not in ("ul", "ol") or [c.tag for c in top.nodes] != ["li"] * 3:
            return errors.append("the question shows a list of three items")
        texts = [li.text for li in top.nodes]
        rendered = "".join(f"{f'{i + 1}.' if top.tag == 'ol' else '•'} {text}\n" for i, text in enumerate(texts))
        if options[correct].get("listing") != rendered:
            errors.append(f"the browser shows {rendered!r}")
        bare = [re.sub(r"^\d+\. ", "", text) for text in texts]
        if bare != items or (bare != texts) != params["typed"]:
            errors.append("the items of the list are not those of params")


def level2(sample, errors, options, correct):
    params = sample["params"]
    case = params["case"]
    if case == "bene":
        if not all("listing" in o for o in options):
            return errors.append("the options are fragments")
        good = []
        for o in options:
            top = only(o["listing"])
            ok = top is not None and top.tag == params["outer"] and all(not isinstance(c, str) and c.tag == "li" for c in top.children) and len(top.nodes) == 2
            if ok:
                target, plain = (top.nodes[0], top.nodes[1]) if params["first"] else (top.nodes[1], top.nodes[0])
                ok = plain.children == [params["plain"]] and target.text == params["target"] and len(target.nodes) == 1 and is_list(target.nodes[0], params["inner"], params["items"]) and isinstance(target.children[0], str)
            good.append(ok)
        one_right(errors, options, correct, good)
        if params["target"] not in sample["problem"] or not all(item in sample["problem"] for item in params["items"]):
            errors.append("the question does not name the item and the inner list")
        return
    shown = lists_shown(sample, errors)
    if not shown:
        return
    outer, voci = shown
    if len(sample["listing"].rstrip("\n").split("\n")) > 18 or not 2 <= len(voci) <= 3 or not any(tag for _, tag, _ in voci):
        errors.append("two or three items, at least one with a list inside, in at most 18 rows")
    inside = sum(len(items) for _, _, items in voci)
    if case == "numeri":
        with_inner = [(k, tag, items) for k, (_, tag, items) in enumerate(voci, 1) if tag]
        if outer != "ol" or len(with_inner) != 1 or len(with_inner[0][2]) != 2:
            return errors.append("a numbered list with one inner list of two items")
        _, tag, items = with_inner[0]
        if not all(f'"{item}"' in sample["problem"] for item in items):
            errors.append("the question does not name the two inner items")
        right = "1 e 2" if tag == "ol" else "nessun numero: hanno un pallino"
    elif case == "esterne":
        right = str(len(voci))
    elif case == "tutte":
        right = str(len(voci) + inside)
    else:
        named = [items for text, tag, items in voci if tag and f'"{text}"' in sample["problem"]]
        if len(named) != 1:
            return errors.append("the question does not name one item with a list inside")
        right = str(len(named[0]))
    if label(options[correct]) != right:
        errors.append(f"the answer is {right}, not {label(options[correct])}")


def table_shown(sample, errors):
    """The rows of the table of the question, each a list of its cells."""
    top = only(sample.get("listing", ""))
    if top is None or top.tag != "table" or any(isinstance(c, str) or c.tag != "tr" for c in top.children):
        errors.append("the fragment shown is not a table of rows")
        return None
    rows = [tr.nodes for tr in top.nodes]
    if any(isinstance(c, str) or c.tag not in ("th", "td") for tr in top.nodes for c in tr.children):
        errors.append("a row holds something else than cells")
        return None
    return rows


def level3(sample, errors, options, correct):
    rows = table_shown(sample, errors)
    if not rows:
        return
    case = sample["params"]["case"]
    widths = {len(row) for row in rows}
    if len(widths) != 1 or [c.tag for c in rows[0]] != ["th"] * len(rows[0]) or any(c.tag != "td" for row in rows[1:] for c in row):
        return errors.append("a row of headings and rows of data, all with the same number of cells")
    columns, data = len(rows[0]), len(rows) - 1
    if not (2 <= columns <= 4 and 1 <= data <= 3) or len(sample["listing"].rstrip("\n").split("\n")) > 18:
        errors.append("two to four columns and one to three rows of data, in at most 18 rows of code")
    if case == "intestazione":
        datum = sample["params"]["datum"]
        where = [(r, c) for r, row in enumerate(rows[1:]) for c, cell in enumerate(row) if cell.text == datum]
        if len(where) != 1 or where[0][1] == 0 or f'"{datum}"' not in sample["problem"]:
            return errors.append("the datum asked about is written once, not in the first column")
        right = rows[0][where[0][1]].text
    else:
        right = str({"righe": data + 1, "colonne": columns, "celle": data * columns}[case])
    if label(options[correct]) != right:
        errors.append(f"the answer is {right}, not {label(options[correct])}")


def level4(sample, errors, options, correct):
    params = sample["params"]
    if not all("listing" in o for o in options):
        return errors.append("the options are fragments")
    h1, h2 = params["headers"]
    good = []
    for o in options:
        top = only(o["listing"])
        ok = top is not None and top.tag == "table" and not top.attrs and all(not isinstance(c, str) for c in top.children)
        if ok and params["case"] == "struttura":
            d1, d2 = params["data"]
            ok = [(tr.tag, [(c.tag, c.children) for c in tr.nodes], tr.text) for tr in top.nodes] == [("tr", [("th", [h1]), ("th", [h2])], ""), ("tr", [("td", [d1]), ("td", [d2])], "")]
        elif ok:
            ok = [(c.tag, c.children if c.tag == "caption" else [(x.tag, x.children) for x in c.nodes]) for c in top.nodes] == [("caption", [params["caption"]]), ("tr", [("th", [h1]), ("th", [h2])])]
        good.append(ok)
    one_right(errors, options, correct, good)
    if sample.get("solutionListing") != options[correct]["listing"]:
        errors.append("the fragment of the solution is not the right option")
    named = [h1, h2] + (params["data"] if params["case"] == "struttura" else [params["caption"]])
    if params["case"] == "struttura" and not all(f'"{text}"' in sample["problem"] for text in named):
        errors.append("the question does not name the cells")
    if params["case"] == "didascalia" and f'"{params["caption"]}"' not in sample["problem"]:
        errors.append("the question does not name the caption")


def level5(sample, errors, options, correct):
    params = sample["params"]
    if params["case"] == "colonne":
        top = only(sample.get("listing", ""))
        if top is None or top.tag != "table" or len(top.nodes) != 1 or top.nodes[0].tag != "tr":
            return errors.append("the question shows the first row of a table")
        cells = top.nodes[0].nodes
        spans = [span(c, "colspan") for c in cells]
        if sum(1 for s in spans if s > 1) != 2 or any(not 2 <= s <= 4 for s in spans if s > 1) or any(c.tag != "th" or "rowspan" in c.attrs for c in cells):
            errors.append("two headings with a colspan from 2 to 4, and at most one without")
        right = str(sum(spans))
        if label(options[correct]) != right:
            errors.append(f"the columns are {right}, not {label(options[correct])}")
        if str(len(cells)) not in [label(o) for o in options]:
            errors.append("the number of cells written is not among the wrong answers")
        return
    if not all("listing" in o for o in options):
        return errors.append("the options are rows")
    columns, wanted, start, k = params["columns"], params["cells"], params["start"], params["span"]
    if not (3 <= columns <= 4 and 2 <= k < columns and 1 <= start and start + k <= columns) or len(wanted) != columns - k + 1:
        errors.append("a cell of 2 or more columns, not in the first column, in a table of 3 or 4")
    good = []
    for o in options:
        top = only(o["listing"])
        ok = top is not None and top.tag == "tr" and not top.attrs and all(not isinstance(c, str) and c.tag == "td" for c in top.children)
        if ok:
            cells = top.nodes
            ok = [c.children for c in cells] == [[text] for text in wanted] and [c.attrs for c in cells] == [({"colspan": str(k)} if i == start else {}) for i in range(len(cells))] and sum(span(c, "colspan") for c in cells) == columns
        good.append(ok)
    one_right(errors, options, correct, good)
    if f'"{wanted[start]}"' not in sample["problem"] or f"{columns} colonne" not in sample["problem"]:
        errors.append("the question does not say the columns and the wide cell")
    if sample.get("solutionListing") != options[correct]["listing"]:
        errors.append("the fragment of the solution is not the right option")


def level6(sample, errors, options, correct):
    params = sample["params"]
    top = only(sample.get("listing", ""))
    if top is None or top.tag != "table" or [c.tag for c in top.nodes] != ["tr"] * 3:
        return errors.append("the question shows a table of three rows")
    rows = [tr.nodes for tr in top.nodes]
    columns = len(rows[0])
    if any(c.tag != "th" or c.attrs for c in rows[0]) or len(rows[1]) != columns or any(c.tag != "td" for c in rows[1] + rows[2]):
        return errors.append("a row of headings and a row with as many cells")
    tall = [c for c in rows[1] if span(c, "rowspan") > 1]
    if any("colspan" in c.attrs for row in rows for c in row):
        errors.append("no colspan in this level")
    if params["case"] == "mancano":
        if rows[2] or not 3 <= columns <= 4 or not 1 <= len(tall) <= 2 or len({span(c, "rowspan") for c in tall}) != 1:
            errors.append("an empty third row under one or two cells with the same rowspan, in 3 or 4 columns")
        right = str(columns - len(tall))
        if str(columns) not in [label(o) for o in options]:
            errors.append("the number of columns is not among the wrong answers")
    else:
        if columns != 3 or len(tall) != 1 or span(tall[0], "rowspan") != 2 or len(rows[2]) != 2:
            return errors.append("three columns, one cell of two rows, two cells in the row below")
        starts, width = places(rows)
        datum = params["datum"]
        where = [c for c, cell in zip(starts[2], rows[2]) if cell.text == datum]
        everywhere = [cell.text for row in rows[1:] for cell in row]
        if width != 3 or len(where) != 1 or everywhere.count(datum) != 1 or f'"{datum}"' not in sample["problem"]:
            return errors.append("the datum asked about is one cell of the row below, written once")
        right = rows[0][where[0]].text
    if label(options[correct]) != right:
        errors.append(f"the answer is {right}, not {label(options[correct])}")


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errors = common(sample)
    case = sample["params"].get("case")
    choice = choice_of(sample)
    if not choice or errors and "the right option is not among the options" in errors:
        return errors, case
    if sample["answer"]["kind"] != "choice" or "program" in sample["params"]:
        errors.append("every level is a multiple choice about fragments, without programs")
    if sample["level"] not in LEVELS or case not in CASE_RANGES[sample["level"]]:
        return errors + [f"unknown case {case} for level {sample['level']}"], case
    options = choice["options"]
    if len({(("listing" in o), ("code" in o)) for o in options}) != 1:
        errors.append("the options are all fragments or all texts")
    LEVELS[sample["level"]](sample, errors, options, choice["correct"])
    return errors, case
