import { Menu, X } from "lucide-react";
import { useState } from "react";
import type { Language } from "../data/i18n";
import { uiCopy } from "../data/i18n";
import { profileContent, profileLinks } from "../data/profile";

type HeaderProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
};

export function Header({ language, onLanguageChange }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const copy = uiCopy[language];
  const profile = profileContent[language];
  const nextLanguage: Language = language === "zh" ? "en" : "zh";

  const switchLanguage = () => {
    setOpen(false);
    onLanguageChange(nextLanguage);
  };

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label={`${profileLinks.name} home`}>
        <span>{profileLinks.name}</span>
        <small>{profile.brandMeta}</small>
      </a>
      <nav className="desktop-nav" aria-label={copy.primaryNavigation}>
        {copy.nav.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <button className="language-toggle" type="button" aria-label={copy.languageToggleLabel} onClick={switchLanguage}>
          <span>{copy.languageName}</span>
          <strong>{copy.alternateLanguageName}</strong>
        </button>
      </div>
      <button
        className="icon-button mobile-toggle"
        type="button"
        aria-label={open ? copy.menuClose : copy.menuOpen}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open ? (
        <nav className="mobile-nav" aria-label={copy.mobileNavigation}>
          {copy.nav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <button className="mobile-language-toggle" type="button" onClick={switchLanguage}>
            {copy.languageToggleLabel}
          </button>
        </nav>
      ) : null}
    </header>
  );
}
