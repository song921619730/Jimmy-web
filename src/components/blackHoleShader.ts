export const blackHoleVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const blackHoleFragmentShader = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uDpr;
uniform vec2 uPointer;
uniform float uReducedMotion;
uniform vec2 uLensCenter;
uniform float uLensStrength;
uniform float uDiskOpacity;

varying vec2 vUv;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotate = mat2(0.8, -0.6, 0.6, 0.8);

  for (int i = 0; i < 5; i++) {
    value += noise(p) * amplitude;
    p = rotate * p * 2.03 + 11.7;
    amplitude *= 0.5;
  }

  return value;
}

float starSample(vec2 uv, float scale, float threshold) {
  vec2 grid = uv * scale;
  vec2 cell = floor(grid);
  vec2 local = fract(grid) - 0.5;
  float seed = hash12(cell);
  vec2 offset = vec2(hash12(cell + 17.13), hash12(cell + 41.71)) - 0.5;
  float size = mix(0.05, 0.22, hash12(cell + 3.19));
  float d = length(local - offset * 0.62);
  float star = smoothstep(size, 0.0, d);
  float presence = smoothstep(threshold, min(threshold + 0.024, 0.999), seed);
  return star * presence * mix(0.42, 0.92, hash12(cell + 8.8));
}

float orbitalStreakSample(vec2 uv, vec2 center, float aspect, float scale, float threshold) {
  vec2 grid = uv * scale;
  vec2 cell = floor(grid);
  vec2 offset = vec2(hash12(cell + 17.13), hash12(cell + 41.71)) - 0.5;
  vec2 local = fract(grid) - 0.5 - offset * 0.56;
  float seed = hash12(cell + 91.27);
  vec2 cellUv = (cell + 0.5 + offset * 0.56) / scale;
  vec2 cellP = vec2((cellUv.x - center.x) * aspect, cellUv.y - center.y);
  vec2 cellRadial = normalize(cellP + vec2(0.0001));
  vec2 cellTangent = normalize(vec2(-cellRadial.y / max(aspect, 0.001), cellRadial.x));
  vec2 cellNormal = vec2(-cellTangent.y, cellTangent.x);
  float streakLength = mix(0.12, 0.32, hash12(cell + 7.49));
  float width = mix(0.018, 0.038, hash12(cell + 29.84));
  float along = dot(local, cellTangent);
  float across = dot(local, cellNormal);
  float d = length(vec2(max(abs(along) - streakLength, 0.0), across));
  float streak = smoothstep(width + 0.014, 0.0, d);
  float presence = smoothstep(threshold, min(threshold + 0.045, 0.999), seed);
  return streak * presence * mix(0.32, 0.82, hash12(cell + 13.61));
}

vec3 diskPalette(float radialHeat, float turbulence, float doppler) {
  vec3 cold = vec3(0.28, 0.43, 0.50);
  vec3 silver = vec3(0.74, 0.82, 0.84);
  vec3 warm = vec3(0.86, 0.78, 0.50);
  vec3 whiteHot = vec3(0.92, 0.96, 0.95);
  vec3 base = mix(cold, silver, smoothstep(0.12, 0.72, radialHeat));
  base = mix(base, warm, smoothstep(0.52, 0.95, turbulence) * 0.28);
  base = mix(base, whiteHot, smoothstep(0.76, 1.0, radialHeat) * 0.38);
  return base * doppler;
}

