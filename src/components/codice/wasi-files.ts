import type { Changes } from './runtime';

/**
 * The disk of a compiled C or C++ program (wasi.ts): the files of its project, in memory, behind the calls of WASI
 * that the C library makes for `fopen`, `ifstream`, `remove` and the like. The program starts in the project's
 * folder, the only one it is given (the preopened directory, descriptor 3), so `"dati.txt"`, `"./dati.txt"` and
 * `"/dati.txt"` are the same file.
 *
 * A disk lasts one run: it is made from the files the editor has, and what the program wrote is read from it at the
 * end (`changes`). A rerun for a line typed at the keyboard starts from the same files, so a program that reads and
 * then appends does not append twice.
 */

const OK = 0;
const EBADF = 8;
const EEXIST = 20;
const EFBIG = 22;
const EINVAL = 28;
const EISDIR = 31;
const ENOENT = 44;
const ENOSPC = 51;
const ENOTDIR = 54;
const ENOTEMPTY = 55;
const ENOTCAPABLE = 76;

/** path_open's `oflags`, and the rights that say whether the file is opened to read or to write. */
const O_CREAT = 1;
const O_DIRECTORY = 2;
const O_EXCL = 4;
const O_TRUNC = 8;
const RIGHT_READ = BigInt(1 << 1);
const RIGHT_WRITE = BigInt(1 << 6);
const APPEND = 1;
const DIRECTORY = 3;
const REGULAR = 4;

/** The project's folder is the first descriptor after the three streams. */
export const ROOT = 3;
/** A file a program writes grows to this many bytes, and a disk holds this many files: a loop that never ends stops here. */
export const MAX_FILE = 2_000_000;
const MAX_NODES = 200;

/** `bytes` may be longer than the file; it is the project's own array until the program writes (`dirty`). */
interface Node {
	bytes: Uint8Array;
	size: number;
	dirty: boolean;
}

type Open = { node: Node; at: number; append: boolean; read: boolean; write: boolean } | { folder: string };

type Call = (...args: number[]) => number;

const encoder = new TextEncoder();

/** A file of the project as bytes: a picture is the data URL of its own. */
function encode(text: string): Uint8Array {
	const data = /^data:[^,]*;base64,(.*)$/.exec(text);
	return data ? Uint8Array.from(atob(data[1]), (c) => c.charCodeAt(0)) : encoder.encode(text);
}

/** What a program wrote as the text the editor shows; null when it is not text. */
export function asText(bytes: Uint8Array): string | null {
	try {
		const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
		return text.includes('\0') ? null : text;
	} catch {
		return null;
	}
}

const parent = (path: string) => path.split('/').slice(0, -1).join('/');
const same = (a: Uint8Array, b: Uint8Array) => a.length === b.length && a.every((byte, i) => byte === b[i]);

