"""
The chemistry laboratory of /laboratorio, modelled in Blender and exported as one GLB.

Run it headless with Blender 5.2 or later:

    blender -b --factory-startup -P scripts/lab/build_lab.py -- public/lab/laboratorio.glb [preview-dir]

Everything is built from code: glassware is lathed from a profile with a real wall thickness, the
wet parts carry their inner profile as glTF extras (`inner`, in metres, local to the node) so the
page can compute liquid levels from volumes, and the pieces the student uses are Empties with a
`label` extra. Units are metres, Z up; the exporter turns Z up into Y up.

With a second argument it also renders a few EEVEE previews into that directory, to check the models.
"""
import bpy, bmesh, math, json, sys, os, random, tempfile
from math import pi, sin, cos, atan2, sqrt, radians
from mathutils import Vector, Matrix, Euler

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = os.path.abspath(argv[0]) if argv else '/tmp/laboratorio.glb'
PREVIEW = os.path.abspath(argv[1]) if len(argv) > 1 else None
TEXDIR = tempfile.mkdtemp(prefix='lab-tex-')

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
random.seed(7)

Z0 = 0.90          # bench top
WALL_Y = 0.42      # back wall, the bench stands against it


# ---------------------------------------------------------------------------------------------
# Materials
# ---------------------------------------------------------------------------------------------

def lin(h):
    """sRGB hex to linear RGB."""
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)

MATS = {}

def material(name, color='#cccccc', metallic=0.0, rough=0.5, alpha=1.0, transmission=0.0, ior=1.45,
             emission=None, estr=0.0, coat=0.0, image=None, double=False):
    if name in MATS:
        return MATS[name]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = (*lin(color), 1)
    p.inputs['Metallic'].default_value = metallic
    p.inputs['Roughness'].default_value = rough
    p.inputs['IOR'].default_value = ior
    p.inputs['Transmission Weight'].default_value = transmission
    p.inputs['Coat Weight'].default_value = coat
    if emission:
        p.inputs['Emission Color'].default_value = (*lin(emission), 1)
        p.inputs['Emission Strength'].default_value = estr
    if alpha < 1:
        p.inputs['Alpha'].default_value = alpha
        m.surface_render_method = 'BLENDED'
    if image:
        tex = nt.nodes.new('ShaderNodeTexImage')
        tex.image = bpy.data.images.load(image)
        nt.links.new(tex.outputs['Color'], p.inputs['Base Color'])
    m.use_backface_culling = not double
    MATS[name] = m
    return m

M = {}
def mats():
    M['glass'] = material('Glass', '#f4fbff', rough=0.03, transmission=1.0, ior=1.47, double=True)
    M['glassAmber'] = material('GlassAmber', '#b8650f', rough=0.05, transmission=1.0, ior=1.47, double=True)
    M['lens'] = material('GlassLens', '#eaf6ff', rough=0.05, transmission=1.0, ior=1.49, double=True)
    M['printWhite'] = material('PrintWhite', '#f7f7f2', rough=0.6)
    M['printBlack'] = material('PrintBlack', '#1a1a1a', rough=0.6)
    M['printBlue'] = material('PrintBlue', '#1d4f91', rough=0.6)
    M['label'] = material('LabelPaper', '#fbf8ef', rough=0.85)
    M['labelRed'] = material('LabelRed', '#c8102e', rough=0.7)
    M['steel'] = material('Steel', '#c9ccd1', metallic=1.0, rough=0.28)
    M['chrome'] = material('Chrome', '#e4e6ea', metallic=1.0, rough=0.12)
    M['brass'] = material('Brass', '#c9a052', metallic=1.0, rough=0.3)
    M['iron'] = material('Iron', '#3b3d40', metallic=0.8, rough=0.55)
    M['hammer'] = material('HammerBlue', '#2c3e57', metallic=0.3, rough=0.45)
    M['ceramic'] = material('Ceramic', '#e7e2d8', rough=0.9)
    M['porcelain'] = material('Porcelain', '#fbfbf8', rough=0.12, coat=0.5)
    M['rubberRed'] = material('RubberRed', '#b3151b', rough=0.55)
    M['hose'] = material('RubberOrange', '#d9531e', rough=0.5)
    M['yellow'] = material('PlasticYellow', '#f2c318', rough=0.35)
    M['white'] = material('PlasticWhite', '#f1f1ee', rough=0.4)
    M['black'] = material('PlasticBlack', '#1e1f22', rough=0.45)
    M['red'] = material('PlasticRed', '#c62828', rough=0.35)
    M['green'] = material('PlasticGreen', '#2e7d4f', rough=0.45)
    M['paper'] = material('FilterPaper', '#fdfdfb', rough=1.0, double=True)
    M['cuo'] = material('PowderCuO', '#141312', rough=1.0)
    M['epoxy'] = material('Epoxy', '#2a2c2f', rough=0.62)
    M['cabinet'] = material('CabinetLaminate', '#d8cdb8', rough=0.55)
    M['cabinetDoor'] = material('CabinetDoor', '#5f7f93', rough=0.45)
    M['plinth'] = material('Plinth', '#2a2b2e', rough=0.6)
    M['wallPaint'] = material('WallPaint', '#e9e6df', rough=0.9)
    M['ceiling'] = material('Ceiling', '#f2f1ee', rough=0.95)
    M['frame'] = material('WindowFrame', '#f4f4f2', rough=0.4)
    M['sky'] = material('Sky', '#dcecf7', emission='#dcecf7', estr=2.5)
    M['lamp'] = material('LampPanel', '#fffdf6', emission='#fffaf0', estr=4.0)
    M['wood'] = material('Wood', '#b98a5a', rough=0.6)
    M['thermoRed'] = material('ThermoRed', '#d0161b', rough=0.3)
    M['notebook'] = material('NotebookCover', '#2d4a73', rough=0.6)
    M['pages'] = material('Pages', '#f5f2e8', rough=0.9)
    M['washBottle'] = material('WashBottle', '#e9f1f5', rough=0.3)
    M['strap'] = material('Strap', '#23262b', rough=0.8)
    M['gogFrame'] = material('GogglesFrame', '#2a6fb0', rough=0.5)
    # the ceramic centre of the gauze glows when it is hot: the page drives the emission
    M['gauzeHot'] = material('GauzeCeramic', '#d8d2c6', rough=0.95, emission='#ff5a14', estr=0.0)
    for name, col in PT_COLORS.items():
        M['pt_' + name] = material('PT_' + name, col, rough=0.7)


PT_COLORS = {
    'alkali': '#e8665a', 'earth': '#f2a65a', 'transition': '#f4d35e', 'post': '#9ccf7c',
    'metalloid': '#62c2b0', 'nonmetal': '#6aa8e0', 'halogen': '#a78bd8', 'noble': '#c678c9',
    'lanth': '#f29bb5', 'act': '#e07aa0'
}


# ---------------------------------------------------------------------------------------------
# Geometry
# ---------------------------------------------------------------------------------------------

scene_objs = []

def link(ob, parent=None):
    scene.collection.objects.link(ob)
    if parent is not None:
        ob.parent = parent
    return ob


def lathe_data(prof, seg=48, closed=False, a0=0.0, a1=2 * pi):
    """Revolve a (r, z) polyline around Z. Points with r = 0 become a single vertex."""
    full = abs(a1 - a0 - 2 * pi) < 1e-9
    n_ang = seg if full else seg + 1
    verts, rings, faces = [], [], []
    for r, z in prof:
        if r < 1e-7:
            rings.append([len(verts)] * n_ang)
            verts.append((0.0, 0.0, z))
        else:
            ring = []
            for i in range(n_ang):
                a = a0 + (a1 - a0) * i / seg
                ring.append(len(verts))
                verts.append((r * cos(a), r * sin(a), z))
            rings.append(ring)
    n = len(prof)
    for k in range(n if closed else n - 1):
        A, B = rings[k], rings[(k + 1) % n]
        for i in range(seg):
            j = (i + 1) % n_ang
            f = []
            for v in (A[i], A[j], B[j], B[i]):
                if v not in f:
                    f.append(v)
            if len(f) >= 3:
                faces.append(f)
    return verts, faces


def box_data(size, center=(0, 0, 0)):
    sx, sy, sz = (s / 2 for s in size)
    cx, cy, cz = center
    v = [(cx + x * sx, cy + y * sy, cz + z * sz) for x in (-1, 1) for y in (-1, 1) for z in (-1, 1)]
    f = [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)]
    return v, f


def catmull(points, per=8):
    """A smooth curve through the control points."""
    P = [Vector(p) for p in points]
    P = [P[0] + (P[0] - P[1])] + P + [P[-1] + (P[-1] - P[-2])]
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for s in range(per):
            t = s / per
            t2, t3 = t * t, t * t * t
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
    out.append(P[-2])
    return [tuple(p) for p in out]


