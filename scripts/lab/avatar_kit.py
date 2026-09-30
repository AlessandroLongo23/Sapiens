"""
The avatar kit: heads, faces, hair, headwear, beards and glasses for the lab's people, in the style chosen on
30 September 2026 (simple rounded shapes, cartoon features set low on the face, matte clay finish).

Every option is a mesh built from primitives and metaballs, in the avatar's frame (Blender Z up, the figure faces +Y,
eyes at 1.62 m). The page picks one option per slot from the student's avatar record and colours it by role (skin,
hair, dark, mouth, white, accessory).

It runs in two ways: step by step inside an open Blender (scratchpad bridge, so the work can be watched), or headless
with build_all() at the bottom.
"""
import bpy, bmesh, math
from math import pi, sin, cos, radians
from mathutils import Vector, Matrix, Quaternion
from mathutils.bvhtree import BVHTree

sc = bpy.context.scene

# the head's centre and the face's frame; the eyes land at 1.62 m, the first-person camera's height
C = Vector((0.0, 0.004, 1.655))

SKIN = ['#f5d5bf', '#ecbf9c', '#dca47c', '#c68a60', '#a66b45', '#875034', '#693c25', '#48291b']
HAIR = ['#211a17', '#43291d', '#6e4226', '#a8683a', '#d4ab68', '#8f8b86', '#b0472f']
ACCENT = ['#d9543f', '#3f6fb5', '#e0a93b', '#4f9a6b', '#8a5bb5', '#e27aa2', '#2f3440', '#e9e4da']


def lin(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


# ---------------------------------------------------------------------------------------------
# collections and materials


def coll(name, parent=None):
    parent = parent or sc.collection
    c = bpy.data.collections.get(name) or bpy.data.collections.new(name)
    if c.name not in parent.children:
        parent.children.link(c)
    return c


def role_material(role, rough=0.6):
    """One material per role; its colour is the object's colour, so a copy can be recoloured without a new material."""
    name = f'Kit{role.capitalize()}'
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes['Principled BSDF']
    info = nt.nodes.new('ShaderNodeObjectInfo')
    nt.links.new(info.outputs['Color'], p.inputs['Base Color'])
    p.inputs['Roughness'].default_value = rough
    p.inputs['Specular IOR Level'].default_value = 0.35
    return m


ROLE_ROUGH = {'skin': 0.6, 'hair': 0.75, 'dark': 0.35, 'mouth': 0.5, 'white': 0.3, 'accessory': 0.45}
DEFAULT_COLOUR = {'skin': SKIN[2], 'hair': HAIR[1], 'dark': '#231b18', 'mouth': '#7a3a31', 'white': '#fbf8f2', 'accessory': ACCENT[0]}


def finish(ob, slot, option, role, collection):
    ob.data.materials.clear()
    ob.data.materials.append(role_material(role, ROLE_ROUGH[role]))
    ob.color = (*lin(DEFAULT_COLOUR[role]), 1)
    ob['slot'], ob['option'], ob['role'] = slot, option, role
    for c in ob.users_collection:
        c.objects.unlink(ob)
    collection.objects.link(ob)
    for poly in ob.data.polygons:
        poly.use_smooth = True
    return ob


def replace(name):
    o = bpy.data.objects.get(name)
    if o:
        bpy.data.objects.remove(o)


# ---------------------------------------------------------------------------------------------
# geometry


def mesh_object(name, verts, faces):
    replace(name)
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(v) for v in verts], [], faces)
    me.validate()
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    sc.collection.objects.link(ob)
    return ob


def sphere_grid(seg=40, rings=28):
    """Unit sphere as (directions, faces)."""
    verts, faces = [Vector((0, 0, -1))], []
    for i in range(1, rings):
        t = pi * i / rings
        for k in range(seg):
            a = 2 * pi * k / seg
            verts.append(Vector((sin(t) * cos(a), sin(t) * sin(a), -cos(t))))
    verts.append(Vector((0, 0, 1)))
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


def ellipsoid_at(centre, axes, frame=None, seg=16, rings=10):
    """An ellipsoid with semi-axes `axes` along the columns of `frame` (identity by default)."""
    frame = frame or Matrix.Identity(3)
    d, f = sphere_grid(seg, rings)
    return [Vector(centre) + frame @ Vector((p.x * axes[0], p.y * axes[1], p.z * axes[2])) for p in d], f


def frame_from(normal, up=Vector((0, 0, 1))):
    """Columns: x across (to the figure's left as seen from the front is -x), y up along the surface, z out."""
    z = Vector(normal).normalized()
    x = up.cross(z)
    if x.length < 1e-6:
        x = Vector((1, 0, 0))
    x.normalize()
    y = z.cross(x)
    return Matrix((x, y, z)).transposed()


# ---------------------------------------------------------------------------------------------
# metaballs: soft blobs that melt together, then converted to a mesh. Visible radius is about 0.57 of the field radius.

K = 0.57
_mb = [0]


