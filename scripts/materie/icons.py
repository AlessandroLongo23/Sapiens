# Renders one object per subject for the subject cards of Sapiens: a still, and the
# frames of a loop that starts and ends on the still.
# Run: Blender -b --factory-startup -P icons.py -- <out dir> <still|frames|both|glb> [id ...]
# Then: python3 scripts/materie/export.py <out dir>
import bpy, bmesh, math, sys, os, traceback
from mathutils import Vector, Matrix

ARGS = sys.argv[sys.argv.index('--') + 1:]
OUT, MODE, ONLY = ARGS[0], ARGS[1], ARGS[2:]
SIZE, FRAME_SIZE, FRAMES = 720, 480, 75  # the loop: 75 frames at 30 a second, unless an object sets its own length

PAPER, YELLOW, INK, GREY = '#ECE4D2', '#FFCB2E', '#27304D', '#C3CAD8'
TONES = {
	'math': ('#C22445', '#F2B4BF', '#7C1029'),
	'physics': ('#2B66C2', '#AFC9F3', '#173F7C'),
	'chemistry': ('#1E9363', '#A9E0C6', '#0E5A3A'),
	'cs': ('#E07A1F', '#F8CDA0', '#93480A'),
	'ink': ('#2F3A5F', '#97A3C4', '#161C30'),
}


def lin(h):
	f = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
	return tuple(f(int(h[i:i + 2], 16) / 255) for i in (1, 3, 5)) + (1,)


def mat(h, rough=0.42, metal=0.0, coat=0.3):
	m = bpy.data.materials.new(h)
	m.use_nodes = True
	b = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
	b.inputs['Base Color'].default_value = lin(h)
	b.inputs['Roughness'].default_value = rough
	b.inputs['Metallic'].default_value = metal
	for name, v in (('Coat Weight', coat), ('Coat Roughness', 0.25)):
		if name in b.inputs:
			b.inputs[name].default_value = v
	return m


def active(o):
	bpy.ops.object.select_all(action='DESELECT')
	o.select_set(True)
	bpy.context.view_layer.objects.active = o


def fin(o, m, bevel=0.05, smooth=True):
	active(o)
	bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
	if bevel:
		b = o.modifiers.new('bevel', 'BEVEL')
		b.width, b.segments, b.limit_method = bevel, 5, 'ANGLE'
	if smooth:
		try:
			bpy.ops.object.shade_auto_smooth(angle=math.radians(40))
		except Exception:
			bpy.ops.object.shade_smooth()
	o.data.materials.append(m)
	return o


def box(size, loc, m, rot=(0, 0, 0), bevel=0.06):
	bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
	o = bpy.context.object
	o.scale = size
	return fin(o, m, bevel)


def sph(r, loc, m):
	bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=64, ring_count=32)
	return fin(bpy.context.object, m, 0)


def cyl(r, h, loc, m, rot=(0, 0, 0), bevel=0.03, verts=96):
	bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, location=loc, rotation=rot, vertices=verts)
	return fin(bpy.context.object, m, bevel)


def cone(r, h, loc, m, rot=(0, 0, 0), r2=0.0, bevel=0.03):
	bpy.ops.mesh.primitive_cone_add(radius1=r, radius2=r2, depth=h, location=loc, rotation=rot, vertices=96)
	return fin(bpy.context.object, m, bevel)


def torus(R, r, loc, m, rot=(0, 0, 0)):
	bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, location=loc, rotation=rot, major_segments=96, minor_segments=24)
	return fin(bpy.context.object, m, 0)


def tube(points, r, m, cyclic=False):
	c = bpy.data.curves.new('tube', 'CURVE')
	c.dimensions = '3D'
	s = c.splines.new('POLY')
	s.points.add(len(points) - 1)
	for p, co in zip(s.points, points):
		p.co = (*co, 1)
	s.use_cyclic_u = cyclic
	c.bevel_depth, c.bevel_resolution, c.use_fill_caps = r, 8, True
	o = bpy.data.objects.new('tube', c)
	bpy.context.collection.objects.link(o)
	c.materials.append(m)
	return o


def rod(a, b, r, m):
	return tube([a, b], r, m)


def poly(points, depth, m, bevel=0.04):
	"""A flat polygon in the XZ plane, facing -Y, `depth` thick."""
	me = bpy.data.meshes.new('poly')
	bm = bmesh.new()
	bm.faces.new([bm.verts.new((x, 0, z)) for x, z in points])
	bm.to_mesh(me)
	bm.free()
	o = bpy.data.objects.new('poly', me)
	bpy.context.collection.objects.link(o)
	s = o.modifiers.new('solid', 'SOLIDIFY')
	s.thickness, s.offset = depth, 0
	return fin(o, m, bevel)


FONTS = {}


def text(body, size, depth, m, loc=(0, 0, 0), rot=(math.pi / 2, 0, 0), font='/System/Library/Fonts/Supplemental/Georgia Bold.ttf', bevel=0.012):
	c = bpy.data.curves.new('text', 'FONT')
	c.body, c.size, c.extrude, c.bevel_depth, c.bevel_resolution = body, size, depth, bevel, 4
	c.align_x, c.align_y = 'CENTER', 'CENTER'
	if os.path.exists(font):
		FONTS[font] = FONTS.get(font) or bpy.data.fonts.load(font)
		c.font = FONTS[font]
	o = bpy.data.objects.new('text', c)
	o.location, o.rotation_euler = loc, rot
	bpy.context.collection.objects.link(o)
	c.materials.append(m)
	return o


def group(objs, rot=(0, 0, 0), loc=(0, 0, 0)):
	e = bpy.data.objects.new('group', None)
	bpy.context.collection.objects.link(e)
	for o in objs:
		o.parent = e
	e.rotation_euler, e.location = rot, loc
	return e


# ---- motion ----
# Every loop is a function of u, from 0 to 1, and u = 0 is the still.

def seg(u, a, b):
	"""Where u is between a and b, from 0 to 1."""
	return max(0.0, min(1.0, (u - a) / (b - a)))


def ease(t):
	return t * t * (3 - 2 * t)


def spring(t, damp=5.5, freq=11.0):
	"""From 0 to 1, overshooting and settling."""
	if t <= 0:
		return 0.0
	if t >= 1:
		return 1.0
	return 1 - math.exp(-damp * t) * math.cos(freq * t)


def pop(t):
	"""A bump that starts and ends at 0, ringing as it dies."""
	return 0.0 if t <= 0 or t >= 1 else math.exp(-5 * t) * math.sin(13 * t) * (1 - t) * 1.6


def pivot(objs, at):
	"""An empty at `at` holding the objects where they are: move, turn and scale them about that point."""
	e = bpy.data.objects.new('pivot', None)
	bpy.context.collection.objects.link(e)
	e.location = at
	for o in objs:
		o.parent = e
		o.matrix_parent_inverse = Matrix.Translation(at).inverted()
	return e


def jump(e, at, t, h, spin=0.0):
	"""A hop of the pivot `e` resting at `at`: it crouches, leaves the ground, lands and wobbles."""
	z, sz = 0.0, 1.0
	if 0 < t < 0.18:
		sz = 1 - 0.2 * math.sin(math.pi * t / 0.18)
	elif 0.18 <= t < 0.7:
		a = (t - 0.18) / 0.52
		z, sz = h * 4 * a * (1 - a), 1 + 0.1 * math.sin(math.pi * a)
	elif 0.7 <= t < 1:
		a = (t - 0.7) / 0.3
		sz = 1 - 0.22 * math.exp(-4.5 * a) * math.cos(13 * a) * (1 - a)
	sx = 1 / math.sqrt(sz)
	e.location, e.scale = (at[0], at[1], at[2] + z), (sx, sx, sz)
	e.rotation_euler.z = spin * ease(seg(t, 0.18, 0.7))


# ---- the objects ----
# Each builds its object and returns its loop.

def solids(t):
	main, light, dark = t
	spots = [(-0.55, 0.25, 0), (0.5, -0.55, 0), (0.75, 0.6, 0)]
	cube = pivot([box((1.05, 1.05, 1.05), (-0.55, 0.25, 0.525), mat(main), rot=(0, 0, 0.35), bevel=0.09)], spots[0])
	ball = pivot([sph(0.46, (0.5, -0.55, 0.46), mat(PAPER, 0.3))], spots[1])
	cn = pivot([cone(0.5, 1.15, (0.75, 0.6, 0.575), mat(YELLOW), bevel=0.04)], spots[2])

	def anim(u):
		jump(cube, spots[0], seg(u, 0.02, 0.5), 0.45, math.pi / 2)
		jump(ball, spots[1], seg(u, 0.25, 0.72), 0.7)
		jump(cn, spots[2], seg(u, 0.5, 0.97), 0.35)
	return anim


MODULE = 0.135  # the size of a tooth, the same on every wheel: that is what lets two wheels mesh


def gear_mesh(teeth, depth, m, turn=0.0):
	"""A spur gear with involute teeth (pressure angle 20 degrees), in the XZ plane, a tooth centred at the angle `turn`."""
	rp = MODULE * teeth / 2  # pitch radius: two wheels touch on their pitch circles
	# stub teeth, shorter than the standard ones: with so few of them the full height ends in a point
	rb, ro, rr = rp * math.cos(math.radians(20)), rp + 0.8 * MODULE, rp - 1.0 * MODULE
	inv = lambda a: math.tan(a) - a
	half = math.pi / (2 * teeth) * 0.94  # a little thinner than half the pitch, so the teeth never bind

	def flank(r):
		"""How far a tooth's side is from its centre line, as an angle, at the radius r."""
		return half + inv(math.radians(20)) - (inv(math.acos(rb / r)) if r > rb else 0)

	radii = [rr] + [rb + (ro - rb) * i / 7 for i in range(8)] if rr < rb else [rr + (ro - rr) * i / 8 for i in range(9)]
	pts = []
	for k in range(teeth):
		c = turn + 2 * math.pi * k / teeth
		for r in radii:
			pts.append((r * math.cos(c - flank(r)), r * math.sin(c - flank(r))))
		for r in reversed(radii):
			pts.append((r * math.cos(c + flank(r)), r * math.sin(c + flank(r))))
	return poly(pts, depth, m, bevel=0.012)


