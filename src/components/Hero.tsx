import { ArrowDown, ExternalLink } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Language } from "../data/i18n";
import { uiCopy } from "../data/i18n";
import { profileContent, profileLinks } from "../data/profile";

type HeroProps = {
  language: Language;
};

export function Hero({ language }: HeroProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const copy = uiCopy[language];
  const profile = profileContent[language];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { duration: 0.9, ease: "power3.out" } });
      timeline
        .from(".hero-kicker, .hero-title span, .hero-copy, .hero-actions, .resume-card", {
          y: 48,
          autoAlpha: 0,
          stagger: 0.08,
        })
        .from(".stat", { y: 24, autoAlpha: 0, stagger: 0.08 }, "<0.24");
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={rootRef}>
      <div className="hero-copy-block">
        <p className="hero-kicker">
          <span>{profile.chineseName} / {profileLinks.name}</span>
          <span>{profile.age} {copy.hero.ageSuffix}</span>
          <span>{profile.location}</span>
        </p>
        <h1 className="hero-title">
          {copy.hero.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p className="hero-copy">{profile.intro}</p>
        <p className="hero-copy chinese">{profile.secondaryIntro}</p>
        <div className="hero-actions">
          <a className="primary-link" href="#works">
            {copy.hero.primaryAction}<ArrowDown size={18} />
          </a>
          <a className="secondary-link" href={profileLinks.artstation} target="_blank" rel="noreferrer">
            ArtStation <ExternalLink size={16} />
          </a>
        </div>
      </div>

      <div className="hero-resume-grid" aria-label={copy.hero.resumeSummaryLabel}>
        <article className="resume-card resume-current">
          <p>{copy.hero.currentRole}</p>
          <h2>{profile.role}</h2>
          <strong>{profile.currentCompany}</strong>
          <span>{profile.currentPeriod}</span>
        </article>
        <div className="resume-highlights">
          {profile.resumeHighlights.map((item) => (
            <article className="resume-card resume-highlight-card" key={item.label}>
              <div className="resume-highlight-heading">
                <p>{item.label}</p>
                <h3>{item.title}</h3>
              </div>
              <strong>{item.meta}</strong>
              <span>{item.detail}</span>
            </article>
          ))}
        </div>
      </div>

      <div className="hero-details-grid" aria-label={copy.hero.detailsLabel}>
        <section className="resume-panel">
          <p className="panel-label">{copy.hero.experienceEducation}</p>
          <div className="timeline-list">
            {profile.resumeTimeline.map((item) => (
              <article key={`${item.period}-${item.title}`}>
                <time>{item.period}</time>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.role}</p>
                  {"details" in item && item.details ? (
                    <ul className="timeline-details">
                      {item.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="resume-panel resume-side-panel">
          <div className="resume-side-block resume-skills">
            <p className="panel-label">{copy.hero.skills}</p>
            {profile.skillGroups.map((group) => (
              <div className="skill-group" key={group.label}>
                <h3>{group.label}</h3>
                <p>{group.tools.join(" / ")}</p>
              </div>
            ))}
          </div>
          <div className="resume-side-block">
            <p className="panel-label">{copy.hero.awards}</p>
            <ul className="award-list">
              {profile.awards.map((award) => (
                <li key={award}>{award}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <div className="stats-strip" aria-label={copy.hero.portfolioSummary}>
        {profile.stats.map((item) => (
          <div className="stat" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
