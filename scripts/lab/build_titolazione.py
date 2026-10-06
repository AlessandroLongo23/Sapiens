"""
The kit of the acid-base titration, as a file of its own: the page loads a room (the single bench or the whole lab),
takes the copper sulfate kit and the burner out of it and adds this one, in the same coordinates (the station at the
origin, the bench top at Z0).

    blender -b --factory-startup -P scripts/lab/build_titolazione.py -- public/lab/kit/titolazione.glb [preview-dir]

What is new here: the stand with its clamp and white tile, the 25 mL burette with its stopcock, a small funnel in its
mouth, three numbered flasks, the beakers of sodium hydroxide, of the unknown acid and of waste, the dropper bottle of
phenolphthalein and the two stock bottles. The pipette is the room's own model. Goggles and notebook are the room's.

A piece with a `like` extra is held as the piece it names (the grips tuned for that one).
"""
import bpy, os, sys, json, math
from math import pi, radians, sin, cos

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_lab as L  # noqa: E402  (resets the scene and defines the equipment)
import build_banco as B  # noqa: E402  (the palette of the rooms; nothing runs on import)
from build_lab import M, MB, material, empty, formula_data  # noqa: E402
from mathutils import Matrix, Vector  # noqa: E402

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = os.path.abspath(argv[0]) if argv else '/tmp/titolazione.glb'
PREVIEW = os.path.abspath(argv[1]) if len(argv) > 1 else None

scene = bpy.context.scene
TOP = L.Z0

# the stand: where the burette's axis is on its base, and how high the things on it are
BASE_T = 0.012
TILE_T = 0.005
FLASK_H = 0.145
# the burette, from the end of its tip up (metres): the stopcock, the 25 mL mark, the bore
COCK_Z = 0.062
Z25 = 0.105
BORE = 0.006
Z0 = Z25 + 25e-6 / (pi * BORE * BORE)
BURETTE_TOP = Z0 + 0.049
TIP_Z = BASE_T + TILE_T + FLASK_H + 0.012


def palette():
    B.palette()
    M['ptfe'] = material('PTFE', '#f3f4f1', rough=0.45)
    M['cockKey'] = material('CockBlue', '#2f6fb3', rough=0.45)
    M['clampRubber'] = material('ClampRubber', '#b9482f', rough=0.7)
    M['dropper'] = material('DropperBody', '#eef0ea', rough=0.35)
    M['dropperCap'] = material('DropperCap', '#c8433c', rough=0.4)


def stand(loc):
    """Origin on the bench under the burette's axis."""
    root = empty('BuretteStand', loc=loc, label='Sostegno della buretta', pick=0, blob=1)
    back = 0.125  # the rod, behind the axis
    L.box('BuretteStandBase', (0.24, 0.21, BASE_T), (0, 0.05, BASE_T / 2), M['hammer'], root, bevel=0.003)
    L.box('BuretteStandTile', (0.13, 0.13, TILE_T), (0, 0, BASE_T + TILE_T / 2), M['porcelain'], root, bevel=0.0012)
    MB().lathe([(0, BASE_T - 0.002), (0.006, BASE_T - 0.002), (0.006, 0.66), (0.0045, 0.663), (0, 0.663)], 16, mat=Matrix.Translation((0, back, 0))).obj('BuretteStandRod', M['chrome'], root, angle=40)
    # the holder: a boss on the rod, an arm, a white spine behind the burette and two pairs of jaws, one above the
    # zero and one under the 25 mL mark, so that neither hides the scale
    arm_z = TIP_Z + 0.21
    L.box('BuretteStandBoss', (0.026, 0.026, 0.032), (0, back, arm_z), M['iron'], root, bevel=0.003)
    MB().tube([(0.011, back, arm_z), (0.032, back, arm_z)], 0.004, seg=10).obj('BuretteStandScrew', M['chrome'], root)
    MB().tube([(0, back, arm_z), (0, 0.024, arm_z)], 0.0045, seg=10).obj('BuretteStandArm', M['chrome'], root)
    lo, hi = TIP_Z + 0.09, TIP_Z + Z0 + 0.024
    L.box('BuretteStandSpine', (0.016, 0.006, hi - lo + 0.03), (0, 0.021, (lo + hi) / 2), M['white'], root, bevel=0.0015)
    jaws, pads = MB(), MB()
    for z in (lo, hi):
        for s in (-1, 1):
            a0, a1 = radians(90), radians(90 - s * 150)
            pts = [(0.0105 * cos(a0 + (a1 - a0) * i / 10), 0.0105 * sin(a0 + (a1 - a0) * i / 10), z + s * 0.004) for i in range(11)]
            jaws.tube([(s * 0.002, 0.02, z + s * 0.004)] + pts, 0.0019, seg=8)
            pads.tube(pts[5:], 0.0027, seg=8)
    jaws.obj('BuretteStandJaws', M['iron'], root, angle=50)
    pads.obj('BuretteStandPads', M['clampRubber'], root, angle=50)
    return root