def gears(t):
	main, light, dark = t
	na, nb = 12, 8
	# the small wheel sits where a tooth of the large one points, with a gap facing it
	towards = 2 * math.pi * 2 / na
	d = MODULE * (na + nb) / 2
	a = gear_mesh(na, 0.34, mat(main))
	ha = cyl(0.3, 0.42, (0, 0, 0), mat(PAPER, 0.35), rot=(math.pi / 2, 0, 0))
	b = gear_mesh(nb, 0.34, mat(INK), turn=towards + math.pi - math.pi / nb)
	hb = cyl(0.2, 0.42, (0, 0, 0), mat(YELLOW), rot=(math.pi / 2, 0, 0))
	for o in (b, hb):
		o.location = (d * math.cos(towards), 0, d * math.sin(towards))
	group([a, ha, b, hb], rot=(0, 0, 0.64), loc=(-0.3, 0, 0.95))

	def anim(u):
		# two teeth a loop, one click at a time: both wheels end where they began
		teeth = spring(seg(u, 0.03, 0.5)) + spring(seg(u, 0.52, 0.99))
		a.rotation_euler.y = -teeth * 2 * math.pi / na
		b.rotation_euler.y = teeth * 2 * math.pi / nb
	return anim


def dna(t):
	main, light, dark = t
	objs, n, turns, h, r = [], 9, 1.0, 2.7, 0.58
	ma, mb, mr = mat(main), mat(YELLOW), mat(PAPER, 0.35)
	pa = lambda u: (r * math.cos(2 * math.pi * turns * u), r * math.sin(2 * math.pi * turns * u), h * u)
	pb = lambda u: (-r * math.cos(2 * math.pi * turns * u), -r * math.sin(2 * math.pi * turns * u), h * u)
	objs += [tube([pa(i / 80) for i in range(81)], 0.1, ma), tube([pb(i / 80) for i in range(81)], 0.1, mb)]
	objs += [sph(0.1, pa(0), ma), sph(0.1, pa(1), ma), sph(0.1, pb(0), mb), sph(0.1, pb(1), mb)]
	for i in range(n):
		u = (i + 0.5) / n
		objs.append(rod(pa(u), pb(u), 0.055, mr))
	spin = group(objs)
	tilt = group([spin], rot=(0, 0.22, 0.9), loc=(0, 0, 0.1))

	def anim(u):
		spin.rotation_euler.z = 2 * math.pi * u
		tilt.location.z = 0.1 + 0.06 * math.sin(2 * math.pi * u)
	return anim


def compass(t):
	main, light, dark = t
	top = 0.16  # the sheet's surface
	box((2.0, 2.0, 0.16), (0, 0, 0.08), mat(PAPER, 0.5), bevel=0.07)
	mg = mat('#A9BFE3', 0.6, coat=0)
	for k in range(-3, 4):
		v = k * 0.25
		rod((v, -0.86, top + 0.004), (v, 0.86, top + 0.004), 0.011, mg)
		rod((-0.86, v, top + 0.004), (0.86, v, top + 0.004), 0.011, mg)
	# the circle the pencil leaves, from where the pencil stands
	R = 0.68
	circle = tube([(R * math.cos(2 * math.pi * i / 96), R * math.sin(2 * math.pi * i / 96), top + 0.04) for i in range(97)], 0.055, mat(main))
	# the compass, standing on its needle at the centre, in the XZ plane
	metal = mat(GREY, 0.22, metal=1.0, coat=0)
	hinge = (R / 2, 0, top + 1.5)
	parts = [
		rod(hinge, (0.04, 0, top + 0.34), 0.1, metal),
		cone(0.05, 0.36, (0.02, 0, top + 0.18), metal, rot=(0, math.pi, 0), bevel=0),
		rod(hinge, (R - 0.05, 0, top + 0.52), 0.1, metal),
		rod((R - 0.05, 0, top + 0.54), (R - 0.01, 0, top + 0.2), 0.115, mat(YELLOW)),
		cone(0.11, 0.2, (R, 0, top + 0.1), mat(INK), rot=(0, math.pi, 0), bevel=0),
		cyl(0.26, 0.34, hinge, mat(main), rot=(math.pi / 2, 0, 0), bevel=0.06),
		cyl(0.09, 0.4, (hinge[0], 0, hinge[2] + 0.4), mat(INK), bevel=0.03),
		sph(0.13, (hinge[0], 0, hinge[2] + 0.62), mat(INK)),
	]
	turn = pivot(parts, (0, 0, top))
	turn.name = 'part-compass'
	circle.name = 'part-circle'

	def anim(u):
		# the circle is rubbed out, without hurry, then the compass goes once round and draws it again
		a = ease(seg(u, 0.3, 0.95))
		turn.rotation_euler.z = 2 * math.pi * a
		circle.data.bevel_factor_end = max(1 - ease(seg(u, 0.02, 0.26)), a) if u > 0 else 1
		# it leans the way it is going, as a hand does, about the line through its two points, and straightens up at the end
		turn.rotation_euler.x = -0.26 * math.sin(math.pi * a) ** 0.8
	return anim


def cradle(t):
	main, light, dark = t
	mf, ms, mb = mat(main), mat(INK, 0.6, coat=0), mat(PAPER, 0.12, coat=0.6)
	box((2.9, 1.5, 0.16), (0, 0, 0.08), mat(dark), bevel=0.06)
	for y in (-0.55, 0.55):
		pts = [(-1.2, y, 0.1), (-1.2, y, 1.55)] + [(-1.2 + 0.2 * (1 - math.cos(a)), y, 1.55 + 0.2 * math.sin(a)) for a in [math.pi / 2 * i / 10 for i in range(11)]]
		pts += [(1.0 + 0.2 * math.sin(a), y, 1.55 + 0.2 * math.cos(a)) for a in [math.pi / 2 * i / 10 for i in range(11)]] + [(1.2, y, 0.1)]
		tube(pts, 0.055, mf)
	L, top, swings = 1.2, 1.75, []
	for i in range(5):
		x = -0.84 + 0.42 * i
		p = (x, 0, top - L)
		parts = [sph(0.21, p, mb)] + [rod((x, y, top), p, 0.011, ms) for y in (-0.55, 0.55)]
		swings.append(pivot(parts, (x, 0, top)))
		swings[-1].name = 'part-swing-%d' % i

	def anim(u):
		c = math.cos(2 * math.pi * u)
		swings[0].rotation_euler.y = 0.72 * max(c, 0)
		swings[4].rotation_euler.y = -0.72 * max(-c, 0)
		# the three in the middle only shiver when they are hit
		hit = math.exp(-((abs(c)) / 0.12) ** 2)
		for k in (1, 2, 3):
			swings[k].rotation_euler.y = 0.012 * hit * (1 if u < 0.5 else -1)
	return anim


def keycap(m, mg, glyph, loc, rot):
	bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.3))
	o = bpy.context.object
	o.scale = (1.0, 1.0, 0.6)
	active(o)
	bpy.ops.object.transform_apply(scale=True)
	for v in o.data.vertices:
		if v.co.z > 0.3:
			v.co.x *= 0.8
			v.co.y *= 0.8
	fin(o, m, 0.1)
	# the sign on the key, in the key's own axes: x runs along the row
	sign = {'<': [(0.17, -0.2), (-0.17, 0), (0.17, 0.2)], '>': [(-0.17, -0.2), (0.17, 0), (-0.17, 0.2)], '/': [(-0.12, -0.22), (0.12, 0.22)]}[glyph]
	g = tube([(x, y, 0.615) for x, y in sign], 0.05, mg)
	return group([o, g], rot=rot, loc=loc)


def keys(t):
	main, light, dark = t
	ks = [
		keycap(mat(main), mat(PAPER), '<', (-0.6, -0.35, 0), (0, 0, 0.08)),
		keycap(mat(PAPER, 0.35), mat(INK), '/', (0.0, 0.78, 0), (0, 0, 0.03)),
		keycap(mat(INK), mat(YELLOW), '>', (0.6, -0.35, 0), (0, 0, -0.06)),
	]
	for i, k in enumerate(ks):
		k.name = 'part-key-%d' % i
	group(ks, rot=(0, 0, 0.64))

	def anim(u):
		# typed one after the other: down fast, back up on a spring
		for i, k in enumerate(ks):
			a = seg(u, 0.06 + 0.24 * i, 0.5 + 0.24 * i)
			down = ease(seg(a, 0, 0.16)) * (1 - spring(seg(a, 0.16, 1), 5.0, 14.0))
			k.location.z = -0.2 * down
			k.scale = (1 + 0.04 * down, 1 + 0.04 * down, 1 - 0.1 * down)
	return anim


