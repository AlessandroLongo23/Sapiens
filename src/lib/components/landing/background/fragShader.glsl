#version 300 es
precision mediump float;

out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uOffset;
uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uOpacity;
uniform float uGrainAmount;
uniform float uGrainSize;
uniform bool uDark;

vec2 getTexCoord() {
    vec2 uv = (gl_FragCoord.xy + uOffset) / uResolution;
    uv.y = 1.0 - uv.y;
    return uv;
}
vec3 hash(vec3 p) {
    return fract(sin(p * 43758.5453123) * 43758.5453123);
}

float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float n = dot(i, vec3(1.0, 57.0, 113.0));
    float a = fract(sin(n + 0.0) * 43758.5453);
    float b = fract(sin(n + 1.0) * 43758.5453);
    float c = fract(sin(n + 57.0) * 43758.5453);
    float d = fract(sin(n + 58.0) * 43758.5453);
    float e = fract(sin(n + 113.0) * 43758.5453);
    float f1 = fract(sin(n + 114.0) * 43758.5453);
    float g = fract(sin(n + 170.0) * 43758.5453);
    float h = fract(sin(n + 171.0) * 43758.5453);

    float x1 = mix(a, b, f.x);
    float x2 = mix(c, d, f.x);
    float y1 = mix(e, f1, f.x);
    float y2 = mix(g, h, f.x);

    float z1 = mix(x1, x2, f.y);
    float z2 = mix(y1, y2, f.y);

    return mix(z1, z2, f.z);
}

float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 3; i++) {
        value += amplitude * noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

vec3 oklchToRgb(vec3 oklch) {
    float L = oklch.x;
    float C = oklch.y;
    float H = oklch.z / 360.0 * 2.0 * 3.14159265358979323846;
    
    float a = C * cos(H);
    float b = C * sin(H);
    
    float l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    float m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    float s_ = L - 0.0894841775 * a - 1.2914855480 * b;
    
    float l = l_ * l_ * l_;
    float m = m_ * m_ * m_;
    float s = s_ * s_ * s_;
    
    return vec3(
        +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    );
}

void main() {
    vec2 uv = getTexCoord();
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 centered = (uv - 0.5) * aspect;
    float luminosity = 0.42;
    float chroma = 0.08;
    float hue = 16.0;

    float time = uTime * uSpeed;
    float noiseValue = fbm(vec3(centered * 2.0, time));
    
    luminosity += noiseValue;

    float grain = (fract(sin(dot(centered, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 2.0;
    luminosity += grain * uGrainAmount * uGrainSize;
    if (uDark) {
        luminosity = 1.1 - luminosity;
        luminosity = clamp(luminosity, 0.40, 0.70);
        chroma = luminosity * 0.1;
    } else {
        luminosity = clamp(luminosity - 0.05, 0.60, 1.0);
    }

    vec3 color = oklchToRgb(vec3(luminosity, chroma, hue));
    
    fragColor = vec4(color, uOpacity);
}