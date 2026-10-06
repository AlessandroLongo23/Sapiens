"""
The kit of the flame tests (/laboratorio/chimica/saggi-alla-fiamma), exported by itself:

    blender -b --factory-startup -P scripts/lab/build_fiamma.py -- public/lab/kit/saggi-alla-fiamma.glb [preview-dir]

Unlike the copper sulfate kit, which is part of each room's GLB, this one is a file of its own: the page loads a room,
takes out the copper sulfate pieces it does not need and adds these (scene.ts, load). The coordinates are those of
the student's place, the same in the single bench (build_banco.py) and in the classroom (build_aula.py): the burner
at the origin, the bench's front edge at y = -0.38, a half desk 1.3 m wide. No light is baked.

New here: the nichrome wire loop, the sample tray with its ten watch glasses of salts, the answer cards of the two
unknown samples, the cobalt glass. The burner, the gas tap, the lighter, the goggles and the notebook are the room's.
"""
import bpy, os, sys, json, math, random
from math import pi, radians, sin, cos, asin

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_lab as L  # noqa: E402  (resets the scene and defines the equipment)
import build_banco as B  # noqa: E402  (the palette of the rooms; nothing runs on import)
from build_lab import M, MB, material, empty, formula_data  # noqa: E402
from mathutils import Matrix, Vector  # noqa: E402

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = os.path.abspath(argv[0]) if argv else '/tmp/saggi-alla-fiamma.glb'
PREVIEW = os.path.abspath(argv[1]) if len(argv) > 1 else None

scene = bpy.context.scene
rnd = random.Random(11)
TOP = L.Z0

# id, the tag on the tray, the name under the crosshair, the salt's colour
SAMPLES = [
    ('Li', 'LiCl', 'Cloruro di litio, LiCl', 'salt'),
    ('Na', 'NaCl', 'Cloruro di sodio, NaCl', 'salt'),
    ('K', 'KCl', 'Cloruro di potassio, KCl', 'salt'),
    ('Ca', 'CaCl_2', 'Cloruro di calcio, CaCl₂', 'salt'),
    ('Sr', 'SrCl_2', 'Cloruro di stronzio, SrCl₂', 'salt'),
    ('Ba', 'BaCl_2', 'Cloruro di bario, BaCl₂', 'salt'),
    ('Cu', 'CuCl_2', 'Cloruro di rame(II), CuCl₂', 'saltCu'),
    ('Mix', 'NaCl + KCl', 'Miscela di NaCl e KCl', 'salt'),
    ('X', 'X', 'Campione X', 'salt'),
    ('Y', 'Y', 'Campione Y', 'salt'),
]
PITCH = 0.072
ROWS = (-0.045, 0.052)  # the front row and the back row, in the tray's frame
TRAY = (0.38, 0.215, 0.014)


def palette():
    B.palette()
    M['nichrome'] = material('Nichrome', '#8f9297', metallic=1.0, rough=0.42)
    # the end of the wire glows in the flame: the page drives the emission
    M['loopTip'] = material('LoopHot', '#84878c', metallic=0.9, rough=0.5, emission='#ff5a14', estr=0.0)
    M['salt'] = material('SaltWhite', '#f6f6f1', rough=0.85)
    M['saltCu'] = material('SaltCopper', '#3aa9a2', rough=0.8)
    M['cobalt'] = material('GlassCobalt', '#1b2a9c', rough=0.05, transmission=1.0, ior=1.5, double=True)
    M['trayPad'] = material('TrayPad', '#3d4d57', rough=0.95)
    M['card'] = material('AnswerCard', '#fbf8ef', rough=0.85)
    M['handle'] = material('LoopHandle', '#b5895a', rough=0.6)


