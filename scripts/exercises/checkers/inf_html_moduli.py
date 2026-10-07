"""Checker for inf-html-moduli (specs/exercises/inf-html-moduli.md).

Written from the spec. Nothing is copied from the generator: every fragment shown or offered is read here with
Python's HTML parser (checkers/_inf_html11.py), and what a browser would do with it is worked out again from its
attributes, with the rules of the lesson said again here.
- level 1: the one <input> whose type is the one for the datum; what the browser does with a type; the element
  for a need;
- level 2: the one fragment where the for of the label is the id of the field; where a click on a label goes;
- level 3: the pairs name=value of the fields that have a name, in order;
- level 4: a checkbox sent only when ticked; the value of the radio button chosen; the value of the option chosen;
  the one fragment whose two fields are radio buttons with the same name;
- level 5: the address asked with get and with post, the body with post, where the data travel, the method for a
  use;
- level 6: whether the form is sent, from required, min, max, minlength and the type email.
"""
import re

from checkers._inf_codice import choice_of, common
from checkers._inf_html11 import read

CASE_RANGES = {
    1: {"tipo": (0.33, 0.47), "fa": (0.33, 0.47), "elemento": (0.14, 0.26)},
    2: {"lega": (0.40, 0.60), "clic": (0.40, 0.60)},
    3: {"senzaName": (0.52, 0.68), "idDiverso": (0.32, 0.48)},
    4: {case: (0.19, 0.31) for case in ("casella", "pallini", "menu", "gruppo")},
    5: {"indirizzo": (0.33, 0.47), "corpo": (0.14, 0.26), "dove": (0.14, 0.26), "metodo": (0.14, 0.26)},
    6: {"numero": (0.33, 0.47), "obbligatorio": (0.14, 0.26), "email": (0.14, 0.26), "lunghezza": (0.14, 0.26)},
}

# the type of field for each datum of level 1, from the spec
TYPE_FOR = {
    "l’indirizzo email": "email",
    "l’email di un genitore": "email",
    "la data di nascita": "date",
    "il giorno della gita": "date",
    "il numero di biglietti": "number",
    "quanti posti prenotare": "number",
    "l’età in anni": "number",
    "la password": "password",
    "il codice segreto della tessera": "password",
    "il cognome": "text",
    "la città in cui si abita": "text",
    "il nome del proprio gruppo": "text",
    "un sì o un no al regolamento": "checkbox",
    "un sì o un no alle notizie del gruppo": "checkbox",
}
# what the browser does with each type, as the table of the lesson says it
DOES = {
    "text": "mostra quello che scrivi e non controlla niente",
    "email": "controlla che ci sia una chiocciola",
    "number": "rifiuta le lettere",
    "date": "apre un calendario",
    "password": "nasconde i caratteri che scrivi",
    "checkbox": "mostra una casella da spuntare",
    "radio": "mostra un pallino da accendere",
}
# sentences that are true of a type though they are another's: they cannot be offered as wrong
TRUE_TOO = {"date": {"rifiuta le lettere"}}
ELEMENT_FOR = {"menu a tendina": "<select>", "righe": "<textarea>", "in vista": '<input type="radio">', "spunta": '<input type="checkbox">'}
METHOD_FOR = {"password": "post", "registrare": "post", "messaggio": "post", "link": "get", "preferiti": "get", "cronologia": "get"}
YES = "Sì, il modulo parte"


def label(option):
    return option["values"][0]


def top(fragment):
    return read(fragment).children


def elements(fragment):
    """The elements at the top of a fragment, or None when there is loose text among them."""
    nodes = top(fragment)
    return None if any(isinstance(n, str) for n in nodes) else nodes


def one_right(errors, options, correct, good):
    if good != [i == correct for i in range(len(options))]:
        errors.append(f"the right fragment is not the only one that works: {good}")


def expect(errors, options, correct, right):
    if label(options[correct]).rstrip("\n") != right.rstrip("\n"):
        errors.append(f"the answer is {right!r}, not {label(options[correct])!r}")
    if sum(1 for o in options if label(o).rstrip("\n") == right.rstrip("\n")) != 1:
        errors.append("the answer is not offered exactly once")


def pairs_of(fields):
    """What the fields with a name send, as the options write it: one pair per row."""
    return "".join(f"{f.attrs['name']}={f.attrs.get('value', '')}\n" for f in fields if f.attrs.get("name"))


def form_shown(sample, errors):
    nodes = elements(sample.get("listing", ""))
    if not nodes or len(nodes) != 1 or nodes[0].tag != "form":
        errors.append("the question shows one form")
        return None
    form = nodes[0]
    if [b.attrs.get("type") for b in form.find("button")] != ["submit"] or "action" not in form.attrs:
        errors.append("the form has an action and its button")
    if form.attrs.get("method", "get") not in ("get", "post"):
        errors.append("a method that is not get or post")
    return form


def quoted(sample):
    return re.findall(r'"([^"]+)"', sample["problem"])


