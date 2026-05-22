"use client";

import type { PortfolioContent } from "@/lib/validation/portfolio-schema";
import { isSectionVisible, mergeVisibleSections } from "@/lib/portfolio/section-registry";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { MobileMenu } from "@/components/portfolio/mobile-menu";
import { DesktopNav } from "@/components/portfolio/desktop-nav";
import { AnimateIn, StaggerChildren, StaggerItem } from "@/components/animate-in";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowRightIcon, XIcon, Grid3X3Icon, ListIcon, LayersIcon } from "lucide-react";
import { Twitter, Linkedin, Github, Instagram, Youtube, Facebook, Globe } from "lucide-react";

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter, linkedin: Linkedin, github: Github, instagram: Instagram,
  youtube: Youtube, facebook: Facebook, website: Globe,
};

function SocialLinks({ socialLinks }: { socialLinks: PortfolioContent["socialLinks"] }) {
  if (!socialLinks || socialLinks.length === 0) return null;
  const enabledLinks = socialLinks.filter((l) => l.enabled && l.url);
  if (enabledLinks.length === 0) return null;
  return (
    <div className="flex items-center gap-4">
      {enabledLinks.map((link) => {
        const Icon = platformIcons[link.platform] || Globe;
        return (
          <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer"
            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" aria-label={link.platform}>
            <Icon className="size-4" />
          </a>
        );
      })}
    </div>
  );
}

type ViewMode = "grid" | "list" | "masonry";

