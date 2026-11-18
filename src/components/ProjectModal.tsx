import { ArrowUpRight, Code2, Layers, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { UI_COPY } from '../data/cvData';
import { Language, ProjectItem } from '../types/cv';

interface ProjectModalProps {
  project: ProjectItem | null;
  lang: Language;
  onClose: () => void;
}

export function ProjectModal({ project, lang, onClose }: ProjectModalProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const t = UI_COPY[lang].sections.projects;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white/95 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono-tabular">
            <span>{project.year}</span>
            <span aria-hidden="true">·</span>
            <span>{project.role[lang]}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeModal}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
            {project.imageUrl && !imgError ? (
              <img
                src={project.imageUrl}
                alt={project.title[lang]}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-100 p-6 text-center text-zinc-500">
                <Layers className="h-8 w-8 text-zinc-400" />
                <p className="text-sm font-medium text-zinc-700">{project.title[lang]}</p>
              </div>
            )}
          </div>

          <h3
            id="project-modal-title"
            className="mt-6 font-display text-2xl font-bold tracking-tight text-zinc-950 text-balance"
          >
            {project.title[lang]}
          </h3>

          <p className="mt-2 font-mono-tabular text-xs text-zinc-500">{project.stack}</p>

          <p className="mt-5 text-[15px] leading-relaxed text-zinc-700">
            {project.description[lang]}
          </p>

          <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-semibold text-zinc-500">{t.outcomeLabel}</p>
            <p className="mt-1 text-sm font-medium text-zinc-900">{project.outcome[lang]}</p>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E40AF] whitespace-nowrap shrink-0"
              >
                <span>{t.liveDemo}</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 whitespace-nowrap shrink-0"
              >
                <Code2 className="h-4 w-4" />
                <span>{t.sourceCode}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
