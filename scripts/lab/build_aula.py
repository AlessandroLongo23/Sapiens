"""
The whole school chemistry lab (/laboratorio/aula): a room of about 10 x 10 m for twelve students at shared double
desks and a teacher, in the painted style of the vertical slice (build_banco.py, whose room, windows, lamps, town,
bake and export it reuses with its own plan).

    blender -b --factory-startup -P scripts/lab/build_aula.py -- public/lab/aula.glb [preview-dir]

The plan follows the UK guidance on school science labs (DfE Building Bulletin 80; CLEAPSS G14, 2009):
- every student faces the teaching wall, which is at 90 degrees to the window wall (no glare on the board);
- two columns of double desks in three rows, a 1.4 m aisle in the middle and at least 1.1 m to the perimeter;
- the teacher's bench in front, with room to gather round it for a demonstration, the fume cupboard beside it (in
  sight of the class, away from the exits), the safety equipment and the emergency cut-off at the teacher's base;
- the storage wall on the long side opposite the windows, the instrument bench against the back wall, two doors.
Each desk has a service spine at the back: a gas tap and sockets for each student, a sink between the two.

What many schools lack, and the room has anyway: a fume cupboard, a safety shower and eyewash, the ventilated
cabinets for flammables and corrosives, and an instrument bench (analytical balance, UV-Vis spectrophotometer, pH
meter, centrifuge, stirring hot plate, distillation, drying oven).

The player's place is the left half of the second row's window-side desk, with the copper sulfate experiment's kit
laid out in the half's 1.3 m. Every place is an empty `Station<n>` (extras: role, player) where the page stands a
person; the `Lighting` node's extras carry the plan the page needs (room, desks, obstacles, where to start).
"""
import bpy, os, sys, json, math, random
from math import pi, radians, sin, cos
from mathutils import Vector, Matrix

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_lab as L  # noqa: E402  (resets the scene and defines the equipment)
import build_banco as B  # noqa: E402  (the room, the town, the bake; nothing runs on import)
from build_lab import M, MB, material, empty, box  # noqa: E402

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = os.path.abspath(argv[0]) if argv else '/tmp/aula.glb'
PREVIEW = os.path.abspath(argv[1]) if len(argv) > 1 else None
STEM = os.path.splitext(os.path.basename(OUT))[0]

# ---------------------------------------------------------------------------------------------
# The plan, Blender axes (x across the room, y towards the teaching wall, z up), metres. The windows are on the left
# wall (x = X0), the storage wall and the doors on the right (x = X1), the teaching wall at y = Y1, the back at Y0.

X0, X1, Y0, Y1, H = -2.3, 7.7, -4.7, 5.4, 3.1
TOP = L.Z0  # desk height, 0.90
DESK_L, DESK_D = 2.6, 0.8  # a double desk: 1.3 m for each student
COLUMNS = {'A': -0.65, 'B': 3.35}  # left edge of each column's desks
ROWS = {1: 1.52, 2: -0.38, 3: -2.28}  # front edge (the students' side) of each row's desks
PLAYER = (2, 'A', 0)  # row, column, half (0 left, 1 right)
STAND = 0.42  # where a student stands, behind the desk's front edge
TEACHER_BENCH = (1.25, 3.9, 2.8, 0.8)  # x0, y0 (the class side), length, depth
HOOD = (5.6, 4.6, 1.5, 0.8)  # fume cupboard: x0, y0, width, depth, against the teaching wall
BACK_BENCH = (-1.9, Y0, 6.0, 0.65)  # the instrument bench: x0, y0 (against the wall), length, depth
STORE_D = 0.62  # depth of the cupboards on the storage wall
WINDOWS = [(-3.95, -2.25), (-1.75, -0.05), (0.45, 2.15), (2.65, 4.35)]
DOORS = [(-4.25, -3.25), (2.0, 3.0)]
LAMPS = [(x, y) for y in (-3.2, -0.3, 2.6) for x in (0.0, 1.95, 3.9, 5.85)]

B.X0, B.X1, B.Y0, B.Y1, B.H = X0, X1, Y0, Y1, H
B.WINDOWS, B.WIN_Z, B.DOORS, B.LAMPS = WINDOWS, (1.0, 2.5), DOORS, LAMPS
# 2048 px and 128 samples: side by side with 4096 and 256 the difference does not show, even enlarged, and the bake
# takes about 12 minutes on the processor (M5, nothing else running) instead of hours (30 September 2026)
B.SIZE = int(os.environ.get('AULA_LIGHTMAP', '2048'))
B.SAMPLES = int(os.environ.get('AULA_SAMPLES', '128'))
B.LIGHTMAP = os.path.join(os.path.dirname(OUT), f'{STEM}-luce.png')
B.LIGHTMAP_EXT = os.path.join(os.path.dirname(OUT), f'{STEM}-esterno.png')

scene = bpy.context.scene
rnd = random.Random(30)


def three(x, y, z=0.0):
    """Blender to three.js axes."""
    return [round(x, 4), round(z, 4), round(-y, 4)]


def rect3(x0, y0, x1, y1):
    """A floor rectangle in three.js axes: minX, maxX, minZ, maxZ."""
    return [round(min(x0, x1), 4), round(max(x0, x1), 4), round(-max(y0, y1), 4), round(-min(y0, y1), 4)]


OBSTACLES, BENCHES = [], []
KIT_ROOTS = set()


# ---------------------------------------------------------------------------------------------
# Materials for what is new here

def palette():
    B.palette()
    add = {
        'spine': ('SpinePale', '#e7ebea', 0.7),
        'steelSink': ('SinkSteel', '#b9c2c6', 0.35),
        'sinkDark': ('SinkInside', '#6f7a80', 0.4),
        'hoodWhite': ('HoodWhite', '#eef1f0', 0.6),
        'hoodInside': ('HoodInside', '#d9e0e0', 0.8),
        'safetyGreen': ('SafetyGreen', '#2f9a62', 0.6),
        'safetyYellow': ('SafetyYellow', '#e8c13a', 0.6),
        'safetyRed': ('SafetyRed', '#c9453a', 0.55),
        'cabYellow': ('CabinetYellow', '#e5b733', 0.6),
        'cabBlue': ('CabinetBlue', '#4f7fb3', 0.6),
        'instrument': ('InstrumentGrey', '#dcdfe0', 0.55),
        'instrumentDark': ('InstrumentDark', '#3a4148', 0.5),
        'screen': ('ScreenDark', '#1f2b33', 0.3),
        'shelfGlass': ('ShelfGlassware', '#c9dbe2', 0.35),
        'boardWhite': ('BoardWhite', '#f6f7f4', 0.4),
        'boardInk': ('BoardInk', '#1f2f4f', 0.6),
        'boardRed': ('BoardRed', '#c23b33', 0.6),
        'coat1': ('CoatNavy', '#34466a', 0.9),
        'coat2': ('CoatRust', '#b0643e', 0.9),
        'coat3': ('CoatGreen', '#5b7f5d', 0.9),
        'bag': ('BagGrey', '#5a6068', 0.9),
        'cardboard': ('Cardboard', '#c7a676', 0.9),
        'jerryBlue': ('JerrycanBlue', '#3f74b8', 0.6),
        'jerryWhite': ('JerrycanWhite', '#e9ebe6', 0.6),
        'mantle': ('HeatingMantle', '#8a8f94', 0.6),
    }
    for k, (name, col, rough) in add.items():
        M[k] = material(name, col, rough=rough)
    M['hoodLight'] = material('HoodLight', '#ffffff', emission='#f4f7ff', estr=3.0)
    M['uvGlow'] = material('GoggleUV', '#8f6fd6', emission='#8f6fd6', estr=2.0)
    M['display'] = material('DisplayGreen', '#6fe0a0', emission='#6fe0a0', estr=1.5)
    # bottles on the shelves: opaque, cheap, never picked
    for i, col in enumerate(('#eef3f3', '#1e7fd6', '#6b1f7a', '#d99a1c', '#f2f2ee', '#9fc9a8', '#e6c9a0', '#c8d6e8')):
        M[f'bottle{i}'] = material(f'ShelfBottle{i}', col, rough=0.35)