def blob(elems, res=0.004, threshold=0.6):
    """elems: dicts with co, r (visible radius) or axes (visible semi-axes) and rot, neg. Returns a mesh object."""
    _mb[0] += 1
    name = f'MBK{_mb[0]}'
    mb = bpy.data.metaballs.new(name)
    mb.resolution = res
    mb.render_resolution = res
    mb.threshold = threshold
    for e in elems:
        if 'axes' in e:
            ax = e['axes']
            s = max(ax)
            el = mb.elements.new(type='ELLIPSOID')
            el.radius = s / K
            el.size_x, el.size_y, el.size_z = (a / s for a in ax)
        else:
            el = mb.elements.new(type='BALL')
            el.radius = e['r'] / K
        el.co = e['co']
        if 'rot' in e:
            el.rotation = e['rot']
        el.use_negative = e.get('neg', False)
        el.stiffness = e.get('stiff', 2.0)
    ob = bpy.data.objects.new(name, mb)
    sc.collection.objects.link(ob)
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    bpy.data.objects.remove(ob)
    bpy.data.metaballs.remove(mb)
    out = bpy.data.objects.new(name + 'M', me)
    sc.collection.objects.link(out)
    return out


def apply_mods(ob):
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    old = ob.data
    ob.modifiers.clear()
    ob.data = me
    bpy.data.meshes.remove(old)
    return ob


def carve(ob, cutter, remesh=0.0025, smooth=4, keep_cutter=False):
    """Subtracts `cutter` from `ob`, then rounds the new edges (voxel remesh and a light smooth)."""
    m = ob.modifiers.new('cut', 'BOOLEAN')
    m.operation = 'DIFFERENCE'
    m.solver = 'EXACT'
    m.object = cutter
    apply_mods(ob)
    if not keep_cutter:
        bpy.data.objects.remove(cutter)
    if remesh:
        r = ob.modifiers.new('re', 'REMESH')
        r.mode = 'VOXEL'
        r.voxel_size = remesh
        s = ob.modifiers.new('sm', 'SMOOTH')
        s.factor = 0.6
        s.iterations = smooth
        apply_mods(ob)
    return ob


def decimate(ob, faces):
    n = len(ob.data.polygons)
    if n > faces:
        d = ob.modifiers.new('dec', 'DECIMATE')
        d.ratio = faces / n
        apply_mods(ob)
    return ob


def rename(ob, name):
    replace(name)
    ob.name = name
    ob.data.name = name
    return ob


# ---------------------------------------------------------------------------------------------
# heads


FACES = {
    # radii, jaw taper, squareness of the lower half, flat face, chin forward
    'tondo': dict(r=(0.118, 0.114, 0.138), taper=0.16, square=0.0, flat=0.22, chin=0.06),
    'ovale': dict(r=(0.11, 0.114, 0.148), taper=0.3, square=0.0, flat=0.22, chin=0.1),
    'squadrato': dict(r=(0.118, 0.115, 0.142), taper=0.1, square=0.9, flat=0.25, chin=0.08),
}


def head_point(d, P):
    x, y, z = d
    n = 2 + P['square'] * (1.0 if z < 0 else 0.25)
    if n != 2:
        s = (abs(x) ** n + abs(y) ** n + abs(z) ** n) ** (1 / n)
        x, y, z = x / s, y / s, z / s
    if z < 0:
        k = 1 - P['taper'] * (-z) ** 1.6
        x *= k
        if y < 0:
            y *= k
        elif y > 0:
            y *= 1 + P['chin'] * (-z)
    if y > 0:
        y *= 1 - P['flat'] * y ** 3
    elif z > 0:
        y *= 1 + 0.06 * z
    rx, ry, rz = P['r']
    return C + Vector((x * rx, y * ry, z * rz))


HEADS = coll('Kit Teste')


def build_head(option='tondo'):
    P = FACES[option]
    d, f = sphere_grid(48, 32)
    ob = mesh_object(f'KitHead_{option}', [head_point(p, P) for p in d], f)
    return finish(ob, 'face', option, 'skin', HEADS)


def bvh(ob):
    bm = bmesh.new()
    bm.from_mesh(ob.data)
    bm.transform(ob.matrix_world)
    t = BVHTree.FromBMesh(bm)
    bm.free()
    return t


def surf(tree, elev, azim, out=0.0):
    """The point of the head's surface in the direction (elevation, azimuth) from its centre, degrees; azimuth 0 is the
    front, positive to the figure's left (+x). Returns (point pushed out along the normal by `out`, normal)."""
    e, a = radians(elev), radians(azim)
    d = Vector((sin(a) * cos(e), cos(a) * cos(e), sin(e)))
    hit, n, _i, _d = tree.ray_cast(C, d)
    if n.dot(d) < 0:
        n = -n
    return hit + n * out, n


# ---------------------------------------------------------------------------------------------
# faces: ears, eyes, brows, nose, mouth. Placed on the chosen head.

FEAT = coll('Kit Lineamenti')


def build_ears(head):
    t = bvh(head)
    verts, faces = [], []
    for s in (1, -1):
        p, n = surf(t, -9, 90 * s, -0.004)
        fr = frame_from(n)
        v, f = ellipsoid_at(p, (0.021, 0.032, 0.02), fr, 18, 12)
        o = len(verts)
        verts += v
        faces += [tuple(i + o for i in q) for q in f]
    return finish(mesh_object('KitEars', verts, faces), 'ears', 'base', 'skin', FEAT)