def wire_loop(loc, rot):
    """Along +Z from the loop (its far end at the origin) to the end of the handle."""
    # no soft shadow under it: the page sizes that from the length, and a wire has next to none
    root = empty('WireLoop', loc=loc, rot=rot, label='Ansa al nichel-cromo', pick=1, noBlob=1)
    r, w = 0.0032, 0.0008
    ring = [(r * sin(a), 0, r - r * cos(a)) for a in [2 * pi * i / 20 for i in range(21)]]
    tip = MB()
    tip.tube(ring, w, seg=8, caps=False)
    tip.tube([(0, 0, 2 * r - 0.0003), (0, 0, 0.03)], w, seg=8)
    tip.obj('WireLoopTip', M['loopTip'], root, angle=60)
    MB().tube([(0, 0, 0.03), (0, 0, 0.072)], w, seg=8).obj('WireLoopWire', M['nichrome'], root, angle=60)
    MB().lathe([(0, 0.066), (0.0016, 0.066), (0.003, 0.07), (0.003, 0.082), (0, 0.082)], 16).obj('WireLoopFerrule', M['steel'], root, angle=40)
    R = 0.0042
    MB().lathe([(0, 0.08), (R * 0.8, 0.08), (R, 0.084), (R, 0.196)] + [(R * cos(a), 0.196 + R * sin(a)) for a in [pi / 2 * i / 4 for i in range(1, 5)]], 20).obj('WireLoopHandle', M['handle'], root, angle=40)
    # the salt it has picked up: a small crust on the loop
    crust = MB()
    for _ in range(9):
        a = rnd.uniform(0, 2 * pi)
        s = rnd.uniform(0.0009, 0.0015)
        c = Vector((r * 0.75 * sin(a), rnd.uniform(-0.0006, 0.0006), r - r * 0.75 * cos(a)))
        crust.box((s, s, s), mat=Matrix.Translation(c) @ Matrix.Rotation(rnd.uniform(0, pi), 4, Vector((rnd.random(), rnd.random(), rnd.random() + 0.1)).normalized()))
    p = crust.obj('WireLoopSalt', M['salt'], root, smooth=False)
    p['startHidden'] = 1
    return root


def watch_glass(name, loc, parent, salt, lbl, sample):
    """A watch glass with a small heap of salt. Origin at the middle of its underside."""
    root = empty(name, loc=loc, parent=parent, label=lbl, pick=1, sample=sample)
    rim, sag = 0.027, 0.0075
    Rs = (rim * rim + sag * sag) / (2 * sag)
    a1 = asin(rim / Rs)
    outer = [(Rs * sin(a1 * i / 10), Rs * (1 - cos(a1 * i / 10))) for i in range(11)]
    prof, _ = L.wall(outer, 0.0012)
    # the thicker glass of lenses: seen from above, a clear thin one does not show at all
    MB().lathe(prof, 40).obj(name + 'Glass', M['lens'], root, angle=50)
    heap = MB()
    z0 = 0.0012
    rings, seg = 4, 12
    v = [(0, 0, z0 + 0.0052)]
    for i in range(1, rings + 1):
        rr = 0.0125 * i / rings
        for k in range(seg):
            a = 2 * pi * k / seg
            lift = Rs * (1 - cos(asin(rr / Rs)))
            z = z0 + lift + 0.0052 * (1 - (i / rings) ** 1.5) + (rnd.uniform(-0.0006, 0.0006) if i < rings else 0)
            v.append((rr * cos(a), rr * sin(a), z))
    f = [(0, 1 + k, 1 + (k + 1) % seg) for k in range(seg)]
    for i in range(rings - 1):
        for k in range(seg):
            a, b = 1 + i * seg + k, 1 + i * seg + (k + 1) % seg
            f.append((a, a + seg, b + seg, b))
    heap.add((v, f))
    # loose crystals on and round the heap
    for _ in range(16):
        a = rnd.uniform(0, 2 * pi)
        rr = (rnd.random() ** 0.6) * 0.015
        s = rnd.uniform(0.0011, 0.002)
        z = z0 + Rs * (1 - cos(asin(rr / Rs))) + 0.0052 * max(0, 1 - (rr / 0.0125) ** 1.5) + s * 0.3
        heap.box((s, s * 0.9, s * 0.8), mat=Matrix.Translation((rr * cos(a), rr * sin(a), z)) @ Matrix.Rotation(rnd.uniform(0, pi), 4, Vector((rnd.random(), rnd.random(), rnd.random() + 0.1)).normalized()))
    heap.obj(name + 'Salt', M[salt], root, smooth=False, recalc=True)
    return root


def answer_card(name, loc, parent, lbl, sample):
    """A card standing behind an unknown sample, leaning back: the page writes on its face (UV 0..1)."""
    root = empty(name, loc=loc, rot=(radians(-28), 0, 0), parent=parent, label=lbl, pick=1, sample=sample)
    w, h, t = 0.066, 0.046, 0.0014
    MB().box((w, t, h), (0, 0, h / 2)).obj(name + 'Board', M['card'], root, smooth=False)
    # a foot, so it is seen to stand
    MB().box((w * 0.5, 0.02, 0.0012), (0, 0.009, 0.0006), mat=Matrix.Rotation(radians(28), 4, 'X')).obj(name + 'Foot', M['card'], root, smooth=False)
    y = -t / 2 - 0.0003
    me = bpy.data.meshes.new(name + 'Face')
    me.from_pydata([(-w / 2 + 0.001, y, 0.001), (w / 2 - 0.001, y, 0.001), (w / 2 - 0.001, y, h - 0.001), (-w / 2 + 0.001, y, h - 0.001)], [], [(0, 1, 2, 3)])
    uv = me.uv_layers.new(name='UVMap')
    for loop, co in zip(me.loops, ((0, 0), (1, 0), (1, 1), (0, 1))):
        uv.data[loop.index].uv = co
    me.materials.append(M['card'])
    ob = bpy.data.objects.new(name + 'Face', me)
    L.link(ob, root)
    return root