# ---------------------------------------------------------------------------------------------
# Desks

def desk(name, x0, y0, player_half=None, taps=(True, True)):
    """A double desk for two students standing side by side, facing +y. The cabinets are at the back, with knee room
    in front; a service spine along the back edge carries each student's gas tap and sockets, and a sink between."""
    root = empty(name)
    L_, D = DESK_L, DESK_D
    xc = x0 + L_ / 2
    top = MB().box((L_, D, 0.035), (xc, y0 + D / 2, TOP - 0.0175))
    top.obj('BenchTop' if player_half is not None else name + 'Top', M['epoxy'], root, smooth=False, bevel=0.004)
    cab_y0 = y0 + 0.36
    MB().box((L_ - 0.04, D - 0.38, TOP - 0.035 - 0.1), (xc, (cab_y0 + y0 + D) / 2, 0.1 + (TOP - 0.135) / 2)).obj(name + 'Carcass', M['cabinet'], root, smooth=False)
    MB().box((L_ - 0.1, D - 0.44, 0.1), (xc, (cab_y0 + y0 + D) / 2 + 0.02, 0.05)).obj(name + 'Plinth', M['plinth'], root, smooth=False)
    doors, handles = MB(), MB()
    n = 4
    w = (L_ - 0.06) / n
    for i in range(n):
        cx = x0 + 0.03 + w * (i + 0.5)
        doors.box((w - 0.008, 0.018, TOP - 0.035 - 0.12), (cx, cab_y0 - 0.009, 0.1 + (TOP - 0.155) / 2 + 0.005))
        hx = cx + (w / 2 - 0.05) * (1 if i % 2 else -1)
        handles.tube([(hx, cab_y0 - 0.018, TOP - 0.12), (hx, cab_y0 - 0.04, TOP - 0.115), (hx, cab_y0 - 0.04, TOP - 0.305), (hx, cab_y0 - 0.018, TOP - 0.3)], 0.005, seg=8)
    doors.obj(name + 'Doors', M['cabinetDoor'], root, smooth=False, bevel=0.003)
    handles.obj(name + 'Handles', M['steel'], root)
    # the spine: a raised strip along the back edge, 22 cm high
    sy0 = y0 + D - 0.11
    MB().box((L_, 0.11, 0.22), (xc, sy0 + 0.055, TOP + 0.11)).obj(name + 'Spine', M['spine'], root, smooth=False, bevel=0.004)
    sock, holes, taps_mb, levers = MB(), MB(), MB(), MB()
    for half in (0, 1):
        hx = x0 + L_ / 4 + half * L_ / 2
        for dx in (-0.36, -0.26):
            sx = hx + dx * (1 if half == 0 else -1)
            sock.box((0.075, 0.012, 0.075), (sx, sy0 - 0.006, TOP + 0.13))
            for ddx in (-0.009, 0.009):
                holes.add(L.lathe_data([(0, 0), (0.002, 0)], 8), Matrix.Translation((sx + ddx, sy0 - 0.0125, TOP + 0.13)) @ Matrix.Rotation(pi / 2, 4, 'X'))
        # the player's half has the kit's own tap in front of the spine
        if half != player_half and taps[half]:
            tx = hx + 0.28 * (1 if half == 0 else -1)
            taps_mb.box((0.05, 0.04, 0.05), (tx, sy0 - 0.02, TOP + 0.09))
            taps_mb.tube([(tx, sy0 - 0.04, TOP + 0.09), (tx, sy0 - 0.075, TOP + 0.085), (tx, sy0 - 0.09, TOP + 0.075)], 0.006, seg=8)
            levers.box((0.012, 0.05, 0.012), (tx, sy0 - 0.03, TOP + 0.125))
    sock.obj(name + 'Sockets', M['white'], root, smooth=False, bevel=0.003)
    holes.obj(name + 'SocketHoles', M['black'], root, smooth=False, recalc=False)
    taps_mb.obj(name + 'GasTaps', M['brass'], root)
    levers.obj(name + 'GasLevers', M['yellow'], root, smooth=False)
    # the sink between the two places, set into the top against the spine, with a swan-neck tap from the spine
    sink_x, sink_y = xc, sy0 - 0.14
    MB().box((0.3, 0.24, 0.012), (sink_x, sink_y, TOP + 0.006)).obj(name + 'SinkRim', M['steelSink'], root, smooth=False, bevel=0.003)
    MB().box((0.26, 0.2, 0.002), (sink_x, sink_y, TOP + 0.0125)).obj(name + 'SinkBowl', M['sinkDark'], root, smooth=False)
    MB().tube([(sink_x, sy0 + 0.02, TOP + 0.22), (sink_x, sy0 + 0.02, TOP + 0.34), (sink_x, sy0 - 0.06, TOP + 0.37), (sink_x, sy0 - 0.12, TOP + 0.3)], 0.009, seg=10).obj(name + 'Faucet', M['chrome'], root)
    OBSTACLES.append(rect3(x0, y0, x0 + L_, y0 + D))
    BENCHES.append(rect3(x0, y0, x0 + L_, y0 + D) + [TOP])
    return root


# ---------------------------------------------------------------------------------------------
# Light decor for the other places (no names the page looks up, no liquids, nothing to take)

def strip(root):
    """Makes a piece of equipment decor: no label to hover, nothing to pick, no liquid to compute."""
    for k in ('label', 'pick', 'inner', 'spout', 'capacity', 'fill', 'liquid', 'mark'):
        if k in root.keys():
            del root[k]
    return root


def decor_burner(name, loc):
    root = empty(name, loc=loc)
    MB().lathe([(0, 0), (0.045, 0), (0.045, 0.012), (0.012, 0.018), (0, 0.018)], 24).obj(name + 'Base', M['iron'], root, angle=40)
    MB().lathe([(0, 0.018), (0.0085, 0.018), (0.0085, 0.13), (0, 0.13)], 16).obj(name + 'Tube', M['steel'], root, angle=40)
    MB().lathe([(0, 0.03), (0.011, 0.03), (0.011, 0.05), (0, 0.05)], 16).obj(name + 'Collar', M['brass'], root, angle=40)
    return root


