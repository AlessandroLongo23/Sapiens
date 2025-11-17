<script lang="ts">
    import { themeStore } from '$lib/components/ui/theme/theme';
    import { WebGlShader } from 'svader';
    import fragShaderSource from './fragShader.glsl?raw';

    interface Props {
        grain_amount?: number; // Controls the grain/noise intensity (0-1)
        grain_size?: number; // Controls the grain/noise size (0-1)
        speed?: number; // Animation speed
    }

    let { 
        grain_amount = 0.05,
        grain_size = 1.0,
        speed = 0.5
    }: Props = $props();

    // Compute colors based on theme
    const colors = $derived.by(() => {
        let isDark = $themeStore === 'dark' as const;

        // Pink gradient colors in OKLCH format
        // OKLCH: [Lightness (0-1), Chroma (0-0.4), Hue (radians)]
        // Pink hues are around 340-360 degrees = 5.93-6.28 radians
        
        // Color 1: Light pink (center)
        const color1: readonly [number, number, number] = isDark 
            ? [0.42, 0.10, 5.93] as const
            : [0.75, 0.15, 5.93] as const;
        
        // Color 2: Medium pink
        const color2: readonly [number, number, number] = isDark
            ? [0.32, 0.08, 6.00] as const
            : [0.70, 0.18, 6.00] as const;
        
        // Color 3: Deeper pink/magenta
        const color3: readonly [number, number, number] = isDark
            ? [0.22, 0.07, 6.08] as const
            : [0.65, 0.20, 6.10] as const;

        const opacity = isDark ? 0.80 : 0.32;

        return { color1, color2, color3, opacity, isDark };
    });

    const parameters = $derived.by(() => {
        return [
            { name: 'uResolution', type: 'vec2', value: 'resolution' as const },
            { name: 'uOffset', type: 'vec2', value: 'offset' as const },
            { name: 'uTime', type: 'float', value: 'time' as const },
            { name: 'uGrainAmount', type: 'float', value: grain_amount },
            { name: 'uGrainSize', type: 'float', value: grain_size },
            { name: 'uSpeed', type: 'float', value: speed },
            { name: 'uColor1', type: 'vec3', value: colors.color1 },
            { name: 'uColor2', type: 'vec3', value: colors.color2 },
            { name: 'uColor3', type: 'vec3', value: colors.color3 },
            { name: 'uOpacity', type: 'float', value: colors.opacity },
            { name: 'uDark', type: 'float', value: colors.isDark ? 1.0 : 0.0 }
        ] as const;
    });
</script>

<div class="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
    <WebGlShader
        code={fragShaderSource}
        parameters={parameters}
        width="100%"
        height="100%"
    />
</div>