EYES = {
    'ovali': dict(axes=(0.0095, 0.015, 0.006), elev=-12, azim=20),
    'tondi': dict(axes=(0.011, 0.011, 0.006), elev=-12, azim=20),
    'piccoli': dict(axes=(0.007, 0.0095, 0.005), elev=-12, azim=19),
}


def build_eyes(head, option='ovali'):
    E = EYES[option]
    t = bvh(head)
    dark, white = ([], []), ([], [])
    for s in (1, -1):
        p, n = surf(t, E['elev'], E['azim'] * s, E['axes'][2] * 0.25)
        fr = frame_from(n)
        v, f = ellipsoid_at(p, E['axes'], fr, 16, 10)
        o = len(dark[0])
        dark[0].extend(v)
        dark[1].extend(tuple(i + o for i in q) for q in f)
        # a small catchlight, up and towards the outside
        c = p + fr @ Vector((-0.35 * E['axes'][0], 0.35 * E['axes'][1], E['axes'][2] * 0.75))
        v, f = ellipsoid_at(c, (0.0024, 0.0028, 0.0012), fr, 10, 6)
        o = len(white[0])
        white[0].extend(v)
        white[1].extend(tuple(i + o for i in q) for q in f)
    return (finish(mesh_object(f'KitEyes_{option}', *dark), 'eyes', option, 'dark', FEAT),
            finish(mesh_object(f'KitEyeLights_{option}', *white), 'eyes', option, 'white', FEAT))


def arc_blob(t, pts, radius, res=0.0012):
    """A soft stroke on the surface through (elev, azim, out) points, sampled densely; radius per point or constant."""
    elems = []
    steps = 10
    for i in range(len(pts) - 1):
        for k in range(steps):
            u = k / steps
            e = pts[i][0] * (1 - u) + pts[i + 1][0] * u
            a = pts[i][1] * (1 - u) + pts[i + 1][1] * u
            o = pts[i][2] * (1 - u) + pts[i + 1][2] * u
            r = radius(i + u) if callable(radius) else radius
            p, _n = surf(t, e, a, o)
            elems.append({'co': p, 'r': r})
    p, _n = surf(t, *pts[-1])
    elems.append({'co': p, 'r': radius(len(pts) - 1) if callable(radius) else radius})
    return blob(elems, res=res)


BROWS = {
    # (elevation, azimuth) along the brow from the inner end, and its thickness
    'morbide': dict(pts=[(0.5, 10.5), (2.2, 17), (1.6, 25)], r=0.0036),
    'dritte': dict(pts=[(1.2, 10.5), (1.8, 17), (1.6, 25)], r=0.0042),
    'arcuate': dict(pts=[(-0.5, 11), (3.2, 17.5), (1.2, 26)], r=0.0032),
}


def build_brows(head, option='morbide'):
    B = BROWS[option]
    t = bvh(head)
    parts = []
    for s in (1, -1):
        pts = [(e, a * s, 0.001) for e, a in B['pts']]
        n = len(pts) - 1
        parts.append(arc_blob(t, pts, lambda u: B['r'] * (0.8 + 0.35 * sin(pi * u / n))))
    ob = join(parts, f'KitBrows_{option}')
    return finish(ob, 'brows', option, 'hair', FEAT)


NOSES = {
    'bottone': dict(axes=(0.017, 0.016, 0.015), elev=-24, tilt=0),
    'lungo': dict(axes=(0.014, 0.024, 0.015), elev=-21, tilt=35),
    'piccolo': dict(axes=(0.012, 0.012, 0.011), elev=-25, tilt=0),
}


def build_nose(head, option='bottone'):
    N = NOSES[option]
    t = bvh(head)
    p, n = surf(t, N['elev'], 0, 0.0)
    fr = frame_from(n) @ Matrix.Rotation(radians(N['tilt']), 3, 'X')
    c = p + n * N['axes'][2] * 0.45
    v, f = ellipsoid_at(c, N['axes'], fr, 20, 14)
    return finish(mesh_object(f'KitNose_{option}', v, f), 'nose', option, 'skin', FEAT)


MOUTHS = {
    'sorriso': dict(pts=[(-36.5, -13), (-39.5, -7), (-41, 0), (-39.5, 7), (-36.5, 13)], r=0.0032),
    'neutra': dict(pts=[(-39.5, -9), (-40, 0), (-39.5, 9)], r=0.003),
    'aperta': None,
}


def build_mouth(head, option='sorriso'):
    t = bvh(head)
    if option == 'aperta':
        # an open smile: a half-disc pressed into the face, dark red
        elems = []
        for i in range(9):
            a = -9 + 18 * i / 8
            depth = cos(radians(a / 9 * 80))
            for j in range(4):
                e = -37.5 - j * 1.6 * depth
                p, _n = surf(t, e, a, 0.0006)
                elems.append({'co': p, 'r': 0.0034})
        ob = blob(elems, res=0.0012)
    else:
        M = MOUTHS[option]
        pts = [(e, a, 0.0012) for e, a in M['pts']]
        n = len(pts) - 1
        ob = arc_blob(t, pts, lambda u: M['r'] * (0.8 + 0.3 * sin(pi * u / n)), res=0.0006)
    rename(ob, f'KitMouth_{option}')
    return finish(ob, 'mouth', option, 'mouth', FEAT)


