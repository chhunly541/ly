import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { UI_COPY } from '../data/cvData';
import { Language } from '../types/cv';

interface TopBarProps {
  brandWordmark: string;
  lang: Language;
}

export function TopBar({ brandWordmark, lang }: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = UI_COPY[lang].nav;

  const navItems = [
    { href: '#about', label: t.about },
    { href: '#study', label: t.study },
    { href: '#experience', label: t.experience },
    { href: '#projects', label: t.projects },
    { href: '#skills', label: t.skills },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="no-print sticky top-0 z-40 border-b border-zinc-200 bg-[#FAFAFA]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-5 py-4 sm:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-lg font-bold tracking-tight text-zinc-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8]"
        >
          {brandWordmark}
        </a>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav
          aria-label="Primary sections"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap shrink-0 py-1 text-zinc-600 transition-colors duration-150 hover:text-zinc-950 hover:underline hover:underline-offset-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#1E40AF] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            {t.contactBtn}
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-800 md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={handleNavClick}
              className="mt-2 flex min-h-[44px] items-center justify-center rounded-lg bg-[#1D4ED8] px-4 text-sm font-semibold text-white hover:bg-[#1E40AF]"
            >
              {t.contactBtn}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
