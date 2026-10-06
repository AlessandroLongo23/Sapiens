# Renders one object per subject for the subject cards of Sapiens: a still, and the
# frames of a loop that starts and ends on the still.
# Run: Blender -b --factory-startup -P icons.py -- <out dir> <still|frames|both> [id ...]
# Then: python3 scripts/materie/export.py <out dir>
import bpy, bmesh, math, sys, os, traceback
from mathutils import Vector, Matrix

ARGS = sys.argv[sys.argv.index('--') + 1:]
OUT, MODE, ONLY = ARGS[0], ARGS[1], ARGS[2:]
SIZE, FRAME_SIZE, FRAMES = 720, 480, 75  # the loop: 75 frames at 30 a second

PAPER, YELLOW, INK, GREY, PEN = '#ECE4D2', '#FFCB2E', '#27304D', '#C3CAD8', '#E11D48'
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


ICONS = {
	'level-middle_school': (level_middle, 'ink'),
	'level-high_school': (level_high, 'ink'),
	'level-university': (level_university, 'ink'),
	'middle_school-math': (solids, 'math'),
	'middle_school-technology': (gears, 'cs'),
	'middle_school-science': (dna, 'chemistry'),
	'high_school-math': (compass, 'math'),
	'high_school-physics': (cradle, 'physics'),
	'high_school-computer-science': (keys, 'cs'),
	'high_school-chemistry': (benzene, 'chemistry'),
	'university-analisi-1': (infinity, 'math'),
	'university-analisi-2': (saddle, 'math'),
	'university-fisica-1': (gyro, 'physics'),
	'university-fisica-2': (magnet, 'physics'),
	'university-fondamenti-informatica': (chip, 'cs'),
	'university-ia-classica': (tree, 'ink'),
	'university-machine-learning': (scatter, 'ink'),
	'university-deep-learning': (layers, 'ink'),
	'university-modelli-linguistici': (bubble, 'ink'),
	'university-agenti-ia': (agents, 'ink'),
	'university-ia-responsabile': (shield, 'ink'),
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
	# the picture holds the whole loop, so the still and the frames share one camera
	rest = None
	corners = []
	for k in range(16):
		anim(k / 16)
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
		sc.frame_start, sc.frame_end = 0, FRAMES - 1
		bpy.app.handlers.frame_change_pre.clear()
		bpy.app.handlers.frame_change_pre.append(lambda scene, *_: anim(scene.frame_current / FRAMES))
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