void main() {
  vec2 uv = gl_FragCoord.xy / max(uResolution.xy, vec2(1.0));
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 center = uLensCenter;
  vec2 p = vec2((uv.x - center.x) * aspect, uv.y - center.y);
  float r = length(p);
  vec2 radial = p / max(r, 0.0001);
  vec2 tangent = vec2(-radial.y, radial.x);
  float polarAngle = atan(p.y, p.x);
  float motionTime = uTime * (1.0 - uReducedMotion);
  float lensPulse = 1.0 + sin(motionTime * 0.34) * 0.045 + sin(motionTime * 0.11 + 1.8) * 0.025;
  float rightFade = smoothstep(0.54, 0.76, uv.x);
  float diskRightFade = smoothstep(0.60, 0.78, uv.x);
  float edgeFade = smoothstep(0.06, 0.18, uv.y) * (1.0 - smoothstep(0.76, 0.97, uv.y));
  float lensFalloff = exp(-r * (3.08 + sin(motionTime * 0.18) * 0.12)) * rightFade * edgeFade;

  float pointerInfluence = 0.0;
  if (uPointer.x >= 0.0) {
    pointerInfluence = exp(-distance(uv, uPointer) * 18.0) * (1.0 - uReducedMotion);
  }

  float bend = (0.016 + pointerInfluence * 0.004) * uLensStrength * lensPulse / (r * r + 0.018);
  float shear = sin(polarAngle * 2.0 + motionTime * 0.22) * 0.009 * lensFalloff;
  vec2 bentUv = uv - radial * bend / vec2(aspect, 1.0) + tangent * shear / vec2(aspect, 1.0);
  bentUv.x += (0.012 + sin(motionTime * 0.15 + p.y * 8.0) * 0.002) * lensFalloff;

  float stars = 0.0;
  stars += starSample(bentUv + vec2(motionTime * 0.0032, -motionTime * 0.0014), 92.0, 0.970);
  stars += starSample(bentUv * vec2(1.35, 0.85) + vec2(31.1 + motionTime * 0.002, 9.7), 168.0, 0.984) * 0.68;
  stars += starSample(bentUv * vec2(0.9, 1.18) + vec2(18.4, 44.2 - motionTime * 0.0006), 132.0, 0.986) * 0.46;
  float arcBoost = exp(-abs(r - 0.28) * 14.0) * (0.32 + 0.68 * abs(dot(tangent, vec2(1.0, 0.0))));
  float streaks = 0.0;
  streaks += orbitalStreakSample(bentUv + vec2(motionTime * 0.00055, -motionTime * 0.00025), center, aspect, 124.0, 0.944);
  streaks += orbitalStreakSample(bentUv * vec2(1.2, 0.92) + vec2(22.8 - motionTime * 0.00034, 7.6), center, aspect, 154.0, 0.962) * 0.62;
  float streakFocus = lensFalloff * 1.05 + exp(-abs(r - 0.32) * 8.5) * 0.88 + exp(-abs(r - 0.52) * 5.8) * 0.22;
  streaks *= streakFocus * rightFade * edgeFade;
  stars *= (0.34 + lensFalloff * 1.32 + arcBoost * rightFade * 1.2);
  stars += streaks * 0.64;
  vec3 starColor = mix(vec3(0.46, 0.60, 0.66), vec3(0.84, 0.90, 0.91), clamp(stars * 2.3, 0.0, 1.0));

  vec3 origin = vec3(0.0, 0.16, 3.05);
  vec3 dir = normalize(vec3(p.x * 1.18, p.y * 0.78 - 0.055, -1.72));
  vec3 pos = origin;
  vec3 previous = pos;
  float rs = 0.225;
  float innerR = 0.34;
  float outerR = 1.54;
  float minR = 10.0;
  float captured = 0.0;
  vec3 diskColor = vec3(0.0);
  float diskAlpha = 0.0;

  for (int i = 0; i < 58; i++) {
    previous = pos;
    float distToHole = length(pos);
    minR = min(minR, distToHole);

    if (distToHole < rs) {
      captured = 1.0;
      break;
    }

    float stepSize = mix(0.024, 0.066, clamp(distToHole / 3.2, 0.0, 1.0));
    vec3 pull = -normalize(pos) * (rs / max(distToHole * distToHole, 0.02)) * stepSize * 0.105 * uLensStrength;
    dir = normalize(dir + pull);
    pos += dir * stepSize;

    if (previous.y * pos.y < 0.0) {
      float t = previous.y / (previous.y - pos.y);
      vec3 hit = mix(previous, pos, clamp(t, 0.0, 1.0));
      float diskR = length(hit.xz);

      if (diskR > innerR && diskR < outerR) {
        float angle = atan(hit.z, hit.x);
        float kepler = motionTime * 0.42 / pow(max(diskR, 0.36), 1.5);
        float turbulence = fbm(vec2(diskR * 5.4, angle * 1.85 + kepler));
        float radialHeat = pow(innerR / diskR, 0.74);
        float softInner = smoothstep(innerR, innerR + 0.07, diskR);
        float softOuter = 1.0 - smoothstep(outerR - 0.24, outerR, diskR);
        float density = softInner * softOuter * (0.22 + turbulence * 0.78);
        float orbitalSide = dot(normalize(vec2(hit.z, -hit.x)), vec2(-0.28, 0.96));
        float doppler = mix(0.78, 1.12, 0.5 + orbitalSide * 0.5);
        float a = density * uDiskOpacity * 0.42;
        vec3 c = diskPalette(radialHeat, turbulence, doppler);
        float remaining = 1.0 - diskAlpha;
        diskColor += c * a * remaining;
        diskAlpha += a * remaining;
      }
    }
  }

  float screenDiskSpan = (1.0 - smoothstep(0.12, 0.86, abs(p.x))) * smoothstep(0.02, 0.16, abs(p.x));
  float flow = motionTime * 0.34;
  float diskWave = sin(p.x * 11.0 + motionTime * 0.62) * 0.009;
  float diskNoise = fbm(vec2(abs(p.x) * 7.2 - flow, polarAngle * 1.8 + motionTime * 0.24));
  float diskBands = 0.72 + 0.28 * sin(abs(p.x) * 24.0 - motionTime * 1.65 + diskNoise * 2.6);
  float thinDisk = exp(-abs(p.y - diskWave) * 78.0) * screenDiskSpan;
  float arcLift = 0.075 + 0.165 * exp(-abs(p.x) * 2.55) + sin(motionTime * 0.2 + abs(p.x) * 5.0) * 0.004;
  float upperDisk = exp(-abs(p.y - arcLift) * 39.0) * screenDiskSpan * smoothstep(0.18, 0.5, abs(p.x));
  float lowerDisk = exp(-abs(p.y + arcLift * 0.86) * 44.0) * screenDiskSpan * smoothstep(0.16, 0.48, abs(p.x));
  float screenDiskAlpha = (thinDisk * 0.72 + upperDisk * 0.32 + lowerDisk * 0.38) * (0.52 + diskNoise * 0.58) * diskBands;
  screenDiskAlpha *= uDiskOpacity * 1.22 * diskRightFade * edgeFade;
  vec3 screenDiskColor = diskPalette(0.62 + thinDisk * 0.36, diskNoise, 0.96 + radial.x * 0.16 + sin(motionTime * 0.28 + p.x * 3.0) * 0.035);
  screenDiskColor = mix(screenDiskColor, vec3(0.58, 0.72, 0.78), upperDisk * 0.24);
  float wideDiskGlow = exp(-abs(p.y - diskWave) * 22.0) * screenDiskSpan * (0.58 + diskNoise * 0.42);
  float upperArcGlow = exp(-abs(p.y - arcLift) * 15.0) * screenDiskSpan * smoothstep(0.13, 0.46, abs(p.x));
  float lowerArcGlow = exp(-abs(p.y + arcLift * 0.86) * 16.0) * screenDiskSpan * smoothstep(0.12, 0.42, abs(p.x));
  float outerDiskGlow = (wideDiskGlow * 0.18 + upperArcGlow * 0.105 + lowerArcGlow * 0.12) * uDiskOpacity * diskRightFade * edgeFade;
  vec3 outerGlowColor = mix(vec3(0.20, 0.36, 0.44), vec3(0.78, 0.84, 0.82), smoothstep(0.36, 0.86, diskNoise));
  outerGlowColor = mix(outerGlowColor, vec3(0.86, 0.76, 0.45), thinDisk * 0.14);
  float screenRemaining = 1.0 - diskAlpha;
  diskColor += screenDiskColor * screenDiskAlpha * screenRemaining;
  diskAlpha += screenDiskAlpha * screenRemaining;

  float rimShimmer = 0.72 + 0.28 * sin(polarAngle * 8.0 - motionTime * 0.95 + r * 10.0);
  float photonRing = exp(-abs(minR - rs * 1.38) * 28.0) * rightFade * edgeFade * rimShimmer;
  float screenHorizon = (1.0 - smoothstep(0.125, 0.18, r)) * diskRightFade * edgeFade;
  float screenRim = exp(-abs(r - 0.18) * 42.0) * diskRightFade * edgeFade * rimShimmer;
  float softRimGlow = exp(-abs(r - 0.205) * 15.0) * diskRightFade * edgeFade * (0.72 + rimShimmer * 0.28);
  float horizonSilhouette = captured * rightFade * edgeFade;
  float lensHaze = lensFalloff * (0.16 + 0.07 * fbm(uv * 2.2 + vec2(motionTime * 0.045, -motionTime * 0.018)));
  float upperArc = exp(-abs(r - 0.36) * 11.0) * smoothstep(0.02, 0.16, abs(p.y)) * rightFade * (0.085 + sin(motionTime * 0.2) * 0.012);

  vec3 color = vec3(0.0);
  float alpha = 0.0;

  color += vec3(0.10, 0.17, 0.20) * lensHaze;
  alpha += lensHaze * 0.68;

  color += starColor * stars * rightFade;
  alpha += stars * 0.58 * rightFade;

  color += vec3(0.62, 0.74, 0.78) * upperArc;
  alpha += upperArc;

  color += outerGlowColor * outerDiskGlow;
  alpha += outerDiskGlow * 0.18;

  color = mix(color, diskColor, clamp(diskAlpha, 0.0, 0.86));
  alpha = alpha + diskAlpha * rightFade * edgeFade * (1.0 - alpha);

  color += vec3(0.82, 0.90, 0.90) * photonRing * 0.34;
  alpha += photonRing * 0.2;

  color += vec3(0.62, 0.78, 0.82) * softRimGlow * 0.2;
  alpha += softRimGlow * 0.08;

  color += vec3(0.86, 0.91, 0.88) * screenRim * 0.18;
  alpha += screenRim * 0.08;

  color = mix(color, vec3(0.0), max(horizonSilhouette, screenHorizon) * 0.96);
  alpha = max(alpha, max(horizonSilhouette * 0.92, screenHorizon * 0.9));

  float reducedDim = mix(1.0, 0.72, uReducedMotion);
  color *= reducedDim;
  alpha *= rightFade;

  gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.92));
}
`;