def tube_data(pts, r, seg=12, caps=True):
    """Sweep a circle along a polyline, with parallel-transport frames."""
    P = [Vector(p) for p in pts]
    n = len(P)
    T = []
    for i in range(n):
        d = (P[min(i + 1, n - 1)] - P[max(i - 1, 0)])
        T.append(d.normalized())
    up = Vector((0, 0, 1)) if abs(T[0].z) < 0.9 else Vector((1, 0, 0))
    N = [T[0].cross(up).normalized()]
    for i in range(1, n):
        v = N[-1] - T[i] * N[-1].dot(T[i])
        N.append(v.normalized() if v.length > 1e-9 else N[-1])
    verts, faces = [], []
    rr = r if isinstance(r, (list, tuple)) else [r] * n
    for i in range(n):
        B = T[i].cross(N[i])
        for k in range(seg):
            a = 2 * pi * k / seg
            verts.append(tuple(P[i] + (N[i] * cos(a) + B * sin(a)) * rr[i]))
    for i in range(n - 1):
        for k in range(seg):
            j = (k + 1) % seg
            faces.append((i * seg + k, i * seg + j, (i + 1) * seg + j, (i + 1) * seg + k))
    if caps:
        c0 = len(verts); verts.append(tuple(P[0]))
        c1 = len(verts); verts.append(tuple(P[-1]))
        for k in range(seg):
            j = (k + 1) % seg
            faces.append((c0, j, k))
            faces.append((c1, (n - 1) * seg + k, (n - 1) * seg + j))
    return verts, faces


class MB:
    """Collects parts that share a material into one mesh."""
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

    def box(self, size, center=(0, 0, 0), mat=None):
        return self.add(box_data(size, center), mat)

    def lathe(self, prof, seg=48, closed=False, mat=None, a0=0.0, a1=2 * pi):
        return self.add(lathe_data(prof, seg, closed, a0, a1), mat)

    def tube(self, pts, r, seg=12, caps=True, mat=None):
        return self.add(tube_data(pts, r, seg, caps), mat)

    def obj(self, name, material_, parent=None, loc=(0, 0, 0), rot=(0, 0, 0), smooth=True, angle=38,
            recalc=True, bevel=0.0):
        me = bpy.data.meshes.new(name)
        me.from_pydata(self.v, [], self.f)
        me.validate(clean_customdata=False)
        bm = bmesh.new()
        bm.from_mesh(me)
        bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-7)
        if recalc:
            bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        bm.to_mesh(me)
        bm.free()
        if smooth:
            me.shade_smooth()
            if angle:
                me.set_sharp_from_angle(angle=radians(angle))
        me.materials.append(material_)
        ob = bpy.data.objects.new(name, me)
        ob.location = loc
        ob.rotation_euler = rot
        link(ob, parent)
        if bevel:
            b = ob.modifiers.new('bevel', 'BEVEL')
            b.width = bevel
            b.segments = 3
            b.limit_method = 'ANGLE'
        return ob


def mesh(name, data, material_, **kw):
    mb = MB()
    mb.add(data)
    return mb.obj(name, material_, **kw)


def box(name, size, loc, material_, parent=None, bevel=0.0, rot=(0, 0, 0)):
    return MB().box(size).obj(name, material_, parent=parent, loc=loc, rot=rot, smooth=False, bevel=bevel)


def empty(name, loc=(0, 0, 0), rot=(0, 0, 0), parent=None, **props):
    e = bpy.data.objects.new(name, None)
    e.empty_display_size = 0.02
    e.location = loc
    e.rotation_euler = rot
    link(e, parent)
    for k, v in props.items():
        e[k] = json.dumps(v) if isinstance(v, (list, dict)) else v
    return e


def arc(cx, cz, r, a0, a1, n=6):
    return [(cx + r * cos(a0 + (a1 - a0) * i / n), cz + r * sin(a0 + (a1 - a0) * i / n)) for i in range(n + 1)]


def offset_in(pts, t):
    """Offset an outer profile (from the axis at the bottom, going out and up) inwards by t."""
    out = []
    n = len(pts)
    for i in range(n):
        a = Vector(pts[max(i - 1, 0)])
        b = Vector(pts[min(i + 1, n - 1)])
        d = (b - a).normalized()
        nrm = Vector((d.y, -d.x))  # outward
        p = Vector(pts[i]) - nrm * t
        out.append((max(p.x, 0.0) if i else 0.0, p.y))
    return out


def wall(outer, t, lip=None):
    """A vessel: outer profile + rounded rim + inner profile. Returns (full profile, inner profile)."""
    inner = offset_in(outer, t)
    ro, zt = outer[-1]
    ri = inner[-1][0]
    inner[-1] = (ri, zt)
    rim = arc((ro + ri) / 2, zt, (ro - ri) / 2, 0, pi, 6)[1:-1]
    return outer + rim + list(reversed(inner)), inner


def volume_below(inner, h):
    """Volume (m³) of a lathed cavity below height h."""
    v = 0.0
    for (r1, z1), (r2, z2) in zip(inner, inner[1:]):
        if z2 <= z1:
            continue
        lo, hi = z1, min(z2, h)
        if hi <= lo:
            break
        ra = r1 + (r2 - r1) * (lo - z1) / (z2 - z1)
        rb = r1 + (r2 - r1) * (hi - z1) / (z2 - z1)
        v += pi * (hi - lo) / 3 * (ra * ra + ra * rb + rb * rb)
    return v


def height_for(inner, vol):
    lo, hi = inner[0][1], inner[-1][1]
    for _ in range(60):
        mid = (lo + hi) / 2
        if volume_below(inner, mid) < vol:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def spout(ob, top, depth=0.01, out=0.004, up=0.0015, power=10):
    """Pull the rim out at +X to make a pouring lip."""
    for v in ob.data.vertices:
        if v.co.z > top - depth:
            w = max(0.0, cos(atan2(v.co.y, v.co.x))) ** power
            t = (v.co.z - (top - depth)) / depth
            r = sqrt(v.co.x ** 2 + v.co.y ** 2)
            if r > 1e-6:
                k = w * t * t * out
                v.co.x += v.co.x / r * k
                v.co.y += v.co.y / r * k
                v.co.z += w * t * up


def text_data(s, size, align='CENTER'):
    cu = bpy.data.curves.new('t', 'FONT')
    cu.body = s
    cu.size = size
    cu.align_x = align
    cu.align_y = 'CENTER'
    cu.resolution_u = 3
    ob = bpy.data.objects.new('t', cu)
    scene.collection.objects.link(ob)
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    bpy.data.objects.remove(ob)
    bpy.data.curves.remove(cu)
    verts = [tuple(v.co) for v in me.vertices]
    faces = [tuple(p.vertices) for p in me.polygons]
    bpy.data.meshes.remove(me)
    return verts, faces


def formula_data(s, size):
    """'H_2SO_4 1 M' → one flat mesh, with the digits after _ as subscripts, centred on the origin."""
    parts, i = [], 0
    while i < len(s):
        if s[i] == '_':
            j = i + 1
            while j < len(s) and s[j].isdigit():
                j += 1
            parts.append((s[i + 1:j], True))
            i = j
        else:
            j = i
            while j < len(s) and s[j] != '_':
                j += 1
            parts.append((s[i:j], False))
            i = j
    verts, faces, x = [], [], 0.0
    for txt, sub in parts:
        sz = size * (0.62 if sub else 1)
        lead = len(txt) - len(txt.lstrip(' '))
        trail = len(txt) - len(txt.rstrip(' '))
        x += lead * size * 0.32
        core = txt.strip(' ')
        if core:
            v, f = text_data(core, sz, 'LEFT')
            xs = [p[0] for p in v]
            w = max(xs) - min(xs)
            dx = x - min(xs)
            dy = -size * 0.28 if sub else 0.0
            o = len(verts)
            verts += [(p[0] + dx, p[1] + dy, 0) for p in v]
            faces += [[k + o for k in ff] for ff in f]
            x += w + size * 0.06
        x += trail * size * 0.32
    ys = [p[1] for p in verts]
    cy = (max(ys) + min(ys)) / 2
    return [(p[0] - x / 2, p[1] - cy, 0) for p in verts], faces


def on_cylinder(data, r, z, ang=-pi / 2, lift=0.0002):
    """Stand a flat XY mesh upright facing outwards at angle `ang` and wrap it around a cylinder of radius r."""
    verts, faces = data
    out = []
    for x, y, _ in verts:
        a = ang + x / r
        rr = r + lift
        out.append((rr * cos(a), rr * sin(a), z + y))
    # facing: at ang = -pi/2 the text must read left to right from the -Y side
    return [(p[0], p[1], p[2]) for p in out], [tuple(reversed(f)) if False else tuple(f) for f in faces]


def label_band(r, z, h, w, ang=-pi / 2, seg=16, lift=0.0001):
    """A paper label: a patch of cylinder of angular width w/r centred on `ang`."""
    verts, faces = [], []
    span = w / r
    rr = r + lift
    for i in range(seg + 1):
        a = ang - span / 2 + span * i / seg
        verts.append((rr * cos(a), rr * sin(a), z - h / 2))
        verts.append((rr * cos(a), rr * sin(a), z + h / 2))
    for i in range(seg):
        faces.append((2 * i, 2 * i + 2, 2 * i + 3, 2 * i + 1))
    return verts, faces


def label(parent, r, z, lines, w=None, h=None, ang=-pi / 2, name=None, paper='label', size=0.007):
    """Paper label + text lines [(formula, size)] wrapped on a cylinder of radius r."""
    name = name or parent.name + 'Label'
    n = len(lines)
    h = h or sum(s for _, s in lines) * 1.55 + 0.004
    w = w or max(len(t) for t, _ in lines) * size * 0.62 + 0.008
    mesh(name, label_band(r, z, h, w, ang), M[paper], parent=parent, smooth=False, recalc=False)
    mb = MB()
    y = z + h / 2 - 0.002
    for t, s in lines:
        y -= s * 0.78
        # flip x so text reads correctly from outside (angles grow counter-clockwise)
        v, f = formula_data(t, s)
        v = [(-(-p[0]), p[1], 0) for p in v]
        wrapped, ff = on_cylinder((v, f), r, y, ang + 0.0, lift=0.0004)
        # at ang=-pi/2 increasing angle moves towards +X, which is left-to-right seen from -Y: good
        mb.add((wrapped, ff))
        y -= s * 0.7
    return mb.obj(name + 'Text', M['printBlack'], parent=parent, smooth=False, recalc=False)


