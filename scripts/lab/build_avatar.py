"""
The student's body for /laboratorio: a figure in a lab coat, with nitrile gloves and hands whose fingers bend.

    blender -b --factory-startup -P scripts/lab/build_avatar.py -- public/lab/avatar.glb [preview-dir]

The body is a skeleton of bones with rigid pieces hanging from them (no skinning): the page turns the bones, and the
pieces follow. The figure faces +Y in Blender, which is -Z in three.js, where the camera looks. The eyes are at 1.62 m,
the height of the first-person camera. Bone names have no dots, which glTF loaders strip.

Arms hang down in the rest pose, palms facing the thighs; the index finger is at the front. The page reaches with
two-bone IK and curls the fingers towards the palm.
"""
import bpy, bmesh, math, os, sys
from math import pi, sin, cos, radians
from mathutils import Vector, Matrix

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = os.path.abspath(argv[0]) if argv else '/tmp/avatar.glb'
PREVIEW = os.path.abspath(argv[1]) if len(argv) > 1 else None

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


def lin(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


def material(name, color, rough=0.6, sheen=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = (*lin(color), 1)
    p.inputs['Roughness'].default_value = rough
    p.inputs['Sheen Weight'].default_value = sheen
    m.use_backface_culling = True
    return m


M = {
    'coat': material('AvatarCoat', '#cfcac1', 0.95, 0.3),
    'coatShade': material('AvatarCoatSeam', '#dcdcd6', 0.85),
    'glove': material('AvatarGlove', '#6f97d8', 0.55),
    'trousers': material('AvatarTrousers', '#323748', 0.8),
    'shoes': material('AvatarShoes', '#26272b', 0.4),
    'skin': material('AvatarSkin', '#e3b08e', 0.55, 0.2),
    'hair': material('AvatarHair', '#3a291e', 0.7),
    'button': material('AvatarButton', '#c9c9c4', 0.3),
    'eye': material('AvatarEye', '#1c1c1c', 0.3),
}

# ---------------------------------------------------------------------------------------------
# geometry helpers


def ellipse_loft(sections, seg=28, cap0=True, cap1=True):
    """Sections [(z, rx, ry, cy)] from bottom to top: an elliptical tube, optionally capped."""
    verts, faces = [], []
    for z, rx, ry, cy in sections:
        for k in range(seg):
            a = 2 * pi * k / seg
            verts.append((rx * cos(a), cy + ry * sin(a), z))
    n = len(sections)
    for i in range(n - 1):
        for k in range(seg):
            j = (k + 1) % seg
            faces.append((i * seg + k, i * seg + j, (i + 1) * seg + j, (i + 1) * seg + k))
    if cap0:
        faces.append(tuple(reversed(range(seg))))
    if cap1:
        faces.append(tuple((n - 1) * seg + k for k in range(seg)))
    return verts, faces


def capsule(a, b, r0, r1=None, seg=14, rings=4):
    """A capsule from point a to point b, radius r0 at a and r1 at b."""
    r1 = r0 if r1 is None else r1
    a, b = Vector(a), Vector(b)
    d = b - a
    L = d.length
    q = d.to_track_quat('Z', 'Y')
    prof = []
    for i in range(rings, 0, -1):
        t = (pi / 2) * i / rings
        prof.append((r0 * cos(t), -r0 * sin(t)))
    prof.append((r0, 0))
    prof.append((r1, L))
    for i in range(1, rings + 1):
        t = (pi / 2) * i / rings
        prof.append((r1 * cos(t), L + r1 * sin(t)))
    verts, faces = [], []
    verts.append(a + q @ Vector((0, 0, -r0)))
    for r, z in prof:
        for k in range(seg):
            ang = 2 * pi * k / seg
            verts.append(a + q @ Vector((r * cos(ang), r * sin(ang), z)))
    verts.append(a + q @ Vector((0, 0, L + r1)))
    n = len(prof)
    for k in range(seg):
        faces.append((0, 1 + (k + 1) % seg, 1 + k))
    for i in range(n - 1):
        for k in range(seg):
            j = (k + 1) % seg
            faces.append((1 + i * seg + k, 1 + i * seg + j, 1 + (i + 1) * seg + j, 1 + (i + 1) * seg + k))
    top = len(verts) - 1
    for k in range(seg):
        faces.append((1 + (n - 1) * seg + k, 1 + (n - 1) * seg + (k + 1) % seg, top))
    return [tuple(v) for v in verts], faces


def ellipsoid(c, r, seg=24, rings=16):
    verts, faces = [], []
    cx, cy, cz = c
    rx, ry, rz = r
    verts.append((cx, cy, cz - rz))
    for i in range(1, rings):
        t = pi * i / rings
        for k in range(seg):
            a = 2 * pi * k / seg
            verts.append((cx + rx * sin(t) * cos(a), cy + ry * sin(t) * sin(a), cz - rz * cos(t)))
    verts.append((cx, cy, cz + rz))
    for k in range(seg):
        faces.append((0, 1 + (k + 1) % seg, 1 + k))
    for i in range(rings - 2):
        for k in range(seg):
            j = (k + 1) % seg
            faces.append((1 + i * seg + k, 1 + i * seg + j, 1 + (i + 1) * seg + j, 1 + (i + 1) * seg + k))
    top = len(verts) - 1
    base = 1 + (rings - 2) * seg
    for k in range(seg):
        faces.append((base + k, base + (k + 1) % seg, top))
    return verts, faces


class MB:
    def __init__(self):
        self.v, self.f = [], []

    def add(self, data, mat=None):
        verts, faces = data
        o = len(self.v)
        for p in verts:
            p = Vector(p)
            if mat is not None:
                p = mat @ p
            self.v.append(tuple(p))
        for f in faces:
            self.f.append([i + o for i in f])
        return self

    def obj(self, name, material, bone=None, angle=40):
        me = bpy.data.meshes.new(name)
        me.from_pydata(self.v, [], self.f)
        me.validate()
        bm = bmesh.new()
        bm.from_mesh(me)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        bm.to_mesh(me)
        bm.free()
        me.shade_smooth()
        me.set_sharp_from_angle(angle=radians(angle))
        me.materials.append(material)
        ob = bpy.data.objects.new(name, me)
        scene.collection.objects.link(ob)
        if bone:
            attach(ob, bone)
        return ob


# ---------------------------------------------------------------------------------------------
# skeleton

arm_data = bpy.data.armatures.new('AvatarRig')
rig = bpy.data.objects.new('Avatar', arm_data)
scene.collection.objects.link(rig)
bpy.context.view_layer.objects.active = rig
bpy.ops.object.mode_set(mode='EDIT')
eb = arm_data.edit_bones


def bone(name, head, tail, parent=None):
    eb = arm_data.edit_bones
    b = eb.new(name)
    b.head = head
    b.tail = tail
    if parent:
        b.parent = arm_data.edit_bones[parent]
    return b


bone('Hips', (0, 0, 0.93), (0, 0, 1.05))
bone('Spine', (0, 0, 1.05), (0, 0, 1.42), 'Hips')
bone('Neck', (0, 0, 1.46), (0, 0, 1.54), 'Spine')
bone('Head', (0, 0, 1.54), (0, 0, 1.78), 'Neck')

# arm layout (right side; the left mirrors x)
SHOULDER = (0.185, -0.005, 1.43)
ELBOW = (0.205, -0.01, 1.145)
WRIST = (0.215, 0.0, 0.885)
UP_FOREARM = (Vector(ELBOW) - Vector(WRIST)).normalized()
HAND_DIR = Vector((0, 0.009, -0.094)).normalized()


def side_x(p, s):
    return (p[0] * s, p[1], p[2])


XR_FINGERS = {'Index': 'index-finger', 'Middle': 'middle-finger', 'Ring': 'ring-finger', 'Pinky': 'pinky-finger'}
XR_THUMB = ('thumb-metacarpal', 'thumb-phalanx-proximal', 'thumb-phalanx-distal', 'thumb-tip')
HAND_LEN = 0.19  # wrist to the middle fingertip


def xr_hand(S, s):
    """
    The generic WebXR hand (MIT, scripts/lab/assets/generic-hand): imported, turned so it hangs from our wrist with the
    index at the front and scaled to HAND_LEN. Returns the mesh and its joints in our frame.
    """
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'generic-hand', ('right' if s > 0 else 'left') + '.glb')
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in bpy.data.objects if o not in before]
    arm = next(o for o in new if o.type == 'ARMATURE')
    mesh = next(o for o in new if o.type == 'MESH' and 'hand' in o.name.lower())
    J = {b.name: arm.matrix_world @ b.head_local for b in arm.data.bones}
    w = J['wrist']
    d = (J['middle-finger-phalanx-proximal'] - w).normalized()
    l = J['index-finger-phalanx-proximal'] - J['pinky-finger-phalanx-proximal']
    l = (l - d * l.dot(d)).normalized()
    src = Matrix((d, l, d.cross(l))).transposed()
    lt = Vector((0, 1, 0))
    lt = (lt - HAND_DIR * lt.dot(HAND_DIR)).normalized()
    dst = Matrix((HAND_DIR, lt, HAND_DIR.cross(lt))).transposed()
    k = HAND_LEN / (J['middle-finger-tip'] - w).length
    T = Matrix.Translation(Vector(side_x(WRIST, s))) @ (dst @ src.inverted()).to_4x4() @ Matrix.Scale(k, 4) @ Matrix.Translation(-w)
    mw = mesh.matrix_world.copy()
    mesh.parent = None
    for mod in list(mesh.modifiers):
        mesh.modifiers.remove(mod)
    mesh.data.transform(T @ mw)
    mesh.matrix_world = Matrix.Identity(4)
    joints = {n: T @ p for n, p in J.items()}
    for o in new:
        if o is not mesh:
            bpy.data.objects.remove(o)
    mesh.name = f'AvatarGlove_{S}'
    mesh.data.materials.clear()
    mesh.data.materials.append(M['glove'])
    for poly in mesh.data.polygons:
        poly.use_smooth = True
    return mesh, joints