def join(parts, name):
    """Joins mesh objects into the first, without operators."""
    bm = bmesh.new()
    for p in parts:
        m = p.data.copy()
        m.transform(p.matrix_world)
        bm.from_mesh(m)
        bpy.data.meshes.remove(m)
    replace(name)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in parts:
        bpy.data.objects.remove(p)
    ob = bpy.data.objects.new(name, me)
    sc.collection.objects.link(ob)
    return ob


def build_neck():
    verts, faces = [], []
    seg, rings = 20, 6
    for i in range(rings + 1):
        z = 1.43 + 0.1 * i / rings
        r = 0.036 + 0.004 * (1 - i / rings)
        for k in range(seg):
            a = 2 * pi * k / seg
            verts.append((r * cos(a), -0.004 + r * sin(a), z))
    for i in range(rings):
        for k in range(seg):
            j = (k + 1) % seg
            faces.append((i * seg + k, i * seg + j, (i + 1) * seg + j, (i + 1) * seg + k))
    return finish(mesh_object('KitNeck', verts, faces), 'neck', 'base', 'skin', FEAT)


# ---------------------------------------------------------------------------------------------
# hair: a soft mass (metaballs) cut along a hairline. The hairline is a height above the head's centre for each
# direction round it (degrees from the front, symmetric unless a side is given); everything below it goes.

HAIRS = coll('Kit Capelli')


def smooth_keys(keys, a):
    """Cosine interpolation of [(angle, value)] at angle a in [0, 180]."""
    for (a0, v0), (a1, v1) in zip(keys, keys[1:]):
        if a0 <= a <= a1:
            u = (a - a0) / (a1 - a0) if a1 > a0 else 0
            u = (1 - cos(pi * u)) / 2
            return v0 * (1 - u) + v1 * u
    return keys[-1][1]


def hairline_cutter(keys, keys_left=None, seg=144, rad=(0.03, 0.34)):
    """A solid below the hairline: a disc whose top follows the hairline's height round the head, down to the chest."""
    verts, faces = [], []
    low = C.z - 0.6
    rings = 6
    for k in range(seg):
        az = 360 * k / seg  # 0 at the front, towards +x
        a = az if az <= 180 else 360 - az
        ks = keys_left if (keys_left and az > 180) else keys
        h = C.z + smooth_keys(ks, a)
        d = Vector((sin(radians(az)), cos(radians(az)), 0))
        for i in range(rings):
            r = rad[0] + (rad[1] - rad[0]) * i / (rings - 1)
            verts.append(Vector((C.x, C.y, 0)) + d * r + Vector((0, 0, h)))
        verts.append(Vector((C.x, C.y, 0)) + d * rad[1] + Vector((0, 0, low)))
    per = rings + 1
    for k in range(seg):
        j = (k + 1) % seg
        for i in range(per - 1):
            faces.append((k * per + i, j * per + i, j * per + i + 1, k * per + i + 1))
    top = len(verts)
    verts.append(Vector((C.x, C.y, C.z - 0.05)))
    bottom = len(verts)
    verts.append(Vector((C.x, C.y, low)))
    for k in range(seg):
        j = (k + 1) % seg
        faces.append((top, j * per, k * per))
        faces.append((bottom, k * per + per - 1, j * per + per - 1))
    return mesh_object('KitCutter', verts, faces)


def fib_points(n, zmin=-1.0):
    """Evenly spread unit directions with z above zmin."""
    out = []
    g = pi * (3 - 5 ** 0.5)
    i = 0
    while len(out) < n and i < n * 20:
        z = 1 - 2 * (i + 0.5) / (n * 20 / 1)
        i += 1
    out = []
    total = int(n * 2 / (1 - zmin)) + 1
    for i in range(total):
        z = 1 - 2 * (i + 0.5) / total
        if z < zmin:
            break
        r = (1 - z * z) ** 0.5
        out.append(Vector((r * cos(g * i), r * sin(g * i), z)))
    return out


HEAD_R = FACES['tondo']['r']


def cap(dx=0.0, dy=0.0, dz=0.0, grow=(1.0, 1.0, 1.0), extra=0.012):
    """The head's upper shell as one ellipsoid, `extra` thicker than the skull."""
    rx, ry, rz = HEAD_R
    return {'co': C + Vector((dx, dy, dz)), 'axes': ((rx + extra) * grow[0], (ry + extra) * grow[1], (rz + extra * 0.9) * grow[2])}


SHORT_LINE = [(0, 0.056), (25, 0.052), (50, 0.036), (66, 0.012), (74, -0.03), (80, -0.028), (86, 0.02), (104, 0.024), (118, -0.02),
              (145, -0.066), (180, -0.078)]


def hair_short():
    rx, ry, rz = HEAD_R
    elems = [cap(0, -0.006, 0.004, extra=0.011)]
    # volume on top, swept to the figure's right from a part on its left
    elems.append({'co': C + Vector((-0.02, 0.05, 0.1)), 'axes': (0.075, 0.06, 0.04)})
    elems.append({'co': C + Vector((0.035, 0.02, 0.105)), 'axes': (0.07, 0.07, 0.04)})
    return elems, SHORT_LINE, None