# ---------------------------------------------------------------------------------------------
# Textures
# ---------------------------------------------------------------------------------------------

def save_png(name, arr):
    import numpy as np
    h, w, _ = arr.shape
    img = bpy.data.images.new(name, w, h, alpha=False)
    rgba = np.concatenate([arr, np.ones((h, w, 1))], axis=2).astype('float32')
    img.pixels.foreach_set(rgba.ravel())
    path = os.path.join(TEXDIR, name + '.png')
    img.filepath_raw = path
    img.file_format = 'PNG'
    img.save()
    bpy.data.images.remove(img)
    return path


def textures():
    import numpy as np
    rng = np.random.default_rng(3)
    # wall tiles, 4x4 per texture, white with grey grout (colours are sRGB here: the image is sRGB)
    n, t = 512, 128
    a = np.ones((n, n, 3)) * 0.93
    for i in range(4):
        for j in range(4):
            a[i * t:(i + 1) * t, j * t:(j + 1) * t] *= 0.985 + rng.random() * 0.03
    yy, xx = np.mgrid[0:n, 0:n]
    g = ((yy % t) < 3) | ((xx % t) < 3)
    a[g] = np.array([0.72, 0.72, 0.70])
    a *= (0.99 + 0.02 * rng.random((n, n, 1)))
    tiles = save_png('wall_tiles', np.clip(a, 0, 1))
    # floor: grey speckled vinyl, 2x2 large tiles
    b = np.ones((n, n, 3)) * np.array([0.62, 0.63, 0.63])
    b += (rng.random((n, n, 1)) - 0.5) * 0.08
    speck = rng.random((n, n)) > 0.985
    b[speck] = np.array([0.35, 0.37, 0.38])
    speck2 = rng.random((n, n)) > 0.99
    b[speck2] = np.array([0.85, 0.85, 0.83])
    g = ((yy % 256) < 2) | ((xx % 256) < 2)
    b[g] *= 0.8
    floor = save_png('floor_vinyl', np.clip(b, 0, 1))
    M['tiles'] = material('WallTiles', '#ffffff', rough=0.25, image=tiles)
    M['floor'] = material('FloorVinyl', '#ffffff', rough=0.55, image=floor)


def planar_uv(ob, axes, scale):
    me = ob.data
    uv = me.uv_layers.new(name='UVMap')
    for loop in me.loops:
        co = ob.matrix_world @ me.vertices[loop.vertex_index].co
        uv.data[loop.index].uv = (co[axes[0]] / scale, co[axes[1]] / scale)


# ---------------------------------------------------------------------------------------------
# Room and bench
# ---------------------------------------------------------------------------------------------

def room():
    root = empty('Room')
    X0, X1, Y0, Y1, H = -2.4, 2.4, -3.6, WALL_Y, 2.9
    floor = MB().add(([(X0, Y0, 0), (X1, Y0, 0), (X1, Y1, 0), (X0, Y1, 0)], [(0, 1, 2, 3)])).obj('Floor', M['floor'], root, smooth=False)
    planar_uv(floor, (0, 1), 1.2)
    ceil = MB().add(([(X0, Y0, H), (X0, Y1, H), (X1, Y1, H), (X1, Y0, H)], [(0, 1, 2, 3)])).obj('Ceiling', M['ceiling'], root, smooth=False)
    TH = 1.5  # tiles up to 1.5 m
    walls = [
        ('Back', [(X0, Y1), (X1, Y1)]),
        ('Right', [(X1, Y1), (X1, Y0)]),
        ('Front', [(X1, Y0), (X0, Y0)]),
        ('Left', [(X0, Y0), (X0, Y1)]),
    ]
    for nm, ((ax, ay), (bx, by)) in walls:
        if nm == 'Back':
            # the back wall has a window: build it around the hole
            wx0, wx1, wz0, wz1 = -0.55, 0.75, 1.62, 2.45
            lo = MB()
            lo.add(([(X0, Y1, 0), (X1, Y1, 0), (X1, Y1, TH), (X0, Y1, TH)], [(0, 1, 2, 3)]))
            t = lo.obj('WallBackTiles', M['tiles'], root, smooth=False, recalc=False)
            planar_uv(t, (0, 2), 0.6)
            up = MB()
            for quad in [((X0, TH), (wx0, H)), ((wx1, TH), (X1, H)), ((wx0, TH), (wx1, wz0)), ((wx0, wz1), (wx1, H))]:
                (x0, z0), (x1, z1) = quad
                up.add(([(x0, Y1, z0), (x1, Y1, z0), (x1, Y1, z1), (x0, Y1, z1)], [(0, 1, 2, 3)]))
            up.obj('WallBackPaint', M['wallPaint'], root, smooth=False, recalc=False)
            window(root, wx0, wx1, wz0, wz1, Y1)
            continue
        lo = MB().add(([(ax, ay, 0), (bx, by, 0), (bx, by, TH), (ax, ay, TH)], [(0, 1, 2, 3)]))
        t = lo.obj('Wall%sTiles' % nm, M['tiles'], root, smooth=False, recalc=False)
        planar_uv(t, (0 if ay == by else 1, 2), 0.6)
        MB().add(([(ax, ay, TH), (bx, by, TH), (bx, by, H), (ax, ay, H)], [(0, 1, 2, 3)])).obj('Wall%sPaint' % nm, M['wallPaint'], root, smooth=False, recalc=False)
    # skirting of the tiles
    sk = MB()
    sk.box((X1 - X0, 0.012, 0.012), (0, Y1 - 0.006, TH))
    sk.box((0.012, Y1 - Y0, 0.012), (X0 + 0.006, (Y0 + Y1) / 2, TH))
    sk.box((0.012, Y1 - Y0, 0.012), (X1 - 0.006, (Y0 + Y1) / 2, TH))
    sk.obj('TileTrim', M['frame'], root, smooth=False)
    # ceiling lamps
    lamps = MB()
    lb = MB()
    for x, y in ((-0.9, -0.6), (0.9, -0.6), (-0.9, -2.2), (0.9, -2.2)):
        lb.box((1.2, 0.3, 0.03), (x, y, H - 0.015))
        lamps.box((1.16, 0.26, 0.004), (x, y, H - 0.031))
    lb.obj('LampHousing', M['frame'], root, smooth=False)
    lamps.obj('LampPanels', M['lamp'], root, smooth=False)


def window(root, x0, x1, z0, z1, y):
    MB().add(([(x0, y + 0.08, z0), (x1, y + 0.08, z0), (x1, y + 0.08, z1), (x0, y + 0.08, z1)], [(0, 1, 2, 3)])).obj('WindowSky', M['sky'], root, smooth=False, recalc=False)
    f = MB()
    d = 0.08
    for (cx, cz, sx, sz) in [((x0 + x1) / 2, z0, x1 - x0 + 0.1, 0.05), ((x0 + x1) / 2, z1, x1 - x0 + 0.1, 0.05),
                             (x0, (z0 + z1) / 2, 0.05, z1 - z0), (x1, (z0 + z1) / 2, 0.05, z1 - z0),
                             ((x0 + x1) / 2, (z0 + z1) / 2, 0.035, z1 - z0), ((x0 + x1) / 2, (z0 + z1) / 2 + 0.12, x1 - x0, 0.03)]:
        f.box((sx, d, sz), (cx, y + 0.04, cz))
    # reveals
    f.box((x1 - x0, 0.1, 0.01), ((x0 + x1) / 2, y + 0.05, z0 - 0.02))
    f.box((x1 - x0 + 0.14, 0.06, 0.025), ((x0 + x1) / 2, y - 0.02, z0 - 0.035))
    f.obj('WindowFrame', M['frame'], root, smooth=False)


