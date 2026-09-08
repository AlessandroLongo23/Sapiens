'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/lib/hooks/use-theme';
import { useReducedMotion } from '@/lib/hooks/use-media';
import fragment from './grain-shader';

const VERTEX = '#version 300 es\nin vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

/**
 * Decorative grainy background, drawn with WebGL. It costs seconds of
 * main-thread time on phones, so it starts once the page is idle and never
 * for visitors who asked for reduced motion.
 */
export function Grain({ grain = 0.08, speed = 0.3 }: { grain?: number; speed?: number }) {
	const [ready, setReady] = useState(false);
	const reduced = useReducedMotion();
	useEffect(() => {
		if (!('requestIdleCallback' in window)) {
			const t = setTimeout(() => setReady(true), 1500);
			return () => clearTimeout(t);
		}
		const id = window.requestIdleCallback(() => setReady(true), { timeout: 4000 });
		return () => window.cancelIdleCallback(id);
	}, []);
	if (!ready || reduced) return null;
	return <Canvas grain={grain} speed={speed} />;
}

function Canvas({ grain, speed }: { grain: number; speed: number }) {
	const ref = useRef<HTMLCanvasElement>(null);
	const [theme] = useTheme();
	const dark = useRef(false);
	useEffect(() => {
		dark.current = theme === 'dark';
	}, [theme]);

	useEffect(() => {
		const canvas = ref.current;
		const gl = canvas?.getContext('webgl2', { premultipliedAlpha: false });
		if (!canvas || !gl) return;
		const compile = (type: number, src: string) => {
			const s = gl.createShader(type)!;
			gl.shaderSource(s, src);
			gl.compileShader(s);
			return s;
		};
		const program = gl.createProgram()!;
		gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
		gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
		gl.linkProgram(program);
		gl.useProgram(program);
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
		const loc = gl.getAttribLocation(program, 'p');
		gl.enableVertexAttribArray(loc);
		gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
		const u = (name: string) => gl.getUniformLocation(program, name);
		gl.uniform1f(u('uGrainAmount'), grain);
		gl.uniform1f(u('uGrainSize'), 1);
		gl.uniform1f(u('uSpeed'), speed);
		gl.uniform2f(u('uOffset'), 0, 0);

		const resize = () => {
			const scale = Math.min(window.devicePixelRatio, 1.5) * 0.5;
			canvas.width = Math.round(canvas.clientWidth * scale);
			canvas.height = Math.round(canvas.clientHeight * scale);
			gl.viewport(0, 0, canvas.width, canvas.height);
			gl.uniform2f(u('uResolution'), canvas.width, canvas.height);
		};
		resize();
		window.addEventListener('resize', resize);
		let frame = 0;
		const start = performance.now();
		const draw = () => {
			gl.uniform1f(u('uTime'), (performance.now() - start) / 1000);
			gl.uniform1i(u('uDark'), dark.current ? 1 : 0);
			gl.uniform1f(u('uOpacity'), dark.current ? 0.8 : 0.32);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
			frame = requestAnimationFrame(draw);
		};
		draw();
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('resize', resize);
		};
	}, [grain, speed]);

	return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0 h-full w-full" aria-hidden="true" />;
}
