'use client'
import Link from 'next/link'
import { LogoIcon } from '@/components/logo'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import { ThemeSwitcher } from './theme-switcher'

const menuItems = [
    { name: 'How it works', href: '/how-it-works' },
    { name: 'What we build', href: '/what-we-build' },
    { name: 'Agents', href: '/agents' },
    { name: 'FAQ', href: '/faq' },
    { name: 'About', href: '/about' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none pb-4">
            <div className="flex justify-center pt-4 md:pt-6 pointer-events-auto">
                <nav
                    aria-label="Primary"
                    className={cn(
                        'transition-all duration-500 rounded-full border border-border/50 shadow-2xl relative z-50 flex items-center justify-between',
                        isScrolled
                            ? 'w-[95%] sm:w-[85%] md:w-[75%] bg-background/80 backdrop-blur-2xl py-2 px-3 sm:px-4'
                            : 'w-[95%] sm:w-[90%] md:w-[80%] bg-background/40 backdrop-blur-xl py-3 px-4 sm:px-6'
                    )}>

                    {/* Left: Logo */}
                    <div className="flex shrink-0">
                        <Link
                            href="/"
                            aria-label="home"
                            title="Mimick.me home"
                            onClick={() => setMenuState(false)}
                            className="flex items-center gap-2">
                            <LogoIcon className="h-7 sm:h-8 md:h-9 w-auto text-foreground" />
                            <span className="font-serif text-base sm:text-lg md:text-xl tracking-tight text-foreground hidden sm:inline-block">Mimick.me</span>
                        </Link>
                    </div>

                    {/* Center: Navigation Links */}
                    <div className="hidden lg:flex items-center justify-center flex-1">
                        <ul className="flex items-center gap-6 xl:gap-8">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        title={item.name}
                                        className="text-[13px] font-medium text-foreground/70 hover:text-foreground transition-colors duration-200 tracking-wide uppercase">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
                        <ThemeSwitcher />

                        <Link
                            href="/auth/signin"
                            title="Log in"
                            className="text-[13px] font-medium text-foreground/70 hover:text-foreground transition-colors hidden md:block">
                            Log in
                        </Link>

                        <Button
                            asChild
                            size="sm"
                            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 lg:px-6 h-9 sm:h-10 text-[13px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] border-none hidden sm:flex">
                            <Link href="/auth/signup" title="Get started">
                                Get Started
                            </Link>
                        </Button>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setMenuState(!menuState)}
                            aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                            className="lg:hidden text-foreground p-1 sm:p-2 hover:bg-muted rounded-full transition-colors z-50">
                            {menuState ? <X aria-hidden="true" className="size-5 md:size-6" /> : <Menu aria-hidden="true" className="size-5 md:size-6" />}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-0 z-40 lg:hidden bg-background/98 backdrop-blur-2xl transition-all duration-500 ease-in-out flex flex-col items-center justify-center p-8 pointer-events-auto",
                menuState ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
            )}>
                <ul className="flex flex-col items-center gap-6 sm:gap-8 text-center mt-12 w-full max-w-sm">
                    {menuItems.map((item, index) => (
                        <li key={index} className="w-full">
                            <Link
                                href={item.href}
                                title={item.name}
                                onClick={() => setMenuState(false)}
                                className={cn(
                                    "block w-full text-2xl sm:text-3xl font-serif text-foreground/80 hover:text-foreground transition-all duration-300 transform",
                                    menuState ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                                )}
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className={cn(
                    "flex flex-col w-full max-w-xs gap-4 pt-12 transition-all duration-500 delay-300 transform",
                    menuState ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                )}>
                    <Button asChild variant="outline" className="rounded-full h-12 w-full text-base font-medium">
                        <Link href="/auth/signin" title="Log in" onClick={() => setMenuState(false)}>Log in</Link>
                    </Button>
                    <Button asChild className="rounded-full h-12 w-full text-base font-medium">
                        <Link href="/auth/signup" title="Get started" onClick={() => setMenuState(false)}>Get Started</Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}