def bench():
    root = empty('Bench')
    L, D = 2.7, 0.8
    y0, y1 = WALL_Y - D, WALL_Y
    box('BenchTop', (L, D, 0.035), (0, (y0 + y1) / 2, Z0 - 0.0175), M['epoxy'], root, bevel=0.004)
    box('BenchCarcass', (L - 0.04, D - 0.06, Z0 - 0.035 - 0.1), (0, (y0 + y1) / 2 + 0.03, 0.1 + (Z0 - 0.135) / 2), M['cabinet'], root)
    box('BenchPlinth', (L - 0.1, D - 0.12, 0.1), (0, (y0 + y1) / 2 + 0.06, 0.05), M['plinth'], root)
    doors = MB()
    handles = MB()
    n = 6
    w = (L - 0.06) / n
    for i in range(n):
        cx = -L / 2 + 0.03 + w * (i + 0.5)
        doors.box((w - 0.008, 0.018, Z0 - 0.035 - 0.12), (cx, y0 + 0.03, 0.1 + (Z0 - 0.155) / 2 + 0.005))
        hx = cx + (w / 2 - 0.05) * (1 if i % 2 else -1)
        handles.tube([(hx, y0 + 0.021, Z0 - 0.12), (hx, y0 + 0.0, Z0 - 0.115), (hx, y0 + 0.0, Z0 - 0.305), (hx, y0 + 0.021, Z0 - 0.3)], 0.005, seg=10)
    doors.obj('BenchDoors', M['cabinetDoor'], root, smooth=False, bevel=0.003)
    handles.obj('BenchHandles', M['steel'], root)
    # wall shelf with brackets
    sh = MB()
    sh.box((2.4, 0.2, 0.022), (0, WALL_Y - 0.1, Z0 + 0.45))
    br = MB()
    for x in (-1.0, 0.0, 1.0):
        br.box((0.012, 0.18, 0.03), (x, WALL_Y - 0.09, Z0 + 0.425))
        br.box((0.012, 0.012, 0.12), (x, WALL_Y - 0.006, Z0 + 0.4))
    sh.obj('Shelf', M['wood'], root, smooth=False, bevel=0.002)
    br.obj('ShelfBrackets', M['iron'], root, smooth=False)
    # sockets on the wall
    so = MB()
    for x in (-0.95, 0.55, 1.05):
        so.box((0.085, 0.012, 0.085), (x, WALL_Y - 0.006, Z0 + 0.14))
    so.obj('Sockets', M['white'], root, smooth=False, bevel=0.004)
    holes = MB()
    for x in (-0.95, 0.55, 1.05):
        for dx in (-0.01, 0.01):
            holes.add(lathe_data([(0, 0), (0.0022, 0)], 8), Matrix.Translation((x + dx, WALL_Y - 0.0125, Z0 + 0.14)) @ Matrix.Rotation(pi / 2, 4, 'X'))
    holes.obj('SocketHoles', M['black'], root, smooth=False, recalc=False)


# ---------------------------------------------------------------------------------------------
# Equipment
# ---------------------------------------------------------------------------------------------

def beaker(name, R, H, label_text=None, loc=(0, 0, 0), graduations=True, pick=True, lbl='Becher', fill=0.0, liquid=None, nominal=100, grad_ang=-pi / 2 - 0.35):
    root = empty(name, loc=loc, label=lbl, pick=int(pick))
    f = 0.003
    outer = [(0, 0)] + arc(R - f, f, f, -pi / 2, 0, 5)[1:] + [(R, H * 0.5), (R, H)]
    prof, inner = wall(outer, 0.0012)
    g = MB().lathe(prof, 56).obj(name + 'Glass', M['glass'], root, angle=50)
    spout(g, H)
    root['inner'] = json.dumps([[round(r - 0.0002, 5), round(z, 5)] for r, z in inner])
    root['spout'] = json.dumps([R + 0.004, 0, H + 0.0015])
    root['capacity'] = round(volume_below(inner, H) * 1e6, 1)
    if fill:
        root['fill'] = fill
        root['liquid'] = liquid
    if graduations:
        marks = MB()
        step = 10
        for ml in range(step, nominal + 1, step):
            z = height_for(inner, ml * 1e-6)
            a = grad_ang
            major = ml % 20 == 0 and ml < nominal
            wlen = 0.012 if major or ml == nominal else 0.007
            marks.add(label_band(R, z, 0.0007, wlen, a + wlen / 2 / R, seg=4, lift=0.0003))
            if major:
                txt = formula_data(str(ml), 0.0042)
                wrapped = on_cylinder(txt, R, z + 0.003, a + 0.012 / R + 0.004 / R, lift=0.0003)
                marks.add(wrapped)
        top = formula_data('%d mL' % nominal, 0.0045)
        marks.add(on_cylinder(top, R, H - 0.009, grad_ang + 0.6, lift=0.0003))
        marks.obj(name + 'Marks', M['printWhite'], root, smooth=False, recalc=False)
    if label_text:
        label(root, R + 0.0003, H * 0.42, label_text, ang=-pi / 2, size=0.006, w=0.034)
    return root


def bunsen(loc, rot):
    root = empty('Bunsen', loc=loc, rot=(0, 0, rot), label='Becco Bunsen', pick=1)
    base = [(0, 0), (0.046, 0), (0.047, 0.002), (0.046, 0.006), (0.036, 0.011), (0.018, 0.016), (0.010, 0.018), (0, 0.018)]
    MB().lathe(base, 48).obj('BunsenBase', M['hammer'], root, angle=30)
    barrel_o, barrel_i, top = 0.0056, 0.0046, 0.135
    MB().lathe([(barrel_i, top - 0.012), (barrel_i, top), (barrel_o, top), (barrel_o, 0.016), (0.0075, 0.016), (0.0075, 0.012), (0.0, 0.012)], 32).obj('BunsenBarrel', M['chrome'], root, angle=40)
    MB().lathe([(0, top - 0.012), (barrel_i, top - 0.012)], 24).obj('BunsenThroat', M['black'], root, smooth=False, recalc=False)
    collar = empty('BunsenCollar', loc=(0, 0, 0), parent=root)
    MB().lathe([(0.0059, 0.021), (0.0074, 0.021), (0.0076, 0.023), (0.0076, 0.038), (0.0074, 0.040), (0.0059, 0.040)], 36, closed=True).obj('BunsenCollarRing', M['brass'], collar, angle=40)
    # the air hole in the collar, a dark oval
    hole = MB()
    for s in (1, -1):
        hole.add(label_band(0.0076, 0.0305, 0.008, 0.005, ang=0 if s > 0 else pi, seg=6, lift=0.0002))
    hole.obj('BunsenCollarHole', M['black'], collar, smooth=False, recalc=False)
    # gas inlet with a hose barb, along +X
    barb = [(0, 0.0), (0.0035, 0.0), (0.0035, 0.012), (0.0047, 0.016), (0.0035, 0.018), (0.0047, 0.022), (0.0035, 0.024), (0.0047, 0.028), (0.0035, 0.030), (0.0033, 0.052), (0, 0.052)]
    MB().lathe(barb, 20, mat=Matrix.Translation((0.02, 0, 0.011)) @ Matrix.Rotation(pi / 2, 4, 'Y')).obj('BunsenInlet', M['brass'], root, angle=40)
    empty('FlameAnchor', loc=(0, 0, top), parent=root)
    root['inletTip'] = json.dumps([0.072, 0, 0.011])
    return root


def tripod(loc):
    root = empty('Tripod', loc=loc, label='Treppiede', pick=0)
    H, R = 0.207, 0.068
    mb = MB()
    mb.tube([(R * cos(a), R * sin(a), H) for a in [2 * pi * i / 48 for i in range(49)]], 0.0038, seg=10, caps=False)
    for a in (radians(90), radians(210), radians(330)):
        mb.tube([(R * cos(a), R * sin(a), H), (R * cos(a), R * sin(a), H - 0.01), ((R + 0.022) * cos(a), (R + 0.022) * sin(a), 0.003)], 0.0038, seg=10)
    mb.obj('TripodIron', M['iron'], root, angle=60)
    # wire gauze
    g = empty('Gauze', loc=(0, 0, H + 0.0038), parent=root, label='Reticella', pick=0)
    w = MB()
    S = 0.145
    n = 26
    for i in range(n + 1):
        c = -S / 2 + S * i / n
        w.box((S, 0.0007, 0.0007), (0, c, 0.0005))
        w.box((0.0007, S, 0.0007), (c, 0, 0.0012))
    for s in (1, -1):
        w.box((S + 0.004, 0.004, 0.0025), (0, s * S / 2, 0.001))
        w.box((0.004, S + 0.004, 0.0025), (s * S / 2, 0, 0.001))
    w.obj('GauzeWire', M['iron'], g, smooth=False)
    MB().lathe([(0, 0.0016), (0.046, 0.0016), (0.047, 0.0022), (0.046, 0.0028), (0, 0.0028)], 40).obj('GauzeCeramic', M['gauzeHot'], g, angle=40)
    return root


def gas_tap(loc):
    root = empty('GasTap', loc=loc, label='Rubinetto del gas', pick=1)
    mb = MB()
    mb.lathe([(0, 0), (0.022, 0), (0.022, 0.005), (0.009, 0.007), (0.008, 0.1), (0, 0.1)], 28)
    mb.box((0.03, 0.026, 0.026), (0, 0, 0.11))
    mb.obj('GasTapBody', M['chrome'], root, angle=40, bevel=0.003)
    barb = [(0, 0.0), (0.004, 0.0), (0.004, 0.012), (0.0052, 0.016), (0.004, 0.018), (0.0052, 0.022), (0.004, 0.024), (0.0038, 0.036), (0, 0.036)]
    MB().lathe(barb, 20, mat=Matrix.Translation((0, -0.013, 0.105)) @ Matrix.Rotation(pi / 2, 4, 'X')).obj('GasTapNozzle', M['brass'], root, angle=40)
    h = empty('GasTapHandle', loc=(0, 0, 0.123), parent=root)
    MB().lathe([(0, 0), (0.006, 0), (0.006, 0.008), (0, 0.008)], 16).box((0.075, 0.012, 0.008), (0.03, 0, 0.012)).obj('GasTapLever', M['yellow'], h, smooth=False, bevel=0.002)
    root['nozzleTip'] = json.dumps([0, -0.049, 0.105])
    return root


def hose(start, end, sag_points):
    pts = catmull([start] + sag_points + [end], per=10)
    return MB().tube(pts, 0.0055, seg=14).obj('GasHose', M['hose'], None, angle=60)


