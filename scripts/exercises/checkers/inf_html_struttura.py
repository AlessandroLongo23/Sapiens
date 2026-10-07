"""Checker for inf-html-struttura (specs/exercises/inf-html-struttura.md).

Written from the spec, without the generator's code. Every fragment is read again here, by a small reader that
follows the rules of the lesson: a start tag makes a child of the last element still open, an end tag closes its
element and what was left open inside it, a heading closes a heading that is still open, a comment is skipped (to
the end of the text when it never ends). For each sample the answer is worked out from the fragment shown:
- level 1: the text of title, the row that does what is asked, the row that is not there;
- level 2: the number of p elements, the level of the missing heading, the one page that keeps the two rules;
- level 3: the part that holds what the hidden one holds, the one page with title in head and h1 in header in body;
- level 4: the parent, the number of children, the only sibling among the options;
- level 5: the paragraphs outside the comments, the parent of a paragraph after a heading left open, a tag that
  does not exist.
"""
import re

from checkers._inf_codice import choice_of, common

CASE_RANGES = {
    1: {"scheda": (0.18, 0.32), "finestra": (0.18, 0.32), "compito": (0.18, 0.32), "manca": (0.18, 0.32)},
    2: {"paragrafi": (0.26, 0.41), "livello": (0.26, 0.41), "regole": (0.26, 0.41)},
    3: {"quale": (0.47, 0.63), "posto": (0.37, 0.53)},
    4: {"genitore": (0.26, 0.41), "figli": (0.26, 0.41), "fratello": (0.26, 0.41)},
    5: {"commento": (0.26, 0.41), "aperto": (0.26, 0.41), "sconosciuto": (0.26, 0.41)},
}

VOID = {"meta", "br", "img", "link", "hr", "input"}
HEADINGS = {"h1", "h2", "h3", "h4", "h5", "h6"}
KNOWN = HEADINGS | VOID | {"html", "head", "title", "body", "header", "nav", "main", "section", "footer", "div", "p", "a", "em", "strong", "ul", "ol", "li", "table", "span"}
PIECE = re.compile(r"<!--.*?(?:-->|\Z)|<(/?)([A-Za-z?][\w?]*)([^>]*)>|[^<]+", re.S)


class Node:
    def __init__(self, tag, parent):
        self.tag, self.parent, self.children, self.text = tag, parent, [], ""

    def key(self):
        return f"{self.tag}:{self.text}" if self.tag in ("p", "a") else self.tag

    def inside(self):
        return [d for c in self.children for d in [c] + c.inside()]


def read(text):
    """The elements of a fragment in the order they are met, as a browser would nest them."""
    nodes, open_ = [], []
    for m in PIECE.finditer(text):
        whole, closing, tag = m.group(0), m.group(1), (m.group(2) or "").lower()
        if whole.startswith("<!--"):
            continue
        if not tag:
            if open_ and whole.strip():
                open_[-1].text = (open_[-1].text + " " + " ".join(whole.split())).strip()
            continue
        if closing:
            at = max((i for i, n in enumerate(open_) if n.tag == tag), default=-1)
            if at >= 0:
                del open_[at:]
            continue
        if open_ and tag in HEADINGS and open_[-1].tag in HEADINGS:
            open_.pop()
        if open_ and tag == "p" and open_[-1].tag == "p":
            open_.pop()
        node = Node(tag, open_[-1] if open_ else None)
        if node.parent:
            node.parent.children.append(node)
        nodes.append(node)
        if tag not in VOID:
            open_.append(node)
    return nodes


def one(nodes, key):
    found = [n for n in nodes if n.key() == key]
    return found[0] if len(found) == 1 else None


def only(options, good, correct, errors, what):
    marks = [bool(good(o)) for o in options]
    if marks != [i == correct for i in range(len(options))]:
        errors.append(f"{what}: the right option is not the only good one: {marks}")