bpy.ops.object.mode_set(mode='OBJECT')
XR = {S: xr_hand(S, s) for S, s in (('R', 1), ('L', -1))}
bpy.context.view_layer.objects.active = rig
bpy.ops.object.mode_set(mode='EDIT')


def finger_points(fname, S):
    J = XR[S][1]
    x = XR_FINGERS[fname]
    return [J[f'{x}-phalanx-proximal'], J[f'{x}-phalanx-intermediate'], J[f'{x}-phalanx-distal'], J[f'{x}-tip']]


def thumb_points(S):
    J = XR[S][1]
    return [J[n] for n in XR_THUMB]


# Every bone's roll is set so that a positive turn about its local X axis is flexion: the elbow bends forwards, the
# wrist and the fingers bend towards the palm. The page relies on it.
for S, s in (('R', 1), ('L', -1)):
    palm_n = Vector((-s, 0, 0))  # the palm faces the thigh
    front = Vector((0, 1, 0))
    J = XR[S][1]
    b = bone(f'Shoulder_{S}', side_x((0.03, 0, 1.415), s), side_x(SHOULDER, s), 'Spine')
    b.align_roll(front)
    for nm, h, t, par in ((f'UpperArm_{S}', SHOULDER, ELBOW, f'Shoulder_{S}'), (f'ForeArm_{S}', ELBOW, WRIST, f'UpperArm_{S}')):
        b = bone(nm, side_x(h, s), side_x(t, s), par)
        b.align_roll(front)
    # the lower half of the forearm turns with the wrist (pronation): the twist bone carries it
    twist_head = Vector(side_x(ELBOW, s)).lerp(Vector(side_x(WRIST, s)), 0.45)
    bone(f'ForeArmTwist_{S}', tuple(twist_head), side_x(WRIST, s), f'ForeArm_{S}').align_roll(front)
    bone(f'Hand_{S}', side_x(WRIST, s), tuple(J['middle-finger-phalanx-proximal']), f'ForeArmTwist_{S}').align_roll(palm_n)
    for fname in XR_FINGERS:
        pts = finger_points(fname, S)
        parent = f'Hand_{S}'
        for i in range(3):
            nm = f'{fname}{i + 1}_{S}'
            b = bone(nm, tuple(pts[i]), tuple(pts[i + 1]), parent)
            # the flexion axis is across the finger, in the palm's plane
            b.align_roll(palm_n)
            parent = nm
    pts = thumb_points(S)
    parent = f'Hand_{S}'
    # the thumb's pad faces the middle of the palm: it flexes across it, towards the ring finger's base
    aim = J['ring-finger-phalanx-proximal'].lerp(J['wrist'], 0.45) + palm_n * 0.02
    for i in range(3):
        nm = f'Thumb{i + 1}_{S}'
        b = bone(nm, tuple(pts[i]), tuple(pts[i + 1]), parent)
        ax = (pts[i + 1] - pts[i]).normalized()
        n = aim - pts[i]
        b.align_roll((n - ax * n.dot(ax)).normalized())
        parent = nm

