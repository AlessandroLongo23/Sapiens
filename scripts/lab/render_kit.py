"""
The pictures of the instruments and substances in the lab notebook's first pages: each piece of a kit alone on the
bench, as a photo, from the same models the game uses.

    blender -b --factory-startup -P scripts/lab/render_kit.py -- <solfato|fiamma|titolazione> <out dir>

One PNG per piece (480 by 360, Cycles), turned into the WebP the page loads (public/lab/strumenti/).
"""
import bpy, os, sys, math
from math import pi, radians

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
WHICH = argv[0] if argv else 'solfato'
OUT = os.path.abspath(argv[1]) if len(argv) > 1 else '/tmp/kit'
# the builders read the arguments too: nothing for them to export
sys.argv = sys.argv[:sys.argv.index('--') + 1] if '--' in sys.argv else sys.argv

import build_lab as L  # noqa: E402
import build_banco as B  # noqa: E402
from mathutils import Vector  # noqa: E402

scene = bpy.context.scene
TOP = L.Z0

# picture name: the roots drawn in it
if WHICH == 'fiamma':
    import build_fiamma as K  # noqa: E402
    K.build()
    # a sheet of paper under the cobalt glass: on the dark bench its blue does not show
    L.MB().box((0.11, 0.085, 0.0004), (-0.3, -0.29, TOP + 0.0002)).obj('ShotPaper', L.M['label'], None, smooth=False)
    # the salts: four of the watch glasses on the tray, the copper one among them, from close by
    SHOTS = {'ansa': ['WireLoop'], 'portacampioni': ['SampleTray'], 'vetro-cobalto': (['CobaltGlass', 'ShotPaper'], ['CobaltGlass']), 'becher-hcl': ['AcidBeaker'],
             'sali': (['SampleTray'], ['SampleLi', 'SampleNa', 'SampleBa', 'SampleCu'])}
elif WHICH == 'titolazione':
    import build_titolazione as K  # noqa: E402
    K.build()
    SHOTS = {'buretta': ['Burette', 'BuretteStand', 'Funnel'], 'imbuto-buretta': ['Funnel'], 'beuta-numerata': ['Flask1'], 'becher-naoh': ['NaOHBeaker'], 'becher-campione': ['SampleBeaker'],
             'becher-scarti': ['WasteBeaker'], 'contagocce': ['Indicator']}
else:
    B.palette()
    b = (0.0, 0.02, TOP + 0.006)
    L.bunsen(b, radians(52))
    L.tripod((0.6, 0.02, TOP + 0.006))
    L.beaker('Beaker', 0.026, 0.072, loc=(-0.2, -0.04, TOP), lbl='Becher da 100 mL')
    L.beaker('AcidBeaker', 0.021, 0.058, label_text=[('H_2SO_4', 0.0075), ('1 M', 0.006)], loc=(-0.38, 0.09, TOP), lbl='Becher', nominal=50, grad_ang=-pi / 2 + 1.25)
    tilt = math.asin((0.024 - 0.0012) / 0.54)
    L.pipette((-0.1, -0.25, TOP + 0.0012), (0, -(pi / 2 - tilt), 0))
    L.goggles((-0.74, -0.1, TOP))
    L.cuo_jar((0.3, 0.14, TOP))
    L.spatula((0.24, 0.04, TOP + 0.004), (0, pi / 2, radians(4)))
    L.glass_rod((0.2, -0.08, TOP + 0.003), (0, pi / 2, radians(-3)))
    L.thermometer((0.16, -0.2, TOP + 0.0042), (0, pi / 2, radians(2)))
    L.lighter((0.03, -0.32, TOP + 0.011), (0, pi / 2, 0))
    L.conical_flask((0.98, 0.1, TOP))
    L.funnel((1.3, 0.1, TOP + 0.05))
    L.filter_paper((0.56, -0.15, TOP))
    L.evap_dish((0.8, -0.08, TOP))
    # the product: a second dish with the blue crystals on its bottom
    L.evap_dish((1.6, -0.08, TOP))
    bpy.data.objects['EvapDish.001'].name = 'CrystalDish'
    import random
    from mathutils import Matrix
    rnd = random.Random(4)
    cr = L.MB()
    for _ in range(46):
        a, rr = rnd.uniform(0, 2 * pi), 0.03 * rnd.random() ** 0.5
        k = rnd.uniform(0.004, 0.009)
        shear = Matrix(((1, 0.45, 0.2, 0), (0, 1, 0, 0), (0.18, 0, 1, 0), (0, 0, 0, 1)))
        m = Matrix.Translation((1.6 + rr * math.cos(a), -0.08 + rr * math.sin(a), TOP + 0.0075 + rr * rr * 6)) @ Matrix.Rotation(rnd.uniform(0, pi), 4, 'Z') @ Matrix.Rotation(rnd.uniform(-0.4, 0.4), 4, 'X') @ shear
        cr.box((k, k * 0.62, k * 0.42), mat=m)
    cr.obj('Crystals', L.M['crystal'], None, smooth=False)
    SHOTS = {'becco-bunsen': ['Bunsen'], 'treppiede': ['Tripod'], 'becher': ['Beaker'], 'becher-acido': ['AcidBeaker'], 'pipetta': ['Pipette'], 'occhiali': ['Goggles'], 'ossido-rame': ['CuOJar'],
             'spatola': ['Spatula'], 'bacchetta': ['GlassRod'], 'termometro': ['Thermometer'], 'accendigas': ['Lighter'], 'beuta': ['ConicalFlask'], 'imbuto': ['Funnel'],
             'carta-filtro': ['FilterPaper'], 'capsula': ['EvapDish'], 'cristalli': (['CrystalDish', 'Crystals'], ['Crystals'])}


