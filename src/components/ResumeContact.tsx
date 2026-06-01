import { Download, ExternalLink, Mail, Phone } from "lucide-react";
import type { Language } from "../data/i18n";
import { uiCopy } from "../data/i18n";
import { profileContent, profileLinks } from "../data/profile";
import { useGsapReveal } from "../hooks/useGsapReveal";

type ResumeContactProps = {
  language: Language;
};

export function ResumeContact({ language }: ResumeContactProps) {
  const processRef = useGsapReveal<HTMLElement>();
  const contactRef = useGsapReveal<HTMLElement>();
  const copy = uiCopy[language];
  const profile = profileContent[language];

  return (
    <>
      <section className="section process-section" id="process" ref={processRef}>
        <div className="section-heading" data-reveal>
          <p>{copy.process.label}</p>
          <h2>{copy.process.heading}</h2>
        </div>
        <div className="process-grid">
          {profile.workflow.map((item, index) => (
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
          <p>{copy.contact.label}</p>
          <h2>{copy.contact.heading}</h2>
          <p>{profile.secondaryIntro}</p>
        </div>
        <div className="contact-panel" data-reveal>
          <a className="contact-action primary" href={profileLinks.resumePdf} download>
            <Download size={20} /> {copy.contact.download}
          </a>
          <a className="contact-action" href={`mailto:${profile.email}`}>
            <Mail size={20} /> {profile.email}
          </a>
          <a className="contact-action" href={`tel:${profileLinks.phone.replace(/\s/g, "")}`}>
            <Phone size={20} /> {profileLinks.phone}
          </a>
          <a className="contact-action" href={profileLinks.artstation} target="_blank" rel="noreferrer">
            ArtStation <ExternalLink size={18} />
          </a>
          <a className="contact-action" href={profileLinks.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <ExternalLink size={18} />
          </a>
        </div>
      </section>
    </>
  );
}