def pipette(loc, rot):
    root = empty('Pipette', loc=loc, rot=rot, label='Pipetta tarata da 25 mL', pick=1)
    t = 0.0008
    outer = [(0.0012, 0.0), (0.0020, 0.012), (0.0035, 0.035), (0.0035, 0.14), (0.0096, 0.165), (0.0096, 0.235), (0.0035, 0.26), (0.0035, 0.475)]
    inner = [(0.0004, 0.0), (0.0012, 0.012), (0.0027, 0.035), (0.0027, 0.14), (0.0088, 0.165), (0.0088, 0.235), (0.0027, 0.26), (0.0027, 0.475)]
    prof = outer + [(0.0031, 0.4758)] + list(reversed(inner)) + [(0.0008, -0.0004)]
    MB().lathe(prof, 28, closed=True).obj('PipetteGlass', M['glass'], root, angle=50)
    mark = height_for(inner, 25e-6)
    root['inner'] = json.dumps([[round(r - 0.0001, 5), round(z, 5)] for r, z in inner])
    root['mark'] = round(mark, 5)
    ring = MB().add(label_band(0.00355, mark, 0.0005, 2 * pi * 0.0036, 0, seg=24, lift=0.0))
    ring.add(formula_data('25 mL', 0.005), Matrix.Translation((0, -0.0098, 0.2)) @ Matrix.Rotation(pi / 2, 4, 'X') @ Matrix.Rotation(pi / 2, 4, 'Z'))
    ring.add(formula_data('20 °C', 0.0035), Matrix.Translation((0, -0.0098, 0.2)) @ Matrix.Rotation(pi / 2, 4, 'X') @ Matrix.Rotation(pi / 2, 4, 'Z') @ Matrix.Translation((0.0, -0.0065, 0)))
    ring.obj('PipetteMarks', M['printBlue'], root, smooth=False, recalc=False)
    # propipetta: red rubber bulb with its three valves
    pp = MB()
    pp.lathe([(0, 0.462), (0.0055, 0.462), (0.0065, 0.49), (0.0065, 0.5), (0.0078, 0.505), (0.0078, 0.52), (0, 0.52)], 24)
    pp.lathe([(0, 0.515)] + [(0.024 * sin(a), 0.54 - 0.024 * cos(a)) for a in [pi * i / 16 for i in range(1, 16)]] + [(0, 0.564)], 32)
    pp.lathe([(0, 0.562), (0.005, 0.562), (0.005, 0.575), (0, 0.575)], 16)  # valve A
    pp.lathe([(0, 0), (0.005, 0), (0.005, 0.012), (0, 0.012)], 16, mat=Matrix.Translation((0.021, 0, 0.53)) @ Matrix.Rotation(pi / 2, 4, 'Y'))  # valve E
    pp.obj('Propipetta', M['rubberRed'], root, angle=50)
    root['bulbTop'] = 0.575
    return root


def thermometer(loc, rot):
    root = empty('Thermometer', loc=loc, rot=rot, label='Termometro', pick=1)
    r = 0.0035
    prof = [(0, 0)] + [(0.0042 * sin(a), 0.0042 - 0.0042 * cos(a)) for a in [pi / 2 * i / 6 for i in range(1, 7)]] + [(0.0042, 0.014), (r, 0.02), (r, 0.3)] + [(r * cos(a), 0.3 + r * sin(a)) for a in [pi / 2 * i / 5 for i in range(1, 6)]]
    MB().lathe(prof, 24).obj('ThermometerGlass', M['glass'], root, angle=50)
    MB().lathe([(0, 0.0015), (0.003, 0.004), (0.003, 0.011), (0.0012, 0.016), (0, 0.016)], 16).obj('ThermometerBulb', M['thermoRed'], root)
    col = empty('ThermoColumn', loc=(0, 0, 0.015), parent=root)
    MB().lathe([(0, 0), (0.0007, 0), (0.0007, 1.0), (0, 1.0)], 10).obj('ThermoColumnMesh', M['thermoRed'], col, smooth=False)
    z0, k = 0.035, 0.245 / 110
    col.scale = (1, 1, z0 - 0.015 + 20 * k)
    root['h0'] = z0 - 0.015
    root['k'] = k
    sc = MB()
    for T in range(0, 111, 10):
        z = z0 + T * k
        sc.add(label_band(0.0032, z, 0.0004, 0.0035 if T % 20 else 0.0055, ang=-pi / 2 + 0.7, seg=3, lift=0.0))
        if T % 20 == 0:
            sc.add(on_cylinder(formula_data(str(T), 0.0028), 0.0032, z, ang=-pi / 2 - 0.35, lift=0.0))
    sc.add(label_band(0.0031, 0.16, 0.26, 0.009, ang=pi / 2, seg=8, lift=0.0))
    sc.obj('ThermometerScale', M['printBlack'], root, smooth=False, recalc=False)
    MB().add(label_band(0.003, 0.16, 0.26, 0.0085, ang=pi / 2 + 0.0, seg=8, lift=-0.0002)).obj('ThermometerBack', M['printWhite'], root, smooth=False, recalc=False)
    return root


def glass_rod(loc, rot):
    root = empty('GlassRod', loc=loc, rot=rot, label='Bacchetta di vetro', pick=1)
    r = 0.003
    prof = [(0, 0)] + [(r * sin(a), r - r * cos(a)) for a in [pi / 2 * i / 4 for i in range(1, 5)]] + [(r, 0.2 - r)] + [(r * cos(a), 0.2 - r + r * sin(a)) for a in [pi / 2 * i / 4 for i in range(1, 4)]] + [(0, 0.2)]
    MB().lathe(prof, 20).obj('GlassRodGlass', M['glass'], root, angle=50)
    return root


def spatula(loc, rot):
    """Along +Z from the scoop (at the origin) to the flat end; the scoop opens towards -Y."""
    root = empty('Spatula', loc=loc, rot=rot, label='Spatola', pick=1)
    mb = MB()
    # scoop: a half-pipe tapering to a rounded tip
    L = 0.026
    rings = 10
    verts, faces = [], []
    arcn = 9
    for i in range(rings + 1):
        z = L * i / rings
        taper = sin(min(1.0, (i + 0.4) / 3.5) * pi / 2)
        r = 0.0048 * taper
        for side, rr in ((0, r), (1, r - 0.0005 * taper)):
            for k in range(arcn + 1):
                a = pi * k / arcn
                verts.append((rr * cos(a), -rr * sin(a) * 0.9 + 0.0002, z))
    per = (arcn + 1) * 2
    for i in range(rings):
        for s in (0, 1):
            for k in range(arcn):
                a = i * per + s * (arcn + 1) + k
                b = (i + 1) * per + s * (arcn + 1) + k
                faces.append((a, a + 1, b + 1, b) if s == 0 else (a, b, b + 1, a + 1))
        for k in (0, arcn):
            a0, a1 = i * per + k, i * per + arcn + 1 + k
            b0, b1 = (i + 1) * per + k, (i + 1) * per + arcn + 1 + k
            faces.append((a0, b0, b1, a1))
    mb.add((verts, faces))
    mb.box((0.0075, 0.0012, 0.15), (0, -0.0003, L + 0.075))
    mb.box((0.012, 0.0012, 0.03), (0, -0.0003, L + 0.165))
    mb.obj('SpatulaSteel', M['steel'], root, angle=30, recalc=False)
    powder = MB()
    powder.add(lathe_data([(0, -0.0034), (0.0036, -0.0022), (0.003, -0.0005), (0, 0.0006)], 12), Matrix.Translation((0, -0.0005, 0.012)) @ Matrix.Diagonal((1.0, 1.0, 2.2, 1.0)) @ Matrix.Rotation(pi / 2, 4, 'X'))
    p = powder.obj('SpatulaPowder', M['cuo'], root, angle=0)
    p['startHidden'] = 1
    return root


def cuo_jar(loc):
    root = empty('CuOJar', loc=loc, label='Ossido di rame(II), CuO', pick=1)
    outer = [(0, 0), (0.0255, 0), (0.0265, 0.003), (0.0265, 0.062), (0.024, 0.066), (0.0225, 0.068), (0.0225, 0.078)]
    prof, inner = wall(outer, 0.0018)
    MB().lathe(prof, 48).obj('CuOJarBody', M['white'], root, angle=40)
    th = MB()
    for i in range(3):
        th.lathe([(0.0225, 0.069 + i * 0.003), (0.0233, 0.0705 + i * 0.003), (0.0225, 0.072 + i * 0.003)], 40)
    th.obj('CuOJarThread', M['white'], root, recalc=False)
    # powder surface, lumpy
    pw = MB()
    rings, seg = 8, 40
    v, f = [(0, 0, 0.041)], []
    for i in range(1, rings + 1):
        r = 0.0242 * i / rings
        for k in range(seg):
            a = 2 * pi * k / seg
            z = 0.041 + 0.0025 * (1 - (i / rings) ** 2) + random.uniform(-0.0006, 0.0006) + (0.001 if i == rings else 0)
            v.append((r * cos(a), r * sin(a), z))
    for k in range(seg):
        f.append((0, 1 + k, 1 + (k + 1) % seg))
    for i in range(rings - 1):
        for k in range(seg):
            a, b = 1 + i * seg + k, 1 + i * seg + (k + 1) % seg
            f.append((a, a + seg, b + seg, b))
    pw.add((v, f)).obj('CuOPowder', M['cuo'], root, angle=80, recalc=False)
    label(root, 0.0268, 0.034, [('CuO', 0.009), ('ossido di rame(II)', 0.0035)], w=0.04, h=0.026, ang=-pi / 2)
    lid = empty('CuOLid', loc=(loc[0] + 0.07, loc[1] + 0.05, loc[2]), label='Tappo', pick=0)
    MB().lathe([(0, 0.019), (0.0232, 0.019), (0.0245, 0.017), (0.0245, 0.002), (0.0235, 0.0), (0.021, 0.0), (0.021, 0.016), (0, 0.016)], 40).obj('CuOLidMesh', M['black'], lid, angle=40)
    return root