def benzene(t):
	main, light, dark = t
	objs, mc, mh, mbond = [], mat(main), mat(PAPER, 0.3), mat(GREY, 0.35)
	C = [(0.85 * math.cos(math.pi / 2 + i * math.pi / 3), 0, 0.85 * math.sin(math.pi / 2 + i * math.pi / 3)) for i in range(6)]
	H = [(1.55 * math.cos(math.pi / 2 + i * math.pi / 3), 0, 1.55 * math.sin(math.pi / 2 + i * math.pi / 3)) for i in range(6)]
	for i in range(6):
		objs += [rod(C[i], C[(i + 1) % 6], 0.075, mbond), rod(C[i], H[i], 0.06, mbond), sph(0.3, C[i], mc), sph(0.19, H[i], mh)]
	spin = group(objs)
	tilt = group([spin], rot=(-0.5, 0.15, 0.5), loc=(0, 0, 1.5))
	spin.name, tilt.name = 'part-ring', 'part-tilt'

	def anim(u):
		# a sixth of a turn, twice: the ring lands on itself
		spin.rotation_euler.y = (math.pi / 3) * (spring(seg(u, 0.04, 0.5), 4.5, 9.0) + spring(seg(u, 0.52, 0.98), 4.5, 9.0))
		tilt.location.z = 1.5 + 0.07 * math.sin(2 * math.pi * u)
		tilt.rotation_euler.x = -0.5 + 0.08 * math.sin(4 * math.pi * u)
	return anim


def infinity(t):
	main, light, dark = t
	# an infinity sign of wire, one strand passing over the other, and two beads threaded on it that never stop
	a, c, r = 1.5, 0.3, 0.17

	def at(q):
		d = 1 + math.sin(q) ** 2
		return (a * math.cos(q) / d, a * math.sin(q) * math.cos(q) / d, c * math.sin(q))

	wire = tube([at(2 * math.pi * i / 240) for i in range(240)], r, mat(main), cyclic=True)
	beads = [sph(0.3, at(0), mat(YELLOW)), sph(0.3, at(math.pi), mat(PAPER, 0.3))]
	e = group([wire] + beads, rot=(0.62, 0, 0.64), loc=(0, 0, 0.9))

	def anim(u):
		# once round a loop, in two surges: the beads gather speed down each lobe and hang at its end
		q = 2 * math.pi * (u - 0.07 * math.sin(4 * math.pi * u))
		for k, bead in enumerate(beads):
			bead.location = at(q + k * math.pi)
			s = 1 + 0.12 * math.sin(4 * math.pi * u) ** 2
			bead.scale = (s, s, s)
		e.rotation_euler.z = 0.64 + 0.1 * math.sin(2 * math.pi * u)
		e.location.z = 0.9 + 0.05 * math.sin(4 * math.pi * u)
	return anim


def saddle(t):
	main, light, dark = t
	n = 48
	f = lambda x, y, a: a * (x * x - y * y)
	me = bpy.data.meshes.new('saddle')
	bm = bmesh.new()
	grid = [(-1 + 2 * i / n, -1 + 2 * j / n) for i in range(n + 1) for j in range(n + 1)]
	vs = [bm.verts.new((x, y, f(x, y, 0.55))) for x, y in grid]
	for i in range(n):
		for j in range(n):
			k = i * (n + 1) + j
			bm.faces.new((vs[k], vs[k + n + 1], vs[k + n + 2], vs[k + 1]))
	bm.to_mesh(me)
	bm.free()
	o = bpy.data.objects.new('saddle', me)
	bpy.context.collection.objects.link(o)
	sd = o.modifiers.new('solid', 'SOLIDIFY')
	sd.thickness, sd.offset = 0.1, -1
	fin(o, mat(main), 0.03)
	objs, ml, lines = [o], mat(PAPER, 0.4), []
	for k in range(-3, 4):
		c = k * 0.3
		for xy in ([(c, -1 + 2 * i / 40) for i in range(41)], [(-1 + 2 * i / 40, c) for i in range(41)]):
			tb = tube([(x, y, f(x, y, 0.55) + 0.012) for x, y in xy], 0.014, ml)
			lines.append((tb, xy))
			objs.append(tb)
	dot = sph(0.12, (0, 0, 0.1), mat(YELLOW))
	objs.append(dot)
	e = group(objs, rot=(0, 0, 0.2), loc=(0, 0, 0.75))

	def anim(u):
		# the surface breathes from one saddle to the other and back
		a = 0.55 * math.cos(2 * math.pi * u)
		for v, (x, y) in zip(o.data.vertices, grid):
			v.co.z = f(x, y, a)
		o.data.update()
		for tb, xy in lines:
			for p, (x, y) in zip(tb.data.splines[0].points, xy):
				p.co = (x, y, f(x, y, a) + 0.012, 1)
		s = 1 + 0.3 * math.sin(2 * math.pi * u) ** 2
		dot.scale = (s, s, s)
		e.rotation_euler.z = 0.2 + 0.12 * math.sin(2 * math.pi * u)
	return anim


def gyro(t):
	main, light, dark = t
	c = (0, 0, 1.15)  # the wheel, above the tip it stands on
	wheel = group([
		torus(1.0, 0.07, c, mat(main), rot=(math.pi / 2, 0, 0)),
		torus(0.84, 0.06, c, mat(PAPER, 0.3)),
		cyl(0.62, 0.16, c, mat(YELLOW), bevel=0.05),
		rod((-0.84, 0, 1.15), (-1.0, 0, 1.15), 0.05, mat(INK)),
		rod((0.84, 0, 1.15), (1.0, 0, 1.15), 0.05, mat(INK)),
	])
	axis = [cyl(0.05, 2.3, c, mat(INK), bevel=0.02), sph(0.1, (0, 0, 2.3), mat(INK))]
	tilt = group([wheel] + axis, rot=(0.3, -0.28, 0), loc=(0, 0, 0.2))
	turn = group([tilt], rot=(0, 0, 0.3))
	cone(0.42, 0.2, (0, 0, 0.1), mat(dark), r2=0.12)

	def anim(u):
		turn.rotation_euler.z = 0.3 + 2 * math.pi * u
		wheel.rotation_euler.z = 3 * math.pi * u
		tilt.rotation_euler.x = 0.3 + 0.05 * math.sin(4 * math.pi * u)
	return anim


def magnet(t):
	main, light, dark = t
	arc = [(0.62 * math.cos(a), 0, 0.62 * math.sin(a)) for a in [math.pi + math.pi * i / 40 for i in range(41)]]
	objs = [tube([(-0.62, 0, 0.75)] + arc + [(0.62, 0, 0.75)], 0.27, mat(main))]
	for x in (-0.62, 0.62):
		objs.append(cyl(0.275, 0.5, (x, 0, 1.0), mat(PAPER, 0.3), bevel=0.04))
	bolt = [(0.12, 1.0), (-0.2, 0.28), (0.02, 0.28), (-0.12, -0.38), (0.26, 0.48), (0.03, 0.48), (0.3, 1.0)]
	at = (0.06, 0, 2.05)
	pb = pivot([poly([(x, z + 1.75) for x, z in bolt], 0.14, mat(YELLOW), bevel=0.03)], at)
	e = group(objs + [pb], rot=(0, -0.3, 0.45), loc=(0, 0, 1.0))

	def anim(u):
		e.rotation_euler.y = -0.3 + 0.16 * math.sin(2 * math.pi * u) + 0.05 * math.sin(4 * math.pi * u)
		z = pop(seg(u, 0.08, 0.5)) + pop(seg(u, 0.55, 0.97))
		s = 1 + 0.45 * z
		pb.scale = (s, s, s)
		pb.location = (at[0], at[1], at[2] + 0.12 * abs(z))
		pb.rotation_euler.y = 0.3 * z
	return anim


def chip(t):
	main, light, dark = t
	box((1.7, 1.7, 0.34), (0, 0, 0.42), mat(INK, 0.5), bevel=0.06)
	plate = pivot([box((1.0, 1.0, 0.08), (0, 0, 0.62), mat(main), bevel=0.03)], (0, 0, 0.62))
	led = pivot([cyl(0.09, 0.04, (-0.62, -0.62, 0.6), mat(YELLOW), bevel=0.01)], (-0.62, -0.62, 0.6))
	mp = mat(GREY, 0.25, metal=1.0, coat=0)
	for i in range(5):
		c = -0.6 + 0.3 * i
		for s in (-1, 1):
			box((0.14, 0.36, 0.07), (c, s * 0.98, 0.36), mp, bevel=0.02)
			box((0.14, 0.07, 0.36), (c, s * 1.13, 0.2), mp, bevel=0.02)
			box((0.36, 0.14, 0.07), (s * 0.98, c, 0.36), mp, bevel=0.02)
			box((0.07, 0.14, 0.36), (s * 1.13, c, 0.2), mp, bevel=0.02)

	def anim(u):
		# the die lifts off, turns a quarter and sits back
		a = seg(u, 0.05, 0.9)
		lift = spring(seg(a, 0, 0.5), 5.0, 9.0) - spring(seg(a, 0.55, 1), 6.0, 12.0)
		plate.location.z = 0.62 + max(0.5 * lift, -0.004)
		plate.rotation_euler.z = (math.pi / 2) * ease(seg(a, 0.12, 0.7))
		s = 1 + 1.2 * abs(pop(seg(u, 0.55, 0.98)))
		led.scale = (s, s, s)
	return anim


