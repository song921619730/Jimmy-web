import { Menu, X } from "lucide-react";
import { useState } from "react";
import { profile } from "../data/profile";

const navItems = [
  { href: "#works", label: "作品" },
  { href: "#process", label: "流程" },
  { href: "#gallery", label: "图库" },
  { href: "#contact", label: "联系" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Jimmy Song home">
        <span>Jimmy Song</span>
        <small>{profile.chineseName}</small>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="header-cta" href={profile.resumePdf} download>
        下载简历 ↗
      </a>
      <button
        className="icon-button mobile-toggle"
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open ? (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href={profile.resumePdf} download onClick={() => setOpen(false)}>
            Resume PDF
          </a>
        </nav>
      ) : null}
    </header>
  );
}