def conical_flask(loc):
    root = empty('ConicalFlask', loc=loc, label='Beuta da 250 mL', pick=1)
    f = 0.006
    R = 0.0425
    outer = [(0, 0)] + arc(R - f, f, f, -pi / 2, 0, 5)[1:] + [(R, 0.012), (0.0205, 0.104), (0.0182, 0.112), (0.0178, 0.136), (0.0198, 0.138), (0.0205, 0.142), (0.0192, 0.145)]
    prof, inner = wall(outer, 0.0014)
    MB().lathe(prof, 56).obj('ConicalFlaskGlass', M['glass'], root, angle=45)
    root['inner'] = json.dumps([[round(max(r - 0.0002, 0), 5), round(z, 5)] for r, z in inner])
    root['neckTop'] = 0.145
    root['neckInner'] = 0.0164
    marks = MB()
    for ml in (50, 100, 150, 200):
        z = height_for(inner, ml * 1e-6)
        rr = R - (R - 0.0205) * (z - 0.012) / (0.104 - 0.012)
        marks.add(label_band(rr + 0.0001, z, 0.0007, 0.01, ang=-pi / 2 - 0.25, seg=4, lift=0.0004))
        marks.add(on_cylinder(formula_data(str(ml), 0.004), rr + 0.0001, z + 0.0035, -pi / 2 - 0.25, lift=0.0004))
    marks.add(on_cylinder(formula_data('250 mL', 0.0045), R, 0.02, -pi / 2 + 0.25, lift=0.0004))
    marks.obj('ConicalFlaskMarks', M['printWhite'], root, smooth=False, recalc=False)
    return root


def funnel(loc):
    """Origin at the apex of the cone, where the stem starts."""
    root = empty('Funnel', loc=loc, label='Imbuto', pick=1)
    top_r, half = 0.0375, radians(30)
    h = top_r / math.tan(half)
    outer = [(0.0033, -0.07), (0.0036, -0.004), (0.0045, 0.0), (top_r, h), (top_r + 0.0015, h + 0.002)]
    inner = [(0.0024, -0.07), (0.0027, -0.004), (0.0033, 0.0015), (top_r - 0.0012, h + 0.0005)]
    prof = [(0.0024, -0.071), (0.0033, -0.071)] + outer[1:] + [(top_r + 0.0005, h + 0.0035)] + list(reversed(inner))
    # a slanted cut at the end of the stem
    MB().lathe(prof, 48, closed=True).obj('FunnelGlass', M['glass'], root, angle=40)
    root['coneHeight'] = h
    root['inner'] = json.dumps([[0.0024, -0.07], [0.0027, -0.004], [0.0033, 0.0015], [round(top_r - 0.0014, 5), round(h, 5)]])
    return root


def filter_paper(loc):
    root = empty('FilterPaper', loc=loc, label='Carta da filtro', pick=1)
    R = 0.055
    rings, seg = 10, 48
    v = [(0, 0, 0.0004)]
    for i in range(1, rings + 1):
        r = R * i / rings
        for k in range(seg):
            a = 2 * pi * k / seg
            v.append((r * cos(a), r * sin(a), 0.0004))
    f = []
    for k in range(seg):
        f.append((0, 1 + k, 1 + (k + 1) % seg))
    for i in range(rings - 1):
        for k in range(seg):
            a, b = 1 + i * seg + k, 1 + i * seg + (k + 1) % seg
            f.append((a, a + seg, b + seg, b))
    me = bpy.data.meshes.new('FilterPaperSheet')
    me.from_pydata(v, [], f)
    me.materials.append(M['paper'])
    me.shade_smooth()
    ob = bpy.data.objects.new('FilterPaperSheet', me)
    link(ob, root)
    ob.shape_key_add(name='Basis')
    sk = ob.shape_key_add(name='Folded')
    al = radians(29)
    for idx, co in enumerate(v):
        x, y, _ = co
        rho = sqrt(x * x + y * y)
        a = atan2(y, x)
        crease = 1 + 0.035 * abs(sin(2 * a))
        sk.data[idx].co = (rho * sin(al) * cos(a) * crease, rho * sin(al) * sin(a) * crease, rho * cos(al) + 0.001)
    return root


def evap_dish(loc):
    root = empty('EvapDish', loc=loc, label='Capsula di porcellana', pick=1)
    outer = [(0, 0.0), (0.02, 0.0), (0.021, 0.002), (0.017, 0.004)]
    bowl = [(0.05 * sin(a), 0.058 - 0.058 * cos(a) * 1.0) for a in [radians(d) for d in range(22, 60, 4)]]
    # a spherical bowl of radius 0.058 meeting the foot
    bowl = [(0.058 * sin(radians(d)), 0.004 + 0.058 * (1 - cos(radians(d)))) for d in range(17, 61, 4)]
    outer = [(0, 0.0), (0.018, 0.0), (0.019, 0.0025), (0.017, 0.004)] + bowl
    prof, inner = wall(outer, 0.003)
    # the inside is a smooth cap
    d = MB().lathe(prof, 56).obj('EvapDishPorcelain', M['porcelain'], root, angle=35)
    spout(d, outer[-1][1], depth=0.012, out=0.005, up=0.001)
    root['inner'] = json.dumps([[round(r, 5), round(z + 0.0003, 5)] for r, z in inner])
    root['spout'] = json.dumps([outer[-1][0] + 0.005, 0, outer[-1][1] + 0.001])
    return root


def goggles(loc):
    root = empty('Goggles', loc=loc, rot=(0, 0, radians(12)), label='Occhiali di protezione', pick=1)
    R, h = 0.085, 0.052
    a0, a1 = radians(-160), radians(-20)
    v, f = [], []
    n = 28
    for i in range(n + 1):
        a = a0 + (a1 - a0) * i / n
        bulge = 1 + 0.06 * sin(pi * i / n)
        for z in (0.004, 0.004 + h * (0.82 + 0.18 * sin(pi * i / n))):
            v.append((R * bulge * cos(a), R * bulge * sin(a) + 0.055, z))
    for i in range(n):
        f.append((2 * i, 2 * i + 2, 2 * i + 3, 2 * i + 1))
    mesh('GogglesLens', (v, f), M['lens'], parent=root, recalc=False)
    fr = MB()
    top = [v[2 * i + 1] for i in range(n + 1)]
    bot = [v[2 * i] for i in range(n + 1)]
    fr.tube(top, 0.0035, seg=8)
    fr.tube(bot, 0.0035, seg=8)
    fr.tube([top[0], bot[0]], 0.004, seg=8)
    fr.tube([top[-1], bot[-1]], 0.004, seg=8)
    # nose notch
    fr.obj('GogglesFrame', M['gogFrame'], root)
    st = MB()
    sv, sf = [], []
    b0, b1 = a1, a0 + 2 * pi
    m = 24
    for i in range(m + 1):
        a = b0 + (b1 - b0) * i / m
        for z in (0.012, 0.034):
            sv.append((R * 1.02 * cos(a), R * 0.9 * sin(a) + 0.055, z))
    for i in range(m):
        sf.append((2 * i, 2 * i + 2, 2 * i + 3, 2 * i + 1))
    mesh('GogglesStrap', (sv, sf), M['strap'], parent=root, recalc=False)
    return root


def lighter(loc, rot):
    """A gas lighter; origin at the nozzle tip, body along +Z."""
    root = empty('Lighter', loc=loc, rot=rot, label='Accendigas', pick=1)
    MB().lathe([(0, 0), (0.0035, 0.0), (0.004, 0.004), (0.004, 0.11), (0.006, 0.115), (0, 0.115)], 16).obj('LighterTube', M['steel'], root, angle=40)
    b = MB()
    b.box((0.022, 0.026, 0.1), (0, 0.0, 0.165))
    b.box((0.02, 0.02, 0.025), (0, -0.008, 0.215))
    b.obj('LighterBody', M['red'], root, smooth=False, bevel=0.005)
    MB().box((0.012, 0.012, 0.03), (0, -0.017, 0.135)).obj('LighterTrigger', M['black'], root, smooth=False, bevel=0.002)
    return root


def reagent_bottle(name, loc, formula, color=None, amber=False, fill=300, lbl=None, cap='black'):
    root = empty(name, loc=loc, label=lbl or name, pick=0)
    f = 0.006
    R = 0.038
    outer = [(0, 0)] + arc(R - f, f, f, -pi / 2, 0, 4)[1:] + [(R, 0.105), (0.03, 0.125), (0.016, 0.135), (0.0145, 0.14), (0.0145, 0.158)]
    prof, inner = wall(outer, 0.0025)
    MB().lathe(prof, 40).obj(name + 'Glass', M['glassAmber'] if amber else M['glass'], root, angle=40)
    root['inner'] = json.dumps([[round(max(r - 0.0003, 0), 5), round(z, 5)] for r, z in inner])
    if color:
        root['fill'] = fill
        root['liquid'] = color
    MB().lathe([(0, 0.176), (0.0165, 0.176), (0.0172, 0.173), (0.0172, 0.152), (0.0155, 0.15), (0, 0.15)], 32).obj(name + 'Cap', M[cap], root, angle=40)
    label(root, R + 0.0003, 0.058, formula, ang=-pi / 2, w=0.05, h=0.045, size=0.008)
    return root