def decor_goggles(name, loc, rot):
    root = empty(name, loc=loc, rot=(0, 0, rot))
    fr = MB()
    for s in (-1, 1):
        fr.box((0.07, 0.03, 0.045), (s * 0.04, 0, 0.024))
    fr.obj(name + 'Frame', M['gogFrame'], root, smooth=False, bevel=0.008)
    MB().box((0.16, 0.012, 0.012), (0, 0.02, 0.012)).obj(name + 'Strap', M['strap'], root, smooth=False)
    return root


def decor_notebook(name, loc, rot):
    root = empty(name, loc=loc, rot=(0, 0, rot))
    MB().box((0.15, 0.21, 0.008), (0, 0, 0.004)).obj(name + 'Pages', M['pages'], root, smooth=False, bevel=0.001)
    MB().box((0.152, 0.212, 0.0015), (0, 0, 0.0088)).obj(name + 'Cover', M['notebook'], root, smooth=False)
    return root


def decor_beaker(name, loc, fill=True):
    root = L.beaker(name, 0.026, 0.072, loc=loc, graduations=False, pick=False, lbl='Becher')
    return strip(root)


def classmate_kit(n, hx, y0, top):
    """What is out on a classmate's half: a burner on its mat, a beaker, goggles, a notebook, each a little different."""
    j = lambda a: rnd.uniform(-a, a)
    L.heat_mat((hx + j(0.05), y0 + 0.42 + j(0.03), top))
    decor_burner(f'CmBurner{n}', (hx + j(0.05), y0 + 0.42 + j(0.03), top + 0.006))
    decor_beaker(f'CmBeaker{n}', (hx - 0.25 + j(0.05), y0 + 0.3 + j(0.05), top))
    decor_goggles(f'CmGoggles{n}', (hx - 0.45 + j(0.04), y0 + 0.14 + j(0.04), top), j(0.5))
    decor_notebook(f'CmNotebook{n}', (hx + 0.38 + j(0.05), y0 + 0.2 + j(0.04), top), radians(rnd.uniform(-20, 20)))


def rename_heat_mats():
    """heat_mat() always calls its root HeatMat; the copies get their own names (the page looks HeatMat up)."""
    mats = [o for o in bpy.data.objects if o.name.startswith('HeatMat') and o.parent is None]
    for i, o in enumerate(sorted(mats, key=lambda o: o.name)):
        if o.name != 'HeatMat':
            o.name = f'CmHeatMat{i}'
            strip(o)
            for c in o.children_recursive:
                c.name = f'CmHeatMat{i}_{c.name.split(".")[0]}'


# ---------------------------------------------------------------------------------------------
# The player's kit: the copper sulfate experiment, laid out in a half desk (1.3 m) instead of a whole bench

def player_kit(top):
    L.heat_mat((0, 0.02, top))
    Bn = (0.0, 0.02, top + 0.006)
    burner_rot = radians(52)
    L.bunsen(Bn, burner_rot)
    L.tripod(Bn)
    tx, ty = 0.2, 0.2
    L.gas_tap((tx, ty, top))
    inlet = Vector(Bn) + Matrix.Rotation(burner_rot, 3, 'Z') @ Vector((0.072, 0, 0.011))
    nozzle = Vector((tx, ty - 0.049, top + 0.105))
    ndir = Vector((0, -1, 0))
    idir = Matrix.Rotation(burner_rot, 3, 'Z') @ Vector((1, 0, 0))
    L.hose(tuple(nozzle), tuple(inlet), [tuple(nozzle + ndir * 0.03 + Vector((0, 0, -0.05))), (tx - 0.02, ty - 0.1, top + 0.008), tuple(inlet + idir * 0.05 + Vector((0, 0, -0.002)))])
    L.beaker('Beaker', 0.026, 0.072, loc=(-0.2, -0.04, top), lbl='Becher da 100 mL')
    L.beaker('AcidBeaker', 0.021, 0.058, label_text=[('H_2SO_4', 0.0075), ('1 M', 0.006)], loc=(-0.34, 0.09, top), lbl='Becher con H₂SO₄ 1 M', fill=40, liquid='#dfe9f0',
             graduations=True, nominal=50, grad_ang=-pi / 2 + 1.25)
    L.reagent_bottle('AcidBottle', (-0.48, 0.22, top), [('H_2SO_4', 0.012), ('1 mol/L', 0.007), ('corrosivo', 0.0055)], color='#e6eef3', fill=260, lbl='Bottiglia di H₂SO₄ 1 M')
    tilt = math.asin((0.024 - 0.0012) / 0.54)
    L.pipette((-0.1, -0.25, top + 0.0012), (0, -(pi / 2 - tilt), 0))
    L.goggles((-0.56, -0.02, top))
    L.cuo_jar((0.33, 0.1, top))
    L.spatula((0.25, -0.02, top + 0.004), (0, pi / 2, radians(4)))
    L.glass_rod((0.2, -0.12, top + 0.003), (0, pi / 2, radians(-3)))
    L.thermometer((0.16, -0.22, top + 0.0042), (0, pi / 2, radians(2)))
    L.lighter((0.03, -0.32, top + 0.011), (0, pi / 2, 0))
    L.conical_flask((0.46, -0.1, top))
    L.funnel((0.46, -0.1, top + 0.145 - 0.0164 / math.tan(radians(30)) + 0.004))
    L.filter_paper((0.56, -0.29, top))
    L.evap_dish((0.55, 0.12, top))
    L.notebook((-0.5, -0.3, top))


# ---------------------------------------------------------------------------------------------
# The teacher's bench, the board, the fume cupboard, the safety corner

