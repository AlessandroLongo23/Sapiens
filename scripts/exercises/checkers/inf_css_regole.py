"""Checker for inf-css-regole (specs/exercises/inf-css-regole.md).

Written from the spec, without the generator's code. The fragments are read again here: the HTML with Python's
parser, the selectors and the rules by hand. For each sample the answer is worked out from the fragment shown:
- level 1: only the right rule is written well and has the declaration that does what is asked;
- level 2: the number of elements the selector takes in the page;
- level 3: only the right selector takes the elements asked for, and no others;
- levels 4 and 5: the colour of the text, from the rules that take its element (the heaviest selector, then the
  last one written) or from the nearest ancestor that a rule takes.
"""
import re
from html.parser import HTMLParser

from checkers._inf_codice import choice_of, common

CASE_RANGES = {
    1: {"effetto": (0.40, 0.60), "scritta": (0.40, 0.60)},
    2: {"elemento": (0.13, 0.27), "classe": (0.18, 0.32), "discendente": (0.28, 0.42), "niente": (0.13, 0.27)},
    3: {"menu": (0.13, 0.27), "link-main": (0.13, 0.27), "classe": (0.13, 0.27), "id": (0.13, 0.27), "classe-dentro": (0.13, 0.27)},
    4: {"eredita": (0.32, 0.48), "diretta": (0.32, 0.48), "nessuna": (0.13, 0.27)},
    5: {"id": (0.18, 0.32), "classe": (0.18, 0.32), "ordine": (0.18, 0.32), "discendente": (0.18, 0.32)},
}

COLOURS = {"red", "navy", "teal", "crimson", "purple", "green", "orange", "gray", "maroon", "olive", "black"}
NAME = r"[A-Za-z_][\w-]*"


class Node:
    def __init__(self, tag, attrs, parent):
        self.tag, self.parent, self.children, self.text = tag, parent, [], ""
        self.id = attrs.get("id")
        self.classes = (attrs.get("class") or "").split()

    def path(self):
        return (self.parent.path() if self.parent else []) + [self]


class Page(HTMLParser):
    """The elements of a fragment in the order they are written, each knowing its parent."""

    def __init__(self, text):
        super().__init__()
        self.all, self.at = [], None
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, dict(attrs), self.at)
        if self.at:
            self.at.children.append(node)
        self.all.append(node)
        self.at = node

    def handle_endtag(self, tag):
        if self.at and self.at.tag == tag:
            self.at = self.at.parent

    def handle_data(self, data):
        if self.at and data.strip():
            self.at.text = (self.at.text + " " + data.strip()).strip()


def read_selector(text):
    """A selector as a list of alternatives, each a list of pieces (tag, id, classes); None when it is not one."""
    alternatives = []
    for item in text.split(","):
        pieces = []
        for word in item.split():
            m = re.fullmatch(rf"({NAME})?((?:[.#]{NAME})*)", word)
            if not m or not word:
                return None
            marks = re.findall(rf"([.#])({NAME})", m.group(2))
            ids = [n for s, n in marks if s == "#"]
            if len(ids) > 1:
                return None
            pieces.append((m.group(1), ids[0] if ids else None, [n for s, n in marks if s == "."]))
        if not pieces:
            return None
        alternatives.append(pieces)
    return alternatives


def fits(piece, node):
    tag, ident, classes = piece
    return (tag is None or tag.lower() == node.tag) and (ident is None or ident == node.id) and all(c in node.classes for c in classes)


def takes(pieces, node):
    """Whether the pieces of a descendant selector take the node: the last one fits it, the others its ancestors, in order."""
    if not fits(pieces[-1], node):
        return False
    rest, above = pieces[:-1], node.parent
    # from the innermost piece outwards: the nearest ancestor that fits is always the best choice
    for piece in reversed(rest):
        while above and not fits(piece, above):
            above = above.parent
        if not above:
            return False
        above = above.parent
    return True


def taken(page, selector):
    read = read_selector(selector)
    if read is None:
        return None
    return [i for i, node in enumerate(page.all) if any(takes(pieces, node) for pieces in read)]


def weight(pieces):
    return (sum(1 for p in pieces if p[1]), sum(len(p[2]) for p in pieces), sum(1 for p in pieces if p[0]))


