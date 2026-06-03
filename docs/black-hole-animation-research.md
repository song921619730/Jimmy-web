# Black Hole Animation Research Notes

Date: 2026-06-03

Purpose: record the visual and technical research for rebuilding the portfolio background black-hole effect on a future branch.

## 1. Interstellar / Gargantua Visual Findings

Key references:

- DNEG, "Gravitational Lensing by Spinning Black Holes": https://www.dneg.com/news/gravitational-lensing-by-spinning-black-holes
- CERN Courier, "Building Gargantua": https://cerncourier.com/a/building-gargantua/
- Event Horizon Telescope FAQ on Interstellar realism: https://eventhorizontelescope.org/faq/how-realistic-are-movie-depictions-black-holes-eg-interstellar
- James, von Tunzelmann, Franklin, Thorne, "Gravitational Lensing by Spinning Black Holes in Astrophysics, and in the Movie Interstellar": https://arxiv.org/abs/1502.03808

Visual traits to preserve:

- Gargantua is not perceived as a normal spinning sphere. The movement comes from the camera/orbit, the accretion disk flow, and the warped background.
- The bright disk is a thin accretion disk. Gravity bends light from the far side so the same disk appears as a horizontal band plus arcs above and below the dark shadow.
- The black center is a shadow/event-horizon read, not just a flat black circle. It needs a thin photon-ring edge and lensing glow to avoid looking pasted on.
- Background stars and nebulae should visibly bend near the hole. DNEG describes light beams being stretched, squashed, temporarily trapped, and amplified into glittering patterns.
- In the film, Doppler asymmetry was intentionally reduced/removed for audience readability. A physically realistic disk would have one side brighter/bluer and the other dimmer/redder.
- Gargantua reads best when the ship or camera is small against the huge gravitational lens; the black hole dominates scale, while motion remains slow and heavy.

Flight/slingshot sequence notes:

- The Endurance uses Gargantua for a powered slingshot. Ranger 2 and Lander 1 act as expendable boosters; Cooper and TARS detach so Brand/CASE can escape toward Edmunds' planet.
- The visual effect is not "flying through a portal." It is skimming a massive lensing field: warped starfield, severe scale contrast, slow orbital perspective change, then loss of orientation near the event horizon.
- For a website background, do not animate a spacecraft unless it is extremely subtle. Better translation: let a small group of foreground stars drift past the lens and bend, implying the viewer/camera is moving.

## 2. Technical References Found

Open-source / implementation references:

- Eric Bruneton, "A Real-time High-quality Black Hole Shader": https://ebruneton.github.io/black_hole_shader
- Eric Bruneton GitHub repo, BSD license: https://github.com/ebruneton/black_hole_shader
- Dan Greenheck, "Raytracing a Black Hole with WebGPU": https://threejsroadmap.com/blog/raytracing-a-black-hole-with-webgpu
- dgreenheck WebGPU source: https://github.com/dgreenheck/webgpu-black-hole
- Singularity WebGPU showcase: https://www.webgpu.com/showcase/singularity
- Singularity source: https://github.com/MisterPrada/singularity
- Chris Matabaro black-hole simulation, MIT license: https://github.com/chrismatgit/black-hole-simulation
- Shadertoy example "Black hole with accretion disk": https://www.shadertoy.com/view/tsBXW3

Most useful references for our site:

- Bruneton is the strongest scientific/quality reference. It uses WebGL2, precomputed tables, beam tracing ideas, background stars, accretion disk shading, Doppler and beaming. It is probably too heavy to copy directly for a portfolio background, but it is the best reference for correctness and visual targets.
- Greenheck's WebGPU/Three.js article is the most implementable tutorial for a modern browser shader. It explains raymarching, disk intersection, temperature color, Doppler beaming, turbulence, and cyclic time.
- Singularity is a good aesthetic reference for a browser-native, shader-only "cosmic experiment." It suggests a fully fragment-shader approach can feel alive without mesh geometry.
- chrismatgit/black-hole-simulation is useful because it is React + TypeScript + Three.js + shader based, closer to this repo's stack, but should be treated as educational/reference rather than the final quality bar.

## 3. Implementation Strategy for Future Branch

Recommended direction:

- Build a dedicated `BlackHoleBackground` or `CosmicBackground` component with:
  - existing canvas starfield for low-cost stars and pointer dust;
  - a WebGL/Three.js shader layer for black-hole lensing and accretion disk;
  - CSS/GSAP only for noncritical ambient nebula opacity/position.
- Keep the black hole right-edge dominant, not centered. It should reveal only part of the event horizon and disk, with the main content area kept dark and readable.
- Use shader-based lensing for the black-hole region rather than CSS/SVG rings. CSS/SVG can create a graphic symbol, but it struggles to create convincing lensing and disk flow.
- Progressive enhancement:
  - Desktop: WebGL/WebGPU shader layer.
  - Mobile: simplified static/low-fps canvas or hidden black-hole shader.
  - `prefers-reduced-motion: reduce`: no continuous shader time updates; render a static frame or hide the shader.

