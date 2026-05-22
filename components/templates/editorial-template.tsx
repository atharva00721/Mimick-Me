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
            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" aria-label={link.platform}>
            <Icon className="size-4" />
          </a>
        );
      })}
    </div>
  );
}

function ChapterHeader({ number, title }: { number: string; title: string }) {
  return (
    <AnimateIn>
      <div className="flex items-center gap-5 mb-14">
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-zinc-400 whitespace-nowrap">{number}</span>
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-zinc-400 whitespace-nowrap">{title}</span>
      </div>
    </AnimateIn>
  );
}

export function EditorialTemplate({ content }: { content: PortfolioContent }) {
  const visibleSections = mergeVisibleSections(content.visibleSections);

  return (
    <div className="bg-[#faf8f4] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen">
      <header className="sticky top-0 z-20 bg-[#faf8f4]/95 dark:bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="font-serif text-base font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
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
          <section className="border-b border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto max-w-6xl px-6 pt-16 pb-24">
              <AnimateIn>
                <div className="flex items-center gap-6 mb-8">
                  <div className="h-px flex-1 max-w-[80px] bg-zinc-400 dark:bg-zinc-600" />
                  <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-zinc-400">Portfolio</span>
                </div>
              </AnimateIn>
              <AnimateIn duration={0.9} from="bottom">
                <h1 className="font-serif text-[clamp(3.5rem,11vw,9rem)] font-bold leading-[0.92] tracking-[-0.03em] text-balance text-zinc-900 dark:text-zinc-100">
                  {content.hero.headline}
                </h1>
              </AnimateIn>
              <div className="mt-12 grid md:grid-cols-2 gap-12 items-end">
                <AnimateIn delay={0.2}>
                  <p className="font-sans text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
                    {content.hero.subheadline}
                  </p>
                </AnimateIn>
                <AnimateIn delay={0.3}>
                  <div className="md:text-right">
                    <a href={isSectionVisible(visibleSections, "cta") ? "#contact" : "#"}
                      className="inline-flex items-center gap-2 font-serif text-base text-zinc-900 dark:text-zinc-100 border-b border-zinc-900 dark:border-zinc-100 pb-0.5 hover:opacity-60 transition-opacity">
                      {content.hero.ctaText}
                      <ArrowRightIcon className="size-4" />
                    </a>
                  </div>
                </AnimateIn>
              </div>
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "about") && (
          <section id="about" className="border-b border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto max-w-6xl px-6 py-20">
              <ChapterHeader number="No. 01" title="About" />
              <AnimateIn>
                <div className="grid md:grid-cols-[3fr_2fr] gap-16">
                  <p className="font-serif text-xl leading-[1.85] text-zinc-700 dark:text-zinc-300 [&::first-letter]:text-[4.5rem] [&::first-letter]:font-bold [&::first-letter]:float-left [&::first-letter]:leading-[0.8] [&::first-letter]:mr-3 [&::first-letter]:mt-2 [&::first-letter]:text-zinc-900 dark:[&::first-letter]:text-zinc-100">
                    {content.about.paragraph}
                  </p>
                  <div className="hidden md:flex items-center justify-center">
                    <div className="font-serif text-[8rem] leading-none text-zinc-100 dark:text-zinc-900 select-none font-bold">
                      &ldquo;
                    </div>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "services") && content.services && content.services.length > 0 && (
          <section id="services" className="border-b border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto max-w-6xl px-6 py-20">
              <ChapterHeader number="No. 02" title="Services" />
              <div className="space-y-0">
                {content.services.map((service, i) => (
                  <AnimateIn key={i} delay={i * 0.07} from="bottom">
                    <div className="py-8 border-b border-zinc-200 dark:border-zinc-800 last:border-0 grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 md:gap-16 group hover:bg-zinc-50 dark:hover:bg-zinc-900 -mx-6 px-6 transition-colors">
                      <h3 className="font-serif text-2xl font-medium text-zinc-900 dark:text-zinc-100 leading-tight group-hover:italic transition-all">
                        {service.title}
                      </h3>
                      <p className="font-sans text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed self-center">
                        {service.description}
                      </p>
                    </div>
                  </AnimateIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "projects") && content.projects && content.projects.length > 0 && (
          <section id="work" className="border-b border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto max-w-6xl px-6 py-20">
              <ChapterHeader number="No. 03" title="Selected Work" />
              <StaggerChildren stagger={0.08} className="space-y-0">
                {content.projects.map((project, i) => (
                  <StaggerItem key={i}>
                    <div className="py-8 border-b border-zinc-200 dark:border-zinc-800 last:border-0 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-4 md:gap-10 group hover:bg-zinc-50 dark:hover:bg-zinc-900 -mx-6 px-6 transition-colors">
                      <span className="font-sans text-[10px] tracking-[0.3em] text-zinc-400 mt-1.5">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <h3 className="font-serif text-2xl font-medium text-zinc-900 dark:text-zinc-100 mb-3 group-hover:italic transition-all">
                          {project.title}
                        </h3>
                        <p className="font-sans text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                          {project.description}
                        </p>
                      </div>
                      {project.result && (
                        <div className="md:text-right mt-2">
                          <span className="font-sans text-xs text-zinc-400 whitespace-nowrap">{project.result}</span>
                        </div>
                      )}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "products") && content.products && content.products.length > 0 && (
          <section id="products" className="border-b border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto max-w-6xl px-6 py-20">
              <ChapterHeader number="No. 04" title="Products" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {content.products.map((product, i) => (
                  <AnimateIn key={i} delay={i * 0.07}>
                    <div className="group border-t-2 border-zinc-900 dark:border-zinc-100 pt-5">
                      {product.image && (
                        <div className="aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-5">
                          <img src={product.image} alt={product.title}
                            className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                        </div>
                      )}
                      <div className="flex items-baseline justify-between gap-3 mb-2">
                        <h3 className="font-serif text-lg font-medium text-zinc-900 dark:text-zinc-100">{product.title}</h3>
                        <span className="font-sans text-xs text-zinc-500 shrink-0">{product.price}</span>
                      </div>
                      <p className="font-sans text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">{product.description}</p>
                      {product.url && (
                        <a href={product.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-sans text-xs text-zinc-900 dark:text-zinc-100 border-b border-zinc-900 dark:border-zinc-100 pb-px hover:opacity-60 transition-opacity">
                          View <ArrowRightIcon className="size-3" />
                        </a>
                      )}
                    </div>
                  </AnimateIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "history") && content.history && content.history.length > 0 && (
          <section id="history" className="border-b border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto max-w-6xl px-6 py-20">
              <ChapterHeader number="No. 05" title="Experience" />
              <div className="space-y-0">
                {content.history.map((item, i) => (
                  <AnimateIn key={i} delay={i * 0.07} from="bottom">
                    <div className="py-7 border-b border-zinc-200 dark:border-zinc-800 last:border-0 grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-16 group hover:bg-zinc-50 dark:hover:bg-zinc-900 -mx-6 px-6 transition-colors">
                      <div>
                        <span className="font-sans text-xs text-zinc-400 block">{item.period}</span>
                        <span className="font-serif text-sm italic text-zinc-600 dark:text-zinc-400 mt-1 block">{item.company}</span>
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-2 group-hover:italic transition-all">{item.role}</h3>
                        <p className="font-sans text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </AnimateIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "testimonials") && content.testimonials && content.testimonials.length > 0 && (
          <section id="testimonials" className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-900 dark:bg-zinc-950">
            <div className="mx-auto max-w-6xl px-6 py-20">
              <AnimateIn>
                <div className="flex items-center gap-5 mb-14">
                  <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-zinc-500 whitespace-nowrap">No. 06</span>
                  <div className="flex-1 h-px bg-zinc-700" />
                  <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-zinc-500 whitespace-nowrap">Testimonials</span>
                </div>
              </AnimateIn>
              <div className="space-y-16">
                {content.testimonials.map((t, i) => (
                  <AnimateIn key={i} delay={i * 0.12}>
                    <div className="grid md:grid-cols-[3fr_1fr] gap-10 items-start">
                      <blockquote>
                        <p className="font-serif text-2xl md:text-3xl font-light italic text-zinc-300 leading-[1.65] mb-6">
                          &ldquo;{t.quote}&rdquo;
                        </p>
                        <footer className="font-sans text-[10px] tracking-[0.25em] uppercase text-zinc-600">
                          {t.author}{t.role && ` — ${t.role}`}
                        </footer>
                      </blockquote>
                    </div>
                  </AnimateIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "faq") && content.faq && content.faq.length > 0 && (
          <section id="faq" className="border-b border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto max-w-6xl px-6 py-20">
              <ChapterHeader number="No. 07" title="FAQ" />
              <div className="space-y-0">
                {content.faq.map((f, i) => (
                  <AnimateIn key={i} delay={i * 0.07} from="bottom">
                    <div className="py-7 border-b border-zinc-200 dark:border-zinc-800 last:border-0 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">
                      <h3 className="font-serif text-xl font-medium text-zinc-900 dark:text-zinc-100 leading-snug">{f.question}</h3>
                      <p className="font-sans text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed self-center">{f.answer}</p>
                    </div>
                  </AnimateIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "gallery") && content.gallery && content.gallery.length > 0 && (
          <section id="gallery" className="border-b border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto max-w-6xl px-6 py-20">
              <ChapterHeader number="No. 08" title="Gallery" />
              <StaggerChildren stagger={0.06} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {content.gallery.map((g, i) => (
                  <StaggerItem key={i}>
                    <div className={("group relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 " + (i % 3 === 0 ? "aspect-[4/5]" : "aspect-square"))}>
                      <img src={g.url} alt={g.caption}
                        className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                      {g.caption && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-zinc-900/80 flex items-end p-4">
                          <p className="font-sans text-xs text-zinc-300 italic">{g.caption}</p>
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
          <section id="contact" className="bg-zinc-900 dark:bg-black">
            <div className="mx-auto max-w-6xl px-6 py-28">
              <AnimateIn>
                <div className="flex items-center gap-5 mb-14">
                  <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-zinc-600 whitespace-nowrap">Final Chapter</span>
                  <div className="flex-1 h-px bg-zinc-700" />
                </div>
                <h2 className="font-serif text-5xl md:text-6xl font-bold text-zinc-100 text-balance leading-[1.05] tracking-tight mb-8 max-w-3xl">
                  {content.cta.headline}
                </h2>
                <p className="font-sans text-base text-zinc-400 leading-relaxed mb-12 max-w-xl">{content.cta.subtext}</p>
                <a href="#contact"
                  className="inline-flex items-center gap-3 font-serif text-base text-zinc-100 border-b border-zinc-600 hover:border-zinc-300 pb-0.5 hover:text-white transition-all">
                  {content.hero.ctaText} <ArrowRightIcon className="size-4" />
                </a>
              </AnimateIn>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-7">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif text-sm text-zinc-400 dark:text-zinc-600">
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
