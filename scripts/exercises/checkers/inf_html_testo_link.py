"""Checker for inf-html-testo-link (specs/exercises/inf-html-testo-link.md).

Written from the spec, without the generator's code. The fragments are read again here, and the paths are resolved
here: from the folder of the page, one piece at a time, `..` going up one folder. For each sample the answer is
worked out from what is shown:
- level 1: the word inside the element asked about, the number of br plus one, the one fragment nested well;
- level 2: the file the path of the link leads to from the page;
- level 3: among the options, only the right path leads from the page to the file, among the files listed;
- level 4: the absolute address with its protocol, the href with # and the id, the element with that id;
- level 5: the text of alt, the side worked out from the ratio of the file, the one tag with src and alt.
"""
import re

from checkers._inf_codice import choice_of, common

CASE_RANGES = {
    1: {"aspetto": (0.26, 0.41), "righe": (0.26, 0.41), "annidato": (0.26, 0.41)},
    2: {s: (0.12, 0.28) for s in ("accanto", "giu", "su", "su-giu", "due-su")},
    3: {"accanto": (0.07, 0.20), "giu": (0.14, 0.28), "su": (0.14, 0.29), "su-giu": (0.15, 0.30), "due-su": (0.15, 0.30)},
    4: {"esterno": (0.26, 0.41), "ancora": (0.26, 0.41), "arrivo": (0.26, 0.41)},
    5: {"alt": (0.26, 0.41), "misure": (0.26, 0.41), "scritta": (0.26, 0.41)},
}


def only(options, good, correct, errors, what):
    marks = [bool(good(o)) for o in options]
    if marks != [i == correct for i in range(len(options))]:
        errors.append(f"{what}: the right option is not the only good one: {marks}")


def resolve(page, path):
    """The file a path written in a page leads to, from the root of the site; None when it leaves the site or is no path."""
    if not path or re.match(r"[a-z][a-z0-9+.-]*:|//", path) or "\\" in path:
        return None
    here = [] if path.startswith("/") else page.split("/")[:-1]
    for piece in path.split("/"):
        if piece in ("", "."):
            continue
        if piece == "..":
            if not here:
                return None
            here.pop()
        else:
            here.append(piece)
    return "/".join(here)


def shape(path):
    pieces = path.split("/")
    ups = pieces.count("..")
    downs = len(pieces) - 1 - ups
    if ups == 0:
        return "accanto" if downs == 0 else "giu"
    return "due-su" if ups >= 2 else ("su" if downs == 0 else "su-giu")


def nested_well(text):
    """Whether every element of a fragment is closed, the last opened first; gives the elements as (tag, depth, text)."""
    open_, found = [], []
    for m in re.finditer(r"<(/?)(\w+)>|([^<]+)", text.strip()):
        closing, tag, words = m.group(1), m.group(2), m.group(3)
        if words is not None:
            for entry in open_:
                entry[2] += words
        elif closing:
            if not open_ or open_[-1][0] != tag:
                return None
            entry = open_.pop()
            found.append((entry[0], entry[1], entry[2].strip()))
        else:
            open_.append([tag, len(open_), ""])
    return None if open_ else found


def level1(sample, options, correct, errors):
    params, case = sample["params"], sample["params"]["case"]
    if case == "aspetto":
        text = sample["listing"]
        strong, em = re.findall(r"<strong>(.+?)</strong>", text), re.findall(r"<em>(.+?)</em>", text)
        if len(strong) != 1 or len(em) != 1 or not re.fullmatch(r"<p>.+</p>\n", text, re.S):
            errors.append("a paragraph with one strong and one em")
            return
        asked = {"grassetto": strong, "importante": strong, "corsivo": em, "enfasi": em}[params["ask"]][0]
        if params["ask"] not in sample["problem"]:
            errors.append("the question does not ask what params say")
        only(options, lambda o: o["values"][0] == asked, correct, errors, "aspetto")
        plain = re.sub(r"<[^>]+>", "", text)
        if not all(re.search(rf"\b{re.escape(o['values'][0])}\b", plain) for o in options):
            errors.append("an option is not a word of the paragraph")
    elif case == "righe":
        text = sample["listing"]
        breaks, rows = text.count("<br>"), len(text.rstrip("\n").split("\n"))
        if (breaks, rows) != (params["breaks"], params["rows"]) or not 0 < breaks < rows - 1 or text.count("<p>") != 1:
            errors.append(f"{breaks} br on {rows} rows")
        only(options, lambda o: o["values"][0] == str(breaks + 1), correct, errors, "righe")
    elif case == "annidato":
        first, second = params["words"]
        wanted = sorted([(params["inner"], 1, second), (params["outer"], 0, f"{first} {second}")])
        only(options, lambda o: sorted(nested_well(o["listing"]) or []) == wanted, correct, errors, "annidato")
        if {params["inner"], params["outer"]} != {"em", "strong"}:
            errors.append("em and strong, one inside the other")
        if f"<{params['outer']}>" not in sample["problem"] or f"<{params['inner']}>" not in sample["problem"]:
            errors.append("the question does not name the two elements")
    else:
        errors.append(f"unknown case {case}")


