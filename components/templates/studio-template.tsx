"use client";

import { useState } from "react";
import type { PortfolioContent } from "@/lib/validation/portfolio-schema";
import { isSectionVisible, mergeVisibleSections } from "@/lib/portfolio/section-registry";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { MobileMenu } from "@/components/portfolio/mobile-menu";
import { AnimateIn, StaggerChildren, StaggerItem } from "@/components/animate-in";
import { ArrowLeft, ArrowRight, ArrowUp, Twitter, Linkedin, Github, Instagram, Youtube, Facebook, Globe, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter, linkedin: Linkedin, github: Github, instagram: Instagram,
  youtube: Youtube, facebook: Facebook, website: Globe,
};

// Fallback images for dynamic projects
const projectImages = [
  "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80",
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80",
  "https://images.unsplash.com/photo-1613909207039-6b173b755cc1?w=800&q=80",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80",
];

function SocialLinks({ socialLinks, vertical = false }: { socialLinks: PortfolioContent["socialLinks"], vertical?: boolean }) {
  if (!socialLinks || socialLinks.length === 0) return null;
  const enabledLinks = socialLinks.filter((l) => l.enabled && l.url);
  if (enabledLinks.length === 0) return null;
  return (
    <div className={`flex ${vertical ? 'flex-col items-start gap-4' : 'items-center gap-6'}`}>
      {enabledLinks.map((link) => {
        const Icon = platformIcons[link.platform] || Globe;
        return (
          <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-zinc-500 hover:text-[#1a1a1a] dark:text-zinc-400 dark:hover:text-white transition-colors text-sm" aria-label={link.platform}>
            {vertical && <Icon className="w-4 h-4" />}
            <span className="capitalize">{link.platform}</span>
          </a>
        );
      })}
    </div>
  );
}

export function StudioTemplate({ content }: { content: PortfolioContent }) {
  const visibleSections = mergeVisibleSections(content.visibleSections);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="bg-[#fbfaf8] dark:bg-[#0a0a0a] text-[#1a1a1a] dark:text-[#f3f4f6] min-h-screen font-sans selection:bg-[#62483E] selection:text-white transition-colors duration-300 flex flex-col lg:flex-row">
      
      {/* SIDEBAR TOGGLE BUTTON & FLOATING LOGO (DESKTOP) */}
      <div className={`hidden lg:flex fixed top-6 z-[60] items-center gap-4 transition-all duration-300 ${isSidebarOpen ? "left-[16.5rem]" : "left-6"}`}>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-sm text-zinc-600 dark:text-zinc-400 hover:text-[#1a1a1a] dark:hover:text-white hover:scale-105 transition-all duration-300"
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
        </button>

        <div className={`transition-all duration-300 ease-in-out overflow-hidden flex items-center ${isSidebarOpen ? "w-0 opacity-0 pointer-events-none" : "w-auto opacity-100"}`}>
          <Link href="/" className="inline-block py-1.5 bg-[#fbfaf8]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md px-4 rounded-full border border-zinc-200/50 dark:border-white/5 shadow-sm">
            <span className="font-extrabold text-xl tracking-tighter leading-none text-[#1a1a1a] dark:text-white whitespace-nowrap">
              {content.name ? content.name.toUpperCase() : "STUDIO."}
            </span>
          </Link>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen w-72 bg-[#fbfaf8]/90 dark:bg-[#0a0a0a]/90 backdrop-blur-3xl border-r border-zinc-200/50 dark:border-white/5 z-50 p-10 justify-between transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col gap-12">
          {/* Logo */}
          <Link href="/" className="inline-block">
            <span className="font-extrabold text-2xl tracking-tighter leading-none text-[#1a1a1a] dark:text-white">
              {content.name ? content.name.toUpperCase() : "STUDIO."}
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-5 text-sm font-medium">
            {isSectionVisible(visibleSections, "about") && (
              <a href="#about" className="text-zinc-500 hover:text-[#1a1a1a] dark:text-zinc-400 dark:hover:text-white transition-colors">About</a>
            )}
            {isSectionVisible(visibleSections, "projects") && (
              <a href="#projects" className="text-zinc-500 hover:text-[#1a1a1a] dark:text-zinc-400 dark:hover:text-white transition-colors">Work</a>
            )}
            {isSectionVisible(visibleSections, "services") && (
              <a href="#services" className="text-zinc-500 hover:text-[#1a1a1a] dark:text-zinc-400 dark:hover:text-white transition-colors">Services</a>
            )}
            {isSectionVisible(visibleSections, "cta") && (
              <a href="#contact" className="text-zinc-500 hover:text-[#1a1a1a] dark:text-zinc-400 dark:hover:text-white transition-colors">Contact</a>
            )}
          </nav>
        </div>

        <div className="flex flex-col gap-8">
          <SocialLinks socialLinks={content.socialLinks} vertical />
          
          <div className="flex items-center gap-4 border-t border-zinc-200 dark:border-white/10 pt-8">
            <ThemeSwitcher />
            <a href="#contact" className="inline-flex flex-1 items-center justify-center px-4 py-2.5 text-sm font-bold rounded-xl bg-[#62483E] text-white hover:bg-[#4a352d] dark:bg-[#866556] dark:hover:bg-[#a37e6d] transition-colors">
              Hire Me
            </a>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="lg:hidden fixed top-0 w-full z-50 bg-[#fbfaf8]/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-zinc-200/50 dark:border-white/5 transition-colors duration-300">
        <div className="mx-auto flex items-center justify-between px-6 py-5">
          <Link href="/" className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight leading-none text-[#1a1a1a] dark:text-white">
              {content.name ? content.name.toUpperCase() : "STUDIO."}
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <MobileMenu visibleSections={visibleSections} />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className={`flex-1 w-full pt-24 lg:pt-0 transition-all duration-300 ${isSidebarOpen ? "lg:ml-72" : "lg:ml-0"}`}>
        {/* HERO SECTION */}
        {isSectionVisible(visibleSections, "hero") && (
          <section id="hero" className="relative px-6 py-20 md:py-32 lg:py-40 max-w-6xl mx-auto min-h-[90vh] flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-12 items-center w-full">
              <div className="lg:col-span-3 max-w-2xl">
                <AnimateIn>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-white/5 border dark:border-white/5 rounded-full mb-8">
                    <div className="w-2 h-2 rounded-full bg-[#62483E] dark:bg-[#d8b4a3]"></div>
                    <span className="text-xs font-bold tracking-widest text-[#62483E] dark:text-[#d8b4a3] uppercase">
                      Available for new projects
                    </span>
                  </div>
                </AnimateIn>

                <StaggerChildren>
                  <StaggerItem>
                    <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] font-bold tracking-tighter leading-[1.05] text-[#1a1a1a] dark:text-white mb-6">
                      <span className="text-[#62483E] dark:text-[#a68678]">
                        {content.hero.headline.split(' ').slice(0, 2).join(' ')}
                      </span>{' '}
                      {content.hero.headline.split(' ').slice(2).join(' ')}
                    </h1>
                  </StaggerItem>
                  <StaggerItem>
                    <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed font-light max-w-lg">
                      {content.hero.subheadline}
                    </p>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a href="#projects" className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold rounded-xl bg-[#62483E] text-white hover:bg-[#4a352d] dark:bg-[#866556] dark:hover:bg-[#a37e6d] transition-all group">
                        {content.hero.ctaText}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                      <a href="#about" className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold rounded-xl bg-white dark:bg-[#121212] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-white/5 transition-all">
                        My Story
                      </a>
                    </div>
                  </StaggerItem>
                </StaggerChildren>
              </div>

              <div className="lg:col-span-2">
                <AnimateIn delay={0.2}>
                  <div className="relative aspect-square w-full max-w-md mx-auto lg:ml-auto">
                    {/* Shadow block backdrop */}
                    <div className="absolute inset-0 bg-[#f4cbba] dark:bg-[#62483E]/30 rounded-2xl md:rounded-[40px] transform rotate-3 scale-105 opacity-60 dark:opacity-40 blur-xl transition-colors duration-300"></div>
                    {/* Image block */}
                    <div className="absolute inset-0 bg-[#f4cbba] dark:bg-[#1a1412] rounded-2xl md:rounded-[40px] flex items-center justify-center shadow-xl overflow-hidden border border-black/5 dark:border-white/10 transition-colors duration-300">
                      <Image 
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80" 
                        alt="Creative abstract minimal"
                        fill
                        className="object-cover mix-blend-multiply dark:mix-blend-normal opacity-90 transition-opacity"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  </div>
                </AnimateIn>
              </div>
            </div>
          </section>
        )}

        {/* PROJECTS SECTION */}
        {isSectionVisible(visibleSections, "projects") && content.projects.length > 0 && (
          <section id="projects" className="bg-[#f4f4f4] dark:bg-[#121212] py-24 md:py-32 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 gap-6">
                <div>
                  <AnimateIn>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1a1a1a] dark:text-white mb-4">
                      Selected Work
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 font-light text-lg">
                      A collection of projects spanning brand, web, and product design.
                    </p>
                  </AnimateIn>
                </div>
                <div className="flex gap-4">
                  <button className="w-12 h-12 rounded-full border border-zinc-200 dark:border-white/10 flex items-center justify-center hover:bg-white dark:hover:bg-white/5 transition-colors text-zinc-600 dark:text-zinc-400">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button className="w-12 h-12 rounded-full border border-zinc-200 dark:border-white/10 flex items-center justify-center hover:bg-white dark:hover:bg-white/5 transition-colors text-zinc-600 dark:text-zinc-400">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                {content.projects.map((project, i) => (
                  <StaggerItem key={i}>
                    <div className="group cursor-pointer block">
                      <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5">
                        <Image
                          src={projectImages[i % projectImages.length]}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-black/5 dark:bg-white/5 group-hover:opacity-0 transition-opacity"></div>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-[#1a1a1a] dark:text-white group-hover:text-[#62483E] dark:group-hover:text-[#d8b4a3] transition-colors">{project.title}</h3>
                      <p className="text-sm font-mono tracking-wider text-zinc-500 uppercase">{project.description}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>

              <div className="mt-20 text-center">
                <a href="#projects" className="inline-flex items-center text-sm font-bold text-[#1a1a1a] dark:text-white hover:text-[#62483E] dark:hover:text-[#a37e6d] uppercase tracking-widest border-b border-current pb-1 transition-colors">
                  Explore all projects <ArrowRight className="ml-2 w-4 h-4 inline" />
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ABOUT SECTION */}
        {isSectionVisible(visibleSections, "about") && (
          <section id="about" className="py-24 md:py-32 bg-[#eef0f4]/50 dark:bg-[#0a0a0a] transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 xl:gap-24 items-center">
                
                {/* Left Side: Stats/Images Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Top Left: Image */}
                  <AnimateIn delay={0.1} className="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-3xl overflow-hidden relative border border-black/5 dark:border-white/5">
                    <Image
                      src="https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=800&q=80"
                      alt="Minimal plant setup"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </AnimateIn>

                  {/* Top Right: Stats */}
                  <AnimateIn delay={0.2} className="aspect-square bg-[#1f2127] dark:bg-[#1a1b1f] rounded-3xl flex items-center justify-center text-white border border-transparent dark:border-white/5">
                    <div className="text-center">
                      <div className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2">50+</div>
                      <div className="text-xs font-mono tracking-widest text-[#a8b1c4]">Projects</div>
                    </div>
                  </AnimateIn>

                  {/* Bottom Left: Text */}
                  <AnimateIn delay={0.3} className="aspect-square bg-transparent rounded-3xl flex items-center justify-center">
                    <div className="text-5xl md:text-6xl font-extrabold text-[#62483E] dark:text-[#a68678] text-center leading-none">
                      8+<br/>
                      <span className="text-3xl tracking-tight">yrs</span>
                    </div>
                  </AnimateIn>

                  {/* Bottom Right: Image */}
                  <AnimateIn delay={0.4} className="aspect-square bg-zinc-200/50 dark:bg-zinc-800/80 rounded-3xl overflow-hidden relative border border-transparent dark:border-white/5">
                    <Image
                      src="https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?w=800&q=80"
                      alt="Minimal desk item"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </AnimateIn>
                </div>

                {/* Right Side: Text area */}
                <div>
                  <AnimateIn>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1a1a1a] dark:text-white mb-8 leading-[1.1]">
                      I design brands, websites, and interfaces for bold thinkers.
                    </h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-12 font-light leading-relaxed">
                      {content.about.paragraph}
                    </p>

                    <div className="grid grid-cols-2 gap-8">
                      {isSectionVisible(visibleSections, "services") && content.services.length > 0 && (
                        <div>
                          <h4 className="font-bold text-[#1a1a1a] dark:text-white mb-4">Capabilities</h4>
                          <ul className="space-y-3">
                            {content.services.slice(0, 4).map((service, i) => (
                              <li key={i} className="text-sm font-light text-zinc-500 dark:text-zinc-400">
                                {service.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-[#1a1a1a] dark:text-white mb-4">Philosophy</h4>
                        <p className="text-sm font-light text-zinc-500 dark:text-zinc-400">
                          Minimalism is not about nothing, it&apos;s about the right amount of everything.
                        </p>
                      </div>
                    </div>
                  </AnimateIn>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* CTA SECTION */}
        {isSectionVisible(visibleSections, "cta") && (
          <section id="contact" className="py-24 md:py-32 px-6">
            <div className="max-w-6xl mx-auto">
              <AnimateIn>
                <div className="bg-[#62483E] dark:bg-[#342721] rounded-[2rem] md:rounded-[3rem] px-8 py-16 md:p-24 relative overflow-hidden text-white shadow-2xl transition-colors duration-300">
                  {/* Decorative shape */}
                  <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 relative z-10">
                    <div>
                      <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-none">
                      Let&apos;s build<br />something<br /><span className="font-serif italic font-medium opacity-90">iconic.</span>
                      </h2>
                      <p className="text-lg md:text-xl text-[#d4c3bd] dark:text-[#c4a99d] max-w-sm font-light">
                        {content.cta.subtext}
                      </p>
                    </div>

                    <div className="flex flex-col justify-end xl:items-end">
                      <div className="w-full max-w-sm">
                        <div className="bg-white dark:bg-[#1a1a1a] text-zinc-900 dark:text-white rounded-full px-6 py-5 mb-12 shadow-lg border border-transparent dark:border-white/10 transition-colors">
                          <a href={`mailto:hello@${content.name?.toLowerCase().replace(/\s/g, "") || "creativestudio"}.com`} className="font-medium flex items-center justify-between group">
                            <span className="truncate">hello@{content.name?.toLowerCase().replace(/\s/g, "") || "creativestudio"}.com</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0 ml-4" />
                          </a>
                        </div>

                        {/* Note: In Sidebar Mode, Socials are highly visible in the sidebar, but keeping them here for completeness/mobile */}
                        <div className="xl:hidden">
                           {content.socialLinks && content.socialLinks.length > 0 && (
                            <SocialLinks socialLinks={content.socialLinks} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="border-t border-zinc-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a] py-10 px-6 transition-colors duration-300 mt-auto">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="font-bold tracking-tight text-xl text-[#1a1a1a] dark:text-white lg:hidden">
              {content.name ? content.name.toUpperCase() : "STUDIO."}
            </div>
            
            <div className="text-sm font-light text-zinc-400 dark:text-zinc-500 text-center md:text-left">
              &copy; {new Date().getFullYear()} {content.name || "Creative Studio"}. Made with intention.
            </div>

            <div className="flex items-center gap-6 text-sm font-light text-zinc-400 dark:text-zinc-500">
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="p-2 border border-zinc-200 dark:border-white/10 rounded-full hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors text-zinc-600 dark:text-zinc-400">
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