def wash_bottle(loc):
    root = empty('WashBottle', loc=loc, label='Spruzzetta di acqua distillata', pick=0)
    MB().lathe([(0, 0), (0.034, 0), (0.036, 0.004), (0.036, 0.15), (0.03, 0.165), (0.013, 0.172), (0.013, 0.182), (0, 0.182)], 40).obj('WashBottleBody', M['washBottle'], root, angle=40)
    MB().lathe([(0, 0.178), (0.016, 0.178), (0.016, 0.198), (0.006, 0.202), (0, 0.202)], 24).obj('WashBottleCap', M['red'], root, angle=40)
    MB().tube(catmull([(0, 0, 0.2), (0, 0, 0.235), (0.02, 0, 0.25), (0.06, 0, 0.245), (0.075, 0, 0.23)], 6), 0.0022, seg=8).obj('WashBottleNozzle', M['washBottle'], root, angle=60)
    label(root, 0.0363, 0.085, [('H_2O', 0.012), ('distillata', 0.005)], w=0.05, h=0.034)
    return root


def tube_rack(loc):
    root = empty('TubeRack', loc=loc, label='Portaprovette', pick=0)
    b = MB()
    b.box((0.2, 0.06, 0.008), (0, 0, 0.09))
    b.box((0.2, 0.06, 0.008), (0, 0, 0.03))
    b.box((0.2, 0.07, 0.006), (0, 0, 0.003))
    for x in (-0.097, 0.097):
        b.box((0.006, 0.06, 0.09), (x, 0, 0.048))
    b.obj('TubeRackFrame', M['wood'], root, smooth=False, bevel=0.0015)
    colors = ['#2f7fd8', None, '#e8c21a', '#7b2d8f', None, '#3aa15a']
    for i, c in enumerate(colors):
        x = -0.075 + i * 0.03
        t = empty('TestTube%d' % i, loc=(x, 0, 0.033), parent=root)
        outer = [(0, 0)] + [(0.008 * sin(a), 0.008 - 0.008 * cos(a)) for a in [pi / 2 * k / 5 for k in range(1, 6)]] + [(0.008, 0.145), (0.0092, 0.148)]
        prof, inner = wall(outer, 0.0008)
        MB().lathe(prof, 24).obj('TestTube%dGlass' % i, M['glass'], t, angle=45)
        if c:
            t['inner'] = json.dumps([[round(max(r - 0.0002, 0), 5), round(z, 5)] for r, z in inner])
            t['fill'] = 6 + 3 * (i % 3)
            t['liquid'] = c
    return root


def retort_stand(loc):
    root = empty('RetortStand', loc=loc, label='Sostegno', pick=0)
    box('RetortBase', (0.22, 0.14, 0.012), (0, 0, 0.006), M['hammer'], root, bevel=0.003)
    MB().lathe([(0, 0.01), (0.006, 0.01), (0.006, 0.62), (0, 0.62)], 16).obj('RetortRod', M['chrome'], root, angle=40)
    box('RetortBoss', (0.025, 0.025, 0.03), (0, 0, 0.36), M['iron'], root, bevel=0.003)
    MB().tube([(0, 0, 0.36), (0, -0.09, 0.36)], 0.004, seg=10).obj('RetortArm', M['chrome'], root)
    MB().tube([(0.045 * cos(2 * pi * i / 32), -0.13 + 0.045 * sin(2 * pi * i / 32), 0.36) for i in range(33)], 0.0032, seg=8, caps=False).obj('RetortRing', M['iron'], root)
    return root


def notebook(loc):
    root = empty('Notebook', loc=loc, rot=(0, 0, radians(-8)), label='Quaderno di laboratorio', pick=0)
    box('NotebookCoverMesh', (0.16, 0.22, 0.004), (0, 0, 0.002), M['notebook'], root, bevel=0.001)
    box('NotebookPages', (0.155, 0.214, 0.008), (0.002, 0, 0.008), M['pages'], root)
    box('NotebookTop', (0.16, 0.22, 0.002), (0, 0, 0.013), M['notebook'], root, bevel=0.0008)
    MB().add(formula_data('Laboratorio', 0.014), Matrix.Translation((0, 0.04, 0.0142))).obj('NotebookTitle', M['printWhite'], root, smooth=False, recalc=False)
    MB().tube([(0.1, -0.08, 0.005), (0.1, 0.06, 0.005)], 0.0045, seg=12).obj('Pen', M['printBlue'], root)
    return root


def periodic_table(root_loc):
    root = empty('PeriodicTable', loc=root_loc, label='Tavola periodica', pick=0)
    W, H = 0.74, 0.5
    box('PosterBoard', (W, 0.004, H), (0, 0, 0), M['printWhite'], root)
    cell, gap = 0.034, 0.004
    x0 = -18 * (cell + gap) / 2 + (cell + gap) / 2
    z0 = H / 2 - 0.07
    by = {k: MB() for k in PT_COLORS}

    def cat(p, g):
        if g == 1:
            return 'nonmetal' if p == 1 else 'alkali'
        if g == 2:
            return 'earth'
        if 3 <= g <= 12:
            return 'transition'
        if g == 18:
            return 'noble'
        if g == 17:
            return 'halogen'
        metalloids = {(2, 13), (3, 14), (4, 14), (4, 15), (5, 15), (5, 16), (6, 17)}
        nonm = {(2, 14), (2, 15), (2, 16), (3, 15), (3, 16), (4, 16)}
        if (p, g) in metalloids:
            return 'metalloid'
        if (p, g) in nonm:
            return 'nonmetal'
        return 'post'

    for p in range(1, 8):
        for g in range(1, 19):
            if p == 1 and g not in (1, 18):
                continue
            if p in (2, 3) and 2 < g < 13:
                continue
            c = cat(p, g)
            if p >= 6 and g == 3:
                c = 'lanth' if p == 6 else 'act'
            by[c].box((cell, 0.002, cell), (x0 + (g - 1) * (cell + gap), -0.003, z0 - (p - 1) * (cell + gap)))
    for row, c in ((0, 'lanth'), (1, 'act')):
        for i in range(15):
            by[c].box((cell, 0.002, cell), (x0 + (i + 2.5) * (cell + gap), -0.003, z0 - (7.4 + row) * (cell + gap)))
    for k, mb in by.items():
        if mb.v:
            mb.obj('PT_' + k, M['pt_' + k], root, smooth=False)
    MB().add(formula_data('TAVOLA PERIODICA DEGLI ELEMENTI', 0.022), Matrix.Translation((0, -0.0025, H / 2 - 0.03)) @ Matrix.Rotation(pi / 2, 4, 'X')).obj('PosterTitle', M['printBlack'], root, smooth=False, recalc=False)
    return root


def clock(loc):
    root = empty('Clock', loc=loc, label='Orologio', pick=0)
    MB().lathe([(0, 0.0), (0.15, 0.0), (0.155, 0.01), (0.15, 0.04), (0.14, 0.042), (0.14, 0.036), (0, 0.036)], 64, mat=Matrix.Rotation(pi / 2, 4, 'X')).obj('ClockBody', M['black'], root, angle=40)
    MB().lathe([(0, 0.035), (0.14, 0.035)], 64, mat=Matrix.Rotation(pi / 2, 4, 'X')).obj('ClockFace', M['printWhite'], root, smooth=False, recalc=False)
    t = MB()
    for i in range(60):
        a = 2 * pi * i / 60
        L = 0.018 if i % 5 == 0 else 0.007
        W = 0.005 if i % 5 == 0 else 0.0018
        c = 0.128 - L / 2
        t.add(box_data((W, 0.001, L)), Matrix.Translation((0, -0.036, 0)) @ Matrix.Rotation(-a, 4, 'Y') @ Matrix.Translation((0, 0, c)))
    t.obj('ClockTicks', M['printBlack'], root, smooth=False)
    hh = empty('ClockHour', loc=(0, -0.038, 0), parent=root)
    box('ClockHourHand', (0.009, 0.002, 0.075), (0, 0, 0.03), M['printBlack'], hh)
    mm = empty('ClockMinute', loc=(0, -0.041, 0), parent=root)
    box('ClockMinuteHand', (0.006, 0.002, 0.11), (0, 0, 0.045), M['printBlack'], mm)
    ss = empty('ClockSecond', loc=(0, -0.044, 0), parent=root)
    box('ClockSecondHand', (0.002, 0.0015, 0.13), (0, 0, 0.045), M['labelRed'], ss)
    MB().lathe([(0, -0.001), (0.006, -0.001), (0.006, 0.007), (0, 0.007)], 16, mat=Matrix.Translation((0, -0.05, 0)) @ Matrix.Rotation(pi / 2, 4, 'X')).obj('ClockPin', M['labelRed'], root)
    return root