def hair_buzz():
    return [cap(0, -0.003, 0.0, extra=0.005)], [(0, 0.064), (40, 0.05), (66, 0.018), (74, -0.012), (84, 0.02), (104, 0.022), (125, -0.03), (180, -0.07)], None


def hair_curly():
    rx, ry, rz = HEAD_R
    elems = [cap(0, -0.006, 0.0, extra=0.006)]
    for d in fib_points(90, zmin=-0.55):
        if d.y > 0.55 and d.z < 0.35:
            continue
        p = C + Vector((d.x * (rx + 0.018), d.y * (ry + 0.018) - 0.006, d.z * (rz + 0.012) + 0.01))
        elems.append({'co': p, 'r': 0.03})
    line = [(0, 0.06), (30, 0.054), (55, 0.034), (68, 0.012), (76, -0.018), (86, 0.022), (104, 0.024), (120, -0.02), (150, -0.062), (180, -0.07)]
    return elems, line, None


def hair_afro():
    rx, ry, rz = HEAD_R
    # thin where it meets the forehead and the ears, thick on top: a round mass, with soft bumps on the outside
    elems = [{'co': C + Vector((0, -0.02, 0.035)), 'axes': (rx + 0.028, ry + 0.02, rz + 0.04)}]
    for d in fib_points(110, zmin=-0.45):
        if d.y > 0.6 and d.z < 0.3:
            continue
        t = (d.z + 0.45) / 1.45
        off = (0.012 + 0.05 * t) * (1 - 0.45 * max(0.0, d.y) * (1 - t))
        p = C + Vector((d.x * (rx + off), d.y * (ry + off) - 0.01, d.z * (rz + off) + 0.02))
        elems.append({'co': p, 'r': 0.022 + 0.018 * t})
    line = [(0, 0.058), (35, 0.05), (60, 0.03), (70, 0.008), (78, -0.02), (86, 0.022), (104, 0.024), (125, -0.03), (180, -0.075)]
    return elems, line, None


def hair_bob():
    rx, ry, rz = HEAD_R
    elems = [cap(0, -0.008, 0.004, extra=0.014)]
    # the sides and back fall to the jaw, close to the face
    for z in (-0.02, -0.06, -0.1):
        elems.append({'co': C + Vector((0, -0.012, z)), 'axes': (rx + 0.016, ry + 0.012, 0.05)})
    line = [(0, 0.022), (38, 0.018), (46, 0.0), (52, -0.14), (180, -0.14)]
    return elems, line, None


def hair_long():
    rx, ry, rz = HEAD_R
    elems = [cap(0, -0.008, 0.004, extra=0.012)]
    # a curtain behind the ears, falling to the shoulders and a little outwards
    for i in range(7):
        u = i / 6
        z = 0.0 - 0.24 * u
        elems.append({'co': C + Vector((0, -0.045 - 0.02 * u, z)), 'axes': (rx * (1.0 - 0.22 * u), 0.07 - 0.02 * u, 0.045)})
    # locks either side of the face, in front of the ears
    for s in (1, -1):
        elems.append({'co': C + Vector((s * (rx - 0.012), 0.008, -0.08)), 'axes': (0.02, 0.03, 0.11),
                      'rot': Quaternion((1, 0, 0), radians(10))})
    # a centre part: two soft swells either side
    for s in (1, -1):
        elems.append({'co': C + Vector((0.035 * s, 0.035, 0.085)), 'axes': (0.055, 0.06, 0.04)})
    line = [(0, 0.062), (18, 0.05), (34, 0.02), (46, -0.02), (54, -0.3), (180, -0.3)]
    return elems, line, None


def hair_ponytail():
    rx, ry, rz = HEAD_R
    elems = [cap(0, -0.004, 0.0, extra=0.008)]
    elems.append({'co': C + Vector((0, -0.125, 0.04)), 'r': 0.026})
    for i in range(6):
        u = i / 5
        elems.append({'co': C + Vector((0, -0.15 - 0.03 * sin(u * 1.5), 0.025 - 0.15 * u)), 'r': 0.032 * (1 - 0.45 * u)})
    line = [(0, 0.06), (30, 0.054), (55, 0.034), (68, 0.012), (76, -0.018), (86, 0.022), (104, 0.024), (120, -0.02), (150, -0.07), (180, -0.08)]
    return elems, line, None


def hair_bun():
    elems, line, _ = hair_ponytail()
    elems = elems[:1] + [{'co': C + Vector((0, -0.06, 0.15)), 'r': 0.05}]
    return elems, line, None


HAIR_STYLES = {'corti': hair_short, 'rasati': hair_buzz, 'ricci': hair_curly, 'afro': hair_afro, 'caschetto': hair_bob,
               'lunghi': hair_long, 'coda': hair_ponytail, 'chignon': hair_bun}