export function InteractiveTemplate({ content }: { content: PortfolioContent }) {
  const visibleSections = mergeVisibleSections(content.visibleSections);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const openProject = (index: number) => { setSelectedProject(index); setIsPanelOpen(true); };
  const closeProject = () => { setIsPanelOpen(false); setTimeout(() => setSelectedProject(null), 300); };

  useEffect(() => {
    document.body.style.overflow = isPanelOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isPanelOpen]);

  return (
    <div className="bg-[#fafaf8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen font-sans">
      <header className="sticky top-0 z-20 bg-[#fafaf8]/95 dark:bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-2">
            <span className="font-mono text-emerald-700 dark:text-emerald-400 text-xs select-none">{"//"}</span>
            <span className="text-sm font-medium">{content.name || content.hero.headline}</span>
          </a>
          <DesktopNav visibleSections={visibleSections} />
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <MobileMenu visibleSections={visibleSections} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">

        {isSectionVisible(visibleSections, "hero") && (
          <section className="pt-20 pb-28 border-b border-zinc-200 dark:border-zinc-800">
            <AnimateIn duration={0.8} from="bottom">
              <div className="font-mono text-xs text-emerald-700 dark:text-emerald-400 mb-6 tracking-wide">
                {"// hello, world"}
              </div>
              <h1 className="text-[clamp(2.8rem,7.5vw,6.5rem)] font-bold tracking-[-0.04em] leading-[1.0] text-balance">
                {content.hero.headline}
              </h1>
            </AnimateIn>
            <AnimateIn delay={0.15}>
              <p className="mt-8 text-lg text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
                {content.hero.subheadline}
              </p>
            </AnimateIn>
            <AnimateIn delay={0.25}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a href={isSectionVisible(visibleSections, "cta") ? "#contact" : "#"}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 dark:bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-800 dark:hover:bg-emerald-500 transition-colors">
                  {content.hero.ctaText} <ArrowRightIcon className="size-4" />
                </a>
                {isSectionVisible(visibleSections, "projects") && (
                  <a href="#work" className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-mono">
                    view work <ArrowRightIcon className="size-3" />
                  </a>
                )}
              </div>
            </AnimateIn>
          </section>
        )}

        {isSectionVisible(visibleSections, "about") && (
          <section id="about" className="py-20 border-b border-zinc-200 dark:border-zinc-800">
            <AnimateIn>
              <div className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 tracking-wider mb-8">{"// about"}</div>
              <p className="text-xl font-light text-zinc-600 dark:text-zinc-400 leading-[1.75] max-w-3xl">
                {content.about.paragraph}
              </p>
            </AnimateIn>
          </section>
        )}

        {isSectionVisible(visibleSections, "services") && content.services && content.services.length > 0 && (
          <section id="services" className="py-20 border-b border-zinc-200 dark:border-zinc-800">
            <AnimateIn>
              <div className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 tracking-wider mb-10">{"// services"}</div>
            </AnimateIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.services.map((service, i) => (
                <AnimateIn key={i} delay={i * 0.06}>
                  <div className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 group hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors">
                    <div className="font-mono text-xs text-emerald-700 dark:text-emerald-400 mb-4">{String(i + 1).padStart(2, "0")}</div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">{service.title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{service.description}</p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "projects") && content.projects && content.projects.length > 0 && (
          <section id="work" className="py-20 border-b border-zinc-200 dark:border-zinc-800">
            <AnimateIn>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                <div className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 tracking-wider">{"// selected work"}</div>
                <div className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 p-1 bg-white dark:bg-zinc-900">
                  {([["grid", Grid3X3Icon], ["list", ListIcon], ["masonry", LayersIcon]] as const).map(([mode, Icon]) => (
                    <button key={mode} onClick={() => setViewMode(mode as ViewMode)}
                      className={"p-1.5 transition-all " + (viewMode === mode ? "bg-emerald-700 dark:bg-emerald-600 text-white" : "text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100")}>
                      <Icon className="size-4" />
                    </button>
                  ))}
                </div>
              </div>
            </AnimateIn>

            <AnimatePresence mode="wait">
              {viewMode === "grid" && (
                <motion.div key="grid" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {content.projects.map((project, i) => (
                    <button key={i} onClick={() => openProject(i)} className="group relative w-full text-left border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors">
                      <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400 block mb-4">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">{project.description}</p>
                    </button>
                  ))}
                </motion.div>
              )}
              {viewMode === "list" && (
                <motion.div key="list" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-0">
                  {content.projects.map((project, i) => (
                    <button key={i} onClick={() => openProject(i)} className="group w-full text-left py-5 border-b border-zinc-100 dark:border-zinc-900 last:border-0 flex items-center gap-6 hover:bg-white dark:hover:bg-zinc-900 -mx-4 px-4 transition-colors">
                      <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400 w-8 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      <div className="flex-1 min-w-0 text-left">
                        <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors mb-1">{project.title}</h3>
                        <p className="text-sm text-zinc-400 truncate">{project.description}</p>
                      </div>
                      <ArrowRightIcon className="size-4 text-zinc-300 dark:text-zinc-700 group-hover:text-emerald-600 transition-colors shrink-0" />
                    </button>
                  ))}
                </motion.div>
              )}
              {viewMode === "masonry" && (
                <motion.div key="masonry" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                  {content.projects.map((project, i) => (
                    <button key={i} onClick={() => openProject(i)} className="group break-inside-avoid w-full text-left border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors block">
                      <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400 block mb-3">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="text-base font-semibold mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{project.title}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{i % 2 === 0 ? project.description : project.result}</p>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {isSectionVisible(visibleSections, "products") && content.products && content.products.length > 0 && (
          <section id="products" className="py-20 border-b border-zinc-200 dark:border-zinc-800">
            <AnimateIn>
              <div className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 tracking-wider mb-10">{"// products"}</div>
            </AnimateIn>
            <StaggerChildren stagger={0.08} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.products.map((product, i) => (
                <StaggerItem key={i}>
                  <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden group">
                    {product.image && (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img src={product.image} alt={product.title}
                          className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-baseline justify-between gap-2 mb-2">
                        <h3 className="text-sm font-semibold">{product.title}</h3>
                        <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400 shrink-0">{product.price}</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">{product.description}</p>
                      {product.url && (
                        <a href={product.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wide text-zinc-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors uppercase">
                          View <ArrowRightIcon className="size-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>
        )}

        {isSectionVisible(visibleSections, "history") && content.history && content.history.length > 0 && (
          <section id="history" className="py-20 border-b border-zinc-200 dark:border-zinc-800">
            <AnimateIn>
              <div className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 tracking-wider mb-10">{"// experience"}</div>
            </AnimateIn>
            <div className="space-y-0 border-l-2 border-zinc-200 dark:border-zinc-800 pl-6">
              {content.history.map((item, i) => (
                <AnimateIn key={i} delay={i * 0.08} from="bottom">
                  <div className="relative py-6 border-b border-zinc-100 dark:border-zinc-900 last:border-0">
                    <div className="absolute -left-[29px] top-7 size-4 bg-[#fafaf8] dark:bg-zinc-950 border-2 border-emerald-500 dark:border-emerald-600" />
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
                      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{item.role}</h3>
                      <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">{item.company}</span>
                      <span className="font-mono text-xs text-zinc-400">{item.period}</span>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">{item.description}</p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "testimonials") && content.testimonials && content.testimonials.length > 0 && (
          <section id="testimonials" className="py-20 border-b border-zinc-200 dark:border-zinc-800">
            <AnimateIn>
              <div className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 tracking-wider mb-10">{"// what people say"}</div>
            </AnimateIn>
            <StaggerChildren stagger={0.1} className="grid md:grid-cols-2 gap-6">
              {content.testimonials.map((t, i) => (
                <StaggerItem key={i}>
                  <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 h-full flex flex-col">
                    <p className="text-base font-light text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 flex-grow">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t.author}</p>
                      {t.role && <p className="font-mono text-[10px] text-zinc-400 mt-0.5">{t.role}</p>}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>
        )}

        {isSectionVisible(visibleSections, "faq") && content.faq && content.faq.length > 0 && (
          <section id="faq" className="py-20 border-b border-zinc-200 dark:border-zinc-800">
            <AnimateIn>
              <div className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 tracking-wider mb-10">{"// faq"}</div>
            </AnimateIn>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
              {content.faq.map((f, i) => (
                <AnimateIn key={i} delay={i * 0.07} from="bottom">
                  <div className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <h3 className="text-sm font-semibold mb-3 flex gap-3">
                      <span className="font-mono text-emerald-700 dark:text-emerald-400 shrink-0">Q.</span>
                      {f.question}
                    </h3>
                    <p className="pl-7 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{f.answer}</p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "gallery") && content.gallery && content.gallery.length > 0 && (
          <section id="gallery" className="py-20 border-b border-zinc-200 dark:border-zinc-800">
            <AnimateIn>
              <div className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 tracking-wider mb-10">{"// gallery"}</div>
            </AnimateIn>
            <StaggerChildren stagger={0.06} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {content.gallery.map((g, i) => (
                <StaggerItem key={i}>
                  <div className="group relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <img src={g.url} alt={g.caption}
                      className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                    {g.caption && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900/80 flex items-end p-3">
                        <p className="font-mono text-[9px] text-zinc-300">{g.caption}</p>
                      </div>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>
        )}

        {isSectionVisible(visibleSections, "cta") && (
          <section id="contact" className="py-28">
            <AnimateIn>
              <div className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 tracking-wider mb-8">{"// get in touch"}</div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance mb-6 max-w-2xl">
                {content.cta.headline}
              </h2>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-10 max-w-xl leading-relaxed">{content.cta.subtext}</p>
              <a href="#contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-700 dark:bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-800 dark:hover:bg-emerald-500 transition-colors">
                {content.hero.ctaText} <ArrowRightIcon className="size-4" />
              </a>
            </AnimateIn>
          </section>
        )}
      </main>

      <AnimatePresence>
        {isPanelOpen && selectedProject !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex justify-end" onClick={closeProject}>
            <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-xl h-full bg-[#fafaf8] dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-y-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-[#fafaf8]/95 dark:bg-zinc-950/95 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
                <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 tracking-wider">{"// project details"}</span>
                <button onClick={closeProject} className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  <XIcon className="size-5" />
                </button>
              </div>
              <div className="p-8 space-y-8 flex-1">
                <div className="aspect-[16/9] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                  <span className="font-mono text-5xl font-bold text-zinc-200 dark:text-zinc-800">{selectedProject + 1}</span>
                </div>
                <div>
                  <div className="font-mono text-xs text-emerald-700 dark:text-emerald-400 mb-3">
                    {String(selectedProject + 1).padStart(2, "0")} / {String(content.projects.length).padStart(2, "0")}
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                    {content.projects[selectedProject].title}
                  </h2>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {content.projects[selectedProject].description}
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <p className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 mb-2 tracking-wider">{"// result"}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{content.projects[selectedProject].result}</p>
                </div>
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-between bg-white dark:bg-zinc-900">
                <button onClick={() => setSelectedProject((selectedProject - 1 + content.projects.length) % content.projects.length)}
                  className="font-mono text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  &larr; prev
                </button>
                <span className="font-mono text-[10px] text-zinc-400">
                  {selectedProject + 1} / {content.projects.length}
                </span>
                <button onClick={() => setSelectedProject((selectedProject + 1) % content.projects.length)}
                  className="font-mono text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  next &rarr;
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-zinc-400 dark:text-zinc-600 tracking-wider">
            &copy; {new Date().getFullYear()} {content.name || content.hero.headline}
          </p>
          <div className="flex items-center gap-6">
            <SocialLinks socialLinks={content.socialLinks} />
            <ThemeSwitcher />
          </div>
        </div>
      </footer>
    </div>
  );
}