def level1(sample, errors, options, correct):
    params = sample["params"]
    if params["case"] == "tipo":
        wanted = [t for what, t in TYPE_FOR.items() if f"per {what}." in sample["problem"]]
        if len(wanted) != 1:
            return errors.append("the question does not name one datum of the spec")
        good = []
        for o in options:
            nodes = elements(o.get("listing", ""))
            good.append(bool(nodes) and len(nodes) == 1 and nodes[0].tag == "input" and nodes[0].attrs.get("type") == wanted[0] and bool(nodes[0].attrs.get("name")))
        one_right(errors, options, correct, good)
        # an unknown type makes a text field: it cannot be offered as wrong where a text field is right
        known = set(DOES)
        if wanted[0] == "text" and any((elements(o.get("listing", "")) or [None])[0] is not None and elements(o["listing"])[0].attrs.get("type") not in known for o in options):
            errors.append("a type that does not exist behaves as text, which is the right answer here")
    elif params["case"] == "fa":
        nodes = elements(sample.get("listing", ""))
        if not nodes or len(nodes) != 1 or nodes[0].tag != "input" or nodes[0].attrs.get("type") not in DOES:
            return errors.append("the question shows one input of a known type")
        kind = nodes[0].attrs["type"]
        expect(errors, options, correct, DOES[kind])
        if any(label(o) in TRUE_TOO.get(kind, ()) for o in options):
            errors.append("a wrong option is true of this type too")
        if not all(label(o) in DOES.values() for o in options):
            errors.append("an option is not what a browser does with a type")
    else:
        wanted = [e for key, e in ELEMENT_FOR.items() if key in sample["problem"]]
        if len(wanted) != 1:
            return errors.append("the need does not point at one element")
        expect(errors, options, correct, wanted[0])


def level2(sample, errors, options, correct):
    params = sample["params"]
    if params["case"] == "lega":
        good = []
        for o in options:
            nodes = elements(o.get("listing", ""))
            ok = bool(nodes) and [n.tag for n in nodes] == ["label", "input"]
            good.append(ok and bool(nodes[0].attrs.get("for")) and nodes[0].attrs.get("for") == nodes[1].attrs.get("id"))
        one_right(errors, options, correct, good)
        if quoted(sample) != [params["text"]]:
            errors.append("the question does not name the label")
        return
    nodes = elements(sample.get("listing", ""))
    if not nodes or [n.tag for n in nodes] != ["label", "input", "label", "input"]:
        return errors.append("the question shows two labels, each before its field")
    named = quoted(sample)
    clicked = [n for n in nodes if n.tag == "label" and [n.text] == named]
    if len(clicked) != 1 or clicked[0] is not nodes[2]:
        return errors.append("the question asks about the second label")
    target = clicked[0].attrs.get("for")
    fields = [nodes[1], nodes[3]]
    if len({f.attrs.get("id") for f in fields}) != 2:
        errors.append("two fields with the same id")
    at = [i for i, f in enumerate(fields) if target and f.attrs.get("id") == target]
    right = ["il cursore entra nel primo campo", "il cursore entra nel secondo campo"][at[0]] if at else "non succede niente"
    expect(errors, options, correct, right)


def level3(sample, errors, options, correct):
    form = form_shown(sample, errors)
    if form is None:
        return
    fields = form.find("input")
    without = [f for f in fields if not f.attrs.get("name")]
    if len(fields) != 3 or any("value" not in f.attrs for f in fields):
        errors.append("a form of three fields, each with its starting value")
    if sample["params"]["case"] == "senzaName":
        if len(without) != 1 or not without[0].attrs.get("id"):
            errors.append("one field has an id and no name")
    elif without or sum(1 for f in fields if f.attrs.get("id") and f.attrs["id"] != f.attrs["name"]) != 1:
        errors.append("every field has a name, and one an id that is another word")
    expect(errors, options, correct, pairs_of(fields))
    if not all("listing" in o for o in options):
        errors.append("the options are pairs, one per row")


def level4(sample, errors, options, correct):
    case = sample["params"]["case"]
    if case == "gruppo":
        good = []
        for o in options:
            nodes = elements(o.get("listing", ""))
            good.append(bool(nodes) and len(nodes) == 2 and all(n.tag == "input" and n.attrs.get("type") == "radio" for n in nodes) and bool(nodes[0].attrs.get("name")) and nodes[0].attrs.get("name") == nodes[1].attrs.get("name"))
        return one_right(errors, options, correct, good)
    nodes = elements(sample.get("listing", ""))
    if not nodes:
        return errors.append("the question shows the fields")
    if case == "casella":
        if [n.attrs.get("type") for n in nodes if n.tag == "input"] != ["text", "checkbox"] or len(nodes) != 2:
            return errors.append("a text field and a checkbox")
        ticked = "non spunta" not in sample["problem"]
        if ticked != sample["params"]["ticked"] or " spunta la casella" not in sample["problem"]:
            errors.append("the question does not say whether the box is ticked")
        if f"scritto {nodes[0].attrs.get('value')}." not in sample["problem"]:
            errors.append("the question does not say what the text field holds")
        expect(errors, options, correct, pairs_of(nodes if ticked else nodes[:1]))
    elif case == "pallini":
        radios = [n for n in nodes if n.tag == "input"]
        labels = [n for n in nodes if n.tag == "label"]
        if len(radios) != 3 or len(labels) != 3 or any(r.attrs.get("type") != "radio" for r in radios) or len({r.attrs.get("name") for r in radios}) != 1:
            return errors.append("three radio buttons with the same name, each with its label")
        chosen = [r for r in radios for l in labels if [l.text] == quoted(sample) and l.attrs.get("for") == r.attrs.get("id")]
        if len(chosen) != 1:
            return errors.append("the question does not name the label of one radio button")
        if any(l.text == r.attrs.get("value") for l in labels for r in radios):
            errors.append("a label that reads as a value: the wrong answer with the label would be right")
        expect(errors, options, correct, pairs_of(chosen))
    else:
        if len(nodes) != 1 or nodes[0].tag != "select" or not nodes[0].attrs.get("name"):
            return errors.append("the question shows one select with a name")
        chosen = [o for o in nodes[0].nodes if o.tag == "option" and [o.text] == quoted(sample)]
        if len(chosen) != 1 or len(nodes[0].nodes) != 3:
            return errors.append("the question does not name one of three options")
        expect(errors, options, correct, f"{nodes[0].attrs['name']}={chosen[0].attrs.get('value', chosen[0].text)}\n")


