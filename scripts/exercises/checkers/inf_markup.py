"""Checker for inf-markup (specs/exercises/inf-markup.md).

Written from the spec. Every level is a multiple choice. The fragments are read again here: an element by a
regular expression, the nesting by a strict reader of tags written for this check (a browser forgives what it must
not), the tree by counting from the stack of open elements, Markdown by a converter of the four marks of the lesson.
"""
import re

from checkers._inf_codice import choice_of, common

CASE_RANGES = {
    1: {k: (0.11, 0.23) for k in ("apertura", "chiusura", "contenuto", "nome", "valore", "elemento")},
    2: {"giusto": (0.52, 0.68), "sbagliato": (0.32, 0.48)},
    3: {"figli": (0.28, 0.42), "elementi": (0.28, 0.42), "genitore": (0.23, 0.37)},
    4: {"struttura": (0.24, 0.36), "aspetto": (0.14, 0.26), "istruzione": (0.24, 0.36), "marcato": (0.14, 0.26)},
    5: {"titolo": (0.19, 0.31), "evidenza": (0.19, 0.31), "importante": (0.19, 0.31), "elenco": (0.19, 0.31)},
}

TAG = re.compile(r"<(/?)([^<>\s/]*)([^<>]*)>")


def read(fragment):
    """The tree of a fragment as [name, children] with texts as strings, or None when a tag is not closed, is
    closed by another name, is closed out of turn, or is not written as a tag at all."""
    root = ["", []]
    stack = [root]
    at = 0
    for m in TAG.finditer(fragment):
        text = fragment[at:m.start()]
        if "<" in text or ">" in text:
            return None
        if text.strip():
            stack[-1][1].append(text.strip())
        at = m.end()
        closing, name, rest = m.group(1), m.group(2), m.group(3)
        if not re.fullmatch(r"[a-z][a-z0-9]*", name):
            return None
        if closing:
            if rest.strip() or len(stack) == 1 or stack[-1][0] != name:
                return None
            stack.pop()
        else:
            if rest.strip().endswith("/") or (rest and not re.fullmatch(r'(\s+[a-z]+="[^"<>]*")*\s*', rest)):
                return None
            node = [name, []]
            stack[-1][1].append(node)
            stack.append(node)
    tail = fragment[at:]
    if "<" in tail or ">" in tail or len(stack) != 1:
        return None
    if tail.strip():
        root[1].append(tail.strip())
    return root


def elements(node):
    return [child for child in node[1] if isinstance(child, list)]


def count(node):
    return sum(1 + count(child) for child in elements(node))


def labels(sample):
    return [o.get("listing", o["latex"]).rstrip("\n") for o in choice_of(sample)["options"]]


def only_right(sample, good, errors):
    """`good[i]` says whether option i is what the question asks for: only the right one is."""
    correct = choice_of(sample)["correct"]
    if good != [i == correct for i in range(len(good))]:
        errors.append(f"the right option is not the only one that answers: {good}, right is {correct}")


def same(params, errors, **expected):
    for key, v in expected.items():
        if params.get(key) != v:
            errors.append(f"params.{key} = {params.get(key)!r}, the fragment says {v!r}")


def level1(sample, errors):
    p = sample["params"]
    m = re.fullmatch(r'<([a-z0-9]+) ([a-z]+)="([^"]+)">([^<>]+)</([a-z0-9]+)>\n', sample.get("listing", ""))
    if not m or m.group(1) != m.group(5):
        return errors.append(f"not one element with one attribute: {sample.get('listing')!r}")
    tag, attribute, value, content = m.group(1), m.group(2), m.group(3), m.group(4)
    asks = {
        "Qual è il tag di apertura?": ("apertura", f'<{tag} {attribute}="{value}">'),
        "Qual è il tag di chiusura?": ("chiusura", f"</{tag}>"),
        "Qual è il contenuto dell'elemento?": ("contenuto", content),
        "Qual è il nome dell'attributo?": ("nome", attribute),
        "Qual è il valore dell'attributo?": ("valore", value),
        "Qual è il nome dell'elemento?": ("elemento", tag),
    }
    question = sample["problem"].replace("Guarda l'elemento HTML qui sotto. ", "")
    if question not in asks:
        return errors.append(f"level 1 question not recognised: {sample['problem']!r}")
    case, truth = asks[question]
    same(p, errors, case=case, tag=tag, attribute=attribute, value=value, content=content)
    only_right(sample, [label == truth for label in labels(sample)], errors)
    if sample["solution"] != truth or sample.get("solutionListing") != truth + "\n":
        errors.append("the solution is not the part asked for")


