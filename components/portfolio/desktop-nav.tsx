"use client";

import * as React from "react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { isSectionVisible } from "@/lib/portfolio/section-registry";
import type { PortfolioContent } from "@/lib/validation/portfolio-schema";

interface DesktopNavProps {
    visibleSections: PortfolioContent["visibleSections"];
}

export function DesktopNav({ visibleSections }: DesktopNavProps) {
    return (
        <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
                {isSectionVisible(visibleSections, "about") && (
                    <NavigationMenuItem>
                        <NavigationMenuLink href="#about" className={navigationMenuTriggerStyle()}>
                            About
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                )}
                {isSectionVisible(visibleSections, "services") && (
                    <NavigationMenuItem>
                        <NavigationMenuLink href="#services" className={navigationMenuTriggerStyle()}>
                            Services
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                )}
                {isSectionVisible(visibleSections, "projects") && (
                    <NavigationMenuItem>
                        <NavigationMenuLink href="#work" className={navigationMenuTriggerStyle()}>
                            Work
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                )}
                {isSectionVisible(visibleSections, "products") && (
                    <NavigationMenuItem>
                        <NavigationMenuLink href="#products" className={navigationMenuTriggerStyle()}>
                            Products
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                )}
                {isSectionVisible(visibleSections, "history") && (
                    <NavigationMenuItem>
                        <NavigationMenuLink href="#history" className={navigationMenuTriggerStyle()}>
                            History
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                )}
                {isSectionVisible(visibleSections, "testimonials") && (
                    <NavigationMenuItem>
                        <NavigationMenuLink href="mailto:atharva@gmail.com" className={navigationMenuTriggerStyle()}>
                            Feedback
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                )}
                {isSectionVisible(visibleSections, "faq") && (
                    <NavigationMenuItem>
                        <NavigationMenuLink href="#faq" className={navigationMenuTriggerStyle()}>
                            FAQ
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                )}
                {isSectionVisible(visibleSections, "gallery") && (
                    <NavigationMenuItem>
                        <NavigationMenuLink href="#gallery" className={navigationMenuTriggerStyle()}>
                            Gallery
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                )}
                {isSectionVisible(visibleSections, "cta") && (
                    <NavigationMenuItem>
                        <NavigationMenuLink href="#contact" className={navigationMenuTriggerStyle()}>
                            Contact
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                )}
            </NavigationMenuList>
        </NavigationMenu>
    );
}