def level5(sample, errors, options, correct):
    case = sample["params"]["case"]
    if case == "metodo":
        wanted = {m for key, m in METHOD_FOR.items() if key in sample["problem"]}
        if len(wanted) != 1:
            return errors.append("the use does not point at one method")
        return expect(errors, options, correct, f'method="{wanted.pop()}"')
    form = form_shown(sample, errors)
    if form is None:
        return
    fields = form.find("input")
    if len(fields) != 2 or any(not f.attrs.get("name") or not f.attrs.get("value") for f in fields):
        errors.append("two fields, each with a name and a value")
    method = form.attrs.get("method", "get")
    data = "&".join(f"{f.attrs['name']}={f.attrs['value']}" for f in fields)
    action = form.attrs["action"]
    if not re.fullmatch(r"[\w=&/?]+", f"{action}?{data}"):
        errors.append("a character that an address would write in another way")
    if case == "indirizzo":
        expect(errors, options, correct, f"{action}?{data}" if method == "get" else action)
    elif case == "corpo":
        if method != "post":
            errors.append("the body is asked about only with post")
        expect(errors, options, correct, data)
    else:
        if ("method" in form.attrs) != (sample["params"]["method"] != "assente"):
            errors.append("params do not say whether the method is written")
        expect(errors, options, correct, "nel corpo della richiesta" if method == "post" else "nell’indirizzo, dopo un punto interrogativo")


def level6(sample, errors, options, correct):
    case = sample["params"]["case"]
    nodes = elements(sample.get("listing", ""))
    if not nodes or len(nodes) != 1 or nodes[0].tag != "input" or not nodes[0].attrs.get("name"):
        return errors.append("the question shows one field with a name")
    field = nodes[0].attrs
    required = "required" in field
    if not sample["problem"].endswith("e preme il bottone di invio. Il modulo parte?"):
        errors.append("the question asks whether the form is sent")
    if case == "obbligatorio":
        if "lascia vuoto" not in sample["problem"]:
            errors.append("the field is left empty")
        return expect(errors, options, correct, "No: il campo è obbligatorio ed è vuoto" if required else YES)
    typed = re.search(r"l’utente scrive (\S+) e preme", sample["problem"])
    if not typed:
        return errors.append("the question does not say what is typed")
    typed = typed.group(1)
    if case == "numero":
        if field.get("type") != "number" or not re.fullmatch(r"\d+", typed):
            return errors.append("a number typed in a number field")
        v, low, high = int(typed), int(field["min"]), int(field["max"])
        if not 1 <= low < high:
            errors.append("min and max out of order")
        right = f"No: {v} è più piccolo di min" if v < low else f"No: {v} è più grande di max" if v > high else YES
    elif case == "email":
        if field.get("type") != "email" or (typed.count("@") and not re.fullmatch(r"[^@\s]+@[^@\s]+\.[a-z]+", typed)):
            return errors.append("an address written whole, or a text without the at sign")
        right = YES if "@" in typed else "No: nel testo manca la chiocciola"
    else:
        if field.get("type") != "text" or "minlength" not in field:
            return errors.append("a text field with minlength")
        right = f"No: {len(typed)} caratteri sono meno di minlength" if len(typed) < int(field["minlength"]) else YES
    expect(errors, options, correct, right)


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errors = common(sample)
    case = sample["params"].get("case")
    choice = choice_of(sample)
    if not choice or "the right option is not among the options" in errors:
        return errors, case
    if sample["answer"]["kind"] != "choice" or "program" in sample["params"]:
        errors.append("every level is a multiple choice about fragments, without programs")
    if sample["level"] not in LEVELS or case not in CASE_RANGES[sample["level"]]:
        return errors + [f"unknown case {case} for level {sample['level']}"], case
    LEVELS[sample["level"]](sample, errors, choice["options"], choice["correct"])
    return errors, case
