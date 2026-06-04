import { ArrowUpRight, Images } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Language } from "../data/i18n";
import { uiCopy } from "../data/i18n";
import type { Project } from "../data/projects";
import type { GeneratedMediaItem } from "../data/generatedMedia";
import { useGsapReveal } from "../hooks/useGsapReveal";

gsap.registerPlugin(ScrollTrigger);

type SelectedWorksProps = {
  language: Language;
  projects: Project[];
  mediaByProject: Record<string, GeneratedMediaItem[]>;
  onOpenProject: (project: Project, mediaId?: string) => void;
};

export function SelectedWorks({ language, projects, mediaByProject, onOpenProject }: SelectedWorksProps) {
  const scopeRef = useGsapReveal<HTMLElement>();
  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef(0);
  const suppressActivationRef = useRef(false);
  const previousLanguageRef = useRef(language);
  const copy = uiCopy[language].selectedWorks;
  const preparedProjects = projects.map((project) => {
    const projectMedia = mediaByProject[project.slug] ?? [];
    const cover = projectMedia.find((item) => item.id === project.coverHint) ?? projectMedia[0];
    const usedIds = new Set(cover ? [cover.id] : []);
    const hintedSupport = (project.previewHints ?? []).flatMap((id) => {
      const item = projectMedia.find((candidate) => candidate.id === id);
      if (!item || usedIds.has(item.id)) return [];
      usedIds.add(item.id);
      return [item];
    });
    const fallbackSupport = projectMedia.filter((item) => !usedIds.has(item.id));
    const support = [...hintedSupport, ...fallbackSupport].slice(0, 3);
    return { project, cover, support, count: projectMedia.length };
  });

  useEffect(() => {
    const showcase = showcaseRef.current;
    if (!showcase) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const context = gsap.context(() => {
      const visualPanels = gsap.utils.toArray<HTMLElement>(".switch-visual-panel");
      const copyPanels = gsap.utils.toArray<HTMLElement>(".switch-copy-panel");
      const steps = gsap.utils.toArray<HTMLElement>(".switch-step");
      const progressBars = gsap.utils.toArray<HTMLElement>(".switch-progress span");

      gsap.set(visualPanels, { yPercent: 112, autoAlpha: 0, scale: 0.965 });
      gsap.set(copyPanels, { y: 32, autoAlpha: 0 });
      gsap.set(visualPanels[0], { yPercent: 0, autoAlpha: 1, scale: 1 });
      gsap.set(copyPanels[0], { y: 0, autoAlpha: 1 });
      gsap.set(progressBars, { backgroundColor: "rgba(255, 255, 255, 0.18)", scaleX: 1 });
      gsap.set(progressBars[0], { backgroundColor: "#fff" });

      const activate = (nextIndex: number) => {
        if (suppressActivationRef.current) return;
        if (nextIndex === activeIndexRef.current || !visualPanels[nextIndex] || !copyPanels[nextIndex]) return;
        const currentIndex = activeIndexRef.current;
        const direction = nextIndex > currentIndex ? 1 : -1;
        activeIndexRef.current = nextIndex;
        showcase.dataset.active = String(nextIndex);

        gsap.killTweensOf([...visualPanels, ...copyPanels, ...progressBars]);
        visualPanels.forEach((panel, panelIndex) => {
          if (panelIndex !== currentIndex && panelIndex !== nextIndex) {
            gsap.set(panel, { yPercent: direction > 0 ? 112 : -28, autoAlpha: 0, scale: 0.965 });
          }
        });
        copyPanels.forEach((panel, panelIndex) => {
          if (panelIndex !== currentIndex && panelIndex !== nextIndex) {
            gsap.set(panel, { y: direction > 0 ? 34 : -34, autoAlpha: 0 });
          }
        });

        const timeline = gsap.timeline({ defaults: { ease: "power3.out", overwrite: "auto" } });
        timeline
          .to(
            visualPanels[currentIndex],
            {
              yPercent: direction > 0 ? -28 : 112,
              autoAlpha: 0,
              scale: 0.965,
              duration: 0.58,
            },
            0,
          )
          .fromTo(
            visualPanels[nextIndex],
            { yPercent: direction > 0 ? 112 : -28, autoAlpha: 1, scale: 0.985 },
            { yPercent: 0, autoAlpha: 1, scale: 1, duration: 0.74 },
            0,
          )
          .to(copyPanels[currentIndex], { y: direction > 0 ? -22 : 22, autoAlpha: 0, duration: 0.26 }, 0)
          .fromTo(
            copyPanels[nextIndex],
            { y: direction > 0 ? 34 : -34, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.46 },
            0.12,
          )
          .to(progressBars, { backgroundColor: "rgba(255, 255, 255, 0.18)", duration: 0.18 }, 0)
          .to(progressBars[nextIndex], { backgroundColor: "#fff", duration: 0.18 }, 0);
      };

      steps.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 70%",
          end: "bottom 70%",
          onEnter: () => activate(index),
          onEnterBack: () => activate(index),
        });
      });
    }, showcase);

    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    const showcase = showcaseRef.current;
    if (!showcase) return undefined;
    if (previousLanguageRef.current === language) return undefined;
    previousLanguageRef.current = language;

    const activeIndex = activeIndexRef.current;
    suppressActivationRef.current = true;
    const restoreFrame = window.requestAnimationFrame(() => {
      const visualPanels = gsap.utils.toArray<HTMLElement>(".switch-visual-panel", showcase);
      const copyPanels = gsap.utils.toArray<HTMLElement>(".switch-copy-panel", showcase);
      const progressBars = gsap.utils.toArray<HTMLElement>(".switch-progress span", showcase);

      if (!visualPanels[activeIndex] || !copyPanels[activeIndex]) return;

      showcase.dataset.active = String(activeIndex);
      gsap.killTweensOf([...visualPanels, ...copyPanels, ...progressBars]);

      visualPanels.forEach((panel, index) => {
        gsap.set(panel, {
          yPercent: index === activeIndex ? 0 : 112,
          autoAlpha: index === activeIndex ? 1 : 0,
          scale: index === activeIndex ? 1 : 0.965,
        });
      });

      copyPanels.forEach((panel, index) => {
        gsap.set(panel, {
          y: index === activeIndex ? 0 : 32,
          autoAlpha: index === activeIndex ? 1 : 0,
        });
      });

      gsap.set(progressBars, { backgroundColor: "rgba(255, 255, 255, 0.18)", scaleX: 1 });
      gsap.set(progressBars[activeIndex], { backgroundColor: "#fff" });
      ScrollTrigger.refresh();

      window.setTimeout(() => {
        suppressActivationRef.current = false;
      }, 240);
    });

    return () => {
      window.cancelAnimationFrame(restoreFrame);
      suppressActivationRef.current = false;
    };
  }, [language]);

  return (
    <section className="section selected-works" id="works" ref={scopeRef}>
      <div className="section-heading" data-reveal>
        <p>{copy.label}</p>
        <h2>{copy.heading}</h2>
      </div>

      <div className="switch-showcase" ref={showcaseRef} data-active="0" data-reveal>
        <div className="switch-stage" aria-label={copy.scrollLabel}>
          <div className="switch-copy-stack">
            {preparedProjects.map(({ project, cover, count }, index) => (
              <article
                className="switch-copy-panel"
                key={project.slug}
                style={{ "--accent": project.accent } as CSSProperties}
              >
                <p className="switch-count">{String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</p>
                <p className="eyebrow">{project.eyebrow}</p>
                <h3>{project.title}</h3>
                {project.summary ? <p>{project.summary}</p> : null}
                <div className="switch-meta">
                  <span>{project.year}</span>
                  <span>{project.category}</span>
                  <span>{count} {copy.assets}</span>
                </div>
                <div className="tag-row">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <button className="text-command" type="button" onClick={() => onOpenProject(project, cover?.id)}>
                  <Images size={18} /> {copy.open} <ArrowUpRight size={18} />
                </button>
              </article>
            ))}
          </div>

          <div className="switch-visual-stack">
            {preparedProjects.map(({ project, cover, support }) => {
              const visualItems = [cover, ...support].filter((item): item is GeneratedMediaItem => Boolean(item));

              return (
                <div
                  className="switch-visual-panel"
                  key={project.slug}
                  style={{ "--accent": project.accent } as CSSProperties}
                >
                  {visualItems.map((item, itemIndex) => (
                    <button
                      className={itemIndex === 0 ? "switch-media-item featured" : "switch-media-item"}
                      style={{ "--media-ratio": item.ratio || 1 } as CSSProperties}
                      type="button"
                      key={item.id}
                      onClick={() => onOpenProject(project, item.id)}
                    >
                      {item.type === "video" ? (
                        <video src={item.src} muted playsInline loop autoPlay={itemIndex === 0} />
                      ) : (
                        <img src={itemIndex === 0 ? item.src : item.thumb || item.src} alt={item.alt} loading="lazy" />
                      )}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="switch-progress" aria-hidden="true">
            {projects.map((project, index) => (
              <span key={project.slug} style={{ "--step": index } as CSSProperties} />
            ))}
          </div>
        </div>

        <div className="switch-steps" aria-hidden="true">
          {projects.map((project) => (
            <div className="switch-step" key={project.slug} />
          ))}
        </div>
      </div>
    </section>
  );
}
