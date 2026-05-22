"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { isSectionVisible } from "@/lib/portfolio/section-registry";
import type { PortfolioContent } from "@/lib/validation/portfolio-schema";

import { LogoIcon } from "@/components/logo";

interface MobileMenuProps {
    visibleSections: PortfolioContent["visibleSections"];
}

const MobileNavLink = ({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) => (
    <a
        href={href}
        onClick={onClick}
        className="flex items-center rounded-xl px-4 py-3.5 text-base font-medium text-foreground/80 transition-all hover:bg-muted/80 hover:text-foreground active:scale-[0.98]"
    >
        {children}
    </a>
);

export function MobileMenu({ visibleSections }: MobileMenuProps) {
    const [open, setOpen] = React.useState(false);

    const handleLinkClick = () => {
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open Menu">
                    <MenuIcon className="size-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:max-w-sm flex flex-col gap-0 p-0 border-l border-border/50 bg-background/95 backdrop-blur-xl">
                <SheetHeader className="px-6 py-6 border-b border-border/50 text-left flex flex-row items-center gap-3 space-y-0">
                    <LogoIcon className="h-auto w-auto dark:invert" />
                    <SheetTitle className="text-lg font-bold tracking-tight">Navigation</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-6 px-4">
                    <nav className="flex flex-col gap-1.5">
                        {isSectionVisible(visibleSections, "about") && (
                            <MobileNavLink href="#about" onClick={handleLinkClick}>About</MobileNavLink>
                        )}
                        {isSectionVisible(visibleSections, "services") && (
                            <MobileNavLink href="#services" onClick={handleLinkClick}>Services</MobileNavLink>
                        )}
                        {isSectionVisible(visibleSections, "projects") && (
                            <MobileNavLink href="#work" onClick={handleLinkClick}>Work</MobileNavLink>
                        )}
                        {isSectionVisible(visibleSections, "products") && (
                            <MobileNavLink href="#products" onClick={handleLinkClick}>Products</MobileNavLink>
                        )}
                        {isSectionVisible(visibleSections, "history") && (
                            <MobileNavLink href="#history" onClick={handleLinkClick}>History</MobileNavLink>
                        )}
                        {isSectionVisible(visibleSections, "testimonials") && (
                            <MobileNavLink href="mailto:atharva@gmail.com" onClick={handleLinkClick}>Feedback</MobileNavLink>
                        )}
                        {isSectionVisible(visibleSections, "faq") && (
                            <MobileNavLink href="#faq" onClick={handleLinkClick}>FAQ</MobileNavLink>
                        )}
                        {isSectionVisible(visibleSections, "gallery") && (
                            <MobileNavLink href="#gallery" onClick={handleLinkClick}>Gallery</MobileNavLink>
                        )}
                        {isSectionVisible(visibleSections, "cta") && (
                            <div className="mt-4 pt-4 border-t border-border/50 px-2">
                                <Button asChild className="w-full rounded-xl py-6 text-base font-semibold shadow-sm" onClick={handleLinkClick}>
                                    <a href="#contact">Contact Me</a>
                                </Button>
                            </div>
                        )}
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    );
}
