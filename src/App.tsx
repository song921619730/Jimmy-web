import { useMemo, useState } from "react";
import { Gallery } from "./components/Gallery";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ResumeContact } from "./components/ResumeContact";
import { SelectedWorks } from "./components/SelectedWorks";
import { WorkModal } from "./components/WorkModal";
import { generatedMedia, type GeneratedMediaItem } from "./data/generatedMedia";
import type { Project } from "./data/projects";

function groupMedia(items: GeneratedMediaItem[]) {
  return items.reduce<Record<string, GeneratedMediaItem[]>>((groups, item) => {
    groups[item.project] ??= [];
    groups[item.project].push(item);
    return groups;
  }, {});
}

export default function App() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeMediaId, setActiveMediaId] = useState<string | null>(null);
  const mediaByProject = useMemo(() => groupMedia(generatedMedia), []);

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
      <Header />
      <main>
        <Hero />
        <SelectedWorks mediaByProject={mediaByProject} onOpenProject={openProject} />
        <ResumeContact />
        <Gallery media={generatedMedia} onOpenProject={openProject} />
      </main>
      <WorkModal project={activeProject} media={activeMedia} initialMediaId={activeMediaId} onClose={closeProject} />
    </>
  );
}
