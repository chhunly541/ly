import {
  ArrowUpRight,
  Check,
  Copy,
  Edit3,
  ExternalLink,
  Globe,
  Layers,
  Mail,
  MapPin,
  Phone,
  Printer,
  Send,
  Share2,
  User,
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CVEditorDrawer } from './components/CVEditorDrawer';
import { ProjectModal } from './components/ProjectModal';
import { TopBar } from './components/TopBar';
import { DEFAULT_CV_DATA, UI_COPY } from './data/cvData';
import { CVProfile, Language, ProjectCategory, ProjectItem } from './types/cv';
import {
  clearSavedProfile,
  encodeProfileToHash,
  loadSavedProfile,
  saveProfileToStorage,
} from './utils/shareState';

type FilterOption = 'all' | ProjectCategory;

export default function App() {
  const [lang, setLang] = useState<Language>('km');
  const [profile, setProfile] = useState<CVProfile>(() => loadSavedProfile(DEFAULT_CV_DATA));
  const [projectFilter, setProjectFilter] = useState<FilterOption>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const [portraitError, setPortraitError] = useState(false);
  const [projectImageErrors, setProjectImageErrors] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Quick message form state
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [messagePrepared, setMessagePrepared] = useState(false);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    setPortraitError(false);
  }, [profile.portraitUrl]);

  const handleProfileChange = (next: CVProfile) => {
    setProfile(next);
    saveProfileToStorage(next);
  };

  const handleResetProfile = () => {
    clearSavedProfile();
    setProfile(DEFAULT_CV_DATA);
  };

  const handleCopyShareLink = async () => {
    const encoded = encodeProfileToHash(profile);
    const baseUrl = window.location.origin + window.location.pathname;
    const isModified = JSON.stringify(profile) !== JSON.stringify(DEFAULT_CV_DATA);
    const shareUrl = isModified && encoded ? `${baseUrl}#data=${encoded}` : baseUrl;

    try {
      await navigator.clipboard.writeText(shareUrl);
      if (isModified && encoded) {
        window.history.replaceState(null, '', `#data=${encoded}`);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2400);
    } catch {
      window.history.replaceState(null, '', shareUrl);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.contact.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !messageBody.trim()) return;
    const subject = encodeURIComponent(
      lang === 'km'
        ? `សំណើទំនាក់ទំនង CV ពី ${senderName.trim()}`
        : `CV Inquiry from ${senderName.trim()}`,
    );
    const body = encodeURIComponent(
      `Name: ${senderName.trim()}\nEmail: ${senderEmail.trim() || 'Not provided'}\n\n${messageBody.trim()}`,
    );
    window.location.href = `mailto:${profile.contact.email}?subject=${subject}&body=${body}`;
    setMessagePrepared(true);
    setTimeout(() => setMessagePrepared(false), 4000);
  };

  const filteredProjects = useMemo(() => {
    if (projectFilter === 'all') return profile.projects;
    return profile.projects.filter((p) => p.category === projectFilter);
  }, [profile.projects, projectFilter]);

  const copy = UI_COPY[lang];

  return (
    <div id="top" className="min-h-screen bg-[#FAFAFA] text-zinc-900">
      <TopBar brandWordmark={profile.brandWordmark[lang]} lang={lang} />

      <main className="mx-auto max-w-[1200px] px-5 sm:px-8">
        {/* HERO SPLIT */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
            {/* Left Column */}
            <div className="flex flex-col justify-between lg:col-span-7">
              <div>
                <p className="text-xs font-medium tracking-wide text-zinc-500">
                  {copy.hero.kicker}
                </p>

                <h1 className="mt-4 font-display text-[clamp(2.2rem,4vw,3.4rem)] font-bold leading-[1.12] tracking-tight text-zinc-950 text-balance">
                  {profile.fullName[lang]}
                </h1>

                <p className="mt-3 font-serif-editorial text-xl font-medium leading-snug text-zinc-800 sm:text-2xl text-balance">
                  {profile.headline[lang]}
                </p>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-600">
                  {profile.tagline[lang]}
                </p>

                {/* Primary & Secondary CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#contact"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#1D4ED8] px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#1E40AF] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
                  >
                    <Mail className="h-4 w-4" />
                    <span>{copy.hero.primaryCta}</span>
                  </a>

                  <a
                    href="#projects"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition-colors duration-150 hover:bg-zinc-50 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
                  >
                    <span>{copy.hero.secondaryCta}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Workspace Utility Toolbar (below hero CTA, not in TopBar) */}
              <div className="no-print mt-10 flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-6">
                {/* Segmented Language Toggle */}
                <div
                  role="group"
                  aria-label="Language switcher"
                  className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-100 p-1"
                >
                  <button
                    type="button"
                    onClick={() => setLang('km')}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      lang === 'km'
                        ? 'bg-white text-zinc-950 shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    ភាសាខ្មែរ
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      lang === 'en'
                        ? 'bg-white text-zinc-950 shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    English
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-950 whitespace-nowrap shrink-0"
                >
                  {copiedLink ? (
                    <Check className="h-3.5 w-3.5 text-[#1D4ED8]" />
                  ) : (
                    <Share2 className="h-3.5 w-3.5" />
                  )}
                  <span>{copiedLink ? copy.hero.copied : copy.hero.copyLink}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-950 whitespace-nowrap shrink-0"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>{copy.hero.printPdf}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditorOpen(true)}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-950 whitespace-nowrap shrink-0"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>{copy.hero.editCv}</span>
                </button>
              </div>
            </div>

            {/* Right Column Portrait */}
            <div className="lg:col-span-5">
              <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 lg:aspect-auto lg:h-full lg:min-h-[420px]">
                {profile.portraitUrl && !portraitError ? (
                  <img
                    src={profile.portraitUrl}
                    alt={profile.fullName[lang]}
                    referrerPolicy="no-referrer"
                    onError={() => setPortraitError(true)}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-100 p-8 text-center text-zinc-500">
                    <User className="h-10 w-10 text-zinc-400" />
                    <p className="font-display text-base font-semibold text-zinc-800">
                      {profile.fullName[lang]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4-Column Highlights Strip (below hero split) */}
          <div className="mt-10 grid grid-cols-2 border-y border-zinc-200 bg-white sm:grid-cols-4">
            {profile.highlights.map((stat, index) => (
              <div
                key={index}
                className={`p-5 sm:p-6 ${
                  index < profile.highlights.length - 1 ? 'border-zinc-200 sm:border-r' : ''
                } ${index % 2 === 0 ? 'border-r border-zinc-200 sm:border-r' : ''} ${
                  index < 2 ? 'border-b border-zinc-200 sm:border-b-0' : ''
                }`}
              >
                <p className="font-display text-xl font-bold tracking-tight text-zinc-950 tabular-nums sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs leading-snug text-zinc-500">{stat.label[lang]}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 01. CONTACT INFORMATION */}
        <section id="contact" className="border-t border-zinc-200 py-14 sm:py-16 print-break-inside-avoid">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-mono-tabular text-xs font-medium text-[#1D4ED8]">
                {copy.sections.contact.num}
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl text-balance">
                {copy.sections.contact.title}
              </h2>
              <p className="mt-1 text-xs text-zinc-500">{copy.sections.contact.subtitle}</p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                {copy.sections.contact.lead}
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="grid gap-8 lg:grid-cols-12">
                {/* Direct Details */}
                <div className="space-y-4 lg:col-span-6">
                  <div className="rounded-xl border border-zinc-200 bg-white p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-zinc-500">
                          {copy.sections.contact.emailLabel}
                        </p>
                        <a
                          href={`mailto:${profile.contact.email}`}
                          className="mt-1 block truncate font-medium text-zinc-950 hover:text-[#1D4ED8]"
                        >
                          {profile.contact.email}
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="no-print inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-200 px-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 shrink-0"
                      >
                        {copiedEmail ? (
                          <Check className="h-3.5 w-3.5 text-[#1D4ED8]" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        <span>
                          {copiedEmail
                            ? copy.sections.contact.emailCopied
                            : copy.sections.contact.copyEmail}
                        </span>
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 border-t border-zinc-100 pt-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-zinc-500">
                          {copy.sections.contact.phoneLabel}
                        </p>
                        <a
                          href={`tel:${profile.contact.phone.replace(/\s+/g, '')}`}
                          className="mt-1 inline-flex items-center gap-1.5 font-mono-tabular text-sm font-medium text-zinc-900 hover:text-[#1D4ED8]"
                        >
                          <Phone className="h-3.5 w-3.5 text-zinc-400" />
                          <span>{profile.contact.phone}</span>
                        </a>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-zinc-500">
                          {copy.sections.contact.telegramLabel}
                        </p>
                        <a
                          href={`https://t.me/${profile.contact.telegram.replace(/^@/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-zinc-900 hover:text-[#1D4ED8]"
                        >
                          <span>{profile.contact.telegram}</span>
                          <ExternalLink className="h-3 w-3 text-zinc-400" />
                        </a>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-zinc-100 pt-4">
                      <p className="text-xs font-medium text-zinc-500">
                        {copy.sections.contact.locationLabel}
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-zinc-800">
                        <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{profile.contact.location[lang]}</span>
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-zinc-100 pt-4 text-xs font-semibold text-zinc-700">
                      {profile.contact.github && (
                        <a
                          href={profile.contact.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:text-[#1D4ED8]"
                        >
                          <span>GitHub</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {profile.contact.linkedin && (
                        <a
                          href={profile.contact.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:text-[#1D4ED8]"
                        >
                          <span>LinkedIn</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {profile.contact.website && (
                        <a
                          href={profile.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:text-[#1D4ED8]"
                        >
                          <Globe className="h-3.5 w-3.5" />
                          <span>Website</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Contact Composer */}
                <div className="no-print lg:col-span-6">
                  <form
                    onSubmit={handleSendMessage}
                    className="rounded-xl border border-zinc-200 bg-white p-5 space-y-3"
                  >
                    <p className="text-sm font-semibold text-zinc-900">
                      {copy.sections.contact.formTitle}
                    </p>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder={copy.sections.contact.namePlaceholder}
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#1D4ED8] focus:bg-white focus:outline-none"
                    />
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder={copy.sections.contact.senderEmailPlaceholder}
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#1D4ED8] focus:bg-white focus:outline-none"
                    />
                    <textarea
                      rows={3}
                      required
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      placeholder={copy.sections.contact.messagePlaceholder}
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#1D4ED8] focus:bg-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E40AF]"
                    >
                      <Send className="h-4 w-4" />
                      <span>{copy.sections.contact.sendButton}</span>
                    </button>
                    {messagePrepared && (
                      <p className="text-xs font-medium text-[#1D4ED8]">
                        {copy.sections.contact.sentNote}
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02. ABOUT ME */}
        <section id="about" className="border-t border-zinc-200 py-14 sm:py-16 print-break-inside-avoid">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-mono-tabular text-xs font-medium text-[#1D4ED8]">
                {copy.sections.about.num}
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl text-balance">
                {copy.sections.about.title}
              </h2>
              <p className="mt-1 text-xs text-zinc-500">{copy.sections.about.subtitle}</p>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <p className="max-w-3xl text-base leading-[1.75] text-zinc-800">
                {profile.about.summary[lang]}
              </p>

              <div className="rounded-xl border border-zinc-200 bg-white p-6">
                <p className="text-xs font-semibold text-zinc-500">
                  {copy.sections.about.philosophyLabel}
                </p>
                <blockquote className="mt-2 font-serif-editorial text-lg leading-relaxed text-zinc-900">
                  “{profile.about.philosophy[lang]}”
                </blockquote>
              </div>

              <div className="grid gap-6 border-t border-zinc-200 pt-6 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold text-zinc-500">
                    {copy.sections.about.languagesLabel}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-800">
                    {profile.about.languagesSpoken[lang]}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500">
                    {copy.sections.about.interestsLabel}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-800">
                    {profile.about.interests[lang]}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500">
                    {copy.sections.about.statusLabel}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-800">
                    {profile.contact.availability[lang]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03. STUDY / EDUCATION */}
        <section id="study" className="border-t border-zinc-200 py-14 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-mono-tabular text-xs font-medium text-[#1D4ED8]">
                {copy.sections.study.num}
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl text-balance">
                {copy.sections.study.title}
              </h2>
              <p className="mt-1 text-xs text-zinc-500">{copy.sections.study.subtitle}</p>
            </div>

            <div className="lg:col-span-8 divide-y divide-zinc-200 border-t border-b border-zinc-200 bg-white rounded-xl border-x px-6">
              {profile.study.map((item) => (
                <article key={item.id} className="py-6 print-break-inside-avoid">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
                    <h3 className="font-display text-lg font-bold text-zinc-950">
                      {item.degree[lang]}
                    </h3>
                    <span className="font-mono-tabular text-xs font-medium text-zinc-500 whitespace-nowrap shrink-0">
                      {item.period}
                    </span>
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
                    <span className="font-semibold text-zinc-800">{item.institution[lang]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.location[lang]}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular text-[#1D4ED8] font-medium">
                      {item.gpaOrHonors[lang]}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-600">{item.focus[lang]}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 04. EXPERIENCE */}
        <section id="experience" className="border-t border-zinc-200 py-14 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-mono-tabular text-xs font-medium text-[#1D4ED8]">
                {copy.sections.experience.num}
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl text-balance">
                {copy.sections.experience.title}
              </h2>
              <p className="mt-1 text-xs text-zinc-500">{copy.sections.experience.subtitle}</p>
            </div>

            <div className="lg:col-span-8 space-y-6">
              {profile.experience.map((exp) => (
                <article
                  key={exp.id}
                  className="rounded-xl border border-zinc-200 bg-white p-6 print-break-inside-avoid"
                >
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
                    <h3 className="font-display text-lg font-bold text-zinc-950">
                      {exp.role[lang]}
                    </h3>
                    <span className="font-mono-tabular text-xs font-medium text-zinc-500 whitespace-nowrap shrink-0">
                      {exp.period}
                    </span>
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                    <span className="font-semibold text-zinc-800">{exp.company[lang]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{exp.location[lang]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{exp.employmentType[lang]}</span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-700">{exp.summary[lang]}</p>

                  {exp.highlights[lang].length > 0 && (
                    <ul className="mt-4 space-y-2 border-t border-zinc-100 pt-4 text-sm text-zinc-600">
                      {exp.highlights[lang].map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 leading-relaxed">
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 05. PROJECTS */}
        <section id="projects" className="border-t border-zinc-200 py-14 sm:py-16">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono-tabular text-xs font-medium text-[#1D4ED8]">
                {copy.sections.projects.num}
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl text-balance">
                {copy.sections.projects.title}
              </h2>
              <p className="mt-1 text-xs text-zinc-500">{copy.sections.projects.subtitle}</p>
            </div>

            {/* Interactive Segmented Filter */}
            <div
              role="group"
              aria-label="Filter projects"
              className="no-print inline-flex flex-wrap items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-100 p-1 self-start sm:self-auto"
            >
              {(
                [
                  { id: 'all', label: copy.sections.projects.filters.all },
                  { id: 'web', label: copy.sections.projects.filters.web },
                  { id: 'design', label: copy.sections.projects.filters.design },
                  { id: 'systems', label: copy.sections.projects.filters.systems },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setProjectFilter(tab.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    projectFilter === tab.id
                      ? 'bg-white text-zinc-950 shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => {
              const hasImgError = projectImageErrors[project.id];
              return (
                <article
                  key={project.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-colors duration-150 hover:border-zinc-300 print-break-inside-avoid"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="block aspect-[4/3] w-full overflow-hidden border-b border-zinc-200 bg-zinc-100 text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#1D4ED8]"
                  >
                    {project.imageUrl && !hasImgError ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title[lang]}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setProjectImageErrors((prev) => ({ ...prev, [project.id]: true }))
                        }
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-zinc-100 p-6 text-center text-zinc-500">
                        <Layers className="h-7 w-7 text-zinc-400" />
                        <span className="text-xs font-medium text-zinc-700">
                          {project.title[lang]}
                        </span>
                      </div>
                    )}
                  </button>

                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span className="font-mono-tabular">{project.year}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{project.role[lang]}</span>
                      </div>

                      <h3 className="mt-2 font-display text-lg font-bold leading-snug text-zinc-950">
                        <button
                          type="button"
                          onClick={() => setSelectedProject(project)}
                          className="text-left hover:text-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
                        >
                          {project.title[lang]}
                        </button>
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                        {project.summary[lang]}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-zinc-100 pt-4">
                      <p className="font-mono-tabular text-xs text-zinc-500 truncate">
                        {project.stack}
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="no-print mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8] hover:underline"
                      >
                        <span>{copy.sections.projects.viewDetails}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 06. SKILLS */}
        <section id="skills" className="border-t border-zinc-200 py-14 sm:py-16 print-break-inside-avoid">
          <div>
            <p className="font-mono-tabular text-xs font-medium text-[#1D4ED8]">
              {copy.sections.skills.num}
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl text-balance">
              {copy.sections.skills.title}
            </h2>
            <p className="mt-1 text-xs text-zinc-500">{copy.sections.skills.subtitle}</p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {profile.skills.map((group) => (
              <div
                key={group.id}
                className="rounded-xl border border-zinc-200 bg-white p-6"
              >
                <h3 className="font-display text-base font-bold text-zinc-950">
                  {group.title[lang]}
                </h3>

                <div className="mt-5 space-y-4">
                  {group.items.map((skill, idx) => (
                    <div key={idx}>
                      <div className="flex items-baseline justify-between gap-2 text-sm">
                        <span className="font-medium text-zinc-900">{skill.name}</span>
                        <span className="font-mono-tabular text-xs text-zinc-500 shrink-0">
                          {skill.years}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                          <div
                            className="h-full rounded-full bg-[#1D4ED8]"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-zinc-500 whitespace-nowrap">
                          {skill.level[lang]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* QUIET FOOTER */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-4 px-5 py-8 text-xs text-zinc-500 sm:flex-row sm:items-center sm:px-8">
          <div className="space-y-1">
            <p className="font-semibold text-zinc-800">{profile.fullName[lang]}</p>
            <p>{copy.footer.note}</p>
          </div>

          <div className="no-print flex flex-wrap items-center gap-5 font-medium text-zinc-600">
            <a href="#contact" className="hover:text-zinc-950">
              01. {copy.nav.contactBtn}
            </a>
            <a href="#about" className="hover:text-zinc-950">
              02. {copy.nav.about}
            </a>
            <a href="#study" className="hover:text-zinc-950">
              03. {copy.nav.study}
            </a>
            <a href="#experience" className="hover:text-zinc-950">
              04. {copy.nav.experience}
            </a>
            <a href="#projects" className="hover:text-zinc-950">
              05. {copy.nav.projects}
            </a>
            <a href="#skills" className="hover:text-zinc-950">
              06. {copy.nav.skills}
            </a>
            <a href="#top" className="text-[#1D4ED8] hover:underline">
              {copy.footer.backToTop}
            </a>
          </div>
        </div>
      </footer>

      {/* PROJECT LIGHTBOX MODAL */}
      <ProjectModal
        project={selectedProject}
        lang={lang}
        onClose={() => setSelectedProject(null)}
      />

      {/* LIVE CV EDITOR DRAWER */}
      <CVEditorDrawer
        open={editorOpen}
        lang={lang}
        profile={profile}
        onChange={handleProfileChange}
        onReset={handleResetProfile}
        onClose={() => setEditorOpen(false)}
      />
    </div>
  );
}
