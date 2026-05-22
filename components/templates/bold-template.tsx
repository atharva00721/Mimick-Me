"use client";

import type { PortfolioContent } from "@/lib/validation/portfolio-schema";
import { isSectionVisible, mergeVisibleSections } from "@/lib/portfolio/section-registry";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { MobileMenu } from "@/components/portfolio/mobile-menu";
import { DesktopNav } from "@/components/portfolio/desktop-nav";
import { AnimateIn, StaggerChildren, StaggerItem } from "@/components/animate-in";
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

  const enabledLinks = socialLinks.filter(link => link.enabled && link.url);
  if (enabledLinks.length === 0) return null;

  return (
    <div className="flex items-center gap-4">
      {enabledLinks.map((link) => {
        const Icon = platformIcons[link.platform] || Globe;
        return (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 dark:text-zinc-600 hover:text-zinc-50 transition-colors"
            aria-label={link.platform}
          >
            <Icon className="size-5" />
          </a>
        );
      })}
    </div>
  );
}

export function BoldTemplate({ content }: { content: PortfolioContent }) {
  const visibleSections = mergeVisibleSections(content.visibleSections);

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 min-h-screen selection:bg-amber-400 selection:text-zinc-950 font-sans">
      <header className="sticky top-0 z-20 border-b border-zinc-200 dark:border-zinc-900 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <a href="#" className="flex items-center gap-3">
            <span className="inline-flex size-6 items-center justify-center bg-zinc-950 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 font-bold text-xs">
              {(content.name || content.hero.headline)?.charAt(0).toUpperCase()}
            </span>
            <span className="text-sm font-bold tracking-widest uppercase">{content.name || content.hero.headline}</span>
          </a>
          <DesktopNav visibleSections={visibleSections} />
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <MobileMenu visibleSections={visibleSections} />
          </div>
        </div>
      </header>

      {/* Hero */}
      {isSectionVisible(visibleSections, "hero") && (
        <section className="px-6 py-20 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-4xl space-y-8">
              <AnimateIn from="bottom" duration={0.8}>
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.95] uppercase text-zinc-950 dark:text-zinc-50">
                  {content.hero.headline}
                </h1>
              </AnimateIn>
              <AnimateIn from="bottom" delay={0.1}>
                <p className="max-w-2xl text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                  {content.hero.subheadline}
                </p>
              </AnimateIn>
              <AnimateIn delay={0.2} from="none">
                <div className="flex flex-wrap items-center gap-6 pt-8">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-none bg-zinc-950 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 hover:bg-zinc-200 h-14 px-8 text-sm font-bold uppercase tracking-wider"
                  >
                    <a href="#contact">
                      {content.hero.ctaText}
                    </a>
                  </Button>
                </div>
              </AnimateIn>
            </div>
          </div>
        </section>
      )}

      {/* About */}
      {isSectionVisible(visibleSections, "about") && (
        <AnimateIn>
          <section id="about" className="border-t border-zinc-200 dark:border-zinc-900 px-6 py-24">
            <div className="mx-auto max-w-6xl grid md:grid-cols-[1fr_2fr] gap-12 items-start">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                About
              </h2>
              <div className="space-y-6">
                <p className="text-2xl sm:text-3xl text-zinc-800 dark:text-zinc-200 leading-snug font-medium">
                  {content.about.paragraph}
                </p>
              </div>
            </div>
          </section>
        </AnimateIn>
      )}

      {/* Services */}
      {isSectionVisible(visibleSections, "services") && content.services && content.services.length > 0 && (
        <section id="services" className="border-t border-zinc-200 dark:border-zinc-900 px-6 py-24">
          <div className="mx-auto max-w-6xl grid md:grid-cols-[1fr_2fr] gap-12 items-start">
            <AnimateIn from="none">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Services
              </h2>
            </AnimateIn>
            <StaggerChildren stagger={0.1} className="space-y-12">
              {content.services.map((service, i) => (
                <StaggerItem key={i}>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold uppercase tracking-wide text-zinc-950 dark:text-zinc-50">
                      {service.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed max-w-2xl">
                      {service.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>
      )}

      {/* Projects */}
      {isSectionVisible(visibleSections, "projects") && content.projects && content.projects.length > 0 && (
        <section id="work" className="border-t border-zinc-200 dark:border-zinc-900 px-6 py-24">
          <div className="mx-auto max-w-6xl grid md:grid-cols-[1fr_2fr] gap-12 items-start">
            <AnimateIn from="none">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Selected Work
              </h2>
            </AnimateIn>
            <StaggerChildren stagger={0.1} className="space-y-16">
              {content.projects.map((project, i) => (
                <StaggerItem key={i}>
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50">
                      {project.title}
                    </h3>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                      {project.description}
                    </p>
                    <div className="inline-block bg-zinc-900/50 px-4 py-3 border border-zinc-300 dark:border-zinc-800">
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 block mb-1">
                        Outcome
                      </span>
                      <span className="text-zinc-800 dark:text-zinc-200 font-medium">{project.result}</span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>
      )}

      {/* Products */}
      {isSectionVisible(visibleSections, "products") && content.products && content.products.length > 0 && (
        <section id="products" className="border-t border-zinc-200 dark:border-zinc-900 px-6 py-24">
          <div className="mx-auto max-w-6xl grid md:grid-cols-[1fr_2fr] gap-12 items-start">
            <AnimateIn from="none">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Products
              </h2>
            </AnimateIn>
            <StaggerChildren stagger={0.1} className="grid sm:grid-cols-2 gap-8">
              {content.products.map((product, i) => (
                <StaggerItem key={i}>
                  <div className="group border border-zinc-300 dark:border-zinc-800 hover:border-zinc-500 transition-colors overflow-hidden flex flex-col h-full bg-zinc-900/30">
                    {product.image && (
                      <div className="aspect-[4/3] w-full relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-lg font-bold tracking-tight uppercase text-zinc-950 dark:text-zinc-50">{product.title}</h3>
                        <span className="text-sm font-bold bg-amber-400 px-2.5 py-1 text-zinc-50 dark:text-zinc-950 shrink-0">{product.price}</span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 flex-grow">{product.description}</p>
                      {product.url && (
                        <a
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold uppercase tracking-wider inline-flex items-center text-zinc-950 dark:text-zinc-50 hover:text-amber-400 transition-colors mt-auto w-fit"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>
      )}

      {/* History */}
      {isSectionVisible(visibleSections, "history") && content.history && content.history.length > 0 && (
        <section id="history" className="border-t border-zinc-200 dark:border-zinc-900 px-6 py-24">
          <div className="mx-auto max-w-6xl grid md:grid-cols-[1fr_2fr] gap-12 items-start">
            <AnimateIn from="none">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Experience
              </h2>
            </AnimateIn>
            <div className="space-y-16 pl-6 border-l border-zinc-300 dark:border-zinc-800">
              {content.history.map((item, i) => (
                <StaggerItem key={i}>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 size-3 rounded-none bg-white dark:bg-zinc-950 border-2 border-amber-400"></div>
                    <p className="text-sm font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-400 mb-2">{item.period}</p>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50 mb-1">{item.role}</h3>
                    <p className="text-lg font-medium text-amber-400 mb-4">{item.company}</p>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">{item.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {isSectionVisible(visibleSections, "testimonials") && content.testimonials && content.testimonials.length > 0 && (
        <section id="testimonials" className="border-t border-zinc-200 dark:border-zinc-900 px-6 py-24">
          <div className="mx-auto max-w-6xl grid md:grid-cols-[1fr_2fr] gap-12 items-start">
            <AnimateIn from="none">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Praise
              </h2>
            </AnimateIn>
            <StaggerChildren stagger={0.1} className="grid sm:grid-cols-2 gap-8">
              {content.testimonials.map((t, i) => (
                <StaggerItem key={i}>
                  <div className="border border-zinc-300 dark:border-zinc-800 p-8 h-full flex flex-col bg-zinc-900/20">
                    <p className="text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium flex-grow mb-8">&ldquo;{t.quote}&rdquo;</p>
                    <div>
                      <p className="font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-50">{t.author}</p>
                      {t.role && <p className="text-xs font-medium tracking-widest uppercase text-zinc-500 dark:text-zinc-400 mt-1">{t.role}</p>}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>
      )}

      {/* FAQ */}
      {isSectionVisible(visibleSections, "faq") && content.faq && content.faq.length > 0 && (
        <section id="faq" className="border-t border-zinc-200 dark:border-zinc-900 px-6 py-24">
          <div className="mx-auto max-w-6xl grid md:grid-cols-[1fr_2fr] gap-12 items-start">
            <AnimateIn from="none">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                FAQ
              </h2>
            </AnimateIn>
            <div className="space-y-12">
              {content.faq.map((f, i) => (
                <StaggerItem key={i}>
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold uppercase tracking-wide text-zinc-950 dark:text-zinc-50">{f.question}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{f.answer}</p>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {isSectionVisible(visibleSections, "gallery") && content.gallery && content.gallery.length > 0 && (
        <section id="gallery" className="border-t border-zinc-200 dark:border-zinc-900 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <AnimateIn from="none">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-12">
                Gallery
              </h2>
            </AnimateIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {content.gallery.map((g, i) => (
                <StaggerItem key={i}>
                  <div className="group relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <img
                      src={g.url}
                      alt={g.caption}
                      className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    />
                    {g.caption && (
                      <div className="absolute inset-0 bg-zinc-950/80 p-6 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-zinc-950 dark:text-zinc-50 font-bold uppercase tracking-wider text-sm">{g.caption}</p>
                      </div>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {isSectionVisible(visibleSections, "cta") && (
        <AnimateIn duration={0.8}>
          <section id="contact" className="border-t border-zinc-200 dark:border-zinc-900 px-6 py-24 sm:py-32 bg-zinc-900/20">
            <div className="mx-auto max-w-6xl">
              <div className="max-w-3xl space-y-8">
                <h2 className="text-5xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-zinc-950 dark:text-zinc-50">
                  {content.cta.headline}
                </h2>
                <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                  {content.cta.subtext}
                </p>
                <div className="pt-6">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-none bg-zinc-950 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 hover:bg-zinc-200 h-14 px-8 text-sm font-bold uppercase tracking-wider"
                  >
                    <a href="#contact">
                      {content.hero.ctaText}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </AnimateIn>
      )}

      <footer className="border-t border-zinc-200 dark:border-zinc-900 px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
          <span>&copy; {new Date().getFullYear()}</span>
          <div className="flex items-center gap-4">
            <SocialLinks socialLinks={content.socialLinks} />
            <a href="#" className="hover:text-zinc-50 transition-colors">
              Back to top
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
