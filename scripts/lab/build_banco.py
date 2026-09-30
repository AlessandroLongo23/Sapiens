"""
The vertical slice of /laboratorio/banco: one bench in a small school lab in the late morning, in a soft, painted
style (flat colours, baked light), with a street and the town outside the windows.

    blender -b --factory-startup -P scripts/lab/build_banco.py -- public/lab/banco.glb [preview-dir]

It reuses the equipment of build_lab.py with a cool pastel palette, builds its own room and the town outside, and
bakes the light with Cycles into two lightmaps, on the second UV map:
- inside (public/lab/banco-luce.png): the sky through the windows and every bounce, sun included; the sun's direct
  light stays live in the page, so what the student moves casts its shadow;
- outside (public/lab/banco-esterno.png, on the nodes with the extra `lm: ext`): all the light, sun included, as
  nothing moves out there and the page draws it unlit.
The page reads the sun and the lightmaps' scales from the `Lighting` node's extras.
"""
import bpy, os, sys, json, math
from math import pi, radians, sin, cos
from mathutils import Vector, Matrix

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_lab as L  # noqa: E402  (resets the scene and defines the equipment)
from build_lab import M, MB, material, empty, box, box_data, link, lathe_data, catmull, formula_data, save_png, planar_uv  # noqa: E402

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = os.path.abspath(argv[0]) if argv else '/tmp/banco.glb'
PREVIEW = os.path.abspath(argv[1]) if len(argv) > 1 else None
STEM = os.path.splitext(os.path.basename(OUT))[0]
LIGHTMAP = os.path.join(os.path.dirname(OUT), f'{STEM}-luce.png')
LIGHTMAP_EXT = os.path.join(os.path.dirname(OUT), f'{STEM}-esterno.png')
# what is on the bench: 'banco', the vertical slice (crystals to dissolve); 'esperimento', the whole experiment's kit
KIT = os.environ.get('BANCO_KIT', 'banco')
SIZE = int(os.environ.get('BANCO_LIGHTMAP', '2048'))
SAMPLES = int(os.environ.get('BANCO_SAMPLES', '384'))

scene = bpy.context.scene
Z0, WALL_Y = L.Z0, L.WALL_Y
X0, X1, Y0, Y1, H = -2.4, 2.4, -3.6, WALL_Y, 2.9
WIN_Z = (1.0, 2.35)
WINDOWS = [(-1.05, 0.15), (-2.75, -1.55)]  # on the left wall, y ranges
DOOR = (-2.6, -1.6)  # on the right wall, y range
DOORS = None  # several doors on the right wall (y ranges); None: just DOOR
# the sun, late morning, from the front left and 38° up; the direction the light travels, Blender axes
SUN_DIR = Vector((0.77, 0.2, -0.62)).normalized()
SUN_COLOR = '#fff3e3'
SUN_STRENGTH = 3.6
SKY_COLOR = '#c4d6ea'
SKY_STRENGTH = 2.6


# ---------------------------------------------------------------------------------------------
# Palette: flat, soft colours; warm light against cool shade

def palette():
    L.mats()
    over = {
        'epoxy': ('BenchTopSlate', '#2f3d46', 0.75),
        'cabinet': ('CabinetPale', '#dfe5e6', 0.8),
        'cabinetDoor': ('CabinetDoorSteel', '#7d9db3', 0.75),
        'plinth': ('PlinthDark', '#39424a', 0.8),
        'wood': ('WoodLight', '#c9a47e', 0.7),
        'frame': ('FrameWhite', '#f1f3f3', 0.6),
        'iron': ('IronSoft', '#4b5258', 0.6),
        'notebook': ('NotebookTeal', '#2f6f73', 0.7),
        'gogFrame': ('GogglesTeal', '#3b8c8a', 0.6),
        'washBottle': ('WashBottleSoft', '#eef1ea', 0.5),
        'hammer': ('HammerTeal', '#335a61', 0.6),
    }
    for key, (name, col, rough) in over.items():
        M[key] = material(name, col, rough=rough)
    M['wallUpper'] = material('WallWhite', '#eef1f0', rough=0.95)
    M['wallLower'] = material('WallTeal', '#a3c0c4', rough=0.9)
    M['ceiling'] = material('CeilingWhite', '#f3f5f5', rough=0.95)
    M['trim'] = material('TrimGrey', '#8fa0a8', rough=0.7)
    M['radiator'] = material('Radiator', '#e9edee', rough=0.6)
    M['door'] = material('DoorBlue', '#6f8fa6', rough=0.7)
    M['lampReflector'] = material('LampReflector', '#f4f6f7', rough=0.35)
    M['tube'] = material('FluorescentTube', '#ffffff', emission='#f3f6ff', estr=6.0)
    M['louvre'] = material('LampLouvre', '#d9dde0', metallic=1.0, rough=0.22)
    M['pot'] = material('PotTerracotta', '#c9744f', rough=0.85)
    M['leaf'] = material('Leaf', '#5f8f5a', rough=0.7, double=True)
    M['leafDark'] = material('LeafDark', '#467550', rough=0.7, double=True)
    M['soil'] = material('Soil', '#4a3a2e', rough=1.0)
    M['stool'] = material('StoolSeat', '#e3b04b', rough=0.7)
    M['sill'] = material('Sill', '#e6eaea', rough=0.6)
    M['crystal'] = material('CrystalBlue', '#2f79c9', rough=0.3)


