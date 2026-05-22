"use client";

import type { PortfolioContent } from "@/lib/validation/portfolio-schema";
import { isSectionVisible, mergeVisibleSections } from "@/lib/portfolio/section-registry";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { MobileMenu } from "@/components/portfolio/mobile-menu";
import { DesktopNav } from "@/components/portfolio/desktop-nav";
import { AnimateIn, StaggerChildren, StaggerItem } from "@/components/animate-in";
import { ArrowRightIcon } from "lucide-react";
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

function MonoLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600">
      {children}
    </span>
  );
}

export function ModernTemplate({ content }: { content: PortfolioContent }) {
  const visibleSections = mergeVisibleSections(content.visibleSections);

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen font-sans">
      <header className="sticky top-0 z-20 bg-zinc-50/95 dark:bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-3">
            <span className="font-mono text-xs text-blue-600 dark:text-blue-400 select-none">01/</span>
            <span className="text-sm font-medium tracking-tight">{content.name || content.hero.headline}</span>
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
            <AnimateIn duration={0.7} from="bottom">
              <MonoLabel>Introduction</MonoLabel>
              <h1 className="mt-6 text-[clamp(2.5rem,7vw,6rem)]  tracking-[-0.04em] leading-[1.0] text-balance text-zinc-900 dark:text-zinc-100">
                {content.hero.headline}
              </h1>
            </AnimateIn>
            <AnimateIn delay={0.15}>
              <p className="mt-8 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
                {content.hero.subheadline}
              </p>
            </AnimateIn>
            <AnimateIn delay={0.25}>
              <a href={isSectionVisible(visibleSections, "cta") ? "#contact" : "#"}
                className="mt-10 inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors">
                {content.hero.ctaText}
                <ArrowRightIcon className="size-4" />
              </a>
            </AnimateIn>
          </section>
        )}

        {isSectionVisible(visibleSections, "about") && (
          <section id="about" className="py-20 border-b border-zinc-200 dark:border-zinc-800">
            <AnimateIn>
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
                <MonoLabel>02 — About</MonoLabel>
                <p className="text-xl font-light text-zinc-600 dark:text-zinc-400 leading-[1.75] max-w-3xl">
                  {content.about.paragraph}
                </p>
              </div>
            </AnimateIn>
          </section>
        )}

        {isSectionVisible(visibleSections, "services") && content.services && content.services.length > 0 && (
          <section id="services" className="py-20 border-b border-zinc-200 dark:border-zinc-800">
            <AnimateIn>
              <MonoLabel>03 — Services</MonoLabel>
            </AnimateIn>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-px">
              {content.services.map((service, i) => (
                <AnimateIn key={i} delay={i * 0.06}>
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-8">
                    <span className="font-mono text-blue-600 dark:text-blue-400 text-xs mb-4 block">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-base  text-zinc-900 dark:text-zinc-100 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "projects") && content.projects && content.projects.length > 0 && (
          <section id="work" className="py-20 border-b border-zinc-200 dark:border-zinc-800">
            <AnimateIn>
              <MonoLabel>04 — Selected Work</MonoLabel>
            </AnimateIn>
            <StaggerChildren stagger={0.07} className="mt-10 space-y-0">
              {content.projects.map((project, i) => (
                <StaggerItem key={i}>
                  <div className="py-8 border-b border-zinc-100 dark:border-zinc-900 last:border-0 group grid grid-cols-1 md:grid-cols-[3rem_1fr_auto] gap-4 md:gap-8 items-start">
                    <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 mt-1">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-lg  text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">{project.description}</p>
                    </div>
                    {project.result && (
                      <span className="text-xs font-mono text-zinc-400 dark:text-zinc-600 whitespace-nowrap mt-1">{project.result}</span>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>
        )}

        {isSectionVisible(visibleSections, "products") && content.products && content.products.length > 0 && (
          <section id="products" className="py-20 border-b border-zinc-200 dark:border-zinc-800">
            <AnimateIn>
              <MonoLabel>05 — Products</MonoLabel>
            </AnimateIn>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.products.map((product, i) => (
                <AnimateIn key={i} delay={i * 0.06}>
                  <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 group">
                    {product.image && (
                      <div className="aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        <img src={product.image} alt={product.title}
                          className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-sm  text-zinc-900 dark:text-zinc-100">{product.title}</h3>
                        <span className="font-mono text-xs text-blue-600 dark:text-blue-400 shrink-0">{product.price}</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">{product.description}</p>
                      {product.url && (
                        <a href={product.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          VIEW <ArrowRightIcon className="size-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "history") && content.history && content.history.length > 0 && (
          <section id="history" className="py-20 border-b border-zinc-200 dark:border-zinc-800">
            <AnimateIn>
              <MonoLabel>06 — Experience</MonoLabel>
            </AnimateIn>
            <div className="mt-10 space-y-0">
              {content.history.map((item, i) => (
                <AnimateIn key={i} delay={i * 0.07} from="bottom">
                  <div className="py-6 border-b border-zinc-100 dark:border-zinc-900 last:border-0 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 md:gap-12">
                    <div className="space-y-1">
                      <span className="font-mono text-xs text-zinc-400 dark:text-zinc-600 block">{item.period}</span>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400 block">{item.company}</span>
                    </div>
                    <div>
                      <h3 className="text-base  text-zinc-900 dark:text-zinc-100 mb-2">{item.role}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "testimonials") && content.testimonials && content.testimonials.length > 0 && (
          <section id="testimonials" className="py-20 border-b border-zinc-200 dark:border-zinc-800">
            <AnimateIn>
              <MonoLabel>07 — Testimonials</MonoLabel>
            </AnimateIn>
            <StaggerChildren stagger={0.1} className="mt-10 grid md:grid-cols-2 gap-px bg-zinc-200 dark:bg-zinc-800">
              {content.testimonials.map((t, i) => (
                <StaggerItem key={i}>
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-8 h-full flex flex-col">
                    <p className="text-base font-light text-zinc-600 dark:text-zinc-400 leading-relaxed flex-grow mb-6">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                      <p className="text-sm  text-zinc-900 dark:text-zinc-100">{t.author}</p>
                      {t.role && <p className="font-mono text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">{t.role}</p>}
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
              <MonoLabel>08 — FAQ</MonoLabel>
            </AnimateIn>
            <div className="mt-10 grid md:grid-cols-2 gap-8">
              {content.faq.map((f, i) => (
                <AnimateIn key={i} delay={i * 0.07} from="bottom">
                  <div className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <h3 className="text-sm  text-zinc-900 dark:text-zinc-100 mb-3 flex gap-3">
                      <span className="font-mono text-blue-600 dark:text-blue-400 shrink-0">Q.</span>
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
              <MonoLabel>09 — Gallery</MonoLabel>
            </AnimateIn>
            <StaggerChildren stagger={0.06} className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-zinc-200 dark:bg-zinc-800">
              {content.gallery.map((g, i) => (
                <StaggerItem key={i}>
                  <div className="group relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <img src={g.url} alt={g.caption}
                      className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                    {g.caption && (
                      <div className="absolute inset-0 bg-zinc-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3">
                        <p className="font-mono text-[10px] text-zinc-300 text-center">{g.caption}</p>
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
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
                <MonoLabel>10 — Contact</MonoLabel>
                <div className="space-y-6 max-w-2xl">
                  <h2 className="text-4xl  tracking-tight text-zinc-900 dark:text-zinc-100 text-balance">
                    {content.cta.headline}
                  </h2>
                  <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">{content.cta.subtext}</p>
                  <a href="#contact"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors">
                    {content.hero.ctaText}
                    <ArrowRightIcon className="size-4" />
                  </a>
                </div>
              </div>
            </AnimateIn>
          </section>
        )}
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-zinc-400 dark:text-zinc-600 tracking-widest uppercase">
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
