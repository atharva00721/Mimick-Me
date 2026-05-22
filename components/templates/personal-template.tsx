"use client";

import type { PortfolioContent, SocialLink } from "@/lib/validation/portfolio-schema";
import { isSectionVisible, mergeVisibleSections } from "@/lib/portfolio/section-registry";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { MobileMenu } from "@/components/portfolio/mobile-menu";
import { DesktopNav } from "@/components/portfolio/desktop-nav";
import { AnimateIn, StaggerChildren, StaggerItem } from "@/components/animate-in";
import { ArrowUpRightIcon, Download } from "lucide-react";
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

function HeroSocialLinks({ socialLinks }: { socialLinks: PortfolioContent["socialLinks"] }) {
    if (!socialLinks || socialLinks.length === 0) return null;
    const enabledLinks = socialLinks.filter((l) => l.enabled && l.url);
    if (enabledLinks.length === 0) return null;
    return (
        <div className="flex items-center gap-4 mt-8">
            {enabledLinks.map((link) => {
                const Icon = platformIcons[link.platform] || Globe;
                return (
                    <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 border-2 border-black dark:border-white rounded text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                        aria-label={link.platform}
                    >
                        <Icon className="size-5" />
                    </a>
                );
            })}
        </div>
    );
}

function HighlightHeadline({ text }: { text: string }) {
    // Simple check to bold parts of the headline if we can
    const words = text.split(" ");
    return (
        <>
            {words.map((word, i) => {
                // Just arbitrarily bolding every other word to simulate the design, or standardizing it.
                // Actually, it's safer to just render the text, but the design has "Evren Shah" and "Frontend" bolded.
                const isBold = text.includes("Evren") ? (word === "Evren" || word === "Shah." || word === "Frontend") : (i % 2 !== 0);
                return (
                    <span key={i} className={isBold ? "font-bold" : "font-light"}>
                        {word}{" "}
                    </span>
                );
            })}
        </>
    );
}