Avoid:

- A full black circle pasted at the page edge.
- Thick neon rings or arcade-style glow.
- A centered black-hole hero effect that competes with the portfolio title.
- Per-particle GSAP animation.

## 4. Useful Math / Shader Model

These formulas are appropriate for a real-time visual approximation, not full scientific rendering.

Schwarzschild radius:

```text
rs = 2GM / c^2
```

In shader-friendly geometric units:

```text
G = c = 1
rs = 2M
```

Event horizon:

```text
if length(rayPos) < rs -> captured by black hole -> black/shadow
```

Approximate ray bending per raymarch step:

```text
u = normalize(-rayPos)
a = (rs / r^2) * u
rayDir = normalize(rayDir + a * stepSize * lensingStrength)
```

Thin disk plane crossing:

```text
crossed = prevPos.y * rayPos.y < 0
t = -prevPos.y / (rayPos.y - prevPos.y)
hitPos = mix(prevPos, rayPos, t)
hitR = sqrt(hitPos.x^2 + hitPos.z^2)
inDisk = hitR > innerR && hitR < outerR
```

Disk temperature falloff:

```text
T(r) = T_peak * (r_inner / r)^alpha
alpha ~= 0.75
```

Schwarzschild ISCO:

```text
ISCO = 3 * rs = 6M
```

For visual drama, tutorials sometimes set the disk inner edge closer than strict ISCO.

Keplerian velocity / rotation:

```text
v(r) proportional to r^(-1/2)
omega(r) = omega0 / r^(3/2)
phase = time * omega0 / pow(r, 1.5)
```

Doppler factor and beaming:

```text
D = 1 / (1 - beta * cos(theta))
I_observed = I_emitted * D^3
```

Use this subtly. Interstellar reduced Doppler asymmetry for readability; for this site, use a mild brightness difference, not a blue/red scientific demo.

Turbulent disk texture:

```text
angle = atan(hitPos.z, hitPos.x)
rotatedAngle = angle + time * rotationSpeed / pow(hitR, 1.5)
noiseCoord = vec3(
  hitR * turbulenceScale,
  cos(rotatedAngle) / turbulenceStretch,
  sin(rotatedAngle) / turbulenceStretch
)
turbulence = fbm(noiseCoord)
```

To avoid turbulence winding into thin spirals forever, use cyclic time with crossfade:

```text
cycle = mod(time, cycleLength)
blend = cycle / cycleLength
turbulence = mix(sampleAt(cycle + cycleLength), sampleAt(cycle), blend)
```

Alpha compositing for multiple disk crossings:

```text
remaining = 1 - alpha
color += diskColor * diskAlpha * remaining
alpha += diskAlpha * remaining
```

## 5. Practical Visual Spec for the Rebuild

Desktop black-hole layer:

- Position: right edge, partially offscreen, around upper-middle of viewport.
- Event horizon: small to medium black oval/circle with very thin rim; never a huge flat black disk.
- Accretion disk:
  - horizontal, thin, bright but low-saturation;
  - arcs above and below the hole;
  - inner edge slightly warm white/silver, outer areas cold blue-gray with tiny warm gold.
- Lensing:
  - distort stars/nebula around the hole into arcs;
  - allow a partial Einstein-ring look at the rim.
- Motion:
  - disk turbulence flows slowly using Keplerian phase;
  - lensing field subtly rotates/orbits;
  - background stars around the lens drift and bend.

Mobile:

- Hide the shader or render a static faint lens; keep particle density low.
- Do not spend GPU budget on real raymarching on mobile unless measured.

Reduced motion:

- Freeze shader `time`.
- Disable pointer dust and disk turbulence updates.
- Keep a single static, low-contrast frame.

## 6. Suggested Next-Branch Plan

1. Start a clean branch from `main`.
2. Rebuild the black-hole layer as a shader-first experiment in an isolated component.
3. Prototype with a small fixed-size WebGL canvas on the right edge before integrating with full-page background.
4. Implement a simplified raymarcher:
   - event horizon capture;
   - inverse-square ray bending;
   - thin disk plane intersection;
   - disk color/turbulence;
   - background star sampling with bent ray direction.
5. Add performance gates:
   - cap DPR to 1.5 or 2;
   - lower iterations based on viewport;
   - pause when tab hidden;
   - disable shader on mobile/reduced-motion.
6. Verify with screenshots at 1440x900, 390x844, modal open, and reduced-motion.

## 7. Search Log

Tavily was used for the follow-up research. Queries included:

- `Interstellar Gargantua black hole accretion disk gravitational lensing Double Negative Kip Thorne`
- `Interstellar spacecraft slingshot around Gargantua black hole scene visual effects`
- `DNEG Interstellar Gargantua black hole official case study accretion disk image`
- `open source black hole shader WebGL GLSL gravitational lensing accretion disk`
- `GitHub black hole shader GLSL accretion disk gravitational lensing`
- `Three.js black hole shader gravitational lensing example accretion disk`
- `black hole gravitational lensing shader math formula ray marching Schwarzschild accretion disk`