def teacher_bench():
    x0, y0, L_, D = TEACHER_BENCH
    root = empty('TeacherBench')
    xc = x0 + L_ / 2
    MB().box((L_, D, 0.035), (xc, y0 + D / 2, TOP - 0.0175)).obj('TeacherTop', M['epoxy'], root, smooth=False, bevel=0.004)
    MB().box((L_ - 0.04, D - 0.06, TOP - 0.135), (xc, y0 + D / 2, 0.1 + (TOP - 0.135) / 2)).obj('TeacherCarcass', M['cabinet'], root, smooth=False)
    MB().box((L_ - 0.1, D - 0.12, 0.1), (xc, y0 + D / 2, 0.05)).obj('TeacherPlinth', M['plinth'], root, smooth=False)
    # the class sees a closed front; the teacher's side has drawers
    dr = MB()
    for i in range(5):
        cx = x0 + 0.05 + (L_ - 0.1) * (i + 0.5) / 5
        for k in range(3):
            dr.box(((L_ - 0.1) / 5 - 0.01, 0.018, 0.2), (cx, y0 + D + 0.009, 0.2 + k * 0.22))
    dr.obj('TeacherDrawers', M['cabinetDoor'], root, smooth=False, bevel=0.003)
    MB().box((L_ - 0.02, 0.012, TOP - 0.16), (xc, y0 - 0.006, 0.1 + (TOP - 0.16) / 2 + 0.01)).obj('TeacherFront', M['cabinetDoor'], root, smooth=False, bevel=0.003)
    MB().box((0.36, 0.28, 0.012), (x0 + L_ - 0.4, y0 + D - 0.2, TOP + 0.006)).obj('TeacherSinkRim', M['steelSink'], root, smooth=False, bevel=0.003)
    MB().box((0.32, 0.24, 0.002), (x0 + L_ - 0.4, y0 + D - 0.2, TOP + 0.0125)).obj('TeacherSinkBowl', M['sinkDark'], root, smooth=False)
    MB().tube([(x0 + L_ - 0.4, y0 + D - 0.03, TOP), (x0 + L_ - 0.4, y0 + D - 0.03, TOP + 0.3), (x0 + L_ - 0.4, y0 + D - 0.12, TOP + 0.33), (x0 + L_ - 0.4, y0 + D - 0.2, TOP + 0.26)], 0.01, seg=10).obj('TeacherFaucet', M['chrome'], root)
    # a demonstration set up: a burner under a flask on a stand, a laptop
    decor_burner('DemoBurner', (xc - 0.5, y0 + 0.4, TOP))
    stand = MB()
    stand.box((0.16, 0.24, 0.012), (xc - 0.3, y0 + 0.45, TOP + 0.006))
    stand.tube([(xc - 0.3, y0 + 0.52, TOP), (xc - 0.3, y0 + 0.52, TOP + 0.6)], 0.006, seg=8)
    stand.tube([(xc - 0.3, y0 + 0.52, TOP + 0.3), (xc - 0.45, y0 + 0.42, TOP + 0.3)], 0.004, seg=8)
    stand.obj('DemoStand', M['iron'], root)
    MB().lathe([(0, 0), (0.03, 0.005), (0.055, 0.04), (0.058, 0.07), (0.045, 0.1), (0.016, 0.12), (0.016, 0.2), (0.019, 0.21)], 32).obj('DemoFlask', M['glass'], root, loc=(xc - 0.5, y0 + 0.4, TOP + 0.2))
    lap = MB()
    lap.box((0.34, 0.24, 0.018), (xc + 0.35, y0 + 0.5, TOP + 0.009))
    lap.add(L.box_data((0.34, 0.012, 0.23)), Matrix.Translation((xc + 0.35, y0 + 0.64, TOP + 0.13)) @ Matrix.Rotation(radians(-12), 4, 'X'))
    lap.obj('Laptop', M['instrumentDark'], root, smooth=False, bevel=0.003)
    MB().add(L.box_data((0.3, 0.004, 0.19)), Matrix.Translation((xc + 0.35, y0 + 0.632, TOP + 0.13)) @ Matrix.Rotation(radians(-12), 4, 'X')).obj('LaptopScreen', M['screen'], root, smooth=False)
    OBSTACLES.append(rect3(x0, y0, x0 + L_, y0 + D))
    BENCHES.append(rect3(x0, y0, x0 + L_, y0 + D) + [TOP])
    B.stool('TeacherStool', (xc - 0.6, y0 + D + 0.35, 0))


def board():
    """The interactive whiteboard (LIM) on the teaching wall, with today's experiment written up."""
    root = empty('Board', label='Lavagna interattiva (LIM)', pick=0)
    xc, w, h, z0 = 2.65, 2.3, 1.3, 0.95
    y = Y1 - 0.02
    MB().box((w, 0.03, h), (xc, y, z0 + h / 2)).obj('BoardPanel', M['boardWhite'], root, smooth=False, bevel=0.004)
    fr = MB()
    for dz in (0, h):
        fr.box((w + 0.04, 0.04, 0.03), (xc, y - 0.005, z0 + dz))
    for dx in (-w / 2, w / 2):
        fr.box((0.03, 0.04, h + 0.03), (xc + dx, y - 0.005, z0 + h / 2))
    fr.box((w * 0.6, 0.08, 0.02), (xc, y - 0.05, z0 - 0.02))
    fr.obj('BoardFrame', M['trim'], root, smooth=False, bevel=0.003)
    # the short-throw projector on its arm above
    pj = MB()
    pj.tube([(xc, Y1, z0 + h + 0.4), (xc, Y1 - 0.5, z0 + h + 0.4)], 0.02, seg=10)
    pj.box((0.3, 0.26, 0.1), (xc, Y1 - 0.6, z0 + h + 0.38))
    pj.obj('Projector', M['white'], root, smooth=False, bevel=0.01)
    # what is written on it, in the site's blue-black ink with a red underline
    ink = MB()
    for text, size, dz in (('Preparazione del solfato di rame', 0.075, 1.1), ('CuO + H_2SO_4 -> CuSO_4 + H_2O', 0.07, 0.86), ('1. occhiali  2. becco Bunsen  3. filtrazione', 0.05, 0.6)):
        v, f = L.formula_data(text, size)
        ink.add(([(xc + p[0], y - 0.017, z0 + dz + p[1]) for p in v], f))
    ink.obj('BoardText', M['boardInk'], root, smooth=False, recalc=False)
    MB().box((1.5, 0.004, 0.006), (xc, y - 0.017, z0 + 1.03)).obj('BoardUnderline', M['boardRed'], root, smooth=False)


def fume_hood():
    """A ducted fume cupboard: cabinets under a work surface, a white box with a glass sash half raised, a lit inside,
    an airflow display and the duct up through the ceiling."""
    x0, y0, W, D = HOOD
    root = empty('FumeHood', label='Cappa aspirante', pick=0)
    xc, yc = x0 + W / 2, y0 + D / 2
    MB().box((W, D, 0.86), (xc, yc, 0.43)).obj('HoodBase', M['cabinet'], root, smooth=False)
    doors = MB()
    for i in range(3):
        doors.box((W / 3 - 0.01, 0.018, 0.72), (x0 + W * (i + 0.5) / 3, y0 - 0.009, 0.46))
    doors.obj('HoodDoors', M['cabinetDoor'], root, smooth=False, bevel=0.003)
    MB().box((W, D, 0.035), (xc, yc, TOP - 0.0175)).obj('HoodTop', M['epoxy'], root, smooth=False, bevel=0.004)
    shell = MB()
    t = 0.05
    shell.box((t, D, 1.5), (x0 + t / 2, yc, TOP + 0.75))
    shell.box((t, D, 1.5), (x0 + W - t / 2, yc, TOP + 0.75))
    shell.box((W, D, 0.35), (xc, yc, TOP + 1.5 - 0.175))
    shell.box((W, 0.04, 1.5), (xc, y0 + D - 0.02, TOP + 0.75))
    shell.obj('HoodShell', M['hoodWhite'], root, smooth=False, bevel=0.01)
    MB().box((W - 2 * t, 0.01, 1.1), (xc, y0 + D - 0.045, TOP + 0.6)).obj('HoodBaffle', M['hoodInside'], root, smooth=False)
    MB().box((W - 0.3, 0.2, 0.01), (xc, yc + 0.05, TOP + 1.14)).obj('HoodLightPanel', M['hoodLight'], root, smooth=False)
    # the sash: glass in a frame, raised to 40 cm, the working height
    sash_z0 = TOP + 0.4
    MB().box((W - 2 * t - 0.02, 0.008, 0.72), (xc, y0 + 0.02, sash_z0 + 0.36)).obj('HoodSash', M['glass'], root, smooth=False)
    sf = MB()
    sf.box((W - 2 * t, 0.03, 0.04), (xc, y0 + 0.02, sash_z0))
    sf.box((W - 2 * t, 0.03, 0.03), (xc, y0 + 0.02, sash_z0 + 0.72))
    sf.obj('HoodSashFrame', M['steel'], root, smooth=False, bevel=0.003)
    MB().box((0.12, 0.012, 0.07), (x0 + W - 0.12, y0 - 0.005, TOP + 1.3)).obj('HoodDisplay', M['display'], root, smooth=False)
    MB().tube([(xc, yc + 0.1, TOP + 1.5), (xc, yc + 0.1, H)], 0.13, seg=20).obj('HoodDuct', M['steelSink'], root)
    # inside: a flask of brown nitrogen dioxide over a hot plate, the kind of reaction only a hood allows
    MB().box((0.2, 0.2, 0.08), (xc - 0.25, yc + 0.05, TOP + 0.04)).obj('HoodHotplate', M['instrument'], root, smooth=False, bevel=0.006)
    MB().lathe([(0, 0), (0.03, 0.004), (0.05, 0.035), (0.05, 0.06), (0.018, 0.1), (0.018, 0.16)], 28).obj('HoodFlask', M['glass'], root, loc=(xc - 0.25, yc + 0.05, TOP + 0.08))
    MB().lathe([(0, 0), (0.028, 0.004), (0.047, 0.035), (0.047, 0.058), (0.017, 0.095), (0, 0.095)], 24).obj('HoodGas', material('NitrogenDioxide', '#a0582a', rough=0.6), root, loc=(xc - 0.25, yc + 0.05, TOP + 0.082))
    OBSTACLES.append(rect3(x0, y0, x0 + W, y0 + D))


