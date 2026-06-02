import { useEffect, useRef } from "react";
import gsap from "gsap";

type ParticleKind = "ambient" | "text";

type Particle = {
  kind: ParticleKind;
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  twinkle: number;
  color: string;
};

type TrailPoint = {
  x: number;
  y: number;
  age: number;
  life: number;
  radius: number;
  visualRadius: number;
  force: number;
  alphaScale: number;
};

type SafeZone = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

const TEXT_WORDS = ["PBR", "CLOTH", "REALTIME"] as const;
const ENABLE_TEXT_PARTICLES = false;
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
].join(",");

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function shuffle<T>(items: T[]) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
  }
  return items;
}

function particleColor(kind: ParticleKind) {
  if (kind === "text") {
    return Math.random() > 0.34 ? "210, 236, 255" : "247, 247, 242";
  }

  const palette = ["169, 190, 198", "244, 239, 228", "182, 195, 122", "255, 255, 255"];
  return palette[Math.floor(Math.random() * palette.length)];
}

export function ParticleBackground() {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!layer || !canvas || !context) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionQuery.matches;
    let particles: Particle[] = [];
    let trail: TrailPoint[] = [];
    let safeZones: SafeZone[] = [];
    let frameId = 0;
    let safeZoneFrameId = 0;
    let running = false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let resizeTimer: number | undefined;

    const createParticle = (kind: ParticleKind, homeX: number, homeY: number, radius: number, alpha: number): Particle => {
      const scatter = kind === "text" ? 84 : 16;
      return {
        kind,
        homeX,
        homeY,
        x: homeX + (Math.random() - 0.5) * scatter,
        y: homeY + (Math.random() - 0.5) * scatter,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius,
        alpha,
        twinkle: 0.6 + Math.random() * 1.8,
        color: particleColor(kind),
      };
    };

    const createAmbientParticles = () => {
      const area = width * height;
      const isMobile = width < 760;
      const count = reduceMotion
        ? clamp(Math.floor(area / 42000), 18, 54)
        : clamp(Math.floor(area / (isMobile ? 36000 : 27000)), isMobile ? 20 : 34, isMobile ? 48 : 92);

      return Array.from({ length: count }, () =>
        createParticle(
          "ambient",
          Math.random() * width,
          Math.random() * height,
          Math.random() * 1.35 + 0.35,
          Math.random() * 0.075 + 0.045,
        ),
      );
    };

    const createTextParticles = () => {
      if (!ENABLE_TEXT_PARTICLES || reduceMotion) return [];

      const isMobile = width < 760;
      const textCanvas = document.createElement("canvas");
      const textContext = textCanvas.getContext("2d");
      if (!textContext) return [];

      textCanvas.width = Math.max(1, Math.floor(width));
      textCanvas.height = Math.max(1, Math.floor(height));
      textContext.clearRect(0, 0, width, height);
      textContext.textAlign = "center";
      textContext.textBaseline = "middle";
      textContext.fillStyle = "#fff";

      let mainSize = clamp(Math.min(width * 0.16, height * 0.24), isMobile ? 58 : 96, isMobile ? 92 : 210);
      textContext.font = `900 ${mainSize}px Inter, ui-sans-serif, system-ui, sans-serif`;
      while (textContext.measureText("AI + 3D").width > width * 0.86 && mainSize > 42) {
        mainSize *= 0.92;
        textContext.font = `900 ${mainSize}px Inter, ui-sans-serif, system-ui, sans-serif`;
      }

      textContext.fillText("AI + 3D", width * 0.5, height * (isMobile ? 0.72 : 0.74));

      const smallSize = clamp(Math.min(width * 0.036, height * 0.064), isMobile ? 16 : 22, isMobile ? 24 : 46);
      textContext.font = `800 ${smallSize}px Inter, ui-sans-serif, system-ui, sans-serif`;
      textContext.globalAlpha = 0.74;
      const wordPositions = [
        [width * 0.22, height * 0.9],
        [width * 0.78, height * 0.88],
        [width * 0.5, height * 0.96],
      ] as const;
      TEXT_WORDS.forEach((word, index) => {
        const [x, y] = wordPositions[index];
        textContext.fillText(word, x, y);
      });
      textContext.globalAlpha = 1;

      const imageData = textContext.getImageData(0, 0, textCanvas.width, textCanvas.height).data;
      const step = isMobile ? 5 : 6;
      const sampled: Particle[] = [];

      for (let y = 0; y < textCanvas.height; y += step) {
        for (let x = 0; x < textCanvas.width; x += step) {
          const alpha = imageData[(y * textCanvas.width + x) * 4 + 3];
          if (alpha < 32 || Math.random() < 0.08) continue;
          sampled.push(
            createParticle(
              "text",
              x + (Math.random() - 0.5) * 2.4,
              y + (Math.random() - 0.5) * 2.4,
              Math.random() * 1.15 + (isMobile ? 0.55 : 0.7),
              Math.random() * 0.12 + 0.1,
            ),
          );
        }
      }

      return shuffle(sampled).slice(0, isMobile ? 120 : 320);
    };

    const rebuildScene = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      trail = [];
      particles = [...createAmbientParticles(), ...createTextParticles()];
      collectSafeZones();
    };

    const collectSafeZones = () => {
      const padding = width < 760 ? 32 : 68;
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

    const readabilityMultiplier = (particle: Particle) => {
      for (const zone of safeZones) {
        if (particle.x >= zone.left && particle.x <= zone.right && particle.y >= zone.top && particle.y <= zone.bottom) {
          return particle.kind === "text" ? 0.015 : 0.045;
        }
      }

      return 1;
    };

    const pointReadabilityMultiplier = (x: number, y: number) => {
      for (const zone of safeZones) {
        if (x >= zone.left && x <= zone.right && y >= zone.top && y <= zone.bottom) {
          return 0.22;
        }
      }

      return 1;
    };

    const drawTrail = () => {
      if (trail.length === 0) return;

      context.save();
      context.globalCompositeOperation = "lighter";
      for (const point of trail) {
        const progress = point.age / point.life;
        const radius = Math.max(0, point.visualRadius * (1 - progress));
        const glow = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
        glow.addColorStop(0, `rgba(210, 236, 255, ${0.11 * point.alphaScale * (1 - progress)})`);
        glow.addColorStop(0.36, `rgba(169, 190, 198, ${0.05 * point.alphaScale * (1 - progress)})`);
        glow.addColorStop(1, "rgba(169, 190, 198, 0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    };

    const drawParticles = (time: number) => {
      context.save();
      context.globalCompositeOperation = "lighter";
      for (const particle of particles) {
        const pulse = reduceMotion ? 1 : 0.78 + Math.sin(time * 0.0012 * particle.twinkle + particle.homeX * 0.03) * 0.22;
        const alpha = particle.alpha * pulse * readabilityMultiplier(particle);
        context.fillStyle = `rgba(${particle.color}, ${alpha})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    };

    const updateParticles = () => {
      for (const particle of particles) {
        const spring = particle.kind === "text" ? 0.016 : 0.0048;
        const damping = particle.kind === "text" ? 0.88 : 0.92;

        particle.vx += (particle.homeX - particle.x) * spring;
        particle.vy += (particle.homeY - particle.y) * spring;

        for (const point of trail) {
          const dx = particle.x - point.x;
          const dy = particle.y - point.y;
          const distanceSquared = dx * dx + dy * dy;
          const radiusSquared = point.radius * point.radius;
          if (distanceSquared <= 0.01 || distanceSquared > radiusSquared) continue;

          const distance = Math.sqrt(distanceSquared);
          const strength = (1 - distance / point.radius) * point.force * point.alphaScale * (particle.kind === "text" ? 1.15 : 0.82);
          particle.vx += (dx / distance) * strength;
          particle.vy += (dy / distance) * strength;
        }

        particle.vx *= damping;
        particle.vy *= damping;
        particle.x += particle.vx;
        particle.y += particle.vy;
      }
    };

    const updateTrail = () => {
      trail = trail
        .map((point) => ({ ...point, age: point.age + 1 }))
        .filter((point) => point.age < point.life)
        .slice(-22);
    };

    const render = (time: number) => {
      context.clearRect(0, 0, width, height);

      if (!reduceMotion) {
        updateParticles();
        updateTrail();
      }

      drawTrail();
      drawParticles(time);
    };

    const loop = (time: number) => {
      render(time);
      frameId = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduceMotion) return;
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
      if (reduceMotion) return;

      const isMobile = width < 760;
      const readability = pointReadabilityMultiplier(event.clientX, event.clientY);
      trail.push({
        x: event.clientX,
        y: event.clientY,
        age: 0,
        life: isMobile ? 18 : 24,
        radius: isMobile ? 58 : 88,
        visualRadius: (isMobile ? 12 : 18) * readability,
        force: isMobile ? 0.2 : 0.32,
        alphaScale: readability,
      });
      if (trail.length > 18) trail = trail.slice(-18);
    };

    const handleMotionChange = () => {
      reduceMotion = motionQuery.matches;
      stop();
      rebuildScene();
      render(0);
      start();
    };

    rebuildScene();
    render(0);
    start();

    gsap.fromTo(layer, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.4, ease: "power2.out" });

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", scheduleSafeZoneCollect, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      stop();
      if (resizeTimer) window.clearTimeout(resizeTimer);
      window.cancelAnimationFrame(safeZoneFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", scheduleSafeZoneCollect);
      window.removeEventListener("pointermove", handlePointerMove);
      motionQuery.removeEventListener("change", handleMotionChange);
      gsap.killTweensOf(layer);
    };
  }, []);

  return (
    <div className="particle-background" ref={layerRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
