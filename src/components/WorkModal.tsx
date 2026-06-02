import { Image as ImageIcon, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { GeneratedMediaItem } from "../data/generatedMedia";
import type { Language } from "../data/i18n";
import { uiCopy } from "../data/i18n";
import type { Project } from "../data/projects";

gsap.registerPlugin(ScrollTrigger);

const STACK_STEP_VH = 0.58;

function getStackStep(item: GeneratedMediaItem) {
  if (item.ratio >= 1.45) return 0.48;
  if (item.ratio >= 1.05) return 0.56;
  if (item.ratio >= 0.72) return 0.68;
  return 0.82;
}

function getStackFit(item: GeneratedMediaItem) {
  if (item.ratio < 0.58) return "tall";
  if (item.ratio < 0.92) return "portrait";
  return "landscape";
}

type WorkModalProps = {
  language: Language;
  project: Project | null;
  media: GeneratedMediaItem[];
  initialMediaId: string | null;
  onClose: () => void;
};

export function WorkModal({ language, project, media, initialMediaId, onClose }: WorkModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLElement | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const copy = uiCopy[language].modal;

  const startIndex = useMemo(() => {
    const index = media.findIndex((item) => item.id === initialMediaId);
    return index >= 0 ? index : 0;
  }, [initialMediaId, media]);

  const orderedMedia = useMemo(() => {
    if (!media.length) return [];
    return [...media.slice(startIndex), ...media.slice(0, startIndex)];
  }, [media, startIndex]);

  const transitionSteps = useMemo(() => orderedMedia.slice(0, -1).map((item) => getStackStep(item)), [orderedMedia]);

  const stackScroll = useMemo(
    () => 1 + transitionSteps.reduce((total, step) => total + step, 0),
    [transitionSteps],
  );

  useEffect(() => {
    if (!project) return undefined;

    setActiveIndex(0);
    document.body.classList.add("modal-open");
    viewerRef.current?.scrollTo({ top: 0 });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        viewerRef.current?.scrollBy({ top: window.innerHeight * STACK_STEP_VH, behavior: "smooth" });
      }

      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        viewerRef.current?.scrollBy({ top: -window.innerHeight * STACK_STEP_VH, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, project, startIndex]);

  useEffect(() => {
    const root = rootRef.current;
    const scroller = viewerRef.current;
    const track = trackRef.current;
    if (!project || !root || !scroller || !track || orderedMedia.length === 0) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card", root);
      gsap.set(cards, {
        y: (index) => (index === 0 || reduceMotion ? 0 : window.innerHeight),
        zIndex: (index) => index + 1,
        autoAlpha: (index) => (index <= 1 || reduceMotion ? 1 : 0),
        force3D: true,
      });

      if (reduceMotion || cards.length <= 1) return;

      const totalSteps = transitionSteps.reduce((total, step) => total + step, 0);
      const setVisibleCards = (currentStep: number) => {
        let cursor = 0;
        let currentIndex = cards.length - 1;
        let enteringIndex = -1;

        for (let index = 0; index < transitionSteps.length; index += 1) {
          const step = transitionSteps[index];
          if (currentStep < cursor + step) {
            currentIndex = index;
            enteringIndex = index + 1;
            break;
          }
          cursor += step;
        }

        cards.forEach((card, index) => {
          const isVisible = index === currentIndex || index === enteringIndex;
          gsap.set(card, {
            visibility: isVisible ? "visible" : "hidden",
            pointerEvents: index === currentIndex ? "auto" : "none",
          });
        });
      };

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: track,
          scroller,
          start: "top top",
          end: () => `+=${totalSteps * window.innerHeight}`,
          scrub: 0.22,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const currentStep = self.progress * totalSteps;
            setVisibleCards(currentStep);
            let nextIndex = 0;
            let cursor = 0;
            transitionSteps.forEach((step, index) => {
              if (currentStep >= cursor + step * 0.5) nextIndex = index + 1;
              cursor += step;
            });
            setActiveIndex(nextIndex);
          },
        },
      });

      let cursor = 0;
      cards.slice(1).forEach((card, index) => {
        const currentCard = cards[index];
        const duration = transitionSteps[index] ?? STACK_STEP_VH;
        const fadeStart = cursor + duration * 0.64;
        const fadeDuration = duration * 0.34;

        timeline.set(card, { autoAlpha: 1 }, cursor);
        timeline.to(card, { y: 0, duration }, cursor);
        timeline.to(
          currentCard,
          {
            autoAlpha: 0,
            duration: fadeDuration,
          },
          fadeStart,
        );
        timeline.set(currentCard, { pointerEvents: "none" }, cursor + duration);
        timeline.set(card, { pointerEvents: "auto" }, cursor + duration);
        cursor += duration;
      });
    }, root);

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      context.revert();
    };
  }, [orderedMedia, project, transitionSteps]);

  if (!project) return null;

  return createPortal(
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="work-modal image-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="work-modal-title"
        ref={rootRef}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 className="sr-only" id="work-modal-title">
          {project.title}
        </h2>
        <div className="modal-toolbar">
          <div className="viewer-mode-label" aria-label={copy.imageModeLabel}>
            <ImageIcon size={17} /> {copy.imageMode}
          </div>
          <button className="icon-button modal-close" type="button" aria-label={copy.close} onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="stack-viewer" ref={viewerRef}>
          <div className="stack-track" ref={trackRef} style={{ "--stack-scroll": stackScroll } as CSSProperties}>
            <div className="stack-stage" aria-label={`${project.title} ${copy.stackLabel}`}>
              {orderedMedia.map((item, index) => (
                <figure
                  className={`stack-card stack-card-${getStackFit(item)}`}
                  key={`${item.id}-${index}`}
                  data-active={index === activeIndex ? "true" : "false"}
                >
                  {item.type === "video" ? (
                    <video src={item.src} controls playsInline preload="metadata" />
                  ) : (
                    <img src={item.src} alt={item.alt} loading={index <= activeIndex + 1 ? "eager" : "lazy"} />
                  )}
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}