bpy.ops.object.mode_set(mode='OBJECT')
bpy.context.view_layer.update()


def attach(ob, bone_name):
    """Hang an object, built in world coordinates, from a bone without moving it."""
    mw = ob.matrix_world.copy()
    ob.parent = rig
    ob.parent_type = 'BONE'
    ob.parent_bone = bone_name
    bpy.context.view_layer.update()
    ob.matrix_world = mw


def bone_head(name):
    return Vector(rig.data.bones[name].head_local)


def bone_tail(name):
    return Vector(rig.data.bones[name].tail_local)


# ---------------------------------------------------------------------------------------------
# body

# legs and shoes (fixed to the hips: the body does not walk yet)
legs = MB()
for s in (1, -1):
    legs.add(capsule((0.095 * s, 0, 0.9), (0.1 * s, 0.005, 0.1), 0.068, 0.052, seg=20))
legs.obj('AvatarLegs', M['trousers'], 'Hips')
shoes = MB()
for s in (1, -1):
    shoes.add(ellipse_loft([(0.0, 0.048, 0.12, 0.04), (0.035, 0.05, 0.125, 0.04), (0.075, 0.045, 0.09, 0.02), (0.095, 0.035, 0.05, 0.0)], seg=20), Matrix.Translation((0.1 * s, 0, 0)))