def above_cutter(keys, seg=144, rad=0.34):
    """A solid above a line round the head: what a hat covers, so the hair under it can go."""
    verts, faces = [], []
    high = C.z + 0.6
    for k in range(seg):
        az = 360 * k / seg
        a = az if az <= 180 else 360 - az
        h = C.z + smooth_keys(keys, a)
        d = Vector((sin(radians(az)), cos(radians(az)), 0))
        base = Vector((C.x, C.y, 0))
        verts += [base + d * 0.02 + Vector((0, 0, h)), base + d * rad + Vector((0, 0, h)), base + d * rad + Vector((0, 0, high))]
    for k in range(seg):
        j = (k + 1) % seg
        for i in range(2):
            faces.append((k * 3 + i + 1, j * 3 + i + 1, j * 3 + i, k * 3 + i))
    top, bottom = len(verts), len(verts) + 1
    verts += [Vector((C.x, C.y, high)), Vector((C.x, C.y, C.z + 0.05))]
    for k in range(seg):
        j = (k + 1) % seg
        faces.append((top, k * 3 + 2, j * 3 + 2))
        faces.append((bottom, j * 3, k * 3))
    return mesh_object('KitCutter', verts, faces)


HAIR_FACES = {'afro': 7000, 'ricci': 6000}


def build_hair(option='corti', faces=None, under=None):
    """`under`: the name of a hat; the hair keeps only what falls below its edge."""
    elems, line, line_left = HAIR_STYLES[option]()
    ob = blob(elems, res=0.004)
    carve(ob, hairline_cutter(line, line_left), remesh=0 if under else 0.0025)
    if under:
        carve(ob, above_cutter([(a, h - 0.006) for a, h in HAT_LINES[under]]))
    decimate(ob, faces or HAIR_FACES.get(option, 3000))
    name = f'KitHair_{option}' + (f'_{under}' if under else '')
    rename(ob, name)
    finish(ob, 'hair', option, 'hair', HAIRS)
    if under:
        ob['under'] = under
    return ob


# ---------------------------------------------------------------------------------------------
# showcase: copies of an assembled head side by side, each with its own colours and options (for looking, not export)

SHOW = coll('Vetrina')


def show_copy(ob, dx, colour=None, name=None):
    c = ob.copy()
    c.location = ob.location + Vector((dx, 0, 0))
    if colour:
        c.color = (*lin(colour), 1)
    for cl in c.users_collection:
        cl.objects.unlink(c)
    SHOW.objects.link(c)
    if name:
        c.name = name
    return c


def clear_show():
    for o in list(SHOW.objects):
        bpy.data.objects.remove(o)


# ---------------------------------------------------------------------------------------------
# headwear: the same method as hair (a mass cut along a line), plus parts added after the cut

HATS = coll('Kit Copricapi')


def ellipsoid_cutter(centre, axes, rot=None):
    fr = rot.to_matrix() if rot else None
    v, f = ellipsoid_at(centre, axes, fr, 40, 28)
    return mesh_object('KitCutter', v, f)


def band(line, lift, thick, n=90, out=0.006):
    """Balls along a hairline, just outside the head: a rolled edge (a beanie's fold, a turban's lower wrap)."""
    rx, ry, rz = HEAD_R
    elems = []
    for k in range(n):
        az = 360 * k / n
        a = az if az <= 180 else 360 - az
        h = smooth_keys(line, a) + lift
        e = math.asin(max(-1, min(1, h / rz)))
        d = Vector((sin(radians(az)) * cos(e), cos(radians(az)) * cos(e), sin(e)))
        p = C + Vector((d.x * (rx + out + thick * 0.4), d.y * (ry + out + thick * 0.4), h))
        elems.append({'co': p, 'r': thick})
    return elems


BEANIE_LINE = [(0, 0.062), (40, 0.056), (80, 0.03), (120, 0.0), (180, -0.03)]


def build_beanie():
    rx, ry, rz = HEAD_R
    elems = [cap(0, -0.006, 0.018, grow=(1.0, 1.0, 1.06), extra=0.016)]
    body = blob(elems, res=0.004)
    carve(body, hairline_cutter(BEANIE_LINE))
    fold = blob(band(BEANIE_LINE, 0.012, 0.016), res=0.003)
    ob = join([body, fold], 'KitHat_berretto')
    decimate(ob, 3500)
    return finish(ob, 'hat', 'berretto', 'accessory', HATS)


CAP_LINE = [(0, 0.072), (40, 0.064), (90, 0.035), (140, 0.01), (180, 0.0)]
HAT_LINES = {'berretto': BEANIE_LINE, 'cappellino': CAP_LINE}


def build_cap():
    rx, ry, rz = HEAD_R
    line = CAP_LINE
    body = blob([cap(0, -0.004, 0.012, extra=0.013)], res=0.004)
    carve(body, hairline_cutter(line))
    # the visor: a flattened, slightly curved lozenge in front, tipped down a little
    t = Quaternion((1, 0, 0), radians(-12))
    visor = blob([{'co': C + Vector((0, ry + 0.035, 0.072)), 'axes': (0.075, 0.065, 0.007), 'rot': t},
                  {'co': C + Vector((0, ry + 0.012, 0.07)), 'axes': (0.09, 0.03, 0.008), 'rot': t}], res=0.0025)
    button = blob([{'co': C + Vector((0, -0.004, rz + 0.026)), 'r': 0.007}], res=0.002)
    ob = join([body, visor, button], 'KitHat_cappellino')
    decimate(ob, 3500)
    return finish(ob, 'hat', 'cappellino', 'accessory', HATS)


