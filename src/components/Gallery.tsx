import { Maximize2 } from "lucide-react";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
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
const categoryPreviewPreloadCount = 8;

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

function getCategoryPreviewImages(items: GeneratedMediaItem[], activeProject: string) {
  const projectCounts = new Map<string, number>();
  const previewItems: GeneratedMediaItem[] = [];

  for (const item of items) {
    if (item.type !== "image") continue;
    if (activeProject !== "all" && item.project === activeProject) continue;

    const count = projectCounts.get(item.project) ?? 0;
    if (count >= categoryPreviewPreloadCount) continue;

    projectCounts.set(item.project, count + 1);
    previewItems.push(item);
  }

  return previewItems;
}

export function Gallery({ language, projects, media, onOpenProject }: GalleryProps) {
  const [activeProject, setActiveProject] = useState("all");
  const [galleryReady, setGalleryReady] = useState(false);
  const [loadedImageIds, setLoadedImageIds] = useState<ReadonlySet<string>>(() => new Set());
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
      if (projectSlug === activeProject) return;

      setActiveProject(projectSlug);
    },
    [activeProject],
  );

  const markImageLoaded = useCallback((imageId: string) => {
    setLoadedImageIds((currentIds) => {
      if (currentIds.has(imageId)) return currentIds;

      const nextIds = new Set(currentIds);
      nextIds.add(imageId);
      return nextIds;
    });
  }, []);

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
    preloadGalleryImages(getCategoryPreviewImages(images, activeProject));
  }, [activeProject, galleryReady, media]);

  useEffect(() => {
    if (filtered.length) return;

    const images = media.filter((item) => item.type === "image");
    if (activeProject !== "all" && !images.some((item) => item.project === activeProject)) {
      setActiveProject("all");
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
        >
          {copy.all}
        </button>
        {projects.map((project) => (
          <button
            className={activeProject === project.slug ? "active" : ""}
            type="button"
            key={project.slug}
            onClick={() => handleProjectChange(project.slug)}
          >
            {project.title}
          </button>
        ))}
      </div>

      <div className="gallery-grid" data-reveal>
        {filtered.map((item, itemIndex) => {
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
                loading={itemIndex < 12 ? "eager" : "lazy"}
                width={item.thumbWidth || item.width}
                height={item.thumbHeight || item.height}
                data-loaded={loadedImageIds.has(item.id) ? "true" : "false"}
                onLoad={() => markImageLoaded(item.id)}
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