def sample_tray(loc):
    root = empty('SampleTray', loc=loc, label='Portacampioni', pick=0, blob=1)
    W, D, T = TRAY
    MB().box((W, D, T), (0, 0, T / 2)).obj('SampleTrayWood', M['wood'], root, smooth=False, bevel=0.003)
    pads, tags, text = MB(), MB(), MB()
    for n, (sid, tag, lbl, salt) in enumerate(SAMPLES):
        row, i = divmod(n, 5)
        x, y = (i - 2) * PITCH, ROWS[row]
        # a dark disc under each glass, smaller than it, as the black paper put under white crystals to see them
        pads.lathe([(0, T), (0.0175, T), (0.0175, T + 0.0006), (0, T + 0.0006)], 32, mat=Matrix.Translation((x, y, 0)))
        watch_glass('Sample' + sid, (x, y, T + 0.0006), root, salt, lbl, sid)
        ty = y - 0.0455 if row == 0 else y - 0.0485
        tags.box((0.064, 0.0195, 0.0008), (x, ty, T + 0.0004))
        size = 0.0088 if len(tag) > 7 else 0.013 if len(tag) == 1 else 0.0108
        text.add(formula_data(tag, size), Matrix.Translation((x, ty, T + 0.0011)))
        if sid in ('X', 'Y'):
            answer_card('Answer' + sid, (x, y + 0.04, T), root, 'Cartellino del campione ' + sid, sid)
    pads.obj('SampleTrayPads', M['trayPad'], root, angle=40)
    tags.obj('SampleTrayTags', M['label'], root, smooth=False)
    text.obj('SampleTrayText', M['printBlack'], root, smooth=False, recalc=False)
    return root


def cobalt_glass(loc, rot=0.0):
    root = empty('CobaltGlass', loc=loc, rot=(0, 0, rot), label='Vetro al cobalto', pick=1)
    MB().box((0.05, 0.05, 0.003), (0, 0, 0.0015)).obj('CobaltGlassPlate', M['cobalt'], root, smooth=False, bevel=0.0006)
    return root


def build():
    palette()
    sample_tray((0.35, -0.115, TOP))
    L.beaker('AcidBeaker', 0.021, 0.058, label_text=[('HCl', 0.0085), ('2 M', 0.006)], loc=(-0.19, -0.1, TOP), lbl='Becher con HCl 2 M', fill=30, liquid='#e4edf2',
             graduations=True, nominal=50, grad_ang=-pi / 2 + 1.25)
    L.reagent_bottle('HClBottle', (-0.45, 0.22, TOP), [('HCl', 0.013), ('2 mol/L', 0.007), ('irritante', 0.0055)], color='#e9f0f3', fill=240, lbl='Bottiglia di HCl 2 M')
    wire_loop((-0.44, -0.2, TOP + 0.0042), (0, pi / 2, radians(14)))
    cobalt_glass((-0.3, -0.29, TOP), radians(9))


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
    MB().box((1.5, 0.8, 0.02), (0, 0.02, TOP - 0.01)).obj('PreviewTop', M['epoxy'], None, smooth=False)
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
    for name, eye, target, lens in (('kit', (0.0, -0.95, 1.5), (0.02, -0.08, 0.9), 30), ('tray', (0.35, -0.5, 1.2), (0.35, -0.1, 0.91), 45),
                                    ('loop', (-0.3, -0.33, 1.0), (-0.3, -0.16, 0.9), 60), ('cards', (0.52, -0.3, 1.02), (0.53, -0.04, 0.93), 70)):
        cam.location = eye
        cam.rotation_euler = (Vector(target) - Vector(eye)).to_track_quat('-Z', 'Y').to_euler()
        cam.data.lens = lens
        scene.render.filepath = os.path.join(PREVIEW, name + '.png')
        bpy.ops.render.render(write_still=True)


if __name__ == '__main__':
    main()
