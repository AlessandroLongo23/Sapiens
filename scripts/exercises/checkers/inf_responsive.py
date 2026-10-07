"""Checker for inf-responsive (specs/exercises/inf-responsive.md): relative units, media queries, images that adapt,
contrast and accessible fragments.

Written from the spec. Nothing is run: the CSS and the HTML of every sample are read here and the answer is worked
out again.
- level 1: the unit and the number are read from the rule, the base it refers to from the question and the rule;
- level 2: the style sheet is read with its media queries, and the last declaration that holds at the width wins;
- level 3: every option is read the same way and tried just under the limit, at the limit and above it;
- level 4: the size on the page from the size of the file, the width of the column and what the rule says of width;
- level 5: large or normal from size and weight, then the threshold;
- level 6: every option is read as HTML and tested against what its case asks for.
"""
import re
from html.parser import HTMLParser

from checkers._inf_codice import choice_of, common

CASE_RANGES = {
    1: {k: (0.17, 0.33) for k in ("rem", "em", "percento", "vw")},
    2: {k: (0.10, 0.23) for k in ("sotto", "mezzo", "sopra", "limite", "ordine", "base-dopo")},
    3: {"direzione": (0.40, 0.60), "carattere": (0.40, 0.60)},
    4: {k: (0.17, 0.33) for k in ("stretta", "larga", "allargata", "niente")},
    5: {k: (0.17, 0.33) for k in ("grande-basta", "grande-no", "normale-basta", "normale-no")},
    6: {k: (0.17, 0.33) for k in ("alt", "titoli", "label", "tastiera")},
}

RULE = re.compile(r"([^{}@]+)\{([^{}]*)\}")
MEDIA = re.compile(r"@media\s*\((min|max)-width:\s*(\d+)px\)\s*\{((?:[^{}]*\{[^{}]*\})*)\s*\}")


def declarations(body):
    out = {}
    for declaration in body.split(";"):
        if declaration.strip():
            name, _, value = declaration.partition(":")
            out[name.strip()] = value.strip()
    return out


def read_sheet(text):
    """The rules of a style sheet in the order they are written: (condition or None, selector, {property: value})."""
    rules = []
    at = 0
    for m in MEDIA.finditer(text):
        for selector, body in RULE.findall(text[at:m.start()]):
            rules.append((None, selector.strip(), declarations(body)))
        for selector, body in RULE.findall(m.group(3)):
            rules.append(((m.group(1), int(m.group(2))), selector.strip(), declarations(body)))
        at = m.end()
    for selector, body in RULE.findall(text[at:]):
        rules.append((None, selector.strip(), declarations(body)))
    return rules


def holds(condition, width):
    return condition is None or (width >= condition[1] if condition[0] == "min" else width <= condition[1])


def value_at(rules, selector, name, width):
    """The value of a property at a width: among the rules that hold, the last written wins."""
    value = None
    for condition, s, body in rules:
        if s == selector and name in body and holds(condition, width):
            value = body[name]
    return value


def number(text):
    m = re.fullmatch(r"(\d+(?:\.\d+)?)(px|rem|em|%|vw)?", text or "")
    return (float(m.group(1)), m.group(2)) if m else (None, None)


def said(sample, pattern):
    m = re.search(pattern, sample["problem"])
    return int(m.group(1)) if m else None


def check_1(sample, right, errors):
    p = sample["params"]
    rules = read_sheet(sample.get("listing", ""))
    case = p["case"]
    if case in ("rem", "em"):
        (_, selector, body), = rules
        k, unit = number(body.get(p["property"]))
        if unit != case:
            return errors.append(f"the rule is not in {case}")
        base = said(sample, r"è di (\d+) px") if case == "rem" else number(body.get("font-size"))[0]
        if case == "em" and said(sample, r"è di (\d+) px") != 16:
            errors.append("the question gives the 16 px of the page, which do not count")
    else:
        if len(rules) != 2 or rules[0][1] != p["outer"] or rules[1][1] != p["inner"]:
            return errors.append("an outer and an inner element")
        k, unit = number(rules[1][2].get("width"))
        if unit != {"percento": "%", "vw": "vw"}[case]:
            return errors.append("the unit of the inner width is not that of the case")
        viewport = said(sample, r"largo (\d+) px")
        outer = number(rules[0][2].get("width"))[0]
        base = outer if case == "percento" else viewport
        if viewport is None or viewport == outer:
            errors.append("the viewport and the outer element have different widths, both given")
        k = k / 100
    if base is None or k is None:
        return errors.append("the base of the unit is not given")
    answer = k * base
    if answer != int(answer):
        errors.append(f"{answer} is not a whole number of pixels")
    elif right["values"][0] != str(int(answer)):
        errors.append(f"the answer is {int(answer)}, the sample says {right['values'][0]}")