def tree(t):
	main, light, dark = t
	mn, me, mh = mat(main), mat(light, 0.4), mat(YELLOW)
	root, mids = (0, 0, 2.2), [(-0.8, 0, 1.3), (0.8, 0, 1.3)]
	leaves = [(-1.2, 0, 0.3), (-0.4, 0, 0.3), (0.4, 0, 0.3), (1.2, 0, 0.3)]
	objs = []
	for i, m in enumerate(mids):
		objs.append(rod(root, m, 0.055, mh if i == 1 else me))
		for j in (0, 1):
			objs.append(rod(m, leaves[i * 2 + j], 0.055, mh if (i, j) == (1, 0) else me))
	nodes = [sph(0.26, root, mh), sph(0.24, mids[1], mh), sph(0.22, leaves[2], mh), sph(0.24, mids[0], mn)] + [sph(0.22, leaves[k], mn) for k in (0, 1, 3)]
	e = group(objs + nodes, rot=(0, 0, 0.45))

	def anim(u):
		# the search runs down the path: root, branch, leaf; the others answer after
		for k, nd in enumerate(nodes):
			d = 0.04 + 0.16 * k if k < 3 else 0.5 + 0.05 * k
			s = 1 + (0.5 if k < 3 else 0.2) * pop(seg(u, d, d + 0.45))
			nd.scale = (s, s, s)
		e.rotation_euler.z = 0.45 + 0.14 * math.sin(2 * math.pi * u)
	return anim


def scatter(t):
	main, light, dark = t
	box((2.3, 2.3, 0.18), (0, 0, 0.09), mat(PAPER, 0.5), bevel=0.07)
	mg = mat('#BFD0EA', 0.6, coat=0)
	for k in range(-4, 5):
		v = k * 0.23
		rod((v, -1.02, 0.185), (v, 1.02, 0.185), 0.008, mg)
		rod((-1.02, v, 0.185), (1.02, v, 0.185), 0.008, mg)
	pts = [(-0.8, -0.75, 0.45), (-0.75, -0.1, 0.75), (-0.3, -0.6, 0.6), (-0.2, 0.2, 1.05), (0.25, -0.3, 0.95), (0.3, 0.6, 1.5), (0.75, 0.05, 1.3), (0.8, 0.75, 1.85)]
	mn, ms = mat(main), mat(light, 0.5)
	pins = []
	for x, y, z in pts:
		stem = pivot([rod((x, y, 0.18), (x, y, z), 0.028, ms)], (x, y, 0.18))
		pins.append((stem, sph(0.15, (x, y, z), mn), (x, y, z)))
	a0 = (-1.0, -0.85, 0.42)
	line = pivot([rod(a0, (1.0, 0.85, 1.92), 0.055, mat(YELLOW))], a0)

	def grow(u, start):
		return 1 - ease(seg(u, 0.02, 0.12)) + spring(seg(u, start, start + 0.38), 5.0, 10.0)

	def anim(u):
		# the data sinks into the plane, then each point springs up, then the line is drawn through
		for i, (stem, ball, (x, y, z)) in enumerate(pins):
			g = max(grow(u, 0.14 + 0.045 * i), 0.0)
			stem.scale = (1, 1, max(g, 0.001))
			ball.location = (x, y, 0.18 + (z - 0.18) * g)
			s = min(1.0, 0.25 + g)
			ball.scale = (s, s, s)
		g = max(1 - ease(seg(u, 0.02, 0.12)) + spring(seg(u, 0.56, 0.95), 5.0, 9.0), 0.001)
		line.scale = (g, g, g)
	return anim


def layers(t):
	main, light, dark = t
	cols = [mat(main), mat(light), mat(PAPER, 0.35), mat(YELLOW)]
	sizes = [1.9, 1.5, 1.1, 0.7]
	slabs = [box((0.16, s, s), (-0.9 + 0.6 * i, 0, 0), m, bevel=0.07) for i, (s, m) in enumerate(zip(sizes, cols))]
	objs = list(slabs)
	me = mat(GREY, 0.4)
	for i in range(3):
		a, b = sizes[i] / 2 - 0.12, sizes[i + 1] / 2 - 0.12
		for sy, sz in ((1, 1), (1, -1), (-1, 1), (-1, -1)):
			objs.append(rod((-0.9 + 0.6 * i, sy * a, sz * a), (-0.3 + 0.6 * i, sy * b, sz * b), 0.018, me))
	e = group(objs, rot=(0, 0, -0.5), loc=(0, 0, 1.05))

	def anim(u):
		# a signal passes through, layer after layer
		for i, sl in enumerate(slabs):
			p = pop(seg(u, 0.06 + 0.14 * i, 0.56 + 0.14 * i))
			sl.scale = (1 + 0.6 * abs(p), 1 + 0.13 * p, 1 + 0.13 * p)
		e.rotation_euler.z = -0.5 + 0.1 * math.sin(2 * math.pi * u)
	return anim


def bubble(t):
	main, light, dark = t
	objs = [box((2.3, 0.5, 1.5), (0, 0, 0), mat(PAPER, 0.4), bevel=0.24)]
	objs.append(box((0.5, 0.42, 0.5), (-0.6, 0, -0.72), mat(PAPER, 0.4), rot=(0, math.pi / 4, 0), bevel=0.1))
	y, words = -0.27, []
	for w, x, z, m in ((1.5, -0.05, 0.36, mat(main)), (1.1, -0.25, 0.02, mat(main)), (0.5, -0.55, -0.32, mat(main)), (0.42, 0.0, -0.32, mat(YELLOW))):
		words.append(pivot([box((w, 0.08, 0.17), (x, y, z), m, bevel=0.035)], (x - w / 2, y, z)))
	e = group(objs + words, rot=(-0.1, 0, 0.4), loc=(0, 0, 1.2))

	def anim(u):
		# the lines are wiped, then written again one word after the other; the last one pops in
		wipe = 1 - ease(seg(u, 0.03, 0.12))
		for i, w in enumerate(words[:3]):
			w.scale = (max(wipe + ease(seg(u, 0.16 + 0.15 * i, 0.32 + 0.15 * i)), 0.001), 1, 1)
		g = max(wipe + spring(seg(u, 0.62, 0.95), 5.0, 12.0), 0.001)
		words[3].scale = (g, 1, g)
		s = 1 + 0.07 * pop(seg(u, 0.0, 0.45))
		e.scale = (s, s, s)
		e.rotation_euler.z = 0.4 + 0.08 * math.sin(2 * math.pi * u)
	return anim


def pawn(m, loc, s=1.0):
	x, y = loc
	return pivot([cyl(0.42 * s, 0.14 * s, (x, y, 0.07 * s), m, bevel=0.04), cone(0.34 * s, 0.9 * s, (x, y, 0.55 * s), m, r2=0.12 * s, bevel=0.03), sph(0.27 * s, (x, y, 1.15 * s), m)], (x, y, 0))


def agents(t):
	main, light, dark = t
	spots = [(-0.8, 0.35), (0.75, 0.55), (0.1, -0.7)]
	pawns = [pawn(mat(main), spots[0], 1.0), pawn(mat(PAPER, 0.35), spots[1], 0.9), pawn(mat(YELLOW), spots[2], 0.82)]
	ring = torus(0.95, 0.03, (0, 0.05, 0.03), mat(light))

	def anim(u):
		# one speaks, the next answers
		for i, (p, (x, y)) in enumerate(zip(pawns, spots)):
			jump(p, (x, y, 0), seg(u, 0.03 + 0.28 * i, 0.43 + 0.28 * i), 0.42)
		s = 1 + 0.06 * math.sin(2 * math.pi * u) ** 2
		ring.scale = (s, s, 1)
	return anim


def shield(t):
	main, light, dark = t
	out = [(0, 1.15), (0.95, 0.8), (0.95, 0.1)]
	out += [(0.95 * math.cos(a) ** 0.9, 0.1 - 1.25 * math.sin(a)) for a in [math.pi / 2 * i / 12 for i in range(1, 13)]]
	pts = out + [(-x, z) for x, z in reversed(out[1:-1])]
	check = tube([(-0.42, -0.26, 0.02), (-0.1, -0.26, -0.34), (0.48, -0.26, 0.42)], 0.1, mat(YELLOW))
	e = group([poly(pts, 0.36, mat(main), bevel=0.1), check], rot=(-0.1, 0, 0.42), loc=(0, 0, 1.25))

	def anim(u):
		# the check is rubbed out and drawn again, and the shield takes the blow
		check.data.bevel_factor_end = max(1 - ease(seg(u, 0.03, 0.12)) + ease(seg(u, 0.28, 0.5)), 0.0)
		e.rotation_euler.z = 0.42 + 0.5 * math.exp(-3 * u) * math.sin(4 * math.pi * u) * (1 - u)
		s = 1 + 0.1 * pop(seg(u, 0.46, 0.95))
		e.scale = (s, s, s)
	return anim


# The three levels: what is on the desk at each age, in the colours of the level's subjects.

def pencil(colour, x, y, h, turn):
	"""A pencil standing on its rubber at (x, y), `h` tall up to the wood."""
	wood, pink, r = '#E9C79C', '#F0A3B4', 0.24
	parts = [
		cyl(r, 0.26, (x, y, 0.13), mat(pink, 0.6, coat=0), bevel=0.05),
		cyl(r + 0.01, 0.16, (x, y, 0.34), mat(GREY, 0.25, metal=1.0, coat=0), bevel=0.02),
		cyl(r, h, (x, y, 0.42 + h / 2), mat(colour), rot=(0, 0, turn), bevel=0.015, verts=6),
		cone(r - 0.008, 0.44, (x, y, 0.42 + h + 0.22), mat(wood, 0.6, coat=0), r2=0.07, bevel=0),
		cone(0.07, 0.15, (x, y, 0.42 + h + 0.44 + 0.075), mat(INK), bevel=0),
	]
	return pivot(parts, (x, y, 0))


