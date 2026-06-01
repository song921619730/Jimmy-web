import { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { Gallery } from "./components/Gallery";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ResumeContact } from "./components/ResumeContact";
import { SelectedWorks } from "./components/SelectedWorks";
import { WorkModal } from "./components/WorkModal";
import { generatedMedia, type GeneratedMediaItem } from "./data/generatedMedia";
import type { Language } from "./data/i18n";
import { getProjects, type Project } from "./data/projects";

function groupMedia(items: GeneratedMediaItem[]) {
  return items.reduce<Record<string, GeneratedMediaItem[]>>((groups, item) => {
    groups[item.project] ??= [];
    groups[item.project].push(item);
    return groups;
  }, {});
}

function captureViewportAnchor() {
  const anchors = Array.from(document.querySelectorAll<HTMLElement>("#top, #works, #process, #contact, #gallery"));
  let best: HTMLElement | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const anchor of anchors) {
    const rect = anchor.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) continue;

    const distance = Math.abs(rect.top - 96);
    if (distance < bestDistance) {
      best = anchor;
      bestDistance = distance;
    }
  }

  if (!best) return null;

  return {
    id: best.id,
    top: best.getBoundingClientRect().top,
  };
}

function restoreViewportAnchor(anchor: ReturnType<typeof captureViewportAnchor>) {
  if (!anchor) return;

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const element = document.getElementById(anchor.id);
      if (!element) return;

      const nextTop = element.getBoundingClientRect().top;
      const delta = nextTop - anchor.top;
      if (Math.abs(delta) > 1) {
        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        window.scrollBy({ top: delta, left: 0, behavior: "auto" });
        root.style.scrollBehavior = previousScrollBehavior;
      }
    });
  });
}

export default function App() {
  const [language, setLanguage] = useState<Language>("zh");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeMediaId, setActiveMediaId] = useState<string | null>(null);
  const mediaByProject = useMemo(() => groupMedia(generatedMedia), []);
  const projects = useMemo(() => getProjects(language), [language]);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  useEffect(() => {
    setActiveProject((current) => {
      if (!current) return null;
      return projects.find((project) => project.slug === current.slug) ?? current;
    });
  }, [projects]);

  const changeLanguage = (nextLanguage: Language) => {
    if (nextLanguage === language) return;

    const anchor = captureViewportAnchor();
    const updateLanguage = () => setLanguage(nextLanguage);
    const transitionDocument = document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };

    if (transitionDocument.startViewTransition) {
      transitionDocument.startViewTransition(() => {
        flushSync(updateLanguage);
      });
    } else {
      updateLanguage();
    }

    restoreViewportAnchor(anchor);
  };

  const activeMedia = activeProject ? mediaByProject[activeProject.slug] ?? [] : [];
  const openProject = (project: Project, mediaId?: string) => {
    setActiveProject(project);
    setActiveMediaId(mediaId ?? null);
  };
  const closeProject = () => {
    setActiveProject(null);
    setActiveMediaId(null);
  };

  return (
    <>
      <Header language={language} onLanguageChange={changeLanguage} />
      <main>
        <Hero language={language} />
        <SelectedWorks
          language={language}
          projects={projects}
          mediaByProject={mediaByProject}
          onOpenProject={openProject}
        />
        <ResumeContact language={language} />
        <Gallery language={language} projects={projects} media={generatedMedia} onOpenProject={openProject} />
      </main>
      <WorkModal
        language={language}
        project={activeProject}
        media={activeMedia}
        initialMediaId={activeMediaId}
        onClose={closeProject}
      />
    </>
  );
}