def build_hijab():
    rx, ry, rz = HEAD_R
    elems = [cap(0, -0.004, 0.006, extra=0.022)]
    # it falls round the neck to the shoulders, widening
    for i in range(6):
        u = i / 5
        elems.append({'co': C + Vector((0, -0.01 + 0.012 * u, -0.06 - 0.16 * u)), 'axes': (rx * (0.9 + 0.45 * u), ry * (0.85 + 0.35 * u), 0.06)})
    ob = blob(elems, res=0.004)
    # the face shows through an oval
    carve(ob, ellipsoid_cutter(C + Vector((0, 0.11, -0.042)), (0.088, 0.08, 0.108)), smooth=6)
    rename(ob, 'KitHat_hijab')
    decimate(ob, 3500)
    return finish(ob, 'hat', 'hijab', 'accessory', HATS)


def build_turban():
    rx, ry, rz = HEAD_R
    line = [(0, 0.058), (40, 0.05), (80, 0.035), (130, 0.01), (180, 0.0)]
    body = blob([cap(0, -0.008, 0.03, grow=(1.02, 1.02, 1.1), extra=0.022)], res=0.004)
    carve(body, hairline_cutter(line))
    # wraps: rings crossing at the front, tilted either way
    parts = [body]
    for k, (tilt, lift) in enumerate(((14, 0.0), (-14, 0.028), (10, 0.056))):
        elems = []
        for i in range(70):
            a = 2 * pi * i / 70
            d = Vector((sin(a), cos(a), 0))
            z = line[0][1] + lift + 0.012 + d.y * sin(radians(tilt)) * 0.1 + (0.02 if d.y < 0 else 0) * (-d.y)
            grow = 1 - 0.16 * (lift / 0.056)
            p = C + Vector((d.x * (rx + 0.026) * grow, d.y * (ry + 0.026) * grow - 0.006, z))
            elems.append({'co': p, 'r': 0.016})
        parts.append(blob(elems, res=0.003))
    ob = join(parts, 'KitHat_turbante')
    decimate(ob, 4000)
    return finish(ob, 'hat', 'turbante', 'accessory', HATS)


HAT_STYLES = {'berretto': build_beanie, 'cappellino': build_cap, 'hijab': build_hijab, 'turbante': build_turban}


# ---------------------------------------------------------------------------------------------
# beards: a mass round the lower face, with the upper face, the back and the mouth cut away

BEARDS = coll('Kit Barbe')


def build_beard(option='barba', head=None):
    rx, ry, rz = HEAD_R
    t = bvh(head)
    mouth, mn = surf(t, -40, 0)
    if option == 'baffi':
        pts = [(-31.5, a, 0.003) for a in (-15, -9, -4, 0, 4, 9, 15)]
        pts = [(e - (abs(a) / 15) ** 2 * 5, a, o) for e, a, o in pts]
        ob = arc_blob(t, pts, lambda u: 0.0085 * (0.45 + 0.55 * sin(pi * u / 6)), res=0.0012)
    elif option == 'barba':
        # blobs laid on the face itself, from ear to ear along the jaw, round the mouth, a little fuller at the chin
        elems = []
        for ai in range(-88, 89, 4):
            a = abs(ai)
            top = -20 if a > 60 else (-31 if a > 22 else -33)
            for e in range(-86, int(top) + 1, 3):
                if -47 < e < -34 and a < 19:
                    continue
                chin = max(0.0, 1 - a / 40) * max(0.0, (-50 - e) / 30)
                p, _n = surf(t, e, ai, 0.002 + 0.008 * chin)
                elems.append({'co': p, 'r': 0.011 + 0.006 * chin})
        ob = blob(elems, res=0.003)
        s_ = ob.modifiers.new('sm', 'SMOOTH')
        s_.factor, s_.iterations = 0.5, 3
        apply_mods(ob)
        decimate(ob, 3000)
    else:  # pizzetto: a short tuft on the chin and a thin line from the lip
        elems = []
        for ai in range(-14, 15, 3):
            for e in range(-72, -47, 3):
                p, _n = surf(t, e, ai, 0.003)
                elems.append({'co': p, 'r': 0.009})
        for e in (-45, -47):
            p, _n = surf(t, e, 0, 0.002)
            elems.append({'co': p, 'r': 0.005})
        ob = blob(elems, res=0.002)
        decimate(ob, 1500)
    rename(ob, f'KitBeard_{option}')
    return finish(ob, 'beard', option, 'hair', BEARDS)


# ---------------------------------------------------------------------------------------------
# glasses: thin swept tubes (metaballs this thin would be slow)

GLASSES = coll('Kit Occhiali')


