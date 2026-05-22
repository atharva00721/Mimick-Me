"use client";

import type { PortfolioContent } from "@/lib/validation/portfolio-schema";
import { isSectionVisible, mergeVisibleSections } from "@/lib/portfolio/section-registry";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { MobileMenu } from "@/components/portfolio/mobile-menu";
import { DesktopNav } from "@/components/portfolio/desktop-nav";
import { AnimateIn, StaggerChildren, StaggerItem } from "@/components/animate-in";
import { ArrowUpRightIcon } from "lucide-react";
import { Twitter, Linkedin, Github, Instagram, Youtube, Facebook, Globe } from "lucide-react";

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  website: Globe,
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
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            aria-label={link.platform}
          >
            <Icon className="size-4" />
          </a>
        );
      })}
    </div>
  );
}

function SectionRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <AnimateIn>
      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-10 grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 md:gap-16">
        <div className="pt-0.5">
          <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 dark:text-neutral-600">
            {label}
          </span>
        </div>
        <div>{children}</div>
      </div>
    </AnimateIn>
  );
}

export function MinimalTemplate({ content }: { content: PortfolioContent }) {
  const visibleSections = mergeVisibleSections(content.visibleSections);

  return (
    <div className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 min-h-screen font-sans">
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <a href="#" className="text-sm font-light tracking-widest text-neutral-900 dark:text-neutral-100">
            {content.name || content.hero.headline}
          </a>
          <DesktopNav visibleSections={visibleSections} />
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <MobileMenu visibleSections={visibleSections} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6">
        {isSectionVisible(visibleSections, "hero") && (
          <section className="py-24 md:py-40">
            <AnimateIn duration={1} from="bottom">
              <h1 className="text-[clamp(2.8rem,9vw,7rem)] font-extralight tracking-[-0.03em] leading-[1.05] text-neutral-900 dark:text-neutral-100 text-balance">
                {content.hero.headline}
              </h1>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <p className="mt-10 text-lg font-light text-neutral-500 dark:text-neutral-400 max-w-xl leading-relaxed">
                {content.hero.subheadline}
              </p>
            </AnimateIn>
            <AnimateIn delay={0.35}>
              <a
                href={isSectionVisible(visibleSections, "cta") ? "#contact" : "#"}
                className="mt-10 inline-flex items-center gap-2 text-sm font-light text-neutral-900 dark:text-neutral-100 border-b border-neutral-900 dark:border-neutral-100 pb-0.5 hover:opacity-60 transition-opacity"
              >
                {content.hero.ctaText}
                <ArrowUpRightIcon className="size-3.5" />
              </a>
            </AnimateIn>
          </section>
        )}

        {isSectionVisible(visibleSections, "about") && (
          <div id="about" className="pb-20">
            <SectionRow label="About">
              <p className="text-xl font-light text-neutral-600 dark:text-neutral-400 leading-[1.8] max-w-2xl">
                {content.about.paragraph}
              </p>
            </SectionRow>
          </div>
        )}

        {isSectionVisible(visibleSections, "services") && content.services && content.services.length > 0 && (
          <div id="services" className="pb-20">
            <SectionRow label="Services">
              <div className="space-y-10">
                {content.services.map((service, i) => (
                  <div key={i} className="grid grid-cols-[2rem_1fr] gap-4">
                    <span className="text-[10px] tracking-widest text-neutral-300 dark:text-neutral-700 pt-0.5 font-mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-base font-normal text-neutral-900 dark:text-neutral-100 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionRow>
          </div>
        )}

        {isSectionVisible(visibleSections, "projects") && content.projects && content.projects.length > 0 && (
          <div id="work" className="pb-20">
            <SectionRow label="Work">
              <StaggerChildren stagger={0.06} className="space-y-0">
                {content.projects.map((project, i) => (
                  <StaggerItem key={i}>
                    <div className="py-8 border-b border-neutral-100 dark:border-neutral-900 last:border-0 group">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-base font-normal text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors">
                          {project.title}
                        </h3>
                        <span className="text-[10px] tracking-widest text-neutral-300 dark:text-neutral-700 font-mono mt-0.5 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-light text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-prose">
                        {project.description}
                      </p>
                      {project.result && (
                        <p className="mt-3 text-xs tracking-wide text-neutral-400 dark:text-neutral-600">
                          {project.result}
                        </p>
                      )}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </SectionRow>
          </div>
        )}

        {isSectionVisible(visibleSections, "products") && content.products && content.products.length > 0 && (
          <div id="products" className="pb-20">
            <SectionRow label="Products">
              <div className="space-y-12">
                {content.products.map((product, i) => (
                  <div key={i} className="border-t border-neutral-100 dark:border-neutral-900 pt-8 first:border-0 first:pt-0">
                    {product.image && (
                      <div className="mb-6 aspect-[16/6] overflow-hidden bg-neutral-50 dark:bg-neutral-900">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                        />
                      </div>
                    )}
                    <div className="flex items-baseline justify-between gap-4 mb-3">
                      <h3 className="text-base font-normal text-neutral-900 dark:text-neutral-100">
                        {product.title}
                      </h3>
                      <span className="text-xs font-light text-neutral-400 shrink-0">{product.price}</span>
                    </div>
                    <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
                      {product.description}
                    </p>
                    {product.url && (
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs tracking-wide text-neutral-900 dark:text-neutral-100 border-b border-neutral-300 dark:border-neutral-700 pb-px hover:opacity-60 transition-opacity"
                      >
                        View <ArrowUpRightIcon className="size-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </SectionRow>
          </div>
        )}

        {isSectionVisible(visibleSections, "history") && content.history && content.history.length > 0 && (
          <div id="history" className="pb-20">
            <SectionRow label="Experience">
              <div className="space-y-0">
                {content.history.map((item, i) => (
                  <AnimateIn key={i} delay={i * 0.08} from="bottom">
                    <div className="py-7 border-b border-neutral-100 dark:border-neutral-900 last:border-0 grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3 sm:gap-8">
                      <span className="text-xs font-light text-neutral-400 dark:text-neutral-600 mt-0.5">
                        {item.period}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-baseline gap-2 mb-2">
                          <span className="text-sm font-normal text-neutral-900 dark:text-neutral-100">{item.role}</span>
                          <span className="text-xs font-light text-neutral-400">{item.company}</span>
                        </div>
                        <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </AnimateIn>
                ))}
              </div>
            </SectionRow>
          </div>
        )}

        {isSectionVisible(visibleSections, "testimonials") && content.testimonials && content.testimonials.length > 0 && (
          <div id="testimonials" className="pb-20">
            <SectionRow label="Testimonials">
              <div className="space-y-12">
                {content.testimonials.map((t, i) => (
                  <AnimateIn key={i} delay={i * 0.1}>
                    <blockquote>
                      <p className="text-xl font-light italic text-neutral-600 dark:text-neutral-400 leading-[1.7] mb-6">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <footer className="text-[10px] tracking-[0.25em] uppercase text-neutral-400">
                        {t.author}{t.role && `, ${t.role}`}
                      </footer>
                    </blockquote>
                  </AnimateIn>
                ))}
              </div>
            </SectionRow>
          </div>
        )}

        {isSectionVisible(visibleSections, "faq") && content.faq && content.faq.length > 0 && (
          <div id="faq" className="pb-20">
            <SectionRow label="FAQ">
              <div className="space-y-0">
                {content.faq.map((f, i) => (
                  <AnimateIn key={i} delay={i * 0.07} from="bottom">
                    <div className="py-7 border-b border-neutral-100 dark:border-neutral-900 last:border-0">
                      <h3 className="text-sm font-normal text-neutral-900 dark:text-neutral-100 mb-3">
                        {f.question}
                      </h3>
                      <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        {f.answer}
                      </p>
                    </div>
                  </AnimateIn>
                ))}
              </div>
            </SectionRow>
          </div>
        )}

        {isSectionVisible(visibleSections, "gallery") && content.gallery && content.gallery.length > 0 && (
          <div id="gallery" className="pb-20">
            <SectionRow label="Gallery">
              <StaggerChildren stagger={0.06} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {content.gallery.map((g, i) => (
                  <StaggerItem key={i}>
                    <div className="group relative aspect-square overflow-hidden bg-neutral-50 dark:bg-neutral-900">
                      <img
                        src={g.url}
                        alt={g.caption}
                        className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                      {g.caption && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                          <p className="text-[10px] font-light text-white bg-black/60 px-2 py-1 backdrop-blur-sm">
                            {g.caption}
                          </p>
                        </div>
                      )}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </SectionRow>
          </div>
        )}

        {isSectionVisible(visibleSections, "cta") && (
          <div id="contact" className="pb-32">
            <SectionRow label="Contact">
              <div className="space-y-6">
                <h2 className="text-3xl font-extralight tracking-tight text-neutral-900 dark:text-neutral-100 text-balance">
                  {content.cta.headline}
                </h2>
                <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm">
                  {content.cta.subtext}
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-sm font-light text-neutral-900 dark:text-neutral-100 border-b border-neutral-900 dark:border-neutral-100 pb-0.5 hover:opacity-60 transition-opacity"
                >
                  {content.hero.ctaText}
                  <ArrowUpRightIcon className="size-3.5" />
                </a>
              </div>
            </SectionRow>
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-7">
        <div className="mx-auto max-w-4xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-light text-neutral-400 dark:text-neutral-600">
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
