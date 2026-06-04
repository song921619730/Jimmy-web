import { Maximize2 } from "lucide-react";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import type { Language } from "../data/i18n";
import { uiCopy } from "../data/i18n";
import type { Project } from "../data/projects";
import type { GeneratedMediaItem } from "../data/generatedMedia";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { OptimizedImage } from "./OptimizedImage";

type GalleryProps = {
  language: Language;
  projects: Project[];
  media: GeneratedMediaItem[];
  onOpenProject: (project: Project, mediaId?: string) => void;
};

export function Gallery({ language, projects, media, onOpenProject }: GalleryProps) {
  const [activeProject, setActiveProject] = useState("all");
  const scopeRef = useGsapReveal<HTMLElement>();
  const copy = uiCopy[language].gallery;

  const filtered = useMemo(() => {
    const images = media.filter((item) => item.type === "image");
    if (activeProject === "all") return images.slice(0, 48);
    return images.filter((item) => item.project === activeProject).slice(0, 48);
  }, [activeProject, media]);

  return (
    <section className="section gallery-section" id="gallery" ref={scopeRef}>
      <div className="section-heading gallery-heading" data-reveal>
        <div>
          <p>{copy.label}</p>
          {copy.heading ? <h2>{copy.heading}</h2> : null}
        </div>
      </div>

      <div className="project-filter" data-reveal aria-label={copy.filterLabel}>
        <button className={activeProject === "all" ? "active" : ""} type="button" onClick={() => setActiveProject("all")}>
          {copy.all}
        </button>
        {projects.map((project) => (
          <button
            className={activeProject === project.slug ? "active" : ""}
            type="button"
            key={project.slug}
            onClick={() => setActiveProject(project.slug)}
          >
            {project.title}
          </button>
        ))}
      </div>

      <div className="gallery-grid" data-reveal>
        {filtered.map((item) => {
          const project = projects.find((candidate) => candidate.slug === item.project);
          return (
            <button
              className="gallery-item"
              style={{ "--media-ratio": item.ratio || 1 } as CSSProperties}
              type="button"
              key={item.id}
              onClick={() => project && onOpenProject(project, item.id)}
              aria-label={`${copy.open} ${project?.title ?? item.project}`}
            >
              <OptimizedImage
                item={item}
                includeLarge={false}
                sizes="(max-width: 760px) calc(100vw - 36px), (max-width: 1040px) 46vw, 24vw"
                alt={item.alt}
                loading="lazy"
              />
              <span>
                <Maximize2 size={16} />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