def tube_mesh(points, r, closed=False, seg=8):
    pts = [Vector(p) for p in points]
    n = len(pts)
    verts, faces = [], []
    prev = None
    for i, p in enumerate(pts):
        a = pts[(i - 1) % n] if (closed or i > 0) else p
        b = pts[(i + 1) % n] if (closed or i < n - 1) else p
        tng = (b - a).normalized()
        if prev is None:
            ref = Vector((0, 0, 1)) if abs(tng.z) < 0.9 else Vector((1, 0, 0))
            nrm = tng.cross(ref).normalized()
        else:
            nrm = (prev - tng * prev.dot(tng)).normalized()
        prev = nrm
        bn = tng.cross(nrm)
        for k in range(seg):
            ang = 2 * pi * k / seg
            verts.append(p + (nrm * cos(ang) + bn * sin(ang)) * r)
    rows = n if closed else n - 1
    for i in range(rows):
        j = (i + 1) % n
        for k in range(seg):
            kk = (k + 1) % seg
            faces.append((i * seg + k, i * seg + kk, j * seg + kk, j * seg + k))
    if not closed:
        faces.append(tuple(reversed(range(seg))))
        faces.append(tuple((n - 1) * seg + k for k in range(seg)))
    return verts, faces


def build_glasses(option='tonde', head=None):
    t = bvh(head)
    E = EYES['ovali']
    verts, faces = [], []

    def add(vf):
        o = len(verts)
        verts.extend(vf[0])
        faces.extend(tuple(i + o for i in q) for q in vf[1])

    inner = []
    for s in (1, -1):
        eye, n = surf(t, E['elev'], E['azim'] * s, 0.0)
        centre = eye + Vector((0, 0.016, 0.002))
        fr = frame_from(Vector((0, 1, 0)))
        ring = []
        for i in range(40):
            a = 2 * pi * i / 40
            if option == 'tonde':
                x, y = 0.024 * cos(a), 0.022 * sin(a)
            else:  # rounded rectangle: a superellipse
                c, sn = cos(a), sin(a)
                x = 0.027 * math.copysign(abs(c) ** 0.45, c)
                y = 0.018 * math.copysign(abs(sn) ** 0.45, sn)
            ring.append(centre + fr @ Vector((x, y, 0)))
        add(tube_mesh(ring, 0.0022, closed=True))
        inner.append(centre + fr @ Vector((0.024 * -s * -1 if False else -0.0, 0, 0)))
        # the temple: from the outer edge of the rim back to above the ear
        outer = centre + Vector((0.026 * s if option == 'tonde' else 0.029 * s, 0, 0.004))
        ear, _en = surf(t, 2, 88 * s, 0.004)
        mid = outer.lerp(ear, 0.5) + Vector((0.012 * s, 0, 0.004))
        add(tube_mesh([outer, mid, ear], 0.0018))
    # the bridge over the nose
    l, r = inner[1], inner[0]
    a = l + Vector((0.024 if option == 'tonde' else 0.027, 0, 0.004))
    b = r - Vector((0.024 if option == 'tonde' else 0.027, 0, -0.004))
    mid = a.lerp(b, 0.5) + Vector((0, 0.004, 0.006))
    add(tube_mesh([a, a.lerp(mid, 0.5) + Vector((0, 0, 0.002)), mid, mid.lerp(b, 0.5) + Vector((0, 0, 0.002)), b], 0.002))
    ob = mesh_object(f'KitGlasses_{option}', verts, faces)
    return finish(ob, 'glasses', option, 'accessory', GLASSES)


# ---------------------------------------------------------------------------------------------
# the whole kit, headless:
#
#     blender -b --factory-startup -P scripts/lab/avatar_kit.py -- public/lab/avatar-kit.glb
#
# Every option sits where it goes on the figure. Hairstyles also come in a version cut to sit under each hat that
# leaves hair showing (KitHair_<style>_<hat>); under the hijab and the turban no hair shows.


def build_all():
    head = build_head('tondo')
    build_neck()
    build_ears(head)
    for o in EYES:
        build_eyes(head, o)
    for o in BROWS:
        build_brows(head, o)
    for o in NOSES:
        build_nose(head, o)
    for o in MOUTHS:
        build_mouth(head, o)
    for st in HAIR_STYLES:
        build_hair(st)
        for hat in HAT_LINES:
            build_hair(st, under=hat)
    for fn in HAT_STYLES.values():
        fn()
    for o in ('barba', 'baffi', 'pizzetto'):
        build_beard(o, head)
    for o in ('tonde', 'rettangolari'):
        build_glasses(o, head)


def export(path):
    import os
    kit = [o for o in bpy.data.objects if o.type == 'MESH' and 'slot' in o]
    bpy.ops.object.select_all(action='DESELECT')
    for o in kit:
        o.select_set(True)
        o.data.name = o.name
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, export_extras=True, export_yup=True,
                              export_apply=False, export_animations=False, export_cameras=False, export_lights=False)
    tris = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in kit)
    print('EXPORTED', path, os.path.getsize(path), len(kit), 'meshes', tris, 'triangles')
    for o in sorted(kit, key=lambda o: o.name):
        print(' ', o.name, sum(len(p.vertices) - 2 for p in o.data.polygons))


if __name__ == '__main__':
    import sys
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    HEADS, FEAT, HAIRS, HATS, BEARDS, GLASSES, SHOW = (coll(n) for n in ('Kit Teste', 'Kit Lineamenti', 'Kit Capelli', 'Kit Copricapi', 'Kit Barbe', 'Kit Occhiali', 'Vetrina'))
    build_all()
    export(argv[0] if argv else '/tmp/avatar-kit.glb')
