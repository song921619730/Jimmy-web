import { Image as ImageIcon, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { GeneratedMediaItem } from "../data/generatedMedia";
import type { Project } from "../data/projects";

type WorkModalProps = {
  project: Project | null;
  media: GeneratedMediaItem[];
  initialMediaId: string | null;
  onClose: () => void;
};

export function WorkModal({ project, media, initialMediaId, onClose }: WorkModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});

  const startIndex = useMemo(() => {
    const index = media.findIndex((item) => item.id === initialMediaId);
    return index >= 0 ? index : 0;
  }, [initialMediaId, media]);

  const scrollToIndex = (index: number, behavior: ScrollBehavior = "smooth") => {
    const nextIndex = Math.max(0, Math.min(media.length - 1, index));
    const nextItem = media[nextIndex];
    if (!nextItem) return;

    setActiveIndex(nextIndex);
    itemRefs.current[nextItem.id]?.scrollIntoView({ block: "center", behavior });
  };

  useEffect(() => {
    if (!project) return undefined;

    setActiveIndex(startIndex);
    document.body.classList.add("modal-open");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        scrollToIndex(activeIndex + 1);
      }

      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        scrollToIndex(activeIndex - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, onClose, project, startIndex]);

  useEffect(() => {
    if (!project) return undefined;

    const target = media[startIndex];
    const frame = window.requestAnimationFrame(() => {
      itemRefs.current[target?.id]?.scrollIntoView({ block: "center" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [media, project, startIndex]);

  if (!project) return null;

  const handleViewerScroll = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const center = viewer.getBoundingClientRect().top + viewer.clientHeight / 2;
    let closestIndex = activeIndex;
    let closestDistance = Number.POSITIVE_INFINITY;

    media.forEach((item, index) => {
      const element = itemRefs.current[item.id];
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - center);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeIndex) setActiveIndex(closestIndex);
  };

  return createPortal(
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="work-modal image-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="work-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 className="sr-only" id="work-modal-title">
          {project.title}
        </h2>
        <div className="modal-toolbar">
          <div className="viewer-mode-label" aria-label="图像模式">
            <ImageIcon size={17} /> 图像模式
          </div>
          <button className="icon-button modal-close" type="button" aria-label="关闭作品浏览" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="image-mode-viewer" ref={viewerRef} onScroll={handleViewerScroll}>
          <div className="image-mode-spacer" />
          {media.map((item, index) => (
            <figure
              className="image-slide"
              key={item.id}
              ref={(element) => {
                itemRefs.current[item.id] = element;
              }}
            >
              {item.type === "video" ? (
                <video src={item.src} controls playsInline preload="metadata" />
              ) : (
                <img src={item.src} alt={item.alt} loading={Math.abs(index - activeIndex) <= 1 ? "eager" : "lazy"} />
              )}
            </figure>
          ))}
          <div className="image-mode-spacer" />
        </div>
      </section>
    </div>,
    document.body,
  );
}
