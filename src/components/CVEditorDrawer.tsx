import { Plus, RotateCcw, Trash2, Upload, X } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { CVProfile, Language, ProjectCategory } from '../types/cv';

interface CVEditorDrawerProps {
  open: boolean;
  lang: Language;
  profile: CVProfile;
  onChange: (next: CVProfile) => void;
  onReset: () => void;
  onClose: () => void;
}

type EditorTab = 'general' | 'contact' | 'about' | 'study' | 'experience' | 'projects' | 'skills';

export function CVEditorDrawer({
  open,
  lang,
  profile,
  onChange,
  onReset,
  onClose,
}: CVEditorDrawerProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('general');

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const labels = {
    km: {
      title: 'កែប្រែព័ត៌មាន CV របស់អ្នក',
      subtitle: 'រាល់ការកែប្រែត្រូវបានរក្សាទុកស្វ័យប្រវត្តិ និងអាចចម្លងតំណចែករំលែកបានភ្លាមៗ។',
      reset: 'ស្តារលំនាំដើម',
      done: 'រួចរាល់',
      tabs: {
        general: 'ទូទៅ & រូបភាព',
        contact: '1. ទំនាក់ទំនង',
        about: '2. អំពីខ្ញុំ',
        study: '3. ការសិក្សា',
        experience: '4. បទពិសោធន៍',
        projects: '5. គម្រោង',
        skills: '6. ជំនាញ',
      },
    },
    en: {
      title: 'Customize Your CV',
      subtitle: 'Changes save automatically in your browser and can be shared via Copy Share Link.',
      reset: 'Reset Default',
      done: 'Done',
      tabs: {
        general: 'Profile & Photo',
        contact: '1. Contact',
        about: '2. About Me',
        study: '3. Study',
        experience: '4. Experience',
        projects: '5. Projects',
        skills: '6. Skills',
      },
    },
  }[lang];

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange({ ...profile, portraitUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const inputClass =
    'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/15';
  const labelClass = 'block text-xs font-semibold text-zinc-600 mb-1.5';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={labels.title}
      className="no-print fixed inset-0 z-50 flex justify-end bg-zinc-950/50"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-2xl flex-col border-l border-zinc-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-6 py-5">
          <div>
            <h2 className="font-display text-lg font-bold text-zinc-950">{labels.title}</h2>
            <p className="mt-1 text-xs text-zinc-500">{labels.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-100 whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{labels.reset}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label={labels.done}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-zinc-200 bg-zinc-50 px-6 py-2.5">
          {(Object.keys(labels.tabs) as EditorTab[]).map((tabKey) => (
            <button
              key={tabKey}
              type="button"
              onClick={() => setActiveTab(tabKey)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tabKey
                  ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              {labels.tabs[tabKey]}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Full Name ({lang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={profile.fullName[lang]}
                    onChange={(e) =>
                      onChange({
                        ...profile,
                        fullName: { ...profile.fullName, [lang]: e.target.value },
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Top Bar Wordmark ({lang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={profile.brandWordmark[lang]}
                    onChange={(e) =>
                      onChange({
                        ...profile,
                        brandWordmark: { ...profile.brandWordmark, [lang]: e.target.value },
                      })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Professional Headline ({lang.toUpperCase()})</label>
                <input
                  type="text"
                  value={profile.headline[lang]}
                  onChange={(e) =>
                    onChange({
                      ...profile,
                      headline: { ...profile.headline, [lang]: e.target.value },
                    })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Hero Tagline ({lang.toUpperCase()})</label>
                <textarea
                  rows={3}
                  value={profile.tagline[lang]}
                  onChange={(e) =>
                    onChange({
                      ...profile,
                      tagline: { ...profile.tagline, [lang]: e.target.value },
                    })
                  }
                  className={inputClass}
                />
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <label className={labelClass}>Portrait Photo</label>
                <div className="flex flex-wrap items-center gap-4">
                  <img
                    src={profile.portraitUrl}
                    alt="Preview"
                    className="h-16 w-16 rounded-lg border border-zinc-200 object-cover"
                  />
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-50">
                    <Upload className="h-3.5 w-3.5" />
                    <span>{lang === 'km' ? 'ប្តូររូបភាពថ្មី' : 'Upload New Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={profile.contact.email}
                    onChange={(e) =>
                      onChange({
                        ...profile,
                        contact: { ...profile.contact, email: e.target.value },
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    type="text"
                    value={profile.contact.phone}
                    onChange={(e) =>
                      onChange({
                        ...profile,
                        contact: { ...profile.contact, phone: e.target.value },
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Telegram</label>
                  <input
                    type="text"
                    value={profile.contact.telegram}
                    onChange={(e) =>
                      onChange({
                        ...profile,
                        contact: { ...profile.contact, telegram: e.target.value },
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Location ({lang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={profile.contact.location[lang]}
                    onChange={(e) =>
                      onChange({
                        ...profile,
                        contact: {
                          ...profile.contact,
                          location: { ...profile.contact.location, [lang]: e.target.value },
                        },
                      })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>GitHub URL</label>
                  <input
                    type="url"
                    value={profile.contact.github}
                    onChange={(e) =>
                      onChange({
                        ...profile,
                        contact: { ...profile.contact, github: e.target.value },
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>LinkedIn URL</label>
                  <input
                    type="url"
                    value={profile.contact.linkedin}
                    onChange={(e) =>
                      onChange({
                        ...profile,
                        contact: { ...profile.contact, linkedin: e.target.value },
                      })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Availability Status ({lang.toUpperCase()})</label>
                <input
                  type="text"
                  value={profile.contact.availability[lang]}
                  onChange={(e) =>
                    onChange({
                      ...profile,
                      contact: {
                        ...profile.contact,
                        availability: { ...profile.contact.availability, [lang]: e.target.value },
                      },
                    })
                  }
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>About Summary ({lang.toUpperCase()})</label>
                <textarea
                  rows={4}
                  value={profile.about.summary[lang]}
                  onChange={(e) =>
                    onChange({
                      ...profile,
                      about: {
                        ...profile.about,
                        summary: { ...profile.about.summary, [lang]: e.target.value },
                      },
                    })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Work Philosophy ({lang.toUpperCase()})</label>
                <textarea
                  rows={3}
                  value={profile.about.philosophy[lang]}
                  onChange={(e) =>
                    onChange({
                      ...profile,
                      about: {
                        ...profile.about,
                        philosophy: { ...profile.about.philosophy, [lang]: e.target.value },
                      },
                    })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Languages Spoken ({lang.toUpperCase()})</label>
                <input
                  type="text"
                  value={profile.about.languagesSpoken[lang]}
                  onChange={(e) =>
                    onChange({
                      ...profile,
                      about: {
                        ...profile.about,
                        languagesSpoken: {
                          ...profile.about.languagesSpoken,
                          [lang]: e.target.value,
                        },
                      },
                    })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Focus Areas / Interests ({lang.toUpperCase()})</label>
                <input
                  type="text"
                  value={profile.about.interests[lang]}
                  onChange={(e) =>
                    onChange({
                      ...profile,
                      about: {
                        ...profile.about,
                        interests: { ...profile.about.interests, [lang]: e.target.value },
                      },
                    })
                  }
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {activeTab === 'study' && (
            <div className="space-y-5">
              {profile.study.map((item, idx) => (
                <div key={item.id} className="rounded-xl border border-zinc-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tabular text-xs font-semibold text-zinc-500">
                      Study #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...profile,
                          study: profile.study.filter((s) => s.id !== item.id),
                        })
                      }
                      className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Degree / Certificate ({lang.toUpperCase()})</label>
                      <input
                        type="text"
                        value={item.degree[lang]}
                        onChange={(e) => {
                          const next = [...profile.study];
                          next[idx] = {
                            ...item,
                            degree: { ...item.degree, [lang]: e.target.value },
                          };
                          onChange({ ...profile, study: next });
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Institution ({lang.toUpperCase()})</label>
                      <input
                        type="text"
                        value={item.institution[lang]}
                        onChange={(e) => {
                          const next = [...profile.study];
                          next[idx] = {
                            ...item,
                            institution: { ...item.institution, [lang]: e.target.value },
                          };
                          onChange({ ...profile, study: next });
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Period</label>
                      <input
                        type="text"
                        value={item.period}
                        onChange={(e) => {
                          const next = [...profile.study];
                          next[idx] = { ...item, period: e.target.value };
                          onChange({ ...profile, study: next });
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>GPA / Honors ({lang.toUpperCase()})</label>
                      <input
                        type="text"
                        value={item.gpaOrHonors[lang]}
                        onChange={(e) => {
                          const next = [...profile.study];
                          next[idx] = {
                            ...item,
                            gpaOrHonors: { ...item.gpaOrHonors, [lang]: e.target.value },
                          };
                          onChange({ ...profile, study: next });
                        }}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Coursework Focus ({lang.toUpperCase()})</label>
                    <textarea
                      rows={2}
                      value={item.focus[lang]}
                      onChange={(e) => {
                        const next = [...profile.study];
                        next[idx] = {
                          ...item,
                          focus: { ...item.focus, [lang]: e.target.value },
                        };
                        onChange({ ...profile, study: next });
                      }}
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...profile,
                    study: [
                      ...profile.study,
                      {
                        id: `study-${Date.now()}`,
                        degree: { km: 'បរិញ្ញាបត្រថ្មី', en: 'New Degree or Certificate' },
                        institution: { km: 'ឈ្មោះសាកលវិទ្យាល័យ', en: 'University Name' },
                        location: { km: 'ភ្នំពេញ', en: 'Phnom Penh' },
                        period: '2022 – 2026',
                        gpaOrHonors: { km: 'និទ្ទេសល្អ', en: 'Honors' },
                        focus: { km: 'មុខវិជ្ជាសំខាន់ៗ', en: 'Key coursework and thesis focus.' },
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                <Plus className="h-4 w-4" />
                <span>{lang === 'km' ? 'បន្ថែមការសិក្សា' : 'Add Study Entry'}</span>
              </button>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-5">
              {profile.experience.map((item, idx) => (
                <div key={item.id} className="rounded-xl border border-zinc-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tabular text-xs font-semibold text-zinc-500">
                      Experience #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...profile,
                          experience: profile.experience.filter((x) => x.id !== item.id),
                        })
                      }
                      className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Role Title ({lang.toUpperCase()})</label>
                      <input
                        type="text"
                        value={item.role[lang]}
                        onChange={(e) => {
                          const next = [...profile.experience];
                          next[idx] = {
                            ...item,
                            role: { ...item.role, [lang]: e.target.value },
                          };
                          onChange({ ...profile, experience: next });
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Company ({lang.toUpperCase()})</label>
                      <input
                        type="text"
                        value={item.company[lang]}
                        onChange={(e) => {
                          const next = [...profile.experience];
                          next[idx] = {
                            ...item,
                            company: { ...item.company, [lang]: e.target.value },
                          };
                          onChange({ ...profile, experience: next });
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Period</label>
                      <input
                        type="text"
                        value={item.period}
                        onChange={(e) => {
                          const next = [...profile.experience];
                          next[idx] = { ...item, period: e.target.value };
                          onChange({ ...profile, experience: next });
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Location ({lang.toUpperCase()})</label>
                      <input
                        type="text"
                        value={item.location[lang]}
                        onChange={(e) => {
                          const next = [...profile.experience];
                          next[idx] = {
                            ...item,
                            location: { ...item.location, [lang]: e.target.value },
                          };
                          onChange({ ...profile, experience: next });
                        }}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Summary ({lang.toUpperCase()})</label>
                    <textarea
                      rows={2}
                      value={item.summary[lang]}
                      onChange={(e) => {
                        const next = [...profile.experience];
                        next[idx] = {
                          ...item,
                          summary: { ...item.summary, [lang]: e.target.value },
                        };
                        onChange({ ...profile, experience: next });
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Highlights (1 per line, {lang.toUpperCase()})
                    </label>
                    <textarea
                      rows={3}
                      value={item.highlights[lang].join('\n')}
                      onChange={(e) => {
                        const next = [...profile.experience];
                        next[idx] = {
                          ...item,
                          highlights: {
                            ...item.highlights,
                            [lang]: e.target.value.split('\n').filter(Boolean),
                          },
                        };
                        onChange({ ...profile, experience: next });
                      }}
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...profile,
                    experience: [
                      ...profile.experience,
                      {
                        id: `exp-${Date.now()}`,
                        role: { km: 'តួនាទីថ្មី', en: 'New Role Title' },
                        company: { km: 'ឈ្មោះក្រុមហ៊ុន', en: 'Company Name' },
                        location: { km: 'ភ្នំពេញ', en: 'Phnom Penh' },
                        period: '2025 – Present',
                        employmentType: { km: 'ពេញម៉ោង', en: 'Full-Time' },
                        summary: {
                          km: 'ការទទួលខុសត្រូវសំខាន់ៗក្នុងតួនាទីនេះ។',
                          en: 'Key responsibilities and technical leadership.',
                        },
                        highlights: {
                          km: ['សមិទ្ធផលសំខាន់ទី ១'],
                          en: ['Delivered measurable impact across core systems.'],
                        },
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                <Plus className="h-4 w-4" />
                <span>{lang === 'km' ? 'បន្ថែមបទពិសោធន៍' : 'Add Experience'}</span>
              </button>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-5">
              {profile.projects.map((proj, idx) => (
                <div key={proj.id} className="rounded-xl border border-zinc-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tabular text-xs font-semibold text-zinc-500">
                      Project #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...profile,
                          projects: profile.projects.filter((p) => p.id !== proj.id),
                        })
                      }
                      className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Title ({lang.toUpperCase()})</label>
                      <input
                        type="text"
                        value={proj.title[lang]}
                        onChange={(e) => {
                          const next = [...profile.projects];
                          next[idx] = {
                            ...proj,
                            title: { ...proj.title, [lang]: e.target.value },
                          };
                          onChange({ ...profile, projects: next });
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Category</label>
                      <select
                        value={proj.category}
                        onChange={(e) => {
                          const next = [...profile.projects];
                          next[idx] = {
                            ...proj,
                            category: e.target.value as ProjectCategory,
                          };
                          onChange({ ...profile, projects: next });
                        }}
                        className={inputClass}
                      >
                        <option value="web">Web Apps</option>
                        <option value="design">UI/UX Design</option>
                        <option value="systems">Data Systems</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Year</label>
                      <input
                        type="text"
                        value={proj.year}
                        onChange={(e) => {
                          const next = [...profile.projects];
                          next[idx] = { ...proj, year: e.target.value };
                          onChange({ ...profile, projects: next });
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Tech Stack</label>
                      <input
                        type="text"
                        value={proj.stack}
                        onChange={(e) => {
                          const next = [...profile.projects];
                          next[idx] = { ...proj, stack: e.target.value };
                          onChange({ ...profile, projects: next });
                        }}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Short Summary ({lang.toUpperCase()})</label>
                    <textarea
                      rows={2}
                      value={proj.summary[lang]}
                      onChange={(e) => {
                        const next = [...profile.projects];
                        next[idx] = {
                          ...proj,
                          summary: { ...proj.summary, [lang]: e.target.value },
                        };
                        onChange({ ...profile, projects: next });
                      }}
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...profile,
                    projects: [
                      ...profile.projects,
                      {
                        id: `proj-${Date.now()}`,
                        title: { km: 'គម្រោងថ្មី', en: 'New Showcase Project' },
                        category: 'web',
                        year: '2026',
                        role: { km: 'អ្នកអភិវឌ្ឍន៍', en: 'Lead Developer' },
                        stack: 'React · TypeScript · Tailwind CSS',
                        summary: {
                          km: 'សេចក្តីសង្ខេបខ្លីអំពីគម្រោង។',
                          en: 'Concise overview of the project problem and solution.',
                        },
                        description: {
                          km: 'ការពិពណ៌នាលម្អិតអំពីគម្រោង និងស្ថាបត្យកម្មបច្ចេកទេស។',
                          en: 'Full technical architecture and product execution details.',
                        },
                        outcome: {
                          km: 'លទ្ធផលសម្រេចបានសម្រាប់អ្នកប្រើប្រាស់។',
                          en: 'Measurable outcome achieved for end users.',
                        },
                        imageUrl: '/src/assets/images/project_commerce_platform_1794966605307.jpg',
                        liveUrl: 'https://chhunly.dev',
                        repoUrl: 'https://github.com/chhunly',
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                <Plus className="h-4 w-4" />
                <span>{lang === 'km' ? 'បន្ថែមគម្រោង' : 'Add Project'}</span>
              </button>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-5">
              {profile.skills.map((group, gIdx) => (
                <div key={group.id} className="rounded-xl border border-zinc-200 p-4 space-y-3">
                  <div>
                    <label className={labelClass}>Skill Group Title ({lang.toUpperCase()})</label>
                    <input
                      type="text"
                      value={group.title[lang]}
                      onChange={(e) => {
                        const next = [...profile.skills];
                        next[gIdx] = {
                          ...group,
                          title: { ...group.title, [lang]: e.target.value },
                        };
                        onChange({ ...profile, skills: next });
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    {group.items.map((skill, sIdx) => (
                      <div key={sIdx} className="grid grid-cols-12 gap-2 items-center">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => {
                            const next = [...profile.skills];
                            const items = [...group.items];
                            items[sIdx] = { ...skill, name: e.target.value };
                            next[gIdx] = { ...group, items };
                            onChange({ ...profile, skills: next });
                          }}
                          className={`${inputClass} col-span-6`}
                        />
                        <input
                          type="text"
                          value={skill.years}
                          onChange={(e) => {
                            const next = [...profile.skills];
                            const items = [...group.items];
                            items[sIdx] = { ...skill, years: e.target.value };
                            next[gIdx] = { ...group, items };
                            onChange({ ...profile, skills: next });
                          }}
                          className={`${inputClass} col-span-3`}
                        />
                        <input
                          type="number"
                          min={10}
                          max={100}
                          value={skill.proficiency}
                          onChange={(e) => {
                            const next = [...profile.skills];
                            const items = [...group.items];
                            items[sIdx] = {
                              ...skill,
                              proficiency: Math.min(100, Math.max(10, Number(e.target.value) || 50)),
                            };
                            next[gIdx] = { ...group, items };
                            onChange({ ...profile, skills: next });
                          }}
                          className={`${inputClass} col-span-2`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...profile.skills];
                            next[gIdx] = {
                              ...group,
                              items: group.items.filter((_, idx) => idx !== sIdx),
                            };
                            onChange({ ...profile, skills: next });
                          }}
                          aria-label="Remove skill"
                          className="col-span-1 flex h-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...profile.skills];
                      next[gIdx] = {
                        ...group,
                        items: [
                          ...group.items,
                          {
                            name: 'New Skill',
                            level: { km: 'កម្រិតស្ទាត់ជំនាញ', en: 'Proficient' },
                            years: '2 yrs',
                            proficiency: 80,
                          },
                        ],
                      };
                      onChange({ ...profile, skills: next });
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8] hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{lang === 'km' ? 'បន្ថែមជំនាញ' : 'Add Skill'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-zinc-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1E40AF]"
          >
            {labels.done}
          </button>
        </div>
      </div>
    </div>
  );
}