def level_middle(t):
	spots = [(-0.62, 0.12, 1.25, 0.2), (0.0, -0.3, 1.7, 0.5), (0.62, 0.18, 0.95, 0.0)]
	cols = [TONES['math'][0], TONES['cs'][0], TONES['chemistry'][0]]
	ps = [pencil(c, x, y, h, turn) for c, (x, y, h, turn) in zip(cols, spots)]
	for i, p in enumerate(ps):
		p.name = 'part-pencil-%d' % i

	def anim(u):
		for i, (p, (x, y, h, turn)) in enumerate(zip(ps, spots)):
			jump(p, (x, y, 0), seg(u, 0.03 + 0.26 * i, 0.47 + 0.26 * i), 0.3, math.pi / 3 * 2)
	return anim


def book(colour, z, turn, w=1.7, d=1.25):
	"""A closed book lying at height z: two boards, a spine, the block of pages."""
	m, th = mat(colour), 0.3
	parts = [
		box((w, d, 0.05), (0, 0, z + 0.025), m, bevel=0.02),
		box((w, d, 0.05), (0, 0, z + th - 0.025), m, bevel=0.02),
		box((0.07, d, th), (-w / 2 + 0.035, 0, z + th / 2), m, bevel=0.03),
		box((w - 0.12, d - 0.1, th - 0.1), (0.02, 0, z + th / 2), mat(PAPER, 0.6, coat=0), bevel=0.02),
	]
	e = pivot(parts, (0, 0, z))
	e.rotation_euler.z = turn
	return e


def level_high(t):
	cols = [TONES['physics'][0], TONES['math'][0], TONES['chemistry'][0], TONES['cs'][0]]
	turns, sizes = [0.12, -0.2, 0.26, -0.06], [(1.8, 1.3), (1.65, 1.25), (1.7, 1.2), (1.45, 1.1)]
	books = [book(c, 0.3 * i, turns[i], *sizes[i]) for i, c in enumerate(cols)]
	for i, b in enumerate(books):
		b.name = 'part-book-%d' % i

	def anim(u):
		# the pile breathes open from the top and settles, each book turning a little on the way
		lift = max(spring(seg(u, 0.04, 0.48), 5.0, 9.0) - spring(seg(u, 0.5, 0.96), 5.5, 11.0), -0.02)
		for i, b in enumerate(books):
			b.location.z = 0.3 * i + 0.16 * i * lift
			b.rotation_euler.z = turns[i] + (0.25 if i % 2 else -0.25) * lift * (i / 3)
	return anim


def level_university(t):
	main, light, dark = t
	base = [book(TONES['physics'][0], 0.0, 0.15, 1.75, 1.3), book(TONES['math'][0], 0.3, -0.18, 1.6, 1.2)]
	z = 0.6
	edge = (0.62, -0.62, z + 0.58)
	tassel = pivot([rod(edge, (edge[0], edge[1], edge[2] - 0.5), 0.022, mat(YELLOW)), cone(0.035, 0.3, (edge[0], edge[1], edge[2] - 0.62), mat(YELLOW), r2=0.1, bevel=0)], edge)
	cap = pivot([
		cone(0.6, 0.5, (0, 0, z + 0.25), mat(main), r2=0.55, bevel=0.04),
		box((1.75, 1.75, 0.09), (0, 0, z + 0.54), mat(main), rot=(0, 0, 0.0), bevel=0.03),
		cyl(0.1, 0.06, (0, 0, z + 0.61), mat(YELLOW), bevel=0.02),
		rod((0, 0, z + 0.62), (edge[0], edge[1], z + 0.6), 0.022, mat(YELLOW)),
		tassel,
	], (0, 0, z))
	cap.rotation_euler.z = 0.2
	cap.name, tassel.name = 'part-cap', 'part-tassel'
	for i, b in enumerate(base):
		b.name = 'part-base-%d' % i

	def anim(u):
		# the cap is tossed, and the tassel swings on after it lands
		a = seg(u, 0.04, 0.6)
		jump(cap, (0, 0, z), a, 0.75)
		cap.rotation_euler.z = 0.2 + 2 * math.pi * ease(seg(a, 0.18, 0.7))
		sw = math.exp(-3.2 * u) * math.sin(6 * math.pi * u) * (1 - u)
		tassel.rotation_euler = (0.9 * sw, 0.9 * sw, 0)
		for i, b in enumerate(base):
			b.scale = (1, 1, 1 - 0.06 * pop(seg(u, 0.42, 0.9)))
	return anim


def arrow(m, r=0.09):
	"""An arrow from the origin, and the function that points it at a vector: the shaft ends where the head begins."""
	shaft = tube([(0, 0, 0), (0, 0, 1)], r, m)
	head = cone(r * 2.6, r * 5.5, (0, 0, 0), m, bevel=0)

	def to(v):
		v = Vector(v)
		d = v.normalized()
		shaft.data.splines[0].points[1].co = (*(v - d * r * 5.5), 1)
		head.location = v - d * r * 2.75
		head.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
	return [shaft, head], to


def basis(t):
	main, light, dark = t
	L = 1.45
	arrows = [arrow(mat(main)), arrow(mat(YELLOW)), arrow(mat(INK))]
	corners = [(i, j, k) for i in (0, 1) for j in (0, 1) for k in (0, 1)]
	# the edges of the box the three vectors span, without the three the arrows already draw
	edges = [(a, b) for a in corners for b in corners if a < b and sum(x != y for x, y in zip(a, b)) == 1 and a != (0, 0, 0)]
	me = mat(PAPER, 0.4)
	wires = [tube([(0, 0, 0), (0, 0, 1)], 0.04, me) for _ in edges]
	far = [c for c in corners if sum(c) >= 2]
	dots = [sph(0.09, (0, 0, 0), me) for _ in far]
	origin = sph(0.2, (0, 0, 0), mat(PAPER, 0.3))
	# the origin is the corner nearest the eye, and the two arrows on the ground open away from it, to the right and to the left
	e = group([origin] + wires + dots + [o for objs, _ in arrows for o in objs], rot=(0, 0, 1.43), loc=(0, 0, 0.2))

	def anim(u):
		# three linear maps, one after the other: each springs the cube into a parallelepiped, holds it a moment
		# and lets it spring back, more slowly, to the cube, which rests before the next
		k, w = divmod(u * 3, 1)
		a = spring(seg(w, 0.1, 0.5), 6.0, 13.0) - spring(seg(w, 0.52, 0.98), 5.0, 9.0)
		v = [
			# the base leans: a shear along the first vector
			[Vector((L * (1 + 0.12 * a), 0, 0)), Vector((0.5 * a * L, L, 0)), Vector((0, -0.32 * a * L, L * (1 - 0.08 * a)))],
			# taller and narrower: a stretch along the third
			[Vector((L * (1 - 0.1 * a), 0, 0)), Vector((0, L * (1 - 0.1 * a), 0)), Vector((0, 0, L * (1 + 0.3 * a)))],
			# the top slides over the base, away from where the base leant: a shear of the third vector
			[Vector((L, 0, 0)), Vector((0, L, 0)), Vector((-0.32 * a * L, 0.32 * a * L, L))],
		][int(k) % 3]
		at = lambda c: c[0] * v[0] + c[1] * v[1] + c[2] * v[2]
		for (_, to), w in zip(arrows, v):
			to(w)
		for w, (p, q) in zip(wires, edges):
			w.data.splines[0].points[0].co, w.data.splines[0].points[1].co = (*at(p), 1), (*at(q), 1)
		for d, c in zip(dots, far):
			d.location = at(c)
	anim.frames = 150
	return anim


def epicycles(t):
	main, light, dark = t
	# a wheel carrying a smaller wheel that turns three times as fast: the point on its rim draws the sum of two sines
	R1, R2, c = 0.75, 0.25, (-0.95, 0, 1.2)
	x0, x1, n, k = 0.4, 2.35, 120, 2 * math.pi / 1.7
	mi = mat(INK)
	ring2 = torus(R2, 0.07, (0, 0, 0), mat(YELLOW), rot=(math.pi / 2, 0, 0))
	arm1, arm2 = tube([c, c], 0.065, mi), tube([c, c], 0.055, mi)
	joint, tip = sph(0.13, (0, 0, 0), mi), sph(0.17, (0, 0, 0), mat(YELLOW))
	link = tube([c, c], 0.03, mat(GREY, 0.35))
	xs = [x0 + (x1 - x0) * i / n for i in range(n + 1)]
	wave = tube([(x, 0, c[2]) for x in xs], 0.1, mat(main))
	pen = sph(0.18, (x0, 0, c[2]), mat(PAPER, 0.3))
	e = group([torus(R1, 0.1, c, mat(main), rot=(math.pi / 2, 0, 0)), sph(0.17, c, mi), ring2, arm1, arm2, joint, tip, link, wave, pen], rot=(0, 0, -0.12))

	def anim(u):
		q = 2 * math.pi * u + 2.0
		p1 = (c[0] + R1 * math.cos(q), 0, c[2] + R1 * math.sin(q))
		p2 = (p1[0] + R2 * math.cos(3 * q), 0, p1[2] + R2 * math.sin(3 * q))
		ring2.location = joint.location = p1
		tip.location = p2
		arm1.data.splines[0].points[1].co = (*p1, 1)
		arm2.data.splines[0].points[0].co, arm2.data.splines[0].points[1].co = (*p1, 1), (*p2, 1)
		link.data.splines[0].points[0].co, link.data.splines[0].points[1].co = (*p2, 1), (x0, 0, p2[2], 1)
		pen.location = (x0, 0, p2[2])
		# the wave runs away from the pen: what it drew a moment ago is a little further along
		for p, x in zip(wave.data.splines[0].points, xs):
			w = q - k * (x - x0)
			p.co = (x, 0, c[2] + R1 * math.sin(w) + R2 * math.sin(3 * w), 1)
	return anim


