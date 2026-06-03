import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { blackHoleFragmentShader, blackHoleVertexShader } from "./blackHoleShader";

type Star = {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  twinkle: number;
  drift: number;
  color: string;
  cluster: number;
  halo: number;
};

type StarCluster = {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  density: number;
  core: number;
  tint: string;
};

type TrailPoint = {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  age: number;
  life: number;
  radius: number;
  visualRadius: number;
  force: number;
  alphaScale: number;
  swirl: number;
};

type SafeZone = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

type BlackHoleRuntime = {
  render: (time: number) => void;
  dispose: () => void;
};

const MOBILE_BREAKPOINT = 760;
const SAFE_ZONE_SELECTOR = [
  ".hero-copy-block",
  ".hero-resume-grid",
  ".hero-details-grid",
  ".stats-strip",
  ".section-heading",
  ".switch-showcase",
  ".process-grid",
  ".contact-section",
  ".project-filter",
  ".gallery-grid",
  ".modal-backdrop",
  ".work-modal",
  ".modal-toolbar",
].join(",");

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const progress = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return progress * progress * (3 - 2 * progress);
}

function starColor() {
  const roll = Math.random();
  if (roll > 0.955) return "205, 194, 142";
  if (roll > 0.905) return "173, 184, 124";
  if (roll > 0.62) return "181, 211, 226";
  if (roll > 0.28) return "224, 232, 235";
  return "112, 132, 144";
}

function clusterStarColor(tint: string) {
  if (Math.random() > 0.18) return tint;
  return starColor();
}