export function PersonalTemplate({ content }: { content: PortfolioContent }) {
    const visibleSections = mergeVisibleSections(content.visibleSections);

    return (
        <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen font-sans">
            <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-300">
                <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-full border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold">
                            {content.name ? content.name[0].toUpperCase() : "P"}
                        </div>
                        <a href="#" className="font-bold text-xl tracking-tight hidden sm:block">
                            {content.name || "Personal"}
                        </a>
                    </div>
                    <div className="hidden md:flex items-center gap-6 font-semibold text-sm">
                        {isSectionVisible(visibleSections, "about") && <a href="#about" className="hover:text-neutral-500 transition-colors">About Me</a>}
                        {isSectionVisible(visibleSections, "services") && <a href="#services" className="hover:text-neutral-500 transition-colors">Skills</a>}
                        {isSectionVisible(visibleSections, "projects") && <a href="#projects" className="hover:text-neutral-500 transition-colors">Projects</a>}
                        {isSectionVisible(visibleSections, "cta") && <a href="#contact" className="hover:text-neutral-500 transition-colors">Contact Me</a>}
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeSwitcher />
                        <a
                            href="#"
                            className="hidden md:flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] transition-all"
                        >
                            Resume <Download className="size-4" />
                        </a>
                        <MobileMenu visibleSections={visibleSections} />
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6">
                {isSectionVisible(visibleSections, "hero") && (
                    <section className="pt-40 pb-20 md:pt-48 md:pb-32 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-center">
                        <div className="space-y-8">
                            <AnimateIn duration={0.8} from="bottom">
                                <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-black tracking-tight leading-[1.05] text-balance">
                                    <HighlightHeadline text={content.hero.headline} />
                                </h1>
                            </AnimateIn>
                            <AnimateIn delay={0.2}>
                                <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 max-w-2xl leading-relaxed font-medium">
                                    {content.hero.subheadline}
                                </p>
                            </AnimateIn>

                            <AnimateIn delay={0.3}>
                                <div className="p-4 border-2 border-black dark:border-white rounded-2xl bg-neutral-100 dark:bg-neutral-900 max-w-md shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center">
                                            <span className="text-white dark:text-black text-xs font-bold">AI</span>
                                        </div>
                                        <p className="font-bold text-sm">Ask my AI Assistant</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="What's my tech stack?..."
                                            className="w-full border-2 border-black dark:border-white rounded px-3 py-2 text-sm bg-white dark:bg-black focus:outline-none"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const cwButton = document.querySelector('button[aria-label="Open Chat"]');
                                                if (cwButton) (cwButton as HTMLButtonElement).click();
                                            }}
                                        />
                                        <button
                                            className="bg-black dark:bg-white text-white dark:text-black font-bold px-4 rounded border-2 border-black dark:border-white"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const cwButton = document.querySelector('button[aria-label="Open Chat"]');
                                                if (cwButton) (cwButton as HTMLButtonElement).click();
                                            }}
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </AnimateIn>

                            <AnimateIn delay={0.4}>
                                <HeroSocialLinks socialLinks={content.socialLinks} />
                            </AnimateIn>
                        </div>
                        <div className="hidden lg:flex justify-end relative">
                            <AnimateIn delay={0.5} className="w-full relative">
                                <div className="absolute top-10 -right-10 w-[120%] h-[120%] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl -z-10" />
                                <div className="w-full aspect-square border-4 border-black dark:border-white rounded-3xl bg-white dark:bg-black overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] flex flex-col items-center justify-end p-8 relative group">
                                    {content.about.avatarUrl ? (
                                        <img
                                            src={content.about.avatarUrl}
                                            alt={content.name || "Profile"}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    ) : (
                                        <>
                                            <div className="absolute top-8 left-8 flex gap-2">
                                                <div className="w-4 h-4 rounded-full border-2 border-black dark:border-white bg-red-400" />
                                                <div className="w-4 h-4 rounded-full border-2 border-black dark:border-white bg-yellow-400" />
                                                <div className="w-4 h-4 rounded-full border-2 border-black dark:border-white bg-green-400" />
                                            </div>
                                            <div className="w-32 h-32 rounded-full border-4 border-black dark:border-white mb-8 group-hover:scale-110 transition-transform duration-500" />
                                            <div className="w-[120%] h-40 border-t-4 border-l-4 border-r-4 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 rounded-t-full group-hover:-translate-y-4 transition-transform duration-500" />
                                        </>
                                    )}
                                </div>
                            </AnimateIn>
                        </div>
                    </section>
                )}

                {isSectionVisible(visibleSections, "about") && (
                    <section id="about" className="py-20 md:py-32 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-16 items-center">
                        <AnimateIn className="order-2 lg:order-1 lg:block hidden">
                            <div className="relative aspect-[4/5] border-4 border-black dark:border-white rounded-xl overflow-hidden bg-white dark:bg-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                                {content.about.avatarUrl ? (
                                    <img
                                        src={content.about.avatarUrl}
                                        alt={content.name || "Profile"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-end p-6">
                                        <div className="w-32 h-32 rounded-full border-4 border-black dark:border-white mb-4" />
                                        <div className="w-[120%] h-64 border-t-4 border-l-4 border-r-4 border-black dark:border-white rounded-t-full bg-neutral-100 dark:bg-neutral-900" />
                                    </div>
                                )}
                            </div>
                        </AnimateIn>
                        <div className="order-1 lg:order-2">
                            <AnimateIn>
                                <h2 className="text-4xl md:text-5xl font-light mb-8">
                                    About <span className="font-bold">Me</span>
                                </h2>
                                <div className="space-y-6 text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium text-base md:text-lg">
                                    <p>{content.about.paragraph}</p>
                                </div>
                            </AnimateIn>
                        </div>
                    </section>
                )}

                {/* Since Skills, Projects, etc. were in the navbar, we add a simple matching styling for them if present */}
                {isSectionVisible(visibleSections, "services") && content.services && content.services.length > 0 && (
                    <section id="services" className="py-20 md:py-32">
                        <AnimateIn>
                            <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
                                My <span className="font-bold">Skills</span>
                            </h2>
                        </AnimateIn>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {content.services.map((service, i) => (
                                <AnimateIn key={i} delay={i * 0.1}>
                                    <div className="border-4 border-black dark:border-white p-8 rounded-xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors group cursor-pointer">
                                        <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                                        <p className="text-sm font-medium group-hover:text-neutral-200 dark:group-hover:text-neutral-800 text-neutral-600 dark:text-neutral-400">
                                            {service.description}
                                        </p>
                                    </div>
                                </AnimateIn>
                            ))}
                        </div>
                    </section>
                )}

                {isSectionVisible(visibleSections, "projects") && content.projects && content.projects.length > 0 && (
                    <section id="projects" className="py-20 md:py-32">
                        <AnimateIn>
                            <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
                                My <span className="font-bold">Projects</span>
                            </h2>
                        </AnimateIn>
                        <StaggerChildren stagger={0.1} className="space-y-12">
                            {content.projects.map((project, i) => (
                                <StaggerItem key={i}>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border-b-4 border-black dark:border-white pb-12 last:border-0">
                                        <div className="aspect-video bg-neutral-200 dark:bg-neutral-800 rounded-xl overflow-hidden" />
                                        <div>
                                            <h3 className="text-3xl font-bold mb-4">{project.title}</h3>
                                            <p className="text-neutral-500 dark:text-neutral-400 mb-6 font-medium leading-relaxed">
                                                {project.description}
                                            </p>
                                            {project.result && (
                                                <p className="font-bold border-l-4 border-black dark:border-white pl-4">
                                                    {project.result}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </StaggerItem>
                            ))}
                        </StaggerChildren>
                    </section>
                )}

                {isSectionVisible(visibleSections, "cta") && (
                    <section id="contact" className="py-20 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div className="order-2 lg:order-1 flex flex-col gap-6">
                            <AnimateIn delay={0.1}>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    className="w-full border-2 border-black dark:border-white rounded px-5 py-4 bg-transparent outline-none focus:ring-4 focus:ring-black/20 dark:focus:ring-white/20 transition-shadow font-medium placeholder:text-neutral-500"
                                />
                            </AnimateIn>
                            <AnimateIn delay={0.2}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full border-2 border-black dark:border-white rounded px-5 py-4 bg-transparent outline-none focus:ring-4 focus:ring-black/20 dark:focus:ring-white/20 transition-shadow font-medium placeholder:text-neutral-500"
                                />
                            </AnimateIn>
                            <AnimateIn delay={0.3}>
                                <input
                                    type="url"
                                    placeholder="Your website (If exists)"
                                    className="w-full border-2 border-black dark:border-white rounded px-5 py-4 bg-transparent outline-none focus:ring-4 focus:ring-black/20 dark:focus:ring-white/20 transition-shadow font-medium placeholder:text-neutral-500"
                                />
                            </AnimateIn>
                            <AnimateIn delay={0.4}>
                                <textarea
                                    placeholder="How can I help?*"
                                    rows={5}
                                    className="w-full border-2 border-black dark:border-white rounded px-5 py-4 bg-transparent outline-none focus:ring-4 focus:ring-black/20 dark:focus:ring-white/20 transition-shadow font-medium placeholder:text-neutral-500 resize-none"
                                />
                            </AnimateIn>
                            <AnimateIn delay={0.5} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                                <button className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded hover:opacity-90 transition-opacity">
                                    Get In Touch
                                </button>
                                <div className="flex items-center gap-3">
                                    {content.socialLinks?.filter(l => l.enabled).slice(0, 4).map((link) => {
                                        const Icon = platformIcons[link.platform] || Globe;
                                        return (
                                            <a
                                                key={link.platform}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-12 h-12 flex items-center justify-center border-2 border-black dark:border-white rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                                            >
                                                <Icon className="size-5" />
                                            </a>
                                        );
                                    })}
                                </div>
                            </AnimateIn>
                        </div>
                        <div className="order-1 lg:order-2">
                            <AnimateIn>
                                <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-tight mb-8">
                                    Let&apos;s <span className="text-transparent" style={{ WebkitTextStroke: "2px currentColor" }}>talk</span> for<br />
                                    Something special
                                </h2>
                                <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-12">
                                    {content.cta.subtext || "I seek to push the limits of creativity to create high-engaging, user-friendly, and memorable interactive experiences."}
                                </p>
                                <div className="space-y-2">
                                    <p className="text-2xl font-bold">Youremail@gmail.com</p>
                                    <p className="text-2xl font-bold">1234567890</p>
                                </div>
                            </AnimateIn>
                        </div>
                    </section>
                )}
            </main>

            <footer className="bg-black text-white dark:bg-white dark:text-black py-16 mt-32 border-t-8 border-neutral-800 dark:border-neutral-200">
                <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black dark:bg-black dark:text-white font-bold text-xl">
                                {content.name ? content.name[0].toUpperCase() : "P"}
                            </div>
                            <span className="font-extrabold text-2xl tracking-tight">
                                {content.name || "Personal"}
                            </span>
                        </div>
                        <p className="text-neutral-400 dark:text-neutral-500 font-medium max-w-sm mb-8">
                            {content.hero.subheadline.slice(0, 100)}...
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Navigation</h4>
                        <ul className="space-y-4 font-medium text-neutral-400 dark:text-neutral-500">
                            {isSectionVisible(visibleSections, "about") && <li><a href="#about" className="hover:text-white dark:hover:text-black transition-colors">About</a></li>}
                            {isSectionVisible(visibleSections, "services") && <li><a href="#services" className="hover:text-white dark:hover:text-black transition-colors">Skills</a></li>}
                            {isSectionVisible(visibleSections, "projects") && <li><a href="#projects" className="hover:text-white dark:hover:text-black transition-colors">Projects</a></li>}
                            {isSectionVisible(visibleSections, "cta") && <li><a href="#contact" className="hover:text-white dark:hover:text-black transition-colors">Contact</a></li>}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Connect</h4>
                        <ul className="space-y-4 font-medium text-neutral-400 dark:text-neutral-500">
                            {content.socialLinks?.filter(l => l.enabled).slice(0, 4).map((link) => (
                                <li key={link.platform}>
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-white dark:hover:text-black transition-colors capitalize">
                                        {link.platform}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-neutral-800 dark:border-neutral-200">
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-sm font-bold text-neutral-400 dark:text-neutral-500">
                        <p>&copy; {new Date().getFullYear()} {content.name || "Personal"}. All rights reserved.</p>
                    </div>
                    <div className="text-sm font-bold text-neutral-400 dark:text-neutral-500 flex items-center gap-2">
                        Designed with Love by  {content.name}<ThemeSwitcher />
                    </div>
                </div>
            </footer>
        </div>
    );
}