def flask(t):
	main, light, dark = t
	# a conical flask: the liquid is the lower band of the cone, and what it gives off leaves by the neck
	glass = mat(PAPER, 0.3)
	parts = [
		cone(0.95, 0.7, (0, 0, 0.35), mat(main), r2=0.617, bevel=0.05),
		cone(0.617, 0.75, (0, 0, 1.075), glass, r2=0.26, bevel=0.02),
		cyl(0.26, 0.7, (0, 0, 1.78), glass, bevel=0.02),
		torus(0.28, 0.065, (0, 0, 2.13), glass),
	]
	body = pivot(parts, (0, 0, 0))
	sizes = [(0.25, main), (0.17, YELLOW), (0.21, light), (0.15, main)]
	bubbles = [sph(r, (0, 0, 0), mat(h, 0.3)) for r, h in sizes]
	body.name = 'part-flask'
	for i, b in enumerate(bubbles):
		b.name = 'part-bubble-%d' % i

	def anim(u):
		body.rotation_euler.y = 0.07 * math.sin(2 * math.pi * u)
		body.rotation_euler.z = 0.5 + 0.25 * math.sin(2 * math.pi * u)
		for i, b in enumerate(bubbles):
			# each bubble swells as it leaves the neck, drifts up and is gone; they take turns, so one is always in the air
			p = (u + (0.38, 0.12, 0.66, 0.9)[i]) % 1
			s = max(math.sin(math.pi * p) ** 0.6, 0.001) if p < 0.85 else max((1 - p) / 0.15, 0.001) * math.sin(math.pi * 0.85) ** 0.6
			b.scale = (s, s, s)
			b.location = (0.16 * math.sin(2 * math.pi * p + 2.1 * i) + 0.1 * (i - 1.5) * p, 0.05 * (i - 1.5), 2.25 + 0.85 * p)
	return anim


# ---- the onboarding: who is signing up (public/onboarding, see src/components/onboarding) ----

def breathe(u, a=0.04, b=0.48, c=0.5, d=0.96):
	"""Up on a spring and back down: 0 at both ends of the loop."""
	return max(spring(seg(u, a, b), 5.0, 9.0) - spring(seg(u, c, d), 5.5, 11.0), -0.02)


def backpack(t):
	red, dark, blue = TONES['math'][0], TONES['math'][2], TONES['physics'][0]
	body = box((1.5, 0.95, 1.85), (0, 0, 0.95), mat(red), bevel=0.32)
	pocket = pivot([
		box((1.1, 0.3, 0.8), (0, -0.52, 0.62), mat(dark), bevel=0.14),
		box((0.5, 0.05, 0.07), (0, -0.69, 0.84), mat(YELLOW), bevel=0.02),
	], (0, -0.45, 0.25))
	pocket.name = 'part-pocket'
	zipper = tube([(-0.55, -0.43, 1.32), (-0.3, -0.48, 1.55), (0.3, -0.48, 1.55), (0.55, -0.43, 1.32)], 0.035, mat(YELLOW))
	handle = torus(0.26, 0.06, (0, 0.1, 1.88), mat(INK), rot=(math.pi / 2, 0, 0))
	side = box((0.22, 0.6, 0.6), (0.78, 0, 0.5), mat(dark), bevel=0.1)
	bottle = cyl(0.13, 0.75, (0.83, 0, 0.78), mat(blue), bevel=0.04)
	e = pivot([group([body, zipper, handle, side, bottle, pocket], rot=(0, 0, 0.35))], (0, 0, 0))

	def anim(u):
		# picked up and put down, and the pocket settles after it
		jump(e, (0, 0, 0), seg(u, 0.04, 0.7), 0.45)
		s = 1 + 0.14 * pop(seg(u, 0.5, 1.0))
		pocket.scale = (s, s, s)
	return anim


def house(t):
	red = TONES['math'][0]
	walls = box((1.7, 1.4, 1.1), (0, 0, 0.55), mat(PAPER, 0.5), bevel=0.05)
	roof = poly([(-1.08, 0), (1.08, 0), (0, 0.85)], 1.62, mat(red), bevel=0.05)
	roof.location = (0, 0, 1.1)
	chimney = box((0.26, 0.26, 0.7), (0.55, 0.3, 1.6), mat(INK), bevel=0.03)
	top = pivot([roof, chimney], (0, 0, 1.1))
	top.name = 'part-roof'
	door = box((0.4, 0.06, 0.66), (-0.38, -0.71, 0.33), mat(INK), bevel=0.02)
	knob = sph(0.035, (-0.26, -0.75, 0.33), mat(YELLOW))
	window = pivot([box((0.46, 0.06, 0.46), (0.38, -0.71, 0.62), mat(YELLOW), bevel=0.02)], (0.38, -0.71, 0.62))
	side = pivot([box((0.06, 0.46, 0.46), (0.86, 0, 0.6), mat(YELLOW), bevel=0.02)], (0.86, 0, 0.6))
	group([walls, top, door, knob, window, side], rot=(0, 0, 0.3))

	def anim(u):
		# the roof lifts like a lid and comes back; the lights answer
		top.location.z = 1.1 + 0.3 * breathe(u)
		top.rotation_euler.z = 0.12 * breathe(u)
		for i, w in enumerate((window, side)):
			s = 1 + 0.25 * pop(seg(u, 0.3 + 0.15 * i, 0.9 + 0.1 * i))
			w.scale = (s, s, s)
	return anim


def bulb(t):
	glass = mat(YELLOW, 0.22, coat=0.6)
	parts = [
		sph(0.72, (0, 0, 1.78), glass),
		cone(0.3, 0.55, (0, 0, 1.05), glass, r2=0.52, bevel=0.02),
		cyl(0.3, 0.42, (0, 0, 0.62), mat(GREY, 0.3, metal=0.5), bevel=0.03),
		torus(0.3, 0.05, (0, 0, 0.52), mat(INK)),
		torus(0.3, 0.05, (0, 0, 0.72), mat(INK)),
		cyl(0.15, 0.16, (0, 0, 0.36), mat(INK), bevel=0.04),
	]
	lamp = pivot(parts, (0, 0, 0.28))
	lamp.name = 'part-lamp'
	rays = []
	for i in range(7):
		a = math.radians(-25 + 38.5 * i)
		rays.append(group([box((0.36, 0.1, 0.1), (1.18, 0, 0), mat(TONES['cs'][0]), bevel=0.04)], rot=(0, -a, 0), loc=(0, 0, 1.78)))
		rays[-1].name = 'part-ray-%d' % i
	group([lamp] + rays, rot=(0, 0.16, 0.5))

	def anim(u):
		# it lights up: the rays shoot out one after the other, and the lamp swells with them
		for i, r in enumerate(rays):
			s = 1 + 0.2 * pop(seg(u, 0.05 + 0.05 * i, 0.6 + 0.05 * i))
			r.scale = (s, s, s)
		k = 1 + 0.06 * pop(seg(u, 0.02, 0.6))
		lamp.scale = (k, k, k)
		lamp.rotation_euler.y = 0.07 * math.sin(2 * math.pi * u)
	return anim


def blackboard(t):
	wood, leg = mat(TONES['cs'][1], 0.6), mat(TONES['cs'][2], 0.5)
	chalk = mat(PAPER, 0.8, coat=0)
	y = -0.118
	axes = [tube([(-0.95, y, 1.2), (0.95, y, 1.2)], 0.022, chalk), tube([(-0.6, y, 1.0), (-0.6, y, 2.12)], 0.022, chalk)]
	curve = tube([(-0.38 + 0.06 * k, y, 1.28 + 1.9 * (0.06 * k - 0.6) ** 2) for k in range(21)], 0.03, mat(YELLOW, 0.8, coat=0))
	objs = axes + [curve,
		box((2.6, 0.14, 1.7), (0, 0, 1.55), wood, bevel=0.04),
		box((2.35, 0.08, 1.45), (0, -0.06, 1.55), mat(TONES['chemistry'][2], 0.75, coat=0), bevel=0.02),
		box((2.0, 0.24, 0.07), (0, -0.15, 0.7), wood, bevel=0.02),
		cyl(0.045, 0.3, (0.5, -0.18, 0.78), chalk, rot=(0, math.pi / 2, 0), bevel=0.01),
		rod((-0.95, 0, 0.75), (-1.15, -0.12, 0), 0.05, leg),
		rod((0.95, 0, 0.75), (1.15, -0.12, 0), 0.05, leg),
		rod((0, 0.07, 1.6), (0, 0.95, 0), 0.05, leg),
	]
	e = group(objs, rot=(0, 0, 0.32))

	def anim(u):
		# wiped clean, then the axes and the curve are drawn again
		wipe = 1 - ease(seg(u, 0.03, 0.12))
		for i, a in enumerate(axes):
			a.data.bevel_factor_end = max(wipe, ease(seg(u, 0.16 + 0.12 * i, 0.34 + 0.12 * i)))
		curve.data.bevel_factor_end = max(wipe, ease(seg(u, 0.42, 0.86)))
		e.rotation_euler.z = 0.32 + 0.05 * math.sin(2 * math.pi * u)
	return anim