def family(root):
    out = [root]
    for c in root.children:
        out += family(c)
    return out


def main():
    os.makedirs(OUT, exist_ok=True)
    L.M.get('epoxy') or B.palette()
    # the bench and the wall behind it, as in the rooms
    L.MB().box((12, 12, 0.02), (0, 0, TOP - 0.0101)).obj('ShotBench', L.M['epoxy'], None, smooth=False)
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = 72
    scene.cycles.use_denoising = True
    scene.render.film_transparent = False
    scene.render.resolution_x, scene.render.resolution_y = 480, 360
    scene.render.image_settings.file_format = 'PNG'
    scene.view_settings.view_transform = 'Standard'
    world = bpy.data.worlds.new('W')
    world.use_nodes = True
    world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.78, 0.84, 0.88, 1)
    world.node_tree.nodes['Background'].inputs['Strength'].default_value = 1.2
    scene.world = world
    sun = bpy.data.objects.new('Sun', bpy.data.lights.new('Sun', 'SUN'))
    sun.data.energy = 2.8
    sun.data.angle = radians(14)
    sun.rotation_euler = (radians(50), radians(6), radians(-38))
    scene.collection.objects.link(sun)
    cam = bpy.data.objects.new('Cam', bpy.data.cameras.new('Cam'))
    scene.collection.objects.link(cam)
    scene.camera = cam
    cam.data.clip_start = 0.005
    cam.data.lens = 70
    bpy.context.view_layer.update()
    bench = bpy.data.objects['ShotBench']
    everything = [o for o in scene.objects if o.type == 'MESH' and o is not bench]
    for name, spec in SHOTS.items():
        roots, framed = spec if isinstance(spec, tuple) else (spec, spec)
        shown, target = set(), set()
        for r in roots:
            shown.update(family(bpy.data.objects[r]))
        for r in framed:
            target.update(family(bpy.data.objects[r]))
        lo, hi = Vector((9, 9, 9)), Vector((-9, -9, -9))
        for o in everything:
            o.hide_render = o not in shown
            if o in target:
                for c in o.bound_box:
                    p = o.matrix_world @ Vector(c)
                    lo = Vector((min(lo.x, p.x), min(lo.y, p.y), min(lo.z, p.z)))
                    hi = Vector((max(hi.x, p.x), max(hi.y, p.y), max(hi.z, p.z)))
        mid = (lo + hi) / 2
        size = (hi - lo)
        # always from above enough for the bench to fill the picture; a flat thing from higher still
        flat = size.z < 0.4 * max(size.x, size.y)
        el, az = (radians(56), radians(-16)) if flat else (radians(30), radians(-22))
        d = Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)))
        radius = size.length / 2
        # the narrow side of a 4:3 frame decides
        half = math.atan(13.5 / cam.data.lens)
        cam.location = mid + d * (radius / math.tan(half) * 1.0 + radius * 0.3)
        cam.rotation_euler = (mid - cam.location).to_track_quat('-Z', 'Y').to_euler()
        scene.render.filepath = os.path.join(OUT, name + '.png')
        bpy.ops.render.render(write_still=True)
        print('SHOT', name)


main()