def colour_of(rules, node):
    """The colour of the text of a node: the cascade on the node, then on its ancestors from the nearest."""
    while node:
        best = None
        for order, (selector, colour) in enumerate(rules):
            for pieces in read_selector(selector) or []:
                if takes(pieces, node):
                    key = (weight(pieces), order)
                    if best is None or key > best[0]:
                        best = (key, colour)
        if best:
            return best[1]
        node = node.parent
    return "black"


PROPERTIES = {
    "color": lambda v: v in COLOURS,
    "background-color": lambda v: v in COLOURS,
    "font-size": lambda v: re.fullmatch(r"\d+px", v) is not None,
    "font-weight": lambda v: v in ("bold", "normal"),
    "text-align": lambda v: v in ("left", "center", "right"),
    "font-family": lambda v: v in ("serif", "sans-serif", "monospace"),
}
EFFECTS = {
    "testo": lambda p, v: p == "color" and v in COLOURS,
    "sfondo": lambda p, v: p == "background-color" and v in COLOURS,
    "grassetto": lambda p, v: (p, v) == ("font-weight", "bold"),
    "centro": lambda p, v: (p, v) == ("text-align", "center"),
    "grandezza": lambda p, v: p == "font-size" and re.fullmatch(r"\d+px", v) is not None,
}


def read_rule(text):
    """(selector, [(property, value)]) of a rule written well with declarations the browser knows; None otherwise."""
    m = re.fullmatch(r"([^{}()\n]+) \{\n((?:  [^\n]*\n)+)\}\n", text)
    if not m or read_selector(m.group(1)) is None:
        return None
    declarations = []
    for row in m.group(2).splitlines():
        d = re.fullmatch(r"  ([a-z-]+): ([^;:,=]+);", row)
        if not d or d.group(1) not in PROPERTIES or not PROPERTIES[d.group(1)](d.group(2)):
            return None
        declarations.append((d.group(1), d.group(2)))
    return m.group(1), declarations


def split_sheet(listing):
    """The page and the rules of a fragment with the page above an empty row and the style sheet under it."""
    if listing.count("\n\n") != 1:
        return None
    html, css = listing.split("\n\n")
    rules = []
    for row in css.splitlines():
        m = re.fullmatch(r"(.+) \{ color: ([a-z]+); \}", row)
        if not m or m.group(2) not in COLOURS or read_selector(m.group(1)) is None:
            return None
        rules.append((m.group(1), m.group(2)))
    return Page(html), rules