def school(t):
	blue, red, wall = TONES['physics'][0], TONES['math'][0], mat(PAPER, 0.5)
	roof = poly([(-0.62, 0), (0.62, 0), (0, 0.55)], 1.3, mat(red), bevel=0.04)
	roof.location = (0, -0.02, 1.7)
	flag = poly([(0, 0), (0.55, 0.15), (0, 0.3)], 0.03, mat(YELLOW), bevel=0.01)
	flag.location = (0.02, -0.02, 2.62)
	wave = pivot([flag], (0, -0.02, 2.62))
	wave.name = 'part-flag'
	hand = pivot([box((0.035, 0.03, 0.16), (0, -0.675, 1.37), mat(INK), bevel=0.008)], (0, -0.675, 1.3))
	hand.name = 'part-hand'
	objs = [
		box((2.6, 1.1, 1.0), (0, 0, 0.5), wall, bevel=0.04),
		box((2.72, 1.2, 0.1), (0, 0, 1.04), mat(red), bevel=0.03),
		box((0.9, 1.2, 1.7), (0, -0.02, 0.85), wall, bevel=0.04),
		roof,
		box((0.36, 0.06, 0.6), (0, -0.63, 0.3), mat(INK), bevel=0.02),
		cyl(0.2, 0.06, (0, -0.63, 1.3), mat(YELLOW), rot=(math.pi / 2, 0, 0), bevel=0.015),
		rod((0, -0.02, 2.2), (0, -0.02, 3.0), 0.03, mat(INK)),
		wave, hand,
	]
	objs += [box((0.24, 0.05, 0.34), (x, -0.56, 0.55), mat(blue), bevel=0.02) for x in (-1.02, -0.66, 0.66, 1.02)]
	group(objs, rot=(0, 0, 0.3))

	def anim(u):
		# the hour goes round once and the flag flaps
		hand.rotation_euler.y = 2 * math.pi * ease(seg(u, 0.05, 0.95))
		wave.rotation_euler.z = 0.55 * math.sin(4 * math.pi * u) * math.sin(math.pi * u)
	return anim


def envelope(t):
	card = pivot([box((1.6, 0.04, 1.1), (0, 0.13, 1.1), mat(TONES['math'][0]), bevel=0.04)]
		+ [cyl(0.075, 0.03, (-0.5 + 0.2 * i, 0.1, 1.42), mat(YELLOW), rot=(math.pi / 2, 0, 0), bevel=0.01) for i in range(6)], (0, 0.13, 0.6))
	card.name = 'part-card'
	objs = [
		box((2.0, 0.18, 1.3), (0, 0, 0.65), mat(PAPER, 0.5), bevel=0.05),
		tube([(-0.93, -0.1, 1.24), (0, -0.1, 0.62), (0.93, -0.1, 1.24)], 0.025, mat(GREY, 0.4)),
		card,
	]
	e = group(objs, rot=(-0.22, 0, 0.3))

	def anim(u):
		# the card slips back in and comes out again
		card.location.z = 0.6 - 0.48 * (ease(seg(u, 0.05, 0.3)) - spring(seg(u, 0.4, 0.95), 5.0, 10.0))
		e.rotation_euler.z = 0.3 + 0.06 * math.sin(2 * math.pi * u)
	return anim


# ---- the sections of the site: what stands in the header of /strumenti, /laboratorio, /zaino and /ripetizioni ----

def frame(outer, inner, depth, m, bevel=0.03):
	"""A flat shape with a hole, in the XZ plane, facing -Y: `inner` goes round the same way as `outer`, point for point."""
	me = bpy.data.meshes.new('frame')
	bm = bmesh.new()
	a = [bm.verts.new((x, 0, z)) for x, z in outer]
	b = [bm.verts.new((x, 0, z)) for x, z in inner]
	for i in range(len(a)):
		j = (i + 1) % len(a)
		bm.faces.new([a[i], a[j], b[j], b[i]])
	bm.to_mesh(me)
	bm.free()
	o = bpy.data.objects.new('frame', me)
	bpy.context.collection.objects.link(o)
	s = o.modifiers.new('solid', 'SOLIDIFY')
	s.thickness, s.offset = depth, 0
	return fin(o, m, bevel)


def tools(t):
	red, blue = TONES['math'][0], TONES['physics'][0]
	# a calculator, leaning back: a screen and nine keys, one of them the equals
	parts = [
		box((1.2, 0.24, 1.8), (0, 0, 0.9), mat(INK), bevel=0.1),
		box((0.92, 0.06, 0.4), (0, -0.12, 1.42), mat(TONES['chemistry'][1], 0.25), bevel=0.03),
	]
	for r in range(3):
		for c in range(3):
			parts.append(box((0.26, 0.12, 0.26), (-0.33 + 0.33 * c, -0.13, 0.98 - 0.33 * r), mat(YELLOW if (r, c) == (2, 2) else PAPER), bevel=0.05))
	calc = pivot(parts, (0, 0, 0))
	group([calc], rot=(-0.2, 0, 0.3), loc=(-0.5, -0.1, 0))
	# a set square, standing on its short side behind it
	square = pivot([frame([(0, 0), (1.5, 0), (0, 2.2)], [(0.27, 0.27), (0.9, 0.27), (0.27, 1.19)], 0.11, mat(YELLOW))], (0, 0, 0))
	group([square], rot=(0, 0, 0.55), loc=(0.0, 0.45, 0))
	# a protractor, standing on its straight side in front
	N, R = 48, 0.82
	arc = [math.pi * i / N for i in range(N + 1)]
	half = pivot([frame([(R * math.cos(a), R * math.sin(a)) for a in arc], [(0.5 * math.cos(a), 0.2 + 0.43 * math.sin(a)) for a in arc], 0.11, mat(blue))], (0, 0, 0))
	group([half], rot=(0, 0, 0.5), loc=(0.72, -0.5, 0))
	calc.name, square.name, half.name = 'part-calculator', 'part-square', 'part-protractor'

	typed = [parts[2 + 3 * r + c] for r, c in ((0, 0), (1, 1), (0, 2), (2, 2))]

	def anim(u):
		# a sum is typed, the equals last; the set square slides out along its base to measure and comes back; the protractor turns once
		for i, k in enumerate(typed):
			k.location.y = -0.13 + 0.07 * math.sin(math.pi * seg(u, 0.04 + 0.09 * i, 0.16 + 0.09 * i)) ** 2
		s = 1 + 0.05 * pop(seg(u, 0.4, 0.8))
		calc.scale = (s, s, s)
		square.location.x = 0.4 * (spring(seg(u, 0.3, 0.62), 5.0, 9.0) - spring(seg(u, 0.62, 0.96), 5.5, 11.0))
		half.rotation_euler.z = 2 * math.pi * ease(seg(u, 0.45, 0.95))
		half.location.z = 0.12 * math.sin(math.pi * seg(u, 0.45, 0.95))
	return anim


def burner(t):
	blue, light, metal = TONES['physics'][0], TONES['physics'][1], mat(GREY, 0.25, metal=1.0, coat=0)
	# a gas burner under a stand
	cyl(0.5, 0.18, (0, 0, 0.09), mat(INK), bevel=0.06)
	cyl(0.17, 0.46, (0, 0, 0.4), metal, bevel=0.04)
	torus(0.18, 0.06, (0, 0, 0.36), mat(INK))
	flame = pivot([sph(0.19, (0, 0, 0.76), mat(TONES['cs'][0], 0.3)), cone(0.185, 0.36, (0, 0, 0.96), mat(TONES['cs'][0], 0.3), bevel=0)], (0, 0, 0.63))
	top = 1.48  # where the beaker stands
	cyl(0.58, 0.08, (0, 0, top - 0.04), metal, bevel=0.03)
	for deg in (6.5, 126.5, 246.5):  # the gap between two legs faces the camera, so the flame shows
		a = math.radians(deg)
		rod((0.48 * math.cos(a), 0.48 * math.sin(a), top - 0.06), (0.86 * math.cos(a), 0.86 * math.sin(a), 0.06), 0.07, mat(INK))
	# the beaker: the copper sulfate is its lower band, as the liquid of the flask is, with three marks on the glass
	glass, r, surf = mat(PAPER, 0.3), 0.48, top + 1.0
	cyl(r, 0.52, (0, 0, top + 0.26), mat(blue), bevel=0.06)
	cyl(r, 0.5, (0, 0, top + 0.75), glass, bevel=0.02)
	torus(r + 0.01, 0.055, (0, 0, surf), glass)
	cyl(r - 0.07, 0.03, (0, 0, surf), mat(light, 0.3), bevel=0)
	face = math.atan2(-1.35, 1.0) - 0.45
	for k in range(3):
		box((0.2 if k == 1 else 0.13, 0.03, 0.04), (r * math.cos(face), r * math.sin(face), top + 0.62 + 0.12 * k), mat(INK), rot=(0, 0, face + math.pi / 2), bevel=0.01)
	# a thermometer leaning on the rim: a tube of clear glass with the red column inside it, which grows from its foot
	at, lean = (0.35, 0, surf), 0.42
	clear = mat(TONES['physics'][1], 0.12, coat=0.6)
	next(n for n in clear.node_tree.nodes if n.type == 'BSDF_PRINCIPLED').inputs['Alpha'].default_value = 0.22
	column = pivot([cyl(0.058, 0.75, (at[0], 0, surf - 0.025), mat(TONES['math'][0]), bevel=0.02)], (at[0], 0, surf - 0.4))
	thermo = pivot([cyl(0.1, 1.45, (at[0], 0, surf + 0.225), clear, bevel=0.03), sph(0.1, (at[0], 0, surf + 0.95), clear), column], at)
	spots = [(0.08, -0.2, 0.19), (-0.26, -0.1, 0.15), (-0.05, 0.24, 0.16), (-0.18, 0.12, 0.12), (-0.08, -0.3, 0.14)]
	bubbles = [sph(size, (0, 0, 0), mat(light if i % 2 else blue, 0.3)) for i, (x, y, size) in enumerate(spots)]
	flame.name, thermo.name, column.name = 'part-flame', 'part-thermometer', 'part-column'
	for i, o in enumerate(bubbles):
		o.name = 'part-bubble-%d' % i

	def anim(u):
		# the flame goes up, the column climbs, the water boils and shakes the thermometer; then the flame goes down and it all settles
		fire = ease(seg(u, 0.04, 0.16)) * (1 - ease(seg(u, 0.6, 0.72)))
		heat = ease(seg(u, 0.1, 0.5)) * (1 - ease(seg(u, 0.68, 0.96)))
		boil = ease(seg(u, 0.3, 0.44)) * (1 - ease(seg(u, 0.68, 0.86)))
		flick = math.sin(18 * math.pi * u) * (0.3 + fire) * math.sin(math.pi * u)
		flame.scale = (1 + 0.15 * fire, 1 + 0.15 * fire, 1 + 0.38 * fire + 0.07 * flick)
		column.scale = (1, 1, 1 + 0.6 * heat)
		thermo.rotation_euler = (0.045 * boil * math.sin(22 * math.pi * u + 1), lean + 0.04 * boil * math.sin(28 * math.pi * u), 0)
		thermo.location = (at[0], at[1], surf + 0.015 * boil * math.sin(14 * math.pi * u))
		for i, (o, (x, y, size)) in enumerate(zip(bubbles, spots)):
			# each bubble swells as it leaves the surface and is gone a little above it; they take turns
			p = (6 * u + i / len(spots)) % 1
			k = max(boil * math.sin(math.pi * p) ** 0.6, 0.001)
			o.location, o.scale = (x, y, surf + 0.06 + 0.6 * p), (k, k, k)
	anim.frames = 120
	return anim