def check_2(sample, right, errors):
    p = sample["params"]
    rules = read_sheet(sample.get("listing", ""))
    queries = [c for c, _, _ in rules if c]
    if len(rules) != 3 or len(queries) != 2 or any(c[0] != "min" for c in queries):
        return errors.append("a base rule and two media queries with min-width")
    width = said(sample, r"largo (\d+) px")
    if width != p["width"]:
        errors.append("the width of the question is not that of the params")
    answer = number(value_at(rules, p["selector"], p["property"], width))[0]
    if answer is None or right["values"][0] != str(int(answer)):
        errors.append(f"at {width} px the value is {answer}, the sample says {right['values'][0]}")
    # the three values of the sheet are three of the four options
    written = {str(int(number(body.get(p["property"]))[0])) for _, _, body in rules}
    if len(written) != 3 or not written <= {o["values"][0] for o in choice_of(sample)["options"]}:
        errors.append("the three values of the sheet are not among the options")
    low, high = sorted(c[1] for c in queries)
    order = [c[1] if c else 0 for c, _, _ in rules]
    case = p["case"]
    fits = {
        "sotto": order == sorted(order) and width < low,
        "mezzo": order == sorted(order) and low < width < high,
        "sopra": order == sorted(order) and width > high,
        "limite": order == sorted(order) and width in (low, high),
        "ordine": order == [0, high, low] and width > high,
        "base-dopo": order[2] == 0 and width > low,
    }[case]
    if not fits:
        errors.append(f"the sheet and the width are not those of the case {case}")


def check_3(sample, options, right, errors):
    p = sample["params"]
    limit = p["limit"]
    if f"{limit} px" not in sample["problem"]:
        errors.append("the question does not say the limit")
    good = []
    for o in options:
        rules = read_sheet(o.get("listing", ""))
        at = [value_at(rules, p["selector"], p["property"], w) for w in (320, limit - 1, limit, limit + 1, 2000)]
        good.append(at == [p["narrow"], p["narrow"], p["wide"], p["wide"], p["wide"]])
    if good != [o is right for o in options]:
        errors.append(f"the right sheet is not the only one that does what is asked: {good}")
    if p["narrow"] == p["wide"]:
        errors.append("the two values are the same")
    rules = read_sheet(right.get("listing", ""))
    if [c for c, _, _ in rules][0] is not None or rules[-1][0] != ("min", limit):
        errors.append("the right sheet is not written from the phone up")


def check_4(sample, right, errors):
    p = sample["params"]
    m = re.search(r"di (\d+) × (\d+) pixel", sample["problem"])
    rules = read_sheet(sample.get("listing", ""))
    if not m or len(rules) != 2 or rules[1][1] != "img":
        return errors.append("the size of the file, the rule of the column and the rule of img")
    w, h = int(m.group(1)), int(m.group(2))
    column = number(rules[0][2].get("width"))[0]
    img = rules[1][2]
    if (w, h, column) != (p["w"], p["h"], p["column"]) or rules[0][1] != p["selector"]:
        errors.append("the sizes of the fragment are not those of the params")
    if img.get("height") != "auto":
        errors.append("height: auto keeps the proportion")
    if img.get("width") == "100%":
        shown = column
    elif img.get("max-width") == "100%":
        shown = min(w, column)
    else:
        shown = w
    height = shown * h / w
    case = {("max", True): "stretta", ("max", False): "larga", ("width", False): "allargata", ("none", True): "niente"}.get(("width" if "width" in img else "max" if "max-width" in img else "none", column < w))
    if case != p["case"] or column == w:
        errors.append(f"the rule and the widths are those of {case}, not of {p['case']}")
    asks = "larghezza" if "larga" in sample["problem"] else "altezza"
    answer = shown if asks == "larghezza" else height
    if asks != p["asks"] or answer != int(answer) or right["values"][0] != str(int(answer)):
        errors.append(f"the {asks} is {answer}, the sample says {right['values'][0]}")


