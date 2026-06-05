import { Maximize2 } from "lucide-react";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const galleryImageSizes = "(max-width: 760px) calc(100vw - 36px), (max-width: 1040px) 46vw, 24vw";
const immediateSwitchPreloadCount = 24;

function preloadGalleryImages(items: GeneratedMediaItem[], limit = 48) {
  if (typeof window === "undefined") return Promise.resolve();

  const targets = items.filter((item) => item.type === "image").slice(0, limit);
  if (!targets.length) return Promise.resolve();

  return Promise.allSettled(
    targets.map(
      (item) =>
        new Promise<void>((resolve) => {
          const image = new Image();
          const finish = () => resolve();

          image.onload = () => {
            const decode = image.decode?.();
            if (decode) {
              decode.then(finish).catch(finish);
              return;
            }

            finish();
          };
          image.onerror = finish;
          image.sizes = galleryImageSizes;
          image.srcset = item.thumbAvif
            ? `${item.thumbAvif} ${item.thumbWidth || 720}w`
            : `${item.thumb} ${item.thumbWidth || 720}w`;
          image.src = item.thumbAvif || item.thumb || item.srcAvif || item.src;
        }),
    ),
  ).then(() => undefined);
}

export function Gallery({ language, projects, media, onOpenProject }: GalleryProps) {
  const [activeProject, setActiveProject] = useState("all");
  const [pendingProject, setPendingProject] = useState<string | null>(null);
  const [galleryReady, setGalleryReady] = useState(false);
  const switchIdRef = useRef(0);
  const scopeRef = useGsapReveal<HTMLElement>();
  const copy = uiCopy[language].gallery;

  const imageItems = useMemo(() => media.filter((item) => item.type === "image"), [media]);

  const getFilteredImages = useCallback(
    (projectSlug: string) => {
      if (projectSlug === "all") return imageItems.slice(0, 48);
      return imageItems.filter((item) => item.project === projectSlug).slice(0, 48);
    },
    [imageItems],
  );

  const filtered = useMemo(() => getFilteredImages(activeProject), [activeProject, getFilteredImages]);

  const handleProjectChange = useCallback(
    (projectSlug: string) => {
      if (projectSlug === activeProject) {
        switchIdRef.current += 1;
        setPendingProject(null);
        return;
      }

      const switchId = switchIdRef.current + 1;
      switchIdRef.current = switchId;
      setPendingProject(projectSlug);

      preloadGalleryImages(getFilteredImages(projectSlug), immediateSwitchPreloadCount).then(() => {
        if (switchIdRef.current !== switchId) return;
        setActiveProject(projectSlug);
        setPendingProject(null);
      });
    },
    [activeProject, getFilteredImages],
  );

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || galleryReady) return undefined;

    if (!("IntersectionObserver" in window)) {
      setGalleryReady(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setGalleryReady(true);
        observer.disconnect();
      },
      { rootMargin: "900px 0px" },
    );

    observer.observe(scope);
    return () => observer.disconnect();
  }, [galleryReady, scopeRef]);

  useEffect(() => {
    if (!galleryReady) return;

    const images = media.filter((item) => item.type === "image");
    if (activeProject === "all") {
      preloadGalleryImages(images.slice(48, 96));
      return;
    }

    preloadGalleryImages(images.filter((item) => item.project !== activeProject).slice(0, 48));
  }, [activeProject, galleryReady, media]);

  useEffect(() => {
    if (filtered.length) return;

    const images = media.filter((item) => item.type === "image");
    if (activeProject !== "all" && !images.some((item) => item.project === activeProject)) {
      setActiveProject("all");
      setPendingProject(null);
    }
  }, [activeProject, filtered.length, media]);

  return (
    <section className="section gallery-section" id="gallery" ref={scopeRef}>
      <div className="section-heading gallery-heading" data-reveal>
        <div>
          <p>{copy.label}</p>
          {copy.heading ? <h2>{copy.heading}</h2> : null}
        </div>
      </div>

      <div className="project-filter" data-reveal aria-label={copy.filterLabel}>
        <button
          className={activeProject === "all" ? "active" : ""}
          type="button"
          onClick={() => handleProjectChange("all")}
          aria-busy={pendingProject === "all" ? "true" : undefined}
          disabled={pendingProject === "all"}
        >
          {copy.all}
        </button>
        {projects.map((project) => (
          <button
            className={activeProject === project.slug ? "active" : ""}
            type="button"
            key={project.slug}
            onClick={() => handleProjectChange(project.slug)}
            aria-busy={pendingProject === project.slug ? "true" : undefined}
            disabled={pendingProject === project.slug}
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
                sizes={galleryImageSizes}
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