def check(sample):
    errors = common(sample)
    params, level = sample["params"], sample["level"]
    case = params.get("case")
    choice = choice_of(sample)
    if not choice or errors:
        return errors, case
    options = choice["options"]
    right = options[choice["correct"]]
    if sample["answer"]["kind"] != "choice":
        errors.append("every level is multiple choice")

    if level == 1:
        if not all("listing" in o for o in options):
            return errors + ["level 1 offers rules"], case
        read = [read_rule(o["listing"]) for o in options]
        if case == "effetto":
            good = [bool(r) and len(r[1]) == 1 and r[0] == params["selector"] and EFFECTS[params["effect"]](*r[1][0]) for r in read]
            if f'"{params["selector"]}"' not in sample["problem"]:
                errors.append("the question does not name the selector")
        elif case == "scritta":
            good = [bool(r) and len(r[1]) == 2 for r in read]
        else:
            return errors + [f"unknown case {case}"], case
        if good != [i == choice["correct"] for i in range(4)]:
            errors.append(f"the right rule is not the only good one: {good}")
        if sample.get("solutionListing") != right["listing"]:
            errors.append("the rule of the solution is not the right option")

    elif level in (2, 3):
        page = Page(sample.get("listing", ""))
        if not page.all or sample.get("listing") != params.get("page"):
            return errors + ["the page is not shown"], case
        tags = [n.tag for n in page.all]
        if tags.count("nav") != 1 or tags.count("main") != 1 or tags.count("ul") != 1:
            errors.append("the page has one menu, one main and one list")
        if level == 2:
            count = taken(page, params["selector"])
            if f'"{params["selector"]}"' not in sample["problem"]:
                errors.append("the question does not name the selector")
            if count is None:
                errors.append("the selector cannot be read")
            elif right["values"] != [str(len(count))] or params["count"] != len(count):
                errors.append(f'{params["selector"]} takes {len(count)} elements, not {right["values"]}')
            if case == "niente":
                # a class or an id of the page, written without its mark or with the mark of the other
                selector = params["selector"]
                bare = selector.lstrip(".#")
                classes = {c for n in page.all for c in n.classes}
                ids = {n.id for n in page.all if n.id}
                wrong_way = (selector == bare and bare in classes | ids) or (selector == "#" + bare and bare in classes) or (selector == "." + bare and bare in ids)
                if count != [] or not wrong_way:
                    errors.append("a selector that takes nothing is a class or an id written the wrong way")
            if case == "elemento" and not re.fullmatch(r"[a-z]+", params["selector"]):
                errors.append("not a selector of element")
            if case == "classe" and not re.fullmatch(rf"\.{NAME}", params["selector"]):
                errors.append("not a selector of class")
            if case == "discendente" and len(params["selector"].split()) != 2:
                errors.append("not a descendant selector")
            if case != "niente" and case in ("elemento", "classe") and not count:
                errors.append("the selector takes nothing")
            if not all(re.fullmatch(r"\d+", o["values"][0]) for o in options):
                errors.append("the options are numbers")
        else:
            name, ident = params["class"], params["id"]
            inside = lambda node, tag: any(a.tag == tag for a in node.path()[:-1])
            wanted = {
                "menu": [i for i, n in enumerate(page.all) if n.tag == "a" and inside(n, "nav")],
                "link-main": [i for i, n in enumerate(page.all) if n.tag == "a" and inside(n, "main")],
                "classe": [i for i, n in enumerate(page.all) if name in n.classes],
                "id": [i for i, n in enumerate(page.all) if n.id == ident],
                "classe-dentro": [i for i, n in enumerate(page.all) if name in n.classes and inside(n, "ul")],
            }.get(case)
            if not wanted:
                return errors + [f"nothing to take for {case}"], case
            if case == "classe-dentro" and not any(name in n.classes and n.tag == "p" for n in page.all):
                errors.append("no paragraph has the class too")
            good = [taken(page, o["values"][0]) == wanted for o in options]
            if good != [i == choice["correct"] for i in range(4)]:
                errors.append(f"the right selector is not the only one that takes those elements: {good}")
            if any(taken(page, o["values"][0]) is None for o in options):
                errors.append("an option is not a selector")

    elif level in (4, 5):
        read = split_sheet(sample.get("listing", ""))
        if not read:
            return errors + ["the page and its style sheet are not shown"], case
        page, rules = read
        if [list(r) for r in rules] != params.get("rules"):
            errors.append("the rules shown are not those of params")
        targets = [n for n in page.all if n.text == params["text"] and not n.children]
        if len(targets) != 1 or f'"{params["text"]}"' not in sample["problem"]:
            return errors + ["the text asked about is not one element of the page"], case
        node = targets[0]
        colour = colour_of(rules, node)
        if right["values"] != [colour]:
            errors.append(f'the text is {colour}, not {right["values"]}')
        if not all(o["values"][0] in COLOURS for o in options):
            errors.append("the options are colours")
        if len({c for _, c in rules}) != len(rules):
            errors.append("two rules give the same colour")
        direct = [(weight(p), order) for order, (s, _) in enumerate(rules) for p in read_selector(s) if takes(p, node)]
        if level == 4:
            if case == "eredita" and (direct or colour == "black"):
                errors.append("the colour is not inherited")
            if case == "diretta" and (len(direct) != 1 or not any(weight(p)[0] and takes(p, a) for s, _ in rules for p in read_selector(s) for a in node.path()[:-1])):
                errors.append("one rule on the element against an id on an ancestor")
            if case == "nessuna" and colour != "black":
                errors.append("no rule reaches the text")
        else:
            if len(rules) != 3 or len(direct) < 2:
                errors.append("three rules, at least two of them on the paragraph")
            heaviest = max(w for w, _ in direct) if direct else None
            top = [order for w, order in direct if w == heaviest]
            if case == "ordine" and len(top) != 2:
                errors.append("two rules weigh the same")
            if case != "ordine" and (len(top) != 1 or top[0] == len(rules) - 1):
                errors.append("the winner is alone and is not the last rule")
            if case == "id" and (heaviest or (0,))[0] != 1:
                errors.append("the winner has an id")
            if case == "classe" and (heaviest or (0, 0))[:2] != (0, 1):
                errors.append("the winner has a class and no id")
            if case == "discendente" and heaviest != (0, 0, 2):
                errors.append("the winner has two element names")
    else:
        errors.append(f"unknown level {level}")
    return errors, case
