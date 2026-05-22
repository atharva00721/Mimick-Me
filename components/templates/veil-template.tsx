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
            className="text-neutral-700 hover:text-neutral-300 transition-colors duration-500" aria-label={link.platform}>
            <Icon className="size-4" />
          </a>
        );
      })}
    </div>
  );
}

export function VeilTemplate({ content }: { content: PortfolioContent }) {
  const visibleSections = mergeVisibleSections(content.visibleSections);

  return (
    <div className="bg-[#080808] text-neutral-300 min-h-screen font-sans">
      <header className="sticky top-0 z-20 bg-[#080808]/90 backdrop-blur-sm border-b border-[#141414]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <a href="#" className="text-xs tracking-[0.2em] text-neutral-400 hover:text-neutral-200 transition-colors lowercase">
            {content.name || content.hero.headline}
          </a>
          <DesktopNav visibleSections={visibleSections} />
          <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
            <ThemeSwitcher />
            <MobileMenu visibleSections={visibleSections} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">

        {isSectionVisible(visibleSections, "hero") && (
          <section className="pt-32 pb-40">
            <AnimateIn duration={1.2} from="bottom">
              <h1 className="text-[clamp(3rem,11vw,9rem)] font-thin tracking-[-0.04em] leading-[0.95] text-neutral-100 text-balance">
                {content.hero.headline}
              </h1>
            </AnimateIn>
            <AnimateIn delay={0.3} duration={1}>
              <p className="mt-14 text-base text-neutral-600 max-w-md leading-relaxed font-light">
                {content.hero.subheadline}
              </p>
            </AnimateIn>
            <AnimateIn delay={0.5}>
              <a href={isSectionVisible(visibleSections, "cta") ? "#contact" : "#"}
                className="mt-12 inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-neutral-600 hover:text-neutral-300 transition-colors duration-500">
                {content.hero.ctaText}
                <ArrowUpRightIcon className="size-3" />
              </a>
            </AnimateIn>
          </section>
        )}

        {isSectionVisible(visibleSections, "about") && (
          <section id="about" className="py-20 border-t border-[#141414]">
            <AnimateIn>
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
                <span className="text-[9px] tracking-[0.4em] uppercase text-neutral-700 pt-1">About</span>
                <p className="text-lg font-light text-neutral-500 leading-[1.9] max-w-2xl">
                  {content.about.paragraph}
                </p>
              </div>
            </AnimateIn>
          </section>
        )}

        {isSectionVisible(visibleSections, "services") && content.services && content.services.length > 0 && (
          <section id="services" className="py-20 border-t border-[#141414]">
            <AnimateIn>
              <span className="text-[9px] tracking-[0.4em] uppercase text-neutral-700 block mb-12">Services</span>
            </AnimateIn>
            <div className="space-y-0">
              {content.services.map((service, i) => (
                <AnimateIn key={i} delay={i * 0.08}>
                  <div className="py-7 border-b border-[#141414] last:border-0 group flex items-start gap-8">
                    <span className="text-[10px] text-neutral-800 font-mono mt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-sm text-neutral-300 group-hover:text-neutral-100 transition-colors duration-500 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-neutral-700 leading-relaxed font-light">{service.description}</p>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "projects") && content.projects && content.projects.length > 0 && (
          <section id="work" className="py-20 border-t border-[#141414]">
            <AnimateIn>
              <span className="text-[9px] tracking-[0.4em] uppercase text-neutral-700 block mb-12">Work</span>
            </AnimateIn>
            <StaggerChildren stagger={0.08} className="space-y-0">
              {content.projects.map((project, i) => (
                <StaggerItem key={i}>
                  <div className="py-8 border-b border-[#141414] last:border-0 group">
                    <div className="flex items-start justify-between gap-8">
                      <h3 className="text-xl font-light text-neutral-600 group-hover:text-neutral-200 transition-colors duration-700 tracking-tight">
                        {project.title}
                      </h3>
                      <span className="text-[10px] font-mono text-neutral-800 mt-1.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <p className="mt-4 text-sm text-neutral-800 group-hover:text-neutral-600 leading-relaxed font-light max-w-2xl transition-colors duration-700">
                      {project.description}
                    </p>
                    {project.result && (
                      <p className="mt-3 text-xs text-neutral-800 font-light italic">{project.result}</p>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>
        )}

        {isSectionVisible(visibleSections, "products") && content.products && content.products.length > 0 && (
          <section id="products" className="py-20 border-t border-[#141414]">
            <AnimateIn>
              <span className="text-[9px] tracking-[0.4em] uppercase text-neutral-700 block mb-12">Products</span>
            </AnimateIn>
            <div className="grid sm:grid-cols-2 gap-8">
              {content.products.map((product, i) => (
                <AnimateIn key={i} delay={i * 0.08}>
                  <div className="group border border-[#141414] hover:border-neutral-700 transition-colors duration-700">
                    {product.image && (
                      <div className="aspect-[16/9] overflow-hidden bg-neutral-900">
                        <img src={product.image} alt={product.title}
                          className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-baseline justify-between gap-4 mb-3">
                        <h3 className="text-sm text-neutral-400 group-hover:text-neutral-200 transition-colors duration-500">{product.title}</h3>
                        <span className="text-xs font-mono text-neutral-700">{product.price}</span>
                      </div>
                      <p className="text-xs text-neutral-700 leading-relaxed mb-4 font-light">{product.description}</p>
                      {product.url && (
                        <a href={product.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-neutral-700 hover:text-neutral-400 transition-colors duration-500">
                          View <ArrowUpRightIcon className="size-3" />
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
          <section id="history" className="py-20 border-t border-[#141414]">
            <AnimateIn>
              <span className="text-[9px] tracking-[0.4em] uppercase text-neutral-700 block mb-12">Experience</span>
            </AnimateIn>
            <div className="space-y-0">
              {content.history.map((item, i) => (
                <AnimateIn key={i} delay={i * 0.08} from="bottom">
                  <div className="py-6 border-b border-[#141414] last:border-0 grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 sm:gap-12">
                    <div>
                      <span className="text-[10px] text-neutral-700 font-mono block">{item.period}</span>
                      <span className="text-xs text-neutral-600 mt-1 block">{item.company}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-normal text-neutral-400 mb-2">{item.role}</h3>
                      <p className="text-sm text-neutral-700 leading-relaxed font-light">{item.description}</p>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "testimonials") && content.testimonials && content.testimonials.length > 0 && (
          <section id="testimonials" className="py-20 border-t border-[#141414]">
            <AnimateIn>
              <span className="text-[9px] tracking-[0.4em] uppercase text-neutral-700 block mb-16">Testimonials</span>
            </AnimateIn>
            <div className="space-y-16">
              {content.testimonials.map((t, i) => (
                <AnimateIn key={i} delay={i * 0.12}>
                  <blockquote className="max-w-3xl">
                    <p className="text-2xl font-thin text-neutral-600 leading-[1.6] italic tracking-tight mb-6">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <footer className="text-[10px] tracking-[0.3em] uppercase text-neutral-800">
                      {t.author}{t.role && ` — ${t.role}`}
                    </footer>
                  </blockquote>
                </AnimateIn>
              ))}
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "faq") && content.faq && content.faq.length > 0 && (
          <section id="faq" className="py-20 border-t border-[#141414]">
            <AnimateIn>
              <span className="text-[9px] tracking-[0.4em] uppercase text-neutral-700 block mb-12">FAQ</span>
            </AnimateIn>
            <div className="space-y-0">
              {content.faq.map((f, i) => (
                <AnimateIn key={i} delay={i * 0.07} from="bottom">
                  <div className="py-6 border-b border-[#141414] last:border-0">
                    <h3 className="text-sm text-neutral-500 mb-3 font-light">{f.question}</h3>
                    <p className="text-sm text-neutral-700 leading-relaxed font-light">{f.answer}</p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </section>
        )}

        {isSectionVisible(visibleSections, "gallery") && content.gallery && content.gallery.length > 0 && (
          <section id="gallery" className="py-20 border-t border-[#141414]">
            <AnimateIn>
              <span className="text-[9px] tracking-[0.4em] uppercase text-neutral-700 block mb-12">Gallery</span>
            </AnimateIn>
            <StaggerChildren stagger={0.05} className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {content.gallery.map((g, i) => (
                <StaggerItem key={i}>
                  <div className="group relative aspect-square overflow-hidden bg-neutral-900">
                    <img src={g.url} alt={g.caption}
                      className="object-cover w-full h-full grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-70 transition-all duration-1000" />
                    {g.caption && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-3">
                        <p className="text-[9px] tracking-widest uppercase text-neutral-500">{g.caption}</p>
                      </div>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>
        )}

        {isSectionVisible(visibleSections, "cta") && (
          <section id="contact" className="py-32 border-t border-[#141414]">
            <AnimateIn>
              <span className="text-[9px] tracking-[0.4em] uppercase text-neutral-700 block mb-12">Contact</span>
              <h2 className="text-3xl font-thin text-neutral-400 leading-[1.3] tracking-tight mb-8 max-w-xl text-balance">
                {content.cta.headline}
              </h2>
              <p className="text-sm text-neutral-700 font-light leading-relaxed mb-10 max-w-sm">
                {content.cta.subtext}
              </p>
              <a href="#contact"
                className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-neutral-700 hover:text-neutral-400 transition-colors duration-500 border border-[#1a1a1a] hover:border-neutral-700 px-6 py-3">
                {content.hero.ctaText}
                <ArrowUpRightIcon className="size-3" />
              </a>
            </AnimateIn>
          </section>
        )}
      </main>

      <footer className="border-t border-[#141414] py-7">
        <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[9px] tracking-[0.3em] uppercase text-neutral-800">
            &copy; {new Date().getFullYear()} {content.name || content.hero.headline}
          </p>
          <div className="flex items-center gap-6">
            <SocialLinks socialLinks={content.socialLinks} />
            <div className="opacity-30 hover:opacity-60 transition-opacity">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