def check_5(sample, right, errors):
    p = sample["params"]
    m = re.search(r"a (\d+) px, (non in grassetto|in grassetto)\..* è (\d+(?:,\d)?) : 1", sample["problem"])
    if not m:
        return errors.append("the question gives size, weight and ratio")
    size, bold, ratio = int(m.group(1)), m.group(2) == "in grassetto", float(m.group(3).replace(",", "."))
    # large: at least 18 point (24 px), or 14 point bold (18,66 px)
    large = size >= 24 or (bold and size >= 18.66)
    if bold and 18 <= size < 19:
        errors.append("a bold size too close to the limit of large text")
    enough = ratio >= (3 if large else 4.5)
    answer = f"{'grande' if large else 'normale'}-{'basta' if enough else 'no'}"
    if right["values"][0] != answer or p["case"] != answer:
        errors.append(f"the answer is {answer}, the sample says {right['values'][0]}")
    if not 1 < ratio <= 21:
        errors.append("a ratio between 1 and 21")


class Tags(HTMLParser):
    """The elements of a fragment, in order: (tag, attributes, text)."""

    def __init__(self):
        super().__init__()
        self.found = []

    def handle_starttag(self, tag, attrs):
        self.found.append([tag, dict(attrs), ""])

    def handle_data(self, data):
        if self.found and data.strip():
            self.found[-1][2] += data.strip()


def tags(fragment):
    parser = Tags()
    parser.feed(fragment)
    return parser.found


def good_6(p, fragment):
    found = tags(fragment)
    case = p["case"]
    if case == "alt":
        return len(found) == 1 and found[0][0] == "img" and found[0][1].get("src") == p["file"] and found[0][1].get("alt") == p["shows"]
    if case == "titoli":
        return [(t, text) for t, _, text in found] == [("h1", "I Fuori Tempo"), ("h2", p["first"]), ("h3" if p["nested"] else "h2", p["second"])]
    if case == "label":
        label = [f for f in found if f[0] == "label"]
        field = [f for f in found if f[0] == "input"]
        return len(label) == 1 and len(field) == 1 and label[0][2] == p["text"] and label[0][1].get("for") is not None and label[0][1].get("for") == field[0][1].get("id")
    # the keyboard reaches a button, and a link that has its href
    if len(found) != 1 or found[0][2] != p["text"]:
        return False
    tag, attrs, _ = found[0]
    return tag == "button" if p["button"] else tag == "a" and attrs.get("href") == p["file"]


def check_6(sample, options, right, errors):
    p = sample["params"]
    named = {"alt": [p.get("file"), p.get("shows")], "titoli": [p.get("first"), p.get("second")], "label": [p.get("text")], "tastiera": [p.get("text")]}[p["case"]]
    if not all(n in sample["problem"] for n in named):
        errors.append("the question does not name what the fragment is about")
    good = [good_6(p, o.get("listing", "")) for o in options]
    if good != [o is right for o in options]:
        errors.append(f"the right fragment is not the only one that does what is asked: {good}")
    if sample.get("solutionListing") != right.get("listing"):
        errors.append("the fragment of the solution is not the right option")


def check(sample):
    errors = common(sample)
    case = sample["params"].get("case")
    choice = choice_of(sample)
    if not choice or sample["answer"]["kind"] != "choice":
        return errors + ["every level is a multiple choice"], case
    options = choice["options"]
    right = options[choice["correct"]]
    level = sample["level"]
    if level in (3, 6):
        {3: check_3, 6: check_6}[level](sample, options, right, errors)
    else:
        {1: check_1, 2: check_2, 4: check_4, 5: check_5}[level](sample, right, errors)
    return errors, case