def safety_corner():
    """At the teacher's base, by the teaching wall: safety shower and eyewash, fire blanket, two CO2 extinguishers,
    first aid, and the emergency cut-off for gas, water and power."""
    root = empty('SafetyCorner', label='Doccia di emergenza e lavaocchi', pick=0)
    x, y = -1.55, Y1 - 0.25
    pipes = MB()
    pipes.tube([(x, y, 0), (x, y, 2.35), (x + 0.35, y, 2.35)], 0.022, seg=12)
    pipes.tube([(x, y, 1.0), (x + 0.25, y - 0.05, 1.0)], 0.018, seg=10)
    pipes.obj('ShowerPipes', M['safetyGreen'], root)
    MB().lathe([(0, 0), (0.14, 0.02), (0.15, 0.05), (0, 0.05)], 28).obj('ShowerHead', M['safetyGreen'], root, loc=(x + 0.35, y, 2.25), angle=40)
    MB().tube([(x + 0.25, y, 2.3), (x + 0.25, y, 1.7)], 0.004, seg=6).obj('ShowerRod', M['steel'], root)
    MB().box((0.12, 0.012, 0.012), (x + 0.25, y, 1.68)).obj('ShowerHandle', M['safetyGreen'], root, smooth=False)
    MB().lathe([(0, 0), (0.1, 0.02), (0.14, 0.07), (0.15, 0.08), (0, 0.08)], 28).obj('EyewashBowl', M['safetyYellow'], root, loc=(x + 0.3, y - 0.1, 0.96), angle=40)
    MB().box((0.2, 0.012, 0.2), (x + 0.1, Y1 - 0.004, 1.6)).obj('ShowerSign', M['safetyGreen'], root, smooth=False)
    MB().box((0.14, 0.004, 0.14), (x + 0.1, Y1 - 0.011, 1.6)).obj('ShowerSignMark', M['white'], root, smooth=False)
    # fire blanket and extinguishers, first aid, the emergency panel
    MB().box((0.22, 0.08, 0.3), (-0.55, Y1 - 0.04, 1.45)).obj('FireBlanket', M['safetyRed'], root, smooth=False, bevel=0.006)
    ext = MB()
    horns = MB()
    for dx in (-0.2, 0.05):
        ext.lathe([(0, 0), (0.07, 0), (0.07, 0.5), (0.05, 0.56), (0, 0.57)], 20, mat=Matrix.Translation((dx - 0.3, Y1 - 0.12, 0.02)))
        horns.tube([(dx - 0.3, Y1 - 0.12, 0.6), (dx - 0.22, Y1 - 0.2, 0.5), (dx - 0.2, Y1 - 0.22, 0.3)], 0.012, seg=8)
    ext.obj('Extinguishers', M['safetyRed'], root, angle=40)
    horns.obj('ExtinguisherHorns', M['black'], root)
    MB().box((0.3, 0.1, 0.22), (0.3, Y1 - 0.05, 1.5)).obj('FirstAid', M['white'], root, smooth=False, bevel=0.006)
    cross = MB()
    cross.box((0.12, 0.004, 0.035), (0.3, Y1 - 0.102, 1.5))
    cross.box((0.035, 0.004, 0.12), (0.3, Y1 - 0.102, 1.5))
    cross.obj('FirstAidCross', M['safetyGreen'], root, smooth=False)
    MB().box((0.18, 0.06, 0.24), (0.95, Y1 - 0.03, 1.35)).obj('EmergencyPanel', M['safetyYellow'], root, smooth=False, bevel=0.005)
    MB().lathe([(0, 0), (0.03, 0), (0.03, 0.02), (0.0, 0.03)], 20, mat=Matrix.Translation((0.95, Y1 - 0.06, 1.33)) @ Matrix.Rotation(pi / 2, 4, 'X')).obj('EmergencyButton', M['safetyRed'], root, angle=40)
    OBSTACLES.append(rect3(x - 0.2, y - 0.3, x + 0.5, Y1))


# ---------------------------------------------------------------------------------------------
# Storage wall, the instrument bench, the back of the room

def shelf_bottles(parent, name, x, y, z, width, n, seed, along='x'):
    """A row of reagent bottles of a few sizes and colours, along x (the back wall) or y (the storage wall)."""
    r = random.Random(seed)
    groups = {}
    for i in range(n):
        d = -width / 2 + width * (i + 0.5) / n
        cx, cy = (x + d, y) if along == 'x' else (x, y + d)
        k = r.randrange(8)
        mb = groups.setdefault(k, MB())
        R = r.choice((0.028, 0.034, 0.04))
        Hh = R * r.uniform(2.6, 3.2)
        mb.lathe([(0, 0), (R, 0), (R, Hh), (R * 0.45, Hh * 1.12), (R * 0.4, Hh * 1.28), (0, Hh * 1.28)], 14, mat=Matrix.Translation((cx, cy, z)))
    for k, mb in groups.items():
        mb.obj(f'{name}Bottles{k}', M[f'bottle{k}'], parent, angle=50)


