import { Download, ExternalLink, Mail, Phone } from "lucide-react";
import { profile, workflow } from "../data/profile";
import { useGsapReveal } from "../hooks/useGsapReveal";

export function ResumeContact() {
  const processRef = useGsapReveal<HTMLElement>();
  const contactRef = useGsapReveal<HTMLElement>();

  return (
    <>
      <section className="section process-section" id="process" ref={processRef}>
        <div className="section-heading" data-reveal>
          <p>Process</p>
          <h2>Built for teams that need visual quality and production reliability.</h2>
        </div>
        <div className="process-grid">
          {workflow.map((item, index) => (
            <article className="process-item" key={item.title} data-reveal>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section contact-section" id="contact" ref={contactRef}>
        <div className="contact-copy" data-reveal>
          <p>Resume / Contact</p>
          <h2>Available for game art, 3D costume, material, and AI-assisted workflow roles.</h2>
          <p>{profile.chineseIntro}</p>
        </div>
        <div className="contact-panel" data-reveal>
          <a className="contact-action primary" href={profile.resumePdf} download>
            <Download size={20} /> Download resume PDF
          </a>
          <a className="contact-action" href={`mailto:${profile.email}`}>
            <Mail size={20} /> {profile.email}
          </a>
          <a className="contact-action" href={`tel:${profile.phone.replace(/\s/g, "")}`}>
            <Phone size={20} /> {profile.phone}
          </a>
          <a className="contact-action" href={profile.artstation} target="_blank" rel="noreferrer">
            ArtStation <ExternalLink size={18} />
          </a>
          <a className="contact-action" href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <ExternalLink size={18} />
          </a>
        </div>
      </section>
    </>
  );
}