def level2(sample, errors):
    p = sample["params"]
    options = labels(sample)
    trees = [read(text + "\n") for text in options]
    if "ha tutti i tag chiusi e annidati correttamente" in sample["problem"]:
        case, good = "giusto", [tree is not None for tree in trees]
    elif "i tag non sono chiusi o annidati correttamente" in sample["problem"]:
        case, good = "sbagliato", [tree is None for tree in trees]
    else:
        return errors.append(f"level 2 question not recognised: {sample['problem']!r}")
    same(p, errors, case=case)
    only_right(sample, good, errors)
    # a fragment that is well formed is one element with a text, another element and maybe a text inside
    for tree in trees:
        if tree is None:
            continue
        outer = elements(tree)
        if len(outer) != 1 or len(tree[1]) != 1 or len(elements(outer[0])) != 1 or outer[0][0] not in ("p", "li", "h1") or elements(outer[0])[0][0] not in ("em", "strong"):
            errors.append("a well formed fragment is not one element with one element inside")
    correct = choice_of(sample)["correct"]
    if sample.get("solutionListing", "").rstrip("\n") != options[correct]:
        errors.append("the fragment of the solution is not the right option")


def level3(sample, errors):
    p = sample["params"]
    tree = read(sample.get("listing", ""))
    if tree is None or len(elements(tree)) != 1 or elements(tree)[0][0] != "ul":
        return errors.append("the fragment is not one well formed list")
    lst = elements(tree)[0]
    items = elements(lst)
    if not 2 <= len(items) <= 4 or any(item[0] != "li" for item in items) or len(lst[1]) != len(items):
        errors.append("a list of two to four items and nothing else")
    inside = [elements(item) for item in items]
    if any(len(x) > 1 or (x and (x[0][0] not in ("em", "strong") or elements(x[0]))) for x in inside) or not any(inside):
        errors.append("at most one em or strong in an item, and at least one in the list")
    same(p, errors, inline=[x[0][0] if x else None for x in inside], list="ul")
    text = sample["problem"]
    options = labels(sample)
    if text == "Nel frammento HTML qui sotto, quanti figli ha l'elemento ul?":
        case, truth = "figli", str(len(items))
    elif text == "Nel frammento HTML qui sotto, quanti elementi ci sono in tutto?":
        case, truth = "elementi", str(count(tree))
    else:
        m = re.fullmatch(r"Nel frammento HTML qui sotto, qual è il genitore dell'elemento (li) con (\w+)\?|Nel frammento HTML qui sotto, qual è il genitore dell'elemento (em|strong) con la parola (\w+)\?", text)
        if not m:
            return errors.append(f"level 3 question not recognised: {text!r}")
        case = "genitore"
        if m.group(1):
            found = [item for item in items if isinstance(item[1][0], str) and item[1][0].startswith(m.group(2) + ",")]
            truth = "ul" if len(found) == 1 else None
        else:
            found = [item for item in items if elements(item) and elements(item)[0][0] == m.group(3) and elements(item)[0][1] == [m.group(4)]]
            truth = "li" if len(found) == 1 else None
        if truth is None:
            return errors.append("the element the question names is not there once")
    same(p, errors, case=case)
    only_right(sample, [label == truth for label in options], errors)
    if sample["solution"] != truth:
        errors.append("the solution is not the right option")