shoes.obj('AvatarShoes', M['shoes'], 'Hips')

# lab coat: from just below the knee to the shoulders, open at the bottom
coat = MB()
coat.add(ellipse_loft([
    (0.5, 0.24, 0.17, 0.0), (0.7, 0.225, 0.155, 0.0), (0.95, 0.2, 0.135, 0.0), (1.1, 0.185, 0.13, 0.005),
    (1.27, 0.2, 0.135, 0.01), (1.36, 0.215, 0.128, 0.005), (1.42, 0.2, 0.11, 0.0), (1.455, 0.13, 0.085, 0.0), (1.475, 0.065, 0.06, 0.0)
], seg=36, cap0=False, cap1=True))
coat.obj('AvatarCoat', M['coat'], 'Spine')
# lapels and the front seam, a shade darker, and the buttons
seam = MB()
for s in (1, -1):
    seam.add(capsule((0.012 * s, 0.132, 1.02), (0.075 * s, 0.13, 1.4), 0.006, 0.01, seg=8))
seam.add(capsule((0.0, 0.14, 0.52), (0.0, 0.137, 1.02), 0.004, 0.004, seg=8))
seam.obj('AvatarCoatSeam', M['coatShade'], 'Spine')
buttons = MB()
for z in (0.72, 0.85, 0.98):
    buttons.add(ellipsoid((0.018, 0.142, z), (0.008, 0.004, 0.008), seg=12, rings=6))