def burette(loc):
    """Origin at the end of its tip, axis +Z. The scale faces -Y, towards the student."""
    root = empty('Burette', loc=loc, label='Buretta da 25 mL', pick=1, thin=1)
    ro = BORE + 0.0012
    outer = [(0.0015, 0.0), (0.0021, 0.03), (0.003, 0.048), (0.003, 0.074), (ro, 0.09), (ro, BURETTE_TOP - 0.003), (ro + 0.001, BURETTE_TOP)]
    inner = [(0.0006, 0.0), (0.001, 0.03), (0.0015, 0.048), (0.0015, 0.076), (BORE, 0.091), (BORE, BURETTE_TOP)]
    prof = outer + [(BORE + 0.0006, BURETTE_TOP + 0.0006)] + list(reversed(inner)) + [(0.001, -0.0003)]
    MB().lathe(prof, 28, closed=True).obj('BuretteGlass', M['glass'], root, angle=50)
    # the liquid the page draws: from the stopcock up
    root['inner'] = json.dumps([[0.0014, round(COCK_Z + 0.006, 5)], [0.0014, 0.076], [round(BORE - 0.0001, 5), 0.091], [round(BORE - 0.0001, 5), round(BURETTE_TOP, 5)]])
    root['zero'] = round(Z0, 5)
    root['full'] = round(Z25, 5)
    root['top'] = round(BURETTE_TOP, 5)
    # the scale: a line every 0.1 mL, longer at the halves and at the whole millilitres, which carry the number.
    # It reads downwards, as a burette does: 0 at the top
    marks = MB()
    step = (Z0 - Z25) / 250
    mid = -pi / 2 - 0.32
    long = 0.0068
    for i in range(251):
        z = Z0 - i * step
        w = long if i % 10 == 0 else 0.005 if i % 5 == 0 else 0.0034
        marks.add(L.label_band(ro, z, 0.00026, w, mid + (w - long) / 2 / ro, seg=3, lift=0.00012))
        if i % 10 == 0:
            marks.add(L.on_cylinder(formula_data(str(i // 10), 0.0036), ro, z - 0.0009, mid + long / 2 / ro + 0.003 / ro, lift=0.00012))
    marks.add(L.on_cylinder(formula_data('25 mL', 0.0036), ro, Z0 + 0.03, -pi / 2, lift=0.00012))
    marks.add(L.on_cylinder(formula_data('1/10', 0.0028), ro, Z0 + 0.022, -pi / 2, lift=0.00012))
    marks.obj('BuretteMarks', M['printBlue'], root, smooth=False, recalc=False)
    # the stopcock: a glass barrel across the tube, and the key that turns in it
    across = Matrix.Translation((0, 0, COCK_Z)) @ Matrix.Rotation(pi / 2, 4, 'X')
    MB().lathe([(0, -0.0115), (0.0058, -0.0115), (0.0052, 0.0115), (0, 0.0115)], 24, mat=across).obj('BuretteBarrel', M['glass'], root, angle=50)
    cock = empty('BuretteCock', loc=(0, 0, COCK_Z), parent=root, label='Rubinetto della buretta', pick=1, thin=1)
    key = MB()
    turn = Matrix.Rotation(pi / 2, 4, 'X')
    key.lathe([(0, -0.0145), (0.0034, -0.0145), (0.0041, 0.016), (0.0052, 0.0165), (0.0052, 0.0195), (0, 0.0195)], 20, mat=turn)
    key.obj('BuretteCockPlug', M['ptfe'], cock, angle=45)
    # the handle, across the tube when it is closed
    MB().box((0.034, 0.0055, 0.009), (0, -0.0222, 0)).obj('BuretteCockHandle', M['cockKey'], cock, smooth=False, bevel=0.0015)
    MB().lathe([(0, 0.0145), (0.0046, 0.0145), (0.0046, 0.0175), (0, 0.0175)], 16, mat=turn).obj('BuretteCockNut', M['cockKey'], cock, angle=45)
    return root


def funnel(loc):
    """A small funnel for the burette. Origin at the apex of the cone, where the stem starts."""
    root = empty('Funnel', loc=loc, label='Imbuto della buretta', pick=1, thin=1)
    top_r, half = 0.021, radians(30)
    h = top_r / math.tan(half)
    outer = [(0.003, -0.036), (0.0033, -0.004), (0.0042, 0.0), (top_r, h), (top_r + 0.0012, h + 0.0016)]
    inner = [(0.0021, -0.036), (0.0024, -0.004), (0.003, 0.0015), (top_r - 0.0012, h + 0.0005)]
    prof = [(0.0021, -0.0368), (0.003, -0.0368)] + outer[1:] + [(top_r + 0.0004, h + 0.0028)] + list(reversed(inner))
    MB().lathe(prof, 40, closed=True).obj('FunnelGlass', M['glass'], root, angle=40)
    root['coneHeight'] = h
    root['inner'] = json.dumps([[0.0021, -0.036], [0.0024, -0.004], [0.003, 0.0015], [round(top_r - 0.0014, 5), round(h, 5)]])
    return root


def flask(n, loc):
    """The room's 250 mL conical flask, with a number on it."""
    name = 'Flask%d' % n
    root = empty(name, loc=loc, label='Beuta %d' % n, pick=1, like='ConicalFlask', flask=n)
    f = 0.006
    R = 0.0425
    outer = [(0, 0)] + L.arc(R - f, f, f, -pi / 2, 0, 5)[1:] + [(R, 0.012), (0.0205, 0.104), (0.0182, 0.112), (0.0178, 0.136), (0.0198, 0.138), (0.0205, 0.142), (0.0192, 0.145)]
    prof, inner = L.wall(outer, 0.0014)
    MB().lathe(prof, 56).obj(name + 'Glass', M['glass'], root, angle=45)
    root['inner'] = json.dumps([[round(max(r - 0.0002, 0), 5), round(z, 5)] for r, z in inner])
    root['neckTop'] = 0.145
    root['neckInner'] = 0.0164
    marks = MB()
    cone = lambda z: R - (R - 0.0205) * (z - 0.012) / (0.104 - 0.012)
    for ml in (50, 100, 150, 200):
        z = L.height_for(inner, ml * 1e-6)
        marks.add(L.label_band(cone(z) + 0.0001, z, 0.0007, 0.01, ang=-pi / 2 - 0.5, seg=4, lift=0.0004))
        marks.add(L.on_cylinder(formula_data(str(ml), 0.004), cone(z) + 0.0001, z + 0.0035, -pi / 2 - 0.5, lift=0.0004))
    marks.obj(name + 'Marks', M['printWhite'], root, smooth=False, recalc=False)
    # the number, on a frosted patch as flasks have for writing on
    z = 0.082
    MB().add(L.label_band(cone(z), z, 0.02, 0.022, ang=-pi / 2 + 0.25, seg=8, lift=0.0003)).obj(name + 'Patch', M['label'], root, smooth=False, recalc=False)
    MB().add(L.on_cylinder(formula_data(str(n), 0.014), cone(z), z - 0.0068, -pi / 2 + 0.25, lift=0.0007)).obj(name + 'Number', M['printBlue'], root, smooth=False, recalc=False)
    return root


def indicator(loc):
    """A squeeze bottle with a dropper tip. Origin under its base, the tip at `tip` on its axis."""
    root = empty('Indicator', loc=loc, label='Fenolftaleina, contagocce', pick=1, tip=0.08)
    MB().lathe([(0, 0), (0.0128, 0), (0.014, 0.002), (0.014, 0.041), (0.0115, 0.048), (0.0075, 0.051), (0.0075, 0.055), (0, 0.055)], 32).obj('IndicatorBody', M['dropper'], root, angle=40)
    MB().lathe([(0, 0.0535), (0.0088, 0.0535), (0.0088, 0.06), (0.0045, 0.064), (0.0032, 0.068), (0.0012, 0.08), (0, 0.08)], 24).obj('IndicatorTip', M['dropperCap'], root, angle=40)
    L.label(root, 0.0142, 0.022, [('fenolftaleina', 0.0036), ('in etanolo', 0.0026)], w=0.04, h=0.019, size=0.0036)
    return root


def build():
    palette()
    stand((0, 0, TOP))
    burette((0, 0, TOP + TIP_Z))
    # in the burette's mouth, where its cone meets the rim
    funnel((0, 0, TOP + TIP_Z + BURETTE_TOP - 0.0039))
    for n, (x, y) in enumerate(((0.26, -0.13), (0.38, -0.03), (0.5, -0.13)), 1):
        flask(n, (x, y, TOP))
    b = L.beaker('NaOHBeaker', 0.026, 0.072, label_text=[('NaOH', 0.0075), ('0,100 M', 0.0055)], loc=(-0.24, 0.07, TOP), lbl='Becher con NaOH 0,100 M', fill=100, liquid='')
    b['like'] = 'Beaker'
    b = L.beaker('SampleBeaker', 0.026, 0.072, label_text=[('HCl', 0.0085), ('? mol/L', 0.0055)], loc=(-0.3, -0.1, TOP), lbl='Becher con il campione di HCl', fill=100, liquid='')
    b['like'] = 'Beaker'
    b = L.beaker('WasteBeaker', 0.021, 0.058, label_text=[('scarti', 0.0065)], loc=(0, 0, TOP + BASE_T + TILE_T), lbl='Becher degli scarti', nominal=50, grad_ang=-pi / 2 + 1.25)
    b['like'] = 'AcidBeaker'
    L.reagent_bottle('NaOHBottle', (-0.4, 0.26, TOP), [('NaOH', 0.012), ('0,100 mol/L', 0.0062)], color='#e9f0f3', fill=320, lbl='Bottiglia di NaOH 0,100 M')
    L.reagent_bottle('SampleBottle', (-0.53, 0.2, TOP), [('HCl', 0.013), ('campione', 0.0065), ('incognito', 0.0065)], color='#e9f0f3', fill=280, lbl='Bottiglia del campione di HCl')
    indicator((0.12, -0.19, TOP))
    tilt = math.asin((0.024 - 0.0012) / 0.54)
    # lying in front of the flasks, its tip towards the middle: the classroom's bench ends 65 cm to the left
    L.pipette((0.2, -0.27, TOP + 0.0012), (0, pi / 2 - tilt, 0))


def main():
    build()
    for ob in scene.objects:
        if ob.type == 'MESH' and ob.data.name != ob.name:
            ob.data.name = ob.name
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=OUT, export_format='GLB', export_extras=True, export_apply=True, export_yup=True,
        export_morph=False, export_animations=False, export_cameras=False, export_lights=False,
        export_texcoords=True, export_normals=True,
    )
    print('EXPORTED', OUT, os.path.getsize(OUT))
    if not PREVIEW:
        return
    # previews: the kit on a dark top, as on the bench
    os.makedirs(PREVIEW, exist_ok=True)
    MB().box((1.7, 0.9, 0.02), (-0.05, 0.02, TOP - 0.01)).obj('PreviewTop', M['epoxy'], None, smooth=False)
    MB().box((1.7, 0.02, 1.2), (-0.05, 0.47, TOP + 0.6)).obj('PreviewWall', M['wallUpper'], None, smooth=False)
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = 48
    scene.render.resolution_x, scene.render.resolution_y = 1280, 800
    world = bpy.data.worlds.new('W')
    world.use_nodes = True
    world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.75, 0.82, 0.9, 1)
    world.node_tree.nodes['Background'].inputs['Strength'].default_value = 1.1
    scene.world = world
    sun = bpy.data.objects.new('Sun', bpy.data.lights.new('Sun', 'SUN'))
    sun.data.energy = 3.0
    sun.rotation_euler = (radians(48), radians(8), radians(-35))
    scene.collection.objects.link(sun)
    cam = bpy.data.objects.new('Cam', bpy.data.cameras.new('Cam'))
    scene.collection.objects.link(cam)
    scene.camera = cam
    cam.data.clip_start = 0.01
    zc = TOP + TIP_Z
    for name, eye, target, lens in (('kit', (0.0, -1.15, 1.62), (0.0, 0.0, 1.12), 28), ('buretta', (0.12, -0.42, zc + 0.22), (0, 0, zc + 0.19), 50),
                                    ('scala', (0.03, -0.12, zc + Z0 - 0.02), (0, 0, zc + Z0 - 0.025), 60), ('rubinetto', (0.08, -0.16, zc + 0.09), (0, 0, zc + 0.05), 60),
                                    ('beute', (0.38, -0.5, 1.12), (0.38, -0.08, 0.96), 40), ('sinistra', (-0.3, -0.55, 1.15), (-0.32, 0.02, 0.95), 35)):
        cam.location = eye
        cam.rotation_euler = (Vector(target) - Vector(eye)).to_track_quat('-Z', 'Y').to_euler()
        cam.data.lens = lens
        scene.render.filepath = os.path.join(PREVIEW, name + '.png')
        bpy.ops.render.render(write_still=True)


if __name__ == '__main__':
    main()