def level1(sample, options, correct, errors):
    params, case = sample["params"], sample["params"]["case"]
    rows = sample["listing"].rstrip("\n").split("\n")
    nodes = read(sample["listing"])
    by = {n.tag: n for n in nodes}
    skeleton = ["<!DOCTYPE html>", '<html lang="it">', "<head>", "</head>", "<body>", "</body>", "</html>"]
    if case != "manca":
        if [r for r in skeleton if r not in rows]:
            errors.append("the skeleton shown is not whole")
        title = by.get("title")
        if not title or not title.parent or title.parent.tag != "head" or title.text != params["tab"]:
            errors.append("title is not in head with the text of the tab")
        seen = [n.text for n in nodes if n.tag in ("h1", "p") and n.parent and n.parent.tag == "body"]
        if seen != [params["h1"]] + params["texts"] or params["tab"] in seen:
            errors.append("the texts of the body are not those of params, or one is the title")
    values = [o["values"][0] for o in options]
    if case == "scheda":
        only(options, lambda o: o["values"][0] == by["title"].text, correct, errors, "scheda")
    elif case == "finestra":
        in_body = {n.text for n in by["body"].inside()}
        only(options, lambda o: o["values"][0] not in in_body, correct, errors, "finestra")
        if not all(v in in_body or v == params["tab"] for v in values):
            errors.append("an option is no text of the page")
    elif case == "compito":
        role = {"doctype": r"<!DOCTYPE html>", "lingua": r"<html lang=\"it\">", "codifica": r"<meta charset=\"utf-8\">", "scheda": r"<title>.+</title>"}
        only(options, lambda o: re.fullmatch(role[params["role"]], o["listing"].strip()), correct, errors, "compito")
        if not all(o["listing"].strip() in [r.strip() for r in rows] for o in options):
            errors.append("an option is not a row of the page")
        words = {"doctype": "HTML di oggi", "lingua": "lingua", "codifica": "codifica", "scheda": "scheda"}
        if words[params["role"]] not in sample["problem"]:
            errors.append("the question does not ask for the role in params")
    elif case == "manca":
        missing = [r for r in skeleton if r not in rows]
        if missing != [params["missing"]]:
            errors.append(f"the rows missing are {missing}")
        only(options, lambda o: o["listing"].strip() in missing, correct, errors, "manca")
        if not all(o["listing"].strip() in missing or o["listing"].strip() in [r.strip() for r in rows] for o in options):
            errors.append("a wrong option is not a row of the file")
    else:
        errors.append(f"unknown case {case}")
    if len(rows) > 12:
        errors.append("more than 12 rows")


def heading_levels(text):
    return [int(n.tag[1]) for n in read(text) if n.tag in HEADINGS]


def keeps_rules(levels):
    return levels.count(1) == 1 and levels[0] == 1 and all(b - a <= 1 for a, b in zip(levels, levels[1:]))


def level2(sample, options, correct, errors):
    params, case = sample["params"], sample["params"]["case"]
    if case == "paragrafi":
        nodes = read(sample["listing"])
        count = sum(1 for n in nodes if n.tag == "p")
        lines = len(sample["listing"].rstrip("\n").split("\n"))
        if (count, lines) != (params["count"], params["lines"]) or lines <= count:
            errors.append(f"{count} paragraphs on {lines} rows")
        if sample["listing"].count("<p>") != sample["listing"].count("</p>"):
            errors.append("a paragraph is not closed")
        only(options, lambda o: o["values"][0] == str(count), correct, errors, "paragrafi")
    elif case == "livello":
        rows = sample["listing"].rstrip("\n").split("\n")
        if not re.fullmatch(r"<\?\?>.+</\?\?>", rows[-1]):
            errors.append("the last row is not the heading to name")
        before = heading_levels("\n".join(rows[:-1]))
        if not keeps_rules(before):
            errors.append("the headings shown do not keep the rules")
        problem = sample["problem"]
        m = re.search(r'è una parte di "([^"]+)"', problem)
        if m:
            parents = [n for n in read("\n".join(rows[:-1])) if n.text == m.group(1)]
            level = int(parents[0].tag[1]) + 1 if len(parents) == 1 else None
        elif "un'altra parte della pagina" in problem:
            level = 2
        else:
            level = None
        if level != params["depth"]:
            errors.append(f"the heading asked for is of level {level}")
        only(options, lambda o: o["values"][0] == f"h{level}", correct, errors, "livello")
    elif case == "regole":
        only(options, lambda o: keeps_rules(heading_levels(o["listing"])), correct, errors, "regole")
        if heading_levels(options[correct]["listing"]) != params["levels"]:
            errors.append("the levels of the right page are not those of params")
        if sample.get("solutionListing") != options[correct]["listing"]:
            errors.append("the fragment of the solution is not the right option")
    else:
        errors.append(f"unknown case {case}")


HOLDS = {"header": {"h1"}, "nav": {"a"}, "main": {"h2", "p"}, "footer": {"p"}}