buttons.obj('AvatarButtons', M['button'], 'Spine')
# pocket
MB().add(ellipse_loft([(0.66, 0.05, 0.004, 0.0), (0.78, 0.05, 0.004, 0.0)], seg=12), Matrix.Translation((-0.12, 0.155, 0))).obj('AvatarPocket', M['coatShade'], 'Spine')

neck = MB().add(capsule((0, 0, 1.44), (0, 0.005, 1.56), 0.052, 0.05, seg=18))
neck.obj('AvatarNeck', M['skin'], 'Neck')
head = MB().add(ellipsoid((0, 0.01, 1.655), (0.078, 0.092, 0.11), seg=28, rings=18))
for s in (1, -1):
    head.add(ellipsoid((0.078 * s, 0.0, 1.645), (0.012, 0.02, 0.028), seg=10, rings=6))
head.obj('AvatarHead', M['skin'], 'Head')
hair = MB().add(ellipsoid((0, -0.004, 1.685), (0.084, 0.098, 0.095), seg=28, rings=14))
hair.obj('AvatarHair', M['hair'], 'Head')
eyes = MB()
for s in (1, -1):
    eyes.add(ellipsoid((0.03 * s, 0.092, 1.662), (0.009, 0.004, 0.007), seg=10, rings=6))
eyes.obj('AvatarEyes', M['eye'], 'Head')

# arms: one continuous glove and one continuous sleeve per side, grown with the Skin modifier over a skeleton of
# points, smoothed with subdivision, and weighted to the bones with Blender's automatic (bone heat) weights


def skin_mesh(name, nodes, edges, material, levels=2):
    """nodes: [(point, radius)]; edges: pairs of indices. Returns the applied, smooth mesh object."""
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(p) for p, _r in nodes], edges, [])
    ob = bpy.data.objects.new(name, me)
    scene.collection.objects.link(ob)
    sk = ob.modifiers.new('skin', 'SKIN')
    sk.branch_smoothing = 0.6
    sk.use_smooth_shade = True
    for i, (_p, r) in enumerate(nodes):
        sv = me.skin_vertices[0].data[i]
        sv.radius = (r, r) if not isinstance(r, tuple) else r
        sv.use_root = i == 0
    sub = ob.modifiers.new('sub', 'SUBSURF')
    sub.levels = levels
    sub.render_levels = levels
    bpy.context.view_layer.objects.active = ob
    ob.select_set(True)
    bpy.ops.object.modifier_apply(modifier='skin')
    bpy.ops.object.modifier_apply(modifier='sub')
    ob.select_set(False)
    ob.data.materials.append(material)
    for poly in ob.data.polygons:
        poly.use_smooth = True
    return ob


def bind(ob):
    """Automatic weights from the bones (the heat method), as a skinned mesh of the rig."""
    bpy.ops.object.select_all(action='DESELECT')
    ob.select_set(True)
    rig.select_set(True)
    bpy.context.view_layer.objects.active = rig
    bpy.ops.object.parent_set(type='ARMATURE_AUTO')
    bpy.ops.object.select_all(action='DESELECT')


