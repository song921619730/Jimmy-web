import { ArrowUpRight, Images } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type Project } from "../data/projects";
import type { GeneratedMediaItem } from "../data/generatedMedia";
import { useGsapReveal } from "../hooks/useGsapReveal";

gsap.registerPlugin(ScrollTrigger);

type SelectedWorksProps = {
  mediaByProject: Record<string, GeneratedMediaItem[]>;
  onOpenProject: (project: Project, mediaId?: string) => void;
};

export function SelectedWorks({ mediaByProject, onOpenProject }: SelectedWorksProps) {
  const scopeRef = useGsapReveal<HTMLElement>();
  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const preparedProjects = projects.map((project) => {
    const projectMedia = mediaByProject[project.slug] ?? [];
    const cover = projectMedia.find((item) => item.id === project.coverHint) ?? projectMedia[0];
    const support = projectMedia.filter((item) => item.id !== cover?.id).slice(0, 3);
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
      let activeIndex = 0;

      gsap.set(visualPanels, { yPercent: 112, autoAlpha: 0, scale: 0.965 });
      gsap.set(copyPanels, { y: 32, autoAlpha: 0 });
      gsap.set(visualPanels[0], { yPercent: 0, autoAlpha: 1, scale: 1 });
      gsap.set(copyPanels[0], { y: 0, autoAlpha: 1 });
      gsap.set(progressBars, { backgroundColor: "rgba(255, 255, 255, 0.18)", scaleX: 1 });
      gsap.set(progressBars[0], { backgroundColor: "#fff" });

      const activate = (nextIndex: number) => {
        if (nextIndex === activeIndex || !visualPanels[nextIndex] || !copyPanels[nextIndex]) return;
        const currentIndex = activeIndex;
        const direction = nextIndex > currentIndex ? 1 : -1;
        activeIndex = nextIndex;
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
          start: "top center",
          end: "bottom center",
          onEnter: () => activate(index),
          onEnterBack: () => activate(index),
        });
      });
    }, showcase);

    return () => context.revert();
  }, []);

  return (
    <section className="section selected-works" id="works" ref={scopeRef}>
      <div className="section-heading" data-reveal>
        <p>Selected Works</p>
        <h2>Roll through the archive. Each work rises into place.</h2>
      </div>

      <div className="switch-showcase" ref={showcaseRef} data-active="0" data-reveal>
        <div className="switch-stage" aria-label="Scroll controlled selected works">
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
                <p>{project.summary}</p>
                <div className="switch-meta">
                  <span>{project.year}</span>
                  <span>{project.category}</span>
                  <span>{count} assets</span>
                </div>
                <div className="tag-row">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <button className="text-command" type="button" onClick={() => onOpenProject(project, cover?.id)}>
                  <Images size={18} /> Open project archive <ArrowUpRight size={18} />
                </button>
              </article>
            ))}
          </div>

          <div className="switch-visual-stack">
            {preparedProjects.map(({ project, cover, support }) => (
              <div className="switch-visual-panel" key={project.slug} style={{ "--accent": project.accent } as CSSProperties}>
                <button className="switch-cover" type="button" onClick={() => onOpenProject(project, cover?.id)}>
                  {cover?.type === "video" ? (
                    <video src={cover.src} muted playsInline loop autoPlay />
                  ) : cover ? (
                    <img src={cover.src} alt={cover.alt} loading="lazy" />
                  ) : null}
                </button>
                <div className="switch-thumbs">
                  {support.map((item) => (
                    <button key={item.id} type="button" onClick={() => onOpenProject(project, item.id)}>
                      {item.type === "video" ? (
                        <video src={item.src} muted playsInline loop />
                      ) : (
                        <img src={item.thumb || item.src} alt={item.alt} loading="lazy" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
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