# level 4: what tells the kinds of sentences and of rows apart
STRUCTURE = ("è il titolo", "sono le voci di un elenco", "è un paragrafo", "è un link", "sono una citazione", "è il nome di chi ha scritto")
LOOK = ("in grassetto", "in rosso", "centrata", "corpo 32", "font senza grazie", "sottolineate", "margine", "più grande")


def marked(row):
    """A row is a marked text when it opens with a tag or with a mark of Markdown."""
    return bool(re.match(r"<[a-z0-9]+>.*</[a-z0-9]+>$|# |- |\*", row))


def level4(sample, errors):
    p = sample["params"]
    options = labels(sample)
    text = sample["problem"]
    if "descrive la struttura" in text or "descrive l’aspetto" in text:
        kinds = []
        for label in options:
            s, l = any(mark in label for mark in STRUCTURE), any(mark in label for mark in LOOK)
            if s == l:
                return errors.append(f"sentence of no kind, or of both: {label!r}")
            kinds.append("struttura" if s else "aspetto")
        case = "struttura" if text.startswith("Quale di queste frasi descrive la struttura") else "aspetto"
    elif "istruzione di un linguaggio di programmazione" in text:
        kinds = ["marcato" if marked(label) else "istruzione" for label in options]
        case = "istruzione" if text.startswith("Quale di queste righe è un’istruzione") else "marcato"
        for label, kind in zip(options, kinds):
            if kind == "istruzione" and not re.search(r"=|\(|<<|:$", label):
                errors.append(f"a row that is neither marked nor an instruction: {label!r}")
    else:
        return errors.append(f"level 4 question not recognised: {text!r}")
    same(p, errors, case=case)
    only_right(sample, [kind == case for kind in kinds], errors)
    if p.get("right") != options[choice_of(sample)["correct"]]:
        errors.append("params.right is not the right option")


def to_html(markdown):
    """The HTML of the four marks of the lesson, one row at a time; the rows of a list go in one ul."""
    rows = markdown.split("\n")
    if all(row.startswith("- ") for row in rows):
        return "<ul>" + "".join(f"<li>{row[2:]}</li>" for row in rows) + "</ul>"
    if len(rows) != 1:
        return None
    row = rows[0]
    if row.startswith("# "):
        return f"<h1>{row[2:]}</h1>"
    m = re.fullmatch(r"\*\*([^*]+)\*\*", row)
    if m:
        return f"<strong>{m.group(1)}</strong>"
    m = re.fullmatch(r"\*([^*]+)\*", row)
    if m:
        return f"<em>{m.group(1)}</em>"
    return None


def squeeze(html):
    return re.sub(r">\s+<", "><", html.strip())


def level5(sample, errors):
    p = sample["params"]
    shown = sample.get("listing", "").rstrip("\n")
    options = labels(sample)
    if "testo in Markdown. Quale frammento HTML" in sample["problem"]:
        truth = to_html(shown)
        if truth is None:
            return errors.append(f"the Markdown is not one of the four marks: {shown!r}")
        good = [squeeze(label) == truth for label in options]
        same(p, errors, to="html", markdown=shown)
        markdown = shown
    elif "frammento HTML. Quale testo in Markdown" in sample["problem"]:
        good = [to_html(label) == squeeze(shown) for label in options]
        same(p, errors, to="markdown", html=shown)
        markdown = options[choice_of(sample)["correct"]]
    else:
        return errors.append(f"level 5 question not recognised: {sample['problem']!r}")
    only_right(sample, good, errors)
    case = "elenco" if markdown.startswith("- ") else "titolo" if markdown.startswith("# ") else "importante" if markdown.startswith("**") else "evidenza"
    same(p, errors, case=case)
    if sample.get("solutionListing", "").rstrip("\n") != options[choice_of(sample)["correct"]]:
        errors.append("the fragment of the solution is not the right option")


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errors = common(sample)
    if "program" in sample["params"]:
        errors.append("a level of fragments has no program")
    check_level = LEVELS.get(sample["level"])
    if not check_level:
        return errors + [f"unknown level {sample['level']}"], None
    if choice_of(sample):
        check_level(sample, errors)
    return errors, sample["params"].get("case")
