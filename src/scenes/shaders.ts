export const NOISE_GLSL = /* glsl */ `
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = r * p * 2.03; a *= 0.5; }
  return v;
}
`

export const fogVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const fogFragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uDensity;
uniform float uSeed;
uniform float uScroll;
uniform vec2 uPointer;
uniform vec3 uColor;
${NOISE_GLSL}
void main() {
  vec2 p = (vUv - 0.5) * vec2(2.6, 1.5);
  float t = uTime * 0.018;
  vec2 flow = vec2(t + uSeed, -t * 0.55 + uScroll * 0.8);
  float n = fbm(p * 1.5 + flow);
  float n2 = noise(p * 4.0 - vec2(t * 2.0, uSeed) + n);
  float d = n * 0.75 + n2 * 0.25;
  float mask = smoothstep(1.05, 0.1, length(p * vec2(0.75, 1.2)));
  float frame = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x) * smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
  float pl = smoothstep(0.45, 0.0, distance(vUv, uPointer));
  float a = smoothstep(0.26, 0.9, d) * mask * frame * uDensity;
  vec3 col = uColor * (0.75 + pl * 0.55);
  gl_FragColor = vec4(col, a * (0.6 + pl * 0.35));
}
`

export const particleVertex = /* glsl */ `
attribute vec3 aTarget;
attribute vec4 aSeed; // x: délai, y: taille, z: libre (1) / formé (0), w: phase
uniform float uTime;
uniform float uForm;
uniform float uOpacity;
uniform float uPixelRatio;
uniform float uSize;
uniform float uScatter;
uniform vec3 uBounds;
varying float vAlpha;

void main() {
  float phase = aSeed.w * 6.2831;
  // Position flottante (poussière en suspension, remonte lentement)
  vec3 floating = position;
  floating.y = mod(position.y + uTime * 0.06 * (0.3 + aSeed.y) + uBounds.y, uBounds.y * 2.0) - uBounds.y + uBounds.z;
  floating += vec3(sin(uTime * 0.13 + phase), cos(uTime * 0.11 + phase * 1.3), sin(uTime * 0.09 + phase * 0.7)) * 0.35;

  float p = 0.0;
  if (aSeed.z < 0.5) {
    float delay = aSeed.x * 0.6;
    p = smoothstep(delay, delay + 0.4, uForm);
  }
  vec3 target = aTarget + (position - aTarget) * uScatter * 0.12;
  target += vec3(sin(uTime * 0.6 + phase), cos(uTime * 0.5 + phase), 0.0) * 0.012;
  // Trajectoire courbe pendant la formation
  vec3 arc = vec3(sin(phase) , 1.0, cos(phase)) * p * (1.0 - p) * 2.4;
  vec3 pos = mix(floating, target, p) + arc;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  float size = uSize * (0.45 + aSeed.y) * mix(1.0, 0.7, p);
  gl_PointSize = size * uPixelRatio * (24.0 / -mv.z);

  float yFade = aSeed.z > 0.5 ? smoothstep(0.0, 1.5, uBounds.y - abs(floating.y - uBounds.z)) : 1.0;
  float twinkle = 0.65 + 0.35 * sin(uTime * (0.6 + aSeed.y) + phase);
  vAlpha = uOpacity * yFade * twinkle * mix(0.45, 0.95, p);
}
`

export const particleFragment = /* glsl */ `
precision mediump float;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vec3(1.0, 0.975, 0.94), a * a * vAlpha);
}
`

export const lineVertex = /* glsl */ `
uniform float uCut;
varying float vReveal;
varying float vY;
void main() {
  vY = position.y;
  vReveal = smoothstep(uCut, uCut - 0.6, position.y);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const lineFragment = /* glsl */ `
precision mediump float;
uniform float uOpacity;
varying float vReveal;
varying float vY;
void main() {
  gl_FragColor = vec4(vec3(0.93, 0.91, 0.87), uOpacity * vReveal);
}
`

export const groundVertex = /* glsl */ `
varying vec2 vPos;
void main() {
  vPos = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const groundFragment = /* glsl */ `
precision highp float;
varying vec2 vPos;
uniform float uOpacity;
float gridLine(vec2 p, float scale) {
  vec2 g = abs(fract(p / scale - 0.5) - 0.5) / fwidth(p / scale);
  return 1.0 - min(min(g.x, g.y), 1.0);
}
void main() {
  float r = length(vPos);
  float fade = smoothstep(26.0, 2.0, r);
  float l = gridLine(vPos, 1.0) * 0.35 + gridLine(vPos, 5.0) * 0.65;
  gl_FragColor = vec4(vec3(0.85, 0.83, 0.8), l * fade * uOpacity);
}
`