def textures():
    import numpy as np
    rng = np.random.default_rng(5)
    # floor: large soft tiles, each a slightly different tone, thin grout
    n, t = 1024, 256
    base = np.array([0.68, 0.73, 0.75])
    a = np.ones((n, n, 3)) * base
    for i in range(n // t):
        for j in range(n // t):
            a[i * t:(i + 1) * t, j * t:(j + 1) * t] *= 0.96 + rng.random() * 0.07
    yy, xx = np.mgrid[0:n, 0:n]
    g = ((yy % t) < 3) | ((xx % t) < 3)
    a[g] = base * 0.82
    a += (rng.random((n, n, 1)) - 0.5) * 0.015
    M['floor'] = material('FloorTiles', '#ffffff', rough=0.8, image=save_png('banco_floor', np.clip(a, 0, 1)))


# ---------------------------------------------------------------------------------------------
# Room

def quad(mb, a, b, c, d):
    mb.add(([a, b, c, d], [(0, 1, 2, 3)]))


def wall_with_holes(mb, axis_pts, z0, z1, holes, plane):
    """A wall strip from z0 to z1 along a line, with rectangular holes [(s0, s1, hz0, hz1)] in its own coordinate."""
    (s_min, s_max) = axis_pts
    cuts = sorted(set([s_min, s_max] + [h[0] for h in holes] + [h[1] for h in holes]))
    for sa, sb in zip(cuts, cuts[1:]):
        mid = (sa + sb) / 2
        zs = [z0, z1]
        for h in holes:
            if h[0] <= mid <= h[1]:
                zs += [max(z0, min(z1, h[2])), max(z0, min(z1, h[3]))]
        zs = sorted(set(zs))
        for za, zb in zip(zs, zs[1:]):
            zm = (za + zb) / 2
            if any(h[0] <= mid <= h[1] and h[2] <= zm <= h[3] for h in holes):
                continue
            quad(mb, plane(sa, za), plane(sb, za), plane(sb, zb), plane(sa, zb))


def room():
    root = empty('Room')
    floor = MB()
    quad(floor, (X0, Y0, 0), (X1, Y0, 0), (X1, Y1, 0), (X0, Y1, 0))
    f = floor.obj('Floor', M['floor'], root, smooth=False, recalc=False)
    planar_uv(f, (0, 1), 2.4)
    ceil = MB()
    quad(ceil, (X0, Y0, H), (X0, Y1, H), (X1, Y1, H), (X1, Y0, H))
    ceil.obj('Ceiling', M['ceiling'], root, smooth=False, recalc=False)
    WAINSCOT = 1.0
    lower, upper = MB(), MB()
    win_holes = [(y0, y1, WIN_Z[0], WIN_Z[1]) for (y0, y1) in WINDOWS]
    doors = [(*d, 0.0, 2.1) for d in (DOORS or [DOOR])]
    walls = [
        # name, (s range), plane(s, z) -> point, holes
        ('Back', (X0, X1), lambda s, z: (s, Y1, z), []),
        ('Right', (Y0, Y1), lambda s, z: (X1, Y1 - (s - Y0), z), [(Y1 - (door[1] - Y0), Y1 - (door[0] - Y0), door[2], door[3]) for door in doors]),
        ('Front', (X0, X1), lambda s, z: (X1 - (s - X0), Y0, z), []),
        ('Left', (Y0, Y1), lambda s, z: (X0, Y0 + (s - Y0), z), win_holes),
    ]
    for nm, rng_, plane, holes in walls:
        wall_with_holes(lower, rng_, 0, WAINSCOT, holes, plane)
        wall_with_holes(upper, rng_, WAINSCOT, H, holes, plane)
    lower.obj('WallLower', M['wallLower'], root, smooth=False, recalc=False)
    upper.obj('WallUpper', M['wallUpper'], root, smooth=False, recalc=False)
    # the wall's thickness round the windows, the sills and the outside face, so the sun comes in through a real hole
    T = 0.22
    rev = MB()
    for (y0, y1) in WINDOWS:
        z0, z1 = WIN_Z
        quad(rev, (X0, y0, z0), (X0 - T, y0, z0), (X0 - T, y0, z1), (X0, y0, z1))
        quad(rev, (X0, y1, z1), (X0 - T, y1, z1), (X0 - T, y1, z0), (X0, y1, z0))
        quad(rev, (X0, y0, z1), (X0 - T, y0, z1), (X0 - T, y1, z1), (X0, y1, z1))
    rev.obj('WindowReveals', M['wallUpper'], root, smooth=False, recalc=False)
    outside = MB()
    wall_with_holes(outside, (Y0 - 1, Y1 + 1), -TOWN_DROP - 0.1, H + 0.4, win_holes, lambda s, z: (X0 - T, s, z))
    outside.obj('WallOutside', M['wallUpper'], root, smooth=False, recalc=False)
    # trims: chair rail at the wainscot, skirting
    tr = MB()
    for (a, b) in (((X0, Y1), (X1, Y1)), ((X1, Y1), (X1, Y0)), ((X1, Y0), (X0, Y0)), ((X0, Y0), (X0, Y1))):
        ax, ay = a
        bx, by = b
        nx, ny = (0, -1) if ay == by == Y1 else (-1, 0) if ax == bx == X1 else (0, 1) if ay == by == Y0 else (1, 0)
        cx, cy = (ax + bx) / 2 + nx * 0.01, (ay + by) / 2 + ny * 0.01
        lx = abs(bx - ax) or 0.02
        ly = abs(by - ay) or 0.02
        tr.box((lx, ly, 0.035), (cx, cy, WAINSCOT))
        tr.box((lx, ly, 0.09), (cx, cy, 0.045))
    tr.obj('Trims', M['trim'], root, smooth=False, bevel=0.003)
    # a thick shell round the room, never seen from inside: the room's surfaces are single planes, and near their
    # edges the bake's rays would get out and bring the sun on the roof and the outer walls inside (light leaks)
    shell = MB()
    E = 0.3
    shell.box((X1 - X0 + 2 * E, Y1 - Y0 + 2 * E, E), ((X0 + X1) / 2, (Y0 + Y1) / 2, H + E / 2 + 0.002))
    shell.box((X1 - X0 + 2 * E, Y1 - Y0 + 2 * E, E), ((X0 + X1) / 2, (Y0 + Y1) / 2, -E / 2 - 0.002))
    shell.box((X1 - X0 + 2 * E, E, H + 2 * E), ((X0 + X1) / 2, Y1 + E / 2 + 0.002, H / 2))
    shell.box((X1 - X0 + 2 * E, E, H + 2 * E), ((X0 + X1) / 2, Y0 - E / 2 - 0.002, H / 2))
    shell.box((E, Y1 - Y0 + 2 * E, H + 2 * E), (X1 + E / 2 + 0.002, (Y0 + Y1) / 2, H / 2))
    shell.obj('RoomShell', M['wallUpper'], root, smooth=False)
    for (y0, y1) in WINDOWS:
        window(root, y0, y1)
    # a radiator under each window
    rad = MB()
    for (y0, y1) in WINDOWS:
        n = 12
        for i in range(n):
            y = y0 + 0.1 + (y1 - y0 - 0.2) * i / (n - 1)
            rad.box((0.06, 0.035, 0.55), (X0 + 0.09, y, 0.45))
        rad.tube([(X0 + 0.09, y0 + 0.08, 0.2), (X0 + 0.09, y1 - 0.08, 0.2)], 0.015, seg=10)
        rad.tube([(X0 + 0.09, y0 + 0.08, 0.7), (X0 + 0.09, y1 - 0.08, 0.7)], 0.015, seg=10)
    rad.obj('Radiators', M['radiator'], root, smooth=False, bevel=0.01)
    # the doors on the right wall
    d, fr, hd = MB(), MB(), MB()
    for door in doors:
        ya, yb = door[0], door[1]
        d.box((0.05, yb - ya, door[3]), (X1 - 0.025, (ya + yb) / 2, door[3] / 2))
        fr.box((0.07, 0.06, door[3] + 0.06), (X1 - 0.03, ya - 0.03, (door[3] + 0.06) / 2))
        fr.box((0.07, 0.06, door[3] + 0.06), (X1 - 0.03, yb + 0.03, (door[3] + 0.06) / 2))
        fr.box((0.07, yb - ya + 0.12, 0.06), (X1 - 0.03, (ya + yb) / 2, door[3] + 0.03))
        hd.tube([(X1 - 0.06, ya + 0.1, 1.02), (X1 - 0.11, ya + 0.1, 1.02), (X1 - 0.11, ya + 0.22, 1.02)], 0.009, seg=10)
    d.obj('Door', M['door'], root, smooth=False, bevel=0.004)
    fr.obj('DoorFrame', M['trim'], root, smooth=False, bevel=0.004)
    hd.obj('DoorHandle', M['steel'], root)
    # ceiling fittings as in schools and hospitals: a white housing, two fluorescent tubes and a louvre of aluminium
    # blades (a "dark light" grid). They are on: the bake gets an area light under each (lamps() below)
    house, tubes, blades, refl = MB(), MB(), MB(), MB()
    for (cx, cy) in LAMPS:
        z = H - LAMP_D / 2
        house.box((LAMP_L + 0.04, LAMP_W + 0.04, 0.012), (cx, cy, H - 0.006))
        for sy in (-1, 1):
            house.box((LAMP_L + 0.04, 0.02, LAMP_D), (cx, cy + sy * (LAMP_W / 2 + 0.01), z))
        for sx in (-1, 1):
            house.box((0.02, LAMP_W + 0.04, LAMP_D), (cx + sx * (LAMP_L / 2 + 0.01), cy, z))
        # the reflector: two sloped white faces over the tubes
        refl.box((LAMP_L, LAMP_W, 0.004), (cx, cy, H - 0.014))
        for ty in (-0.07, 0.07):
            tubes.tube([(cx - LAMP_L / 2 + 0.04, cy + ty, H - 0.03), (cx + LAMP_L / 2 - 0.04, cy + ty, H - 0.03)], 0.013, seg=12)
        # louvres: three long blades and a crossing blade every 10 cm, V-shaped like the parabolic ones
        for by in (-LAMP_W / 2 + 0.005, 0.0, LAMP_W / 2 - 0.005):
            blades.box((LAMP_L, 0.004, 0.045), (cx, cy + by, H - LAMP_D + 0.026))
        n = int(LAMP_L / 0.1)
        for k in range(1, n):
            bx = cx - LAMP_L / 2 + k * LAMP_L / n
            for sy in (-1, 1):
                blades.add(box_data((0.004, LAMP_W / 2 - 0.006, 0.04)), Matrix.Translation((bx, cy + sy * LAMP_W / 4, H - LAMP_D + 0.028)) @ Matrix.Rotation(sy * radians(12), 4, 'X'))
    house.obj('LampHousings', M['frame'], root, smooth=False, bevel=0.002)
    refl.obj('LampReflectors', M['lampReflector'], root, smooth=False)
    tubes.obj('LampTubes', M['tube'], root)
    blades.obj('LampLouvres', M['louvre'], root, smooth=False)


def window(root, y0, y1):
    z0, z1 = WIN_Z
    x = X0 - 0.11
    f = MB()
    d, w = 0.06, 0.05
    f.box((d, y1 - y0, w), (x, (y0 + y1) / 2, z0 + w / 2))
    f.box((d, y1 - y0, w), (x, (y0 + y1) / 2, z1 - w / 2))
    f.box((d, w, z1 - z0), (x, y0 + w / 2, (z0 + z1) / 2))
    f.box((d, w, z1 - z0), (x, y1 - w / 2, (z0 + z1) / 2))
    # mullions: a cross, and a transom a third of the way down
    f.box((d * 0.8, 0.035, z1 - z0), (x, (y0 + y1) / 2, (z0 + z1) / 2))
    f.box((d * 0.8, y1 - y0, 0.035), (x, (y0 + y1) / 2, z1 - (z1 - z0) * 0.33))
    f.obj('WindowFrame%d' % int(abs(y0) * 100), M['frame'], root, smooth=False, bevel=0.003)
    # the panes: thin glass just outside the frame's middle, so the view has a faint reflection on it
    MB().box((0.004, y1 - y0 - 0.06, z1 - z0 - 0.06), (x - 0.012, (y0 + y1) / 2, (z0 + z1) / 2)).obj('WindowGlass%d' % int(abs(y0) * 100), M['glass'], root, smooth=False)
    MB().box((0.3, y1 - y0 + 0.12, 0.035), (X0 - 0.04, (y0 + y1) / 2, z0 - 0.0175)).obj('WindowSill%d' % int(abs(y0) * 100), M['sill'], root, smooth=False, bevel=0.004)


# ---------------------------------------------------------------------------------------------
# The town outside: a school yard, a street with trees, and the houses across it. Units and axes as the room: the
# window wall is at x = X0, the town is at x < X0. Every piece carries `lm: ext` for the outside lightmap.

FACADES = [  # wall colour, shutters (Italian green persiane), window frame
    ('#e6d9c3', '#5e7f63', '#f3f1ea'),
    ('#cfdbe0', None, '#f5f6f5'),
    ('#e3c9b4', '#7c9a86', '#f3efe9'),
    ('#d7ddcf', None, '#f4f4ef'),
    ('#c9d2dc', '#6b8397', '#f3f5f6'),
    ('#ead9b8', '#5e7f63', '#f5f1e6'),
]
BAY, FLOOR = 3.0, 3.2
# ceiling fittings: centres (x, y), length along x, width, depth
LAMPS = [(-0.95, -0.15), (0.95, -0.15), (-0.95, -2.15), (0.95, -2.15)]
LAMP_L, LAMP_W, LAMP_D = 1.2, 0.3, 0.07
LAMP_COLOR = '#f2f5ff'
LAMP_POWER = 16.0
TOWN_DROP = 1.3
YARD = 10.0


def facade_texture(i):
    """One bay of one floor, tiled over the walls: plaster, a window with its frame and sill, shutters if any."""
    import numpy as np
    wall, shut, frame = FACADES[i]
    hexc = lambda h: np.array([int(h.lstrip('#')[k:k + 2], 16) / 255 for k in (0, 2, 4)])
    w, h = 192, 204
    px = w / BAY
    a = np.ones((h, w, 3)) * hexc(wall)
    rng = np.random.default_rng(40 + i)
    a *= 0.97 + 0.03 * rng.random((h, w, 1))

    def rect(x0, x1, z0, z1, col):
        # z from the floor up, in metres; rows go bottom up in a Blender image
        r0, r1 = int(z0 * px), int(z1 * px)
        c0, c1 = int((BAY / 2 + x0) * px), int((BAY / 2 + x1) * px)
        a[max(0, r0):min(h, r1), max(0, c0):min(w, c1)] = col

    ww, z0, z1 = 1.2, 0.95, 2.55
    rect(-ww / 2 - 0.08, ww / 2 + 0.08, z0 - 0.1, z1 + 0.08, hexc(frame))
    # the glass: darker below, the sky's reflection above
    top, bot = hexc('#8fa6b8'), hexc('#4c5d6b')
    r0, c0 = int(z0 * px), int((BAY / 2 - ww / 2) * px)
    rows = min(h, int(z1 * px)) - r0
    glass = np.linspace(0.0, 1.0, rows)[:, None, None]
    a[r0:r0 + rows, c0:c0 + int(ww * px)] = bot * (1 - glass) + top * glass
    rect(-0.03, 0.03, z0, z1, hexc(frame))
    if shut:
        rect(-ww / 2 - 0.62, -ww / 2 - 0.1, z0 - 0.05, z1 + 0.05, hexc(shut))
        rect(ww / 2 + 0.1, ww / 2 + 0.62, z0 - 0.05, z1 + 0.05, hexc(shut))
        for k in range(10):
            zz = z0 + (z1 - z0) * k / 10
            rect(-ww / 2 - 0.62, -ww / 2 - 0.1, zz, zz + 0.02, hexc(shut) * 0.85)
            rect(ww / 2 + 0.1, ww / 2 + 0.62, zz, zz + 0.02, hexc(shut) * 0.85)
    rect(-ww / 2 - 0.15, ww / 2 + 0.15, z0 - 0.16, z0 - 0.08, hexc(frame) * 0.92)
    # a string course under each floor
    a[0:int(0.12 * px)] = hexc(wall) * 0.9
    return save_png('facade%d' % i, np.clip(a, 0, 1))


def facade_uv(ob):
    """Walls: one bay by one floor per texture tile; flat faces (roofs): world metres."""
    me = ob.data
    uv = me.uv_layers.new(name='UVMap')
    for poly in me.polygons:
        n = poly.normal
        for li in poly.loop_indices:
            co = ob.matrix_world @ me.vertices[me.loops[li].vertex_index].co
            if abs(n.z) > 0.7:
                uv.data[li].uv = (co.x / 4, co.y / 4)
            elif abs(n.x) > abs(n.y):
                uv.data[li].uv = (co.y / BAY + 0.5, co.z / FLOOR)
            else:
                uv.data[li].uv = (co.x / BAY + 0.5, co.z / FLOOR)


def ext(ob):
    ob['lm'] = 'ext'
    return ob


def building(root, i, x_front, y0, y1, floors, depth=11.0, roof='flat'):
    """A house across the street: a box with its facade texture, a parapet or a tiled roof."""
    H = floors * FLOOR + 0.4
    key = 'facade%d' % (i % len(FACADES))
    if key not in M:
        M[key] = material('Facade%d' % (i % len(FACADES)), '#ffffff', rough=0.9, image=facade_texture(i % len(FACADES)))
    mb = MB().box((depth, y1 - y0, H), (x_front - depth / 2, (y0 + y1) / 2, H / 2))
    ob = mb.obj('House%d' % i, M[key], root, smooth=False)
    facade_uv(ob)
    ext(ob)
    if roof == 'flat':
        par = MB()
        par.box((depth + 0.2, 0.25, 0.8), (x_front - depth / 2, y0 + 0.125, H + 0.4))
        par.box((depth + 0.2, 0.25, 0.8), (x_front - depth / 2, y1 - 0.125, H + 0.4))
        par.box((0.25, y1 - y0, 0.8), (x_front + 0.1 - 0.125, (y0 + y1) / 2, H + 0.4))
        ext(par.obj('House%dParapet' % i, M['roofEdge'], root, smooth=False))
    else:
        # a tiled roof, ridge along y
        rise = depth * 0.28
        xc = x_front - depth / 2
        v = [(x_front + 0.3, y0 - 0.3, H), (x_front + 0.3, y1 + 0.3, H), (xc, y1 + 0.3, H + rise), (xc, y0 - 0.3, H + rise),
             (x_front - depth - 0.3, y0 - 0.3, H), (x_front - depth - 0.3, y1 + 0.3, H)]
        f = [(0, 1, 2, 3), (3, 2, 5, 4), (0, 3, 4), (1, 5, 2)]
        ext(MB().add((v, f)).obj('House%dRoof' % i, M['roofTiles'], root, smooth=False))
    return ob


def tree(mb_trunk, mb_leaves, x, y, s, rnd):
    mb_trunk.tube([(x, y, 0.1), (x + rnd.uniform(-0.1, 0.1), y, 2.2 * s)], 0.11 * s, seg=8)
    for k in range(3):
        c = Vector((x + rnd.uniform(-0.6, 0.6) * s, y + rnd.uniform(-0.6, 0.6) * s, (2.9 + k * 0.7) * s))
        r = (1.4 - k * 0.25) * s
        mb_leaves.add(L.lathe_data([(r * sin(pi * t / 6), -r * cos(pi * t / 6)) for t in range(7)], 10), Matrix.Translation(c) @ Matrix.Diagonal((1, 1, 0.85, 1)))


def car(mb_body, mb_glass, mb_wheel, x, y, rnd):
    L_, W_ = 4.0, 1.75
    mb_body.box((W_, L_, 0.75), (x, y, 0.6))
    mb_body.box((W_ * 0.9, L_ * 0.55, 0.55), (x, y - 0.2, 1.22))
    mb_glass.box((W_ * 0.92, L_ * 0.5, 0.42), (x, y - 0.2, 1.24))
    for dy in (-1.3, 1.25):
        for dx in (-W_ / 2, W_ / 2):
            mb_wheel.add(L.lathe_data([(0, -0.12), (0.34, -0.12), (0.34, 0.12), (0, 0.12)], 16), Matrix.Translation((x + dx, y + dy, 0.34)) @ Matrix.Rotation(pi / 2, 4, 'Y'))


def city():
    import random
    rnd = random.Random(12)
    # the lab is on a raised ground floor: the street is 1.3 m below its floor
    root = empty('Town', loc=(0, 0, -TOWN_DROP))
    M['paving'] = material('Paving', '#a7aeb0', rough=0.95)
    M['grass'] = material('Grass', '#7fa27c', rough=1.0)
    M['kerb'] = material('Kerb', '#9ca3a6', rough=0.9)
    M['asphalt'] = material('Asphalt', '#5d656b', rough=0.95)
    M['lane'] = material('LaneWhite', '#e9ebe6', rough=0.9)
    M['fence'] = material('FenceGreen', '#5e7768', rough=0.6)
    M['trunk'] = material('Trunk', '#6f5a4a', rough=1.0)
    M['canopy'] = material('Canopy', '#7ea57a', rough=1.0)
    M['roofEdge'] = material('RoofEdge', '#b6bcbf', rough=0.9)
    M['roofTiles'] = material('RoofTiles', '#b9725a', rough=0.9)
    M['carBody'] = material('CarBody', '#d8e0e4', rough=0.5)
    M['carBody2'] = material('CarBodyRed', '#c9665a', rough=0.5)
    M['carGlass'] = material('CarGlass', '#44535e', rough=0.3)
    M['tyre'] = material('Tyre', '#2b2e31', rough=0.9)
    M['lamp'] = material('StreetLamp', '#48525a', rough=0.6)
    xw = X0 - 0.22  # outside face of the wall
    YA, YB = -70.0, 60.0
    # school yard and lawn, the fence, the pavements, the street
    g = MB()
    g.box((YARD, YB - YA, 0.05), (xw - YARD / 2, (YA + YB) / 2, -0.025))
    # the school's plinth under the window wall, down to the yard
    ext(MB().box((0.3, Y1 - Y0 + 2, TOWN_DROP + 0.05), (xw - 0.1, (Y0 + Y1) / 2, TOWN_DROP / 2)).obj('Plinth', M['kerb'], root, smooth=False))
    ext(g.obj('Yard', M['paving'], root, smooth=False))
    lawn = MB()
    for (ya, yb) in ((-14, -4.5), (1.5, 11), (16, 30), (-30, -19)):
        lawn.box((YARD - 3.5, yb - ya, 0.06), (xw - 1.2 - (YARD - 3.5) / 2, (ya + yb) / 2, 0.01))
    ext(lawn.obj('Lawn', M['grass'], root, smooth=False))
    fence = MB()
    xf = xw - YARD
    for k in range(int((YB - YA) / 2.0) + 1):
        fence.box((0.06, 0.06, 1.6), (xf, YA + k * 2.0, 0.8))
    for z in (0.3, 1.5):
        fence.box((0.05, YB - YA, 0.05), (xf, (YA + YB) / 2, z))
    for k in range(int((YB - YA) / 0.16)):
        fence.box((0.02, 0.02, 1.2), (xf, YA + k * 0.16, 0.9))
    ext(fence.obj('Fence', M['fence'], root, smooth=False))
    walk = MB()
    walk.box((2.6, YB - YA, 0.14), (xf - 1.3, (YA + YB) / 2, 0.07))
    walk.box((2.6, YB - YA, 0.14), (xf - 2.6 - 7.5 - 1.3, (YA + YB) / 2, 0.07))
    ext(walk.obj('Pavements', M['kerb'], root, smooth=False))
    road = MB().box((7.5, YB - YA, 0.04), (xf - 2.6 - 3.75, (YA + YB) / 2, 0.0))
    ext(road.obj('Road', M['asphalt'], root, smooth=False))
    lanes = MB()
    for k in range(int((YB - YA) / 6)):
        lanes.box((0.14, 3.0, 0.01), (xf - 2.6 - 3.75, YA + 1.5 + k * 6, 0.025))
    ext(lanes.obj('Lanes', M['lane'], root, smooth=False))
    x_houses = xf - 2.6 - 7.5 - 2.6
    ground = MB().box((200, 260, 0.1), (x_houses - 100, -5, -0.06))
    ext(ground.obj('Ground', M['paving'], root, smooth=False))
    # trees and street lamps along the pavement on our side, cars parked across
    trunks, leaves, lamps = MB(), MB(), MB()
    # a few trees in the yard, off the line of the sun
    for (x, y) in ((xw - 6.5, 7.0), (xw - 5.0, 22.0), (xw - 6.0, -24.0), (xw - 7.0, 36.0)):
        tree(trunks, leaves, x, y, rnd.uniform(1.0, 1.25), rnd)
    for k in range(-6, 7):
        y = k * 9.0 + 3
        tree(trunks, leaves, xf - 1.3, y, rnd.uniform(0.85, 1.15), rnd)
        if k % 2 == 0:
            yl = y + 4.5
            lamps.tube([(xf - 0.4, yl, 0), (xf - 0.4, yl, 5.2), (xf - 1.4, yl, 5.6)], 0.07, seg=8)
            lamps.box((0.5, 0.25, 0.12), (xf - 1.6, yl, 5.55))
    ext(trunks.obj('TreeTrunks', M['trunk'], root))
    ext(leaves.obj('TreeCanopies', M['canopy'], root, angle=70))
    ext(lamps.obj('StreetLamps', M['lamp'], root))
    bodies, bodies2, glass, wheels = MB(), MB(), MB(), MB()
    for k, y in enumerate((-22, -14.5, 6, 16, 30)):
        car(bodies if k % 2 else bodies2, glass, wheels, x_houses + 1.4 + 0.2, y, rnd)
    ext(bodies.obj('Cars', M['carBody'], root, smooth=False, bevel=0.06))
    ext(bodies2.obj('CarsRed', M['carBody2'], root, smooth=False, bevel=0.06))
    ext(glass.obj('CarGlass', M['carGlass'], root, smooth=False))
    ext(wheels.obj('CarWheels', M['tyre'], root, smooth=False))
    # the houses across the street; the ones where the sun comes from are low, so it still reaches the windows
    plan = [(-40, -28, 4, 'flat'), (-28, -17, 3, 'tiled'), (-17, -9, 3, 'tiled'), (-9, 1, 2, 'flat'), (1, 13, 3, 'tiled'),
            (13, 22, 4, 'flat'), (22, 34, 4, 'flat'), (34, 46, 3, 'tiled'), (-54, -40, 5, 'flat')]
    for i, (ya, yb, fl, roof) in enumerate(plan):
        building(root, i, x_houses, ya + 0.15, yb - 0.15, fl, roof=roof)
    # further back, the rest of the town, taller and in the haze (the page adds the fog), and a bell tower
    for i, (ya, yb, fl) in enumerate([(-50, -30, 8), (-30, -12, 7), (-12, 6, 9), (6, 24, 7), (24, 44, 8)]):
        building(root, 20 + i, x_houses - 16, ya, yb, fl, depth=14, roof='flat')
    tower = MB().box((5, 5, 32), (x_houses - 40, 12, 16))
    ext(tower.obj('BellTower', M['facade3'], root, smooth=False))
    facade_uv(bpy.data.objects['BellTower'])
    v = [(x_houses - 42.8, 9.2, 32), (x_houses - 37.2, 9.2, 32), (x_houses - 37.2, 14.8, 32), (x_houses - 42.8, 14.8, 32), (x_houses - 40, 12, 38)]
    ext(MB().add((v, [(0, 1, 4), (1, 2, 4), (2, 3, 4), (3, 0, 4)])).obj('BellTowerRoof', M['roofTiles'], root, smooth=False))


# ---------------------------------------------------------------------------------------------
# Furniture and decor

def stool(name, loc):
    root = empty(name, loc=loc)
    MB().lathe([(0, 0.62), (0.17, 0.62), (0.175, 0.635), (0.17, 0.66), (0, 0.66)], 40).obj(name + 'Seat', M['stool'], root, angle=40)
    legs = MB()
    for i in range(4):
        a = pi / 4 + i * pi / 2
        legs.tube([(0.12 * cos(a), 0.12 * sin(a), 0.62), (0.2 * cos(a), 0.2 * sin(a), 0.0)], 0.012, seg=10)
    legs.tube([(0.165 * cos(pi / 4 + i * pi / 2) * (1 if i < 4 else 1), 0.165 * sin(pi / 4 + i * pi / 2), 0.22) for i in range(5)], 0.008, seg=8, caps=False)
    legs.obj(name + 'Legs', M['iron'], root)
    return root


def plant(name, loc, s=1.0, pot_r=0.1):
    """A pothos in a terracotta pot: leaves as cupped hearts on arching stems."""
    import random
    rnd = random.Random(sum(map(ord, name)))
    root = empty(name, loc=loc)
    pr = pot_r * s
    ph = pr * 1.4
    MB().lathe([(0, 0), (pr * 0.8, 0), (pr, ph * 0.92), (pr * 1.08, ph * 0.94), (pr * 1.08, ph), (pr * 0.95, ph), (pr * 0.92, ph * 0.9), (0, ph * 0.9)], 32).obj(name + 'Pot', M['pot'], root, angle=40)
    MB().lathe([(0, ph * 0.9), (pr * 0.92, ph * 0.9)], 24).obj(name + 'Soil', M['soil'], root, smooth=False, recalc=False)
    leaves = {'leaf': MB(), 'leafDark': MB()}
    stems = MB()
    for i in range(int(14 * s + 6)):
        a = rnd.uniform(0, 2 * pi)
        reach = rnd.uniform(0.08, 0.3) * s
        rise = rnd.uniform(0.05, 0.25) * s
        droop = rnd.uniform(0.0, 0.35) * s if reach > 0.18 * s else 0.0
        p0 = Vector((cos(a) * pr * 0.3, sin(a) * pr * 0.3, ph * 0.9))
        p1 = p0 + Vector((cos(a) * reach * 0.5, sin(a) * reach * 0.5, rise))
        p2 = p0 + Vector((cos(a) * reach, sin(a) * reach, rise * 0.6 - droop))
        pts = catmull([tuple(p0), tuple(p1), tuple(p2)], 5)
        stems.tube(pts, 0.0025 * s, seg=6)
        tip = Vector(pts[-1])
        tang = (Vector(pts[-1]) - Vector(pts[-2])).normalized()
        ls = rnd.uniform(0.05, 0.08) * s
        leaf_mesh(leaves['leaf' if rnd.random() < 0.6 else 'leafDark'], tip, tang, ls, rnd)
        # a second leaf along the stem
        mid = Vector(pts[len(pts) // 2])
        leaf_mesh(leaves['leafDark' if rnd.random() < 0.5 else 'leaf'], mid, (Vector(pts[len(pts) // 2 + 1]) - mid).normalized(), ls * 0.8, rnd)
    stems.obj(name + 'Stems', M['leafDark'], root)
    for k, mb in leaves.items():
        mb.obj(name + ('Leaves' if k == 'leaf' else 'LeavesDark'), M[k], root, angle=80)
    return root


def leaf_mesh(mb, at, tang, size, rnd):
    """A heart-shaped leaf, cupped along its midrib, facing up and outwards."""
    out = Vector((tang.x, tang.y, 0))
    if out.length < 1e-3:
        out = Vector((1, 0, 0))
    out.normalize()
    up = Vector((0, 0, 1))
    side = up.cross(out).normalized()
    tilt = rnd.uniform(-0.5, 0.3)
    fwd = (out * cos(tilt) + up * sin(tilt)).normalized()
    nrm = side.cross(fwd).normalized()
    verts, faces = [], []
    rows, cols = 6, 4
    for i in range(rows + 1):
        t = i / rows
        width = size * 0.55 * sin(pi * min(1, t * 1.15)) * (1.15 - t * 0.4)
        for j in range(cols + 1):
            s = j / cols * 2 - 1
            cup = (s * s) * size * 0.12
            p = at + fwd * (t * size) + side * (s * width) + nrm * (cup - 0.3 * size * t * t * 0.3)
            verts.append(tuple(p))
    for i in range(rows):
        for j in range(cols):
            a = i * (cols + 1) + j
            faces.append((a, a + 1, a + cols + 2, a + cols + 1))
    mb.add((verts, faces))


def crystals_jar(loc):
    """A small jar of blue copper sulfate crystals by the beaker: decor, it explains what is in the water."""
    root = empty('CuSO4Jar', loc=loc, label='Solfato di rame pentaidrato', pick=0)
    R = 0.026
    MB().lathe([(0, 0), (R, 0), (R, 0.055), (0.02, 0.06), (0.02, 0.066), (0, 0.066)], 40).obj('CuSO4JarGlass', M['glass'], root, angle=40)
    MB().lathe([(0, 0.064), (0.0215, 0.064), (0.0215, 0.08), (0, 0.08)], 32).obj('CuSO4JarCap', M['white'], root, angle=40)
    import random
    rnd = random.Random(4)
    c = MB()
    for _ in range(70):
        a = rnd.uniform(0, 2 * pi)
        r = (rnd.random() ** 0.5) * (R - 0.004)
        z = rnd.uniform(0.004, 0.026)
        s = rnd.uniform(0.0025, 0.0045)
        c.box((s, s * 0.8, s * 0.7), mat=Matrix.Translation((r * cos(a), r * sin(a), z)) @ Matrix.Rotation(rnd.uniform(0, pi), 4, Vector((rnd.random(), rnd.random(), rnd.random())).normalized()))
    c.obj('CuSO4JarCrystals', M['crystal'], root, smooth=False)
    L.label(root, R + 0.0003, 0.04, [('CuSO_4', 0.007), ('5 H_2O', 0.0055)], ang=-pi / 2, w=0.03, h=0.022, size=0.006)
    return root


# ---------------------------------------------------------------------------------------------

def experiment_kit(top):
    """The copper sulfate experiment's kit, laid out as in the first lab (build_lab.build): the burner under the tripod
    in the middle, the acid on the left, the oxide, the tools and the filtration on the right."""
    L.heat_mat((0, 0.02, top))
    B = (0.0, 0.02, top + 0.006)
    burner_rot = radians(52)
    L.bunsen(B, burner_rot)
    L.tripod(B)
    # the gas tap a little nearer than in the first lab, where a hand reaches it from in front of the bench
    tx, ty = 0.26, 0.2
    L.gas_tap((tx, ty, top))
    inlet = Vector(B) + Matrix.Rotation(burner_rot, 3, 'Z') @ Vector((0.072, 0, 0.011))
    nozzle = Vector((tx, ty - 0.049, top + 0.105))
    ndir = Vector((0, -1, 0))
    idir = Matrix.Rotation(burner_rot, 3, 'Z') @ Vector((1, 0, 0))
    L.hose(tuple(nozzle), tuple(inlet), [tuple(nozzle + ndir * 0.03 + Vector((0, 0, -0.05))), (tx - 0.02, ty - 0.1, top + 0.008), tuple(inlet + idir * 0.05 + Vector((0, 0, -0.002)))])
    L.beaker('Beaker', 0.026, 0.072, loc=(-0.2, -0.04, top), lbl='Becher da 100 mL')
    L.beaker('AcidBeaker', 0.021, 0.058, label_text=[('H_2SO_4', 0.0075), ('1 M', 0.006)], loc=(-0.38, 0.09, top), lbl='Becher con H₂SO₄ 1 M', fill=40, liquid='#dfe9f0',
             graduations=True, nominal=50, grad_ang=-pi / 2 + 1.25)
    L.reagent_bottle('AcidBottle', (-0.52, 0.2, top), [('H_2SO_4', 0.012), ('1 mol/L', 0.007), ('corrosivo', 0.0055)], color='#e6eef3', fill=260, lbl='Bottiglia di H₂SO₄ 1 M')
    tilt = math.asin((0.024 - 0.0012) / 0.54)
    L.pipette((-0.1, -0.25, top + 0.0012), (0, -(pi / 2 - tilt), 0))
    L.goggles((-0.74, -0.1, top))
    L.cuo_jar((0.3, 0.14, top))
    L.spatula((0.24, 0.04, top + 0.004), (0, pi / 2, radians(4)))
    L.glass_rod((0.2, -0.08, top + 0.003), (0, pi / 2, radians(-3)))
    L.thermometer((0.16, -0.2, top + 0.0042), (0, pi / 2, radians(2)))
    L.lighter((0.03, -0.32, top + 0.011), (0, pi / 2, 0))
    # the filtration nearer the front than in the first lab: pouring into the funnel, high on the flask, needs it in reach
    L.conical_flask((0.5, -0.08, top))
    L.funnel((0.5, -0.08, top + 0.145 - 0.0164 / math.tan(radians(30)) + 0.004))
    L.filter_paper((0.72, -0.24, top))
    L.evap_dish((0.82, -0.06, top))
    L.notebook((-1.0, -0.2, top))


def build():
    palette()
    textures()
    room()
    city()
    L.bench()
    top = Z0
    if KIT == 'esperimento':
        experiment_kit(top)
    else:
        # the slice's pieces: water with copper sulfate crystals, a rod, a flask to pour into, goggles
        L.beaker('Beaker', 0.026, 0.072, loc=(-0.1, -0.1, top), lbl='Becher con acqua', fill=60, liquid='#e8f1f4')
        crystals_jar((-0.26, 0.06, top))
        L.glass_rod((0.12, -0.14, top + 0.003), (0, pi / 2, radians(-6)))
        L.conical_flask((0.36, 0.04, top))
        L.goggles((-0.55, -0.12, top))
        L.notebook((-0.72, -0.16, top))
    L.wash_bottle((-0.42 if KIT == 'banco' else -0.86, 0.24, top))
    L.tube_rack((0.78 if KIT == 'banco' else 0.98, 0.24, top))
    L.retort_stand((-1.05, 0.16, top))
    plant('PlantBench', (1.12, 0.2, top), s=0.8, pot_r=0.08)
    plant('PlantFloor', (-2.05, 0.05, 0.0), s=1.6, pot_r=0.14)
    stool('Stool1', (-0.35, -0.75, 0))
    stool('Stool2', (0.75, -0.9, 0))
    shelf = top + 0.461
    L.reagent_bottle('ShelfHCl', (-0.8, WALL_Y - 0.1, shelf), [('HCl', 0.012), ('2 mol/L', 0.007)], color='#eef3f3', fill=280, lbl='Acido cloridrico')
    L.reagent_bottle('ShelfNaOH', (-0.65, WALL_Y - 0.1, shelf), [('NaOH', 0.011), ('1 mol/L', 0.007)], color='#f2f2ee', fill=240, lbl='Idrossido di sodio')
    L.reagent_bottle('ShelfCuSO4', (-0.5, WALL_Y - 0.1, shelf), [('CuSO_4', 0.011), ('0,5 mol/L', 0.007)], color='#1e7fd6', fill=300, lbl='Solfato di rame')
    L.reagent_bottle('ShelfKMnO4', (0.62, WALL_Y - 0.1, shelf), [('KMnO_4', 0.01), ('0,02 mol/L', 0.0065)], color='#6b1f7a', fill=220, amber=True, lbl='Permanganato di potassio')
    L.reagent_bottle('ShelfFeCl3', (0.77, WALL_Y - 0.1, shelf), [('FeCl_3', 0.011), ('0,1 mol/L', 0.007)], color='#d99a1c', fill=260, amber=True, lbl='Cloruro ferrico')
    L.beaker('ShelfBeaker1', 0.026, 0.072, loc=(-0.3, WALL_Y - 0.1, shelf), pick=False, lbl='Becher')
    L.beaker('ShelfBeaker2', 0.021, 0.058, nominal=50, loc=(-0.22, WALL_Y - 0.08, shelf), pick=False, lbl='Becher')
    plant('PlantShelf', (0.2, WALL_Y - 0.1, shelf), s=0.55, pot_r=0.06)
    L.periodic_table((-1.25, WALL_Y - 0.003, 1.95))
    L.clock((1.25, WALL_Y - 0.001, 2.2))
    L.safety_sign((1.45, WALL_Y - 0.003, 1.72))


def finish(lm_roots=('Room', 'Bench', 'Stool1', 'Stool2', 'PlantFloor'), extras=None,
           shots=(('banco-view', (0.0, -1.3, 1.62), (0.0, 0.1, 1.0), 24), ('banco-window', (1.2, -1.4, 1.62), (-2.4, -0.5, 1.5), 24))):
    """Names, light, the two bakes and the export, for the scene built so far (build_aula.py calls it too). `lm_roots`:
    the roots whose meshes the inside lightmap paints; `extras`: more keys for the `Lighting` node."""

    # stable names: the exporter uses object names, and the page looks nodes up by name
    for ob in scene.objects:
        if ob.type == 'MESH' and ob.data.name != ob.name:
            ob.data.name = ob.name


    # ---------------------------------------------------------------------------------------------
    # Light: sun and sky, then the bake

    def lin(h):
        return L.lin(h)


    sun = bpy.data.objects.new('Sun', bpy.data.lights.new('Sun', 'SUN'))
    sun.data.energy = SUN_STRENGTH
    sun.data.color = lin(SUN_COLOR)
    sun.data.angle = radians(1.5)
    sun.rotation_euler = SUN_DIR.to_track_quat('-Z', 'Y').to_euler()
    scene.collection.objects.link(sun)
    world = bpy.data.worlds.new('Sky')
    world.use_nodes = True
    world.node_tree.nodes['Background'].inputs['Color'].default_value = (*lin(SKY_COLOR), 1)
    world.node_tree.nodes['Background'].inputs['Strength'].default_value = SKY_STRENGTH
    scene.world = world
    # the ceiling fittings are on: an area light under each, the colour of 4000 K fluorescent tubes
    for (cx, cy) in LAMPS:
        la = bpy.data.objects.new('LampLight', bpy.data.lights.new('LampLight', 'AREA'))
        la.data.shape = 'RECTANGLE'
        la.data.size = LAMP_L - 0.06
        la.data.size_y = LAMP_W - 0.04
        la.data.energy = LAMP_POWER
        la.data.color = lin(LAMP_COLOR)
        la.location = (cx, cy, H - LAMP_D - 0.002)
        scene.collection.objects.link(la)
    portals = []
    for (y0, y1) in WINDOWS:
        pl = bpy.data.objects.new('Portal', bpy.data.lights.new('Portal', 'AREA'))
        pl.data.shape = 'RECTANGLE'
        pl.data.size = y1 - y0
        pl.data.size_y = WIN_Z[1] - WIN_Z[0]
        pl.location = (X0 - 0.2, (y0 + y1) / 2, sum(WIN_Z) / 2)
        pl.rotation_euler = (0, radians(90), 0)  # facing +x, into the room
        try:
            pl.data.cycles.is_portal = True
        except AttributeError:
            pass
        scene.collection.objects.link(pl)
        portals.append(pl)


    def root_of(ob):
        while ob.parent:
            ob = ob.parent
        return ob


    def owner_label(ob):
        p = ob
        while p:
            if 'pick' in p.keys() and p['pick']:
                return p
            p = p.parent
        return None


    def is_glass(ob):
        return any(s.material and s.material.name.startswith('Glass') for s in ob.material_slots)


    # what the bakes paint: inside, the room and the furniture; outside, the town
    LM_ROOTS = set(lm_roots)
    inside = [ob for ob in scene.objects if ob.type == 'MESH' and root_of(ob).name in LM_ROOTS and not is_glass(ob) and ob.name not in ('LampTubes', 'WallOutside', 'RoomShell')]
    outside = [ob for ob in scene.objects if ob.type == 'MESH' and ob.get('lm') == 'ext']
    movable = [ob for ob in scene.objects if ob.type == 'MESH' and owner_label(ob)]
    print('LIGHTMAPPED', len(inside), 'OUTSIDE', len(outside), 'MOVABLE', len(movable))


    def unwrap(objs):
        """A second UV map, 'Light', packed into one atlas for the objects together."""
        bpy.ops.object.select_all(action='DESELECT')
        for ob in objs:
            bpy.context.view_layer.objects.active = ob
            ob.select_set(True)
            for mod in list(ob.modifiers):
                bpy.ops.object.modifier_apply(modifier=mod.name)
            ob.select_set(False)
            me = ob.data
            if not me.uv_layers:
                me.uv_layers.new(name='UVMap')
            me.uv_layers.active = me.uv_layers.new(name='Light')
        for ob in objs:
            ob.select_set(True)
        bpy.context.view_layer.objects.active = objs[0]
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.uv.smart_project(angle_limit=radians(55), island_margin=0.0, area_weight=0.0, correct_aspect=True, scale_to_bounds=False)
        bpy.ops.uv.average_islands_scale()
        bpy.ops.uv.pack_islands(rotate=True, margin=0.0035)
        bpy.ops.object.mode_set(mode='OBJECT')
        bpy.ops.object.select_all(action='DESELECT')


    unwrap(inside)
    unwrap(outside)

    # Cycles on the CPU; BANCO_GPU=1 tries the GPU (Metal crashes compiling its kernels in some sandboxed shells)
    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'CPU'
    if os.environ.get('BANCO_GPU'):
        prefs = bpy.context.preferences.addons['cycles'].preferences
        for dev in ('METAL', 'OPTIX', 'CUDA', 'HIP'):
            try:
                prefs.compute_device_type = dev
                prefs.get_devices()
                if any(d.type == dev for d in prefs.devices):
                    for d in prefs.devices:
                        d.use = True
                    scene.cycles.device = 'GPU'
                    print('BAKE DEVICE', dev)
                    break
            except TypeError:
                continue
    scene.cycles.samples = SAMPLES
    scene.cycles.max_bounces = 6
    scene.cycles.diffuse_bounces = 4
    scene.render.bake.margin = 6
    scene.render.bake.use_clear = True

    import numpy as np  # noqa: E402

    # the movable pieces are not there for the bakes; the glass would only add noise
    # the tubes glow on screen; their light is the area lights'
    hidden = [ob for ob in scene.objects if ob.type == 'MESH' and (ob in movable or is_glass(ob) or ob.name == 'LampTubes')]
    for ob in hidden:
        ob.hide_render = True


    def blur(a, r):
        """A box blur, three times: close to a gaussian."""
        for _ in range(3):
            for ax in (0, 1):
                c = np.cumsum(np.pad(a, [(r + 1, r) if i == ax else (0, 0) for i in range(a.ndim)], mode='edge'), axis=ax)
                hi = np.take(c, range(2 * r + 1, c.shape[ax]), axis=ax)
                lo = np.take(c, range(0, c.shape[ax] - 2 * r - 1), axis=ax)
                a = (hi - lo) / (2 * r + 1)
        return a


    def srgb(x):
        return np.where(x <= 0.0031308, 12.92 * x, 1.055 * np.power(np.maximum(x, 0), 1 / 2.4) - 0.055)


    def bake_atlas(objs, size, path, with_sun):
        """
        Bakes the diffuse light (without the surfaces' colour) of `objs` into one image. Inside, the sun's direct light is
        left out (the page adds it live); outside everything is in. Returns the scale the PNG was divided by.
        """
        img = bpy.data.images.new('Lightmap', size, size, alpha=True, float_buffer=True)
        added = []
        for ob in objs:
            for slot in ob.material_slots:
                m = slot.material
                if not m:
                    continue
                nd = m.node_tree.nodes.get('LightmapBake') or m.node_tree.nodes.new('ShaderNodeTexImage')
                nd.name = 'LightmapBake'
                nd.image = img
                m.node_tree.nodes.active = nd
                added.append((m, nd))
        for ob in scene.objects:
            ob.select_set(False)
        for ob in objs:
            ob.data.uv_layers.active = ob.data.uv_layers['Light']
            ob.select_set(True)
        bpy.context.view_layer.objects.active = objs[0]

        def bake(passes):
            bpy.ops.object.bake(type='DIFFUSE', pass_filter=passes, use_clear=True, margin=6)
            return np.array(img.pixels[:], dtype=np.float32).reshape(size, size, 4)

        if with_sun:
            both = bake({'DIRECT', 'INDIRECT'})
            light = both[..., :3]
            mask = (both[..., 3] > 0.5).astype(np.float32)
        else:
            indirect = bake({'INDIRECT'})
            sun.hide_render = True
            direct = bake({'DIRECT'})
            sun.hide_render = False
            light = indirect[..., :3] + direct[..., :3]
            mask = (indirect[..., 3] > 0.5).astype(np.float32)
        # denoise: a blur that only mixes texels of the islands
        r = max(1, size // 1024)
        den = blur(light * mask[..., None], r) / np.maximum(blur(mask, r), 1e-4)[..., None]
        light = np.where(mask[..., None] > 0, den, light)
        scale = float(np.percentile(light[mask > 0].max(axis=1), 99.5)) / 0.92
        enc = np.clip(srgb(np.clip(light / scale, 0, 1)), 0, 1)
        out = bpy.data.images.new('LightmapOut', size, size, alpha=False)
        out.pixels.foreach_set(np.concatenate([enc, np.ones((size, size, 1))], axis=2).astype(np.float32).ravel())
        out.filepath_raw = path
        out.file_format = 'PNG'
        os.makedirs(os.path.dirname(path), exist_ok=True)
        out.save()
        for m, nd in added:
            if nd.name in m.node_tree.nodes:
                m.node_tree.nodes.remove(nd)
        for ob in objs:
            ob.data.uv_layers.active = ob.data.uv_layers[0]
            ob.select_set(False)
        print('LIGHTMAP', path, 'scale', scale)
        return scale


    scale = bake_atlas(inside, SIZE, LIGHTMAP, with_sun=False)
    # the portals only help the inside
    for pl in portals:
        pl.hide_render = True
    scale_ext = bake_atlas(outside, max(1024, SIZE // 2), LIGHTMAP_EXT, with_sun=True)
    for ob in hidden:
        ob.hide_render = False

    # what the page needs to light the rest the same way (three.js axes: x, z, -y)
    lt = empty('Lighting')
    d3 = (SUN_DIR.x, SUN_DIR.z, -SUN_DIR.y)
    lt['sun_dir'] = json.dumps([round(v, 5) for v in d3])
    lt['sun_color'] = SUN_COLOR
    lt['sun_strength'] = SUN_STRENGTH
    lt['sky_color'] = SKY_COLOR
    lt['sky_strength'] = SKY_STRENGTH
    lt['lightmap_scale'] = round(scale, 5)
    lt['lightmap'] = os.path.basename(LIGHTMAP)
    lt['lightmap_ext_scale'] = round(scale_ext, 5)
    lt['lightmap_ext'] = os.path.basename(LIGHTMAP_EXT)
    for k, v in (extras or {}).items():
        lt[k] = v
    for pl in portals:
        bpy.data.objects.remove(pl)

    bpy.ops.export_scene.gltf(
        filepath=OUT, export_format='GLB', export_extras=True, export_apply=True, export_yup=True,
        export_morph=True, export_morph_normal=False, export_animations=False, export_cameras=False,
        export_lights=False, export_image_format='AUTO', export_texcoords=True, export_normals=True,
    )
    print('EXPORTED', OUT, os.path.getsize(OUT))

    if PREVIEW:
        os.makedirs(PREVIEW, exist_ok=True)
        scene.cycles.samples = 64
        scene.render.resolution_x = 1280
        scene.render.resolution_y = 800
        cam = bpy.data.objects.new('Cam', bpy.data.cameras.new('Cam'))
        scene.collection.objects.link(cam)
        scene.camera = cam
        for name, eye, target, lens in shots:
            cam.location = eye
            cam.rotation_euler = (Vector(target) - Vector(eye)).to_track_quat('-Z', 'Y').to_euler()
            cam.data.lens = lens
            scene.render.filepath = os.path.join(PREVIEW, name + '.png')
            bpy.ops.render.render(write_still=True)


if __name__ == '__main__':
    build()
    finish()
