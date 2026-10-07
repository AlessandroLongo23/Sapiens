"""Checker for inf-xml-json (specs/exercises/inf-xml-json.md): structured data in XML and in JSON.

Written from the spec. No level has a program: the fragments are read here with Python's own parsers
(xml.etree.ElementTree and json), and the right answer is worked out again from what they hold.
- level 1: the question is answered on the tree of the document shown;
- level 2: of the four fragments only the right one is well formed;
- level 3: the question is answered on the value the JSON shown holds;
- level 4: of the four fragments only the right one is valid JSON;
- level 5: the four fragments are all written without mistakes, and only the right one holds the data shown.
"""
import json
import xml.etree.ElementTree as ET

from checkers._inf_codice import choice_of, common

CASE_RANGES = {
    1: {k: (0.18, 0.32) for k in ("figli", "attributo", "radice", "quanti")},
    2: {k: (0.25, 0.42) for k in ("gita", "spesa", "orario")},
    3: {k: (0.18, 0.32) for k in ("valore", "quanti", "coppie", "tipo")},
    4: {k: (0.25, 0.42) for k in ("studente", "brano", "gita")},
    5: {k: (0.40, 0.60) for k in ("xml-json", "json-xml")},
}


def tree(text):
    """The root of an XML fragment, or None when it is not well formed."""
    try:
        return ET.fromstring(text)
    except ET.ParseError:
        return None


def value(text):
    """What a JSON fragment holds, or the error it stops on. Pairs with the same name are told apart: the last wins."""
    try:
        return json.loads(text), None
    except json.JSONDecodeError as e:
        return None, e


def number(text):
    return int(text) if text.strip().isdigit() else text.strip()


def data_of_xml(root):
    """A datum of level 5 read from XML: an element with children is the list of their numbers, a leaf is its text."""
    return {child.tag: [number(x.text or "") for x in child] if len(child) else (child.text or "").strip() for child in root}


def kind_of(v):
    if isinstance(v, bool):
        return "logico"
    if isinstance(v, str):
        return "testo"
    if isinstance(v, (int, float)):
        return "numero"
    return "array" if isinstance(v, list) else "oggetto"


def check(sample):
    errors = common(sample)
    params = sample["params"]
    level = sample["level"]
    case = params.get("case")
    choice = choice_of(sample)
    if not choice:
        return errors, case
    options = choice["options"]
    correct = choice["correct"]
    right = options[correct]
    if "program" in params or "code" in sample or any("code" in o for o in options):
        errors.append("a level of fragments has no program")

    if params.get("shown") != sample.get("listing") or params.get("right") != sample.get("solutionListing"):
        errors.append("params does not carry the fragment shown and the right one")

    def answer_is(wanted):
        if right["values"] != [str(wanted)]:
            errors.append(f"the right option is {right['values']}, and from the fragment it is {wanted}")

    if level == 1:
        root = tree(sample.get("listing", ""))
        if root is None:
            return errors + ["the document shown is not well formed"], case
        if len(sample["listing"].rstrip("\n").split("\n")) > 17 or not 2 <= len(root) <= 3 or len(root.attrib) != 1:
            errors.append("a root with one attribute and two or three items, in at most 17 rows")
        ask = params["ask"]
        if ask == "root":
            answer_is(root.tag)
        elif ask == "attribute":
            answer_is(root.attrib[params["attribute"]])
            if params["attribute"] not in sample["problem"]:
                errors.append("the question does not name the attribute")
        elif ask == "count":
            answer_is(len(list(root.iter(params["tag"]))))
            if params["tag"] not in sample["problem"]:
                errors.append("the question does not name the element")
        elif params["of"] is None:
            answer_is(len(root))
            if root.tag not in sample["problem"]:
                errors.append("the question does not name the root")
        else:
            items = [item for item in root if (item[0].text or "") == params["of"]]
            if len(items) != 1 or params["of"] not in sample["problem"]:
                errors.append("the item asked for is not one item of the document")
            else:
                answer_is(len(items[0]))

    if level in (2, 4):
        if not all("listing" in o for o in options):
            return errors + ["the level offers fragments"], case
        if level == 2:
            good = [tree(o["listing"]) is not None for o in options]
        else:
            good = [value(o["listing"])[1] is None for o in options]
        if good != [i == correct for i in range(len(options))]:
            errors.append(f"the right fragment is not the only one written correctly: {good}")
        if sample.get("solutionListing") != right["listing"]:
            errors.append("the fragment of the solution is not the right option")
        if len(sample["steps"]) != 3:
            errors.append("one step for each wrong fragment")
        if level == 2 and tree(right["listing"]) is not None and tree(right["listing"]).tag != case:
            errors.append("the case is not the root of the right fragment")

    if level == 3:
        data, why = value(sample.get("listing", ""))
        if why is not None or not isinstance(data, dict):
            return errors + ["the fragment shown is not a JSON object"], case
        if not 4 <= len(data) <= 5 or not isinstance(data.get("voti"), list):
            errors.append("an object of four or five pairs with the array voti")
        ask = params["ask"]
        if ask == "pairs":
            answer_is(len(data))
        elif ask == "length":
            answer_is(len(data[params["path"][0]]))
        elif ask == "type":
            name = params["path"][0]
            answer_is(kind_of(data[name]))
            if name not in sample["problem"]:
                errors.append("the question does not name the pair")
        else:
            name, key = params["path"]
            got = data[name][key]
            answer_is(str(got).lower() if isinstance(got, bool) else got)
            path = f'dati["{name}"][{key}]' if isinstance(key, int) else f'dati["{name}"]["{key}"]'
            if path not in sample["problem"]:
                errors.append("the question does not write the path")
            inside = data[name] if isinstance(data[name], list) else list(data[name].values())
            if len({str(x) for x in inside}) != len(inside):
                errors.append("two values of the array or of the object are the same")

    if level == 5:
        shown = sample.get("listing", "")
        to_json = case == "xml-json"
        if to_json:
            root = tree(shown)
            wanted = None if root is None else data_of_xml(root)
        else:
            wanted, _why = value(shown)
        if not isinstance(wanted, dict) or len(wanted) != 3 or not isinstance(wanted.get(params["list"]), list):
            return errors + ["the datum shown is not two values and a list"], case
        held = []
        for i, o in enumerate(options):
            if "listing" not in o:
                errors.append(f"option {i} is not a fragment")
                held.append(None)
            elif to_json:
                got, why = value(o["listing"])
                if why is not None:
                    errors.append(f"option {i} is not valid JSON")
                held.append(got)
            else:
                root = tree(o["listing"])
                if root is None:
                    errors.append(f"option {i} is not well formed")
                held.append(None if root is None else data_of_xml(root))
        if [h == wanted for h in held] != [i == correct for i in range(len(options))]:
            errors.append(f"the right fragment is not the only one with the data shown: {[h == wanted for h in held]}")
        if sample.get("solutionListing") != right.get("listing"):
            errors.append("the fragment of the solution is not the right option")
        if "tutti scritti senza errori" not in sample["problem"]:
            errors.append("the question does not say that the fragments are written correctly")
    return errors, case