for S, s in (('R', 1), ('L', -1)):
    W = Vector(side_x(WRIST, s))
    up = Vector((UP_FOREARM.x * s, UP_FOREARM.y, UP_FOREARM.z))
    # the glove is the XR hand, with its own skin weights renamed to our bones; the metacarpals move with the hand,
    # and the stub above the wrist goes over to the forearm's twist bone, so a bent wrist does not poke out of the cuff
    glove = XR[S][0]
    rename = {'wrist': f'Hand_{S}'}
    for fname, x in XR_FINGERS.items():
        rename[f'{x}-metacarpal'] = f'Hand_{S}'
        rename[f'{x}-phalanx-proximal'] = f'{fname}1_{S}'
        rename[f'{x}-phalanx-intermediate'] = f'{fname}2_{S}'
        rename[f'{x}-phalanx-distal'] = f'{fname}3_{S}'
        rename[f'{x}-tip'] = f'{fname}3_{S}'
    for i, x in enumerate(XR_THUMB):
        rename[x] = f'Thumb{min(i + 1, 3)}_{S}'
    old = {g.index: g.name for g in glove.vertex_groups}
    weights = [dict() for _ in glove.data.vertices]
    for v in glove.data.vertices:
        for g in v.groups:
            to = rename[old[g.group]]
            weights[v.index][to] = weights[v.index].get(to, 0) + g.weight
    glove.vertex_groups.clear()
    twist = f'ForeArmTwist_{S}'
    for v in glove.data.vertices:
        h = (v.co - W).dot(up)
        t = min(1.0, max(0.0, (h - 0.004) / 0.018))
        if t > 0:
            wv = weights[v.index]
            total = sum(wv.values()) or 1.0
            for key in wv:
                wv[key] *= (1 - t)
            wv[twist] = wv.get(twist, 0) + t * total
    for v in glove.data.vertices:
        for name, wt in weights[v.index].items():
            if wt <= 0:
                continue
            g = glove.vertex_groups.get(name) or glove.vertex_groups.new(name=name)
            g.add([v.index], wt, 'ADD')
    glove.parent = rig
    glove.modifiers.new('rig', 'ARMATURE').object = rig

    # the forearm's frame at the wrist: z up the arm, x across the palm (the arm's thin side), y towards the thumb
    ey = Vector((0, 1, 0))
    ey = (ey - up * ey.dot(up)).normalized()
    ex = ey.cross(up)
    # the hand mesh stops 1.5 to 2.4 cm above the wrist, open and slanted: its section just below the edge sizes the
    # cuff, which starts on the glove and covers the edge
    edge = [v.co - W for v in glove.data.vertices if 0 <= (v.co - W).dot(up) <= 0.015]
    xs, ys = [c.dot(ex) for c in edge], [c.dot(ey) for c in edge]
    cx, cy = (max(xs) + min(xs)) / 2, (max(ys) + min(ys)) / 2
    rx, ry = (max(xs) - min(xs)) / 2, (max(ys) - min(ys)) / 2
    frame = Matrix((ex, ey, up)).transposed().to_4x4()
    frame.translation = W + ex * cx + ey * cy

    def tube(name, sections, material, caps):
        """An elliptical tube along the forearm, [(h, kx, ky)] as multiples of the glove's edge, skinned to the twist
        bone below `h1` and to the forearm above."""
        verts, faces = ellipse_loft([(h, rx * kx, ry * ky, 0) for h, kx, ky in sections], seg=32, cap0=caps, cap1=caps)
        me = bpy.data.meshes.new(name)
        me.from_pydata([tuple(frame @ Vector(p)) for p in verts], [], faces)
        me.materials.append(material)
        for poly in me.polygons:
            poly.use_smooth = True
        ob = bpy.data.objects.new(name, me)
        scene.collection.objects.link(ob)
        tw = ob.vertex_groups.new(name=twist)
        fa = ob.vertex_groups.new(name=f'ForeArm_{S}')
        for v in me.vertices:
            t = min(1.0, max(0.0, ((v.co - W).dot(up) - 0.12) / 0.08))
            if t < 1:
                tw.add([v.index], 1 - t, 'REPLACE')
            if t > 0:
                fa.add([v.index], t, 'REPLACE')
        ob.parent = rig
        ob.modifiers.new('rig', 'ARMATURE').object = rig
        return ob

    # the glove's cuff: from inside the hand's edge a short way up the wrist, a little wider as a nitrile cuff is, and
    # ending in a rolled rim that folds back inside, so it reads as a thin glove over the arm
    tube(f'AvatarGloveCuff_{S}', [(0.004, 0.99, 0.99), (0.01, 1.06, 1.06), (0.026, 1.08, 1.08), (0.042, 1.12, 1.11), (0.046, 1.14, 1.13),
                                   (0.0475, 1.12, 1.11), (0.047, 1.06, 1.06), (0.04, 1.03, 1.03)], M['glove'], False)
    # the bare forearm, from inside the glove to inside the sleeve: narrower than the cuff where it leaves it, then
    # widening towards the elbow, and flatter across the palm than towards the thumb
    tube(f'AvatarForearm_{S}', [(0.0, 0.86, 0.88), (0.036, 0.9, 0.93), (0.07, 0.98, 1.02), (0.11, 1.07, 1.1), (0.16, 1.14, 1.16), (0.21, 1.18, 1.2)],
         M['skin'], True)
    print('WRIST', S, 'edge', round(rx, 4), round(ry, 4))

    # the sleeve of the coat, from inside the shoulder to a cuff well above the glove, so the wrist shows
    sh, el = Vector(side_x(SHOULDER, s)), Vector(side_x(ELBOW, s))
    cuff = W + up * 0.1
    # a turned-back cuff: a little wider, with a lip
    sn = [(sh + Vector((-0.02 * s, 0, 0.0)), 0.05), (sh.lerp(el, 0.5), 0.047), (el, 0.045), (el.lerp(cuff, 0.5), 0.043), (cuff + up * 0.03, 0.044), (cuff + up * 0.026, 0.048),
          (cuff, 0.048), (cuff - up * 0.006, 0.05)]
    sleeve = skin_mesh(f'AvatarSleeve_{S}', sn, [(i, i + 1) for i in range(len(sn) - 1)], M['coat'], levels=2)
    bind(sleeve)