def storage_wall():
    """The long wall opposite the windows: tall cupboards with glass doors for the glassware, low cupboards with open
    shelves of reagents above, the two ventilated safety cabinets; the doors break it."""
    root = empty('Storage')
    x_front = X1 - STORE_D
    xc = X1 - STORE_D / 2
    body, doors, glass, handles, shelves, ware, top = MB(), MB(), MB(), MB(), MB(), MB(), MB()
    segments = [('tall', -2.95, -1.95), ('low', -1.95, -0.45), ('tall', -0.45, 0.55), ('low', 0.55, 1.8)]
    for kind, ya, yb in segments:
        yc, w = (ya + yb) / 2, yb - ya
        if kind == 'tall':
            # closed below the doors; above, an open case (back, sides, top) behind the glass, so the glassware shows
            body.box((STORE_D, w, 0.92), (xc, yc, 0.46))
            body.box((0.03, w, 1.18), (X1 - 0.015, yc, 1.51))
            for side in (ya + 0.015, yb - 0.015):
                body.box((STORE_D, 0.03, 1.18), (xc, side, 1.51))
            body.box((STORE_D, w, 0.04), (xc, yc, 2.08))
            doors.box((0.02, w - 0.02, 0.8), (x_front - 0.01, yc, 0.5))
            glass.box((0.01, w - 0.06, 1.0), (x_front - 0.012, yc, 1.48))
            for z in (1.02, 1.36, 1.7):
                shelves.box((STORE_D - 0.06, w - 0.06, 0.015), (xc, yc, z))
                for i in range(int((w - 0.1) / 0.09)):
                    cy = ya + 0.08 + i * 0.09
                    kindw = i % 3
                    prof = [(0, 0), (0.032, 0), (0.032, 0.1), (0, 0.1)] if kindw == 0 else ([(0, 0), (0.04, 0), (0.04, 0.02), (0.014, 0.11), (0.014, 0.15), (0, 0.15)] if kindw == 1 else [(0, 0), (0.024, 0), (0.024, 0.07), (0, 0.07)])
                    ware.lathe(prof, 12, mat=Matrix.Translation((x_front + 0.28, cy, z + 0.008)))
            handles.box((0.02, 0.012, 0.12), (x_front - 0.03, yc - 0.03, 0.8))
            handles.box((0.02, 0.012, 0.12), (x_front - 0.03, yc + 0.03, 0.8))
        else:
            body.box((STORE_D, w, TOP - 0.035), (xc, yc, (TOP - 0.035) / 2))
            top.box((STORE_D + 0.02, w, 0.035), (xc - 0.01, yc, TOP - 0.0175))
            n = max(1, round(w / 0.5))
            for i in range(n):
                dy = ya + w * (i + 0.5) / n
                doors.box((0.02, w / n - 0.01, TOP - 0.18), (x_front - 0.01, dy, 0.1 + (TOP - 0.18) / 2 + 0.02))
                handles.box((0.02, 0.1, 0.012), (x_front - 0.03, dy, TOP - 0.12))
            for z in (1.35, 1.75, 2.15):
                shelves.box((0.3, w, 0.022), (X1 - 0.15, yc, z))
                shelf_bottles(root, f'StoreShelf{int((ya + 3) * 10)}_{int(z * 10)}', X1 - 0.15, yc, z + 0.011, w - 0.06, int(w / 0.1), int(ya * 100 + z * 10), along='y')
            BENCHES.append(rect3(x_front, ya, X1, yb) + [TOP])
        OBSTACLES.append(rect3(x_front, ya, X1, yb))
    body.obj('StorageBody', M['cabinet'], root, smooth=False)
    doors.obj('StorageDoors', M['cabinetDoor'], root, smooth=False, bevel=0.003)
    glass.obj('StorageGlass', M['glass'], root, smooth=False)
    handles.obj('StorageHandles', M['steel'], root, smooth=False)
    shelves.obj('StorageShelves', M['wood'], root, smooth=False, bevel=0.002)
    ware.obj('StorageGlassware', M['shelfGlass'], root, angle=50)
    top.obj('StorageTop', M['epoxy'], root, smooth=False, bevel=0.004)
    # the ventilated safety cabinets, between the second door and the fume cupboard
    safe = empty('SafetyCabinets', label='Armadi di sicurezza: infiammabili e corrosivi', pick=0)
    for ya, yb, mat, label in ((3.15, 3.8, 'cabYellow', 'Infiammabili'), (3.8, 4.45, 'cabBlue', 'Acidi e basi')):
        yc = (ya + yb) / 2
        MB().box((STORE_D, yb - ya - 0.02, 1.95), (xc, yc, 0.975)).obj(f'Safe{label[:4]}', M[mat], safe, smooth=False, bevel=0.01)
        MB().box((0.012, 0.18, 0.18), (x_front - 0.006, yc, 1.55)).obj(f'Safe{label[:4]}Sign', M['white'], safe, smooth=False)
        MB().box((0.012, 0.12, 0.12), mat=Matrix.Translation((x_front - 0.013, yc, 1.55)) @ Matrix.Rotation(pi / 4, 4, 'X')).obj(f'Safe{label[:4]}Mark', M['safetyRed'] if mat == 'cabYellow' else M['black'], safe, smooth=False)
        MB().tube([(xc, yc, 1.95), (xc, yc, H)], 0.05, seg=12).obj(f'Safe{label[:4]}Vent', M['steelSink'], safe)
        OBSTACLES.append(rect3(x_front, ya, X1, yb))