export function disk(files: Record<string, string> | undefined, memory: () => WebAssembly.Memory): { calls: Record<string, Call>; changes: () => Changes } {
	// paths have no slash at their start; the project's folder is ''
	const nodes = new Map<string, Node>();
	const folders = new Set<string>(['']);
	const initial = new Map<string, Uint8Array>();
	for (const [path, text] of Object.entries(files ?? {})) {
		const folder = path.endsWith('/') ? path.slice(0, -1) : parent(path);
		for (let at = folder; at; at = parent(at)) folders.add(at);
		if (path.endsWith('/')) continue;
		const bytes = encode(text);
		initial.set(path, bytes);
		nodes.set(path, { bytes, size: bytes.length, dirty: false });
	}
	const given = new Set(folders);

	const open = new Map<number, Open>([[ROOT, { folder: '' }]]);
	let descriptors = ROOT;

	const view = () => new DataView(memory().buffer);
	const bytes = (pointer: number, length: number) => new Uint8Array(memory().buffer, pointer, length);
	const decoder = new TextDecoder();

	/** A path the program wrote, from the folder of `fd`; a number is why it cannot be followed. */
	const resolve = (fd: number, pointer: number, length: number): string | number => {
		const from = open.get(fd);
		if (!from) return EBADF;
		if (!('folder' in from)) return ENOTDIR;
		const written = decoder.decode(bytes(pointer, length).slice());
		const parts = written.startsWith('/') || !from.folder ? [] : from.folder.split('/');
		for (const part of written.split('/')) {
			if (part === '' || part === '.') continue;
			if (part === '..') {
				// the project's folder is all the program has
				if (parts.length === 0) return ENOTCAPABLE;
				parts.pop();
			} else parts.push(part);
		}
		return parts.join('/');
	};

	const file = (fd: number) => {
		const entry = open.get(fd);
		return entry && 'node' in entry ? entry : null;
	};

	/** Makes room for `size` bytes in a file that is about to change; false when it would be too long. */
	const grow = (node: Node, size: number): boolean => {
		if (size > MAX_FILE) return false;
		if (!node.dirty || size > node.bytes.length) {
			const longer = new Uint8Array(Math.max(size, node.dirty ? node.bytes.length * 2 : node.size, 256));
			longer.set(node.bytes.subarray(0, node.size));
			node.bytes = longer;
		}
		node.dirty = true;
		return true;
	};

	const resize = (node: Node, size: number): boolean => {
		if (!grow(node, size)) return false;
		// what is cut away must not come back when the file grows again
		if (size < node.size) node.bytes.fill(0, size, node.size);
		node.size = size;
		return true;
	};

	/** Reads into the program's buffers from `at`; answers how many bytes. */
	const read = (node: Node, at: number, iovs: number, count: number): number => {
		let total = 0;
		for (let i = 0; i < count && at + total < node.size; i++) {
			const pointer = view().getUint32(iovs + 8 * i, true);
			const length = Math.min(view().getUint32(iovs + 8 * i + 4, true), node.size - at - total);
			bytes(pointer, length).set(node.bytes.subarray(at + total, at + total + length));
			total += length;
		}
		return total;
	};

	/** Writes the program's buffers at `at`; answers how many bytes, or -1 when the file would be too long. */
	const write = (node: Node, at: number, iovs: number, count: number): number => {
		let total = 0;
		for (let i = 0; i < count; i++) total += view().getUint32(iovs + 8 * i + 4, true);
		if (!grow(node, Math.max(node.size, at + total))) return -1;
		let to = at;
		for (let i = 0; i < count; i++) {
			const pointer = view().getUint32(iovs + 8 * i, true);
			const length = view().getUint32(iovs + 8 * i + 4, true);
			node.bytes.set(bytes(pointer, length), to);
			to += length;
		}
		node.size = Math.max(node.size, to);
		return total;
	};

	/** The `filestat` of a file or of a folder. */
	const stat = (pointer: number, node: Node | null) => {
		bytes(pointer, 64).fill(0);
		view().setUint8(pointer + 16, node ? REGULAR : DIRECTORY);
		view().setBigUint64(pointer + 24, BigInt(1), true);
		view().setBigUint64(pointer + 32, BigInt(node?.size ?? 0), true);
	};

	/** What is directly inside a folder: `[name, is a folder]`, in the order of their names. */
	const inside = (folder: string) => {
		const under = (path: string) => path !== '' && parent(path) === folder;
		const names: [string, boolean][] = [...folders].filter(under).map((path) => [path.slice(folder ? folder.length + 1 : 0), true]);
		for (const path of nodes.keys()) if (under(path)) names.push([path.slice(folder ? folder.length + 1 : 0), false]);
		return names.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
	};

	const calls: Record<string, Call> = {
		fd_prestat_get(fd, prestat) {
			if (fd !== ROOT) return EBADF;
			// a directory, with a name one byte long
			view().setUint32(prestat, 0, true);
			view().setUint32(prestat + 4, 1, true);
			return OK;
		},
		fd_prestat_dir_name(fd, pointer, length) {
			if (fd !== ROOT) return EBADF;
			if (length < 1) return EINVAL;
			view().setUint8(pointer, '/'.charCodeAt(0));
			return OK;
		},
		// the two rights are 64-bit numbers, which arrive as BigInt
		path_open(fd, _follow, pointer, length, oflags, rights, _inheriting, flags, opened) {
			const path = resolve(fd, pointer, length);
			if (typeof path === 'number') return path;
			const reads = (BigInt(rights) & RIGHT_READ) !== BigInt(0);
			const writes = (BigInt(rights) & RIGHT_WRITE) !== BigInt(0);
			let entry: Open;
			if (folders.has(path)) {
				if (writes || oflags & O_TRUNC) return EISDIR;
				if (oflags & O_CREAT && oflags & O_EXCL) return EEXIST;
				entry = { folder: path };
			} else {
				let node = nodes.get(path);
				if (oflags & O_DIRECTORY) return node ? ENOTDIR : ENOENT;
				if (node && oflags & O_CREAT && oflags & O_EXCL) return EEXIST;
				if (!node) {
					if (!(oflags & O_CREAT)) return ENOENT;
					if (!folders.has(parent(path))) return nodes.has(parent(path)) ? ENOTDIR : ENOENT;
					if (nodes.size >= MAX_NODES) return ENOSPC;
					node = { bytes: new Uint8Array(0), size: 0, dirty: true };
					nodes.set(path, node);
				}
				if (oflags & O_TRUNC) resize(node, 0);
				entry = { node, at: 0, append: (flags & APPEND) !== 0, read: reads, write: writes };
			}
			open.set(++descriptors, entry);
			view().setUint32(opened, descriptors, true);
			return OK;
		},
		fd_close: (fd) => (fd !== ROOT && open.delete(fd) ? OK : EBADF),
		fd_read(fd, iovs, count, done) {
			const entry = file(fd);
			if (!entry) return open.has(fd) ? EISDIR : EBADF;
			if (!entry.read) return EBADF;
			const total = read(entry.node, entry.at, iovs, count);
			entry.at += total;
			view().setUint32(done, total, true);
			return OK;
		},
		fd_pread(fd, iovs, count, offset, done) {
			const entry = file(fd);
			if (!entry?.read) return EBADF;
			view().setUint32(done, read(entry.node, Number(offset), iovs, count), true);
			return OK;
		},
		fd_write(fd, iovs, count, done) {
			const entry = file(fd);
			if (!entry?.write) return EBADF;
			if (entry.append) entry.at = entry.node.size;
			const total = write(entry.node, entry.at, iovs, count);
			if (total < 0) return EFBIG;
			entry.at += total;
			view().setUint32(done, total, true);
			return OK;
		},
		fd_pwrite(fd, iovs, count, offset, done) {
			const entry = file(fd);
			if (!entry?.write) return EBADF;
			const total = write(entry.node, Number(offset), iovs, count);
			if (total < 0) return EFBIG;
			view().setUint32(done, total, true);
			return OK;
		},
		// the offset is a 64-bit number
		fd_seek(fd, offset, whence, result) {
			const entry = file(fd);
			if (!entry) return EBADF;
			const to = Number(offset) + (whence === 0 ? 0 : whence === 1 ? entry.at : entry.node.size);
			if (whence > 2 || to < 0) return EINVAL;
			entry.at = to;
			view().setBigUint64(result, BigInt(to), true);
			return OK;
		},
		fd_tell(fd, result) {
			const entry = file(fd);
			if (!entry) return EBADF;
			view().setBigUint64(result, BigInt(entry.at), true);
			return OK;
		},
		fd_fdstat_get(fd, pointer) {
			const entry = open.get(fd);
			if (!entry) return EBADF;
			bytes(pointer, 24).fill(0);
			view().setUint8(pointer, 'node' in entry ? REGULAR : DIRECTORY);
			view().setUint16(pointer + 2, 'node' in entry && entry.append ? APPEND : 0, true);
			// every right, its own and of what is opened through it
			view().setBigUint64(pointer + 8, BigInt(0x1fffffff), true);
			view().setBigUint64(pointer + 16, BigInt(0x1fffffff), true);
			return OK;
		},
		fd_fdstat_set_flags(fd, flags) {
			const entry = file(fd);
			if (!entry) return EBADF;
			entry.append = (flags & APPEND) !== 0;
			return OK;
		},
		fd_filestat_get(fd, pointer) {
			const entry = open.get(fd);
			if (!entry) return EBADF;
			stat(pointer, 'node' in entry ? entry.node : null);
			return OK;
		},
		fd_filestat_set_size(fd, size) {
			const entry = file(fd);
			if (!entry?.write) return EBADF;
			return resize(entry.node, Number(size)) ? OK : EFBIG;
		},
		fd_sync: (fd) => (open.has(fd) ? OK : EBADF),
		fd_datasync: (fd) => (open.has(fd) ? OK : EBADF),
		fd_advise: (fd) => (open.has(fd) ? OK : EBADF),
		fd_readdir(fd, buffer, length, cookie, used) {
			const entry = open.get(fd);
			if (!entry) return EBADF;
			if (!('folder' in entry)) return ENOTDIR;
			const names = inside(entry.folder);
			let at = 0;
			for (let i = Number(cookie); i < names.length && at < length; i++) {
				const name = encoder.encode(names[i][0]);
				const record = new Uint8Array(24 + name.length);
				const fields = new DataView(record.buffer);
				fields.setBigUint64(0, BigInt(i + 1), true);
				fields.setUint32(16, name.length, true);
				fields.setUint8(20, names[i][1] ? DIRECTORY : REGULAR);
				record.set(name, 24);
				// a record that does not fit is cut: the library asks again from there with a longer buffer
				const fits = Math.min(record.length, length - at);
				bytes(buffer + at, fits).set(record.subarray(0, fits));
				at += fits;
			}
			view().setUint32(used, at, true);
			return OK;
		},
		path_filestat_get(fd, _follow, pointer, length, result) {
			const path = resolve(fd, pointer, length);
			if (typeof path === 'number') return path;
			const node = nodes.get(path);
			if (!node && !folders.has(path)) return ENOENT;
			stat(result, node ?? null);
			return OK;
		},
		path_unlink_file(fd, pointer, length) {
			const path = resolve(fd, pointer, length);
			if (typeof path === 'number') return path;
			if (folders.has(path)) return EISDIR;
			return nodes.delete(path) ? OK : ENOENT;
		},
		path_create_directory(fd, pointer, length) {
			const path = resolve(fd, pointer, length);
			if (typeof path === 'number') return path;
			if (folders.has(path) || nodes.has(path)) return EEXIST;
			if (!folders.has(parent(path))) return ENOENT;
			folders.add(path);
			return OK;
		},
		path_remove_directory(fd, pointer, length) {
			const path = resolve(fd, pointer, length);
			if (typeof path === 'number') return path;
			if (!folders.has(path)) return nodes.has(path) ? ENOTDIR : ENOENT;
			if (path === '') return ENOTCAPABLE;
			if (inside(path).length) return ENOTEMPTY;
			folders.delete(path);
			return OK;
		},
		path_rename(fd, pointer, length, toFd, toPointer, toLength) {
			const from = resolve(fd, pointer, length);
			if (typeof from === 'number') return from;
			const to = resolve(toFd, toPointer, toLength);
			if (typeof to === 'number') return to;
			if (!folders.has(parent(to))) return ENOENT;
			const node = nodes.get(from);
			if (node) {
				if (folders.has(to)) return EISDIR;
				nodes.delete(from);
				nodes.set(to, node);
				return OK;
			}
			if (!folders.has(from)) return ENOENT;
			if (from === '' || to === from || to.startsWith(`${from}/`)) return EINVAL;
			if (nodes.has(to)) return ENOTDIR;
			if (folders.has(to) && inside(to).length) return ENOTEMPTY;
			const moved = (path: string) => (path === from ? to : `${to}/${path.slice(from.length + 1)}`);
			const within = (path: string) => path === from || path.startsWith(`${from}/`);
			for (const path of [...folders].filter(within)) {
				folders.delete(path);
				folders.add(moved(path));
			}
			for (const [path, inner] of [...nodes].filter(([path]) => within(path))) {
				nodes.delete(path);
				nodes.set(moved(path), inner);
			}
			return OK;
		}
	};

	/** The files that are not as the project had them, the ones that are gone, and the new folders with nothing in them. */
	const changes = (): Changes => {
		const written: Changes['written'] = {};
		for (const [path, node] of nodes) {
			const now = node.bytes.subarray(0, node.size);
			const before = initial.get(path);
			if (before && same(now, before)) continue;
			written[path] = asText(now);
		}
		for (const folder of folders) if (!given.has(folder) && inside(folder).length === 0) written[`${folder}/`] = '';
		return { written, removed: [...initial.keys()].filter((path) => !nodes.has(path)) };
	};

	return { calls, changes };
}