# ---------------------------------------------------------------------------------------------
# fewer draws: every mesh is a draw call and a shadow draw, for each person in the room. The rigid pieces become
# skinned, all weight on their bone; each piece's colour goes into its vertices; then the body is joined into one mesh
# and the arms (cuffs, forearms, sleeves) into another, each with one material. The gloves stay apart: the page reads
# their vertices by name to fit the fingers round what they hold.

def to_skinned(ob):
    """A piece hanging from a bone, made a skinned mesh of the rig with all its weight on that bone."""
    if ob.parent_type != 'BONE':
        return
    bone_name = ob.parent_bone
    mw = ob.matrix_world.copy()
    ob.parent = None
    ob.data.transform(mw)
    ob.matrix_world = Matrix.Identity(4)
    g = ob.vertex_groups.new(name=bone_name)
    g.add([v.index for v in ob.data.vertices], 1.0, 'REPLACE')
    ob.parent = rig
    ob.modifiers.new('rig', 'ARMATURE').object = rig


def paint(ob):
    """The piece's material colour into a colour attribute on every vertex."""
    base = ob.data.materials[0].node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value
    attr = ob.data.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT')
    for d in attr.data:
        d.color = base


def vertex_colour_material(name, rough, sheen=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes['Principled BSDF']
    col = nt.nodes.new('ShaderNodeVertexColor')
    col.layer_name = 'Col'
    nt.links.new(col.outputs['Color'], p.inputs['Base Color'])
    p.inputs['Roughness'].default_value = rough
    p.inputs['Sheen Weight'].default_value = sheen
    m.use_backface_culling = True
    return m


def join(name, pieces, material):
    for ob in pieces:
        to_skinned(ob)
        paint(ob)
    bpy.ops.object.select_all(action='DESELECT')
    for ob in pieces:
        ob.select_set(True)
    bpy.context.view_layer.objects.active = pieces[0]
    bpy.ops.object.join()
    ob = pieces[0]
    ob.name = name
    ob.data.materials.clear()
    ob.data.materials.append(material)
    for mod in [m for m in ob.modifiers if m.type == 'ARMATURE'][1:]:
        ob.modifiers.remove(mod)
    bpy.ops.object.select_all(action='DESELECT')
    return ob


BODY = ('AvatarLegs', 'AvatarShoes', 'AvatarCoat', 'AvatarCoatSeam', 'AvatarButtons', 'AvatarPocket')
# the head apart: the other people in the room wear a head from the avatar kit (avatar_kit.py) in its place
HEAD = ('AvatarNeck', 'AvatarHead', 'AvatarHair', 'AvatarEyes')
ARMS = tuple(f'{p}_{S}' for S in ('R', 'L') for p in ('AvatarGloveCuff', 'AvatarForearm', 'AvatarSleeve'))
join('AvatarBody', [bpy.data.objects[n] for n in BODY], vertex_colour_material('AvatarBody', 0.8))
join('AvatarHead', [bpy.data.objects[n] for n in HEAD], vertex_colour_material('AvatarHead', 0.8))
join('AvatarArms', [bpy.data.objects[n] for n in ARMS], vertex_colour_material('AvatarArms', 0.8, 0.2))
print('MESHES', sorted(o.name for o in scene.objects if o.type == 'MESH'))

for ob in scene.objects:
    if ob.type == 'MESH':
        ob.data.name = ob.name

bpy.ops.export_scene.gltf(
    filepath=OUT, export_format='GLB', export_extras=True, export_yup=True, export_apply=False,
    export_animations=False, export_cameras=False, export_lights=False, export_skins=True, export_def_bones=False, export_influence_nb=4,
)
print('EXPORTED', OUT, os.path.getsize(OUT))

if PREVIEW:
    os.makedirs(PREVIEW, exist_ok=True)
    scene.render.engine = 'BLENDER_EEVEE'
    scene.render.resolution_x = 900
    scene.render.resolution_y = 900
    world = bpy.data.worlds.new('W')
    world.use_nodes = True
    world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.75, 0.77, 0.8, 1)
    scene.world = world
    sun = bpy.data.objects.new('Sun', bpy.data.lights.new('Sun', 'SUN'))
    sun.data.energy = 3
    sun.rotation_euler = (radians(50), radians(10), radians(150))
    scene.collection.objects.link(sun)
    # a pose to check the skinning: elbows bent, the right hand closed round a grip and turned, the left relaxed
    pb = rig.pose.bones
    from mathutils import Quaternion as Q
    def rot(nm, axis, deg):
        pb[nm].rotation_mode = 'QUATERNION'
        pb[nm].rotation_quaternion = Q(axis, radians(deg)) @ pb[nm].rotation_quaternion
    for S in ('R', 'L'):
        rot(f'ForeArm_{S}', (1, 0, 0), 85)
    rot('ForeArmTwist_R', (0, 1, 0), 70)
    for f in ('Index', 'Middle', 'Ring', 'Pinky'):
        for i, a in ((1, 70), (2, 85), (3, 55)):
            rot(f'{f}{i}_R', (1, 0, 0), a)
            rot(f'{f}{i}_L', (1, 0, 0), a * 0.25)
    rot('Thumb2_R', (1, 0, 0), 30)
    rot('Thumb3_R', (1, 0, 0), 30)
    cam = bpy.data.objects.new('Cam', bpy.data.cameras.new('Cam'))
    scene.collection.objects.link(cam)
    scene.camera = cam

    def shot(name, eye, target, lens=50):
        cam.location = eye
        cam.rotation_euler = (Vector(target) - Vector(eye)).to_track_quat('-Z', 'Y').to_euler()
        cam.data.lens = lens
        cam.data.clip_start = 0.01
        scene.render.filepath = os.path.join(PREVIEW, name + '.png')
        bpy.ops.render.render(write_still=True)

    shot('avatar-front', (0.9, 3.2, 1.2), (0, 0, 0.95), 50)
    shot('avatar-hand', (0.55, 0.75, 1.3), (0.21, 0.3, 1.13), 55)
    shot('avatar-hand-l', (-0.55, 0.75, 1.3), (-0.21, 0.3, 1.13), 55)
    shot('avatar-hand-top', (0.2, 0.35, 1.55), (0.21, 0.3, 1.13), 55)
    shot('avatar-front', (0.9, 3.2, 1.2), (0, 0, 0.95), 50)
