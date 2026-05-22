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
    <div className="flex items-center gap-5">
      {enabledLinks.map((link) => {
        const Icon = platformIcons[link.platform] || Globe;
        return (
          <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer"
            className="text-stone-400 hover:text-stone-800 dark:hover:text-stone-300 transition-colors" aria-label={link.platform}>
            <Icon className="size-4" />
          </a>
        );
      })}
    </div>
  );
}

export function LandingTemplate({ content }: { content: PortfolioContent }) {
  const visibleSections = mergeVisibleSections(content.visibleSections);

  return (
    <div className="bg-[#f7f3ec] dark:bg-stone-950 text-stone-900 dark:text-stone-100 min-h-screen font-sans">
      <header className="sticky top-0 z-20 bg-[#f7f3ec]/95 dark:bg-stone-950/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a href="#" className="text-sm font-medium text-stone-900 dark:text-stone-100 tracking-tight">
            {content.name || content.hero.headline}
          </a>
          <DesktopNav visibleSections={visibleSections} />
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <MobileMenu visibleSections={visibleSections} />
          </div>
        </div>
      </header>

      <main>

        {isSectionVisible(visibleSections, "hero") && (
          <section className="border-b border-stone-200 dark:border-stone-800">
            <div className="mx-auto max-w-5xl px-6 py-24 md:py-40">
              <AnimateIn duration={0.8} from="bottom">
                <h1 className="text-[clamp(2.8rem,8vw,6.5rem)] font-bold tracking-[-0.03em] leading-[1.05] text-balance text-stone-900 dark:text-stone-100">
                  {content.hero.headline}
                </h1>
              </AnimateIn>
              <AnimateIn delay={0.15}>
                <p className="mt-8 text-lg text-stone-600 dark:text-stone-400 max-w-xl leading-relaxed">
                  {content.hero.subheadline}
                </p>
              </AnimateIn>
              <AnimateIn delay={0.28}>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a href={isSectionVisible(visibleSections, "cta") ? "#contact" : "#"}
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-800 dark:bg-amber-700 text-white text-sm font-medium hover:bg-amber-900 dark:hover:bg-amber-600 transition-colors rounded-none">
                    {content.hero.ctaText}
                    <ArrowRightIcon className="size-4" />
                  </a>
                  {isSectionVisible(visibleSections, "projects") && (
                    <a href="#work" className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors underline underline-offset-4 decoration-stone-300 dark:decoration-stone-700">
                      See my work
                    </a>
                  )}
                </div>
              </AnimateIn>
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "about") && (
          <section id="about" className="border-b border-stone-200 dark:border-stone-800">
            <div className="mx-auto max-w-5xl px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
              <AnimateIn>
                <h2 className="text-xs tracking-[0.25em] uppercase text-amber-800 dark:text-amber-600 mb-6">About</h2>
                <p className="text-xl font-light text-stone-700 dark:text-stone-300 leading-[1.75]">
                  {content.about.paragraph}
                </p>
              </AnimateIn>
              <div className="hidden md:block" />
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "services") && content.services && content.services.length > 0 && (
          <section id="services" className="border-b border-stone-200 dark:border-stone-800">
            <div className="mx-auto max-w-5xl px-6 py-20">
              <AnimateIn>
                <h2 className="text-xs tracking-[0.25em] uppercase text-amber-800 dark:text-amber-600 mb-14">Services</h2>
              </AnimateIn>
              <div className="space-y-0">
                {content.services.map((service, i) => (
                  <AnimateIn key={i} delay={i * 0.07} from="bottom">
                    <div className="py-8 border-b border-stone-200 dark:border-stone-800 last:border-0 grid grid-cols-1 md:grid-cols-[3rem_1fr_1fr] gap-4 md:gap-10 items-start">
                      <span className="text-sm font-bold text-amber-800 dark:text-amber-600">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">{service.title}</h3>
                      <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{service.description}</p>
                    </div>
                  </AnimateIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "projects") && content.projects && content.projects.length > 0 && (
          <section id="work" className="border-b border-stone-200 dark:border-stone-800">
            <div className="mx-auto max-w-5xl px-6 py-20">
              <AnimateIn>
                <h2 className="text-xs tracking-[0.25em] uppercase text-amber-800 dark:text-amber-600 mb-14">Selected Work</h2>
              </AnimateIn>
              <StaggerChildren stagger={0.1} className="space-y-0">
                {content.projects.map((project, i) => (
                  <StaggerItem key={i}>
                    <div className="py-10 border-b border-stone-200 dark:border-stone-800 last:border-0 group">
                      <div className="flex items-start justify-between gap-6 mb-4">
                        <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight group-hover:text-amber-800 dark:group-hover:text-amber-500 transition-colors">
                          {project.title}
                        </h3>
                        <span className="text-xs text-stone-400 mt-2 shrink-0 font-mono">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl mb-4">{project.description}</p>
                      {project.result && (
                        <span className="inline-block text-xs font-medium text-amber-800 dark:text-amber-600 bg-amber-100 dark:bg-amber-950 px-3 py-1.5">
                          {project.result}
                        </span>
                      )}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "products") && content.products && content.products.length > 0 && (
          <section id="products" className="border-b border-stone-200 dark:border-stone-800">
            <div className="mx-auto max-w-5xl px-6 py-20">
              <AnimateIn>
                <h2 className="text-xs tracking-[0.25em] uppercase text-amber-800 dark:text-amber-600 mb-14">Products</h2>
              </AnimateIn>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.products.map((product, i) => (
                  <AnimateIn key={i} delay={i * 0.07}>
                    <div className="bg-[#efe9df] dark:bg-stone-900 overflow-hidden group border border-transparent hover:border-stone-300 dark:hover:border-stone-700 transition-colors">
                      {product.image && (
                        <div className="aspect-[4/3] overflow-hidden">
                          <img src={product.image} alt={product.title}
                            className="object-cover w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-baseline justify-between gap-2 mb-2">
                          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">{product.title}</h3>
                          <span className="text-xs font-bold text-amber-800 dark:text-amber-600 shrink-0">{product.price}</span>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">{product.description}</p>
                        {product.url && (
                          <a href={product.url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 dark:text-amber-600 hover:underline">
                            View <ArrowRightIcon className="size-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </AnimateIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "history") && content.history && content.history.length > 0 && (
          <section id="history" className="border-b border-stone-200 dark:border-stone-800">
            <div className="mx-auto max-w-5xl px-6 py-20">
              <AnimateIn>
                <h2 className="text-xs tracking-[0.25em] uppercase text-amber-800 dark:text-amber-600 mb-14">Experience</h2>
              </AnimateIn>
              <div className="relative pl-6 border-l-2 border-amber-200 dark:border-stone-800 space-y-10">
                {content.history.map((item, i) => (
                  <AnimateIn key={i} delay={i * 0.08} from="bottom">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1.5 size-4 rounded-full bg-[#f7f3ec] dark:bg-stone-950 border-2 border-amber-600 dark:border-amber-700" />
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
                        <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">{item.role}</h3>
                        <span className="text-sm font-medium text-amber-800 dark:text-amber-600">{item.company}</span>
                        <span className="text-xs text-stone-400 font-mono">{item.period}</span>
                      </div>
                      <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl">{item.description}</p>
                    </div>
                  </AnimateIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "testimonials") && content.testimonials && content.testimonials.length > 0 && (
          <section id="testimonials" className="border-b border-stone-200 dark:border-stone-800 bg-[#efe9df] dark:bg-stone-900">
            <div className="mx-auto max-w-5xl px-6 py-20">
              <AnimateIn>
                <h2 className="text-xs tracking-[0.25em] uppercase text-amber-800 dark:text-amber-600 mb-14">Kind Words</h2>
              </AnimateIn>
              <div className="grid md:grid-cols-2 gap-10">
                {content.testimonials.map((t, i) => (
                  <AnimateIn key={i} delay={i * 0.1}>
                    <blockquote className="border-l-2 border-amber-400 dark:border-amber-700 pl-6">
                      <p className="text-lg font-light italic text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <footer className="text-xs text-stone-500 dark:text-stone-500">
                        {t.author}{t.role }
                      </footer>
                    </blockquote>
                  </AnimateIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "faq") && content.faq && content.faq.length > 0 && (
          <section id="faq" className="border-b border-stone-200 dark:border-stone-800">
            <div className="mx-auto max-w-5xl px-6 py-20">
              <AnimateIn>
                <h2 className="text-xs tracking-[0.25em] uppercase text-amber-800 dark:text-amber-600 mb-14">FAQ</h2>
              </AnimateIn>
              <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
                {content.faq.map((f, i) => (
                  <AnimateIn key={i} delay={i * 0.07} from="bottom">
                    <div>
                      <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-3">{f.question}</h3>
                      <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{f.answer}</p>
                    </div>
                  </AnimateIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "gallery") && content.gallery && content.gallery.length > 0 && (
          <section id="gallery" className="border-b border-stone-200 dark:border-stone-800">
            <div className="mx-auto max-w-5xl px-6 py-20">
              <AnimateIn>
                <h2 className="text-xs tracking-[0.25em] uppercase text-amber-800 dark:text-amber-600 mb-14">Gallery</h2>
              </AnimateIn>
              <StaggerChildren stagger={0.06} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {content.gallery.map((g, i) => (
                  <StaggerItem key={i}>
                    <div className="group relative aspect-square overflow-hidden bg-stone-200 dark:bg-stone-800">
                      <img src={g.url} alt={g.caption}
                        className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                      {g.caption && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-stone-900/70 flex items-end p-3">
                          <p className="text-[10px] text-stone-300">{g.caption}</p>
                        </div>
                      )}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "cta") && (
          <section id="contact" className="bg-amber-900 dark:bg-amber-950">
            <div className="mx-auto max-w-5xl px-6 py-24 text-center">
              <AnimateIn>
                <h2 className="text-4xl md:text-5xl font-bold text-amber-50 tracking-tight text-balance mb-6">
                  {content.cta.headline}
                </h2>
                <p className="text-amber-200/70 text-lg font-light mb-10 max-w-xl mx-auto">
                  {content.cta.subtext}
                </p>
                <a href="#contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-amber-50 text-amber-900 text-sm font-bold hover:bg-white transition-colors">
                  {content.hero.ctaText}
                  <ArrowRightIcon className="size-4" />
                </a>
              </AnimateIn>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-stone-200 dark:border-stone-800 py-7">
        <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-400 dark:text-stone-600">
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
