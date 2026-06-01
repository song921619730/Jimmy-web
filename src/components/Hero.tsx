import { ArrowDown, ExternalLink } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { awards, profile, resumeHighlights, resumeTimeline, skillGroups, stats } from "../data/profile";

export function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);

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
          <span>{profile.chineseName} / {profile.name}</span>
          <span>{profile.age} 岁</span>
          <span>{profile.location}</span>
        </p>
        <h1 className="hero-title">
          <span>3D Artist</span>
          <span>角色服装与实时材质</span>
        </h1>
        <p className="hero-copy">{profile.intro}</p>
        <p className="hero-copy chinese">{profile.chineseIntro}</p>
        <div className="hero-actions">
          <a className="primary-link" href="#works">
            查看精选作品 <ArrowDown size={18} />
          </a>
          <a className="secondary-link" href={profile.artstation} target="_blank" rel="noreferrer">
            ArtStation <ExternalLink size={16} />
          </a>
        </div>
      </div>

      <div className="hero-resume-grid" aria-label="Resume summary">
        <article className="resume-card resume-current">
          <p>Current Role</p>
          <h2>{profile.role}</h2>
          <strong>{profile.currentCompany}</strong>
          <span>{profile.currentPeriod}</span>
        </article>
        {resumeHighlights.map((item) => (
          <article className="resume-card" key={item.label}>
            <p>{item.label}</p>
            <h3>{item.title}</h3>
            <strong>{item.meta}</strong>
            <span>{item.detail}</span>
          </article>
        ))}
      </div>

      <div className="hero-details-grid" aria-label="Experience and skills">
        <section className="resume-panel">
          <p className="panel-label">Experience / Education</p>
          <div className="timeline-list">
            {resumeTimeline.map((item) => (
              <article key={`${item.period}-${item.title}`}>
                <time>{item.period}</time>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.role}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="resume-panel">
          <p className="panel-label">Awards</p>
          <ul className="award-list">
            {awards.map((award) => (
              <li key={award}>{award}</li>
            ))}
          </ul>
        </section>
        <section className="resume-panel resume-skills">
          <p className="panel-label">Skills</p>
          {skillGroups.map((group) => (
            <div className="skill-group" key={group.label}>
              <h3>{group.label}</h3>
              <p>{group.tools.join(" / ")}</p>
            </div>
          ))}
        </section>
      </div>

      <div className="stats-strip" aria-label="Portfolio summary">
        {stats.map((item) => (
          <div className="stat" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