def instrument_bench():
    """Against the back wall: the instruments a school rarely has, each labelled, with shelves above and a sink."""
    x0, y0, L_, D = BACK_BENCH
    root = empty('InstrumentBench')
    xc, yc = x0 + L_ / 2, y0 + D / 2
    y_front = y0 + D
    MB().box((L_, D, 0.035), (xc, yc, TOP - 0.0175)).obj('BackTop', M['epoxy'], root, smooth=False, bevel=0.004)
    MB().box((L_ - 0.04, D - 0.04, TOP - 0.135), (xc, yc - 0.02, 0.1 + (TOP - 0.135) / 2)).obj('BackCarcass', M['cabinet'], root, smooth=False)
    MB().box((L_ - 0.1, D - 0.1, 0.1), (xc, yc - 0.04, 0.05)).obj('BackPlinth', M['plinth'], root, smooth=False)
    dr = MB()
    n = 11
    for i in range(n):
        dr.box((L_ / n - 0.01, 0.018, TOP - 0.18), (x0 + L_ * (i + 0.5) / n, y_front + 0.009, 0.1 + (TOP - 0.18) / 2 + 0.02))
    dr.obj('BackDoors', M['cabinetDoor'], root, smooth=False, bevel=0.003)
    sh = MB()
    for z in (1.55, 1.95):
        sh.box((L_, 0.28, 0.022), (xc, Y0 + 0.14, z))
    sh.obj('BackShelves', M['wood'], root, smooth=False, bevel=0.002)
    for z in (1.55, 1.95):
        shelf_bottles(root, f'BackShelf{int(z * 10)}', xc, Y0 + 0.14, z + 0.011, L_ - 0.2, int(L_ / 0.11), int(z * 100))
    BENCHES.append(rect3(x0, y0, x0 + L_, y_front) + [TOP])
    OBSTACLES.append(rect3(x0, y0, x0 + L_, y_front))
    t = TOP
    # analytical balance with its glass draught shield
    bal = empty('Balance', loc=(x0 + 0.45, yc + 0.05, t), label='Bilancia analitica (0,1 mg)', pick=0)
    MB().box((0.22, 0.34, 0.08), (0, 0, 0.04)).obj('BalanceBody', M['instrument'], bal, smooth=False, bevel=0.01)
    MB().box((0.16, 0.05, 0.03), mat=Matrix.Translation((0, 0.19, 0.03)) @ Matrix.Rotation(radians(-20), 4, 'X')).obj('BalanceDisplay', M['screen'], bal, smooth=False)
    MB().lathe([(0, 0), (0.045, 0), (0.045, 0.004), (0, 0.004)], 20).obj('BalancePan', M['steel'], bal, loc=(0, -0.03, 0.09))
    MB().box((0.2, 0.22, 0.22), (0, -0.03, 0.19)).obj('BalanceShield', M['glass'], bal, smooth=False)
    # UV-Vis spectrophotometer
    sp = empty('Spectro', loc=(x0 + 1.2, yc, t), label='Spettrofotometro UV-Vis', pick=0)
    MB().box((0.42, 0.36, 0.16), (0, 0, 0.08)).obj('SpectroBody', M['instrument'], sp, smooth=False, bevel=0.015)
    MB().add(L.box_data((0.18, 0.012, 0.1)), Matrix.Translation((0.08, 0.18, 0.12)) @ Matrix.Rotation(radians(-35), 4, 'X')).obj('SpectroScreen', M['screen'], sp, smooth=False)
    MB().box((0.12, 0.12, 0.012), (-0.1, -0.02, 0.166)).obj('SpectroLid', M['instrumentDark'], sp, smooth=False, bevel=0.004)
    # pH meter with its electrode on an arm, dipped in a beaker
    ph = empty('PHMeter', loc=(x0 + 1.9, yc + 0.05, t), label='pHmetro con elettrodo', pick=0)
    MB().box((0.16, 0.2, 0.06), mat=Matrix.Translation((0, 0, 0.03)) @ Matrix.Rotation(radians(-10), 4, 'X')).obj('PHBody', M['instrument'], ph, smooth=False, bevel=0.008)
    MB().box((0.1, 0.06, 0.005), (0, 0.02, 0.066)).obj('PHDisplay', M['display'], ph, smooth=False)
    arm = MB()
    arm.tube([(0.16, 0.04, 0), (0.16, 0.04, 0.3), (0.16, -0.06, 0.3)], 0.005, seg=8)
    arm.tube([(0.16, -0.06, 0.3), (0.16, -0.06, 0.07)], 0.006, seg=8)
    arm.obj('PHArm', M['steel'], ph)
    decor_beaker('PHBeaker', (x0 + 2.06, yc - 0.01, t))
    # centrifuge
    ce = empty('Centrifuge', loc=(x0 + 2.55, yc, t), label='Centrifuga', pick=0)
    MB().lathe([(0, 0), (0.16, 0), (0.17, 0.02), (0.17, 0.2), (0.15, 0.22), (0, 0.22)], 32).obj('CentrifugeBody', M['instrument'], ce, angle=40)
    MB().lathe([(0, 0.22), (0.14, 0.22), (0.12, 0.25), (0, 0.255)], 32).obj('CentrifugeLid', M['cabBlue'], ce, angle=40)
    # magnetic stirrer hot plate, a beaker with a stirring bar
    hs = empty('HotplateStirrer', loc=(x0 + 3.1, yc, t), label='Piastra riscaldante con agitatore magnetico', pick=0)
    MB().box((0.2, 0.3, 0.1), (0, 0, 0.05)).obj('StirrerBody', M['instrument'], hs, smooth=False, bevel=0.01)
    MB().box((0.18, 0.18, 0.008), (0, -0.04, 0.104)).obj('StirrerPlate', M['white'], hs, smooth=False, bevel=0.003)
    for dx in (-0.05, 0.05):
        MB().lathe([(0, 0), (0.015, 0), (0.015, 0.012), (0, 0.012)], 12, mat=Matrix.Translation((dx, 0.13, 0.04)) @ Matrix.Rotation(pi / 2, 4, 'X')).obj(f'StirrerKnob{int(dx * 100)}', M['instrumentDark'], hs, angle=40)
    decor_beaker('StirrerBeaker', (x0 + 3.1, yc - 0.04, t + 0.108))
    # distillation: heating mantle, round-bottom flask, condenser, receiving flask, on a stand
    ds = empty('Distillation', loc=(x0 + 3.8, yc, t), label='Apparecchio di distillazione', pick=0)
    MB().lathe([(0, 0), (0.08, 0), (0.09, 0.04), (0.085, 0.09), (0.05, 0.1), (0, 0.1)], 24).obj('Mantle', M['mantle'], ds, angle=40)
    glassm = MB()
    glassm.lathe([(0, 0), (0.035, 0.01), (0.06, 0.06), (0.055, 0.1), (0.02, 0.13), (0.013, 0.14), (0.013, 0.24)], 24, mat=Matrix.Translation((0, 0, 0.07)))
    a, b = Vector((0.0, 0, 0.28)), Vector((0.5, 0, 0.12))
    glassm.tube([tuple(a), tuple(a.lerp(b, 0.15)), tuple(b)], 0.012, seg=12)
    glassm.tube([tuple(a.lerp(b, 0.25)), tuple(a.lerp(b, 0.85))], 0.024, seg=14)
    glassm.lathe([(0, 0), (0.04, 0), (0.045, 0.04), (0.015, 0.1), (0.015, 0.13)], 20, mat=Matrix.Translation((0.52, 0, 0.0)))
    glassm.obj('DistillationGlass', M['glass'], ds, angle=45)
    st = MB()
    st.box((0.2, 0.26, 0.012), (0.12, 0.08, 0.006))
    st.tube([(0.12, 0.16, 0), (0.12, 0.16, 0.55)], 0.006, seg=8)
    st.tube([(0.12, 0.16, 0.25), (0.12, 0.0, 0.25)], 0.004, seg=8)
    st.obj('DistillationStand', M['iron'], ds)
    # drying oven
    ov = empty('Oven', loc=(x0 + 4.75, yc - 0.02, t), label='Stufa termostatica', pick=0)
    MB().box((0.55, 0.5, 0.55), (0, 0, 0.275)).obj('OvenBody', M['instrument'], ov, smooth=False, bevel=0.012)
    MB().box((0.3, 0.01, 0.3), (-0.05, 0.252, 0.3)).obj('OvenWindow', M['screen'], ov, smooth=False)
    MB().box((0.08, 0.01, 0.06), (0.19, 0.252, 0.44)).obj('OvenDisplay', M['display'], ov, smooth=False)
    # the sink at the end, and the deioniser on the wall above it
    sx = x0 + L_ - 0.35
    MB().box((0.42, 0.36, 0.012), (sx, yc, t + 0.006)).obj('BackSinkRim', M['steelSink'], root, smooth=False, bevel=0.003)
    MB().box((0.38, 0.32, 0.002), (sx, yc, t + 0.0125)).obj('BackSinkBowl', M['sinkDark'], root, smooth=False)
    MB().tube([(sx, Y0 + 0.04, t), (sx, Y0 + 0.04, t + 0.35), (sx, Y0 + 0.14, t + 0.38), (sx, Y0 + 0.24, t + 0.3)], 0.01, seg=10).obj('BackFaucet', M['chrome'], root)
    de = empty('Deioniser', loc=(sx + 0.05, Y0 + 0.06, 1.3), label='Deionizzatore', pick=0)
    MB().box((0.3, 0.1, 0.4), (0, 0.05, 0)).obj('DeioniserBody', M['white'], de, smooth=False, bevel=0.01)
    MB().box((0.08, 0.01, 0.05), (0.06, 0.102, 0.1)).obj('DeioniserDisplay', M['display'], de, smooth=False)