def level3(sample, options, correct, errors):
    params, case = sample["params"], sample["params"]["case"]
    if case == "quale":
        nodes = read(sample["listing"])
        hidden = [n for n in nodes if n.tag == "???"]
        if len(hidden) != 1 or sample["listing"].count("???") != 2:
            errors.append("one element is hidden, in its two tags")
            return
        parts = [n.tag for n in nodes if n.parent and n.parent.tag == "body"]
        if sorted(p for p in parts if p != "???") != sorted(set(HOLDS) - {params["part"]}) or len(parts) != 4:
            errors.append(f"the page has the parts {parts}")
        # which part it is: by what it holds and by where it is (the footer is the last, and holds one paragraph)
        kids = {c.tag for c in hidden[0].children}
        guess = [p for p, held in HOLDS.items() if kids == held and (p != "footer" or parts[-1] == "???") and (p != "main" or parts[-1] != "???")]
        if guess != [params["part"]]:
            errors.append(f"the hidden part holds {kids}: it reads as {guess}")
        only(options, lambda o: o["values"][0] == params["part"], correct, errors, "quale")
    elif case == "posto":
        def good(o):
            nodes = read(o["listing"])
            by = {n.tag: n for n in nodes}
            chain = lambda n: [] if n is None else [n.tag] + chain(n.parent)
            return chain(by.get("title")) == ["title", "head"] and chain(by.get("h1")) == ["h1", "header", "body"]
        only(options, good, correct, errors, "posto")
        for o in options:
            if params["tab"] not in o["listing"] or params["h1"] not in o["listing"]:
                errors.append("an option has other texts")
    else:
        errors.append(f"unknown case {case}")


def level4(sample, options, correct, errors):
    params, case = sample["params"], sample["params"]["case"]
    nodes = read(sample["listing"])
    if len(sample["listing"].rstrip("\n").split("\n")) > 18 or nodes[0].tag != "body":
        errors.append("a body of at most 18 rows")
    if len({n.key() for n in nodes}) != len(nodes) - sum(1 for n in nodes if n.tag in ("p", "a")) + len({n.key() for n in nodes if n.tag in ("p", "a")}):
        errors.append("two elements cannot be told apart")
    target = one(nodes, params["target"])
    if target is None:
        errors.append("the element asked about is not one element of the page")
        return
    if case == "genitore":
        if not target.parent:
            errors.append("the root has no parent")
            return
        only(options, lambda o: o["values"][0] == target.parent.key(), correct, errors, "genitore")
    elif case == "figli":
        only(options, lambda o: o["values"][0] == str(len(target.children)), correct, errors, "figli")
        if f"<{target.tag}>" not in sample["problem"]:
            errors.append("the question does not name the element")
    elif case == "fratello":
        brothers = {n.key() for n in target.parent.children if n is not target} if target.parent else set()
        only(options, lambda o: o["values"][0] in brothers, correct, errors, "fratello")
    else:
        errors.append(f"unknown case {case}")
    if case != "figli":
        for o in options:
            if one(nodes, o["values"][0]) is None:
                errors.append(f"the option {o['values'][0]} is not one element of the page")


def level5(sample, options, correct, errors):
    params, case = sample["params"], sample["params"]["case"]
    nodes = read(sample["listing"])
    if case == "commento":
        shown = sum(1 for n in nodes if n.tag == "p")
        written = sample["listing"].count("<p>")
        if not 0 < shown < written:
            errors.append(f"{shown} paragraphs shown of {written}")
        never_ends = sample["listing"].count("<!--") > sample["listing"].count("-->")
        if never_ends != params["open"]:
            errors.append("params.open does not say whether a comment never ends")
        only(options, lambda o: o["values"][0] == str(shown), correct, errors, "commento")
    elif case == "aperto":
        if sample["listing"].count("<h2>") - sample["listing"].count("</h2>") != 1:
            errors.append("one heading is left open")
        target = one(nodes, "p:" + params["target"])
        if target is None or f'"{params["target"]}"' not in sample["problem"]:
            errors.append("the paragraph asked about is not one paragraph of the fragment")
            return
        only(options, lambda o: o["values"][0] == target.parent.tag, correct, errors, "aperto")
    elif case == "sconosciuto":
        if params["tag"] in KNOWN or nodes[0].tag != params["tag"] or nodes[0].text != params["text"]:
            errors.append("the first element is not an invented tag with the text asked about")
        if f"<{params['tag']}>" not in sample["problem"] or f'"{params["text"]}"' not in sample["problem"]:
            errors.append("the question does not name the tag and the text")
        only(options, lambda o: o["values"][0] == "normale", correct, errors, "sconosciuto")
        if sorted(o["values"][0] for o in options) != ["errore", "niente", "normale", "titolo"]:
            errors.append("the four ways a text can be shown")
    else:
        errors.append(f"unknown case {case}")


def check(sample):
    errors = common(sample)
    params = sample["params"]
    case = params.get("case")
    choice = choice_of(sample)
    if not choice or sample["answer"]["kind"] != "choice":
        return errors + ["every level is a multiple choice"], case
    if "program" in params:
        errors.append("a level of fragments has no program")
    if "listing" in sample and sample["level"] > 1 and params.get("fragment") != sample["listing"]:
        errors.append("params.fragment is not the fragment shown")
    options, correct = choice["options"], choice["correct"]
    level = sample["level"]
    try:
        {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}[level](sample, options, correct, errors)
    except (KeyError, IndexError, AttributeError, TypeError) as e:
        errors.append(f"the sample cannot be read: {e!r}")
    return errors, case