export function ParticleBackground() {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const blackHoleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const starCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const blackHoleCanvas = blackHoleCanvasRef.current;
    const starCanvas = starCanvasRef.current;
    const context = starCanvas?.getContext("2d", { alpha: true });
    if (!layer || !blackHoleCanvas || !starCanvas || !context) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionQuery.matches;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    let trail: TrailPoint[] = [];
    let safeZones: SafeZone[] = [];
    let frameId = 0;
    let safeZoneFrameId = 0;
    let resizeTimer: number | undefined;
    let running = false;
    let blackHole: BlackHoleRuntime | null = null;
    let lastPointer: { x: number; y: number } | null = null;
    let pointerUniform = new THREE.Vector2(-1, -1);
    const layerMotion = gsap.matchMedia();

    const getLensCenter = () => {
      if (width < 1040) return { x: 0.99, y: 0.59 };
      if (width < 1320) return { x: 0.955, y: 0.61 };
      return { x: 0.92, y: 0.62 };
    };

    const getStarClusters = (): StarCluster[] => {
      const lensCenter = getLensCenter();
      const mobileScale = width < MOBILE_BREAKPOINT ? 0.72 : 1;

      return [
        {
          x: width * 0.13,
          y: height * 0.18,
          radiusX: width * 0.22 * mobileScale,
          radiusY: height * 0.18 * mobileScale,
          density: width < MOBILE_BREAKPOINT ? 0.14 : 0.18,
          core: 0.42,
          tint: "181, 211, 226",
        },
        {
          x: width * lensCenter.x,
          y: height * (1 - lensCenter.y),
          radiusX: width * 0.2,
          radiusY: height * 0.22,
          density: width < MOBILE_BREAKPOINT ? 0 : 0.2,
          core: 0.55,
          tint: "224, 232, 235",
        },
        {
          x: width * 0.82,
          y: height * 0.82,
          radiusX: width * 0.24 * mobileScale,
          radiusY: height * 0.2 * mobileScale,
          density: width < MOBILE_BREAKPOINT ? 0.12 : 0.14,
          core: 0.36,
          tint: "205, 194, 142",
        },
      ];
    };

    const pickStarCluster = () => {
      const clusters = getStarClusters().filter((cluster) => cluster.density > 0);
      const totalDensity = clusters.reduce((total, cluster) => total + cluster.density, 0);
      let roll = Math.random();

      if (roll > totalDensity) return undefined;

      for (const cluster of clusters) {
        roll -= cluster.density;
        if (roll <= 0) return cluster;
      }

      return undefined;
    };

    const createBlackHoleRuntime = (): BlackHoleRuntime | null => {
      if (width < MOBILE_BREAKPOINT) {
        blackHoleCanvas.hidden = true;
        return null;
      }

      blackHoleCanvas.hidden = false;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const lensCenter = getLensCenter();
      const renderer = new THREE.WebGLRenderer({
        canvas: blackHoleCanvas,
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
      });

      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uResolution: { value: new THREE.Vector2(width * pixelRatio, height * pixelRatio) },
          uTime: { value: reduceMotion ? 18 : 0 },
          uDpr: { value: pixelRatio },
          uPointer: { value: pointerUniform },
          uReducedMotion: { value: reduceMotion ? 1 : 0 },
          uLensCenter: { value: new THREE.Vector2(lensCenter.x, lensCenter.y) },
          uLensStrength: { value: reduceMotion ? 0.72 : 1 },
          uDiskOpacity: { value: reduceMotion ? 0.5 : 0.96 },
        },
        vertexShader: blackHoleVertexShader,
        fragmentShader: blackHoleFragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      return {
        render: (time: number) => {
          const nextLensCenter = getLensCenter();
          material.uniforms.uResolution.value.set(width * pixelRatio, height * pixelRatio);
          material.uniforms.uTime.value = reduceMotion ? 18 : time * 0.001;
          material.uniforms.uDpr.value = pixelRatio;
          material.uniforms.uPointer.value.copy(pointerUniform);
          material.uniforms.uReducedMotion.value = reduceMotion ? 1 : 0;
          material.uniforms.uLensCenter.value.set(nextLensCenter.x, nextLensCenter.y);
          material.uniforms.uLensStrength.value = reduceMotion ? 0.72 : 1;
          material.uniforms.uDiskOpacity.value = reduceMotion ? 0.5 : 0.96;
          renderer.render(scene, camera);
        },
        dispose: () => {
          scene.remove(mesh);
          geometry.dispose();
          material.dispose();
          renderer.dispose();
        },
      };
    };

    const createStar = (): Star => {
      const cluster = pickStarCluster();
      const edgeBias = !cluster && Math.random() > 0.48;
      const edgeSide = Math.floor(Math.random() * 4);
      let homeX = Math.random() * width;
      let homeY = Math.random() * height;
      let clusterStrength = 0;
      let clusterTint = "";

      if (cluster) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.pow(Math.random(), 1.85);
        homeX = cluster.x + Math.cos(angle) * cluster.radiusX * radius;
        homeY = cluster.y + Math.sin(angle) * cluster.radiusY * radius;
        homeX = clamp(homeX, 0, width);
        homeY = clamp(homeY, 0, height);
        clusterStrength = cluster.core + (1 - radius) * (1 - cluster.core);
        clusterTint = cluster.tint;
      }

      if (edgeBias) {
        if (edgeSide === 0) homeX = Math.random() * width * 0.22;
        if (edgeSide === 1) homeX = width - Math.random() * width * 0.25;
        if (edgeSide === 2) homeY = Math.random() * height * 0.2;
        if (edgeSide === 3) homeY = height - Math.random() * height * 0.22;
      }

      const inReadingCorridor = homeX > width * 0.26 && homeX < width * 0.74 && homeY > height * 0.08 && homeY < height * 0.82;
      if (inReadingCorridor && Math.random() < 0.5) {
        homeX = Math.random() > 0.5 ? width * (0.78 + Math.random() * 0.2) : width * Math.random() * 0.22;
      }

      const depth = Math.random();
      const clusterLift = clusterStrength * (0.28 + depth * 0.34);
      return {
        homeX,
        homeY,
        x: homeX + (Math.random() - 0.5) * (cluster ? 10 : 18),
        y: homeY + (Math.random() - 0.5) * (cluster ? 10 : 18),
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        radius: 0.34 + depth * 1.46 + clusterStrength * 0.28,
        alpha: 0.065 + depth * 0.22 + clusterLift * 0.12,
        twinkle: 0.7 + Math.random() * 2.4 + clusterStrength * 0.55,
        drift: 0.45 + Math.random() * 1.35 + clusterStrength * 0.28,
        color: cluster ? clusterStarColor(clusterTint) : starColor(),
        cluster: clusterStrength,
        halo: Math.random() > 0.74 ? clusterStrength : 0,
      };
    };

    const createStars = () => {
      const area = width * height;
      const isMobile = width < MOBILE_BREAKPOINT;
      const count = reduceMotion
        ? clamp(Math.floor(area / 32000), 24, 82)
        : clamp(Math.floor(area / (isMobile ? 22000 : 6200)), isMobile ? 36 : 145, isMobile ? 92 : 430);

      return Array.from({ length: count }, createStar);
    };

    const collectSafeZones = () => {
      const padding = width < MOBILE_BREAKPOINT ? 34 : 76;
      safeZones = Array.from(document.querySelectorAll<HTMLElement>(SAFE_ZONE_SELECTOR))
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            left: rect.left - padding,
            top: rect.top - padding,
            right: rect.right + padding,
            bottom: rect.bottom + padding,
          };
        })
        .filter((zone) => zone.right > 0 && zone.left < width && zone.bottom > 0 && zone.top < height);
    };

    const scheduleSafeZoneCollect = () => {
      if (safeZoneFrameId) return;
      safeZoneFrameId = window.requestAnimationFrame(() => {
        safeZoneFrameId = 0;
        collectSafeZones();
      });
    };

    const centralCorridorMultiplier = (x: number, y: number) => {
      const horizontalDistance = Math.abs(x - width * 0.5) / Math.max(width * 0.5, 1);
      const verticalDistance = Math.abs(y - height * 0.48) / Math.max(height * 0.52, 1);
      const edgePresence = clamp(Math.max(horizontalDistance * 1.12, verticalDistance * 0.82), 0, 1);
      return 0.28 + edgePresence * 0.72;
    };

    const safeZoneMultiplier = (x: number, y: number) => {
      for (const zone of safeZones) {
        if (x >= zone.left && x <= zone.right && y >= zone.top && y <= zone.bottom) {
          return 0.055;
        }
      }

      return 1;
    };

    const blackHoleFieldMultiplier = (x: number, y: number) => {
      if (width < MOBILE_BREAKPOINT) return 1;
      const lensCenter = getLensCenter();
      const lensX = width * lensCenter.x;
      const lensY = height * (1 - lensCenter.y);
      const normalizedX = (x - lensX) / Math.max(width * 0.34, 1);
      const normalizedY = (y - lensY) / Math.max(height * 0.38, 1);
      const distance = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);
      return 0.24 + smoothstep(0.42, 1.35, distance) * 0.76;
    };

    const readabilityMultiplier = (x: number, y: number) =>
      centralCorridorMultiplier(x, y) * safeZoneMultiplier(x, y) * blackHoleFieldMultiplier(x, y);

    const pointReadabilityMultiplier = (x: number, y: number) => {
      const safe = safeZoneMultiplier(x, y);
      if (safe < 1) return 0.16;
      return centralCorridorMultiplier(x, y);
    };

    const rebuildScene = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      starCanvas.width = Math.max(1, Math.floor(width * dpr));
      starCanvas.height = Math.max(1, Math.floor(height * dpr));
      starCanvas.style.width = `${width}px`;
      starCanvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      lastPointer = null;
      pointerUniform = new THREE.Vector2(-1, -1);
      trail = [];
      stars = createStars();
      collectSafeZones();

      blackHole?.dispose();
      blackHole = createBlackHoleRuntime();
    };

    const drawClusterHaze = (time: number) => {
      const clusters = getStarClusters();
      context.save();
      context.globalCompositeOperation = "lighter";

      for (const cluster of clusters) {
        if (cluster.density <= 0) continue;

        const drift = reduceMotion ? 0 : Math.sin(time * 0.00008 + cluster.x * 0.01) * 7;
        const alpha = width < MOBILE_BREAKPOINT ? 0.025 : 0.038;
        const glow = context.createRadialGradient(
          cluster.x + drift,
          cluster.y - drift * 0.6,
          0,
          cluster.x,
          cluster.y,
          Math.max(cluster.radiusX, cluster.radiusY),
        );
        glow.addColorStop(0, `rgba(${cluster.tint}, ${alpha})`);
        glow.addColorStop(0.44, `rgba(${cluster.tint}, ${alpha * 0.36})`);
        glow.addColorStop(1, `rgba(${cluster.tint}, 0)`);
        context.fillStyle = glow;
        context.beginPath();
        context.ellipse(cluster.x, cluster.y, cluster.radiusX, cluster.radiusY, -0.18, 0, Math.PI * 2);
        context.fill();
      }

      context.restore();
    };

    const drawStars = (time: number) => {
      context.save();
      context.globalCompositeOperation = "lighter";

      for (const star of stars) {
        const pulse = reduceMotion ? 0.86 : 0.78 + Math.sin(time * 0.0011 * star.twinkle + star.homeX * 0.019) * 0.22;
        const alpha = star.alpha * pulse * readabilityMultiplier(star.x, star.y);
        if (alpha <= 0.004) continue;

        context.fillStyle = `rgba(${star.color}, ${alpha})`;
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();

        if ((star.radius > 1.38 || star.halo > 0.2) && alpha > 0.045) {
          const glowRadius = star.radius * (3.2 + star.halo * 4.8);
          const glow = context.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowRadius);
          glow.addColorStop(0, `rgba(${star.color}, ${alpha * (0.14 + star.halo * 0.08)})`);
          glow.addColorStop(1, `rgba(${star.color}, 0)`);
          context.fillStyle = glow;
          context.beginPath();
          context.arc(star.x, star.y, glowRadius, 0, Math.PI * 2);
          context.fill();
        }

        if (star.cluster > 0.7 && star.radius > 1.25 && alpha > 0.055) {
          context.strokeStyle = `rgba(${star.color}, ${alpha * 0.14})`;
          context.lineWidth = 0.5;
          context.beginPath();
          context.moveTo(star.x - star.radius * 3.8, star.y);
          context.lineTo(star.x + star.radius * 3.8, star.y);
          context.moveTo(star.x, star.y - star.radius * 2.2);
          context.lineTo(star.x, star.y + star.radius * 2.2);
          context.stroke();
        }
      }

      context.restore();
    };

    const drawTrail = () => {
      if (trail.length === 0 || reduceMotion) return;

      context.save();
      context.globalCompositeOperation = "lighter";
      context.lineCap = "round";

      for (const point of trail) {
        const progress = point.age / point.life;
        const alpha = point.alphaScale * (1 - progress);
        const radius = Math.max(0, point.visualRadius * (1 - progress));
        if (alpha <= 0.01 || radius <= 0.1) continue;

        context.strokeStyle = `rgba(178, 211, 226, ${0.052 * alpha})`;
        context.lineWidth = Math.max(0.45, radius * 0.18);
        context.beginPath();
        context.moveTo(point.previousX, point.previousY);
        context.lineTo(point.x, point.y);
        context.stroke();

        const glow = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
        glow.addColorStop(0, `rgba(212, 234, 245, ${0.09 * alpha})`);
        glow.addColorStop(0.38, `rgba(124, 166, 184, ${0.04 * alpha})`);
        glow.addColorStop(1, "rgba(124, 166, 184, 0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
      }

      context.restore();
    };

    const updateTrail = () => {
      trail = trail
        .map((point) => ({ ...point, age: point.age + 1 }))
        .filter((point) => point.age < point.life)
        .slice(-24);
    };

    const updateStars = (time: number) => {
      for (const star of stars) {
        star.vx += (star.homeX - star.x) * 0.0042 + Math.cos(time * 0.00009 * star.drift + star.homeY) * 0.0007;
        star.vy += (star.homeY - star.y) * 0.0042 + Math.sin(time * 0.00009 * star.drift + star.homeX) * 0.0007;

        for (const point of trail) {
          const dx = star.x - point.x;
          const dy = star.y - point.y;
          const distanceSquared = dx * dx + dy * dy;
          const radiusSquared = point.radius * point.radius;
          if (distanceSquared <= 0.01 || distanceSquared > radiusSquared) continue;

          const distance = Math.sqrt(distanceSquared);
          const strength = (1 - distance / point.radius) * point.force * point.alphaScale;
          const nx = dx / distance;
          const ny = dy / distance;
          star.vx += nx * strength + -ny * strength * point.swirl;
          star.vy += ny * strength + nx * strength * point.swirl;
        }

        star.vx *= 0.92;
        star.vy *= 0.92;
        star.x += star.vx;
        star.y += star.vy;
      }
    };

    const render = (time: number) => {
      context.clearRect(0, 0, width, height);

      if (!reduceMotion) {
        updateStars(time);
        updateTrail();
      }

      drawClusterHaze(time);
      drawStars(time);
      drawTrail();
      blackHole?.render(time);
    };

    const loop = (time: number) => {
      render(time);
      if (!reduceMotion && !document.hidden) {
        frameId = window.requestAnimationFrame(loop);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running || reduceMotion || document.hidden) return;
      running = true;
      frameId = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(frameId);
    };

    const handleResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        stop();
        rebuildScene();
        render(0);
        start();
      }, 140);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (width <= 0 || height <= 0) return;
      pointerUniform.set(event.clientX / width, 1 - event.clientY / height);
      if (reduceMotion) return;

      if (!lastPointer) {
        lastPointer = { x: event.clientX, y: event.clientY };
        return;
      }

      const previous = lastPointer;
      const dx = event.clientX - previous.x;
      const dy = event.clientY - previous.y;
      if (dx * dx + dy * dy < 9) {
        lastPointer = { x: event.clientX, y: event.clientY };
        return;
      }

      const isMobile = width < MOBILE_BREAKPOINT;
      const readability = pointReadabilityMultiplier(event.clientX, event.clientY);
      trail.push({
        x: event.clientX,
        y: event.clientY,
        previousX: previous.x,
        previousY: previous.y,
        age: 0,
        life: isMobile ? 16 : 24,
        radius: isMobile ? 48 : 88,
        visualRadius: (isMobile ? 10 : 18) * readability,
        force: isMobile ? 0.16 : 0.28,
        alphaScale: readability,
        swirl: Math.random() > 0.5 ? 0.18 : -0.18,
      });
      trail = trail.slice(-20);
      lastPointer = { x: event.clientX, y: event.clientY };
    };

    const handlePointerLeave = () => {
      pointerUniform.set(-1, -1);
      lastPointer = null;
    };

    const handleMotionChange = () => {
      reduceMotion = motionQuery.matches;
      stop();
      rebuildScene();
      render(0);
      start();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop();
        return;
      }

      render(0);
      start();
    };

    layerMotion.add("(prefers-reduced-motion: no-preference)", () => {
      const nebulas = gsap.utils.toArray<HTMLElement>(".background-nebula", layer);
      gsap.fromTo(layer, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.25, ease: "power2.out" });
      gsap.to(nebulas, {
        x: (index) => [18, -14, 10][index] ?? 12,
        y: (index) => [-10, 16, -18][index] ?? 10,
        scale: (index) => [1.035, 1.045, 1.025][index] ?? 1.03,
        duration: (index) => [18, 22, 26][index] ?? 20,
        ease: "sine.inOut",
        stagger: 1.6,
        repeat: -1,
        yoyo: true,
      });
    });
    layerMotion.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(layer, { autoAlpha: 0.72 });
      gsap.set(".background-nebula", { clearProps: "transform" });
    });

    rebuildScene();
    render(0);
    start();

    const observer = new MutationObserver(scheduleSafeZoneCollect);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true, attributeFilter: ["class"] });

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", scheduleSafeZoneCollect, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      stop();
      observer.disconnect();
      if (resizeTimer) window.clearTimeout(resizeTimer);
      window.cancelAnimationFrame(safeZoneFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", scheduleSafeZoneCollect);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      motionQuery.removeEventListener("change", handleMotionChange);
      blackHole?.dispose();
      layerMotion.revert();
    };
  }, []);

  return (
    <div className="particle-background" ref={layerRef} aria-hidden="true">
      <div className="background-nebula background-nebula-a" />
      <div className="background-nebula background-nebula-b" />
      <div className="background-nebula background-nebula-c" />
      <canvas className="black-hole-webgl-canvas" ref={blackHoleCanvasRef} />
      <canvas className="starfield-canvas" ref={starCanvasRef} />
    </div>
  );
}