ICONS = {
	'section-strumenti': (tools, 'ink'),
	'section-laboratori': (burner, 'ink'),
	# the same objects as the student and the tutor of the onboarding, under the names of their pages
	'section-zaino': (backpack, 'ink'),
	'section-ripetizioni': (bulb, 'ink'),
	'level-middle_school': (level_middle, 'ink'),
	'level-high_school': (level_high, 'ink'),
	'level-university': (level_university, 'ink'),
	'middle_school-math': (solids, 'math'),
	'middle_school-technology': (gears, 'cs'),
	'middle_school-science': (dna, 'chemistry'),
	'high_school-math': (compass, 'math'),
	'high_school-physics': (cradle, 'physics'),
	'high_school-computer-science': (keys, 'cs'),
	'high_school-chemistry': (flask, 'chemistry'),
	'university-analisi-1': (infinity, 'math'),
	'university-analisi-2': (saddle, 'math'),
	'university-metodi-matematici': (epicycles, 'math'),
	'university-geometria-algebra-lineare': (basis, 'math'),
	'university-fisica-1': (gyro, 'physics'),
	'university-fisica-2': (magnet, 'physics'),
	'university-chimica': (benzene, 'chemistry'),
	'university-fondamenti-informatica': (chip, 'cs'),
	'university-ia-classica': (tree, 'ink'),
	'university-machine-learning': (scatter, 'ink'),
	'university-deep-learning': (layers, 'ink'),
	'university-modelli-linguistici': (bubble, 'ink'),
	'university-agenti-ia': (agents, 'ink'),
	'university-ia-responsabile': (shield, 'ink'),
	'onboarding-student': (backpack, 'ink'),
	'onboarding-parent': (house, 'ink'),
	'onboarding-tutor': (bulb, 'ink'),
	'onboarding-teacher': (blackboard, 'ink'),
	'onboarding-school': (school, 'ink'),
	'onboarding-email': (envelope, 'ink'),
}


def corners_now(sc):
	bpy.context.view_layer.update()
	dg = bpy.context.evaluated_depsgraph_get()
	out = []
	for o in sc.objects:
		if o.type not in ('MESH', 'CURVE', 'FONT'):
			continue
		e = o.evaluated_get(dg)
		if o.type == 'CURVE':
			# the bounding box of a thin curve is padded: take its points and its radius
			r = o.data.bevel_depth * max(abs(v) for v in e.matrix_world.to_scale())
			for sp in o.data.splines:
				for p in sp.points:
					w = e.matrix_world @ Vector(p.co[:3])
					out += [w + Vector(v) * r for v in ((1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1))]
		else:
			out += [e.matrix_world @ Vector(c) for c in e.bound_box]
	return out


def sun(direction, strength, angle, color=(1, 1, 1)):
	l = bpy.data.lights.new('sun', 'SUN')
	l.energy, l.angle, l.color = strength, math.radians(angle), color
	o = bpy.data.objects.new('sun', l)
	o.rotation_euler = Vector(direction).normalized().to_track_quat('Z', 'Y').to_euler()
	bpy.context.collection.objects.link(o)


def render(name):
	build, tone = ICONS[name]
	bpy.ops.wm.read_factory_settings(use_empty=True)
	sc = bpy.context.scene
	anim = build(TONES[tone])
	if MODE == 'glb':
		# the model alone, at rest, for the pages that draw it live (src/components/onboarding/stage-engine.ts):
		# modifiers and curves become meshes, the empties keep their names so the page can move the parts
		anim(0)
		for o in bpy.data.objects:
			if o.name.startswith('part-swing-'):
				o.rotation_euler.y = 0
		bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, name + '.glb'), export_format='GLB', export_apply=True, export_yup=True, export_cameras=False, export_lights=False, export_animations=False)
		return
	# the picture holds the whole loop, so the still and the frames share one camera
	rest = None
	corners = []
	# a loop of its own length (`anim.frames`) is sampled as finely as the usual one
	frames = getattr(anim, 'frames', FRAMES)
	steps = 16 * frames // FRAMES
	for k in range(steps):
		anim(k / steps)
		cs = corners_now(sc)
		rest = rest or cs
		corners += cs
	anim(0)
	ground = min(c.z for c in rest)
	lo = Vector([min(c[i] for c in corners) for i in range(3)])
	hi = Vector([max(c[i] for c in corners) for i in range(3)])
	# the ground, which only catches the shadow
	bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, ground - 0.001))
	bpy.context.object.is_shadow_catcher = True
	# camera
	d = Vector((1.0, -1.35, 0.95)).normalized()
	q = d.to_track_quat('Z', 'Y')
	right, up = q @ Vector((1, 0, 0)), q @ Vector((0, 1, 0))
	xs, ys = [c.dot(right) for c in corners], [c.dot(up) for c in corners]
	centre = right * (min(xs) + max(xs)) / 2 + up * (min(ys) + max(ys)) / 2 + d * ((lo + hi) / 2).dot(d)
	cam = bpy.data.cameras.new('cam')
	cam.type, cam.ortho_scale = 'ORTHO', max(max(xs) - min(xs), max(ys) - min(ys)) * 1.24
	co = bpy.data.objects.new('cam', cam)
	co.location, co.rotation_euler = centre + d * 30, q.to_euler()
	sc.collection.objects.link(co)
	sc.camera = co
	# light
	sun((-0.42, -0.4, 1.0), 3.3, 34)
	sun((1.0, -0.3, 0.35), 0.9, 70, (0.9, 0.94, 1.0))
	sun((0.3, 1.0, 0.7), 1.6, 40)
	w = bpy.data.worlds.new('w')
	w.use_nodes = True
	bg = next(n for n in w.node_tree.nodes if n.type == 'BACKGROUND')
	bg.inputs[0].default_value, bg.inputs[1].default_value = (1, 1, 1, 1), 0.5
	sc.world = w
	# render
	sc.render.engine = 'CYCLES'
	try:
		prefs = bpy.context.preferences.addons['cycles'].preferences
		prefs.compute_device_type = 'METAL'
		prefs.get_devices()
		for dev in prefs.devices:
			dev.use = True
		sc.cycles.device = 'CPU' if os.environ.get('CYCLES_CPU') else 'GPU'
	except Exception as e:
		print('gpu unavailable', e)
	sc.cycles.use_denoising = True
	sc.render.film_transparent = True
	sc.render.resolution_percentage = 100
	sc.view_settings.view_transform = 'Standard'
	try:
		sc.view_settings.look = 'Medium High Contrast'
	except Exception:
		pass
	sc.render.image_settings.file_format, sc.render.image_settings.color_mode = 'PNG', 'RGBA'
	if MODE in ('still', 'both'):
		sc.cycles.samples = 128
		sc.render.resolution_x = sc.render.resolution_y = SIZE
		sc.render.filepath = os.path.join(OUT, name + '.png')
		bpy.ops.render.render(write_still=True)
	if MODE in ('frames', 'both'):
		# few samples and short paths: the denoiser does the rest on these matte objects
		sc.cycles.samples, sc.cycles.adaptive_threshold, sc.cycles.max_bounces = 24, 0.05, 4
		sc.render.resolution_x = sc.render.resolution_y = FRAME_SIZE
		# one render session for the whole loop: the handler poses the object at each frame
		sc.render.use_persistent_data = True
		sc.frame_start, sc.frame_end = 0, frames - 1
		bpy.app.handlers.frame_change_pre.clear()
		bpy.app.handlers.frame_change_pre.append(lambda scene, *_: anim(scene.frame_current / frames))
		sc.render.filepath = os.path.join(OUT, 'frames', name, '')
		bpy.ops.render.render(animation=True)
		bpy.app.handlers.frame_change_pre.clear()


for name in ICONS:
	if ONLY and name not in ONLY:
		continue
	# a loop already rendered whole is not rendered again, unless REDO is set
	done = os.path.join(OUT, 'frames', name)
	if MODE == 'frames' and not os.environ.get('REDO') and os.path.isdir(done) and len(os.listdir(done)) >= FRAMES:
		print('SKIP', name)
		continue
	try:
		render(name)
		print('OK', name)
	except Exception:
		print('FAIL', name)
		traceback.print_exc()