def back_corner():
    """By the main door: the UV goggle cabinet, coat hooks with jackets and bags, the broken-glass box, the waste."""
    root = empty('BackCorner')
    gx = 6.1
    gc = empty('GoggleCabinet', label='Armadietto degli occhiali (lampada UV)', pick=0)
    MB().box((0.5, 0.2, 0.6), (gx, Y0 + 0.1, 1.5)).obj('GoggleCabinetBody', M['white'], gc, smooth=False, bevel=0.008)
    MB().box((0.44, 0.01, 0.54), (gx, Y0 + 0.205, 1.5)).obj('GoggleCabinetGlow', M['uvGlow'], gc, smooth=False)
    MB().tube([(4.9 - 0.6, Y0 + 0.05, 1.65), (5.65, Y0 + 0.05, 1.65)], 0.012, seg=8).obj('CoatRail', M['steel'], root)
    for i, (dx, mat) in enumerate(((4.45, 'coat1'), (4.85, 'coat2'), (5.3, 'coat3'))):
        MB().lathe([(0, -0.75), (0.2, -0.75), (0.22, -0.3), (0.14, -0.05), (0.03, 0)], 16, mat=Matrix.Translation((dx, Y0 + 0.12, 1.65)) @ Matrix.Diagonal((1, 0.45, 1, 1))).obj(f'Coat{i}', M[mat], root, angle=50)
    bags = MB()
    for dx in (4.6, 5.1, 5.5):
        bags.box((0.3, 0.18, 0.38), (dx, Y0 + 0.2, 0.19))
    bags.obj('Bags', M['bag'], root, smooth=False, bevel=0.03)
    MB().box((0.35, 0.35, 0.55), (6.85, Y0 + 0.2, 0.275)).obj('BrokenGlassBox', M['cardboard'], root, smooth=False, bevel=0.005)
    MB().box((0.25, 0.18, 0.32), (6.45, Y0 + 0.12, 0.16)).obj('JerrycanBlue', M['jerryBlue'], root, smooth=False, bevel=0.025)
    MB().box((0.25, 0.18, 0.32), (6.15, Y0 + 0.12, 0.16)).obj('JerrycanWhite', M['jerryWhite'], root, smooth=False, bevel=0.025)
    OBSTACLES.append(rect3(4.25, Y0, 5.7, Y0 + 0.32))
    OBSTACLES.append(rect3(5.95, Y0, X1, Y0 + 0.4))


# ---------------------------------------------------------------------------------------------

def stations():
    """A place for every person: students behind the desks, facing the board; the teacher behind the bench."""
    n = 0
    for r, y0 in ROWS.items():
        for c, x0 in COLUMNS.items():
            for half in (0, 1):
                hx = x0 + DESK_L / 4 + half * DESK_L / 2
                player = (r, c, half) == PLAYER
                empty(f'Station{n}', loc=(hx, y0 - STAND, 0), role='student', player=int(player), row=r, column=c, half=half)
                if not player:
                    classmate_kit(n, hx, y0, TOP)
                B.stool(f'Stool{n}', (hx + (0.35 if half == 0 else -0.35), y0 - 0.55, 0))
                n += 1
    x0, y0, L_, D = TEACHER_BENCH
    empty('StationTeacher', loc=(x0 + L_ / 2 + 0.2, y0 + D + 0.4, 0), rot=(0, 0, pi), role='teacher', player=0)


def build():
    palette()
    B.textures()
    B.room()
    B.city()
    for r, y0 in ROWS.items():
        for c, x0 in COLUMNS.items():
            player_half = PLAYER[2] if (r, c) == PLAYER[:2] else None
            desk(f'Desk{r}{c}', x0, y0, player_half)
    before = set(bpy.data.objects)
    player_kit(TOP)
    L.wash_bottle((0.6, 0.3, TOP))
    KIT_ROOTS.update(o.name for o in set(bpy.data.objects) - before if o.parent is None)
    stations()
    rename_heat_mats()
    teacher_bench()
    board()
    fume_hood()
    safety_corner()
    storage_wall()
    instrument_bench()
    back_corner()
    L.periodic_table((0.1, Y1 - 0.003, 1.9))
    L.clock((5.0, Y1 - 0.001, 2.55))
    L.safety_sign((4.55, Y1 - 0.003, 1.75))
    B.plant('PlantCornerFront', (-1.95, 4.95, 0.0), s=1.6, pot_r=0.14)
    B.plant('PlantCornerBack', (-1.95, -4.3, 0.0), s=1.4, pot_r=0.13)
    for i, (ya, yb) in enumerate(WINDOWS[1:3]):
        B.plant(f'PlantSill{i}', (X0 + 0.0, (ya + yb) / 2 + 0.4, B.WIN_Z[0]), s=0.6, pot_r=0.06)


build()

# what the page needs of the plan (three.js axes)
roots = [o for o in bpy.data.objects if o.parent is None]


def is_movable(o):
    return any('pick' in c.keys() and c['pick'] for c in [o, *o.children_recursive])


lm_roots = [o.name for o in roots if o.type == 'EMPTY' and o.name != 'Town' and not o.name.startswith('Station') and o.name not in KIT_ROOTS]
extras = {
    'room': json.dumps([X0, X1, -Y1, -Y0, H]),
    'walk': json.dumps([X0 + 0.45, X1 - 0.35, -Y1 + 0.35, -Y0 - 0.35]),
    'obstacles': json.dumps(OBSTACLES),
    'benches': json.dumps(BENCHES),
    'spawn': json.dumps([0.0, 1.2, 0.0]),
}
print('ROOTS', len(roots), 'LIGHTMAPPED ROOTS', len(lm_roots), 'OBSTACLES', len(OBSTACLES))
# AULA_NOBAKE=1: no light baked, straight to the export; the page lights it with the live sun and a sky light only
# (a draft to walk round while the bake runs)
if os.environ.get('AULA_NOBAKE'):
    for ob in scene.objects:
        if ob.type == 'MESH' and ob.data.name != ob.name:
            ob.data.name = ob.name
    lt = empty('Lighting')
    d3 = (B.SUN_DIR.x, B.SUN_DIR.z, -B.SUN_DIR.y)
    lt['sun_dir'] = json.dumps([round(v, 5) for v in d3])
    lt['sun_color'] = B.SUN_COLOR
    lt['sun_strength'] = B.SUN_STRENGTH
    lt['sky_color'] = B.SKY_COLOR
    lt['sky_strength'] = B.SKY_STRENGTH
    for k, v in extras.items():
        lt[k] = v
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_extras=True, export_apply=True, export_yup=True,
                              export_animations=False, export_cameras=False, export_lights=False)
    print('EXPORTED', OUT, os.path.getsize(OUT))
    raise SystemExit(0)
# AULA_BLEND=<file.blend>: stop before the light, and save the room to look at it in Blender
if os.environ.get('AULA_BLEND'):
    bpy.ops.wm.save_as_mainfile(filepath=os.environ['AULA_BLEND'])
    print('SAVED', os.environ['AULA_BLEND'])
    raise SystemExit(0)
B.finish(lm_roots=lm_roots, extras=extras,
         shots=(('aula-player', (0.0, -1.2, 1.62), (0.0, 1.0, 1.1), 22), ('aula-back', (6.9, -4.3, 1.7), (0.5, 3.5, 1.1), 18),
                ('aula-front', (2.65, 4.9, 1.8), (2.65, -3.0, 0.9), 18)))