def safety_sign(loc):
    root = empty('SafetySign', loc=loc, label='Cartello', pick=0)
    box('SignBoard', (0.2, 0.004, 0.28), (0, 0, 0), M['printWhite'], root)
    MB().lathe([(0, 0), (0.075, 0)], 48, mat=Matrix.Translation((0, -0.0025, 0.035)) @ Matrix.Rotation(pi / 2, 4, 'X')).obj('SignDisc', M['printBlue'], root, smooth=False, recalc=False)
    g = MB()
    # a pair of goggles, white on blue
    for s in (-1, 1):
        g.add(lathe_data([(0, 0), (0.022, 0)], 24), Matrix.Translation((s * 0.026, -0.0032, 0.035)) @ Matrix.Rotation(pi / 2, 4, 'X') @ Matrix.Diagonal((1, 0.75, 1, 1)))
    g.box((0.13, 0.001, 0.008), (0, -0.0031, 0.045))
    g.obj('SignIcon', M['printWhite'], root, smooth=False, recalc=False)
    MB().add(formula_data('OBBLIGO DI', 0.016), Matrix.Translation((0, -0.0025, -0.075)) @ Matrix.Rotation(pi / 2, 4, 'X')).add(formula_data('OCCHIALI', 0.02), Matrix.Translation((0, -0.0025, -0.1)) @ Matrix.Rotation(pi / 2, 4, 'X')).obj('SignText', M['printBlue'], root, smooth=False, recalc=False)
    return root


def heat_mat(loc):
    root = empty('HeatMat', loc=loc, label='Piastra isolante', pick=0)
    box('HeatMatTile', (0.26, 0.26, 0.006), (0, 0, 0.003), M['ceramic'], root, bevel=0.0015)
    return root


# ---------------------------------------------------------------------------------------------
# Scene
# ---------------------------------------------------------------------------------------------

def build():
    mats()
    textures()
    room()
    bench()
    top = Z0
    heat_mat((0, 0.02, top))
    B = (0.0, 0.02, top + 0.006)
    burner_rot = radians(52)
    bunsen(B, burner_rot)
    tripod(B)
    tap = gas_tap((0.24, 0.30, top))
    # hose from the tap nozzle down to the bench and round to the burner inlet
    inlet = Vector(B) + Matrix.Rotation(burner_rot, 3, 'Z') @ Vector((0.072, 0, 0.011))
    nozzle = Vector((0.24, 0.30 - 0.049, top + 0.105))
    ndir = Vector((0, -1, 0))
    idir = Matrix.Rotation(burner_rot, 3, 'Z') @ Vector((1, 0, 0))
    hose(tuple(nozzle), tuple(inlet), [tuple(nozzle + ndir * 0.04 + Vector((0, 0, -0.04))), (0.23, 0.17, top + 0.008), tuple(inlet + idir * 0.05 + Vector((0, 0, -0.002)))])
    beaker('Beaker', 0.026, 0.072, loc=(-0.2, -0.04, top), lbl='Becher da 100 mL')
    beaker('AcidBeaker', 0.021, 0.058, label_text=[('H_2SO_4', 0.0075), ('1 M', 0.006)], loc=(-0.38, 0.09, top), lbl='Becher con H₂SO₄ 1 M', fill=40, liquid='#dfe9f0', graduations=True, nominal=50, grad_ang=-pi / 2 + 1.25)
    # stock bottle next to it, where the acid came from
    reagent_bottle('AcidBottle', (-0.52, 0.2, top), [('H_2SO_4', 0.012), ('1 mol/L', 0.007), ('corrosivo', 0.0055)], color='#e6eef3', fill=260, lbl='Bottiglia di H₂SO₄ 1 M')
    # pipette lying on the bench, tip towards the centre
    tilt = math.asin((0.024 - 0.0012) / 0.54)
    pipette((-0.1, -0.25, top + 0.0012), (0, -(pi / 2 - tilt), 0))
    goggles((-0.74, -0.1, top))
    cuo_jar((0.3, 0.14, top))
    spatula((0.24, 0.04, top + 0.004), (0, pi / 2, radians(4)))
    glass_rod((0.2, -0.08, top + 0.003), (0, pi / 2, radians(-3)))
    thermometer((0.16, -0.2, top + 0.0042), (0, pi / 2, radians(2)))
    lighter((0.03, -0.32, top + 0.011), (0, pi / 2, 0))
    conical_flask((0.58, 0.1, top))
    fh = funnel((0.58, 0.1, top + 0.145 - 0.0164 / math.tan(radians(30)) + 0.004))
    filter_paper((0.56, -0.15, top))
    evap_dish((0.8, -0.08, top))
    # decor
    wash_bottle((-0.86, 0.22, top))
    tube_rack((0.95, 0.24, top))
    retort_stand((-1.05, 0.15, top))
    notebook((-1.0, -0.2, top))
    shelf = top + 0.461
    reagent_bottle('ShelfHCl', (-0.8, WALL_Y - 0.1, shelf), [('HCl', 0.012), ('2 mol/L', 0.007)], color='#eef3f3', fill=280, lbl='Acido cloridrico')
    reagent_bottle('ShelfNaOH', (-0.65, WALL_Y - 0.1, shelf), [('NaOH', 0.011), ('1 mol/L', 0.007)], color='#f2f2ee', fill=240, lbl='Idrossido di sodio')
    reagent_bottle('ShelfCuSO4', (-0.5, WALL_Y - 0.1, shelf), [('CuSO_4', 0.011), ('0,5 mol/L', 0.007)], color='#1e7fd6', fill=300, lbl='Solfato di rame')
    reagent_bottle('ShelfKMnO4', (0.62, WALL_Y - 0.1, shelf), [('KMnO_4', 0.01), ('0,02 mol/L', 0.0065)], color='#6b1f7a', fill=220, amber=True, lbl='Permanganato di potassio')
    reagent_bottle('ShelfFeCl3', (0.77, WALL_Y - 0.1, shelf), [('FeCl_3', 0.011), ('0,1 mol/L', 0.007)], color='#d99a1c', fill=260, amber=True, lbl='Cloruro ferrico')
    reagent_bottle('ShelfEtOH', (0.92, WALL_Y - 0.1, shelf), [('C_2H_5OH', 0.0095), ('etanolo', 0.007)], color='#f4f6f6', fill=200, lbl='Etanolo')
    beaker('ShelfBeaker1', 0.026, 0.072, loc=(-0.3, WALL_Y - 0.1, shelf), pick=False, lbl='Becher')
    beaker('ShelfBeaker2', 0.021, 0.058, nominal=50, loc=(-0.22, WALL_Y - 0.08, shelf), pick=False, lbl='Becher')
    periodic_table((-1.25, WALL_Y - 0.003, 1.95))
    clock((1.25, WALL_Y - 0.001, 2.2))
    safety_sign((1.4, WALL_Y - 0.003, 1.72))


def main():
    build()

    # stable names: the exporter uses object names, and the page looks nodes up by name
    for ob in scene.objects:
        if ob.type == 'MESH' and ob.data.name != ob.name:
            ob.data.name = ob.name

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=OUT, export_format='GLB', export_extras=True, export_apply=True, export_yup=True,
        export_morph=True, export_morph_normal=False, export_animations=False, export_cameras=False,
        export_lights=False, export_image_format='AUTO', export_texcoords=True, export_normals=True,
    )
    print('EXPORTED', OUT, os.path.getsize(OUT))

    # ---------------------------------------------------------------------------------------------
    # Previews
    # ---------------------------------------------------------------------------------------------

    if PREVIEW:
        os.makedirs(PREVIEW, exist_ok=True)
        scene.render.engine = 'BLENDER_EEVEE'
        scene.render.resolution_x = 1280
        scene.render.resolution_y = 800
        try:
            scene.eevee.taa_render_samples = 32
        except Exception:
            pass
        world = bpy.data.worlds.new('W')
        world.use_nodes = True
        world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.8, 0.82, 0.85, 1)
        world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.7
        scene.world = world
        sun = bpy.data.objects.new('Sun', bpy.data.lights.new('Sun', 'SUN'))
        sun.data.energy = 2.5
        sun.rotation_euler = (radians(50), radians(10), radians(-30))
        scene.collection.objects.link(sun)
        area = bpy.data.objects.new('Area', bpy.data.lights.new('Area', 'AREA'))
        area.data.energy = 250
        area.data.size = 1.5
        area.location = (0, -0.6, 2.6)
        scene.collection.objects.link(area)
        cam = bpy.data.objects.new('Cam', bpy.data.cameras.new('Cam'))
        scene.collection.objects.link(cam)
        scene.camera = cam

        def shot(name, eye, target, lens=35):
            cam.location = eye
            d = Vector(target) - Vector(eye)
            cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
            cam.data.lens = lens
            cam.data.clip_start = 0.01
            scene.render.filepath = os.path.join(PREVIEW, name + '.png')
            bpy.ops.render.render(write_still=True)

        views = os.environ.get('LAB_VIEWS', 'overview,center,left,right,wall').split(',')
        if 'overview' in views:
            shot('overview', (0.1, -1.6, 1.75), (0.0, 0.0, 1.05), 28)
        if 'center' in views:
            shot('center', (0.0, -0.55, 1.2), (0.0, 0.02, 1.0), 40)
        if 'left' in views:
            shot('left', (-0.45, -0.6, 1.15), (-0.45, 0.02, 0.93), 40)
        if 'right' in views:
            shot('right', (0.5, -0.6, 1.15), (0.5, 0.02, 0.95), 40)
        if 'wall' in views:
            shot('wall', (0.0, -1.2, 1.6), (0.0, WALL_Y, 1.7), 24)


if __name__ == '__main__':
    main()
