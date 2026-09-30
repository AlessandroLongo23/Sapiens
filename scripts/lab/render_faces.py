"""
Portraits of the classmates for the lab's lobby: 24 heads from the avatar kit, each a look the page's classroom
could give (avatar-kit.ts, randomLook), rendered on a transparent background.

    blender -b --factory-startup -P scripts/lab/render_faces.py -- public/lab/volti

Writes 00.png … 23.png (256 px); compress with cwebp afterwards.
"""
import bpy, os, sys, random
from math import radians
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = os.path.abspath(argv[0] if argv else '/tmp/volti')
os.makedirs(OUT, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
KIT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'avatar_kit.py')
src = open(KIT).read().split("\nif __name__ == '__main__':")[0]
exec(compile(src, KIT, 'exec'), globals())
build_all()  # noqa: F821  (from the kit)
kit = {o.name: o for o in bpy.data.objects if o.type == 'MESH' and 'slot' in o}
for o in kit.values():
    o.hide_render = True

EYE_O, BROW_O, NOSE_O, MOUTH_O = list(EYES), list(BROWS), list(NOSES), list(MOUTHS)  # noqa: F821
HAIR_O = list(HAIR_STYLES)  # noqa: F821


def look(i):
    r = random.Random(i * 7919 + 13)
    lk = dict(skin=r.randrange(len(SKIN)), hair=r.choice(HAIR_O), hc=r.randrange(3) if r.random() < 0.8 else r.randrange(len(HAIR)),  # noqa: F821
              eyes=r.choice(EYE_O), brows=r.choice(BROW_O), nose=r.choice(NOSE_O), mouth='sorriso' if r.random() < 0.7 else r.choice(MOUTH_O))
    h = r.random()
    if h < 0.08:
        lk['hat'], lk['hair'] = ('hijab', r.choice(ACCENT)), None  # noqa: F821
    elif h < 0.16:
        lk['hat'] = (r.choice(['berretto', 'cappellino']), r.choice(ACCENT))  # noqa: F821
    if r.random() < 0.25:
        lk['glasses'] = (r.choice(['tonde', 'rettangolari']), r.choice(['#2f3440', '#c9a45c', '#8a5b3c']))
    return lk


sc = bpy.context.scene
sc.render.engine = 'BLENDER_EEVEE'
sc.render.resolution_x = sc.render.resolution_y = 256
sc.render.film_transparent = True
sc.eevee.taa_render_samples = 32
sc.view_settings.view_transform = 'AgX'
w = bpy.data.worlds.new('W')
w.use_nodes = True
w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.82, 0.84, 0.88, 1)
w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.9
sc.world = w
cam = bpy.data.objects.new('Cam', bpy.data.cameras.new('Cam'))
sc.collection.objects.link(cam)
sc.camera = cam
cam.data.lens = 85
eye, tgt = Vector((0.18, 1.35, 1.7)), Vector((0, 0, 1.64))
cam.location = eye
cam.rotation_euler = (tgt - eye).to_track_quat('-Z', 'Y').to_euler()
for name, loc, energy, col in (('Key', (0.9, 1.1, 2.3), 110, (1, 0.96, 0.9)), ('Fill', (-1.2, 0.9, 1.7), 45, (0.9, 0.95, 1)), ('Rim', (-0.4, -1.0, 2.1), 70, (1, 1, 1))):
    l = bpy.data.objects.new(name, bpy.data.lights.new(name, 'AREA'))
    l.data.energy, l.data.color, l.data.size = energy, col, 1.2
    l.location = loc
    l.rotation_euler = (Vector((0, 0, 1.6)) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
    sc.collection.objects.link(l)

for i in range(24):
    lk = look(i)
    skin, hc = SKIN[lk['skin']], HAIR[lk['hc'] % len(HAIR)]  # noqa: F821
    parts = [('KitHead_tondo', skin), ('KitNeck', skin), ('KitEars', skin), (f"KitNose_{lk['nose']}", skin), (f"KitEyes_{lk['eyes']}", None),
             (f"KitEyeLights_{lk['eyes']}", None), (f"KitBrows_{lk['brows']}", hc), (f"KitMouth_{lk['mouth']}", None)]
    hat = lk.get('hat')
    if lk['hair'] and (not hat or hat[0] in ('berretto', 'cappellino')):
        parts.append((f"KitHair_{lk['hair']}" + (f'_{hat[0]}' if hat else ''), hc))
    if hat:
        parts.append((f'KitHat_{hat[0]}', hat[1]))
    if lk.get('glasses'):
        parts.append((f"KitGlasses_{lk['glasses'][0]}", lk['glasses'][1]))
    for n, _c in parts:
        o = kit[n]
        o.hide_render = False
        o['_c'] = list(o.color)
    for n, c in parts:
        if c:
            kit[n].color = (*lin(c), 1)  # noqa: F821
    sc.render.filepath = os.path.join(OUT, f'{i:02d}.png')
    bpy.ops.render.render(write_still=True)
    for n, _c in parts:
        o = kit[n]
        o.color = o['_c']
        o.hide_render = True
    print('FACE', i, lk)
