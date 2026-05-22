"use client";

import type { PortfolioContent } from "@/lib/validation/portfolio-schema";
import { isSectionVisible, mergeVisibleSections } from "@/lib/portfolio/section-registry";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { MobileMenu } from "@/components/portfolio/mobile-menu";
import { DesktopNav } from "@/components/portfolio/desktop-nav";
import { AnimateIn, StaggerChildren, StaggerItem } from "@/components/animate-in";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowRightIcon, XIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
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
    <div className="flex items-center gap-5">
      {enabledLinks.map((link) => {
        const Icon = platformIcons[link.platform] || Globe;
        return (
          <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer"
            className="text-white/30 hover:text-white/80 transition-colors" aria-label={link.platform}>
            <Icon className="size-4" />
          </a>
        );
      })}
    </div>
  );
}

export function GalleryTemplate({ content }: { content: PortfolioContent }) {
  const visibleSections = mergeVisibleSections(content.visibleSections);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openProject = (index: number) => { setSelectedProject(index); setIsLightboxOpen(true); };
  const closeProject = () => { setIsLightboxOpen(false); setTimeout(() => setSelectedProject(null), 300); };
  const goToProject = (dir: "prev" | "next") => {
    if (selectedProject === null) return;
    setSelectedProject(dir === "next" ? (selectedProject + 1) % content.projects.length : (selectedProject - 1 + content.projects.length) % content.projects.length);
  };

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isLightboxOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") closeProject();
      if (e.key === "ArrowLeft") goToProject("prev");
      if (e.key === "ArrowRight") goToProject("next");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isLightboxOpen, selectedProject]);

  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen font-sans">
      <header className="sticky top-0 z-20 bg-[#0e0e0e]/95 backdrop-blur-sm border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="#" className="font-serif text-lg font-light tracking-tight text-white/90">
            {content.name || content.hero.headline}
          </a>
          <DesktopNav visibleSections={visibleSections} />
          <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
            <ThemeSwitcher />
            <MobileMenu visibleSections={visibleSections} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">

        {isSectionVisible(visibleSections, "hero") && (
          <section className="pt-24 pb-32 border-b border-white/5">
            <AnimateIn duration={1.0} from="bottom">
              <h1 className="text-[clamp(3.5rem,12vw,10rem)] font-serif font-light tracking-[-0.04em] leading-[0.92] text-white/90 text-balance">
                {content.hero.headline}
              </h1>
            </AnimateIn>
            <AnimateIn delay={0.2} duration={0.8}>
              <p className="mt-12 text-base text-white/40 max-w-md leading-relaxed font-light">
                {content.hero.subheadline}
              </p>
            </AnimateIn>
            <AnimateIn delay={0.36}>
              <a href={isSectionVisible(visibleSections, "cta") ? "#contact" : "#"}
                className="mt-10 inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-white/40 hover:text-white/80 transition-colors duration-500">
                {content.hero.ctaText} <ArrowRightIcon className="size-3" />
              </a>
            </AnimateIn>
          </section>
        )}

        {isSectionVisible(visibleSections, "about") && (
          <section id="about" className="py-24 border-b border-white/5">
            <AnimateIn>
              <p className="text-2xl sm:text-3xl font-serif font-light text-white/60 leading-[1.6] max-w-3xl">
                {content.about.paragraph}
              </p>
            </AnimateIn>
          </section>
        )}

        {isSectionVisible(visibleSections, "services") && content.services && content.services.length > 0 && (
          <section id="services" className="py-24 border-b border-white/5">
            <AnimateIn>
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-12">Services</p>
            </AnimateIn>
            <div className="space-y-0">
              {content.services.map((service, i) => (
                <AnimateIn key={i} delay={i * 0.07}>
                  <div className="py-6 border-b border-white/5 last:border-0 flex items-start gap-8 group">
                    <span className="text-[10px] text-white/20 font-mono mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-sm text-white/60 group-hover:text-white/90 transition-colors duration-500 mb-1.5">{service.title}</h3>
                      <p className="text-xs text-white/30 leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "projects") && content.projects && content.projects.length > 0 && (
          <section id="work" className="py-24 border-b border-white/5">
            <AnimateIn>
              <div className="flex items-center justify-between mb-12">
                <p className="text-[10px] tracking-[0.4em] uppercase text-white/20">Work</p>
                <span className="text-[10px] text-white/20 font-mono">{content.projects.length} projects</span>
              </div>
            </AnimateIn>
            <StaggerChildren stagger={0.08} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {content.projects.map((project, i) => (
                <StaggerItem key={i}>
                  <button onClick={() => openProject(i)} className="group relative w-full aspect-square bg-white/5 overflow-hidden block hover:bg-white/10 transition-colors duration-500">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-serif font-light text-white/10 group-hover:text-white/5 transition-colors duration-700">{i + 1}</span>
                    </div>
                    <div className="absolute inset-0 bg-[#0e0e0e]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-400 p-5 flex flex-col justify-end">
                      <h3 className="text-sm font-medium text-white/90 mb-1.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">{project.title}</h3>
                      <p className="text-xs text-white/40 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400">{project.description}</p>
                    </div>
                  </button>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>
        )}

        {isSectionVisible(visibleSections, "products") && content.products && content.products.length > 0 && (
          <section id="products" className="py-24 border-b border-white/5">
            <AnimateIn>
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-12">Products</p>
            </AnimateIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.products.map((product, i) => (
                <AnimateIn key={i} delay={i * 0.07}>
                  <div className="border border-white/5 p-5 group hover:border-white/15 transition-colors duration-500">
                    {product.image && (
                      <div className="aspect-[4/3] overflow-hidden bg-white/5 mb-5">
                        <img src={product.image} alt={product.title}
                          className="object-cover w-full h-full grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-80 transition-all duration-700" />
                      </div>
                    )}
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <h3 className="text-sm text-white/60 group-hover:text-white/90 transition-colors duration-500">{product.title}</h3>
                      <span className="text-[10px] text-white/30 font-mono shrink-0">{product.price}</span>
                    </div>
                    <p className="text-xs text-white/30 leading-relaxed mb-4">{product.description}</p>
                    {product.url && (
                      <a href={product.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-white/70 transition-colors duration-500">
                        View <ArrowRightIcon className="size-3" />
                      </a>
                    )}
                  </div>
                </AnimateIn>
              ))}
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "history") && content.history && content.history.length > 0 && (
          <section id="history" className="py-24 border-b border-white/5">
            <AnimateIn>
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-12">Experience</p>
            </AnimateIn>
            <div className="space-y-0">
              {content.history.map((item, i) => (
                <AnimateIn key={i} delay={i * 0.08} from="bottom">
                  <div className="py-5 border-b border-white/5 last:border-0 grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-3 sm:gap-10">
                    <div>
                      <span className="font-mono text-[10px] text-white/20 block">{item.period}</span>
                      <span className="text-xs text-white/35 mt-1 block">{item.company}</span>
                    </div>
                    <div>
                      <h3 className="text-sm text-white/60 mb-2">{item.role}</h3>
                      <p className="text-xs text-white/30 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "testimonials") && content.testimonials && content.testimonials.length > 0 && (
          <section id="testimonials" className="py-24 border-b border-white/5">
            <AnimateIn>
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-16">Testimonials</p>
            </AnimateIn>
            <div className="space-y-16">
              {content.testimonials.map((t, i) => (
                <AnimateIn key={i} delay={i * 0.1}>
                  <blockquote className="max-w-3xl">
                    <p className="text-2xl sm:text-3xl font-serif font-light text-white/50 leading-[1.5] italic mb-6">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <footer className="text-[10px] tracking-[0.3em] uppercase text-white/20">
                      {t.author}{t.role}
                    </footer>
                  </blockquote>
                </AnimateIn>
              ))}
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "faq") && content.faq && content.faq.length > 0 && (
          <section id="faq" className="py-24 border-b border-white/5">
            <AnimateIn>
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-12">FAQ</p>
            </AnimateIn>
            <div className="space-y-0 max-w-2xl">
              {content.faq.map((f, i) => (
                <AnimateIn key={i} delay={i * 0.07} from="bottom">
                  <div className="py-6 border-b border-white/5 last:border-0">
                    <h3 className="text-sm text-white/50 mb-3">{f.question}</h3>
                    <p className="text-xs text-white/25 leading-relaxed">{f.answer}</p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "gallery") && content.gallery && content.gallery.length > 0 && (
          <section id="gallery" className="py-24 border-b border-white/5">
            <AnimateIn>
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-12">Gallery</p>
            </AnimateIn>
            <StaggerChildren stagger={0.05} className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {content.gallery.map((g, i) => (
                <StaggerItem key={i}>
                  <div className="group relative aspect-square overflow-hidden bg-white/5">
                    <img src={g.url} alt={g.caption}
                      className="object-cover w-full h-full opacity-50 group-hover:opacity-80 grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                    {g.caption && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-3 bg-gradient-to-t from-black/60">
                        <p className="text-[9px] tracking-widest uppercase text-white/60">{g.caption}</p>
                      </div>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>
        )}

        {isSectionVisible(visibleSections, "cta") && (
          <section id="contact" className="py-32">
            <AnimateIn>
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-12">Contact</p>
              <h2 className="text-4xl sm:text-5xl font-serif font-light text-white/80 leading-[1.2] tracking-tight text-balance mb-8 max-w-2xl">
                {content.cta.headline}
              </h2>
              <p className="text-sm text-white/30 font-light leading-relaxed mb-10 max-w-sm">{content.cta.subtext}</p>
              <a href="#contact"
                className="inline-flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-white/40 border border-white/10 hover:border-white/30 hover:text-white/70 px-7 py-3.5 transition-all duration-500">
                {content.hero.ctaText} <ArrowRightIcon className="size-3" />
              </a>
            </AnimateIn>
          </section>
        )}
      </main>

      <AnimatePresence>
        {isLightboxOpen && selectedProject !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/97 backdrop-blur-sm flex items-center justify-center" onClick={closeProject}>
            <button onClick={(e) => { e.stopPropagation(); closeProject(); }}
              className="absolute top-6 right-6 text-white/30 hover:text-white/80 transition-colors z-10">
              <XIcon className="size-6" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); goToProject("prev"); }}
              className="absolute left-4 sm:left-8 text-white/20 hover:text-white/60 transition-colors z-10">
              <ChevronLeftIcon className="size-8" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); goToProject("next"); }}
              className="absolute right-4 sm:right-8 text-white/20 hover:text-white/60 transition-colors z-10">
              <ChevronRightIcon className="size-8" />
            </button>
            <motion.div key={selectedProject} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }} className="relative max-w-4xl w-full mx-16 px-4" onClick={(e) => e.stopPropagation()}>
              <div className="grid md:grid-cols-2 gap-14 items-center">
                <div className="aspect-square bg-white/5 flex items-center justify-center">
                  <span className="text-8xl font-serif font-light text-white/10">{selectedProject + 1}</span>
                </div>
                <div className="space-y-5">
                  <p className="text-[9px] tracking-[0.4em] uppercase text-white/20 font-mono">
                    {String(selectedProject + 1).padStart(2, "0")} / {String(content.projects.length).padStart(2, "0")}
                  </p>
                  <h3 className="text-3xl font-serif font-light text-white/80">{content.projects[selectedProject].title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{content.projects[selectedProject].description}</p>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-[10px] tracking-widest uppercase text-white/20 mb-1.5">Outcome</p>
                    <p className="text-xs text-white/35">{content.projects[selectedProject].result}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-white/5 py-7">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[9px] tracking-[0.3em] uppercase text-white/20">
            &copy; {new Date().getFullYear()} {content.name || content.hero.headline}
          </p>
          <div className="flex items-center gap-6">
            <SocialLinks socialLinks={content.socialLinks} />
            <div className="opacity-25 hover:opacity-60 transition-opacity"><ThemeSwitcher /></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