def level2(sample, options, correct, errors):
    params = sample["params"]
    m = re.fullmatch(r'<a href="([^"]+)">\n  [^<]+</a>\n', sample["listing"])
    if not m or m.group(1) != params["href"]:
        errors.append("the link shown is not the one of params")
        return
    if f"La pagina {params['page']} " not in sample["problem"]:
        errors.append("the question does not name the page")
    lands = resolve(params["page"], params["href"])
    if lands is None or lands == params["page"]:
        errors.append("the path leads nowhere")
    if shape(params["href"]) != params["case"]:
        errors.append(f"the path is of the shape {shape(params['href'])}")
    only(options, lambda o: o["values"][0] == lands, correct, errors, "dove porta")


def level3(sample, options, correct, errors):
    params = sample["params"]
    files = sample["listing"].rstrip("\n").split("\n")
    page, target = params["page"], params["file"]
    if page not in files or target not in files or page == target or not page.endswith(".html") or len(set(files)) != len(files):
        errors.append("the page and the file are two files of the site")
    if f"Nella pagina {page} " not in sample["problem"] or f" {target}." not in sample["problem"]:
        errors.append("the question does not name the page and the file")
    attribute = "href" if target.endswith(".html") else "src"
    for o in options:
        if o["listing"].strip() != f'{attribute}="{o["values"][0]}"':
            errors.append(f"an option is not written as {attribute}")
    only(options, lambda o: resolve(page, o["values"][0]) == target and not o["values"][0].startswith("/"), correct, errors, "percorso")
    right = options[correct]["values"][0]
    if shape(right) != params["case"]:
        errors.append(f"the path is of the shape {shape(right)}")
    # the path worked out here: out of the folders the two do not share, then down to the file
    here, there = page.split("/")[:-1], target.split("/")
    shared = 0
    while shared < len(here) and shared < len(there) - 1 and here[shared] == there[shared]:
        shared += 1
    if right != "/".join([".."] * (len(here) - shared) + there[shared:]):
        errors.append("the right path is not the shortest one from the page to the file")
    if sample.get("solutionListing", "").strip() != options[correct]["listing"].strip():
        errors.append("the fragment of the solution is not the right option")


def ids_of(text):
    return {m.group(2): (m.group(1), m.group(3)) for m in re.finditer(r'<(\w+) id="([^"]+)">([^<]+)</\1>', text)}


def level4(sample, options, correct, errors):
    params, case = sample["params"], sample["params"]["case"]
    if case == "esterno":
        right = f"https://{params['domain']}/{params['page']}"
        if params["domain"] not in sample["problem"] or params["page"] not in sample["problem"] or not params["domain"].endswith(".example"):
            errors.append("the question does not name the site and the page")
        only(options, lambda o: o["listing"].strip() == right, correct, errors, "esterno")
    elif case in ("ancora", "arrivo"):
        ids = ids_of(sample["listing"])
        if len(ids) != 3 or params["id"] not in ids or len({text for _, text in ids.values()}) != 3:
            errors.append("three elements with three ids and three texts")
            return
        text = ids[params["id"]][1]
        if case == "ancora":
            if params["text"] != text or f'"{text}"' not in sample["problem"]:
                errors.append("the question does not name the element of params")
            only(options, lambda o: o["listing"].strip() == f'href="#{params["id"]}"', correct, errors, "ancora")
        else:
            if f'href="#{params["id"]}"' not in sample["problem"]:
                errors.append("the question does not show the link of params")
            only(options, lambda o: o["values"][0] == text, correct, errors, "arrivo")
    else:
        errors.append(f"unknown case {case}")


def level5(sample, options, correct, errors):
    params, case = sample["params"], sample["params"]["case"]
    if case in ("alt", "misure"):
        attributes = dict(re.findall(r'(\w+)="([^"]*)"', sample["listing"]))
        if not sample["listing"].startswith("<img ") or "src" not in attributes or not attributes.get("alt"):
            errors.append("an img with src and alt")
            return
    if case == "alt":
        only(options, lambda o: o["values"][0] == attributes["alt"], correct, errors, "alt")
    elif case == "misure":
        (w, h), side, given = params["file"], params["side"], params["given"]
        if attributes.get(side) != str(given) or ("width" in attributes and "height" in attributes):
            errors.append("the tag gives one side, the one of params")
        if f"largo {w} pixel e alto {h}" not in sample["problem"]:
            errors.append("the question does not give the sides of the file")
        asked = "alta" if side == "width" else "larga"
        if f"viene {asked}" not in sample["problem"]:
            errors.append("the question does not ask for the other side")
        num, den = (given * h, w) if side == "width" else (given * w, h)
        if num % den:
            errors.append("the other side is not a whole number")
        only(options, lambda o: o["values"][0] == str(num // den), correct, errors, "misure")
    elif case == "scritta":
        wanted = rf'<img\s+src="{re.escape(params["src"])}"\s+alt="{re.escape(params["alt"])}">'
        only(options, lambda o: re.fullmatch(wanted, o["listing"].strip()), correct, errors, "scritta")
        if params["src"] not in sample["problem"] or f'"{params["alt"]}"' not in sample["problem"]:
            errors.append("the question does not name the file and the text")
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
    if "listing" in sample and params.get("fragment") != sample["listing"]:
        errors.append("params.fragment is not the fragment shown")
    options, correct = choice["options"], choice["correct"]
    try:
        {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}[sample["level"]](sample, options, correct, errors)
    except (KeyError, IndexError, AttributeError, TypeError, ValueError) as e:
        errors.append(f"the sample cannot be read: {e!r}")
    return errors, case
